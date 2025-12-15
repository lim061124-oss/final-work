class ForceController {
  constructor() {
    this.frequencies = [0.5, 1.2, 2.5];
    this.modifiers = [1, 1, 1];
  }

  update(offset) {
    this.modifiers = this.frequencies.map(freq => cos(offset * freq));
  }

  getModifier(id) {
    return this.modifiers[id];
  }
}
