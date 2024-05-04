import { loadImagePromise } from "../../../src/image/image.js";
import { imageToData, replaceColorInImage } from "../../../src/image/processing.js";
import { C } from "../../../src/main.js";
import { rect } from "../../../src/objects/geometry.js";
import {
	background,
	putImageData,
	setImageSmoothing,
	translate,
} from "../../../src/settings.js";

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
		});
	},
	".container",
	{
		width: 400,
		height: 400,
	},
);
