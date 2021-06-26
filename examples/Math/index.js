var W = 450, //getContentWidth(),
  H = 450; //innerHeight;

var functions = {
  numberLine: {
    fx: function () {
      numberLine({
        range: [-3, 3, 1],
        length: 400,
        textSize: 14,
      });
    },
    configs: {
      width: W,
      height: H / 2,
    },
  },
  axes: {
    fx: function () {
      axes({
        xAxis: {
          length: 400,
        },
        yAxis: {
          length: 400,
        },
      });
    },
    configs: {
      width: W,
      height: H,
    },
  },
  numberPlane: {
    fx: function () {
      numberPlane({
        xAxis: {
          range: [-4, 4, 1],
          length: 400,
          textSize: 15,
        },
        yAxis: {
          range: [-4, 4, 1],
          length: 400,
          textSize: 15,
        },
        grid: {
          draw: true,
          subgrids: 2,
        },
      });
    },
    configs: {
      width: W,
      height:H,
    },
  },
};

for (var i = 0, _functions = Object.keys(functions); i < _functions.length; i++) {
  var _function = functions[_functions[i]];
  C(
    function () { // jshint ignore:line
      init_Canvas();
      _function.fx();
    },
    "."+_functions[i],
    Object.assign(_function.configs, {name: _functions[i]})
  );
}