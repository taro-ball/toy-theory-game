const totalBoxes = 16;
let miniBoxSize = 0;
let positionXoffset = 0;
let positionYoffset = 0;
let riddleSelect;
let showIndexes = true;
let logDiv;
let hintNo = 0;
let paletteNo = 0;
let drawArrows = 1;

function setup() {
    document.addEventListener('contextmenu', event => event.preventDefault());
    frameRate(5);
    applyPalette();
    logDiv = select('#ttLog');

    let canvasContainer = document.getElementById('canvasContainer');

    miniBoxSize = canvasContainer.offsetWidth / 48;
    let containerWidth = miniBoxSize * 46;
    let containerHeight = miniBoxSize * 34;//canvasContainer.offsetHeight;

    positionXoffset = miniBoxSize;
    positionYoffset = miniBoxSize;

    menuRowHeight = miniBoxSize * 1.5;

    let myCanvas = createCanvas(containerWidth, containerHeight);

    //let myCanvas = createCanvas(miniBoxSize * 46, miniBoxSize * 34);
    //let myCanvas = createCanvas();
    myCanvas.parent('canvasContainer');
    myCanvas.color = "red";

    let row1 = select('#row1');
    let row2 = select('#row2');

    riddleSelect = createSelect();
    riddleSelect.parent(row1);
    //riddleSelect.position(windowWidth / 2 + 90, 130);
    for (let i = 0; i < riddles.length; i++) {
        riddleSelect.option('Riddle ' + (i + 1), i);
    }
    riddleSelect.changed(redrawSketch);

    let resetButton = createButton('Reset');
    resetButton.parent(row1);
    resetButton.mousePressed(redrawSketch);

    let isMapApplied = false;
    let applyMapButton = createButton('Apply Map');
    applyMapButton.parent(row1);
    //applyMapButton.position(windowWidth / 2 + 90, 105);
    applyMapButton.mousePressed(() => {
        let map = getMapFromGrid(workingGrid);
        if (isMapApplied) {
            map = inverseMapping(map);
            applyMapButton.html('Apply Map'); // Change button text back to 'Apply Map'
        } else {
            applyMapButton.html('Undo Map'); // Change button text to 'Undo Map'
        }
        for (let i = 0; i < sourceGrids.length; i++) {
            try {
                applyMapping(sourceGrids[i], map);
            } catch (error) {
                alert('Invalid mapping. Please enter a valid map.');
                return;
            }
        }
        isMapApplied = !isMapApplied;
        redraw();
    });

    let arrowsButton = createButton('Toggle Arrows');
    arrowsButton.parent(row2);
    arrowsButton.mousePressed(() => {
        drawArrows = !drawArrows;
        redraw();
    });

    let hintButton = createButton('Hint');
    hintButton.parent(row1);
    hintButton.mousePressed(() => { gameLog(`<b>Hint:</b> ${riddleHint()}`) });

    let paletteButton = createButton('Color');
    paletteButton.parent(row2);
    paletteButton.mousePressed(() => {
        gameLog(`Applying palette "${gamePalettes[paletteNo].name}"...`);
        applyPalette();
    });


    let helpButton = createButton('<b>Help</b>');
    helpButton.parent(row1);
    helpButton.mousePressed(() => { gameLog(helpMessage[0]) });

    // Draw initial board
    gameLog(greetMessage);
    redrawSketch();
}

class Box {
    constructor(x, y, boxSize, value, index, isInteractive, boxType) {
        this.x = x;
        this.y = y;
        this.boxSize = boxSize;
        this.value = value;
        this.initIndex = index;
        this.currIndex = index;
        this.isInteractive = isInteractive;
        this.flash = false;
        this.isLocked = false;
        this.boxType = boxType;
    }

    drawBox() {
        stroke(this.flash ? colorTXT : colorStroke);
        strokeWeight(this.flash ? miniBoxSize / 2 : miniBoxSize / 16);
        fill(this.value === 1 ? (this.boxType === 1 ? color2 : color1) : color0);
        rect(this.x, this.y, this.boxSize, this.boxSize);
    }

    drawIndex() {
        fill(colorTXT);
        textAlign(CENTER, CENTER);
        textSize(this.boxSize / 2)
        noStroke(); // Removes stroke from text
        let indexTxt = this.isLocked ? '[' + this.initIndex + ']' : this.initIndex;
        text(indexTxt, this.x + this.boxSize / 2, this.y + this.boxSize / 2);
        stroke('black');
    }

    drawSelected() {
        if (!this.isLocked) {
            fill(colorSelect);
            noStroke();
            rect(this.x, this.y, this.boxSize, this.boxSize);
        }
    }

    drawArrow() {
        //let arrowDistance = 6; // Distance between arrows
        let xoffset = miniBoxSize;
        let yoffset = this.boxSize * 4.3;
        //gameLog(yoffset);
        if (this.initIndex !== this.currIndex && drawArrows) {
            const startX = workingGrid[this.currIndex].getPosition().x + this.boxSize / 2;
            const startY = workingGrid[this.currIndex].getPosition().y + this.boxSize / 2;
            const endX = this.x + this.boxSize / 2;
            const endY = this.y + this.boxSize / 2;

            // Calculate the angle
            const arrowAngle = Math.atan2(endY - startY, endX - startX);

            // Calculate arrow head points
            const arrowLength = miniBoxSize;
            const arrowWidth = miniBoxSize / 3;
            const arrowHeadX1 = endX - arrowLength * Math.cos(arrowAngle) + arrowWidth * Math.sin(arrowAngle);
            const arrowHeadY1 = endY - arrowLength * Math.sin(arrowAngle) - arrowWidth * Math.cos(arrowAngle);
            const arrowHeadX2 = endX - arrowLength * Math.cos(arrowAngle) - arrowWidth * Math.sin(arrowAngle);
            const arrowHeadY2 = endY - arrowLength * Math.sin(arrowAngle) + arrowWidth * Math.cos(arrowAngle);

            stroke(color1);
            strokeWeight(miniBoxSize / 8);
            line(startX, startY, endX, endY);
            line(arrowHeadX1, arrowHeadY1, endX, endY);
            line(arrowHeadX2, arrowHeadY2, endX, endY);
            noStroke();
        }
    }



    draw() {
        this.drawBox();
        if (this.isInteractive) {
            if (selected !== null && this.initIndex === selected.initIndex && !this.isLocked) { // Check for locked status here
                this.drawSelected();
            }
            if (showIndexes) {
                this.drawIndex()
            };
            //this.drawArrow();
        }

    }

    setPosition(x, y, index) {
        this.x = x;
        this.y = y;
        this.currIndex = index;
    }

    getPosition() {
        return { "x": this.x, "y": this.y };
    }

    swap(other) {
        if (this.isLocked || other.isLocked) { // If either box is locked, prevent swap
            return;
        }

        [this.x, other.x] = [other.x, this.x];
        [this.y, other.y] = [other.y, this.y];
        [this.currIndex, other.currIndex] = [other.currIndex, this.currIndex];

        this.flash = true;
        other.flash = true;


        //mapInput.value(getMapFromGrid(workingGrid).join(','));

        setTimeout(() => {
            this.flash = false;
            other.flash = false;

            redraw();
        }, 100);
    }

    contains(mouseX, mouseY) {
        return (mouseX > this.x && mouseX < this.x + this.boxSize && mouseY > this.y && mouseY < this.y + this.boxSize);
    }

    toggleLock() {
        this.isLocked = !this.isLocked; // Toggle the lock status
    }
}


function redrawSketch() {
    bgcolor1 = 220;

    riddleIndex = parseInt(riddleSelect.value());
    myPatterns = riddles[riddleIndex].boardPatterns;
    currentTargetMap = riddles[riddleIndex].targetMap;

    sourceGrids = [];
    targetGrids = [];
    workingGrid = [];
    selected = null;
    hintNo = 0;
    lockedStrokeW = 6;

    for (let i = 0; i < myPatterns.length; i++) {
        let pattern = myPatterns[i].map(num => num); // Copy each pattern into a separate array
        let boxSize = miniBoxSize;
        let positionX = positionXoffset + i * miniBoxSize * 5;
        let positionY = positionYoffset;
        sourceGrids.push(createGrid(boxSize, false, positionX, positionY, pattern, 0));
    }

    for (let i = 0; i < myPatterns.length; i++) {
        let pattern = myPatterns[i].map(num => num); // Copy each pattern into a separate array
        let boxSize = miniBoxSize;
        let positionX = positionXoffset + i * miniBoxSize * 5;
        let positionY = positionYoffset + miniBoxSize * 5.5;
        targetGrids.push(createGrid(boxSize, false, positionX, positionY, pattern, 1));
    }

    for (let i = 0; i < targetGrids.length; i++) {
        try {
            applyMapping(targetGrids[i], currentTargetMap);
        } catch (error) {
            alert('Invalid mapping. Please enter a valid map.');
            return;
        }
    }

    workingGrid = createGrid(miniBoxSize * 4, true, positionXoffset, positionYoffset + miniBoxSize * 16, Array(totalBoxes).fill(0), 0);
    //mapInput.value(getMapFromGrid(workingGrid).join(','));
    gameLog(`<hr><b>Riddle</b> "${riddles[riddleIndex].name}" by ${riddles[riddleIndex].author} <b>loaded!</b>`)
    redraw();
}


function createGrid(boxSize, isInteractive, topLeftX, topLeftY, pattern, boxType) {
    const grid = [];

    for (let i = 0; i < totalBoxes; i++) {
        const x = topLeftX + (i % 4) * boxSize;
        const y = topLeftY + Math.floor(i / 4) * boxSize;
        const value = pattern[i];
        grid.push(new Box(x, y, boxSize, value, i, isInteractive, boxType));
    }

    return grid;
}

function getMapFromGrid(grid) {
    let map = new Array(grid.length);
    for (let i = 0; i < grid.length; i++) {
        map[grid[i].currIndex] = i;
    }
    return map;
}

function applyMapping(grid, map) {
    // Ensure map is a permutation of numbers from 0 to 15
    const mapCheck = [...map].sort((a, b) => a - b);
    for (let i = 0; i < mapCheck.length; i++) {
        if (mapCheck[i] !== i) {
            throw new Error('Invalid mapping');
        }
    }

    // Store the original positions
    let originalPositions = grid.map(box => ({ x: box.x, y: box.y }));

    for (let i = 0; i < totalBoxes; i++) {
        const mappedIndex = map[i];
        grid[mappedIndex].x = originalPositions[i].x;
        grid[mappedIndex].y = originalPositions[i].y;
        grid[mappedIndex].currIndex = i;
    }
}

function drawGrid(grid) {
    for (let box of grid) {
        box.draw();
    }
}

function draw() {
    background(bgcolor1);
    sourceGrids.forEach(drawGrid);
    targetGrids.forEach(drawGrid);
    drawGrid(workingGrid);

    strokeWeight(miniBoxSize / 8);
    for (let i = 0; i < myPatterns.length; i++) {
        stroke(color2);
        drawDecor(miniBoxSize * 3 + i * miniBoxSize * 5, positionYoffset + miniBoxSize * 4.15, miniBoxSize);
        stroke(color1);
        drawDecor(miniBoxSize * 3 + i * miniBoxSize * 5, positionYoffset - miniBoxSize / 3 + miniBoxSize * 4.15, miniBoxSize);
    }
    noStroke();

    // Draw arrows after all boxes have been drawn
    for (let box of workingGrid) {
        box.drawArrow();
    }

    if (isContextMenuVisible && contextMenuBox !== null) {
        const pos = contextMenuBox.getPosition();
        displayContextMenu(pos.x, pos.y, contextMenuBox);
    }
}

let isContextMenuVisible = false;
let menuRowHeight = 0;
let contextMenuBox = null;
let contextMenu = {
    x: 0,
    y: 0,
    height: 0  // Will be updated when menu items are populated
};

let contextMenuBounds = { x: 0, y: 0, width: 100, height: 0 };  // initial bounds for the context menu

function isWithinContextMenu(x, y) {
    return x >= contextMenuBounds.x && x <= contextMenuBounds.x + contextMenuBounds.width &&
        y >= contextMenuBounds.y && y <= contextMenuBounds.y + contextMenuBounds.height;
}

function interact() {
    // If a context menu is visible and we clicked within its bounds.
    if (isContextMenuVisible && isWithinContextMenu(mouseX, mouseY)) {
        handleContextMenuClick(contextMenuBox); // Use the stored contextMenuBox here.
        isContextMenuVisible = false;
        contextMenuBox = null;
        redraw();
        return;
    }

    // If we clicked outside the context menu, hide it.
    else if (isContextMenuVisible && !isWithinContextMenu(mouseX, mouseY)) {
        isContextMenuVisible = false; contextMenuBox = null;
        redraw();
        return;
    }
    // Handle other interactions when context menu isn't in the forefront.
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        for (let i = 0; i < workingGrid.length; i++) {
            if (workingGrid[i].contains(mouseX, mouseY) && workingGrid[i].isInteractive) {

                contextMenuBox = workingGrid[i];
                const pos = contextMenuBox.getPosition();
                displayContextMenu(pos.x, pos.y, contextMenuBox);

                contextMenuBounds.x = workingGrid[i].getPosition().x;
                contextMenuBounds.y = workingGrid[i].getPosition().y;
                contextMenuBounds.height = menuItems.length * menuRowHeight;
                isContextMenuVisible = true;
                redraw();
                break;
            }
        }
    }
}




class MenuItem {
    constructor(text, action) {
        this.text = text;
        this.action = action;
    }

    draw(x, y) {
        noStroke();
        fill(0); // Black text
        textAlign(LEFT, TOP);
        textSize(miniBoxSize);
        text(this.text, x + miniBoxSize, y + miniBoxSize / 3);
    }

    executeAction(box) {
        this.action(box);
    }
}

let menuItems = [];

function populateMenuItems(box) {
    menuItems = [];

    if (!box.isLocked) {
        menuItems.push(new MenuItem('Select', (box) => {
            selected = box;
        }));

        if (selected && selected !== box) {
            menuItems.push(new MenuItem('Swap', (box) => {
                box.swap(selected);
                selected = null;
            }));
        }

        menuItems.push(new MenuItem('Lock', (box) => {
            box.toggleLock();
        }));
    } else {
        menuItems.push(new MenuItem('Unlock', (box) => {
            box.toggleLock();
        }));
    }

    if (selected) {
        menuItems.push(new MenuItem('Cancel', (box) => {
            selected = null;
        }));
    }
}

function displayContextMenu(x, y, box) {
    populateMenuItems(box);

    contextMenu.x = x;
    contextMenu.y = y;
    contextMenu.height = menuItems.length * menuRowHeight;

    push();
    stroke(150);
    strokeWeight(miniBoxSize / 16);
    fill(240, 140);
    rect(x, y, miniBoxSize * 5, contextMenu.height);

    for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].draw(x, y + i * menuRowHeight);
    }

    pop();
    isContextMenuVisible = true;
}

function handleContextMenuClick(box) {
    const clickedOption = Math.floor((mouseY - contextMenu.y) / 20);

    // Check if the click was within the bounds of the clicked menu item
    if (mouseX >= contextMenu.x && mouseX <= contextMenu.x + miniBoxSize * 5 &&
        clickedOption >= 0 && clickedOption < menuItems.length) {
        menuItems[clickedOption].executeAction(box);

        if (checkWin()) {
            winMsg = riddles[riddleIndex].CustomWinMessage ?? winMessages[Math.floor(Math.random() * winMessages.length)];
            bgcolor1 = color1;
            gameLog(`<H1>WIN!!!</H1><H3> ${winMsg} </H3>`);
        }
    }
}



function mousePressed() {
    interact();
}
// keep it commented until figure out touch controls
// function touchStarted() {
//     interact();
//     return false; // Prevent default behavior
// }

function checkWin() {
    let workingGridMap = workingGrid.map(grid => grid.currIndex);
    //gameLog('Current mapping: ' + workingGridMap.toString());
    //gameLog('currentTargetMap: ', currentTargetMap);
    for (let i = 0; i < workingGridMap.length; i++) {
        if (workingGridMap[i] !== currentTargetMap[i]) {
            return false;
        }
    }

    return true;
}

