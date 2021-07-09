import { C } from "./main.js";
import { CFunctions as CF } from "./drawing-functions.js";

import { COLORLIST as CL } from "./constants.js";

/*
global CENTERX CENTERY
*/

const consts = {
  "CENTERX": function () {
    return C.workingCanvas.width / 2;
  },
  "CENTERY": function () {
    return C.workingCanvas.height / 2;
  },
};

function _def_(name, getter) {
  Object.defineProperty(window, name, {
    "configurable": true,
    "enumerable": true,
    "get": getter,
    "set": function set(value) {
      Object.defineProperty(window, name, {
        "configurable": true,
        "enumerable": true,
        value: value,
        "writable": true,
      });
    },
  });
}

for (let constNames = Object.keys(consts), i = 0; i < constNames.length; i++) {
  const _const = constNames[i];
  _def_(_const, consts[_const]);
}

/**/
function arange(start, end, step, rev = false) {
  const arr = [];
  if (rev) for (let i = end; i >= start; i -= step) arr.push(i);
  else for (let i = start; i <= end; i += step) arr.push(i);
  return arr;
}

function applyDefault(_default, target = {}) {
  for (let i = 0, keys = Object.keys(_default); i < keys.length; i++) {
    const prop = keys[i];
    const objType = _default[prop][1];
    if (
      (objType === "number" && isNaN(target[prop])) ||
      (objType === "array" && !Array.isArray(target[prop])) ||
      target[prop] === undefined ||
      target[prop] === null
    ) {
      target[prop] = _default[prop][0];
    }
  }
  return target;
}

/**
 * Initializes canvas with manim like environment
 *
 */
const more = {};

/**
 * initializes a canvas translated to center and y-axis inverted
 */
more.initCenteredCanvas = function () {
  CF.background(0);
  CF.fill(CL.WHITE);
  CF.stroke(CL.WHITE);
  CF.strokeWidth(2);
  CF.noStroke();

  CF.translate(CENTERX, CENTERY);
  CF.scale(1, -1);
  CF.fontSize(20);
  C.workingCanvas.yAxisInveted = true;
};
/**
 * clears a rectangular portion of canvas
 * @param {number} [x=-width / 2]
 * @param {number} [y=-height / 2]
 * @param {number} [width=width * 2]
 * @param {number} [height=height * 2]
 */
more.clear = function (x, y, width, height) {
  const ctx = C.workingCanvas;
  x = x || -ctx.width / 2;
  y = y || -ctx.height / 2;
  width = width || ctx.width * 2;
  height = height || ctx.height * 2;
  ctx.clearRect(x, y, width, height);
};
/**
 * scales canvas
 * @param {number} x
 * @param {number} y
 */
more.scale = function (x, y = x) {
  C.workingCanvas.scale(x, y);
};
/**
 * draws a arrow
 * @param {number} x1 starting x-coord
 * @param {number} y1 starting y-coord
 * @param {number} x2 ending x-coord
 * @param {number} y2 ending y-coord
 * @param {number} tipWidth width of tip
 * @param {number} tipScaleRatio width:height
 */
more.arrow = function (x1, y1, x2, y2, tipWidth = 10, tipScaleRatio = 0.7) {
  const angle = Math.atan2(y2 - y1, x2 - x1); // angle from plain
  more.arrowHead(x2, y2, tipWidth, angle, tipScaleRatio);
  const r = Math.atan(tipScaleRatio / 2);
  const xd = Math.cos(angle) * tipWidth * Math.cos(r);
  const yd = Math.sin(angle) * tipWidth * Math.cos(r);
  x2 -= xd;
  y2 -= yd;
  CF.line(x1, y1, x2, y2);
};
/**
 * creates a axes.
 * xAxis: <object> params for x axis.
 *   This will be given to numberLine. see {@link more.numberLine} function for possible values
 * yAxis: <object> params for y axis.
 *   This will be given to numberLine. see {@link more.numberLine} function for possible values
 * center: <array> [[0, 0]]
 *   center of axes
 * @param {Object} config
 * @returns axis configs
 */
more.axes = function (config = {}) {
  const ctx = C.workingCanvas;
  // default configurations
  const xAxisDefaults = {
    "length": [ctx.width, "number"],
    "includeNumbers": [false],
    "includeTick": [false],
    "includeLeftTip": [true],
    "includeRightTip": [true],
    "textDirection": [-0.3, -1],
  };
  const yAxisDefaults = {
    "length": [ctx.height, "number"],
    "rotation": [Math.PI / 2, "number"],
    "textRotation": [-Math.PI / 2, "number"],
    "includeNumbers": [false],
    "includeTick": [false],
    "includeLeftTip": [true],
    "includeRightTip": [true],
  };
  // configurations
  const xAxis = applyDefault(xAxisDefaults, config.xAxis);
  const yAxis = applyDefault(yAxisDefaults, config.yAxis);
  // other configurations
  const center = config.center || [0, 0];
  // range of ticks in each axis
  const xRange = xAxis.range || [-8, 8, 1];
  const yRange = yAxis.range || [-8, 8, 1];
  // unit length of each axis
  // got by dividing length of axis by number of ticks
  const xDX = xAxis.length / ((xRange[1] - xRange[0]) / xRange[2]);
  const yDX = yAxis.length / ((yRange[1] - yRange[0]) / yRange[2]);
  // coordinates of bounding rectangle of the graph
  const xMin = (xRange[0] / xRange[2]) * xDX;
  const yMin = (yRange[0] / yRange[2]) * yDX;
  // variables to shift 0 ticks of axes to center
  const xShift = xAxis.length / 2 + xMin;
  const yShift = yAxis.length / 2 + yMin;

  // translate to center
  CF.translate(center[0], center[1]);

  // draws axes
  // x-axis
  CF.translate(xShift, 0);
  const xAxisLine = more.numberLine(xAxis); // draw x axis

  // reverse the effect of shift for drawing y-axis
  CF.translate(-xShift, yShift);

  // y-axis
  const yAxisLine = more.numberLine(yAxis); // draw y axis
  // size of a unit cell
  const unit = [xAxisLine.unitLength, yAxisLine.unitLength];

  // reverse the effect of overall shift
  CF.translate(-center[0], -center[1] - yShift);

  return {
    "unit": unit, // major unit size
    "xAxis": xAxisLine, // x axis confiurations from numberLine
    "yAxis": yAxisLine, // y axis confiurations from numberLine
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
more.arrowHead = function (x, y, width = 10, ang = 0, tipScaleRatio = 2) {
  const ctx = C.workingCanvas;
  const r = Math.atan(tipScaleRatio / 2);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - width * Math.cos(ang - r), y - width * Math.sin(ang - r));
  ctx.lineTo(x - width * Math.cos(ang + r), y - width * Math.sin(ang + r));

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
more.doubleArrow = function (
  x1,
  y1,
  x2,
  y2,
  tipWidth = 10,
  tipScaleRatio = 0.6
) {
  const r = Math.atan(tipScaleRatio / 2);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const xd = Math.cos(angle) * tipWidth * Math.cos(r);
  const yd = Math.sin(angle) * tipWidth * Math.cos(r);
  more.arrowHead(x1, y1, tipWidth, Math.PI + angle, tipScaleRatio);
  x1 += xd;
  y1 += yd;
  more.arrow(x1, y1, x2, y2, tipWidth, tipScaleRatio);
};
/**
 * Creates a numberLine with parameters in a object
 * (default values for each properties are given in square brackets)
 *
 * point1 : <Array> [[-ctx.width / 2, 0]]
 *   starting point of line
 *
 * point2 : <Array> [[ctx.width / 2, 0]]
 *   ending point of line
 *
 * range : <Array> [[-8, 8, 1]]
 *   range of numbers to draw ticks and numbers
 *
 * numbersToExclude : <Array> [defaultValue=[]]
 *   list of numbers that shouldn't be displayed
 *
 * numbersToInclude : <Array> [defaultValue=[]]
 *   list of numbers to be displayed
 *
 * numbersWithElongatedTicks : <Array> [defaultValue=[]]
 *   list of numbers where tick line should be longer
 *
 * includeLeftTip : <boolean> [false]
 *   whether to add an arrow tip at left
 *
 * includeRightTip : <boolean> [false]
 *   whether to add an arrow tip at right
 *
 * tipWidth : <number> [20]
 *   width of arrow tip in px
 *
 * tipSizeRatio : <number> [1]
 *   height/width of tip
 *
 * color : <hex string> [GREY]
 *   color of axis and ticks
 *
 * lineWidth : <number> [3]
 *   width of lines in px
 *
 * includeTick : <boolean> [true]
 *   whether ticks should be added
 *
 * excludeOriginTick : <boolean> [false]
 *   whether exclude ticks at origin (0)
 *
 * longerTickMultiple : <number> [2]
 *   factor to increase height of ticks at elongated ticks
 *
 * tickHeight : <number> [15]
 *   height of ticks in px
 *
 * textDirection : <array> [0, -0.8]
 *   direction of text relative to nearby tick
 *
 * textColor : <hex string> [WHITE]
 *   color of text
 *
 * textSize : <number> [17]
 *   font size of text
 *
 * textRotation : <number> [0]
 *   amount to rotate text
 *
 * decimalPlaces : <number> [number of decimals in step]
 *   number of decimal places in text
 *
 * @returns unit length
 */
more.numberLine = function (config = {}) {
  const ctx = C.workingCanvas;
  const defaultConfigs = {
    "length": [ctx.width, "number"],
    "rotation": [0],
    "center": [[0, 0]],
    "range": [[-8, 8, 1], "array"],
    "numbersToExclude": [[]],
    "numbersToInclude": [[]],
    "numbersWithElongatedTicks": [[]],
    "includeLeftTip": [false],
    "includeRightTip": [false],
    "includeNumbers": [true],
    "tipWidth": [20, "number"],
    "tipSizeRatio": [1, "number"],
    "color": [CL.GREY],
    "lineWidth": [3, "number"],
    "includeTick": [true],
    "excludeOriginTick": [false],
    "longerTickMultiple": [1.5, "number"],
    "tickHeight": [15, "number"],
    "textDirection": [[-0.3, -1]],
    "textColor": [CL.WHITE],
    "textSize": [17, "number"],
    "textRotation": [0],
  };
  applyDefault(defaultConfigs, config);
  const lineLength = config.length;
  const rotation = config.rotation;
  const center = config.center;
  const numbersToExclude = config.numbersToExclude;
  const numbersToInclude = config.numbersToInclude;
  const numbersWithElongatedTicks = config.numbersWithElongatedTicks;
  const includeLeftTip = config.includeLeftTip;
  const includeRightTip = config.includeRightTip;
  const tipWidth = config.tipWidth;
  const tipSizeRatio = config.tipSizeRatio;
  const color = config.color;
  const lineWidth = config.lineWidth;
  const excludeOriginTick = config.excludeOriginTick;
  const longerTickMultiple = config.longerTickMultiple;
  const tickHeight = config.tickHeight;
  const textDirection = config.textDirection;
  const textSize = config.textSize;
  const textRotation = config.textRotation;
  let decimalPlaces = config.decimalPlaces;
  let range = config.range;

  if (Array.isArray(range) && range.length === 2) {
    range = [range[0], range[1], 1];
  }

  // if number of decimal places is not defined
  // find it using `step`
  if (isNaN(decimalPlaces)) {
    decimalPlaces = (range[2].toString().split(".")[1] || []).length || 0;
  }

  const min = range[0];
  const max = range[1];
  const step = range[2];
  const totalTicks = (max - min) / step;
  const ds = lineLength / totalTicks;

  const list = getTickList();
  CF.translate(center[0], center[1]);
  CF.rotate(rotation);
  CF.translate(-lineLength / 2, 0);
  if (config.includeTick) drawTicks();
  if (config.includeNumbers) drawNumbers();
  CF.translate(lineLength / 2, 0);
  drawAxis();
  CF.rotate(-rotation);
  CF.translate(-center[0], -center[1]);
  function drawAxis() {
    CF.stroke(color);
    CF.strokeWidth(lineWidth);
    CF.fill(color);
    const r = Math.atan(tipSizeRatio / 2);
    let x1 = -lineLength / 2;
    let x2 = lineLength / 2;
    if (includeLeftTip) {
      more.arrowHead(x1, 0, tipWidth, Math.PI, tipSizeRatio);
      x1 += tipWidth * Math.cos(r);
    }
    if (includeRightTip) {
      more.arrowHead(x2, 0, tipWidth, 0, tipSizeRatio);
      x2 -= tipWidth * Math.cos(r) * 1;
    }
    CF.line(x1, 0, x2, 0);
  }

  function drawTicks() {
    CF.stroke(color);
    CF.strokeWidth(lineWidth);
    const from = includeLeftTip ? 1 : 0;
    const to = includeRightTip ? list.length - 1 : list.length;
    for (
      let i = from;
      i < to && numbersToExclude.indexOf(list[0][i]) < 0;
      i++
    ) {
      const tick = list[i];
      if (Number(tick) === 0 && excludeOriginTick) continue;
      let TH = tickHeight;
      if (numbersWithElongatedTicks.indexOf(tick) > -1) {
        TH *= longerTickMultiple;
      }
      CF.line(ds * i, -TH / 2, ds * i, TH / 2);
    }
  }

  function drawNumbers() {
    const numbers = numbersToInclude.length > 0 ? numbersToInclude : list;
    CF.fill(config.textColor);
    CF.fontSize(textSize);
    const yShift =
      (-textSize / 3) * Math.cos(textRotation) + textDirection[1] * textSize;
    const from = includeLeftTip ? 1 : 0;
    const to = includeRightTip ? numbers.length - 1 : numbers.length;

    for (
      let i = from;
      i < to && numbersToExclude.indexOf(numbers[i]) < 0;
      i++
    ) {
      const tick = numbers[i].toFixed(decimalPlaces);
      if (Number(tick) === 0 && excludeOriginTick) continue;
      const width = CF.measureText(tick).width;
      const xShift =
        (-width / 2) * Math.cos(textRotation) +
        textDirection[0] * textSize +
        (textSize / 2) * Math.sin(textRotation);
      CF.translate(ds * i + xShift, yShift - width * Math.sin(textRotation));
      CF.rotate(textRotation);
      CF.text(tick, 0, 0);
      CF.rotate(-textRotation);
      CF.translate(-(ds * i + xShift), -(yShift - width * Math.sin(textRotation)));
    }
  }

  function getTickList() {
    return arange(min, max, step);
  }

  // unit interval
  return {
    "unitLength": ds,
    "tickList": list,
  };
};
/**
 * creates a numberPlane based on following parameters inside a Object
 * xAxis: <object> params for x axis.
 *   This will be given to numberLine. see {@link more.numberLine} function for possible values

 * yAxis: <object> params for y axis.
 *   This will be given to numberLine. see {@link more.numberLine} function for possible values
 *
 * grid : <object> set of styles to draw grid & subgrids
 *
 * possible properties:
 *   lineWidth        : <number> stroke width of grid lines [1],
 *
 *   color            : <hex string> color of grid lines ["#58C4DDA0"],
 *
 *   subgrids         : <number> number of sub-grid division to draw [0],
 *
 *   subgridLineColor : <hex string> color of sub-grids ["#888888A0"],
 *
 *   subgridLineWidth : <number> stroke width of sub-grid [0.7],
 **
 * @param {Object} config
 * @returns {Object} configurations
 */
more.numberPlane = function (config = {}) {
  const ctx = C.workingCanvas;
  // default configurations
  const xAxisDefaults = {
    "textDirection": [[0, -1.1]],
    "length": [ctx.width, "number"],
    "excludeOriginTick": [true],
    "includeLeftTip": [false],
    "includeRightTip": [false],
    "includeNumbers": [true],
    "includeTick": [true],
  };
  const yAxisDefaults = {
    "textDirection": [[0, 0.8]],
    "length": [ctx.height, "number"],
    "textRotation": [-Math.PI / 2, "number"],
    "excludeOriginTick": [true],
    "includeLeftTip": [false],
    "includeRightTip": [false],
    "includeNumbers": [true],
    "includeTick": [true],
  };
  const gridDefaults = {
    "lineWidth": [1, "number"],
    "color": [CF.BLUE_C + "a0"],
    "subgrids": [1, "number"],
    "subgridLineColor": [CF.GREY + "50"],
    "subgridLineWidth": [0.7, "number"],
  };
  // configurations
  const xAxis = applyDefault(xAxisDefaults, config.xAxis);
  const yAxis = applyDefault(yAxisDefaults, config.yAxis);
  const grid = applyDefault(gridDefaults, config.grid);
  // other configurations
  const subgrids = grid.subgrids;
  const center = config.center || [0, 0];
  // range of ticks in each axis
  const xRange = xAxis.range || [-8, 8, 1];
  const yRange = yAxis.range || [-8, 8, 1];
  // number of ticks in each
  const xNums = (xRange[1] - xRange[0]) / xRange[2];
  const yNums = (yRange[1] - yRange[0]) / yRange[2];
  // unit length of each axis
  const xDX = xAxis.length / xNums;
  const yDX = yAxis.length / yNums;
  // coordinates of bounding rectangle of the graph
  const xMin = (xRange[0] / xRange[2]) * xDX;
  const xMax = (xRange[1] / xRange[2]) * xDX;
  const yMin = (yRange[0] / yRange[2]) * yDX;
  const yMax = (yRange[1] / yRange[2]) * yDX;
  // variables to shift 0 ticks of axes to center
  const xShift = xAxis.length / 2 + xMin;
  const yShift = yAxis.length / 2 + yMin;
  // size of a subgrid unit cell
  const subgridUnit = [xDX / subgrids, yDX / subgrids];

  // translate to center
  CF.translate(center[0] + xShift, center[1]);

  // draw grids
  drawGridLines();

  // draws axes
  const axesLines = more.axes({
    "xAxis": xAxis,
    "yAxis": yAxis,
  });
  // size of a unit cell
  const unit = axesLines.unit;

  // reverse the effect of overall shift
  CF.translate(-(center[0] + xShift), -center[1] - yShift);

  function drawGridLines() {
    // major grid lines
    CF.translate(xMin, 0);
    const subgridxDX = subgridUnit[0];
    const subgridyDX = subgridUnit[1];

    // horizontal grid lines
    for (let i = 0; i <= xNums; i++) {
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
      for (let k = 1; k <= subgrids && i < xNums; k++) {
        drawMinor(k * subgridxDX, yMin, k * subgridxDX, yMax);
      }
      CF.translate(-i * xDX);
    }
    CF.translate(-xMin, yMin);
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
        drawMinor(xMin, k * subgridyDX, xMax, k * subgridyDX);
      }
      CF.translate(0, -i * yDX);
    }
    CF.translate(0, -yMin);

    function drawMajor(shiftX, shiftY, x1, y1, x2, y2) {
      CF.translate(shiftX, shiftY);
      CF.strokeWidth(grid.lineWidth);
      CF.stroke(grid.color);
      CF.line(x1, y1, x2, y2);
    }
    function drawMinor(x1, y1, x2, y2) {
      CF.strokeWidth(grid.subgridLineWidth);
      CF.stroke(grid.subgridLineColor);
      CF.line(x1, y1, x2, y2);
    }
  }

  return {
    "unit": unit, // major unit size
    "subgridUnit": subgridUnit, // subgrid unit size
    "xAxis": axesLines.xAxis, // x axis confiurations from numberLine
    "yAxis": axesLines.yAxis, // y axis confiurations from numberLine
  };
};

export { more };
