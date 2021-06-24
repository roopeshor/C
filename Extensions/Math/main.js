var lg = function () {
  console.log(...arguments);
};
var consts = {
  CENTERX: function () {
    return C.workingCanvas.width / 2;
  },
  CENTERY: function () {
    return C.workingCanvas.height / 2;
  },
};

function isArray(obj) {
  return Array.isArray(obj);
}

function arange(start, end, step, rev=false) {
  var arr = [];
  if (rev) {
    var k = start;
    start = end;
    end = k;
  }
  lg(start, end, step)
  for (var i = start; i <= end; i += step) {
    arr.push(i);
  }
  if (rev) arr = arr.reverse();
  return arr;
}

for (var constNames = Object.keys(consts), i = 0; i < constNames.length; i++) {
  var _const = constNames[i];
  (function (name, getter) {
    console.log(name);
    Object.defineProperty(window, name, {
      configurable: true,
      enumerable: true,
      get: getter,
      set: function set(value) {
        Object.defineProperty(window, name, {
          configurable: true,
          enumerable: true,
          value: value,
          writable: true,
        });
      },
    });
  })(_const, consts[_const]);
}
C.addExtension({
  /**
   * Initializes canvas with manim like environment
   *
   */
  init_Canvas: function () {
    background(0);
    fill(WHITE);
    stroke(WHITE);
    noStroke();
    strokeWidth(2);
    translate(CENTERX, CENTERY);
    scale(1, -1);
    C.workingCanvas.scalar = [1, -1];
    fontSize(20);
  },
  clear: function (x, y,width, height) {
    var ctx = C.workingCanvas;
    x = x || -ctx.width / 2;
    y = y || -ctx.height / 2;
    width = width || ctx.width * 2;
    height = height || ctx.height * 2;
    ctx.clearRect(x, y, width, height);
  },
  scale: function (x, y=x) {
    C.workingCanvas.scale(x, y);
  },
  text: function (text, x, y, maxwidth) {
    var ctx = C.workingCanvas;
    scale(1, -1);
    if (ctx._doFill) ctx.fillText(text, x, -y, maxwidth);
    else if (ctx._doStroke) ctx.strokeText(text, x, -y, maxwidth);
    scale(1, -1);
  },
  // drawing functions
  arrow: function (x1, y1, x2, y2, tipWidth = 10, tipScaleRatio = 0.7) {
    var angle = atan2(y2 - y1, x2 - x1); // angle from plain
    arrowHead(x2, y2, tipWidth, angle, tipScaleRatio);
    var r = atan(tipScaleRatio / 2),
      xd = cos(angle) * tipWidth * cos(r),
      yd = sin(angle) * tipWidth * cos(r);
    x2 -= xd;
    y2 -= yd;
    line(x1, y1, x2, y2);
  },
  axis: function () {
    var ctx = C.workingCanvas,
      W = ctx.width,
      H = ctx.height;
    arrow(0, 0, 0, H / 2, 20);
    arrow(0, 0, W / 2, 0, 20);
    arrow(0, 0, 0, -H / 2, 20);
    arrow(0, 0, -W / 2, 0, 20);
  },

  /**
   *
   *
   * @param {number} x x position
   * @param {number} y y position
   * @param {number} [width=10] width of head
   * @param {number} [ang=0] tilt of head
   * @param {number} [tipScaleRatio=2] height to width ratio
   */
  arrowHead: function (x, y, width = 10, ang = 0, tipScaleRatio = 2) {
    var ctx = C.workingCanvas,
      r = atan(tipScaleRatio / 2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - width * cos(ang - r), y - width * sin(ang - r));
    ctx.lineTo(x - width * cos(ang + r), y - width * sin(ang + r));

    ctx.lineTo(x, y);
    if (ctx._doFill) ctx.fill();
    else ctx.stroke();
  },

  /**
   * draws a double edged arrow
   *
   * @param {*} x1 starting X
   * @param {*} y1 starting Y
   * @param {*} x2 ending X
   * @param {*} y2 ending Y
   * @param {number} [headSize=10] size of first arrow's head
   * @param {*} [headSize2=headSize] size of second arrow's head
   * @param {*} [r=sqrt(3)] width / height
   */
  doubleArrow: function (
    x1,
    y1,
    x2,
    y2,
    tipWidth = 10,
    tipScaleRatio = 0.6
  ) {

    var r = atan(tipScaleRatio / 2),
      angle = atan2(y2 - y1, x2 - x1),
      xd = cos(angle) * tipWidth * cos(r),
      yd = sin(angle) * tipWidth * cos(r);
    arrowHead(x1, y1, tipWidth, PI + angle, tipScaleRatio);
    x1 += xd;
    y1 += yd;
    arrow(x1, y1, x2, y2, tipWidth, tipScaleRatio);
  },
  /**
   * creates a numberLine with parameters in a object
   * 
   * point1 : starting point of line
   * point2 : ending point of line
   * range : range of numbers to draw ticks and numbers
   * numbersToExclude : list of numbers that shouldn't be drawn
   * numbersToInclude : list of numbers to be drawn
   * numbersWithElongatedTicks : list of numbers where tick line should be longer
   * includeLeftTip : whether to add an arrow tip at left
   * includeRightTip : whether to add an arrow tip at right
   * tipWidth : width of arrow tip
   * tipSizeRatio : height/width of tip
   * color : color of axis and ticks
   * rotation : amound to rotate the entire line
   * lineWidth : width of lines
   * includeTick : whether ticks should be added
   * excludeOriginTick : whether exclude ticks at origin (0)
   * longerTickMultiple : factor to increase height of ticks at elongated ticks
   * tickHeight : height of ticks
   * textDirection : direction of text relative to nearby tick
   * textColor : color of text
   * textSize : font size of text
   * textRotation : amount to rotate text
   * decimalPlaces : number of decimal places in text
   */
  numberLine: function (config = {}) {
    var ctx = C.workingCanvas,
      point1 = config.point1 || [-ctx.W / 2, 0],
      point2 = config.point2 || [ctx.W / 2, 0],
      range = config.range,

      numbersToExclude = config.numbersToExclude || [],
      numbersToInclude = config.numbersToInclude || [],
      numbersWithElongatedTicks = config.numbersWithElongatedTicks || [],

      includeLeftTip = config.includeLeftTip || false,
      includeRightTip = config.includeRightTip || false,
      tipWidth = config.tipWidth || 20,
      tipSizeRatio = config.tipSizeRatio || 1,

      color = config.color || GREY,
      rotation = config.rotation || 0,
      lineWidth = config.strokeWidth || 3,

      includeTick = config.includeTick,
      excludeOriginTick = config.excludeOriginTick || false,
      longerTickMultiple = config.longerTickMultiple || 1.5,
      tickHeight = config.tickHeight || 15,

      textDirection = config.textDirection || [0, -0.8],
      textColor = config.textColor || WHITE,
      textSize = config.fontSize || 20,
      textRotation = config.textRotation || 0,
      decimalPlaces = config.decimalPlaces;

    if (includeTick == undefined) includeTick = true;

    if (isArray(range)) {
      if (range.length == 2) {
        range = [range[0], range[1], 1];
      }
    } else {
      range = [-1, 1, .2];
    }

    if (isNaN(decimalPlaces)) {
      decimalPlaces = range[2].toString().split(".")[1]?.length || 0;
    }

    var min = range[0];
    var max = range[1];
    var step = range[2];
    var totalTicks = (max - min) / step;
    var x1 = point1[0],
      y1 = point1[1],
      x2 = point2[0],
      y2 = point2[1];
    // draw axis
    var angle = atan2(y2 - y1, x2 - x1);
    rotate(rotation + angle);
    var dx = (x2 - x1) / totalTicks;
    var dy = (y2 - y1) / totalTicks;
    if (includeTick) drawTicks();
    if (isArray(numbersToInclude) || includeNumbers) drawNumbers();
    drawAxis();
    function drawAxis() {
      stroke(color);
      strokeWidth(lineWidth);
      fill(color);
      var r = atan(tipSizeRatio / 2);
      if (includeLeftTip) {
        arrowHead(x1, y1, tipWidth, PI + (rotation + angle), tipSizeRatio)
        x1 += cos(angle) * tipWidth * cos(r);
        y1 += sin(angle) * tipWidth * cos(r);
      }
      if (includeRightTip) {
        arrowHead(x2, y2, tipWidth, -(rotation + angle), tipSizeRatio)
        x2 -= cos(angle) * tipWidth * cos(r);
        y2 -= sin(angle) * tipWidth * cos(r);
      }
      line(x1, y1, x2, y2);

    }

    function drawTicks() {
      var list = getTickList();
      if (excludeOriginTick) {
        translate(-dx,0)
      }
      lg(list)
      for (var i = 0; i > -list[0].length && numbersToExclude.indexOf(list[0][i]) < 0; i--) {
        var tick = list[0][i];
        var TH = tickHeight;
        if (numbersWithElongatedTicks.indexOf(tick) > -1) {
          TH *= longerTickMultiple;
        }
        line(dx * i, dy * i - TH / 2, dx * i, dy * i + TH / 2);
      }
      if (excludeOriginTick) {
        translate(dx*2,0)
      }
      for (var i = 0; i < list[1].length && numbersToExclude.indexOf(list[1][i]) < 0; i++) {
        var tick = list[1][i];
        var TH = tickHeight;
        if (numbersWithElongatedTicks.indexOf(tick) > -1) {
          TH *= longerTickMultiple;
        }
        line(dx * i, dy * i - TH / 2, dx * i, dy * i + TH / 2);
      }
      if (excludeOriginTick) {
        translate(-dx,0)
      }
    }

    function drawNumbers() {
      var numbers = numbersToInclude.length > 0 ? numbersToInclude : getTickList();
      fill(textColor);
      fontSize(textSize);
      var yShift = textDirection[1] * textSize - textSize / 3;
      if (excludeOriginTick) {
        translate(-dx,0)
      }
      for (var i = 0; i > -numbers[0].length && numbersToExclude.indexOf(numbers[0][i]) < 0; i--) {
        var tick = numbers[0][-i].toFixed(decimalPlaces);
        var width = measureText(tick).width;
        var xShift = -width/2 + textDirection[0] * textSize;
        translate(dx * i + xShift, dy * i + yShift)
        rotate(textRotation)
        text(tick, 0, 0);
        rotate(-textRotation)
        translate(-(dx * i + xShift), -(dy * i + yShift))
      }
      if (excludeOriginTick) {
        translate(dx*2,0)
      }
      for (var i = 1; i < numbers[1].length; i++) {
        var tick = numbers[1][i].toFixed(decimalPlaces);
        var width = measureText(tick).width;
        var xShift = -width/2 + textDirection[0] * textSize;
        lg(i, tick, dx*i)
        translate(dx * i + xShift, dy * i + yShift)
        rotate(textRotation)
        text(tick, 0, 0);
        rotate(-textRotation)
        translate(-(dx * i + xShift), -(dy * i + yShift))
      }
      if (excludeOriginTick) {
        translate(-dx,0)
      }
    }

    function getTickList() {
      var _max;
      if (includeRightTip) _max = max - step;
      else _max = max;

      if (includeLeftTip) _min = min + step;
      else _min = min;

      // if both start and end are +/-
      if ((min < max) && max < 0 || max > min && min > 0) {
        return arange(_min, _max, step)
      }

      startPoint = 0
      if (excludeOriginTick) startPoint += step;

      minSegment = arange(-startPoint, _min, step, 1);
      maxSegment = arange(startPoint, _max, step);

      return [minSegment, maxSegment];
    }

    return sqrt(dx**2 + dy**2);
  }
});
