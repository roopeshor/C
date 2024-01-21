/** @module Coordinate-Systems*/

import { Colors } from "../../c.js";
import { C } from "../../main.js";
import { fill, fontSize, restore, save, stroke } from "../../settings.js";
import { applyDefault, arange } from "../../utils.js";
import { arrowTip } from "../arrows.js";
import { line } from "../geometry.js";
import { fillText } from "../text.js";

const ORIGIN = [0, 0];

/**
 * Creates a numberLine with parameters in a object
 * @param {Object} configs configuration object
 *
 * @param {number} [configs.tipLength = 13] width of arrow tip in px
 * @param {number} [configs.tipBreadth = 10] height of tip
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
			length: parseInt(cvs.style.width),
			originPosition: ORIGIN,
			range: [-5, 5, 1],
			strokeColor: Colors.white + "88",
			axisLabel: "",
			axisFont: 14,
			axisLabelDirection: [1, -1],

			tipLength: 13,
			tipBreadth: 10,

			fontSize: 17,
			fontFamily: "serif",
			textRenderer: fillText,
			textAlign: "center",
			textBaseline: "ideographic",
			textColor: "white",
			textRotation: 0,
			textDirection: [-0.1, -0.45],

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

	let { range, decimalPlaces } = configs;
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
		configs.decimalPlaces = (range[2].toString().split(".")[1] || []).length;
	}

	let step = range[2],
		/** Space between two ticks in pixels*/
		unitSpace = configs.length / (range[1] - range[0]),
		/** A list of numbers that'll be displayed if no labels are given through numberToInclude */
		tickList = arange(range[0], range[1], step);

	// scale everyting down
	configs.strokeWidth /= unitSpace;
	configs.tipLength /= unitSpace;
	configs.tipBreadth /= unitSpace;
	configs.tickHeight /= unitSpace;
	configs.fontSize /= unitSpace;
	configs.axisFont /= unitSpace;
	configs.longerTickHeight /= unitSpace;
	configs.unitSpace = unitSpace;
	configs.tickList = tickList;

	save();

	ctx.translate(configs.originPosition[0], configs.originPosition[1]);
	ctx.scale(unitSpace, unitSpace);
	ctx.rotate(configs.rotation);

	if (configs.includeTicks) drawTicks(configs, ctx);
	if (configs.includeLabels) drawNumbers(configs, ctx);
	drawAxis(configs, ctx);

	restore(configs);
	return {
		range: range,
		originPosition: configs.originPosition,
		tickList: tickList,
		unitValue: step,
		unitSpace: unitSpace,
	};
}

function drawAxis(configs, ctx) {
	let {
		includeLeftTip,
		includeRightTip,
		axisFont,
		unitSpace,
		axisLabelDirection,
		range,
		tipLength,
		tipBreadth,
	} = configs;
	let min = range[0],
		max = range[1];
	stroke(configs.strokeColor);
	ctx.lineWidth = configs.strokeWidth;
	fill(configs.strokeColor);

	let x1 = min,
		x2 = max;
	ctx.doStroke = false;
	if (includeLeftTip) {
		arrowTip(x1 + tipLength, 0, x1, 0, tipLength, tipBreadth);
		x1 += tipLength;
	}
	if (includeRightTip) {
		arrowTip(x2 - tipLength, 0, x2, 0, tipLength, tipBreadth);
		x2 -= tipLength;
	}

	line(x1, 0, x2, 0);
	// ctx.scale(1 / unitSpace, 1 / unitSpace);
	fontSize(configs.axisFont);
	ctx.translate(
		(x2 + axisLabelDirection[0]) * unitSpace,
		-axisLabelDirection[1] * axisFont,
	);
	ctx.rotate(configs.textRotation);
	configs.textRenderer(configs.axisLabel, 0, 0);
	restore();
}

function drawTicks(configs, ctx) {
	let {
		includeLeftTip,
		includeRightTip,
		tickList,
		excludeOriginTick,
		numbersToExclude,
		numbersWithElongatedTicks,
		longerTickHeight,
		tickHeight,
	} = configs;
	ctx.strokeStyle = configs.strokeColor;
	ctx.lineWidth = configs.strokeWidth;

	let start = includeLeftTip ? 1 : 0,
		end = tickList.length - (includeRightTip ? 1 : 0);

	for (let i = start; i < end; i++) {
		let tick = tickList[i];
		if (
			!(tick === 0 && excludeOriginTick) &&
			!numbersToExclude.includes(tickList[0][i])
		) {
			let tH = numbersWithElongatedTicks.includes(tick) ? tickHeight : longerTickHeight;
			line(tick, -tH / 2, tick, tH / 2);
		}
	}
}

function drawNumbers(configs, ctx) {
	let {
		includeLeftTip,
		includeRightTip,
		tickList,
		excludeOriginTick,
		numbersToExclude,
		labelsToInclude,
		textDirection,
	} = configs;
	ctx.fillStyle = configs.textColor;
	ctx.textAlign = configs.textAlign;
	ctx.textBaseline = configs.textBaseline;
	ctx.fontFamily = configs.fontFamily;
	fontSize(configs.fontSize);

	let labels = labelsToInclude.length > 0 ? labelsToInclude : tickList,
		start = includeLeftTip ? 1 : 0,
		end = includeRightTip ? tickList.length - 1 : tickList.length;
	ctx.save();
	let yAdjust = (ctx.yAxisInverted ? 1 : -1) * Math.cos(configs.textRotation) * 0.25;
	let xAdjust = (ctx.yAxisInverted ? 1 : -1) * Math.sin(configs.textRotation) * 0.25;
	for (let i = start; i < end && i < labels.length; i++) {
		if (
			!(tickList[i] == 0 && excludeOriginTick) && // exclude origin tick
			!numbersToExclude.includes(tickList[i]) // exclude ticks that were said to ignore explictly.
		) {
			let tick =
				typeof labels[i] == "number"
					? labels[i].toFixed(configs.decimalPlaces)
					: labels[i];
			let { width, emHeightAscent } = ctx.measureText(tick);
			let xShift = tickList[i] + textDirection[0] * width + emHeightAscent * xAdjust;
			let yShift = (textDirection[1] - yAdjust) * emHeightAscent;
			ctx.save();
			// shift by text direction
			ctx.translate(xShift, yShift);
			ctx.rotate(configs.textRotation);
			configs.textRenderer(tick, 0, 0);
			ctx.restore();
		}
	}
	ctx.restore();
}
