import { C } from "../main.js";
import { scale } from "../settings.js";

/**
 * This module contains functions for drawing different types of text.
 * @module text
 */

/**
 * Draws a filled & stroked text
 *
 * @param {string} text text to draw
 * @param {number} [x=0] x-coord
 * @param {number} [y=0] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function text(text, x = 0, y = 0, maxwidth = undefined) {
	let ctx = C.workingCanvas;
	if (ctx.yAxisInverted) {
		// if inverted reverse it and invert y component
		scale(1, -1);
		y *= -1;
	}
	if (ctx.doFill) ctx.fillText(text, x, y, maxwidth);
	else if (ctx.doStroke) ctx.strokeText(text, x, y, maxwidth);
	if (ctx.yAxisInverted) scale(1, -1); // reverse y-invertion
}

/**
 * Draws a text without border
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function fillText(text, x = 0, y = 0, maxwidth = undefined) {
	let ctx = C.workingCanvas;
	if (ctx.yAxisInverted) {
		scale(1, -1);
		y *= -1;
	}
	ctx.fillText(text, x, y, maxwidth);
	if (ctx.yAxisInverted) scale(1, -1);
}

/**
 * Draws a stroked text
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function strokeText(text, x = 0, y = 0, maxwidth = undefined) {
	let ctx = C.workingCanvas;
	if (ctx.yAxisInverted) {
		scale(1, -1);
		y *= -1;
	}
	ctx.strokeText(text, x, y, maxwidth);
	if (ctx.yAxisInverted) scale(1, -1);
}

export { text, fillText, strokeText };
