/** @module Coordinate-Systems*/
import { Colors } from "../c.js";
import { C } from "../main.js";
import { fill, fontSize, restore, save, scale, stroke } from "../settings.js";
import { applyDefault, arange, fraction } from "../utils.js";
import { arrowTip } from "./arrows.js";
import {
	functionGraph,
	heatPlot,
	parametricFunction,
	plotPoints,
	plotPolarPoints,
	polarFuntionGraph,
	polarParametricFunction,
} from "./functions.js";
import { line } from "./geometry.js";
import { tex } from "./tex.js";
import { fillText } from "./text.js";

/**
 * @typedef {Object} PolarPlotters
 * @property {Function} plotPoints see {@link plotPolarPoints}
 * @property {Function} parametricFunction see {@link polarParametricFunction}
 * @property {Function} functionGraph see {@link polarFuntionGraph}
 */

/**
 * @typedef {Object} CartesianPlotters
 * @property {Function} plotParametricFunction see {@link parametricFunction}
 * @property {Function} plotFunctionGraph see {@link functionGraph}
 * @property {Function} plotHeatPlot see {@link heatPlot}
 * @property {Function} plotPoints see {@link plotPoints}
 */

/**
 * @typedef {Object} NumberLineConfigs configurations about the number line
 * @property {number[]} originPosition - Center of the number line in px
 * @property {number[]} tickList - List of tick inervals
 * @property {number} unitValue - How much a unit is in its value in x and y directions.
 * @property {number} unitSpace - How much a unit is in px in x and y directions.
 */

/**
 * returns list of plotting functions based on given cartesian parameters
 *
 * @param {Object} configs
 * @return {CartesianPlotters}
 */
function getCartasianFunctions(configs) {
	return Object.assign(configs, {
		plotParametricFunction: function (cfg) {
			cfg.unitSpace = configs.unitSpace;
			cfg.unitValue = configs.unitValue;
			return parametricFunction(cfg);
		},
		plotFunctionGraph: function (cfg) {
			cfg.unitSpace = configs.unitSpace;
			cfg.unitValue = configs.unitValue;
			return functionGraph(cfg);
		},
		plotHeatPlot: function (cfg) {
			cfg.unitSpace = configs.unitSpace;
			cfg.unitValue = configs.unitValue;
			cfg.min = configs.min || [configs.xAxis.range[0], configs.yAxis.range[0]];
			cfg.max = configs.max || [configs.xAxis.range[1], configs.yAxis.range[1]];
			return heatPlot(cfg);
		},
		plotPoints: function (cfg) {
			cfg.unitValue = configs.unitValue;
			cfg.unitSpace = configs.unitSpace;
			return plotPoints(cfg);
		},
		scaleCanvas: function () {
			let unitSizeX = configs.unitSpace[0] / configs.unitValue[0];
			let unitSizeY = configs.unitSpace[1] / configs.unitValue[1];
			scale(unitSizeX, unitSizeY);
		},
	});
}

/**
 * returns list of plotting functions based on given polar parameters
 *
 * @param {Object} configs
 * @return {PolarPlotters}
 */
function getPolarPlotters(configs) {
	return {
		plotPoints: function (cfg) {
			cfg.radialSpacing = cfg.radialSpacing || configs.radialSpacing;
			plotPolarPoints(cfg);
		},
		plotParametricFunction: function (cfg) {
			cfg.radialSpacing = cfg.radialSpacing || configs.radialSpacing;
			return polarParametricFunction(cfg);
		},
		plotFunctionGraph: function (cfg) {
			cfg.radialSpacing = cfg.radialSpacing || configs.radialSpacing;
			return polarFuntionGraph(cfg);
		},
	};
}

const ORIGIN = [0, 0];

/**
 * Creates a numberLine with parameters in a object
 * @param {Object} configs configuration object
 *
 * @param {number} [configs.tipWidth = 13] width of arrow tip in px
 * @param {number} [configs.tipHeight = 10] height of tip
 * @param {number} [configs.longerTickHeight = 15] Height of longer ticks
 * @param {number} [configs.tickHeight = 10] Height of ticks in px
 * @param {number} [configs.fontSize = 17] Font size of text
 * @param {number} [configs.textRotation = 0] Amount to rotate text
 * @param {number} [configs.decimalPlaces] Number of decimal places in text. By default value is number of decimals in step
 * @param {number} [configs.rotation = 0] Amound to rotate the numberline from origin
 * @param {number} [configs.strokeWidth = 2] Width of lines in px
 * @param {number} [configs.length] Total length of numberline in pixels. Default is the width of canvas
 *
 * @param {string} [configs.strokeColor = "white"] Color of axis and ticks
 * @param {string} [configs.textColor = "white"] Color of text
 *
 * @param {number[]} [configs.textDirection = TEXT_DIR] Direction of text relative to nearby tick
 * @param {number[]} [configs.numbersWithElongatedTicks] list of numbers where tick line should be longer
 * @param {number[]} [configs.originPosition = ORIGIN] position of the origin of number line in pixels.
 * @param {number[]} [configs.range] range of numbers to draw ticks and numbers. Default: [-5, 5, 1]
 * @param {number[]} [configs.labelsToInclude] list of labels to be displayed instead of default numbers
 * @param {number[]} [configs.numbersToExclude] list of numbers that shouldn't be displayed
 * @param {number[]} [configs.textDirection = [0, -1]]

 * @param {boolean} [configs.includeTicks = true] Whether ticks should be added
 * @param {boolean} [configs.includeLeftTip = false] whether to add an arrow tip at left
 * @param {boolean} [configs.includeRightTip = false] whether to add an arrow tip at right
 * @param {boolean} [configs.excludeOriginTick = false] Whether exclude ticks at origin
 * @param {boolean} [configs.includeLabels = true] whether to display labels
 *
 * @param {string} [configs.fontFamily = "serif"] font Family to use
 * @param {string} [configs.textAlign = "center"] to align text in x-axis
 * @param {string} [configs.textBaseline = "middle"] to align text in y-axis
 *
 * @param {Function} [configs.textRenderer = fillText] function that is used to render text.
 *
 * * You can adjust textAlign and textBaseline if you want to adjust alignment of labels.
 * @returns {NumberLineConfigs}
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
			strokeColor: Colors.white + "88",
			axisLabel: "",
			axisFont: 14,
			axisLabelDirection: [1, -1],

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
			longerTickHeight: 15,
			labelsToInclude: [],
			numbersToExclude: [],
			numbersWithElongatedTicks: [],

			includeTicks: true,
			includeLabels: true,
			includeLeftTip: false,
			includeRightTip: false,
			excludeOriginTick: false,
		},
		configs,
	);
	let {
		range,
		tipWidth,
		fontSize: labelFontSize,
		axisFont,
		axisLabel,
		tipHeight,
		tickHeight,
		strokeColor,
		strokeWidth,
		textRotation,
		decimalPlaces,
		textDirection,
		includeLeftTip,
		includeRightTip,
		labelsToInclude,
		numbersToExclude,
		excludeOriginTick,
		longerTickHeight,
		numbersWithElongatedTicks,
	} = configs;

	if (Array.isArray(range) && range.length > 0) {
		if (range.length === 1) {
			range = [0, range[0], 1];
		}
		if (range.length === 2) {
			range = [range[0], range[1], 1];
		}
	} else {
		throw new Error(
			"NumberLine: range must be a array that have atleast one item. Got: " +
				range.toString(),
		);
	}

	// if number of decimal places is not defined, find it using `step`
	if (isNaN(decimalPlaces) && decimalPlaces >= 0) {
		decimalPlaces = (range[2].toString().split(".")[1] || []).length;
	}

	let min = range[0],
		max = range[1],
		step = range[2],
		/** Space between two ticks in pixels*/
		unitSpace = configs.length / (max - min),
		/** A list of numbers that'll be displayed if no labels are given through numberToInclude */
		tickList = arange(min, max, step),
		textRenderer = configs.textRenderer;
	// scale everyting down
	strokeWidth /= unitSpace;
	tipWidth /= unitSpace;
	tipHeight /= unitSpace;
	tickHeight /= unitSpace;
	save();
	fontSize(axisFont);
	ctx.translate(configs.originPosition[0], configs.originPosition[1]);
	ctx.scale(unitSpace, unitSpace);
	ctx.rotate(configs.rotation);
	if (configs.includeTicks) drawTicks();
	if (configs.includeLabels) drawNumbers();
	drawAxis();

	function drawAxis() {
		stroke(strokeColor);
		ctx.lineWidth = strokeWidth;
		fill(strokeColor);

		let r = Math.atan(tipHeight / 2),
			x1 = tickList[0],
			x2 = tickList[tickList.length - 1];
		if (includeLeftTip) {
			arrowTip(x1 + tipWidth, 0, x1, 0, tipWidth, tipHeight);
			x1 += tipWidth * Math.cos(r);
		}
		if (includeRightTip) {
			arrowTip(x2 - tipWidth, 0, x2, 0, tipWidth, tipHeight);
			x2 -= tipWidth * Math.cos(r) * 1;
		}
		line(x1, 0, x2, 0);
		ctx.save();
		fontSize(axisFont);
		ctx.scale(1 / unitSpace, 1 / unitSpace);
		ctx.translate(
			(x2 + configs.axisLabelDirection[0]) * unitSpace,
			-configs.axisLabelDirection[1] * axisFont,
		);
		ctx.rotate(textRotation);
		textRenderer(axisLabel, 0, 0);
		ctx.restore();
	}

	function drawTicks() {
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = strokeWidth;
		let start = includeLeftTip ? 1 : 0,
			end = includeRightTip ? tickList.length - 1 : tickList.length;
		for (let i = start; i < end; i++) {
			let tick = tickList[i];
			if (
				(tick === 0 && excludeOriginTick) ||
				numbersToExclude.includes(tickList[0][i])
			) {
				continue;
			}
			let tH = numbersWithElongatedTicks.includes(tick) ? tickHeight : longerTickHeight;
			line(tick, -tH / 2, tick, tH / 2);
		}
	}

	function drawNumbers() {
		ctx.fillStyle = configs.textColor;
		fontSize(labelFontSize);
		ctx.textAlign = configs.textAlign;
		ctx.textBaseline = configs.textBaseline;
		let labels = labelsToInclude.length > 0 ? labelsToInclude : tickList,
			start = includeLeftTip ? 1 : 0,
			end = includeRightTip ? tickList.length - 1 : tickList.length;
		ctx.save();
		ctx.scale(1 / unitSpace, 1 / unitSpace);
		for (let i = start; i < end; i++) {
			if (i >= labels.length) break;
			let tick =
				typeof labels[i] == "number" ? labels[i].toFixed(decimalPlaces) : labels[i];
			if (
				(tickList[i] == 0 && excludeOriginTick) || // exclude origin tick
				numbersToExclude.indexOf(tickList[i]) > -1 // exclude ticks that were said to ignore explictly.
			) {
				continue;
			}
			let width = ctx.measureText(tick).width;

			let xShift = tickList[i] - textDirection[0] * width;
			let yShift = textDirection[1] * labelFontSize;
			ctx.save();

			// shift by text direction
			ctx.translate(xShift * unitSpace, yShift);
			ctx.rotate(textRotation);
			textRenderer(tick, 0, 0);
			ctx.restore();
		}
		ctx.restore();
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
 * @param {Object} configs Possible configurations are:
 * @param {Object} configs.xAxis Configurations for x axis. (See {@link numberLine} for more configurations)
 * @param {Object} configs.yAxis Configurations for y axis. (See {@link numberLine} for more configurations)
 * @param {number[]} [configs.originPosition = ORIGIN] originPosition of axes
 *
 * @returns {CartesianPlotters}
 */
export function axes(configs = {}) {
	const ctx = C.workingContext;
	const cvs = C.workingCanvas;
	// configurations
	configs = applyDefault(
		{
			xAxis: {
				length: cvs.width,
				includeTicks: true,
				includeLeftTip: false,
				includeRightTip: true,
				excludeOriginTick: true,
			},
			yAxis: {
				length: cvs.height,
				rotation: Math.PI / 2,
				textRotation: -Math.PI / 2,
				textDirection: [0, 0.75],
				includeTicks: true,
				includeLeftTip: false,
				includeRightTip: true,
				excludeOriginTick: true,
			},
			originPosition: ORIGIN,
		},
		configs,
	);
	ctx.save();
	// translate to originPosition
	ctx.translate(configs.originPosition[0], configs.originPosition[1]);
	// draws axes
	const xAxisLine = numberLine(configs.xAxis); // draw x axis
	const yAxisLine = numberLine(configs.yAxis); // draw y axis

	ctx.restore();
	return getCartasianFunctions({
		originPosition: configs.originPosition, // originPosition of axis as [x, y] in px
		xAxis: xAxisLine, // x axis confiurations from numberLine
		yAxis: yAxisLine, // y axis confiurations from numberLine
		unitSpace: [xAxisLine.unitSpace, yAxisLine.unitSpace], // space between two ticks in pixels
		unitValue: [xAxisLine.unitValue, yAxisLine.unitValue], // value between two close ticks
	});
}

/**
 * Creates a numberPlane based on following parameters inside a Object
 * @param {Object} configs Possible parameters:
 * @param {Object} configs.xAxis Configurations for x axis. See {@link numberLine} for possible configurations.
 * @param {Object} configs.yAxis Configurations for y axis. See {@link numberLine} for possible configurations.
 * @param {number[]} configs.originPosition Center of number plane as [x, y] in px.
 * @param {number[]} [configs.subgrids] number of sub-grid lines in each cell. Default=[1,1]
 * @param {Object} configs.grid Set of styles to draw grid & subgrids. This can have following properties:
 * @param {number} [configs.gridStrokeWidth = 1]  stroke width of grid lines
 * @param {number} [configs.subgridStrokeWidth = 0.7]  stroke width of sub-grid
 * @param {string} [configs.gridStrokeColor = "#58c4dda0"]  color of grid lines
 * @param {string} [configs.subgridStrokeColor = "#888888a0"]  color of sub-grids
 *
 * @returns {CartesianPlotters}
 */
export function numberPlane(configs = {}) {
	const cvs = C.workingCanvas;
	const ctx = C.workingContext;
	// default configurations
	const defaultConfigs = {
		xAxis: {
			length: parseInt(cvs.style.width),
			includeTicks: true,
			includeLabels: true,
			includeLeftTip: false,
			includeRightTip: false,
			excludeOriginTick: true,
			unitSpace: 50,
		},
		yAxis: {
			length: parseInt(cvs.style.height),
			textRotation: -Math.PI / 2,
			unitSpace: 50,
			includeTicks: true,
			includeLabels: true,
			includeLeftTip: false,
			includeRightTip: false,
			excludeOriginTick: true,
		},
		subgrids: [1, 1],
		gridStrokeWidth: 1.3,
		subgridStrokeWidth: 0.8,
		gridStrokeColor: Colors.aqua + "44",
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
		ctx.beginPath();
		ctx.lineWidth = gridStrokeWidth;
		ctx.strokeStyle = gridStrokeColor;
		// vertical grid lines
		let max = yRange[1] - (yRange[1] % yRange[2]);
		for (let i = xRange[0]; i <= xRange[1]; i += xRange[2]) {
			if (
				(xAxis.excludeOriginTick && i == 0) ||
				(xAxis.includeLeftTip && i == xRange[0]) ||
				(xAxis.includeRightTip && i == xRange[1])
			)
				continue;
			ctx.moveTo(i, yRange[0]);
			ctx.lineTo(i, max);
		}
		// horizontal grid lines
		max = xRange[1] - (xRange[1] % xRange[2]);
		for (let i = yRange[0]; i <= yRange[1]; i += yRange[2]) {
			if (
				(yAxis.excludeOriginTick && i == 0) ||
				(yAxis.includeLeftTip && i == yRange[0]) ||
				(yAxis.includeRightTip && i == yRange[1])
			)
				continue;
			ctx.moveTo(xRange[0], i);
			ctx.lineTo(max, i);
		}

		ctx.stroke();
		ctx.closePath();

		// draw subgrid grid lines
		ctx.beginPath();
		ctx.lineWidth = subgridStrokeWidth;
		ctx.strokeStyle = configs.subgridStrokeColor;
		let spacing = 1 / (subgrids[0] + 1); // space between two subgrids
		// vertical subgrids
		for (let k = xRange[0]; k <= xRange[1]; k += spacing) {
			if (k % unitValue[0] == 0) {
				continue;
			}
			ctx.moveTo(k, yRange[0]);
			ctx.lineTo(k, yRange[1]);
		}
		spacing = 1 / (subgrids[1] + 1);
		// horizontal subgrids
		for (let k = yRange[0]; k <= yRange[1]; k += spacing) {
			if (k % unitValue[1] == 0) {
				continue;
			}
			ctx.moveTo(xRange[0], k);
			ctx.lineTo(xRange[1], k);
		}
		ctx.stroke();
		ctx.closePath();
	}

	return getCartasianFunctions({
		originPosition: originPosition, // position of origin of number plane
		unitValue: unitValue, // how much a unit is in its value
		unitSpace: unitSpace, // how much a unit is in px
		xAxis: axesLines.xAxis, // x axis confiurations from numberLine
		yAxis: axesLines.yAxis, // y axis confiurations from numberLine
		subgridUnit: subgrids, // subgrid unit size
	});
}

/**
 * Creates a polar plane. change following configs to customize the plane
 * @param {Object} configs - configurations
 * @param {number[]} [configs.originPosition = ORIGIN] position of origin of plane
 * @param {number} [configs.maxRadius = 4] maximum radius of the polar plane
 * @param {number} [configs.size] diameter of the plane in pixels. Default it will try to fit in the canvas
 * @param {number} [configs.radiusStep = 1] step size of radius
 * @param {string} [configs.azimuthUnit = "degrees"]  azimuth unit:
 *  * "PI radians" or "TAU radians": 20
 *  * "degrees": 36
 *  * "gradians": 40
 * @param {number} [configs.azimuthDivisions = 0]  The number of divisions in the azimuth (also known as the angular coordinate or polar angle). If None is specified then it will use the default specified by azimuthUnit
 * @param {Array.<*>} [configs.radialLabels = []] Labels for the radial axis. If nothing is specified then the labels will be automatically generated using the radialStep.
 * @param {string} [configs.azimuthDirection = "ccw"] direction of the azimuthal labels. This can be either 'ccw' or 'cw'

 * @param {Object} [configs.radiusConfigs] radial axis configurations
 * @param {string} [configs.radiusConfigs.strokeColor = "#fff"] stroke color of the radial axis
 * @param {string} [configs.radiusConfigs.fontFamily = "serif"] font family of the radial axis labels
 * @param {string} [configs.radiusConfigs.textAlign = "center"] text align of the radial axis labels
 * @param {string} [configs.radiusConfigs.textBaseline = "middle"] text baseline of the radial axis labels
 * @param {number} [configs.radiusConfigs.strokeWidth = 2] stroke width of the radial axis in pixels
 * @param {number} [configs.radiusConfigs.fontSize = 22] font size of the radial axis in pixels
 * @param {number} [configs.radiusConfigs.decimalPoints = 0] number of decimal points to show up in the radial axis labels
 * @param {Function} [configs.radiusConfigs.textRenderer = fillText] function that renders text. you can use strokeText to get stroked text, or something else to get custom text
 * @param {number[]} [configs.radiusConfigs.textDirection = [-1.4, -1.2]] direction of the radial axis label. This'll align labels correctly in the position.
 * @param {number[]} [configs.radiusConfigs.labelAxis = [1, 0]] axis to labels
 * @param {boolean} [configs.radiusConfigs.includeLabels = true] whether to draw radial labels or not

 * @param {Object} [configs.azimuth] azimuth line configurations
 * @param {boolean} [configs.azimuth.compactFraction = true] whether to show the azimuthal fraction as compact or not
 * @param {number} [configs.azimuth.offset = 0] radial offset of the azimuthal labels
 * @param {number} [configs.azimuth.labelBuff = 0.5] buffer between the outermost azimuthal circle and the azimuthal labels
 * @param {number} [configs.azimuth.fontSize = 17] font size of the azimuthal labels
 * @param {number} [configs.azimuth.strokeWidth = 1.5] stroke width of the azimuthal lines
 * @param {number} [configs.azimuth.decimalPoints = 0] number of decimal points to show up in the azimuthal labels
 * @param {string} [configs.azimuth.fontFamily = "serif"] font family of the azimuthal labels
 * @param {string} [configs.azimuth.strokeColor = "#58c4dddd"] stroke color of the azimuthal labels
 * @param {Function} [configs.azimuth.textRenderer = fillText] function that renders text. you can use strokeText to get stroked text, or something else to get custom text
 * @param {boolean} [configs.azimuth.includeLabels = true] whether to draw azimuthal labels or not
 *
 * @returns {PolarPlotters}
 */
export function polarPlane(configs = {}) {
	let ctx = C.workingContext,
		cvs = C.workingCanvas,
		azimuthUnitsDict = {
			"pi radians": 20,
			"tau radians": 20,
			degrees: 24,
			gradians: 20,
		};
	configs = applyDefault(
		{
			originPosition: ORIGIN,
			maxRadius: 4.0,
			size: Math.min(parseInt(cvs.style.width), parseInt(cvs.style.height)) * 0.8,
			radiusStep: 1,
			azimuthUnit: "PI radians",
			azimuthDivisions: 0,
			azimuthCompactFraction: true,
			azimuthDirection: "ccw",
			azimuthoffset: 0,
			fadedLines: 1,
			radiusConfigs: {
				includeLabels: true,
				includeTicks: false,
				includeRightTip: false,
				strokeColor: "#fff",
				strokeWidth: 2,
				fontSize: 22,
				fontFamily: "serif",
				textDirection: [0.8, -0.75],
				labelAxis: [1],
				numbersToExclude: [0],
			},
			azimuthConfigs: {
				includeLabels: true,
				labelBuff: 0.45,
				fontSize: 15,
				fontFamily: "serif",
				textAlign: "center",
				textBaseline: "middle",
				strokeColor: "#58c4ddaa",
				strokeWidth: 1.3,
				textRenderer: fillText,
				decimalPoints: 0,
			},
			fadedLineConfigs: {
				strokeColor: "#8888",
				strokeWidth: 1,
			},
		},
		configs,
	);
	let {
		originPosition,
		maxRadius,
		size,
		radiusStep,
		azimuthUnit,
		azimuthDivisions,
		azimuthCompactFraction,
		azimuthDirection,
		radiusConfigs,
		azimuthConfigs,
		fadedLines,
		fadedLineConfigs,
		azimuthoffset,
	} = configs;
	azimuthUnit = azimuthUnit.toLowerCase();
	// error catching
	if (azimuthUnitsDict[azimuthUnit] != undefined) {
		azimuthUnit = azimuthUnit;
	} else {
		throw new Error(
			"Invalid azimuth units. Expected one of: PI radians, TAU radians, degrees, gradians.",
		);
	}
	if (azimuthDivisions == 0) {
		azimuthDivisions = azimuthUnitsDict[azimuthUnit] || 20;
	}

	save();
	ctx.translate(originPosition[0], originPosition[1]);
	let tickList = arange(0, maxRadius, radiusStep),
		radialSpacing = size / maxRadius / 2;
	azimuthConfigs.strokeWidth /= radialSpacing;
	fadedLineConfigs.strokeWidth /= radialSpacing;
	azimuthConfigs.fontSize /= radialSpacing;
	let /** @type {Array} */
		labels = Array.isArray(radiusConfigs.labelsToInclude)
			? radiusConfigs.labelsToInclude
			: tickList,
		xLabels = [],
		yLabels = [];
	// find labels for each wings of axis
	if (radiusConfigs.labelAxis.indexOf(3) > -1) {
		// add left wing of x-axis
		xLabels = labels.reverse();
	} else {
		xLabels = new Array(maxRadius).fill("");
	}

	if (radiusConfigs.labelAxis.indexOf(1) > -1) {
		// add right wing of x-axis
		xLabels = xLabels.concat(labels);
	} else {
		xLabels.push(...new Array(maxRadius).fill(""));
	}

	if (radiusConfigs.labelAxis.indexOf(2) > -1) {
		// add top wing of y-axis
		yLabels = labels.reverse();
	} else {
		yLabels = new Array(maxRadius).fill("");
	}

	if (radiusConfigs.labelAxis.indexOf(4) > -1) {
		// add bottom wing of y-axis
		yLabels = yLabels.concat(labels.reverse());
	} else {
		yLabels.push(...new Array(maxRadius).fill(""));
	}

	radiusConfigs.range = [-maxRadius, maxRadius, radiusStep];
	radiusConfigs.length = size;

	let xAxisCfgs = applyDefault(radiusConfigs, {
			labelsToInclude: xLabels,
		}),
		yAxisCfgs = applyDefault(radiusConfigs, {
			labelsToInclude: yLabels,
		});
	ctx.scale(radialSpacing, radialSpacing);
	drawAzimuthalLines();
	restore();
	axes({
		xAxis: xAxisCfgs,
		yAxis: yAxisCfgs,
	});

	function drawAzimuthalLines() {
		fadedLines++;

		// draw azimuthal divisions
		let labels = [];
		ctx.font = `${azimuthConfigs.fontSize}px ${azimuthConfigs.fontFamily}`;
		ctx.textAlign = azimuthConfigs.textAlign;
		ctx.textBaseline = azimuthConfigs.textBaseline;

		// generate labels
		if (azimuthUnit == "pi radians" || azimuthUnit == "tau radians") {
			let numerator = 1,
				denominator = azimuthDivisions;
			azimuthConfigs.textRenderer = tex;
			let post = azimuthUnit == "tau radians" ? "\\tau" : "\\pi";
			ctx.font = `${azimuthConfigs.fontSize * radialSpacing}px ${
				azimuthConfigs.fontFamily
			}`;
			for (let division = 0; division < azimuthDivisions; division++) {
				labels.push(
					fraction(numerator * division, denominator, true, azimuthCompactFraction, post),
				);
			}
		} else if (azimuthUnit == "degrees") {
			// Use Tex parser to generate fractions
			for (let i = 0; i < azimuthDivisions; i++) {
				labels.push(
					((i * 360) / azimuthDivisions).toFixed(azimuthConfigs.decimalPoints) + "°",
				);
			}
		} else if (azimuthUnit == "gradians") {
			for (let i = 0; i < azimuthDivisions; i++) {
				labels.push(
					((i * 400) / azimuthDivisions).toFixed(azimuthConfigs.decimalPoints) + "ᵍ",
				);
			}
		}

		let angleIncrementor = (Math.PI * 2) / azimuthDivisions,
			angle = 0;
		if (azimuthDirection.toLowerCase() == "cw") angleIncrementor *= -1;
		let scalar = 1;
		if (azimuthUnit == "pi radians" || azimuthUnit == "tau radians") {
			scalar = radialSpacing;
		}

		// draw radiating circles

		ctx.doFill = false;
		ctx.doStroke = true;
		if (fadedLines > 1) {
			// draw faded ones
			ctx.strokeStyle = fadedLineConfigs.strokeColor;
			ctx.lineWidth = fadedLineConfigs.strokeWidth;
			let step = 1 / fadedLines;
			let max = tickList.length / step - fadedLines;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			for (let i = 0; i < max; i++) {
				ctx.arc(0, 0, i * step, 0, Math.PI * 2);
			}

			max = azimuthDivisions / step / step;
			ctx.lineWidth = fadedLineConfigs.strokeWidth;
			for (let i = 0; i < max; i += step) {
				let angle = i * angleIncrementor;
				ctx.moveTo(0, 0);
				ctx.lineTo(
					Math.cos(angle + azimuthoffset) * maxRadius,
					Math.sin(angle + azimuthoffset) * maxRadius,
				);
			}
			ctx.stroke();
		}

		// and majors
		ctx.beginPath();
		ctx.strokeStyle = azimuthConfigs.strokeColor;
		ctx.lineWidth = azimuthConfigs.strokeWidth;
		ctx.moveTo(0, 0);
		for (let i = 0; i < tickList.length; i++) {
			ctx.arc(0, 0, i, 0, Math.PI * 2);
		}
		for (let i = 0; i < azimuthDivisions; i++) {
			// draw azimuthal lines only if it isn't over axis lines
			let angle = i * angleIncrementor + azimuthoffset;
			if (angle % (Math.PI / 2) != 0) {
				ctx.moveTo(0, 0);
				ctx.lineTo(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius);
			}
		}
		ctx.stroke();
		// draw azimuthal labels
		if (azimuthConfigs.includeLabels) {
			for (let i = 0; i < azimuthDivisions; i++) {
				angle = i * angleIncrementor + azimuthoffset;
				azimuthConfigs.textRenderer(
					labels[i],
					Math.cos(angle) * (maxRadius + azimuthConfigs.labelBuff) * scalar,
					Math.sin(angle) * (maxRadius + azimuthConfigs.labelBuff) * scalar,
				);
			}
		}
	}
	return getPolarPlotters({
		azimuthAnglularSpace: (2 * Math.PI) / azimuthDivisions,
		radialSpacing: radialSpacing,
	});
}
