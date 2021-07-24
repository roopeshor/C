/**
 * Rate functions. From https://easings.net
 * all Functions accept input from 0 to 1 and return output between 0 to 1
 */
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * Math.PI) / 3;
const c5 = (2 * Math.PI) / 4.5;

function easeOutBounce(x) {
	const n1 = 7.5625;
	const d1 = 2.75;

	if (x < 1 / d1) {
		return n1 * x * x;
	} else if (x < 2 / d1) {
		return n1 * (x -= 1.5 / d1) * x + 0.75;
	} else if (x < 2.5 / d1) {
		return n1 * (x -= 2.25 / d1) * x + 0.9375;
	} else {
		return n1 * (x -= 2.625 / d1) * x + 0.984375;
	}
}

function linear(x) {
	return x;
}
function easeInQuad(x) {
	return x ** 2;
}

function easeOutQuad(x) {
	return 1 - (1 - x) * (1 - x);
}

function easeInOutQuad(x) {
	return x < 0.5 ? 2 * x ** 2 : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function easeInCubic(x) {
	return x ** 3;
}

function easeOutCubic(x) {
	return 1 - (1 - x) ** 3;
}

function easeInOutCubic(x) {
	return x < 0.5 ? 4 * x ** 3 : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeInQuart(x) {
	return x ** 4;
}

function easeOutQuart(x) {
	return 1 - Math.pow(1 - x, 4);
}

function easeInOutQuart(x) {
	return x < 0.5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function easeInQuint(x) {
	return x ** 5;
}

function easeOutQuint(x) {
	return 1 - (1 - x) ** 5;
}

function easeInOutQuint(x) {
	return x < 0.5 ? 16 * x ** 5 : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

function easeInSine(x) {
	return 1 - Math.cos((x * Math.PI) / 2);
}

function easeOutSine(x) {
	return Math.sin((x * Math.PI) / 2);
}

function easeInOutSine(x) {
	return -(Math.cos(Math.PI * x) - 1) / 2;
}

function easeInExpo(x) {
	return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

function easeOutExpo(x) {
	return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function easeInOutExpo(x) {
	return x === 0
		? 0
		: x === 1
		? 1
		: x < 0.5
		? Math.pow(2, 20 * x - 10) / 2
		: (2 - Math.pow(2, -20 * x + 10)) / 2;
}

function easeInCirc(x) {
	return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

function easeOutCirc(x) {
	return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function easeInOutCirc(x) {
	return x < 0.5
		? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
		: (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}

function easeInBack(x) {
	return c3 * x ** 3 - c1 * x ** 2;
}

function easeOutBack(x) {
	return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
}

function easeInOutBack(x) {
	return x < 0.5
		? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
		: (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

function easeInElastic(x) {
	return x === 0
		? 0
		: x === 1
		? 1
		: -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
}

function easeOutElastic(x) {
	return x === 0
		? 0
		: x === 1
		? 1
		: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function easeInOutElastic(x) {
	return x === 0
		? 0
		: x === 1
		? 1
		: x < 0.5
		? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
		: (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}

function easeInBounce(x) {
	return 1 - easeOutBounce(1 - x);
}

function easeInOutBounce(x) {
	return x < 0.5
		? (1 - easeOutBounce(1 - 2 * x)) / 2
		: (1 + easeOutBounce(2 * x - 1)) / 2;
}
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
};
