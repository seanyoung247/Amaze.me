/*jshint esversion: 6 */

/*
 * Useful generic functions.
 */
//Math:
//Returns just the fraction part of the floating point number passed.
Math.fraction = function (n) {
  return n - Math.floor(n);
};

Math.DegreesToRadian = function (degrees) {
  return (degrees * Math.PI / 180);
};

Math.RadianToDegrees = function (radians) {
  return (radians * 180 / Math.PI);
};

/*
 * Array randomiser.
 * Based on the Fisher-Yates shuffle:
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
function shuffle(array) {
  let count = array.length;
  let random = 0;
  let temp;

  while (count != 0) {
    random = Math.floor(Math.random() * count);
    count--;

    temp = array[count];
    array[count] = array[random];
    array[random] = temp;
  }
  return array;
}
