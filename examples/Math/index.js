var W = getContentWidth(),
H = innerHeight;

C(
  function () {
    init_Canvas();
    var r = PI / 3;
    background(0);
    stroke(GREY);
    var unitLength = numberLine({
      includeLeftTip: 1,
      includeRightTip: 1
    });
    strokeWidth(1);
    noFill(GREEN_C);
    stroke(GREEN_C);
    circle(0, 0, unitLength);
    permaBackground();
    loop(function(){
      clear();
      arrow(0, 0, cos(r) * unitLength, sin(r) * unitLength, 30, 0.7);
      r -= PI / 500;

    }, "ex")
  },
  ".container",
  {
    width: W,
    height: H,
    name: "ex",
  }
);
