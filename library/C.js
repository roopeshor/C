(function () {
  'use strict';
  const getCDFObject = function (cvs, width, height, dpr) {
    var ctx = cvs.getContext("2d");
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
          if (_toStroke) ctx.stroke();
          ctx.closePath();
        },
        rect: function (x, y, w, h) {

        },
        background: function (c) {
          ctx.save();
          rest()
          ctx.fillStyle = c;
          ctx.fillRect(-W, -H, W * 2, H * 2);
          ctx.restore();
        },
        noFill: function () { _toFill = false; },
        noStroke: function () { _toStroke = false; },
        translate: function (x, y = 0) { ctx.translate(x, y); },
        enableSmoothing() { ctx.imageSmoothingEnabled = true; },
        disableSmoothing() { ctx.imageSmoothingEnabled = false; },
        rest: function () {
          ctx.resetTransform();
          ctx.imageSmoothingEnabled = false;
          ctx.scale(dpr, dpr);
        },
        stroke: function (c) {
          if (c != undefined) {
            ctx.strokeStyle = c;
            _toStroke = true;
          } else {
            ctx.stroke();
          }
        },
        fill: function (c) {
          if (c != undefined) {
            ctx.fillStyle = c;
            _toFill = true;
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
          if (_toFill) ctx.fill();
          if (_toStroke) ctx.stroke();
          ctx.closePath();
        },
        circle: function (x, y, r) {
          arc({
            x: x,
            y: y,
            r: r,
            sa: 0,
            ea: Math.PI * 2,
          });
        },
        startLoop: function (fx, dx) {
          var binded = fx.bind(CJS._currentContext);
          ctx.animating = true;
          if (dx != undefined) {
            CJS._currentContext.currentLoop = setInterval(binded, dx);
          } else {
            (function a(dx) {
              CJS._currentContext.currentLoop = window.requestAnimationFrame(a);
              binded(dx);
            })();
          }
        },
        stopLoop: function () {
          clearInterval(CJS._currentContext.currentLoop);
          window.cancelAnimationFrame(CJS._currentContext.currentLoop);
          ctx.animating = false;
        },
        getFPS: function () {

        },
        drawPlayBtn: function (c = {}) {
          ctx.save();
          rest();
          var p = c.p || [W / 2, H / 2];
          translate(p[0], p[1]);
          fill(c.background || "#3fffac");
          noStroke();
          arc({
            x: 0,
            y: 0,
            r: c.r || 20,
            fill: true,
            stroke: false
          });
          var len = c.playLen || 11;
          ctx.beginPath();
          ctx.moveTo(len, 0);
          fill(c.playCol || "#fff");
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
      thumbnail = cfg.thumbnail || function () { CDF.drawPlayBtn() },
      dpr = cfg.scale || ceil(window.devicePixelRatio) || 1;

    var cvs = getCanvas(),
      ctx = cvs.getContext("2d");
    if (bool(cfg.replaceCurrent, true)) container.innerHTML = "";
    container.appendChild(cvs);
    function getCanvas() {
      var cvs = document.createElement("canvas");
      cvs.style.width = width + "px";
      cvs.style.height = height + "px";
      cvs.width = dpr * width;
      cvs.height = dpr * height;
      cvs.style.position = "relative";
      return cvs;
    }
    var CDF = getCDFObject(cvs, width, height, dpr);
    var binded = fx.bind(CDF);
    CDF.rest();
    var c = CDF.ctx;
    delete CDF.ctx;
    CJS.setCurrentContext(CDF, c);
    if (autoPlay) {
      binded();
    } else {
      cvs.onclick = function () {
        if (!ctx.animating) {
          CJS.setCurrentContext(CDF);
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
