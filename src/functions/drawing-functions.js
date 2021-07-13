import { C } from "../main.js";

function readColor(colors) {
	let color1;
	let color2;
	let color3;
	let alpha = 255;
	let read = "";
	if (typeof colors[0] === "number") {
		if (colors.length === 1) {
			color1 = colors[0];
			color2 = color1;
			color3 = color1;
		} else if (colors.length === 2) {
			color1 = colors[0];
			color2 = colors[1];
			color3 = 0;
		} else if (colors.length === 3) {
			color1 = colors[0];
			color2 = colors[1];
			color3 = colors[2];
		} else if (colors.length === 4) {
			color1 = colors[0];
			color2 = colors[1];
			color3 = colors[2];
			alpha = colors[3];
		}
		const mode = C.workingCanvas.colorMode;
		if (mode === "HSL") {
			read = `hsl(${color1}, ${color2}, ${color3})`;
		} else if (mode === "rgb") {
			read = `rgb(${color1}, ${color2}, ${color3})`;
		} else if (mode === "rgba") {
			read = `rgba(${color1}, ${color2}, ${color3}, ${alpha})`;
		}
	} else {
		read = colors[0];
	}
	return read;
}

// C drawing functions

/**
 * Draws a line
 *
 * @param {number} x1 initial x coord
 * @param {number} y1 initial y coord
 * @param {number} x2 final x coord
 * @param {number} y2 final y coord
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
 * Move to a given point
 *
 * @param {number} x
 * @param {number} y
 */
function moveTo(x, y) {
	const ctx = C.workingCanvas;
	if (!ctx._pathStart) ctx.beginPath();
	ctx.moveTo(x, y);
}

/**
 * draws a line to given coords
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
 * ⦿ a hex string (#fff, #acf2dc)
 * ⦿ a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * ⦿ a array of numbers ([0, 244, 34])
 */
function background() {
	const col = readColor(arguments);
	const ctx = C.workingCanvas;
	ctx.backgroundColor = col;
	ctx.save();
	rest();
	ctx.fillStyle = col;
	ctx.fillRect(0, 0, ctx.width, ctx.height);
	ctx.restore();
}

/**
 * Clears a rectangular portion of canvas
 *
 * @param {number} x starting x
 * @param {number} y starting y
 * @param {number} width
 * @param {number} height
 */
function clear(x, y, width, height) {
	const ctx = C.workingCanvas;
	x = x || 0;
	y = y || 0;
	width = width || ctx.width;
	height = height || ctx.height;
	ctx.clearRect(x, y, width, height);
}

/**
 * Captures the current drawings in canvas and set it to
 * css background stretching the entire canvas
 */
function permaBackground() {
	const dat = getCanvasData();
	const cvs = C.workingCanvas.canvas;
	cvs.style.background = "url(\"" + dat + "\")";
	cvs.style.backgroundPosition = "center";
	cvs.style.backgroundSize = "cover";
}

/**
 * Resets the current transformation to the identity matrix,
 * and then invokes a transformation described by given arguments.
 * Lets you scale, rotate, translate (move), and skew the canvas.
 * See MDN docs: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
 *
 * @param {number} a1
 * @param {number} a2
 * @param {number} a3
 * @param {number} a4
 * @param {number} a5
 * @param {number} a6
 */
function setTransform(a1, a2, a3, a4, a5, a6) {
	const ctx = C.workingCanvas;
	ctx.setTransform(a1, a2, a3, a4, a5, a6);
	ctx.scale(ctx.dpr, ctx.dpr);
}

/**
 * multiplies the current transformation with the matrix described by the arguments
 * of this method. This lets you scale, rotate, translate (move), and skew the context.
 * See MDN docs: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
 *
 * @param {number} a1
 * @param {number} a2
 * @param {number} a3
 * @param {number} a4
 * @param {number} a5
 * @param {number} a6
 */
function transform(a1, a2, a3, a4, a5, a6) {
	C.workingCanvas.transform(a1, a2, a3, a4, a5, a6);
}

/**
 * Prevent filling inside further shapes
 */
function noFill() {
	C.workingCanvas.doFill = false;
}

/**
 * Prevent drawing strokes of further shapes
 */
function noStroke() {
	C.workingCanvas.doStroke = false;
}

/**
 * Translates (moves) canvas to a position
 *
 * @param {number} x
 * @param {number} [y=0]
 */
function translate(x, y = 0) {
	C.workingCanvas.translate(x, y);
}

function setImageSmoothing(bool) {
	C.workingCanvas.imageSmoothingEnabled = !!bool;
}

/**
 * sets the stroke width (width/weight of line) in px
 *
 * @param {number} w
 */
function strokeWidth(w) {
	C.workingCanvas.lineWidth = Number(w);
}

/**
 * scales the canvas by a given amount
 *
 * @param {number} x
 * @param {number} [y=x]
 */
function scale(x, y = x) {
	C.workingCanvas.scale(x, y);
}

/**
 * Rotates the canvas
 *
 * @param {number} angle angle in radians
 */
function rotate(angle) {
	C.workingCanvas.rotate(angle);
}

/**
 * saves the current state of canvas
 */
function save() {
	C.workingCanvas.save();
}

/**
 * set the type of line end
 *
 * @param {string} capType
 */
function lineCap(capType) {
	C.workingCanvas.lineCap = capType;
}

/**
 * sets type of line joining
 * @param {string} joinType
 */
function lineJoin(joinType) {
	C.workingCanvas.lineJoin = joinType;
}

/**
 * restore the saved state of canvas
 */
function restore() {
	C.workingCanvas.restore();
}

/**
 * returns fill color/gradient
 * @returns {string|CanvasGradient}
 */
function getFill() {
	return C.workingCanvas.fillStyle;
}

/**
 * returns stroke color/gradient
 * @returns {string|CanvasGradient}
 */
function getStroke() {
	return C.workingCanvas.strokeStyle;
}

/**
 * reset the applied transform to idendity matrix multiplied by dpr
 */
function rest() {
	const ctx = C.workingCanvas;
	const d = ctx.dpr;
	ctx.setTransform(d, 0, 0, d, 0, 0);
}

/**
 * Sets stroke color to a given value if value is given
 * else strokes the previous shape
 *
 * Accepted values:
 * ⦿ a hex string (#fff, #acf2dc)
 * ⦿ a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * ⦿ a array of numbers ([0, 244, 34])
 */
function stroke() {
	const ctx = C.workingCanvas;
	if (arguments.length !== 0) {
		const col = readColor(arguments);
		ctx.strokeStyle = col;
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
 * ⦿ a hex string (#fff, #acf2dc)
 * ⦿ a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * ⦿ a array of numbers ([0, 244, 34])
 */
function fill() {
	const ctx = C.workingCanvas;
	if (arguments.length !== 0) {
		const col = readColor(arguments);
		ctx.fillStyle = col;
		ctx.doFill = true;
	} else {
		ctx.fill();
	}
}

/**
 * returns fill&stroke color/gradient, line width, fill&stroke state
 * @returns {Object}
 */
function getDrawConfigs() {
	const ctx = C.workingCanvas;
	return {
		stroke: ctx.strokeStyle,
		fill: ctx.fillStyle,
		strokeWidth: ctx.lineWidth,
		doStroke: ctx.doStroke,
		doFill: ctx.doFill,
	};
}

/**
 * draw a arc
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} r radius
 * @param {number} [startingAngle=0] starting angle
 * @param {number} [endingAngle=PI*2] ending angle
 */
function arc(x, y, r, startingAngle, endingAngle) {
	startingAngle = startingAngle || 0;
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.arc(
		x,
		y,
		r,
		startingAngle || 0,
		isNaN(endingAngle) ? Math.PI * 2 : endingAngle
	);
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
	ctx.closePath();
}

/**
 * draws a text
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function text(text, x=0, y=0, maxwidth=undefined) {
	const ctx = C.workingCanvas;
	if (ctx.yAxisInveted) {
		scale(1, -1);
		y *= -1;
	}
	if (ctx.doFill) ctx.fillText(text, x, y, maxwidth);
	else if (ctx.doStroke) ctx.strokeText(text, x, y, maxwidth);
	if (ctx.yAxisInveted) scale(1, -1);
}

/**
 * draws a rectangle
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
}

/**
 * draws circle
 *
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
 * accepts points and draws polygon
 * @example ```js
 * polygon(
		[0, 0], // first point
		[100, 200], // second point
		[130, 230], // third point
		//...
)
```
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
 * draws ellipse
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} radius1 radius1
 * @param {number} radius2 radius2
 * @param {number} [rotation=0] rotation from plane
 * @param {number} [startAngle=0] starting angle
 * @param {number} [endAngle=Math.PI * 2] ending angle
 * @param {boolean} [anticlockwise=false]
 */
function ellipse(
	x,
	y,
	radius1,
	radius2,
	rotation = 0,
	startAngle = 0,
	endAngle = Math.PI * 2,
	anticlockwise = false
) {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.ellipse(
		x,
		y,
		radius1,
		radius2,
		rotation,
		startAngle,
		endAngle,
		anticlockwise
	);
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
	ctx.closePath();
}

function bezierCurve(x1, y1, x2, y2, x3, y3) {
	const ctx = C.workingCanvas;
	const pathStarted = ctx._pathStart;
	if (!pathStarted) ctx.beginPath();

	ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);

	if (pathStarted) return;
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
	ctx.closePath();
}

/**
 * starts a new loop
 * @param {function} fx
 * @param {string} canvasName
 * @param {number} dx
 */
function loop(fx, canvasName, dx) {
	let ctx = C.workingCanvas;
	if (!canvasName) {
		canvasName = ctx.name;
	} else {
		ctx = C.canvasList[canvasName];
	}
	if (!isNaN(dx)) {
		ctx.currentLoop = setInterval(function () {
			C.workingCanvas = ctx;
			fx();
		}, dx);
	} else {
		a();
	}
	function a() {
		C.workingCanvas = ctx;
		ctx.currentLoop = window.requestAnimationFrame(a);
		fx();
	}
}

/**
 * stops current loop
 */
function noLoop() {
	const ctx = C.workingCanvas;
	clearInterval(ctx.currentLoop);
	window.cancelAnimationFrame(ctx.currentLoop);
}

/**
 * starts a new Path
 */
function startPath() {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx._pathStart = true;
}

/**
 * ends current Path
 */
function endPath() {
	const ctx = C.workingCanvas;
	ctx.closePath();
	ctx._pathStart = false;
}

/**
 * return current font
 * @returns {string}
 */
function getFont() {
	const ctx = C.workingCanvas;
	return ctx.fontSize + " " + ctx.fontFamily;
}

/**
 * returns text metrics
 * @param {string} text
 * @returns {TextMetrics}
 */
function measureText(text) {
	return C.workingCanvas.measureText(text);
}

/**
 * sets font size
 * @param {number|string} size
 */
function fontSize (size) {
	const ctx = C.workingCanvas;
	size = typeof size === "number" ? size + "px" : size;
	ctx.fontSize = size;
	ctx.font = getFont();
}

/**
 * sets font family
 * @param {string} family
 */
function fontFamily (family) {
	const ctx = C.workingCanvas;
	ctx.fontFamily = family;
	ctx.font = getFont();
}

/**
 * returns canvas image data
 *
 * @param {string} datURL
 * @returns {string}
 */
function getCanvasData (datURL = "image/png") {
	return C.workingCanvas.canvas.toDataURL(datURL);
}

/**
 * save the canvas as image
 *
 * @param {string} [name="drawing"]
 * @param {string} [datURL="image/png"]
 */
function saveCanvas (
	name = "drawing",
	datURL = "image/png"
) {
	const link = getCanvasData().replace(datURL, "image/octet-stream");
	const a = document.createElement("a");
	a.download = name + ".png";
	a.href = link;
	a.click();
}

// more functions

/**
 * draws a point with given size in pixels
 *
 * @param {number} x
 * @param {number} y
 * @param {number} [size=1] diameter of point
 */
function point(x, y, size = 1) {
	const ctx = C.workingCanvas;
	ctx.arc(x, y, size / 2, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * draws square
 *
 * @param {number} x
 * @param {number} y
 * @param {number} sideLength
 */
function square(x, y, sideLength) {
	rect(x, y, sideLength, sideLength);
}

/**
 * draws a sector
 *
 * @param {number} x
 * @param {number} y
 * @param {number} innerRadius
 * @param {number} outerRadius
 * @param {number} startAngle
 * @param {number} endAngle
 * @param {string|CanvasGradient} [backgroundFill=C.workingCanvas.backgroundColor] Color of inner Circle
 */
function sector(
	x,
	y,
	innerRadius,
	outerRadius,
	startAngle,
	endAngle,
	backgroundFill
) {
	const ctx = C.workingCanvas;
	ctx.moveTo(x, y);
	const _fill = getFill();
	ctx.arc(x, y, outerRadius, startAngle, endAngle);
	fill(backgroundFill || C.workingCanvas.backgroundColor);
	ctx.arc(x, y, innerRadius, startAngle, endAngle);
	fill(_fill);
}

/**
 * draws quadrilateral
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @param {number} x4
 * @param {number} y4
 */
function quad(x1, y1, x2, y2, x3, y3, x4, y4) {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.lineTo(x4, y4);
	ctx.lineTo(x1, y1);

	ctx.lineTo(x1, y1);
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
	ctx.closePath();
}

/**
 * draws triangle
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 */
function triangle(x1, y1, x2, y2, x3, y3) {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.lineTo(x1, y1);
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
	ctx.closePath();
}

/**
 * draws equilateral triangle
 *
 * @param {number} x
 * @param {number} y
 * @param {number} sideLength length of side
 * @param {number} [rotation=0]
 */
function equiTriangle(x, y, sideLength, rotation = 0) {
	regularPolygon(x, y, 3, sideLength, rotation);
}

/**
 * Draws a regular polygon with centre position number of sides length of a side and rotation
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} sides number of sides
 * @param {number} sideLength length of a side
 * @param {number} [rotation=0] rotation
 */
function regularPolygon(x, y, sides, sideLength, rotation = 0) {
	sideLength = sideLength / (2 * Math.sin(Math.PI / sides)); // finds radius
	regularPolygonWithRadius(x, y, sides, sideLength, rotation);
}

/**
 * Draws a regular polygon that is inside a circle

 * @param {number} x x coord
 * @param {number} y y coord
 * @param {number} sides number of sides
 * @param {number} radius radius
 * @param {number} [rotation=0] rotation
 */
function regularPolygonWithRadius(
	x,
	y,
	sides,
	radius,
	rotation = 0
) {
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

const dxList = [];
let total = 0;
let recent = window.performance.now();

/**
 * returns FPS (Frames Per Second)
 * @param {number} keepDat number of recorded frames to remember
 * @returns {number}
 */
function getFPS(keepDat = 100) {
	const now = window.performance.now();
	const dx = now - recent;
	dxList.push(dx);
	total += dx;
	recent = now;
	if (dxList.length > keepDat) total -= dxList.shift();
	return (dxList.length / total) * 1000;
}

/**
 * creates a linear gradient
 *
 * @param {array} p1 initial point as [x, y]
 * @param {array} p2 final point as [x, y]
 * @param {Object|array} colorStops color stops
 ```js
var color = linearGradient(
	[0, 0],
	[200, 0],
	{
			0: "green",
			0.5: "cyan",
			1: "yellow"
	}
);
```
 */
function linearGradient(p1, p2, colorStops) {
	const ctx = C.workingCanvas;
	const gradient = ctx.createLinearGradient(p1[0], p1[1], p2[0], p2[1]);
	if (Array.isArray(colorStops)) {
		const stops = {};
		const step = 1 / colorStops.length;
		for (let i = 0; i < colorStops.length; i++) {
			stops[step * i] = colorStops[i];
		}
		colorStops = stops;
	}
	for (let stops = Object.keys(colorStops), i = 0; i < stops.length; i++) {
		const stop = stops[i];
		gradient.addColorStop(stop, colorStops[stop]);
	}
	return gradient;
}

export {
	line,
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
	getDrawConfigs,
	arc,
	text,
	rect,
	circle,
	polygon,
	ellipse,
	bezierCurve,
	loop,
	noLoop,
	startPath,
	endPath,
	getFont,
	measureText,
	fontSize,
	fontFamily,
	getCanvasData,
	saveCanvas,
	point,
	square,
	sector,
	quad,
	triangle,
	equiTriangle,
	regularPolygon,
	regularPolygonWithRadius,
	getFPS,
	linearGradient
};
