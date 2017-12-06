
/* JavaScript content from js/appcenter/widgets/EdgeToEdgeStoreList.js in folder common */
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
	"dojo/when",
	"dojox/mobile/EdgeToEdgeStoreList",
	"dojox/mobile/LongListMixin",
	"appcenter/widgets/AppListItem",
	"appcenter/widgets/ReviewListItem",
	"appcenter/widgets/ListItem"
], function(array, declare, lang, domClass, domConstruct, domStyle, when, EdgeToEdgeStoreList, LongListMixin, AppListItem, ReviewListItem, ListItem){

	return declare("appcenter.widgets.EdgeToEdgeStoreList", [EdgeToEdgeStoreList, LongListMixin], {
		
		pageSize: 10,
		
		maxPages: 3,
		
		type: null,
		
		onItemClick: function(item){},
		
		onItemRemove: function(item){},
			
		onDelete: function(/*Object*/item, /*Number*/removedFrom){
			var w = this.getChildren()[removedFrom];
			this.removeChild(w);
			w.destroyRecursive();
		},
	
		createListItem: function(/*Object*/item){
			// summary:
			//		Creates a list item widget.
			var props = {};
			if(!item["label"]){
				props["label"] = item[this.labelProperty];
			}
			for(var name in item){
				props[(this.itemMap && this.itemMap[name]) || name] = item[name];
			}
			
			var li;
			if(this.type == "feedback"){
				li = new ReviewListItem(props);
			}else if(this.type == "app"){
				li = new AppListItem(props);
			}else{
				li = new ListItem(props);
			}
			return li;
		},
		
		_setEditableAttr: function(value){
			this._set("editable", value);
			array.forEach(this.getChildren(), function(child){
				child.set("editable", value);
			});
		}
					
	});
	
});
