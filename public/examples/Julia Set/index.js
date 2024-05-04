import { ColorPalettes, PHI, lerpColorArray, sqrt } from "../../../src/c.js";
import { background, loop, noLoop, translate } from "../../../src/settings.js";

let coeffs = [
		[0, 0],
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
		[0, -PHI / 2],
		[-0.1, 0.651],
		[-0.512511498387847167, 0.521295573094847167],
	],
	coeff = coeffs[13],
	s = 1,
	W = 500,
	H = 500,
	maxIterations = 300,
	cx = coeff[0],
	cy = coeff[1],
	[offX, offY] = [0.1, -0.6],
	R = sqrt(cx ** 2 + cy ** 2) + 90 ** 2,
	R2 = R ** 2,
	unit = H,
	pat = ColorPalettes.Blues,
	iterCount = 0;
C(
	() => {
		background(0);
		translate(CENTERX, CENTERY);
		let ctx = C.workingContext,
			px = 1 / ctx.dpr,
			x = -W / 2,
			time = window.performance.now(),
			n = 2;
		loop(
			() => {
				if (x > W / 2) {
					time = window.performance.now() - time;
					console.log(
						`Rendered in ${time.toFixed(3)}ms on ${W}x${H} canvas
total iteration: ${iterCount}
total rendered points: ${W * H}
iterations/s: ${Math.round((iterCount / time) * 1000)}
iterations/px: ${Math.round(iterCount / (W * H))}`,
					);
					noLoop();
				}

				for (var y = -H / 2; y < H / 2; y += px) {
					let zx = (x / unit + offX) * s,
						zy = (y / unit + offY) * s,
						iteration = 0,
						x2 = zx ** 2,
						y2 = zy ** 2,
						c = Math.exp(-Math.sqrt(x2 + y2));
					while (iteration++ < maxIterations && x2 + y2 < R2) {
						/*
						// for multi julia set
						let r = (x2 + y2) ** (n / 2),
							t = n * atan2(zy, zx);
						zy = r * sin(t) + cy;
						zx = r * cos(t) + cx;
						*/
						zy = zx * zy * 2 + cy;
						zx = x2 - y2 + cx;

						x2 = zx * zx;
						y2 = zy * zy;

						// for smooth coloring
						// c += Math.exp(-Math.sqrt(x2 + y2));
					}
					iterCount += iteration;
					ctx.fillStyle = lerpColorArray(pat, iteration / maxIterations);
					ctx.fillRect(x, y, px, px);
				}
				x += px;
			},
			"main",
			0,
		);
	},
	".container",
	{
		name: "main",
		width: W,
		height: H,
	},
);
