let system;
let forceController;

function setup() {
  createCanvas(windowWidth, windowHeight);

  forceController = new ForceController();
  system = new ParticleSystem(forceController);

  system.setCentralAttractor(new Attractor(width / 2, height / 2, 20));

  textSize(16);
  textAlign(CENTER);
}

function draw() {
  background(10, 10, 20, 50);

  // Mouse offset 로 주파수 변화
  let offset = (mouseX - width / 2) * 0.05;
  forceController.update(offset);

  system.update();
  system.display();

  drawUI(forceController.modifiers);
}
