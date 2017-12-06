
/* JavaScript content from js/appcenter/views/DetailsAppLink.js in folder common */
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
        "dojo/topic",
        "appcenter/views/DetailsVersion",
        "appcenter/views/utils"], 
    function(
    		declare,
    		lang,
    		arr,
    		on,
    		string,
    		domStyle,
    		domClass,
    		topic,
    		DetailsVersion,
    		utils){

	return declare("appcenter.views.DetailsAppLink", DetailsVersion, {
		
		init: function(){
			this.inherited(arguments);
			
			this.gotoAppStoreButton.on("click", lang.hitch(this, function(evt){				
				if(this.app.appItem){
					window.open(this.app.appItem.appStoreLaunchUrl, "_system");
				}				
			}));
		},
		
		detailsAppLink: true,
		
		updateInstallButton: function(){
			// do nothing
		},
		
		updateListItems: function(reset){
			var show = this.app.appConfig.allowAppLinkReview && !reset;
			domStyle.setD(this.rateAppListItem, show ?"block":"none");
			domStyle.setD(this.reviewsListItem, show ?"block":"none");
		},
		
		isInvalidated: function(){
			return !this.appItem || this.appItem.pkg != this.app.appItem.pkg || this.reviewsInvalidated;
		}
	});
});
