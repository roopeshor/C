function defineFunction(obj) {
  for (var i = 0, props = Object.keys(obj); i < props.length; i++) {
    var prop = props[i], op = obj[prop];
    // console.log(prop, op)
    Object.defineProperty(window, prop, {
      configurable: true,
      enumerable: true,
      get: function get() {
        return op;
      },
      set: function set(newValue) {
        Object.defineProperty(window, prop, {
          configurable: true,
          enumerable: true,
          value: newValue,
          writable: true
        });
        console.warn('You changed value of "'+ prop + '" which is a function of C. Be careful while using it');
      }
    });
  }
}

function defineConstant (obj) {
  for (var i = 0, props = Object.keys(obj); i < props.length; i++) {
    var prop = props[i], op = obj[prop];
    console.log(prop,op)
    Object.defineProperty(window, prop, {
      configurable: true,
      enumerable: true,
      get: function get() {
        return op;
      },
      set: function set(newValue) {
        Object.defineProperty(window, prop, {
          configurable: true,
          enumerable: true,
          value: newValue,
          writable: true
        });
        console.warn('You changed value of "'+ prop + '" which is a function of C. Be careful while using it');
      }
    });
  }
}
(function () {
  const CList = {
    DARK_BLUE: "#236B8E",
    DARK_BROWN: "#8B4513",
    LIGHT_BROWN: "#CD853F",
    BLUE_A: "#C7E9F1",
    BLUE_B: "#9CDCEB",
    BLUE_C: "#58C4DD",
    BLUE_D: "#29ABCA",
    BLUE_E: "#1C758A",
    TEAL_A: "#ACEAD7",
    TEAL_B: "#76DDC0",
    TEAL_C: "#5CD0B3",
    TEAL_D: "#55C1A7",
    TEAL_E: "#49A88F",
    GREEN_A: "#C9E2AE",
    GREEN_B: "#A6CF8C",
    GREEN_C: "#83C167",
    GREEN_D: "#77B05D",
    GREEN_E: "#699C52",
    YELLOW_A: "#FFF1B6",
    YELLOW_B: "#FFEA94",
    YELLOW_C: "#FFFF00",
    YELLOW_D: "#F4D345",
    YELLOW_E: "#E8C11C",
    GOLD_A: "#F7C797",
    GOLD_B: "#F9B775",
    GOLD_C: "#F0AC5F",
    GOLD_D: "#E1A158",
    GOLD_E: "#C78D46",
    RED_A: "#F7A1A3",
    RED_B: "#FF8080",
    RED_C: "#FC6255",
    RED_D: "#E65A4C",
    RED_E: "#CF5044",
    MAROON_A: "#ECABC1",
    MAROON_B: "#EC92AB",
    MAROON_C: "#C55F73",
    MAROON_D: "#A24D61",
    MAROON_E: "#94424F",
    PURPLE_A: "#CAA3E8",
    PURPLE_B: "#B189C6",
    PURPLE_C: "#9A72AC",
    PURPLE_D: "#715582",
    PURPLE_E: "#644172",
    WHITE: "#FFFFFF",
    BLACK: "#000000",
    LIGHT_GRAY: "#BBBBBB",
    LIGHT_GREY: "#BBBBBB",
    GRAY: "#888888",
    GREY: "#888888",
    DARK_GREY: "#444444",
    DARK_GRAY: "#444444",
    DARKER_GREY: "#222222",
    DARKER_GRAY: "#222222",
    GREY_BROWN: "#736357",
    PINK: "#D147BD",
    LIGHT_PINK: "#DC75CD",
    GREEN_SCREEN: "#00FF00",
    ORANGE: "#FF862F"
  };
  defineConstant(CList)
  const cnst = {
    E    : "2.718281828459045",
    LN2  : "0.6931471805599453",
    LN10 : "2.302585092994046",
    PI   : "3.141592653589793",
    TAU  : "6.283185307179586",
    SQRT2: "1.4142135623730951",
  }
  defineConstant(cnst)
})();
