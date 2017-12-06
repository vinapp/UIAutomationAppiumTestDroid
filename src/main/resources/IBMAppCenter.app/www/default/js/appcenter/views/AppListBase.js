
/* JavaScript content from js/appcenter/views/AppListBase.js in folder common */
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
"dojo/topic",
"dojo/store/Memory",
"dojox/app/View"
], 
function(
		declare,
		lang,
		arr,
		on,
		domStyle,
		topic,
		Memory,
		View
) {
	return declare("appcenter.views.AppListBase", View, {
		
		init: function(){
			
			query: null,
			
			this.list.on("itemClick", lang.hitch(this, function(listItem){
				
				this.app.appItem = listItem.rawItem;
				if(this.app.appItem.isAppLink){
					this.app.versionItem = null;
					this.app.emit("appcenter/showAppLinkDetails", {
						view: this
					});
				}else{
					this.app.versionItem = this.app.getVersionItem(this.app.appItem, this.app.appItem.version);
					this.app.emit("appcenter/showDetailsVersion", {
						view: this
					});
				}
								
			}));
			
			topic.subscribe("appcenter/updateListSort", lang.hitch(this, function(){
				this.sortInvalidated = true;
				if(this.viewShowing){
					this.updateSort();
				}
			}));
			
			topic.subscribe("appcenter/refreshView", lang.hitch(this, function(){				
				if(this.viewShowing){
					this.refresh();
				}
			}));
			
			this.noAppLabel.innerHTML = this.nls[this.emptyListLabelKey];
			
		},
		
		beforeActivate: function(){
			this.list.set("type", this.app.appConfig.listItemRenderer == "full" ? "app" : "regular");
		},
		
		afterActivate: function(){	
			if(!this._initialized){											
				if(!this._initialized || this.invalidated){
					this._initialized = true;
					this.sortInvalidated = false;
					this.getList();
				}								
			}else{
				if(this.invalidated){					
					this.getList();					
				}else if(this.sortInvalidated){
					this.updateSort();
				}
				if(this.app.credentials == null){
					this.moveToLogin();
				}
			}
		},
		
		updateSort: function(){
			this.list.setQuery(this.query, this.app.appSort);
			this.sortInvalidated = false;
		},
		
		moveToLogin: function(){
			this.app.emit("appcenter/logout");
		},
		
		refresh: function(){
			
		}

	});

});
