var FreeCamera = new (function () {
    var camera;

    var startPosition;
    var startRotation;
    
    function load(scene_, canvas_){
        // Set starting position
        if(startPosition === undefined){
            startPosition = new BABYLON.Vector3(0, 50, 20);
        }

        // This creates and positions a free camera (non-mesh)
        camera = new BABYLON.FreeCamera("camera", startPosition, scene_);
        startRotation = camera.rotation;

        //set position
        // camera.position = new BABYLON.Vector3(map.currMap.objects[playerId].x, map.currMap.objects[playerId].y, map.currMap.objects[playerId].z);

        // This attaches the camera to the canvas
        camera.attachControl(canvas_, true);

        // Remove default keyboard:
        camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
        camera.inputs.removeByType("FreeCameraMouseInput");

        // Make custom mouse inputs
        //camera.inputs.attached.mouse.buttons = [2];

        // Change camera rotate speed
        //camera.inputs.attached.mouse.angularSensibility  = 4000;
        
        // Enable mouse wheel inputs.
        //camera.inputs.addMouseWheel();
        camera.rotation = new BABYLON.Vector3(0, 3.141592 / 2, 0);

        //Change UP Vector
        camera.upVector = new BABYLON.Vector3(0, 0, 1);

        //Change field of view
        camera.fov = 1.5;

        // Create our own manager:
        var FreeCameraKeyboardCustomMoveInput = function () {
            this._keys = [];
            this.keysLeft = [65];
            this.keysRight = [68];
            this.keysFront = [87];
            this.keysBack = [83];
            this.keysUp = [32];
            this.keysDown = [16];
            this.sensibility = 0.01;
            this.speed = 0.8;
            this.objSpeed = 0.3;
        }

        // Hooking keyboard events
        FreeCameraKeyboardCustomMoveInput.prototype.attachControl = function (noPreventDefault) {
            var _this = this;
            var engine = this.camera.getEngine();
                var element = engine.getInputElement();
            if (!this._onKeyDown) {
                element.tabIndex = 1;
                this._onKeyDown = function (evt) {
                    if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        _this.keysRight.indexOf(evt.keyCode) !== -1 || _this.keysFront.indexOf(evt.keyCode) !== -1 ||
                        _this.keysBack.indexOf(evt.keyCode) !== -1 || _this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        _this.keysDown.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index === -1) {
                            _this._keys.push(evt.keyCode);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                    else {
                        addObjectEvent(map.currMap.id, {type:"key", key:evt.keyCode});
                    }
                };
                this._onKeyUp = function (evt) {
                    if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        _this.keysRight.indexOf(evt.keyCode) !== -1 || _this.keysFront.indexOf(evt.keyCode) !== -1 ||
                        _this.keysBack.indexOf(evt.keyCode) !== -1 || _this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        _this.keysDown.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index >= 0) {
                            _this._keys.splice(index, 1);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                };
                var lastMouseX = null;
                var lastMouseY = null;
                var rotX = 0;
                var rotY = 0;
                this._onMouseMove = function (evt) {
                    if(lastMouseX !== null) {
                        var deltaX = evt.movementX;
                        var deltaY = evt.movementY;
                        rotX -= deltaX / 600;
                        rotY -= deltaY / 600;
                        if(rotY < window.additionalFunctions.gradToRad(-30)) rotY = window.additionalFunctions.gradToRad(-30);
                       if(rotY > window.additionalFunctions.gradToRad(50)) rotY = window.additionalFunctions.gradToRad(50);
                        let q = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 1), -rotX);
                        q = q.multiply(BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 0, 0), -rotY));
                        q = q.multiply(BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 0, 0), 3.141592 / 2));

                        //camera.rotation = new BABYLON.Vector3(rotX, 3.141592 / 2, rotY);
                        camera.rotationQuaternion = q;
                        //camera.cameraRotation.y += deltaX / 100;
                        //console.log(camera.cameraRotation.y, deltaX / 100);
                    }
                    lastMouseX = evt.clientX;
                    lastMouseY = evt.clientY;

                };

                this._onClick = function (evt) {
                    element.requestPointerLock();
                    let forwardDirection = scene_.activeCamera.getForwardRay(3).direction;
                    let rot = (forwardDirection.y > 0) ? Math.acos(forwardDirection.x) : (2 * Math.PI - Math.acos(forwardDirection.x));
                    rotateObjWithPlayer(map.currMap.id, rot);
                    
                    addObjectEvent(map.currMap.id, {type:"key", key:1000});
                }

                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock;

                element.requestPointerLock();
                element.focus();

                element.addEventListener("keydown", this._onKeyDown, false);
                element.addEventListener("keyup", this._onKeyUp, false);
                element.addEventListener("mousemove", this._onMouseMove, false);
                element.addEventListener("click", this._onClick, false);
                BABYLON.Tools.RegisterTopRootEvents(canvas_, [
                    { name: "blur", handler: this._onLostFocus }
                ]);
            }
        };

        // Unhook
        FreeCameraKeyboardCustomMoveInput.prototype.detachControl = function () {
            if (this._onKeyDown) {
                var engine = this.camera.getEngine();
                var element = engine.getInputElement();
                element.removeEventListener("keydown", this._onKeyDown);
                element.removeEventListener("keyup", this._onKeyUp);
                element.removeEventListener("mousemove", this._onMouseMove);
                element.removeEventListener("click", this._onClick);
                BABYLON.Tools.UnregisterTopRootEvents(canvas_, [
                    { name: "blur", handler: this._onLostFocus }
                ]);
                this._keys = [];
                this._onKeyDown = null;
                this._onKeyUp = null;
                this._onMouseMove = null;
                this._onClick = null;
            }
        };

        // This function is called by the system on every frame
        FreeCameraKeyboardCustomMoveInput.prototype.checkInputs = function () {
            if (this._onKeyDown) {
                var camera = this.camera;
                // Keyboard
                for (var index = 0; index < this._keys.length; index++) {
                    var keyCode = this._keys[index];
                    if (this.keysFront.indexOf(keyCode) !== -1) {
                        let forwardDirection = scene_.activeCamera.getForwardRay(3).direction;
						let rot = (forwardDirection.y > 0) ? Math.acos(forwardDirection.x) : (2 * Math.PI - Math.acos(forwardDirection.x));
                        //console.log("forward direction", forwardDirection);
                        forwardDirection.z = 0;
                        forwardDirection = forwardDirection.normalize();
                        //console.log('moving forward', forwardDirection);

                        let theObject = map.currMap.objects[playerId];

                        if(theObject){
                            let speed = theObject.speed ? theObject.speed : this.objSpeed;
                            forwardDirection = forwardDirection.scale(speed);
                            moveObjWithPlayer(map.currMap.id, theObject.x + forwardDirection.x, theObject.y + forwardDirection.y, rot);
                        }

                        let curCameraPosition = {x: camera.position.x,
                                                 y: camera.position.y,
                                                 z: camera.position.z};
                        optimization.updateMap(curCameraPosition);
                    }
                    else if (this.keysBack.indexOf(keyCode) !== -1) {
                        let forwardDirection = scene_.activeCamera.getForwardRay(3).direction;
						let rot = (forwardDirection.y > 0) ? Math.acos(forwardDirection.x) : (2 * Math.PI - Math.acos(forwardDirection.x));
                        //console.log("forward direction", forwardDirection);
                        forwardDirection.x = -forwardDirection.x;
                        forwardDirection.y = -forwardDirection.y;
                        forwardDirection.z = 0;
                        forwardDirection = forwardDirection.normalize();
                        //console.log('moving backwards', forwardDirection);
                        
                        let theObject = map.currMap.objects[playerId];
                        if(theObject){
                            let speed = theObject.speed ? theObject.speed : this.objSpeed;
                            forwardDirection = forwardDirection.scale(speed);
                            moveObjWithPlayer(map.currMap.id, theObject.x + forwardDirection.x, theObject.y + forwardDirection.y, rot);
                        }

                        let curCameraPosition = {x: camera.position.x,
                                                 y: camera.position.y,
                                                 z: camera.position.z};
                        optimization.updateMap(curCameraPosition);
                    }
                    else if (this.keysLeft.indexOf(keyCode) !== -1) {
                        let forwardDirection = scene_.activeCamera.getForwardRay(3).direction;
						let rot = (forwardDirection.y > 0) ? Math.acos(forwardDirection.x) : (2 * Math.PI - Math.acos(forwardDirection.x));
                        //console.log("forward direction", forwardDirection);
                        let leftDirection = new BABYLON.Vector3(-forwardDirection.x, forwardDirection.y, 0);
                        leftDirection = leftDirection.normalize();
                        //console.log('moving left', leftDirection);
                        
                        let theObject = map.currMap.objects[playerId];
                        if(theObject){
                            let speed = theObject.speed ? theObject.speed : this.objSpeed;
                            leftDirection = leftDirection.scale(speed);
                            moveObjWithPlayer(map.currMap.id, theObject.x + leftDirection.y, theObject.y + leftDirection.x, rot);
                        }

                        let curCameraPosition = {x: camera.position.x,
                                                 y: camera.position.y,
                                                 z: camera.position.z};
                        optimization.updateMap(curCameraPosition);
                    }
                    else if (this.keysRight.indexOf(keyCode) !== -1) {
                        let forwardDirection = scene_.activeCamera.getForwardRay(3).direction;
						let rot = (forwardDirection.y > 0) ? Math.acos(forwardDirection.x) : (2 * Math.PI - Math.acos(forwardDirection.x));
                        //og("forward direction", forwardDirection);
                        let rightDirection = new BABYLON.Vector3(forwardDirection.x, -forwardDirection.y, 0);
                        rightDirection = rightDirection.normalize();
                        //console.log('moving right', rightDirection);
                        
                        let theObject = map.currMap.objects[playerId];
                        if(theObject){
                            let speed = theObject.speed ? theObject.speed : this.objSpeed;
                            rightDirection = rightDirection.scale(speed);
                            moveObjWithPlayer(map.currMap.id, theObject.x + rightDirection.y, theObject.y + rightDirection.x, rot);
                        }

                        let curCameraPosition = {x: camera.position.x,
                                                 y: camera.position.y,
                                                 z: camera.position.z};
                        optimization.updateMap(curCameraPosition);
                    }
                    else if (this.keysUp.indexOf(keyCode) !== -1) {
                        let upDirection = new BABYLON.Vector3(0, 0, this.speed);
                        //console.log('moving up', upDirection);
                        
                        if(!isInPlayMode){
                            camera.position.addInPlace(upDirection);
                        }

                        let curCameraPosition = {x: camera.position.x,
                                                 y: camera.position.y,
                                                 z: camera.position.z};
                        optimization.updateMap(curCameraPosition);
                    }
                    else if (this.keysDown.indexOf(keyCode) !== -1) {
                        let udownDirection = new BABYLON.Vector3(0, 0, -this.speed);
                        //console.log('moving down', udownDirection);
                        
                        if(!isInPlayMode){
                            camera.position.addInPlace(udownDirection);
                        }

                        let curCameraPosition = {x: camera.position.x,
                                                 y: camera.position.y,
                                                 z: camera.position.z};
                        optimization.updateMap(curCameraPosition);
                    }
                }
            }
        };
        FreeCameraKeyboardCustomMoveInput.prototype.getTypeName = function () {
            return "FreeCameraKeyboardCustomMoveInput";
        };
        FreeCameraKeyboardCustomMoveInput.prototype._onLostFocus = function (e) {
            this._keys = [];
        };
        FreeCameraKeyboardCustomMoveInput.prototype.getSimpleName = function () {
            return "keyboardCustomMove";
        };

        // Connect to camera:
        camera.inputs.add(new FreeCameraKeyboardCustomMoveInput());
        
        return camera;
    }
    this.load = load;

    function changePosition(x, y, z){
        if(camera){
            camera.position = new BABYLON.Vector3(x, y, z+2);
        }else{
            startPosition = new BABYLON.Vector3(x, y, z+2);
        }
    }
    this.changePosition = changePosition;

    function disableWheel() {
        camera.inputs.remove(camera.inputs.attached.mousewheel);
    }
    this.disableWheel = disableWheel;

    function resetPosition(){
        // camera.position = startPosition;
        // camera.rotation = startRotation;
    }
    this.resetPosition = resetPosition;
})();