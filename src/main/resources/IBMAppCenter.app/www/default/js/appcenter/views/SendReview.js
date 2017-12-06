
/* JavaScript content from js/appcenter/views/SendReview.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
        "dojo/_base/lang", 
        "dojo/_base/array",
        "dojo/on", 
        "dojo/dom-style",
        "dojo/sniff",
        "dojo/store/Memory",
        "dojo/string",
        "dojo/topic",
        "appcenter/views/utils"], 
    function(
    		lang,
    		arr,
    		on,
    		domStyle,
    		has,
    		Memory, 
    		string,
    		topic,
    		utils){

	return {
		
		
		init: function(){
			
			this.sendButton.on("click", lang.hitch(this, function(){
				utils.hideKeyboard().then(lang.hitch(this, function(){
					this.doSend();
				}));	
			})); 
			
			this.header.set("label", this.nls[has("ios") ? "rateTitleShort" : "rateTitle"]);
		},
		
		doSend: function(){
			
			var message = string.trim(this.message.get("value"));				
			var rating = this.rating.get("value");
			
			if(message == "" || rating == 0){
				utils.showErrorDialog(this.nls.missingCommentOrRating, this.nls.ratingErrorTitle);
			}else{
				this.sendButton.set("disabled", true);
				this.app.sendReview(this.versionItem,						
					rating * 2,
					message,
					lang.hitch(this, function(data){
						this.sendButton.set("disabled", false);
						topic.publish("appcenter/reviewSent", {
							appItem:this.app.appItem,
							version:this.versionItem.version
						});
						this.app.emit("appcenter/popViewFromStack", {});
					}),
					this.app.getErrHandler(null, lang.hitch(this, function(e, message){
						this.sendButton.set("disabled", false);	
						utils.showErrorDialog(message);
					})));
			}
		},
		
		_onSubmit: function(e){
			// stop real submit
			e.stopPropagation();
			e.preventDefault();
			
			utils.hideKeyboard().then(lang.hitch(this, function(){
				this.doSend();
			}));
		},

		beforeActivate: function(){
			
			this.app.logM("Navigation", "INFO", "Navigated to Send Review view");
			
			this.rating.set("value", 0);
			this.message.set("value", "");
			
			if(this.app.appItem.isAppLink ){
				this.versionItem = this.app.appItem;
				this.appLabel.innerHTML = this.versionItem.label;
				this.versionLabel.innerHTML = "";
				this.app.setBackButton(this.header, true);				
				this.app.emit("app-resize");
			}else if(has("ios")){
				this.beforeActivateImpl(this.app.versionItem);
			}else{				
				this.app.getInstalledVersion(this.app.appItem).then(
					lang.hitch(this, this.beforeActivateImpl)
				);
			}
			
													
		},
		
		beforeActivateImpl: function(iVersion){
			var vObj = this.versionItem = iVersion;				
			var vName = this.app.getVersionName(vObj);
			this.appLabel.innerHTML = this.versionItem.label;
			this.versionLabel.innerHTML = string.substitute(this.nls.reviewsVersion, {version:vName});
			
			this.app.setBackButton(this.header, true);
			
			this.app.emit("app-resize");
		}

	};
});
