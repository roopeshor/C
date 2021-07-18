import { WHITE, TRANSPARENT } from "../constants/colors.js";
import { CENTER, MIDDLE } from "../constants/drawing.js";
import { C } from "../main.js";
import {
	line,
} from "../basic-constructs/linear.js";
import {
	text,
} from "../basic-constructs/text.js";

import {
	background,
	fill,
	fontSize,
	measureText,
	noStroke,
	restore,
	save,
	stroke,
} from "../basic-constructs/settings.js";
import {
	applyDefault,
} from "./utils.js";
/*
global CENTERX CENTERY
*/

const consts = {
	CENTERX: function () {
		return C.workingCanvas.width / 2;
	},
	CENTERY: function () {
		return C.workingCanvas.height / 2;
	},
};

function _def_(name, getter) {
	Object.defineProperty(window, name, {
		configurable: true,
		enumerable: true,
		get: getter,
		set: function set(value) {
			Object.defineProperty(window, name, {
				configurable: true,
				enumerable: true,
				value: value,
				writable: true,
			});
		},
	});
}

for (let constNames = Object.keys(consts), i = 0; i < constNames.length; i++) {
	const _const = constNames[i];
	_def_(_const, consts[_const]);
}

/**
 * initializes a canvas translated to center and y-axis inverted
 * @global
 */
function initCenteredCanvas() {
	const ctx = C.workingCanvas;
	background(0);
	fill(WHITE);
	stroke(WHITE);
	noStroke();
	fontSize(20);

	ctx.translate(CENTERX, CENTERY);
	ctx.scale(1, -1);
	ctx.lineWidth = 2;
	ctx.yAxisInveted = true;
}

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
 * @param {number} [ang=0] tilt of head
 * @param {number} [tipScaleRatio=2] height to width ratio
 */
function arrowTip(x, y, width = 15, ang = 0, tipScaleRatio = 1) {
	const ctx = C.workingCanvas;
	const r = Math.atan(tipScaleRatio / 2);
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x - width * Math.cos(ang - r), y - width * Math.sin(ang - r));
	ctx.lineTo(x - width * Math.cos(ang + r), y - width * Math.sin(ang + r));
	ctx.lineTo(x, y);
	if (ctx.doFill) ctx.fill();
	else ctx.stroke();
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
export {
	initCenteredCanvas,
	arrow,
	arrowTip,
	doubleArrow,
	measurement
};
