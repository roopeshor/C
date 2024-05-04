import { Manim } from "../../../Extensions/Colors/importable.js";
import { C } from "../../../src/main.js";
import { createWebGL } from "../../../src/WebGL/webgl.js";
const { BLUE, PURPLE, RED, TEAL } = Manim;
C(
	() => {
		let GL = createWebGL();
		window["GL"] = GL; // for debugging in console
		GL.background(0, 0, 0, 1);

		// prettier-ignore
		GL.fill(RED);
		GL.lookAt([0, 0, -2]);
		// GL.perspective(Math.PI / 8, 1, 0.1, 1000);
		GL.setGeometry(
			[
				// left column
				0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

				// top rung
				30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

				// middle rung
				30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
			],
			18,
		);
		// GL.translate(100, 100);
		GL.fill(PURPLE);
		GL.fillRect(0, 0, 1, 100, 100);
		GL.translate(100, 110);
		GL.fill(TEAL);
		//prettier-ignore
		GL.triangle(
			0, 0,  1,
			100, 0,1,
			50, 50,1,
		);
		GL.stroke(BLUE);
		GL.lineWidth(1);
		GL.line(0, 0, 1, 200, -200, 1);
		// GL.cube();
	},
	".container",
	{
		width: 400,
		height: 400,
	},
);
