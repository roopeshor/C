import { readColor } from "../../src/color/color_reader.js";
import { C } from "../../src/main.js";
import { smooth } from "../../src/math/rate_functions.js";
import { ellipse, point } from "../../src/objects/geometry.js";
import { loop, noLoop } from "../../src/settings.js";
import { applyDefault } from "../../src/utils.js";

const counters = {
	Circle: 1,
	Line: 1,
	animateFill: 1,
	Arc: 1,
};

/**
 * Animates a line from point p1 to point p2.
 * @param {Object} args
 * @param {Array<number>} args.p1 The first point.
 * @param {Array<number>} args.p2 The second point.
 * @param {number} [args.dt=10] The duration of one frame in milliseconds.
 * @param {Function} [args.next] The function to call after the animation.
 */
export function Line(args) {
	let defaults = {
		name: "line-" + counters.Line++,
		dur: 1000,
		dTime: 10,
		next: null,
		rateFunction: smooth,
	};
	let { p1, p2, name, dur, canvas, dTime, rateFunction, next, syncWithTime } = applyDefault(
		defaults,
		args,
	);
	canvas = canvas || C.workingContext.name;
	let ctx = C.contextList[canvas];

	let angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
	let points = [];
	let xDiff = p2[0] - p1[0];
	let yDiff = p2[1] - p1[1];
	let dt = Math.abs(Math.cos(angle) / xDiff);
	if (Math.abs(Math.PI / 2 - Math.abs(angle)) < 1e-6) {
		dt = 1 / Math.abs(yDiff);
	}
	for (let t = 0; t <= 1 + 1e-6; t += dt) {
		points.push([p1[0] * (1 - t) + p2[0] * t, p1[1] * (1 - t) + p2[1] * t]);
	}
	return {
		points: points, // list of computed points
		dur: dur,
		dTime: dTime,
		canvas: ctx,
		rateFunction: rateFunction,
		name: name,
		closed: false,
		smoothen: false,
		fill: false,
		next: next,
		syncWithTime: syncWithTime,
	};
}

export function Arc(args) {
	const defaults = {
		center: [0, 0],
		name: "arc-" + counters.Arc++,
		radiusX: 100,
		radiusY: 100,
		dur: 1000,
		dTime: 16,
		fill: false,
		fillTime: 500,
		next: null,
		rateFunction: smooth,
		closed: false,
		startAngle: 0,
		angle: Math.PI / 2,
		clockwise: false,
	};
	let {
		name,
		dur,
		center,
		canvas,
		dTime,
		fill: fillColor,
		fillTime,
		next,
		closed,
		rateFunction,
		startAngle,
		angle,
		radiusX,
		radiusY,
		clockwise,
	} = Object.assign(defaults, args);
	canvas = canvas || C.workingContext.name;
	let ctx = C.contextList[canvas];
	let points = [];

	if (args.radius) {
		radiusX = args.radius;
		radiusY = args.radius;
	}
	let dt = 2 / (C.dpr * (radiusX + radiusY));
	let start = startAngle;
	let end = angle + startAngle + 1e-6;

	function pushPoint(t) {
		const x1 = Math.cos(t) * radiusX + center[0];
		const y1 = Math.sin(t) * radiusY + center[1];
		points.push([x1, y1]);
	}
	if (clockwise) for (let t = end; t >= start; t -= dt) pushPoint(t);
	else for (let t = start; t <= end; t += dt) pushPoint(t);
	let rx = radiusX;
	let ry = radiusY;
	if (ctx.doStroke) {
		rx -= ctx.lineWidth / 2;
		ry -= ctx.lineWidth / 2;
	}
	console.log(points);
	return {
		points: points, // list of computed points
		dur: dur,
		dTime: dTime,
		canvas: ctx,
		rateFunction: rateFunction,
		name: name,
		closed: closed,
		smoothen: true,
		tension: 1,
		fill: fillColor,
		fillTime: fillTime,
		next: next,
		rx: rx,
		ry: ry,
		filler: function () {
			ellipse(center[0], center[1], rx, ry, 0, startAngle, angle);
		},
	};
}

/**
 * animate filling of a given shape
 * ! Has some flaws !
 * @param {string} name name of animation. Optional
 * @param {string} canvasName ID of canvas
 * @param {string|Array<number>} FILL color of canvas
 * @param {Function} f funciton that draws the shape
 * @param {number} [dur=1000] dur to run
 * @param {number} [dt=10] dur for each frame
 * @param {Function} [next=null] function to run after filling
 */
export function animateFill(name, canvasName, FILL, f, dur = 1000, dt = 10, next = null) {
	let _fill = readColor(FILL).rgbaA;
	const ctx = C.contextList[canvasName];
	let previousT = -dur / dt;
	loop(
		"filling " + name,
		(t) => {
			if (t >= dur) {
				noLoop(canvasName, t);
				if (typeof next == "function") next();
			}
			ctx.fillStyle = readColor(_fill[0], _fill[1], _fill[2], _fill[3] / (t - previousT)).hex8;
			f();
			previousT = t;
		},
		canvasName,
		dt,
		1000,
		{},
		dur,
	);
}

/**
 * Animates drawing of a point.
 * @param {Object} args object containing configs
 *
 * @param {string} [args.name] Name of the animation. Default: "point-" + counters.Circle
 * @param {number} [args.radius = 3] radius of circle
 * @param {number} [args.dur = 1000] duration of animation
 * @param {number} [args.dTime = 1] duration of each frame
 * @param {boolean|string} [args.fill = false] if false, no fill. Else a color to fill with.
 * @param {number} [args.fillTime = 500] time to fill inside circle.
 * @param {funciton} [args.next = null] function to run after animation ends.
 * @param {funciton} [args.rateFunction = smooth] function to use for rate.
 * @param {Array<number>} args.center center of the circle
 * @param {string} args.canvas name of canvas in which the animation is rendered
 */
export function Circle(args) {
	let defaults = {
		name: "point-" + counters.Circle++,
		radius: 100,
		dur: 1000,
		dTime: 16,
		fill: false,
		fillTime: 500,
		next: null,
		rateFunction: smooth,
		startAngle: 0,
		angle: Math.PI * 2,
	};
	args = Object.assign(defaults, args);
	let center = args.center,
		{ points, dur, dTime, canvas, rateFunction, fill: fillColor, fillTime, next, rx } = Arc(args);
	return {
		points: points, // list of computed points
		dur: dur,
		dTime: dTime,
		canvas: canvas,
		rateFunction: rateFunction,
		name: args.name,
		closed: true,
		smoothen: true,
		tension: 1,
		fill: fillColor,
		fillTime: fillTime,
		next: next,
		filler: function () {
			point(center[0], center[1], rx * 2, false);
		},
	};
}
