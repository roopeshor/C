(function () {
  // ------ constants.js -------
  // defines constants
  /**
   * defines new properties to a given Object
   *
   * @param {object} obj source object
   * @param {object} [toAssign=window] target object
   * @param {boolean} [specific=true] whether to define properties special
   * @param {function} [msg] msg given on redefining value. Only works if `specific == true`
   */
  function defineProperties(obj, toAssign, specific, msg) {
    toAssign = toAssign || window;
    specific = specific == undefined || specific == null ? window : specific;
    toAssign = toAssign || window;
    msg =
      typeof msg == "function"
        ? msg
        : function (k) {
            console.warn(
              'You changed value of "' + k + '" which C uses. Be careful'
            );
          };
    for (var i = 0, props = Object.keys(obj); i < props.length; i++) {
      // definer in IIFE to avoid assigning same values to all properties
      if (specific) {
        (function (name, value, toAssign, msg) {
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
              msg(name);
            },
          });
        })(props[i], obj[props[i]], toAssign, msg);
      } else {
        window[props[i]] = obj[props[i]];
      }
    }
  }

  var mathConsts = {
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
        return sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
      },
      randomInt: function (max = 10, min = 0) {
        return Math.round(Math.random() * (max - min) + min);
      },
      sigmoid: function sigmoid(x) {
        return 1.0 / (1 + Math.exp(-x));
      },

      limit: function limit(x, mi = 0, ma = 1) {
        return Math.min(Math.max(x, mi), ma);
      },
    },
    drawingConstants = {
      BUTT: "butt",
      SQUARE: "square",
      ROUND: "round",
      MILTER: "milter",
    },
    _COLORLIST = {
      // from Manim
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
    };

  defineProperties(mathConsts, window, false);
  defineProperties(drawingConstants, window, false);
  defineProperties(mathFunctions);
  defineProperties(
    // add transparent color
    Object.assign({ TRANSPARENT: "rgba(0,0,0,0)" }, _COLORLIST),
    window,
    false
  );
  defineProperties({ COLORLIST: _COLORLIST });

  //------ helpers.js -------
  var helpers = {};

  /**
   * return inner width of container tag
   * @param {HTMLElement} [container=document.body]
   * @returns {Number}
   */
  helpers.getContainerWidth = function (container = document.body) {
    var cs = window.getComputedStyle(container);
    return (
      parseInt(cs.width) -
      parseInt(cs.marginLeft) -
      parseInt(cs.marginRight) -
      parseInt(cs.paddingRight) -
      parseInt(cs.paddingLeft)
    );
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
  helpers.getResizedCanvas = function (cvs, configs) {
    var width = configs.width;
    var height = configs.height;
    var dpr = configs.dpr;
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
  helpers.makeCanvas = function (configs) {
    var cvs = document.createElement("canvas");
    this.getResizedCanvas(cvs, configs);
    return cvs;
  };

  defineProperties(helpers);

  // -------- colors.js ---------

  /*
TODO decide whether to use global COLORLIST or color list in constants.js
Because developer can edit COLORLIST array and can see effect on color randomizers
*/
  var __definedColors__ = Object.keys(window.COLORLIST);

  // color randomizers
  var randomizers = {};

  /**
   * returns a random hex color
   */
  randomizers.randomColor = function () {
    var color = "#";
    for (var i = 0; i < 3; i++) {
      var randNum = randomInt(255).toString(16);
      randNum = randNum.length == 1 ? 0 + randNum : randNum;
      color += randNum;
    }
    return color;
  };

  /**
   * picks a random color from defined ones
   */
  randomizers.randomDefinedColor = function () {
    return COLORLIST[
      __definedColors__[randomInt(__definedColors__.length - 1)]
    ];
  };

  var colorConverters = {};

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
  colorConverters.RGBToHSL = function (red, green, blue) {
    var r = red / 255,
      g = green / 255,
      b = blue / 255;
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var hue,
      saturation,
      lightness = (max + min) / 2;

    if (max == min) {
      hue = saturation = 0; // achromatic
    } else {
      var d = max - min;
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
  };

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
  colorConverters.HSLToRGB = function (hue, saturation, lightness) {
    var r, g, b;
    hue /= 360;
    if (saturation == 0) {
      r = g = b = lightness; // achromatic
    } else {
      var q =
        lightness < 0.5
          ? lightness * (1 + saturation)
          : lightness + saturation - lightness * saturation;
      var p = 2 * lightness - q;
      r = hue2RGB(p, q, hue + 1 / 3);
      g = hue2RGB(p, q, hue);
      b = hue2RGB(p, q, hue - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
  };

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
  colorConverters.RGBToHSV = function (red, green, blue) {
    var r = red / 255,
      g = green / 255,
      b = blue / 255;
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var hue,
      saturation,
      value = max;

    var d = max - min;
    saturation = max == 0 ? 0 : d / max;

    if (max == min) {
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
  };

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
  colorConverters.HSVToRGB = function (hue, saturation, value) {
    var r, g, b;
    var i = Math.floor(hue / 60);
    var f = hue / 60 - i;
    var p = value * (1 - saturation);
    var q = value * (1 - f * saturation);
    var t = value * (1 - (1 - f) * saturation);

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
  };

  defineProperties(randomizers);
  defineProperties(colorConverters);

  // -------- main.js ----------
  // main file; defines C function
  const defaultConfig = {
    width: 200,
    height: 200,
    dpr: ceil(devicePixelRatio || 1), // device pixel ratio for clear drawings
    _doFill: true,
    _doStroke: true,
    fillStyle: WHITE,
    strokeStyle: BLACK,
    fontSize: "20px",
    fontfamily: "sans-serif",
    _ColorMode: "rgba",
  };

  function assignDefaultConfigs(cfgs) {
    for (
      var i = 0, properties = Object.keys(defaultConfig);
      i < properties.length;
      i++
    ) {
      var property = properties[i];
      if (cfgs[property] == undefined) cfgs[property] = defaultConfig[property];
    }
  }

  /**
   * Main Function
   * @param {function} fx codes to exeecute
   * @param {HTMLElement} container container for the drawings [default:body element]
   * @param {object} [configs={}] configurations
   */
  function _C(fx, container = document.body, configs = {}) {
    // assign configs
    assignDefaultConfigs(configs);

    // initialize canvas
    var canvas = makeCanvas(configs);

    if (typeof container == "string")
      container = document.querySelector(container);
    var canvasName;
    if (configs.name != undefined) {
      canvasName = configs.name;
      var cvs = document.getElementById(canvasName);
      if (cvs != undefined) {
        // if already exist
        canvas = cvs;
        prepareCanvas();
        fx();
        return;
      }
    } else {
      // finds a name for canvas that already don't exist
      while (document.getElementById("canvas-" + _C.nameID) != undefined) {
        _C.nameID++;
      }

      canvasName = "canvas-" + _C.nameID;
      configs.name = canvasName;
    }
    function prepareCanvas() {
      // add additional information to rendererContext
      getResizedCanvas(canvas, configs);
      canvas.context = Object.assign(canvas.getContext("2d"), configs);
      canvas.context.setTransform(configs.dpr, 0, 0, configs.dpr, 0, 0);
      _C.workingCanvas = canvas.context;
    }
    // set canvas's id and class to its name
    canvas.id = canvasName;
    canvas.classList.add(canvasName);
    // add canvas to container
    container.appendChild(canvas);
    prepareCanvas();
    _C.canvasList[canvasName] = canvas.context;
    fx();
  }

  _C.canvasList = {};
  _C.nameID = 0;
  _C.workingCanvas = undefined; // index of current working canvas in `canvasList`

  /**
   * add extension to window and _C
   * @param {Object} extObj
   */
  _C.addExtension = function (extObj, editable) {
    defineProperties(extObj, window, !editable);
    defineProperties(extObj, C.extensions, !editable);
  };

  window.C = _C;
  // ------- drawing-functions.js ---------
  function readColor(colors) {
    var color1,
      color2,
      color3,
      alpha = 255,
      read = "";
    if (typeof colors[0] == "number") {
      if (colors.length == 1) {
        color1 = colors[0];
        color2 = color1;
        color3 = color1;
      } else if (colors.length == 2) {
        color1 = colors[0];
        color2 = colors[1];
        color3 = 0;
      } else if (colors.length == 3) {
        color1 = colors[0];
        color2 = colors[1];
        color3 = colors[2];
      } else if (colors.length == 4) {
        color1 = colors[0];
        color2 = colors[1];
        color3 = colors[2];
        alpha = colors[3];
      }
      var mode = C.workingCanvas._ColorMode;
      if (mode == "HSL") {
        read = `hsl(${color1}, ${color2}, ${color3})`;
      } else if (mode == "rgb") {
        read = `rgb(${color1}, ${color2}, ${color3})`;
      } else if (mode == "rgba") {
        read = `rgba(${color1}, ${color2}, ${color3}, ${alpha})`;
      }
    } else {
      read = colors[0];
    }
    return read;
  }

  // C drawing functions
  var CFunctions = {};

  /**
   * Draws a line
   *
   * @param {number} x1 initial x coord
   * @param {number} y1 initial y coord
   * @param {number} x2 final x coord
   * @param {number} y2 final y coord
   */
  CFunctions.line = function (x1, y1, x2, y2) {
    var ctx = C.workingCanvas;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  };

  /**
   * Move to a given point
   *
   * @param {number} x
   * @param {number} y
   */
  CFunctions.moveTo = function (x, y) {
    var ctx = C.workingCanvas;
    if (!ctx._pathStart) ctx.beginPath();
    ctx.moveTo(x, y);
  };

  /**
   * draws a line to given coords
   *
   * @param {number} x
   * @param {number} y
   */
  CFunctions.lineTo = function (x, y) {
    C.workingCanvas.lineTo(x, y);
  };

  /**
   * Sets background to a given value
   *
   * Accepted values:
   * ⦿ a hex string (#fff, #acf2dc)
   * ⦿ a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
   * ⦿ a array of numbers ([0, 244, 34])
   */
  CFunctions.background = function () {
    var col = readColor(arguments);
    var ctx = C.workingCanvas;
    ctx.backgroundColor = col;
    ctx.save();
    this.rest();
    ctx.fillStyle = col;
    ctx.fillRect(0, 0, ctx.width, ctx.height);
    ctx.restore();
  };

  /**
   * Clears a rectangular portion of canvas
   *
   * @param {number} x starting x
   * @param {number} y starting y
   * @param {number} width
   * @param {number} height
   */
  CFunctions.clear = function (x, y, width, height) {
    var ctx = C.workingCanvas;
    x = x || 0;
    y = y || 0;
    width = width || ctx.width;
    height = height || ctx.height;
    ctx.clearRect(x, y, width, height);
  };

  /**
   * Captures the current drawings in canvas and set it to
   * css background stretching the entire canvas
   */
  CFunctions.permaBackground = function () {
    var dat = this.getCanvasData();
    var cvs = C.workingCanvas.canvas;
    cvs.style.background = 'url("' + dat + '")';
    cvs.style.backgroundPosition = "center";
    cvs.style.backgroundSize = "cover";
  };

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
  CFunctions.setTransform = function (a1, a2, a3, a4, a5, a6) {
    var ctx = C.workingCanvas;
    ctx.setTransform(a1, a2, a3, a4, a5, a6);
    ctx.scale(ctx.dpr, ctx.dpr);
  };

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
  CFunctions.transform = function (a1, a2, a3, a4, a5, a6) {
    C.workingCanvas.transform(a1, a2, a3, a4, a5, a6);
  };

  /**
   * Prevent filling inside further shapes
   */
  CFunctions.noFill = function () {
    C.workingCanvas._doFill = false;
  };

  /**
   * Prevent drawing strokes of further shapes
   */
  CFunctions.noStroke = function () {
    C.workingCanvas._doStroke = false;
  };

  /**
   * Translates (moves) canvas to a position
   *
   * @param {number} x
   * @param {number} [y=0]
   */
  CFunctions.translate = function (x, y = 0) {
    C.workingCanvas.translate(x, y);
  };

  CFunctions.setImageSmoothing = function (bool) {
    C.workingCanvas.imageSmoothingEnabled = !!bool;
  };

  /**
   * sets the stroke width (width/weight of line) in px
   *
   * @param {number} w
   */
  CFunctions.strokeWidth = function (w) {
    C.workingCanvas.lineWidth = Number(w);
  };

  /**
   * scales the canvas by a given amount
   *
   * @param {number} x
   * @param {number} [y=x]
   */
  CFunctions.scale = function (x, y = x) {
    C.workingCanvas.scale(x, y);
  };

  /**
   * Rotates the canvas
   *
   * @param {number} angle angle in radians
   */
  CFunctions.rotate = function (angle) {
    C.workingCanvas.rotate(angle);
  };

  /**
   * saves the current state of canvas
   */
  CFunctions.save = function () {
    C.workingCanvas.save();
  };

  /**
   * set the type of line end
   *
   * @param {string} capType
   */
  CFunctions.lineCap = function (capType) {
    C.workingCanvas.lineCap = capType;
  };

  /**
   * sets type of line joining
   * @param {string} joinType
   */
  CFunctions.lineJoin = function (joinType) {
    C.workingCanvas.lineJoin = joinType;
  };

  /**
   * restore the saved state of canvas
   */
  CFunctions.restore = function () {
    C.workingCanvas.restore();
  };

  /**
   * returns fill color/gradient
   * @returns {string|CanvasGradient}
   */
  CFunctions.getFill = function () {
    return C.workingCanvas.fillStyle;
  };

  /**
   * returns stroke color/gradient
   * @returns {string|CanvasGradient}
   */
  CFunctions.getStroke = function () {
    return C.workingCanvas.strokeStyle;
  };

  /**
   * reset the applied transform to idendity matrix multiplied by dpr
   */
  CFunctions.rest = function () {
    var ctx = C.workingCanvas;
    var d = ctx.dpr;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };

  /**
   * Sets stroke color to a given value if value is given
   * else strokes the previous shape
   *
   * Accepted values:
   * ⦿ a hex string (#fff, #acf2dc)
   * ⦿ a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
   * ⦿ a array of numbers ([0, 244, 34])
   */
  CFunctions.stroke = function () {
    var ctx = C.workingCanvas;
    if (arguments.length != 0) {
      var col = readColor(arguments);
      ctx.strokeStyle = col;
      ctx._doStroke = true;
    } else {
      ctx.stroke();
    }
  };

  /**
   * Sets fill color to a given value if value is given
   * else fills the previous shape
   *
   * Accepted values:
   * ⦿ a hex string (#fff, #acf2dc)
   * ⦿ a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
   * ⦿ a array of numbers ([0, 244, 34])
   */
  CFunctions.fill = function () {
    var ctx = C.workingCanvas;
    if (arguments.length != 0) {
      var col = readColor(arguments);
      ctx.fillStyle = col;
      ctx._doFill = true;
    } else {
      ctx.fill();
    }
  };

  /**
   * returns fill&stroke color/gradient, line width, fill&stroke state
   * @returns {Object}
   */
  CFunctions.getDrawConfigs = function () {
    var ctx = C.workingCanvas;
    return {
      stroke: ctx.strokeStyle,
      fill: ctx.fillStyle,
      strokeWidth: ctx.lineWidth,
      doStroke: ctx._doStroke,
      doFill: ctx._doFill,
    };
  };

  /**
   * draw a arc
   *
   * @param {number} x x-coord
   * @param {number} y y-coord
   * @param {number} r radius
   * @param {number} [startingAngle=0] starting angle
   * @param {number} [endingAngle=PI*2] ending angle
   */
  CFunctions.arc = function (x, y, r, startingAngle, endingAngle) {
    startingAngle = startingAngle || 0;
    var ctx = C.workingCanvas;
    ctx.beginPath();
    ctx.arc(
      x,
      y,
      r,
      startingAngle || 0,
      isNaN(endingAngle) ? Math.PI * 2 : endingAngle
    );
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) ctx.stroke();
    ctx.closePath();
  };

  /**
   * draws a text
   *
   * @param {string} text text to draw
   * @param {number} x x-coord
   * @param {number} [y=x] y-coord
   * @param {number} [maxwidth=undefined] maximum width
   */
  CFunctions.text = function (text, x, y = x, maxwidth = undefined) {
    var ctx = C.workingCanvas;
    if (ctx._doFill) ctx.fillText(text, x, y, maxwidth);
    else if (ctx._doStroke) ctx.strokeText(text, x, y, maxwidth);
  };

  /**
   * draws a rectangle
   *
   * @param {number} x x-coord
   * @param {number} y y-coord
   * @param {number} width widht
   * @param {number} height height
   */
  CFunctions.rect = function (x, y, width, height) {
    var ctx = C.workingCanvas;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) ctx.stroke();
  };

  /**
   * draws circle
   *
   * @param {number} x x-coord
   * @param {number} y y-coord
   * @param {number} r radius
   */
  CFunctions.circle = function (x, y, r) {
    var ctx = C.workingCanvas;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) ctx.stroke();
    ctx.closePath();
  };

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
  CFunctions.polygon = function () {
    var args = arguments;
    if (args.length > 2) {
      var ctx = C.workingCanvas,
        start = args[0];
      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);
      for (var i = 1; i < args.length; i++) {
        ctx.lineTo(args[i][0], args[i][1]);
      }
      ctx.lineTo(start[0], start[1]);
      if (ctx._doFill) ctx.fill();
      if (ctx._doStroke) ctx.stroke();
      ctx.closePath();
    }
  };

  /**
   * draws ellipse
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
  CFunctions.ellipse = function (
    x,
    y,
    radius1,
    radius2,
    rotation = 0,
    startAngle = 0,
    endAngle = Math.PI * 2,
    anticlockwise = false
  ) {
    var ctx = C.workingCanvas;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      radius1,
      radius2,
      rotation,
      startAngle,
      endAngle,
      anticlockwise
    );
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) ctx.stroke();
    ctx.closePath();
  };

  CFunctions.bezierCurve = function (x1, y1, x2, y2, x3, y3) {
    var ctx = C.workingCanvas,
      pathStarted = ctx._pathStart;
    if (!pathStarted) ctx.beginPath();

    ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);

    if (pathStarted) return;
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) ctx.stroke();
    ctx.closePath();
  };

  /**
   * starts a new loop
   * @param {function} fx
   * @param {string} canvasName
   * @param {number} dx
   */
  CFunctions.loop = function (fx, canvasName, dx) {
    var ctx = C.workingCanvas;
    if (!canvasName) {
      canvasName = ctx.name;
    } else {
      ctx = C.canvasList[canvasName];
    }
    if (dx != undefined) {
      ctx.currentLoop = setInterval(function () {
        C.workingCanvas = ctx;
        fx();
      }, dx);
    } else {
      a();
    }
    function a() {
      C.workingCanvas = ctx;
      ctx.currentLoop = window.requestAnimationFrame(a);
      fx();
    }
  };

  /**
   * stops current loop
   */
  CFunctions.noLoop = function () {
    var ctx = C.workingCanvas;
    clearInterval(ctx.currentLoop);
    window.cancelAnimationFrame(ctx.currentLoop);
  };

  /**
   * starts a new Path
   */
  CFunctions.startPath = function () {
    var ctx = C.workingCanvas;
    ctx.beginPath();
    ctx._pathStart = true;
  };

  /**
   * ends current Path
   */
  CFunctions.endPath = function () {
    var ctx = C.workingCanvas;
    ctx.closePath();
    ctx._pathStart = false;
  };

  /**
   * return current font
   * @returns {string}
   */
  CFunctions.getFont = function () {
    var ctx = C.workingCanvas;
    return ctx.fontSize + " " + ctx.fontFamily;
  };

  /**
   * returns text metrics
   * @param {string} text
   * @returns {TextMetrics}
   */
  CFunctions.measureText = function (text) {
    return C.workingCanvas.measureText(text);
  };

  /**
   * sets font size
   * @param {number|string} size
   */
  CFunctions.fontSize = function _fontSize(size) {
    var ctx = C.workingCanvas;
    size = typeof size == "number" ? size + "px" : size;
    ctx.fontSize = size;
    ctx.font = this.getFont();
  };

  /**
   * sets font family
   * @param {string} family
   */
  CFunctions.fontFamily = function _fontFamily(family) {
    var ctx = C.workingCanvas;
    ctx.fontFamily = family;
    ctx.font = this.getFont();
  };

  /**
   * returns canvas image data
   *
   * @param {string} datURL
   * @returns {string}
   */
  CFunctions.getCanvasData = function _getCanvasData(datURL = "image/png") {
    return C.workingCanvas.canvas.toDataURL(datURL);
  };

  /**
   * save the canvas as image
   *
   * @param {string} [name="drawing"]
   * @param {string} [datURL="image/png"]
   */
  CFunctions.saveCanvas = function _saveCanvas(
    name = "drawing",
    datURL = "image/png"
  ) {
    var link = this.getCanvasData().replace(datURL, "image/octet-stream");
    var a = document.createElement("a");
    a.download = name + ".png";
    a.href = link;
    a.click();
  };

  // more functions

  /**
   * draws a point with given size in pixels
   *
   * @param {number} x
   * @param {number} y
   * @param {number} [size=1] diameter of point
   */
  CFunctions.point = function (x, y, size = 1) {
    var ctx = C.workingCanvas;
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  /**
   * draws square
   *
   * @param {number} x
   * @param {number} y
   * @param {number} sideLength
   */
  CFunctions.square = function (x, y, sideLength) {
    this.rect(x, y, sideLength, sideLength);
  };

  /**
   * draws a sector
   *
   * @param {number} x
   * @param {number} y
   * @param {number} innerRadius
   * @param {number} outerRadius
   * @param {number} startAngle
   * @param {number} endAngle
   * @param {string|CanvasGradient} [backgroundFill=C.workingCanvas.backgroundColor] Color of inner Circle
   */
  CFunctions.sector = function (
    x,
    y,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    backgroundFill
  ) {
    var ctx = C.workingCanvas;
    ctx.moveTo(x, y);
    var _fill = this.getFill();
    ctx.arc(x, y, outerRadius, startAngle, endAngle);
    this.fill(backgroundFill || C.workingCanvas.backgroundColor);
    ctx.arc(x, y, innerRadius, startAngle, endAngle);
    this.fill(_fill);
  };

  /**
   * draws quadrilateral
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number} x3
   * @param {number} y3
   * @param {number} x4
   * @param {number} y4
   */
  CFunctions.quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    var ctx = C.workingCanvas;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x1, y1);

    ctx.lineTo(x1, y1);
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) ctx.stroke();
    ctx.closePath();
  };

  /**
   * draws triangle
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number} x3
   * @param {number} y3
   */
  CFunctions.triangle = function (x1, y1, x2, y2, x3, y3) {
    var ctx = C.workingCanvas;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x1, y1);
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) ctx.stroke();
    ctx.closePath();
  };

  /**
   * draws equilateral triangle
   *
   * @param {number} x
   * @param {number} y
   * @param {number} sideLength length of side
   * @param {number} [rotation=0]
   */
  CFunctions.equiTriangle = function (x, y, sideLength, rotation = 0) {
    this.regularPolygon(x, y, 3, sideLength, rotation);
  };

  /**
   * Draws a regular polygon with centre position number of sides length of a side and rotation
   * @param {number} x x position
   * @param {number} y y position
   * @param {number} sides number of sides
   * @param {number} sideLength length of a side
   * @param {number} [rotation=0] rotation
   */
  CFunctions.regularPolygon = function (x, y, sides, sideLength, rotation = 0) {
    sideLength = sideLength / (2 * Math.sin(Math.PI / sides)); // finds radius
    this.regularPolygonWithRadius(x, y, sides, sideLength, rotation);
  };

  /**
   * Draws a regular polygon that is inside a circle
  
   * @param {number} x x coord
   * @param {number} y y coord
   * @param {number} sides number of sides
   * @param {number} radius radius
   * @param {number} [rotation=0] rotation
   */
  CFunctions.regularPolygonWithRadius = function (
    x,
    y,
    sides,
    radius,
    rotation = 0
  ) {
    var i = 0;
    var e = (Math.PI * 2) / sides;
    var ctx = C.workingCanvas;
    rotation += e / 2;
    var initial = [
      Math.cos(rotation) * radius + x,
      Math.sin(rotation) * radius + y,
    ];
    ctx.beginPath();
    ctx.moveTo(initial[0], initial[1]);
    while (i++ < sides) {
      ctx.lineTo(
        Math.cos(i * e + rotation) * radius + x,
        Math.sin(i * e + rotation) * radius + y
      );
    }
    ctx.lineTo(initial[0], initial[1]);
    ctx.closePath();
    if (ctx._doFill) ctx.fill();
    if (ctx._doStroke) ctx.stroke();
  };

  let dxList = [],
    total = 0,
    recent = window.performance.now();

  /**
   * returns FPS (Frames Per Second)
   * @param {number} keepDat number of recorded frames to remember
   * @returns {number}
   */
  CFunctions.getFPS = function (keepDat = 100) {
    var now = window.performance.now(),
      dx = now - recent;
    dxList.push(dx);
    total += dx;
    recent = now;
    if (dxList.length > keepDat) total -= dxList.shift();
    return (dxList.length / total) * 1000;
  };

  /**
   * creates a linear gradient
   *
   * @param {array} p1 initial point as [x, y]
   * @param {array} p2 final point as [x, y]
   * @param {Object|array} colorStops color stops
   ```js
  var color = linearGradient(
    [0, 0],
    [200, 0],
    {
        0: "green",
        0.5: "cyan",
        1: "yellow"
    }
  );
  ```
   */
  CFunctions.linearGradient = function _linearGradient(p1, p2, colorStops) {
    var ctx = C.workingCanvas;
    var gradient = ctx.createLinearGradient(p1[0], p1[1], p2[0], p2[1]);
    if (Array.isArray(colorStops)) {
      let stops = {};
      var step = 1 / colorStops.length;
      for (var i = 0; i < colorStops.length; i++) {
        stops[step * i] = colorStops[i];
      }
      colorStops = stops;
    }
    for (let stops = Object.keys(colorStops), i = 0; i < stops.length; i++) {
      var stop = stops[i];
      gradient.addColorStop(stop, colorStops[stop]);
    }
    return gradient;
  };

  C.functions = CFunctions;

  defineProperties(C.functions);
})();
