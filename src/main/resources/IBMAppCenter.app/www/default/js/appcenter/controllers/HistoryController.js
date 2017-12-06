
/* JavaScript content from js/appcenter/controllers/HistoryController.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define(["dojo/_base/lang", 
        "dojo/_base/declare",
        "dojo/on",
        "dojo/sniff",
        "dojox/app/Controller",
        "dojox/mobile/TransitionEvent"
        ],
function(lang, declare, on, has, Controller, TransitionEvent){
	return declare("appcenter.controllers.HistoryController", Controller, {

		constructor: function(app, events){
			this.app = app;
			this.events = {
				"appcenter/createStack": this.createStack,
				"appcenter/removeStack": this.removeStack,				
				"appcenter/pushViewOnStack": this.pushView,
				"appcenter/popViewFromStack": this.popView,
				"appcenter/switchToStack": this.switchToStack,
				"appcenter/show": this._moveToImpl
			};
			if(has("android")){
				this.registerBackButton();
			}
		},
			
		switchToStack: function(event){
			var s = this.app.stacks[event.stack];			
			
			if(s == null || s.length == 0){
				throw new Error();
			}
			
			this.app.currentStack = event.stack;
			var v = s[s.length - 1];
			
			if(v.data){
				event.data = lang.mixin(v.data, event.data);
			}					
			
			this._moveToImpl({
				data: event.data,
				target: v.target,
				targetLabel: v.targetLabel,
				transition: event.transition,
				transitionDir: event.transitionDir
			});
		},
		
		createStack: function(event){			
			this.app.stacks[event.stack] = [];			
			if(event.target){
				this.pushView(event);
			}
		},
		
		removeStack: function(event){
			delete this.app.stacks[event.stack];
		},			
		
		pushView: function(event){
			if(!event.target){
				return;
			}
							
			var s = this.app.stacks[this.app.currentStack];
			if(event.stack){
				s = this.app.stacks[event.stack];
			}else{
				event.stack = this.app.currentStack;
			}			
			if(s == null){
				throw new Error();
			}
			
			if (typeof event.forceRank != "undefined"){
				while (s.length > event.forceRank){
					s.pop();
				}
			}
			
			s.push({
				label: event.targetLabel,
				target: event.target,
				data: event.data
			});
			
			if(s.length > 1){
				this.registerBackButton();
			}
			
			if(event.stack == this.app.currentStack){			
				this._moveToImpl(event);
			}
		},
		
		popView: function(event){
			var s = this.app.stacks[this.app.currentStack];
			if(event.stack){
				s = this.app.stacks[event.stack];
			}
			if(s == null || s.length < 2){
				// if there's no view to pop, quit the application
				if(has("android")){
					navigator.app.exitApp();
				}
				return;
			}
			
			// pop current view
			s.pop();
			
			if(has("WindowsPhone")  && s.length == 1 && this._backHandler){
				this._backHandler.remove();
				this._backHandler = null;				
			}
			
			var t = s[s.length-1].target;			
			
			this._moveToImpl({target:t, transition:"slide", transitionDir:-1});
		},
		
		_moveToImpl: function(event){
						
			var source = event.view ? event.view : this.app;
			
			var transOpts = {
					target: event.target,
					data: event.data,
					url: "#"+event.target,
					transition: event.transition,
					transitionDir: event.transitionDir == undefined ? 1 :event.transitionDir
				};
			new TransitionEvent(source.domNode, transOpts, event.data).dispatch();			
		},
		
		registerBackButton: function(){
			if(!this._backHandler){
				this._backHandler = on(document, "backbutton", lang.hitch(this, function(){
					if(this._backTimer === undefined || (new Date()).getTime() - this._backTimer > 1000){
						// protect against double touch
						this.app.emit("appcenter/popViewFromStack", {});
						this._backTimer = (new Date()).getTime();
					}
				}));
			}
		}
		
	});
});
