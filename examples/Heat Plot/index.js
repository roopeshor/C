import { getInterpolatedColorList } from "../../src/color/interpolation.js";
import { Spectral } from "../../src/constants/color_palettes.js";
import { PI, TAU } from "../../src/constants/math.js";
import { C } from "../../src/main.js";
import { axes } from "../../src/objects/coordinate_systems.js";
import { initBlackboardCanvas } from "../../src/settings.js";

const container = document.querySelector(".container");
const W = 300;
const H = 300;
const examples = [
	{
		name: "sin__cos",
		heading: "sin(x) + cos(y)",
		description: "Resolution: 3px",
		_function: (x, y) => Math.sin(x) + Math.cos(y),
		resolution: 2,
		range: {
			xAxis: [-TAU, TAU, PI / 2],
			yAxis: [-TAU, TAU, PI / 2],
		},
		includeNumbers: true,
		numbersToInclude: [
			"-2π",
			"-3π/2",
			"-π",
			"-π/2",
			"0",
			"π/2",
			"π",
			"3π/2",
			"2π",
		],
		colors: getInterpolatedColorList(Spectral, -2, 2, 0.5, 0.8),
	},

	{
		name: "xsq__ysq",
		heading: "x² + y²",
		description: "Resolution: 4px",
		_function: (x, y) => x ** 2 + y ** 2,
		range: {
			xAxis: [-3, 3, 1],
			yAxis: [-3, 3, 1],
		},
		resolution: 2,
		includeNumbers: true,
		colors: getInterpolatedColorList(Spectral, 0, 7, 1, 0.8),
	},

	{
		name: "tan__tan",
		heading: "tan(x) + tan(y)",
		description: "Resolution: 1px",
		_function: (x, y) => Math.tan(x) + Math.tan(y),
		resolution: 1,
		range: {
			xAxis: [-TAU, TAU, PI],
			yAxis: [-TAU, TAU, PI],
		},
		includeNumbers: true,
		numbersToInclude: ["-2π", "-π", "0", "π", "2π"],
		colors: getInterpolatedColorList(Spectral, -5, 5, 1, 0.8),
	},

	{
		name: "x_×_x",
		heading: "x × y",
		description: "Resolution: 2px",
		_function: (x, y) => x * y,
		resolution: 2,
		range: {
			xAxis: [-6, 6, 1],
			yAxis: [-6, 6, 1],
		},
		includeNumbers: true,
		colors: getInterpolatedColorList(Spectral, -5, 5, 1, 0.8),
	},
];

for (var example of examples) {
	const cnt = document.createElement("div");
	cnt.innerHTML = `<h2>${example.heading}</h2>
<p>${example.description}</p>
<div id="${example.name}"></div>`;
	cnt.classList.add(example.name, "example");
	container.appendChild(cnt);
	C(
		() => {
			initBlackboardCanvas();
			axes({
				xAxis: {
					range: example.range?.xAxis,
					includeNumbers: example.includeNumbers,
					numbersToInclude: example.numbersToInclude,
				},
				yAxis: {
					range: example.range?.yAxis,
					includeNumbers: example.includeNumbers,
					numbersToInclude: example.numbersToInclude,
				},
			}).getHeatPlot({
				colors: example.colors,
				resolution: example.resolution,
				plotFunction: example._function,
			});
		},
		"#" + example.name,
		{
			width: W,
			height: H,
		}
	);
}
