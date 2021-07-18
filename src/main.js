import { defineProperties } from "./defineProperties.js";
// main file; defines C function
const defaultConfig = {
	width: 200, // width of canvas multiplied by dpr
	height: 200, // height of canvas  multiplied by dpr

	dpr: Math.ceil(devicePixelRatio || 1), // device pixel ratio for clear drawings

	// states
	doFill: true,
	doStroke: true,
	pathStarted: false,

	// color stuff
	fillStyle: "#ffffff",
	strokeStyle: "#000000",
	colorMode: "rgba",

	// font properties
	fontSize: "20px",
	fontFamily: "cmu serif, serif",
	fontStyle: "normal",
	fontVariant: "normal",
	fontWeight: "normal",
	fontStretch: "normal",
	lineHeight: "1.2",
};

function assignDefaultConfigs (cfgs) {
	for (
		let i = 0, properties = Object.keys(defaultConfig);
		i < properties.length;
		i++
	) {
		const property = properties[i];
		if (cfgs[property] === undefined) cfgs[property] = defaultConfig[property];
	}
}

/**
 * Main Function
 * @param {function} fx codes to exeecute
 * @param {HTMLElement} [container=document.body] container for the drawings
 * @param {object} [configs={}] configurations
 */
function C (fx, container = document.body, configs = {}) {
	// assign configs
	assignDefaultConfigs(configs);

	// initialize canvas
	let canvas = C.makeCanvas(configs);
	if (typeof container === "string") { container = document.querySelector(container); }
	let canvasName;
	if (configs.name != undefined) {
		canvasName = configs.name;
		const cvs = document.getElementById(canvasName);
		if (cvs instanceof HTMLElement) {
			// if already exist
			canvas = cvs;
			prepareCanvas();
			fx();
			return;
		}
	} else {
		// finds a name for canvas that already don't exist
		while (document.getElementById("canvas-" + C.nameID) != undefined) {
			C.nameID++;
		}

		canvasName = "canvas-" + C.nameID;
		configs.name = canvasName;
	}
	function prepareCanvas () {
		// add additional information to rendererContext
		C.resizeCanvas(canvas, configs);
		canvas.context = Object.assign(canvas.getContext("2d"), configs);
		canvas.context.setTransform(configs.dpr, 0, 0, configs.dpr, 0, 0);
		C.workingCanvas = canvas.context;
	}
	// set canvas's id and class to its name
	canvas.id = canvasName;
	canvas.classList.add(canvasName);
	// add canvas to container
	container.appendChild(canvas);
	prepareCanvas();
	C.canvasList[canvasName] = canvas.context;
	fx();
}

C.canvasList = {};

/** @type {Number} */
C.nameID = 0;

/** @type {CanvasRenderingContext2D} */
C.workingCanvas = undefined; // index of current working canvas in `canvasList`

/**
 * return inner width of container tag
 * @param {HTMLElement} [container=document.body]
 * @returns {Number}
 */
C.getContainerWidth = function (container = document.body) {
	const cs = window.getComputedStyle(container);
	return (
		parseInt(cs.width) -
    parseInt(cs.paddingRight) -
    parseInt(cs.paddingLeft)
	);
};

/**
 * set width and height attribute of canvas element to the given values in `configs`
 * and scales CSS width and height to DPR
 *
 * values needed in `configs`:
 *
 *   width: <Number> width in pixels
 *
 *   height: <Number> height in pixels
 *
 *   dpr: <Number> dpr
 * @param {HTMLCanvasElement} cvs
 * @param {Object} configs
 */
C.resizeCanvas = function (cvs, configs) {
	const width = configs.width;
	const height = configs.height;
	const dpr = configs.dpr;
	cvs.style.width = width + "px";
	cvs.style.height = height + "px";
	cvs.width = dpr * width;
	cvs.height = dpr * height;
};

/**
 * returns a canvas element with given params
 *
 * @param {Object} configs
 * @returns {HTMLCanvasElement}
 */
C.makeCanvas = function (configs) {
	const cvs = document.createElement("canvas");
	this.resizeCanvas(cvs, configs);
	return cvs;
};

/**
 * add extension to window and C extension list
 *
 * @param {Object} extObj
 * @param {boolean} editable warn the edit of functions
 */
C.addExtension = function (extObj, editable) {
	defineProperties(extObj, window, !editable);
	defineProperties(extObj, C.extensions, !editable);
};
C.defineProperties = defineProperties;
// register to window
window.C = C;

export {C};
