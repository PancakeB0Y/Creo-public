class Node{
    constructor(parent, top, left, bottom, right, topLeft, topRight, bottomLeft, bottomRight, count, objects, size){
        this.parent = parent
        this.top = top
        this.left = left
        this.bottom = bottom
        this.right = right
        this.topLeft = topLeft
        this.topRight = topRight
        this.bottomLeft = bottomLeft
        this.bottomRight = bottomRight
        this.count = count
        this.objects = objects; // Array is the square leaf. null if the square is not leaf
        this.size = size
    }
}
exports.Node = Node

var root = new Node(null, 0, 0, 600, 600, null, null, null, null, 0, [], 600)

class Object{
    constructor(x, y , type){
        this.x = x
        this.y = y
        this.type = type
    }
}
exports.Object = Object

class Unit{
    constructor(top, left, bottom, right, type){
        this.top = top
        this.left = left
        this.bottom = bottom
        this.right = right
        this.type = type
    }
}
exports.Unit = Unit

var MIN_OBJECTS_PER_SQUARE = 2
var MAX_OBJECTS_PER_SQUARE = 8
var MIN_SQUARE_SIZE = 4

function isLeaf(node){
    if(node.topLeft || node.topRight || node.bottomLeft || node.bottomRight){
        return false
    }
    else{
        return true
    }
}
exports.isLeaf = isLeaf

function assignQuad(node, object){
    var middle1 = (node.top + node.bottom)/2
    var middle2 = (node.left + node.right)/2
    if(object.left === undefined){
        if(object.x <= middle1){
            if(object.y <= middle2){
                return [node.topLeft]
            }
            else{return [node.bottomLeft]}
        }
        else{ 
            if(object.y > middle2){
                return [node.bottomRight]
            }
            else{return [node.topRight]}
        }
    }else{
        var quads = []
        var topLeft
        var bottomRight
        if(object.top <= middle1){
            if(object.left <= middle2){
                quads.push(node.topLeft)
                var topLeft = node.topLeft
            }
            else{
                quads.push(node.bottomLeft)
                var topLeft = node.bottomLeft
            }
        }
        else{ 
            if(object.left > middle2){
                quads.push(node.bottomRight)
                var topLeft = node.bottomRight
            }
            else{
                quads.push(node.topRight)
                var topLeft = node.topRight
            }
        }
        
        if(object.bottom <= middle1){
            if(object.right <= middle2){
                quads.push(node.topLeft)
                var bottomRight = node.topLeft
            }
            else{
                quads.push(node.bottomLeft)
                var bottomRight = node.bottomLeft
            }
        }
        else{
            if(object.right > middle2){
                quads.push(node.bottomRight)
                var bottomRight = node.bottomRight
            }
            else{
                quads.push(node.topRight)
                var bottomRight = node.topRight
            }
        }
        
        if(quads[0] === quads[1]){ /*DONE: As mush ass possible we should compare with === instead of ==*/ //if(quads[0] == quads[1]){
            quads = [topLeft]
        }
        if(topLeft === node.topLeft && bottomRight === node.bottomRight){ /*DONE: As mush ass possible we should compare with === instead of ==*/ // if(topLeft == node.topLeft && bottomRight == node.bottomRight){
            quads.push(node.topRight)
            quads.push(node.bottomLeft)
        }
        return quads
    }
}
exports.assignQuad = assignQuad

function split(node){
    var size = node.size/2
    var middle1 = (node.top + node.bottom)/2
    var middle2 = (node.left + node.right)/2

    node.topLeft = new Node(node, node.top, node.left, middle1, middle2, null, null, null, null, 0, [], size)
    node.bottomLeft = new Node(node, node.top, middle2, middle1, node.right, null, null, null, null, 0, [], size)
    node.topRight = new Node(node, middle1, node.left, node.bottom, middle2, null, null, null, null, 0, [], size)
    node.bottomRight = new Node(node, middle1, middle2, node.bottom, node.right, null, null, null, null, 0, [], size)

    for(var i = 0; i<node.objects.length; i++){ /*DONE*/ //node.objects[i].length
        let quadrant = assignQuad(node, node.objects[i])
        for(var j = 0; j < quadrant.length; j++){ /*DONE Use j  instead of i*/ //for(var i = 0; i < quadrant.length; i++){
            addObjectInner(quadrant[j], node.objects[i]) /*DONE Cycle through quadrants  */ //addObject(quadrant, node.objects[i])
        }
    }
	
	/*DONE: we need to be ready for the count to change*/
	node.count = node.topLeft.count + node.bottomLeft.count + node.topRight.count + node.bottomRight.count
	
    node.objects = null
}
exports.split = split

function newQuad(node, object){
    if(object.left === undefined){
        if(object.x <= node.top  && object.y <= node.left){
            return 'topLeft'
        }else if((object.x <= node.top && object.y > node.left) || (object.x > node.top && object.x <= node.bottom && object.y > node.right)){ /*DONE: the second condition requires expansion upwards*/ //}else if((object.x <= node.top && object.y > node.left) || (object.x > node.top && object.y <= node.left)){
            return 'bottomLeft'
        }else if(object.x > node.bottom && object.y > node.right){
            return 'bottomRight'
        }else if((object.x > node.bottom && object.y <= node.right) || (object.x > node.top && object.x <= node.bottom && object.y <= node.left)){ /*DONE: the second condition requires expansion downwards*/ //}else if((object.x > node.bottom && object.y <= node.right) || (object.x <= node.bottom && object.y > node.right)){
            return 'topRight'
        }
    }else{
        if(object.top < node.top  && object.left < node.left){ /*DONE: the equal cases should be thought through*/ //if(object.top <= node.top  && object.left <= node.left){
            return 'topLeft'
        }else if(object.top < node.top && object.left >= node.left){ /*DONE: again the same change */
            return 'bottomLeft'
        }else if(object.bottom > node.bottom && object.right > node.right){
            return 'bottomRight'
        }else if(object.bottom > node.bottom && object.right <= node.right){ /*DONE: again the same change */
            return 'topRight'
		}else if(object.top >= node.top && object.bottom <= node.bottom && object.left < node.left){ /*DONE: again the same change. We need codition reordering to avoid unnecessary expansion  */
            return 'topRight'
		}else if(object.top >= node.top && object.bottom <= node.bottom && object.right > node.right){ /*DONE: again the same change. We need codition reordering to avoid unnecessary expansion  */
            return 'bottomLeft'
		}
    }
}
exports.newQuad = newQuad

function isIn(node, object){
    if(object.left === undefined){
        if(object.x > node.top && object.x <= node.bottom && object.y > node.left && object.y <= node.right){ /*DONE: The range should be closed only on one size. Currently we use x > top & y <= bottom*/
            return true
        }else{return false}
    }else{
        if(object.top >= node.top && object.bottom <= node.bottom && object.left >= node.left && object.right <= node.right){ 
            return true /*DONE: If it is in return true*/ // return false
        }else{return false}  /*DONE: If it is in return true*/ // }else{return true}
    }
}
exports.isIn = isIn

function expandNode(node, object){
    var quadrant = newQuad(node, object)
    var _middle1
    var _middle2
    

    if(quadrant == 'topLeft'){
        var newParent = new Node(null, node.top - node.size, node.left - node.size, node.bottom, node.right, null, null, null, null, node.count, null, node.size*2);
        _middle1 = (newParent.top + newParent.bottom)/2
        _middle2 = (newParent.left + newParent.right)/2
        node.parent = newParent
        newParent.topLeft = new Node(newParent, newParent.top, newParent.left, _middle1, _middle2, null, null, null, null, 0, [], node.size) /*DONE: We need to use node.size instread of newParent.size*/
        newParent.bottomLeft = new Node(newParent, newParent.top, _middle2, _middle1, newParent.right, null, null, null, null, 0, [], node.size)
        newParent.topRight = new Node(newParent, _middle1, newParent.left, newParent.bottom, _middle2, null, null, null, null, 0, [], node.size)
		newParent.bottomRight = node; /*DONE: we need to set all 4*/
		node = newParent /*DONE: this is now the new root*/
    }else if(quadrant == 'bottomLeft'){
        var newParent = new Node(null, node.top - node.size, node.left, node.bottom, node.right + node.size, null, null, null, null, node.count, null, node.size*2);
        _middle1 = (newParent.top + newParent.bottom)/2
        _middle2 = (newParent.left + newParent.right)/2
        node.parent = newParent
        newParent.topLeft = new Node(newParent, newParent.top, newParent.left, _middle1, _middle2, null, null, null, null, 0, [], node.size)
        newParent.bottomLeft = new Node(newParent, newParent.top, _middle2, _middle1, newParent.right, null, null, null, null, 0, [], node.size)
		newParent.topRight = node; /*DONE: we need to set all 4*/
        newParent.bottomRight = new Node(newParent, _middle1, _middle2, newParent.bottom, newParent.right, null, null, null, null, 0, [], node.size)
		node = newParent /*DONE: this is now the new root*/
    }else if(quadrant == 'topRight'){
        var newParent = new Node(null, node.top, node.left - node.size, node.bottom + node.size, node.right, null, null, null, null, node.count, null, node.size*2);
        _middle1 = (newParent.top + newParent.bottom)/2
        _middle2 = (newParent.left + newParent.right)/2
        node.parent = newParent
        newParent.topLeft = new Node(newParent, newParent.top, newParent.left, _middle1, _middle2, null, null, null, null, 0, [], node.size)
		newParent.bottomLeft = node; /*DONE: we need to set all 4*/
        newParent.topRight = new Node(newParent, _middle1, newParent.left, newParent.bottom, _middle2, null, null, null, null, 0, [], node.size)
        newParent.bottomRight = new Node(newParent, _middle1, _middle2, newParent.bottom, newParent.right, null, null, null, null, 0, [], node.size)
		node = newParent /*DONE: this is now the new root*/
    }else if(quadrant == 'bottomRight'){
        var newParent = new Node(null, node.top, node.left, node.bottom + node.size, node.right + node.size, null, null, null, null, node.count, null, node.size*2);
        _middle1 = (newParent.top + newParent.bottom)/2
        _middle2 = (newParent.left + newParent.right)/2
        node.parent = newParent
		newParent.topLeft = node; /*DONE: we need to set all 4*/
        newParent.bottomLeft = new Node(newParent, newParent.top, _middle2, _middle1, newParent.right, null, null, null, null, 0, [], node.size)
        newParent.topRight = new Node(newParent, _middle1, newParent.left, newParent.bottom, _middle2, null, null, null, null, 0, [], node.size)
        newParent.bottomRight = new Node(newParent, _middle1, _middle2, newParent.bottom, newParent.right, null, null, null, null, 0, [], node.size)
		node = newParent /*DONE: this is now the new root*/
    }
	else {
		console.log("error 1");
		console.log(object);
		console.log(node);
        console.trace();
		return node;
	}
	
    if(node.count < MIN_OBJECTS_PER_SQUARE){
		join(node)
    }

	if(!isIn(node, object)){
		node = expandNode(node, object) /*DONE: we need to return the new root and ne need to extend the new root*/ // expandNode(node, object)
	}

	return node;
}
exports.expandNode = expandNode

function addObjectInner(node, object) { /*DONE: This funtion should properly increase the record count. So now it will return by how much it changed.*/
    if(isLeaf(node) && (node.count < MAX_OBJECTS_PER_SQUARE || node.size <= MIN_SQUARE_SIZE)){
        node.objects.push(object);
        node.count++
		return 1; /*DONE: The cont changed by 1*/
    }
    else { /*DONE: it is better to remove this check. It is pointless*/ // if((isLeaf(node) && node.count >= MAX_OBJECTS_PER_SQUARE) || !isLeaf(node))
        if(isLeaf(node)){ /*DONE: It is pointless to check the count.*/ // if(isLeaf(node) && node.count >= MAX_OBJECTS_PER_SQUARE){
            split(node)
        }
        let quadrants = assignQuad(node, object)
        for(var i = 0; i < quadrants.length; i++){
            addObjectInner(quadrants[i], object)
        }
		node.count = node.topLeft.count + node.bottomLeft.count + node.topRight.count + node.bottomRight.count /*DONE: the count should increase depending on the count increae for all children*/
    }
}

/*DONE: To simplify the code and avoid unwanted expand separate addObject to function that can do expand and addObjectInner without expand capabilities*/
function addObject(node, object) {
    if(!isIn(node, object)){
        node = expandNode(node, object) /*DONE: Maybe the parent changed*/ //expandNode(node, object)
    }
	addObjectInner(node, object);
	return node; /*DONE: return the root (possible a new one after expansion)*/
}
exports.addObject = addObject

/*DONE: In the future a better algorithm can be devised*/
/*DONE: The function returns the number of skipped elements form the source*/
function addNewObjects(target, source) {
	let skipped = 0;
	for(let i = 0; i < source.length; i++) {
		let current = source[i];
		let found = false;
		for(let j = 0; j < target.length; j++) {
			if(target[j] === current) {
				found = true;
			}
		}
		if(!found) {
			target.push(current);
		}
		else {
			skipped++;
		}
	}
	return skipped;
}

function join(node){
    node.objects = []

	let skipped = 0;
	/*DONE: Units can reside in more than one child. We need to dedup them*/
	skipped += addNewObjects(node.objects, node.topLeft.objects);
	skipped += addNewObjects(node.objects, node.topRight.objects);
	skipped += addNewObjects(node.objects, node.bottomLeft.objects);
	skipped += addNewObjects(node.objects, node.bottomRight.objects);
	
	node.count -= skipped;
	
	/*
    node.objects = node.objects.concat(node.topLeft.objects)
    node.objects = node.objects.concat(node.topRight.objects)
    node.objects = node.objects.concat(node.bottomLeft.objects)
    node.objects = node.objects.concat(node.bottomRight.objects)
	*/

    node.topLeft.parent = null
    node.topRight.parent = null
    node.bottomLeft.parent = null
    node.bottomRight.parent = null

    node.topLeft = null
    node.topRight = null
    node.bottomLeft = null
    node.bottomRight = null
	
	return skipped;
}
exports.join = join

function removeObject(node, object) {
    if(isLeaf(node)){
        for(var i = 0; i < node.objects.length; i++){
            if(node.objects[i] == object){
                node.objects.splice(i, 1) 
                node.count--

                var parent = node.parent
                while(parent!=null){
                    parent.count--
                    if(parent.count < MIN_OBJECTS_PER_SQUARE){
                        join(parent)
                    }
                    parent = parent.parent
                }
                break
            }
        }
    }else{
        let quadrants = assignQuad(node, object)
        for(var i = 0; i < quadrants.length; i++){
            removeObject(quadrants[i], object)
        }
    }
    return node /*Done: Return the count change instead of a node*/ // return node
}
exports.removeObject = removeObject

function findInRadius(node, x, y, r){
    var count = 0
    for(var i = 0; i < node.objects.length; i++){
        if(node.objects[i].x <= x + r && node.objects[i].y <= y + r && node.objects[i].x > x - r && node.objects[i].y > y - r){
            count++
        }
    }
    return count
}
exports.findInRadius = findInRadius

function findInRadius2(node, x, y, r) {
    if((x - r > node.right) && (x + r < node.left) && (y - r > node.bottom) && (y + r < node.top)){ 
        return 0;
    }
    else if(isLeaf(node)) {
        var count = 0
        count += findInRadius(node, x, y, r)
        return count
    }
    else {
        var count = 0
        count += findInRadius2(node.topLeft, x, y, r);
        count += findInRadius2(node.topRight, x, y, r);
        count += findInRadius2(node.bottomLeft, x, y, r);
        count += findInRadius2(node.bottomRight, x, y, r);
        return count
    }

}
exports.findInRadius2 = findInRadius2

function searchObj(node){
    var objects = []
    if(isLeaf(node)) {
        for(var i = 0; i < node.objects.length; i++){
            objects.push(node.objects[i])
        }
        return objects
    }
    else {
        objects = objects.concat(searchObj(node.topLeft))
        objects = objects.concat(searchObj(node.topRight))
        objects = objects.concat(searchObj(node.bottomLeft))
        objects = objects.concat(searchObj(node.bottomRight))
        return objects
    }
}
exports.searchObj = searchObj

function findInRadiusFromUniqueList(list, x, y, r, objs){
    for(var i = 0; i < list.length; i++){
		var obj = list[i];
		if(obj.left === undefined) {
			if(obj.x <= x + r && obj.y <= y + r && obj.x > x - r && obj.y > y - r){
				objs.push(obj);
			}
		}
		else {
			if(obj.top < x + r && obj.left < y + r && obj.bottom > x - r && obj.right > y - r){
				objs.push(obj);
			}
		}
    }
}
exports.findInRadiusFromUniqueList = findInRadiusFromUniqueList

function addNewObject(target, obj) {
	//console.log(obj);
	let found = false;
	for(let j = 0; j < target.length; j++) {
		if(target[j] === obj) {
			found = true;
		}
	}
	if(!found) {
		target.push(obj);
	}
}
exports.addNewObject = addNewObject

function findAtFromList(list, x, y, objs){
    for(var i = 0; i < list.length; i++){
		var obj = list[i];
		if(obj.left === undefined) {
			if(obj.x == x && obj.y == y){
				addNewObject(objs, obj);
			}
		}
		else {
			if(obj.top < x && obj.left < y && obj.bottom >= x && obj.right >= y){
				addNewObject(objs, obj);
			}
		}
    }
}
exports.findAtFromList = findAtFromList

function findInRadiusFromList(list, x, y, r, objs){
    for(var i = 0; i < list.length; i++){
		var obj = list[i];
		if(obj.left === undefined) {
			if(obj.x <= x + r && obj.y <= y + r && obj.x > x - r && obj.y > y - r){
				addNewObject(objs, obj);
			}
		}
		else {
			if(obj.top < x + r && obj.left < y + r && obj.bottom > x - r && obj.right > y - r){
				addNewObject(objs, obj);
			}
		}
    }
}
exports.findInRadiusFromList = findInRadiusFromList

function findAtFromNode(node, x, y, objs){
    if((x > node.bottom) || (x <= node.top) || (y > node.right) || (y <= node.left)){ 
        return;
    }
    else if(isLeaf(node)) {
		findAtFromList(node.objects, x, y, objs);
    }
    else {
        findAtFromNode(node.topLeft, x, y, r, objs);
        findAtFromNode(node.topRight, x, y, r, objs);
        findAtFromNode(node.bottomLeft, x, y, r, objs);
        findAtFromNode(node.bottomRight, x, y, r, objs);
    }
}
exports.findAtFromNode = findAtFromNode

function findInRadiusFromNode(node, x, y, r, objs){
    if((x - r > node.bottom) || (x + r < node.top) || (y - r > node.right) || (y + r < node.left)){ 
        return;
    }
    else if(isLeaf(node)) {
		findInRadiusFromList(node.objects, x, y, r, objs);
    }
    else {
        findInRadiusFromNode(node.topLeft, x, y, r, objs);
        findInRadiusFromNode(node.topRight, x, y, r, objs);
        findInRadiusFromNode(node.bottomLeft, x, y, r, objs);
        findInRadiusFromNode(node.bottomRight, x, y, r, objs);
    }
}
exports.findInRadiusFromNode = findInRadiusFromNode




