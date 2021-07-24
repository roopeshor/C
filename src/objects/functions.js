import { C } from "../main.js";
import {
	applyDefault,
	approximateIndexInArray,
	doFillAndStroke,
} from "../utils/utils.js";
import {
	getBezierControlPoints,
	line,
	smoothCurveThroughPoints,
} from "./geometry.js";
import { loop, noLoop } from "./settings.js";

/**
 * Draws a parametric functions
 *
 * @param {function} f function to plot. Must recieve one argument and return a array of point as [x, y]
 * @param {array} [range=[0, 10, 0.1]] range as [min, max, dt]
 * @param {number} [scalar=50] amount to scale the shape.
 * @param {boolean} [smoothen=true] whether to smoothen the shape.
 * @param {number} [tension=1] smoothness tension.
 * @param {array} [discontinuities=[]] array of t where the curve discontinues.
 * @param {boolean} [closed=false] whether the function draws a closed shape.
 * @returns {array} array of computed points as [x, y]
 */
function parametricFunction(config) {
	const defaultConfigs = {
		tension: [1, "number"],

		unitValue: [[1, 1], "array"],
		unitLength: [[50, 50], "array"],
		range: [[0, 10, 0.1], "array"],
		discontinuities: [[], "array"],

		smoothen: [true, "boolean"],
		closed: [false, "boolean"],
		draw: [true, "boolean"],
	};
	config = applyDefault(defaultConfigs, config);
	var {
		paramFunction: f,
		range,
		smoothen,
		tension,
		discontinuities,
		closed,
	} = config;
	if (Array.isArray(range) && range.length == 2)
		range.push((range[1] - range[0]) / 20);
	var points = [[]];
	const min = range[0];
	const max = range[1];
	const step = range[2];
	if (!Array.isArray(discontinuities)) discontinuities = [];

	// generate points
	var epsilon = 1e-6;
	if (step < epsilon) epsilon = step / 2;
	var row = 0;
	const unitX = config.unitLength[0] / config.unitValue[0],
		unitY = config.unitLength[1] / config.unitValue[1];
	for (var t = min; t <= max + epsilon; t += step) {
		if (approximateIndexInArray(t, discontinuities, epsilon) > -1) {
			if (approximateIndexInArray(t + step, discontinuities, epsilon) > -1) {
				row++;
				points.push([]);
			}
			continue;
		}
		let ft = f(t);
		points[row].push([ft[0] * unitX, ft[1] * unitY]);
	}

	// draw the plot
	if (config.draw) plot();
	function plot() {
		const ctx = C.workingCanvas;
		for (let i = 0; i < points.length; i++) {
			var p = points[i];
			if (smoothen) {
				smoothCurveThroughPoints(p, tension, closed);
			} else {
				ctx.beginPath();
				ctx.moveTo(p[0][0], p[0][1]);
				for (let j = 1; j < p.length; j++) {
					ctx.lineTo(p[j][0], p[j][1]);
				}
				ctx.closePath();
				doFillAndStroke(ctx);
			}
		}
	}
	return {
		points: points,
		draw: plot,
		animate: function (time = 2000) {
			const ctx = C.workingCanvas;
			var noPoints = points.flat().length;
			var dt = time / noPoints;
			for (let i = 0; i < points.length; i++) {
				var p = points[i];
				var j = 0;
				if (smoothen) {
					loop(
						() => {
							if (j >= p.length - 2) {
								noLoop();
								ctx.closePath();
								if (ctx.doFill) this.draw();
							}
							var recentPoint =
								j > 0 ? p[j - 1] : closed ? p[p.length - 2] : p[0];
							var currentPoint = p[j];
							var nextPoint = p[j + 1];
							var secondNextPoint =
								j != p.length - 2 ? p[j + 2] : closed ? p[1] : nextPoint;
							j++;
							var cp = getBezierControlPoints(
								recentPoint,
								currentPoint,
								nextPoint,
								secondNextPoint
							);
							ctx.beginPath();
							ctx.moveTo(currentPoint[0], currentPoint[1]);
							ctx.bezierCurveTo(
								cp[0],
								cp[1],
								cp[2],
								cp[3],
								nextPoint[0],
								nextPoint[1]
							);
							ctx.stroke();
						},
						ctx.name,
						dt
					);
				} else {
					loop(
						() => {
							if (j >= p.length - 2) {
								noLoop();
								if (ctx.doFill) this.draw();
							}
							var p1 = p[j], p2 = p[++j];
							line(p1[0], p1[1], p2[0], p2[1]);
						},
						ctx.name,
						dt
					);
				}
			}
		},
	};
}

/**
 * Draws graph of funciton
 *
 * @param {function} f function to plot. Must recieve one argument and return a number.
 * @param {array} [range=[0, 10, 0.1]] range as [min, max, dt]
 * @param {number} [scalar=50] amount to scale the shape.
 * @param {boolean} [smoothen=true] whether to smoothen the shape.
 * @param {number} [tension=1] smoothness tension.
 * @param {array} [discontinuities=[]] array of inputs where the curve discontinues.
 * @param {boolean} [closed=false] whether the function draws a closed graph.
 * @return {array} array of computed points as [x, y]
 */
function functionGraph(config) {
	const f = config.paramFunction;
	config.paramFunction = (x) => [x, f(x)];
	return parametricFunction(config);
}
export { parametricFunction, functionGraph };
