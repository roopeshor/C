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
 * This accept parameters as object.
 * @param {object} config configuration object
 * It can have following properties:
 *
 * * paramFunction   <function>               : function to plot. Must recieve one argument and return a array of point as [x, y]
 * * range           <array>    ([0, 10, 0.1]): Range as [min, max, dt]
 * * smoothen        <boolean>  (true)        : Whether to smoothen the shape.
 * * tension         <number>   (1)           : Smoothness tension.
 * * discontinuities <array>    ([])          : Array of t where the curve discontinues.
 * * closed          <boolean>  (false)       : Whether the function draws a closed shape.
 * * unitValue       <array>    ([1, 1])      : Value of each unit space
 * * unitLength      <array>    ([1, 1])      : Length of each unit in pixels
 * * draw            <boolean>  (true)        : Wheteher to draw the function graph right now.
 *
 * @returns {object} object that contains following properties:
 *
 * * points  <array>    : Array of computed points in the function
 * * draw    <function> : Function that draws the plot
 * * animate <function> : Function that animates the drawing of the shape. Accept argument `duration` which is the duration of animation.
 */
function parametricFunction(config) {
	const defaultConfigs = {
		tension: 1,

		unitValue: [1, 1],
		unitLength: [1, 1], // length of each unit in pixels
		range: [0, 10, 0.1],
		discontinuities: [],

		smoothen: true,
		closed: false,
		draw: true,
	};
	config = applyDefault(defaultConfigs, config);
	var {
		paramFunction,
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
		let ft = paramFunction(t);
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
		animate: function (duration = 2000) {
			const ctx = C.workingCanvas;
			var noPoints = points.flat().length;
			var dt = duration / noPoints;
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
 * See {@link parametricFunction} For arguments
 */
function functionGraph(config) {
	const paramFunction = config.paramFunction;
	config.paramFunction = (x) => [x, paramFunction(x)];
	return parametricFunction(config);
}
export { parametricFunction, functionGraph };
