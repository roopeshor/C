import { defineProperties, MathConsts, MathFunctions, DrawingConstants, COLORLIST } from "./constants.js";
import { randomizers, colorConverters } from "./color.js";
import { C } from "./main.js";
import { CFunctions } from "./drawing-functions.js";
import { more } from "./more-things.js";

// export to global scope
defineProperties(MathConsts, window, false);
defineProperties(MathFunctions);
defineProperties(
  Object.assign({ "TRANSPARENT": "rgba(0,0,0,0)" }, COLORLIST),
  window,
  false
);
defineProperties(DrawingConstants, window, false);
defineProperties({"COLORLIST": COLORLIST}, window, false);
defineProperties(defineProperties, C);

defineProperties(randomizers);
defineProperties(colorConverters);

defineProperties(CFunctions);

C.addExtension(more);
