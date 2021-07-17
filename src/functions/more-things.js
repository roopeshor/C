import { BLUE_C, GREY, WHITE, TRANSPARENT } from "../constants/colors.js";
import { CENTER, MIDDLE, RIGHT } from "../constants/drawing.js";
import { C } from "../main.js";
import {
	background,
	clear,
	fill,
	fontSize,
	line,
	measureText,
	noStroke,
	restore,
	rotate,
	save,
	scale,
	stroke,
	strokeWidth,
	text,
	translate,
} from "./drawing-functions.js";
import { atan2, cos, sin } from "./math.js";
/*
global CENTERX CENTERY
*/

const HAS_MATHJAX_TEX_TO_SVG = typeof window.MathJax == "object" && typeof window.MathJax.tex2svg == "function";

const consts = {
	CENTERX: function () {
		return C.workingCanvas.width / 2;
	},
	CENTERY: function () {
		return C.workingCanvas.height / 2;
	},
};

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
 * initializes a canvas translated to center and y-axis inverted
 * @global
 */
function initCenteredCanvas() {
	const ctx = C.workingCanvas;
	background(0);
	fill(WHITE);
	stroke(WHITE);
	noStroke();
	fontSize(20);

	ctx.translate(CENTERX, CENTERY);
	ctx.scale(1, -1);
	ctx.lineWidth = 2;
	ctx.yAxisInveted = true;
}

/**
 * draws a arrow
 *
 * @global
 * @param {number} x1 starting x-axis coord
 * @param {number} y1 starting y-axis coord
 * @param {number} x2 ending x-axis coord
 * @param {number} y2 ending y-axis coord
 * @param {number} tipWidth width of tip
 * @param {number} tipScaleRatio width:height
 */
function arrow(x1, y1, x2, y2, tipWidth = 10, tipScaleRatio = 0.7) {
	const angle = Math.atan2(y2 - y1, x2 - x1); // angle from plain
	arrowTip(x2, y2, tipWidth, angle, tipScaleRatio);
	save();
	const r = Math.atan(tipScaleRatio / 2);
	const xd = Math.cos(angle) * tipWidth * Math.cos(r);
	const yd = Math.sin(angle) * tipWidth * Math.cos(r);
	x2 -= xd;
	y2 -= yd;
	line(x1, y1, x2, y2);
	restore();
}

/**
 * creates a axes.
 * xAxis: <object> configs for x axis.
 *   This will be given to numberLine. see {@link numberLine} function for possible values
 * yAxis: <object> configs for y axis.
 *   This will be given to numberLine. see {@link numberLine} function for possible values
 * center: <array> [[0, 0]]
 *   center of axes
 *
 * @global
 * @param {Object} config
 * @returns axis configs
 */
function axes(config = {}) {
	const ctx = C.workingCanvas;
	// default configurations
	const xAxisDefaults = {
		length: [ctx.width, "number"],
		includeNumbers: [false],
		includeTick: [false],
		includeLeftTip: [true],
		includeRightTip: [true],
		textDirection: [-0.3, -1],
	};
	const yAxisDefaults = {
		length: [ctx.height, "number"],
		rotation: [Math.PI / 2, "number"],
		textRotation: [-Math.PI / 2, "number"],
		includeNumbers: [false],
		includeTick: [false],
		includeLeftTip: [true],
		includeRightTip: [true],
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

	save();
	// translate to center
	translate(center[0], center[1]);

	// draws axes
	// x-axis
	translate(xShift, 0);
	const xAxisLine = numberLine(xAxis); // draw x axis

	// reverse the effect of shift for drawing y-axis
	translate(-xShift, yShift);

	// y-axis
	const yAxisLine = numberLine(yAxis); // draw y axis
	// size of a unit cell
	const unit = [xAxisLine.unitLength, yAxisLine.unitLength];

	// reverse the effect of overall shift
	translate(-center[0], -center[1] - yShift);
	restore();
	return {
		unit: unit, // major unit size
		xAxis: xAxisLine, // x axis confiurations from numberLine
		yAxis: yAxisLine, // y axis confiurations from numberLine
	};
}

/**
 * Draws a arrow head
 *
 * @global
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} [width=10] width of head
 * @param {number} [ang=0] tilt of head
 * @param {number} [tipScaleRatio=2] height to width ratio
 */
function arrowTip(x, y, width = 15, ang = 0, tipScaleRatio = 1) {
	const ctx = C.workingCanvas;
	const r = Math.atan(tipScaleRatio / 2);
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x - width * Math.cos(ang - r), y - width * Math.sin(ang - r));
	ctx.lineTo(x - width * Math.cos(ang + r), y - width * Math.sin(ang + r));
	ctx.lineTo(x, y);
	if (ctx.doFill) ctx.fill();
	else ctx.stroke();
	ctx.closePath();
	ctx.restore();
}

/**
 * Draws a double tipped arrow
 *
 * @global
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} [tipWidth=10]
 * @param {number} [tipScaleRatio=0.6]
 * @param {number} [spacing=0]
 */
function doubleArrow(
	x1,
	y1,
	x2,
	y2,
	tipWidth = 15,
	tipScaleRatio = 1,
	spacing = 0
) {
	const r = Math.atan(tipScaleRatio / 2);
	const angle = Math.atan2(y2 - y1, x2 - x1);
	const xd = Math.cos(angle) * tipWidth * Math.cos(r);
	const yd = Math.sin(angle) * tipWidth * Math.cos(r);
	const yDiff = Math.sin(angle) * spacing;
	const xDiff = Math.cos(angle) * spacing;
	arrowTip(x1 + xDiff, y1 + yDiff, tipWidth, Math.PI + angle, tipScaleRatio);
	x1 += xd;
	y1 += yd;
	arrow(x1, y1, x2 - xDiff, y2 - yDiff, tipWidth, tipScaleRatio);
}

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
 * @global
 * @param {object} config
 * @returns unit length
 */
function numberLine(config = {}) {
	const ctx = C.workingCanvas;
	const defaultConfigs = {
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
	save();
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
		const r = Math.atan(tipSizeRatio / 2);
		let x1 = -lineLength / 2;
		let x2 = lineLength / 2;
		if (includeLeftTip) {
			arrowTip(x1, 0, tipWidth, Math.PI, tipSizeRatio);
			x1 += tipWidth * Math.cos(r);
		}
		if (includeRightTip) {
			arrowTip(x2, 0, tipWidth, 0, tipSizeRatio);
			x2 -= tipWidth * Math.cos(r) * 1;
		}
		line(x1, 0, x2, 0);
	}

	function drawTicks() {
		stroke(color);
		strokeWidth(lineWidth);
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
			line(ds * i, -TH / 2, ds * i, TH / 2);
		}
	}

	function drawNumbers() {
		const numbers = numbersToInclude.length > 0 ? numbersToInclude : list;
		fill(config.textColor);
		fontSize(textSize);
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
			const width = measureText(tick).width;
			const xShift =
				(-width / 2) * Math.cos(textRotation) +
				textDirection[0] * textSize +
				(textSize / 2) * Math.sin(textRotation);
			translate(ds * i + xShift, yShift - width * Math.sin(textRotation));
			rotate(textRotation);
			text(tick, 0, 0);
			rotate(-textRotation);
			translate(-(ds * i + xShift), -(yShift - width * Math.sin(textRotation)));
		}
	}

	function getTickList() {
		return arange(min, max, step);
	}

	// unit interval
	restore();
	return {
		unitLength: ds,
		tickList: list,
	};
}

/**
 * creates a numberPlane based on following parameters inside a Object
 * xAxis: <object> configs for x axis.
 *   This will be given to numberLine. see {@link numberLine} function for possible values

 * yAxis: <object> configs for y axis.
 *   This will be given to numberLine. see {@link numberLine} function for possible values
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
 *
 * @global
 * @param {Object} config
 * @returns {Object} configurations
 */
function numberPlane(config = {}) {
	const ctx = C.workingCanvas;
	// default configurations
	const xAxisDefaults = {
		textDirection: [[0, -1.1]],
		length: [ctx.width, "number"],
		excludeOriginTick: [true],
		includeLeftTip: [false],
		includeRightTip: [false],
		includeNumbers: [true],
		includeTick: [true],
	};
	const yAxisDefaults = {
		textDirection: [[0, 0.8]],
		length: [ctx.height, "number"],
		textRotation: [-Math.PI / 2, "number"],
		excludeOriginTick: [true],
		includeLeftTip: [false],
		includeRightTip: [false],
		includeNumbers: [true],
		includeTick: [true],
	};
	const gridDefaults = {
		lineWidth: [1, "number"],
		color: [BLUE_C + "a0"],
		subgrids: [1, "number"],
		subgridLineColor: [GREY + "50"],
		subgridLineWidth: [0.7, "number"],
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

	save();
	// translate to center
	translate(center[0] + xShift, center[1]);

	// draw grids
	drawGridLines();

	// draws axes
	const axesLines = axes({
		xAxis: xAxis,
		yAxis: yAxis,
	});
	// size of a unit cell
	const unit = axesLines.unit;

	// reverse the effect of overall shift
	translate(-(center[0] + xShift), -center[1] - yShift);

	function drawGridLines() {
		// major grid lines
		translate(xMin, 0);
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
				drawMinor(xMin, k * subgridyDX, xMax, k * subgridyDX);
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

	restore();
	return {
		unit: unit, // major unit size
		subgridUnit: subgridUnit, // subgrid unit size
		xAxis: axesLines.xAxis, // x axis confiurations from numberLine
		yAxis: axesLines.yAxis, // y axis confiurations from numberLine
	};
}

/**
 * Draws a double tipped arrow with text in the middle
 *
 * @global
 * @param {object} configs parameters.
 * Possible values:
 * * {string} text* : text
 * * {array} p1* : first point
 * * {array} p2* : second point
 * * {number} [tipWidth=10] : tip width
 * * {number} [tipScaleRatio=0.6] : tipScaleRatio
 * * {number} [spacing=0] : spacing
 * NOTE: '*' indicate mandatory properties
 */
function measurement(configs) {
	const defaults = {
		background: [TRANSPARENT],
		tipWidth: [15, "number"],
		tipScaleRatio: [1, "number"],
		innerPadding: [3, "number"],
		outerPadding: [0, "number"],
		textRotation: [0, "number"],
	};
	configs = applyDefault(defaults, configs);
	const txt = configs.text,
		p1 = configs.p1,
		p2 = configs.p2,
		background = configs.background,
		tipWidth = configs.tipWidth,
		tipScaleRatio = configs.tipScaleRatio,
		innerPadding = configs.innerPadding,
		textRotation = configs.textRotation,
		outerPadding = configs.outerPadding;
	// draw arrow
	doubleArrow(
		p1[0],
		p1[1],
		p2[0],
		p2[1],
		tipWidth,
		tipScaleRatio,
		outerPadding
	);
	const metrics = measureText(txt);

	// height of text from stackoverflow: https://stackoverflow.com/a/45789011
	const height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
	const width = metrics.width;
	const ctx = C.workingCanvas;
	const pAverage = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
	ctx.save();
	ctx.translate(pAverage[0], pAverage[1]);
	ctx.textAlign = CENTER;
	ctx.textBaseline = MIDDLE;
	ctx.rotate(atan2(p2[1] - p1[1], p2[0] - p1[0]));
	ctx.rotate(textRotation);
	const recentFillColor = ctx.fillStyle;
	if (background == TRANSPARENT) {
		ctx.fillStyle = ctx.background || WHITE;
	} else {
		ctx.fillStyle = background;
	}
	ctx.fillRect(
		-width / 2 - innerPadding,
		-height / 2,
		width + innerPadding * 2,
		height
	);
	ctx.fillStyle = recentFillColor;
	text(txt, 0, 0);
	ctx.restore();
}

/**
 * Draws a curly brace
 * Code adapted from http://bl.ocks.org/alexhornbake/6005176
 *
 * @global
 * @param {number} x1 x-axis coord of starting point
 * @param {number} y1 y-axis coord of starting point
 * @param {number} x2 x-axis coord of ending point
 * @param {number} y2 y-axis coord of ending point
 * @param {number} [size=30] outward size of brace
 * @param {number} [curviness=0.6] curviness of brace. '0' doesn't make flat brace
 * @param {number} [taleLength=0.8] length of tale proportional to size \ length
 */
function curlyBrace(
	x1,
	y1,
	x2,
	y2,
	size = 20,
	curviness = 0.6,
	taleLength = 0.8
) {
	//Calculate unit vector
	var dx = x1 - x2;
	var dy = y1 - y2;
	var len = Math.sqrt(dx * dx + dy * dy);
	dx /= len;
	dy /= len;

	//Calculate Control Points of path,
	const cp1x = x1 + curviness * size * dy;
	const cp1y = y1 - curviness * size * dx;
	const cp2x = x1 - 0.25 * len * dx + (1 - curviness) * size * dy;
	const cp2y = y1 - 0.25 * len * dy - (1 - curviness) * size * dx;

	const middleTipX = x1 - 0.5 * len * dx + size * dy * taleLength;
	const middleTipY = y1 - 0.5 * len * dy - size * dx * taleLength;

	const cp3x = x2 + curviness * size * dy;
	const cp3y = y2 - curviness * size * dx;
	const cp4x = x1 - 0.75 * len * dx + (1 - curviness) * size * dy;
	const cp4y = y1 - 0.75 * len * dy - (1 - curviness) * size * dx;

	const path =
		`M ${x1} ${y1} ` +
		`Q ${cp1x} ${cp1y} ${cp2x} ${cp2y} ` +
		`T ${middleTipX} ${middleTipY} ` +
		`M ${x2} ${y2} ` +
		`Q ${cp3x} ${cp3y} ${cp4x} ${cp4y} ` +
		`T ${middleTipX} ${middleTipY}`;
	C.workingCanvas.stroke(new Path2D(path));
	return [middleTipX, middleTipY];
}

/**
 * Draws a brace that wraps a circle. Returns the coordinate of middle tip extended by a certain amound.
 *
 * @global
 * @param {number} x x-axis coord
 * @param {number} y y-axis coord
 * @param {number} [radius=100] radius of circle
 * @param {number} [startAngle=0] starting angle
 * @param {number} [angle=Math.PI / 2] central angle
 * @param {number} [smallerLineLength=10] length of small tips at the ends of brace
 * @param {number} [tipLineLength=smallerLineLength] length of middle tip
 * @param {number} [extender=5] how much the coordinate of middle tip should be extended.
 * @return {array} array of two numbers that are the coordinate of middle tip extended by a certain value.
 */
function arcBrace(
	x,
	y,
	radius = 100,
	angle = Math.PI / 2,
	startAngle = 0,
	smallerLineLength = 10,
	tipLineLength = smallerLineLength,
	extender = 10
) {
	const ctx = C.workingCanvas,
		smallerRadius = radius - smallerLineLength,
		largerRadius = radius + tipLineLength;

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(startAngle);
	ctx.beginPath();
	ctx.moveTo(radius, 0);

	// first smaller line
	ctx.lineTo(smallerRadius, 0);

	// The arc
	ctx.arc(0, 0, radius, 0, angle);

	// second smaller line
	ctx.lineTo(smallerRadius * cos(angle), smallerRadius * sin(angle));

	// tip line
	ctx.moveTo(radius * cos(angle / 2), radius * sin(angle / 2));
	ctx.lineTo(largerRadius * cos(angle / 2), largerRadius * sin(angle / 2));

	ctx.stroke();
	ctx.closePath();
	ctx.restore();

	return [
		(largerRadius + extender) * cos(angle / 2 + startAngle) + x,
		(largerRadius + extender) * sin(angle / 2 + startAngle) + y,
	];
}

/**
 * Renders the input tex into a HTMLImageElement
 *
 * @param {string} input
 * @return {HTMLImageElement}
 */
function getImgageFromTex (input) {
	if (HAS_MATHJAX_TEX_TO_SVG) {
		const ctx = C.workingCanvas;
		// eslint-disable-next-line no-undef
		const svgOutput = MathJax.tex2svg(input).getElementsByTagName("svg")[0];
		const g = svgOutput.getElementsByTagName("g")[0];
		svgOutput.style.verticalAlign = "1ex";
		g.setAttribute("stroke", ctx.strokeStyle);
		g.setAttribute("fill", ctx.fillStyle);
		let outerHTML = svgOutput.outerHTML,
			blob = new Blob([outerHTML],{type:"image/svg+xml;charset=utf-8"});
		let URL = window.URL || window.webkitURL || window;
		let blobURL = URL.createObjectURL(blob);
		let image = new Image();
		image.src = blobURL;
		return image;
	} else {
		console.error("MathJax is not found. Please include");
	}
}

/**
 * Draws tex inputs
 *
 * @param {string} input
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @return {HTMLImageElement} image representation of tex
 */
function tex(input, x= 0, y=0){
	const image = getImgageFromTex(input);
	const ctx = C.workingCanvas;
	const text_align = ctx.textAlign, text_baseline = ctx.textBaseline;
	image.onload = function () {
		ctx.save();
		const {width, height} = image;
		// translating the image according to text-align and text-baseline
		switch (text_align) {
		case CENTER:
			ctx.translate(-width/2, 0);
			break;
		case RIGHT:
			ctx.translate(-width, 0);
			break;
		default:
			break;
		}
		switch (text_baseline) {
		case "middle":
			ctx.translate(0, height/2);
			break;
		case "bottom":
			ctx.translate(0, height);
			break;
		default:
			break;
		}
		// invert axis first
		ctx.scale(1, -1);
		ctx.drawImage(image, x, -y);
		ctx.restore();
	};
	return image;
}

export {
	initCenteredCanvas,
	clear,
	scale,
	arrow,
	axes,
	arrowTip,
	doubleArrow,
	measurement,
	numberLine,
	numberPlane,
	curlyBrace,
	arcBrace,
	HAS_MATHJAX_TEX_TO_SVG,
	tex,
	getImgageFromTex,
};
