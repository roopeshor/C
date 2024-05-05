/** @module Utils */
import { gcd } from "./math/aritmetics.js";
import { C } from "./main.js";

/**
 * Returns the type of object
 * @return {string}
 * @ignore
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
 * @param {*} [target=globalThis] target object
 * @param {boolean} [assignToC=true] whether apply properties to C.
 */
export function defineProperties(source, target = globalThis, assignToC = false) {
	Object.assign(target, source);
	if (assignToC) Object.assign(C.functions, source);
}

/**
 * Returns a array of numbers from `start` to `end` with each element having difference of `step`
 *
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @param {boolean} [rev=false] return in reverse order
 * @return {number[][]}
 */
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
 * @ignore
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
 * @ignore
 */
export function doFillAndStroke(ctx) {
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
}

/**
 * Checks if any number in the array matches closely with the given value.
 *
 * @param {number} value value to search for
 * @param {number[]} array
 * @param {number} [epsilon=1e-6] maximum difference
 * @return {number}
 * @ignore
 */
export function inArray(value, array, epsilon = 1e-6) {
	for (let i = 0; i < array.length; i++) {
		let k = array[i];
		if (Math.abs(k - value) <= epsilon) {
			return true;
		}
	}
	return false;
}

/**
 * convert tex to image using MathJax
 *
 * @param {string} latex
 * @return {Promise}
 * @ignore
 */

export function latexToImg(latex) {
	let MJX = window["MathJax"] || {};
	return new Promise((resolve, reject) => {
		let wrapper = MJX.tex2svg(`${latex}`, { em: 10, ex: 5, display: true });
		let mjOut = wrapper.getElementsByTagName("svg")[0];
		// mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg")
		let output = { svg: "", img: "" };
		output.svg = mjOut.outerHTML;
		var image = new Image();
		image.src =
			"data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(output.svg)));
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
 * Returns numerator and denominator strings for given fraction
 * @param {number} numerator numerator of fraction
 * @param {number} denominator denominator of fraction
 * @param {boolean} [simplifyFraction=true] whether to simplify fraction by dividing numerator and denominator by gcd
 * @param {boolean} [compact=true] whether to add ```multiple``` with numerator or simply append it to end of string
 * @param {string} [multiple=""] an multiple
 * @returns {string[]} returns two strings
 */
function getReducedFraction(numerator, denominator) {
	let _divider = gcd(numerator, denominator);
	numerator /= _divider;
	denominator /= _divider;
	return [`${numerator}`, `${denominator}`];
}

/**
 * Generates tex code for given fraction.
 * Used in coordinate system labeling
 *
 * @param {number} numerator numerator of fraction
 * @param {number} denominator denominator of fraction
 * @param {boolean} [simplifyFraction=true] whether to simplify fraction by dividing numerator and denominator by gcd
 * @param {boolean} [compact=true] whether to add ```multiple``` with numerator or simply append it to end of string
 * @param {string} [multiple=""] an multiple
 * @returns {string}
 *
 * @example
 * texFraction(5, 10, false) // -> \frac{5}{10}
 * texFraction(5, 10, true) // -> \frac{1}{2}
 * texFraction(5, 10, true, true, "π") // -> \frac{π}{2}
 * texFraction(5, 10, true, false, "π") // -> \frac{1}{2}π
 * texFraction(5, 10, false, false, "π") // -> \frac{5}{10}π
 * texFraction(5, 10, false, true, "π") // -> \frac{5π}{10}
 * @ignore
 */
export function texFraction(
	numerator,
	denominator,
	simplifyFraction = true,
	compact = true,
	multiple = "",
) {
	let num = numerator,
		den = denominator;
	if (simplifyFraction) {
		[num, den] = getReducedFraction(num, den);
	}
	if (num == 0) {
		tex = "0";
	} else if (den == 1) {
		tex = num;
	} else if (compact) {
		// if numerator is 1 and there is a multiple, add multiple without numerator
		if (num == 1 && multiple != "") num = "";
		tex = `\\frac{${num}${multiple}}{${den}}`;
	} else {
		tex = `\\frac{${num}}{${den}}${multiple}`;
	}
	return tex;
}

/**
 * Generates text fraction for given fraction.
 * Used in coordinate system labeling
 *
 * @param {number} numerator numerator of fraction
 * @param {number} denominator denominator of fraction
 * @param {boolean} [simplifyFraction=true] whether to simplify fraction by dividing numerator and denominator by gcd
 * @param {boolean} [compact=true] whether to add ```multiple``` with numerator or simply append it to end of string
 * @param {string} [multiple=""] an multiple
 * @returns {string}
 */
export function fraction(
	numerator,
	denominator,
	simplifyFraction = true,
	compact = true,
	multiple = "",
) {
	let num = numerator,
		den = denominator,
		str = "";
	if (simplifyFraction) {
		[num, den] = getReducedFraction(num, den);
	}
	if (num == 0) {
		str = "0";
	} else if (den == 1) {
		str = num + denominator;
	} else if (compact) {
		// if numerator is 1 and there is a multiple, add multiple without numerator
		if (num == 1 && multiple != "") num = "";
		str = `${num}${multiple}/${den}`;
	} else {
		str = `(${num}/${den})${multiple}`;
	}
	return str;
}

export function measureHeight(text) {
	let { actualBoundingBoxAscent, actualBoundingBoxDescent } =
		C.workingContext.measureText(text);
	return actualBoundingBoxAscent + actualBoundingBoxDescent;
}

/**
 *
 * @param {Object<string:Function>} constantList
 */
export function defineConstant(constantList) {
	let constants = Object.keys(constantList);
	for (let i = 0; i < constants.length; i++) {
		let constant = constants[i];
		Object.defineProperty(globalThis, constant, {
			configurable: true,
			enumerable: true,
			get: constantList[constant],
			set: function (val) {
				Object.defineProperty(globalThis, constant, {
					configurable: true,
					enumerable: true,
					value: val,
					writable: true,
				});
			},
		});
	}
}

export function isLabel(s) {
	return s != null && s != "";
}
