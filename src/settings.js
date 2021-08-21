import { animateFill } from "./animations/create.js";
import { readColor } from "./color/color_reader.js";
import { white } from "./constants/named_colors.js";
import { C } from "./main.js";
import { smooth } from "./math/rate_functions.js";
import { getBezierControlPoints } from "./objects/geometry.js";
import { getType } from "./utils.js";

/**
 * This module contains functions to manipulate the canvas.
 * @module settings
 */

let counter = {
	wait: 1,
	loop: 1,
};

let logStyles = {
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
function moveTo(x, y) {
	C.workingCanvas.moveTo(x, y);
}

/**
 * Adda a straight line to the current shape by connecting the shape's last point to the specified (x, y) coordinates.
 *
 * @param {number} x
 * @param {number} y
 */
function lineTo(x, y) {
	C.workingCanvas.lineTo(x, y);
}

/**
 * Sets background to a given value
 *
 * Accepted values:
 * * a hex string (#fff, #acf2dc)
 * * a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * a array of numbers ([0, 244, 34])
 */
function background() {
	let col = readColor(...arguments),
		ctx = C.workingCanvas;
	ctx.background = col;
	ctx.save();
	rest();
	ctx.fillStyle = col;
	ctx.fillRect(0, 0, ctx.width, ctx.height);
	ctx.restore();
}

/**
 * Erases the pixels in a rectangular area by setting them to transparent black
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch} for more info
 *
 * @param {number} x x-axis coordinate of the rectangle's starting point.
 * @param {number} y y-axis coordinate of the rectangle's starting point.
 * @param {number} width Rectangle's width. Positive values are to the right, and negative values to the left.
 * @param {number} height Rectangle's height. positive values are down, and negative are up.
 */
function clear(x, y, width, height) {
	let ctx = C.workingCanvas;
	x = x || 0;
	y = y || 0;
	width = width || ctx.width;
	height = height || ctx.height;
	ctx.clearRect(x, y, width, height);
}

/**
 * Erases entire canvas area by setting them to transparent black
 *
 */
function clearAll() {
	let ctx = C.workingCanvas,
		d = ctx.dpr;
	ctx.save();
	ctx.setTransform(d, 0, 0, d, 0, 0);
	ctx.clearRect(0, 0, ctx.width, ctx.height);
	ctx.restore();
}

/**
 * sets the given image data as css background. If not given it will set current canvas drawing as the background
 *
 */
function permaBackground(data) {
	if (typeof data != "string") data = getCanvasData();
	let canvasStyle = C.workingCanvas.canvas.style;
	canvasStyle.background = "url('" + data + "')";
	canvasStyle.backgroundPosition = "center";
	canvasStyle.backgroundSize = "cover";
}

/**
 * Resets the current transformation to the identity matrix,
 * and then invokes a transformation described by given arguments.
 * Lets you scale, rotate, translate (move), and skew the canvas.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform} for more info
 *
 * @param {number|DOMMatrix} a Horizontal scaling. A value of 1 results in no scaling.
 *  this can be a `DOMMatrix` which can get by {@link getTransform} function
 * @param {number} b Vertical skewing
 * @param {number} c Horizontal skewing
 * @param {number} d Vertical scaling. A value of 1 results in no scaling
 * @param {number} e Horizontal translation
 * @param {number} f Vertical translation
 */
function setTransform(a, b, c, d, e, f) {
	let ctx = C.workingCanvas;
	if (a instanceof DOMMatrix) ctx.setTransform(a);
	else ctx.setTransform(a, b, c, d, e, f);
	ctx.scale(ctx.dpr, ctx.dpr);
}

/**
 * Returns the current transform matrix
 *
 * @return {DOMMatrix}
 */
function getTransform() {
	return C.workingCanvas.getTransform();
}

/**
 * multiplies the current transformation with the matrix described by the arguments
 * of this method. This lets you scale, rotate, translate (move), and skew the context.
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform} for more info
 *
 * @param {number|DOMMatrix} a Horizontal scaling. A value of 1 results in no scaling.
 *  this can be a `DOMMatrix` which can get by {@link getTransform} function
 * @param {number} b Vertical skewing
 * @param {number} c Horizontal skewing
 * @param {number} d Vertical scaling. A value of 1 results in no scaling
 * @param {number} e Horizontal translation
 * @param {number} f Vertical translation
 */
function transform(a, b, c, d, e, f) {
	let ctx = C.workingCanvas;
	if (a instanceof DOMMatrix) ctx.transform(a);
	else ctx.transform(a, b, c, d, e, f);
}

/**
 * Prevent filling inside shapes
 *
 */
function noFill() {
	C.workingCanvas.doFill = false;
}

/**
 * Prevent drawing strokes of shapes
 *
 */
function noStroke() {
	C.workingCanvas.doStroke = false;
}

/**
 * Translates (moves) canvas to a position
 *
 * @param {number} x amound to translate along x-axis
 * @param {number} [y=0] amound to translate along y-axis
 */
function translate(x, y = 0) {
	C.workingCanvas.translate(x, y);
}

/**
 * Sets whether to enable image smoothening
 *
 * @param {boolean} bool
 */
function setImageSmoothing(bool) {
	C.workingCanvas.imageSmoothingEnabled = !!bool;
}

/**
 * Sets the stroke width (line width/line thickness)
 *
 * @param {number} w
 */
function strokeWidth(w) {
	C.workingCanvas.lineWidth = Number(w);
}

/**
 * Scales the canvas by a given amount
 *
 * @param {number} x Scaling factor in the horizontal direction. A negative value flips pixels across
 *  the vertical axis. A value of 1 results in no horizontal scaling.
 * @param {number} [y=x] Scaling factor in the vertical direction. A negative value flips pixels across
 *  the horizontal axis. A value of 1 results in no vertical scaling.
 */
function scale(x, y = x) {
	C.workingCanvas.scale(x, y);
}

/**
 * Rotates the canvas
 *
 * @param {number} angle The rotation angle, clockwise in radians. You can use degree * DEG to calculate a radian from a degree.
 */
function rotate(angle) {
	let ctx = C.workingCanvas;
	ctx.rotate(angle);
	ctx.netRotation = ((ctx.netRotation + angle) % Math.PI) * 2;
}

/**
 * Saves the current state of canvas

 */
function save() {
	C.savedStates = getContextStates();
	C.workingCanvas.save();
}

/**
 * Set the type of line end
 * Options: BUTT, ROUND, SQUARE
 *
 * @param {string} capType
 */
function lineCap(capType) {
	C.workingCanvas.lineCap = capType;
}

/**
 * Sets type of line joining
 * Options: BEVEL, ROUND, MITER
 *
 * @param {string} joinType
 */
function lineJoin(joinType) {
	C.workingCanvas.lineJoin = joinType;
}

/**
 * Restore the saved state of canvas
 *
 */
function restore() {
	Object.assign(C.workingCanvas, C.savedStates);
	C.workingCanvas.restore();
}

/**
 * Returns fill color/gradient
 *
 * @returns {string|CanvasGradient}
 */
function getFill() {
	return C.workingCanvas.fillStyle;
}

/**
 * Returns stroke color/gradient
 *
 * @returns {string|CanvasGradient}
 */
function getStroke() {
	return C.workingCanvas.strokeStyle;
}

/**
 * Returns stroke width
 *
 * @returns {number}
 */
function getStrokeWidth() {
	return C.workingCanvas.lineWidth;
}

/**
 * Reset the applied transform to idendity matrix and scales canvas by dpr
 *
 */
function rest() {
	let ctx = C.workingCanvas;
	ctx.setTransform(ctx.dpr, 0, 0, ctx.dpr, 0, 0);
}

/**
 * Sets stroke color to a given value if value is given
 * else strokes the previous shape
 *
 * Accepted values:
 * * hex string (#fff, #acf2dc)
 * * number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * array of numbers ([0, 244, 34]). This gets converted into css color by the colorMode property
 *
 */
function stroke() {
	let ctx = C.workingCanvas;
	if (arguments.length > 0) {
		ctx.strokeStyle = readColor(...arguments);
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
 *
 */
function fill() {
	let ctx = C.workingCanvas;
	if (arguments.length !== 0) {
		ctx.fillStyle = readColor(...arguments);
		ctx.doFill = true;
	} else {
		ctx.fill();
	}
}

/**
 * Returns variables in workingCanvas or given canvas
 *
 * @param {string} canvasID id of canvas to get the data.
 * @returns {Object}
 */
function getContextStates(canvasName) {
	let ctx = C.canvasList[canvasName] || C.workingCanvas;
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

		onclick: ctx.onclick,
		onmousemove: ctx.onmousemove,
		onmouseout: ctx.onmouseout,
		onmousedown: ctx.onmousedown,
		onmouseup: ctx.onmouseup,
		onmousewheel: ctx.onmousewheel,

		// key
		onkeydown: ctx.onkeydown,
		onkeyup: ctx.onkeyup,
		onkeypress: ctx.onkeypress,
		oncopy: ctx.oncopy,
		onpaste: ctx.onpaste,
		oncut: ctx.oncut,

		// touch
		ontouchstart: ctx.ontouchstart,
		ontouchmove: ctx.ontouchmove,
		ontouchend: ctx.ontouchend,
		ontouchcancel: ctx.ontouchcancel,

		// scale
		onresize: ctx.onresize,

		// dom
		onblur: ctx.onblur,
		onfocus: ctx.onfocus,
		onchange: ctx.onchange,
		oninput: ctx.oninput,
		onload: ctx.onload,
		onscroll: ctx.onscroll,
		onwheel: ctx.onwheel,

		onpointerdown: ctx.onpointerdown,
		onpointermove: ctx.onpointermove,
		onpointerup: ctx.onpointerup,
		onpointercancel: ctx.onpointercancel,
		onpointerover: ctx.onpointerover,
		onpointerout: ctx.onpointerout,
		onpointerenter: ctx.onpointerenter,
		onpointerleave: ctx.onpointerleave,
		onfullscreenchange: ctx.onfullscreenchange,
	};
}

/**
 * Starts a new loop
 * ! Currently in progress with asynchronous animations.
 * @param {function} functionToRun function which contains code to run
 * @param {string} canvasName name of canvas. It must be unique if you're running multiple animation at once
 * @param {number} timeDelay time delay between 2 frames. If given loop will execute with setInterval function.
 *  If not provided the loop will be run with requestAnimationFrame (this keeps a consistant frame rate between 40 to 50 FPS).
 * @param {number} [timeDelaysToRemember=10] number of time delays to remember.
 */
function loop(
	name,
	functionToRun,
	canvasName,
	timeDelay,
	timeDelaysToRemember = 100,
	settings = {},
	dur
) {
	let ctx;

	// if name isn't given it will shift the arguments to right
	if (typeof name != "string") {
		// shift arguments
		name = counter.loop++;
		functionToRun = arguments[0];
		canvasName = arguments[1];
		timeDelay = arguments[2];
		settings = arguments[3];
		dur = arguments[4];
	}
	if (!canvasName) {
		ctx = C.workingCanvas;
		canvasName = ctx.name;
	} else ctx = C.canvasList[canvasName];
	ctx.timeDelayList = [];
	ctx.totalTimeCaptured = 0;
	let assignedSettings = Object.assign(getContextStates(canvasName), settings);
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
				C.workingCanvas = ctx;
				let S = getContextStates(canvasName);
				Object.assign(C.workingCanvas, assignedSettings);
				functionToRun(window.performance.now() - ctx.timeStart, getFPS());
				Object.assign(C.workingCanvas, S);
			}, timeDelay);
		} else {
			run();
		}
	}
	function run() {
		ctx.currentLoop = window.requestAnimationFrame(run);
		C.workingCanvas = ctx;
		let S = getContextStates(canvasName);
		if (settings) Object.assign(C.workingCanvas, assignedSettings);
		functionToRun(window.performance.now() - ctx.timeStart, getFPS());
		if (settings) Object.assign(C.workingCanvas, S);
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
 * @param {string} canvasName name of the canvas given to {@link loop}
 */
function noLoop(canvasName, time) {
	let ctx = C.workingCanvas;
	if (!canvasName) canvasName = ctx.name;
	else ctx = C.canvasList[canvasName];
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
			toWork.dur
		);
	}
}

/**
 * Starts a new Path
 *
 */
function startShape() {
	let ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.pathStarted = true;
}

/**
 * Ends current Path
 *
 */
function endShape() {
	let ctx = C.workingCanvas;
	ctx.closePath();
	ctx.pathStarted = false;
}

/**
 * Return current font
 *
 * @param {boolean} detailed wheather to return a detailed font property
 * @returns {string}
 */
function getFont(detailed = false) {
	let ctx = C.workingCanvas;
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
function measureText(text) {
	return C.workingCanvas.measureText(text);
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
function fontSize(size) {
	let ctx = C.workingCanvas;
	size = typeof size === "number" ? size + "px" : size;
	ctx.fontSize = size;
	ctx.font = getFont(true);
}

/**
 * Sets font family
 *
 * @param {string} family
 */
function fontFamily(family) {
	let ctx = C.workingCanvas;
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
function fontStyle(style) {
	let ctx = C.workingCanvas;
	ctx.fontStyle = style;
	ctx.font = getFont(true);
}

/**
 * Sets font variant
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant} for more info.
 *
 * @param {string} variant
 */
function fontVariant(variant) {
	let ctx = C.workingCanvas;
	ctx.fontVariant = variant;
	ctx.font = getFont(true);
}

/**
 * Sets font weight
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight} for more info.
 * @param {string} weight
 */
function fontWeight(weight) {
	let ctx = C.workingCanvas;
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
function fontStretch(stretch) {
	let ctx = C.workingCanvas;
	ctx.fontStretch = stretch;
	ctx.font = getFont(true);
}

/**
 * Sets line height
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/line-height} for more info.
 *
 * @param {string} height
 */
function lineHeight(height) {
	let ctx = C.workingCanvas;
	ctx.lineHeight = height;
	ctx.font = getFont(true);
}

/**
 * Returns canvas image data as string
 *
 * @param {string} datURL
 * @returns {string}
 */
function getCanvasData(datURL = "image/png") {
	return C.workingCanvas.canvas.toDataURL(datURL);
}

/**
 * Save the canvas as image
 *
 * @param {string} [name="drawing"] name of file
 * @param {string} [datURL="image/png"] type of file
 */
function saveCanvas(name = "drawing", datURL = "image/png") {
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
function lineDash() {
	C.workingCanvas.setLineDash([...arguments]);
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
function textAlign(align) {
	C.workingCanvas.textAlign = align;
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
function textBaseline(baseline) {
	C.workingCanvas.textBaseline = baseline;
}

/**
 * Sets the text alignment to centered in x and y axes.
 *
 */
function centerdText() {
	textAlign("center");
	textBaseline("middle");
}

/**
 * initializes a canvas translated to center and y-axis inverted
 */
function initCenteredCanvas() {
	let ctx = C.workingCanvas;
	ctx.translate(ctx.width / 2, ctx.height / 2);
}

/**
 * Inverts y-axis
 */
function invertYAxis() {
	let ctx = C.workingCanvas;
	ctx.scale(1, -1);
	ctx.yAxisInverted = !ctx.yAxisInverted;
}

/**
 * Init a blackboard like canvas. Centerd to middle, with black background and y axis inverted
 */
function initBlackboardCanvas() {
	initCenteredCanvas();
	background(0);
	invertYAxis();
	stroke(white);
}

/**
 * Wait for a given time in milliseconds.
 *
 * @param {number} time time in milliseconds
 * @param {string} canvasName canvas name
 */
function wait(time, canvasName, name) {
	canvasName = C.workingCanvas.name || canvasName;
	loop(
		name || "wait-" + counter.wait++,
		(elapsed) => {
			if (elapsed >= time) noLoop(canvasName, elapsed);
		},
		canvasName,
		time,
		500,
		{},
		time
	);
}

function showCreation() {
	let animations = Array.prototype.slice.call(arguments);
	for (let i = 0; i < animations.length; i++) {
		let animation = animations[i];
		if (getType(animation) == "Object") {
			let dur = animation.dur || 2000,
				ctx = animation.canvas || C.workingCanvas,
				next = animation.next || null,
				name = animation.name,
				dTime = animation.dTime || 14,
				points = animation.points,
				closed = animation.closed || false,
				tension = animation.tension || 1,
				smoothen = animation.smoothen == undefined ? true : animation.smoothen,
				rateFunction = animation.rateFunction || smooth,
				syncWithTime = animation.syncWithTime || false,
				t = 0,
				dt = dTime / dur,
				len = points.length;
			if (ctx.lineWidth > 0 && ctx.doStroke) {
				if (typeof animation.draw != "function") {
					if (smoothen) {
						loop(
							name,
							(elapsed) => {
								if (t > 1) {
									noLoop(ctx.name, elapsed);
								}
								let i = Math.round(len * rateFunction(t)),
									ip1 = Math.round(len * rateFunction(t + dt)),
									ip2 = Math.round(len * rateFunction(t + dt * 2));
								if (closed) {
									i %= len;
									ip1 %= len;
									ip2 %= len;
								}
								let recentPoint =
										points[Math.round(len * rateFunction(t - dt))] ||
										points[
											len - Math.abs(Math.round(len * rateFunction(t - dt)))
										],
									currentPoint = points[i],
									nextPoint = points[ip1],
									secondNextPoint = points[ip2],
									cp = getBezierControlPoints(
										recentPoint,
										currentPoint,
										nextPoint,
										secondNextPoint,
										tension
									);
								ctx.beginPath();
								if (closed)
									ctx.moveTo(
										...points[Math.abs(Math.round(len * rateFunction(t)) % len)]
									);
								else ctx.moveTo(...points[Math.round(len * rateFunction(t))]);

								ctx.bezierCurveTo(
									cp[0],
									cp[1],
									cp[2],
									cp[3],
									nextPoint[0],
									nextPoint[1]
								);
								if (ctx.doStroke) ctx.stroke();
								ctx.closePath();
								if (!syncWithTime) t += dt;
								else t = elapsed / dur;
							},
							ctx.name,
							dTime,
							50,
							{},
							dur
						);
					} else {
						loop(
							name,
							(elapsed) => {
								if (t > 1) {
									noLoop(ctx.name, elapsed);
								} else if (t == 0) {
									ctx.beginPath();
									ctx.moveTo(
										...points[Math.abs(Math.round(len * rateFunction(0)))]
									);
								}
								let currentPoint =
									points[Math.round(len * rateFunction(t)) % len];
								ctx.lineTo(currentPoint[0], currentPoint[1]);
								if (ctx.doStroke) ctx.stroke();
								if (!syncWithTime) t += dt;
								else t = elapsed / dur;
							},
							ctx.name,
							dTime,
							50,
							{},
							dur
						);
					}
				} else {
					animation.draw();
				}
			}
			if (closed && animation.fill) {
				animateFill(
					name,
					ctx.name,
					animation.fill,
					animation.filler,
					animation.fillTime,
					10,
					next
				);
			}
		} else {
			throw new Error(
				i +
					1 +
					(i == 0 ? "st" : i == 1 ? "nd" : i == 2 ? "rd" : "th") +
					" argument provided is not a object."
			);
		}
	}
}

export {
	moveTo,
	lineTo,
	background,
	clear,
	permaBackground,
	setTransform,
	transform,
	noFill,
	noStroke,
	translate,
	setImageSmoothing,
	strokeWidth,
	scale,
	rotate,
	save,
	lineCap,
	lineJoin,
	restore,
	getFill,
	getStroke,
	rest,
	stroke,
	fill,
	getContextStates,
	loop,
	noLoop,
	startShape,
	endShape,
	getFont,
	measureText,
	fontSize,
	fontFamily,
	getCanvasData,
	saveCanvas,
	clearAll,
	lineDash,
	fontStyle,
	fontVariant,
	fontWeight,
	fontStretch,
	lineHeight,
	getTransform,
	textAlign,
	textBaseline,
	centerdText,
	initCenteredCanvas,
	invertYAxis,
	initBlackboardCanvas,
	wait,
	getStrokeWidth,
	showCreation,
};
