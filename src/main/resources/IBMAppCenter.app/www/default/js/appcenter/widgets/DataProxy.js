
/* JavaScript content from js/appcenter/widgets/DataProxy.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
"dojo/_base/array",
"dojo/_base/declare",
"dojo/_base/lang",
"dojo/_base/config",
"dojo/Deferred",
"dojo/io-query",
"dojo/request",
"dojo/json",
"dojox/encoding/base64"
], function(
arr,
declare,
lang,
config,
Deferred,
ioq,
req,
json,
b64
) {
	
	// central place for all the data request to the server.

var dataProxy = lang.getObject("appcenter.widgets.DataProxy", true);

dataProxy.timeout = 20000;
dataProxy.attemptCount = 3;

dataProxy.addTask = function(f, method, url){
	var def = new Deferred();
	dataProxy.execTask(f, def, dataProxy.attemptCount, method, url);
	return def;
};

dataProxy.execTask = function(f, def, count, method, url){		
	f().then(
		function(data){
			app.logM("RestService", "INFO", "Request successfully received: " + method + " " + url);
			def.resolve(data);
		},
		function error(e){
			if(count == 1 || e.dojoType != "timeout" && e.name != "RequestTimeoutError"){ // retry on timeout
				app.logM("RestService", "ERROR", "Request error on " + url);
				def.reject(e);
			}else{				
				dataProxy.execTask(f, def, count-1, url);
			}
		});		
};

var reqFunc = function(method){
	return function(url, opts){
		app.logM("RestService", "INFO", "Request sent: "+ method + " " + url);
		return dataProxy.addTask(function(){
			return req[method](url, opts);
		}, method, url);
	};
};

var reqFuncLog = function(method){
	return function(url, opts){
		app.logM("RestService", "INFO", "Request sent: "+ method + " " + url);		
		return req[method](url, opts);		
	};
};

var request = {
		get: reqFunc("get"),
		del: reqFuncLog("del"),
		post: reqFuncLog("post"),
		put: reqFuncLog("put")
};

dataProxy.encodeURI = function(uri){
	//	summary:
	//		When the application package is part of the URL of a RESTful service, some encoding is needed to prevent server errors.
	//		As a matter of fact, if a slash '/' is in the uri, the mapping to the RESTful service will fail.
	return uri == null ? null : uri.replace(/\//g, "%252F").
									replace(/\\/g, "%255C").
									replace(/\?/g, "%253F").
									replace(/\;/g, "%253B").
									replace(/\#/g, "%2523");
};

dataProxy.getBase64Auth = function(pUsername, pPassword) {    			
	var source = pUsername + ":" + pPassword;
	var b = [];
	var len = source.length;
	for(var i = 0; i < len; ++i){
		b.push(source.charCodeAt(i));
	}		
	var ret = "Basic " + b64.encode(b);
	return ret; 			
};

dataProxy.initServiceContext = function(loginParams){
	
	if(!config.appcenter){
		config.appcenter = {};
	}
	this.serviceContext = loginParams.serverURL + "/service/";
	config.appcenter.authToken = dataProxy.getBase64Auth(loginParams.username, loginParams.password);
	return this.serviceContext;
};

dataProxy.auth = function(){
	var url = this.serviceContext + "auth";		
	return request.get(url, {
		headers: {
			Authorization: config.appcenter.authToken
		},
		preventCache: true,
		timeout: this.timeout					
	});
};

dataProxy.getJsonOpts = function(data){
	// summary:	
	//		Default options to passe to dojo/request object.
	return {
		headers: {
			Authorization: config.appcenter.authToken,
			"Content-Type": "application/json"
		},
		preventCache: true,
		timeout: this.timeout,
		data: data ? json.stringify(data) : null,
		handleAs: "json"			
	};	
};

dataProxy.getDevice = function(id){
	var url = this.serviceContext + "device/" + id;
	return request.get(url, this.getJsonOpts());
};

dataProxy.registerDevice = function(device){
	var url = this.serviceContext + "device";
	return request.post(url, this.getJsonOpts(device));
};

dataProxy.getCatalog = function(deviceId, queryOpts){
	var opts = this.getJsonOpts();
	opts.query = lang.mixin({"exclude_installed": false}, queryOpts);
	var url = this.serviceContext + "device/" + deviceId + "/catalog";
	return request.get(url, opts);
};

dataProxy.getFavorites = function(deviceId, queryOpts){
	var opts = this.getJsonOpts();
	opts.query = lang.mixin({"condense": true}, queryOpts);
	var url = this.serviceContext + "device/" + deviceId + "/favorites";
	return request.get(url, opts);
};

dataProxy.setFavorite = function(app, value, queryOpts){
	var opts = this.getJsonOpts({is_favorite: value?"Y":"N"});
	opts.query = queryOpts;
	var url = this.serviceContext + "favorites/" + app.os + "/" + dataProxy.encodeURI(app.pkg);
	return request.put(url, opts);
};

dataProxy.getReviewsURL = function(app, version){
	if(version == null){
		return this.serviceContext + "application/combinedfeedback/" + app.os + "/" + dataProxy.encodeURI(app.pkg);
	}
	return this.serviceContext + "application/feedback/" + app.os + "/" + dataProxy.encodeURI(app.pkg) + "/" + version;
};

dataProxy.getReviews = function(app, version, queryOpts){	
	var opts = this.getJsonOpts();
	opts.query = ioq.objectToQuery(queryOpts);
	return request.get(this.getReviewsURL(app, version), opts);
};

dataProxy.sendReview = function(app, version,feedback){	
	return request.post(this.getReviewsURL(app, version), this.getJsonOpts(feedback));
};

dataProxy.reportInstallApp = function(deviceId, app, version){
	var url = this.serviceContext + "device/" + deviceId + "/package";
	var o = {
		pkg: app.pkg,
		version: version,
		to_update: false
	};
	return request.post(url, this.getJsonOpts(o));
};

dataProxy.reportUninstallApp = function(deviceId, app, version){
	var url = this.serviceContext + "device/" + deviceId + "/package/" + dataProxy.encodeURI(app.pkg);	
	return request.del(url, this.getJsonOpts());
};

dataProxy.getUpdates = function(deviceId){
	var url = this.serviceContext + "device/" + deviceId + "/updates";
	return request.get(url, this.getJsonOpts());
};

dataProxy.getInstalledApps = function(deviceId, queryOpts){
	var url = this.serviceContext + "device/" + deviceId + "/package";
	var opts = this.getJsonOpts();
	if(opts != undefined){		
		opts.query = ioq.objectToQuery(queryOpts);
	}
	return request.get(url, opts);
};

dataProxy.getAppInfo = function(deviceId, app, version, queryOpts){
	var opts = this.getJsonOpts();
	if(opts != undefined){		
		opts.query = ioq.objectToQuery(queryOpts);
	}

	var url = this.serviceContext + "device/" + deviceId + "/catalog/" + dataProxy.encodeURI(app.pkg+"@"+dataProxy.os);
	if(version == undefined){
		version = app.version;
	}
		
	url += "/" + version;
		
	return request.get(url, opts); 
};

dataProxy.synchronizeInstalledApps = function(deviceId, list, queryOpts){
	var data = { apps: list };
	var url = this.serviceContext + "device/" + deviceId + "/synchronization";
	return request.put(url, this.getJsonOpts(data));
};


return dataProxy;

});