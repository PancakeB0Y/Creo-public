const {app, express, pgp, fs, db, CryptoJS} = require("./server_main.js");

//get the structures
let structures = require("./structures.js");


//USER
async function newUser(username, password){
    //Creates a new User
    let returnV = new structures.dbReturn();
    let user = new structures.User();
    let id;

    try {
        //Checks if the username is taken
        if((await db.any('Select username FROM \"user\" WHERE username = $1', [username])).length>0){
            returnV.success = false
            returnV.error = "There is already an account with that username"
            //console.log("There is already an account with that username")
        //Adds information about the user into the database
        }else {
            var rows = await db.any("INSERT INTO \"user\" (id, username, password) VALUES (nextval('ids'), $1, $2) RETURNING id", [username, password])
            id = rows[0].id
            
            returnV.success = true
            user.username = username
            user.id = id
            returnV.object = user
        }
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    //console.log(returnV);
    return returnV;
}
exports.newUser = newUser;


async function returnUser(userId){
    //userId - id of the user that you want to load (this function doesnt load the info of the user)
    let returnV = new structures.dbReturn()
    let user = new structures.User();

    try {
        var rows = await db.any('Select id, username FROM \"user\" WHERE id = $1', [userId])
        user = rows[0]
        returnV.success = true
        returnV.object = user
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    
    return returnV; //use returnUser(userId).object to get user
}
exports.returnUser = returnUser;


async function login(username, password){
    let returnV = new structures.dbReturn()
    let id
    var rows

    try {
        rows = await db.any('Select id, username, password FROM \"user\" WHERE username = $1 AND password = $2', [username, password])
        id = rows[0].id
        if(rows.length > 0){ //Checks if the username and password are correct
            let result = await returnUser(id);
            returnV.success = true
            returnV.object = result.object
        }else{
            returnV.success = false
            returnV.object = "Invalid login credentials"
            //console.log("Invalid login credentials")
        }
        
        return returnV;
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)

        //console.log("err4", returnV);
        return returnV;
    }
}
exports.login = login;


async function changeUsername(userId, newusername){
    //change the username of user

    let returnV = new structures.dbReturn()
    try {
        await db.any("UPDATE \"user\" SET username = $1 WHERE id = $2", [newusername, userId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
    }
    
    //console.log(returnV)
    return returnV;
}
exports.changeUsername = changeUsername;


async function changePassword(userId, oldPassword, newPassword){
    //change the password of user

    let returnV = new structures.dbReturn()
    try {
        if((await db.any('Select password FROM \"user\" WHERE password = $1 AND id = $2', [oldPassword, userId])).length>0){
            await db.any("UPDATE \"user\" SET password = $1 WHERE id = $2", [newPassword, userId])
            returnV.success = true
        }else{
            returnV.success = false
            returnV.error = "Old password is incorrect"
        }
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
    }

    //console.log(returnV)
    return returnV;
}
exports.changePassword = changePassword;



//MAP
async function newMap(creatorId, name, json){
    //Creates a new map
    let returnV = new structures.dbReturn();
    let map = new structures.Map();
    let id;

    try {
        var rows = await db.any("INSERT INTO \"map\" (id, creator_id, times_played, name, public, json, deleted) VALUES (nextval('ids'), $1, 0, $2, false, $3, false) RETURNING id", [creatorId, name, json])
        id = rows[0].id
        
        returnV.success = true
        map.id = id
        map.creatorId = creatorId
        map.timesPlayed = 0;
        map.name = name
        map.public = false
        map.json = json
        map.deleted = false


        returnV.object = map;
        returnV.success = true
        
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    
    //console.log(returnV);
    return returnV;
}
exports.newMap = newMap;


async function removeMap(mapId){
    //removes map from database
    let returnV = new structures.dbReturn()

    try {
        await db.any('UPDATE \"map\" SET deleted=true WHERE id = $1;', [mapId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    
    //console.log(returnV);
    return returnV;
}
exports.removeMap = removeMap;


async function returnMap(mapId){
    //returns the map with corresponding id
    let returnV = new structures.dbReturn()

    try {
        var rows = await db.any('Select * FROM \"map\" WHERE id = $1', [mapId])
        returnV.object = rows[0];
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    //console.log(returnV);
    return returnV;
}
exports.returnMap = returnMap;


async function updateMap(mapId, name, timesPlayed, public, json){
    //updates information about the map
    let returnV = new structures.dbReturn()

    try {
        if(name == null || timesPlayed == null || public == null || json == null){
            var rows = await db.any('Select * FROM \"map\" WHERE id = $1', [mapId])

            if(name == null){
                name = rows[0].name

            }
            if(timesPlayed == null){
                timesPlayed = rows[0].times_played

            }
            if(public == null){
                public = rows[0].public

            }
            if(json == null){
                json = rows[0].json

            }
        }
        await db.any('UPDATE \"map\" SET times_played=$1, name=$2, public=$3, json=$4 WHERE id = $5;', [timesPlayed, name, public, json, mapId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    //console.log(returnV);
    return returnV;
}
exports.updateMap = updateMap;


async function getPublicMapIds(){
    //returns an array of the maps that are public (that can be saved and previewed)
    let returnV = new structures.dbReturn()

    try {
        var maps = await db.any('Select id FROM \"map\" WHERE public = true')
        returnV.success = true
        returnV.object = maps
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    
    //console.log(returnV)
    return returnV; //use getActiveGameIds.object to get games
    
}
exports.getPublicMapIds = getPublicMapIds;


async function returnCreatorMaps(userId){
    //returns an array of the maps made by a user
    let returnV = new structures.dbReturn()

    try {
        var maps = await db.any('Select id FROM \"map\" WHERE creator_id = $1 AND deleted = false', [userId])
        returnV.success = true
        returnV.object = maps
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    
    //console.log(returnV)
    return returnV; 
    
}
exports.returnCreatorMaps = returnCreatorMaps;



//GAME
async function newGame(hostId, players, mapId){
    //Creates a new Game
    let returnV = new structures.dbReturn();
    let game = new structures.Game();
    let id;

    try {
        var rows = await db.any("INSERT INTO \"game\" (id, host_id, players, map_id, active) VALUES (nextval('ids'), $1, $2, $3, false) RETURNING id", [hostId, players, mapId])
        await db.any("UPDATE \"map\" SET times_played = times_played + 1 WHERE id = $1", [mapId])
        id = rows[0].id
        
        returnV.success = true
        game.hostId = hostId
        game.players = players
        game.id = id
        game.mapId = mapId
        returnV.object = game
        
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    
    return returnV;
}
exports.newGame = newGame;


async function removeGame(gameId){
    //removes game from database
    let returnV = new structures.dbReturn()

    try {
        await db.any("DELETE FROM \game\" WHERE id = $1", [gameId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    
    //console.log(returnV);
    return returnV;
}
exports.removeGame = removeGame;


async function returnGame(gameId){
    //returns the game with corresponding id
    let returnV = new structures.dbReturn()

    try {
        var rows = await db.any('Select * FROM \"game\" WHERE id = $1', [gameId])
        returnV.object = rows[0];
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    //console.log(returnV);
    return returnV;
}
exports.returnGame = returnGame;


async function updateGame(gameId, hostId, players, mapId, active){
    //updates information about the game
    let returnV = new structures.dbReturn()

    try {
        if(hostId == null || mapId == null || players == null || active == null){
            var rows = await db.any('Select * FROM \"game\" WHERE id = $1', [gameId])

            if(hostId == null){
                hostId = rows[0].host_id
            }
            if(mapId == null){
                mapId = rows[0].map_id
            }
            if(players == null){
                players = rows[0].players
                players = players.map(e=>parseInt(e));
            }
            if(active == null){
                active = rows[0].active
            }
        }
        await db.any('UPDATE \"game\" SET host_id=$1, players=$2, map_id=$3, active=$4 WHERE id = $5;', [hostId, players, mapId, active, gameId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    //console.log(returnV);
    return returnV;
}
exports.updateGame = updateGame;


async function getActiveGameIds(){
    //returns an array of the games that players can join
    let returnV = new structures.dbReturn()

    try {
        var games = await db.any('Select id FROM \"game\" WHERE active = true')
        returnV.success = true
        returnV.object = games
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        //console.log(error)
    }
    
    //console.log(returnV)
    return returnV; //use getActiveGameIds.object to get games
    
}
exports.getActiveGameIds = getActiveGameIds;



//FRIENDS
async function addFriend(userId1, userId2){
    //makes 2 users friends
    let returnV = new structures.dbReturn()

    try {
        await db.any("INSERT INTO \"friends\" (friend_id1, friend_id2) VALUES ($1, $2)", [userId1, userId2])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV;
}
exports.addFriend = addFriend;


async function removeFriend(userId1, userId2){
    //removes friend from user
    let returnV = new structures.dbReturn()

    try {
        if((await db.any('Select friend_id2 FROM \"friends\" WHERE friend_id1 = $1 AND friend_id2 = $2', [userId1, userId2])).length>0){
            await db.any("DELETE FROM friends WHERE friend_id1 = $1 AND friend_id2 = $2", [userId1, userId2])
        }else (returnV.object = 'These users are not friends')
        
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    ///console.log(returnV)
    return returnV;
}
exports.removeFriend = removeFriend;


async function returnFriends(userId){
    //userId - id of the user that you want to load (this function doesnt load the info of the user)
    let returnV = new structures.dbReturn()

    try {
        var friends = await db.any('Select friend_id2 FROM \"friends\" WHERE friend_id1 = $1', [userId])
        returnV.object = friends
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    //console.log(returnV)
    return returnV; //use returnFriends(userId).object to get friends
}
exports.returnFriends = returnFriends;


async function areUsersFriends(userId1, userId2){
    //checks if 2 users are friends
    let returnV = new structures.dbReturn()

    try {
        if((await db.any('Select friend_id2 FROM \"friends\" WHERE friend_id1 = $1 AND friend_id2 = $2', [userId1, userId2])).length>0){
            returnV.object = true
        }else{returnV.object = false}
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    //console.log(returnV)
    return returnV; //use areUsersFriends(userId1, userId2).object to get boolean
}
exports.areUsersFriends = areUsersFriends;



//USER_MAP
async function addMapToUser(userId, mapId){
    //adds map to user_map
    let returnV = new structures.dbReturn()

    try {
        await db.any("INSERT INTO user_map (user_id, map_id) VALUES ($1, $2)", [userId, mapId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV;
}
exports.addMapToUser = addMapToUser;


async function removeMapFromUser(userId, mapId){
    //removes map from user_map
    let returnV = new structures.dbReturn()

    try {
        if((await db.any('Select map_id FROM \"user_map\" WHERE user_id = $1 AND map_id = $2', [userId, mapId])).length>0){
            await db.any("DELETE FROM user_map WHERE user_id = $1 AND map_id = $2", [userId, mapId])
        }else(returnV.object = 'This map does not belong to this users')
        
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV;
}
exports.removeMapFromUser = removeMapFromUser;


async function returnUserMaps(userId){
    //userId - id of the user that you want to load (this function doesnt load the info of the user)
    let returnV = new structures.dbReturn()

    try {
        var maps = await db.any('Select map_id FROM \"user_map\" WHERE user_id = $1', [userId])
        returnV.success = true
        returnV.object = maps
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV; //use returnUserMaps(userId).object to get maps
}
exports.returnUserMaps = returnUserMaps;


async function doesMapBelongToUser(userId, mapId){
    //checks if a map belongs to a user
    let returnV = new structures.dbReturn()

    try {
        if((await db.any('Select map_id FROM \"user_map\" WHERE user_id = $1 AND map_id = $2', [userId, mapId])).length>0){
            returnV.object = true
        }else{returnV.object = false}
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    //console.log(returnV)
    return returnV; //use doesMapBelongToUser(userId, mapId).object to get boolean
}
exports.doesMapBelongToUser = doesMapBelongToUser;

async function doesMapBelongToCreator(creatorId, mapId){
    //checks if a map belongs to a user
    let returnV = new structures.dbReturn()

    try {
        if((await db.any('Select id FROM \"map\" WHERE creator_id = $1 AND id = $2', [creatorId, mapId])).length>0){
            returnV.object = true
        }else{returnV.object = false}
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    //console.log(returnV)
    return returnV; //use doesMapBelongToCreator(creatorId, mapId).object to get boolean
}
exports.doesMapBelongToCreator = doesMapBelongToCreator;


//USER_HISTORY
async function addMapToHistory(userId, mapId){
    //adds map to user_history
    let returnV = new structures.dbReturn()

    try {
        var rows = await db.any("INSERT INTO user_history (user_id, map_id) VALUES ($1, $2)", [userId, mapId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV;
}
exports.addMapToHistory = addMapToHistory;


async function removeMapFromHistory(userId, mapId){
    //removes map from user_history
    let returnV = new structures.dbReturn()

    try {
        await db.any("DELETE FROM user_history WHERE user_id = $1 AND map_id = $2", [userId, mapId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV;
}
exports.removeMapFromHistory = removeMapFromHistory;


async function returnHistory(userId){
    //userId - id of the user that you want to load (this function doesnt load the info of the user)
    let returnV = new structures.dbReturn()

    try {
        var history = await db.any('Select map_id FROM \"user_history\" WHERE user_id = $1', [userId])
        returnV.success = true
        returnV.object = history
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV; //use returnHistory(userId).object to get history
}
exports.returnHistory = returnHistory;



//UNIT
async function newUnit(x, y, z, materials){
    //Creates a new Unit
    let returnV = new structures.dbReturn();
    let unit = new structures.Unit();
    let id;

    try {
        var rows = await db.any("INSERT INTO \"unit\" (id, x, y, z, materials) VALUES (nextval('ids'), $1, $2, $3, $4) RETURNING id", [x, y, z, materials])
        id = rows[0].id
        
        returnV.success = true
        unit.id = id
        unit.x = x
        unit.y = y
        unit.z = z
        unit.materials = materials
        returnV.object = unit
        
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV;
}
exports.newUnit = newUnit;


async function removeUnit(unitId){
    //removes unit from database
    let returnV = new structures.dbReturn()

    try {
        await db.any("DELETE FROM \"unit\" WHERE id = $1", [unitId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    //console.log(returnV);
    return returnV;
}
exports.removeUnit = removeUnit;


async function returnUnit(unitId){
    let returnV = new structures.dbReturn()

    try {
        var unit = await db.any('Select * FROM \"unit\" WHERE id = $1', [unitId])
        returnV.success = true
        returnV.object = unit
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV; //use returnUnit(unitId).object to get unit
}
exports.returnUnit = returnUnit;


async function updateUnit(unitId, x, y, z, materials){
    //updates information about a unit
    let returnV = new structures.dbReturn()

    try {
        if(x == null || y == null || z == null || materials == null){
            var rows = await db.any('Select * FROM \"unit\" WHERE id = $1', [unitId])

            if(x == null){
                x = rows[0].x

            }
            if(y == null){
                y = rows[0].y

            }
            if(z == null){
                z = rows[0].z

            }
            if(materials == null){
                materials = rows[0].materials

            }
        }
        
        await db.any('UPDATE \"unit\" SET x=$1, y=$2, z=$3, materials=$4 WHERE id = $5;', [x, y, z, materials, unitId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    //console.log(returnV);
    return returnV;
}
exports.updateUnit = updateUnit;


async function returnMapUnits(mapId){
    let returnV = new structures.dbReturn()

    try {
        var units = await db.any('Select * FROM \"unit\" WHERE map_id = $1', [mapId])
        returnV.success = true
        returnV.object = units
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV; //use returnUnit(unitId).object to get units
}
exports.returnMapUnits = returnMapUnits;



//OBJECT
async function newObject(type, x, y, z, rotation, colorChange){
    //Creates a new Object
    let returnV = new structures.dbReturn();
    let object = new structures.Object();
    let id;

    try {
        var rows = await db.any("INSERT INTO \"object\" (id, type, x, y, z, rotation, color_change) VALUES (nextval('ids'), $1, $2, $3, $4, $5, $6) RETURNING id", [type, x, y, z, rotation, colorChange])
        id = rows[0].id
        
        returnV.success = true
        object.id = id
        object.type = type
        object.x = x
        object.y = y
        object.z = z
        object.rotation = rotation
        object.colorChange = colorChange
        returnV.object = object
        
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV;
}
exports.newObject = newObject;


async function removeObject(objectId){
    //removes object from database
    let returnV = new structures.dbReturn()

    try {
        await db.any("DELETE FROM \"object\" WHERE id = $1", [objectId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    //console.log(returnV);
    return returnV;
}
exports.removeObject = removeObject;


async function returnObject(objectId){
    let returnV = new structures.dbReturn()

    try {
        var object = await db.any('Select * FROM \"object\" WHERE id = $1', [objectId])
        returnV.success = true
        returnV.object = object
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV; //use returnObject(objectId).object to get object
}
exports.returnObject = returnObject;


async function updateObject(objectId, type, x, y, z, rotation, colorChange){
    //updates information about an object
    let returnV = new structures.dbReturn()

    try {
        if(type == null || x == null || y == null || z == null || rotation == null || colorChange == null){
            var rows = await db.any('Select * FROM \"object\" WHERE id = $1', [objectId])

            if(type == null){
                type = rows[0].type

            }
            if(x == null){
                x = rows[0].x

            }
            if(y == null){
                y = rows[0].y

            }
            if(z == null){
                z = rows[0].z

            }
            if(rotation == null){
                rotation = rows[0].rotation

            }
            if(colorChange == null){
                colorChange = rows[0].colorChange

            }
        }
        
        await db.any('UPDATE \"object\" SET type=$1 x=$2, y=$3, z=$4, rotation=$5, color_change=$6 WHERE id = $7;', [type, x, y, z, rotation, colorChange, objectId])
        returnV.success = true
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    //console.log(returnV);
    return returnV;
}
exports.updateObject = updateObject;

async function returnMapObjects(mapId){
    let returnV = new structures.dbReturn()

    try {
        var objects = await db.any('Select * FROM \"object\" WHERE map_id = $1', [mapId])
        returnV.success = true
        returnV.object = objects
    } 
    catch (error) {
        returnV.success = false
        returnV.error = error
        console.log(error)
    }
    
    return returnV; //use returnUnit(unitId).object to get objects
}
exports.returnMapObjects = returnMapObjects;