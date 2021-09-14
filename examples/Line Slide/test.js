import { C } from "../../src/main.js";
import { line } from "../../src/objects/geometry.js";
import { initBlackboardCanvas, stroke } from "../../src/settings.js";


C(
	function () {
		initBlackboardCanvas();
		line(-200, 0, 200, 0);
		line(0, 150, 0, -150);

		stroke("orange");
		line(0, 0, -150, 80);
	}, ".container",
	{
		width: 400,
		height: 300
	}
);
