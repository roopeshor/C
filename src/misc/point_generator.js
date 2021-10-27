/**
 * Returns a array of points that are evenly distributed along a circle.
 * @param {number} x x-coordinate of center of circle
 * @param {number} y y-coordinate of center of circle
 * @param {number} radius radius of circle
 * @param {number} startAngle start angle of circle
 * @param {number} endAngle end angle of circle
 * @param {number} dA angle between points
 * @param {boolean} clockwise if true returns points in clock wise direction
 * @returns {Array<Array<number>>} array of points
 */
function generatePointsInArc(
	x,
	y,
	radius,
	startAngle = 0,
	endAngle = Math.PI / 2,
	dA = 0.01,
	clockwise = false
) {
	let points = [];
	dA = Math.abs(dA || (endAngle - startAngle) / 10);
	if (startAngle > endAngle) {
		for (let t = startAngle; (t % Math.PI) * 2 >= endAngle + 1e-7; t += dA) {
			points.push([Math.cos(t) * radius + x, Math.sin(t) * radius + y]);
		}
	} else {
		for (let t = startAngle; t <= endAngle + 1e-7; t += dA) {
			points.push([Math.cos(t) * radius + x, Math.sin(t) * radius + y]);
		}
	}
	return clockwise ? points.reverse() : points;
}

export { generatePointsInArc };
