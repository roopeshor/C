let W, H, radius, animatedDrawingCfg, staticDrawingCfg;

function initSize () {
  W = getContentWidth() / 1.2;
  // W *= 1.5;
  H = (W / 16) * 9;
  radius = round(H / 2.1);
  animatedDrawingCfg = {
    width: W,
    height: H,
    name: "animatedCvs"
  };
  staticDrawingCfg = { width: W, height: H, name: "staticCvs" };
}
initSize();
function $ (id) {
  return document.querySelector(id);
}

const Static = $(".static");
const animated = $(".animated");
const shift = $("#shift");
const DC = {
  // drawingConfigs
  ppr: 15, // points per radius
  lw: 1, // line width
  tpf: 50, // time per frame,  time to draw a 2 pairs of line
  shift: 16
};
let points = [];
// custom color list
const colors = [
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
  ORANGE
];

function computePoints () {
  points = [];
  const ratio = 1 / DC.ppr;
  // points in a vertical radius line
  for (let i = 0; i <= DC.ppr; i++) points.push([0, i * radius * ratio]);

  // points on a arc
  for (let i = 0; i <= (PI * DC.ppr) / 2; i++) {
    const x = -sin(i / DC.ppr) * radius;
    const y = cos(i / DC.ppr) * radius;
    points.push([x, y]);
  }

  // points in a horizontal radius line
  for (let i = -DC.ppr; i <= 0; i++) points.push([i * radius * ratio, 0]);
}

computePoints();

shift.max = points.length - 1;

function linePairs (i) {
  // multiplying each positions by 1s and -1s to position correctly
  const actions = [
    [1, 1, 1, 1], // Left Bottom
    [-1, 1, -1, 1], // Right Bottom
    [1, -1, 1, -1], // Left Top
    [-1, -1, -1, -1] // Right top
  ];
  const l = points.length;
  i = abs(i);
  stroke(colors[i % colors.length]);
  for (const act of actions) {
    line(
      act[0] * points[i % l][0],
      act[1] * points[i % l][1],
      act[2] * points[(i + DC.shift) % l][0],
      act[3] * points[(i + DC.shift) % l][1]
    );
  }
}

function init () {
  strokeWidth(DC.lw);
  background(BLACK);
  translate(W / 2, H / 2);
  stroke(WHITE);
  noFill();
  circle(0, 0, radius);
}
function drawStatic () {
  init();
  for (let i = 0; i <= points.length; i++) {
    linePairs(i, points.length);
  }
}
function drawAnimated () {
  init();
  let i = 0;
  const a = C.canvasList.animatedCvs;
  if (a.currentLoop != undefined) noLoop();
  let count = 0;
  loop(function (elapsed) {
    count++;
    if (points.length <= i++) {
      noLoop();
    } else {
      linePairs(i, points.length);
      fill(BLACK);
      rect(98, -109, 100, 10);
      fill(WHITE);
      text(1000 / (elapsed / count), 100, -100);
    }
  }, "animatedCvs");
}

function drawEverything () {
  C(drawStatic, Static, staticDrawingCfg);
  C(drawAnimated, animated, animatedDrawingCfg);
}

drawEverything();

function updateDC (id, reverse) {
  let i1 = $("#" + id);
  let i2 = $("#" + id + "-op");

  if (reverse) {
    ii = i1;
    i1 = i2;
    i2 = ii;
  }
  const v = i1.value;
  i2.value = v;
  DC[id] = Number(v);
  computePoints();
  if (id === "tpf") {
    if (window.AIS !== undefined) {
      clearInterval(window.AIS);
      window.AIS = setInterval(incShift, v);
    }
  } else if (id === "ppr") {
    DC.shift = shift.value = $("#shift-op").value = DC.ppr + 1;
    shift.max = points.length - 1;
  }
  drawEverything();
}
function incShift () {
  const e1 = $("#shift");
  const e2 = $("#shift-op");
  const nv = Number(e1.value) + 1;
  e1.max = e2.max = nv;
  e1.value = e2.value = nv;
  DC.shift = nv;
  drawEverything();
}
function autoIncShift (el) {
  el.innerText = "Stop Auto Incrementing";
  el.onclick = function () {
    clearInterval(window.AIS);
    el.innerText = "Auto Increment Shift";
    el.setAttribute("onclick", "autoIncShift(this)");
  };
  window.AIS = setInterval(incShift, DC.tpf);
}

window.onresize = function () {
  initSize();
  computePoints();
  drawEverything();
};
