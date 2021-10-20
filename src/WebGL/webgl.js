import { C } from "../main.js";
import { applyDefault } from "../utils.js";
import { m3 } from "./m3.js";

/**
 * Creates a WebGL instance thati include useful methods to work with WebGL.
 * @param	{object} configs configuration for canvas. Follwoing properties are accepted:
 * @param	{boolean} [configs.deleteOld=false] whether to delete old canvas.
 * @returns {WebGL} WebGL instance
 */
function createWebGL(configs) {
	let c = C.workingCanvas;
	configs = applyDefault(
		{
			deleteOld: true,
			dpr: c.dpr,
			width: c.width,
			height: c.height,
		},
		configs
	);
	let container = c.container;
	if (configs.deleteOld) container.removeChild(c.canvas);
	let cvs = C.makeCanvas(configs);
	container.append(cvs);
	return new WebGL(cvs);
}

/**
 * Creates a new instance for drawing in webgl
 * @param {HTMLCanvasElement} canvas canvas element
 * @class
 */
class WebGL {
	/** @type {WebGLRenderingContext} */
	gl;
	/** @type {HTMLCanvasElement} */
	canvas;
	/** @type {number} */
	width;
	/** @type {number} */
	height;
	/** @type {number} */
	dpr;
	/**
	 * Current using program
	 * @type {WebGLProgram} */
	program;

	/**
	 * Projection matrix used for drawing
	 * @type {number[]}
	 */
	// prettier-ignore
	projectionMatrix = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ];

	/**
	 * Color to fill inside the shape
	 * @type {number[]}
	 */
	fillColor = [0, 0, 0, 1];

	/**
	 *
	 * @param {HTMLCanvasElement} canvas
	 * @returns {this}
	 */
	constructor(canvas) {
		let gl = canvas.getContext("webgl");
		if (!gl) {
			gl = canvas.getContext("experimental-webgl");
		}
		if (!gl) {
			console.error("WebGL is not supported");
			return null;
		}
		gl.viewport(0, 0, canvas.width, canvas.height);

		// make it transparent so that standard canvas can be seen

		this.gl = gl;
		this.canvas = canvas;
		this.width = canvas.width;
		this.height = canvas.height;
		this.dpr = canvas.dpr;
		const sources = {
			default: {
				vertex: `attribute vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

void main() {
  // Multiply the position by the matrix.
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;

  // convert from pixels to -1->+1 (clipspace)
  vec2 clipSpace = position / u_resolution * 2.0 - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}`,
				fragment: `precision mediump float;
uniform vec4 u_color;
void main() {
   gl_FragColor = u_color;
}`,
				uniforms: {
					resolution: "u_resolution",
					matrix: "u_matrix",
					color: "u_color",
				},
				attribs: { position: "a_position" },
			},
		};

		for (let source in sources) {
			let src = sources[source];
			src.program = this.createProgramFromSource(src.vertex, src.fragment);

			let obj = {};
			for (let attr in src.attribs) {
				let nameInProgram = src.attribs[attr];
				obj[attr] = this.gl.getAttribLocation(src.program, nameInProgram);

				// enable vertex attrib array
				this.gl.enableVertexAttribArray(obj[attr]);
			}
			src.attribs = obj;

			obj = {};
			for (let uniform in src.uniforms) {
				let nameInProgram = src.uniforms[uniform];
				obj[uniform] = this.gl.getUniformLocation(src.program, nameInProgram);
			}
			src.uniforms = obj;
		}

		this.program = sources.default;
		gl.useProgram(this.program.program);

		// set the resolution
		this.gl.uniform2f(
			this.program.uniforms.resolution,
			canvas.width,
			canvas.height
		);
	}

	/**
	 * Returns a shader from given source and type
	 * @param {number} type either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
	 * @param {string} source source code of shader
	 * @returns {WebGLShader} shader
	 */
	createShader(type, source) {
		const shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.error(this.gl.getShaderInfoLog(shader));
			this.gl.deleteShader(shader);
			return null;
		}
		return shader;
	}
	/**
	 * creates a program from given shaders
	 * @param {WebGLShader} vertexShader
	 * @param {WebGLShader} fragmentShader
	 * @returns {WebGLProgram}
	 */
	createProgram(vertexShader, fragmentShader) {
		const program = this.gl.createProgram();
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);
		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			console.error(this.gl.getProgramInfoLog(program));
			this.gl.deleteProgram(program);
			return null;
		}
		return program;
	}
	/**
	 * Creates program from given vertex and fragment shader source
	 * @param {string} vertexShaderSource
	 * @param {string} fragmentShaderSource
	 * @returns {WebGLProgram}
	 */
	createProgramFromSource(vertexShaderSource, fragmentShaderSource) {
		const vertexShader = this.createShader(
			this.gl.VERTEX_SHADER,
			vertexShaderSource
		);
		const fragmentShader = this.createShader(
			this.gl.FRAGMENT_SHADER,
			fragmentShaderSource
		);
		return this.createProgram(vertexShader, fragmentShader);
	}
	resizeCanvas(width = 300, height = 300) {
		// Lookup the size the browser is displaying the canvas in CSS pixels.
		const dpr = window.devicePixelRatio;
		const displayWidth = Math.round(width * dpr);
		const displayHeight = Math.round(height * dpr);

		// Make the canvas the same size
		this.canvas.style.width = width + "px";
		this.canvas.style.height = height + "px";
		this.canvas.width = displayWidth;
		this.canvas.height = displayHeight;
	}
}

/**
 * clears the canvas using given color
 * @param {number} r red value
 * @param {number} g green value
 * @param {number} b blue value
 * @param {number} a alpha value
 */
WebGL.prototype.background = function (r, g, b, a) {
	this.gl.clearColor(r, g, b, a);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	return this;
};

/**
 * clears canvas
 * @returns {this}
 */
WebGL.prototype.clear = function () {
	this.background(0, 0, 0, 0);
	return this;
};

WebGL.prototype.bindNewBuffer = function (type = this.gl.ARRAY_BUFFER) {
	// Create a buffer to put stuffs in
	var buffer = this.gl.createBuffer();
	this.gl.bindBuffer(type, buffer);
	return buffer;
};

/**
 * sets geometry of a objevt in buffer
 * @param {number[]} data data of positions to set
 * @param {*} target
 * @param {*} usage
 * @returns {this}
 */
WebGL.prototype.setGeometry = function (
	data,
	target = this.gl.ARRAY_BUFFER,
	usage = this.gl.STATIC_DRAW
) {
	let gl = this.gl,
		program = this.program;

	// Create and bind a buffer to put positions of points in
	this.bindNewBuffer();

	gl.bufferData(target, new Float32Array(data), usage);
	// Set the matrix.
	gl.uniformMatrix3fv(program.uniforms.matrix, false, this.projectionMatrix);

	// set the color
	gl.uniform4fv(program.uniforms.color, this.fillColor);

	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	gl.vertexAttribPointer(
		program.attribs.position, // position of position attribute
		2, // pull 2 components per iteration
		gl.FLOAT, // type of the data is 32bit floats
		false, // don't normalize the data
		0, // 0 = move forward size * sizeof(type) each iteration to get the next position
		0 // start at the beginning of the buffer
	);

	// Draw the geometry.
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 18; // 6 triangles in the 'F', 3 points per triangle
	gl.drawArrays(primitiveType, offset, count);
	return this;
};

/**
 * rotates canvas by a given angle.
 * Multiplies current matrix by a rotation matrix
 * @param {number} angle angle to rotate by
 * @returns {this}
 */
WebGL.prototype.rotate = function (angle) {
	m3.rotate(this.projectionMatrix, angle);
	return this;
};

/**
 * Translate canvas by a given vector by multiplying current matrix by a translation matrix
 * @param {number} x x value of vector
 * @param {number} y y value of vector
 * @returns {this}
 */
WebGL.prototype.translate = function (x, y) {
	m3.translate(this.projectionMatrix, x, y);
	return this;
};

/**
 * Scales canvas by given x, y factors
 */
WebGL.prototype.scale = function (x, y) {
	m3.scale(this.projectionMatrix, x, y);
	return this;
};

WebGL.prototype.fill = function (r, g, b, a) {
	this.fillColor = [r, g, b, a];
};
export { createWebGL, WebGL };
