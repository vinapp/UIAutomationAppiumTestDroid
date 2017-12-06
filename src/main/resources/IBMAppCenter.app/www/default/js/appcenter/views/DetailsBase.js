
/* JavaScript content from js/appcenter/views/DetailsBase.js in folder common */
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
        "dojo/sniff",
        "dojo/promise/all",
        "dojox/app/View",
        "appcenter/views/utils",
        "dojo/has!ios?idx/mobile/Launch"],
    function(
    		declare,
    		lang,
    		arr,
    		on,
    		topic,
    		string,
    		domStyle,
    		domClass,
    		has,
    		all,
    		View,
    		utils,
    		Launch){

	return declare("appcenter.views.DetailsBase", View, {
		
		nlsVersion: "detailsVersion",
		
		installApplication: function(){
						
			this.app.installApplication(this.versionItem, this.versionItem.version, 
				null,				
				this.app.getErrHandler(null, lang.hitch(this, function(e, message){					
					if(e && e != this.app.NON_MARKET_DIS){
						utils.showErrorDialog(message);
					}
					this.updateInstallButton();
				}))
			);
			if(this.app.useOneTimeURL){
				// create a new one time URL at next install
				this.versionItem.timestamp = new Date();			
			}
			
		},
				
		init: function(){
								
			if(this.installButton){
				this.installButton.on("click", lang.hitch(this, function(evt){				
					if(this.app.appItem){
						// check the one time url & install
						this.invalidated = !this.app.isVersionItemValid(this.versionItem);
						if(this.invalidated){
							this.refreshData(lang.hitch(this, this.installApplication));
						}else{
							this.installApplication();
						}
					}				
				}));
			}
			
			if(this.uninstallButton){
				this.uninstallButton.on("click", lang.hitch(this, function(evt){
					var item = this.app.appItem;
					if(item){
						this.app.getInstalledVersion(this.appItem).then(
							lang.hitch(this, function(versionItem){
								if(versionItem != null){						
									this.app.uninstallApplication(item, versionItem.version, 
										lang.hitch(this, function(e){
											this.updateInstallButton();
										}), 
										lang.hitch(this, function(e){								
											this.updateInstallButton();
										}));																
								}
							})
						); 
						
					}
				}));
			}
			
			if(this.cancelButton){
				this.cancelButton.on("click", lang.hitch(this, function(evt){
					var item = this.app.appItem;
					if(item){					
						this.app.cancelApplication(item);					
					}
				}));
				if(this.cancelBtnLabel){
					this.cancelButton.focusNode = this.cancelBtnLabel;
				}
			}
			
			this.favButton.on("click", lang.hitch(this, function(e){
				
				var item = this.app.appItem;
				var fav = this.app.isFavorite(item);
				this.favButton.set("disabled", true);
				utils.showProgressIndicator(true);
				this.app.setFavorite(item, !fav, 
					lang.hitch(this, function(){
						this.favButton.set("disabled", false);
						var isFav =  this.app.isFavorite(item);
						this.favButton.set("selected", isFav);
						domStyle.setD(this.favIndicator, isFav?"block":"none");
						utils.showToaster(this.nls[!fav?"applicationFavorite":"applicationNotFavorite"]);
					}), 
					this.app.getErrHandler(null, lang.hitch(this, function(e, message){					
						this.favButton.set("disabled", false);
						this.favButton.set("selected", this.app.isFavorite(item));
						utils.showErrorDialog(message);
					})));					
			}));
			
			topic.subscribe("appcenter/nativeUpdate", lang.hitch(this, function(){
				if(this.viewShowing && this.appItem){
					this.onNativeUpdate();
				}
			}));

			topic.subscribe("appcenter/clearCache", lang.hitch(this, function(e){				
				this.appItem = null;
				this.versionItem = null;
				this.resetView();
			}));
			
			topic.subscribe("appcenter/invalidateDetails", lang.hitch(this, function(e){				
				this.appItem = null;
				this.versionItem = null;
				this.resetView();
			}));
		},			
		
		beforeActivate: function(){
			
			this.app.logM("Navigation", "INFO", "Navigated to Details");
			
			var item = this.app.appItem;
			var oldItem = this.appItem;
								
			this.favButton.set("selected", item ? this.app.isFavorite(item) : false);
												
			this.app.setBackButton(this.header);
			
			this.invalidated = this.isInvalidated();				
			
			if(this.invalidated){
											
				this.appItem = item;
				
				if(this.appItem.isAppLink){
					this.versionItem = this.appItem;
				}else{
					this.versionItem = this.app.versionItem;					
				}							
				
				if(this.app.isAppInfoInCache(this.versionItem)){
					
					// info is already there, update UI directly.
					this.refreshData();
					
				}else{
					
					// we are showing a different app, show the info we already have
					// the rest will be updated when in the afterActivate
					if(!oldItem || oldItem && oldItem.pkg != this.app.appItem.pkg){
						this.app.ios7ScrollWA(this.container);
						
						this.updateDetails(true);
						this.updateInstallButton(true);
						this.updateDescription(true);
					}
					
					utils.showProgressIndicator(true);
				}
			}else{
				this.app.ios7ScrollWA(this.container);
				
				this.updateInstallButton();
				this.updateListItems();
				this.updateDescription();
			}
		},
		
		afterActivate: function(current, data){
			if(Launch && Launch.domNode){
				Launch.hide();
			}
			
			this.reviewsInvalidated = this.reviewsInvalidated || data && data.action == "reviewsInvalidated";
			if(data && data.action){
				delete data.action; // consume action
			}			

			if(this.reviewsInvalidated){
				if(!this.app.isTablet){
					utils.showToaster(this.nls.reviewSentConfirmation);
				}
				this.reviewsInvalidated = false;
			}

			this.refreshData();
		},
		
					
		updateInstallButton: function(reset){
										
			if(reset){
				
				domStyle.hide(this.installIndicator);				
				domStyle.hide(this.uninstallButton);				
				domStyle.hide(this.cancelButton);
				this.installButton.set("label", this.nls.install);
				domClass.add(this.installButton.domNode, "padded1Button");
				domStyle.setD(this.installButton, "inline-block");
				this.installButton.set("disabled", true);
				return;
			}
			
			if(this.app.appItem){
				
				var isFav = this.app.isFavorite(this.appItem);
				this.favButton.set("selected", isFav);
				domStyle.setD(this.favIndicator, isFav?"block":"none");
														
				if(has("ios")){
					// on iOS, the status of the application is not available: show only install button
					domClass.add(this.installButton.domNode, "padded1Button");
					domStyle.setD(this.installButton, "inline-block");
					this.installButton.set("disabled", false);
					this.app.emit("app-resize");
					return;
				} 
				
				all([
				     this.app.getInstalledVersion(this.appItem),
				     this.app.getPendingOperation(this.appItem)
				 ]).then(
					lang.hitch(this, function(results){
						 this.updateInstallButtonImpl(results[0], results[1]);
						 
					 })
				 );													
			}
		},		
		
		updateInstallButtonImpl: function(iVersion, pendingOp){
			var installed = iVersion != null;
			
			var isVersionOlderThanInstalled = installed && parseFloat(this.versionItem.version) < parseFloat(iVersion.version);
			var currentVersion = installed && this.versionItem.version == iVersion.version;
										
			domStyle.setD(this.installIndicator, pendingOp==null?"none":"block");
			
			var showUninstall = installed && pendingOp == null && !has("WindowsPhone");
			var showInstall = (!installed || !currentVersion || has("WindowsPhone") && currentVersion) && pendingOp == null;
			var showCancel = pendingOp != null;			
						
			var m;
			if(installed){
				if(has("WindowsPhone") && currentVersion){
					m = this.nls.reInstall;
				}else if(isVersionOlderThanInstalled){
					m = this.nls.revert;
					if(!this.app.appConfig.allowDowngrade){
						showInstall = false;
					}
				}else{
					m = this.nls.update;
				}
			}else{
				m = this.nls.install;
			}
			this.installButton.set("label", m);
			this.installButton.set("disabled", false);
								
			switch(pendingOp){
				case "installStarted":
					m = "installStarted";
				case "install":						
					m = has("WindowsPhone") ? "installing" : "cancelInstall";
					break;
				case "download":
					m = "cancelInstall";
					break;
				default:
					m = "cancelUninstall"; 						
			}
			m = this.nls[m];
							
			this.cancelButton.set("label", m);
			this.cancelButton.set("disabled", has("WindowsPhone") && (pendingOp == "installStarted" || pendingOp == "install"));
																	
			domStyle.setD(this.uninstallButton, showUninstall ? "inline-block" : "none");
			domStyle.setD(this.installButton, showInstall ? "inline-block" : "none");
			domStyle.setD(this.cancelButton, showCancel ? "inline-block" : "none");
			
			domClass[showUninstall&&!showInstall ? "add" : "remove"](this.uninstallButton.domNode, "padded1Button");
			domClass[!showUninstall&&showInstall ? "add" : "remove"](this.installButton.domNode, "padded1Button");
			
			this.app.emit("app-resize");
		},
				
		updateDetails: function(partial){			
			this.icon.src = this.appItem.icon;
			this.label.innerHTML = this.appItem.label;
			var sub = string.substitute;
			var isAppLink = this.appItem.isAppLink;
			var showRating = !isAppLink || isAppLink && this.app.appConfig.allowAppLinkReview;
			domStyle.setD(this.nbRating.parentNode, showRating ? "block" : "none");			
			
			if(!isAppLink){
				if(app.appConfig.showInternalVersion){
					domStyle.setD(this.versionLabel, this.versionItem.versionName == ""?"none":"block");
					if(this.versionItem.versionName != ""){							
						this.versionLabel.innerHTML = sub(this.nls.detailsVersion, {version:this.versionItem.versionName});
					}
					this.internalVersionLabel.innerHTML = sub(this.nls.detailsInternalVersion, {version:this.versionItem.version});
				}else{
					domStyle.hide(this.internalVersionLabel);
					var v = this.app.getVersionName(this.versionItem);
					this.versionLabel.innerHTML = sub(this.nls.detailsVersion, {version:v});
				}
			}
			
			if(partial){
				this.updatedLabel.innerHTML = sub(this.nls.detailsUpdatedOn, {date:""});
				if(showRating){
					this.rating.set("value", 0);
					this.nbRating.innerHTML = sub(this.nls.detailsRating, {nb_rating: 0});
				}
				
				if(!this.appItem.isAppLink){
					this.sizeLabel.innerHTML = utils.getSizeString(0);
				}
			}else{
				var f = lang.hitch(this, function(s){
					this.updatedLabel.innerHTML = sub(this.nls.detailsUpdatedOn, {date:s});
				});
				utils.formatDate(this.versionItem.updated, {selector:"date"}).then(f, f);
								
				if(showRating){
					this.rating.set("value", this.versionItem.avg_rating/2);
					this.nbRating.innerHTML = sub(this.nls.detailsRating, {nb_rating: this.versionItem.nb_rating});
				}
				
				if(!this.appItem.isAppLink){
					var filter = arr.filter(this.versionItem.url, lang.hitch(this, function(o){
						return utils.isExecutable(o);
					}));
						
					var size = filter == null ? 0 : filter[0].size;
					utils.getSizeString(size, true).then(lang.hitch(this, function(s){
						this.sizeLabel.innerHTML = s;
					}));
					
				}
			}
		},
		
		updateDescription: function(reset){			
			this.description.innerHTML = reset ? this.nls.noDescription : utils.getDescription(this.versionItem); 					
		},
		
		updateListItems: function(){},
		
		resetView: function(){
			
			this.app.ios7ScrollWA(this.container);
			
			if(this.appItem){
				this.updateDetails(true);
				return;
			}
			
			this.icon.src = utils.defaultAppIcon;
			this.label.innerHTML = this.nls.applicationName;
			if(this.versionLabel){
				this.versionLabel.innerHTML = "";
			}
			this.updatedLabel.innerHTML = "";
			this.rating.set("value", 0);			
			this.nbRating.innerHTML = string.substitute(this.nls.detailsRating, {nb_rating: 0});
			if(this.sizeLabel){
				this.sizeLabel.innerHTML = utils.getSizeString(0);
			}
			this.updateDescription(true);
			this.updateListItems(true);			
			this.updateInstallButton(true);
			
		},
		
		refreshData: function(handler){					
			
			if(this.invalidated){
				
				this.invalidated = false;
				
				if(this.reviewsInvalidated){
					this.app.invalidateAppInfo(this.versionItem);
				}
				this.app.getAppInfo(this.versionItem, null, 
					lang.hitch(this, function(vItem){
						this.onAppInfoLoaded(vItem);
						if(handler){
							handler(vItem);
						}
					}),
					app.getErrHandler(null, lang.hitch(this, function(e, message){
						if(e.response.status == 404){
							utils.showErrorDialog(this.nls.errorDeletedApp, null, lang.hitch(this, function(){
								topic.publish("appcenter/invalidateCatalog");
								this.app.emit("appcenter/popViewFromStack", {});
							}), this.nls.goToCatalog);
						}else{
							this.resetView();
							utils.showErrorDialog(message);
						}

					}))
				);																								
			}
		},
		
		isInvalidated: function(){
			return !this.appItem || this.appItem.pkg != this.app.appItem.pkg || 
			this.versionItem.version != this.app.versionItem.version || 
			this.reviewsInvalidated || !this.app.isVersionItemValid(this.app.versionItem);
		}
	});
});
