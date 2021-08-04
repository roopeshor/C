import { sigmoid } from "./simple_functions.js";

/**
 * Rate functions. From https://easings.net .
 * All Functions accept input from 0 to 1 and return output between 0 to 1
 */
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * Math.PI) / 3;
const c5 = (2 * Math.PI) / 4.5;

function easeOutBounce(t) {
	const n1 = 7.5625;
	const d1 = 2.75;

	if (t < 1 / d1) return n1 * t * t;
	else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
	else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
	else return n1 * (t -= 2.625 / d1) * t + 0.984375;
}
function linear(t) {
	return t;
}
function easeInQuad(t) {
	return t ** 2;
}
function easeOutQuad(t) {
	return 1 - (1 - t) ** 2;
}
function easeInOutQuad(t) {
	return t < 0.5 ? 2 * t ** 2 : 1 - Math.pow(2 - 2 * t, 2) / 2;
}
function easeInCubic(t) {
	return t ** 3;
}
function easeOutCubic(t) {
	return 1 - (1 - t) ** 3;
}
function easeInOutCubic(t) {
	return t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(2 - 2 * t, 3) / 2;
}
function easeInQuart(t) {
	return t ** 4;
}
function easeOutQuart(t) {
	return 1 - (1 - t) ** 4;
}
function easeInOutQuart(t) {
	return t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(2 - 2 * t, 4) / 2;
}
function easeInQuint(t) {
	return t ** 5;
}
function easeOutQuint(t) {
	return 1 - (1 - t) ** 5;
}
function easeInOutQuint(t) {
	return t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(2 - 2 * t, 5) / 2;
}
function easeInSine(t) {
	return 1 - Math.cos((t * Math.PI) / 2);
}
function easeOutSine(t) {
	return Math.sin((t * Math.PI) / 2);
}
function easeInOutSine(t) {
	return -(Math.cos(Math.PI * t) - 1) / 2;
}
function easeInExpo(t) {
	return t == 0 ? 0 : Math.pow(2, 10 * t - 10);
}
function easeOutExpo(t) {
	return t == 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function easeInOutExpo(t) {
	if (t == 0) return 0;
	else if (t == 1) return 1;
	else if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
	else return (2 - Math.pow(2, 10 - 20 * t)) / 2;
}
function easeInCirc(t) {
	return 1 - Math.sqrt(1 - t ** 2);
}
function easeOutCirc(t) {
	return Math.sqrt(1 - (t - 1) ** 2);
}
function easeInOutCirc(t) {
	if (t < 0.5) return (1 - Math.sqrt(1 - (2 * t) ** 2)) / 2;
	else return (Math.sqrt(1 - (2 - 2 * t) ** 2) + 1) / 2;
}
function easeInBack(t) {
	return c3 * t ** 3 - c1 * t ** 2;
}
function easeOutBack(t) {
	return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}
function easeInOutBack(t) {
	if (t < 0.5) return ((2 * t) ** 2 * ((c2 + 1) * 2 * t - c2)) / 2;
	else return ((2 * t - 2) ** 2 * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
}
function easeInElastic(t) {
	if (t === 0) return 0;
	else if (t === 1) return 1;
	else return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
}
function easeOutElastic(t) {
	if (t === 0) return 0;
	else if (t === 1) return 1;
	else return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}
function easeInOutElastic(t) {
	if (t == 0) return 0;
	else if (t == 1) return 1;
	else if (t < 0.5)
		return -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2;
	else
		return (
			(Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1
		);
}
function easeInBounce(t) {
	return 1 - easeOutBounce(1 - t);
}
function easeInOutBounce(t) {
	if (t < 0.5) return (1 - easeOutBounce(1 - 2 * t)) / 2;
	else return (1 + easeOutBounce(2 * t - 1)) / 2;
}

// manim rate funcitons
function smooth(t, inflection = 10.0) {
	let error = sigmoid(-inflection / 2);
	return Math.min(
		Math.max((sigmoid(inflection * (t - 0.5)) - error) / (1 - 2 * error), 0),
		1
	);
}
function rushInto(t, inflection = 10.0) {
	return 2 * smooth(t / 2.0, inflection);
}
function rushFrom(t, inflection = 10.0) {
	return 2 * smooth(t / 2.0 + 0.5, inflection) - 1;
}
function slowInto(t) {
	return Math.sqrt(1 - (1 - t) * (1 - t));
}
function doubleSmooth(t) {
	if (t < 0.5) return 0.5 * smooth(2 * t);
	else return 0.5 * (1 + smooth(2 * t - 1));
}
function thereAndBack(t, inflection = 10.0) {
	return smooth(t < 0.5 ? 2 * t : 2 * (1 - t), inflection);
}
function thereAndBackWithPause(t, pauseRatio = 1.0 / 3) {
	let a = 1.0 / pauseRatio;
	if (t < 0.5 - pauseRatio / 2) return smooth(a * t);
	else if (t < 0.5 + pauseRatio / 2) return 1;
	else return smooth(a - a * t);
}
function notQuiteThere(func = smooth, proportion = 0.7) {
	return (t) => proportion * func(t);
}
function wiggle(t, wiggles = 2) {
	return thereAndBack(t) * Math.sin(wiggles * Math.PI * t);
}
function squishRateFunc(func, a = 0.4, b = 0.6) {
	return function result(t) {
		if (a == b) return a;
		if (t < a) return func(0);
		else if (t > b) return func(1);
		else return func((t - a) / (b - a));
	};
}
function lingering(t) {
	return squishRateFunc((t) => t, 0, 0.8)(t);
}
function exponentialDecay(t, halfLife = 0.1) {
	return 1 - Math.exp(-t / halfLife);
}

// function runningStart(t, pullFactor = -0.5) {
// 	return bezier([0, 0, pullFactor, pullFactor, 1, 1, 1])(t);
// }

export {
	easeOutBounce,
	linear,
	easeInQuad,
	easeOutQuad,
	easeInOutQuad,
	easeInCubic,
	easeOutCubic,
	easeInOutCubic,
	easeInQuart,
	easeOutQuart,
	easeInOutQuart,
	easeInQuint,
	easeOutQuint,
	easeInOutQuint,
	easeInSine,
	easeOutSine,
	easeInOutSine,
	easeInExpo,
	easeOutExpo,
	easeInOutExpo,
	easeInCirc,
	easeOutCirc,
	easeInOutCirc,
	easeInBack,
	easeOutBack,
	easeInOutBack,
	easeInElastic,
	easeOutElastic,
	easeInOutElastic,
	easeInBounce,
	easeInOutBounce,
	smooth,
	rushInto,
	rushFrom,
	slowInto,
	doubleSmooth,
	thereAndBack,
	thereAndBackWithPause,
	notQuiteThere,
	wiggle,
	squishRateFunc,
	lingering,
	exponentialDecay,
};
