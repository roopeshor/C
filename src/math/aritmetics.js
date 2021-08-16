/**
 * Computes GCD (Greatest Common Divisor) or HCF (Highest Common Factor) of two numbers
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
function gcd(a, b) {
	while (b != 0) {
		let ra = b;
		b = a % b;
		a = ra;
	}
	return a;
}

/**
 * Returns greatest common divisor of a list of integers.
 *
 * @return {number}
 */
function gcdArray() {
	let n = 0;
	for (let i = 0; i < arguments.length; ++i) n = gcd(arguments[i], n);
	return n;
}

/**
 * Computes LCM (Least Common Multiple) of two numbers
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
function lcm(a, b) {
	return (a * b) / gcd(a, b);
}

/**
 * Returns least common multiple of a list of integers.
 *
 * @return {number}
 */
function lcmArray() {
	let n = 1;
	for (let i = 0; i < arguments.length; ++i) n = lcm(arguments[i], n);
	return n;
}

export { gcd, gcdArray, lcm, lcmArray };
