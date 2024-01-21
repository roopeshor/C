import { C } from "../../main.js";
import { fontFamily, fontSize, restore, save } from "../../settings.js";
import { applyDefault, arange, fraction, texFraction } from "../../utils.js";
import { tex, tex2svgExists } from "../tex.js";
import { fillText } from "../text.js";

/**
 * @typedef {Object} PolarPlotters
 * @property {Function} plotPoints see {@link plotPolarPoints}
 * @property {Function} parametricFunction see {@link polarParametricFunction}
 * @property {Function} functionGraph see {@link polarFuntionGraph}
 */

/**
 * returns list of plotting functions based on given polar parameters
 *
 * @param {Object} configs
 * @return {PolarPlotters}
 */
function getPolarPlotters(configs) {
	return {
		plotPoints: function (cfg) {
			cfg.radialSpacing = cfg.radialSpacing || configs.radialSpacing;
			plotPolarPoints(cfg);
		},
		plotParametricFunction: function (cfg) {
			cfg.radialSpacing = cfg.radialSpacing || configs.radialSpacing;
			return polarParametricFunction(cfg);
		},
		plotFunctionGraph: function (cfg) {
			cfg.radialSpacing = cfg.radialSpacing || configs.radialSpacing;
			return polarFuntionGraph(cfg);
		},
	};
}

const ORIGIN = [0, 0];

/**
 * Creates a polar plane. change following configs to customize the plane
 * @param {Object} configs - configurations
 * @param {number[]} [configs.originPosition = ORIGIN] position of origin of plane
 * @param {number} [configs.maxRadius = 4] maximum radius of the polar plane
 * @param {number} [configs.size] diameter of the plane in pixels. Default it will try to fit in the canvas
 * @param {number} [configs.radiusStep = 1] step size of radius
 * @param {string} [configs.azimuthUnit = "degrees"]  azimuth unit:
 *  * "PI radians" or "TAU radians": 20
 *  * "degrees": 36
 *  * "gradians": 40
 * @param {number} [configs.azimuthDivisions = 0]  The number of divisions in the azimuth (also known as the angular coordinate or polar angle). If None is specified then it will use the default specified by azimuthUnit
 * @param {Array.<*>} [configs.radialLabels = []] Labels for the radial axis. If nothing is specified then the labels will be automatically generated using the radialStep.
 * @param {string} [configs.azimuthDirection = "ccw"] direction of the azimuthal labels. This can be either 'ccw' or 'cw'

 * @param {Object} [configs.radiusConfigs] radial axis configurations
 * @param {string} [configs.radiusConfigs.strokeColor = "#fff"] stroke color of the radial axis
 * @param {string} [configs.radiusConfigs.fontFamily = "serif"] font family of the radial axis labels
 * @param {string} [configs.radiusConfigs.textAlign = "center"] text align of the radial axis labels
 * @param {string} [configs.radiusConfigs.textBaseline = "middle"] text baseline of the radial axis labels
 * @param {number} [configs.radiusConfigs.strokeWidth = 2] stroke width of the radial axis in pixels
 * @param {number} [configs.radiusConfigs.fontSize = 22] font size of the radial axis in pixels
 * @param {number} [configs.radiusConfigs.decimalPoints = 0] number of decimal points to show up in the radial axis labels
 * @param {Function} [configs.radiusConfigs.textRenderer = fillText] function that renders text. you can use strokeText to get stroked text, or something else to get custom text
 * @param {number[]} [configs.radiusConfigs.textDirection = [-1.4, -1.2]] direction of the radial axis label. This'll align labels correctly in the position.
 * @param {number[]} [configs.radiusConfigs.labelAxis = [1, 0]] axis to labels
 * @param {boolean} [configs.radiusConfigs.includeLabels = true] whether to draw radial labels or not

 * @param {Object} [configs.azimuth] azimuth line configurations
 * @param {boolean} [configs.azimuth.compactFraction = true] whether to show the azimuthal fraction as compact or not
 * @param {number} [configs.azimuth.offset = 0] radial offset of the azimuthal labels
 * @param {number} [configs.azimuth.labelBuff = 0.5] buffer between the outermost azimuthal circle and the azimuthal labels
 * @param {number} [configs.azimuth.fontSize = 17] font size of the azimuthal labels
 * @param {number} [configs.azimuth.strokeWidth = 1.5] stroke width of the azimuthal lines
 * @param {number} [configs.azimuth.decimalPoints = 0] number of decimal points to show up in the azimuthal labels
 * @param {string} [configs.azimuth.fontFamily = "serif"] font family of the azimuthal labels
 * @param {string} [configs.azimuth.strokeColor = "#58c4dddd"] stroke color of the azimuthal labels
 * @param {Function} [configs.azimuth.textRenderer = fillText] function that renders text. you can use strokeText to get stroked text, or something else to get custom text
 * @param {boolean} [configs.azimuth.includeLabels = true] whether to draw azimuthal labels or not
 *
 * @returns {PolarPlotters}
 */
export function polarPlane(configs = {}) {
	let ctx = C.workingContext,
		cvs = C.workingCanvas,
		azimuthUnitsDict = {
			"pi radians": 20,
			"tau radians": 20,
			degrees: 24,
			gradians: 20,
		};
	configs = applyDefault(
		{
			originPosition: ORIGIN,
			maxRadius: 4.0,
			size: Math.min(parseInt(cvs.style.width), parseInt(cvs.style.height)) * 0.8,
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
				textDirection: [0.5, -0.3],
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
		},
		configs,
	);
	let {
		originPosition,
		maxRadius,
		size,
		radiusStep,
		azimuthUnit,
		azimuthDivisions,
		azimuthCompactFraction,
		azimuthDirection,
		radiusConfigs,
		azimuthConfigs,
		fadedLines,
		fadedLineConfigs,
		azimuthoffset,
	} = configs;
	azimuthUnit = azimuthUnit.toLowerCase().trim();
	if (azimuthUnit == "pi") azimuthUnit = "pi radian";
	else if (azimuthUnit == "tau") azimuthUnit = "tau radian";

	// error catching
	if (azimuthUnitsDict[azimuthUnit] != undefined) {
		azimuthUnit = azimuthUnit;
	} else {
		throw new Error(
			"Invalid azimuth units. Expected one of: PI radians, TAU radians, degrees, gradians.",
		);
	}

	if (azimuthDivisions == 0) {
		azimuthDivisions = azimuthUnitsDict[azimuthUnit] || 20;
	}

	save();
	ctx.translate(originPosition[0], originPosition[1]);
	let tickList = arange(0, maxRadius, radiusStep),
		radialSpacing = size / maxRadius / 2;
	azimuthConfigs.strokeWidth /= radialSpacing;
	fadedLineConfigs.strokeWidth /= radialSpacing;
	azimuthConfigs.fontSize /= radialSpacing;
	let /** @type {Array} */
		labels = Array.isArray(radiusConfigs.labelsToInclude)
			? radiusConfigs.labelsToInclude
			: tickList,
		xLabels = [],
		yLabels = [];
	// find labels for each wings of axis
	if (radiusConfigs.labelAxis.includes(3)) {
		// add left wing of x-axis
		xLabels.push(...labels.reverse());
	} else {
		xLabels = new Array(maxRadius).fill("");
	}

	if (radiusConfigs.labelAxis.includes(1)) {
		// add right wing of x-axis
		xLabels.push(...labels);
	} else {
		xLabels.push(...new Array(maxRadius).fill(""));
	}

	if (radiusConfigs.labelAxis.includes(2)) {
		// add top wing of y-axis
		yLabels.push(...labels.reverse());
	} else {
		yLabels.push(...new Array(maxRadius).fill(""));
	}

	if (radiusConfigs.labelAxis.includes(4)) {
		// add bottom wing of y-axis
		yLabels.push(...labels);
	} else {
		yLabels.push(...new Array(maxRadius).fill(""));
	}

	radiusConfigs.range = [-maxRadius, maxRadius, radiusStep];
	radiusConfigs.length = size;

	let xAxisCfgs = applyDefault(radiusConfigs, {
			labelsToInclude: xLabels,
		}),
		yAxisCfgs = applyDefault(radiusConfigs, {
			labelsToInclude: yLabels,
		});
	ctx.scale(radialSpacing, radialSpacing);
	drawAzimuthalLines();
	restore();
	axes({
		xAxis: xAxisCfgs,
		yAxis: yAxisCfgs,
	});

	function drawAzimuthalLines() {
		fadedLines++;

		// draw azimuthal divisions
		let labels = [];
		fontSize(azimuthConfigs.fontSize);
		fontFamily(azimuthConfigs.fontFamily);
		ctx.textAlign = azimuthConfigs.textAlign;
		ctx.textBaseline = azimuthConfigs.textBaseline;

		// generate labels
		if (azimuthUnit == "pi radians" || azimuthUnit == "tau radians") {
			let numerator = 1,
				denominator = azimuthDivisions,
				generator,
				post;

			if (tex2svgExists()) {
				azimuthConfigs.textRenderer = tex;
				post = azimuthUnit == "tau radians" ? "\\tau" : "\\pi";
				fontSize(azimuthConfigs.fontSize * radialSpacing);
				generator = texFraction;
			} else {
				console.warn("MathJax not found, using fillText instead");
				post = azimuthUnit == "pi radians" ? "π" : "τ";
				generator = fraction;
			}
			for (let division = 0; division < azimuthDivisions; division++) {
				labels.push(
					generator(
						numerator * division,
						denominator,
						true,
						azimuthCompactFraction,
						post,
					),
				);
			}
		} else if (azimuthUnit == "degrees") {
			// Use Tex parser to generate fractions
			for (let i = 0; i < azimuthDivisions; i++) {
				labels.push(
					((i * 360) / azimuthDivisions).toFixed(azimuthConfigs.decimalPoints) + "°",
				);
			}
		} else if (azimuthUnit == "gradians") {
			for (let i = 0; i < azimuthDivisions; i++) {
				labels.push(
					((i * 400) / azimuthDivisions).toFixed(azimuthConfigs.decimalPoints) + "ᵍ",
				);
			}
		}

		let angleIncrementor = (Math.PI * 2) / azimuthDivisions,
			angle = 0;
		if (azimuthDirection.toLowerCase() == "cw") angleIncrementor *= -1;
		let scalar = 1;
		if (azimuthUnit == "pi radians" || azimuthUnit == "tau radians") {
			scalar = radialSpacing;
		}

		// draw radiating circles

		ctx.doFill = false;
		ctx.doStroke = true;
		if (fadedLines > 1) {
			// draw faded ones
			ctx.strokeStyle = fadedLineConfigs.strokeColor;
			ctx.lineWidth = fadedLineConfigs.strokeWidth;
			let step = 1 / fadedLines;
			let max = (tickList.length - 1) * fadedLines;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			for (let i = 0; i < max; i++) {
				ctx.arc(0, 0, i * step, 0, Math.PI * 2);
			}

			max = azimuthDivisions / step / step;
			ctx.lineWidth = fadedLineConfigs.strokeWidth;
			for (let i = 0; i < max; i++) {
				let angle = i * angleIncrementor * step;
				ctx.moveTo(0, 0);
				ctx.lineTo(
					Math.cos(angle + azimuthoffset) * maxRadius,
					Math.sin(angle + azimuthoffset) * maxRadius,
				);
			}
			ctx.stroke();
		}

		// and majors
		ctx.beginPath();
		ctx.strokeStyle = azimuthConfigs.strokeColor;
		ctx.lineWidth = azimuthConfigs.strokeWidth;
		ctx.moveTo(0, 0);
		for (let i = 0; i < tickList.length; i++) {
			ctx.arc(0, 0, i, 0, Math.PI * 2);
		}
		for (let i = 0; i < azimuthDivisions; i++) {
			let angle = i * angleIncrementor + azimuthoffset;
			if (angle % (Math.PI / 2) != 0) {
				// avoid axes
				ctx.moveTo(0, 0);
				ctx.lineTo(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius);
			}
		}
		ctx.stroke();

		// draw azimuthal labels
		if (azimuthConfigs.includeLabels) {
			for (let i = 0; i < azimuthDivisions; i++) {
				angle = i * angleIncrementor + azimuthoffset;
				if (!azimuthConfigs.numbersToExclude.includes(angle)) {
					azimuthConfigs.textRenderer(
						labels[i],
						Math.cos(angle) * (maxRadius + azimuthConfigs.labelBuff),
						Math.sin(angle) * (maxRadius + azimuthConfigs.labelBuff),
					);
				}
			}
		}
	}
	return getPolarPlotters({
		azimuthAnglularSpace: (2 * Math.PI) / azimuthDivisions,
		radialSpacing: radialSpacing,
	});
}
