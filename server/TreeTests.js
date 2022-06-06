let tree = require("./Tree.js");

function ValidateTree(node) {
	if(tree.isLeaf(node)) {
		if((node.topLeft !== null) || (node.topRight !== null) || (node.bottomLeft !== null) || (node.bottomRight !== null) || (node.objects === null) || (node.objects.length !== node.count)) {
			console.log("Invalid leaf: ", node);
			return false;
		}
		return true;
	}
	else {
		if((node.topLeft === null) || (node.topRight === null) || (node.bottomLeft === null) || (node.bottomRight === null)) {
			console.log("Invalid node type: ", node);
			return false;
		}
		if((node.objects !== null) || (node.count !== node.topLeft.count + node.topRight.count + node.bottomLeft.count + node.bottomRight.count)) {
			console.log("Invalid node objects count: ", node);
			return false;
		}
		if((node.topLeft.parent != node) || (node.topRight.parent != node) || (node.bottomLeft.parent != node) || (node.bottomRight.parent != node)) {
			console.log("Invalid node parent: ", node);
			return false;
		}
		if((node.topLeft.size != node.size / 2) || (node.topRight.size != node.size / 2) || (node.bottomLeft.size != node.size / 2) || (node.bottomRight.size != node.size / 2)) {
			console.log("Invalid node size: ", node);
			return false;
		}
			
		if(!ValidateTree(node.topLeft)) return false;
		if(!ValidateTree(node.topRight)) return false;
		if(!ValidateTree(node.bottomLeft)) return false;
		if(!ValidateTree(node.bottomRight)) return false;
		return true;
	}
}
exports.ValidateTree = ValidateTree

var addedObjects = []

function addRandomObj(node, n, fromX, toX, fromY, toY, fromSize, toSize){ /*DONE: Allow range to be passed*/
    for(var i = 0; i < n; i++){
        var randChoice = Math.floor(Math.random() * 2)
        var randX = fromX + Math.floor(Math.random() * (toX - fromX))
        var randY = fromY + Math.floor(Math.random() * (toY - fromY))
        if(randChoice == 1){
            var newObj = new tree.Object(randX, randY, null)
            //console.log(isIn(newObj))
            node = tree.addObject(node, newObj)
            addedObjects.push(newObj)
        }else{
			var sizeX = fromSize + Math.floor(Math.random() * (toSize - fromSize))
			var sizeY = fromSize + Math.floor(Math.random() * (toSize - fromSize))
			/* DONE: avoid the possibility of top > bottom & left > right by adding random size
				var randTX = Math.floor(Math.random() * 601)
				var randTY = Math.floor(Math.random() * 601)
			*/
            var newUnit = new tree.Unit(randX, randY, randX + sizeX, randY + sizeY, null)
            //console.log(isIn(newUnit))
            node = tree.addObject(node, newUnit)
            addedObjects.push(newUnit)
        }
    }
	return node /*DONE: in case the root changed*/
}
exports.addRandomObj = addRandomObj

function removeRandomObj(node, n){
    for(var i = 0; i < n; i++){
        var rand = Math.floor(Math.random() * objects.length)
        tree.removeObject(node, addedObjects[rand])
    }
}
exports.removeRandomObj = removeRandomObj

function TestAddAndSearchAll() {
	addedObjects = [];
	var root = new tree.Node(null, 0, 0, 600, 600, null, null, null, null, 0, [], 600)
	root = addRandomObj(root, 100, 10, 560, 10, 560, 2, 30)
	var l1 = [];
	tree.findInRadiusFromUniqueList(addedObjects, 250, 250, 500, l1);
	var l2 = [];
	tree.findInRadiusFromNode(root, 250, 250, 500, l2);
	console.log(ValidateTree(root) && (l1.length === l2.length));
}
exports.TestAddAndSearchAll = TestAddAndSearchAll

function TestAddAndSearchSome() {
	addedObjects = [];
	var root = new tree.Node(null, 0, 0, 600, 600, null, null, null, null, 0, [], 600)
	root = addRandomObj(root, 100, 10, 560, 10, 560, 2, 30)
	var ok = true;
	for(var k = 0; k < 100; k++) {
		var x = Math.random() * 600;
		var y = Math.random() * 600;
		var r = 1 + Math.random() * 50;
		var l1 = [];
		tree.findInRadiusFromUniqueList(addedObjects, x, y, r, l1);
		var l2 = [];
		tree.findInRadiusFromNode(root, x, y, r, l2);
		if(l1.length !== l2.length) ok = false;
	}
	console.log(ValidateTree(root) && ok);
}
exports.TestAddAndSearchSome = TestAddAndSearchSome

function TestAddAndSpeed() {
	addedObjects = [];
	var root = new tree.Node(null, 0, 0, 6000, 6000, null, null, null, null, 0, [], 6000)
	root = addRandomObj(root, 100000, 10, 5600, 10, 5600, 2, 30)
	var points = [];
	for(var k = 0; k < 1000; k++) {
		var x = Math.random() * 6000;
		var y = Math.random() * 6000;
		var r = 1 + Math.random() * 10;
		points.push({x:x, y:y, r:r});
	}
	var t0 = (new Date()).getTime()
	for(var k = 0; k < points.length; k++) {
		var point = points[k];
		var l1 = [];
		tree.findInRadiusFromUniqueList(addedObjects, point.x, point.y, point.r, l1);
	}
	var t1 = (new Date()).getTime()
	for(var k = 0; k < points.length; k++) {
		var point = points[k];
		var l2 = [];
		tree.findInRadiusFromNode(root, point.x, point.y, point.r, l2);
	}
	var t2 = (new Date()).getTime()
	console.log("Performance increase: x" + ((t1 - t0) / (t2 - t1)));
}
exports.TestAddAndSpeed = TestAddAndSpeed

function TestAddAndExpandSearchAll() {
	addedObjects = [];
	var root = new tree.Node(null, 0, 0, 600, 600, null, null, null, null, 0, [], 600)
	root = addRandomObj(root, 100, -5000, 5000, -5000, 5000, 2, 30)
	var l1 = [];
	tree.findInRadiusFromUniqueList(addedObjects, 0, 0, 10000, l1);
	var l2 = [];
	tree.findInRadiusFromNode(root, 0, 0, 10000, l2);
	console.log(ValidateTree(root) && (l1.length === l2.length));
}
exports.TestAddAndExpandSearchAll = TestAddAndExpandSearchAll

function TestAddAndExpandSearchSome() {
	addedObjects = [];
	var root = new tree.Node(null, 0, 0, 600, 600, null, null, null, null, 0, [], 600)
	root = addRandomObj(root, 100, -5000, 5000, -5000, 5000, 2, 30)
	var ok = true;
	for(var k = 0; k < 100; k++) {
		var x = -4000 + Math.random() * 8000;
		var y = -4000 + Math.random() * 8000;
		var r = 1 + Math.random() * 50;
		var l1 = [];
		tree.findInRadiusFromUniqueList(addedObjects, x, y, r, l1);
		var l2 = [];
		tree.findInRadiusFromNode(root, x, y, r, l2);
		if(l1.length !== l2.length) ok = false;
	}
	console.log(ValidateTree(root) && ok);
}
exports.TestAddAndExpandSearchSome = TestAddAndExpandSearchSome

function TestAddAndRemoveAndSearchAll() {
	addedObjects = [];
	var root = new tree.Node(null, 0, 0, 600, 600, null, null, null, null, 0, [], 600)
	root = addRandomObj(root, 100, 10, 560, 10, 560, 2, 30)
	for(var i = 0; i < 50; i++) {
		var index = Math.floor(Math.random() * addedObjects.length);
		var obj = addedObjects[i];
		addedObjects.splice(i, 1);
		tree.removeObject(root, obj);
	}
	var l1 = [];
	tree.findInRadiusFromUniqueList(addedObjects, 250, 250, 500, l1);
	var l2 = [];
	tree.findInRadiusFromNode(root, 250, 250, 500, l2);
	console.log(ValidateTree(root) && (l1.length === l2.length));
}
exports.TestAddAndRemoveAndSearchAll = TestAddAndRemoveAndSearchAll

function TestAddAndRemoveAndSearchSome() {
	addedObjects = [];
	var root = new tree.Node(null, 0, 0, 600, 600, null, null, null, null, 0, [], 600)
	root = addRandomObj(root, 100, 10, 560, 10, 560, 2, 30)
	for(var i = 0; i < 50; i++) {
		var index = Math.floor(Math.random() * addedObjects.length);
		var obj = addedObjects[i];
		addedObjects.splice(i, 1);
		tree.removeObject(root, obj);
	}
	var ok = true;
	for(var k = 0; k < 100; k++) {
		var x = Math.random() * 600;
		var y = Math.random() * 600;
		var r = 1 + Math.random() * 50;
		var l1 = [];
		tree.findInRadiusFromUniqueList(addedObjects, x, y, r, l1);
		var l2 = [];
		tree.findInRadiusFromNode(root, x, y, r, l2);
		if(l1.length !== l2.length) ok = false;
	}
	console.log(ValidateTree(root) && ok);
}
exports.TestAddAndRemoveAndSearchSome = TestAddAndRemoveAndSearchSome

function TestAddAndRemoveAndSearchMulti() {
	addedObjects = [];
	var root = new tree.Node(null, 0, 0, 600, 600, null, null, null, null, 0, [], 600)
	
	var ok = true;
	for(var j = 0; j < 100; j++) {
		root = addRandomObj(root, 100, -5000, 5000, -5000, 5000, 2, 30)
		for(var i = 0; i < 50; i++) {
			var index = Math.floor(Math.random() * addedObjects.length);
			var obj = addedObjects[i];
			addedObjects.splice(i, 1);
			tree.removeObject(root, obj);
		}
		for(var k = 0; k < 100; k++) {
			var x = -4000 + Math.random() * 8000;
			var y = -4000 + Math.random() * 8000;
			var r = 1 + Math.random() * 50;
			var l1 = [];
			tree.findInRadiusFromUniqueList(addedObjects, x, y, r, l1);
			var l2 = [];
			tree.findInRadiusFromNode(root, x, y, r, l2);
			if(l1.length !== l2.length) ok = false;
		}
	}
	console.log(ValidateTree(root) && ok);
}
exports.TestAddAndRemoveAndSearchMulti = TestAddAndRemoveAndSearchMulti

let test = exports;

test.TestAddAndSearchAll(); 
test.TestAddAndSearchSome();
test.TestAddAndSpeed();

test.TestAddAndExpandSearchAll();
test.TestAddAndExpandSearchSome();

test.TestAddAndRemoveAndSearchAll();
test.TestAddAndRemoveAndSearchSome();

test.TestAddAndRemoveAndSearchMulti();