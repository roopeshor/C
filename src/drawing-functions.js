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
var CFunctions = {};

/**
 * Draws a line
 *
 * @param {number} x1 initial x coord
 * @param {number} y1 initial y coord
 * @param {number} x2 final x coord
 * @param {number} y2 final y coord
 */
CFunctions.line = function (x1, y1, x2, y2) {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
};

/**
 * Move to a given point
 *
 * @param {number} x
 * @param {number} y
 */
CFunctions.moveTo = function (x, y) {
  var ctx = C.workingCanvas;
  if (!ctx._pathStart) ctx.beginPath();
  ctx.moveTo(x, y);
};

/**
 * draws a line to given coords
 *
 * @param {number} x
 * @param {number} y
 */
CFunctions.lineTo = function (x, y) {
  C.workingCanvas.lineTo(x, y);
};

/**
 * Sets background to a given value
 *
 * Accepted values:
 * ⦿ a hex string (#fff, #acf2dc)
 * ⦿ a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * ⦿ a array of numbers ([0, 244, 34])
 */
CFunctions.background = function () {
  var col = readColor(arguments);
  var ctx = C.workingCanvas;
  ctx.backgroundColor = col;
  ctx.save();
  this.rest();
  ctx.fillStyle = col;
  ctx.fillRect(0, 0, ctx.width, ctx.height);
  ctx.restore();
};

/**
 * Clears a rectangular portion of canvas
 *
 * @param {number} x starting x
 * @param {number} y starting y
 * @param {number} width
 * @param {number} height
 */
CFunctions.clear = function (x, y, width, height) {
  var ctx = C.workingCanvas;
  x = x || 0;
  y = y || 0;
  width = width || ctx.width;
  height = height || ctx.height;
  ctx.clearRect(x, y, width, height);
};

/**
 * Captures the current drawings in canvas and set it to
 * css background stretching the entire canvas
 */
CFunctions.permaBackground = function () {
  var dat = this.getCanvasData();
  var cvs = C.workingCanvas.canvas;
  cvs.style.background = 'url("' + dat + '")';
  cvs.style.backgroundPosition = "center";
  cvs.style.backgroundSize = "cover";
};

/**
 * Resets the current transformation to the identity matrix,
 * and then invokes a transformation described by given arguments.
 * Lets you scale, rotate, translate (move), and skew the canvas.
 * See MDN docs: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
 *
 * @param {number} a1
 * @param {number} a2
 * @param {number} a3
 * @param {number} a4
 * @param {number} a5
 * @param {number} a6
 */
CFunctions.setTransform = function (a1, a2, a3, a4, a5, a6) {
  var ctx = C.workingCanvas;
  ctx.setTransform(a1, a2, a3, a4, a5, a6);
  ctx.scale(ctx.dpr, ctx.dpr);
};

/**
 * multiplies the current transformation with the matrix described by the arguments
 * of this method. This lets you scale, rotate, translate (move), and skew the context.
 * See MDN docs: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
 *
 * @param {number} a1
 * @param {number} a2
 * @param {number} a3
 * @param {number} a4
 * @param {number} a5
 * @param {number} a6
 */
CFunctions.transform = function (a1, a2, a3, a4, a5, a6) {
  C.workingCanvas.transform(a1, a2, a3, a4, a5, a6);
};

/**
 * Prevent filling inside further shapes
 */
CFunctions.noFill = function () {
  C.workingCanvas._doFill = false;
};

/**
 * Prevent drawing strokes of further shapes
 */
CFunctions.noStroke = function () {
  C.workingCanvas._doStroke = false;
};

/**
 * Translates (moves) canvas to a position
 *
 * @param {number} x
 * @param {number} [y=0]
 */
CFunctions.translate = function (x, y = 0) {
  C.workingCanvas.translate(x, y);
};

CFunctions.setImageSmoothing = function (bool) {
  C.workingCanvas.imageSmoothingEnabled = !!bool;
};

/**
 * sets the stroke width (width/weight of line) in px
 *
 * @param {number} w
 */
CFunctions.strokeWidth = function (w) {
  C.workingCanvas.lineWidth = Number(w);
};

/**
 * scales the canvas by a given amount
 *
 * @param {number} x
 * @param {number} [y=x]
 */
CFunctions.scale = function (x, y = x) {
  C.workingCanvas.scale(x, y);
};

/**
 * Rotates the canvas
 *
 * @param {number} angle angle in radians
 */
CFunctions.rotate = function (angle) {
  C.workingCanvas.rotate(angle);
};

/**
 * saves the current state of canvas
 */
CFunctions.save = function () {
  C.workingCanvas.save();
};

/**
 * set the type of line end
 *
 * @param {string} capType
 */
CFunctions.lineCap = function (capType) {
  C.workingCanvas.lineCap = capType;
};

/**
 * sets type of line joining
 * @param {string} joinType
 */
CFunctions.lineJoin = function (joinType) {
  C.workingCanvas.lineJoin = joinType;
};

/**
 * restore the saved state of canvas
 */
CFunctions.restore = function () {
  C.workingCanvas.restore();
};

/**
 * returns fill color/gradient
 * @returns {string|CanvasGradient}
 */
CFunctions.getFill = function () {
  return C.workingCanvas.fillStyle;
};

/**
 * returns stroke color/gradient
 * @returns {string|CanvasGradient}
 */
CFunctions.getStroke = function () {
  return C.workingCanvas.strokeStyle;
};

/**
 * reset the applied transform to idendity matrix multiplied by dpr
 */
CFunctions.rest = function () {
  var ctx = C.workingCanvas;
  var d = ctx.dpr;
  ctx.setTransform(d, 0, 0, d, 0, 0);
};

/**
 * Sets stroke color to a given value if value is given
 * else strokes the previous shape
 *
 * Accepted values:
 * ⦿ a hex string (#fff, #acf2dc)
 * ⦿ a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * ⦿ a array of numbers ([0, 244, 34])
 */
CFunctions.stroke = function () {
  var ctx = C.workingCanvas;
  if (arguments.length != 0) {
    var col = readColor(arguments);
    ctx.strokeStyle = col;
    ctx._doStroke = true;
  } else {
    ctx.stroke();
  }
};

/**
 * Sets fill color to a given value if value is given
 * else fills the previous shape
 *
 * Accepted values:
 * ⦿ a hex string (#fff, #acf2dc)
 * ⦿ a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * ⦿ a array of numbers ([0, 244, 34])
 */
CFunctions.fill = function () {
  var ctx = C.workingCanvas;
  if (arguments.length != 0) {
    var col = readColor(arguments);
    ctx.fillStyle = col;
    ctx._doFill = true;
  } else {
    ctx.fill();
  }
};

/**
 * returns fill&stroke color/gradient, line width, fill&stroke state
 * @returns {Object}
 */
CFunctions.getDrawConfigs = function () {
  var ctx = C.workingCanvas;
  return {
    stroke: ctx.strokeStyle,
    fill: ctx.fillStyle,
    strokeWidth: ctx.lineWidth,
    doStroke: ctx._doStroke,
    doFill: ctx._doFill,
  };
};

/**
 * draw a arc
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} r radius
 * @param {number} [startingAngle=0] starting angle
 * @param {number} [endingAngle=PI*2] ending angle
 */
CFunctions.arc = function (x, y, r, startingAngle, endingAngle) {
  startingAngle = startingAngle || 0;
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.arc(
    x,
    y,
    r,
    startingAngle || 0,
    isNaN(endingAngle) ? Math.PI * 2 : endingAngle
  );
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
  ctx.closePath();
};

/**
 * draws a text
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
CFunctions.text = function (text, x, y = x, maxwidth = undefined) {
  var ctx = C.workingCanvas;
  if (ctx._doFill) ctx.fillText(text, x, y, maxwidth);
  else if (ctx._doStroke) ctx.strokeText(text, x, y, maxwidth);
};

/**
 * draws a rectangle
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} width widht
 * @param {number} height height
 */
CFunctions.rect = function (x, y, width, height) {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
};

/**
 * draws circle
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} r radius
 */
CFunctions.circle = function (x, y, r) {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
  ctx.closePath();
};

/**
 * accepts points and draws polygon
 * @example ```js
 * polygon(
    [0, 0], // first point
    [100, 200], // second point
    [130, 230], // third point
    //...
)
```
 */
CFunctions.polygon = function () {
  var args = arguments;
  if (args.length > 2) {
    var ctx = C.workingCanvas,
      start = args[0];
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    for (var i = 1; i < args.length; i++) {
      ctx.lineTo(args[i][0], args[i][1]);
    }
    ctx.lineTo(start[0], start[1]);
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) ctx.stroke();
    ctx.closePath();
  }
};

/**
 * draws ellipse
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} radius1 radius1
 * @param {number} radius2 radius2
 * @param {number} [rotation=0] rotation from plane
 * @param {number} [startAngle=0] starting angle
 * @param {number} [endAngle=Math.PI * 2] ending angle
 * @param {boolean} [anticlockwise=false]
 */
CFunctions.ellipse = function (
  x,
  y,
  radius1,
  radius2,
  rotation = 0,
  startAngle = 0,
  endAngle = Math.PI * 2,
  anticlockwise = false
) {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.ellipse(
    x,
    y,
    radius1,
    radius2,
    rotation,
    startAngle,
    endAngle,
    anticlockwise
  );
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
  ctx.closePath();
};

CFunctions.bezierCurve = function (x1, y1, x2, y2, x3, y3) {
  var ctx = C.workingCanvas,
    pathStarted = ctx._pathStart;
  if (!pathStarted) ctx.beginPath();

  ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);

  if (pathStarted) return;
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
  ctx.closePath();
};

/**
 * starts a new loop
 * @param {function} fx
 * @param {string} canvasName
 * @param {number} dx
 */
CFunctions.loop = function (fx, canvasName, dx) {
  var ctx = C.workingCanvas;
  if (!canvasName) {
    canvasName = ctx.name;
  } else {
    ctx = C.canvasList[canvasName];
  }
  if (dx != undefined) {
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

/**
 * stops current loop
 */
CFunctions.noLoop = function () {
  var ctx = C.workingCanvas;
  clearInterval(ctx.currentLoop);
  window.cancelAnimationFrame(ctx.currentLoop);
};

/**
 * starts a new Path
 */
CFunctions.startPath = function () {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx._pathStart = true;
};

/**
 * ends current Path
 */
CFunctions.endPath = function () {
  var ctx = C.workingCanvas;
  ctx.closePath();
  ctx._pathStart = false;
};

/**
 * return current font
 * @returns {string}
 */
CFunctions.getFont = function () {
  var ctx = C.workingCanvas;
  return ctx.fontSize + " " + ctx.fontFamily;
};

/**
 * returns text metrics
 * @param {string} text
 * @returns {TextMetrics}
 */
CFunctions.measureText = function (text) {
  return C.workingCanvas.measureText(text);
};

/**
 * sets font size
 * @param {number|string} size
 */
CFunctions.fontSize = function _fontSize(size) {
  var ctx = C.workingCanvas;
  size = typeof size == "number" ? size + "px" : size;
  ctx.fontSize = size;
  ctx.font = this.getFont();
};

/**
 * sets font family
 * @param {string} family
 */
CFunctions.fontFamily = function _fontFamily(family) {
  var ctx = C.workingCanvas;
  ctx.fontFamily = family;
  ctx.font = this.getFont();
};

/**
 * returns canvas image data
 *
 * @param {string} datURL
 * @returns {string}
 */
CFunctions.getCanvasData = function _getCanvasData(datURL = "image/png") {
  return C.workingCanvas.canvas.toDataURL(datURL);
};

/**
 * save the canvas as image
 *
 * @param {string} [name="drawing"]
 * @param {string} [datURL="image/png"]
 */
CFunctions.saveCanvas = function _saveCanvas(
  name = "drawing",
  datURL = "image/png"
) {
  var link = this.getCanvasData().replace(datURL, "image/octet-stream");
  var a = document.createElement("a");
  a.download = name + ".png";
  a.href = link;
  a.click();
};

// more functions

/**
 * draws a point with given size in pixels
 *
 * @param {number} x
 * @param {number} y
 * @param {number} [size=1] diameter of point
 */
CFunctions.point = function (x, y, size = 1) {
  var ctx = C.workingCanvas;
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * draws square
 *
 * @param {number} x
 * @param {number} y
 * @param {number} sideLength
 */
CFunctions.square = function (x, y, sideLength) {
  this.rect(x, y, sideLength, sideLength);
};

/**
 * draws a sector
 *
 * @param {number} x
 * @param {number} y
 * @param {number} innerRadius
 * @param {number} outerRadius
 * @param {number} startAngle
 * @param {number} endAngle
 * @param {string|CanvasGradient} [backgroundFill=C.workingCanvas.backgroundColor] Color of inner Circle
 */
CFunctions.sector = function (
  x,
  y,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  backgroundFill
) {
  var ctx = C.workingCanvas;
  ctx.moveTo(x, y);
  var _fill = this.getFill();
  ctx.arc(x, y, outerRadius, startAngle, endAngle);
  this.fill(backgroundFill || C.workingCanvas.backgroundColor);
  ctx.arc(x, y, innerRadius, startAngle, endAngle);
  this.fill(_fill);
};

/**
 * draws quadrilateral
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @param {number} x4
 * @param {number} y4
 */
 CFunctions.quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x4, y4);
  ctx.lineTo(x1, y1);

  ctx.lineTo(x1, y1);
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
  ctx.closePath();
};

/**
 * draws triangle
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} x3 
 * @param {number} y3 
 */
CFunctions.triangle = function (x1, y1, x2, y2, x3, y3) {
  var ctx = C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x1, y1);
  if (ctx._doFill) ctx.fill();
  if (ctx._doStroke) ctx.stroke();
  ctx.closePath();
};


/**
 * draws equilateral triangle
 *
 * @param {number} x
 * @param {number} y
 * @param {number} sideLength length of side
 * @param {number} [rotation=0]
 */
CFunctions.equiTriangle = function (x, y, sideLength, rotation = 0) {
  this.regularPolygon(x, y, 3, sideLength, rotation);
};

/**
 * Draws a regular polygon with centre position number of sides length of a side and rotation
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} sides number of sides
 * @param {number} sideLength length of a side
 * @param {number} [rotation=0] rotation
 */
CFunctions.regularPolygon = function (x, y, sides, sideLength, rotation = 0) {
  sideLength = sideLength / (2 * Math.sin(Math.PI / sides)); // finds radius
  this.regularPolygonWithRadius(x, y, sides, sideLength, rotation);
};

/**
 * Draws a regular polygon that is inside a circle

 * @param {number} x x coord
 * @param {number} y y coord
 * @param {number} sides number of sides
 * @param {number} radius radius
 * @param {number} [rotation=0] rotation
 */
CFunctions.regularPolygonWithRadius = function (
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

let dxList = [],
  total = 0,
  recent = window.performance.now();

/**
 * returns FPS (Frames Per Second)
 * @param {number} keepDat number of recorded frames to remember
 * @returns {number}
 */
CFunctions.getFPS = function (keepDat = 100) {
  var now = window.performance.now(),
    dx = now - recent;
  dxList.push(dx);
  total += dx;
  recent = now;
  if (dxList.length > keepDat) total -= dxList.shift();
  return (dxList.length / total) * 1000;
};

/**
 * creates a linear gradient
 *
 * @param {array} p1 initial point as [x, y]
 * @param {array} p2 final point as [x, y]
 * @param {Object|array} colorStops color stops
 ```js
var color = linearGradient(
  [0, 0],
  [200, 0],
  {
      0: "green",
      0.5: "cyan",
      1: "yellow"
  }
);
```
{@link CFunctions.linearGradient}
 */
CFunctions.linearGradient = function _linearGradient(p1, p2, colorStops) {
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

C.functions = CFunctions;

defineProperties(C.functions);