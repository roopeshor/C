import { C } from "../main.js";
import * as namedColors from "../constants/named_colors.js";

// adapeted from p5.js
/**
 * Full color string patterns. The capture groups are necessary.
 */
let // Matching format: #XXX
	HEX3 = /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,
	// Matching format: #XXXX
	HEX4 = /^#([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])$/i,
	// Matching format: #xxxxxx
	HEX6 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
	// Matching format: #XXXXXXXX
	HEX8 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
	// Matching format: rgb(R, G, B)
	RGB = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i,
	// Matching format: rgb(R, G, B, A)
	RGBA =
		/^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(?:(\d+(?:\.\d+)?)|(?:\.\d+))\)$/i;
/**
 * Reads the argument and returns color in the prefered colorMode. If last argument is given true, it will return the colors as array
 * Possible use cases (these assume colorModes to be 'rgba'):
 * Only accept valid css colors
 *
 * * readColor(100)                 // rgba(100, 100, 100, 1)
 * * readColor(255, 200)            // rgba(255, 200, 0, 1)
 * * readColor(255, 200, 100)       // rgba(255, 200, 100, 1)
 * * readColor(290, 134, 50, 0.6)   // rgba(290, 134, 50, 0.6)
 * * readColor("#f3d")              // rgba(255, 51, 221, 1)
 * * readColor("#fa054f")           // rgba(250, 5, 79, 1)
 * * readColor("#fa054fa0")         // rgba(250, 5, 79, 0.6274509803921569)
 * * readColor(255, 200, 100, true) // [255, 200, 100, 1]
 * * readColor("#f3da", true)       // [255, 51, 221, 0.0392156862745098]
 *
 * @return {string|array} color string/array
 */
function readColor() {
	let args = Array.prototype.slice.call(arguments),
		color,
		toArray,
		lastArg = args[args.length - 1],
		result;
	if (typeof lastArg == "boolean") {
		toArray = lastArg;
		color = args.slice(0, args.length - 1);
	} else {
		toArray = false;
		color = args.slice(0, args.length);
	}
	let c1 = color[0];
	if (typeof c1 === "number") {
		if (color.length === 1) {
			result = [c1, c1, c1, 1];
		} else if (color.length === 2) {
			result = [c1, color[1], 0, 1];
		} else if (color.length === 3) {
			result = [c1, color[1], color[2], 1];
		} else if (color.length === 4) {
			result = [c1, color[1], color[2], color[3]];
		}
	} else if (typeof c1 == "string") {
		// Adapted from p5.js
		let str = c1.replace(/\s/g, "").toLowerCase();
		// convert string to array if it is a named colour.
		if (namedColors[str]) result = readColor(namedColors[str], true);
		else if (HEX3.test(str)) {
			result = HEX3.exec(str)
				.slice(1)
				.map((color) => parseInt(color + color, 16));
			result[3] = 1;
		} else if (HEX6.test(str)) {
			result = HEX6.exec(str)
				.slice(1)
				.map((color) => parseInt(color, 16));
			result[3] = 1;
		} else if (HEX4.test(str)) {
			result = HEX4.exec(str)
				.slice(1)
				.map((color) => parseInt(color + color, 16));
		} else if (HEX8.test(str)) {
			result = HEX8.exec(str)
				.slice(1)
				.map((color) => parseInt(color, 16));
		} else if (RGB.test(str)) {
			result = RGB.exec(str)
				.slice(1)
				.map((color) => parseInt(color));
			result[3] = 1;
		} else if (RGBA.test(str)) {
			result = RGBA.exec(str)
				.slice(1)
				.map((color, index) => {
					if (index == 3) return parseFloat(color);
					return parseInt(color);
				});
		} else {
			throw new Error("Given color is not valid");
		}
	}
	if (!toArray) {
		let mode = (C.workingCanvas || {}).colorMode || "rgba";
		if (mode === "rgba") {
			result = `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${result[3]})`;
		} else if (mode === "hsl" || mode === "rgb") {
			result = mode + `(${result[0]}, ${result[1]}, ${result[2]})`;
		}
	}
	return result;
}
export { readColor };
