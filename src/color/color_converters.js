/** @module Color-Converters */
export function hue2RGB(p, q, t) {
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
 * Assumes values of red, green, and blue are between 0 & 1 and
 * returns hue, saturation and lightness in range 0 to 1

 * @param {number} r The red color value
 * @param {number} g The green color value
 * @param {number} b The blue color value
 * @return {number[]} The HSL representation
 */
export function RGBToHSL(r, g, b) {
	let max = Math.max(r, g, b),
		min = Math.min(r, g, b),
		hue,
		saturation,
		lightness = (max + min) / 2;

	if (max === min) {
		hue = saturation = 0; // achromatic
	} else {
		let d = max - min;
		saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);
		if (max == r) hue = (g - b) / d + (g < b ? 6 : 0);
		else if (max == g) hue = (b - r) / d + 2;
		else if (max == b) hue = (r - g) / d + 4;
		hue /= 6;
	}

	return [hue, saturation, lightness];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes hue is between 0 and 360, saturation and lightness are between 0 & 1 and
 * returns red, green, and blue values in the range 0 to 1
 *
 * @param {number} hue The hue
 * @param {number} saturation The saturation
 * @param {number} lightness The lightness
 * @return {number[]} The RGB representation
 */
export function HSLToRGB(hue, saturation, lightness) {
	let r, g, b;
	hue /= 360;
	if (saturation === 0) {
		r = g = b = lightness; // achromatic
	} else {
		let q =
			lightness < 0.5
				? lightness * (1 + saturation)
				: lightness + saturation - lightness * saturation;
		let p = 2 * lightness - q;
		r = hue2RGB(p, q, hue + 1 / 3);
		g = hue2RGB(p, q, hue);
		b = hue2RGB(p, q, hue - 1 / 3);
	}

	return [r, g, b];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes values of red, green, and blue are between 0 & 1 and
 * returns hue, saturation and value in range 0 to 1
 *
 * @param {number} r The red color value
 * @param {number} g The green color value
 * @param {number} b The blue color value
 * @return {number[]} HSV representation
 */
export function RGBToHSV(r, g, b) {
	let max = Math.max(r, g, b), // val
		min = Math.min(r, g, b), // chroma
		hue,
		value = max,
		d = max - min,
		saturation = max === 0 ? 0 : d / max;

	if (max === min) {
		hue = 0; // achromatic
	} else {
		if (max == r) hue = (g - b) / d + (g < b ? 6 : 0);
		else if (max == g) hue = (b - r) / d + 2;
		else if (max == b) hue = (r - g) / d + 4;
		hue /= 6;
	}

	return [hue, saturation, value];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * hue is between 0 to 360, saturation and value are between 0 & 1 and
 * returns red, green, and blue in range 0 to 1
 *
 * @param {number} hue
 * @param {number} saturation
 * @param {number} value Also knwon as brightness
 * @return {number[]} RGB representation of color
 */
export function HSVToRGB(hue, saturation, value) {
	let r,
		g,
		b,
		i = Math.floor(hue / 60),
		f = hue / 60 - i,
		p = value * (1 - saturation),
		q = value * (1 - f * saturation),
		t = value * (1 - (1 - f) * saturation);

	i %= 6;
	if (i == 0) (r = value), (g = t), (b = p);
	else if (i == 1) (r = q), (g = value), (b = p);
	else if (i == 2) (r = p), (g = value), (b = t);
	else if (i == 3) (r = p), (g = q), (b = value);
	else if (i == 4) (r = t), (g = p), (b = value);
	else if (i == 5) (r = value), (g = p), (b = q);

	return [r, g, b];
}
