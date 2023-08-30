import { C } from "../main.js";

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
export function text(text, x = 0, y = 0, maxwidth = undefined) {
	let ctx = C.workingContext;
	// if axes are inverted through invert* function reverse it
	ctx.save();
	ctx.translate(x, y);
	if (ctx.yAxisInverted) ctx.scale(1, -1);
	if (ctx.xAxisInverted) ctx.scale(-1, 1);
	if (ctx.doFill) ctx.fillText(text, 0, 0, maxwidth);
	else if (ctx.doStroke) ctx.strokeText(text, 0, 0, maxwidth);
	ctx.restore();
}

/**
 * Draws a text without border
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
export function fillText(text, x = 0, y = 0, maxwidth = undefined) {
	let ctx = C.workingContext;
	ctx.save();
	ctx.translate(x, y);
	if (ctx.yAxisInverted) ctx.scale(1, -1);
	if (ctx.xAxisInverted) ctx.scale(-1, 1);
	ctx.fillText(text, 0, 0, maxwidth);
	ctx.restore();
}

/**
 * Draws a stroked text
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
export function strokeText(text, x = 0, y = 0, maxwidth = undefined) {
	let ctx = C.workingContext;
	ctx.save();
	ctx.translate(x, y);
	if (ctx.yAxisInverted) ctx.scale(1, -1);
	if (ctx.xAxisInverted) ctx.scale(-1, 1);
	ctx.strokeText(text, 0, 0, maxwidth);
	ctx.restore();
}
