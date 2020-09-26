function addScript(fx) {
  var str = "return " + fx.toString();
  var i = 0;
  var s = "";
  for (var ch of str) {
    i++;
    if (ch == "{") {
      str = s + `{
  const line = this.line,
        circle = this.circle;` + str.substr(i);
      break;
    }
    s += ch;
  }
  str = Function(str);
 return str;
}
function C(c, fx, cfg = {}) {
  var container = c,
    AR = cfg.aspectRatio || [16, 9],
    width = int(
      cfg.width,
      getWidth()
    ),
    height = int(cfg.height, (width / AR[0]) * AR[1]),
    autoPlay = bool(cfg.autoPlay, true),
    thumbnail = addScript(cfg.thumbnail||function () {})(),
    dpr = devicePixelRatio;
    console.log(thumbnail)

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
    stopLoop: function (fx = function () {}) {
      clearInterval(this.recentAnimation);
      this.recentAnimation = null;
      fx.bind(this)();
    },
    drawPlayBtn: function (c = {}) {
      c = Object.assign(c, {
        radius: 20,
        playRadius: 10,
        background: "#00ff5f",
        triFill: "#fff",
        outline: "#000",
      })
      ctx.save();
      ctx.resetTransform();
      ctx.beginPath();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = c.background;
      ctx.strokeStyle = c.outline;
      ctx.lineWidth = 0.5;
      ctx.translate(width/2, height/2);
      ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = c.triFill;
      ctx.moveTo(Math.cos(0) * c.playRadius, Math.sin(0) * c.playRadius);
      for (var i = 1; i < 3; i++) {
        ctx.lineTo(Math.cos(i * Math.PI*2 / 3) * c.playRadius, Math.sin(i * Math.PI*2 / 3) * c.playRadius)
      }
      ctx.fill();
      ctx.restore();
    }
  };
  var str = addScript(fx)();
  window.fx = str.bind(CDF);
  var binded = str.bind(CDF);
  if (autoPlay) {
    binded();
  } else {
    cvs.onclick=  function () {
      ctx.clearRect(0, 0, width, height);
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      binded();
    };
    thumbnail.bind(CDF)();
    CDF.drawPlayBtn();
  }
}
