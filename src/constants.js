/**
 * defines new properties to a given Object
 *
 * @param {Object} obj source object
 * @param {boolean} [specific=true] whether to create a specific object
 * @param {Object} [toAssign=window] target object
 * @param {Function} [message] message given on redefining value
 */
function defineProperties(obj, toAssign = window, specific = true, message) {
  message =
    typeof message == "function"
      ? message
      : function (k) {
          console.warn(
            'You changed value of "' + k + '" which C uses. Be careful'
          );
        };
  for (var i = 0, props = Object.keys(obj); i < props.length; i++) {
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

const mathConsts = {
    E: 2.718281828459045,
    LN2: 0.6931471805599453,
    LN10: 2.302585092994046,
    PI: 3.141592653589793,
    TAU: 6.283185307179586,
    SQRT2: 1.4142135623730951,
  },
  mathFunctions = {
    abs: Math.abs,
    acos: Math.acos,
    asin: Math.asin,
    atan: Math.atan,
    atan2: Math.atan2,
    cbrt: Math.cbrt,
    ceil: Math.ceil,
    cos: Math.cos,
    cosh: Math.cosh,
    exp: Math.exp,
    floor: Math.floor,
    log: Math.log,
    log2: Math.log2,
    log10: Math.log10,
    max: Math.max,
    min: Math.min,
    pow: Math.pow,
    random: Math.random,
    round: Math.round,
    sgn: Math.sign,
    sin: Math.sin,
    sqrt: Math.sqrt,
    tan: Math.tan,
    tanh: Math.tanh,
    /**
     * return distance between two points
     *
     * @param {array} p1
     * @param {array} p2
     * @return {number} distance between p1 and p2
     */
    dist: function dist(p1, p2) {
      return sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
    },
    randomInt: function (max = 10, min = 0) {
      return Math.round(Math.random() * (max - min) + min);
    },
    sigmoid: function sigmoid(x) {
      return 1.0 / (1 + Math.exp(-x));
    },
    smooth: function smooth(t, inflection = 10.0) {
      var error = sigmoid(-inflection / 2);
      return limit(
        (sigmoid(inflection * (t - 0.5)) - error) / (1 - 2 * error),
        0,
        1
      );
    },
    rushInto: function rushInto(t, inflection = 10.0) {
      return 2 * smooth(t / 2.0, inflection);
    },
    rushFrom: function rushFrom(t, inflection = 10.0) {
      return 2 * smooth(t / 2.0 + 0.5, inflection) - 1;
    },
    slowInto: function slowInto(t) {
      return Math.sqrt(1 - (1 - t) * (1 - t));
    },
    doubleSmooth: function doubleSmooth(t) {
      if (t < 0.5) return 0.5 * smooth(2 * t);
      else return 0.5 * (1 + smooth(2 * t - 1));
    },
    limit: function limit(x, mi = 0, ma = 1) {
      return Math.min(Math.max(x, mi), ma);
    },
  },
  drawingConstants = {
    BUTT: "butt",
    SQUARE: "square",
    ROUND: "round",
  };

defineProperties(mathConsts);
defineProperties(mathFunctions);
defineProperties(drawingConstants, window, false);
