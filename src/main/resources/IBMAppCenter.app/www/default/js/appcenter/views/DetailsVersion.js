
/* JavaScript content from js/appcenter/views/DetailsVersion.js in folder common */
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
        "dojo/string", 
        "dojo/dom-style",
        "dojo/dom-class",
        "dojo/sniff",
        "dojo/topic",
        "appcenter/views/DetailsBase",
        "appcenter/views/utils"], 
    function(
    		declare,
    		lang,
    		arr,
    		on,
    		string,
    		domStyle,
    		domClass,
    		has,
    		topic,
    		DetailsBase,
    		utils){

	return declare("appcenter.views.DetailsVersion", DetailsBase, {
				
		init: function(){
			
			this.inherited(arguments);
			
			if(this.versionHistoryItem){
				this.versionHistoryItem.on("click", lang.hitch(this, function(e){				
					this.app.emit("appcenter/showVersionHistory");
				}));
			}
			this.reviewsListItem.on("click", lang.hitch(this, function(e){
				this.app.emit("appcenter/showReviews");
			}));
			this.rateAppListItem.on("click", lang.hitch(this, function(e){
				if(this.appItem.isAppLink || has("ios")){
					this.app.emit("appcenter/rateApplication");					
				}else{
					this.app.getInstalledVersion(this.appItem).then(
						lang.hitch(this, function(iVersion){
							if(iVersion){
								this.app.emit("appcenter/rateApplication");
							}
						})
					);		
				}
			}));
			
			topic.subscribe("appcenter/reviewSent", lang.hitch(this, function(e){
				if(e.appItem.isAppLink == this.detailsAppLink){
					if(this.versionItem){
						this.app.invalidateAppInfo(this.versionItem);
					}
					this.reviewsInvalidated = true;
				}
			}));
			
		},
		
		detailsAppLink: false,

		onAppInfoLoaded: function(vItem){
			
			this.app.ios7ScrollWA(this.container);
			
			this.reviewsInvalidated = false;
			this.updateDetails();
			this.updateDescription();			
			this.updateInstallButton();
			this.updateListItems();		
			
		},

		onNativeUpdate: function(){
			
			this.app.ios7ScrollWA(this.container);
				
			this.updateInstallButton();
			this.updateListItems();					
		},
		
		updateListItems: function(reset){
			if(reset){
				if(this.versionHistoryItem){
					domStyle.hide(this.versionHistoryItem);
				}
				domStyle.hide(this.rateAppListItem);
				domStyle.hide(this.reviewsListItem);
				return;
			}
			
			if(!this.appItem.isAppLink){			
				if(has("ios")){
										
					var showVersions = this.appItem.versions && this.appItem.versions.length > 1 && this.app.appConfig.showPreviousVersions;
								
					this.rateAppListItem.set("label", this.nls.addReviewButton);
					domStyle.setD(this.versionHistoryItem, showVersions ? "block" : "none");
					domStyle.setD(this.rateAppListItem, "block");
					domStyle.setD(this.reviewsListItem, this.appItem.nb_rating_all_versions > 0 ? "block" : "none");
					
				} else {
								
					this.app.getInstalledVersion(this.appItem).then(
						lang.hitch(this, function(iVersion){
							if(iVersion && iVersion.version == this.versionItem.version){
								this.rateAppListItem.set("label", string.substitute(this.nls.rateInstalled, {version: this.app.getVersionName(iVersion)}));
							}else{
								this.rateAppListItem.set("label", this.nls.rateInstalledDisabled);
							}
							
							domClass[iVersion==null?"add":"remove"](this.rateAppListItem.domNode, "mblDisabled");
							var showVersions = this.appItem.versions && this.appItem.versions.length > 1 && this.app.appConfig.showPreviousVersions;
										
							domStyle.setD(this.versionHistoryItem, showVersions ? "block" : "none");
							domStyle.setD(this.rateAppListItem, "block");
							domStyle.setD(this.reviewsListItem, this.appItem.nb_rating_all_versions > 0 ? "block" : "none");
						}),
						this.app.getErrHandler()
					);
				}
			}
							
		},
		
		afterDeactivate: function(){		
			this.container.scrollTo(0);
		}	
	});
});
