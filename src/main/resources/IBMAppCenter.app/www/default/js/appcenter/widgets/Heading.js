
/* JavaScript content from js/appcenter/widgets/Heading.js in folder common */
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
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/on",
	"dojo/sniff",
	"dojox/mobile/Heading",
	"dojox/mobile/ToolBarButton",
	"dojox/mobile/TransitionEvent"
], function(array, declare, lang, domConstruct, domClass, domStyle, on, has, Heading, ToolBarButton, TransitionEvent){

	return declare("appcenter.widgets.Heading", Heading, {
		
		buildRendering: function(){
			this.inherited(arguments);
			if(has("android")){
				this.backNode = domConstruct.create("div", {			
					style:"position:absolute;width:100px;top:0;bottom:0;background-color:tranparent"+(this.isLeftToRight()?"left:15px;":"right:15px;")
				}, this.domNode);
			}
			
		},
		
		_setBackAttr: function(value, to){
			
			if (value){
				
				this._set("back", value);
								
				if(!this.backButton){
					var backFunc = lang.hitch(this, function(){						
						this.onBackClick();											
						return true;
					});					
					this.backButton = new ToolBarButton({
						arrow: "left",
						label: value
					});
					this.backButton.on("click", backFunc);
					this.backButton.placeAt(this.domNode, "first");
					if(this.backNode){
						this.own(on(this.backNode, "click", backFunc));						
					}
				}else{
					this.backButton.set("label", value);
				}
				
				this.resize();																
			}
		},
		
		onBackClick: function(){},
		
		// override resize to fix the title in small size.
		resize: function(){
			if(this.labelNode){
				// find the rightmost left button (B), and leftmost right button (C)
				// +-----------------------------+
				// | |A| |B|             |C| |D| |
				// +-----------------------------+
				var leftBtn, rightBtn;
				var children = this.containerNode.childNodes;
				for(var i = children.length - 1; i >= 0; i--){
					var c = children[i];
					if(c.nodeType === 1 && domStyle.get(c, "display") !== "none"){
						if(!rightBtn && domStyle.get(c, "float") === "right"){
							rightBtn = c;
						}
						if(!leftBtn && c != this.labelNode && domStyle.get(c, "float") === "left"){
							leftBtn = c;
						}
					}
				}

				if(!this.labelNodeLen && this.label){
					this.labelNode.style.display = "inline";
					this.labelNodeLen = this.labelNode.offsetWidth;
					this.labelNode.style.display = "";
				}

				var bw = this.domNode.offsetWidth; // bar width
				var rw = rightBtn ? bw - rightBtn.offsetLeft + 5 : 0; // rightBtn width
				var lw = leftBtn ? leftBtn.offsetLeft + leftBtn.offsetWidth + 5 : 0; // leftBtn width
				var tw = this.labelNodeLen || 0; // title width
				var center = bw - Math.max(rw,lw)*2 > tw;
				if(!center || has("android")){ // on Android per OneUI the div is never used...
					domStyle.set(this.labelNode, "max-width", (bw - rw - lw - (has("android")?16:0)) + "px");
				}
				domClass[center ? "add" : "remove"](this.domNode, "mblHeadingCenterTitle");
			}
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		}
	});
	
});
