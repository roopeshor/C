import { UNIT_VEC } from "../constants/math.js";

/**
 * @typedef {Object} CartesianPoint
 * @property {number} x
 * @property {number} y
 * @property {number} radius radius of point
 * @property {string} fill fill style
 * @property {string} stroke stroke styles
 */
export const CartesianPoint = {};
/**
 * @typedef {Object} PolarPoint
 * @property {number} r distance from origin
 * @property {number} phi radial distance from +x axis in CCW direction
 * @property {number} radius radius of point
 * @property {string} fill fill style
 * @property {string} stroke stroke styles
 */
export const PolarPoint = {};

/**
 * @typedef {Object} ParametricPlotter
 * @property {number[][]} points : Array of computed points in the function
 * @property {Function} draw : Function that draws the plot
 * @property {Function} animate : Function that animates the drawing of the shape. Accept argument `duration` which is the duration of animation.
 * @property {number[]} points
 * @property {number} dur
 * @property {string} name
 * @property {boolean} closed
 * @property {number} tension
 * @property {boolean} smoothen
 * @property {Function} rateFunction
 * @property {boolean} syncWithTime
 */
export const ParametricPlotter = {};

/**
 * @typedef {Object} ParametricFunctionConfigs
 * @property {Function} plotter function to plot. Must recieve one argument and return a array of point as [x, y]
 * @property {number} [tension=1] Smoothness tension.
 * @property {number[]} [range=RANGE] Range as [min, max, dt]
 * @property {number[]} [discontinuities] Array of t where the curve discontinues.
 * @property {number[]} [unitValue=[1, 1]] Value of each unit space
 * @property {number[]} [unitSpace=[1, 1]] Length of each unit in pixels
 * @property {boolean} [smoothen=true] Whether to smoothen the shape.
 * @property {boolean} [closed=false] Whether the function draws a closed shape.
 * @property {boolean} [draw=true] Wheteher to draw the function graph right now.
 * @property {number} [strokeWidth=2]
 * @property {number} [discontinuityRadius=range[2]]
 *
 */
const RANGE = [0, 10, 0.1];

export const ParametricFunctionConfigs = {
	tension: 1,

	unitValue: UNIT_VEC,
	unitSpace: UNIT_VEC, // length of each unit in pixels
	range: RANGE,
	discontinuities: [],

	smoothen: true,
	closed: false,
	draw: true,

	// for animation
	dur: 4000,
};

/**
 * @typedef {Object} HeatPlotConfigs
 * @property {Function} plotFunction function to be plotted.
 * @property {number[]} [min=[-4, -4]] minimum point
 * @property {number[]} [max=[4, 4]] maximum point
 * @property {Object} [colors] object of color map
 * @property {number[]} [unitValue=UNIT_VEC] Value of each unit space
 * @property {number[]} [unitSpace=UNIT_VEC] Length of each unit in pixels
 * @property {number} [resolution=1] resolution of plot in pixels
 * @property {Function} [interpolator=linear] function to interpolate color.
 */
export const HeatPlotConfigs = {
	min: [-4, -4],
	max: [4, 4],
	colors: {
		"-5": "#b36e38b0",
		"-3": "#ff9c52b0",
		"-1": "#ffcea9b0",
		0: "#dcdcddb0",
		1: "#9fcaedb0",
		3: "#3d96dab0",
		5: "#2b6b99b0",
	},
	unitSpace: UNIT_VEC,
	unitValue: UNIT_VEC,
	resolution: 1,
	interpolator: (x) => x,
};

/**
 * @typedef {Object} CartesianPointPlotterConfigs
 * @property {CartesianPoint[]} points list of points
 * @property {number[]} [unitValue=[1,2]] unit Value
 * @property {number[]} [unitSpace=[1,2]] unit Space
 * @property {string} [fill="#ffffff"] color to fill point
 * @property {string} [stroke="#00000000"] color of stroke around point
 * @property {number} [radius=5] radius of point
 */
export const CartesianPointPlotterConfigs = {
	unitValue: UNIT_VEC,
	unitSpace: UNIT_VEC,
	fill: "#ffffff",
	stroke: "#00000000",
	radius: 5,
};

/**
 * @typedef {Object} PolarPointPlotterConfigs
 * @property {PolarPoint[]} points list of points
 * @property {number} radialSpacing size of each unit radius in pixels
 * @property {number[]} [unitValue=[1,2]] unit Value
 * @property {number[]} [unitSpace=[1,2]] unit Space
 * @property {string} [fill="#ffffff"] color to fill point
 * @property {string} [stroke="#00000000"] color of stroke around point
 * @property {number} [radius=5] radius of point
 */
export const PolarPointPlotterConfigs = {
	unitValue: UNIT_VEC,
	unitSpace: UNIT_VEC,
	fill: "#ffffff",
	stroke: "#00000000",
	radius: 5,
	radialSpacing: 2,
};

/**
 * @typedef {Object} PolarParametricFunctionConfigs
 * @property {Function} plotter function that takes one arguments t and returns a coordinate as [radius, angle]
 * @property {number} [tension=1]
 * @property {number} [radialSpacing=1]
 * @property {number[]} [range=[0, Math.PI * 2, Math.PI / 50]]
 * @property {Array} [discontinuities=[]]
 * @property {boolean} [smoothen=true]
 * @property {boolean} [closed=false]
 * @property {number} [strokeWidth=2]
 * @property {number} [discontinuityRadius=range[2]]
 */
export const PolarParametricFunctionConfigs = {
	tension: 1,
	radialSpacing: 1,
	range: [0, Math.PI * 2, Math.PI / 50],
	discontinuities: [],
	smoothen: true,
	closed: false,
	strokeWidth: 2,
};

/**
 * @typedef {Object} PolarParametricFunctionRes
 * @property {number[][]} points
 * @property {boolean} closed
 * @property {number} tension
 * @property {boolean} smoothen
 */
export const PolarParametricFunctionRes = {};
