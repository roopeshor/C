import { C } from "../../src/main.js";
import { generatePointsInArc } from "../../src/misc/point_generator.js";
import { TAU } from "../../src/constants/math.js";
import { bezier, point } from "../../src/objects/geometry.js";
import { fill, initContrastedCanvas, noFill } from "../../src/settings.js";
import {
	blue,
	green,
	orange,
	purple,
	red,
	white,
	yellow,
} from "../../src/constants/named_colors.js";
import { extendFromOrigin } from "../../src/math/points.js";

C(
	() => {
		initContrastedCanvas();
		let pointArr = [],
			colors = [purple, blue, green, yellow, orange, red, white],
			dAngle = TAU / 50; // points per circle
		for (let i = 0; i < 7; i++) {
			pointArr.push(
				generatePointsInArc(
					0,
					0,
					i * 20 + 40,
					i * (dAngle / 2),
					TAU + (i - 1) * (dAngle / 2),
					dAngle
				)
			);

			// draw beziers
			if (i > 0) {
				noFill();
				let arr = pointArr[i],
					prev = pointArr[i - 1];
				for (let j = 0; j < arr.length; j++) {
					let c1 = prev[j];
					let c2 = prev[(j + 4) % prev.length];
					let h = extendFromOrigin(arr[(j + 1) % arr.length], 30);
					bezier(...c1, ...h, ...c2);
				}
			}
		}
		//draw points
		for (let i in pointArr) {
			fill(colors[i]);
			for (let pt of pointArr[i]) point(...pt, 7);
		}
	},
	".container",
	{
		width: 400,
		height: 400,
	}
);
