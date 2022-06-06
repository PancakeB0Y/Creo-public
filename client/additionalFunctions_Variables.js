function getDistance(x1, y1, x2, y2){
  //returns the distance between two points (2D space)
  let distX = x2 - x1;
  let distY = y2 - y1;
  return Math.sqrt(distX*distX + distY*distY);
}
exports.getDistance = getDistance;

function getDistance3D(p1, p2){
  //p1 and p2 are objects with this structure: {x: , y: , z: }
  //returns the distance between two points (3D space)
  let distX = p2.x - p1.x;
  let distY = p2.y - p1.y;
  let distZ = p2.z - p1.z;
  return Math.sqrt(distX*distX + distY*distY + distZ*distZ);
}
exports.getDistance3D = getDistance3D;

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

function updateObj(obj1, obj2){
  //this function makes the values of obj1 equal to the values of onj2
  for (let key in obj2) {
      obj1[key] = obj2[key];
  }
}
exports.updateObj = updateObj;

function objSize(obj) {
    //returns how many properties an object has
    let size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}
exports.objSize = objSize;

function areSqrColliding(x1, y1, size1, x2, y2, size2){
  //this function checks if two squares are colliding
  return (x1 > x2-size1 && x1 < x2+size2 && y1 > y2-size1 && y1 < y2+size2);
}
exports.areSqrColliding = areSqrColliding;

function getSign (p1, p2, p3){
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}
exports.getSign = getSign;

function isPointInTriangle (pt, v1, v2, v3){
    //checks if point is in triangle - returns true if so and false otherwise
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

function generateLink(link, mapId, objectId){
  //returns a link to a map with/without an object to be attached to
  link += "?mapId=" + mapId;
  if(objectId && objectId != -1){
    link += "&objId=" + objectId;
  }
  return link;
}
exports.generateLink = generateLink;

function arrayAvg(array){
  //returns the average value of an array

  array = array.flat();

  let count = 0, total = 0;
  array.forEach(function(item, index){
    total += item;
    count++;
  });

  return parseFloat((total/count).toFixed(2));  
}
exports.arrayAvg = arrayAvg;

function gradToRad(grad){
    return grad * Math.PI/180;
}
exports.gradToRad = gradToRad;

function radToGrad(rad){
  return rad * 180/Math.PI;
}
exports.radToGrad = radToGrad;

function returnOnlyNumbersFromString(theString){
  let res;
  if(theString){
    res = theString.replace(/\D/g, "");
  }
  return parseInt(res);
}
exports.returnOnlyNumbersFromString = returnOnlyNumbersFromString;

function doesStringContainOnlyDigits(theString){
  return /^\d+$/.test(theString);
}
exports.doesStringContainOnlyDigits = doesStringContainOnlyDigits;

function checkVariable(variable){
  if(variable.name == undefined || variable.type == undefined || variable.value == undefined){
    return false;
  }

  if(variable.type != typeof variable.value){
    return false;
  }

  return true;
}
exports.checkVariable = checkVariable;

function returnRandomString(returnLenght) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < returnLenght; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
exports.returnRandomString = returnRandomString;

function isStringNumber(string){
  return /^\d+$/.test(string);
}
exports.isStringNumber = isStringNumber;