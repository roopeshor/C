/** @module Arrows */

import { BEVEL, CENTER, MIDDLE } from "../constants/drawing.js";
import { C } from "../main.js";
import { circleIntersection } from "../math/points.js";
import { endShape, restore, save, startShape } from "../settings.js";
import { applyDefault, doFillAndStroke } from "../utils.js";
import { fillText } from "./text.js";

const DEFAULT_TIP_WIDTH = 15;
const TRANSPARENT = "rgba(0,0,0,0)";
/**
 * Draws a arrow tip
 *
 * @param {number} x1 x position of start point
 * @param {number} y1 y position of start point
 * @param {number} x2 x position of end point
 * @param {number} y2 y position of end point
 * @param {number} length length of tip
 * @param {number} breadth breadth of tip
 */
export function arrowTip(x1, y1, x2, y2, length, breadth) {
	let ctx = C.workingContext;
	let thickness = ctx.lineWidth;
	let distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
	if (isNaN(length)) length = distance;
	breadth = breadth || length / 1.2;
	let w = length - distance;
	let r = Math.sqrt(w ** 2 + (breadth / 2) ** 2);
	let t = Math.atan(breadth / (w * 2));
	if (distance > length) t = t + Math.PI;
	let angleFromXAxis = Math.atan2(y2 - y1, x2 - x1);
	let A = [x1 - Math.cos(t + angleFromXAxis) * r, y1 - Math.sin(t + angleFromXAxis) * r];
	let B = [
		x1 - Math.cos(-t + angleFromXAxis) * r,
		y1 - Math.sin(-t + angleFromXAxis) * r,
	];
	if (ctx.doStroke && ctx.lineJoin != BEVEL) {
		// correcting tip
		x2 -= Math.cos(angleFromXAxis) * thickness;
		y2 -= Math.sin(angleFromXAxis) * thickness;
	}
	ctx.save();
	if (!ctx.pathStarted) ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(A[0], A[1]);
	ctx.lineTo(x2, y2);
	ctx.lineTo(B[0], B[1]);
	ctx.lineTo(x1, y1);
	if (!ctx.pathStarted) {
		doFillAndStroke(ctx);
		ctx.closePath();
	}
	ctx.restore();
}

/**
 * draws a arrow
 *
 * @param {number} x1 starting x-axis coord
 * @param {number} y1 starting y-axis coord
 * @param {number} x2 ending x-axis coord
 * @param {number} y2 ending y-axis coord
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipBreadth Breadth of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving = 0] worping of arrow
 * @param {number} [spacing = 0] padding from end to tip
 *
 */
export function arrow(
	x1,
	y1,
	x2,
	y2,
	tipLength = DEFAULT_TIP_WIDTH,
	tipBreadth = tipLength / 1.2,
	arrowCurving = 0,
	spacing = 0,
) {
	const angle = Math.atan2(y2 - y1, x2 - x1); // angle from plain
	const yDiff = Math.sin(angle) * spacing;
	const xDiff = Math.cos(angle) * spacing;

	// decrease the length of tip by `spacing`
	x2 -= xDiff;
	y2 -= yDiff;

	const xTipSpacing = Math.cos(angle) * (tipLength - arrowCurving);
	const yTipSpacing = Math.sin(angle) * (tipLength - arrowCurving);
	const ctx = C.workingContext;
	const pathStarted = ctx.pathStarted;
	if (!pathStarted) startShape();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2 - xTipSpacing, y2 - yTipSpacing);
	ctx.stroke();
	arrowTip(x2 - xTipSpacing, y2 - yTipSpacing, x2, y2, tipLength, tipBreadth);
	if (!pathStarted) {
		doFillAndStroke(ctx);
		endShape();
	}
}

/**
 * Draws a double tipped arrow
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} [tipBreadth] breadth of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving = 0]
 * @param {number} [spacing=0]
 */
export function doubleArrow(
	x1,
	y1,
	x2,
	y2,
	tipLength = DEFAULT_TIP_WIDTH,
	tipBreadth = tipLength / 1.2,
	arrowCurving = 0,
	spacing = 0,
) {
	const angle = Math.atan2(y2 - y1, x2 - x1);

	const xPadding = Math.cos(angle) * (tipLength - arrowCurving);
	const yPadding = Math.sin(angle) * (tipLength - arrowCurving);

	const ySpacing = Math.sin(angle) * spacing;
	const xSpacing = Math.cos(angle) * spacing;
	startShape();

	x1 += xPadding + xSpacing;
	y1 += yPadding + ySpacing;

	arrow(x1, y1, x2, y2, tipLength, tipBreadth, arrowCurving, spacing);
	arrowTip(x1, y1, x1 - xPadding, y1 - yPadding, tipLength, tipBreadth);
	doFillAndStroke(C.workingContext);
	endShape();
}

/**
 * Draws a double tipped arrow with text in the middle
 *
 * @param {Object} args parameters.
 * Possible values:
 * @param {string} args.text text
 * @param {number[]} args.p1 first point
 * @param {number[]} args.p2 second point
 * @param {number} [args.tipLength = 15] tip width
 * @param {number} [args.tipBreadth = 12.5] tip height
 * @param {number} [args.spacing = 0] spacing
 * @param {string|number} args.background background of text
 * @param {number} args.innerPadding padding of text
 * @param {number} args.outerPadding tip spacing
 * @param {number} args.textRotation rotatioin of text
 * @param {number} args.arrowCurving worping of arrow
 */
export function measurement(args) {
	const ctx = C.workingContext;
	const defaults = {
		background: TRANSPARENT,
		tipLength: DEFAULT_TIP_WIDTH,
		tipBreadth: DEFAULT_TIP_WIDTH / 1.2,
		innerPadding: 3,
		outerPadding: 0,
		textRotation: 0,
		arrowCurving: 0,
	};
	args = applyDefault(defaults, args);
	const { p1, p2 } = args;
	const angleFromXAxis = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
	const { width } = ctx.measureText(args.text);
	const innerPadding = [
		Math.cos(angleFromXAxis) * (args.innerPadding + width / 2),
		Math.sin(angleFromXAxis) * (args.innerPadding + width / 2),
	];
	const center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];

	// draw arrows
	arrow(
		center[0] - innerPadding[0],
		center[1] - innerPadding[1],
		p1[0],
		p1[1],
		args.tipLength,
		args.tipBreadth,
		args.arrowCurving,
		args.outerPadding,
	);
	arrow(
		center[0] + innerPadding[0],
		center[1] + innerPadding[1],
		p2[0],
		p2[1],
		args.tipLength,
		args.tipBreadth,
		args.arrowCurving,
		args.outerPadding,
	);

	save();
	ctx.translate(center[0], center[1]);
	ctx.textAlign = CENTER;
	ctx.textBaseline = MIDDLE;
	ctx.rotate(Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) + args.textRotation);
	fillText(args.text, 0, 0);
	restore();
}

/**
 * Draws a curved arrow that wrap around a circle.
 *
 * @param {number} x x position of circle
 * @param {number} y y position of circle
 * @param {number} radius radius of circle
 * @param {number} [angle=1.5707963267948966] central angle of arc
 * @param {number} [startAngle=0] starting angle
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipBreadth height of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving=0] arrow curving constant
 * @param {number} [tipOffset=10] offset (padding) of tip from it's defined end
 * @param {boolean} [reverse=false] whether to reverse the direction of arrow
 */
export function curvedArrow(
	x,
	y,
	radius,
	angle = Math.PI / 2,
	startAngle = 0,
	tipLength = DEFAULT_TIP_WIDTH,
	tipBreadth = tipLength / 1.2,
	arrowCurving = 0,
	tipOffset = 0,
	reverse = false,
) {
	const ctx = C.workingContext;

	const tipAngularDiameter = tipLength / radius;
	ctx.save();
	arrowCurving /= radius;
	let padding = tipAngularDiameter - arrowCurving;

	ctx.beginPath();
	if (reverse) {
		padding += tipOffset;
		ctx.arc(x, y, radius, padding + startAngle, angle + startAngle);
		ctx.stroke();
		ctx.closePath();
		arrowTip(
			x + radius * Math.cos(startAngle + padding),
			y + radius * Math.sin(startAngle + padding),
			x + radius * Math.cos(startAngle + tipOffset),
			y + radius * Math.sin(startAngle + tipOffset),
			tipLength,
			tipBreadth,
		);
	} else {
		angle -= tipOffset;
		ctx.arc(x, y, radius, startAngle, angle - padding + startAngle);
		ctx.stroke();
		ctx.closePath();
		arrowTip(
			x + radius * Math.cos(startAngle + angle - padding),
			y + radius * Math.sin(startAngle + angle - padding),
			x + radius * Math.cos(startAngle + angle),
			y + radius * Math.sin(startAngle + angle),
			tipLength,
			tipBreadth,
		);
	}
	ctx.restore();
}

/**
 * Draws a curved arrow with two tips.
 *
 * @param {number} x x position of circle
 * @param {number} y y position of circle
 * @param {number} radius radius of circle
 * @param {number} [angle=1.5707963267948966] central angle of arrow in radians
 * @param {number} [startAngle=0] start angle of arrow in radians
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of arrow tip
 * @param {number} tipBreadth height of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving=0] curving of arrow
 * @param {number} [tipOffset=0] angular offset of arrow from radial boundaries in radians.
 */
export function curvedDoubleArrow(
	x,
	y,
	radius,
	angle = Math.PI / 2,
	startAngle = 0,
	tipLength = DEFAULT_TIP_WIDTH,
	tipBreadth = tipLength / 1.2,
	arrowCurving = 0,
	tipOffset = 0,
) {
	const ctx = C.workingContext;
	ctx.save();
	const tipAngularDiameter = tipLength / radius;
	const tangent = [
		-Math.cos(startAngle + tipAngularDiameter / 2 + Math.PI / 2),
		-Math.sin(startAngle + tipAngularDiameter / 2 + Math.PI / 2),
	];
	angle -= tipAngularDiameter;
	startAngle += tipAngularDiameter + tipOffset * 2;
	curvedArrow(
		x,
		y,
		radius,
		angle + arrowCurving / radius,
		startAngle - arrowCurving / radius,
		tipLength,
		tipBreadth,
		arrowCurving,
		tipOffset,
	);

	arrowTip(
		Math.cos(startAngle - arrowCurving / radius) * radius,
		Math.sin(startAngle - arrowCurving / radius) * radius,
		Math.cos(startAngle) * radius + tipLength * tangent[0],
		Math.sin(startAngle) * radius + tipLength * tangent[1],
		tipLength,
		tipBreadth,
	);
	ctx.restore();
}

/**
 * Draws a curved arrow between two points that wraps around a circle with a definite radius.
 *
 * @param {number[]} p1 start point
 * @param {number[]} p2 end point
 * @param {number} radius radius of circle
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipBreadth height of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving=0] arrow curving const. Expressed in pixels
 * @param {number} [tipOffset=0] offset (padding) of tip from it's defined end. Expressed in radians
 * @param {boolean} [otherArc=false] whether to use other arc
 * @param {boolean} [reverse=false] whether to reverse the direction of arrow.
 * @return {number[]} coordiante of the center of arc as [x, y]
 */
export function curvedArrowBetweenPoints(
	p1,
	p2,
	radius,
	tipLength = DEFAULT_TIP_WIDTH,
	tipBreadth = tipLength / 1.2,
	arrowCurving = 0,
	tipOffset = 0,
	otherArc = false,
	reverse = false,
) {
	const ctx = C.workingContext;
	const pathStarted = ctx.pathStarted;
	ctx.save();
	if (!pathStarted) ctx.beginPath();
	const center = circleIntersection(p1, radius, p2, radius)[0];
	p1[0] -= center[0];
	p1[1] -= center[1];
	p2[0] -= center[0];
	p2[1] -= center[1];
	const p1Angle = Math.atan2(p1[1], p1[0]);
	const p2Angle = Math.atan2(p2[1], p2[0]);
	let angleBetweenPoints, startAngle;
	if (otherArc) {
		startAngle = p1Angle;
		angleBetweenPoints = p2Angle - p1Angle;
	} else {
		startAngle = p2Angle;
		angleBetweenPoints = p1Angle - p2Angle;
	}
	curvedArrow(
		center[0],
		center[1],
		radius,
		angleBetweenPoints,
		startAngle,
		tipLength,
		tipBreadth,
		arrowCurving,
		tipOffset,
		reverse,
	);
	if (!pathStarted) ctx.closePath();
	ctx.restore();
	return center;
}

/**
 * Draws a double tipped curved arrow between two points that wraps around a circle with a definite radius.
 *
 * @param {number[]} p1 start point
 * @param {number[]} p2 end point
 * @param {number} radius radius of circle
 * @param {number} [tipLength=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipBreadth height of tip. Default value is tipLength / 1.2
 * @param {number} [arrowCurving=0] arrow curving const. Expressed in pixels
 * @param {number} [tipOffset=0] offset (padding) of tip from it's defined. Expressed in radians
 * @param {boolean} [otherArc=false] whether to use other arc
 * @return {number[]} coordiante of the center of arc as [x, y]
 */
export function curvedDoubleArrowBetweenPoints(
	p1,
	p2,
	radius,
	tipLength = DEFAULT_TIP_WIDTH,
	tipBreadth = tipLength / 1.2,
	arrowCurving = 0,
	tipOffset = 0,
	otherArc = false,
) {
	const ctx = C.workingContext;
	ctx.save();
	const center = circleIntersection(p1, radius, p2, radius)[0];
	p1[0] -= center[0];
	p1[1] -= center[1];
	p2[0] -= center[0];
	p2[1] -= center[1];
	const tipAngularDiameter = tipLength / radius;
	const p1Angle = Math.atan2(p1[1], p1[0]);
	const p2Angle = Math.atan2(p2[1], p2[0]) + tipAngularDiameter;
	let angleBetweenPoints, startAngle;
	if (otherArc) {
		startAngle = p1Angle;
		angleBetweenPoints = p2Angle - p1Angle;
	} else {
		startAngle = p2Angle;
		angleBetweenPoints = p1Angle - p2Angle;
	}
	arrowCurving /= radius;
	curvedArrow(
		center[0],
		center[1],
		radius,
		angleBetweenPoints + arrowCurving - tipOffset,
		startAngle - arrowCurving + tipOffset,
		tipLength,
		tipBreadth,
		arrowCurving * radius,
		tipOffset,
	);
	let padding = tipAngularDiameter - arrowCurving + tipOffset;
	startAngle -= tipAngularDiameter;
	arrowTip(
		center[0] + radius * Math.cos(startAngle + padding),
		center[1] + radius * Math.sin(startAngle + padding),
		center[0] + radius * Math.cos(startAngle + tipOffset),
		center[1] + radius * Math.sin(startAngle + tipOffset),
		tipLength,
		tipBreadth,
	);
	ctx.restore();
	return center;
}
