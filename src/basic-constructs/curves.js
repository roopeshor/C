import { C } from "../main.js";
import { circleIntersection, lineIntersection } from "../utils/math.js";
import { doFillAndStroke } from "../utils/utils.js";

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
	if (!ctx.pathStarted) doFillAndStroke(ctx);
}

/**
 * Draws a point with given size in pixels
 *
 * @global
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} [size=10] diameter of point in px
 * @param {boolean} [doStroke=false] whether to stroke or not
 */
function point(x, y, size = 10, doStroke = false) {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.arc(x, y, size / 2, 0, Math.PI * 2);
	ctx.fill();
	if (doStroke) ctx.stroke();
	ctx.closePath();
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
	if (!ctx.pathStarted) doFillAndStroke(ctx);
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
	doFillAndStroke(ctx);
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
	if (!ctx.pathStarted) doFillAndStroke(ctx);
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
	if (!ctx.pathStarted) doFillAndStroke(ctx);
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
	doFillAndStroke(ctx);
}

/**
 * Adds a smooth curve passing through given points and tension using bézie curve to the current shape.
 * Taken from {@link https://stackoverflow.com/a/49371349}
 *
 * @global
 * @param {array} points array of points as [x, y]
 * @param {number} tension tension of the curve
 */
function smoothCurveThroughPointsTo(points, tension = 1) {
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

		C.workingCanvas.bezierCurveTo(
			cp1x,
			cp1y,
			cp2x,
			cp2y,
			nextPoint[0],
			nextPoint[1]
		);
	}
}

/**
 * Draws smooth curve passing through given points and tension using bézie curve.
 *
 * @global
 * @param {array} points array of points as [x, y]
 * @param {number} tension tension of the curve
 */
function smoothCurveThroughPoints(points, tension = 1) {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);

	smoothCurveThroughPointsTo(points, tension);
	doFillAndStroke(ctx);
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
	const ctx = C.workingCanvas,
		args = arguments;
	if (args.length == 4) {
		ctx.quadraticCurveTo(args[0], args[1], args[2], args[3]);
	} else if (args.length == 6) {
		ctx.beginPath();
		ctx.moveTo(args[0], args[1]);
		ctx.quadraticCurveTo(args[2], args[3], args[4], args[5]);
		doFillAndStroke(ctx);
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
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.arc(x, y, innerRadius, 0, 2 * Math.PI, false);
	ctx.moveTo(outerRadius, 0);
	ctx.arc(x, y, outerRadius, 0, 2 * Math.PI, true);
	doFillAndStroke(ctx);
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
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.arc(x, y, innerRadius, startAngle, startAngle + angle, false);
	ctx.arc(x, y, outerRadius, startAngle + angle, startAngle, true);
	doFillAndStroke(ctx);
}

/**
 * Angle between two lines. And returns the coordinate of middle of angle
 *
 * @global
 * @param {array} p1 start point of first line array of point as [x, y]
 * @param {array} p2 end point of first line array of point as [x, y]
 * @param {array} p3 start point of second line array of point as [x, y]
 * @param {array} p4 end point of second line array of point as [x, y]
 * @param {number} radius radius of angle
 * @param {boolean} otherAngle whether to draw the other angle
 * @param {number} extender extender of output point
 * @returns {array} coordinate of point in the middle of angle as array of point as [x, y]
 */
function angle(p1, p2, p3, p4, radius = 20, otherAngle = false, extender = 10) {
	const [x, y] = lineIntersection(p1, p2, p3, p4);
	if (!(isNaN(x) || isNaN(y))) {
		var angleFromPlane, angle;
		if (otherAngle) {
			angleFromPlane = Math.atan2(p2[1] - y, p2[0] - x);
			angle = Math.atan2(p4[1] - p2[1], p4[0] - p2[0]);
		} else {
			angleFromPlane = Math.atan2(p4[1] - y, p4[0] - x);
			angle = Math.atan2(p2[1] - p4[1], p2[0] - p4[0]);
		}

		const ctx = C.workingCanvas;
		if (ctx.doFill) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.arc(x, y, radius, angleFromPlane, angle + angleFromPlane);
			ctx.fill();
			ctx.closePath();
		}
		if (ctx.doStroke) {
			ctx.beginPath();
			ctx.arc(x, y, radius, angleFromPlane, angle + angleFromPlane);
			ctx.stroke();
			ctx.closePath();
		}
		return [
			x + (radius + extender) * Math.cos(angleFromPlane + angle / 2),
			y + (radius + extender) * Math.sin(angleFromPlane + angle / 2),
		];
	} else {
		// TODO: should it be `throw Error()`?
		console.error("No intersection point");
	}
}

/**
 * Creates a circular arc using the given control points and radius.
 * If a current path started it will add this to the end of path.
 * Returns the center of arc.
 *
 * @global
 * @param {number} x1 x-coord of first point
 * @param {number} y1 y-coord of first point
 * @param {number} x2 x-coord of second point
 * @param {number} y2 y-coord of second point
 * @param {number} radius radius of arc
 * @param {boolean} otherArc specifies whether to use other arc of the circle.
 * @returns {array} returns the coordinate of center of the arc as [x, y]
 */
function arcBetweenPoints(x1, y1, x2, y2, radius, otherArc = false) {
	if (x1 == x2 && y1 == y2)
		// TODO: should it be `throw Error()`?
		console.error(
			"Can't draw a arc between points. Given points are exactly same"
		);
	var center = circleIntersection([x1, y1], radius, [x2, y2], radius)[0];
	const ctx = C.workingCanvas;
	const angleFromXAxis = Math.atan2(y1 - center[1], x1 - center[0]);
	const centralAngle =
		Math.atan2(y2 - center[1], x2 - center[0]) - angleFromXAxis;
	if (!ctx.pathStarted) {
		ctx.save();
		ctx.beginPath();
	}
	ctx.arc(
		center[0],
		center[1],
		radius,
		angleFromXAxis,
		centralAngle + angleFromXAxis,
		!otherArc
	);
	if (!ctx.pathStarted) {
		doFillAndStroke(ctx);
		ctx.restore();
	}
	return center;
}

export {
	arc,
	circle,
	ellipse,
	bezier,
	point,
	sector,
	circularSegment,
	smoothCurveThroughPointsTo,
	smoothCurveThroughPoints,
	quadraticCurve,
	annulus,
	annulusSector,
	angle,
	arcBetweenPoints,
};
