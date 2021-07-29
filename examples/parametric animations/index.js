import { readColor } from "../../src/color/color_reader.js";
import { TAU } from "../../src/constants/math.js";
import { C } from "../../src/main.js";
import { cos, sin } from "../../src/math/basic.js";
import { circleIntersection, lineIntersection } from "../../src/math/points.js";
import { line, point } from "../../src/objects/geometry.js";
import {
	fill,
	initBlackboardCanvas,
	loop,
	noLoop,
	scale,
} from "../../src/settings.js";

const W = 300;
const H = 300;

/**
 * Animates a line from point p1 to point p2.
 *
 * @param {array} pa The first point.
 * @param {array} pb The second point.
 * @param {number} [dt=10] The duration of one frame in milliseconds.
 * @param {function} [next=() => {}] The function to call after the animation.
 */
function animatedLine(id, pa, pb, dt = 10, next = () => {}) {
	var t = 0;
	var r = 4;
	var angle = Math.atan2(pb[1] - pa[1], pb[0] - pa[0]);
	pointDraw(id, pa, r, 5, 0.09, "green", 500, () => {
		const dp = 0.01;
		pa[0] += r * Math.cos(angle);
		pa[1] += r * Math.sin(angle);
		loop(
			() => {
				if (t > 1) {
					noLoop();
					pointDraw(id, pb, r, 5, 0.09, "blue", 500, next);
				}
				const x1 = pa[0] * (1 - t) + pb[0] * t;
				const y1 = pa[1] * (1 - t) + pb[1] * t;
				const x2 = pa[0] * (1 - (t + dp)) + pb[0] * (t + dp);
				const y2 = pa[1] * (1 - (t + dp)) + pb[1] * (t + dp);
				t += dp;
				line(x1, y1, x2, y2);
			},
			id,
			dt
		);
	});
}

/**
 * animate filling of a given shape
 *
 * @param {string} id ID of canvas
 * @param {string} FILL color of canvas
 * @param {function} f funciton that draws the shape
 * @param {number} [time=1000] time to run
 * @param {number} [dt=10] time for each frame
 * @param {function} [next=() => {}] function to run after filling
 */
function animateFill(id, FILL, f, time = 1000, dt = 10, next = () => {}) {
	var n = time / dt;
	var _fill = readColor(FILL, true);
	_fill[3] /= n / 10;
	C.canvasList[id].fillStyle = readColor(..._fill);
	var k = 0;
	loop(
		() => {
			if (k++ >= n) {
				noLoop();
				next();
			}
			f();
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
 * @param {function} [next=() => {}] next function to run
 */
function pointDraw(
	id,
	p,
	r,
	dt = 10,
	ds = 0.09,
	FILL,
	fillTime,
	next = () => {}
) {
	var t = 0;
	loop(
		() => {
			if (t > TAU) {
				noLoop();
				if (FILL)
					animateFill(
						id,
						FILL || "#fff",
						() => point(...p, r * 2),
						fillTime,
						10,
						next
					);
			}
			t += ds;
			const x1 = cos(t) * r + p[0];
			const y1 = sin(t) * r + p[1];
			const x2 = cos(t + ds) * r + p[0];
			const y2 = sin(t + ds) * r + p[1];
			line(x1, y1, x2, y2);
		},
		id,
		dt
	);
}

C(
	() => {
		initBlackboardCanvas();
		scale(2, 2);
		const c1 = [-40 / 2, 40 / 2],
			c2 = [40 / 2, -40 / 2];
		pointDraw("cci", c1, 40, 0, 0.02);
		pointDraw("cci", c2, 40, 0, 0.02);
		const pts = circleIntersection(c1, 40, c2, 40);
		pointDraw("cci", pts[0], 2, 0, 0.09, "green", 500, () => {
			pointDraw("cci", pts[1], 2, 0, 0.09, "green");
		});
	},
	".container",
	{
		name: "cci",
		width: W,
		height: H,
	}
);
C(
	() => {
		initBlackboardCanvas();
		const p1 = [-5 * 16, 5 * 16],
			p2 = [5 * 16, -7 * 16],
			p3 = [-8 * 16, -5 * 16],
			p4 = [8 * 16, 7 * 16];
		animatedLine("lli", p1, p2, 10, () => {
			animatedLine("lli", p4, p3, 10, () => {
				fill("orange");
				pointDraw(
					"lli",
					lineIntersection(p1, p2, p3, p4),
					5,
					0,
					0.09,
					"orange"
				);
			});
		});
	},
	".container",
	{
		name: "lli",
		width: W,
		height: H,
	}
);
