import { C } from "../../src/main.js";
import { createWebGL } from "../../src/WebGL/webgl.js";
C(
	() => {
		let GL = createWebGL();
		window["GL"] = GL; // for debugging in console
		GL.background(0, 0, 0, 1);

		// move, rotate and scale canvas
		GL.translate(100, 150).rotate(0).scale(1, 1);

		// add some color
		GL.fill(Math.random(), Math.random(), Math.random(), 1);

		// finally draw shape "F"
		// prettier-ignore
		GL.setGeometry([
			// left column
			0, 0,  30, 0,  0, 150,
			0, 150,  30, 0,  30, 150,

			// top rung
			30, 0,  100, 0,  30, 30,
			30, 30,  100, 0,  100, 30,

			// middle rung
			30, 60,  67, 60,  30, 90,
			30, 90,  67, 60,  67, 90,
		]);
	},
	".container",
	{
		width: 400,
		height: 400,
	}
);
