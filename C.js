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
