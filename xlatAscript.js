function xlatAscript(ascript) {
	inActionscript = 0;
    dirty = 0;
    foundDefaultActionID = 0;
    while (ascript.length()) {
//            print $_; # just for debug              
        ascript.replace(/not pending restart/ig,"");
        if (inActionscript 
        		&& ascript.replace(/action may require restart(.*)\<\/ActionScript/,"\<\/ActionScript/") > 0)            
            dirty=1;
        if (ascript.search(/<DefaultAction ID=/))
        	foundDefaultActionID = 1;
        
        if (!foundDefaultActionID 
        		&& ascript.replace(/<\/DefaultAction>/i,"<DefaultAction ID=\"Action1\">\n<\/DefaultAction>") > 0)            
            dirty=1;
        
        if (!foundDefaultActionID && ascript.replace(/<Action ID=\"Action1/,"<DefaultAction ID=\"Action1\">\n<Action ID=\"Action1") > 0)           
            dirty=1;
        
        if (ascript.search(/\<ActionScript/)) inActionscript = 1;
        if (ascript.search(/<\/ActionScript\>/)) inActionscript = 0 ;                                                 
//        printf( ascript );
        
        }
}
function buildFixlet(obJect, idx) {
	var newFxldoc, tA, tR, tS;
//	newFxldoc = loadXML("CorruptPatchInnerTemplate.xml");
//	doc = xmlCPmutliAction.XMLDocument;
		newFxldoc.replace("#Relevance#", obJect.rel);
		newFxldoc.replace("#SuccessCriteria#", obJect.sxs);
//		newFxldoc = loadXML("CorruptPatchInnerTemplate.xml");
//		propagateCommonFields(newFxldoc);
		tA = xlatAscript(tA); 
//		replaceActionscript(tA);

		// Previous code:
		var rel = 'computer id = ' + CompID.innerText;
//		var r = doc.selectSingleNode("BES/MultipleActionGroup/Relevance");
		r.text = rel;
//		var t = doc.selectSingleNode("BES/MultipleActionGroup/Title");
//		t.text = theTitle;

		//////////// Replace Action Parameters (because there isn't direct support for importing action parameters and this is probably the easiest way)//////
		// I know from the XML that I want the second action... but if the xml is changed or rearranged, this will break... need a better system -- Ben
		//var as = doc.selectNodes("BES/MultipleActionGroup/MemberAction/ActionScript");
		// Changed it to a xpath search for every Actionscript element
//		var as = doc.selectNodes("//ActionScript");
		for (var i = 0; i < as.length; i++) {
/*			as[i].text = as[i].text.replace ("#imagelocation#", ImageLocation.innerText);
			as[i].text = as[i].text.replace ("#compname#", CompName.innerText);
			as[i].text = as[i].text.replace ("#newcompname#", NewCompName.innerText);
			as[i].text = as[i].text.replace ("#username#", UserName.innerText);
			as[i].text = as[i].text.replace ("#pw#", Password.innerText);
			as[i].text = as[i].text.replace ("#archivepw#", ArchivePassword.innerText);
			as[i].text = as[i].text.replace ("#workgroup#", Workgroup.innerText);

			as[i].text = as[i].text.replace ("#networktype#", NetworkType.innerText);
			as[i].text = as[i].text.replace ("#staticip#", StaticIP.innerText);
			as[i].text = as[i].text.replace ("#gateway#", Gateway.innerText);
			as[i].text = as[i].text.replace ("#subnetmask#", SubnetMask.innerText);

			as[i].text = as[i].text.replace ("#agentprepare#", AgentPrepare.innerText);
			as[i].text = as[i].text.replace ("#driverspath#", DriversPath.innerText);
*/		}

		//var a = doc.selectSingleNode("BES/SingleAction/ActionScript");
		//a.text = theAction;

//		doc.selectSingleNode("/BES").setAttribute("SkipUI", "true");
		
}