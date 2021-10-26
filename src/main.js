import { applyDefault, defineProperties } from "./utils.js";

/**
 * Main Function
 *
 * @param {function} fx codes to exeecute
 * @param {HTMLElement} [container=document.body] container for the drawings
 * @param {object} [cfgs={}] configurations
 */
function C(fx, container, cfgs = {}) {
	const defaultConfigs = {
		width: 200, // width of canvas multiplied by dpr
		height: 200, // height of canvas  multiplied by dpr

		dpr: Math.ceil(window.devicePixelRatio || 1), // device pixel ratio for clear drawings

		// states
		doFill: true,
		doStroke: true,
		pathStarted: false,
		yAxisInverted: false,
		pauseAnimations: false,

		netRotation: 0,
		currentLoop: undefined,
		currentLoopName: undefined,
		textAlign: "start",
		textBaseline: "alphabetic",
		// color stuff
		fillStyle: "#ffffff",
		background: "#ffffff",
		strokeStyle: "#000000",
		colorMode: "rgba",
		lineWidth: 1,

		// font properties
		fontSize: "20px",
		fontFamily: "serif",
		fontStyle: "normal",
		fontVariant: "normal",
		fontWeight: "normal",
		fontStretch: "normal",
		lineHeight: 1.2,
		font: "20px serif",

		// event listeners
		events: {},
	};
	// assign configs
	let configs = applyDefault(defaultConfigs, cfgs),
		canvas;

	if (typeof container === "string") {
		container = document.querySelector(container);
	} else if (!(container instanceof HTMLElement)) {
		container = document.body;
	}

	// initialize canvas
	let c = container.querySelector("canvas");
	if (c) canvas = c;
	else canvas = C.makeCanvas(configs);

	if (typeof container.CID !== "number") container.CID = 1;
	let parentCID = container.CID,
		parentName = container.id || container.classList.item(0),
		canvasName = configs.name || canvas.name;
	if (typeof canvasName != "string") {
		canvasName = parentName + "-C-" + parentCID;
		configs.name = canvasName;
	}
	function prepareCanvas() {
		// add additional information to rendererContext
		C.resizeCanvas(canvas, configs);
		canvas.context = Object.assign(canvas.getContext("2d"), configs);
		canvas.context.setTransform(configs.dpr, 0, 0, configs.dpr, 0, 0);
		C.workingCanvas = canvas.context;
		C.workingCanvas.container = container;
		C.workingCanvas.savedStates = defaultConfigs;
		C.workingCanvas.delayedAnimations = [];
	}
	// set canvas's id and class to its name
	canvas.id = canvasName;
	canvas.classList.add(canvasName);
	// add canvas to container
	container.appendChild(canvas);
	if (c) C.workingCanvas = canvas.context;
	else prepareCanvas();
	C.canvasList[canvasName] = canvas.context;

	// attach event listeners
	let active = {};
	for (let event in configs.events) {
		let listener = configs.events[event];
		if (listener) {
			canvas.addEventListener(event, listener);
			active[event] = listener;
		}
	}
	// attach list of active listeners to canvas for other uses
	canvas.events = active;
	fx();
}

/**
 * List of available canvases
 * @type {Object}
 */
C.canvasList = {};

// C.delayedAnimations = [];

/**
 * Number of canvases
 * @type {Number}
 */
C.nameID = 0;

/**
 * Current working canvas
 * @type {CanvasRenderingContext2D}
 */
C.workingCanvas = {}; // index of current working canvas in `C.canvasList`

/**
 * Current working canvas
 * @type {HTMLElement}
 */
C.workingCanvas.container = {}; //container of canvas

/**
 * Default configurations
 */
/**
 * return inner width of container tag
 * @param {HTMLElement} [container=document.body]
 * @returns {Number}
 */
C.getWindowWidth = function (container = document.body) {
	const cs = window.getComputedStyle(container);
	return parseInt(cs.width) - parseInt(cs.paddingRight) - parseInt(cs.paddingLeft);
};

/**
 * Set width and height attribute of canvas element to the given values in `configs`
 * and scales CSS width and height to DPR
 *
 * @param {HTMLCanvasElement} cvs
 * @param {Object} configs configurations. Values needed :
 * @param {number} configs.dpr Device pixel ratio
 * @param {number} configs.width Width in pixels
 * @param {number} configs.height Height in pixels
 */
C.resizeCanvas = function (cvs, configs) {
	const width = configs.width;
	const height = configs.height;
	const dpr = configs.dpr || window.devicePixelRatio;
	cvs.style.width = width + "px";
	cvs.style.height = height + "px";
	cvs.width = dpr * width;
	cvs.height = dpr * height;
};

/**
 * Returns a canvas element with given params
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
 * Add extension to window and C extension list
 *
 * @param {Object} extObj
 * @param {boolean} editable warn the edit of functions
 */
C.addExtension = function (extObj) {
	defineProperties(extObj, window);
	defineProperties(extObj, C.extensions, false);
};

/**
 * @type {boolean}
 */
C.debugAnimations = false; // whther to debug animations

/**
 * Whehter to debug animations
 *
 * @param {boolean} bool boolean
 */
C.debug = function (bool) {
	if (typeof bool !== "boolean") C.debugAnimations = true;
	else C.debugAnimations = bool;
};

/**
 * Returns the current working canvas or the canvas with given name.
 * With this you can access native JS canvas functions for better performance
 * @param {string} name Name of canvas
 * @returns {CanvasRenderingContext2D} Canvas context
 */
C.getCanvas = function (name) {
	return C.canvasList[name] || C.workingCanvas;
};

/**
 * Log of animations
 * @type {array<object>}
 */
C._ANIMATIONLOG_ = [];

/**
 * Set of functions
 * @type {object}
 */
C.functions = {};
C.COLORLIST = {}; //list of colors
// register to window
window["C"] = C;

export { C };
