import { C } from "../main.js";
import { applyDefault } from "../utils.js";

/**
 * Creates a WebGL instance
 * @param	{object} configs configuration for canvas. Follwoing properties are accepted:
 * @param	{boolean} [configs.deleteOld=false] whether to delete old canvas.
 *
 */
function createWebGL(configs) {
	let c = C.workingCanvas;
	configs = applyDefault(
		{
			deleteOld: false,
			dpr: c.dpr,
			width: c.width,
			height: c.height,
		},
		configs
	);
	let container = c.container;
	let cvs = C.makeCanvas(configs);
	container.append(cvs);
	cvs.style.transform = "translate(0, -100%)";
	return bindGLToFunctions(cvs);
}

function bindGLToFunctions(c) {
	let gl = c.getContext("webgl");
	if (!gl) {
		gl = c.getContext("experimental-webgl");
	}
	if (!gl) {
		console.error("WebGL is not supported");
		return null;
	}
	gl.viewport(0, 0, c.width, c.height);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	let G = Object.clone(GLFunctions);
	G.gl = gl;
	return G;
}

const GLFunctions = {
	foo: 2
};

export { createWebGL, bindGLToFunctions };
