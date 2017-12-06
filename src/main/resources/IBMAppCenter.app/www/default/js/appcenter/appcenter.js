
/* JavaScript content from js/appcenter/appcenter.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([        
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/_base/window",
        "dojo/_base/config",
        "dojo/Deferred",  
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-style",        
        "dojo/date/stamp",
        "dojo/on",
        "dojo/promise/all",
        "dojo/sniff",         
        "dojo/string",
        "dojo/touch",
        "dojo/topic",
        "dojo/store/Memory",
        "dojo/store/Observable",        
        "dojo/i18n!appcenter/nls/common",
        "dojox/mobile/Button",        
        "dojox/mobile/SimpleDialog",            
        "appcenter/widgets/DataProxy",
        "appcenter/views/utils",
        "dojox/mobile/_ItemBase",
        "dojo/has!_html?appcenter/plugins/SimulatorPlugin:appcenter/plugins/NativePlugin"], 
    function(
    		lang,
    		arr,
    		win,
    		config,
    		Deferred,
    		domClass,
    		domConstruct,
    		domStyle,    		
    		stamp,    		
    		on,
    		all,
    		has,
    		string,
    		touch,
    		topic,
    		Memory,
    		Observable,
    		nls,
    		Button,
    		SimpleDialog,
    		dataProxy,
    		utils,
    		ItemBase,
    		plugin){
	
	return function(){
		
		app = this;
		plugin.app = this;	
		
		this.NON_MARKET_DIS = plugin.ERROR_CODE.NON_MARKET_DIS;
		
		this.nativeAppUpdate = function(){					
			topic.publish("appcenter/nativeUpdate");
		};
				
		this.nativeOnFeedbackRequest = function(pkg, version, rating, message){
			
			if(this.credentials == null){
				this.pendingActionOnLoad = lang.hitch(this, function(){
					this.nativeOnFeedbackRequest(pkg, version, rating, message);
				});
				return;
			}			
			
			this.appItem = this.appModel[pkg];
			if(this.appItem == null){
				utils.showErrorDialog(nls.reviewNotSentApplicationNotInCatalog, nls.warningDialogTitle);
				return;
			}
			
			this.versionItem = this.getVersionItem(this.appItem, version);
			
			if(!this.isInstalled(this.versionItem)){
				utils.showErrorDialog(nls.mustInstallAppToRate);
				return;
			}
			
			this.sendReview(this.versionItem,						
				rating,
				message,
				lang.hitch(this, function(data){
					this.invalidateAppInfo(this.versionItem);
										
					this.emit("appcenter/showViewAfterFeedback", {
						view: this,
						appItem: this.appItem,
						version: this.versionItem.version,
						forceRank: 1,
						data: {
							action: "reviewsInvalidated"
						}
					});
														
				}),
				this.getErrHandler(null, lang.hitch(this, function(e, message){
					utils.showProgressIndicator(false);
					utils.showErrorDialog(message);
				})));
			
		};
		
		this.nativeOpenCustomURL = function(url){
			var decodedUrl = decodeURI(url);
			if((decodedUrl.length > 24) && (decodedUrl.substring(0,24) == "ibmappctr://show-app?id=")){
				var requestedPackage = decodedUrl.substring(24).replace(/%2F/g,"/");
				if(this.credentials == null){
					this.pendingActionOnLoad = lang.hitch(this, function(){
						this.openPackageDetails(requestedPackage);
					});
				}else{
					this.openPackageDetails(requestedPackage);
				}
			}else{
				// Badly formatted URL
				utils.showErrorDialog(nls.invalidUrl);
				this.requestedPackage = null;
			}
		};

		this.openPackageDetails = function(requestedPackage) {
			if(requestedPackage != null){
				this.appItem = this.appModel[requestedPackage];
				if(this.appItem == null){
					// app not found
					utils.showErrorDialog(nls.appNotFound);
				}else{
					if(this.appItem.isAppLink){
						this.versionItem = null;
						this.emit("appcenter/showAppLinkDetails", {
							view: null,
							forceRank: 1
						});
					}else{ //!isAppLink
						this.versionItem = this.appItem;
						this.emit("appcenter/showDetailsVersion", {
							view: null,
							forceRank: 1
						});
					}
				}
			}
		};
		
		this.init = function(){
			// summary:
			//		dojox.app application has been initialized.
			
			if(this.appConfig && this.appConfig.hasOwnProperty("requestTimeout")){
				dataProxy.timeout = this.appConfig.requestTimeout;
			}
			
			this.isTablet = domClass.contains(document.documentElement,  "dj_tablet");
						
			window.onerror = lang.hitch(this, function(error){
				var msg = string.substitute(nls.globalErrorMessage, {message: error.message});
				utils.showErrorDialog(msg, null, function(){
					if(navigator && navigator.app){
						navigator.app.exitApp();
					}else{
						window.location = window.location;
					}
				});
			});					
			
			// send a global message to all views on orientation change
			var dm = lang.getObject("dojox.mobile");
			on(win.global, has("ios") ? "orientationchange" : "resize", function(){				
				dm.updateOrient();
				topic.publish("appcenter/app-resize");
			});			
			
			// prevent native scrolling on non scrollable areas
			on(document.body, touch.press, function(e){				
				var node = e.target;
				
				if(has("ios") || has("WindowsPhone")){					
					while(node !== document.body && node.id !== "appcenterRoot"){
						// enable native scroll for views with input fields
						if(node.id == "appcenter_Login" || node.id == "appcenter_SendReview" ||
							domClass.contains(node, "mblAddReviewDialog")){									
							return;
						}
						node = node.parentNode;
					}
					
					e.preventDefault();
					return;				
				}
				
				var isFormElt = false;

				if(node && node.nodeType !== 1){ node = node.parentNode; }
				if(!node || node.nodeType !== 1){ 
					isFormElt = false;
				}else{
					var t = node.tagName;
					isFormElt = (t === "SELECT" || t === "INPUT" || t === "TEXTAREA" || t === "BUTTON");
				}

				if(!isFormElt){
					e.preventDefault();
				}								
			});	
			
			// downgrade is not possible on android >= 4.2
			if(has("android")){							
				var ver = (""+has("android")).split(".");
				if(this.appConfig.allowDowngrade){
					this.appConfig.allowDowngrade = ver[0] < 4 || 
						ver.length > 1 && ver[0] == 4 && ver[1] < 2;
					if(!this.appConfig.allowDowngrade){
						this.logM("General", "WARN", "Warning downgrade is not possible on Android > 4.2."+
							" The allowDowngrade configuration flag is disabled");
					}
				}
			}
			
			dataProxy.os = has("android") ? "Android"
				: (has("WindowsPhone") ? "WindowsPhone" : "iOS");
			this.isInstalledAppsAccurate = (dataProxy.os == "Android")||(dataProxy.os == "WindowsPhone");
			this.useOneTimeURL = dataProxy.os != "Android";
			if(dataProxy.os == "iOS"){
				this.appConfig.allowDowngrade = false;
			}

			// init the native plugin
			var noop = function(){};
			plugin.app = this;			
			
	 	   plugin.init(nls,
                 noop,
                 lang.hitch(this, this.nativeAppUpdate),
                 noop,
                 noop,
                 lang.hitch(this, this.nativeOnFeedbackRequest),
                 lang.hitch(this, this.nativeOpenCustomURL));		
	 	  
	 	  topic.subscribe("appcenter/loadCatalog", lang.hitch(this, function(){	
				this.refreshCatalog();
	 	  }));
		};
		
		this.logM = function(type, status, message){
			var o = this.appConfig;
									
			if(o && o.hasOwnProperty("log") && o.log){
				var f = function(checkType, type, status, message){
					if(type == checkType){
						var p = o["log"+checkType];
						if(p == undefined || p == "INFO" || p == "ERROR" && status == "ERROR"){				
							console.log("[Appcenter]["+checkType+"]["+status+"]: " + message);
						}
					}
				};
				f("General", type, status, message);
				f("RestService", type, status, message);
				f("CordovaPlugin", type, status, message);
				f("Navigation", type, status, message);
			}
		};
		
		this.getHandler = function(handler, message){
			// summary:
			//		Returns a generic asynchronous handler.
			//		It hides the progress indicator,
			//		shows an error message if any,
			//		and delegates to a function if any.
			return lang.hitch(this, function(e){
				utils.showProgressIndicator(false);
				if(message){
					utils.showErrorDialog(message);
				}				
				if(handler){
					handler(e);
				}
			});
		};
		
		this.getErrHandler = function(message, handler, title){
			// summary:
			//		Returns a default error handler managing common HTTP errors
			//	message: String?
			//		Message to display in the error dialog, if any
			//	handler: Function?
			//		Function to call if defined. If not null, the error dialog is not displayed. The handler must display it, if needed.
			//	title: String?
			//		Title of the error dialog, if any. Otherwise default title is used.
			return lang.hitch(this, function(e){
				utils.showProgressIndicator(false);
				
				var src = null;
				var sub = string.substitute;
				var status = null;
				if(e.hasOwnProperty("response") && e.response.hasOwnProperty("status")){
					status = e.response.status; // dojo xhr 
				}else if(e.hasOwnProperty("httpResponseCode")){
					// WindowsPhone 8 always returns a value for e.httpRersponseCode
					// -1 means that no httpCode has been identified in the error
					if (e.httpResponseCode != -1){
					    status = e.httpResponseCode;
					}
				}
				
				this.logM("General", "ERROR", "Error handler, http status: "+status+" \""+(e.message?e.message:null) + "\"");
				
				if(status != undefined){
					switch(status){
						case 0:
							src = nls.unreachableServer;
							break;
						case 403:
						case 401:
							src = nls.invalidLoginPw;
							break;
						case 408:
							src = nls.timeoutError;
							break;
						case 500:
							src = nls.serverError;
							break;
						default:
							src = sub(this.nls.genericErrorWithStatus, {status:status});
					}
				}else if(e.dojoType == "timeout" && e.name == "RequestTimeoutError"){
					src = nls.timeoutError;
				}else if(e.hasOwnProperty("localizedMessage") || e.hasOwnProperty("message")){
					var nativeMsg = e.hasOwnProperty("localizedMessage") ? e.localizedMessage : e.message;
					src = string.substitute(this.nls.genericErrorWithMessage, {message: nativeMsg});
		        } else if(e.hasOwnProperty("hResult")) {
		            if (e.hResult === "0x800703F0"){
		                src = sub(nls.installErrorWP81Debug, { hresult: e.hResult });
		            } else if (e.hResult === "0x81030110"){
		                src = sub(nls.installErrorWPCertificate, { hresult: e.hResult });
		            } else {
		                src = sub(nls.installErrorWP, { hresult: e.hResult });
		            }
				}else{
					src = nls.genericError;
				}
				
				if(message){					
					message = sub(this.nls.errorWithMessage, {message:message});					
				}else{
					message = src;					
				}
								
				this.logM("General", "ERROR", "Error handler, displayed message: \""+ message + "\"");				
				
				if(handler){
					handler(e, message, title);
				}else{
					utils.showErrorDialog(message, title);
				}
			});
		};
		
						
		this.getVersionItem = function(app, version){
			// summary:
			//		Returns the version item from the application object.	
			
			if(app.version == version){
				return app;
			}
			if(app.versionMap == null){
				app.versionMap = {};
			}
			if(app.versionMap[version]){
				return app.versionMap[version];
			}
			
			var res = arr.filter(app.versions, function(o){return o.version == version;});
			if(res == undefined || res.length == 0){ // main app must be loaded first
				return undefined;
			}
			
			// if versionItem is a stub
			// fill minimal info to send request
			res[0].pkg = app.pkg;
			res[0].os = app.os;
			app.versionMap[version] = res[0];
			
			return res[0];		
		};
		
		this.getVersionName = function(versionObj){
			// summary:
			//	Returns the version name or version number if name is not available.
			return versionObj.versionName !== "" ? versionObj.versionName : versionObj.version;
		};

		this.setBackButton = function(header, waitKeyboard){
			// summary:
			//		Configures the back button of a view.
			var s = this.stacks[this.currentStack];
			if(s == null || s.length < 2){
				return;
			}
			var from = s[s.length-2];
			header.set("back", from.label);
			if(!header.backHandlerSet){
				header.backHandlerSet = true;
				var self = this;
				header.on("backClick", function(){
					if(waitKeyboard){
						utils.hideKeyboard().then(function(){
							self.emit("appcenter/popViewFromStack", {});
						});
					}else{
						self.emit("appcenter/popViewFromStack", {});
					}
				});
			}			
		};
		
	    this.setPushUpdatesSubscription = function(value, success, failure){
	    	// summary:
	    	//		Subscribe or unsubscribe to push notifications (new updates for example);
	    	plugin.setPushUpdatesSubscription(value, success, failure);
	    },
	    												
	    this.synchronizeInstalledApps = function(success, error){
	    	// summary:
	    	//		Send the currently installed applications list to the app center server
	    	
	    	if(this.isInstalledAppsAccurate){
	    		plugin.getAllInstalledApplications(lang.hitch(this, function(apps){
	    			dataProxy.synchronizeInstalledApps(this.getDeviceId(), apps).then(success, error);
	    		}), error);
	    			    	
	    	}else{
	    		success();
	    	}
	    },
	    												
	    this.sortPopular = {sort:[{attribute:"popularity", descending: true}, {attribute:"label", descending: false}]};
		this.sortRating = {sort:[{attribute:"rating", descending: true}, {attribute:"label", descending: false}]};  
		this.sortAlphabetic = {sort:[{attribute:"label", descending: false}]};		
		this.sortUpdated = {sort:function(item1, item2){
			var t1 = item1.rawItem.updatedTime;
			if(!t1){
				t1 = item1.updatedTime = stamp.fromISOString(item1.rawItem.updated).getTime();
			}
			var t2 = item2.rawItem.updatedTime;
			if(!t2){
				t2 = item2.updatedTime = stamp.fromISOString(item2.rawItem.updated).getTime();
			}
			return t1 < t2 ? 1 : t1 > t2 ? -1 : 0;  
		}};
		
		this.appSort = this.sortAlphabetic;
		
		this.setCurrentSort = function(sort){
			this.appSort = sort;
			topic.publish("appcenter/updateListSort");			
		};
		
        /*=====
        var __appItem = {
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
		
		this.createAppListModel = function(/* Array of __appItem */ data){
			// summary:
			//		Creates the application list model from the catalog.
			//		All application retrieved from other REST services must be retrieved
			//		from this model to ensure uniquiing.
			
			delete this.appModel; // clear cache
			this.appModel = {};
			arr.forEach(data, lang.hitch(this, function(item){
				item.os = dataProxy.os;
				this.appModel[item.pkg] = item;
				
			}));			
		};
		
		this.updateAppListModel = function(/* Array of __appItem */ data, /* dojo/store/Store */ fromStore){
			arr.forEach(data, lang.hitch(this, function(app){
				app.os = dataProxy.os;
				this.invalidateListItem(app, app.version, fromStore); // notifies other stores of change
				this.appModel[app.pkg] = app;				
			}));
		},
		
		this.createCatalogStore = function(data){
			this.createAppListModel(data);
			// when catalog is reloaded, every cache from every views must be invalidated.
			topic.publish("appcenter/clearCache");
			this.catalogStore = this._createListStore(data);
			return this.catalogStore;
		};
		
		this.createUpdatesStore = function(data){
			this.updatesStore = this._createListStore(data, "update");
			topic.publish("appcenter/invalidateDetails");
			this.updateAppListModel(data, this.updatesStore);
			return this.updatesStore;
		};
		
		this._createListStore = function(data, type){
			return new Observable(new Memory({data:this.convertDataToListItems(data, type), idProperty:"pkg"}));
		};
		
		this.getDeviceId = function(){			
			return this.deviceInfo.device_id;
		};
		
		this.isVersionItemValid = function(versionItem){
			// summary:
			//		Checks of the version item is valid.
			//		If not, it is invalidated to be refreshed on next getAppInfo() call.
			
			if(this.useOneTimeURL && versionItem.timestamp < (new Date()).getTime()){
				this.invalidateAppInfo(versionItem);
				return false;
			}
			return true;
		};
		
		this.invalidateAppInfo = function(versionItem){
			// summary:
			//		Invalidates the cache of the version item.
			//		Subsequent call to getAppInfo will fetch data from server.
			versionItem.loaded = false;
		};
		
		this.isAppInfoInCache = function(versionItem){
			// summary:
			//		Indicates whether the application version is in cache and this cache is not invalidated
			return versionItem.loaded;
		};
				
		this.registerDevice = function(username){
			// summary:
			//		Registers the device
			//		The device must be register before any call to device specific REST service.
			
			
			if(!this.deviceInfo){
				
				var def = new Deferred();
				
				plugin.getDeviceInfo(null, lang.hitch(this, function(info){
					
					if(!info.hasOwnProperty("nickname") || !info.nickname){
						info.nickname = string.substitute(this.nls.defaultDeviceNickname, {username:this.credentials.username, phoneModel: info.model});
					}
					
					this.logM("General", "INFO", "device id: " + info.device_id + ", nickname:" + info.nickname + " dpi:"+ info.dpi);					
					
					this.deviceInfo = info;		
					// app center self update data
					this.appCenterInfo = {
							pkg : info.pkg,
							versionCode : +info.versionCode
					};
					//
					dataProxy.registerDevice(this.deviceInfo).then(
						function(){
							def.resolve();
						}, 
						function(e){
							def.reject(e);
						}
					);
				}), this.getErrHandler());
				
				return def;
			}
						
			return dataProxy.registerDevice(this.deviceInfo);			
		};
						
		this.login = function(loginParams, success, error){
			// summary:
			//		Authenticate the user to the Application Center server					
			dataProxy.initServiceContext(loginParams);
			if (dataProxy.hasOwnProperty("timeout"))
				loginParams.timeout = dataProxy.timeout;
			plugin.login(loginParams, success, error);
		};
		
		this.getCredentials = function(success, error){
			// summary:
			//		Retrieve credentials from a previously successful login for transparent login.
			if(has("ios")){						
				plugin.getCredentials(success, error);
			}
		};
		
		this.deleteCredentials = function(success, error){
			// summary:
			//		Delete credentials from a previously successful login for transparent login.
			
			if(has("ios")){
       
       
				plugin.deleteCredentials(success, error);
			}
		};
		
		this.refreshCatalog = function(success, error){
			this.getCatalog(
					{condense: true},
					lang.hitch(this, function(data){
						topic.publish("appcenter/updateTabs", {disabled:false});
											
						this.createCatalogStore(data);					
						
						topic.publish("appcenter/catalogLoaded", this.catalogStore);
						if(this.pendingActionOnLoad){						
							this.pendingActionOnLoad();
							this.pendingActionOnLoad = null;
						}
						if((success !=  null) && (success != undefined))
							success();
					}),
					this.getErrHandler(null, lang.hitch(this, function(e, message){						
						topic.publish("appcenter/catalogLoadError");
						utils.showErrorDialog(message);
						topic.publish("appcenter/updateTabs", {disabled:true});
						if((error !=  null) && (error != undefined))
							error();
					})));
		};
		
		this.getCatalog = function(queryOpts, success, error){
			// summary:
			//		Retrieves the catalog for this user/device.
			//		Processes auto upgrade of the application center...
			
			utils.showProgressIndicator(true);
			dataProxy.getCatalog(this.getDeviceId(), queryOpts).then(
				lang.hitch(this, function(data){
					utils.showProgressIndicator(false);
					
					this.favoritesMap = {};
					// app center auto upgrade variables
					var shouldShowUpgrade = false;
					var newAppcenterApp = null;
					//
					arr.forEach(data, function(app){
						if(app.is_favorite == "Y"){
							this.favoritesMap[app.pkg] = true;
						}
						var currentVersion = +app.version;
						if(this.appCenterInfo.pkg === app.pkg && currentVersion > this.appCenterInfo.versionCode) {
							// found potential update version for app center
							shouldShowUpgrade = true;
							newAppcenterApp = app;
						};
						

					}, this);
					
					if(success){
						success(data);
					}
					if(this.appConfig.appCenterAutoUpgrade && shouldShowUpgrade){
						// now triggering auto update...
						utils.showUpdateAppCenterDialog(this, newAppcenterApp);
					};
				}), 
				error);
		},
					
		this.getAppInfo = function(versionItem, queryOpts, success, error){
			// summary:
			//		Returns the application info of the version item.
			//		A cache is used to prevent issuing server request every time.
			//		Call invalidateInfo() to invalidate cache for this version item.		
			
			var baseApp = this.appModel[versionItem.pkg];
					
			if(versionItem.loaded){
				utils.showProgressIndicator(false);
				success(versionItem);
				return;
			}
			
			// not in cache
			utils.showProgressIndicator(true);
			if(error == null){
				error = this.getErrHandler();
			}
			dataProxy.getAppInfo(this.getDeviceId(), baseApp, versionItem.version, queryOpts).then(lang.hitch(this, function(data){
				utils.showProgressIndicator(false);
				
				var rApp = data;
				if(versionItem.version !== baseApp.version){
					delete rApp.versions;
				}
				rApp.loaded = true;
				if(this.useOneTimeURL){
					var d = new Date();
					d.setMinutes(d.getMinutes()+45);				
					rApp.timestamp = d.getTime();					
				}
								
				lang.mixin(versionItem, rApp);
				
				// update global values
				baseApp.nb_rating_all_versions = rApp.nb_rating_all_versions;
				baseApp.avg_rating_all_versions = rApp.avg_rating_all_versions;
				baseApp.popularity_all_versions = rApp.popularity_all_versions;							
				
				this.invalidateListItem(baseApp, versionItem.version);
				
				success(rApp);
			}), error);
		};
		
		this.onUpdateNotificationReceived = function(notShowPopup) {
			// here we need to switch to the updates view then to call the refresh view button fuction...
			// first need to invalidate all of the tabs since there is no more polling background service that could refresh them
			
			if(this.credentials == null){
				this.pendingActionOnLoad = lang.hitch(this, function(){
					this.onUpdateNotificationReceived(true);
				});
				return;
			}
			
			topic.publish("appcenter/invalidateUpdates");
						
			if(notShowPopup){
				this.emit("appcenter/showTab", {tab:"updates"});
			}else{
				topic.publish("appcenter/invalidateCatalog");				
				utils.showUpdateNotificationDialog(this);
			}
		};
		
		this.getUpdates = function(success, error){
			// summary:
			//		Retrieve the available updates for this user/device
			
			utils.showProgressIndicator(true);
			dataProxy.getUpdates(this.getDeviceId()).then(lang.hitch(this, function(data){
				utils.showProgressIndicator(false);
				
				arr.forEach(data, function(app){
					// check if the catalog must be invalidated
					if(!this.appModel.hasOwnProperty(app.pkg) || this.appModel[app.pkg].version !== app.version){
						this.onMoreRecentAppLoaded(app, "updates");
					};
				}, this);
				
				if(success){					
					success(data);
				}
			}), error);
		};
				
		this.getReviews = function(app, version, fromIndex, pageSize, orderBy, success, error){
			// summary:
			//		Retrieve the reviews for the application. If version is not set, all reviews are returned.
			utils.showProgressIndicator(true);
			var opts = {
					fromIndex: fromIndex, 
					pageSize: pageSize, 
					orderBy: orderBy,
					condense: true
			};
			dataProxy.getReviews(app, version, opts).then(this.getHandler(success), error);
		};
		
		this.sendReview = function(versionItem, rating, comment, success, error){							
			// summary:
			//		Send a new review for a application/version.
			
			var o = {
				device_id: this.getDeviceId(),
				comment: comment,
				rating: rating			
			};
			utils.showProgressIndicator(true);
			
			dataProxy.sendReview(versionItem, versionItem.version, o).then(
				lang.hitch(this, function(data){
					if(this.appSort == this.sortRating){
						topic.publish("appcenter/updateListSort");
					}
					this.getHandler(success)(data);					
				}), error);
		};	
		
		this.convertDataToListItems = function(data, type){
			// summary:
			//		Converts the application objects returned by a REST service call
			//		into an object that can be displayed by a dojox.mobile list.
			
			return arr.map(data, function(item){
				item.icon = utils.getApplicationIconUrl(this, item);
				var v = this.getVersionName(item);
				
				/*if(type=="update" && this.isInstalledAppsAccurate){
					var iVersion = this.getInstalledVersion(item);
					if(iVersion){
						v = string.substitute(nls.updateListItemVersion, {version:v, versionInstalled:iVersion.versionName}) ;
					};
				};*/
				
				return {
					pkg: item.pkg,
					icon: item.icon,
					label: item.label,
					noArrow: false,
					clickable: true,
					version: v,
					rating: (this.appConfig.listAverageRating == "latestVersion" ? item.avg_rating : item.avg_rating_all_versions)/2,
					popularity: item.popularity,
					arrowClass: this.isTablet ? null : "mblDomButtonGrayArrow",
					favorite: this.isFavorite(item),
					nbRating: this.appConfig.listAverageRating == "latestVersion" ? item.nb_rating : item.nb_rating_all_versions,
					rawItem: this.appModel[item.pkg],
					isAppLink: item.isAppLink,
					description: item.description
				};
			}, this);
		};
		
		this.onMoreRecentAppLoaded = function(app, from){
			this.appModel[app.pkg] = app;
			
			var fromStore = null;
			if(from == "updates"){
				fromStore = this.updatesStore;
			}else if(from == "favorites"){
				fromStore = this.favStore;
			}
					
			this.invalidateListItem(app, app.version, fromStore);				
		};
									
		this.installApplication = function(app, version, success, error){
			// summary:
			//		Installs a version of an application
										
			this.setFavorite(app, true);					
			
			topic.publish("appcenter/invalidateUpdates");
			
			var vApp = this.getVersionItem(app, version);
			
			if(this.isInstalledAppsAccurate){
				utils.showProgressIndicator(true);
			} // otherwise it's one way
			
			plugin.installApplication(vApp, lang.hitch(this, function(){
				utils.showProgressIndicator(false);
				if(success != undefined){
					success();
				}				
			}), error);
			
		};
		
		this.uninstallApplication = function(app, version, success, error){			
			// summary:
			//		Uninstalls a version of an application
			
			topic.publish("appcenter/invalidateUpdates");
			
			var vApp = this.getVersionItem(app, version);
			
			plugin.removeApplication(vApp, success, error);
								
		};
		
		this.cancelApplication = function(app){
			// summary:
			//		Cancels the installation or uninstallation of an application.
			topic.publish("appcenter/invalidateUpdates");
			
			plugin.cancelApplication(app);			
		},
		
		this.getInstalledApps = function(success, error){
			// summary:
			//		Returns the list of installed application in the device *according to the server*.
			 
			dataProxy.getInstalledApps(this.getDeviceId(), {condense:true}).then(
				lang.hitch(this, function(data){
					var map = {};
					arr.forEach(data.items, function(item){
						map[item.pkg] = {version: item.version, versionName: item.versionName};
					}, this);
					this._installedAppsMap = map;
					utils.showProgressIndicator(false);
					
					plugin.syncInstalledApplications(data.items);
					
					success(data);
				}), error);
		};
		
		this.isInstalled = function(versionItem){
			// summary:
			//		Indicates that the specified version of this application is installed or not.
			// returns:
			//		A promise.
			var def = new Deferred();
			
			plugin.isInstalled(versionItem, 
				function(res){ def.resolve(res); }, 
				function(err){ def.reject(res); });
			
			return def;
		};
		
		this.getInstalledVersion = function(app){
			// summary:
			//		Returns the version of the speficied which installed or null if 
			//		this application is not installed.
			// returns:
			//		A promise
			var def = new Deferred();
			
			plugin.getInstalledVersion(app, 
				lang.hitch(this, function(res){
					var r = null;
					if(res){
						r = this.getVersionItem(app, res.version);
					}
					def.resolve(r);
				}), 
				function(e){
					def.reject(e);
				});
			 return def;		
		};
		
		this.getPendingOperation = function(app){
			// summary:
			//		Returns the pending operation ("install", "uninstall" or null);
			// returns:
			//		A promise.
			var def = new Deferred();
			
			plugin.getPendingOperation(app, 
				function(res){ 
					def.resolve(res); 
				}, 
				function(err){ def.reject(res); });
			
			return def;
		};
		
		this.getFavorites = function(queryOpts, success, error){
			// summary:
			//		Retrieve the favorites for this user/device.
			utils.showProgressIndicator(true);
			dataProxy.getFavorites(this.getDeviceId(), queryOpts).then(
					lang.hitch(this, function(data){
						utils.showProgressIndicator(false);
						
						this.favoritesMap = {};
						
						arr.forEach(data.items, function(app){
							this.favoritesMap[app.pkg] = true;
							if(!this.appModel.hasOwnProperty(app.pkg) || this.appModel[app.pkg].version !== app.version){
								this.onMoreRecentAppLoaded(app, "updates");
							};
						}, this);
						
						if(success){
							success(data);
						}
					}), error);
		},
		
		this.setFavorite = function(app, value, success, error){
			// summary:
			//		Set the favorites that of an application (non version specific)
						
			if(this.isFavorite(app) == value){
				return;
			}
								
			dataProxy.setFavorite(app, value).then(
				lang.hitch(this, function(){
					utils.showProgressIndicator(false);
					
					if(value){
						this.favoritesMap[app.pkg] = true;																
					}else{											
						delete this.favoritesMap[app.pkg];						
					}
					
					topic.publish("appcenter/invalidateUpdates");
					
					this.invalidateListItem(app, app.version);
					
					if(this.favStore){
						var item = this.convertDataToListItems([app])[0];
						if(value){
							this.favStore.put(item, {overwrite:true});
						}else{
							this.favStore.remove(item.pkg);
						}
					}else{
						topic.publish("appcenter/invalidateFavorites");
					}	
					if(success != undefined){
						success();
					}								
				}), error);										
		};
		
		this.isFavorite = function(item){
			// summary:
			//		Indicates whether the application if is favorite or not.
			
			return this.favoritesMap != undefined && this.favoritesMap[item.pkg] != undefined;
		};		
		
		this.invalidateListItem = function(app, version, fromStore){			
			// summary:
			//		Refreshes the application lists with the updated info
			
			if(app.version != version){
				return; // show only latest version in lists
			}					
			
			var newItem = this.convertDataToListItems([app])[0];
			var upItem = this.convertDataToListItems([app], "update")[0];
			arr.forEach([this.catalogStore, this.favStore, this.updatesStore], function(store){
				if(fromStore == undefined && store != undefined || 
				   store != undefined && fromStore != store){					
					var litem = store.get(app.pkg);
					if(litem){					
						store.put(store == this.updatesStore ? upItem : newItem);
					}
				}
			});			
		},
					
		this.updateVersionList = function(list, success){
			// summary:
			//		Fills the list with the available version of the currently displayed application (this.appItem).
						
			var vData = [];			
			
			this.getAppInfo(this.appItem, null, lang.hitch(this, function(data){
				arr.forEach(data.versions, function(vItem){
					var vName = this.getVersionName(vItem);
					vItem.pkg = this.appItem.pkg;
					
					vData.push({
						label: vName, 
						rawItem: vItem,
						clickable:true,
						checkClass: "mblDomButtonDarkBlueCheck",
						checked: this.versionItem.version == vItem.version
					});
				}, this);							
				
				var onReady = lang.hitch(this, function(){
					list.setStore(new Memory({data: vData}));
					if(success){
						success(vData);
					}
				});
				
				if(this.isInstalledAppsAccurate){
					var promises = [];
					arr.forEach(vData, function(o){
						promises.push(this.isInstalled(o.rawItem));
					}, this);
					
					all(promises).then(
						lang.hitch(this, function(results){
							arr.forEach(vData, function(o, i){
								if(results[i]){
									vData[i].rightIcon2 = "mblDomButtonInstalledVersion";									
								}
							}, this);
							onReady();
						}));
					
				}else{
					onReady();
				}

			}));			
			
		};
		
		// Workaround for ios7 that has a refresh bug when DOM elements are 
		// shown/hidden/added/removed in a scrollable containers with css translations
		// see Apple BR 15404779
		this.ios7ScrollWA = function(container){
			if(has("ios") >= 7 && container){
				container.containerNode.style["-webkit-transform"] = "";				
			}
		};
		
		lang.mixin(domStyle, {
			hide: function(obj){
				obj = obj.hasOwnProperty("domNode") ? obj.domNode : obj;
				this.set(obj, "display", "none");
			},			
			setD: function(obj, value){
				obj = obj.hasOwnProperty("domNode") ? obj.domNode : obj;
				this.set(obj, "display", value);
			}
		});
		
		
		// Override heading buttons, tab bar buttons and list items
		// to have a customizable touch sensitivity and be more
		// tolerant default setting by default.
		ItemBase.prototype._onTouchMove = function(e){
			// tags:
			//		private
			var x = e.touches ? e.touches[0].pageX : e.clientX;
			var y = e.touches ? e.touches[0].pageY : e.clientY;
			
			var xThreshold = this.thresholdX ? this.thresholdX : 20;
			var yThreshold = this.thresholdY ? this.thresholdY : 10;
			
			if(Math.abs(x - this.touchStartX) >= xThreshold ||
			   Math.abs(y - this.touchStartY) >= yThreshold){ // dojox/mobile/scrollable.threshold
				this.cancel();
				var p = this.getParent();
				if(p && p.selectOne){
					this._prevSel && this._prevSel.set("selected", true);
				}else{
					this.set("selected", false);
				}
			}
		};
		

	};
});
