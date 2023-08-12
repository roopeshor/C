/** @module Arithmetic-Functions*/
/**
 * Computes GCD (Greatest Common Divisor) or HCF (Highest Common Factor) of two numbers
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function gcd(a, b) {
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
 * @returns {number}
 */
export function gcdArray(list) {
	let array = Array.isArray(list) ? list : arguments,
		n = array[0];
	for (let i = 1; i < array.length; ++i) n = gcd(array[i], n);
	return n;
}

/**
 * Computes LCM (Least Common Multiple) of two numbers
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function lcm(a, b) {
	return (a * b) / gcd(a, b);
}

/**
 * Returns least common multiple of a list of integers given explictly or as array.
 * @returns {number}
 */
export function lcmArray(list) {
	let n = 1,
		array = Array.isArray(list) ? list : arguments;
	for (let i = 0; i < array.length; ++i) n = lcm(array[i], n);
	return n;
}
