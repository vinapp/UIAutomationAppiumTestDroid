
/* JavaScript content from js/appcenter/views/ReviewsBase.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
        "dojo/_base/declare",
        "dojo/_base/lang", 
        "dojo/_base/array",
        "dojo/DeferredList",
        "dojo/dom-style", 
        "dojo/string",
        "dojo/topic",
        "dojo/store/Memory",
        "dojox/app/View",
        "appcenter/views/utils"], 
    function(
    		declare,
    		lang,
    		arr,
    		DeferredList,
    		domStyle,
    		string,
    		topic,
    		Memory,
    		View,
    		utils){

	return declare("appcenter.views.ReviewsBase", View, {
		
		// pageSize: Integer
		//		The number of elements loaded at initial time or when the load more button is clicked.
		pageSize: 10,
		
		init: function(){
			
			topic.subscribe("appcenter/clearCache", lang.hitch(this, function(e){
				this.appItem = null;
				this.versionItem = null;
			}));
			
		},
		
		
		clearList: function(){
			this.list.set("append", false);
			this.list.setStore(new Memory());
			domStyle.hide(this.loadButton);				
			this.eltCount = 0;			
		},
		
		beforeActivate: function(){	
			this.app.logM("Navigation", "INFO", "Navigated to reviews view");
			this.configureViewBase();
		},
		
		configureViewBase: function(){
			this.invalidated = this.isInvalidated();
			
			this.configureView();
			
			if(this.invalidated){
				this.clearList();
			}
			this.container.scrollTo(0); // reset scroll position
			
			// load of review must be called explicitly
		},
		
		configureView: function() {
			
			
		},
		
		isInvalidated: function(){
			// summary:
			//		Checks whether the currently displayed data is consistent 
			//		with the info that needs to be displayed by this view.
			
			return this.reviewListInvalidated || // a feedback has been sent
				this.appItem == null || 
				this.appItem.pkg !=  this.app.appItem.pkg || // different app is displayed
				this.versionItem == null && this.app.versionItem != null || //difference version of app displayed
				this.versionItem != null && this.app.versionItem == null ||
				this.versionItem != null && this.app.versionItem != null && this.versionItem.version != this.app.versionItem.version;
		},
				
		loadReviews: function(append){
			
			this.invalidated = false;
			this.reviewListInvalidated = false;
			var item = this.appItem;
			var v = item.isAppLink ? item : this.versionItem;
			
			this.list.set("append", append);
			
			this.app.getReviews(item, v == null ? null : v.version, this.eltCount, this.pageSize, "-created", lang.hitch(this, function(data){
				this.eltCount += this.pageSize;
				
				domStyle.setD(this.noReview, data.listSize>0 ? "none" : "block");
				
				var dl = [];			
				var items = arr.map(data.items, function(o){
					var vl = "";
					if(!v){
						vl = string.substitute(this.nls.detailsVersion, {version: o.package_versionName !== "" ? o.package_versionName : o.package_version});
					}
					o.version = vl;
					dl.push(utils.formatDate(o.created));
					o.label = "";
					o.selectable = false;
					return o;
				}, this);
				
				var defList = new DeferredList(dl);
				defList.then(lang.hitch(this, function(res){
					arr.forEach(items, function(item, i){
						item.created = res[i][1];
					});
					
					this.list.setStore(new Memory({data:items}));
					domStyle.setD(this.loadButton, data.listSize > this.eltCount ? "inline-block" : "none");
					domStyle.set(this.list.domNode, "visibility", "visible");
				}));

			}),
			this.app.getErrHandler(null, lang.hitch(this, function(e, messsage){
				domStyle.setD(this.noReview, "block");
				utils.showErrorDialog(message);
			})));
		}
	
	});
});
