function C(c, fx, cfg = {}) {
  var container = c,
    AR = cfg.aspectRatio || [16, 9],
    width = int(
      cfg.width,
      getWidth()
    ),
    height = int(cfg.height, (width / AR[0]) * AR[1]),
    autoPlay = bool(cfg.autoPlay, true),
    dpr = devicePixelRatio;

  var cvs = getCanvas(),
    ctx = cvs.getContext("2d");
  ctx.scale(dpr, dpr);
  if (cfg.replaceCurrent) container.innerHTML = "";
  container.appendChild(cvs);
  function getCanvas() {
    var cvs = document.createElement("canvas");
    cvs.width = dpr * width;
    cvs.height = dpr * height;
    cvs.style.width = width + "px";
    cvs.style.height = height + "px";
    cvs.style.position = "relative";
    cvs.style.zIndex = "-10";
    return cvs;
  }
  var CDF = {
    W: width,
    H: height,
    stroke: "#fff",
    fill: "#fff",
    strokeWidth: 1,
    recentAnimation: null,
    line: function (x1, y1, x2, y2) {
      ctx.beginPath();
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.strokeWidth;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    background: function (c) {
      ctx.beginPath();
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, width, height);
    },
    translate: function (x = 0, y = x) {
      ctx.translate(x, y);
    },
    invertYAxis: function () {
      ctx.scale(1, -1);
    },
    invertXAxis: function () {
      ctx.scale(-1, 1);
    },
    arc: function (x, y, r, sa, ea, stroke = true, fill = false) {
      ctx.beginPath();
      ctx.fillStyle = this.fill;
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.strokeWidth;
      ctx.arc(x, y, r, sa, ea);
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    },
    circle: function (x, y, r) {
      this.arc(x, y, r, 0, TAU);
    },

    dot: function (x, y, r = 4) {
      if (this.fill == NONE) this.fill = YELLOW_C;
      const ts = this.stroke;
      this.stroke = NONE;
      CDF.circle(x, y, r);
      stroke = ts;
    },
    loop: function (fx, dt = 10) {
      this.recentAnimation = setInterval(fx.bind(this), dt);
    },
    stopLoop: function () {
      clearInterval(this.recentAnimation);
      this.recentAnimation = null;
    },
  };

  var binded = fx.bind(CDF);
  if (autoPlay) {
    binded();
  } else {
    var pscreen = document.createElement("div");
    pscreen.className += " cjs-play-div";
    pscreen.style.width = width + "px";
    pscreen.style.height = height + "px";
    pscreen.style.marginTop = -height + "px";
    pscreen.innerHTML = "<span class='cjs-ctrl-play-btn' >play</span>"
    container.appendChild(pscreen);
    container.onclick = function () {
      container.removeChild(pscreen);
      binded();
    };
  }
}
