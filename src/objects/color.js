import * as COLORLIST from "../constants/colors.js";
import { C } from "../main.js";
import { randomInt } from "../utils/math.js";


/**
 * This module contains functions for different color operations.
 * @module color
 */
const __definedColors__ = Object.keys(COLORLIST);

/**
 * Reads the argument and finds color
 *
 * @param {string} colors
 * @return {string}
 */
function readColor(colors) {
	let color1;
	let color2;
	let color3;
	let alpha = 255;
	let read = "";
	if (typeof colors[0] === "number") {
		if (colors.length === 1) {
			color1 = colors[0];
			color2 = color1;
			color3 = color1;
		} else if (colors.length === 2) {
			color1 = colors[0];
			color2 = colors[1];
			color3 = 0;
		} else if (colors.length === 3) {
			color1 = colors[0];
			color2 = colors[1];
			color3 = colors[2];
		} else if (colors.length === 4) {
			color1 = colors[0];
			color2 = colors[1];
			color3 = colors[2];
			alpha = colors[3];
		}
		const mode = C.workingCanvas.colorMode;
		if (mode === "HSL") {
			read = `hsl(${color1}, ${color2}, ${color3})`;
		} else if (mode === "rgb") {
			read = `rgb(${color1}, ${color2}, ${color3})`;
		} else if (mode === "rgba") {
			read = `rgba(${color1}, ${color2}, ${color3}, ${alpha})`;
		}
	} else {
		read = colors[0];
	}
	return read;
}

// color randomizers
/**
 * returns a random hex color
 *
*/
function randomColor () {
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
function randomDefinedColor() {
	return COLORLIST[__definedColors__[randomInt(__definedColors__.length - 1)]];
}

// color converters
function hue2RGB(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes values of red, green, and blue are between 0 & 255 and
 * returns hue in range 0 to 360, saturation and lightness in range 0 to 1
 * @method RGBToHSL
 * @global
 * @param {number} red The red color value
 * @param {number} green The green color value
 * @param {number} blue The blue color value
 * @return {array} The HSL representation
 */
function RGBToHSL(red, green, blue) {
	const r = red / 255;
	const g = green / 255;
	const b = blue / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let hue;
	let saturation;
	const lightness = (max + min) / 2;

	if (max === min) {
		hue = saturation = 0; // achromatic
	} else {
		const d = max - min;
		saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
		case r:
			hue = (g - b) / d + (g < b ? 6 : 0);
			break;
		case g:
			hue = (b - r) / d + 2;
			break;
		case b:
			hue = (r - g) / d + 4;
			break;
		}
		hue /= 6;
	}

	return [hue * 360, saturation, lightness];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes values of hue is between 0 and 360, saturation and lightness are between 0 & 1 and
 * returns red, green, and blue values between 0 & 255
 *
 * @param {number} hue The hue
 * @param {number} saturation The saturation
 * @param {number} lightness The lightness
 * @return {array} The RGB representation
 */
function HSLToRGB(hue, saturation, lightness) {
	let r, g, b;
	hue /= 360;
	if (saturation === 0) {
		r = g = b = lightness; // achromatic
	} else {
		const q =
      lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
		const p = 2 * lightness - q;
		r = hue2RGB(p, q, hue + 1 / 3);
		g = hue2RGB(p, q, hue);
		b = hue2RGB(p, q, hue - 1 / 3);
	}

	return [r * 255, g * 255, b * 255];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes values of red, green, and blue are between 0 & 255 and
 * returns hue in range 0 to 360, saturation and value in range 0 to 1
 *
 * @param {number} red The red color value
 * @param {number} green The green color value
 * @param {number} blue The blue color value
 * @return {array} The HSV representation
 */
function RGBToHSV(red, green, blue) {
	const r = red / 255;
	const g = green / 255;
	const b = blue / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let hue;
	const value = max;
	const d = max - min;
	const saturation = max === 0 ? 0 : d / max;

	if (max === min) {
		hue = 0; // achromatic
	} else {
		switch (max) {
		case r:
			hue = (g - b) / d + (g < b ? 6 : 0);
			break;
		case g:
			hue = (b - r) / d + 2;
			break;
		case b:
			hue = (r - g) / d + 4;
			break;
		}
		hue /= 6;
	}

	return [hue * 360, saturation, value];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes values of hue is between 0 to 360, saturation, and value are between 0 & 1 and
 * returns red, green, and blue in range 0 to 255
 *
 * @param {number} hue The hue
 * @param {number} saturation The saturation
 * @param {number} value The value
 * @return {array} The RGB representation
 */
function HSVToRGB(hue, saturation, value) {
	let r, g, b;
	const i = Math.floor(hue / 60);
	const f = hue / 60 - i;
	const p = value * (1 - saturation);
	const q = value * (1 - f * saturation);
	const t = value * (1 - (1 - f) * saturation);

	switch (i % 6) {
	case 0:
		r = value;
		g = t;
		b = p;
		break;
	case 1:
		r = q;
		g = value;
		b = p;
		break;
	case 2:
		r = p;
		g = value;
		b = t;
		break;
	case 3:
		r = p;
		g = q;
		b = value;
		break;
	case 4:
		r = t;
		g = p;
		b = value;
		break;
	case 5:
		r = value;
		g = p;
		b = q;
		break;
	}

	return [r * 255, g * 255, b * 255];
}

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
export {
	randomColor,
	randomDefinedColor,

	RGBToHSL,
	HSLToRGB,
	RGBToHSV,
	HSVToRGB,

	linearGradient,
	readColor
};

