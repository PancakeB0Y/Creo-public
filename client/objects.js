var objects = new (function (){
    let idToMesh  = {};
    this.idToMesh = idToMesh;

    let idToCloneMesh = {}; // 1 - tree1, 2 - tree2 ...
    this.idToCloneMesh = idToCloneMesh;


    let aSize = 1;

    let scaleIndex = 0.1; //an index that scales the emissiv color of the materials of the objects

    function load(scene, callback){
        //this function loads the objects || fills idToMesh object

        //set id, path and file name of the models
        let toLoad = [
            {
                id: 1,
                path: "/models/Tree1/",
                name: "tree1.babylon"
            },
            {
                id: 2,
                path: "/models/Tree2/",
                name: "tree2.babylon"
            },
            {
                id: 3,
                path: "/models/Tree3/",
                name: "tree3.babylon"
            },
            {
                id: 4,
                path: "/models/Tree4/",
                name: "tree4.babylon"
            },
            {
                id: 5,
                path: "/models/Tree5/",
                name: "tree5.babylon"
            },
            {
                id: 6,
                path: "/models/Tree6/",
                name: "tree6.babylon"
            },
            {
                id: 7,
                path: "/models/bigStone1/",
                name: "bigStone1.babylon"
            },
            {
                id: 8,
                path: "/models/bigStone2/",
                name: "bigStone2.babylon"
            },
            {
                id: 9,
                path: "/models/bigStone3/",
                name: "bigStone3.babylon"
            },
            {
                id: 10,
                path: "/models/midStone1/",
                name: "midStone1.babylon"
            },
            {
                id: 11,
                path: "/models/midStone2/",
                name: "midStone2.babylon"
            },
            {
                id: 12,
                path: "/models/midStone3/",
                name: "midStone3.babylon"
            },
            {
                id: 13,
                path: "/models/midStone4/",
                name: "midStone4.babylon"
            },
            {
                id: 14,
                path: "/models/rubble1/",
                name: "rubble1.babylon"
            },
            {
                id: 15,
                path: "/models/rubble2/",
                name: "rubble2.babylon"
            },
            {
                id: 16,
                path: "/models/barrel/",
                name: "barrel.babylon"
            },
            {
                id: 17,
                path: "/models/box/",
                name: "box.babylon"
            },
            {
                id: 18,
                path: "/models/sandRock1/",
                name: "sandRock1.babylon"
            },
            {
                id: 19,
                path: "/models/sandRock2/",
                name: "sandRock2.babylon"
            },
            {
                id: 20,
                path: "/models/sandRock3/",
                name: "sandRock3.babylon"
            },
            {
                id: 21,
                path: "/models/sandStone1/",
                name: "sandStone1.babylon"
            },
            {
                id: 22,
                path: "/models/sandStone2/",
                name: "sandStone2.babylon"
            },
            {
                id: 23,
                path: "/models/smallSandStone/",
                name: "smallSandStone.babylon"
            },
            {
                id: 24,
                path: "/models/bigSandStone/",
                name: "bigSandStone.babylon"
            },
            {
                id: 25,
                path: "/models/smallCactus/",
                name: "smallCactus.babylon"
            },
            {
                id: 26,
                path: "/models/spikyCactus/",
                name: "spikyCactus.babylon"
            },
            {
                id: 27,
                path: "/models/roundCactus/",
                name: "roundCactus.babylon"
            },
            {
                id: 28,
                path: "/models/house/",
                name: "house.babylon"
            },
            {
                id: 29,
                path: "/models/fense/",
                name: "fense.babylon"
            },
            {
                id: 30,
                path: "/models/gate/",
                name: "gate.babylon"
            },
            {
                id: 31,
                path: "/models/robot/",
                name: "robot.babylon"
            },
            {
                id: 32,
                path: "/models/coin/",
                name: "coin.babylon"
            },
            {
                id: 33,
                path: "/models/key/",
                name: "keyOGA.babylon"
            },
            {
                id: 34,
                path: "/models/glock/",
                name: "glock.babylon"
            },
            {
                id: 35,
                path: "/models/littleslime/",
                name: "slimemodel.babylon"
            },
            {
                id: 36,
                path: "/models/door/",
                name: "door.babylon"
            },
            {
                id: 37,
                path: "/models/DesertCastlePack/",
                name: "castle.babylon"
            }
        ];

        //Create a counter of how many models we have to load.
        let counter = toLoad.length;

        for(let i = 0; i < toLoad.length; i++){
            let toLoadObj = toLoad[i];
            BABYLON.SceneLoader.LoadAssetContainer(toLoadObj.path, toLoadObj.name, scene, function (container) {
                let meshes = container.meshes;
                let materials = container.materials;
                for(let i = 0; i < materials.length; i++){
                    materials[i].emissiveColor = materials[i].albedoColor;
                    materials[i].emissiveColor = materials[i].emissiveColor.scale(scaleIndex);
                }

                idToCloneMesh[toLoadObj.id] = meshes[0];
                meshes[0].isPickable = false;
                meshes[0].isVisible = false;
                
                // Adds all elements to the scene
                container.addAllToScene();

                --counter;
                if(counter == 0){
                    //When the last model has loaded, we call the callback function that continues the engine setup.
                    setTimeout(callback, 0);
                }
            });
        }
    }
    this.load = load;
    
    function unloadObj(theObject){
        //This function removes an object from the scene and deletes the idToMesh variable, that points to it.

        if(idToMesh[theObject.id]){
            idToMesh[theObject.id].dispose();
        }
        delete idToMesh[theObject.id];
    }
    this.unloadObj = unloadObj;
    
    function getZ(map_, objX_, objY_){
        //This function returns a Z for an object with already set X and Y.

        let returnZ = null;
        let pointPerUnitM3 = units.pointsPerUnit - 3;
        for(let key in map_.units){ //chnage get unit in area
            let currUnit = map_.units[key];
            if(areSqrColliding(currUnit.x, currUnit.y, pointPerUnitM3, objX_-aSize/2, objY_-aSize/2, aSize)){
                let unitZ = currUnit.z;
                for(let j = 0; j < unitZ.length; j++){
                    if(areSqrColliding(j%units.pointsPerUnit + currUnit.x - 1.5, Math.floor(j/units.pointsPerUnit) + currUnit.y - 1.5, 1, objX_-aSize/2, objY_-aSize/2, aSize)){
                        if(returnZ === null || returnZ > unitZ[j]){
                            returnZ = unitZ[j];
                        }
                    }
                }
            }
        }

        return returnZ;
    }
    this.getZ = getZ;


    function editZ(map_, currObject_){
        //When the terrain elevation is changed, this function is called to recalculate the objects' Z.

        /*let theObjects = map_.objects;
        let currObject;
        for(let i = 0; i < theObjects.length; i++){
            if(theObjects[i].id == objectId_){
                currObject = theObjects[i];
                break;
            }
        }*/

        if(currObject_ !== undefined){
            currObject_.Z = getZ(map_, currObject_.x, currObject_.y);
            idToMesh[currObject_.id].position.Z = currObject_.Z;
        }
    }
    this.editZ = editZ;

    function loadObj(theObject){
        if(isInPlayMode && playerId == theObject.id){
            camera.changePosition(theObject.x, theObject.y, theObject.z);
            //If the player got a link that lets him play, snd this is the object, he is fixed to, the camera position is the same as the object's.
        }

        if(!engineSetup.scene || theObject.id == playerId) return; //Return if the scene isn't loaded. If the object is the same as the one we are attached to, we do not load it (so that we do not see the edges of the object).

        unloadObj(theObject); //We unload the object if it is already loaded.

        if(theObject.hidden) return;

        let newObjectMesh = idToCloneMesh[theObject.type].clone();
        let newMaterial = idToCloneMesh[theObject.type].material.clone();
        newObjectMesh.material = newMaterial;
        newObjectMesh.isPickable = true;
        newObjectMesh.isVisible = true;
        newObjectMesh.position.x = theObject.x;
        newObjectMesh.position.y = theObject.y;
        newObjectMesh.position.z = theObject.z;
        newObjectMesh.rotation.x = theObject.rotation;
        if(!(theObject.type >= 18 && theObject.type <= 28)) newObjectMesh.rotation.y = Math.PI/2;
        newObjectMesh.rotation.z = Math.PI/2;
        newObjectMesh.___id = theObject.id;
        newObjectMesh.___type = 1; //type 1 is everything that is not a unit
        if(theObject.scale != undefined && theObject.scale > 10) theObject.scale = 10;
        if(theObject.scale != undefined && theObject.scale < 0.1) theObject.scale = 0.1;
        if(theObject.scale != undefined && theObject.scale != 1) newObjectMesh.scaling = new BABYLON.Vector3(theObject.scale,theObject.scale,theObject.scale);
        if(newMaterial.subMaterials){
            for(let i = 0; i < newMaterial.subMaterials.length; i++){
                newMaterial.subMaterials[i] = newMaterial.subMaterials[i].clone();
                let aMat = newMaterial.subMaterials[i];
                let c = aMat.albedoColor.scale(theObject.colorChange);
                // theObject.colorR = 0;
                // theObject.colorG = 0;
                // theObject.colorB = 0;
                if(theObject.colorR !== undefined) c = c.add((new BABYLON.Color3(theObject.colorR / 255.1, theObject.colorG / 255.1, theObject.colorB / 255.1)));
                aMat.albedoColor = c;
                aMat.emissiveColor = aMat.albedoColor;
                aMat.emissiveColor = aMat.emissiveColor.scale(scaleIndex);
            }
        }else{
            // newMaterial = newMaterial.clone();
            // let aMat = newMaterial;
            // aMat.albedoColor = aMat.albedoColor.scale(theObject.colorChange);
            // aMat.emissiveColor = aMat.albedoColor;
            // aMat.emissiveColor = aMat.emissiveColor.scale(scaleIndex);
        }
        idToMesh[theObject.id] = newObjectMesh;
    }
    this.loadObj = loadObj;

    function newObj(map_, x_, y_, objectType_){
        //Create a new object.

        let newObject = new Obj(map_.totalObjectIds, objectType_);
        ++map_.totalObjectIds;
        newObject.x = x_;
        newObject.y = y_;
        newObject.z = getZ(map_, x_, y_);
        newObject.type = objectType_;
        newObject.rotation = Math.random()*Math.PI*2;
        newObject.colorChange = Math.random()*1+0.1;
        map_.objects[newObject.id] = newObject;
        
        loadObj(newObject);
    }
    this.newObj = newObj;

    function remove(map_, objectId_){
        //Remove an object and delete the pointer to it.

        if(idToMesh[objectId_]){
            idToMesh[objectId_].dispose();
        }
        delete idToMesh[objectId_];

        delete map_.objects[objectId_];
    }
    this.remove = remove;
});