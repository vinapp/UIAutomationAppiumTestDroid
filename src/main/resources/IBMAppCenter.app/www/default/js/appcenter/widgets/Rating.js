
/* JavaScript content from js/appcenter/widgets/Rating.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/on",
	"dijit/_WidgetBase",
	"dojox/mobile/iconUtils"
], function(array, declare, event, lang, domConstruct, domClass, on, WidgetBase, iconUtils){

	// module:
	//		appcenter/widgets/Rating

	return declare("appcenter.widgets.Rating", WidgetBase, {
		// summary:
		//		A widget that shows rating with stars.
		// description:
		//		This widget showing a stars and half stars.
		//		It allows to set the rating by touching or clicking stars (full stars only).

		// numStars: Number
		//		The number of stars to show.
		numStars: 5,

		// value: Number
		//		The current value of the Rating.
		value: 0,
		
		// editable: Boolean
		//		Whether the widget value can be changed on or not.
		editable: false,
		
		// allowZero: Boolean
		//		If the widget is editable, indicates that the value 0 
		//		can be set by touching or clicking the star displaying the value. 
		allowZero: false,

		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "mblRating",			
			
		// cssStarHalf: String
		//		The CSS class to apply to an empty star.
		cssStarEmpty: "mblStarRatingEmpty",
		
		// cssStarHalf: String
		//		The CSS class to apply to a half star.
		cssStarHalf: "mblStarRatingHalf",
		
		// cssStarFull: String
		//		The CSS class to apply to a full star.
		cssStarFull: "mblStarRatingFull",		
		
		_getHandler: function(i){
			return lang.hitch(this, function(e){
				if(this.editable){
					var v = i+1;
					if(this.value == v && this.allowZero){
						v = 0;
					}
					this._onChange(v);
					event.stop(e);
					e.preventDefault();
				}
			});
		},
		
		postCreate: function(){
			domClass.add(this.domNode, this.baseClass);
		},
					
		_setNumStarsAttr: function(value){
			
			this._stars = [];
			domConstruct.empty(this.domNode);
			
			// should not happen often, so rebuild all			
			for(var i=0;i<value; i++){
				var node = domConstruct.create("img", {"class": "mblStarRatingIcon"}, this.domNode);
				node.src = this._blankGif;				
				this.own(on(node, "click", this._getHandler(i)));
				this.own(on(node, "touchstart", this._getHandler(i)));				
				this._stars.push(node);
			}
								
			this._set("numStars", value);			
			this._set("value", this.value);
		},

		_setValueAttr: function(/*Number*/value){
			// summary:
			//		Sets the value of the Rating.
			// tags:
			//		private
			value = value || 0;
			value = value<0?0:value>this.numStars?this.numStars:value;
			
			var fValue = Math.floor(value);			
			var diff = value - fValue;
			var dValue = diff <  0.25 ? fValue : fValue + (diff > 0.75 ? 1 : 0.5);
			var starValue = dValue;
			
			array.forEach(this._stars, lang.hitch(this, function(starNode, i){				
				domClass.remove(starNode, [this.cssStarFull, this.cssStarHalf, this.cssStarEmpty]);
				var cls = this.cssStarEmpty;
				if (starValue > 0 ){
					cls = starValue < 1 ? this.cssStarHalf : this.cssStarFull; 						
					starValue--;
				}
				domClass.add(starNode, cls);
			}));
			this._set("value",value);
		},
		
		_onChange: function(value){
			this.set("value", value);
			this.onChange(value);
		},
		
		onChange: function(value){
			
		}
	});
});
