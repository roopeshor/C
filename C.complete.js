(function(){
  // ------constants.js -------//
  function assignPropsToWind(obj){
    for (var i of Object.keys(obj))
      window[i] = obj[i];
  }
  (function(){
    const CList = {
      DARK_BLUE   : "#236B8E",
      DARK_BROWN  : "#8B4513",
      LIGHT_BROWN : "#CD853F",
      BLUE_A      : "#C7E9F1",
      BLUE_B      : "#9CDCEB",
      BLUE_C      : "#58C4DD",
      BLUE_D      : "#29ABCA",
      BLUE_E      : "#1C758A",
      TEAL_A      : "#ACEAD7",
      TEAL_B      : "#76DDC0",
      TEAL_C      : "#5CD0B3",
      TEAL_D      : "#55C1A7",
      TEAL_E      : "#49A88F",
      GREEN_A     : "#C9E2AE",
      GREEN_B     : "#A6CF8C",
      GREEN_C     : "#83C167",
      GREEN_D     : "#77B05D",
      GREEN_E     : "#699C52",
      YELLOW_A    : "#FFF1B6",
      YELLOW_B    : "#FFEA94",
      YELLOW_C    : "#FFFF00",
      YELLOW_D    : "#F4D345",
      YELLOW_E    : "#E8C11C",
      GOLD_A      : "#F7C797",
      GOLD_B      : "#F9B775",
      GOLD_C      : "#F0AC5F",
      GOLD_D      : "#E1A158",
      GOLD_E      : "#C78D46",
      RED_A       : "#F7A1A3",
      RED_B       : "#FF8080",
      RED_C       : "#FC6255",
      RED_D       : "#E65A4C",
      RED_E       : "#CF5044",
      MAROON_A    : "#ECABC1",
      MAROON_B    : "#EC92AB",
      MAROON_C    : "#C55F73",
      MAROON_D    : "#A24D61",
      MAROON_E    : "#94424F",
      PURPLE_A    : "#CAA3E8",
      PURPLE_B    : "#B189C6",
      PURPLE_C    : "#9A72AC",
      PURPLE_D    : "#715582",
      PURPLE_E    : "#644172",
      WHITE       : "#FFFFFF",
      BLACK       : "#000000",
      LIGHT_GRAY  : "#BBBBBB",
      LIGHT_GREY  : "#BBBBBB",
      GRAY        : "#888888",
      GREY        : "#888888",
      DARK_GREY   : "#444444",
      DARK_GRAY   : "#444444",
      DARKER_GREY : "#222222",
      DARKER_GRAY : "#222222",
      GREY_BROWN  : "#736357",
      PINK        : "#D147BD",
      LIGHT_PINK  : "#DC75CD",
      GREEN_SCREEN: "#00FF00",
      ORANGE      : "#FF862F",
      NONE        : "transparent"
    };
    window.COLOR_LIST = CList;
    for (var color of Object.keys(CList)) {
      window[color] = CList[color];
    }
    window.CJS_Extensions = {};
  })();

  // constant functions
  assignPropsToWind({
    E: Math.E,
    LN2: Math.LN2,
    LN10: Math.LN10,
    PI: Math.PI,
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
    rand: Math.random,
    round: Math.round,
    sgn: Math.sign,
    sin: Math.sin,
    sqrt: Math.sqrt,
    tan: Math.tan,
    tanh: Math.tanh,
    dist : function(p1, p2) {
      if (p1 instanceof Array && p2 instanceof Array) {
        return sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
      }
    }
  });

  //------ functions.js -------//
  (function(){
    function int (a, b) { return isNaN(a) ? b: a; }
    function bool (a, b) { return a == undefined ? b : a; }
    
    function gW () {
      var cs = window.getComputedStyle(document.body);
      return window.innerWidth - parseInt(cs.marginLeft) * 2;
    }
    
    function ACE (extObj) {
      window.CJS_Extensions = Object.assign(window.CJS_Extensions, extObj);
    }

    assignPropsToWind({
      int: int,
      bool: bool,
      getWidth: gW,
      addCJSExtension: ACE
    });
  })();

  //------- C.js -------//
  (function(){
    'use strict';
    const getCDFObject = function (cvs, width, height) {
      var ctx = cvs.getContext("2d"),
        dpr = window.devicePixelRatio;
      return Object.assign(
        {
          cvs: cvs,
          ctx: ctx,
          W: width,
          H: height,
          _toFill: true,
          _toStroke: true,
          line: function (x1, y1, x2, y2) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            if (this._toStroke) ctx.stroke();
            ctx.closePath();
          },
          rect: function (x, y, w, h) {

          },
          background: function (c) {
            ctx.save();
            this.rest()
            ctx.fillStyle = c;
            ctx.fillRect(-W, -H, W*2, H*2);
            ctx.restore();
          },
          noFill : function() { this._toFill = false; },
          noStroke : function() { this._toStroke = false; },
          translate: function (x, y = 0) { ctx.translate(x, y); },
          enableSmoothing() { ctx.imageSmoothingEnabled = true; },
          disableSmoothing() { ctx.imageSmoothingEnabled = false; },
          rest: function () {
            ctx.resetTransform();
            ctx.imageSmoothingEnabled = false;
            ctx.scale(dpr, dpr);
          },
          stroke: function (c) { 
            if (c != undefined){
              ctx.strokeStyle = c;
              this._toStroke = true;
            } else {
              ctx.stroke();
            }
          },
          fill: function (c) { 
            if (c != undefined){
              ctx.fillStyle = c;
              this._toFill = true;
            } else {
              ctx.fill();
            }
          },
          strokeWidth: function (w) { ctx.lineWidth = Number(w); },
          getDrawConfigs: function () {
            return {
              stroke: ctx.strokeStyle,
              fill: ctx.fillStyle,
              strokeWidth: ctx.lineWidth
            }
          },
          arc: function (c = {}) {
            ctx.beginPath();
            ctx.arc(
              c.x,
              c.y,
              c.r,
              c.sa || 0,
              int(c.ea, Math.PI * 2),
              c.ac
            );
            if (this._toFill) ctx.fill();
            if (this._toStroke) ctx.stroke();
            ctx.closePath();
          },
          circle: function (x, y, r) {
            this.arc({
              x: x,
              y: y,
              r: r,
              sa: 0,
              ea: Math.PI * 2,
            });
          },
          startLoop: function (fx, time) {
            var s;
            var binded = fx.bind(this)
            if (time != undefined) {
              s = setInterval(binded, time);
              this.recentLoop = s;
              this.recentLoopType = "SI";
            } else {
              function a () {
                binded();
                window.requestAnimationFrame(a);
              }
              this.recentLoop = a;
              this.recentLoopType = "WRAF";
              a();
            }
          },
          stopLoop: function (fx = function () {}) {
            if (this.recentLoopType == "WRAF") {
              window.cancelAnimationFrame(this.recentLoop);
            } else {
              clearInterval(this.recentLoop);
            }
            this.recentLoop = null;
            this.recentLoopType = null;
            ctx.animating = false;
            fx.bind(this)();
          },
          getFPS: function () {
    
          },
          drawPlayBtn: function (c = {}) {
            ctx.save();
            this.rest();
            var p = c.p || [this.W/2, this.H/2];
            this.translate(p[0], p[1]);
            this.fill(c.background || "#3fffac");
            this.arc({
              x: 0,
              y: 0,
              r: c.r || 20,
              fill: true,
              stroke: false
            });
            var len = c.playLen || 11;
            ctx.beginPath();
            ctx.moveTo(len, 0);
            this.fill(c.playCol || "#fff");
            for (var i = 1; i < 3; i++) {
              ctx.lineTo(
                Math.cos(i * Math.PI * 2 / 3) * len,
                Math.sin(i * Math.PI * 2 / 3) * len,
              )
            }
            ctx.fill();
            ctx.closePath();
          }
        },
        window.CJS_Extensions
      );
    };
    window.C = function (c, fx, cfg = {}) {
      var container = c,
        AR = cfg.aspectRatio || [16, 9],
        width = int(
          cfg.width,
          getWidth()
        ),
        height = int(cfg.height, (width / AR[0]) * AR[1]),
        autoPlay = bool(cfg.autoPlay, true),
        thumbnail = cfg.thumbnail||function () {CDF.drawPlayBtn()},
        dpr = devicePixelRatio;
    
      var cvs = getCanvas(),
        ctx = cvs.getContext("2d");
      if (bool(cfg.replaceCurrent, true)) container.innerHTML = "";
      container.appendChild(cvs);
      function getCanvas() {
        var cvs = document.createElement("canvas");
        cvs.style.width =  width + "px";
        cvs.style.height = height + "px";
        cvs.width = dpr * width;
        cvs.height = dpr * height;
        cvs.style.position = "relative";
        return cvs;
      }
      var CDF = getCDFObject(cvs, width, height);
      var binded = fx.bind(CDF);
      CDF.rest();
      if (autoPlay) {
        binded();
      } else {
        cvs.onclick = function () {
          if (!ctx.animating) {
            CDF.rest();
            ctx.clearRect(0, 0, width, height);
            binded();
            ctx.animating = true;
          }
        };
        thumbnail.bind(CDF)();
      }
    };
  })();
})();
