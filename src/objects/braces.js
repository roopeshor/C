import { C } from "../main.js";

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

	const path =
		`M ${x1} ${y1} ` +
		`Q ${cp1x} ${cp1y} ${cp2x} ${cp2y} ` +
		`T ${middleTipX} ${middleTipY} ` +
		`M ${x2} ${y2} ` +
		`Q ${cp3x} ${cp3y} ${cp4x} ${cp4y} ` +
		`T ${middleTipX} ${middleTipY}`;
	C.workingContext.stroke(new Path2D(path));
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
 * @return {Array<number>} array of two numbers that are the coordinate of middle tip extended by a certain value.
 */
function arcBrace(
	x,
	y,
	radius = 100,
	angle = Math.PI / 2,
	startAngle = 0,
	smallerLineLength = 10,
	tipLineLength = smallerLineLength,
	extender = 10
) {
	const ctx = C.workingContext,
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

	return [
		(largerRadius + extender) * Math.cos(angle / 2 + startAngle) + x,
		(largerRadius + extender) * Math.sin(angle / 2 + startAngle) + y,
	];
}

export { curlyBrace, arcBrace };
