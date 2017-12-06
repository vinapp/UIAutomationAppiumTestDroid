
/* JavaScript content from js/appcenter/widgets/ListItem.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojox/mobile/ListItem"
], function(declare, lang, ListItem){

	return declare("appcenter.widgets.ListItem", ListItem, {

		_delayedSelection: false,
		selectable: true,
		
		clickable: true,
		
		thresholdX: 200,
		thresholdY: 5,
		
		onClick: function(){
			if(this.editable){
				return;
			}
			var p = this.getParent();
			if(p.onItemClick != undefined){
				p.onItemClick(this);
			}
		},
		
		_setSelectedAttr: function(value){
			if(this.selectable){
				this.inherited(arguments);
			}
		}
	});
	
});
