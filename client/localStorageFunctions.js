
var localStorageFunctions = new (function (){
    //localStorage.setItem()
    //localStorage.getItem()
    //localStorage.removeItem()
    //localStorage.clear()

    function checkToLogin(){
        let localStorageSessionId = localStorage.getItem("sessionId");

        if(localStorageSessionId != undefined){
            $.ajax("/tryReconnectingToSession", {
                data: JSON.stringify({sessionId: localStorageSessionId}),
                method: "POST",
                contentType: "application/json",
                success: function(response, textStatus, jqXHR) {			
                    console.log(response);
                    if(response.success) {
                        let state = response.state;
                        user = new User();
                        updateObj(user, response.object);
                        setSessionId(localStorageSessionId);
                        socket.emit('authenticate', JSON.stringify({sessionId: sessionId}));
        
                        for(key in user.friendIds){
                            socket.emit('getFriendInfo', JSON.stringify({sessionId: sessionId, id: key}));
                        }
        
                        for(key in user.mapIds){
                            socket.emit('getMapDisplayInfo', JSON.stringify({sessionId: sessionId, id: key}));
                        }
        
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
    }
    this.checkToLogin = checkToLogin;

    function afterLoginRegister(sessionId){
        localStorage.setItem("sessionId", sessionId);
    }
    this.afterLoginRegister = afterLoginRegister;
});