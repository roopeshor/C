/** @module Color gradient */
import { C } from "../main.js";
import { type } from "../utils.js";

/**
 * creates a linear gradient
 *
 * @param {number[]} initialPoint initial point as [x, y]
 * @param {number[]} finalPoint final point as [x, y]
 * @param {Object|Array<*>} colStops color stops
 @example
 ```js
let color = linearGradient(
	[0, 0], [200, 0],
	{
			0: "green",
			0.5: "cyan",
			1: "yellow"
	}
);
```,
```js
let color = linearGradient(
	[0, 0], [200, 0],
	[
		"green",
		"cyan",
		"yellow"
	]
);
```
 */
export function linearGradient(initialPoint, finalPoint, colStops) {
	const ctx = C.workingContext;
	const gradient = ctx.createLinearGradient(
		initialPoint[0],
		initialPoint[1],
		finalPoint[0],
		finalPoint[1],
	);
	if (type(colStops) == "Array") {
		const stops = {};
		const step = 1 / colStops.length;
		for (let i = 0; i < colStops.length; i++) {
			stops[step * i] = colStops[i];
		}
		colStops = stops;
	} else if (type(colStops) == "Object") {
		colStops = colStops;
	} else {
		throw new Error("Color Stops must be an Array or an Object");
	}
	for (let stops = Object.keys(colStops || {}), i = 0; i < stops.length; i++) {
		const stop = Number(stops[i]);
		gradient.addColorStop(stop, colStops[stop]);
	}
	return gradient;
}
