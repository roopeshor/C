import { getInterpolatedColorList } from "../../src/color/interpolation.js";
import { Spectral } from "../../src/constants/color_palettes.js";
import { PI, TAU } from "../../src/constants/math.js";
import { C } from "../../src/main.js";
import { axes } from "../../src/objects/coordinate_systems.js";
import { initBlackboardCanvas } from "../../src/settings.js";

const container = document.querySelector(".container");
const W = 300;
const H = 300;
const plots = [
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

for (var plot of plots) {
	const cnt = document.createElement("div");
	cnt.innerHTML = `<h2>${plot.heading}</h2>
<p>${plot.description}</p>
<div id="${plot.name}"></div>`;
	cnt.classList.add(plot.name, "plot");
	container.appendChild(cnt);
	C(
		() => {
			initBlackboardCanvas();
			axes({
				xAxis: {
					range: plot.range?.xAxis,
					includeNumbers: plot.includeNumbers,
					numbersToInclude: plot.numbersToInclude,
				},
				yAxis: {
					range: plot.range?.yAxis,
					includeNumbers: plot.includeNumbers,
					numbersToInclude: plot.numbersToInclude,
				},
			}).getHeatPlot({
				colors: plot.colors,
				resolution: plot.resolution,
				plotFunction: plot._function,
			});
		},
		"#" + plot.name,
		{
			width: W,
			height: H,
		}
	);
}
