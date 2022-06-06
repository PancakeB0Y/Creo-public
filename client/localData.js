// var socket = io.connect('https://wizardsofthecode.online:443/');

//const { response } = require("express");

// var socket = io('/');
var socket = io();

// var CryptoJS = require('crypto-js');

var user; //the current logged user
var loadedPlayers = {}; //all players that are already loaded
var loadedMaps = {}; //all maps that are loeded

var sessionId; //id of the seesion we connect to

var onRecievingMap = 0; //0 - just add the map to the loaded maps, 1 - start editing, 2 - start playing

var currGame; //a game structure

var currTag;

function setSessionId(newSessionId){ sessionId = newSessionId; }

//functions for comunication with the server
function register(username, /*email,*/ password){
    // password = CryptoJS.MD5(password).toString();

	$.ajax("/createUser", {
		data: JSON.stringify({sessionId: sessionId, username: username,/* email: email,*/ password: password}),
		method: "POST",
		contentType: "application/json",
		success: function(response, textStatus, jqXHR) {			
			//console.log(response);
			if(response.success) {
                user = new User();
                updateObj(user, response.object);
                sessionId = response.object.sessionId;
                socket.emit('authenticate', JSON.stringify({sessionId: sessionId}));

                for(key in user.friendIds){
                    socket.emit('getFriendInfo', JSON.stringify({sessionId: sessionId, id: key}));
                }

                for(key in user.mapIds){
                    socket.emit('getMapDisplayInfo', JSON.stringify({sessionId: sessionId, id: key}));
                }
        
                onRegister();
                localStorageFunctions.afterLoginRegister(user.sessionId);
            } else {
                alert(response.error);
                //Error
            }
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}		
	});
}

function login(username, password){ //username could be email
    // password = CryptoJS.MD5(password).toString();
    
	$.ajax("/login", {
		data: JSON.stringify({sessionId: sessionId, username: username, password: password}),
		method: "POST",
		contentType: "application/json",
		success: function(response, textStatus, jqXHR) {			
			//console.log(response);
			if(response.success) {
                user = new User();
                updateObj(user, response.object);
                sessionId = response.object.sessionId;
                socket.emit('authenticate', JSON.stringify({sessionId: sessionId}));

                for(key in user.friendIds){
                    socket.emit('getFriendInfo', JSON.stringify({sessionId: sessionId, id: key}));
                }

                for(key in user.mapIds){
                    socket.emit('getMapDisplayInfo', JSON.stringify({sessionId: sessionId, id: key}));
                }

                localStorageFunctions.afterLoginRegister(user.sessionId);

                let state = response.state;
                if(state.state == 0){
                    onLogin();
                }else{
                    window.camera = ArcRotateCamera;
                    
                    currGame = state.game;
                    let mapId = currGame.activeMapId;
                    
                    switchMenus(".map-edit-div", "flex");

                    if(currGame.hostId != user.id){
                        let theObjectId = currGame.players[user.id].objectId;

                        if(theObjectId != null){
                            console.log("My object id is " + theObjectId);
                            isInPlayMode = true;
                            playerId = theObjectId;
                            window.camera = FreeCamera;
                        }
                    }

                    let newMap = new Map();
                    newMap.id = mapId;
                    startEditingOnLoadMap(newMap);
                    loadMap(mapId);
                    onRecievingMap = 1;

                    
                    if(currGame.hostId != user.id){
                        document.querySelector(".map-edit-div").querySelector(".tool-holder").style.display = "none";
                        document.querySelector(".map-edit-div").querySelector(".canvas-holder").style.width = "100%";
                    }else{
                        document.querySelector(".map-edit-div").querySelector("#toolButtonsEndGame").style.display = "inline-block";
                    }
                }
            } else {
                console.error(response.error);
                //Error
                //not finished
            }
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}		
	});
}

function getUser(userId, onSuccessFunction){
    //onSuccessFunction must have a user parameter
	$.ajax("/getUser", {
		data: JSON.stringify({sessionId: sessionId, userId: userId}),
		method: "POST",
		contentType: "application/json",
		success: function(response, textStatus, jqXHR) {			
			//console.log(response);
			if(response.success) {
                user = new User();
                updateObj(user, response.object);
                onSuccessFunction(user);
            } else {
                alert(response.error);
                //Error
                //not finished
            }
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}		
	});
}

// login("asdf", "asdf");

//functions for comunication with sockets
function createMap(theMap){
    if(user != null){
        theMap.hasLoadedInfo = true;
        if(theMap.id){
            loadedMaps[theMap.id] = theMap;
        }
        if(theMap.id){
        //    user.mapIds[theMap.id] = 1;
        }
        socket.emit('createMap', {sessionId: sessionId, object: theMap});
    }else{
        alert("You must login/register.");
    }
}

function unsubscribe() {
    if(map.currMap != undefined && map.currMap.id != undefined){
        socket.emit('unsubscribeForMap', {sessionId: sessionId});
    }
}

function loadMap(id){
    if(user != null){
        socket.emit('subscribeForMap', {id: id, x: 0, y: 0, r: 100000});
    }else{
        alert("You must login/register.");
    }
}

function changeMapHeight(id, x_, y_, r_, hIndex_, isLeveling_, isSmooth_){
    if(user != null){
        socket.emit('changeMapHeight', {sessionId: sessionId, id: id, x: x_, y: y_, r: r_, hIndex: hIndex_, isLeveling: isLeveling_, isSmooth: isSmooth_});
    }else{
        alert("You must login/register.");
    }
}

function changeMapMaterial(id, x_, y_, r_, newTexture_){
    if(user != null){
        console.log(id, x_, y_, r_, newTexture_);
        socket.emit('changeMapMaterial', {sessionId: sessionId, id: id, x: x_, y: y_, r: r_, newTexture: newTexture_});
    }else{
        alert("You must login/register.");
    }
}

function addUnit(id, nearbyId_, side_){
    if(user != null){
        socket.emit('addUnit', {sessionId: sessionId, id: id, nearbyId: nearbyId_, side: side_});
    }else{
        alert("You must login/register.");
    }
}

function removeUnit(id, unitId_){
    if(user != null){
        socket.emit('removeUnit', {sessionId: sessionId, id: id, unitId: unitId_});
    }else{
        alert("You must login/register.");
    }
}

function addObject(id, x_, y_, type_, rotation_, colorChange_, thisColorR_, thisColorG_, thisColorB_, thisSize_){
    if(user != null){
        socket.emit('addObject', {sessionId: sessionId, id: id, x: x_, y: y_, type: type_, rotation: rotation_,
            colorChange: colorChange_, thisColorR: thisColorR_, thisColorG: thisColorG_, thisColorB: thisColorB_,
            thisSize: thisSize_});
    }else{
        alert("You must login/register.");
    }
}

function removeObject(id, objId_){
    if(user != null){
        socket.emit('removeObject', {sessionId: sessionId, id: id, objId: objId_});
    }else{
        alert("You must login/register.");
    }
}

function moveObjWithPlayer(id, x_, y_, rot){
    if(user != null){
        socket.emit('moveObject', {sessionId: sessionId, id: id, objId: playerId, x: x_, y: y_, rot:rot});
    }else{
        alert("You must login/register.");
    }
}

function rotateObjWithPlayer(id, rot){
    if(user != null){
        socket.emit('rotateObject', {sessionId: sessionId, id: id, objId: playerId, rot:rot});
    }else{
        alert("You must login/register.");
    }
}
function moveObject(mapId, objectId, x_, y_){
    if(user != null){
        socket.emit('moveObject', {sessionId: sessionId, id: mapId, objId: objectId, x: x_, y: y_});
    }else{
        alert("You must login/register.");
    }
}

function addObjectEvent(id, event){
    if(user != null){
        socket.emit('addObjectEvent', {sessionId: sessionId, id: id, objId: playerId, event:event});
    }else{
        alert("You must login/register.");
    }
}

function changeObjectType(id, objId, newTypeId){
    if(user != null){
        socket.emit('changeObjectType', {sessionId: sessionId, id: id, objectId: objId, newTypeId: newTypeId});
    }else{
        alert("You must login/register.");
    }
}

function getPublicGames(){
    if(user != null){
        socket.emit('getPublicGames', {sessionId: sessionId});
    }else{
        alert("You must login/register.");
    }
}

function getGameDetails(gameId){
    if(user != null){
        socket.emit('getPublicGameDetails', {sessionId: sessionId, gameId: gameId});
    }else{
        alert("You must login/register.");
    }
}

function getPublicMaps(){
    if(user != null){
        socket.emit('getPublicMapIds', {sessionId: sessionId});
    }else{
        alert("You must login/register.");
    }
}

function getMapDetails(mapId){
    if(user != null){
        socket.emit('getPublicMapDetails', {sessionId: sessionId, mapId: mapId});
    }else{
        alert("You must login/register.");
    }
}

function getGetUserFriendsList(userId){
    if(user != null){
        socket.emit('getGetUserFriendsList', {sessionId: sessionId, userId: userId});
    }else{
        alert("You must login/register.");
    }
}

function getGetUserMapList(userId){
    if(user != null){
        socket.emit('getGetUserMapList', {sessionId: sessionId, userId: userId});
    }else{
        alert("You must login/register.");
    }
}

function saveMap(mapId){
    if(user != null){
        socket.emit('saveMap', {sessionId: sessionId, mapId: mapId});
    }else{
        alert("You must login/register.");
    }
}

function removeMap(mapId){
    if(user != null){
        socket.emit('removeMap', {sessionId: sessionId, mapId: mapId});
    }else{
        alert("You must login/register.");
    }
}

function deleteMap(mapId){
    if(user != null){
        socket.emit('deleteMap', {sessionId: sessionId, mapId: mapId});
    }else{
        alert("You must login/register.");
    }
}

function hostGame(){
    if(user != null){
        socket.emit('hostGame', {sessionId: sessionId, hostName: user.username});
    }else{
        alert("You must login/register.");
    }
}

function changeGameMap(newId){
    if(user != null){
        if(currGame != undefined && currGame.id != undefined){
            socket.emit('changeGameMap', {sessionId: sessionId, newId: newId});
        }else{
            console.error("You are not in a game!");
        }
    }else{
        alert("You must login/register.");
    }
}

function makePlayerHost(userId){
    if(user != null){
        if(currGame != undefined && currGame.id != undefined){
            if(user.id == currGame.hostId){
                socket.emit('makePlayerHost', {sessionId: sessionId, userId: userId});
            }else{
                console.error("You are not the host of the game!");
            }
        }else{
            console.error("You are not in a game!");
        }
    }else{
        alert("You must login/register.");
    }
}

function disconnectFromGame(){
    if(user != null){
        if(currGame != undefined){
            currGame = undefined;
            socket.emit('disconnectFromGame', {sessionId: sessionId});
        }else{
            console.error("You are not in a game!");
        }
    }else{
        alert("You must login/register.");
    }
}

function joinGame(gameId){
    if(user != null){
        socket.emit('joinGame', {sessionId: sessionId, gameId: gameId});
    }else{
        alert("You must login/register.");
    }
}

function kickPlayerFromGame(userId){
    if(user != null){
        if(currGame != undefined){
            if(user.id == currGame.hostId){
                socket.emit('kickPlayerFromGame', {sessionId: sessionId, userId: userId});
            }else{
                console.error("You are not the host of the game!");
            }
        }else{
            console.error("You are not in a game!");
        }
    }else{
        alert("You must login/register.");
    }
}

function startGame(gameId, players){
    if(user != null){
        if(currGame != undefined){
            if(user.id == currGame.hostId){
                socket.emit('startGame', {sessionId: sessionId, gameId: gameId, players: players});
            }else{
                console.error("You are not the host of the game!");
            }
        }else{
            console.error("You are not in a game!");
        }
    }else{
        alert("You must login/register.");
    }
}

function endGame(gameId, players){
    if(user != null){
        if(currGame != undefined){
            if(user.id == currGame.hostId){
                socket.emit('endGame', {sessionId: sessionId, gameId: gameId, players: players});
            }else{
                console.error("You are not the host of the game!");
            }
        }else{
            console.error("You are not in a game!");
        }
    }else{
        alert("You must login/register.");
    }
}

function saveVariables(mapId, newVariables, newIdCount){
    if(user != null){
        socket.emit('saveVariables', {sessionId: sessionId, id: mapId, newVariables: newVariables, newIdCount: newIdCount});
    }else{
        alert("You must login/register.");
    }
}

function saveEvents(mapId, newEvents, newIdCount){
    if(user != null){
        socket.emit('saveEvents', {sessionId: sessionId, id: mapId, newEvents: newEvents, newIdCount: newIdCount});
    }else{
        alert("You must login/register.");
    }
}

function saveObjects(mapId, newObjects, newIdCount){
    if(user != null){
        socket.emit('saveObjects', {sessionId: sessionId, id: mapId, newObjects: newObjects, newIdCount: newIdCount});
    }else{
        alert("You must login/register.");
    }
}

function changeObjectRotation(mapId, objectId, newRotation){
    if(user != null){
        socket.emit('changeObjectRotation', {sessionId: sessionId, id: mapId, objectId: objectId, newRotation: newRotation});
    }else{
        alert("You must login/register.");
    }
}

function changeObjectColor(mapId, objectId, newColor, colorR, colorG, colorB){
    if(user != null){
        socket.emit('changeObjectColor', {sessionId: sessionId, id: mapId, objectId: objectId, newColor: newColor, colorR: colorR, colorG: colorG, colorB: colorB});
    }else{
        alert("You must login/register.");
    }
}

function changeObjectSize(mapId, objectId, newSize){
    if(user != null){
        socket.emit('changeObjectSize', {sessionId: sessionId, id: mapId, objectId: objectId, newSize: parseFloat(newSize)});
    }else{
        alert("You must login/register.");
    }
}

function removeObjectTag(){
    if(user != null){
        socket.emit('removeObjectTag', {sessionId: sessionId, id: map.currMap.id, theTag: currTag});
    }else{
        alert("You must login/register.");
    }
}

function setAsLoaded(){
    if(user != null){
        socket.emit('loadedGame', {sessionId: sessionId});
    }else{
        alert("You must login/register.");
    }
}

//listen with sockets for server
socket.on('error', (msg) => {
    let response = msg; //JSON.parse(msg);

    console.error(response);
});

socket.on('receivedCurrMapId', (msg) => {
    if(user != null){
        //let response = JSON.parse(msg);
        let response = msg;

        if(map.setId(response.object.id)){
            //loadedMaps[response.id] = map.currMap;
            
            user.mapIds[response.object.id] = response.object.name;
        }
        loadMap(response.object.id);
    }else{
        alert("You must login/register.");
    }
});

socket.on('receivedFriendInfo', (msg) => {
    if(user != null){
        //let response = JSON.parse(msg);
        let response = msg;

        let thisFriend = response.object;
        loadedPlayers[thisFriend.id] = thisFriend;
    }else{
        alert("You must login/register.");
    }
});

socket.on('receivedMapDisplayInfo', (msg) => {
    if(user != null){
        //let response = JSON.parse(msg);
        let response = msg;

        let thisMap = new Map();
        updateObj(thisMap, response.object);
        if(thisMap.id){
            loadedMaps[thisMap.id] = thisMap;

            user.mapIds[thisMap.id] = thisMap;
        }
    }else{
        alert("You must login/register.");
    }
});

socket.on('recievedWholeMap', (msg) => {
    if(user != null){
        //let response = JSON.parse(msg);
        let response = msg;

        let thisMap = new Map();
        updateObj(thisMap, response.object);
        for(let key in thisMap.units){
            let theUnit = thisMap.units[key];
            theUnit.z = theUnit.z;
            theUnit.materials = theUnit.materials;
        }
        if(thisMap.id){
            loadedMaps[thisMap.id] = thisMap;
        }
        thisMap.hasLoadedInfo = true;

        if(onRecievingMap == 1){
            startEditingOnLoadMap(thisMap.id);
        }

        onRecievingMap = 0;
    }else{
        alert("You must login/register.");
    }
});

socket.on('recievedUnits', (msg) => {
    if(user != null){
        //let response = JSON.parse(msg);
        let response = msg;

        let m = map.currMap;
        if(m && m.id == response.object.mapId){
            for(let i = 0; i < response.object.units.length; i++){
                let responseUnit = response.object.units[i];
                let aUnit = m.units[responseUnit.id];
                if(!aUnit) {
                    aUnit = new Unit(responseUnit.id, responseUnit.x, responseUnit.y);
                    m.units[aUnit.id] = aUnit;
                }
                updateObj(aUnit, responseUnit);

                units.load(aUnit, optimization.lastUpdatePoint, true);
            }

            for(let i = 0; i < response.object.objects.length; i++){
                let responseObject = response.object.objects[i];
                let aObject = m.objects[responseObject.id];
                if(!aObject) {
                    aObject = new Obj(responseObject.id, responseObject.type);
                    m.objects[aObject.id] = aObject;
                }
                updateObj(aObject, responseObject);

                objects.loadObj(aObject);
            }
        }else{
            loadMap(response.object.mapid);
        }
    }else{
        alert("You must login/register.");
    }
});

socket.on('removedUnits', (msg) => {
    if(user != null){
        //let response = JSON.parse(msg);
        let response = msg;

        let m = map.currMap;
        if(m && m.id == response.object.mapId){
            for(let i = 0; i < response.object.units.length; i++){
                let responseUnitId = response.object.units[i];
                
                units.remove(m, responseUnitId);
            }

            for(let i = 0; i < response.object.objects.length; i++){
                let responseObjectId = response.object.objects[i];
                
                objects.remove(m, responseObjectId);
            }
        }else{
            loadMap(response.object.mapid);
        }
    }else{
        alert("You must login/register.");
    }
});

socket.on('onChange', (msg) => {
    let m = map.currMap;
    if((user != null) && m){
        if((msg.type == "unitAdded") || (msg.type == "objAdded")) {
            onAdded(m, msg.object);
        }
        else if(msg.type == "unitRemoved") {
            units.remove(m, msg.object);
        }
        else if(msg.type == "objRemoved") {
            objects.remove(m, msg.object);
        }
        else if(msg.type == "unitChanged") {
            let aUnit = m.units[msg.object.id];
            if(aUnit) {
                updateObj(aUnit, msg.object);
                units.load(aUnit, optimization.lastUpdatePoint, true);
            }
        }
        else if(msg.type == "objChanged") {
            let aObject = m.objects[msg.object.id];
            if(aObject) {
                updateObj(aObject, msg.object);
                objects.loadObj(aObject);

                if(aObject.tags){
                    //console.log(JSON.stringify(aObject.tags));
                    for(let key in aObject.tags){
                        let theTag = aObject.tags[key];
                        if(theTag.objId == playerId){
                            if(theTag.type == "popup"){
                                currTag = theTag;
                                diplayCanvasPopup(theTag.name, theTag.value);
                            }else if(theTag.type == "bar"){
                                diplayCanvasBarPopup(aObject[theTag.value], theTag.name);
                            }else{
                                diplayCanvasValuePopup(theTag.value);
                            }
                        }
                    }
                }
            }
        }
        //let response = JSON.parse(msg);



        // let m = map.currMap;
        // if(m && m.id == response.object.mapId){
        //     for(let i = 0; i < response.object.units.length; i++){
        //         let responseUnitId = response.object.units[i];
                
        //         units.remove(m, responseUnitId);
        //     }

        //     for(let i = 0; i < response.object.objects.length; i++){
        //         let responseObjectId = response.object.objects[i];
                
        //         objects.remove(m, responseObjectId);
        //     }
        // }else{
        //     loadMap(response.object.mapid);
        // }
    }else{
        alert("You must login/register.");
    }
});

function onAdded(m, obj) {
    if(obj.materials) {
        let aUnit = m.units[obj.id];
        if(!aUnit) {
            aUnit = new Unit(obj.id, obj.x, obj.y);
            m.units[aUnit.id] = aUnit;
        }
        updateObj(aUnit, obj);

        units.load(aUnit, optimization.lastUpdatePoint, true);
    }
    else {
        let aObject = m.objects[obj.id];
        if(!aObject) {
            aObject = new Obj(obj.id, obj.type);
            m.objects[aObject.id] = aObject;
        }
        updateObj(aObject, obj);

        objects.loadObj(aObject);
    }
}

socket.on('recievedObjList', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);
        let response = msg;

        let m = map.currMap;
        if(m){
            for(let i = 0; i < response.object.length; i++){
                onAdded(m, response.object[i]);
            }
        }
    }
});

socket.on('recievedMapConfig', (msg) => {
    console.log("recievedMapConfig");
    if(user != null){        
        //let response = JSON.parse(msg);
        let response = msg;

        let m = map.currMap;
        m.config = response.object;

        if(m.config == undefined) m.config = new Config();
        changeVariableToolLoadVariablesToTables(m.config.globalVars);

        editEventsToolLoadEventsToTables(m.config.globalEvents);
        
        editObjectsToolLoadEventsToTables(m.config.objectTypes);
    }
});

socket.on('recievedPublicGames', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);
        let response = msg.object;

        for(let key in response){
            onRecievedPublicGame(response[key]);
        }
    }
});

// socket.on('recievedPublicGame', (msg) => {
//     if(user != null){        
//         //let response = JSON.parse(msg);
//         let response = msg;

//         onRecievedPublicGame(response.object);
//     }
// });

socket.on('recievedPublicMapIds', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);
        let response = msg.object;

        for(let i = 0; i < response.length; i++){
            getMapDetails(response[i].id);
        }
    }
});

socket.on('recievedPublicMap', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);
        let response = msg;

        onRecievedPublicMap(response.object);
    }
});

socket.on('recievedUserFriend', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);
        let response = msg;

        onRecievedUserFriend(response.object);
    }
});

socket.on('recievedUserMap', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);
        let response = msg;

        onRecievedUserMap(response.object);
    }
});

socket.on('recievedGame', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);

        let theGame = msg.object;

        currGame = theGame;

        if(theGame.hostId == user.id){
            changeGameHostDisplay(theGame);
            selectCreateGameMenuMapItem(("gameMenuMapItemId_" + theGame.mapId));
        }else{
            changeGameHostDisplay(theGame);
            for(let key in theGame.players){
                if(theGame.players != undefined){
                    addJoinGameMenuPlayerItem(theGame.players[key].id, theGame.players[key].username);
                }
            }
        }
    }
});

socket.on('recievedNewGameMapId', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);

        let mapId = msg.mapId;
        let mapName = msg.mapName;

        currGame.mapId = mapId;
        currGame.mapName = mapName;

        changeJoinGameMenuMapName(mapName);
    }
});

socket.on('recievedNewGameMapId_', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);

        let mapId = msg.mapId;
        let mapName = msg.mapName;

        currGame.mapId = mapId;
        currGame.mapName = mapName;

        selectCreateGameMenuMapItem(("gameMenuMapItemId_" + mapId));
    }
});

socket.on('recievedNewUser', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);

        let userId = msg.userId;
        let username = msg.username;

        if(currGame == undefined){
            return;
        }

        if(currGame.players == undefined){
            currGame.players = [];
        }
        currGame.players[userId] = {id: userId, username: username};

        if(currGame.hostId == user.id){
            addCreateGameMenuPlayerItem(userId, username);
        }else{
            addJoinGameMenuPlayerItem(userId, username);
        }
    }
});

socket.on('removedUserFromGame', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);

        let userId = msg.userId;

        if(currGame == undefined){
            return;
        }

        if(userId != user.id){
            delete currGame.players[userId];

            if(currGame.hostId != user.id){
                if(document.getElementById("addJoinGameMenuPlayerItem_" + userId) != undefined){
                    document.getElementById("addJoinGameMenuPlayerItem_" + userId).remove();
                }
            }else{
                if(document.getElementById("addCreateGameMenuPlayerItem_" + userId) != undefined){
                    document.getElementById("addCreateGameMenuPlayerItem_" + userId).remove();
                }  
            }
        }else{
            currGame = undefined;
            toGameList();
        }
    }
});

socket.on('recievedNewHostFromGame', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);

        let newHostId = msg.userId;

        if(currGame == undefined){
            return;
        }
        
        let oldHostId = currGame.hostId;
        let oldHostName = currGame.hostName;
        let newHostName = currGame.players[newHostId].username;

        delete currGame.players[newHostId];
        currGame.hostId = newHostId;
        currGame.hostName = newHostName;
        currGame.players[oldHostId] = {id: oldHostId, username: oldHostName};

        if(newHostId != user.id){
            if(oldHostId != user.id){
                changeGameHostDisplay(currGame);
                addJoinGameMenuPlayerItem(oldHostId, oldHostName);
                if(document.getElementById("addJoinGameMenuPlayerItem_" + newHostId) != undefined){
                    document.getElementById("addJoinGameMenuPlayerItem_" + newHostId).remove();
                }
            }else{
                switchMenus("#joinGameRoomMenu", "inline-block");
                for(let key in currGame.players){
                    addJoinGameMenuPlayerItem(currGame.players[key].id, currGame.players[key].username);
                }
                changeGameHostDisplay(currGame);
            }
        }else{
            switchMenus("#createGameRoomMenu", "inline-block");
            changeGameHostDisplay(currGame);
            for(let key in currGame.players){
                addCreateGameMenuPlayerItem(currGame.players[key].id, currGame.players[key].username);
            }

            let element = document.getElementById("createGameMenuMapContainer").firstChild;
            if(element != undefined){
                let newMapId = returnOnlyNumbersFromString(element.id);
                changeGameMap(newMapId);
            }
        }
    }
});

socket.on('startLoadingGame', (msg) => {
    console.log("startedLoadingGame");
    showLoadingScreen();
    if(user != null){
        //let response = JSON.parse(msg);

        let mapId = msg.mapId;

        currGame.active = true;

        currGame.players = msg.players;
        
        currGame.loadedCount = 0;
        currGame.totalCount = Object.keys(currGame.players).length+1;
        currGame.haveILoaded = false;

        console.log("gameStarted", currGame.hostId == user.id);
        
        switchMenus(".map-edit-div", "flex");

        if(currGame.hostId != user.id){
            let theObjectId = currGame.players[user.id].objectId;

            if(theObjectId != null){
                console.log(theObjectId);
                isInPlayMode = true;
                playerId = theObjectId;
                window.camera = FreeCamera;
            }
        }

        let newMap = new Map();
        newMap.id = mapId;
        startEditingOnLoadMap(newMap);
        loadMap(mapId);
        onRecievingMap = 1;

        
        if(currGame.hostId != user.id){
            document.querySelector(".map-edit-div").querySelector(".tool-holder").style.display = "none";
            document.querySelector(".map-edit-div").querySelector(".canvas-holder").style.width = "100%";
        }else{
            document.querySelector(".map-edit-div").querySelector("#toolButtons").querySelector("button").style.display = "none";
            document.querySelector(".map-edit-div").querySelector("#toolButtonsEndGame").style.display = "inline-block";
        }
    }
});

socket.on('gameStarted', (msg) => {
    console.log("gameStarted");
    if(user != null){
        hideLoadingScreen();
    }
});

socket.on('gameEnded', (msg) => {
    console.log("gameEnded");
    if(user != null){        
        //let response = JSON.parse(msg);

        let mapId = msg.mapId;

        currGame.active = true;

        console.log("gameEnded", currGame.hostId == user.id);
        
        switchMenus("#mainMenu", "inline-block");

        currGame = undefined;

        if(map.currMap != undefined && map.currMap.id != undefined){
            socket.emit('unsubscribeForMap', {sessionId: sessionId});
        }
    }
});


socket.on('updateConfig', (msg) => {
    map.currMap.config = msg.config;

    if(map.currMap.config == undefined) map.currMap.config = new Config();
    changeVariableToolLoadVariablesToTables(map.currMap.config.globalVars);

    editEventsToolLoadEventsToTables(map.currMap.config.globalEvents);
    
    editObjectsToolLoadEventsToTables(map.currMap.config.objectTypes);
});


socket.on('alreadyLoggedIn', (msg) => {
    console.log("You are already logged in from a different device");
});

socket.on('removedObjectTag', (msg) => {
    let theTag = msg.theTag;
    
    if(theTag.type == "popup"){
        document.getElementById("canvasPopupHolder").querySelector("#canvasPopup").style.display = "none";
    }else if(theTag.type == "bar"){
        document.getElementById("canvasPopupHolder").querySelector("#canvasBarPopup").style.display = "none";
    }else{
        document.getElementById("canvasPopupHolder").querySelector("#canvasValuePopup").style.display = "none";
    }
    delete map.currMap.objects[theTag.objId].tags[theTag.name];
});


socket.on('updateLoadingCount', (msg) => {
    if(user != null){        
        //let response = JSON.parse(msg);

        if(currGame != undefined){
            currGame.loadedCount = msg.loaded;
            currGame.totalCount = msg.total;
            currGame.haveILoaded = msg.haveILoaded;
        }
    }
});