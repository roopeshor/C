import { C } from "../main.js";
/**
 * This module contains function for image manipulation.
 * @module Image
 */

/**
 * Draws a given image in canvas.
 * See more about the parameters : {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage}
 * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement|ImageBitmap|OffscreenCanvas} image image to draw
 */
export function drawImage(image) {
	let ctx = C.workingContext,
		x,
		y;
	if (arguments.length < 6) {
		x = arguments[1];
		y = arguments[2];
	} else {
		x = arguments[5];
		y = arguments[6];
	}
	ctx.save();
	ctx.translate(x, y);
	if (ctx.yAxisInverted) ctx.scale(1, -1);
	if (ctx.XAxisInverted) ctx.scale(-1, 1);
	ctx.drawImage(image, 0, 0, ...Array.prototype.slice.call(arguments, 3));
	ctx.restore();
}

/**
 * Draws a pixel
 *
 * @param {number} x x-coordinate of pixel
 * @param {number} y y-coordinate of pixel
 * @param {string} color color of pixel
 */
export function pixel(x, y, color, size) {
	let ctx = C.workingContext;
	if (color) ctx.fillStyle = color;
	if (!size) size = 1 / C.dpr;
	ctx.fillRect(x, y, size, size);
}

/**
 * Loads a image from given url. I
 * @param {string} url url of image
 * @param {Function} [resolver] function to call when image is loaded
 * @param {Function} [fallback] function to call when image fails to loaded
 * @returns {Image} image. This may not be loaded yet.
 */
export function loadImage(url, resolver, fallback) {
	var img = new Image(); // Create new img element
	img.src = url;
	if (typeof resolver == "function") {
		img.addEventListener("load", () => resolver(img), false);
	}
	if (typeof fallback == "function") {
		img.addEventListener("error", (evt) => fallback(evt, img), false);
	}
	return img;
}

/**
 * loads a image from given url and returns a promise.
 * @param {string} url url of image
 * @returns {Promise} promise that resolves to image
 */
export function loadImagePromise(url) {
	return new Promise((resolve, reject) => {
		loadImage(url, resolve, reject);
	});
}
