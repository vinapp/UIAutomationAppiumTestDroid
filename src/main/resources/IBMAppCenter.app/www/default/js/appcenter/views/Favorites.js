
/* JavaScript content from js/appcenter/views/Favorites.js in folder common */
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

	return declare("appcenter.views.Favorite", AppListBase, {
		
		emptyListLabelKey: "noFavorite",
		
		query: {favorite: true},
		
		init: function(){ 
			this.inherited(arguments);
			var invalidateHandler = lang.hitch(this, function(){
				this.invalidated = true;
			}); 
			
			topic.subscribe("appcenter/clearCache", invalidateHandler);
			topic.subscribe("appcenter/invalidateFavorites", invalidateHandler);
			
			topic.subscribe("appcenter/catalogLoaded", lang.hitch(this, function(store){
				this.list.setStore(store, this.query, this.app.appSort);
			}));
			
			topic.subscribe("appcenter/catalogLoadError", lang.hitch(this, function(catalogStore){
				domStyle.setD(this.noApp, "block");
				this.list.setStore(new Memory(), null, this.app.appSort);
			}));
		},
		
		beforeActivate: function(){
			
			this.app.logM("Navigation", "INFO", "Navigated to Favorites view");
			
			this.inherited(arguments);
			this.parent.header.set("label", this.nls.favoritesTitle);
			if(this.list.store){				
				domStyle.setD(this.noApp, this.list.store.query(this.query).length == 0 ? "block" : "none");
			}
		},
		
		refresh: function(){
			// a "appcenter/catalogLoaded" message will be sent when loaded 				
			topic.publish("appcenter/loadCatalog");
		},
		
		getList: function(){
			this.invalidated = false;				
			this.list.setStore(this.app.catalogStore, this.query, this.app.appSort);
			domStyle.setD(this.noApp, this.list.store.query(this.query).length == 0 ? "block" : "none");
		}
	});
	
});