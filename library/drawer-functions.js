(function () {

  // C.js basic functions 

  var C__proto__ = {
    line : function line (x1, y1, x2, y2) {
      var c = this.ctx;
      if (!this._toStroke) return;
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
      c.closePath();
    },

    background : function background (col) {
      var c = this.ctx;
      c.save();
      this.rest();
      c.fillStyle = col;
      c.fillRect(0, 0, W, H);
      c.restore();
    },

    transform : function transform (a, b, c, d, e, f) {
      this.ctx.setTransform(a, b, c, d, e, f);
      this.ctx.scale(this.dpr, this.dpr);
    },
    noFill : function noFill () { this._toFill = false; },
    noStroke : function noStroke () { this._toStroke = false; },
    translate : function translate (x, y = 0) { this.ctx.translate(x, y); },
    enableSmoothing : function enableSmoothing () { this.ctx.imageSmoothingEnabled = true; },
    disableSmoothing : function disableSmoothing () { this.ctx.imageSmoothingEnabled = false; },
    strokeWidth : function strokeWidth (w) { this.ctx.lineWidth = Number(w); },
    scale : function scale (x, y = x) { this.ctx.scale(x, y) },
    rotate : function rotate (a) { this.ctx.rotate(a) },
    save : function save () { this.ctx.save(); },
    restore : function restore () { this.ctx.restore(); },
    getFill : function getFill () { return this.ctx.fillStyle; },
    getStroke : function getStroke () { return this.ctx.strokeStyle; },
    rest : function rest () {
      var c = this.ctx;
      c.setTransform(1, 0, 0, 1, 0, 0);
      var d = this.dpr;
      c.scale(d, d);
    },

    stroke : function stroke (col) {
      if (col != undefined) {
        this.ctx.strokeStyle = col;
        this._toStroke = true;
      } else {
        this.ctx.stroke();
      }
    },

    fill : function fill (col) {
      if (col != undefined) {
        this.ctx.fillStyle = col;
        this._toFill = true;
      } else {
        this.ctx.fill();
      }
    },

    getDrawConfigs : function getDrawConfigs () {
      var c = this.ctx;
      return {
        stroke: c.strokeStyle,
        fill: c.fillStyle,
        strokeWidth: c.lineWidth,
        toStroke: this._toStroke,
        toFill: this._toFill,
      }
    },

    arc : function arc (x, y, r, sa = 0, ea = Math.PI / 2) {
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
    },

    sector : function sector (x, y, r, sa, ea) {
      this.ctx.moveTo(x, y);
      this.arc(x, y, r, sa, ea);
    },

    rect : function rect (x, y, w, h = w) {
      ctx.rect(x, y, w, h);
      if (this._toFill) ctx.fill();
      if (this._toStroke) ctx.stroke();
    },

    circle : function circle (x, y, r) { this.arc(x, y, r, 0, Math.PI * 2); },

    triangle : function triangle (x1, y1, x2, y2, x3, y3) {
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
    },
    
    equiTriangle : function equiTriangle (x, y, len, rotation = 0) {
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
    },
    
    poly : function poly () {
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
    },
    
    ellipse : function ellipse (x, y, xDis, yDis) {
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
    },
    
    bezierCurve : function bezierCurve (x1, y1, x2, y2, x3, y3) {
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
    },
    
    quad : function quad (x1, y1, x2, y2, x3, y3, x4, y4) {
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
    },


    /**
     * Draws a regular polygon with centre position number of sides length of a side and rotation
     * @param {number} x        x position
     * @param {number} y        y position
     * @param {number} sides    number of sides
     * @param {number} len      length of a side
     * @param {number} rotation rotation
     */
    regularPoly : function regularPoly (x, y, sides, len, rotation = 0) {
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
    },
    
    loop : function loop (fx, dx, th) {
      var binded = fx.bind(C.prototype);
      this.ctx.animating = true;
      if (dx) {
        C.currentConfigs.currentLoop = setInterval(function () {
          C.setcurrentConfigs(th);
          binded();
        }, dx);
      } else {
        function a(dx) {
          C.currentConfigs.currentLoop = window.requestAnimationFrame(a);
          C.setcurrentConfigs(th);
          binded(dx);
        }
        a();
      }
    },

    clear : function clear () {
      this.rest();
      ctx.clearRect(0, 0, W, H)
    },

    noLoop : function noLoop () {
      clearInterval(C.currentConfigs.currentLoop);
      window.cancelAnimationFrame(C.currentConfigs.currentLoop);
      this.ctx.animating = false;
    },
    
    startPath : function startPath () {
      this.ctx.beginPath();
      this._pathStart = true;
    },
    
    endPath : function endPath () {
      this.ctx.closePath();
      this._pathStart = false;
    }
  }
  C.prototype = Object.assign(C.prototype, C__proto__);
  defineFunction(C__proto__);
})();