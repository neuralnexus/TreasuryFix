/**
 * Copyright(c) 2004-2010 Entrust Corp.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * Entrust Corp. ("Confidential Information").  You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Entrust Corp.
 */

/**
 * Class: MachineSecret
 * 
 * Description:  This class can be used to determine the client's
 * machine fingerprint.  It also can determine whether flash
 * cookies should be used (i.e. when browser cookies are not supported
 * and Flash Shockwave 9 or greater is installed) as a persistent
 * storage mechanism and therefore provides the mechanisms to read
 * the associates flash cookie values.
 * 
 * Example Usage:
 *       
 *       var secret = new MachineSecret(true);
 *       var useFlash = secret.getUseFlash();
 *       var machineFingerprint = secret.getMachineFingerprint();
 *       
 *       if (useFlash)
 *       {
 *          flashMachineLabel = secret.getMachineLabel();
 *          flashMacineNonce = secret.getMachineNonce();
 *          flashSequenceNonce = secret.getSequenceNonce();
 *       }
 */

function MachineSecret(read) {

   // gather the browser properties which
   // will make up the machine fingerprint
   if (typeof read != "undefined" && read == true) {
      dp_addAllAttributes();
      this._machineFingerprint = dp_attrs;
   }
   
   //initialize all local variables
   this._useFlash = false;
   this._machineLabelName = "testMachineLabel";
   this._machineLabel = new Object();
   this._machineLabel.value = "";
   this._machineNonceName = "testMachineNonce";
   this._machineNonce = new Object();
   this._machineNonce.value = "";
   this._sequenceNonceName = "testSequenceNonce";
   this._sequenceNonce = new Object();
   this._sequenceNonce.value = "";
   
   // if browser cookies are not supported but the proper
   // version of flash macromedia player is (9.0), set the useFlash
   // flag and read the machine label, machine nonce and sequence
   // nonce from the flash cookies.
   if (DetectFlashVer(9,0,0) == true) {   
   
      this._useFlash = true;

      if (typeof read != "undefined" && read == true) {
   
         retrieveData(this._machineLabelName,
                  this._machineLabel);
         retrieveData(this._machineNonceName,
                  this._machineNonce);
         retrieveData(this._sequenceNonceName,
                  this._sequenceNonce);
      }
   }
}

MachineSecret.prototype._machineFingerprint;
MachineSecret.prototype._useFlash;
MachineSecret.prototype._machineLabelName;
MachineSecret.prototype._machineLabe;
MachineSecret.prototype._machineNonceName;
MachineSecret.prototype._machineNonce;
MachineSecret.prototype._sequenceNonceName;
MachineSecret.prototype._sequenceNonce;

// Set the flash cookie (machine label, nonce, and sequnce
// nonce) if enabled
MachineSecret.prototype.setFlashCookie = function(machineLabel,
                                              machineNonce,
                                              sequenceNonce) {

   if (this._useFlash) {                 
      
      storeData(this._machineLabelName, machineLabel);
      storeData(this._machineNonceName, machineNonce);
      storeData(this._sequenceNonceName, sequenceNonce);
   }
}

// Delete the flash cookie (machine label, nonce, and sequence
// nonce) if flash is enabled
MachineSecret.prototype.clearFlashCookie = function() {
   if (this._useFlash) {
      var elem = new Object();
      elem.value = "";
      storeData(this._machineLabelName, elem);
      storeData(this._machineNonceName, elem);
      storeData(this._sequenceNonceName. elem);
   }
}


// Return the machine fingerprint defined by the browser properties
MachineSecret.prototype.getMachineFingerprint = function() {
   return this._machineFingerprint;
}

// Return the flag indicating whether to use flash cookies for
// persistent storage
MachineSecret.prototype.getUseFlash = function() {
   return this._useFlash;
}

// Return the machine label name identifying the flash cookie
MachineSecret.prototype.getMachineLabelName = function() {
   return this._machineLabelName;
}

// Return the machine label stored within the flash cookies
MachineSecret.prototype.getMachineLabel = function() {
   return this._machineLabel.value;
}

// Return the machine nonce name identifying the flash cookie
MachineSecret.prototype.getMachineNonceName = function() {
   return this._machineNonceName;
}

// Return the machine nonce stored within the flash cookies
MachineSecret.prototype.getMachineNonce = function() {
   return this._machineNonce.value;
}

// Return the sequence nonce name identifying the flash cookie
MachineSecret.prototype.getSequenceNonceName = function() {
   return this._sequenceNonceName;
}

// Return the sequence nonce stored within the flash cookies
MachineSecret.prototype.getSequenceNonce = function() {
   return this._sequenceNonce.value;
}


// Determines if the browser supports cookies
function supportsCookies() {
   var cookieEnabled = (navigator.cookieEnabled)? true : false;

   //if not IE4+ nor NS6+
   if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
      document.cookie = "testcookie";
      cookieEnabled = (document.cookie.indexOf("testcookie")!=-1)? true : false;
   }
   return cookieEnabled;
}

//
// Helper functions to create array of attributes
//

// return a boolean as to whether a given attribute should be excluded (has 0 weight)
function dp_exclude(attrName)
{
   if (!attrName) return true;
   if (dp_exclude[attrName]) return true;
   return false;
}

var dp_attrs = ""; // String to return in a hidden field or cookie
var dp_attr = "";  // Current attribute placeholder
var dp_useVB = false;

// add an attribute if not excluded to attrs
function dp_addAttr(attrName, attrValue)
{
   if (!dp_exclude(attrName)) {
      if (dp_attrs != "") dp_attrs += "&";
      dp_attrs += attrName + "=" + attrValue;
   }
}

function dp_getMimeTypes()
{
   var dp_mimeTypes = "";
   if (navigator.mimeTypes) {
      for (i = 0; i < navigator.mimeTypes.length; i++) {
         if (dp_mimeTypes != "") dp_mimeTypes += ",";
         dp_mimeTypes += navigator.mimeTypes[i].type;
      }
   }
   return dp_mimeTypes;
}

function dp_getPlugins()
{
   var dp_plugins = "";
   if (navigator.plugins) {
      for (i = 0; i < navigator.plugins.length; i++) {
         if (dp_plugins != "") dp_plugins += ",";
         dp_plugins += navigator.plugins[i].name;
      }
   }
   return dp_plugins;
}

// Flash checking code adapted from Doc JavaScript information; 
// see http://webref.com/js/column84/2.html
function dp_getFlashVersion()
{
   var dp_FlashVer = "";
   var plugin = (navigator.mimeTypes && 
      navigator.mimeTypes["application/x-shockwave-flash"] &&
      navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) ?
      navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
   if (plugin&&plugin.description) {
      dp_FlashVer = parseInt(plugin.description.substring(plugin.description.indexOf(".")-1));
   } else if ((dp_FlashVer == "") && dp_useVB) {
      dp_FlashVer = detectFlashActiveXControl();
   }
   return dp_FlashVer;
}

function dp_hasQuickTime()
{
    var dp_pluginFound = dp_detectPlugin('QuickTime');
   // if not found, try to detect with VisualBasic
   if(!dp_pluginFound && dp_useVB) {
      dp_pluginFound = detectQuickTimeActiveXControl();
   }
   return dp_pluginFound;
}

function dp_hasClearType()
{
    var dp_clearTypeDesc = false;
    
   // Only available using VB
   if(dp_useVB) {
      dp_clearTypeDesc = detectClearType();
   }
   return dp_clearTypeDesc;
}

// Look for a plugin
//
// name - name of the plugin from navigator.plugins
// description - name of the plugin from navigator.plugins
// activeXnames - array of possible ActiveX control names
function dp_hasPlugin(name, description, activeXnames)
{
   var dp_pluginFound;
   if (description == null || description == "") {
      dp_pluginFound = dp_detectPlugin(name);
   } else {
      dp_pluginFound = dp_detectPlugin(name, description);
   }
   
   if (!dp_pluginFound && dp_useVB && activeXnames != null && activeXnames.length > 0) {
      for (i = 0; i < activeXnames.length; i++) {
         if (detectActiveXControl(activeXnames[i])) {
            return true;
         }
      }
   }
   
   return dp_pluginFound;
}

function dp_detectPlugin()
{
   // allow for multiple checks in a single pass
   var daPlugins = dp_detectPlugin.arguments;
   // consider pluginFound to be false until proven true
   var pluginFound = false;
   // if plugins array is there and not fake
   if (navigator.plugins && navigator.plugins.length > 0) {
      var pluginsArrayLength = navigator.plugins.length;
      // for each plugin...
      for (pluginsArrayCounter=0; pluginsArrayCounter < pluginsArrayLength; pluginsArrayCounter++ ) {
         // loop through all desired names and check each against the current plugin name
         var numFound = 0;
         for(namesCounter=0; namesCounter < daPlugins.length; namesCounter++) {
            // if desired plugin name is found in either plugin name or description
            if( (navigator.plugins[pluginsArrayCounter].name.indexOf(daPlugins[namesCounter]) >= 0) || 
               (navigator.plugins[pluginsArrayCounter].description.indexOf(daPlugins[namesCounter]) >= 0) ) {
               // this name was found
               numFound++;
            }   
         }
         // now that we have checked all the required names against this one plugin,
         // if the number we found matches the total number provided then we were successful
         if(numFound == daPlugins.length) {
               pluginFound = true;
               // if we've found the plugin, we can stop looking through at the rest of the plugins
               break;
         }
      }
   }
   return pluginFound;
}

// VBScript methods to detect plugins for MSIE Windows
if ((navigator.userAgent.indexOf('MSIE') != -1) && (navigator.userAgent.indexOf('Win') != -1)) {
   document.writeln('<scr' + 'ipt language="VBscript">');
   document.writeln('\'do a one-time test for a version of VBScript that can handle this code');
   document.writeln('Dim dp_useVB ');
   document.writeln('dp_useVB = False');
   document.writeln('If ScriptEngineMajorVersion >= 2 then');
   document.writeln('  dp_useVB = True');
   document.writeln('End If');

   document.writeln('\'this next function will detect most plugins');
   document.writeln('Function detectActiveXControl(activeXControlName)');
   document.writeln('  on error resume next');
   document.writeln('  detectActiveXControl = False');
   document.writeln('  If dp_useVB Then');
   document.writeln('    detectActiveXControl = IsObject(CreateObject(activeXControlName))');
   document.writeln('  End If');
   document.writeln('End Function');

   document.writeln('Function detectQuickTimeActiveXControl()');
   document.writeln('  on error resume next');
   document.writeln('  detectQuickTimeActiveXControl = False');
   document.writeln('  Dim hasQuickTimeChecker ');
   document.writeln('  If dp_useVB Then');
   document.writeln('     detectQuickTimeActiveXControl = False');
   document.writeln('     hasQuickTimeChecker = false');
   document.writeln('     Set hasQuickTimeChecker = CreateObject("QuickTimeCheckObject.QuickTimeCheck.1")');
   document.writeln('     If IsObject(hasQuickTimeChecker) Then');
   document.writeln('       If hasQuickTimeChecker.IsQuickTimeAvailable(0) Then ');
   document.writeln('        detectQuickTimeActiveXControl = True');
   document.writeln('       End If');
   document.writeln('     End If');
   document.writeln('  End If');
   document.writeln('End Function');
   
   document.writeln('Function detectFlashActiveXControl()');
   document.writeln('  on error resume next');
   document.writeln('  Dim hasPlayer, playerversion, minPlayer, name');
   document.writeln('  hasPlayer = false');
   document.writeln('  playerversion = 10');
   document.writeln('  minPlayer = 4');
   document.writeln('  Do While playerversion >= minPlayer');
   document.writeln('    on error resume Next');
   document.writeln('    name = "ShockwaveFlash.ShockwaveFlash" + "." + CStr(playerversion)');
   document.writeln('    hasPlayer = (IsObject(CreateObject(name)))');
   document.writeln('    If hasPlayer = true Then Exit Do');
   document.writeln('    playerversion = playerversion - 1');
   document.writeln('  Loop');
   document.writeln('  detectFlashActiveXControl = hasPlayer');
   document.writeln('End Function');
    
   document.writeln('Function detectClearType()');
   document.writeln('  on error resume next');
   document.writeln('  detectClearType = false');
   document.writeln('  Dim tmp '); 
   document.writeln('  set tmp = CreateObject("ClearAdjust.CTAdjust.1")');
   document.writeln('  If IsObject(tmp) then');
   document.writeln('    detectClearType = tmp.GammaValue');
   document.writeln('  End If');
   document.writeln('End Function');
   document.writeln('</scr' + 'ipt>');
}

// Sniff / add all attributes
function dp_addAllAttributes()
{
   dp_addAttr("director", dp_hasPlugin('Shockwave','Director',['SWCtl.SWCtl.1'])  );
   dp_addAttr("flashVersion", dp_getFlashVersion() );
   dp_addAttr("mimeTypes", dp_getMimeTypes() );
   dp_addAttr("mimeTypesCount", navigator.mimeTypes.length );
   dp_addAttr("plugins", dp_getPlugins() );
   dp_addAttr("pluginsCount", navigator.plugins.length );
   dp_addAttr("quickTime", dp_hasQuickTime() );
   dp_addAttr("realPlayer", dp_hasPlugin('RealPlayer','',['rmocx.RealPlayer G2 Control','RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)','RealVideo.RealVideo(tm) ActiveX Control (32-bit)']) );
   dp_addAttr("windowsMediaPlayer", dp_hasPlugin('Windows Media','',['MediaPlayer.MediaPlayer.1']) );
   dp_addAttr("accrobatReader", dp_hasPlugin('Adobe', 'Acrobat', ['PDF.PdfCtrl']) );
   dp_addAttr("svgViewer", dp_hasPlugin('Adobe', 'SVG', ['Adobe.SVGCtl']) );
   dp_addAttr("clearType", dp_hasClearType() );

   dp_addAttr("screenColorDepth", screen.colorDepth );
   dp_addAttr("screenHeight", screen.height );
   dp_addAttr("screenPixelDepth", screen.pixelDepth );
   dp_addAttr("screenWidth", screen.width );
   dp_addAttr("screenAvailHeigth", screen.availHeight );
   dp_addAttr("screenAvailWidth", screen.availWidth );
   dp_addAttr("screenBufferDepth", screen.bufferDepth );
   
   dp_addAttr("appName", navigator.appName );
   dp_addAttr("appVersion", navigator.appVersion );
   dp_addAttr("appMinorVersion", navigator.appMinorVersion );
   dp_addAttr("cookieEnabled", navigator.cookieEnabled );
   dp_addAttr("cpuClass", navigator.cpuClass );
   dp_addAttr("systemLanguage", navigator.systemLanguage );
   dp_addAttr("userAgent", navigator.userAgent );
   dp_addAttr("userLanguage", navigator.userLanguage );
   dp_addAttr("javaEnabled", navigator.javaEnabled() );
   dp_addAttr("platform", navigator.platform );
   dp_addAttr("appCodeName", navigator.appCodeName );
   dp_addAttr("language", navigator.language );
   dp_addAttr("oscpu", navigator.oscpu );
   dp_addAttr("vendor", navigator.vendor );
   dp_addAttr("vendorSub", navigator.vendorSub );
   dp_addAttr("product", navigator.product );
   dp_addAttr("productSub", navigator.productSub );
   
   //additions
   dp_addAttr("savePrefs", navigator.savePreferences );

   
}
