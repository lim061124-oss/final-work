class Particle {
  constructor(originX, originY, col) {
    this.state = 0;
    this.origin = createVector(originX, originY);

    this.pos = createVector(originX, originY);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.col = col;
    this.angle = random(TWO_PI);
    this.radius = random(40, 80);
    this.angVel = random(0.02, 0.08) * (random() > 0.5 ? 1 : -1);
  }

  update(target) {
    if (mouseIsPressed) this.onSuction(target);
    else this.onRelease(target);
  }

  onSuction(target) {
    if (this.state === 0) this.initSuction();

    const force = this.computeGravity(target);
    this.applyForce(force);

    const d = p5.Vector.dist(this.pos, target);

    if (d < 30) {
      this.vel.mult(0.85);
      let centerForce = p5.Vector.sub(target, this.pos).mult(0.1);
      this.applyForce(centerForce);
    } else {
      this.vel.mult(0.99);
    }

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  initSuction() {
    this.state = 1;
    this.pos = this.toCartesian(this.origin, this.radius, this.angle);

    let tangentAngle = this.angle + HALF_PI;
    let speed = this.radius * abs(this.angVel);
    this.vel = p5.Vector.fromAngle(tangentAngle).mult(speed);
    if (this.angVel < 0) this.vel.mult(-1);
  }

  computeGravity(target) {
    let force = p5.Vector.sub(target, this.pos);
    let d = constrain(force.mag(), 5, 1000);
    let strength = 500 / (d * d);
    if (d < 50) strength *= 2;
    force.setMag(strength);
    return force;
  }

  onRelease(target) {
    const d = p5.Vector.dist(this.pos, target);

    if (this.state === 1) {
      if (d < 100) {
        this.state = 2;
        this.origin = target.copy();
        this.radius = d;
        this.angle = atan2(this.pos.y - this.origin.y, this.pos.x - this.origin.x);
        this.angVel = random(0.01, 0.05) * (random() > 0.5 ? 1 : -1);
      } else {
        let home = p5.Vector.sub(this.origin, this.pos).mult(0.05);
        this.vel.add(home).mult(0.95);
        this.pos.add(this.vel);

        if (p5.Vector.dist(this.pos, this.origin) < this.radius + 10) {
          this.state = 0;
        }
      }
    } else {
      this.angle += this.angVel;
      this.pos = this.toCartesian(this.origin, this.radius, this.angle);
    }
  }

  toCartesian(center, r, a) {
    return createVector(center.x + cos(a) * r, center.y + sin(a) * r);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  display() {
    strokeWeight(this.state === 1 ? 3 : 2);
    stroke(this.col);
    point(this.pos.x, this.pos.y);
  }
}

export default Particle;
