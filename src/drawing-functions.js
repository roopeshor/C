// helpers

function readColor(colors) {
  var color1,
    color2,
    color3,
    alpha = 255,
    read = "";
  if (typeof colors[0] == "number") {
    if (colors.length == 1) {
      color1 = colors[0];
      color2 = color1;
      color3 = color1;
    } else if (colors.length == 2) {
      color1 = colors[0];
      color2 = colors[1];
      color3 = 0;
    } else if (colors.length == 3) {
      color1 = colors[0];
      color2 = colors[1];
      color3 = colors[2];
    } else if (colors.length == 4) {
      color1 = colors[0];
      color2 = colors[1];
      color3 = colors[2];
      alpha = colors[3];
    }
    var mode = C.workingCanvas._ColorMode;
    if (mode == "HSL") {
      read = `hsl(${color1}, ${color2}, ${color3})`;
    } else if (mode == "rgb") {
      read = `rgb(${color1}, ${color2}, ${color3})`;
    } else if (mode == "rgba") {
      read = `rgba(${color1}, ${color2}, ${color3}, ${alpha})`;
    }
  } else {
    read = colors[0];
  }
  return read;
}

// C.js drawing functions
C.functions = {};
C.functions.line = function (x1, y1, x2, y2) {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
};
C.functions.moveTo = function (x, y) {
  var ctx = C.workingCanvas;
  if (!ctx._pathStart) ctx.beginPath();
  ctx.moveTo(x, y);
};
C.functions.lineTo = function (x, y) {
  C.workingCanvas.lineTo(x, y);
};
C.functions.background = function () {
  var col = readColor(arguments);
  var ctx = C.workingCanvas;
  ctx.save();
  this.rest();
  ctx.fillStyle = col;
  ctx.fillRect(0, 0, ctx.width, ctx.height);
  ctx.restore();
};
C.functions.clear = function (x, y, width, height) {
  var ctx = C.workingCanvas;
  x = x || 0;
  y = y || 0;
  width = width || ctx.width;
  height = height || ctx.height;
  ctx.clearRect(x, y, width, height);
};
C.functions.permaBackground = function () {
  var dat = this.getCanvasData();
  var cvs = C.workingCanvas.canvas;

  cvs.style.background = 'url("' + dat + '")';
  cvs.style.backgroundPosition = "center";
  cvs.style.backgroundSize = "cover";
};
C.functions.transform = function (a1, a2, a3, a4, a5, a6) {
  var ctx = C.workingCanvas;
  ctx.setTransform(a1, a2, a3, a4, a5, a6);
  ctx.scale(ctx.dpr, ctx.dpr);
};
C.functions.noFill = function () {
  C.workingCanvas._doFill = false;
};
C.functions.noStroke = function () {
  C.workingCanvas._doStroke = false;
};
C.functions.translate = function (x, y = 0) {
  C.workingCanvas.translate(x, y);
};
C.functions.setImageSmoothing = function (bool) {
  C.workingCanvas.imageSmoothingEnabled = !!bool;
};
C.functions.strokeWidth = function (w) {
  C.workingCanvas.lineWidth = Number(w);
};
C.functions.scale = function (x, y = x) {
  C.workingCanvas.scale(x, y);
};
C.functions.rotate = function (a) {
  C.workingCanvas.rotate(a);
};
C.functions.save = function () {
  C.workingCanvas.save();
};
C.functions.lineCap = function (capType) {
  C.workingCanvas.lineCap = capType;
};
C.functions.lineJoin = function (joinType) {
  C.workingCanvas.lineJoin = joinType;
};
C.functions.restore = function () {
  C.workingCanvas.restore();
};
C.functions.getFill = function () {
  return C.workingCanvas.fillStyle;
};
C.functions.getStroke = function () {
  return C.workingCanvas.strokeStyle;
};
C.functions.rest = function () {
  var ctx = C.workingCanvas;
  var d = ctx.dpr;
  ctx.setTransform(d, 0, 0, d, 0, 0);
};
C.functions.stroke = function () {
  var ctx = C.workingCanvas;
  if (arguments.length != 0) {
    var col = readColor(arguments);
    ctx.strokeStyle = col;
    ctx._doStroke = true;
  } else {
    ctx.stroke();
  }
};
C.functions.fill = function () {
  var ctx = C.workingCanvas;
  if (arguments.length != 0) {
    var col = readColor(arguments);
    ctx.fillStyle = col;
    ctx._doFill = true;
  } else {
    ctx.fill();
  }
};
C.functions.getDrawConfigs = function () {
  var ctx = C.workingCanvas;
  return {
    stroke: ctx.strokeStyle,
    fill: ctx.fillStyle,
    strokeWidth: ctx.lineWidth,
    doStroke: ctx._doStroke,
    doFill: ctx._doFill,
  };
};
C.functions.arc = function (x, y, r, sa, ea) {
  sa = sa || 0;
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.arc(x, y, r, sa || 0, isNaN(ea) ? Math.PI * 2 : ea);
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
  ctx.closePath();
};
C.functions.text = function (text, x, y = x, maxwidth = undefined) {
  var ctx = C.workingCanvas;
  if (ctx._doFill) ctx.fillText(text, x, y, maxwidth);
  else if (ctx._doStroke) ctx.strokeText(text, x, y, maxwidth);
};
C.functions.rect = function (x, y, w, h = w) {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
};
C.functions.circle = function (x, y, r) {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
  ctx.closePath();
};
C.functions.polygon = function () {
  var args = arguments;
  if (args.length % 2 == 0) {
    var ctx = C.workingCanvas;
    ctx.beginPath();
    ctx.moveTo(args[0], args[1]);
    for (var i = 2; i < args.length; i += 2) {
      ctx.lineTo(args[i], args[i + 1]);
    }
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) {
      ctx.lineTo(args[0], args[1]);
      ctx.stroke();
    }
    ctx.closePath();
  }
};
C.functions.ellipse = function (x, y, xDis, yDis) {
  var ctx = C.workingCanvas;
  var kappa = 4 * ((sqrt(2) - 1) / 3),
    ox = xDis * kappa, // control point offset horizontal
    oy = yDis * kappa, // control point offset vertical
    xe = x + xDis, // x-end
    ye = y + yDis; // y-end
  ctx.beginPath();
  ctx.moveTo(x - xDis, y);
  ctx.bezierCurveTo(x - xDis, y - oy, x - ox, y - yDis, x, y - yDis);
  ctx.bezierCurveTo(x + ox, y - yDis, xe, y - oy, xe, y);
  ctx.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
  ctx.bezierCurveTo(x - ox, ye, x - xDis, y + oy, x - xDis, y);
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) {
    ctx.stroke();
  }
  ctx.closePath();
};
C.functions.bezierCurve = function (x1, y1, x2, y2, x3, y3) {
  var ctx = C.workingCanvas;
  if (!ctx._pathStart) ctx.beginPath();

  ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);

  if (!ctx._pathStart) {
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) {
      ctx.stroke();
    }
    ctx.closePath();
  }
};
C.functions.quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
  var ctx = C.workingCanvas,
    args = arguments;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x4, y4);
  ctx.lineTo(x1, y1);
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) {
    ctx.lineTo(args[0], args[1]);
    ctx.stroke();
  }
  ctx.closePath();
};
C.functions.loop = function (fx, cvs, dx) {
  var ctx = C.workingCanvas;
  if (!cvs) {
    cvs = ctx.name;
  } else {
    ctx = C.canvasList[cvs];
  }
  if (dx) {
    ctx.currentLoop = setInterval(function () {
      C.workingCanvas = ctx;
      fx();
    }, dx);
  } else {
    a();
  }
  function a() {
    C.workingCanvas = ctx;
    ctx.currentLoop = window.requestAnimationFrame(a);
    fx();
  }
};
C.functions.noLoop = function () {
  var ctx = C.workingCanvas;
  clearInterval(ctx.currentLoop);
  window.cancelAnimationFrame(ctx.currentLoop);
};
C.functions.startPath = function () {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx._pathStart = true;
};
C.functions.endPath = function () {
  var ctx = C.workingCanvas;
  ctx.closePath();
  ctx._pathStart = false;
};
C.functions.getFont = function () {
  var ctx = C.workingCanvas;
  return ctx.fontSize + " " + ctx.fontFamily;
};
C.functions.measureText = function (text) {
  return C.workingCanvas.measureText(text);
};
/**
 * creates a linear gradient
 *
 * @param {array} p1 initial point as [x, y]
 * @param {array} p2 final point as [x, y]
 * @param {Object|array} colorStops color stops
 * @example var color = linearGradient(
  * [0, 0],
  * [200, 0],
  * {
      0: "green",
      0.5: "cyan",
      1: "yellow"
  * }
 * );
 * 
 */
C.functions.linearGradient = function _linearGradient(p1, p2, colorStops) {
  var ctx = C.workingCanvas;
  var gradient = ctx.createLinearGradient(p1[0], p1[1], p2[0], p2[1]);
  if (Array.isArray(colorStops)) {
    let stops = {};
    var step = 1 / colorStops.length;
    for (var i = 0; i < colorStops.length; i++) {
      stops[step * i] = colorStops[i];
    }
    colorStops = stops;
  }
  for (let stops = Object.keys(colorStops), i = 0; i < stops.length; i++) {
    var stop = stops[i];
    gradient.addColorStop(stop, colorStops[stop]);
  }
  return gradient;
};
C.functions.fontSize = function _fontSize(size) {
  var ctx = C.workingCanvas;
  size = !isNaN(size) ? size + "px" : size;
  ctx.fontSize = size;
  ctx.font = getFont();
};
C.functions.fontFamily = function _fontFamily(family) {
  var ctx = C.workingCanvas;
  ctx.fontFamily = family;
  ctx.font = getFont();
};
C.functions.getCanvasData = function _getCanvasData(datURL = "image/png") {
  return C.workingCanvas.canvas.toDataURL(datURL);
};
C.functions.saveCanvas = function _saveCanvas(
  name = "drawing",
  datURL = "image/png"
) {
  var link = getCanvasData().replace(datURL, "image/octet-stream");
  var a = document.createElement("a");
  a.download = name + ".png";
  a.href = link;
  a.click();
};

// more
C.functions.point = function (x, y, size = 1) {
  var ctx = C.workingCanvas;
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
};
C.functions.square = function (x, y, side) {
  rect(x, y, side);
};
C.functions.sector = function (x, y, r, sa, ea) {
  var ctx = C.workingCanvas;
  ctx.moveTo(x, y);
  ctx.arc(x, y, r, sa, ea);
};
C.functions.triangle = function (x1, y1, x2, y2, x3, y3) {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x1, y1);
  ctx.closePath();
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
};
C.functions.equiTriangle = function (x, y, len, rotation = 0) {
  this.regularPolygon(x, y, 3, len, rotation);
};

/**
 * Draws a regular polygon with centre position number of sides length of a side and rotation
 * @param {number} x        x position
 * @param {number} y        y position
 * @param {number} sides    number of sides
 * @param {number} len      length of a side
 * @param {number} rotation rotation
 */
C.functions.regularPolygon = function (x, y, sides, len, rotation = 0) {
  len = len / (2 * Math.sin(Math.PI / sides)); // actual radius
  this.regularPolygonWithRadius(x, y, sides, len, rotation);
};

/**
 * Draws a regular polygon that is inside a circle with `radius`
 * with position of centre, number of sides and rotation
 * @param {number} x        x position
 * @param {number} y        y position
 * @param {number} sides    number of sides
 * @param {number} radius   radius
 * @param {number} rotation rotation
 */
C.functions.regularPolygonWithRadius = function (
  x,
  y,
  sides,
  radius,
  rotation = 0
) {
  var i = 0;
  var e = (Math.PI * 2) / sides;
  var ctx = C.workingCanvas;
  rotation += e / 2;
  var initial = [
    Math.cos(rotation) * radius + x,
    Math.sin(rotation) * radius + y,
  ];
  ctx.beginPath();
  ctx.moveTo(initial[0], initial[1]);
  while (i++ < sides) {
    ctx.lineTo(
      Math.cos(i * e + rotation) * radius + x,
      Math.sin(i * e + rotation) * radius + y
    );
  }
  ctx.lineTo(initial[0], initial[1]);
  ctx.closePath();
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
};

C.functions.FPSText = function (
  elapsed,
  rounding = 2,
  x = C.workingCanvas.width / 2,
  y = 30
) {
  var t = 1000 / elapsed;
  text("FPS: " + t.toFixed(rounding), 300, 90);
};

defineProperties(C.functions);
