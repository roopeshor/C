var display = document.querySelector(".display");
var W = getContentWidth();
C(function() {
  background(BLACK);
  var colors = [
    [
      BLUE_A,
      BLUE_B,
      BLUE_C,
      BLUE_D,
      BLUE_E
    ],
    [
      TEAL_A,
      TEAL_B,
      TEAL_C,
      TEAL_D,
      TEAL_E
    ],
    [
      GREEN_A,
      GREEN_B,
      GREEN_C,
      GREEN_D,
      GREEN_E
    ],
    [
      YELLOW_A,
      YELLOW_B,
      YELLOW_C,
      YELLOW_D,
      YELLOW_E
    ],
    [
      GOLD_A,
      GOLD_B,
      GOLD_C,
      GOLD_D,
      GOLD_E,
    ],
    [
      RED_A,
      RED_B,
      RED_C,
      RED_D,
      RED_E
    ],
    [
      MAROON_A,
      MAROON_B,
      MAROON_C,
      MAROON_D,
      MAROON_E,
    ],
    [
      PURPLE_A,
      PURPLE_B,
      PURPLE_C,
      PURPLE_D,
      PURPLE_E,
    ],
    [
      DARK_BLUE,
      DARK_BROWN,
      LIGHT_BROWN,
    ],
    [
      WHITE,
      LIGHT_GREY,
      GREY,
      DARK_GRAY,
      DARKER_GRAY,
      GREY_BROWN,
    ],
    [
      PINK,
      LIGHT_PINK,
      GREEN_SCREEN,
      ORANGE,
    ],
  ]
  var stopNames = [
    "Blue",
    "Teal",
    "Green",
    "Yellow",
    "Gold",
    "Red",
    "Maroon",
    "Purple",
    "3B1B Primary",
    "Grey shades",
    "Other",
  ]
  var w = 100;
  fontSize("20px");
  translate(10, 100)
  for (var i = 0, k = 0; i < colors.length; i++) {
    for (var k = 0, col = colors[i]; k < col.length; k++) {
      fill(col[k]);
      rect(150 + k * w, 0, w, 20)
    }
    translate(0, 21)
    text(stopNames[i], 0, 0)
  }
}, display, {
  width: W,
  height: 900,
})
