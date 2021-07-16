import { C } from "../main.js";
/**
 * This is the core list of drawing functions. Includes all core functionality
 * @module drawing-functions
 */

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
 * Begins a new sub-path at the point specified by the given (x, y) coordinates.
 *
 * @param {number} x
 * @param {number} y
 */
function moveTo(x, y) {
	C.workingCanvas.moveTo(x, y);
}

/**
 * Adda a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates.
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
	const col = readColor(arguments),
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
 * see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect
 * for more information
 * @param {number} x x-axis coordinate of the rectangle's starting point.
 * @param {number} y y-axis coordinate of the rectangle's starting point.
 * @param {number} width Rectangle's width. Positive values are to the right, and negative values to the left.
 * @param {number} height Rectangle's height. positive values are down, and negative are up.
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
 * Erases entire canvas area by setting them to transparent black
 *
 */
function clearAll() {
	const ctx = C.workingCanvas;
	const d = ctx.dpr;
	ctx.save();
	ctx.setTransform(d, 0, 0, d, 0, 0);
	ctx.clearRect(0, 0, ctx.width, ctx.height);
	ctx.restore();
}

/**
 * Captures the current drawings in canvas and set it to
 * css background
 *
 */
function permaBackground() {
	const canvasStyle = C.workingCanvas.canvas.style;
	canvasStyle.background = "url('" + getCanvasData() + "')";
	canvasStyle.backgroundPosition = "center";
	canvasStyle.backgroundSize = "cover";
}

/**
 * Resets the current transformation to the identity matrix,
 * and then invokes a transformation described by given arguments.
 * Lets you scale, rotate, translate (move), and skew the canvas.
 * The transform matrix is described by:
 * $$\left[\begin{array}{ccc} a & c & e \\ b & d & f \\ 0 & 0 & 1 \end{array}\right]$$
 * See MDN docs: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
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
	const ctx = C.workingCanvas;
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
 * See MDN docs: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
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
	const ctx = C.workingCanvas;
	if (a instanceof DOMMatrix) ctx.transform(a);
	else ctx.transform(a, b, c, d, e, f);
}

/**
 * Prevent filling inside shapes
 */
function noFill() {
	C.workingCanvas.doFill = false;
}

/**
 * Prevent drawing strokes of shapes
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
	const ctx = C.workingCanvas;
	ctx.rotate(angle);
	ctx.netRotation = ((ctx.netRotation + angle) % Math.PI) * 2;
}

/**
 * Saves the current state of canvas
 */
function save() {
	C.workingCanvas.save();
}

/**
 * Set the type of line end
 * Options: BUTT, ROUND, SQUARE
 * @param {string} capType
 */
function lineCap(capType) {
	C.workingCanvas.lineCap = capType;
}

/**
 * Sets type of line joining
 * Options: bevel, round, miter
 * @param {string} joinType
 */
function lineJoin(joinType) {
	C.workingCanvas.lineJoin = joinType;
}

/**
 * Restore the saved state of canvas
 */
function restore() {
	C.workingCanvas.restore();
}

/**
 * Returns fill color/gradient
 * @returns {string|CanvasGradient}
 */
function getFill() {
	return C.workingCanvas.fillStyle;
}

/**
 * Returns stroke color/gradient
 * @returns {string|CanvasGradient}
 */
function getStroke() {
	return C.workingCanvas.strokeStyle;
}

/**
 * Reset the applied transform to idendity matrix and scales canvas by dpr
 */
function rest() {
	const ctx = C.workingCanvas;
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
 */
function stroke() {
	const ctx = C.workingCanvas;
	if (arguments.length > 0) {
		ctx.strokeStyle = readColor(arguments);
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
function fill() {
	const ctx = C.workingCanvas;
	if (arguments.length !== 0) {
		ctx.fillStyle = readColor(arguments);
		ctx.doFill = true;
	} else {
		ctx.fill();
	}
}

/**
 * Returns variables in workingCanvas
 * @returns {Object}
 */
function getContextVariables() {
	const ctx = C.workingCanvas;
	return {
		background: ctx.background,
		stroke: ctx.strokeStyle,
		fill: ctx.fillStyle,

		strokeWidth: ctx.lineWidth,

		doStroke: ctx.doStroke,
		doFill: ctx.doFill,

		pathStarted: ctx.pathStarted,
		netRotation: ctx.netRotation,
		yAxisInveted: ctx.yAxisInveted,

		fontStyle: ctx.fontStyle,
		fontVariant: ctx.fontVariant,
		fontWeight: ctx.fontWeight,
		fontStretch: ctx.fontStretch,
		fontSize: ctx.fontSize,
		lineHeight: ctx.lineHeight,
		fontFamily: ctx.fontFamily,
		font: ctx.font,

		currentLoop: ctx.currentLoop,

		textAlign: ctx.textAlign,
		textBaseline: ctx.textBaseline,
	};
}

/**
 * Draw a arc
 *
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} r radius
 * @param {number} [angle=PI/2] central angle (use negative values to rotate arc clockwise)
 * @param {number} [startAngle=0] starting angle angle
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
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} radius
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
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} r radius
 * @param {number} [angle=Math.PI / 2] central angle
 * @param {number} [startAngle=0] starting angle
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
 * Draws a filled & stroked text
 *
 * @param {string} text text to draw
 * @param {number} [x=0] x-coord
 * @param {number} [y=0] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function text(text, x = 0, y = 0, maxwidth = undefined) {
	const ctx = C.workingCanvas;
	if (ctx.yAxisInveted) {
		// if inverted reverse it and invert y component
		scale(1, -1);
		y *= -1;
	}
	if (ctx.doFill) ctx.fillText(text, x, y, maxwidth);
	else if (ctx.doStroke) ctx.strokeText(text, x, y, maxwidth);
	if (ctx.yAxisInveted) scale(1, -1); // reverse y-invertion
}

/**
 * Draws a text without border
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function fillText(text, x = 0, y = 0, maxwidth = undefined) {
	const ctx = C.workingCanvas;
	if (ctx.yAxisInveted) {
		scale(1, -1);
		y *= -1;
	}
	ctx.fillText(text, x, y, maxwidth);
	if (ctx.yAxisInveted) scale(1, -1);
}

/**
 * Draws a stroked text
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function strokeText(text, x = 0, y = 0, maxwidth = undefined) {
	const ctx = C.workingCanvas;
	if (ctx.yAxisInveted) {
		scale(1, -1);
		y *= -1;
	}
	ctx.strokeText(text, x, y, maxwidth);
	if (ctx.yAxisInveted) scale(1, -1);
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
 * Draws ellipse
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

/**
 * Draws a bezier curve
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 */
function bezierCurve(x1, y1, x2, y2, x3, y3) {
	const ctx = C.workingCanvas;
	const pathStarted = ctx.pathStarted;
	if (!pathStarted) ctx.beginPath();
	ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
	if (pathStarted) return;
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
	ctx.closePath();
}

/**
 * Starts a new loop
 * @param {function} functionToRun function which contains code to run
 * @param {string} canvasName name of canvas. It must be unique if you're running multiple animation at once
 * @param {number} timeDelay time delay between 2 frames. If given loop will execute with setInterval function.
 *  If not provided the loop will be run with requestAnimationFrame (this keeps a consistant frame rate between 40 to 50 FPS).
 */
function loop(functionToRun, canvasName, timeDelay) {
	let ctx;

	// if canvasName isn't given it will assume the drawing context to be the current working canvas
	if (!canvasName) ctx = C.workingCanvas;
	else ctx = C.canvasList[canvasName];
	if (!isNaN(timeDelay)) {
		ctx.currentLoop = setInterval(function () {
			C.workingCanvas = ctx;
			functionToRun();
		}, timeDelay);
	} else {
		run();
	}
	function run() {
		ctx.currentLoop = window.requestAnimationFrame(run);
		functionToRun();
	}
}

/**
 * Stops current loop
 * @param {string} canvasName name of the canvas given to {@link loop}
 */
function noLoop(canvasName) {
	let ctx = C.workingCanvas;
	if (!canvasName) canvasName = ctx.name;
	else ctx = C.canvasList[canvasName];
	clearInterval(ctx.currentLoop);
	window.cancelAnimationFrame(ctx.currentLoop);
}

/**
 * Starts a new Path
 */
function startPath() {
	const ctx = C.workingCanvas;
	ctx.beginPath();
	ctx.pathStarted = true;
}

/**
 * Ends current Path
 */
function endPath() {
	const ctx = C.workingCanvas;
	ctx.closePath();
	ctx.pathStarted = false;
}

/**
 * Return current font
 * @param {boolean} detailed wheather to return a detailed font property
 * @returns {string}
 */
function getFont(detailed = false) {
	const ctx = C.workingCanvas;
	if (detailed) {
		const {
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
 * @param {string} text
 * @returns {TextMetrics}
 */
function measureText(text) {
	return C.workingCanvas.measureText(text);
}

/**
 * Sets font size
 *
 * @param {number|string} size
 */
function fontSize(size) {
	const ctx = C.workingCanvas;
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
	const ctx = C.workingCanvas;
	ctx.fontFamily = family;
	ctx.font = getFont(true);
}

/**
 * Sets font style
 *
 * @param {string} style
 */
function fontStyle(style) {
	const ctx = C.workingCanvas;
	ctx.fontStyle = style;
	ctx.font = getFont(true);
}

/**
 * Sets font variant
 *
 * @param {string} variant
 */
function fontVariant(variant) {
	const ctx = C.workingCanvas;
	ctx.fontVariant = variant;
	ctx.font = getFont(true);
}

/**
 * Sets font weight
 *
 * @param {string} weight
 */
function fontWeight(weight) {
	const ctx = C.workingCanvas;
	ctx.fontWeight = weight;
	ctx.font = getFont(true);
}

/**
 * Sets font stretch
 *
 * @param {string} stretch
 */
function fontStretch(stretch) {
	const ctx = C.workingCanvas;
	ctx.fontStretch = stretch;
	ctx.font = getFont(true);
}

/**
 * Sets line height
 *
 * @param {string} height
 */
function lineHeight(height) {
	const ctx = C.workingCanvas;
	ctx.lineHeight = height;
	ctx.font = getFont(true);
}

/**
 * Returns canvas image data
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
	const link = getCanvasData().replace(datURL, "image/octet-stream");
	const a = document.createElement("a");
	a.download = name + ".png";
	a.href = link;
	a.click();
}

/**
 * Sets the line dash
 * see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash for more information
 *
 */
function setLineDash() {
	C.workingCanvas.setLineDash([...arguments]);
}

/**
 * Draws a point with given size in pixels
 *
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} [size=1] diameter of point in px
 */
function point(x, y, size = 1) {
	const ctx = C.workingCanvas;
	ctx.arc(x, y, size / 2, 0, Math.PI * 2);
	ctx.fill();
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
 * Draws a sector
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} radius radius of sector
 * @param {number} [angle=PI/2] central angle (use negative angle to move sector clockwise)
 * @param {number} [startAngle=0] starting angle
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
 * @param {array} p1
 * @param {array} p2
 * @param {array} p3
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
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} sides number of sides
 * @param {number} sideLength length of a side
 * @param {number} [rotation=0] amound to rotate the entire polygon
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

var timeDelayList = [],
	total = 0,
	recent = window.performance.now();

/**
 * Returns FPS (Frames Per Second). Use this inside the loop
 * @param {number} timeDelaysToRemember number of time delays between frames to recorded in the memory
 * @returns {number}
 */
function getFPS(timeDelaysToRemember = 100) {
	const now = window.performance.now();
	const timeDelay = now - recent; // time delays between frames
	recent = now;
	timeDelayList.push(timeDelay);
	total += timeDelay;
	if (timeDelayList.length > timeDelaysToRemember)
		total -= timeDelayList.shift();
	return timeDelayList.length / (total / 1000);
}

/**
 * creates a linear gradient
 *
 * @param {array} initialPoint initial point as [x, y]
 * @param {array} finalPoint final point as [x, y]
 * @param {Object|array} colorStops color stops
 @example
 ```js
var color = linearGradient(
	[0, 0], [200, 0],
	{
			0: "green",
			0.5: "cyan",
			1: "yellow"
	}
);
```,
```js
var color = linearGradient(
	[0, 0], [200, 0],
	[
		"green",
		"cyan",
		"yellow"
	]
);
```
 */
function linearGradient(initialPoint, finalPoint, colorStops) {
	const ctx = C.workingCanvas;
	const gradient = ctx.createLinearGradient(
		initialPoint[0],
		initialPoint[1],
		finalPoint[0],
		finalPoint[1]
	);
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

export {
	line,	moveTo,	lineTo,	background,	clear,	permaBackground,	setTransform,	transform,	noFill,	noStroke,	translate,	setImageSmoothing,	strokeWidth,	scale,	rotate,	save,	lineCap,	lineJoin,	restore,	getFill,	getStroke,	rest,	stroke,	fill,	getContextVariables,	arc,	text,	rect,	circle,	polygon,	ellipse,	bezierCurve,	loop,	noLoop,	startPath,	endPath,	getFont,	measureText,	fontSize,	fontFamily,	getCanvasData,	saveCanvas,	point,	square,	sector,	quad,	triangle,	equiTriangle,	regularPolygon,	regularPolygonWithRadius,	getFPS,	linearGradient,	circularSegment,	arcTo,	fillText,	strokeText,	clearAll,	setLineDash,	fontStyle,	fontVariant,	fontWeight,	fontStretch,
	lineHeight,
	getTransform,
	textAlign,
	textBaseline,
};
