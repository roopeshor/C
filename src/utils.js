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

window["applyDefault"] = applyDefault;
