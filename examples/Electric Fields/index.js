import { Manim } from "../../Extensions/Colors/importable.js";
import { ColorPalettes, smooth } from "../../src/c.js";
import { C } from "../../src/main.js";
import { arrow } from "../../src/objects/arrows.js";
import {
	lerpColorArray,
	getInterpolatedColorList,
} from "../../src/color/interpolation.js";
import { point } from "../../src/objects/geometry.js";
import { fillText } from "../../src/objects/text.js";
import {
	background,
	clear,
	fill,
	noStroke,
	stroke,
	strokeWidth,
	textAlign,
	textBaseline,
} from "../../src/settings.js";
window.i = 0;
const W = 432,
	H = 432,
	{ TEAL, GREEN, RED, PURPLE, BLUE, YELLOW, DARK_BROWN } = Manim;
let k = -0.5;
let range = [-4, 4, 0.1];
let charges = [
	{
		x: 0,
		y: 1,
		vx: 0,
		vy: 0,
		q: +1,
		mass: 5,
	},
	{
		x: 0,
		y: -1,
		vx: 0,
		vy: 0,
		q: +1,
		mass: 5,
	},
	{
		x: -1,
		y: 0,
		vx: 0,
		vy: 0,
		q: -1,
		mass: 5,
	},
	{
		x: 1,
		y: 0,
		vx: 0,
		vy: 0,
		q: -1,
		mass: 5,
	},
];

let dt = 0.01;
let sx = (W / abs(range[1] - range[0])) * Math.round(window.devicePixelRatio),
	sy = (H / abs(range[1] - range[0])) * Math.round(window.devicePixelRatio);
let P = getInterpolatedColorList(ColorPalettes.Heat, 0, 3, 0.2);
console.log(P);
C(
	() => {
		centreCanvas();
		let a = axes({
			xAxis: {
				range: range,
				includeNumbers: false,
				includeTicks: false,
			},
			yAxis: {
				range: range,
				includeNumbers: false,
				includeTicks: false,
			},
		});
		sx = a.unitSpace[0] / range[2];
		sy = a.unitSpace[1] / range[2];
		background(0);
		a.getHeatPlot({
			colors: P,
			resolution: 3,
			plotFunction: (x, y) => {
				let v = [0, 0];
				for (let ch of charges) {
					if (ch.x == x && ch.y == y) continue;
					let r1n = (ch.x - x) ** 2 + (ch.y - y) ** 2;
					let fv = [ch.q / r1n ** 0.5, ch.q / r1n ** 0.5];
					v[0] += fv[0];
					v[1] += fv[1];
				}
				return (v[0] ** 2 + v[1] ** 2) ** 0.25;
			},
		});
	},
	".cvs",
	{
		width: W,
		height: H,
		name: "t2",
	},
);
C(
	() => {
		centreCanvas();
		scale(sx, -sy);
		textAlign("center");
		textBaseline("middle");
		draw();
		tinyDrag(C.workingContext, charges, {
			onSelect: (i) => console.log(i),
			onDrag: draw,
		});
		/* loop(
			() => {
				background(0);
				draw()
				for (let i = 0; i < charges.length; i++) {
					let fx = 0, fy = 0, a = charges[i];
					for (let j = 0; j < charges.length; j++) {
						if (i == j) continue;
						let b = charges[j];
						let rij2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;

						fx += b.q / rij2
								* (b.x - a.x) / rij2 ** 0.5;
						fy += b.q / rij2
								* (b.y - a.y) / rij2 ** 0.5;
					}
					fx *= k * a.q;
					fy *= k * a.q;

					let ax = fx / a.mass,
							ay = fy / a.mass;

					a.vx += ax * dt;
					a.vy += ay * dt;

					a.x += a.vx * dt;
					a.y += a.vy * dt;
				}
			},
			"t",
			dt
		) */
	},
	".cvs",
	{
		width: W,
		height: H,
		name: "t",
	},
);

function draw() {
	clear(0);
	let VF = computeVectorField(charges, range);
	drawVectors(VF.vec, VF.max);
	drawCharges(charges);
}
function drawCharges(charges) {
	for (let ch of charges) {
		if (ch.q < 0) fill(BLUE);
		else fill(RED);
		point(ch.x, ch.y, abs(ch.q));
		fill("#000");
		fontSize(abs(ch.q) ** 0.8);
		fillText((ch.q > 0 ? "+" : "") + ch.q, ch.x, ch.y);
	}
}

function drawVectors(vf, max) {
	console.log(max);
	for (let v of vf) {
		let i = v.mag ** 0.5;
		if (i < 0.1) continue;
		let col = lerpColorArray(ColorPalettes.Heat, i, 0, 3);
		col = readColor(col).rgbaA;
		col[3] = sigmoid(v.mag - 0.1);
		col = readColor(col).hex8;
		stroke(col);
		fill(col);
		strokeWidth((1.3 * sigmoid(v.mag + 1)) / sx);
		noStroke();
		arrow(
			v.start[0],
			v.start[1],
			v.start[0] + v.end[0] * sigmoid((v.mag / max) * 2 - 0.5),
			v.start[1] + v.end[1] * sigmoid((v.mag / max) * 2 - 0.5),
			(6 * sigmoid(v.mag - 0.5)) / sx,
		);
	}
}

function computeVectorField(charges, range) {
	let vec = [];
	let max = -Infinity;
	for (let x = range[0]; x <= range[1]; x += range[2]) {
		for (let y = range[0]; y <= range[1]; y += range[2]) {
			let v = [0, 0];
			for (let ch of charges) {
				if ((ch.x - x) ** 2 + (ch.y - y) ** 2 < 0.005) continue;
				let r1n = (ch.x - x) ** 2 + (ch.y - y) ** 2;
				let fv = [
					((ch.q / r1n) * (x - ch.x)) / r1n ** 0.5,
					((ch.q / r1n) * (y - ch.y)) / r1n ** 0.5,
				];
				v[0] += fv[0];
				v[1] += fv[1];
			}
			let n = (v[0] ** 2 + v[1] ** 2) ** 0.5;
			if (max < n) max = n;

			v[0] = v[0] / n / 3;
			v[1] = v[1] / n / 3;
			vec.push({
				start: [x, y],
				end: v,
				mag: n,
			});
		}
	}
	return {
		vec,
		max,
	};
}
