
/* JavaScript content from js/appcenter/views/Reviews.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/dom-style", 
        "dojo/string",        
        "dojo/topic",
        "appcenter/views/ReviewsBase"], 
    function(
    		declare,
    		lang,
    		on,
    		domStyle,
    		string,
    		topic,
    		ReviewsBase){

	return declare("appcenter.views.Reviews", ReviewsBase, {
		
		init: function(){	
			
			this.inherited(arguments);
			
			this.loadButton.on("click", lang.hitch(this, function(){				
				this.loadReviews(true);
			}));
			
			this.prefButton.on("click", lang.hitch(this, function(){
				this.prefDialog.show();				
			}));
			
			this.dialogOkButton.on("click", lang.hitch(this, function(){
				this.prefDialog.hide();
				this.applyPreferences();
			}));
			
			topic.subscribe("appcenter/reviewSent", lang.hitch(this, function(e){				
				this.reviewListInvalidated = true;				
			}));
		},
		
		applyPreferences: function(){
			var g = this.showAllListItem.get("checked");
			if(this.app.globalRating != g){
				this.app.globalRating = g;				
				this.configureViewBase();
				this.loadReviews();
			}
		},
		
		afterActivate: function(){
			var item = this.app.appItem;
			if(item){
				
				this.noReviewLabel.innerHTML = this.nls[this.app.globalRating || item.isAppLink ? "noReviewAllVersions" : "noReview"];
				
				if(this.invalidated)
					this.loadReviews();			
			}
			
			this.app.setBackButton(this.header);						
		},
		
		configureView: function(){
			// set current state
			this.appItem = this.app.appItem;
			this.globalRating = this.appItem.isAppLink ? false : this.app.globalRating;
			
			this.versionItem = this.appItem.isAppLink ? this.appItem : (this.globalRating ? null : this.app.versionItem);
						
			domStyle.set(this.list.domNode, "visibility", this.invalidated?"hidden":"visible");
			domStyle.setD(this.prefButton, this.appItem.isAppLink?"none":"");
			
			// configure header
			var vLabel = "";
			if(!this.appItem.isAppLink){				
				var vName = this.app.getVersionName(this.app.versionItem);
				vLabel = string.substitute(this.nls.reviewsVersion, {version:vName});
				// preference menu item
				this.showVersionListItem.set("label", vLabel);
			}
			
			this.appLabel.innerHTML = this.globalRating ? this.appItem.label : this.versionItem.label;
			
			if(this.versionItem != null){
				domStyle.setD(this.versionLabel, "block");			
				this.versionLabel.innerHTML = vLabel;
				this.rating.set("value", this.versionItem.avg_rating/2);
				this.ratingMessage.innerHTML = string.substitute(this.nls.detailsRating, {nb_rating: this.versionItem.nb_rating});
			}else{
				this.versionLabel.innerHTML = this.nls.detailsAllVersions;
				this.rating.set("value", this.app.appItem.avg_rating_all_versions/2);
				this.ratingMessage.innerHTML = string.substitute(this.nls.detailsRating, {nb_rating: this.app.appItem.nb_rating_all_versions});
			}
			
			this.app.emit("app-resize");
			
			// load of reviews must be called explicitly
		},
		
		isInvalidated: function(){
			// summary:
			//		Checks whether the currently displayed data is consistent 
			//		with the info that needs to be displayed by this view.
			
			return this.inherited(arguments) || 
				this.globalRating != this.app.globalRating; // global rating has changed
		}
		
	});
});
