import { readColor } from "./color_reader.js";

/**
 * gives an interpolated color.
 *
 * @param {string} color1 color
 * @param {string} color2 color
 * @param {number} v should be between 0 and 1.
 */
function lerpColor(color1, color2, v) {
	const c1 = readColor([color1], true);
	const c2 = readColor([color2], true);
	return readColor([
		(c2[0] - c1[0]) * v + c1[0],
		(c2[1] - c1[1]) * v + c1[1],
		(c2[2] - c1[2]) * v + c1[2],
		(c2[3] - c1[3]) * v + c1[3],
	]);
}

function lerpColorArray(colorArr, v) {
	const stopes = Object.keys(colorArr).sort();
	const min = Math.min(...stopes);
	const max = Math.max(...stopes);
	if (v >= max) return colorArr[max];
	if (v <= min) return colorArr[min];
	for (var i = 0; i < stopes.length - 1; i++) {
		let a = stopes[i];
		if (v > a) {
			return lerpColor(
				colorArr[a],
				colorArr[stopes[i + 1]],
				(v - a) / (stopes[i + 1] - a)
			);
		} else if (v == a) {
			return colorArr[a];
		}
	}
}

export { lerpColor, lerpColorArray };
