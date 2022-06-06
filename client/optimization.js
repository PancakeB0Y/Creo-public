var optimization = new (function () {

    this.lastUpdatePoint = {x: 0, y: 0, z: 0};
    this.minDistanceToUpdateMap = 5;

    let _this = this;

    function updateMap(newUpdatePoint){
        // newUpdatePoint.x = -newUpdatePoint.x;
        // newUpdatePoint.z = -newUpdatePoint.z;
        let distance = getDistance3D(newUpdatePoint, this.lastUpdatePoint);

        if(this.minDistanceToUpdateMap > distance){
            return;
        }

        _this.lastUpdatePoint = newUpdatePoint;

        let currMap = mapEdit.currMap;

        //console.log("update");
        for(let unitsId in currMap.units){
            //console.log("update unit");
            let theUnit = currMap.units[unitsId];
            
            units.load(theUnit, newUpdatePoint, false);
        }
    }
    this.updateMap = updateMap;

    
});