/** @module Coordinate-Systems*/

import { ORIGIN, axes } from "../../c.js";
import { C } from "../../main.js";
import { restore, save } from "../../settings.js";
import { applyDefault } from "../../utils.js";
import { getCartasianFunctions } from "./cartesian_plotters.js";
import { CartesianPlotters, NumberLineConfigs, NumberPlaneConfigs } from "./types.js";

/**
 * Creates a numberPlane based on following parameters inside a Object
 * @param {NumberPlaneConfigs} configs
 * @returns {CartesianPlotters}
 */
export function numberPlane(configs = {}) {
	const ctx = C.workingContext;
	configs = applyDefault(NumberPlaneConfigs, configs);
	let { originPosition, subgrids, gridStrokeWidth, subgridStrokeWidth, gridStrokeColor } =
		configs;

	// range of ticks in each axis
	const axesLines = axes(configs);
	const { xAxis, yAxis } = axesLines;
	const [xMin, xMax, xStep] = xAxis.range;
	const [yMin, yMax, yStep] = yAxis.range;

	// draw grids
	const unitSpace = axesLines.unitSpace;
	const unitValue = axesLines.unitValue;
	save();
	axesLines.scaleCanvas();
	ctx.translate(originPosition[0], originPosition[1]);
	gridStrokeWidth /= unitSpace[1];
	subgridStrokeWidth /= unitSpace[1];
	drawGridLines();

	// size of a unit cell
	function drawGridLines() {
		// major grid lines
		ctx.beginPath();
		ctx.lineWidth = gridStrokeWidth;
		ctx.strokeStyle = gridStrokeColor;
		// vertical grid lines
		let max = yMax - (yMax % yStep);
		for (let i = xMin; i <= xMax; i += xStep) {
			if (
				i != 0 &&
				!((xAxis.includeLeftTip && i == xMin) || (xAxis.includeRightTip && i == xMax))
			) {
				ctx.moveTo(i, yMin);
				ctx.lineTo(i, max);
			}
		}
		// horizontal grid lines
		max = xMax - (xMax % xStep);
		for (let i = yMin; i <= yMax; i += yStep) {
			if (
				i != 0 &&
				!((yAxis.includeLeftTip && i == yMin) || (yAxis.includeRightTip && i == yMax))
			) {
				ctx.moveTo(xMin, i);
				ctx.lineTo(max, i);
			}
		}

		ctx.stroke();
		ctx.closePath();

		drawSubgrids();
	}

	function drawSubgrids() {
		ctx.beginPath();
		ctx.lineWidth = subgridStrokeWidth;
		ctx.strokeStyle = configs.subgridStrokeColor;
		let spacing = 1 / (subgrids[0] + 1); // space between two subgrids
		// vertical subgrids
		for (let k = xMin; k <= xMax; k += spacing) {
			if (k % unitValue[0] != 0) {
				ctx.moveTo(k, yMin);
				ctx.lineTo(k, yMax);
			}
		}
		spacing = 1 / (subgrids[1] + 1);
		// horizontal subgrids
		for (let k = yMin; k <= yMax; k += spacing) {
			if (k % unitValue[1] != 0) {
				ctx.moveTo(xMin, k);
				ctx.lineTo(xMax, k);
			}
		}
		ctx.stroke();
		ctx.closePath();
	}
	restore();
	return getCartasianFunctions({
		originPosition: originPosition, // position of origin of number plane
		unitValue: unitValue, // how much a unit is in its value
		unitSpace: unitSpace, // how much a unit is in px
		xAxis: xAxis, // x axis confiurations from numberLine
		yAxis: yAxis, // y axis confiurations from numberLine
		subgridUnit: subgrids, // subgrid unit size
	});
}
