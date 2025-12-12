let particles = [];
let planets = [];
let numPlanets = 4;
let particlesPerPlanet = 150;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 100);
  
  // Define Planet Centers and Colors
  let colors = [
    color(0, 80, 100),   // Red
    color(200, 80, 100), // Blue
    color(100, 80, 100), // Green
    color(50, 80, 100)   // Gold
  ];

  // Initialize Planets
  for (let i = 0; i < numPlanets; i++) {
    let x = map(i, 0, numPlanets - 1, 150, width - 150);
    let y = (i % 2 == 0) ? height / 3 : height * 2 / 3;
    planets.push(createVector(x, y));
    
    // Create Particles for this Planet
    for (let j = 0; j < particlesPerPlanet; j++) {
      particles.push(new Particle(x, y, colors[i]));
    }
  }
}

function draw() {
  background(0, 0, 0, 30); // Trail effect
  
  // Draw Planets (Core)
  noStroke();
  for (let p of planets) {
    fill(0, 0, 20);
    ellipse(p.x, p.y, 40, 40);
  }

  // Draw Black Hole / New Planet Center
  let bhPos = createVector(mouseX, mouseY);
  
  // Visuals for Black Hole
  if (mouseIsPressed) {
    // Sucking visual
    noFill();
    stroke(280, 80, 100, 50);
    strokeWeight(2);
    for(let i=0; i<3; i++) {
      let r = (frameCount * 5 + i * 20) % 60;
      ellipse(bhPos.x, bhPos.y, r, r);
    }
    noStroke();
    fill(0);
    ellipse(bhPos.x, bhPos.y, 30, 30);
  } else {
    // Just a cursor hint
    noStroke();
    fill(255, 10);
    ellipse(bhPos.x, bhPos.y, 20, 20);
  }

  // Update and Draw Particles
  blendMode(ADD);
  for (let p of particles) {
    p.update(bhPos);
    p.display();
  }
  blendMode(BLEND);
  
  // Reset Planet visuals on top
  if (!mouseIsPressed) {
     for (let i = 0; i < planets.length; i++) {
        fill(0,0,10);
        ellipse(planets[i].x, planets[i].y, 30, 30);
     }
  }
}

class Particle {
  constructor(originX, originY, col) {
    // State: 0 = Orbiting Parent, 1 = Being Sucked, 2 = New Planet Member
    this.state = 0; 
    
    this.origin = createVector(originX, originY);
    this.pos = createVector(originX, originY);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.col = col;
    
    // Orbit properties (Kinematic)
    this.angle = random(TWO_PI);
    this.radius = random(40, 80);
    this.angVel = random(0.02, 0.08) * (random() > 0.5 ? 1 : -1);
    
    // Physics properties
    this.maxSpeed = 15;
    this.maxForce = 0.8;
  }

  update(target) {
    if (mouseIsPressed) {
      if (this.state === 0) {
        // Transition from Orbit to Physics: Calculate initial tangent velocity
        this.state = 1;
        // Convert polar position to cartesian relative to center to ensure smooth transition
        this.pos.x = this.origin.x + cos(this.angle) * this.radius;
        this.pos.y = this.origin.y + sin(this.angle) * this.radius;
        
        // Tangent velocity v = r * omega
        let tanAngle = this.angle + HALF_PI;
        let speed = this.radius * abs(this.angVel);
        this.vel = p5.Vector.fromAngle(tanAngle).mult(speed);
        if (this.angVel < 0) this.vel.mult(-1);
      }
      
      // Physics: Attraction to Black Hole
      let force = p5.Vector.sub(target, this.pos);
      let d = force.mag();
      d = constrain(d, 5, 1000); // Constraint distance to avoid infinite force
      
      // Gravitational pull logic (Nature of Code style)
      // Strength increases as it gets closer
      let strength = (500) / (d * d); 
      if(d < 50) strength *= 2; // Super suck close up
      
      force.setMag(strength);
      this.applyForce(force);
      
      // Friction / Drag to stop them at the center to form the "New Planet"
      if (d < 30) {
        this.vel.mult(0.85); // High dampening
        // Push slightly towards center to keep shape compact
        let centerForce = p5.Vector.sub(target, this.pos);
        centerForce.mult(0.1);
        this.applyForce(centerForce);
      } else {
        this.vel.mult(0.99); // Air resistance
      }
      
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0); // Reset acceleration
      
    } else {
      // Mouse Released: Reset to Orbiting? 
      // The prompt implies they form a *new* planet. 
      // So if they are close to the black hole, they should start orbiting the new center.
      // If they are far (didn't get sucked in yet), they return to home.
      
      let dToNew = p5.Vector.dist(this.pos, target);
      
      if (this.state === 1) {
         if (dToNew < 100) {
           // Become part of the new planet
           this.state = 2;
           this.origin = target.copy(); // New center is where mouse was
           this.radius = dToNew;
           // Calculate current angle relative to new center
           this.angle = atan2(this.pos.y - this.origin.y, this.pos.x - this.origin.x);
           // Give random rotation speed
           this.angVel = random(0.01, 0.05) * (random() > 0.5 ? 1 : -1);
         } else {
           // Return to original planet (Elastic snap back)
           let homeDir = p5.Vector.sub(this.origin, this.pos);
           homeDir.mult(0.05);
           this.vel.add(homeDir);
           this.vel.mult(0.95);
           this.pos.add(this.vel);
           
           // Check if back home
           if (p5.Vector.dist(this.pos, this.origin) < this.radius + 10) {
             this.state = 0;
           }
         }
      } else if (this.state === 2) {
         // Orbiting the "New Planet" (The location where mouse was released)
         this.angle += this.angVel;
         this.pos.x = this.origin.x + cos(this.angle) * this.radius;
         this.pos.y = this.origin.y + sin(this.angle) * this.radius;
      } else {
        // Standard Orbit around original planet
        this.angle += this.angVel;
        this.pos.x = this.origin.x + cos(this.angle) * this.radius;
        this.pos.y = this.origin.y + sin(this.angle) * this.radius;
      }
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  display() {
    strokeWeight(this.state === 1 ? 3 : 2); // Thicker streak when moving fast
    stroke(this.col);
    point(this.pos.x, this.pos.y);
  }
}