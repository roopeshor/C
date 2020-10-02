addAddons({
  Icons: {
    playBtn: function (c = {}) {
      var p = c.pos || [W / 2, H / 2];
      var len = c.playLen || 11;
      rest();
      fill(c.background || "#3fffac");
      noStroke();
      circle(p[0], p[1], c.totalRadius || 20);
      fill(c.playCol || "#fff");
      equiTriangle(p[0], p[1], len)
    }
  }
});