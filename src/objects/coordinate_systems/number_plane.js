/** @module Coordinate-Systems*/

import { Colors, axes } from "../../c.js";
import { C } from "../../main.js";
import { restore, save } from "../../settings.js";
import { applyDefault } from "../../utils.js";
import { getCartasianFunctions } from "./cartesian_plotters.js";

const ORIGIN = [0, 0];

/**
 * @typedef {Object} NumberLineConfigs configurations about the number line
 * @property {number[]} originPosition - Center of the number line in px
 * @property {number[]} tickList - List of tick inervals
 * @property {number} unitValue - How much a unit is in its value in x and y directions.
 * @property {number} unitSpace - How much a unit is in px in x and y directions.
 */

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
	const ctx = C.workingContext;
	// default configurations
	const defaultConfigs = {
		includeTicks: true,
		includeLabels: true,
		includeLeftTip: false,
		includeRightTip: false,
		excludeOriginTick: true,

		unitSpace: 50,

		subgrids: [1, 1],
		gridStrokeWidth: 1.3,
		subgridStrokeWidth: 0.8,
		gridStrokeColor: Colors.aqua + "44",
		subgridStrokeColor: "#88888850",
		originPosition: ORIGIN,
	};

	// configurations
	configs = applyDefault(defaultConfigs, configs);
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
