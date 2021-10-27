import { readColor } from "../color/color_reader.js";
import { C } from "../main.js";

/**
 * returns color at a given point from ImageData
 *
 * @param {ImageData} pixels
 * @param {number} x x-coordinate of point
 * @param {number} y y-coordinate of point
 * @return {Uint8ClampedArray} array of color components [r, g, b, a]
 */
function getPixelColor(pixels, x, y) {
	let index = pixels.width * y + x;
	return pixels.data.subarray(index, index + 4);
}

/**
 * Convert image data to 2d array of colors.
 *
 * @param {ImageData} pixels
 * @returns {Array<Array<number>>} 2d array of colors
 */
function imageDataToColorArray(pixels) {
	let w = pixels.width,
		h = pixels.height,
		dat = Array.from(pixels.data),
		image2D = [];
	for (var y = 0; y < h; y++) {
		image2D.push([]);
		for (var x = 0; x < w; x++) {
			let i = h * y + x,
				r = dat[i],
				g = dat[i + 1],
				b = dat[i + 2],
				a = dat[i + 3];
			image2D[y].push([r, g, b, a]);
		}
	}
	return image2D;
}

/**
 * Returns if neighbor pixels have the same color as given.
 *
 * @param {Array<number>} color color to compare with
 * @param {ImageData} pixels image data
 * @param {number} x x-coordinate of point
 * @param {number} y y-coordinate of point
 * @return {boolean}
 */
function hasNeighbourColor(color, pixels, x, y) {
	let dat = pixels.data,
		w = pixels.width;
	for (let i = x - 1; i <= x + 1; i++) {
		for (let j = y - 1; j <= y + 1; j++) {
			if (i !== x || j !== y) {
				let index = w * y + x,
					neighbourColor = dat.subarray(index, index + 4);
				if (
					neighbourColor[0] === color[0] &&
					neighbourColor[1] === color[1] &&
					neighbourColor[2] === color[2] &&
					neighbourColor[3] === color[3]
				) {
					return true;
				}
			}
		}
	}
	return false;
}

// TODO: Under construction
//function createMapOfLetter(letter) {
//	let img = Image.new("RGB", (230, 230), "white"),
//		d = ImageDraw.Draw(img),
//		font = ImageFont.truetype("arial.ttf", 300);
//	d.text((15, -50), letter, (fill = (0, 0, 0)), (font = font));
//
//	let pixels = img.load(),
//		ans = [];
//
//	for (let x = 0; x < 230; x++) {
//		for (let y = 0; y < 230; y++) {
//			if (pixels[(x, y)] == (0, 0, 0)) {
//				if (
//					hasNeighbourColor((255, 255, 255), pixels, x, y) &&
//					!hasNeighbourColor((255, 0, 0), pixels, x, y)
//				) {
//					pixels[(x, y)] = (255, 0, 0);
//					ans.append([x, y]);
//				}
//			}
//		}
//	}
//
//	return ans;
//}

/**
 * Replaces a color by another color in given image.
 * @param {ImageData} image image to be processed
 * @param {*} toReplace color to be replaced
 * @param {*} replaced replaced color
 * @param {boolean} [matchAlpha = false] whether to check if alpha channel is same as that of toReplace.
 * @param {number} [tolerance = 0] minimum difference between each color channel
 */
function replaceColorInImage(image, toReplace, replaced, matchAlpha = false, tolerance = 0) {
	let data = image.data,
		newData = C.workingCanvas.createImageData(image.width, image.height);
	const [r1, g1, b1, a1] = readColor(toReplace).rgbaA;
	const [r2, g2, b2, a2] = readColor(replaced).rgbaA;
	let nonOccurances = 0;
	for (let i = 0; i < data.length; i += 4) {
		let r = data[i],
			g = data[i + 1],
			b = data[i + 2],
			a = data[i + 3];
		if (
			Math.abs(r - r1) <= tolerance &&
			Math.abs(g - g1) <= tolerance &&
			Math.abs(b - b1) <= tolerance &&
			(matchAlpha ? Math.abs(a - a1) <= tolerance : true)
		) {
			newData.data[i] = r2;
			newData.data[i + 1] = g2;
			newData.data[i + 2] = b2;
			if (matchAlpha) newData.data[i + 3] = a2;
			else newData.data[i + 3] = 255;
		} else {
			newData.data[i] = r;
			newData.data[i + 1] = g;
			newData.data[i + 2] = b;
			if (matchAlpha) newData.data[i + 3] = a;
			else newData.data[i + 3] = 255;
			nonOccurances++;
		}
	}
	console.log(nonOccurances);
	return newData;
}

/**
 * Converts a image to ImageData.
 * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement|ImageBitmap|OffscreenCanvas} image image
 * @param {number} x x-coordinate of starting point in image
 * @param {number} y y-coordinate of starting point in image
 * @param {number} [width = image.width] width of area to be covered
 * @param {number} [height = image.height] height of area to be covered
 * @param {boolean} [smoothen = false] whether to capture a smoothened the image
 */
function imageToData(image, x, y, width, height, smoothen = false) {
	let cvs = document.createElement("canvas");
	let ctx = cvs.getContext("2d");
	let dpr = C.dpr;
	x = x * dpr || 0;
	y = y * dpr || 0;
	cvs.width = width = (isNaN(width) ? image.width : width) * dpr;
	cvs.height = height = (isNaN(height) ? image.height : height) * dpr;
	ctx.imageSmoothingEnabled = smoothen;
	ctx.drawImage(image, 0, 0, width, height);
	return ctx.getImageData(x, y, width, height);
}

export {
	getPixelColor,
	imageDataToColorArray,
	hasNeighbourColor,
	replaceColorInImage,
	imageToData,
	// createMapOfLetter,
};
