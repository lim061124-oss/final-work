class ParticleSystem {
  constructor(forceController) {
    this.particles = [];
    this.forceController = forceController;
    this.central = null;

    for (let i = 0; i < 400; i++) {
      this.particles.push(new Particle(random(width), random(height), int(random(3))));
    }
  }

  setCentralAttractor(obj) {
    this.central = obj;
  }

  update() {
    let solved = abs(mouseX - width / 2) < 10;

    if (solved) {
    let dir = p5.Vector.sub(p.pos, this.central.pos);
    let tangent = createVector(-dir.y, dir.x);
    tangent.setMag(0.05);
    p.applyForce(tangent);
    }


    for (let p of this.particles) {
      let baseForce = this.central.calculateForce(p);
      let modifier = this.forceController.getModifier(p.groupId);
      

      let finalForce = p5.Vector.mult(baseForce, modifier * 2);
      if (modifier < 0) finalForce.mult(2);
      let flow = flowField.getForce(p);

      p.applyForce(finalForce);
      p.update(solved ? 0.99 : 0.94);
      p.checkEdges();
      p.applyForce(flow);
    }
  }

  display() {
    this.central.display();
    for (let p of this.particles) p.display();
  }
}
