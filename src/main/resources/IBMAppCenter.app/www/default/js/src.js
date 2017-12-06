
/* JavaScript content from js/src.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

require(["dojox/mobile", "dojo/dom-class", "dojox/app/main", "dojox/json/ref", "dojo/sniff", "dojo/io-query"],
	function(mobile, domClass, Application, json, has, ioq){

	var configurationFile = "./js/appcenter/config-phone.json";
	var isTablet = false;
	var doc = window.document.documentElement;
	
	if(domClass.contains(doc, "dj_tablet") || has("ipad")){
		configurationFile = "./js/appcenter/config-tablet.json";
		isTablet = true;
	}
	
	// install _html to load correct module in appcenter.js
	var query = ioq.queryToObject(document.location.search.substring(1));
	has.add("_html", query.html);
	if(query.theme=="Android") { // simulator use case
		has.add("android", "4.2");
	}
	
	// dojo.has does not handle "Windows Phone"
	var ua = navigator.userAgent.toLowerCase();
	has.add("WindowsPhone", (ua.indexOf("windows phone") > -1) || (query.theme=="WindowsPhone"));
	
	if(has("ios") >= 7){
		domClass.add(doc, "dj_status_bar");
	}

	// disable automatic dojox.mobile resize mechanism, use only dojox.app layout
	mobile.disableResizeAll = true;

	require(["dojo/text!"+configurationFile, "dojo/text!./js/appcenter/config.json"], function(configJson, serverJson){
		var config = json.fromJson(configJson);
		config.isTablet = isTablet;
		config.appConfig = json.fromJson(serverJson); 
		Application(config);
	});
});
