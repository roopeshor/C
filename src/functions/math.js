const abs = Math.abs,
  acos = Math.acos,
  asin = Math.asin,
  atan = Math.atan,
  atan2 = Math.atan2,
  cbrt = Math.cbrt,
  ceil = Math.ceil,
  cos = Math.cos,
  cosh = Math.cosh,
  exp = Math.exp,
  floor = Math.floor,
  log = Math.log,
  log2 = Math.log2,
  log10 = Math.log10,
  max = Math.max,
  min = Math.min,
  pow = Math.pow,
  random = Math.random,
  round = Math.round,
  sgn = Math.sign,
  sin = Math.sin,
  sqrt = Math.sqrt,
  tan = Math.tan,
  tanh = Math.tanh;

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
