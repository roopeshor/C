/**
 * defines new properties to a given Object
 *
 * @param {Object} obj source object
 * @param {Object} [toAssign=window] target object
 * @param {Function} [message] message given on redefining value
 */
function defineProperties(obj, toAssign = window, message) {
  message =
    typeof message == "function"
      ? message
      : function (k) {
          console.warn(
            'You changed value of "' + k + '" which C uses. Be careful'
          );
        };
  for (var i = 0, consts = Object.keys(obj); i < consts.length; i++) {
    // definer in IIFE to avoid assigning same values to all properties
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
    })(consts[i], obj[consts[i]], toAssign, message);
  }
}

const ColorList = {
    // borrowed from Manim
    DARK_BLUE: "#236B8E",
    DARK_BROWN: "#8B4513",
    LIGHT_BROWN: "#CD853F",
    BLUE_A: "#C7E9F1",
    BLUE_B: "#9CDCEB",
    BLUE_C: "#58C4DD",
    BLUE_D: "#29ABCA",
    BLUE_E: "#1C758A",
    TEAL_A: "#ACEAD7",
    TEAL_B: "#76DDC0",
    TEAL_C: "#5CD0B3",
    TEAL_D: "#55C1A7",
    TEAL_E: "#49A88F",
    GREEN_A: "#C9E2AE",
    GREEN_B: "#A6CF8C",
    GREEN_C: "#83C167",
    GREEN_D: "#77B05D",
    GREEN_E: "#699C52",
    YELLOW_A: "#FFF1B6",
    YELLOW_B: "#FFEA94",
    YELLOW_C: "#FFFF00",
    YELLOW_D: "#F4D345",
    YELLOW_E: "#E8C11C",
    GOLD_A: "#F7C797",
    GOLD_B: "#F9B775",
    GOLD_C: "#F0AC5F",
    GOLD_D: "#E1A158",
    GOLD_E: "#C78D46",
    RED_A: "#F7A1A3",
    RED_B: "#FF8080",
    RED_C: "#FC6255",
    RED_D: "#E65A4C",
    RED_E: "#CF5044",
    MAROON_A: "#ECABC1",
    MAROON_B: "#EC92AB",
    MAROON_C: "#C55F73",
    MAROON_D: "#A24D61",
    MAROON_E: "#94424F",
    PURPLE_A: "#CAA3E8",
    PURPLE_B: "#B189C6",
    PURPLE_C: "#9A72AC",
    PURPLE_D: "#715582",
    PURPLE_E: "#644172",
    WHITE: "#FFFFFF",
    BLACK: "#000000",
    LIGHT_GRAY: "#BBBBBB",
    LIGHT_GREY: "#BBBBBB",
    GRAY: "#888888",
    GREY: "#888888",
    DARK_GREY: "#444444",
    DARK_GRAY: "#444444",
    DARKER_GREY: "#222222",
    DARKER_GRAY: "#222222",
    GREY_BROWN: "#736357",
    PINK: "#D147BD",
    LIGHT_PINK: "#DC75CD",
    GREEN_SCREEN: "#00FF00",
    ORANGE: "#FF862F",
  },
  mathConsts = {
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
  };

defineProperties(ColorList);
defineProperties(mathConsts);
defineProperties(mathFunctions);
