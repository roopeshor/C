import { C } from "../main.js";

/**
 * This module contains function for image manipulation.
 * @module image
 */

/**
 * Draws a given image in canvas.
 * See more about the parameters : <https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage>
 *
 * @global
 */
function drawImage() {
	C.workingCanvas.drawImage(...arguments);
}

export {drawImage};
