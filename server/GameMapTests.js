let gameMap = require("./GameMap.js");

var objs = [];

var subsObjs = {};

var subscription = {}

function onChange(name, obj) {
	if(name == "objAdded") {
		subsObjs[obj.id] = obj;
	}
	else if(name == "objRemoved") {
		delete subsObjs[obj];
	}
	else if(name == "unitAdded") {
		subsObjs[obj.id] = obj;
	}
	else if(name == "unitRemoved") {
		delete subsObjs[obj];
	}
	else {
		var x = subscription.x
		var y = subscription.y
		var r = subscription.r
        if(obj.left === undefined) {
			if(obj.x <= x + r && obj.y <= y + r && obj.x > x - r && obj.y > y - r){
				subsObjs[obj.id] = obj;
			}
			else {
				delete subsObjs[obj.id];
			}
		}
		else {
			if(obj.top < x + r && obj.left < y + r && obj.bottom > x - r && obj.right > y - r){
				subsObjs[obj.id] = obj;
			}
			else {
				delete subsObjs[obj.id];
			}
		}
	}
}

function validateSubsObj(){
	var x = subscription.x
	var y = subscription.y
	var r = subscription.r
	var foundCount = 0;
	var fnd = {};
    for(var i = 0; i < objs.length; i++) {
		var obj = objs[i]
        if(obj.left === undefined) {
			if(obj.x <= x + r && obj.y <= y + r && obj.x > x - r && obj.y > y - r){
				if(!subsObjs[obj.id]){
					console.log("More objects in objs:");
					//console.log(obj);
					//console.log(subscription);
					var s = "";
					for(var i = 0; i < objs.length; i++) {
						s += objs[i].id + " ";
					}
					console.log(s);
					return false
				}
				fnd[obj.id] = 1;
			}
		}
		else {
			if(obj.top < x + r && obj.left < y + r && obj.bottom > x - r && obj.right > y - r){
				if(!subsObjs[obj.id]){
					console.log("More objects in objs:");
					console.log(obj);
					console.log(subscription);
					console.log(objs);
					return false
				}
				fnd[obj.id] = 1;
			}
		}
    }
	for(key in subsObjs) {
		if(!fnd[key]) {
			console.log("More objects in subs:");
			console.log(subsObjs[key]);
			console.log(subscription);
			return false;
		}
	}
	return true;
}
exports.validateSubsObj = validateSubsObj

function addRandom(map, n, fromX, toX, fromY, toY, fromSize, toSize){ /*DONE: Allow range to be passed*/
    for(var i = 0; i < n; i++){
        var randChoice = Math.floor(Math.random() * 2)
        var randX = fromX + Math.floor(Math.random() * (toX - fromX))
        var randY = fromY + Math.floor(Math.random() * (toY - fromY))
        if(randChoice == 1){
            var newObj = {x: randX, y: randY, type: "obj"}
            map.addObject(newObj)
            objs.push(newObj)
        }else{
            var newUnit = {x: randX, y: randY}
            map.addUnit(newUnit)
            objs.push(newUnit)
        }
    }
}
exports.addRandom = addRandom

function removeRandom(m, n){
	for(var i = 0; i < n; i++){
        var rand = Math.floor(Math.random() * objs.length)
		var obj = objs[rand];
		if(obj.type === "obj") {
			m.removeObject(obj.id)
		}
		else {
			m.removeUnit(obj.id)
		}
		objs.splice(rand, 1);
    }
}

function changeRandom(m, n, fromX, toX, fromY, toY){
	for(var i = 0; i < n; i++){
		var cur = Math.floor(Math.random() * objs.length)
		var obj = objs[cur];
		if(obj.type === "obj") {
			var randX = fromX + Math.floor(Math.random() * (toX - fromX))
			var randY = fromY + Math.floor(Math.random() * (toY - fromY))
			m.changeObject(obj.id, {x: randX, y: randY})
		}
	}
}

function bigTest(){
	var ok = true;
	for(var i = 0; i < 10000; i++){
		var m = new gameMap.GameMap();
		subsObjs = {};
		objs = [];
		
		addRandom(m, 100, -5000, 5000, -5000, 5000)
		removeRandom(m, 1)
		changeRandom(m, 50, -4000, 4000, -4000, 4000)
		
		subscription = {};
		subscription.x = -4000 + Math.floor(Math.random() * 8000)
		subscription.y = -4000 + Math.floor(Math.random() * 8000)
		subscription.r = 20 + Math.floor(Math.random() * 1000)
		subscription.callback = onChange;
		m.addSubscription(subscription);
		
		var inObjects = [];
		m.getInArea(subscription.x, subscription.y, subscription.r, 10000000, 10000000, 0.1, inObjects);
		for(let i = 0; i < inObjects.length; i++) {
			subsObjs[inObjects[i].id] = inObjects[i];
		}
		addRandom(m, 50, -5000, 5000, -5000, 5000)
		removeRandom(m, 40)
		changeRandom(m, 50, -4000, 4000, -4000, 4000)
		
		if(!validateSubsObj()) {
			ok = false;
			break;
		}
	}
	console.log(ok);
}

bigTest();




