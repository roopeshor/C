const {
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
  tanh
} = Math;

/**
 * return distance between two points
 *
 * @param {array} p1
 * @param {array} p2
 * @return {number} distance between p1 and p2
 */
function dist(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}
function randomInt (max = 10, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}
function sigmoid(x) {
  return 1.0 / (1 + Math.exp(-x));
}

function limit(x, mi = 0, ma = 1) {
  return Math.min(Math.max(x, mi), ma);
}

export { abs, acos, asin, atan, atan2, cbrt, ceil, cos, cosh, exp, floor, log, log2, log10, max, min, pow, random, round, sgn, sin, sqrt, tan, tanh, dist, randomInt, sigmoid, limit };
