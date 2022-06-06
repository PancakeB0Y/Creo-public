let editMode = 0, //the mode we are editing in (0 - height edit; 1 - material edit; 2 - object place/remove)
    currMaterialIndex = 1, //the index of the material we are using to edit the map
    currItemIndex = 0,
    isInPlayMode = false,
    playerId = -1;

var isChangingObjectPosition = false;
var mapEdit = new (function (){

    let currMap={};
    this.currMap = currMap;
    var _this = this;

    function startMapEditing(newMap, createNewMap){
        currMap = newMap;
        _this.currMap = currMap;
        if(currMap){
            map.setMap(currMap);
            if(createNewMap != undefined && createNewMap == true){
                createMap(currMap); 
            }
        }
        engineSetup.setup(document.getElementById("canvas"), function (){
            engineSetup.scene.onPointerDown = castRay;
            if(currMap){
                // if(Object.keys(currMap.units).length == 0){
                //     currMap.units[0] = new Unit(0, 0, 0);
                //     ++currMap.totalUnitIds;
                // }
                map.start(currMap);
            }
            engineSetup.scene.executeWhenReady(function (){
                engineSetup.start();
            });

            camera.resetPosition();

            if(playerId != -1){
                camera.disableWheel();
            }
        });
    }
    this.startMapEditing = startMapEditing;

    function castRay(event, pickInfo, type){
        if(event.button != 0){ //ray is casted only if the button we press is the left mouse button
            return;
        }

        var ray = engineSetup.scene.createPickingRay(engineSetup.scene.pointerX, engineSetup.scene.pointerY, BABYLON.Matrix.Identity(), engineSetup.camera);	

        var hit = engineSetup.scene.multiPickWithRay(ray);
        for(let i = 0; i < hit.length; i++){
            if(hit[i].pickedMesh.id == "skyBox"){
                hit.splice(i, 1);
            }
        }


        // let a = 100;

        // for(let i = 0; i < a+1; i++){
        //     if(i != 0){
        //         addUnit(currMap.id, (i-1)*a+1, 3);
        //         console.log("i: " + (i-1)*a);
        //     }
            
        //     for(let j = 0; j < a - 1; j++){
        //         addUnit(currMap.id, i*a+j+1, 2);
        //     }
        // }

        if(currMap.units){
            if (hit.length > 0){
                if(editMode == 0){
                    let hitX = hit[0].pickedPoint._x;
                    let hitY = hit[0].pickedPoint._y;
                    let hIndex = document.getElementsByClassName("tool-holder")[0].querySelector("#heightTool").querySelector("#height_tool_index_output").value;
                    let radius = document.getElementsByClassName("tool-holder")[0].querySelector("#heightTool").querySelector("#height_tool_radius_output").value;
                    let isSmooth = document.getElementsByClassName("tool-holder")[0].querySelector("#heightTool").querySelector("#height_tool_is_filter_smooth").checked;
                    let isLeveling = document.getElementsByClassName("tool-holder")[0].querySelector("#heightTool").querySelector("#height_tool_is_filter_leveling").checked;

                    
                    changeMapHeight(currMap.id, hitX, hitY, parseFloat(radius), parseFloat(hIndex), isLeveling, isSmooth);

                    // if(isLeveling){
                    //     map.levelHeight(currMap, hitX, hitY, radius, hIndex);
                    // }else{
                    //     map.updateHeight(currMap, hitX, hitY, radius, hIndex, isSmooth);
                    // }
                }

                if(editMode == 1){
                    let hitX = hit[0].pickedPoint._x;
                    let hitY = hit[0].pickedPoint._y;
                    let radius = document.getElementsByClassName("tool-holder")[0].querySelector("#materialTool").querySelector("#material_tool_radius_output").value;
                    //map.updateTexture(currMap, hitX, hitY, radius, currMaterialIndex);
                    changeMapMaterial(currMap.id, hitX, hitY, radius, currMaterialIndex);
                }

                if(editMode == 2){
                    if(currItemIndex == 0){
                        let theUnitId;
                        let hitX;
                        let hitY;
                        for(let i = 0 ; i < hit.length; i++){
                            if(hit[i].pickedMesh.___type == 2){
                                theUnitId = hit[i].pickedMesh.___id;
                                hitX = hit[i].pickedPoint._x;
                                hitY = hit[i].pickedPoint._y;
                                break;
                            }
                        }

                        if(theUnitId !== undefined){
                            let theUnit;
                            for(let key in currMap.units){
                                if(currMap.units[key].id == theUnitId){
                                    theUnit = currMap.units[key];
                                    break;
                                }
                            }

                            if(theUnit){
                                let pointsPerUnit = units.pointsPerUnit;
                                let hitPoint = {x: hitX, y: hitY};
                                let center = {x: theUnit.x + pointsPerUnit/2, y: theUnit.y + pointsPerUnit/2};
                                let topLeft = {x: theUnit.x, y: theUnit.y};
                                let bottomLeft = {x: theUnit.x, y: theUnit.y + pointsPerUnit};
                                let topRight = {x: theUnit.x + pointsPerUnit, y: theUnit.y};
                                let bottomRight = {x: theUnit.x + pointsPerUnit, y: theUnit.y + pointsPerUnit};

                                let isLeft = isPointInTriangle(hitPoint, topLeft, center, bottomLeft);
                                let isRight = isPointInTriangle(hitPoint, topRight, center, bottomRight);
                                let isTop = isPointInTriangle(hitPoint, topLeft, center, topRight);
                                let isBottom = isPointInTriangle(hitPoint, bottomLeft, center, bottomRight);
                                
                                if(isLeft){
                                    //units.newUnit(currMap, theUnit, 1);
                                    addUnit(currMap.id, theUnit.id, 1);
                                }

                                if(isRight){
                                    //units.newUnit(currMap, theUnit, 2);
                                    addUnit(currMap.id, theUnit.id, 2);
                                }

                                if(isTop){
                                    //units.newUnit(currMap, theUnit, 3);
                                    addUnit(currMap.id, theUnit.id, 3);
                                }

                                if(isBottom){
                                    //units.newUnit(currMap, theUnit, 4);
                                    addUnit(currMap.id, theUnit.id, 4);
                                }
                            }
                        }
                    }else{
                        let theUnitId;
                        let hitX;
                        let hitY;
                        for(let i = 0 ; i < hit.length; i++){
                            if(hit[i].pickedMesh.___type == 2){
                                theUnitId = hit[i].pickedMesh.___id;
                                hitX = hit[i].pickedPoint._x;
                                hitY = hit[i].pickedPoint._y;
                                break;
                            }
                        }

                        if(theUnitId !== undefined){
                            //objects.newObj(currMap, hitX, hitY, currItemIndex);
                            let thisRotation, thisColorChange, thisColorR, thisColorG, thisColorB, thisSize;
                            if(document.getElementById("add_item_tool_is_rotation_random").checked){
                                thisRotation = Math.random()*Math.PI*2;
                            }else{
                                thisRotation = gradToRad(parseFloat(document.getElementById("add_item_tool_rotation_output").value));
                            }
                            if(document.getElementById("add_item_tool_is_color_change_random").checked){
                                thisColorChange = Math.random()*1+0.1;
                            }else{
                                thisColorChange = parseFloat(document.getElementById("add_item_tool_color_output").value) + 0.1;
                            }

                            thisColorR = parseInt(document.getElementById("add_item_tool_color_red_output").value);
                            thisColorG = parseInt(document.getElementById("add_item_tool_color_green_output").value);
                            thisColorB = parseInt(document.getElementById("add_item_tool_color_blue_output").value);

                            thisSize = parseFloat(document.getElementById("add_item_tool_size_output").value);

                            addObject(currMap.id, hitX, hitY, currItemIndex, thisRotation, thisColorChange, thisColorR, thisColorG, thisColorB, thisSize);
                        }
                    }
                }

                if(editMode == 3){
                    let theObjectId;
                    if(!isChangingObjectPosition){
                        for(let i = 0 ; i < hit.length; i++){
                            if(hit[i].pickedMesh.___type == 1){
                                theObjectId = hit[i].pickedMesh.___id;
                                break;
                            }
                        }

                        if(!map.currMap.objects[theObjectId]) return;
                        
                        setEditObjectToolInfo(theObjectId);

                        if(!map.currMap.objects[theObjectId].objectType) {
                            document.getElementById("editObjectTool").querySelector("#editObjectToolChangeObjectType").value = "undefined";
                        }
                        else {
                            if(isNaN(returnOnlyNumbersFromString(map.currMap.objects[theObjectId].objectType))){
                                document.getElementById("editObjectTool").querySelector("#editObjectToolChangeObjectType").value = "undefined";
                            }else{
                                document.getElementById("editObjectTool").querySelector("#editObjectToolChangeObjectType").value = map.currMap.objects[theObjectId].objectType;
                            }
                        }
                    }else{
                        theObjectId = document.querySelector(".map-edit-div").querySelector("#editObjectTool").querySelector("#editObjectToolP").innerText;

                        if(isNaN(theObjectId)){
                            isChangingObjectPosition = false;
                            
                            document.getElementById("editObjectToolSettingPositionDiv").style.display = "none";
                            document.getElementById("editObjectToolDivHolder").style.display = "inline-block";
                            return;
                        }

                        let theUnitId;
                        let hitX;
                        let hitY;
                        for(let i = 0 ; i < hit.length; i++){
                            if(hit[i].pickedMesh.___type == 2){
                                theUnitId = hit[i].pickedMesh.___id;
                                hitX = hit[i].pickedPoint._x;
                                hitY = hit[i].pickedPoint._y;
                                break;
                            }
                        }

                        if(theUnitId !== undefined){
                            moveObject(currMap.id, theObjectId, hitX, hitY);
                        }

                        isChangingObjectPosition = false;
                        
                        document.getElementById("editObjectToolSettingPositionDiv").style.display = "none";
                        document.getElementById("editObjectToolDivHolder").style.display = "inline-block";
                    }   
                }

                if(editMode == 4){
                    let removeMode = document.getElementById("removeChanger").value; //1 - removes single | 2 - removes in radius

                    if(removeMode == 1){
                        let removeType = document.getElementById("removeObjectChanger").value; //1 - removes object | 2 - removes unit

                        for(let i = 0; i < hit.length; i++){
                            let theObjectType = hit[i].pickedMesh.___type;
                            let theObjectId = hit[i].pickedMesh.___id;
                            if(theObjectType == removeType){
                                if(removeType == 1){
                                    //objects.remove(currMap, theObjectId);
                                    removeObject(currMap.id, theObjectId);
                                }
                                if(removeType == 2){
                                    //units.remove(currMap, theObjectId);
                                    removeUnit(currMap.id, theObjectId);
                                }
                                break;
                            }
                        }
                    }else{
                        let theUnitId;
                        let hitX;
                        let hitY;
                        
                        for(let i = 0 ; i < hit.length; i++){
                            if(hit[i].pickedMesh.___type == 2){
                                theUnitId = hit[i].pickedMesh.___id;
                                hitX = hit[i].pickedPoint._x;
                                hitY = hit[i].pickedPoint._y;
                                break;
                            }
                        }

                        if(theUnitId !== undefined){
                            let removeRadius = document.getElementById("remove_tool_radius_output").value/units.spaceBetweenPoints;

                            for(let objId in currMap.objects){
                                let theObject = currMap.objects[objId];
                                if(getDistance(hitX, hitY, theObject.y, theObject.x) <= removeRadius){
                                    //objects.remove(currMap, theObject.id);
                                    removeObject(currMap.id, theObject.id);
                                }
                            }
                        }
                    }
                }

                if(editMode == 5){
                    let theObjectId;
                    
                    for(let i = 0 ; i < hit.length; i++){
                        if(hit[i].pickedMesh.___type == 1){
                            theObjectId = hit[i].pickedMesh.___id;
                            break;
                        }
                    }

                    if(theObjectId){
                        let link = generateLink(document.location.toString(), currMap.id, theObjectId);
                        console.log(link);
                    
                        document.getElementById("inviteToolLink").style.display = "inline";
                        document.getElementById("inviteToolLink").value = link;
                    }
                }
            }else{
                if(editMode == 2){
                    if(currItemIndex == 0){
                        if(Object.keys(currMap.units).length == 0){
                            addUnit(currMap.id, -1, -1);
                        }
                    }
                }
            }
        }
    }

    function getProperty(toGet, property){
        //toGet - "object", "unit" or "ray"
        //parameter - "id", "x", "y", "z", etc.

        document.getElementsByClassName("canvas-holder")[0].style.zIndex = "1000";
        return new Promise((resolve, reject) => {
            document.getElementById("canvas").addEventListener("click", function returnPropertyValue(){
                if(event.button == 0){ //ray is casted only if the button we press is the left mouse button
        
                    var ray = engineSetup.scene.createPickingRay(engineSetup.scene.pointerX, engineSetup.scene.pointerY, BABYLON.Matrix.Identity(), engineSetup.camera);	
            
                    var hit = engineSetup.scene.multiPickWithRay(ray);
                    for(let i = 0; i < hit.length; i++){
                        if(hit[i].pickedMesh.id == "skyBox"){
                            hit.splice(i, 1);
                        }
                    }

                    
                    if(currMap.units){
                        if (hit.length > 0){
                            if(toGet == "object"){
                                let theObjectId;
                                for(let i = 0 ; i < hit.length; i++){
                                    if(hit[i].pickedMesh.___type == 1){
                                        theObjectId = hit[i].pickedMesh.___id;
                                        break;
                                    }
                                }

                                try{
                                    let toReturn;
                                    toReturn = map.currMap.objects[theObjectId][property];

                                    document.getElementsByClassName("canvas-holder")[0].style.zIndex = "auto";
                                    canvas.removeEventListener('click', returnPropertyValue);
                                    resolve(toReturn);
                                }catch (error){
                                    //nothing happens
                                    //we wait for another click
                                    console.error(error);
                                }
                            }else if(toGet == "unit"){
                                
                                let theUnitId;
                                for(let i = 0 ; i < hit.length; i++){
                                    if(hit[i].pickedMesh.___type == 2){
                                        theUnitId = hit[i].pickedMesh.___id;
                                        break;
                                    }
                                }

                                try{
                                    let toReturn;
                                    toReturn = map.currMap.units[theUnitId][property];

                                    document.getElementsByClassName("canvas-holder")[0].style.zIndex = "auto";
                                    canvas.removeEventListener('click', returnPropertyValue);
                                    resolve(toReturn);
                                }catch (errpr){
                                    //nothing happens
                                    //we wait for another click
                                    console.error(error);
                                }
                            }
                        }
                    }
                }
            });
        });
    }
    this.getProperty = getProperty;
})();