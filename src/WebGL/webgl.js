import { C } from "../main.js";
import { applyDefault } from "../utils.js";
import { m4 } from "./m4.js";
/**
 * Creates a WebGL instance thati include usefullkj methods to work with WebGL.
 * @param {Object} [configs] configuration for canvas. Follwoing properties are accepted:
 * @param	{boolean} [configs.deleteOld=false] whether to delete old canvas.
 * @returns {WebGL} WebGL instance
 */
function createWebGL(configs) {
	let c = C.workingContext;
	const cv = C.workingCanvas;
	configs = applyDefault(
		{
			deleteOld: false,
			dpr: Math.ceil(window.devicePixelRatio),
			width: cv.rWidth,
			height: cv.rHeight,
		},
		configs
	);
	let container = c.canvas.parentElement;
	let cvs = C.makeCanvas(configs);
	if (configs.deleteOld) {
		container.removeChild(c.canvas);
	} else {
		container.style.position = "relative";
		cvs.style.position = "absolute";
		cvs.style.top = "0";
		cvs.style.left = "0";
	}

	// attach active listeners from canvas
	for (let event in c.canvas.events) {
		cvs.addEventListener(event, c.canvas.events[event]);
	}
	container.appendChild(cvs);
	return new WebGL(cvs);
}
/**
 * Creates a new instance for drawing in webgl
 */
class WebGL {
	constructor(canvas) {
		let gl = canvas.getContext("webgl");
		if (!gl) {
			gl = canvas.getContext("experimental-webgl");
		}
		if (!gl) {
			throw new Error("WebGL is not supported");
		}
		gl.viewport(0, 0, canvas.width, canvas.height);
		// make it transparent so that standard canvas can be seen
		/** @type {WebGLRenderingContext} */
		this.gl = gl;
		/** @type {HTMLCanvasElement} */
		this.canvas = canvas;
		/** @type number */
		this.width = canvas.rWidth;
		/** @type number */
		this.height = canvas.rHeight;
		/** @type number */
		this.dpr = canvas.dpr || Math.ceil(window.devicePixelRatio);
		this.canvas = canvas;
		this.sources = {
			// one color for all vertex
			singleColor: {
				vertex: `attribute vec3 a_position;
					uniform vec2 u_resolution;
					uniform mat4 u_matrix;

					void main() {
						gl_Position = u_matrix * vec4(a_position, 1) / vec4(u_resolution, 1, 1);
					}`,
				fragment: `precision mediump float;
					uniform vec4 u_color;
					void main() {
						gl_FragColor = u_color;
					}`,
				uniforms: {
					resolution: "u_resolution",
					matrix: "u_matrix",
					vertexColor: "u_color",
				},
				attributes: {
					vertexPosition: "a_position",
				},
				program: null,
			},
			// one color for each vertex
			multiColor: {
				vertex: `attribute vec3 a_position;
					attribute vec4 aVertexColor;
					uniform vec2 u_resolution;
					uniform mat4 u_matrix;
					varying lowp vec4 vColor;
					void main() {
						gl_Position = u_matrix * vec4(a_position, 1);
						// / vec4(u_resolution, 1, 1);
						vColor = aVertexColor;
					}`,
				fragment: `precision mediump float;
					varying lowp vec4 vColor;
					void main(void) {
						gl_FragColor = vColor;
					}`,
				uniforms: {
					resolution: "u_resolution",
					matrix: "u_matrix",
				},
				attributes: {
					vertexPosition: "a_position",
					vertexColor: "aVertexColor",
				},
				program: null,
			},
		};
		for (let source in this.sources) {
			this.sources[source] = this.createCustomProgram(this.sources[source]);
		}
		/**
		 * Current using program
		 */
		this.program = this.sources.singleColor;
		gl.useProgram(this.program.program);
		/**
		 * Projection matrix
		 * @type {m4}
		 */
		this.projectionMatrix = new m4();
		/**
		 * Model/world matrix
		 * @type {m4}
		 */
		this.worldMatrix = new m4();
		/**
		 * View matrix
		 * @type {m4}
		 */
		this.viewMatrix = new m4();
		/**
		 * Composition of all matricies
		 * @type {m4}
		 */
		this.matrix = new m4();
		// set the resolution
		gl.uniform2f(
			this.program.uniforms.resolution,
			canvas.width / 2 / this.dpr,
			canvas.height / 2 / this.dpr
		);
		this.styles = {
			/** Color to fill inside the shape */
			fillColor: [1, 0, 1, 1],
			/** Color given to the border of shape &  for lines */
			strokeColor: [1, 1, 0, 1],
			/** Width of line */
			lineWidth: 1,
		};
	}
	useProgram(program) {
		if (this.sources[program]) {
			this.program = this.sources[program];
			this.gl.useProgram(this.program.program);
			this.gl.uniform2f(
				this.program.uniforms.resolution,
				this.canvas.width / 2 / this.dpr,
				this.canvas.height / 2 / this.dpr
			);
		} else if (program.program) {
			this.program = program;
			this.gl.useProgram(program.program);
		} else {
			throw new Error(`${program} not fouund`);
		}
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
		const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
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
	putProperties() {
		let gl = this.gl,
			numComponents = 3,
			type = gl.FLOAT,
			normalize = false,
			stride = 0,
			offset = 0;
		const positionBuffer = gl.createBuffer();
		// Select the positionBuffer as the one to apply buffer
		// operations to from here out.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.vertexAttribPointer(
			this.program.attributes.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset
		);
		gl.enableVertexAttribArray(this.program.attributes.vertexPosition);
		// Tell WebGL how to pull out the colors from the color buffer
		// into the vertexColor attribute.
		numComponents = 4;
		type = gl.FLOAT;
		normalize = false;
		stride = 0;
		offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.program.uniforms.vertexColor);
		gl.vertexAttribPointer(
			this.program.uniforms.vertexColor,
			numComponents,
			type,
			normalize,
			stride,
			offset
		);
	}

	/**
	 * Creates a custom program from sources and retuns program and variables
	 * @param {Object} program program that contains shader sources and variables of shaders
	 * @param {string|HTMLScriptElement} program.vertex vertex shader program
	 * @param {string|HTMLScriptElement} program.fragment fragment shader program
	 * @param {Object.<string,string>} program.uniforms uniform variables of program. format: {uniformName: name_in_shader}
	 * @param {Object.<string,string>} program.attributes attributes of program. format: {attrName: name_in_shader}
	 */
	createCustomProgram(program) {
		let gl = this.gl,
			uniforms = {},
			attributes = {},
			program_;

		if (program.vertex instanceof HTMLScriptElement) {
			program.vertex = program.vertex.textContent.trim();
		}
		if (program.fragment instanceof HTMLScriptElement) {
			program.fragment = program.fragment.textContent.trim();
		}
		program_ = this.createProgramFromSource(program.vertex, program.fragment);
		for (let attr in program.attributes) {
			let nameInProgram = program.attributes[attr];
			attributes[attr] = gl.getAttribLocation(program_, nameInProgram);
			// gl.enableVertexAttribArray(src[attr]); // TODO: should all attributes be enabled?
		}
		for (let uniform in program.uniforms) {
			let nameInProgram = program.uniforms[uniform];
			uniforms[uniform] = gl.getUniformLocation(program_, nameInProgram);
		}
		return {
			program: program_,
			uniforms: uniforms,
			attributes: attributes,
			vertex: program.vertex,
			fragment: program.fragment,
		};
	}

	attribUsage(
		position,
		components = 3,
		type = this.gl.FLOAT,
		normalize = false,
		stride = 0,
		offset = 0
	) {
		this.gl.enableVertexAttribArray(position);
		this.gl.vertexAttribPointer(
			position, // position of attribute
			components, // components to pull per iteration
			type, // type of the data
			normalize, // whether normalize the data
			stride, // 0 = move forward size * sizeof(type) each iteration to get the next position
			offset // where to start
		);
	}
}
export { createWebGL, WebGL };
