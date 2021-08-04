import { animatedLine, circleDraw } from "../../src/animations/create.js";
import { C } from "../../src/main.js";
import { circleIntersection, lineIntersection } from "../../src/math/points.js";
import { linear } from "../../src/math/rate_functions.js";
import {
	debugAnimations,
	fill,
	initBlackboardCanvas,
	scale,
	setImageSmoothing,
	strokeWidth,
	wait,
} from "../../src/settings.js";

const W = 300;
const H = 300;

C(
	() => {
		initBlackboardCanvas();
		scale(2, 2);
		const c1 = [-40 / 2, 40 / 2],
			c2 = [40 / 2, -40 / 2];


		debugAnimations(true);
		circleDraw({
			name: "bigc1",
			canvas: "cci",
			center: c1,
			radius: 40,
			time: 1000,
			dTime: 100,
			rateFunction: linear,
		}).draw();
		wait(500);
		circleDraw({
			name: "bigc2",
			canvas: "cci",
			center: c2,
			radius: 40,
			time: 1000,
			dTime: 10,
		}).draw();
		const pts = circleIntersection(c1, 40, c2, 40);
		wait(300);
		strokeWidth(0.5);
		circleDraw({
			name: "point1",
			canvas: "cci",
			center: pts[0],
			radius: 2,
			time: 500,
			timeDelay: 10,
			fill: "green",
			fillTime: 500,
		}).draw();
		circleDraw({
			name: "point2",
			canvas: "cci",
			center: pts[1],
			radius: 2,
			time: 500,
			timeDelay: 10,
			fill: "green",
			fillTime: 500,
		}).draw();
	},
	".container",
	{
		name: "cci",
		width: W,
		height: H,
	}
);
// C(
// 	() => {
// 		initBlackboardCanvas();
// 		const p1 = [-5 * 16, 5 * 16],
// 			p2 = [5 * 16, -7 * 16],
// 			p3 = [-8 * 16, -5 * 16],
// 			p4 = [8 * 16, 7 * 16];
// 		animatedLine("line1", "lli", p1, p2, 10);
// 		wait(500);
// 		animatedLine("line2", "lli", p4, p3, 10);
// 		wait(500);
// 		fill("orange");
// 		circleDraw(
// 			"intersection",
// 			"lli",
// 			lineIntersection(p1, p2, p3, p4),
// 			5,
// 			0,
// 			0.09,
// 			"orange"
// 		);
// 	},
// 	".container",
// 	{
// 		name: "lli",
// 		width: W,
// 		height: H,
// 	}
// );
