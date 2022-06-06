var ArcRotateCamera = new (function () {
    var camera;
    
    var startPosition;
    var startLookAt;
    
    function load(scene_, canvas_){
        // Set starting coordinates
        startPosition = new BABYLON.Vector3(0, 50, 20);
        startLookAt = new BABYLON.Vector3.Zero();

        // This creates and positions a free camera (non-mesh)
        camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, new BABYLON.Vector3(0, 20, 50), scene_);

        // This targets the camera to scene origin
        camera.lockedTarget = startLookAt;

        // Prevent camera from flipping after zooming too much
        camera.lowerRadiusLimit = 0.1;

        // Prevent camera from zooming too much
        camera.upperRadiusLimit = 1000;

        // This attaches the camera to the canvas
        camera.attachControl(canvas_, false, true, 1);

        // Remove default keyboard:
        camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");

        // Dissable upsideDown
        camera.allowUpsideDown = false;

        // Make custom mouse inputs
        camera.inputs.attached.pointers.buttons = [2];

        // Change camera rotate speed
        // camera.inputs.attached.mouse.angularSensibility  = 4000;
        // console.log(camera.inputs.attached.mouse);
        
        // Enable mouse wheel inputs.
        // camera.inputs.addMouseWheel();

        //Change UP Vector
        camera.upVector = new BABYLON.Vector3(0, 0, 1);

        // Create our own manager:
        var ArcRotateCameraKeyboardCustomMoveInput = function () {
            this._keys = [];
            this.keysLeft = [65];
            this.keysRight = [68];
            this.keysFront = [87];
            this.keysBack = [83];
            this.keysUp = [32];
            this.keysDown = [16];
            this.sensibility = 0.01;
            this.speed = 1;
            this.objSpeed = 0.5;
        }

        // Hooking keyboard events
        ArcRotateCameraKeyboardCustomMoveInput.prototype.attachControl = function (noPreventDefault) {
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

                element.addEventListener("keydown", this._onKeyDown, false);
                element.addEventListener("keyup", this._onKeyUp, false);
                BABYLON.Tools.RegisterTopRootEvents(canvas_, [
                    { name: "blur", handler: this._onLostFocus }
                ]);
            }
        };

        // Unhook
        ArcRotateCameraKeyboardCustomMoveInput.prototype.detachControl = function () {
            if (this._onKeyDown) {
                var engine = this.camera.getEngine();
                var element = engine.getInputElement();
                element.removeEventListener("keydown", this._onKeyDown);
                element.removeEventListener("keyup", this._onKeyUp);
                BABYLON.Tools.UnregisterTopRootEvents(canvas_, [
                    { name: "blur", handler: this._onLostFocus }
                ]);
                this._keys = [];
                this._onKeyDown = null;
                this._onKeyUp = null;
            }
        };

        // This function is called by the system on every frame
        ArcRotateCameraKeyboardCustomMoveInput.prototype.checkInputs = function () {
            if (this._onKeyDown) {
                var camera = this.camera;
                // Keyboard
                for (var index = 0; index < this._keys.length; index++) {
                    var keyCode = this._keys[index];
                    if (this.keysFront.indexOf(keyCode) !== -1) {
                        let forwardDirection = scene_.activeCamera.getForwardRay(3).direction;
                        forwardDirection.z = 0;
                        forwardDirection = forwardDirection.normalize();
                        //console.log('moving forward', forwardDirection);

                        forwardDirection = forwardDirection.scale(this.speed);
                        //camera.position.addInPlace(forwardDirection);
                        camera.lockedTarget.addInPlace(forwardDirection);

                        let curCameraPosition = {x: camera.lockedTarget._x,
                                                 y: camera.lockedTarget._y,
                                                 z: camera.lockedTarget._z};
                        optimization.updateMap(curCameraPosition);
                    }
                    else if (this.keysBack.indexOf(keyCode) !== -1) {
                        let forwardDirection = scene_.activeCamera.getForwardRay(3).direction;
                        forwardDirection.x = -forwardDirection.x;
                        forwardDirection.y = -forwardDirection.y;
                        forwardDirection.z = 0;
                        forwardDirection = forwardDirection.normalize();
                        //console.log('moving backwards', forwardDirection);
                        
                        forwardDirection = forwardDirection.scale(this.speed);
                        //camera.position.addInPlace(forwardDirection);
                        camera.lockedTarget.addInPlace(forwardDirection);

                        let curCameraPosition = {x: camera.lockedTarget._x,
                                                 y: camera.lockedTarget._y,
                                                 z: camera.lockedTarget._z};
                        optimization.updateMap(curCameraPosition);
                    }
                    else if (this.keysLeft.indexOf(keyCode) !== -1) {
                        let forwardDirection = scene_.activeCamera.getForwardRay(3).direction;
                        let leftDirection = new BABYLON.Vector3(forwardDirection.y, -forwardDirection.x, 0);
                        leftDirection = leftDirection.normalize();
                        //console.log('moving left', leftDirection);
                        
                        leftDirection = leftDirection.scale(this.speed);
                        //camera.position.addInPlace(leftDirection);
                        camera.lockedTarget.addInPlace(leftDirection);

                        let curCameraPosition = {x: camera.lockedTarget._x,
                                                 y: camera.lockedTarget._y,
                                                 z: camera.lockedTarget._z};
                        optimization.updateMap(curCameraPosition);
                    }
                    else if (this.keysRight.indexOf(keyCode) !== -1) {
                        let forwardDirection = scene_.activeCamera.getForwardRay(3).direction;
                        let rightDirection = new BABYLON.Vector3(-forwardDirection.y, forwardDirection.x, 0);
                        rightDirection = rightDirection.normalize();
                        //console.log('moving right', rightDirection);
                        
                        rightDirection = rightDirection.scale(this.speed);
                        //camera.position.addInPlace(rightDirection);
                        camera.lockedTarget.addInPlace(rightDirection);
                        
                        let curCameraPosition = {x: camera.lockedTarget._x,
                                                 y: camera.lockedTarget._y,
                                                 z: camera.lockedTarget._z};
                        optimization.updateMap(curCameraPosition);
                    }
                    else if (this.keysUp.indexOf(keyCode) !== -1) {
                        let upDirection = new BABYLON.Vector3(0, 0, this.speed);
                        //console.log('moving up', upDirection);
                        
                        //camera.position.addInPlace(upDirection);
                        camera.lockedTarget.addInPlace(upDirection);

                        let curCameraPosition = {x: camera.lockedTarget._x,
                                                 y: camera.lockedTarget._y,
                                                 z: camera.lockedTarget._z};
                        optimization.updateMap(curCameraPosition);
                    }
                    else if (this.keysDown.indexOf(keyCode) !== -1) {
                        let udownDirection = new BABYLON.Vector3(0, 0, -this.speed);
                        //console.log('moving down', udownDirection);
                        
                        // camera.position.addInPlace(udownDirection);
                        camera.lockedTarget.addInPlace(udownDirection);

                        let curCameraPosition = {x: camera.lockedTarget._x,
                                                 y: camera.lockedTarget._y,
                                                 z: camera.lockedTarget._z};
                        optimization.updateMap(curCameraPosition);
                    }
                }
            }
        };
        ArcRotateCameraKeyboardCustomMoveInput.prototype.getTypeName = function () {
            return "ArcRotateCameraKeyboardCustomMoveInput";
        };
        ArcRotateCameraKeyboardCustomMoveInput.prototype._onLostFocus = function (e) {
            this._keys = [];
        };
        ArcRotateCameraKeyboardCustomMoveInput.prototype.getSimpleName = function () {
            return "keyboardCustomMove";
        };

        // Connect to camera:
        camera.inputs.add(new ArcRotateCameraKeyboardCustomMoveInput());
        
        return camera;
    }
    this.load = load;

    function changePosition(x, y, z){
        if(camera){
            camera.position = new BABYLON.Vector3(x, y, z+2);
        }
    }
    this.changePosition = changePosition;

    function disableWheel() {
        camera.inputs.remove(camera.inputs.attached.mousewheel);
    }
    this.disableWheel = disableWheel;

    function resetPosition(){
        camera.position = startPosition;
        camera.lockedTarget = startLookAt;
    }
    this.resetPosition = resetPosition;
})();