(function () {
  var dpr = ceil(window.devicePixelRatio) || 1;

  // C.js basic functions 
  var C_Functions = {};


  C_Functions.line = function (x1, y1, x2, y2) {
    var c = window.C.currentConfigs.ctx;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    if (_toStroke) ctx.stroke();
    ctx.closePath();
  }
  C_Functions.background = function (c) {
    ctx.save();
    C_Functions.rest();
    ctx.fillStyle = c;
    ctx.fillRect(-W, -H, W * 2, H * 2);
    ctx.restore();
  }
  C_Functions.noFill = function () { C.currentConfigs._toFill = false; }
  C_Functions.noStroke = function () { C.currentConfigs._toStroke = false; }
  C_Functions.translate = function (x, y = 0) { ctx.translate(x, y); }
  C_Functions.enableSmoothing = function () { ctx.imageSmoothingEnabled = true; }
  C_Functions.disableSmoothing = function () { ctx.imageSmoothingEnabled = false; }
  C_Functions.rest = function () {
    ctx.resetTransform();
    ctx.imageSmoothingEnabled = false;
    var d = C.currentConfigs.dpr;
    ctx.scale(d, d);
  }
  C_Functions.stroke = function (c) {
    if (c != undefined) {
      ctx.strokeStyle = c;
      C.currentConfigs._toStroke = true;
    } else {
      ctx.stroke();
    }
  }
  C_Functions.fill = function (c) {
    if (c != undefined) {
      ctx.fillStyle = c;
      C.currentConfigs._toFill = true;
    } else {
      ctx.fill();
    }
  }
  C_Functions.strokeWidth = function (w) { ctx.lineWidth = Number(w); }
  C_Functions.getDrawConfigs = function () {
    return {
      stroke: ctx.strokeStyle,
      fill: ctx.fillStyle,
      strokeWidth: ctx.lineWidth
    }
  }
  C_Functions.arc = function (c = {}) {
    ctx.beginPath();
    ctx.arc(
      c.x,
      c.y,
      c.r,
      c.sa || 0,
      int(c.ea, Math.PI * 2),
      c.ac
    );
    if (C.currentConfigs._toFill) ctx.fill();
    if (C.currentConfigs._toStroke) ctx.stroke();
    ctx.closePath();
  }
  C_Functions.circle = function (x, y, r) {
    arc({
      x: x,
      y: y,
      r: r,
      sa: 0,
      ea: Math.PI * 2,
    });
  }
  C_Functions.loop = function (fx, dx, th) {
    var binded = fx.bind(C.currentConfigs);
    ctx.animating = true;
    if (dx) {
      C.currentConfigs.currentLoop = setInterval(function () {
        C.setcurrentConfigsAttrs(th);
        binded();
      }, dx);
    } else {
      (function a(dx) {
        C.currentConfigs.currentLoop = window.requestAnimationFrame(a);
        C.setcurrentConfigsAttrs(th);
        binded(dx);
      })();
    }
  }
  C_Functions.noLoop = function () {
    clearInterval(C.currentConfigs.currentLoop);
    window.cancelAnimationFrame(C.currentConfigs.currentLoop);
    ctx.animating = false;
  }

  C_Functions.drawPlayBtn = function (c = {}) {
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
    C_Functions.fill(c.playCol || "#fff");
    for (var i = 1; i < 3; i++) {
      ctx.lineTo(
        Math.cos(i * Math.PI * 2 / 3) * len,
        Math.sin(i * Math.PI * 2 / 3) * len,
      )
    }
    ctx.fill();
    ctx.closePath();
  }

  var finalObj = Object.assign(C_Functions, C.extensions);
  assignPropsToWind(finalObj);
})();