import { C } from "../../src/main.js";
import { axes } from "../../src/objects/coordinate_systems.js";
import { initBlackboardCanvas } from "../../src/settings.js";

const W = 310;
const H = 310;

var examples = [
	{
		name: "sin__cos",
		heading: "sin(x) + cos(y)",
		description: "Resolution: 3px",
		_function: (x, y) => Math.sin(x) + Math.cos(y),
		resolution: 3,
	},
	{
		name: "xsq__ysq",
		heading: "x² + y²",
		description: "Resolution: 3px",
		_function: (x, y) => x ** 2 + y ** 2,
		range: {
			xAxis: [-3, 3, 1],
			yAxis: [-3, 3, 1],
		},
		resolution: 3,
	},
	{
		name: "tan__tan",
		heading: "tan(x) + tan(y)",
		description: "Resolution: 1px",
		_function: (x, y) => Math.tan(x) + Math.tan(y),
		resolution: 1,
	},
	{
		name: "x_×_x",
		heading: "x × y",
		description: "Resolution: 2px",
		_function: (x, y) => x * y,
		resolution: 2,
	},
];
const container = document.querySelector(".container");
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
				},
				yAxis: {
					range: example.range?.yAxis,
				},
			}).getHeatPlot({
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
