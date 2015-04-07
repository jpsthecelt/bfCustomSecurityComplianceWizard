function init()
{
	bFApplication.initApplication("corruptbaselinewizard.swf","100%", "100%", "9");
}
// NOTES:
//       -) What is the appropriate character to split multiple relevances with?
//       -) Can there be situations where fixlets don't have all the indicated fields?  Will the try/catch intercept these?
//       -) can we combine common processing into a 'doFinish()'-type routine?
//       -) Can/Should our regular expression use "^(d+)....
//       -) Do we appropriately process multiple relevances?  Where do we look for SOH, & create multiple relevance nodes, etc?

function getResources() 
{
	// define list of resource bundles here
	return ["component_library_en_us.xml",
				"corruptbaselinewizard_en_us.xml"];
}


/*************************
 * EXAMPLE OF HOW TO USE JSRequest
 * 
 * SHOULD BE REMOVED WHEN DASHBOARD GETS DEVELOPED!
 *
 *************************
 */
 
function Baselines() {}

Baselines.prototype = new BF.JSRequest();

Baselines.prototype.loadBaselinesCallback = function (results) {
	BF.Utils.callActionScript(this.getASCallback(),results);
}

	
Baselines.prototype.loadBaselines = function() {
	
		var rel = 'names of fixlets whose (type of it = "Baseline") of bes sites';


			
		// This call to BF.Utils.bind is necessary here, because you're passing
		// an object method as a callback.  In JavaScript when an object method is passed
		// as a callback "this" refers to the object that is calling the callback not
		// the object that the callback function belongs to. Bind makes sure the 
		// callback function is called in the context of its owner object 
		// and makes sure that "this" references work as expected.			
		BFEvaluateRelevance(rel, BF.Utils.bind(this, this.loadBaselinesCallback));
}

function EntSecurityFixlets() {}

EntSecurityFixlets.prototype = new BF.JSRequest();

EntSecurityFixlets.prototype.loadEntSecurityFixletsCallback = function (results) {
	BF.Utils.callActionScript(this.getASCallback(),results);
}

	
EntSecurityFixlets.prototype.loadEntSecurityFixlets = function() {
	
		var rel = 'names of fixlets whose (name of it contains "CORRUPT") of bes sites whose (name of it = "Enterprise Security")';
			
		// This call to BF.Utils.bind is necessary here, because you're passing
		// an object method as a callback.  In JavaScript when an object method is passed
		// as a callback "this" refers to the object that is calling the callback not
		// the object that the callback function belongs to. Bind makes sure the 
		// callback function is called in the context of its owner object 
		// and makes sure that "this" references work as expected.			
		BFEvaluateRelevance(rel, BF.Utils.bind(this, this.loadEntSecurityFixletsCallback));
}

function createFixletsFromCopyPaste(copyPasteText)
{
    debugger;
	// I believe the regular expression we are looking for is \d*\t.*\n
	// with parens around the d* so that we can isolate IDs. (I assume IDs are going to be far left)
	// we parse that out, grab all the fixlets, and smooth sailing

    // !! *** what about multiple relevance terms?  Will relevance of fixlet get it or do we need contactenation of relevances of....
	
	var fixletsProcessed = 0;	
	var query;
	var relevances;
	var actions;
	var result;
	var resultsArr = new Array();
	var retn = new Array();
	var reTuples =/(\d+)(\s+)(.*)/;
// or.... var myRegex = /(\d*)\t.*\n/;							
	
	// element 1: Name
	// element 2: Relevance
	// element 3: Action
	// element 4: sourceID
	// element 5: Description
	// element 6: Category
	// element 7: Source
	// element 8: Source Release Date (not all fixlets have this, getting rid of it)
	
	try {
	    var fxls = txt.split("\n");								
	    for(var i = 0; i < fxls.length; i++){
		reTuples.exec(fxls[i]);
		retn[1] = RegExp.$1;
		retn[3] = RegExp.$3;

	//var fieldArray = new Array(selectedFixlets.length);
	//for (i=0; i<selectedFixlets.length; i++){ fieldArray[i] = new Array(7); }
	//var matches = copyPasteText.match(/(\d*)/g); alert(matches);alert(matches[0]);alert(matches[1]);alert(matches[2]);
        //var relevance = new String;

		var query = '(item 0 of it & "|"&item 1 of it& "|"&item 2 of it& "|"&item 3 of it& "|"&item 4 of it& "|"&item 5 of it& "|"&item 6 of it& "|"&item 7 of it) of (id of it as string,name of it,concatenation "%01" of relevances of it,script of action 0 of it,source id of it,message of it,category of it,source of it) of  bes fixlets whose (id of it = '+retn[1]+' and name of site of it = \"Enterprise Security\")';

		try {
		    resultsArr = EvaluateRelevance(query);
		} catch(E) {
		    errorMessage("Problem querying for fixlets with id='" + retn[1] + "': " + E.description);
		    errFlg = true;
		}

// PREVIOUSLY -- If there are multiple actions, we have multiple elements of the array with the same id
//               Note that this assumption is no longer true.
		for(var i = 0; i < resultsArr.length; i++){
			var temp = resultsArr[i].split("|")
			    var obj = {id:temp[0], name:temp[1], rel:temp[2], act:temp[3],
				       sid:temp[4], desc:temp[5], cat:temp[6], src:temp[7]}
			returnArr.push( obj )
		}
//		doFinish(returnArr);
//		return true;
	    }

	var realSourceID;
	
	while (fixletsProcessed<selectedFixlets.length)
	{
		fieldArray[fixletsProcessed][0] = selectedFixlets[fixletsProcessed];
	
		query = "relevances of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";
		
		relevance = EvaluateRelevance(query);
		relevance = relevance.toString();
		relevance = relevance.replace(" AND (not pending restart)", "");

		fieldArray[fixletsProcessed][1] = relevance;
	
		query = "script of action 0 of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";		
		fieldArray[fixletsProcessed][2] = EvaluateRelevance(query);	
		
		query = "ID of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";				
		fieldArray[fixletsProcessed][3] = EvaluateRelevance(query);

	
		query = "message of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";				
		fieldArray[fixletsProcessed][4] = EvaluateRelevance(query);
		
		query = "category of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";				
		fieldArray[fixletsProcessed][5] = EvaluateRelevance(query);
		
		query = "source of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";				
		fieldArray[fixletsProcessed][6] = EvaluateRelevance(query);
		
		// query = "source release date of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";				
		// Source release dates sometimes don't exist

		
		//fieldArray[fixletsProcessed][7] = EvaluateRelevance(query);
		
		fixletsProcessed++;
	}	
	
	doc = XMLToImport.XMLDocument;


	fixletTargets = doc.selectSingleNode("BES");
	
	// element 1: Name
	// element 2: Relevance
	// element 3: Action
	// element 4: sourceID
	// element 5: Description
	// element 6: Category
	// element 7: Source
	// element 8: Source Release Date
		
	for (i=0; i<selectedFixlets.length; i++)
	{
		
		fixletElement = doc.createElement("Fixlet");
		fixletTargets.appendChild(fixletElement);


		fixletTitleNode = doc.createElement("Title");
		fixletTitle = doc.createTextNode(fieldArray[i][0] + " Modified");
		fixletTitleNode.appendChild(fixletTitle);								
		fixletTargets.childNodes[i].appendChild(fixletTitleNode);


		fixletDescriptionNode = doc.createElement("Description");
		fixletDescription = doc.createCDATASection(fieldArray[i][4]);
		fixletDescriptionNode.appendChild(fixletDescription);		
		fixletTargets.childNodes[i].appendChild(fixletDescriptionNode);		
		
		fixletRelevanceNode = doc.createElement("Relevance");
		fixletRelevanceText = doc.createCDATASection(fieldArray[i][1]);
		fixletRelevanceNode.appendChild(fixletRelevanceText);
		fixletTargets.childNodes[i].appendChild(fixletRelevanceNode);	



		fixletCategoryNode = doc.createElement("Category");
		fixletCategoryText = doc.createTextNode(fieldArray[i][5]);
		fixletCategoryNode.appendChild(fixletCategoryText);
		fixletTargets.childNodes[i].appendChild(fixletCategoryNode);	

		fixletSourceNode = doc.createElement("Source");
		fixletSourceText = doc.createTextNode(fieldArray[i][6]);
		fixletSourceNode.appendChild(fixletSourceText);
		fixletTargets.childNodes[i].appendChild(fixletSourceNode);	

		//fixletSourceReleaseDateNode = doc.createElement("SourceReleaseDate");
		//fixletSourceReleaseDateText = doc.createTextNode(fieldArray[i][7]);
		//fixletSourceReleaseDateNode.appendChild(fixletSourceReleaseDateText);
		//fixletTargets.childNodes[i].appendChild(fixletSourceReleaseDateNode);	

		
		fixletDefaultAction = doc.createElement("DefaultAction");
		fixletTargets.childNodes[i].appendChild(fixletDefaultAction);
		
		fixletDefaultActionID = doc.createAttribute("ID");
		fixletDefaultActionID.nodeValue="Action1";
		fixletTargets.childNodes[i].childNodes[5].setAttributeNode(fixletDefaultActionID);
		
		fixletActionScript = doc.createElement("ActionScript");
		fixletActionText = doc.createCDATASection(fieldArray[i][2]);
		fixletActionScript.appendChild(fixletActionText);

		fixletTargets.childNodes[i].childNodes[5].appendChild(fixletActionScript);


		actionMIMEType = doc.createAttribute("MIMEType");
		actionMIMEType.nodeValue="application/x-Fixlet-Windows-Shell";
		
		fixletTargets.childNodes[i].childNodes[5].childNodes[0].setAttributeNode(actionMIMEType);


		fixletSuccessCriteria = doc.createElement("SuccessCriteria");
		fixletTargets.childNodes[i].childNodes[5].appendChild(fixletSuccessCriteria);

	
		fixletSuccessCriteriaOption = doc.createAttribute("Option");
		fixletSuccessCriteriaOption.nodeValue="RunToCompletion";
		fixletTargets.childNodes[i].childNodes[5].childNodes[1].setAttributeNode(fixletSuccessCriteriaOption);			
	}
	} catch(e) {
		window.alert("Error parsing pasted fixlets: " + e.message);
		return  false;
	}
			
	alert("You are a winner");
	alert(doc.xml);
	BF.Logger.debug("DOCXML:" + doc.xml);
	ImportXML(doc.xml);
		
}

function createBaselineFromCopyPaste(copyPasteText)
{
	// Hi!
	var fixletsProcessed = 0;
	var query;
	var relevances;
	var actions;
	var result;
		
	var fieldArray = new Array(baselineComponents);
	var fixletName;
	
	var myRegex = new RegExp("(\d*)\t.*\n");
	
	var arrMatch = null;
	
	while(arrMatch = myRegex.exec(copyPasteText))
	{
		alert(arrMatch[2]);
	}
	
	
	
	for (i=0; i<baselineComponents; i++)
	{
		fieldArray[i] = new Array(4);
	}
	for (i=0; i<baselineComponents; i++)
	{
		query = "name of component whose (ID of it = " + i + ") of component group of fixlet whose (name of it = \"" + selectedBaseline + "\") of bes sites";
		
	
		fixletName = EvaluateRelevance(query);
		
		fieldArray[i][0] = fixletName;

		query = "relevances of fixlet whose (name of it = \"" + fixletName + "\") of bes site whose (name of it = \"Enterprise Security\")";
		
		relevance = EvaluateRelevance(query);
		relevance = relevance.toString();
		relevance = relevance.replace(" AND (not pending restart)", "");

		fieldArray[i][1] = relevance;
	
		query = "script of action 0 of fixlet whose (name of it = \"" + fixletName + "\") of bes site whose (name of it = \"Enterprise Security\")";		

		fieldArray[i][2] = EvaluateRelevance(query);	
				
		query = "ID of fixlet whose (name of it = \"" + fixletName + "\") of bes site whose (name of it = \"Enterprise Security\")";				

		fieldArray[i][3] = EvaluateRelevance(query);
	}


	doc = myCustomBaseline.XMLDocument;
	
	baselineComponent = doc.selectSingleNode("BES/Baseline/BaselineComponentCollection/BaselineComponentGroup");
	
	for (i=0; i<baselineComponents; i++)
	{
		
		// This stuff defines the attributes of the baseline components
		
		baselineElement = doc.createElement("BaselineComponent");
		baselineComponent.appendChild(baselineElement);
		
		baselineName = doc.createAttribute("Name");
		baselineName.nodeValue=fieldArray[i][0];
		baselineComponent.childNodes[i].setAttributeNode(baselineName);
		
		baselineIncludeRelevance = doc.createAttribute("IncludeInRelevance");	
		baselineIncludeRelevance.nodeValue="true";
		baselineComponent.childNodes[i].setAttributeNode(baselineIncludeRelevance);

		baselineSourceSiteURL = doc.createAttribute("SourceSiteURL");
		baselineSourceSiteURL.nodeValue="http://sync.bigfix.com/cgi-bin/bfgather/bessecurity";
		baselineComponent.childNodes[i].setAttributeNode(baselineSourceSiteURL);
		
		baselineSourceID = doc.createAttribute("SourceID");
		baselineSourceID.nodeValue=fieldArray[i][3];
		baselineComponent.childNodes[i].setAttributeNode(baselineSourceID);
		
				
		baselineActionName = doc.createAttribute("ActionName");
		baselineActionName.nodeValue="Action1";
		baselineComponent.childNodes[i].setAttributeNode(baselineActionName);
		
		// We now need to add it relevance, action script, and success criteria
		
		// baselineComponent.childNodes[i] = baselinecomponent of whatever fixlet we're on
		// baselineComponent.childNodes[i].childNodes[0] = actionscript
		// baselineComponent.childNodes[i].childNodes[1] = successcriteria
		// baselineComponent.childNodes[i].childNodes[2] = relevance
		

		// ActionScript Attributes
		
		baselineAction = doc.createElement("ActionScript");
		baselineActionText = doc.createCDATASection(fieldArray[i][2]);
		baselineAction.appendChild(baselineActionText);

		
		
		baselineComponent.childNodes[i].appendChild(baselineAction);

		actionMIMEType = doc.createAttribute("MIMEType");
		actionMIMEType.nodeValue="application/x-Fixlet-Windows-Shell";
		
		baselineComponent.childNodes[i].childNodes[0].setAttributeNode(actionMIMEType);
		
		// Success Criteria Element Node
		
		baselineSuccess = doc.createElement("SuccessCriteria");
		baselineComponent.childNodes[i].appendChild(baselineSuccess);
		
		successCriteria = doc.createAttribute("Option");
		successCriteria.nodeValue = "OriginalRelevance";
		
		baselineComponent.childNodes[i].childNodes[1].setAttributeNode(successCriteria);
		
		// Relevance Element node
		
		baselineRelevance = doc.createElement("Relevance");
		
		relevanceText = doc.createCDATASection(fieldArray[i][1]);
		
		baselineRelevance.appendChild(relevanceText);	
		baselineComponent.childNodes[i].appendChild(baselineRelevance);
	
		
	}
	//BF.Logger.debug("BASELINECOMPONENTXML:" + baselineComponent.xml);
	
	//BFEvaluateRelevance()
	
	BF.Logger.debug("DOCXML:" + doc.xml);
	ImportXML(doc.xml);
			
	
	
}


function createFixletsFromFixlets(selectedFixlets)
{
	// some stuffs
	var fixletsProcessed = 0;	
	var query;
	var relevances;
	var actions;
	var result;
	
	// element 1: Name
	// element 2: Relevance
	// element 3: Action
	// element 4: sourceID
	// element 5: Description
	// element 6: Category
	// element 7: Source
	// element 8: Source Release Date (not all fixlets have this, getting rid of it)
	
	var fieldArray = new Array(selectedFixlets.length);
	
	for (i=0; i<selectedFixlets.length; i++)
	{
		fieldArray[i] = new Array(7);
	}

	
	var relevance = new String;
	var realSourceID;
	
	while (fixletsProcessed<selectedFixlets.length)
	{
		fieldArray[fixletsProcessed][0] = selectedFixlets[fixletsProcessed];
	
		query = "relevances of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";
		
		relevance = EvaluateRelevance(query);
		relevance = relevance.toString();
		relevance = relevance.replace(" AND (not pending restart)", "");

		fieldArray[fixletsProcessed][1] = relevance;
	
		query = "script of action 0 of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";		
		fieldArray[fixletsProcessed][2] = EvaluateRelevance(query);	
		
		query = "ID of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";				
		fieldArray[fixletsProcessed][3] = EvaluateRelevance(query);

	
		query = "message of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";				
		fieldArray[fixletsProcessed][4] = EvaluateRelevance(query);
		
		query = "category of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";				
		fieldArray[fixletsProcessed][5] = EvaluateRelevance(query);
		
		query = "source of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";				
		fieldArray[fixletsProcessed][6] = EvaluateRelevance(query);
		
		// query = "source release date of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";				
		// Source release dates sometimes don't exist

		
		//fieldArray[fixletsProcessed][7] = EvaluateRelevance(query);
		
		fixletsProcessed++;
		
	}	
	

	
	
	doc = XMLToImport.XMLDocument;


	fixletTargets = doc.selectSingleNode("BES");
	
	// element 1: Name
	// element 2: Relevance
	// element 3: Action
	// element 4: sourceID
	// element 5: Description
	// element 6: Category
	// element 7: Source
	// element 8: Source Release Date
		
	for (i=0; i<selectedFixlets.length; i++)
	{
		
		fixletElement = doc.createElement("Fixlet");
		fixletTargets.appendChild(fixletElement);


		fixletTitleNode = doc.createElement("Title");
		fixletTitle = doc.createTextNode(fieldArray[i][0] + " Modified");
		fixletTitleNode.appendChild(fixletTitle);								
		fixletTargets.childNodes[i].appendChild(fixletTitleNode);


		fixletDescriptionNode = doc.createElement("Description");
		fixletDescription = doc.createCDATASection(fieldArray[i][4]);
		fixletDescriptionNode.appendChild(fixletDescription);		
		fixletTargets.childNodes[i].appendChild(fixletDescriptionNode);		
		
		fixletRelevanceNode = doc.createElement("Relevance");
		fixletRelevanceText = doc.createCDATASection(fieldArray[i][1]);
		fixletRelevanceNode.appendChild(fixletRelevanceText);
		fixletTargets.childNodes[i].appendChild(fixletRelevanceNode);	



		fixletCategoryNode = doc.createElement("Category");
		fixletCategoryText = doc.createTextNode(fieldArray[i][5]);
		fixletCategoryNode.appendChild(fixletCategoryText);
		fixletTargets.childNodes[i].appendChild(fixletCategoryNode);	

		fixletSourceNode = doc.createElement("Source");
		fixletSourceText = doc.createTextNode(fieldArray[i][6]);
		fixletSourceNode.appendChild(fixletSourceText);
		fixletTargets.childNodes[i].appendChild(fixletSourceNode);	

		//fixletSourceReleaseDateNode = doc.createElement("SourceReleaseDate");
		//fixletSourceReleaseDateText = doc.createTextNode(fieldArray[i][7]);
		//fixletSourceReleaseDateNode.appendChild(fixletSourceReleaseDateText);
		//fixletTargets.childNodes[i].appendChild(fixletSourceReleaseDateNode);	
		

		
		fixletDefaultAction = doc.createElement("DefaultAction");
		fixletTargets.childNodes[i].appendChild(fixletDefaultAction);
		
		fixletDefaultActionID = doc.createAttribute("ID");
		fixletDefaultActionID.nodeValue="Action1";
		fixletTargets.childNodes[i].childNodes[5].setAttributeNode(fixletDefaultActionID);
		
		fixletActionScript = doc.createElement("ActionScript");
		fixletActionText = doc.createCDATASection(fieldArray[i][2]);
		fixletActionScript.appendChild(fixletActionText);

	

	
		fixletTargets.childNodes[i].childNodes[5].appendChild(fixletActionScript);


		actionMIMEType = doc.createAttribute("MIMEType");
		actionMIMEType.nodeValue="application/x-Fixlet-Windows-Shell";
		
		fixletTargets.childNodes[i].childNodes[5].childNodes[0].setAttributeNode(actionMIMEType);


		fixletSuccessCriteria = doc.createElement("SuccessCriteria");
		fixletTargets.childNodes[i].childNodes[5].appendChild(fixletSuccessCriteria);

	
		fixletSuccessCriteriaOption = doc.createAttribute("Option");
		fixletSuccessCriteriaOption.nodeValue="RunToCompletion";
		fixletTargets.childNodes[i].childNodes[5].childNodes[1].setAttributeNode(fixletSuccessCriteriaOption);			
	}
			
	alert("You are a winner");
	alert(doc.xml);
	BF.Logger.debug("DOCXML:" + doc.xml);
	ImportXML(doc.xml);
	
}


function createBaselineFromFixlets(selectedFixlets)
{
	
	var fixletsProcessed = 0;
	var query;
	var relevances;
	var actions;
	var result;

	var componentarray = new Array(selectedFixlets.length);
	
	// element 1: Name
	// element 2: Relevance
	// element 3: Action
	// element 4: sourceID
	
	var fieldArray = new Array(selectedFixlets.length);
	
	for (i=0; i<selectedFixlets.length; i++)
	{
		fieldArray[i] = new Array(4);
	}
	
	var relevance = new String;
	var realSourceID;
	
	while (fixletsProcessed<selectedFixlets.length)
	{

		fieldArray[fixletsProcessed][0] = selectedFixlets[fixletsProcessed];
		
		query = "relevances of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";
		
		relevance = EvaluateRelevance(query);
		relevance = relevance.toString();
		relevance = relevance.replace(" AND (not pending restart)", "");

		fieldArray[fixletsProcessed][1] = relevance;
		
		
		
		query = "script of action 0 of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";		

		fieldArray[fixletsProcessed][2] = EvaluateRelevance(query);	
		
		
		
		query = "ID of fixlet whose (name of it = \"" + selectedFixlets[fixletsProcessed] + "\") of bes site whose (name of it = \"Enterprise Security\")";				

		fieldArray[fixletsProcessed][3] = EvaluateRelevance(query);

		fixletsProcessed++;
	}

	// Now you have everything you need to create a baseline

	doc = myCustomBaseline.XMLDocument;
	baselineComponent = doc.selectSingleNode("BES/Baseline/BaselineComponentCollection/BaselineComponentGroup");
	
	for (i=0; i<selectedFixlets.length; i++)
	{
	
		// This stuff defines the attributes of the baseline components
		
		baselineElement = doc.createElement("BaselineComponent");
		baselineComponent.appendChild(baselineElement);
		
		baselineName = doc.createAttribute("Name");
		baselineName.nodeValue=fieldArray[i][0];
		baselineComponent.childNodes[i].setAttributeNode(baselineName);
		
		baselineIncludeRelevance = doc.createAttribute("IncludeInRelevance");	
		baselineIncludeRelevance.nodeValue="true";
		baselineComponent.childNodes[i].setAttributeNode(baselineIncludeRelevance);

		baselineSourceSiteURL = doc.createAttribute("SourceSiteURL");
		baselineSourceSiteURL.nodeValue="http://sync.bigfix.com/cgi-bin/bfgather/bessecurity";
		baselineComponent.childNodes[i].setAttributeNode(baselineSourceSiteURL);
		
		baselineSourceID = doc.createAttribute("SourceID");
		baselineSourceID.nodeValue=fieldArray[i][3];
		baselineComponent.childNodes[i].setAttributeNode(baselineSourceID);
		
				
		baselineActionName = doc.createAttribute("ActionName");
		baselineActionName.nodeValue="Action1";
		baselineComponent.childNodes[i].setAttributeNode(baselineActionName);
		
		// We now need to add it relevance, action script, and success criteria
		
		// baselineComponent.childNodes[i] = baselinecomponent of whatever fixlet we're on
		// baselineComponent.childNodes[i].childNodes[0] = actionscript
		// baselineComponent.childNodes[i].childNodes[1] = successcriteria
		// baselineComponent.childNodes[i].childNodes[2] = relevance
		

		// ActionScript Attributes
		
		baselineAction = doc.createElement("ActionScript");
		baselineActionText = doc.createCDATASection(fieldArray[i][2]);
		baselineAction.appendChild(baselineActionText);

		
		
		baselineComponent.childNodes[i].appendChild(baselineAction);

		actionMIMEType = doc.createAttribute("MIMEType");
		actionMIMEType.nodeValue="application/x-Fixlet-Windows-Shell";
		
		baselineComponent.childNodes[i].childNodes[0].setAttributeNode(actionMIMEType);
		
		// Success Criteria Element Node
		
		baselineSuccess = doc.createElement("SuccessCriteria");
		baselineComponent.childNodes[i].appendChild(baselineSuccess);
		
		successCriteria = doc.createAttribute("Option");
		successCriteria.nodeValue = "OriginalRelevance";
		
		baselineComponent.childNodes[i].childNodes[1].setAttributeNode(successCriteria);
		
		// Relevance Element node
		
		baselineRelevance = doc.createElement("Relevance");
		
		relevanceText = doc.createCDATASection(fieldArray[i][1]);
		
		baselineRelevance.appendChild(relevanceText);	
		baselineComponent.childNodes[i].appendChild(baselineRelevance);
	
		
	}
	//BF.Logger.debug("BASELINECOMPONENTXML:" + baselineComponent.xml);
	
	//BFEvaluateRelevance()
	
	BF.Logger.debug("DOCXML:" + doc.xml);
	ImportXML(doc.xml);
	
}


function createBaselineFromExistingBaseline(selectedBaseline, outputSelection)
{


	var query;
	var relevances;
	var actions;
	var result;
	var baselineComponents;
	
	query = "number of components of component groups of fixlet whose (name of it = \"" + selectedBaseline + "\") of bes sites";

	
	baselineComponents = EvaluateRelevance(query);
	
	// element 1: Name
	// element 2: Relevance
	// element 3: Action
	// element 4: sourceID
	
	var fieldArray = new Array(baselineComponents);
	var fixletName;
	
	for (i=0; i<baselineComponents; i++)
	{
		fieldArray[i] = new Array(4);
	}
	for (i=0; i<baselineComponents; i++)
	{
		query = "name of component whose (ID of it = " + i + ") of component group of fixlet whose (name of it = \"" + selectedBaseline + "\") of bes sites";
		
	
		fixletName = EvaluateRelevance(query);
		
		fieldArray[i][0] = fixletName;

		query = "relevances of fixlet whose (name of it = \"" + fixletName + "\") of bes site whose (name of it = \"Enterprise Security\")";
		
		relevance = EvaluateRelevance(query);
		relevance = relevance.toString();
		relevance = relevance.replace(" AND (not pending restart)", "");

		fieldArray[i][1] = relevance;
	
		query = "script of action 0 of fixlet whose (name of it = \"" + fixletName + "\") of bes site whose (name of it = \"Enterprise Security\")";		

		fieldArray[i][2] = EvaluateRelevance(query);	
				
		query = "ID of fixlet whose (name of it = \"" + fixletName + "\") of bes site whose (name of it = \"Enterprise Security\")";				

		fieldArray[i][3] = EvaluateRelevance(query);
	}


	doc = myCustomBaseline.XMLDocument;
	
	baselineComponent = doc.selectSingleNode("BES/Baseline/BaselineComponentCollection/BaselineComponentGroup");
	
	for (i=0; i<baselineComponents; i++)
	{
		
		// This stuff defines the attributes of the baseline components
		
		baselineElement = doc.createElement("BaselineComponent");
		baselineComponent.appendChild(baselineElement);
		
		baselineName = doc.createAttribute("Name");
		baselineName.nodeValue=fieldArray[i][0];
		baselineComponent.childNodes[i].setAttributeNode(baselineName);
		
		baselineIncludeRelevance = doc.createAttribute("IncludeInRelevance");	
		baselineIncludeRelevance.nodeValue="true";
		baselineComponent.childNodes[i].setAttributeNode(baselineIncludeRelevance);

		baselineSourceSiteURL = doc.createAttribute("SourceSiteURL");
		baselineSourceSiteURL.nodeValue="http://sync.bigfix.com/cgi-bin/bfgather/bessecurity";
		baselineComponent.childNodes[i].setAttributeNode(baselineSourceSiteURL);
		
		baselineSourceID = doc.createAttribute("SourceID");
		baselineSourceID.nodeValue=fieldArray[i][3];
		baselineComponent.childNodes[i].setAttributeNode(baselineSourceID);
		
				
		baselineActionName = doc.createAttribute("ActionName");
		baselineActionName.nodeValue="Action1";
		baselineComponent.childNodes[i].setAttributeNode(baselineActionName);
		
		// We now need to add it relevance, action script, and success criteria
		
		// baselineComponent.childNodes[i] = baselinecomponent of whatever fixlet we're on
		// baselineComponent.childNodes[i].childNodes[0] = actionscript
		// baselineComponent.childNodes[i].childNodes[1] = successcriteria
		// baselineComponent.childNodes[i].childNodes[2] = relevance
		

		// ActionScript Attributes
		
		baselineAction = doc.createElement("ActionScript");
		baselineActionText = doc.createCDATASection(fieldArray[i][2]);
		baselineAction.appendChild(baselineActionText);

		
		
		baselineComponent.childNodes[i].appendChild(baselineAction);

		actionMIMEType = doc.createAttribute("MIMEType");
		actionMIMEType.nodeValue="application/x-Fixlet-Windows-Shell";
		
		baselineComponent.childNodes[i].childNodes[0].setAttributeNode(actionMIMEType);
		
		// Success Criteria Element Node
		
		baselineSuccess = doc.createElement("SuccessCriteria");
		baselineComponent.childNodes[i].appendChild(baselineSuccess);
		
		successCriteria = doc.createAttribute("Option");
		successCriteria.nodeValue = "OriginalRelevance";
		
		baselineComponent.childNodes[i].childNodes[1].setAttributeNode(successCriteria);
		
		// Relevance Element node
		
		baselineRelevance = doc.createElement("Relevance");
		
		relevanceText = doc.createCDATASection(fieldArray[i][1]);
		
		baselineRelevance.appendChild(relevanceText);	
		baselineComponent.childNodes[i].appendChild(baselineRelevance);
	
		
	}
	//BF.Logger.debug("BASELINECOMPONENTXML:" + baselineComponent.xml);
	
	//BFEvaluateRelevance()
	
	BF.Logger.debug("DOCXML:" + doc.xml);
	ImportXML(doc.xml);
			
}

//----

 
function SampleJSRequest() {}

SampleJSRequest.prototype = new BF.JSRequest();

SampleJSRequest.prototype.loadCPMFixletsCallback = function(results) {
		BF.Utils.callActionScript(this.getASCallback(),results);
	}

SampleJSRequest.prototype.loadCPMFixlets = function() {
		var rel = 'names of fixlets of  bes sites whose ' + 
			'(name of it = "Trend Core Protection Module QA") ';
			
		// This call to BF.Utils.bind is necessary here, because you're passing
		// an object method as a callback.  In JavaScript when an object method is passed
		// as a callback "this" refers to the object that is calling the callback not
		// the object that the callback function belongs to. Bind makes sure the 
		// callback function is called in the context of its owner object 
		// and makes sure that "this" references work as expected.			
		BFEvaluateRelevance(rel, BF.Utils.bind(this, this.loadCPMFixletsCallback));
	}
	
/*************************
 * ALTERNATE EXAMPLE OF HOW TO USE JSRequest
 * Using more class-based approach.
 * 
 * SHOULD BE REMOVED WHEN DASHBOARD GETS DEVELOPED!
 *
 *************************
 */	
// make sure this JS object inherits from JSRequest
SampleJSRequest2.prototype = new BF.JSRequest(); 
 
function SampleJSRequest2() {

	this.loadCPMFixlets = function() {
		var rel = 'names of fixlets of  bes sites whose ' + 
			'(name of it = "Trend Core Protection Module QA") ';
		
		// need to use bind method for same reasons as mentioned above		
		BFEvaluateRelevance(rel, BF.Utils.bind(this, this.loadCPMFixletsCallback));
	}
	
	this.loadCPMFixletsCallback = function(results) {
		BF.Utils.callActionScript(this.getASCallback(),results);
	}
}

		