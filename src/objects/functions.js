import { readColor } from "../color/color_reader.js";
import { C } from "../main.js";
import { loop, noLoop } from "../settings.js";
import {
	applyDefault,
	approximateIndexInArray,
	doFillAndStroke,
} from "../utils.js";
import {
	getBezierControlPoints,
	line,
	smoothCurveThroughPoints,
} from "./geometry.js";

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
	var { paramFunction, range, smoothen, tension, discontinuities, closed } =
		config;
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
	var noPoints = 0;
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
		noPoints++;
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
							var p1 = p[j],
								p2 = p[++j];
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

/**
 * Draws a heat plot of given function. The function must take atleast 2 arguments and return a number.
 * More precisely f: ℜ² → ℜ
 * All parameters should be enclosed in a object.
 * @param {object} config
 * Possible parameters are:
 *
 * * min          <array>   ([-4, -4]): minimum point
 * * max          <array>   ([4, 4])  : maximum point
 * * colors       <object>            : object of color map
 * * unitValue    <array>   ([1, 1])  : Value of each unit space
 * * unitLength   <array>   ([1, 1])  : Length of each unit in pixels
 * * resolution   <number>  (1)       : resolution of plot
 * * interpolator <function> (linear) : function to interpolate color.
 * @return {object} metadatas
 */
function heatPlot(config) {
	const defaultConfigs = {
		min: [-4, -4],
		max: [4, 4],
		colors: {
			"-5": "#b36e38b0",
			"-3": "#ff9c52b0",
			"-1": "#ffcea9b0",
			0: "#dcdcddb0",
			1: "#9fcaedb0",
			3: "#3d96dab0",
			5: "#2b6b99b0",
		},
		unitLength: [1, 1],
		unitValue: [1, 1],
		resolution: 1,
		interpolator: (x) => x,
	};
	config = applyDefault(defaultConfigs, config, false);
	const { min, max, colors, resolution, plotFunction, interpolator } = config;
	const ctx = C.workingCanvas,
		unitSizeX = config.unitLength[0] / config.unitValue[0],
		unitSizeY = config.unitLength[1] / config.unitValue[1],
		UVX = config.unitValue[0] / config.unitLength[0],
		UVY = config.unitValue[1] / config.unitLength[1],
		stopes = Object.keys(colors).sort();

	// converting colors to rgba array

	for (var stop of stopes) colors[stop] = readColor(colors[stop], true);

	const minS = Math.min(...stopes);
	const maxS = Math.max(...stopes);
	ctx.save();
	for (var x = min[0]; x <= max[0]; x += resolution * UVX) {
		for (var y = min[1]; y <= max[1]; y += resolution * UVY) {
			let c = lerpColorArray(plotFunction(x, y));
			ctx.fillStyle = c;
			ctx.fillRect(x * unitSizeX, y * unitSizeY, resolution, resolution);
		}
	}
	function lerpColorArray(v) {
		if (v >= maxS) return "rgba(" + colors[maxS].join() + ")";
		if (v <= minS) return "rgba(" + colors[minS].join() + ")";
		for (var i = 0; i < stopes.length - 1; i++) {
			let a = stopes[i],
				b = stopes[i + 1],
				c1 = colors[a],
				c2 = colors[b],
				k = interpolator((v - a) / (b - a));
			if (v >= a && v < b) {
				return (
					"rgba(" +
					[
						(c2[0] - c1[0]) * k + c1[0],
						(c2[1] - c1[1]) * k + c1[1],
						(c2[2] - c1[2]) * k + c1[2],
						(c2[3] - c1[3]) * k + c1[3],
					].join() +
					")"
				);
			}
		}
	}
	ctx.restore();
	return {
		min: minS,
		max: maxS,
		colors: colors,
	};
}
export { parametricFunction, functionGraph, heatPlot };
