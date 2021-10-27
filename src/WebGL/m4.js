/**
 *
 * @returns {Float32Array}
 */
function readMatrix(args) {
	let mat;
	if (Array.isArray(args[0]) && args[0].length == 16) mat = args[0];
	else if (args.length == 16) mat = args;
	else if (args[0] instanceof m4) mat = args[0].mat;
	else mat = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	return new Float32Array(mat);
}

const EPSILON = 0.000001;

export class m4 {
	/**
	 * Returns a 4x4 Float32Array and functions to modify them
	 * @param {...number|Array<number>|m4|Float32Array} [array] of numbers
	 */
	constructor(array) {

		this.mat = readMatrix(arguments);
		return this;
	}
	/**
	 * Multiplies a matrix by this
	 * from p5.js
	 * @param {...number|Array<number>|m4} mat matrix
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
	 * @param {number|Array<number>} x  the axis to rotate around
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
	 * @param {Array<number>} eye Position of the viewer
	 * @param {Array<number>} center Point the viewer is looking at
	 * @param {Array<number>} up vec3 pointing up
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

		if (
			Math.abs(eyex - centerx) < EPSILON &&
			Math.abs(eyey - centery) < EPSILON &&
			Math.abs(eyez - centerz) < EPSILON
		) {
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
