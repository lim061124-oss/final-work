function getGroupColor(id) {
  if (id === 0) return color(255, 80, 80);
  if (id === 1) return color(80, 255, 80);
  if (id === 2) return color(80, 150, 255);
}

function drawUI(factors) {
  for (let i = 0; i < 3; i++) {
    fill(getGroupColor(i));
    text(`Group ${i}: ${factors[i] > 0 ? "Attract" : "Repel"}`, 20, 30 + i * 20);
  }
}
