import { readColor } from "../color/color_reader.js";
import { m4 } from "./m4.js";
import { WebGL } from "./webgl.js";

function readPoints(points, count) {
	let pts = [],
		is2D = false;
	if (points.length % count == 0) {
		// 2d point array. Convert it to 3d point array
		if (points.length / count == 2) {
			is2D = true;
			for (let i = 0; i < points.length; i += 2)
				pts.push(points[i], points[i + 1], 0);
		} else pts = points;
	} else {
		throw Error("excess component in points");
	}
	return [pts, is2D];
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
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	return this;
};

/**
 * clears canvas
 * @returns {WebGL}
 */
WebGL.prototype.clear = function () {
	this.background(0, 0, 0, 0);
	return this;
};

WebGL.prototype.putBufferData = function (
	data,
	type = this.gl.ARRAY_BUFFER,
	usage = this.gl.STATIC_DRAW,
) {
	// Create a buffer to put stuffs in
	var buffer = this.gl.createBuffer();
	this.gl.bindBuffer(type, buffer);
	this.gl.bufferData(type, new Float32Array(data), usage);
	return buffer;
};

/**
 * sets geometry of a objevt in buffer
 * @param {number[]} data data of positions to set
 * @param {number} [count=3] number of vertices to set
 * @param {number} [offset=0] offset of data to set
 * @param {number} [primitiveType=WebGLRenderingContext.TRIANGLES] type of primitive to draw
 * @param {number} [bufferTarget=WebGLRenderingContext.ARRAY_BUFFER] target buffer to set data to
 * @param {number} [bufferUsage=WebGLRenderingContext.STATIC_DRAW] usage type of buffer
 * @returns {WebGL}
 */
WebGL.prototype.setGeometry = function (
	data,
	count = 3,
	offset = 0,
	primitiveType = this.gl.TRIANGLES,
	bufferTarget = this.gl.ARRAY_BUFFER,
	bufferUsage = this.gl.STATIC_DRAW,
) {
	let gl = this.gl,
		program = this.program;

	// Create and bind a buffer to put positions of points in

	this.computeMatrix();
	gl.uniformMatrix4fv(program.uniforms.matrix, false, this.matrix.mat);

	// set the color
	gl.uniform4fv(program.uniforms.vertexColor, this.styles.fillColor);

	this.putBufferData(readPoints(data, count)[0]);
	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	gl.enableVertexAttribArray(program.attributes.vertexPosition);
	gl.vertexAttribPointer(
		program.attributes.vertexPosition, // position of position attribute
		3, // pull 3 components per iteration
		gl.FLOAT, // type of the data is 32bit floats
		false, // don't normalize the data
		0, // 0 = move forward size * sizeof(type) each iteration to get the next position
		0, // start at the beginning of the buffer
	);
	// Draw the geometry.
	gl.drawArrays(primitiveType, offset, count);
	return this;
};

WebGL.prototype.computeMatrix = function () {
	// Multiplies all matrix
	// this.matrix = this.worldMatrix.clone();
	// this.matrix.multiply(this.projectionMatrix).multiply(this.viewMatrix);
	this.matrix = this.projectionMatrix.clone();
	this.matrix.multiply(this.viewMatrix).multiply(this.worldMatrix);
};

WebGL.prototype.line = function () {
	let [points, is2D] = readPoints(arguments, 2);

	// use gl.LINE to draw lines with width of 1px
	const fill = this.styles.fillColor;
	this.styles.fillColor = this.styles.strokeColor;
	if (this.styles.lineWidth == 1) {
		this.setGeometry(points, 2, 0, this.gl.LINES);
	} else if (is2D) {
		let x1 = points[0],
			y1 = points[1],
			x2 = points[3],
			y2 = points[4];
		let angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
		let lw = this.styles.lineWidth / 2;
		let dx = Math.cos(angle) * lw;
		let dy = Math.sin(angle) * lw;
		this.setGeometry(
			[
				x1 - dx,
				y1 - dy,
				0,
				x1 + dx,
				y1 + dy,
				0,
				x2 + dx,
				y2 + dy,
				0,

				x2 + dx,
				y2 + dy,
				0,
				x2 - dx,
				y2 - dy,
				0,
				x1 - dx,
				y1 - dy,
				0,
			],
			6,
		);
	}
	this.styles.fillColor = fill;
	return this;
};

/**
 * rotates canvas by a given angle around x-axis.
 * @param {number} angle angle to rotate by
 * @returns {WebGL}
 */
WebGL.prototype.rotateX = function (angle) {
	this.worldMatrix.rotateX(angle);
	return this;
};

/**
 * rotates canvas by a given angle around y-axis.
 * @param {number} angle angle to rotate by
 * @returns {WebGL}
 */
WebGL.prototype.rotateY = function (angle) {
	this.worldMatrix.rotateY(angle);
	return this;
};

/**
 * rotates canvas by a given angle around z-axis.
 * @param {number} angle angle to rotate by
 * @returns {WebGL}
 */
WebGL.prototype.rotateZ = function (angle) {
	this.worldMatrix.rotateZ(angle);
	return this;
};

/**
 * Translate canvas by a given vector by multiplying current matrix by a translation matrix
 * @param {number} x x value of vector
 * @param {number} [y=0] y value of vector
 * @returns {WebGL}
 */
WebGL.prototype.translate = function (x, y = 0, z = 0) {
	this.worldMatrix.translate(x, y, z);
	return this;
};

/**
 * Scales canvas by given x, y,z factors
 */
WebGL.prototype.scale = function (x, y = x, z = 1) {
	this.worldMatrix.scale(x, y, z);
	return this;
};

/**
 *
 * @param  {...number|string|number[]} color
 */
WebGL.prototype.fill = function (...color) {
	let c = readColor(color).rgbaA;
	this.styles.fillColor = [c[0] / 255, c[1] / 255, c[2] / 255, c[3]];
};

/**
 * Draws a rectangle
 */
WebGL.prototype.fillRect = function () {
	let x,
		y,
		z,
		w,
		h,
		i = 0;
	(x = arguments[i++]), (y = arguments[i++]);
	// if there is no z component in position, let z = 0
	if (arguments.length == 4) z = 0;
	else z = arguments[i++];
	w = arguments[i++];
	h = arguments[i++];
	// prettier-ignore
	this.setGeometry([
		x, y, z,
		x + w, y, z,
		x + w, y + h, z,

		x + w, y + h, z,
		x, y + h, z,
		x, y, z
	], 6);
};

/**
 * Draws a triangle
 */
WebGL.prototype.triangle = function (...points) {
	this.setGeometry(points, 3);
};

WebGL.prototype.lineWidth = function (w) {
	this.styles.lineWidth = w;
};

/**
 *
 * @param  {...number|string|number[]} color
 */
WebGL.prototype.stroke = function (...color) {
	let c = readColor(color).rgbaA;
	this.styles.strokeColor = [c[0] / 255, c[1] / 255, c[2] / 255, c[3]];
};

WebGL.prototype.cube = function (size = 200) {
	var cubeRotation = 0.0;
	let gl = this.gl;
	// prettier-ignore
	const positions = [
    // Front face
    -1.0 * size, -1.0 * size,  1.0 * size,
     1.0 * size, -1.0 * size,  1.0 * size,
     1.0 * size,  1.0 * size,  1.0 * size,
    -1.0 * size,  1.0 * size,  1.0 * size,

    // Back face
    -1.0 * size, -1.0 * size, -1.0 * size,
    -1.0 * size,  1.0 * size, -1.0 * size,
     1.0 * size,  1.0 * size, -1.0 * size,
     1.0 * size, -1.0 * size, -1.0 * size,

    // Top face
    -1.0 * size,  1.0 * size, -1.0 * size,
    -1.0 * size,  1.0 * size,  1.0 * size,
     1.0 * size,  1.0 * size,  1.0 * size,
     1.0 * size,  1.0 * size, -1.0 * size,

    // Bottom face
    -1.0 * size, -1.0 * size, -1.0 * size,
     1.0 * size, -1.0 * size, -1.0 * size,
     1.0 * size, -1.0 * size,  1.0 * size,
    -1.0 * size, -1.0 * size,  1.0 * size,

    // Right face
     1.0 * size, -1.0 * size, -1.0 * size,
     1.0 * size,  1.0 * size, -1.0 * size,
     1.0 * size,  1.0 * size,  1.0 * size,
     1.0 * size, -1.0 * size,  1.0 * size,

    // Left face
    -1.0 * size, -1.0 * size, -1.0 * size,
    -1.0 * size, -1.0 * size,  1.0 * size,
    -1.0 * size,  1.0 * size,  1.0 * size,
    -1.0 * size,  1.0 * size, -1.0 * size,
  ];
	// create bind and buffer data. that's all
	const positionBuffer = this.putBufferData(positions);

	// Now set up the colors for the faces
	const faceColors = [
		[1.0, 1.0, 1.0, 1.0], // Front face: white
		[1.0, 0.0, 0.0, 1.0], // Back face: red
		[0.0, 1.0, 0.0, 1.0], // Top face: green
		[0.0, 0.0, 1.0, 1.0], // Bottom face: blue
		[1.0, 1.0, 0.0, 1.0], // Right face: yellow
		[1.0, 0.0, 1.0, 1.0], // Left face: purple
	];

	// Convert the array of colors into a table for all the vertices.
	var colors = [];

	for (var j = 0; j < faceColors.length; ++j) {
		const c = faceColors[j];
		// Repeat each color four times for the four vertices of the face
		colors = colors.concat(c, c, c, c);
	}

	const colorBuffer = this.putBufferData(colors);

	/* Build the element array buffer; this specifies the indices
	 into the vertex arrays for each face's vertices.
	 This array defines each face as two triangles, using the
	 indices into the vertex array to specify each triangle's position. */
	// prettier-ignore
	const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];
	const indexBuffer = this.putBufferData(indices, gl.ELEMENT_ARRAY_BUFFER);

	gl.enable(gl.DEPTH_TEST); // Enable depth testing
	gl.depthFunc(gl.LEQUAL); // Near things obscure far things

	/* Create a perspective matrix, a special matrix that is
	 used to simulate the distortion of perspective in a camera.
	 Our field of view is 45 degrees, with a width/height
	 ratio that matches the display size of the canvas
	 and we only want to see objects between 0.1 units
	 and 100 units away from the camera. */

	const fieldOfView = (45 * Math.PI) / 180; // in radians
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;

	// as the destination to receive the result.
	m4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);

	// Now move the drawing position a bit to where we want to
	// start drawing the square.

	this.worldMatrix.translate(-0.0, 0.0, -6.0); // amount to translate
	this.worldMatrix.rotateZ(cubeRotation);
	this.worldMatrix.rotateX(cubeRotation * 0.7);

	// Tell WebGL how to pull out the positions from the position
	// buffer into the vertexPosition attribute
	gl.vertexAttribPointer(
		this.program.attributes.vertexPosition,
		3, // numComponents
		gl.FLOAT, // type
		false, // normalize
		0, // stride
		0, // offset
	);
	gl.enableVertexAttribArray(this.program.attributes.vertexPosition);

	// Tell WebGL how to pull out the colors from the color buffer
	// into the vertexColor attribute.
	gl.vertexAttribPointer(
		this.program.uniforms.vertexColor,
		4, // numComponents
		gl.FLOAT, // type
		false, // normalize
		0, // stride
		0, // offset
	);

	// Tell WebGL which indices to use to index the vertices
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	// Tell WebGL to use our program when drawing
	this.useProgram("multiColor");
	// gl.useProgram(this.program.program);

	// Set the shader uniforms
	this.computeMatrix();
	gl.uniformMatrix4fv(this.program.uniforms.matrix, false, this.matrix.mat);
	{
		const vertexCount = 36;
		const type = gl.UNSIGNED_SHORT;
		const offset = 0;
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	}
};

WebGL.prototype.lookAt = function (eye, center = [0, 0, 0], up = [0, 1, 0]) {
	this.viewMatrix = m4.lookAt(eye, center, up);
};

WebGL.prototype.perspective = function (fov, aspect, near, far) {
	m4.perspective(this.projectionMatrix, fov, aspect, near, far);
	// this.computeMatrix();
};
