var __defined_colors__ = Object.keys(COLORLIST);


// other color functions
function _randomColor() {
  var color = "#";
  for (var i = 0; i < 3; i++) {
    var randNum = randomInt(255).toString(16);
    randNum = randNum.length == 1 ? 0 + randNum : randNum;
    color += randNum;
  }
  return color;
}

function _randomDefinedColor() {
  return COLORLIST[
    __defined_colors__[randomInt(__defined_colors__.length - 1)]
  ];
}

defineProperties({
  randomColor: _randomColor,
  randomDefinedColor: _randomDefinedColor,
});