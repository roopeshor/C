// TODO: make this an extension
export function getLineParametricFunction(p1, p2, dx = 0.03) {
	const slope = (p2[1] - p1[1]) / (p2[0] - p1[0]);
	if (slope === Infinity) {
		return (t) => [p1[0] + t, p1[0]];
	}
	return {
		_function: (t) => [p1[0] + t, p1[1] + t * slope],
		range: [0, Math.abs(p2[0] - p1[0]), dx],
	};
}
