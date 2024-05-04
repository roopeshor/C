import { C } from "../../main.js";
import {
	fontFamily,
	fontSize,
	restore,
	save,
	scale,
	textAlign,
	textBaseline,
} from "../../settings.js";
import { applyDefault, arange, fraction, texFraction } from "../../utils.js";
import { tex, tex2svgExists } from "../tex.js";
import { fillText } from "../text.js";
import { axes } from "./axes.js";

/**
 * @typedef {Object} PolarPlotters
 * @property {Function} plotPoints see {@link plotPolarPoints}
 * @property {Function} parametricFunction see {@link polarParametricFunction}
 * @property {Function} functionGraph see {@link polarFuntionGraph}
 */

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
		scaleCanvas: function () {
			scale(configs.radialSpacing, configs.radialSpacing);
		},
	};
}

const ORIGIN = [0, 0];

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
 * @param {number[]} [configs.radiusConfigs.labelDirection = [-1.4, -1.2]] direction of the radial axis label. This'll align labels correctly in the position.
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
			pi: 20,
			tau: 20,
			deg: 24,
			grad: 20,
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
				fontSize: 16,
				fontFamily: "serif",
				labelDirection: [0.4, -1],
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
				numbersToExclude: [0],
			},
			fadedLineConfigs: {
				strokeColor: "#8888",
				strokeWidth: 1,
			},
		},
		configs,
	);
	const { originPosition, maxRadius, size, radiusStep, azimuthDivisions, radiusConfigs } =
		configs;
	let radialSpacing = size / maxRadius / 2;

	configs.azimuthUnit = getAzimuthUnit(configs.azimuthUnit);
	configs.azimuthDirection = configs.azimuthDirection.toLowerCase();
	configs.fadedLines++;

	if (azimuthDivisions == 0 || isNaN(azimuthDivisions)) {
		configs.azimuthDivisions = azimuthUnitsDict[configs.azimuthUnit] || 20;
	}

	configs.tickList = arange(0, maxRadius, radiusStep);

	let labels = Array.isArray(radiusConfigs.labelsToInclude)
		? radiusConfigs.labelsToInclude
		: configs.tickList;

	// find labels for each wings of axis
	const [xLabels, yLabels] = fillLabels(maxRadius, labels, radiusConfigs.labelAxis);

	radiusConfigs.range = [-maxRadius, maxRadius, radiusStep];
	radiusConfigs.length = size;

	configs.radiusConfigs = radiusConfigs;
	configs.xLabels = xLabels;
	configs.yLabels = yLabels;
	configs.radialSpacing = radialSpacing;

	let xAxisCfgs = applyDefault(radiusConfigs, {
			labelsToInclude: xLabels,
			originPosition,
			axisLabel: "",
		}),
		yAxisCfgs = applyDefault(radiusConfigs, {
			labelsToInclude: yLabels,
			originPosition,
			axisLabel: "",
		});

	save();
	ctx.translate(originPosition[0] * radialSpacing, originPosition[1] * radialSpacing);
	drawAzimuthalLines(configs, ctx);
	restore();
	axes({
		xAxis: xAxisCfgs,
		yAxis: yAxisCfgs,
	});

	return getPolarPlotters({
		azimuthAnglularSpace: (2 * Math.PI) / azimuthDivisions,
		radialSpacing: radialSpacing,
	});
}

function drawAzimuthalLines(configs, ctx) {
	let { azimuthDivisions, azimuthDirection, azimuthConfigs, fadedLines } = configs;

	configs.labels = generateLabels(configs);

	configs.angleIncrementor = (Math.PI * 2) / azimuthDivisions;
	if (azimuthDirection == "cw") {
		configs.angleIncrementor *= -1;
	}

	if (fadedLines > 1) {
		drawMinors(configs, ctx);
	}

	drawMajors(configs, ctx);

	if (azimuthConfigs.includeLabels) {
		drawAzimuthalLabels(configs);
	}
}

function generateLabels(configs) {
	let labels = [];
	const {
		azimuthUnit,
		radialSpacing,
		azimuthConfigs,
		azimuthDivisions,
		azimuthCompactFraction,
	} = configs;
	if (azimuthUnit == "pi" || azimuthUnit == "tau") {
		let numerator = 1,
			denominator = azimuthDivisions,
			generator,
			post;

		if (tex2svgExists()) {
			azimuthConfigs.textRenderer = tex;
			post = azimuthUnit == "tau" ? "\\tau" : "\\pi";
			fontSize(azimuthConfigs.fontSize * radialSpacing);
			generator = texFraction;
		} else {
			console.warn("MathJax not found, using fillText instead");
			post = azimuthUnit == "pi" ? "π" : "τ";
			generator = fraction;
		}
		for (let division = 0; division < azimuthDivisions; division++) {
			labels.push(
				generator(numerator * division, denominator, true, azimuthCompactFraction, post),
			);
		}
	} else if (azimuthUnit == "deg") {
		// Use Tex parser to generate fractions
		for (let i = 0; i < azimuthDivisions; i++) {
			labels.push(
				((i * 360) / azimuthDivisions).toFixed(azimuthConfigs.decimalPoints) + "°",
			);
		}
	} else if (azimuthUnit == "grad") {
		for (let i = 0; i < azimuthDivisions; i++) {
			labels.push(
				((i * 400) / azimuthDivisions).toFixed(azimuthConfigs.decimalPoints) + "ᵍ",
			);
		}
	}
	return labels;
}

/**
 *
 * @param {Object} configs
 * @param {CanvasRenderingContext2D} ctx
 */
function drawMinors(configs, ctx) {
	const {
		maxRadius,
		azimuthoffset,
		angleIncrementor,
		fadedLineConfigs,
		azimuthDivisions,
		fadedLines,
		tickList,
		radialSpacing,
	} = configs;

	const step = 1 / fadedLines,
		radMax = (tickList.length - 1) * fadedLines,
		azmMax = azimuthDivisions * fadedLines;

	ctx.doFill = false;
	ctx.doStroke = true;
	ctx.strokeStyle = fadedLineConfigs.strokeColor;
	ctx.lineWidth = fadedLineConfigs.strokeWidth;
	ctx.beginPath();
	ctx.moveTo(0, 0);

	// radiating circle
	for (let i = 0; i < radMax; i++) {
		ctx.arc(0, 0, i * step * radialSpacing, 0, Math.PI * 2);
	}

	ctx.lineWidth = fadedLineConfigs.strokeWidth;

	for (let i = 0; i < azmMax; i++) {
		let angle = i * angleIncrementor * step;
		ctx.moveTo(0, 0);
		ctx.lineTo(
			Math.cos(angle + azimuthoffset) * maxRadius * radialSpacing,
			Math.sin(angle + azimuthoffset) * maxRadius * radialSpacing,
		);
	}
	ctx.stroke();
}

function drawMajors(configs, ctx) {
	const {
		azimuthConfigs,
		tickList,
		azimuthDivisions,
		angleIncrementor,
		azimuthoffset,
		maxRadius,
		radialSpacing,
	} = configs;
	ctx.beginPath();
	ctx.strokeStyle = azimuthConfigs.strokeColor;
	ctx.lineWidth = azimuthConfigs.strokeWidth;
	ctx.moveTo(0, 0);
	for (let i = 0; i < tickList.length; i++) {
		ctx.arc(0, 0, i * radialSpacing, 0, Math.PI * 2);
	}
	for (let i = 0; i < azimuthDivisions; i++) {
		let angle = i * angleIncrementor + azimuthoffset;
		if (angle % (Math.PI / 2) != 0) {
			// avoid axes
			ctx.moveTo(0, 0);
			ctx.lineTo(
				Math.cos(angle) * maxRadius * radialSpacing,
				Math.sin(angle) * maxRadius * radialSpacing,
			);
		}
	}
	ctx.stroke();
}

function drawAzimuthalLabels(configs) {
	const {
		azimuthDivisions,
		angleIncrementor,
		azimuthoffset,
		azimuthConfigs,
		maxRadius,
		labels,
		radialSpacing,
	} = configs;
	fontSize(azimuthConfigs.fontSize);
	fontFamily(azimuthConfigs.fontFamily);
	textAlign(azimuthConfigs.textAlign);
	textBaseline(azimuthConfigs.textBaseline);
	for (let i = 0; i < azimuthDivisions; i++) {
		let angle = i * angleIncrementor + azimuthoffset;
		if (!azimuthConfigs.numbersToExclude.includes(angle)) {
			azimuthConfigs.textRenderer(
				labels[i],
				Math.cos(angle) * (maxRadius + azimuthConfigs.labelBuff) * radialSpacing,
				Math.sin(angle) * (maxRadius + azimuthConfigs.labelBuff) * radialSpacing,
			);
		}
	}
}

/**
 *
 * @param {string} azmU
 * @returns {string}
 */
function getAzimuthUnit(azmU) {
	azmU = azmU
		.toLowerCase()
		.trim()
		.replace(/(rad.*|\s*)/, "rad");
	if (/.*(pi|π).*/.test(azmU)) azmU = "pi";
	else if (/.*(tau|τ).*/.test(azmU)) azmU = "tau";
	else if (/.*(deg|°).*/.test(azmU)) azmU = "deg";
	else if (/.*(grad|ᵍ).*/.test(azmU)) azmU = "grad";
	else
		throw new Error(
			"Invalid azimuth units. Expected one of: PI radians, TAU radians, degrees, gradians.",
		);

	return azmU;
}

function fillLabels(maxRadius, labels, labelAxis) {
	let xLabels = [],
		yLabels = [],
		// also remove last element
		lrev = [...labels].reverse().slice(0, maxRadius),
		EMPTY_ARR = new Array(maxRadius).fill("");

	// left of x-axis
	if (labelAxis.includes(3)) {
		xLabels.push(...lrev);
	} else {
		xLabels.push(...EMPTY_ARR);
	}

	// right of x-axis
	if (labelAxis.includes(1)) {
		xLabels.push(...labels);
	} else {
		xLabels.push(...EMPTY_ARR);
	}

	// top of y-axis
	if (labelAxis.includes(4)) {
		yLabels.push(...lrev);
	} else {
		yLabels.push(...EMPTY_ARR);
	}

	// bottom of y-axis
	if (labelAxis.includes(2)) {
		yLabels.push(...labels);
	} else {
		yLabels.push(...EMPTY_ARR);
	}

	return [xLabels, yLabels];
}
