import { GREEN_C } from "../../src/constants/colors.js";
import { E, PI, TAU } from "../../src/constants/math.js";
import { C } from "../../src/main.js";
import { axes } from "../../src/objects/coordinate-systems.js";
import { parametricFunction } from "../../src/objects/functions.js";
import {
	initBlackboardCanvas,
	noFill,
	stroke,
	strokeWidth
} from "../../src/objects/settings.js";
import { abs, cos, lcm, sgn, sin } from "../../src/utils/math.js";

const W = 300;
const H = 300;
const CFG = {
	width: W,
	height: H,
};
Object.freeze(CFG);
function setup(min = -4, max = 4, dx = 1) {
	initBlackboardCanvas();
	strokeWidth(2);
	return axes({
		xAxis: {
			lineWidth: 1,
			range: [min, max, dx],
			includeNumbers: true,
			textSize: 11,
			includeLeftTip: false,
			includeRightTip: false,
		},
		yAxis: {
			lineWidth: 1,
			range: [min, max, dx],
			includeNumbers: true,
			textSize: 11,
			includeLeftTip: false,
			includeRightTip: false,
		},
	});
}
C(
	() => {
		function ft(t) {
			return [3 * sin(10 * t), 3 * sin(9 * t)];
		}
		const cfgs = setup();
		stroke(GREEN_C);
		noFill();
		var dt = TAU / 500;
		parametricFunction({
			paramFunction: ft,
			range: [0, TAU, dt],
			closed: true,
			unitLength: cfgs.unitLength,
			unitValue: cfgs.unitValue,
			draw: false
		}).animate(10000);
	},
	".lissajous",
	CFG
);
C(
	() => {
		const R = 5,
			r = 3,
			d = 5;
		function ft(t) {
			return [
				(R - r) * cos(t) + d * cos(((R - r) * t) / r),
				(R - r) * sin(t) - d * sin(((R - r) * t) / r),
			];
		}
		const cfgs = setup(-8, 8, 1);
		stroke(GREEN_C);
		noFill();
		var limit = (TAU * lcm(r, R)) / R;
		var dt = limit / 100;
		parametricFunction({
			paramFunction: ft,
			range: [0, limit, dt],
			closed: true,
			unitLength: cfgs.unitLength,
			unitValue: cfgs.unitValue,
			draw: false
		}).animate();
	},
	".hypotrochoid",
	CFG
);
C(
	() => {
		const n = 3;
		function ft(t) {
			return [
				abs(cos(t)) ** (2 / n) * 4 * sgn(cos(t)),
				abs(sin(t)) ** (2 / n) * 3 * sgn(sin(t)),
			];
		}
		const cfgs = setup(-5, 5, 1);
		stroke(GREEN_C);
		noFill();
		var dt = PI / 5;
		parametricFunction({
			paramFunction: ft,
			range: [0, TAU, dt],
			closed: true,
			unitLength: cfgs.unitLength,
			unitValue: cfgs.unitValue,
			draw: false,
			smoothen: true
		}).animate();
	},
	".superellipse",
	CFG
);
C(
	() => {
		function ft(t) {
			return [
				sin(t) * (E ** cos(t) - 2 * cos(4 * t) - sin(t / 12) ** 5),
				cos(t) * (E ** cos(t) - 2 * cos(4 * t) - sin(t / 12) ** 5),
			];
		}
		const cfgs = setup(-4, 4, 1);
		stroke(GREEN_C);
		noFill();
		var dt = 0.1;
		parametricFunction({
			paramFunction: ft,
			range: [-TAU, TAU, dt],
			closed: false,
			unitLength: cfgs.unitLength,
			unitValue: cfgs.unitValue,
			draw: false
		}).animate(10000);
	},
	".Butterfly-curve",
	CFG
);
