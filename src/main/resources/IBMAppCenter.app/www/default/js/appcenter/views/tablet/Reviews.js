
/* JavaScript content from js/appcenter/views/tablet/Reviews.js in folder common */
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
        "dojo/topic", 
        "dojo/string", 
        "dojo/dom-style",
        "dojo/dom-class",
        "dojo/store/Memory", 
        "appcenter/views/ReviewsBase"], 
    function(
    		declare,
    		lang,
    		arr,
    		on,
    		topic,
    		string,
    		domStyle,
    		domClass,
    		Memory,
    		ReviewsBase){
	
	return declare("appcenter.views.tablet.Reviews", ReviewsBase, {
		
		init: function(){
			topic.subscribe("appcenter/appInfoLoaded", lang.hitch(this,function(event){
				this.reviewListInvalidated = true;
				this.configureViewBase();
				if(this.invalidated && this.viewShowing){
					this.loadReviews();
				}
			}));
			
			this.loadButton.on("click", lang.hitch(this, function(){				
				this.loadReviews(true);
			}));
			
			var viewPath = this.id.split('_');
			var viewName = viewPath[viewPath.length-1];
			var parentViewName = viewPath[viewPath.length-2];
			this.showAllVersion = viewName == "AllReviews";
			this.button = this.showAllVersion ? "allReviews" : "reviews";
			this.noReviewLabel.innerHTML = this.nls[this.showAllVersion || parentViewName == "DetailsAppLink" ? "noReviewAllVersions" : "noReview"];
			
		},
		
		beforeActivate: function(){
			this.inherited(arguments);			
		},
		
		afterActivate: function(){
			var item = this.app.appItem;
			if(item){
				if(this.invalidated)
					this.loadReviews();			
			}
			topic.publish("appcenter/details/updateTabButton", this.button);
			
		},
		
		configureView: function(){
			// set current state
			this.appItem = this.app.appItem;
			this.versionItem = this.showAllVersion ? null : this.app.versionItem;		
		},
		
		isInvalidated: function(){
			// summary:
			//		Checks whether the currently displayed data is consistent 
			//		with the info that needs to be displayed by this view.
			var checkApp = this.reviewListInvalidated || // a feedback has been sent
				this.appItem == null || // different app is displayed 
				this.appItem.pkg !=  this.app.appItem.pkg;
			var checkVersion = this.versionItem == null && this.app.versionItem != null || //difference version of app displayed
				this.versionItem != null && this.app.versionItem == null ||
				this.versionItem != null && this.app.versionItem != null && this.versionItem.version != this.app.versionItem.version;
			
			return checkApp || (this.showAllVersion ? false : checkVersion);
		}
	});
	
});