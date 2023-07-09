const BOXES_PER_GRID = 16;

class Box {
    constructor(x, y, boxSize, value, index, isInteractive) {
        this.x = x;
        this.y = y;
        this.boxSize = boxSize;
        this.value = value;
        this.initIndex = index;
        this.currIndex = index;
        this.isInteractive = isInteractive;
        this.flash = false;
        this.isLocked = false;
    }

    drawBox() {
        stroke(this.flash ? 'white' : this.isLocked ? 'DarkGrey' : 'black');
        strokeWeight(this.flash ? 7 : this.isLocked ? lockedStrokeW : 1);
        if (!colorWorking) { fill(this.value === 1 ? 'Purple' : 'DarkTurquoise'); }
        else { fill("gray") }
        rect(this.x, this.y, this.boxSize, this.boxSize);
    }

    drawIndex() {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(this.boxSize / 2)
        noStroke(); // Removes stroke from text
        let indexTxt = this.isLocked ? '[' + this.initIndex + ']' : this.initIndex;
        text(indexTxt, this.x + this.boxSize / 2, this.y + this.boxSize / 2);
        stroke('black');
    }

    drawSelected() {
        if (!this.isLocked) {
            fill('MediumOrchid');
            noStroke();
            rect(this.x, this.y, this.boxSize, this.boxSize);
        }
    }

    draw() {
        this.drawBox();
        if (this.isInteractive && selected !== null && this.initIndex === selected.initIndex && !this.isLocked) { // Check for locked status here
            this.drawSelected();
        }
        if (showIndexes && this.isInteractive) this.drawIndex();
    }

    setPosition(x, y, index) {
        this.x = x;
        this.y = y;
        this.currIndex = index;
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
        sourceGrids.push(createGrid(boxSize, false, positionX, positionY, pattern));
    }

    for (let i = 0; i < myPatterns.length; i++) {
        let pattern = myPatterns[i].map(num => num); // Copy each pattern into a separate array
        let boxSize = miniBoxSize;
        let positionX = positionXoffset + i * miniBoxSize * 5;
        let positionY = positionYoffset + miniBoxSize * 5.5;
        targetGrids.push(createGrid(boxSize, false, positionX, positionY, pattern));
    }

    for (let i = 0; i < targetGrids.length; i++) {
        try {
            applyMapping(targetGrids[i], currentTargetMap);
        } catch (error) {
            alert('Invalid mapping. Please enter a valid map.');
            return;
        }
    }

    workingGrid = createGrid(miniBoxSize * 4, true, positionXoffset, positionYoffset + miniBoxSize * 16, myPatterns[0]);
    //mapInput.value(getMapFromGrid(workingGrid).join(','));
    gameLog(`<hr><b>Riddle</b> "${riddles[riddleIndex].name}" by ${riddles[riddleIndex].author} <b>loaded!</b>`)
    redraw();
}

let riddleSelect;
let showIndexes = true;
let colorWorking = false;
let miniBoxSize = 15;
let positionXoffset = miniBoxSize;
let positionYoffset = miniBoxSize;
let logDiv;
let hintNo = 0;

function createGrid(boxSize, isInteractive, topLeftX, topLeftY, pattern) {
    const grid = [];

    for (let i = 0; i < BOXES_PER_GRID; i++) {
        const x = topLeftX + (i % 4) * boxSize;
        const y = topLeftY + Math.floor(i / 4) * boxSize;
        const value = pattern[i];
        grid.push(new Box(x, y, boxSize, value, i, isInteractive));
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

    for (let i = 0; i < BOXES_PER_GRID; i++) {
        const mappedIndex = map[i];
        grid[mappedIndex].x = originalPositions[i].x;
        grid[mappedIndex].y = originalPositions[i].y;
        grid[mappedIndex].currIndex = i;
    }
}

function setup() {
    document.addEventListener('contextmenu', event => event.preventDefault());
    frameRate(5);
    logDiv = select('#ttLog');
    let myCanvas = createCanvas(miniBoxSize * 46, miniBoxSize * 34);
    myCanvas.parent('canvasContainer');

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

    let hintButton = createButton('Hint');
    hintButton.parent(row1);
    hintButton.mousePressed(() => { gameLog(`<b>Hint:</b> ${riddleHint()}`) });

    let helpButton = createButton('Help');
    helpButton.parent(row1);
    helpButton.mousePressed(() => { gameLog(helpMessage[0]) });

    // Draw initial board
    redrawSketch();
}

function drawGrid(grid) {
    for (let box of grid) {
        box.draw();
    }
}

function draw() {
    background(220);
    sourceGrids.forEach(drawGrid);
    targetGrids.forEach(drawGrid);
    drawGrid(workingGrid);

    // Drawing arrows
    strokeWeight(2);
    for (let i = 0; i < myPatterns.length; i++) {
        drawArrow(miniBoxSize * 3 + i * miniBoxSize * 5, positionYoffset + miniBoxSize * 4, 16);
        drawArrow(miniBoxSize * 3 + i * miniBoxSize * 5, positionYoffset - 5 + miniBoxSize * 4, 16);
    }
    noStroke();
}

function interact() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        for (let i = 0; i < workingGrid.length; i++) {
            if (workingGrid[i].contains(mouseX, mouseY) && workingGrid[i].isInteractive) {
                if (mouseButton === LEFT) {
                    if (selected !== null) {
                        workingGrid[i].swap(selected);
                        selected = null;
                    } else {
                        selected = workingGrid[i];
                    }
                    redraw();

                    if (checkWin()) {
                        winMsg = riddles[riddleIndex].winMessage ?? winMessages[Math.floor(Math.random() * winMessages.length)];
                        gameLog(`<H1>WIN!!!</H1><H3> ${winMsg} </H3>`);
                    }
                    break;
                } else if (mouseButton === RIGHT) {
                    workingGrid[i].toggleLock();
                    redraw();
                    break;
                }
            }
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

