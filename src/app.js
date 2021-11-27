import { defineProperties } from "./utils.js";
import { C } from "./main.js";

import * as _settings from "./settings.js";
import * as _constants$math from "./constants/math.js";
import * as _constants$drawing from "./constants/drawing.js";
import * as _constants$color_palettes from "./constants/color_palettes.js";
import * as _color$gradients from "./color/gradients.js";
import * as _color$random from "./color/random.js";
import * as _color$color_reader from "./color/color_reader.js";
import * as _color$interpolation from "./color/interpolation.js";
import * as _color$color_converters from "./color/color_converters.js";
import * as _image$image from "./image/image.js";
import * as _image$processing from "./image/processing.js";
import * as _objects$tex from "./objects/tex.js";
import * as _objects$text from "./objects/text.js";
import * as _objects$braces from "./objects/braces.js";
import * as _objects$arrows from "./objects/arrows.js";
import * as _objects$geometry from "./objects/geometry.js";
import * as _objects$functions from "./objects/functions.js";
import * as _objects$coordinate_systems from "./objects/coordinate_systems.js";
import * as _objects$more_shapes from "./objects/more_shapes.js";
import * as _math$functions from "./math/functions.js";
import * as _math$points from "./math/points.js";
import * as _math$random from "./math/random.js";
import * as _math$aritmetics from "./math/aritmetics.js";
import * as _math$rate_functions from "./math/rate_functions.js";
//! Experimental features
import * as _WebGL$webgl from "./WebGL/webgl.js";
import * as _WebGL$settings from "./WebGL/settings.js";

[
	{ defineProperties, C },
	_settings,
	_constants$math,
	_constants$drawing,
	_constants$color_palettes,
	_color$gradients,
	_color$random,
	_color$color_reader,
	_color$interpolation,
	_color$color_converters,
	_image$image,
	_image$processing,
	_objects$tex,
	_objects$text,
	_objects$braces,
	_objects$arrows,
	_objects$geometry,
	_objects$functions,
	_objects$coordinate_systems,
	_objects$more_shapes,
	_math$functions,
	_math$points,
	_math$random,
	_math$aritmetics,
	_math$rate_functions,
	_WebGL$webgl,
	_WebGL$settings,
].forEach(value => defineProperties(value));
