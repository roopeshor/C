import { readColor } from "../color/color_reader.js";
import { C } from "../main.js";
import { dist } from "../math/points.js";
import { line, point } from "../objects/geometry.js";
import { getStrokeWidth, loop, noLoop } from "../settings.js";

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
function pointDraw(
	name,
	id,
	p,
	r,
	dt = 10,
	ds = 0.09,
	FILL,
	fillTime,
	next = null
) {
	let t = 0;
	loop(
		name,
		() => {
			if (t > Math.PI * 2) noLoop();
			t += ds;
			const x1 = Math.cos(t) * r + p[0];
			const y1 = Math.sin(t) * r + p[1];
			const x2 = Math.cos(t + ds) * r + p[0];
			const y2 = Math.sin(t + ds) * r + p[1];
			const angle = Math.atan2(y2 - y1, x2 - x1);
			const xFix = Math.cos(angle) * 0.1;
			const yFix = Math.sin(angle) * 0.1;
			line(x1 - xFix, y1 - yFix, x2, y2);
		},
		id,
		dt
	);
	if (FILL)
		animateFill(
			name,
			id,
			FILL || "#fff",
			() => point(...p, r * 2 - getStrokeWidth()),
			fillTime,
			10,
			next
		);
}

export { animatedLine, animateFill, pointDraw };
