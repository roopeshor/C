const W = getContentWidth(),
H = innerHeight;
C(
  function () {
    background(0);
    fill(TRANSPARENT)
    strokeWidth(2);
    lineJoin(ROUND);
    translate(W/2, H/2);
    
    stroke(WHITE + "a0");
    line(0, -H, 0, H);
    line(-W, 0, W, 0);

    var radius = 10;
    for (var i = 3; i < 7; i++) {
      radius += 50
      stroke(TEAL_C);
      regularPolygonWithRadius(0, 0, i, radius);
      stroke(PURPLE_C + "50")
      circle(0, 0, radius)
    }
  },
  ".container",
  {
    width: W,
    height: H,
    name: "mycvs",
  }
);
