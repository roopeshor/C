var static = document.querySelector(".static");
var animated = document.querySelector(".animated");
var ext = document.querySelector(".ext");
const W = getWidth();
const H = (W / 16) * 9;

var animatedDrawingCfg = {
  width: W,
  autoPlay : false,
  thumbnail: function () {
    this.strokeWidth = dc.lw;
    this.background("#000");
    this.translate(this.W / 2, this.H / 2);
    this.stroke = "#fff";
    this.circle({
      p: [0, 0],
      r: radius
    });
    this.line(0, -radius, 0, radius);
    this.rest();
    this.drawPlayBtn();
  }
}
var dc = {
  //drawingConfigs
  ppr: 15, // points per radius
  lw: 0.8, // line width
  tpf: 50, // time per frame,  time to draw a 2 pairs of line
};
var radius = Math.round(H / 2.1);

var colors = [
  "#9CDCEB",
  "#76DDC0",
  "#5CD0B3",
  "#55C1A7",
  "#49A88F",
  "#58C4DD",
  "#29ABCA",
  "#236B8E",
  "#1C758A",
  "#A6CF8C",
  "#83C167",
  "#77B05D",
  "#699C52",
  "#FFEA94",
  "#F4D345",
  "#E8C11C",
  "#FFFF00",
  "#F9B775",
  "#F0AC5F",
  "#E1A158",
  "#C78D46",
  "#CD853F",
  "#8B4513",
  "#FF8080",
  "#FC6255",
  "#E65A4C",
  "#CF5044",
  "#FF862F",
  "#C55F73",
  "#A24D61",
  "#94424F",
  "#B189C6",
  "#9A72AC",
  "#715582",
  "#644172",
  "#FFFFFF",
  "#888888",
  "#736357",
  "#D147BD",
  "#DC75CD",
  "#00FF00",
];

var dots = [];


function computePoints () {
  dots = [];
  var ratio = 1 / dc.ppr;
  // points in a vertical radius line
  for (var i = 0; i <= dc.ppr; i++) dots.push([0, i * radius * ratio]);
  
  // points on a arc
  for (var i = 0; i <= Math.PI * dc.ppr / 2; i++) {
  var x = -Math.sin(i / dc.ppr) * radius,
      y = Math.cos(i / dc.ppr) * radius;
  dots.push([x, y]);
  }
  
  //points in a horizontal radius line
  for (var i = -dc.ppr; i <= 0; i++) dots.push([i * radius * ratio, 0]);
}

computePoints();

function linePairs(lineFunction, i, l) {
    this.stroke = colors[i % colors.length];
    // Left Bottom
    lineFunction(
        dots[i % l][0],
        dots[i % l][1],
        dots[(i + dc.ppr) % l][0],
        dots[(i + dc.ppr) % l][1]
    );

    // Right Bottom
    lineFunction(
        -dots[i % l][0],
        dots[i % l][1],
        -dots[(i + dc.ppr) % l][0],
        dots[(i + dc.ppr) % l][1]
    );
  
    //Left Top
    lineFunction(
        dots[i % l][0],
        -dots[i % l][1],
        dots[(i + dc.ppr) % l][0],
        -dots[(i + dc.ppr) % l][1]
    );
  
    // Right top
    lineFunction(
        -dots[i % l][0],
        -dots[i % l][1],
        -dots[(i + dc.ppr) % l][0],
        -dots[(i + dc.ppr) % l][1]
    );
}

function init (ctx) {
    ctx.strokeWidth = dc.lw;
    ctx.background("#000");
    ctx.translate(ctx.W / 2, ctx.H / 2);
    ctx.stroke = "#fff";
    ctx.circle({
      p: [0, 0],
      r: radius
    });
}
function drawStatic() {
    init(this);
    for (var i = 0; i <= dots.length; i++) {
      linePairs(this.line, i, dots.length);
    }
}

function drawAnimated() {
  init(this);
  var i = 0;
  this.startLoop(function () {
    linePairs(this.line, i, dots.length);
    if (i >= dots.length){
      this.stopLoop(this.drawPlayBtn);
    };
    i++;
  }, dc.tpf);
}

C(static, drawStatic, {width: W});
C(animated, drawAnimated, animatedDrawingCfg);

function render (id) {
  var v = document.querySelector("#" + id).value;
  document.querySelector("#" + id + "-op").value = v;
  if (id == "tpf") document.querySelector("#" + id + "-op").value+= " ms"
  dc[id] = Number(v);
  computePoints();
  C(static, drawStatic, {width: W});
  C(animated, drawAnimated, animatedDrawingCfg);
}
