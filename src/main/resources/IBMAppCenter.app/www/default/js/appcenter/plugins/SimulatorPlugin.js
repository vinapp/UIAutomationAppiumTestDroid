
/* JavaScript content from js/appcenter/plugins/SimulatorPlugin.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
 
define(["dojo/_base/lang", 
        "dojo/_base/array", 
        "dojo/dom-class", 
        "appcenter/widgets/DataProxy", 
        "appcenter/views/utils",
        "dojo/json", 
        "dojo/Deferred",
        "dojo/has"], 
     function(
    		 lang, 
    		 arr,
    		 domClass,
    		 dataProxy, 
    		 utils,
    		 JSON, 
    		 Deferred,
    		 has){
	
    lang.getObject("com.ibm.appcenter.SimulatorPlugin", true);
    
    var INIT_COMPLETE                  = "INIT_COMPLETE";
    var APPLICATION_LIST_UPDATE        = "APPLICATION_LIST_UPDATE";
    var APPLICATION_FEEDBACK_REQUEST   = "FEEDBACK_REQUEST";
    var HANDLE_OPEN_CUSTOM_URL         = "HANDLE_OPEN_CUSTOM_URL";
    
    var os = null;
    function getCurrentOs() {
    	if (os == null) {
    		if(has("WindowsPhone"))
				os = "WindowsPhone";
    		else if(has("android"))
				os = "Android";
    		else
    			os = "iOS";
    		}
    	return os;
    }
    
    function _alertError(msg) {
        /** @ignore */
        console.log("Error occured: " + msg);
        navigator.notification.alert(
                msg,  // message
                new function() {},      // no callback
                'Error',                // title
                null                    // buttonName, use defaults
            );
    }

    appcenter.NativePlugin = {

        available: false,
        
        DPI: {
        	DENSITY_LOW 	: 0,
            DENSITY_MEDIUM 	: 1,
            DENSITY_HIGH 	: 2,
            DENSITY_XHIGH  	: 3
        },
                       
        ERROR_CODE: {
        	NON_MARKET_DIS  : "INSTALL_NON_MARKET_APPS_DISABLED",
            CONFIG_FAIL     : -4,
            FAIL      		: -3,
            SECURITY_FAIL   : -2,
            CONNECT_FAIL    : -1,
            SERVER_FAIL 	: 0
        },
        
        APPLICATION_STATUS: {
        	INSTALLED 			: 0,
            INSTALL_INPROGRESS  : 1,
            NOT_INSTALLED 		: 2,
            UNINSTALL_INPROGRESS: 3,
            DOWNLOAD_INPROGRESS	: 4,
            INSTALL_STARTED     : 5
        },        
            
        _installTimers: {},                                    
        _installInprogressTasks: {},
        _removeInprogressTasks: {},        
        
        nlsBundle: null,
        
        init: function(pNlsbundle,
                       iconUpdateCallback, 
                       applicationsUpdateCallback,
                       inprogressUpdateCallback,
                       cancelUpdateCallback,
                       feedbackRequestCallback,
                       handleOpenCustomURLCallback,
                       deviceID) {
            
            this.app.logM("CordovaPlugin", "INFO", "Initialize plugin");
                       
            this.nlsBundle = pNlsbundle;
            
            var me = this;
            this._init(deviceID,         
                       function(info) { 
                           
                           this.app.logM("CordovaPlugin", "INFO", "Plugin callback action: " + info.action);
                           
                           if (info.action  == INIT_COMPLETE) {
                               me.available = true;
                               me._installedAppsMap = {};
                               me._inprogressAppsMap = {};
                               
                               me.restoreInstalledList();
                                                              
                               me._deserializeTaskMap(window.localStorage[me._installationKey], me._installInprogressTasks);
                               me._deserializeTaskMap(window.localStorage[me._uninstallationKey], me._uninstallInprogressTasks);		
                               
                               if (typeof initCompleteCallback === "function") {
                                   initCompleteCallback(info);
                               }                                                             
                               
                           } else if (info.action == APPLICATION_LIST_UPDATE && 
                                      typeof applicationsUpdateCallback === "function") {
                                                                                            
                               me._updateTasks();

                               applicationsUpdateCallback();
                                                      
                           } else if (info.action == APPLICATION_FEEDBACK_REQUEST   && 
                                        typeof feedbackRequestCallback === "function") {
                               
                               this.app.logM("CordovaPlugin", "INFO", "Feedback Request Callback:[pkg, version, stars, comment]=[" +
                                           info.pkg + ","  + info.version + info.stars + ","  + info.comment + "]");
                               
                               // Assure we are not going to block the native thread!
                               setTimeout(function () {
                                   feedbackRequestCallback(info.pkg, info.version, info.stars, info.comment);
                               }, 0);                        
                           } else if (info.action == HANDLE_OPEN_CUSTOM_URL   && 
   		                        typeof handleOpenCustomURLCallback === "function") {
                   			
                   			this.app.logM("CordovaPlugin", "INFO", "Handle Open Custom URL:[url]=[" +
                                       info.url + "]");
                           
                   			// Assure we are not going to block the native thread!
                   			setTimeout(function () {
                   				handleOpenCustomURLCallback(info.url);
                   			}, 0);                        
                   		}     
                       },
                       function(e) {                           
                           this.app.logM("CordovaPlugin", "ERROR", "Error during initialization of Cordova plugin");
                           _alertError( me.nlsBundle.initInstallerError.replace("%1",e) );  
                       }); 
        },            
        
        /**
         * Updated the saved information with new one
         * @ignore 
         */
        _init: function(pDeviceID, successCallback, failureCallback) {
            
            this._pluginSuccessCallback = successCallback;
            this._pluginErrorCallback = failureCallback;                             
            
            this.sendApplicationUpdate();
            
            successCallback({
            	action: INIT_COMPLETE
            });
            
            return true;
        },


        /**
         * Get the unique secure ID of this device
         * @ignore 
         */
		getDeviceId: function() {
            
			this.isInstalledAppsAccurate = true;
			var os = getCurrentOs();
			var deviceId = "dummyDeviceId-android"; 
			if(os == "iOS"){
				deviceId = "dummyDeviceId-ios";
				this.app.isInstalledAppsAccurate = false;
			} else if(os == "WindowsPhone"){
				deviceId = "dummyDeviceId-winp8";
			}
			dataProxy.os = os;
            return deviceId;
        },
        
		getDevice: function(){ // Simulator use case
			
			var os = getCurrentOs();
			
			if(os == "Android"){
				return {
					device_id: this.getDeviceId(),
					nickname: "Fake Galaxy SIII",
					maker: "Samsung",
					model: "Galaxy S3",
					os: "Android",
					os_description: "4.2.1",
					os_version: "16"
				};
			} else if(os == "WindowsPhone"){
				return {
					device_id: this.getDeviceId(),
					nickname: "Fake Nokia Lumia 1020",
					maker: "Nokia",
					model: "Lumia 1020",
					os: "WindowsPhone",
					os_description: "8.0",
					os_version: "8.0"
				};
			}
			return {
				device_id: this.getDeviceId(),
				maker: "Apple",
				nickname: "Fake IPhone 5",
				model: "IPhone 5",
				os: "iOS",
				os_description: "6.1 (10B141)",
				family:"iphone",
				os_version: "6.1 (10B141)"
			};
		},

        /**
         * Download and Install application
         * @ignore 
         */
        installApplication: function(pApp, successCallback, failureCallback) {
        	this.app.logM("CordovaPlugin", "INFO", "Request installation of app pkg:" + pApp.pkg + " version:" + pApp.version);
                
            if(this._installInprogressTasks[pApp.pkg] != null){
            	return false; // already an install task for this app
            }            
            
            var installApp = lang.mixin({}, pApp);
            installApp.task_uid = this._installInprogressTasks[pApp.pkg] = this.generateTaskUID(pApp);
                                           
            var me = this;
            
            me._inprogressAppsMap[pApp.pkg] = "installStarted";
            this.app.logM("CordovaPlugin", "INFO", "Installation state move to install started");
            me.sendApplicationUpdate();
            
            
            this._installTimers[installApp.task_uid] =
            	
            	setTimeout(lang.hitch(this, function(){
            	
            	me._inprogressAppsMap[pApp.pkg] = "download";
            	this.app.logM("CordovaPlugin", "INFO", "Installation state move to download");
            	me.sendApplicationUpdate();                        	            
            
	            this._installTimers[installApp.task_uid] =            
	            	setTimeout(lang.hitch(this, function(){
		            	
	            		this.app.logM("CordovaPlugin", "INFO", "Installation state move to install");
		            	me._inprogressAppsMap[pApp.pkg] = "install";
		                me.sendApplicationUpdate();	                	            
		            	
		            	this._installTimers[installApp.task_uid] =            
		    	            setTimeout(function(){
		    	            		    	            	
		    	            	delete me._installTimers[installApp.task_uid];
		    		            dataProxy.reportInstallApp(me.getDeviceId(), installApp, installApp.version).then(
		    							function(data){		
		    								
		    								this.app.logM("CordovaPlugin", "INFO", "Installation state move to installed");
		    								
		    	                            me._installedAppsMap[pApp.pkg] = pApp.version;
		    	                            delete me._inprogressAppsMap[pApp.pkg];
		    								me.saveInstalledList();
		    								
		    								setTimeout(function(){
		    									me.sendApplicationUpdate();
		    								}, 1000);
		    							}, function(e){
		    								me.app.logM("CordovaPlugin", "ERROR", "Request installation " + e);
		    								failureCallback(e);
		    							});
		    	            	
		    	            }, 1000);
		            		            			               	          
		            }), 3000);
            	}), 500); 
            
            successCallback();

            return true;                                                                        
        },        
        
        sendApplicationUpdate: function(){
        	
        	this._pluginSuccessCallback({
				action: APPLICATION_LIST_UPDATE
			});
        },
        

        /**
         * Uninstall an application
         * @ignore 
         */
        removeApplication: function(pApp, successCallback, failureCallback) {
        	this.app.logM("CordovaPlugin", "INFO", "Request uninstallation of app pkg:" + pApp.pkg + " version:" + pApp.version);
                      
            var installApp = lang.mixin({}, pApp);
            installApp.task_uid = this._removeInprogressTasks[pApp.pkg] = this.generateTaskUID(pApp);
            
            var me = this;
            
            me._inprogressAppsMap[pApp.pkg] = "uninstall";
                        
            me.sendApplicationUpdate();
            
            this._installTimers[installApp.task_uid] = 
                
            	setTimeout(function(){
		            dataProxy.reportUninstallApp(me.getDeviceId(), installApp, installApp.version).then(
		    				function(data){
		    					utils.showProgressIndicator(false);
		    					me.app.updatesInvalidated = true;
		    					delete me._installedAppsMap[pApp.pkg];
		    					delete me._inprogressAppsMap[pApp.pkg];
		    					delete me._removeInprogressTasks[pApp.pkg];
		    					me.saveInstalledList();
		    					successCallback(data);

								setTimeout(function(){
									me.sendApplicationUpdate();
								}, 1000);
		    					
		    				}, function(e){
								me.app.logM("CordovaPlugin", "ERROR", "Request uninstallation " + e);
								failureCallback(e);
							});
		            
            	}, 4000);
                                
            return true;                                                                        
        },

        /**
         * Cancel operation in progress for an application
         * @ignore 
         */
        cancelApplication: function(pApp) {
        	this.app.logM("CordovaPlugin", "INFO", "Cancel installation or uninstallation of app pkg:" + pApp.pkg + " version:" + pApp.version);
                                  
            var app = lang.mixin({}, pApp);
            
            if(!app.task_uid) {            	
            	app.task_uid = this._installInprogressTasks[pApp.pkg];
            	delete this._installInprogressTasks[pApp.pkg];
            }
            
            if(!app.task_uid) {
            	uninstall = true;            	
            	app.task_uid = this._removeInprogressTasks[pApp.pkg];
            	delete this._removeInprogressTasks[pApp.pkg];
            }
                                   
            if(!app.task_uid) {
            	return false;
            }
                        
            clearTimeout(this._installTimers[app.task_uid]);
            delete this._installTimers[app.task_uid];
            
            var me = this;
            
            setTimeout(function(){
				me.sendApplicationUpdate();
			}, 1000);
            
           return true;
        },
        
        _credentialsKey: "__appcenter_credentials",
        
        getCredentials: function(success, error) {
        	this.app.logM("CordovaPlugin", "INFO", "Query getCredentials");
            
        	var str = window.localStorage[this._credentialsKey];
        	
        	if(str){
        		
        		var loginParams = JSON.parse(str);
        		
        		setTimeout(function(){
                	success(loginParams);                	
                }, 2000);
        		
        	}else{
        		setTimeout(function(){
        			error();
        		}, 100);
        	}        	        	                     
        },
        
        deleteCredentials: function(success, error){
        	this.app.logM("CordovaPlugin", "INFO", "Query deleteCredentials");
        	
        	window.localStorage[this._credentialsKey] = "";
        	
        	if(success){
        		success();
        	}
        },
        
        login: function(loginParams, pSuccessCallback, pFailureCallback) {
        	this.app.logM("CordovaPlugin", "INFO", "Query login "+loginParams.username+" on "+loginParams.serverURL );
            
        	var key = this._credentialsKey; 
            setTimeout(function(){            	
            	dataProxy.auth().then(function(){
            		var result = utils.parse_url.exec(loginParams.serverURL);
                    if (!result){
                    	utils.showErrorDialog(this.nls.invalidServerUrl);
                    	return;
                    }
                    
                   loginParams.https = result[1] == "https";
                   if(result[2].indexOf(":") != -1){
                	   var ar = result[2].split(":"); 
                	   loginParams.server = ar[0];
                	   loginParams.port = ar[1];
                   }else{
                	   loginParams.server = result[2];
                   }
                   
                   loginParams.path = result[3];
                   
            		window.localStorage[key] = JSON.stringify(loginParams);
            		pSuccessCallback();            	
            	}, pFailureCallback);
            }, 2000);
            return true;
        },
       
        isInstalled: function(versionItem, successCallback, failureCallback){
        	
        	setTimeout(lang.hitch(this, function(){
        		var res = false;
        		if(this._installedAppsMap != null && this._installedAppsMap[versionItem.pkg] != null){
    				res = this._installedAppsMap[versionItem.pkg] == versionItem.version;
    			}
    			successCallback(res);
        	}), 500);
			
		},
				
		getInstalledVersion: function(app, successCallback, failureCallback){
			this.app.logM("CordovaPlugin", "INFO", "Query get installed version of pkg: "+app.pkg);
			setTimeout(lang.hitch(this, function(){
				if(this._installedAppsMap != null){
					var v = this._installedAppsMap[app.pkg];
					this.app.logM("CordovaPlugin", "INFO", "Result installed version of pkg: "+app.pkg+" version:"+v);
					successCallback( {version: v});
				}			
			}), 50);
		},
		
		getPendingOperation: function(pApp, successCallback, failureCallback){
			this.app.logM("CordovaPlugin", "INFO", "Query pending operation on pkg: "+pApp.pkg);
			setTimeout(lang.hitch(this, function(){
				var res = null;				
				if(this._inprogressAppsMap[pApp.pkg] != undefined){					 
					res = this._inprogressAppsMap[pApp.pkg];
				}else if(this._removeInprogressTasks[pApp.pkg] != undefined){
					res = "uninstall";
				}else{
					res = null; 
				}
				this.app.logM("CordovaPlugin", "INFO", "Query pending operation on pkg: "+pApp.pkg+" result:"+res);
				successCallback(res);
			}), 50);
		},
		
		setPushUpdatesSubscription: function(value, success, failure){
			var gcmid = this.app.appConfig.gcmProjectId;
			this.app.logM("CordovaPlugin", "INFO", "setPushUpdatesSubscription on gcmId:" + gcmid);			
			setTimeout(function(){
				success();
			}, 1000);  
	    },
	    
		
		getAllInstalledApplications: function(success, error){
			this.app.logM("CordovaPlugin", "INFO", "Query get all installed applications");
			setTimeout(lang.hitch(this, function(){
				var res = [];
				for (var pkg in this._installedAppsMap){
					res.push({pkg:pkg, version: this._installedAppsMap[pkg]});
				}
				success(res);
			}), 500);					
		},
	    
	    _installationKey: "_installationKey",
	    _uninstallationKey: "_uninstallationKey",
		
		_updateTasks: function(){
			// clear pending install tasks
			for (var pkg in this._installedAppsMap){				
				delete this._installInprogressTasks[pkg];											
			}
			for (var pkg in this._uninstallInprogressTasks){
				if(!this._installedAppsMap[pkg] && !this._inprogressAppsMap[pkg]){
					delete this._uninstallInprogressTasks[pkg];
				}
			}
			
			window.localStorage[this._installationKey] = this._serializeTaskMap(this._installInprogressTasks);
			window.localStorage[this._uninstallationKey]= this._serializeTaskMap(this._uninstallInprogressTasks);
			
		},	
		
		_serializeTaskMap: function(map){
			var arr = [];
			for (var pkg in map){				
				arr.push(pkg + ":" + map[pkg]);									
			}
			return arr.length == 0 ? "" : arr.join("|");
		},
		
		_deserializeTaskMap: function(s, map){
			if(s == undefined || s == ""){
				return;
			}
			var arr = s.split("|");
			for (var i=0; i<arr.length; i++){				
				var r2 = arr[i].split(":");
				map[r2[0]] = r2[1];
				console.log("Restored task:"+r2[0]+" "+ r2[1]);
			}
		},
				
		generateTaskUID: function(app){
			return app.pkg + '-' + app.version + '-' + (new Date()).getTime();
		},
       
        getDeviceInfo: function(/*String?*/ deviceID, success, failure){
            var deviceInfo = lang.mixin (this.getDevice(), {
            		device_id: this.getDeviceId(),
            		width:0,
            		height: 0,
            		dpi: 2,
                	filter: "&os=" + dataProxy.os
           });
           success(deviceInfo);
        },
        
        saveInstalledList: function(){
        	if(window.localStorage){        		        	
        		
        		var res = "{";
        		var i = 0;
        		for (var pkg in this._installedAppsMap){
        			if(i>0){
        				res += ",";
        			}
        			
        			res += "\""+pkg+"\":\""+this._installedAppsMap[pkg]+"\"";
        			i++;
        		}
        		res += "}";
        		
        		window.localStorage["_appcenterInstalledMap"] = res;        		
        	}        	        
        },
        
        restoreInstalledList: function(){
        	if(window.localStorage){        		        		        
        		var res = window.localStorage["_appcenterInstalledMap"];
        		try{
        			if(res != undefined){
        				this._installedAppsMap = JSON.parse(res);
        				return;
        			}        			
        		}catch(e){
        			// go next
        		}
        		this._installedAppsMap = {};
        	}
        }
    };
           
    return appcenter.NativePlugin;
});