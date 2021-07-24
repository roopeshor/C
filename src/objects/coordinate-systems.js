import { BLUE_C, GREY, WHITE } from "../constants/colors.js";
import { C } from "../main.js";
import { applyDefault, arange } from "../utils/utils.js";
import { arrowTip } from "./arrows.js";
import { line } from "./geometry.js";
import {
	fill,
	fontSize,
	restore,
	rotate,
	save,
	stroke,
	strokeWidth,
	translate,
} from "./settings.js";
import { fillText } from "./text.js";


/**
 * Creates a axes.
 * xAxis: <object> configs for x axis.
 *   This will be given to numberLine. see {@link numberLine} function for possible values
 * yAxis: <object> configs for y axis.
 *   This will be given to numberLine. see {@link numberLine} function for possible values
 * center: <array> [[0, 0]]
 *   center of axes
 *
 * @param {Object} config
 * @returns axis configs
 */
function axes(config = {}) {
	const ctx = C.workingCanvas;
	// default configurations
	const defaultConfigs = {
		xAxis: [
			{
				length: [ctx.width, "number"],
				textDirection: [[-0.3, -1], "array"],

				includeTick: [true, "boolean"],
				includeLeftTip: [true, "boolean"],
				includeRightTip: [true, "boolean"],
				excludeOriginTick: [true, "boolean"],
				includeNumbers: [false, "boolean"],
			},
			"object",
		],
		yAxis: [
			{
				length: [ctx.height, "number"],
				rotation: [Math.PI / 2, "number"],
				textRotation: [-Math.PI / 2, "number"],

				textDirection: [[-0.3, 0.5], "array"],

				includeTick: [true, "boolean"],
				includeLeftTip: [true, "boolean"],
				includeRightTip: [true, "boolean"],
				excludeOriginTick: [true, "boolean"],
				includeNumbers: [false, "boolean"],
			},
			"object",
		],
	};
	// configurations
	config = applyDefault(defaultConfigs, config);
	const { xAxis, yAxis } = config;
	// other configurations
	const center = config.center || [0, 0];
	// range of ticks in each axis
	const xRange = xAxis.range;
	const yRange = yAxis.range;
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
	ctx.save();
	// translate to center
	ctx.translate(center[0], center[1]);

	// draws axes
	// x-axis
	ctx.translate(xShift, 0);
	const xAxisLine = numberLine(xAxis); // draw x axis

	// reverse the effect of shift for drawing y-axis
	ctx.translate(-xShift, yShift);

	// y-axis
	const yAxisLine = numberLine(yAxis); // draw y axis
	// size of a unit cell
	const unitLength = [xAxisLine.unitLength, yAxisLine.unitLength];
	const unitValue = [xAxisLine.unitValue, yAxisLine.unitValue];

	// reverse the effect of overall shift
	ctx.translate(-center[0], -center[1] - yShift);
	ctx.restore();
	return {
		xAxis: xAxisLine, // x axis confiurations from numberLine
		yAxis: yAxisLine, // y axis confiurations from numberLine
		unitValue: unitValue, // how much a unit is in its value
		unitLength: unitLength, // how much a unit is in px
	};
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
 * range : <Array> [[-5, 5, 1]]
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
 * tipHeight : <number> [1]
 *   height/width of tip
 *
 * color : <hex string> [GREY]
 *   color of axis and ticks
 *
 * lineWidth : <number> 32]
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
 * @param {object} config
 * @returns unit length
 */
function numberLine(config = {}) {
	const ctx = C.workingCanvas;
	const defaultConfigs = {
		rotation: [0, "number"],
		lineWidth: [2, "number"],
		tipWidth: [13, "number"],
		textSize: [17, "number"],
		tipHeight: [10, "number"],
		tickHeight: [10, "number"],
		textRotation: [0, "number"],
		length: [ctx.width, "number"],
		longerTickMultiple: [1.5, "number"],

		center: [[0, 0], "array"],
		range: [[-5, 5, 1], "array"],
		numbersToInclude: [[], "array"],
		numbersToExclude: [[], "array"],
		textDirection: [[-0.3, -1], "array"],
		numbersWithElongatedTicks: [[], "array"],

		includeTick: [true, "boolean"],
		includeNumbers: [true, "boolean"],
		includeLeftTip: [false, "boolean"],
		includeRightTip: [false, "boolean"],
		excludeOriginTick: [false, "boolean"],

		color: [GREY, "string"],
		textColor: [WHITE, "string"],
	};
	applyDefault(defaultConfigs, config);
	const {
		color,
		center,
		rotation,
		tipWidth,
		textSize,
		lineWidth,
		tipHeight,
		length: lineLength,
		tickHeight,
		textRotation,
		textDirection,
		includeLeftTip,
		includeRightTip,
		numbersToExclude,
		numbersToInclude,
		excludeOriginTick,
		longerTickMultiple,
		numbersWithElongatedTicks,
	} = config;
	var { range, decimalPlaces } = config;

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
	function drawAxis() {
		stroke(color);
		ctx.lineWidth = lineWidth;
		fill(color);
		const r = Math.atan(tipHeight / 2);
		let x1 = -lineLength / 2;
		let x2 = lineLength / 2;
		if (includeLeftTip) {
			arrowTip(x1 + tipWidth, 0, x1, 0, tipWidth, tipHeight);
			x1 += tipWidth * Math.cos(r);
		}
		if (includeRightTip) {
			arrowTip(x2 - tipWidth, 0, x2, 0, tipWidth, tipHeight);
			x2 -= tipWidth * Math.cos(r) * 1;
		}
		line(x1, 0, x2, 0);
	}

	function drawTicks() {
		stroke(color);
		ctx.lineWidth = lineWidth;
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
			const width = ctx.measureText(tick).width;
			const xShift =
				(-width / 2) * Math.cos(textRotation) +
				textDirection[0] * textSize +
				(textSize / 2) * Math.sin(textRotation);
			translate(ds * i + xShift, yShift - width * Math.sin(textRotation));
			rotate(textRotation);
			fillText(tick, 0, 0);
			rotate(-textRotation);
			translate(-(ds * i + xShift), -(yShift - width * Math.sin(textRotation)));
		}
	}

	function getTickList() {
		return arange(min, max, step);
	}

	restore();
	return {
		center: center,
		tickList: list,
		unitValue: step,
		unitLength: ds,
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
 * @param {Object} config
 * @returns {Object} configurations
 */
function numberPlane(config = {}) {
	const ctx = C.workingCanvas;
	// default configurations
	const defaultConfigs = {
		xAxis: [
			{
				length: [ctx.width, "number"],

				range: [[-5, 5, 1], "array"],
				textDirection: [[-0.2, 1.3], "array"],

				includeTick: [true, "boolean"],
				includeNumbers: [true, "boolean"],
				includeLeftTip: [false, "boolean"],
				includeRightTip: [false, "boolean"],
				excludeOriginTick: [true, "boolean"],
			},
			"object",
		],
		yAxis: [
			{
				length: [ctx.height, "number"],
				textRotation: [-Math.PI / 2, "number"],

				range: [[-5, 5, 1], "array"],
				textDirection: [[1.1, 0.6], "array"],

				includeTick: [true, "boolean"],
				includeNumbers: [true, "boolean"],
				includeLeftTip: [false, "boolean"],
				includeRightTip: [false, "boolean"],
				excludeOriginTick: [true, "boolean"],
			},
			"object",
		],
		grid: [
			{
				subgrids: [1, "number"],
				lineWidth: [1, "number"],
				subgridLineWidth: [0.7, "number"],

				color: [BLUE_C + "a0", "string"],
				subgridLineColor: [GREY + "50", "string"],
			},
			"object",
		],
		center: [[0, 0], "array"],
	};

	// configurations
	config = applyDefault(defaultConfigs, config);
	const { xAxis, yAxis, grid } = config;
	// other configurations
	const subgrids = grid.subgrids;
	const center = config.center;
	// range of ticks in each axis
	const xRange = xAxis.range;
	const yRange = yAxis.range;
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
	const unitLength = axesLines.unitLength;
	const unitValue = axesLines.unitValue;

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
		unitValue: unitValue,
		unitLength: unitLength,
		xAxis: axesLines.xAxis, // x axis confiurations from numberLine
		yAxis: axesLines.yAxis, // y axis confiurations from numberLine
		subgridUnit: subgridUnit, // subgrid unit size
	};
}

export { axes, numberLine, numberPlane };
