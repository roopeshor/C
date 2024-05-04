import { loadImagePromise } from "../../src/image/image.js";
import { imageToData, replaceColorInImage } from "../../src/image/processing.js";
import { C } from "../../src/main.js";
import { rect } from "../../src/objects/geometry.js";
import {
	background,
	putImageData,
	setImageSmoothing,
	translate,
} from "../../src/settings.js";

C(
	() => {
		const imgURL = "./images/braces.png";
		background(0);
		translate(CENTERX, CENTERY);
		setImageSmoothing(false);
		loadImagePromise(imgURL).then((img) => {
			let dat = imageToData(img, 0, 0, 400, 400);
			dat = replaceColorInImage(dat, "#fff", "#000");
			putImageData(dat, 0, 0);
			// draw grid
			let step = 100;
			for (let x = 0; x <= 400; x += step) {
				for (let y = 0; y <= 400; y += step) {
					rect(x, y, step, step);
				}
			}
		});
	},
	".container",
	{
		width: 400,
		height: 400,
	},
);
