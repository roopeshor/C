C(
  function () {
    background(0);
    stroke(TEAL_C);
    fill(TRANSPARENT)
    strokeWidth(2);
    lineJoin(ROUND);

    var len = 100, x = 300, y = 300;
    equiTriangle(x, y, 400, 0);
    regularPolygon(300, 300, 6, len);
    for (var i = 1/2, e = PI/3; i <= 5; i+=2) {
      line(
        cos(i * e) * len/1.15 + x,
        sin(i * e) * len/1.15 + y,
        cos((i+1) * e) * len/1.15 + x,
        sin((i+1) * e) * len/1.15 + y
      );
    }
  },
  ".container",
  {
    width: getContentWidth(),
    height: innerHeight,
    name: "mycvs",
  }
);
