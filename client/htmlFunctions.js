let currEditObjectId;

function switchMenus(activeMenu, displayType){
    document.querySelector("#register").style.display = "none";
    let elements = document.querySelector("#register").querySelectorAll("input");
    for(let i = 0; i < elements.length; i++){
        elements[i].value = "";
    }

    document.querySelector("#login").style.display = "none";
    elements = document.querySelector("#login").querySelectorAll("input");
    for(let i = 0; i < elements.length; i++){
        elements[i].value = "";
    }

    document.querySelector("#mainMenu").style.display = "none";
    
    document.querySelector("#mapChoose").style.display = "none";
    
    document.querySelector("#mapNameChoose").style.display = "none";
    elements = document.querySelector("#mapNameChoose").querySelectorAll("input");
    for(let i = 0; i < elements.length; i++){
        elements[i].value = "";
    }
    
    document.querySelector(".map-edit-div").style.display = "none";
    document.querySelector(".map-edit-div").querySelector(".tool-holder").style.display = "flex";
    document.querySelector(".map-edit-div").querySelector(".canvas-holder").style.width = "75%";
    document.querySelector(".map-edit-div").querySelector("#mapEditBackButton").style.display = "none";
    document.querySelector(".map-edit-div").querySelector("#toolButtonsEndGame").style.display = "none";
    document.querySelector(".map-edit-div").querySelector("#toolButtons").querySelector("button").style.display = "inline-block";
    
    document.querySelector("#createGameRoomMenu").style.display = "none";
    document.querySelector("#createGameRoomMenu").querySelector("#createGameMenuPlayerContainer").innerHTML = "";

    document.querySelector("#joinGameRoomMenu").style.display = "none";
    document.querySelector("#joinGameRoomMenu").querySelector("#joinGameMenuPlayerContainer").innerHTML = "";

    document.querySelector("#gameList").style.display = "none";
    document.querySelector("#gameList").querySelector("#gameListContainerListElementsHolder").innerHTML = "";

    document.querySelector("#mapList").style.display = "none";

    document.getElementById("editObjectTool").querySelector("#editObjectToolChangeObjectType").value = "undefined";
    document.getElementById("editObjectTool").querySelector("#editObjectToolP").innerText = "Select an object";


    document.querySelector(activeMenu).style.display = displayType;
}

function diplayCanvasPopup(name, value){
    let theElement = document.getElementById("canvasPopupHolder");

    theElement.querySelector("#canvasPopup").querySelector("#canvasPopupName").innerText = name;
    theElement.querySelector("#canvasPopup").querySelector("#canvasPopupValue").innerText = value;

    theElement.querySelector("#canvasPopup").style.display = "block";
}

function diplayCanvasBarPopup(value, text){
    let theElement = document.getElementById("canvasPopupHolder");

    value = parseInt(value);
    if(value > 100) value = 100;
    if(value < 0) value = 0;

    theElement.querySelector("#canvasBarPopup").querySelector("#canvasBarPopupValue").style.width = "" + value + "%";
    theElement.querySelector("#canvasBarPopup").querySelector("#canvasBarPopupText").innerText = text;

    theElement.querySelector("#canvasBarPopup").style.display = "block";
}

function diplayCanvasValuePopup(value){
    let theElement = document.getElementById("canvasPopupHolder");

    theElement.querySelector("#canvasValuePopup").querySelector("#canvasValuePopupValue").innerText = value;

    theElement.querySelector("#canvasValuePopup").style.display = "block";
}

function outputUpdate(vol, id) {
    let output = document.getElementById("" + id + "_output");
    output.value = vol;
    output.style.left = vol + 'px';
    /*output.style.display = "inline-block";
    setTimeout(() => {  output.style.display = "none"; }, 200);*/
}

function toolChangerFunction(divId){
    //0 - height edit
    //1 - material edit
    //2 - object place/remove

    let editModeToDivId = ["heightTool", "materialTool", "addItemTool", "editObjectTool", "removeTool", "changeVariableTool", "editEventsTool", "editObjectsTool", "inviteTool"];

    let id = parseInt(document.getElementById("toolChanger").value);

    editMode = id;

    for(let i in editModeToDivId){
        document.getElementById(editModeToDivId[i]).style.display = "none";
    }
    // document.getElementById("heightTool").style.display = "none";
    // document.getElementById("materialTool").style.display = "none";
    // document.getElementById("addItemTool").style.display = "none";
    // document.getElementById("removeTool").style.display = "none";
    // document.getElementById("changeVariableTool").style.display = "none";
    // document.getElementById("inviteTool").style.display = "none";

    document.getElementById(editModeToDivId[editMode]).style.display = "block";

    // if(id == 0){
    //     document.getElementById("heightTool").style.display = "block";
    //     document.getElementById("materialTool").style.display = "none";
    //     document.getElementById("addItemTool").style.display = "none";
    //     document.getElementById("removeTool").style.display = "none";
    //     document.getElementById("inviteTool").style.display = "none";
    // }

    // if(id == 1){
    //     document.getElementById("heightTool").style.display = "none";
    //     document.getElementById("materialTool").style.display = "block";
    //     document.getElementById("addItemTool").style.display = "none";
    //     document.getElementById("removeTool").style.display = "none";
    //     document.getElementById("inviteTool").style.display = "none";
    // }

    // if(id == 2){
    //     document.getElementById("heightTool").style.display = "none";
    //     document.getElementById("materialTool").style.display = "none";
    //     document.getElementById("addItemTool").style.display = "block";
    //     document.getElementById("removeTool").style.display = "none";
    //     document.getElementById("inviteTool").style.display = "none";
    // }

    // if(id == 3){
    //     document.getElementById("heightTool").style.display = "none";
    //     document.getElementById("materialTool").style.display = "none";
    //     document.getElementById("addItemTool").style.display = "none";
    //     document.getElementById("removeTool").style.display = "block";
    //     document.getElementById("inviteTool").style.display = "none";
    // }

    // if(id == 4){
    //     document.getElementById("heightTool").style.display = "none";
    //     document.getElementById("materialTool").style.display = "none";
    //     document.getElementById("addItemTool").style.display = "none";
    //     document.getElementById("removeTool").style.display = "block";
    //     document.getElementById("inviteTool").style.display = "none";
    // }

    // if(id == 6){
    //     document.getElementById("heightTool").style.display = "none";
    //     document.getElementById("materialTool").style.display = "none";
    //     document.getElementById("addItemTool").style.display = "none";
    //     document.getElementById("removeTool").style.display = "none";
    //     document.getElementById("inviteTool").style.display = "block";
    // }
}

function materialChangerFunction(){
    //0 - dirt
    //1 - grass

    currMaterialIndex = parseInt(document.getElementById("materialTool").querySelector("#toolChanger").value);
}

function itemChangerFunction(){
    let listId = parseInt(document.getElementById("addItemTool").querySelector("#itemChangerChanger").value);

    if(listId == 1){
        currItemIndex = parseInt(document.getElementById("addItemTool").querySelector("#forestItemChanger").value);
    }
    if(listId == 2){
        currItemIndex = parseInt(document.getElementById("addItemTool").querySelector("#desertItemChanger").value);
    }
    if(listId == 3){
        currItemIndex = parseInt(document.getElementById("addItemTool").querySelector("#propsItemChanger").value);
    }
}

function dropListChangeFunction(){
    let listId = parseInt(document.getElementById("addItemTool").querySelector("#itemChangerChanger").value);

    if(listId == 0){
        currItemIndex = 0;

        document.getElementById("addItemTool").querySelector("#forestItemChanger").style.display = "none";
        document.getElementById("addItemTool").querySelector("#desertItemChanger").style.display = "none";
        document.getElementById("addItemTool").querySelector("#propsItemChanger").style.display = "none";
        document.getElementById("addItemTool").querySelector("#add_item_tool_object_parameters").style.display = "none";
    }else{
        document.getElementById("addItemTool").querySelector("#add_item_tool_object_parameters").style.display = "inline";
    }

    if(listId == 1){
        currItemIndex = 1;

        document.getElementById("addItemTool").querySelector("#forestItemChanger").style.display = "inline";
        document.getElementById("addItemTool").querySelector("#desertItemChanger").style.display = "none";
        document.getElementById("addItemTool").querySelector("#propsItemChanger").style.display = "none";
    }
    if(listId == 2){
        currItemIndex = 18;

        document.getElementById("addItemTool").querySelector("#forestItemChanger").style.display = "none";
        document.getElementById("addItemTool").querySelector("#desertItemChanger").style.display = "inline";
        document.getElementById("addItemTool").querySelector("#propsItemChanger").style.display = "none";
    }
    if(listId == 3){
        currItemIndex = 16;

        document.getElementById("addItemTool").querySelector("#forestItemChanger").style.display = "none";
        document.getElementById("addItemTool").querySelector("#desertItemChanger").style.display = "none";
        document.getElementById("addItemTool").querySelector("#propsItemChanger").style.display = "inline";
    }
}

function removeChangerFunction(){
    //1 - remove single object
    //2 - remove in radius

    let id = document.getElementById("removeChanger").value;

    if(id == 1){
        document.getElementById("removeObjectChangerDiv").style.display = "block";
        document.getElementById("removeObjectInRadiusDiv").style.display = "none";
    }else{
        document.getElementById("removeObjectChangerDiv").style.display = "none";
        document.getElementById("removeObjectInRadiusDiv").style.display = "block";
    }
}

function switchBetweenLoginAndRegister(){
    if(document.getElementById("login").style.display == "none"){
        switchMenus("#login", "inline-block");
    }else{
        switchMenus("#register", "inline-block");
    }
}

function onAuthenticate(){ //name must be changed
    let searchParams = new URLSearchParams(document.location.search.substring(1));
    let mapId = searchParams.get("mapId");
    let objId = searchParams.get("objId");

    if(mapId){
        switchMenus(".map-edit-div", "flex");

        if(objId){
            document.getElementsByClassName("map-edit-div")[0].querySelector(".tool-holder").style.display = "none";
            document.getElementsByClassName("map-edit-div")[0].querySelector(".canvas-holder").style.width = "100%";
            isInPlayMode = true;
            playerId = objId;
            window.camera = FreeCamera;
        }else{
            window.camera = ArcRotateCamera;
        }

        let newMap = new Map();
        newMap.id = mapId;
        startEditingOnLoadMap(newMap);
        loadMap(mapId);
        onRecievingMap = 1;
    }else{
        switchMenus("#mainMenu", "flex");
        window.camera = ArcRotateCamera;
    }

    getGetUserMapList(user.id);
    getGetUserFriendsList(user.id);
}

function toRegister(element){ //this function is attached to the register button
    let username = element.parentElement.querySelectorAll("input")[0].value;
    let password = element.parentElement.querySelectorAll("input")[1].value;
    
    element.parentElement.querySelectorAll("input")[0].value = "";
    element.parentElement.querySelectorAll("input")[1].value = "";

    register(username, password);
}

function onRegister(){ //called when the player registers
    document.getElementById("register").style.display = "none";
    
    onAuthenticate();
}

function toLogin(element){ //this function is attached to the login button
    let username = element.parentElement.querySelectorAll("input")[0].value;
    let password = element.parentElement.querySelectorAll("input")[1].value;
    
    element.parentElement.querySelectorAll("input")[0].value = "";
    element.parentElement.querySelectorAll("input")[1].value = "";

    login(username, password);
    // login("asdf", "asdf");
}

function onLogin(){ //called when the player login
    document.getElementById("login").style.display = "none";
    
    onAuthenticate();
}

function onCreateMap(){
    loadedMaps[map.currMap.id] = map.currMap;
    createMap(map.currMap);
}

function toMainMenu(){
    switchMenus("#mainMenu", "flex");
    unsubscribe();
    map.stop();
    engineSetup.stop();
}

function fromMapNameChooseToMapEdit(){
    let map_ = new Map();
    map_.name = document.getElementById("mapNameChoose").querySelector("input").value;
    document.getElementById("mapNameChoose").querySelector("input").value = "";
    switchMenus(".map-edit-div", "flex");
    mapEdit.startMapEditing(map_, true);
}

function chooseMapButton(id_){
    switchMenus(".map-edit-div", "flex");
    let newMap = new Map();
    newMap.id = id_;
    startEditingOnLoadMap(newMap);
    loadMap(id_);
    onRecievingMap = 1;
}

function startEditingOnLoadMap(map_){
    switchMenus(".map-edit-div", "flex");
    mapEdit.startMapEditing(map_);
}

function addEditor(){
    let link = generateLink(document.location.toString(), map.currMap.id);
    console.log(link);

    document.getElementById("addEditorInput").style.display = "inline";
    document.getElementById("addEditorInput").value = link;
}

function changeOpacity(that, isTrue, list){
    //that - This of the element, that is a common parent of all elements in the list.
    //isTrue - This function is usually called from a checkbox. This is the result of weather the checkbox is checked.
    //         If this value is true - the elements in list get opacity of 0.5. Otherwise they get opacity of 1.
    //list - List of id-s of the objects, that need opacity change.

    for(let i in list){
        if(that != undefined && that.querySelector(list[i]) != undefined){
            if(isTrue){
                that.querySelector(list[i]).style.opacity = 0.5;
            }else{
                that.querySelector(list[i]).style.opacity = 1;
            }
        }
    }
}

function addCreateGameMenuMapItem(newId, mapName){
    //this function adds another Map to choose from from the create game menu
    let clonedDiv = document.getElementById("createGameRoomMenu").querySelector("#createGameMenuMapItemToClone").cloneNode(true);
    clonedDiv.style.display = "flex";
    clonedDiv.id = "gameMenuMapItemId_" + newId;
    clonedDiv.innerText = mapName;
    let parentDiv = document.getElementById("createGameMenuMapContainer");
    parentDiv.insertBefore(clonedDiv, parentDiv.firstChild);
}
function addCreateGameMenuMapItem_(newId, mapName){
    //this function adds another Map to choose from from the create game menu
    let clonedDiv = document.getElementById("createGameRoomMenu").querySelector("#createGameMenuMapItemToClone").cloneNode(true);
    clonedDiv.style.display = "flex";
    clonedDiv.id = "gameMenuMapItemId_" + newId;
    clonedDiv.innerText = mapName;
    document.getElementById("createGameMenuMapContainer").appendChild(clonedDiv);
}

function selectCreateGameMenuMapItem(itemId){
    //this function adds the "selected" class to a certain game menu map item
    //this makes it darker
    //when the game starts this is going to be the map that the game is going to be played on

    //remove the selected class from the previous selected element
    let previousElement = document.getElementById("createGameMenuMapContainer").querySelector(".selected");
    if(previousElement != undefined){
        if(previousElement.id == itemId){
            return;
        }
        previousElement.classList.remove("selected");
    }

    changeGameMap(returnOnlyNumbersFromString(itemId));

    //add class to the new element
    let newElementId = "#" + itemId;
    let newElement = document.getElementById("createGameMenuMapContainer").querySelector(newElementId);
    if(newElement != undefined){
        newElement.classList.add("selected");
        document.getElementById("createGameMenuMap").querySelector("#createGameMenuMapName").innerHTML = newElement.innerText;
    }
}

function addCreateGameMenuPlayerItem(newId, playerName){
    //this function adds another Map to choose from from the join game menu

    if(document.getElementById("addCreateGameMenuPlayerItem_" + newId) != undefined){
        return;
    }

    let clonedDiv = document.getElementById("createGameRoomMenu").querySelector("#createGameMenuPlayerItemToClone").cloneNode(true);
    clonedDiv.style.display = "inline-block";
    clonedDiv.id = "addCreateGameMenuPlayerItem_" + newId;
    clonedDiv.querySelector(".createGameMenuPlayerItemName").innerText = playerName;
    document.getElementById("createGameMenuPlayerContainer").appendChild(clonedDiv);
}

function addJoinGameMenuMapItem(newId, mapName){
    //this function adds another Map to choose from from the join game menu
    let clonedDiv = document.getElementById("joinGameRoomMenu").querySelector("#joinGameMenuMapItemToClone").cloneNode(true);
    clonedDiv.style.display = "flex";
    clonedDiv.id = "gameMenuMapItemId_" + newId;
    clonedDiv.innerText = mapName;
    let parentDiv = document.getElementById("joinGameMenuMapContainer");
    parentDiv.insertBefore(clonedDiv, parentDiv.firstChild);
}
function addJoinGameMenuMapItem_(newId, mapName){
    //this function adds another Map to choose from from the join game menu
    let clonedDiv = document.getElementById("joinGameRoomMenu").querySelector("#joinGameMenuMapItemToClone").cloneNode(true);
    clonedDiv.style.display = "flex";
    clonedDiv.id = "gameMenuMapItemId_" + newId;
    clonedDiv.innerText = mapName;
    document.getElementById("joinGameMenuMapContainer").appendChild(clonedDiv);
}

function selectJoinGameMenuMapItem(itemId){
    //this function adds the "selected" class to a certain game menu map item
    //this makes it darker
    //when the game starts this is going to be the map that the game is going to be played on

    //remove the selected class from the previous selected element
    let previousElement = document.getElementById("joinGameMenuMapContainer").querySelector(".selected");
    if(previousElement != undefined){
        if(previousElement.id == itemId){
            return;
        }
        previousElement.classList.remove("selected");
    }

    changeGameMap(returnOnlyNumbersFromString(itemId));

    //add class to the new element
    let newElementId = "#" + itemId;
    let newElement = document.getElementById("joinGameMenuMapContainer").querySelector(newElementId);
    if(newElement != undefined){
        newElement.classList.add("selected");
        document.getElementById("joinGameMenuMap").querySelector("#joinGameMenuMapName").innerHTML = newElement.innerText;
    }
}

function addJoinGameMenuPlayerItem(newId, playerName){
    //this function adds another Map to choose from from the join game menu

    if(document.getElementById("addJoinGameMenuPlayerItem_" + newId) != undefined){
        return;
    }

    let clonedDiv = document.getElementById("joinGameRoomMenu").querySelector("#joinGameMenuPlayerItemToClone").cloneNode(true);
    clonedDiv.style.display = "inline-block";
    clonedDiv.id = "addJoinGameMenuPlayerItem_" + newId;
    clonedDiv.querySelector(".joinGameMenuPlayerItemName").innerText = playerName;
    document.getElementById("joinGameMenuPlayerContainer").appendChild(clonedDiv);
}

function gameMenuPlayerClick(playerId, playerName, x_, y_){
    let playerClickMenu = document.getElementById("joinGameRoomMenu").querySelector("#joinGameRoomOnPlayerClick");
    playerClickMenu.style.display = "absolute";
    playerClickMenu.style.left = '10px';
    playerClickMenu.style.top = '10px';
}

function gameMenuOnInputChange(theElement){
    let newObjectId;

    try{
        newObjectId = JSON.parse(theElement.value);
    }catch(error){
        newObjectId = null;
    }

    let playerId = returnOnlyNumbersFromString(theElement.parentNode.parentNode.id);

    if(currGame && currGame.players){
        currGame.players[playerId].objectId = newObjectId;
    }
}

function addChooseMapContainerListItem(mapName, creatorName, newId){
    //this function adds another Map to choose from from the map edit menu (a map that is made by the current user)
    let clonedDiv = document.getElementById("mapChoose").querySelector("#mapChooseContainerListElementCopy").cloneNode(true);
    clonedDiv.style.display = "flex";
    clonedDiv.id = "mapChooseContainerListElement_" + newId;
    clonedDiv.querySelector(".mapChooseContainerListElementMapName").innerText = mapName;
    clonedDiv.querySelector(".mapChooseContainerListElementCreatorName").innerText = creatorName;
    let parentDiv = document.getElementById("mapChooseContainerListElementsHolder");
    parentDiv.insertBefore(clonedDiv, parentDiv.firstChild);
}

function addChooseMapContainerListItem_(mapName, creatorName, newId){
    //this function adds another Map to choose from from the map edit menu (a map that is NOT made by the current user)
    let clonedDiv = document.getElementById("mapChoose").querySelector("#mapChooseContainerListElementCopy_").cloneNode(true);
    clonedDiv.style.display = "flex";
    clonedDiv.id = "mapChooseContainerListElement_" + newId;
    clonedDiv.querySelector(".mapChooseContainerListElementMapName").innerText = mapName;
    clonedDiv.querySelector(".mapChooseContainerListElementCreatorName").innerText = creatorName;
    let parentDiv = document.getElementById("mapChooseContainerListElementsHolder");
    parentDiv.appendChild(clonedDiv);
}

// function loadMapsForChooseMap(){
//     if(user){
//         document.getElementById("mapChooseContainerListElementsHolder").innerHTML = "";
//     }else{
//         alert("You need to login/register.");
//     }
// }

function chooseMapEditClick(theElement){
    //this function gets the id of the game that the player wants to join and attempt a connection
    let parentElement = theElement.parentElement.parentElement;
    let mapId = returnOnlyNumbersFromString(parentElement.id);

    chooseMapButton(mapId);
}

function logOut(){
    user = {};
    switchMenus("#login", "inline-block");
}

function toMapChoose(){
    switchMenus("#mapChoose", "inline-block");
    unsubscribe();
    map.stop();
    engineSetup.stop();
}

function toGameList(){
    switchMenus("#gameList", "inline-block");
    
    if(currGame != undefined){
        disconnectFromGame();
    }

    unsubscribe();
    getPublicGames();
    map.stop();
    engineSetup.stop();
}

function onRecievedPublicGame(theGame){
    addGameListContainerListItem(theGame.mapName, theGame.gameHost, theGame.gameId);
}

function toMapList(){
    switchMenus("#mapList", "inline-block");
    document.getElementById("mapListContainerListElementsHolder").innerHTML = "";
    unsubscribe();
    getPublicMaps();
    map.stop();
    engineSetup.stop();
}

function onRecievedPublicMap(theMap){
    addMapListContainerListItem(theMap.name, theMap.host_name, theMap.id);
}

function addGameListContainerListItem(mapName, hostName, newId){
    //this function adds another Game to choose from from the game list menu
    let clonedDiv = document.getElementById("gameList").querySelector("#gameListContainerListElementCopy").cloneNode(true);
    clonedDiv.style.display = "flex";
    clonedDiv.id = "gameListContainerListElement_" + newId;
    clonedDiv.querySelector(".gameListContainerListElementMapName").innerText = mapName;
    clonedDiv.querySelector(".gameListContainerListElementHostName").innerText = hostName;
    document.getElementById("gameListContainerListElementsHolder").appendChild(clonedDiv);
}

function gameListElementClick(theElement){
    //this function gets the id of the game that the player wants to join and attempt a connection
    let parentElement = theElement.parentElement.parentElement;
    let gameId = returnOnlyNumbersFromString(parentElement.id);

    switchMenus("#joinGameRoomMenu", "inline-block")
    
    joinGame(gameId);
}

function onStartGameClick(){
    startGame(currGame.id, currGame.players);
}

function addMapListContainerListItem(mapName, creatorName, newId){
    //this function adds another Game to choose from from the game list menu
    let clonedDiv = document.getElementById("mapList").querySelector("#mapListContainerListElementCopy").cloneNode(true);
    clonedDiv.style.display = "flex";
    clonedDiv.id = "mapListContainerListElement_" + newId;
    clonedDiv.querySelector(".mapListContainerListElementMapName").innerText = mapName;
    clonedDiv.querySelector(".mapListContainerListElementCreatorName").innerText = creatorName;
    document.getElementById("mapListContainerListElementsHolder").appendChild(clonedDiv);
}

function mapListSaveMapClick(theElement){
    //this function gets the id of the game that the player wants to join and attempt a connection
    let parentElement = theElement.parentElement.parentElement;
    let mapId = returnOnlyNumbersFromString(parentElement.id);

    saveMap(mapId);
}

function mapListPreviewMapClick(theElement, onBackClick){
    //this function gets the id of the game that the player wants to join and attempt a connection
    let parentElement = theElement.parentElement.parentElement;
    let mapId = returnOnlyNumbersFromString(parentElement.id);

    switchMenus(".map-edit-div", "flex");
    document.querySelector(".map-edit-div").querySelector(".tool-holder").style.display = "none";
    document.querySelector(".map-edit-div").querySelector(".canvas-holder").style.width = "100%";
    document.querySelector(".map-edit-div").querySelector("#mapEditBackButton").style.display = "inline-block";
    if(onBackClick == 1){
        document.querySelector(".map-edit-div").querySelector("#mapEditBackButton").onclick = toMapChoose;
    }else if(onBackClick == 2){
        document.querySelector(".map-edit-div").querySelector("#mapEditBackButton").onclick = toMapList;
    }
    let newMap = new Map();
    newMap.id = mapId;
    mapEdit.startMapEditing(newMap, false);
    loadMap(mapId);
    onRecievingMap = 1;
}

function mapListRemoveMapClick(theElement){
    //this function gets the id of the map that the player wants to remove
    let parentElement = theElement.parentElement.parentElement;
    let mapId = returnOnlyNumbersFromString(parentElement.id);

    parentElement.remove();

    delete user.mapIds[mapId];

    removeMap(mapId);
}

function mapListDeleteMapClick(theElement){
     //this function deletes a map
     let parentElement = theElement.parentElement.parentElement;
     let mapId = returnOnlyNumbersFromString(parentElement.id);
 
     parentElement.remove();
 
     delete user.mapIds[mapId];
 
     deleteMap(mapId);
}

function onRecievedUserFriend(friend){
    user.friendIds[friend.id] = friend.username;

    //add to friend display menu
}

function onRecievedUserMap(map){
    if(document.getElementById(("mapChooseContainerListElement_"+map.id))){
        return;
    }

    user.mapIds[map.id] = map;

    if(map.creator_id == user.id){
        addChooseMapContainerListItem(map.name, user.username, map.id);
        addCreateGameMenuMapItem(map.id, map.name);
    }else{
        addChooseMapContainerListItem_(map.name, map.creator, map.id);
        addJoinGameMenuMapItem_(map.id, map.name);
    }
}

function hostGameClick(){
    switchMenus('#createGameRoomMenu', 'inline-block');

    hostGame();
}

function changeGameHostDisplay(theGame){
    let newHostName = theGame.hostName;
    let newMapName = theGame.mapName;
    if(currGame != undefined){
        if(currGame.hostId == user.id){
            let element = document.getElementById("createGameRoomMenu").querySelector("#createGameMenuPlayerText");
            element.innerText = "Players:   " + newHostName + " (host)";
        }else{
            let element = document.getElementById("joinGameRoomMenu").querySelector("#joinGameMenuPlayerText");
            element.innerText = "Players:   " + newHostName + " (host)";
            element = document.getElementById("joinGameRoomMenu").querySelector("#joinGameMenuMapName");
            element.innerText = newMapName;
        }
    }
}

function changeJoinGameMenuMapName(newMapName){
    let element = document.getElementById("joinGameRoomMenu").querySelector("#joinGameMenuMapName");
    element.innerText = newMapName;
}

function createGameKickClick(userId){
    let id = returnOnlyNumbersFromString(userId);
    kickPlayerFromGame(id);
}

function createGameHostClick(userId){
    let id = returnOnlyNumbersFromString(userId);
    makePlayerHost(id);
}

//addItemTool functions
function onRotatationChange(newVal){
    let objectId = document.querySelector(".map-edit-div").querySelector("#editObjectTool").querySelector("#editObjectToolP").innerText;
    objectId = returnOnlyNumbersFromString(objectId);

    if(isNaN(objectId)) return;

    outputUpdate(newVal, 'editObjectToolRotation');
    newVal = gradToRad(newVal);

    changeObjectRotation(map.currMap.id, objectId, newVal);
}

function onColorChange(newVal, type = undefined){
    //type: "red", "green", "blue" or undefined
    let objectId = document.querySelector(".map-edit-div").querySelector("#editObjectTool").querySelector("#editObjectToolP").innerText;
    objectId = returnOnlyNumbersFromString(objectId);

    if(isNaN(objectId)) return;

    let newColor = map.currMap.objects[objectId].colorChange;
    let colorR = map.currMap.objects[objectId].colorR;
    let colorG = map.currMap.objects[objectId].colorG;
    let colorB = map.currMap.objects[objectId].colorB;

    if(type == undefined){
        outputUpdate(newVal, 'editObjectToolColor');

        newColor = parseFloat(newVal);
    }else{
        if(type == "red"){
            outputUpdate(newVal, 'editObjectToolColorRed');
    
            colorR = parseInt(newVal);
        }
        if(type == "green"){
            outputUpdate(newVal, 'editObjectToolColorGreen');
    
            colorG = parseInt(newVal);
        }
        if(type == "blue"){
            outputUpdate(newVal, 'editObjectToolColorBlue');
    
            colorB = parseInt(newVal);
        }
    }

    changeObjectColor(map.currMap.id, objectId, newColor, colorR, colorG, colorB);
}

function onSizeChange(newVal){
    //type: "red", "green", "blue" or undefined
    let objectId = document.querySelector(".map-edit-div").querySelector("#editObjectTool").querySelector("#editObjectToolP").innerText;
    objectId = returnOnlyNumbersFromString(objectId);

    if(isNaN(objectId)) return;

    outputUpdate(newVal, 'editObjectToolSize');

    changeObjectSize(map.currMap.id, objectId, newVal);
}

function changeVariableToolAddRow(id, name, type, value){
    let divToClone = document.getElementById("changeVariableToolRowToCopy");
    let theClone = divToClone.cloneNode(true);
    theClone.id = "changeVariableToolRow_" + id;
    theClone.querySelector(".changeVariableName").innerHTML = name;
    theClone.querySelector(".changeVariableType").innerHTML = type;
    theClone.querySelector(".changeVariableValue").innerHTML = value;
    theClone.style.display = "table-row";
    document.getElementById("changeVariableTool").querySelector("table").appendChild(theClone);
}

function changeVariableToolPopupAddRow(id, name, type, value){
    let divToClone = document.getElementById("changeVariableToolChangeVariablePopupRowToCopy");
    let theClone = divToClone.cloneNode(true);
    theClone.id = "changeVariableToolPopupRow_" + id;
    theClone.querySelector(".changeVariableName").querySelector("input").value = name;
    theClone.querySelector(".changeVariableType").querySelector("select").value = type;
    theClone.querySelector(".changeVariableValue").querySelector("input").value = value;
    theClone.style.display = "table-row";
    document.getElementById("changeVariableToolChangeVariablePopupTableHolder").querySelector("table").appendChild(theClone);
}

function changeVariableToolAddVariableToTables(id, name, type, value){
    changeVariableToolAddRow(id, name, type, value);
    changeVariableToolPopupAddRow(id, name, type, value);
}

function changeVariableToolClearVariableTables(){
    let table1 = document.getElementById("changeVariableTool").querySelector("table");
    let table2 = document.getElementById("changeVariableTool").querySelector("#changeVariableToolChangeVariablePopupTableHolder").querySelector("table");

    let rows1 = table1.querySelectorAll("tr");
    let rows2 = table2.querySelectorAll("tr");

    for(let i in rows1){
        let row = rows1[i];
        if(row.id != undefined && row.id.length > 0 && !isNaN(returnOnlyNumbersFromString(row.id))){
            row.remove();
        }
    }

    for(let i in rows2){
        let row = rows2[i];
        if(row.id != undefined && row.id.length > 0 && !isNaN(returnOnlyNumbersFromString(row.id))){
            row.remove();
        }
    }
}

function changeVariableToolLoadVariablesToTables(variables){
    changeVariableToolClearVariableTables();
    changeVariableToolRemoveAllGlobalVariableOptiond();

    for(let key in variables){
        let currVar = variables[key];
        changeVariableToolAddVariableToTables(currVar.id, currVar.name, currVar.type, currVar.value);
        changeVariableToolAddGlobalVariableOption(currVar.id, currVar.name);
    }
}

function changeVariableToolChangeNameInTables(id, newName){
    try{
        document.getElementById("changeVariableTool").querySelector("#changeVariableToolRow_" + id).querySelector(".changeVariableName").innerHTML = newName;
        document.getElementById("changeVariableToolChangeVariablePopupTableHolder").querySelector("#changeVariableToolPopupRow_" + id).querySelector(".changeVariableName").querySelector("input").value = newName;
    }catch(error){
        console.error(error);
    }
}

function changeVariableToolChangeTypeInTables(id, newType){
    try{
        document.getElementById("changeVariableTool").querySelector("#changeVariableToolRow_" + id).querySelector(".changeVariableType").innerHTML = newType;
        document.getElementById("changeVariableToolChangeVariablePopupTableHolder").querySelector("#changeVariableToolPopupRow_" + id).querySelector(".changeVariableType").querySelector("input").value = newType;
    }catch(error){
        console.error(error);
    }
}

function changeVariableToolChangeValueInTables(id, newValue){
    try{
        document.getElementById("changeVariableTool").querySelector("#changeVariableToolRow_" + id).querySelector(".changeVariableValue").innerHTML = newValue;
        document.getElementById("changeVariableToolChangeVariablePopupTableHolder").querySelector("#changeVariableToolPopupRow_" + id).querySelector(".changeVariableValue").querySelector("input").value = newValue;
    }catch(error){
        console.error(error);
    }
}

//for testing
map.currMap = new Map();
//asdf

function changeVariableToolPopupAddClick(){
    let theParent = document.getElementById("changeVariableToolChangeVariablePopupAddVarableDivContentHolder");
    let newName = theParent.querySelector('input[name=newVarName]').value;
    let newType = theParent.querySelector('select[name=newVarType]').value;
    let newValue;

    if(newType == "bool"){
        newValue = theParent.querySelector('select[name=newVarBoolValue]').value;
        newValue = (newValue === 'true');
    }else{
        newValue = theParent.querySelector('input[name=newVarValue]').value;
    }

    if(newName == "" || newType == "" || newValue == ""){
        alert("You need to fill all the boxes to add a new variable!");
        return;
    }

    if(newType == "number" && !isStringNumber(newValue)){
        alert("You need to set the value as the chosen type!");
        return;
    }
    
    if(isStringNumber(newValue)){
        newValue = parseInt(newValue);
    }

    theParent.querySelector('input[name=newVarName]').value = "";
    theParent.querySelector('input[name=newVarValue]').value = "";

    try{
        if(map.currMap.config == undefined) map.currMap.config = new Config();
        if(map.currMap.config.globalVars == undefined) map.currMap.config.globalVars = {};
        map.currMap.config.globalVars[map.currMap.config.idCount] = new Variable(map.currMap.config.idCount, newName, newType, newValue);
        map.currMap.config.idCount++;

        changeVariableToolAddVariableToTables(map.currMap.config.idCount-1, newName, newType, newValue);
        changeVariableToolAddGlobalVariableOption(map.currMap.config.idCount-1, newName);
    }catch(error){
        console.error(error);
        changeVariableToolAddVariableToTables(1, newName, newType, newValue);
    }

    document.getElementById("changeVariableToolChangeVariablePopupAddVarableDiv").style.display="none"
}

function changeVariableToolSaveButtonClick(){
    saveVariables(map.currMap.id, map.currMap.config.globalVars, map.currMap.config.idCount);
}

function changeVariableToolRemoveButtonClick(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    try{
        delete map.currMap.config.globalVars[thisId];

        changeVariableToolRemoveGlobalVariableOption(thisId);

        document.getElementById("changeVariableToolChangeVariablePopupTableHolder").querySelector("#changeVariableToolPopupRow_" + thisId).remove();
    
        document.getElementById("changeVariableTool").querySelector("table").querySelector("#changeVariableToolRow_" + thisId).remove();
    }catch(error){
        console.error(error);
    }
}

function changeVariableToolNameOnChnage(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    let newName = document.getElementById("changeVariableToolChangeVariablePopupTableHolder").querySelector("#changeVariableToolPopupRow_" + thisId).querySelector(".changeVariableName").querySelector("input").value;

    try{
        map.currMap.config.globalVars[thisId].name = newName;
    }catch(error){
        console.error(error);
    }

    document.getElementById("changeVariableTool").querySelector("table").querySelector("#changeVariableToolRow_" + thisId).querySelector(".changeVariableName").innerHTML = newName;
}

function changeVariableToolTypeOnChnage(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    let newType = document.getElementById("changeVariableToolChangeVariablePopupTableHolder").querySelector("#changeVariableToolPopupRow_" + thisId).querySelector(".changeVariableType").querySelector("select").value;

    try{
        map.currMap.config.globalVars[thisId].type = newType;
    }catch(error){
        console.error(error);
    }

    document.getElementById("changeVariableTool").querySelector("table").querySelector("#changeVariableToolRow_" + thisId).querySelector(".changeVariableType").innerHTML = newType;
}

function changeVariableToolValueOnChnage(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    let newValue = document.getElementById("changeVariableToolChangeVariablePopupTableHolder").querySelector("#changeVariableToolPopupRow_" + thisId).querySelector(".changeVariableValue").querySelector("input").value;

    try{
        map.currMap.config.globalVars[thisId].value = newValue;
    }catch(error){
        console.error(error);
    }

    document.getElementById("changeVariableTool").querySelector("table").querySelector("#changeVariableToolRow_" + thisId).querySelector(".changeVariableValue").innerHTML = newValue;
}

function changeVariableToolChangeVariablePopupAddVarableDivSelectType(thisValue){
    let theElement = document.getElementById("changeVariableTool").querySelector("#changeVariableToolChangeVariablePopupAddVarableDivContentHolder");
    
    if(thisValue == "bool"){
        theElement.querySelector("#changeVariableToolChangeVariablePopupAddVarableDivSelectValueInput").style.display = "none";
        theElement.querySelector("#changeVariableToolChangeVariablePopupAddVarableDivSelectBoolValue").style.display = "inline-block";
    }else{
        theElement.querySelector("#changeVariableToolChangeVariablePopupAddVarableDivSelectValueInput").style.display = "inline-block";
        theElement.querySelector("#changeVariableToolChangeVariablePopupAddVarableDivSelectBoolValue").style.display = "none";
    }
}

function changeVariableToolAddGlobalVariableOption(id, name){
    let parentElement = document.getElementById("editEventsToolConditionPopupGlobalVariablesInputToCopy").querySelector("select");
    let theCopy = document.getElementById("editEventsToolConditionPopupGlobalVariablesInputToCopy").querySelector("#editEventsToolConditionPopupGlobalVariablesInputOptionToCopy").cloneNode(true);
    theCopy.removeAttribute("id");
    theCopy.innerText = name;
    theCopy.value = id;
    theCopy.style.display = "block";
    parentElement.appendChild(theCopy);
}

function changeVariableToolRemoveGlobalVariableOption(id){
    let parentElement = document.getElementById("editEventsToolConditionPopupGlobalVariablesInputToCopy").querySelector("select");
    let options = parentElement.querySelectorAll("option");

    for(let i in options){
        let theOtption = options[i];
        if(theOtption.value == id){
            theOtption.remove();
        }
    }
}

function changeVariableToolRemoveAllGlobalVariableOptiond(){
    let parentElement = document.getElementById("editEventsToolConditionPopupGlobalVariablesInputToCopy").querySelector("select");
    let options = parentElement.querySelectorAll("option");

    for(let i = 2; i < options.length; i++){
        let theOtption = options[i];
        theOtption.remove();
    }
}

function changeVariableToolAddObjectVariableOption(id, name){
    let parentElement = document.getElementById("editEventsToolConditionPopupObjectVariablesInputToCopy").querySelector("select");
    let theCopy = document.getElementById("editEventsToolConditionPopupObjectVariablesInputToCopy").querySelector("#editEventsToolConditionPopupObjectVariablesInputOptionToCopy").cloneNode(true);
    theCopy.removeAttribute("id");
    theCopy.innerText = name;
    theCopy.value = id;
    theCopy.style.display = "block";
    parentElement.appendChild(theCopy);
}

function changeVariableToolAddAllObjectVariableOptions(variables){
    for(let i in variables){
        let theVariable = variables[i];
        changeVariableToolAddObjectVariableOption(theVariable.id, theVariable.name);
    }
}

function changeVariableToolRemoveObjectVariableOption(id){
    let parentElement = document.getElementById("editEventsToolConditionPopupObjectVariablesInputToCopy").querySelector("select");
    let options = parentElement.querySelectorAll("option");

    for(let i in options){
        let theOtption = options[i];
        if(theOtption.value == id){
            theOtption.remove();
        }
    }
}

function changeVariableToolRemoveAllObjectVariableOptiond(){
    let parentElement = document.getElementById("editEventsToolConditionPopupObjectVariablesInputToCopy").querySelector("select");
    let options = parentElement.querySelectorAll("option");

    for(let i = 2; i < options.length; i++){
        let theOtption = options[i];
        theOtption.remove();
    }
}

//edit object tool html functions
function setEditObjectToolInfo(theObjectId){
    let editObjectToolElement = document.querySelector(".map-edit-div").querySelector("#editObjectTool");

    editObjectToolElement.querySelector("#editObjectToolP").innerText = theObjectId;

    if(map.currMap != undefined && map.currMap.objects[theObjectId] != undefined){
        let inputs = document.getElementById("editObjectTool").querySelectorAll("input");
        inputs[0].value = radToGrad(map.currMap.objects[theObjectId].rotation);
        outputUpdate(radToGrad(map.currMap.objects[theObjectId].rotation), 'editObjectToolRotation');

        inputs[1].value = map.currMap.objects[theObjectId].colorChange;
        outputUpdate(map.currMap.objects[theObjectId].colorChange, 'editObjectToolColor');

        if(map.currMap.objects[theObjectId].colorR == undefined) map.currMap.objects[theObjectId].colorR = 0;
        if(map.currMap.objects[theObjectId].colorG == undefined) map.currMap.objects[theObjectId].colorG = 0;
        if(map.currMap.objects[theObjectId].colorB == undefined) map.currMap.objects[theObjectId].colorB = 0;
        
        inputs[2].value = map.currMap.objects[theObjectId].colorR;
        outputUpdate(map.currMap.objects[theObjectId].colorR, 'editObjectToolColorRed');
        
        inputs[3].value = map.currMap.objects[theObjectId].colorG;
        outputUpdate(map.currMap.objects[theObjectId].colorG, 'editObjectToolColorGreen');
        
        inputs[4].value = map.currMap.objects[theObjectId].colorB;
        outputUpdate(map.currMap.objects[theObjectId].colorB, 'editObjectToolColorBlue');

        if(map.currMap.objects[theObjectId].scale == undefined) map.currMap.objects[theObjectId].scale = 1;

        inputs[5].value = map.currMap.objects[theObjectId].scale;
        outputUpdate(map.currMap.objects[theObjectId].scale, 'editObjectToolSize');
    }
}

function clearEditObjectToolChangeObjectType(){
    let theElement = document.getElementById("editObjectTool").querySelector("#editObjectToolChangeObjectType");

    let options = theElement.querySelectorAll("option");
    if(options.length > 2){
        for(let i = 2; i < options.length; i++){
            options[i].remove();
        }
    }
}
clearEditObjectToolChangeObjectType();

function addEditObjectToolChangeObjectTypeOption(value, text){
    let theElement = document.getElementById("editObjectTool").querySelector("#editObjectToolChangeObjectType");
    let optionToCopy = document.getElementById("editObjectTool").querySelector("#editObjectToolChangeObjectTypeOptionToCopy");

    let theCopy = optionToCopy.cloneNode(true);
    theCopy.style.display = "block";
    theCopy.removeAttribute("id");
    theCopy.value = value;
    theCopy.innerText = text;

    theElement.appendChild(theCopy);
}

function removeEditObjectToolChangeObjectTypeOption(value){
    let theElement = document.getElementById("editObjectTool").querySelector("#editObjectToolChangeObjectType");
    
    let options = theElement.querySelectorAll("option");

    for(let i in options){
        let option = options[i];
        if(option.value == value){
            option.remove();
        }
    }
}

function editObjectToolChangeObjectTypeOnOptionChange(newValue){
    let objectId = document.querySelector(".map-edit-div").querySelector("#editObjectTool").querySelector("#editObjectToolP").innerText;
    objectId = returnOnlyNumbersFromString(objectId);

    if(isNaN(objectId)) return;

    try{
        changeObjectType(map.currMap.id, objectId, newValue)
    }catch(error){
        console.error(error);
    }
}

function editObjectToolSetPositionButonClick(){
    let objectId = document.querySelector(".map-edit-div").querySelector("#editObjectTool").querySelector("#editObjectToolP").innerText;
    objectId = returnOnlyNumbersFromString(objectId);

    if(isNaN(objectId)) return;

    isChangingObjectPosition = true;

    document.getElementById("editObjectToolSettingPositionDiv").style.display = "inline-block";
    document.getElementById("editObjectToolDivHolder").style.display = "none";
}

function editObjectToolCloseSetPositionButonClick(){
    isChangingObjectPosition = false;

    document.getElementById("editObjectToolSettingPositionDiv").style.display = "none";
    document.getElementById("editObjectToolDivHolder").style.display = "inline-block";
}

//edit event html functions

function editEventsToolAddRow(id, name){
    let divToClone = document.getElementById("editEventsToolRowToCopy");
    let theClone = divToClone.cloneNode(true);
    theClone.id = "editEventsToolRow_" + id;
    theClone.querySelector(".editEventsName").innerHTML = name;
    theClone.style.display = "table-row";
    document.getElementById("editEventsTool").querySelector("table").appendChild(theClone);
}

function editEventsToolPopupAddRow(id, name){
    let divToClone = document.getElementById("editEventsToolEditEventsPopupRowToCopy");
    let theClone = divToClone.cloneNode(true);
    theClone.id = "editEventsToolPopupRow_" + id;
    theClone.querySelector(".editEventsName").querySelector("input").value = name;
    theClone.style.display = "table-row";
    document.getElementById("editEventsToolEditEventsPopupTableHolder").querySelector("table").appendChild(theClone);
}

function editEventsToolAddEventToTables(id, name){
    editEventsToolAddRow(id, name);
    editEventsToolPopupAddRow(id, name);
}

function editEventsToolClearEventTables(){
    let table1 = document.getElementById("editEventsTool").querySelector("table");
    let table2 = document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsPopupTableHolder").querySelector("table");

    let rows1 = table1.querySelectorAll("tr");
    let rows2 = table2.querySelectorAll("tr");

    for(let i in rows1){
        let row = rows1[i];
        if(row.id != undefined && row.id.length > 0 && !isNaN(returnOnlyNumbersFromString(row.id))){
            row.remove();
        }
    }

    for(let i in rows2){
        let row = rows2[i];
        if(row.id != undefined && row.id.length > 0 && !isNaN(returnOnlyNumbersFromString(row.id))){
            row.remove();
        }
    }
}

function editEventsToolLoadEventsToTables(events){
    editEventsToolClearEventTables();

    for(let key in events){
        let currEvent = events[key];
        editEventsToolAddEventToTables(currEvent.id, currEvent.name);
    }
}

function editEventsToolPopupAddClick(){
    let theParent = document.getElementById("editEventsToolEditEventsPopupAddVarableDivContentHolder");
    let newName = theParent.querySelector('input[name=newVarName]').value;

    if(newName == ""){
        alert("You need to fill all the boxes to add a new event!");
        return;
    }

    theParent.querySelector('input[name=newVarName]').value = "";

    try{
        if(map.currMap.config == undefined) map.currMap.config = new Config();
        if(map.currMap.config.globalEvents == undefined) map.currMap.config.globalEvents = {};
        map.currMap.config.globalEvents[map.currMap.config.idCount] = new Event(map.currMap.config.idCount, newName);
        map.currMap.config.idCount++;

        editEventsToolAddEventToTables(map.currMap.config.idCount-1, newName);
    }catch(error){
        console.error(error);
        editEventsToolAddEventToTables(1, newName);
    }

    document.getElementById("editEventsToolEditEventsPopupAddVarableDiv").style.display="none"
}

function editEventToolRemoveButtonClick(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    try{
        delete map.currMap.config.globalEvents[thisId];
    }catch(error){
        console.error(error);
    }

    document.getElementById("editEventsToolEditEventsPopupTableHolder").querySelector("#editEventsToolPopupRow_" + thisId).remove();

    document.getElementById("editEventsTool").querySelector("table").querySelector("#editEventsToolRow_" + thisId).remove();
}

function editEventToolNameOnChnage(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    let newName = document.getElementById("editEventsToolEditEventsPopupTableHolder").querySelector("#editEventsToolPopupRow_" + thisId).querySelector(".editEventsName").querySelector("input").value;

    try{
        map.currMap.config.globalVars[thisId].name = newName;
    }catch(error){
        console.error(error);
    }

    document.getElementById("editEventsTool").querySelector("table").querySelector("#editEventsToolRow_" + thisId).querySelector(".editEventsName").innerHTML = newName;
}

function editEventsConditionPopupAddVariableChaneOption(parentElement, name_, id_){
    let optionToCopy = parentElement.querySelector("option");

    let clonedDiv = optionToCopy.cloneNode(true);
    clonedDiv.style.display = "block";
    clonedDiv.innerText = name_;
    clonedDiv.value = id_;
    parentElement.querySelector(".editEventsToolEditEventsConditionPopupDivTreeElementDivVariableElements").querySelector("select").appendChild(clonedDiv);
}

function editEventsConditionPopupRemoveVariableChaneOption(parentElement, value_){
    let options = parentElement.querySelectorAll("option");
    for(let i = 1; i < options.length; i++){
        if(options[i] != undefined && options[i].value == value_){
            delete options[i];
        }
    }
}

function editEventsConditionPopupSetVariableChaneOptions(parentElement){
    let oldOptions = parentElement.querySelectorAll("option");
    for(let i = 1; i < oldOptions.length; i++){
        if(oldOptions[i] != undefined){
            delete oldOptions[i];
        }
    }

    try{
        let globalVars = map.currMap.config.globalVars;

        for(let key in globalVars){
            editEventsConditionPopupAddVariableChaneOption(parentElement, globalVars[key].name, globalVars[key].id);
        }
    }catch(error){
        console.error(error);
    }
}

function editEventsToolSaveButtonClick(){
    saveEvents(map.currMap.id, map.currMap.config.globalEvents, map.currMap.config.idCount);
}

async function editEventsToolChooseObjectButtonClick(theButton, toGet, parameter){
    //toGet - "object", "unit" or "ray"
    //parameter - "id", "x", "y", "z", etc.

    //get the expression and the new value (the new value is generated by pressing on an object, unit or the ray and getting one of its properties)
    let expId = returnOnlyNumbersFromString(theButton.parentNode.parentNode.parentNode.parentNode.id);
    let thisElement = theButton.parentNode.parentNode.parentNode.parentNode;
    let thisExp = eventStuff.returnExpFromId(eventStuff.currEvent[eventStuff.editingParameter], expId);
    let value = await mapEdit.getProperty(toGet, parameter);
    // console.log(value);
   
    try{
    //make the child of the expression a string or a number
    let nextExpElement;
    if(!eventStuff.isEditingObjectEvents){
        nextExpElement = thisElement.querySelectorAll(".editEventsToolEditEventsConditionPopupDivTreeElementDiv")[1];
    }else{
        nextExpElement = thisElement.querySelectorAll(".editObjectsToolEditObjectsConditionPopupDivTreeElementDiv")[1];
    }
    let elementSelect = nextExpElement.querySelector("select");

    elementSelect.value = typeof value;
    eventStuff.onTypeChange(elementSelect);
    
    //update its value
    let elementInput = nextExpElement.querySelector("input");
    elementInput.value = value;
    eventStuff.setValueOnChange(elementInput);
    //update the tree and the equasion
    }catch(error){
        console.error(error);
    }
}

//edit objects functions
function editObjectsToolAddRow(id, name){
    let divToClone = document.getElementById("editObjectsToolRowToCopy");
    let theClone = divToClone.cloneNode(true);
    theClone.id = "editObjectsToolRow_" + id;
    theClone.querySelector(".editObjectsName").innerHTML = name;
    theClone.style.display = "table-row";
    document.getElementById("editObjectsTool").querySelector("table").appendChild(theClone);

    addEditObjectToolChangeObjectTypeOption(id, name);
}

function editObjectsToolPopupAddRow(id, name){
    let divToClone = document.getElementById("editObjectsToolEditObjectsPopupRowToCopy");
    let theClone = divToClone.cloneNode(true);
    theClone.id = "editObjectsToolPopupRow_" + id;
    theClone.querySelector(".editObjectsName").querySelector("input").value = name;
    theClone.style.display = "table-row";
    document.getElementById("editObjectsToolEditObjectsPopupTableHolder").querySelector("table").appendChild(theClone);
}

function editObjectsToolAddObjectToTables(id, name){
    editObjectsToolAddRow(id, name);
    editObjectsToolPopupAddRow(id, name);
}

function editObjectsToolPopupAddClick(){
    let theParent = document.getElementById("editObjectsToolEditObjectsPopupAddObjectDivContentHolder");
    let newName = theParent.querySelector('input[name=newObjName]').value;

    if(newName == ""){
        alert("You need to fill all the boxes to add a new object!");
        return;
    }

    theParent.querySelector('input[name=newObjName]').value = "";

    try{
        if(map.currMap.config == undefined) map.currMap.config = new Config();
        map.currMap.config.objectTypes[map.currMap.config.idCount] = new ObjectType(map.currMap.config.idCount, newName);
        map.currMap.config.idCount++;

        editObjectsToolAddObjectToTables(map.currMap.config.idCount-1, newName);
    }catch(error){
        console.error(error);
        editObjectsToolAddObjectToTables(1, newName);
    }

    document.getElementById("editObjectsToolEditObjectsPopupAddObjectDiv").style.display="none"
}

function editObjectsToolRemoveButtonClick(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    try{
        delete map.currMap.config.objectTypes[thisId];
    }catch(error){
        console.error(error);
    }

    removeEditObjectToolChangeObjectTypeOption(thisId);

    document.getElementById("editObjectsToolEditObjectsPopupTableHolder").querySelector("#editObjectsToolPopupRow_" + thisId).remove();

    document.getElementById("editObjectsTool").querySelector("table").querySelector("#editObjectsToolRow_" + thisId).remove();
}

function editObjectsToolNameOnChnage(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    let newName = document.getElementById("editObjectsToolEditObjectsPopupTableHolder").querySelector("#editObjectsToolPopupRow_" + thisId).querySelector(".editObjectsName").querySelector("input").value;

    try{
        map.currMap.config.objectTypes[thisId].name = newName;
    }catch(error){
        console.error(error);
    }

    document.getElementById("editObjectsTool").querySelector("table").querySelector("#editObjectsToolRow_" + thisId).querySelector(".editObjectsName").innerHTML = newName;
}

function editObjectsToolSaveButtonClick(){
    saveObjects(map.currMap.id, map.currMap.config.objectTypes, map.currMap.config.idCount);
}

function editObjectssToolClearObjectTables(){
    let table1 = document.getElementById("editObjectsTool").querySelector("table");
    let table2 = document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditObjectsPopupTableHolder").querySelector("table");

    let rows1 = table1.querySelectorAll("tr");
    let rows2 = table2.querySelectorAll("tr");

    for(let i in rows1){
        let row = rows1[i];
        if(row.id != undefined && row.id.length > 0 && !isNaN(returnOnlyNumbersFromString(row.id))){
            row.remove();
        }
    }

    for(let i in rows2){
        let row = rows2[i];
        if(row.id != undefined && row.id.length > 0 && !isNaN(returnOnlyNumbersFromString(row.id))){
            row.remove();
        }
    }
}

function editObjectsToolLoadEventsToTables(events){
    editObjectssToolClearObjectTables();
    clearEditObjectToolChangeObjectType();

    for(let key in events){
        let currEvent = events[key];
        editObjectsToolAddObjectToTables(currEvent.id, currEvent.name);
    }
}

//edit object variable functions
function editObjectsToolChangeVariablePopupAddRow(id, name, type, value){
    let divToClone = document.getElementById("editObjectsToolChangeVariablePopupRowToCopy");
    let theClone = divToClone.cloneNode(true);
    theClone.id = "editObjectsToolChangeVariableToolPopupRow_" + id;
    theClone.querySelector(".changeVariableName").querySelector("input").value = name;
    theClone.querySelector(".changeVariableType").querySelector("select").value = type;
    theClone.querySelector(".changeVariableValue").querySelector("input").value = value;
    theClone.style.display = "table-row";
    document.getElementById("editObjectsToolChangeVariablePopupTableHolder").querySelector("table").appendChild(theClone);
}

function editObjectsToolChangeVariablePopupClearVariableTables(){
    let table = document.getElementById("editObjectsToolChangeVariablePopup").querySelector("table");
    
    let rows = table.querySelectorAll("tr");

    for(let i in rows){
        let row = rows[i];
        if(row.id != undefined && row.id.length > 0 && !isNaN(returnOnlyNumbersFromString(row.id))){
            row.remove();
        }
    }
}

function editObjectsToolChangeVariablePopupLoadVariablesToTables(variables){
    editObjectsToolChangeVariablePopupClearVariableTables();

    for(let key in variables){
        let currVar = variables[key];
        editObjectsToolChangeVariablePopupAddRow(currVar.id, currVar.name, currVar.type, currVar.value);
    }
}

function editObjectsToolStartEditingObjectVars(objectId){
    objectId = returnOnlyNumbersFromString(objectId);
    currEditObjectId = objectId;

    if(map.currMap.config == undefined) map.currMap.config = new Config();
    if(map.currMap.config.objectTypes == undefined){
        map.currMap.config.objectTypes = {};
    }else{
        editObjectsToolChangeVariablePopupLoadVariablesToTables(map.currMap.config.objectTypes[objectId].vars);

        changeVariableToolRemoveAllObjectVariableOptiond();
        changeVariableToolAddAllObjectVariableOptions(map.currMap.config.objectTypes[objectId].vars);

        document.getElementById("editObjectsTool").querySelector("#editObjectsToolChangeVariablePopup"). style.display = "flex";
    }
}

function editObjectsToolStartEditingObjectEvents(objectId){
    objectId = returnOnlyNumbersFromString(objectId);
    currEditObjectId = objectId;

    if(map.currMap.config == undefined) map.currMap.config = new Config();
    if(map.currMap.config.objectTypes == undefined){
        map.currMap.config.objectTypes = {};
    }else{
        editObjectsToolEditEventsPopupLoadEventsToTables(map.currMap.config.objectTypes[objectId].events);
        
        changeVariableToolRemoveAllObjectVariableOptiond();
        changeVariableToolAddAllObjectVariableOptions(map.currMap.config.objectTypes[objectId].vars);

        document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsPopup"). style.display = "flex";
    }
}

function editObjectsToolChangeVariableToolPopupAddClick(){
    let theParent = document.getElementById("editObjectsToolChangeVariablePopupAddVarableDiv");
    let newName = theParent.querySelector('input[name=newVarName]').value;
    let newType = theParent.querySelector('select[name=newVarType]').value;
    let newValue;

    if(newType == "bool"){
        newValue = theParent.querySelector('select[name=newVarBoolValue]').value;
        newValue = (newValue === 'true');
    }else{
        newValue = theParent.querySelector('input[name=newVarValue]').value;
    }

    if(newName == "" || newType == "" || newValue == ""){
        alert("You need to fill all the boxes to add a new variable!");
        return;
    }

    if(newType == "number" && !isStringNumber(newValue)){
        alert("You need to set the value as the chosen type!");
        return;
    }
    
    if(isStringNumber(newValue)){
        newValue = parseInt(newValue);
    }

    theParent.querySelector('input[name=newVarName]').value = "";
    theParent.querySelector('input[name=newVarValue]').value = "";

    try{
        if(map.currMap.config == undefined) map.currMap.config = new Config();
        if(map.currMap.config.objectTypes == undefined) map.currMap.config.objectTypes = {};
        map.currMap.config.objectTypes[currEditObjectId].vars[map.currMap.config.objectTypes[currEditObjectId].idCount] = new Variable(map.currMap.config.objectTypes[currEditObjectId].idCount, newName, newType, newValue);
        map.currMap.config.objectTypes[currEditObjectId].idCount++;

        changeVariableToolAddObjectVariableOption(map.currMap.config.objectTypes[currEditObjectId].idCount-1, newName);

        editObjectsToolChangeVariablePopupAddRow(map.currMap.config.objectTypes[currEditObjectId].idCount-1, newName, newType, newValue);
    }catch(error){
        console.error(error);
        editObjectsToolChangeVariablePopupAddRow(1, newName, newType, newValue);
    }

    document.getElementById("editObjectsToolChangeVariablePopupAddVarableDiv").style.display="none"
}

function editObjectsToolChangeVariableToolNameOnChnage(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    let newName = document.getElementById("editObjectsToolChangeVariablePopupTableHolder").querySelector("#editObjectsToolChangeVariableToolPopupRow_" + thisId).querySelector(".changeVariableName").querySelector("input").value;

    try{
        map.currMap.config.objectTypes[currEditObjectId].vars[thisId].name = newName;
    }catch(error){
        console.error(error);
    }
}

function editObjectsToolChangeVariableToolTypeOnChnage(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    let newType = document.getElementById("editObjectsToolChangeVariablePopupTableHolder").querySelector("#editObjectsToolChangeVariableToolPopupRow_" + thisId).querySelector(".changeVariableType").querySelector("select").value;

    try{
        map.currMap.config.objectTypes[currEditObjectId].vars[thisId].type = newType;
    }catch(error){
        console.error(error);
    }
}

function editObjectsToolChangeVariableToolValueOnChnage(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    let newValue = document.getElementById("editObjectsToolChangeVariablePopupTableHolder").querySelector("#editObjectsToolChangeVariableToolPopupRow_" + thisId).querySelector(".changeVariableValue").querySelector("input").value;

    try{
        map.currMap.config.objectTypes[currEditObjectId].vars[thisId].value = newValue;
    }catch(error){
        console.error(error);
    }
}

function editObjectsToolChangeVariableToolAddVarableDivSelectType(thisValue){
    let theElement = document.getElementById("editObjectsTool").querySelector("#editObjectsToolChangeVariablePopupAddVarableDiv").querySelector("#editObjectsToolChangeVariablePopupAddVarableDivContentHolder");
    
    if(thisValue == "bool"){
        theElement.querySelector("#editObjectsToolChangeVariablePopupAddVarableDivSelectValueInput").style.display = "none";
        theElement.querySelector("#editObjectsToolChangeVariablePopupAddVarableDivSelectBoolValue").style.display = "inline-block";
    }else{
        theElement.querySelector("#editObjectsToolChangeVariablePopupAddVarableDivSelectValueInput").style.display = "inline-block";
        theElement.querySelector("#editObjectsToolChangeVariablePopupAddVarableDivSelectBoolValue").style.display = "none";
    }
}

function editObjectsToolChangeVariableToolRemoveButtonClick(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    try{
        delete map.currMap.config.objectTypes[currEditObjectId].vars[thisId];

        changeVariableToolRemoveObjectVariableOption(thisId);

        document.getElementById("editObjectsToolChangeVariablePopupTableHolder").querySelector("#editObjectsToolChangeVariableToolPopupRow_" + thisId).remove();
    }catch(error){
        console.error(error);
    }
}

//edit object event functions
function editObjectsToolEditEventsPopupAddRow(id, name){
    let divToClone = document.getElementById("editObjectsToolEditEventsPopupRowToCopy");
    let theClone = divToClone.cloneNode(true);
    theClone.id = "editObjectsToolEditEventsPopupRow_" + id;
    theClone.querySelector(".editEventsName").querySelector("input").value = name;
    theClone.style.display = "table-row";
    document.getElementById("editObjectsToolEditEventsPopupTableHolder").querySelector("table").appendChild(theClone);
}

function editObjectsToolEditEventsPopupClearEventTables(){
    let table = document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsPopup").querySelector("table");

    let rows = table.querySelectorAll("tr");

    for(let i in rows){
        let row = rows[i];
        if(row.id != undefined && row.id.length > 0 && !isNaN(returnOnlyNumbersFromString(row.id))){
            row.remove();
        }
    }
}

function editObjectsToolEditEventsPopupLoadEventsToTables(events){
    editObjectsToolEditEventsPopupClearEventTables();

    for(let key in events){
        let currEvent = events[key];
        editObjectsToolEditEventsPopupAddRow(currEvent.id, currEvent.name);
    }
}

function editObjectsToolEditEventsPopupAddClick(){
    let theParent = document.getElementById("editObjectsToolEditEventsPopupAddEventDivContentHolder");
    let newName = theParent.querySelector('input[name=newEventName]').value;

    if(newName == ""){
        alert("You need to fill all the boxes to add a new event!");
        return;
    }

    theParent.querySelector('input[name=newEventName]').value = "";

    try{
        if(map.currMap.config == undefined) map.currMap.config = new Config();
        map.currMap.config.objectTypes[currEditObjectId].events[map.currMap.config.objectTypes[currEditObjectId].idCount] = new Event(map.currMap.config.objectTypes[currEditObjectId].idCount, newName);
        map.currMap.config.objectTypes[currEditObjectId].idCount++;

        editObjectsToolEditEventsPopupAddRow(map.currMap.config.objectTypes[currEditObjectId].idCount-1, newName);
    }catch(error){
        console.error(error);
        editObjectsToolEditEventsPopupAddRow(1, newName);
    }

    document.getElementById("editObjectsToolEditEventsPopupAddEventDiv").style.display="none";
}

function editObjectsToolEditEventsPopupRemoveButtonClick(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    try{
        delete map.currMap.config.objectTypes[currEditObjectId].events[thisId];
    }catch(error){
        console.error(error);
    }

    document.getElementById("editObjectsToolEditEventsPopupTableHolder").querySelector("#editObjectsToolEditEventsPopupRow_" + thisId).remove();
}

function editObjectsToolEditEventsPopupNameOnChnage(thisId){
    thisId = returnOnlyNumbersFromString(thisId);

    let newName = document.getElementById("editObjectsToolEditEventsPopupTableHolder").querySelector("#editObjectsToolEditEventsPopupRow_" + thisId).querySelector(".editEventsName").querySelector("input").value;

    try{
        map.currMap.config.objectTypes[currEditObjectId].events[thisId].name = newName;
    }catch(error){
        console.error(error);
    }
}

function updateLoadingScreen(state){
    let loadingText = "Loading"
    for(let i = 0; i < state; i++) loadingText += ".";
    document.getElementById("loadingMenu").querySelector("#loadingText").innerText = loadingText;
}

function callUpdateLoadingScreen(lastState, timeout){
    lastState += 1;
    if(lastState > 3) lastState = 0;
    if(currGame != undefined && currGame.loadedCount != undefined){
        if(currGame.haveILoaded) updateLoadingScreen(lastState);
        updateLoadingCount(currGame.haveILoaded, currGame.loadedCount, currGame.totalCount, lastState);
    }else{
        updateLoadingScreen(lastState);
        updateLoadingCount(false, 0, 0, lastState);
    }

    //to be finished
    // if(currGame != undefined && currGame.loadedCount != undefined){
    //     updateLoadingCount(currGame.haveILoaded, currGame.loadedCount, currGame.totalCount, lastState);
    // }else{
    //     updateLoadingCount(false, 0, 0, lastState);
    // }

    setTimeout(function () { callUpdateLoadingScreen(lastState, timeout) }, timeout);
}
callUpdateLoadingScreen(0, 1000);

function updateLoadingCount(hasCurrLoaded, loaded, total, state){
    if(!hasCurrLoaded){
        document.getElementById("loadingMenu").querySelector("#loadingCount").innerText = ("" + loaded + "/" + total);
    }else{
        let displayText = ("Waiting for players to load (" + loaded + "/" + total + ")");
        for(let i = 0; i < state; i++) displayText += ".";

        document.getElementById("loadingMenu").querySelector("#loadingCount").innerText = "";
        document.getElementById("loadingMenu").querySelector("#loadingText").innerText = displayText;
    }
}

function showLoadingScreen(){
    console.log("loading screen");
    document.getElementById("loadingMenu").style.display = "block";
    console.log(document.getElementById("loadingMenu").style.display);
}

function hideLoadingScreen(){
    console.log(document.getElementById("loadingMenu").style.display);
    document.getElementById("loadingMenu").style.display = "none";
}