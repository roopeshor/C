import { WHITE, TRANSPARENT } from "../constants/colors.js";
import { CENTER, MIDDLE } from "../constants/drawing.js";
import { C } from "../main.js";
import { line } from "./linear.js";
import { text } from "./text.js";

import {
	measureText,
	restore,
	save,
} from "./settings.js";
import { applyDefault } from "../utils/utils.js";

/**
 * draws a arrow
 *
 * @global
 * @param {number} x1 starting x-axis coord
 * @param {number} y1 starting y-axis coord
 * @param {number} x2 ending x-axis coord
 * @param {number} y2 ending y-axis coord
 * @param {number} tipWidth width of tip
 * @param {number} tipScaleRatio width:height
 */
function arrow(x1, y1, x2, y2, tipWidth = 10, tipScaleRatio = 0.7) {
	const angle = Math.atan2(y2 - y1, x2 - x1); // angle from plain
	arrowTip(x2, y2, tipWidth, angle, tipScaleRatio);
	save();
	const r = Math.atan(tipScaleRatio / 2);
	const xd = Math.cos(angle) * tipWidth * Math.cos(r);
	const yd = Math.sin(angle) * tipWidth * Math.cos(r);
	x2 -= xd;
	y2 -= yd;
	line(x1, y1, x2, y2);
	restore();
}

/**
 * Draws a arrow head
 *
 * @global
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} [width=10] width of head
 * @param {number} [angle=0] tilt of head
 * @param {number} [tipScaleRatio=2] height to width ratio
 */
function arrowTip(x, y, width = 15, angle = 0, tipScaleRatio = 1) {
	const ctx = C.workingCanvas;
	const middleAngle = Math.atan(tipScaleRatio / 2);
	ctx.save();
	ctx.beginPath();
	ctx.translate(x, y);
	ctx.rotate(angle);
	ctx.moveTo(0, 0);
	ctx.lineTo(
		0 + width * Math.cos(middleAngle),
		0 + width * Math.sin(middleAngle)
	);

	ctx.lineTo(
		0 + width * Math.cos(-middleAngle),
		0 + width * Math.sin(-middleAngle)
	);
	ctx.lineTo(0, 0);
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
	ctx.closePath();
	ctx.restore();
}

/**
 * Draws a double tipped arrow
 *
 * @global
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} [tipWidth=10]
 * @param {number} [tipScaleRatio=0.6]
 * @param {number} [spacing=0]
 */
function doubleArrow(
	x1,
	y1,
	x2,
	y2,
	tipWidth = 15,
	tipScaleRatio = 1,
	spacing = 0
) {
	const r = Math.atan(tipScaleRatio / 2);
	const angle = Math.atan2(y2 - y1, x2 - x1);
	const xd = Math.cos(angle) * tipWidth * Math.cos(r);
	const yd = Math.sin(angle) * tipWidth * Math.cos(r);
	const yDiff = Math.sin(angle) * spacing;
	const xDiff = Math.cos(angle) * spacing;
	arrowTip(x1 + xDiff, y1 + yDiff, tipWidth, Math.PI + angle, tipScaleRatio);
	x1 += xd;
	y1 += yd;
	arrow(x1, y1, x2 - xDiff, y2 - yDiff, tipWidth, tipScaleRatio);
}

/**
 * Draws a double tipped arrow with text in the middle
 *
 * @global
 * @param {object} configs parameters.
 * Possible values:
 * * {string} text* : text
 * * {array} p1* : first point
 * * {array} p2* : second point
 * * {number} [tipWidth=10] : tip width
 * * {number} [tipScaleRatio=0.6] : tipScaleRatio
 * * {number} [spacing=0] : spacing
 * NOTE: '*' indicate mandatory properties
 */
function measurement(configs) {
	const defaults = {
		background: [TRANSPARENT],
		tipWidth: [15, "number"],
		tipScaleRatio: [1, "number"],
		innerPadding: [3, "number"],
		outerPadding: [0, "number"],
		textRotation: [0, "number"],
	};
	configs = applyDefault(defaults, configs);
	const txt = configs.text,
		p1 = configs.p1,
		p2 = configs.p2,
		background = configs.background,
		tipWidth = configs.tipWidth,
		tipScaleRatio = configs.tipScaleRatio,
		innerPadding = configs.innerPadding,
		textRotation = configs.textRotation,
		outerPadding = configs.outerPadding;
	// draw arrow
	doubleArrow(
		p1[0],
		p1[1],
		p2[0],
		p2[1],
		tipWidth,
		tipScaleRatio,
		outerPadding
	);
	const metrics = measureText(txt);

	// height of text from stackoverflow: https://stackoverflow.com/a/45789011
	const height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
	const width = metrics.width;
	const ctx = C.workingCanvas;
	const pAverage = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
	ctx.save();
	ctx.translate(pAverage[0], pAverage[1]);
	ctx.textAlign = CENTER;
	ctx.textBaseline = MIDDLE;
	ctx.rotate(Math.atan2(p2[1] - p1[1], p2[0] - p1[0]));
	ctx.rotate(textRotation);
	const recentFillColor = ctx.fillStyle;
	if (background == TRANSPARENT) {
		ctx.fillStyle = ctx.background || WHITE;
	} else {
		ctx.fillStyle = background;
	}
	ctx.fillRect(
		-width / 2 - innerPadding,
		-height / 2,
		width + innerPadding * 2,
		height
	);
	ctx.fillStyle = recentFillColor;
	text(txt, 0, 0);
	ctx.restore();
}

/**
 * Draws a curved arrow that wrap around a circle.
 *
 * @global
 * @param {number} x x position of circle
 * @param {number} y y position of circle
 * @param {number} radius radius of circle
 * @param {number} [angle=Math.PI/2] central angle of arrow
 * @param {number} [startAngle=0] start angle of arrow
 * @param {number} [angularOffset=0.1] angular offset of arrow from sectoral boundaries. Expressed in radians.
 * @param {number} [tipWidth=15] width of arrow head
 * @param {number} [tipScaleRatio=0.7] height to width ratio of head
 * @param {number} [tipTilt=0] tilt of arrow head in radian
 */
function curvedArrow(
	x,
	y,
	radius,
	angle = Math.PI / 2,
	startAngle = 0,
	angularOffset = 0.1,
	tipWidth = 15,
	tipScaleRatio = 1,
	tipTilt = 0
) {
	const ctx = C.workingCanvas;

	startAngle += angularOffset;
	angle -= angularOffset * 2;

	const angularDiameterOfTip = tipWidth / radius;
	const _tipTilt = angle - Math.PI / 2 - angularDiameterOfTip / 2 + tipTilt;

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(startAngle);
	ctx.beginPath();

	// draw arc
	ctx.arc(
		0,
		0,
		radius,
		0,
		angle - angularDiameterOfTip + 0.01, // 0.01 to fit arc in the border of the arrow tip.
		false
	);
	ctx.stroke();
	ctx.closePath();

	// arrowTip
	arrowTip(
		radius * Math.cos(angle),
		radius * Math.sin(angle),
		tipWidth,
		_tipTilt,
		tipScaleRatio
	);
	ctx.restore();
}

function curvedArrowBetweenPoints (
	p1,
	p2,
	radius,
	angularOffset = 0.1,
	tipWidth = 15,
	tipScaleRatio = 1,
	tipTilt = 0
) {
	const ctx = C.workingCanvas;
	const angularDiameterOfTip = tipWidth / radius;
	const _tipTilt = - angularDiameterOfTip / 2 + tipTilt;

	ctx.save();
	ctx.rotate(angularOffset);
	ctx.beginPath();

	// draw arc

	ctx.stroke();
	ctx.closePath();

	// arrowTip
	arrowTip(
		p1[0],
		p1[1],
		tipWidth,
		_tipTilt,
		tipScaleRatio
	);
	ctx.restore();
}
export {
	arrow,
	arrowTip,
	doubleArrow,
	measurement,
	curvedArrow,
	curvedArrowBetweenPoints
};
