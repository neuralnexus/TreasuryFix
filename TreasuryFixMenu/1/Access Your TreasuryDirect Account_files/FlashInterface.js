// Flash Player Version Detection - Rev 1.5
// Detect Client Browser type
// Copyright(c) 2005-2006 Adobe Macromedia Software, LLC. All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;


// ------- Private vars -------
var jsReady = false;
var swfReady = false;

// ------- functions called by ActionScript -------
// called to check if the page has initialized and JavaScript is available
function isReady()
{
	return jsReady;
}

var flash_callback;

// called to notify the page that the SWF has set it's callbacks
function setSWFIsReady()
{
	// record that the SWF has registered it's functions (i.e. that JavaScript
	// can safely call the ActionScript functions)
	swfReady = true;
	
	if ((flash_callback != null) && (flash_callback != ""))
	{
		eval(flash_callback);
	}
}

// ------- event handling -------
// called by the onload event of the <body> tag
function InitializeFlash(callback) 
{
	// set the flash callback if one is provided
	if ((callback != null) && (callback != ""))
	{
		flash_callback = callback;
	}
	
	// record that JavaScript is ready to go.
	jsReady = true;
}

// called when the "Store" button is pressed; the value in the text field
// is passed in as a parameter.
function storeData(objectLabel, formElem)
{
	if (swfReady)
	{
		// if the SWF has registered it's functions, set the locally stored data
		var toStore = formElem.value;
		formElem.value = "";
		getSWF("LocalStore").setStoredData(objectLabel, toStore);
	}
}

// called when the "Retrieve" button is pressed; the value in the messageText text field
// is set to the value stored in the flash application.
function retrieveData(objectLabel, formElem)
{
	if (swfReady)
	{
		// if the SWF has registered it's functions, get the locally
		// stored data
		var storedData = getSWF("LocalStore").getStoredData(objectLabel);
		formElem.value = storedData;
	}
}

// Gets a reference to the specified SWF file by checking which browser is
// being used and using the appropriate JavaScript.
// Unfortunately, newer approaches such as using getElementByID() don't
// work well with Flash Player/ExternalInterface.
function getSWF(movieName)
{
	if (navigator.appName.indexOf("Microsoft") != -1) 
	{
		return window[movieName];
	}
	else
	{
		var val = document[movieName];
		// The script that creates the embedded object creates multiple
		// elements with the same ID - we need the one associated
		// with the EMBED element.
		if (val.length)
		{
			var i = 0;
			for (i = 0; i < val.length; ++i)
			{
				if (val[i].nodeName == "EMBED" || val[i].nodeName == "embed")
				{
					return val[i];
				}
			}
		}
		return val;
	}
}
	
function ControlVersion()
{
	var version;
	var axo;
	var e;

	// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry

	try {
		// version will be set for 7.X or greater players
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} catch (e) {
	}

	if (!version)
	{
		try {
			// version will be set for 6.X players only
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			
			// installed player is some revision of 6.0
			// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
			// so we have to be careful. 
			
			// default to the first public version
			version = "WIN 6,0,21,0";

			// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
			axo.AllowScriptAccess = "always";

			// safe to call for 6.0r47 or greater
			version = axo.GetVariable("$version");

		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 4.X or 5.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 3.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 2.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} catch (e) {
			version = -1;
		}
	}
	
	return version;
}

// JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer()
{
	// NS/Opera version >= 3 check for Flash plugin in plugin array
	var flashVer = -1;
	
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;			
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			if ( descArray[3] != "" ) {
				tempArrayMinor = descArray[3].split("r");
			} else {
				tempArrayMinor = descArray[4].split("r");
			}
			var versionRevision = tempArrayMinor[1] > 0 ? tempArrayMinor[1] : 0;
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	// WebTV 2.5 supports Flash 3
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	// older WebTV supports Flash 2
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if ( isIE && isWin && !isOpera ) {
		flashVer = ControlVersion();
	}	
	return flashVer;
}

// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision)
{
	versionStr = GetSwfVer();
	if (versionStr == -1 ) {
		return false;
	} else if (versionStr != 0) {
		if(isIE && isWin && !isOpera) {
			// Given "WIN 2,0,0,11"
			tempArray         = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
			tempString        = tempArray[1];			// "2,0,0,11"
			versionArray      = tempString.split(",");	// ['2', '0', '0', '11']
		} else {
			versionArray      = versionStr.split(".");
		}
		var versionMajor      = versionArray[0];
		var versionMinor      = versionArray[1];
		var versionRevision   = versionArray[2];

        	// is the major.revision >= requested major.revision AND the minor version >= requested minor
		if (versionMajor > parseFloat(reqMajorVer)) {
			return true;
		} else if (versionMajor == parseFloat(reqMajorVer)) {
			if (versionMinor > parseFloat(reqMinorVer))
				return true;
			else if (versionMinor == parseFloat(reqMinorVer)) {
				if (versionRevision >= parseFloat(reqRevision))
					return true;
			}
		}
		return false;
	}
}


