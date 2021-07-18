import { defineProperties } from "./defineProperties.js";
import { C } from "./main.js";

import * as COLORLIST from "./constants/colors.js";
import * as DrawingConstants from "./constants/drawing.js";
import * as MathConsts from "./constants/math.js";

import * as Colors from "./basic-constructs/color.js";
import * as Curves from "./basic-constructs/curves.js";
import * as Image from "./basic-constructs/image.js";
import * as Linears from "./basic-constructs/linear.js";
import * as Settings from "./basic-constructs/settings.js";
import * as Text from "./basic-constructs/text.js";

import * as MathFunctions from "./utils/math.js";

import * as Tex from "./advanced/tex.js";
import * as CoordinateSystems from "./advanced/coordinate-systems.js";
import * as Braces from "./advanced/braces.js";
import * as extras from "./advanced/objects.js";


defineProperties(COLORLIST, window, false);
defineProperties(DrawingConstants, window, false);
defineProperties(MathConsts, window, false);

defineProperties(Colors);
defineProperties(Curves);
defineProperties(Image);
defineProperties(Linears);
defineProperties(Settings);
defineProperties(Text);

defineProperties(MathFunctions);

defineProperties(MathConsts, window, false);

defineProperties(Tex);
defineProperties(CoordinateSystems);
defineProperties(Braces);
defineProperties(extras);

defineProperties(defineProperties, C);
defineProperties(COLORLIST, C);

C.addExtension(extras);
