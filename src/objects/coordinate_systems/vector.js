/** @module Vector */
import { colorPalettes, lerpColorArray } from "../../c.js";
import { applyDefault, type } from "../../utils.js";

export function vectorField(configs) {
	let W = parseInt(cvs.style.width)
	// extract configs
	configs = applyDefault(
		{
			originPosition: [0, 0],
			length: W, // ref length
			xRange: [-5, 5, 1],
			yRange: [-5, 5, 1],
			arrowColor: colorPalettes.Viridis,
			scalar: (mag, max) => sigmoid((mag / max) * 2 - 0.5)
		},
		configs,
	);

	if (Array.isArray(configs.unitSpace) && Array.isArray(configs.unitValue)) {

	}
	// figure out values

	// draw
}
