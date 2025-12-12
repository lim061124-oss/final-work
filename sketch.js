import Planet from "./Planet.js";
import Particle from "./Particle.js";

let particles = [];
let planets = [];
const NUM_PLANETS = 4;
const PARTICLES_PER_PLANET = 150;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 100);

  const colors = [
    color(0, 80, 100),
    color(200, 80, 100),
    color(100, 80, 100),
    color(50, 80, 100)
  ];

  for (let i = 0; i < NUM_PLANETS; i++) {
    const x = map(i, 0, NUM_PLANETS - 1, 150, width - 150);
    const y = (i % 2 === 0) ? height / 3 : height * 2 / 3;

    const planet = new Planet(x, y);
    planets.push(planet);

    for (let j = 0; j < PARTICLES_PER_PLANET; j++) {
      particles.push(new Particle(x, y, colors[i]));
    }
  }
}

function draw() {
  background(0, 0, 0, 30);

  planets.forEach(p => p.drawCore());

  let bh = createVector(mouseX, mouseY);
  drawBlackHole(bh);

  blendMode(ADD);
  particles.forEach(p => {
    p.update(bh);
    p.display();
  });
  blendMode(BLEND);

  if (!mouseIsPressed) planets.forEach(p => p.drawSmallCore());
}

function drawBlackHole(pos) {
  if (mouseIsPressed) {
    noFill();
    stroke(280, 80, 100, 50);
    strokeWeight(2);
    for (let i = 0; i < 3; i++) {
      const r = (frameCount * 5 + i * 20) % 60;
      ellipse(pos.x, pos.y, r, r);
    }
    noStroke();
    fill(0);
    ellipse(pos.x, pos.y, 30, 30);
  } else {
    noStroke();
    fill(255, 10);
    ellipse(pos.x, pos.y, 20, 20);
  }
}

window.setup = setup;
window.draw = draw;
