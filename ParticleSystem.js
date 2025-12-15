class ParticleSystem {
  constructor(controller) {
    this.particles = [];
    this.controller = controller;
    this.central = null;

    for (let i = 0; i < 400; i++) {
      this.particles.push(
        new Particle(random(width), random(height), int(random(3)))
      );
    }
  }

  setAttractor(a) {
    this.central = a;
  }

  update() {
    let solved = abs(mouseX - width / 2) < 10;

    for (let p of this.particles) {
      let base = this.central.calculateForce(p);
      let mod = this.controller.getModifier(p.groupId);

      let f = p5.Vector.mult(base, mod * 2);
      if (mod < 0) f.mult(2);

      if (solved) {
        let dir = p5.Vector.sub(p.pos, this.central.pos);
        let tan = createVector(-dir.y, dir.x).setMag(0.05);
        p.applyForce(tan);
      }

      p.applyForce(f);
      p.update(solved ? 0.99 : 0.94);
      p.checkEdges();
    }
  }

  display() {
    this.central.display();
    for (let p of this.particles) p.display();
  }
}
