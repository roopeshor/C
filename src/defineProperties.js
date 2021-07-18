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
	specific = (specific === undefined || specific === null) ? window : specific;
	toAssign = toAssign || window;
	message =
    typeof message === "function" ? message : function (k) { console.warn("You changed value of \"" + k + "\" which C uses. Be careful"); };
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
							writable: true
						});
						message(name);
					}
				});
			})(props[i], obj[props[i]], toAssign, message);
		} else {
			window[props[i]] = obj[props[i]];
		}
	}
}

export { defineProperties };
