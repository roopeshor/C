/** @module Vector */
import { ColorPalettes } from "../../constants/color_palettes.js";
import { applyDefault } from "../../utils.js";

export function vectorField(configs) {
	let W = parseInt(cvs.style.width);
	// extract configs
	configs = applyDefault(
		{
			originPosition: [0, 0],
			length: W, // ref length
			xRange: [-5, 5, 1],
			yRange: [-5, 5, 1],
			arrowColor: ColorPalettes.Viridis,
			scalar: (mag, max) => sigmoid((mag / max) * 2 - 0.5),
		},
		configs,
	);

	if (Array.isArray(configs.unitSpace) && Array.isArray(configs.unitValue)) {
	}
	// figure out values

	// draw
}
