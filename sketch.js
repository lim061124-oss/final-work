let system, controller;

function setup() {
  colorMode(HSB, 360, 100, 100, 100);
  createCanvas(windowWidth, windowHeight);
  controller = new ForceController();
  system = new ParticleSystem(controller);
  system.setAttractor(new Attractor(width / 2, height / 2, 20));
}

function draw() {
  background(230, 50, 5, 20);
  controller.update((mouseX - width / 2) * 0.05);
  system.update();
  system.display();
  drawUI(controller.modifiers);
}

function getGroupColor(id) {
  if (id === 0) return color(280, 60, 90, 80); 
  if (id === 1) return color(220, 65, 95, 80); 
  if (id === 2) return color(195, 55, 100, 80); 
}
