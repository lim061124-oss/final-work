class Particle {
  constructor(x, y, groupId) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.mass = 1;
    this.groupId = groupId;
    this.color = getGroupColor(groupId);
  }

  applyForce(f) {
    this.acc.add(p5.Vector.div(f, this.mass));
  }

  update(friction) {
    this.vel.add(this.acc);
    this.vel.mult(friction);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  checkEdges() {
    let b = 10;
    if (this.pos.x > width - b || this.pos.x < b) this.vel.x *= -0.8;
    if (this.pos.y > height - b || this.pos.y < b) this.vel.y *= -0.8;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 4, 4);
  }
}
