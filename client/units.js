var units = new (function () {
    const idToUnitInfo = {}; //this object links unit infos ot ids
    this.idToUnitInfo = idToUnitInfo;

    const spaceBetweenPoints = 10; //the minimal space between two points, who are next to each other in 2-dimentional space/looked from the top
    this.spaceBetweenPoints = spaceBetweenPoints;
    const pointsPerUnit = 35; //the maximal number of points per unit side (the amount of points that a unit is made of is pointsPerUnit^2)
    this.pointsPerUnit = pointsPerUnit;
    const squaresPerTexture = 5; //the size of part of the texture a square of the mashe will be applyied to || (pointsPerUnit-2)%squaresPerTexture needs to be 0 so thet there is no clipping between units
    this.squaresPerTexture = squaresPerTexture;
    
    this.distanceToChangeRes = 200; //how far awa a unit shoud be, for it to start loosing shape (lower res for optimization)
    this.distanceDifferance = 30; //the difference in the distance when the unit is going to an lower and higher change index
    this.changeIndexTosquaresPerTexture = {1: 5, 2: 7, 4: 6, 8: 2, 16: 1}

    let unitsLoadedDivs = document.getElementsByClassName("unitsLoadedDiv");

    let updatedUnitsCount = 0;

    function calculateKIndex(id_){
        //calculate K index, used to randomize distance

        return 1+(0.2*(((id_+731)%100)/100));
    }

    function load(theUnit, refPoint, loadUnit) {
        //the refPoint (referenve point) is an object {x: , y: , z: } that contains the coordinates of the camera
        //the refPoint is used to calculate the distance from the point and decide how many points the unit should have

        //loadUnit - if true - the unit will load ignoring it's last state; if false - will load only if it's last state is different than the new
        //the state is determined by how many points the unit is loaded with

        //calculations related to the refPoint

        //refPoint = {x: 0, y: 0, z: 0};

        const unitCenter = {x: theUnit.x+pointsPerUnit/2,//(theUnit.top+theUnit.bottom)/2, 
                          y: theUnit.y+pointsPerUnit/2,
                          z: 0} //typeof theUnit.z == typeof [0, 0] ? arrayAvg(theUnit.z) : theUnit.z}

        let currDistance = getDistance3D(unitCenter, refPoint) * calculateKIndex(theUnit.id);
        let changeIndex = Math.pow(2,(currDistance / this.distanceToChangeRes).toFixed(0)); //calculate change index (can be 1, 2, 4, 8, 16)
        changeIndex = changeIndex > 16 ? null : changeIndex;
        
        if(theUnit.lastChangeIndex != undefined){
            if(changeIndex < theUnit.lastChangeIndex){
                currDistance = getDistance3D(unitCenter, refPoint) * calculateKIndex(theUnit.id) - this.distanceDifferance;
                changeIndex = Math.pow(2,(currDistance / this.distanceToChangeRes).toFixed(0)); //calculate change index (can be 1, 2, 4, 8, 16)
                changeIndex = changeIndex > 16 ? null : changeIndex;
            }

            if(changeIndex > theUnit.lastChangeIndex){
                currDistance = getDistance3D(unitCenter, refPoint) * calculateKIndex(theUnit.id) + this.distanceDifferance;
                changeIndex = Math.pow(2,(currDistance / this.distanceToChangeRes).toFixed(0)); //calculate change index (can be 1, 2, 4, 8, 16)
                changeIndex = changeIndex > 16 ? null : changeIndex;
            }
        
            if(theUnit.lastChangeIndex == changeIndex && loadUnit == false){
                return;
            }
        }

        // changeIndex = 16;

        let pointsPerThisUnit;
        let spaceBetweenThesePoints;
        let squaresPerThisTexture;//this.changeIndexTosquaresPerTexture[changeIndex];
        if(changeIndex != null){
            pointsPerThisUnit = 3 + (this.pointsPerUnit - 3) / changeIndex;
            spaceBetweenThesePoints = spaceBetweenPoints * changeIndex;
            squaresPerThisTexture = 5;
        }

        if(!engineSetup.scene) return;
        //when this function is called the unit is loaded and becomes visible

        let unitInfo = idToUnitInfo[theUnit.id];
        if(unitInfo === undefined){
            unitInfo = new UnitInfo(theUnit.id);
            idToUnitInfo[theUnit.id] = unitInfo;
        }
        let meshes = unitInfo.meshes;

        //dispose of the old meshes (if there are any)
        for (let i = 0; i < meshes.length; i++) {
            meshes[i].dispose();
        }
        meshes.splice(0, meshes.length);

        theUnit.lastChangeIndex = changeIndex;

        if(changeIndex == null){
            return;
        }

        updatedUnitsCount++;
        for(let i = 0; i < unitsLoadedDivs.length; i++){
            unitsLoadedDivs[i].innerHTML = updatedUnitsCount;
        }

        let vertexData = []; // = ; //the vertex data for the mesh
        let materials = []; //array of materials

        let points = []; //1-dimentional array of tree coordinates of points (x, y, z) fed to the vertex data
        let normals = []; //1-dimentional normals array, also fed to the vertex data
        let indices = []; //1-dimentional array giving indexes to each point from the points array, also fed to the vertex data
        let uvs = []; //1-dimentional uvs array, also fed to the vertex data
        let uvs2 = [];

        let map = {}; //material code to mesh index

        let pointsZ;
        if(changeIndex == 1){
            pointsZ = theUnit.z;
        }else{
            pointsZ = [];
            for(let i = 0; i < this.pointsPerUnit; i = i + (((i == 0) || (i == this.pointsPerUnit - 2)) ? 1 : changeIndex)){
                for(let j = 0; j < this.pointsPerUnit; j = j + (((j == 0) || (j == this.pointsPerUnit - 2)) ? 1 : changeIndex)){
                    pointsZ.push(theUnit.z[i*this.pointsPerUnit + j]);
                }
            }
        }

        let pointsMat = theUnit.materials;

        //fill points, uvs and indices arrays

        let unitSize2 = pointsPerThisUnit*pointsPerThisUnit;

        let norm = new Float32Array(unitSize2*3); //equivalent to points

        {
            let pointPerUnitM2 = pointsPerThisUnit - 2;
            let i = pointsPerThisUnit + 1;
            let smetka = -2 * spaceBetweenThesePoints;

            let vec1 = new BABYLON.Vector3(smetka, 0, 0);
            let vec2 = new BABYLON.Vector3(0, smetka, 0);
            let vecResult = new BABYLON.Vector3(0, 0, 0);
            let CrossToRef = BABYLON.Vector3.CrossToRef;
            for(let j = pointPerUnitM2 - 1; j >= 0; j--) {
                for(let k = pointPerUnitM2 - 1; k >= 0; k--) {
                    vec1.z = pointsZ[i - 1] - pointsZ[i + 1];
                    vec2.z = pointsZ[i - pointsPerThisUnit] - pointsZ[i + pointsPerThisUnit];
                    CrossToRef(vec1, vec2, vecResult);
                    vecResult.normalize();
                    norm[i*3] = vecResult.x;
                    norm[i*3+1] = vecResult.y;
                    norm[i*3+2] = vecResult.z;
                    ++i;
                }
                i += 2;
            }
        }

        {
            let pointPerUnitM2 = pointsPerThisUnit - 2;
            let i = pointsPerThisUnit + 1;

            let c = [];
            let y = 0;
            for(let j = pointPerUnitM2 - 2; j >= 0; j--) {
                let x = 0;
                for(let k = pointPerUnitM2 - 2; k >= 0; k--) {
                    let layers;
                    let code = 0;

                    let mat1 = pointsMat[i];
                    let mat2 = pointsMat[i+pointsPerThisUnit];
                    let mat3 = pointsMat[i+pointsPerThisUnit+1];
                    //sort materials
                    if(mat1 > mat2){
                        let aMat = mat1;
                        mat1 = mat2;
                        mat2 = aMat;
                    }
                    if(mat2 > mat3){
                        let aMat = mat2;
                        mat2 = mat3;
                        mat3 = aMat;
                    }
                    if(mat1 > mat2){
                        let aMat = mat1;
                        mat1 = mat2;
                        mat2 = aMat;
                    }

                    //find number of layers and code
                    if(mat1 == mat2){
                        if(mat2 == mat3){
                            layers = 1;
                            code = mat1;
                        }else{
                            layers = 2;
                            mat2 = mat3;
                            code = mat1 + (mat2<<8);
                        }
                    }else{
                        if(mat3 == mat2){
                            layers = 2;
                            code = mat1 + (mat2<<8);
                        }else{
                            layers = 3;
                            code = mat1 + (mat2<<8) + (mat3<<16);
                        }
                    }

                    let index = map[code];

                    if (index === undefined) {
                        index = vertexData.length;
                        map[code] = index;
                        materials.push(materialLibrary.getMaterialByCode(code));
                        vertexData.push(new BABYLON.VertexData());
                        points.push([]);
                        normals.push([]);
                        indices.push([]);
                        uvs.push([]);
                        uvs2.push([]);
                        c.push(0);
                    }

                    //fill arrays
                    let thePoints = points[index];
                    let theNormals = normals[index]
                    let theIndices = indices[index];
                    let theUVS = uvs[index];
                    let theUVS2 = uvs2[index];
                    let theCounter = c[index];

                    let i3 = i*3;

                    thePoints.push(x, y, pointsZ[i]);
                    theNormals.push(norm[i3], norm[i3 + 1], norm[i3 + 2]);
                    theIndices.push(theCounter++);
                    theUVS.push((x % squaresPerThisTexture) / squaresPerThisTexture, (y % squaresPerThisTexture) / squaresPerThisTexture);
                    theUVS2.push((pointsMat[i] == mat2) ? 1 : 0, (pointsMat[i] == mat3) ? 1 : 0);

                    i3 = (i + pointsPerThisUnit)*3;

                    thePoints.push(x, (y + changeIndex), pointsZ[i + pointsPerThisUnit]);
                    theNormals.push(norm[i3], norm[i3 + 1], norm[i3 + 2]);
                    theIndices.push(theCounter++);
                    theUVS.push((x % squaresPerThisTexture) / squaresPerThisTexture, (y % squaresPerThisTexture + 1) / squaresPerThisTexture);
                    theUVS2.push((pointsMat[i + pointsPerThisUnit] == mat2) ? 1 : 0, (pointsMat[i + pointsPerThisUnit] == mat3) ? 1 : 0);

                    i3 = (i + pointsPerThisUnit + 1)*3;

                    thePoints.push((x + changeIndex), (y + changeIndex), pointsZ[i + pointsPerThisUnit + 1]);
                    theNormals.push(norm[i3], norm[i3 + 1], norm[i3 + 2]);
                    theIndices.push(theCounter++);
                    theUVS.push((x % squaresPerThisTexture + 1) / squaresPerThisTexture, (y % squaresPerThisTexture + 1) / squaresPerThisTexture);
                    theUVS2.push((pointsMat[i + pointsPerThisUnit + 1] == mat2) ? 1 : 0, (pointsMat[i + pointsPerThisUnit + 1] == mat3) ? 1 : 0);

                    c[index] = theCounter;

                    mat1 = pointsMat[i];
                    mat2 = pointsMat[i+1];
                    mat3 = pointsMat[i+pointsPerThisUnit+1];
                    //sort materials
                    if(mat1 > mat2){
                        let aMat = mat1;
                        mat1 = mat2;
                        mat2 = aMat;
                    }
                    if(mat2 > mat3){
                        let aMat = mat2;
                        mat2 = mat3;
                        mat3 = aMat;
                    }
                    if(mat1 > mat2){
                        let aMat = mat1;
                        mat1 = mat2;
                        mat2 = aMat;
                    }

                    //find number of layers and code
                    if(mat1 == mat2){
                        if(mat2 == mat3){
                            layers = 1;
                            code = mat1;
                        }else{
                            layers = 2;
                            mat2 = mat3;
                            code = mat1 + (mat2<<8);
                        }
                    }else{
                        if(mat3 == mat2){
                            layers = 2;
                            code = mat1 + (mat2<<8);
                        }else{
                            layers = 3;
                            code = mat1 + (mat2<<8) + (mat3<<16);
                        }
                    }

                    index = map[code];

                    if (index === undefined) {
                        index = vertexData.length;
                        map[code] = index;
                        materials.push(materialLibrary.getMaterialByCode(code));
                        vertexData.push(new BABYLON.VertexData());
                        points.push([]);
                        normals.push([]);
                        indices.push([]);
                        uvs.push([]);
                        uvs2.push([]);
                        c.push(0);
                    }

                    //fill arrays
                    thePoints = points[index];
                    theNormals = normals[index]
                    theIndices = indices[index];
                    theUVS = uvs[index];
                    theUVS2 = uvs2[index];
                    theCounter = c[index];
                    
                    i3 = i*3;

                    thePoints.push(x, y, pointsZ[i]);
                    theNormals.push(norm[i3], norm[i3 + 1], norm[i3 + 2]);
                    theIndices.push(theCounter++);
                    theUVS.push((x % squaresPerThisTexture) / squaresPerThisTexture, (y % squaresPerThisTexture) / squaresPerThisTexture);
                    theUVS2.push((pointsMat[i] == mat2) ? 1 : 0, (pointsMat[i] == mat3) ? 1 : 0);

                    i3 = (i + pointsPerThisUnit + 1)*3;

                    thePoints.push((x + changeIndex), (y + changeIndex), pointsZ[i + pointsPerThisUnit + 1]);
                    theNormals.push(norm[i3], norm[i3 + 1], norm[i3 + 2]);
                    theIndices.push(theCounter++);
                    theUVS.push((x % squaresPerThisTexture + 1) / squaresPerThisTexture, (y % squaresPerThisTexture + 1) / squaresPerThisTexture);
                    theUVS2.push((pointsMat[i + pointsPerThisUnit + 1] == mat2) ? 1 : 0, (pointsMat[i + pointsPerThisUnit + 1] == mat3) ? 1 : 0);

                    i3 = (i + 1)*3;

                    thePoints.push((x + changeIndex), y, pointsZ[i + 1]);
                    theNormals.push(norm[i3], norm[i3 + 1], norm[i3 + 2]);
                    theIndices.push(theCounter++);
                    theUVS.push((x % squaresPerThisTexture + 1) / squaresPerThisTexture, (y % squaresPerThisTexture) / squaresPerThisTexture);
                    theUVS2.push((pointsMat[i + 1] == mat2) ? 1 : 0, (pointsMat[i + i] == mat3) ? 1 : 0);

                    c[index] = theCounter;

                    ++i;
                    x += changeIndex;
                }
                i += 3;
                y += changeIndex;
            }
        }

        //apply points, indicies and uvs arr to the vertex data and the vertex data to the mesh
        for (let i = 0; i < vertexData.length; i++) {
            meshes[i] = new BABYLON.Mesh("custom", engineSetup.scene);
            vertexData[i].positions = points[i];
            vertexData[i].indices = indices[i];
            vertexData[i].uvs = uvs[i];
            vertexData[i].uvs2 = uvs2[i];
            vertexData[i].normals = normals[i];
            vertexData[i].applyToMesh(meshes[i], true);

            meshes[i].material = materials[i];
            meshes[i].position = new BABYLON.Vector3(theUnit.x, theUnit.y, 0);

            meshes[i].___type = 2; //this is the unit type
            meshes[i].___id = theUnit.id;
        }
    }
    this.load = load;

    function unload(theUnit) {
        //when this function is called the unit becomes invisible and needs to be loaded once again to become visible
        if(idToUnitInfo[theUnit.id]){
            let meshes = idToUnitInfo[theUnit.id].meshes;

            for(let i = 0; i < meshes.length; i++){
                meshes[i].dispose();
            }
            delete idToUnitInfo[theUnit.id];
        }
    }
    this.unload = unload;

    function newUnit(map_, nearbyUnit_, position_){ //newrbyUnit is the unit next to the one we want to create || position is position compared to the nearbyUnit (1 - left, 2 - right, 3- top, 4 - bottom)
        let pointsPerUnitM3 = pointsPerUnit - 3;

        let newX;
        let newY;

        if(position_ == 1){
            newX = nearbyUnit_.x - pointsPerUnitM3;
            newY = nearbyUnit_.y;
        }

        if(position_ == 2){
            newX = nearbyUnit_.x + pointsPerUnitM3;
            newY = nearbyUnit_.y;
        }

        if(position_ == 3){
            newX = nearbyUnit_.x;
            newY = nearbyUnit_.y - pointsPerUnitM3;
        }

        if(position_ == 4){
            newX = nearbyUnit_.x;
            newY = nearbyUnit_.y + pointsPerUnitM3;
        }

        let left;
        let right;
        let top;
        let bottom;

        
        for(let i = 0; i < Object.keys(map_.units).length; i++){
            let theUnit =  map_.units[i];
            if(theUnit.x == newX && theUnit.y == newY){
                return;
            }

            if(theUnit.x == newX - pointsPerUnitM3 && theUnit.y == newY){
                left = theUnit;
            }

            if(theUnit.x == newX + pointsPerUnitM3 && theUnit.y == newY){
                right = theUnit;
            }

            if(theUnit.x == newX && theUnit.y == newY - pointsPerUnitM3){
                top = theUnit;
            }

            if(theUnit.x == newX && theUnit.y == newY + pointsPerUnitM3){
                bottom = theUnit;
            }
        }

        let newId = map_.totalUnitIds;
        ++map_.totalUnitIds;
        let theUnit = new Unit(newId, newX, newY);

        if(right){
            for(let i = 0; i < pointsPerUnit*pointsPerUnit+1; i += pointsPerUnit){
                for(let j = 0; j < 3; j++){
                    theUnit.z[i+pointsPerUnit-3+j] = right.z[i+j];
                }
            }
        }
        
        if(left){
            for(let i = 0; i < pointsPerUnit*pointsPerUnit+1; i += pointsPerUnit){
                for(let j = 0; j < 3; j++){
                    theUnit.z[i+j] = left.z[i+pointsPerUnit-3+j];
                }
            }
        }

        if(bottom){
            for(let i = 0; i < pointsPerUnit; i += 1){
                for(let j = 0; j < 3; j++){
                    theUnit.z[i+pointsPerUnit*(pointsPerUnit-3+j)] = bottom.z[i+j*pointsPerUnit];
                }
            }
        }

        if(top){
            for(let i = 0; i < pointsPerUnit; i += 1){
                for(let j = 0; j < 3; j++){
                    theUnit.z[i+j*pointsPerUnit] = top.z[i+pointsPerUnit*(pointsPerUnit-3+j)];
                }
            }
        }

        map_.units[theUnit.id] = theUnit;
        load(theUnit);
    }
    this.newUnit = newUnit;

    function updateHeight(theUnit, x_, y_, r_, changeIndex_, isSmooth_) {
        //x_, y_, r_ - x, y and radius of the filter we want to apply
        //changeIndex_ - the value by which we control the change of height
        //isSmooth_ (boolean) - if we want to change the height evenly or depending on how far the point is from the center of the filter


        //this function updates the custom mesh height/the array of points/the position of the points
        r_ = r_/spaceBetweenPoints;
        for (var y = 0; y < pointsPerUnit; y++) {
            for (var x = 0; x < pointsPerUnit; x++) {
                let currX = ((x/*+pointsPerUnit-1*/)); //get the global x of the point
                let currY = ((y/*+pointsPerUnit-1*/)); //get the global x of the point
                let dist = getDistance(x_, y_, currX, currY); //get the distance between the filter center and the point

                if (dist < r_) {
                    if (isSmooth_) {
                        theUnit.z[y*pointsPerUnit + x] += changeIndex_ / 5;
                    } else {
                        theUnit.z[y*pointsPerUnit + x] += (changeIndex_ * (r_ - dist)) / (r_ * 5);
                    }
                }
            }
        }

        //load the mesh again
        load(theUnit);
    }
    this.updateHeight = updateHeight;

    function getHeightStats(theUnit, x_, y_, r_) {
        //x_, y_, r_ - x, y and radius of the area we want to get the height of

        //this function returns the total height of the points in the filter area and their number
        r_ = r_/spaceBetweenPoints;
        let br = 0;
        let totalHeight = 0;

        for (var y = 0; y < pointsPerUnit; y++) {
            for (var x = 0; x < pointsPerUnit; x++) {
                let currX = ((x/*+pointsPerUnit-1*/)); //get the global x of the point
                let currY = ((y/*+pointsPerUnit-1*/)); //get the global x of the point
                let dist = getDistance(x_, y_, currX, currY); //get the distance between the filter center and the point

                if (dist < r_) {
                    totalHeight += theUnit.z[y*pointsPerUnit + x];
                    br++;
                }
            }
        }

        return { br: br, totalHeight: totalHeight };
    }
    this.getHeightStats = getHeightStats;

    function levelArea(theUnit, x_, y_, r_, changeIndex_, avgHeight_) {
        //x_, y_, r_ - x, y and radius of the filter we want to apply
        //changeIndex_ - the value by which we control the change of height
        //avgHeight_ - the averige height of the area we want to level

        //this function is to get the height of a certain area to get closer to the agrv of the area
        r_ = r_/spaceBetweenPoints;
        for (var y = 0; y < pointsPerUnit; y++) {
            for (var x = 0; x < pointsPerUnit; x++) {
                let currX = ((x/*+pointsPerUnit-1*/)); //get the global x of the point
                let currY = ((y/*+pointsPerUnit-1*/)); //get the global x of the point
                let dist = getDistance(x_, y_, currX, currY); //get the distance between the filter center and the point

                /*if(changeIndex_ < 0){
                    changeIndex_ = -changeIndex_;
                }*/

                if (dist < r_) {
                    if (theUnit.z[y*pointsPerUnit + x] + changeIndex_ / 5 >= avgHeight_ && theUnit.z[y*pointsPerUnit + x] - changeIndex_ / 5 <= avgHeight_) {
                        theUnit.z[y*pointsPerUnit + x] = avgHeight_;
                    } else {
                        if (theUnit.z[y*pointsPerUnit + x] < avgHeight_) {
                            theUnit.z[y*pointsPerUnit + x] += changeIndex_ / 5;
                        } else {
                            theUnit.z[y*pointsPerUnit + x] -= changeIndex_ / 5;
                        }
                    }
                }
            }
        }

        //load the mesh again
        load(theUnit);
    }
    this.levelArea = levelArea;

    function updateTexture(theUnit, x_, y_, r_, newMatIndex_) {
        //x_, y_, r_ - x, y and radius of the filter we want to apply
        //newMatIndex_ - the index of the new material we want the points to become


        //this function updates the custom mesh texture/the array of uvs/the amount of every texture a point has
        r_ = r_/spaceBetweenPoints;
        for (var y = 0; y < pointsPerUnit; y++) {
            for (var x = 0; x < pointsPerUnit; x++) {
                let currX = ((x/*+pointsPerUnit-1*/)); //get the global x of the point
                let currY = ((y/*+pointsPerUnit-1*/)); //get the global x of the point
                let dist = getDistance(x_, y_, currX, currY); //get the distance between the filter center and the point

                if (dist < r_) {
                    theUnit.materials[y*pointsPerUnit + x] = newMatIndex_;
                }
            }
        }

        //load the mesh again
        load(theUnit);
    }
    this.updateTexture = updateTexture;

    function remove(map_, unitId_){
        let theUnit;
        let idInMap;
        theUnit = map_.units[unitId_];
        
        if(theUnit){
/*            for(let theObject in map_.objects){
                theObject = map_.objects[theObject];
                if(areSqrColliding(theUnit.x, theUnit.y, pointsPerUnit-3, theObject.z-0.5, theObject.x-0.5, 1)){
                    objects.remove(map_, theObject.id);
                }
            }*/

            for(let i = 0; i < idToUnitInfo[theUnit.id].meshes.length; i++){
                idToUnitInfo[theUnit.id].meshes[i].dispose();
            }
            delete idToUnitInfo[theUnit.id];
            delete map_.units[unitId_];

/*            map_.units[idInMap] = map_.units[Object.keys(map_.units).length-1];
            delete map_.units[Object.keys(map_.units).length-1];*/
        }
    }
    this.remove = remove;
});