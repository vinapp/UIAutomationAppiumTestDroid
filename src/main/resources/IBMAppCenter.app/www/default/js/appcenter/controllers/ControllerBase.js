
/* JavaScript content from js/appcenter/controllers/ControllerBase.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define(["dojo/_base/lang", 
        "dojo/_base/declare", 
        "dojo/has",
        "dojo/i18n!appcenter/nls/common", 
        "dojox/app/Controller",
        "dojo/topic",
        "appcenter/views/utils"],
function(lang, declare, has, nls, Controller,topic, utils){

	return declare("appcenter.controllers.ControllerBase", Controller, {

		constructor: function(app, events){			
					
			topic.subscribe("/app/status", lang.hitch(this, function(s){
				if(s == 2){ // STARTED
					
					app.stacks = [];
					
					app.emit("appcenter/createStack", {
						stack:"default",
						target: "Tabs,AppList,Catalog",
						targetLabel: nls.catalogTitle
					});
					
					app.emit("appcenter/createStack", {
						stack:"login",
						target: "Login",
						targetLabel: ""
					});
														
					if(has("ios")){					
						app.emit("appcenter/createStack", {
							stack:"prelogin",
							target: "PreLogin",
							targetLabel: ""
						});
						app.currentStack = "prelogin";
					}else{
						app.currentStack = "login";
					}									
					
					if(!app.initialized){
						app.init();
						app.initialized = true;
					}									
				}
			}));
		},
		
		showTab: function(event){
			var tab = null, label = null;
			
			switch(event.tab){
				case "catalog":
					tab = "Tabs,AppList,Catalog";
					label = nls.catalogTitle;
					break;
				case "favorites":
					tab = "Tabs,AppList,Favorites";
					label = nls.favoritesTab;
					break;
				case "updates":
					tab = "Tabs,AppList,Updates";
					label = nls.updatesTab;
					break;
			}
			this.app.emit("appcenter/createStack", {
				stack: "default",
				target: tab,
				targetLabel: label,
				transition: "none"
			});
			topic.publish("appcenter/currentTabChanged", event.tab);
		},
		
		loginOK: function(event){
			// register device if needed
			this.app.logM("General", "INFO", "Registering device");
			
			this.app.registerDevice().then(				
				lang.hitch(this, this.loginOK_pass2),
				this.app.getErrHandler(null, lang.hitch(this, function(e, message){
					if(e.response.status == 409){
						this.loginOK_pass2();
					}else{
						utils.showErrorDialog(message);
						topic.publish("appcenter/postLoginError");
					}					
				}))
			);
		},
		
		loginOK_pass2: function(){
			// second pass after login OK
			// subscribing/updating push registration
			// check pendingActionOnLoad = external feedback or custom url to show specific app.  
			this.app.logM("General", "INFO", "Set push subscription");
			
        	this.app.setPushUpdatesSubscription(true, 
        		lang.hitch(this, function(){
        			topic.publish("appcenter/invalidateCatalog");
        			if(this.app.pendingActionOnLoad != null){
        				// if a pending action is registered, the catalog must be loaded before 
        				// the default time (when showing the catalog view).
        				// the catalog view is not displayed if the registered action is changing
        				// the default view stack.
        				// At that time the application is in login stack and then will move to 
        				// default view stack in pass 3.
        				var nextPass = lang.hitch(this, this.loginOK_pass3);
        				// will trigger pendingActionOnLoad when catalog is loaded
        				this.app.refreshCatalog(nextPass, nextPass);
        			}else{
        				this.loginOK_pass3();
        			}
        		}), 
        		lang.hitch(this, function(){
        			utils.showErrorDialog(nls.pushNotificationRegistrationError);
					topic.publish("appcenter/postLoginError");
        		}));
		},
		
		loginOK_pass3: function(event){			
			// third pass after correct login
			// [android only] send installed apps to server to synchronize state
			// move to default view stack (default view is catalog).
			this.app.logM("General", "INFO", "Synchronize apps (if available)");
			this.app.synchronizeInstalledApps(lang.hitch(this, function(){
				this.app.logM("General", "INFO", "Show default stack (catalog)");
				this.app.emit("appcenter/switchToStack", {
					stack: "default",
					transition: "fade"});
				}), this.app.getErrHandler(null, lang.hitch(this, function(e, message){
					utils.showErrorDialog(message);
					topic.publish("appcenter/postLoginError");
				}))
			);						
		},			
		
		logout: function(){
			this.app.credentials = null;
			this.app.deleteCredentials();
			topic.publish("appcenter/clearCache");
			this.app.emit("appcenter/switchToStack", {
				stack: "login",
				transition: "fade"
			});
			// overwrite default stack to reset it
			this.app.emit("appcenter/createStack", {
				stack: "default",
				target: "Tabs,AppList,Catalog",
				targetLabel: nls.catalogTitle
			});
		}
	});
});
