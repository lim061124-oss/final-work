let particles = [];
let planet;
let numParticles = 400;
let targetX; // The "winning" mouse position

function setup() {
  createCanvas(800, 600);
  
  // Create particles with different group IDs (0, 1, 2)
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height), int(random(3))));
  }
  
  // Create the central attractor (Planet)
  planet = new Attractor(width / 2, height / 2);
  
  // The target is the center of the screen
  targetX = width / 2;
  
  textSize(16);
  textAlign(CENTER);
}

function draw() {
  // Trail effect
  background(10, 10, 20, 50);
  
  // Draw the planet
  planet.display();
  
  // Calculate the "tuning" offset based on Mouse X
  // We want 0 offset at the center of the screen.
  // The scale determines how sensitive the "tuning" is.
  let offset = (mouseX - targetX) * 0.05;

  // Calculate Force Multipliers for 3 distinct groups using Cosine waves
  // When offset is 0 (Mouse at center), cos(0) is 1 (Max Attraction)
  // When offset deviates, values oscillate between -1 (Repel) and 1 (Attract) at different frequencies
  let forceFactors = [
    cos(offset * 0.5),   // Group 0: Slow frequency
    cos(offset * 1.2),   // Group 1: Medium frequency
    cos(offset * 2.5)    // Group 2: High frequency
  ];

  let gameSolved = abs(mouseX - targetX) < 10;

  for (let p of particles) {
    // 1. Calculate base attraction force from planet
    let force = planet.calculateForce(p);
    
    // 2. Modify force based on particle group and mouse position
    // If factor is positive: Attract. If negative: Repel.
    let modifier = forceFactors[p.groupId];
    
    // Enhance the effect for gameplay feel
    force.mult(modifier * 2); 
    
    // If we are repelling (modifier < 0), make it stronger to push them away visibly
    if (modifier < 0) force.mult(2);

    // 3. Apply physics
    p.applyForce(force);
    
    // Add a bit of friction so they settle into rings/clouds instead of orbiting forever chaotically
    // Friction is lower when "solved" to allow nice orbiting
    p.update(gameSolved ? 0.99 : 0.94); 
    p.checkEdges();
    p.display();
  }
  
  // UI & Game Logic
  drawUI(forceFactors, gameSolved);
}

function drawUI(factors, solved) {
  fill(255);
  noStroke();
  
  if (solved) {
    fill(100, 255, 100);
    text("SYSTEM SYNCHRONIZED: PLANETARY RINGS FORMED", width/2, height - 30);
    stroke(100, 255, 100, 100);
    noFill();
    ellipse(width/2, height/2, 250, 250); // Victory Ring
  } else {
    fill(200);
    text("Move Mouse X to synchronize particle frequencies.", width/2, height - 50);
    text("Find the sweet spot to attract ALL particles.", width/2, height - 30);
  }
  
  // Visual debug for the forces (Top left)
  let barWidth = 100;
  for(let i=0; i<3; i++) {
    let val = factors[i];
    let col = getGroupColor(i);
    fill(col);
    noStroke();
    text(val > 0 ? "Attract" : "Repel", 60, 35 + i * 20);
    
    // Bar
    noFill();
    stroke(col);
    rect(100, 25 + i * 20, barWidth, 10);
    
    noStroke();
    fill(val > 0 ? color(255, 255, 255) : color(255, 100, 100));
    // Map -1..1 to 0..width
    let barX = map(val, -1, 1, 0, barWidth);
    rect(100, 25 + i * 20, barX, 10);
  }
}

function getGroupColor(id) {
  if (id === 0) return color(255, 50, 50);    // Red
  if (id === 1) return color(50, 255, 50);    // Green
  if (id === 2) return color(50, 150, 255);   // Blue
  return color(255);
}

// --- Classes ---

class Attractor {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.mass = 20;
    this.G = 1.5; // Gravitational Constant
    this.r = 30; // Radius for drawing
  }

  calculateForce(p) {
    // F = G * (m1 * m2) / dist^2
    let force = p5.Vector.sub(this.pos, p.pos);
    let distance = force.mag();
    // Constrain distance to avoid singularity (shooting off to infinity)
    distance = constrain(distance, 5, 25); 
    
    force.normalize();
    let strength = (this.G * this.mass * p.mass) / (distance * distance);
    force.mult(strength);
    return force;
  }

  display() {
    noStroke();
    // Glow
    for (let i = 5; i > 0; i--) {
      fill(255, 200, 100, 20);
      ellipse(this.pos.x, this.pos.y, this.r * 2 + i * 10);
    }
    fill(255, 150, 0);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

class Particle {
  constructor(x, y, groupId) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.mass = 1;
    this.groupId = groupId; // Determines which frequency affects this particle
    this.color = getGroupColor(groupId);
    this.history = [];
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  update(friction) {
    this.vel.add(this.acc);
    this.vel.mult(friction); // Damping to stabilize orbits
    this.pos.add(this.vel);
    this.acc.mult(0); // Reset acceleration
  }

  checkEdges() {
    // Constraint: Keep repulsion within screen boundaries
    // If they hit the wall, bounce them back
    let buffer = 10;
    
    if (this.pos.x > width - buffer) {
      this.pos.x = width - buffer;
      this.vel.x *= -0.8;
    } else if (this.pos.x < buffer) {
      this.pos.x = buffer;
      this.vel.x *= -0.8;
    }

    if (this.pos.y > height - buffer) {
      this.pos.y = height - buffer;
      this.vel.y *= -0.8;
    } else if (this.pos.y < buffer) {
      this.pos.y = buffer;
      this.vel.y *= -0.8;
    }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 4, 4);
  }
}