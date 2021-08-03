import { animatedLine, pointDraw } from "../../src/animations/create.js";
import { C } from "../../src/main.js";
import { circleIntersection, lineIntersection } from "../../src/math/points.js";
import { fill, initBlackboardCanvas, scale, strokeWidth, wait } from "../../src/settings.js";

const W = 300;
const H = 300;

C(
	() => {
		initBlackboardCanvas();
		scale(2, 2);
		const c1 = [-40 / 2, 40 / 2],
			c2 = [40 / 2, -40 / 2];
		pointDraw("bigc1", "cci", c1, 40, 0, 0.02);
		wait(500);
		pointDraw("bigc2", "cci", c2, 40, 0, 0.02);
		const pts = circleIntersection(c1, 40, c2, 40);
		wait(300);
		strokeWidth(0.5);
		pointDraw("point1", "cci", pts[0], 2, 10, 0.09, "green", 500);
		pointDraw("point2", "cci", pts[1], 2, 10, 0.09, "green", 500);
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
		animatedLine("line1", "lli", p1, p2, 10);
		wait(500);
		animatedLine("line2", "lli", p4, p3, 10);
		wait(500);
		fill("orange");
		pointDraw(
			"intersection",
			"lli",
			lineIntersection(p1, p2, p3, p4),
			5,
			0,
			0.09,
			"orange"
		);
	},
	".container",
	{
		name: "lli",
		width: W,
		height: H,
	}
);
