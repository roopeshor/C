import { C } from "../../src/main.js";
import { axes } from "../../src/objects/coordinate_systems.js";
import { lens } from "../../src/objects/more_shapes.js";
import { initBlackboardCanvas, noFill } from "../../src/settings.js";

C(
	() => {
		initBlackboardCanvas();
		axes();
		var c1 = [-70, 0],
			r1 = 70,
			c2 = [70, 0],
			r2 = 110;
		// point(...c1);
		// point(...c2);

		noFill();
		// circle(...c1, r1);
		// circle(...c2, r2);
		lens(c1, r1, c2, r2);
	},
	".container",
	{
		width: 500,
		height: 500,
	}
);
