/** @module Coordinate-Systems*/

import { Colors } from "../../c.js";
import { C } from "../../main.js";
import { fill, fontFamily, fontSize, restore, save, stroke } from "../../settings.js";
import { applyDefault, arange, measureHeight } from "../../utils.js";
import { arrowTip } from "../arrows.js";
import { line, point } from "../geometry.js";
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
 * @param {number[]} [configs.labelDirection = [0, -1]] Direction of text relative to nearby tick
 * @param {number[]} [configs.numbersWithElongatedTicks] list of numbers where tick line should be longer
 * @param {number[]} [configs.originPosition = ORIGIN] position of the origin of number line in pixels.
 * @param {number[]} [configs.range] range of numbers to draw ticks and numbers. Default: [-5, 5, 1]
 * @param {number[]} [configs.labelsToInclude] list of labels to be displayed instead of default numbers
 * @param {number[]} [configs.numbersToExclude] list of numbers that shouldn't be displayed

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
			axisLabelSize: 24,
			axisLabelColor: "#fff",
			axisLabelDirection: [0.5, 1.5],

			tipLength: 13,
			tipBreadth: 10,

			fontSize: 17,
			fontFamily: "serif",
			textRenderer: fillText,
			textBaseline: "middle",
			textColor: "#fff",
			textAlign: "center",
			textRotation: 0,
			labelDirection: [0, -1.6],

			tickHeight: 10,
			longerTickHeight: 15,
			labelsToInclude: [],
			numbersToExclude: [],
			numbersWithElongatedTicks: [],

			includeTicks: true,
			includeLabels: true,
			includeLeftTip: false,
			includeRightTip: false,
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

	configs.tickList = tickList;

	save();

	ctx.translate(
		configs.originPosition[0] * unitSpace,
		configs.originPosition[1] * unitSpace,
	);
	ctx.rotate(configs.rotation);
	configs.unitSpace = unitSpace;

	if (configs.includeTicks) drawTicks(configs, ctx);
	if (configs.includeLabels) drawLabels(configs, ctx);
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
		unitSpace,
		axisLabelDirection,
		range,
		tipLength,
		tipBreadth,
		axisLabel,
	} = configs;
	let [min, max] = range;
	save();
	stroke(configs.strokeColor);
	ctx.lineWidth = configs.strokeWidth;
	fill(configs.strokeColor);

	let x1 = min * unitSpace,
		x2 = max * unitSpace;
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
	fontSize(configs.axisLabelSize);
	fontFamily(configs.fontFamily);
	fill(configs.axisLabelColor);
	let height = measureHeight(axisLabel);
	ctx.translate(x2 + axisLabelDirection[0] * height, axisLabelDirection[1] * height);
	ctx.rotate(configs.textRotation);
	configs.textRenderer(axisLabel, 0, 0);
	restore();
}

function drawTicks(configs, ctx) {
	let {
		includeLeftTip,
		includeRightTip,
		tickList,
		numbersToExclude,
		numbersWithElongatedTicks,
		longerTickHeight,
		tickHeight,
		unitSpace,
	} = configs;
	ctx.strokeStyle = configs.strokeColor;
	ctx.lineWidth = configs.strokeWidth;

	let start = includeLeftTip ? 1 : 0,
		end = tickList.length - (includeRightTip ? 1 : 0);

	for (let i = start; i < end; i++) {
		let tick = tickList[i];
		if (!numbersToExclude.includes(tick)) {
			let tH = numbersWithElongatedTicks.includes(tick) ? longerTickHeight : tickHeight;
			line(tick * unitSpace, -tH / 2, tick * unitSpace, tH / 2);
		}
	}
}

/**
 *
 * @param {Object} configs
 * @param {CanvasRenderingContext2D} ctx
 */
function drawLabels(configs, ctx) {
	let {
		includeLeftTip,
		includeRightTip,
		tickList,
		numbersToExclude,
		labelsToInclude,
		labelDirection,
		unitSpace,
	} = configs;
	ctx.fillStyle = configs.textColor;
	ctx.textAlign = configs.textAlign;
	ctx.textBaseline = configs.textBaseline;
	ctx.fontFamily = configs.fontFamily;

	let labels = labelsToInclude.length > 0 ? labelsToInclude : tickList,
		start = includeLeftTip ? 1 : 0,
		end = includeRightTip ? tickList.length - 1 : tickList.length;

	fontSize(configs.fontSize);

	for (let i = start; i < end && i < labels.length; i++) {
		if (!numbersToExclude.includes(tickList[i])) {
			let tick =
				typeof labels[i] == "number"
					? labels[i].toFixed(configs.decimalPlaces)
					: labels[i];
			let height = measureHeight(tick);
			let xAdjust = labelDirection[0] * height;
			let yAdjust = labelDirection[1] * height;
			let xShift = tickList[i];

			ctx.save();
			ctx.translate(xShift * unitSpace + xAdjust, yAdjust);
			ctx.rotate(configs.textRotation);
			configs.textRenderer(tick, 0, 0);

			ctx.restore();
		}
	}
}
