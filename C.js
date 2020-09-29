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
