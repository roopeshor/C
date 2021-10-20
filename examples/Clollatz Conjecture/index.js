import { lerpColorArray } from "../../src/color/interpolation.js";
import { ColorPalettes } from "../../src/constants/color_palettes.js";
import { pixel } from "../../src/image/image.js";
import { C } from "../../src/main.js";
import { background, cartasianPlain } from "../../src/settings.js";

// complex operators
/**
 * multiplies two complex numbers
 * @param {number[]} a first complex number
 * @param {number[]} b second complex number
 * @returns {number[]}
 */
const cmul = (a, b) => {
	return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
};

/**
 * multiplies a real number and a complex number
 */
const rmul = (a, b) => {
	return [a * b[0], a * b[1]];
};

/**
 * adds two complex numbers
 */
const cadd = (a, b) => {
	return [a[0] + b[0], a[1] + b[1]];
};

/**
 * divides two complex numbers
 */
const cdiv = (a, b) => {
	const d = b[0] * b[0] + b[1] * b[1];
	return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};

/**
 * divides a complex number by a real number
 */
const cdivr = (a, b) => {
	return [a[0] / b, a[1] / b];
};

/**
 * returns the sin of a complex number
 */
const csin = (a) => {
	return [Math.sin(a[0]) * Math.cosh(a[1]), Math.cos(a[0]) * Math.sinh(a[1])];
};
/**
 * returns the cos of a complex number
 */
const ccos = (a) => {
	return [Math.cos(a[0]) * Math.cosh(a[1]), -Math.sin(a[0]) * Math.sinh(a[1])];
};

/**
 * returns the square of a complex number
 */
const csqr = (a) => {
	return [a[0] * a[0] - a[1] * a[1], 2 * a[0] * a[1]];
};

/**
 * returns the square of cos of a complex number
 */
const ccos2 = (a) => {
	let cr = Math.cos(a[0]) * Math.cosh(a[1]),
		ci = -Math.sin(a[0]) * Math.sinh(a[1]);
	return [cr * cr - ci * ci, 2 * cr * ci];
};

/**
 * returns the square of sin of a complex number
 */
const csin2 = (a) => {
	let cr = Math.sin(a[0]) * Math.cosh(a[1]),
		ci = Math.cos(a[0]) * Math.sinh(a[1]);
	return [cr * cr - ci * ci, 2 * cr * ci];
};

/**
 * adds a real number and a complex number
 */
const radd = (a, b) => {
	return [a + b[0], b[1]];
};

/**
 * substract two complex numbers
 */
const csub = (a, b) => {
	return [a[0] - b[0], a[1] - b[1]];
};

C(
	() => {
		background(0);
		cartasianPlain({
			xAxis: {
				range: [0, 4],
			},
			yAxis: {
				range: [-2, 2],
				textDirection: [-.6, -1],
				excludeOriginTick: false
			},
			center: [-2, 0]
		});

		let h_W = 400 / 2;
		let h_H = 400 / 2;
		let iters = 20;
		console.time("cl");
		let PI = Math.PI,
			cos = Math.cos,
			sin = Math.sin,
			cosh = Math.cosh,
			sinh = Math.sinh;
		for (let x = -h_W; x <= h_W; x += 0.5) {
			for (let y = -h_H; y <= h_H; y += 0.5) {
				let a = x / 200 + 2,
					b = y / 200,
					i = 0;
				for (; i < iters && Math.sqrt(a * a + b * b) <= 20; i++) {
					let P1 = a * PI,
						P2 = b * PI,
						c1 = 0.25 + a / 2,
						ccsh = cos(P1) * cosh(P2),
						ssnh = -sin(P1) * sinh(P2);
					a = 0.25 + a - (c1 * ccsh - (b / 2) * ssnh);
					b = b - (c1 * ssnh + (b / 2) * ccsh);
				}
				ColorPalettes
				pixel(x, y, `hsl(${(1- i / iters) * 360}, 50%, 50%, 50%)`, 0.5);
			}
		}
		console.timeEnd("cl");
	},
	".container",
	{
		width: 400,
		height: 400,
	}
);
