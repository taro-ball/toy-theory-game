class Box {
    constructor(x, y, size, value, index, isInteractive) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.value = value;
        this.initIndex = index; 
        this.currIndex = index; 
        this.isInteractive = isInteractive;
        this.flash = false; 
    }

    draw() {
        if (this.flash) { 
            stroke('white');
            strokeWeight(7); // Set the stroke weight to 7 for the flash effect
        } else {
            stroke('black'); 
            strokeWeight(1);
        }

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
            stroke('Chartreuse');
            strokeWeight(5); 
            rect(this.x, this.y, this.size, this.size);
            noStroke();
        }
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

        // Update the flash property to true when boxes are swapped
        this.flash = true;
        other.flash = true;

        // After a brief period, set the flash property back to false
        setTimeout(() => {
            this.flash = false;
            other.flash = false;
            redraw(); // force p5.js to redraw the sketch
        }, 100); // set the duration of the flash effect
    }

    contains(mouseX, mouseY) {
        return (mouseX > this.x && mouseX < this.x + this.size && mouseY > this.y && mouseY < this.y + this.size);
    }


}

let targetGrids = [];
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
    createCanvas(500, 520);

    for (let i = 0; i < 5; i++) {
        let size = 15;
        let positionX = 10 + i * 80;
        let positionY = 10; // Change Y position for each grid to stack vertically

        // Generate pattern based on some rule
        let pattern = Array(16).fill(0).map((v, index) => (index + i) % 2);

        targetGrids.push(createGrid(size, false, positionX, positionY, pattern));
    }

    //let countOfOnes = Array(16).fill(0).reduce((count, value) => count + value, 0);
    let workingPattern = Array(16).fill(0).map((v, i) => i < 8 ? 1 : 0);

    workingGrid = createGrid(50, true, 10, 300, workingPattern);

    let button = createButton('Toggle Indexes');
    button.mousePressed(() => {
        showIndexes = !showIndexes;
        redraw();
    });
}



function draw() {
    background(220);

    for (let targetGrid of targetGrids) {
        for (let box of targetGrid) {
            box.draw();
        }
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
        if (workingGrid[i].value !== targetGrids[0][workingGrid[i].currIndex].value) {
            return false;
        }
    }
    return true;
}
