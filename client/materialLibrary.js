var materialLibrary = new (function (){
    let indexToMat = {}; //gives image from material index
    let codeToMaterial = {};
    let materialList = [];

    let lastSetSunVector;

    function loadMaterials(scene){
        //Given a scene, this function creates babylon textures for the terrain for the given scene and saves them in indexToMat.

        indexToMat[1] = new BABYLON.Texture("stone.jpg", scene);
        indexToMat[5] = new BABYLON.Texture("dirt1.png", scene);
        indexToMat[2] = new BABYLON.Texture("t.jpg", scene);
        indexToMat[3] = new BABYLON.Texture("grass.jpg", scene);
        indexToMat[4] = new BABYLON.Texture("sand1.jpg", scene);
    }
    this.loadMaterials = loadMaterials;

    function getMaterialByCode(code) {
        //This function returns a material by given code.
        //If this is the first time this code is used, a material is generated.
        //The materials are saved in codeToMaterial.

        let material = codeToMaterial[code];
        if (material) return material;
        let mat0 = code & 0xff;
        let mat1 = (code >> 8) & 0xff;
        let mat2 = (code >> 16) & 0xff;
        if(indexToMat[mat0] === undefined){
            mat0 = 1;
        }
        if(mat1 !== 0 && indexToMat[mat1] === undefined){
            mat1 = 0;
        }
        if(mat2 !== 0 && indexToMat[mat2] === undefined){
            mat2 = 0;
        }
        let layers = (mat2 != 0) ? 3 : ((mat1 != 0) ? 2 : 1);
        let shader = "t" + layers;
        let attributes = ["position", "normal", "uv"];
        if (layers > 1) attributes.push("uv2");
        let uniforms = ["worldViewProjection", "sunVector"];
        material = new BABYLON.ShaderMaterial(
            "shader" + code, engineSetup.scene,
            { vertex: shader, fragment: shader },
            {
                attributes: attributes,
                uniforms: uniforms,
                needAlphaBlending: false,
                needAlphaTesting: false
            });
        material.setTexture("t0Sampler", indexToMat[mat0]);
        if (layers > 1) material.setTexture("t1Sampler", indexToMat[mat1]);
        if (layers > 2) material.setTexture("t2Sampler", indexToMat[mat2]);
        material.backFaceCulling = true;
        if(lastSetSunVector){
            material.setVector3("sunVector", lastSetSunVector);
        }
        codeToMaterial[code] = material;
        materialList.push(material);
        return material;
    }
    this.getMaterialByCode = getMaterialByCode;

    function setSunVector(sunVector){
        //We use custom shadows for the terrain, we need a vector for the sun.
        //This function sets the sunVector for every material we have.

        lastSetSunVector = sunVector;
        for(let i = 0; i < materialList.length; i++){
            materialList[i].setVector3("sunVector", sunVector);
        }
    }
    this.setSunVector = setSunVector;
});