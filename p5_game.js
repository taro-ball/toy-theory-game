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
        noStroke(); // Removes stroke from text
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
        if (showIndexes) this.drawIndex();
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

        setTimeout(() => {
            this.flash = false;
            other.flash = false;

            let map = getMapFromGrid(workingGrid);
            mapInput.value(map.join(','));

            redraw();
        }, 100);
    }

    contains(mouseX, mouseY) {
        return (mouseX > this.x && mouseX < this.x + this.boxSize && mouseY > this.y && mouseY < this.y + this.boxSize);
    }
}

let sourceGrids = [];
let targetGrids = [];
let workingGrid = [];
let selected = null;
let showIndexes = false;
let colorWorking = false;
let riddleIndex = 0
let myPatterns = riddles[riddleIndex].boardPatterns
let currentTargetMap = riddles[riddleIndex].targetMap

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
    createCanvas(500, 520);

    for (let i = 0; i < myPatterns.length; i++) {
        let pattern = myPatterns[i].map(num => num); // Copy each pattern into a separate array
        let boxSize = 15;
        let positionX = 10 + i * 80;
        let positionY = 10;
        sourceGrids.push(createGrid(boxSize, false, positionX, positionY, pattern));
    }

    for (let i = 0; i < myPatterns.length; i++) {
        let pattern = myPatterns[i].map(num => num); // Copy each pattern into a separate array
        let boxSize = 15;
        let positionX = 10 + i * 80;
        let positionY = 80;
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


    //let workingPattern = Array(BOXES_PER_GRID).fill(0).map((v, i) => i < 8 ? 1 : 0);

    workingGrid = createGrid(50, true, 10, 300, myPatterns[0]);

    let toggleButton = createButton('Toggle Indexes');
    toggleButton.position(windowWidth / 2 - 150, 80);
    toggleButton.mousePressed(() => {
        showIndexes = !showIndexes;
        redraw();
    });

    let resetButton = createButton('Reset Board');
    resetButton.position(windowWidth / 2 - 10, 80);
    resetButton.mousePressed(() => {
        if (confirm('Are you sure you want to reset the board?')) {
            window.location.reload();
        }
    });

    mapInput = createInput();
    mapInput.attribute('readonly', '');
    mapInput.position(windowWidth / 2 - 150, 105);
    mapInput.size(220, 16)


    let applyMapButton = createButton('Apply Map');
    applyMapButton.position(windowWidth / 2 + 90, 105);
    applyMapButton.mouseReleased(() => {
        //todo: resetGrid();
        redraw();
    });
    applyMapButton.mousePressed(() => {
        let map = mapInput.value().split(',').map(Number);
        for (let i = 0; i < sourceGrids.length; i++) {
            try {
                applyMapping(sourceGrids[i], map);
            } catch (error) {
                alert('Invalid mapping. Please enter a valid map.');
                return;
            }
        }
        redraw();
    });


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
                    alert('You have won!');
                }
                break;
            }
        }
    }
}


function mousePressed() {
    interact();
}

function touchStarted() {
    interact();
    return false; // Prevent default behavior
}

function checkWin() {
    let workingGridMap = workingGrid.map(grid => grid.currIndex);
    console.log('workingGridValues: ', workingGridMap);
    console.log('currentTargetMap: ', currentTargetMap);
    for (let i = 0; i < workingGridMap.length; i++) {
        if (workingGridMap[i] !== currentTargetMap[i]) {

            return false;
        }
    }

    return true;
}

