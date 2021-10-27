/**
 * return distance between two points
 *
 * @param {Array<number>} p1
 * @param {Array<number>} p2
 * @return number distance between p1 and p2
 */
function dist(p1, p2) {
	return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

/**
 * Returns a point rotated around a point by certain angle, exetened by a certain length
 *
 * @param {number|Array<number>} x center x or center as array of coords [x, y]
 * @param {number} y center y
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {Array<number>} array of two points
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
 * @returns {Array<number>} array of two points
 */
function rotateAroundOrigin(angle, len = 10) {
	return rotateAroundPoint(0, 0, angle, len);
}

/**
 * Returns the point of intersection of two lines.
 *
 * @param {Array<number>} p1 start point of first line as [x, y]
 * @param {Array<number>} p2 end point of first line as [x, y]
 * @param {Array<number>} p3 start point of second line as [x, y]
 * @param {Array<number>} p4 end point of second line as [x, y]
 * @return {Array<number>|Iterable} intersection point of lines as [x, y]
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
 * @param {Array<number>} c1 center of first circle as [x, y]
 * @param {number} r1 radius of first circle
 * @param {Array<number>} c2 center of second circle as [x, y]
 * @param {number} r2 radius of second circle
 * @return {Array<Array<number>>} array of two points as [x, y]
 */
function circleIntersection(c1, r1, c2, r2) {
	const d = dist(c1, c2);
	const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
	const h = Math.sqrt(r1 * r1 - a * a);
	const s = a / d;
	const p2 = [(c2[0] - c1[0]) * s + c1[0], (c2[1] - c1[1]) * s + c1[1]];
	return [
		[p2[0] + (h * (c2[1] - c1[1])) / d, p2[1] - (h * (c2[0] - c1[0])) / d],
		[p2[0] - (h * (c2[1] - c1[1])) / d, p2[1] + (h * (c2[0] - c1[0])) / d],
	];
}

/**
 * Extend a point by given length from a given center
 * @param {Array<number>} center center from the point to be extended
 * @param {Array<number>} point point to be extended
 * @param {number} len length to extend the point
 * @returns {Array<number>}
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
 * @param {Array<number>} point point to be extended
 * @param {number} len length to extend the point
 * @returns {Array<number>}
 */
function extendFromOrigin(point, len = 10) {
	return extendFromPoint([0, 0], point, len);
}

export {
	dist,
	rotateAroundOrigin,
	rotateAroundPoint,
	lineIntersection,
	circleIntersection,
	extendFromPoint,
	extendFromOrigin,
};
