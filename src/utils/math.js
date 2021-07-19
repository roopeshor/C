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
	tanh
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
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {array} array of two points
 */
function rotateAroundPoint(x, y, angle, len = 10) {
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

export {
	dist,
	randomInt,
	rotateAroundOrigin,
	rotateAroundPoint,
	intersectionOfLines as lineIntersection
};
