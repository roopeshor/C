(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ORANGE = exports.GREEN_SCREEN = exports.LIGHT_PINK = exports.PINK = exports.GREY_BROWN = exports.DARKER_GRAY = exports.DARKER_GREY = exports.DARK_GRAY = exports.DARK_GREY = exports.GREY = exports.GRAY = exports.LIGHT_GREY = exports.LIGHT_GRAY = exports.BLACK = exports.WHITE = exports.PURPLE_E = exports.PURPLE_D = exports.PURPLE_C = exports.PURPLE_B = exports.PURPLE_A = exports.MAROON_E = exports.MAROON_D = exports.MAROON_C = exports.MAROON_B = exports.MAROON_A = exports.RED_E = exports.RED_D = exports.RED_C = exports.RED_B = exports.RED_A = exports.GOLD_E = exports.GOLD_D = exports.GOLD_C = exports.GOLD_B = exports.GOLD_A = exports.YELLOW_E = exports.YELLOW_D = exports.YELLOW_C = exports.YELLOW_B = exports.YELLOW_A = exports.GREEN_E = exports.GREEN_D = exports.GREEN_C = exports.GREEN_B = exports.GREEN_A = exports.TEAL_E = exports.TEAL_D = exports.TEAL_C = exports.TEAL_B = exports.TEAL_A = exports.BLUE_E = exports.BLUE_D = exports.BLUE_C = exports.BLUE_B = exports.BLUE_A = exports.LIGHT_BROWN = exports.DARK_BROWN = exports.DARK_BLUE = void 0;

/**
 * List of colors
 * @module constants/colors
 */
// from Manim
const DARK_BLUE = "#236B8E",
      DARK_BROWN = "#8B4513",
      LIGHT_BROWN = "#CD853F",
      BLUE_A = "#C7E9F1",
      BLUE_B = "#9CDCEB",
      BLUE_C = "#58C4DD",
      BLUE_D = "#29ABCA",
      BLUE_E = "#1C758A",
      TEAL_A = "#ACEAD7",
      TEAL_B = "#76DDC0",
      TEAL_C = "#5CD0B3",
      TEAL_D = "#55C1A7",
      TEAL_E = "#49A88F",
      GREEN_A = "#C9E2AE",
      GREEN_B = "#A6CF8C",
      GREEN_C = "#83C167",
      GREEN_D = "#77B05D",
      GREEN_E = "#699C52",
      YELLOW_A = "#FFF1B6",
      YELLOW_B = "#FFEA94",
      YELLOW_C = "#FFFF00",
      YELLOW_D = "#F4D345",
      YELLOW_E = "#E8C11C",
      GOLD_A = "#F7C797",
      GOLD_B = "#F9B775",
      GOLD_C = "#F0AC5F",
      GOLD_D = "#E1A158",
      GOLD_E = "#C78D46",
      RED_A = "#F7A1A3",
      RED_B = "#FF8080",
      RED_C = "#FC6255",
      RED_D = "#E65A4C",
      RED_E = "#CF5044",
      MAROON_A = "#ECABC1",
      MAROON_B = "#EC92AB",
      MAROON_C = "#C55F73",
      MAROON_D = "#A24D61",
      MAROON_E = "#94424F",
      PURPLE_A = "#CAA3E8",
      PURPLE_B = "#B189C6",
      PURPLE_C = "#9A72AC",
      PURPLE_D = "#715582",
      PURPLE_E = "#644172",
      WHITE = "#FFFFFF",
      BLACK = "#000000",
      LIGHT_GRAY = "#BBBBBB",
      LIGHT_GREY = "#BBBBBB",
      GRAY = "#888888",
      GREY = "#888888",
      DARK_GREY = "#444444",
      DARK_GRAY = "#444444",
      DARKER_GREY = "#222222",
      DARKER_GRAY = "#222222",
      GREY_BROWN = "#736357",
      PINK = "#D147BD",
      LIGHT_PINK = "#DC75CD",
      GREEN_SCREEN = "#00FF00",
      ORANGE = "#FF862F";
exports.ORANGE = ORANGE;
exports.GREEN_SCREEN = GREEN_SCREEN;
exports.LIGHT_PINK = LIGHT_PINK;
exports.PINK = PINK;
exports.GREY_BROWN = GREY_BROWN;
exports.DARKER_GRAY = DARKER_GRAY;
exports.DARKER_GREY = DARKER_GREY;
exports.DARK_GRAY = DARK_GRAY;
exports.DARK_GREY = DARK_GREY;
exports.GREY = GREY;
exports.GRAY = GRAY;
exports.LIGHT_GREY = LIGHT_GREY;
exports.LIGHT_GRAY = LIGHT_GRAY;
exports.BLACK = BLACK;
exports.WHITE = WHITE;
exports.PURPLE_E = PURPLE_E;
exports.PURPLE_D = PURPLE_D;
exports.PURPLE_C = PURPLE_C;
exports.PURPLE_B = PURPLE_B;
exports.PURPLE_A = PURPLE_A;
exports.MAROON_E = MAROON_E;
exports.MAROON_D = MAROON_D;
exports.MAROON_C = MAROON_C;
exports.MAROON_B = MAROON_B;
exports.MAROON_A = MAROON_A;
exports.RED_E = RED_E;
exports.RED_D = RED_D;
exports.RED_C = RED_C;
exports.RED_B = RED_B;
exports.RED_A = RED_A;
exports.GOLD_E = GOLD_E;
exports.GOLD_D = GOLD_D;
exports.GOLD_C = GOLD_C;
exports.GOLD_B = GOLD_B;
exports.GOLD_A = GOLD_A;
exports.YELLOW_E = YELLOW_E;
exports.YELLOW_D = YELLOW_D;
exports.YELLOW_C = YELLOW_C;
exports.YELLOW_B = YELLOW_B;
exports.YELLOW_A = YELLOW_A;
exports.GREEN_E = GREEN_E;
exports.GREEN_D = GREEN_D;
exports.GREEN_C = GREEN_C;
exports.GREEN_B = GREEN_B;
exports.GREEN_A = GREEN_A;
exports.TEAL_E = TEAL_E;
exports.TEAL_D = TEAL_D;
exports.TEAL_C = TEAL_C;
exports.TEAL_B = TEAL_B;
exports.TEAL_A = TEAL_A;
exports.BLUE_E = BLUE_E;
exports.BLUE_D = BLUE_D;
exports.BLUE_C = BLUE_C;
exports.BLUE_B = BLUE_B;
exports.BLUE_A = BLUE_A;
exports.LIGHT_BROWN = LIGHT_BROWN;
exports.DARK_BROWN = DARK_BROWN;
exports.DARK_BLUE = DARK_BLUE;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MITER = exports.BEVEL = exports.MILTER = exports.ROUND = exports.SQUARE = exports.BUTT = void 0;
const BUTT = "butt",
      SQUARE = "square",
      ROUND = "round",
      MILTER = "milter",
      BEVEL = "bevel",
      MITER = "miter";
exports.MITER = MITER;
exports.BEVEL = BEVEL;
exports.MILTER = MILTER;
exports.ROUND = ROUND;
exports.SQUARE = SQUARE;
exports.BUTT = BUTT;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SQRT2 = exports.TAU = exports.PI = exports.LN10 = exports.LN2 = exports.E = void 0;
const E = 2.718281828459045,
      LN2 = 0.6931471805599453,
      LN10 = 2.302585092994046,
      PI = 3.141592653589793,
      TAU = 6.283185307179586,
      SQRT2 = 1.4142135623730951;
exports.SQRT2 = SQRT2;
exports.TAU = TAU;
exports.PI = PI;
exports.LN10 = LN10;
exports.LN2 = LN2;
exports.E = E;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomColor = randomColor;
exports.randomDefinedColor = randomDefinedColor;
exports.RGBToHSL = RGBToHSL;
exports.HSLToRGB = HSLToRGB;
exports.RGBToHSV = RGBToHSV;
exports.HSVToRGB = HSVToRGB;

var COLORLIST = _interopRequireWildcard(require("../constants/colors.js"));

var _math = require("./math.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const __definedColors__ = Object.keys(COLORLIST); // color randomizers

/**
 * returns a random hex color
*/


function randomColor() {
  let color = "#";

  for (let i = 0; i < 3; i++) {
    let randNum = (0, _math.randomInt)(255).toString(16);
    randNum = randNum.length === 1 ? 0 + randNum : randNum;
    color += randNum;
  }

  return color;
}
/**
 * picks a random color from defined ones
 *
*/


function randomDefinedColor() {
  return COLORLIST[__definedColors__[(0, _math.randomInt)(__definedColors__.length - 1)]];
} // color converters


function hue2RGB(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes values of red, green, and blue are between 0 & 255 and
 * returns hue in range 0 to 360, saturation and lightness in range 0 to 1
 *
 * @param {number} red The red color value
 * @param {number} green The green color value
 * @param {number} blue The blue color value
 * @return {array} The HSL representation
 */


function RGBToHSL(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue;
  let saturation;
  const lightness = (max + min) / 2;

  if (max === min) {
    hue = saturation = 0; // achromatic
  } else {
    const d = max - min;
    saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        hue = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        hue = (b - r) / d + 2;
        break;

      case b:
        hue = (r - g) / d + 4;
        break;
    }

    hue /= 6;
  }

  return [hue * 360, saturation, lightness];
}
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes values of hue is between 0 and 360, saturation and lightness are between 0 & 1 and
 * returns red, green, and blue values between 0 & 255
 *
 * @param {number} hue The hue
 * @param {number} saturation The saturation
 * @param {number} lightness The lightness
 * @return {array} The RGB representation
 */


function HSLToRGB(hue, saturation, lightness) {
  let r, g, b;
  hue /= 360;

  if (saturation === 0) {
    r = g = b = lightness; // achromatic
  } else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;
    r = hue2RGB(p, q, hue + 1 / 3);
    g = hue2RGB(p, q, hue);
    b = hue2RGB(p, q, hue - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}
/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes values of red, green, and blue are between 0 & 255 and
 * returns hue in range 0 to 360, saturation and value in range 0 to 1
 *
 * @param {number} red The red color value
 * @param {number} green The green color value
 * @param {number} blue The blue color value
 * @return {array} The HSV representation
 */


function RGBToHSV(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue;
  const value = max;
  const d = max - min;
  const saturation = max === 0 ? 0 : d / max;

  if (max === min) {
    hue = 0; // achromatic
  } else {
    switch (max) {
      case r:
        hue = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        hue = (b - r) / d + 2;
        break;

      case b:
        hue = (r - g) / d + 4;
        break;
    }

    hue /= 6;
  }

  return [hue * 360, saturation, value];
}
/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes values of hue is between 0 to 360, saturation, and value are between 0 & 1 and
 * returns red, green, and blue in range 0 to 255
 *
 * @param {number} hue The hue
 * @param {number} saturation The saturation
 * @param {number} value The value
 * @return {array} The RGB representation
 */


function HSVToRGB(hue, saturation, value) {
  let r, g, b;
  const i = Math.floor(hue / 60);
  const f = hue / 60 - i;
  const p = value * (1 - saturation);
  const q = value * (1 - f * saturation);
  const t = value * (1 - (1 - f) * saturation);

  switch (i % 6) {
    case 0:
      r = value;
      g = t;
      b = p;
      break;

    case 1:
      r = q;
      g = value;
      b = p;
      break;

    case 2:
      r = p;
      g = value;
      b = t;
      break;

    case 3:
      r = p;
      g = q;
      b = value;
      break;

    case 4:
      r = t;
      g = p;
      b = value;
      break;

    case 5:
      r = value;
      g = p;
      b = q;
      break;
  }

  return [r * 255, g * 255, b * 255];
}

},{"../constants/colors.js":1,"./math.js":7}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineProperties = defineProperties;

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
  message = typeof message === "function" ? message : function (k) {
    console.warn("You changed value of \"" + k + "\" which C uses. Be careful");
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

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.line = line;
exports.moveTo = moveTo;
exports.lineTo = lineTo;
exports.background = background;
exports.clear = clear;
exports.permaBackground = permaBackground;
exports.setTransform = setTransform;
exports.transform = transform;
exports.noFill = noFill;
exports.noStroke = noStroke;
exports.translate = translate;
exports.setImageSmoothing = setImageSmoothing;
exports.strokeWidth = strokeWidth;
exports.scale = scale;
exports.rotate = rotate;
exports.save = save;
exports.lineCap = lineCap;
exports.lineJoin = lineJoin;
exports.restore = restore;
exports.getFill = getFill;
exports.getStroke = getStroke;
exports.rest = rest;
exports.stroke = stroke;
exports.fill = fill;
exports.getDrawConfigs = getDrawConfigs;
exports.arc = arc;
exports.text = text;
exports.rect = rect;
exports.circle = circle;
exports.polygon = polygon;
exports.ellipse = ellipse;
exports.bezierCurve = bezierCurve;
exports.loop = loop;
exports.noLoop = noLoop;
exports.startPath = startPath;
exports.endPath = endPath;
exports.getFont = getFont;
exports.measureText = measureText;
exports.fontSize = fontSize;
exports.fontFamily = fontFamily;
exports.getCanvasData = getCanvasData;
exports.saveCanvas = saveCanvas;
exports.point = point;
exports.square = square;
exports.sector = sector;
exports.quad = quad;
exports.triangle = triangle;
exports.equiTriangle = equiTriangle;
exports.regularPolygon = regularPolygon;
exports.regularPolygonWithRadius = regularPolygonWithRadius;
exports.getFPS = getFPS;
exports.linearGradient = linearGradient;
exports.circularSegment = circularSegment;
exports.arcTo = arcTo;
exports.fillText = fillText;
exports.strokeText = strokeText;
exports.clearAll = clearAll;
exports.setLineDash = setLineDash;
exports.fontStyle = fontStyle;
exports.fontVariant = fontVariant;
exports.fontWeight = fontWeight;
exports.fontStretch = fontStretch;
exports.lineHeight = lineHeight;

var _main = require("../main.js");

/**
 * This is the core list of drawing functions. Includes all core functionality
 * @module drawing-functions
 */
function readColor(colors) {
  let color1;
  let color2;
  let color3;
  let alpha = 255;
  let read = "";

  if (typeof colors[0] === "number") {
    if (colors.length === 1) {
      color1 = colors[0];
      color2 = color1;
      color3 = color1;
    } else if (colors.length === 2) {
      color1 = colors[0];
      color2 = colors[1];
      color3 = 0;
    } else if (colors.length === 3) {
      color1 = colors[0];
      color2 = colors[1];
      color3 = colors[2];
    } else if (colors.length === 4) {
      color1 = colors[0];
      color2 = colors[1];
      color3 = colors[2];
      alpha = colors[3];
    }

    const mode = _main.C.workingCanvas.colorMode;

    if (mode === "HSL") {
      read = `hsl(${color1}, ${color2}, ${color3})`;
    } else if (mode === "rgb") {
      read = `rgb(${color1}, ${color2}, ${color3})`;
    } else if (mode === "rgba") {
      read = `rgba(${color1}, ${color2}, ${color3}, ${alpha})`;
    }
  } else {
    read = colors[0];
  }

  return read;
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
  const ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}
/**
 * Move to a given point
 *
 * @param {number} x
 * @param {number} y
 */


function moveTo(x, y) {
  _main.C.workingCanvas.moveTo(x, y);
}
/**
 * adds a line to the current path
 *
 * @param {number} x
 * @param {number} y
 */


function lineTo(x, y) {
  _main.C.workingCanvas.lineTo(x, y);
}
/**
 * Sets background to a given value
 *
 * Accepted values:
 * * a hex string (#fff, #acf2dc)
 * * a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * a array of numbers ([0, 244, 34])
 */


function background() {
  const col = readColor(arguments),
        ctx = _main.C.workingCanvas;
  ctx.background = col;
  ctx.save();
  rest();
  ctx.fillStyle = col;
  ctx.fillRect(0, 0, ctx.width, ctx.height);
  ctx.restore();
}
/**
 * Clears a rectangular portion of canvas
 *
 * @param {number} x starting x
 * @param {number} y starting y
 * @param {number} width
 * @param {number} height
 */


function clear(x, y, width, height) {
  const ctx = _main.C.workingCanvas;
  x = x || 0;
  y = y || 0;
  width = width || ctx.width;
  height = height || ctx.height;
  ctx.clearRect(x, y, width, height);
}
/**
 * Clears the entire canvas
 *
 */


function clearAll() {
  const ctx = _main.C.workingCanvas;
  const d = ctx.dpr;
  ctx.save();
  ctx.setTransform(d, 0, 0, d, 0, 0);
  ctx.clearRect(0, 0, ctx.width, ctx.height);
  ctx.restore();
}
/**
 * Captures the current drawings in canvas and set it to
 * css background
 *
 */


function permaBackground() {
  const canvasStyle = _main.C.workingCanvas.canvas.style;
  canvasStyle.background = "url('" + getCanvasData() + "')";
  canvasStyle.backgroundPosition = "center";
  canvasStyle.backgroundSize = "cover";
}
/**
 * Resets the current transformation to the identity matrix,
 * and then invokes a transformation described by given arguments.
 * Lets you scale, rotate, translate (move), and skew the canvas.
 * See MDN docs: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
 *
 * @param {number} a1
 * @param {number} a2
 * @param {number} a3
 * @param {number} a4
 * @param {number} a5
 * @param {number} a6
 */


function setTransform(a1, a2, a3, a4, a5, a6) {
  const ctx = _main.C.workingCanvas;
  ctx.setTransform(a1, a2, a3, a4, a5, a6);
  ctx.scale(ctx.dpr, ctx.dpr);
}
/**
 * multiplies the current transformation with the matrix described by the arguments
 * of this method. This lets you scale, rotate, translate (move), and skew the context.
 * See MDN docs: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
 *
 * @param {number} a1
 * @param {number} a2
 * @param {number} a3
 * @param {number} a4
 * @param {number} a5
 * @param {number} a6
 */


function transform(a1, a2, a3, a4, a5, a6) {
  _main.C.workingCanvas.transform(a1, a2, a3, a4, a5, a6);
}
/**
 * Prevent filling inside shapes
 */


function noFill() {
  _main.C.workingCanvas.doFill = false;
}
/**
 * Prevent drawing strokes of shapes
 */


function noStroke() {
  _main.C.workingCanvas.doStroke = false;
}
/**
 * Translates (moves) canvas to a position
 *
 * @param {number} x
 * @param {number} [y=0]
 */


function translate(x, y = 0) {
  _main.C.workingCanvas.translate(x, y);
}
/**
 * Sets whether to enable image smoothening
 *
 * @param {boolean} bool
 */


function setImageSmoothing(bool) {
  _main.C.workingCanvas.imageSmoothingEnabled = !!bool;
}
/**
 * Sets the stroke width (line width/line thickness)
 *
 * @param {number} w
 */


function strokeWidth(w) {
  _main.C.workingCanvas.lineWidth = Number(w);
}
/**
 * Scales the canvas by a given amount
 *
 * @param {number} x
 * @param {number} [y=x]
 */


function scale(x, y = x) {
  _main.C.workingCanvas.scale(x, y);
}
/**
 * Rotates the canvas
 *
 * @param {number} angle angle in radians
 */


function rotate(angle) {
  const ctx = _main.C.workingCanvas;
  ctx.rotate(angle);
  ctx.netRotation = (ctx.netRotation + angle) % Math.PI * 2;
}
/**
 * Saves the current state of canvas
 */


function save() {
  _main.C.workingCanvas.save();
}
/**
 * Set the type of line end
 * Options: BUTT, ROUND, SQUARE
 * @param {string} capType
 */


function lineCap(capType) {
  _main.C.workingCanvas.lineCap = capType;
}
/**
 * Sets type of line joining
 * Options: bevel, round, miter
 * @param {string} joinType
 */


function lineJoin(joinType) {
  _main.C.workingCanvas.lineJoin = joinType;
}
/**
 * Restore the saved state of canvas
 */


function restore() {
  _main.C.workingCanvas.restore();
}
/**
 * Returns fill color/gradient
 * @returns {string|CanvasGradient}
 */


function getFill() {
  return _main.C.workingCanvas.fillStyle;
}
/**
 * Returns stroke color/gradient
 * @returns {string|CanvasGradient}
 */


function getStroke() {
  return _main.C.workingCanvas.strokeStyle;
}
/**
 * Reset the applied transform to idendity matrix and scales canvas by dpr
 */


function rest() {
  const ctx = _main.C.workingCanvas;
  ctx.setTransform(ctx.dpr, 0, 0, ctx.dpr, 0, 0);
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


function stroke() {
  const ctx = _main.C.workingCanvas;

  if (arguments.length > 0) {
    ctx.strokeStyle = readColor(arguments);
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


function fill() {
  const ctx = _main.C.workingCanvas;

  if (arguments.length !== 0) {
    ctx.fillStyle = readColor(arguments);
    ctx.doFill = true;
  } else {
    ctx.fill();
  }
}
/**
 * Returns fill & stroke color/gradient, line width, fill & stroke state, and background
 * @returns {Object}
 */


function getDrawConfigs() {
  const ctx = _main.C.workingCanvas;
  return {
    background: ctx.background,
    stroke: ctx.strokeStyle,
    fill: ctx.fillStyle,
    strokeWidth: ctx.lineWidth,
    doStroke: ctx.doStroke,
    doFill: ctx.doFill
  };
}
/**
 * Draw a arc
 *
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} r radius
 * @param {number} [angle=PI/2] central angle (use negative values to rotate arc clockwise)
 * @param {number} [startAngle=0] starting angle angle
 */


function arc(x, y, r, angle = Math.PI / 2, startAngle = 0) {
  const ctx = _main.C.workingCanvas;
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.arc(x, y, r, startAngle, startAngle + angle);

  if (!ctx.pathStarted) {
    if (ctx.doStroke) ctx.stroke();
    ctx.closePath();
  }
}
/**
 * Creates a circular arc using the given control points and radius.
 * If a current path started it will add this to the end of path
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} radius
 */


function arcTo(x1, y1, x2, y2, radius) {
  const ctx = _main.C.workingCanvas;

  if (ctx.pathStarted) {
    ctx.arcTo(x1, y1, x2, y2, radius);
  } else {
    ctx.beginPath();
    ctx.arcTo(x1, y1, x2, y2, radius);
    if (ctx.doStroke) ctx.stroke();
    if (ctx.doFill) ctx.fill();
    ctx.closePath();
  }
}
/**
 * Draws a circular segment.
 *
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} r radius
 * @param {number} [angle=Math.PI / 2] central angle
 * @param {number} [startAngle=0] starting angle
 */


function circularSegment(x, y, r, angle = Math.PI / 2, startAngle = 0) {
  const ctx = _main.C.workingCanvas;
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.arc(x, y, r, startAngle, startAngle + angle);

  if (!ctx.pathStarted) {
    if (ctx.doFill) ctx.fill();
    if (ctx.doStroke) ctx.stroke();
    ctx.closePath();
  }
}
/**
 * Draws a filled & stroked text
 *
 * @param {string} text text to draw
 * @param {number} [x=0] x-coord
 * @param {number} [y=0] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */


function text(text, x = 0, y = 0, maxwidth = undefined) {
  const ctx = _main.C.workingCanvas;

  if (ctx.yAxisInveted) {
    // if inverted reverse it and invert y component
    scale(1, -1);
    y *= -1;
  }

  if (ctx.doFill) ctx.fillText(text, x, y, maxwidth);else if (ctx.doStroke) ctx.strokeText(text, x, y, maxwidth);
  if (ctx.yAxisInveted) scale(1, -1); // reverse y-invertion
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
  const ctx = _main.C.workingCanvas;

  if (ctx.yAxisInveted) {
    scale(1, -1);
    y *= -1;
  }

  ctx.fillText(text, x, y, maxwidth);
  if (ctx.yAxisInveted) scale(1, -1);
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
  const ctx = _main.C.workingCanvas;

  if (ctx.yAxisInveted) {
    scale(1, -1);
    y *= -1;
  }

  ctx.strokeText(text, x, y, maxwidth);
  if (ctx.yAxisInveted) scale(1, -1);
}
/**
 * Draws a rectangle
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} width widht
 * @param {number} height height
 */


function rect(x, y, width, height) {
  const ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}
/**
 * Draws circle
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} r radius
 */


function circle(x, y, r) {
  const ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}
/**
 * accepts points and draws polygon
 * @example ```js
 * polygon(
		[0, 0], // first point
		[100, 200], // second point
		[130, 230], // third point
		//...
)
```
 */


function polygon() {
  const args = arguments;

  if (args.length > 2) {
    const ctx = _main.C.workingCanvas;
    const start = args[0];
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
 * Draws ellipse
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} radius1 radius1
 * @param {number} radius2 radius2
 * @param {number} [rotation=0] rotation from plane
 * @param {number} [startAngle=0] starting angle
 * @param {number} [endAngle=Math.PI * 2] ending angle
 * @param {boolean} [anticlockwise=false]
 */


function ellipse(x, y, radius1, radius2, rotation = 0, startAngle = 0, endAngle = Math.PI * 2, anticlockwise = false) {
  const ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.ellipse(x, y, radius1, radius2, rotation, startAngle, endAngle, anticlockwise);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}
/**
 * Draws a bezier curve
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 */


function bezierCurve(x1, y1, x2, y2, x3, y3) {
  const ctx = _main.C.workingCanvas;
  const pathStarted = ctx.pathStarted;
  if (!pathStarted) ctx.beginPath();
  ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
  if (pathStarted) return;
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}
/**
 * Starts a new loop
 * @param {function} fx
 * @param {string} canvasName name of canvas. It must be unique if you're running multiple animation at once
 * @param {number} dx
 */


function loop(fx, canvasName, dx) {
  let ctx = _main.C.workingCanvas;
  if (!canvasName) canvasName = ctx.name;else ctx = _main.C.canvasList[canvasName];

  if (!isNaN(dx)) {
    ctx.currentLoop = setInterval(function () {
      _main.C.workingCanvas = ctx;
      fx();
    }, dx);
  } else {
    a();
  }

  function a() {
    ctx.currentLoop = window.requestAnimationFrame(a);
    fx();
  }
}
/**
 * Stops current loop
 * @param {string} canvasName
 */


function noLoop(canvasName) {
  let ctx = _main.C.workingCanvas;
  if (!canvasName) canvasName = ctx.name;else ctx = _main.C.canvasList[canvasName];
  clearInterval(ctx.currentLoop);
  window.cancelAnimationFrame(ctx.currentLoop);
}
/**
 * Starts a new Path
 */


function startPath() {
  const ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.pathStarted = true;
}
/**
 * Ends current Path
 */


function endPath() {
  const ctx = _main.C.workingCanvas;
  ctx.closePath();
  ctx.pathStarted = false;
}
/**
 * Return current font
 * @param {boolean} detailed wheather to return a detailed font property
 * @returns {string}
 */


function getFont(detailed = false) {
  const ctx = _main.C.workingCanvas;

  if (detailed) {
    const {
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
 * @param {string} text
 * @returns {TextMetrics}
 */


function measureText(text) {
  return _main.C.workingCanvas.measureText(text);
}
/**
 * Sets font size
 *
 * @param {number|string} size
 */


function fontSize(size) {
  const ctx = _main.C.workingCanvas;
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
  const ctx = _main.C.workingCanvas;
  ctx.fontFamily = family;
  ctx.font = getFont(true);
}
/**
 * Sets font style
 *
 * @param {string} style
 */


function fontStyle(style) {
  const ctx = _main.C.workingCanvas;
  ctx.fontStyle = style;
  ctx.font = getFont(true);
}
/**
 * Sets font variant
 *
 * @param {string} variant
 */


function fontVariant(variant) {
  const ctx = _main.C.workingCanvas;
  ctx.fontVariant = variant;
  ctx.font = getFont(true);
}
/**
 * Sets font weight
 *
 * @param {string} weight
 */


function fontWeight(weight) {
  const ctx = _main.C.workingCanvas;
  ctx.fontWeight = weight;
  ctx.font = getFont(true);
}
/**
 * Sets font stretch
 *
 * @param {string} stretch
 */


function fontStretch(stretch) {
  const ctx = _main.C.workingCanvas;
  ctx.fontStretch = stretch;
  ctx.font = getFont(true);
}
/**
 * Sets line height
 *
 * @param {string} height
 */


function lineHeight(height) {
  const ctx = _main.C.workingCanvas;
  ctx.lineHeight = height;
  ctx.font = getFont(true);
}
/**
 * Returns canvas image data
 *
 * @param {string} datURL
 * @returns {string}
 */


function getCanvasData(datURL = "image/png") {
  return _main.C.workingCanvas.canvas.toDataURL(datURL);
}
/**
 * Save the canvas as image
 *
 * @param {string} [name="drawing"] name of file
 * @param {string} [datURL="image/png"] type of file
 */


function saveCanvas(name = "drawing", datURL = "image/png") {
  const link = getCanvasData().replace(datURL, "image/octet-stream");
  const a = document.createElement("a");
  a.download = name + ".png";
  a.href = link;
  a.click();
}
/**
 * Sets the line dash
 * see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash for more information
 *
 */


function setLineDash() {
  _main.C.workingCanvas.setLineDash([...arguments]);
}
/**
 * Draws a point with given size in pixels
 *
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} [size=1] diameter of point in px
 */


function point(x, y, size = 1) {
  const ctx = _main.C.workingCanvas;
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
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
 * Draws a sector
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} radius radius of sector
 * @param {number} [angle=PI/2] central angle (use negative angle to move sector clockwise)
 * @param {number} [startAngle=0] starting angle
 */


function sector(x, y, radius, angle = Math.PI / 2, startAngle = 0) {
  const ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, radius, startAngle, startAngle + angle);
  ctx.lineTo(x, y);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}
/**
 * Draws quadrilateral with four points as array of coordinate as [x, y]
 *
 * @param {array} p1 1st point
 * @param {array} p2 2nd point
 * @param {array} p3 3rd point
 * @param {array} p4 4th point
 */


function quad(p1, p2, p3, p4) {
  const ctx = _main.C.workingCanvas;
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
 * @param {array} p1
 * @param {array} p2
 * @param {array} p3
 */


function triangle(p1, p2, p3) {
  const ctx = _main.C.workingCanvas;
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
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} sides number of sides
 * @param {number} sideLength length of a side
 * @param {number} [rotation=0] amound to rotate the entire polygon
 */


function regularPolygon(x, y, sides, sideLength, rotation = 0) {
  sideLength = sideLength / (2 * Math.sin(Math.PI / sides)); // finds radius

  regularPolygonWithRadius(x, y, sides, sideLength, rotation);
}
/**
 * Draws a regular polygon that is inside a circle

 * @param {number} x x coord
 * @param {number} y y coord
 * @param {number} sides number of sides
 * @param {number} radius radius
 * @param {number} [rotation=0] amound to rotate the entire polygon
 */


function regularPolygonWithRadius(x, y, sides, radius, rotation = 0) {
  let i = 0;
  const e = Math.PI * 2 / sides;
  const ctx = _main.C.workingCanvas;
  rotation += e / 2;
  const initial = [Math.cos(rotation) * radius + x, Math.sin(rotation) * radius + y];
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

window.dxList = [];
window.total = 0;
window.recent = window.performance.now();
/**
 * Returns FPS (Frames Per Second)
 * @param {number} keepDat number of recorded frames to keep in the memory
 * @returns {number}
 */

function getFPS(keepDat = 100) {
  const now = window.performance.now();
  const dx = now - window.recent;
  window.dxList.push(dx);
  window.total += dx;
  window.recent = now;
  if (window.dxList.length > keepDat) window.total -= window.dxList.shift();
  return window.dxList.length / (window.total / 1000);
}
/**
 * creates a linear gradient
 *
 * @param {array} initialPoint initial point as [x, y]
 * @param {array} finalPoint final point as [x, y]
 * @param {Object|array} colorStops color stops
 @example
 ```js
var color = linearGradient(
	[0, 0], [200, 0],
	{
			0: "green",
			0.5: "cyan",
			1: "yellow"
	}
);
```,
```js
var color = linearGradient(
	[0, 0], [200, 0],
	[
		"green",
		"cyan",
		"yellow"
	]
);
```
 */


function linearGradient(initialPoint, finalPoint, colorStops) {
  const ctx = _main.C.workingCanvas;
  const gradient = ctx.createLinearGradient(initialPoint[0], initialPoint[1], finalPoint[0], finalPoint[1]);

  if (Array.isArray(colorStops)) {
    const stops = {};
    const step = 1 / colorStops.length;

    for (let i = 0; i < colorStops.length; i++) {
      stops[step * i] = colorStops[i];
    }

    colorStops = stops;
  }

  for (let stops = Object.keys(colorStops), i = 0; i < stops.length; i++) {
    const stop = stops[i];
    gradient.addColorStop(stop, colorStops[stop]);
  }

  return gradient;
}

},{"../main.js":10}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dist = dist;
exports.randomInt = randomInt;
exports.sigmoid = sigmoid;
exports.limit = limit;
exports.rotateAroundOrigin = rotateAroundOrigin;
exports.rotateAroundPoint = rotateAroundPoint;
exports.tanh = exports.tan = exports.sqrt = exports.sin = exports.sgn = exports.round = exports.random = exports.pow = exports.min = exports.max = exports.log10 = exports.log2 = exports.log = exports.floor = exports.exp = exports.cosh = exports.cos = exports.ceil = exports.cbrt = exports.atan2 = exports.atan = exports.asin = exports.acos = exports.abs = void 0;
const abs = Math.abs,
      acos = Math.acos,
      asin = Math.asin,
      atan = Math.atan,
      atan2 = Math.atan2,
      cbrt = Math.cbrt,
      ceil = Math.ceil,
      cos = Math.cos,
      cosh = Math.cosh,
      exp = Math.exp,
      floor = Math.floor,
      log = Math.log,
      log2 = Math.log2,
      log10 = Math.log10,
      max = Math.max,
      min = Math.min,
      pow = Math.pow,
      random = Math.random,
      round = Math.round,
      sgn = Math.sign,
      sin = Math.sin,
      sqrt = Math.sqrt,
      tan = Math.tan,
      tanh = Math.tanh;
/**
 * return distance between two points
 *
 * @param {array} p1
 * @param {array} p2
 * @return {number} distance between p1 and p2
 */

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

function dist(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function randomInt(max = 10, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}

function sigmoid(x) {
  return 1.0 / (1 + Math.exp(-x));
}

function limit(x, mi = 0, ma = 1) {
  return Math.min(Math.max(x, mi), ma);
}
/**
 * Returns a point rotated around a point by certain angle, exetened by a certain length
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {array} array of two points
 */


function rotateAroundPoint(x, y, angle, len = 10) {
  return [Math.cos(angle) * len + x, Math.sin(angle) * len + y];
}
/**
 * Returns a point rotated around origin by certain angle, exetened by a certain length
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {array} array of two points
 */


function rotateAroundOrigin(angle, len = 10) {
  return rotateAroundPoint(0, 0, angle, len);
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCenteredCanvas = initCenteredCanvas;
exports.clear = clear;
exports.arrow = arrow;
exports.axes = axes;
exports.arrowHead = arrowHead;
exports.doubleArrow = doubleArrow;
exports.numberLine = numberLine;
exports.numberPlane = numberPlane;
Object.defineProperty(exports, "scale", {
  enumerable: true,
  get: function () {
    return _drawingFunctions.scale;
  }
});

var _colors = require("../constants/colors.js");

var _main = require("../main.js");

var _drawingFunctions = require("./drawing-functions.js");

/*
global CENTERX CENTERY
*/
const consts = {
  CENTERX: function () {
    return _main.C.workingCanvas.width / 2;
  },
  CENTERY: function () {
    return _main.C.workingCanvas.height / 2;
  }
};

function _def_(name, getter) {
  Object.defineProperty(window, name, {
    configurable: true,
    enumerable: true,
    get: getter,
    set: function set(value) {
      Object.defineProperty(window, name, {
        configurable: true,
        enumerable: true,
        value: value,
        writable: true
      });
    }
  });
}

for (let constNames = Object.keys(consts), i = 0; i < constNames.length; i++) {
  const _const = constNames[i];

  _def_(_const, consts[_const]);
}
/**/


function arange(start, end, step, rev = false) {
  const arr = [];
  if (rev) for (let i = end; i >= start; i -= step) arr.push(i);else for (let i = start; i <= end; i += step) arr.push(i);
  return arr;
}

function applyDefault(_default, target = {}) {
  for (let i = 0, keys = Object.keys(_default); i < keys.length; i++) {
    const prop = keys[i];
    const objType = _default[prop][1];

    if (objType === "number" && isNaN(target[prop]) || objType === "array" && !Array.isArray(target[prop]) || target[prop] === undefined || target[prop] === null) {
      target[prop] = _default[prop][0];
    }
  }

  return target;
}
/**
 * initializes a canvas translated to center and y-axis inverted
 */


function initCenteredCanvas() {
  const ctx = _main.C.workingCanvas;
  (0, _drawingFunctions.background)(0);
  (0, _drawingFunctions.fill)(_colors.WHITE);
  (0, _drawingFunctions.stroke)(_colors.WHITE);
  (0, _drawingFunctions.noStroke)();
  (0, _drawingFunctions.fontSize)(20);
  ctx.translate(CENTERX, CENTERY);
  ctx.scale(1, -1);
  ctx.lineWidth = 2;
  ctx.yAxisInveted = true;
}
/**
 * clears a rectangular portion of canvas
 * @param {number} [x=-width / 2]
 * @param {number} [y=-height / 2]
 * @param {number} [width=width * 2]
 * @param {number} [height=height * 2]
 */


function clear(x, y, width, height) {
  const ctx = _main.C.workingCanvas;
  x = x || -ctx.width / 2;
  y = y || -ctx.height / 2;
  width = width || ctx.width * 2;
  height = height || ctx.height * 2;
  ctx.clearRect(x, y, width, height);
}
/**
 * draws a arrow
 * @param {number} x1 starting x-coord
 * @param {number} y1 starting y-coord
 * @param {number} x2 ending x-coord
 * @param {number} y2 ending y-coord
 * @param {number} tipWidth width of tip
 * @param {number} tipScaleRatio width:height
 */


function arrow(x1, y1, x2, y2, tipWidth = 10, tipScaleRatio = 0.7) {
  const angle = Math.atan2(y2 - y1, x2 - x1); // angle from plain

  arrowHead(x2, y2, tipWidth, angle, tipScaleRatio);
  (0, _drawingFunctions.save)();
  const r = Math.atan(tipScaleRatio / 2);
  const xd = Math.cos(angle) * tipWidth * Math.cos(r);
  const yd = Math.sin(angle) * tipWidth * Math.cos(r);
  x2 -= xd;
  y2 -= yd;
  (0, _drawingFunctions.line)(x1, y1, x2, y2);
  (0, _drawingFunctions.restore)();
}
/**
 * creates a axes.
 * xAxis: <object> params for x axis.
 *   This will be given to numberLine. see {@link numberLine} function for possible values
 * yAxis: <object> params for y axis.
 *   This will be given to numberLine. see {@link numberLine} function for possible values
 * center: <array> [[0, 0]]
 *   center of axes
 * @param {Object} config
 * @returns axis configs
 */


function axes(config = {}) {
  const ctx = _main.C.workingCanvas; // default configurations

  const xAxisDefaults = {
    length: [ctx.width, "number"],
    includeNumbers: [false],
    includeTick: [false],
    includeLeftTip: [true],
    includeRightTip: [true],
    textDirection: [-0.3, -1]
  };
  const yAxisDefaults = {
    length: [ctx.height, "number"],
    rotation: [Math.PI / 2, "number"],
    textRotation: [-Math.PI / 2, "number"],
    includeNumbers: [false],
    includeTick: [false],
    includeLeftTip: [true],
    includeRightTip: [true]
  }; // configurations

  const xAxis = applyDefault(xAxisDefaults, config.xAxis);
  const yAxis = applyDefault(yAxisDefaults, config.yAxis); // other configurations

  const center = config.center || [0, 0]; // range of ticks in each axis

  const xRange = xAxis.range || [-8, 8, 1];
  const yRange = yAxis.range || [-8, 8, 1]; // unit length of each axis
  // got by dividing length of axis by number of ticks

  const xDX = xAxis.length / ((xRange[1] - xRange[0]) / xRange[2]);
  const yDX = yAxis.length / ((yRange[1] - yRange[0]) / yRange[2]); // coordinates of bounding rectangle of the graph

  const xMin = xRange[0] / xRange[2] * xDX;
  const yMin = yRange[0] / yRange[2] * yDX; // variables to shift 0 ticks of axes to center

  const xShift = xAxis.length / 2 + xMin;
  const yShift = yAxis.length / 2 + yMin;
  (0, _drawingFunctions.save)(); // translate to center

  (0, _drawingFunctions.translate)(center[0], center[1]); // draws axes
  // x-axis

  (0, _drawingFunctions.translate)(xShift, 0);
  const xAxisLine = numberLine(xAxis); // draw x axis
  // reverse the effect of shift for drawing y-axis

  (0, _drawingFunctions.translate)(-xShift, yShift); // y-axis

  const yAxisLine = numberLine(yAxis); // draw y axis
  // size of a unit cell

  const unit = [xAxisLine.unitLength, yAxisLine.unitLength]; // reverse the effect of overall shift

  (0, _drawingFunctions.translate)(-center[0], -center[1] - yShift);
  (0, _drawingFunctions.restore)();
  return {
    unit: unit,
    // major unit size
    xAxis: xAxisLine,
    // x axis confiurations from numberLine
    yAxis: yAxisLine // y axis confiurations from numberLine

  };
}
/**
 *
 *
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} [width=10] width of head
 * @param {number} [ang=0] tilt of head
 * @param {number} [tipScaleRatio=2] height to width ratio
 */


function arrowHead(x, y, width = 10, ang = 0, tipScaleRatio = 2) {
  const ctx = _main.C.workingCanvas;
  const r = Math.atan(tipScaleRatio / 2);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - width * Math.cos(ang - r), y - width * Math.sin(ang - r));
  ctx.lineTo(x - width * Math.cos(ang + r), y - width * Math.sin(ang + r));
  ctx.lineTo(x, y);
  if (ctx.doFill) ctx.fill();else ctx.stroke();
  ctx.closePath();
  ctx.restore();
}
/**
 * draws a double edged arrow
 *
 * @param {*} x1 starting X
 * @param {*} y1 starting Y
 * @param {*} x2 ending X
 * @param {*} y2 ending Y
 * @param {number} [headSize=10] size of first arrow's head
 * @param {*} [headSize2=headSize] size of second arrow's head
 * @param {*} [r=sqrt(3)] width / height
 */


function doubleArrow(x1, y1, x2, y2, tipWidth = 10, tipScaleRatio = 0.6, spacing = 0) {
  const r = Math.atan(tipScaleRatio / 2);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const xd = Math.cos(angle) * tipWidth * Math.cos(r);
  const yd = Math.sin(angle) * tipWidth * Math.cos(r);
  const yDiff = Math.sin(angle) * spacing;
  const xDiff = Math.cos(angle) * spacing;
  arrowHead(x1 + xDiff, y1 + yDiff, tipWidth, Math.PI + angle, tipScaleRatio);
  x1 += xd;
  y1 += yd;
  arrow(x1, y1, x2 - xDiff, y2 - yDiff, tipWidth, tipScaleRatio);
}
/**
 * Creates a numberLine with parameters in a object
 * (default values for each properties are given in square brackets)
 *
 * point1 : <Array> [[-ctx.width / 2, 0]]
 *   starting point of line
 *
 * point2 : <Array> [[ctx.width / 2, 0]]
 *   ending point of line
 *
 * range : <Array> [[-8, 8, 1]]
 *   range of numbers to draw ticks and numbers
 *
 * numbersToExclude : <Array> [defaultValue=[]]
 *   list of numbers that shouldn't be displayed
 *
 * numbersToInclude : <Array> [defaultValue=[]]
 *   list of numbers to be displayed
 *
 * numbersWithElongatedTicks : <Array> [defaultValue=[]]
 *   list of numbers where tick line should be longer
 *
 * includeLeftTip : <boolean> [false]
 *   whether to add an arrow tip at left
 *
 * includeRightTip : <boolean> [false]
 *   whether to add an arrow tip at right
 *
 * tipWidth : <number> [20]
 *   width of arrow tip in px
 *
 * tipSizeRatio : <number> [1]
 *   height/width of tip
 *
 * color : <hex string> [GREY]
 *   color of axis and ticks
 *
 * lineWidth : <number> [3]
 *   width of lines in px
 *
 * includeTick : <boolean> [true]
 *   whether ticks should be added
 *
 * excludeOriginTick : <boolean> [false]
 *   whether exclude ticks at origin (0)
 *
 * longerTickMultiple : <number> [2]
 *   factor to increase height of ticks at elongated ticks
 *
 * tickHeight : <number> [15]
 *   height of ticks in px
 *
 * textDirection : <array> [0, -0.8]
 *   direction of text relative to nearby tick
 *
 * textColor : <hex string> [WHITE]
 *   color of text
 *
 * textSize : <number> [17]
 *   font size of text
 *
 * textRotation : <number> [0]
 *   amount to rotate text
 *
 * decimalPlaces : <number> [number of decimals in step]
 *   number of decimal places in text
 *
 * @returns unit length
 */


function numberLine(config = {}) {
  const ctx = _main.C.workingCanvas;
  const defaultConfigs = {
    length: [ctx.width, "number"],
    rotation: [0],
    center: [[0, 0]],
    range: [[-8, 8, 1], "array"],
    numbersToExclude: [[]],
    numbersToInclude: [[]],
    numbersWithElongatedTicks: [[]],
    includeLeftTip: [false],
    includeRightTip: [false],
    includeNumbers: [true],
    tipWidth: [20, "number"],
    tipSizeRatio: [1, "number"],
    color: [_colors.GREY],
    lineWidth: [3, "number"],
    includeTick: [true],
    excludeOriginTick: [false],
    longerTickMultiple: [1.5, "number"],
    tickHeight: [15, "number"],
    textDirection: [[-0.3, -1]],
    textColor: [_colors.WHITE],
    textSize: [17, "number"],
    textRotation: [0]
  };
  applyDefault(defaultConfigs, config);
  const lineLength = config.length;
  const rotation = config.rotation;
  const center = config.center;
  const numbersToExclude = config.numbersToExclude;
  const numbersToInclude = config.numbersToInclude;
  const numbersWithElongatedTicks = config.numbersWithElongatedTicks;
  const includeLeftTip = config.includeLeftTip;
  const includeRightTip = config.includeRightTip;
  const tipWidth = config.tipWidth;
  const tipSizeRatio = config.tipSizeRatio;
  const color = config.color;
  const lineWidth = config.lineWidth;
  const excludeOriginTick = config.excludeOriginTick;
  const longerTickMultiple = config.longerTickMultiple;
  const tickHeight = config.tickHeight;
  const textDirection = config.textDirection;
  const textSize = config.textSize;
  const textRotation = config.textRotation;
  let decimalPlaces = config.decimalPlaces;
  let range = config.range;

  if (Array.isArray(range) && range.length === 2) {
    range = [range[0], range[1], 1];
  } // if number of decimal places is not defined
  // find it using `step`


  if (isNaN(decimalPlaces)) {
    decimalPlaces = (range[2].toString().split(".")[1] || []).length || 0;
  }

  const min = range[0];
  const max = range[1];
  const step = range[2];
  const totalTicks = (max - min) / step;
  const ds = lineLength / totalTicks;
  const list = getTickList();
  (0, _drawingFunctions.save)();
  (0, _drawingFunctions.translate)(center[0], center[1]);
  (0, _drawingFunctions.rotate)(rotation);
  (0, _drawingFunctions.translate)(-lineLength / 2, 0);
  if (config.includeTick) drawTicks();
  if (config.includeNumbers) drawNumbers();
  (0, _drawingFunctions.translate)(lineLength / 2, 0);
  drawAxis();
  (0, _drawingFunctions.rotate)(-rotation);
  (0, _drawingFunctions.translate)(-center[0], -center[1]);

  function drawAxis() {
    (0, _drawingFunctions.stroke)(color);
    (0, _drawingFunctions.strokeWidth)(lineWidth);
    (0, _drawingFunctions.fill)(color);
    const r = Math.atan(tipSizeRatio / 2);
    let x1 = -lineLength / 2;
    let x2 = lineLength / 2;

    if (includeLeftTip) {
      arrowHead(x1, 0, tipWidth, Math.PI, tipSizeRatio);
      x1 += tipWidth * Math.cos(r);
    }

    if (includeRightTip) {
      arrowHead(x2, 0, tipWidth, 0, tipSizeRatio);
      x2 -= tipWidth * Math.cos(r) * 1;
    }

    (0, _drawingFunctions.line)(x1, 0, x2, 0);
  }

  function drawTicks() {
    (0, _drawingFunctions.stroke)(color);
    (0, _drawingFunctions.strokeWidth)(lineWidth);
    const from = includeLeftTip ? 1 : 0;
    const to = includeRightTip ? list.length - 1 : list.length;

    for (let i = from; i < to && numbersToExclude.indexOf(list[0][i]) < 0; i++) {
      const tick = list[i];
      if (Number(tick) === 0 && excludeOriginTick) continue;
      let TH = tickHeight;

      if (numbersWithElongatedTicks.indexOf(tick) > -1) {
        TH *= longerTickMultiple;
      }

      (0, _drawingFunctions.line)(ds * i, -TH / 2, ds * i, TH / 2);
    }
  }

  function drawNumbers() {
    const numbers = numbersToInclude.length > 0 ? numbersToInclude : list;
    (0, _drawingFunctions.fill)(config.textColor);
    (0, _drawingFunctions.fontSize)(textSize);
    const yShift = -textSize / 3 * Math.cos(textRotation) + textDirection[1] * textSize;
    const from = includeLeftTip ? 1 : 0;
    const to = includeRightTip ? numbers.length - 1 : numbers.length;

    for (let i = from; i < to && numbersToExclude.indexOf(numbers[i]) < 0; i++) {
      const tick = numbers[i].toFixed(decimalPlaces);
      if (Number(tick) === 0 && excludeOriginTick) continue;
      const width = (0, _drawingFunctions.measureText)(tick).width;
      const xShift = -width / 2 * Math.cos(textRotation) + textDirection[0] * textSize + textSize / 2 * Math.sin(textRotation);
      (0, _drawingFunctions.translate)(ds * i + xShift, yShift - width * Math.sin(textRotation));
      (0, _drawingFunctions.rotate)(textRotation);
      (0, _drawingFunctions.text)(tick, 0, 0);
      (0, _drawingFunctions.rotate)(-textRotation);
      (0, _drawingFunctions.translate)(-(ds * i + xShift), -(yShift - width * Math.sin(textRotation)));
    }
  }

  function getTickList() {
    return arange(min, max, step);
  } // unit interval


  (0, _drawingFunctions.restore)();
  return {
    unitLength: ds,
    tickList: list
  };
}
/**
 * creates a numberPlane based on following parameters inside a Object
 * xAxis: <object> params for x axis.
 *   This will be given to numberLine. see {@link numberLine} function for possible values

 * yAxis: <object> params for y axis.
 *   This will be given to numberLine. see {@link numberLine} function for possible values
 *
 * grid : <object> set of styles to draw grid & subgrids
 *
 * possible properties:
 *   lineWidth        : <number> stroke width of grid lines [1],
 *
 *   color            : <hex string> color of grid lines ["#58C4DDA0"],
 *
 *   subgrids         : <number> number of sub-grid division to draw [0],
 *
 *   subgridLineColor : <hex string> color of sub-grids ["#888888A0"],
 *
 *   subgridLineWidth : <number> stroke width of sub-grid [0.7],
 **
 * @param {Object} config
 * @returns {Object} configurations
 */


function numberPlane(config = {}) {
  const ctx = _main.C.workingCanvas; // default configurations

  const xAxisDefaults = {
    textDirection: [[0, -1.1]],
    length: [ctx.width, "number"],
    excludeOriginTick: [true],
    includeLeftTip: [false],
    includeRightTip: [false],
    includeNumbers: [true],
    includeTick: [true]
  };
  const yAxisDefaults = {
    textDirection: [[0, 0.8]],
    length: [ctx.height, "number"],
    textRotation: [-Math.PI / 2, "number"],
    excludeOriginTick: [true],
    includeLeftTip: [false],
    includeRightTip: [false],
    includeNumbers: [true],
    includeTick: [true]
  };
  const gridDefaults = {
    lineWidth: [1, "number"],
    color: [_colors.BLUE_C + "a0"],
    subgrids: [1, "number"],
    subgridLineColor: [_colors.GREY + "50"],
    subgridLineWidth: [0.7, "number"]
  }; // configurations

  const xAxis = applyDefault(xAxisDefaults, config.xAxis);
  const yAxis = applyDefault(yAxisDefaults, config.yAxis);
  const grid = applyDefault(gridDefaults, config.grid); // other configurations

  const subgrids = grid.subgrids;
  const center = config.center || [0, 0]; // range of ticks in each axis

  const xRange = xAxis.range || [-8, 8, 1];
  const yRange = yAxis.range || [-8, 8, 1]; // number of ticks in each

  const xNums = (xRange[1] - xRange[0]) / xRange[2];
  const yNums = (yRange[1] - yRange[0]) / yRange[2]; // unit length of each axis

  const xDX = xAxis.length / xNums;
  const yDX = yAxis.length / yNums; // coordinates of bounding rectangle of the graph

  const xMin = xRange[0] / xRange[2] * xDX;
  const xMax = xRange[1] / xRange[2] * xDX;
  const yMin = yRange[0] / yRange[2] * yDX;
  const yMax = yRange[1] / yRange[2] * yDX; // variables to shift 0 ticks of axes to center

  const xShift = xAxis.length / 2 + xMin;
  const yShift = yAxis.length / 2 + yMin; // size of a subgrid unit cell

  const subgridUnit = [xDX / subgrids, yDX / subgrids];
  (0, _drawingFunctions.save)(); // translate to center

  (0, _drawingFunctions.translate)(center[0] + xShift, center[1]); // draw grids

  drawGridLines(); // draws axes

  const axesLines = axes({
    xAxis: xAxis,
    yAxis: yAxis
  }); // size of a unit cell

  const unit = axesLines.unit; // reverse the effect of overall shift

  (0, _drawingFunctions.translate)(-(center[0] + xShift), -center[1] - yShift);

  function drawGridLines() {
    // major grid lines
    (0, _drawingFunctions.translate)(xMin, 0);
    const subgridxDX = subgridUnit[0];
    const subgridyDX = subgridUnit[1]; // horizontal grid lines

    for (let i = 0; i <= xNums; i++) {
      // draw major grid lines
      drawMajor(i * xDX, // x - shift
      0, // y - shift
      0, yMin, 0, yMax); // draw subgrid grid lines

      for (let k = 1; k <= subgrids && i < xNums; k++) {
        drawMinor(k * subgridxDX, yMin, k * subgridxDX, yMax);
      }

      (0, _drawingFunctions.translate)(-i * xDX);
    }

    (0, _drawingFunctions.translate)(-xMin, yMin); // vertical grid lines

    for (let i = 0; i <= yNums; i++) {
      // draw major grid lines
      drawMajor(0, // x - shift
      i * yDX, // y - shift
      xMin, 0, xMax, 0); // draw subgrid grid lines

      for (let k = 1; k <= subgrids && i < yNums; k++) {
        drawMinor(xMin, k * subgridyDX, xMax, k * subgridyDX);
      }

      (0, _drawingFunctions.translate)(0, -i * yDX);
    }

    (0, _drawingFunctions.translate)(0, -yMin);

    function drawMajor(shiftX, shiftY, x1, y1, x2, y2) {
      (0, _drawingFunctions.translate)(shiftX, shiftY);
      (0, _drawingFunctions.strokeWidth)(grid.lineWidth);
      (0, _drawingFunctions.stroke)(grid.color);
      (0, _drawingFunctions.line)(x1, y1, x2, y2);
    }

    function drawMinor(x1, y1, x2, y2) {
      (0, _drawingFunctions.strokeWidth)(grid.subgridLineWidth);
      (0, _drawingFunctions.stroke)(grid.subgridLineColor);
      (0, _drawingFunctions.line)(x1, y1, x2, y2);
    }
  }

  (0, _drawingFunctions.restore)();
  return {
    unit: unit,
    // major unit size
    subgridUnit: subgridUnit,
    // subgrid unit size
    xAxis: axesLines.xAxis,
    // x axis confiurations from numberLine
    yAxis: axesLines.yAxis // y axis confiurations from numberLine

  };
}

},{"../constants/colors.js":1,"../main.js":10,"./drawing-functions.js":6}],9:[function(require,module,exports){
"use strict";

var COLORLIST = _interopRequireWildcard(require("./constants/colors.js"));

var DrawingConstants = _interopRequireWildcard(require("./constants/drawing.js"));

var MathConsts = _interopRequireWildcard(require("./constants/math.js"));

var _color = require("./functions/color.js");

var _defineProperties = require("./functions/defineProperties.js");

var CFunctions = _interopRequireWildcard(require("./functions/drawing-functions.js"));

var MathFunctions = _interopRequireWildcard(require("./functions/math.js"));

var extras = _interopRequireWildcard(require("./functions/more-things.js"));

var _main = require("./main.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// export to window scope
(0, _defineProperties.defineProperties)(MathConsts, window, false);
(0, _defineProperties.defineProperties)(MathFunctions);
(0, _defineProperties.defineProperties)(Object.assign({
  "TRANSPARENT": "rgba(0,0,0,0)"
}, COLORLIST), window, false);
(0, _defineProperties.defineProperties)(DrawingConstants, window, false);
(0, _defineProperties.defineProperties)({
  "COLORLIST": COLORLIST
}, window, false);
(0, _defineProperties.defineProperties)(_defineProperties.defineProperties, _main.C);
(0, _defineProperties.defineProperties)({
  RGBToHSL: _color.RGBToHSL,
  HSLToRGB: _color.HSLToRGB,
  RGBToHSV: _color.RGBToHSV,
  HSVToRGB: _color.HSVToRGB
});
(0, _defineProperties.defineProperties)(CFunctions);

_main.C.addExtension(extras);

},{"./constants/colors.js":1,"./constants/drawing.js":2,"./constants/math.js":3,"./functions/color.js":4,"./functions/defineProperties.js":5,"./functions/drawing-functions.js":6,"./functions/math.js":7,"./functions/more-things.js":8,"./main.js":10}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.C = C;

var _defineProperties = require("./functions/defineProperties.js");

// main file; defines C function
const defaultConfig = {
  width: 200,
  // width of canvas multiplied by dpr
  height: 200,
  // height of canvas  multiplied by dpr
  dpr: Math.ceil(devicePixelRatio || 1),
  // device pixel ratio for clear drawings
  // states
  doFill: true,
  doStroke: true,
  pathStarted: false,
  // color stuff
  fillStyle: "#ffffff",
  strokeStyle: "#000000",
  colorMode: "rgba",
  // font properties
  fontSize: "20px",
  fontFamily: "sans-serif",
  fontStyle: "normal",
  fontVariant: "normal",
  fontWeight: "normal",
  fontStretch: "normal",
  lineHeight: "1.2"
};

function assignDefaultConfigs(cfgs) {
  for (let i = 0, properties = Object.keys(defaultConfig); i < properties.length; i++) {
    const property = properties[i];
    if (cfgs[property] === undefined) cfgs[property] = defaultConfig[property];
  }
}
/**
 * Main Function
 * @param {function} fx codes to exeecute
 * @param {HTMLElement} [container=document.body] container for the drawings
 * @param {object} [configs={}] configurations
 */


function C(fx, container = document.body, configs = {}) {
  // assign configs
  assignDefaultConfigs(configs); // initialize canvas

  let canvas = C.makeCanvas(configs);

  if (typeof container === "string") {
    container = document.querySelector(container);
  }

  let canvasName;

  if (configs.name != undefined) {
    canvasName = configs.name;
    const cvs = document.getElementById(canvasName);

    if (cvs instanceof HTMLElement) {
      // if already exist
      canvas = cvs;
      prepareCanvas();
      fx();
      return;
    }
  } else {
    // finds a name for canvas that already don't exist
    while (document.getElementById("canvas-" + C.nameID) != undefined) {
      C.nameID++;
    }

    canvasName = "canvas-" + C.nameID;
    configs.name = canvasName;
  }

  function prepareCanvas() {
    // add additional information to rendererContext
    C.resizeCanvas(canvas, configs);
    canvas.context = Object.assign(canvas.getContext("2d"), configs);
    canvas.context.setTransform(configs.dpr, 0, 0, configs.dpr, 0, 0);
    C.workingCanvas = canvas.context;
  } // set canvas's id and class to its name


  canvas.id = canvasName;
  canvas.classList.add(canvasName); // add canvas to container

  container.appendChild(canvas);
  prepareCanvas();
  C.canvasList[canvasName] = canvas.context;
  fx();
}

C.canvasList = {};
/** @type {Number} */

C.nameID = 0;
/** @type {CanvasRenderingContext2D} */

C.workingCanvas = undefined; // index of current working canvas in `canvasList`

/**
 * return inner width of container tag
 * @param {HTMLElement} [container=document.body]
 * @returns {Number}
 */

C.getContainerWidth = function (container = document.body) {
  const cs = window.getComputedStyle(container);
  return parseInt(cs.width) - parseInt(cs.marginLeft) - parseInt(cs.marginRight) - parseInt(cs.paddingRight) - parseInt(cs.paddingLeft);
};
/**
 * set width and height attribute of canvas element to the given values in `configs`
 * and scales CSS width and height to DPR
 *
 * values needed in `configs`:
 *
 *   width: <Number> width in pixels
 *
 *   height: <Number> height in pixels
 *
 *   dpr: <Number> dpr
 * @param {HTMLCanvasElement} cvs
 * @param {Object} configs
 */


C.resizeCanvas = function (cvs, configs) {
  const width = configs.width;
  const height = configs.height;
  const dpr = configs.dpr;
  cvs.style.width = width + "px";
  cvs.style.height = height + "px";
  cvs.width = dpr * width;
  cvs.height = dpr * height;
};
/**
 * returns a canvas element with given params
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
 * add extension to window and C extension list
 *
 * @param {Object} extObj
 * @param {boolean} editable warn the edit of functions
 */


C.addExtension = function (extObj, editable) {
  (0, _defineProperties.defineProperties)(extObj, window, !editable);
  (0, _defineProperties.defineProperties)(extObj, C.extensions, !editable);
}; // register to window


window.C = C;

},{"./functions/defineProperties.js":5}]},{},[9]);
