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
import { axes } from "./axes.js";
import { PolarPlaneConfigs, PolarPlotters } from "./types.js";

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

/**
 * Creates a polar plane. change following configs to customize the plane
 * @param {PolarPlaneConfigs} configs
 * @returns {PolarPlotters}
 */
export function polarPlane(configs = {}) {
	let ctx = C.workingContext;
	azimuthUnitsDict = {
		pi: 20,
		tau: 20,
		deg: 24,
		grad: 20,
	};
	configs = applyDefault(PolarPlaneConfigs, configs);
	if (isNaN(configs.size)) {
		configs.size = Math.min(WIDTH, HEIGHT) * 0.8;
	}
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
