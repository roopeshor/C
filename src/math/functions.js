export const {
	abs,
	acos,
	asin,
	atan,
	atan2,
	cbrt,
	ceil,
	cos,
	cosh,
	exp,
	floor,
	log,
	log2,
	log10,
	max,
	min,
	pow,
	random,
	round,
	sign: sgn,
	sin,
	sqrt,
	tan,
	tanh,
} = Math;

export function sigmoid(t) {
	return 1.0 / (1 + Math.exp(-t));
}
