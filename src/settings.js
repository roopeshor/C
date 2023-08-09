/** @module Settings */

import { readColor } from "./color/color_reader.js";
import { C } from "./main.js";
import { defineProperties } from "./utils.js";

// for debugging
let counter = {
		loop: 1,
	},
	logStyles = {
		number: "color: #9afcad;",
		keyword: "color: #adacdf;",
		running: "color: yellow;",
		delayed: "color: orange;",
		finished: "color: #3aff5f;",
	};
/**
 * Begins a new shape at the point specified by the given (x, y) coordinates.
 *
 * @param {number} x
 * @param {number} y
 */
export function moveTo(x, y) {
	C.workingContext.moveTo(x, y);
}

/**
 * Adda a straight line to the current shape by connecting the shape's last point to the specified (x, y) coordinates.
 *
 * @param {number} x
 * @param {number} y
 */
export function lineTo(x, y) {
	C.workingContext.lineTo(x, y);
}

/**
 * Sets background to a given value
 *
 * Accepted values:
 * * a hex string (#fff, #acf2dc)
 * * a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * a array of numbers ([0, 244, 34])
 * @param {...number} color
 */
export function background(...color) {
	let col = readColor(color).hex8,
		ctx = C.workingContext;
	ctx.background = col;
	ctx.save();
	rest();
	ctx.fillStyle = col;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.restore();
}

/**
 * Erases the pixels in a rectangular area by setting them to transparent black
 *
 * @param {number} [x = 0] x-axis coordinate of the rectangle's starting point.
 * @param {number} [y = 0] y-axis coordinate of the rectangle's starting point.
 * @param {number} [width = C.workingContext.width] Rectangle's width. Positive values are to the right, and negative values to the left.
 * @param {number} [height = C.workingContext.height] Rectangle's height. positive values are down, and negative are up.
 */
export function clear(x, y, width, height) {
	let ctx = C.workingContext,
		d = C.dpr;
	x = x || 0;
	y = y || 0;
	width = width || ctx.canvas.width;
	height = height || ctx.canvas.height;
	ctx.save();
	ctx.setTransform(d, 0, 0, d, 0, 0);
	ctx.clearRect(x, y, width, height);
	ctx.restore();
}

/**
 * sets the given image data as css background. If not given it will set current canvas drawing as the background
 * @param {string} [data] image data
 */
export function cssBackground(data) {
	if (typeof data != "string") data = getCanvasData();
	let canvasStyle = C.workingContext.canvas.style;
	canvasStyle.background = "url('" + data + "')";
	canvasStyle.backgroundPosition = "center";
	canvasStyle.backgroundSize = "cover";
}

/**
 * If Some arguments are given: Resets the current transformation to the identity matrix,
 * and then invokes a transformation described by given arguments.
 * Lets you scale, rotate, translate (move), and skew the canvas.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform} for more info
 * If no Arguments are given: returns current transformation
 *
 * @param {number|DOMMatrix} [a] Horizontal scaling. A value of 1 results in no scaling.
 * @param {number} [b] Vertical skewing
 * @param {number} [c] Horizontal skewing
 * @param {number} [d] Vertical scaling. A value of 1 results in no scaling
 * @param {number} [e] Horizontal translation
 * @param {number} [f] Vertical translation
 */
export function transform(a, b, c, d, e, f) {
	let ctx = C.workingContext;
	if (a == undefined || a == null) {
		return C.workingContext.getTransform();
	} else if (a instanceof DOMMatrix) {
		ctx.setTransform(a.a, a.b, a.c, a.d, a.e, a.f);
	} else {
		ctx.setTransform(a || 0, b || 0, c || 0, d || 0, e || 0, f || 0);
	}

	// scale to fit width
	ctx.scale(C.dpr, C.dpr);
}

/**
 * Prevent filling inside shapes
 *
 */
export function noFill() {
	C.workingContext.doFill = false;
}

/**
 * Prevent drawing strokes of shapes
 *
 */
export function noStroke() {
	C.workingContext.doStroke = false;
}

/**
 * Translates (moves) canvas to a position
 *
 * @param {number} x amound to translate along x-axis
 * @param {number} [y=0] amound to translate along y-axis
 */
export function translate(x, y = 0) {
	C.workingContext.translate(x, y);
}

/**
 * Sets whether to enable image smoothening
 *
 * @param {boolean} bool
 */
export function setImageSmoothing(bool) {
	C.workingContext.imageSmoothingEnabled = !!bool;
}

/**
 * Sets the stroke width (line width/line thickness)
 *
 * @param {number} w
 */
export function strokeWidth(w) {
	C.workingContext.lineWidth = Number(w);
}

/**
 * Scales the canvas by a given amount
 *
 * @param {number} x Scaling factor in the horizontal direction. A negative value flips pixels across
 *  the vertical axis. A value of 1 results in no horizontal scaling.
 * @param {number} [y=x] Scaling factor in the vertical direction. A negative value flips pixels across
 *  the horizontal axis. A value of 1 results in no vertical scaling.
 */
export function scale(x, y = x) {
	C.workingContext.scale(x, y);
	if (y < 0) C.workingContext.yAxisInverted = true;
}

/**
 * Rotates the canvas
 *
 * @param {number} angle The rotation angle, clockwise in radians. You can use degree * DEG to calculate a radian from a degree.
 */
export function rotate(angle) {
	let ctx = C.workingContext;
	ctx.rotate(angle);
	ctx.netRotation = ((ctx.netRotation + angle) % Math.PI) * 2;
}

/**
 * Saves the current state of canvas

 */
export function save() {
	C.workingContext.savedStates = getContextStates();
	C.workingContext.save();
}

/**
 * Set the type of line end
 * Options: butt, round, square
 *
 * @param {string} capType
 */
export function lineCap(capType) {
	C.workingContext.lineCap = capType;
}

/**
 * Sets type of line joining
 * Options: BEVEL, ROUND, MITER
 *
 * @param {string} joinType
 */
export function lineJoin(joinType) {
	C.workingContext.lineJoin = joinType;
}

/**
 * Restore the saved state of canvas
 *
 */
export function restore() {
	defineProperties(C.workingContext.savedStates, C.workingContext);
	C.workingContext.restore();
}

/**
 * Reset the applied transform to idendity matrix and scales canvas by dpr
 *
 */
export function rest() {
	let ctx = C.workingContext;
	ctx.setTransform(C.dpr, 0, 0, C.dpr, 0, 0);
}

/**
 * Sets stroke color to a given value if value is given
 * else strokes the previous shape
 *
 * Accepted values:
 * * hex string (#fff, #acf2dc)
 * * number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * array of numbers ([0, 244, 34]). This gets converted into css color by the colorMode property
 */
export function stroke(...color) {
	let ctx = C.workingContext;
	if (arguments.length > 0) {
		ctx.strokeStyle = readColor(color).hex8;
		ctx.doStroke = true;
	} else {
		ctx.stroke();
	}
}

/**
 * Sets fill color to a given value if value is given
 * else fills the previous shape
 *
 * Accepted values:
 * * a hex string (#fff, #acf2dc)
 * * a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * a array of numbers ([0, 244, 34]). This gets converted into css color by the colorMode property
 */
export function fill(...color) {
	let ctx = C.workingContext;
	if (arguments.length !== 0) {
		ctx.fillStyle = readColor(color).hex8;
		ctx.doFill = true;
	} else {
		ctx.fill();
	}
}

/**
 * Returns variables in workingCanvas or given canvas
 *
 * @param {string} [canvasName] id of canvas to get the data.
 * @returns {Object}
 */
export function getContextStates(canvasName) {
	let ctx = C.contextList[canvasName] || C.workingContext;
	return {
		background: ctx.background,
		colorMode: ctx.colorMode,
		strokeStyle: ctx.strokeStyle,
		fillStyle: ctx.fillStyle,

		lineWidth: ctx.lineWidth,

		doStroke: ctx.doStroke,
		doFill: ctx.doFill,
		pathStarted: ctx.pathStarted,
		yAxisInverted: ctx.yAxisInverted,

		netRotation: ctx.netRotation,

		fontStyle: ctx.fontStyle,
		fontVariant: ctx.fontVariant,
		fontWeight: ctx.fontWeight,
		fontStretch: ctx.fontStretch,
		fontSize: ctx.fontSize,
		lineHeight: ctx.lineHeight,
		fontFamily: ctx.fontFamily,
		font: ctx.font,

		textAlign: ctx.textAlign,
		textBaseline: ctx.textBaseline,

		events: ctx.events,
	};
}

/**
 * Starts a new loop
 * ! Currently in progress with asynchronous animations.
 * @param {Function} functionToRun function which contains code to run
 * @param {string} canvasName name of canvas. It must be unique if you're running multiple animation at once
 * @param {number} timeDelay time delay between 2 frames. If given loop will execute with setInterval function.
 *  If not provided the loop will be run with requestAnimationFrame (this keeps a consistant frame rate between 40 to 50 FPS).
 * @param {number} [timeDelaysToRemember=10] number of time delays to remember.
 */
export function loop(
	name,
	functionToRun,
	canvasName,
	timeDelay,
	timeDelaysToRemember = 100,
	settings = {},
	dur,
) {
	let ctx;

	// if name isn't given it will shift the arguments to right
	if (typeof name == "function") {
		// shift arguments
		name = counter.loop++;
		functionToRun = arguments[0];
		canvasName = arguments[1];
		timeDelay = arguments[2];
		settings = arguments[3];
		dur = arguments[4];
	}
	if (!canvasName) {
		ctx = C.workingContext;
		canvasName = ctx.name;
	} else ctx = C.contextList[canvasName];
	ctx.timeDelayList = [];
	ctx.totalTimeCaptured = 0;
	let assignedSettings = Object.assign(getContextStates(canvasName) || {}, settings);
	// debugger;
	if (ctx.currentLoop != undefined) {
		// already a animation is running
		if (C.debugAnimations) {
			console.log(canvasName + ": " + name + " %cdelayed", logStyles.delayed);
			C._ANIMATIONLOG_.push({
				canvas: ctx,
				animationName: name,
				state: "delayed",
				settings: assignedSettings,
			});
		}
		ctx.delayedAnimations.push({
			name: name,
			settings: assignedSettings,
			functionToRun: functionToRun,
			canvasName: canvasName,
			timeDelay: timeDelay,
			timeDelaysToRemember: timeDelaysToRemember,
			dur: dur,
		});
	} else {
		if (C.debugAnimations) {
			let toLog = `${canvasName}: ${name} %crunning`,
				styles = [logStyles.running];
			if (dur != undefined) {
				toLog += `%c for %c${dur}ms`;
				styles.push(logStyles.keyword, logStyles.number);
			}
			C._ANIMATIONLOG_.push({
				canvas: ctx,
				animationName: name,
				state: "running",
				settings: assignedSettings,
				dur: dur,
			});
			console.log(toLog, ...styles);
		}
		ctx.recentTimeStamp = window.performance.now();
		ctx.timeStart = window.performance.now();
		if (!isNaN(timeDelay)) {
			ctx.currentLoopName = name;
			ctx.currentLoop = setInterval(function () {
				C.workingContext = ctx;
				let S = getContextStates(canvasName);
				defineProperties(assignedSettings, C.workingContext);
				functionToRun(window.performance.now() - ctx.timeStart, getFPS());
				defineProperties(S, C.workingContext);
			}, timeDelay);
		} else {
			run();
		}
	}
	function run() {
		ctx.currentLoop = window.requestAnimationFrame(run);
		C.workingContext = ctx;
		let S = getContextStates(canvasName);
		if (settings) defineProperties(assignedSettings, C.workingContext);
		functionToRun(window.performance.now() - ctx.timeStart, getFPS());
		if (settings) defineProperties(S, C.workingContext);
	}

	function getFPS() {
		let now = window.performance.now(),
			timeDelay = now - ctx.recentTimeStamp; // time delays between frames
		ctx.recentTimeStamp = now;
		ctx.timeDelayList.push(timeDelay);
		ctx.totalTimeCaptured += timeDelay;
		if (ctx.timeDelayList.length > timeDelaysToRemember)
			ctx.totalTimeCaptured -= ctx.timeDelayList.shift();
		return ctx.timeDelayList.length / (ctx.totalTimeCaptured / 1000);
	}
}

/**
 * Stops current loop
 *
 * @param {string} [canvasName] name of the canvas given to {@link loop}
 * @param {number} [time] time of execution. Used for debugging
 */
export function noLoop(canvasName, time) {
	let ctx = C.workingContext;
	if (!canvasName) canvasName = ctx.name;
	else ctx = C.contextList[canvasName];
	clearInterval(ctx.currentLoop);
	window.cancelAnimationFrame(ctx.currentLoop);
	ctx.currentLoop = undefined;
	if (C.debugAnimations) {
		let toLog = `${canvasName}: ${ctx.currentLoopName} %cfinished`,
			formatter = [logStyles.finished];
		if (time != undefined) {
			toLog += `%c in %c${time.toFixed(3)}ms`;
			formatter.push(logStyles.keyword, logStyles.number);
		}
		console.log(toLog, ...formatter);
		C._ANIMATIONLOG_.push({
			canvas: ctx,
			animationName: ctx.currentLoopName,
			state: "finished",
			endTime: time,
		});
	}
	if (ctx.delayedAnimations.length > 0) {
		let toWork = ctx.delayedAnimations.shift();
		loop(
			toWork.name,
			toWork.functionToRun,
			toWork.canvasName,
			toWork.timeDelay,
			toWork.timeDelaysToRememberm,
			toWork.settings,
			toWork.dur,
		);
	}
}

/**
 * Starts a new Path
 *
 */
export function startShape() {
	let ctx = C.workingContext;
	ctx.beginPath();
	ctx.pathStarted = true;
}

/**
 * Ends current Path
 *
 */
export function endShape() {
	let ctx = C.workingContext;
	ctx.closePath();
	ctx.pathStarted = false;
}

/**
 * Return current font
 *
 * @param {boolean} detailed wheather to return a detailed font property
 * @returns {string}
 */
export function getFont(detailed = false) {
	let ctx = C.workingContext;
	if (detailed) {
		let {
			fontStyle,
			fontVariant,
			fontWeight,
			fontStretch,
			fontSize,
			lineHeight,
			fontFamily,
		} = ctx;
		return `${fontStyle} ${fontVariant} ${fontWeight} ${fontStretch} ${fontSize}/${lineHeight} ${fontFamily}`;
	} else {
		return ctx.font;
	}
}

/**
 * Returns text metrics
 *
 * @param {string} text
 * @returns {TextMetrics}
 */
export function measureText(text) {
	return C.workingContext.measureText(text);
}

/**
 * Sets font size
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font} for more info.
 * @param {number|string} size
 * possible values:
 * * XX_SMALL
 * * X_SMALL
 * * SMALL
 * * MEDIUM
 * * LARGE
 * * X_LARGE
 * * XX_LARGE
 * * XXX_LARGE
 * * LARGER
 * * SMALLER
 */
export function fontSize(size) {
	let ctx = C.workingContext;
	size = typeof size === "number" ? size + "px" : size;
	ctx.fontSize = size;
	ctx.font = getFont(true);
}

/**
 * Sets font family
 *
 * @param {string} family
 */
export function fontFamily(family) {
	let ctx = C.workingContext;
	ctx.fontFamily = family;
	ctx.font = getFont(true);
}

/**
 * Sets font style
 *
 * @param {string} style
 * possible values:
 * * NORMAL
 * * ITALIC
 * * OBLIQUE [<angle>]
 */
export function fontStyle(style) {
	let ctx = C.workingContext;
	ctx.fontStyle = style;
	ctx.font = getFont(true);
}

/**
 * Sets font variant
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant} for more info.
 *
 * @param {string} variant
 */
export function fontVariant(variant) {
	let ctx = C.workingContext;
	ctx.fontVariant = variant;
	ctx.font = getFont(true);
}

/**
 * Sets font weight
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight} for more info.
 * @param {string} weight
 */
export function fontWeight(weight) {
	let ctx = C.workingContext;
	ctx.fontWeight = weight;
	ctx.font = getFont(true);
}

/**
 * Sets font stretch
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font} for more info.
 *
 *  @global
 * @param {string} stretch
 * possible values:
 * * ULTRA_CONDENSED
 * * EXTRA_CONDENSED
 * * CONDENSED
 * * SEMI_CONDENSED
 * * NORMAL
 * * SEMI_EXPANDED
 * * EXPANDED
 * * EXTRA_EXPANDED
 * * ULTRA_EXPANDED
 * * <percentage>
 */
export function fontStretch(stretch) {
	let ctx = C.workingContext;
	ctx.fontStretch = stretch;
	ctx.font = getFont(true);
}

/**
 * Sets line height
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/line-height} for more info.
 *
 * @param {string} height
 */
export function lineHeight(height) {
	let ctx = C.workingContext;
	ctx.lineHeight = height;
	ctx.font = getFont(true);
}

/**
 * Returns canvas image data as string
 *
 * @param {string} datURL
 * @returns {string}
 */
export function getCanvasData(datURL = "image/png") {
	return C.workingContext.canvas.toDataURL(datURL);
}

/**
 * puts a imageData to canvas
 */
export function putImageData() {
	C.workingContext.putImageData(...arguments);
}

/**
 * Save the canvas as image
 *
 * @param {string} [name="drawing"] name of file
 * @param {string} [datURL="image/png"] type of file
 */
export function saveCanvas(name = "drawing", datURL = "image/png") {
	let link = getCanvasData().replace(datURL, "image/octet-stream"),
		a = document.createElement("a");
	a.download = name + ".png";
	a.href = link;
	a.click();
}

/**
 * Sets the line dash
 * see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash} for more info
 *
 */
export function lineDash() {
	C.workingContext.setLineDash([...arguments]);
}

/**
 * Specifies the current text alignment used when drawing text.
 * The alignment is relative to the x value of the fillText/strokeText/text method.
 *
 * @param {string} align alignment type.
 * possible values:
 *  * "left" : The text is left-aligned.
 *  * "right" : The text is right-aligned.
 *  * "center" : The text is centered.
 *  * "start" : The text is aligned at the normal start of the line (left-aligned for left-to-right locales, right-aligned for right-to-left locales).
 *  * "end": The text is aligned at the normal end of the line (right-aligned for left-to-right locales, left-aligned for right-to-left locales).
 * NOTE: You can use constants LEFT, RIGHT, CENTER, START, and END for aligning
 */
export function textAlign(align) {
	C.workingContext.textAlign = align;
}

/**
 * Specifies the current text baseline used when drawing text.
 * The alignment is relative to the x value of the fillText/strokeText/text method.
 *
 * @param {string} baseline baseline type.
 * possible values:
 * * "top": The text baseline is the top of the em square.
 * * "hanging": The text baseline is the hanging baseline. (Used by Tibetan and other Indic scripts.)
 * * "middle": The text baseline is the middle of the em square.
 * * "alphabetic": The text baseline is the normal alphabetic baseline. Default value.
 * * "ideographic": The text baseline is the ideographic baseline; this is the bottom of the body of the characters, if the main body of characters protrudes beneath the alphabetic baseline. (Used by Chinese, Japanese, and Korean scripts.)
 * * "bottom": The text baseline is the bottom of the bounding box. This differs from the ideographic baseline in that the ideographic baseline doesn't consider descenders.
 * NOTE: You can use constants TOP, HANGING, MIDDLE, ALPHABETIC, IDEOGRAPHIC, BOTTOM for baseline
 */
export function textBaseline(baseline) {
	C.workingContext.textBaseline = baseline;
}
