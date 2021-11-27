// important functions & constants
import { defineProperties } from "./utils.js";
import { C } from "./main.js";
import * as Settings from "./settings.js";

import * as Math from "./constants/math.js";
import * as Drawing from "./constants/drawing.js";

import * as Gradients from "./color/gradients.js";
import * as Interpolation from "./color/interpolation.js";

import * as Image from "./image/image.js";

import * as Text from "./objects/text.js";
import * as Geometry from "./objects/geometry.js";

import * as Functions from "./math/functions.js";
import { dist } from "./math/points.js";
import * as Random from "./math/random.js";

[
	{ defineProperties, C, dist },
	Settings,
	Math,
	Drawing,
	Gradients,
	Interpolation,
	Image,
	Text,
	Geometry,
	Functions,
	Random,
].forEach((value) => defineProperties(value));
