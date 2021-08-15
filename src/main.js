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

		// mouse
		onclick: undefined,
		onmousemove: undefined,
		onmouseout: undefined,
		onmousedown: undefined,
		onmouseup: undefined,
		onmousewheel: undefined,

		// key
		onkeydown: undefined,
		onkeyup: undefined,
		onkeypress: undefined,
		oncopy: undefined,
		onpaste: undefined,
		oncut: undefined,

		// touch
		ontouchstart: undefined,
		ontouchmove: undefined,
		ontouchend: undefined,
		ontouchcancel: undefined,

		// scale
		onresize: undefined,

		// dom
		onblur: undefined,
		onfocus: undefined,
		onchange: undefined,
		oninput: undefined,
		onload: undefined,
		onscroll: undefined,
		onwheel: undefined,

		onpointerdown: undefined,
		onpointermove: undefined,
		onpointerup: undefined,
		onpointercancel: undefined,
		onpointerover: undefined,
		onpointerout: undefined,
		onpointerenter: undefined,
		onpointerleave: undefined,
		onfullscreenchange: undefined,
	};
	// assign configs
	const configs = applyDefault(defaultConfigs, cfgs);
	// initialize canvas
	let canvas = C.makeCanvas(configs);
	if (typeof container === "string") {
		container = document.querySelector(container);
	} else if (!(container instanceof HTMLElement)) {
		container = document.body;
	}

	if (typeof container.CID !== "number") {
		container.CID = 1;
	}
	var parentCID = container.CID;
	var parentName = container.id || container.classList.item(0);
	let canvasName = configs.name;
	if (typeof canvasName == "string") {
		const cvs = container.querySelector("#" + canvasName);
		if (cvs instanceof HTMLElement) {
			// if already exist
			canvas = cvs;
			prepareCanvas();
			fx();
			return;
		}
	} else {
		canvasName = parentName + "-C-" + parentCID;
		configs.name = canvasName;
	}
	function prepareCanvas() {
		// add additional information to rendererContext
		C.resizeCanvas(canvas, configs);
		canvas.context = Object.assign(canvas.getContext("2d"), configs);
		canvas.context.setTransform(configs.dpr, 0, 0, configs.dpr, 0, 0);
		C.workingCanvas = canvas.context;
		C.workingCanvas.savedStates = defaultConfigs;
		C.workingCanvas.delayedAnimations = [];
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
 * Default configurations
 */
/**
 * return inner width of container tag
 * @param {HTMLElement} [container=document.body]
 * @returns {Number}
 */
C.getContainerWidth = function (container = document.body) {
	const cs = window.getComputedStyle(container);
	return (
		parseInt(cs.width) - parseInt(cs.paddingRight) - parseInt(cs.paddingLeft)
	);
};

/**
 * Set width and height attribute of canvas element to the given values in `configs`
 * and scales CSS width and height to DPR
 *
 * @param {HTMLCanvasElement} cvs
 * @param {Object} configs
 * values needed in `configs`:
 *
 * dpr    <Number>: Device pixel ratio
 * width  <Number>: Width in pixels
 * height <Number>: Height in pixels
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
C.addExtension = function (extObj, editable) {
	defineProperties(extObj, window, !editable);
	defineProperties(extObj, C.extensions, !editable);
};

/**
 * @type {object}
 */
C.defineProperties = defineProperties;

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

// register to window
window.C = C;

export { C };
