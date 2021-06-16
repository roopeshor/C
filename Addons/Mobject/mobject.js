(function () {
  var c = Math.cos, s = Math.sin, r = Math.sqrt;
  function _int (a, b) {
    return isNaN(a) ? b: a;
  }
  function bool (a, b) {
      return a == undefined ? b : a;
  }
  window.addAddons({
    arrow: function (x1, y1, x2, y2, size = 15) {
      var ex = x2 - x1,
        ey = y2 - y1,
        ang = Math.atan2(ey,ex);
        d = r(ex**2 + ey**2) - (size / r(3)),
        d1 = r(ex**2 + ey**2) - (size * r(3) / 2);
      window.line(x1, y1, c(ang) * d1, s(ang) * d1);
      var str = C.prototype._toStroke;
      noStroke();
      window.equiTriangle(c(ang) * d, s(ang) * d, size, ang);
      C.prototype._toStroke = str;
    },
    numberLine: function (cf = {}) {
      var size = _int(cf.cellSize, 75),
        min = _int(cf.min, -W / size / 2),
        max = _int(cf.max, W / size / 2),
        axisCol = cf.axisColor || LIGHT_GREY,
        axisWidth = _int(cf.axisWidth, 3),
        rotation = _int(cf.rotation, 0),
        tH = _int(cf.tickHeight, 10),
        includeTicks = bool(cf.includeTicks, true);

      save();
      translate(W/2, H/2)
      rotate(rotation);
      strokeWidth(axisWidth);
      stroke(axisCol);
      line(min * size, 0, max * size, 0);

      if (includeTicks) {
        for (var i = 0; i <= max; i++) {
          line(i * size, -tH/2, i * size, tH/2);
        }
        for (var i = 0; i >= min; i--) {
          line(i * size, -tH/2, i * size, tH/2);
        }
      }
      restore();
    },
    numberPlane: function (cf = {}) {
      var size = _int(cf.cellSize, 75),
        xMin = _int(cf.xMin, Math.floor(-W / size / 2)),
        xMax = _int(cf.xMax, Math.ceil(W / size / 2)),
        yMin = _int(cf.yMin, Math.floor(-H / size / 2)),
        yMax = _int(cf.yMax, Math.ceil(H / size / 2)),
        axisCol = cf.axisColor || LIGHT_GREY,
        gridCol = cf.gridColor || BLUE_C,
        subGridCol = cf.subGridColor || GREY + "88",
        axisWidth = _int(cf.axisWidth, 2.2),
        gridWidth = _int(cf.gridWidth, 1.3),
        subGridWidth = _int(cf.axisWidth, 1),
        tH = _int(cf.tickHeight, 10),
        includeTicks = bool(cf.includeTicks, false),
        includeGrid = bool(cf.includeGrid, true),
        rotation = _int(cf.rotation, 0),
        includeSubGrid = bool(cf.includeSubGrid, true);
      this.numberLine({
        min: xMin,
        cellSize: size,
        max: xMax,
        axisCol: axisCol,
        axisWidth: axisWidth,
        tickHeight: tH,
        includeTicks: includeTicks,
        rotation: rotation
      });
      
      this.numberLine({
        min: yMin,
        cellSize: size,
        max: yMax,
        axisCol: axisCol,
        axisWidth: axisWidth,
        tickHeight: tH,
        includeTicks: includeTicks,
        rotation: Math.PI / 2 + rotation
      });

      stroke(gridCol);
      strokeWidth(gridWidth);
      translate(W/2, H/2);
      ctx.rotate(rotation)
      var xmi = Math.floor(xMin), xma = Math.ceil(xMax),
      ymi = Math.floor(yMin), yma = Math.ceil(yMax);
      function grid (dx = 0) {
        for (var x = xmi + dx; x < xma; x++) if (x) line(x * size, -H/2, x * size, H/2);
        for (var y = ymi + dx; y < yma; y++) if (y) line(-W/2, y * size, W/2, y * size);
      }
      if (includeGrid) grid();
      if (includeSubGrid){
        stroke(subGridCol);
        strokeWidth(subGridWidth);
        grid(0.5)
      };
    }
  });
})();
