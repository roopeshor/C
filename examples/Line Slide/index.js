import { Line } from "../../src/animations/create.js";
import { BLUE, GREEN, ORANGE, RED } from "../../src/constants/colors.js";
import { C } from "../../src/main.js";
import {
	initBlackboardCanvas,
	showCreation,
	stroke,
	strokeWidth
} from "../../src/settings.js";

const W = 400;
const H = 400;
C.debug(true);
function createAxis(canvasID, xAxis, yAxis) {
	showCreation(
		Line({
			name: "yAxis",
			p1: yAxis[0],
			p2: yAxis[1],
			dTime: 10,
		})
	);
	showCreation(
		Line({
			name: "xAxis",
			p1: xAxis[0],
			p2: xAxis[1],
			dTime: 10,
		})
	);
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
		let baseLinePoints = [
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
		stroke(GREEN);
		showCreation(
			Line({
				name: "base",
				p1: baseLinePoints[0],
				p2: baseLinePoints[1],
				dTime: 14,
				time: 1000,
			})
		);
		stroke(RED);
		showCreation(
			Line({
				name: "slant",
				p1: slantLinePoints[0],
				p2: slantLinePoints[1],
				dTime: 14,
			})
		);

		// parallel lines
		const dy = 10; // change in y
		strokeWidth(1);
		stroke(BLUE);
		for (let y = dy; y <= 6 * dy; y += dy) {
			let p1 = [0, y],
				p2 = [y / slope + baseLinePoints[1][0], y];
			showCreation(
				Line({
					name: "slide" + y / dy,
					p1: p1,
					p2: p2,
					dTime: 10,
					time: 500,
					syncWithTime: false,
				})
			);
		}
	},
	".container",
	{
		name: "main",
		width: W,
		height: H,
	}
);
