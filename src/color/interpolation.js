import { readColor } from "./color_reader.js";

/**
 * gives an interpolated color.
 *
 * @param {string} color1 color
 * @param {string} color2 color
 * @param {number} v should be between 0 and 1.
 */
function lerpColor(color1, color2, v) {
	const c1 = readColor(color1, true);
	const c2 = readColor(color2, true);
	return readColor(
		Math.min(Math.max(0, (c2[0] - c1[0]) * v + c1[0]), 255),
		Math.min(Math.max(0, (c2[1] - c1[1]) * v + c1[1]), 255),
		Math.min(Math.max(0, (c2[2] - c1[2]) * v + c1[2]), 255),
		Math.min(Math.max(0, (c2[3] - c1[3]) * v + c1[3]), 255)
	);
}

/**
 * Lerps across a color Object
 *
 * @param {object} colorObj
 * @param {number} v
 * @return {string}
 */
function lerpColorObject(colorObj, v) {
	const stopes = Object.keys(colorObj).sort();
	const min = Math.min(...stopes);
	const max = Math.max(...stopes);
	if (v >= max) return colorObj[max];
	if (v <= min) return colorObj[min];
	for (let i = 0; i < stopes.length - 1; i++) {
		let a = stopes[i];
		if (v > a) {
			return lerpColor(colorObj[a], colorObj[stopes[i + 1]], (v - a) / (stopes[i + 1] - a));
		} else if (v == a) {
			return colorObj[a];
		}
	}
}

/**
 * Lerps across a color Array
 * From <https://github.com/yuki-koyama/tinycolormap/blob/fe597277c782c583eb40362de98a08df62efc628/include/tinycolormap.hpp#L159>
 * @param {array<string>} colorArr array that contains color as string
 * @param {number} v value to interpolate
 * @param {number} [min = 0] minimum value of the range
 * @param {number} [max = 1] maximum value of the range
 * @return {string} lerped color
 */
function lerpColorArray(colorArr, v, min = 0, max = 1) {
	let len = colorArr.length - 1;
	if (v >= max) return colorArr[len];
	if (v <= min) return colorArr[0];

	// map to [0, 1]
	v = (v - min) / (max - min);
	let a = v * len, // between 0 and len
		b = Math.floor(a);
	return lerpColor(colorArr[b], colorArr[b + 1], a - b);
}

function getInterpolatedColorList(colorPalatte, min = 0, max = 5, step = 1, alpha = 1) {
	const len = Math.round((max - min) / step) + 1;
	const list = Object.keys(colorPalatte),
		listMax = Math.max(...list);
	if (len > listMax) {
		// not implemented
	} else if (len < 3) {
		throw new Error("Number of colors to compute is less than 3");
	}
	const colorObj = {};
	const cp = colorPalatte[len];
	let k = 0;
	for (let i = min; i <= max; i += step) {
		const c = readColor(cp[k++], true);
		c[3] = alpha;
		colorObj[i] = readColor(...c);
	}
	return colorObj;
}

export { lerpColor, lerpColorObject, getInterpolatedColorList, lerpColorArray };
