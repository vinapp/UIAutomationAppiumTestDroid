
/* JavaScript content from js/appcenter/widgets/ReviewListItem.js in folder common */
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
	"appcenter/widgets/ListItem",
	"appcenter/widgets/Rating"
], function(array, declare, lang, domClass, domConstruct, domStyle, ListItem, Rating){

	return declare("appcenter.widgets.ReviewListItem", ListItem, {
		
		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.domNode.className = "mblListItem";
			
			this.labelNode =
				domConstruct.create("div", {className:"mblListItemLabel", style:'position:absolute;display:none'});
			
			this.domNode.appendChild(this.labelNode);
			
			var centerNode = domConstruct.create("div", null, this.domNode);
			
			this.authorNode =
				domConstruct.create("span", {className:"mblListItemAuthor", style: "display:inline-block"}, centerNode);
			
			this._rating = new Rating({editable:false, baseClass: "mblSmallRating", style: "display:inline-block"});
			centerNode.appendChild(this._rating.domNode);
			
			this.versionNode =
				domConstruct.create("div", {className:"mblListItemVersion"}, centerNode);
			
			this.createdNode =
				domConstruct.create("div", {className:"mblListItemCreated"}, centerNode);
			
			this.feedbackNode =
				domConstruct.create("div", {className:"mblListItemFeedback"}, centerNode);
			
			this._layoutChildren = [];
		},
		
		rating: 0,
		
		_setRatingAttr: function(value){
			this._set("rating", value);
			if(this._rating){
				this._rating.set("value", value/2);
			}
		},
		
		user_display: "",
		
		_setUser_displayAttr: function(value){
			this._set("user_display", value);
			if(this.authorNode){
				this.authorNode.innerHTML = value;
			}
		},
		
		label: "",
		
		comment: "",
		
		_setCommentAttr: function(value){
			this._set("comment", value);
			if(this.feedbackNode){
				this.feedbackNode.innerHTML = value ? value.replace(/(\r\n|\n|\r)/g,"<br/>") : "";
			}
		},
		
		created: "",
		
		_setCreatedAttr: function(value){
			this._set("created", value);
			if(this.createdNode){
				this.createdNode.innerHTML = value;
			}
		},
		
		version: "",
		_setVersionAttr: function(value){
			this._set("version", value);
			if(this.versionNode){
				domStyle.setD(this.versionNode, value != "" ? "block" : "none");				
				this.versionNode.innerHTML = value;
			}
		}
					
	});
	
});
