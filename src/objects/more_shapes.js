/** @module Extra shapes*/
import { C } from "../main.js";
import { circleIntersection } from "../math/points.js";

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
		baseAngle = (Math.PI * 2) / sumOfRatio,
		ctx = C.workingContext;
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
	let p = circleIntersection(c1, r1, c2, r2),
		pa = p[0],
		pb = p[1];
	// angles to the points
	let c1a1 = Math.atan2(pa[1] - c1[1], pa[0] - c1[0]),
		c1a2 = Math.atan2(pb[1] - c1[1], pb[0] - c1[0]),
		c2a1 = Math.atan2(pa[1] - c2[1], pa[0] - c2[0]),
		c2a2 = Math.atan2(pb[1] - c2[1], pb[0] - c2[0]),
		ctx = C.workingContext;
	ctx.beginPath();
	ctx.arc(c1[0], c1[1], r1, c1a1, c1a2);
	ctx.arc(c2[0], c2[1], r2, c2a2, c2a1);
	if (ctx.doStroke) ctx.stroke();
	if (ctx.doFill) ctx.fill();
	ctx.closePath();
}
export { polygonWithRatioOfCentralAngles, lens };
