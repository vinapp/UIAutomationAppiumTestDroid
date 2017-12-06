
/* JavaScript content from js/appcenter/widgets/StoreGrid.js in folder common */
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
	"dojo/_base/connect",
	"dojo/_base/window",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"appcenter/widgets/EdgeToEdgeStoreList"
], function(array, declare, lang, connect, win, topic,domClass, domConstruct, domStyle, EdgeToEdgeStoreList){

	return declare("appcenter.widgets.StoreGrid", EdgeToEdgeStoreList, {
		
		nbColumnLandscape: 3,
		nbColumnPortrait: 2,
		
		// a multiple of 2 and 3
		pageSize: 12,
		maxPages: 9,
		
		startup : function(){
			this.inherited(arguments);
			// make the float elements contribute to the height of the container
			// which is used by the long list mixin.
			this.containerNode.style.overflow = "hidden";
		},
		
		postCreate: function(){
			this.inherited(arguments);
			this.own(topic.subscribe("appcenter/app-resize",lang.hitch(this,this._resizeAll)));
		},
		
		buildRendering: function(){
			this.inherited(arguments);
			domClass.add(this.domNode,"appCenterGrid");
		},

		onComplete: function(items){
			// summary:
			//		A handler that is called after the fetch completes.
			this.inherited(arguments);
			this._updateClasses();
		},

		_updateClasses: function() {
			
			var children = this.getChildren();
			var nbColumn = this.isPortrait() ? this.nbColumnPortrait : this.nbColumnLandscape;
			var width = Math.round(100 / nbColumn) + "%";
			array.forEach(children, function(child, i){
				domClass[i % nbColumn == 0?"add":"remove"](children[i].domNode, "appCenterGridFirstColomn");				
				domStyle.set(children[i].domNode, "width", width);
				child.resize();
			});
		},
		
		_resizeAll: function(evt, root) {
			this._updateClasses();
		},
		
		isPortrait: function(){
			return domClass.contains(win.doc.documentElement,"dj_portrait");
		},
		
		onDelete: function(item, removedFrom){
			this.inherited(arguments);
			this._updateClasses();
		},
			
		onAdd: function(item, insertedInto){
			this.inherited(arguments);
			this._updateClasses();
		}
					
	});
	
});
