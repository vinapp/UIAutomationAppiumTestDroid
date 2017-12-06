
/* JavaScript content from js/appcenter/views/AppListContainer.js in folder common */
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
        "appcenter/views/utils"
        ], 
    function(lang, arr, domStyle, topic, utils){

	return {
				  
		init: function(){
			this.logoutButton.on("click", lang.hitch(this, function(e){
				this.app.credentials = null;	
				this.app.emit("appcenter/logout", {});
				this.app.emit("appcenter/showTab", {
					tab: "catalog"
				});
			}));
								
			this.refreshButton.on("click", lang.hitch(this, function(e){				
				topic.publish("appcenter/refreshView");
			}));
					
				
			this.sortButton.on("click", lang.hitch(this, function(){
				this.sortDialog.show();
			}));
			
			this.dialogOkButton.on("click", lang.hitch(this, function(){
				this.sortDialog.hide();
				
				var sort = null;
				if(this.sortNameItem.get("checked")){
					sort = this.app.sortAlphabetic;
				}else if(this.sortPopularItem.get("checked")){
					sort = this.app.sortPopular;
				}else if(this.sortRatingItem.get("checked")){
					sort = this.app.sortRating;
				}else {
					sort = this.app.sortUpdated;
				}
				
				this.app.setCurrentSort(sort);
				
			}));
				
		},
		
		beforeActivate: function(){
			if(!this._hfInit){
				this._hfInit = true;
				domStyle.set(this.header.domNode, "visibility", "visible");				
			}			
		}
	};

});
