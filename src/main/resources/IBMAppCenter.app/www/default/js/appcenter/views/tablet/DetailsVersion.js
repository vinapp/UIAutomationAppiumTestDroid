
/* JavaScript content from js/appcenter/views/tablet/DetailsVersion.js in folder common */
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
        "dojo/store/Memory",
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
    		Memory,
    		topic,
    		DetailsBase,
    		utils){

	return declare("appcenter.views.tablet.DetailsVersion", DetailsBase, {
				
		init: function(){
			
			this.inherited(arguments);
			
			domClass.add(this.rateDialog.domNode, "mblAddReviewDialog");

			if(this.selectVersionButton){
				this.selectVersionButton.on("click", lang.hitch(this, function(evt){
					this.app.updateVersionList(this.versionHistoryList, lang.hitch(this, function(vData){
						var h = Math.min(vData.length * 44, 300);
						this.scrollablePane.set("height", h+"px");
						this.scrollablePane.resize();
						this.actionSheet.show(this.selectVersionButton.domNode, ['below-centered']);
					}));										
				}));
			}
					
			if(this.versionHistoryList){
				this.versionHistoryList.on("itemClick", lang.hitch(this, function(item){
					this.actionSheet.hide();
					this.app.versionItem = item.rawItem;				
					this.app.getAppInfo(this.app.versionItem, null, lang.hitch(this, function(data){
						this.versionItem = this.app.versionItem;					
						this.updateDetails();
						this.updateInstallButton();
						this.updateReviewsButton();
						this.updateDescription();
						this.app.emit("app-resize");
						topic.publish("appcenter/appInfoLoaded");					
					}));																								
				}));
			}
			this.descriptionButton.on("click", lang.hitch(this, function(evt){
				if(this.appItem.isAppLink){
					this.app.emit("appcenter/showAppLinkDescription");
				}else{
					this.app.emit("appcenter/showDescription");
				}
			}));
			
			this.reviewsButton.on("click", lang.hitch(this, function(evt){
				if(this.appItem.isAppLink){
					this.app.emit("appcenter/showAppLinkReviews");
				}else{
					this.app.emit("appcenter/showReviews");
				}
			}));
			
			if(this.allReviewsButton){
				this.allReviewsButton.on("click", lang.hitch(this, function(evt){
					this.app.emit("appcenter/showAllReviews");
				}));
			}
						
			this.addReviewButton.on("click", lang.hitch(this, function(evt){
				if(this.appItem.isAppLink || has("ios")){
					this.ratingDialog.set("value", 0);
					this.ratingDialogMessage.set("value", "");
					this.rateDialog.show();
				}else{
					this.app.getInstalledVersion(this.appItem).then(
						lang.hitch(this, function(iVersion){
							if(iVersion && iVersion.version == this.versionItem.version){				
								this.ratingDialog.set("value", 0);
								this.ratingDialogMessage.set("value", "");
								this.rateDialog.show();
							}else{
								utils.showErrorDialog(this.nls.mustInstallAppToRate, this.nls.warningDialogTitle);
							}
						}));
				}
							
			}));
								
			this.sendButton.on("click", lang.hitch(this, function(){
				utils.hideKeyboard().then(lang.hitch(this, function(){
					this.doSend();
				}));	
			}));		
			
			topic.subscribe("appcenter/app-resize", lang.hitch(this,function(event){
				if(domStyle.get(this.rateDialog.domNode, "display") != "none"){
					this.rateDialog.refresh();
				}										
			}));
						
			topic.subscribe("appcenter/reviewSent", lang.hitch(this, function(e){				
				if(this.viewShowing){
					if(this.versionItem){
						this.app.invalidateAppInfo(this.versionItem);
					}
					this.reviewsInvalidated = true;
				}
			}));
			
			topic.subscribe("appcenter/details/updateTabButton", lang.hitch(this, function(button){
				if(this.viewShowing){
					this[button+"Button"].set("selected", true);
				}
			}));
		},			
		
		_onSubmit: function(e){
			// stop real submit
			e.stopPropagation();
			e.preventDefault();
			
			utils.hideKeyboard().then(function(){
				self.doSend();
			});
		},
		
		
		
		doSend: function(){
			if(this.appItem.isAppLink || has("ios")){
				this.doSendImpl();
			}else{
				this.app.getInstalledVersion(this.appItem).then(
					lang.hitch(this, function(iVersion){
						if(!iVersion){
							this.rateDialog.hide();
							return;
						}
						this.doSendImpl(iVersion);
						
					})
				);
			}
		},
		
		doSendImpl: function(iVersion){
			var message = string.trim(this.ratingDialogMessage.get("value"));				
			var rating = this.ratingDialog.get("value");
			if(message == "" || rating == 0){
				this.rateDialog.hide();
				setTimeout(lang.hitch(this, function(){
					utils.showErrorDialog(this.nls.missingCommentOrRating, this.nls.ratingErrorTitle, lang.hitch(this, function(){
						this.rateDialog.show();
					}));
				}), 100);				
			}else{
				this.sendButton.set("disabled", true);
				this.app.sendReview(iVersion ? iVersion : (this.appItem.isAppLink ? this.appItem : this.app.versionItem),						
					rating * 2,
					message,
					lang.hitch(this, function(data){
						this.sendButton.set("disabled", false);
						this.rateDialog.hide();
						this.app.invalidateAppInfo(this.versionItem);
						this.invalidated = true;
						this.refreshData(lang.hitch(this, function(){
							this.app.emit(this.appItem.isAppLink ? "appcenter/showAppLinkReviews" : "appcenter/showReviews");
						}));
						this.reviewsButton.set("selected", true);
						utils.showToaster(this.nls.reviewSentConfirmation);
						topic.publish("appcenter/reviewSent", {
							appItem: this.app.appItem,
							versionItem: iVersion ? iVersion.version : this.app.appItem.version 
						});
					}),
					this.app.getErrHandler(null, lang.hitch(this, function(e){
						this.sendButton.set("disabled", false);							
					}, this.nls.ratingErrorTitle)));
			}
		},
		
		onAppInfoLoaded: function(vItem){
			this.reviewsInvalidated = false;
			this.updateDetails();
			this.updateInstallButton();
			this.updateReviewsButton();
			this.updateDescription();
			if(!this.appItem.isAppLink){
				var showPreviousVersions = this.appItem.versions && this.appItem.versions.length > 1 && this.app.appConfig.showPreviousVersions;
				domStyle.setD(this.selectVersionButton, showPreviousVersions ? "block" : "none");
			}
			topic.publish("appcenter/appInfoLoaded");
			this.app.emit("app-resize");		
		},
	
		onNativeUpdate: function(){
			this.updateInstallButton();
			this.updateReviewsButton();
		},
	
		resetView: function(){
			
			this.icon.src = utils.defaultAppIcon;
			this.label.innerHTML = this.nls.applicationName;	
			if(this.versionLabel){
				this.versionLabel.innerHTML = "";
				this.internalVersionLabel.innerHTML = "";
			}
			this.updatedLabel.innerHTML = "";
			this.rating.set("value", 0);			
			this.nbRating.innerHTML = string.substitute(this.nls.detailsRating, {nb_rating: 0});
			if(this.sizeLabel){
				this.sizeLabel.innerHTML = utils.getSizeString(0);
			}
			this.updateInstallButton(true);
			this.app.emit("app-resize");
		},
					
		updateReviewsButton: function(){
			if(!this.appItem.isAppLink){			
				if(has("ios")){
					this.updateReviewsButtonImpl(this.app.versionItem);
				}else{
					this.app.getInstalledVersion(this.appItem).then(
						lang.hitch(this, this.updateReviewsButtonImpl));
				}
			}
		},
		
		updateReviewsButtonImpl: function(iVersion){
			var vName = this.app.getVersionName(this.app.versionItem);
			var vLabel = string.substitute(this.nls.reviewsSegment, {version:vName});
			// longer translated part is in French: 21 chars without the version
			// so we allow 21 char + 4 chars for the version
			if(vLabel.length > 25){
				// must truncate the version name and replace again as on the languages
				// the version is before the text and not after...
				var shortVName = vName.substring(0, 4) + "&hellip;";
				vLabel = string.substitute(this.nls.reviewsSegment, {version:shortVName}); 
			}
			
			this.reviewsButton.set('label', vLabel);
						
			if(iVersion){
				var iName = this.app.getVersionName(iVersion);
				var vLabel = string.substitute(this.nls.rateInstalled, {version:iName});
				this.rateDialogVersionLabel.innerHTML = vLabel;
			}
		},
		
		updateDescription: function(reset){
			var str = "";
			if(!reset){
				var item = this.app.appItem.isAppLink ? this.app.appItem : this.app.versionItem;
				str = utils.getDescription(item);
			}
			topic.publish("appcenter/updateDescription", str); 					
		}
		

	});
});
