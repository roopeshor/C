(function () {
  // C.js basic functions 

  C.prototype.line = function (x1, y1, x2, y2) {
    var c = this._ctx;
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    if (_toStroke) c.stroke();
    c.closePath();
  }

  C.prototype.background = function (c) {
    var ct = this._ctx;
    ct.save();
    C.prototype.rest();
    ct.fillStyle = c;
    ct.fillRect(-W, -H, W * 2, H * 2);
    ct.restore();
  }

  C.prototype.noFill = function () { this._toFill = false; }
  C.prototype.noStroke = function () { this._toStroke = false; }
  C.prototype.translate = function (x, y = 0) { this._ctx.translate(x, y); }
  C.prototype.enableSmoothing = function () { this._ctx.imageSmoothingEnabled = true; }
  C.prototype.disableSmoothing = function () { this._ctx.imageSmoothingEnabled = false; }
  C.prototype.strokeWidth = function (w) { this._ctx.lineWidth = Number(w); }


  C.prototype.rest = function () {
    var c = this._ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    var d = this.dpr;
    c.scale(d, d);
  }

  C.prototype.stroke = function (col) {
    if (col != undefined) {
      this._ctx.strokeStyle = col;
      this._toStroke = true;
    } else {
      this._ctx.stroke();
    }
  }

  C.prototype.fill = function (col) {
    if (col != undefined) {
      this._ctx.fillStyle = col;
      this._toFill = true;
    } else {
      this._ctx.fill();
    }
  }

  C.prototype.getDrawConfigs = function () {
    var c = this._ctx;
    return {
      stroke: c.strokeStyle,
      fill: c.fillStyle,
      strokeWidth: c.lineWidth,
      toStroke: this._toStroke,
      toFill: this._toFill,
    }
  }

  C.prototype.arc = function (x, y, r, sa = 0, ea = Math.PI / 2) {
    var c = this._ctx;
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
    this._ctx.moveTo(x, y);
    this.arc(x, y, r, sa, ea);
  }

  C.prototype.circle = function (x, y, r) {
    arc(x, y, r, 0, Math.PI * 2);
  }

  C.prototype.triangle = function (x1, y1, x2, y2, x3, y3) {
    var c = this._ctx;
    c.imageSmoothingQuality = "high"
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

  C.prototype.equiTriangle = function (x, y, len, angle = 0) {
    var vertices = [];
    var i = 0;
    var e = Math.PI * 2 / 3;
    while (i++ < 3) {
      vertices.push(Math.cos(i * e + angle) * len + x, Math.sin(i * e + angle) * len + y);
    }
    console.log(this.getDrawConfigs())
    this.triangle(...vertices)
  }

  C.prototype.loop = function (fx, dx, th) {
    var binded = fx.bind(C.prototype);
    this._ctx.animating = true;
    if (dx) {
      C.currentConfigs.currentLoop = setInterval(function () {
        C.setcurrentConfigs(th);
        binded();
      }, dx);
    } else {
      (function a(dx) {
        C.currentConfigs.currentLoop = window.requestAnimationFrame(a);
        C.setcurrentConfigs(th);
        binded(dx);
      })();
    }
  }

  C.prototype.noLoop = function () {
    clearInterval(C.currentConfigs.currentLoop);
    window.cancelAnimationFrame(C.currentConfigs.currentLoop);
    this._ctx.animating = false;
  }

  C.prototype.save = function () {
    this._ctx.save();
  }
  C.prototype.restore = function () {
    this._ctx.restore();
  }
  C.prototype.startPath = function () {
    this._ctx.beginPath();
  }
  C.prototype.endPath = function () {
    this._ctx.closePath();
  }

  assignPropsToWind(C.prototype);
})();