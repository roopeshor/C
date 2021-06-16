C(".c2", function () {
  background("#000");
  numberPlane({
    includeSubGrid: false,
    gridColor: GREY + "88",
    axisWidth: 1
  });
})
function a() {
  C(".c", function () {
    var m1 = [1, 0, 0, 1, 0, 0], t = 2000;
    var imat =  new Array(6), m2 = new Array(6);
    window.imat = imat;
    for (var i = 0; i < 6; i++) {
      m2[i] = parseFloat(document.querySelector("#m" + i).value)
      imat[i] = (m2[i] - m1[i]) / t;
      m1[i] -= imat[i];
    }
    var passed = Date.now();
    var th = passed;
    loop(function () {
      clear();
      th = Date.now() - th;
      for (var i = 0; i < 6; i++) {
        m1[i] += imat[i] * th;
      }
      console.log(th)
      transform(...m1);
      numberPlane({includeSubGrid: false, gridWidth: 3});
      fill(YELLOW_C);
      noStroke();
      rect(0, 0, 75, 75);
      if ((Date.now() - passed) >= t) noLoop();
    }, 1)
  });
}
a();