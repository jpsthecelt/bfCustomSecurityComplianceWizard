// globals
BF.Site.primarySite = 'Configuration Management';

function init(viewName) {
	bFApplication.initApplication(viewName, "ManageCustomContentWizard.swf",
			"100%", "100%", "9");
}

function getSupportedLocales() {
	// define list of supported locales here
	// these need to map to your resource bundles
	// and the assumption is that while these must
	// match the string returned by IE's navigator.browserLanguage
	// they must ultimately be of the format xx_xx (all lowercase)
	// comma delimited string, i.e. "en_us, zh_cn, ja"
	return 'en_us';
}

function getResources() {
	// define list of resource bundles here
	return [ "component_library", "ManageCustomContentWizard" ];
}

// make sure this JS object inherits from JSRequest
ExternalContentDR.prototype = new BF.JSRequest();

function ExternalContentDR() {

	this.loadExternalSites = function() {
		var rel = '(names of it, ids of it, size of fixlet set of it) of bes sites whose ((it starts with "SCM Checklist " ' + 
				  'or it starts with "DISA STIG on") of name of it and external site flag of it)';

		// need to use bind method for same reasons as mentioned above
		BFEvaluateRelevance(rel, BF.Utils.bind(this, this.sortingLoadCallback));
	}

	this.loadFixletsBySites = function(sites) {
		var rel = '(ids of it, ids of site of it) of fixlets of bes sites whose (';
		for ( var i = 0; i < sites.length; i++) {
			if (i > 0) {
				rel += ' or ';
			}
			rel += '(id of it = ' + sites[i].id + ')';
		}
		rel += ')';
		BFEvaluateRelevance(rel, BF.Utils.bind(this, this.loadCallback));
	}

	this.loadCustomSites = function() {
		var rel = '(names of it, size of fixlet set of it) of all bes sites whose (custom site flag of it)';
		BFEvaluateRelevance(rel, BF.Utils.bind(this, this.loadCallback))
	}

	this.loadCallback = function(results) {
		BF.Utils.callActionScript(this.getASCallback(), results);
	}

	this.sortingLoadCallback = function(results) {
		results.sort();
		BF.Utils.callActionScript(this.getASCallback(), results);
	}
}

CustomContentService.prototype = new BF.JSRequest();
function CustomContentService() {
	this.createCustomSiteWithContent = function(siteName, fixlets, bCreateSite) {
		if (bCreateSite) {
			CreateCustomSite(siteName);
		}
		if (this.copyFixletsToSite(fixlets, true, siteName, false) != undefined) {
			openSite(siteName);
			BF.Utils.callActionScript(this.getASCallback());
		}
	}

	this.copyFixletsToSite = function(sourceFixlets, skipUI, destinationSite,
			openDocuments) {
		var multipleItems = new ActiveXObject("Microsoft.XMLDOM");
		multipleItems
				.loadXML('<BES xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="BES.xsd"></BES>');

		if (skipUI) {
			multipleItems.childNodes[0].setAttribute("SkipUI", "true");
		} else {
			multipleItems.childNodes[0].setAttribute("SkipUI", "false");
		}

		for ( var i in sourceFixlets) {
			var singleItem = new ActiveXObject("Microsoft.XMLDOM");
			singleItem.loadXML(Relevance("(fixlet " + sourceFixlets[i].fixletID
					+ " of bes site whose (id of it = "
					+ sourceFixlets[i].siteID + ")) as xml"));
			multipleItems.childNodes[0]
					.appendChild(singleItem.childNodes[1].childNodes[0]);
		}

		return ImportXMLToSite(multipleItems.xml, destinationSite, openDocuments);
	}
}

function openSite(siteName) {
	window.location = "linkid:openCustomSite(" + siteName + ")";
}
