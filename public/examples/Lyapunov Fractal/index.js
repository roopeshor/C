import { lerpColor } from "../../../src/c.js";
import { C } from "../../../src/main.js";
import { background, scale, translate } from "../../../src/settings.js";

const W = 300,
	H = 300;

var k = "ab",
	S = "",
	N = 1000;
for (let i = 0; i < N / k.length + 1; i++) S += k;
C(
	() => {
		scale(1, -1);
		C.workingContext.yAxisInverted = true;
		translate(0, -H);
		background(0);
		console.time("A");
		for (let screenX = 0; screenX < W; screenX += 1 / C.dpr) {
			let b = (screenX / W) * 2 + 2;
			for (let screenY = 0; screenY < H; screenY += 1 / C.dpr) {
				let a = (screenY / H) * 2 + 2;
				let sum = 0,
					r = (n) => (S[n] == "a" ? a : b),
					x_prev = 0.5;
				for (let i = 1; i <= N; i++) {
					let x_i = r(i - 1) * x_prev * (1 - x_prev);
					sum += Math.log(Math.abs(r(i) * (1 - 2 * x_i)));
					x_prev = x_i;
				}
				let L = sum / N;
				let color;
				if (L < 0) {
					color = lerpColor("black", "yellow", 1.0 / (1 + Math.exp(-L)));
				} else {
					color = lerpColor("black", "blue", 1.0 / (1 + Math.exp(L)));
				}
				C.workingContext.fillStyle = color;
				C.workingContext.fillRect(screenX, screenY, 1, 1);
			}
		}
		console.timeEnd("A");
	},
	".container",
	{
		width: W,
		height: H,
		name: "t",
	},
);
