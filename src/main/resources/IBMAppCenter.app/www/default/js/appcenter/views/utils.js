
/* JavaScript content from js/appcenter/views/utils.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
        
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/_base/fx",
        "dojo/Deferred",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/fx",
        "dojo/sniff",
        "dojo/string",
        "dojo/topic",
        "dojo/date/stamp",   
        "dojox/mobile/Button",
        "dojox/mobile/ProgressIndicator",
        "dojox/mobile/SimpleDialog",
        "dojo/i18n!appcenter/nls/common"
        ], function (
        		lang,
        		arr,
        		fx,
        		Deferred,
        		domConstruct,
        		domClass,
        		domStyle,
        		coreFx,
        		has,
        		string,
        		topic,
        		stamp,  
        		Button,
        		ProgressIndicator,
        		SimpleDialog,
        		nls
        ){
	return {
		
		parse_url : /(?:(http|https):\/\/)?((?:[0-9.\-A-Za-z]+)(?::\d+)?)(?:\/([^?#]+))?/,
		
		getDescription: function(versionItem){
			return versionItem.description == "" ? nls.noDescription : versionItem.description.replace(/(\r\n|\n|\r)/g,"<br/>");					
		},
		
		getSizeString: function(size, useDeferredFor0){
			var m, n, u, p, s;
			// now format according to KB or MB
			
			var k = size / 1024;
			
			if(k > 1024) {
				m = Math.floor(k / 1024);
				k = k % 1024;
				n = m + k/1000;
				u = nls.fileSizeMbUnit;
				p = 2;
			}else{
				n = k;
				u = nls.fileSizeKbUnit;
				p = 1;
			}
			
			if(size === 0 && !useDeferredFor0){
				return string.substitute(nls.fileSize, {size:0, unit:u});
			}else{
				var def = new Deferred();
				if(navigator.globalization){	
					try{
					navigator.globalization.numberToString(Math.round(n),
						function(res){
							n = res.value;
							s = string.substitute(nls.fileSize, {size:n, unit:u});							
							def.resolve(s);					
						}, function(){
							s = string.substitute(nls.fileSize, {size:-1, unit:u});
							def.resolve(s);
						},
						{
							type : "decimal"
						});
					}catch(e){
						alert(e);
					}
				}else{
					n = Math.round(n);
					s = string.substitute(nls.fileSize, {size:n, unit:u});
					def.resolve(s);
				}
				return def;
			}			
		},
		
		isExecutable: function(file){
			switch(file.rel){
				case "apk":
				case "ipa":
				case "jad":
			    case "xap":
					return true;
			}
			return false;
		},
		
		showToaster: function(message){
			
			if(window.hasOwnProperty("WL") && has("android")){
				WL.Toast.show(message);
				return;
			}	
			
			if(!this.toaster){
				this.toaster = domConstruct.create("div", {className: "toaster", style: "display:none"}, document.body);				
			}
			var n = this.toaster;
			
			if(this.toasterTimer){
				clearTimeout(this.toasterTimer);
			}
			if(this.toasterAnimHide){
				this.toasterAnimHide.stop();
			}
			
			if(this.toasterAnim == null){
				this.toasterAnim = fx.fadeIn({
					start: 0,
					end: 1,
					node:n, 
					onEnd: lang.hitch(this, function(node){						
						this.toasterTimer = setTimeout(lang.hitch(this, function(){
							this.hideToaster();
						}), 1000);
					})
				});
			}else{
				this.toasterAnim.stop();
			}
			
			n.innerHTML = message || "";
			domStyle.set(n, {display: "block", opacity:0});
			
			this.toasterAnim.play(200);												
		},
			

		hideToaster: function(force){
			if(this.toaster){
				if(this.toasterTimer){
					clearTimeout(this.toasterTimer);
				}
				if(this.toasterAnim){
					this.toasterAnim.stop();
				}
				if(this.toasterAnimHide){
					this.toasterAnimHide.stop();
				}
				
				if(force){					
					domStyle.hide(this.toaster);
				}else{
					
					if(this.toasterAnimHide == null){
												
						this.toasterAnimHide = fx.fadeOut({
							start: 0.7,
							end: 0,
							node:this.toaster,
							onEnd: function(node){
								domStyle.hide(node);
							}});
					}
					this.toasterAnimHide.play(200);
				}								
			}
		},
		
		fadeIn: function(nodes, duration, opts){
			duration = duration || 200;
			opts = opts || {start:0, end:1, duration:duration};
			var anims = [];
			arr.forEach(nodes, function(n){
				anims.push(fx.fadeIn(lang.mixin(opts, {node: n.domNode})));
			});
			coreFx.combine(anims).play();
		},
		
		showProgressIndicator: function(show){
			// summary:
			//		Show or hide global progress indicator
			if(!this.progressIndicator){
				
				if(window.hasOwnProperty("WL") && !has("WindowsPhone")){
					this.progressIndicator = new WL.BusyIndicator("content", {text:nls.loadingLabel});					
				}else{
					this.progressIndicator = ProgressIndicator.getInstance({removeOnStop:false, startSpinning:true, size:40, center:true, interval:30});
					var body = document.getElementsByTagName("body")[0];
					body.appendChild(this.progressIndicator.domNode);
					this.progressIndicator.domNode.style.zIndex = 999;
					this.progressIndicatorOverlay = domConstruct.create("div", {style:"background-color:#FFF;opacity:0.001;position:absolute;top:0;bottom:0;left:0;right:0;zIndex:1000"}, body);
				}							
			}
			
			if(window.hasOwnProperty("WL") && !has("WindowsPhone")){
				if(show != this._progressVisible){
					if(show){						
						this.progressIndicator.show();
					}else{
						setTimeout(lang.hitch(this, function(){							
							this.progressIndicator.hide();
						}), 200);
					}					
				}				
			}else{								
				this.progressIndicator[show?"start":"stop"]();
				domStyle.set(this.progressIndicator.domNode, "visibility", show?"visible":"hidden");				
				domStyle.setD(this.progressIndicatorOverlay, show?"block":"none");				
			}
			
			this._progressVisible = show;

		},
		
		ldpiIcon: "icon_ldpi",
		mdpiIcon: "icon_mdpi",
		hdpiIcon: "icon_hdpi",
		xhdpiIcon: "icon_xhdpi",
		defaultIcon: "icon",		
		
		getApplicationIconUrl: function(app, item){
			//	summary:
			//		Returns the icon URL to be used for a given application
							
			var res = null;
			
			if (item.url){
				
				if(this.iconQuality == null){
					this.iconQuality = [this.ldpiIcon, this.mdpiIcon, this.hdpiIcon, this.xhdpiIcon];
				}
				
				var q = this.iconQuality[app.deviceInfo.dpi];
				if(has("android")){
					q = this.iconQuality[Math.max(2, app.deviceInfo.dpi)];
				}
					
				
				var icons = {};
				arr.forEach(item.url, function(url){
					icons[url.rel] = url.link;
				});
				res = icons[q];
				
				if(!res){													
					var q = this.iconQuality.concat();
					while(!res && q.length){
						res = icons[q.pop()];
					}
					if(!res){
						res = icons[this.defaultIcon];
					}
				}
			}
			
			if(res){
			    if(has("WindowsPhone"))
			        res = res + "?transparency=false";
				return res;
			}
			
			return this.defaultAppIcon;	
		},
		
		defaultAppIcon: "css/images/default.png",
		
		showErrorDialog: function(message, title, func, buttonLabel, textAlign){
			// summary:
			//		Display an error dialog
			// message: String
			//		Message to display
			// title: String?
			//		Title of the dialog
			// func: Function?
			//		Function to call when ok/close button was pressed
			//	buttonLabel: String?
			//		Label of the ok/close button
			
			this._errorFunc = func;
			if(this.errDialog == null){
				this.errDialog = new SimpleDialog();
				domClass.add(this.errDialog.domNode, "AlertDialog");
				this.errDialogTitle = domConstruct.create("div", {className: "mblSimpleDialogTitle"}, this.errDialog.containerNode);
				this.errDialogMessage = domConstruct.create("div", {className: "mblSimpleDialogText"}, this.errDialog.containerNode);
				var button = this.errDialogButton = new Button({className:"mblButton baseBtn whiteBtn padded1Button"});
				button.on("click", lang.hitch(this, function(e){
					this.errDialog.hide();
					
					if(this._errorFunc){
						setTimeout(lang.hitch(this, function(){
							this._errorFunc();
							delete this._errorFunc;
						}), 100);						
					}
				}));
				
				topic.subscribe("appcenter/app-resize", lang.hitch(this, function(e){
					if(this.errDialog){
						if(domStyle.get(this.errDialog.domNode, "display") != "none"){
							this.errDialog.refresh();
						}
					}
				}));
				
				this.errDialog.containerNode.appendChild(button.domNode);
				document.body.appendChild(this.errDialog.domNode);
			}
			this.errDialogTitle.innerHTML = title ? title : nls.errorDialogTitle;
			this.errDialogMessage.innerHTML = message;
			domStyle.set(this.errDialogMessage, "text-align", textAlign == undefined ? "center" : textAlign);
			this.errDialogButton.set("label", buttonLabel?buttonLabel:nls.closeButton);
			this.errDialog.show();			
		},
		
		showUpdateNotificationDialog: function(app){
			// summary:
			//		Display an update notification dialog with a go to updates buttons and a cancel button.
			if(this.updateDialog == null){
				this.updateDialog = new SimpleDialog();
				domClass.add(this.updateDialog.domNode, "UpdateDialog");
				domConstruct.create("div", {className: "mblSimpleDialogTitle", innerHTML: nls.updateDialogTitle}, this.updateDialog.containerNode);
				domConstruct.create("div", {className: "mblSimpleDialogText", innerHTML: nls.updateDialogMessage}, this.updateDialog.containerNode);
				var okButton = this.updateDialogButton = new Button({label:nls.okButton, className:"mblButton baseBtn whiteBtn leftButton"});
				okButton.on("click", lang.hitch(this, function(e){
					app.emit("appcenter/showTab", {
						tab: "updates"
					});
					this.updateDialog.hide();
				}));
				var cancelButton = this.updateDialogButton = new Button({label:nls.cancelButton, className:"mblButton baseBtn whiteBtn rightButton"});
				cancelButton.on("click", lang.hitch(this, function(e){					
					this.updateDialog.hide();
				}));
				
				topic.subscribe("appcenter/app-resize", lang.hitch(this, function(e){
					if(this.updateDialog){
						if(domStyle.get(this.updateDialog.domNode, "display") != "none"){
							this.updateDialog.refresh();
						}
					}
				}));
				
				var buttonContainer = domConstruct.create("div", null, this.updateDialog.containerNode);
				
				buttonContainer.appendChild(okButton.domNode);
				buttonContainer.appendChild(cancelButton.domNode);
				document.body.appendChild(this.updateDialog.domNode);
			}			
			this.updateDialog.show();			
		},
		
		showUpdateAppCenterDialog : function(appCenter, appCenterNewApp){
			// summary:
			//		Display an app center update dialog with a trigger update button and a cancel button.
			
			if(this.updateAppCenterDialog == null){
				this.updateAppCenterDialog = new SimpleDialog();
				
				domClass.add(this.updateAppCenterDialog.domNode, "AppCenterUpdateDialog");
				domConstruct.create("div", {className: "mblSimpleDialogTitle", innerHTML: nls.appcenterUpdateDialogTitle}, this.updateAppCenterDialog.containerNode);
				domConstruct.create("div", {className: "mblSimpleDialogText", innerHTML: nls.appcenterUpdateDialogMessage}, this.updateAppCenterDialog.containerNode);
				var okButton = this.updateDialogButton = new Button({label:nls.okButton, className:"mblButton baseBtn whiteBtn leftButton"});
				okButton.on("click", lang.hitch(this, function(e){
					appCenter.installApplication(appCenterNewApp,appCenterNewApp.version, 
						function(){
							//success 
							// nothing to do, the app center will be restarted later on
						}, 
						function(){
							// failure
							alert(nls.appcenterUpdateFailedMessage);
						}
					);
					this.updateAppCenterDialog.hide();
				}));
				var cancelButton = new Button({label:nls.cancelButton, className:"mblButton baseBtn whiteBtn rightButton"});
				cancelButton.on("click", lang.hitch(this, function(e){					
					this.updateAppCenterDialog.hide();
				}));
				
				topic.subscribe("appcenter/app-resize", lang.hitch(this, function(e){
					if(this.updateAppCenterDialog){
						if(domStyle.get(this.updateAppCenterDialog.domNode, "display") != "none"){
							this.updateAppCenterDialog.refresh();
						}
					}
				}));
				
				var buttonContainer = domConstruct.create("div", null, this.updateAppCenterDialog.containerNode);
				
				buttonContainer.appendChild(okButton.domNode);
				buttonContainer.appendChild(cancelButton.domNode);
				document.body.appendChild(this.updateAppCenterDialog.domNode);
			}			
			this.updateAppCenterDialog.show();			
		},

		formatDate:  function(d, options){
			if(typeof d == "string"){
				d = stamp.fromISOString(d);
			}
			var def = new Deferred();
			if(navigator.globalization){
				navigator.globalization.dateToString(d,
					function onSuccess(date) {
						def.resolve(date.value);
					}, function onError() {
						def.resolve("");
					}, options);
			}else{
				def.resolve(d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate());
			}
			return def;
		},
		
		hideKeyboard: function(){
			var activeElement = document.activeElement;
			if(activeElement.blur)
				activeElement.blur();
			var def = new Deferred();
			setTimeout(function(){
				def.resolve();
			}, 500);
			return def;
		}
		
	};
});
