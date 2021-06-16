(function () {
  // addding to window
  defineFunction({
    // functions
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
    dist: function dist  (p1, p2) {
      return sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
    },
    sigmoid:function sigmoid  (x) {
      return 1.0 / (1 + Math.exp(-x));
    },
    smooth: function smooth (t, inflection = 10.0) {
      var error = sigmoid(-inflection / 2);
      return limit(
        (sigmoid(inflection * (t - 0.5)) - error) / (1 - 2 * error),
        0, 1,
        );
    },
    rushInto: function rushInto (t, inflection = 10.0) {
      return 2 * smooth(t / 2.0, inflection);
    },
    rushFrom: function rushFrom (t, inflection = 10.0) {
      return 2 * smooth(t / 2.0 + 0.5, inflection) - 1;
    },
    slowInto: function slowInto (t) {
      return Math.sqrt(1 - (1 - t) * (1 - t));
    },
    doubleSmooth: function doubleSmooth (t) {
      if (t < 0.5)
        return 0.5 * smooth(2 * t);
        else
        return 0.5 * (1 + smooth(2 * t - 1));
      },
      limit: function limit (x, mi = 0, ma = 1) {
      return Math.min(Math.max(x, mi), ma);
    },
    int: function int(a, b) { return isNaN(a) ? b : a; },
    bool: function bool(a, b) { return a == undefined ? b : a; },
    getWidth: function getWidth() {
      var cs = window.getComputedStyle(document.body);
      return window.innerWidth - parseInt(cs.marginLeft) * 2;
    },
    
    addAddons: function addAddons(extObj) {
      window.C.addons = Object.assign(window.C.addons, extObj);
      for (var addon of Object.keys(C.addons)) {
        C.prototype[addon] = window[addon] = C.addons[addon]
      }
    },
    getCanvas: function getCanvas(width, height, dpr) {
      var cvs = document.createElement("canvas");
      cvs.style.width = width + "px";
      cvs.style.height = height + "px";
      cvs.width = dpr * width;
      cvs.height = dpr * height;
      cvs.style.position = "relative";
      return cvs;
    },
  });
})();