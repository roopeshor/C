/**
 * This module contains useful math functions.
 * @module math
 */

export const {
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
	tanh,
} = Math;

/**
 * return distance between two points
 *
 * @global
 * @param {array} p1
 * @param {array} p2
 * @return {number} distance between p1 and p2
 */
function dist(p1, p2) {
	return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

/**
 * Returns a random integer between given range.
 *
 * @global
 * @param {number} [max=10] maximum range
 * @param {number} [min=0] minimum range
 * @return {number}
 */
function randomInt(max = 10, min = 0) {
	return Math.round(Math.random() * (max - min) + min);
}

/**
 * Returns a point rotated around a point by certain angle, exetened by a certain length
 *
 * @global
 * @param {number|array} x center x or center as array of coords [x, y]
 * @param {number} y center y
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {array} array of two points
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
 * @global
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {array} array of two points
 */
function rotateAroundOrigin(angle, len = 10) {
	return rotateAroundPoint(0, 0, angle, len);
}

/**
 * Returns the point of intersection of two lines.
 *
 * @global
 * @param {array} p1 start point of first line as [x, y]
 * @param {array} p2 end point of first line as [x, y]
 * @param {array} p3 start point of second line as [x, y]
 * @param {array} p4 end point of second line as [x, y]
 * @return {array} intersection point of lines as [x, y]
 */
function intersectionOfLines(p1, p2, p3, p4) {
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
 * A translation from {@link https://stackoverflow.com/a/14146166}
 *
 * @param {array} c1 center of first circle as [x, y]
 * @param {number} r1 radius of first circle
 * @param {array} c2 center of second circle as [x, y]
 * @param {number} r2 radius of second circle
 * @return {array} array of two points as [x, y]
 */
function circleIntersection(c1, r1, c2, r2) {
	const d = dist(c1, c2);
	const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
	const h = sqrt(r1 * r1 - a * a);
	const s = a / d;
	const p2 = [(c2[0] - c1[0]) * s + c1[0], (c2[1] - c1[1]) * s + c1[1]];
	return [
		[p2[0] + (h * (c2[1] - c1[1])) / d, p2[1] - (h * (c2[0] - c1[0])) / d],
		[p2[0] - (h * (c2[1] - c1[1])) / d, p2[1] + (h * (c2[0] - c1[0])) / d],
	];
}

export {
	dist,
	randomInt,
	rotateAroundOrigin,
	rotateAroundPoint,
	intersectionOfLines as lineIntersection,
	circleIntersection,
};
