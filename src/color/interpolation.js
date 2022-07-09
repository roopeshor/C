import { readColor } from "./color_reader.js";

/**
 * gives an interpolated color.
 *
 * @param {string} color1 color
 * @param {string} color2 color
 * @param {number} v should be between 0 and 1.
 */
export function lerpColor(color1, color2, v) {
	const c1 = readColor(color1).rgbaA;
	const c2 = readColor(color2).rgbaA;
	return readColor(
		Math.min(Math.max(0, (c2[0] - c1[0]) * v + c1[0]), 255),
		Math.min(Math.max(0, (c2[1] - c1[1]) * v + c1[1]), 255),
		Math.min(Math.max(0, (c2[2] - c1[2]) * v + c1[2]), 255),
		Math.min(Math.max(0, (c2[3] - c1[3]) * v + c1[3]), 255)
	).hex8;
}

/**
 * Lerps across a color Object
 *
 * @param {Object} colorObj
 * @param {number} v
 * @return {string}
 */
export function lerpColorObject(colorObj, v) {
	const stopes = Object.keys(colorObj || {}).sort();
	const min = Math.min(...stopes);
	const max = Math.max(...stopes);
	let color = "#000000";
	if (v >= max) return colorObj[max];
	if (v <= min) return colorObj[min];
	for (let i = 0; i < stopes.length - 1; i++) {
		let a = stopes[i];
		if (v > a) {
			color = lerpColor(colorObj[a], colorObj[stopes[i + 1]], (v - a) / (stopes[i + 1] - a));
			break;
		} else if (v == a) {
			color = colorObj[a];
			break;
		}
	}
	return color;
}

/**
 * Lerps across a color Array
 * From <https://github.com/yuki-koyama/tinycolormap/blob/fe597277c782c583eb40362de98a08df62efc628/include/tinycolormap.hpp#L159>
 * @param {Array<string>} colorArr array that contains color as string
 * @param {number} v value to interpolate
 * @param {number} [min = 0] minimum value of the range
 * @param {number} [max = 1] maximum value of the range
 * @return {string} lerped color
 */
export function lerpColorArray(colorArr, v, min = 0, max = 1) {
	let len = colorArr.length - 1;
	if (v >= max) return colorArr[len];
	if (v <= min) return colorArr[0];

	// map to [0, 1]
	v = (v - min) / (max - min);
	let a = v * len, // between 0 and len
		b = Math.floor(a);
	return lerpColor(colorArr[b], colorArr[b + 1], a - b);
}

/**
 *
 * @param {Array<string>} colorPalatte Array of color palettes
 * @param {number} [min=0] minimum of range
 * @param {number} [max=5] maximum of range
 * @param {number} [alpha=1] value of alpha channel. This value must be between 0 & 1
 * @returns {Object} color object
 */
export function getInterpolatedColorList(colorPalatte, min = 0, max = 5, alpha) {
	if (colorPalatte.length < 2)
		throw new Error("Atleast 2 colors are needed to create interpolatable object");
	let step = (max - min) / (colorPalatte.length - 1),
		colorObj = {};

	for (let i = 0; i < colorPalatte.length; i++) {
		let value = min + i * step,
			color = readColor(colorPalatte[i]).rgbaA;
		color[3] = isNaN(alpha) ? color[3] : alpha;
		colorObj[value] = color;
	}

	return colorObj;
}
