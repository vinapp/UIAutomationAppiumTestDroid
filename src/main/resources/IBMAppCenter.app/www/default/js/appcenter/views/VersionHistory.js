
/* JavaScript content from js/appcenter/views/VersionHistory.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
        "dojo/_base/lang", 
        "dojo/_base/array",
        "dojo/on", 
        "dojo/dom-style", 
        "dojo/string",
        "dojo/store/Memory"], 
    function(
    		lang,
    		arr,
    		on,
    		domStyle,
    		string,
    		Memory){

	return {
		
		init: function(){
			this.list.on("itemClick", lang.hitch(this, function(item){
				this.app.versionItem = item.rawItem;				
				this.app.emit("appcenter/popViewFromStack",{});			
			}));
		},
		
		beforeActivate: function(){
			
			this.app.logM("Navigation", "INFO", "Navigated to Version History view");
			
			var item = this.app.appItem;
			if(item){
				this.app.updateVersionList(this.list);			
			}
			
			this.app.setBackButton(this.header);			
		}
		
	};
});
