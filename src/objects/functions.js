/**@module Plottter-Functions */
import { readColor } from "../color/color_reader.js";
import { C } from "../main.js";
import { loop, noLoop } from "../settings.js";
import { applyDefault, inArray, doFillAndStroke } from "../utils.js";
import { getBezierControlPoints, line, smoothCurveThroughPoints } from "./geometry.js";
/**
 * @typedef {Object} CartesianPoint
 * @property {number} x
 * @property {number} y
 * @property {number} radius radius of point
 * @property {string} fill fill style
 * @property {string} stroke stroke styles
 */

/**
 * @typedef {Object} PolarPoint
 * @property {number} r distance from origin
 * @property {number} phi radial distance from +x axis in CCW direction
 * @property {number} radius radius of point
 * @property {string} fill fill style
 * @property {string} stroke stroke styles
 */

/**
 * @typedef {Object} ParametricPlotter
 * @property {number[][]} points : Array of computed points in the function
 * @property {Function} draw : Function that draws the plot
 * @property {Function} animate : Function that animates the drawing of the shape. Accept argument `duration` which is the duration of animation.
 */

const animationEventChain = {
	then: function (f) {
		f();
		return animationEventChain;
	},
};

let counter = {
	parametricFunction: 1,
};
const RANGE = [0, 10, 0.1];
const UNIT_VEC = [1, 1];
/**
 * Draws a parametric functions
 * This accept parameters as object.
 * @param {Object} configs configurations
 * @param {Function} configs.plotter function to plot. Must recieve one argument and return a array of point as [x, y]
 * @param {number} [configs.tension = 1] Smoothness tension.
 * @param {number[]} [configs.range = RANGE] Range as [min, max, dt]
 * @param {number[]} [configs.discontinuities] Array of t where the curve discontinues.
 * @param {number[]} [configs.unitValue = [1, 1]] Value of each unit space
 * @param {number[]} [configs.unitSpace = [1, 1]] Length of each unit in pixels
 * @param {boolean} [configs.smoothen = true] Whether to smoothen the shape.
 * @param {boolean} [configs.closed = false] Whether the function draws a closed shape.
 * @param {boolean} [configs.draw = true] Wheteher to draw the function graph right now.
 * @param {number} [configs.strokeWidth = 2]
 * @param {number} [configs.discontinuityRadius = range[2]]
 *
 * @returns {ParametricPlotter}
 */
export function parametricFunction(configs) {
	let defaultConfigs = {
		tension: 1,

		unitValue: UNIT_VEC,
		unitSpace: UNIT_VEC, // length of each unit in pixels
		range: RANGE,
		discontinuities: [],

		smoothen: true,
		closed: false,
		draw: true,

		// for animation
		dur: 4000,
	};
	configs = applyDefault(defaultConfigs, configs);
	let { plotter, range, smoothen, tension, discontinuities, closed } = configs;
	if (Array.isArray(range) && range.length == 2) range.push((range[1] - range[0]) / 20);
	let points = [[]],
		min = range[0],
		max = range[1],
		step = range[2];
	if (!Array.isArray(discontinuities)) discontinuities = [];

	// generate points
	let row = 0,
		pointCount = 0,
		unitX = configs.unitSpace[0] / configs.unitValue[0],
		unitY = configs.unitSpace[1] / configs.unitValue[1],
		discontinuityRadius = isNaN(configs.discontinuityRadius)
			? step
			: configs.discontinuityRadius;
	if (step < discontinuityRadius) discontinuityRadius = step / 2;
	for (let t = min; t <= max + discontinuityRadius; t += step) {
		if (inArray(t, discontinuities, discontinuityRadius)) {
			if (inArray(t + step, discontinuities, discontinuityRadius)) {
				row++;
				points.push([]);
			}
			continue;
		}
		let ft = plotter(t);
		points[row].push([ft[0] * unitX, ft[1] * unitY]);
		pointCount++;
	}
	// draw the plot
	if (configs.draw) plot();
	function plot() {
		let ctx = C.workingContext;
		for (let i = 0; i < points.length; i++) {
			let p = points[i];
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
	let ctx = C.workingContext;
	return {
		points: points[0],
		dur: configs.dur,
		name: "parametric-plot-" + counter.parametricFunction++,
		closed: configs.closed,
		tension: configs.tension || 1,
		smoothen: configs.smoothen,
		rateFunction: configs.rateFunction,
		syncWithTime: configs.syncWithTime || false,

		draw: function (duration = 2000) {
			let dt = duration / pointCount,
				drawer = smoothen ? smoothed : nonSmoothed;
			for (let i = 0; i < points.length; i++) {
				var p = points[i],
					j = 0;
				loop(
					"parametric-plot-" + counter.parametricFunction++,
					drawer(j),
					C.workingContext.name,
					dt,
				);
			}
			function smoothed(j) {
				return function () {
					if (j >= p.length - 2) {
						noLoop();
						ctx.closePath();
						if (ctx.doFill) plot();
					}
					let recentPoint = j > 0 ? p[j - 1] : closed ? p[p.length - 2] : p[0],
						currentPoint = p[j],
						nextPoint = p[j + 1],
						secondNextPoint = j != p.length - 2 ? p[j + 2] : closed ? p[1] : nextPoint,
						cp = getBezierControlPoints(
							recentPoint,
							currentPoint,
							nextPoint,
							secondNextPoint,
						);
					j++;
					ctx.beginPath();
					ctx.moveTo(currentPoint[0], currentPoint[1]);
					ctx.bezierCurveTo(cp[0], cp[1], cp[2], cp[3], nextPoint[0], nextPoint[1]);
					ctx.stroke();
				};
			}
			function nonSmoothed(j) {
				return function () {
					if (j >= p.length - 2) {
						noLoop();
						if (ctx.doFill) this.draw();
					}
					let p1 = p[j],
						p2 = p[++j];
					line(p1[0], p1[1], p2[0], p2[1]);
				};
			}
			return animationEventChain;
		},
	};
}

/**
 * Draws graph of funciton
 * See {@link parametricFunction} For arguments
 *
 * @param {Object} configs
 * @return {ParametricPlotter}
 */
export function functionGraph(configs) {
	let plotter = configs.plotter;
	configs.plotter = (x) => [x, plotter(x)];
	return parametricFunction(configs);
}

/**
 * Draws a heat plot of given function. The function must take atleast 2 arguments and return a number.
 * More precisely f: ℜ² → ℜ
 * All parameters should be enclosed in a object.
 * @param {Object} configs
 * Possible parameters are:
 *
 * @param {Function} configs.plotFunction function to be plotted.
 * @param {number[]} [configs.min] minimum point. Default: [-4, -4]
 * @param {number[]} [configs.max] maximum point. Default: [4, 4]
 * @param {Object} configs.colors object of color map
 * @param {number[]} [configs.unitValue = UNIT_VEC] Value of each unit space
 * @param {number[]} [configs.unitSpace = UNIT_VEC] Length of each unit in pixels
 * @param {number} [configs.resolution = 1] resolution of plot
 * @param {Function} [configs.interpolator = linear] function to interpolate color.
 */
export function heatPlot(configs) {
	let defaultConfigs = {
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
		unitSpace: UNIT_VEC,
		unitValue: UNIT_VEC,
		resolution: 1,
		interpolator: (x) => x,
	};
	configs = applyDefault(defaultConfigs, configs, false);
	let { min, max, colors, resolution, plotFunction, interpolator } = configs,
		ctx = C.workingContext,
		unitSizeX = configs.unitSpace[0] / configs.unitValue[0],
		unitSizeY = configs.unitSpace[1] / configs.unitValue[1],
		UVX = 1 / unitSizeX,
		UVY = 1 / unitSizeY,
		stopes = Object.keys(colors).sort();

	// convert colors to rgba array
	for (let stop of stopes) {
		colors[stop] = readColor(colors[stop]).rgbaA;
	}

	let stopMin = Math.min(...stopes),
		stopMax = Math.max(...stopes);

	ctx.save();
	for (let x = min[0]; x <= max[0]; x += resolution * UVX) {
		for (let y = min[1]; y <= max[1]; y += resolution * UVY) {
			let v = plotFunction(x, y);
			ctx.fillStyle = lerpColorArray(v, stopMax, colors, stopMin, stopes, interpolator);
			ctx.fillRect(x * unitSizeX, y * unitSizeY, resolution, resolution);
		}
	}
	ctx.restore();
	function lerpColorArray(v) {
		if (v >= stopMax) return "rgba(" + colors[stopMax].join() + ")";
		if (v <= stopMin) return "rgba(" + colors[stopMin].join() + ")";
		for (let i = 0; i < stopes.length - 1; i++) {
			let a = stopes[i],
				b = stopes[i + 1];
			if (v >= a && v < b) {
				let c1 = colors[a],
					c2 = colors[b],
					k = interpolator((v - a) / (b - a));
				return (
					"rgba(" +
					[
						Math.round((c2[0] - c1[0]) * k + c1[0]),
						Math.round((c2[1] - c1[1]) * k + c1[1]),
						Math.round((c2[2] - c1[2]) * k + c1[2]),
						(c2[3] - c1[3]) * k + c1[3],
					].join() +
					")"
				);
			}
		}
	}
}

/**
 * Plots a list of points
 * @param {Object} configs arguments
 * @param {CartesianPoint[]} configs.points list of points
 * @param {number[]} [configs.unitValue=[1,2]] unit Value
 * @param {number[]} [configs.unitSpace=[1,2]] unit Space
 *
 */
export function plotPoints(configs) {
	configs = applyDefault(
		{
			unitValue: UNIT_VEC,
			unitSpace: UNIT_VEC,
			fill: "white",
			stroke: "#0000",
			radius: 5,
		},
		configs,
	);
	let { points, unitValue, unitSpace } = configs,
		ctx = C.workingContext,
		unitSizeX = unitSpace[0] / unitValue[0],
		unitSizeY = unitSpace[1] / unitValue[1];
	for (let i = 0; i < points.length; i++) {
		let p = points[i],
			fill = p.fill || configs.fill || ctx.fillStyle,
			stroke = p.stroke || configs.stroke || ctx.strokeStyle,
			x = p.x * unitSizeX,
			y = p.y * unitSizeY;
		ctx.beginPath();
		ctx.fillStyle = fill;
		ctx.strokeStyle = stroke;
		ctx.arc(x, y, p.radius || configs.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}
	ctx.closePath();
}

/**
 * Plots a bunch of points in polar plane
 * @param {Object} configs configurations
 * @param {PolarPoint[]} configs.points list of points
 * @param {number} configs.radialSpacing size of each unit radius in pixels
 */
export function plotPolarPoints(configs) {
	configs = applyDefault(
		{
			radialSpacing: 2,
			fill: "white",
			stroke: "#0000",
			radius: 5,
			points: [],
		},
		configs,
	);
	let ctx = C.workingContext;
	let { points, radialSpacing } = configs,
		defaultFill = configs.fill || ctx.fillStyle,
		defaultStroke = configs.stroke || ctx.strokeStyle;
	ctx.save();
	for (let i = 0; i < points.length; i++) {
		let p = points[i],
			fill = p.fill || defaultFill,
			stroke = p.stroke || defaultStroke,
			x = p.r * Math.cos(p.phi) * radialSpacing,
			y = p.r * Math.sin(p.phi) * radialSpacing;
		ctx.beginPath();
		ctx.fillStyle = fill;
		ctx.strokeStyle = stroke;
		ctx.arc(x, y, p.radius || configs.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}
	ctx.closePath();
	ctx.restore();
}

/**
 * Plots a parametric function in polar plane
 * @param {Object} configs
 * @param {Function} configs.plotter function that takes one arguments t and returns a coordinate as [radius, angle]
 * @param {number} [configs.tension = 1]
 * @param {number} [configs.radialSpacing = 1]
 * @param {number[]} [configs.range = [0, Math.PI * 2, Math.PI / 50]]
 * @param {Array} [configs.discontinuities = []]
 * @param {boolean} [configs.smoothen = true]
 * @param {boolean} [configs.closed = false]
 * @param {number} [configs.strokeWidth = 2]
 * @param {number} [configs.discontinuityRadius = range[2]]

 * @returns {Object}
 */
export function polarParametricFunction(configs) {
	configs = applyDefault(
		{
			tension: 1,
			radialSpacing: 1,
			range: [0, Math.PI * 2, Math.PI / 50],
			discontinuities: [],
			smoothen: true,
			closed: false,
			strokeWidth: 2,
		},
		configs,
	);
	let { plotter, range, radialSpacing, smoothen, tension, discontinuities, closed } =
		configs;
	if (Array.isArray(range) && range.length == 2) range.push((range[1] - range[0]) / 20);
	let points = [[]],
		min = range[0],
		max = range[1],
		step = range[2];
	if (!Array.isArray(discontinuities)) discontinuities = [];
	let discontinuityRadius = isNaN(configs.discontinuityRadius)
		? step
		: configs.discontinuityRadius;

	// generate points
	let row = 0,
		_fix = discontinuityRadius < step ? discontinuityRadius : 0;
	// we add one more point to make the graph more accurate when applying smoothening technique.
	for (let t = min; t <= max + step + _fix; t += step) {
		if (inArray(t, discontinuities, discontinuityRadius)) {
			if (inArray(t + step, discontinuities, discontinuityRadius)) {
				row++;
				points.push([]);
			}
			continue;
		}
		let ft = plotter(t);
		points[row].push([
			ft[0] * Math.cos(ft[1]) * radialSpacing,
			ft[0] * Math.sin(ft[1]) * radialSpacing,
		]);
	}

	let ctx = C.workingContext;
	let finalPoints = [];
	ctx.lineWidth = configs.strokeWidth;
	for (let i = 0; i < points.length; i++) {
		let p = points[i];
		if (p.length == 0) {
			continue;
		} else {
			finalPoints.push(p);
		}
		// add offset to remove last point
		let offset = i == points.length - 1 ? 1 : 0;
		if (smoothen) {
			smoothCurveThroughPoints(p, tension, closed, offset);
		} else {
			ctx.beginPath();
			ctx.moveTo(p[0][0], p[0][1]);
			for (let j = 1; j < p.length - offset; j++) {
				ctx.lineTo(p[j][0], p[j][1]);
			}
			if (ctx.doStroke) ctx.stroke();
			if (ctx.doFill && closed) ctx.fill();
			ctx.closePath();
		}

		// remove last excess point
		if (offset) {
			points[i] = points[i].slice(0, -1);
		}
	}
	return {
		points: finalPoints,
		closed: configs.closed,
		tension: configs.tension || 1,
		smoothen: configs.smoothen,
	};
}

/**
 * Wrapper for {@link polarParametricFunction}
 * @param {Object} configs
 * @returns {Object}
 */
export function polarFuntionGraph(configs) {
	let plotter = configs.plotter;
	configs.plotter = (t) => [plotter(t), t];
	return polarParametricFunction(configs);
}
