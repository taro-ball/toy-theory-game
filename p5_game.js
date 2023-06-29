class Box {
    constructor(x, y, size, value, index, isInteractive) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.value = value;
        this.initIndex = index; // initial index, never changes
        this.currIndex = index; // current index, changes when boxes are swapped
        this.isInteractive = isInteractive;
    }

    draw() {
        fill(this.value === 1 ? 'FireBrick' : 'ForestGreen');
        rect(this.x, this.y, this.size, this.size);
    
        if (showIndexes) {
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(18);
            text(this.initIndex + 1, this.x + this.size / 2, this.y + this.size / 2);
        }
    
        if (this.isInteractive && selected !== null && this.initIndex === selected.initIndex) {
            noFill();
            stroke('black');
            strokeWeight(3);
            rect(this.x, this.y, this.size, this.size);
            noStroke();
        }
    }
    
    contains(mouseX, mouseY) {
        return (mouseX > this.x && mouseX < this.x + this.size && mouseY > this.y && mouseY < this.y + this.size);
    }
    
    swap(other) {
        const tempIndex = this.currIndex;
        const tempX = this.x;
        const tempY = this.y;

        this.currIndex = other.currIndex;
        this.x = other.x;
        this.y = other.y;

        other.currIndex = tempIndex;
        other.x = tempX;
        other.y = tempY;
    }
}

let workingGrid = [];
let targetGrid = [];
let selected = null;
let showIndexes = false;

function createGrid(boxSize, isInteractive, topLeftX, topLeftY, pattern) {
    const grid = [];

    for (let i = 0; i < 16; i++) {
        const x = topLeftX + (i % 4) * boxSize;
        const y = topLeftY + Math.floor(i / 4) * boxSize;
        const value = pattern[i]; 
        grid.push(new Box(x, y, boxSize, value, i, isInteractive));
    }

    return grid;
}

function setup() {
    createCanvas(250, 520);
    let pattern = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
    let countOfOnes = pattern.reduce((count, value) => count + value, 0);

    targetGrid = createGrid(20, false, 10, 10, pattern);

    let workingPattern = Array(16).fill(0).map((v, i) => i < countOfOnes ? 1 : 0);
    workingGrid = createGrid(50, true, 10, 260, workingPattern);

    let button = createButton('Toggle Indexes');
    button.mousePressed(() => {
        showIndexes = !showIndexes;
        redraw();
    });
}


function draw() {
    background(220);

    for (let box of targetGrid) {
        box.draw();
    }

    for (let box of workingGrid) {
        box.draw();
    }
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
        if (workingGrid[i].value !== targetGrid[workingGrid[i].currIndex].value) {
            return false;
        }
    }
    return true;
}
