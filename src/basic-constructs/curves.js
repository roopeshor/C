import { C } from "../main.js";

/**
 * This module contains functions to draw curved shapes.
 * @module curves
*/

/**
 * Adds a circular arc to the current shape if {@link startShape} was called.
 * If not it will draw a new arc.
 *
 * @global
 * @param {number} x The x-axis coordinate of the arc's center.
 * @param {number} y The y-axis coordinate of the arc's center.
 * @param {number} r arc's radius (must be positive)
 * @param {number} [angle=PI/2] central angle (use negative values to rotate arc clockwise)
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */
function arc(x, y, r, angle = Math.PI / 2, startAngle = 0) {
	const ctx = C.workingCanvas;
	if (!ctx.pathStarted) ctx.beginPath();
	ctx.arc(x, y, r, startAngle, startAngle + angle);
	if (!ctx.pathStarted) {
		if (ctx.doStroke) ctx.stroke();
		ctx.closePath();
	}
}

/**
 * Creates a circular arc using the given control points and radius.
 * If a current path started it will add this to the end of path
 *
 * @global
 * @param {number} x1 x-axis coord of first point
 * @param {number} y1 y-axis coord of first point
 * @param {number} x2 x-axis coord of second point
 * @param {number} y2 y-axis coord of second point
 * @param {number} radius radius of arc
 */
function arcTo(x1, y1, x2, y2, radius) {
	const ctx = C.workingCanvas;
	if (ctx.pathStarted) {
		ctx.arcTo(x1, y1, x2, y2, radius);
	} else {
		ctx.beginPath();
		ctx.arcTo(x1, y1, x2, y2, radius);
		if (ctx.doStroke) ctx.stroke();
		if (ctx.doFill) ctx.fill();
		ctx.closePath();
	}
}

/**
 * Draws a circular segment.
 *
 * @global
 * @param {number} x x-axis coordinate of center of circular sector
 * @param {number} y y-axis coordinate of center of circular sector
 * @param {number} r radius of the circular sector
 * @param {number} [angle=Math.PI / 2] central angle
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */
function circularSegment(x, y, r, angle = Math.PI / 2, startAngle = 0) {
	const ctx = C.workingCanvas;
	if (!ctx.pathStarted) ctx.beginPath();
	ctx.arc(x, y, r, startAngle, startAngle + angle);
	if (!ctx.pathStarted) {
		if (ctx.doFill) ctx.fill();
		if (ctx.doStroke) ctx.stroke();
		ctx.closePath();
	}
}

/**
 * Draws circle
 *
 * @global
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} r radius
 */
function circle(x, y, r) {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
	ctx.closePath();
}

/**
 * Adds an elliptical arc to the current shape if {@link startShape} was called.
 * If not it will draw a new ellipse.
 *
 * @global
 * @param {number} x x-axis coordinate of ellipse's center
 * @param {number} y y-axis coordinate of ellipse's center
 * @param {number} radius1 ellipse's major-axis radius. Must be non-negative.
 * @param {number} radius2 ellipse's minor-axis radius. Must be non-negative.
 * @param {number} [rotation=0] The rotation of the ellipse, expressed in radians.
 * @param {number} [startAngle=0] The angle at which the ellipse starts, measured clockwise from the positive x-axis and expressed in radians.
 * @param {number} [angle=Math.PI * 2] central angle of ellipse. Use negative values to rotate it anticlockwise
 */
function ellipse(
	x,
	y,
	radius1,
	radius2,
	rotation = 0,
	startAngle = 0,
	angle = Math.PI * 2
) {
	const ctx = C.workingCanvas;
	if (!ctx.pathStarted) ctx.beginPath();
	ctx.ellipse(x, y, radius1, radius2, rotation, startAngle, startAngle + angle);
	if (!ctx.pathStarted) {
		if (ctx.doFill) ctx.fill();
		if (ctx.doStroke) ctx.stroke();
		ctx.closePath();
	}
}

/**
 * Adds a bézie curve to current shape if {@link startShape} was called.
 * If not it will draw a new bézie curve.
 *
 * @global
 * @param {number} cpx1 x-axis coord of first control point
 * @param {number} cpy1 y-axis coord of first control point
 * @param {number} cpx2 x-axis coord of second control point
 * @param {number} cpy2 y-axis coord of second control point
 * @param {number} x3 x-axis coord of the end point
 * @param {number} y3 y-axis coord of the end point
 */
function bezier(cpx1, cpy1, cpx2, cpy2, x3, y3) {
	const ctx = C.workingCanvas;
	const pathStarted = ctx.pathStarted;
	if (!pathStarted) ctx.beginPath();
	ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x3, y3);
	if (pathStarted) return;
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
	ctx.closePath();
}

/**
 * Draws a sector
 *
 * @global
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} radius radius of sector
 * @param {number} [angle=PI/2] central angle (use negative angle to move sector clockwise)
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */
function sector(x, y, radius, angle = Math.PI / 2, startAngle = 0) {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.arc(x, y, radius, startAngle, startAngle + angle);
	ctx.lineTo(x, y);
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
	ctx.closePath();
}

/**
 * Draws smooth curve passing through given points and tension using bezier curve.
 * Taken from <https://stackoverflow.com/a/49371349>
 *
 * @global
 * @param {array} points array of points as [x, y]
 * @param {number} tension tension of the curve
 */
function smoothCurveThroughPoints(points, tension=1) {
	const ctx = C.workingCanvas;
	if (!ctx.pathStarted) {
		ctx.beginPath();
		ctx.moveTo(points[0][0], points[0][1]);
	}
	for (var i = 0; i < points.length - 1; i++) {
		var recentPoint = i > 0 ? points[i - 1] : points[0];
		var currentPoint = points[i];
		var nextPoint = points[i + 1];
		var secondNextPoint = i != points.length - 2 ? points[i + 2] : nextPoint;

		var cp1x =
			currentPoint[0] + ((nextPoint[0] - recentPoint[0]) / 6) * tension;
		var cp1y =
			currentPoint[1] + ((nextPoint[1] - recentPoint[1]) / 6) * tension;
		var cp2x =
			nextPoint[0] - ((secondNextPoint[0] - currentPoint[0]) / 6) * tension;
		var cp2y =
			nextPoint[1] - ((secondNextPoint[1] - currentPoint[1]) / 6) * tension;

		ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nextPoint[0], nextPoint[1]);
	}

	if (!ctx.pathStarted) {
		if (ctx.doFill) ctx.fill();
		if (ctx.doStroke) ctx.stroke();
		ctx.closePath();
	}
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
function quadraticCurve(){
	const ctx = C.workingCanvas, args = arguments;
	if (args.length == 4) {
		ctx.quadraticCurveTo(args[0], args[1], args[2], args[3]);
	} else if (args.length == 6) {
		ctx.beginPath();
		ctx.moveTo(args[0], args[1]);
		ctx.quadraticCurveTo(args[2], args[3], args[4], args[5]);
		if (ctx.doFill) ctx.fill();
		if (ctx.doStroke) ctx.stroke();
		ctx.closePath();
	}
}

export {
	arc,
	circle,
	ellipse,
	bezier,
	sector,
	circularSegment,
	arcTo,
	smoothCurveThroughPoints,
	quadraticCurve,
};
