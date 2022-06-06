//classes that describe the rooms and users
class User{
    constructor(){
        this.id;
        this.name;
        this.friendIds = {}; //object that contains the ids of his friends and info for them
        this.mapIds = {}; //this object contains the ids of the maps this player has saved
    }
}

class Obj{
    constructor(id_, type_){
        this.id = id_;
        this.type = type_;
        this.x; //x in 3D space coordinates
        this.y; //y in 3D space coordinates
        this.z; // z in 3D space coordinates || up
        this.rotation;
        this.colorChange; //how much the color of the object will be modified (how dark of light the color will become)
        this.colorR = 0;
        this.colorG = 0;
        this.colorB = 0;
        this.velocity;
        this.scale = 1;
    }
}

class UnitInfo{
    constructor(id_){
        this.id = id_;
        this.meshes = []; //array of meshes
    }
}

class Unit{
    constructor(id_, x_, y_){
        this.id = id_;

        this.x = x_; //the x of the top left corner of the unit
        this.y = y_; //the y of the top left corner of the unit

        this.z = []; //array with the point height
        this.materials = []; //array with the materila indexes
        let mat = this.materials;
        let theZ = this.z;
        let theLength = units.pointsPerUnit*units.pointsPerUnit;

        this.lastChangeIndex; //shows how many points this unit had (if it wasn't loaded at all the value is 0)

        for(let i = 0; i < theLength; i++){
            mat[i] = 1;
            theZ[i] = 0;
        }
    }
}

class StringToken{
    constructor(type_, value_){
        this.type = type_;
        this.value = value_;
    }
}

class Variable{
    constructor(id_, name_, type_, startingValue_){
        this.id = id_;
        this.name = name_;
        this.type = type_;
        this.value = startingValue_;
    }
}

class Condition{
    constructor(){
        this.type;
        this.value;
    }
}

class ExpLeftRight{
    constructor(){
        this.type;
        this.variableType;
        this.variable;
    }
}

class Exp{
    //expression
    constructor(){
        this.type;
        this.id; //the id of the curr expression
        this.children = [];
    }
}

class Action{
    constructor(){
        this.type;
        this.variableType;
        this.variable;
        this.exp; //this is of class Exp
    }
}

class Event{
    constructor(id_, name_){
        this.id = id_;
        this.name = name_;
        this.condition;
        this.action;
    }
}

class ObjectType{
    constructor(id_, name_){
        this.name = name_; //the name/type of the ObjectType
        this.id = id_;
        this.idCount = 1;
        this.vars = {}; //an array of  ariables for the object type
        this.events = {}; //an array of events for the object type
    }
}

class Config{
    constructor(){
        this.idCount = 1;
        this.eventIdCount = 1;
        this.globalVars = {};
        this.globalEvents = {};
        this.objectTypes = {};
    }
}

class Map{
    constructor(){
        this.id;
        this.name;
        this.creatorId;
        this.creatorName; //get after load
        this.hasLoadedInfo = false;
        this.isPublic = false;
        this.units = {};
        this.objects = {};
        this.totalObjectIds = 0;
        this.totalUnitIds = 0;
        this.config = new Config(); //this holds the public variables of the map   
    }
}

class Game{
    constructor(){
        this.id;
        this.hostId;
        this.hostName; //get after load
        this.mapId;
        this.mapName; //get after load
        this.players = {};
        this.hasStarted = false;
    }
}