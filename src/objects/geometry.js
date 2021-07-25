/**
 * Functions for drawing various shapes
 */
import { C } from "../main.js";
import { circleIntersection, lineIntersection } from "../math/points.js";
import { doFillAndStroke } from "../utils.js";

/**
 * Adds a circular arc to the current shape if {@link startShape} was called.
 * If not it will draw a new arc.
 *
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
 * Returns bēzier control points that passes smoothly through given points.
 *
 * @param {array} recentPoint previous point
 * @param {array} currentPoint
 * @param {array} nextPoint
 * @param {array} secondNextPoint
 * @param {number} [tension=1]
 * @return {array} two control points as [cp1x, cp1y, cp2x, cp2y]
 */
function getBezierControlPoints(
	recentPoint,
	currentPoint,
	nextPoint,
	secondNextPoint,
	tension = 1
) {
	return [
		currentPoint[0] + ((nextPoint[0] - recentPoint[0]) / 6) * tension,
		currentPoint[1] + ((nextPoint[1] - recentPoint[1]) / 6) * tension,
		nextPoint[0] - ((secondNextPoint[0] - currentPoint[0]) / 6) * tension,
		nextPoint[1] - ((secondNextPoint[1] - currentPoint[1]) / 6) * tension,
	];
}

/**
 * Adds a smooth curve passing through given points and tension using bézie curve to the current shape.
 * Taken from {@link https://stackoverflow.com/a/49371349}
 *
 * @param {array} points array of points as [x, y]
 * @param {number} tension tension of the curve
 */
function smoothCurveThroughPointsTo(points, tension = 1, closed = true) {
	for (var i = 0; i < points.length - 1; i++) {
		var recentPoint =
			i > 0 ? points[i - 1] : closed ? points[points.length - 2] : points[0];
		var currentPoint = points[i];
		var nextPoint = points[i + 1];
		var secondNextPoint =
			i != points.length - 2 ? points[i + 2] : closed ? points[1] : nextPoint;

		var cp = getBezierControlPoints(
			recentPoint,
			currentPoint,
			nextPoint,
			secondNextPoint,
			tension
		);
		C.workingCanvas.bezierCurveTo(
			cp[0],
			cp[1],
			cp[2],
			cp[3],
			nextPoint[0],
			nextPoint[1]
		);
	}
}

/**
 * Draws smooth curve passing through given points and tension using bézie curve.
 *
 * @param {array} points array of points as [x, y]
 * @param {number} tension tension of the curve
 */
function smoothCurveThroughPoints(points, tension = 1, closed = true) {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);

	smoothCurveThroughPointsTo(points, tension, closed);
	ctx.closePath();
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
 * @param {array} p1 start point of first line array of point as [x, y]
 * @param {array} p2 end point of first line array of point as [x, y]
 * @param {array} p3 start point of second line array of point as [x, y]
 * @param {array} p4 end point of second line array of point as [x, y]
 * @param {number} radius radius of angle
 * @param {number} extender extender of output point
 * @param {boolean} otherAngle whether to draw the other angle
 * @param {number} angleDir there can be four angle in a line intersection. Choose a number from 1 to 4.
 * @returns {array} coordinate of point in the middle of angle as array of point as [x, y]
 */
function angle(
	p1,
	p2,
	p3,
	p4,
	radius = 20,
	extender = 10,
	otherAngle = false,
	angleDir = 1
) {
	const [x, y] = lineIntersection(p1, p2, p3, p4);
	if (!(isNaN(x) || isNaN(y))) {
		var ang,
			startAngle,
			a1 = Math.atan2(p1[1] - y, p1[0] - x),
			a2 = Math.atan2(p2[1] - y, p2[0] - x),
			a3 = Math.atan2(p3[1] - y, p3[0] - x),
			a4 = Math.atan2(p4[1] - y, p4[0] - x);

		var angleDirs = {
				1: [a2, a4],
				2: [a4, a1],
				3: [a1, a3],
				4: [a3, a2],
			},
			dir = angleDirs[angleDir];
		if (otherAngle) {
			startAngle = dir[1];
			ang = dir[0] - dir[1];
		} else {
			startAngle = dir[0];
			ang = dir[1] - dir[0];
		}

		const ctx = C.workingCanvas;
		if (ctx.doFill) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.arc(x, y, radius, startAngle, ang + startAngle);
			ctx.fill();
			ctx.closePath();
		}
		if (ctx.doStroke) {
			ctx.beginPath();
			ctx.arc(x, y, radius, startAngle, ang + startAngle);
			ctx.stroke();
			ctx.closePath();
		}
		return {
			center: [
				x + (radius + extender) * Math.cos(startAngle + ang / 2),
				y + (radius + extender) * Math.sin(startAngle + ang / 2),
			],
			ang: ang,
		};
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

/**
 * Draws a line
 *
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
	getBezierControlPoints,
};
