import { C } from "../main.js";
import { restore, save } from "../settings.js";
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

// list of plotters
function getCartasianPlotters(configs) {
	return Object.assign(configs, {
		getParametricFunction: function (cfg) {
			cfg.unitSpace = configs.unitSpace;
			cfg.unitValue = configs.unitValue;
			return parametricFunction(cfg);
		},
		getFunctionGraph: function (cfg) {
			cfg.unitSpace = configs.unitSpace;
			cfg.unitValue = configs.unitValue;
			return functionGraph(cfg);
		},
		getHeatPlot: function (cfg) {
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
	});
}

function getPolarPlotters(configs) {
	return {
		plotPoints: function (cfg) {
			cfg.radialSpacing = cfg.radialSpacing || configs.radialSpacing;
			plotPolarPoints(cfg);
		},
		parametricFunction: function (cfg) {
			cfg.radialSpacing = cfg.radialSpacing || configs.radialSpacing;
			return polarParametricFunction(cfg);
		},
		functionGraph: function (cfg) {
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
 * @param {string} [configs.strokeColor = "white"] Color of axis and ticks
 * @param {string} [configs.textColor = "white"] Color of text
 *
 * @param {Array<number>} [configs.textDirection = TEXT_DIR] Direction of text relative to nearby tick
 * @param {Array<number>} [configs.numbersWithElongatedTicks] list of numbers where tick line should be longer
 * @param {Array<number>} [configs.originPosition = ORIGIN] position of the origin of number line in pixels.
 * @param {Array<number>} [configs.range] range of numbers to draw ticks and numbers. Default: [-5, 5, 1]
 * @param {Array<number>} [configs.labelsToInclude] list of labels to be displayed instead of default numbers
 * @param {Array<number>} [configs.numbersToExclude] list of numbers that shouldn't be displayed
 * @param {Array<number>} [configs.textDirection = [0, -1]]

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
			strokeColor: "white",

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
			labelsToInclude: [],
			numbersToExclude: [0],
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
		labelsToInclude,
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
		unitSpace = configs.length / totalTicks,
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

	if (configs.includeTicks) drawTicks();
	if (configs.includeLabels) drawNumbers();
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
		const labels = labelsToInclude.length > 0 ? labelsToInclude : tickList;
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
	return getCartasianPlotters({
		originPosition: configs.originPosition, // originPosition of axis as [x, y] in px
		xAxis: xAxisLine, // x axis confiurations from numberLine
		yAxis: yAxisLine, // y axis confiurations from numberLine
		unitSpace: [xAxisLine.unitSpace, yAxisLine.unitSpace], // space between two ticks in pixels
		unitValue: [xAxisLine.unitValue, yAxisLine.unitValue], // value between two close ticks
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

	return getCartasianPlotters({
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
 * @param {Array<number>} [originPosition = ORIGIN] position of origin of plane
 * @param {number} [maxRadius = 4] maximum radius of the polar plane
 * @param {number} [size] diameter of the plane in pixels. Default it will try to fit in the canvas
 * @param {number} [radiusStep = 1] step size of radius
 * @param {string} [azimuthUnit = "degrees"]  azimuth unit:
 *  * "PI radians" or "TAU radians": 20
 *  * "degrees": 36
 *  * "gradians": 40
 * @param {number} [azimuthDivisions = 0]  The number of divisions in the azimuth (also known as the angular coordinate or polar angle). If None is specified then it will use the default specified by azimuthUnit
 * @param {Array<*>} [radialLabels = []] Labels for the radial axis. If nothing is specified then the labels will be automatically generated using the radialStep.
 * @param {string} [azimuthDirection = "ccw"] direction of the azimuthal labels. This can be either 'ccw' or 'cw'

 * @param {Object} [radiusConfigs] radial axis configurations
 * @param {string} [radiusConfigs.strokeColor = "#fff"] stroke color of the radial axis
 * @param {string} [radiusConfigs.fontFamily = "serif"] font family of the radial axis labels
 * @param {string} [radiusConfigs.textAlign = "center"] text align of the radial axis labels
 * @param {string} [radiusConfigs.textBaseline = "middle"] text baseline of the radial axis labels
 * @param {number} [radiusConfigs.strokeWidth = 2] stroke width of the radial axis in pixels
 * @param {number} [radiusConfigs.fontSize = 22] font size of the radial axis in pixels
 * @param {number} [radiusConfigs.decimalPoints = 0] number of decimal points to show up in the radial axis labels
 * @param {function} [radiusConfigs.textRenderer = fillText] function that renders text. you can use strokeText to get stroked text, or something else to get custom text
 * @param {Array<number>} [radiusConfigs.textDirection = [-1.4, -1.2]] direction of the radial axis label. This'll align labels correctly in the position.
 * @param {Array<number>} [radiusConfigs.labelAxis = [1, 0]] axis to labels
 * @param {boolean} [radiusConfigs.includeLabels = true] whether to draw radial labels or not

 * @param {Object} [azimuth] azimuth line configurations
 * @param {boolean} [azimuth.compactFraction = true] whether to show the azimuthal fraction as compact or not
 * @param {number} [azimuth.offset = 0] radial offset of the azimuthal labels
 * @param {number} [azimuth.labelBuff = 0.5] buffer between the outermost azimuthal circle and the azimuthal labels
 * @param {number} [azimuth.fontSize = 17] font size of the azimuthal labels
 * @param {number} [azimuth.strokeWidth = 1.5] stroke width of the azimuthal lines
 * @param {number} [azimuth.decimalPoints = 0] number of decimal points to show up in the azimuthal labels
 * @param {string} [azimuth.fontFamily = "serif"] font family of the azimuthal labels
 * @param {string} [azimuth.strokeColor = "#58c4dddd"] stroke color of the azimuthal labels
 * @param {function} [azimuth.textRenderer = fillText] function that renders text. you can use strokeText to get stroked text, or something else to get custom text
 * @param {boolean} [azimuth.includeLabels = true] whether to draw azimuthal labels or not
 *
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
			ctx.font = `${azimuthConfigs.fontSize * radialSpacing}px ${azimuthConfigs.fontFamily}`;
			for (let division = 0; division < azimuthDivisions; division++) {
				labels.push(fraction(numerator * division, denominator, azimuthCompactFraction, post));
			}
		} else if (azimuthUnit == "degrees") {
			// Use Tex parser to generate fractions
			for (let i = 0; i < azimuthDivisions; i++) {
				labels.push(((i * 360) / azimuthDivisions).toFixed(azimuthConfigs.decimalPoints) + "°");
			}
		} else if (azimuthUnit == "gradians") {
			for (let i = 0; i < azimuthDivisions; i++) {
				labels.push(((i * 400) / azimuthDivisions).toFixed(azimuthConfigs.decimalPoints) + "ᵍ");
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
