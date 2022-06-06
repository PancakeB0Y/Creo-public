function getDistance(x1, y1, x2, y2){
    let distX = x2 - x1;
    let distY = y2 - y1;
    return Math.sqrt(distX*distX + distY*distY);
}
exports.getDistance = getDistance;

function updateObj(obj1, obj2){
    //this function makes the values of obj1 equal to the values of onj2
    for (const [key, value] of Object.entries(obj2)) {
        obj1[key] = value;
    }
}
exports.updateObj = updateObj;

function updateObjByListOfKeys(structure, obj, listOfKeys){
  //this function makes the values of obj1 equal to the values of onj2
  console.log("on function enter: ", );
  for (let key of listOfKeys) {
    if(obj[key] != undefined){
      structure[key] = obj[key];
    }
  }
}
exports.updateObjByListOfKeys = updateObjByListOfKeys;

function objSize(obj) {
    let size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}
exports.objSize = objSize;

function areSqrColliding(x1, y1, size1, x2, y2, size2){ //this function checks if two squares are colliding
  return (x1 > x2-size1 && x1 < x2+size2 && y1 > y2-size1 && y1 < y2+size2);
}
exports.areSqrColliding = areSqrColliding;

function getSign (p1, p2, p3){
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}
exports.getSign = getSign;

function isPointInTriangle (pt, v1, v2, v3){
    let d1, d2, d3;
    let has_neg, has_pos;

    d1 = getSign(pt, v1, v2);
    d2 = getSign(pt, v2, v3);
    d3 = getSign(pt, v3, v1);

    has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(has_neg && has_pos);
}
exports.isPointInTriangle = isPointInTriangle;