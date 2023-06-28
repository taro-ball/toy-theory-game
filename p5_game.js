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
      fill(this.value === 1 ? 'red' : 'blue');
      rect(this.x, this.y, this.width, this.height);
  
      // Draw the box index
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(18);
      text(this.index + 1, this.x + this.width / 2, this.y + this.height / 2);
  
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
  let selected = null;
  
  function setup() {
    createCanvas(250, 260); // Increase canvas height to accommodate all boxes
    noLoop();
  
    // Initialize the grid with Box objects
    for (let i = 0; i < 16; i++) {
      const x = (i % 4) * 60 + 10;
      const y = Math.floor(i / 4) * 60 + 10;
      const value = i < 8 ? 0 : 1;
      grid.push(new Box(x, y, 50, 50, value, i));
    }
  }
  
  function draw() {
    background(220);
  
    // Draw the grid
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
        break;
      }
    }
  }