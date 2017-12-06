
/* JavaScript content from js/appcenter/views/Catalog.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/_base/array",
        "dojo/on", 
        "dojo/dom-style", 
        "dojo/store/Memory",
        "dojo/topic",
        "appcenter/views/AppListBase",
        "appcenter/views/utils",
        "dojo/has!ios?idx/mobile/Launch"], 
        
    function(
    		declare,
    		lang,
    		arr,
    		on,
    		domStyle, 
    		Memory, 
    		topic,
    		AppListBase,
    		utils,
    		Launch){

	return declare("appcenter.views.Catalog", AppListBase, {

		emptyListLabelKey: "noApplication",
		
		init: function(){
			this.inherited(arguments);
			
			topic.subscribe("appcenter/invalidateCatalog", lang.hitch(this, function(){				
				this.invalidated = true;
			}));
			
			topic.subscribe("appcenter/catalogLoaded", lang.hitch(this, function(catalogStore){
				this.invalidated = false;
				this._setCatalogStore(catalogStore);
			})); 
			
			topic.subscribe("appcenter/catalogLoadError", lang.hitch(this, function(catalogStore){
				domStyle.setD(this.noApp, "block");
				this.list.setStore(new Memory(), null, this.app.appSort);
			}));
		},
		
		beforeActivate: function(){			
			this.inherited(arguments);
			this.parent.header.set("label", this.nls.catalogTitle);
			this.app.logM("Navigation", "INFO", "Navigated to Catalog view");
		},
		
		afterActivate: function(){
			if(Launch && Launch.domNode){
				Launch.hide();
			}
			if(!this._initialized){											
				this._initialized = true;
				this.sortInvalidated = false;
				if(this.app.catalogStore){
					this.invalidated = false;
					this._setCatalogStore(this.app.catalogStore);
				}else{
					this.getList();
				}
			}else{
				this.inherited(arguments);
			}
		},
		
		_setCatalogStore: function(catalogStore){
			domStyle.setD(this.noApp, catalogStore.query(this.query).length == 0 ? "block" : "none");
			this.app.ios7ScrollWA(this.container);
			this.list.setStore(catalogStore, null, this.app.appSort);
		}, 
		
		refresh: function(){
			// a "appcenter/catalogLoaded" message will be sent when loaded 				
			topic.publish("appcenter/loadCatalog");
		},
		
		getList: function(){
			this.invalidated = false;
			topic.publish("appcenter/loadCatalog");
			
		}
	});

});
