var map = new (function (){
    let currMap;
    let this_ = this;

    function setMap(map_){
        //sett current map to given map

        currMap = map_;
        this_.currMap = currMap;
    }
    this.setMap = setMap;

    function setId(id_){
        //sett current map to given map

        if(currMap && currMap.id === undefined){
            currMap.id = id_;
            return true;
        }
        return false;
    }
    this.setId = setId;

    function stop(){
        //unloads all units and stops actions connected with the map

        if(!currMap){
            return;
        }

        for(let key in currMap.units){
            units.unload(currMap.units[key]);
        }
        
        for(let key in currMap.objects){
            objects.unloadObj(currMap.objects[key]);
        }
    }
    this.stop = stop;

    function start(){
        //loads units in a sector and starts actions connected to the map

        if(!currMap){
            return;
        }

        stop();

        for(let key in currMap.units){
            units.load(currMap.units[key], optimization.lastUpdatePoint, true);
        }
        
        for(let key in currMap.objects){
            //objects.idToMesh[currMap.id] = {};
            objects.loadObj(currMap.objects[key]);
        }
    }
    this.start = start;

    function updateHeight(map_, x_, y_, r_, changeIndex_, isSmooth_){
        for(let i = 0; i < Object.keys(map_.units).length; i++){
            let unit = map_.units[i];
            units.updateHeight(unit, x_-unit.x, y_-unit.y, r_, changeIndex_, isSmooth_);
        }

        for(let i = 0; i < map_.objects.length; i++){
            let theObject = map_.objects[i];

            if(getDistance(x_, y_, theObject.z, theObject.x) <= r_){
                objects.editY(map_, theObject);
            }
        }
    }
    this.updateHeight = updateHeight;

    function updateTexture(map_, x_, y_, r_, newTexture_){
        for(let i = 0; i < Object.keys(map_.units).length; i++){
            let unit = map_.units[i];
            units.updateTexture(unit, x_-unit.x, y_-unit.y, r_, newTexture_);
        }
    }
    this.updateTexture = updateTexture;

    function levelHeight(map_, x_, y_, r_, changeIndex_){
        let totalHeight = 0, brPoints = 0;
        for(let i = 0; i < Object.keys(map_.units).length; i++){
            let unit = map_.units[i];
            let stats;
            stats = units.getHeightStats(unit, x_-unit.x, y_-unit.y, r_);
            totalHeight += stats.totalHeight;
            brPoints += stats.br;
        }

        let avgHeight = totalHeight/brPoints;

        for(let i = 0; i < Object.keys(map_.units).length; i++){
            let unit = map_.units[i];
            units.levelArea(unit, x_-unit.x, y_-unit.y, r_, changeIndex_, avgHeight);
        }

        for(let i = 0; i < map_.objects.length; i++){
            let theObject = map_.objects[i];

            if(getDistance(x_, y_, theObject.z, theObject.x) <= r_){
                objects.editY(map_, theObject);
            }
        }
    }
    this.levelHeight = levelHeight;
});