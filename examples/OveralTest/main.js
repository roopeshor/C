function init() {
  background("#000");
  stroke("#fff");
  strokeWidth(1);
  translate(W / 2, H / 2);
}
function regpoly() {
  init();
  equiTriangle(0, 0, 100)
}

function poly_() {
  init();
  ellipse(0, 0, 200, 100);
}
C(".test", poly_, {
  width: getWidth() * 3 / 4
})