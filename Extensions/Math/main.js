var consts = {
  CENTERX: function () {
    return C.workingCanvas.width / 2;
  },
  CENTERY: function () {
    return C.workingCanvas.height / 2;
  },
};

function arange(start, end, step, rev = false) {
  var arr = [];
  if (rev) for (let i = end; i >= start; i -= step) arr.push(i);
  else for (let i = start; i <= end; i += step) arr.push(i);
  return arr;
}

function applyDefault(_default, target = {}) {
  for (var i = 0, keys = Object.keys(_default); i < keys.length; i++) {
    var prop = keys[i];
    var objType = _default[prop][1];
    if (
      (objType == "number" && isNaN(target[prop])) ||
      (objType == "array" && !Array.isArray(target[prop])) ||
      target[prop] == undefined ||
      target[prop] == null
    ) {
      target[prop] = _default[prop][0];
    }
  }
  return target;
}

function _def_(name, getter) {
  Object.defineProperty(window, name, {
    configurable: true,
    enumerable: true,
    get: getter,
    set: function set(value) {
      Object.defineProperty(window, name, {
        configurable: true,
        enumerable: true,
        value: value,
        writable: true,
      });
    },
  });
}

for (let constNames = Object.keys(consts), i = 0; i < constNames.length; i++) {
  var _const = constNames[i];
  _def_(_const, consts[_const]);
}

/**
 * Initializes canvas with manim like environment
 *
 */
var ext = {};

ext.init_Canvas = function () {
  background(0);
  fill(WHITE);
  stroke(WHITE);
  noStroke();
  strokeWidth(2);
  translate(CENTERX, CENTERY);
  scale(1, -1);
  C.workingCanvas.yAxisInveted = true;
  fontSize(20);
};
ext.clear = function (x, y, width, height) {
  var ctx = C.workingCanvas;
  x = x || -ctx.width / 2;
  y = y || -ctx.height / 2;
  width = width || ctx.width * 2;
  height = height || ctx.height * 2;
  ctx.clearRect(x, y, width, height);
};
ext.scale = function (x, y = x) {
  C.workingCanvas.scale(x, y);
};
ext.text = function (text, x, y, maxwidth) {
  var ctx = C.workingCanvas;
  if (ctx.yAxisInveted) scale(1, -1);
  if (ctx._doFill) ctx.fillText(text, x, -y, maxwidth);
  else if (ctx._doStroke) ctx.strokeText(text, x, -y, maxwidth);
  if (ctx.yAxisInveted) scale(1, -1);
};
ext.arrow = function (x1, y1, x2, y2, tipWidth = 10, tipScaleRatio = 0.7) {
  var angle = atan2(y2 - y1, x2 - x1); // angle from plain
  arrowHead(x2, y2, tipWidth, angle, tipScaleRatio);
  var r = atan(tipScaleRatio / 2),
    xd = cos(angle) * tipWidth * cos(r),
    yd = sin(angle) * tipWidth * cos(r);
  x2 -= xd;
  y2 -= yd;
  line(x1, y1, x2, y2);
};
/**
 * creates a axes.
 * xAxis: <object> params for x axis.
 *   This will be given to numberLine. see `numberLine` function for possible values
 * yAxis: <object> params for y axis.
 *   This will be given to numberLine. see `numberLine` function for possible values
 * center: <array> [[0, 0]]
 *   center of axes
 * @param {Object} config
 * @returns axis configs
 */
ext.axes = function (config = {}) {
  var ctx = C.workingCanvas,
    // default configurations
    xAxisDefaults = {
      length: [ctx.width, "number"],
      includeNumbers: [false],
      includeTick: [false],
      includeLeftTip: [true],
      includeRightTip: [true],
      textDirection: [-0.3, -1]
    },
    yAxisDefaults = {
      length: [ctx.height, "number"],
      rotation: [PI / 2, "number"],
      textRotation: [-PI / 2, "number"],
      includeNumbers: [false],
      includeTick: [false],
      includeLeftTip: [true],
      includeRightTip: [true],
    },
    // configurations
    xAxis = applyDefault(xAxisDefaults, config.xAxis),
    yAxis = applyDefault(yAxisDefaults, config.yAxis),
    // other configurations
    center = config.center || [0, 0],
    // range of ticks in each axis
    xRange = xAxis.range || [-8, 8, 1],
    yRange = yAxis.range || [-8, 8, 1],
    // unit length of each axis
    // got by dividing length of axis by number of ticks
    xDX = xAxis.length / ((xRange[1] - xRange[0]) / xRange[2]),
    yDX = yAxis.length / ((yRange[1] - yRange[0]) / yRange[2]),
    // coordinates of bounding rectangle of the graph
    xMin = (xRange[0] / xRange[2]) * xDX,
    yMin = (yRange[0] / yRange[2]) * yDX,
    // variables to shift 0 ticks of axes to center
    xShift = xAxis.length / 2 + xMin,
    yShift = yAxis.length / 2 + yMin;

  // translate to center
  translate(center[0], center[1]);

  // draws axes
  // x-axis
  translate(xShift, 0);
  var xAxisLine = numberLine(xAxis); // draw x axis

  // reverse the effect of shift for drawing y-axis
  translate(-xShift, yShift);

  // y-axis
  var yAxisLine = numberLine(yAxis), // draw y axis
    // size of a unit cell
    unit = [xAxisLine.unitLength, yAxisLine.unitLength];

  // reverse the effect of overall shift
  translate(-center[0], -center[1] - yShift);

  return {
    unit: unit, // major unit size
    xAxis: xAxisLine, // x axis confiurations from numberLine
    yAxis: yAxisLine, // y axis confiurations from numberLine
  };
};
/**
 *
 *
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} [width=10] width of head
 * @param {number} [ang=0] tilt of head
 * @param {number} [tipScaleRatio=2] height to width ratio
 */
ext.arrowHead = function (x, y, width = 10, ang = 0, tipScaleRatio = 2) {
  var ctx = C.workingCanvas,
    r = atan(tipScaleRatio / 2);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - width * cos(ang - r), y - width * sin(ang - r));
  ctx.lineTo(x - width * cos(ang + r), y - width * sin(ang + r));

  ctx.lineTo(x, y);
  if (ctx._doFill) ctx.fill();
  else ctx.stroke();
};
/**
 * draws a double edged arrow
 *
 * @param {*} x1 starting X
 * @param {*} y1 starting Y
 * @param {*} x2 ending X
 * @param {*} y2 ending Y
 * @param {number} [headSize=10] size of first arrow's head
 * @param {*} [headSize2=headSize] size of second arrow's head
 * @param {*} [r=sqrt(3)] width / height
 */
ext.doubleArrow = function (
  x1,
  y1,
  x2,
  y2,
  tipWidth = 10,
  tipScaleRatio = 0.6
) {
  var r = atan(tipScaleRatio / 2),
    angle = atan2(y2 - y1, x2 - x1),
    xd = cos(angle) * tipWidth * cos(r),
    yd = sin(angle) * tipWidth * cos(r);
  arrowHead(x1, y1, tipWidth, PI + angle, tipScaleRatio);
  x1 += xd;
  y1 += yd;
  arrow(x1, y1, x2, y2, tipWidth, tipScaleRatio);
};
/**
 * Creates a numberLine with parameters in a object
 * (default values for each properties are given in square brackets)
 * point1 : <Array> [[-ctx.width / 2, 0]]
 *   starting point of line
 * point2 : <Array> [[ctx.width / 2, 0]]
 *   ending point of line
 * range : <Array> [[-8, 8, 1]]
 *   range of numbers to draw ticks and numbers
 * numbersToExclude : <Array> [defaultValue=[]]
 *   list of numbers that shouldn't be displayed
 * numbersToInclude : <Array> [defaultValue=[]]
 *   list of numbers to be displayed
 * numbersWithElongatedTicks : <Array> [defaultValue=[]]
 *   list of numbers where tick line should be longer
 * includeLeftTip : <boolean> [false]
 *   whether to add an arrow tip at left
 * includeRightTip : <boolean> [false]
 *   whether to add an arrow tip at right
 * tipWidth : <number> [20]
 *   width of arrow tip in px
 * tipSizeRatio : <number> [1]
 *   height/width of tip
 * color : <hex string> [GREY]
 *   color of axis and ticks
 * lineWidth : <number> [3]
 *   width of lines in px
 * includeTick : <boolean> [true]
 *   whether ticks should be added
 * excludeOriginTick : <boolean> [false]
 *   whether exclude ticks at origin (0)
 * longerTickMultiple : <number> [2]
 *   factor to increase height of ticks at elongated ticks
 * tickHeight : <number> [15]
 *   height of ticks in px
 * textDirection : <array> [0, -0.8]
 *   direction of text relative to nearby tick
 * textColor : <hex string> [WHITE]
 *   color of text
 * textSize : <number> [17]
 *   font size of text
 * textRotation : <number> [0]
 *   amount to rotate text
 * decimalPlaces : <number> [number of decimals in step]
 *   number of decimal places in text
 *
 * @returns unit length
 */
ext.numberLine = function (config = {}) {
  var ctx = C.workingCanvas;
  defaultConfigs = {
    length: [ctx.width, "number"],
    rotation: [0],
    center: [[0, 0]],
    range: [[-8, 8, 1], "array"],
    numbersToExclude: [[]],
    numbersToInclude: [[]],
    numbersWithElongatedTicks: [[]],
    includeLeftTip: [false],
    includeRightTip: [false],
    includeNumbers: [true],
    tipWidth: [20, "number"],
    tipSizeRatio: [1, "number"],
    color: [GREY],
    lineWidth: [3, "number"],
    includeTick: [true],
    excludeOriginTick: [false],
    longerTickMultiple: [1.5, "number"],
    tickHeight: [15, "number"],
    textDirection: [[-0.3, -1]],
    textColor: [WHITE],
    textSize: [17, "number"],
    textRotation: [0],
  };
  applyDefault(defaultConfigs, config);
  var lineLength = config.length,
    rotation = config.rotation,
    center = config.center,
    numbersToExclude = config.numbersToExclude,
    numbersToInclude = config.numbersToInclude,
    numbersWithElongatedTicks = config.numbersWithElongatedTicks,
    includeLeftTip = config.includeLeftTip,
    includeRightTip = config.includeRightTip,
    tipWidth = config.tipWidth,
    tipSizeRatio = config.tipSizeRatio,
    color = config.color,
    lineWidth = config.lineWidth,
    excludeOriginTick = config.excludeOriginTick,
    longerTickMultiple = config.longerTickMultiple,
    tickHeight = config.tickHeight,
    textDirection = config.textDirection,
    textSize = config.textSize,
    textRotation = config.textRotation,
    decimalPlaces = config.decimalPlaces,
    range = config.range;

  if (Array.isArray(range) && range.length == 2) {
    range = [range[0], range[1], 1];
  }

  // if number of decimal places is not defined
  // find it using `step`
  if (isNaN(decimalPlaces)) {
    decimalPlaces = (range[2].toString().split(".")[1] || []).length || 0;
  }

  var min = range[0],
    max = range[1],
    step = range[2],
    totalTicks = (max - min) / step,
    ds = lineLength / totalTicks;

  var list = getTickList();
  translate(center[0], center[1]);
  rotate(rotation);
  translate(-lineLength / 2, 0);
  if (config.includeTick) drawTicks();
  if (config.includeNumbers) drawNumbers();
  translate(lineLength / 2, 0);
  drawAxis();
  rotate(-rotation);
  translate(-center[0], -center[1]);
  function drawAxis() {
    stroke(color);
    strokeWidth(lineWidth);
    fill(color);
    var r = atan(tipSizeRatio / 2);
    var x1 = -lineLength / 2,
      x2 = lineLength / 2;
    if (includeLeftTip) {
      arrowHead(x1, 0, tipWidth, PI, tipSizeRatio);
      x1 += tipWidth * cos(r);
    }
    if (includeRightTip) {
      arrowHead(x2, 0, tipWidth, 0, tipSizeRatio);
      x2 -= tipWidth * cos(r) * 1;
    }
    line(x1, 0, x2, 0);
  }

  function drawTicks() {
    stroke(color);
    strokeWidth(lineWidth);
    var from = includeLeftTip ? 1 : 0;
    var to = includeRightTip ? list.length - 1 : list.length;
    for (
      var i = from;
      i < to && numbersToExclude.indexOf(list[0][i]) < 0;
      i++
    ) {
      var tick = list[i];
      if (Number(tick) == 0 && excludeOriginTick) continue;
      var TH = tickHeight;
      if (numbersWithElongatedTicks.indexOf(tick) > -1) {
        TH *= longerTickMultiple;
      }
      line(ds * i, -TH / 2, ds * i, TH / 2);
    }
  }

  function drawNumbers() {
    var numbers = numbersToInclude.length > 0 ? numbersToInclude : list;
    fill(config.textColor);
    fontSize(textSize);
    var yShift =
      (-textSize / 3) * cos(textRotation) + textDirection[1] * textSize;
    var from = includeLeftTip ? 1 : 0;
    var to = includeRightTip ? numbers.length - 1 : numbers.length;

    for (
      var i = from;
      i < to && numbersToExclude.indexOf(numbers[i]) < 0;
      i++
    ) {
      var tick = numbers[i].toFixed(decimalPlaces);
      if (Number(tick) == 0 && excludeOriginTick) continue;
      var width = measureText(tick).width;
      var xShift =
        (-width / 2) * cos(textRotation) +
        textDirection[0] * textSize +
        (textSize / 2) * sin(textRotation);
      translate(ds * i + xShift, yShift - width * sin(textRotation));
      rotate(textRotation);
      text(tick, 0, 0);
      rotate(-textRotation);
      translate(-(ds * i + xShift), -(yShift - width * sin(textRotation)));
    }
  }

  function getTickList() {
    return arange(min, max, step);
  }

  // unit interval
  return {
    unitLength: ds,
    tickList: list,
  };
};
/**
 * creates a numberPlane based on following parameters inside a Object
 * xAxis: <object> params for x axis.
 *   This will be given to numberLine. see `numberLine` function for possible values
 * yAxis: <object> params for y axis.
 *   This will be given to numberLine. see `numberLine` function for possible values
 * grid : <object> set of styles to draw grid & subgrids
 * possible properties:
 *   lineWidth        : <number> stroke width of grid lines [1],
 *   color            : <hex string> color of grid lines ["#58C4DDA0"],
 *   subgrids         : <number> number of sub-grid division to draw [0],
 *   subgridLineColor : <hex string> color of sub-grids ["#888888A0"],
 *   subgridLineWidth : <number> stroke width of sub-grid [0.7],
 **
 * @param {Object} config
 * @returns graph configurations
 */
ext.numberPlane = function (config = {}) {
  var ctx = C.workingCanvas,
    // default configurations
    xAxisDefaults = {
      textDirection: [[0, -1.1]],
      length: [ctx.width, "number"],
      excludeOriginTick: [true],
      includeLeftTip: [false],
      includeRightTip: [false],
      includeNumbers: [true],
      includeTick: [true],
    },
    yAxisDefaults = {
      textDirection: [[0, 0.8]],
      length: [ctx.height, "number"],
      textRotation: [-PI / 2, "number"],
      excludeOriginTick: [true],
      includeLeftTip: [false],
      includeRightTip: [false],
      includeNumbers: [true],
      includeTick: [true],
    },
    gridDefaults = {
      lineWidth: [1, "number"],
      color: [BLUE_C + "a0"],
      subgrids: [1, "number"],
      subgridLineColor: [GREY + "50"],
      subgridLineWidth: [0.7, "number"],
    },
    // configurations
    xAxis = applyDefault(xAxisDefaults, config.xAxis),
    yAxis = applyDefault(yAxisDefaults, config.yAxis),
    grid = applyDefault(gridDefaults, config.grid),
    // other configurations
    subgrids = grid.subgrids,
    center = config.center || [0, 0],
    // range of ticks in each axis
    xRange = xAxis.range || [-8, 8, 1],
    yRange = yAxis.range || [-8, 8, 1],
    // number of ticks in each
    xNums = (xRange[1] - xRange[0]) / xRange[2],
    yNums = (yRange[1] - yRange[0]) / yRange[2],
    // unit length of each axis
    xDX = xAxis.length / xNums,
    yDX = yAxis.length / yNums,
    // coordinates of bounding rectangle of the graph
    xMin = (xRange[0] / xRange[2]) * xDX,
    xMax = (xRange[1] / xRange[2]) * xDX,
    yMin = (yRange[0] / yRange[2]) * yDX,
    yMax = (yRange[1] / yRange[2]) * yDX,
    // variables to shift 0 ticks of axes to center
    xShift = xAxis.length / 2 + xMin,
    yShift = yAxis.length / 2 + yMin,
    // size of a subgrid unit cell
    subgridUnit = [xDX / subgrids, yDX / subgrids];

  // translate to center
  translate(center[0] + xShift, center[1]);

  // draw grids
  drawGridLines();

  // draws axes
  var axesLines = axes({
      xAxis: xAxis,
      yAxis: yAxis,
    }),
    // size of a unit cell
    unit = axesLines.unit;

  // reverse the effect of overall shift
  translate(-(center[0] + xShift), -center[1] - yShift);

  function drawGridLines() {
    // major grid lines
    translate(xMin, 0);
    var subgrid_xDX = subgridUnit[0];
    var subgrid_yDX = subgridUnit[1];

    // horizontal grid lines
    for (var i = 0; i <= xNums; i++) {
      // draw major grid lines
      drawMajor(
        i * xDX, // x - shift
        0, // y - shift
        0,
        yMin,
        0,
        yMax
      );

      // draw subgrid grid lines
      for (var k = 1; k <= subgrids && i < xNums; k++) {
        drawMinor(k * subgrid_xDX, yMin, k * subgrid_xDX, yMax);
      }
      translate(-i * xDX);
    }
    translate(-xMin, yMin);
    // vertical grid lines
    for (let i = 0; i <= yNums; i++) {
      // draw major grid lines
      drawMajor(
        0, // x - shift
        i * yDX, // y - shift
        xMin,
        0,
        xMax,
        0
      );

      // draw subgrid grid lines
      for (let k = 1; k <= subgrids && i < yNums; k++) {
        drawMinor(xMin, k * subgrid_yDX, xMax, k * subgrid_yDX);
      }
      translate(0, -i * yDX);
    }
    translate(0, -yMin);

    function drawMajor(shiftX, shiftY, x1, y1, x2, y2) {
      translate(shiftX, shiftY);
      strokeWidth(grid.lineWidth);
      stroke(grid.color);
      line(x1, y1, x2, y2);
    }
    function drawMinor(x1, y1, x2, y2) {
      strokeWidth(grid.subgridLineWidth);
      stroke(grid.subgridLineColor);
      line(x1, y1, x2, y2);
    }
  }

  return {
    unit: unit, // major unit size
    subgridUnit: subgridUnit, // subgrid unit size
    xAxis: axesLines.xAxis, // x axis confiurations from numberLine
    yAxis: axesLines.yAxis, // y axis confiurations from numberLine
  };
};

C.addExtension(ext);
