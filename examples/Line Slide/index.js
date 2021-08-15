import { Line } from "../../src/animations/create.js";
import { BLUE, GREEN, ORANGE, RED } from "../../src/constants/colors.js";
import { C } from "../../src/main.js";
import {
	initBlackboardCanvas,
	scale,
	stroke,
	strokeWidth,
} from "../../src/settings.js";

const W = 700;
const H = 700;

function createAxis(canvasID, xAxis, yAxis, dt = 0, next = null) {
	Line(canvasID, ...yAxis, dt, 0.015, next, false);
	Line(canvasID, ...xAxis, dt, 0.015, next, false);
}

C(
	() => {
		initBlackboardCanvas();
		stroke(ORANGE);
		createAxis(
			"main",
			[
				[-W / 2, 0],
				[W / 2, 0],
			],
			[
				[0, H / 2],
				[0, -H / 2],
			]
		);
		scale(2.5);
		const baseLinePoints = [
				[0, 0],
				[-80, 0],
			],
			slantLinePoints = [
				[-80, 0],
				[-100, 80],
			],
			slope =
				(slantLinePoints[1][1] - slantLinePoints[0][1]) /
				(slantLinePoints[1][0] - slantLinePoints[0][0]);
		strokeWidth(1.5);
		stroke(GREEN);
		Line("main", ...baseLinePoints, 14, 0.02, null, false);
		stroke(RED);
		Line("main", ...slantLinePoints, 14, 0.02, null, false);

		// parallel lines
		const dy = 10; // change in y
		strokeWidth(1);
		stroke(BLUE);
		for (let y = dy; y <= 6 * dy; y += dy) {
			let p1 = [0, y],
				p2 = [y / slope + baseLinePoints[1][0], y];
			Line("main", p1, p2, 10, 0.02, null, false);
		}
	},
	".container",
	{
		name: "main",
		width: W,
		height: H,
	}
);
