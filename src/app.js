import { defineProperties } from "./utils.js";

import * as MathConsts from "./constants/math.js";
import * as COLORLIST from "./constants/colors.js";
import * as DrawingConstants from "./constants/drawing.js";
import * as ColorPalettes from "./constants/color_palettes.js";

import * as Gradients from "./color/gradients.js";
import * as Color_Random from "./color/random.js";
import * as Color_Reader from "./color/color_reader.js";
import * as Interpolation from "./color/interpolation.js";
import * as Color_Converters from "./color/color_converters.js";

import * as ImageDrawings from "./image/image.js";
import * as ImageProcessing from "./image/processing.js";

import * as Tex from "./objects/tex.js";
import * as Settings from "./settings.js";
import * as Text from "./objects/text.js";
import * as Braces from "./objects/braces.js";
import * as Arrows from "./objects/arrows.js";
import * as Geometry from "./objects/geometry.js";
import * as Functions from "./objects/functions.js";
import * as CoordinateSystems from "./objects/coordinate_systems.js";
import * as MoreShapes from "./objects/more_shapes.js";

import * as Basic from "./math/basic.js";
import * as Points from "./math/points.js";
import * as Math_Random from "./math/random.js";
import * as Arithmeics from "./math/aritmetics.js";
import * as RateFunctions from "./math/rate_functions.js";
import { C } from "./main.js";

defineProperties(COLORLIST);
defineProperties(DrawingConstants);
defineProperties(MathConsts);
defineProperties(ColorPalettes);

defineProperties(Color_Converters);
defineProperties(Color_Reader);
defineProperties(Gradients);
defineProperties(Color_Random);
defineProperties(Interpolation);

defineProperties(ImageProcessing);

defineProperties(ImageDrawings);
defineProperties(Geometry);
defineProperties(Settings);
defineProperties(Text);
defineProperties(Tex);
defineProperties(CoordinateSystems);
defineProperties(Braces);
defineProperties(Arrows);
defineProperties(Functions);
defineProperties(MoreShapes);

defineProperties(Arithmeics);
defineProperties(Basic);
defineProperties(Points);
defineProperties(Math_Random);
defineProperties(RateFunctions);

defineProperties(MathConsts);

defineProperties(defineProperties);
defineProperties(COLORLIST, C.COLORLIST);

//! Experimental features
import * as WebGL from "./WebGL/webgl.js";
import * as WebGLSettings from "./WebGL/settings.js";
defineProperties(WebGL);
defineProperties(WebGLSettings);
