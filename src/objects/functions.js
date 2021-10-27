import { readColor } from "../color/color_reader.js";
import { C } from "../main.js";
import { loop, noLoop } from "../settings.js";
import { applyDefault, approximateIndexInArray, doFillAndStroke } from "../utils.js";
import { getBezierControlPoints, line, smoothCurveThroughPoints } from "./geometry.js";

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
 * @param {Object} args configuration object
 * It can have following properties:
 *
 * @param {Function} args.paramFunction function to plot. Must recieve one argument and return a array of point as [x, y]
 * @param {number} [args.tension = 1] Smoothness tension.
 * @param {Array<number>} [args.range = RANGE] Range as [min, max, dt]
 * @param {Array<number>} [args.discontinuities] Array of t where the curve discontinues.
 * @param {Array<number>} [args.unitValue = UNIT_VEC] Value of each unit space
 * @param {Array<number>} [args.unitSpace = UNIT_VEC] Length of each unit in pixels
 * @param {boolean} [args.smoothen = true] Whether to smoothen the shape.
 * @param {boolean} [args.closed = false] Whether the function draws a closed shape.
 * @param {boolean} [args.draw = true] Wheteher to draw the function graph right now.
 *
 * @returns {Object} object that contains following properties:
 *
 * * points  <array>    : Array of computed points in the function
 * * draw    <function> : Function that draws the plot
 * * animate <function> : Function that animates the drawing of the shape. Accept argument `duration` which is the duration of animation.
 */
function parametricFunction(args) {
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
	args = applyDefault(defaultConfigs, args);
	let { paramFunction, range, smoothen, tension, discontinuities, closed } = args;
	if (Array.isArray(range) && range.length == 2) range.push((range[1] - range[0]) / 20);
	let points = [[]],
		min = range[0],
		max = range[1],
		step = range[2];
	if (!Array.isArray(discontinuities)) discontinuities = [];

	// generate points
	let epsilon = 1e-6,
		row = 0,
		noPoints = 0,
		unitX = args.unitSpace[0] / args.unitValue[0],
		unitY = args.unitSpace[1] / args.unitValue[1];
	if (step < epsilon) epsilon = step / 2;
	for (let t = min; t <= max + epsilon; t += step) {
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
	if (args.draw) plot();
	function plot() {
		let ctx = C.workingCanvas;
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
	let ctx = C.workingCanvas;
	return {
		points: points[0],
		dur: args.dur,
		name: "parametric-plot-" + counter.parametricFunction++,
		closed: args.closed,
		tension: args.tension || 1,
		smoothen: args.smoothen,
		rateFunction: args.rateFunction,
		syncWithTime: args.syncWithTime || false,

		draw: function (duration = 2000) {
			let dt = duration / noPoints;
			for (let i = 0; i < points.length; i++) {
				var p = points[i];
				let j = 0;
				if (smoothen) {
					loop(
						"parametric-plot-" + counter.parametricFunction++,
						smoothed(j),
						C.workingCanvas.name,
						dt
					);
				} else {
					loop(
						"parametric-plot-" + counter.parametricFunction++,
						nonSmoothed(j),
						C.workingCanvas.name,
						dt
					);
				}
			}
			function smoothed(j) {
				return function () {
					if (j >= p.length - 2) {
						noLoop();
						ctx.closePath();
						if (ctx.doFill) this.draw();
					}
					let recentPoint = j > 0 ? p[j - 1] : closed ? p[p.length - 2] : p[0],
						currentPoint = p[j],
						nextPoint = p[j + 1],
						secondNextPoint = j != p.length - 2 ? p[j + 2] : closed ? p[1] : nextPoint,
						cp = getBezierControlPoints(recentPoint, currentPoint, nextPoint, secondNextPoint);
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
 */
function functionGraph(args) {
	let paramFunction = args.paramFunction;
	args.paramFunction = (x) => [x, paramFunction(x)];
	return parametricFunction(args);
}

/**
 * Draws a heat plot of given function. The function must take atleast 2 arguments and return a number.
 * More precisely f: ℜ² → ℜ
 * All parameters should be enclosed in a object.
 * @param {Object} args
 * Possible parameters are:
 *
 * @param {Array<number>} [args.min] minimum point. Default: [-4, -4]
 * @param {Array<number>} [args.max] maximum point. Default: [4, 4]
 * @param {Object} args.colors object of color map
 * @param {Array<number>} [args.unitValue = UNIT_VEC] Value of each unit space
 * @param {Array<number>} [args.unitSpace = UNIT_VEC] Length of each unit in pixels
 * @param {number} [args.resolution = 1] resolution of plot
 * @param {Function} [args.interpolator = linear] function to interpolate color.
 * @return {Object} metadatas
 */
function heatPlot(args) {
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
	args = applyDefault(defaultConfigs, args, false);
	let { min, max, colors, resolution, plotFunction, interpolator } = args,
		ctx = C.workingCanvas,
		unitSizeX = args.unitSpace[0] / args.unitValue[0],
		unitSizeY = args.unitSpace[1] / args.unitValue[1],
		UVX = args.unitValue[0] / args.unitSpace[0],
		UVY = args.unitValue[1] / args.unitSpace[1],
		stopes = Object.keys(colors).sort();

	// converting colors to rgba array

	for (let stop of stopes) {
		colors[stop] = readColor(colors[stop]).rgbaA;
	}
	let minS = Math.min(...stopes),
		maxS = Math.max(...stopes);
	ctx.save();
	for (let x = min[0]; x <= max[0]; x += resolution * UVX) {
		for (let y = min[1]; y <= max[1]; y += resolution * UVY) {
			ctx.fillStyle = lerpColorArray(plotFunction(x, y));
			ctx.fillRect(x * unitSizeX, y * unitSizeY, resolution, resolution);
		}
	}
	function lerpColorArray(v) {
		if (v >= maxS) return "rgba(" + colors[maxS].join() + ")";
		if (v <= minS) return "rgba(" + colors[minS].join() + ")";
		for (let i = 0; i < stopes.length - 1; i++) {
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
