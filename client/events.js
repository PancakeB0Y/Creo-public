// const { returnOnlyNumbersFromString } = require("./additionalFunctions_Variables");

// const { json } = require("express/lib/response");

var eventStuff = new (function (){
    this.currEvent;
    let that = this; //we can call currEven in certain functions
    let editingParameter = "condition";
    this.isEditingObjectEvents = false;
    this.editingParameter = editingParameter;

    let config = {
        "+":{
            numChildren: 2, //number of children the element has
            childrenType: [],
            divIds: [], //the ids of the divs that will be added in the element
            type: "operator" //shows where the type is
        },
        "-":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        "*":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        "/":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        ">":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        "<":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        ">=":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        "<=":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        "=":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        "==":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        "!=":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        "&&":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        "||":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "operator"
        },
        "array":{
            numChildren: 1,
            childrenType: ["string"],
            divIds: [],
            type: "function"
        },
        "?:":{
            numChildren: 3,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        ".":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "globalVar":{
            numChildren: 1,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "objectVar":{
            numChildren: 1,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "tmpVar":{
            numChildren: 1,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "number":{
            numChildren: 0,
            childrenType: [],
            divIds: ["editEventsToolConditionPopupNumberInputToCopy"],
            type: "variable"
        },
        "string":{
            numChildren: 0,
            childrenType: [],
            divIds: ["editEventsToolConditionPopupStringInputToCopy"],
            type: "variable"
        },
        "bool":{
            numChildren: 0,
            childrenType: [],
            divIds: ["editEventsToolConditionPopupBooleanInputToCopy"],
            type: "variable"
        },
        "undefined":{
            numChildren: 0,
            childrenType: [],
            divIds: ["editEventsToolConditionPopupUndefinedInputToCopy"],
            type: "variable"
        },
        "abs":{
            numChildren: 1,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "sin":{
            numChildren: 1,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "cos":{
            numChildren: 1,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "getObject":{
            numChildren: 1,
            childrenType: [],
            divIds: ["editEventsToolConditionPopupObjectSelectObjectButtonInputToCopy"],
            type: "function"
        },
        "setPosition":{
            numChildren: 3,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "addTag":{
            numChildren: 4,
            childrenType: [],
            childrenName: ["objectId", "name", "type", "value"],
            divIds: [],
            type: "function"
        },
        "endGame":{
            numChildren: 0,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "addTag":{
            numChildren: 4,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "consumeEvent":{
            numChildren: 1,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "this":{
            numChildren: 0,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "seq":{
            numChildren: 2,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "closestObject":{
            numChildren: 4,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "checkEmpty":{
            numChildren: 3,
            divIds: [],
            type: "function"
        },
        "cloneObject":{
            numChildren: 1,
            divIds: [],
            type: "function"
        },
        "makeEnemy":{
            numChildren: 5,
            childrenType: [],
            divIds: [],
            type: "function"
        },
        "angle":{
            numChildren: 4,
            childrenType: [],
            divIds: [],
            type: "function"
        },
                
    }
    this.config = config;

    let idToElement = {};
    this.idToElement = idToElement;

    let idToChild = {};
    this.idToChild = idToChild;

    function loadOperetorsInList(){
        //loads all the options in the select list of every child in the edit event popup child list

        let theElement, theObjectElement;
        let optionToCopy, optionObjectToCopy;
        theElement = getElementById("editEventsToolEditEventsConditionPopupDivTreeElementDivToCopy");
        optionToCopy = theElement.querySelector("#TreeElementDivTypeInputOptionToCopy");
        
        theObjectElement = document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsConditionPopupDiv").querySelector("#editObjectsToolEditObjectsConditionPopupDivTreeElementDivToCopy");
        optionObjectToCopy = theElement.querySelector("#TreeElementDivTypeInputOptionToCopy");
        

        for(let key in config){
            let currCopy = optionToCopy.cloneNode(true);
            currCopy.innerHTML = key;
            currCopy.value = key;

            currCopy.style.display = "block";

            currCopy.removeAttribute("id");

            theElement.querySelector("select").appendChild(currCopy);

            
            let currObjectCopy = optionObjectToCopy.cloneNode(true);
            currObjectCopy.innerHTML = key;
            currObjectCopy.value = key;

            currObjectCopy.style.display = "block";

            currObjectCopy.removeAttribute("id");

            theObjectElement.querySelector("select").appendChild(currObjectCopy);
        }
    }
    loadOperetorsInList();
    this.loadOperetorsInList = loadOperetorsInList;

    function returnExpFromId(exp, targetId){
        //go throygh tree and return expression if id's match
        if(exp.id == targetId){
            return exp;
        }else{
            for(let key in exp.children){
                let theReturn = returnExpFromId(exp.children[key], targetId);
                if(theReturn != undefined){
                    return theReturn;
                }
            }

            return undefined;
        }
    }
    this.returnExpFromId = returnExpFromId;

    function getElementById(theId){
        try{
            if(idToElement[theId] == undefined){
                if(!that.isEditingObjectEvents){
                    idToElement[theId] = document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsConditionPopupDiv").querySelector("#" + theId);
                }else{
                    idToElement[theId] = document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsConditionPopupDiv").querySelector("#" + theId);
                }
            }

            return idToElement[theId];
        }catch(error){
            console.error(error);
        }
    }
    this.getElementById = getElementById;

    function addExp(parentExp, parentElement, newId){
        try{
            if(newId == undefined) newId = that.currEvent.idCount++;

            let newExp = new Exp();
            newExp.id = newId;
            parentExp.children.push(newExp);
            
            let newExpElement;
            if(!that.isEditingObjectEvents){
                newExpElement = getElementById("editEventsToolEditEventsConditionPopupDivTreeElementDivToCopy").cloneNode(true);
            }else{
                newExpElement = getElementById("editObjectsToolEditObjectsConditionPopupDivTreeElementDivToCopy").cloneNode(true);
            }
            newExpElement.id = "editEventsToolEditEventsConditionPopupDivTreeElementDiv_" + newExp.id;
            newExpElement.style.display = "flex"
            parentElement.appendChild(newExpElement);

            idToChild[newExp.id] = newExpElement;
        }catch(error){
            console.error(error);
        }
    }
    this.addExp = addExp;

    function addExpElement(thisExp, parentElement){
        try{
            let newExpElement;
            if(!that.isEditingObjectEvents){
                newExpElement = getElementById("editEventsToolEditEventsConditionPopupDivTreeElementDivToCopy").cloneNode(true);
            }else{
                newExpElement = getElementById("editObjectsToolEditObjectsConditionPopupDivTreeElementDivToCopy").cloneNode(true);
            }
            newExpElement.id = "editEventsToolEditEventsConditionPopupDivTreeElementDiv_" + thisExp.id;
            newExpElement.style.display = "flex"
            parentElement.appendChild(newExpElement);

            idToChild[thisExp.id] = newExpElement;

            if(thisExp.type != undefined){
                let currConfig = config[thisExp.type];

                newExpElement.querySelector("select").value = thisExp.type;

                if(currConfig) {
                    for(let key in currConfig.divIds){
                        if(currConfig.divIds[key]) {
                            let clonedElement = document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsConditionPopupDiv").querySelector("#" + currConfig.divIds[key]).cloneNode(true);
                            clonedElement.removeAttribute("id");

                            if(thisExp.value != undefined){
                                let valueElement = clonedElement.querySelector("input");
                                if(valueElement != undefined){
                                    valueElement.value = thisExp.value;
                                }else{
                                    valueElement = clonedElement.querySelector("select");
                                    
                                    if(valueElement != undefined){
                                        valueElement.value = thisExp.value;
                                    }
                                }
                            }

                            if(!that.isEditingObjectEvents){
                                newExpElement.querySelector(".editEventsToolConditionPopupTreeElementOptionsHolder").appendChild(clonedElement);
                            }else{
                                newExpElement.querySelector(".editObjectsToolConditionPopupTreeElementOptionsHolder").appendChild(clonedElement);
                            }
                        }
                    }
                }
            }

            return newExpElement;
        }catch(error){
            console.error(error);
        }
    }
    this.addExpElement = addExpElement;

    function loadTree(thisExp, parentElement){
        try{
            let newElement = addExpElement(thisExp, parentElement);

            let newParentElement;
            if(!that.isEditingObjectEvents){
                newParentElement = newElement.querySelector(".editEventsToolConditionPopupTreeElementChildrenHolder");
            }else{
                newParentElement = newElement.querySelector(".editObjectsToolConditionPopupTreeElementChildrenHolder");
            }
            for(let key in thisExp.children){
                loadTree(thisExp.children[key], newParentElement);
            }
        }catch(error){
            console.error("loadTree", error);
        }
    }
    this.loadTree = loadTree;

    function loadCondition(theEvent){
        that.currEvent = theEvent;

        if(!that.isEditingObjectEvents){
            document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsConditionPopupDiv").querySelector("#editEventsToolEditEventsConditionPopupDivTreeHolder").innerHTML = "";
        }else{
            document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsConditionPopupDiv").querySelector("#editObjectsToolEditObjectsConditionPopupDivTreeHolder").innerHTML = "";
        }
        idToChild = {};

        if(that.currEvent[editingParameter] == undefined){
            let newExp = new Exp();
            newExp.id = 1;
            that.currEvent[editingParameter] = newExp;
            that.currEvent.idCount = 2;
            let newExpElement;
            
            if(!that.isEditingObjectEvents){
                newExpElement = getElementById("editEventsToolEditEventsConditionPopupDivTreeElementDivToCopy").cloneNode(true);
            }else{
                newExpElement = getElementById("editObjectsToolEditObjectsConditionPopupDivTreeElementDivToCopy").cloneNode(true);
            }
            newExpElement.id = "editEventsToolEditEventsConditionPopupDivTreeElementDiv_" + newExp.id;
            newExpElement.style.display = "flex"
            if(!that.isEditingObjectEvents){
                document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsConditionPopupDiv").querySelector("#editEventsToolEditEventsConditionPopupDivTreeHolder").appendChild(newExpElement);
            }else{
                document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsConditionPopupDiv").querySelector("#editObjectsToolEditObjectsConditionPopupDivTreeHolder").appendChild(newExpElement);
            }

            idToChild[newExp.id] = newExpElement;

            
            displayEquation(returnEquationFromExpression(that.currEvent[editingParameter]));
        }else{
            let parentElement;
            if(!that.isEditingObjectEvents){
                parentElement = document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsConditionPopupDiv").querySelector("#editEventsToolEditEventsConditionPopupDivTreeHolder");
            }else{
                parentElement = document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsConditionPopupDiv").querySelector("#editObjectsToolEditObjectsConditionPopupDivTreeHolder");
            }
                loadTree(that.currEvent[editingParameter], parentElement);

            displayEquation(returnEquationFromExpression(that.currEvent[editingParameter]));
        }
    }
    this.loadCondition = loadCondition;

    function startEditingCondition(thisId, isEditingObjectEvents_){
        thisId = returnOnlyNumbersFromString(thisId);
        that.isEditingObjectEvents = isEditingObjectEvents_;

        editingParameter = "condition";

        if(!that.isEditingObjectEvents){
            document.getElementById("editEventsToolEditEventsConditionPopupDiv").style.display = "flex";
            document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsConditionPopupDiv").querySelector("#editEventsToolEditEventsConditionPopupDivTreeHolder").innerHTML = "";
            document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsConditionPopupDiv").querySelector("#editEventsToolEditEventsConditionPopupDivEquasionInput").value = "";
            
            that.currEvent = map.currMap.config.globalEvents[thisId];
        }else{
            document.getElementById("editObjectsToolEditEventsConditionPopupDiv").style.display = "flex";
            document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsConditionPopupDiv").querySelector("#editObjectsToolEditObjectsConditionPopupDivTreeHolder").innerHTML = "";
            document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsConditionPopupDiv").querySelector("#editObjectsToolEditObjectsConditionPopupDivEquasionInput").value = "";
        
            that.currEvent = map.currMap.config.objectTypes[currEditObjectId].events[thisId];
        }

        idToChild = {};

        loadCondition(that.currEvent);
    }
    this.startEditingCondition = startEditingCondition;

    function startEditingAction(thisId, isEditingObjectEvents_){
        thisId = returnOnlyNumbersFromString(thisId);
        that.isEditingObjectEvents = isEditingObjectEvents_;

        editingParameter = "action";

        if(!that.isEditingObjectEvents){
            document.getElementById("editEventsToolEditEventsConditionPopupDiv").style.display = "flex";
            document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsConditionPopupDiv").querySelector("#editEventsToolEditEventsConditionPopupDivTreeHolder").innerHTML = "";
            document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsConditionPopupDiv").querySelector("#editEventsToolEditEventsConditionPopupDivEquasionInput").value = "";
            
            that.currEvent = map.currMap.config.globalEvents[thisId];
        }else{
            document.getElementById("editObjectsToolEditEventsConditionPopupDiv").style.display = "flex";
            document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsConditionPopupDiv").querySelector("#editObjectsToolEditObjectsConditionPopupDivTreeHolder").innerHTML = "";
            document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsConditionPopupDiv").querySelector("#editObjectsToolEditObjectsConditionPopupDivEquasionInput").value = "";
        
            that.currEvent = map.currMap.config.objectTypes[currEditObjectId].events[thisId];
        }

        idToChild = {};


        loadCondition(that.currEvent);
    }
    this.startEditingAction = startEditingAction;

    function onTypeChange(element){
        try{
            let newType = element.value;
            let expId = returnOnlyNumbersFromString(element.parentNode.parentNode.parentNode.id);
            let thisElement = element.parentNode.parentNode.parentNode;
            // console.log(that.currEvent[editingParameter], expId);
            let thisExp = returnExpFromId(that.currEvent[editingParameter], expId);
            thisExp.type = newType;
            let currConfig = config[newType];

            if(!that.isEditingObjectEvents){
                thisElement.querySelector(".editEventsToolConditionPopupTreeElementOptionsHolder").innerHTML = "";
            }else{
                thisElement.querySelector(".editObjectsToolConditionPopupTreeElementOptionsHolder").innerHTML = "";
            }
            if(currConfig) {
                for(let key in currConfig.divIds){
                    if(currConfig.divIds[key]) {
                        let clonedElement = document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsConditionPopupDiv").querySelector("#" + currConfig.divIds[key]).cloneNode(true);
                        clonedElement.removeAttribute("id");

                        if(!that.isEditingObjectEvents){
                            thisElement.querySelector(".editEventsToolConditionPopupTreeElementOptionsHolder").appendChild(clonedElement);
                        }else{
                            thisElement.querySelector(".editObjectsToolConditionPopupTreeElementOptionsHolder").appendChild(clonedElement);
                        }
                    }
                }
                var childrenHolder;
                if(!that.isEditingObjectEvents){
                    childrenHolder = thisElement.querySelector(".editEventsToolConditionPopupTreeElementChildrenHolder");
                }else{
                    childrenHolder = thisElement.querySelector(".editObjectsToolConditionPopupTreeElementChildrenHolder");
                }
                while(thisExp.children.length < currConfig.numChildren) {
                    addExp(thisExp, childrenHolder);
                }
                while(thisExp.children.length > currConfig.numChildren) {
                    childrenHolder.removeChild(idToChild[thisExp.children[currConfig.numChildren].id]);
                    thisExp.children.splice(currConfig.numChildren, 1);
                }
                for(let i in thisExp.children){
                    let theChild = thisExp.children[i];
                    let theSelectElement = idToChild[theChild.id].querySelector("select");
                    if(currConfig.childrenType[i] != undefined){
                        theSelectElement.value = currConfig.childrenType[i];
                        onTypeChange(theSelectElement);
                        theSelectElement.disabled = true;
                    }else{
                        theSelectElement.disabled = false;
                    }
                }
            }

            displayEquation(returnEquationFromExpression(that.currEvent[editingParameter]));
        }catch(error){
            console.error(error);
        }
    }
    this.onTypeChange = onTypeChange;

    function setValueOnChange(theElement){
        let newValue = theElement.value;
        let expId = returnOnlyNumbersFromString(theElement.parentNode.parentNode.parentNode.parentNode.id);
        let theExp = returnExpFromId(that.currEvent[editingParameter], expId);

        if(newValue == "true" || newValue == "false") newValue = (newValue === "true");

        theExp.value = newValue;

        displayEquation(returnEquationFromExpression(that.currEvent[editingParameter]));
    }
    this.setValueOnChange = setValueOnChange;

    function returnEquationFromExpression(currExp){
        try{
            if(config[currExp.type].type == 'operator'){
                return ("(" + returnEquationFromExpression(currExp.children[0]) + currExp.type + returnEquationFromExpression(currExp.children[1]) + ")");
            }else if(config[currExp.type].type == 'function'){
                let string = "";
                string += currExp.type + "(";
                for(let i in currExp.children){
                    string += returnEquationFromExpression(currExp.children[i]);
                    if(i != currExp.children.length-1){
                        string += ",";
                    }
                }
                return (string + ")");
            }else if(config[currExp.type].type == 'function_variable'){
                return currExp.type + "(" + currExp.value + ")";
            }else if(config[currExp.type].type == 'variable'){
                return (currExp.value);
            }
        }catch(error){
            // console.error(error);
        }
    }
    this.returnEquationFromExpression = returnEquationFromExpression;

    function displayEquation(newEquation){
        if(newEquation == undefined) return;
        if(!that.isEditingObjectEvents){
            document.getElementById("editEventsTool").querySelector("#editEventsToolEditEventsConditionPopupDiv").querySelector("#editEventsToolEditEventsConditionPopupDivEquasionInput").value = newEquation;
        }else{
            document.getElementById("editObjectsTool").querySelector("#editObjectsToolEditEventsConditionPopupDiv").querySelector("#editObjectsToolEditObjectsConditionPopupDivEquasionInput").value = newEquation;
        }
    }
    this.displayEquation = displayEquation;

    function equationIntoCondition(theEquation){
        try{
            let charList = theEquation.split("");
            let tokenList = [];
            let openBracketIdList = [];
            let openBracketIdListBr = 0;
            let numberOpenBracket = 0;
            let numberClosingBracket = 0;

            function addToTokenList(string, type){
                if(type == "operator"){
                    if(string == "("){
                        numberOpenBracket++;
                        openBracketIdList[openBracketIdListBr] = tokenList.length;
                        openBracketIdListBr++;
                        tokenList.push(new StringToken("bracket", string));
                        tokenList[tokenList.length-1].commas = [];
                    }else if(string == ")"){
                        numberClosingBracket++;
                        tokenList[openBracketIdList[openBracketIdListBr-1]].closingId = tokenList.length-openBracketIdList[openBracketIdListBr-1];
                        openBracketIdListBr--;
                        tokenList.push(new StringToken("bracket", string));
                    }else if(string == ","){
                        tokenList[openBracketIdList[openBracketIdListBr-1]].commas.push(tokenList.length-openBracketIdList[openBracketIdListBr-1]);
                        tokenList.push(new StringToken("comma", string));
                    }else{
                        tokenList.push(new StringToken(type, string));
                    }
                }else{
                    tokenList.push(new StringToken(type, string));
                }
            }

            function tokenListToExp(theList, theId){
                try{
                    if(theList.length == 0) return {
                        success: false,
                        value: "Something went wrong."
                    };

                    let currIndex = 0;
                    let thisTree;

                    if(theList[currIndex].closingId != undefined){
                        //deals with the brackets
                        if(theList[currIndex].closingId == theList.length-1){
                            //in case the whole list list is incapsulated in brackets
                            theList = theList.splice(1, theList.length-1);
                            theList = theList.splice(0, theList.length-1);
                            return tokenListToExp(theList, theId);
                        }else{
                            //if we have a equasion (type: "(10)+(12)")
                            let return1 = tokenListToExp(theList.splice(currIndex, currIndex+theList[currIndex].closingId+1), theId);
                            if(!return1.success){ return return1; }else{ theId = return1.theId; return1 = return1.value; };
                            if(currIndex >= theList.length) return {success: false, value: "Your equasion is invalid!"};
                            if(theList[currIndex].type == "operator"){
                                if(currIndex+1 < theList.length){
                                    if(theList[currIndex+1].type == "operator"){
                                        theList[currIndex].value += theList[currIndex+1].value;
                                        thisTree = new Exp();
                                        thisTree.id = theId++;
                                        thisTree.type = theList[currIndex].value;
                                        currIndex += 2;
                                    }else{
                                        thisTree = new Exp();
                                        thisTree.id = theId++;
                                        thisTree.type = theList[currIndex].value;
                                        currIndex++;
                                    }
                                }else{
                                    thisTree = new Exp();
                                    thisTree.id = theId++;
                                    thisTree.type = theList[currIndex].value;
                                    currIndex++;
                                }
                            }
                            let return2 = tokenListToExp(theList.splice(1, theList.length-1), theId);
                            if(!return2.success){ return return2; }else{ theId = return2.theId; return2 = return2.value; };
                            thisTree.children.push(return1);
                            thisTree.children.push(return2);

                            return {
                                success: true,
                                value: thisTree,
                                theId: theId
                            };
                        }
                    }else{
                        if(theList.length == 1){
                            //in case it is the last value
                            //in this scenario the list contains a number, a string, a bool, or a variable
                            let theElement = theList[0];
                            if(theElement.type == "number"){
                                //in case it is a number
                                thisTree = new Exp();
                                thisTree.id = theId++;
                                thisTree.type = theElement.type;
                                thisTree.value = theElement.value;
                                return {
                                    success: true,
                                    value: thisTree,
                                    theId: theId
                                };
                            }else{
                                //in case it is a word
                                //not finished
                                //we assume it is always a string (we need to check if it is also a variable or a bool)
                                thisTree = new Exp();
                                thisTree.id = theId++;
                                thisTree.type = "string";
                                thisTree.value = theElement.value;
                                return {
                                    success: true,
                                    value: thisTree,
                                    theId: theId
                                };
                            }
                        }else{
                            //in this case it is an expression or a function
                            if(theList[currIndex].type == "word" && theList[currIndex+1].closingId != undefined){
                                if(theList[currIndex+1].closingId+1 == theList.length-1){
                                    //it is only a function
                                    thisTree = new Exp();
                                    thisTree.id = theId++;
                                    thisTree.type = theList[currIndex].value;
                                    currIndex++;
                                    let commasId = theList[currIndex].commas;
                                    commasId.push(theList[currIndex].closingId);
                                    theList.splice(0, 2);
                                    currIndex=0;
                                    let removedTokens = 1;
                                    //we push the closing bracketId so that we know when every input of the function ends (the first ends in the first comma, the second - in the second and the last in the closing bracket)
                                    for(let key in commasId){
                                        let theReturn = tokenListToExp(theList.splice(currIndex, commasId[key]-removedTokens), theId);
                                        if(!theReturn.success){ return theReturn; }else{ theId = theReturn.theId; theReturn = theReturn.value; };
                                        thisTree.children.push(theReturn);
                                        removedTokens += commasId[key]-removedTokens+1;
                                        theList.splice(0, 1);
                                    }
                                    
                                    return {
                                        success: true,
                                        value: thisTree,
                                        theId: theId
                                    }
                                }else{
                                    //it starts with a function that is a part of a expression

                                    let return1 = tokenListToExp(theList.splice(currIndex, theList[currIndex+1].closingId+2), theId);
                                    if(!return1.success){ return return1; }else{ theId = return1.theId; return1 = return1.value; };
                                    
                                    thisTree = new Exp();
                                    thisTree.id = theId++;
                                    thisTree.type = theList[currIndex].value;
                                    currIndex++;

                                    let return2;
                                    if(currIndex+1 == theList.length){
                                        //there is only one element left in the list (it is a word, number or string)
                                        return2 = tokenListToExp(theList.splice(currIndex, 1), theId);
                                        if(!return2.success){ return return2; }else{ theId = return2.theId; return2 = return2.value; };
                                    }else{
                                        //there is something in brackets, expression of a function
                                        return2 = tokenListToExp(theList.splice(currIndex,  theList.length-currIndex), theId);
                                        if(!return2.success){ return return2; }else{ theId = return2.theId; return2 = return2.value; };
                                    }

                                    thisTree.children.push(return1);
                                    thisTree.children.push(return2);

                                    return {
                                        success: true,
                                        value: thisTree,
                                        theId: theId
                                    }
                                }
                            }else{
                                //it is an equasion
                                let return1 = tokenListToExp(theList.splice(currIndex, 1), theId);
                                if(!return1.success){ return return1; }else{ theId = return1.theId; return1 = return1.value; };
                                
                                thisTree = new Exp();
                                thisTree.id = theId++;
                                thisTree.type = theList[currIndex].value;
                                currIndex++;

                                let return2;
                                if(currIndex+1 == theList.length){
                                    //there is only one element left in the list (it is a word, number or string)
                                    return2 = tokenListToExp(theList.splice(currIndex, 1), theId);
                                    if(!return2.success){ return return2; }else{ theId = return2.theId; return2 = return2.value; };
                                }else{
                                    //there is something in brackets, expression of a function
                                    return2 = tokenListToExp(theList.splice(currIndex,  theList.length-currIndex), theId);
                                    if(!return2.success){ return return2; }else{ theId = return2.theId; return2 = return2.value; };
                                }

                                thisTree.children.push(return1);
                                thisTree.children.push(return2);

                                return {
                                    success: true,
                                    value: thisTree,
                                    theId: theId
                                }
                            }
                        }
                    }
                }catch(error){
                    console.error(error);
                    console.trace();
                    return {
                        success: false,
                        value: error
                    };
                }
            }

            let stringHolder = "";
            let isOnlyNumbers = true;
            let isPreviousOperator = false;
            for(let key in charList){
                let char = charList[key];

                //for letters and numbers
                if(char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57){
                    if(isPreviousOperator){
                        addToTokenList(stringHolder, "operator");
                        isPreviousOperator = false;
                        stringHolder = "";
                        isOnlyNumbers = true;
                    }
                    stringHolder += char;
                }
                if(char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90){
                    if(isPreviousOperator){
                        addToTokenList(stringHolder, "operator");
                        isPreviousOperator = false;
                        stringHolder = "";
                        isOnlyNumbers = true;
                    }
                    stringHolder += char;
                    isOnlyNumbers = false;
                }
                if(char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122){
                    if(isPreviousOperator){
                        addToTokenList(stringHolder, "operator");
                        isPreviousOperator = false;
                        stringHolder = "";
                        isOnlyNumbers = true;
                    }
                    stringHolder += char;
                    isOnlyNumbers = false;
                }

                //for brackets and operators
                if((char.charCodeAt(0) >= 33 && char.charCodeAt(0) <= 47) || (char.charCodeAt(0) >= 123 && char.charCodeAt(0) <= 126) || (char.charCodeAt(0) >= 58 && char.charCodeAt(0) <= 64) || (char.charCodeAt(0) >= 91 && char.charCodeAt(0) <= 96)){
                    if(char == "."){
                        if(isOnlyNumbers && stringHolder.length > 0 && !isPreviousOperator){
                            stringHolder += char;
                        }else{
                            if(stringHolder.length > 0){
                                if(isPreviousOperator){
                                    addToTokenList(stringHolder, "operator");
                                }else{
                                    if(isOnlyNumbers) addToTokenList(stringHolder, "number");
                                    if(!isOnlyNumbers) addToTokenList(stringHolder, "word");
                                }
                                isPreviousOperator = false;
                                stringHolder = "";
                                isOnlyNumbers = true;
                            }

                            isPreviousOperator = false;
                            stringHolder += char;
                            isOnlyNumbers = false;
                        }
                    }else if(char == "?"){
                        if(isPreviousOperator){
                            addToTokenList(stringHolder, "operator");
                        }else{
                            if(isOnlyNumbers) addToTokenList(stringHolder, "number");
                            if(!isOnlyNumbers) addToTokenList(stringHolder, "word");
                        }
                        isPreviousOperator = false;
                        stringHolder = "";
                        isOnlyNumbers = true;

                        stringHolder += char;
                        isOnlyNumbers = false;
                    }else if(char == ":"){
                        stringHolder += char;
                        isOnlyNumbers = false;
                    }else{
                        if(stringHolder.length > 0 && isPreviousOperator == false){
                            if(isOnlyNumbers) addToTokenList(stringHolder, "number");
                            if(!isOnlyNumbers) addToTokenList(stringHolder, "word");
                            isPreviousOperator = false;
                            stringHolder = "";
                            isOnlyNumbers = true;
                        }

                        if(char == ")" || char == "(" || char == ","){
                            if(isPreviousOperator){
                                addToTokenList(stringHolder, "operator");
                            }
                            addToTokenList(char, "operator");
                            isPreviousOperator = false;
                            stringHolder = "";
                            isOnlyNumbers = true;
                        }else{
                            stringHolder += char;
                            isPreviousOperator = true;
                        }
                    }
                }
            }
            if(stringHolder.length > 0){
                if(isPreviousOperator){
                    addToTokenList(stringHolder, "operator");
                }else if(isOnlyNumbers){
                    addToTokenList(stringHolder, "number");
                }else{
                    addToTokenList(stringHolder, "word");
                }
            }

            if(numberClosingBracket == numberOpenBracket){
                return tokenListToExp(tokenList, 1);
            }
        }catch(error){
            console.error(error);
        }
    }
    this.equationIntoCondition = equationIntoCondition;

    // equationIntoCondition("((12+13)*(10+(5+3)))");
    // equationIntoCondition("abs(13)");
    // console.log(equationIntoCondition("setPosition(getObject(12),(field(getObject(12),x)+10),(field(getObject(12),x)+10))"));


    function onEventInputChange(value){
        try{

            let condition = equationIntoCondition(value);

            if(condition.success){
                condition = condition.value;

                that.currEvent[editingParameter] = condition;

                loadCondition(that.currEvent);

                displayEquation(returnEquationFromExpression(condition));
            }
        }catch(error){
            console.error(error);
        }
    }
    this.onEventInputChange = onEventInputChange;

    function executeString(theString){
        //all functions in config
        function abs(number){
            try{
                return Math.abs(number);
            }catch(error){
                console.error(error);
            }
        }

        function getObject(childId){
            try{
                return map.currMap.objects[childId];
            }catch(error){
                console.error(error);
            }
        }

        function field(object, parameter){
            try{
                return object[parameter];
            }catch(error){
                console.error(error);
            }
        }

        function setPosition(object, x, z){
            try{
                object.x = x;
                object.z = z;
            }catch(error){
                console.error(error);
            }
        }
        
        //actually executing the condition/action
        try{
            eval(theString);
        }catch(error){
            console.error(error);
        }
    }
    this.executeString = executeString;
});