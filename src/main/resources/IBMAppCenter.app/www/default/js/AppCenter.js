
/* JavaScript content from js/AppCenter.js in folder common */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

function wlCommonInit(){

	var loadApp = function(locale){					
		require(["dojo/_base/config", "dojo/sniff"], function(config, has){
			
			// on iOS getLocaleName returns the region format and not the device locale.
			if(has("android") < 3){
				config.locale = locale;
			}				
			require(["./js/src.js"], function(){
				// app loaded
			});					
		});				
	};
	
	navigator.globalization.getLocaleName(
        function(locale) {
        	// transform ab_CD into ab-cd format
        	var locale = locale.value.toLowerCase().replace("_", "-");
        	loadApp(locale);
        },
        function(){
        	// locale not found, use dojo method to determine locale.
        	loadApp();
        }
   );	

}

/* JavaScript content from js/AppCenter.js in folder iphone */
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

// This method is invoked after loading the main HTML and successful initialization of the Worklight runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}