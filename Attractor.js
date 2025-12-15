class Attractor {
  constructor(x, y, mass) {
    this.pos = createVector(x, y);
    this.mass = mass;
    this.G = 1.5;
    this.r = 30;
  }

  calculateForce(p) {
    let force = p5.Vector.sub(this.pos, p.pos);
    let dist = constrain(force.mag(), 5, 25);
    force.normalize();
    let strength = (this.G * this.mass * p.mass) / (dist * dist);
    force.mult(strength);
    return force;
  }

  display() {
    noStroke();
    for (let i = 5; i > 0; i--) {
      fill(255, 200, 100, 20);
      ellipse(this.pos.x, this.pos.y, this.r * 2 + i * 10);
    }
    fill(255, 150, 0);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}
