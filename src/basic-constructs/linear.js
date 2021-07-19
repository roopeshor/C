import { C } from "../main.js";
/**
 * This module contains functions for drawing linear shapes
 * @module linear
 */

/**
 * Draws a line
 *
 * @global
 * @param {number} x1 start x coord
 * @param {number} y1 start y coord
 * @param {number} x2 end x coord
 * @param {number} y2 end y coord
 */
function line(x1, y1, x2, y2) {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.closePath();
}

/**
 * Draws a rectangle
 *
 * @global
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} width widht
 * @param {number} height height
 */
function rect(x, y, width, height) {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
	ctx.closePath();
}

/**
 * Draws polygon with given points
 * @global
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
	const args = arguments;
	if (args.length > 2) {
		const ctx = C.workingCanvas;
		const start = args[0];
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
 * @global
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
 * @global
 * @param {array} p1 1st point
 * @param {array} p2 2nd point
 * @param {array} p3 3rd point
 * @param {array} p4 4th point
 */
function quad(p1, p2, p3, p4) {
	const ctx = C.workingCanvas;
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
 * @global
 * @param {array} p1 first point
 * @param {array} p2 second point
 * @param {array} p3 third point
 */
function triangle(p1, p2, p3) {
	const ctx = C.workingCanvas;
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
 * @global
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
 * @global
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} sides number of sides
 * @param {number} sideLength length of a side
 * @param {number} [rotation=0] amound to rotate the entire polygon
 */
function regularPolygon(x, y, sides, sideLength, rotation = 0) {
	const radius = sideLength / (2 * Math.sin(Math.PI / sides)); // finds ex-radius
	regularPolygonWithRadius(x, y, sides, radius, rotation);
}

/**
 * Draws a regular polygon that is inside a circle
 *
 * @global
 * @param {number} x x coord
 * @param {number} y y coord
 * @param {number} sides number of sides
 * @param {number} radius radius
 * @param {number} [rotation=0] amound to rotate the entire polygon
 */
function regularPolygonWithRadius(x, y, sides, radius, rotation = 0) {
	let i = 0;
	const e = (Math.PI * 2) / sides;
	const ctx = C.workingCanvas;
	rotation += e / 2;
	const initial = [
		Math.cos(rotation) * radius + x,
		Math.sin(rotation) * radius + y,
	];
	ctx.beginPath();
	ctx.moveTo(initial[0], initial[1]);
	while (i++ < sides) {
		ctx.lineTo(
			Math.cos(i * e + rotation) * radius + x,
			Math.sin(i * e + rotation) * radius + y
		);
	}
	ctx.lineTo(initial[0], initial[1]);
	ctx.closePath();
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
}

/**
 * Draws a polygon with ratio of central angles
 *
 * @global
 * @param {number} x x coord of centre of polygon
 * @param {number} y y coord of centre of polygon
 * @param {number} radius radius of ex-circle of polygon
 * @param {array} ratios array of ratios of central angles. Must have atleast 3 elements.
 * @param {number} [rotation=0] amound to rotate the entire polygon.
 */
function polygonWithRatioOfCentralAngles(x, y, radius, ratios, rotation = 0) {
	if (!Array.isArray(ratios)) console.error("ratio provided is not array");
	const sumOfRatio = ratios.reduce((a, b) => a + b, 0);
	const baseAngle = (Math.PI * 2) / sumOfRatio;
	const ctx = C.workingCanvas;
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

export {
	line,
	rect,
	polygon,
	square,
	quad,
	triangle,
	equiTriangle,
	regularPolygon,
	regularPolygonWithRadius,
	polygonWithRatioOfCentralAngles,
};
