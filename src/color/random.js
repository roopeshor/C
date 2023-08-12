/** @module Random-Colors */
import { Colors } from "../constants/colors.js";
import { randomInt } from "../math/random.js";

let definedColorList = Object.keys(Colors);
const TR_INDEX = definedColorList.indexOf("TRANSPARENT");
definedColorList = definedColorList
	.slice(0, TR_INDEX)
	.concat(definedColorList.slice(TR_INDEX + 1));

/**
 * returns a random hex color
 *
 */
export function randomColor() {
	let color = "#";
	for (let i = 0; i < 3; i++) {
		let randNum = randomInt(255).toString(16);
		randNum = randNum.length === 1 ? 0 + randNum : randNum;
		color += randNum;
	}
	return color;
}

/**
 * picks a random color from defined ones
 *
 */
export function randomDefinedColor() {
	return Colors[definedColorList[randomInt(definedColorList.length - 1)]];
}
