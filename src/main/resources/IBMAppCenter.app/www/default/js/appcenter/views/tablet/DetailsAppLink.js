
/* JavaScript content from js/appcenter/views/tablet/DetailsAppLink.js in folder common */
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
        "appcenter/views/tablet/DetailsVersion",
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

	return declare("appcenter.views.tablet.DetailsAppLink", DetailsVersion, {
		
		init: function(){
			this.inherited(arguments);
			
			this.gotoAppStoreButton.on("click", lang.hitch(this, function(evt){				
				if(this.app.appItem){
					window.open(this.app.appItem.appStoreLaunchUrl, "_system");
				}				
			}));
						
			domStyle.setD(this.addReviewButton, this.app.appConfig.allowAppLinkReview?"inline-block":"none");
			domStyle.setD(this.segmentedControlDetails, this.app.appConfig.allowAppLinkReview?"inline-block":"none");			
		},
		
		updateInstallButton: function(){
			// do nothing
		},
		
		isInvalidated: function(){
			return !this.appItem || this.appItem.pkg != this.app.appItem.pkg;
		}
	});
});
