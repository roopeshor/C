(function (w) {
  /**
   * defines new properties to a given Object
   *
   * @param {Object} obj source object
   * @param {boolean} [specific=true] whether to create a specific object
   * @param {Object} [toAssign=window] target object
   * @param {Function} [message] message given on redefining value
   */
  function _defineProperties(obj, toAssign = window, specific = true, message) {
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
  var exports = [
    function () {
      /* Constants.js*/
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

      _defineProperties(mathConsts);
      _defineProperties(mathFunctions);
      _defineProperties(drawingConstants, window, false);
      _defineProperties({ drawingConstants: _defineProperties });
    },
    function () {
      /* helpers.js */
      /**
       * return inner width of body tag
       * @returns {Number}
       */
      function _getContentWidth() {
        var cs = window.getComputedStyle(document.body);
        return (
          window.innerWidth - parseInt(cs.marginLeft) - parseInt(cs.marginRight)
        );
      }

      /**
       * add extension to window and C
       *
       * @param {Object} extObj
       */
      function _addExtension(extObj, editable) {
        _defineProperties(extObj, window, !editable);
        defineProperties(extObj, C.extensions, !editable);
      }

      function _getResizedCanvas(cvs, cfgs) {
        var width = cfgs.width;
        var height = cfgs.height;
        var dpr = cfgs.dpr;
        cvs.style.width = width + "px";
        cvs.style.height = height + "px";
        cvs.width = dpr * width;
        cvs.height = dpr * height;
      }
      /**
       * create canvas with given parameters
       */
      function _makeCanvas(cfgs) {
        var cvs = document.createElement("canvas");
        _getResizedCanvas(cvs, cfgs);
        return cvs;
      }

      _defineProperties({
        getContentWidth: _getContentWidth,
        addExtension: _addExtension,
        getResizedCanvas: _getResizedCanvas,
        makeCanvas: _makeCanvas,
      });
    },
    function () {
      var ColorList = {
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
        },
        __defined_colors__ = Object.keys(ColorList);

      // other color functions
      function _randomColor() {
        var color = "#";
        for (var i = 0; i < 3; i++) {
          var randNum = randomInt(255).toString(16);
          randNum = randNum.length == 1 ? 0 + randNum : randNum;
          color += randNum;
        }
        return color;
      }

      function _randomDefinedColor() {
        return ColorList[
          __defined_colors__[randomInt(__defined_colors__.length - 1)]
        ];
      }

      _defineProperties({
        randomColor: _randomColor,
        randomDefinedColor: _randomDefinedColor,
      });
      _defineProperties(ColorList, window, false);
      _defineProperties({ COLORLIST: ColorList }, window, false);
    },
    function () {
      /* main.js */
      const defaultConfig = {
        width: 200, // width of canvas multiplied by dpr
        height: 200, // height of canvas  multiplied by dpr
        dpr: ceil(devicePixelRatio || 1), // device pixel ratio for clear drawings
        W: 200, // actual width of canvas
        H: 200, // actual height of canvas
        _doFill: true,
        _doStroke: true,
        fillStyle: WHITE,
        strokeStyle: BLACK,
        fontSize: "20px",
        fontfamily: "sans-serif",
      };

      function assignDefaultConfigs(cfgs) {
        for (
          var i = 0, properties = Object.keys(defaultConfig);
          i < properties.length;
          i++
        ) {
          var property = properties[i];
          if (cfgs[property] == undefined)
            cfgs[property] = defaultConfig[property];
        }
      }

      /**
       * Main Function
       * @param {function} fx codes to exeecute
       * @param {HTMLElement} container container for the drawings [default:body element]
       * @param {object} [configs={}] configurations
       */
      function C(fx, container = document.body, configs = {}) {
        // assign configs
        assignDefaultConfigs(configs);
        var W = configs.W,
          H = configs.H;

        /* because both canvas.width and canvas.height are multipiled by dpr
     original width and height should be stored as other variables */
        configs.W =
          typeof W == "number" && W == configs.width ? W : configs.width;
        configs.H =
          typeof H == "number" && H == configs.height ? H : configs.height;

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
          while (document.getElementById("canvas-" + C.nameID) != undefined) {
            C.nameID++;
          }

          canvasName = "canvas-" + C.nameID;
          configs.name = canvasName;
        }
        function prepareCanvas() {
          // add additional information to rendererContext
          getResizedCanvas(canvas, configs);
          canvas.context = Object.assign(canvas.getContext("2d"), configs);
          canvas.context.setTransform(configs.dpr, 0, 0, configs.dpr, 0, 0);
          C.workingCanvas = canvas.context;
        }
        // set canvas's id and class to its name
        canvas.id = canvasName;
        canvas.classList.add(canvasName);
        // add canvas to container
        container.appendChild(canvas);
        prepareCanvas();
        C.canvasList[canvasName] = canvas.context;
        fx();
      }

      C.canvasList = {};
      C.nameID = 0;
      C.workingCanvas = undefined; // index of current working canvas in `canvasList`
      window.C = C;
    },
    function () {
      /*drawing-functions.js */

      function readColor(colors) {
        var color1,
          color2,
          color3,
          alpha = 255,
          read = "";
        if (typeof colors[0] == "number") {
          if (colors.length == 1) {
            color1 = color2 = color3 = colors[0];
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

      function _line(x1, y1, x2, y2) {
        var ctx = C.workingCanvas;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        if (ctx._doStroke) ctx.stroke();
        ctx.closePath();
      }
      function _moveTo(x, y) {
        var ctx = C.workingCanvas;
        if (!ctx._pathStart) ctx.beginPath();
        ctx.moveTo(x, y);
      }
      function _lineTo(x, y) {
        C.workingCanvas.lineTo(x, y);
      }
      function _background() {
        var col = readColor(arguments);
        var ctx = C.workingCanvas;
        ctx.save();
        _rest();
        ctx.fillStyle = col;
        ctx.fillRect(0, 0, ctx.W, ctx.H);
        ctx.restore();
      }
      function _transform(a1, a2, a3, a4, a5, a6) {
        var ctx = C.workingCanvas;
        ctx.setTransform(a1, a2, a3, a4, a5, a6);
        ctx.scale(ctx.dpr, ctx.dpr);
      }
      function _noFill() {
        C.workingCanvas._doFill = false;
      }
      function _noStroke() {
        C.workingCanvas._doStroke = false;
      }
      function _translate(x, y = 0) {
        C.workingCanvas.translate(x, y);
      }
      function _setImageSmoothing(bool) {
        C.workingCanvas.imageSmoothingEnabled = !!bool;
      }
      function _strokeWidth(w) {
        C.workingCanvas.lineWidth = Number(w);
      }
      function _scale(x, y = x) {
        C.workingCanvas.scale(x, y);
      }
      function _rotate(a) {
        C.workingCanvas.rotate(a);
      }
      function _save() {
        C.workingCanvas.save();
      }
      function _lineCap(cap) {
        C.workingCanvas.lineCap = cap || "butt";
      }
      function _restore() {
        C.workingCanvas.restore();
      }
      function _getFill() {
        return C.workingCanvas.fillStyle;
      }
      function _getStroke() {
        return C.workingCanvas.strokeStyle;
      }
      function _rest() {
        var ctx = C.workingCanvas;
        var d = ctx.dpr;
        ctx.setTransform(d, 0, 0, d, 0, 0);
      }
      function _stroke() {
        var ctx = C.workingCanvas;
        if (arguments.length != 0) {
          var col = readColor(arguments);
          ctx.strokeStyle = col;
          ctx._doStroke = true;
        } else {
          ctx.stroke();
        }
      }
      function _fill() {
        var ctx = C.workingCanvas;
        if (arguments.length != 0) {
          var col = readColor(arguments);
          ctx.fillStyle = col;
          ctx._doFill = true;
        } else {
          ctx.fill();
        }
      }
      function _getDrawConfigs() {
        var ctx = C.workingCanvas;
        return {
          stroke: ctx.strokeStyle,
          fill: ctx.fillStyle,
          strokeWidth: ctx.lineWidth,
          doStroke: ctx._doStroke,
          doFill: ctx._doFill,
        };
      }
      function _arc(x, y, r, sa = 0, ea) {
        var ctx = C.workingCanvas;
        ctx.beginPath();
        ctx.arc(x, y, r, sa || 0, isNaN(ea) ? PI * 2 : ea);
        if (ctx._doFill) ctx.fill();
        if (ctx._doStroke) ctx.stroke();
        ctx.closePath();
      }
      function _sector(x, y, r, sa, ea) {
        var ctx = C.workingCanvas;
        ctx.moveTo(x, y);
        ctx.arc(x, y, r, sa, ea);
      }
      function _text(text, x, y = x, maxwidth) {
        var ctx = C.workingCanvas;
        if (ctx._doFill) ctx.fillText(text, x, y, maxwidth);
        else if (ctx._doStroke) ctx.strokeText(text, x, y, maxwidth);
      }
      function _rect(x, y, w, h = w) {
        var ctx = C.workingCanvas;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        if (ctx._doFill) ctx.fill();
        if (ctx._doStroke) ctx.stroke();
      }
      function _circle(x, y, r) {
        var ctx = C.workingCanvas;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, PI * 2);
        if (ctx._doFill) ctx.fill();
        if (ctx._doStroke) ctx.stroke();
        ctx.closePath();
      }
      function _triangle(x1, y1, x2, y2, x3, y3) {
        var ctx = C.workingCanvas;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        if (ctx._doFill) ctx.fill();
        if (ctx._doStroke) {
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
      }
      function _equiTriangle(x, y, len, rotation = 0) {
        var i = 0;
        var e = (PI * 2) / 3;
        var ctx = C.workingCanvas;
        ctx.beginPath();
        ctx.moveTo(cos(rotation) * len + x, sin(rotation) * len + y);
        ctx.lineTo(cos(e + rotation) * len + x, sin(e + rotation) * len + y);
        ctx.lineTo(
          cos(2 * e + rotation) * len + x,
          sin(2 * e + rotation) * len + y
        );
        if (ctx._doFill) ctx.fill();
        if (ctx._doStroke) {
          ctx.lineTo(cos(rotation) * len + x, sin(rotation) * len + y);
          ctx.stroke();
        }
      }
      function _poly() {
        var args = arguments;
        if (args.length % 2 == 0) {
          var ctx = C.workingCanvas;
          ctx.beginPath();
          ctx.moveTo(args[0], args[1]);
          for (var i = 2; i < args.length; i += 2) {
            ctx.lineTo(args[i], args[i + 1]);
          }
          if (ctx._doFill) ctx.fill();
          if (ctx._doStroke) {
            ctx.lineTo(args[0], args[1]);
            ctx.stroke();
          }
          ctx.closePath();
        }
      }
      function _ellipse(x, y, xDis, yDis) {
        var ctx = C.workingCanvas;
        var kappa = 4 * ((sqrt(2) - 1) / 3),
          ox = xDis * kappa, // control point offset horizontal
          oy = yDis * kappa, // control point offset vertical
          xe = x + xDis, // x-end
          ye = y + yDis; // y-end
        ctx.beginPath();
        ctx.moveTo(x - xDis, y);
        ctx.bezierCurveTo(x - xDis, y - oy, x - ox, y - yDis, x, y - yDis);
        ctx.bezierCurveTo(x + ox, y - yDis, xe, y - oy, xe, y);
        ctx.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
        ctx.bezierCurveTo(x - ox, ye, x - xDis, y + oy, x - xDis, y);
        if (ctx._doFill) ctx.fill();
        if (ctx._doStroke) {
          ctx.stroke();
        }
        ctx.closePath();
      }
      function _bezierCurve(x1, y1, x2, y2, x3, y3) {
        var ctx = C.workingCanvas;
        if (!ctx._pathStart) ctx.beginPath();

        ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);

        if (!ctx._pathStart) {
          if (ctx._doFill) ctx.fill();
          if (ctx._doStroke) {
            ctx.stroke();
          }
          ctx.closePath();
        }
      }
      function _quad(x1, y1, x2, y2, x3, y3, x4, y4) {
        var ctx = C.workingCanvas,
          args = arguments;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.lineTo(x1, y1);
        if (ctx._doFill) ctx.fill();
        if (ctx._doStroke) {
          ctx.lineTo(args[0], args[1]);
          ctx.stroke();
        }
        ctx.closePath();
      }

      /**
       * Draws a regular polygon with centre position number of sides length of a side and rotation
       * @param {number} x        x position
       * @param {number} y        y position
       * @param {number} sides    number of sides
       * @param {number} len      length of a side
       * @param {number} rotation rotation
       */
      function _regularPoly(x, y, sides, len, rotation = 0) {
        var i = 0;
        var e = (PI * 2) / sides;
        var ctx = C.workingCanvas;
        rotation += e / 2;
        var initial = [cos(rotation) * len + x, sin(rotation) * len + y];
        ctx.beginPath();
        ctx.moveTo(initial[0], initial[1]);
        while (i++ < sides) {
          ctx.lineTo(
            cos(i * e + rotation) * len + x,
            sin(i * e + rotation) * len + y
          );
        }
        if (ctx._doFill) ctx.fill();
        if (ctx._doStroke) {
          ctx.lineTo(initial[0], initial[1]);
          ctx.stroke();
        }
        ctx.closePath();
      }
      function _loop(fx, cvs, dx) {
        var ctx = C.workingCanvas;
        if (!cvs) {
          cvs = ctx.name;
        } else {
          ctx = C.canvasList[cvs];
        }
        ctx.animating = true;
        var timeStart = window.performance.now();
        if (dx) {
          ctx.currentLoop = setInterval(function () {
            C.workingCanvas = ctx;
            fx(window.performance.now() - timeStart);
          }, dx);
        } else {
          function a(dx) {
            C.workingCanvas = ctx;
            ctx.currentLoop = window.requestAnimationFrame(a);
            fx(window.performance.now() - timeStart);
          }
          a();
        }
      }
      function _clear() {
        var ctx = C.workingCanvas;
        ctx.rest();
        ctx.clearRect(0, 0, ctx.W, ctx.H);
      }
      function _noLoop() {
        var ctx = C.workingCanvas;
        clearInterval(ctx.currentLoop);
        window.cancelAnimationFrame(ctx.currentLoop);
        ctx.animating = false;
      }
      function _startPath() {
        var ctx = C.workingCanvas;
        ctx.beginPath();
        ctx._pathStart = true;
      }
      function _endPath() {
        var ctx = C.workingCanvas;
        ctx.closePath();
        ctx._pathStart = false;
      }
      function _getFont() {
        var ctx = C.workingCanvas;
        return ctx.fontSize + " " + ctx.fontFamily;
      }
      function _measureText(text) {
        return C.workingCanvas.measureText(text);
      }

      /**
 * creates a linear gradient
 *
 * @param {array} p1 initial point as [x, y]
 * @param {array} p2 final point as [x, y]
 * @param {Object|array} colorStops color stops
 * @example var color = linearGradient(
  * [0, 0],
  * [200, 0],
  * {
      0: "green",
      0.5: "cyan",
      1: "yellow"
  * }
 * );
 * 
 */
      function _linearGradient(p1, p2, colorStops) {
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
        for (
          var stops = Object.keys(colorStops), i = 0;
          i < stops.length;
          i++
        ) {
          var stop = stops[i];
          gradient.addColorStop(stop, colorStops[stop]);
        }
        return gradient;
      }
      function _fontSize(size) {
        var ctx = C.workingCanvas;
        size = !isNaN(size) ? size + "px" : size;
        ctx.fontSize = size;
        ctx.font = getFont();
      }
      function _fontFamily(family) {
        var ctx = C.workingCanvas;
        ctx.fontFamily = family;
        ctx.font = getFont();
      }
      function _getCanvasData(datURL = "image/png") {
        return C.workingCanvas.canvas.toDataURL(datURL);
      }
      function _saveCanvas(name = "drawing", datURL) {
        var link = getCanvasData().replace(datURL, "image/octet-stream");
        var a = document.createElement("a");
        a.download = name + ".png";
        a.href = link;
        a.click();
      }

      window.C.functions = {
        line: _line,
        lineTo: _lineTo,
        moveTo: _moveTo,
        background: _background,
        transform: _transform,
        noFill: _noFill,
        lineCap: _lineCap,
        noStroke: _noStroke,
        translate: _translate,
        setImageSmoothing: _setImageSmoothing,
        strokeWidth: _strokeWidth,
        scale: _scale,
        rotate: _rotate,
        save: _save,
        restore: _restore,
        getFill: _getFill,
        getStroke: _getStroke,
        rest: _rest,
        stroke: _stroke,
        fill: _fill,
        getDrawConfigs: _getDrawConfigs,
        arc: _arc,
        sector: _sector,
        rect: _rect,
        circle: _circle,
        triangle: _triangle,
        equiTriangle: _equiTriangle,
        poly: _poly,
        ellipse: _ellipse,
        bezierCurve: _bezierCurve,
        quad: _quad,
        regularPoly: _regularPoly,
        loop: _loop,
        clear: _clear,
        noLoop: _noLoop,
        startPath: _startPath,
        endPath: _endPath,
        text: _text,
        fontSize: _fontSize,
        fontFamily: _fontFamily,
        getFont: _getFont,
        linearGradient: _linearGradient,
        measureText: _measureText,
        saveCanvas: _saveCanvas,
        getCanvasData: _getCanvasData,
      };
      _defineProperties(window.C.functions);
    },
  ];
  for (var i = 0; i < exports.length; i++) {
    exports[i]();
  }
})(window);
