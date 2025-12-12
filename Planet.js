class Planet {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }

  drawCore(size = 40) {
    noStroke();
    fill(0, 0, 20);
    ellipse(this.pos.x, this.pos.y, size, size);
  }

  drawSmallCore(size = 30) {
    noStroke();
    fill(0, 0, 10);
    ellipse(this.pos.x, this.pos.y, size, size);
  }
}

export default Planet;
