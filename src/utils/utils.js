Object.getType = function (obj) {
	return Object.prototype.toString.call(obj).replace(/(\[object|\s|])/g, "");
};
Object.clone =
	Object.clone ||
	function (toClone) {
		var newObj = {};
		for (var i = 0, keys = Object.keys(toClone); i < keys.length; i++)
			newObj[keys[i]] = toClone[keys[i]];
		return newObj;
	};

/**
 * defines new properties to a given Object
 *
 * @param {object} obj source object
 * @param {object} [toAssign=window] target object
 * @param {boolean} [specific=true] whether to define properties special
 * @param {function} [message] message given on redefining value. Only works if `specific === true`
 */
function defineProperties(obj, toAssign, specific, message) {
	toAssign = toAssign || window;
	specific = specific === undefined || specific === null ? window : specific;
	toAssign = toAssign || window;
	message =
		typeof message === "function"
			? message
			: function (k) {
					console.warn(
						"You changed value of '" + k + "' which C uses. Be careful"
					);
				};
	for (let i = 0, props = Object.keys(obj); i < props.length; i++) {
		// definer in IIFE to avoid assigning same values to all properties
		if (specific) {
			(function (name, value, toAssign, message) {
				Object.defineProperty(toAssign, name, {
					configurable: true,
					enumerable: true,
					get: function get() {
						return value;
					},
					set: function set(value) {
						Object.defineProperty(toAssign, name, {
							configurable: true,
							enumerable: true,
							value: value,
							writable: true,
						});
						message(name);
					},
				});
			})(props[i], obj[props[i]], toAssign, message);
		} else {
			window[props[i]] = obj[props[i]];
		}
	}
}

function arange(start, end, step, rev = false) {
	const arr = [];
	if (rev) for (let i = end; i >= start; i -= step) arr.push(i);
	else for (let i = start; i <= end; i += step) arr.push(i);
	return arr;
}

/**
 * Applies default configurations to a given target object
 * Must be in the form of
 * <prop>: [<defaultValue>, <type>]
 *
 * @param {object} _default default configurations
 * @param {object} [target={}] target object
 * @param {boolean} [deepApply=true] whether to apply defaults to deep nested objects
 * @return {object} applied object
 */
function applyDefault(_default, target = {}, deepApply = true) {
	target = Object.clone(target);
	for (let i = 0, keys = Object.keys(_default); i < keys.length; i++) {
		const prop = keys[i], defaultProp = _default[prop], targetProp = target[prop];
		const defaultType = Object.getType(defaultProp);
		const targetType = Object.getType(targetProp);
		if (defaultType == "Object" && deepApply) {
			target[prop] = applyDefault(defaultProp, targetProp, deepApply);
		}
		if (targetType !== defaultType)	target[prop] = _default[prop];
	}
	return target;
}

/**
 * fills and strokes inside the current shape if to and closes the shape.
 *
 * @param {CanvasRenderingContext2D} ctx
 */
function doFillAndStroke(ctx) {
	if (ctx.doFill) ctx.fill();
	if (ctx.doStroke) ctx.stroke();
}

function approximateIndexInArray(val, array, epsilon = 1e-6) {
	for (let i = 0; i < array.length; i++) {
		var k = array[i];
		if (Math.abs(k - val) <= epsilon) {
			return i;
		}
	}
	return -1;
}
export {
	defineProperties,
	arange,
	applyDefault,
	doFillAndStroke,
	approximateIndexInArray,
};

// dev tools
export function log() {
	console.log(...arguments);
}
