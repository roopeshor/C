import { C } from "../../main.js";
import { applyDefault } from "../../utils.js";
import { getCartasianFunctions } from "./cartesian_plotters.js";
import { numberLine } from "./number_line.js";
import { AxesConfigs } from "./types.js";

/**
 * Creates a axes.
 * @param {AxesConfigs} configs
 * @returns {CartesianPlotters}
 */
export function axes(configs = {}) {
	const ctx = C.workingContext;
	// configurations
	configs = applyDefault(AxesConfigs, configs);
	ctx.save();
	assignCommonPropsToAxis(configs);

	// draws number lines
	const xAxisLine = numberLine(configs.xAxis); // draw x axis
	const yAxisLine = numberLine(configs.yAxis); // draw y axis

	ctx.restore();
	return getCartasianFunctions({
		originPosition: configs.originPosition, // originPosition of axis as [x, y] in px
		xAxis: xAxisLine, // x axis confiurations from numberLine
		yAxis: yAxisLine, // y axis confiurations from numberLine
		unitSpace: [xAxisLine.unitSpace, yAxisLine.unitSpace], // space between two ticks in pixels
		unitValue: [xAxisLine.unitValue, yAxisLine.unitValue], // value between two close ticks
	});
}

/**
 * Assigns common configs to individual axis if they're not already defined, from call point
 * @param {Object} configs
 */
function assignCommonPropsToAxis(configs) {
	for (let prop of Object.keys(configs)) {
		if (prop != "xAxis" || prop != "yAxis") {
			if (configs.xAxis[prop] === undefined) {
				configs.xAxis[prop] = configs[prop];
			}
			if (configs.yAxis[prop] === undefined) {
				configs.yAxis[prop] = configs[prop];
			}
		}
	}
}
