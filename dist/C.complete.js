(function () {
  function assignPropsToWind(obj) {
    for (var i of Object.keys(obj))
      window[i] = obj[i];
  }

  //////////////////// constants.js ///////////////////
  (function () {
    const CList = {
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
      ORANGE: "#FF862F"
    };
    window.COLOR_LIST = CList;
    assignPropsToWind(CList);
  })();

  //////////////////// functions.js ///////////////////
  (function () {
    function int(a, b) { return isNaN(a) ? b : a; }
    function bool(a, b) { return a == undefined ? b : a; }

    function gW() {
      var cs = window.getComputedStyle(document.body);
      return window.innerWidth - parseInt(cs.marginLeft) * 2;
    }

    function addExtension(extObj) {
      window.C.extensions = Object.assign(window.C.extensions, extObj);
      for (var extension of Object.keys(C.extensions)) {
        C.prototype[extension] = window[extension] = C.extensions[extension]
      }
    }
    function getCanvas(width, height, dpr) {
      var cvs = document.createElement("canvas");
      cvs.style.width = width + "px";
      cvs.style.height = height + "px";
      cvs.width = dpr * width;
      cvs.height = dpr * height;
      cvs.style.position = "relative";
      return cvs;
    }
    // addding to window
    assignPropsToWind({
      int: int,
      bool: bool,
      getWidth: gW,
      getCanvas: getCanvas,
      addExtension: addExtension,
      // functions
      E: Math.E,
      LN2: Math.LN2,
      LN10: Math.LN10,
      PI: Math.PI,
      TAU: Math.PI * 2,
      SQRT2: Math.SQRT2,
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
      dist: function (p1, p2) {
        if (p1 instanceof Array && p2 instanceof Array) {
          return sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
        }
      }
    });
  })();

  //////////////////// C.js ///////////////////
  (function () {
    function C(c, fx, cfg = {}) {
      var container = c instanceof HTMLElement ? c : document.querySelector(c),
        AR = cfg.aspectRatio || [16, 9],
        width = int(
          cfg.width,
          getWidth()
        ),
        height = int(cfg.height, (width / AR[0]) * AR[1]),
        autoPlay = bool(cfg.autoPlay, true),
        thumbnail = cfg.thumbnail || function () { },
        dpr = cfg.scale || ceil(window.devicePixelRatio) || 1;

      var cvs = getCanvas(width, height, dpr),
        ctx = cvs.getContext("2d");

      if (bool(cfg.replaceCurrent, true)) container.innerHTML = "";
      container.appendChild(cvs);
      var CO = {
        cvs: cvs,
        ctx: ctx,
        W: width,
        H: height,
        _toFill: true,
        _toStroke: true,
        dpr: dpr
      };
      var binded = fx.bind(CO);
      C.setcurrentConfigs(CO);
      rest();
      if (autoPlay) {
        binded();
      } else {
        cvs.onclick = function () {
          if (!ctx.animating) {
            C.setcurrentConfigs(CO);
            rest();
            ctx.clearRect(0, 0, width, height);
            binded();
            ctx.animating = true;
          }
        };
        thumbnail.bind(CO)();
      }
    };

    C.currentConfigs = {};
    C.extensions = {};

    C.setcurrentConfigs = function (attrs) {
      if (Object.prototype.toString.call(attrs) == "[object Object]") {
        for (var p of Object.keys(attrs)) {
          window[p] = C.prototype[p] = attrs[p];
        }
        C.currentConfigs = attrs;
      }
    }
    window.C = C;
  })();

  //////////////////// drawer-functions.js ///////////////////
  (function () {

    // C.js basic functions 
    C.prototype.line = function (x1, y1, x2, y2) {
      var c = this.ctx;
      if (!this._toStroke) return;
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
      c.closePath();
    }

    C.prototype.background = function (col) {
      var c = this.ctx;
      c.save();
      this.rest();
      c.fillStyle = col;
      c.fillRect(0, 0, W, H);
      c.restore();
    }

    C.prototype.noFill = function () { this._toFill = false; }
    C.prototype.noStroke = function () { this._toStroke = false; }
    C.prototype.translate = function (x, y = 0) { this.ctx.translate(x, y); }
    C.prototype.enableSmoothing = function () { this.ctx.imageSmoothingEnabled = true; }
    C.prototype.disableSmoothing = function () { this.ctx.imageSmoothingEnabled = false; }
    C.prototype.strokeWidth = function (w) { this.ctx.lineWidth = Number(w); }
    C.prototype.scale = function (x, y = x) { this.ctx.scale(x, y) }
    C.prototype.save = function () { this.ctx.save(); }
    C.prototype.restore = function () { this.ctx.restore(); }
    C.prototype.getFill = function () { return this.ctx.fillStyle; }
    C.prototype.getStroke = function () { return this.ctx.strokeStyle; }

    C.prototype.rest = function () {
      var c = this.ctx;
      c.setTransform(1, 0, 0, 1, 0, 0);
      var d = this.dpr;
      c.scale(d, d);
    }

    C.prototype.stroke = function (col) {
      if (col != undefined) {
        this.ctx.strokeStyle = col;
        this._toStroke = true;
      } else {
        this.ctx.stroke();
      }
    }

    C.prototype.fill = function (col) {
      if (col != undefined) {
        this.ctx.fillStyle = col;
        this._toFill = true;
      } else {
        this.ctx.fill();
      }
    }

    C.prototype.getDrawConfigs = function () {
      var c = this.ctx;
      return {
        stroke: c.strokeStyle,
        fill: c.fillStyle,
        strokeWidth: c.lineWidth,
        toStroke: this._toStroke,
        toFill: this._toFill,
      }
    }

    C.prototype.arc = function (x, y, r, sa = 0, ea = Math.PI / 2) {
      var c = this.ctx;
      c.beginPath();
      c.arc(
        x,
        y,
        r,
        sa || 0,
        int(ea, Math.PI * 2),
      );
      if (this._toFill) c.fill();
      if (this._toStroke) c.stroke();
      c.closePath();
    }

    C.prototype.sector = function (x, y, r, sa, ea) {
      this.ctx.moveTo(x, y);
      this.arc(x, y, r, sa, ea);
    }

    C.prototype.circle = function (x, y, r) { this.arc(x, y, r, 0, Math.PI * 2); }

    C.prototype.triangle = function (x1, y1, x2, y2, x3, y3) {
      var c = this.ctx;
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.lineTo(x3, y3);
      if (this._toFill) c.fill();
      if (this._toStroke) {
        c.lineTo(x1, y1);
        c.stroke();
      }
    }

    C.prototype.equiTriangle = function (x, y, len, rotation = 0) {
      var i = 0;
      var e = Math.PI * 2 / 3;
      var c = this.ctx;
      c.beginPath();
      c.moveTo(Math.cos(rotation) * len + x, Math.sin(rotation) * len + y);
      c.lineTo(Math.cos(e + rotation) * len + x, Math.sin(e + rotation) * len + y);
      c.lineTo(Math.cos(2 * e + rotation) * len + x, Math.sin(2 * e + rotation) * len + y);
      if (this._toFill) c.fill();
      if (this._toStroke) {
        c.lineTo(Math.cos(rotation) * len + x, Math.sin(rotation) * len + y);
        c.stroke();
      }
    }

    C.prototype.poly = function () {
      var args = arguments;
      if (args.length % 2 == 0) {
        var c = this.ctx;
        c.beginPath();
        c.moveTo(args[0], args[1]);
        for (var i = 2; i < args.length; i += 2) {
          c.lineTo(args[i], args[i + 1]);
        }
        if (this._toFill) c.fill();
        if (this._toStroke) {
          c.lineTo(args[0], args[1]);
          c.stroke();
        }
        c.closePath();
      }
    }

    C.prototype.ellipse = function (x, y, xDis, yDis) {
      var c = this.ctx;
      var kappa = 4 * ((Math.sqrt(2) - 1) / 3);
      ox = xDis * kappa,  // control point offset horizontal
        oy = yDis * kappa,  // control point offset vertical
        xe = x + xDis,      // x-end
        ye = y + yDis;      // y-end
      c.beginPath();
      c.moveTo(x - xDis, y);
      c.bezierCurveTo(x - xDis, y - oy, x - ox, y - yDis, x, y - yDis);
      c.bezierCurveTo(x + ox, y - yDis, xe, y - oy, xe, y);
      c.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
      c.bezierCurveTo(x - ox, ye, x - xDis, y + oy, x - xDis, y);
      if (this._toFill) c.fill();
      if (this._toStroke) {
        c.stroke();
      }
      c.closePath();
    }


    C.prototype.bezierCurve = function (x1, y1, x2, y2, x3, y3) {
      var c = this.ctx;
      if (!this._pathStart) c.beginPath();

      c.bezierCurveTo(x1, y1, x2, y2, x3, y3);

      if (!this._pathStart) {
        if (this._toFill) c.fill();
        if (this._toStroke) {
          c.stroke();
        }
        c.closePath();
      };
    }

    C.prototype.quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
      var c = this.ctx, args = arguments;
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.lineTo(x3, y3);
      c.lineTo(x4, y4);
      c.lineTo(x1, y1);
      if (this._toFill) c.fill();
      if (this._toStroke) {
        c.lineTo(args[0], args[1]);
        c.stroke();
      }
      c.closePath();
    }


    /**
     * Draws a regular polygon with centre position number of sides length of a side and rotation
     * @param {number} x        x position
     * @param {number} y        y position
     * @param {number} sides    number of sides
     * @param {number} len      length of a side
     * @param {number} rotation rotation
     */

    C.prototype.regularPoly = function (x, y, sides, len, rotation = 0) {
      var i = 0;
      var e = Math.PI * 2 / sides;
      var c = this.ctx;
      rotation += e / 2;
      var initial = [
        Math.cos(rotation) * len + x,
        Math.sin(rotation) * len + y
      ]
      c.beginPath();
      c.moveTo(initial[0], initial[1]);
      while (i++ < sides) {
        c.lineTo(
          Math.cos(i * e + rotation) * len + x,
          Math.sin(i * e + rotation) * len + y
        );
      }
      if (this._toFill) c.fill();
      if (this._toStroke) {
        c.lineTo(initial[0], initial[1]);
        c.stroke();
      }
      c.closePath();
    }

    C.prototype.loop = function (fx, dx, th) {
      this.ctx.animating = true;
      if (dx) {
        C.currentConfigs.currentLoop = setInterval(function () {
          C.setcurrentConfigs(th);
          fx();
        }, dx);
      } else {
        function a(dx) {
          C.currentConfigs.currentLoop = window.requestAnimationFrame(a);
          C.setcurrentConfigs(th);
          fx(dx);
        }
        a();
      }
    }

    C.prototype.noLoop = function () {
      clearInterval(C.currentConfigs.currentLoop);
      window.cancelAnimationFrame(C.currentConfigs.currentLoop);
      this.ctx.animating = false;
    }

    C.prototype.startPath = function () {
      this.ctx.beginPath();
      this._pathStart = true;
    }
    C.prototype.endPath = function () {
      this.ctx.closePath();
      this._pathStart = false;
    }

    assignPropsToWind(C.prototype);
  })();
})();