
/* JavaScript content from js/appcenter/views/tablet/Description.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
        "dojo/_base/lang", 
        "dojo/topic",
        "appcenter/views/utils"], 
    function(
    		lang,
    		topic,
    		utils){
	return {
		init: function(){
			
			topic.subscribe("appcenter/updateDescription", lang.hitch(this,function(str){				
				this.description.innerHTML = str;
			}));
			
		},
		
		afterActivate: function(){			
			this.app.logM("Navigation", "INFO", "Navigated to Description view");
			topic.publish("appcenter/details/updateTabButton", "description");
		}
		
	};
	
});