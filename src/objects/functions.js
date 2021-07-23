import { C } from "../main.js";
import { approximateIndexInArray, doFillAndStroke } from "../utils/utils.js";
import { smoothCurveThroughPointsTo } from "./geometry.js";

const DEFAULT_DT = 0.001;

/**
 * Draws a parametric functions
 *
 * @param {function} fx function to plot. Must recieve one argument and return a array of point as [x, y]
 * @param {array} [range=[0, 10, 0.1]] range as [min, max, dt]
 * @param {boolean} [smoothen=true] whether to smoothen the shape.
 * @param {number} [tension=1] smoothness tension.
 * @param {array} [discontinuities=[]] array of t where the curve discontinues.
 * @param {number} [epsilon=dt] differece between actual computed value and discontinuities.
 * @param {boolean} [closed=false] whether the function draws a closed shape.
 */
function parametricFunction(
	fx,
	range = [0, 10, 0.1],
	smoothen = true,
	tension = 1,
	discontinuities = [],
	epsilon,
	closed = false
) {
	if (Array.isArray(range) && range.length == 2) range.push(DEFAULT_DT);
	var points = [[]];

	if (!Array.isArray(discontinuities)) discontinuities = [];
	if (isNaN(epsilon)) epsilon = range[2];
	var row = 0;

	// generate points
	var adjust = 1e-12; //? should this be 1e-6 ?
	for (var t = range[0]; t <= range[1] + adjust; t += range[2]) {
		if (approximateIndexInArray(t, discontinuities, epsilon) > -1) {
			if (approximateIndexInArray(t + range[2], discontinuities, epsilon) > -1) {
				row++;
				points.push([]);
			}
			continue;
		}
		points[row].push(fx(t));
	}
	// draw connections
	const ctx = C.workingCanvas;
	for (let i = 0; i < points.length; i++) {
		ctx.beginPath();
		var p = points[i];
		ctx.moveTo(p[0][0], p[0][1]);
		if (smoothen) {
			smoothCurveThroughPointsTo(p, tension, closed);
		}	else {
			for (let j = 1; j < p.length; j++) {
				ctx.lineTo(p[j][0], p[j][1]);
			}
		}
		doFillAndStroke(ctx);
		ctx.closePath();
	}
	return points;
}

export { parametricFunction };
