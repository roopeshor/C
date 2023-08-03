import { point } from "../../src/c.js";
import { C } from "../../src/main.js";
import { background, fill, loop } from "../../src/settings.js";
let seed = [
	{
		pos: [200, 200],
		stopped: true,
	},
];

for (let i = 0; i < 6; i++) {
	seed.push({
		pos: [
			200 + Math.cos((i * 2 * Math.PI) / 6) * 5,
			200 + Math.sin((i * 2 * Math.PI) / 6) * 5,
		],
		stopped: true,
	});
}

let particles = [];
particles.push(...seed);
for (let i = 0; i < 1000; i++) {
	particles.push({
		pos: [Math.random() * 400, Math.random() * 400],
		v: [Math.random() * 4 - 2, Math.random() * 4 - 2],
		stopped: false,
	});
}

C(
	() => {
		let size = 5;
		loop(
			() => {
				background(0);
				for (let i = 0; i < particles.length; i++) {
					let p = particles[i];
					if (!p.stopped) {
						if (p.pos[1] > 410) {
							p.v[1] *= -1;
							// p.v[0] = Math.random() * 2 - 1;
						}
						if (p.pos[0] < 0 || p.pos[0] > 400) {
							p.v[0] *= -1;
							// p.v[1] = Math.random() * 2 - 1;
						}
						p.pos[0] += p.v[0];
						p.pos[1] += p.v[1];
						fill("#fff");
						point(p.pos[0], p.pos[1], size);
						for (let j = 0; j < seed.length; j++) {
							let s = seed[j];
							if (dist(p.pos, s.pos) < size / 2) {
								p.stopped = true;
								seed.push(p);
								break;
							}
						}
					} else {
						fill("#afd");
						point(p.pos[0], p.pos[1], size);
					}
				}
				function dist(p1, p2) {
					return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
				}
			},
			"SnowFlakes",
			0,
		);
	},
	".container",
	{
		name: "SnowFlakes",
		width: 400,
		height: 400,
	},
);
