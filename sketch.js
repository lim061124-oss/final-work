let sim;

function setup() {
  createCanvas(800, 600);
  sim = new Simulation();
}

function draw() {
  sim.update();
  sim.render();
}

/* -------------------------------------------------
   Simulation
---------------------------------------------------*/
class Simulation {
  constructor() {
    this.numParticles = 400;
    this.centerX = width / 2;

    // Planet: 중심 어트렉터
    this.planet = new Attractor(width / 2, height / 2, 20);

    // 그룹별 코사인 힘 조절기
    this.groupForce = new GroupForceController();

    // 파티클 생성
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push(new Particle(random(width), random(height), int(random(3))));
    }
  }

  update() {
    background(10, 10, 20, 50);

    let offset = (mouseX - this.centerX) * 0.05;
    let forceFactors = this.groupForce.getFactors(offset);

    let solved = abs(mouseX - this.centerX) < 10;

    for (let p of this.particles) {
      let baseForce = this.planet.calculateForce(p);
      let modifier = forceFactors[p.groupId];

      // attraction or repulsion
      let finalForce = p5.Vector.mult(baseForce, modifier * 2);
      if (modifier < 0) finalForce.mult(2); // repulsion 강화

      p.applyForce(finalForce);
      p.update(solved ? 0.99 : 0.94);
      p.checkEdges();
    }
  }

  render() {
    this.planet.display();
    for (let p of this.particles) p.display();

    this.drawUI();
  }

  drawUI() {
    fill(255);
    noStroke();

    let solved = abs(mouseX - this.centerX) < 10;

    if (solved) {
      fill(100, 255, 100);
      text("SYSTEM SYNCHRONIZED: PLANETARY RINGS FORMED", width / 2, height - 30);

      stroke(100, 255, 100, 100);
      noFill();
      ellipse(width/2, height/2, 250, 250);

    } else {
      fill(200);
      text("Move Mouse X to synchronize particle frequencies.", width/2, height - 50);
      text("Find the sweet spot to attract ALL particles.", width/2, height - 30);
    }
  }
}

/* -------------------------------------------------
   Group Force Controller (Cosine 기반)
---------------------------------------------------*/
class GroupForceController {
  constructor() {
    this.frequencies = [0.5, 1.2, 2.5];
  }

  getFactors(offset) {
    return this.frequencies.map(freq => cos(offset * freq));
  }
}

/* -------------------------------------------------
   ForceField 기반 클래스
---------------------------------------------------*/
class ForceField {
  constructor(x, y, mass, isRepeller = false) {
    this.pos = createVector(x, y);
    this.mass = mass;
    this.G = 1.5;
    this.isRepeller = isRepeller;
  }

  calculateForce(p) {
    let force = p5.Vector.sub(this.pos, p.pos);
    let dist = constrain(force.mag(), 5, 25);

    force.normalize();

    let strength = (this.G * this.mass * p.mass) / (dist * dist);
    if (this.isRepeller) strength *= -1;

    force.mult(strength);
    return force;
  }
}

/* -------------------------------------------------
   Attractor / Repeller
---------------------------------------------------*/
class Attractor extends ForceField {
  constructor(x, y, mass) {
    super(x, y, mass, false);
    this.r = 30;
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

class Repeller extends ForceField {
  constructor(x, y, mass) {
    super(x, y, mass, true);
  }
}

/* -------------------------------------------------
   Particle
---------------------------------------------------*/
class Particle {
  constructor(x, y, groupId) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.mass = 1;
    this.groupId = groupId;
    this.color = this.getColor(groupId);
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
    if (this.pos.x > width - b) { this.pos.x = width - b; this.vel.x *= -0.8; }
    if (this.pos.x < b) { this.pos.x = b; this.vel.x *= -0.8; }
    if (this.pos.y > height - b) { this.pos.y = height - b; this.vel.y *= -0.8; }
    if (this.pos.y < b) { this.pos.y = b; this.vel.y *= -0.8; }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 4, 4);
  }

  getColor(id) {
    return id === 0 ? color(255, 50, 50) :
           id === 1 ? color(50, 255, 50) :
                       color(50, 150, 255);
  }
}
