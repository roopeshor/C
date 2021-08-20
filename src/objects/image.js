import { C } from "../main.js";
import { readColor } from "../color/color_reader.js";
/**
 * This module contains function for image manipulation.
 * @module image
 */

/**
 * Draws a given image in canvas.
 * See more about the parameters : {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage}
 *
 */
function drawImage() {
	C.workingCanvas.drawImage(...arguments);
}

/**
 * Draws a pixel
 *
 * @param {number} x x-coordinate of pixel
 * @param {number} y y-coordinate of pixel
 * @param {string} color color of pixel
 */
function pixel(x, y, color) {
	let ctx = C.workingCanvas, dpr = 1/ctx.dpr;
	ctx.fillStyle = color == undefined ? ctx.fillStyle : readColor(color);
	ctx.fillRect(x, y, dpr, dpr);
}

export { drawImage, pixel };
