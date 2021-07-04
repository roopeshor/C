const W = C.getContainerWidth(document.querySelector("section"));
const H = 450; // innerHeight;

const examples = {
  numberLine: {
    fx: function () {
      numberLine({
        range: [-3, 3, 1],
        length: 400,
        textSize: 14
      });
    },
    configs: {
      width: W,
      height: H / 2
    }
  },
  axes: {
    fx: function () {
      axes({
        xAxis: {
          length: 400
        },
        yAxis: {
          length: 400
        }
      });
    },
    configs: {
      width: W,
      height: H
    }
  },
  numberPlane: {
    fx: function () {
      numberPlane({
        xAxis: {
          range: [-4, 4, 1],
          length: 400,
          textSize: 15
        },
        yAxis: {
          range: [-4, 4, 1],
          length: 400,
          textSize: 15
        },
        grid: {
          draw: true,
          subgrids: 2
        }
      });
    },
    configs: {
      width: W,
      height: H
    }
  }
};

for (let i = 0, _functions = Object.keys(examples); i < _functions.length; i++) {
  var example = examples[_functions[i]];
  C(
    function () { // jshint ignore:line
      init_Canvas();
      example.fx();
    },
    "." + _functions[i],
    Object.assign(example.configs, { name: _functions[i] })
  );
}
