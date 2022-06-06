let tree = require("./Tree.js");
let fs = require('fs');

//get units functions and variables
let units = require("./units.js");

var subscriptions = []
var pointsPerUnit = units.pointsPerUnit;

class GameMap {
	constructor(id, name){
		this.id = id;
		this.name = name;
		this.resetTree()
		this.sRoot = new tree.Node(null, -300, -300, 300, 300, null, null, null, null, 0, [], 600);
		this.idToObj = {}
		this.idToUnit = {}
		this.idToSubsc = {}
		this.lastId = 0;
		this.totalUnitIds = 0;
		this.hasChanged = false;
        this.objIdToEventList = {};
	}

    addObjectEvent(objectId, event) {
        var eventList = this.objIdToEventList[objectId];
        if(!eventList) {
            eventList = [];
            this.objIdToEventList[objectId] = eventList;
        }
        eventList.push(event);
        //console.log(objectId, typeof(objectId), eventList);
    }
	
	resetTree(){
		this.root = new tree.Node(null, -300, -300, 300, 300, null, null, null, null, 0, [], 600);
	}

	storeInFile(){ //was loadFromFile
		var toSave = {objects: this.idToObj, units: this.idToUnit, totalUnitIds: this.totalUnitIds, name: this.name};
		fs.writeFileSync("database/maps/" + this.id + ".json", JSON.stringify(toSave));
		this.hasChanged = false;
		//Write to file
	}

	storeIfChanged(){
		if(this.hasChanged){
			this.storeInFile();
		}
	}
	
	loadFromFile(){ //was storeInFile
		let path = "database/maps/" + this.id + ".json";
		try{
			if(fs.existsSync(path)){
				var parsed = JSON.parse(fs.readFileSync(path));
				this.resetTree()
				this.idToObj = parsed.objects;
				this.idToUnit = parsed.units;
				this.totalUnitIds = parsed.totalUnitIds;
				this.name = parsed.name;
				var maxId = this.lastId;
				for(let key in this.idToUnit){
					this.root = tree.addObject(this.root, this.idToUnit[key])
					if(this.idToUnit[key].id > maxId){
						maxId = this.idToUnit[key].id
					}
				}
				for(let key in this.idToObj){
					this.root = tree.addObject(this.root, this.idToObj[key])
					if(this.idToObj[key].id > maxId){
						maxId = this.idToObj[key].id
					}
				}
				this.lastId = maxId;
				this.hasChanged = false;
			}
		}catch(err){
			console.error(err);
		}
		//?? this.lastId
	}
	
	addObject(obj){
		//SHOULD assign id to the object
		this.lastId++
		obj.id = this.lastId;
		this.idToObj[this.lastId] = obj
		this.root = tree.addObject(this.root, obj)
		this.processEvent('objAdded', obj, obj.x, obj.y, 0);
	}

	addUnit(unit){
		console.log("adden an unit");
		//SHOULD assing id to the unit
		this.lastId++
		unit.id = this.lastId;
		unit.top = unit.x;
		unit.left = unit.y;
		unit.bottom = unit.x + pointsPerUnit
		unit.right = unit.y + pointsPerUnit
		this.idToUnit[this.lastId] = unit
		this.root = tree.addObject(this.root, unit)
		this.processEvent('unitAdded', unit, unit.x + (pointsPerUnit/2),  unit.y + (pointsPerUnit/2), pointsPerUnit/2);
	}
	
	removeObject(objId){
		if(this.idToObj[objId]){
			let obj = this.idToObj[objId]
			tree.removeObject(this.root, obj)
			delete this.idToObj[objId]
			this.processEvent('objRemoved', objId, obj.x, obj.y, 0.5);
			return true
		}else{
			return false
		}
	}

	removeUnit(unitId){
		if(this.idToUnit[unitId]){
			let unit = this.idToUnit[unitId]
			tree.removeObject(this.root, unit)
			delete this.idToUnit[unitId]
			this.processEvent('unitRemoved', unitId, unit.x + (pointsPerUnit/2),  unit.y + (pointsPerUnit/2), pointsPerUnit/2);
			return true
		}else{
			return false
		}
	}
	
	changeObject(objId, changes){
		if(this.idToObj[objId]){
			let obj = this.idToObj[objId]
			//x -> z  y -> x
			let oldX = obj.x
			let oldY = obj.y
			tree.removeObject(this.root, obj)
			for(let key in changes){
				obj[key] = changes[key]
			}
			this.root = tree.addObject(this.root, obj)
			let cX = (oldX + obj.x)/2
			let cY = (oldY + obj.y)/2
			let r = Math.max(Math.abs(cX - oldX), Math.abs(cY - oldY)) + 0.01
			this.processEvent('objChanged', obj, cX, cY, r);
			return true
		}else{
			return false
		}
	}

	checkForCollision(objId, x, y, r){
		let collisions = [];
		tree.findInRadiusFromNode(this.root, x, y, r, collisions);

		for(let i = 0; i < collisions.length; i++){
			let collision = collisions[i];
			if(!collision.materials && collision.id != objId && !collision.hidden){
				return true;
			}
		}
		
		return false;
	}

	changeUnit(unitId, changes){ //height, material
		if(this.idToUnit[unitId]){
			let unit = this.idToUnit[unitId]
			for(let key in changes){
				unit[key] = changes[key]
			}
			this.processEvent('unitChanged', unit, unit.x + (pointsPerUnit/2), unit.y + (pointsPerUnit/2), pointsPerUnit/2);
			return true
		}else{
			return false
		}
	}
	
	addSubscription(subsc){ // subsc { x, y, r, callback}
		this.lastId++
		subsc.id = this.lastId;
		subsc.top = subsc.x - subsc.r;
		subsc.left = subsc.y - subsc.r;
		subsc.bottom = subsc.x + subsc.r;
		subsc.right = subsc.y + subsc.r;
		this.idToSubsc[this.lastId] = subsc;
		this.sRoot = tree.addObject(this.sRoot, subsc)
		//The subscription can be just a rectangle
	}
	
	removeSubscription(subscId) {
		if(this.idToSubsc[subscId]){
			var subsc = this.idToSubsc[subscId]
			delete this.idToSubsc[subscId]
			tree.removeObject(this.sRoot, subsc)
			return true
		}else{
			return false
		}
	}
	
	getInArea(x, y, r, oldX, oldY, oldR, objects) {
		tree.findInRadiusFromNode(this.root, x, y, r, objects) 
		for(var i = 0; i < objects.length; i++){
			var obj = objects[i]
			if(obj.left === undefined) {
				if(obj.x <= oldX + oldR && obj.y <= oldY + oldR && obj.x > oldX - oldR && obj.y > oldY - oldR){
					objects[i] = null
				}
			}
			else {
				if(obj.top < oldX + oldR && obj.left < oldY + oldR && obj.bottom > oldX - oldR && obj.right > oldY - oldR){
					objects[i] = null
				}
			}
		}

		var j = 0;
		for(var i = 0; i < objects.length; i++){
			var obj = objects[i]
			if(obj !== null){
				objects[j] = obj
				j++
			}
		}
		objects.splice(j, objects.length - j)
		//Get everything in this area
		//Do not return subscriptions
	}
	
	processEvent(name, data, x, y, r) {
		//'objAdded', 'unitAdded', 'objRemoved', 'unitRemoved', 'objChanged', 'unitChanged'
		this.hasChanged = true;
		if(r === 0) {
			tree.findAtFromNode(this.sRoot, x, y, subscriptions) 
		}
		else {
			tree.findInRadiusFromNode(this.sRoot, x, y, r, subscriptions) 
		}
		for(var i = 0; i < subscriptions.length; i++){
			subscriptions[i].callback(name, data)
		}
		subscriptions.splice(0, subscriptions.length)
		//The event should have a rectangle
		//Find all subscriptions that intersect with the event
		//Notify them of the event so they can notify the clients
	}
}
exports.GameMap = GameMap;
