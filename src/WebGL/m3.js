export const m3 = {
	multiply: function (a, b) {
		return [
			b[0] * a[0] + b[1] * a[3] + b[2] * a[6],
			b[0] * a[1] + b[1] * a[4] + b[2] * a[7],
			b[0] * a[2] + b[1] * a[5] + b[2] * a[8],
			b[3] * a[0] + b[4] * a[3] + b[5] * a[6],
			b[3] * a[1] + b[4] * a[4] + b[5] * a[7],
			b[3] * a[2] + b[4] * a[5] + b[5] * a[8],
			b[6] * a[0] + b[7] * a[3] + b[8] * a[6],
			b[6] * a[1] + b[7] * a[4] + b[8] * a[7],
			b[6] * a[2] + b[7] * a[5] + b[8] * a[8],
		];
	},
	translation: function (tx, ty) {
		// prettier-ignore
		return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
	},

	translate: function (m, tx, ty) {
		let mat = this.multiply(m, this.translation(tx, ty));
		for (let i = 0; i < mat.length; i++) m[i] = mat[i];
	},

	rotation: function (ang) {
		var c = Math.cos(ang);
		var s = Math.sin(ang);
		// prettier-ignore
		return [
      c,-s, 0,
      s, c, 0,
      0, 0, 1,
    ];
	},

	rotate: function (m, ang) {
		let mat = this.multiply(m, this.rotation(ang));
		for (let i = 0; i < mat.length; i++) m[i] = mat[i];
	},

	scaling: function (sx, sy) {
		// prettier-ignore
		return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
	},

	scale: function (m, sx, sy) {
		let mat = this.multiply(m, this.scaling(sx, sy));
		for (let i = 0; i < mat.length; i++) m[i] = mat[i];
	},
};
