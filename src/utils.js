import { gcd } from "./c.js";
import { C } from "./main.js";

/**
 * Returns the type of object
 * @return {string}
 */
export const type = (stuff) => Object.prototype.toString.call(stuff).slice(8, -1);

Object.clone =
	Object.clone ||
	function (toClone) {
		let newObj = {};
		for (let i = 0, keys = Object.keys(toClone); i < keys.length; i++) {
			let a = toClone[keys[i]];
			newObj[keys[i]] = a;
		}
		return newObj;
	};

/**
 * defines new properties to a given Object
 *
 * @param {*} source source object
 * @param {*} [target=window] target object
 * @param {boolean} [assignToC=true] whether apply properties to C.
 */
export function defineProperties(source, target = window, assignToC = false) {
	Object.assign(target, source);
	if (assignToC) Object.assign(C.functions, source);
}

export function arange(start, end, step, rev = false) {
	let arr = [];
	if (rev) for (let i = end; i >= start; i -= step) arr.push(i);
	else for (let i = start; i <= end; i += step) arr.push(i);
	return arr;
}

/**
 * Applies default configurations to a given target object
 * Must be in the form of
 *
 * @param {Object} _default default configurations
 * @param {Object} [target] target object. Default = {}.
 * @param {boolean} [deepApply=true] whether to apply defaults to deep nested objects
 * @return {Object} applied object
 */
export function applyDefault(_default, target = {}, deepApply = true) {
	target = Object.clone(target);
	for (let i = 0, keys = Object.keys(_default); i < keys.length; i++) {
		let prop = keys[i],
			defaultProp = _default[prop],
			targetProp = target[prop],
			defaultType = type(defaultProp),
			targetType = type(targetProp);
		if (defaultType == "Object" && deepApply) {
			target[prop] = applyDefault(defaultProp, targetProp, deepApply);
		}
		if (defaultType == "Undefined" || defaultType == "Null") {
			// let the value in target as it is. Since the type is not defined in default configs
			continue;
		}
		if (targetType !== defaultType) {
			target[prop] = _default[prop];
		}
	}
	return target;
}

/**
 * fills and strokes inside the current shape if to do so.
 *
 * @param {CanvasRenderingContext2D} ctx
 */
export function doFillAndStroke(ctx) {
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
}

export function approximateIndexInArray(val, array, epsilon = 1e-6) {
	for (let i = 0; i < array.length; i++) {
		let k = array[i];
		if (Math.abs(k - val) <= epsilon) {
			return i;
		}
	}
	return -1;
}

export function latexToImg(latex) {
	return new Promise((resolve, reject) => {
		let wrapper = MathJax.tex2svg(`${latex}`, { em: 10, ex: 5, display: true });
		let mjOut = wrapper.getElementsByTagName("svg")[0];
		// mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg")
		let output = { svg: "", img: "" };
		output.svg = mjOut.outerHTML;
		var image = new Image();
		image.src =
			"data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(output.svg)));
		image.onload = function () {
			var canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
			var context = canvas.getContext("2d");
			context.drawImage(image, 0, 0);
			output.img = canvas.toDataURL("image/png");
			resolve(output.img);
		};
		image.onerror = function () {
			reject();
		};
	});
}

/**
 * simplifies a given frqction and generates tex code for it.
 * @example
 * fraction(4, 5) // -> "\frac{4}{5}"
 *
 * @param {number} numerator numerator of fraction
 * @param {number} denominator denominator of fraction
 * @param {boolean} [simplifyFraction=true] whether to simplify fraction by dividing numerator and denominator by gcd
 * @param {boolean} [compact=true] whether to add ```multiple``` with numerator or simply append it to end of string
 * @param {string} [multiple=""] an multiple
 * @returns {string}
 */
export function fraction(numerator, denominator, simplifyFraction=true, compact = true, multiple = "") {
	if (simplifyFraction) {
			let _divider = gcd(numerator, denominator);
			numerator /= _divider;
			denominator /= _divider;
	}
	let tex = "";
	if (numerator == 0) {
		tex = "0";
	} else if (denominator == 1) {
		tex = numerator + multiple;
	} else {
		if (compact) {
			// if numerator is 1 and there is a multiple, add multiple without numerator
			if (numerator == 1 && multiple != "") numerator = "";
			tex = `\\frac{${numerator}${multiple}}{${denominator}}`;
		} else {
			tex = `\\frac{${numerator}}{${denominator}}${multiple}`;
		}
	}
	return tex;
}

window["applyDefault"] = applyDefault;
