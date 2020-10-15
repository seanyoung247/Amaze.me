/*
 * Models a single in game object.
 */
function GameObject(map, template) {
  //Register this object on the map
  let spawn = map.addObject(this);
  //Is there space on this map for this object?
  if (spawn != null) {
    this.name = template.name;
    //Physical properties
    this.position = new Point2(spawn.position.x, spawn.position.y);
    this.scale = template.scale;        //Size in world units
    this.radius = template.radius;      //Footprint in world units
    this.blocking = template.blocking;  //Can the player pass through this object?
    //Sprite properties
    this.sprite = new Image();
    this.sprite.src = imagePath + template.texture;
    this.icon = new Image();
    this.icon.src = imagePath + template.icon;
  }
}
