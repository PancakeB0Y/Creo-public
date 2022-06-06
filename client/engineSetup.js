var engineSetup = new (function (){
    let engine;
    let scene;
    
    let theSunVector;

    let global_this = this;

    let engineCanvas;

    let divsFps = document.getElementsByClassName("fps");

    function setup(canvas, callback){
        engineCanvas = canvas;

        if(engine){
            //console.log("return from engine setup");
            callback();
            return;
        }
        console.log("engine setup");

        loadShaders();
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);

        //load the camera
        mainCamera = camera.load(scene, canvas);

        global_this.camera = mainCamera;

        //sphere
        // const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", scene);
        // sphere.position.x = 10;
        // sphere.position.y = 0;
        // sphere.position.z = 10;

        //set materials
        materialLibrary.loadMaterials();

        //set sun vector
        theSunVector = (new BABYLON.Vector3(0.5, 0.5, 0.5)).normalize();
        materialLibrary.setSunVector(theSunVector);

        //add light to the scene
        var light = new BABYLON.DirectionalLight("DirectionalLight", theSunVector.scale(-1), scene);

        //set background color
        // scene.clearColor = new BABYLON.Color3.FromHexString("#642ab6");

        // Skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:10000.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/models/clouds1/clouds1", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.rotation._x += Math.PI/2;

        //resize babylon drawing ground when window resizes
        window.addEventListener("resize", function () {
            engine.resize();
        });
        
        //load meshes
        objects.load(scene, function() {
            global_this.engine = engine;
            global_this.scene = scene;
            callback();    
        });
    }
    this.setup = setup;

    function renderLoop(){
        //render the scene

        for(let i = 0; i < divsFps.length; i++){
            divsFps[i].innerHTML = engine.getFps().toFixed() + " fps";
        }

        scene.render();
    }
    this.renderLoop = renderLoop;

    function start(){
        engine.resize();
        engine.runRenderLoop(renderLoop);
        
        //if in game send that it has loaded for u

        console.log("game needs to start");
        setAsLoaded();
    }
    this.start = start;

    function stop(){
        if(engine){
            engine.stopRenderLoop();

            scene.render();
        }
    }
    this.stop = stop;
});