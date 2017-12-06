
/* JavaScript content from js/appcenter/widgets/Button.js in folder common */
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
	"dojo/_base/event",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/on",
	"dojo/touch",
	"dojox/mobile/Button"
], function(
	array,
	declare, 
	lang,
	event,
	win,
	dom,
	domClass,
	on,
	touch, 
	Button){

	return declare("appcenter.widgets.Button", Button, {
		
		disabled: false,
		
		duration: 0,

		postCreate: function(){

			var _this = this;
			
			this.on(touch.press, function(e){
				if(_this.domNode.disabled){
					return;
				}
				_this._press(true);
				_this._moveh = on(win.doc, touch.move, function(e){
					var inside = false;
					for(var t = e.target; t; t = t.parentNode){
						if(t == _this.domNode){
							inside = true;
							break;
						}
					}
					_this._press(inside);
				});
				_this._endh = on(win.doc, touch.release, function(e){
					_this._press(false);
					_this._moveh.remove();
					_this._endh.remove();
				});
			});

			dom.setSelectable(this.focusNode, false);
			this.connect(this.domNode, "onclick", "_onClick");
		},

		_press: function(pressed){
			if(pressed != this._pressed){
				this._pressed = pressed;
				var button = this.focusNode || this.domNode;
				var newStateClasses = (this.baseClass+' '+this["class"]).split(" ");
				newStateClasses = array.map(newStateClasses, function(c){ return c+"Selected"; });
				(pressed?domClass.add:domClass.remove)(button, newStateClasses);
			}
		},
		
		_setDisabledAttr: function(value){
			this._set("disabled", value);
			domClass[value?"add":"remove"](this.domNode, "mblDisabled");
		},
		
		_setSelectedAttr: function(value){
			if(this.disabled){return;}
			this.inherited(arguments);
		},
		
		_onClick: function(){
			if(this.disabled){return;}
			this.inherited(arguments);
		}
					
	});
	
});
