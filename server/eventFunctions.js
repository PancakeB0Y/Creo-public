var data = require("./events.js");
var config = data.config;
exports.config = config;

var objects = data.objects;
exports.objects = objects;

var _objects = require("./objects.js");

var globalVars = {};
var globalEvents = [];
var objectTypes = {};
var objectVars = [];

//console.log(config);
function init(config) {
	for(var i = 0; i < config.globalVars.length; i++){
		if(config.globalVars[i].type === "int"){
			globalVars[config.globalVars[i].name] = config.globalVars[i].value;
		}
	}

	globalEvents = config.globalEvents;
	objectTypes = config.objectTypes;
}
exports.init = init;

function initObject(objects){
	for(var i = 0; i < objects.length; i++){
		objectVars[i] = {};
		objectVars[i].type = objects[i].type;
		for(var j = 0; j < objects[i].vars.length; j++){
			if(objects[i].vars[j].type === "int" || objects[i].vars[j].type === "boolLiteral"){
				objectVars[i][objects[i].vars[j].name] = objects[i].vars[j].value;
			}
		}
	}
}
exports.initObject = initObject;

function evaluateExpression(exp, object, map, tmpVar) {
	//+, -, *, /, >, <, <=, >=, ==, !=, &&, abs, var, intLiteral, boolLiteral, stringLiteral, field, closestObject, tmpVar, setTmp
	if(exp.type === "abs"){
		return Math.abs(evaluateExpression(exp.arg, object, map, tmpVar));
	}
	else if(exp.type === "var"){
		if(exp.variableType === "global"){
			return globalVars[exp.variable];
		}else if(exp.variableType === "object"){
			return object[exp.variable];
		}
	}
	else if(exp.type === "intLiteral" || exp.type === "boolLiteral" || exp.type === "stringLiteral") {
		return exp.value;
	}
	else if(exp.type === "tmpVar"){
		return tmpVar[exp.name];
	}
	else if(exp.type === "field"){
		var _obj = evaluateExpression(exp.obj, object, map, tmpVar);
		return _obj[exp.field];
	}
	else if(exp.type === "closestObject") {
		var maxDistance = evaluateExpression(exp.maxDistance, object, map, tmpVar);
		var closestDistance = 0;
		var closestObj;

		for(var i in objectVars) {
			var currentObject = objectVars[i];
			var d = Math.sqrt((currentObject.x - object.x)*(currentObject.x - object.x) + (currentObject.y - object.y)*(currentObject.y - object.y));
			if(d <= maxDistance){
				tmpVar.obj = currentObject;
				if(evaluateExpression(exp.condition, object, map, tmpVar)){
					if(closestDistance < d){
						closestObj = currentObject;
						closestDistance = 0;
					}
				}
			}
		}
		return closestObj;
	}
	else if(exp.type === "setTmp"){
		var _obj = evaluateExpression(exp.value, object, map, tmpVar);
		tmpVar[exp.name] = _obj;
		return _obj;
	}
	
	if(exp.left){
		var leftValue = evaluateExpression(exp.left, object, map, tmpVar);
		var rightValue = evaluateExpression(exp.right, object, map, tmpVar);
	
		if(exp.type === "<") {
			return leftValue < rightValue;
		}
		else if(exp.type === ">") {
			return leftValue > rightValue;
		}
		else if(exp.type === "<=") {
			return leftValue <= rightValue;
		}
		else if(exp.type === ">=") {
			return leftValue >= rightValue;
		}
		else if(exp.type === "==") {
			return leftValue === rightValue;
		}
		else if(exp.type === "!=") {
			return leftValue != rightValue;
		}
		else if(exp.type === "+"){
			return leftValue + rightValue;
		}
		else if(exp.type === "-"){
			return leftValue - rightValue;
		}
		else if(exp.type === "*"){
			return leftValue * rightValue;
		}
		else if(exp.type === "/"){
			return leftValue / rightValue;
		}
		else if(exp.type === "&&"){
			return leftValue && rightValue;
		}
	}
}
exports.evaluateExpression = evaluateExpression;


function executeAction(action, object, map, tmpVar) {
	//multi, set
	if(action.type === "multi"){
		for(var i = 0; i < action.subActions.length; i++){
			var subAction = action.subActions[i];
			executeAction(subAction, object, map, tmpVar);
		}
	}else if(action.type === "set") {
		if(action.variableType === "global"){
			globalVars[action.variable] = evaluateExpression(action.exp, object, map, tmpVar);
		}else if(action.variableType === "object"){
			object[action.variable] = evaluateExpression(action.exp, object, map, tmpVar);
		}
	}
	else if(action.type === "setObjectPos") {
		_objects.moveObj(map, evaluateExpression(action.objId, object, map, tmpVar), evaluateExpression(action.x, object, map, tmpVar), evaluateExpression(action.y, object, map, tmpVar));
		console.log(evaluateExpression(action.objId, object, map, tmpVar), evaluateExpression(action.x, object, map, tmpVar), evaluateExpression(action.y, object, map, tmpVar)) 
	}
}

function processEvent(event, object, map) {
	var tmpVar = {};
	if(evaluateExpression(event.condition, object, map, tmpVar)){
		executeAction(event.action, object, map, tmpVar);
	}
}
exports.processEvent = processEvent;

function processEvents(map) {
	for(var i = 0; i < globalEvents.length; i++){
		processEvent(globalEvents[i], null, map);
	} //all global events
	for(var i = 0; i < objectVars.length; i++){
		var events = objectTypes[objectVars[i].type].events;
		for(var j = 0; j < events.length; j++){
			processEvent(events[j], objectVars[i], map);
		}
	} //all object events
}
exports.processEvents = processEvents;