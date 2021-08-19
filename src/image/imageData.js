/**
 * returns color at a given point from ImageData
 *
 * @param {ImageData} pixels
 * @param {number} x x-coordinate of point
 * @param {number} y y-coordinate of point
 * @return {array} array of color components [r, g, b, a]
 */
function getPixelColor(pixels, x, y) {
	let index = pixels.width * y + x;
	return pixels.data.subarray(index, index + 4);
}

/**
 * Convert image data to 2d array of colors.
 *
 * @param {ImageData} pixels
 * @returns {array<array>} 2d array of colors
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
 * @param {array} color color to compare with
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
// function createMapOfLetter(letter) {
// 	let img = Image.new("RGB", (230, 230), "white"),
// 		d = ImageDraw.Draw(img),
// 		font = ImageFont.truetype("arial.ttf", 300);
// 	d.text((15, -50), letter, (fill = (0, 0, 0)), (font = font));

// 	let pixels = img.load(),
// 		ans = [];

// 	for (let x = 0; x < 230; x++) {
// 		for (let y = 0; y < 230; y++) {
// 			if (pixels[(x, y)] == (0, 0, 0)) {
// 				if (
// 					hasNeighbourColor((255, 255, 255), pixels, x, y) &&
// 					!hasNeighbourColor((255, 0, 0), pixels, x, y)
// 				) {
// 					pixels[(x, y)] = (255, 0, 0);
// 					ans.append([x, y]);
// 				}
// 			}
// 		}
// 	}

// 	return ans;
// }

export {
	getPixelColor,
	imageDataToColorArray,
	hasNeighbourColor,
	// createMapOfLetter,
};
