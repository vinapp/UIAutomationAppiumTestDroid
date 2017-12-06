
/* JavaScript content from js/appcenter/widgets/AppListItem.js in folder common */
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
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/on",
	"dojo/sniff",
	"appcenter/widgets/ListItem",
	"appcenter/widgets/Rating",
	"dojo/i18n!appcenter/nls/common"
], function(array, declare, lang, domClass, domConstruct, domStyle, on, has, ListItem, Rating, nls){

	return declare("appcenter.widgets.AppListItem", ListItem, {
		
		clickable: true,
		
		onRemove: function(){
			var p = this.getParent();
			if(p.onItemRemove != undefined){
				p.onItemRemove(this);
			}
		},
		
		buildRendering: function(){

			this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.domNode.className = "mblListItem";
			
			this.labelNode =
				domConstruct.create("div", {className:"mblListItemLabel", style:"display:none"});
			
			var centerNode = this.centerNode = domConstruct.create("div", {"layout": "center"}, this.domNode);
			
			this.titleNode =
				domConstruct.create("div", {className:"mblListItemLabel", style:"display:inline-block;width:100%"}, this.centerNode);
			
			domClass.add(this.domNode, "mblSmallRating");
			this.favNode =
				domConstruct.create("div", {className:"mblStarRatingIcon", style:"display:none;left:14px;bottom:10px;position:absolute"}, this.domNode);
			
			this.linkNode =
				domConstruct.create("div", {className:"mblAppLinkIcon", style:"display:none;left:63px;bottom:10px;position:absolute"}, this.domNode);
			
			this.versionNode =
				domConstruct.create("div", {className:"mblListItemLabel mblListItemVersion"}, centerNode);
						
			this._rating = new Rating({editable:false, baseClass: "mblSmallRating", style:"display:inline-block"});
			centerNode.appendChild(this._rating.domNode);
			
			this.nbRatingNode =
				domConstruct.create("span", {className:"nbRating"}, centerNode);
			
			if(this.anchorLabel){
				this.labelNode.style.display = "inline"; // to narrow the text region
				this.labelNode.style.cursor = "pointer";
				this._anchorClickHandle = this.connect(this.labelNode, "onclick", "_onClick");
				this.onTouchStart = function(e){
					return (e.target !== this.labelNode);
				};
			}
			
			if(has("WindowsPhone")){
				domClass.add(this.domNode, "WindowsPhone");
			}
				
			
			this._layoutChildren = [];
		},
		
		editable: false,
		
		_setEditableAttr: function(value){
			this._set("editable", value);
			this.set("clickable", !value);
			
			domClass[value?"add":"remove"](this.domNode, "mblListItemEdited");
			domStyle.setD(this.rightIconNode, !value?"inline":"none");
			domStyle.setD(this.deleteNode, value?"inline":"none");
		},
		
		rating: 0,
		
		_setRatingAttr: function(value){
			this._set("rating", value);
			if(this._rating){
				this._rating.set("value", value);
			}
		},
		
		nbRating: 0,
		
		_setNbRatingAttr: function(value){
			this._set("nbRating", value);
			if(this.nbRatingNode){
				this.nbRatingNode.innerHTML = "("+value+")";
			}
		},
		
		_setLabelAttr: function(value){
			this._set("label", value);
			if(this.titleNode){
				this.titleNode.innerHTML = value;
			}
		},
		
		version: '',
		
		_setVersionAttr: function(value){
			this._set("version", value);
			if(this.versionNode){
				this.versionNode.innerHTML = value;
			}
		},
		
		favorite: false,
		
		_setFavoriteAttr: function(value){
			this._set("version", value);
			if(this.favNode){
				domStyle.setD(this.favNode, value?"block":"none");
			}
		},
		
		_setIsAppLinkAttr: function(value){
			this._set("isAppLinkAttr", value);
			if(this.linkNode){
				domStyle.setD(this.linkNode, value?"block":"none");							
			}			
			if(this.versionNode){
				domStyle.setD(this.versionNode, !value?"block":"none");
			}
		},
		
		__eof: ''
					
	});
	
});
