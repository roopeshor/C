var W = 450//getContentWidth(),
  H = 450//innerHeight;

C(
  function () {
    init_Canvas();
    numberPlane({
      xAxis: {
        range: [-1, 1, 0.25],
        length: 400,
        textSize: 12
      },
      yAxis: {
        range: [-1, 1, 0.25],
        length: 400,
        textSize: 12
      },
      grid: {
        draw: true,
        subgrids: 2
      }
    });
  },
  ".container",
  {
    width: W,
    height: H,
    name: "graph",
  }
);
