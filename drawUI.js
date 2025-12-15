function drawUI(factors) {
  let barWidth = 100;
  let labels = ["Group 0", "Group 1", "Group 2"];

  fill(255);
  noStroke();
  text("Force State (Attract / Repel)", 150, 20);

  for (let i = 0; i < 3; i++) {
    let val = factors[i];
    let col = getGroupColor(i);

    // Text Label
    fill(col);
    noStroke();
    text(labels[i] + " : " + (val > 0 ? "Attract" : "Repel"), 80, 45 + i * 25);

    // Outline of bar
    noFill();
    stroke(col);
    rect(150, 35 + i * 25, barWidth, 10);

    // Fill bar (-1 ~ 1 을 0~100 으로 변환)
    let amount = map(val, -1, 1, 0, barWidth);

    noStroke();
    fill(val > 0 ? color(255, 255, 255) : color(255, 80, 80));
    rect(150, 35 + i * 25, amount, 10);
  }
}
