var serverMain = require("./server_main.js");
var _objects = require("./objects.js");
var server = require("./server.js")
var structures = require("./structures.js")

class LiveGame {
	
	constructor(game, map){
		this.game = game;
		this.map = map;
		this.globalVars = map.config.globalVars;
		this.objectVars = [];
		this.updateInterval = 200;
		this.started = true;
		this.changedObjects = {};
		this.consumedEventObjects = {};

		var that = this;
		for(var i in this.map.config.globalVars){
			var v = this.map.config.globalVars[i];
			this.map.config.globalVars[v.name] = v;
			delete this.map.config.globalVars[i];
		}
		
		for(let i in this.map.idToObj){
			var obj = this.map.idToObj[i];
			var objType = this.map.config.objectTypes[obj.objectType];
			if(objType) {
				for(let j in objType.vars){
					var v = JSON.parse(JSON.stringify(objType.vars[j]));
					if(v.name!=="x" && v.name!=="y" && v.name!=="z" && v.name!=="id" && v.name!=="mapId" && v.name!=="type" && v.name!=="rotation" && v.name!=="colorChange"){
                        var val = v.value;
                        if(v.type == "bool") {
                            val = (typeof(val) === "boolean") ? val : (val === "true");
                        }
						obj[v.name] = val;
					}
				}
			}
			//console.log(this.map.idToObj[i]);
		}

		this.globalSetter = function(info, value) {
            that.globalVars[info.name].value = value;
		}
		this.globalGetter = function(info) {
            return that.globalVars[info.name].value;
		}
		
		this.objectSetter = function(info, value) {
            info.obj[info.name] = value;
            that.changedObjects[info.obj.id] = true
		}
		this.objectGetter = function(info, value) {
            return info.obj[info.name];
		}

		this.tmpSetter = function(info, value) {
			info.vars[info.name] = value;
		}
		this.tmpGetter = function(info, value) {
			return info.vars[info.name];
		}

		this.fieldSetter = function(info, value) {
			info.obj[info.name] = value;
            if(info.obj.id) that.changedObjects[info.obj.id] = true
		}
		this.fieldGetter = function(info, value) {
			return info.obj[info.name];
		}
    }
	
	start(){
		for(let key in this.game.players){
			serverMain.emitToUser(key, 'gameStarted', {});
		}
		serverMain.emitToUser(this.game.hostId, 'gameStarted', {});
		console.log("start");
		if(this.started === true){
			setTimeout(() => this.update(), this.updateInterval);
		}
	}

	end(){
		for(let key in this.game.players){
			serverMain.emitToUser(key, 'gameEnded', {mapId: this.map.id});
		}
		serverMain.emitToUser(this.game.hostId, 'gameEnded', {mapId: this.map.id});
		this.started = false;
		console.log("end");
	}
	
	update(){
		if(this.started === true){
			this.processEvents();
			setTimeout(() => this.update(), this.updateInterval);
			serverMain.emitToUser(this.game.hostId, "updateConfig", {config: this.map.config});
			for(let key in this.game.players){
				serverMain.emitToUser(this.game.players[key], "updateConfig", {config: this.map.config});
			}
		}
	}

	evaluateExpression(exp, object, tmpVar, allowLValue) {
		//+, -, *, /, >, <, <=, >=, ==, !=, &&, ?;, ;, ., abs, var, intLiteral, boolLiteral, stringLiteral, field, closestObject, tmpVar, setTmp
		if(!exp){
			return undefined;
		}
		if(exp.type === "abs"){
			var v = Math.abs(this.evaluateExpression(exp.children[0], object, tmpVar));
			return v;
		}
		else if(exp.type === "seq"){
			let first = this.evaluateExpression(exp.children[0], object, tmpVar);
			const second = this.evaluateExpression(exp.children[1], object, tmpVar);
			if(typeof(first) != "boolean") first = Math.abs(first);
			
			return (typeof(second) === "boolean") ? second : Math.abs(second);
		}
		else if(exp.type === "globalVar"){
			var name = this.evaluateExpression(exp.children[0], object, tmpVar);
			if(allowLValue) {
				return {setter: this.globalSetter, getter:this.globalGetter, name: name};
			}
			else {
				if(this.map.config.globalVars[name] !== undefined) {
					return this.map.config.globalVars[name].value;
				}
				else {
					return undefined;
				}
			}
		}
		else if(exp.type === "objectVar"){
			var name = this.evaluateExpression(exp.children[0], object, tmpVar);
			if(!object) return undefined;
			if(allowLValue) {
				return {setter: this.objectSetter, getter:this.objectGetter, obj:object, name: name};
			}
			else {
                return object[name];
			}
		}
		else if(exp.type === "tmpVar"){
            var name = this.evaluateExpression(exp.children[0], object, tmpVar);
			if(allowLValue) {
                return {setter: this.tmpSetter, getter:this.tmpGetter, vars:tmpVar, name: name};
			}
			else {
                return tmpVar[name];
			}
		}
		else if(exp.type === "number") {
			return parseFloat(exp.value);
		}
		else if(exp.type === "bool") {
			return (typeof(exp.value) === "boolean") ? exp.value : (exp.value === "true");
		}
		else if(exp.type === "string") {
			return "" + exp.value;
		}
		else if(exp.type === "this"){
            return object;
		}
		else if(exp.type === "array") {
			const text =  this.evaluateExpression(exp.children[0], object, tmpVar);
			let numbers = text.split(",");
			numbers = numbers.map(Number);
			return numbers;
		}
		else if(exp.type === "getObject"){
			var objectId = this.evaluateExpression(exp.children[0], object, tmpVar);
			return this.map.idToObj[parseInt(objectId)];
		}
		else if(exp.type === "consumeEvent") {
			var obj = this.evaluateExpression(exp.children[0], object, tmpVar);
            if(!obj) return undefined;
			var objectId = parseInt(obj.id);
			var eventList = this.map.objIdToEventList[objectId];
            if(eventList && eventList.length > 0) {
				this.consumedEventObjects[objectId] = true;
                return eventList[0];
            }
            else {
                return undefined;
            }
		}
		else if(exp.type === "cloneObject") {
			var id = parseFloat(this.evaluateExpression(exp.children[0], object, tmpVar));
            var source = this.map.idToObj[id];
            if(source) {
                var newObj = JSON.parse(JSON.stringify(source));
                this.map.addObject(newObj);
                return newObj;
            }
		}
		else if(exp.type === "setTmp"){
			var _obj = this.evaluateExpression(exp.value, object, tmpVar);
			tmpVar[exp.name] = _obj;
			return _obj;
		}
		if(exp.type === ";"){
			for(var i = 0; i < exp.children.length; i++){
				var subAction = exp.children[i];
				this.evaluateExpression(subAction, object, tmpVar);
			}
			return undefined;
		}
		else if(exp.type === "="){
			var left = this.evaluateExpression(exp.children[0], object, tmpVar, true);
			var right = this.evaluateExpression(exp.children[1], object, tmpVar);
			if(left && left.setter)left.setter(left, right);		
			return right;
		}
		
		else if(exp.type === "sin"){
			return Math.sin(parseFloat(this.evaluateExpression(exp.children[0], object, tmpVar)));
		}
		else if(exp.type === "cos"){
			return Math.cos(parseFloat(this.evaluateExpression(exp.children[0], object, tmpVar)));
		}			
		else if(exp.children.length == 2){
			var leftValue = this.evaluateExpression(exp.children[0], object, tmpVar);
			var rightValue;

			if(exp.type === "<") {
				rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
				return leftValue < rightValue;
			}
			else if(exp.type === ">") {
				rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
				return leftValue > rightValue;
			}
			else if(exp.type === "<=") {
				rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
				return leftValue <= rightValue;
			}
			else if(exp.type === ">=") {
				rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
				return leftValue >= rightValue;
			}
			else if(exp.type === "==") {
				rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
				return leftValue == rightValue;
			}
			else if(exp.type === "!=") {
				rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
				return leftValue != rightValue;
			}
			else if(exp.type === "+"){
				rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
				return leftValue + rightValue;
			}
			else if(exp.type === "-"){
				rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
				return leftValue - rightValue;
			}
			else if(exp.type === "*"){
				rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
				return leftValue * rightValue;
			}
			else if(exp.type === "/"){
				rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
				return leftValue / rightValue;
			}
			else if(exp.type === "&&"){
				if(leftValue){
					rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
					return rightValue;
				}else return false;
			}
			else if(exp.type === "||"){
				if(leftValue){
					return true;
				}else{
					rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
					return rightValue;
				}
			}
			else if(exp.type === "."){
				if(leftValue) {
                    rightValue = this.evaluateExpression(exp.children[1], object, tmpVar);
                    if(allowLValue) {
                        return {setter: this.fieldSetter, getter:this.fieldGetter, obj:leftValue, name: rightValue};
                    }
                    else {
                        return leftValue[rightValue];
                    }
                }
				return undefined;
			}
			return undefined;
		}
		else if(exp.children.length == 3){
			if(exp.type === "?:"){
				var condition = this.evaluateExpression(exp.children[0], object, tmpVar);

				if(condition) {
					return this.evaluateExpression(exp.children[1], object, tmpVar);
				}
				else {
					return this.evaluateExpression(exp.children[2], object, tmpVar);
				}
			}
			else if(exp.type === "checkEmpty"){
				var x = parseFloat(this.evaluateExpression(exp.children[0], object, tmpVar));
				var y = parseFloat(this.evaluateExpression(exp.children[1], object, tmpVar));
				var radius = parseFloat(this.evaluateExpression(exp.children[2], object, tmpVar));
		
				return !this.map.checkForCollision(undefined, x, y, radius);
			}
			else if(exp.type === "setPosition"){
				var obj = this.evaluateExpression(exp.children[0], object, tmpVar);
				var x = parseFloat(this.evaluateExpression(exp.children[1], object, tmpVar));
				var y = parseFloat(this.evaluateExpression(exp.children[2], object, tmpVar));
				//console.log(this.map, obj.id, x, y);
				if(obj && !isNaN(x) && !isNaN(y)) {
					_objects.moveObj(this.map, obj.id, x, y);
					this.changedObjects[obj.id] = true;
				}
				return;
			}
			return undefined;
		}else if(exp.children.length == 4){
			if(exp.type === "addTag"){
				var objId = this.evaluateExpression(exp.children[0], object, tmpVar);
				var name = this.evaluateExpression(exp.children[1], object, tmpVar);
				var type = this.evaluateExpression(exp.children[2], object, tmpVar);
				var value;
				type == "popup" ? value = this.evaluateExpression(exp.children[3], object, tmpVar) 
				: value = this.evaluateExpression(exp.children[3], object, tmpVar, true);
				if(type === "popup"){
					value = this.evaluateExpression(exp.children[3], object, tmpVar) 
				}else if(type === "bar"){
					value = this.evaluateExpression(exp.children[3], object, tmpVar, true);
					value = value.name;
				}

				var obj = this.map.idToObj[objId];
				if(obj) {
					var newTag = new structures.Tag(objId, name, type, value);
					if(!obj.tags)obj.tags = {};
					obj.tags[name] = newTag;
				}
				
				this.changedObjects[objId] = true;
				return;
			}
			else if(exp.type === "closestObject") {
				var x = parseFloat(this.evaluateExpression(exp.children[0], object, tmpVar));
				var y = parseFloat(this.evaluateExpression(exp.children[1], object, tmpVar));
				var maxDistance = parseFloat(this.evaluateExpression(exp.children[2], object, tmpVar));
				var closestDistance = undefined;
				var closestObj = undefined;
		
				for(var i in this.map.idToObj) {
					var currentObject = this.map.idToObj[i];
					if(currentObject.hidden) continue;
					var d = Math.sqrt((currentObject.x - x)*(currentObject.x - x) + (currentObject.y - y)*(currentObject.y - y));
					if(d <= maxDistance){
						tmpVar.obj = currentObject;
						if((closestDistance === undefined) || (d < closestDistance)) {
							if(this.evaluateExpression(exp.children[3], object, tmpVar)){
								closestObj = currentObject;
								closestDistance = d;
							}
						}
					}
				}
				delete tmpVar.obj;
				return closestObj;
			}
			else if(exp.type === "angle") {
				const x1 = parseFloat(this.evaluateExpression(exp.children[0], object, tmpVar));
				const y1 = parseFloat(this.evaluateExpression(exp.children[1], object, tmpVar));
				const x2 = parseFloat(this.evaluateExpression(exp.children[2], object, tmpVar));
				const y2 = parseFloat(this.evaluateExpression(exp.children[3], object, tmpVar));
				
				const x = x2 - x1;
				const y = y2 - y1;

				var angle;
				if(y >= 0){
					angle = Math.acos(x / Math.sqrt((x*x)+(y*y)));
				}else{
					angle = 2*Math.PI - Math.acos(x / Math.sqrt((x*x)+(y*y)));
				}
				return angle;
			}
		}
		else if(exp.type === "makeEnemy"){
			//console.log("making enemy");
			const objId = this.evaluateExpression(exp.children[0], object, tmpVar);
			const visionRadius = parseFloat(this.evaluateExpression(exp.children[1], object, tmpVar));
			const firstBorderXY = this.evaluateExpression(exp.children[2], object, tmpVar);
			const secondBorderXY = this.evaluateExpression(exp.children[3], object, tmpVar);
			const condition = this.evaluateExpression(exp.children[4], object, tmpVar);
			
			const borderTopX = Math.min(firstBorderXY[0], secondBorderXY[0]);
			const borderTopY = Math.min(firstBorderXY[1], secondBorderXY[1]);
			const borderBottomX = Math.max(firstBorderXY[0], secondBorderXY[0]);
			const borderBottomY = Math.max(firstBorderXY[1], secondBorderXY[1]);

			const enemy = this.map.idToObj[objId];

			for(const i in this.map.idToObj){
				let currentObject = this.map.idToObj[i];

				if(currentObject.id == enemy.id) continue;
				if(currentObject.hidden) continue;
				if(!currentObject[condition]) continue;
				if(enemy.x < borderTopX || enemy.x > borderBottomX || enemy.y < borderTopY || enemy.y > borderBottomY){
					return;
				}
				
				if(currentObject.x >= borderTopX && currentObject.x <= borderBottomX && currentObject.y >= borderTopY && currentObject.y <= borderBottomY){
					const d = Math.sqrt((currentObject.x - enemy.x)*(currentObject.x - enemy.x) + (currentObject.y - enemy.y)*(currentObject.y - enemy.y));
					if((d <= visionRadius) && (d > 0.0001)){
						if(Math.abs(enemy.x - currentObject.x) > 1.5 && Math.abs(enemy.y - currentObject.y) > 1.5){
							let velocity = enemy.velocity
							if(velocity > d){
								velocity = d;
							}
							let vx = currentObject.x - enemy.x;
							let vy = currentObject.y - enemy.y;
							vx /= d;
							vy /= d;
							vx *= velocity;
							vy *= velocity;

							enemy.x += vx;
							enemy.y += vy;

							_objects.moveObj(this.map, enemy.id, enemy.x, enemy.y);
							this.changedObjects[enemy.id] = true;
						}
					}
				}
				
			}

			return true;
		}	
        else if(exp.type === "endGame"){
			this.end();
			server.endGame(this.game.id);
			return;
		}

	}

	processEvent(event, object) {
		var tmpVar = {};
		//console.log("event");
		if(this.evaluateExpression(event.condition, object, tmpVar)){
			this.evaluateExpression(event.action, object, tmpVar);
			//console.log(typeof(object.hp));
		}
	}

	processEvents() {
		if(!this.map.config)return;
		this.changedObjects = {};
		this.consumedEventObjects = {};
		//console.log("processEvents");
		let globalEvents = this.map.config.globalEvents;
		//console.log(globalEvents);
		for(let i in globalEvents){
			this.processEvent(globalEvents[i], null);
		} //all global events

		for(let i in this.map.idToObj){
			var obj = this.map.idToObj[i];
			// console.log(obj);
			var objType = this.map.config.objectTypes[obj.objectType];
			if(objType) {
				for(let j in objType.events){
					//console.log(objType.events[j], obj);
					this.processEvent(objType.events[j], obj);
				}
			}
		}
		
		for(let i in this.consumedEventObjects){
			var eventList = this.map.objIdToEventList[i];
			eventList.splice(0, 1);
			if(eventList.length == 0) delete this.map.objIdToEventList[parseInt(obj.id)];
		}
		for(let i in this.changedObjects){
			this.map.changeObject(i,{});
		}
	}	
          
}
exports.LiveGame = LiveGame;