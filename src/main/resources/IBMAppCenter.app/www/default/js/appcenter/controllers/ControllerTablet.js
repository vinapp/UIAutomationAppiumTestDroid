
/* JavaScript content from js/appcenter/controllers/ControllerTablet.js in folder common */
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

	return declare("appcenter.controllers.ControllerTablet", ControllerBase, {

		constructor: function(app, events){
			
			this.inherited(arguments);
			
			this.events = {
				"appcenter/loginOK": this.loginOK,
				"appcenter/showDetailsVersion,": this.showDetailsVersion,
				"appcenter/showAppLinkDetails": this.showAppLinkDetails,
				"appcenter/showViewAfterFeedback,": this.showViewAfterFeedback,
				"appcenter/logout": this.logout,
				"appcenter/showVersionHistory": this.showVersionHistory,
				"appcenter/showDescription": this.showDescription,
				"appcenter/showReviews": this.showReviews,
				"appcenter/showAppLinkDescription": this.showAppLinkDescription,
				"appcenter/showAppLinkReviews": this.showAppLinkReviews,				
				"appcenter/showAllReviews": this.showAllReviews,
				"appcenter/rateApplication": this.rateApplication,
				"appcenter/showTab": this.showTab,
				"app-resize": this.appResize,
				"appcenter/handleInvokeURL": this.handleInvokeURL
			};									
		},
				
		showDetailsVersion: function(event){
			this.app.emit("appcenter/pushViewOnStack", {
				stack: "default",
				view: event.view,
				target: "Tabs,DetailsVersion,Description",
				targetLabel: nls.detailsTitle,
				transition: "slide",
				forceRank: event.forceRank,
				data: event.data
			});				
		},
		
		showAppLinkDetails: function(event){
			this.app.emit("appcenter/pushViewOnStack", {
				stack: "default",
				view: event.view,
				target: "Tabs,DetailsAppLink,Description",
				targetLabel: nls.detailsTitle,
				transition: "slide",
				forceRank: event.forceRank,
				data: event.data
			});
		},
		
		showViewAfterFeedback: function(event){
			event.action = "appcenter/pushViewOnStack";
			if(event.appItem.isAppLink){
				this.showAppLinkReviews(event);
			}else{
				this.showReviews(event);
			}								
		},
		
		showVersionHistory: function(event){
			this.app.emit("appcenter/pushViewOnStack", {
				stack: "default",
				target: "Tabs,VersionHistory",
				targetLabel: nls.versionHistoryTitle,
				transition: "slide"
			});
		},
		
		showDescription: function(event){
			this.app.emit("appcenter/show", {
				stack: "default",
				target: "Tabs,DetailsVersion,Description",
				targetLabel: "",
				transition: "none"
			});
		},
		
		showReviews: function(event){
			var topic = event && event.action ? event.action : "appcenter/show";
			this.app.emit(topic, {
				stack: "default",
				target: "Tabs,DetailsVersion,Reviews",
				targetLabel: "",
				transition: "none",
				data: event ? event.data : null
			});
		},
		
		showAppLinkDescription: function(event){			
			this.app.emit("appcenter/show", {
				stack: "default",
				target: "Tabs,DetailsAppLink,Description",
				targetLabel: "",
				transition: "none"
			});
		},
		
		showAppLinkReviews: function(event){
			var topic = event && event.action ? event.action : "appcenter/show";
			this.app.emit(topic, {
				stack: "default",
				target: "Tabs,DetailsAppLink,Reviews",
				targetLabel: "",
				transition: "none",
				data: event ? event.data : null
			});
		},
		
		showAllReviews: function(event){
			this.app.emit("appcenter/show", {
				stack: "default",
				target: "Tabs,DetailsVersion,AllReviews",
				targetLabel: "",
				transition: "none",
				data: event ? event.data : null
			});
		},
		
		rateApplication: function(event){
			stack: "default",
			this.app.emit("appcenter/pushViewOnStack", {
				target: "Feedback",
				targetLabel: "",
				transition: "slide"
			});
		},
		
		appResize: function(){			
			topic.publish("appcenter/app-resize");		
		}
		
	});
});
