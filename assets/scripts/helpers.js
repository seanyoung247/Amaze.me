/*
 * Useful generic functions.
 */
//Math:
//Returns just the fraction part of the floating point number passed.
Math.fraction = function (n) {
  return n - Math.floor(n);
}

Math.DegreesToRadian = function (degrees) {
  return (degrees * Math.PI / 180);
}

Math.RadianToDegrees = function (radians) {
  return (radians * 180 / Math.PI);
}
