
/* JavaScript content from js/appcenter/controllers/ControllerPhone.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define(["dojo/_base/lang", 
        "dojo/_base/declare", 
        "dojo/i18n!appcenter/nls/common", 
        "dojox/app/Controller",
        "dojo/topic",
        "appcenter/controllers/ControllerBase",
        "appcenter/views/utils"],
function(lang, declare, nls, Controller,topic, ControllerBase, utils){

	return declare("appcenter.controllers.ControllerPhone", ControllerBase, {

		constructor: function(app, events){
			
			this.events = {			
				"appcenter/loginOK": this.loginOK,
				"appcenter/showDetailsVersion,": this.showDetailsVersion,
				"appcenter/showAppLinkDetails": this.showAppLinkDetails,
				"appcenter/showViewAfterFeedback,": this.showViewAfterFeedback,
				"appcenter/logout": this.logout,
				"appcenter/showVersionHistory": this.showVersionHistory,
				"appcenter/showReviews": this.showReviews,
				"appcenter/rateApplication": this.rateApplication,
				"appcenter/showTab": this.showTab,
				"appcenter/handleInvokeURL": this.handleInvokeURL
			};
		},		
		
		showViewAfterFeedback: function(event){
			if(event.appItem.isAppLink){
				this.showAppLinkDetails(event);
			}else{
				this.showDetailsVersion(event);
			}
		},
		
		showDetailsVersion: function(event){
			this.app.emit("appcenter/pushViewOnStack", {
				stack: "default",
				view: event.view,
				target: "Tabs,DetailsVersion",
				targetLabel: nls.detailsTitle,
				transition: "slide",
				forceRank: event.forceRank,
				data: event.data
			});	
		},
				
		showVersionHistory: function(event){
			this.app.emit("appcenter/pushViewOnStack", {
				stack: "default",
				target: "Tabs,VersionHistory",
				targetLabel: nls.versionHistoryTitle,
				transition: "slide"
			});
		},
		
		showReviews: function(event){
			this.app.emit("appcenter/pushViewOnStack", {
				stack: "default",
				target: "Tabs,Reviews",
				targetLabel: "",
				transition: "slide"
			});
		},
		
		rateApplication: function(event){
			this.app.emit("appcenter/pushViewOnStack", {
				stack: "default",
				target: "SendReview",
				targetLabel: "",
				transition: "slide"
			});
		},
		showAppLinkDetails: function(event){
			this.app.emit("appcenter/pushViewOnStack", {
				stack: "default",
				view: event.view,
				target: "Tabs,DetailsAppLink",
				targetLabel: nls.detailsTitle,
				transition: "slide",
				forceRank: event.forceRank,
				data: event.data
			});
		}
		
	});
});
