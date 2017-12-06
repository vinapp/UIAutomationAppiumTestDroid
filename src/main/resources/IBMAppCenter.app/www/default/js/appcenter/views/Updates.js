
/* JavaScript content from js/appcenter/views/Updates.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-style",
        "dojo/store/Memory",
        "dojo/topic",
        "appcenter/views/AppListBase",
        "appcenter/views/utils"], 
    function(
    		declare,
    		lang,
    		domStyle, 
    		Memory,
    		topic,
    		AppListBase,
    		utils){

	return declare("appcenter.views.Updates", AppListBase, {
		
		emptyListLabelKey: "noUpdate",
		
		init: function(){ 
			this.inherited(arguments);
			var invalidateHandler = lang.hitch(this, function(){
				this.invalidated = true;
			}); 
			topic.subscribe("appcenter/clearCache", invalidateHandler);
			topic.subscribe("appcenter/invalidateUpdates", invalidateHandler);			
		},
		
		beforeActivate: function(){
			this.app.logM("Navigation", "INFO", "Navigated to Updates view");
			this.inherited(arguments);
			this.parent.header.set("label", this.nls.updatesTitle);
			if(this.list.store){
				domStyle.setD(this.noApp, this.list.store.query().length == 0 ? "block" : "none");
			}
		},
		
		refresh: function(){
			this.getList();
		},
		
		getList: function(){
			this.inherited(arguments);
			this.app.getUpdates(
				lang.hitch(this, function(data){
					domStyle.setD(this.noApp, data.length == 0 ? "block" : "none");
					this.app.ios7ScrollWA(this.container);
										
					var store = this.app.createUpdatesStore(data.length == 0 ? null : data);
					this.list.setStore(store, null, this.app.appSort);
					
				}), 
				this.app.getErrHandler(null, lang.hitch(this, function(e, message){
					domStyle.setD(this.noApp, "block");
					this.list.setStore(new Memory(), null, this.app.appSort);
					utils.showErrorDialog(message);
				})));				
		}
	});
		
});
