
/* JavaScript content from js/appcenter/views/PreLogin.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
        "dojo/_base/lang", 
        "dojo/on", 
        "dojo/topic",
        "appcenter/views/utils",
        "idx/mobile/Launch"], 
    function(
    		lang,
    		on,
    		topic,
    		utils,
    		Launch){

	return {
		
				  
		init: function(){		
			
			topic.subscribe("appcenter/postLoginError", lang.hitch(this, function(){
				// the getCredential was ok, the login also but a subsequent request has failed.
				this.goToLogin(this.loginParams);			
			}));
			
		},			
			
		doLogin: function(loginParams){
			this.loginParams = loginParams;
			this.app.login(loginParams, 
				lang.hitch(this, function(){						
					this.app.credentials = loginParams;											
					this.app.emit("appcenter/loginOK", {view: this});							           
				}), 
				lang.hitch(this, function(e){
					// initialize login view with login params
					delete loginParams.password;
					this.goToLogin(loginParams);
				})
			);
			
			return false;
		},
		
		beforeActivate: function(){
			
			this.app.logM("Navigation", "INFO", "Navigated to PreLogin view");
			if(!this._getCredentialsOngoing){
				this._getCredentialsOngoing = true;
				this.app.getCredentials(
						lang.hitch(this, function(loginParams){
							delete this._getCredentialsOngoing;
							loginParams.ssl = loginParams.https; 
							loginParams.serverURL = "http" + (loginParams.https?"s":"")+"://"+loginParams.server + ":" + loginParams.port + "/" + loginParams.path;
							
							this.doLogin(loginParams);
						}),
						lang.hitch(this, function(){ 
							delete this._getCredentialsOngoing;
							this.goToLogin();
						})
					);
			}
		},
		
		goToLogin: function(loginParams){
						
			this.app.emit("appcenter/switchToStack", {
				stack: "login",
				transition: "fade",
				data: loginParams}
			);			
		}
		
	};

});
