import { C } from "../../src/main.js";
import {createWebGL} from "../../src/WebGL/webgl.js";

C(() => {
	let ctx = C.getCanvas();
	line(0, 0, 100, 100);
	let gl = createWebGL();

}, ".container", {
	width: 400,
	height: 400,
});
