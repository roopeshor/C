import { C } from "../main.js";

/**
 * Reads the argument and finds color
 *
 * @param {string} colors
 * @param {boolean} toArray whether to return a array instead of string.
 * @return {string}
 */
function readColor(color, toArray = false) {
	let c1 = color[0];
	let read;
	if (typeof c1 === "number") {
		if (color.length === 1) {
			read = [
				c1,
				c1,
				c1,
				255
			];
		} else if (color.length === 2) {
			read = [
				c1,
				color[1],
				0,
				255
			];
		} else if (color.length === 3) {
			read = [
				c1,
				color[1],
				color[2],
				255
			];
		} else if (color.length === 4) {
			read = [
				c1,
				color[1],
				color[2],
				color[3],
			];
		}
	} else if (c1[0] == "#") {
		c1 = c1.substr(1);
		if (c1.length == 3 || c1.length == 4) {
		let alpha = c1[3] || "ff";
			read = [
				Number("0x" + c1[0] + c1[0]),
				Number("0x" + c1[1] + c1[1]),
				Number("0x" + c1[2] + c1[2]),
				Number("0x" + alpha),
			];
		} else if (c1.length == 6 || c1.length == 8) {
		let alpha = c1.substr(6, 2) || "ff";
			read = [
				Number("0x" + c1.substr(0, 2)),
				Number("0x" + c1.substr(2, 2)),
				Number("0x" + c1.substr(4, 2)),
				Number("0x" + alpha),
			];
		}
	}
	if (!toArray) {
		const mode = C.workingCanvas.colorMode || "rgba";
		if (mode === "hsl" || mode === "rgb") {
			read = mode + `(${read[0]}, ${read[1]}, ${read[2]})`;
		} else if (mode === "rgba") {
			read = `rgba(${read[0]}, ${read[1]}, ${read[2]}, ${read[3]})`;
		}
	}
	return read;
}
export {readColor};
