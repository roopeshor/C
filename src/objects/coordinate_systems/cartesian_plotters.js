import { scale } from "../../settings.js";
import { functionGraph, heatPlot, parametricFunction, plotPoints } from "../functions.js";
import { CartesianPlotters } from "./types.js";

/**
 * returns list of plotting functions based on given cartesian parameters
 *
 * @param {Object} configs
 * @return {CartesianPlotters}
 */
export function getCartasianFunctions(configs) {
	return Object.assign(configs, {
		plotParametricFunction: function (cfg) {
			cfg.unitSpace = configs.unitSpace;
			cfg.unitValue = configs.unitValue;
			return parametricFunction(cfg);
		},
		plotFunctionGraph: function (cfg) {
			cfg.unitSpace = configs.unitSpace;
			cfg.unitValue = configs.unitValue;
			return functionGraph(cfg);
		},
		plotHeatPlot: function (cfg) {
			cfg.unitSpace = configs.unitSpace;
			console.log(cfg.unitSpace);
			cfg.min = configs.min || [configs.xAxis.range[0], configs.yAxis.range[0]];
			cfg.max = configs.max || [configs.xAxis.range[1], configs.yAxis.range[1]];
			return heatPlot(cfg);
		},
		plotPoints: function (cfg) {
			cfg.unitValue = configs.unitValue;
			cfg.unitSpace = configs.unitSpace;
			return plotPoints(cfg);
		},
		scaleCanvas: function () {
			let unitSizeX = configs.unitSpace[0] / configs.unitValue[0];
			let unitSizeY = configs.unitSpace[1] / configs.unitValue[1];
			scale(unitSizeX, unitSizeY);
		},
	});
}
