import { fillText } from "../text.js";
import { ORIGIN } from "../../constants/math.js";

/**
 * @typedef {Object} ScalarSpaceProperties configurations about the number line
 * @property {number[]} range -  range of numbers to draw ticks and numbers
 * @property {number[]} originPosition - Center of the number line in px
 * @property {number[]} tickList - List of tick inervals
 * @property {number} unitValue - How much a unit is in its value in x and y directions.
 * @property {number} unitSpace - How much a unit is in px in x and y directions.
 */
export const ScalarSpaceProperties = {};

/**
 * @typedef {Object} NumberLineConfigs configurations given tonumberLine
 *
 * @property {number} [rotation=0] rotation of line around its origin
 * @property {number} [strokeWidth=2] stroke width of number line and ticks
 * @property {number} [length=WIDTH] length of number line (in terms of pixels)
 * @property {number[]} [originPosition=ORIGIN] position of origin relative to unitSize
 * @property {number[]} [range=[-5, 5, 1]] range of numbers to draw ticks and numbers. Default: [-5, 5, 1]
 * @property {string} [strokeColor="#ffffff88"] color of number line and ticks
 * @property {string} [axisLabel=""] label of axis. By default no axis label is drawn
 * @property {number} [axisLabelSize=24] font size of axis label
 * @property {string} [axisLabelColor="#fff"] color of axis label
 * @property {number[]} [axisLabelDirection=[0.5, 1.5]] position of axis label relative to right tip
 *   end in terms of height of axis label.See {@link measureHeight}
 * @property {number} [tipLength=13] length of tip (horizontal stretch)
 * @property {number} [tipBreadth=10] height of tip
 * @property {number} [fontSize=17] size of tick labels
 * @property {string} [fontFamily="serif"] font of tick labels
 * @property {string} [textRenderer=fillText] function used to render text. Eg: fillText, strokeText
 * @property {string} [textBaseline="middle"] baseline of labels
 * @property {string} [textColor="#ffffff"] color of labels
 * @property {string} [textAlign="center"] horizontal alignment of label
 * @property {number} [textRotation=0] rotatoin of label around its center
 *   (works with default values of textBaseline and textAlign)
 * @property {number[]} [labelDirection=[0, -1.6]] position of tick labels relative to their ticks
 *   in number line in terms of height of label.See {@link measureHeight}
 * @property {number} [tickHeight=10] height of ticks in pixels
 * @property {number} [longerTickHeight=15] height of longer ticks (marked by
 *   numbersWithElongatedTicks) in terms of pixels
 * @property {number[]|string[]} [labelsToInclude=[]] labels to display instead of numbers
 *   generated from range. Contents of this array will be displayed, if this is included
 *   in configs.
 * @property {number[]} [numbersToExclude=[]] numbers to exclude from displaying. These numbers
 *   are part of default labels
 * @property {number[]} [numbersWithElongatedTicks=[]] numbers that should be displayed elongated
 * @property {boolean} [includeTicks=true] whether to display ticks
 * @property {boolean} [includeLabels=true] whether to display labels
 * @property {boolean} [includeLeftTip=false] whether to display left tip. It will
 *   remove left-most tick
 * @property {boolean} [includeRightTip=false] whether to display right tip. It will
 *   remove right-most tick
 */
export const NumberLineConfigs = {
	rotation: 0,
	strokeWidth: 2,
	originPosition: ORIGIN,
	range: [-5, 5, 1],
	strokeColor: "#ffffff88",
	axisLabel: "",
	axisLabelSize: 24,
	axisLabelColor: "#fff",
	axisLabelDirection: [0.5, 1.5],

	tipLength: 13,
	tipBreadth: 10,

	fontSize: 17,
	fontFamily: "serif",
	textRenderer: fillText,
	textBaseline: "middle",
	textColor: "#fff",
	textAlign: "center",
	textRotation: 0,
	labelDirection: [0, -1.6],

	tickHeight: 10,
	longerTickHeight: 15,
	labelsToInclude: [],
	numbersToExclude: [],
	numbersWithElongatedTicks: [],

	includeTicks: true,
	includeLabels: true,
	includeLeftTip: false,
	includeRightTip: false,
};

/**
 * @typedef {Object} CartesianPlotters
 * @property {Function} plotParametricFunction plots a parametricFunction. see {@link parametricFunction}
 * @property {Function} plotFunctionGraph plots a ordinary single valued function. see {@link functionGraph}
 * @property {Function} plotHeatPlot plots a 2D heatPlot. see {@link heatPlot}
 * @property {Function} plotPoints plots a list of points. see {@link plotPoints}
 * @property {Function} originPosition Center of of axis in terms of `unitSpaces`
 * @property {Function} scaleCanvas scales cavas by `unitSpaces`/`unitSize`
 * @property {ScalarSpaceProperties} xAxis properties of x axis
 * @property {ScalarSpaceProperties} yAxis properties of y axis
 * @property {number[]} unitSpace space between two ticks in pixels
 * @property {number[]} unitValue value between two close ticks
 */
export const CartesianPlotters = {};

/**
 * @typedef {Object} NumberPlaneConfigs
 * @property {NumberLineConfigs} xAxis Configurations for x axis. See {@link numberLine} for possible configurations.
 * @property {NumberLineConfigs} yAxis Configurations for y axis. See {@link numberLine} for possible configurations.
 * @property {number[]} originPosition Center of number plane as [x, y] in px.
 * @property {number[]} [subgrids] number of sub-grid lines in each cell. Default=[1,1]
 * @property {number} [gridStrokeWidth = 1]  stroke width of grid lines
 * @property {number} [subgridStrokeWidth = 0.7]  stroke width of sub-grid
 * @property {string} [gridStrokeColor = "#58c4dda0"]  color of grid lines
 * @property {string} [subgridStrokeColor = "#888888a0"]  color of sub-grids
 */
export const NumberPlaneConfigs = {
	includeTicks: true,
	includeLabels: true,
	includeLeftTip: false,
	includeRightTip: false,
	excludeOriginTick: true,

	subgrids: [1, 1],
	gridStrokeWidth: 1.3,
	subgridStrokeWidth: 0.8,
	gridStrokeColor: "#00ffff44",
	subgridStrokeColor: "#88888850",
	originPosition: ORIGIN,
};

/**
 * @typedef {Object} AxesConfigs
 * @property {NumberLineConfigs} xAxis Configurations for x axis. (See {@link numberLine} for more configurations)
 * @property {NumberLineConfigs} yAxis Configurations for y axis. (See {@link numberLine} for more configurations)
 * @property {number[]} [originPosition = ORIGIN] originPosition of axes
 * @property {boolean} [includeTicks=true] whether to display ticks. This is passed to each numberLines
 * @property {boolean} [includeLeftTip=false] whether to display left tip. It will
 *   remove left-most tick. This is passed to each numberLines
 * @property {boolean} [includeRightTip=false] whether to display right tip. It will
 *   remove right-most tick. This is passed to each numberLines
 */
export const AxesConfigs = {
	xAxis: {
		axisLabel: "x",
	},
	yAxis: {
		axisLabel: "y",
		rotation: Math.PI / 2,
		textRotation: -Math.PI / 2,
		labelDirection: [0, 0.8],
		textAlign: "right",
		axisLabelDirection: [0.3, 0.5],
		axisLabelSize: 20,
	},
	originPosition: ORIGIN,
	numbersToExclude: [0],
	includeTicks: true,
	includeLeftTip: false,
	includeRightTip: true,
};

/**
 * @typedef {Object} PolarPlaneConfigs
 * @property {number[]} [originPosition = ORIGIN] position of origin of plane
 * @property {number} [maxRadius = 4] maximum radius of the polar plane
 * @property {number} [size] diameter of the plane in pixels. Default it will try to fit in the canvas
 * @property {number} [radiusStep = 1] step size of radius
 * @property {string} [azimuthUnit = "degrees"]  azimuth unit:
 *  * "PI radians" or "TAU radians": 20
 *  * "degrees": 36
 *  * "gradians": 40
 * @property {number} [azimuthDivisions = 0]  The number of divisions in the azimuth
 *   (also known as the angular coordinate or polar angle). If None is
 *   specified then it will use the default specified by azimuthUnit
 * @property {Array.<*>} [radialLabels = []] Labels for the radial axis. If nothing
 *   is specified then the labels will be automatically generated using the radialStep.
 * @property {string} [azimuthDirection = "ccw"] direction of the azimuthal labels.
 *   This can be either 'ccw' or 'cw'

 * @property {Object} [radiusConfigs] radial axis configurations
 * @property {string} [radiusConfigs.strokeColor = "#fff"] stroke color of the radial axis
 * @property {string} [radiusConfigs.fontFamily = "serif"] font family of the radial axis labels
 * @property {string} [radiusConfigs.textAlign = "center"] text align of the radial axis labels
 * @property {string} [radiusConfigs.textBaseline = "middle"] text baseline of the radial axis labels
 * @property {number} [radiusConfigs.strokeWidth = 2] stroke width of the radial axis in pixels
 * @property {number} [radiusConfigs.fontSize = 22] font size of the radial axis in pixels
 * @property {number} [radiusConfigs.decimalPoints = 0] number of decimal points to showup in the radial axis labels
 * @property {Function} [radiusConfigs.textRenderer = fillText] function that renders text.
 *   You can use strokeText to get stroked text, or something else to get custom text
 * @property {number[]} [radiusConfigs.labelDirection = [-1.4, -1.2]] direction of the radial axis label.
 *   This will align labels correctly in the position.
 * @property {number[]} [radiusConfigs.labelAxis = [1, 0]] axis to labels
 * @property {boolean} [radiusConfigs.includeLabels = true] whether to draw radial labels or not

 * @property {Object} [azimuth] azimuth line configurations
 * @property {boolean} [azimuth.compactFraction = true] whether to show the azimuthal fraction as compact or not
 * @property {number} [azimuth.offset = 0] radial offset of the azimuthal labels
 * @property {number} [azimuth.labelBuff = 0.5] buffer between the outermost azimuthal circle and the azimuthal labels
 * @property {number} [azimuth.fontSize = 17] font size of the azimuthal labels
 * @property {number} [azimuth.strokeWidth = 1.5] stroke width of the azimuthal lines
 * @property {number} [azimuth.decimalPoints = 0] number of decimal points to show up in the azimuthal labels
 * @property {string} [azimuth.fontFamily = "serif"] font family of the azimuthal labels
 * @property {string} [azimuth.strokeColor = "#58c4dddd"] stroke color of the azimuthal labels
 * @property {Function} [azimuth.textRenderer = fillText] function that renders text.
 *   You can use strokeText to get stroked text, or something else to get custom text
 * @property {boolean} [azimuth.includeLabels = true] whether to draw azimuthal labels or not
  */
export const PolarPlaneConfigs = {
	originPosition: ORIGIN,
	maxRadius: 4.0,
	radiusStep: 1,
	azimuthUnit: "PI radians",
	azimuthDivisions: 0,
	azimuthCompactFraction: true,
	azimuthDirection: "ccw",
	azimuthoffset: 0,
	fadedLines: 1,
	radiusConfigs: {
		includeLabels: true,
		includeTicks: false,
		includeRightTip: false,
		strokeColor: "#fff",
		strokeWidth: 2,
		fontSize: 16,
		fontFamily: "serif",
		labelDirection: [0.4, -1],
		labelAxis: [1],
		numbersToExclude: [0],
	},
	azimuthConfigs: {
		includeLabels: true,
		labelBuff: 0.45,
		fontSize: 15,
		fontFamily: "serif",
		textAlign: "center",
		textBaseline: "middle",
		strokeColor: "#58c4ddaa",
		strokeWidth: 1.3,
		textRenderer: fillText,
		decimalPoints: 0,
		numbersToExclude: [0],
	},
	fadedLineConfigs: {
		strokeColor: "#8888",
		strokeWidth: 1,
	},
};

/**
 * @typedef {Object} PolarPlotters
 * @property {Function} plotPoints plots a list of Points {@link plotPolarPoints}
 * @property {Function} plotParametricFunction plots a parametric function {@link polarParametricFunction}
 * @property {Function} plotFunctionGraph plots a single valued function {@link polarFuntionGraph}
 * @property {Function} scaleCanvas scales canvas according to sizing of plane {@link polarFuntionGraph}
 */
export const PolarPlotters = {};
