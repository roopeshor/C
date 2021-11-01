import { Manim } from "../../Extensions/Colors/importable.js";
import { PI, TAU } from "../../src/constants/math.js";
import { C } from "../../src/main.js";
import { cos, min, sin } from "../../src/math/basic.js";
import { line } from "../../src/objects/geometry.js";
import { background, loop, noFill, noLoop, stroke, translate } from "../../src/settings.js";

const WIDTH = min(C.getWindowWidth(), 400);
const HEIGHT = WIDTH;
const { BLUE } = Manim;
C(
	() => {
		background(0);
		translate(CENTERX, CENTERY);
		stroke(yellow);
		noFill();
		let points = [], // list of points
			count = 40, // number of points
			// offset = 3, // index distance to next point
			dAngle = TAU / count, // angle between two points
			radius = WIDTH / 2 - 15; // radius of circle

		// generate points
		for (let i = 0; i < count; i++) {
			points.push([cos(dAngle * i) * radius, sin(dAngle * i) * radius]);

			// draw points
			// point(...points[i], 2);
		}
		// draw lines
		function drawLines(offset) {
			for (let i = 0; i < count; i++) {
				let next = (i + offset) % count;
				line(...points[i], ...points[next]);
			}
		}

		let offset = 0;
		stroke(BLUE + "80");
		loop(
			() => {
				drawLines(offset++);
				if (offset >= count / 2) noLoop();
			},
			"inward",
			100
		);
	},
	".inward",
	{
		name: "inward",
		width: WIDTH,
		height: HEIGHT,
	}
);
C(
	() => {
		background(0);
		translate(CENTERX, CENTERY);
		noFill();
		let count = 80, // number of points
			dA = TAU / count, // angle between two points
			r = WIDTH / 4 - 10, // radius of each circles,
			points = generatePointsInArc(-r, 0, r, 0, PI * 2, dA, true).concat(
				generatePointsInArc(r, 0, r, PI, (PI * 6) / 2, dA)
			),
			dist = 24;

		// draw points
		// for (let i = 0; i < points.length; i++) point(...points[i], 2);

		// draw lines
		stroke("green");
		for (let i = 0; i < points.length; i++) {
			let next = (i + dist) % points.length;
			line(...points[i], ...points[next]);
		}
	},
	".infinite",
	{
		name: "infinite",
		width: WIDTH,
		height: HEIGHT,
	}
);

function generatePointsInArc(
	x,
	y,
	radius,
	startAngle = 0,
	endAngle = PI / 2,
	dA = 0.01,
	clockwise = false
) {
	let points = [];
	dA = Math.abs(dA || (endAngle - startAngle) / 10);
	if (startAngle > endAngle) {
		for (let t = startAngle; t % TAU >= endAngle + 1e-7; t += dA) {
			points.push([Math.cos(t) * radius + x, Math.sin(t) * radius + y]);
		}
	} else {
		for (let t = startAngle; t <= endAngle + 1e-7; t += dA) {
			points.push([Math.cos(t) * radius + x, Math.sin(t) * radius + y]);
		}
	}
	return clockwise ? points.reverse() : points;
}
