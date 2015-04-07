// global variable
var size;

function SetControlsFromStore() {
	app.value = appName.innerText;
	
	if (urlRadio.innerText == "1") {
		src.value = urlText.innerText;
	}
	else if (fileRadio.innerText == "1") {
		src.value = fileText.innerText;
	}
	else if (folderRadio.innerText == "1") {
		src.value = folderText.innerText;
	}
	else {
	}
	var targetPlatforms = "";
	if (pltWin95.innerText == "1") {
		targetPlatforms += "Win95";
	}
	if (pltWin98.innerText == "1") {
		if (targetPlatforms.length != 0) {
			targetPlatforms += ", ";
		}
		targetPlatforms += "Win98";
	}
	if (pltWinME.innerText == "1") {
		if (targetPlatforms.length != 0) {
			targetPlatforms += ", ";
		}
		targetPlatforms += "WinME";
	}
	if (pltWinNT.innerText == "1") {
		if (targetPlatforms.length != 0) {
			targetPlatforms += ", ";
		}
		targetPlatforms += "WinNT";
	}
	if (pltWin2K.innerText == "1") {
		if (targetPlatforms.length != 0) {
			targetPlatforms += ", ";
		}
		targetPlatforms += "Win2000";
	}
	if (pltWinXP.innerText == "1") {
		if (targetPlatforms.length != 0) {
			targetPlatforms += ", ";
		}
		targetPlatforms += "WinXP";
	}
	if (pltWin2K3.innerText == "1") {
		if (targetPlatforms.length != 0) {
			targetPlatforms += ", ";
		}
		targetPlatforms += "Win2003";
	}
	if (pltWinVista.innerText == "1") {
		if (targetPlatforms.length != 0) {
			targetPlatforms += ", ";
		}
		targetPlatforms += "WinVista";
	}
	if (pltWin2K8.innerText == "1") {
		if (targetPlatforms.length != 0) {
			targetPlatforms += ", ";
		}
		targetPlatforms += "Win2008";
	}
	var lastComma = targetPlatforms.lastIndexOf(",");
	if (lastComma != -1) {
		targetPlatforms = targetPlatforms.slice(0, lastComma) + lStrings.VarAnd + targetPlatforms.slice(lastComma+1);
	}
	plt.value = targetPlatforms;	
	
	if (noCheckRadio.innerText == "1") {
		install.value =lStrings.WizInstallNoDetection;
	}
	else if (regAppRadio.innerText == "1") {
		install.value = lStrings.WizInstallRegisteredApplication;
		install2.value = regAppText.innerText;
	}
	else if (servAppRadio.innerText == "1") {
		install.value = lStrings.WizInstallSvc;
		install2.value = servAppText.innerText;
	}
	else if (appFileRadio.innerText == "1") {
		install.value = lStrings.WizInstallFile;
		install2.value = appFileText.innerText;
	}
	else if (regKeyRadio.innerText == "1") {
		if (regValueCheck.innerText == "1") {
			install.value = regKeyText.innerText;
			install2.value = regValueResult.innerText;
		}
		else {
			install.value = lStrings.WizInstallRegKey;
			install2.value = regKeyText.innerText;
		}
	}
	else {
	}
	cmdline.value = cmdLine.innerText;
}

function SetNext() {
	ButtonOK.focus();
}

function DoBack() {
  window.navigate("linkpage:DeploymentCmdLine");
}



function CreateAction()
{  
  var myAction = "";
  
  //var size; -> use the global one
  var sha1;
  var url;
  var source = "";  
  var fullfilename = "";
  
  if(urlRadio.innerText == "1" || fileRadio.innerText == "1"){
    var lastSlash = -1;
    
    // verify url or filePath
    if(urlRadio.innerText == "1" ){
      source  = urlText.innerText;
      lastSlash = source.lastIndexOf("/");
      if (lastSlash == -1) {
        alert(lStrings.WizUnexpectURL + source);
        return "";
      }     
    }
    else if (fileRadio.innerText == "1" ){
      source  = fileText.innerText;
      lastSlash = source.lastIndexOf("/");
      var lastWack = source.lastIndexOf("\\");
      if (lastWack > lastSlash) {
        lastSlash = lastWack;
      }
      if (lastSlash == -1) {
        alert(lStrings.WizUnexpectedFilename + source);
        return "";
      }
    }
    
    fullfilename = source.slice(lastSlash+1);
    
    if(urlRadio.innerText == "1"){
      var rootScratchPath = GetScratchRootPath();        
      var outputPath = rootScratchPath + "\\" + fullfilename;
      
      var dlResult = DownloadFile(source, fullfilename); // currentPath        
      if(dlResult != "Success"){
        alert(lStrings.WizFileDownloadProblem + source);
        return ""; // failed to download file
      }        
      size = GetFileSize(outputPath );
      if(size == -1){
        alert(lStrings.WizProblemCalcSize + fullfilename);
        return "";
      }
      sha1 = GetFileSHA1(outputPath );
      if(sha1.indexOf("Error") != -1){
        alert(lStrings.WizProblemCalSha1 + fullfilename);
        return "";
      }
      url = source;
    }
    else{// fileRadio.innerText == "1"
		
		fullfilename = getFileFolderName(source);
		
		var fsAccessResult;
		var tempFolder = fullfilename;
		tempFolder = tempFolder.replace(/\.+/g, ""); // take out period in filename
		  var scratchFile = tempFolder + "\\" +fullfilename;
		  
		  
		var scratchRootPath = GetScratchRootPath();
		var archFileName = tempFolder+".tmp";		
		var archFilePath = scratchRootPath + "\\" + archFileName;
	  
		MakeFolder(tempFolder);
		CopyFile(source, scratchFile, true);
		
		fsAccessResult = MakeArchive(scratchRootPath + "\\" + tempFolder, archFileName, false);
		if(fsAccessResult.indexOf("Error") != -1){
		  alert("Problem occured when making archive file:" + archFilePath);
		  return "";
		}	
		
		
      url = UploadFile(archFilePath);
      if(url.indexOf("Error") != -1){
        alert(lStrings.WizProbUploadingFile + fileText.innerText);
        return "";
      }
      size = GetFileSize(archFilePath);
      if(size == -1){
        alert(lStrings.WizProblemCalcSize + fileText.innerText);
        return "";
      }
      sha1 = GetFileSHA1(archFilePath);      
      if(sha1.indexOf("Error") != -1){
        alert(lStrings.WizProblemCalSha1 + fileText.innerText);
        return "";
      }
      
      fullfilename = url.substr(url.lastIndexOf("/") + 1);
    }
  }
  else if(folderRadio.innerText == "1"){           
    source = folderText.innerText;    
    lastSlash = source.lastIndexOf("/");
    
    var lastWack = source.lastIndexOf("\\");
    if (lastWack > lastSlash) {
      lastSlash = lastWack;
    }
    if (lastSlash == "-1") {
      alert(lStrings.WizUnexpectedFolderName + source);
      return "";
    }
    
     // begin creating relevance and action
    var fsAccessResult;
    var tempFolder = getFileFolderName(source);    
    tempFolder = tempFolder.replace(/\s+/g, ""); // take out space in the folderName    
           
    var scratchRootPath = GetScratchRootPath();
    var archFileName = tempFolder+".tmp";		
    var archFilePath = scratchRootPath + "\\" + archFileName;
    
    fsAccessResult = MakeArchive( folderText.innerText, archFileName, includeSubFolders.innerText == "1");
    if(fsAccessResult.indexOf("Error") != -1){
      alert(lStrings.WizProblemArchive + archFilePath);
      return "";
    }
        
    url = UploadFile(archFilePath);
    if(url.indexOf("Error") != -1){
      alert(lStrings.WizProblemUploadngArchive + archFilePath);
      return "";
    }
    size = GetFileSize( archFilePath );
    if(size == -1){
      alert(lStrings.WizProblemCalSizeArch + archFilePath);
      return "";
    }
    sha1 = GetFileSHA1( archFilePath );
    if(sha1.indexOf("Error") != -1){
      alert(lStrings.WizProblemCalcSha1Arch + archFilePath);
      return "";
    }

		lastSlash = url.lastIndexOf("/");
		fullfilename = url.slice(lastSlash+1);
  }
  
  myAction = 'download '+ url +'\n';
  var relFileName = fullfilename.replace(/%/g,"%25");
  myAction += 'continue if {(size of it = '+ size +' AND sha1 of it = "'+ sha1 +'") of file "'+ relFileName +'" of folder "__Download"}' + '\n\n';
	if(folderRadio.innerText == "1"){
		myAction += 'extract '+ fullfilename +'\n\n';
	} else if (fileRadio.innerText == "1"){
		myAction += 'extract '+ fullfilename + '\n';
	}
  //action
	//var msiIndex = cmdLine.innerText.indexOf("msiexec");
	//different actions for msi files
	if (cmdLine.innerText.match(/\.msi/i)) {
		theRelevance.innerText += " AND " + "(exists file " + '"' + "msiexec.exe" + '"' + " of system folder)";
		// This code assumes a very narrow cmd structure. We know that we need msiexec, /i and a package name, in that order, so let's just check for those instead 
//		var msiOption = cmdLine.innerText.indexOf('/');
//		if (msiOption == -1) {
//			window.alert(lStrings.WizNotValidCmd);
//			return "";
//		}
//		var msiTemp = cmdLine.innerText.slice(msiOption);
//		var msiStartFile = msiTemp.indexOf(" ");
//		if (msiStartFile == -1) {
//			window.alert(lStrings.WizSpaceRqd);
//			return "";
//		}
//		msiStartFile += msiOption + 1;
//		//var msiEndFile = cmdLine.innerText.indexOf(".msi");
//		var msiEndFile = cmdLine.innerText.search(/\.msi/i);
//		if (msiEndFile == -1) {
//			window.alert(lStrings.WizNotValidInstallerFile);
//			return "";
//		}
//		msiEndFile = msiEndFile + 4;
//		if(cmdLine.innerText.slice(msiEndFile).search(/^\"/) != -1) {
//			msiEndFile++;
//		}
//    
//		myAction += "wait " + '"' + "{pathname of system folder & " + '"' + "\\msiexec" + '"' + "}" + '"' + cmdLine.innerText.slice(7, msiStartFile);
//		myAction += '"' + "{(pathname of client folder of current site) & " + '"' + "\\__Download\\" + cmdLine.innerText.slice(msiStartFile, msiEndFile).replace(/%/g,"%25") + '"' + "}" + '"' + cmdLine.innerText.slice(msiEndFile) + "\n";
		// first make sure that there's an msi file in the command
		if(cmdLine.innerText.search(/\.msi/i) == -1) {
			window.alert(lStrings.WizNotValidInstallerFile);
			return "";
		}
		// now check for msiexec with a space after it followed by a package with /i and capture the msi name
		var msiNameOld, msiNameNew;
		if(cmdLine.innerText.search(/msiexec(\.exe)? .*\/i +\"([^\"]+?\.msi)\".*/i) == -1) {
			if(cmdLine.innerText.search(/msiexec(\.exe)? .*\/i +([^ ]+\.msi).*/i) == -1) {
				window.alert(lStrings.WizNotValidCmd);
				return "";
			} else {
				msiNameOld = cmdLine.innerText.replace(/.* ([^ ]+\.msi).*/i, "$1");
			}
		} else {
	   		msiNameOld = cmdLine.innerText.replace(/.*(\"[^\"]+?\.msi\").*/i, "$1");
		}
		msiNameNew = msiNameOld.replace(/%/g, "%25").replace(/\"/g,"");
		// we're satisfied, so make some changes and stick it in the action
		myAction += "wait " + cmdLine.innerText.replace(/msiexec(\.exe)?/i, "\"{pathname of system folder & \"\\msiexec.exe\"}\"").replace(msiNameOld, "\"{(pathname of client folder of current site) & \"\\__Download\\" + msiNameNew + "\"}\"") + "\n"; 
	}
	else if (cmdLine.innerText.match(/\.bat/i)) {
		// As with msi files, the assumptions about command structure are too restrictive here. We know that we need cmd(.exe)? followed by /(c|k) and a batch file, so just search for that
//		var batOption = cmdLine.innerText.search(/\/c/i);
//		if (batOption == -1) {
//			batOption = cmdLine.innerText.search(/\/k/i);
//		}
//		if (batOption == -1) {
//			window.alert(lStrings.WizNotValidExeCmd);
//			return "";
//		}
//		
//		var batTemp = cmdLine.innerText.slice(batOption);
//		var batStart = batTemp.indexOf(" ");
//		if (batStart == -1) {
//			window.alert(lStrings.WizNotValidCmdDeployBatch);
//			return "";
//		}
//		batStart += batOption + 1;
//		var batEnd = cmdLine.innerText.search(/\.bat/i);
//		if (batEnd == -1) {
//			window.alert(lStrings.WizNotValidBatch);
//			return "";
//		}
//		batEnd = batEnd + 4;
//    
//		myAction += "wait " + '"' + "{pathname of system folder & " + '"' + "\\cmd.exe" + '"' + "}" + '"' + cmdLine.innerText.slice(7, batStart);
//		myAction += '"' + "{(pathname of client folder of current site) & " + '"' + "\\__Download\\" + cmdLine.innerText.slice(batStart, batEnd) + '"' + "}" + '"' + cmdLine.innerText.slice(batEnd) + "\n";
		// first check for a few out of order requirements so we can issue a specific error if appropriate
		if(cmdLine.innerText.search(/\/(c|k)?/i) == -1) {
			window.alert(lStrings.WizNotValidExeCmd);
			return "";
		}
		if(cmdLine.innerText.search(/\.bat/i) == -1) {
			window.alert(lStrings.WizNotValidBatch);
			return "";
		}
		// now check for valid command order and capture the batch file name
		var batNameOld, batNameNew;
		if(cmdLine.innerText.search(/cmd(\.exe)? .*\/(c|k) .*\"([^\"]+?\.bat)\".*/i) == -1) {
			if(cmdLine.innerText.search(/cmd(\.exe)? .*\/(c|k) .*([^ ]+\.bat).*/i) == -1) {
				window.alert(lStrings.WizNotValidCmdDeployBatch);
				return "";
			} else {
				batNameOld = cmdLine.innerText.replace(/.* ([^ ]+\.bat).*/i, "$1");
			}
		} else {
	   		batNameOld = cmdLine.innerText.replace(/.*(\"[^\"]+?\.bat\").*/i, "$1");
		}
		batNameNew = batNameOld.replace(/%/g, "%25").replace(/\"/g,"");
		// we're satisfied, so make some changes and stick it in the action
		myAction += "wait " + cmdLine.innerText.replace(/cmd(\.exe)?/i, "\"{pathname of system folder & \"\\cmd.exe\"}\"").replace(batNameOld, "\"{(pathname of client folder of current site) & \"\\__Download\\" + batNameNew + "\"}\"") + "\n"; 
	}
	else {	
		var startquote = cmdLine.innerText.indexOf('"');
		if (startquote == 0) {
			var cmdTemp = cmdLine.innerText.slice(startquote+1);
			//window.alert("startquote is " + startquote);
			var endquote = cmdTemp.indexOf('"');
			//window.alert("endquote is " + endquote);
			if (endquote == -1) {
				window.alert(lStrings.WizUnmatchedQuote);
				return "";
			}
			else {
				myAction += "wait " + '"' + "__Download\\" + cmdLine.innerText.slice(startquote+1) + "\n";
			}
		}
		else {
			myAction += "wait __Download\\" + cmdLine.innerText + "\n";
		}
	}
 
  return myAction;
}

function CreateDescription()
{
  var dscrp = "";
  
	dscrp = lStrings.WizTaskDeploy + appName.innerText + lStrings.VarSymbolPeriod + "<BR><BR>"
	dscrp += lStrings.WizTaskApplicable + platformNames.innerText + lStrings.VarSymbolPeriod + "\n\n";
	
  return dscrp;
}

function CreateRelevance()
{
  // create relevance for new installation
	var installedRelevance = "";
	if (noCheckRadio.innerText == "1") {
		installedRelevance = "TRUE";
	}
	else if (regAppRadio.innerText == "1") {
		installedRelevance = "(not exists regapp " + '"' + regAppText.innerText + '"' + ")";
	} 
	else if (servAppRadio.innerText == "1") {
		installedRelevance = "(not exists service " + '"' + servAppText.innerText + '"' + ")";
	}
	else if (regKeyRadio.innerText == "1") {
		if (regValueCheck.innerText == "1") {
			if (regValue.innerText.length == 0) {
				installedRelevance += "((not exists key " + '"' + regKeyText.innerText + '"' + " of registry) OR (not exists value " 
							+ '"' + regValueName.innerText + '"' + " of key "
							+ '"' + regKeyText.innerText + '"' + " of registry))";
			}
			else {
				installedRelevance += "((not exists key " + '"' + regKeyText.innerText + '"' + " of registry) OR (not exists value " 
							+ '"' + regValueName.innerText + '"' + " of key "
							+ '"' + regKeyText.innerText + '"' + " of registry) OR (value " 
							+ '"' + regValueName.innerText + '"' + " of key " 
							+ '"' + regKeyText.innerText + '"' + " of registry as string != " 
							+ '"' + regValue.innerText + '"' + "))";
			}
		}
		else {
			installedRelevance += "(not exists key " + '"' + regKeyText.innerText + '"' + " of registry)";
		}
	} else if (appFileRadio.innerText == "1") {
		installedRelevance = "(not exists file " + '"' + appFileText.innerText + '"' + ")";
	} else {
		window.alert(lStrings.WizDetermineInstalledNotSpecified);
		return "";
	}
	theRelevance.innerText = platformRelevance.innerText + " AND " + installedRelevance;
  
  return theRelevance.innerText;
}

function CreateTitle()
{
	return lStrings.WizSWDepl +  lStrings.WizDepl + appName.innerText;
}

function DoFinish()
{	
       
  // Import to a fixlet
  var tR = CreateRelevance(); // an array of relevance
  if(tR == ""){ return; }
	var tA = CreateAction();
  if(tA == ""){ return; }
	var tT = CreateTitle();
  if(tT == ""){ return; }
	var tD = OneTimeAction.checked ? "" : CreateDescription();
           	
	var r;
	var a;
	var t;
	var d;
	var s;
	var deploy;
	var click;
	var here;
	var cat;
	var source;
  
  var results;
	var doc;
	
	if(tA == ""){
		return;	
	}
	
	if (OneTimeAction.checked)
	{
		doc = xmlCustomAction.XMLDocument;
		r = doc.selectSingleNode("BES/SingleAction/Relevance");
		a = doc.selectSingleNode("BES/SingleAction/ActionScript");
		t = doc.selectSingleNode("BES/SingleAction/Title");
    
		r.text = tR;
		a.text = tA;
		t.text = tT;
		
		try {results = ImportXML(xmlCustomAction.xml);
			if (results) {
				ButtonCancel.click();
			}
		}
		catch (e) {
			window.alert(lStrings.WizErrImportAct + e.message);
		}
	} else {
		doc = xmlCustomTask.XMLDocument;
	
		r = doc.selectSingleNode("BES/Task/Relevance");
		a = doc.selectSingleNode("BES/Task/DefaultAction/ActionScript");
		t = doc.selectSingleNode("BES/Task/Title");
		d = doc.selectSingleNode("BES/Task/Description");
		s = doc.selectSingleNode("BES/Task/DownloadSize");
		click = doc.selectSingleNode("BES/Task/DefaultAction/Description/PreLink");
		here = doc.selectSingleNode("BES/Task/DefaultAction/Description/Link");
		deploy = doc.selectSingleNode("BES/Task/DefaultAction/Description/PostLink");
		cat = doc.selectSingleNode("BES/Task/Category");
		source = doc.selectSingleNode("BES/Task/Source");
		    
		r.text = tR;
		a.text = tA;
		t.text = tT;
		d.text = tD;
		s.text = size;
		click.text=lStrings.WizXMLClk_Pg4;
		here.text=lStrings.WizXMLHere_Pg4;
		deploy.text=lStrings.WizXMLDepl_Pg4;
		cat.text = lStrings.VarCat;
		source.text = lStrings.VarSrc;

		try {
			results = ImportXML(xmlCustomTask.xml);
			if (results) {
				ButtonCancel.click();
			}
		}
		catch (e) {
			window.alert(lStrings.WizErrIMportFixlet + e.message);
		}								
	}
}