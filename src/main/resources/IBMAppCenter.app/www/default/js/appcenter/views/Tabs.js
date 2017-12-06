
/* JavaScript content from js/appcenter/views/Tabs.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-style",
        "dojo/topic",
        "appcenter/views/utils"], 
    function(lang, arr, domStyle, topic, utils){

	return {
				  
		init: function(){
			this.catalogTab.on("click", lang.hitch(this, function(){
				this.app.emit("appcenter/showTab", {
					tab: "catalog"
				});
			}));
			this.favoritesTab.on("click", lang.hitch(this, function(){
				this.app.emit("appcenter/showTab", {
					tab: "favorites"
				});
			}));
			this.updatesTab.on("click", lang.hitch(this, function(){				
				this.app.emit("appcenter/showTab", {
					tab: "updates"
				});
			}));
			
			topic.subscribe("appcenter/updateTabs", lang.hitch(this, function(o){
				this.catalogTab.set("disabled", o.disabled);
				this.favoritesTab.set("disabled", o.disabled);
				this.updatesTab.set("disabled", o.disabled);
			}));
						
			topic.subscribe("appcenter/currentTabChanged", lang.hitch(this, function(tab){
				this[tab+"Tab"].set("selected", true);
			}));
			
			topic.subscribe("appcenter/updatesBadgeChanged", lang.hitch(this, function(count){
				this.updatesTab.set("badge", count);
			}));
		},
		
		beforeActivate: function(){
			if(!this._hfInit){
				this._hfInit = true;
				domStyle.set(this.tabBar.domNode, "visibility", "visible");				
			}			
		}
	};

});
