class Box {
    constructor(x, y, width, height, value, index) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = value;
        this.index = index;
    }

    draw() {
        fill(this.value === 1 ? 'FireBrick' : 'ForestGreen');
        rect(this.x, this.y, this.width, this.height);

        // Draw the box index only if showIndexes is true
        if (showIndexes) {
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(18);
            text(this.index + 1, this.x + this.width / 2, this.y + this.height / 2);
        }

        // Add dark frame for selected box
        if (selected !== null && this.index === selected) {
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
        const tempValue = this.value;
        const tempIndex = this.index;

        this.value = other.value;
        this.index = other.index;

        other.value = tempValue;
        other.index = tempIndex;
    }

    static swapInArray(boxes, a, b) {
        let temp = boxes[a];
        boxes[a] = boxes[b];
        boxes[b] = temp;
    }
}

let grid = [];
let targetGrid = []; // Target grid
let selected = null;
let showIndexes = false;

function setup() {
    createCanvas(250, 520); // Updated height to accommodate the target grid
    let pattern = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
    // Calculate the count of 1's in the target pattern
    let countOfOnes = pattern.reduce((count, value) => count + value, 0);
    // Initialize the grid with Box objects
    for (let i = 0; i < 16; i++) {
        const x = (i % 4) * 60 + 10;
        const y = Math.floor(i / 4) * 60 + 10;
        const value = i < countOfOnes ? 1 : 0; // First boxes will be 1's
        grid.push(new Box(x, y + 260, 50, 50, value, i)); // The y-coordinate of the main grid is updated to move it down
    }

    // Initialize the target grid
    for (let i = 0; i < 16; i++) {
        const x = (i % 4) * 60 + 10;
        const y = Math.floor(i / 4) * 60 + 10;
        const value = pattern[i]; 
        targetGrid.push(new Box(x, y, 50, 50, value, i));
    }

    // Create a button that toggles showIndexes
    let button = createButton('Toggle Indexes');
    button.mousePressed(() => {
        showIndexes = !showIndexes;
        redraw();
    });
}

function draw() {
    background(220);

    // Draw the target grid
    for (let box of targetGrid) {
        box.draw();
    }

    // Draw the main grid
    for (let box of grid) {
        box.draw();
    }
}

function mousePressed() {
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].contains(mouseX, mouseY)) {
            if (selected !== null) {
                grid[i].swap(grid[selected]);
                Box.swapInArray(grid, i, selected);
                selected = null;
            } else {
                selected = i;
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
      if (grid[i].value !== targetGrid[i].value) {
        return false;
      }
    }
    return true;
  }