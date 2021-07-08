import {
  _defineProperties,
  MathConsts,
  MathFunctions,
  DrawingConstants,
  _COLORLIST,
} from "./constants.js";

import { randomizers, colorConverters } from "./color.js";
import { C } from "./main.js";
import { CFunctions } from "./drawing-functions.js";

console.log(
  _defineProperties,
  MathConsts,
  MathFunctions,
  DrawingConstants,
  _COLORLIST
);
console.log(randomizers, colorConverters);
console.log(C);

C(() => {
  background(0);
}, "body");
