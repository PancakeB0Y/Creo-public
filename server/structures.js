//classes that describe the rooms and users

//get units functions and variables
let units = require("./units.js");

class User{
    constructor(){
        this.id;
        this.username;
    }
}
exports.User = User;

class Variable{
    constructor(id_, name_, type_, startingValue_){
        this.id = id_;
        this.name = name_;
        this.type = type_;
        this.value = startingValue_;
    }
}
exports.Variable = Variable;

class Condition{
    constructor(){
        this.type;
        this.value;
    }
}
exports.Condition = Condition;

class Exp{
    //expression
    constructor(){
        this.type;
        this.id; //the id of the curr expression
        this.children = [];
    }
}
exports.Exp = Exp;

class Event{
    constructor(id_, name_){
        this.id = id_;
        this.name = name_;
        this.condition;
        this.action;
        // this.action = {
        //     type: "",
        //     subAction: [] //array of actions
        // };
    }
}
exports.Event = Event;

class ObjectType{
    constructor(){
        this.vars = []; //an array of variables for the object type
        this.events = []; //an array of events for the object type
    }
}
exports.ObjectType = ObjectType;

class Config{
    constructor(){
        this.idCount = 1;
        this.eventIdCount = 1;
        this.globalVars = {};
        this.globalEvents = {};
        this.objectTypes = {};
        this.objects = [];
    }
}
exports.Config = Config;

class Map{
    constructor(){
        this.id;
        this.creatorId;
        this.timesPlayed;
        this.name;
        this.public;
        this.json;
        this.deleted;
        this.config = new Config(); //this holds the public variables of the map   
    }
}
exports.Map = Map;

class MapJson{
    constructor(id, name, idToObj, idToUnit, lastId, totalUnitIds, config){
		this.id = id;
		this.name = name;
		this.idToObj = idToObj;
		this.idToUnit = idToUnit;
		this.lastId = lastId;
		this.totalUnitIds = totalUnitIds;
        this.config = config;
	}
}
exports.MapJson = MapJson;

class Game{
    constructor(){
        this.id;
        this.hostId;
        this.hasHostDisconnected = false;
        this.players = {}; // contains the ids of players currently in the game
        this.mapId;
        this.active;
        this.liveGame;
        this.playersToLoad = {};
    }
}
exports.Game = Game;

class ReturnGame{
    constructor(id_, hostId_, players_, mapId_, activeMapId_, active_){
        this.id = id_;
        this.hostId = hostId_;
        this.players = players_; // contains the ids of players currently in the game
        this.mapId = mapId_;
        this.activeMapId = activeMapId_;
        this.active = active_;
    }
}
exports.ReturnGame = ReturnGame;

class Unit{
    constructor(id_, x_, y_){
        this.id = id_;
        this.x = x_;
        this.y = y_; 
        this.z = [];
        this.materials = [];
        let theLength = units.pointsPerUnit*units.pointsPerUnit;

        for(let i = 0; i < theLength; i++){
            this.materials[i] = 1;
            this.z[i] = 0;
        }
    }
}
exports.Unit = Unit;

class Object{
    constructor(){
        this.id;
        this.mapId
        this.type;
        this.x;
        this.y; 
        this.z;
        this.rotation;
        this.colorChange;
        this.colorR;
        this.colorG;
        this.colorB;
		this.tags = {};
        this.velocity = 1.00;
        this.scale = 1;
    }
}
exports.Object = Object;

class Tag{
    constructor(id, name, type, value){
        this.objId = id;
        this.name = name;
        this.type = type;
        this.value = value;
    }
}
exports.Tag = Tag;

class Log{
    constructor(){
        this.id;
        this.url;
        this.date;
        this.status;
    }
}
exports.Log = Log;

class dbReturn{
    constructor(){
        this.success; //boolean if the database operation was a success
        this.error; //this is a string that shows the client what he did wrong
        this.object; //a class of the wanted information (User, Message/s, Room)
    }
}
exports.dbReturn = dbReturn;