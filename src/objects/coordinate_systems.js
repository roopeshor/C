import { C } from "../main.js";
import { restore, save } from "../settings.js";
import { applyDefault, arange } from "../utils.js";
import { arrowTip } from "./arrows.js";
import { functionGraph, heatPlot, parametricFunction, plotPoints } from "./functions.js";
import { line } from "./geometry.js";
import { fillText } from "./text.js";

// list of plotters
function getPlotterList(cfgs = {}) {
	return Object.assign(cfgs, {
		getParametricFunction: function (configs) {
			configs.unitSpace = configs.unitSpace;
			configs.unitValue = configs.unitValue;
			return parametricFunction(configs);
		},
		getFunctionGraph: function (configs) {
			configs.unitSpace = configs.unitSpace;
			configs.unitValue = configs.unitValue;
			return functionGraph(configs);
		},
		getHeatPlot: function (configs) {
			configs.unitSpace = configs.unitSpace;
			configs.unitValue = configs.unitValue;
			configs.min = configs.min || [cfgs.xAxis.range[0], cfgs.yAxis.range[0]];
			configs.max = configs.max || [cfgs.xAxis.range[1], cfgs.yAxis.range[1]];
			return heatPlot(configs);
		},
		plotPoints: function (configs) {
			configs.unitValue = configs.unitValue;
			configs.unitSpace = configs.unitSpace;
			return plotPoints(configs);
		},
	});
}
const ORIGIN = [0, 0];

/**
 * Creates a numberLine with parameters in a object
 * @param {Object} configs configuration object
 *
 * @param {number} [configs.tipWidth = 13] width of arrow tip in px
 * @param {number} [configs.tipHeight = 10] height/width of tip
 * @param {number} [configs.longerTickMultiple = 1.5] Factor to increase height of ticks at elongated ticks
 * @param {number} [configs.tickHeight = 10] Height of ticks in px
 * @param {number} [configs.fontSize = 17] Font size of text
 * @param {number} [configs.textRotation = 0] Amount to rotate text
 * @param {number} [configs.decimalPlaces] Number of decimal places in text. By default value is number of decimals in step
 * @param {number} [configs.rotation = 0] Amound to rotate the numberline from origin
 * @param {number} [configs.strokeWidth = 2] Width of lines in px
 * @param {number} [configs.length] Total length of numberline in pixels. Default is the widht of canvas
 *
 * @param {string} [configs.strokeColor = "grey"] Color of axis and ticks
 * @param {string} [configs.textColor = "white"] Color of text
 *
 * @param {Array<number>} [configs.textDirection = TEXT_DIR] Direction of text relative to nearby tick
 * @param {Array<number>} [configs.numbersWithElongatedTicks] list of numbers where tick line should be longer
 * @param {Array<number>} [configs.originPosition = ORIGIN] position of the origin of number line in pixels.
 * @param {Array<number>} [configs.range] range of numbers to draw ticks and numbers. Default: [-5, 5, 1]
 * @param {Array<number>} [configs.numbersToInclude] list of labels to be displayed instead of default numbers
 * @param {Array<number>} [configs.numbersToExclude] list of numbers that shouldn't be displayed
 * @param {Array<number>} [configs.textDirection = [0, -1]]

 * @param {boolean} [configs.includeTick = true] Whether ticks should be added
 * @param {boolean} [configs.includeLeftTip = false] whether to add an arrow tip at left
 * @param {boolean} [configs.includeRightTip = false] whether to add an arrow tip at right
 * @param {boolean} [configs.excludeOriginTick = false] Whether exclude ticks at origin
 * @param {boolean} [configs.includeNumbers = true] whether to display labels
 *
 * @param {string} [configs.fontFamily = "serif"] font Family to use
 * @param {string} [configs.textAlign = "center"] to align text in x-axis
 * @param {string} [configs.textBaseline = "middle"] to align text in y-axis
 *
 * @param {function} [configs.textRenderer = fillText] function that is used to render text.
 *
 * * You can adjust textAlign and textBaseline if you want to adjust alignment of labels.
 * @returns {Object} configurations about the number line
 *
 * * originPosition     {Array<number>} Center of the number line in px
 * * tickList   {Array<number>} List of tick inervals
 * * unitValue  {Array<number>} How much a unit is in its value in x and y directions.
 * * unitSpace {Array<number>} How much a unit is in px in x and y directions.
 */
export function numberLine(configs = {}) {
	const ctx = C.workingContext;
	const cvs = C.workingCanvas;
	configs = applyDefault(
		{
			rotation: 0,
			strokeWidth: 2,
			length: parseInt(cvs.width),
			originPosition: ORIGIN,
			range: [-5, 5, 1],
			strokeColor: "grey",

			tipWidth: 13,
			tipHeight: 10,

			fontSize: 17,
			fontFamily: "serif",
			textRenderer: fillText,
			textAlign: "center",
			textBaseline: "middle",
			textColor: "white",
			textRotation: 0,
			textDirection: [0, -1],

			tickHeight: 10,
			longerTickMultiple: 1.5,
			numbersToInclude: [],
			numbersToExclude: [],
			numbersWithElongatedTicks: [],

			includeTick: true,
			includeNumbers: true,
			includeLeftTip: false,
			includeRightTip: false,
			excludeOriginTick: false,
		},
		configs
	);
	let {
		strokeColor,
		tipWidth,
		strokeWidth,
		fontSize,
		tipHeight,
		textRotation,
		textDirection,
		includeLeftTip,
		includeRightTip,
		numbersToExclude,
		numbersToInclude,
		excludeOriginTick,
		longerTickMultiple,
		numbersWithElongatedTicks,
		range,
		decimalPlaces,
	} = configs;

	if (Array.isArray(range) && range.length) {
		if (range.length === 1) {
			range = [0, range[0], 1];
		}
		if (range.length === 2) {
			range = [range[0], range[1], 1];
		}
	} else {
		throw new Error("range must be a array that have atleast one item. Got: " + range.toString());
	}

	// if number of decimal places is not defined, find it using `step`
	if (isNaN(decimalPlaces) && decimalPlaces >= 0) {
		decimalPlaces = (range[2].toString().split(".")[1] || []).length || 0;
	}

	const min = range[0],
		max = range[1],
		step = range[2],
		/** Total number of ticks */
		totalTicks = (max - min) / step,
		/** Space between two ticks in pixels*/
		unitSpace = configs.length / totalTicks / step,
		/** A list of numbers that'll be displayed if no labels are given through numberToInclude */
		tickList = getTickList();

	// scale everyting down
	strokeWidth /= unitSpace;
	tipWidth /= unitSpace;
	fontSize /= unitSpace;
	tipHeight /= unitSpace;
	configs.tickHeight /= unitSpace;

	ctx.beginPath();
	save();
	// shfit to origin position
	ctx.translate(configs.originPosition[0], configs.originPosition[1]);
	// scale up by unitspace
	ctx.scale(unitSpace, unitSpace);
	// rotate entire canvas
	ctx.rotate(configs.rotation);

	if (configs.includeTick) drawTicks();
	if (configs.includeNumbers) drawNumbers();
	drawAxis();
	ctx.closePath();

	function drawAxis() {
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = strokeWidth;
		ctx.fillStyle = strokeColor;

		const r = Math.atan(tipHeight / 2);
		let x1 = tickList[0];
		let x2 = tickList[tickList.length - 1];
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
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = strokeWidth;
		const from = includeLeftTip ? 1 : 0;
		const to = includeRightTip ? tickList.length - 1 : tickList.length;
		for (let i = from; i < to && numbersToExclude.indexOf(tickList[0][i]) < 0; i++) {
			const tick = tickList[i];
			if (Number(tick) === 0 && excludeOriginTick) continue;
			let TH = configs.tickHeight;
			if (numbersWithElongatedTicks.indexOf(tick) > -1) {
				TH *= longerTickMultiple;
			}
			line(tick, -TH / 2, tick, TH / 2);
		}
	}

	function drawNumbers() {
		const labels = numbersToInclude.length > 0 ? numbersToInclude : tickList;
		ctx.fillStyle = configs.textColor;
		ctx.font = fontSize + "px " + configs.fontFamily;
		ctx.textAlign = configs.textAlign;
		ctx.textBaseline = configs.textBaseline;
		const start = includeLeftTip ? 1 : 0;
		const end = includeRightTip ? tickList.length - 1 : tickList.length;
		const textRenderer = configs.textRenderer;
		for (let i = start; i < end; i++) {
			if (i >= labels.length) break;
			const tick = typeof labels[i] == "number" ? labels[i].toFixed(decimalPlaces) : labels[i];
			if (
				(tickList[i] == 0 && excludeOriginTick) || // exclude origin tick
				numbersToExclude.indexOf(tickList[i]) > -1 // exclude ticks that were said to ignore explictly.
			) {
				continue;
			}
			const width = ctx.measureText(tick).width;
			const xShift =
				tickList[i] - // tick position
				textDirection[0] * width; // shift by text direction
			const yShift = textDirection[1] * fontSize; // shift by text direction
			ctx.save();
			ctx.translate(xShift, yShift);
			ctx.rotate(textRotation);
			textRenderer(tick, 0, 0);
			ctx.restore();
		}
	}

	function getTickList() {
		return arange(min, max, step);
	}

	restore();
	return {
		range: range,
		originPosition: configs.originPosition,
		tickList: tickList,
		unitValue: step,
		unitSpace: unitSpace,
	};
}

/**
 * Creates a axes.
 * @param {Object} configs
 * Possible configurations are:
 *
 * @param {Object} configs.xAxis Configurations for x axis. (See {@link numberLine} for more configurations)
 * @param {Object} configs.yAxis Configurations for y axis. (See {@link numberLine} for more configurations)
 * @param {Array<number>} [configs.originPosition = ORIGIN] originPosition of axes
 *
 * @returns {Object} object that contains following properties:
 * * xAxis                 <object>   : x axis confiurations from numberLine (See {@link numberLine} for those configurations).
 * * yAxis                 <object>   : y axis confiurations from numberLine (See {@link numberLine} for those configurations).
 * * unitValue             <array>    : How much a unit is in its value in x and y directions.
 * * unitSpace             <array>    : How much a unit is in px in x and y directions.
 * * getParametricFunction <function> : Draws a parametric function whose unit sizing are predefined by the axes. see {@link parametricFunction} to see possible configurations.
 * * getFunctionGraph      <function> : Draws a function graph whose unit sizing are predefined by the axes. see {@link functionGraph} to see possible configurations.
 */
export function axes(configs = {}) {
	const ctx = C.workingContext;
	const cvs = C.workingCanvas;
	// configurations
	configs = applyDefault(
		{
			xAxis: {
				length: cvs.width,
				includeTick: true,
				includeLeftTip: false,
				includeRightTip: true,
				excludeOriginTick: true,
			},
			yAxis: {
				length: cvs.height,
				rotation: Math.PI / 2,
				textRotation: -Math.PI / 2,
				textDirection: [0, 0.75],
				includeTick: true,
				includeLeftTip: false,
				includeRightTip: true,
				excludeOriginTick: true,
			},
			originPosition: ORIGIN,
		},
		configs
	);
	ctx.save();
	// translate to originPosition
	ctx.translate(configs.originPosition[0], configs.originPosition[1]);
	// draws axes
	const xAxisLine = numberLine(configs.xAxis); // draw x axis
	const yAxisLine = numberLine(configs.yAxis); // draw y axis

	ctx.restore();
	return getPlotterList({
		originPosition: configs.originPosition, // originPosition of axis as [x, y] in px
		xAxis: xAxisLine, // x axis confiurations from numberLine
		yAxis: yAxisLine, // y axis confiurations from numberLine
		unitValue: [xAxisLine.unitSpace, yAxisLine.unitSpace], // space between two ticks in pixels
		unitSpace: [xAxisLine.unitValue, yAxisLine.unitValue], // value between two close ticks
	});
}

/**
 * Creates a numberPlane based on following parameters inside a Object
 * @param {Object} configs
 * Possible parameters:
 *
 * @param {Object} configs.xAxis Configurations for x axis. See {@link numberLine} for possible configurations.
 * @param {Object} configs.yAxis Configurations for y axis. See {@link numberLine} for possible configurations.
 * @param {Array<number>} configs.originPosition Center of number plane as [x, y] in px.
 * @param {Array<number>} [configs.subgrids] array number of sub-grid division in each axes. Default=[1,1]
 * @param {Object} configs.grid Set of styles to draw grid & subgrids. This can have following properties:
 * @param {number} [configs.gridStrokeWidth = 1]  stroke width of grid lines
 * @param {number} [configs.subgridStrokeWidth = 0.7]  stroke width of sub-grid
 * @param {string} [configs.gridStrokeColor = "#58c4dda0"]  color of grid lines
 * @param {string} [configs.subgridStrokeColor = "#888888a0"]  color of sub-grids
 * @returns {Object} configurations of number plane. Those are :
 *
 * * originPosition                <array>   : Center of number plane as [x, y] in px.
 * * unitValue             <array>   : How much a unit is in its value in x and y directions.
 * * unitSpace            <array>   : How much a unit is in px in x and y directions.
 * * subgridUnit           <array>   : How much a sub-grid is in px in x and y directions.
 * * xAxis                 <object>  : x axis confiurations from numberLine (See {@link numberLine} for those configurations).
 * * yAxis                 <object>  : y axis confiurations from numberLine (See {@link numberLine} for those configurations).
 * * getParametricFunction <function>: Draws a parametric function whose unit sizing are predefined by the axes. see {@link parametricFunction} to see possible configurations.
 * * getFunctionGraph      <function>: Draws a function graph whose unit sizing are predefined by the axes. see {@link functionGraph} to see possible configurations.
 */
export function numberPlane(configs = {}) {
	const cvs = C.workingCanvas;
	const ctx = C.workingContext;
	// default configurations
	const defaultConfigs = {
		xAxis: {
			length: parseInt(cvs.style.width),
			includeTick: true,
			includeNumbers: true,
			includeLeftTip: false,
			includeRightTip: false,
			excludeOriginTick: true,
			unitSpace: 50,
		},
		yAxis: {
			length: parseInt(cvs.style.height),
			textRotation: -Math.PI / 2,
			unitSpace: 50,
			includeTick: true,
			includeNumbers: true,
			includeLeftTip: false,
			includeRightTip: false,
			excludeOriginTick: true,
		},
		subgrids: [1, 1],
		gridStrokeWidth: 1.3,
		subgridStrokeWidth: 0.8,
		gridStrokeColor: "#58c4dddd",
		subgridStrokeColor: "#88888850",
		originPosition: ORIGIN,
	};

	// configurations
	configs = applyDefault(defaultConfigs, configs);
	let {
		xAxis,
		yAxis,
		originPosition,
		subgrids,
		gridStrokeWidth,
		subgridStrokeWidth,
		gridStrokeColor,
	} = configs;

	// range of ticks in each axis
	ctx.save();
	const axesLines = axes({
		xAxis: xAxis,
		yAxis: yAxis,
	});
	const xRange = axesLines.xAxis.range;
	const yRange = axesLines.yAxis.range;

	// number of ticks in each axes
	const xNums = (xRange[1] - xRange[0]) / xRange[2];
	const yNums = (yRange[1] - yRange[0]) / yRange[2];

	// draw grids
	const unitSpace = axesLines.unitSpace;
	const unitValue = axesLines.unitValue;
	ctx.scale(unitSpace[0], unitSpace[1]);
	gridStrokeWidth /= unitSpace[1];
	subgridStrokeWidth /= unitSpace[1];
	drawGridLines();

	// size of a unit cell
	ctx.restore();
	function drawGridLines() {
		// major grid lines
		ctx.translate(xRange[0], 0);
		ctx.beginPath();
		ctx.lineWidth = gridStrokeWidth;
		ctx.strokeStyle = gridStrokeColor;
		// vertical grid lines
		let max = yRange[1] - (yRange[1] % yRange[2]);
		for (let i = 0; i <= xNums; i++) {
			if (i == xAxis.range[0]) continue;
			ctx.moveTo(i * xRange[2], yRange[0]);
			ctx.lineTo(i * xRange[2], max);
		}
		// horizontal grid lines
		max = xRange[1] - (xRange[1] % xRange[2]);
		for (let i = 0; i <= yNums; i++) {
			if (i == yAxis.range[0]) continue;
			ctx.moveTo(xRange[0], i * yRange[2]);
			ctx.lineTo(max, i * yRange[2]);
		}

		ctx.stroke();
		ctx.closePath();
		// draw subgrid grid lines
		ctx.lineWidth = subgridStrokeWidth;
		ctx.strokeStyle = configs.subgridStrokeColor;
		let spacing = 2 / (subgrids[0] + 1), // space between two subgrids
			totalSubGrids = xNums * (subgrids[0] + 1);
		// vertical subgrids
		for (let k = xRange[0]; k <= totalSubGrids; k++) {
			if (k % (subgrids[0] + 1) == 0) {
				continue;
			}
			ctx.moveTo(k * spacing, yRange[0]);
			ctx.lineTo(k * spacing, yRange[1]);
		}

		spacing = 2 / (subgrids[1] + 1);
		totalSubGrids = yNums * (subgrids[1] + 1);
		// horizontal subgrids
		for (let k = yRange[0]; k <= totalSubGrids; k++) {
			if (k % (subgrids[1] + 1) == 0) {
				continue;
			}
			ctx.moveTo(xRange[0], k * spacing);
			ctx.lineTo(xRange[1], k * spacing);
		}
		ctx.stroke();
		ctx.closePath();
	}

	return getPlotterList({
		originPosition: originPosition, // position of origin of number plane
		unitValue: unitValue, // how much a unit is in its value
		unitSpace: unitSpace, // how much a unit is in px
		xAxis: axesLines.xAxis, // x axis confiurations from numberLine
		yAxis: axesLines.yAxis, // y axis confiurations from numberLine
		subgridUnit: subgrids, // subgrid unit size
	});
}
