import { readColor } from "../color/color_reader.js";
import { C } from "../main.js";
import { dist } from "../math/points.js";
import { smooth } from "../math/rate_functions.js";
import { getBezierControlPoints, line, point } from "../objects/geometry.js";
import { getStrokeWidth, loop, noLoop } from "../settings.js";

const counters = {
	circleDraw: 0,
	animatedLine: 0,
	animateFill: 0,
};

/**
 * Animates a line from point pa to point pb.
 *
 * @param {array} pa The first point.
 * @param {array} pb The second point.
 * @param {number} [dt=10] The duration of one frame in milliseconds.
 * @param {function} [next=() => {}] The function to call after the animation.
 */
function animatedLine(
	name,
	id,
	pa,
	pb,
	dt = 10,
	dp = 0.01,
	next = null,
	drawEndPoints = true
) {
	let t = 0;
	let r = 4;
	let angle = Math.atan2(pb[1] - pa[1], pb[0] - pa[0]);
	if (drawEndPoints) {
		circleDraw(name + "-start", id, [...pa], r, 5, 0.09, "green", 500);
		pa[0] += r * Math.cos(angle);
		pa[1] += r * Math.sin(angle);
		pb[0] -= r * Math.cos(angle);
		pb[1] -= r * Math.sin(angle);
	}
	const pa_pb_dist = dist(pa, pb);
	loop(
		name,
		function () {
			if (t > 1) noLoop();
			let x1 = pa[0] * (1 - t) + pb[0] * t,
				y1 = pa[1] * (1 - t) + pb[1] * t,
				x2 = pa[0] * (1 - (t + dp)) + pb[0] * (t + dp),
				y2 = pa[1] * (1 - (t + dp)) + pb[1] * (t + dp);
			if (dist(pa, [x2, y2]) > pa_pb_dist) {
				x2 = pb[0];
				y2 = pb[1];
			}
			t += dp;
			line(x1, y1, x2, y2);
		},
		id,
		dt
	);
	if (drawEndPoints) {
		circleDraw(
			name + "-end",
			id,
			[pb[0] + r * Math.cos(angle), pb[1] + r * Math.sin(angle)],
			r,
			5,
			0.09,
			"blue",
			200,
			next
		);
	}
}

/**
 * animate filling of a given shape
 * ! Has some flaws !
 * @param {string} id ID of canvas
 * @param {string} FILL color of canvas
 * @param {function} f funciton that draws the shape
 * @param {number} [time=1000] time to run
 * @param {number} [dt=10] time for each frame
 * @param {function} [next=null] function to run after filling
 */
function animateFill(name, id, FILL, f, time = 1000, dt = 10, next = null) {
	let _fill = readColor(FILL, true);
	const ctx = C.canvasList[id];
	let previousT = -time / dt;
	loop(
		name + " fill",
		(t) => {
			if (t >= time) {
				noLoop();
				if (typeof next == "function") next();
			}
			ctx.fillStyle = readColor(
				_fill[0],
				_fill[1],
				_fill[2],
				_fill[3] / (t - previousT)
			);
			f();
			previousT = t;
		},
		id,
		dt
	);
}

/**
 * Animates drawing of a point.
 * @param {object} args object containing configs
 *
 * @param {string} [args.name = "point-" + ++counters.circleDraw]
 * @param {number} [args.radius = 3]
 * @param {number} [args.time = 1000]
 * @param {number} [args.dTime = 1]
 * @param {boolean|string} [args.fill = false]
 * @param {number} [args.fillTime = 500]
 * @param {funciton} [args.next = null]
 * @param {funciton} [args.rateFunction = smooth]
 * @param {array} args.center center of the circle
 * @param {string} args.canvas name of canvas in which the animation is rendered
 */
function circleDraw(args) {
	let defaults = {
		name: "point-" + counters.circleDraw++,
		radius: 3,
		time: 1000,
		dTime: 1,
		fill: false,
		fillTime: 500,
		next: null,
		rateFunction: smooth,
	};
	let {
		name,
		time,
		center,
		radius,
		canvas,
		dTime,
		fill: fillColor,
		fillTime,
		next,
		rateFunction,
	} = Object.assign(defaults, args);
	canvas = canvas || C.workingCanvas.name;
	let ctx = C.canvasList[canvas];
	let points = [];
	let dt = 1 / (ctx.dpr * radius);
	for (let t = 0; t <= Math.PI * 2 + 1e-6; t += dt) {
		const x1 = Math.cos(t) * radius + center[0];
		const y1 = Math.sin(t) * radius + center[1];
		points.push([x1, y1]);
	}
	dt = dTime / time;
	return {
		// function that animates drawing of circle
		draw: function () {
			let t = 0;
			let len = points.length - 1;
			loop(
				name,
				() => {
					if (t > 1) {
						ctx.closePath();
						t = 0; // for next loop
						noLoop();
					}
					if (t == 0) {
						ctx.beginPath();
						ctx.moveTo(
							...points[len - Math.abs(Math.round(len * rateFunction(0)))]
						);
					}
					let recentPoint =
						points[Math.round(len * rateFunction(t - dt)) % len] ||
						points[len - Math.abs(Math.round(len * rateFunction(t - dt)))];
					let currentPoint = points[Math.round(len * rateFunction(t)) % len];
					let nextPoint = points[Math.round(len * rateFunction(t + dt)) % len];
					let secondNextPoint =
						points[Math.round(len * rateFunction(t + dt * 2)) % len];
					let cp = getBezierControlPoints(
						recentPoint,
						currentPoint,
						nextPoint,
						secondNextPoint,
						1
					);
					ctx.bezierCurveTo(
						cp[0],
						cp[1],
						cp[2],
						cp[3],
						nextPoint[0],
						nextPoint[1]
					);
					if (ctx.doStroke) ctx.stroke();
					t += dt;
				},
				canvas,
				dTime
			);
			if (fillColor)
				animateFill(
					name,
					canvas,
					fillColor,
					() => point(center[0], center[1], radius * 2 - getStrokeWidth() * 2),
					fillTime,
					10,
					next
				);
		},
		points: points // list of computed points
	};
}

export { animatedLine, animateFill, circleDraw };
