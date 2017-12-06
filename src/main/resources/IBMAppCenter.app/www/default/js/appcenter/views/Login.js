
/* JavaScript content from js/appcenter/views/Login.js in folder common */
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
        "dojo/string",
        "dojo/topic",
        "appcenter/views/utils",
        "dojo/has!ios?idx/mobile/Launch"], 
    function(
    		lang,
    		arr,
    		on,
    		domStyle,
    		has,
    		string,
    		topic,
    		utils,
    		Launch){

	return {
		
		localStorageEnabled: window.localStorage && window.localStorage.getItem,
				  
		init: function(){
			
			topic.subscribe("appcenter/postLoginError", lang.hitch(this, function(){
				this._loginOngoing = false;
				utils.showProgressIndicator(false);
				this.disableForm(false);
			}));
			
			this.header.set("label", this.nls[this.app.isTablet?"tabletAppcenterTitle":"appcenterTitle"]);
			
			if (this.settingsSSL){
				this.settingsSSL.set("leftLabel", this.nls.sslSwitchOn);
				this.settingsSSL.set("rightLabel", this.nls.sslSwitchOff);
			}
			
			this.storageWidgets = {
					"_loginKey": this.userId,
					"_serverKey": this.serverName, 
					"_portKey": this.serverPort, 
					"_contextKey": this.serverContext 
			};
		    		
			var self = this;
			this.loginButton.on("click", function(e){			
				utils.hideKeyboard().then(function(){
					self.doLogin();
				});
			});	
								
			var showServer = this.app.appConfig == null || this.app.appConfig.url == null || this.app.appConfig.url == ""; 
			domStyle.setD(this.serverPane.domNode, showServer ? "block" : "none");
			
			var versionLabel = "";
			var v;
			if(window.hasOwnProperty("WL")){
				v = WL.Client.getAppProperty("APP_VERSION");
				this.app.logM("General", "INFO", "Version of AppCenter mobile client: " + v);
				versionLabel += v;
			}
			if(window.hasOwnProperty("dojo")){
				v = dojo.version.major + "." + dojo.version.minor + "." + dojo.version.patch + dojo.version.flag;
				this.app.logM("General", "INFO", "Version of Dojo: " + v);
				versionLabel += "-d" + v;	
			}
			if(window.hasOwnProperty("device")){
				v = device.cordova;
				this.app.logM("General", "INFO", "Version of Cordova: " + v);
				versionLabel += "-c" + v;
			}					
			this.versionNode.innerHTML = string.substitute(this.nls.detailsVersion, {version: versionLabel});
		},	
		
		_onSubmit: function(e){
			// stop real submit
			e.stopPropagation();
			e.preventDefault();
			var self = this;
			utils.hideKeyboard().then(function(){
				self.doLogin();
			});
		},
		
		doLogin: function(){
			
			if(this._loginOngoing){
				return;
			}
			
			this._loginOngoing = true;
								
			var serverURL = null;
			var ssl = has("ios") ? true : this.settingsSSL.get("value") == "on";
			var sslSet = ssl;
			
			var server = null;
			var useConfig = true;
			
			if(this.app.appConfig != undefined){
				var curl = this.app.appConfig.url;
				serverURL = curl == "" || curl == null ? null : this.app.appConfig.url;
				if(!sslSet){
					ssl = this.app.appConfig.ssl == undefined ? false : this.app.appConfig.ssl;
					this.settingsSSL.set("value", ssl ? "on" : "off");
				}
			}
			
			if(!serverURL){
				useConfig = false;
				
				server = serverURL = this.serverName.get("value");
				
				if(!this.app.isTablet){
					var port = this.serverPort.get("value");
					if(port != ""){
						serverURL += ":" + port;
					}
					var ctx = this.serverContext.get("value");
					if(ctx != ""){
						serverURL += "/" + ctx;
					}
				}
			}
			
			var loginParams = {
					username: this.userId.get("value"),
					password: this.password.get("value"),
					serverURL: serverURL,
					ssl: ssl 
			};					
			
			
			var missing = [];
			if(!loginParams.username){
				missing.push(this.nls.missingLogin);					
			}
			if(!loginParams.password){
				missing.push(this.nls.missingPassword);
			}
			
			if(this.app.isTablet && !loginParams.serverURL){
				missing.push(this.nls.missingServerUrl);
			}else if(!useConfig && !server){
				missing.push(this.nls.missingServer);					
			}
					
			if(missing.length > 0){
				var msg = this.nls.missingInfo;
				msg += "<ul style='text-align:left'>";
				arr.forEach(missing, function(e){
					msg += "<li>" + e + "</li>";							
				});
				msg += "</ul>";
				utils.showErrorDialog(msg, this.nls.loginErrorTitle, null, null, "left");
				this._loginOngoing = false;
				return;
			}
			
			var result = utils.parse_url.exec(loginParams.serverURL);
            if (!result){
            	utils.showErrorDialog(this.nls.invalidServerUrl);
            	return;
            }
            
            var scheme_opt = result[1];
            server = result[2];
            var context = result[3];
           
            if (scheme_opt){
            	var schemeSSL = has("ios") ? true : result[1].toLowerCase() === "https";
            	loginParams.ssl = schemeSSL;
            	if (this.settingsSSL)
            		this.settingsSSL.set("value", schemeSSL ? "on" : "off");
            }
            
            if (has("ios"))
            	loginParams.ssl = true;
            
            var scheme = loginParams.ssl?"https://":"http://";
            
            loginParams.serverURL = scheme + server + "/" + (context == undefined ? "" : context);
            
			this.disableForm(true);
			utils.showProgressIndicator(true);
            					
			this.app.login(loginParams, 
				lang.hitch(this, function(){						
					this.app.credentials = loginParams;
					
					// save config to local store
					if(!useConfig && this.localStorageEnabled){				
						for(var key in this.storageWidgets){
							if(this.storageWidgets[key]){
								window.localStorage[key] = this.storageWidgets[key].get("value");
							}
			        	}     		        		        
			        }
					
					this.password.set("value", "");						
					this.app.emit("appcenter/loginOK", {view: this});							           
				}), 
				this.app.getErrHandler(null, lang.hitch(this, function(e, message){									
					this._loginOngoing = false;
					utils.showProgressIndicator(false);
					this.disableForm(false);		
					utils.showErrorDialog(message);
				}))
			);
			
			return false;
		},
		
		disableForm: function(value){
			this.loginButton.set("disabled", value);
			this.userId.set("disabled", value);
			this.password.set("disabled", value);
			if (this.settingsSSL)
				this.settingsSSL.set("disabled", value);		
			this.serverName.set("disabled", value);
			if(!this.app.isTablet){
				this.serverPort.set("disabled", value);			
				this.serverContext.set("disabled", value);
			}
		},
		
		beforeActivate: function(previous, data){
			
			this.app.logM("Navigation", "INFO", "Navigated to Login view");
			
			if(Launch && Launch.domNode){
				Launch.hide();
			}
						
			this.disableForm(false);
			
			if(data){
								
				this.userId.set("value", data.username);	
				if (this.settingsSSL)
					this.settingsSSL.set("value", data.https);		
				
				if(this.app.isTablet){
					this.serverName.set("value", data.serverURL);					
				}else{
					this.serverName.set("value", data.server);
					this.serverPort.set("value", data.port);			
					this.serverContext.set("value", data.path);
				}
				return;
			}
			
			if(this.app.appConfig != undefined){				
				if(this.app.appConfig.url == "" || this.app.appConfig.url == null){
					var defaultPort = this.app.appConfig.defaultPort;
					if(defaultPort && !this.app.isTablet){
						this.serverPort.set("value", defaultPort);
					}
					var defaultContext = this.app.appConfig.defaultContext;
					if(defaultContext  && !this.app.isTablet){
						this.serverContext.set("value", defaultContext);
					}
				}else{
					this.serverName.set("required", false);
					if(!this.app.isTablet){
						this.serverPort.set("required", false);			
						this.serverContext.set("required", false);
					}									
				}
			}					
			
			// load from local storage is possible
        	if(this.localStorageEnabled){
        		for(var key in this.storageWidgets){
        			var value = window.localStorage[key];
            		if(value && this.storageWidgets[key] != undefined){
            			this.storageWidgets[key].set("value", value);        		
            		}
        		}        		
        	}
		},
		
		afterDeactivate: function(){
			this._loginOngoing = false;
			this.disableForm(false);
		}
	};

});
