var w = W = getWidth();
if (w > 790) {
  W = w / 1.2
}
if (w > 1000) W = w / 1.4;
// W *= 1.5;
const H = (W / 16) * 9;
function getEl(id, before = "#") { return document.querySelector(before + id); }

var static = getEl("static", "."),
  animated = getEl("animated", "."),
  ext = getEl("ext", "."),
  shift = getEl("shift"),
  DC = {
    //drawingConfigs
    ppr: 15, // points per radius
    lw: 1, // line width
    tpf: 50, // time per frame,  time to draw a 2 pairs of line
  },
  radius = Math.round(H / 2.1),
  points = [],
  // custom color list
  colors = [
    "#236B8E",
    "#58C4DD",
    "#29ABCA",
    "#1C758A",
    "#55C1A7",
    "#49A88F",
    "#A6CF8C",
    "#83C167",
    "#77B05D",
    "#699C52",
    "#FFFF00",
    "#F4D345",
    "#E8C11C",
    "#F0AC5F",
    "#E1A158",
    "#C78D46",
    "#FF862F",
    "#FF8080",
    "#FC6255",
    "#E65A4C",
    "#C55F73",
    "#A24D61",
    "#B189C6",
    "#FFFFFF",
    "#BBBBBB",
  ];

function computePoints() {
  points = [];
  var ratio = 1 / DC.ppr;
  // points in a vertical radius line
  for (var i = 0; i <= DC.ppr; i++) points.push([0, i * radius * ratio]);

  // points on a arc
  for (var i = 0; i <= Math.PI * DC.ppr / 2; i++) {
    var x = -Math.sin(i / DC.ppr) * radius,
      y = Math.cos(i / DC.ppr) * radius;
    points.push([x, y]);
  }

  //points in a horizontal radius line
  for (var i = -DC.ppr; i <= 0; i++) points.push([i * radius * ratio, 0]);
}

computePoints();

DC.shift = DC.ppr + 1;
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
var animatedDrawingCfg = {
  width: W,
  autoPlay: false,
  thumbnail: function () {
    background("#000");
    translate(W / 2, H / 2);
    stroke("#fff");
    circle(0, 0, radius);
    linePairs(0, points.length);
    linePairs((points.length - DC.shift), points.length)
    Icons.playBtn();
  }
};
var a;
function drawAnimated() {
  init();
  var i = 0;
  a = this.ctx;
  loop(function () {
    linePairs(i, points.length);
    if (points.length <= i++) {
      Icons.playBtn();
      noLoop();
    };
  }, DC.tpf, this);
}

function drawEverything() {
  C(static, drawStatic, { width: W });
  C(animated, drawAnimated, animatedDrawingCfg);
}

drawEverything();

function updateDC(id, reverse) {
  var i1 = getEl(id);
  var i2 = getEl(id + "-op");

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
    DC.shift = shift.value = getEl("shift-op").value = DC.ppr + 1;
    shift.max = points.length - 1;
  }
  drawEverything();
}
function incShift() {
  var e1 = getEl("shift");
  var e2 = getEl("shift-op");
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