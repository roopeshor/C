(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readColor = readColor;
var _colors = require("../constants/colors.js");
/** @module Color-Reader */

// adapeted from p5.js
// Full color string patterns. The capture groups are necessary.
let
  // Matches: #XXX
  HEX3 = /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,
  // Matches: #XXXX
  HEX4 = /^#([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])$/i,
  // Matches: #xxxxxx
  HEX6 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
  // Matches: #XXXXXXXX
  HEX8 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
  // Matches: rgb(R, G, B)
  RGB = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i,
  // Matches: rgb(R, G, B, A)
  RGBA = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(?:(\d+(?:\.\d+)?)|(?:\.\d+))\)$/i;
/**
 * Reads the argument and returns color in the prefered colorMode.
 * If last argument is given true, it will return the colors as array.
 * Possible use cases (these assume colorModes to be 'rgba'):
 * Only accept valid css colors
 *
 * * readColor(100)                 // rgba(100, 100, 100, 1)
 * * readColor(255, 200)            // rgba(255, 200, 0, 1)
 * * readColor(255, 200, 100)       // rgba(255, 200, 100, 1)
 * * readColor(290, 134, 50, 0.6)   // rgba(290, 134, 50, 0.6)
 * * readColor("#f3d")              // rgba(255, 51, 221, 1)
 * * readColor("#fa054f")           // rgba(250, 5, 79, 1)
 * * readColor("#fa054fa0")         // rgba(250, 5, 79, 0.6274509803921569)
 * * readColor(255, 200, 100, true) // [255, 200, 100, 1]
 * * readColor("#f3da", true)       // [255, 51, 221, 0.0392156862745098]
 *
 * @return {Object} color string/array
 */
function readColor(...color) {
  let result;
  if (Array.isArray(color[0])) color = color[0];
  let c1 = color[0];
  if (typeof c1 === "number") {
    if (color.length === 1) {
      result = [c1, c1, c1, 1];
    } else if (color.length === 2) {
      result = [c1, color[1], 0, 1];
    } else if (color.length === 3) {
      result = [c1, color[1], color[2], 1];
    } else if (color.length === 4) {
      result = [c1, color[1], color[2], color[3]];
    }
  } else if (typeof c1 == "string") {
    // Adapted from p5.js
    let str = c1.replace(/\s/g, "").toLowerCase();
    // convert string to array if it is a named colour.
    if (_colors.Colors[str]) {
      result = _colors.Colors[str];
      result = [parseInt(result.substr(1, 2), 16), parseInt(result.substr(3, 2), 16), parseInt(result.substr(5, 2), 16), 1];
    } else if (HEX3.test(str)) {
      result = HEX3.exec(str).slice(1).map(color => parseInt(color + color, 16));
      result[3] = 1;
    } else if (HEX6.test(str)) {
      result = HEX6.exec(str).slice(1).map(color => parseInt(color, 16));
      result[3] = 1;
    } else if (HEX4.test(str)) {
      result = HEX4.exec(str).slice(1).map(color => parseInt(color + color, 16));
      result[3] /= 255;
    } else if (HEX8.test(str)) {
      result = HEX8.exec(str).slice(1).map(color => parseInt(color, 16));
      result[3] /= 255;
    } else if (RGB.test(str)) {
      result = RGB.exec(str).slice(1).map(color => parseInt(color, 10));
      result[3] = 1;
    } else if (RGBA.test(str)) {
      result = RGBA.exec(str).slice(1).map((color, index) => {
        if (index == 3) return parseFloat(color);
        return parseInt(color, 10);
      });
    } else {
      throw new Error("Cannot convert given value to color: " + str);
    }
  } else {
    result = c1;
    return {
      rgbaA: result,
      rgba: result,
      hex6: result,
      hex8: result,
      hex: result,
      hsl: result
    };
  }
  let a = result[3];
  result[3] *= 255;
  let hex6 = "#",
    r = result;
  r.map((color, i) => {
    if (i < 3) {
      let hex = Math.round(color).toString(16);
      hex6 += hex.length == 1 ? "0" + hex : hex;
    }
  });
  let hex8 = "#";
  r = result;
  r.map((color, i) => {
    if (i < 4) {
      let hex = Math.round(color).toString(16);
      hex8 += hex.length == 1 ? "0" + hex : hex;
    }
  });
  result[3] = a;
  return {
    rgbaA: result,
    rgba: `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${result[3]})`,
    hex6: hex6,
    hex8: hex8,
    hex: hex8,
    hsl: `hsl(${result[0]}, ${result[1]}, ${result[2]})`
  };
}

},{"../constants/colors.js":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linearGradient = linearGradient;
var _main = require("../main.js");
var _utils = require("../utils.js");
/** @module Color-Gradient */

/**
 * creates a linear gradient
 *
 * @param {number[]} initialPoint initial point as [x, y]
 * @param {number[]} finalPoint final point as [x, y]
 * @param {Object|Array<*>} colStops color stops
 @example
 ```js
let color = linearGradient(
	[0, 0], [200, 0],
	{
			0: "green",
			0.5: "cyan",
			1: "yellow"
	}
);
```,
```js
let color = linearGradient(
	[0, 0], [200, 0],
	[
		"green",
		"cyan",
		"yellow"
	]
);
```
 */
function linearGradient(initialPoint, finalPoint, colStops) {
  const ctx = _main.C.workingContext;
  const gradient = ctx.createLinearGradient(initialPoint[0], initialPoint[1], finalPoint[0], finalPoint[1]);
  if ((0, _utils.type)(colStops) == "Array") {
    const stops = {};
    const step = 1 / colStops.length;
    for (let i = 0; i < colStops.length; i++) {
      stops[step * i] = colStops[i];
    }
    colStops = stops;
  } else if ((0, _utils.type)(colStops) == "Object") {
    colStops = colStops;
  } else {
    throw new Error("Color Stops must be an Array or an Object");
  }
  for (let stops = Object.keys(colStops || {}), i = 0; i < stops.length; i++) {
    const stop = Number(stops[i]);
    gradient.addColorStop(stop, colStops[stop]);
  }
  return gradient;
}

},{"../main.js":9,"../utils.js":17}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInterpolatedColorList = getInterpolatedColorList;
exports.lerpColor = lerpColor;
exports.lerpColorArray = lerpColorArray;
exports.lerpColorObject = lerpColorObject;
var _color_reader = require("./color_reader.js");
/** @module Color-Lerp */

/**
 * gives an interpolated color.
 *
 * @param {string} color1 color
 * @param {string} color2 color
 * @param {number} v should be between 0 and 1. This function may not work for values outside 0 & 1.
 */
function lerpColor(color1, color2, v) {
  const c1 = (0, _color_reader.readColor)(color1).rgbaA;
  const c2 = (0, _color_reader.readColor)(color2).rgbaA;
  return (0, _color_reader.readColor)(Math.min(Math.max(0, (c2[0] - c1[0]) * v + c1[0]), 255), Math.min(Math.max(0, (c2[1] - c1[1]) * v + c1[1]), 255), Math.min(Math.max(0, (c2[2] - c1[2]) * v + c1[2]), 255), Math.min(Math.max(0, (c2[3] - c1[3]) * v + c1[3]), 255)).hex8;
}

/**
 * Lerps across a color Object
 *
 * @param {Object} colorObj
 * @param {number} v
 * @return {string}
 */
function lerpColorObject(colorObj, v) {
  const stopes = Object.keys(colorObj || {}).sort();
  const min = Math.min(...stopes);
  const max = Math.max(...stopes);
  let color = "#000000";
  if (v >= max) return colorObj[max];
  if (v <= min) return colorObj[min];
  for (let i = 0; i < stopes.length - 1; i++) {
    let a = stopes[i];
    if (v > a) {
      color = lerpColor(colorObj[a], colorObj[stopes[i + 1]], (v - a) / (stopes[i + 1] - a));
      break;
    } else if (v == a) {
      color = colorObj[a];
      break;
    }
  }
  return color;
}

/**
 * Lerps across a color Array
 * From <https://github.com/yuki-koyama/tinycolormap/blob/fe597277c782c583eb40362de98a08df62efc628/include/tinycolormap.hpp#L159>
 * @param {string[]} colorArr array that contains color as string
 * @param {number} v value to interpolate
 * @param {number} [min = 0] minimum value of the range
 * @param {number} [max = 1] maximum value of the range
 * @return {string} lerped color
 */
function lerpColorArray(colorArr, v, min = 0, max = 1) {
  let len = colorArr.length - 1;
  if (v >= max) return colorArr[len];
  if (v <= min) return colorArr[0];

  // map to [0, 1]
  v = (v - min) / (max - min);
  let a = v * len,
    // between 0 and len
    b = Math.floor(a);
  return lerpColor(colorArr[b], colorArr[b + 1], a - b);
}

/**
 *
 * @param {string[]} colorPalatte Array of color palettes
 * @param {number} [min=0] minimum of range
 * @param {number} [max=5] maximum of range
 * @param {number} [alpha=1] value of alpha channel. This value must be between 0 & 1
 * @returns {Object} color object
 */
function getInterpolatedColorList(colorPalatte, min = 0, max = 5, alpha) {
  if (colorPalatte.length < 2) throw new Error("Atleast 2 colors are needed to create interpolatable object");
  let step = (max - min) / (colorPalatte.length - 1),
    colorObj = {};
  for (let i = 0; i < colorPalatte.length; i++) {
    let value = min + i * step,
      color = (0, _color_reader.readColor)(colorPalatte[i]).rgbaA;
    color[3] = isNaN(alpha) ? color[3] : alpha;
    colorObj[value] = color;
  }
  return colorObj;
}

},{"./color_reader.js":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Colors = void 0;
/** @module Colors */
/* List of named CSS colors  */
// prettier-ignore
const Colors = exports.Colors = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ULTRA_EXPANDED = exports.ULTRA_CONDENSED = exports.TOP = exports.START = exports.SQUARE = exports.SEMI_EXPANDED = exports.SEMI_CONDENSED = exports.ROUND = exports.RIGHT = exports.OBLIQUE = exports.NORMAL = exports.MITER = exports.MILTER = exports.MIDDLE = exports.LEFT = exports.ITALIC = exports.IDEOGRAPHIC = exports.HANGING = exports.EXTRA_EXPANDED = exports.EXTRA_CONDENSED = exports.EXPANDED = exports.END = exports.CONDENSED = exports.CENTER = exports.BUTT = exports.BOTTOM = exports.BEVEL = exports.ALPHABETIC = void 0;
const BUTT = exports.BUTT = "butt",
  SQUARE = exports.SQUARE = "square",
  ROUND = exports.ROUND = "round",
  MILTER = exports.MILTER = "milter",
  BEVEL = exports.BEVEL = "bevel",
  MITER = exports.MITER = "miter",
  LEFT = exports.LEFT = "left",
  RIGHT = exports.RIGHT = "right",
  CENTER = exports.CENTER = "center",
  START = exports.START = "start",
  END = exports.END = "end",
  TOP = exports.TOP = "top",
  HANGING = exports.HANGING = "hanging",
  MIDDLE = exports.MIDDLE = "middle",
  ALPHABETIC = exports.ALPHABETIC = "alphabetic",
  IDEOGRAPHIC = exports.IDEOGRAPHIC = "ideographic",
  BOTTOM = exports.BOTTOM = "bottom",
  // font stretch properties
  ULTRA_CONDENSED = exports.ULTRA_CONDENSED = "ultra-condensed",
  // 50%
  EXTRA_CONDENSED = exports.EXTRA_CONDENSED = "extra-condensed",
  // 62.5%
  CONDENSED = exports.CONDENSED = "condensed",
  // 75%
  SEMI_CONDENSED = exports.SEMI_CONDENSED = "semi-condensed",
  // 87.5%
  NORMAL = exports.NORMAL = "normal",
  // 100%
  SEMI_EXPANDED = exports.SEMI_EXPANDED = "semi-expanded",
  // 112.5%
  EXPANDED = exports.EXPANDED = "expanded",
  // 125%
  EXTRA_EXPANDED = exports.EXTRA_EXPANDED = "extra-expanded",
  // 150%
  ULTRA_EXPANDED = exports.ULTRA_EXPANDED = "ultra-expanded",
  // 200%
  // font style properties
  ITALIC = exports.ITALIC = "italic",
  OBLIQUE = exports.OBLIQUE = "oblique";

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNIT_VEC = exports.TWO_PI = exports.TIERCE_PI = exports.TAU = exports.SQRT2 = exports.RAD = exports.QUATER_PI = exports.PI = exports.PHI = exports.ORIGIN = exports.LN2 = exports.LN10 = exports.HALF_PI = exports.E = exports.DEG = void 0;
const E = exports.E = 2.71828182845904523,
  LN2 = exports.LN2 = 0.6931471805599453,
  LN10 = exports.LN10 = 2.30258509299404568,
  PI = exports.PI = 3.14159265358979323,
  HALF_PI = exports.HALF_PI = 1.57079632679489661,
  TIERCE_PI = exports.TIERCE_PI = 1.04719755119659774,
  QUATER_PI = exports.QUATER_PI = 0.7853981633974483,
  TAU = exports.TAU = 6.28318530717958647,
  TWO_PI = exports.TWO_PI = 6.28318530717958647,
  SQRT2 = exports.SQRT2 = 1.41421356237309504,
  PHI = exports.PHI = 1.618033988749894,
  // conversion factors
  DEG = exports.DEG = Math.PI / 180,
  // degree to radian
  RAD = exports.RAD = 180 / Math.PI,
  // radian to degree
  ORIGIN = exports.ORIGIN = [0, 0],
  UNIT_VEC = exports.UNIT_VEC = [1, 1];

},{}],7:[function(require,module,exports){
"use strict";

var Utils = _interopRequireWildcard(require("./utils.js"));
var _main = require("./main.js");
var Settings = _interopRequireWildcard(require("./settings.js"));
var _Math = _interopRequireWildcard(require("./constants/math.js"));
var Drawing = _interopRequireWildcard(require("./constants/drawing.js"));
var Gradients = _interopRequireWildcard(require("./color/gradients.js"));
var Interpolation = _interopRequireWildcard(require("./color/interpolation.js"));
var Image = _interopRequireWildcard(require("./image/image.js"));
var Text = _interopRequireWildcard(require("./objects/text.js"));
var Geometry = _interopRequireWildcard(require("./objects/geometry.js"));
var Functions = _interopRequireWildcard(require("./math/functions.js"));
var _points = require("./math/points.js");
var Random = _interopRequireWildcard(require("./math/random.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// important functions & constants

[{
  C: _main.C,
  dist: _points.dist
}, Utils, Settings, _Math, Drawing, Gradients, Interpolation, Image, Text, Geometry, Functions, Random].forEach(value => Utils.defineProperties(value));

},{"./color/gradients.js":2,"./color/interpolation.js":3,"./constants/drawing.js":5,"./constants/math.js":6,"./image/image.js":8,"./main.js":9,"./math/functions.js":11,"./math/points.js":12,"./math/random.js":13,"./objects/geometry.js":14,"./objects/text.js":15,"./settings.js":16,"./utils.js":17}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawImage = drawImage;
exports.loadImage = loadImage;
exports.loadImagePromise = loadImagePromise;
exports.pixel = pixel;
var _main = require("../main.js");
/**
 * This module contains function for image manipulation.
 * @module Image
 */

/**
 * Draws a given image in canvas.
 * See more about the parameters : {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage}
 * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement|ImageBitmap|OffscreenCanvas} image image to draw
 */
function drawImage(image) {
  let ctx = _main.C.workingContext,
    x,
    y;
  if (arguments.length < 6) {
    x = arguments[1];
    y = arguments[2];
  } else {
    x = arguments[5];
    y = arguments[6];
  }
  ctx.save();
  ctx.translate(x, y);
  if (ctx.yAxisInverted) ctx.scale(1, -1);
  if (ctx.XAxisInverted) ctx.scale(-1, 1);
  ctx.drawImage(image, 0, 0, ...Array.prototype.slice.call(arguments, 3));
  ctx.restore();
}

/**
 * Draws a pixel
 *
 * @param {number} x x-coordinate of pixel
 * @param {number} y y-coordinate of pixel
 * @param {string} color color of pixel
 */
function pixel(x, y, color, size) {
  let ctx = _main.C.workingContext;
  if (color) ctx.fillStyle = color;
  if (!size) size = 1 / _main.C.dpr;
  ctx.fillRect(x, y, size, size);
}

/**
 * Loads a image from given url. I
 * @param {string} url url of image
 * @param {Function} [resolver] function to call when image is loaded
 * @param {Function} [fallback] function to call when image fails to loaded
 * @returns {Image} image. This may not be loaded yet.
 */
function loadImage(url, resolver, fallback) {
  var img = new Image(); // Create new img element
  img.src = url;
  if (typeof resolver == "function") {
    img.addEventListener("load", () => resolver(img), false);
  }
  if (typeof fallback == "function") {
    img.addEventListener("error", evt => fallback(evt, img), false);
  }
  return img;
}

/**
 * loads a image from given url and returns a promise.
 * @param {string} url url of image
 * @returns {Promise} promise that resolves to image
 */
function loadImagePromise(url) {
  return new Promise((resolve, reject) => {
    loadImage(url, resolve, reject);
  });
}

},{"../main.js":9}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.C = C;
var _utils = require("./utils.js");
/**
 * Main Function
 *
 * @param {Function} fx codes to exeecute
 * @param {Element|string} [container=document.body] container for the drawings as an element or css selector
 * @param {Object} [cfgs] configurations
 */
function C(fx, container, cfgs = {}) {
  const defaultConfigs = {
    width: 200,
    // width of canvas multiplied by dpr
    height: 200,
    // height of canvas  multiplied by dpr

    dpr: Math.ceil(globalThis.devicePixelRatio || 1),
    // device pixel ratio for clear drawings

    // states
    doFill: true,
    doStroke: true,
    pathStarted: false,
    yAxisInverted: false,
    xAxisInverted: false,
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
    events: {}
  };

  // assign configs
  let configs = (0, _utils.applyDefault)(defaultConfigs, cfgs);
  /** @type {HTMLCanvasElement} */
  let canvas;
  if (typeof container === "string") {
    container = document.querySelector(container);
  } else if (!(container instanceof HTMLElement)) {
    container = document.body;
  }
  // initialize canvas
  let c = container.querySelector("canvas");
  let canvasExists = c && c.id == configs.name;
  if (canvasExists) canvas = c;else canvas = C.makeCanvas(configs);
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
    /** @type {CanvasRenderingContext2D} */
    let crc2d = canvas.getContext("2d");
    (0, _utils.defineProperties)(configs, crc2d);
    canvas.context = crc2d;
    canvas.context.setTransform(configs.dpr, 0, 0, configs.dpr, 0, 0);
    C.workingContext = canvas.context;
    C.workingContext.savedStates = defaultConfigs;
    C.workingContext.delayedAnimations = [];
  }
  // set canvas's id and class to its name
  canvas.id = canvasName;
  canvas.classList.add(canvasName);
  // add canvas to container
  container.appendChild(canvas);
  if (canvasExists) C.workingContext = canvas.context;else prepareCanvas();
  C.contextList[canvasName] = canvas.context;

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
  C.dpr = configs.dpr;
  C.workingCanvas = canvas;
  fx();
}

/**
 * List of available canvases
 * @type {Object}
 */
C.contextList = {};

// C.delayedAnimations = [];

/**
 * Number of canvases
 * @type number
 */
C.nameID = 0;

/**
 * Current working context
 * @type {CanvasRenderingContext2D}
 */
C.workingContext; // index of current working canvas in `C.contextList`

/**
 * Current working canvas
 * @type {HTMLCanvasElement}
 */
C.workingCanvas;

/**
 * device pixel ratio applied to current working canvas.
 ** Note: this property is not explictly defined in C.workingContext because it will get pruned in GCC compilation
 * @type {number}
 */
C.dpr;

/**
 * Default configurations
 */

/**
 * return inner width of container tag
 * @param {HTMLElement} [container=document.body]
 * @returns {number}
 */
C.getWindowWidth = function (container = document.body) {
  const cs = globalThis.getComputedStyle(container);
  return parseInt(cs.width, 10) - parseInt(cs.paddingRight, 10) - parseInt(cs.paddingLeft, 10);
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
  const dpr = configs.dpr || globalThis.devicePixelRatio;
  cvs.style.width = width + "px";
  cvs.style.height = height + "px";
  cvs.width = dpr * width;
  cvs.height = dpr * height;
  cvs.rWidth = width;
  cvs.rHeight = height;
};

/**
 * Returns a canvas element with given params
 *
 * @param {Object} configs
 * @returns {HTMLCanvasElement}
 */
C.makeCanvas = function (configs) {
  const cvs = document.createElement("canvas");
  C.resizeCanvas(cvs, configs);
  return cvs;
};

/**
 * Add extension to globalThis and C extension list
 *
 * @param {Object} extObj
 */
C.addExtension = function (extObj) {
  (0, _utils.defineProperties)(extObj, globalThis);
  (0, _utils.defineProperties)(extObj, C.extensions, false);
};

/**
 * @type {boolean}
 */
C.debugAnimations = false; // whther to debug animations

/**
 * List of extensions
 * @type {Object}
 */
C.extensions = {};

/**
 * Whehter to debug animations
 *
 * @param {boolean} bool boolean
 */
C.debug = function (bool) {
  if (typeof bool !== "boolean") C.debugAnimations = true;else C.debugAnimations = bool;
};

/**
 * Returns the current working canvas or the canvas with given name.
 * With this you can access native JS canvas functions for better performance
 * @param {string} name Name of canvas
 * @returns {CanvasRenderingContext2D} Canvas context
 */
C.getCanvas = function (name) {
  return C.contextList[name] || C.workingContext;
};

/**
 * Log of animations
 * @type {Array<Object>}
 */
C._ANIMATIONLOG_ = [];

/**
 * Set of functions
 * @type {Object}
 */
C.functions = {};
C.COLORLIST = {}; //list of colors

(0, _utils.defineConstant)({
  CENTERX: function () {
    return C.workingCanvas.rWidth / 2;
  },
  CENTERY: function () {
    return C.workingCanvas.rHeight / 2;
  },
  WIDTH: function () {
    return parseInt(C.workingCanvas.rWidth);
  },
  HEIGHT: function () {
    return parseInt(C.workingCanvas.rHeight);
  }
});

// register to globalThis
globalThis.C = C;

},{"./utils.js":17}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gcd = gcd;
exports.gcdArray = gcdArray;
exports.lcm = lcm;
exports.lcmArray = lcmArray;
/** @module Arithmetic-Functions*/
/**
 * Computes GCD (Greatest Common Divisor) or HCF (Highest Common Factor) of two numbers
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function gcd(a, b) {
  while (b != 0) {
    let ra = b;
    b = a % b;
    a = ra;
  }
  return a;
}

/**
 * Returns greatest common divisor of a list of integers.
 *
 * @returns {number}
 */
function gcdArray(list) {
  let array = Array.isArray(list) ? list : arguments,
    n = array[0];
  for (let i = 1; i < array.length; ++i) n = gcd(array[i], n);
  return n;
}

/**
 * Computes LCM (Least Common Multiple) of two numbers
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function lcm(a, b) {
  return a * b / gcd(a, b);
}

/**
 * Returns least common multiple of a list of integers given explictly or as array.
 * @returns {number}
 */
function lcmArray(list) {
  let n = 1,
    array = Array.isArray(list) ? list : arguments;
  for (let i = 0; i < array.length; ++i) n = lcm(array[i], n);
  return n;
}

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sgn = exports.round = exports.random = exports.pow = exports.min = exports.max = exports.log2 = exports.log10 = exports.log = exports.floor = exports.exp = exports.cosh = exports.cos = exports.ceil = exports.cbrt = exports.atan2 = exports.atan = exports.asin = exports.acos = exports.abs = void 0;
exports.sigmoid = sigmoid;
exports.tanh = exports.tan = exports.sqrt = exports.sin = void 0;
const {
  abs,
  acos,
  asin,
  atan,
  atan2,
  cbrt,
  ceil,
  cos,
  cosh,
  exp,
  floor,
  log,
  log2,
  log10,
  max,
  min,
  pow,
  random,
  round,
  sign: sgn,
  sin,
  sqrt,
  tan,
  tanh
} = Math;
exports.tanh = tanh;
exports.tan = tan;
exports.sqrt = sqrt;
exports.sin = sin;
exports.sgn = sgn;
exports.round = round;
exports.random = random;
exports.pow = pow;
exports.min = min;
exports.max = max;
exports.log10 = log10;
exports.log2 = log2;
exports.log = log;
exports.floor = floor;
exports.exp = exp;
exports.cosh = cosh;
exports.cos = cos;
exports.ceil = ceil;
exports.cbrt = cbrt;
exports.atan2 = atan2;
exports.atan = atan;
exports.asin = asin;
exports.acos = acos;
exports.abs = abs;
function sigmoid(t) {
  return 1.0 / (1 + Math.exp(-t));
}

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circleIntersection = circleIntersection;
exports.dist = dist;
exports.extendFromOrigin = extendFromOrigin;
exports.extendFromPoint = extendFromPoint;
exports.lineIntersection = lineIntersection;
exports.rotateAroundOrigin = rotateAroundOrigin;
exports.rotateAroundPoint = rotateAroundPoint;
/** @module Point-Utils*/
/**
 * return distance between two points
 *
 * @param {number[]} p1
 * @param {number[]} p2
 * @returns {number} distance between p1 and p2
 */
function dist(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

/**
 * Returns a point rotated around a point by certain angle, exetened by a certain length
 *
 * @param {number|number[]} x center x or center as array of coords [x, y]
 * @param {number} y center y
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {number[]} array of two points
 */
function rotateAroundPoint(x, y, angle, len = 10) {
  if (Array.isArray(x) && x.length === 2) {
    y = x[1];
    x = x[0];
  }
  return [Math.cos(angle) * len + x, Math.sin(angle) * len + y];
}

/**
 * Returns a point rotated around origin by certain angle, exetened by a certain length
 *
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {number[]} array of two points
 */
function rotateAroundOrigin(angle, len = 10) {
  return rotateAroundPoint(0, 0, angle, len);
}

/**
 * Returns the point of intersection of two lines.
 *
 * @param {number[]} p1 start point of first line as [x, y]
 * @param {number[]} p2 end point of first line as [x, y]
 * @param {number[]} p3 start point of second line as [x, y]
 * @param {number[]} p4 end point of second line as [x, y]
 * @return {number[]|Iterable} intersection point of lines as [x, y]
 */
function lineIntersection(p1, p2, p3, p4) {
  const m1 = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  const m2 = (p4[1] - p3[1]) / (p4[0] - p3[0]);
  const c1 = p1[1] - p1[0] * m1;
  const c2 = p3[1] - p3[0] * m2;
  const x = (c2 - c1) / (m1 - m2);
  const y = m1 * x + c1;
  return [x, y];
}

/**
 * Finds intersection of two circles.
 * Adapted from {@link https://stackoverflow.com/a/14146166}
 *
 * @param {number[]} c1 center of first circle as [x, y]
 * @param {number} r1 radius of first circle
 * @param {number[]} c2 center of second circle as [x, y]
 * @param {number} r2 radius of second circle
 * @return {number[][]} array of two points as [x, y]
 */
function circleIntersection(c1, r1, c2, r2) {
  const d = dist(c1, c2);
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(r1 * r1 - a * a);
  const s = a / d;
  const p2 = [(c2[0] - c1[0]) * s + c1[0], (c2[1] - c1[1]) * s + c1[1]];
  return [[p2[0] + h * (c2[1] - c1[1]) / d, p2[1] - h * (c2[0] - c1[0]) / d], [p2[0] - h * (c2[1] - c1[1]) / d, p2[1] + h * (c2[0] - c1[0]) / d]];
}

/**
 * Extend a point by given length from a given center
 * @param {number[]} center center from the point to be extended
 * @param {number[]} point point to be extended
 * @param {number} len length to extend the point
 * @returns {number[]}
 */
function extendFromPoint(center, point, len = 10) {
  let dx = point[0] - center[0],
    dy = point[1] - center[1],
    angle = Math.atan2(dy, dx),
    distance = Math.sqrt(dx * dx + dy * dy) + len; // total extended length
  return [center[0] + Math.cos(angle) * distance, center[1] + Math.sin(angle) * distance];
}

/**
 * Extend a point by given length from origin (0, 0)
 * @param {number[]} point point to be extended
 * @param {number} len length to extend the point
 * @returns {number[]}
 */
function extendFromOrigin(point, len = 10) {
  return extendFromPoint([0, 0], point, len);
}

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomInt = randomInt;
/** @module Random-Functions*/
/**
 * Returns a random integer between given range.
 *
 * @param {number} [max=10] maximum range
 * @param {number} [min=0] minimum range
 * @returns {number}
 */
function randomInt(max = 10, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.angle = angle;
exports.annulus = annulus;
exports.annulusSector = annulusSector;
exports.arc = arc;
exports.arcBetweenPoints = arcBetweenPoints;
exports.bezier = bezier;
exports.circle = circle;
exports.circularSegment = circularSegment;
exports.ellipse = ellipse;
exports.equiTriangle = equiTriangle;
exports.getBezierControlPoints = getBezierControlPoints;
exports.line = line;
exports.point = point;
exports.polygon = polygon;
exports.quad = quad;
exports.quadraticCurve = quadraticCurve;
exports.rect = rect;
exports.regularPolygon = regularPolygon;
exports.regularPolygonWithRadius = regularPolygonWithRadius;
exports.sector = sector;
exports.smoothCurveThroughPoints = smoothCurveThroughPoints;
exports.smoothCurveThroughPointsTo = smoothCurveThroughPointsTo;
exports.square = square;
exports.triangle = triangle;
var _main = require("../main.js");
var _points = require("../math/points.js");
var _utils = require("../utils.js");
/**
 * Functions for drawing various shapes
 * @module Geometric-Shapes
 */

/**
 * Adds a circular arc to the current shape if {@link startShape} was called.
 * If not it will draw a new arc.
 *
 * @param {number} x The x-axis coordinate of the arc's center.
 * @param {number} y The y-axis coordinate of the arc's center.
 * @param {number} r arc's radius (must be positive)
 * @param {number} [angle=PI/2] central angle (use negative values to rotate arc clockwise)
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */
function arc(x, y, r, angle = Math.PI / 2, startAngle = 0) {
  let ctx = _main.C.workingContext;
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.arc(x, y, r, startAngle, startAngle + angle);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Draws a point with given size in pixels
 *
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} [size=10] diameter of point in px
 * @param {boolean} [doStroke=false] whether to stroke or not
 */
function point(x, y, size = 10, doStroke = false) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
  if (doStroke) ctx.stroke();
  ctx.closePath();
}

/**
 * Draws a circular segment.
 *
 * @param {number} x x-axis coordinate of center of circular sector
 * @param {number} y y-axis coordinate of center of circular sector
 * @param {number} r radius of the circular sector
 * @param {number} [angle=PI/2] central angle
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */
function circularSegment(x, y, r, angle = Math.PI / 2, startAngle = 0) {
  let ctx = _main.C.workingContext;
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.arc(x, y, r, startAngle, startAngle + angle);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Draws circle
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} r radius
 */
function circle(x, y, r) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
}

/**
 * Adds an elliptical arc to the current shape if {@link startShape} was called.
 * If not it will draw a new ellipse.
 *
 * @param {number} x x-axis coordinate of ellipse's center
 * @param {number} y y-axis coordinate of ellipse's center
 * @param {number} radius1 ellipse's major-axis radius. Must be non-negative.
 * @param {number} radius2 ellipse's minor-axis radius. Must be non-negative.
 * @param {number} [rotation=0] The rotation of the ellipse, expressed in radians.
 * @param {number} [startAngle=0] The angle at which the ellipse starts, measured clockwise from the positive x-axis and expressed in radians.
 * @param {number} [angle=6.28318530717958] central angle of ellipse. Use negative values to rotate it anticlockwise
 */
function ellipse(x, y, radius1, radius2, rotation = 0, startAngle = 0, angle = Math.PI * 2) {
  let ctx = _main.C.workingContext;
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.ellipse(x, y, radius1, radius2, rotation, startAngle, startAngle + angle);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Adds a bézie curve to current shape if {@link startShape} was called.
 * If not it will draw a new bézie curve.
 *
 * @param {number} cpx1 x-axis coord of first control point
 * @param {number} cpy1 y-axis coord of first control point
 * @param {number} cpx2 x-axis coord of second control point
 * @param {number} cpy2 y-axis coord of second control point
 * @param {number} x3 x-axis coord of the end point
 * @param {number} y3 y-axis coord of the end point
 */
function bezier(cpx1, cpy1, cpx2, cpy2, x3, y3) {
  let ctx = _main.C.workingContext,
    pathStarted = ctx.pathStarted;
  if (!pathStarted) ctx.beginPath();
  ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x3, y3);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Draws a sector
 *
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} radius radius of sector
 * @param {number} [angle=PI/2] central angle (use negative angle to move sector clockwise)
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */
function sector(x, y, radius, angle = Math.PI / 2, startAngle = 0) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, radius, startAngle, startAngle + angle);
  ctx.lineTo(x, y);
  (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Returns bēzier control points that passes smoothly through given points.
 *
 * @param {number[]} recentPoint previous point
 * @param {number[]} currentPoint
 * @param {number[]} nextPoint
 * @param {number[]} secondNextPoint
 * @param {number} [tension=1]
 * @return {number[]} two control points as [cp1x, cp1y, cp2x, cp2y]
 */
function getBezierControlPoints(recentPoint, currentPoint, nextPoint, secondNextPoint, tension = 1) {
  return [currentPoint[0] + (nextPoint[0] - recentPoint[0]) / 6 * tension, currentPoint[1] + (nextPoint[1] - recentPoint[1]) / 6 * tension, nextPoint[0] - (secondNextPoint[0] - currentPoint[0]) / 6 * tension, nextPoint[1] - (secondNextPoint[1] - currentPoint[1]) / 6 * tension];
}

/**
 * Adds a smooth curve passing through given points and tension using bézie curve to the current shape.
 * Taken from {@link https://stackoverflow.com/a/49371349}
 *
 * @param {number[][]} points array of points as [x, y]
 * @param {number} tension tension of the curve
 */
function smoothCurveThroughPointsTo(points, tension = 1, closed = true, offset = 0) {
  for (let i = 0; i < points.length - 1 - offset; i++) {
    let recentPoint = i != 0 ? points[i - 1] : points[0],
      currentPoint = points[i],
      nextPoint = points[i + 1],
      secondNextPoint = i != points.length - 2 ? points[i + 2] : closed ? points[1] : nextPoint,
      cp = getBezierControlPoints(recentPoint, currentPoint, nextPoint, secondNextPoint, tension);
    _main.C.workingContext.bezierCurveTo(cp[0], cp[1], cp[2], cp[3], nextPoint[0], nextPoint[1]);
  }
}

/**
 * Draws smooth curve passing through given points and tension using bézie curve.
 *
 * @param {number[][]} points array of points as [x, y]
 * @param {number} tension tension of the curve
 */
function smoothCurveThroughPoints(points, tension = 1, closed = true, offset = 0) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  smoothCurveThroughPointsTo(points, tension, closed, offset);
  if (ctx.doFill && closed) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}

/**
 * Adds a new quadratic curve to the current shape if the length of arguments is 4.
 * In that case
 * * 1st argument is x coordinate of the control point
 * * 2nd argument is y coordinate of the control point
 * * 3rd argument is x coordinate of the ending point
 * * 4th argument is y coordinate of the ending point
 *
 * If length of arguments is 6, it will draw a new curve.
 * * In that case
 * * 1st argument is x coordinate of starting point
 * * 2nd argument is y coordinate of starting point
 * * 3rd argument is x coordinate of the control point
 * * 4th argument is y coordinate of the control point
 * * 5th argument is x coordinate of the ending point
 * * 6th argument is y coordinate of the ending point
 * @global
 */
function quadraticCurve() {
  let ctx = _main.C.workingContext,
    args = arguments;
  if (args.length == 4) {
    ctx.quadraticCurveTo(args[0], args[1], args[2], args[3]);
  } else if (args.length == 6) {
    ctx.beginPath();
    ctx.moveTo(args[0], args[1]);
    ctx.quadraticCurveTo(args[2], args[3], args[4], args[5]);
    (0, _utils.doFillAndStroke)(ctx);
  }
}

/**
 * Draws a annulus (circle with hole in it).
 *
 * @param {number} x x-axis coord of center of the annulus.
 * @param {number} y y-axis coord of center of the annulus.
 * @param {number} innerRadius radius of the inner circle
 * @param {number} outerRadius radius of the outer circle
 */
function annulus(x, y, innerRadius, outerRadius) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.arc(x, y, innerRadius, 0, 2 * Math.PI, false);
  ctx.moveTo(outerRadius, 0);
  ctx.arc(x, y, outerRadius, 0, 2 * Math.PI, true);
  (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Draws a annulus sector.
 *
 * @param {number} x x-axis coord of center of the annulus sector.
 * @param {number} y y-axis coord of center of the annulus sector.
 * @param {number} innerRadius radius of the inner circle
 * @param {number} outerRadius radius of the outer circle
 * @param {number} angle central angle of the annulus sector
 * @param {number} startAngle The angle at which the sector starts in radians, measured from the positive x-axis.
 */
function annulusSector(x, y, innerRadius, outerRadius, angle, startAngle) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.arc(x, y, innerRadius, startAngle, startAngle + angle, false);
  ctx.arc(x, y, outerRadius, startAngle + angle, startAngle, true);
  (0, _utils.doFillAndStroke)(ctx);
}

/**
 * Angle between two lines. And returns the coordinate of middle of angle
 *
 * @param {number[]} p1 start point of first line array of point as [x, y]
 * @param {number[]} p2 end point of first line array of point as [x, y]
 * @param {number[]} p3 start point of second line array of point as [x, y]
 * @param {number[]} p4 end point of second line array of point as [x, y]
 * @param {number} radius radius of angle
 * @param {number} extender extender of output point
 * @param {boolean} otherAngle whether to draw the other angle
 * @param {number} angleDir there can be four angle in a line intersection. Choose a number from 1 to 4.
 * @returns {Object} coordinate of point in the middle of angle as array of point as [x, y] and angle between them
 */
function angle(p1, p2, p3, p4, radius = 20, extender = 10, otherAngle = false, angleDir = 1) {
  let p = (0, _points.lineIntersection)(p1, p2, p3, p4),
    x = p[0],
    y = p[1],
    info = {};
  if (!(isNaN(x) || isNaN(y))) {
    let ang,
      startAngle,
      a1 = Math.atan2(p1[1] - y, p1[0] - x),
      a2 = Math.atan2(p2[1] - y, p2[0] - x),
      a3 = Math.atan2(p3[1] - y, p3[0] - x),
      a4 = Math.atan2(p4[1] - y, p4[0] - x),
      angleDirs = {
        1: [a2, a4],
        2: [a4, a1],
        3: [a1, a3],
        4: [a3, a2]
      },
      dir = angleDirs[angleDir],
      ctx = _main.C.workingContext;
    if (otherAngle) {
      startAngle = dir[1];
      ang = dir[0] - dir[1];
    } else {
      startAngle = dir[0];
      ang = dir[1] - dir[0];
    }
    if (ctx.doFill) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, startAngle, ang + startAngle);
      ctx.fill();
      ctx.closePath();
    }
    if (ctx.doStroke) {
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, ang + startAngle);
      ctx.stroke();
      ctx.closePath();
    }
    info = {
      center: [x + (radius + extender) * Math.cos(startAngle + ang / 2), y + (radius + extender) * Math.sin(startAngle + ang / 2)],
      ang: ang
    };
  } else {
    throw new Error("No intersection point");
  }
  return info;
}

/**
 * Creates a circular arc using the given control points and radius.
 * If a current path started it will add this to the end of path.
 * Returns the center of arc.
 *
 * @param {number} x1 x-coord of first point
 * @param {number} y1 y-coord of first point
 * @param {number} x2 x-coord of second point
 * @param {number} y2 y-coord of second point
 * @param {number} radius radius of arc
 * @param {boolean} otherArc specifies whether to use other arc of the circle.
 * @returns {number[]} returns the coordinate of center of the arc as [x, y]
 */
function arcBetweenPoints(x1, y1, x2, y2, radius, otherArc = false) {
  if (x1 == x2 && y1 == y2)
    // TODO: should it be `throw Error()`?
    console.error("Can't draw a arc between points. Given points are exactly same");
  let center = (0, _points.circleIntersection)([x1, y1], radius, [x2, y2], radius)[0],
    ctx = _main.C.workingContext,
    angleFromXAxis = Math.atan2(y1 - center[1], x1 - center[0]),
    centralAngle = Math.atan2(y2 - center[1], x2 - center[0]) - angleFromXAxis;
  if (!ctx.pathStarted) {
    ctx.save();
    ctx.beginPath();
  }
  ctx.arc(center[0], center[1], radius, angleFromXAxis, centralAngle + angleFromXAxis, !otherArc);
  if (!ctx.pathStarted) {
    (0, _utils.doFillAndStroke)(ctx);
    ctx.restore();
  }
  return center;
}

/**
 * Draws a line
 *
 * @param {number} x1 start x coord
 * @param {number} y1 start y coord
 * @param {number} x2 end x coord
 * @param {number} y2 end y coord
 */
function line(x1, y1, x2, y2) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

/**
 * Draws a rectangle
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} width width
 * @param {number} height height
 */
function rect(x, y, width, height) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}

/**
 * Draws polygon with given points
 * @example
 * ```
 * polygon(
 * 	[0, 0], // first point
 * 	[100, 200], // second point
 * 	[130, 230], // third point
 * 	//...
 * )
 * ```
 */
function polygon() {
  let args = arguments;
  if (args.length > 2) {
    let ctx = _main.C.workingContext,
      start = args[0];
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    for (let i = 1; i < args.length; i++) {
      ctx.lineTo(args[i][0], args[i][1]);
    }
    ctx.lineTo(start[0], start[1]);
    if (ctx.doFill) ctx.fill();
    if (ctx.doStroke) ctx.stroke();
    ctx.closePath();
  }
}

/**
 * Draws square
 *
 * @param {number} x x-coord
 * @param {number} y x-coord
 * @param {number} sideLength
 */
function square(x, y, sideLength) {
  rect(x, y, sideLength, sideLength);
}

/**
 * Draws quadrilateral with four points as array of coordinate as [x, y]
 *
 * @param {number[]} p1 1st point
 * @param {number[]} p2 2nd point
 * @param {number[]} p3 3rd point
 * @param {number[]} p4 4th point
 */
function quad(p1, p2, p3, p4) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.lineTo(p3[0], p3[1]);
  ctx.lineTo(p4[0], p4[1]);
  ctx.lineTo(p1[0], p1[1]);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}

/**
 * Draws triangle with three points as array of coordinate as [x, y]
 *
 * @param {number[]} p1 first point
 * @param {number[]} p2 second point
 * @param {number[]} p3 third point
 */
function triangle(p1, p2, p3) {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.lineTo(p3[0], p3[1]);
  ctx.lineTo(p1[0], p1[1]);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}

/**
 * Draws equilateral triangle
 *
 * @param {number} x
 * @param {number} y
 * @param {number} sideLength length of side
 * @param {number} [rotation=0] amound to rotate the entire triangle
 */
function equiTriangle(x, y, sideLength, rotation = 0) {
  regularPolygon(x, y, 3, sideLength, rotation);
}

/**
 * Draws a regular polygon with centre position number of sides length of a side and rotation
 *
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} sides number of sides
 * @param {number} sideLength length of a side
 * @param {number} [rotation=0] amound to rotate the entire polygon
 */
function regularPolygon(x, y, sides, sideLength, rotation = 0) {
  let radius = sideLength / (2 * Math.sin(Math.PI / sides)); // finds ex-radius
  regularPolygonWithRadius(x, y, sides, radius, rotation);
}

/**
 * Draws a regular polygon that is inside a circle
 *
 * @param {number} x x coord
 * @param {number} y y coord
 * @param {number} sides number of sides
 * @param {number} radius radius
 * @param {number} [rotation=0] amound to rotate the entire polygon
 */
function regularPolygonWithRadius(x, y, sides, radius, rotation = 0) {
  let i = 0,
    e = Math.PI * 2 / sides,
    ctx = _main.C.workingContext;
  rotation += e / 2;
  let initial = [Math.cos(rotation) * radius + x, Math.sin(rotation) * radius + y];
  ctx.beginPath();
  ctx.moveTo(initial[0], initial[1]);
  while (i++ < sides) {
    ctx.lineTo(Math.cos(i * e + rotation) * radius + x, Math.sin(i * e + rotation) * radius + y);
  }
  ctx.lineTo(initial[0], initial[1]);
  ctx.closePath();
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
}

},{"../main.js":9,"../math/points.js":12,"../utils.js":17}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillText = fillText;
exports.strokeText = strokeText;
exports.text = text;
var _main = require("../main.js");
/**
 * This module contains functions for drawing different types of text.
 * @module text
 */

/**
 * Draws a filled & stroked text
 *
 * @param {string} text text to draw
 * @param {number} [x=0] x-coord
 * @param {number} [y=0] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function text(text, x = 0, y = 0, maxwidth = undefined) {
  let ctx = _main.C.workingContext;
  // if axes are inverted through invert* function reverse it
  ctx.save();
  ctx.translate(x, y);
  if (ctx.yAxisInverted) ctx.scale(1, -1);
  if (ctx.xAxisInverted) ctx.scale(-1, 1);
  if (ctx.doFill) ctx.fillText(text, 0, 0, maxwidth);else if (ctx.doStroke) ctx.strokeText(text, 0, 0, maxwidth);
  ctx.restore();
}

/**
 * Draws a text without border
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function fillText(text, x = 0, y = 0, maxwidth = undefined) {
  let ctx = _main.C.workingContext;
  ctx.save();
  ctx.translate(x, y);
  if (ctx.yAxisInverted) ctx.scale(1, -1);
  if (ctx.xAxisInverted) ctx.scale(-1, 1);
  ctx.fillText(text, 0, 0, maxwidth);
  ctx.restore();
}

/**
 * Draws a stroked text
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function strokeText(text, x = 0, y = 0, maxwidth = undefined) {
  let ctx = _main.C.workingContext;
  ctx.save();
  ctx.translate(x, y);
  if (ctx.yAxisInverted) ctx.scale(1, -1);
  if (ctx.xAxisInverted) ctx.scale(-1, 1);
  ctx.strokeText(text, 0, 0, maxwidth);
  ctx.restore();
}

},{"../main.js":9}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.background = background;
exports.clear = clear;
exports.cssBackground = cssBackground;
exports.endShape = endShape;
exports.fill = fill;
exports.fontFamily = fontFamily;
exports.fontSize = fontSize;
exports.fontStretch = fontStretch;
exports.fontStyle = fontStyle;
exports.fontVariant = fontVariant;
exports.fontWeight = fontWeight;
exports.getCanvasData = getCanvasData;
exports.getContextStates = getContextStates;
exports.getFont = getFont;
exports.invertXAxis = invertXAxis;
exports.invertYAxis = invertYAxis;
exports.lineCap = lineCap;
exports.lineDash = lineDash;
exports.lineHeight = lineHeight;
exports.lineJoin = lineJoin;
exports.lineTo = lineTo;
exports.loop = loop;
exports.measureText = measureText;
exports.moveTo = moveTo;
exports.noFill = noFill;
exports.noLoop = noLoop;
exports.noStroke = noStroke;
exports.putImageData = putImageData;
exports.rest = rest;
exports.restore = restore;
exports.rotate = rotate;
exports.save = save;
exports.saveCanvas = saveCanvas;
exports.scale = scale;
exports.setImageSmoothing = setImageSmoothing;
exports.startShape = startShape;
exports.stroke = stroke;
exports.strokeWidth = strokeWidth;
exports.textAlign = textAlign;
exports.textBaseline = textBaseline;
exports.transform = transform;
exports.translate = translate;
var _color_reader = require("./color/color_reader.js");
var _main = require("./main.js");
var _utils = require("./utils.js");
/** @module Settings */

// for debugging
let counter = {
    loop: 1
  },
  logStyles = {
    number: "color: #9afcad;",
    keyword: "color: #adacdf;",
    running: "color: yellow;",
    delayed: "color: orange;",
    finished: "color: #3aff5f;"
  };
/**
 * Begins a new shape at the point specified by the given (x, y) coordinates.
 *
 * @param {number} x
 * @param {number} y
 */
function moveTo(x, y) {
  _main.C.workingContext.moveTo(x, y);
}

/**
 * Adda a straight line to the current shape by connecting the shape's last point to the specified (x, y) coordinates.
 *
 * @param {number} x
 * @param {number} y
 */
function lineTo(x, y) {
  _main.C.workingContext.lineTo(x, y);
}

/**
 * Sets background to a given value
 *
 * Accepted values:
 * * a hex string (#fff, #acf2dc)
 * * a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * a array of numbers ([0, 244, 34])
 * @param {...number} color
 */
function background(...color) {
  let col = (0, _color_reader.readColor)(color).hex8,
    ctx = _main.C.workingContext;
  ctx.background = col;
  ctx.save();
  rest();
  ctx.fillStyle = col;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

/**
 * Erases the pixels in a rectangular area by setting them to transparent black.
 * TODO: explain the process
 * @param {number} [x = 0] x-axis coordinate of the rectangle's starting point.
 * @param {number} [y = 0] y-axis coordinate of the rectangle's starting point.
 * @param {number} [width = C.workingContext.width] Rectangle's width. Positive values are to the right, and negative values to the left.
 * @param {number} [height = C.workingContext.height] Rectangle's height. positive values are down, and negative are up.
 */
function clear(x, y, width, height) {
  let ctx = _main.C.workingContext,
    d = _main.C.dpr;
  x = x || 0;
  y = y || 0;
  width = width || ctx.canvas.width;
  height = height || ctx.canvas.height;
  ctx.save();
  ctx.setTransform(d, 0, 0, d, 0, 0);
  ctx.clearRect(x, y, width, height);
  ctx.restore();
}

/**
 * sets the given image data as css background. If not given it will set current canvas drawing as the background
 * @param {string} [data] image data
 */
function cssBackground(data) {
  if (typeof data != "string") data = getCanvasData();
  let canvasStyle = _main.C.workingContext.canvas.style;
  canvasStyle.background = "url('" + data + "')";
  canvasStyle.backgroundPosition = "center";
  canvasStyle.backgroundSize = "cover";
}

/**
 * If Some arguments are given: Resets the current transformation to the identity matrix,
 * and then invokes a transformation described by given arguments.
 * Lets you scale, rotate, translate (move), and skew the canvas.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform} for more info
 * If no Arguments are given: returns current transformation
 *
 * @param {number|DOMMatrix} [a] Horizontal scaling. A value of 1 results in no scaling.
 * @param {number} [b] Vertical skewing
 * @param {number} [c] Horizontal skewing
 * @param {number} [d] Vertical scaling. A value of 1 results in no scaling
 * @param {number} [e] Horizontal translation
 * @param {number} [f] Vertical translation
 */
function transform(a, b, c, d, e, f) {
  let ctx = _main.C.workingContext;
  if (a == undefined || a == null) {
    return _main.C.workingContext.getTransform();
  } else if (a instanceof DOMMatrix) {
    ctx.setTransform(a.a, a.b, a.c, a.d, a.e, a.f);
  } else {
    ctx.setTransform(a || 0, b || 0, c || 0, d || 0, e || 0, f || 0);
  }

  // scale to fit width
  ctx.scale(_main.C.dpr, _main.C.dpr);
}

/**
 * Prevent filling inside shapes
 *
 */
function noFill() {
  _main.C.workingContext.doFill = false;
}

/**
 * Prevent drawing strokes of shapes
 *
 */
function noStroke() {
  _main.C.workingContext.doStroke = false;
}

/**
 * Translates (moves) canvas to a position
 *
 * @param {number} x amound to translate along x-axis
 * @param {number} [y=0] amound to translate along y-axis
 */
function translate(x, y = 0) {
  _main.C.workingContext.translate(x, y);
}

/**
 * Sets whether to enable image smoothening
 *
 * @param {boolean} bool
 */
function setImageSmoothing(bool) {
  _main.C.workingContext.imageSmoothingEnabled = !!bool;
}

/**
 * Sets the stroke width (line width/line thickness)
 *
 * @param {number} w
 */
function strokeWidth(w) {
  _main.C.workingContext.lineWidth = Number(w);
}

/**
 * Scales the canvas by a given amount
 *
 * @param {number} x Scaling factor in the horizontal direction. A negative value flips pixels across
 *  the vertical axis. A value of 1 results in no horizontal scaling.
 * @param {number} [y=x] Scaling factor in the vertical direction. A negative value flips pixels across
 *  the horizontal axis. A value of 1 results in no vertical scaling.
 */
function scale(x, y = x) {
  _main.C.workingContext.scale(x, y);
}

/**
 * inverts y-Axis
 */
function invertYAxis() {
  _main.C.workingContext.scale(1, -1);
  _main.C.workingContext.yAxisInverted = true;
}

/**
 * inverts x-Axis
 */
function invertXAxis() {
  _main.C.workingContext.scale(-1, 1);
  _main.C.workingContext.xAxisInverted = true;
}

/**
 * Rotates the canvas
 *
 * @param {number} angle The rotation angle, clockwise in radians. You can use degree * DEG to calculate a radian from a degree.
 */
function rotate(angle) {
  let ctx = _main.C.workingContext;
  ctx.rotate(angle);
  ctx.netRotation = (ctx.netRotation + angle) % Math.PI * 2;
}

/**
 * Saves the current state of canvas

 */
function save() {
  _main.C.workingContext.savedStates = getContextStates();
  _main.C.workingContext.save();
}

/**
 * Set the type of line end
 * Options: butt, round, square
 *
 * @param {string} capType
 */
function lineCap(capType) {
  _main.C.workingContext.lineCap = capType;
}

/**
 * Sets type of line joining
 * Options: BEVEL, ROUND, MITER
 *
 * @param {string} joinType
 */
function lineJoin(joinType) {
  _main.C.workingContext.lineJoin = joinType;
}

/**
 * Restore the saved state of canvas
 *
 */
function restore() {
  (0, _utils.defineProperties)(_main.C.workingContext.savedStates, _main.C.workingContext);
  _main.C.workingContext.restore();
}

/**
 * Reset the applied transform to idendity matrix and scales canvas by dpr
 *
 */
function rest() {
  let ctx = _main.C.workingContext;
  ctx.setTransform(_main.C.dpr, 0, 0, _main.C.dpr, 0, 0);
}

/**
 * Sets stroke color to a given value if value is given
 * else strokes the previous shape
 *
 * Accepted values:
 * * hex string (#fff, #acf2dc)
 * * number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * array of numbers ([0, 244, 34]). This gets converted into css color by the colorMode property
 */
function stroke(...color) {
  let ctx = _main.C.workingContext;
  if (arguments.length > 0) {
    ctx.strokeStyle = (0, _color_reader.readColor)(color).hex8;
    ctx.doStroke = true;
  } else {
    ctx.stroke();
  }
}

/**
 * Sets fill color to a given value if value is given
 * else fills the previous shape
 *
 * Accepted values:
 * * a hex string (#fff, #acf2dc)
 * * a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * a array of numbers ([0, 244, 34]). This gets converted into css color by the colorMode property
 */
function fill(...color) {
  let ctx = _main.C.workingContext;
  if (arguments.length !== 0) {
    ctx.fillStyle = (0, _color_reader.readColor)(color).hex8;
    ctx.doFill = true;
  } else {
    ctx.fill();
  }
}

/**
 * Returns variables in workingCanvas or given canvas
 *
 * @param {string} [canvasName] id of canvas to get the data.
 * @returns {Object}
 */
function getContextStates(canvasName) {
  let ctx = _main.C.contextList[canvasName] || _main.C.workingContext;
  return {
    background: ctx.background,
    colorMode: ctx.colorMode,
    strokeStyle: ctx.strokeStyle,
    fillStyle: ctx.fillStyle,
    lineWidth: ctx.lineWidth,
    doStroke: ctx.doStroke,
    doFill: ctx.doFill,
    pathStarted: ctx.pathStarted,
    yAxisInverted: ctx.yAxisInverted,
    xAxisInverted: ctx.xAxisInverted,
    netRotation: ctx.netRotation,
    fontStyle: ctx.fontStyle,
    fontVariant: ctx.fontVariant,
    fontWeight: ctx.fontWeight,
    fontStretch: ctx.fontStretch,
    fontSize: ctx.fontSize,
    lineHeight: ctx.lineHeight,
    fontFamily: ctx.fontFamily,
    font: ctx.font,
    textAlign: ctx.textAlign,
    textBaseline: ctx.textBaseline,
    events: ctx.events
  };
}

/**
 * Starts a new loop
 * ! Currently in progress with asynchronous animations.
 * @param {Function} functionToRun function which contains code to run
 * @param {string} canvasName name of canvas. It must be unique if you're running multiple animation at once
 * @param {number} timeDelay time delay between 2 frames. If given loop will execute with setInterval function.
 *  If not provided the loop will be run with requestAnimationFrame (this keeps a consistant frame rate between 40 to 50 FPS).
 * @param {number} [timeDelaysToRemember=10] number of time delays to remember.
 */
function loop(name, functionToRun, canvasName, timeDelay, timeDelaysToRemember = 100, settings = {}, dur) {
  let ctx;

  // if name isn't given it will shift the arguments to right
  if (typeof name == "function") {
    // shift arguments
    name = counter.loop++;
    functionToRun = arguments[0];
    canvasName = arguments[1];
    timeDelay = arguments[2];
    settings = arguments[3];
    dur = arguments[4];
  }
  if (!canvasName) {
    ctx = _main.C.workingContext;
    canvasName = ctx.name;
  } else ctx = _main.C.contextList[canvasName];
  ctx.timeDelayList = [];
  ctx.totalTimeCaptured = 0;
  let assignedSettings = Object.assign(getContextStates(canvasName) || {}, settings);
  // debugger;
  if (ctx.currentLoop != undefined) {
    // already a animation is running
    if (_main.C.debugAnimations) {
      console.log(canvasName + ": " + name + " %cdelayed", logStyles.delayed);
      _main.C._ANIMATIONLOG_.push({
        canvas: ctx,
        animationName: name,
        state: "delayed",
        settings: assignedSettings
      });
    }
    ctx.delayedAnimations.push({
      name: name,
      settings: assignedSettings,
      functionToRun: functionToRun,
      canvasName: canvasName,
      timeDelay: timeDelay,
      timeDelaysToRemember: timeDelaysToRemember,
      dur: dur
    });
  } else {
    if (_main.C.debugAnimations) {
      let toLog = `${canvasName}: ${name} %crunning`,
        styles = [logStyles.running];
      if (dur != undefined) {
        toLog += `%c for %c${dur}ms`;
        styles.push(logStyles.keyword, logStyles.number);
      }
      _main.C._ANIMATIONLOG_.push({
        canvas: ctx,
        animationName: name,
        state: "running",
        settings: assignedSettings,
        dur: dur
      });
      console.log(toLog, ...styles);
    }
    ctx.recentTimeStamp = performance.now();
    ctx.timeStart = performance.now();
    if (!isNaN(timeDelay)) {
      ctx.currentLoopName = name;
      ctx.currentLoop = setInterval(function () {
        _main.C.workingContext = ctx;
        let S = getContextStates(canvasName);
        (0, _utils.defineProperties)(assignedSettings, _main.C.workingContext);
        functionToRun(performance.now() - ctx.timeStart, getFPS());
        (0, _utils.defineProperties)(S, _main.C.workingContext);
      }, timeDelay);
    } else {
      run();
    }
  }
  function run() {
    ctx.currentLoop = globalThis.requestAnimationFrame(run);
    _main.C.workingContext = ctx;
    let S = getContextStates(canvasName);
    if (settings) (0, _utils.defineProperties)(assignedSettings, _main.C.workingContext);
    functionToRun(performance.now() - ctx.timeStart, getFPS());
    if (settings) (0, _utils.defineProperties)(S, _main.C.workingContext);
  }
  function getFPS() {
    let now = performance.now(),
      timeDelay = now - ctx.recentTimeStamp; // time delays between frames
    ctx.recentTimeStamp = now;
    ctx.timeDelayList.push(timeDelay);
    ctx.totalTimeCaptured += timeDelay;
    if (ctx.timeDelayList.length > timeDelaysToRemember) ctx.totalTimeCaptured -= ctx.timeDelayList.shift();
    return ctx.timeDelayList.length / (ctx.totalTimeCaptured / 1000);
  }
}

/**
 * Stops current loop
 *
 * @param {string} [canvasName] name of the canvas given to {@link loop}
 * @param {number} [time] time of execution. Used for debugging
 */
function noLoop(canvasName, time) {
  let ctx = _main.C.workingContext;
  if (!canvasName) canvasName = ctx.name;else ctx = _main.C.contextList[canvasName];
  clearInterval(ctx.currentLoop);
  globalThis.cancelAnimationFrame(ctx.currentLoop);
  ctx.currentLoop = undefined;
  if (_main.C.debugAnimations) {
    let toLog = `${canvasName}: ${ctx.currentLoopName} %cfinished`,
      formatter = [logStyles.finished];
    if (time != undefined) {
      toLog += `%c in %c${time.toFixed(3)}ms`;
      formatter.push(logStyles.keyword, logStyles.number);
    }
    console.log(toLog, ...formatter);
    _main.C._ANIMATIONLOG_.push({
      canvas: ctx,
      animationName: ctx.currentLoopName,
      state: "finished",
      endTime: time
    });
  }
  if (ctx.delayedAnimations.length > 0) {
    let toWork = ctx.delayedAnimations.shift();
    loop(toWork.name, toWork.functionToRun, toWork.canvasName, toWork.timeDelay, toWork.timeDelaysToRememberm, toWork.settings, toWork.dur);
  }
}

/**
 * Starts a new Path
 *
 */
function startShape() {
  let ctx = _main.C.workingContext;
  ctx.beginPath();
  ctx.pathStarted = true;
}

/**
 * Ends current Path
 *
 */
function endShape() {
  let ctx = _main.C.workingContext;
  ctx.closePath();
  ctx.pathStarted = false;
}

/**
 * Return current font
 *
 * @param {boolean} detailed wheather to return a detailed font property
 * @returns {string}
 */
function getFont(detailed = false) {
  let ctx = _main.C.workingContext;
  if (detailed) {
    let {
      fontStyle,
      fontVariant,
      fontWeight,
      fontStretch,
      fontSize,
      lineHeight,
      fontFamily
    } = ctx;
    return `${fontStyle} ${fontVariant} ${fontWeight} ${fontStretch} ${fontSize}/${lineHeight} ${fontFamily}`;
  } else {
    return ctx.font;
  }
}

/**
 * Returns text metrics
 *
 * @param {string} text
 * @returns {TextMetrics}
 */
function measureText(text) {
  return _main.C.workingContext.measureText(text);
}

/**
 * Sets font size
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font} for more info.
 * @param {number|string} size
 */
function fontSize(size) {
  let ctx = _main.C.workingContext;
  size = typeof size === "number" ? size + "px" : size;
  ctx.fontSize = size;
  ctx.font = getFont(true);
}

/**
 * Sets font family
 *
 * @param {string} family
 */
function fontFamily(family) {
  let ctx = _main.C.workingContext;
  ctx.fontFamily = family;
  ctx.font = getFont(true);
}

/**
 * Sets font style
 *
 * @param {string} style
 * possible values:
 * * NORMAL
 * * ITALIC
 * * OBLIQUE [<angle>]
 */
function fontStyle(style) {
  let ctx = _main.C.workingContext;
  ctx.fontStyle = style;
  ctx.font = getFont(true);
}

/**
 * Sets font variant
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant} for more info.
 *
 * @param {string} variant
 */
function fontVariant(variant) {
  let ctx = _main.C.workingContext;
  ctx.fontVariant = variant;
  ctx.font = getFont(true);
}

/**
 * Sets font weight
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight} for more info.
 * @param {string} weight
 */
function fontWeight(weight) {
  let ctx = _main.C.workingContext;
  ctx.fontWeight = weight;
  ctx.font = getFont(true);
}

/**
 * Sets font stretch
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font} for more info.
 *
 *  @global
 * @param {string} stretch
 * possible values:
 * * ULTRA_CONDENSED
 * * EXTRA_CONDENSED
 * * CONDENSED
 * * SEMI_CONDENSED
 * * NORMAL
 * * SEMI_EXPANDED
 * * EXPANDED
 * * EXTRA_EXPANDED
 * * ULTRA_EXPANDED
 * * <percentage>
 */
function fontStretch(stretch) {
  let ctx = _main.C.workingContext;
  ctx.fontStretch = stretch;
  ctx.font = getFont(true);
}

/**
 * Sets line height
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/line-height} for more info.
 *
 * @param {string} height
 */
function lineHeight(height) {
  let ctx = _main.C.workingContext;
  ctx.lineHeight = height;
  ctx.font = getFont(true);
}

/**
 * Returns canvas image data as string
 *
 * @param {string} datURL
 * @returns {string}
 */
function getCanvasData(datURL = "image/png") {
  return _main.C.workingContext.canvas.toDataURL(datURL);
}

/**
 * puts a imageData to canvas
 */
function putImageData() {
  _main.C.workingContext.putImageData(...arguments);
}

/**
 * Save the canvas as image
 *
 * @param {string} [name="drawing"] name of file
 * @param {string} [datURL="image/png"] type of file
 */
function saveCanvas(name = "drawing", datURL = "image/png") {
  let link = getCanvasData().replace(datURL, "image/octet-stream"),
    a = document.createElement("a");
  a.download = name + ".png";
  a.href = link;
  a.click();
}

/**
 * Sets the line dash
 * see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash} for more info
 *
 */
function lineDash() {
  _main.C.workingContext.setLineDash([...arguments]);
}

/**
 * Specifies the current text alignment used when drawing text.
 * The alignment is relative to the x value of the fillText/strokeText/text method.
 *
 * @param {string} align alignment type.
 * possible values:
 *  * "left" : The text is left-aligned.
 *  * "right" : The text is right-aligned.
 *  * "center" : The text is centered.
 *  * "start" : The text is aligned at the normal start of the line (left-aligned for left-to-right locales, right-aligned for right-to-left locales).
 *  * "end": The text is aligned at the normal end of the line (right-aligned for left-to-right locales, left-aligned for right-to-left locales).
 * NOTE: You can use constants LEFT, RIGHT, CENTER, START, and END for aligning
 */
function textAlign(align) {
  _main.C.workingContext.textAlign = align;
}

/**
 * Specifies the current text baseline used when drawing text.
 * The alignment is relative to the x value of the fillText/strokeText/text method.
 *
 * @param {string} baseline baseline type.
 * possible values:
 * * "top": The text baseline is the top of the em square.
 * * "hanging": The text baseline is the hanging baseline. (Used by Tibetan and other Indic scripts.)
 * * "middle": The text baseline is the middle of the em square.
 * * "alphabetic": The text baseline is the normal alphabetic baseline. Default value.
 * * "ideographic": The text baseline is the ideographic baseline; this is the bottom of the body of the characters, if the main body of characters protrudes beneath the alphabetic baseline. (Used by Chinese, Japanese, and Korean scripts.)
 * * "bottom": The text baseline is the bottom of the bounding box. This differs from the ideographic baseline in that the ideographic baseline doesn't consider descenders.
 * NOTE: You can use constants TOP, HANGING, MIDDLE, ALPHABETIC, IDEOGRAPHIC, BOTTOM for baseline
 */
function textBaseline(baseline) {
  _main.C.workingContext.textBaseline = baseline;
}

},{"./color/color_reader.js":1,"./main.js":9,"./utils.js":17}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyDefault = applyDefault;
exports.arange = arange;
exports.defineConstant = defineConstant;
exports.defineProperties = defineProperties;
exports.doFillAndStroke = doFillAndStroke;
exports.fraction = fraction;
exports.inArray = inArray;
exports.isLabel = isLabel;
exports.latexToImg = latexToImg;
exports.measureHeight = measureHeight;
exports.texFraction = texFraction;
exports.type = void 0;
var _aritmetics = require("./math/aritmetics.js");
var _main = require("./main.js");
/** @module Utils */

/**
 * Returns the type of object
 * @return {string}
 * @ignore
 */
const type = stuff => Object.prototype.toString.call(stuff).slice(8, -1);
exports.type = type;
Object.clone = Object.clone || function (toClone) {
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
function defineProperties(source, target = globalThis, assignToC = false) {
  Object.assign(target, source);
  if (assignToC) Object.assign(_main.C.functions, source);
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
function arange(start, end, step, rev = false) {
  let arr = [];
  if (rev) for (let i = end; i >= start; i -= step) arr.push(i);else for (let i = start; i <= end; i += step) arr.push(i);
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
function applyDefault(_default, target = {}, deepApply = true) {
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
function doFillAndStroke(ctx) {
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
function inArray(value, array, epsilon = 1e-6) {
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

function latexToImg(latex) {
  let MJX = window["MathJax"] || {};
  return new Promise((resolve, reject) => {
    let wrapper = MJX.tex2svg(`${latex}`, {
      em: 10,
      ex: 5,
      display: true
    });
    let mjOut = wrapper.getElementsByTagName("svg")[0];
    // mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    let output = {
      svg: "",
      img: ""
    };
    output.svg = mjOut.outerHTML;
    var image = new Image();
    image.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(output.svg)));
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
  let _divider = (0, _aritmetics.gcd)(numerator, denominator);
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
function texFraction(numerator, denominator, simplifyFraction = true, compact = true, multiple = "") {
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
function fraction(numerator, denominator, simplifyFraction = true, compact = true, multiple = "") {
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
function measureHeight(text) {
  let {
    actualBoundingBoxAscent,
    actualBoundingBoxDescent
  } = _main.C.workingContext.measureText(text);
  return actualBoundingBoxAscent + actualBoundingBoxDescent;
}

/**
 *
 * @param {Object<string:Function>} constantList
 */
function defineConstant(constantList) {
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
          writable: true
        });
      }
    });
  }
}
function isLabel(s) {
  return s != null && s != "";
}

},{"./main.js":9,"./math/aritmetics.js":10}]},{},[7]);
