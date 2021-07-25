import { C } from "../main.js";

/**
 * creates a linear gradient
 *
 * @param {array} initialPoint initial point as [x, y]
 * @param {array} finalPoint final point as [x, y]
 * @param {Object|array} colorStops color stops
 @example
 ```js
var color = linearGradient(
	[0, 0], [200, 0],
	{
			0: "green",
			0.5: "cyan",
			1: "yellow"
	}
);
```,
```js
var color = linearGradient(
	[0, 0], [200, 0],
	[
		"green",
		"cyan",
		"yellow"
	]
);
```
 */
function linearGradient(initialPoint, finalPoint, colorStops) {
	const ctx = C.workingCanvas;
	const gradient = ctx.createLinearGradient(
		initialPoint[0],
		initialPoint[1],
		finalPoint[0],
		finalPoint[1]
	);
	if (Array.isArray(colorStops)) {
		const stops = {};
		const step = 1 / colorStops.length;
		for (let i = 0; i < colorStops.length; i++) {
			stops[step * i] = colorStops[i];
		}
		colorStops = stops;
	}
	for (let stops = Object.keys(colorStops), i = 0; i < stops.length; i++) {
		const stop = stops[i];
		gradient.addColorStop(stop, colorStops[stop]);
	}
	return gradient;
}

export { linearGradient };
