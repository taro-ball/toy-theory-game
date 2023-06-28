class Box {
    constructor(x, y, width, height, value, index) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = value;
        this.initIndex = index; // initial index, never changes
        this.currIndex = index; // current index, changes when boxes are swapped
    }

    draw() {
        fill(this.value === 1 ? 'FireBrick' : 'ForestGreen');
        rect(this.x, this.y, this.width, this.height);

        if (showIndexes) {
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(18);
            text(this.initIndex + 1, this.x + this.width / 2, this.y + this.height / 2);
        }

        if (selected !== null && this.initIndex === selected.initIndex) {
            noFill();
            stroke('black');
            strokeWeight(3);
            rect(this.x, this.y, this.width, this.height);
            noStroke();
        }
    }

    contains(mouseX, mouseY) {
        return (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height);
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

let grid = [];
let targetGrid = [];
let selected = null;
let showIndexes = false;

function setup() {
    createCanvas(250, 520);
    let pattern = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
    let countOfOnes = pattern.reduce((count, value) => count + value, 0);

    for (let i = 0; i < 16; i++) {
        const x = (i % 4) * 60 + 10;
        const y = Math.floor(i / 4) * 60 + 10;
        const value = pattern[i]; 
        targetGrid.push(new Box(x, y, 50, 50, value, i));
    }

    for (let i = 0; i < 16; i++) {
        const x = (i % 4) * 60 + 10;
        const y = Math.floor(i / 4) * 60 + 260; // move main grid down
        const value = i < countOfOnes ? 1 : 0; 
        grid.push(new Box(x, y, 50, 50, value, i));
    }

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

    for (let box of grid) {
        box.draw();
    }
}

function mousePressed() {
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].contains(mouseX, mouseY)) {
            if (selected !== null) {
                grid[i].swap(selected);
                selected = null;
            } else {
                selected = grid[i];
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
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].value !== targetGrid[grid[i].currIndex].value) {
            return false;
        }
    }
    return true;
}