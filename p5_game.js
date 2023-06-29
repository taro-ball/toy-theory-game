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
        fill(this.value === 1 ? 'FireBrick' : 'ForestGreen');
        rect(this.x, this.y, this.boxSize, this.boxSize);
    }

    drawIndex() {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(this.boxSize / 2)
        noStroke(); // Removes stroke from text
        text(this.initIndex + 1, this.x + this.boxSize / 2, this.y + this.boxSize / 2);
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
            redraw();
        }, 100);
    }

    contains(mouseX, mouseY) {
        return (mouseX > this.x && mouseX < this.x + this.boxSize && mouseY > this.y && mouseY < this.y + this.boxSize);
    }
}

let targetGrids = [];
let workingGrid = [];
let selected = null;
let showIndexes = false;

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

function setup() {
    createCanvas(500, 520);

    for (let i = 0; i < 5; i++) {
        let boxSize = 15;
        let positionX = 10 + i * 80;
        let positionY = 10;

        let pattern = Array(BOXES_PER_GRID).fill(0).map((v, index) => (index + i) % 2);

        targetGrids.push(createGrid(boxSize, false, positionX, positionY, pattern));
    }

    let workingPattern = Array(BOXES_PER_GRID).fill(0).map((v, i) => i < 8 ? 1 : 0);

    workingGrid = createGrid(50, true, 10, 300, workingPattern);

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
}

function drawGrid(grid) {
    for (let box of grid) {
        box.draw();
    }
}

function draw() {
    background(220);
    targetGrids.forEach(drawGrid);
    drawGrid(workingGrid);
}

function mousePressed() {
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

function checkWin() {
    for (let i = 0; i < workingGrid.length; i++) {
        if (workingGrid[i].value !== targetGrids[0][workingGrid[i].currIndex].value) {
            return false;
        }
    }
    return true;
}
