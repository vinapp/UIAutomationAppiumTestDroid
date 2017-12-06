
/* JavaScript content from js/appcenter/plugins/NativePlugin.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
 
define(["dojo/_base/lang", 
        "dojo/_base/array",
        "dojo/has",
        "dojo/Deferred"], 
        function(lang, arr, has, Deferred) {
    lang.getObject("appcenter.plugins.NativePlugin", true);
    
    var INIT_COMPLETE                  = "INIT_COMPLETE";
    var APPLICATION_LIST_UPDATE        = "APPLICATION_LIST_UPDATE";
    var APPLICATION_FEEDBACK_REQUEST   = "FEEDBACK_REQUEST";
    var HANDLE_OPEN_CUSTOM_URL         = "HANDLE_OPEN_CUSTOM_URL";
    
    function _alertError(msg) {
        /** @ignore */
        console.log("Error occured: " + msg);
        navigator.notification.alert(
                msg,  // message
                new function() {},      // no callback
                "Error",                // title
                null                    // buttonName, use defaults
            );
    }   

    appcenter.NativePlugin = {

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
                           
        nlsBundle: null,
        
        init: function(pNlsbundle,
                       iconUpdateCallback, 
                       applicationsUpdateCallback,
                       inprogressUpdateCallback,
                       cancelUpdateCallback,
                       feedbackRequestCallback,
                       handleOpenCustomURLCallback,
                       deviceID,
                       installedAppsCallback) {

        	this.app.logM("CordovaPlugin", "INFO", "Initialize plugin");
            
            this.nlsBundle = pNlsbundle;
            
            var me = this;
            this._init(
            	deviceID,         
            	function(info) {
            		
            		this.app.logM("CordovaPlugin", "INFO", "Plugin callback action: " + info.action);
                    
            		if (info.action  == INIT_COMPLETE) {
		               
            		} else if (info.action == APPLICATION_LIST_UPDATE && 
		                      typeof applicationsUpdateCallback === "function") {
		               
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
            
            pDeviceID = pDeviceID ? pDeviceID : device.uuid;
            
            cordova.exec(successCallback,                   // Success callback from the plugin
                         failureCallback,                   // Error callback from the plugin
                         "com.ibm.mobile.InstallerPlugin",  // Tell cordova to run "com.ibm.mobile.InstallerPlugin" Plugin
                         "initInfo",                        // Tell plugin, which action we want to perform
                         [pDeviceID]);                      // Passing no arguments
            
            return true;
        },

        /**
         * Download and Install application
         * @ignore 
         */
        installApplication: function(pApp, successCallback, failureCallback) {
        	
        	this.app.logM("CordovaPlugin", "INFO", "Request installation of app pkg:" + pApp.pkg + " version:" + pApp.version);        	
        	
            var installApp = lang.mixin({}, pApp);
            installApp.task_uid = this.generateTaskUID(pApp);             
                        
            cordova.exec(
            	successCallback,                  // Success callback from the plugin
            	function(e){
            		app.logM("CordovaPlugin", "ERROR", "Request installation of app pkg:" + pApp.pkg + " version:" + pApp.version+ " FAILED");
            		failureCallback(e);
            	},				  // Error callback
                "com.ibm.mobile.InstallerPlugin", // Tell cordova to run "com.ibm.mobile.InstallerPlugin" Plugin
                "installApplication",             // Tell plugin, which action we want to perform
                [installApp]);                    // Passing list of args to the plugin
        },

        /**
         * Uninstall an application
         * @ignore 
         */
        removeApplication: function(pApp, successCallback, failureCallback) {
        	
        	this.app.logM("CordovaPlugin", "INFO", "Request uninstallation of app pkg:" + pApp.pkg + " version:" + pApp.version);
            
            var installApp = lang.mixin({}, pApp);
            installApp.task_uid = this.generateTaskUID(pApp);            
            
            cordova.exec(
            	successCallback,                              // Success callback from the plugin
            	function(e){            
            		this.app.logM("ERROR", "ERROR", "Request uninstallation of app pkg:" + pApp.pkg + " version:" + pApp.version+" FAILED");
					failureCallback(e);
				 },
                 "com.ibm.mobile.InstallerPlugin",  // Tell cordova to run "com.ibm.mobile.InstallerPlugin" Plugin
                 "removeApplication",               // Tell plugin, which action we want to perform
                 [JSON.stringify(installApp)]);                                        
        },

        /**
         * Cancel operation in progress for an application
         * @ignore 
         */
        cancelApplication: function(pApp) {
        	
        	this.app.logM("CordovaPlugin", "INFO", "Cancel installation or uninstallation of app pkg:" + pApp.pkg + " version:" + pApp.version);
            
            cordova.exec(
            	function(){            		
		         },                              // Success callback from the plugin
                 function(e) {                      // Error callback
		        	 this.app.logM("CordovaPlugin", "ERROR", "Cancel installation or uninstallation of app pkg:" + pApp.pkg + " version:" + pApp.version + "FAILED");
                     _alertError( me.nlsBundle.cancelApplicationError.replace("%1",e) );
                 },     
                 "com.ibm.mobile.InstallerPlugin",  // Tell cordova to run "com.ibm.mobile.InstallerPlugin" Plugin
                 "cancelApplication",               // Tell plugin, which action we want to perform
                 [pApp.pkg]);                                                          
        },
        
        /*=====
        var __AppItem = {
			// updated : String, date of the last update
			// label: String, label of the app
			// pkg: String, package name
			// version: String, internal build number
			// versionName : String, marketing version
			// avg_rating: double, average rating
			// nb_rating: double
			// popularity: double
			// avg_rating_all_versions: double
			// nb_rating_all_versions: double
			// popularity_all_versions: double
			// id: int, internal id
        };
        =====*/


        /*
         * 
         * Indicates whether a given package with a specific version is installed
         * 
         * appItem: __AppItem
         * 
         */
        isInstalled: function(/* __AppItem */ appItem, successCallback, failureCallback){
        	this.getInstalledVersion(appItem, 
        		function(installedVersion){
        			successCallback(installedVersion != null && installedVersion.version == appItem.version);
        		},
        		failureCallback
        	);
		},
		
	    /*=====
        var __VersionInfo = {
            // version: int
            //      The version number of this package, as specified by the <manifest> tag's versionCode attribute.
            // versionName: String
            //		The version name of this package, as specified by the <manifest> tag's versionName attribute.
            //
            
        };
        =====*/		

		/*
		 * returns a __VersionInfo object
		 * 
		 */		
		getInstalledVersion: function(/*__AppItem */ app, successCallback, failureCallback){
			this.app.logM("CordovaPlugin", "INFO", "Query get installed version of pkg: "+app.pkg);
            cordova.exec(
            	function(versionItem){
            		var res = null;
	            	if(versionItem && versionItem.version != undefined){
	            		res = versionItem;
	            	}
	            	successCallback(res);
	            },                              // Success callback from the plugin
	            function(e) {                      // Error callback
	            	this.app.logM("CordovaPlugin", "ERROR", "Query get installed version of pkg: "+app.pkg + "FAILED");
	                failureCallback(e);
		        },   
		        "com.ibm.mobile.InstallerPlugin",  // Tell cordova to run "com.ibm.mobile.InstallerPlugin" Plugin
		        "getInstalledVersion",       // Tell plugin, which action we want to perform
		        [app.pkg]);          //             
		},
		
		/*
		 * Returns the current pending operation: "install", "uninstall" or null.
		 */
		getPendingOperation: function(/*__AppItem */app, successCallback, failureCallback){
			this.app.logM("CordovaPlugin", "INFO", "Query pending operation on pkg: "+app.pkg);
            cordova.exec(
            	function(o){
            		
		        	var res = null;
		        	
		        	if(o != null){	        	
			            var appStatus = appcenter.NativePlugin.APPLICATION_STATUS;
			            
			            if(has("WindowsPhone")){
			            	if(o.status == appStatus.INSTALL_STARTED){
			            		res = "installStarted";
			            	}else if(o.status == appStatus.INSTALL_INPROGRESS){
			            		res = "install";
			            	}else if(o.status == appStatus.DOWNLOAD_INPROGRESS){
			            		res = "download";
			            	} // no uninstall on WP
			            }else{
				            if (o.status == appStatus.INSTALL_INPROGRESS ||
				            	o.status == appStatus.DOWNLOAD_INPROGRESS){
				            	res = "install";
				            }else if(o.status == appStatus.UNINSTALL_INPROGRESS){
					            res = "uninstall";				            				            	
				            } // no install started on Android
			            }
		            }
		            
		        	this.app.logM("CordovaPlugin", "INFO", "Query pending operation on pkg: "+app.pkg+" result:"+res);
		            
		            successCallback(res);
		        	
				 },                              // Success callback from the plugin
		         function(e) {
					 this.app.logM("CordovaPlugin", "ERROR", "Query pending operation on pkg: "+pApp.pkg+" FAILED");
					 failureCallback(e);
		         },   
		         "com.ibm.mobile.InstallerPlugin",  // Tell cordova to run "com.ibm.mobile.InstallerPlugin" Plugin
		         "getApplicationStatus",       // Tell plugin, which action we want to perform
		         [app.pkg]);          //                         
		},
		
		setPushUpdatesSubscription: function(value, success, failure){
	    	var gcmid = this.app.appConfig.gcmProjectId;
	    	this.app.logM("CordovaPlugin", "INFO", "setPushUpdatesSubscription on gcmId:" + gcmid);
	    	cordova.exec(
	    		success, 
	    		function(e){
	    			this.app.logM("CordovaPlugin", "ERROR", "setPushUpdatesSubscription on gcmId:" + gcmid+ " FAILED");
	    			failure(e);
	    		},
	    		"com.ibm.mobile.UpdateNotificationsPlugin", 
	    		value?"registerNotifications":"unregisterNotifications", 
	    		[{gcm_project_id: gcmid}]);	    		    
	    },
	    			
		generateTaskUID: function(app){
			return app.pkg + "-" + app.version + "-" + (new Date()).getTime();
		},

        /*=====
        var __DeviceInfo = {
            // device_id: String
            //      id of the device
            // width: int
            //      width of the device
            // height: int
            //		height of the device
            //
            // dpi: int
            //		resolution of the device (see class constants)
            
        };
        =====*/
        /* 
         * deviceId: String?
         * 
         * Returns the object __DeviceInfo
         */
        
        getDeviceInfo: function(/*String?*/ deviceID, success, failure){
        	this.app.logM("CordovaPlugin", "INFO", "Query device info");
            deviceID = deviceID ? deviceID : device.uuid;
            cordova.exec(
            	success,                           // Success callback from the plugin
                function(e){
                	this.app.logM("CordovaPlugin", "ERROR", "Query device info FAILED");
            		failure(e);
            	},   
                "com.ibm.mobile.InstallerPlugin",  // Tell cordova to run "com.ibm.mobile.InstallerPlugin" Plugin
                "getDeviceInfo",       // Tell plugin, which action we want to perform
                [deviceID]);          // no args
        },
        
        /*=====
        var __ApplicationInfo = {
        	// pkg: String
        	//		The package of this application,  as specified by the <manifest> tag's package attribute.
            // version: String
            //      The version number of this package, as specified by the <manifest> tag's versionCode attribute.
           
        };
        =====*/
        /*  
         * Returns an array of  __ApplicationInfo objects
         * 
         */
        
        getAllInstalledApplications: function(success, error){
        	this.app.logM("CordovaPlugin", "INFO", "Query get all installed applications");
	        cordova.exec(
	        	function(applicationInfos){
					success(applicationInfos);            				
				 },                              // Success callback from the plugin
	             function(e) {                      // Error callback 
					 this.app.logM("CordovaPlugin", "ERROR", "Query get all installed applications FAILED");
					 error(e);
	             },   
	             "com.ibm.mobile.InstallerPlugin",  // Tell cordova to run "com.ibm.mobile.InstallerPlugin" Plugin
	             "getAllInstalledApplications",       // Tell plugin, which action we want to perform
	             []);          // no args                   
        },
        
        /*=====
    	var __Credentials = {
    			username : String,
    			password : String,
    			https: Boolean,    			
    			port: String,
    			path: String                            
    	};
     =====*/
        
        getCredentials: function(success, error){
        	// Get credentials 
        	this.app.logM("CordovaPlugin", "INFO", "Query credentials for transparent login");
	        cordova.exec(
	        	function(applicationInfos){
	        		this.app.logM("CordovaPlugin", "INFO", "Query credentials success: credentials found");
					success(applicationInfos);            				
				 },                              // Success callback from the plugin
	             function(e) {                      // Error callback 
					 this.app.logM("CordovaPlugin", "WARN", "Query credentials: no credentials found");
					 error(e);
	             },   
	             "com.ibm.mobile.InstallerPlugin",  // Tell cordova to run "com.ibm.mobile.InstallerPlugin" Plugin
	             "getCredentials",       // Tell plugin, which action we want to perform
	             []);          // no args              
        },        
        
        deleteCredentials: function(success, error){
        	// Get credentials 
        	this.app.logM("CordovaPlugin", "INFO", "Query delete of credentials for transparent login");
	        cordova.exec(
	        	function(applicationInfos){
	        		this.app.logM("CordovaPlugin", "INFO", "Query delete credentials success");
	        		if(success){
	        			success(applicationInfos);
	        		}
				 },                              // Success callback from the plugin
	             function(e) {                      // Error callback 
					 this.app.logM("CordovaPlugin", "ERROR", "Query delete credentials FAILED");
					 if(error){
						 error(e);
					 }
	             },   
	             "com.ibm.mobile.InstallerPlugin",  // Tell cordova to run "com.ibm.mobile.InstallerPlugin" Plugin
	             "deleteCredentials",       // Tell plugin, which action we want to perform
	             []);          // no args              
        },
                
        /*=====
        	var __LoginParams = {
        			username : String,
        			password : String,
        			serverURL: String
        	};
         =====*/
        
        login : function(/* __LoginParams */ loginParams, pSuccessCallback, pFailureCallback)
        {
        	
        	this.app.logM("CordovaPlugin", "INFO", "Query login user name:"+loginParams.username+" server:"+loginParams.serverURL );
            cordova.exec(
            	function(status){
    				pSuccessCallback(status);
    			 },                              // Success callback from the plugin
                 function(e) {                      // Error callback 
    				 this.app.logM("CordovaPlugin", "ERROR", "Query login "+loginParams.username+" on "+loginParams.serverURL + "FAILED");
    				 pFailureCallback(e);
                 },   
                 "com.ibm.mobile.InstallerPlugin",  // Tell cordova to run "com.ibm.mobile.InstallerPlugin" Plugin
                 "login",       // Tell plugin, which action we want to perform
                 [loginParams]);                           
        }           
    };          

    return appcenter.NativePlugin;
});