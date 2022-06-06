//get the structures
let structures = require("./structures.js");

//get the database comunication functions
let dbFunctions = require("./databaseFunctions.js");

//get additional functions
let additionalFunctions = require("../client/additionalFunctions_Variables.js");

//get additional functions
let objects = require("./objects.js");

//get units functions and variables
let units = require("./units.js");

function updateHeight(map_, x_, y_, r_, changeIndex_, isSmooth_){
    for(let key in map_.idToUnit) {
        let unit = map_.idToUnit[key];
        if(units.updateHeight(unit, x_-unit.x, y_-unit.y, r_, changeIndex_, isSmooth_)){
            map_.changeUnit(key, {});
        }
    }

    for(let key in map_.idToObj){
        let theObject = map_.idToObj[key];

        if(additionalFunctions.getDistance(x_, y_, theObject.x, theObject.y) <= r_){
            objects.editZ(map_, theObject);
            map_.changeObject(key, {});
        }
    }
}
exports.updateHeight = updateHeight;

function updateTexture(map_, x_, y_, r_, newTexture_){
    for(let key in map_.idToUnit) {
        let unit = map_.idToUnit[key];
        
        if(units.updateTexture(unit, x_-unit.x, y_-unit.y, r_, newTexture_)){
            map_.changeUnit(key, {});
        }
    }
}
exports.updateTexture = updateTexture;

function levelHeight(map_, x_, y_, r_, changeIndex_){
    let totalHeight = 0, brPoints = 0;
    for(let key in map_.idToUnit) {
        let unit = map_.idToUnit[key];

        let stats;
        stats = units.getHeightStats(unit, x_-unit.x, y_-unit.y, r_);
        totalHeight += stats.totalHeight;
        brPoints += stats.br;
    }

    let avgHeight = totalHeight/brPoints;

    for(let key in map_.idToUnit) {
        let unit = map_.idToUnit[key];

        if(units.levelArea(unit, x_-unit.x, y_-unit.y, r_, changeIndex_, avgHeight)){
            map_.changeUnit(key, {});
        }
    }

    for(let key in map_.idToObj){
        let theObject = map_.idToObj[key];

        if(additionalFunctions.getDistance(x_, y_, theObject.x, theObject.y) <= r_){
            objects.editZ(map_, theObject);
            map_.changeObject(key, {});
        }
    }
}
exports.levelHeight = levelHeight;