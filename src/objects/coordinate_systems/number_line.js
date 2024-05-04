/** @module Coordinate-Systems*/

import { C } from "../../main.js";
import { fill, fontFamily, fontSize, restore, save, stroke } from "../../settings.js";
import { applyDefault, arange, measureHeight } from "../../utils.js";
import { arrowTip } from "../arrows.js";
import { line } from "../geometry.js";
import { NumberLineConfigs } from "./types.js";

/**
 * Creates a numberLine with parameters in a object
 * @param {NumberLineConfigs} configs configuration object
 * @returns {ScalarSpaceProperties}
 */
export function numberLine(configs = {}) {
	const ctx = C.workingContext;
	configs = applyDefault(NumberLineConfigs, configs);
	if (isNaN(configs.length)) {
		configs.length = WIDTH;
	}

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
