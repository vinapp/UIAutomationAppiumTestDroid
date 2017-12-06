
/* JavaScript content from js/appcenter/widgets/TabBarButton.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojox/mobile/TabBarButton"
], function(declare, lang, domClass, TabBarButton){

	return declare("appcenter.widgets.TabBarButton", TabBarButton, {
		
		disabled: false,
		
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
