let system, controller;

function setup() {
  colorMode(HSB, 360, 100, 100, 100);
  createCanvas(windowWidth, windowHeight);
  controller = new ForceController();
  system = new ParticleSystem(controller);
  system.setAttractor(new Attractor(width / 2, height / 2, 20));
}

function draw() {
  background(0);
  controller.update((mouseX - width / 2) * 0.05);
  system.update();
  system.display();
  drawUI(controller.modifiers);
}
