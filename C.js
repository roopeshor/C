const getCDFObject = function (cvs, width, height) {
  var ctx = cvs.getContext("2d"),
    dpr = window.devicePixelRatio;

  return Object.assign(
    {
      cvs: cvs,
      ctx: ctx,
      W: width,
      H: height,
      line: function (x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
      },
      background: function (c) {
        ctx.save();
        this.rest()
        ctx.fillStyle = c;
        ctx.fillRect(-W, -H, W*2, H*2);
        ctx.restore();
      },
      translate: function (x, y = x) {
        ctx.translate(x, y);
      },
      rest: function () {
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
      },
      stroke: function (c) {
        this.ctx.strokeStyle = c;
      },
      fill: function (c) {
        this.ctx.fillStyle = c;
      },
      strokeWidth: function (n) {
        this.ctx.lineWidth = Number(n);
      },
      getDrawConfigs: function () {
        return {
          stroke: ctx.strokeStyle,
          fill: ctx.fillStyle,
          strokeWidth: ctx.lineWidth
        }
      },
      arc: function (c) {
        ctx.beginPath();
        ctx.arc(
          c.p[0],
          c.p[1],
          c.r,
          c.sa || 0,
          int(c.ea, Math.PI * 2)
        );
        if (bool(c.fill, false)) ctx.fill();
        if (bool(c.stroke, true)) ctx.stroke();
        ctx.closePath();
      },
      circle: function (c) {
        this.arc({
          p: c.p,
          r: c.r,
          sa: 0,
          ea: Math.PI * 2,
          fill: c.fill,
          stroke: c.stroke,
        });
      },
      startLoop: function (fx, time) {
        var s = setInterval(fx.bind(this), time);
        this.recentAnimation = s;
      },
      stopLoop: function (fx = function () {}) {
        if (this.recentAnimation) clearInterval(this.recentAnimation);
        this.recentAnimation = null;
        ctx.animating = false;
        fx.bind(this)();
      },
      getFPS: function () {

      },
      drawPlayBtn: function (c = {}) {
        ctx.save();
        this.rest();
        var p = c.p || [this.W/2, this.H/2];
        this.translate(p[0], p[1]);
        this.fill(c.background || "#3fffac");
        this.arc({
          p: [0, 0],
          r: c.r || 20,
          fill: true,
          stroke: false
        });
        var len = c.playLen || 11;
        ctx.beginPath();
        ctx.moveTo(len, 0);
        this.fill(c.playCol || "#fff");
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
    thumbnail = cfg.thumbnail||function () {CDF.drawPlayBtn()},
    dpr = devicePixelRatio;

  var cvs = getCanvas(),
    ctx = cvs.getContext("2d");
  if (bool(cfg.replaceCurrent, true)) container.innerHTML = "";
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
  var CDF = getCDFObject(cvs, width, height);
  var binded = fx.bind(CDF);
  CDF.rest();
  if (autoPlay) {
    binded();
  } else {
    cvs.onclick = function () {
      if (!ctx.animating) {
        CDF.rest();
        ctx.clearRect(0, 0, width, height);
        binded();
        ctx.animating = true;
      }
    };
    thumbnail.bind(CDF)();
  }
}
