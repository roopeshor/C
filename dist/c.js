(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.m4 = void 0;
/**
 *
 * @returns {Float32Array}
 */
function readMatrix(args) {
  let mat;
  if (Array.isArray(args[0]) && args[0].length == 16) mat = args[0];else if (args.length == 16) mat = args;else if (args[0] instanceof m4) mat = args[0].mat;else mat = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  return new Float32Array(mat);
}
const EPSILON = 0.000001;
class m4 {
  /**
   * Returns a 4x4 Float32Array and functions to modify them
   * @param {...number|number[]|m4|Float32Array} [array] of numbers
   */
  constructor(array) {
    this.mat = readMatrix(arguments);
    return this;
  }
  /**
   * Multiplies a matrix by this
   * from p5.js
   * @param {...number|number[]|m4} mat matrix
   */
  multiply(mat) {
    let m = readMatrix(arguments);

    // each row is used for the multiplier
    let b0 = this.mat[0],
      b1 = this.mat[1],
      b2 = this.mat[2],
      b3 = this.mat[3];
    this.mat[0] = b0 * m[0] + b1 * m[4] + b2 * m[8] + b3 * m[12];
    this.mat[1] = b0 * m[1] + b1 * m[5] + b2 * m[9] + b3 * m[13];
    this.mat[2] = b0 * m[2] + b1 * m[6] + b2 * m[10] + b3 * m[14];
    this.mat[3] = b0 * m[3] + b1 * m[7] + b2 * m[11] + b3 * m[15];
    b0 = this.mat[4];
    b1 = this.mat[5];
    b2 = this.mat[6];
    b3 = this.mat[7];
    this.mat[4] = b0 * m[0] + b1 * m[4] + b2 * m[8] + b3 * m[12];
    this.mat[5] = b0 * m[1] + b1 * m[5] + b2 * m[9] + b3 * m[13];
    this.mat[6] = b0 * m[2] + b1 * m[6] + b2 * m[10] + b3 * m[14];
    this.mat[7] = b0 * m[3] + b1 * m[7] + b2 * m[11] + b3 * m[15];
    b0 = this.mat[8];
    b1 = this.mat[9];
    b2 = this.mat[10];
    b3 = this.mat[11];
    this.mat[8] = b0 * m[0] + b1 * m[4] + b2 * m[8] + b3 * m[12];
    this.mat[9] = b0 * m[1] + b1 * m[5] + b2 * m[9] + b3 * m[13];
    this.mat[10] = b0 * m[2] + b1 * m[6] + b2 * m[10] + b3 * m[14];
    this.mat[11] = b0 * m[3] + b1 * m[7] + b2 * m[11] + b3 * m[15];
    b0 = this.mat[12];
    b1 = this.mat[13];
    b2 = this.mat[14];
    b3 = this.mat[15];
    this.mat[12] = b0 * m[0] + b1 * m[4] + b2 * m[8] + b3 * m[12];
    this.mat[13] = b0 * m[1] + b1 * m[5] + b2 * m[9] + b3 * m[13];
    this.mat[14] = b0 * m[2] + b1 * m[6] + b2 * m[10] + b3 * m[14];
    this.mat[15] = b0 * m[3] + b1 * m[7] + b2 * m[11] + b3 * m[15];
    return this;
  }

  /**
   * Rotate our Matrix around an axis by the given angle.
   * @param {number} a The angle of rotation in radians
   * @param {number|number[]} x  the axis to rotate around
   * adapted by p5js's p5.Matrix rotation
   */
  rotate(a, x, y, z) {
    if (x instanceof Array) {
      // x is an array, extract the components from it.
      y = x[1];
      z = x[2];
      x = x[0]; //must be last
    }
    const len = Math.sqrt(x * x + y * y + z * z);
    x *= 1 / len;
    y *= 1 / len;
    z *= 1 / len;
    const a00 = this.mat[0],
      a01 = this.mat[1],
      a02 = this.mat[2],
      a03 = this.mat[3],
      a10 = this.mat[4],
      a11 = this.mat[5],
      a12 = this.mat[6],
      a13 = this.mat[7],
      a20 = this.mat[8],
      a21 = this.mat[9],
      a22 = this.mat[10],
      a23 = this.mat[11];

    //sin,cos, and tan of respective angle
    const sA = Math.sin(a),
      cA = Math.cos(a),
      tA = 1 - cA,
      // Construct the elements of the rotation matrix
      b00 = x * x * tA + cA,
      b01 = y * x * tA + z * sA,
      b02 = z * x * tA - y * sA,
      b10 = x * y * tA - z * sA,
      b11 = y * y * tA + cA,
      b12 = z * y * tA + x * sA,
      b20 = x * z * tA + y * sA,
      b21 = y * z * tA - x * sA,
      b22 = z * z * tA + cA;

    // rotation-specific matrix multiplication
    this.mat[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this.mat[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this.mat[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this.mat[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this.mat[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this.mat[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this.mat[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this.mat[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this.mat[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this.mat[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this.mat[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this.mat[11] = a03 * b20 + a13 * b21 + a23 * b22;
    return this;
  }
  scale(x, y, z) {
    if (x instanceof Array) {
      // x is an array, extract the components from it.
      y = x[1];
      z = x[2];
      x = x[0];
    }
    this.mat[0] *= x;
    this.mat[1] *= x;
    this.mat[2] *= x;
    this.mat[3] *= x;
    this.mat[4] *= y;
    this.mat[5] *= y;
    this.mat[6] *= y;
    this.mat[7] *= y;
    this.mat[8] *= z;
    this.mat[9] *= z;
    this.mat[10] *= z;
    this.mat[11] *= z;
    return this;
  }
  rotateX(a) {
    this.rotate(a, 1, 0, 0);
    return this;
  }
  rotateY(a) {
    this.rotate(a, 0, 1, 0);
    return this;
  }
  rotateZ(a) {
    this.rotate(a, 0, 0, 1);
    return this;
  }
  translate(x, y, z = 0) {
    this.mat[12] += this.mat[0] * x + this.mat[4] * y + this.mat[8] * z;
    this.mat[13] += this.mat[1] * x + this.mat[5] * y + this.mat[9] * z;
    this.mat[14] += this.mat[2] * x + this.mat[6] * y + this.mat[10] * z;
    this.mat[15] += this.mat[3] * x + this.mat[7] * y + this.mat[11] * z;
    return this;
  }
  clone() {
    let mat = [];
    for (let i = 0; i < this.mat.length; i++) mat.push(this.mat[i]);
    return new m4(mat);
  }
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
   *
   * @param {number[]} eye Position of the viewer
   * @param {number[]} center Point the viewer is looking at
   * @param {number[]} up vec3 pointing up
   * @returns {m4}
   */
  static lookAt(eye, center, up) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye[0];
    let eyey = eye[1];
    let eyez = eye[2];
    let upx = up[0];
    let upy = up[1];
    let upz = up[2];
    let centerx = center[0];
    let centery = center[1];
    let centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return m4.identity();
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
    let mat = new Float32Array(16);
    mat[0] = x0;
    mat[1] = y0;
    mat[2] = z0;
    mat[3] = 0;
    mat[4] = x1;
    mat[5] = y1;
    mat[6] = z1;
    mat[7] = 0;
    mat[8] = x2;
    mat[9] = y2;
    mat[10] = z2;
    mat[11] = 0;
    mat[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    mat[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    mat[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    mat[15] = 1;
    return new m4(mat);
  }

  /**
   * Returns a identity matrix.
   * @returns {m4}
   */
  static identity() {
    return new m4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   *
   * @param {m4} mat mat4 frustum matrix will be written into
   * @param {number} fovy Vertical field of view in radians
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum, can be null or Infinity
   * @returns {m4} mat
   */
  static perspective(mat, fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    let out = mat.mat;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return mat;
  }
}
exports.m4 = m4;

},{}],2:[function(require,module,exports){
"use strict";

var _color_reader = require("../color/color_reader.js");
var _m = require("./m4.js");
var _webgl = require("./webgl.js");
function readPoints(points, count) {
  let pts = [],
    is2D = false;
  if (points.length % count == 0) {
    // 2d point array. Convert it to 3d point array
    if (points.length / count == 2) {
      is2D = true;
      for (let i = 0; i < points.length; i += 2) pts.push(points[i], points[i + 1], 0);
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
_webgl.WebGL.prototype.background = function (r, g, b, a) {
  this.gl.clearColor(r, g, b, a);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  return this;
};

/**
 * clears canvas
 * @returns {WebGL}
 */
_webgl.WebGL.prototype.clear = function () {
  this.background(0, 0, 0, 0);
  return this;
};
_webgl.WebGL.prototype.putBufferData = function (data, type = this.gl.ARRAY_BUFFER, usage = this.gl.STATIC_DRAW) {
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
_webgl.WebGL.prototype.setGeometry = function (data, count = 3, offset = 0, primitiveType = this.gl.TRIANGLES, bufferTarget = this.gl.ARRAY_BUFFER, bufferUsage = this.gl.STATIC_DRAW) {
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
  gl.vertexAttribPointer(program.attributes.vertexPosition,
  // position of position attribute
  3,
  // pull 3 components per iteration
  gl.FLOAT,
  // type of the data is 32bit floats
  false,
  // don't normalize the data
  0,
  // 0 = move forward size * sizeof(type) each iteration to get the next position
  0 // start at the beginning of the buffer
  );
  // Draw the geometry.
  gl.drawArrays(primitiveType, offset, count);
  return this;
};
_webgl.WebGL.prototype.computeMatrix = function () {
  // Multiplies all matrix
  // this.matrix = this.worldMatrix.clone();
  // this.matrix.multiply(this.projectionMatrix).multiply(this.viewMatrix);
  this.matrix = this.projectionMatrix.clone();
  this.matrix.multiply(this.viewMatrix).multiply(this.worldMatrix);
};
_webgl.WebGL.prototype.line = function () {
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
    this.setGeometry([x1 - dx, y1 - dy, 0, x1 + dx, y1 + dy, 0, x2 + dx, y2 + dy, 0, x2 + dx, y2 + dy, 0, x2 - dx, y2 - dy, 0, x1 - dx, y1 - dy, 0], 6);
  }
  this.styles.fillColor = fill;
  return this;
};

/**
 * rotates canvas by a given angle around x-axis.
 * @param {number} angle angle to rotate by
 * @returns {WebGL}
 */
_webgl.WebGL.prototype.rotateX = function (angle) {
  this.worldMatrix.rotateX(angle);
  return this;
};

/**
 * rotates canvas by a given angle around y-axis.
 * @param {number} angle angle to rotate by
 * @returns {WebGL}
 */
_webgl.WebGL.prototype.rotateY = function (angle) {
  this.worldMatrix.rotateY(angle);
  return this;
};

/**
 * rotates canvas by a given angle around z-axis.
 * @param {number} angle angle to rotate by
 * @returns {WebGL}
 */
_webgl.WebGL.prototype.rotateZ = function (angle) {
  this.worldMatrix.rotateZ(angle);
  return this;
};

/**
 * Translate canvas by a given vector by multiplying current matrix by a translation matrix
 * @param {number} x x value of vector
 * @param {number} [y=0] y value of vector
 * @returns {WebGL}
 */
_webgl.WebGL.prototype.translate = function (x, y = 0, z = 0) {
  this.worldMatrix.translate(x, y, z);
  return this;
};

/**
 * Scales canvas by given x, y,z factors
 */
_webgl.WebGL.prototype.scale = function (x, y = x, z = 1) {
  this.worldMatrix.scale(x, y, z);
  return this;
};

/**
 *
 * @param  {...number|string|number[]} color
 */
_webgl.WebGL.prototype.fill = function (...color) {
  let c = (0, _color_reader.readColor)(color).rgbaA;
  this.styles.fillColor = [c[0] / 255, c[1] / 255, c[2] / 255, c[3]];
};

/**
 * Draws a rectangle
 */
_webgl.WebGL.prototype.fillRect = function () {
  let x,
    y,
    z,
    w,
    h,
    i = 0;
  x = arguments[i++], y = arguments[i++];
  // if there is no z component in position, let z = 0
  if (arguments.length == 4) z = 0;else z = arguments[i++];
  w = arguments[i++];
  h = arguments[i++];
  // prettier-ignore
  this.setGeometry([x, y, z, x + w, y, z, x + w, y + h, z, x + w, y + h, z, x, y + h, z, x, y, z], 6);
};

/**
 * Draws a triangle
 */
_webgl.WebGL.prototype.triangle = function (...points) {
  this.setGeometry(points, 3);
};
_webgl.WebGL.prototype.lineWidth = function (w) {
  this.styles.lineWidth = w;
};

/**
 *
 * @param  {...number|string|number[]} color
 */
_webgl.WebGL.prototype.stroke = function (...color) {
  let c = (0, _color_reader.readColor)(color).rgbaA;
  this.styles.strokeColor = [c[0] / 255, c[1] / 255, c[2] / 255, c[3]];
};
_webgl.WebGL.prototype.cube = function (size = 200) {
  var cubeRotation = 0.0;
  let gl = this.gl;
  // prettier-ignore
  const positions = [
  // Front face
  -1.0 * size, -1.0 * size, 1.0 * size, 1.0 * size, -1.0 * size, 1.0 * size, 1.0 * size, 1.0 * size, 1.0 * size, -1.0 * size, 1.0 * size, 1.0 * size,
  // Back face
  -1.0 * size, -1.0 * size, -1.0 * size, -1.0 * size, 1.0 * size, -1.0 * size, 1.0 * size, 1.0 * size, -1.0 * size, 1.0 * size, -1.0 * size, -1.0 * size,
  // Top face
  -1.0 * size, 1.0 * size, -1.0 * size, -1.0 * size, 1.0 * size, 1.0 * size, 1.0 * size, 1.0 * size, 1.0 * size, 1.0 * size, 1.0 * size, -1.0 * size,
  // Bottom face
  -1.0 * size, -1.0 * size, -1.0 * size, 1.0 * size, -1.0 * size, -1.0 * size, 1.0 * size, -1.0 * size, 1.0 * size, -1.0 * size, -1.0 * size, 1.0 * size,
  // Right face
  1.0 * size, -1.0 * size, -1.0 * size, 1.0 * size, 1.0 * size, -1.0 * size, 1.0 * size, 1.0 * size, 1.0 * size, 1.0 * size, -1.0 * size, 1.0 * size,
  // Left face
  -1.0 * size, -1.0 * size, -1.0 * size, -1.0 * size, -1.0 * size, 1.0 * size, -1.0 * size, 1.0 * size, 1.0 * size, -1.0 * size, 1.0 * size, -1.0 * size];
  // create bind and buffer data. that's all
  const positionBuffer = this.putBufferData(positions);

  // Now set up the colors for the faces
  const faceColors = [[1.0, 1.0, 1.0, 1.0],
  // Front face: white
  [1.0, 0.0, 0.0, 1.0],
  // Back face: red
  [0.0, 1.0, 0.0, 1.0],
  // Top face: green
  [0.0, 0.0, 1.0, 1.0],
  // Bottom face: blue
  [1.0, 1.0, 0.0, 1.0],
  // Right face: yellow
  [1.0, 0.0, 1.0, 1.0] // Left face: purple
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
  const indices = [0, 1, 2, 0, 2, 3,
  // front
  4, 5, 6, 4, 6, 7,
  // back
  8, 9, 10, 8, 10, 11,
  // top
  12, 13, 14, 12, 14, 15,
  // bottom
  16, 17, 18, 16, 18, 19,
  // right
  20, 21, 22, 20, 22, 23 // left
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

  const fieldOfView = 45 * Math.PI / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;

  // as the destination to receive the result.
  _m.m4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  this.worldMatrix.translate(-0.0, 0.0, -6.0); // amount to translate
  this.worldMatrix.rotateZ(cubeRotation);
  this.worldMatrix.rotateX(cubeRotation * 0.7);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  gl.vertexAttribPointer(this.program.attributes.vertexPosition, 3,
  // numComponents
  gl.FLOAT,
  // type
  false,
  // normalize
  0,
  // stride
  0 // offset
  );
  gl.enableVertexAttribArray(this.program.attributes.vertexPosition);

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  gl.vertexAttribPointer(this.program.uniforms.vertexColor, 4,
  // numComponents
  gl.FLOAT,
  // type
  false,
  // normalize
  0,
  // stride
  0 // offset
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
_webgl.WebGL.prototype.lookAt = function (eye, center = [0, 0, 0], up = [0, 1, 0]) {
  this.viewMatrix = _m.m4.lookAt(eye, center, up);
};
_webgl.WebGL.prototype.perspective = function (fov, aspect, near, far) {
  _m.m4.perspective(this.projectionMatrix, fov, aspect, near, far);
  // this.computeMatrix();
};

},{"../color/color_reader.js":7,"./m4.js":1,"./webgl.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebGL = void 0;
exports.createWebGL = createWebGL;
var _main = require("../main.js");
var _utils = require("../utils.js");
var _m = require("./m4.js");
/**
 * Creates a WebGL instance thati include usefullkj methods to work with WebGL.
 * @param {Object} [configs] configuration for canvas. Follwoing properties are accepted:
 * @param	{boolean} [configs.deleteOld=false] whether to delete old canvas.
 * @returns {WebGL} WebGL instance
 */
function createWebGL(configs) {
  let c = _main.C.workingContext;
  const cv = _main.C.workingCanvas;
  configs = (0, _utils.applyDefault)({
    deleteOld: false,
    dpr: Math.ceil(globalThis.devicePixelRatio),
    width: cv.rWidth,
    height: cv.rHeight
  }, configs);
  let container = c.canvas.parentElement;
  let cvs = _main.C.makeCanvas(configs);
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
    this.dpr = canvas.dpr || Math.ceil(globalThis.devicePixelRatio);
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
          vertexColor: "u_color"
        },
        attributes: {
          vertexPosition: "a_position"
        },
        program: null
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
          matrix: "u_matrix"
        },
        attributes: {
          vertexPosition: "a_position",
          vertexColor: "aVertexColor"
        },
        program: null
      }
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
    this.projectionMatrix = new _m.m4();
    /**
     * Model/world matrix
     * @type {m4}
     */
    this.worldMatrix = new _m.m4();
    /**
     * View matrix
     * @type {m4}
     */
    this.viewMatrix = new _m.m4();
    /**
     * Composition of all matricies
     * @type {m4}
     */
    this.matrix = new _m.m4();
    // set the resolution
    gl.uniform2f(this.program.uniforms.resolution, canvas.width / 2 / this.dpr, canvas.height / 2 / this.dpr);
    this.styles = {
      /** Color to fill inside the shape */
      fillColor: [1, 0, 1, 1],
      /** Color given to the border of shape &  for lines */
      strokeColor: [1, 1, 0, 1],
      /** Width of line */
      lineWidth: 1
    };
  }
  useProgram(program) {
    if (this.sources[program]) {
      this.program = this.sources[program];
      this.gl.useProgram(this.program.program);
      this.gl.uniform2f(this.program.uniforms.resolution, this.canvas.width / 2 / this.dpr, this.canvas.height / 2 / this.dpr);
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
    const dpr = globalThis.devicePixelRatio;
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
    gl.vertexAttribPointer(this.program.attributes.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(this.program.attributes.vertexPosition);
    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    numComponents = 4;
    type = gl.FLOAT;
    normalize = false;
    stride = 0;
    offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.program.uniforms.vertexColor);
    gl.vertexAttribPointer(this.program.uniforms.vertexColor, numComponents, type, normalize, stride, offset);
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
      fragment: program.fragment
    };
  }
  attribUsage(position, components = 3, type = this.gl.FLOAT, normalize = false, stride = 0, offset = 0) {
    this.gl.enableVertexAttribArray(position);
    this.gl.vertexAttribPointer(position,
    // position of attribute
    components,
    // components to pull per iteration
    type,
    // type of the data
    normalize,
    // whether normalize the data
    stride,
    // 0 = move forward size * sizeof(type) each iteration to get the next position
    offset // where to start
    );
  }
}
exports.WebGL = WebGL;

},{"../main.js":17,"../utils.js":36,"./m4.js":1}],4:[function(require,module,exports){
"use strict";

var _utils = require("./utils.js");
var _main = require("./main.js");
var _settings = _interopRequireWildcard(require("./settings.js"));
var _constants$math = _interopRequireWildcard(require("./constants/math.js"));
var _constants$drawing = _interopRequireWildcard(require("./constants/drawing.js"));
var _constants$color_palettes = _interopRequireWildcard(require("./constants/color_palettes.js"));
var _color$gradients = _interopRequireWildcard(require("./color/gradients.js"));
var _color$random = _interopRequireWildcard(require("./color/random.js"));
var _color$color_reader = _interopRequireWildcard(require("./color/color_reader.js"));
var _color$interpolation = _interopRequireWildcard(require("./color/interpolation.js"));
var _color$color_converters = _interopRequireWildcard(require("./color/color_converters.js"));
var _image$image = _interopRequireWildcard(require("./image/image.js"));
var _image$processing = _interopRequireWildcard(require("./image/processing.js"));
var _objects$tex = _interopRequireWildcard(require("./objects/tex.js"));
var _objects$text = _interopRequireWildcard(require("./objects/text.js"));
var _objects$braces = _interopRequireWildcard(require("./objects/braces.js"));
var _objects$arrows = _interopRequireWildcard(require("./objects/arrows.js"));
var _objects$geometry = _interopRequireWildcard(require("./objects/geometry.js"));
var _objects$functions = _interopRequireWildcard(require("./objects/functions.js"));
var _objects$coordinate_systems$axes = _interopRequireWildcard(require("./objects/coordinate_systems/axes.js"));
var _objects$coordinate_systems$number_line = _interopRequireWildcard(require("./objects/coordinate_systems/number_line.js"));
var _objects$coordinate_systems$number_plane = _interopRequireWildcard(require("./objects/coordinate_systems/number_plane.js"));
var _objects$coordinate_systems$polar_plane = _interopRequireWildcard(require("./objects/coordinate_systems/polar_plane.js"));
var _objects$more_shapes = _interopRequireWildcard(require("./objects/more_shapes.js"));
var _math$functions = _interopRequireWildcard(require("./math/functions.js"));
var _math$points = _interopRequireWildcard(require("./math/points.js"));
var _math$random = _interopRequireWildcard(require("./math/random.js"));
var _math$aritmetics = _interopRequireWildcard(require("./math/aritmetics.js"));
var _math$rate_functions = _interopRequireWildcard(require("./math/rate_functions.js"));
var _WebGL$webgl = _interopRequireWildcard(require("./WebGL/webgl.js"));
var _WebGL$settings = _interopRequireWildcard(require("./WebGL/settings.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
//! Experimental features

[{
  defineProperties: _utils.defineProperties,
  C: _main.C
}, _settings, _constants$math, _constants$drawing, _constants$color_palettes, _color$gradients, _color$random, _color$color_reader, _color$interpolation, _color$color_converters, _image$image, _image$processing, _objects$tex, _objects$text, _objects$braces, _objects$arrows, _objects$geometry, _objects$functions, _objects$coordinate_systems$axes, _objects$coordinate_systems$number_line, _objects$coordinate_systems$number_plane, _objects$coordinate_systems$polar_plane, _objects$more_shapes, _math$functions, _math$points, _math$random, _math$aritmetics, _math$rate_functions, _WebGL$webgl, _WebGL$settings].forEach(value => (0, _utils.defineProperties)(value));

},{"./WebGL/settings.js":2,"./WebGL/webgl.js":3,"./color/color_converters.js":6,"./color/color_reader.js":7,"./color/gradients.js":8,"./color/interpolation.js":9,"./color/random.js":10,"./constants/color_palettes.js":11,"./constants/drawing.js":13,"./constants/math.js":14,"./image/image.js":15,"./image/processing.js":16,"./main.js":17,"./math/aritmetics.js":18,"./math/functions.js":19,"./math/points.js":20,"./math/random.js":21,"./math/rate_functions.js":22,"./objects/arrows.js":23,"./objects/braces.js":24,"./objects/coordinate_systems/axes.js":25,"./objects/coordinate_systems/number_line.js":27,"./objects/coordinate_systems/number_plane.js":28,"./objects/coordinate_systems/polar_plane.js":29,"./objects/functions.js":30,"./objects/geometry.js":31,"./objects/more_shapes.js":32,"./objects/tex.js":33,"./objects/text.js":34,"./settings.js":35,"./utils.js":36}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  defineProperties: true,
  C: true
};
Object.defineProperty(exports, "C", {
  enumerable: true,
  get: function () {
    return _main.C;
  }
});
Object.defineProperty(exports, "defineProperties", {
  enumerable: true,
  get: function () {
    return _utils.defineProperties;
  }
});
var _utils = require("./utils.js");
var _settings = require("./settings.js");
Object.keys(_settings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _settings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _settings[key];
    }
  });
});
var _main = require("./main.js");
var _color_palettes = require("./constants/color_palettes.js");
Object.keys(_color_palettes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _color_palettes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _color_palettes[key];
    }
  });
});
var _drawing = require("./constants/drawing.js");
Object.keys(_drawing).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _drawing[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _drawing[key];
    }
  });
});
var _colors = require("./constants/colors.js");
Object.keys(_colors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _colors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _colors[key];
    }
  });
});
var _math = require("./constants/math.js");
Object.keys(_math).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _math[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _math[key];
    }
  });
});
var _color_converters = require("./color/color_converters.js");
Object.keys(_color_converters).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _color_converters[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _color_converters[key];
    }
  });
});
var _color_reader = require("./color/color_reader.js");
Object.keys(_color_reader).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _color_reader[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _color_reader[key];
    }
  });
});
var _gradients = require("./color/gradients.js");
Object.keys(_gradients).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _gradients[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _gradients[key];
    }
  });
});
var _interpolation = require("./color/interpolation.js");
Object.keys(_interpolation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interpolation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interpolation[key];
    }
  });
});
var _random = require("./color/random.js");
Object.keys(_random).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _random[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _random[key];
    }
  });
});
var _image = require("./image/image.js");
Object.keys(_image).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _image[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _image[key];
    }
  });
});
var _processing = require("./image/processing.js");
Object.keys(_processing).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _processing[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _processing[key];
    }
  });
});
var _arrows = require("./objects/arrows.js");
Object.keys(_arrows).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _arrows[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _arrows[key];
    }
  });
});
var _braces = require("./objects/braces.js");
Object.keys(_braces).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _braces[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _braces[key];
    }
  });
});
var _functions = require("./objects/functions.js");
Object.keys(_functions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _functions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _functions[key];
    }
  });
});
var _geometry = require("./objects/geometry.js");
Object.keys(_geometry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _geometry[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _geometry[key];
    }
  });
});
var _more_shapes = require("./objects/more_shapes.js");
Object.keys(_more_shapes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _more_shapes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _more_shapes[key];
    }
  });
});
var _tex = require("./objects/tex.js");
Object.keys(_tex).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _tex[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tex[key];
    }
  });
});
var _text = require("./objects/text.js");
Object.keys(_text).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _text[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _text[key];
    }
  });
});
var _number_plane = require("./objects/coordinate_systems/number_plane.js");
Object.keys(_number_plane).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _number_plane[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _number_plane[key];
    }
  });
});
var _polar_plane = require("./objects/coordinate_systems/polar_plane.js");
Object.keys(_polar_plane).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _polar_plane[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _polar_plane[key];
    }
  });
});
var _axes = require("./objects/coordinate_systems/axes.js");
Object.keys(_axes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _axes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _axes[key];
    }
  });
});
var _number_line = require("./objects/coordinate_systems/number_line.js");
Object.keys(_number_line).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _number_line[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _number_line[key];
    }
  });
});
var _aritmetics = require("./math/aritmetics.js");
Object.keys(_aritmetics).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _aritmetics[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _aritmetics[key];
    }
  });
});
var _functions2 = require("./math/functions.js");
Object.keys(_functions2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _functions2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _functions2[key];
    }
  });
});
var _points = require("./math/points.js");
Object.keys(_points).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _points[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _points[key];
    }
  });
});
var _random2 = require("./math/random.js");
Object.keys(_random2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _random2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _random2[key];
    }
  });
});
var _rate_functions = require("./math/rate_functions.js");
Object.keys(_rate_functions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _rate_functions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rate_functions[key];
    }
  });
});
var _settings2 = require("./WebGL/settings.js");
Object.keys(_settings2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _settings2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _settings2[key];
    }
  });
});
var _webgl = require("./WebGL/webgl.js");
Object.keys(_webgl).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _webgl[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _webgl[key];
    }
  });
});

},{"./WebGL/settings.js":2,"./WebGL/webgl.js":3,"./color/color_converters.js":6,"./color/color_reader.js":7,"./color/gradients.js":8,"./color/interpolation.js":9,"./color/random.js":10,"./constants/color_palettes.js":11,"./constants/colors.js":12,"./constants/drawing.js":13,"./constants/math.js":14,"./image/image.js":15,"./image/processing.js":16,"./main.js":17,"./math/aritmetics.js":18,"./math/functions.js":19,"./math/points.js":20,"./math/random.js":21,"./math/rate_functions.js":22,"./objects/arrows.js":23,"./objects/braces.js":24,"./objects/coordinate_systems/axes.js":25,"./objects/coordinate_systems/number_line.js":27,"./objects/coordinate_systems/number_plane.js":28,"./objects/coordinate_systems/polar_plane.js":29,"./objects/functions.js":30,"./objects/geometry.js":31,"./objects/more_shapes.js":32,"./objects/tex.js":33,"./objects/text.js":34,"./settings.js":35,"./utils.js":36}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HSLToRGB = HSLToRGB;
exports.HSVToRGB = HSVToRGB;
exports.RGBToHSL = RGBToHSL;
exports.RGBToHSV = RGBToHSV;
exports.hue2RGB = hue2RGB;
/** @module Color-Converters */
function hue2RGB(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes values of red, green, and blue are between 0 & 1 and
 * returns hue, saturation and lightness in range 0 to 1

 * @param {number} r The red color value
 * @param {number} g The green color value
 * @param {number} b The blue color value
 * @return {number[]} The HSL representation
 */
function RGBToHSL(r, g, b) {
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    hue,
    saturation,
    lightness = (max + min) / 2;
  if (max === min) {
    hue = saturation = 0; // achromatic
  } else {
    let d = max - min;
    saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max == r) hue = (g - b) / d + (g < b ? 6 : 0);else if (max == g) hue = (b - r) / d + 2;else if (max == b) hue = (r - g) / d + 4;
    hue /= 6;
  }
  return [hue, saturation, lightness];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes hue is between 0 and 360, saturation and lightness are between 0 & 1 and
 * returns red, green, and blue values in the range 0 to 1
 *
 * @param {number} hue The hue
 * @param {number} saturation The saturation
 * @param {number} lightness The lightness
 * @return {number[]} The RGB representation
 */
function HSLToRGB(hue, saturation, lightness) {
  let r, g, b;
  hue /= 360;
  if (saturation === 0) {
    r = g = b = lightness; // achromatic
  } else {
    let q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    let p = 2 * lightness - q;
    r = hue2RGB(p, q, hue + 1 / 3);
    g = hue2RGB(p, q, hue);
    b = hue2RGB(p, q, hue - 1 / 3);
  }
  return [r, g, b];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes values of red, green, and blue are between 0 & 1 and
 * returns hue, saturation and value in range 0 to 1
 *
 * @param {number} r The red color value
 * @param {number} g The green color value
 * @param {number} b The blue color value
 * @return {number[]} HSV representation
 */
function RGBToHSV(r, g, b) {
  let max = Math.max(r, g, b),
    // val
    min = Math.min(r, g, b),
    // chroma
    hue,
    value = max,
    d = max - min,
    saturation = max === 0 ? 0 : d / max;
  if (max === min) {
    hue = 0; // achromatic
  } else {
    if (max == r) hue = (g - b) / d + (g < b ? 6 : 0);else if (max == g) hue = (b - r) / d + 2;else if (max == b) hue = (r - g) / d + 4;
    hue /= 6;
  }
  return [hue, saturation, value];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * hue is between 0 to 360, saturation and value are between 0 & 1 and
 * returns red, green, and blue in range 0 to 1
 *
 * @param {number} hue
 * @param {number} saturation
 * @param {number} value Also knwon as brightness
 * @return {number[]} RGB representation of color
 */
function HSVToRGB(hue, saturation, value) {
  let r,
    g,
    b,
    i = Math.floor(hue / 60),
    f = hue / 60 - i,
    p = value * (1 - saturation),
    q = value * (1 - f * saturation),
    t = value * (1 - (1 - f) * saturation);
  i %= 6;
  if (i == 0) r = value, g = t, b = p;else if (i == 1) r = q, g = value, b = p;else if (i == 2) r = p, g = value, b = t;else if (i == 3) r = p, g = q, b = value;else if (i == 4) r = t, g = p, b = value;else if (i == 5) r = value, g = p, b = q;
  return [r, g, b];
}

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readColor = readColor;
var _colors = require("../constants/colors.js");
/** @module Color-Reader */

// adapeted from p5.js
// Full color string patterns. The capture groups are necessary.
let
  // Matches: #XXX
  HEX3 = /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,
  // Matches: #XXXX
  HEX4 = /^#([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])$/i,
  // Matches: #xxxxxx
  HEX6 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
  // Matches: #XXXXXXXX
  HEX8 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
  // Matches: rgb(R, G, B)
  RGB = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i,
  // Matches: rgb(R, G, B, A)
  RGBA = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(?:(\d+(?:\.\d+)?)|(?:\.\d+))\)$/i;
/**
 * Reads the argument and returns color in the prefered colorMode.
 * If last argument is given true, it will return the colors as array.
 * Possible use cases (these assume colorModes to be 'rgba'):
 * Only accept valid css colors
 *
 * * readColor(100)                 // rgba(100, 100, 100, 1)
 * * readColor(255, 200)            // rgba(255, 200, 0, 1)
 * * readColor(255, 200, 100)       // rgba(255, 200, 100, 1)
 * * readColor(290, 134, 50, 0.6)   // rgba(290, 134, 50, 0.6)
 * * readColor("#f3d")              // rgba(255, 51, 221, 1)
 * * readColor("#fa054f")           // rgba(250, 5, 79, 1)
 * * readColor("#fa054fa0")         // rgba(250, 5, 79, 0.6274509803921569)
 * * readColor(255, 200, 100, true) // [255, 200, 100, 1]
 * * readColor("#f3da", true)       // [255, 51, 221, 0.0392156862745098]
 *
 * @return {Object} color string/array
 */
function readColor(...color) {
  let result;
  if (Array.isArray(color[0])) color = color[0];
  let c1 = color[0];
  if (typeof c1 === "number") {
    if (color.length === 1) {
      result = [c1, c1, c1, 1];
    } else if (color.length === 2) {
      result = [c1, color[1], 0, 1];
    } else if (color.length === 3) {
      result = [c1, color[1], color[2], 1];
    } else if (color.length === 4) {
      result = [c1, color[1], color[2], color[3]];
    }
  } else if (typeof c1 == "string") {
    // Adapted from p5.js
    let str = c1.replace(/\s/g, "").toLowerCase();
    // convert string to array if it is a named colour.
    if (_colors.Colors[str]) {
      result = _colors.Colors[str];
      result = [parseInt(result.substr(1, 2), 16), parseInt(result.substr(3, 2), 16), parseInt(result.substr(5, 2), 16), 1];
    } else if (HEX3.test(str)) {
      result = HEX3.exec(str).slice(1).map(color => parseInt(color + color, 16));
      result[3] = 1;
    } else if (HEX6.test(str)) {
      result = HEX6.exec(str).slice(1).map(color => parseInt(color, 16));
      result[3] = 1;
    } else if (HEX4.test(str)) {
      result = HEX4.exec(str).slice(1).map(color => parseInt(color + color, 16));
      result[3] /= 255;
    } else if (HEX8.test(str)) {
      result = HEX8.exec(str).slice(1).map(color => parseInt(color, 16));
      result[3] /= 255;
    } else if (RGB.test(str)) {
      result = RGB.exec(str).slice(1).map(color => parseInt(color, 10));
      result[3] = 1;
    } else if (RGBA.test(str)) {
      result = RGBA.exec(str).slice(1).map((color, index) => {
        if (index == 3) return parseFloat(color);
        return parseInt(color, 10);
      });
    } else {
      throw new Error("Cannot convert given value to color: " + str);
    }
  } else {
    result = c1;
    return {
      rgbaA: result,
      rgba: result,
      hex6: result,
      hex8: result,
      hex: result,
      hsl: result
    };
  }
  let a = result[3];
  result[3] *= 255;
  let hex6 = "#",
    r = result;
  r.map((color, i) => {
    if (i < 3) {
      let hex = Math.round(color).toString(16);
      hex6 += hex.length == 1 ? "0" + hex : hex;
    }
  });
  let hex8 = "#";
  r = result;
  r.map((color, i) => {
    if (i < 4) {
      let hex = Math.round(color).toString(16);
      hex8 += hex.length == 1 ? "0" + hex : hex;
    }
  });
  result[3] = a;
  return {
    rgbaA: result,
    rgba: `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${result[3]})`,
    hex6: hex6,
    hex8: hex8,
    hex: hex8,
    hsl: `hsl(${result[0]}, ${result[1]}, ${result[2]})`
  };
}

},{"../constants/colors.js":12}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linearGradient = linearGradient;
var _main = require("../main.js");
var _utils = require("../utils.js");
/** @module Color-Gradient */

/**
 * creates a linear gradient
 *
 * @param {number[]} initialPoint initial point as [x, y]
 * @param {number[]} finalPoint final point as [x, y]
 * @param {Object|Array<*>} colStops color stops
 @example
 ```js
let color = linearGradient(
	[0, 0], [200, 0],
	{
			0: "green",
			0.5: "cyan",
			1: "yellow"
	}
);
```,
```js
let color = linearGradient(
	[0, 0], [200, 0],
	[
		"green",
		"cyan",
		"yellow"
	]
);
```
 */
function linearGradient(initialPoint, finalPoint, colStops) {
  const ctx = _main.C.workingContext;
  const gradient = ctx.createLinearGradient(initialPoint[0], initialPoint[1], finalPoint[0], finalPoint[1]);
  if ((0, _utils.type)(colStops) == "Array") {
    const stops = {};
    const step = 1 / colStops.length;
    for (let i = 0; i < colStops.length; i++) {
      stops[step * i] = colStops[i];
    }
    colStops = stops;
  } else if ((0, _utils.type)(colStops) == "Object") {
    colStops = colStops;
  } else {
    throw new Error("Color Stops must be an Array or an Object");
  }
  for (let stops = Object.keys(colStops || {}), i = 0; i < stops.length; i++) {
    const stop = Number(stops[i]);
    gradient.addColorStop(stop, colStops[stop]);
  }
  return gradient;
}

},{"../main.js":17,"../utils.js":36}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInterpolatedColorList = getInterpolatedColorList;
exports.lerpColor = lerpColor;
exports.lerpColorArray = lerpColorArray;
exports.lerpColorObject = lerpColorObject;
var _color_reader = require("./color_reader.js");
/** @module Color-Lerp */

/**
 * gives an interpolated color.
 *
 * @param {string} color1 color
 * @param {string} color2 color
 * @param {number} v should be between 0 and 1. This function may not work for values outside 0 & 1.
 */
function lerpColor(color1, color2, v) {
  const c1 = (0, _color_reader.readColor)(color1).rgbaA;
  const c2 = (0, _color_reader.readColor)(color2).rgbaA;
  return (0, _color_reader.readColor)(Math.min(Math.max(0, (c2[0] - c1[0]) * v + c1[0]), 255), Math.min(Math.max(0, (c2[1] - c1[1]) * v + c1[1]), 255), Math.min(Math.max(0, (c2[2] - c1[2]) * v + c1[2]), 255), Math.min(Math.max(0, (c2[3] - c1[3]) * v + c1[3]), 255)).hex8;
}

/**
 * Lerps across a color Object
 *
 * @param {Object} colorObj
 * @param {number} v
 * @return {string}
 */
function lerpColorObject(colorObj, v) {
  const stopes = Object.keys(colorObj || {}).sort();
  const min = Math.min(...stopes);
  const max = Math.max(...stopes);
  let color = "#000000";
  if (v >= max) return colorObj[max];
  if (v <= min) return colorObj[min];
  for (let i = 0; i < stopes.length - 1; i++) {
    let a = stopes[i];
    if (v > a) {
      color = lerpColor(colorObj[a], colorObj[stopes[i + 1]], (v - a) / (stopes[i + 1] - a));
      break;
    } else if (v == a) {
      color = colorObj[a];
      break;
    }
  }
  return color;
}

/**
 * Lerps across a color Array
 * From <https://github.com/yuki-koyama/tinycolormap/blob/fe597277c782c583eb40362de98a08df62efc628/include/tinycolormap.hpp#L159>
 * @param {string[]} colorArr array that contains color as string
 * @param {number} v value to interpolate
 * @param {number} [min = 0] minimum value of the range
 * @param {number} [max = 1] maximum value of the range
 * @return {string} lerped color
 */
function lerpColorArray(colorArr, v, min = 0, max = 1) {
  let len = colorArr.length - 1;
  if (v >= max) return colorArr[len];
  if (v <= min) return colorArr[0];

  // map to [0, 1]
  v = (v - min) / (max - min);
  let a = v * len,
    // between 0 and len
    b = Math.floor(a);
  return lerpColor(colorArr[b], colorArr[b + 1], a - b);
}

/**
 *
 * @param {string[]} colorPalatte Array of color palettes
 * @param {number} [min=0] minimum of range
 * @param {number} [max=5] maximum of range
 * @param {number} [alpha=1] value of alpha channel. This value must be between 0 & 1
 * @returns {Object} color object
 */
function getInterpolatedColorList(colorPalatte, min = 0, max = 5, alpha) {
  if (colorPalatte.length < 2) throw new Error("Atleast 2 colors are needed to create interpolatable object");
  let step = (max - min) / (colorPalatte.length - 1),
    colorObj = {};
  for (let i = 0; i < colorPalatte.length; i++) {
    let value = min + i * step,
      color = (0, _color_reader.readColor)(colorPalatte[i]).rgbaA;
    color[3] = isNaN(alpha) ? color[3] : alpha;
    colorObj[value] = color;
  }
  return colorObj;
}

},{"./color_reader.js":7}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomColor = randomColor;
exports.randomDefinedColor = randomDefinedColor;
var _colors = require("../constants/colors.js");
var _random = require("../math/random.js");
/** @module Random-Colors */

let definedColorList = Object.keys(_colors.Colors);
const TR_INDEX = definedColorList.indexOf("TRANSPARENT");
definedColorList = definedColorList.slice(0, TR_INDEX).concat(definedColorList.slice(TR_INDEX + 1));

/**
 * returns a random hex color
 *
 */
function randomColor() {
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let randNum = (0, _random.randomInt)(255).toString(16);
    randNum = randNum.length === 1 ? 0 + randNum : randNum;
    color += randNum;
  }
  return color;
}

/**
 * picks a random color from defined ones
 *
 */
function randomDefinedColor() {
  return _colors.Colors[definedColorList[(0, _random.randomInt)(definedColorList.length - 1)]];
}

},{"../constants/colors.js":12,"../math/random.js":21}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorPalettes = void 0;
/** @module Color-Palettes */

// prettier-ignore
const ColorPalettes = exports.ColorPalettes = {
  // This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
  // Please see license at http://colorbrewer.org/export/LICENSE.txt
  YlGn: "#ffffe5 #f7fcb9 #d9f0a3 #addd8e #78c679 #41ab5d #238443 #006837 #004529".split(" "),
  GnBu: "#f7fcf0 #e0f3db #ccebc5 #a8ddb5 #7bccc4 #4eb3d3 #2b8cbe #0868ac #084081".split(" "),
  BuGn: "#f7fcfd #e5f5f9 #ccece6 #99d8c9 #66c2a4 #41ae76 #238b45 #006d2c #00441b".split(" "),
  PuBu: "#fff7fb #ece7f2 #d0d1e6 #a6bddb #74a9cf #3690c0 #0570b0 #045a8d #023858".split(" "),
  BuPu: "#f7fcfd #e0ecf4 #bfd3e6 #9ebcda #8c96c6 #8c6bb1 #88419d #810f7c #4d004b".split(" "),
  RdPu: "#fff7f3 #fde0dd #fcc5c0 #fa9fb5 #f768a1 #dd3497 #ae017e #7a0177 #49006a".split(" "),
  PuRd: "#f7f4f9 #e7e1ef #d4b9da #c994c7 #df65b0 #e7298a #ce1256 #980043 #67001f".split(" "),
  OrRd: "#fff7ec #fee8c8 #fdd49e #fdbb84 #fc8d59 #ef6548 #d7301f #b30000 #7f0000".split(" "),
  Reds: "#fff5f0 #fee0d2 #fcbba1 #fc9272 #fb6a4a #ef3b2c #cb181d #a50f15 #67000d".split(" "),
  Blues: "#f7fbff #deebf7 #c6dbef #9ecae1 #6baed6 #4292c6 #2171b5 #08519c #08306b".split(" "),
  Greys: "#ffffff #f0f0f0 #d9d9d9 #bdbdbd #969696 #737373 #525252 #252525 #000000".split(" "),
  YlGnBu: "#ffffd9 #edf8b1 #c7e9b4 #7fcdbb #41b6c4 #1d91c0 #225ea8 #253494 #081d58".split(" "),
  PuBuGn: "#fff7fb #ece2f0 #d0d1e6 #a6bddb #67a9cf #3690c0 #02818a #016c59 #014636".split(" "),
  YlOrRd: "#ffffcc #ffeda0 #fed976 #feb24c #fd8d3c #fc4e2a #e31a1c #bd0026 #800026".split(" "),
  YlOrBr: "#ffffe5 #fff7bc #fee391 #fec44f #fe9929 #ec7014 #cc4c02 #993404 #662506".split(" "),
  Greens: "#f7fcf5 #e5f5e0 #c7e9c0 #a1d99b #74c476 #41ab5d #238b45 #006d2c #00441b".split(" "),
  Purples: "#fcfbfd #efedf5 #dadaeb #bcbddc #9e9ac8 #807dba #6a51a3 #54278f #3f007d".split(" "),
  Oranges: "#fff5eb #fee6ce #fdd0a2 #fdae6b #fd8d3c #f16913 #d94801 #a63603 #7f2704".split(" "),
  PuOr: "#7f3b08 #b35806 #e08214 #fdb863 #fee0b6 #f7f7f7 #d8daeb #b2abd2 #8073ac #542788 #2d004b".split(" "),
  BrBG: "#543005 #8c510a #bf812d #dfc27d #f6e8c3 #f5f5f5 #c7eae5 #80cdc1 #35978f #01665e #003c30".split(" "),
  PRGn: "#40004b #762a83 #9970ab #c2a5cf #e7d4e8 #f7f7f7 #d9f0d3 #a6dba0 #5aae61 #1b7837 #00441b".split(" "),
  PiYG: "#8e0152 #c51b7d #de77ae #f1b6da #fde0ef #f7f7f7 #e6f5d0 #b8e186 #7fbc41 #4d9221 #276419".split(" "),
  RdBu: "#67001f #b2182b #d6604d #f4a582 #fddbc7 #f7f7f7 #d1e5f0 #92c5de #4393c3 #2166ac #053061".split(" "),
  RdGy: "#67001f #b2182b #d6604d #f4a582 #fddbc7 #ffffff #e0e0e0 #bababa #878787 #4d4d4d #1a1a1a".split(" "),
  RdYlBu: "#a50026 #d73027 #f46d43 #fdae61 #fee090 #ffffbf #e0f3f8 #abd9e9 #74add1 #4575b4 #313695".split(" "),
  RdYlGn: "#a50026 #d73027 #f46d43 #fdae61 #fee08b #ffffbf #d9ef8b #a6d96a #66bd63 #1a9850 #006837".split(" "),
  Spectral: "#9e0142 #d53e4f #f46d43 #fdae61 #fee08b #ffffbf #e6f598 #abdda4 #66c2a5 #3288bd #5e4fa2".split(" "),
  // From Matlab
  Heat: "#0000ff #00ffff #00ff00 #ffff00 #ff0000".split(" "),
  Jet: "#000080 #0000ff #0080ff #00ffff #80ff80 #ffff00 #ff8000 #ff0000 #800000".split(" "),
  Parula: "#352a87 #2450d0 #0a72de #128ad2 #06a4ca #1ab2b1 #51bd90 #92bf72 #c6bc5e #f6ba46 #f9d528 #f9fb0e".split(" "),
  // From Matplotlib
  Magma: "#000004 #120d31 #331067 #5a167e #7e2482 #a3307e #c83e73 #e95462 #f97b5d #fea973 #fed395 #fcfdbf".split(" "),
  // very close to CMRmap
  Inferno: "#000004 #140b34 #390963 #61136e #85216b #a92e5e #cb4149 #e65d2f #f78212 #fcae12 #f5db4c #fcffa4".split(" "),
  Plasma: "#0d0887 #3e049c #6300a7 #8707a6 #a62098 #c03a83 #d5546e #e76f5a #f58c46 #fdae32 #fcd225 #f0f921".split(" "),
  Viridis: "#440154 #482173 #433e85 #38598c #2d708e #25858e #1e9b8a #2ab07f #50c46a #86d549 #c2df23 #fde725".split(" "),
  Cividis: "#00204d #00306f #2a406c #48526b #5e626e #727374 #878479 #9e9677 #b6a971 #d0be67 #ead357 #ffea46".split(" "),
  // Other
  GitHub: "#eeeeee #c6e48b #7bc96f #239a3b #196127",
  Turbo: "#30123b #4454c3 #448ffe #1fc9dd #2aefa1 #7dff56 #c1f334 #f1cb3a #fe932a #ea4e0d #be2102 #7a0403",
  Grey: "#000000 #ffffff",
  Gray: "#000000 #ffffff"
};

// for (var p in ColorPalettes) ColorPalettes[p] = ColorPalettes[p].split(" ");

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Colors = void 0;
/** @module Colors */
/* List of named CSS colors  */
// prettier-ignore
const Colors = exports.Colors = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ULTRA_EXPANDED = exports.ULTRA_CONDENSED = exports.TOP = exports.START = exports.SQUARE = exports.SEMI_EXPANDED = exports.SEMI_CONDENSED = exports.ROUND = exports.RIGHT = exports.OBLIQUE = exports.NORMAL = exports.MITER = exports.MILTER = exports.MIDDLE = exports.LEFT = exports.ITALIC = exports.IDEOGRAPHIC = exports.HANGING = exports.EXTRA_EXPANDED = exports.EXTRA_CONDENSED = exports.EXPANDED = exports.END = exports.CONDENSED = exports.CENTER = exports.BUTT = exports.BOTTOM = exports.BEVEL = exports.ALPHABETIC = void 0;
const BUTT = exports.BUTT = "butt",
  SQUARE = exports.SQUARE = "square",
  ROUND = exports.ROUND = "round",
  MILTER = exports.MILTER = "milter",
  BEVEL = exports.BEVEL = "bevel",
  MITER = exports.MITER = "miter",
  LEFT = exports.LEFT = "left",
  RIGHT = exports.RIGHT = "right",
  CENTER = exports.CENTER = "center",
  START = exports.START = "start",
  END = exports.END = "end",
  TOP = exports.TOP = "top",
  HANGING = exports.HANGING = "hanging",
  MIDDLE = exports.MIDDLE = "middle",
  ALPHABETIC = exports.ALPHABETIC = "alphabetic",
  IDEOGRAPHIC = exports.IDEOGRAPHIC = "ideographic",
  BOTTOM = exports.BOTTOM = "bottom",
  // font stretch properties
  ULTRA_CONDENSED = exports.ULTRA_CONDENSED = "ultra-condensed",
  // 50%
  EXTRA_CONDENSED = exports.EXTRA_CONDENSED = "extra-condensed",
  // 62.5%
  CONDENSED = exports.CONDENSED = "condensed",
  // 75%
  SEMI_CONDENSED = exports.SEMI_CONDENSED = "semi-condensed",
  // 87.5%
  NORMAL = exports.NORMAL = "normal",
  // 100%
  SEMI_EXPANDED = exports.SEMI_EXPANDED = "semi-expanded",
  // 112.5%
  EXPANDED = exports.EXPANDED = "expanded",
  // 125%
  EXTRA_EXPANDED = exports.EXTRA_EXPANDED = "extra-expanded",
  // 150%
  ULTRA_EXPANDED = exports.ULTRA_EXPANDED = "ultra-expanded",
  // 200%
  // font style properties
  ITALIC = exports.ITALIC = "italic",
  OBLIQUE = exports.OBLIQUE = "oblique";

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TWO_PI = exports.TIERCE_PI = exports.TAU = exports.SQRT2 = exports.RAD = exports.QUATER_PI = exports.PI = exports.PHI = exports.LN2 = exports.LN10 = exports.HALF_PI = exports.E = exports.DEG = void 0;
const E = exports.E = 2.71828182845904523,
  LN2 = exports.LN2 = 0.6931471805599453,
  LN10 = exports.LN10 = 2.30258509299404568,
  PI = exports.PI = 3.14159265358979323,
  HALF_PI = exports.HALF_PI = 1.57079632679489661,
  TIERCE_PI = exports.TIERCE_PI = 1.04719755119659774,
  QUATER_PI = exports.QUATER_PI = 0.7853981633974483,
  TAU = exports.TAU = 6.28318530717958647,
  TWO_PI = exports.TWO_PI = 6.28318530717958647,
  SQRT2 = exports.SQRT2 = 1.41421356237309504,
  PHI = exports.PHI = 1.618033988749894,
  // conversion factors
  DEG = exports.DEG = Math.PI / 180,
  // degree to radian
  RAD = exports.RAD = 180 / Math.PI; // radian to degree

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawImage = drawImage;
exports.loadImage = loadImage;
exports.loadImagePromise = loadImagePromise;
exports.pixel = pixel;
var _main = require("../main.js");
/**
 * This module contains function for image manipulation.
 * @module Image
 */

/**
 * Draws a given image in canvas.
 * See more about the parameters : {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage}
 * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement|ImageBitmap|OffscreenCanvas} image image to draw
 */
function drawImage(image) {
  let ctx = _main.C.workingContext,
    x,
    y;
  if (arguments.length < 6) {
    x = arguments[1];
    y = arguments[2];
  } else {
    x = arguments[5];
    y = arguments[6];
  }
  ctx.save();
  ctx.translate(x, y);
  if (ctx.yAxisInverted) ctx.scale(1, -1);
  if (ctx.XAxisInverted) ctx.scale(-1, 1);
  ctx.drawImage(image, 0, 0, ...Array.prototype.slice.call(arguments, 3));
  ctx.restore();
}

/**
 * Draws a pixel
 *
 * @param {number} x x-coordinate of pixel
 * @param {number} y y-coordinate of pixel
 * @param {string} color color of pixel
 */
function pixel(x, y, color, size) {
  let ctx = _main.C.workingContext;
  if (color) ctx.fillStyle = color;
  if (!size) size = 1 / _main.C.dpr;
  ctx.fillRect(x, y, size, size);
}

/**
 * Loads a image from given url. I
 * @param {string} url url of image
 * @param {Function} [resolver] function to call when image is loaded
 * @param {Function} [fallback] function to call when image fails to loaded
 * @returns {Image} image. This may not be loaded yet.
 */
function loadImage(url, resolver, fallback) {
  var img = new Image(); // Create new img element
  img.src = url;
  if (typeof resolver == "function") {
    img.addEventListener("load", () => resolver(img), false);
  }
  if (typeof fallback == "function") {
    img.addEventListener("error", evt => fallback(evt, img), false);
  }
  return img;
}

/**
 * loads a image from given url and returns a promise.
 * @param {string} url url of image
 * @returns {Promise} promise that resolves to image
 */
function loadImagePromise(url) {
  return new Promise((resolve, reject) => {
    loadImage(url, resolve, reject);
  });
}

},{"../main.js":17}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPixelColor = getPixelColor;
exports.hasNeighbourColor = hasNeighbourColor;
exports.imageDataToColorArray = imageDataToColorArray;
exports.imageToData = imageToData;
exports.replaceColorInImage = replaceColorInImage;
var _color_reader = require("../color/color_reader.js");
var _main = require("../main.js");
/** @module Image-Processing */

/**
 * returns color at a given point from ImageData
 *
 * @param {ImageData} pixels
 * @param {number} x x-coordinate of point
 * @param {number} y y-coordinate of point
 * @return {Uint8ClampedArray} array of color components [r, g, b, a]
 */
function getPixelColor(pixels, x, y) {
  let index = pixels.width * y + x;
  return pixels.data.subarray(index, index + 4);
}

/**
 * Convert image data to 2d array of colors.
 *
 * @param {ImageData} pixels
 * @returns {number[][]} 2d array of colors
 */
function imageDataToColorArray(pixels) {
  let w = pixels.width,
    h = pixels.height,
    dat = Array.from(pixels.data),
    image2D = [];
  for (var y = 0; y < h; y++) {
    image2D.push([]);
    for (var x = 0; x < w; x++) {
      let i = h * y + x,
        r = dat[i],
        g = dat[i + 1],
        b = dat[i + 2],
        a = dat[i + 3];
      image2D[y].push([r, g, b, a]);
    }
  }
  return image2D;
}

/**
 * Returns if neighbor pixels have the same color as given.
 *
 * @param {number[]} color color to compare with
 * @param {ImageData} pixels image data
 * @param {number} x x-coordinate of point
 * @param {number} y y-coordinate of point
 * @return {boolean}
 */
function hasNeighbourColor(color, pixels, x, y) {
  let dat = pixels.data,
    w = pixels.width;
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i !== x || j !== y) {
        let index = w * y + x,
          neighbourColor = dat.subarray(index, index + 4);
        if (neighbourColor[0] === color[0] && neighbourColor[1] === color[1] && neighbourColor[2] === color[2] && neighbourColor[3] === color[3]) {
          return true;
        }
      }
    }
  }
  return false;
}

// TODO: Under construction
//function createMapOfLetter(letter) {
//	let img = Image.new("RGB", (230, 230), "white"),
//		d = ImageDraw.Draw(img),
//		font = ImageFont.truetype("arial.ttf", 300);
//	d.text((15, -50), letter, (fill = (0, 0, 0)), (font = font));
//
//	let pixels = img.load(),
//		ans = [];
//
//	for (let x = 0; x < 230; x++) {
//		for (let y = 0; y < 230; y++) {
//			if (pixels[(x, y)] == (0, 0, 0)) {
//				if (
//					hasNeighbourColor((255, 255, 255), pixels, x, y) &&
//					!hasNeighbourColor((255, 0, 0), pixels, x, y)
//				) {
//					pixels[(x, y)] = (255, 0, 0);
//					ans.append([x, y]);
//				}
//			}
//		}
//	}
//
//	return ans;
//}

/**
 * Replaces a color by another color in given image.
 * @param {ImageData} image image to be processed
 * @param {*} toReplace color to be replaced
 * @param {*} replaced replaced color
 * @param {boolean} [matchAlpha = false] whether to check if alpha channel is same as that of toReplace.
 * @param {number} [tolerance = 0] minimum difference between each color channel
 */
function replaceColorInImage(image, toReplace, replaced, matchAlpha = false, tolerance = 0) {
  let data = image.data,
    newData = _main.C.workingContext.createImageData(image.width, image.height);
  const [r1, g1, b1, a1] = (0, _color_reader.readColor)(toReplace).rgbaA;
  const [r2, g2, b2, a2] = (0, _color_reader.readColor)(replaced).rgbaA;
  let nonOccurances = 0;
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      a = data[i + 3];
    if (Math.abs(r - r1) <= tolerance && Math.abs(g - g1) <= tolerance && Math.abs(b - b1) <= tolerance && (matchAlpha ? Math.abs(a - a1) <= tolerance : true)) {
      newData.data[i] = r2;
      newData.data[i + 1] = g2;
      newData.data[i + 2] = b2;
      if (matchAlpha) newData.data[i + 3] = a2;else newData.data[i + 3] = 255;
    } else {
      newData.data[i] = r;
      newData.data[i + 1] = g;
      newData.data[i + 2] = b;
      if (matchAlpha) newData.data[i + 3] = a;else newData.data[i + 3] = 255;
      nonOccurances++;
    }
  }
  return newData;
}

/**
 * Converts a image to ImageData.
 * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement|ImageBitmap|OffscreenCanvas} image image
 * @param {number} x x-coordinate of starting point in image
 * @param {number} y y-coordinate of starting point in image
 * @param {number} [width = image.width] width of area to be covered
 * @param {number} [height = image.height] height of area to be covered
 * @param {boolean} [smoothen = false] whether to capture a smoothened the image
 */
function imageToData(image, x, y, width, height, smoothen = false) {
  let cvs = document.createElement("canvas");
  let ctx = cvs.getContext("2d");
  let dpr = _main.C.dpr;
  x = x * dpr || 0;
  y = y * dpr || 0;
  cvs.width = width = (isNaN(width) ? image.width : width) * dpr;
  cvs.height = height = (isNaN(height) ? image.height : height) * dpr;
  ctx.imageSmoothingEnabled = smoothen;
  ctx.drawImage(image, 0, 0, width, height);
  return ctx.getImageData(x, y, width, height);
}

},{"../color/color_reader.js":7,"../main.js":17}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.C = C;
var _utils = require("./utils.js");
/**
 * Main Function
 *
 * @param {Function} fx codes to exeecute
 * @param {Element|string} [container=document.body] container for the drawings as an element or css selector
 * @param {Object} [cfgs] configurations
 */
function C(fx, container, cfgs = {}) {
  const defaultConfigs = {
    width: 200,
    // width of canvas multiplied by dpr
    height: 200,
    // height of canvas  multiplied by dpr

    dpr: Math.ceil(globalThis.devicePixelRatio || 1),
    // device pixel ratio for clear drawings

    // states
    doFill: true,
    doStroke: true,
    pathStarted: false,
    yAxisInverted: false,
    xAxisInverted: false,
    pauseAnimations: false,
    netRotation: 0,
    currentLoop: undefined,
    currentLoopName: undefined,
    textAlign: "start",
    textBaseline: "alphabetic",
    // color stuff
    fillStyle: "#ffffff",
    background: "#ffffff",
    strokeStyle: "#000000",
    colorMode: "rgba",
    lineWidth: 1,
    // font properties
    fontSize: "20px",
    fontFamily: "serif",
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: "normal",
    fontStretch: "normal",
    lineHeight: 1.2,
    font: "20px serif",
    // event listeners
    events: {}
  };

  // assign configs
  let configs = (0, _utils.applyDefault)(defaultConfigs, cfgs);
  /** @type {HTMLCanvasElement} */
  let canvas;
  if (typeof container === "string") {
    container = document.querySelector(container);
  } else if (!(container instanceof HTMLElement)) {
    container = document.body;
  }
  // initialize canvas
  let c = container.querySelector("canvas");
  let canvasExists = c && c.id == configs.name;
  if (canvasExists) canvas = c;else canvas = C.makeCanvas(configs);
  if (typeof container.CID !== "number") container.CID = 1;
  let parentCID = container.CID,
    parentName = container.id || container.classList.item(0),
    canvasName = configs.name || canvas.name;
  if (typeof canvasName != "string") {
    canvasName = parentName + "-C-" + parentCID;
    configs.name = canvasName;
  }
  function prepareCanvas() {
    // add additional information to rendererContext
    C.resizeCanvas(canvas, configs);
    /** @type {CanvasRenderingContext2D} */
    let crc2d = canvas.getContext("2d");
    (0, _utils.defineProperties)(configs, crc2d);
    canvas.context = crc2d;
    canvas.context.setTransform(configs.dpr, 0, 0, configs.dpr, 0, 0);
    C.workingContext = canvas.context;
    C.workingContext.savedStates = defaultConfigs;
    C.workingContext.delayedAnimations = [];
  }
  // set canvas's id and class to its name
  canvas.id = canvasName;
  canvas.classList.add(canvasName);
  // add canvas to container
  container.appendChild(canvas);
  if (canvasExists) C.workingContext = canvas.context;else prepareCanvas();
  C.contextList[canvasName] = canvas.context;

  // attach event listeners
  let active = {};
  for (let event in configs.events) {
    let listener = configs.events[event];
    if (listener) {
      canvas.addEventListener(event, listener);
      active[event] = listener;
    }
  }
  // attach list of active listeners to canvas for other uses
  canvas.events = active;
  C.dpr = configs.dpr;
  C.workingCanvas = canvas;
  fx();
}

/**
 * List of available canvases
 * @type {Object}
 */
C.contextList = {};

// C.delayedAnimations = [];

/**
 * Number of canvases
 * @type number
 */
C.nameID = 0;

/**
 * Current working context
 * @type {CanvasRenderingContext2D}
 */
C.workingContext; // index of current working canvas in `C.contextList`

/**
 * Current working canvas
 * @type {HTMLCanvasElement}
 */
C.workingCanvas;

/**
 * device pixel ratio applied to current working canvas.
 ** Note: this property is not explictly defined in C.workingContext because it will get pruned in GCC compilation
 * @type {number}
 */
C.dpr;

/**
 * Default configurations
 */

/**
 * return inner width of container tag
 * @param {HTMLElement} [container=document.body]
 * @returns {number}
 */
C.getWindowWidth = function (container = document.body) {
  const cs = globalThis.getComputedStyle(container);
  return parseInt(cs.width, 10) - parseInt(cs.paddingRight, 10) - parseInt(cs.paddingLeft, 10);
};

/**
 * Set width and height attribute of canvas element to the given values in `configs`
 * and scales CSS width and height to DPR
 *
 * @param {HTMLCanvasElement} cvs
 * @param {Object} configs configurations. Values needed :
 * @param {number} configs.dpr Device pixel ratio
 * @param {number} configs.width Width in pixels
 * @param {number} configs.height Height in pixels
 */
C.resizeCanvas = function (cvs, configs) {
  const width = configs.width;
  const height = configs.height;
  const dpr = configs.dpr || globalThis.devicePixelRatio;
  cvs.style.width = width + "px";
  cvs.style.height = height + "px";
  cvs.width = dpr * width;
  cvs.height = dpr * height;
  cvs.rWidth = width;
  cvs.rHeight = height;
};

/**
 * Returns a canvas element with given params
 *
 * @param {Object} configs
 * @returns {HTMLCanvasElement}
 */
C.makeCanvas = function (configs) {
  const cvs = document.createElement("canvas");
  C.resizeCanvas(cvs, configs);
  return cvs;
};

/**
 * Add extension to globalThis and C extension list
 *
 * @param {Object} extObj
 */
C.addExtension = function (extObj) {
  (0, _utils.defineProperties)(extObj, globalThis);
  (0, _utils.defineProperties)(extObj, C.extensions, false);
};

/**
 * @type {boolean}
 */
C.debugAnimations = false; // whther to debug animations

/**
 * List of extensions
 * @type {Object}
 */
C.extensions = {};

/**
 * Whehter to debug animations
 *
 * @param {boolean} bool boolean
 */
C.debug = function (bool) {
  if (typeof bool !== "boolean") C.debugAnimations = true;else C.debugAnimations = bool;
};

/**
 * Returns the current working canvas or the canvas with given name.
 * With this you can access native JS canvas functions for better performance
 * @param {string} name Name of canvas
 * @returns {CanvasRenderingContext2D} Canvas context
 */
C.getCanvas = function (name) {
  return C.contextList[name] || C.workingContext;
};

/**
 * Log of animations
 * @type {Array<Object>}
 */
C._ANIMATIONLOG_ = [];

/**
 * Set of functions
 * @type {Object}
 */
C.functions = {};
C.COLORLIST = {}; //list of colors

function defineConstant(constantList) {
  let constants = Object.keys(constantList);
  for (let i = 0; i < constants.length; i++) {
    let constant = constants[i];
    Object.defineProperty(globalThis, constant, {
      configurable: true,
      enumerable: true,
      get: constantList[constant],
      set: function (val) {
        Object.defineProperty(globalThis, constant, {
          configurable: true,
          enumerable: true,
          value: val,
          writable: true
        });
      }
    });
  }
}
defineConstant({
  CENTERX: function () {
    return C.workingCanvas.rWidth / 2;
  },
  CENTERY: function () {
    return C.workingCanvas.rHeight / 2;
  }
});

// register to globalThis
globalThis["C"] = C;

},{"./utils.js":36}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gcd = gcd;
exports.gcdArray = gcdArray;
exports.lcm = lcm;
exports.lcmArray = lcmArray;
/** @module Arithmetic-Functions*/
/**
 * Computes GCD (Greatest Common Divisor) or HCF (Highest Common Factor) of two numbers
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function gcd(a, b) {
  while (b != 0) {
    let ra = b;
    b = a % b;
    a = ra;
  }
  return a;
}

/**
 * Returns greatest common divisor of a list of integers.
 *
 * @returns {number}
 */
function gcdArray(list) {
  let array = Array.isArray(list) ? list : arguments,
    n = array[0];
  for (let i = 1; i < array.length; ++i) n = gcd(array[i], n);
  return n;
}

/**
 * Computes LCM (Least Common Multiple) of two numbers
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function lcm(a, b) {
  return a * b / gcd(a, b);
}

/**
 * Returns least common multiple of a list of integers given explictly or as array.
 * @returns {number}
 */
function lcmArray(list) {
  let n = 1,
    array = Array.isArray(list) ? list : arguments;
  for (let i = 0; i < array.length; ++i) n = lcm(array[i], n);
  return n;
}

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sgn = exports.round = exports.random = exports.pow = exports.min = exports.max = exports.log2 = exports.log10 = exports.log = exports.floor = exports.exp = exports.cosh = exports.cos = exports.ceil = exports.cbrt = exports.atan2 = exports.atan = exports.asin = exports.acos = exports.abs = void 0;
exports.sigmoid = sigmoid;
exports.tanh = exports.tan = exports.sqrt = exports.sin = void 0;
const {
  abs,
  acos,
  asin,
  atan,
  atan2,
  cbrt,
  ceil,
  cos,
  cosh,
  exp,
  floor,
  log,
  log2,
  log10,
  max,
  min,
  pow,
  random,
  round,
  sign: sgn,
  sin,
  sqrt,
  tan,
  tanh
} = Math;
exports.tanh = tanh;
exports.tan = tan;
exports.sqrt = sqrt;
exports.sin = sin;
exports.sgn = sgn;
exports.round = round;
exports.random = random;
exports.pow = pow;
exports.min = min;
exports.max = max;
exports.log10 = log10;
exports.log2 = log2;
exports.log = log;
exports.floor = floor;
exports.exp = exp;
exports.cosh = cosh;
exports.cos = cos;
exports.ceil = ceil;
exports.cbrt = cbrt;
exports.atan2 = atan2;
exports.atan = atan;
exports.asin = asin;
exports.acos = acos;
exports.abs = abs;
function sigmoid(t) {
  return 1.0 / (1 + Math.exp(-t));
}

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circleIntersection = circleIntersection;
exports.dist = dist;
exports.extendFromOrigin = extendFromOrigin;
exports.extendFromPoint = extendFromPoint;
exports.lineIntersection = lineIntersection;
exports.rotateAroundOrigin = rotateAroundOrigin;
exports.rotateAroundPoint = rotateAroundPoint;
/** @module Point-Utils*/
/**
 * return distance between two points
 *
 * @param {number[]} p1
 * @param {number[]} p2
 * @returns {number} distance between p1 and p2
 */
function dist(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

/**
 * Returns a point rotated around a point by certain angle, exetened by a certain length
 *
 * @param {number|number[]} x center x or center as array of coords [x, y]
 * @param {number} y center y
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {number[]} array of two points
 */
function rotateAroundPoint(x, y, angle, len = 10) {
  if (Array.isArray(x) && x.length === 2) {
    y = x[1];
    x = x[0];
  }
  return [Math.cos(angle) * len + x, Math.sin(angle) * len + y];
}

/**
 * Returns a point rotated around origin by certain angle, exetened by a certain length
 *
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {number[]} array of two points
 */
function rotateAroundOrigin(angle, len = 10) {
  return rotateAroundPoint(0, 0, angle, len);
}

/**
 * Returns the point of intersection of two lines.
 *
 * @param {number[]} p1 start point of first line as [x, y]
 * @param {number[]} p2 end point of first line as [x, y]
 * @param {number[]} p3 start point of second line as [x, y]
 * @param {number[]} p4 end point of second line as [x, y]
 * @return {number[]|Iterable} intersection point of lines as [x, y]
 */
function lineIntersection(p1, p2, p3, p4) {
  const m1 = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  const m2 = (p4[1] - p3[1]) / (p4[0] - p3[0]);
  const c1 = p1[1] - p1[0] * m1;
  const c2 = p3[1] - p3[0] * m2;
  const x = (c2 - c1) / (m1 - m2);
  const y = m1 * x + c1;
  return [x, y];
}

/**
 * Finds intersection of two circles.
 * Adapted from {@link https://stackoverflow.com/a/14146166}
 *
 * @param {number[]} c1 center of first circle as [x, y]
 * @param {number} r1 radius of first circle
 * @param {number[]} c2 center of second circle as [x, y]
 * @param {number} r2 radius of second circle
 * @return {number[][]} array of two points as [x, y]
 */
function circleIntersection(c1, r1, c2, r2) {
  const d = dist(c1, c2);
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(r1 * r1 - a * a);
  const s = a / d;
  const p2 = [(c2[0] - c1[0]) * s + c1[0], (c2[1] - c1[1]) * s + c1[1]];
  return [[p2[0] + h * (c2[1] - c1[1]) / d, p2[1] - h * (c2[0] - c1[0]) / d], [p2[0] - h * (c2[1] - c1[1]) / d, p2[1] + h * (c2[0] - c1[0]) / d]];
}

/**
 * Extend a point by given length from a given center
 * @param {number[]} center center from the point to be extended
 * @param {number[]} point point to be extended
 * @param {number} len length to extend the point
 * @returns {number[]}
 */
function extendFromPoint(center, point, len = 10) {
  let dx = point[0] - center[0],
    dy = point[1] - center[1],
    angle = Math.atan2(dy, dx),
    distance = Math.sqrt(dx * dx + dy * dy) + len; // total extended length
  return [center[0] + Math.cos(angle) * distance, center[1] + Math.sin(angle) * distance];
}

/**
 * Extend a point by given length from origin (0, 0)
 * @param {number[]} point point to be extended
 * @param {number} len length to extend the point
 * @returns {number[]}
 */
function extendFromOrigin(point, len = 10) {
  return extendFromPoint([0, 0], point, len);
}

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomInt = randomInt;
/** @module Random-Functions*/
/**
 * Returns a random integer between given range.
 *
 * @param {number} [max=10] maximum range
 * @param {number} [min=0] minimum range
 * @returns {number}
 */
function randomInt(max = 10, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doubleSmooth = doubleSmooth;
exports.easeInBack = easeInBack;
exports.easeInBounce = easeInBounce;
exports.easeInCirc = easeInCirc;
exports.easeInCubic = easeInCubic;
exports.easeInElastic = easeInElastic;
exports.easeInExpo = easeInExpo;
exports.easeInOutBack = easeInOutBack;
exports.easeInOutBounce = easeInOutBounce;
exports.easeInOutCirc = easeInOutCirc;
exports.easeInOutCubic = easeInOutCubic;
exports.easeInOutElastic = easeInOutElastic;
exports.easeInOutExpo = easeInOutExpo;
exports.easeInOutQuad = easeInOutQuad;
exports.easeInOutQuart = easeInOutQuart;
exports.easeInOutQuint = easeInOutQuint;
exports.easeInOutSine = easeInOutSine;
exports.easeInQuad = easeInQuad;
exports.easeInQuart = easeInQuart;
exports.easeInQuint = easeInQuint;
exports.easeInSine = easeInSine;
exports.easeOutBack = easeOutBack;
exports.easeOutBounce = easeOutBounce;
exports.easeOutCirc = easeOutCirc;
exports.easeOutCubic = easeOutCubic;
exports.easeOutElastic = easeOutElastic;
exports.easeOutExpo = easeOutExpo;
exports.easeOutQuad = easeOutQuad;
exports.easeOutQuart = easeOutQuart;
exports.easeOutQuint = easeOutQuint;
exports.easeOutSine = easeOutSine;
exports.exponentialDecay = exponentialDecay;
exports.linear = linear;
exports.lingering = lingering;
exports.notQuiteThere = notQuiteThere;
exports.rushFrom = rushFrom;
exports.rushInto = rushInto;
exports.slowInto = slowInto;
exports.smooth = smooth;
exports.squishRateFunc = squishRateFunc;
exports.thereAndBack = thereAndBack;
exports.thereAndBackWithPause = thereAndBackWithPause;
exports.wiggle = wiggle;
var _functions = require("./functions.js");
/**
 * Rate functions. From https://easings.net .
 * All Functions accept input from 0 to 1 and return output between 0 to 1
 * @ignore
 */
const c1 = 1.70158,
  c2 = c1 * 1.525,
  c3 = c1 + 1,
  c4 = 2 * Math.PI / 3,
  c5 = 2 * Math.PI / 4.5;
function easeOutBounce(t) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;else return n1 * (t -= 2.625 / d1) * t + 0.984375;
}
function linear(t) {
  return t;
}
function easeInQuad(t) {
  return t ** 2;
}
function easeOutQuad(t) {
  return 1 - (1 - t) ** 2;
}
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t ** 2 : 1 - Math.pow(2 - 2 * t, 2) / 2;
}
function easeInCubic(t) {
  return t ** 3;
}
function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(2 - 2 * t, 3) / 2;
}
function easeInQuart(t) {
  return t ** 4;
}
function easeOutQuart(t) {
  return 1 - (1 - t) ** 4;
}
function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(2 - 2 * t, 4) / 2;
}
function easeInQuint(t) {
  return t ** 5;
}
function easeOutQuint(t) {
  return 1 - (1 - t) ** 5;
}
function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(2 - 2 * t, 5) / 2;
}
function easeInSine(t) {
  return 1 - Math.cos(t * Math.PI / 2);
}
function easeOutSine(t) {
  return Math.sin(t * Math.PI / 2);
}
function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}
function easeInExpo(t) {
  return t == 0 ? 0 : Math.pow(2, 10 * t - 10);
}
function easeOutExpo(t) {
  return t == 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function easeInOutExpo(t) {
  if (t == 0) return 0;else if (t == 1) return 1;else if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;else return (2 - Math.pow(2, 10 - 20 * t)) / 2;
}
function easeInCirc(t) {
  return 1 - Math.sqrt(1 - t ** 2);
}
function easeOutCirc(t) {
  return Math.sqrt(1 - (t - 1) ** 2);
}
function easeInOutCirc(t) {
  if (t < 0.5) return (1 - Math.sqrt(1 - (2 * t) ** 2)) / 2;else return (Math.sqrt(1 - (2 - 2 * t) ** 2) + 1) / 2;
}
function easeInBack(t) {
  return c3 * t ** 3 - c1 * t ** 2;
}
function easeOutBack(t) {
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}
function easeInOutBack(t) {
  if (t < 0.5) return (2 * t) ** 2 * ((c2 + 1) * 2 * t - c2) / 2;else return ((2 * t - 2) ** 2 * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
}
function easeInElastic(t) {
  if (t === 0) return 0;else if (t === 1) return 1;else return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
}
function easeOutElastic(t) {
  if (t === 0) return 0;else if (t === 1) return 1;else return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}
function easeInOutElastic(t) {
  if (t == 0) return 0;else if (t == 1) return 1;else if (t < 0.5) return -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2;else return Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5) / 2 + 1;
}
function easeInBounce(t) {
  return 1 - easeOutBounce(1 - t);
}
function easeInOutBounce(t) {
  if (t < 0.5) return (1 - easeOutBounce(1 - 2 * t)) / 2;else return (1 + easeOutBounce(2 * t - 1)) / 2;
}

// manim rate funcitons
function smooth(t, inflection = 10.0) {
  let error = (0, _functions.sigmoid)(-inflection / 2);
  return Math.min(Math.max(((0, _functions.sigmoid)(inflection * (t - 0.5)) - error) / (1 - 2 * error), 0), 1);
}
function rushInto(t, inflection = 10.0) {
  return 2 * smooth(t / 2.0, inflection);
}
function rushFrom(t, inflection = 10.0) {
  return 2 * smooth(t / 2.0 + 0.5, inflection) - 1;
}
function slowInto(t) {
  return Math.sqrt(1 - (1 - t) * (1 - t));
}
function doubleSmooth(t) {
  if (t < 0.5) return 0.5 * smooth(2 * t);else return 0.5 * (1 + smooth(2 * t - 1));
}
function thereAndBack(t, inflection = 10.0) {
  return smooth(t < 0.5 ? 2 * t : 2 * (1 - t), inflection);
}
function thereAndBackWithPause(t, pauseRatio = 1.0 / 3) {
  let a = 1.0 / pauseRatio;
  if (t < 0.5 - pauseRatio / 2) return smooth(a * t);else if (t < 0.5 + pauseRatio / 2) return 1;else return smooth(a - a * t);
}
function notQuiteThere(func = smooth, proportion = 0.7) {
  return t => proportion * func(t);
}
function wiggle(t, wiggles = 2) {
  return thereAndBack(t) * Math.sin(wiggles * Math.PI * t);
}
function squishRateFunc(func, a = 0.4, b = 0.6) {
  return function result(t) {
    if (a == b) return a;
    if (t < a) return func(0);else if (t > b) return func(1);else return func((t - a) / (b - a));
  };
}
function lingering(t) {
  return squishRateFunc(t => t, 0, 0.8)(t);
}
function exponentialDecay(t, halfLife = 0.1) {
  return 1 - Math.exp(-t / halfLife);
}

// export function runningStart(t, pullFactor = -0.5) {
// 	return bezier([0, 0, pullFactor, pullFactor, 1, 1, 1])(t);
// }

},{"./functions.js":19}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrow = arrow;
exports.arrowTip = arrowTip;
exports.curvedArrow = curvedArrow;
exports.curvedArrowBetweenPoints = curvedArrowBetweenPoints;
exports.curvedDoubleArrow = curvedDoubleArrow;
exports.curvedDoubleArrowBetweenPoints = curvedDoubleArrowBetweenPoints;
exports.doubleArrow = doubleArrow;
exports.measurement = measurement;
var _drawing = require("../constants/drawing.js");
var _main = require("../main.js");
var _points = require("../math/points.js");
var _settings = require("../settings.js");
var _utils = require("../utils.js");
var _text = require("./text.js");
/** @module Arrows */

const DEFAULT_TIP_WIDTH = 15;
const TRANSPARENT = "rgba(0,0,0,0)";
/**
 * Draws a arrow tip
 *
 * @param {number} x1 x position of start point
 * @param {number} y1 y position of start point
 * @param {number} x2 x position of end point
 * @param {number} y2 y position of end point
 * @param {number} length length of tip
 * @param {number} breadth breadth of tip
 */
function arrowTip(x1, y1, x2, y2, length, breadth) {
  let ctx = _main.C.workingContext;
  let thickness = ctx.lineWidth;
  let distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  if (isNaN(length)) length = distance;
  breadth = breadth || length / 1.2;
  let w = length - distance;
  let r = Math.sqrt(w ** 2 + (breadth / 2) ** 2);
  let t = Math.atan(breadth / (w * 2));
  if (distance > length) t = t + Math.PI;
  let angleFromXAxis = Math.atan2(y2 - y1, x2 - x1);
  let A = [x1 - Math.cos(t + angleFromXAxis) * r, y1 - Math.sin(t + angleFromXAxis) * r];
  let B = [x1 - Math.cos(-t + angleFromXAxis) * r, y1 - Math.sin(-t + angleFromXAxis) * r];
  if (ctx.doStroke && ctx.lineJoin != _drawing.BEVEL) {
    // correcting tip
    x2 -= Math.cos(angleFromXAxis) * thickness;
    y2 -= Math.sin(angleFromXAxis) * thickness;
  }
  ctx.save();
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(A[0], A[1]);
  ctx.lineTo(x2, y2);
  ctx.lineTo(B[0], B[1]);
  ctx.lineTo(x1, y1);
  if (!ctx.pathStarted) {
    (0, _utils.doFillAndStroke)(ctx);
    ctx.closePath();
  }
  ctx.restore();
}

/**
 * draws a arrow
 *
 * @param {number} x1 starting x-axis coord
 * @param {number} y1 starting y-axis coord
 * @param {number} x2 ending x-axis coord
 * @param {number} y2 ending y-axis coord
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipBreadth Breadth of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving = 0] worping of arrow
 * @param {number} [spacing = 0] padding from end to tip
 *
 */
function arrow(x1, y1, x2, y2, tipLength = DEFAULT_TIP_WIDTH, tipBreadth = tipLength / 1.2, arrowCurving = 0, spacing = 0) {
  const angle = Math.atan2(y2 - y1, x2 - x1); // angle from plain
  const yDiff = Math.sin(angle) * spacing;
  const xDiff = Math.cos(angle) * spacing;

  // decrease the length of tip by `spacing`
  x2 -= xDiff;
  y2 -= yDiff;
  const xTipSpacing = Math.cos(angle) * (tipLength - arrowCurving);
  const yTipSpacing = Math.sin(angle) * (tipLength - arrowCurving);
  const ctx = _main.C.workingContext;
  const pathStarted = ctx.pathStarted;
  if (!pathStarted) (0, _settings.startShape)();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - xTipSpacing, y2 - yTipSpacing);
  ctx.stroke();
  arrowTip(x2 - xTipSpacing, y2 - yTipSpacing, x2, y2, tipLength, tipBreadth);
  if (!pathStarted) {
    (0, _utils.doFillAndStroke)(ctx);
    (0, _settings.endShape)();
  }
}

/**
 * Draws a double tipped arrow
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} [tipBreadth] breadth of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving = 0]
 * @param {number} [spacing=0]
 */
function doubleArrow(x1, y1, x2, y2, tipLength = DEFAULT_TIP_WIDTH, tipBreadth = tipLength / 1.2, arrowCurving = 0, spacing = 0) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const xPadding = Math.cos(angle) * (tipLength - arrowCurving);
  const yPadding = Math.sin(angle) * (tipLength - arrowCurving);
  const ySpacing = Math.sin(angle) * spacing;
  const xSpacing = Math.cos(angle) * spacing;
  (0, _settings.startShape)();
  x1 += xPadding + xSpacing;
  y1 += yPadding + ySpacing;
  arrow(x1, y1, x2, y2, tipLength, tipBreadth, arrowCurving, spacing);
  arrowTip(x1, y1, x1 - xPadding, y1 - yPadding, tipLength, tipBreadth);
  (0, _utils.doFillAndStroke)(_main.C.workingContext);
  (0, _settings.endShape)();
}

/**
 * Draws a double tipped arrow with text in the middle
 *
 * @param {Object} args parameters.
 * Possible values:
 * @param {string} args.text text
 * @param {number[]} args.p1 first point
 * @param {number[]} args.p2 second point
 * @param {number} [args.tipLength = 15] tip width
 * @param {number} [args.tipBreadth = 12.5] tip height
 * @param {number} [args.spacing = 0] spacing
 * @param {string|number} args.background background of text
 * @param {number} args.innerPadding padding of text
 * @param {number} args.outerPadding tip spacing
 * @param {number} args.textRotation rotatioin of text
 * @param {number} args.arrowCurving worping of arrow
 */
function measurement(args) {
  const ctx = _main.C.workingContext;
  const defaults = {
    background: TRANSPARENT,
    tipLength: DEFAULT_TIP_WIDTH,
    tipBreadth: DEFAULT_TIP_WIDTH / 1.2,
    innerPadding: 3,
    outerPadding: 0,
    textRotation: 0,
    arrowCurving: 0
  };
  args = (0, _utils.applyDefault)(defaults, args);
  const {
    p1,
    p2
  } = args;
  const angleFromXAxis = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
  const {
    width
  } = ctx.measureText(args.text);
  const innerPadding = [Math.cos(angleFromXAxis) * (args.innerPadding + width / 2), Math.sin(angleFromXAxis) * (args.innerPadding + width / 2)];
  const center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];

  // draw arrows
  arrow(center[0] - innerPadding[0], center[1] - innerPadding[1], p1[0], p1[1], args.tipLength, args.tipBreadth, args.arrowCurving, args.outerPadding);
  arrow(center[0] + innerPadding[0], center[1] + innerPadding[1], p2[0], p2[1], args.tipLength, args.tipBreadth, args.arrowCurving, args.outerPadding);
  (0, _settings.save)();
  ctx.translate(center[0], center[1]);
  ctx.textAlign = _drawing.CENTER;
  ctx.textBaseline = _drawing.MIDDLE;
  ctx.rotate(Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) + args.textRotation);
  (0, _text.fillText)(args.text, 0, 0);
  (0, _settings.restore)();
}

/**
 * Draws a curved arrow that wrap around a circle.
 *
 * @param {number} x x position of circle
 * @param {number} y y position of circle
 * @param {number} radius radius of circle
 * @param {number} [angle=1.5707963267948966] central angle of arc
 * @param {number} [startAngle=0] starting angle
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipBreadth height of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving=0] arrow curving constant
 * @param {number} [tipOffset=10] offset (padding) of tip from it's defined end
 * @param {boolean} [reverse=false] whether to reverse the direction of arrow
 */
function curvedArrow(x, y, radius, angle = Math.PI / 2, startAngle = 0, tipLength = DEFAULT_TIP_WIDTH, tipBreadth = tipLength / 1.2, arrowCurving = 0, tipOffset = 0, reverse = false) {
  const ctx = _main.C.workingContext;
  const tipAngularDiameter = tipLength / radius;
  ctx.save();
  arrowCurving /= radius;
  let padding = tipAngularDiameter - arrowCurving;
  ctx.beginPath();
  if (reverse) {
    padding += tipOffset;
    ctx.arc(x, y, radius, padding + startAngle, angle + startAngle);
    ctx.stroke();
    ctx.closePath();
    arrowTip(x + radius * Math.cos(startAngle + padding), y + radius * Math.sin(startAngle + padding), x + radius * Math.cos(startAngle + tipOffset), y + radius * Math.sin(startAngle + tipOffset), tipLength, tipBreadth);
  } else {
    angle -= tipOffset;
    ctx.arc(x, y, radius, startAngle, angle - padding + startAngle);
    ctx.stroke();
    ctx.closePath();
    arrowTip(x + radius * Math.cos(startAngle + angle - padding), y + radius * Math.sin(startAngle + angle - padding), x + radius * Math.cos(startAngle + angle), y + radius * Math.sin(startAngle + angle), tipLength, tipBreadth);
  }
  ctx.restore();
}

/**
 * Draws a curved arrow with two tips.
 *
 * @param {number} x x position of circle
 * @param {number} y y position of circle
 * @param {number} radius radius of circle
 * @param {number} [angle=1.5707963267948966] central angle of arrow in radians
 * @param {number} [startAngle=0] start angle of arrow in radians
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of arrow tip
 * @param {number} tipBreadth height of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving=0] curving of arrow
 * @param {number} [tipOffset=0] angular offset of arrow from radial boundaries in radians.
 */
function curvedDoubleArrow(x, y, radius, angle = Math.PI / 2, startAngle = 0, tipLength = DEFAULT_TIP_WIDTH, tipBreadth = tipLength / 1.2, arrowCurving = 0, tipOffset = 0) {
  const ctx = _main.C.workingContext;
  ctx.save();
  const tipAngularDiameter = tipLength / radius;
  const tangent = [-Math.cos(startAngle + tipAngularDiameter / 2 + Math.PI / 2), -Math.sin(startAngle + tipAngularDiameter / 2 + Math.PI / 2)];
  angle -= tipAngularDiameter;
  startAngle += tipAngularDiameter + tipOffset * 2;
  curvedArrow(x, y, radius, angle + arrowCurving / radius, startAngle - arrowCurving / radius, tipLength, tipBreadth, arrowCurving, tipOffset);
  arrowTip(Math.cos(startAngle - arrowCurving / radius) * radius, Math.sin(startAngle - arrowCurving / radius) * radius, Math.cos(startAngle) * radius + tipLength * tangent[0], Math.sin(startAngle) * radius + tipLength * tangent[1], tipLength, tipBreadth);
  ctx.restore();
}

/**
 * Draws a curved arrow between two points that wraps around a circle with a definite radius.
 *
 * @param {number[]} p1 start point
 * @param {number[]} p2 end point
 * @param {number} radius radius of circle
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipBreadth height of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving=0] arrow curving const. Expressed in pixels
 * @param {number} [tipOffset=0] offset (padding) of tip from it's defined end. Expressed in radians
 * @param {boolean} [otherArc=false] whether to use other arc
 * @param {boolean} [reverse=false] whether to reverse the direction of arrow.
 * @return {number[]} coordiante of the center of arc as [x, y]
 */
function curvedArrowBetweenPoints(p1, p2, radius, tipLength = DEFAULT_TIP_WIDTH, tipBreadth = tipLength / 1.2, arrowCurving = 0, tipOffset = 0, otherArc = false, reverse = false) {
  const ctx = _main.C.workingContext;
  const pathStarted = ctx.pathStarted;
  ctx.save();
  if (!pathStarted) ctx.beginPath();
  const center = (0, _points.circleIntersection)(p1, radius, p2, radius)[0];
  p1[0] -= center[0];
  p1[1] -= center[1];
  p2[0] -= center[0];
  p2[1] -= center[1];
  const p1Angle = Math.atan2(p1[1], p1[0]);
  const p2Angle = Math.atan2(p2[1], p2[0]);
  let angleBetweenPoints, startAngle;
  if (otherArc) {
    startAngle = p1Angle;
    angleBetweenPoints = p2Angle - p1Angle;
  } else {
    startAngle = p2Angle;
    angleBetweenPoints = p1Angle - p2Angle;
  }
  curvedArrow(center[0], center[1], radius, angleBetweenPoints, startAngle, tipLength, tipBreadth, arrowCurving, tipOffset, reverse);
  if (!pathStarted) ctx.closePath();
  ctx.restore();
  return center;
}

/**
 * Draws a double tipped curved arrow between two points that wraps around a circle with a definite radius.
 *
 * @param {number[]} p1 start point
 * @param {number[]} p2 end point
 * @param {number} radius radius of circle
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipBreadth height of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving=0] arrow curving const. Expressed in pixels
 * @param {number} [tipOffset=0] offset (padding) of tip from it's defined. Expressed in radians
 * @param {boolean} [otherArc=false] whether to use other arc
 * @return {number[]} coordiante of the center of arc as [x, y]
 */
function curvedDoubleArrowBetweenPoints(p1, p2, radius, tipLength = DEFAULT_TIP_WIDTH, tipBreadth = tipLength / 1.2, arrowCurving = 0, tipOffset = 0, otherArc = false) {
  const ctx = _main.C.workingContext;
  ctx.save();
  const center = (0, _points.circleIntersection)(p1, radius, p2, radius)[0];
  p1[0] -= center[0];
  p1[1] -= center[1];
  p2[0] -= center[0];
  p2[1] -= center[1];
  const tipAngularDiameter = tipLength / radius;
  const p1Angle = Math.atan2(p1[1], p1[0]);
  const p2Angle = Math.atan2(p2[1], p2[0]) + tipAngularDiameter;
  let angleBetweenPoints, startAngle;
  if (otherArc) {
    startAngle = p1Angle;
    angleBetweenPoints = p2Angle - p1Angle;
  } else {
    startAngle = p2Angle;
    angleBetweenPoints = p1Angle - p2Angle;
  }
  arrowCurving /= radius;
  curvedArrow(center[0], center[1], radius, angleBetweenPoints + arrowCurving - tipOffset, startAngle - arrowCurving + tipOffset, tipLength, tipBreadth, arrowCurving * radius, tipOffset);
  let padding = tipAngularDiameter - arrowCurving + tipOffset;
  startAngle -= tipAngularDiameter;
  arrowTip(center[0] + radius * Math.cos(startAngle + padding), center[1] + radius * Math.sin(startAngle + padding), center[0] + radius * Math.cos(startAngle + tipOffset), center[1] + radius * Math.sin(startAngle + tipOffset), tipLength, tipBreadth);
  ctx.restore();
  return center;
}

},{"../constants/drawing.js":13,"../main.js":17,"../math/points.js":20,"../settings.js":35,"../utils.js":36,"./text.js":34}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arcBrace = arcBrace;
exports.curlyBrace = curlyBrace;
var _main = require("../main.js");
/** @module Braces */

/**
 * Draws a curly brace
 * Code adapted from http://bl.ocks.org/alexhornbake/6005176
 *
 * @param {number} x1 x-axis coord of starting point
 * @param {number} y1 y-axis coord of starting point
 * @param {number} x2 x-axis coord of ending point
 * @param {number} y2 y-axis coord of ending point
 * @param {number} [size=30] outward size of brace
 * @param {number} [curviness=0.6] curviness of brace. '0' doesn't make flat brace
 * @param {number} [taleLength=0.8] length of tale proportional to size \ length
 */
function curlyBrace(x1, y1, x2, y2, size = 20, curviness = 0.6, taleLength = 0.8) {
  //Calculate unit vector
  let dx = x1 - x2;
  let dy = y1 - y2;
  let len = Math.sqrt(dx * dx + dy * dy);
  dx /= len;
  dy /= len;

  //Calculate Control Points of path,
  const cp1x = x1 + curviness * size * dy;
  const cp1y = y1 - curviness * size * dx;
  const cp2x = x1 - 0.25 * len * dx + (1 - curviness) * size * dy;
  const cp2y = y1 - 0.25 * len * dy - (1 - curviness) * size * dx;
  const middleTipX = x1 - 0.5 * len * dx + size * dy * taleLength;
  const middleTipY = y1 - 0.5 * len * dy - size * dx * taleLength;
  const cp3x = x2 + curviness * size * dy;
  const cp3y = y2 - curviness * size * dx;
  const cp4x = x1 - 0.75 * len * dx + (1 - curviness) * size * dy;
  const cp4y = y1 - 0.75 * len * dy - (1 - curviness) * size * dx;
  const path = `M ${x1} ${y1} ` + `Q ${cp1x} ${cp1y} ${cp2x} ${cp2y} ` + `T ${middleTipX} ${middleTipY} ` + `M ${x2} ${y2} ` + `Q ${cp3x} ${cp3y} ${cp4x} ${cp4y} ` + `T ${middleTipX} ${middleTipY}`;
  _main.C.workingContext.stroke(new Path2D(path));
  return [middleTipX, middleTipY];
}

/**
 * Draws a brace that wraps a circle. Returns the coordinate of middle tip extended by a certain amound.
 *
 * @param {number} x x-axis coord
 * @param {number} y y-axis coord
 * @param {number} [radius=100] radius of circle
 * @param {number} [startAngle=0] starting angle
 * @param {number} [angle=1.5707963267948966] central angle
 * @param {number} [smallerLineLength=10] length of small tips at the ends of brace
 * @param {number} [tipLineLength=smallerLineLength] length of middle tip
 * @param {number} [extender=5] how much the coordinate of middle tip should be extended.
 * @return {number[]} array of two numbers that are the coordinate of middle tip extended by a certain value.
 */
function arcBrace(x, y, radius = 100, angle = Math.PI / 2, startAngle = 0, smallerLineLength = 10, tipLineLength = smallerLineLength, extender = 10) {
  const ctx = _main.C.workingContext,
    smallerRadius = radius - smallerLineLength,
    largerRadius = radius + tipLineLength;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(startAngle);
  ctx.beginPath();
  ctx.moveTo(radius, 0);

  // first smaller line
  ctx.lineTo(smallerRadius, 0);

  // The arc
  ctx.arc(0, 0, radius, 0, angle);

  // second smaller line
  ctx.lineTo(smallerRadius * Math.cos(angle), smallerRadius * Math.sin(angle));

  // tip line
  ctx.moveTo(radius * Math.cos(angle / 2), radius * Math.sin(angle / 2));
  ctx.lineTo(largerRadius * Math.cos(angle / 2), largerRadius * Math.sin(angle / 2));
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
  return [(largerRadius + extender) * Math.cos(angle / 2 + startAngle) + x, (largerRadius + extender) * Math.sin(angle / 2 + startAngle) + y];
}

},{"../main.js":17}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axes = axes;
var _main = require("../../main.js");
var _utils = require("../../utils.js");
var _cartesian_plotters = require("./cartesian_plotters.js");
var _number_line = require("./number_line.js");
const ORIGIN = [0, 0];

/**
 * Creates a axes.
 * @param {Object} configs Possible configurations are:
 * @param {Object} configs.xAxis Configurations for x axis. (See {@link numberLine} for more configurations)
 * @param {Object} configs.yAxis Configurations for y axis. (See {@link numberLine} for more configurations)
 * @param {number[]} [configs.originPosition = ORIGIN] originPosition of axes
 *
 * @returns {CartesianPlotters}
 */

function axes(configs = {}) {
  const ctx = _main.C.workingContext;
  // configurations
  configs = (0, _utils.applyDefault)({
    xAxis: {
      axisLabel: "x"
    },
    yAxis: {
      axisLabel: "y",
      rotation: Math.PI / 2,
      textRotation: -Math.PI / 2,
      labelDirection: [0, 0.8],
      textAlign: "right",
      axisLabelDirection: [0.3, 0.5],
      axisLabelSize: 20
    },
    originPosition: ORIGIN,
    numbersToExclude: [0],
    includeTicks: true,
    includeLeftTip: false,
    includeRightTip: true
  }, configs);
  ctx.save();
  assignCommonPropsToAxis(configs);

  // draws number lines
  const xAxisLine = (0, _number_line.numberLine)(configs.xAxis); // draw x axis
  const yAxisLine = (0, _number_line.numberLine)(configs.yAxis); // draw y axis

  ctx.restore();
  return (0, _cartesian_plotters.getCartasianFunctions)({
    originPosition: configs.originPosition,
    // originPosition of axis as [x, y] in px
    xAxis: xAxisLine,
    // x axis confiurations from numberLine
    yAxis: yAxisLine,
    // y axis confiurations from numberLine
    unitSpace: [xAxisLine.unitSpace, yAxisLine.unitSpace],
    // space between two ticks in pixels
    unitValue: [xAxisLine.unitValue, yAxisLine.unitValue] // value between two close ticks
  });
}

/**
 * Assigns common configs to individual axis if they're not already defined, from call point
 * @param {Object} configs
 */
function assignCommonPropsToAxis(configs) {
  for (let prop of Object.keys(configs)) {
    if (prop != "xAxis" || prop != "yAxis") {
      if (configs.xAxis[prop] === undefined) {
        configs.xAxis[prop] = configs[prop];
      }
      if (configs.yAxis[prop] === undefined) {
        configs.yAxis[prop] = configs[prop];
      }
    }
  }
}

},{"../../main.js":17,"../../utils.js":36,"./cartesian_plotters.js":26,"./number_line.js":27}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCartasianFunctions = getCartasianFunctions;
var _settings = require("../../settings.js");
var _functions = require("../functions.js");
/**
 * @typedef {Object} CartesianPlotters
 * @property {Function} plotParametricFunction see {@link parametricFunction}
 * @property {Function} plotFunctionGraph see {@link functionGraph}
 * @property {Function} plotHeatPlot see {@link heatPlot}
 * @property {Function} plotPoints see {@link plotPoints}
 */

/**
 * returns list of plotting functions based on given cartesian parameters
 *
 * @param {Object} configs
 * @return {CartesianPlotters}
 */
function getCartasianFunctions(configs) {
  return Object.assign(configs, {
    plotParametricFunction: function (cfg) {
      cfg.unitSpace = configs.unitSpace;
      cfg.unitValue = configs.unitValue;
      return (0, _functions.parametricFunction)(cfg);
    },
    plotFunctionGraph: function (cfg) {
      cfg.unitSpace = configs.unitSpace;
      cfg.unitValue = configs.unitValue;
      return (0, _functions.functionGraph)(cfg);
    },
    plotHeatPlot: function (cfg) {
      cfg.unitSpace = configs.unitSpace;
      console.log(cfg.unitSpace);
      cfg.min = configs.min || [configs.xAxis.range[0], configs.yAxis.range[0]];
      cfg.max = configs.max || [configs.xAxis.range[1], configs.yAxis.range[1]];
      return (0, _functions.heatPlot)(cfg);
    },
    plotPoints: function (cfg) {
      cfg.unitValue = configs.unitValue;
      cfg.unitSpace = configs.unitSpace;
      return (0, _functions.plotPoints)(cfg);
    },
    scaleCanvas: function () {
      let unitSizeX = configs.unitSpace[0] / configs.unitValue[0];
      let unitSizeY = configs.unitSpace[1] / configs.unitValue[1];
      (0, _settings.scale)(unitSizeX, unitSizeY);
    }
  });
}

},{"../../settings.js":35,"../functions.js":30}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberLine = numberLine;
var _c = require("../../c.js");
var _main = require("../../main.js");
var _settings = require("../../settings.js");
var _utils = require("../../utils.js");
var _arrows = require("../arrows.js");
var _geometry = require("../geometry.js");
var _text = require("../text.js");
/** @module Coordinate-Systems*/

const ORIGIN = [0, 0];

/**
 * Creates a numberLine with parameters in a object
 * @param {Object} configs configuration object
 *
 * @param {number} [configs.tipLength = 13] width of arrow tip in px
 * @param {number} [configs.tipBreadth = 10] height of tip
 * @param {number} [configs.longerTickHeight = 15] Height of longer ticks
 * @param {number} [configs.tickHeight = 10] Height of ticks in px
 * @param {number} [configs.fontSize = 17] Font size of text
 * @param {number} [configs.textRotation = 0] Amount to rotate text
 * @param {number} [configs.decimalPlaces] Number of decimal places in text. By default value is number of decimals in step
 * @param {number} [configs.rotation = 0] Amound to rotate the numberline from origin
 * @param {number} [configs.strokeWidth = 2] Width of lines in px
 * @param {number} [configs.length] Total length of numberline in pixels. Default is the width of canvas
 *
 * @param {string} [configs.strokeColor = "white"] Color of axis and ticks
 * @param {string} [configs.textColor = "white"] Color of text
 *
 * @param {number[]} [configs.labelDirection = [0, -1]] Direction of text relative to nearby tick
 * @param {number[]} [configs.numbersWithElongatedTicks] list of numbers where tick line should be longer
 * @param {number[]} [configs.originPosition = ORIGIN] position of the origin of number line in pixels.
 * @param {number[]} [configs.range] range of numbers to draw ticks and numbers. Default: [-5, 5, 1]
 * @param {number[]} [configs.labelsToInclude] list of labels to be displayed instead of default numbers
 * @param {number[]} [configs.numbersToExclude] list of numbers that shouldn't be displayed

 * @param {boolean} [configs.includeTicks = true] Whether ticks should be added
 * @param {boolean} [configs.includeLeftTip = false] whether to add an arrow tip at left
 * @param {boolean} [configs.includeRightTip = false] whether to add an arrow tip at right
 * @param {boolean} [configs.excludeOriginTick = false] Whether exclude ticks at origin
 * @param {boolean} [configs.includeLabels = true] whether to display labels
 *
 * @param {string} [configs.fontFamily = "serif"] font Family to use
 * @param {string} [configs.textAlign = "center"] to align text in x-axis
 * @param {string} [configs.textBaseline = "middle"] to align text in y-axis
 *
 * @param {Function} [configs.textRenderer = fillText] function that is used to render text.
 *
 * * You can adjust textAlign and textBaseline if you want to adjust alignment of labels.
 * @returns {NumberLineConfigs}
 */

function numberLine(configs = {}) {
  const ctx = _main.C.workingContext;
  const cvs = _main.C.workingCanvas;
  configs = (0, _utils.applyDefault)({
    rotation: 0,
    strokeWidth: 2,
    length: parseInt(cvs.style.width),
    originPosition: ORIGIN,
    range: [-5, 5, 1],
    strokeColor: _c.Colors.white + "88",
    axisLabel: "",
    axisLabelSize: 24,
    axisLabelColor: "#fff",
    axisLabelDirection: [0.5, 1.5],
    tipLength: 13,
    tipBreadth: 10,
    fontSize: 17,
    fontFamily: "serif",
    textRenderer: _text.fillText,
    textBaseline: "middle",
    textColor: "#fff",
    textAlign: "center",
    textRotation: 0,
    labelDirection: [0, -1.6],
    tickHeight: 10,
    longerTickHeight: 15,
    labelsToInclude: [],
    numbersToExclude: [],
    numbersWithElongatedTicks: [],
    includeTicks: true,
    includeLabels: true,
    includeLeftTip: false,
    includeRightTip: false
  }, configs);
  let {
    range,
    decimalPlaces
  } = configs;
  if (Array.isArray(range) && range.length > 0) {
    if (range.length === 1) {
      range = [0, range[0], 1];
    }
    if (range.length === 2) {
      range = [range[0], range[1], 1];
    }
  } else {
    throw new Error("NumberLine: range must be a array that have atleast one item. Got: " + range.toString());
  }

  // if number of decimal places is not defined, find it using `step`
  if (isNaN(decimalPlaces) && decimalPlaces >= 0) {
    configs.decimalPlaces = (range[2].toString().split(".")[1] || []).length;
  }
  let step = range[2],
    /** Space between two ticks in pixels*/
    unitSpace = configs.length / (range[1] - range[0]),
    /** A list of numbers that'll be displayed if no labels are given through numberToInclude */
    tickList = (0, _utils.arange)(range[0], range[1], step);
  configs.tickList = tickList;
  (0, _settings.save)();
  ctx.translate(configs.originPosition[0] * unitSpace, configs.originPosition[1] * unitSpace);
  ctx.rotate(configs.rotation);
  configs.unitSpace = unitSpace;
  if (configs.includeTicks) drawTicks(configs, ctx);
  if (configs.includeLabels) drawLabels(configs, ctx);
  drawAxis(configs, ctx);
  (0, _settings.restore)(configs);
  return {
    range: range,
    originPosition: configs.originPosition,
    tickList: tickList,
    unitValue: step,
    unitSpace: unitSpace
  };
}
function drawAxis(configs, ctx) {
  let {
    includeLeftTip,
    includeRightTip,
    unitSpace,
    axisLabelDirection,
    range,
    tipLength,
    tipBreadth,
    axisLabel
  } = configs;
  let [min, max] = range;
  (0, _settings.save)();
  (0, _settings.stroke)(configs.strokeColor);
  ctx.lineWidth = configs.strokeWidth;
  (0, _settings.fill)(configs.strokeColor);
  let x1 = min * unitSpace,
    x2 = max * unitSpace;
  ctx.doStroke = false;
  if (includeLeftTip) {
    (0, _arrows.arrowTip)(x1 + tipLength, 0, x1, 0, tipLength, tipBreadth);
    x1 += tipLength;
  }
  if (includeRightTip) {
    (0, _arrows.arrowTip)(x2 - tipLength, 0, x2, 0, tipLength, tipBreadth);
    x2 -= tipLength;
  }
  (0, _geometry.line)(x1, 0, x2, 0);
  (0, _settings.fontSize)(configs.axisLabelSize);
  (0, _settings.fontFamily)(configs.fontFamily);
  (0, _settings.fill)(configs.axisLabelColor);
  let height = (0, _utils.measureHeight)(axisLabel);
  ctx.translate(x2 + axisLabelDirection[0] * height, axisLabelDirection[1] * height);
  ctx.rotate(configs.textRotation);
  configs.textRenderer(axisLabel, 0, 0);
  (0, _settings.restore)();
}
function drawTicks(configs, ctx) {
  let {
    includeLeftTip,
    includeRightTip,
    tickList,
    numbersToExclude,
    numbersWithElongatedTicks,
    longerTickHeight,
    tickHeight,
    unitSpace
  } = configs;
  ctx.strokeStyle = configs.strokeColor;
  ctx.lineWidth = configs.strokeWidth;
  let start = includeLeftTip ? 1 : 0,
    end = tickList.length - (includeRightTip ? 1 : 0);
  for (let i = start; i < end; i++) {
    let tick = tickList[i];
    if (!numbersToExclude.includes(tick)) {
      let tH = numbersWithElongatedTicks.includes(tick) ? longerTickHeight : tickHeight;
      (0, _geometry.line)(tick * unitSpace, -tH / 2, tick * unitSpace, tH / 2);
    }
  }
}

/**
 *
 * @param {Object} configs
 * @param {CanvasRenderingContext2D} ctx
 */
function drawLabels(configs, ctx) {
  let {
    includeLeftTip,
    includeRightTip,
    tickList,
    numbersToExclude,
    labelsToInclude,
    labelDirection,
    unitSpace
  } = configs;
  ctx.fillStyle = configs.textColor;
  ctx.textAlign = configs.textAlign;
  ctx.textBaseline = configs.textBaseline;
  ctx.fontFamily = configs.fontFamily;
  let labels = labelsToInclude.length > 0 ? labelsToInclude : tickList,
    start = includeLeftTip ? 1 : 0,
    end = includeRightTip ? tickList.length - 1 : tickList.length;
  (0, _settings.fontSize)(configs.fontSize);
  for (let i = start; i < end && i < labels.length; i++) {
    if (!numbersToExclude.includes(tickList[i])) {
      let tick = typeof labels[i] == "number" ? labels[i].toFixed(configs.decimalPlaces) : labels[i];
      let height = (0, _utils.measureHeight)(tick);
      let xAdjust = labelDirection[0] * height;
      let yAdjust = labelDirection[1] * height;
      let xShift = tickList[i];
      ctx.save();
      ctx.translate(xShift * unitSpace + xAdjust, yAdjust);
      ctx.rotate(configs.textRotation);
      configs.textRenderer(tick, 0, 0);
      ctx.restore();
    }
  }
}

},{"../../c.js":5,"../../main.js":17,"../../settings.js":35,"../../utils.js":36,"../arrows.js":23,"../geometry.js":31,"../text.js":34}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberPlane = numberPlane;
var _c = require("../../c.js");
var _main = require("../../main.js");
var _settings = require("../../settings.js");
var _utils = require("../../utils.js");
var _cartesian_plotters = require("./cartesian_plotters.js");
/** @module Coordinate-Systems*/

const ORIGIN = [0, 0];

/**
 * @typedef {Object} NumberLineConfigs configurations about the number line
 * @property {number[]} originPosition - Center of the number line in px
 * @property {number[]} tickList - List of tick inervals
 * @property {number} unitValue - How much a unit is in its value in x and y directions.
 * @property {number} unitSpace - How much a unit is in px in x and y directions.
 */

/**
 * Creates a numberPlane based on following parameters inside a Object
 * @param {Object} configs Possible parameters:
 * @param {Object} configs.xAxis Configurations for x axis. See {@link numberLine} for possible configurations.
 * @param {Object} configs.yAxis Configurations for y axis. See {@link numberLine} for possible configurations.
 * @param {number[]} configs.originPosition Center of number plane as [x, y] in px.
 * @param {number[]} [configs.subgrids] number of sub-grid lines in each cell. Default=[1,1]
 * @param {Object} configs.grid Set of styles to draw grid & subgrids. This can have following properties:
 * @param {number} [configs.gridStrokeWidth = 1]  stroke width of grid lines
 * @param {number} [configs.subgridStrokeWidth = 0.7]  stroke width of sub-grid
 * @param {string} [configs.gridStrokeColor = "#58c4dda0"]  color of grid lines
 * @param {string} [configs.subgridStrokeColor = "#888888a0"]  color of sub-grids
 *
 * @returns {CartesianPlotters}
 */
function numberPlane(configs = {}) {
  const ctx = _main.C.workingContext;
  // default configurations
  const defaultConfigs = {
    includeTicks: true,
    includeLabels: true,
    includeLeftTip: false,
    includeRightTip: false,
    excludeOriginTick: true,
    unitSpace: 50,
    subgrids: [1, 1],
    gridStrokeWidth: 1.3,
    subgridStrokeWidth: 0.8,
    gridStrokeColor: _c.Colors.aqua + "44",
    subgridStrokeColor: "#88888850",
    originPosition: ORIGIN
  };

  // configurations
  configs = (0, _utils.applyDefault)(defaultConfigs, configs);
  let {
    originPosition,
    subgrids,
    gridStrokeWidth,
    subgridStrokeWidth,
    gridStrokeColor
  } = configs;

  // range of ticks in each axis
  const axesLines = (0, _c.axes)(configs);
  const {
    xAxis,
    yAxis
  } = axesLines;
  const [xMin, xMax, xStep] = xAxis.range;
  const [yMin, yMax, yStep] = yAxis.range;

  // draw grids
  const unitSpace = axesLines.unitSpace;
  const unitValue = axesLines.unitValue;
  (0, _settings.save)();
  axesLines.scaleCanvas();
  ctx.translate(originPosition[0], originPosition[1]);
  gridStrokeWidth /= unitSpace[1];
  subgridStrokeWidth /= unitSpace[1];
  drawGridLines();

  // size of a unit cell
  function drawGridLines() {
    // major grid lines
    ctx.beginPath();
    ctx.lineWidth = gridStrokeWidth;
    ctx.strokeStyle = gridStrokeColor;
    // vertical grid lines
    let max = yMax - yMax % yStep;
    for (let i = xMin; i <= xMax; i += xStep) {
      if (i != 0 && !(xAxis.includeLeftTip && i == xMin || xAxis.includeRightTip && i == xMax)) {
        ctx.moveTo(i, yMin);
        ctx.lineTo(i, max);
      }
    }
    // horizontal grid lines
    max = xMax - xMax % xStep;
    for (let i = yMin; i <= yMax; i += yStep) {
      if (i != 0 && !(yAxis.includeLeftTip && i == yMin || yAxis.includeRightTip && i == yMax)) {
        ctx.moveTo(xMin, i);
        ctx.lineTo(max, i);
      }
    }
    ctx.stroke();
    ctx.closePath();
    drawSubgrids();
  }
  function drawSubgrids() {
    ctx.beginPath();
    ctx.lineWidth = subgridStrokeWidth;
    ctx.strokeStyle = configs.subgridStrokeColor;
    let spacing = 1 / (subgrids[0] + 1); // space between two subgrids
    // vertical subgrids
    for (let k = xMin; k <= xMax; k += spacing) {
      if (k % unitValue[0] != 0) {
        ctx.moveTo(k, yMin);
        ctx.lineTo(k, yMax);
      }
    }
    spacing = 1 / (subgrids[1] + 1);
    // horizontal subgrids
    for (let k = yMin; k <= yMax; k += spacing) {
      if (k % unitValue[1] != 0) {
        ctx.moveTo(xMin, k);
        ctx.lineTo(xMax, k);
      }
    }
    ctx.stroke();
    ctx.closePath();
  }
  (0, _settings.restore)();
  return (0, _cartesian_plotters.getCartasianFunctions)({
    originPosition: originPosition,
    // position of origin of number plane
    unitValue: unitValue,
    // how much a unit is in its value
    unitSpace: unitSpace,
    // how much a unit is in px
    xAxis: xAxis,
    // x axis confiurations from numberLine
    yAxis: yAxis,
    // y axis confiurations from numberLine
    subgridUnit: subgrids // subgrid unit size
  });
}

},{"../../c.js":5,"../../main.js":17,"../../settings.js":35,"../../utils.js":36,"./cartesian_plotters.js":26}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polarPlane = polarPlane;
var _main = require("../../main.js");
var _settings = require("../../settings.js");
var _utils = require("../../utils.js");
var _tex = require("../tex.js");
var _text = require("../text.js");
var _axes = require("./axes.js");
/**
 * @typedef {Object} PolarPlotters
 * @property {Function} plotPoints see {@link plotPolarPoints}
 * @property {Function} parametricFunction see {@link polarParametricFunction}
 * @property {Function} functionGraph see {@link polarFuntionGraph}
 */

/**
 * returns list of plotting functions based on given polar parameters
 *
 * @param {Object} configs
 * @return {PolarPlotters}
 */
function getPolarPlotters(configs) {
  return {
    plotPoints: function (cfg) {
      cfg.radialSpacing = cfg.radialSpacing || configs.radialSpacing;
      plotPolarPoints(cfg);
    },
    plotParametricFunction: function (cfg) {
      cfg.radialSpacing = cfg.radialSpacing || configs.radialSpacing;
      return polarParametricFunction(cfg);
    },
    plotFunctionGraph: function (cfg) {
      cfg.radialSpacing = cfg.radialSpacing || configs.radialSpacing;
      return polarFuntionGraph(cfg);
    },
    scaleCanvas: function () {
      (0, _settings.scale)(configs.radialSpacing, configs.radialSpacing);
    }
  };
}
const ORIGIN = [0, 0];

/**
 * Creates a polar plane. change following configs to customize the plane
 * @param {Object} configs - configurations
 * @param {number[]} [configs.originPosition = ORIGIN] position of origin of plane
 * @param {number} [configs.maxRadius = 4] maximum radius of the polar plane
 * @param {number} [configs.size] diameter of the plane in pixels. Default it will try to fit in the canvas
 * @param {number} [configs.radiusStep = 1] step size of radius
 * @param {string} [configs.azimuthUnit = "degrees"]  azimuth unit:
 *  * "PI radians" or "TAU radians": 20
 *  * "degrees": 36
 *  * "gradians": 40
 * @param {number} [configs.azimuthDivisions = 0]  The number of divisions in the azimuth (also known as the angular coordinate or polar angle). If None is specified then it will use the default specified by azimuthUnit
 * @param {Array.<*>} [configs.radialLabels = []] Labels for the radial axis. If nothing is specified then the labels will be automatically generated using the radialStep.
 * @param {string} [configs.azimuthDirection = "ccw"] direction of the azimuthal labels. This can be either 'ccw' or 'cw'

 * @param {Object} [configs.radiusConfigs] radial axis configurations
 * @param {string} [configs.radiusConfigs.strokeColor = "#fff"] stroke color of the radial axis
 * @param {string} [configs.radiusConfigs.fontFamily = "serif"] font family of the radial axis labels
 * @param {string} [configs.radiusConfigs.textAlign = "center"] text align of the radial axis labels
 * @param {string} [configs.radiusConfigs.textBaseline = "middle"] text baseline of the radial axis labels
 * @param {number} [configs.radiusConfigs.strokeWidth = 2] stroke width of the radial axis in pixels
 * @param {number} [configs.radiusConfigs.fontSize = 22] font size of the radial axis in pixels
 * @param {number} [configs.radiusConfigs.decimalPoints = 0] number of decimal points to show up in the radial axis labels
 * @param {Function} [configs.radiusConfigs.textRenderer = fillText] function that renders text. you can use strokeText to get stroked text, or something else to get custom text
 * @param {number[]} [configs.radiusConfigs.labelDirection = [-1.4, -1.2]] direction of the radial axis label. This'll align labels correctly in the position.
 * @param {number[]} [configs.radiusConfigs.labelAxis = [1, 0]] axis to labels
 * @param {boolean} [configs.radiusConfigs.includeLabels = true] whether to draw radial labels or not

 * @param {Object} [configs.azimuth] azimuth line configurations
 * @param {boolean} [configs.azimuth.compactFraction = true] whether to show the azimuthal fraction as compact or not
 * @param {number} [configs.azimuth.offset = 0] radial offset of the azimuthal labels
 * @param {number} [configs.azimuth.labelBuff = 0.5] buffer between the outermost azimuthal circle and the azimuthal labels
 * @param {number} [configs.azimuth.fontSize = 17] font size of the azimuthal labels
 * @param {number} [configs.azimuth.strokeWidth = 1.5] stroke width of the azimuthal lines
 * @param {number} [configs.azimuth.decimalPoints = 0] number of decimal points to show up in the azimuthal labels
 * @param {string} [configs.azimuth.fontFamily = "serif"] font family of the azimuthal labels
 * @param {string} [configs.azimuth.strokeColor = "#58c4dddd"] stroke color of the azimuthal labels
 * @param {Function} [configs.azimuth.textRenderer = fillText] function that renders text. you can use strokeText to get stroked text, or something else to get custom text
 * @param {boolean} [configs.azimuth.includeLabels = true] whether to draw azimuthal labels or not
 *
 * @returns {PolarPlotters}
 */
function polarPlane(configs = {}) {
  let ctx = _main.C.workingContext,
    cvs = _main.C.workingCanvas,
    azimuthUnitsDict = {
      pi: 20,
      tau: 20,
      deg: 24,
      grad: 20
    };
  configs = (0, _utils.applyDefault)({
    originPosition: ORIGIN,
    maxRadius: 4.0,
    size: Math.min(parseInt(cvs.style.width), parseInt(cvs.style.height)) * 0.8,
    radiusStep: 1,
    azimuthUnit: "PI radians",
    azimuthDivisions: 0,
    azimuthCompactFraction: true,
    azimuthDirection: "ccw",
    azimuthoffset: 0,
    fadedLines: 1,
    radiusConfigs: {
      includeLabels: true,
      includeTicks: false,
      includeRightTip: false,
      strokeColor: "#fff",
      strokeWidth: 2,
      fontSize: 16,
      fontFamily: "serif",
      labelDirection: [0.4, -1],
      labelAxis: [1],
      numbersToExclude: [0]
    },
    azimuthConfigs: {
      includeLabels: true,
      labelBuff: 0.45,
      fontSize: 15,
      fontFamily: "serif",
      textAlign: "center",
      textBaseline: "middle",
      strokeColor: "#58c4ddaa",
      strokeWidth: 1.3,
      textRenderer: _text.fillText,
      decimalPoints: 0,
      numbersToExclude: [0]
    },
    fadedLineConfigs: {
      strokeColor: "#8888",
      strokeWidth: 1
    }
  }, configs);
  const {
    originPosition,
    maxRadius,
    size,
    radiusStep,
    azimuthDivisions,
    radiusConfigs
  } = configs;
  let radialSpacing = size / maxRadius / 2;
  configs.azimuthUnit = getAzimuthUnit(configs.azimuthUnit);
  configs.azimuthDirection = configs.azimuthDirection.toLowerCase();
  configs.fadedLines++;
  if (azimuthDivisions == 0 || isNaN(azimuthDivisions)) {
    configs.azimuthDivisions = azimuthUnitsDict[configs.azimuthUnit] || 20;
  }
  configs.tickList = (0, _utils.arange)(0, maxRadius, radiusStep);
  let labels = Array.isArray(radiusConfigs.labelsToInclude) ? radiusConfigs.labelsToInclude : configs.tickList;

  // find labels for each wings of axis
  const [xLabels, yLabels] = fillLabels(maxRadius, labels, radiusConfigs.labelAxis);
  radiusConfigs.range = [-maxRadius, maxRadius, radiusStep];
  radiusConfigs.length = size;
  configs.radiusConfigs = radiusConfigs;
  configs.xLabels = xLabels;
  configs.yLabels = yLabels;
  configs.radialSpacing = radialSpacing;
  let xAxisCfgs = (0, _utils.applyDefault)(radiusConfigs, {
      labelsToInclude: xLabels,
      originPosition,
      axisLabel: ""
    }),
    yAxisCfgs = (0, _utils.applyDefault)(radiusConfigs, {
      labelsToInclude: yLabels,
      originPosition,
      axisLabel: ""
    });
  (0, _settings.save)();
  ctx.translate(originPosition[0] * radialSpacing, originPosition[1] * radialSpacing);
  drawAzimuthalLines(configs, ctx);
  (0, _settings.restore)();
  (0, _axes.axes)({
    xAxis: xAxisCfgs,
    yAxis: yAxisCfgs
  });
  return getPolarPlotters({
    azimuthAnglularSpace: 2 * Math.PI / azimuthDivisions,
    radialSpacing: radialSpacing
  });
}
function drawAzimuthalLines(configs, ctx) {
  let {
    azimuthDivisions,
    azimuthDirection,
    azimuthConfigs,
    fadedLines
  } = configs;
  configs.labels = generateLabels(configs);
  configs.angleIncrementor = Math.PI * 2 / azimuthDivisions;
  if (azimuthDirection == "cw") {
    configs.angleIncrementor *= -1;
  }
  if (fadedLines > 1) {
    drawMinors(configs, ctx);
  }
  drawMajors(configs, ctx);
  if (azimuthConfigs.includeLabels) {
    drawAzimuthalLabels(configs);
  }
}
function generateLabels(configs) {
  let labels = [];
  const {
    azimuthUnit,
    radialSpacing,
    azimuthConfigs,
    azimuthDivisions,
    azimuthCompactFraction
  } = configs;
  if (azimuthUnit == "pi" || azimuthUnit == "tau") {
    let numerator = 1,
      denominator = azimuthDivisions,
      generator,
      post;
    if ((0, _tex.tex2svgExists)()) {
      azimuthConfigs.textRenderer = _tex.tex;
      post = azimuthUnit == "tau" ? "\\tau" : "\\pi";
      (0, _settings.fontSize)(azimuthConfigs.fontSize * radialSpacing);
      generator = _utils.texFraction;
    } else {
      console.warn("MathJax not found, using fillText instead");
      post = azimuthUnit == "pi" ? "π" : "τ";
      generator = _utils.fraction;
    }
    for (let division = 0; division < azimuthDivisions; division++) {
      labels.push(generator(numerator * division, denominator, true, azimuthCompactFraction, post));
    }
  } else if (azimuthUnit == "deg") {
    // Use Tex parser to generate fractions
    for (let i = 0; i < azimuthDivisions; i++) {
      labels.push((i * 360 / azimuthDivisions).toFixed(azimuthConfigs.decimalPoints) + "°");
    }
  } else if (azimuthUnit == "grad") {
    for (let i = 0; i < azimuthDivisions; i++) {
      labels.push((i * 400 / azimuthDivisions).toFixed(azimuthConfigs.decimalPoints) + "ᵍ");
    }
  }
  return labels;
}

/**
 *
 * @param {Object} configs
 * @param {CanvasRenderingContext2D} ctx
 */
function drawMinors(configs, ctx) {
  const {
    maxRadius,
    azimuthoffset,
    angleIncrementor,
    fadedLineConfigs,
    azimuthDivisions,
    fadedLines,
    tickList,
    radialSpacing
  } = configs;
  const step = 1 / fadedLines,
    radMax = (tickList.length - 1) * fadedLines,
    azmMax = azimuthDivisions * fadedLines;
  ctx.doFill = false;
  ctx.doStroke = true;
  ctx.strokeStyle = fadedLineConfigs.strokeColor;
  ctx.lineWidth = fadedLineConfigs.strokeWidth;
  ctx.beginPath();
  ctx.moveTo(0, 0);

  // radiating circle
  for (let i = 0; i < radMax; i++) {
    ctx.arc(0, 0, i * step * radialSpacing, 0, Math.PI * 2);
  }
  ctx.lineWidth = fadedLineConfigs.strokeWidth;
  for (let i = 0; i < azmMax; i++) {
    let angle = i * angleIncrementor * step;
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle + azimuthoffset) * maxRadius * radialSpacing, Math.sin(angle + azimuthoffset) * maxRadius * radialSpacing);
  }
  ctx.stroke();
}
function drawMajors(configs, ctx) {
  const {
    azimuthConfigs,
    tickList,
    azimuthDivisions,
    angleIncrementor,
    azimuthoffset,
    maxRadius,
    radialSpacing
  } = configs;
  ctx.beginPath();
  ctx.strokeStyle = azimuthConfigs.strokeColor;
  ctx.lineWidth = azimuthConfigs.strokeWidth;
  ctx.moveTo(0, 0);
  for (let i = 0; i < tickList.length; i++) {
    ctx.arc(0, 0, i * radialSpacing, 0, Math.PI * 2);
  }
  for (let i = 0; i < azimuthDivisions; i++) {
    let angle = i * angleIncrementor + azimuthoffset;
    if (angle % (Math.PI / 2) != 0) {
      // avoid axes
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * maxRadius * radialSpacing, Math.sin(angle) * maxRadius * radialSpacing);
    }
  }
  ctx.stroke();
}
function drawAzimuthalLabels(configs) {
  const {
    azimuthDivisions,
    angleIncrementor,
    azimuthoffset,
    azimuthConfigs,
    maxRadius,
    labels,
    radialSpacing
  } = configs;
  (0, _settings.fontSize)(azimuthConfigs.fontSize);
  (0, _settings.fontFamily)(azimuthConfigs.fontFamily);
  (0, _settings.textAlign)(azimuthConfigs.textAlign);
  (0, _settings.textBaseline)(azimuthConfigs.textBaseline);
  for (let i = 0; i < azimuthDivisions; i++) {
    let angle = i * angleIncrementor + azimuthoffset;
    if (!azimuthConfigs.numbersToExclude.includes(angle)) {
      azimuthConfigs.textRenderer(labels[i], Math.cos(angle) * (maxRadius + azimuthConfigs.labelBuff) * radialSpacing, Math.sin(angle) * (maxRadius + azimuthConfigs.labelBuff) * radialSpacing);
    }
  }
}

/**
 *
 * @param {string} azmU
 * @returns {string}
 */
function getAzimuthUnit(azmU) {
  azmU = azmU.toLowerCase().trim().replace(/(rad.*|\s*)/, "rad");
  if (/.*(pi|π).*/.test(azmU)) azmU = "pi";else if (/.*(tau|τ).*/.test(azmU)) azmU = "tau";else if (/.*(deg|°).*/.test(azmU)) azmU = "deg";else if (/.*(grad|ᵍ).*/.test(azmU)) azmU = "grad";else throw new Error("Invalid azimuth units. Expected one of: PI radians, TAU radians, degrees, gradians.");
  return azmU;
}
function fillLabels(maxRadius, labels, labelAxis) {
  let xLabels = [],
    yLabels = [],
    // also remove last element
    lrev = [...labels].reverse().slice(0, maxRadius),
    EMPTY_ARR = new Array(maxRadius).fill("");

  // left of x-axis
  if (labelAxis.includes(3)) {
    xLabels.push(...lrev);
  } else {
    xLabels.push(...EMPTY_ARR);
  }

  // right of x-axis
  if (labelAxis.includes(1)) {
    xLabels.push(...labels);
  } else {
    xLabels.push(...EMPTY_ARR);
  }

  // top of y-axis
  if (labelAxis.includes(4)) {
    yLabels.push(...lrev);
  } else {
    yLabels.push(...EMPTY_ARR);
  }

  // bottom of y-axis
  if (labelAxis.includes(2)) {
    yLabels.push(...labels);
  } else {
    yLabels.push(...EMPTY_ARR);
  }
  return [xLabels, yLabels];
}

},{"../../main.js":17,"../../settings.js":35,"../../utils.js":36,"../tex.js":33,"../text.js":34,"./axes.js":25}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functionGraph = functionGraph;
exports.heatPlot = heatPlot;
exports.parametricFunction = parametricFunction;
exports.plotPoints = plotPoints;
exports.plotPolarPoints = plotPolarPoints;
exports.polarFuntionGraph = polarFuntionGraph;
exports.polarParametricFunction = polarParametricFunction;
var _color_reader = require("../color/color_reader.js");
var _main = require("../main.js");
var _settings = require("../settings.js");
var _utils = require("../utils.js");
var _geometry = require("./geometry.js");
/**@module Plottter-Functions */

/**
 * @typedef {Object} CartesianPoint
 * @property {number} x
 * @property {number} y
 * @property {number} radius radius of point
 * @property {string} fill fill style
 * @property {string} stroke stroke styles
 */

/**
 * @typedef {Object} PolarPoint
 * @property {number} r distance from origin
 * @property {number} phi radial distance from +x axis in CCW direction
 * @property {number} radius radius of point
 * @property {string} fill fill style
 * @property {string} stroke stroke styles
 */

/**
 * @typedef {Object} ParametricPlotter
 * @property {number[][]} points : Array of computed points in the function
 * @property {Function} draw : Function that draws the plot
 * @property {Function} animate : Function that animates the drawing of the shape. Accept argument `duration` which is the duration of animation.
 */

const animationEventChain = {
  then: function (f) {
    f();
    return animationEventChain;
  }
};
let counter = {
  parametricFunction: 1
};
const RANGE = [0, 10, 0.1];
const UNIT_VEC = [1, 1];
/**
 * Draws a parametric functions
 * This accept parameters as object.
 * @param {Object} configs configurations
 * @param {Function} configs.plotter function to plot. Must recieve one argument and return a array of point as [x, y]
 * @param {number} [configs.tension = 1] Smoothness tension.
 * @param {number[]} [configs.range = RANGE] Range as [min, max, dt]
 * @param {number[]} [configs.discontinuities] Array of t where the curve discontinues.
 * @param {number[]} [configs.unitValue = [1, 1]] Value of each unit space
 * @param {number[]} [configs.unitSpace = [1, 1]] Length of each unit in pixels
 * @param {boolean} [configs.smoothen = true] Whether to smoothen the shape.
 * @param {boolean} [configs.closed = false] Whether the function draws a closed shape.
 * @param {boolean} [configs.draw = true] Wheteher to draw the function graph right now.
 * @param {number} [configs.strokeWidth = 2]
 * @param {number} [configs.discontinuityRadius = range[2]]
 *
 * @returns {ParametricPlotter}
 */
function parametricFunction(configs) {
  let defaultConfigs = {
    tension: 1,
    unitValue: UNIT_VEC,
    unitSpace: UNIT_VEC,
    // length of each unit in pixels
    range: RANGE,
    discontinuities: [],
    smoothen: true,
    closed: false,
    draw: true,
    // for animation
    dur: 4000
  };
  configs = (0, _utils.applyDefault)(defaultConfigs, configs);
  let {
    plotter,
    range,
    smoothen,
    tension,
    discontinuities,
    closed
  } = configs;
  if (Array.isArray(range) && range.length == 2) range.push((range[1] - range[0]) / 20);
  let points = [[]],
    min = range[0],
    max = range[1],
    step = range[2];
  if (!Array.isArray(discontinuities)) discontinuities = [];

  // generate points
  let row = 0,
    pointCount = 0,
    unitX = configs.unitSpace[0] / configs.unitValue[0],
    unitY = configs.unitSpace[1] / configs.unitValue[1],
    discontinuityRadius = isNaN(configs.discontinuityRadius) ? step : configs.discontinuityRadius;
  if (step < discontinuityRadius) discontinuityRadius = step / 2;
  for (let t = min; t <= max + discontinuityRadius; t += step) {
    if ((0, _utils.inArray)(t, discontinuities, discontinuityRadius)) {
      if ((0, _utils.inArray)(t + step, discontinuities, discontinuityRadius)) {
        row++;
        points.push([]);
      }
      continue;
    }
    let ft = plotter(t);
    points[row].push([ft[0] * unitX, ft[1] * unitY]);
    pointCount++;
  }
  // draw the plot
  if (configs.draw) plot();
  function plot() {
    let ctx = _main.C.workingContext;
    for (let i = 0; i < points.length; i++) {
      let p = points[i];
      if (smoothen) {
        (0, _geometry.smoothCurveThroughPoints)(p, tension, closed);
      } else {
        ctx.beginPath();
        ctx.moveTo(p[0][0], p[0][1]);
        for (let j = 1; j < p.length; j++) {
          ctx.lineTo(p[j][0], p[j][1]);
        }
        ctx.closePath();
        (0, _utils.doFillAndStroke)(ctx);
      }
    }
  }
  let ctx = _main.C.workingContext;
  return {
    points: points[0],
    dur: configs.dur,
    name: "parametric-plot-" + counter.parametricFunction++,
    closed: configs.closed,
    tension: configs.tension || 1,
    smoothen: configs.smoothen,
    rateFunction: configs.rateFunction,
    syncWithTime: configs.syncWithTime || false,
    draw: function (duration = 2000) {
      let dt = duration / pointCount,
        drawer = smoothen ? smoothed : nonSmoothed;
      for (let i = 0; i < points.length; i++) {
        var p = points[i],
          j = 0;
        (0, _settings.loop)("parametric-plot-" + counter.parametricFunction++, drawer(j), _main.C.workingContext.name, dt);
      }
      function smoothed(j) {
        return function () {
          if (j >= p.length - 2) {
            (0, _settings.noLoop)();
            ctx.closePath();
            if (ctx.doFill) plot();
          }
          let recentPoint = j > 0 ? p[j - 1] : closed ? p[p.length - 2] : p[0],
            currentPoint = p[j],
            nextPoint = p[j + 1],
            secondNextPoint = j != p.length - 2 ? p[j + 2] : closed ? p[1] : nextPoint,
            cp = (0, _geometry.getBezierControlPoints)(recentPoint, currentPoint, nextPoint, secondNextPoint);
          j++;
          ctx.beginPath();
          ctx.moveTo(currentPoint[0], currentPoint[1]);
          ctx.bezierCurveTo(cp[0], cp[1], cp[2], cp[3], nextPoint[0], nextPoint[1]);
          ctx.stroke();
        };
      }
      function nonSmoothed(j) {
        return function () {
          if (j >= p.length - 2) {
            (0, _settings.noLoop)();
            if (ctx.doFill) this.draw();
          }
          let p1 = p[j],
            p2 = p[++j];
          (0, _geometry.line)(p1[0], p1[1], p2[0], p2[1]);
        };
      }
      return animationEventChain;
    }
  };
}

/**
 * Draws graph of funciton
 * See {@link parametricFunction} For arguments
 *
 * @param {Object} configs
 * @return {ParametricPlotter}
 */
function functionGraph(configs) {
  let plotter = configs.plotter;
  configs.plotter = x => [x, plotter(x)];
  return parametricFunction(configs);
}

/**
 * Draws a heat plot of given function. The function must take atleast 2 arguments and return a number.
 * More precisely f: ℜ² → ℜ
 * All parameters should be enclosed in a object.
 * @param {Object} configs
 * Possible parameters are:
 *
 * @param {Function} configs.plotFunction function to be plotted.
 * @param {number[]} [configs.min] minimum point. Default: [-4, -4]
 * @param {number[]} [configs.max] maximum point. Default: [4, 4]
 * @param {Object} configs.colors object of color map
 * @param {number[]} [configs.unitValue = UNIT_VEC] Value of each unit space
 * @param {number[]} [configs.unitSpace = UNIT_VEC] Length of each unit in pixels
 * @param {number} [configs.resolution = 1] resolution of plot
 * @param {Function} [configs.interpolator = linear] function to interpolate color.
 */
function heatPlot(configs) {
  let defaultConfigs = {
    min: [-4, -4],
    max: [4, 4],
    colors: {
      "-5": "#b36e38b0",
      "-3": "#ff9c52b0",
      "-1": "#ffcea9b0",
      0: "#dcdcddb0",
      1: "#9fcaedb0",
      3: "#3d96dab0",
      5: "#2b6b99b0"
    },
    unitSpace: UNIT_VEC,
    unitValue: UNIT_VEC,
    resolution: 1,
    interpolator: x => x
  };
  configs = (0, _utils.applyDefault)(defaultConfigs, configs, false);
  let {
      min,
      max,
      colors,
      resolution,
      plotFunction,
      interpolator
    } = configs,
    ctx = _main.C.workingContext,
    unitSizeX = configs.unitSpace[0] / configs.unitValue[0],
    unitSizeY = configs.unitSpace[1] / configs.unitValue[1],
    UVX = 1 / unitSizeX,
    UVY = 1 / unitSizeY,
    stopes = Object.keys(colors).sort();

  // convert colors to rgba array
  for (let stop of stopes) {
    colors[stop] = (0, _color_reader.readColor)(colors[stop]).rgbaA;
  }
  let stopMin = Math.min(...stopes),
    stopMax = Math.max(...stopes);
  ctx.save();
  for (let x = min[0]; x <= max[0]; x += resolution * UVX) {
    for (let y = min[1]; y <= max[1]; y += resolution * UVY) {
      let v = plotFunction(x, y);
      ctx.fillStyle = lerpColorArray(v, stopMax, colors, stopMin, stopes, interpolator);
      ctx.fillRect(x * unitSizeX, y * unitSizeY, resolution, resolution);
    }
  }
  ctx.restore();
  function lerpColorArray(v) {
    if (v >= stopMax) return "rgba(" + colors[stopMax].join() + ")";
    if (v <= stopMin) return "rgba(" + colors[stopMin].join() + ")";
    for (let i = 0; i < stopes.length - 1; i++) {
      let a = stopes[i],
        b = stopes[i + 1];
      if (v >= a && v < b) {
        let c1 = colors[a],
          c2 = colors[b],
          k = interpolator((v - a) / (b - a));
        return "rgba(" + [Math.round((c2[0] - c1[0]) * k + c1[0]), Math.round((c2[1] - c1[1]) * k + c1[1]), Math.round((c2[2] - c1[2]) * k + c1[2]), (c2[3] - c1[3]) * k + c1[3]].join() + ")";
      }
    }
  }
}

/**
 * Plots a list of points
 * @param {Object} configs arguments
 * @param {CartesianPoint[]} configs.points list of points
 * @param {number[]} [configs.unitValue=[1,2]] unit Value
 * @param {number[]} [configs.unitSpace=[1,2]] unit Space
 *
 */
function plotPoints(configs) {
  configs = (0, _utils.applyDefault)({
    unitValue: UNIT_VEC,
    unitSpace: UNIT_VEC,
    fill: "white",
    stroke: "#0000",
    radius: 5
  }, configs);
  let {
      points,
      unitValue,
      unitSpace
    } = configs,
    ctx = _main.C.workingContext,
    unitSizeX = unitSpace[0] / unitValue[0],
    unitSizeY = unitSpace[1] / unitValue[1];
  for (let i = 0; i < points.length; i++) {
    let p = points[i],
      fill = p.fill || configs.fill || ctx.fillStyle,
      stroke = p.stroke || configs.stroke || ctx.strokeStyle,
      x = p.x * unitSizeX,
      y = p.y * unitSizeY;
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.arc(x, y, p.radius || configs.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.closePath();
}

/**
 * Plots a bunch of points in polar plane
 * @param {Object} configs configurations
 * @param {PolarPoint[]} configs.points list of points
 * @param {number} configs.radialSpacing size of each unit radius in pixels
 */
function plotPolarPoints(configs) {
  configs = (0, _utils.applyDefault)({
    radialSpacing: 2,
    fill: "white",
    stroke: "#0000",
    radius: 5,
    points: []
  }, configs);
  let ctx = _main.C.workingContext;
  let {
      points,
      radialSpacing
    } = configs,
    defaultFill = configs.fill || ctx.fillStyle,
    defaultStroke = configs.stroke || ctx.strokeStyle;
  ctx.save();
  for (let i = 0; i < points.length; i++) {
    let p = points[i],
      fill = p.fill || defaultFill,
      stroke = p.stroke || defaultStroke,
      x = p.r * Math.cos(p.phi) * radialSpacing,
      y = p.r * Math.sin(p.phi) * radialSpacing;
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.arc(x, y, p.radius || configs.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.closePath();
  ctx.restore();
}

/**
 * Plots a parametric function in polar plane
 * @param {Object} configs
 * @param {Function} configs.plotter function that takes one arguments t and returns a coordinate as [radius, angle]
 * @param {number} [configs.tension = 1]
 * @param {number} [configs.radialSpacing = 1]
 * @param {number[]} [configs.range = [0, Math.PI * 2, Math.PI / 50]]
 * @param {Array} [configs.discontinuities = []]
 * @param {boolean} [configs.smoothen = true]
 * @param {boolean} [configs.closed = false]
 * @param {number} [configs.strokeWidth = 2]
 * @param {number} [configs.discontinuityRadius = range[2]]

 * @returns {Object}
 */
function polarParametricFunction(configs) {
  configs = (0, _utils.applyDefault)({
    tension: 1,
    radialSpacing: 1,
    range: [0, Math.PI * 2, Math.PI / 50],
    discontinuities: [],
    smoothen: true,
    closed: false,
    strokeWidth: 2
  }, configs);
  let {
    plotter,
    range,
    radialSpacing,
    smoothen,
    tension,
    discontinuities,
    closed
  } = configs;
  if (Array.isArray(range) && range.length == 2) range.push((range[1] - range[0]) / 20);
  let points = [[]],
    min = range[0],
    max = range[1],
    step = range[2];
  if (!Array.isArray(discontinuities)) discontinuities = [];
  let discontinuityRadius = isNaN(configs.discontinuityRadius) ? step : configs.discontinuityRadius;

  // generate points
  let row = 0,
    _fix = discontinuityRadius < step ? discontinuityRadius : 0;
  // we add one more point to make the graph more accurate when applying smoothening technique.
  for (let t = min; t <= max + step + _fix; t += step) {
    if ((0, _utils.inArray)(t, discontinuities, discontinuityRadius)) {
      if ((0, _utils.inArray)(t + step, discontinuities, discontinuityRadius)) {
        row++;
        points.push([]);
      }
      continue;
    }
    let ft = plotter(t);
    points[row].push([ft[0] * Math.cos(ft[1]) * radialSpacing, ft[0] * Math.sin(ft[1]) * radialSpacing]);
  }
  let ctx = _main.C.workingContext;
  let finalPoints = [];
  ctx.lineWidth = configs.strokeWidth;
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    if (p.length == 0) {
      continue;
    } else {
      finalPoints.push(p);
    }
    // add offset to remove last point
    let offset = i == points.length - 1 ? 1 : 0;
    if (smoothen) {
      (0, _geometry.smoothCurveThroughPoints)(p, tension, closed, offset);
    } else {
      ctx.beginPath();
      ctx.moveTo(p[0][0], p[0][1]);
      for (let j = 1; j < p.length - offset; j++) {
        ctx.lineTo(p[j][0], p[j][1]);
      }
      if (ctx.doStroke) ctx.stroke();
      if (ctx.doFill && closed) ctx.fill();
      ctx.closePath();
    }

    // remove last excess point
    if (offset) {
      points[i] = points[i].slice(0, -1);
    }
  }
  return {
    points: finalPoints,
    closed: configs.closed,
    tension: configs.tension || 1,
    smoothen: configs.smoothen
  };
}

/**
 * Wrapper for {@link polarParametricFunction}
 * @param {Object} configs
 * @returns {Object}
 */
function polarFuntionGraph(configs) {
  let plotter = configs.plotter;
  configs.plotter = t => [plotter(t), t];
  return polarParametricFunction(configs);
}

},{"../color/color_reader.js":7,"../main.js":17,"../settings.js":35,"../utils.js":36,"./geometry.js":31}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.angle = angle;
exports.annulus = annulus;
exports.annulusSector = annulusSector;
exports.arc = arc;
exports.arcBetweenPoints = arcBetweenPoints;
exports.bezier = bezier;
exports.circle = circle;
exports.circularSegment = circularSegment;
exports.ellipse = ellipse;
exports.equiTriangle = equiTriangle;
exports.getBezierControlPoints = getBezierControlPoints;
exports.line = line;
exports.point = point;
exports.polygon = polygon;
exports.quad = quad;
exports.quadraticCurve = quadraticCurve;
exports.rect = rect;
exports.regularPolygon = regularPolygon;
exports.regularPolygonWithRadius = regularPolygonWithRadius;
exports.sector = sector;
exports.smoothCurveThroughPoints = smoothCurveThroughPoints;
exports.smoothCurveThroughPointsTo = smoothCurveThroughPointsTo;
exports.square = square;
exports.triangle = triangle;
var _main = require("../main.js");
var _points = require("../math/points.js");
var _utils = require("../utils.js");
/**
 * Functions for drawing various shapes
 * @module Geometric-Shapes
 */

/**
 * Adds a circular arc to the current shape if {@link startShape} was called.
 * If not it will draw a new arc.
 *
 * @param {number} x The x-axis coordinate of the arc's center.
 * @param {number} y The y-axis coordinate of the arc's center.
 * @param {number} r arc's radius (must be positive)
 * @param {number} [angle=PI/2] central angle (use negative values to rotate arc clockwise)
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */
function arc(x, y, r, angle = Math.PI / 2, startAngle = 0) {
  let ctx = _main.C.workingContext;
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.arc(x, y, r, startAngle, startAngle + angle);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Draws a point with given size in pixels
 *
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} [size=10] diameter of point in px
 * @param {boolean} [doStroke=false] whether to stroke or not
 */
function point(x, y, size = 10, doStroke = false) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
  if (doStroke) ctx.stroke();
  ctx.closePath();
}

/**
 * Draws a circular segment.
 *
 * @param {number} x x-axis coordinate of center of circular sector
 * @param {number} y y-axis coordinate of center of circular sector
 * @param {number} r radius of the circular sector
 * @param {number} [angle=1.5707963267948966] central angle
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */
function circularSegment(x, y, r, angle = Math.PI / 2, startAngle = 0) {
  let ctx = _main.C.workingContext;
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.arc(x, y, r, startAngle, startAngle + angle);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Draws circle
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} r radius
 */
function circle(x, y, r) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
}

/**
 * Adds an elliptical arc to the current shape if {@link startShape} was called.
 * If not it will draw a new ellipse.
 *
 * @param {number} x x-axis coordinate of ellipse's center
 * @param {number} y y-axis coordinate of ellipse's center
 * @param {number} radius1 ellipse's major-axis radius. Must be non-negative.
 * @param {number} radius2 ellipse's minor-axis radius. Must be non-negative.
 * @param {number} [rotation=0] The rotation of the ellipse, expressed in radians.
 * @param {number} [startAngle=0] The angle at which the ellipse starts, measured clockwise from the positive x-axis and expressed in radians.
 * @param {number} [angle=6.28318530717958] central angle of ellipse. Use negative values to rotate it anticlockwise
 */
function ellipse(x, y, radius1, radius2, rotation = 0, startAngle = 0, angle = Math.PI * 2) {
  let ctx = _main.C.workingContext;
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.ellipse(x, y, radius1, radius2, rotation, startAngle, startAngle + angle);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Adds a bézie curve to current shape if {@link startShape} was called.
 * If not it will draw a new bézie curve.
 *
 * @param {number} cpx1 x-axis coord of first control point
 * @param {number} cpy1 y-axis coord of first control point
 * @param {number} cpx2 x-axis coord of second control point
 * @param {number} cpy2 y-axis coord of second control point
 * @param {number} x3 x-axis coord of the end point
 * @param {number} y3 y-axis coord of the end point
 */
function bezier(cpx1, cpy1, cpx2, cpy2, x3, y3) {
  let ctx = _main.C.workingContext,
    pathStarted = ctx.pathStarted;
  if (!pathStarted) ctx.beginPath();
  ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x3, y3);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Draws a sector
 *
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} radius radius of sector
 * @param {number} [angle=PI/2] central angle (use negative angle to move sector clockwise)
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */
function sector(x, y, radius, angle = Math.PI / 2, startAngle = 0) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, radius, startAngle, startAngle + angle);
  ctx.lineTo(x, y);
  (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Returns bēzier control points that passes smoothly through given points.
 *
 * @param {number[]} recentPoint previous point
 * @param {number[]} currentPoint
 * @param {number[]} nextPoint
 * @param {number[]} secondNextPoint
 * @param {number} [tension=1]
 * @return {number[]} two control points as [cp1x, cp1y, cp2x, cp2y]
 */
function getBezierControlPoints(recentPoint, currentPoint, nextPoint, secondNextPoint, tension = 1) {
  return [currentPoint[0] + (nextPoint[0] - recentPoint[0]) / 6 * tension, currentPoint[1] + (nextPoint[1] - recentPoint[1]) / 6 * tension, nextPoint[0] - (secondNextPoint[0] - currentPoint[0]) / 6 * tension, nextPoint[1] - (secondNextPoint[1] - currentPoint[1]) / 6 * tension];
}

/**
 * Adds a smooth curve passing through given points and tension using bézie curve to the current shape.
 * Taken from {@link https://stackoverflow.com/a/49371349}
 *
 * @param {number[][]} points array of points as [x, y]
 * @param {number} tension tension of the curve
 */
function smoothCurveThroughPointsTo(points, tension = 1, closed = true, offset = 0) {
  for (let i = 0; i < points.length - 1 - offset; i++) {
    let recentPoint = i != 0 ? points[i - 1] : points[0],
      currentPoint = points[i],
      nextPoint = points[i + 1],
      secondNextPoint = i != points.length - 2 ? points[i + 2] : closed ? points[1] : nextPoint,
      cp = getBezierControlPoints(recentPoint, currentPoint, nextPoint, secondNextPoint, tension);
    _main.C.workingContext.bezierCurveTo(cp[0], cp[1], cp[2], cp[3], nextPoint[0], nextPoint[1]);
  }
}

/**
 * Draws smooth curve passing through given points and tension using bézie curve.
 *
 * @param {number[][]} points array of points as [x, y]
 * @param {number} tension tension of the curve
 */
function smoothCurveThroughPoints(points, tension = 1, closed = true, offset = 0) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  smoothCurveThroughPointsTo(points, tension, closed, offset);
  if (ctx.doFill && closed) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}

/**
 * Adds a new quadratic curve to the current shape if the length of arguments is 4.
 * In that case
 * * 1st argument is x coordinate of the control point
 * * 2nd argument is y coordinate of the control point
 * * 3rd argument is x coordinate of the ending point
 * * 4th argument is y coordinate of the ending point
 *
 * If length of arguments is 6, it will draw a new curve.
 * * In that case
 * * 1st argument is x coordinate of starting point
 * * 2nd argument is y coordinate of starting point
 * * 3rd argument is x coordinate of the control point
 * * 4th argument is y coordinate of the control point
 * * 5th argument is x coordinate of the ending point
 * * 6th argument is y coordinate of the ending point
 * @global
 */
function quadraticCurve() {
  let ctx = _main.C.workingContext,
    args = arguments;
  if (args.length == 4) {
    ctx.quadraticCurveTo(args[0], args[1], args[2], args[3]);
  } else if (args.length == 6) {
    ctx.beginPath();
    ctx.moveTo(args[0], args[1]);
    ctx.quadraticCurveTo(args[2], args[3], args[4], args[5]);
    (0, _utils.doFillAndStroke)(ctx);
  }
}

/**
 * Draws a annulus (circle with hole in it).
 *
 * @param {number} x x-axis coord of center of the annulus.
 * @param {number} y y-axis coord of center of the annulus.
 * @param {number} innerRadius radius of the inner circle
 * @param {number} outerRadius radius of the outer circle
 */
function annulus(x, y, innerRadius, outerRadius) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.arc(x, y, innerRadius, 0, 2 * Math.PI, false);
  ctx.moveTo(outerRadius, 0);
  ctx.arc(x, y, outerRadius, 0, 2 * Math.PI, true);
  (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Draws a annulus sector.
 *
 * @param {number} x x-axis coord of center of the annulus sector.
 * @param {number} y y-axis coord of center of the annulus sector.
 * @param {number} innerRadius radius of the inner circle
 * @param {number} outerRadius radius of the outer circle
 * @param {number} angle central angle of the annulus sector
 * @param {number} startAngle The angle at which the sector starts in radians, measured from the positive x-axis.
 */
function annulusSector(x, y, innerRadius, outerRadius, angle, startAngle) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.arc(x, y, innerRadius, startAngle, startAngle + angle, false);
  ctx.arc(x, y, outerRadius, startAngle + angle, startAngle, true);
  (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Angle between two lines. And returns the coordinate of middle of angle
 *
 * @param {number[]} p1 start point of first line array of point as [x, y]
 * @param {number[]} p2 end point of first line array of point as [x, y]
 * @param {number[]} p3 start point of second line array of point as [x, y]
 * @param {number[]} p4 end point of second line array of point as [x, y]
 * @param {number} radius radius of angle
 * @param {number} extender extender of output point
 * @param {boolean} otherAngle whether to draw the other angle
 * @param {number} angleDir there can be four angle in a line intersection. Choose a number from 1 to 4.
 * @returns {Object} coordinate of point in the middle of angle as array of point as [x, y] and angle between them
 */
function angle(p1, p2, p3, p4, radius = 20, extender = 10, otherAngle = false, angleDir = 1) {
  let p = (0, _points.lineIntersection)(p1, p2, p3, p4),
    x = p[0],
    y = p[1],
    info = {};
  if (!(isNaN(x) || isNaN(y))) {
    let ang,
      startAngle,
      a1 = Math.atan2(p1[1] - y, p1[0] - x),
      a2 = Math.atan2(p2[1] - y, p2[0] - x),
      a3 = Math.atan2(p3[1] - y, p3[0] - x),
      a4 = Math.atan2(p4[1] - y, p4[0] - x),
      angleDirs = {
        1: [a2, a4],
        2: [a4, a1],
        3: [a1, a3],
        4: [a3, a2]
      },
      dir = angleDirs[angleDir],
      ctx = _main.C.workingContext;
    if (otherAngle) {
      startAngle = dir[1];
      ang = dir[0] - dir[1];
    } else {
      startAngle = dir[0];
      ang = dir[1] - dir[0];
    }
    if (ctx.doFill) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, startAngle, ang + startAngle);
      ctx.fill();
      ctx.closePath();
    }
    if (ctx.doStroke) {
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, ang + startAngle);
      ctx.stroke();
      ctx.closePath();
    }
    info = {
      center: [x + (radius + extender) * Math.cos(startAngle + ang / 2), y + (radius + extender) * Math.sin(startAngle + ang / 2)],
      ang: ang
    };
  } else {
    throw new Error("No intersection point");
  }
  return info;
}

/**
 * Creates a circular arc using the given control points and radius.
 * If a current path started it will add this to the end of path.
 * Returns the center of arc.
 *
 * @param {number} x1 x-coord of first point
 * @param {number} y1 y-coord of first point
 * @param {number} x2 x-coord of second point
 * @param {number} y2 y-coord of second point
 * @param {number} radius radius of arc
 * @param {boolean} otherArc specifies whether to use other arc of the circle.
 * @returns {number[]} returns the coordinate of center of the arc as [x, y]
 */
function arcBetweenPoints(x1, y1, x2, y2, radius, otherArc = false) {
  if (x1 == x2 && y1 == y2)
    // TODO: should it be `throw Error()`?
    console.error("Can't draw a arc between points. Given points are exactly same");
  let center = (0, _points.circleIntersection)([x1, y1], radius, [x2, y2], radius)[0],
    ctx = _main.C.workingContext,
    angleFromXAxis = Math.atan2(y1 - center[1], x1 - center[0]),
    centralAngle = Math.atan2(y2 - center[1], x2 - center[0]) - angleFromXAxis;
  if (!ctx.pathStarted) {
    ctx.save();
    ctx.beginPath();
  }
  ctx.arc(center[0], center[1], radius, angleFromXAxis, centralAngle + angleFromXAxis, !otherArc);
  if (!ctx.pathStarted) {
    (0, _utils.doFillAndStroke)(ctx);
    ctx.restore();
  }
  return center;
}

/**
 * Draws a line
 *
 * @param {number} x1 start x coord
 * @param {number} y1 start y coord
 * @param {number} x2 end x coord
 * @param {number} y2 end y coord
 */
function line(x1, y1, x2, y2) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

/**
 * Draws a rectangle
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} width width
 * @param {number} height height
 */
function rect(x, y, width, height) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}

/**
 * Draws polygon with given points
 * @example
 * ```
 * polygon(
 * 	[0, 0], // first point
 * 	[100, 200], // second point
 * 	[130, 230], // third point
 * 	//...
 * )
 * ```
 */
function polygon() {
  let args = arguments;
  if (args.length > 2) {
    let ctx = _main.C.workingContext,
      start = args[0];
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    for (let i = 1; i < args.length; i++) {
      ctx.lineTo(args[i][0], args[i][1]);
    }
    ctx.lineTo(start[0], start[1]);
    if (ctx.doFill) ctx.fill();
    if (ctx.doStroke) ctx.stroke();
    ctx.closePath();
  }
}

/**
 * Draws square
 *
 * @param {number} x x-coord
 * @param {number} y x-coord
 * @param {number} sideLength
 */
function square(x, y, sideLength) {
  rect(x, y, sideLength, sideLength);
}

/**
 * Draws quadrilateral with four points as array of coordinate as [x, y]
 *
 * @param {number[]} p1 1st point
 * @param {number[]} p2 2nd point
 * @param {number[]} p3 3rd point
 * @param {number[]} p4 4th point
 */
function quad(p1, p2, p3, p4) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.lineTo(p3[0], p3[1]);
  ctx.lineTo(p4[0], p4[1]);
  ctx.lineTo(p1[0], p1[1]);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}

/**
 * Draws triangle with three points as array of coordinate as [x, y]
 *
 * @param {number[]} p1 first point
 * @param {number[]} p2 second point
 * @param {number[]} p3 third point
 */
function triangle(p1, p2, p3) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.lineTo(p3[0], p3[1]);
  ctx.lineTo(p1[0], p1[1]);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}

/**
 * Draws equilateral triangle
 *
 * @param {number} x
 * @param {number} y
 * @param {number} sideLength length of side
 * @param {number} [rotation=0] amound to rotate the entire triangle
 */
function equiTriangle(x, y, sideLength, rotation = 0) {
  regularPolygon(x, y, 3, sideLength, rotation);
}

/**
 * Draws a regular polygon with centre position number of sides length of a side and rotation
 *
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} sides number of sides
 * @param {number} sideLength length of a side
 * @param {number} [rotation=0] amound to rotate the entire polygon
 */
function regularPolygon(x, y, sides, sideLength, rotation = 0) {
  let radius = sideLength / (2 * Math.sin(Math.PI / sides)); // finds ex-radius
  regularPolygonWithRadius(x, y, sides, radius, rotation);
}

/**
 * Draws a regular polygon that is inside a circle
 *
 * @param {number} x x coord
 * @param {number} y y coord
 * @param {number} sides number of sides
 * @param {number} radius radius
 * @param {number} [rotation=0] amound to rotate the entire polygon
 */
function regularPolygonWithRadius(x, y, sides, radius, rotation = 0) {
  let i = 0,
    e = Math.PI * 2 / sides,
    ctx = _main.C.workingContext;
  rotation += e / 2;
  let initial = [Math.cos(rotation) * radius + x, Math.sin(rotation) * radius + y];
  ctx.beginPath();
  ctx.moveTo(initial[0], initial[1]);
  while (i++ < sides) {
    ctx.lineTo(Math.cos(i * e + rotation) * radius + x, Math.sin(i * e + rotation) * radius + y);
  }
  ctx.lineTo(initial[0], initial[1]);
  ctx.closePath();
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
}

},{"../main.js":17,"../math/points.js":20,"../utils.js":36}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lens = lens;
exports.polygonWithRatioOfCentralAngles = polygonWithRatioOfCentralAngles;
var _main = require("../main.js");
var _points = require("../math/points.js");
/** @module Extra-Shapes*/

/**
 * Draws a polygon with ratio of central angles
 *
 * @param {number} x x coord of centre of polygon
 * @param {number} y y coord of centre of polygon
 * @param {number} radius radius of ex-circle of polygon
 * @param {number[]} ratios array of ratios of central angles. Must have atleast 3 elements.
 * @param {number} [rotation=0] amound to rotate the entire polygon.
 */
function polygonWithRatioOfCentralAngles(x, y, radius, ratios, rotation = 0) {
  if (!Array.isArray(ratios)) console.error("ratio provided is not array");
  let sumOfRatio = ratios.reduce((a, b) => a + b, 0),
    baseAngle = Math.PI * 2 / sumOfRatio,
    ctx = _main.C.workingContext;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  for (let i = 0; i < ratios.length; i++) {
    ctx.rotate(baseAngle * ratios[i]);
    ctx.lineTo(radius, 0);
  }
  if (ctx.doStroke) ctx.stroke();
  if (ctx.doFill) ctx.fill();
  ctx.closePath();
  ctx.restore();
}

/**
 * Creates a lens.
 * @param {number[]} c1 center coordinate as array [x, y]
 * @param {number} r1
 * @param {number[]} c2 center coordinate as array [x, y]
 * @param {number} r2
 */
function lens(c1, r1, c2, r2) {
  // find intersectionPoint
  let p = (0, _points.circleIntersection)(c1, r1, c2, r2),
    pa = p[0],
    pb = p[1];
  // angles to the points
  let c1a1 = Math.atan2(pa[1] - c1[1], pa[0] - c1[0]),
    c1a2 = Math.atan2(pb[1] - c1[1], pb[0] - c1[0]),
    c2a1 = Math.atan2(pa[1] - c2[1], pa[0] - c2[0]),
    c2a2 = Math.atan2(pb[1] - c2[1], pb[0] - c2[0]),
    ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.arc(c1[0], c1[1], r1, c1a1, c1a2);
  ctx.arc(c2[0], c2[1], r2, c2a2, c2a1);
  if (ctx.doStroke) ctx.stroke();
  if (ctx.doFill) ctx.fill();
  ctx.closePath();
}

},{"../main.js":17,"../math/points.js":20}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getImageFromTex = getImageFromTex;
exports.tex = tex;
exports.tex2svgExists = tex2svgExists;
var _drawing = require("../constants/drawing.js");
var _main = require("../main.js");
/** @module Tex */

/**
 * Checks whether tex to svg converter exists.
 * @returns {boolean}
 */
function tex2svgExists() {
  return typeof globalThis["MathJax"] == "object" && typeof globalThis["MathJax"]["tex2svg"] == "function";
}

/**
 * Renders the input tex into a HTMLImageElement
 *
 * @param {string} input
 * @return {HTMLImageElement}
 */
function getImageFromTex(input) {
  if (!tex2svgExists()) {
    throw new Error("MathJax is not found. Please include it.");
  }
  let ctx = _main.C.workingContext,
    svgOutput = globalThis["MathJax"].tex2svg(input).getElementsByTagName("svg")[0],
    g = svgOutput.getElementsByTagName("g")[0];
  svgOutput.style.verticalAlign = "1ex";
  svgOutput.style.fontSize = parseFloat(ctx.font) + "px";
  g.setAttribute("stroke", ctx.strokeStyle);
  g.setAttribute("fill", ctx.fillStyle);
  let outerHTML = svgOutput.outerHTML,
    blob = new Blob([outerHTML], {
      type: "image/svg+xml;charset=utf-8"
    }),
    URL = globalThis.URL || globalThis.webkitURL,
    blobURL = URL.createObjectURL(blob),
    image = new Image();
  image.src = blobURL;
  return image;
}

/**
 * Draws tex inputs
 *
 * @param {string} input
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @return {HTMLImageElement} image representation of tex
 */
function tex(input, x = 0, y = 0) {
  let image = getImageFromTex(input),
    ctx = _main.C.workingContext,
    text_align = ctx.textAlign,
    text_baseline = ctx.textBaseline;
  image.onload = function () {
    ctx.save();
    let {
      width,
      height
    } = image;
    // translating the image according to text-align and text-baseline
    switch (text_align) {
      case _drawing.CENTER:
        ctx.translate(-width / 2, 0);
        break;
      case _drawing.RIGHT:
        ctx.translate(-width, 0);
        break;
      default:
        break;
    }
    switch (text_baseline) {
      case "middle":
        ctx.translate(0, height / 2);
        break;
      case "bottom":
        ctx.translate(0, height);
        break;
      default:
        break;
    }
    // invert axis first
    ctx.translate(x, y);
    if (ctx.yAxisInverted) ctx.scale(1, -1);
    if (ctx.xAxisInverted) ctx.scale(-1, 1);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  };
  return image;
}

},{"../constants/drawing.js":13,"../main.js":17}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillText = fillText;
exports.strokeText = strokeText;
exports.text = text;
var _main = require("../main.js");
/**
 * This module contains functions for drawing different types of text.
 * @module text
 */

/**
 * Draws a filled & stroked text
 *
 * @param {string} text text to draw
 * @param {number} [x=0] x-coord
 * @param {number} [y=0] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function text(text, x = 0, y = 0, maxwidth = undefined) {
  let ctx = _main.C.workingContext;
  // if axes are inverted through invert* function reverse it
  ctx.save();
  ctx.translate(x, y);
  if (ctx.yAxisInverted) ctx.scale(1, -1);
  if (ctx.xAxisInverted) ctx.scale(-1, 1);
  if (ctx.doFill) ctx.fillText(text, 0, 0, maxwidth);else if (ctx.doStroke) ctx.strokeText(text, 0, 0, maxwidth);
  ctx.restore();
}

/**
 * Draws a text without border
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function fillText(text, x = 0, y = 0, maxwidth = undefined) {
  let ctx = _main.C.workingContext;
  ctx.save();
  ctx.translate(x, y);
  if (ctx.yAxisInverted) ctx.scale(1, -1);
  if (ctx.xAxisInverted) ctx.scale(-1, 1);
  ctx.fillText(text, 0, 0, maxwidth);
  ctx.restore();
}

/**
 * Draws a stroked text
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function strokeText(text, x = 0, y = 0, maxwidth = undefined) {
  let ctx = _main.C.workingContext;
  ctx.save();
  ctx.translate(x, y);
  if (ctx.yAxisInverted) ctx.scale(1, -1);
  if (ctx.xAxisInverted) ctx.scale(-1, 1);
  ctx.strokeText(text, 0, 0, maxwidth);
  ctx.restore();
}

},{"../main.js":17}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.background = background;
exports.clear = clear;
exports.cssBackground = cssBackground;
exports.endShape = endShape;
exports.fill = fill;
exports.fontFamily = fontFamily;
exports.fontSize = fontSize;
exports.fontStretch = fontStretch;
exports.fontStyle = fontStyle;
exports.fontVariant = fontVariant;
exports.fontWeight = fontWeight;
exports.getCanvasData = getCanvasData;
exports.getContextStates = getContextStates;
exports.getFont = getFont;
exports.invertXAxis = invertXAxis;
exports.invertYAxis = invertYAxis;
exports.lineCap = lineCap;
exports.lineDash = lineDash;
exports.lineHeight = lineHeight;
exports.lineJoin = lineJoin;
exports.lineTo = lineTo;
exports.loop = loop;
exports.measureText = measureText;
exports.moveTo = moveTo;
exports.noFill = noFill;
exports.noLoop = noLoop;
exports.noStroke = noStroke;
exports.putImageData = putImageData;
exports.rest = rest;
exports.restore = restore;
exports.rotate = rotate;
exports.save = save;
exports.saveCanvas = saveCanvas;
exports.scale = scale;
exports.setImageSmoothing = setImageSmoothing;
exports.startShape = startShape;
exports.stroke = stroke;
exports.strokeWidth = strokeWidth;
exports.textAlign = textAlign;
exports.textBaseline = textBaseline;
exports.transform = transform;
exports.translate = translate;
var _color_reader = require("./color/color_reader.js");
var _main = require("./main.js");
var _utils = require("./utils.js");
/** @module Settings */

// for debugging
let counter = {
    loop: 1
  },
  logStyles = {
    number: "color: #9afcad;",
    keyword: "color: #adacdf;",
    running: "color: yellow;",
    delayed: "color: orange;",
    finished: "color: #3aff5f;"
  };
/**
 * Begins a new shape at the point specified by the given (x, y) coordinates.
 *
 * @param {number} x
 * @param {number} y
 */
function moveTo(x, y) {
  _main.C.workingContext.moveTo(x, y);
}

/**
 * Adda a straight line to the current shape by connecting the shape's last point to the specified (x, y) coordinates.
 *
 * @param {number} x
 * @param {number} y
 */
function lineTo(x, y) {
  _main.C.workingContext.lineTo(x, y);
}

/**
 * Sets background to a given value
 *
 * Accepted values:
 * * a hex string (#fff, #acf2dc)
 * * a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * a array of numbers ([0, 244, 34])
 * @param {...number} color
 */
function background(...color) {
  let col = (0, _color_reader.readColor)(color).hex8,
    ctx = _main.C.workingContext;
  ctx.background = col;
  ctx.save();
  rest();
  ctx.fillStyle = col;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

/**
 * Erases the pixels in a rectangular area by setting them to transparent black.
 * TODO: explain the process
 * @param {number} [x = 0] x-axis coordinate of the rectangle's starting point.
 * @param {number} [y = 0] y-axis coordinate of the rectangle's starting point.
 * @param {number} [width = C.workingContext.width] Rectangle's width. Positive values are to the right, and negative values to the left.
 * @param {number} [height = C.workingContext.height] Rectangle's height. positive values are down, and negative are up.
 */
function clear(x, y, width, height) {
  let ctx = _main.C.workingContext,
    d = _main.C.dpr;
  x = x || 0;
  y = y || 0;
  width = width || ctx.canvas.width;
  height = height || ctx.canvas.height;
  ctx.save();
  ctx.setTransform(d, 0, 0, d, 0, 0);
  ctx.clearRect(x, y, width, height);
  ctx.restore();
}

/**
 * sets the given image data as css background. If not given it will set current canvas drawing as the background
 * @param {string} [data] image data
 */
function cssBackground(data) {
  if (typeof data != "string") data = getCanvasData();
  let canvasStyle = _main.C.workingContext.canvas.style;
  canvasStyle.background = "url('" + data + "')";
  canvasStyle.backgroundPosition = "center";
  canvasStyle.backgroundSize = "cover";
}

/**
 * If Some arguments are given: Resets the current transformation to the identity matrix,
 * and then invokes a transformation described by given arguments.
 * Lets you scale, rotate, translate (move), and skew the canvas.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform} for more info
 * If no Arguments are given: returns current transformation
 *
 * @param {number|DOMMatrix} [a] Horizontal scaling. A value of 1 results in no scaling.
 * @param {number} [b] Vertical skewing
 * @param {number} [c] Horizontal skewing
 * @param {number} [d] Vertical scaling. A value of 1 results in no scaling
 * @param {number} [e] Horizontal translation
 * @param {number} [f] Vertical translation
 */
function transform(a, b, c, d, e, f) {
  let ctx = _main.C.workingContext;
  if (a == undefined || a == null) {
    return _main.C.workingContext.getTransform();
  } else if (a instanceof DOMMatrix) {
    ctx.setTransform(a.a, a.b, a.c, a.d, a.e, a.f);
  } else {
    ctx.setTransform(a || 0, b || 0, c || 0, d || 0, e || 0, f || 0);
  }

  // scale to fit width
  ctx.scale(_main.C.dpr, _main.C.dpr);
}

/**
 * Prevent filling inside shapes
 *
 */
function noFill() {
  _main.C.workingContext.doFill = false;
}

/**
 * Prevent drawing strokes of shapes
 *
 */
function noStroke() {
  _main.C.workingContext.doStroke = false;
}

/**
 * Translates (moves) canvas to a position
 *
 * @param {number} x amound to translate along x-axis
 * @param {number} [y=0] amound to translate along y-axis
 */
function translate(x, y = 0) {
  _main.C.workingContext.translate(x, y);
}

/**
 * Sets whether to enable image smoothening
 *
 * @param {boolean} bool
 */
function setImageSmoothing(bool) {
  _main.C.workingContext.imageSmoothingEnabled = !!bool;
}

/**
 * Sets the stroke width (line width/line thickness)
 *
 * @param {number} w
 */
function strokeWidth(w) {
  _main.C.workingContext.lineWidth = Number(w);
}

/**
 * Scales the canvas by a given amount
 *
 * @param {number} x Scaling factor in the horizontal direction. A negative value flips pixels across
 *  the vertical axis. A value of 1 results in no horizontal scaling.
 * @param {number} [y=x] Scaling factor in the vertical direction. A negative value flips pixels across
 *  the horizontal axis. A value of 1 results in no vertical scaling.
 */
function scale(x, y = x) {
  _main.C.workingContext.scale(x, y);
}

/**
 * inverts y-Axis
 */
function invertYAxis() {
  _main.C.workingContext.scale(1, -1);
  _main.C.workingContext.yAxisInverted = true;
}

/**
 * inverts x-Axis
 */
function invertXAxis() {
  _main.C.workingContext.scale(-1, 1);
  _main.C.workingContext.xAxisInverted = true;
}

/**
 * Rotates the canvas
 *
 * @param {number} angle The rotation angle, clockwise in radians. You can use degree * DEG to calculate a radian from a degree.
 */
function rotate(angle) {
  let ctx = _main.C.workingContext;
  ctx.rotate(angle);
  ctx.netRotation = (ctx.netRotation + angle) % Math.PI * 2;
}

/**
 * Saves the current state of canvas

 */
function save() {
  _main.C.workingContext.savedStates = getContextStates();
  _main.C.workingContext.save();
}

/**
 * Set the type of line end
 * Options: butt, round, square
 *
 * @param {string} capType
 */
function lineCap(capType) {
  _main.C.workingContext.lineCap = capType;
}

/**
 * Sets type of line joining
 * Options: BEVEL, ROUND, MITER
 *
 * @param {string} joinType
 */
function lineJoin(joinType) {
  _main.C.workingContext.lineJoin = joinType;
}

/**
 * Restore the saved state of canvas
 *
 */
function restore() {
  (0, _utils.defineProperties)(_main.C.workingContext.savedStates, _main.C.workingContext);
  _main.C.workingContext.restore();
}

/**
 * Reset the applied transform to idendity matrix and scales canvas by dpr
 *
 */
function rest() {
  let ctx = _main.C.workingContext;
  ctx.setTransform(_main.C.dpr, 0, 0, _main.C.dpr, 0, 0);
}

/**
 * Sets stroke color to a given value if value is given
 * else strokes the previous shape
 *
 * Accepted values:
 * * hex string (#fff, #acf2dc)
 * * number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * array of numbers ([0, 244, 34]). This gets converted into css color by the colorMode property
 */
function stroke(...color) {
  let ctx = _main.C.workingContext;
  if (arguments.length > 0) {
    ctx.strokeStyle = (0, _color_reader.readColor)(color).hex8;
    ctx.doStroke = true;
  } else {
    ctx.stroke();
  }
}

/**
 * Sets fill color to a given value if value is given
 * else fills the previous shape
 *
 * Accepted values:
 * * a hex string (#fff, #acf2dc)
 * * a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * a array of numbers ([0, 244, 34]). This gets converted into css color by the colorMode property
 */
function fill(...color) {
  let ctx = _main.C.workingContext;
  if (arguments.length !== 0) {
    ctx.fillStyle = (0, _color_reader.readColor)(color).hex8;
    ctx.doFill = true;
  } else {
    ctx.fill();
  }
}

/**
 * Returns variables in workingCanvas or given canvas
 *
 * @param {string} [canvasName] id of canvas to get the data.
 * @returns {Object}
 */
function getContextStates(canvasName) {
  let ctx = _main.C.contextList[canvasName] || _main.C.workingContext;
  return {
    background: ctx.background,
    colorMode: ctx.colorMode,
    strokeStyle: ctx.strokeStyle,
    fillStyle: ctx.fillStyle,
    lineWidth: ctx.lineWidth,
    doStroke: ctx.doStroke,
    doFill: ctx.doFill,
    pathStarted: ctx.pathStarted,
    yAxisInverted: ctx.yAxisInverted,
    xAxisInverted: ctx.xAxisInverted,
    netRotation: ctx.netRotation,
    fontStyle: ctx.fontStyle,
    fontVariant: ctx.fontVariant,
    fontWeight: ctx.fontWeight,
    fontStretch: ctx.fontStretch,
    fontSize: ctx.fontSize,
    lineHeight: ctx.lineHeight,
    fontFamily: ctx.fontFamily,
    font: ctx.font,
    textAlign: ctx.textAlign,
    textBaseline: ctx.textBaseline,
    events: ctx.events
  };
}

/**
 * Starts a new loop
 * ! Currently in progress with asynchronous animations.
 * @param {Function} functionToRun function which contains code to run
 * @param {string} canvasName name of canvas. It must be unique if you're running multiple animation at once
 * @param {number} timeDelay time delay between 2 frames. If given loop will execute with setInterval function.
 *  If not provided the loop will be run with requestAnimationFrame (this keeps a consistant frame rate between 40 to 50 FPS).
 * @param {number} [timeDelaysToRemember=10] number of time delays to remember.
 */
function loop(name, functionToRun, canvasName, timeDelay, timeDelaysToRemember = 100, settings = {}, dur) {
  let ctx;

  // if name isn't given it will shift the arguments to right
  if (typeof name == "function") {
    // shift arguments
    name = counter.loop++;
    functionToRun = arguments[0];
    canvasName = arguments[1];
    timeDelay = arguments[2];
    settings = arguments[3];
    dur = arguments[4];
  }
  if (!canvasName) {
    ctx = _main.C.workingContext;
    canvasName = ctx.name;
  } else ctx = _main.C.contextList[canvasName];
  ctx.timeDelayList = [];
  ctx.totalTimeCaptured = 0;
  let assignedSettings = Object.assign(getContextStates(canvasName) || {}, settings);
  // debugger;
  if (ctx.currentLoop != undefined) {
    // already a animation is running
    if (_main.C.debugAnimations) {
      console.log(canvasName + ": " + name + " %cdelayed", logStyles.delayed);
      _main.C._ANIMATIONLOG_.push({
        canvas: ctx,
        animationName: name,
        state: "delayed",
        settings: assignedSettings
      });
    }
    ctx.delayedAnimations.push({
      name: name,
      settings: assignedSettings,
      functionToRun: functionToRun,
      canvasName: canvasName,
      timeDelay: timeDelay,
      timeDelaysToRemember: timeDelaysToRemember,
      dur: dur
    });
  } else {
    if (_main.C.debugAnimations) {
      let toLog = `${canvasName}: ${name} %crunning`,
        styles = [logStyles.running];
      if (dur != undefined) {
        toLog += `%c for %c${dur}ms`;
        styles.push(logStyles.keyword, logStyles.number);
      }
      _main.C._ANIMATIONLOG_.push({
        canvas: ctx,
        animationName: name,
        state: "running",
        settings: assignedSettings,
        dur: dur
      });
      console.log(toLog, ...styles);
    }
    ctx.recentTimeStamp = performance.now();
    ctx.timeStart = performance.now();
    if (!isNaN(timeDelay)) {
      ctx.currentLoopName = name;
      ctx.currentLoop = setInterval(function () {
        _main.C.workingContext = ctx;
        let S = getContextStates(canvasName);
        (0, _utils.defineProperties)(assignedSettings, _main.C.workingContext);
        functionToRun(performance.now() - ctx.timeStart, getFPS());
        (0, _utils.defineProperties)(S, _main.C.workingContext);
      }, timeDelay);
    } else {
      run();
    }
  }
  function run() {
    ctx.currentLoop = globalThis.requestAnimationFrame(run);
    _main.C.workingContext = ctx;
    let S = getContextStates(canvasName);
    if (settings) (0, _utils.defineProperties)(assignedSettings, _main.C.workingContext);
    functionToRun(performance.now() - ctx.timeStart, getFPS());
    if (settings) (0, _utils.defineProperties)(S, _main.C.workingContext);
  }
  function getFPS() {
    let now = performance.now(),
      timeDelay = now - ctx.recentTimeStamp; // time delays between frames
    ctx.recentTimeStamp = now;
    ctx.timeDelayList.push(timeDelay);
    ctx.totalTimeCaptured += timeDelay;
    if (ctx.timeDelayList.length > timeDelaysToRemember) ctx.totalTimeCaptured -= ctx.timeDelayList.shift();
    return ctx.timeDelayList.length / (ctx.totalTimeCaptured / 1000);
  }
}

/**
 * Stops current loop
 *
 * @param {string} [canvasName] name of the canvas given to {@link loop}
 * @param {number} [time] time of execution. Used for debugging
 */
function noLoop(canvasName, time) {
  let ctx = _main.C.workingContext;
  if (!canvasName) canvasName = ctx.name;else ctx = _main.C.contextList[canvasName];
  clearInterval(ctx.currentLoop);
  globalThis.cancelAnimationFrame(ctx.currentLoop);
  ctx.currentLoop = undefined;
  if (_main.C.debugAnimations) {
    let toLog = `${canvasName}: ${ctx.currentLoopName} %cfinished`,
      formatter = [logStyles.finished];
    if (time != undefined) {
      toLog += `%c in %c${time.toFixed(3)}ms`;
      formatter.push(logStyles.keyword, logStyles.number);
    }
    console.log(toLog, ...formatter);
    _main.C._ANIMATIONLOG_.push({
      canvas: ctx,
      animationName: ctx.currentLoopName,
      state: "finished",
      endTime: time
    });
  }
  if (ctx.delayedAnimations.length > 0) {
    let toWork = ctx.delayedAnimations.shift();
    loop(toWork.name, toWork.functionToRun, toWork.canvasName, toWork.timeDelay, toWork.timeDelaysToRememberm, toWork.settings, toWork.dur);
  }
}

/**
 * Starts a new Path
 *
 */
function startShape() {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.pathStarted = true;
}

/**
 * Ends current Path
 *
 */
function endShape() {
  let ctx = _main.C.workingContext;
  ctx.closePath();
  ctx.pathStarted = false;
}

/**
 * Return current font
 *
 * @param {boolean} detailed wheather to return a detailed font property
 * @returns {string}
 */
function getFont(detailed = false) {
  let ctx = _main.C.workingContext;
  if (detailed) {
    let {
      fontStyle,
      fontVariant,
      fontWeight,
      fontStretch,
      fontSize,
      lineHeight,
      fontFamily
    } = ctx;
    return `${fontStyle} ${fontVariant} ${fontWeight} ${fontStretch} ${fontSize}/${lineHeight} ${fontFamily}`;
  } else {
    return ctx.font;
  }
}

/**
 * Returns text metrics
 *
 * @param {string} text
 * @returns {TextMetrics}
 */
function measureText(text) {
  return _main.C.workingContext.measureText(text);
}

/**
 * Sets font size
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font} for more info.
 * @param {number|string} size
 */
function fontSize(size) {
  let ctx = _main.C.workingContext;
  size = typeof size === "number" ? size + "px" : size;
  ctx.fontSize = size;
  ctx.font = getFont(true);
}

/**
 * Sets font family
 *
 * @param {string} family
 */
function fontFamily(family) {
  let ctx = _main.C.workingContext;
  ctx.fontFamily = family;
  ctx.font = getFont(true);
}

/**
 * Sets font style
 *
 * @param {string} style
 * possible values:
 * * NORMAL
 * * ITALIC
 * * OBLIQUE [<angle>]
 */
function fontStyle(style) {
  let ctx = _main.C.workingContext;
  ctx.fontStyle = style;
  ctx.font = getFont(true);
}

/**
 * Sets font variant
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant} for more info.
 *
 * @param {string} variant
 */
function fontVariant(variant) {
  let ctx = _main.C.workingContext;
  ctx.fontVariant = variant;
  ctx.font = getFont(true);
}

/**
 * Sets font weight
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight} for more info.
 * @param {string} weight
 */
function fontWeight(weight) {
  let ctx = _main.C.workingContext;
  ctx.fontWeight = weight;
  ctx.font = getFont(true);
}

/**
 * Sets font stretch
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font} for more info.
 *
 *  @global
 * @param {string} stretch
 * possible values:
 * * ULTRA_CONDENSED
 * * EXTRA_CONDENSED
 * * CONDENSED
 * * SEMI_CONDENSED
 * * NORMAL
 * * SEMI_EXPANDED
 * * EXPANDED
 * * EXTRA_EXPANDED
 * * ULTRA_EXPANDED
 * * <percentage>
 */
function fontStretch(stretch) {
  let ctx = _main.C.workingContext;
  ctx.fontStretch = stretch;
  ctx.font = getFont(true);
}

/**
 * Sets line height
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/line-height} for more info.
 *
 * @param {string} height
 */
function lineHeight(height) {
  let ctx = _main.C.workingContext;
  ctx.lineHeight = height;
  ctx.font = getFont(true);
}

/**
 * Returns canvas image data as string
 *
 * @param {string} datURL
 * @returns {string}
 */
function getCanvasData(datURL = "image/png") {
  return _main.C.workingContext.canvas.toDataURL(datURL);
}

/**
 * puts a imageData to canvas
 */
function putImageData() {
  _main.C.workingContext.putImageData(...arguments);
}

/**
 * Save the canvas as image
 *
 * @param {string} [name="drawing"] name of file
 * @param {string} [datURL="image/png"] type of file
 */
function saveCanvas(name = "drawing", datURL = "image/png") {
  let link = getCanvasData().replace(datURL, "image/octet-stream"),
    a = document.createElement("a");
  a.download = name + ".png";
  a.href = link;
  a.click();
}

/**
 * Sets the line dash
 * see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash} for more info
 *
 */
function lineDash() {
  _main.C.workingContext.setLineDash([...arguments]);
}

/**
 * Specifies the current text alignment used when drawing text.
 * The alignment is relative to the x value of the fillText/strokeText/text method.
 *
 * @param {string} align alignment type.
 * possible values:
 *  * "left" : The text is left-aligned.
 *  * "right" : The text is right-aligned.
 *  * "center" : The text is centered.
 *  * "start" : The text is aligned at the normal start of the line (left-aligned for left-to-right locales, right-aligned for right-to-left locales).
 *  * "end": The text is aligned at the normal end of the line (right-aligned for left-to-right locales, left-aligned for right-to-left locales).
 * NOTE: You can use constants LEFT, RIGHT, CENTER, START, and END for aligning
 */
function textAlign(align) {
  _main.C.workingContext.textAlign = align;
}

/**
 * Specifies the current text baseline used when drawing text.
 * The alignment is relative to the x value of the fillText/strokeText/text method.
 *
 * @param {string} baseline baseline type.
 * possible values:
 * * "top": The text baseline is the top of the em square.
 * * "hanging": The text baseline is the hanging baseline. (Used by Tibetan and other Indic scripts.)
 * * "middle": The text baseline is the middle of the em square.
 * * "alphabetic": The text baseline is the normal alphabetic baseline. Default value.
 * * "ideographic": The text baseline is the ideographic baseline; this is the bottom of the body of the characters, if the main body of characters protrudes beneath the alphabetic baseline. (Used by Chinese, Japanese, and Korean scripts.)
 * * "bottom": The text baseline is the bottom of the bounding box. This differs from the ideographic baseline in that the ideographic baseline doesn't consider descenders.
 * NOTE: You can use constants TOP, HANGING, MIDDLE, ALPHABETIC, IDEOGRAPHIC, BOTTOM for baseline
 */
function textBaseline(baseline) {
  _main.C.workingContext.textBaseline = baseline;
}

},{"./color/color_reader.js":7,"./main.js":17,"./utils.js":36}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyDefault = applyDefault;
exports.arange = arange;
exports.defineProperties = defineProperties;
exports.doFillAndStroke = doFillAndStroke;
exports.fraction = fraction;
exports.inArray = inArray;
exports.latexToImg = latexToImg;
exports.measureHeight = measureHeight;
exports.texFraction = texFraction;
exports.type = void 0;
var _c = require("./c.js");
var _main = require("./main.js");
/** @module Utils */

/**
 * Returns the type of object
 * @return {string}
 * @ignore
 */
const type = stuff => Object.prototype.toString.call(stuff).slice(8, -1);
exports.type = type;
Object.clone = Object.clone || function (toClone) {
  let newObj = {};
  for (let i = 0, keys = Object.keys(toClone); i < keys.length; i++) {
    let a = toClone[keys[i]];
    newObj[keys[i]] = a;
  }
  return newObj;
};

/**
 * defines new properties to a given Object
 *
 * @param {*} source source object
 * @param {*} [target=globalThis] target object
 * @param {boolean} [assignToC=true] whether apply properties to C.
 */
function defineProperties(source, target = globalThis, assignToC = false) {
  Object.assign(target, source);
  if (assignToC) Object.assign(_main.C.functions, source);
}

/**
 * Returns a array of numbers from `start` to `end` with each element having difference of `step`
 *
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @param {boolean} [rev=false] return in reverse order
 * @return {number[][]}
 */
function arange(start, end, step, rev = false) {
  let arr = [];
  if (rev) for (let i = end; i >= start; i -= step) arr.push(i);else for (let i = start; i <= end; i += step) arr.push(i);
  return arr;
}

/**
 * Applies default configurations to a given target object
 * Must be in the form of
 *
 * @param {Object} _default default configurations
 * @param {Object} [target] target object. Default = {}.
 * @param {boolean} [deepApply=true] whether to apply defaults to deep nested objects
 * @return {Object} applied object
 * @ignore
 */
function applyDefault(_default, target = {}, deepApply = true) {
  target = Object.clone(target);
  for (let i = 0, keys = Object.keys(_default); i < keys.length; i++) {
    let prop = keys[i],
      defaultProp = _default[prop],
      targetProp = target[prop],
      defaultType = type(defaultProp),
      targetType = type(targetProp);
    if (defaultType == "Object" && deepApply) {
      target[prop] = applyDefault(defaultProp, targetProp, deepApply);
    }
    if (defaultType == "Undefined" || defaultType == "Null") {
      // let the value in target as it is. Since the type is not defined in default configs
      continue;
    }
    if (targetType !== defaultType) {
      target[prop] = _default[prop];
    }
  }
  return target;
}

/**
 * fills and strokes inside the current shape if to do so.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @ignore
 */
function doFillAndStroke(ctx) {
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
}

/**
 * Checks if any number in the array matches closely with the given value.
 *
 * @param {number} value value to search for
 * @param {number[]} array
 * @param {number} [epsilon=1e-6] maximum difference
 * @return {number}
 * @ignore
 */
function inArray(value, array, epsilon = 1e-6) {
  for (let i = 0; i < array.length; i++) {
    let k = array[i];
    if (Math.abs(k - value) <= epsilon) {
      return true;
    }
  }
  return false;
}

/**
 * convert tex to image using MathJax
 *
 * @param {string} latex
 * @return {Promise}
 * @ignore
 */

function latexToImg(latex) {
  let MJX = window["MathJax"] || {};
  return new Promise((resolve, reject) => {
    let wrapper = MJX.tex2svg(`${latex}`, {
      em: 10,
      ex: 5,
      display: true
    });
    let mjOut = wrapper.getElementsByTagName("svg")[0];
    // mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    let output = {
      svg: "",
      img: ""
    };
    output.svg = mjOut.outerHTML;
    var image = new Image();
    image.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(output.svg)));
    image.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      output.img = canvas.toDataURL("image/png");
      resolve(output.img);
    };
    image.onerror = function () {
      reject();
    };
  });
}

/**
 * Returns numerator and denominator strings for given fraction
 * @param {number} numerator numerator of fraction
 * @param {number} denominator denominator of fraction
 * @param {boolean} [simplifyFraction=true] whether to simplify fraction by dividing numerator and denominator by gcd
 * @param {boolean} [compact=true] whether to add ```multiple``` with numerator or simply append it to end of string
 * @param {string} [multiple=""] an multiple
 * @returns {string[]} returns two strings
 */
function getReducedFraction(numerator, denominator) {
  let _divider = (0, _c.gcd)(numerator, denominator);
  numerator /= _divider;
  denominator /= _divider;
  return [`${numerator}`, `${denominator}`];
}

/**
 * Generates tex code for given fraction.
 * Used in coordinate system labeling
 *
 * @param {number} numerator numerator of fraction
 * @param {number} denominator denominator of fraction
 * @param {boolean} [simplifyFraction=true] whether to simplify fraction by dividing numerator and denominator by gcd
 * @param {boolean} [compact=true] whether to add ```multiple``` with numerator or simply append it to end of string
 * @param {string} [multiple=""] an multiple
 * @returns {string}
 *
 * @example
 * texFraction(5, 10, false) // -> \frac{5}{10}
 * texFraction(5, 10, true) // -> \frac{1}{2}
 * texFraction(5, 10, true, true, "π") // -> \frac{π}{2}
 * texFraction(5, 10, true, false, "π") // -> \frac{1}{2}π
 * texFraction(5, 10, false, false, "π") // -> \frac{5}{10}π
 * texFraction(5, 10, false, true, "π") // -> \frac{5π}{10}
 * @ignore
 */
function texFraction(numerator, denominator, simplifyFraction = true, compact = true, multiple = "") {
  let num = numerator,
    den = denominator;
  if (simplifyFraction) {
    [num, den] = getReducedFraction(num, den);
  }
  if (num == 0) {
    tex = "0";
  } else if (den == 1) {
    tex = num;
  } else if (compact) {
    // if numerator is 1 and there is a multiple, add multiple without numerator
    if (num == 1 && multiple != "") num = "";
    tex = `\\frac{${num}${multiple}}{${den}}`;
  } else {
    tex = `\\frac{${num}}{${den}}${multiple}`;
  }
  return tex;
}

/**
 * Generates text fraction for given fraction.
 * Used in coordinate system labeling
 *
 * @param {number} numerator numerator of fraction
 * @param {number} denominator denominator of fraction
 * @param {boolean} [simplifyFraction=true] whether to simplify fraction by dividing numerator and denominator by gcd
 * @param {boolean} [compact=true] whether to add ```multiple``` with numerator or simply append it to end of string
 * @param {string} [multiple=""] an multiple
 * @returns {string}
 */
function fraction(numerator, denominator, simplifyFraction = true, compact = true, multiple = "") {
  let num = numerator,
    den = denominator,
    str = "";
  if (simplifyFraction) {
    [num, den] = getReducedFraction(num, den);
  }
  if (num == 0) {
    str = "0";
  } else if (den == 1) {
    str = num + denominator;
  } else if (compact) {
    // if numerator is 1 and there is a multiple, add multiple without numerator
    if (num == 1 && multiple != "") num = "";
    str = `${num}${multiple}/${den}`;
  } else {
    str = `(${num}/${den})${multiple}`;
  }
  return str;
}
function measureHeight(text) {
  let {
    actualBoundingBoxAscent,
    actualBoundingBoxDescent
  } = _main.C.workingContext.measureText(text);
  return actualBoundingBoxAscent + actualBoundingBoxDescent;
}

},{"./c.js":5,"./main.js":17}]},{},[4]);
