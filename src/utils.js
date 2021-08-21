import { C } from "./main.js";

/**
 * Returns the type of object
 *
 * @param {*} stuff
 * @return {string}
 */
function getType(stuff) {
	return Object.prototype.toString.call(stuff).slice(8, -1);
}

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
 * @param {object} target source object
 * @param {object} [target=window] target object
 */
function defineProperties(source, target = window, assignToC = true) {
	Object.assign(target, source);
	if (assignToC) Object.assign(C.functions, source);
}

function arange(start, end, step, rev = false) {
	let arr = [];
	if (rev) for (let i = end; i >= start; i -= step) arr.push(i);
	else for (let i = start; i <= end; i += step) arr.push(i);
	return arr;
}

/**
 * Applies default configurations to a given target object
 * Must be in the form of
 *
 * @param {object} _default default configurations
 * @param {object} [target={}] target object
 * @param {boolean} [deepApply=true] whether to apply defaults to deep nested objects
 * @return {object} applied object
 */
function applyDefault(_default, target = {}, deepApply = true) {
	target = Object.clone(target);
	for (let i = 0, keys = Object.keys(_default); i < keys.length; i++) {
		let prop = keys[i],
			defaultProp = _default[prop],
			targetProp = target[prop],
			defaultType = getType(defaultProp),
			targetType = getType(targetProp);
		if (defaultType == "Object" && deepApply) {
			target[prop] = applyDefault(defaultProp, targetProp, deepApply);
		}
		if (targetType !== defaultType) target[prop] = _default[prop];
	}
	return target;
}

/**
 * fills and strokes inside the current shape if to do so.
 *
 * @param {CanvasRenderingContext2D} ctx
 */
function doFillAndStroke(ctx) {
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
}

function approximateIndexInArray(val, array, epsilon = 1e-6) {
	for (let i = 0; i < array.length; i++) {
		let k = array[i];
		if (Math.abs(k - val) <= epsilon) {
			return i;
		}
	}
	return -1;
}

window.applyDefault = applyDefault;
export {
	getType,
	defineProperties,
	arange,
	applyDefault,
	doFillAndStroke,
	approximateIndexInArray,
};
