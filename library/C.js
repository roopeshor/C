(function () {
  'use strict';
  function C(c, fx, cfg = {}) {
    var container = document.querySelector(c),
      AR = cfg.aspectRatio || [16, 9],
      width = int(
        cfg.width,
        getWidth()
      ),
      height = int(cfg.height, (width / AR[0]) * AR[1]),
      autoPlay = bool(cfg.autoPlay, true),
      thumbnail = cfg.thumbnail || function () { CO.drawPlayBtn() },
      dpr = cfg.scale || ceil(window.devicePixelRatio) || 1;

    var cvs = getCanvas(width, height, dpr),
      ctx = cvs.getContext("2d");

    if (bool(cfg.replaceCurrent, true)) container.innerHTML = "";
    container.appendChild(cvs);
    var CO = {
      cvs: cvs,
      _ctx: ctx,
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
  C.addons = {};

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
