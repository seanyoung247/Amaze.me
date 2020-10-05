/**
 * Models a point in 2D space
 */
function Point2(x,y) {
  this.x = x;
  this.y = y;
}

/**
 * Models a 2D Vector
 */
function Vector2(x,y) {
  this.x = x;
  this.y = y;
}
//Calculates and returns the euclidean distance (length) of this Vector
Vector2.prototype.getMagnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector2.prototype.setMagnitude = function(magnitude) {
  //First reset the length of the vector to 1
  this.normalize();
  //Then multiply it by it's new magnitude
  this.x *= magnitude;
  this.y *= magnitude;
};
//Normaises this vector. A normalised vector is one with a magnitude of 1.
Vector2.prototype.normalize = function() {
  let mag = this.getMagnitude();
  this.x /= mag;
  this.y /= mag;
};
/**
 * These functions convert to and from angular vector notation in radians.
 */
Vector2.prototype.toRadian = function() {
  return Math.atan2(this.y, this.x);
};
Vector2.prototype.fromRadian = function(radians) {
  this.x = Math.cos(radians);
  this.y = Math.sin(radians);
};
/**
 * Rotates this vector by a given vector or angle
 */
Vector2.prototype.rotateByRadians = function(radians) {
  this.rotate(
    Math.cos(radians),
    Math.sin(radians)
  );
};
Vector2.prototype.rotateByVector = function(vector) {
  this.rotate(vector.x, vector.y);
};
Vector2.prototype.rotate = function(x, y) {
  let tX = this.x * x - this.y * y;
  let tY = this.x * y + this.y * x;
  this.x = tX;
  this.y = tY;
}

/*
 * Models a 2D rectangle.
 */
function BoundingBox(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

BoundingBox.prototype.copy = function (box) {
  this.x = box.x;
  this.y = box.y;
  this.width = box.width;
  this.height = box.height;
};

/*
 * Returns true if 2D point is within this box, otherwise false.
 */
BoundingBox.prototype.pointInBounds = function (point) {
  return this.inBounds(point.x, point.y);
};
BoundingBox.prototype.inBounds = function (x, y) {
  if (x >= this.x && y >= this.y
      && x <= (this.x + this.width)
      && y <= (this.y + this.height)) {
    return true;
  } else return false;
};
