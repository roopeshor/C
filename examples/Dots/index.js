import { C } from "../../src/main.js";
import { generatePointsInArc } from "../../src/misc/point_generator.js";
import { TAU } from "../../src/constants/math.js";
import { point } from "../../src/objects/geometry.js";
import { fill, initContrastedCanvas } from "../../src/settings.js";
import { blue, green, orange, red, yellow } from "../../src/constants/named_colors.js";
const size = 400;

C(
	() => {
		initContrastedCanvas();
		let pointArr = [], colors = [green, blue, yellow, orange, red],
			ppc = 40; // points per circle
		for (let i = 0; i < 5;) {
			pointArr.push(generatePointsInArc(0, 0, i * 15 + 30, 0, TAU, TAU / ppc));
			fill(colors[i]);
			for (let pt of pointArr[i++]) point(...pt, 3);
		}
	},
	".container",
	{
		width: 400,
		height: 400,
	}
);
