import { readColor } from "../color/color_reader.js";
import { C } from "../main.js";
import { dist } from "../math/points.js";
import { smooth } from "../math/rate_functions.js";
import {
	line,
	point,
	smoothCurveThroughPoints
} from "../objects/geometry.js";
import { getStrokeWidth, loop, noLoop } from "../settings.js";

const counters = {
	pointDraw: 0,
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
		pointDraw(name + "-start", id, [...pa], r, 5, 0.09, "green", 500);
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
		pointDraw(
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
 *
 * @param {array} p center
 * @param {number} r radius
 * @param {number} dt delay time in milliseconds
 * @param {function} [next=null] next function to run
 */
function pointDraw(args) {
	let defaults = {
		name: "point-" + ++counters.pointDraw,
		radius: 3,
		time: 1000,
		dTime: 10,
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
		rateFunction
	} = Object.assign(defaults, args);
	let dt = dTime / time * Math.PI * 2;
	canvas = canvas || C.workingCanvas.name;
	let points = [];
	for (let t = 0; t <= Math.PI * 2; t += dt) {
		const x1 = Math.cos(t) * radius + center[0];
		const y1 = Math.sin(t) * radius + center[1];
		points.push([x1, y1]);
	}
	dt = dTime / time;
	return function () {
		let t = 0;
		loop(
			name,
			() => {
				if (t > 1) noLoop();
				let im1 = Math.floor((points.length - 1) * rateFunction(t));
				let i = Math.floor((points.length - 1) * rateFunction(t+dt));
				let ip1 = Math.floor((points.length - 1) * rateFunction(t+dt*2));
				let ip2 = Math.floor((points.length - 1) * rateFunction(t+dt*3));
				let pts= [points[im1],points[i], points[ip1], points[ip2]];
				smoothCurveThroughPoints(pts, 1, false);
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
				() => point(...center, radius * 2 - getStrokeWidth()),
				fillTime,
				10,
				next
			);
	};
}

export { animatedLine, animateFill, pointDraw };
