var w, H, radius, animatedDrawingCfg, staticDrawingCfg;

function initSize(){
  W = getContentWidth()/1.2;
  // W *= 1.5;
  H = (W / 16) * 9;
  radius = round(H / 2.1);
  animatedDrawingCfg = {
    width: W,
    height: H,
    name:"animatedCvs"
  };
  staticDrawingCfg = { width: W , height: H, name: "staticCvs" }
}
initSize();
function $(id) { return document.querySelector(id); }

var static = $(".static"),
  animated = $(".animated"),
  rand = $(".rand"),
  shift = $("#shift"),
  DC = {
    //drawingConfigs
    ppr: 15, // points per radius
    lw: 1, // line width
    tpf: 50, // time per frame,  time to draw a 2 pairs of line
    shift: 16
  },
  points = [],
  // custom color list
  colors = [
    DARK_BLUE,
    DARK_BROWN,
    LIGHT_BROWN,
    BLUE_A,
    BLUE_B,
    BLUE_C,
    BLUE_D,
    BLUE_E,
    TEAL_A,
    TEAL_B,
    TEAL_C,
    TEAL_D,
    TEAL_E,
    GREEN_A,
    GREEN_B,
    GREEN_C,
    GREEN_D,
    GREEN_E,
    YELLOW_A,
    YELLOW_B,
    YELLOW_C,
    YELLOW_D,
    YELLOW_E,
    GOLD_A,
    GOLD_B,
    GOLD_C,
    GOLD_D,
    GOLD_E,
    RED_A,
    RED_B,
    RED_C,
    RED_D,
    RED_E,
    MAROON_A,
    MAROON_B,
    MAROON_C,
    MAROON_D,
    MAROON_E,
    PURPLE_A,
    PURPLE_B,
    PURPLE_C,
    PURPLE_D,
    PURPLE_E,
    WHITE,
    LIGHT_GREY,
    GREY_BROWN,
    PINK,
    LIGHT_PINK,
    GREEN_SCREEN,
    ORANGE,
  ];

function computePoints() {
  points = [];
  var ratio = 1 / DC.ppr;
  // points in a vertical radius line
  for (var i = 0; i <= DC.ppr; i++) points.push([0, i * radius * ratio]);

  // points on a arc
  for (var i = 0; i <= PI * DC.ppr / 2; i++) {
    var x = -sin(i / DC.ppr) * radius,
      y = cos(i / DC.ppr) * radius;
    points.push([x, y]);
  }

  //points in a horizontal radius line
  for (var i = -DC.ppr; i <= 0; i++) points.push([i * radius * ratio, 0]);
}

computePoints();

shift.max = points.length - 1;

function linePairs(i) {
  // multiplying each positions by 1s and -1s to position correctly
  var actions = [
    [1, 1, 1, 1], // Left Bottom
    [-1, 1, -1, 1], // Right Bottom
    [1, -1, 1, -1], //Left Top
    [-1, -1, -1, -1], // Right top
  ], l = points.length;
  i = abs(i);
  stroke(colors[i % colors.length]);
  for (var act of actions) {
    line(
      act[0] * points[i % l][0],
      act[1] * points[i % l][1],
      act[2] * points[(i + DC.shift) % l][0],
      act[3] * points[(i + DC.shift) % l][1],
    );
  }
}

function init() {
  strokeWidth(DC.lw);
  background("#000");
  translate(W / 2, H / 2);
  stroke("#fff");
  noFill();
  circle(0, 0, radius);
}
function drawStatic() {
  init();
  for (var i = 0; i <= points.length; i++) {
    linePairs(i, points.length);
  }
}
function drawAnimated() {
  init();
  var i = 0;
  var a = C.canvasList.animatedCvs;
  if (a.currentLoop != undefined) noLoop();
  var count = 0;
  loop(function (elapsed) {
    count++;
    if (points.length <= i++) {
      noLoop();
    } else {
      fill("#000");
      rect(98, -109, 100, 10);
      fill("#fff")
      text(elapsed/count, 100, -100)
      linePairs(i, points.length);
    }
  }, DC.tpf, "animatedCvs");
}

function drawRandom() {
  background(DARK_BROWN);
  var count = 0;
  loop(function (elapsed) {
    count++;
    background("#000")
    text(elapsed/count, 100, 50)
    stroke(DARK_BLUE);
    line(elapsed/100, 0, 150, 150)
  }, DC.tpf, "rand")
}

function drawEverything() {
  C(drawStatic,static, staticDrawingCfg);
  C(drawAnimated, animated, animatedDrawingCfg);
  // C(drawRandom, rand, {width: 300, height: 300, name: "rand"})
}

drawEverything();

function updateDC(id, reverse) {
  var i1 = $("#" + id);
  var i2 = $("#" + id + "-op");

  if (reverse) {
    ii = i1;
    i1 = i2;
    i2 = ii;
  }
  var v = i1.value;
  i2.value = v;
  DC[id] = Number(v);
  computePoints();
  if (id == "tpf") {
    if (window.AIS != undefined) {
      clearInterval(AIS);
      window.AIS = setInterval(incShift, v);
    }
  } else if (id == "ppr") {
    DC.shift = shift.value = $("#shift-op").value = DC.ppr + 1;
    shift.max = points.length - 1;
  }
  drawEverything();
}
function incShift() {
  var e1 = $("#shift");
  var e2 = $("#shift-op");
  var nv = Number(e1.value) + 1;
  e1.max = e2.max = nv;
  e1.value = e2.value = nv;
  DC.shift = nv;
  drawEverything();
}
function autoIncShift(el) {
  el.innerText = "Stop Auto Incrementing";
  el.onclick = function () {
    clearInterval(window.AIS);
    el.innerText = "Auto Increment Shift";
    el.setAttribute("onclick", "autoIncShift(this)");
  }
  window.AIS = setInterval(incShift, DC.tpf);
}

window.onresize = function () {
  initSize();
  computePoints();
  drawEverything();
}