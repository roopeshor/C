import { lerpColorArray } from "../../src/color/interpolation.js";
import { Cividis } from "../../src/constants/color_palettes.js";
import { PHI } from "../../src/constants/math.js";
import { sqrt } from "../../src/math/basic.js";
import { loop, noLoop } from "../../src/settings.js";

/* eslint-disable no-undef */
let coeffs = [
		[1 - PHI, 0],
		[PHI - 2, PHI - 1],
		[0.285, 0],
		[0.285, 0.01],
		[0.45, 0.1428],
		[-0.70176, -0.3842],
		[-0.835, -0.2321],
		[-0.8, 0.156],
		[-0.7269, 0.1889],
		[0, -0.8],
		[],
		[],
	],
	coeff = coeffs[6];
const W = 1920 * 2,
	H = 1080 * 2,
	maxIterations = 100,
	cx = coeff[0],
	cy = coeff[1],
	R = sqrt(cx ** 2 + cy ** 2) + 1,
	R2 = R ** 2,
	unit = H / 2;
C(
	() => {
		initBlackboardCanvas();
		let ctx = C.workingCanvas,
			pat = Cividis,
			dpr = 1 / ctx.dpr,
			x = -W / 2;
		loop(() => {
			if (x > W / 2) {
				noLoop();
			}
			for (var y = -H / 2; y < H / 2; y += dpr) {
				let zx = (x / unit),
					zy = (y / unit),
					iteration = 0;
				while (iteration++ < maxIterations && zx ** 2 + zy ** 2 < R2) {
					let _zx = zx ** 2 - zy ** 2 + cx;
					zy = 2 * zx * zy + cy;
					zx = _zx;
				}
				iteration = iteration / maxIterations;
				let c = lerpColorArray(pat, iteration);
				ctx.fillStyle = c;
				ctx.fillRect(x, y, dpr, dpr);
			}
			x += dpr;
		}, "main", 0);
	},
	".container",
	{
		name: "main",
		width: W,
		height: H,
	}
);
