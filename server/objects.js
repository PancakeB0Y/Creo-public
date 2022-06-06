//get the structures
let structures = require("./structures.js");

//get the database comunication functions
let dbFunctions = require("./databaseFunctions.js");

//get units functions and variables
let units = require("./units.js");

//get additional functions
let additionalFunctions = require("../client/additionalFunctions_Variables.js");

let aSize = 1;

function getZ(map_, objX_, objY_){
    let returnZ = null;
    let pointPerUnitM3 = units.pointsPerUnit - 3;
    for(let key in map_.idToUnit){
        let currUnit = map_.idToUnit[key];
        if(additionalFunctions.areSqrColliding(currUnit.x, currUnit.y, pointPerUnitM3, objX_-aSize/2, objY_-aSize/2, aSize)){
            let unitZ = currUnit.z;
            for(let j = 0; j < unitZ.length; j++){
                if(additionalFunctions.areSqrColliding(j%units.pointsPerUnit + currUnit.x - 1.5, Math.floor(j/units.pointsPerUnit) + currUnit.y - 1.5, 1, objX_-aSize/2, objY_-aSize/2, aSize)){
                    if(returnZ === null || returnZ > unitZ[j]){
                        returnZ = unitZ[j];
                    }
                }
            }
        }
    }

    return returnZ;
}
exports.getZ = getZ;


function editZ(map_, currObject_){
    if(currObject_ !== undefined){
        currObject_.z = getZ(map_, currObject_.x, currObject_.y);
    }
}
exports.editZ = editZ;

function newObj(map_, x_, y_, objectType_, rotation_, colorChange_, thisColorR_, thisColorG_, thisColorB_, thisSize_){
    let newObject = new structures.Object(0, objectType_);
    newObject.x = x_;
    newObject.y = y_;
    newObject.z = getZ(map_, x_, y_);
    newObject.type = objectType_;
    newObject.rotation = rotation_;
    newObject.colorChange = colorChange_;
    newObject.colorR = thisColorR_;
    newObject.colorG = thisColorG_;
    newObject.colorB = thisColorB_;
    newObject.scale = thisSize_;
    map_.addObject(newObject);

    // refPoint = {x: 0, y: 0, z: 0};
    // let newObjectCoordinates = {x: newObject.x, 
    //                             y: newObject.y,
    //                             z: newObject.z}

    // let currDistance = getDistance3D(newObjectCoordinates, refPoint);
    
    
}
exports.newObj = newObj;

function moveObj(map_, id_, x_, y_, rot){
    let change = {x: x_, y: y_, z: getZ(map_, x_, y_)};
    if(rot !== undefined) change.rotation = rot;
    map_.changeObject(id_, change);
}
exports.moveObj = moveObj;

function rotateObj(map_, id_, rot){
    let change = {rotation: rot};
    map_.changeObject(id_, change);
}
exports.rotateObj = rotateObj;

function remove(map_, objectId_){
    delete map_.objects[objectId_];

    return {units: [], objects: [objectId_]};
}
exports.remove = remove;