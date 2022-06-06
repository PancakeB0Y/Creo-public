const {app, express, /*pgp, db,*/ session, io,/* aws_crypto,*/ CryptoJS, ios, http, https, /*nodemailer, transporter, email,*/ httpL} = require("./server_main.js");
const serverMain = require("./server_main.js");
const port = 3000
const path = require("path");

//get the tree for the game map
let tree = require("./Tree.js");

//get the structures
let structures = require("./structures.js");

//get the database comunication functions
let dbFunctions = require("./databaseFunctions.js");

app.use(express.static('public'));
app.use(express.json());

//makes folder "client" accesable by client
app.use(express.static(path.join(__dirname, '/../client')));

//get additional functions
let additionalFunctions = require("../client/additionalFunctions_Variables.js");

//get object functions
let objects = require("./objects.js");

//get units functions and variables
let units = require("./units.js");

//get map functions and variables
let map = require("./map.js");

//get life game functions
let lg = require("./LiveGame.js");

//get the game map comunication functions
let gameMap = require("./GameMap.js");
const { FORMERR } = require("dns");
const { Console } = require("console");


var MemoryStore = require('memorystore')(session);

var store = new MemoryStore({
	checkPeriod: 86400000 // prune expired entries every 24h
});

//add sessions
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }, // сложи го на true когато пуснем https-а
	store: store
}))

//variables
let sessionIdToUserId = {}; //key - sessionId, value - userId
let userIdToSockets = {}; //from user id to socket array

userIdToSockets = serverMain.userIdToSockets; //from user id to socket array

let games = {}; //a object that returns game from gameId
let publicGames = {}; //key - gameId, value - object{gameHost, gameMapName}
let brGames = 1; //this number is used to give the games ids

let userIdToGameId = {}; //object with key - user id and value - gameId

var maps = {}; //id to parsed map content (units, objects, etc.)
var mapIdToExpiration = {}; //id to a intager (the intager resets when a map is interacted
							//with and the map object on the server is deletet when the intager reaches 0)
let timeBeforeExpiration = 10000 * 100; //500 seconds
exports.maps = maps;
exports.mapIdToExpiration = mapIdToExpiration;

var generateToken = function() { // generates a verification token
	return Math.random().toString(36).substr(2); // remove `0.`
}

function encodeQueryData(data) { // used to generate a get request link
	const ret = [];
	for (let d in data)
	  ret.push(encodeURIComponent(data[d]));
	return ret.join('/');
 }

 function subtractDtes(date1, date2){ // returns the difference in time between the dates in miliseconds
	return Math.abs(date1 - date2);
 }

const generatorKeyId = 'arn:aws:kms:eu-central-1:234133237098:alias/messages_key';
const keyIds = ['arn:aws:kms:eu-central-1:234133237098:key/81bbb404-3ce1-4d5c-92e8-81b5970a3219'];

//na survura trqbva da se kachat credentiali ~/.aws/credentials
// const keyring = new aws_crypto.KmsKeyringNode({ generatorKeyId, keyIds });

// const { encrypt, decrypt } = aws_crypto.buildClient(
//   aws_crypto.CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
// )
const context = {
  purpose: 'database encryption',
  origin: 'eu-central-1'
}

let key;

async function decryptKey(encryptedText) {
    try {
        const { plaintext, messageHeader } = await decrypt(keyring, encryptedText);
        return plaintext;
    } catch (err){
        console.log(err);
    }
};
function fromBytesToString(bytes) {
    let string = "";
    for (let i = 0; i < bytes.length; i++) {
        string+= String.fromCharCode(bytes[i]);
    }
    return string;
};
function encryptText(text) {
    return CryptoJS.AES.encrypt(text, key).toString();
};
function decryptText(text) {
    return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
};

function checkUserState(userId){
	let currStatus = 0;
	let theGame, returnGame;

	if(userIdToGameId[userId] != undefined && games[userIdToGameId[userId]].active == true){
		currStatus = 1;
		theGame = games[userIdToGameId[userId]];
		returnGame = new structures.ReturnGame(theGame.id, theGame.hostId, theGame.players, theGame.mapId, theGame.activeMapId, theGame.active);
	}
	
	return {
				state: currStatus, //0-not doing anything, 1 - in game
				game: returnGame, //if the user is in a game
			}
}

function checkIfAllPlayersHaveDisconnected(theGame){
	if(!theGame.hasHostDisconnected){
		return false;
	}

	for(key in theGame.players){
		let player = theGame.players[key];

		if(!player.hasDisconnected){
			return false;
		}
	}

	return true;
}

//process the requests that the client sends

app.get('/node_modules/socket.io/client-dist/socket.io.js', (req, res) => {
	res.sendFile(__dirname + '/../node_modules/socket.io/client-dist/socket.io.js');
});

// app.get('/verify/:id/:token', (req, res) => {
// 	dbFunctions.verifyUser(req.params.token, req.params.id)
// 	.then(function (dbReturn){
// 		if(dbReturn.success){
// 			res.sendFile(path.resolve(__dirname + '/../client/index.html'));
// 		}
// 	});
// });

app.post('/createUser', (req, res) => {
	if(!req.body.username || (req.body.username.length > 16)) {
		res.json({success:false, error:"Invalid username!"});
		return;
	}

	dbFunctions.newUser(req.body.username, req.body.password).then(function (dbReturn){
		if(dbReturn.success == false){
			res.json({success: false, error: newUser.error});
		}else{
			let newUser = dbReturn.object;
			req.session.userId = parseInt(newUser.id);
			sessionIdToUserId[req.session.id] = req.session.userId;
			newUser.sessionId = req.session.id;
			res.json({success: true, object: newUser});
		}
	});
});

app.post('/login', (req, res) => {
	dbFunctions.login(req.body.username, req.body.password).then(function (dbReturn){
		if(dbReturn.success == false){
			res.json({success: false, error: dbReturn.error});
		}else{
			let theUser = dbReturn.object;
			let state = checkUserState(theUser.id);
			if(state.state == 1){
				theGame = games[state.game.id];
				if(theGame.hostId == theUser.id){
					theGame.hasHostDisconnected = false;
				}else{
					theGame.players[theUser.id].hasDisconnected = false;
				}
			}
			req.session.userId = parseInt(theUser.id);
			sessionIdToUserId[req.session.id] = req.session.userId;
			theUser.sessionId = req.session.id;
			res.json({success: true, object: theUser, state: state});
		}
	});
});

app.post('/tryReconnectingToSession', async (req, res) => {
	if(req.body.sessionId == undefined){ res.json({success: false, error: "Invalid session id."}); return; }

	let userId = sessionIdToUserId[req.body.sessionId];
	if(userId == undefined){ res.json({success: false, error: "Invalid session id."}); return; }

	req.session.userId = userId;

	let state = checkUserState(userId);
	let theUser = await dbFunctions.returnUser(userId);
	if(theUser.success){
		theUser = theUser.object;
	}else{
		res.json({success: false, error: "User not found."});
		return;
	}

	res.json({success: true, object: theUser, state: state});
});

app.post('/getUser', (req, res) => {
	dbFunctions.returnUser(req.body.userId).then(function (dbReturn){
		if(dbReturn.success == false){
			res.json({success: false, error: dbReturn.error});
		}else{
			let theUser = new structures.User();
			additionalFunctions.updateObjByListOfKeys(theUser, dbReturn.object, ["id", "username"]);
			res.json({success: true, object: theUser});
		}
	});
});


// //socket comunication
function onConnection(socket){
	let subscription = undefined;
	let subscribedMap = undefined;

	socket.on('authenticate', async (msg) => {
		msg = JSON.parse(msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				socket.__userId = session.userId;
				if(!userIdToSockets[session.userId]){
					userIdToSockets[session.userId] = [];
				}
				userIdToSockets[session.userId].push(socket);

				// if(userIdToSockets[session.userId] = socket){
				// 	serverMain.emitToUser(session.userId, 'alreadyLoggedIn', { });
				
					
				// }
			}
		});
	});

	socket.on('createMap', async (msg) => {
		if(!socket.__userId) return null;

		dbFunctions.newMap(socket.__userId, msg.object.name, JSON.stringify("")).then(async function (dbReturn){
			if(dbReturn.success == false){
				socket.emit("error", {success: false, error: dbReturn.error});
			}else{
				socket.emit('receivedCurrMapId', {object: dbReturn.object});

				let theMap = new gameMap.GameMap(dbReturn.object.id, dbReturn.object.name);

				maps[dbReturn.object.id] = theMap;
				mapIdToExpiration[dbReturn.object.id] = timeBeforeExpiration;

				units.newUnit(maps[dbReturn.object.id], undefined, undefined);

				let toSaveMap = new structures.MapJson(maps[dbReturn.object.id].id, maps[dbReturn.object.id].name, maps[dbReturn.object.id].idToObj, maps[dbReturn.object.id].idToUnit, maps[dbReturn.object.id].lastId, maps[dbReturn.object.id].totalUnitIds);

				await dbFunctions.updateMap(parseInt(dbReturn.object.id), dbReturn.object.name, dbReturn.object.timesPlayed, dbReturn.object.public, JSON.stringify(toSaveMap));

				// await dbFunctions.updateMap(key, dbReturn.object.name, dbReturn.object.timesPlayed, dbReturn.object.public, JSON.stringify(toSaveMap));
			}
		});
	});

// 	socket.on('getFriendInfo', async (msg) => {
// 		msg = JSON.parseasync (msg);

// 		store.get(msg.sessionId, (error, session) => {
// 			if(session && session.userId){
// 				if(users[msg.id]){
// 					let theObject = {id: users[msg.id].id, username: users[msg.id].username};
// 					for(let i = 0; i < userIdToSockets[session.userId].length; i++){
// 						userIdToSockets[session.userId][i].emit('receivedFriendInfo', {object: theObject});
// 					}
// 				}else{
// 					for(let i = 0; i < userIdToSockets[session.userId].length; i++){
// 						userIdToSockets[session.userId][i].emit('error', {error: "A user with this id does not exist."});
// 					}
// 				}
// 			}
// 		});
// 	});

	socket.on('getMapDisplayInfo', async (msg) => {
		msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			let theUser;
			dbFunctions.returnUser(req.body.userId).then(function (dbReturn){
				if(session && session.userId){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						theUser = dbReturn.object;
					}
				}
			});
			if(theUser.mapIds[msg.id]){
				dbFunctions.returnMap(req.body.userId).then(function (dbReturn_){
					if(dbReturn_.success == false){
						socket.emit('error', {object: dbReturn_.error});
					}else{
						socket.emit('receivedMapDisplayInfo', {object: dbReturn_.object});
					}
				});
			}
		});
	});

	socket.on('getPublicGames', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				socket.emit('recievedPublicGames', {object: publicGames});
			}
		});
	});

	socket.on('getPublicGameDetails', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				dbFunctions.returnGame(msg.gameId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						let theGame = dbReturn.object;

						dbFunctions.returnMap(theGame.map_id).then(function (dbReturn_){
							if(dbReturn_.success == false){
								socket.emit('error', {object: dbReturn_.error});
							}else{
								theGame.map_name = dbReturn_.object.name;

								dbFunctions.returnUser(theGame.host_id).then(function (dbReturn__){
									if(dbReturn__.success == false){
										socket.emit('error', {object: dbReturn__.error});
									}else{
										theGame.host_name = dbReturn__.object.username;

										socket.emit('recievedPublicGame', {object: dbReturn.object});
									}
								});
							}
						});
					}
				});
			}
		});
	});

	// function reg(message, requiresSession, func) {
	// 	socket.on(message, async (msg) => {
	// 		if(msg && msg.sessionId) {
	// 			store.get(msg.sessionId, (error, session) => {
	// 				if(session || !requiresSession) {
	// 					try {
	// 						func(msg, session);
	// 					}
	// 					catch(e) {
	// 						console.log(e);
	// 					}
	// 				}
	// 			});
	// 		}
	// 		else if(!requiresSession) {
	// 			try {
	// 				func(msg);
	// 			}
	// 			catch(e) {
	// 				console.log(e);
	// 			}
	// 		}
	// 	});
	// }

	// reg('getPublicMapIds', true, async (msg, session) => {
	// });

	socket.on('getPublicMapIds', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				dbFunctions.getPublicMapIds().then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						socket.emit('recievedPublicMapIds', {object: dbReturn.object});
					}
				});
			}
		});
	});

	socket.on('getPublicMapDetails', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				dbFunctions.returnMap(msg.mapId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						let theMap = dbReturn.object;
						if(theMap.public == true){
							dbFunctions.returnUser(theMap.creator_id).then(function (dbReturn_){
								if(dbReturn_.success == false){
									socket.emit('error', {object: dbReturn_.error});
								}else{
									theMap.host_name = dbReturn_.object.username;
									socket.emit('recievedPublicMap', {object: theMap});
								}
							});
						}else{
							socket.emit('error', {object: "The map you requested is not public."});
						}
					}
				});
			}
		});
	});

	socket.on('getGetUserFriendsList', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				dbFunctions.returnFriends(msg.userId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						let friends = dbReturn.object;
						for(let i = 0; i < friends.length; i++){
							dbFunctions.returnUser(friends[i].friend_id2).then(function (dbReturn_){
								if(dbReturn_.success == false){
									socket.emit('error', {object: dbReturn_.error});
								}else{
									socket.emit('recievedUserFriend', {object: {id: friends[i].friend_id2, username: dbReturn_.username}});
								}
							});
						}
					}
				});
			}
		});
	});

	socket.on('getGetUserMapList', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				dbFunctions.returnCreatorMaps(msg.userId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						let maps = dbReturn.object;
						for(let i = 0; i < maps.length; i++){
							dbFunctions.returnMap(maps[i].id).then(function (dbReturn_){
								if(dbReturn_.success == false){
									socket.emit('error', {object: dbReturn_.error});
								}else{
									let theMap = dbReturn_.object;
									socket.emit('recievedUserMap', {object: theMap});
								}
							});
						}
					}
				});
				dbFunctions.returnUserMaps(msg.userId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						let maps = dbReturn.object;
						for(let i = 0; i < maps.length; i++){
							dbFunctions.returnMap(maps[i].map_id).then(function (dbReturn_){
								if(dbReturn_.success == false){
									socket.emit('error', {object: dbReturn_.error});
								}else{
									let theMap = dbReturn_.object;
									dbFunctions.returnUser(theMap.creator_id).then(function (dbReturn__){
										if(dbReturn__.success == false){
											socket.emit('error', {object: dbReturn__.error});
										}else{
											theMap.creator = dbReturn__.object.username;
											socket.emit('recievedUserMap', {object: theMap});
										}
									});
								}
							});
						}
					}
				});
			}
		});
	});

	socket.on('saveMap', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				dbFunctions.addMapToUser(session.userId, msg.mapId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						dbFunctions.returnMap(msg.mapId).then(function (dbReturn_){
							if(dbReturn_.success == false){
								socket.emit('error', {object: dbReturn_.error});
							}else{
								let theMap = dbReturn_.object;
								dbFunctions.returnUser(theMap.creator_id).then(function (dbReturn__){
									if(dbReturn__.success == false){
										socket.emit('error', {object: dbReturn__.error});
									}else{
										theMap.creator = dbReturn__.object.username;
										socket.emit('recievedUserMap', {object: theMap});
									}
								});
							}
						});
					}
				});
			}
		});
	});

	socket.on('removeMap', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				dbFunctions.removeMapFromUser(session.userId, msg.mapId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}
				});
			}
		});
	});

	socket.on('deleteMap', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				dbFunctions.doesMapBelongToCreator(session.userId, msg.mapId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						if(!dbReturn.object){
							return;
						}
					}
				});

				dbFunctions.removeMap(msg.mapId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}
				});
			}
		});
	});

	socket.on('hostGame', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				let newGame = new structures.Game();
				newGame.id = brGames;
				brGames++;
				newGame.hostId = session.userId;
				userIdToGameId[session.userId] = newGame.id;
				dbFunctions.returnCreatorMaps(session.userId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						let maps = dbReturn.object;
						if(maps.length > 0){
							newGame.mapId = maps[0].id;
							newGame.active = false;
							games[newGame.id] = newGame;

							dbFunctions.returnMap(maps[0].id).then(function (dbReturn_){
								if(dbReturn_.success == false){
									socket.emit('error', {object: dbReturn_.error});
								}else{
									let theMap = dbReturn_.object;
									games[newGame.id].mapName = theMap.name;
									games[newGame.id].hostName = msg.hostName;
									publicGames[newGame.id] = {gameId:newGame.id, gameHost: msg.hostName, mapName: theMap.name};
									socket.emit('recievedGame', {object: newGame});
								}
							});
						}else{
							newGame.active = false;
							games[newGame.id] = newGame;

							publicGames[newGame.id] = {gameId:newGame.id, gameHost: msg.hostName};
							socket.emit('recievedGame', {object: newGame});
						}
					}
				});
			}
		});
	});

	socket.on('changeGameMap', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				if(userIdToGameId[session.userId] == undefined){
					socket.emit('error', {object: "You are not in a game!"});
					return;
				}

				let gameId = userIdToGameId[session.userId];
				let newMapId = msg.newId;

				if(games[gameId].hostId != session.userId){
					socket.emit('error', {object: "You are not the host of this game!"});
					return;
				}

				if(games[gameId].active == true) return;

				dbFunctions.doesMapBelongToCreator(session.userId, newMapId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						if(dbReturn.object == true && games[gameId].mapId){
							games[gameId].mapId = newMapId;

							dbFunctions.returnMap(newMapId).then(function (dbReturn_){
								if(dbReturn_.success == false){
									socket.emit('error', {object: dbReturn_.error});
								}else{
									let theMap = dbReturn_.object;
									games[gameId].mapName = theMap.name;
									publicGames[gameId].mapName = theMap.name;
									for(let key in games[gameId].players){
										for(let j = 0; j < userIdToSockets[games[gameId].players[key].id].length; j++){
											userIdToSockets[games[gameId].players[key].id][j].emit('recievedNewGameMapId', {mapId: newMapId, mapName: theMap.name});
										}
									}
									socket.emit('recievedNewGameMapId_', {mapId: newMapId, mapName: theMap.name});
								}
							});
						}else{
							dbFunctions.doesMapBelongToUser(session.userId, newMapId).then(function (dbReturn){
								if(dbReturn.success == false){
									socket.emit('error', {object: dbReturn.error});
								}else{
									if(dbReturn.object == true){
										games[gameId].mapId = newMapId;
			
										dbFunctions.returnMap(newMapId).then(function (dbReturn_){
											if(dbReturn_.success == false){
												socket.emit('error', {object: dbReturn_.error});
											}else{
												let theMap = dbReturn_.object;
												games[gameId].mapName = theMap.name;
												publicGames[gameId].mapName = theMap.name;
												for(let key in games[gameId].players){
													for(let j = 0; j < userIdToSockets[games[gameId].players[key].id].length; j++){
														userIdToSockets[games[gameId].players[key].id][j].emit('recievedNewGameMapId', {mapId: newMapId, mapName: theMap.name});
													}
												}
												socket.emit('recievedNewGameMapId_', {mapId: newMapId, mapName: theMap.name});
											}
										});
									}else{
										socket.emit('recievedNewGameMapId_', {mapId: games[gameId].mapId, mapName: games[gameId].mapId});
									}
								}
							});
						}
					}
				});
			}
		});
	});

	socket.on('joinGame', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				let gameId = msg.gameId;

				if(publicGames[gameId] == undefined){
					return;
				}

				if(publicGames[gameId].active == true){
					socket.emit('error', {object: "This game has already started."});
				}

				dbFunctions.returnUser(session.userId).then(function (dbReturn){
					if(dbReturn.success == false){
						socket.emit('error', {object: dbReturn.error});
					}else{
						let username = dbReturn.object.username;

						userIdToGameId[session.userId] = gameId;

						for(let key in games[gameId].players){
							for(let j = 0; j < userIdToSockets[games[gameId].players[key].id].length; j++){
								userIdToSockets[games[gameId].players[key].id][j].emit('recievedNewUser', {userId: session.userId, username: username});
							}
						}

						for(let j = 0; j < userIdToSockets[games[gameId].hostId].length; j++){
							userIdToSockets[games[gameId].hostId][j].emit('recievedNewUser', {userId: session.userId, username: username});
						}
						
						games[gameId].players[session.userId] = {id: session.userId, username: username, objectId: null, hasDisconnected: false};

						socket.emit('recievedGame', {object: games[gameId]});
					}
				});
			}
		});
	});

	socket.on('disconnectFromGame', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				if(userIdToGameId[session.userId] == undefined){
					return;
				}

				let gameId = userIdToGameId[session.userId];

				if(publicGames[gameId] == undefined){
					return;
				}

				if(games[gameId].hostId != session.userId){
					delete games[gameId].players[session.userId];
					delete userIdToGameId[session.userId];

					for(let key in games[gameId].players){
						for(let j = 0; j < userIdToSockets[games[gameId].players[key].id].length; j++){
							userIdToSockets[games[gameId].players[key].id][j].emit('removedUserFromGame', {userId: session.userId});
						}
					}

					for(let j = 0; j < userIdToSockets[games[gameId].hostId].length; j++){
						userIdToSockets[games[gameId].hostId][j].emit('removedUserFromGame', {userId: session.userId});
					}
				}else{
					let newHostId = Object.keys(games[gameId].players)[0];
					if(newHostId == undefined){
						delete games[gameId];
						delete userIdToGameId[session.userId];
						delete publicGames[gameId];
					}else{
						let newHostUsername = games[gameId].players[newHostId].username;

						delete games[gameId].players[newHostId];
						games[gameId].hostId = newHostId;

						games[gameId].hostName = newHostUsername;
						publicGames[gameId].gameHost = newHostUsername;

						for(let key in games[gameId].players){
							for(let j = 0; j < userIdToSockets[games[gameId].players[key].id].length; j++){
								userIdToSockets[games[gameId].players[key].id][j].emit('recievedNewHostFromGame', {userId: newHostId});
								userIdToSockets[games[gameId].players[key].id][j].emit('removedUserFromGame', {userId: session.userId});
							}
						}

						for(let j = 0; j < userIdToSockets[games[gameId].hostId].length; j++){
							userIdToSockets[games[gameId].hostId][j].emit('recievedNewHostFromGame', {userId: newHostId});
							userIdToSockets[games[gameId].hostId][j].emit('removedUserFromGame', {userId: session.userId});
						}
					}
				}
			}
		});
	});

	socket.on('kickPlayerFromGame', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				if(userIdToGameId[session.userId] == undefined){
					socket.emit('error', {object: "You are not in a game!"});
					return;
				}

				let gameId = userIdToGameId[session.userId];
				let userId = msg.userId;

				if(games[gameId].hostId != session.userId){
					socket.emit('error', {object: "You are not the host of this game!"});
					return;
				}

				if(userIdToGameId[userId] == undefined){
					socket.emit('error', {object: "The player you are trying to kick is not in a game!"});
					return;
				}

				if(userIdToGameId[userId] != gameId){
					socket.emit('error', {object: "The player you are trying to kick is not in your game!"});
					return;
				}

				delete games[gameId].players[userId];
				delete userIdToGameId[userId];

				for(let key in games[gameId].players){
					for(let j = 0; j < userIdToSockets[games[gameId].players[key].id].length; j++){
						userIdToSockets[games[gameId].players[key].id][j].emit('removedUserFromGame', {userId: userId});
					}
				}

				for(let j = 0; j < userIdToSockets[games[gameId].hostId].length; j++){
					userIdToSockets[games[gameId].hostId][j].emit('removedUserFromGame', {userId: userId});
				}

				// for(let j = 0; j < userIdToSockets[userId].length; j++){
				// 	userIdToSockets[userId][j].emit('removedUserFromGame', {userId: userId});
				// }
			}
		});
	});

	socket.on('makePlayerHost', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, (error, session) => {
			if(session && session.userId){
				if(userIdToGameId[session.userId] == undefined){
					socket.emit('error', {object: "You are not in a game!"});
					return;
				}

				let gameId = userIdToGameId[session.userId];
				let userId = msg.userId;

				if(games[gameId].hostId != session.userId){
					socket.emit('error', {object: "You are not the host of this game!"});
					return;
				}

				if(userIdToGameId[userId] == undefined){
					socket.emit('error', {object: "The player you are trying to make host is not in a game!"});
					return;
				}

				if(userIdToGameId[userId] != gameId){
					socket.emit('error', {object: "The player you are trying to make host is not in your game!"});
					return;
				}

				let newHostUsername = games[gameId].players[userId].username;
				let oldHostUsername = games[gameId].hostName;

				delete games[gameId].players[userId];
				games[gameId].players[session.userId] = {id: session.userId, username: oldHostUsername, hasDisconnected: false};
				games[gameId].hostId = userId;

				games[gameId].hostName = newHostUsername;
				publicGames[gameId].gameHost = newHostUsername;

				for(let key in games[gameId].players){
					for(let j = 0; j < userIdToSockets[games[gameId].players[key].id].length; j++){
						userIdToSockets[games[gameId].players[key].id][j].emit('recievedNewHostFromGame', {userId: userId});
					}
				}

				for(let j = 0; j < userIdToSockets[games[gameId].hostId].length; j++){
					userIdToSockets[games[gameId].hostId][j].emit('recievedNewHostFromGame', {userId: userId});
				}
			}
		});
	});

	socket.on('startGame', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, async (error, session) => {
			if(session && session.userId){
				if(userIdToGameId[session.userId] == undefined){
					socket.emit('error', {object: "You are not in a game!"});
					return;
				}

				let gameId = userIdToGameId[session.userId];

				if(games[gameId].hostId != session.userId){
					socket.emit('error', {object: "You are not the host of this game!"});
					return;
				}
				games[gameId].active = true;
				delete publicGames[gameId];

				let returnedMap = await dbFunctions.returnMap(games[gameId].mapId);
				returnedMap =  JSON.parse(returnedMap.object.json);
				if(returnedMap == null || returnedMap == undefined) return;
				returnedMap.id = "gameMap_" + returnedMap.id + "_" + games[gameId].hostId;
				games[gameId].activeMapId = returnedMap.id;
				let theMap = new gameMap.GameMap(returnedMap.id, returnedMap.name);
				theMap.idToObj = returnedMap.idToObj;
				theMap.idToUnit = returnedMap.idToUnit;
				for(let key in theMap.idToObj){
					theMap.root = tree.addObject(theMap.root, theMap.idToObj[key])
					theMap.processEvent('objAdded', theMap.idToObj[key], theMap.idToObj[key].x, theMap.idToObj[key].y, 0);
				}
				for(let key in theMap.idToUnit){
					theMap.root = tree.addObject(theMap.root, theMap.idToUnit[key])
					theMap.processEvent('unitAdded', theMap.idToUnit[key], theMap.idToUnit[key].x + (units.pointsPerUnit/2),  theMap.idToUnit[key].y + (units.pointsPerUnit/2), units.pointsPerUnit/2);
				}
				theMap.lastId = returnedMap.lastId;
				theMap.totalUnitIds = returnedMap.totalUnitIds;
				theMap.config = returnedMap.config;
				maps[returnedMap.id] = theMap;
				// mapIdToExpiration[returnedMap.id] = 1e+308;

				let newPlayers = msg.players;
				let takenIds = {};
				for(let i in newPlayers){
					let thePlayer = newPlayers[i];
					if(takenIds[thePlayer.objectId] == undefined){
						if(maps[returnedMap.id].idToObj != undefined && maps[returnedMap.id].idToObj[thePlayer.objectId] != undefined){
							games[gameId].players[thePlayer.id].objectId = thePlayer.objectId;
							takenIds[thePlayer.objectId] = true;
						}else{
							games[gameId].players[thePlayer.id].objectId = null;
						}
					}else{
						games[gameId].players[thePlayer.id].objectId = null;
					}
				}

				if(games[gameId].playersToLoad == undefined){
					games[gameId].playersToLoad = {};
				}
				for(let key in games[gameId].players){
					games[gameId].playersToLoad[key] = true;
				}
				games[gameId].playersToLoad[games[gameId].hostId] = true;

				games[gameId].liveGame = new lg.LiveGame(games[gameId], maps[returnedMap.id]);

				for(let key in games[gameId].players){
					serverMain.emitToUser(key, 'startLoadingGame', {mapId: games[gameId].activeMapId, players: games[gameId].players});
				}
				serverMain.emitToUser(games[gameId].hostId, 'startLoadingGame', {mapId: games[gameId].activeMapId, players: games[gameId].players});
			}
		});
	});


	socket.on('loadedGame', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, async (error, session) => {
			if(session && session.userId){
				if(userIdToGameId[session.userId] == undefined){
					socket.emit('error', {object: "You are not in a game!"});
					return;
				}

				let gameId = userIdToGameId[session.userId];
				let theGame = games[gameId];

				if(theGame.liveGame == undefined){
					socket.emit('error', {object: "The game has not started!"});
					return;
				}

				if(theGame.playersToLoad[session.userId] != undefined) delete theGame.playersToLoad[session.userId];

				let totalCount = Object.keys(theGame.players).length+1;
				let loaded = totalCount - Object.keys(theGame.playersToLoad).length;

				//update the count
				for(let key in theGame.players){
					let hasUserLoaded = false;
					if(theGame.playersToLoad[key] == undefined) hasUserLoaded = true;
					for(let j = 0; j < userIdToSockets[theGame.players[key].id].length; j++){
						userIdToSockets[theGame.players[key].id][j].emit('updateLoadingCount', {loaded: loaded, total: totalCount, haveILoaded: hasUserLoaded});
					}
				}

				for(let j = 0; j < userIdToSockets[theGame.hostId].length; j++){
					let hasUserLoaded = false;
					if(theGame.playersToLoad[key] == undefined) hasUserLoaded = true;
					userIdToSockets[theGame.hostId][j].emit('updateLoadingCount', {loaded: loaded, total: totalCount, haveILoaded: hasUserLoaded});
				}

				if(Object.keys(theGame.playersToLoad).length === 0){
					//all players have loaded
					setTimeout(function () {	
						theGame.liveGame.start();
					}, 5000); //5 seconds will pass when everyone has loaded, before starting the game
				}
			}
		});
	});

	function endGame(gameId){
		delete maps[games[gameId].activeMapId];

		games[gameId].liveGame.end();

		delete userIdToGameId[games[gameId].hostId];
		
		for(let i in games[gameId].players){
			delete userIdToGameId[games[gameId].players[i].id];
		}
		
		delete games[gameId];
	}
	exports.endGame = endGame;

	socket.on('endGame', async (msg) => {
		// msg = JSON.parseasync (msg);

		store.get(msg.sessionId, async (error, session) => {
			if(session && session.userId){
				if(userIdToGameId[session.userId] == undefined){
					socket.emit('error', {object: "You are not in a game!"});
					return;
				}

				let gameId = msg.gameId;

				if(games[gameId].hostId != session.userId){
					socket.emit('error', {object: "You are not the host of this game!"});
					return;
				}
				
				endGame(gameId);
			}
		});
	});
	

	async function withMapasync (msg) {
		if(!socket.__userId) return null;
		let map = maps[msg.id];
		if(!map){
			// map = new gameMap.GameMap(msg.id, "");
			map = await dbFunctions.returnMap(msg.id);
			let returnedMap =  JSON.parse(map.object.json);
			if(returnedMap == null || returnedMap == undefined) return;
			let theMap = new gameMap.GameMap(returnedMap.id, returnedMap.name);
			theMap.idToObj = returnedMap.idToObj;
			theMap.idToUnit = returnedMap.idToUnit;
			for(let key in theMap.idToObj){
				theMap.root = tree.addObject(theMap.root, theMap.idToObj[key])
				theMap.processEvent('objAdded', theMap.idToObj[key], theMap.idToObj[key].x, theMap.idToObj[key].y, 0);
			}
			for(let key in theMap.idToUnit){
				theMap.root = tree.addObject(theMap.root, theMap.idToUnit[key])
				theMap.processEvent('unitAdded', theMap.idToUnit[key], theMap.idToUnit[key].x + (units.pointsPerUnit/2),  theMap.idToUnit[key].y + (units.pointsPerUnit/2), units.pointsPerUnit/2);
			}
			theMap.lastId = returnedMap.lastId;
			theMap.totalUnitIds = returnedMap.totalUnitIds;
			theMap.config = returnedMap.config;
			if(map.object.json) maps[msg.id] = theMap;
		}
		mapIdToExpiration[msg.id] = timeBeforeExpiration;
		return maps[msg.id];
	}

	function onChange(name, change){
		socket.emit('onChange', {object: change, type: name});
	}



	socket.on('subscribeForMap', async (msg) => {
		//msg = JSON.parseasync (msg);
        let map_ = await withMapasync (msg);
        if(!map_) return;

		console.log("someone subscribed");

		let oldX = 10000000;
		let oldY = 10000000;
		let oldR = 0;
		if(subscription !== undefined){
			if(subscribedMap === map_){
				oldX = subscription.x;
				oldY = subscription.y;
				oldR = subscription.r;
			}
			subscribedMap.removeSubscription(subscription.id);
		}
		subscription = {};
		subscription.x = msg.x;
		subscription.y = msg.y;
		subscription.r = msg.r;
		subscription.callback = onChange;
		map_.addSubscription(subscription);
		subscribedMap = map_;

		let returnObj = [];
		map_.getInArea(subscription.x, subscription.y, subscription.r, oldX, oldY, oldR, returnObj);

		socket.emit('recievedObjList', {object: returnObj});
		socket.emit('recievedMapConfig', {object: map_.config});
	});

	socket.on('unsubscribeForMap', async (msg) => {
		//msg = JSON.parseasync (msg);
        // let map_ = await withMapasync (msg);
        // if(!map_) return;

		if(subscription !== undefined){
			subscribedMap.removeSubscription(subscription.id);
            subscribedMap = undefined;
            subscription = undefined;
		}
	});

    socket.on('changeMapHeight', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

        // let heightEditReturn = {};
        if(msg.isLeveling){
            map.levelHeight(map_, msg.x, msg.y, msg.r, msg.hIndex);
        }else{
            map.updateHeight(map_, msg.x, msg.y, msg.r, msg.hIndex, msg.isSmooth);
        }
    });

	socket.on('changeMapMaterial', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		map.updateTexture(map_, msg.x, msg.y, msg.r, msg.newTexture);
    });

	socket.on('addUnit', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		units.newUnit(map_, map_.idToUnit[msg.nearbyId], msg.side);
    });

	socket.on('removeUnit', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		map_.removeUnit(msg.unitId);
    });

	socket.on('addObject', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		objects.newObj(map_, msg.x, msg.y, msg.type, msg.rotation, msg.colorChange, msg.thisColorR, msg.thisColorG, msg.thisColorB, msg.thisSize);
    });

	socket.on('removeObject', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

        map_.removeObject(msg.objId);
    });

	socket.on('moveObject', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		if(map_.idToObj[msg.objId].type == 31){
			if(!map_.checkForCollision(msg.objId, msg.x, msg.y, 1.5)){
				objects.moveObj(map_, msg.objId, msg.x, msg.y, msg.rot);
			}
		}
		else if(map_.idToObj[msg.objId].type == 37){
			if(!map_.checkForCollision(msg.objId, msg.x, msg.y, 5)){
				objects.moveObj(map_, msg.objId, msg.x, msg.y, msg.rot);
			}
		}
		else if(!map_.checkForCollision(msg.objId, msg.x, msg.y, 2.5)){
			objects.moveObj(map_, msg.objId, msg.x, msg.y, msg.rot);
		}
    });
	
	socket.on('rotateObject', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		objects.rotateObj(map_, msg.objId, msg.rot);
    });

	socket.on('changeObjectRotation', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;
		map_.changeObject(msg.objectId, {rotation: msg.newRotation});
    });
	
	socket.on('changeObjectColor', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		map_.changeObject(msg.objectId, {colorChange: msg.newColor, colorR: msg.colorR, colorG: msg.colorG, colorB: msg.colorB});
    });
	
	socket.on('changeObjectSize', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		map_.changeObject(msg.objectId, {scale: msg.newSize});
    });

	socket.on('changeObjectType', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		map_.changeObject(msg.objectId, {objectType: msg.newTypeId});
    });

	socket.on('addObjectEvent', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		map_.addObjectEvent(msg.objId, msg.event);
		console.log(msg.event);
    });

	socket.on('saveVariables', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		let variables = msg.newVariables.variables;

		for(let key in variables){
			if(!additionalFunctions.checkVariable(variables[key])) return;
		}

		if(map_.config == undefined) map_.config = new structures.Config();
		map_.config.globalVars = msg.newVariables;
		map_.config.idCount = msg.newIdCount;
    });

	socket.on('saveEvents', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		if(map_.config == undefined) map_.config = new structures.Config();
		map_.config.globalEvents = msg.newEvents;
		map_.config.idCount = msg.newIdCount;
    });

	socket.on('saveObjects', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		if(map_.config == undefined) map_.config = new structures.Config();
		map_.config.objectTypes = msg.newObjects;
		map_.config.idCount = msg.newIdCount;
    });

	socket.on('removeObjectTag', async (msg) => {
        let map_ = await withMapasync (msg);
        if(!map_) return;

		let theTag = msg.theTag;
		console.log("deleting tag", map_.idToObj[theTag.objId].tags[theTag.name]);
		delete map_.idToObj[theTag.objId].tags[theTag.name];
		socket.emit("removedObjectTag", {theTag: theTag});
    });

	socket.on('disconnect', () => {
		if(subscription !== undefined){
			subscribedMap.removeSubscription(subscription.id);
		}
		let userId = socket.__userId;

		let gameId = userIdToGameId[userId];
		if(gameId != undefined){
			let theGame = games[gameId];
			if(theGame.active){
				if(theGame.hostId == userId){
					theGame.hasHostDisconnected = true;

					if(checkIfAllPlayersHaveDisconnected(theGame)){
						endGame(gameId);
					}
				}else{
					theGame.players[userId].hasDisconnected = true;

					if(checkIfAllPlayersHaveDisconnected(theGame)){
						endGame(gameId);
					}
				}
			}else{
				if(theGame.hostId == userId){
					let newHostId = Object.keys(games[gameId].players)[0];
					if(newHostId == undefined){
						delete games[gameId];
						delete userIdToGameId[userId];
						delete publicGames[gameId];
					}else{
						let newHostUsername = games[gameId].players[newHostId].username;

						delete games[gameId].players[newHostId];
						games[gameId].hostId = newHostId;

						games[gameId].hostName = newHostUsername;
						publicGames[gameId].gameHost = newHostUsername;

						for(let key in games[gameId].players){
							for(let j = 0; j < userIdToSockets[games[gameId].players[key].id].length; j++){
								userIdToSockets[games[gameId].players[key].id][j].emit('recievedNewHostFromGame', {userId: newHostId});
								userIdToSockets[games[gameId].players[key].id][j].emit('removedUserFromGame', {userId: userId});
							}
						}

						for(let j = 0; j < userIdToSockets[games[gameId].hostId].length; j++){
							userIdToSockets[games[gameId].hostId][j].emit('recievedNewHostFromGame', {userId: newHostId});
							userIdToSockets[games[gameId].hostId][j].emit('removedUserFromGame', {userId: userId});
						}
					}
				}else{
					delete games[gameId].players[userId];
					delete userIdToGameId[userId];

					for(let key in games[gameId].players){
						for(let j = 0; j < userIdToSockets[games[gameId].players[key].id].length; j++){
							userIdToSockets[games[gameId].players[key].id][j].emit('removedUserFromGame', {userId: userId});
						}
					}

					for(let j = 0; j < userIdToSockets[games[gameId].hostId].length; j++){
						userIdToSockets[games[gameId].hostId][j].emit('removedUserFromGame', {userId: userId});
					}
				}
			}
		}

		console.log('user disconnected ' + userId);
	});
}

io.on('connection', onConnection);
if(ios) {
	ios.on('connection', onConnection);
}

//repeated functions
async function saveMaps(waitTime){
	let brMaps = 0;
	for(let key in maps){
		brMaps++;
		console.log("trying to save map ", key, typeof key);
		if(additionalFunctions.isStringNumber(key)){
			console.log("saving map ", key);
			if(!additionalFunctions.doesStringContainOnlyDigits(maps[key].id)){ return; }
			let map_ = new structures.MapJson(maps[key].id, maps[key].name, maps[key].idToObj, maps[key].idToUnit, maps[key].lastId, maps[key].totalUnitIds,  maps[key].config);
			mapIdToExpiration[key] -= waitTime;
			if(map_){
				await dbFunctions.updateMap(key, null, null, null, JSON.stringify(map_));

				if(mapIdToExpiration[key] <= 0){
					delete maps[key];
					delete mapIdToExpiration[key];
				}
			}
		}
	}
	// console.log("maps saved");
	console.log("saved " + brMaps + " maps");

	setTimeout(async function () { saveMaps(waitTime); }, waitTime*1000);
}
setTimeout(async function () { saveMaps(10); }, 20*1000);


http.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

if(https) {
 https.listen(443, () => {
 	console.log('HTTPS Server running on port 443');
 });
}

// receive and decrypt key
// db.any('SELECT * FROM encrypted_key')
// .then (function (result){
// 	key = result[0].key;
// 	decryptKey(key)
// 	.then (function (result) {
// 		key = fromBytesToString(result);
// 	});
// });