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
    }

    drawBox() {
        stroke(this.flash ? 'white' : 'black');
        strokeWeight(this.flash ? 7 : 1);
        if (!colorWorking) { fill(this.value === 1 ? 'Teal' : 'DarkBlue'); }
        else { fill("gray") }
        rect(this.x, this.y, this.boxSize, this.boxSize);
    }

    drawIndex() {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(this.boxSize / 2)
        //noStroke(); // Removes stroke from text
        text(this.initIndex, this.x + this.boxSize / 2, this.y + this.boxSize / 2);
    }

    drawInteractive() {
        noFill();
        stroke('Chartreuse');
        strokeWeight(5);
        rect(this.x, this.y, this.boxSize, this.boxSize);
        noStroke();
    }

    draw() {
        this.drawBox();
        if (showIndexes && this.isInteractive) this.drawIndex();
        if (this.isInteractive && selected !== null && this.initIndex === selected.initIndex) this.drawInteractive();
    }

    setPosition(x, y, index) {
        this.x = x;
        this.y = y;
        this.currIndex = index;
    }

    swap(other) {
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
}

function gameLog(message) {
    let previousHtml = logDiv.html(); // get the current log
    logDiv.html(previousHtml + message + '\n'); // append the new message and a newline
    logDiv.elt.scrollTop = logDiv.elt.scrollHeight; // scroll to the bottom
}

function inverseMapping(map) {
    let inverse = new Array(map.length);
    for (let i = 0; i < map.length; i++) {
        inverse[map[i]] = i;
    }
    return inverse;
}

function drawArrow(x, y, size) {
    //line(x, y, x, y + size);  // Vertical line
    line(x - size / 2, y + size / 2, x, y + size);  // Diagonal line left
    line(x + size / 2, y + size / 2, x, y + size);  // Diagonal line right
}

function redrawSketch() {
    riddleIndex = parseInt(riddleSelect.value());
    myPatterns = riddles[riddleIndex].boardPatterns;
    currentTargetMap = riddles[riddleIndex].targetMap;

    sourceGrids = [];
    targetGrids = [];
    workingGrid = [];
    selected = null;

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

    workingGrid = createGrid(miniBoxSize * 3, true, positionXoffset, positionYoffset + miniBoxSize * 20, myPatterns[0]);
    //mapInput.value(getMapFromGrid(workingGrid).join(','));
    redraw();
}

let riddleSelect;
let showIndexes = true;
let colorWorking = false;
let miniBoxSize = 15;
let positionXoffset = miniBoxSize;
let positionYoffset = miniBoxSize;
let logDiv;

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

    let isMapApplied = false;
    let applyMapButton = createButton('Apply Map');
    applyMapButton.parent(row2);
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
                if (selected !== null) {
                    workingGrid[i].swap(selected);
                    selected = null;
                } else {
                    selected = workingGrid[i];
                }
                redraw();

                if (checkWin()) {
                    gameLog(winMessages[Math.floor(Math.random() * winMessages.length)]);
                }
                break;
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

