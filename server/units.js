//get the structures
let structures = require("./structures.js");

//get the database comunication functions
let dbFunctions = require("./databaseFunctions.js");

//get additional functions
let additionalFunctions = require("../client/additionalFunctions_Variables.js");

//get additional functions
let objects = require("./objects.js");

const idToUnitInfo = {}; //this object links unit infos ot ids
exports.idToUnitInfo = idToUnitInfo;

const spaceBetweenPoints = 10; //the space between two points, who are next to each other in 2-dimentional space/looked from the top
exports.spaceBetweenPoints = spaceBetweenPoints;
const pointsPerUnit = 35; //the number of points per unit side (the amount of points that a unit is made of is pointsPerUnit^2)
exports.pointsPerUnit = pointsPerUnit;
const squaresPerTexture = 5; //the size of part of the texture a square of the mashe will be applyied to || (pointsPerUnit-2)%squaresPerTexture needs to be 0 so thet there is no clipping between units
exports.squaresPerTexture = squaresPerTexture;

function newUnit(map_, nearbyUnit_, position_){ //newrbyUnit is the unit next to the one we want to create || position is position compared to the nearbyUnit (1 - left, 2 - right, 3- top, 4 - bottom)
    let theUnit;

    if(nearbyUnit_ === undefined){
        if(Object.keys(map_.idToUnit).length == 0){
            map_.totalUnitIds = 1;
            theUnit = new structures.Unit(0, 0, 0);
        }
    }else{
        let pointsPerUnitM3 = pointsPerUnit - 3;

        let newX;
        let newY;

        if(position_ == 1){
            newX = nearbyUnit_.x - pointsPerUnitM3;
            newY = nearbyUnit_.y;
        }

        if(position_ == 2){
            newX = nearbyUnit_.x + pointsPerUnitM3;
            newY = nearbyUnit_.y;
        }

        if(position_ == 3){
            newX = nearbyUnit_.x;
            newY = nearbyUnit_.y - pointsPerUnitM3;
        }

        if(position_ == 4){
            newX = nearbyUnit_.x;
            newY = nearbyUnit_.y + pointsPerUnitM3;
        }

        let left;
        let right;
        let top;
        let bottom;

        
        for(let key in map_.idToUnit){
            let aUnit =  map_.idToUnit[key];
            if(aUnit.x == newX && aUnit.y == newY){
                return;
            }

            if(aUnit.x == newX - pointsPerUnitM3 && aUnit.y == newY){
                left = aUnit;
            }

            if(aUnit.x == newX + pointsPerUnitM3 && aUnit.y == newY){
                right = aUnit;
            }

            if(aUnit.x == newX && aUnit.y == newY - pointsPerUnitM3){
                top = aUnit;
            }

            if(aUnit.x == newX && aUnit.y == newY + pointsPerUnitM3){
                bottom = aUnit;
            }
        }

        let newId = map_.totalUnitIds;
        ++map_.totalUnitIds;
        theUnit = new structures.Unit(newId, newX, newY);

        if(right){
            for(let i = 0; i < pointsPerUnit*pointsPerUnit+1; i += pointsPerUnit){
                for(let j = 0; j < 3; j++){
                    theUnit.z[i+pointsPerUnit-3+j] = right.z[i+j];
                }
            }
        }
        
        if(left){
            for(let i = 0; i < pointsPerUnit*pointsPerUnit+1; i += pointsPerUnit){
                for(let j = 0; j < 3; j++){
                    theUnit.z[i+j] = left.z[i+pointsPerUnit-3+j];
                }
            }
        }

        if(bottom){
            for(let i = 0; i < pointsPerUnit; i += 1){
                for(let j = 0; j < 3; j++){
                    theUnit.z[i+pointsPerUnit*(pointsPerUnit-3+j)] = bottom.z[i+j*pointsPerUnit];
                }
            }
        }

        if(top){
            for(let i = 0; i < pointsPerUnit; i += 1){
                for(let j = 0; j < 3; j++){
                    theUnit.z[i+j*pointsPerUnit] = top.z[i+pointsPerUnit*(pointsPerUnit-3+j)];
                }
            }
        }
    }
    
    if(theUnit){
        map_.addUnit(theUnit);
    }
}
exports.newUnit = newUnit;

function updateHeight(theUnit, x_, y_, r_, changeIndex_, isSmooth_) {
    //x_, y_, r_ - x, y and radius of the filter we want to apply
    //changeIndex_ - the value by which we control the change of height
    //isSmooth_ (boolean) - if we want to change the height evenly or depending on how far the point is from the center of the filter


    //this function updates the custom mesh height/the array of points/the position of the points
    let hasUnitBeenChanged = false;
    r_ = r_/spaceBetweenPoints;
    for (var y = 0; y < pointsPerUnit; y++) {
        for (var x = 0; x < pointsPerUnit; x++) {
            let currX = ((x/*+pointsPerUnit-1*/)); //get the global x of the point
            let currY = ((y/*+pointsPerUnit-1*/)); //get the global x of the point
            let dist = additionalFunctions.getDistance(x_, y_, currX, currY); //get the distance between the filter center and the point

            if (dist < r_) {
                hasUnitBeenChanged = true;
                if (isSmooth_) {
                    theUnit.z[y*pointsPerUnit + x] += changeIndex_ / 5;
                } else {
                    theUnit.z[y*pointsPerUnit + x] += (changeIndex_ * (r_ - dist)) / (r_ * 5);
                }
            }
        }
    }

    return hasUnitBeenChanged;
}
exports.updateHeight = updateHeight;

function getHeightStats(theUnit, x_, y_, r_) {
    //x_, y_, r_ - x, y and radius of the area we want to get the height of

    //this function returns the total height of the points in the filter area and their number
    r_ = r_/spaceBetweenPoints;
    let br = 0;
    let totalHeight = 0;

    for (var y = 0; y < pointsPerUnit; y++) {
        for (var x = 0; x < pointsPerUnit; x++) {
            let currX = ((x/*+pointsPerUnit-1*/)); //get the global x of the point
            let currY = ((y/*+pointsPerUnit-1*/)); //get the global x of the point
            let dist = additionalFunctions.getDistance(x_, y_, currX, currY); //get the distance between the filter center and the point

            if (dist < r_) {
                totalHeight += theUnit.z[y*pointsPerUnit + x];
                br++;
            }
        }
    }

    return { br: br, totalHeight: totalHeight };
}
exports.getHeightStats = getHeightStats;

function levelArea(theUnit, x_, y_, r_, changeIndex_, avgHeight_) {
    //x_, y_, r_ - x, y and radius of the filter we want to apply
    //changeIndex_ - the value by which we control the change of height
    //avgHeight_ - the averige height of the area we want to level

    //this function is to get the height of a certain area to get closer to the agrv of the area
    let hasUnitBeenChanged = false;
    r_ = r_/spaceBetweenPoints;
    for (var y = 0; y < pointsPerUnit; y++) {
        for (var x = 0; x < pointsPerUnit; x++) {
            let currX = ((x/*+pointsPerUnit-1*/)); //get the global x of the point
            let currY = ((y/*+pointsPerUnit-1*/)); //get the global x of the point
            let dist = additionalFunctions.getDistance(x_, y_, currX, currY); //get the distance between the filter center and the point

            /*if(changeIndex_ < 0){
                changeIndex_ = -changeIndex_;
            }*/

            if (dist < r_) {
                hasUnitBeenChanged = true;
                if (theUnit.z[y*pointsPerUnit + x] + changeIndex_ / 5 >= avgHeight_ && theUnit.z[y*pointsPerUnit + x] - changeIndex_ / 5 <= avgHeight_) {
                    theUnit.z[y*pointsPerUnit + x] = avgHeight_;
                } else {
                    if (theUnit.z[y*pointsPerUnit + x] < avgHeight_) {
                        theUnit.z[y*pointsPerUnit + x] += changeIndex_ / 5;
                    } else {
                        theUnit.z[y*pointsPerUnit + x] -= changeIndex_ / 5;
                    }
                }
            }
        }
    }

    return hasUnitBeenChanged;
}
exports.levelArea = levelArea;

function updateTexture(theUnit, x_, y_, r_, newMatIndex_) {
    //x_, y_, r_ - x, y and radius of the filter we want to apply
    //newMatIndex_ - the index of the new material we want the points to become


    //this function updates the custom mesh texture/the array of uvs/the amount of every texture a point has
    let hasUnitBeenChanged = false;

    r_ = r_/spaceBetweenPoints;
    for (var y = 0; y < pointsPerUnit; y++) {
        for (var x = 0; x < pointsPerUnit; x++) {
            let currX = ((x/*+pointsPerUnit-1*/)); //get the global x of the point
            let currY = ((y/*+pointsPerUnit-1*/)); //get the global x of the point
            let dist = additionalFunctions.getDistance(x_, y_, currX, currY); //get the distance between the filter center and the point

            if (dist < r_) {
                hasUnitBeenChanged = true;
                theUnit.materials[y*pointsPerUnit + x] = newMatIndex_;
            }
        }
    }

    return hasUnitBeenChanged;
}
exports.updateTexture = updateTexture;

function remove(map_, unitId_){
    let theUnit;
    let idInMap;
    for(let key in map_.units){
        if(map_.units[key].id == unitId_){
            theUnit = map_.units[key];
            idInMap = key;
            break;
        }
    }
    
    let objectsToRemove = [];
    if(theUnit){
        for(let theObject in map_.objects){
            theObject = map_.objects[theObject];
            if(additionalFunctions.areSqrColliding(theUnit.x, theUnit.y, pointsPerUnit-3, theObject.x-0.5, theObject.y-0.5, 1)){
                objectsToRemove.push(theObject.id);
                objects.remove(map_, theObject.id);
            }
        }

        map_.units[idInMap] = map_.units[Object.keys(map_.units).length-1];
        delete map_.units[Object.keys(map_.units).length-1];
    }

    return {units: [unitId_], objects: objectsToRemove};
}
exports.remove = remove;