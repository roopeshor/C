(function(){'use strict';
var g = {BLACK:"#000000", BLUE_A:"#C7E9F1", BLUE_B:"#9CDCEB", BLUE_C:"#58C4DD", BLUE_D:"#29ABCA", BLUE_E:"#1C758A", DARKER_GRAY:"#222222", DARKER_GREY:"#222222", DARK_BLUE:"#236B8E", DARK_BROWN:"#8B4513", DARK_GRAY:"#444444", DARK_GREY:"#444444", GOLD_A:"#F7C797", GOLD_B:"#F9B775", GOLD_C:"#F0AC5F", GOLD_D:"#E1A158", GOLD_E:"#C78D46", GRAY:"#888888", GREEN_A:"#C9E2AE", GREEN_B:"#A6CF8C", GREEN_C:"#83C167", GREEN_D:"#77B05D", GREEN_E:"#699C52", GREEN_SCREEN:"#00FF00", GREY:"#888888", GREY_BROWN:"#736357", 
LIGHT_BROWN:"#CD853F", LIGHT_GRAY:"#BBBBBB", LIGHT_GREY:"#BBBBBB", LIGHT_PINK:"#DC75CD", MAROON_A:"#ECABC1", MAROON_B:"#EC92AB", MAROON_C:"#C55F73", MAROON_D:"#A24D61", MAROON_E:"#94424F", ORANGE:"#FF862F", PINK:"#D147BD", PURPLE_A:"#CAA3E8", PURPLE_B:"#B189C6", PURPLE_C:"#9A72AC", PURPLE_D:"#715582", PURPLE_E:"#644172", RED_A:"#F7A1A3", RED_B:"#FF8080", RED_C:"#FC6255", RED_D:"#E65A4C", RED_E:"#CF5044", TEAL_A:"#ACEAD7", TEAL_B:"#76DDC0", TEAL_C:"#5CD0B3", TEAL_D:"#55C1A7", TEAL_E:"#49A88F", WHITE:"#FFFFFF", 
YELLOW_A:"#FFF1B6", YELLOW_B:"#FFEA94", YELLOW_C:"#FFFF00", YELLOW_D:"#F4D345", YELLOW_E:"#E8C11C"};
const aa = Math.acos, ba = Math.asin, ca = Math.atan, da = Math.atan2, ha = Math.cbrt, ia = Math.ceil, ja = Math.cos, ka = Math.cosh, la = Math.exp, ma = Math.floor, na = Math.log, oa = Math.log2, pa = Math.log10, qa = Math.max, sa = Math.min, ta = Math.pow, ua = Math.random, va = Math.round, wa = Math.sign, xa = Math.sin, ya = Math.sqrt, za = Math.tan, Aa = Math.tanh;
var k = {};
k.abs = Math.abs;
k.acos = aa;
k.asin = ba;
k.atan = ca;
k.atan2 = da;
k.cbrt = ha;
k.ceil = ia;
k.cos = ja;
k.cosh = ka;
k.dist = function(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};
k.exp = la;
k.floor = ma;
k.limit = function(a, b = 0, c = 1) {
  return Math.min(Math.max(a, b), c);
};
k.log = na;
k.log10 = pa;
k.log2 = oa;
k.max = qa;
k.min = sa;
k.pow = ta;
k.random = ua;
k.randomInt = function(a = 10, b = 0) {
  return Math.round(Math.random() * (a - b) + b);
};
k.round = va;
k.sgn = wa;
k.sigmoid = function(a) {
  return 1.0 / (1 + Math.exp(-a));
};
k.sin = xa;
k.sqrt = ya;
k.tan = za;
k.tanh = Aa;
Object.keys(g);
function n(a, b, c) {
  0 > c && (c += 1);
  1 < c && --c;
  return c < 1 / 6 ? a + 6 * (b - a) * c : .5 > c ? b : c < 2 / 3 ? a + (b - a) * (2 / 3 - c) * 6 : a;
}
;function p(a, b, c, e) {
  b = b || window;
  c = void 0 === c || null === c ? window : c;
  b = b || window;
  e = "function" === typeof e ? e : function(d) {
    console.warn('You changed value of "' + d + '" which C uses. Be careful');
  };
  for (let d = 0, f = Object.keys(a); d < f.length; d++) {
    c ? function(h, l, m, x) {
      Object.defineProperty(m, h, {configurable:!0, enumerable:!0, get:function() {
        return l;
      }, set:function(y) {
        Object.defineProperty(m, h, {configurable:!0, enumerable:!0, value:y, writable:!0});
        x(h);
      }});
    }(f[d], a[f[d]], b, e) : window[f[d]] = a[f[d]];
  }
}
;const Ba = {width:200, height:200, dpr:Math.ceil(devicePixelRatio || 1), _doFill:!0, _doStroke:!0, fillStyle:"#ffffff", strokeStyle:"#000000", fontSize:"20px", fontfamily:"sans-serif", _ColorMode:"rgba"};
function Ca(a) {
  for (let b = 0, c = Object.keys(Ba); b < c.length; b++) {
    const e = c[b];
    void 0 === a[e] && (a[e] = Ba[e]);
  }
}
function w(a, b = document.body, c = {}) {
  function e() {
    w.getResizedCanvas(d, c);
    d.context = Object.assign(d.getContext("2d"), c);
    d.context.setTransform(c.dpr, 0, 0, c.dpr, 0, 0);
    w.workingCanvas = d.context;
  }
  Ca(c);
  let d = w.makeCanvas(c);
  "string" === typeof b && (b = document.querySelector(b));
  let f;
  if (void 0 != c.name) {
    f = c.name;
    const h = document.getElementById(f);
    if (h instanceof HTMLElement) {
      d = h;
      e();
      a();
      return;
    }
  } else {
    for (; void 0 != document.getElementById("canvas-" + w.nameID);) {
      w.nameID++;
    }
    f = "canvas-" + w.nameID;
    c.name = f;
  }
  d.id = f;
  d.classList.add(f);
  b.appendChild(d);
  e();
  w.canvasList[f] = d.context;
  a();
}
w.canvasList = {};
w.nameID = 0;
w.workingCanvas = void 0;
w.getContainerWidth = function(a = document.body) {
  a = window.getComputedStyle(a);
  return parseInt(a.width) - parseInt(a.marginLeft) - parseInt(a.marginRight) - parseInt(a.paddingRight) - parseInt(a.paddingLeft);
};
w.getResizedCanvas = function(a, b) {
  const c = b.width, e = b.height;
  b = b.dpr;
  a.style.width = c + "px";
  a.style.height = e + "px";
  a.width = b * c;
  a.height = b * e;
};
w.makeCanvas = function(a) {
  const b = document.createElement("canvas");
  this.getResizedCanvas(b, a);
  return b;
};
w.addExtension = function(a, b) {
  p(a, window, !b);
  p(a, w.extensions, !b);
};
window.C = w;
function Da(a) {
  let b, c, e, d = 255, f = "";
  "number" === typeof a[0] ? (1 === a.length ? e = c = b = a[0] : 2 === a.length ? (b = a[0], c = a[1], e = 0) : 3 === a.length ? (b = a[0], c = a[1], e = a[2]) : 4 === a.length && (b = a[0], c = a[1], e = a[2], d = a[3]), a = w.workingCanvas._ColorMode, "HSL" === a ? f = `hsl(${b}, ${c}, ${e})` : "rgb" === a ? f = `rgb(${b}, ${c}, ${e})` : "rgba" === a && (f = `rgba(${b}, ${c}, ${e}, ${d})`)) : f = a[0];
  return f;
}
function A(a, b, c, e) {
  const d = w.workingCanvas;
  d.beginPath();
  d.moveTo(a, b);
  d.lineTo(c, e);
  d.stroke();
  d.closePath();
}
function Ea() {
  const a = Da(arguments), b = w.workingCanvas;
  b.backgroundColor = a;
  b.save();
  Fa();
  b.fillStyle = a;
  b.fillRect(0, 0, b.width, b.height);
  b.restore();
}
function Ga() {
  w.workingCanvas._doStroke = !1;
}
function H(a, b = 0) {
  w.workingCanvas.translate(a, b);
}
function I(a) {
  w.workingCanvas.lineWidth = Number(a);
}
function J(a, b = a) {
  w.workingCanvas.scale(a, b);
}
function K(a) {
  w.workingCanvas.rotate(a);
}
function Fa() {
  const a = w.workingCanvas, b = a.dpr;
  a.setTransform(b, 0, 0, b, 0, 0);
}
function P() {
  const a = w.workingCanvas;
  if (0 !== arguments.length) {
    const b = Da(arguments);
    a.strokeStyle = b;
    a._doStroke = !0;
  } else {
    a.stroke();
  }
}
function Q() {
  const a = w.workingCanvas;
  if (0 !== arguments.length) {
    const b = Da(arguments);
    a.fillStyle = b;
    a._doFill = !0;
  } else {
    a.fill();
  }
}
function Ha(a, b, c, e) {
  const d = w.workingCanvas;
  d.yAxisInveted ? (J(-1), d._doFill ? d.fillText(a, b, -c, e) : d._doStroke && d.strokeText(a, b, -c, e), J(-1)) : d._doFill ? d.fillText(a, b, c, e) : d._doStroke && d.strokeText(a, b, c, e);
}
function Ia(a) {
  return w.workingCanvas.measureText(a);
}
function Ja(a) {
  const b = w.workingCanvas;
  b.fontSize = "number" === typeof a ? a + "px" : a;
  b.font = this.getFont();
}
const R = [];
let Ka = 0, La = window.performance.now();
var U = {arc:function(a, b, c, e, d) {
  e = e || 0;
  const f = w.workingCanvas;
  f.beginPath();
  f.arc(a, b, c, e || 0, isNaN(d) ? 2 * Math.PI : d);
  f._doFill && f.fill();
  f._doStroke && f.stroke();
  f.closePath();
}};
U.background = Ea;
U.bezierCurve = function(a, b, c, e, d, f) {
  const h = w.workingCanvas, l = h._pathStart;
  l || h.beginPath();
  h.bezierCurveTo(a, b, c, e, d, f);
  l || (h._doFill && h.fill(), h._doStroke && h.stroke(), h.closePath());
};
U.circle = function(a, b, c) {
  const e = w.workingCanvas;
  e.beginPath();
  e.arc(a, b, c, 0, 2 * Math.PI);
  e._doFill && e.fill();
  e._doStroke && e.stroke();
  e.closePath();
};
U.clear = function(a, b, c, e) {
  const d = w.workingCanvas;
  c = c || d.width;
  e = e || d.height;
  d.clearRect(a || 0, b || 0, c, e);
};
U.ellipse = function(a, b, c, e, d = 0, f = 0, h = 2 * Math.PI, l = !1) {
  const m = w.workingCanvas;
  m.beginPath();
  m.ellipse(a, b, c, e, d, f, h, l);
  m._doFill && m.fill();
  m._doStroke && m.stroke();
  m.closePath();
};
U.endPath = function() {
  const a = w.workingCanvas;
  a.closePath();
  a._pathStart = !1;
};
U.equiTriangle = function(a, b, c, e = 0) {
  this.regularPolygon(a, b, 3, c, e);
};
U.fill = Q;
U.fontFamily = function(a) {
  const b = w.workingCanvas;
  b.fontFamily = a;
  b.font = this.getFont();
};
U.fontSize = Ja;
U.getCanvasData = function(a = "image/png") {
  return w.workingCanvas.canvas.toDataURL(a);
};
U.getDrawConfigs = function() {
  const a = w.workingCanvas;
  return {stroke:a.strokeStyle, fill:a.fillStyle, strokeWidth:a.lineWidth, doStroke:a._doStroke, doFill:a._doFill, };
};
U.getFPS = function(a = 100) {
  const b = window.performance.now(), c = b - La;
  R.push(c);
  Ka += c;
  La = b;
  R.length > a && (Ka -= R.shift());
  return R.length / Ka * 1000;
};
U.getFill = function() {
  return w.workingCanvas.fillStyle;
};
U.getFont = function() {
  const a = w.workingCanvas;
  return a.fontSize + " " + a.fontFamily;
};
U.getStroke = function() {
  return w.workingCanvas.strokeStyle;
};
U.line = A;
U.lineCap = function(a) {
  w.workingCanvas.lineCap = a;
};
U.lineJoin = function(a) {
  w.workingCanvas.lineJoin = a;
};
U.lineTo = function(a, b) {
  w.workingCanvas.lineTo(a, b);
};
U.linearGradient = function(a, b, c) {
  a = w.workingCanvas.createLinearGradient(a[0], a[1], b[0], b[1]);
  if (Array.isArray(c)) {
    b = {};
    const e = 1 / c.length;
    for (let d = 0; d < c.length; d++) {
      b[e * d] = c[d];
    }
    c = b;
  }
  for (let e = Object.keys(c), d = 0; d < e.length; d++) {
    b = e[d], a.addColorStop(b, c[b]);
  }
  return a;
};
U.loop = function(a, b, c) {
  function e() {
    w.workingCanvas = d;
    d.currentLoop = window.requestAnimationFrame(e);
    a();
  }
  let d = w.workingCanvas;
  b ? d = w.canvasList[b] : b = d.name;
  isNaN(c) ? e() : d.currentLoop = setInterval(function() {
    w.workingCanvas = d;
    a();
  }, c);
};
U.measureText = Ia;
U.moveTo = function(a, b) {
  const c = w.workingCanvas;
  c._pathStart || c.beginPath();
  c.moveTo(a, b);
};
U.noFill = function() {
  w.workingCanvas._doFill = !1;
};
U.noLoop = function() {
  const a = w.workingCanvas;
  clearInterval(a.currentLoop);
  window.cancelAnimationFrame(a.currentLoop);
};
U.noStroke = Ga;
U.permaBackground = function() {
  const a = this.getCanvasData(), b = w.workingCanvas.canvas;
  b.style.background = 'url("' + a + '")';
  b.style.backgroundPosition = "center";
  b.style.backgroundSize = "cover";
};
U.point = function(a, b, c = 1) {
  const e = w.workingCanvas;
  e.arc(a, b, c / 2, 0, 2 * Math.PI);
  e.fill();
};
U.polygon = function() {
  const a = arguments;
  if (2 < a.length) {
    const b = w.workingCanvas, c = a[0];
    b.beginPath();
    b.moveTo(c[0], c[1]);
    for (let e = 1; e < a.length; e++) {
      b.lineTo(a[e][0], a[e][1]);
    }
    b.lineTo(c[0], c[1]);
    b._doFill && b.fill();
    b._doStroke && b.stroke();
    b.closePath();
  }
};
U.quad = function(a, b, c, e, d, f, h, l) {
  const m = w.workingCanvas;
  m.beginPath();
  m.moveTo(a, b);
  m.lineTo(c, e);
  m.lineTo(d, f);
  m.lineTo(h, l);
  m.lineTo(a, b);
  m.lineTo(a, b);
  m._doFill && m.fill();
  m._doStroke && m.stroke();
  m.closePath();
};
U.rect = function(a, b, c, e) {
  const d = w.workingCanvas;
  d.beginPath();
  d.rect(a, b, c, e);
  d._doFill && d.fill();
  d._doStroke && d.stroke();
};
U.regularPolygon = function(a, b, c, e, d = 0) {
  e /= 2 * Math.sin(Math.PI / c);
  this.regularPolygonWithRadius(a, b, c, e, d);
};
U.regularPolygonWithRadius = function(a, b, c, e, d = 0) {
  let f = 0;
  const h = 2 * Math.PI / c, l = w.workingCanvas;
  d += h / 2;
  const m = [Math.cos(d) * e + a, Math.sin(d) * e + b, ];
  l.beginPath();
  for (l.moveTo(m[0], m[1]); f++ < c;) {
    l.lineTo(Math.cos(f * h + d) * e + a, Math.sin(f * h + d) * e + b);
  }
  l.lineTo(m[0], m[1]);
  l.closePath();
  l._doFill && l.fill();
  l._doStroke && l.stroke();
};
U.rest = Fa;
U.restore = function() {
  w.workingCanvas.restore();
};
U.rotate = K;
U.save = function() {
  w.workingCanvas.save();
};
U.saveCanvas = function(a = "drawing", b = "image/png") {
  b = this.getCanvasData().replace(b, "image/octet-stream");
  const c = document.createElement("a");
  c.download = a + ".png";
  c.href = b;
  c.click();
};
U.scale = J;
U.sector = function(a, b, c, e, d, f, h) {
  const l = w.workingCanvas;
  l.moveTo(a, b);
  const m = this.getFill();
  l.arc(a, b, e, d, f);
  this.fill(h || w.workingCanvas.backgroundColor);
  l.arc(a, b, c, d, f);
  this.fill(m);
};
U.setImageSmoothing = function(a) {
  w.workingCanvas.imageSmoothingEnabled = !!a;
};
U.setTransform = function(a, b, c, e, d, f) {
  const h = w.workingCanvas;
  h.setTransform(a, b, c, e, d, f);
  h.scale(h.dpr, h.dpr);
};
U.square = function(a, b, c) {
  this.rect(a, b, c, c);
};
U.startPath = function() {
  const a = w.workingCanvas;
  a.beginPath();
  a._pathStart = !0;
};
U.stroke = P;
U.strokeWidth = I;
U.text = Ha;
U.transform = function(a, b, c, e, d, f) {
  w.workingCanvas.transform(a, b, c, e, d, f);
};
U.translate = H;
U.triangle = function(a, b, c, e, d, f) {
  const h = w.workingCanvas;
  h.beginPath();
  h.moveTo(a, b);
  h.lineTo(c, e);
  h.lineTo(d, f);
  h.lineTo(a, b);
  h._doFill && h.fill();
  h._doStroke && h.stroke();
  h.closePath();
};
const Ma = {CENTERX:function() {
  return w.workingCanvas.width / 2;
}, CENTERY:function() {
  return w.workingCanvas.height / 2;
}, };
function Na(a, b) {
  Object.defineProperty(window, a, {configurable:!0, enumerable:!0, get:b, set:function(c) {
    Object.defineProperty(window, a, {configurable:!0, enumerable:!0, value:c, writable:!0, });
  }, });
}
for (let a = Object.keys(Ma), b = 0; b < a.length; b++) {
  const c = a[b];
  Na(c, Ma[c]);
}
function Oa(a, b, c, e = !1) {
  const d = [];
  if (e) {
    for (; b >= a; b -= c) {
      d.push(b);
    }
  } else {
    for (; a <= b; a += c) {
      d.push(a);
    }
  }
  return d;
}
function V(a, b = {}) {
  for (let c = 0, e = Object.keys(a); c < e.length; c++) {
    const d = e[c], f = a[d][1];
    if ("number" === f && isNaN(b[d]) || "array" === f && !Array.isArray(b[d]) || void 0 === b[d] || null === b[d]) {
      b[d] = a[d][0];
    }
  }
  return b;
}
function Pa(a, b, c, e, d = 10, f = 0.7) {
  const h = Math.atan2(e - b, c - a);
  Y(c, e, d, h, f);
  f = Math.atan(f / 2);
  A(a, b, c - Math.cos(h) * d * Math.cos(f), e - Math.sin(h) * d * Math.cos(f));
}
function Qa(a = {}) {
  var b = w.workingCanvas, c = {length:[b.height, "number"], rotation:[Math.PI / 2, "number"], textRotation:[-Math.PI / 2, "number"], includeNumbers:[!1], includeTick:[!1], includeLeftTip:[!0], includeRightTip:[!0], };
  b = V({length:[b.width, "number"], includeNumbers:[!1], includeTick:[!1], includeLeftTip:[!0], includeRightTip:[!0], textDirection:[-0.3, -1], }, a.xAxis);
  c = V(c, a.yAxis);
  a = a.center || [0, 0];
  var e = b.range || [-8, 8, 1], d = c.range || [-8, 8, 1];
  e = b.length / 2 + e[0] / e[2] * (b.length / ((e[1] - e[0]) / e[2]));
  d = c.length / 2 + d[0] / d[2] * (c.length / ((d[1] - d[0]) / d[2]));
  H(a[0], a[1]);
  H(e, 0);
  b = Ra(b);
  H(-e, d);
  c = Ra(c);
  e = [b.unitLength, c.unitLength];
  H(-a[0], -a[1] - d);
  return {unit:e, xAxis:b, yAxis:c, };
}
function Y(a, b, c = 10, e = 0, d = 2) {
  const f = w.workingCanvas;
  d = Math.atan(d / 2);
  f.beginPath();
  f.moveTo(a, b);
  f.lineTo(a - c * Math.cos(e - d), b - c * Math.sin(e - d));
  f.lineTo(a - c * Math.cos(e + d), b - c * Math.sin(e + d));
  f.lineTo(a, b);
  f._doFill ? f.fill() : f.stroke();
}
function Ra(a = {}) {
  function b() {
    P(C);
    I(S);
    var t = x ? 1 : 0;
    const E = y ? D.length - 1 : D.length;
    for (; t < E && 0 > h.indexOf(D[0][t]); t++) {
      const u = D[t];
      if (0 === Number(u) && L) {
        continue;
      }
      let T = W;
      -1 < m.indexOf(u) && (T *= X);
      A(G * t, -T / 2, G * t, T / 2);
    }
  }
  function c() {
    const t = 0 < l.length ? l : D;
    Q(a.textColor);
    Ja(F);
    const E = -F / 3 * Math.cos(q) + z[1] * F;
    var u = x ? 1 : 0;
    const T = y ? t.length - 1 : t.length;
    for (; u < T && 0 > h.indexOf(t[u]); u++) {
      const ea = t[u].toFixed(v);
      if (0 === Number(ea) && L) {
        continue;
      }
      const fa = Ia(ea).width, ra = -fa / 2 * Math.cos(q) + z[0] * F + F / 2 * Math.sin(q);
      H(G * u + ra, E - fa * Math.sin(q));
      K(q);
      Ha(ea, 0, 0);
      K(-q);
      H(-(G * u + ra), -(E - fa * Math.sin(q)));
    }
  }
  V({length:[w.workingCanvas.width, "number"], rotation:[0], center:[[0, 0]], range:[[-8, 8, 1], "array"], numbersToExclude:[[]], numbersToInclude:[[]], numbersWithElongatedTicks:[[]], includeLeftTip:[!1], includeRightTip:[!1], includeNumbers:[!0], tipWidth:[20, "number"], tipSizeRatio:[1, "number"], color:["#888888"], lineWidth:[3, "number"], includeTick:[!0], excludeOriginTick:[!1], longerTickMultiple:[1.5, "number"], tickHeight:[15, "number"], textDirection:[[-0.3, -1]], textColor:["#FFFFFF"], 
  textSize:[17, "number"], textRotation:[0], }, a);
  const e = a.length, d = a.rotation, f = a.center, h = a.numbersToExclude, l = a.numbersToInclude, m = a.numbersWithElongatedTicks, x = a.includeLeftTip, y = a.includeRightTip, B = a.tipWidth, M = a.tipSizeRatio, C = a.color, S = a.lineWidth, L = a.excludeOriginTick, X = a.longerTickMultiple, W = a.tickHeight, z = a.textDirection, F = a.textSize, q = a.textRotation;
  let v = a.decimalPlaces;
  var r = a.range;
  Array.isArray(r) && 2 === r.length && (r = [r[0], r[1], 1]);
  isNaN(v) && (v = (r[2].toString().split(".")[1] || []).length || 0);
  const N = r[0], O = r[1];
  r = r[2];
  const G = e / ((O - N) / r), D = Oa(N, O, r);
  H(f[0], f[1]);
  K(d);
  H(-e / 2, 0);
  a.includeTick && b();
  a.includeNumbers && c();
  H(e / 2, 0);
  (function() {
    P(C);
    I(S);
    Q(C);
    const t = Math.atan(M / 2);
    let E = -e / 2, u = e / 2;
    x && (Y(E, 0, B, Math.PI, M), E += B * Math.cos(t));
    y && (Y(u, 0, B, 0, M), u -= B * Math.cos(t));
    A(E, 0, u, 0);
  })();
  K(-d);
  H(-f[0], -f[1]);
  return {unitLength:G, tickList:D, };
}
var Z = {};
Z.arrow = Pa;
Z.arrowHead = Y;
Z.axes = Qa;
Z.clear = function(a, b, c, e) {
  const d = w.workingCanvas;
  a = a || -d.width / 2;
  b = b || -d.height / 2;
  c = c || 2 * d.width;
  e = e || 2 * d.height;
  d.clearRect(a, b, c, e);
};
Z.doubleArrow = function(a, b, c, e, d = 10, f = 0.6) {
  var h = Math.atan(f / 2);
  const l = Math.atan2(e - b, c - a), m = Math.cos(l) * d * Math.cos(h);
  h = Math.sin(l) * d * Math.cos(h);
  Y(a, b, d, Math.PI + l, f);
  Pa(a + m, b + h, c, e, d, f);
};
Z.initCenteredCanvas = function() {
  Ea(0);
  Q("#FFFFFF");
  P("#FFFFFF");
  I(2);
  Ga();
  H(CENTERX, CENTERY);
  J(1, -1);
  Ja(20);
  w.workingCanvas.yAxisInveted = !0;
};
Z.numberLine = Ra;
Z.numberPlane = function(a = {}) {
  var b = w.workingCanvas, c = {textDirection:[[0, 0.8]], length:[b.height, "number"], textRotation:[-Math.PI / 2, "number"], excludeOriginTick:[!0], includeLeftTip:[!1], includeRightTip:[!1], includeNumbers:[!0], includeTick:[!0], };
  b = V({textDirection:[[0, -1.1]], length:[b.width, "number"], excludeOriginTick:[!0], includeLeftTip:[!1], includeRightTip:[!1], includeNumbers:[!0], includeTick:[!0], }, a.xAxis);
  c = V(c, a.yAxis);
  const e = V({lineWidth:[1, "number"], color:["#58C4DDa0"], subgrids:[1, "number"], subgridLineColor:["#88888850"], subgridLineWidth:[0.7, "number"], }, a.grid), d = e.subgrids;
  a = a.center || [0, 0];
  var f = b.range || [-8, 8, 1], h = c.range || [-8, 8, 1];
  const l = (f[1] - f[0]) / f[2], m = (h[1] - h[0]) / h[2], x = b.length / l, y = c.length / m, B = f[0] / f[2] * x, M = f[1] / f[2] * x, C = h[0] / h[2] * y, S = h[1] / h[2] * y;
  f = b.length / 2 + B;
  h = c.length / 2 + C;
  const L = [x / d, y / d];
  H(a[0] + f, a[1]);
  (function() {
    function X(v, r, N, O, G, D) {
      H(v, r);
      I(e.lineWidth);
      P(e.color);
      A(N, O, G, D);
    }
    function W(v, r, N, O) {
      I(e.subgridLineWidth);
      P(e.subgridLineColor);
      A(v, r, N, O);
    }
    H(B, 0);
    var z = L[0];
    const F = L[1];
    for (var q = 0; q <= l; q++) {
      X(q * x, 0, 0, C, 0, S);
      for (let v = 1; v <= d && q < l; v++) {
        W(v * z, C, v * z, S);
      }
      H(-q * x);
    }
    H(-B, C);
    for (z = 0; z <= m; z++) {
      X(0, z * y, B, 0, M, 0);
      for (q = 1; q <= d && z < m; q++) {
        W(B, q * F, M, q * F);
      }
      H(0, -z * y);
    }
    H(0, -C);
  })();
  b = Qa({xAxis:b, yAxis:c, });
  c = b.unit;
  H(-(a[0] + f), -a[1] - h);
  return {unit:c, subgridUnit:L, xAxis:b.xAxis, yAxis:b.yAxis, };
};
Z.scale = J;
p({E:2.718281828459045, LN10:2.302585092994046, LN2:0.6931471805599453, PI:3.141592653589793, SQRT2:1.4142135623730951, TAU:6.283185307179586}, window, !1);
p(k);
p(Object.assign({TRANSPARENT:"rgba(0,0,0,0)"}, g), window, !1);
p({BUTT:"butt", MILTER:"milter", ROUND:"round", SQUARE:"square"}, window, !1);
p({COLORLIST:g}, window, !1);
p(p, w);
p({RGBToHSL:function(a, b, c) {
  a /= 255;
  b /= 255;
  c /= 255;
  const e = Math.max(a, b, c);
  var d = Math.min(a, b, c);
  let f;
  const h = (e + d) / 2;
  if (e === d) {
    f = d = 0;
  } else {
    const l = e - d;
    d = 0.5 < h ? l / (2 - e - d) : l / (e + d);
    switch(e) {
      case "r":
        f = (b - c) / l + (b < c ? 6 : 0);
        break;
      case "g":
        f = (c - a) / l + 2;
        break;
      case "b":
        f = (a - b) / l + 4;
    }
    f /= 6;
  }
  return [360 * f, d, h];
}, HSLToRGB:function(a, b, c) {
  a /= 360;
  if (0 === b) {
    c = b = a = c;
  } else {
    const e = 0.5 > c ? c * (1 + b) : c + b - c * b, d = 2 * c - e;
    c = n(d, e, a + 1 / 3);
    b = n(d, e, a);
    a = n(d, e, a - 1 / 3);
  }
  return [255 * c, 255 * b, 255 * a];
}, RGBToHSV:function(a, b, c) {
  a /= 255;
  b /= 255;
  c /= 255;
  const e = Math.max(a, b, c), d = Math.min(a, b, c);
  let f;
  const h = e - d;
  if (e === d) {
    f = 0;
  } else {
    switch(e) {
      case a:
        f = (b - c) / h + (b < c ? 6 : 0);
        break;
      case b:
        f = (c - a) / h + 2;
        break;
      case c:
        f = (a - b) / h + 4;
    }
    f /= 6;
  }
  return [360 * f, 0 === e ? 0 : h / e, e];
}, HSVToRGB:function(a, b, c) {
  let e, d, f;
  const h = Math.floor(a / 60), l = a / 60 - h;
  a = c * (1 - b);
  const m = c * (1 - l * b);
  b = c * (1 - (1 - l) * b);
  switch(h % 6) {
    case 0:
      e = c;
      d = b;
      f = a;
      break;
    case 1:
      e = m;
      d = c;
      f = a;
      break;
    case 2:
      e = a;
      d = c;
      f = b;
      break;
    case 3:
      e = a;
      d = m;
      f = c;
      break;
    case 4:
      e = b;
      d = a;
      f = c;
      break;
    case 5:
      e = c, d = a, f = m;
  }
  return [255 * e, 255 * d, 255 * f];
}});
p(U);
console.log(U);
w.addExtension(Z);
console.log(Z);
}).call(this);
