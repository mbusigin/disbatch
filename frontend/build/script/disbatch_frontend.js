(function(){

if (!window.qx) window.qx = {};

qx.$$start = new Date();
  
if (!window.qxsettings) qxsettings = {};
var settings = {"qx.application":"disbatch_frontend.Application","qx.theme":"disbatch_frontend.theme.Theme","qx.version":"1.1"};
for (var k in settings) qxsettings[k] = settings[k];

if (!window.qxvariants) qxvariants = {};
var variants = {"qx.debug":"off"};
for (var k in variants) qxvariants[k] = variants[k];

if (!qx.$$libraries) qx.$$libraries = {};
var libinfo = {"__out__":{"sourceUri":"script"},"disbatch_frontend":{"resourceUri":"resource","sourceUri":"script","version":"trunk"},"qx":{"resourceUri":"resource","sourceUri":"script","version":"1.1"}};
for (var k in libinfo) qx.$$libraries[k] = libinfo[k];

qx.$$resources = {};
qx.$$translations = {};
qx.$$locales = {};
qx.$$packageData = {};

qx.$$loader = {
  parts : {"boot":[0]},
  uris : [["__out__:disbatch_frontend.js"]],
  urisBefore : [],
  packageHashes : {"0":"8e93b094d6d7"},
  boot : "boot",
  closureParts : {},
  bootIsInline : true,
  
  decodeUris : function(compressedUris)
  {
    var libs = qx.$$libraries;
    var uris = [];
    for (var i=0; i<compressedUris.length; i++)
    {
      var uri = compressedUris[i].split(":");
      var euri;
      if (uri.length==2 && uri[0] in libs) {
        var prefix = libs[uri[0]].sourceUri;
        euri = prefix + "/" + uri[1];
      } else {
        euri = compressedUris[i];
      }
      
      uris.push(euri);
    }
    return uris;      
  }
};  

function loadScript(uri, callback) {
  var elem = document.createElement("script");
  elem.charset = "utf-8";
  elem.src = uri;
  elem.onreadystatechange = elem.onload = function()
  {
    if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")
    {
      elem.onreadystatechange = elem.onload = null;
      callback();
    }
  };
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

var isWebkit = /AppleWebKit\/([^ ]+)/.test(navigator.userAgent);

function loadScriptList(list, callback) {
  if (list.length == 0) {
    callback();
    return;
  }
  loadScript(list.shift(), function() {
    if (isWebkit) {
      // force asynchronous load
      // Safari fails with an "maximum recursion depth exceeded" error if it is
      // called sync.      
      window.setTimeout(function() {
        loadScriptList(list, callback);
      }, 0);
    } else {
      loadScriptList(list, callback);
    }
  });
}

var fireContentLoadedEvent = function() {
  qx.$$domReady = true;
  document.removeEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
};
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
}

qx.$$loader.importPackageData = function (dataMap) {
  if (dataMap["resources"]){
    var resMap = dataMap["resources"];
    for (var k in resMap) qx.$$resources[k] = resMap[k];
  }
  if (dataMap["locales"]){
    var locMap = dataMap["locales"];
    var qxlocs = qx.$$locales;
    for (var lang in locMap){
      if (!qxlocs[lang]) qxlocs[lang] = locMap[lang];
      else 
        for (var k in locMap[lang]) qxlocs[lang][k] = locMap[lang][k];
    }
  }
  if (dataMap["translations"]){
    var trMap   = dataMap["translations"];
    var qxtrans = qx.$$translations;
    for (var lang in trMap){
      if (!qxtrans[lang]) qxtrans[lang] = trMap[lang];
      else 
        for (var k in trMap[lang]) qxtrans[lang][k] = trMap[lang][k];
    }
  }
}

qx.$$loader.signalStartup = function () 
{
  qx.$$loader.scriptLoaded = true;
  if (window.qx && qx.event && qx.event.handler && qx.event.handler.Application) qx.event.handler.Application.onScriptLoaded();
}

qx.$$loader.init = function(){
  var l=qx.$$loader;
  if (l.urisBefore.length>0){
    loadScriptList(l.urisBefore, function(){return;});
  }
  var bootPackageHash=l.packageHashes[l.parts[l.boot][0]];
  if (l.bootIsInline){
    l.importPackageData(qx.$$packageData[bootPackageHash]);
    l.signalStartup();
  } else {
    loadScriptList(l.decodeUris(l.uris[l.parts[l.boot]]), function(){
      // Opera needs this extra time to parse the scripts
      window.setTimeout(function(){
        l.importPackageData(qx.$$packageData[bootPackageHash] || {});
        l.signalStartup();
      }, 0);
    });
  }
}
})();

qx.$$packageData['8e93b094d6d7']={"locales":{"C":{"alternateQuotationEnd":"’","alternateQuotationStart":"‘","cldr_am":"AM","cldr_date_format_full":"EEEE, MMMM d, y","cldr_date_format_long":"MMMM d, y","cldr_date_format_medium":"MMM d, y","cldr_date_format_short":"M/d/yy","cldr_date_time_format_EEEd":"d EEE","cldr_date_time_format_Hm":"H:mm","cldr_date_time_format_Hms":"H:mm:ss","cldr_date_time_format_M":"L","cldr_date_time_format_MEd":"E, M/d","cldr_date_time_format_MMM":"LLL","cldr_date_time_format_MMMEd":"E, MMM d","cldr_date_time_format_MMMMEd":"E, MMMM d","cldr_date_time_format_MMMMd":"MMMM d","cldr_date_time_format_MMMd":"MMM d","cldr_date_time_format_Md":"M/d","cldr_date_time_format_d":"d","cldr_date_time_format_hm":"h:mm a","cldr_date_time_format_ms":"mm:ss","cldr_date_time_format_y":"y","cldr_date_time_format_yM":"M/yyyy","cldr_date_time_format_yMEd":"EEE, M/d/yyyy","cldr_date_time_format_yMMM":"MMM y","cldr_date_time_format_yMMMEd":"EEE, MMM d, y","cldr_date_time_format_yMMMM":"MMMM y","cldr_date_time_format_yQ":"Q yyyy","cldr_date_time_format_yQQQ":"QQQ y","cldr_day_format_abbreviated_fri":"Fri","cldr_day_format_abbreviated_mon":"Mon","cldr_day_format_abbreviated_sat":"Sat","cldr_day_format_abbreviated_sun":"Sun","cldr_day_format_abbreviated_thu":"Thu","cldr_day_format_abbreviated_tue":"Tue","cldr_day_format_abbreviated_wed":"Wed","cldr_day_format_narrow_fri":"F","cldr_day_format_narrow_mon":"M","cldr_day_format_narrow_sat":"S","cldr_day_format_narrow_sun":"S","cldr_day_format_narrow_thu":"T","cldr_day_format_narrow_tue":"T","cldr_day_format_narrow_wed":"W","cldr_day_format_wide_fri":"Friday","cldr_day_format_wide_mon":"Monday","cldr_day_format_wide_sat":"Saturday","cldr_day_format_wide_sun":"Sunday","cldr_day_format_wide_thu":"Thursday","cldr_day_format_wide_tue":"Tuesday","cldr_day_format_wide_wed":"Wednesday","cldr_day_stand-alone_abbreviated_fri":"Fri","cldr_day_stand-alone_abbreviated_mon":"Mon","cldr_day_stand-alone_abbreviated_sat":"Sat","cldr_day_stand-alone_abbreviated_sun":"Sun","cldr_day_stand-alone_abbreviated_thu":"Thu","cldr_day_stand-alone_abbreviated_tue":"Tue","cldr_day_stand-alone_abbreviated_wed":"Wed","cldr_day_stand-alone_narrow_fri":"F","cldr_day_stand-alone_narrow_mon":"M","cldr_day_stand-alone_narrow_sat":"S","cldr_day_stand-alone_narrow_sun":"S","cldr_day_stand-alone_narrow_thu":"T","cldr_day_stand-alone_narrow_tue":"T","cldr_day_stand-alone_narrow_wed":"W","cldr_day_stand-alone_wide_fri":"Friday","cldr_day_stand-alone_wide_mon":"Monday","cldr_day_stand-alone_wide_sat":"Saturday","cldr_day_stand-alone_wide_sun":"Sunday","cldr_day_stand-alone_wide_thu":"Thursday","cldr_day_stand-alone_wide_tue":"Tuesday","cldr_day_stand-alone_wide_wed":"Wednesday","cldr_month_format_abbreviated_1":"Jan","cldr_month_format_abbreviated_10":"Oct","cldr_month_format_abbreviated_11":"Nov","cldr_month_format_abbreviated_12":"Dec","cldr_month_format_abbreviated_2":"Feb","cldr_month_format_abbreviated_3":"Mar","cldr_month_format_abbreviated_4":"Apr","cldr_month_format_abbreviated_5":"May","cldr_month_format_abbreviated_6":"Jun","cldr_month_format_abbreviated_7":"Jul","cldr_month_format_abbreviated_8":"Aug","cldr_month_format_abbreviated_9":"Sep","cldr_month_format_wide_1":"January","cldr_month_format_wide_10":"October","cldr_month_format_wide_11":"November","cldr_month_format_wide_12":"December","cldr_month_format_wide_2":"February","cldr_month_format_wide_3":"March","cldr_month_format_wide_4":"April","cldr_month_format_wide_5":"May","cldr_month_format_wide_6":"June","cldr_month_format_wide_7":"July","cldr_month_format_wide_8":"August","cldr_month_format_wide_9":"September","cldr_month_stand-alone_narrow_1":"J","cldr_month_stand-alone_narrow_10":"O","cldr_month_stand-alone_narrow_11":"N","cldr_month_stand-alone_narrow_12":"D","cldr_month_stand-alone_narrow_2":"F","cldr_month_stand-alone_narrow_3":"M","cldr_month_stand-alone_narrow_4":"A","cldr_month_stand-alone_narrow_5":"M","cldr_month_stand-alone_narrow_6":"J","cldr_month_stand-alone_narrow_7":"J","cldr_month_stand-alone_narrow_8":"A","cldr_month_stand-alone_narrow_9":"S","cldr_number_decimal_separator":".","cldr_number_group_separator":",","cldr_number_percent_format":"#,##0%","cldr_pm":"PM","cldr_time_format_full":"h:mm:ss a zzzz","cldr_time_format_long":"h:mm:ss a z","cldr_time_format_medium":"h:mm:ss a","cldr_time_format_short":"h:mm a","quotationEnd":"”","quotationStart":"“"},"en":{"alternateQuotationEnd":"’","alternateQuotationStart":"‘","cldr_am":"AM","cldr_date_format_full":"EEEE, MMMM d, y","cldr_date_format_long":"MMMM d, y","cldr_date_format_medium":"MMM d, y","cldr_date_format_short":"M/d/yy","cldr_date_time_format_EEEd":"d EEE","cldr_date_time_format_Hm":"H:mm","cldr_date_time_format_Hms":"H:mm:ss","cldr_date_time_format_M":"L","cldr_date_time_format_MEd":"E, M/d","cldr_date_time_format_MMM":"LLL","cldr_date_time_format_MMMEd":"E, MMM d","cldr_date_time_format_MMMMEd":"E, MMMM d","cldr_date_time_format_MMMMd":"MMMM d","cldr_date_time_format_MMMd":"MMM d","cldr_date_time_format_Md":"M/d","cldr_date_time_format_d":"d","cldr_date_time_format_hm":"h:mm a","cldr_date_time_format_ms":"mm:ss","cldr_date_time_format_y":"y","cldr_date_time_format_yM":"M/yyyy","cldr_date_time_format_yMEd":"EEE, M/d/yyyy","cldr_date_time_format_yMMM":"MMM y","cldr_date_time_format_yMMMEd":"EEE, MMM d, y","cldr_date_time_format_yMMMM":"MMMM y","cldr_date_time_format_yQ":"Q yyyy","cldr_date_time_format_yQQQ":"QQQ y","cldr_day_format_abbreviated_fri":"Fri","cldr_day_format_abbreviated_mon":"Mon","cldr_day_format_abbreviated_sat":"Sat","cldr_day_format_abbreviated_sun":"Sun","cldr_day_format_abbreviated_thu":"Thu","cldr_day_format_abbreviated_tue":"Tue","cldr_day_format_abbreviated_wed":"Wed","cldr_day_format_narrow_fri":"F","cldr_day_format_narrow_mon":"M","cldr_day_format_narrow_sat":"S","cldr_day_format_narrow_sun":"S","cldr_day_format_narrow_thu":"T","cldr_day_format_narrow_tue":"T","cldr_day_format_narrow_wed":"W","cldr_day_format_wide_fri":"Friday","cldr_day_format_wide_mon":"Monday","cldr_day_format_wide_sat":"Saturday","cldr_day_format_wide_sun":"Sunday","cldr_day_format_wide_thu":"Thursday","cldr_day_format_wide_tue":"Tuesday","cldr_day_format_wide_wed":"Wednesday","cldr_day_stand-alone_abbreviated_fri":"Fri","cldr_day_stand-alone_abbreviated_mon":"Mon","cldr_day_stand-alone_abbreviated_sat":"Sat","cldr_day_stand-alone_abbreviated_sun":"Sun","cldr_day_stand-alone_abbreviated_thu":"Thu","cldr_day_stand-alone_abbreviated_tue":"Tue","cldr_day_stand-alone_abbreviated_wed":"Wed","cldr_day_stand-alone_narrow_fri":"F","cldr_day_stand-alone_narrow_mon":"M","cldr_day_stand-alone_narrow_sat":"S","cldr_day_stand-alone_narrow_sun":"S","cldr_day_stand-alone_narrow_thu":"T","cldr_day_stand-alone_narrow_tue":"T","cldr_day_stand-alone_narrow_wed":"W","cldr_day_stand-alone_wide_fri":"Friday","cldr_day_stand-alone_wide_mon":"Monday","cldr_day_stand-alone_wide_sat":"Saturday","cldr_day_stand-alone_wide_sun":"Sunday","cldr_day_stand-alone_wide_thu":"Thursday","cldr_day_stand-alone_wide_tue":"Tuesday","cldr_day_stand-alone_wide_wed":"Wednesday","cldr_month_format_abbreviated_1":"Jan","cldr_month_format_abbreviated_10":"Oct","cldr_month_format_abbreviated_11":"Nov","cldr_month_format_abbreviated_12":"Dec","cldr_month_format_abbreviated_2":"Feb","cldr_month_format_abbreviated_3":"Mar","cldr_month_format_abbreviated_4":"Apr","cldr_month_format_abbreviated_5":"May","cldr_month_format_abbreviated_6":"Jun","cldr_month_format_abbreviated_7":"Jul","cldr_month_format_abbreviated_8":"Aug","cldr_month_format_abbreviated_9":"Sep","cldr_month_format_wide_1":"January","cldr_month_format_wide_10":"October","cldr_month_format_wide_11":"November","cldr_month_format_wide_12":"December","cldr_month_format_wide_2":"February","cldr_month_format_wide_3":"March","cldr_month_format_wide_4":"April","cldr_month_format_wide_5":"May","cldr_month_format_wide_6":"June","cldr_month_format_wide_7":"July","cldr_month_format_wide_8":"August","cldr_month_format_wide_9":"September","cldr_month_stand-alone_narrow_1":"J","cldr_month_stand-alone_narrow_10":"O","cldr_month_stand-alone_narrow_11":"N","cldr_month_stand-alone_narrow_12":"D","cldr_month_stand-alone_narrow_2":"F","cldr_month_stand-alone_narrow_3":"M","cldr_month_stand-alone_narrow_4":"A","cldr_month_stand-alone_narrow_5":"M","cldr_month_stand-alone_narrow_6":"J","cldr_month_stand-alone_narrow_7":"J","cldr_month_stand-alone_narrow_8":"A","cldr_month_stand-alone_narrow_9":"S","cldr_number_decimal_separator":".","cldr_number_group_separator":",","cldr_number_percent_format":"#,##0%","cldr_pm":"PM","cldr_time_format_full":"h:mm:ss a zzzz","cldr_time_format_long":"h:mm:ss a z","cldr_time_format_medium":"h:mm:ss a","cldr_time_format_short":"h:mm a","quotationEnd":"”","quotationStart":"“"}},"resources":{"disbatch_frontend/test.png":[32,32,"png","disbatch_frontend"],"qx/decoration/Modern/app-header.png":[110,20,"png","qx"],"qx/decoration/Modern/arrows-combined.png":[87,8,"png","qx"],"qx/decoration/Modern/arrows/down-invert.png":[8,5,"png","qx","qx/decoration/Modern/arrows-combined.png",-74,0],"qx/decoration/Modern/arrows/down-small-invert.png":[5,3,"png","qx","qx/decoration/Modern/arrows-combined.png",-69,0],"qx/decoration/Modern/arrows/down-small.png":[5,3,"png","qx","qx/decoration/Modern/arrows-combined.png",-49,0],"qx/decoration/Modern/arrows/down.png":[8,5,"png","qx","qx/decoration/Modern/arrows-combined.png",-20,0],"qx/decoration/Modern/arrows/forward.png":[10,8,"png","qx","qx/decoration/Modern/arrows-combined.png",-59,0],"qx/decoration/Modern/arrows/left-invert.png":[5,8,"png","qx","qx/decoration/Modern/arrows-combined.png",0,0],"qx/decoration/Modern/arrows/left.png":[5,8,"png","qx","qx/decoration/Modern/arrows-combined.png",-44,0],"qx/decoration/Modern/arrows/rewind.png":[10,8,"png","qx","qx/decoration/Modern/arrows-combined.png",-10,0],"qx/decoration/Modern/arrows/right-invert.png":[5,8,"png","qx","qx/decoration/Modern/arrows-combined.png",-5,0],"qx/decoration/Modern/arrows/right.png":[5,8,"png","qx","qx/decoration/Modern/arrows-combined.png",-54,0],"qx/decoration/Modern/arrows/up-invert.png":[8,5,"png","qx","qx/decoration/Modern/arrows-combined.png",-28,0],"qx/decoration/Modern/arrows/up-small.png":[5,3,"png","qx","qx/decoration/Modern/arrows-combined.png",-82,0],"qx/decoration/Modern/arrows/up.png":[8,5,"png","qx","qx/decoration/Modern/arrows-combined.png",-36,0],"qx/decoration/Modern/button-lr-combined.png":[72,52,"png","qx"],"qx/decoration/Modern/button-tb-combined.png":[4,216,"png","qx"],"qx/decoration/Modern/checkradio-combined.png":[504,14,"png","qx"],"qx/decoration/Modern/colorselector-combined.gif":[46,11,"gif","qx"],"qx/decoration/Modern/colorselector/brightness-field.png":[19,256,"png","qx"],"qx/decoration/Modern/colorselector/brightness-handle.gif":[35,11,"gif","qx","qx/decoration/Modern/colorselector-combined.gif",0,0],"qx/decoration/Modern/colorselector/huesaturation-field.jpg":[256,256,"jpeg","qx"],"qx/decoration/Modern/colorselector/huesaturation-handle.gif":[11,11,"gif","qx","qx/decoration/Modern/colorselector-combined.gif",-35,0],"qx/decoration/Modern/cursors-combined.gif":[71,20,"gif","qx"],"qx/decoration/Modern/cursors/alias.gif":[19,15,"gif","qx","qx/decoration/Modern/cursors-combined.gif",-52,0],"qx/decoration/Modern/cursors/copy.gif":[19,15,"gif","qx","qx/decoration/Modern/cursors-combined.gif",-33,0],"qx/decoration/Modern/cursors/move.gif":[13,9,"gif","qx","qx/decoration/Modern/cursors-combined.gif",-20,0],"qx/decoration/Modern/cursors/nodrop.gif":[20,20,"gif","qx","qx/decoration/Modern/cursors-combined.gif",0,0],"qx/decoration/Modern/form/button-b.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-72],"qx/decoration/Modern/form/button-bl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-204],"qx/decoration/Modern/form/button-br.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-188],"qx/decoration/Modern/form/button-c.png":[40,52,"png","qx"],"qx/decoration/Modern/form/button-checked-b.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-36],"qx/decoration/Modern/form/button-checked-bl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-84],"qx/decoration/Modern/form/button-checked-br.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-184],"qx/decoration/Modern/form/button-checked-c.png":[40,52,"png","qx"],"qx/decoration/Modern/form/button-checked-focused-b.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-156],"qx/decoration/Modern/form/button-checked-focused-bl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-208],"qx/decoration/Modern/form/button-checked-focused-br.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-160],"qx/decoration/Modern/form/button-checked-focused-c.png":[40,52,"png","qx"],"qx/decoration/Modern/form/button-checked-focused-l.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-40,0],"qx/decoration/Modern/form/button-checked-focused-r.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-32,0],"qx/decoration/Modern/form/button-checked-focused-t.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-28],"qx/decoration/Modern/form/button-checked-focused-tl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-24],"qx/decoration/Modern/form/button-checked-focused-tr.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-48],"qx/decoration/Modern/form/button-checked-focused.png":[80,60,"png","qx"],"qx/decoration/Modern/form/button-checked-l.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-16,0],"qx/decoration/Modern/form/button-checked-r.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-60,0],"qx/decoration/Modern/form/button-checked-t.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-140],"qx/decoration/Modern/form/button-checked-tl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-56],"qx/decoration/Modern/form/button-checked-tr.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-112],"qx/decoration/Modern/form/button-checked.png":[80,60,"png","qx"],"qx/decoration/Modern/form/button-disabled-b.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-40],"qx/decoration/Modern/form/button-disabled-bl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-136],"qx/decoration/Modern/form/button-disabled-br.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-16],"qx/decoration/Modern/form/button-disabled-c.png":[40,52,"png","qx"],"qx/decoration/Modern/form/button-disabled-l.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-68,0],"qx/decoration/Modern/form/button-disabled-r.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-4,0],"qx/decoration/Modern/form/button-disabled-t.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-116],"qx/decoration/Modern/form/button-disabled-tl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-168],"qx/decoration/Modern/form/button-disabled-tr.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-60],"qx/decoration/Modern/form/button-disabled.png":[80,60,"png","qx"],"qx/decoration/Modern/form/button-focused-b.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-68],"qx/decoration/Modern/form/button-focused-bl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-144],"qx/decoration/Modern/form/button-focused-br.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-8],"qx/decoration/Modern/form/button-focused-c.png":[40,52,"png","qx"],"qx/decoration/Modern/form/button-focused-l.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-24,0],"qx/decoration/Modern/form/button-focused-r.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-44,0],"qx/decoration/Modern/form/button-focused-t.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-192],"qx/decoration/Modern/form/button-focused-tl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-148],"qx/decoration/Modern/form/button-focused-tr.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-104],"qx/decoration/Modern/form/button-focused.png":[80,60,"png","qx"],"qx/decoration/Modern/form/button-hovered-b.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-108],"qx/decoration/Modern/form/button-hovered-bl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-32],"qx/decoration/Modern/form/button-hovered-br.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-128],"qx/decoration/Modern/form/button-hovered-c.png":[40,52,"png","qx"],"qx/decoration/Modern/form/button-hovered-l.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-20,0],"qx/decoration/Modern/form/button-hovered-r.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-48,0],"qx/decoration/Modern/form/button-hovered-t.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-44],"qx/decoration/Modern/form/button-hovered-tl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-76],"qx/decoration/Modern/form/button-hovered-tr.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-88],"qx/decoration/Modern/form/button-hovered.png":[80,60,"png","qx"],"qx/decoration/Modern/form/button-l.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-56,0],"qx/decoration/Modern/form/button-preselected-b.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-124],"qx/decoration/Modern/form/button-preselected-bl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-176],"qx/decoration/Modern/form/button-preselected-br.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-200],"qx/decoration/Modern/form/button-preselected-c.png":[40,52,"png","qx"],"qx/decoration/Modern/form/button-preselected-focused-b.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,0],"qx/decoration/Modern/form/button-preselected-focused-bl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-4],"qx/decoration/Modern/form/button-preselected-focused-br.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-152],"qx/decoration/Modern/form/button-preselected-focused-c.png":[40,52,"png","qx"],"qx/decoration/Modern/form/button-preselected-focused-l.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-28,0],"qx/decoration/Modern/form/button-preselected-focused-r.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-36,0],"qx/decoration/Modern/form/button-preselected-focused-t.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-196],"qx/decoration/Modern/form/button-preselected-focused-tl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-164],"qx/decoration/Modern/form/button-preselected-focused-tr.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-212],"qx/decoration/Modern/form/button-preselected-focused.png":[80,60,"png","qx"],"qx/decoration/Modern/form/button-preselected-l.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-8,0],"qx/decoration/Modern/form/button-preselected-r.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-64,0],"qx/decoration/Modern/form/button-preselected-t.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-96],"qx/decoration/Modern/form/button-preselected-tl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-80],"qx/decoration/Modern/form/button-preselected-tr.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-132],"qx/decoration/Modern/form/button-preselected.png":[80,60,"png","qx"],"qx/decoration/Modern/form/button-pressed-b.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-12],"qx/decoration/Modern/form/button-pressed-bl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-52],"qx/decoration/Modern/form/button-pressed-br.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-20],"qx/decoration/Modern/form/button-pressed-c.png":[40,52,"png","qx"],"qx/decoration/Modern/form/button-pressed-l.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-52,0],"qx/decoration/Modern/form/button-pressed-r.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",-12,0],"qx/decoration/Modern/form/button-pressed-t.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-100],"qx/decoration/Modern/form/button-pressed-tl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-172],"qx/decoration/Modern/form/button-pressed-tr.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-64],"qx/decoration/Modern/form/button-pressed.png":[80,60,"png","qx"],"qx/decoration/Modern/form/button-r.png":[4,52,"png","qx","qx/decoration/Modern/button-lr-combined.png",0,0],"qx/decoration/Modern/form/button-t.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-92],"qx/decoration/Modern/form/button-tl.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-120],"qx/decoration/Modern/form/button-tr.png":[4,4,"png","qx","qx/decoration/Modern/button-tb-combined.png",0,-180],"qx/decoration/Modern/form/button.png":[80,60,"png","qx"],"qx/decoration/Modern/form/checkbox-checked-disabled.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-126,0],"qx/decoration/Modern/form/checkbox-checked-focused-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-322,0],"qx/decoration/Modern/form/checkbox-checked-focused.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-294,0],"qx/decoration/Modern/form/checkbox-checked-hovered-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-364,0],"qx/decoration/Modern/form/checkbox-checked-hovered.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-490,0],"qx/decoration/Modern/form/checkbox-checked-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-224,0],"qx/decoration/Modern/form/checkbox-checked-pressed-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-378,0],"qx/decoration/Modern/form/checkbox-checked-pressed.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-84,0],"qx/decoration/Modern/form/checkbox-checked.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-182,0],"qx/decoration/Modern/form/checkbox-disabled.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-42,0],"qx/decoration/Modern/form/checkbox-focused-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-392,0],"qx/decoration/Modern/form/checkbox-focused.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-210,0],"qx/decoration/Modern/form/checkbox-hovered-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-14,0],"qx/decoration/Modern/form/checkbox-hovered.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-238,0],"qx/decoration/Modern/form/checkbox-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-462,0],"qx/decoration/Modern/form/checkbox-pressed-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-112,0],"qx/decoration/Modern/form/checkbox-pressed.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-448,0],"qx/decoration/Modern/form/checkbox.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-140,0],"qx/decoration/Modern/form/input-focused.png":[40,12,"png","qx"],"qx/decoration/Modern/form/input.png":[84,12,"png","qx"],"qx/decoration/Modern/form/radiobutton-checked-disabled.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-196,0],"qx/decoration/Modern/form/radiobutton-checked-focused-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-168,0],"qx/decoration/Modern/form/radiobutton-checked-focused.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-98,0],"qx/decoration/Modern/form/radiobutton-checked-hovered-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-308,0],"qx/decoration/Modern/form/radiobutton-checked-hovered.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-406,0],"qx/decoration/Modern/form/radiobutton-checked-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-28,0],"qx/decoration/Modern/form/radiobutton-checked-pressed-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-350,0],"qx/decoration/Modern/form/radiobutton-checked-pressed.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-266,0],"qx/decoration/Modern/form/radiobutton-checked.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-252,0],"qx/decoration/Modern/form/radiobutton-disabled.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-336,0],"qx/decoration/Modern/form/radiobutton-focused-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-476,0],"qx/decoration/Modern/form/radiobutton-focused.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-420,0],"qx/decoration/Modern/form/radiobutton-hovered-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-56,0],"qx/decoration/Modern/form/radiobutton-hovered.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",0,0],"qx/decoration/Modern/form/radiobutton-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-154,0],"qx/decoration/Modern/form/radiobutton-pressed-invalid.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-434,0],"qx/decoration/Modern/form/radiobutton-pressed.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-280,0],"qx/decoration/Modern/form/radiobutton.png":[14,14,"png","qx","qx/decoration/Modern/checkradio-combined.png",-70,0],"qx/decoration/Modern/form/tooltip-error-arrow.png":[11,14,"png","qx"],"qx/decoration/Modern/form/tooltip-error-b.png":[6,6,"png","qx","qx/decoration/Modern/tooltip-error-tb-combined.png",0,-30],"qx/decoration/Modern/form/tooltip-error-bl.png":[6,6,"png","qx","qx/decoration/Modern/tooltip-error-tb-combined.png",0,-24],"qx/decoration/Modern/form/tooltip-error-br.png":[6,6,"png","qx","qx/decoration/Modern/tooltip-error-tb-combined.png",0,0],"qx/decoration/Modern/form/tooltip-error-c.png":[40,18,"png","qx"],"qx/decoration/Modern/form/tooltip-error-l.png":[6,18,"png","qx","qx/decoration/Modern/tooltip-error-lr-combined.png",-6,0],"qx/decoration/Modern/form/tooltip-error-r.png":[6,18,"png","qx","qx/decoration/Modern/tooltip-error-lr-combined.png",0,0],"qx/decoration/Modern/form/tooltip-error-t.png":[6,6,"png","qx","qx/decoration/Modern/tooltip-error-tb-combined.png",0,-6],"qx/decoration/Modern/form/tooltip-error-tl.png":[6,6,"png","qx","qx/decoration/Modern/tooltip-error-tb-combined.png",0,-18],"qx/decoration/Modern/form/tooltip-error-tr.png":[6,6,"png","qx","qx/decoration/Modern/tooltip-error-tb-combined.png",0,-12],"qx/decoration/Modern/form/tooltip-error.png":[127,30,"png","qx"],"qx/decoration/Modern/groupbox-lr-combined.png":[8,51,"png","qx"],"qx/decoration/Modern/groupbox-tb-combined.png":[4,24,"png","qx"],"qx/decoration/Modern/groupbox/groupbox-b.png":[4,4,"png","qx","qx/decoration/Modern/groupbox-tb-combined.png",0,-12],"qx/decoration/Modern/groupbox/groupbox-bl.png":[4,4,"png","qx","qx/decoration/Modern/groupbox-tb-combined.png",0,-16],"qx/decoration/Modern/groupbox/groupbox-br.png":[4,4,"png","qx","qx/decoration/Modern/groupbox-tb-combined.png",0,-8],"qx/decoration/Modern/groupbox/groupbox-c.png":[40,51,"png","qx"],"qx/decoration/Modern/groupbox/groupbox-l.png":[4,51,"png","qx","qx/decoration/Modern/groupbox-lr-combined.png",-4,0],"qx/decoration/Modern/groupbox/groupbox-r.png":[4,51,"png","qx","qx/decoration/Modern/groupbox-lr-combined.png",0,0],"qx/decoration/Modern/groupbox/groupbox-t.png":[4,4,"png","qx","qx/decoration/Modern/groupbox-tb-combined.png",0,-4],"qx/decoration/Modern/groupbox/groupbox-tl.png":[4,4,"png","qx","qx/decoration/Modern/groupbox-tb-combined.png",0,0],"qx/decoration/Modern/groupbox/groupbox-tr.png":[4,4,"png","qx","qx/decoration/Modern/groupbox-tb-combined.png",0,-20],"qx/decoration/Modern/groupbox/groupbox.png":[255,59,"png","qx"],"qx/decoration/Modern/menu-background-combined.png":[80,49,"png","qx"],"qx/decoration/Modern/menu-checkradio-combined.gif":[64,7,"gif","qx"],"qx/decoration/Modern/menu/background.png":[40,49,"png","qx","qx/decoration/Modern/menu-background-combined.png",-40,0],"qx/decoration/Modern/menu/bar-background.png":[40,20,"png","qx","qx/decoration/Modern/menu-background-combined.png",0,0],"qx/decoration/Modern/menu/checkbox-invert.gif":[16,7,"gif","qx","qx/decoration/Modern/menu-checkradio-combined.gif",-16,0],"qx/decoration/Modern/menu/checkbox.gif":[16,7,"gif","qx","qx/decoration/Modern/menu-checkradio-combined.gif",-48,0],"qx/decoration/Modern/menu/radiobutton-invert.gif":[16,5,"gif","qx","qx/decoration/Modern/menu-checkradio-combined.gif",-32,0],"qx/decoration/Modern/menu/radiobutton.gif":[16,5,"gif","qx","qx/decoration/Modern/menu-checkradio-combined.gif",0,0],"qx/decoration/Modern/pane-lr-combined.png":[12,238,"png","qx"],"qx/decoration/Modern/pane-tb-combined.png":[6,36,"png","qx"],"qx/decoration/Modern/pane/pane-b.png":[6,6,"png","qx","qx/decoration/Modern/pane-tb-combined.png",0,-30],"qx/decoration/Modern/pane/pane-bl.png":[6,6,"png","qx","qx/decoration/Modern/pane-tb-combined.png",0,-18],"qx/decoration/Modern/pane/pane-br.png":[6,6,"png","qx","qx/decoration/Modern/pane-tb-combined.png",0,-12],"qx/decoration/Modern/pane/pane-c.png":[40,238,"png","qx"],"qx/decoration/Modern/pane/pane-l.png":[6,238,"png","qx","qx/decoration/Modern/pane-lr-combined.png",0,0],"qx/decoration/Modern/pane/pane-r.png":[6,238,"png","qx","qx/decoration/Modern/pane-lr-combined.png",-6,0],"qx/decoration/Modern/pane/pane-t.png":[6,6,"png","qx","qx/decoration/Modern/pane-tb-combined.png",0,0],"qx/decoration/Modern/pane/pane-tl.png":[6,6,"png","qx","qx/decoration/Modern/pane-tb-combined.png",0,-24],"qx/decoration/Modern/pane/pane-tr.png":[6,6,"png","qx","qx/decoration/Modern/pane-tb-combined.png",0,-6],"qx/decoration/Modern/pane/pane.png":[185,250,"png","qx"],"qx/decoration/Modern/scrollbar-combined.png":[54,12,"png","qx"],"qx/decoration/Modern/scrollbar/scrollbar-bg-horizontal.png":[76,15,"png","qx"],"qx/decoration/Modern/scrollbar/scrollbar-bg-pressed-horizontal.png":[19,10,"png","qx"],"qx/decoration/Modern/scrollbar/scrollbar-bg-pressed-vertical.png":[10,19,"png","qx"],"qx/decoration/Modern/scrollbar/scrollbar-bg-vertical.png":[15,76,"png","qx"],"qx/decoration/Modern/scrollbar/scrollbar-button-bg-horizontal.png":[12,10,"png","qx","qx/decoration/Modern/scrollbar-combined.png",-34,0],"qx/decoration/Modern/scrollbar/scrollbar-button-bg-vertical.png":[10,12,"png","qx","qx/decoration/Modern/scrollbar-combined.png",-6,0],"qx/decoration/Modern/scrollbar/scrollbar-down.png":[6,4,"png","qx","qx/decoration/Modern/scrollbar-combined.png",-28,0],"qx/decoration/Modern/scrollbar/scrollbar-left.png":[4,6,"png","qx","qx/decoration/Modern/scrollbar-combined.png",-50,0],"qx/decoration/Modern/scrollbar/scrollbar-right.png":[4,6,"png","qx","qx/decoration/Modern/scrollbar-combined.png",-46,0],"qx/decoration/Modern/scrollbar/scrollbar-up.png":[6,4,"png","qx","qx/decoration/Modern/scrollbar-combined.png",0,0],"qx/decoration/Modern/scrollbar/slider-knob-background.png":[12,10,"png","qx","qx/decoration/Modern/scrollbar-combined.png",-16,0],"qx/decoration/Modern/selection.png":[110,20,"png","qx"],"qx/decoration/Modern/shadow-lr-combined.png":[30,382,"png","qx"],"qx/decoration/Modern/shadow-small-lr-combined.png":[10,136,"png","qx"],"qx/decoration/Modern/shadow-small-tb-combined.png":[5,30,"png","qx"],"qx/decoration/Modern/shadow-tb-combined.png":[15,90,"png","qx"],"qx/decoration/Modern/shadow/shadow-b.png":[15,15,"png","qx","qx/decoration/Modern/shadow-tb-combined.png",0,-30],"qx/decoration/Modern/shadow/shadow-bl.png":[15,15,"png","qx","qx/decoration/Modern/shadow-tb-combined.png",0,-15],"qx/decoration/Modern/shadow/shadow-br.png":[15,15,"png","qx","qx/decoration/Modern/shadow-tb-combined.png",0,-45],"qx/decoration/Modern/shadow/shadow-c.png":[40,382,"png","qx"],"qx/decoration/Modern/shadow/shadow-l.png":[15,382,"png","qx","qx/decoration/Modern/shadow-lr-combined.png",0,0],"qx/decoration/Modern/shadow/shadow-r.png":[15,382,"png","qx","qx/decoration/Modern/shadow-lr-combined.png",-15,0],"qx/decoration/Modern/shadow/shadow-small-b.png":[5,5,"png","qx","qx/decoration/Modern/shadow-small-tb-combined.png",0,-20],"qx/decoration/Modern/shadow/shadow-small-bl.png":[5,5,"png","qx","qx/decoration/Modern/shadow-small-tb-combined.png",0,-15],"qx/decoration/Modern/shadow/shadow-small-br.png":[5,5,"png","qx","qx/decoration/Modern/shadow-small-tb-combined.png",0,-10],"qx/decoration/Modern/shadow/shadow-small-c.png":[40,136,"png","qx"],"qx/decoration/Modern/shadow/shadow-small-l.png":[5,136,"png","qx","qx/decoration/Modern/shadow-small-lr-combined.png",0,0],"qx/decoration/Modern/shadow/shadow-small-r.png":[5,136,"png","qx","qx/decoration/Modern/shadow-small-lr-combined.png",-5,0],"qx/decoration/Modern/shadow/shadow-small-t.png":[5,5,"png","qx","qx/decoration/Modern/shadow-small-tb-combined.png",0,-5],"qx/decoration/Modern/shadow/shadow-small-tl.png":[5,5,"png","qx","qx/decoration/Modern/shadow-small-tb-combined.png",0,0],"qx/decoration/Modern/shadow/shadow-small-tr.png":[5,5,"png","qx","qx/decoration/Modern/shadow-small-tb-combined.png",0,-25],"qx/decoration/Modern/shadow/shadow-small.png":[114,146,"png","qx"],"qx/decoration/Modern/shadow/shadow-t.png":[15,15,"png","qx","qx/decoration/Modern/shadow-tb-combined.png",0,-60],"qx/decoration/Modern/shadow/shadow-tl.png":[15,15,"png","qx","qx/decoration/Modern/shadow-tb-combined.png",0,-75],"qx/decoration/Modern/shadow/shadow-tr.png":[15,15,"png","qx","qx/decoration/Modern/shadow-tb-combined.png",0,0],"qx/decoration/Modern/shadow/shadow.png":[381,412,"png","qx"],"qx/decoration/Modern/splitpane-knobs-combined.png":[8,9,"png","qx"],"qx/decoration/Modern/splitpane/knob-horizontal.png":[1,8,"png","qx","qx/decoration/Modern/splitpane-knobs-combined.png",0,-1],"qx/decoration/Modern/splitpane/knob-vertical.png":[8,1,"png","qx","qx/decoration/Modern/splitpane-knobs-combined.png",0,0],"qx/decoration/Modern/table-combined.png":[94,18,"png","qx"],"qx/decoration/Modern/table/ascending.png":[8,5,"png","qx","qx/decoration/Modern/table-combined.png",0,0],"qx/decoration/Modern/table/boolean-false.png":[14,14,"png","qx","qx/decoration/Modern/table-combined.png",-80,0],"qx/decoration/Modern/table/boolean-true.png":[14,14,"png","qx","qx/decoration/Modern/table-combined.png",-26,0],"qx/decoration/Modern/table/descending.png":[8,5,"png","qx","qx/decoration/Modern/table-combined.png",-18,0],"qx/decoration/Modern/table/header-cell.png":[40,18,"png","qx","qx/decoration/Modern/table-combined.png",-40,0],"qx/decoration/Modern/table/select-column-order.png":[10,9,"png","qx","qx/decoration/Modern/table-combined.png",-8,0],"qx/decoration/Modern/tabview-button-bottom-active-lr-combined.png":[10,14,"png","qx"],"qx/decoration/Modern/tabview-button-bottom-active-tb-combined.png":[5,30,"png","qx"],"qx/decoration/Modern/tabview-button-bottom-inactive-b-combined.png":[3,9,"png","qx"],"qx/decoration/Modern/tabview-button-bottom-inactive-lr-combined.png":[6,15,"png","qx"],"qx/decoration/Modern/tabview-button-bottom-inactive-t-combined.png":[3,9,"png","qx"],"qx/decoration/Modern/tabview-button-left-active-lr-combined.png":[10,37,"png","qx"],"qx/decoration/Modern/tabview-button-left-active-tb-combined.png":[5,30,"png","qx"],"qx/decoration/Modern/tabview-button-left-inactive-b-combined.png":[3,9,"png","qx"],"qx/decoration/Modern/tabview-button-left-inactive-lr-combined.png":[6,39,"png","qx"],"qx/decoration/Modern/tabview-button-left-inactive-t-combined.png":[3,9,"png","qx"],"qx/decoration/Modern/tabview-button-right-active-lr-combined.png":[10,37,"png","qx"],"qx/decoration/Modern/tabview-button-right-active-tb-combined.png":[5,30,"png","qx"],"qx/decoration/Modern/tabview-button-right-inactive-b-combined.png":[3,9,"png","qx"],"qx/decoration/Modern/tabview-button-right-inactive-lr-combined.png":[6,39,"png","qx"],"qx/decoration/Modern/tabview-button-right-inactive-t-combined.png":[3,9,"png","qx"],"qx/decoration/Modern/tabview-button-top-active-lr-combined.png":[10,12,"png","qx"],"qx/decoration/Modern/tabview-button-top-active-tb-combined.png":[5,30,"png","qx"],"qx/decoration/Modern/tabview-button-top-inactive-b-combined.png":[3,9,"png","qx"],"qx/decoration/Modern/tabview-button-top-inactive-lr-combined.png":[6,15,"png","qx"],"qx/decoration/Modern/tabview-button-top-inactive-t-combined.png":[3,9,"png","qx"],"qx/decoration/Modern/tabview-pane-lr-combined.png":[60,2,"png","qx"],"qx/decoration/Modern/tabview-pane-tb-combined.png":[30,180,"png","qx"],"qx/decoration/Modern/tabview/tab-button-bottom-active-b.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-bottom-active-tb-combined.png",0,-10],"qx/decoration/Modern/tabview/tab-button-bottom-active-bl.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-bottom-active-tb-combined.png",0,-15],"qx/decoration/Modern/tabview/tab-button-bottom-active-br.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-bottom-active-tb-combined.png",0,-5],"qx/decoration/Modern/tabview/tab-button-bottom-active-c.png":[40,14,"png","qx"],"qx/decoration/Modern/tabview/tab-button-bottom-active-l.png":[5,14,"png","qx","qx/decoration/Modern/tabview-button-bottom-active-lr-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-bottom-active-r.png":[5,14,"png","qx","qx/decoration/Modern/tabview-button-bottom-active-lr-combined.png",-5,0],"qx/decoration/Modern/tabview/tab-button-bottom-active-t.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-bottom-active-tb-combined.png",0,-20],"qx/decoration/Modern/tabview/tab-button-bottom-active-tl.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-bottom-active-tb-combined.png",0,-25],"qx/decoration/Modern/tabview/tab-button-bottom-active-tr.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-bottom-active-tb-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-bottom-active.png":[49,24,"png","qx"],"qx/decoration/Modern/tabview/tab-button-bottom-inactive-b.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-bottom-inactive-b-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-bottom-inactive-bl.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-bottom-inactive-b-combined.png",0,-6],"qx/decoration/Modern/tabview/tab-button-bottom-inactive-br.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-bottom-inactive-b-combined.png",0,-3],"qx/decoration/Modern/tabview/tab-button-bottom-inactive-c.png":[40,15,"png","qx"],"qx/decoration/Modern/tabview/tab-button-bottom-inactive-l.png":[3,15,"png","qx","qx/decoration/Modern/tabview-button-bottom-inactive-lr-combined.png",-3,0],"qx/decoration/Modern/tabview/tab-button-bottom-inactive-r.png":[3,15,"png","qx","qx/decoration/Modern/tabview-button-bottom-inactive-lr-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-bottom-inactive-t.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-bottom-inactive-t-combined.png",0,-3],"qx/decoration/Modern/tabview/tab-button-bottom-inactive-tl.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-bottom-inactive-t-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-bottom-inactive-tr.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-bottom-inactive-t-combined.png",0,-6],"qx/decoration/Modern/tabview/tab-button-bottom-inactive.png":[45,21,"png","qx"],"qx/decoration/Modern/tabview/tab-button-left-active-b.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-left-active-tb-combined.png",0,-5],"qx/decoration/Modern/tabview/tab-button-left-active-bl.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-left-active-tb-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-left-active-br.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-left-active-tb-combined.png",0,-25],"qx/decoration/Modern/tabview/tab-button-left-active-c.png":[40,37,"png","qx"],"qx/decoration/Modern/tabview/tab-button-left-active-l.png":[5,37,"png","qx","qx/decoration/Modern/tabview-button-left-active-lr-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-left-active-r.png":[5,37,"png","qx","qx/decoration/Modern/tabview-button-left-active-lr-combined.png",-5,0],"qx/decoration/Modern/tabview/tab-button-left-active-t.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-left-active-tb-combined.png",0,-15],"qx/decoration/Modern/tabview/tab-button-left-active-tl.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-left-active-tb-combined.png",0,-10],"qx/decoration/Modern/tabview/tab-button-left-active-tr.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-left-active-tb-combined.png",0,-20],"qx/decoration/Modern/tabview/tab-button-left-active.png":[22,47,"png","qx"],"qx/decoration/Modern/tabview/tab-button-left-inactive-b.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-left-inactive-b-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-left-inactive-bl.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-left-inactive-b-combined.png",0,-6],"qx/decoration/Modern/tabview/tab-button-left-inactive-br.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-left-inactive-b-combined.png",0,-3],"qx/decoration/Modern/tabview/tab-button-left-inactive-c.png":[40,39,"png","qx"],"qx/decoration/Modern/tabview/tab-button-left-inactive-l.png":[3,39,"png","qx","qx/decoration/Modern/tabview-button-left-inactive-lr-combined.png",-3,0],"qx/decoration/Modern/tabview/tab-button-left-inactive-r.png":[3,39,"png","qx","qx/decoration/Modern/tabview-button-left-inactive-lr-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-left-inactive-t.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-left-inactive-t-combined.png",0,-3],"qx/decoration/Modern/tabview/tab-button-left-inactive-tl.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-left-inactive-t-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-left-inactive-tr.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-left-inactive-t-combined.png",0,-6],"qx/decoration/Modern/tabview/tab-button-left-inactive.png":[20,45,"png","qx"],"qx/decoration/Modern/tabview/tab-button-right-active-b.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-right-active-tb-combined.png",0,-25],"qx/decoration/Modern/tabview/tab-button-right-active-bl.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-right-active-tb-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-right-active-br.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-right-active-tb-combined.png",0,-20],"qx/decoration/Modern/tabview/tab-button-right-active-c.png":[40,37,"png","qx"],"qx/decoration/Modern/tabview/tab-button-right-active-l.png":[5,37,"png","qx","qx/decoration/Modern/tabview-button-right-active-lr-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-right-active-r.png":[5,37,"png","qx","qx/decoration/Modern/tabview-button-right-active-lr-combined.png",-5,0],"qx/decoration/Modern/tabview/tab-button-right-active-t.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-right-active-tb-combined.png",0,-5],"qx/decoration/Modern/tabview/tab-button-right-active-tl.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-right-active-tb-combined.png",0,-15],"qx/decoration/Modern/tabview/tab-button-right-active-tr.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-right-active-tb-combined.png",0,-10],"qx/decoration/Modern/tabview/tab-button-right-active.png":[22,47,"png","qx"],"qx/decoration/Modern/tabview/tab-button-right-inactive-b.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-right-inactive-b-combined.png",0,-3],"qx/decoration/Modern/tabview/tab-button-right-inactive-bl.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-right-inactive-b-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-right-inactive-br.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-right-inactive-b-combined.png",0,-6],"qx/decoration/Modern/tabview/tab-button-right-inactive-c.png":[40,39,"png","qx"],"qx/decoration/Modern/tabview/tab-button-right-inactive-l.png":[3,39,"png","qx","qx/decoration/Modern/tabview-button-right-inactive-lr-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-right-inactive-r.png":[3,39,"png","qx","qx/decoration/Modern/tabview-button-right-inactive-lr-combined.png",-3,0],"qx/decoration/Modern/tabview/tab-button-right-inactive-t.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-right-inactive-t-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-right-inactive-tl.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-right-inactive-t-combined.png",0,-3],"qx/decoration/Modern/tabview/tab-button-right-inactive-tr.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-right-inactive-t-combined.png",0,-6],"qx/decoration/Modern/tabview/tab-button-right-inactive.png":[20,45,"png","qx"],"qx/decoration/Modern/tabview/tab-button-top-active-b.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-top-active-tb-combined.png",0,-20],"qx/decoration/Modern/tabview/tab-button-top-active-bl.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-top-active-tb-combined.png",0,-15],"qx/decoration/Modern/tabview/tab-button-top-active-br.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-top-active-tb-combined.png",0,-10],"qx/decoration/Modern/tabview/tab-button-top-active-c.png":[40,14,"png","qx"],"qx/decoration/Modern/tabview/tab-button-top-active-l.png":[5,12,"png","qx","qx/decoration/Modern/tabview-button-top-active-lr-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-top-active-r.png":[5,12,"png","qx","qx/decoration/Modern/tabview-button-top-active-lr-combined.png",-5,0],"qx/decoration/Modern/tabview/tab-button-top-active-t.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-top-active-tb-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-top-active-tl.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-top-active-tb-combined.png",0,-25],"qx/decoration/Modern/tabview/tab-button-top-active-tr.png":[5,5,"png","qx","qx/decoration/Modern/tabview-button-top-active-tb-combined.png",0,-5],"qx/decoration/Modern/tabview/tab-button-top-active.png":[48,22,"png","qx"],"qx/decoration/Modern/tabview/tab-button-top-inactive-b.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-top-inactive-b-combined.png",0,-6],"qx/decoration/Modern/tabview/tab-button-top-inactive-bl.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-top-inactive-b-combined.png",0,-3],"qx/decoration/Modern/tabview/tab-button-top-inactive-br.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-top-inactive-b-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-top-inactive-c.png":[40,15,"png","qx"],"qx/decoration/Modern/tabview/tab-button-top-inactive-l.png":[3,15,"png","qx","qx/decoration/Modern/tabview-button-top-inactive-lr-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-top-inactive-r.png":[3,15,"png","qx","qx/decoration/Modern/tabview-button-top-inactive-lr-combined.png",-3,0],"qx/decoration/Modern/tabview/tab-button-top-inactive-t.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-top-inactive-t-combined.png",0,-3],"qx/decoration/Modern/tabview/tab-button-top-inactive-tl.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-top-inactive-t-combined.png",0,0],"qx/decoration/Modern/tabview/tab-button-top-inactive-tr.png":[3,3,"png","qx","qx/decoration/Modern/tabview-button-top-inactive-t-combined.png",0,-6],"qx/decoration/Modern/tabview/tab-button-top-inactive.png":[45,21,"png","qx"],"qx/decoration/Modern/tabview/tabview-pane-b.png":[30,30,"png","qx","qx/decoration/Modern/tabview-pane-tb-combined.png",0,-60],"qx/decoration/Modern/tabview/tabview-pane-bl.png":[30,30,"png","qx","qx/decoration/Modern/tabview-pane-tb-combined.png",0,0],"qx/decoration/Modern/tabview/tabview-pane-br.png":[30,30,"png","qx","qx/decoration/Modern/tabview-pane-tb-combined.png",0,-120],"qx/decoration/Modern/tabview/tabview-pane-c.png":[40,120,"png","qx"],"qx/decoration/Modern/tabview/tabview-pane-l.png":[30,2,"png","qx","qx/decoration/Modern/tabview-pane-lr-combined.png",0,0],"qx/decoration/Modern/tabview/tabview-pane-r.png":[30,2,"png","qx","qx/decoration/Modern/tabview-pane-lr-combined.png",-30,0],"qx/decoration/Modern/tabview/tabview-pane-t.png":[30,30,"png","qx","qx/decoration/Modern/tabview-pane-tb-combined.png",0,-150],"qx/decoration/Modern/tabview/tabview-pane-tl.png":[30,30,"png","qx","qx/decoration/Modern/tabview-pane-tb-combined.png",0,-30],"qx/decoration/Modern/tabview/tabview-pane-tr.png":[30,30,"png","qx","qx/decoration/Modern/tabview-pane-tb-combined.png",0,-90],"qx/decoration/Modern/tabview/tabview-pane.png":[185,250,"png","qx"],"qx/decoration/Modern/toolbar-combined.png":[80,130,"png","qx"],"qx/decoration/Modern/toolbar/toolbar-gradient-blue.png":[40,130,"png","qx","qx/decoration/Modern/toolbar-combined.png",-40,0],"qx/decoration/Modern/toolbar/toolbar-gradient.png":[40,130,"png","qx","qx/decoration/Modern/toolbar-combined.png",0,0],"qx/decoration/Modern/toolbar/toolbar-handle-knob.gif":[1,8,"gif","qx"],"qx/decoration/Modern/toolbar/toolbar-part.gif":[7,1,"gif","qx"],"qx/decoration/Modern/tooltip-error-lr-combined.png":[12,18,"png","qx"],"qx/decoration/Modern/tooltip-error-tb-combined.png":[6,36,"png","qx"],"qx/decoration/Modern/tree-combined.png":[32,8,"png","qx"],"qx/decoration/Modern/tree/closed-selected.png":[8,8,"png","qx","qx/decoration/Modern/tree-combined.png",-24,0],"qx/decoration/Modern/tree/closed.png":[8,8,"png","qx","qx/decoration/Modern/tree-combined.png",-16,0],"qx/decoration/Modern/tree/open-selected.png":[8,8,"png","qx","qx/decoration/Modern/tree-combined.png",-8,0],"qx/decoration/Modern/tree/open.png":[8,8,"png","qx","qx/decoration/Modern/tree-combined.png",0,0],"qx/decoration/Modern/window-captionbar-buttons-combined.png":[108,9,"png","qx"],"qx/decoration/Modern/window-captionbar-lr-active-combined.png":[12,9,"png","qx"],"qx/decoration/Modern/window-captionbar-lr-inactive-combined.png":[12,9,"png","qx"],"qx/decoration/Modern/window-captionbar-tb-active-combined.png":[6,36,"png","qx"],"qx/decoration/Modern/window-captionbar-tb-inactive-combined.png":[6,36,"png","qx"],"qx/decoration/Modern/window-statusbar-lr-combined.png":[8,7,"png","qx"],"qx/decoration/Modern/window-statusbar-tb-combined.png":[4,24,"png","qx"],"qx/decoration/Modern/window/captionbar-active-b.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-active-combined.png",0,-18],"qx/decoration/Modern/window/captionbar-active-bl.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-active-combined.png",0,-24],"qx/decoration/Modern/window/captionbar-active-br.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-active-combined.png",0,-12],"qx/decoration/Modern/window/captionbar-active-c.png":[40,9,"png","qx"],"qx/decoration/Modern/window/captionbar-active-l.png":[6,9,"png","qx","qx/decoration/Modern/window-captionbar-lr-active-combined.png",-6,0],"qx/decoration/Modern/window/captionbar-active-r.png":[6,9,"png","qx","qx/decoration/Modern/window-captionbar-lr-active-combined.png",0,0],"qx/decoration/Modern/window/captionbar-active-t.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-active-combined.png",0,-6],"qx/decoration/Modern/window/captionbar-active-tl.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-active-combined.png",0,0],"qx/decoration/Modern/window/captionbar-active-tr.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-active-combined.png",0,-30],"qx/decoration/Modern/window/captionbar-active.png":[69,21,"png","qx"],"qx/decoration/Modern/window/captionbar-inactive-b.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-inactive-combined.png",0,-24],"qx/decoration/Modern/window/captionbar-inactive-bl.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-inactive-combined.png",0,-6],"qx/decoration/Modern/window/captionbar-inactive-br.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-inactive-combined.png",0,-30],"qx/decoration/Modern/window/captionbar-inactive-c.png":[40,9,"png","qx"],"qx/decoration/Modern/window/captionbar-inactive-l.png":[6,9,"png","qx","qx/decoration/Modern/window-captionbar-lr-inactive-combined.png",0,0],"qx/decoration/Modern/window/captionbar-inactive-r.png":[6,9,"png","qx","qx/decoration/Modern/window-captionbar-lr-inactive-combined.png",-6,0],"qx/decoration/Modern/window/captionbar-inactive-t.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-inactive-combined.png",0,0],"qx/decoration/Modern/window/captionbar-inactive-tl.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-inactive-combined.png",0,-12],"qx/decoration/Modern/window/captionbar-inactive-tr.png":[6,6,"png","qx","qx/decoration/Modern/window-captionbar-tb-inactive-combined.png",0,-18],"qx/decoration/Modern/window/captionbar-inactive.png":[69,21,"png","qx"],"qx/decoration/Modern/window/close-active-hovered.png":[9,9,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",-27,0],"qx/decoration/Modern/window/close-active.png":[9,9,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",-9,0],"qx/decoration/Modern/window/close-inactive.png":[9,9,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",-90,0],"qx/decoration/Modern/window/maximize-active-hovered.png":[9,9,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",-18,0],"qx/decoration/Modern/window/maximize-active.png":[9,9,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",-81,0],"qx/decoration/Modern/window/maximize-inactive.png":[9,9,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",-54,0],"qx/decoration/Modern/window/minimize-active-hovered.png":[9,9,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",-63,0],"qx/decoration/Modern/window/minimize-active.png":[9,9,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",-72,0],"qx/decoration/Modern/window/minimize-inactive.png":[9,9,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",-36,0],"qx/decoration/Modern/window/restore-active-hovered.png":[9,8,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",0,0],"qx/decoration/Modern/window/restore-active.png":[9,8,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",-99,0],"qx/decoration/Modern/window/restore-inactive.png":[9,8,"png","qx","qx/decoration/Modern/window-captionbar-buttons-combined.png",-45,0],"qx/decoration/Modern/window/statusbar-b.png":[4,4,"png","qx","qx/decoration/Modern/window-statusbar-tb-combined.png",0,-16],"qx/decoration/Modern/window/statusbar-bl.png":[4,4,"png","qx","qx/decoration/Modern/window-statusbar-tb-combined.png",0,-20],"qx/decoration/Modern/window/statusbar-br.png":[4,4,"png","qx","qx/decoration/Modern/window-statusbar-tb-combined.png",0,-4],"qx/decoration/Modern/window/statusbar-c.png":[40,7,"png","qx"],"qx/decoration/Modern/window/statusbar-l.png":[4,7,"png","qx","qx/decoration/Modern/window-statusbar-lr-combined.png",-4,0],"qx/decoration/Modern/window/statusbar-r.png":[4,7,"png","qx","qx/decoration/Modern/window-statusbar-lr-combined.png",0,0],"qx/decoration/Modern/window/statusbar-t.png":[4,4,"png","qx","qx/decoration/Modern/window-statusbar-tb-combined.png",0,0],"qx/decoration/Modern/window/statusbar-tl.png":[4,4,"png","qx","qx/decoration/Modern/window-statusbar-tb-combined.png",0,-8],"qx/decoration/Modern/window/statusbar-tr.png":[4,4,"png","qx","qx/decoration/Modern/window-statusbar-tb-combined.png",0,-12],"qx/decoration/Modern/window/statusbar.png":[369,15,"png","qx"],"qx/icon/Tango/16/actions/dialog-cancel.png":[16,16,"png","qx"],"qx/icon/Tango/16/actions/dialog-ok.png":[16,16,"png","qx"],"qx/icon/Tango/16/actions/view-refresh.png":[16,16,"png","qx"],"qx/icon/Tango/16/actions/window-close.png":[16,16,"png","qx"],"qx/icon/Tango/16/apps/office-calendar.png":[16,16,"png","qx"],"qx/icon/Tango/16/apps/utilities-color-chooser.png":[16,16,"png","qx"],"qx/icon/Tango/16/mimetypes/office-document.png":[16,16,"png","qx"],"qx/icon/Tango/16/places/folder-open.png":[16,16,"png","qx"],"qx/icon/Tango/16/places/folder.png":[16,16,"png","qx"],"qx/icon/Tango/22/mimetypes/office-document.png":[22,22,"png","qx"],"qx/icon/Tango/22/places/folder-open.png":[22,22,"png","qx"],"qx/icon/Tango/22/places/folder.png":[22,22,"png","qx"],"qx/icon/Tango/32/mimetypes/office-document.png":[32,32,"png","qx"],"qx/icon/Tango/32/places/folder-open.png":[32,32,"png","qx"],"qx/icon/Tango/32/places/folder.png":[32,32,"png","qx"],"qx/static/blank.gif":[1,1,"gif","qx"]},"translations":{"C":{},"en":{}}};
(function(){var p="toString",o=".",n="default",m="Object",k='"',j="Array",h="()",g="String",f="Function",e=".prototype",O="function",N="Boolean",M="Error",L="constructor",K="warn",J="hasOwnProperty",I="string",H="toLocaleString",G="RegExp",F='\", "',w="info",x="BROKEN_IE",u="isPrototypeOf",v="Date",s="",t="qx.Bootstrap",q="]",r="Class",y="error",z="[Class ",B="valueOf",A="Number",D="count",C="debug",E="ES5";
if(!window.qx){window.qx={};
}qx.Bootstrap={genericToString:function(){return z+this.classname+q;
},createNamespace:function(name,bA){var bC=name.split(o);
var parent=window;
var bB=bC[0];

for(var i=0,bD=bC.length-1;i<bD;i++,bB=bC[i]){if(!parent[bB]){parent=parent[bB]={};
}else{parent=parent[bB];
}}parent[bB]=bA;
return bB;
},setDisplayName:function(P,Q,name){P.displayName=Q+o+name+h;
},setDisplayNames:function(V,W){for(var name in V){var X=V[name];

if(X instanceof Function){X.displayName=W+o+name+h;
}}},define:function(name,bJ){if(!bJ){var bJ={statics:{}};
}var bO;
var bM=null;
qx.Bootstrap.setDisplayNames(bJ.statics,name);

if(bJ.members||bJ.extend){qx.Bootstrap.setDisplayNames(bJ.members,name+e);
bO=bJ.construct||new Function;

if(bJ.extend){this.extendClass(bO,bO,bJ.extend,name,bN);
}var bK=bJ.statics||{};
for(var i=0,bP=qx.Bootstrap.getKeys(bK),l=bP.length;i<l;i++){var bQ=bP[i];
bO[bQ]=bK[bQ];
}bM=bO.prototype;
var bL=bJ.members||{};
for(var i=0,bP=qx.Bootstrap.getKeys(bL),l=bP.length;i<l;i++){var bQ=bP[i];
bM[bQ]=bL[bQ];
}}else{bO=bJ.statics||{};
}var bN=this.createNamespace(name,bO);
bO.name=bO.classname=name;
bO.basename=bN;
bO.$$type=r;
if(!bO.hasOwnProperty(p)){bO.toString=this.genericToString;
}if(bJ.defer){bJ.defer(bO,bM);
}qx.Bootstrap.$$registry[name]=bJ.statics;
return bO;
}};
qx.Bootstrap.define(t,{statics:{LOADSTART:qx.$$start||new Date(),createNamespace:qx.Bootstrap.createNamespace,define:qx.Bootstrap.define,setDisplayName:qx.Bootstrap.setDisplayName,setDisplayNames:qx.Bootstrap.setDisplayNames,genericToString:qx.Bootstrap.genericToString,extendClass:function(bc,bd,be,name,bf){var bi=be.prototype;
var bh=new Function;
bh.prototype=bi;
var bg=new bh;
bc.prototype=bg;
bg.name=bg.classname=name;
bg.basename=bf;
bd.base=bc.superclass=be;
bd.self=bc.constructor=bg.constructor=bc;
},getByName:function(name){return qx.Bootstrap.$$registry[name];
},$$registry:{},objectGetLength:({"count":function(bH){return bH.__count__;
},"default":function(T){var length=0;

for(var U in T){length++;
}return length;
}})[(({}).__count__==0)?D:n],objectMergeWith:function(bR,bS,bT){if(bT===undefined){bT=true;
}
for(var bU in bS){if(bT||bR[bU]===undefined){bR[bU]=bS[bU];
}}return bR;
},__a:[u,J,H,p,B,L],getKeys:({"ES5":Object.keys,"BROKEN_IE":function(bu){var bv=[];

for(var by in bu){bv.push(by);
}var bw=qx.Bootstrap.__a;
var bx=Object.prototype.hasOwnProperty;

for(var i=0,a=bw,l=a.length;i<l;i++){if(bx.call(bu,a[i])){bv.push(a[i]);
}}return bv;
},"default":function(Y){var ba=[];

for(var bb in Y){ba.push(bb);
}return ba;
}})[typeof (Object.keys)==
O?E:
(function(){for(var bI in {toString:1}){return bI;
}})()!==p?x:n],getKeysAsString:function(bm){var bn=qx.Bootstrap.getKeys(bm);

if(bn.length==0){return s;
}return k+bn.join(F)+k;
},__b:{"[object String]":g,"[object Array]":j,"[object Object]":m,"[object RegExp]":G,"[object Number]":A,"[object Boolean]":N,"[object Date]":v,"[object Function]":f,"[object Error]":M},bind:function(ce,self,cf){var cg=Array.prototype.slice.call(arguments,2,arguments.length);
return function(){var bq=Array.prototype.slice.call(arguments,0,arguments.length);
return ce.apply(self,cg.concat(bq));
};
},firstUp:function(ch){return ch.charAt(0).toUpperCase()+ch.substr(1);
},firstLow:function(R){return R.charAt(0).toLowerCase()+R.substr(1);
},getClass:function(b){var c=Object.prototype.toString.call(b);
return (qx.Bootstrap.__b[c]||c.slice(8,-1));
},isString:function(bj){return (bj!==null&&(typeof bj===I||qx.Bootstrap.getClass(bj)==g||bj instanceof String||(!!bj&&!!bj.$$isString)));
},isArray:function(ci){return (ci!==null&&(ci instanceof Array||(ci&&qx.data&&qx.data.IListData&&qx.Bootstrap.hasInterface(ci.constructor,qx.data.IListData))||qx.Bootstrap.getClass(ci)==j||(!!ci&&!!ci.$$isArray)));
},isObject:function(d){return (d!==undefined&&d!==null&&qx.Bootstrap.getClass(d)==m);
},isFunction:function(cj){return qx.Bootstrap.getClass(cj)==f;
},classIsDefined:function(name){return qx.Bootstrap.getByName(name)!==undefined;
},getPropertyDefinition:function(bt,name){while(bt){if(bt.$$properties&&bt.$$properties[name]){return bt.$$properties[name];
}bt=bt.superclass;
}return null;
},hasProperty:function(bE,name){return !!qx.Bootstrap.getPropertyDefinition(bE,name);
},getEventType:function(cd,name){var cd=cd.constructor;

while(cd.superclass){if(cd.$$events&&cd.$$events[name]!==undefined){return cd.$$events[name];
}cd=cd.superclass;
}return null;
},supportsEvent:function(bz,name){return !!qx.Bootstrap.getEventType(bz,name);
},getByInterface:function(ca,cb){var cc,i,l;

while(ca){if(ca.$$implements){cc=ca.$$flatImplements;

for(i=0,l=cc.length;i<l;i++){if(cc[i]===cb){return ca;
}}}ca=ca.superclass;
}return null;
},hasInterface:function(bF,bG){return !!qx.Bootstrap.getByInterface(bF,bG);
},getMixins:function(bo){var bp=[];

while(bo){if(bo.$$includes){bp.push.apply(bp,bo.$$flatIncludes);
}bo=bo.superclass;
}return bp;
},$$logs:[],debug:function(br,bs){qx.Bootstrap.$$logs.push([C,arguments]);
},info:function(bk,bl){qx.Bootstrap.$$logs.push([w,arguments]);
},warn:function(bX,bY){qx.Bootstrap.$$logs.push([K,arguments]);
},error:function(bV,bW){qx.Bootstrap.$$logs.push([y,arguments]);
},trace:function(S){}}});
})();
(function(){var n="qx.allowUrlSettings",m="&",l="qx.core.Setting",k="qx.allowUrlVariants",j="qx.propertyDebugLevel",h="qxsetting",g=":",f=".";
qx.Bootstrap.define(l,{statics:{__c:{},define:function(o,p){if(p===undefined){throw new Error('Default value of setting "'+o+'" must be defined!');
}
if(!this.__c[o]){this.__c[o]={};
}else if(this.__c[o].defaultValue!==undefined){throw new Error('Setting "'+o+'" is already defined!');
}this.__c[o].defaultValue=p;
},get:function(b){var c=this.__c[b];

if(c===undefined){throw new Error('Setting "'+b+'" is not defined.');
}
if(c.value!==undefined){return c.value;
}return c.defaultValue;
},set:function(d,e){if((d.split(f)).length<2){throw new Error('Malformed settings key "'+d+'". Must be following the schema "namespace.key".');
}
if(!this.__c[d]){this.__c[d]={};
}this.__c[d].value=e;
},__d:function(){if(window.qxsettings){for(var t in window.qxsettings){this.set(t,window.qxsettings[t]);
}window.qxsettings=undefined;

try{delete window.qxsettings;
}catch(s){}this.__e();
}},__e:function(){if(this.get(n)!=true){return;
}var r=document.location.search.slice(1).split(m);

for(var i=0;i<r.length;i++){var q=r[i].split(g);

if(q.length!=3||q[0]!=h){continue;
}this.set(q[1],decodeURIComponent(q[2]));
}}},defer:function(a){a.define(n,false);
a.define(k,false);
a.define(j,0);
a.__d();
}});
})();
(function(){var q="function",p="Boolean",o="qx.Interface",n="]",m="toggle",k="Interface",j="is",h="[Interface ";
qx.Bootstrap.define(o,{statics:{define:function(name,P){if(P){if(P.extend&&!(P.extend instanceof Array)){P.extend=[P.extend];
}{};
var Q=P.statics?P.statics:{};
if(P.extend){Q.$$extends=P.extend;
}
if(P.properties){Q.$$properties=P.properties;
}
if(P.members){Q.$$members=P.members;
}
if(P.events){Q.$$events=P.events;
}}else{var Q={};
}Q.$$type=k;
Q.name=name;
Q.toString=this.genericToString;
Q.basename=qx.Bootstrap.createNamespace(name,Q);
qx.Interface.$$registry[name]=Q;
return Q;
},getByName:function(name){return this.$$registry[name];
},isDefined:function(name){return this.getByName(name)!==undefined;
},getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry);
},flatten:function(A){if(!A){return [];
}var B=A.concat();

for(var i=0,l=A.length;i<l;i++){if(A[i].$$extends){B.push.apply(B,this.flatten(A[i].$$extends));
}}return B;
},__f:function(r,s,t,u){var y=t.$$members;

if(y){for(var x in y){if(qx.Bootstrap.isFunction(y[x])){var w=this.__g(s,x);
var v=w||qx.Bootstrap.isFunction(r[x]);

if(!v){throw new Error('Implementation of method "'+x+'" is missing in class "'+s.classname+'" required by interface "'+t.name+'"');
}var z=u===true&&!w&&!qx.Bootstrap.hasInterface(s,t);

if(z){r[x]=this.__j(t,r[x],x,y[x]);
}}else{if(typeof r[x]===undefined){if(typeof r[x]!==q){throw new Error('Implementation of member "'+x+'" is missing in class "'+s.classname+'" required by interface "'+t.name+'"');
}}}}}},__g:function(J,K){var O=K.match(/^(is|toggle|get|set|reset)(.*)$/);

if(!O){return false;
}var L=qx.Bootstrap.firstLow(O[2]);
var M=qx.Bootstrap.getPropertyDefinition(J,L);

if(!M){return false;
}var N=O[0]==j||O[0]==m;

if(N){return qx.Bootstrap.getPropertyDefinition(J,L).check==p;
}return true;
},__h:function(G,H){if(H.$$properties){for(var I in H.$$properties){if(!qx.Bootstrap.getPropertyDefinition(G,I)){throw new Error('The property "'+I+'" is not supported by Class "'+G.classname+'"!');
}}}},__i:function(a,b){if(b.$$events){for(var c in b.$$events){if(!qx.Bootstrap.supportsEvent(a,c)){throw new Error('The event "'+c+'" is not supported by Class "'+a.classname+'"!');
}}}},assertObject:function(C,D){var F=C.constructor;
this.__f(C,F,D,false);
this.__h(F,D);
this.__i(F,D);
var E=D.$$extends;

if(E){for(var i=0,l=E.length;i<l;i++){this.assertObject(C,E[i]);
}}},assert:function(d,e,f){this.__f(d.prototype,d,e,f);
this.__h(d,e);
this.__i(d,e);
var g=e.$$extends;

if(g){for(var i=0,l=g.length;i<l;i++){this.assert(d,g[i],f);
}}},genericToString:function(){return h+this.name+n;
},$$registry:{},__j:function(){},__k:null,__l:function(){}}});
})();
(function(){var q="qx.Mixin",p=".prototype",o="constructor",n="[Mixin ",m="]",k="destruct",j="Mixin";
qx.Bootstrap.define(q,{statics:{define:function(name,u){if(u){if(u.include&&!(u.include instanceof Array)){u.include=[u.include];
}{};
var w=u.statics?u.statics:{};
qx.Bootstrap.setDisplayNames(w,name);

for(var v in w){if(w[v] instanceof Function){w[v].$$mixin=w;
}}if(u.construct){w.$$constructor=u.construct;
qx.Bootstrap.setDisplayName(u.construct,name,o);
}
if(u.include){w.$$includes=u.include;
}
if(u.properties){w.$$properties=u.properties;
}
if(u.members){w.$$members=u.members;
qx.Bootstrap.setDisplayNames(u.members,name+p);
}
for(var v in w.$$members){if(w.$$members[v] instanceof Function){w.$$members[v].$$mixin=w;
}}
if(u.events){w.$$events=u.events;
}
if(u.destruct){w.$$destructor=u.destruct;
qx.Bootstrap.setDisplayName(u.destruct,name,k);
}}else{var w={};
}w.$$type=j;
w.name=name;
w.toString=this.genericToString;
w.basename=qx.Bootstrap.createNamespace(name,w);
this.$$registry[name]=w;
return w;
},checkCompatibility:function(a){var d=this.flatten(a);
var e=d.length;

if(e<2){return true;
}var h={};
var g={};
var f={};
var c;

for(var i=0;i<e;i++){c=d[i];

for(var b in c.events){if(f[b]){throw new Error('Conflict between mixin "'+c.name+'" and "'+f[b]+'" in member "'+b+'"!');
}f[b]=c.name;
}
for(var b in c.properties){if(h[b]){throw new Error('Conflict between mixin "'+c.name+'" and "'+h[b]+'" in property "'+b+'"!');
}h[b]=c.name;
}
for(var b in c.members){if(g[b]){throw new Error('Conflict between mixin "'+c.name+'" and "'+g[b]+'" in member "'+b+'"!');
}g[b]=c.name;
}}return true;
},isCompatible:function(r,s){var t=qx.Bootstrap.getMixins(s);
t.push(r);
return qx.Mixin.checkCompatibility(t);
},getByName:function(name){return this.$$registry[name];
},isDefined:function(name){return this.getByName(name)!==undefined;
},getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry);
},flatten:function(x){if(!x){return [];
}var y=x.concat();

for(var i=0,l=x.length;i<l;i++){if(x[i].$$includes){y.push.apply(y,this.flatten(x[i].$$includes));
}}return y;
},genericToString:function(){return n+this.name+m;
},$$registry:{},__m:null,__n:function(){}}});
})();
(function(){var ce=';',cd="boolean",cc='return this.',cb="string",ca="",bY="setThemed",bX='!==undefined)',bW="this.",bV="set",bU="resetThemed",bJ="setRuntime",bI="init",bH='else if(this.',bG="resetRuntime",bF="reset",bE="();",bD='else ',bC='if(this.',bB="return this.",bA="get",cl=";",cm="(a[",cj=' of an instance of ',ck="refresh",ch=' is not (yet) ready!");',ci="]);",cf='qx.lang.Type.isString(value) && qx.util.ColorUtil.isValidPropertyValue(value)',cg='value !== null && qx.theme.manager.Font.getInstance().isDynamic(value)',cn='value !== null && value.nodeType === 9 && value.documentElement',co='value !== null && value.$$type === "Mixin"',bN='return init;',bM='var init=this.',bP='value !== null && value.nodeType === 1 && value.attributes',bO="var parent = this.getLayoutParent();",bR="Error in property ",bQ="property",bT='qx.core.Assert.assertInstance(value, Date, msg) || true',bS="if (!parent) return;",bL=" in method ",bK='qx.core.Assert.assertInstance(value, Error, msg) || true',A='Undefined value is not allowed!',B="inherit",C='Is invalid!',D="MSIE 6.0",E="': ",F=" of class ",G='value !== null && value.nodeType !== undefined',H='value !== null && qx.theme.manager.Decoration.getInstance().isValidPropertyValue(value)',I='qx.core.Assert.assertPositiveInteger(value, msg) || true',J='if(init==qx.core.Property.$$inherit)init=null;',cs='value !== null && value.$$type === "Interface"',cr='var inherit=prop.$$inherit;',cq="var value = parent.",cp="$$useinit_",cw="(value);",cv=".",cu="$$runtime_",ct='Requires exactly one argument!',cy="$$user_",cx='qx.core.Assert.assertArray(value, msg) || true',bj='qx.core.Assert.assertPositiveNumber(value, msg) || true',bk=".prototype",bh="Boolean",bi='return value;',bn='if(init==qx.core.Property.$$inherit)throw new Error("Inheritable property ',bo='Does not allow any arguments!',bl="()",bm="var a=arguments[0] instanceof Array?arguments[0]:arguments;",bf='value !== null && value.$$type === "Theme"',bg="())",R='return null;',Q='qx.core.Assert.assertObject(value, msg) || true',T='qx.core.Assert.assertString(value, msg) || true',S="if (value===undefined) value = parent.",N='value !== null && value.$$type === "Class"',M='qx.core.Assert.assertFunction(value, msg) || true',P="on",O="object",L="$$init_",K="$$theme_",bt='qx.core.Assert.assertMap(value, msg) || true',bu="qx.aspects",bv='qx.core.Assert.assertNumber(value, msg) || true',bw='Null value is not allowed!',bp='qx.core.Assert.assertInteger(value, msg) || true',bq="value",br="rv:1.8.1",bs="shorthand",bx='qx.core.Assert.assertInstance(value, RegExp, msg) || true',by='value !== null && value.type !== undefined',bc='value !== null && value.document',bb='throw new Error("Property ',ba="(!this.",Y='qx.core.Assert.assertBoolean(value, msg) || true',X="toggle",W="$$inherit_",V=" with incoming value '",U="a=qx.lang.Array.fromShortHand(qx.lang.Array.fromArguments(a));",be="qx.core.Property",bd="is",bz='Could not change or apply init value after constructing phase!';
qx.Bootstrap.define(be,{statics:{__o:{"Boolean":Y,"String":T,"Number":bv,"Integer":bp,"PositiveNumber":bj,"PositiveInteger":I,"Error":bK,"RegExp":bx,"Object":Q,"Array":cx,"Map":bt,"Function":M,"Date":bT,"Node":G,"Element":bP,"Document":cn,"Window":bc,"Event":by,"Class":N,"Mixin":co,"Interface":cs,"Theme":bf,"Color":cf,"Decorator":H,"Font":cg},__p:{"Node":true,"Element":true,"Document":true,"Window":true,"Event":true},$$inherit:B,$$store:{runtime:{},user:{},theme:{},inherit:{},init:{},useinit:{}},$$method:{get:{},set:{},reset:{},init:{},refresh:{},setRuntime:{},resetRuntime:{},setThemed:{},resetThemed:{}},$$allowedKeys:{name:cb,dispose:cd,dereference:cd,inheritable:cd,nullable:cd,themeable:cd,refine:cd,init:null,apply:cb,event:cb,check:null,transform:cb,deferredInit:cd,validate:null},$$allowedGroupKeys:{name:cb,group:O,mode:cb,themeable:cd},$$inheritable:{},__q:function(dh){var di=this.__r(dh);

if(!di.length){var dj=qx.lang.Function.empty;
}else{dj=this.__s(di);
}dh.prototype.$$refreshInheritables=dj;
},__r:function(f){var h=[];

while(f){var g=f.$$properties;

if(g){for(var name in this.$$inheritable){if(g[name]&&g[name].inheritable){h.push(name);
}}}f=f.superclass;
}return h;
},__s:function(dS){var dW=this.$$store.inherit;
var dV=this.$$store.init;
var dU=this.$$method.refresh;
var dT=[bO,bS];

for(var i=0,l=dS.length;i<l;i++){var name=dS[i];
dT.push(cq,dW[name],cl,S,dV[name],cl,bW,dU[name],cw);
}return new Function(dT.join(ca));
},refresh:function(dg){{};
dg.$$refreshInheritables();
},attachRefreshInheritables:function(ec){ec.prototype.$$refreshInheritables=function(){qx.core.Property.__q(ec);
return this.$$refreshInheritables();
};
},attachMethods:function(cz,name,cA){cA.group?this.__t(cz,cA,name):this.__u(cz,cA,name);
},__t:function(dq,dr,name){var dy=qx.Bootstrap.firstUp(name);
var dx=dq.prototype;
var dz=dr.themeable===true;
{};
var dA=[];
var du=[];

if(dz){var ds=[];
var dw=[];
}var dv=bm;
dA.push(dv);

if(dz){ds.push(dv);
}
if(dr.mode==bs){var dt=U;
dA.push(dt);

if(dz){ds.push(dt);
}}
for(var i=0,a=dr.group,l=a.length;i<l;i++){{};
dA.push(bW,this.$$method.set[a[i]],cm,i,ci);
du.push(bW,this.$$method.reset[a[i]],bE);

if(dz){{};
ds.push(bW,this.$$method.setThemed[a[i]],cm,i,ci);
dw.push(bW,this.$$method.resetThemed[a[i]],bE);
}}this.$$method.set[name]=bV+dy;
dx[this.$$method.set[name]]=new Function(dA.join(ca));
this.$$method.reset[name]=bF+dy;
dx[this.$$method.reset[name]]=new Function(du.join(ca));

if(dz){this.$$method.setThemed[name]=bY+dy;
dx[this.$$method.setThemed[name]]=new Function(ds.join(ca));
this.$$method.resetThemed[name]=bU+dy;
dx[this.$$method.resetThemed[name]]=new Function(dw.join(ca));
}},__u:function(da,db,name){var dd=qx.Bootstrap.firstUp(name);
var df=da.prototype;
{};
{};
if(db.dereference===undefined&&typeof db.check===cb){db.dereference=this.__v(db.check);
}var de=this.$$method;
var dc=this.$$store;
dc.runtime[name]=cu+name;
dc.user[name]=cy+name;
dc.theme[name]=K+name;
dc.init[name]=L+name;
dc.inherit[name]=W+name;
dc.useinit[name]=cp+name;
de.get[name]=bA+dd;
df[de.get[name]]=function(){return qx.core.Property.executeOptimizedGetter(this,da,name,bA);
};
de.set[name]=bV+dd;
df[de.set[name]]=function(dR){return qx.core.Property.executeOptimizedSetter(this,da,name,bV,arguments);
};
de.reset[name]=bF+dd;
df[de.reset[name]]=function(){return qx.core.Property.executeOptimizedSetter(this,da,name,bF);
};

if(db.inheritable||db.apply||db.event||db.deferredInit){de.init[name]=bI+dd;
df[de.init[name]]=function(u){return qx.core.Property.executeOptimizedSetter(this,da,name,bI,arguments);
};
}
if(db.inheritable){de.refresh[name]=ck+dd;
df[de.refresh[name]]=function(cB){return qx.core.Property.executeOptimizedSetter(this,da,name,ck,arguments);
};
}de.setRuntime[name]=bJ+dd;
df[de.setRuntime[name]]=function(v){return qx.core.Property.executeOptimizedSetter(this,da,name,bJ,arguments);
};
de.resetRuntime[name]=bG+dd;
df[de.resetRuntime[name]]=function(){return qx.core.Property.executeOptimizedSetter(this,da,name,bG);
};

if(db.themeable){de.setThemed[name]=bY+dd;
df[de.setThemed[name]]=function(w){return qx.core.Property.executeOptimizedSetter(this,da,name,bY,arguments);
};
de.resetThemed[name]=bU+dd;
df[de.resetThemed[name]]=function(){return qx.core.Property.executeOptimizedSetter(this,da,name,bU);
};
}
if(db.check===bh){df[X+dd]=new Function(bB+de.set[name]+ba+de.get[name]+bg);
df[bd+dd]=new Function(bB+de.get[name]+bl);
}},__v:function(cY){return !!this.__p[cY];
},__w:function(cK){return this.__p[cK]||qx.Bootstrap.classIsDefined(cK)||(qx.Interface&&qx.Interface.isDefined(cK));
},__x:{0:bz,1:ct,2:A,3:bo,4:bw,5:C},error:function(dK,dL,dM,dN,dO){var dP=dK.constructor.classname;
var dQ=bR+dM+F+dP+bL+this.$$method[dN][dM]+V+dO+E;
throw new Error(dQ+(this.__x[dL]||"Unknown reason: "+dL));
},__y:function(cE,cF,name,cG,cH,cI){var cJ=this.$$method[cG][name];
{cF[cJ]=new Function(bq,cH.join(ca));
};
if(qx.core.Variant.isSet(bu,P)){cF[cJ]=qx.core.Aspect.wrap(cE.classname+cv+cJ,cF[cJ],bQ);
}qx.Bootstrap.setDisplayName(cF[cJ],cE.classname+bk,cJ);
if(cI===undefined){return cE[cJ]();
}else{return cE[cJ](cI[0]);
}},executeOptimizedGetter:function(j,k,name,m){var o=k.$$properties[name];
var q=k.prototype;
var n=[];
var p=this.$$store;
n.push(bC,p.runtime[name],bX);
n.push(cc,p.runtime[name],ce);

if(o.inheritable){n.push(bH,p.inherit[name],bX);
n.push(cc,p.inherit[name],ce);
n.push(bD);
}n.push(bC,p.user[name],bX);
n.push(cc,p.user[name],ce);

if(o.themeable){n.push(bH,p.theme[name],bX);
n.push(cc,p.theme[name],ce);
}
if(o.deferredInit&&o.init===undefined){n.push(bH,p.init[name],bX);
n.push(cc,p.init[name],ce);
}n.push(bD);

if(o.init!==undefined){if(o.inheritable){n.push(bM,p.init[name],ce);

if(o.nullable){n.push(J);
}else if(o.init!==undefined){n.push(cc,p.init[name],ce);
}else{n.push(bn,name,cj,k.classname,ch);
}n.push(bN);
}else{n.push(cc,p.init[name],ce);
}}else if(o.inheritable||o.nullable){n.push(R);
}else{n.push(bb,name,cj,k.classname,ch);
}return this.__y(j,q,name,m,n);
},executeOptimizedSetter:function(cL,cM,name,cN,cO){var cT=cM.$$properties[name];
var cS=cM.prototype;
var cQ=[];
var cP=cN===bV||cN===bY||cN===bJ||(cN===bI&&cT.init===undefined);
var cR=cT.apply||cT.event||cT.inheritable;
var cU=this.__z(cN,name);
this.__A(cQ,cT,name,cN,cP);

if(cP){this.__B(cQ,cM,cT,name);
}
if(cR){this.__C(cQ,cP,cU,cN);
}
if(cT.inheritable){cQ.push(cr);
}{};

if(!cR){this.__E(cQ,name,cN,cP);
}else{this.__F(cQ,cT,name,cN,cP);
}
if(cT.inheritable){this.__G(cQ,cT,name,cN);
}else if(cR){this.__H(cQ,cT,name,cN);
}
if(cR){this.__I(cQ,cT,name);
if(cT.inheritable&&cS._getChildren){this.__J(cQ,name);
}}if(cP){cQ.push(bi);
}return this.__y(cL,cS,name,cN,cQ,cO);
},__z:function(cC,name){if(cC===bJ||cC===bG){var cD=this.$$store.runtime[name];
}else if(cC===bY||cC===bU){cD=this.$$store.theme[name];
}else if(cC===bI){cD=this.$$store.init[name];
}else{cD=this.$$store.user[name];
}return cD;
},__A:function(dX,dY,name,ea,eb){{if(!dY.nullable||dY.check||dY.inheritable){dX.push('var prop=qx.core.Property;');
}if(ea==="set"){dX.push('if(value===undefined)prop.error(this,2,"',name,'","',ea,'",value);');
}};
},__B:function(cV,cW,cX,name){if(cX.transform){cV.push('value=this.',cX.transform,'(value);');
}if(cX.validate){if(typeof cX.validate==="string"){cV.push('this.',cX.validate,'(value);');
}else if(cX.validate instanceof Function){cV.push(cW.classname,'.$$properties.',name);
cV.push('.validate.call(this, value);');
}}},__C:function(dB,dC,dD,dE){var dF=(dE==="reset"||dE==="resetThemed"||dE==="resetRuntime");

if(dC){dB.push('if(this.',dD,'===value)return value;');
}else if(dF){dB.push('if(this.',dD,'===undefined)return;');
}},__D:undefined,__E:function(dm,name,dn,dp){if(dn==="setRuntime"){dm.push('this.',this.$$store.runtime[name],'=value;');
}else if(dn==="resetRuntime"){dm.push('if(this.',this.$$store.runtime[name],'!==undefined)');
dm.push('delete this.',this.$$store.runtime[name],';');
}else if(dn==="set"){dm.push('this.',this.$$store.user[name],'=value;');
}else if(dn==="reset"){dm.push('if(this.',this.$$store.user[name],'!==undefined)');
dm.push('delete this.',this.$$store.user[name],';');
}else if(dn==="setThemed"){dm.push('this.',this.$$store.theme[name],'=value;');
}else if(dn==="resetThemed"){dm.push('if(this.',this.$$store.theme[name],'!==undefined)');
dm.push('delete this.',this.$$store.theme[name],';');
}else if(dn==="init"&&dp){dm.push('this.',this.$$store.init[name],'=value;');
}},__F:function(b,c,name,d,e){if(c.inheritable){b.push('var computed, old=this.',this.$$store.inherit[name],';');
}else{b.push('var computed, old;');
}b.push('if(this.',this.$$store.runtime[name],'!==undefined){');

if(d==="setRuntime"){b.push('computed=this.',this.$$store.runtime[name],'=value;');
}else if(d==="resetRuntime"){b.push('delete this.',this.$$store.runtime[name],';');
b.push('if(this.',this.$$store.user[name],'!==undefined)');
b.push('computed=this.',this.$$store.user[name],';');
b.push('else if(this.',this.$$store.theme[name],'!==undefined)');
b.push('computed=this.',this.$$store.theme[name],';');
b.push('else if(this.',this.$$store.init[name],'!==undefined){');
b.push('computed=this.',this.$$store.init[name],';');
b.push('this.',this.$$store.useinit[name],'=true;');
b.push('}');
}else{b.push('old=computed=this.',this.$$store.runtime[name],';');
if(d==="set"){b.push('this.',this.$$store.user[name],'=value;');
}else if(d==="reset"){b.push('delete this.',this.$$store.user[name],';');
}else if(d==="setThemed"){b.push('this.',this.$$store.theme[name],'=value;');
}else if(d==="resetThemed"){b.push('delete this.',this.$$store.theme[name],';');
}else if(d==="init"&&e){b.push('this.',this.$$store.init[name],'=value;');
}}b.push('}');
b.push('else if(this.',this.$$store.user[name],'!==undefined){');

if(d==="set"){if(!c.inheritable){b.push('old=this.',this.$$store.user[name],';');
}b.push('computed=this.',this.$$store.user[name],'=value;');
}else if(d==="reset"){if(!c.inheritable){b.push('old=this.',this.$$store.user[name],';');
}b.push('delete this.',this.$$store.user[name],';');
b.push('if(this.',this.$$store.runtime[name],'!==undefined)');
b.push('computed=this.',this.$$store.runtime[name],';');
b.push('if(this.',this.$$store.theme[name],'!==undefined)');
b.push('computed=this.',this.$$store.theme[name],';');
b.push('else if(this.',this.$$store.init[name],'!==undefined){');
b.push('computed=this.',this.$$store.init[name],';');
b.push('this.',this.$$store.useinit[name],'=true;');
b.push('}');
}else{if(d==="setRuntime"){b.push('computed=this.',this.$$store.runtime[name],'=value;');
}else if(c.inheritable){b.push('computed=this.',this.$$store.user[name],';');
}else{b.push('old=computed=this.',this.$$store.user[name],';');
}if(d==="setThemed"){b.push('this.',this.$$store.theme[name],'=value;');
}else if(d==="resetThemed"){b.push('delete this.',this.$$store.theme[name],';');
}else if(d==="init"&&e){b.push('this.',this.$$store.init[name],'=value;');
}}b.push('}');
if(c.themeable){b.push('else if(this.',this.$$store.theme[name],'!==undefined){');

if(!c.inheritable){b.push('old=this.',this.$$store.theme[name],';');
}
if(d==="setRuntime"){b.push('computed=this.',this.$$store.runtime[name],'=value;');
}else if(d==="set"){b.push('computed=this.',this.$$store.user[name],'=value;');
}else if(d==="setThemed"){b.push('computed=this.',this.$$store.theme[name],'=value;');
}else if(d==="resetThemed"){b.push('delete this.',this.$$store.theme[name],';');
b.push('if(this.',this.$$store.init[name],'!==undefined){');
b.push('computed=this.',this.$$store.init[name],';');
b.push('this.',this.$$store.useinit[name],'=true;');
b.push('}');
}else if(d==="init"){if(e){b.push('this.',this.$$store.init[name],'=value;');
}b.push('computed=this.',this.$$store.theme[name],';');
}else if(d==="refresh"){b.push('computed=this.',this.$$store.theme[name],';');
}b.push('}');
}b.push('else if(this.',this.$$store.useinit[name],'){');

if(!c.inheritable){b.push('old=this.',this.$$store.init[name],';');
}
if(d==="init"){if(e){b.push('computed=this.',this.$$store.init[name],'=value;');
}else{b.push('computed=this.',this.$$store.init[name],';');
}}else if(d==="set"||d==="setRuntime"||d==="setThemed"||d==="refresh"){b.push('delete this.',this.$$store.useinit[name],';');

if(d==="setRuntime"){b.push('computed=this.',this.$$store.runtime[name],'=value;');
}else if(d==="set"){b.push('computed=this.',this.$$store.user[name],'=value;');
}else if(d==="setThemed"){b.push('computed=this.',this.$$store.theme[name],'=value;');
}else if(d==="refresh"){b.push('computed=this.',this.$$store.init[name],';');
}}b.push('}');
if(d==="set"||d==="setRuntime"||d==="setThemed"||d==="init"){b.push('else{');

if(d==="setRuntime"){b.push('computed=this.',this.$$store.runtime[name],'=value;');
}else if(d==="set"){b.push('computed=this.',this.$$store.user[name],'=value;');
}else if(d==="setThemed"){b.push('computed=this.',this.$$store.theme[name],'=value;');
}else if(d==="init"){if(e){b.push('computed=this.',this.$$store.init[name],'=value;');
}else{b.push('computed=this.',this.$$store.init[name],';');
}b.push('this.',this.$$store.useinit[name],'=true;');
}b.push('}');
}},__G:function(x,y,name,z){x.push('if(computed===undefined||computed===inherit){');

if(z==="refresh"){x.push('computed=value;');
}else{x.push('var pa=this.getLayoutParent();if(pa)computed=pa.',this.$$store.inherit[name],';');
}x.push('if((computed===undefined||computed===inherit)&&');
x.push('this.',this.$$store.init[name],'!==undefined&&');
x.push('this.',this.$$store.init[name],'!==inherit){');
x.push('computed=this.',this.$$store.init[name],';');
x.push('this.',this.$$store.useinit[name],'=true;');
x.push('}else{');
x.push('delete this.',this.$$store.useinit[name],';}');
x.push('}');
x.push('if(old===computed)return value;');
x.push('if(computed===inherit){');
x.push('computed=undefined;delete this.',this.$$store.inherit[name],';');
x.push('}');
x.push('else if(computed===undefined)');
x.push('delete this.',this.$$store.inherit[name],';');
x.push('else this.',this.$$store.inherit[name],'=computed;');
x.push('var backup=computed;');
if(y.init!==undefined&&z!=="init"){x.push('if(old===undefined)old=this.',this.$$store.init[name],";");
}else{x.push('if(old===undefined)old=null;');
}x.push('if(computed===undefined||computed==inherit)computed=null;');
},__H:function(dG,dH,name,dI){if(dI!=="set"&&dI!=="setRuntime"&&dI!=="setThemed"){dG.push('if(computed===undefined)computed=null;');
}dG.push('if(old===computed)return value;');
if(dH.init!==undefined&&dI!=="init"){dG.push('if(old===undefined)old=this.',this.$$store.init[name],";");
}else{dG.push('if(old===undefined)old=null;');
}},__I:function(dk,dl,name){if(dl.apply){dk.push('this.',dl.apply,'(computed, old, "',name,'");');
}if(dl.event){dk.push("var reg=qx.event.Registration;","if(reg.hasListener(this, '",dl.event,"')){","reg.fireEvent(this, '",dl.event,"', qx.event.type.Data, [computed, old]",")}");
}},__J:function(dJ,name){dJ.push('var a=this._getChildren();if(a)for(var i=0,l=a.length;i<l;i++){');
dJ.push('if(a[i].',this.$$method.refresh[name],')a[i].',this.$$method.refresh[name],'(backup);');
dJ.push('}');
}},defer:function(r){var t=navigator.userAgent.indexOf(D)!=-1;
var s=navigator.userAgent.indexOf(br)!=-1;
if(t||s){r.__v=r.__w;
}}});
})();
(function(){var a="qx.bom.client.Engine";
qx.Bootstrap.define(a,{statics:{NAME:"",FULLVERSION:"0.0.0",VERSION:0.0,OPERA:false,WEBKIT:false,GECKO:false,MSHTML:false,UNKNOWN_ENGINE:false,UNKNOWN_VERSION:false,DOCUMENT_MODE:null,__K:function(){var c="unknown";
var g="0.0.0";
var f=window.navigator.userAgent;
var i=false;
var e=false;

if(window.opera&&Object.prototype.toString.call(window.opera)=="[object Opera]"){c="opera";
this.OPERA=true;
if(/Opera[\s\/]([0-9]+)\.([0-9])([0-9]*)/.test(f)){g=RegExp.$1+"."+RegExp.$2;

if(RegExp.$3!=""){g+="."+RegExp.$3;
}}else{e=true;
g="9.6.0";
}}else if(window.navigator.userAgent.indexOf("AppleWebKit/")!=-1){c="webkit";
this.WEBKIT=true;

if(/AppleWebKit\/([^ ]+)/.test(f)){g=RegExp.$1;
var h=RegExp("[^\\.0-9]").exec(g);

if(h){g=g.slice(0,h.index);
}}else{e=true;
g="525.26";
}}else if(window.controllers&&window.navigator.product==="Gecko"){c="gecko";
this.GECKO=true;
if(/rv\:([^\);]+)(\)|;)/.test(f)){g=RegExp.$1;
}else{e=true;
g="1.9.0.0";
}}else if(window.navigator.cpuClass&&/MSIE\s+([^\);]+)(\)|;)/.test(f)){c="mshtml";
g=RegExp.$1;

if(document.documentMode){this.DOCUMENT_MODE=document.documentMode;
}if(g<8&&/Trident\/([^\);]+)(\)|;)/.test(f)){if(RegExp.$1==="4.0"){g="8.0";
}}this.MSHTML=true;
}else{var d=window.qxFail;

if(d&&typeof d==="function"){var c=d();

if(c.NAME&&c.FULLVERSION){c=c.NAME;
this[c.toUpperCase()]=true;
g=c.FULLVERSION;
}}else{i=true;
e=true;
g="1.9.0.0";
c="gecko";
this.GECKO=true;
qx.Bootstrap.warn("Unsupported client: "+f+"! Assumed gecko version 1.9.0.0 (Firefox 3.0).");
}}this.UNKNOWN_ENGINE=i;
this.UNKNOWN_VERSION=e;
this.NAME=c;
this.FULLVERSION=g;
this.VERSION=parseFloat(g);
}},defer:function(b){b.__K();
}});
})();
(function(){var w="on",u="off",t="|",s="default",r="gecko",q="qx.aspects",p="$",o="qx.debug",n="qx.dynlocale",m="webkit",h="opera",k="qx.client",j="qx.core.Variant",g="mshtml";
qx.Bootstrap.define(j,{statics:{__L:{},__M:{},compilerIsSet:function(){return true;
},define:function(D,E,F){{};

if(!this.__L[D]){this.__L[D]={};
}else{}this.__L[D].allowedValues=E;
this.__L[D].defaultValue=F;
},get:function(e){var f=this.__L[e];
{};

if(f.value!==undefined){return f.value;
}return f.defaultValue;
},__N:function(){if(window.qxvariants){for(var J in qxvariants){{};

if(!this.__L[J]){this.__L[J]={};
}this.__L[J].value=qxvariants[J];
}window.qxvariants=undefined;

try{delete window.qxvariants;
}catch(C){}this.__O(this.__L);
}},__O:function(){if(qx.core.Setting.get("qx.allowUrlVariants")!=true){return;
}var G=document.location.search.slice(1).split("&");

for(var i=0;i<G.length;i++){var H=G[i].split(":");

if(H.length!=3||H[0]!="qxvariant"){continue;
}var I=H[1];

if(!this.__L[I]){this.__L[I]={};
}this.__L[I].value=decodeURIComponent(H[2]);
}},select:function(a,b){{};

for(var c in b){if(this.isSet(a,c)){return b[c];
}}
if(b[s]!==undefined){return b[s];
}{};
},isSet:function(x,y){var z=x+p+y;

if(this.__M[z]!==undefined){return this.__M[z];
}var B=false;
if(y.indexOf(t)<0){B=this.get(x)===y;
}else{var A=y.split(t);

for(var i=0,l=A.length;i<l;i++){if(this.get(x)===A[i]){B=true;
break;
}}}this.__M[z]=B;
return B;
},__P:function(v){return typeof v==="object"&&v!==null&&v instanceof Array;
},__Q:function(v){return typeof v==="object"&&v!==null&&!(v instanceof Array);
},__R:function(K,L){for(var i=0,l=K.length;i<l;i++){if(K[i]==L){return true;
}}return false;
}},defer:function(d){d.define(k,[r,g,h,m],qx.bom.client.Engine.NAME);
d.define(o,[w,u],w);
d.define(q,[w,u],u);
d.define(n,[w,u],w);
d.__N();
}});
})();
(function(){var d="qx.core.Aspect",c="before",b="*",a="static";
qx.Bootstrap.define(d,{statics:{__S:[],wrap:function(f,g,h){var n=[];
var j=[];
var m=this.__S;
var l;

for(var i=0;i<m.length;i++){l=m[i];

if((l.type==null||h==l.type||l.type==b)&&(l.name==null||f.match(l.name))){l.pos==-1?n.push(l.fcn):j.push(l.fcn);
}}
if(n.length===0&&j.length===0){return g;
}var k=function(){for(var i=0;i<n.length;i++){n[i].call(this,f,g,h,arguments);
}var e=g.apply(this,arguments);

for(var i=0;i<j.length;i++){j[i].call(this,f,g,h,arguments,e);
}return e;
};

if(h!==a){k.self=g.self;
k.base=g.base;
}g.wrapper=k;
k.original=g;
return k;
},addAdvice:function(o,p,q,name){this.__S.push({fcn:o,pos:p===c?-1:1,type:q,name:name});
}}});
})();
(function(){var bA="qx.aspects",bz="on",by=".",bx="static",bw="[Class ",bv="]",bu="$$init_",bt="constructor",bs="member",br=".prototype",bo="extend",bq="qx.Class",bp="qx.event.type.Data";
qx.Bootstrap.define(bq,{statics:{define:function(name,bK){if(!bK){var bK={};
}if(bK.include&&!(bK.include instanceof Array)){bK.include=[bK.include];
}if(bK.implement&&!(bK.implement instanceof Array)){bK.implement=[bK.implement];
}var bL=false;

if(!bK.hasOwnProperty(bo)&&!bK.type){bK.type=bx;
bL=true;
}{};
var bM=this.__X(name,bK.type,bK.extend,bK.statics,bK.construct,bK.destruct,bK.include);
if(bK.extend){if(bK.properties){this.__ba(bM,bK.properties,true);
}if(bK.members){this.__bc(bM,bK.members,true,true,false);
}if(bK.events){this.__Y(bM,bK.events,true);
}if(bK.include){for(var i=0,l=bK.include.length;i<l;i++){this.__bg(bM,bK.include[i],false);
}}}if(bK.settings){for(var bN in bK.settings){qx.core.Setting.define(bN,bK.settings[bN]);
}}if(bK.variants){for(var bN in bK.variants){qx.core.Variant.define(bN,bK.variants[bN].allowedValues,bK.variants[bN].defaultValue);
}}if(bK.implement){for(var i=0,l=bK.implement.length;i<l;i++){this.__be(bM,bK.implement[i]);
}}{};
if(bK.defer){bK.defer.self=bM;
bK.defer(bM,bM.prototype,{add:function(name,b){var c={};
c[name]=b;
qx.Class.__ba(bM,c,true);
}});
}return bM;
},undefine:function(name){delete this.$$registry[name];
var bO=name.split(by);
var bQ=[window];

for(var i=0;i<bO.length;i++){bQ.push(bQ[i][bO[i]]);
}for(var i=bQ.length-1;i>=1;i--){var bP=bQ[i];
var parent=bQ[i-1];

if(qx.Bootstrap.isFunction(bP)||qx.Bootstrap.objectGetLength(bP)===0){delete parent[bO[i-1]];
}else{break;
}}},isDefined:qx.Bootstrap.classIsDefined,getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry);
},getByName:qx.Bootstrap.getByName,include:function(bI,bJ){{};
qx.Class.__bg(bI,bJ,false);
},patch:function(bg,bh){{};
qx.Class.__bg(bg,bh,true);
},isSubClassOf:function(U,V){if(!U){return false;
}
if(U==V){return true;
}
if(U.prototype instanceof V){return true;
}return false;
},getPropertyDefinition:qx.Bootstrap.getPropertyDefinition,getProperties:function(bm){var bn=[];

while(bm){if(bm.$$properties){bn.push.apply(bn,qx.Bootstrap.getKeys(bm.$$properties));
}bm=bm.superclass;
}return bn;
},getByProperty:function(bF,name){while(bF){if(bF.$$properties&&bF.$$properties[name]){return bF;
}bF=bF.superclass;
}return null;
},hasProperty:qx.Bootstrap.hasProperty,getEventType:qx.Bootstrap.getEventType,supportsEvent:qx.Bootstrap.supportsEvent,hasOwnMixin:function(bG,bH){return bG.$$includes&&bG.$$includes.indexOf(bH)!==-1;
},getByMixin:function(B,C){var D,i,l;

while(B){if(B.$$includes){D=B.$$flatIncludes;

for(i=0,l=D.length;i<l;i++){if(D[i]===C){return B;
}}}B=B.superclass;
}return null;
},getMixins:qx.Bootstrap.getMixins,hasMixin:function(e,f){return !!this.getByMixin(e,f);
},hasOwnInterface:function(W,X){return W.$$implements&&W.$$implements.indexOf(X)!==-1;
},getByInterface:qx.Bootstrap.getByInterface,getInterfaces:function(bR){var bS=[];

while(bR){if(bR.$$implements){bS.push.apply(bS,bR.$$flatImplements);
}bR=bR.superclass;
}return bS;
},hasInterface:qx.Bootstrap.hasInterface,implementsInterface:function(ca,cb){var cc=ca.constructor;

if(this.hasInterface(cc,cb)){return true;
}
try{qx.Interface.assertObject(ca,cb);
return true;
}catch(bi){}
try{qx.Interface.assert(cc,cb,false);
return true;
}catch(d){}return false;
},getInstance:function(){if(!this.$$instance){this.$$allowconstruct=true;
this.$$instance=new this;
delete this.$$allowconstruct;
}return this.$$instance;
},genericToString:function(){return bw+this.classname+bv;
},$$registry:qx.Bootstrap.$$registry,__T:null,__U:null,__V:function(){},__W:function(){},__X:function(name,K,L,M,N,O,P){var S;

if(!L&&qx.core.Variant.isSet("qx.aspects","off")){S=M||{};
qx.Bootstrap.setDisplayNames(S,name);
}else{var S={};

if(L){if(!N){N=this.__bh();
}
if(this.__bj(L,P)){S=this.__bk(N,name,K);
}else{S=N;
}if(K==="singleton"){S.getInstance=this.getInstance;
}qx.Bootstrap.setDisplayName(N,name,"constructor");
}if(M){qx.Bootstrap.setDisplayNames(M,name);
var T;

for(var i=0,a=qx.Bootstrap.getKeys(M),l=a.length;i<l;i++){T=a[i];
var Q=M[T];

if(qx.core.Variant.isSet("qx.aspects","on")){if(Q instanceof Function){Q=qx.core.Aspect.wrap(name+"."+T,Q,"static");
}S[T]=Q;
}else{S[T]=Q;
}}}}var R=qx.Bootstrap.createNamespace(name,S);
S.name=S.classname=name;
S.basename=R;
S.$$type="Class";

if(K){S.$$classtype=K;
}if(!S.hasOwnProperty("toString")){S.toString=this.genericToString;
}
if(L){qx.Bootstrap.extendClass(S,N,L,name,R);
if(O){if(qx.core.Variant.isSet("qx.aspects","on")){O=qx.core.Aspect.wrap(name,O,"destructor");
}S.$$destructor=O;
qx.Bootstrap.setDisplayName(O,name,"destruct");
}}this.$$registry[name]=S;
return S;
},__Y:function(bB,bC,bD){var bE,bE;
{};

if(bB.$$events){for(var bE in bC){bB.$$events[bE]=bC[bE];
}}else{bB.$$events=bC;
}},__ba:function(s,t,u){var v;

if(u===undefined){u=false;
}var w=s.prototype;

for(var name in t){v=t[name];
{};
v.name=name;
if(!v.refine){if(s.$$properties===undefined){s.$$properties={};
}s.$$properties[name]=v;
}if(v.init!==undefined){s.prototype[bu+name]=v.init;
}if(v.event!==undefined){var event={};
event[v.event]=bp;
this.__Y(s,event,u);
}if(v.inheritable){qx.core.Property.$$inheritable[name]=true;

if(!w.$$refreshInheritables){qx.core.Property.attachRefreshInheritables(s);
}}
if(!v.refine){qx.core.Property.attachMethods(s,name,v);
}}},__bb:null,__bc:function(j,k,m,n,o){var p=j.prototype;
var r,q;
qx.Bootstrap.setDisplayNames(k,j.classname+br);

for(var i=0,a=qx.Bootstrap.getKeys(k),l=a.length;i<l;i++){r=a[i];
q=k[r];
{};
if(n!==false&&q instanceof Function&&q.$$type==null){if(o==true){q=this.__bd(q,p[r]);
}else{if(p[r]){q.base=p[r];
}q.self=j;
}
if(qx.core.Variant.isSet(bA,bz)){q=qx.core.Aspect.wrap(j.classname+by+r,q,bs);
}}p[r]=q;
}},__bd:function(bj,bk){if(bk){return function(){var h=bj.base;
bj.base=bk;
var g=bj.apply(this,arguments);
bj.base=h;
return g;
};
}else{return bj;
}},__be:function(bW,bX){{};
var bY=qx.Interface.flatten([bX]);

if(bW.$$implements){bW.$$implements.push(bX);
bW.$$flatImplements.push.apply(bW.$$flatImplements,bY);
}else{bW.$$implements=[bX];
bW.$$flatImplements=bY;
}},__bf:function(E){var name=E.classname;
var F=this.__bk(E,name,E.$$classtype);
for(var i=0,a=qx.Bootstrap.getKeys(E),l=a.length;i<l;i++){G=a[i];

if(E.hasOwnProperty(G)){F[G]=E[G];
}}F.prototype=E.prototype;
var I=E.prototype;

for(var i=0,a=qx.Bootstrap.getKeys(I),l=a.length;i<l;i++){G=a[i];

if(I.hasOwnProperty(G)){var J=I[G];

if(J.self==E){J.self=F;
}}}for(var G in this.$$registry){var H=this.$$registry[G];

if(!H){continue;
}
if(H.base==E){H.base=F;
}
if(H.superclass==E){H.superclass=F;
}
if(H.$$original){if(H.$$original.base==E){H.$$original.base=F;
}
if(H.$$original.superclass==E){H.$$original.superclass=F;
}}}qx.Bootstrap.createNamespace(name,F);
this.$$registry[name]=F;
return F;
},__bg:function(cd,ce,cf){{};

if(this.hasMixin(cd,ce)){return;
}var ci=cd.$$original;

if(ce.$$constructor&&!ci){cd=this.__bf(cd);
}var ch=qx.Mixin.flatten([ce]);
var cg;

for(var i=0,l=ch.length;i<l;i++){cg=ch[i];
if(cg.$$events){this.__Y(cd,cg.$$events,cf);
}if(cg.$$properties){this.__ba(cd,cg.$$properties,cf);
}if(cg.$$members){this.__bc(cd,cg.$$members,cf,cf,cf);
}}if(cd.$$includes){cd.$$includes.push(ce);
cd.$$flatIncludes.push.apply(cd.$$flatIncludes,ch);
}else{cd.$$includes=[ce];
cd.$$flatIncludes=ch;
}},__bh:function(){function bl(){bl.base.apply(this,arguments);
}return bl;
},__bi:function(){return function(){};
},__bj:function(x,y){{};
if(x&&x.$$includes){var z=x.$$flatIncludes;

for(var i=0,l=z.length;i<l;i++){if(z[i].$$constructor){return true;
}}}if(y){var A=qx.Mixin.flatten(y);

for(var i=0,l=A.length;i<l;i++){if(A[i].$$constructor){return true;
}}}return false;
},__bk:function(bc,name,bd){var bf=function(){var bV=bf;
{};
var bU=bV.$$original.apply(this,arguments);
if(bV.$$includes){var bT=bV.$$flatIncludes;

for(var i=0,l=bT.length;i<l;i++){if(bT[i].$$constructor){bT[i].$$constructor.apply(this,arguments);
}}}{};
return bU;
};

if(qx.core.Variant.isSet(bA,bz)){var be=qx.core.Aspect.wrap(name,bf,bt);
bf.$$original=bc;
bf.constructor=be;
bf=be;
}bf.$$original=bc;
bc.wrapper=bf;
return bf;
}},defer:function(){if(qx.core.Variant.isSet(bA,bz)){for(var Y in qx.Bootstrap.$$registry){var ba=qx.Bootstrap.$$registry[Y];

for(var bb in ba){if(ba[bb] instanceof Function){ba[bb]=qx.core.Aspect.wrap(Y+by+bb,ba[bb],bx);
}}}}}});
})();
(function(){var o="qx.client",n="on",m="function",l="mousedown",k="qx.bom.Event",j="return;",i="mouseover",h="HTMLEvents";
qx.Class.define(k,{statics:{addNativeListener:qx.core.Variant.select(o,{"mshtml":function(y,z,A){y.attachEvent(n+z,A);
},"default":function(a,b,c){a.addEventListener(b,c,false);
}}),removeNativeListener:qx.core.Variant.select(o,{"mshtml":function(t,u,v){try{t.detachEvent(n+u,v);
}catch(e){if(e.number!==-2146828218){throw e;
}}},"default":function(C,D,E){C.removeEventListener(D,E,false);
}}),getTarget:function(e){return e.target||e.srcElement;
},getRelatedTarget:qx.core.Variant.select(o,{"mshtml":function(e){if(e.type===i){return e.fromEvent;
}else{return e.toElement;
}},"gecko":function(e){try{e.relatedTarget&&e.relatedTarget.nodeType;
}catch(e){return null;
}return e.relatedTarget;
},"default":function(e){return e.relatedTarget;
}}),preventDefault:qx.core.Variant.select(o,{"gecko":function(e){if(qx.bom.client.Engine.VERSION>=1.9&&e.type==l&&e.button==2){return;
}e.preventDefault();
if(qx.bom.client.Engine.VERSION<1.9){try{e.keyCode=0;
}catch(F){}}},"mshtml":function(e){try{e.keyCode=0;
}catch(B){}e.returnValue=false;
},"default":function(e){e.preventDefault();
}}),stopPropagation:function(e){if(e.stopPropagation){e.stopPropagation();
}e.cancelBubble=true;
},fire:function(d,f){if(document.createEventObject){var g=document.createEventObject();
return d.fireEvent(n+f,g);
}else{var g=document.createEvent(h);
g.initEvent(f,true,true);
return !d.dispatchEvent(g);
}},supportsEvent:qx.core.Variant.select(o,{"webkit":function(w,x){return w.hasOwnProperty(n+x);
},"default":function(p,q){var r=n+q;
var s=(r in p);

if(!s){s=typeof p[r]==m;

if(!s&&p.setAttribute){p.setAttribute(r,j);
s=typeof p[r]==m;
p.removeAttribute(r);
}}return s;
}})}});
})();
(function(){var cu="|bubble",ct="|capture",cs="|",cr="",cq="_",cp="unload",co="UNKNOWN_",cn="__bq",cm="c",cl="DOM_",ci="WIN_",ck="__bp",cj="capture",ch="qx.event.Manager",cg="QX_";
qx.Class.define(ch,{extend:Object,construct:function(cE,cF){this.__bl=cE;
this.__bm=qx.core.ObjectRegistry.toHashCode(cE);
this.__bn=cF;
if(cE.qx!==qx){var self=this;
qx.bom.Event.addNativeListener(cE,cp,qx.event.GlobalError.observeMethod(function(){qx.bom.Event.removeNativeListener(cE,cp,arguments.callee);
self.dispose();
}));
}this.__bo={};
this.__bp={};
this.__bq={};
this.__br={};
},statics:{__bs:0,getNextUniqueId:function(){return (this.__bs++)+cr;
}},members:{__bn:null,__bo:null,__bq:null,__bt:null,__bp:null,__br:null,__bl:null,__bm:null,getWindow:function(){return this.__bl;
},getWindowId:function(){return this.__bm;
},getHandler:function(bx){var by=this.__bp[bx.classname];

if(by){return by;
}return this.__bp[bx.classname]=new bx(this);
},getDispatcher:function(a){var b=this.__bq[a.classname];

if(b){return b;
}return this.__bq[a.classname]=new a(this,this.__bn);
},getListeners:function(bj,bk,bl){var bm=bj.$$hash||qx.core.ObjectRegistry.toHashCode(bj);
var bo=this.__bo[bm];

if(!bo){return null;
}var bp=bk+(bl?ct:cu);
var bn=bo[bp];
return bn?bn.concat():null;
},serializeListeners:function(bz){var bG=bz.$$hash||qx.core.ObjectRegistry.toHashCode(bz);
var bI=this.__bo[bG];
var bE=[];

if(bI){var bC,bH,bA,bD,bF;

for(var bB in bI){bC=bB.indexOf(cs);
bH=bB.substring(0,bC);
bA=bB.charAt(bC+1)==cm;
bD=bI[bB];

for(var i=0,l=bD.length;i<l;i++){bF=bD[i];
bE.push({self:bF.context,handler:bF.handler,type:bH,capture:bA});
}}}return bE;
},toggleAttachedEvents:function(c,d){var j=c.$$hash||qx.core.ObjectRegistry.toHashCode(c);
var m=this.__bo[j];

if(m){var f,k,e,g;

for(var h in m){f=h.indexOf(cs);
k=h.substring(0,f);
e=h.charCodeAt(f+1)===99;
g=m[h];

if(d){this.__bu(c,k,e);
}else{this.__bv(c,k,e);
}}}},hasListener:function(bq,br,bs){{};
var bt=bq.$$hash||qx.core.ObjectRegistry.toHashCode(bq);
var bv=this.__bo[bt];

if(!bv){return false;
}var bw=br+(bs?ct:cu);
var bu=bv[bw];
return bu&&bu.length>0;
},importListeners:function(cv,cw){{};
var cC=cv.$$hash||qx.core.ObjectRegistry.toHashCode(cv);
var cD=this.__bo[cC]={};
var cz=qx.event.Manager;

for(var cx in cw){var cA=cw[cx];
var cB=cA.type+(cA.capture?ct:cu);
var cy=cD[cB];

if(!cy){cy=cD[cB]=[];
this.__bu(cv,cA.type,cA.capture);
}cy.push({handler:cA.listener,context:cA.self,unique:cA.unique||(cz.__bs++)+cr});
}},addListener:function(x,y,z,self,A){var E;
{};
var F=x.$$hash||qx.core.ObjectRegistry.toHashCode(x);
var H=this.__bo[F];

if(!H){H=this.__bo[F]={};
}var D=y+(A?ct:cu);
var C=H[D];

if(!C){C=H[D]=[];
}if(C.length===0){this.__bu(x,y,A);
}var G=(qx.event.Manager.__bs++)+cr;
var B={handler:z,context:self,unique:G};
C.push(B);
return D+cs+G;
},findHandler:function(bJ,bK){var bU=false,bN=false,bV=false;
var bT;

if(bJ.nodeType===1){bU=true;
bT=cl+bJ.tagName.toLowerCase()+cq+bK;
}else if(bJ==this.__bl){bN=true;
bT=ci+bK;
}else if(bJ.classname){bV=true;
bT=cg+bJ.classname+cq+bK;
}else{bT=co+bJ+cq+bK;
}var bP=this.__br;

if(bP[bT]){return bP[bT];
}var bS=this.__bn.getHandlers();
var bO=qx.event.IEventHandler;
var bQ,bR,bM,bL;

for(var i=0,l=bS.length;i<l;i++){bQ=bS[i];
bM=bQ.SUPPORTED_TYPES;

if(bM&&!bM[bK]){continue;
}bL=bQ.TARGET_CHECK;

if(bL){if(!bU&&bL===bO.TARGET_DOMNODE){continue;
}else if(!bN&&bL===bO.TARGET_WINDOW){continue;
}else if(!bV&&bL===bO.TARGET_OBJECT){continue;
}}bR=this.getHandler(bS[i]);

if(bQ.IGNORE_CAN_HANDLE||bR.canHandleEvent(bJ,bK)){bP[bT]=bR;
return bR;
}}return null;
},__bu:function(bW,bX,bY){var ca=this.findHandler(bW,bX);

if(ca){ca.registerEvent(bW,bX,bY);
return;
}{};
},removeListener:function(n,o,p,self,q){var u;
{};
var v=n.$$hash||qx.core.ObjectRegistry.toHashCode(n);
var w=this.__bo[v];

if(!w){return false;
}var r=o+(q?ct:cu);
var s=w[r];

if(!s){return false;
}var t;

for(var i=0,l=s.length;i<l;i++){t=s[i];

if(t.handler===p&&t.context===self){qx.lang.Array.removeAt(s,i);

if(s.length==0){this.__bv(n,o,q);
}return true;
}}return false;
},removeListenerById:function(I,J){var P;
{};
var N=J.split(cs);
var S=N[0];
var K=N[1].charCodeAt(0)==99;
var R=N[2];
var Q=I.$$hash||qx.core.ObjectRegistry.toHashCode(I);
var T=this.__bo[Q];

if(!T){return false;
}var O=S+(K?ct:cu);
var M=T[O];

if(!M){return false;
}var L;

for(var i=0,l=M.length;i<l;i++){L=M[i];

if(L.unique===R){qx.lang.Array.removeAt(M,i);

if(M.length==0){this.__bv(I,S,K);
}return true;
}}return false;
},removeAllListeners:function(U){var Y=U.$$hash||qx.core.ObjectRegistry.toHashCode(U);
var bb=this.__bo[Y];

if(!bb){return false;
}var W,ba,V;

for(var X in bb){if(bb[X].length>0){W=X.split(cs);
ba=W[0];
V=W[1]===cj;
this.__bv(U,ba,V);
}}delete this.__bo[Y];
return true;
},deleteAllListeners:function(cf){delete this.__bo[cf];
},__bv:function(cb,cc,cd){var ce=this.findHandler(cb,cc);

if(ce){ce.unregisterEvent(cb,cc,cd);
return;
}{};
},dispatchEvent:function(bc,event){var bh;
{};
var bi=event.getType();

if(!event.getBubbles()&&!this.hasListener(bc,bi)){qx.event.Pool.getInstance().poolObject(event);
return true;
}
if(!event.getTarget()){event.setTarget(bc);
}var bg=this.__bn.getDispatchers();
var bf;
var be=false;

for(var i=0,l=bg.length;i<l;i++){bf=this.getDispatcher(bg[i]);
if(bf.canDispatchEvent(bc,event,bi)){bf.dispatchEvent(bc,event,bi);
be=true;
break;
}}
if(!be){{};
return true;
}var bd=event.getDefaultPrevented();
qx.event.Pool.getInstance().poolObject(event);
return !bd;
},dispose:function(){this.__bn.removeManager(this);
qx.util.DisposeUtil.disposeMap(this,ck);
qx.util.DisposeUtil.disposeMap(this,cn);
this.__bo=this.__bl=this.__bt=null;
this.__bn=this.__br=null;
}}});
})();
(function(){var j="qx.dom.Node",h="qx.client",g="";
qx.Class.define(j,{statics:{ELEMENT:1,ATTRIBUTE:2,TEXT:3,CDATA_SECTION:4,ENTITY_REFERENCE:5,ENTITY:6,PROCESSING_INSTRUCTION:7,COMMENT:8,DOCUMENT:9,DOCUMENT_TYPE:10,DOCUMENT_FRAGMENT:11,NOTATION:12,getDocument:function(d){return d.nodeType===
this.DOCUMENT?d:
d.ownerDocument||d.document;
},getWindow:qx.core.Variant.select(h,{"mshtml":function(p){if(p.nodeType==null){return p;
}if(p.nodeType!==this.DOCUMENT){p=p.ownerDocument;
}return p.parentWindow;
},"default":function(f){if(f.nodeType==null){return f;
}if(f.nodeType!==this.DOCUMENT){f=f.ownerDocument;
}return f.defaultView;
}}),getDocumentElement:function(m){return this.getDocument(m).documentElement;
},getBodyElement:function(c){return this.getDocument(c).body;
},isNode:function(b){return !!(b&&b.nodeType!=null);
},isElement:function(t){return !!(t&&t.nodeType===this.ELEMENT);
},isDocument:function(l){return !!(l&&l.nodeType===this.DOCUMENT);
},isText:function(k){return !!(k&&k.nodeType===this.TEXT);
},isWindow:function(s){return !!(s&&s.history&&s.location&&s.document);
},isNodeName:function(q,r){if(!r||!q||!q.nodeName){return false;
}return r.toLowerCase()==qx.dom.Node.getName(q);
},getName:function(e){if(!e||!e.nodeName){return null;
}return e.nodeName.toLowerCase();
},getText:function(n){if(!n||!n.nodeType){return null;
}
switch(n.nodeType){case 1:var i,a=[],o=n.childNodes,length=o.length;

for(i=0;i<length;i++){a[i]=this.getText(o[i]);
}return a.join(g);
case 2:return n.nodeValue;
break;
case 3:return n.nodeValue;
break;
}return null;
}}});
})();
(function(){var z="mshtml",y="qx.client",x="[object Array]",w="qx.lang.Array",v="qx",u="number",t="string";
qx.Class.define(w,{statics:{toArray:function(bp,bq){return this.cast(bp,Array,bq);
},cast:function(R,S,T){if(R.constructor===S){return R;
}
if(qx.Class.hasInterface(R,qx.data.IListData)){var R=R.toArray();
}var U=new S;
if(qx.core.Variant.isSet(y,z)){if(R.item){for(var i=T||0,l=R.length;i<l;i++){U.push(R[i]);
}return U;
}}if(Object.prototype.toString.call(R)===x&&T==null){U.push.apply(U,R);
}else{U.push.apply(U,Array.prototype.slice.call(R,T||0));
}return U;
},fromArguments:function(h,j){return Array.prototype.slice.call(h,j||0);
},fromCollection:function(f){if(qx.core.Variant.isSet(y,z)){if(f.item){var g=[];

for(var i=0,l=f.length;i<l;i++){g[i]=f[i];
}return g;
}}return Array.prototype.slice.call(f,0);
},fromShortHand:function(V){var X=V.length;
var W=qx.lang.Array.clone(V);
switch(X){case 1:W[1]=W[2]=W[3]=W[0];
break;
case 2:W[2]=W[0];
case 3:W[3]=W[1];
}return W;
},clone:function(Y){return Y.concat();
},insertAt:function(ba,bb,i){ba.splice(i,0,bb);
return ba;
},insertBefore:function(F,G,H){var i=F.indexOf(H);

if(i==-1){F.push(G);
}else{F.splice(i,0,G);
}return F;
},insertAfter:function(I,J,K){var i=I.indexOf(K);

if(i==-1||i==(I.length-1)){I.push(J);
}else{I.splice(i+1,0,J);
}return I;
},removeAt:function(k,i){return k.splice(i,1)[0];
},removeAll:function(Q){Q.length=0;
return this;
},append:function(D,E){{};
Array.prototype.push.apply(D,E);
return D;
},exclude:function(b,c){{};

for(var i=0,e=c.length,d;i<e;i++){d=b.indexOf(c[i]);

if(d!=-1){b.splice(d,1);
}}return b;
},remove:function(r,s){var i=r.indexOf(s);

if(i!=-1){r.splice(i,1);
return s;
}},contains:function(p,q){return p.indexOf(q)!==-1;
},equals:function(L,M){var length=L.length;

if(length!==M.length){return false;
}
for(var i=0;i<length;i++){if(L[i]!==M[i]){return false;
}}return true;
},sum:function(n){var o=0;

for(var i=0,l=n.length;i<l;i++){o+=n[i];
}return o;
},max:function(N){{};
var i,P=N.length,O=N[0];

for(i=1;i<P;i++){if(N[i]>O){O=N[i];
}}return O===undefined?null:O;
},min:function(A){{};
var i,C=A.length,B=A[0];

for(i=1;i<C;i++){if(A[i]<B){B=A[i];
}}return B===undefined?null:B;
},unique:function(bc){var bm=[],be={},bh={},bj={};
var bi,bd=0;
var bn=v+qx.lang.Date.now();
var bf=false,bl=false,bo=false;
for(var i=0,bk=bc.length;i<bk;i++){bi=bc[i];
if(bi===null){if(!bf){bf=true;
bm.push(bi);
}}else if(bi===undefined){}else if(bi===false){if(!bl){bl=true;
bm.push(bi);
}}else if(bi===true){if(!bo){bo=true;
bm.push(bi);
}}else if(typeof bi===t){if(!be[bi]){be[bi]=1;
bm.push(bi);
}}else if(typeof bi===u){if(!bh[bi]){bh[bi]=1;
bm.push(bi);
}}else{bg=bi[bn];

if(bg==null){bg=bi[bn]=bd++;
}
if(!bj[bg]){bj[bg]=bi;
bm.push(bi);
}}}for(var bg in bj){try{delete bj[bg][bn];
}catch(m){try{bj[bg][bn]=null;
}catch(a){throw new Error("Cannot clean-up map entry doneObjects["+bg+"]["+bn+"]");
}}}return bm;
}}});
})();
(function(){var y="()",x=".",w=".prototype.",v='anonymous()',u="qx.lang.Function",t=".constructor()";
qx.Class.define(u,{statics:{getCaller:function(m){return m.caller?m.caller.callee:m.callee.caller;
},getName:function(C){if(C.displayName){return C.displayName;
}
if(C.$$original||C.wrapper||C.classname){return C.classname+t;
}
if(C.$$mixin){for(var E in C.$$mixin.$$members){if(C.$$mixin.$$members[E]==C){return C.$$mixin.name+w+E+y;
}}for(var E in C.$$mixin){if(C.$$mixin[E]==C){return C.$$mixin.name+x+E+y;
}}}
if(C.self){var F=C.self.constructor;

if(F){for(var E in F.prototype){if(F.prototype[E]==C){return F.classname+w+E+y;
}}for(var E in F){if(F[E]==C){return F.classname+x+E+y;
}}}}var D=C.toString().match(/function\s*(\w*)\s*\(.*/);

if(D&&D.length>=1&&D[1]){return D[1]+y;
}return v;
},globalEval:function(B){if(window.execScript){return window.execScript(B);
}else{return eval.call(window,B);
}},empty:function(){},returnTrue:function(){return true;
},returnFalse:function(){return false;
},returnNull:function(){return null;
},returnThis:function(){return this;
},returnZero:function(){return 0;
},create:function(G,H){{};
if(!H){return G;
}if(!(H.self||H.args||H.delay!=null||H.periodical!=null||H.attempt)){return G;
}return function(event){{};
var h=qx.lang.Array.fromArguments(arguments);
if(H.args){h=H.args.concat(h);
}
if(H.delay||H.periodical){var g=qx.event.GlobalError.observeMethod(function(){return G.apply(H.self||this,h);
});

if(H.delay){return window.setTimeout(g,H.delay);
}
if(H.periodical){return window.setInterval(g,H.periodical);
}}else if(H.attempt){var i=false;

try{i=G.apply(H.self||this,h);
}catch(q){}return i;
}else{return G.apply(H.self||this,h);
}};
},bind:function(z,self,A){return this.create(z,{self:self,args:arguments.length>2?qx.lang.Array.fromArguments(arguments,2):null});
},curry:function(k,l){return this.create(k,{args:arguments.length>1?qx.lang.Array.fromArguments(arguments,1):null});
},listener:function(d,self,e){if(arguments.length<3){return function(event){return d.call(self||this,event||window.event);
};
}else{var f=qx.lang.Array.fromArguments(arguments,2);
return function(event){var j=[event||window.event];
j.push.apply(j,f);
d.apply(self||this,j);
};
}},attempt:function(r,self,s){return this.create(r,{self:self,attempt:true,args:arguments.length>2?qx.lang.Array.fromArguments(arguments,2):null})();
},delay:function(a,b,self,c){return this.create(a,{delay:b,self:self,args:arguments.length>3?qx.lang.Array.fromArguments(arguments,3):null})();
},periodical:function(n,o,self,p){return this.create(n,{periodical:o,self:self,args:arguments.length>3?qx.lang.Array.fromArguments(arguments,3):null})();
}}});
})();
(function(){var r="qx.event.Registration";
qx.Class.define(r,{statics:{__bw:{},getManager:function(C){if(C==null){{};
C=window;
}else if(C.nodeType){C=qx.dom.Node.getWindow(C);
}else if(!qx.dom.Node.isWindow(C)){C=window;
}var E=C.$$hash||qx.core.ObjectRegistry.toHashCode(C);
var D=this.__bw[E];

if(!D){D=new qx.event.Manager(C,this);
this.__bw[E]=D;
}return D;
},removeManager:function(A){var B=A.getWindowId();
delete this.__bw[B];
},addListener:function(s,t,u,self,v){return this.getManager(s).addListener(s,t,u,self,v);
},removeListener:function(k,l,m,self,n){return this.getManager(k).removeListener(k,l,m,self,n);
},removeListenerById:function(p,q){return this.getManager(p).removeListenerById(p,q);
},removeAllListeners:function(y){return this.getManager(y).removeAllListeners(y);
},deleteAllListeners:function(i){var j=i.$$hash;

if(j){this.getManager(i).deleteAllListeners(j);
}},hasListener:function(M,N,O){return this.getManager(M).hasListener(M,N,O);
},serializeListeners:function(o){return this.getManager(o).serializeListeners(o);
},createEvent:function(P,Q,R){{};
if(Q==null){Q=qx.event.type.Event;
}var S=qx.event.Pool.getInstance().getObject(Q);
R?S.init.apply(S,R):S.init();
if(P){S.setType(P);
}return S;
},dispatchEvent:function(F,event){return this.getManager(F).dispatchEvent(F,event);
},fireEvent:function(G,H,I,J){var K;
{};
var L=this.createEvent(H,I||null,J);
return this.getManager(G).dispatchEvent(G,L);
},fireNonBubblingEvent:function(c,d,e,f){{};
var g=this.getManager(c);

if(!g.hasListener(c,d,false)){return true;
}var h=this.createEvent(d,e||null,f);
return g.dispatchEvent(c,h);
},PRIORITY_FIRST:-32000,PRIORITY_NORMAL:0,PRIORITY_LAST:32000,__bx:[],addHandler:function(z){{};
this.__bx.push(z);
this.__bx.sort(function(a,b){return a.PRIORITY-b.PRIORITY;
});
},getHandlers:function(){return this.__bx;
},__by:[],addDispatcher:function(w,x){{};
this.__by.push(w);
this.__by.sort(function(a,b){return a.PRIORITY-b.PRIORITY;
});
},getDispatchers:function(){return this.__by;
}}});
})();
(function(){var k="$$hash",j="",h="qx.core.ObjectRegistry";
qx.Class.define(h,{statics:{inShutDown:false,__bz:{},__bA:0,__bB:[],register:function(m){var p=this.__bz;

if(!p){return;
}var o=m.$$hash;

if(o==null){var n=this.__bB;

if(n.length>0){o=n.pop();
}else{o=(this.__bA++)+j;
}m.$$hash=o;
}{};
p[o]=m;
},unregister:function(y){var z=y.$$hash;

if(z==null){return;
}var A=this.__bz;

if(A&&A[z]){delete A[z];
this.__bB.push(z);
}try{delete y.$$hash;
}catch(v){if(y.removeAttribute){y.removeAttribute(k);
}}},toHashCode:function(d){{};
var f=d.$$hash;

if(f!=null){return f;
}var e=this.__bB;

if(e.length>0){f=e.pop();
}else{f=(this.__bA++)+j;
}return d.$$hash=f;
},clearHashCode:function(w){{};
var x=w.$$hash;

if(x!=null){this.__bB.push(x);
try{delete w.$$hash;
}catch(u){if(w.removeAttribute){w.removeAttribute(k);
}}}},fromHashCode:function(g){return this.__bz[g]||null;
},shutdown:function(){this.inShutDown=true;
var r=this.__bz;
var t=[];

for(var s in r){t.push(s);
}t.sort(function(a,b){return parseInt(b)-parseInt(a);
});
var q,i=0,l=t.length;

while(true){try{for(;i<l;i++){s=t[i];
q=r[s];

if(q&&q.dispose){q.dispose();
}}}catch(c){qx.Bootstrap.error(this,"Could not dispose object "+q.toString()+": "+c);

if(i!==l){i++;
continue;
}}break;
}qx.Bootstrap.debug(this,"Disposed "+l+" objects");
delete this.__bz;
},getRegistry:function(){return this.__bz;
}}});
})();
(function(){var a="qx.data.MBinding";
qx.Mixin.define(a,{members:{bind:function(c,d,e,f){return qx.data.SingleValueBinding.bind(this,c,d,e,f);
},removeBinding:function(b){qx.data.SingleValueBinding.removeBindingFromObject(this,b);
},removeAllBindings:function(){qx.data.SingleValueBinding.removeAllBindingsForObject(this);
},getBindings:function(){return qx.data.SingleValueBinding.getAllBindingsForObject(this);
}}});
})();
(function(){var A=":",z="qx.client",y="anonymous",x="...",w="qx.dev.StackTrace",v="",u="\n",t="/source/class/",s=".";
qx.Class.define(w,{statics:{getStackTrace:qx.core.Variant.select(z,{"gecko":function(){try{throw new Error();
}catch(S){var I=this.getStackTraceFromError(S);
qx.lang.Array.removeAt(I,0);
var G=this.getStackTraceFromCaller(arguments);
var E=G.length>I.length?G:I;

for(var i=0;i<Math.min(G.length,I.length);i++){var F=G[i];

if(F.indexOf(y)>=0){continue;
}var M=F.split(A);

if(M.length!=2){continue;
}var K=M[0];
var D=M[1];
var C=I[i];
var N=C.split(A);
var J=N[0];
var B=N[1];

if(qx.Class.getByName(J)){var H=J;
}else{H=K;
}var L=H+A;

if(D){L+=D+A;
}L+=B;
E[i]=L;
}return E;
}},"mshtml|webkit":function(){return this.getStackTraceFromCaller(arguments);
},"opera":function(){var b;

try{b.bar();
}catch(d){var c=this.getStackTraceFromError(d);
qx.lang.Array.removeAt(c,0);
return c;
}return [];
}}),getStackTraceFromCaller:qx.core.Variant.select(z,{"opera":function(T){return [];
},"default":function(e){var k=[];
var j=qx.lang.Function.getCaller(e);
var f={};

while(j){var g=qx.lang.Function.getName(j);
k.push(g);

try{j=j.caller;
}catch(a){break;
}
if(!j){break;
}var h=qx.core.ObjectRegistry.toHashCode(j);

if(f[h]){k.push(x);
break;
}f[h]=j;
}return k;
}}),getStackTraceFromError:qx.core.Variant.select(z,{"gecko":function(l){if(!l.stack){return [];
}var r=/@(.+):(\d+)$/gm;
var m;
var n=[];

while((m=r.exec(l.stack))!=null){var o=m[1];
var q=m[2];
var p=this.__bC(o);
n.push(p+A+q);
}return n;
},"webkit":function(bc){if(bc.sourceURL&&bc.line){return [this.__bC(bc.sourceURL)+A+bc.line];
}else{return [];
}},"opera":function(U){if(U.message.indexOf("Backtrace:")<0){return [];
}var W=[];
var X=qx.lang.String.trim(U.message.split("Backtrace:")[1]);
var Y=X.split(u);

for(var i=0;i<Y.length;i++){var V=Y[i].match(/\s*Line ([0-9]+) of.* (\S.*)/);

if(V&&V.length>=2){var bb=V[1];
var ba=this.__bC(V[2]);
W.push(ba+A+bb);
}}return W;
},"default":function(){return [];
}}),__bC:function(O){var R=t;
var P=O.indexOf(R);
var Q=(P==-1)?O:O.substring(P+R.length).replace(/\//g,s).replace(/\.js$/,v);
return Q;
}}});
})();
(function(){var e="qx.log.appender.RingBuffer";
qx.Class.define(e,{extend:Object,construct:function(g){this.__bD=[];
this.setMaxMessages(g||50);
},members:{__bE:0,__bD:null,__bF:50,setMaxMessages:function(f){this.__bF=f;
this.clearHistory();
},getMaxMessages:function(){return this.__bF;
},process:function(h){var i=this.getMaxMessages();

if(this.__bD.length<i){this.__bD.push(h);
}else{this.__bD[this.__bE++]=h;

if(this.__bE>=i){this.__bE=0;
}}},getAllLogEvents:function(){return this.retrieveLogEvents(this.getMaxMessages());
},retrieveLogEvents:function(a){if(a>this.__bD.length){a=this.__bD.length;
}
if(this.__bD.length==this.getMaxMessages()){var c=this.__bE-1;
}else{c=this.__bD.length-1;
}var b=c-a+1;

if(b<0){b+=this.__bD.length;
}var d;

if(b<=c){d=this.__bD.slice(b,c+1);
}else{d=this.__bD.slice(b,this.__bD.length).concat(this.__bD.slice(0,c+1));
}return d;
},clearHistory:function(){this.__bD=[];
this.__bE=0;
}}});
})();
(function(){var W="node",V="error",U="...(+",T="array",S=")",R="info",Q="instance",P="string",O="null",N="class",bs="number",br="stringify",bq="]",bp="unknown",bo="function",bn="boolean",bm="debug",bl="map",bk="undefined",bj="qx.log.Logger",be=")}",bf="#",bc="warn",bd="document",ba="{...(",bb="[",X="text[",Y="[...(",bg="\n",bh=")]",bi="object";
qx.Class.define(bj,{statics:{__bG:bm,setLevel:function(bv){this.__bG=bv;
},getLevel:function(){return this.__bG;
},setTreshold:function(bN){this.__bJ.setMaxMessages(bN);
},getTreshold:function(){return this.__bJ.getMaxMessages();
},__bH:{},__bI:0,register:function(u){if(u.$$id){return;
}var v=this.__bI++;
this.__bH[v]=u;
u.$$id=v;
var w=this.__bJ.getAllLogEvents();

for(var i=0,l=w.length;i<l;i++){u.process(w[i]);
}},unregister:function(p){var q=p.$$id;

if(q==null){return;
}delete this.__bH[q];
delete p.$$id;
},debug:function(L,M){qx.log.Logger.__bL(bm,arguments);
},info:function(bB,bC){qx.log.Logger.__bL(R,arguments);
},warn:function(J,K){qx.log.Logger.__bL(bc,arguments);
},error:function(bz,bA){qx.log.Logger.__bL(V,arguments);
},trace:function(bH){qx.log.Logger.__bL(R,[bH,qx.dev.StackTrace.getStackTrace().join(bg)]);
},deprecatedMethodWarning:function(r,s){var t;
{};
},deprecatedClassWarning:function(bw,bx){var by;
{};
},deprecatedEventWarning:function(m,event,n){var o;
{};
},deprecatedMixinWarning:function(G,H){var I;
{};
},deprecatedConstantWarning:function(bD,bE,bF){var self,bG;
{};
},deprecateMethodOverriding:function(bI,bJ,bK,bL){var bM;
{};
},clear:function(){this.__bJ.clearHistory();
},__bJ:new qx.log.appender.RingBuffer(50),__bK:{debug:0,info:1,warn:2,error:3},__bL:function(a,b){var g=this.__bK;

if(g[a]<g[this.__bG]){return;
}var d=b.length<2?null:b[0];
var f=d?1:0;
var c=[];

for(var i=f,l=b.length;i<l;i++){c.push(this.__bN(b[i],true));
}var h=new Date;
var j={time:h,offset:h-qx.Bootstrap.LOADSTART,level:a,items:c,win:window};
if(d){if(d instanceof qx.core.Object){j.object=d.$$hash;
}else if(d.$$type){j.clazz=d;
}}this.__bJ.process(j);
var k=this.__bH;

for(var e in k){k[e].process(j);
}},__bM:function(bt){if(bt===undefined){return bk;
}else if(bt===null){return O;
}
if(bt.$$type){return N;
}var bu=typeof bt;

if(bu===bo||bu==P||bu===bs||bu===bn){return bu;
}else if(bu===bi){if(bt.nodeType){return W;
}else if(bt.classname){return Q;
}else if(bt instanceof Array){return T;
}else if(bt instanceof Error){return V;
}else{return bl;
}}
if(bt.toString){return br;
}return bp;
},__bN:function(x,y){var F=this.__bM(x);
var B=bp;
var A=[];

switch(F){case O:case bk:B=F;
break;
case P:case bs:case bn:B=x;
break;
case W:if(x.nodeType===9){B=bd;
}else if(x.nodeType===3){B=X+x.nodeValue+bq;
}else if(x.nodeType===1){B=x.nodeName.toLowerCase();

if(x.id){B+=bf+x.id;
}}else{B=W;
}break;
case bo:B=qx.lang.Function.getName(x)||F;
break;
case Q:B=x.basename+bb+x.$$hash+bq;
break;
case N:case br:B=x.toString();
break;
case V:A=qx.dev.StackTrace.getStackTraceFromError(x);
B=x.toString();
break;
case T:if(y){B=[];

for(var i=0,l=x.length;i<l;i++){if(B.length>20){B.push(U+(l-i)+S);
break;
}B.push(this.__bN(x[i],false));
}}else{B=Y+x.length+bh;
}break;
case bl:if(y){var z;
var E=[];

for(var D in x){E.push(D);
}E.sort();
B=[];

for(var i=0,l=E.length;i<l;i++){if(B.length>20){B.push(U+(l-i)+S);
break;
}D=E[i];
z=this.__bN(x[D],false);
z.key=D;
B.push(z);
}}else{var C=0;

for(var D in x){C++;
}B=ba+C+be;
}break;
}return {type:F,text:B,trace:A};
}},defer:function(bO){var bP=qx.Bootstrap.$$logs;

for(var i=0;i<bP.length;i++){this.__bL(bP[i][0],bP[i][1]);
}qx.Bootstrap.debug=bO.debug;
qx.Bootstrap.info=bO.info;
qx.Bootstrap.warn=bO.warn;
qx.Bootstrap.error=bO.error;
qx.Bootstrap.trace=bO.trace;
}});
})();
(function(){var O="set",N="get",M="reset",L="MSIE 6.0",K="qx.core.Object",J="]",I="rv:1.8.1",H="[",G="$$user_",F="Object";
qx.Class.define(K,{extend:Object,include:[qx.data.MBinding],construct:function(){qx.core.ObjectRegistry.register(this);
},statics:{$$type:F},members:{toHashCode:function(){return this.$$hash;
},toString:function(){return this.classname+H+this.$$hash+J;
},base:function(bj,bk){{};

if(arguments.length===1){return bj.callee.base.call(this);
}else{return bj.callee.base.apply(this,Array.prototype.slice.call(arguments,1));
}},self:function(bv){return bv.callee.self;
},clone:function(){var R=this.constructor;
var Q=new R;
var T=qx.Class.getProperties(R);
var S=qx.core.Property.$$store.user;
var U=qx.core.Property.$$method.set;
var name;
for(var i=0,l=T.length;i<l;i++){name=T[i];

if(this.hasOwnProperty(S[name])){Q[U[name]](this[S[name]]);
}}return Q;
},set:function(bw,bx){var bz=qx.core.Property.$$method.set;

if(qx.Bootstrap.isString(bw)){if(!this[bz[bw]]){if(this[O+qx.Bootstrap.firstUp(bw)]!=undefined){this[O+qx.Bootstrap.firstUp(bw)](bx);
return;
}{};
}return this[bz[bw]](bx);
}else{for(var by in bw){if(!this[bz[by]]){if(this[O+qx.Bootstrap.firstUp(by)]!=undefined){this[O+qx.Bootstrap.firstUp(by)](bw[by]);
continue;
}{};
}this[bz[by]](bw[by]);
}return this;
}},get:function(f){var g=qx.core.Property.$$method.get;

if(!this[g[f]]){if(this[N+qx.Bootstrap.firstUp(f)]!=undefined){return this[N+qx.Bootstrap.firstUp(f)]();
}{};
}return this[g[f]]();
},reset:function(bh){var bi=qx.core.Property.$$method.reset;

if(!this[bi[bh]]){if(this[M+qx.Bootstrap.firstUp(bh)]!=undefined){this[M+qx.Bootstrap.firstUp(bh)]();
return;
}{};
}this[bi[bh]]();
},__bO:qx.event.Registration,addListener:function(h,j,self,k){if(!this.$$disposed){return this.__bO.addListener(this,h,j,self,k);
}return null;
},addListenerOnce:function(bE,bF,self,bG){var bH=function(e){bF.call(self||this,e);
this.removeListener(bE,bH,this,bG);
};
return this.addListener(bE,bH,this,bG);
},removeListener:function(bo,bp,self,bq){if(!this.$$disposed){return this.__bO.removeListener(this,bo,bp,self,bq);
}return false;
},removeListenerById:function(V){if(!this.$$disposed){return this.__bO.removeListenerById(this,V);
}return false;
},hasListener:function(u,v){return this.__bO.hasListener(this,u,v);
},dispatchEvent:function(X){if(!this.$$disposed){return this.__bO.dispatchEvent(this,X);
}return true;
},fireEvent:function(bl,bm,bn){if(!this.$$disposed){return this.__bO.fireEvent(this,bl,bm,bn);
}return true;
},fireNonBubblingEvent:function(b,c,d){if(!this.$$disposed){return this.__bO.fireNonBubblingEvent(this,b,c,d);
}return true;
},fireDataEvent:function(w,x,y,z){if(!this.$$disposed){if(y===undefined){y=null;
}return this.__bO.fireNonBubblingEvent(this,w,qx.event.type.Data,[x,y,!!z]);
}return true;
},__bP:null,setUserData:function(bA,bB){if(!this.__bP){this.__bP={};
}this.__bP[bA]=bB;
},getUserData:function(Y){if(!this.__bP){return null;
}var ba=this.__bP[Y];
return ba===undefined?null:ba;
},__bQ:qx.log.Logger,debug:function(bu){this.__bQ.debug(this,bu);
},info:function(W){this.__bQ.info(this,W);
},warn:function(bC){this.__bQ.warn(this,bC);
},error:function(bD){this.__bQ.error(this,bD);
},trace:function(){this.__bQ.trace(this);
},isDisposed:function(){return this.$$disposed||false;
},dispose:function(){var bf,bd,bc,bg;
if(this.$$disposed){return;
}this.$$disposed=true;
this.$$instance=null;
this.$$allowconstruct=null;
{};
var be=this.constructor;
var bb;

while(be.superclass){if(be.$$destructor){be.$$destructor.call(this);
}if(be.$$includes){bb=be.$$flatIncludes;

for(var i=0,l=bb.length;i<l;i++){if(bb[i].$$destructor){bb[i].$$destructor.call(this);
}}}be=be.superclass;
}if(this.__bR){this.__bR();
}{};
},__bR:null,__bS:function(){var P=qx.Class.getProperties(this.constructor);

for(var i=0,l=P.length;i<l;i++){delete this[G+P[i]];
}},_disposeFields:function(br){qx.Bootstrap.warn("Don't use '_disposeFields' - instead assign directly to 'null'");
qx.util.DisposeUtil.disposeFields(this,arguments);
},_disposeObjects:function(bs){qx.util.DisposeUtil.disposeObjects(this,arguments);
},_disposeSingletonObjects:function(bt){qx.util.DisposeUtil.disposeObjects(this,arguments,true);
},_disposeArray:function(E){qx.util.DisposeUtil.disposeArray(this,E);
},_disposeMap:function(a){qx.util.DisposeUtil.disposeMap(this,a);
}},settings:{"qx.disposerDebugLevel":0},defer:function(A,B){{};
var D=navigator.userAgent.indexOf(L)!=-1;
var C=navigator.userAgent.indexOf(I)!=-1;
if(D||C){B.__bR=B.__bS;
}},destruct:function(){if(!qx.core.ObjectRegistry.inShutDown){qx.event.Registration.removeAllListeners(this);
}else{qx.event.Registration.deleteAllListeners(this);
}qx.core.ObjectRegistry.unregister(this);
this.__bP=null;
var o=this.constructor;
var s;
var t=qx.core.Property.$$store;
var q=t.user;
var r=t.theme;
var m=t.inherit;
var p=t.useinit;
var n=t.init;

while(o){s=o.$$properties;

if(s){for(var name in s){if(s[name].dispose||s[name].dereference){this[q[name]]=this[r[name]]=this[m[name]]=this[p[name]]=this[n[name]]=undefined;
}}}o=o.superclass;
}}});
})();
(function(){var d="qx.event.IEventHandler";
qx.Interface.define(d,{statics:{TARGET_DOMNODE:1,TARGET_WINDOW:2,TARGET_OBJECT:3},members:{canHandleEvent:function(h,i){},registerEvent:function(a,b,c){},unregisterEvent:function(e,f,g){}}});
})();
(function(){var f="qx.globalErrorHandling",d="on",c="qx.event.GlobalError";
qx.Bootstrap.define(c,{statics:{setErrorHandler:function(g,h){this.__bT=g||null;
this.__bU=h||window;

if(qx.core.Setting.get(f)===d){if(g&&window.onerror){var i=qx.Bootstrap.bind(this.__bW,this);

if(this.__bV==null){this.__bV=window.onerror;
}var self=this;
window.onerror=function(e){self.__bV(e);
i(e);
};
}
if(g&&!window.onerror){window.onerror=qx.Bootstrap.bind(this.__bW,this);
}if(this.__bT==null){if(this.__bV!=null){window.onerror=this.__bV;
this.__bV=null;
}else{window.onerror=null;
}}}},__bW:function(l,m,n){if(this.__bT){this.handleError(new qx.core.WindowError(l,m,n));
return true;
}},observeMethod:function(k){if(qx.core.Setting.get(f)===d){var self=this;
return function(){if(!self.__bT){return k.apply(this,arguments);
}
try{return k.apply(this,arguments);
}catch(j){self.handleError(new qx.core.GlobalError(j,arguments));
}};
}else{return k;
}},handleError:function(b){if(this.__bT){this.__bT.call(this.__bU,b);
}}},defer:function(a){qx.core.Setting.define(f,d);
a.setErrorHandler(null,null);
}});
})();
(function(){var o="ready",n="qx.client",m="mshtml",l="load",k="unload",j="qx.event.handler.Application",i="complete",h="gecko|opera|webkit",g="left",f="DOMContentLoaded",d="shutdown";
qx.Class.define(j,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(r){qx.core.Object.call(this);
this._window=r.getWindow();
this.__bX=false;
this.__bY=false;
this._initObserver();
qx.event.handler.Application.$$instance=this;
},statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{ready:1,shutdown:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_WINDOW,IGNORE_CAN_HANDLE:true,onScriptLoaded:function(){var p=qx.event.handler.Application.$$instance;

if(p){p.__cc();
}}},members:{canHandleEvent:function(v,w){},registerEvent:function(a,b,c){},unregisterEvent:function(s,t,u){},__ca:null,__bX:null,__bY:null,__cb:null,__cc:function(){if(!this.__ca&&this.__bX&&qx.$$loader.scriptLoaded){if(qx.core.Variant.isSet(n,m)){if(qx.event.Registration.hasListener(this._window,o)){this.__ca=true;
qx.event.Registration.fireEvent(this._window,o);
}}else{this.__ca=true;
qx.event.Registration.fireEvent(this._window,o);
}}},isApplicationReady:function(){return this.__ca;
},_initObserver:function(){if(qx.$$domReady||document.readyState==i||document.readyState==o){this.__bX=true;
this.__cc();
}else{this._onNativeLoadWrapped=qx.lang.Function.bind(this._onNativeLoad,this);

if(qx.core.Variant.isSet(n,h)){qx.bom.Event.addNativeListener(this._window,f,this._onNativeLoadWrapped);
}else if(qx.core.Variant.isSet(n,m)){var self=this;
var x=function(){try{document.documentElement.doScroll(g);

if(document.body){self._onNativeLoadWrapped();
}}catch(y){window.setTimeout(x,100);
}};
x();
}qx.bom.Event.addNativeListener(this._window,l,this._onNativeLoadWrapped);
}this._onNativeUnloadWrapped=qx.lang.Function.bind(this._onNativeUnload,this);
qx.bom.Event.addNativeListener(this._window,k,this._onNativeUnloadWrapped);
},_stopObserver:function(){if(this._onNativeLoadWrapped){qx.bom.Event.removeNativeListener(this._window,l,this._onNativeLoadWrapped);
}qx.bom.Event.removeNativeListener(this._window,k,this._onNativeUnloadWrapped);
this._onNativeLoadWrapped=null;
this._onNativeUnloadWrapped=null;
},_onNativeLoad:qx.event.GlobalError.observeMethod(function(){this.__bX=true;
this.__cc();
}),_onNativeUnload:qx.event.GlobalError.observeMethod(function(){if(!this.__cb){this.__cb=true;

try{qx.event.Registration.fireEvent(this._window,d);
}catch(e){throw e;
}finally{qx.core.ObjectRegistry.shutdown();
}}})},destruct:function(){this._stopObserver();
this._window=null;
},defer:function(q){qx.event.Registration.addHandler(q);
}});
})();
(function(){var b="qx.event.handler.Window";
qx.Class.define(b,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(p){qx.core.Object.call(this);
this._manager=p;
this._window=p.getWindow();
this._initWindowObserver();
},statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{error:1,load:1,beforeunload:1,unload:1,resize:1,scroll:1,beforeshutdown:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_WINDOW,IGNORE_CAN_HANDLE:true},members:{canHandleEvent:function(g,h){},registerEvent:function(c,d,f){},unregisterEvent:function(i,j,k){},_initWindowObserver:function(){this._onNativeWrapper=qx.lang.Function.listener(this._onNative,this);
var o=qx.event.handler.Window.SUPPORTED_TYPES;

for(var n in o){qx.bom.Event.addNativeListener(this._window,n,this._onNativeWrapper);
}},_stopWindowObserver:function(){var m=qx.event.handler.Window.SUPPORTED_TYPES;

for(var l in m){qx.bom.Event.removeNativeListener(this._window,l,this._onNativeWrapper);
}},_onNative:qx.event.GlobalError.observeMethod(function(e){if(this.isDisposed()){return;
}var r=this._window;

try{var u=r.document;
}catch(e){return ;
}var s=u.documentElement;
var q=e.target||e.srcElement;

if(q==null||q===r||q===u||q===s){var event=qx.event.Registration.createEvent(e.type,qx.event.type.Native,[e,r]);
qx.event.Registration.dispatchEvent(r,event);
var t=event.getReturnValue();

if(t!=null){e.returnValue=t;
return t;
}}})},destruct:function(){this._stopWindowObserver();
this._manager=this._window=null;
},defer:function(a){qx.event.Registration.addHandler(a);
}});
})();
(function(){var a="qx.event.IEventDispatcher";
qx.Interface.define(a,{members:{canDispatchEvent:function(b,event,c){this.assertInstance(event,qx.event.type.Event);
this.assertString(c);
},dispatchEvent:function(d,event,e){this.assertInstance(event,qx.event.type.Event);
this.assertString(e);
}}});
})();
(function(){var a="qx.event.dispatch.Direct";
qx.Class.define(a,{extend:qx.core.Object,implement:qx.event.IEventDispatcher,construct:function(m){this._manager=m;
},statics:{PRIORITY:qx.event.Registration.PRIORITY_LAST},members:{canDispatchEvent:function(h,event,j){return !event.getBubbles();
},dispatchEvent:function(b,event,c){var f,d;
{};
event.setEventPhase(qx.event.type.Event.AT_TARGET);
var g=this._manager.getListeners(b,c,false);

if(g){for(var i=0,l=g.length;i<l;i++){var e=g[i].context||b;
g[i].handler.call(e,event);
}}}},defer:function(k){qx.event.Registration.addDispatcher(k);
}});
})();
(function(){var k="ready",j="qx.application",i="beforeunload",h="qx.core.Init",g="shutdown";
qx.Class.define(h,{statics:{getApplication:function(){return this.__cd||null;
},ready:function(){if(this.__cd){return;
}
if(qx.bom.client.Engine.UNKNOWN_ENGINE){qx.log.Logger.warn("Could not detect engine!");
}
if(qx.bom.client.Engine.UNKNOWN_VERSION){qx.log.Logger.warn("Could not detect the version of the engine!");
}
if(qx.bom.client.Platform.UNKNOWN_PLATFORM){qx.log.Logger.warn("Could not detect platform!");
}
if(qx.bom.client.System.UNKNOWN_SYSTEM){qx.log.Logger.warn("Could not detect system!");
}qx.log.Logger.debug(this,"Load runtime: "+(new Date-qx.Bootstrap.LOADSTART)+"ms");
var c=qx.core.Setting.get(j);
var d=qx.Class.getByName(c);

if(d){this.__cd=new d;
var b=new Date;
this.__cd.main();
qx.log.Logger.debug(this,"Main runtime: "+(new Date-b)+"ms");
var b=new Date;
this.__cd.finalize();
qx.log.Logger.debug(this,"Finalize runtime: "+(new Date-b)+"ms");
}else{qx.log.Logger.warn("Missing application class: "+c);
}},__ce:function(e){var a=this.__cd;

if(a){e.setReturnValue(a.close());
}},__cf:function(){var f=this.__cd;

if(f){f.terminate();
}}},defer:function(l){qx.event.Registration.addListener(window,k,l.ready,l);
qx.event.Registration.addListener(window,g,l.__cf,l);
qx.event.Registration.addListener(window,i,l.__ce,l);
}});
})();
(function(){var a="qx.application.IApplication";
qx.Interface.define(a,{members:{main:function(){},finalize:function(){},close:function(){},terminate:function(){}}});
})();
(function(){var k="qx.locale.MTranslation";
qx.Mixin.define(k,{members:{tr:function(a,b){var c=qx.locale.Manager;

if(c){return c.tr.apply(c,arguments);
}throw new Error("To enable localization please include qx.locale.Manager into your build!");
},trn:function(d,e,f,g){var h=qx.locale.Manager;

if(h){return h.trn.apply(h,arguments);
}throw new Error("To enable localization please include qx.locale.Manager into your build!");
},trc:function(l,m,n){var o=qx.locale.Manager;

if(o){return o.trc.apply(o,arguments);
}throw new Error("To enable localization please include qx.locale.Manager into your build!");
},marktr:function(i){var j=qx.locale.Manager;

if(j){return j.marktr.apply(j,arguments);
}throw new Error("To enable localization please include qx.locale.Manager into your build!");
}}});
})();
(function(){var b="abstract",a="qx.application.AbstractGui";
qx.Class.define(a,{type:b,extend:qx.core.Object,implement:[qx.application.IApplication],include:qx.locale.MTranslation,members:{__cg:null,_createRootWidget:function(){throw new Error("Abstract method call");
},getRoot:function(){return this.__cg;
},main:function(){qx.theme.manager.Meta.getInstance().initialize();
qx.ui.tooltip.Manager.getInstance();
this.__cg=this._createRootWidget();
},finalize:function(){this.render();
},render:function(){qx.ui.core.queue.Manager.flush();
},close:function(c){},terminate:function(){}},destruct:function(){this.__cg=null;
}});
})();
(function(){var a="qx.application.Standalone";
qx.Class.define(a,{extend:qx.application.AbstractGui,members:{_createRootWidget:function(){return new qx.ui.root.Application(document);
}}});
})();
(function(){var a="disbatch_frontend.Application";
qx.Class.define(a,{extend:qx.application.Standalone,members:{main:function(){qx.application.Standalone.prototype.main.call(this);
{};
this.queuebrowser=new disbatch_frontend.Queuebrowser;
this.getRoot().add(this.queuebrowser.createQueueBrowser(this),{left:20,top:20});
},showTaskBrowser:function(b,c){this.taskbrowser=new disbatch_frontend.Taskbrowser;
this.getRoot().add(this.taskbrowser.createTaskBrowser(this,b,c),{left:30,top:30});
}}});
})();
(function(){var m="qx.event.type.Event";
qx.Class.define(m,{extend:qx.core.Object,statics:{CAPTURING_PHASE:1,AT_TARGET:2,BUBBLING_PHASE:3},members:{init:function(a,b){{};
this._type=null;
this._target=null;
this._currentTarget=null;
this._relatedTarget=null;
this._originalTarget=null;
this._stopPropagation=false;
this._preventDefault=false;
this._bubbles=!!a;
this._cancelable=!!b;
this._timeStamp=(new Date()).getTime();
this._eventPhase=null;
return this;
},clone:function(f){if(f){var g=f;
}else{var g=qx.event.Pool.getInstance().getObject(this.constructor);
}g._type=this._type;
g._target=this._target;
g._currentTarget=this._currentTarget;
g._relatedTarget=this._relatedTarget;
g._originalTarget=this._originalTarget;
g._stopPropagation=this._stopPropagation;
g._bubbles=this._bubbles;
g._preventDefault=this._preventDefault;
g._cancelable=this._cancelable;
return g;
},stop:function(){if(this._bubbles){this.stopPropagation();
}
if(this._cancelable){this.preventDefault();
}},stopPropagation:function(){{};
this._stopPropagation=true;
},getPropagationStopped:function(){return !!this._stopPropagation;
},preventDefault:function(){{};
this._preventDefault=true;
},getDefaultPrevented:function(){return !!this._preventDefault;
},getType:function(){return this._type;
},setType:function(l){this._type=l;
},getEventPhase:function(){return this._eventPhase;
},setEventPhase:function(e){this._eventPhase=e;
},getTimeStamp:function(){return this._timeStamp;
},getTarget:function(){return this._target;
},setTarget:function(j){this._target=j;
},getCurrentTarget:function(){return this._currentTarget||this._target;
},setCurrentTarget:function(d){this._currentTarget=d;
},getRelatedTarget:function(){return this._relatedTarget;
},setRelatedTarget:function(c){this._relatedTarget=c;
},getOriginalTarget:function(){return this._originalTarget;
},setOriginalTarget:function(h){this._originalTarget=h;
},getBubbles:function(){return this._bubbles;
},setBubbles:function(k){this._bubbles=k;
},isCancelable:function(){return this._cancelable;
},setCancelable:function(i){this._cancelable=i;
}},destruct:function(){this._target=this._currentTarget=this._relatedTarget=this._originalTarget=null;
}});
})();
(function(){var a="qx.event.type.Data";
qx.Class.define(a,{extend:qx.event.type.Event,members:{__ch:null,__ci:null,init:function(d,e,f){qx.event.type.Event.prototype.init.call(this,false,f);
this.__ch=d;
this.__ci=e;
return this;
},clone:function(b){var c=qx.event.type.Event.prototype.clone.call(this,b);
c.__ch=this.__ch;
c.__ci=this.__ci;
return c;
},getData:function(){return this.__ch;
},getOldData:function(){return this.__ci;
}},destruct:function(){this.__ch=this.__ci=null;
}});
})();
(function(){var cb="get",ca="",bY="[",bX="last",bW="change",bV="]",bU=".",bT="Number",bS="String",bR="set",cq="deepBinding",cp="item",co="reset",cn="' (",cm="Boolean",cl=").",ck=") to the object '",cj="Integer",ci="qx.data.SingleValueBinding",ch="No event could be found for the property",cf="PositiveNumber",cg="Binding from '",cd="PositiveInteger",ce="Binding does not exist!",cc="Date";
qx.Class.define(ci,{statics:{DEBUG_ON:false,__cj:{},bind:function(q,r,s,t,u){var E=this.__cl(q,r,s,t,u);
var z=r.split(bU);
var w=this.__cs(z);
var D=[];
var A=[];
var B=[];
var x=[];
var y=q;
for(var i=0;i<z.length;i++){if(w[i]!==ca){x.push(bW);
}else{x.push(this.__cn(y,z[i]));
}D[i]=y;
if(i==z.length-1){if(w[i]!==ca){var H=w[i]===bX?y.length-1:w[i];
var v=y.getItem(H);
this.__cr(v,s,t,u,q);
B[i]=this.__ct(y,x[i],s,t,u,w[i]);
}else{if(z[i]!=null&&y[cb+qx.lang.String.firstUp(z[i])]!=null){var v=y[cb+qx.lang.String.firstUp(z[i])]();
this.__cr(v,s,t,u,q);
}B[i]=this.__ct(y,x[i],s,t,u);
}}else{var F={index:i,propertyNames:z,sources:D,listenerIds:B,arrayIndexValues:w,targetObject:s,targetPropertyChain:t,options:u,listeners:A};
var C=qx.lang.Function.bind(this.__ck,this,F);
A.push(C);
B[i]=y.addListener(x[i],C);
}if(y[cb+qx.lang.String.firstUp(z[i])]==null){y=null;
}else if(w[i]!==ca){y=y[cb+qx.lang.String.firstUp(z[i])](w[i]);
}else{y=y[cb+qx.lang.String.firstUp(z[i])]();
}
if(!y){break;
}}var G={type:cq,listenerIds:B,sources:D,targetListenerIds:E.listenerIds,targets:E.targets};
this.__cu(G,q,r,s,t);
return G;
},__ck:function(cr){if(cr.options&&cr.options.onUpdate){cr.options.onUpdate(cr.sources[cr.index],cr.targetObject);
}for(var j=cr.index+1;j<cr.propertyNames.length;j++){var cv=cr.sources[j];
cr.sources[j]=null;

if(!cv){continue;
}cv.removeListenerById(cr.listenerIds[j]);
}var cv=cr.sources[cr.index];
for(var j=cr.index+1;j<cr.propertyNames.length;j++){if(cr.arrayIndexValues[j-1]!==ca){cv=cv[cb+qx.lang.String.firstUp(cr.propertyNames[j-1])](cr.arrayIndexValues[j-1]);
}else{cv=cv[cb+qx.lang.String.firstUp(cr.propertyNames[j-1])]();
}cr.sources[j]=cv;
if(!cv){this.__co(cr.targetObject,cr.targetPropertyChain);
break;
}if(j==cr.propertyNames.length-1){if(qx.Class.implementsInterface(cv,qx.data.IListData)){var cw=cr.arrayIndexValues[j]===bX?cv.length-1:cr.arrayIndexValues[j];
var ct=cv.getItem(cw);
this.__cr(ct,cr.targetObject,cr.targetPropertyChain,cr.options,cr.sources[cr.index]);
cr.listenerIds[j]=this.__ct(cv,bW,cr.targetObject,cr.targetPropertyChain,cr.options,cr.arrayIndexValues[j]);
}else{if(cr.propertyNames[j]!=null&&cv[cb+qx.lang.String.firstUp(cr.propertyNames[j])]!=null){var ct=cv[cb+qx.lang.String.firstUp(cr.propertyNames[j])]();
this.__cr(ct,cr.targetObject,cr.targetPropertyChain,cr.options,cr.sources[cr.index]);
}var cu=this.__cn(cv,cr.propertyNames[j]);
cr.listenerIds[j]=this.__ct(cv,cu,cr.targetObject,cr.targetPropertyChain,cr.options);
}}else{if(cr.listeners[j]==null){var cs=qx.lang.Function.bind(this.__ck,this,cr);
cr.listeners.push(cs);
}if(qx.Class.implementsInterface(cv,qx.data.IListData)){var cu=bW;
}else{var cu=this.__cn(cv,cr.propertyNames[j]);
}cr.listenerIds[j]=cv.addListener(cu,cr.listeners[j]);
}}},__cl:function(bn,bo,bp,bq,br){var bv=bq.split(bU);
var bt=this.__cs(bv);
var bA=[];
var bz=[];
var bx=[];
var bw=[];
var bu=bp;
for(var i=0;i<bv.length-1;i++){if(bt[i]!==ca){bw.push(bW);
}else{try{bw.push(this.__cn(bu,bv[i]));
}catch(e){break;
}}bA[i]=bu;
var by=function(){for(var j=i+1;j<bv.length-1;j++){var bF=bA[j];
bA[j]=null;

if(!bF){continue;
}bF.removeListenerById(bx[j]);
}var bF=bA[i];
for(var j=i+1;j<bv.length-1;j++){var bD=qx.lang.String.firstUp(bv[j-1]);
if(bt[j-1]!==ca){var bG=bt[j-1]===bX?bF.getLength()-1:bt[j-1];
bF=bF[cb+bD](bG);
}else{bF=bF[cb+bD]();
}bA[j]=bF;
if(bz[j]==null){bz.push(by);
}if(qx.Class.implementsInterface(bF,qx.data.IListData)){var bE=bW;
}else{try{var bE=qx.data.SingleValueBinding.__cn(bF,bv[j]);
}catch(e){break;
}}bx[j]=bF.addListener(bE,bz[j]);
}qx.data.SingleValueBinding.__cm(bn,bo,bp,bq);
};
bz.push(by);
bx[i]=bu.addListener(bw[i],by);
var bs=qx.lang.String.firstUp(bv[i]);
if(bu[cb+bs]==null){bu=null;
}else if(bt[i]!==ca){bu=bu[cb+bs](bt[i]);
}else{bu=bu[cb+bs]();
}
if(!bu){break;
}}return {listenerIds:bx,targets:bA};
},__cm:function(b,c,d,f){var l=this.__cq(b,c);

if(l!=null){var n=c.substring(c.lastIndexOf(bU)+1,c.length);
if(n.charAt(n.length-1)==bV){var g=n.substring(n.lastIndexOf(bY)+1,n.length-1);
var k=n.substring(0,n.lastIndexOf(bY));
var m=l[cb+qx.lang.String.firstUp(k)]();

if(g==bX){g=m.length-1;
}
if(m!=null){var h=m.getItem(g);
}}else{var h=l[cb+qx.lang.String.firstUp(n)]();
}}this.__cp(d,f,h);
},__cn:function(cK,cL){var cM=this.__cw(cK,cL);
if(cM==null){if(qx.Class.supportsEvent(cK.constructor,cL)){cM=cL;
}else if(qx.Class.supportsEvent(cK.constructor,bW+qx.lang.String.firstUp(cL))){cM=bW+qx.lang.String.firstUp(cL);
}else{throw new qx.core.AssertionError(ch,cL);
}}return cM;
},__co:function(cN,cO){var cP=this.__cq(cN,cO);

if(cP!=null){var cQ=cO.substring(cO.lastIndexOf(bU)+1,cO.length);
if(cQ.charAt(cQ.length-1)==bV){this.__cp(cN,cO,null);
return;
}if(cP[co+qx.lang.String.firstUp(cQ)]!=undefined){cP[co+qx.lang.String.firstUp(cQ)]();
}else{cP[bR+qx.lang.String.firstUp(cQ)](null);
}}},__cp:function(U,V,W){var bb=this.__cq(U,V);

if(bb!=null){var bc=V.substring(V.lastIndexOf(bU)+1,V.length);
if(bc.charAt(bc.length-1)==bV){var X=bc.substring(bc.lastIndexOf(bY)+1,bc.length-1);
var ba=bc.substring(0,bc.lastIndexOf(bY));
var Y=bb[cb+qx.lang.String.firstUp(ba)]();

if(X==bX){X=Y.length-1;
}
if(Y!=null){Y.setItem(X,W);
}}else{bb[bR+qx.lang.String.firstUp(bc)](W);
}}},__cq:function(bH,bI){var bL=bI.split(bU);
var bM=bH;
for(var i=0;i<bL.length-1;i++){try{var bK=bL[i];
if(bK.indexOf(bV)==bK.length-1){var bJ=bK.substring(bK.indexOf(bY)+1,bK.length-1);
bK=bK.substring(0,bK.indexOf(bY));
}bM=bM[cb+qx.lang.String.firstUp(bK)]();

if(bJ!=null){if(bJ==bX){bJ=bM.length-1;
}bM=bM.getItem(bJ);
bJ=null;
}}catch(cx){return null;
}}return bM;
},__cr:function(cR,cS,cT,cU,cV){cR=this.__cv(cR,cS,cT,cU);
if(cR==null){this.__co(cS,cT);
}if(cR!=undefined){try{this.__cp(cS,cT,cR);
if(cU&&cU.onUpdate){cU.onUpdate(cV,cS,cR);
}}catch(e){if(!(e instanceof qx.core.ValidationError)){throw e;
}
if(cU&&cU.onSetFail){cU.onSetFail(e);
}else{this.warn("Failed so set value "+cR+" on "+cS+". Error message: "+e);
}}}},__cs:function(db){var dc=[];
for(var i=0;i<db.length;i++){var name=db[i];
if(qx.lang.String.endsWith(name,bV)){var dd=name.substring(name.indexOf(bY)+1,name.indexOf(bV));
if(name.indexOf(bV)!=name.length-1){throw new Error("Please use only one array at a time: "+name+" does not work.");
}
if(dd!==bX){if(dd==ca||isNaN(parseInt(dd))){throw new Error("No number or 'last' value hast been given"+" in a array binding: "+name+" does not work.");
}}if(name.indexOf(bY)!=0){db[i]=name.substring(0,name.indexOf(bY));
dc[i]=ca;
dc[i+1]=dd;
db.splice(i+1,0,cp);
i++;
}else{dc[i]=dd;
db.splice(i,1,cp);
}}else{dc[i]=ca;
}}return dc;
},__ct:function(cB,cC,cD,cE,cF,cG){var cH;
{};
var cJ=function(cW,e){if(cW!==ca){if(cW===bX){cW=cB.length-1;
}var da=cB.getItem(cW);
if(da==undefined){qx.data.SingleValueBinding.__co(cD,cE);
}var cX=e.getData().start;
var cY=e.getData().end;

if(cW<cX||cW>cY){return;
}}else{var da=e.getData();
}if(qx.data.SingleValueBinding.DEBUG_ON){qx.log.Logger.debug("Binding executed from "+cB+" by "+cC+" to "+cD+" ("+cE+")");
qx.log.Logger.debug("Data before conversion: "+da);
}da=qx.data.SingleValueBinding.__cv(da,cD,cE,cF);
if(qx.data.SingleValueBinding.DEBUG_ON){qx.log.Logger.debug("Data after conversion: "+da);
}try{if(da!=undefined){qx.data.SingleValueBinding.__cp(cD,cE,da);
}else{qx.data.SingleValueBinding.__co(cD,cE);
}if(cF&&cF.onUpdate){cF.onUpdate(cB,cD,da);
}}catch(e){if(!(e instanceof qx.core.ValidationError)){throw e;
}
if(cF&&cF.onSetFail){cF.onSetFail(e);
}else{this.warn("Failed so set value "+da+" on "+cD+". Error message: "+e);
}}};
if(!cG){cG=ca;
}cJ=qx.lang.Function.bind(cJ,cB,cG);
var cI=cB.addListener(cC,cJ);
return cI;
},__cu:function(bi,bj,bk,bl,bm){if(this.__cj[bj.toHashCode()]===undefined){this.__cj[bj.toHashCode()]=[];
}this.__cj[bj.toHashCode()].push([bi,bj,bk,bl,bm]);
},__cv:function(I,J,K,L){if(L&&L.converter){var N;

if(J.getModel){N=J.getModel();
}return L.converter(I,N);
}else{var P=this.__cq(J,K);
var Q=K.substring(K.lastIndexOf(bU)+1,K.length);
if(P==null){return I;
}var O=qx.Class.getPropertyDefinition(P.constructor,Q);
var M=O==null?ca:O.check;
return this.__cx(I,M);
}},__cw:function(cy,cz){var cA=qx.Class.getPropertyDefinition(cy.constructor,cz);

if(cA==null){return null;
}return cA.event;
},__cx:function(bf,bg){var bh=qx.lang.Type.getClass(bf);
if((bh==bT||bh==bS)&&(bg==cj||bg==cd)){bf=parseInt(bf);
}if((bh==cm||bh==bT||bh==cc)&&bg==bS){bf=bf+ca;
}if((bh==bT||bh==bS)&&(bg==bT||bg==cf)){bf=parseFloat(bf);
}return bf;
},removeBindingFromObject:function(R,S){if(S.type==cq){for(var i=0;i<S.sources.length;i++){if(S.sources[i]){S.sources[i].removeListenerById(S.listenerIds[i]);
}}for(var i=0;i<S.targets.length;i++){if(S.targets[i]){S.targets[i].removeListenerById(S.targetListenerIds[i]);
}}}else{R.removeListenerById(S);
}var T=this.__cj[R.toHashCode()];
if(T!=undefined){for(var i=0;i<T.length;i++){if(T[i][0]==S){qx.lang.Array.remove(T,T[i]);
return;
}}}throw new Error("Binding could not be found!");
},removeAllBindingsForObject:function(bB){{};
var bC=this.__cj[bB.toHashCode()];

if(bC!=undefined){for(var i=bC.length-1;i>=0;i--){this.removeBindingFromObject(bB,bC[i][0]);
}}},getAllBindingsForObject:function(a){if(this.__cj[a.toHashCode()]===undefined){this.__cj[a.toHashCode()]=[];
}return this.__cj[a.toHashCode()];
},removeAllBindings:function(){for(var be in this.__cj){var bd=qx.core.ObjectRegistry.fromHashCode(be);
if(bd==null){delete this.__cj[be];
continue;
}this.removeAllBindingsForObject(bd);
}this.__cj={};
},getAllBindings:function(){return this.__cj;
},showBindingInLog:function(bN,bO){var bQ;
for(var i=0;i<this.__cj[bN.toHashCode()].length;i++){if(this.__cj[bN.toHashCode()][i][0]==bO){bQ=this.__cj[bN.toHashCode()][i];
break;
}}
if(bQ===undefined){var bP=ce;
}else{var bP=cg+bQ[1]+cn+bQ[2]+ck+bQ[3]+cn+bQ[4]+cl;
}qx.log.Logger.debug(bP);
},showAllBindingsInLog:function(){for(var p in this.__cj){var o=qx.core.ObjectRegistry.fromHashCode(p);

for(var i=0;i<this.__cj[p].length;i++){this.showBindingInLog(o,this.__cj[p][i][0]);
}}}}});
})();
(function(){var z="",y="g",x="0",w='\\$1',v="%",u='-',t="qx.lang.String",s=' ',r='\n',q="undefined";
qx.Class.define(t,{statics:{camelCase:function(P){return P.replace(/\-([a-z])/g,function(f,g){return g.toUpperCase();
});
},hyphenate:function(p){return p.replace(/[A-Z]/g,function(I){return (u+I.charAt(0).toLowerCase());
});
},capitalize:function(E){return E.replace(/\b[a-z]/g,function(F){return F.toUpperCase();
});
},clean:function(J){return this.trim(J.replace(/\s+/g,s));
},trimLeft:function(Q){return Q.replace(/^\s+/,z);
},trimRight:function(e){return e.replace(/\s+$/,z);
},trim:function(O){return O.replace(/^\s+|\s+$/g,z);
},startsWith:function(G,H){return G.indexOf(H)===0;
},endsWith:function(K,L){return K.substring(K.length-L.length,K.length)===L;
},repeat:function(h,j){return h.length>0?new Array(j+1).join(h):z;
},pad:function(A,length,B){var C=length-A.length;

if(C>0){if(typeof B===q){B=x;
}return this.repeat(B,C)+A;
}else{return A;
}},firstUp:qx.Bootstrap.firstUp,firstLow:qx.Bootstrap.firstLow,contains:function(M,N){return M.indexOf(N)!=-1;
},format:function(a,b){var c=a;

for(var i=0;i<b.length;i++){c=c.replace(new RegExp(v+(i+1),y),b[i]);
}return c;
},escapeRegexpChars:function(D){return D.replace(/([.*+?^${}()|[\]\/\\])/g,w);
},toArray:function(k){return k.split(/\B|\b/g);
},stripTags:function(d){return d.replace(/<\/?[^>]+>/gi,z);
},stripScripts:function(l,m){var o=z;
var n=l.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi,function(){o+=arguments[1]+r;
return z;
});

if(m===true){qx.lang.Function.globalEval(o);
}return n;
}}});
})();
(function(){var f="qx.event.type.Data",e="qx.event.type.Event",d="qx.data.IListData";
qx.Interface.define(d,{events:{"change":f,"changeLength":e},members:{getItem:function(c){},setItem:function(a,b){},splice:function(h,i,j){},contains:function(g){},getLength:function(){},toArray:function(){}}});
})();
(function(){var a="qx.lang.Date";
qx.Class.define(a,{statics:{now:function(){return +new Date;
}}});
})();
(function(){var b="",a="qx.core.WindowError";
qx.Bootstrap.define(a,{extend:Error,construct:function(c,d,e){Error.call(this,c);
this.__cy=c;
this.__cz=d||b;
this.__cA=e===undefined?-1:e;
},members:{__cy:null,__cz:null,__cA:null,toString:function(){return this.__cy;
},getUri:function(){return this.__cz;
},getLineNumber:function(){return this.__cA;
}}});
})();
(function(){var b="GlobalError: ",a="qx.core.GlobalError";
qx.Bootstrap.define(a,{extend:Error,construct:function(c,d){{};
this.__cB=b+(c&&c.message?c.message:c);
Error.call(this,this.__cB);
this.__cC=d;
this.__cD=c;
},members:{__cD:null,__cC:null,__cB:null,toString:function(){return this.__cB;
},getArguments:function(){return this.__cC;
},getSourceException:function(){return this.__cD;
}},destruct:function(){this.__cD=null;
this.__cC=null;
this.__cB=null;
}});
})();
(function(){var c=": ",b="qx.type.BaseError",a="";
qx.Class.define(b,{extend:Error,construct:function(d,e){Error.call(this,e);
this.__cE=d||a;
this.message=e||qx.type.BaseError.DEFAULTMESSAGE;
},statics:{DEFAULTMESSAGE:"error"},members:{__cE:null,message:null,getComment:function(){return this.__cE;
},toString:function(){return this.__cE+c+this.message;
}}});
})();
(function(){var a="qx.core.AssertionError";
qx.Class.define(a,{extend:qx.type.BaseError,construct:function(b,c){qx.type.BaseError.call(this,b,c);
this.__cF=qx.dev.StackTrace.getStackTrace();
},members:{__cF:null,getStackTrace:function(){return this.__cF;
}}});
})();
(function(){var a="qx.core.ValidationError";
qx.Class.define(a,{extend:qx.type.BaseError});
})();
(function(){var h="qx.lang.Type",g="Error",f="RegExp",e="Date",d="Number",c="Boolean";
qx.Class.define(h,{statics:{getClass:qx.Bootstrap.getClass,isString:qx.Bootstrap.isString,isArray:qx.Bootstrap.isArray,isObject:qx.Bootstrap.isObject,isFunction:qx.Bootstrap.isFunction,isRegExp:function(k){return this.getClass(k)==f;
},isNumber:function(j){return (j!==null&&(this.getClass(j)==d||j instanceof Number));
},isBoolean:function(i){return (i!==null&&(this.getClass(i)==c||i instanceof Boolean));
},isDate:function(a){return (a!==null&&(this.getClass(a)==e||a instanceof Date));
},isError:function(b){return (b!==null&&(this.getClass(b)==g||b instanceof Error));
}}});
})();
(function(){var h="qx.util.ObjectPool",g="Integer";
qx.Class.define(h,{extend:qx.core.Object,construct:function(n){qx.core.Object.call(this);
this.__cG={};

if(n!=null){this.setSize(n);
}},properties:{size:{check:g,init:Infinity}},members:{__cG:null,getObject:function(d){if(this.$$disposed){return new d;
}
if(!d){throw new Error("Class needs to be defined!");
}var e=null;
var f=this.__cG[d.classname];

if(f){e=f.pop();
}
if(e){e.$$pooled=false;
}else{e=new d;
}return e;
},poolObject:function(j){if(!this.__cG){return;
}var k=j.classname;
var m=this.__cG[k];

if(j.$$pooled){throw new Error("Object is already pooled: "+j);
}
if(!m){this.__cG[k]=m=[];
}if(m.length>this.getSize()){if(j.destroy){j.destroy();
}else{j.dispose();
}return;
}j.$$pooled=true;
m.push(j);
}},destruct:function(){var c=this.__cG;
var a,b,i,l;

for(a in c){b=c[a];

for(i=0,l=b.length;i<l;i++){b[i].dispose();
}}delete this.__cG;
}});
})();
(function(){var b="singleton",a="qx.event.Pool";
qx.Class.define(a,{extend:qx.util.ObjectPool,type:b,construct:function(){qx.util.ObjectPool.call(this,30);
}});
})();
(function(){var f="qx.util.DisposeUtil";
qx.Class.define(f,{statics:{disposeFields:function(k,m){qx.Bootstrap.warn("Don't use 'disposeFields' - instead assign directly to 'null'");

for(var i=0,l=m.length;i<l;i++){var name=m[i];

if(k[name]==null||!k.hasOwnProperty(name)){continue;
}k[name]=null;
}},disposeObjects:function(g,h,j){var name;

for(var i=0,l=h.length;i<l;i++){name=h[i];

if(g[name]==null||!g.hasOwnProperty(name)){continue;
}
if(!qx.core.ObjectRegistry.inShutDown){if(g[name].dispose){if(!j&&g[name].constructor.$$instance){throw new Error("The object stored in key "+name+" is a singleton! Please use disposeSingleton instead.");
}else{g[name].dispose();
}}else{throw new Error("Has no disposable object under key: "+name+"!");
}}g[name]=null;
}},disposeArray:function(a,b){var d=a[b];

if(!d){return;
}if(qx.core.ObjectRegistry.inShutDown){a[b]=null;
return;
}try{var c;

for(var i=d.length-1;i>=0;i--){c=d[i];

if(c){c.dispose();
}}}catch(e){throw new Error("The array field: "+b+" of object: "+a+" has non disposable entries: "+e);
}d.length=0;
a[b]=null;
},disposeMap:function(n,o){var p=n[o];

if(!p){return;
}if(qx.core.ObjectRegistry.inShutDown){n[o]=null;
return;
}try{for(var q in p){if(p.hasOwnProperty(q)){p[q].dispose();
}}}catch(r){throw new Error("The map field: "+o+" of object: "+n+" has non disposable entries: "+r);
}n[o]=null;
},disposeTriggeredBy:function(s,t){var u=t.dispose;
t.dispose=function(){u.call(t);
s.dispose();
};
}}});
})();
(function(){var d="qx.event.handler.Object";
qx.Class.define(d,{extend:qx.core.Object,implement:qx.event.IEventHandler,statics:{PRIORITY:qx.event.Registration.PRIORITY_LAST,SUPPORTED_TYPES:null,TARGET_CHECK:qx.event.IEventHandler.TARGET_OBJECT,IGNORE_CAN_HANDLE:false},members:{canHandleEvent:function(f,g){return qx.Class.supportsEvent(f.constructor,g);
},registerEvent:function(a,b,c){},unregisterEvent:function(h,i,j){}},defer:function(e){qx.event.Registration.addHandler(e);
}});
})();
(function(){var b="CSS1Compat",a="qx.bom.client.Feature";
qx.Class.define(a,{statics:{STANDARD_MODE:false,QUIRKS_MODE:false,CONTENT_BOX:false,BORDER_BOX:false,SVG:false,CANVAS:!!window.CanvasRenderingContext2D,VML:false,XPATH:!!document.evaluate,AIR:navigator.userAgent.indexOf("adobeair")!==-1,GEARS:!!(window.google&&window.google.gears),SSL:window.location.protocol==="https:",ECMA_OBJECT_COUNT:(({}).__count__==0),CSS_POINTER_EVENTS:"pointerEvents" in document.documentElement.style,HTML5_CLASSLIST:(document.documentElement.classList&&qx.Bootstrap.getClass(document.documentElement.classList)==="DOMTokenList"),__cH:function(){this.QUIRKS_MODE=this.__cI();
this.STANDARD_MODE=!this.QUIRKS_MODE;
this.CONTENT_BOX=!qx.bom.client.Engine.MSHTML||this.STANDARD_MODE;
this.BORDER_BOX=!this.CONTENT_BOX;
this.SVG=document.implementation&&document.implementation.hasFeature&&(document.implementation.hasFeature("org.w3c.dom.svg","1.0")||document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"));
this.VML=qx.bom.client.Engine.MSHTML;
},__cI:function(){if(qx.bom.client.Engine.MSHTML&&qx.bom.client.Engine.VERSION>=8){return qx.bom.client.Engine.DOCUMENT_MODE===5;
}else{return document.compatMode!==b;
}}},defer:function(c){c.__cH();
}});
})();
(function(){var m="qx.lang.Object";
qx.Class.define(m,{statics:{empty:function(j){{};

for(var k in j){if(j.hasOwnProperty(k)){delete j[k];
}}},isEmpty:(qx.bom.client.Feature.ECMA_OBJECT_COUNT)?
function(x){{};
return x.__count__===0;
}:
function(G){{};

for(var H in G){return false;
}return true;
},hasMinLength:(qx.bom.client.Feature.ECMA_OBJECT_COUNT)?
function(q,r){{};
return q.__count__>=r;
}:
function(c,d){{};

if(d<=0){return true;
}var length=0;

for(var e in c){if((++length)>=d){return true;
}}return false;
},getLength:qx.Bootstrap.objectGetLength,getKeys:qx.Bootstrap.getKeys,getKeysAsString:qx.Bootstrap.getKeysAsString,getValues:function(n){{};
var p=[];
var o=this.getKeys(n);

for(var i=0,l=o.length;i<l;i++){p.push(n[o[i]]);
}return p;
},mergeWith:qx.Bootstrap.objectMergeWith,carefullyMergeWith:function(y,z){{};
return qx.lang.Object.mergeWith(y,z,false);
},merge:function(f,g){{};
var h=arguments.length;

for(var i=1;i<h;i++){qx.lang.Object.mergeWith(f,arguments[i]);
}return f;
},clone:function(A){{};
var B={};

for(var C in A){B[C]=A[C];
}return B;
},invert:function(s){{};
var t={};

for(var u in s){t[s[u].toString()]=u;
}return t;
},getKeyFromValue:function(D,E){{};

for(var F in D){if(D.hasOwnProperty(F)&&D[F]===E){return F;
}}return null;
},contains:function(I,J){{};
return this.getKeyFromValue(I,J)!==null;
},select:function(a,b){{};
return b[a];
},fromArray:function(v){{};
var w={};

for(var i=0,l=v.length;i<l;i++){{};
w[v[i].toString()]=true;
}return w;
}}});
})();
(function(){var j="emulated",h="native",g='"',f="qx.lang.Core",e="\\\\",d="\\\"",c="[object Error]";
qx.Class.define(f,{statics:{errorToString:qx.lang.Object.select((!Error.prototype.toString||Error.prototype.toString()==c)?j:h,{"native":Error.prototype.toString,"emulated":function(){return this.message;
}}),arrayIndexOf:qx.lang.Object.select(Array.prototype.indexOf?h:j,{"native":Array.prototype.indexOf,"emulated":function(a,b){if(b==null){b=0;
}else if(b<0){b=Math.max(0,this.length+b);
}
for(var i=b;i<this.length;i++){if(this[i]===a){return i;
}}return -1;
}}),arrayLastIndexOf:qx.lang.Object.select(Array.prototype.lastIndexOf?h:j,{"native":Array.prototype.lastIndexOf,"emulated":function(o,p){if(p==null){p=this.length-1;
}else if(p<0){p=Math.max(0,this.length+p);
}
for(var i=p;i>=0;i--){if(this[i]===o){return i;
}}return -1;
}}),arrayForEach:qx.lang.Object.select(Array.prototype.forEach?h:j,{"native":Array.prototype.forEach,"emulated":function(k,m){var l=this.length;

for(var i=0;i<l;i++){var n=this[i];

if(n!==undefined){k.call(m||window,n,i,this);
}}}}),arrayFilter:qx.lang.Object.select(Array.prototype.filter?h:j,{"native":Array.prototype.filter,"emulated":function(q,r){var s=[];
var l=this.length;

for(var i=0;i<l;i++){var t=this[i];

if(t!==undefined){if(q.call(r||window,t,i,this)){s.push(this[i]);
}}}return s;
}}),arrayMap:qx.lang.Object.select(Array.prototype.map?h:j,{"native":Array.prototype.map,"emulated":function(u,v){var w=[];
var l=this.length;

for(var i=0;i<l;i++){var x=this[i];

if(x!==undefined){w[i]=u.call(v||window,x,i,this);
}}return w;
}}),arraySome:qx.lang.Object.select(Array.prototype.some?h:j,{"native":Array.prototype.some,"emulated":function(y,z){var l=this.length;

for(var i=0;i<l;i++){var A=this[i];

if(A!==undefined){if(y.call(z||window,A,i,this)){return true;
}}}return false;
}}),arrayEvery:qx.lang.Object.select(Array.prototype.every?h:j,{"native":Array.prototype.every,"emulated":function(B,C){var l=this.length;

for(var i=0;i<l;i++){var D=this[i];

if(D!==undefined){if(!B.call(C||window,D,i,this)){return false;
}}}return true;
}}),stringQuote:qx.lang.Object.select(String.prototype.quote?h:j,{"native":String.prototype.quote,"emulated":function(){return g+this.replace(/\\/g,e).replace(/\"/g,d)+g;
}})}});
Error.prototype.toString=qx.lang.Core.errorToString;
Array.prototype.indexOf=qx.lang.Core.arrayIndexOf;
Array.prototype.lastIndexOf=qx.lang.Core.arrayLastIndexOf;
Array.prototype.forEach=qx.lang.Core.arrayForEach;
Array.prototype.filter=qx.lang.Core.arrayFilter;
Array.prototype.map=qx.lang.Core.arrayMap;
Array.prototype.some=qx.lang.Core.arraySome;
Array.prototype.every=qx.lang.Core.arrayEvery;
String.prototype.quote=qx.lang.Core.stringQuote;
})();
(function(){var o="indexOf",n="lastIndexOf",m="slice",k="concat",j="join",h="toLocaleUpperCase",g="shift",f="substr",e="filter",d="unshift",L="match",K="quote",J="qx.lang.Generics",I="localeCompare",H="sort",G="some",F="charAt",E="split",D="substring",C="pop",w="toUpperCase",x="replace",u="push",v="charCodeAt",r="every",t="reverse",p="search",q="forEach",y="map",z="toLowerCase",B="splice",A="toLocaleLowerCase";
qx.Class.define(J,{statics:{__cJ:{"Array":[j,t,H,u,C,g,d,B,k,m,o,n,q,y,e,G,r],"String":[K,D,z,w,F,v,o,n,A,h,I,L,p,x,E,f,k,m]},__cK:function(b,c){return function(s){return b.prototype[c].apply(s,Array.prototype.slice.call(arguments,1));
};
},__cL:function(){var M=qx.lang.Generics.__cJ;

for(var Q in M){var O=window[Q];
var N=M[Q];

for(var i=0,l=N.length;i<l;i++){var P=N[i];

if(!O[P]){O[P]=qx.lang.Generics.__cK(O,P);
}}}}},defer:function(a){a.__cL();
}});
})();
(function(){var d="qx.event.type.Native";
qx.Class.define(d,{extend:qx.event.type.Event,members:{init:function(e,f,g,h,i){qx.event.type.Event.prototype.init.call(this,h,i);
this._target=f||qx.bom.Event.getTarget(e);
this._relatedTarget=g||qx.bom.Event.getRelatedTarget(e);

if(e.timeStamp){this._timeStamp=e.timeStamp;
}this._native=e;
this._returnValue=null;
return this;
},clone:function(a){var b=qx.event.type.Event.prototype.clone.call(this,a);
var c={};
b._native=this._cloneNativeEvent(this._native,c);
b._returnValue=this._returnValue;
return b;
},_cloneNativeEvent:function(j,k){k.preventDefault=qx.lang.Function.empty;
return k;
},preventDefault:function(){qx.event.type.Event.prototype.preventDefault.call(this);
qx.bom.Event.preventDefault(this._native);
},getNativeEvent:function(){return this._native;
},setReturnValue:function(l){this._returnValue=l;
},getReturnValue:function(){return this._returnValue;
}},destruct:function(){this._native=this._returnValue=null;
}});
})();
(function(){var m="iPod",l="Win32",k="",j="Win64",i="Linux",h="BSD",g="Macintosh",f="iPhone",e="Windows",d="qx.bom.client.Platform",a="X11",c="MacIntel",b="MacPPC";
qx.Class.define(d,{statics:{NAME:"",WIN:false,MAC:false,UNIX:false,UNKNOWN_PLATFORM:false,__cM:function(){var o=navigator.platform;
if(o==null||o===k){o=navigator.userAgent;
}
if(o.indexOf(e)!=-1||o.indexOf(l)!=-1||o.indexOf(j)!=-1){this.WIN=true;
this.NAME="win";
}else if(o.indexOf(g)!=-1||o.indexOf(b)!=-1||o.indexOf(c)!=-1||o.indexOf(m)!=-1||o.indexOf(f)!=-1){this.MAC=true;
this.NAME="mac";
}else if(o.indexOf(a)!=-1||o.indexOf(i)!=-1||o.indexOf(h)!=-1){this.UNIX=true;
this.NAME="unix";
}else{this.UNKNOWN_PLATFORM=true;
this.WIN=true;
this.NAME="win";
}}},defer:function(n){n.__cM();
}});
})();
(function(){var j="win98",i="osx2",h="osx0",g="osx4",f="win95",e="win2000",d="osx1",c="osx5",b="osx3",a="Windows NT 5.01",H=")",G="winxp",F="freebsd",E="sunos",D="SV1",C="|",B="nintendods",A="winnt4",z="wince",y="winme",q="os9",r="\.",o="osx",p="linux",m="netbsd",n="winvista",k="openbsd",l="(",s="win2003",t="symbian",v="win7",u="g",x="qx.bom.client.System",w=" Mobile/";
qx.Class.define(x,{statics:{NAME:"",SP1:false,SP2:false,WIN95:false,WIN98:false,WINME:false,WINNT4:false,WIN2000:false,WINXP:false,WIN2003:false,WINVISTA:false,WIN7:false,WINCE:false,LINUX:false,SUNOS:false,FREEBSD:false,NETBSD:false,OPENBSD:false,OSX:false,OS9:false,SYMBIAN:false,NINTENDODS:false,PSP:false,IPHONE:false,UNKNOWN_SYSTEM:false,__cN:{"Windows NT 6.1":v,"Windows NT 6.0":n,"Windows NT 5.2":s,"Windows NT 5.1":G,"Windows NT 5.0":e,"Windows 2000":e,"Windows NT 4.0":A,"Win 9x 4.90":y,"Windows CE":z,"Windows 98":j,"Win98":j,"Windows 95":f,"Win95":f,"Linux":p,"FreeBSD":F,"NetBSD":m,"OpenBSD":k,"SunOS":E,"Symbian System":t,"Nitro":B,"PSP":"sonypsp","Mac OS X 10_5":c,"Mac OS X 10.5":c,"Mac OS X 10_4":g,"Mac OS X 10.4":g,"Mac OS X 10_3":b,"Mac OS X 10.3":b,"Mac OS X 10_2":i,"Mac OS X 10.2":i,"Mac OS X 10_1":d,"Mac OS X 10.1":d,"Mac OS X 10_0":h,"Mac OS X 10.0":h,"Mac OS X":o,"Mac OS 9":q},__cO:function(){var K=navigator.userAgent;
var J=[];

for(var I in this.__cN){J.push(I);
}var L=new RegExp(l+J.join(C).replace(/\./g,r)+H,u);

if(!L.test(K)){this.UNKNOWN_SYSTEM=true;

if(!qx.bom.client.Platform.UNKNOWN_PLATFORM){if(qx.bom.client.Platform.UNIX){this.NAME="linux";
this.LINUX=true;
}else if(qx.bom.client.Platform.MAC){this.NAME="osx5";
this.OSX=true;
}else{this.NAME="winxp";
this.WINXP=true;
}}else{this.NAME="winxp";
this.WINXP=true;
}return;
}
if(qx.bom.client.Engine.WEBKIT&&RegExp(w).test(navigator.userAgent)){this.IPHONE=true;
this.NAME="iphone";
}else{this.NAME=this.__cN[RegExp.$1];
this[this.NAME.toUpperCase()]=true;

if(qx.bom.client.Platform.WIN){if(K.indexOf(a)!==-1){this.SP1=true;
}else if(qx.bom.client.Engine.MSHTML&&K.indexOf(D)!==-1){this.SP2=true;
}}}}},defer:function(M){M.__cO();
}});
})();
(function(){var f="_applyTheme",e="qx.theme",d="qx.theme.manager.Meta",c="qx.theme.Modern",b="Theme",a="singleton";
qx.Class.define(d,{type:a,extend:qx.core.Object,properties:{theme:{check:b,nullable:true,apply:f}},members:{_applyTheme:function(j,k){var n=null;
var q=null;
var t=null;
var u=null;
var p=null;

if(j){n=j.meta.color||null;
q=j.meta.decoration||null;
t=j.meta.font||null;
u=j.meta.icon||null;
p=j.meta.appearance||null;
}var r=qx.theme.manager.Color.getInstance();
var s=qx.theme.manager.Decoration.getInstance();
var l=qx.theme.manager.Font.getInstance();
var o=qx.theme.manager.Icon.getInstance();
var m=qx.theme.manager.Appearance.getInstance();
r.setTheme(n);
s.setTheme(q);
l.setTheme(t);
o.setTheme(u);
m.setTheme(p);
},initialize:function(){var h=qx.core.Setting;
var g,i;
g=h.get(e);

if(g){i=qx.Theme.getByName(g);

if(!i){throw new Error("The theme to use is not available: "+g);
}this.setTheme(i);
}}},settings:{"qx.theme":c}});
})();
(function(){var c="qx.util.ValueManager",b="abstract";
qx.Class.define(c,{type:b,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this._dynamic={};
},members:{_dynamic:null,resolveDynamic:function(f){return this._dynamic[f];
},isDynamic:function(e){return !!this._dynamic[e];
},resolve:function(d){if(d&&this._dynamic[d]){return this._dynamic[d];
}return d;
},_setDynamic:function(a){this._dynamic=a;
},_getDynamic:function(){return this._dynamic;
}},destruct:function(){this._dynamic=null;
}});
})();
(function(){var f="_applyTheme",e="qx.theme.manager.Color",d="Theme",c="changeTheme",b="string",a="singleton";
qx.Class.define(e,{type:a,extend:qx.util.ValueManager,properties:{theme:{check:d,nullable:true,apply:f,event:c}},members:{_applyTheme:function(n){var o={};

if(n){var p=n.colors;
var q=qx.util.ColorUtil;
var r;

for(var s in p){r=p[s];

if(typeof r===b){if(!q.isCssString(r)){throw new Error("Could not parse color: "+r);
}}else if(r instanceof Array){r=q.rgbToRgbString(r);
}else{throw new Error("Could not parse color: "+r);
}o[s]=r;
}}this._setDynamic(o);
},resolve:function(g){var j=this._dynamic;
var h=j[g];

if(h){return h;
}var i=this.getTheme();

if(i!==null&&i.colors[g]){return j[g]=i.colors[g];
}return g;
},isDynamic:function(k){var m=this._dynamic;

if(k&&(m[k]!==undefined)){return true;
}var l=this.getTheme();

if(l!==null&&k&&(l.colors[k]!==undefined)){m[k]=l.colors[k];
return true;
}return false;
}}});
})();
(function(){var W=",",V="rgb(",U=")",T="qx.theme.manager.Color",S="qx.util.ColorUtil";
qx.Class.define(S,{statics:{REGEXP:{hex3:/^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,rgb:/^rgb\(\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*\)$/,rgba:/^rgba\(\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*\)$/},SYSTEM:{activeborder:true,activecaption:true,appworkspace:true,background:true,buttonface:true,buttonhighlight:true,buttonshadow:true,buttontext:true,captiontext:true,graytext:true,highlight:true,highlighttext:true,inactiveborder:true,inactivecaption:true,inactivecaptiontext:true,infobackground:true,infotext:true,menu:true,menutext:true,scrollbar:true,threeddarkshadow:true,threedface:true,threedhighlight:true,threedlightshadow:true,threedshadow:true,window:true,windowframe:true,windowtext:true},NAMED:{black:[0,0,0],silver:[192,192,192],gray:[128,128,128],white:[255,255,255],maroon:[128,0,0],red:[255,0,0],purple:[128,0,128],fuchsia:[255,0,255],green:[0,128,0],lime:[0,255,0],olive:[128,128,0],yellow:[255,255,0],navy:[0,0,128],blue:[0,0,255],teal:[0,128,128],aqua:[0,255,255],transparent:[-1,-1,-1],magenta:[255,0,255],orange:[255,165,0],brown:[165,42,42]},isNamedColor:function(a){return this.NAMED[a]!==undefined;
},isSystemColor:function(R){return this.SYSTEM[R]!==undefined;
},supportsThemes:function(){return qx.Class.isDefined(T);
},isThemedColor:function(be){if(!this.supportsThemes()){return false;
}return qx.theme.manager.Color.getInstance().isDynamic(be);
},stringToRgb:function(bg){if(this.supportsThemes()&&this.isThemedColor(bg)){var bg=qx.theme.manager.Color.getInstance().resolveDynamic(bg);
}
if(this.isNamedColor(bg)){return this.NAMED[bg];
}else if(this.isSystemColor(bg)){throw new Error("Could not convert system colors to RGB: "+bg);
}else if(this.isRgbString(bg)){return this.__cP();
}else if(this.isHex3String(bg)){return this.__cR();
}else if(this.isHex6String(bg)){return this.__cS();
}throw new Error("Could not parse color: "+bg);
},cssStringToRgb:function(F){if(this.isNamedColor(F)){return this.NAMED[F];
}else if(this.isSystemColor(F)){throw new Error("Could not convert system colors to RGB: "+F);
}else if(this.isRgbString(F)){return this.__cP();
}else if(this.isRgbaString(F)){return this.__cQ();
}else if(this.isHex3String(F)){return this.__cR();
}else if(this.isHex6String(F)){return this.__cS();
}throw new Error("Could not parse color: "+F);
},stringToRgbString:function(bf){return this.rgbToRgbString(this.stringToRgb(bf));
},rgbToRgbString:function(c){return V+c[0]+W+c[1]+W+c[2]+U;
},rgbToHexString:function(bh){return (qx.lang.String.pad(bh[0].toString(16).toUpperCase(),2)+qx.lang.String.pad(bh[1].toString(16).toUpperCase(),2)+qx.lang.String.pad(bh[2].toString(16).toUpperCase(),2));
},isValidPropertyValue:function(E){return this.isThemedColor(E)||this.isNamedColor(E)||this.isHex3String(E)||this.isHex6String(E)||this.isRgbString(E);
},isCssString:function(j){return this.isSystemColor(j)||this.isNamedColor(j)||this.isHex3String(j)||this.isHex6String(j)||this.isRgbString(j);
},isHex3String:function(D){return this.REGEXP.hex3.test(D);
},isHex6String:function(d){return this.REGEXP.hex6.test(d);
},isRgbString:function(h){return this.REGEXP.rgb.test(h);
},isRgbaString:function(G){return this.REGEXP.rgba.test(G);
},__cP:function(){var C=parseInt(RegExp.$1,10);
var B=parseInt(RegExp.$2,10);
var A=parseInt(RegExp.$3,10);
return [C,B,A];
},__cQ:function(){var Q=parseInt(RegExp.$1,10);
var P=parseInt(RegExp.$2,10);
var O=parseInt(RegExp.$3,10);
return [Q,P,O];
},__cR:function(){var J=parseInt(RegExp.$1,16)*17;
var I=parseInt(RegExp.$2,16)*17;
var H=parseInt(RegExp.$3,16)*17;
return [J,I,H];
},__cS:function(){var N=(parseInt(RegExp.$1,16)*16)+parseInt(RegExp.$2,16);
var M=(parseInt(RegExp.$3,16)*16)+parseInt(RegExp.$4,16);
var L=(parseInt(RegExp.$5,16)*16)+parseInt(RegExp.$6,16);
return [N,M,L];
},hex3StringToRgb:function(e){if(this.isHex3String(e)){return this.__cR(e);
}throw new Error("Invalid hex3 value: "+e);
},hex6StringToRgb:function(bi){if(this.isHex6String(bi)){return this.__cS(bi);
}throw new Error("Invalid hex6 value: "+bi);
},hexStringToRgb:function(K){if(this.isHex3String(K)){return this.__cR(K);
}
if(this.isHex6String(K)){return this.__cS(K);
}throw new Error("Invalid hex value: "+K);
},rgbToHsb:function(k){var m,n,s;
var z=k[0];
var w=k[1];
var l=k[2];
var y=(z>w)?z:w;

if(l>y){y=l;
}var o=(z<w)?z:w;

if(l<o){o=l;
}s=y/255.0;

if(y!=0){n=(y-o)/y;
}else{n=0;
}
if(n==0){m=0;
}else{var v=(y-z)/(y-o);
var x=(y-w)/(y-o);
var u=(y-l)/(y-o);

if(z==y){m=u-x;
}else if(w==y){m=2.0+v-u;
}else{m=4.0+x-v;
}m=m/6.0;

if(m<0){m=m+1.0;
}}return [Math.round(m*360),Math.round(n*100),Math.round(s*100)];
},hsbToRgb:function(X){var i,f,p,q,t;
var Y=X[0]/360;
var ba=X[1]/100;
var bb=X[2]/100;

if(Y>=1.0){Y%=1.0;
}
if(ba>1.0){ba=1.0;
}
if(bb>1.0){bb=1.0;
}var bc=Math.floor(255*bb);
var bd={};

if(ba==0.0){bd.red=bd.green=bd.blue=bc;
}else{Y*=6.0;
i=Math.floor(Y);
f=Y-i;
p=Math.floor(bc*(1.0-ba));
q=Math.floor(bc*(1.0-(ba*f)));
t=Math.floor(bc*(1.0-(ba*(1.0-f))));

switch(i){case 0:bd.red=bc;
bd.green=t;
bd.blue=p;
break;
case 1:bd.red=q;
bd.green=bc;
bd.blue=p;
break;
case 2:bd.red=p;
bd.green=bc;
bd.blue=t;
break;
case 3:bd.red=p;
bd.green=q;
bd.blue=bc;
break;
case 4:bd.red=t;
bd.green=p;
bd.blue=bc;
break;
case 5:bd.red=bc;
bd.green=p;
bd.blue=q;
break;
}}return [bd.red,bd.green,bd.blue];
},randomColor:function(){var r=Math.round(Math.random()*255);
var g=Math.round(Math.random()*255);
var b=Math.round(Math.random()*255);
return this.rgbToRgbString([r,g,b]);
}}});
})();
(function(){var n="object",m="_applyTheme",l="qx.theme.manager.Decoration",k="Theme",j="__cT",i="changeTheme",h="string",g="singleton";
qx.Class.define(l,{type:g,extend:qx.core.Object,properties:{theme:{check:k,nullable:true,apply:m,event:i}},members:{__cT:null,resolve:function(q){if(!q){return null;
}
if(typeof q===n){return q;
}var t=this.getTheme();

if(!t){return null;
}var t=this.getTheme();

if(!t){return null;
}var u=this.__cT;

if(!u){u=this.__cT={};
}var r=u[q];

if(r){return r;
}var s=t.decorations[q];

if(!s){return null;
}var v=s.decorator;

if(v==null){throw new Error("Missing definition of which decorator to use in entry: "+q+"!");
}return u[q]=(new v).set(s.style);
},isValidPropertyValue:function(o){if(typeof o===h){return this.isDynamic(o);
}else if(typeof o===n){var p=o.constructor;
return qx.Class.hasInterface(p,qx.ui.decoration.IDecorator);
}return false;
},isDynamic:function(e){if(!e){return false;
}var f=this.getTheme();

if(!f){return false;
}return !!f.decorations[e];
},_applyTheme:function(a,b){var d=qx.util.AliasManager.getInstance();

if(b){for(var c in b.aliases){d.remove(c);
}}
if(a){for(var c in a.aliases){d.add(c,a.aliases[c]);
}}
if(!a){this.__cT={};
}}},destruct:function(){this._disposeMap(j);
}});
})();
(function(){var a="qx.ui.decoration.IDecorator";
qx.Interface.define(a,{members:{getMarkup:function(){},resize:function(d,e,f){},tint:function(b,c){},getInsets:function(){}}});
})();
(function(){var p="/",o="0",n="qx/static",m="http://",l="https://",k="file://",j="qx.util.AliasManager",i="singleton",h=".",g="static";
qx.Class.define(j,{type:i,extend:qx.util.ValueManager,construct:function(){qx.util.ValueManager.call(this);
this.__cU={};
this.add(g,n);
},members:{__cU:null,_preprocess:function(a){var d=this._getDynamic();

if(d[a]===false){return a;
}else if(d[a]===undefined){if(a.charAt(0)===p||a.charAt(0)===h||a.indexOf(m)===0||a.indexOf(l)===o||a.indexOf(k)===0){d[a]=false;
return a;
}
if(this.__cU[a]){return this.__cU[a];
}var c=a.substring(0,a.indexOf(p));
var b=this.__cU[c];

if(b!==undefined){d[a]=b+a.substring(c.length);
}}return a;
},add:function(r,s){this.__cU[r]=s;
var u=this._getDynamic();
for(var t in u){if(t.substring(0,t.indexOf(p))===r){u[t]=s+t.substring(r.length);
}}},remove:function(q){delete this.__cU[q];
},resolve:function(e){var f=this._getDynamic();

if(e!==null){e=this._preprocess(e);
}return f[e]||e;
}},destruct:function(){this.__cU=null;
}});
})();
(function(){var h="qx.theme.manager.Font",g="Theme",f="changeTheme",e="_applyTheme",d="singleton";
qx.Class.define(h,{type:d,extend:qx.util.ValueManager,properties:{theme:{check:g,nullable:true,apply:e,event:f}},members:{resolveDynamic:function(u){var v=this._dynamic;
return u instanceof qx.bom.Font?u:v[u];
},resolve:function(i){var l=this._dynamic;
var j=l[i];

if(j){return j;
}var k=this.getTheme();

if(k!==null&&k.fonts[i]){return l[i]=(new qx.bom.Font).set(k.fonts[i]);
}return i;
},isDynamic:function(a){var c=this._dynamic;

if(a&&(a instanceof qx.bom.Font||c[a]!==undefined)){return true;
}var b=this.getTheme();

if(b!==null&&a&&b.fonts[a]){c[a]=(new qx.bom.Font).set(b.fonts[a]);
return true;
}return false;
},__cV:function(m,n){if(m[n].include){var o=m[m[n].include];
m[n].include=null;
delete m[n].include;
m[n]=qx.lang.Object.mergeWith(m[n],o,false);
this.__cV(m,n);
}},_applyTheme:function(p){var q=this._getDynamic();

for(var t in q){if(q[t].themed){q[t].dispose();
delete q[t];
}}
if(p){var r=p.fonts;
var s=qx.bom.Font;

for(var t in r){if(r[t].include&&r[r[t].include]){this.__cV(r,t);
}q[t]=(new s).set(r[t]);
q[t].themed=true;
}}this._setDynamic(q);
}}});
})();
(function(){var u="",t="underline",s="Boolean",r="px",q='"',p="italic",o="normal",n="bold",m="_applyItalic",k="_applyBold",G="Integer",F="_applyFamily",E="_applyLineHeight",D="Array",C="overline",B="line-through",A="qx.bom.Font",z="Number",y="_applyDecoration",x=" ",v="_applySize",w=",";
qx.Class.define(A,{extend:qx.core.Object,construct:function(O,P){qx.core.Object.call(this);

if(O!==undefined){this.setSize(O);
}
if(P!==undefined){this.setFamily(P);
}},statics:{fromString:function(J){var N=new qx.bom.Font();
var L=J.split(/\s+/);
var name=[];
var M;

for(var i=0;i<L.length;i++){switch(M=L[i]){case n:N.setBold(true);
break;
case p:N.setItalic(true);
break;
case t:N.setDecoration(t);
break;
default:var K=parseInt(M,10);

if(K==M||qx.lang.String.contains(M,r)){N.setSize(K);
}else{name.push(M);
}break;
}}
if(name.length>0){N.setFamily(name);
}return N;
},fromConfig:function(S){var T=new qx.bom.Font;
T.set(S);
return T;
},__cW:{fontFamily:u,fontSize:u,fontWeight:u,fontStyle:u,textDecoration:u,lineHeight:1.2},getDefaultStyles:function(){return this.__cW;
}},properties:{size:{check:G,nullable:true,apply:v},lineHeight:{check:z,nullable:true,apply:E},family:{check:D,nullable:true,apply:F},bold:{check:s,nullable:true,apply:k},italic:{check:s,nullable:true,apply:m},decoration:{check:[t,B,C],nullable:true,apply:y}},members:{__cX:null,__cY:null,__da:null,__db:null,__dc:null,__dd:null,_applySize:function(Q,R){this.__cX=Q===null?null:Q+r;
},_applyLineHeight:function(a,b){this.__dd=a===null?null:a;
},_applyFamily:function(c,d){var e=u;

for(var i=0,l=c.length;i<l;i++){if(c[i].indexOf(x)>0){e+=q+c[i]+q;
}else{e+=c[i];
}
if(i!==l-1){e+=w;
}}this.__cY=e;
},_applyBold:function(h,j){this.__da=h===null?null:h?n:o;
},_applyItalic:function(H,I){this.__db=H===null?null:H?p:o;
},_applyDecoration:function(f,g){this.__dc=f===null?null:f;
},getStyles:function(){return {fontFamily:this.__cY,fontSize:this.__cX,fontWeight:this.__da,fontStyle:this.__db,textDecoration:this.__dc,lineHeight:this.__dd};
}}});
})();
(function(){var e="qx.theme.manager.Icon",d="Theme",c="changeTheme",b="_applyTheme",a="singleton";
qx.Class.define(e,{type:a,extend:qx.core.Object,properties:{theme:{check:d,nullable:true,apply:b,event:c}},members:{_applyTheme:function(f,g){var i=qx.util.AliasManager.getInstance();

if(g){for(var h in g.aliases){i.remove(h);
}}
if(f){for(var h in f.aliases){i.add(h,f.aliases[h]);
}}}}});
})();
(function(){var s="string",r="_applyTheme",q="qx.theme.manager.Appearance",p=":",o="Theme",n="changeTheme",m="/",l="singleton";
qx.Class.define(q,{type:l,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__de={};
this.__df={};
},properties:{theme:{check:o,nullable:true,event:n,apply:r}},members:{__dg:{},__de:null,__df:null,_applyTheme:function(K,L){this.__df={};
this.__de={};
},__dh:function(a,b,c){var g=b.appearances;
var j=g[a];

if(!j){var k=m;
var d=[];
var i=a.split(k);
var h;

while(!j&&i.length>0){d.unshift(i.pop());
var e=i.join(k);
j=g[e];

if(j){h=j.alias||j;

if(typeof h===s){var f=h+k+d.join(k);
return this.__dh(f,b,c);
}}}if(c!=null){return this.__dh(c,b);
}return null;
}else if(typeof j===s){return this.__dh(j,b,c);
}else if(j.include&&!j.style){return this.__dh(j.include,b,c);
}return a;
},styleFrom:function(t,u,v,w){if(!v){v=this.getTheme();
}var C=this.__df;
var x=C[t];

if(!x){x=C[t]=this.__dh(t,v,w);
}var H=v.appearances[x];

if(!H){this.warn("Missing appearance: "+t);
return null;
}if(!H.style){return null;
}var I=x;

if(u){var J=H.$$bits;

if(!J){J=H.$$bits={};
H.$$length=0;
}var A=0;

for(var D in u){if(!u[D]){continue;
}
if(J[D]==null){J[D]=1<<H.$$length++;
}A+=J[D];
}if(A>0){I+=p+A;
}}var B=this.__de;

if(B[I]!==undefined){return B[I];
}if(!u){u=this.__dg;
}var F;
if(H.include||H.base){var z=H.style(u);
var y;

if(H.include){y=this.styleFrom(H.include,u,v,w);
}F={};
if(H.base){var E=this.styleFrom(x,u,H.base,w);

if(H.include){for(var G in E){if(!y.hasOwnProperty(G)&&!z.hasOwnProperty(G)){F[G]=E[G];
}}}else{for(var G in E){if(!z.hasOwnProperty(G)){F[G]=E[G];
}}}}if(H.include){for(var G in y){if(!z.hasOwnProperty(G)){F[G]=y[G];
}}}for(var G in z){F[G]=z[G];
}}else{F=H.style(u);
}return B[I]=F||null;
}},destruct:function(){this.__de=this.__df=null;
}});
})();
(function(){var F="other",E="widgets",D="fonts",C="appearances",B="qx.Theme",A="]",z="[Theme ",y="colors",x="decorations",w="Theme",t="meta",v="borders",u="icons";
qx.Bootstrap.define(B,{statics:{define:function(name,P){if(!P){var P={};
}P.include=this.__di(P.include);
P.patch=this.__di(P.patch);
{};
var Q={$$type:w,name:name,title:P.title,toString:this.genericToString};
if(P.extend){Q.supertheme=P.extend;
}Q.basename=qx.Bootstrap.createNamespace(name,Q);
this.__dl(Q,P);
this.__dj(Q,P);
this.$$registry[name]=Q;
for(var i=0,a=P.include,l=a.length;i<l;i++){this.include(Q,a[i]);
}
for(var i=0,a=P.patch,l=a.length;i<l;i++){this.patch(Q,a[i]);
}},__di:function(m){if(!m){return [];
}
if(qx.Bootstrap.isArray(m)){return m;
}else{return [m];
}},__dj:function(h,j){var k=j.aliases||{};

if(j.extend&&j.extend.aliases){qx.Bootstrap.objectMergeWith(k,j.extend.aliases,false);
}h.aliases=k;
},getAll:function(){return this.$$registry;
},getByName:function(name){return this.$$registry[name];
},isDefined:function(name){return this.getByName(name)!==undefined;
},getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry);
},genericToString:function(){return z+this.name+A;
},__dk:function(G){for(var i=0,H=this.__dm,l=H.length;i<l;i++){if(G[H[i]]){return H[i];
}}},__dl:function(I,J){var M=this.__dk(J);
if(J.extend&&!M){M=J.extend.type;
}I.type=M||F;
if(!M){return;
}var O=function(){};
if(J.extend){O.prototype=new J.extend.$$clazz;
}var N=O.prototype;
var L=J[M];
for(var K in L){N[K]=L[K];
if(N[K].base){{};
N[K].base=J.extend;
}}I.$$clazz=O;
I[M]=new O;
},$$registry:{},__dm:[y,v,x,D,u,E,C,t],__dn:null,__do:null,__dp:function(){},patch:function(n,o){var q=this.__dk(o);

if(q!==this.__dk(n)){throw new Error("The mixins '"+n.name+"' are not compatible '"+o.name+"'!");
}var p=o[q];
var r=n.$$clazz.prototype;

for(var s in p){r[s]=p[s];
}},include:function(b,c){var e=c.type;

if(e!==b.type){throw new Error("The mixins '"+b.name+"' are not compatible '"+c.name+"'!");
}var d=c[e];
var f=b.$$clazz.prototype;

for(var g in d){if(f[g]!==undefined){continue;
}f[g]=d[g];
}}}});
})();
(function(){var x="focusout",w="interval",v="mouseover",u="mouseout",t="mousemove",s="widget",r="qx.ui.tooltip.ToolTip",q="Boolean",p="__dr",o="__dt",l="_applyCurrent",n="qx.ui.tooltip.Manager",m="__dq",k="tooltip-error",j="singleton";
qx.Class.define(n,{type:j,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
qx.event.Registration.addListener(document.body,v,this.__dA,this,true);
this.__dq=new qx.event.Timer();
this.__dq.addListener(w,this.__dx,this);
this.__dr=new qx.event.Timer();
this.__dr.addListener(w,this.__dy,this);
this.__ds={left:0,top:0};
},properties:{current:{check:r,nullable:true,apply:l},showInvalidTooltips:{check:q,init:true}},members:{__ds:null,__dr:null,__dq:null,__dt:null,__du:null,__dv:function(){if(!this.__dt){this.__dt=new qx.ui.tooltip.ToolTip().set({rich:true});
}return this.__dt;
},__dw:function(){if(!this.__du){this.__du=new qx.ui.tooltip.ToolTip().set({appearance:k});
this.__du.syncAppearance();
}return this.__du;
},_applyCurrent:function(B,C){if(C&&qx.ui.core.Widget.contains(C,B)){return;
}if(C){if(!C.isDisposed()){C.exclude();
}this.__dq.stop();
this.__dr.stop();
}var E=qx.event.Registration;
var D=document.body;
if(B){this.__dq.startWith(B.getShowTimeout());
E.addListener(D,u,this.__dB,this,true);
E.addListener(D,x,this.__dC,this,true);
E.addListener(D,t,this.__dz,this,true);
}else{E.removeListener(D,u,this.__dB,this,true);
E.removeListener(D,x,this.__dC,this,true);
E.removeListener(D,t,this.__dz,this,true);
}},__dx:function(e){var F=this.getCurrent();

if(F&&!F.isDisposed()){this.__dr.startWith(F.getHideTimeout());

if(F.getPlaceMethod()==s){F.placeToWidget(F.getOpener());
}else{F.placeToPoint(this.__ds);
}F.show();
}this.__dq.stop();
},__dy:function(e){var i=this.getCurrent();

if(i&&!i.isDisposed()){i.exclude();
}this.__dr.stop();
this.resetCurrent();
},__dz:function(e){var G=this.__ds;
G.left=e.getDocumentLeft();
G.top=e.getDocumentTop();
},__dA:function(e){var f=qx.ui.core.Widget.getWidgetByElement(e.getTarget());

if(!f){return;
}var g;
while(f!=null){var g=f.getToolTip();
var h=f.getToolTipText()||null;
var d=f.getToolTipIcon()||null;

if(qx.Class.hasInterface(f.constructor,qx.ui.form.IForm)&&!f.isValid()){var c=f.getInvalidMessage();
}
if(g||h||d||c){break;
}f=f.getLayoutParent();
}
if(!f){return;
}
if(f.isBlockToolTip()){return;
}if(c&&f.getEnabled()){if(!this.getShowInvalidTooltips()){return;
}var g=this.__dw().set({label:c});
}else if(!g){var g=this.__dv().set({label:h,icon:d});
}this.setCurrent(g);
g.setOpener(f);
},__dB:function(e){var y=qx.ui.core.Widget.getWidgetByElement(e.getTarget());

if(!y){return;
}var z=qx.ui.core.Widget.getWidgetByElement(e.getRelatedTarget());

if(!z){return;
}var A=this.getCurrent();
if(A&&(z==A||qx.ui.core.Widget.contains(A,z))){return;
}if(z&&y&&qx.ui.core.Widget.contains(y,z)){return;
}if(A&&!z){this.setCurrent(null);
}else{this.resetCurrent();
}},__dC:function(e){var a=qx.ui.core.Widget.getWidgetByElement(e.getTarget());

if(!a){return;
}var b=this.getCurrent();
if(b&&b==a.getToolTip()){this.setCurrent(null);
}}},destruct:function(){qx.event.Registration.removeListener(document.body,v,this.__dA,this,true);
this._disposeObjects(m,p,o);
this.__ds=null;
}});
})();
(function(){var o="interval",n="qx.event.Timer",m="_applyInterval",l="_applyEnabled",k="Boolean",j="qx.event.type.Event",i="Integer";
qx.Class.define(n,{extend:qx.core.Object,construct:function(h){qx.core.Object.call(this);
this.setEnabled(false);

if(h!=null){this.setInterval(h);
}var self=this;
this.__dD=function(){self._oninterval.call(self);
};
},events:{"interval":j},statics:{once:function(b,c,d){var f=new qx.event.Timer(d);
f.__dE=b;
f.addListener(o,function(e){f.stop();
b.call(c,e);
f.dispose();
c=null;
},c);
f.start();
return f;
}},properties:{enabled:{init:true,check:k,apply:l},interval:{check:i,init:1000,apply:m}},members:{__dF:null,__dD:null,_applyInterval:function(r,s){if(this.getEnabled()){this.restart();
}},_applyEnabled:function(p,q){if(q){window.clearInterval(this.__dF);
this.__dF=null;
}else if(p){this.__dF=window.setInterval(this.__dD,this.getInterval());
}},start:function(){this.setEnabled(true);
},startWith:function(a){this.setInterval(a);
this.start();
},stop:function(){this.setEnabled(false);
},restart:function(){this.stop();
this.start();
},restartWith:function(g){this.stop();
this.startWith(g);
},_oninterval:qx.event.GlobalError.observeMethod(function(){if(this.$$disposed){return;
}
if(this.getEnabled()){this.fireEvent(o);
}})},destruct:function(){if(this.__dF){window.clearInterval(this.__dF);
}this.__dF=this.__dD=null;
}});
})();
(function(){var c="qx.ui.core.MChildrenHandling";
qx.Mixin.define(c,{members:{getChildren:function(){return this._getChildren();
},hasChildren:function(){return this._hasChildren();
},indexOf:function(b){return this._indexOf(b);
},add:function(o,p){this._add(o,p);
},addAt:function(d,e,f){this._addAt(d,e,f);
},addBefore:function(g,h,i){this._addBefore(g,h,i);
},addAfter:function(j,k,l){this._addAfter(j,k,l);
},remove:function(n){this._remove(n);
},removeAt:function(a){return this._removeAt(a);
},removeAll:function(){this._removeAll();
}},statics:{remap:function(m){m.getChildren=m._getChildren;
m.hasChildren=m._hasChildren;
m.indexOf=m._indexOf;
m.add=m._add;
m.addAt=m._addAt;
m.addBefore=m._addBefore;
m.addAfter=m._addAfter;
m.remove=m._remove;
m.removeAt=m._removeAt;
m.removeAll=m._removeAll;
}}});
})();
(function(){var a="qx.ui.core.MLayoutHandling";
qx.Mixin.define(a,{members:{setLayout:function(b){return this._setLayout(b);
},getLayout:function(){return this._getLayout();
}},statics:{remap:function(c){c.getLayout=c._getLayout;
c.setLayout=c._setLayout;
}}});
})();
(function(){var H="Integer",G="_applyDimension",F="Boolean",E="_applyStretching",D="_applyMargin",C="shorthand",B="_applyAlign",A="allowShrinkY",z="bottom",y="baseline",V="marginBottom",U="qx.ui.core.LayoutItem",T="center",S="marginTop",R="allowGrowX",Q="middle",P="marginLeft",O="allowShrinkX",N="top",M="right",K="marginRight",L="abstract",I="allowGrowY",J="left";
qx.Class.define(U,{type:L,extend:qx.core.Object,properties:{minWidth:{check:H,nullable:true,apply:G,init:null,themeable:true},width:{check:H,nullable:true,apply:G,init:null,themeable:true},maxWidth:{check:H,nullable:true,apply:G,init:null,themeable:true},minHeight:{check:H,nullable:true,apply:G,init:null,themeable:true},height:{check:H,nullable:true,apply:G,init:null,themeable:true},maxHeight:{check:H,nullable:true,apply:G,init:null,themeable:true},allowGrowX:{check:F,apply:E,init:true,themeable:true},allowShrinkX:{check:F,apply:E,init:true,themeable:true},allowGrowY:{check:F,apply:E,init:true,themeable:true},allowShrinkY:{check:F,apply:E,init:true,themeable:true},allowStretchX:{group:[R,O],mode:C,themeable:true},allowStretchY:{group:[I,A],mode:C,themeable:true},marginTop:{check:H,init:0,apply:D,themeable:true},marginRight:{check:H,init:0,apply:D,themeable:true},marginBottom:{check:H,init:0,apply:D,themeable:true},marginLeft:{check:H,init:0,apply:D,themeable:true},margin:{group:[S,K,V,P],mode:C,themeable:true},alignX:{check:[J,T,M],nullable:true,apply:B,themeable:true},alignY:{check:[N,Q,z,y],nullable:true,apply:B,themeable:true}},members:{__dG:null,__dH:null,__dI:null,__dJ:null,__dK:null,__dL:null,__dM:null,getBounds:function(){return this.__dL||this.__dH||null;
},clearSeparators:function(){},renderSeparator:function(W,X){},renderLayout:function(f,top,g,h){var i;
{};
var j=null;

if(this.getHeight()==null&&this._hasHeightForWidth()){var j=this._getHeightForWidth(g);
}
if(j!=null&&j!==this.__dG){this.__dG=j;
qx.ui.core.queue.Layout.add(this);
return null;
}var l=this.__dH;

if(!l){l=this.__dH={};
}var k={};

if(f!==l.left||top!==l.top){k.position=true;
l.left=f;
l.top=top;
}
if(g!==l.width||h!==l.height){k.size=true;
l.width=g;
l.height=h;
}if(this.__dI){k.local=true;
delete this.__dI;
}
if(this.__dK){k.margin=true;
delete this.__dK;
}return k;
},isExcluded:function(){return false;
},hasValidLayout:function(){return !this.__dI;
},scheduleLayoutUpdate:function(){qx.ui.core.queue.Layout.add(this);
},invalidateLayoutCache:function(){this.__dI=true;
this.__dJ=null;
},getSizeHint:function(Y){var ba=this.__dJ;

if(ba){return ba;
}
if(Y===false){return null;
}ba=this.__dJ=this._computeSizeHint();
if(this._hasHeightForWidth()&&this.__dG&&this.getHeight()==null){ba.height=this.__dG;
}if(ba.minWidth>ba.width){ba.width=ba.minWidth;
}
if(ba.maxWidth<ba.width){ba.width=ba.maxWidth;
}
if(!this.getAllowGrowX()){ba.maxWidth=ba.width;
}
if(!this.getAllowShrinkX()){ba.minWidth=ba.width;
}if(ba.minHeight>ba.height){ba.height=ba.minHeight;
}
if(ba.maxHeight<ba.height){ba.height=ba.maxHeight;
}
if(!this.getAllowGrowY()){ba.maxHeight=ba.height;
}
if(!this.getAllowShrinkY()){ba.minHeight=ba.height;
}return ba;
},_computeSizeHint:function(){var q=this.getMinWidth()||0;
var n=this.getMinHeight()||0;
var r=this.getWidth()||q;
var p=this.getHeight()||n;
var m=this.getMaxWidth()||Infinity;
var o=this.getMaxHeight()||Infinity;
return {minWidth:q,width:r,maxWidth:m,minHeight:n,height:p,maxHeight:o};
},_hasHeightForWidth:function(){var s=this._getLayout();

if(s){return s.hasHeightForWidth();
}return false;
},_getHeightForWidth:function(w){var x=this._getLayout();

if(x&&x.hasHeightForWidth()){return x.getHeightForWidth(w);
}return null;
},_getLayout:function(){return null;
},_applyMargin:function(){this.__dK=true;
var parent=this.$$parent;

if(parent){parent.updateLayoutProperties();
}},_applyAlign:function(){var parent=this.$$parent;

if(parent){parent.updateLayoutProperties();
}},_applyDimension:function(){qx.ui.core.queue.Layout.add(this);
},_applyStretching:function(){qx.ui.core.queue.Layout.add(this);
},hasUserBounds:function(){return !!this.__dL;
},setUserBounds:function(a,top,b,c){this.__dL={left:a,top:top,width:b,height:c};
qx.ui.core.queue.Layout.add(this);
},resetUserBounds:function(){delete this.__dL;
qx.ui.core.queue.Layout.add(this);
},__dN:{},setLayoutProperties:function(bb){if(bb==null){return;
}var bc=this.__dM;

if(!bc){bc=this.__dM={};
}var parent=this.getLayoutParent();

if(parent){parent.updateLayoutProperties(bb);
}for(var bd in bb){if(bb[bd]==null){delete bc[bd];
}else{bc[bd]=bb[bd];
}}},getLayoutProperties:function(){return this.__dM||this.__dN;
},clearLayoutProperties:function(){delete this.__dM;
},updateLayoutProperties:function(t){var u=this._getLayout();

if(u){var v;
{};
u.invalidateChildrenCache();
}qx.ui.core.queue.Layout.add(this);
},getApplicationRoot:function(){return qx.core.Init.getApplication().getRoot();
},getLayoutParent:function(){return this.$$parent||null;
},setLayoutParent:function(parent){if(this.$$parent===parent){return;
}this.$$parent=parent||null;
qx.ui.core.queue.Visibility.add(this);
},isRootWidget:function(){return false;
},_getRoot:function(){var parent=this;

while(parent){if(parent.isRootWidget()){return parent;
}parent=parent.$$parent;
}return null;
},clone:function(){var d=qx.core.Object.prototype.clone.call(this);
var e=this.__dM;

if(e){d.__dM=qx.lang.Object.clone(e);
}return d;
}},destruct:function(){this.$$parent=this.$$subparent=this.__dM=this.__dH=this.__dL=this.__dJ=null;
}});
})();
(function(){var e="qx.ui.core.DecoratorFactory",d="$$nopool$$";
qx.Class.define(e,{extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__dO={};
},statics:{MAX_SIZE:15,__dP:d},members:{__dO:null,getDecoratorElement:function(f){var k=qx.ui.core.DecoratorFactory;

if(qx.lang.Type.isString(f)){var i=f;
var h=qx.theme.manager.Decoration.getInstance().resolve(f);
}else{var i=k.__dP;
h=f;
}var j=this.__dO;

if(j[i]&&j[i].length>0){var g=j[i].pop();
}else{var g=this._createDecoratorElement(h,i);
}g.$$pooled=false;
return g;
},poolDecorator:function(l){if(!l||l.$$pooled){return;
}var o=qx.ui.core.DecoratorFactory;
var m=l.getId();

if(m==o.__dP){l.dispose();
return;
}var n=this.__dO;

if(!n[m]){n[m]=[];
}
if(n[m].length>o.MAX_SIZE){l.dispose();
}else{l.$$pooled=true;
n[m].push(l);
}},_createDecoratorElement:function(a,b){var c=new qx.html.Decorator(a,b);
{};
return c;
},toString:function(){return qx.core.Object.prototype.toString.call(this);
}},destruct:function(){if(!qx.core.ObjectRegistry.inShutDown){var q=this.__dO;

for(var p in q){qx.util.DisposeUtil.disposeArray(q,p);
}}this.__dO=null;
}});
})();
(function(){var fp="px",fo="Boolean",fn="qx.event.type.Mouse",fm="qx.event.type.Drag",fl="visible",fk="qx.event.type.Focus",fj="on",fi="Integer",fh="excluded",fg="qx.event.type.Data",eR="_applyPadding",eQ="qx.event.type.Event",eP="hidden",eO="contextmenu",eN="String",eM="tabIndex",eL="backgroundColor",eK="focused",eJ="changeVisibility",eI="mshtml",fw="hovered",fx="qx.event.type.KeySequence",fu="qx.client",fv="absolute",fs="drag",ft="div",fq="disabled",fr="move",fy="dragstart",fz="qx.dynlocale",eY="dragchange",eX="dragend",fb="resize",fa="Decorator",fd="zIndex",fc="opacity",ff="default",fe="Color",eW="changeToolTipText",eV="beforeContextmenuOpen",dy="_applyNativeContextMenu",dz="_applyBackgroundColor",dA="_applyFocusable",dB="changeShadow",dC="qx.event.type.KeyInput",dD="createChildControl",dE="__dQ",dF="Font",dG="_applyShadow",dH="_applyEnabled",fD="_applySelectable",fC="Number",fB="_applyKeepActive",fA="__ea",fH="_applyVisibility",fG="repeat",fF="qxDraggable",fE="__dR",fJ="syncAppearance",fI="paddingLeft",eh="_applyDroppable",ei="__ec",ef="#",eg="qx.event.type.MouseWheel",em="_applyCursor",en="_applyDraggable",ej="changeTextColor",ek="$$widget",ed="changeContextMenu",ee="paddingTop",dP="changeSelectable",dO="hideFocus",dR="none",dQ="outline",dL="_applyAppearance",dK="_applyOpacity",dN="url(",dM=")",dJ="qx.ui.core.Widget",dI="_applyFont",es="cursor",et="qxDroppable",eu="changeZIndex",ev="changeEnabled",eo="changeFont",ep="__ee",eq="__dU",er="_applyDecorator",ew="_applyZIndex",ex="_applyTextColor",ea="qx.ui.menu.Menu",dY="_applyToolTipText",dX="true",dW="widget",dV="changeDecorator",dU="__dV",dT="_applyTabIndex",dS="changeAppearance",ec="shorthand",eb="/",ey="",ez="_applyContextMenu",eA="paddingBottom",eB="__dW",eC="changeNativeContextMenu",eD="qx.ui.tooltip.ToolTip",eE="qxKeepActive",eF="_applyKeepFocus",eG="paddingRight",eH="changeBackgroundColor",eU="changeLocale",eT="qxKeepFocus",eS="qx/static/blank.gif";
qx.Class.define(dJ,{extend:qx.ui.core.LayoutItem,include:[qx.locale.MTranslation],construct:function(){qx.ui.core.LayoutItem.call(this);
this.__dQ=this._createContainerElement();
this.__dR=this.__ed();
this.__dQ.add(this.__dR);
this.initFocusable();
this.initSelectable();
this.initNativeContextMenu();
},events:{appear:eQ,disappear:eQ,createChildControl:fg,resize:fg,move:fg,syncAppearance:fg,mousemove:fn,mouseover:fn,mouseout:fn,mousedown:fn,mouseup:fn,click:fn,dblclick:fn,contextmenu:fn,beforeContextmenuOpen:fn,mousewheel:eg,keyup:fx,keydown:fx,keypress:fx,keyinput:dC,focus:fk,blur:fk,focusin:fk,focusout:fk,activate:fk,deactivate:fk,capture:eQ,losecapture:eQ,drop:fm,dragleave:fm,dragover:fm,drag:fm,dragstart:fm,dragend:fm,dragchange:fm,droprequest:fm},properties:{paddingTop:{check:fi,init:0,apply:eR,themeable:true},paddingRight:{check:fi,init:0,apply:eR,themeable:true},paddingBottom:{check:fi,init:0,apply:eR,themeable:true},paddingLeft:{check:fi,init:0,apply:eR,themeable:true},padding:{group:[ee,eG,eA,fI],mode:ec,themeable:true},zIndex:{nullable:true,init:null,apply:ew,event:eu,check:fi,themeable:true},decorator:{nullable:true,init:null,apply:er,event:dV,check:fa,themeable:true},shadow:{nullable:true,init:null,apply:dG,event:dB,check:fa,themeable:true},backgroundColor:{nullable:true,check:fe,apply:dz,event:eH,themeable:true},textColor:{nullable:true,check:fe,apply:ex,event:ej,themeable:true,inheritable:true},font:{nullable:true,apply:dI,check:dF,event:eo,themeable:true,inheritable:true,dereference:true},opacity:{check:fC,apply:dK,themeable:true,nullable:true,init:null},cursor:{check:eN,apply:em,themeable:true,inheritable:true,nullable:true,init:null},toolTip:{check:eD,nullable:true},toolTipText:{check:eN,nullable:true,event:eW,apply:dY},toolTipIcon:{check:eN,nullable:true,event:eW},blockToolTip:{check:fo,init:false},visibility:{check:[fl,eP,fh],init:fl,apply:fH,event:eJ},enabled:{init:true,check:fo,inheritable:true,apply:dH,event:ev},anonymous:{init:false,check:fo},tabIndex:{check:fi,nullable:true,apply:dT},focusable:{check:fo,init:false,apply:dA},keepFocus:{check:fo,init:false,apply:eF},keepActive:{check:fo,init:false,apply:fB},draggable:{check:fo,init:false,apply:en},droppable:{check:fo,init:false,apply:eh},selectable:{check:fo,init:false,event:dP,apply:fD},contextMenu:{check:ea,apply:ez,nullable:true,event:ed},nativeContextMenu:{check:fo,init:false,themeable:true,event:eC,apply:dy},appearance:{check:eN,init:dW,apply:dL,event:dS}},statics:{DEBUG:false,getWidgetByElement:function(gG){while(gG){var gH=gG.$$widget;
if(gH!=null){return qx.core.ObjectRegistry.fromHashCode(gH);
}try{gG=gG.parentNode;
}catch(e){return null;
}}return null;
},contains:function(parent,bp){while(bp){if(parent==bp){return true;
}bp=bp.getLayoutParent();
}return false;
},__dS:new qx.ui.core.DecoratorFactory(),__dT:new qx.ui.core.DecoratorFactory()},members:{__dQ:null,__dR:null,__dU:null,__dV:null,__dW:null,__dX:null,__dY:null,__ea:null,_getLayout:function(){return this.__ea;
},_setLayout:function(fT){{};

if(this.__ea){this.__ea.connectToWidget(null);
}
if(fT){fT.connectToWidget(this);
}this.__ea=fT;
qx.ui.core.queue.Layout.add(this);
},setLayoutParent:function(parent){if(this.$$parent===parent){return;
}var bo=this.getContainerElement();

if(this.$$parent&&!this.$$parent.$$disposed){this.$$parent.getContentElement().remove(bo);
}this.$$parent=parent||null;

if(parent&&!parent.$$disposed){this.$$parent.getContentElement().add(bo);
}this.$$refreshInheritables();
qx.ui.core.queue.Visibility.add(this);
},_updateInsets:null,__eb:function(a,b){if(a==b){return false;
}
if(a==null||b==null){return true;
}var bR=qx.theme.manager.Decoration.getInstance();
var bT=bR.resolve(a).getInsets();
var bS=bR.resolve(b).getInsets();

if(bT.top!=bS.top||bT.right!=bS.right||bT.bottom!=bS.bottom||bT.left!=bS.left){return true;
}return false;
},renderLayout:function(v,top,w,x){var G=qx.ui.core.LayoutItem.prototype.renderLayout.call(this,v,top,w,x);
if(!G){return;
}var z=this.getContainerElement();
var content=this.getContentElement();
var D=G.size||this._updateInsets;
var H=fp;
var E={};
if(G.position){E.left=v+H;
E.top=top+H;
}if(G.size){E.width=w+H;
E.height=x+H;
}
if(G.position||G.size){z.setStyles(E);
}
if(D||G.local||G.margin){var y=this.getInsets();
var innerWidth=w-y.left-y.right;
var innerHeight=x-y.top-y.bottom;
innerWidth=innerWidth<0?0:innerWidth;
innerHeight=innerHeight<0?0:innerHeight;
}var B={};

if(this._updateInsets){B.left=y.left+H;
B.top=y.top+H;
}
if(D){B.width=innerWidth+H;
B.height=innerHeight+H;
}
if(D||this._updateInsets){content.setStyles(B);
}
if(G.size){var F=this.__dW;

if(F){F.setStyles({width:w+fp,height:x+fp});
}}
if(G.size||this._updateInsets){if(this.__dU){this.__dU.resize(w,x);
}}
if(G.size){if(this.__dV){var y=this.__dV.getInsets();
var C=w+y.left+y.right;
var A=x+y.top+y.bottom;
this.__dV.resize(C,A);
}}
if(D||G.local||G.margin){if(this.__ea&&this.hasLayoutChildren()){this.__ea.renderLayout(innerWidth,innerHeight);
}else if(this.hasLayoutChildren()){throw new Error("At least one child in control "+this._findTopControl()+" requires a layout, but no one was defined!");
}}if(G.position&&this.hasListener(fr)){this.fireDataEvent(fr,this.getBounds());
}
if(G.size&&this.hasListener(fb)){this.fireDataEvent(fb,this.getBounds());
}delete this._updateInsets;
return G;
},__ec:null,clearSeparators:function(){var bz=this.__ec;

if(!bz){return;
}var bA=qx.ui.core.Widget.__dS;
var content=this.getContentElement();
var by;

for(var i=0,l=bz.length;i<l;i++){by=bz[i];
bA.poolDecorator(by);
content.remove(by);
}bz.length=0;
},renderSeparator:function(gI,gJ){var gK=qx.ui.core.Widget.__dS.getDecoratorElement(gI);
this.getContentElement().add(gK);
gK.resize(gJ.width,gJ.height);
gK.setStyles({left:gJ.left+fp,top:gJ.top+fp});
if(!this.__ec){this.__ec=[gK];
}else{this.__ec.push(gK);
}},_computeSizeHint:function(){var bk=this.getWidth();
var bj=this.getMinWidth();
var bf=this.getMaxWidth();
var bi=this.getHeight();
var bg=this.getMinHeight();
var bh=this.getMaxHeight();
{};
var bl=this._getContentHint();
var be=this.getInsets();
var bn=be.left+be.right;
var bm=be.top+be.bottom;

if(bk==null){bk=bl.width+bn;
}
if(bi==null){bi=bl.height+bm;
}
if(bj==null){bj=bn;

if(bl.minWidth!=null){bj+=bl.minWidth;
}}
if(bg==null){bg=bm;

if(bl.minHeight!=null){bg+=bl.minHeight;
}}
if(bf==null){if(bl.maxWidth==null){bf=Infinity;
}else{bf=bl.maxWidth+bn;
}}
if(bh==null){if(bl.maxHeight==null){bh=Infinity;
}else{bh=bl.maxHeight+bm;
}}return {width:bk,minWidth:bj,maxWidth:bf,height:bi,minHeight:bg,maxHeight:bh};
},invalidateLayoutCache:function(){qx.ui.core.LayoutItem.prototype.invalidateLayoutCache.call(this);

if(this.__ea){this.__ea.invalidateLayoutCache();
}},_getContentHint:function(){var gE=this.__ea;

if(gE){if(this.hasLayoutChildren()){var gD;
var gF=gE.getSizeHint();
{};
return gF;
}else{return {width:0,height:0};
}}else{return {width:100,height:50};
}},_getHeightForWidth:function(fY){var gd=this.getInsets();
var gg=gd.left+gd.right;
var gf=gd.top+gd.bottom;
var ge=fY-gg;
var gb=this._getLayout();

if(gb&&gb.hasHeightForWidth()){var ga=gb.getHeightForWidth(fY);
}else{ga=this._getContentHeightForWidth(ge);
}var gc=ga+gf;
return gc;
},_getContentHeightForWidth:function(cR){throw new Error("Abstract method call: _getContentHeightForWidth()!");
},getInsets:function(){var top=this.getPaddingTop();
var gq=this.getPaddingRight();
var gs=this.getPaddingBottom();
var gr=this.getPaddingLeft();

if(this.__dU){var gp=this.__dU.getInsets();
{};
top+=gp.top;
gq+=gp.right;
gs+=gp.bottom;
gr+=gp.left;
}return {"top":top,"right":gq,"bottom":gs,"left":gr};
},getInnerSize:function(){var gm=this.getBounds();

if(!gm){return null;
}var gl=this.getInsets();
return {width:gm.width-gl.left-gl.right,height:gm.height-gl.top-gl.bottom};
},show:function(){this.setVisibility(fl);
},hide:function(){this.setVisibility(eP);
},exclude:function(){this.setVisibility(fh);
},isVisible:function(){return this.getVisibility()===fl;
},isHidden:function(){return this.getVisibility()!==fl;
},isExcluded:function(){return this.getVisibility()===fh;
},isSeeable:function(){var go=this.getContainerElement().getDomElement();

if(go){return go.offsetWidth>0;
}var gn=this;

do{if(!gn.isVisible()){return false;
}
if(gn.isRootWidget()){return true;
}gn=gn.getLayoutParent();
}while(gn);
return false;
},_createContainerElement:function(){var dv={"$$widget":this.toHashCode()};
{};
var du={zIndex:0,position:fv};
return new qx.html.Element(ft,du,dv);
},__ed:function(){var cz=this._createContentElement();
{};
cz.setStyles({"position":fv,"zIndex":10});
return cz;
},_createContentElement:function(){return new qx.html.Element(ft,{overflowX:eP,overflowY:eP});
},getContainerElement:function(){return this.__dQ;
},getContentElement:function(){return this.__dR;
},getDecoratorElement:function(){return this.__dU||null;
},getShadowElement:function(){return this.__dV||null;
},__ee:null,getLayoutChildren:function(){var gB=this.__ee;

if(!gB){return this.__ef;
}var gC;

for(var i=0,l=gB.length;i<l;i++){var gA=gB[i];

if(gA.hasUserBounds()||gA.isExcluded()){if(gC==null){gC=gB.concat();
}qx.lang.Array.remove(gC,gA);
}}return gC||gB;
},scheduleLayoutUpdate:function(){qx.ui.core.queue.Layout.add(this);
},invalidateLayoutChildren:function(){var dd=this.__ea;

if(dd){dd.invalidateChildrenCache();
}qx.ui.core.queue.Layout.add(this);
},hasLayoutChildren:function(){var cS=this.__ee;

if(!cS){return false;
}var cT;

for(var i=0,l=cS.length;i<l;i++){cT=cS[i];

if(!cT.hasUserBounds()&&!cT.isExcluded()){return true;
}}return false;
},getChildrenContainer:function(){return this;
},__ef:[],_getChildren:function(){return this.__ee||this.__ef;
},_indexOf:function(gt){var gu=this.__ee;

if(!gu){return -1;
}return gu.indexOf(gt);
},_hasChildren:function(){var bQ=this.__ee;
return bQ!=null&&(!!bQ[0]);
},addChildrenToQueue:function(gL){var gM=this.__ee;

if(!gM){return;
}var gN;

for(var i=0,l=gM.length;i<l;i++){gN=gM[i];
gL[gN.$$hash]=gN;
gN.addChildrenToQueue(gL);
}},_add:function(bW,bX){if(bW.getLayoutParent()==this){qx.lang.Array.remove(this.__ee,bW);
}
if(this.__ee){this.__ee.push(bW);
}else{this.__ee=[bW];
}this.__eg(bW,bX);
},_addAt:function(r,s,t){if(!this.__ee){this.__ee=[];
}if(r.getLayoutParent()==this){qx.lang.Array.remove(this.__ee,r);
}var u=this.__ee[s];

if(u===r){return r.setLayoutProperties(t);
}
if(u){qx.lang.Array.insertBefore(this.__ee,r,u);
}else{this.__ee.push(r);
}this.__eg(r,t);
},_addBefore:function(gU,gV,gW){{};

if(gU==gV){return;
}
if(!this.__ee){this.__ee=[];
}if(gU.getLayoutParent()==this){qx.lang.Array.remove(this.__ee,gU);
}qx.lang.Array.insertBefore(this.__ee,gU,gV);
this.__eg(gU,gW);
},_addAfter:function(K,L,M){{};

if(K==L){return;
}
if(!this.__ee){this.__ee=[];
}if(K.getLayoutParent()==this){qx.lang.Array.remove(this.__ee,K);
}qx.lang.Array.insertAfter(this.__ee,K,L);
this.__eg(K,M);
},_remove:function(gk){if(!this.__ee){throw new Error("This widget has no children!");
}qx.lang.Array.remove(this.__ee,gk);
this.__eh(gk);
},_removeAt:function(fU){if(!this.__ee){throw new Error("This widget has no children!");
}var fV=this.__ee[fU];
qx.lang.Array.removeAt(this.__ee,fU);
this.__eh(fV);
return fV;
},_removeAll:function(){if(!this.__ee){return;
}var bc=this.__ee.concat();
this.__ee.length=0;

for(var i=bc.length-1;i>=0;i--){this.__eh(bc[i]);
}qx.ui.core.queue.Layout.add(this);
},_afterAddChild:null,_afterRemoveChild:null,__eg:function(fK,fL){{};
var parent=fK.getLayoutParent();

if(parent&&parent!=this){parent._remove(fK);
}fK.setLayoutParent(this);
if(fL){fK.setLayoutProperties(fL);
}else{this.updateLayoutProperties();
}if(this._afterAddChild){this._afterAddChild(fK);
}},__eh:function(bd){{};

if(bd.getLayoutParent()!==this){throw new Error("Remove Error: "+bd+" is not a child of this widget!");
}bd.setLayoutParent(null);
if(this.__ea){this.__ea.invalidateChildrenCache();
}qx.ui.core.queue.Layout.add(this);
if(this._afterRemoveChild){this._afterRemoveChild(bd);
}},capture:function(cA){this.getContainerElement().capture(cA);
},releaseCapture:function(){this.getContainerElement().releaseCapture();
},_applyPadding:function(fW,fX,name){this._updateInsets=true;
qx.ui.core.queue.Layout.add(this);
},_createProtectorElement:function(){if(this.__dW){return;
}var cU=this.__dW=new qx.html.Element;
{};
cU.setStyles({position:fv,top:0,left:0,zIndex:7});
var cV=this.getBounds();

if(cV){this.__dW.setStyles({width:cV.width+fp,height:cV.height+fp});
}if(qx.core.Variant.isSet(fu,eI)){cU.setStyles({backgroundImage:dN+qx.util.ResourceManager.getInstance().toUri(eS)+dM,backgroundRepeat:fG});
}this.getContainerElement().add(cU);
},_applyDecorator:function(S,T){{};
var X=qx.ui.core.Widget.__dS;
var V=this.getContainerElement();
if(!this.__dW&&!qx.bom.client.Feature.CSS_POINTER_EVENTS){this._createProtectorElement();
}if(T){V.remove(this.__dU);
X.poolDecorator(this.__dU);
}if(S){var W=this.__dU=X.getDecoratorElement(S);
W.setStyle(fd,5);
var U=this.getBackgroundColor();
W.tint(U);
V.add(W);
}else{delete this.__dU;
this._applyBackgroundColor(this.getBackgroundColor());
}if(S&&!T&&U){this.getContainerElement().setStyle(eL,null);
}if(this.__eb(T,S)){this._updateInsets=true;
qx.ui.core.queue.Layout.add(this);
}else if(S){var Y=this.getBounds();

if(Y){W.resize(Y.width,Y.height);
this.__dW&&
this.__dW.setStyles({width:Y.width+fp,height:Y.height+fp});
}}},_applyShadow:function(g,h){var q=qx.ui.core.Widget.__dT;
var k=this.getContainerElement();
if(h){k.remove(this.__dV);
q.poolDecorator(this.__dV);
}if(g){var n=this.__dV=q.getDecoratorElement(g);
k.add(n);
var p=n.getInsets();
n.setStyles({left:(-p.left)+fp,top:(-p.top)+fp});
var o=this.getBounds();

if(o){var m=o.width+p.left+p.right;
var j=o.height+p.top+p.bottom;
n.resize(m,j);
}n.tint(null);
}else{delete this.__dV;
}},_applyToolTipText:function(gR,gS){if(qx.core.Variant.isSet(fz,fj)){if(this.__dY){return;
}var gT=qx.locale.Manager.getInstance();
this.__dY=gT.addListener(eU,function(){if(gR&&gR.translate){this.setToolTipText(gR.translate());
}},this);
}},_applyTextColor:function(bY,ca){},_applyZIndex:function(ch,ci){this.getContainerElement().setStyle(fd,ch==null?0:ch);
},_applyVisibility:function(P,Q){var R=this.getContainerElement();

if(P===fl){R.show();
}else{R.hide();
}var parent=this.$$parent;

if(parent&&(Q==null||P==null||Q===fh||P===fh)){parent.invalidateLayoutChildren();
}qx.ui.core.queue.Visibility.add(this);
},_applyOpacity:function(de,df){this.getContainerElement().setStyle(fc,de==1?null:de);
if(qx.core.Variant.isSet(fu,eI)&&qx.bom.element.Decoration.isAlphaImageLoaderEnabled()){if(!qx.Class.isSubClassOf(this.getContentElement().constructor,qx.html.Image)){var dg=(de==1||de==null)?null:0.99;
this.getContentElement().setStyle(fc,dg);
}}},_applyCursor:function(cI,cJ){if(cI==null&&!this.isSelectable()){cI=ff;
}this.getContainerElement().setStyle(es,cI,qx.bom.client.Engine.OPERA);
},_applyBackgroundColor:function(cu,cv){var cw=this.getBackgroundColor();
var cy=this.getContainerElement();

if(this.__dU){this.__dU.tint(cw);
cy.setStyle(eL,null);
}else{var cx=qx.theme.manager.Color.getInstance().resolve(cw);
cy.setStyle(eL,cx);
}},_applyFont:function(bU,bV){},__ei:null,$$stateChanges:null,_forwardStates:null,hasState:function(cP){var cQ=this.__ei;
return cQ&&cQ[cP];
},addState:function(dp){var dq=this.__ei;

if(!dq){dq=this.__ei={};
}
if(dq[dp]){return;
}this.__ei[dp]=true;
if(dp===fw){this.syncAppearance();
}else if(!qx.ui.core.queue.Visibility.isVisible(this)){this.$$stateChanges=true;
}else{qx.ui.core.queue.Appearance.add(this);
}var forward=this._forwardStates;
var dt=this.__el;

if(forward&&forward[dp]&&dt){var dr;

for(var ds in dt){dr=dt[ds];

if(dr instanceof qx.ui.core.Widget){dt[ds].addState(dp);
}}}},removeState:function(cp){var cq=this.__ei;

if(!cq||!cq[cp]){return;
}delete this.__ei[cp];
if(cp===fw){this.syncAppearance();
}else if(!qx.ui.core.queue.Visibility.isVisible(this)){this.$$stateChanges=true;
}else{qx.ui.core.queue.Appearance.add(this);
}var forward=this._forwardStates;
var ct=this.__el;

if(forward&&forward[cp]&&ct){for(var cs in ct){var cr=ct[cs];

if(cr instanceof qx.ui.core.Widget){cr.removeState(cp);
}}}},replaceState:function(bq,br){var bs=this.__ei;

if(!bs){bs=this.__ei={};
}
if(!bs[br]){bs[br]=true;
}
if(bs[bq]){delete bs[bq];
}
if(!qx.ui.core.queue.Visibility.isVisible(this)){this.$$stateChanges=true;
}else{qx.ui.core.queue.Appearance.add(this);
}var forward=this._forwardStates;
var bv=this.__el;

if(forward&&forward[br]&&bv){for(var bu in bv){var bt=bv[bu];

if(bt instanceof qx.ui.core.Widget){bt.replaceState(bq,br);
}}}},__ej:null,__ek:null,syncAppearance:function(){var bI=this.__ei;
var bH=this.__ej;
var bJ=qx.theme.manager.Appearance.getInstance();
var bF=qx.core.Property.$$method.setThemed;
var bN=qx.core.Property.$$method.resetThemed;
if(this.__ek){delete this.__ek;
if(bH){var bE=bJ.styleFrom(bH,bI,null,this.getAppearance());
if(bE){bH=null;
}}}if(!bH){var bG=this;
var bM=[];

do{bM.push(bG.$$subcontrol||bG.getAppearance());
}while(bG=bG.$$subparent);
bH=this.__ej=bM.reverse().join(eb).replace(/#[0-9]+/g,ey);
}var bK=bJ.styleFrom(bH,bI,null,this.getAppearance());

if(bK){var bL;

if(bE){for(var bL in bE){if(bK[bL]===undefined){this[bN[bL]]();
}}}{};
for(var bL in bK){bK[bL]===undefined?this[bN[bL]]():this[bF[bL]](bK[bL]);
}}else if(bE){for(var bL in bE){this[bN[bL]]();
}}this.fireDataEvent(fJ,this.__ei);
},_applyAppearance:function(I,J){this.updateAppearance();
},checkAppearanceNeeds:function(){if(!this.__dX){qx.ui.core.queue.Appearance.add(this);
this.__dX=true;
}else if(this.$$stateChanges){qx.ui.core.queue.Appearance.add(this);
delete this.$$stateChanges;
}},updateAppearance:function(){this.__ek=true;
qx.ui.core.queue.Appearance.add(this);
var bD=this.__el;

if(bD){var bB;

for(var bC in bD){bB=bD[bC];

if(bB instanceof qx.ui.core.Widget){bB.updateAppearance();
}}}},syncWidget:function(){},getEventTarget:function(){var cj=this;

while(cj.getAnonymous()){cj=cj.getLayoutParent();

if(!cj){return null;
}}return cj;
},getFocusTarget:function(){var gO=this;

if(!gO.getEnabled()){return null;
}
while(gO.getAnonymous()||!gO.getFocusable()){gO=gO.getLayoutParent();

if(!gO||!gO.getEnabled()){return null;
}}return gO;
},getFocusElement:function(){return this.getContainerElement();
},isTabable:function(){return (!!this.getContainerElement().getDomElement())&&this.isFocusable();
},_applyFocusable:function(cY,da){var db=this.getFocusElement();
if(cY){var dc=this.getTabIndex();

if(dc==null){dc=1;
}db.setAttribute(eM,dc);
if(qx.core.Variant.isSet(fu,eI)){db.setAttribute(dO,dX);
}else{db.setStyle(dQ,dR);
}}else{if(db.isNativelyFocusable()){db.setAttribute(eM,-1);
}else if(da){db.setAttribute(eM,null);
}}},_applyKeepFocus:function(bw){var bx=this.getFocusElement();
bx.setAttribute(eT,bw?fj:null);
},_applyKeepActive:function(bO){var bP=this.getContainerElement();
bP.setAttribute(eE,bO?fj:null);
},_applyTabIndex:function(gx){if(gx==null){gx=1;
}else if(gx<1||gx>32000){throw new Error("TabIndex property must be between 1 and 32000");
}
if(this.getFocusable()&&gx!=null){this.getFocusElement().setAttribute(eM,gx);
}},_applySelectable:function(cF,cG){if(cG!==null){this._applyCursor(this.getCursor());
}this.getContainerElement().setSelectable(cF);
this.getContentElement().setSelectable(cF);
},_applyEnabled:function(fR,fS){if(fR===false){this.addState(fq);
this.removeState(fw);
if(this.isFocusable()){this.removeState(eK);
this._applyFocusable(false,true);
}if(this.isDraggable()){this._applyDraggable(false,true);
}if(this.isDroppable()){this._applyDroppable(false,true);
}}else{this.removeState(fq);
if(this.isFocusable()){this._applyFocusable(true,false);
}if(this.isDraggable()){this._applyDraggable(true,false);
}if(this.isDroppable()){this._applyDroppable(true,false);
}}},_applyNativeContextMenu:function(cW,cX,name){},_applyContextMenu:function(fM,fN){if(fN){fN.removeState(eO);

if(fN.getOpener()==this){fN.resetOpener();
}
if(!fM){this.removeListener(eO,this._onContextMenuOpen);
fN.removeListener(eJ,this._onBeforeContextMenuOpen,this);
}}
if(fM){fM.setOpener(this);
fM.addState(eO);

if(!fN){this.addListener(eO,this._onContextMenuOpen);
fM.addListener(eJ,this._onBeforeContextMenuOpen,this);
}}},_onContextMenuOpen:function(e){this.getContextMenu().openAtMouse(e);
e.stop();
},_onBeforeContextMenuOpen:function(e){if(e.getData()==fl&&this.hasListener(eV)){this.fireDataEvent(eV,e);
}},_onStopEvent:function(e){e.stopPropagation();
},_applyDraggable:function(cD,cE){if(!this.isEnabled()&&cD===true){cD=false;
}qx.ui.core.DragDropCursor.getInstance();
if(cD){this.addListener(fy,this._onDragStart);
this.addListener(fs,this._onDrag);
this.addListener(eX,this._onDragEnd);
this.addListener(eY,this._onDragChange);
}else{this.removeListener(fy,this._onDragStart);
this.removeListener(fs,this._onDrag);
this.removeListener(eX,this._onDragEnd);
this.removeListener(eY,this._onDragChange);
}this.getContainerElement().setAttribute(fF,cD?fj:null);
},_applyDroppable:function(gv,gw){if(!this.isEnabled()&&gv===true){gv=false;
}this.getContainerElement().setAttribute(et,gv?fj:null);
},_onDragStart:function(e){qx.ui.core.DragDropCursor.getInstance().placeToMouse(e);
this.getApplicationRoot().setGlobalCursor(ff);
},_onDrag:function(e){qx.ui.core.DragDropCursor.getInstance().placeToMouse(e);
},_onDragEnd:function(e){qx.ui.core.DragDropCursor.getInstance().moveTo(-1000,-1000);
this.getApplicationRoot().resetGlobalCursor();
},_onDragChange:function(e){var cb=qx.ui.core.DragDropCursor.getInstance();
var cc=e.getCurrentAction();
cc?cb.setAction(cc):cb.resetAction();
},visualizeFocus:function(){this.addState(eK);
},visualizeBlur:function(){this.removeState(eK);
},scrollChildIntoView:function(cd,ce,cf,cg){this.scrollChildIntoViewX(cd,ce,cg);
this.scrollChildIntoViewY(cd,cf,cg);
},scrollChildIntoViewX:function(fO,fP,fQ){this.getContentElement().scrollChildIntoViewX(fO.getContainerElement(),fP,fQ);
},scrollChildIntoViewY:function(c,d,f){this.getContentElement().scrollChildIntoViewY(c.getContainerElement(),d,f);
},focus:function(){if(this.isFocusable()){this.getFocusElement().focus();
}else{throw new Error("Widget is not focusable!");
}},blur:function(){if(this.isFocusable()){this.getFocusElement().blur();
}else{throw new Error("Widget is not focusable!");
}},activate:function(){this.getContainerElement().activate();
},deactivate:function(){this.getContainerElement().deactivate();
},tabFocus:function(){this.getFocusElement().focus();
},hasChildControl:function(cH){if(!this.__el){return false;
}return !!this.__el[cH];
},__el:null,_getCreatedChildControls:function(){return this.__el;
},getChildControl:function(gh,gi){if(!this.__el){if(gi){return null;
}this.__el={};
}var gj=this.__el[gh];

if(gj){return gj;
}
if(gi===true){return null;
}return this._createChildControl(gh);
},_showChildControl:function(dw){var dx=this.getChildControl(dw);
dx.show();
return dx;
},_excludeChildControl:function(ba){var bb=this.getChildControl(ba,true);

if(bb){bb.exclude();
}},_isChildControlVisible:function(gP){var gQ=this.getChildControl(gP,true);

if(gQ){return gQ.isVisible();
}return false;
},_createChildControl:function(dh){if(!this.__el){this.__el={};
}else if(this.__el[dh]){throw new Error("Child control '"+dh+"' already created!");
}var dl=dh.indexOf(ef);

if(dl==-1){var di=this._createChildControlImpl(dh);
}else{var di=this._createChildControlImpl(dh.substring(0,dl));
}
if(!di){throw new Error("Unsupported control: "+dh);
}di.$$subcontrol=dh;
di.$$subparent=this;
var dj=this.__ei;
var forward=this._forwardStates;

if(dj&&forward&&di instanceof qx.ui.core.Widget){for(var dk in dj){if(forward[dk]){di.addState(dk);
}}}this.fireDataEvent(dD,di);
return this.__el[dh]=di;
},_createChildControlImpl:function(cm){return null;
},_disposeChildControls:function(){var cO=this.__el;

if(!cO){return;
}var cM=qx.ui.core.Widget;

for(var cN in cO){var cL=cO[cN];

if(!cM.contains(this,cL)){cL.destroy();
}else{cL.dispose();
}}delete this.__el;
},_findTopControl:function(){var cK=this;

while(cK){if(!cK.$$subparent){return cK;
}cK=cK.$$subparent;
}return null;
},getContainerLocation:function(ck){var cl=this.getContainerElement().getDomElement();
return cl?qx.bom.element.Location.get(cl,ck):null;
},getContentLocation:function(cB){var cC=this.getContentElement().getDomElement();
return cC?qx.bom.element.Location.get(cC,cB):null;
},setDomLeft:function(dm){var dn=this.getContainerElement().getDomElement();

if(dn){dn.style.left=dm+fp;
}else{throw new Error("DOM element is not yet created!");
}},setDomTop:function(N){var O=this.getContainerElement().getDomElement();

if(O){O.style.top=N+fp;
}else{throw new Error("DOM element is not yet created!");
}},setDomPosition:function(gX,top){var gY=this.getContainerElement().getDomElement();

if(gY){gY.style.left=gX+fp;
gY.style.top=top+fp;
}else{throw new Error("DOM element is not yet created!");
}},destroy:function(){if(this.$$disposed){return;
}var parent=this.$$parent;

if(parent){parent._remove(this);
}qx.ui.core.queue.Dispose.add(this);
},clone:function(){var gy=qx.ui.core.LayoutItem.prototype.clone.call(this);

if(this.getChildren){var gz=this.getChildren();

for(var i=0,l=gz.length;i<l;i++){gy.add(gz[i].clone());
}}return gy;
}},destruct:function(){if(!qx.core.ObjectRegistry.inShutDown){if(qx.core.Variant.isSet(fz,fj)){if(this.__dY){qx.locale.Manager.getInstance().removeListenerById(this.__dY);
}}this.getContainerElement().setAttribute(ek,null,true);
this._disposeChildControls();
qx.ui.core.queue.Appearance.remove(this);
qx.ui.core.queue.Layout.remove(this);
qx.ui.core.queue.Visibility.remove(this);
qx.ui.core.queue.Widget.remove(this);
}if(!qx.core.ObjectRegistry.inShutDown){var co=qx.ui.core.Widget;
var cn=this.getContainerElement();

if(this.__dU){cn.remove(this.__dU);
co.__dS.poolDecorator(this.__dU);
}
if(this.__dV){cn.remove(this.__dV);
co.__dT.poolDecorator(this.__dV);
}this.clearSeparators();
this.__dU=this.__dV=this.__ec=null;
}else{this._disposeArray(ei);
this._disposeObjects(eq,dU);
}this._disposeArray(ep);
this.__ei=this.__el=null;
this._disposeObjects(fA,dE,fE,eB);
}});
})();
(function(){var h="qx.event.type.Data",g="qx.ui.container.Composite",f="addChildWidget",e="removeChildWidget";
qx.Class.define(g,{extend:qx.ui.core.Widget,include:[qx.ui.core.MChildrenHandling,qx.ui.core.MLayoutHandling],construct:function(b){qx.ui.core.Widget.call(this);

if(b!=null){this._setLayout(b);
}},events:{addChildWidget:h,removeChildWidget:h},members:{_afterAddChild:function(i){this.fireNonBubblingEvent(f,qx.event.type.Data,[i]);
},_afterRemoveChild:function(a){this.fireNonBubblingEvent(e,qx.event.type.Data,[a]);
}},defer:function(c,d){qx.ui.core.MChildrenHandling.remap(d);
qx.ui.core.MLayoutHandling.remap(d);
}});
})();
(function(){var j="keep-align",i="Integer",h="interval",g="direct",f="disappear",e="best-fit",d="mouse",c="bottom-left",b="Boolean",a="bottom-right",x="widget",w="qx.ui.core.MPlacement",v="left-top",u="offsetRight",t="shorthand",s="offsetLeft",r="top-left",q="appear",p="offsetBottom",o="top-right",m="offsetTop",n="right-bottom",k="right-top",l="left-bottom";
qx.Mixin.define(w,{properties:{position:{check:[r,o,c,a,v,l,k,n],init:c,themeable:true},placeMethod:{check:[x,d],init:d,themeable:true},domMove:{check:b,init:false},placementModeX:{check:[g,j,e],init:j,themeable:true},placementModeY:{check:[g,j,e],init:j,themeable:true},offsetLeft:{check:i,init:0,themeable:true},offsetTop:{check:i,init:0,themeable:true},offsetRight:{check:i,init:0,themeable:true},offsetBottom:{check:i,init:0,themeable:true},offset:{group:[m,u,p,s],mode:t,themeable:true}},members:{__em:null,__en:null,__eo:null,getLayoutLocation:function(S){var V,U,W,top;
U=S.getBounds();
W=U.left;
top=U.top;
var X=U;
S=S.getLayoutParent();

while(S&&!S.isRootWidget()){U=S.getBounds();
W+=U.left;
top+=U.top;
V=S.getInsets();
W+=V.left;
top+=V.top;
S=S.getLayoutParent();
}if(S.isRootWidget()){var T=S.getContainerLocation();

if(T){W+=T.left;
top+=T.top;
}}return {left:W,top:top,right:W+X.width,bottom:top+X.height};
},moveTo:function(M,top){if(this.getDomMove()){this.setDomPosition(M,top);
}else{this.setLayoutProperties({left:M,top:top});
}},placeToWidget:function(J,K){if(K){this.__ep();
this.__em=qx.lang.Function.bind(this.placeToWidget,this,J,false);
qx.event.Idle.getInstance().addListener(h,this.__em);
this.__eo=function(){this.__ep();
};
this.addListener(f,this.__eo,this);
}var L=J.getContainerLocation()||this.getLayoutLocation(J);
this.__er(L);
},__ep:function(){if(this.__em){qx.event.Idle.getInstance().removeListener(h,this.__em);
this.__em=null;
}
if(this.__eo){this.removeListener(f,this.__eo,this);
this.__eo=null;
}},placeToMouse:function(event){var B=event.getDocumentLeft();
var top=event.getDocumentTop();
var A={left:B,top:top,right:B,bottom:top};
this.__er(A);
},placeToElement:function(E,F){var location=qx.bom.element.Location.get(E);
var G={left:location.left,top:location.top,right:location.left+E.offsetWidth,bottom:location.top+E.offsetHeight};
if(F){this.__em=qx.lang.Function.bind(this.placeToElement,this,E,false);
qx.event.Idle.getInstance().addListener(h,this.__em);
this.addListener(f,function(){if(this.__em){qx.event.Idle.getInstance().removeListener(h,this.__em);
this.__em=null;
}},this);
}this.__er(G);
},placeToPoint:function(N){var O={left:N.left,top:N.top,right:N.left,bottom:N.top};
this.__er(O);
},_getPlacementOffsets:function(){return {left:this.getOffsetLeft(),top:this.getOffsetTop(),right:this.getOffsetRight(),bottom:this.getOffsetBottom()};
},__eq:function(Q){var R=null;

if(this._computePlacementSize){var R=this._computePlacementSize();
}else if(this.isVisible()){var R=this.getBounds();
}
if(R==null){this.addListenerOnce(q,function(){this.__eq(Q);
},this);
}else{Q.call(this,R);
}},__er:function(P){this.__eq(function(y){var z=qx.util.placement.Placement.compute(y,this.getLayoutParent().getBounds(),P,this._getPlacementOffsets(),this.getPosition(),this.getPlacementModeX(),this.getPlacementModeY());
this.moveTo(z.left,z.top);
});
},setSmart:function(H){{};
var I=H?j:g;
this.set({placementModeX:I,placementModeY:I});
},getSmart:function(){{};
var C=this.getPlacementModeX()==j?true:false;
var D=this.getPlacementModeY()==j?true:false;
return C&&D;
},resetSmart:function(){{};
this.resetPlacementModeX();
this.resetPlacementModeY();
},isSmart:function(){{};
return this.getSmart();
},toggleSmart:function(){{};
this.setSmart(!this.getSmart());
}},destruct:function(){this.__ep();
}});
})();
(function(){var e="qx.ui.popup.Popup",d="visible",c="excluded",b="popup",a="Boolean";
qx.Class.define(e,{extend:qx.ui.container.Composite,include:qx.ui.core.MPlacement,construct:function(f){qx.ui.container.Composite.call(this,f);
qx.core.Init.getApplication().getRoot().add(this);
this.initVisibility();
},properties:{appearance:{refine:true,init:b},visibility:{refine:true,init:c},autoHide:{check:a,init:true}},members:{_applyVisibility:function(g,h){qx.ui.container.Composite.prototype._applyVisibility.call(this,g,h);
var i=qx.ui.popup.Manager.getInstance();
g===d?i.add(this):i.remove(this);
}},destruct:function(){qx.ui.popup.Manager.getInstance().remove(this);
}});
})();
(function(){var q="atom",p="Integer",o="String",n="_applyRich",m="qx.ui.tooltip.ToolTip",l="_applyIcon",k="tooltip",j="qx.ui.core.Widget",i="mouseover",h="Boolean",g="_applyLabel";
qx.Class.define(m,{extend:qx.ui.popup.Popup,construct:function(x,y){qx.ui.popup.Popup.call(this);
this.setLayout(new qx.ui.layout.Grow);
this._createChildControl(q);
if(x!=null){this.setLabel(x);
}
if(y!=null){this.setIcon(y);
}this.addListener(i,this._onMouseOver,this);
},properties:{appearance:{refine:true,init:k},showTimeout:{check:p,init:700,themeable:true},hideTimeout:{check:p,init:4000,themeable:true},label:{check:o,nullable:true,apply:g},icon:{check:o,nullable:true,apply:l,themeable:true},rich:{check:h,init:false,apply:n},opener:{check:j,nullable:true}},members:{_createChildControlImpl:function(a){var b;

switch(a){case q:b=new qx.ui.basic.Atom;
this._add(b);
break;
}return b||qx.ui.popup.Popup.prototype._createChildControlImpl.call(this,a);
},_onMouseOver:function(e){this.hide();
},_applyIcon:function(r,s){var t=this.getChildControl(q);
r==null?t.resetIcon:t.setIcon(r);
},_applyLabel:function(u,v){var w=this.getChildControl(q);
u==null?w.resetLabel():w.setLabel(u);
},_applyRich:function(c,d){var f=this.getChildControl(q);
f.setRich(c);
}}});
})();
(function(){var b="qx.ui.core.queue.Layout",a="layout";
qx.Class.define(b,{statics:{__es:{},remove:function(c){delete this.__es[c.$$hash];
},add:function(A){this.__es[A.$$hash]=A;
qx.ui.core.queue.Manager.scheduleFlush(a);
},flush:function(){var d=this.__ev();
for(var i=d.length-1;i>=0;i--){var e=d[i];
if(e.hasValidLayout()){continue;
}if(e.isRootWidget()&&!e.hasUserBounds()){var g=e.getSizeHint();
e.renderLayout(0,0,g.width,g.height);
}else{var f=e.getBounds();
e.renderLayout(f.left,f.top,f.width,f.height);
}}},getNestingLevel:function(q){var r=this.__eu;
var t=0;
var parent=q;
while(true){if(r[parent.$$hash]!=null){t+=r[parent.$$hash];
break;
}
if(!parent.$$parent){break;
}parent=parent.$$parent;
t+=1;
}var s=t;

while(q&&q!==parent){r[q.$$hash]=s--;
q=q.$$parent;
}return t;
},__et:function(){var z=qx.ui.core.queue.Visibility;
this.__eu={};
var y=[];
var x=this.__es;
var u,w;

for(var v in x){u=x[v];

if(z.isVisible(u)){w=this.getNestingLevel(u);
if(!y[w]){y[w]={};
}y[w][v]=u;
delete x[v];
}}return y;
},__ev:function(){var l=[];
var n=this.__et();

for(var k=n.length-1;k>=0;k--){if(!n[k]){continue;
}
for(var j in n[k]){var h=n[k][j];
if(k==0||h.isRootWidget()||h.hasUserBounds()){l.push(h);
h.invalidateLayoutCache();
continue;
}var p=h.getSizeHint(false);

if(p){h.invalidateLayoutCache();
var m=h.getSizeHint();
var o=(!h.getBounds()||p.minWidth!==m.minWidth||p.width!==m.width||p.maxWidth!==m.maxWidth||p.minHeight!==m.minHeight||p.height!==m.height||p.maxHeight!==m.maxHeight);
}else{o=true;
}
if(o){var parent=h.getLayoutParent();

if(!n[k-1]){n[k-1]={};
}n[k-1][parent.$$hash]=parent;
}else{l.push(h);
}}}return l;
}}});
})();
(function(){var g="qx.event.handler.UserAction";
qx.Class.define(g,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(j){qx.core.Object.call(this);
this.__ew=j;
this.__ex=j.getWindow();
},statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{useraction:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_WINDOW,IGNORE_CAN_HANDLE:true},members:{__ew:null,__ex:null,canHandleEvent:function(h,i){},registerEvent:function(a,b,c){},unregisterEvent:function(d,e,f){}},destruct:function(){this.__ew=this.__ex=null;
},defer:function(k){qx.event.Registration.addHandler(k);
}});
})();
(function(){var d="qx.util.DeferredCallManager",c="singleton";
qx.Class.define(d,{extend:qx.core.Object,type:c,construct:function(){this.__ey={};
this.__ez=qx.lang.Function.bind(this.__eD,this);
this.__eA=false;
},members:{__eB:null,__eC:null,__ey:null,__eA:null,__ez:null,schedule:function(e){if(this.__eB==null){this.__eB=window.setTimeout(this.__ez,0);
}var f=e.toHashCode();
if(this.__eC&&this.__eC[f]){return;
}this.__ey[f]=e;
this.__eA=true;
},cancel:function(a){var b=a.toHashCode();
if(this.__eC&&this.__eC[b]){this.__eC[b]=null;
return;
}delete this.__ey[b];
if(qx.lang.Object.isEmpty(this.__ey)&&this.__eB!=null){window.clearTimeout(this.__eB);
this.__eB=null;
}},__eD:qx.event.GlobalError.observeMethod(function(){this.__eB=null;
while(this.__eA){this.__eC=qx.lang.Object.clone(this.__ey);
this.__ey={};
this.__eA=false;

for(var h in this.__eC){var g=this.__eC[h];

if(g){this.__eC[h]=null;
g.call();
}}}this.__eC=null;
})},destruct:function(){if(this.__eB!=null){window.clearTimeout(this.__eB);
}this.__ez=this.__ey=null;
}});
})();
(function(){var a="qx.util.DeferredCall";
qx.Class.define(a,{extend:qx.core.Object,construct:function(b,c){qx.core.Object.call(this);
this.__eE=b;
this.__eF=c||null;
this.__eG=qx.util.DeferredCallManager.getInstance();
},members:{__eE:null,__eF:null,__eG:null,cancel:function(){this.__eG.cancel(this);
},schedule:function(){this.__eG.schedule(this);
},call:function(){this.__eF?this.__eE.apply(this.__eF):this.__eE();
}},destruct:function(d,e){this.cancel();
this.__eF=this.__eE=this.__eG=null;
}});
})();
(function(){var cX="element",cW="qx.client",cV="qxSelectable",cU="off",cT="on",cS="div",cR="",cQ="mshtml",cP="none",cO="scroll",ds="text",dr="qx.html.Element",dq="|capture|",dp="activate",dn="blur",dm="deactivate",dl="capture",dk="userSelect",dj="__fe",di="-moz-none",dg="visible",dh="releaseCapture",de="|bubble|",df="tabIndex",dc="focus",dd="MozUserSelect",cY="normal",da="hidden";
qx.Class.define(dr,{extend:qx.core.Object,construct:function(cK,cL,cM){qx.core.Object.call(this);
this.__eH=cK||cS;
this.__eI=cL||null;
this.__eJ=cM||null;
},statics:{DEBUG:false,_modified:{},_visibility:{},_scroll:{},_actions:[],__eK:{},_scheduleFlush:function(T){qx.html.Element.__fp.schedule();
},flush:function(){var dK;
{};
var dC=this.__eL();
var dB=dC.getFocus();

if(dB&&this.__eP(dB)){dC.blur(dB);
}var dR=dC.getActive();

if(dR&&this.__eP(dR)){qx.bom.Element.deactivate(dR);
}var dF=this.__eN();

if(dF&&this.__eP(dF)){qx.bom.Element.releaseCapture(dF);
}var dL=[];
var dM=this._modified;

for(var dJ in dM){dK=dM[dJ];
if(dK.__fi()){if(dK.__eQ&&qx.dom.Hierarchy.isRendered(dK.__eQ)){dL.push(dK);
}else{{};
dK.__fh();
}delete dM[dJ];
}}
for(var i=0,l=dL.length;i<l;i++){dK=dL[i];
{};
dK.__fh();
}var dH=this._visibility;

for(var dJ in dH){dK=dH[dJ];
var dN=dK.__eQ;

if(!dN){delete dH[dJ];
continue;
}{};
if(!dK.$$disposed){dN.style.display=dK.__eT?cR:cP;
if(qx.core.Variant.isSet(cW,cQ)){if(!(document.documentMode>=8)){dN.style.visibility=dK.__eT?dg:da;
}}}delete dH[dJ];
}var scroll=this._scroll;

for(var dJ in scroll){dK=scroll[dJ];
var dS=dK.__eQ;

if(dS&&dS.offsetWidth){var dE=true;
if(dK.__eW!=null){dK.__eQ.scrollLeft=dK.__eW;
delete dK.__eW;
}if(dK.__eX!=null){dK.__eQ.scrollTop=dK.__eX;
delete dK.__eX;
}var dO=dK.__eU;

if(dO!=null){var dI=dO.element.getDomElement();

if(dI&&dI.offsetWidth){qx.bom.element.Scroll.intoViewX(dI,dS,dO.align);
delete dK.__eU;
}else{dE=false;
}}var dP=dK.__eV;

if(dP!=null){var dI=dP.element.getDomElement();

if(dI&&dI.offsetWidth){qx.bom.element.Scroll.intoViewY(dI,dS,dP.align);
delete dK.__eV;
}else{dE=false;
}}if(dE){delete scroll[dJ];
}}}var dD={"releaseCapture":1,"blur":1,"deactivate":1};
for(var i=0;i<this._actions.length;i++){var dQ=this._actions[i];
var dN=dQ.element.__eQ;

if(!dN||!dD[dQ.type]&&!dQ.element.__fi()){continue;
}var dG=dQ.args;
dG.unshift(dN);
qx.bom.Element[dQ.type].apply(qx.bom.Element,dG);
}this._actions=[];
for(var dJ in this.__eK){var dA=this.__eK[dJ];
var dS=dA.element.__eQ;

if(dS){qx.bom.Selection.set(dS,dA.start,dA.end);
delete this.__eK[dJ];
}}qx.event.handler.Appear.refresh();
},__eL:function(){if(!this.__eM){var cI=qx.event.Registration.getManager(window);
this.__eM=cI.getHandler(qx.event.handler.Focus);
}return this.__eM;
},__eN:function(){if(!this.__eO){var cD=qx.event.Registration.getManager(window);
this.__eO=cD.getDispatcher(qx.event.dispatch.MouseCapture);
}return this.__eO.getCaptureElement();
},__eP:function(cv){var cw=qx.core.ObjectRegistry.fromHashCode(cv.$$element);
return cw&&!cw.__fi();
}},members:{__eH:null,__eQ:null,__eR:false,__eS:true,__eT:true,__eU:null,__eV:null,__eW:null,__eX:null,__eY:null,__fa:null,__fb:null,__eI:null,__eJ:null,__fc:null,__fd:null,__fe:null,__ff:null,__fg:null,_scheduleChildrenUpdate:function(){if(this.__ff){return;
}this.__ff=true;
qx.html.Element._modified[this.$$hash]=this;
qx.html.Element._scheduleFlush(cX);
},_createDomElement:function(){return qx.bom.Element.create(this.__eH);
},__fh:function(){{};
var dT=this.__fe;

if(dT){var length=dT.length;
var dU;

for(var i=0;i<length;i++){dU=dT[i];

if(dU.__eT&&dU.__eS&&!dU.__eQ){dU.__fh();
}}}
if(!this.__eQ){this.__eQ=this._createDomElement();
this.__eQ.$$element=this.$$hash;
this._copyData(false);

if(dT&&length>0){this._insertChildren();
}}else{this._syncData();

if(this.__ff){this._syncChildren();
}}delete this.__ff;
},_insertChildren:function(){var bg=this.__fe;
var length=bg.length;
var bi;

if(length>2){var bh=document.createDocumentFragment();

for(var i=0;i<length;i++){bi=bg[i];

if(bi.__eQ&&bi.__eS){bh.appendChild(bi.__eQ);
}}this.__eQ.appendChild(bh);
}else{var bh=this.__eQ;

for(var i=0;i<length;i++){bi=bg[i];

if(bi.__eQ&&bi.__eS){bh.appendChild(bi.__eQ);
}}}},_syncChildren:function(){var bK;
var bP=qx.core.ObjectRegistry;
var bG=this.__fe;
var bN=bG.length;
var bH;
var bL;
var bJ=this.__eQ;
var bM=bJ.childNodes;
var bI=0;
var bO;
{};
for(var i=bM.length-1;i>=0;i--){bO=bM[i];
bL=bP.fromHashCode(bO.$$element);

if(!bL||!bL.__eS||bL.__fg!==this){bJ.removeChild(bO);
{};
}}for(var i=0;i<bN;i++){bH=bG[i];
if(bH.__eS){bL=bH.__eQ;
bO=bM[bI];

if(!bL){continue;
}if(bL!=bO){if(bO){bJ.insertBefore(bL,bO);
}else{bJ.appendChild(bL);
}{};
}bI++;
}}{};
},_copyData:function(K){var O=this.__eQ;
var N=this.__eJ;

if(N){var L=qx.bom.element.Attribute;

for(var P in N){L.set(O,P,N[P]);
}}var N=this.__eI;

if(N){var M=qx.bom.element.Style;

if(K){M.setStyles(O,N);
}else{M.setCss(O,M.compile(N));
}}var N=this.__fc;

if(N){for(var P in N){this._applyProperty(P,N[P]);
}}var N=this.__fd;

if(N){qx.event.Registration.getManager(O).importListeners(O,N);
delete this.__fd;
}},_syncData:function(){var w=this.__eQ;
var v=qx.bom.element.Attribute;
var t=qx.bom.element.Style;
var u=this.__fa;

if(u){var B=this.__eJ;

if(B){var z;

for(var A in u){z=B[A];

if(z!==undefined){v.set(w,A,z);
}else{v.reset(w,A);
}}}this.__fa=null;
}var u=this.__eY;

if(u){var B=this.__eI;

if(B){var s={};

for(var A in u){s[A]=B[A];
}t.setStyles(w,s);
}this.__eY=null;
}var u=this.__fb;

if(u){var B=this.__fc;

if(B){var z;

for(var A in u){this._applyProperty(A,B[A]);
}}this.__fb=null;
}},__fi:function(){var a=this;
while(a){if(a.__eR){return true;
}
if(!a.__eS||!a.__eT){return false;
}a=a.__fg;
}return false;
},__fj:function(J){if(J.__fg===this){throw new Error("Child is already in: "+J);
}
if(J.__eR){throw new Error("Root elements could not be inserted into other ones.");
}if(J.__fg){J.__fg.remove(J);
}J.__fg=this;
if(!this.__fe){this.__fe=[];
}if(this.__eQ){this._scheduleChildrenUpdate();
}},__fk:function(cy){if(cy.__fg!==this){throw new Error("Has no child: "+cy);
}if(this.__eQ){this._scheduleChildrenUpdate();
}delete cy.__fg;
},__fl:function(cF){if(cF.__fg!==this){throw new Error("Has no child: "+cF);
}if(this.__eQ){this._scheduleChildrenUpdate();
}},getChildren:function(){return this.__fe||null;
},getChild:function(ch){var ci=this.__fe;
return ci&&ci[ch]||null;
},hasChildren:function(){var f=this.__fe;
return f&&f[0]!==undefined;
},indexOf:function(cq){var cr=this.__fe;
return cr?cr.indexOf(cq):-1;
},hasChild:function(dy){var dz=this.__fe;
return dz&&dz.indexOf(dy)!==-1;
},add:function(bk){if(arguments[1]){for(var i=0,l=arguments.length;i<l;i++){this.__fj(arguments[i]);
}this.__fe.push.apply(this.__fe,arguments);
}else{this.__fj(bk);
this.__fe.push(bk);
}return this;
},addAt:function(Y,ba){this.__fj(Y);
qx.lang.Array.insertAt(this.__fe,Y,ba);
return this;
},remove:function(cs){var ct=this.__fe;

if(!ct){return;
}
if(arguments[1]){var cu;

for(var i=0,l=arguments.length;i<l;i++){cu=arguments[i];
this.__fk(cu);
qx.lang.Array.remove(ct,cu);
}}else{this.__fk(cs);
qx.lang.Array.remove(ct,cs);
}return this;
},removeAt:function(bs){var bt=this.__fe;

if(!bt){throw new Error("Has no children!");
}var bu=bt[bs];

if(!bu){throw new Error("Has no child at this position!");
}this.__fk(bu);
qx.lang.Array.removeAt(this.__fe,bs);
return this;
},removeAll:function(){var dY=this.__fe;

if(dY){for(var i=0,l=dY.length;i<l;i++){this.__fk(dY[i]);
}dY.length=0;
}return this;
},getParent:function(){return this.__fg||null;
},insertInto:function(parent,R){parent.__fj(this);

if(R==null){parent.__fe.push(this);
}else{qx.lang.Array.insertAt(this.__fe,this,R);
}return this;
},insertBefore:function(bm){var parent=bm.__fg;
parent.__fj(this);
qx.lang.Array.insertBefore(parent.__fe,this,bm);
return this;
},insertAfter:function(bp){var parent=bp.__fg;
parent.__fj(this);
qx.lang.Array.insertAfter(parent.__fe,this,bp);
return this;
},moveTo:function(bq){var parent=this.__fg;
parent.__fl(this);
var br=parent.__fe.indexOf(this);

if(br===bq){throw new Error("Could not move to same index!");
}else if(br<bq){bq--;
}qx.lang.Array.removeAt(parent.__fe,br);
qx.lang.Array.insertAt(parent.__fe,this,bq);
return this;
},moveBefore:function(S){var parent=this.__fg;
return this.moveTo(parent.__fe.indexOf(S));
},moveAfter:function(W){var parent=this.__fg;
return this.moveTo(parent.__fe.indexOf(W)+1);
},free:function(){var parent=this.__fg;

if(!parent){throw new Error("Has no parent to remove from.");
}
if(!parent.__fe){return;
}parent.__fk(this);
qx.lang.Array.remove(parent.__fe,this);
return this;
},getDomElement:function(){return this.__eQ||null;
},getNodeName:function(){return this.__eH;
},setNodeName:function(name){this.__eH=name;
},setRoot:function(bf){this.__eR=bf;
},useMarkup:function(dw){if(this.__eQ){throw new Error("Could not overwrite existing element!");
}if(qx.core.Variant.isSet(cW,cQ)){var dx=document.createElement(cS);
}else{var dx=qx.bom.Element.getHelperElement();
}dx.innerHTML=dw;
this.useElement(dx.firstChild);
return this.__eQ;
},useElement:function(bn){if(this.__eQ){throw new Error("Could not overwrite existing element!");
}this.__eQ=bn;
this.__eQ.$$element=this.$$hash;
this._copyData(true);
},isFocusable:function(){var r=this.getAttribute(df);

if(r>=1){return true;
}var q=qx.event.handler.Focus.FOCUSABLE_ELEMENTS;

if(r>=0&&q[this.__eH]){return true;
}return false;
},setSelectable:qx.core.Variant.select(cW,{"webkit":function(eb){this.setAttribute(cV,eb?cT:cU);
this.setStyle(dk,eb?cY:cP);
},"gecko":function(cE){this.setAttribute(cV,cE?cT:cU);
this.setStyle(dd,cE?ds:di);
},"default":function(bo){this.setAttribute(cV,bo?cT:cU);
}}),isNativelyFocusable:function(){return !!qx.event.handler.Focus.FOCUSABLE_ELEMENTS[this.__eH];
},include:function(){if(this.__eS){return;
}delete this.__eS;

if(this.__fg){this.__fg._scheduleChildrenUpdate();
}return this;
},exclude:function(){if(!this.__eS){return;
}this.__eS=false;

if(this.__fg){this.__fg._scheduleChildrenUpdate();
}return this;
},isIncluded:function(){return this.__eS===true;
},show:function(){if(this.__eT){return;
}
if(this.__eQ){qx.html.Element._visibility[this.$$hash]=this;
qx.html.Element._scheduleFlush(cX);
}if(this.__fg){this.__fg._scheduleChildrenUpdate();
}delete this.__eT;
},hide:function(){if(!this.__eT){return;
}
if(this.__eQ){qx.html.Element._visibility[this.$$hash]=this;
qx.html.Element._scheduleFlush(cX);
}this.__eT=false;
},isVisible:function(){return this.__eT===true;
},scrollChildIntoViewX:function(bz,bA,bB){var bC=this.__eQ;
var bD=bz.getDomElement();

if(bB!==false&&bC&&bC.offsetWidth&&bD&&bD.offsetWidth){qx.bom.element.Scroll.intoViewX(bD,bC,bA);
}else{this.__eU={element:bz,align:bA};
qx.html.Element._scroll[this.$$hash]=this;
qx.html.Element._scheduleFlush(cX);
}delete this.__eW;
},scrollChildIntoViewY:function(cc,cd,ce){var cf=this.__eQ;
var cg=cc.getDomElement();

if(ce!==false&&cf&&cf.offsetWidth&&cg&&cg.offsetWidth){qx.bom.element.Scroll.intoViewY(cg,cf,cd);
}else{this.__eV={element:cc,align:cd};
qx.html.Element._scroll[this.$$hash]=this;
qx.html.Element._scheduleFlush(cX);
}delete this.__eX;
},scrollToX:function(x,n){var o=this.__eQ;

if(n!==true&&o&&o.offsetWidth){o.scrollLeft=x;
}else{this.__eW=x;
qx.html.Element._scroll[this.$$hash]=this;
qx.html.Element._scheduleFlush(cX);
}delete this.__eU;
},getScrollX:function(){var ea=this.__eQ;

if(ea){return ea.scrollLeft;
}return this.__eW||0;
},scrollToY:function(y,du){var dv=this.__eQ;

if(du!==true&&dv&&dv.offsetWidth){dv.scrollTop=y;
}else{this.__eX=y;
qx.html.Element._scroll[this.$$hash]=this;
qx.html.Element._scheduleFlush(cX);
}delete this.__eV;
},getScrollY:function(){var cx=this.__eQ;

if(cx){return cx.scrollTop;
}return this.__eX||0;
},disableScrolling:function(){this.enableScrolling();
this.scrollToX(0);
this.scrollToY(0);
this.addListener(cO,this.__fn,this);
},enableScrolling:function(){this.removeListener(cO,this.__fn,this);
},__fm:null,__fn:function(e){if(!this.__fm){this.__fm=true;
this.__eQ.scrollTop=0;
this.__eQ.scrollLeft=0;
delete this.__fm;
}},getTextSelection:function(){var X=this.__eQ;

if(X){return qx.bom.Selection.get(X);
}return null;
},getTextSelectionLength:function(){var p=this.__eQ;

if(p){return qx.bom.Selection.getLength(p);
}return null;
},getTextSelectionStart:function(){var cz=this.__eQ;

if(cz){return qx.bom.Selection.getStart(cz);
}return null;
},getTextSelectionEnd:function(){var Q=this.__eQ;

if(Q){return qx.bom.Selection.getEnd(Q);
}return null;
},setTextSelection:function(b,c){var d=this.__eQ;

if(d){qx.bom.Selection.set(d,b,c);
return;
}qx.html.Element.__eK[this.toHashCode()]={element:this,start:b,end:c};
qx.html.Element._scheduleFlush(cX);
},clearTextSelection:function(){var by=this.__eQ;

if(by){qx.bom.Selection.clear(by);
}delete qx.html.Element.__eK[this.toHashCode()];
},__fo:function(dV,dW){var dX=qx.html.Element._actions;
dX.push({type:dV,element:this,args:dW||[]});
qx.html.Element._scheduleFlush(cX);
},focus:function(){this.__fo(dc);
},blur:function(){this.__fo(dn);
},activate:function(){this.__fo(dp);
},deactivate:function(){this.__fo(dm);
},capture:function(C){this.__fo(dl,[C!==false]);
},releaseCapture:function(){this.__fo(dh);
},setStyle:function(bc,bd,be){if(!this.__eI){this.__eI={};
}
if(this.__eI[bc]==bd){return;
}
if(bd==null){delete this.__eI[bc];
}else{this.__eI[bc]=bd;
}if(this.__eQ){if(be){qx.bom.element.Style.set(this.__eQ,bc,bd);
return this;
}if(!this.__eY){this.__eY={};
}this.__eY[bc]=true;
qx.html.Element._modified[this.$$hash]=this;
qx.html.Element._scheduleFlush(cX);
}return this;
},setStyles:function(bQ,bR){var bS=qx.bom.element.Style;

if(!this.__eI){this.__eI={};
}
if(this.__eQ){if(!this.__eY){this.__eY={};
}
for(var bU in bQ){var bT=bQ[bU];

if(this.__eI[bU]==bT){continue;
}
if(bT==null){delete this.__eI[bU];
}else{this.__eI[bU]=bT;
}if(bR){bS.set(this.__eQ,bU,bT);
continue;
}this.__eY[bU]=true;
}qx.html.Element._modified[this.$$hash]=this;
qx.html.Element._scheduleFlush(cX);
}else{for(var bU in bQ){var bT=bQ[bU];

if(this.__eI[bU]==bT){continue;
}
if(bT==null){delete this.__eI[bU];
}else{this.__eI[bU]=bT;
}}}return this;
},removeStyle:function(cG,cH){this.setStyle(cG,null,cH);
},getStyle:function(bl){return this.__eI?this.__eI[bl]:null;
},getAllStyles:function(){return this.__eI||null;
},setAttribute:function(bv,bw,bx){if(!this.__eJ){this.__eJ={};
}
if(this.__eJ[bv]==bw){return;
}
if(bw==null){delete this.__eJ[bv];
}else{this.__eJ[bv]=bw;
}if(this.__eQ){if(bx){qx.bom.element.Attribute.set(this.__eQ,bv,bw);
return this;
}if(!this.__fa){this.__fa={};
}this.__fa[bv]=true;
qx.html.Element._modified[this.$$hash]=this;
qx.html.Element._scheduleFlush(cX);
}return this;
},setAttributes:function(G,H){for(var I in G){this.setAttribute(I,G[I],H);
}return this;
},removeAttribute:function(U,V){this.setAttribute(U,null,V);
},getAttribute:function(dt){return this.__eJ?this.__eJ[dt]:null;
},_applyProperty:function(name,bb){},_setProperty:function(cA,cB,cC){if(!this.__fc){this.__fc={};
}
if(this.__fc[cA]==cB){return;
}
if(cB==null){delete this.__fc[cA];
}else{this.__fc[cA]=cB;
}if(this.__eQ){if(cC){this._applyProperty(cA,cB);
return this;
}if(!this.__fb){this.__fb={};
}this.__fb[cA]=true;
qx.html.Element._modified[this.$$hash]=this;
qx.html.Element._scheduleFlush(cX);
}return this;
},_removeProperty:function(bE,bF){this._setProperty(bE,null,bF);
},_getProperty:function(D){var E=this.__fc;

if(!E){return null;
}var F=E[D];
return F==null?null:F;
},addListener:function(bV,bW,self,bX){var bY;

if(this.$$disposed){return null;
}{};

if(this.__eQ){return qx.event.Registration.addListener(this.__eQ,bV,bW,self,bX);
}
if(!this.__fd){this.__fd={};
}
if(bX==null){bX=false;
}var ca=qx.event.Manager.getNextUniqueId();
var cb=bV+(bX?dq:de)+ca;
this.__fd[cb]={type:bV,listener:bW,self:self,capture:bX,unique:ca};
return cb;
},removeListener:function(cj,ck,self,cl){var cm;

if(this.$$disposed){return null;
}{};

if(this.__eQ){qx.event.Registration.removeListener(this.__eQ,cj,ck,self,cl);
}else{var co=this.__fd;
var cn;

if(cl==null){cl=false;
}
for(var cp in co){cn=co[cp];
if(cn.listener===ck&&cn.self===self&&cn.capture===cl&&cn.type===cj){delete co[cp];
break;
}}}return this;
},removeListenerById:function(cN){if(this.$$disposed){return null;
}
if(this.__eQ){qx.event.Registration.removeListenerById(this.__eQ,cN);
}else{delete this.__fd[cN];
}return this;
},hasListener:function(g,h){if(this.$$disposed){return false;
}
if(this.__eQ){return qx.event.Registration.hasListener(this.__eQ,g,h);
}var k=this.__fd;
var j;

if(h==null){h=false;
}
for(var m in k){j=k[m];
if(j.capture===h&&j.type===g){return true;
}}return false;
}},defer:function(cJ){cJ.__fp=new qx.util.DeferredCall(cJ.flush,cJ);
},destruct:function(){var bj=this.__eQ;

if(bj){qx.event.Registration.getManager(bj).removeAllListeners(bj);
bj.$$element=cR;
}
if(!qx.core.ObjectRegistry.inShutDown){var parent=this.__fg;

if(parent&&!parent.$$disposed){parent.remove(this);
}}this._disposeArray(dj);
this.__eJ=this.__eI=this.__fd=this.__fc=this.__fa=this.__eY=this.__fb=this.__eQ=this.__fg=this.__eU=this.__eV=null;
}});
})();
(function(){var c="qx.ui.core.queue.Manager",b="useraction";
qx.Class.define(c,{statics:{__fq:false,__fr:{},__fs:0,MAX_RETRIES:10,scheduleFlush:function(h){var self=qx.ui.core.queue.Manager;
self.__fr[h]=true;

if(!self.__fq){self.__fv.schedule();
self.__fq=true;
}},flush:function(){var self=qx.ui.core.queue.Manager;
if(self.__ft){return;
}self.__ft=true;
self.__fv.cancel();
var a=self.__fr;
self.__fu(function(){while(a.visibility||a.widget||a.appearance||a.layout||a.element){if(a.widget){delete a.widget;
qx.ui.core.queue.Widget.flush();
}
if(a.visibility){delete a.visibility;
qx.ui.core.queue.Visibility.flush();
}
if(a.appearance){delete a.appearance;
qx.ui.core.queue.Appearance.flush();
}if(a.widget||a.visibility||a.appearance){continue;
}
if(a.layout){delete a.layout;
qx.ui.core.queue.Layout.flush();
}if(a.widget||a.visibility||a.appearance||a.layout){continue;
}
if(a.element){delete a.element;
qx.html.Element.flush();
}}},function(){self.__fq=false;
});
self.__fu(function(){if(a.dispose){delete a.dispose;
qx.ui.core.queue.Dispose.flush();
}},function(){self.__ft=false;
});
self.__fs=0;
},__fu:function(f,g){var self=qx.ui.core.queue.Manager;

try{f();
}catch(e){{};
self.__fq=false;
self.__ft=false;
self.__fs+=1;

if(self.__fs<=self.MAX_RETRIES){self.scheduleFlush();
}else{throw new Error("Fatal Error: Flush terminated "+(self.__fs-1)+" times in a row"+" due to exceptions in user code. The application has to be reloaded!");
}throw e;
}finally{g();
}}},defer:function(d){d.__fv=new qx.util.DeferredCall(d.flush);
qx.html.Element._scheduleFlush=d.scheduleFlush;
qx.event.Registration.addListener(window,b,d.flush);
}});
})();
(function(){var b="abstract",a="qx.event.dispatch.AbstractBubbling";
qx.Class.define(a,{extend:qx.core.Object,implement:qx.event.IEventDispatcher,type:b,construct:function(f){this._manager=f;
},members:{_getParent:function(c){throw new Error("Missing implementation");
},canDispatchEvent:function(d,event,e){return event.getBubbles();
},dispatchEvent:function(g,event,h){var parent=g;
var s=this._manager;
var p,w;
var n;
var r,u;
var t;
var v=[];
p=s.getListeners(g,h,true);
w=s.getListeners(g,h,false);

if(p){v.push(p);
}
if(w){v.push(w);
}var parent=this._getParent(g);
var l=[];
var k=[];
var m=[];
var q=[];
while(parent!=null){p=s.getListeners(parent,h,true);

if(p){m.push(p);
q.push(parent);
}w=s.getListeners(parent,h,false);

if(w){l.push(w);
k.push(parent);
}parent=this._getParent(parent);
}event.setEventPhase(qx.event.type.Event.CAPTURING_PHASE);

for(var i=m.length-1;i>=0;i--){t=q[i];
event.setCurrentTarget(t);
n=m[i];

for(var j=0,o=n.length;j<o;j++){r=n[j];
u=r.context||t;
r.handler.call(u,event);
}
if(event.getPropagationStopped()){return;
}}event.setEventPhase(qx.event.type.Event.AT_TARGET);
event.setCurrentTarget(g);

for(var i=0,x=v.length;i<x;i++){n=v[i];

for(var j=0,o=n.length;j<o;j++){r=n[j];
u=r.context||g;
r.handler.call(u,event);
}
if(event.getPropagationStopped()){return;
}}event.setEventPhase(qx.event.type.Event.BUBBLING_PHASE);

for(var i=0,x=l.length;i<x;i++){t=k[i];
event.setCurrentTarget(t);
n=l[i];

for(var j=0,o=n.length;j<o;j++){r=n[j];
u=r.context||t;
r.handler.call(u,event);
}
if(event.getPropagationStopped()){return;
}}}}});
})();
(function(){var a="qx.event.dispatch.DomBubbling";
qx.Class.define(a,{extend:qx.event.dispatch.AbstractBubbling,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL},members:{_getParent:function(e){return e.parentNode;
},canDispatchEvent:function(c,event,d){return c.nodeType!==undefined&&event.getBubbles();
}},defer:function(b){qx.event.Registration.addDispatcher(b);
}});
})();
(function(){var m="keydown",l="qx.client",k="keypress",j="NumLock",i="keyup",h="Enter",g="0",f="9",e="-",d="PageUp",bt="+",bs="PrintScreen",br="gecko",bq="A",bp="Z",bo="Left",bn="F5",bm="Down",bl="Up",bk="F11",t="F6",u="useraction",r="F3",s="keyinput",p="Insert",q="F8",n="End",o="/",B="Delete",C="*",O="F1",K="F4",W="Home",R="F2",bg="F12",bc="PageDown",G="F7",bj="F9",bi="F10",bh="Right",F="text",I="Escape",J="webkit",M="5",P="3",S="Meta",Y="7",be="CapsLock",v="input",w="Control",H="Space",V="Tab",U="Shift",T="Pause",bb="Unidentified",ba="qx.event.handler.Keyboard",Q="mshtml",X="mshtml|webkit",a="6",bd="off",x="Apps",y="4",L="Alt",b="2",c="Scroll",E="1",z="8",A="Win",D="autoComplete",N=",",bf="Backspace";
qx.Class.define(ba,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(bR){qx.core.Object.call(this);
this.__fw=bR;
this.__fx=bR.getWindow();
if(qx.core.Variant.isSet(l,br)){this.__fy=this.__fx;
}else{this.__fy=this.__fx.document.documentElement;
}this.__fz={};
this._initKeyObserver();
},statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{keyup:1,keydown:1,keypress:1,keyinput:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:true,isValidKeyIdentifier:function(bI){if(this._identifierToKeyCodeMap[bI]){return true;
}
if(bI.length!=1){return false;
}
if(bI>=g&&bI<=f){return true;
}
if(bI>=bq&&bI<=bp){return true;
}
switch(bI){case bt:case e:case C:case o:return true;
default:return false;
}}},members:{__fA:null,__fw:null,__fx:null,__fy:null,__fz:null,__fB:null,__fC:null,__fD:null,canHandleEvent:function(bS,bT){},registerEvent:function(cl,cm,cn){},unregisterEvent:function(cE,cF,cG){},_fireInputEvent:function(bN,bO){var bP=this.__fE();
if(bP&&bP.offsetWidth!=0){var event=qx.event.Registration.createEvent(s,qx.event.type.KeyInput,[bN,bP,bO]);
this.__fw.dispatchEvent(bP,event);
}if(this.__fx){qx.event.Registration.fireEvent(this.__fx,u,qx.event.type.Data,[s]);
}},_fireSequenceEvent:function(bu,bv,bw){var bx=this.__fE();
var by=bu.keyCode;
var event=qx.event.Registration.createEvent(bv,qx.event.type.KeySequence,[bu,bx,bw]);
this.__fw.dispatchEvent(bx,event);
if(qx.core.Variant.isSet(l,X)){if(bv==m&&event.getDefaultPrevented()){if(!this._isNonPrintableKeyCode(by)&&!this._emulateKeyPress[by]){this._fireSequenceEvent(bu,k,bw);
}}}if(this.__fx){qx.event.Registration.fireEvent(this.__fx,u,qx.event.type.Data,[bv]);
}},__fE:function(){var bL=this.__fw.getHandler(qx.event.handler.Focus);
var bM=bL.getActive();
if(!bM||bM.offsetWidth==0){bM=bL.getFocus();
}if(!bM||bM.offsetWidth==0){bM=this.__fw.getWindow().document.body;
}return bM;
},_initKeyObserver:function(){this.__fA=qx.lang.Function.listener(this.__fF,this);
this.__fD=qx.lang.Function.listener(this.__fH,this);
var Event=qx.bom.Event;
Event.addNativeListener(this.__fy,i,this.__fA);
Event.addNativeListener(this.__fy,m,this.__fA);
Event.addNativeListener(this.__fy,k,this.__fD);
},_stopKeyObserver:function(){var Event=qx.bom.Event;
Event.removeNativeListener(this.__fy,i,this.__fA);
Event.removeNativeListener(this.__fy,m,this.__fA);
Event.removeNativeListener(this.__fy,k,this.__fD);

for(var cu in (this.__fC||{})){var ct=this.__fC[cu];
Event.removeNativeListener(ct.target,k,ct.callback);
}delete (this.__fC);
},__fF:qx.event.GlobalError.observeMethod(qx.core.Variant.select(l,{"mshtml":function(bU){bU=window.event||bU;
var bX=bU.keyCode;
var bV=0;
var bW=bU.type;
if(!(this.__fz[bX]==m&&bW==m)){this._idealKeyHandler(bX,bV,bW,bU);
}if(bW==m){if(this._isNonPrintableKeyCode(bX)||this._emulateKeyPress[bX]){this._idealKeyHandler(bX,bV,k,bU);
}}this.__fz[bX]=bW;
},"gecko":function(bz){var bD=this._keyCodeFix[bz.keyCode]||bz.keyCode;
var bB=0;
var bC=bz.type;
if(qx.bom.client.Platform.WIN){var bA=bD?this._keyCodeToIdentifier(bD):this._charCodeToIdentifier(bB);

if(!(this.__fz[bA]==m&&bC==m)){this._idealKeyHandler(bD,bB,bC,bz);
}this.__fz[bA]=bC;
}else{this._idealKeyHandler(bD,bB,bC,bz);
}this.__fG(bz.target,bC,bD);
},"webkit":function(co){var cr=0;
var cp=0;
var cq=co.type;
if(qx.bom.client.Engine.VERSION<525.13){if(cq==i||cq==m){cr=this._charCode2KeyCode[co.charCode]||co.keyCode;
}else{if(this._charCode2KeyCode[co.charCode]){cr=this._charCode2KeyCode[co.charCode];
}else{cp=co.charCode;
}}this._idealKeyHandler(cr,cp,cq,co);
}else{cr=co.keyCode;
if(!(this.__fz[cr]==m&&cq==m)){this._idealKeyHandler(cr,cp,cq,co);
}if(cq==m){if(this._isNonPrintableKeyCode(cr)||this._emulateKeyPress[cr]){this._idealKeyHandler(cr,cp,k,co);
}}this.__fz[cr]=cq;
}},"opera":function(bQ){this.__fB=bQ.keyCode;
this._idealKeyHandler(bQ.keyCode,0,bQ.type,bQ);
}})),__fG:qx.core.Variant.select(l,{"gecko":function(cv,cw,cx){if(cw===m&&(cx==33||cx==34||cx==38||cx==40)&&cv.type==F&&cv.tagName.toLowerCase()===v&&cv.getAttribute(D)!==bd){if(!this.__fC){this.__fC={};
}var cz=qx.core.ObjectRegistry.toHashCode(cv);

if(this.__fC[cz]){return;
}var self=this;
this.__fC[cz]={target:cv,callback:function(cA){qx.bom.Event.stopPropagation(cA);
self.__fH(cA);
}};
var cy=qx.event.GlobalError.observeMethod(this.__fC[cz].callback);
qx.bom.Event.addNativeListener(cv,k,cy);
}},"default":null}),__fH:qx.event.GlobalError.observeMethod(qx.core.Variant.select(l,{"mshtml":function(cH){cH=window.event||cH;

if(this._charCode2KeyCode[cH.keyCode]){this._idealKeyHandler(this._charCode2KeyCode[cH.keyCode],0,cH.type,cH);
}else{this._idealKeyHandler(0,cH.keyCode,cH.type,cH);
}},"gecko":function(bE){var bH=this._keyCodeFix[bE.keyCode]||bE.keyCode;
var bF=bE.charCode;
var bG=bE.type;
this._idealKeyHandler(bH,bF,bG,bE);
},"webkit":function(cI){if(qx.bom.client.Engine.VERSION<525.13){var cL=0;
var cJ=0;
var cK=cI.type;

if(cK==i||cK==m){cL=this._charCode2KeyCode[cI.charCode]||cI.keyCode;
}else{if(this._charCode2KeyCode[cI.charCode]){cL=this._charCode2KeyCode[cI.charCode];
}else{cJ=cI.charCode;
}}this._idealKeyHandler(cL,cJ,cK,cI);
}else{if(this._charCode2KeyCode[cI.keyCode]){this._idealKeyHandler(this._charCode2KeyCode[cI.keyCode],0,cI.type,cI);
}else{this._idealKeyHandler(0,cI.keyCode,cI.type,cI);
}}},"opera":function(cB){var cD=cB.keyCode;
var cC=cB.type;
if(cD!=this.__fB){this._idealKeyHandler(0,this.__fB,cC,cB);
}else{if(this._keyCodeToIdentifierMap[cB.keyCode]){this._idealKeyHandler(cB.keyCode,0,cB.type,cB);
}else{this._idealKeyHandler(0,cB.keyCode,cB.type,cB);
}}}})),_idealKeyHandler:function(cd,ce,cf,cg){var ch;
if(cd||(!cd&&!ce)){ch=this._keyCodeToIdentifier(cd);
this._fireSequenceEvent(cg,cf,ch);
}else{ch=this._charCodeToIdentifier(ce);
this._fireSequenceEvent(cg,k,ch);
this._fireInputEvent(cg,ce);
}},_specialCharCodeMap:{8:bf,9:V,13:h,27:I,32:H},_emulateKeyPress:qx.core.Variant.select(l,{"mshtml":{8:true,9:true},"webkit":{8:true,9:true,27:true},"default":{}}),_keyCodeToIdentifierMap:{16:U,17:w,18:L,20:be,224:S,37:bo,38:bl,39:bh,40:bm,33:d,34:bc,35:n,36:W,45:p,46:B,112:O,113:R,114:r,115:K,116:bn,117:t,118:G,119:q,120:bj,121:bi,122:bk,123:bg,144:j,44:bs,145:c,19:T,91:A,93:x},_numpadToCharCode:{96:g.charCodeAt(0),97:E.charCodeAt(0),98:b.charCodeAt(0),99:P.charCodeAt(0),100:y.charCodeAt(0),101:M.charCodeAt(0),102:a.charCodeAt(0),103:Y.charCodeAt(0),104:z.charCodeAt(0),105:f.charCodeAt(0),106:C.charCodeAt(0),107:bt.charCodeAt(0),109:e.charCodeAt(0),110:N.charCodeAt(0),111:o.charCodeAt(0)},_charCodeA:bq.charCodeAt(0),_charCodeZ:bp.charCodeAt(0),_charCode0:g.charCodeAt(0),_charCode9:f.charCodeAt(0),_isNonPrintableKeyCode:function(ci){return this._keyCodeToIdentifierMap[ci]?true:false;
},_isIdentifiableKeyCode:function(cs){if(cs>=this._charCodeA&&cs<=this._charCodeZ){return true;
}if(cs>=this._charCode0&&cs<=this._charCode9){return true;
}if(this._specialCharCodeMap[cs]){return true;
}if(this._numpadToCharCode[cs]){return true;
}if(this._isNonPrintableKeyCode(cs)){return true;
}return false;
},_keyCodeToIdentifier:function(bJ){if(this._isIdentifiableKeyCode(bJ)){var bK=this._numpadToCharCode[bJ];

if(bK){return String.fromCharCode(bK);
}return (this._keyCodeToIdentifierMap[bJ]||this._specialCharCodeMap[bJ]||String.fromCharCode(bJ));
}else{return bb;
}},_charCodeToIdentifier:function(ck){return this._specialCharCodeMap[ck]||String.fromCharCode(ck).toUpperCase();
},_identifierToKeyCode:function(cj){return qx.event.handler.Keyboard._identifierToKeyCodeMap[cj]||cj.charCodeAt(0);
}},destruct:function(){this._stopKeyObserver();
this.__fB=this.__fw=this.__fx=this.__fy=this.__fz=null;
},defer:function(bY,ca,cb){qx.event.Registration.addHandler(bY);
if(!bY._identifierToKeyCodeMap){bY._identifierToKeyCodeMap={};

for(var cc in ca._keyCodeToIdentifierMap){bY._identifierToKeyCodeMap[ca._keyCodeToIdentifierMap[cc]]=parseInt(cc,10);
}
for(var cc in ca._specialCharCodeMap){bY._identifierToKeyCodeMap[ca._specialCharCodeMap[cc]]=parseInt(cc,10);
}}
if(qx.core.Variant.isSet(l,Q)){ca._charCode2KeyCode={13:13,27:27};
}else if(qx.core.Variant.isSet(l,br)){ca._keyCodeFix={12:ca._identifierToKeyCode(j)};
}else if(qx.core.Variant.isSet(l,J)){if(qx.bom.client.Engine.VERSION<525.13){ca._charCode2KeyCode={63289:ca._identifierToKeyCode(j),63276:ca._identifierToKeyCode(d),63277:ca._identifierToKeyCode(bc),63275:ca._identifierToKeyCode(n),63273:ca._identifierToKeyCode(W),63234:ca._identifierToKeyCode(bo),63232:ca._identifierToKeyCode(bl),63235:ca._identifierToKeyCode(bh),63233:ca._identifierToKeyCode(bm),63272:ca._identifierToKeyCode(B),63302:ca._identifierToKeyCode(p),63236:ca._identifierToKeyCode(O),63237:ca._identifierToKeyCode(R),63238:ca._identifierToKeyCode(r),63239:ca._identifierToKeyCode(K),63240:ca._identifierToKeyCode(bn),63241:ca._identifierToKeyCode(t),63242:ca._identifierToKeyCode(G),63243:ca._identifierToKeyCode(q),63244:ca._identifierToKeyCode(bj),63245:ca._identifierToKeyCode(bi),63246:ca._identifierToKeyCode(bk),63247:ca._identifierToKeyCode(bg),63248:ca._identifierToKeyCode(bs),3:ca._identifierToKeyCode(h),12:ca._identifierToKeyCode(j),13:ca._identifierToKeyCode(h)};
}else{ca._charCode2KeyCode={13:13,27:27};
}}}});
})();
(function(){var V="qx.client",U="mouseup",T="click",S="mousedown",R="contextmenu",Q="mousewheel",P="dblclick",O="mshtml",N="mouseover",M="mouseout",H="DOMMouseScroll",L="mousemove",K="on",G="mshtml|webkit|opera",F="useraction",J="gecko|webkit",I="qx.event.handler.Mouse";
qx.Class.define(I,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(W){qx.core.Object.call(this);
this.__fI=W;
this.__fJ=W.getWindow();
this.__fK=this.__fJ.document;
this._initButtonObserver();
this._initMoveObserver();
this._initWheelObserver();
},statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{mousemove:1,mouseover:1,mouseout:1,mousedown:1,mouseup:1,click:1,dblclick:1,contextmenu:1,mousewheel:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:true},members:{__fL:null,__fM:null,__fN:null,__fO:null,__fP:null,__fI:null,__fJ:null,__fK:null,canHandleEvent:function(z,A){},registerEvent:qx.bom.client.System.IPHONE?
function(i,j,k){i[K+j]=qx.lang.Function.returnNull;
}:qx.lang.Function.returnNull,unregisterEvent:qx.bom.client.System.IPHONE?
function(t,u,v){t[K+u]=undefined;
}:qx.lang.Function.returnNull,__fQ:function(X,Y,ba){if(!ba){ba=X.target||X.srcElement;
}if(ba&&ba.nodeType){qx.event.Registration.fireEvent(ba,Y||X.type,Y==Q?qx.event.type.MouseWheel:qx.event.type.Mouse,[X,ba,null,true,true]);
}qx.event.Registration.fireEvent(this.__fJ,F,qx.event.type.Data,[Y||X.type]);
},_initButtonObserver:function(){this.__fL=qx.lang.Function.listener(this._onButtonEvent,this);
var Event=qx.bom.Event;
Event.addNativeListener(this.__fK,S,this.__fL);
Event.addNativeListener(this.__fK,U,this.__fL);
Event.addNativeListener(this.__fK,T,this.__fL);
Event.addNativeListener(this.__fK,P,this.__fL);
Event.addNativeListener(this.__fK,R,this.__fL);
},_initMoveObserver:function(){this.__fM=qx.lang.Function.listener(this._onMoveEvent,this);
var Event=qx.bom.Event;
Event.addNativeListener(this.__fK,L,this.__fM);
Event.addNativeListener(this.__fK,N,this.__fM);
Event.addNativeListener(this.__fK,M,this.__fM);
},_initWheelObserver:function(){this.__fN=qx.lang.Function.listener(this._onWheelEvent,this);
var Event=qx.bom.Event;
var d=qx.core.Variant.isSet(V,G)?Q:H;
var e=qx.core.Variant.isSet(V,O)?this.__fK:this.__fJ;
Event.addNativeListener(e,d,this.__fN);
},_stopButtonObserver:function(){var Event=qx.bom.Event;
Event.removeNativeListener(this.__fK,S,this.__fL);
Event.removeNativeListener(this.__fK,U,this.__fL);
Event.removeNativeListener(this.__fK,T,this.__fL);
Event.removeNativeListener(this.__fK,P,this.__fL);
Event.removeNativeListener(this.__fK,R,this.__fL);
},_stopMoveObserver:function(){var Event=qx.bom.Event;
Event.removeNativeListener(this.__fK,L,this.__fM);
Event.removeNativeListener(this.__fK,N,this.__fM);
Event.removeNativeListener(this.__fK,M,this.__fM);
},_stopWheelObserver:function(){var Event=qx.bom.Event;
var b=qx.core.Variant.isSet(V,G)?Q:H;
var c=qx.core.Variant.isSet(V,O)?this.__fK:this.__fJ;
Event.removeNativeListener(c,b,this.__fN);
},_onMoveEvent:qx.event.GlobalError.observeMethod(function(s){this.__fQ(s);
}),_onButtonEvent:qx.event.GlobalError.observeMethod(function(f){var g=f.type;
var h=f.target||f.srcElement;
if(qx.core.Variant.isSet(V,J)){if(h&&h.nodeType==3){h=h.parentNode;
}}
if(this.__fR){this.__fR(f,g,h);
}
if(this.__fT){this.__fT(f,g,h);
}this.__fQ(f,g,h);

if(this.__fS){this.__fS(f,g,h);
}
if(this.__fU){this.__fU(f,g,h);
}this.__fO=g;
}),_onWheelEvent:qx.event.GlobalError.observeMethod(function(a){this.__fQ(a,Q);
}),__fR:qx.core.Variant.select(V,{"webkit":function(w,x,y){if(qx.bom.client.Engine.VERSION<530){if(x==R){this.__fQ(w,U,y);
}}},"default":null}),__fS:qx.core.Variant.select(V,{"opera":function(p,q,r){if(q==U&&p.button==2){this.__fQ(p,R,r);
}},"default":null}),__fT:qx.core.Variant.select(V,{"mshtml":function(B,C,D){if(C==U&&this.__fO==T){this.__fQ(B,S,D);
}else if(C==P){this.__fQ(B,T,D);
}},"default":null}),__fU:qx.core.Variant.select(V,{"mshtml":null,"default":function(l,m,n){switch(m){case S:this.__fP=n;
break;
case U:if(n!==this.__fP){var o=qx.dom.Hierarchy.getCommonParent(n,this.__fP);
this.__fQ(l,T,o);
}}}})},destruct:function(){this._stopButtonObserver();
this._stopMoveObserver();
this._stopWheelObserver();
this.__fI=this.__fJ=this.__fK=this.__fP=null;
},defer:function(E){qx.event.Registration.addHandler(E);
}});
})();
(function(){var c="qx.event.handler.Capture";
qx.Class.define(c,{extend:qx.core.Object,implement:qx.event.IEventHandler,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{capture:true,losecapture:true},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:true},members:{canHandleEvent:function(a,b){},registerEvent:function(h,i,j){},unregisterEvent:function(e,f,g){}},defer:function(d){qx.event.Registration.addHandler(d);
}});
})();
(function(){var P="alias",O="copy",N="blur",M="mouseout",L="keydown",K="Ctrl",J="Shift",I="mousemove",H="move",G="mouseover",bg="Alt",bf="keyup",be="mouseup",bd="dragend",bc="on",bb="mousedown",ba="qxDraggable",Y="drag",X="drop",W="qxDroppable",U="qx.event.handler.DragDrop",V="droprequest",S="dragstart",T="dragchange",Q="dragleave",R="dragover";
qx.Class.define(U,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(A){qx.core.Object.call(this);
this.__fV=A;
this.__fW=A.getWindow().document.documentElement;
this.__fV.addListener(this.__fW,bb,this._onMouseDown,this);
this.__gj();
},statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{dragstart:1,dragend:1,dragover:1,dragleave:1,drop:1,drag:1,dragchange:1,droprequest:1},IGNORE_CAN_HANDLE:true},members:{__fV:null,__fW:null,__fX:null,__fY:null,__ga:null,__gb:null,__gc:null,__gd:null,__ge:null,__gf:null,__gg:false,__gh:0,__gi:0,canHandleEvent:function(v,w){},registerEvent:function(f,g,h){},unregisterEvent:function(B,C,D){},addType:function(z){this.__ga[z]=true;
},addAction:function(F){this.__gb[F]=true;
},supportsType:function(E){return !!this.__ga[E];
},supportsAction:function(bj){return !!this.__gb[bj];
},getData:function(s){if(!this.__gq||!this.__fX){throw new Error("This method must not be used outside the drop event listener!");
}
if(!this.__ga[s]){throw new Error("Unsupported data type: "+s+"!");
}
if(!this.__gd[s]){this.__ge=s;
this.__gl(V,this.__fY,this.__fX,false);
}
if(!this.__gd[s]){throw new Error("Please use a droprequest listener to the drag source to fill the manager with data!");
}return this.__gd[s]||null;
},getCurrentAction:function(){return this.__gf;
},addData:function(bh,bi){this.__gd[bh]=bi;
},getCurrentType:function(){return this.__ge;
},isSessionActive:function(){return this.__gg;
},__gj:function(){this.__ga={};
this.__gb={};
this.__gc={};
this.__gd={};
},__gk:function(){if(this.__fY==null){return;
}var d=this.__gb;
var b=this.__gc;
var c=null;

if(this.__gq){if(b.Shift&&b.Ctrl&&d.alias){c=P;
}else if(b.Shift&&b.Alt&&d.copy){c=O;
}else if(b.Shift&&d.move){c=H;
}else if(b.Alt&&d.alias){c=P;
}else if(b.Ctrl&&d.copy){c=O;
}else if(d.move){c=H;
}else if(d.copy){c=O;
}else if(d.alias){c=P;
}}
if(c!=this.__gf){this.__gf=c;
this.__gl(T,this.__fY,this.__fX,false);
}},__gl:function(i,j,k,l,m){var o=qx.event.Registration;
var n=o.createEvent(i,qx.event.type.Drag,[l,m]);

if(j!==k){n.setRelatedTarget(k);
}return o.dispatchEvent(j,n);
},__gm:function(q){while(q&&q.nodeType==1){if(q.getAttribute(ba)==bc){return q;
}q=q.parentNode;
}return null;
},__gn:function(p){while(p&&p.nodeType==1){if(p.getAttribute(W)==bc){return p;
}p=p.parentNode;
}return null;
},__go:function(){this.__fY=null;
this.__fV.removeListener(this.__fW,I,this._onMouseMove,this,true);
this.__fV.removeListener(this.__fW,be,this._onMouseUp,this,true);
qx.event.Registration.removeListener(window,N,this._onWindowBlur,this);
this.__gj();
},__gp:function(){if(this.__gg){this.__fV.removeListener(this.__fW,G,this._onMouseOver,this,true);
this.__fV.removeListener(this.__fW,M,this._onMouseOut,this,true);
this.__fV.removeListener(this.__fW,L,this._onKeyDown,this,true);
this.__fV.removeListener(this.__fW,bf,this._onKeyUp,this,true);
this.__gl(bd,this.__fY,this.__fX,false);
this.__gg=false;
}this.__gq=false;
this.__fX=null;
this.__go();
},__gq:false,_onWindowBlur:function(e){this.__gp();
},_onKeyDown:function(e){var r=e.getKeyIdentifier();

switch(r){case bg:case K:case J:if(!this.__gc[r]){this.__gc[r]=true;
this.__gk();
}}},_onKeyUp:function(e){var bm=e.getKeyIdentifier();

switch(bm){case bg:case K:case J:if(this.__gc[bm]){this.__gc[bm]=false;
this.__gk();
}}},_onMouseDown:function(e){if(this.__gg){return;
}var bk=this.__gm(e.getTarget());

if(bk){this.__gh=e.getDocumentLeft();
this.__gi=e.getDocumentTop();
this.__fY=bk;
this.__fV.addListener(this.__fW,I,this._onMouseMove,this,true);
this.__fV.addListener(this.__fW,be,this._onMouseUp,this,true);
qx.event.Registration.addListener(window,N,this._onWindowBlur,this);
}},_onMouseUp:function(e){if(this.__gq){this.__gl(X,this.__fX,this.__fY,false,e);
}if(this.__gg){e.stopPropagation();
}this.__gp();
},_onMouseMove:function(e){if(this.__gg){if(!this.__gl(Y,this.__fY,this.__fX,true,e)){this.__gp();
}}else{if(Math.abs(e.getDocumentLeft()-this.__gh)>3||Math.abs(e.getDocumentTop()-this.__gi)>3){if(this.__gl(S,this.__fY,this.__fX,true,e)){this.__gg=true;
this.__fV.addListener(this.__fW,G,this._onMouseOver,this,true);
this.__fV.addListener(this.__fW,M,this._onMouseOut,this,true);
this.__fV.addListener(this.__fW,L,this._onKeyDown,this,true);
this.__fV.addListener(this.__fW,bf,this._onKeyUp,this,true);
var a=this.__gc;
a.Ctrl=e.isCtrlPressed();
a.Shift=e.isShiftPressed();
a.Alt=e.isAltPressed();
this.__gk();
}else{this.__gl(bd,this.__fY,this.__fX,false);
this.__go();
}}}},_onMouseOver:function(e){var x=e.getTarget();
var y=this.__gn(x);

if(y&&y!=this.__fX){this.__gq=this.__gl(R,y,this.__fY,true,e);
this.__fX=y;
this.__gk();
}},_onMouseOut:function(e){var u=this.__gn(e.getTarget());
var t=this.__gn(e.getRelatedTarget());

if(u&&u!==t&&u==this.__fX){this.__gl(Q,this.__fX,t,false,e);
this.__fX=null;
this.__gq=false;
qx.event.Timer.once(this.__gk,this,0);
}}},destruct:function(){this.__fY=this.__fX=this.__fV=this.__fW=this.__ga=this.__gb=this.__gc=this.__gd=null;
},defer:function(bl){qx.event.Registration.addHandler(bl);
}});
})();
(function(){var c="-",b="qx.event.handler.Element";
qx.Class.define(b,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(a){qx.core.Object.call(this);
this._manager=a;
this._registeredEvents={};
},statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{abort:true,scroll:true,select:true,reset:true,submit:true},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:true},members:{canHandleEvent:function(j,k){},registerEvent:function(d,e,f){var i=qx.core.ObjectRegistry.toHashCode(d);
var g=i+c+e;
var h=qx.lang.Function.listener(this._onNative,this,g);
qx.bom.Event.addNativeListener(d,e,h);
this._registeredEvents[g]={element:d,type:e,listener:h};
},unregisterEvent:function(o,p,q){var t=this._registeredEvents;

if(!t){return;
}var u=qx.core.ObjectRegistry.toHashCode(o);
var r=u+c+p;
var s=this._registeredEvents[r];

if(s){qx.bom.Event.removeNativeListener(o,p,s.listener);
}delete this._registeredEvents[r];
},_onNative:qx.event.GlobalError.observeMethod(function(v,w){var y=this._registeredEvents;

if(!y){return;
}var x=y[w];
qx.event.Registration.fireNonBubblingEvent(x.element,x.type,qx.event.type.Native,[v]);
})},destruct:function(){var l;
var m=this._registeredEvents;

for(var n in m){l=m[n];
qx.bom.Event.removeNativeListener(l.element,l.type,l.listener);
}this._manager=this._registeredEvents=null;
},defer:function(z){qx.event.Registration.addHandler(z);
}});
})();
(function(){var d="qx.event.handler.Appear",c="disappear",b="appear";
qx.Class.define(d,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(a){qx.core.Object.call(this);
this.__gr=a;
this.__gs={};
qx.event.handler.Appear.__gt[this.$$hash]=this;
},statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{appear:true,disappear:true},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:true,__gt:{},refresh:function(){var e=this.__gt;

for(var f in e){e[f].refresh();
}}},members:{__gr:null,__gs:null,canHandleEvent:function(q,r){},registerEvent:function(g,h,i){var j=qx.core.ObjectRegistry.toHashCode(g)+h;
var k=this.__gs;

if(k&&!k[j]){k[j]=g;
g.$$displayed=g.offsetWidth>0;
}},unregisterEvent:function(l,m,n){var o=qx.core.ObjectRegistry.toHashCode(l)+m;
var p=this.__gs;

if(!p){return;
}
if(p[o]){delete p[o];
}},refresh:function(){var v=this.__gs;
var w;

for(var u in v){w=v[u];
var s=w.offsetWidth>0;

if((!!w.$$displayed)!==s){w.$$displayed=s;
var t=qx.event.Registration.createEvent(s?b:c);
this.__gr.dispatchEvent(w,t);
}}}},destruct:function(){this.__gr=this.__gs=null;
delete qx.event.handler.Appear.__gt[this.$$hash];
},defer:function(x){qx.event.Registration.addHandler(x);
}});
})();
(function(){var L="mshtml",K="",J="qx.client",I=">",H=" ",G="<",F="='",E="none",D="qx.bom.Element",C="' ",A="div",B="></";
qx.Class.define(D,{statics:{__gu:{"onload":true,"onpropertychange":true,"oninput":true,"onchange":true,"name":true,"type":true,"checked":true,"disabled":true},__gv:{},getHelperElement:function(N){if(!N){N=window;
}var P=N.location.href;

if(!qx.bom.Element.__gv[P]){var O=qx.bom.Element.__gv[P]=N.document.createElement(A);
if(qx.bom.client.Engine.WEBKIT){O.style.display=E;
N.document.body.appendChild(O);
}}return qx.bom.Element.__gv[P];
},create:function(name,a,b){if(!b){b=window;
}
if(!name){throw new Error("The tag name is missing!");
}var d=this.__gu;
var c=K;

for(var f in a){if(d[f]){c+=f+F+a[f]+C;
}}var g;
if(c!=K){if(qx.bom.client.Engine.MSHTML){g=b.document.createElement(G+name+H+c+I);
}else{var e=qx.bom.Element.getHelperElement(b);
e.innerHTML=G+name+H+c+B+name+I;
g=e.firstChild;
}}else{g=b.document.createElement(name);
}
for(var f in a){if(!d[f]){qx.bom.element.Attribute.set(g,f,a[f]);
}}return g;
},empty:function(T){return T.innerHTML=K;
},addListener:function(Y,ba,bb,self,bc){return qx.event.Registration.addListener(Y,ba,bb,self,bc);
},removeListener:function(h,k,m,self,n){return qx.event.Registration.removeListener(h,k,m,self,n);
},removeListenerById:function(U,V){return qx.event.Registration.removeListenerById(U,V);
},hasListener:function(bd,be,bf){return qx.event.Registration.hasListener(bd,be,bf);
},focus:function(M){qx.event.Registration.getManager(M).getHandler(qx.event.handler.Focus).focus(M);
},blur:function(X){qx.event.Registration.getManager(X).getHandler(qx.event.handler.Focus).blur(X);
},activate:function(W){qx.event.Registration.getManager(W).getHandler(qx.event.handler.Focus).activate(W);
},deactivate:function(bg){qx.event.Registration.getManager(bg).getHandler(qx.event.handler.Focus).deactivate(bg);
},capture:function(R,S){qx.event.Registration.getManager(R).getDispatcher(qx.event.dispatch.MouseCapture).activateCapture(R,S);
},releaseCapture:function(Q){qx.event.Registration.getManager(Q).getDispatcher(qx.event.dispatch.MouseCapture).releaseCapture(Q);
},clone:function(o,p){var s;

if(p||(qx.core.Variant.isSet(J,L)&&!qx.xml.Document.isXmlDocument(o))){var w=qx.event.Registration.getManager(o);
var q=qx.dom.Hierarchy.getDescendants(o);
q.push(o);
}if(qx.core.Variant.isSet(J,L)){for(var i=0,l=q.length;i<l;i++){w.toggleAttachedEvents(q[i],false);
}}var s=o.cloneNode(true);
if(qx.core.Variant.isSet(J,L)){for(var i=0,l=q.length;i<l;i++){w.toggleAttachedEvents(q[i],true);
}}if(p===true){var z=qx.dom.Hierarchy.getDescendants(s);
z.push(s);
var r,u,y,t;

for(var i=0,x=q.length;i<x;i++){y=q[i];
r=w.serializeListeners(y);

if(r.length>0){u=z[i];

for(var j=0,v=r.length;j<v;j++){t=r[j];
w.addListener(u,t.type,t.handler,t.self,t.capture);
}}}}return s;
}}});
})();
(function(){var a="qx.event.type.Dom";
qx.Class.define(a,{extend:qx.event.type.Native,statics:{SHIFT_MASK:1,CTRL_MASK:2,ALT_MASK:4,META_MASK:8},members:{_cloneNativeEvent:function(b,c){var c=qx.event.type.Native.prototype._cloneNativeEvent.call(this,b,c);
c.shiftKey=b.shiftKey;
c.ctrlKey=b.ctrlKey;
c.altKey=b.altKey;
c.metaKey=b.metaKey;
return c;
},getModifiers:function(){var e=0;
var d=this._native;

if(d.shiftKey){e|=qx.event.type.Dom.SHIFT_MASK;
}
if(d.ctrlKey){e|=qx.event.type.Dom.CTRL_MASK;
}
if(d.altKey){e|=qx.event.type.Dom.ALT_MASK;
}
if(d.metaKey){e|=qx.event.type.Dom.META_MASK;
}return e;
},isCtrlPressed:function(){return this._native.ctrlKey;
},isShiftPressed:function(){return this._native.shiftKey;
},isAltPressed:function(){return this._native.altKey;
},isMetaPressed:function(){return this._native.metaKey;
},isCtrlOrCommandPressed:function(){if(qx.bom.client.Platform.MAC){return this._native.metaKey;
}else{return this._native.ctrlKey;
}}}});
})();
(function(){var f="qx.event.type.KeyInput";
qx.Class.define(f,{extend:qx.event.type.Dom,members:{init:function(c,d,e){qx.event.type.Dom.prototype.init.call(this,c,d,null,true,true);
this._charCode=e;
return this;
},clone:function(a){var b=qx.event.type.Dom.prototype.clone.call(this,a);
b._charCode=this._charCode;
return b;
},getCharCode:function(){return this._charCode;
},getChar:function(){return String.fromCharCode(this._charCode);
}}});
})();
(function(){var a="qx.event.type.KeySequence";
qx.Class.define(a,{extend:qx.event.type.Dom,members:{init:function(d,e,f){qx.event.type.Dom.prototype.init.call(this,d,e,null,true,true);
this._identifier=f;
return this;
},clone:function(b){var c=qx.event.type.Dom.prototype.clone.call(this,b);
c._identifier=this._identifier;
return c;
},getKeyIdentifier:function(){return this._identifier;
}}});
})();
(function(){var bn="qx.client",bm="blur",bl="focus",bk="mousedown",bj="on",bi="mouseup",bh="DOMFocusOut",bg="DOMFocusIn",bf="selectstart",be="onmousedown",bH="onfocusout",bG="onfocusin",bF="onmouseup",bE="onselectstart",bD="draggesture",bC="qx.event.handler.Focus",bB="_applyFocus",bA="deactivate",bz="textarea",by="_applyActive",bu="input",bv="focusin",bs="qxSelectable",bt="tabIndex",bq="off",br="activate",bo="mshtml",bp="focusout",bw="qxKeepFocus",bx="qxKeepActive";
qx.Class.define(bC,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(bL){qx.core.Object.call(this);
this._manager=bL;
this._window=bL.getWindow();
this._document=this._window.document;
this._root=this._document.documentElement;
this._body=this._document.body;
this._initObserver();
},properties:{active:{apply:by,nullable:true},focus:{apply:bB,nullable:true}},statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{focus:1,blur:1,focusin:1,focusout:1,activate:1,deactivate:1},IGNORE_CAN_HANDLE:true,FOCUSABLE_ELEMENTS:qx.core.Variant.select("qx.client",{"mshtml|gecko":{a:1,body:1,button:1,frame:1,iframe:1,img:1,input:1,object:1,select:1,textarea:1},"opera|webkit":{button:1,input:1,select:1,textarea:1}})},members:{__gw:null,__gx:null,__gy:null,__gz:null,__gA:null,__gB:null,__gC:null,__gD:null,__gE:null,__gF:null,canHandleEvent:function(S,T){},registerEvent:function(L,M,N){},unregisterEvent:function(h,i,j){},focus:function(s){if(qx.core.Variant.isSet(bn,bo)){window.setTimeout(function(){try{s.focus();
}catch(bc){}},0);
}else{try{s.focus();
}catch(E){}}this.setFocus(s);
this.setActive(s);
},activate:function(I){this.setActive(I);
},blur:function(bI){try{bI.blur();
}catch(g){}
if(this.getActive()===bI){this.resetActive();
}
if(this.getFocus()===bI){this.resetFocus();
}},deactivate:function(b){if(this.getActive()===b){this.resetActive();
}},tryActivate:function(bJ){var bK=this.__gU(bJ);

if(bK){this.setActive(bK);
}},__gG:function(x,y,z,A){var C=qx.event.Registration;
var B=C.createEvent(z,qx.event.type.Focus,[x,y,A]);
C.dispatchEvent(x,B);
},_windowFocused:true,__gH:function(){if(this._windowFocused){this._windowFocused=false;
this.__gG(this._window,null,bm,false);
}},__gI:function(){if(!this._windowFocused){this._windowFocused=true;
this.__gG(this._window,null,bl,false);
}},_initObserver:qx.core.Variant.select(bn,{"gecko":function(){this.__gw=qx.lang.Function.listener(this.__gO,this);
this.__gx=qx.lang.Function.listener(this.__gP,this);
this.__gy=qx.lang.Function.listener(this.__gN,this);
this.__gz=qx.lang.Function.listener(this.__gM,this);
this.__gA=qx.lang.Function.listener(this.__gJ,this);
this._document.addEventListener(bk,this.__gw,true);
this._document.addEventListener(bi,this.__gx,true);
this._window.addEventListener(bl,this.__gy,true);
this._window.addEventListener(bm,this.__gz,true);
this._window.addEventListener(bD,this.__gA,true);
},"mshtml":function(){this.__gw=qx.lang.Function.listener(this.__gO,this);
this.__gx=qx.lang.Function.listener(this.__gP,this);
this.__gC=qx.lang.Function.listener(this.__gK,this);
this.__gD=qx.lang.Function.listener(this.__gL,this);
this.__gB=qx.lang.Function.listener(this.__gR,this);
this._document.attachEvent(be,this.__gw);
this._document.attachEvent(bF,this.__gx);
this._document.attachEvent(bG,this.__gC);
this._document.attachEvent(bH,this.__gD);
this._document.attachEvent(bE,this.__gB);
},"webkit":function(){this.__gw=qx.lang.Function.listener(this.__gO,this);
this.__gx=qx.lang.Function.listener(this.__gP,this);
this.__gD=qx.lang.Function.listener(this.__gL,this);
this.__gy=qx.lang.Function.listener(this.__gN,this);
this.__gz=qx.lang.Function.listener(this.__gM,this);
this.__gB=qx.lang.Function.listener(this.__gR,this);
this._document.addEventListener(bk,this.__gw,true);
this._document.addEventListener(bi,this.__gx,true);
this._document.addEventListener(bf,this.__gB,false);
this._window.addEventListener(bh,this.__gD,true);
this._window.addEventListener(bl,this.__gy,true);
this._window.addEventListener(bm,this.__gz,true);
},"opera":function(){this.__gw=qx.lang.Function.listener(this.__gO,this);
this.__gx=qx.lang.Function.listener(this.__gP,this);
this.__gC=qx.lang.Function.listener(this.__gK,this);
this.__gD=qx.lang.Function.listener(this.__gL,this);
this._document.addEventListener(bk,this.__gw,true);
this._document.addEventListener(bi,this.__gx,true);
this._window.addEventListener(bg,this.__gC,true);
this._window.addEventListener(bh,this.__gD,true);
}}),_stopObserver:qx.core.Variant.select(bn,{"gecko":function(){this._document.removeEventListener(bk,this.__gw,true);
this._document.removeEventListener(bi,this.__gx,true);
this._window.removeEventListener(bl,this.__gy,true);
this._window.removeEventListener(bm,this.__gz,true);
this._window.removeEventListener(bD,this.__gA,true);
},"mshtml":function(){qx.bom.Event.removeNativeListener(this._document,be,this.__gw);
qx.bom.Event.removeNativeListener(this._document,bF,this.__gx);
qx.bom.Event.removeNativeListener(this._document,bG,this.__gC);
qx.bom.Event.removeNativeListener(this._document,bH,this.__gD);
qx.bom.Event.removeNativeListener(this._document,bE,this.__gB);
},"webkit":function(){this._document.removeEventListener(bk,this.__gw,true);
this._document.removeEventListener(bf,this.__gB,false);
this._window.removeEventListener(bg,this.__gC,true);
this._window.removeEventListener(bh,this.__gD,true);
this._window.removeEventListener(bl,this.__gy,true);
this._window.removeEventListener(bm,this.__gz,true);
},"opera":function(){this._document.removeEventListener(bk,this.__gw,true);
this._window.removeEventListener(bg,this.__gC,true);
this._window.removeEventListener(bh,this.__gD,true);
this._window.removeEventListener(bl,this.__gy,true);
this._window.removeEventListener(bm,this.__gz,true);
}}),__gJ:qx.event.GlobalError.observeMethod(qx.core.Variant.select(bn,{"gecko":function(e){if(!this.__gV(e.target)){qx.bom.Event.preventDefault(e);
}},"default":null})),__gK:qx.event.GlobalError.observeMethod(qx.core.Variant.select(bn,{"mshtml":function(e){this.__gI();
var d=e.srcElement;
var c=this.__gT(d);

if(c){this.setFocus(c);
}this.tryActivate(d);
},"opera":function(e){var a=e.target;

if(a==this._document||a==this._window){this.__gI();

if(this.__gE){this.setFocus(this.__gE);
delete this.__gE;
}
if(this.__gF){this.setActive(this.__gF);
delete this.__gF;
}}else{this.setFocus(a);
this.tryActivate(a);
if(!this.__gV(a)){a.selectionStart=0;
a.selectionEnd=0;
}}},"default":null})),__gL:qx.event.GlobalError.observeMethod(qx.core.Variant.select(bn,{"mshtml":function(e){if(!e.toElement){this.__gH();
this.resetFocus();
this.resetActive();
}},"webkit":function(e){var bd=e.target;

if(bd===this.getFocus()){this.resetFocus();
}
if(bd===this.getActive()){this.resetActive();
}},"opera":function(e){var k=e.target;

if(k==this._document){this.__gH();
this.__gE=this.getFocus();
this.__gF=this.getActive();
this.resetFocus();
this.resetActive();
}else{if(k===this.getFocus()){this.resetFocus();
}
if(k===this.getActive()){this.resetActive();
}}},"default":null})),__gM:qx.event.GlobalError.observeMethod(qx.core.Variant.select(bn,{"gecko":function(e){if(e.target===this._window||e.target===this._document){this.__gH();
this.resetActive();
this.resetFocus();
}},"webkit":function(e){if(e.target===this._window||e.target===this._document){this.__gH();
this.__gE=this.getFocus();
this.__gF=this.getActive();
this.resetActive();
this.resetFocus();
}},"default":null})),__gN:qx.event.GlobalError.observeMethod(qx.core.Variant.select(bn,{"gecko":function(e){var G=e.target;

if(G===this._window||G===this._document){this.__gI();
G=this._body;
}this.setFocus(G);
this.tryActivate(G);
},"webkit":function(e){var D=e.target;

if(D===this._window||D===this._document){this.__gI();

if(this.__gE){this.setFocus(this.__gE);
delete this.__gE;
}
if(this.__gF){this.setActive(this.__gF);
delete this.__gF;
}}else{this.setFocus(D);
this.tryActivate(D);
}},"default":null})),__gO:qx.event.GlobalError.observeMethod(qx.core.Variant.select(bn,{"gecko":function(e){var X=this.__gT(e.target);

if(!X){qx.bom.Event.preventDefault(e);
}},"mshtml":function(e){var bN=e.srcElement;
var bM=this.__gT(bN);

if(bM){if(!this.__gV(bN)){bN.unselectable=bj;
try{document.selection.empty();
}catch(e){}try{bM.focus();
}catch(e){}}}else{qx.bom.Event.preventDefault(e);
if(!this.__gV(bN)){bN.unselectable=bj;
}}},"webkit":function(e){var m=e.target;
var l=this.__gT(m);

if(l){this.setFocus(l);
}else{qx.bom.Event.preventDefault(e);
}},"opera":function(e){var v=e.target;
var t=this.__gT(v);

if(!this.__gV(v)){qx.bom.Event.preventDefault(e);
if(t){var u=this.getFocus();

if(u&&u.selectionEnd){u.selectionStart=0;
u.selectionEnd=0;
u.blur();
}if(t){this.setFocus(t);
}}}else if(t){this.setFocus(t);
}},"default":null})),__gP:qx.event.GlobalError.observeMethod(qx.core.Variant.select(bn,{"mshtml":function(e){var f=e.srcElement;

if(f.unselectable){f.unselectable=bq;
}this.tryActivate(this.__gQ(f));
},"gecko":function(e){var w=e.target;

while(w&&w.offsetWidth===undefined){w=w.parentNode;
}
if(w){this.tryActivate(w);
}},"webkit|opera":function(e){this.tryActivate(this.__gQ(e.target));
},"default":null})),__gQ:qx.event.GlobalError.observeMethod(qx.core.Variant.select(bn,{"mshtml|webkit":function(J){var K=this.getFocus();

if(K&&J!=K&&(K.nodeName.toLowerCase()===bu||K.nodeName.toLowerCase()===bz)){J=K;
}return J;
},"default":function(F){return F;
}})),__gR:qx.event.GlobalError.observeMethod(qx.core.Variant.select(bn,{"mshtml|webkit":function(e){var H=qx.bom.client.Engine.MSHTML?e.srcElement:e.target;

if(!this.__gV(H)){qx.bom.Event.preventDefault(e);
}},"default":null})),__gS:function(p){var q=qx.bom.element.Attribute.get(p,bt);

if(q>=1){return true;
}var r=qx.event.handler.Focus.FOCUSABLE_ELEMENTS;

if(q>=0&&r[p.tagName]){return true;
}return false;
},__gT:function(U){while(U&&U.nodeType===1){if(U.getAttribute(bw)==bj){return null;
}
if(this.__gS(U)){return U;
}U=U.parentNode;
}return this._body;
},__gU:function(n){var o=n;

while(n&&n.nodeType===1){if(n.getAttribute(bx)==bj){return null;
}n=n.parentNode;
}return o;
},__gV:function(V){while(V&&V.nodeType===1){var W=V.getAttribute(bs);

if(W!=null){return W===bj;
}V=V.parentNode;
}return true;
},_applyActive:function(O,P){if(P){this.__gG(P,O,bA,true);
}
if(O){this.__gG(O,P,br,true);
}},_applyFocus:function(Q,R){if(R){this.__gG(R,Q,bp,true);
}
if(Q){this.__gG(Q,R,bv,true);
}if(R){this.__gG(R,Q,bm,false);
}
if(Q){this.__gG(Q,R,bl,false);
}}},destruct:function(){this._stopObserver();
this._manager=this._window=this._document=this._root=this._body=this.__gW=null;
},defer:function(Y){qx.event.Registration.addHandler(Y);
var ba=Y.FOCUSABLE_ELEMENTS;

for(var bb in ba){ba[bb.toUpperCase()]=1;
}}});
})();
(function(){var a="qx.event.type.Focus";
qx.Class.define(a,{extend:qx.event.type.Event,members:{init:function(b,c,d){qx.event.type.Event.prototype.init.call(this,d,false);
this._target=b;
this._relatedTarget=c;
return this;
}}});
})();
(function(){var m="",l="undefined",k="qx.client",j="readOnly",i="accessKey",h="qx.bom.element.Attribute",g="rowSpan",f="vAlign",e="className",d="textContent",B="'",A="htmlFor",z="longDesc",y="cellSpacing",x="frameBorder",w="='",v="useMap",u="innerText",t="innerHTML",s="tabIndex",q="dateTime",r="maxLength",o="mshtml",p="cellPadding",n="colSpan";
qx.Class.define(h,{statics:{__gX:{names:{"class":e,"for":A,html:t,text:qx.core.Variant.isSet(k,o)?u:d,colspan:n,rowspan:g,valign:f,datetime:q,accesskey:i,tabindex:s,maxlength:r,readonly:j,longdesc:z,cellpadding:p,cellspacing:y,frameborder:x,usemap:v},runtime:{"html":1,"text":1},bools:{compact:1,nowrap:1,ismap:1,declare:1,noshade:1,checked:1,disabled:1,readOnly:1,multiple:1,selected:1,noresize:1,defer:1,allowTransparency:1},property:{$$html:1,$$widget:1,disabled:1,checked:1,readOnly:1,multiple:1,selected:1,value:1,maxLength:1,className:1,innerHTML:1,innerText:1,textContent:1,htmlFor:1,tabIndex:1},qxProperties:{$$widget:1,$$html:1},propertyDefault:{disabled:false,checked:false,readOnly:false,multiple:false,selected:false,value:m,className:m,innerHTML:m,innerText:m,textContent:m,htmlFor:m,tabIndex:0,maxLength:qx.core.Variant.select(k,{"mshtml":2147483647,"webkit":524288,"default":-1})},removeableProperties:{disabled:1,multiple:1,maxLength:1},original:{href:1,src:1,type:1}},compile:function(G){var H=[];
var J=this.__gX.runtime;

for(var I in G){if(!J[I]){H.push(I,w,G[I],B);
}}return H.join(m);
},get:qx.core.Variant.select(k,{"mshtml":function(K,name){var M=this.__gX;
var L;
name=M.names[name]||name;
if(M.original[name]){L=K.getAttribute(name,2);
}else if(M.property[name]){L=K[name];

if(typeof M.propertyDefault[name]!==l&&L==M.propertyDefault[name]){if(typeof M.bools[name]===l){return null;
}else{return L;
}}}else{L=K.getAttribute(name);
}if(M.bools[name]){return !!L;
}return L;
},"default":function(D,name){var F=this.__gX;
var E;
name=F.names[name]||name;
if(F.property[name]){E=D[name];

if(typeof F.propertyDefault[name]!==l&&E==F.propertyDefault[name]){if(typeof F.bools[name]===l){return null;
}else{return E;
}}}else{E=D.getAttribute(name);
}if(F.bools[name]){return !!E;
}return E;
}}),set:function(a,name,b){var c=this.__gX;
name=c.names[name]||name;
if(c.bools[name]){b=!!b;
}if(c.property[name]&&(!(a[name]===undefined)||c.qxProperties[name])){if(b==null){if(c.removeableProperties[name]){a.removeAttribute(name);
return;
}else if(typeof c.propertyDefault[name]!==l){b=c.propertyDefault[name];
}}a[name]=b;
}else{if(b===true){a.setAttribute(name,name);
}else if(b===false||b===null){a.removeAttribute(name);
}else{a.setAttribute(name,b);
}}},reset:function(C,name){this.set(C,name,null);
}}});
})();
(function(){var j="left",i="right",h="middle",g="qx.client",f="dblclick",e="click",d="none",c="contextmenu",b="qx.event.type.Mouse";
qx.Class.define(b,{extend:qx.event.type.Dom,members:{init:function(l,m,n,o,p){qx.event.type.Dom.prototype.init.call(this,l,m,n,o,p);

if(!n){this._relatedTarget=qx.bom.Event.getRelatedTarget(l);
}return this;
},_cloneNativeEvent:function(q,r){var r=qx.event.type.Dom.prototype._cloneNativeEvent.call(this,q,r);
r.button=q.button;
r.clientX=q.clientX;
r.clientY=q.clientY;
r.pageX=q.pageX;
r.pageY=q.pageY;
r.screenX=q.screenX;
r.screenY=q.screenY;
r.wheelDelta=q.wheelDelta;
r.detail=q.detail;
r.srcElement=q.srcElement;
return r;
},__gY:qx.core.Variant.select(g,{"mshtml":{1:j,2:i,4:h},"default":{0:j,2:i,1:h}}),stop:function(){this.stopPropagation();
},getButton:function(){switch(this._type){case e:case f:return j;
case c:return i;
default:return this.__gY[this._native.button]||d;
}},isLeftPressed:function(){return this.getButton()===j;
},isMiddlePressed:function(){return this.getButton()===h;
},isRightPressed:function(){return this.getButton()===i;
},getRelatedTarget:function(){return this._relatedTarget;
},getViewportLeft:function(){return this._native.clientX;
},getViewportTop:function(){return this._native.clientY;
},getDocumentLeft:qx.core.Variant.select(g,{"mshtml":function(){var k=qx.dom.Node.getWindow(this._native.srcElement);
return this._native.clientX+qx.bom.Viewport.getScrollLeft(k);
},"default":function(){return this._native.pageX;
}}),getDocumentTop:qx.core.Variant.select(g,{"mshtml":function(){var a=qx.dom.Node.getWindow(this._native.srcElement);
return this._native.clientY+qx.bom.Viewport.getScrollTop(a);
},"default":function(){return this._native.pageY;
}}),getScreenLeft:function(){return this._native.screenX;
},getScreenTop:function(){return this._native.screenY;
}}});
})();
(function(){var c="qx.client",b="chrome",a="qx.event.type.MouseWheel";
qx.Class.define(a,{extend:qx.event.type.Mouse,members:{stop:function(){this.stopPropagation();
this.preventDefault();
},getWheelDelta:qx.core.Variant.select(c,{"default":function(){return -(this._native.wheelDelta/40);
},"gecko":function(){return this._native.detail;
},"webkit":function(){if(qx.bom.client.Browser.NAME==b){return -(this._native.wheelDelta/120);
}else{return -(this._native.wheelDelta/40);
}}})}});
})();
(function(){var i="qx.client",h="qx.bom.Viewport";
qx.Class.define(h,{statics:{getWidth:qx.core.Variant.select(i,{"opera":function(l){if(qx.bom.client.Engine.VERSION<9.5){return (l||window).document.body.clientWidth;
}else{var m=(l||window).document;
return qx.bom.Document.isStandardMode(l)?m.documentElement.clientWidth:m.body.clientWidth;
}},"webkit":function(f){if(qx.bom.client.Engine.VERSION<523.15){return (f||window).innerWidth;
}else{var g=(f||window).document;
return qx.bom.Document.isStandardMode(f)?g.documentElement.clientWidth:g.body.clientWidth;
}},"default":function(j){var k=(j||window).document;
return qx.bom.Document.isStandardMode(j)?k.documentElement.clientWidth:k.body.clientWidth;
}}),getHeight:qx.core.Variant.select(i,{"opera":function(b){if(qx.bom.client.Engine.VERSION<9.5){return (b||window).document.body.clientHeight;
}else{var c=(b||window).document;
return qx.bom.Document.isStandardMode(b)?c.documentElement.clientHeight:c.body.clientHeight;
}},"webkit":function(q){if(qx.bom.client.Engine.VERSION<523.15){return (q||window).innerHeight;
}else{var r=(q||window).document;
return qx.bom.Document.isStandardMode(q)?r.documentElement.clientHeight:r.body.clientHeight;
}},"default":function(s){var t=(s||window).document;
return qx.bom.Document.isStandardMode(s)?t.documentElement.clientHeight:t.body.clientHeight;
}}),getScrollLeft:qx.core.Variant.select(i,{"mshtml":function(n){var o=(n||window).document;
return o.documentElement.scrollLeft||o.body.scrollLeft;
},"default":function(a){return (a||window).pageXOffset;
}}),getScrollTop:qx.core.Variant.select(i,{"mshtml":function(d){var e=(d||window).document;
return e.documentElement.scrollTop||e.body.scrollTop;
},"default":function(p){return (p||window).pageYOffset;
}})}});
})();
(function(){var i="CSS1Compat",h="position:absolute;width:0;height:0;width:1",g="qx.bom.Document",f="1px",e="qx.client",d="div";
qx.Class.define(g,{statics:{isQuirksMode:qx.core.Variant.select(e,{"mshtml":function(k){if(qx.bom.client.Engine.VERSION>=8){return qx.bom.client.Engine.DOCUMENT_MODE===5;
}else{return (k||window).document.compatMode!==i;
}},"webkit":function(p){if(document.compatMode===undefined){var q=(p||window).document.createElement(d);
q.style.cssText=h;
return q.style.width===f?true:false;
}else{return (p||window).document.compatMode!==i;
}},"default":function(j){return (j||window).document.compatMode!==i;
}}),isStandardMode:function(l){return !this.isQuirksMode(l);
},getWidth:function(m){var n=(m||window).document;
var o=qx.bom.Viewport.getWidth(m);
var scroll=this.isStandardMode(m)?n.documentElement.scrollWidth:n.body.scrollWidth;
return Math.max(scroll,o);
},getHeight:function(a){var b=(a||window).document;
var c=qx.bom.Viewport.getHeight(a);
var scroll=this.isStandardMode(a)?b.documentElement.scrollHeight:b.body.scrollHeight;
return Math.max(scroll,c);
}}});
})();
(function(){var l="qx.client",k="ie",j="msie",i="android",h="operamini",g="mobile chrome",f=")(/| )([0-9]+\.[0-9])",e="iemobile",d="opera mobi",c="Mobile Safari",z="operamobile",y="mobile safari",x="IEMobile|Maxthon|MSIE",w="qx.bom.client.Browser",v="opera mini",u="(",t="opera",s="mshtml",r="Opera Mini|Opera Mobi|Opera",q="AdobeAIR|Titanium|Fluid|Chrome|Android|Epiphany|Konqueror|iCab|OmniWeb|Maxthon|Pre|Mobile Safari|Safari",o="webkit",p="5.0",m="prism|Fennec|Camino|Kmeleon|Galeon|Netscape|SeaMonkey|Firefox",n="Mobile/";
qx.Bootstrap.define(w,{statics:{UNKNOWN:true,NAME:"unknown",TITLE:"unknown 0.0",VERSION:0.0,FULLVERSION:"0.0.0",__ha:function(B){var C=navigator.userAgent;
var E=new RegExp(u+B+f);
var F=C.match(E);

if(!F){return;
}var name=F[1].toLowerCase();
var D=F[3];
if(C.match(/Version(\/| )([0-9]+\.[0-9])/)){D=RegExp.$2;
}
if(qx.core.Variant.isSet(l,o)){if(name===i){name=g;
}else if(C.indexOf(c)!==-1||C.indexOf(n)!==-1){name=y;
}}else if(qx.core.Variant.isSet(l,s)){if(name===j){name=k;
if(qx.bom.client.System.WINCE&&name===k){name=e;
D=p;
}}}else if(qx.core.Variant.isSet(l,t)){if(name===d){name=z;
}else if(name===v){name=h;
}}this.NAME=name;
this.FULLVERSION=D;
this.VERSION=parseFloat(D,10);
this.TITLE=name+" "+this.VERSION;
this.UNKNOWN=false;
}},defer:qx.core.Variant.select(l,{"webkit":function(a){a.__ha(q);
},"gecko":function(A){A.__ha(m);
},"mshtml":function(b){b.__ha(x);
},"opera":function(G){G.__ha(r);
}})});
})();
(function(){var K="qx.client",J="qx.dom.Hierarchy",I="previousSibling",H="*",G="nextSibling",F="parentNode";
qx.Class.define(J,{statics:{getNodeIndex:function(M){var N=0;

while(M&&(M=M.previousSibling)){N++;
}return N;
},getElementIndex:function(z){var A=0;
var B=qx.dom.Node.ELEMENT;

while(z&&(z=z.previousSibling)){if(z.nodeType==B){A++;
}}return A;
},getNextElementSibling:function(d){while(d&&(d=d.nextSibling)&&!qx.dom.Node.isElement(d)){continue;
}return d||null;
},getPreviousElementSibling:function(L){while(L&&(L=L.previousSibling)&&!qx.dom.Node.isElement(L)){continue;
}return L||null;
},contains:qx.core.Variant.select(K,{"webkit|mshtml|opera":function(f,g){if(qx.dom.Node.isDocument(f)){var h=qx.dom.Node.getDocument(g);
return f&&h==f;
}else if(qx.dom.Node.isDocument(g)){return false;
}else{return f.contains(g);
}},"gecko":function(w,x){return !!(w.compareDocumentPosition(x)&16);
},"default":function(U,V){while(V){if(U==V){return true;
}V=V.parentNode;
}return false;
}}),isRendered:function(o){if(!o.offsetParent){return false;
}var p=o.ownerDocument||o.document;
if(p.body.contains){return p.body.contains(o);
}if(p.compareDocumentPosition){return !!(p.compareDocumentPosition(o)&16);
}throw new Error("Missing support for isRendered()!");
},isDescendantOf:function(s,t){return this.contains(t,s);
},getCommonParent:qx.core.Variant.select(K,{"mshtml|opera":function(l,m){if(l===m){return l;
}
while(l&&qx.dom.Node.isElement(l)){if(l.contains(m)){return l;
}l=l.parentNode;
}return null;
},"default":function(O,P){if(O===P){return O;
}var Q={};
var T=qx.core.ObjectRegistry;
var S,R;

while(O||P){if(O){S=T.toHashCode(O);

if(Q[S]){return Q[S];
}Q[S]=O;
O=O.parentNode;
}
if(P){R=T.toHashCode(P);

if(Q[R]){return Q[R];
}Q[R]=P;
P=P.parentNode;
}}return null;
}}),getAncestors:function(u){return this._recursivelyCollect(u,F);
},getChildElements:function(i){i=i.firstChild;

if(!i){return [];
}var j=this.getNextSiblings(i);

if(i.nodeType===1){j.unshift(i);
}return j;
},getDescendants:function(n){return qx.lang.Array.fromCollection(n.getElementsByTagName(H));
},getFirstDescendant:function(y){y=y.firstChild;

while(y&&y.nodeType!=1){y=y.nextSibling;
}return y;
},getLastDescendant:function(k){k=k.lastChild;

while(k&&k.nodeType!=1){k=k.previousSibling;
}return k;
},getPreviousSiblings:function(v){return this._recursivelyCollect(v,I);
},getNextSiblings:function(e){return this._recursivelyCollect(e,G);
},_recursivelyCollect:function(a,b){var c=[];

while(a=a[b]){if(a.nodeType==1){c.push(a);
}}return c;
},getSiblings:function(q){return this.getPreviousSiblings(q).reverse().concat(this.getNextSiblings(q));
},isEmpty:function(r){r=r.firstChild;

while(r){if(r.nodeType===qx.dom.Node.ELEMENT||r.nodeType===qx.dom.Node.TEXT){return false;
}r=r.nextSibling;
}return true;
},cleanWhitespace:function(C){var D=C.firstChild;

while(D){var E=D.nextSibling;

if(D.nodeType==3&&!/\S/.test(D.nodeValue)){C.removeChild(D);
}D=E;
}}}});
})();
(function(){var f="qx.client",e="qx.event.type.Drag";
qx.Class.define(e,{extend:qx.event.type.Event,members:{init:function(g,h){qx.event.type.Event.prototype.init.call(this,true,g);

if(h){this._native=h.getNativeEvent()||null;
this._originalTarget=h.getTarget()||null;
}else{this._native=null;
this._originalTarget=null;
}return this;
},clone:function(l){var m=qx.event.type.Event.prototype.clone.call(this,l);
m._native=this._native;
return m;
},getDocumentLeft:qx.core.Variant.select(f,{"mshtml":function(){if(this._native==null){return 0;
}var o=qx.dom.Node.getWindow(this._native.srcElement);
return this._native.clientX+qx.bom.Viewport.getScrollLeft(o);
},"default":function(){if(this._native==null){return 0;
}return this._native.pageX;
}}),getDocumentTop:qx.core.Variant.select(f,{"mshtml":function(){if(this._native==null){return 0;
}var k=qx.dom.Node.getWindow(this._native.srcElement);
return this._native.clientY+qx.bom.Viewport.getScrollTop(k);
},"default":function(){if(this._native==null){return 0;
}return this._native.pageY;
}}),getManager:function(){return qx.event.Registration.getManager(this.getTarget()).getHandler(qx.event.handler.DragDrop);
},addType:function(n){this.getManager().addType(n);
},addAction:function(j){this.getManager().addAction(j);
},supportsType:function(d){return this.getManager().supportsType(d);
},supportsAction:function(i){return this.getManager().supportsAction(i);
},addData:function(b,c){this.getManager().addData(b,c);
},getData:function(a){return this.getManager().getData(a);
},getCurrentType:function(){return this.getManager().getCurrentType();
},getCurrentAction:function(){return this.getManager().getCurrentAction();
}}});
})();
(function(){var l="losecapture",k="qx.client",j="blur",i="focus",h="click",g="qx.event.dispatch.MouseCapture",f="capture",e="scroll";
qx.Class.define(g,{extend:qx.event.dispatch.AbstractBubbling,construct:function(q,r){qx.event.dispatch.AbstractBubbling.call(this,q);
this.__hb=q.getWindow();
this.__hc=r;
q.addListener(this.__hb,j,this.releaseCapture,this);
q.addListener(this.__hb,i,this.releaseCapture,this);
q.addListener(this.__hb,e,this.releaseCapture,this);
},statics:{PRIORITY:qx.event.Registration.PRIORITY_FIRST},members:{__hc:null,__hd:null,__he:true,__hb:null,_getParent:function(t){return t.parentNode;
},canDispatchEvent:function(c,event,d){return (this.__hd&&this.__hf[d]);
},dispatchEvent:function(m,event,n){if(n==h){event.stopPropagation();
this.releaseCapture();
return;
}
if(this.__he||!qx.dom.Hierarchy.contains(this.__hd,m)){m=this.__hd;
}qx.event.dispatch.AbstractBubbling.prototype.dispatchEvent.call(this,m,event,n);
},__hf:{"mouseup":1,"mousedown":1,"click":1,"dblclick":1,"mousemove":1,"mouseout":1,"mouseover":1},activateCapture:function(a,b){var b=b!==false;

if(this.__hd===a&&this.__he==b){return;
}
if(this.__hd){this.releaseCapture();
}this.nativeSetCapture(a,b);

if(this.hasNativeCapture){var self=this;
qx.bom.Event.addNativeListener(a,l,function(){qx.bom.Event.removeNativeListener(a,l,arguments.callee);
self.releaseCapture();
});
}this.__he=b;
this.__hd=a;
this.__hc.fireEvent(a,f,qx.event.type.Event,[true,false]);
},getCaptureElement:function(){return this.__hd;
},releaseCapture:function(){var p=this.__hd;

if(!p){return;
}this.__hd=null;
this.__hc.fireEvent(p,l,qx.event.type.Event,[true,false]);
this.nativeReleaseCapture(p);
},hasNativeCapture:qx.bom.client.Engine.MSHTML,nativeSetCapture:qx.core.Variant.select(k,{"mshtml":function(u,v){u.setCapture(v!==false);
},"default":qx.lang.Function.empty}),nativeReleaseCapture:qx.core.Variant.select(k,{"mshtml":function(s){s.releaseCapture();
},"default":qx.lang.Function.empty})},destruct:function(){this.__hd=this.__hb=this.__hc=null;
},defer:function(o){qx.event.Registration.addDispatcher(o);
}});
})();
(function(){var A="qx.client",z="",y="mshtml",x="'",w="SelectionLanguage",v="qx.xml.Document",u=" />",t="MSXML2.DOMDocument.3.0",s='<\?xml version="1.0" encoding="utf-8"?>\n<',r="MSXML2.XMLHTTP.3.0",n="MSXML2.XMLHTTP.6.0",q=" xmlns='",p="text/xml",m="XPath",k="MSXML2.DOMDocument.6.0",o="HTML";
qx.Class.define(v,{statics:{DOMDOC:null,XMLHTTP:null,isXmlDocument:function(B){if(B.nodeType===9){return B.documentElement.nodeName!==o;
}else if(B.ownerDocument){return this.isXmlDocument(B.ownerDocument);
}else{return false;
}},create:qx.core.Variant.select(A,{"mshtml":function(c,d){var e=new ActiveXObject(this.DOMDOC);
e.setProperty(w,m);

if(d){var f=s;
f+=d;

if(c){f+=q+c+x;
}f+=u;
e.loadXML(f);
}return e;
},"default":function(D,E){return document.implementation.createDocument(D||z,E||z,null);
}}),fromString:qx.core.Variant.select(A,{"mshtml":function(a){var b=qx.xml.Document.create();
b.loadXML(a);
return b;
},"default":function(F){var G=new DOMParser();
return G.parseFromString(F,p);
}})},defer:function(g){if(qx.core.Variant.isSet(A,y)){var h=[k,t];
var j=[n,r];

for(var i=0,l=h.length;i<l;i++){try{new ActiveXObject(h[i]);
new ActiveXObject(j[i]);
}catch(C){continue;
}g.DOMDOC=h[i];
g.XMLHTTP=j[i];
break;
}}}});
})();
(function(){var G="visible",F="scroll",E="borderBottomWidth",D="borderTopWidth",C="left",B="borderLeftWidth",A="bottom",z="top",y="right",x="qx.bom.element.Scroll",w="borderRightWidth";
qx.Class.define(x,{statics:{intoViewX:function(H,stop,I){var parent=H.parentNode;
var N=qx.dom.Node.getDocument(H);
var J=N.body;
var V,T,Q;
var X,O,Y;
var R,ba,bd;
var bb,L,U,K;
var P,bc,S;
var M=I===C;
var W=I===y;
stop=stop?stop.parentNode:N;
while(parent&&parent!=stop){if(parent.scrollWidth>parent.clientWidth&&(parent===J||qx.bom.element.Overflow.getY(parent)!=G)){if(parent===J){T=parent.scrollLeft;
Q=T+qx.bom.Viewport.getWidth();
X=qx.bom.Viewport.getWidth();
O=parent.clientWidth;
Y=parent.scrollWidth;
R=0;
ba=0;
bd=0;
}else{V=qx.bom.element.Location.get(parent);
T=V.left;
Q=V.right;
X=parent.offsetWidth;
O=parent.clientWidth;
Y=parent.scrollWidth;
R=parseInt(qx.bom.element.Style.get(parent,B),10)||0;
ba=parseInt(qx.bom.element.Style.get(parent,w),10)||0;
bd=X-O-R-ba;
}bb=qx.bom.element.Location.get(H);
L=bb.left;
U=bb.right;
K=H.offsetWidth;
P=L-T-R;
bc=U-Q+ba;
S=0;
if(M){S=P;
}else if(W){S=bc+bd;
}else if(P<0||K>O){S=P;
}else if(bc>0){S=bc+bd;
}parent.scrollLeft+=S;
if(qx.bom.client.Engine.GECKO){qx.event.Registration.fireNonBubblingEvent(parent,F);
}}
if(parent===J){break;
}parent=parent.parentNode;
}},intoViewY:function(a,stop,b){var parent=a.parentNode;
var h=qx.dom.Node.getDocument(a);
var c=h.body;
var p,d,l;
var r,o,j;
var f,g,e;
var t,u,q,k;
var n,i,v;
var s=b===z;
var m=b===A;
stop=stop?stop.parentNode:h;
while(parent&&parent!=stop){if(parent.scrollHeight>parent.clientHeight&&(parent===c||qx.bom.element.Overflow.getY(parent)!=G)){if(parent===c){d=parent.scrollTop;
l=d+qx.bom.Viewport.getHeight();
r=qx.bom.Viewport.getHeight();
o=parent.clientHeight;
j=parent.scrollHeight;
f=0;
g=0;
e=0;
}else{p=qx.bom.element.Location.get(parent);
d=p.top;
l=p.bottom;
r=parent.offsetHeight;
o=parent.clientHeight;
j=parent.scrollHeight;
f=parseInt(qx.bom.element.Style.get(parent,D),10)||0;
g=parseInt(qx.bom.element.Style.get(parent,E),10)||0;
e=r-o-f-g;
}t=qx.bom.element.Location.get(a);
u=t.top;
q=t.bottom;
k=a.offsetHeight;
n=u-d-f;
i=q-l+g;
v=0;
if(s){v=n;
}else if(m){v=i+e;
}else if(n<0||k>o){v=n;
}else if(i>0){v=i+e;
}parent.scrollTop+=v;
if(qx.bom.client.Engine.GECKO){qx.event.Registration.fireNonBubblingEvent(parent,F);
}}
if(parent===c){break;
}parent=parent.parentNode;
}},intoView:function(be,stop,bf,bg){this.intoViewX(be,stop,bf);
this.intoViewY(be,stop,bg);
}}});
})();
(function(){var q="",p="qx.client",o="hidden",n="-moz-scrollbars-none",m="overflow",l=";",k="overflowY",j=":",i="overflowX",h="overflow:",E="none",D="scroll",C="borderLeftStyle",B="borderRightStyle",A="div",z="borderRightWidth",y="overflow-y",x="borderLeftWidth",w="-moz-scrollbars-vertical",v="100px",r="qx.bom.element.Overflow",u="overflow-x";
qx.Class.define(r,{statics:{__hg:null,getScrollbarWidth:function(){if(this.__hg!==null){return this.__hg;
}var bJ=qx.bom.element.Style;
var bL=function(ba,bb){return parseInt(bJ.get(ba,bb))||0;
};
var bM=function(bI){return (bJ.get(bI,B)==E?0:bL(bI,z));
};
var bK=function(bf){return (bJ.get(bf,C)==E?0:bL(bf,x));
};
var bO=qx.core.Variant.select(p,{"mshtml":function(W){if(bJ.get(W,k)==o||W.clientWidth==0){return bM(W);
}return Math.max(0,W.offsetWidth-W.clientLeft-W.clientWidth);
},"default":function(bw){if(bw.clientWidth==0){var bx=bJ.get(bw,m);
var by=(bx==D||bx==w?16:0);
return Math.max(0,bM(bw)+by);
}return Math.max(0,(bw.offsetWidth-bw.clientWidth-bK(bw)));
}});
var bN=function(N){return bO(N)-bM(N);
};
var t=document.createElement(A);
var s=t.style;
s.height=s.width=v;
s.overflow=D;
document.body.appendChild(t);
var c=bN(t);
this.__hg=c?c:16;
document.body.removeChild(t);
return this.__hg;
},_compile:qx.core.Variant.select(p,{"gecko":qx.bom.client.Engine.VERSION<
1.8?
function(bd,be){if(be==o){be=n;
}return h+be+l;
}:
function(ca,cb){return ca+j+cb+l;
},"opera":qx.bom.client.Engine.VERSION<
9.5?
function(K,L){return h+L+l;
}:
function(bR,bS){return bR+j+bS+l;
},"default":function(cc,cd){return cc+j+cd+l;
}}),compileX:function(bv){return this._compile(u,bv);
},compileY:function(F){return this._compile(y,F);
},getX:qx.core.Variant.select(p,{"gecko":qx.bom.client.Engine.VERSION<
1.8?
function(a,b){var d=qx.bom.element.Style.get(a,m,b,false);

if(d===n){d=o;
}return d;
}:
function(X,Y){return qx.bom.element.Style.get(X,i,Y,false);
},"opera":qx.bom.client.Engine.VERSION<
9.5?
function(bh,bi){return qx.bom.element.Style.get(bh,m,bi,false);
}:
function(br,bs){return qx.bom.element.Style.get(br,i,bs,false);
},"default":function(U,V){return qx.bom.element.Style.get(U,i,V,false);
}}),setX:qx.core.Variant.select(p,{"gecko":qx.bom.client.Engine.VERSION<
1.8?
function(O,P){if(P==o){P=n;
}O.style.overflow=P;
}:
function(bC,bD){bC.style.overflowX=bD;
},"opera":qx.bom.client.Engine.VERSION<
9.5?
function(bn,bo){bn.style.overflow=bo;
}:
function(ce,cf){ce.style.overflowX=cf;
},"default":function(bp,bq){bp.style.overflowX=bq;
}}),resetX:qx.core.Variant.select(p,{"gecko":qx.bom.client.Engine.VERSION<
1.8?
function(bc){bc.style.overflow=q;
}:
function(bm){bm.style.overflowX=q;
},"opera":qx.bom.client.Engine.VERSION<
9.5?
function(bE,bF){bE.style.overflow=q;
}:
function(S,T){S.style.overflowX=q;
},"default":function(M){M.style.overflowX=q;
}}),getY:qx.core.Variant.select(p,{"gecko":qx.bom.client.Engine.VERSION<
1.8?
function(bz,bA){var bB=qx.bom.element.Style.get(bz,m,bA,false);

if(bB===n){bB=o;
}return bB;
}:
function(bG,bH){return qx.bom.element.Style.get(bG,k,bH,false);
},"opera":qx.bom.client.Engine.VERSION<
9.5?
function(bT,bU){return qx.bom.element.Style.get(bT,m,bU,false);
}:
function(bX,bY){return qx.bom.element.Style.get(bX,k,bY,false);
},"default":function(bP,bQ){return qx.bom.element.Style.get(bP,k,bQ,false);
}}),setY:qx.core.Variant.select(p,{"gecko":qx.bom.client.Engine.VERSION<
1.8?
function(I,J){if(J===o){J=n;
}I.style.overflow=J;
}:
function(e,f){e.style.overflowY=f;
},"opera":qx.bom.client.Engine.VERSION<
9.5?
function(Q,R){Q.style.overflow=R;
}:
function(G,H){G.style.overflowY=H;
},"default":function(bj,bk){bj.style.overflowY=bk;
}}),resetY:qx.core.Variant.select(p,{"gecko":qx.bom.client.Engine.VERSION<
1.8?
function(g){g.style.overflow=q;
}:
function(bg){bg.style.overflowY=q;
},"opera":qx.bom.client.Engine.VERSION<
9.5?
function(bt,bu){bt.style.overflow=q;
}:
function(bV,bW){bV.style.overflowY=q;
},"default":function(bl){bl.style.overflowY=q;
}})}});
})();
(function(){var u="auto",t="px",s=",",r="clip:auto;",q="rect(",p=");",o="",n=")",m="qx.bom.element.Clip",l="string",i="rect(auto)",k="clip:rect(",j="clip",h="rect(auto,auto,auto,auto)";
qx.Class.define(m,{statics:{compile:function(a){if(!a){return r;
}var f=a.left;
var top=a.top;
var e=a.width;
var d=a.height;
var b,c;

if(f==null){b=(e==null?u:e+t);
f=u;
}else{b=(e==null?u:f+e+t);
f=f+t;
}
if(top==null){c=(d==null?u:d+t);
top=u;
}else{c=(d==null?u:top+d+t);
top=top+t;
}return k+top+s+b+s+c+s+f+p;
},get:function(v,w){var y=qx.bom.element.Style.get(v,j,w,false);
var D,top,B,A;
var x,z;

if(typeof y===l&&y!==u&&y!==o){y=qx.lang.String.trim(y);
if(/\((.*)\)/.test(y)){var C=RegExp.$1.split(s);
top=qx.lang.String.trim(C[0]);
x=qx.lang.String.trim(C[1]);
z=qx.lang.String.trim(C[2]);
D=qx.lang.String.trim(C[3]);
if(D===u){D=null;
}
if(top===u){top=null;
}
if(x===u){x=null;
}
if(z===u){z=null;
}if(top!=null){top=parseInt(top,10);
}
if(x!=null){x=parseInt(x,10);
}
if(z!=null){z=parseInt(z,10);
}
if(D!=null){D=parseInt(D,10);
}if(x!=null&&D!=null){B=x-D;
}else if(x!=null){B=x;
}
if(z!=null&&top!=null){A=z-top;
}else if(z!=null){A=z;
}}else{throw new Error("Could not parse clip string: "+y);
}}return {left:D||null,top:top||null,width:B||null,height:A||null};
},set:function(E,F){if(!F){E.style.clip=h;
return;
}var K=F.left;
var top=F.top;
var J=F.width;
var I=F.height;
var G,H;

if(K==null){G=(J==null?u:J+t);
K=u;
}else{G=(J==null?u:K+J+t);
K=K+t;
}
if(top==null){H=(I==null?u:I+t);
top=u;
}else{H=(I==null?u:top+I+t);
top=top+t;
}E.style.clip=q+top+s+G+s+H+s+K+n;
},reset:function(g){g.style.clip=qx.bom.client.Engine.MSHTML?i:u;
}}});
})();
(function(){var l="n-resize",k="e-resize",j="nw-resize",i="ne-resize",h="",g="cursor:",f="qx.client",e=";",d="qx.bom.element.Cursor",c="cursor",b="hand";
qx.Class.define(d,{statics:{__hh:qx.core.Variant.select(f,{"mshtml":{"cursor":b,"ew-resize":k,"ns-resize":l,"nesw-resize":i,"nwse-resize":j},"opera":{"col-resize":k,"row-resize":l,"ew-resize":k,"ns-resize":l,"nesw-resize":i,"nwse-resize":j},"default":{}}),compile:function(m){return g+(this.__hh[m]||m)+e;
},get:function(n,o){return qx.bom.element.Style.get(n,c,o,false);
},set:function(p,q){p.style.cursor=this.__hh[q]||q;
},reset:function(a){a.style.cursor=h;
}}});
})();
(function(){var x="",w="qx.client",v=";",u="filter",t="opacity:",s="opacity",r="MozOpacity",q=");",p=")",o="zoom:1;filter:alpha(opacity=",l="qx.bom.element.Opacity",n="alpha(opacity=",m="-moz-opacity:";
qx.Class.define(l,{statics:{compile:qx.core.Variant.select(w,{"mshtml":function(D){if(D>=1){return x;
}
if(D<0.00001){D=0;
}return o+(D*100)+q;
},"gecko":function(a){if(a==1){a=0.999999;
}
if(qx.bom.client.Engine.VERSION<1.7){return m+a+v;
}else{return t+a+v;
}},"default":function(b){if(b==1){return x;
}return t+b+v;
}}),set:qx.core.Variant.select(w,{"mshtml":function(A,B){var C=qx.bom.element.Style.get(A,u,qx.bom.element.Style.COMPUTED_MODE,false);
if(B>=1){A.style.filter=C.replace(/alpha\([^\)]*\)/gi,x);
return;
}
if(B<0.00001){B=0;
}if(!A.currentStyle||!A.currentStyle.hasLayout){A.style.zoom=1;
}A.style.filter=C.replace(/alpha\([^\)]*\)/gi,x)+n+B*100+p;
},"gecko":function(y,z){if(z==1){z=0.999999;
}
if(qx.bom.client.Engine.VERSION<1.7){y.style.MozOpacity=z;
}else{y.style.opacity=z;
}},"default":function(j,k){if(k==1){k=x;
}j.style.opacity=k;
}}),reset:qx.core.Variant.select(w,{"mshtml":function(I){var J=qx.bom.element.Style.get(I,u,qx.bom.element.Style.COMPUTED_MODE,false);
I.style.filter=J.replace(/alpha\([^\)]*\)/gi,x);
},"gecko":function(H){if(qx.bom.client.Engine.VERSION<1.7){H.style.MozOpacity=x;
}else{H.style.opacity=x;
}},"default":function(K){K.style.opacity=x;
}}),get:qx.core.Variant.select(w,{"mshtml":function(f,g){var h=qx.bom.element.Style.get(f,u,g,false);

if(h){var i=h.match(/alpha\(opacity=(.*)\)/);

if(i&&i[1]){return parseFloat(i[1])/100;
}}return 1.0;
},"gecko":function(c,d){var e=qx.bom.element.Style.get(c,qx.bom.client.Engine.VERSION<1.7?r:s,d,false);

if(e==0.999999){e=1.0;
}
if(e!=null){return parseFloat(e);
}return 1.0;
},"default":function(E,F){var G=qx.bom.element.Style.get(E,s,F,false);

if(G!=null){return parseFloat(G);
}return 1.0;
}})}});
})();
(function(){var v="qx.client",u="",t="boxSizing",s="box-sizing",r=":",q="border-box",p="qx.bom.element.BoxSizing",o="KhtmlBoxSizing",n="-moz-box-sizing",m="WebkitBoxSizing",h=";",k="-khtml-box-sizing",j="content-box",g="-webkit-box-sizing",f="MozBoxSizing";
qx.Class.define(p,{statics:{__hi:qx.core.Variant.select(v,{"mshtml":null,"webkit":[t,o,m],"gecko":[f],"opera":[t]}),__hj:qx.core.Variant.select(v,{"mshtml":null,"webkit":[s,k,g],"gecko":[n],"opera":[s]}),__hk:{tags:{button:true,select:true},types:{search:true,button:true,submit:true,reset:true,checkbox:true,radio:true}},__hl:function(x){var y=this.__hk;
return y.tags[x.tagName.toLowerCase()]||y.types[x.type];
},compile:qx.core.Variant.select(v,{"mshtml":function(D){{};
},"default":function(E){var G=this.__hj;
var F=u;

if(G){for(var i=0,l=G.length;i<l;i++){F+=G[i]+r+E+h;
}}return F;
}}),get:qx.core.Variant.select(v,{"mshtml":function(w){if(qx.bom.Document.isStandardMode(qx.dom.Node.getDocument(w))){if(!this.__hl(w)){return j;
}}return q;
},"default":function(A){var C=this.__hi;
var B;

if(C){for(var i=0,l=C.length;i<l;i++){B=qx.bom.element.Style.get(A,C[i],null,false);

if(B!=null&&B!==u){return B;
}}}return u;
}}),set:qx.core.Variant.select(v,{"mshtml":function(a,b){{};
},"default":function(c,d){var e=this.__hi;

if(e){for(var i=0,l=e.length;i<l;i++){c.style[e[i]]=d;
}}}}),reset:function(z){this.set(z,u);
}}});
})();
(function(){var K="",J="qx.client",I="userSelect",H="style",G="MozUserModify",F="px",E="float",D="borderImage",C="styleFloat",B="appearance",be="pixelHeight",bd='Ms',bc=":",bb="cssFloat",ba="pixelTop",Y="pixelLeft",X='O',W="qx.bom.element.Style",V='Khtml',U='string',R="pixelRight",S='Moz',P="pixelWidth",Q="pixelBottom",N=";",O="textOverflow",L="userModify",M='Webkit',T="WebkitUserModify";
qx.Class.define(W,{statics:{__hm:function(){var bo=[B,I,O,D];
var bs={};
var bp=document.documentElement.style;
var bt=[S,M,V,X,bd];

for(var i=0,l=bo.length;i<l;i++){var bu=bo[i];
var bq=bu;

if(bp[bu]){bs[bq]=bu;
continue;
}bu=qx.lang.String.firstUp(bu);

for(var j=0,bv=bt.length;j<bv;j++){var br=bt[j]+bu;

if(typeof bp[br]==U){bs[bq]=br;
break;
}}}this.__hn=bs;
this.__hn[L]=qx.core.Variant.select(J,{"gecko":G,"webkit":T,"default":I});
this.__ho={};

for(var bq in bs){this.__ho[bq]=this.__hs(bs[bq]);
}this.__hn[E]=qx.core.Variant.select(J,{"mshtml":C,"default":bb});
},__hp:{width:P,height:be,left:Y,right:R,top:ba,bottom:Q},__hq:{clip:qx.bom.element.Clip,cursor:qx.bom.element.Cursor,opacity:qx.bom.element.Opacity,boxSizing:qx.bom.element.BoxSizing,overflowX:{set:qx.lang.Function.bind(qx.bom.element.Overflow.setX,qx.bom.element.Overflow),get:qx.lang.Function.bind(qx.bom.element.Overflow.getX,qx.bom.element.Overflow),reset:qx.lang.Function.bind(qx.bom.element.Overflow.resetX,qx.bom.element.Overflow),compile:qx.lang.Function.bind(qx.bom.element.Overflow.compileX,qx.bom.element.Overflow)},overflowY:{set:qx.lang.Function.bind(qx.bom.element.Overflow.setY,qx.bom.element.Overflow),get:qx.lang.Function.bind(qx.bom.element.Overflow.getY,qx.bom.element.Overflow),reset:qx.lang.Function.bind(qx.bom.element.Overflow.resetY,qx.bom.element.Overflow),compile:qx.lang.Function.bind(qx.bom.element.Overflow.compileY,qx.bom.element.Overflow)}},compile:function(p){var r=[];
var t=this.__hq;
var s=this.__ho;
var name,q;

for(name in p){q=p[name];

if(q==null){continue;
}name=s[name]||name;
if(t[name]){r.push(t[name].compile(q));
}else{r.push(this.__hs(name),bc,q,N);
}}return r.join(K);
},__hr:{},__hs:function(b){var c=this.__hr;
var d=c[b];

if(!d){d=c[b]=qx.lang.String.hyphenate(b);
}return d;
},setCss:qx.core.Variant.select(J,{"mshtml":function(bf,bg){bf.style.cssText=bg;
},"default":function(e,f){e.setAttribute(H,f);
}}),getCss:qx.core.Variant.select(J,{"mshtml":function(g){return g.style.cssText.toLowerCase();
},"default":function(a){return a.getAttribute(H);
}}),isPropertySupported:function(bl){return (this.__hq[bl]||this.__hn[bl]||bl in document.documentElement.style);
},COMPUTED_MODE:1,CASCADED_MODE:2,LOCAL_MODE:3,set:function(bh,name,bi,bj){{};
name=this.__hn[name]||name;
if(bj!==false&&this.__hq[name]){return this.__hq[name].set(bh,bi);
}else{bh.style[name]=bi!==null?bi:K;
}},setStyles:function(bw,bx,by){{};
var bB=this.__hn;
var bD=this.__hq;
var bz=bw.style;

for(var bC in bx){var bA=bx[bC];
var name=bB[bC]||bC;

if(bA===undefined){if(by!==false&&bD[name]){bD[name].reset(bw);
}else{bz[name]=K;
}}else{if(by!==false&&bD[name]){bD[name].set(bw,bA);
}else{bz[name]=bA!==null?bA:K;
}}}},reset:function(bm,name,bn){name=this.__hn[name]||name;
if(bn!==false&&this.__hq[name]){return this.__hq[name].reset(bm);
}else{bm.style[name]=K;
}},get:qx.core.Variant.select(J,{"mshtml":function(u,name,v,w){name=this.__hn[name]||name;
if(w!==false&&this.__hq[name]){return this.__hq[name].get(u,v);
}if(!u.currentStyle){return u.style[name]||K;
}switch(v){case this.LOCAL_MODE:return u.style[name]||K;
case this.CASCADED_MODE:return u.currentStyle[name]||K;
default:var A=u.currentStyle[name]||K;
if(/^-?[\.\d]+(px)?$/i.test(A)){return A;
}var z=this.__hp[name];

if(z){var x=u.style[name];
u.style[name]=A||0;
var y=u.style[z]+F;
u.style[name]=x;
return y;
}if(/^-?[\.\d]+(em|pt|%)?$/i.test(A)){throw new Error("Untranslated computed property value: "+name+". Only pixel values work well across different clients.");
}return A;
}},"default":function(h,name,k,m){name=this.__hn[name]||name;
if(m!==false&&this.__hq[name]){return this.__hq[name].get(h,k);
}switch(k){case this.LOCAL_MODE:return h.style[name]||K;
case this.CASCADED_MODE:if(h.currentStyle){return h.currentStyle[name]||K;
}throw new Error("Cascaded styles are not supported in this browser!");
default:var n=qx.dom.Node.getDocument(h);
var o=n.defaultView.getComputedStyle(h,null);
return o?o[name]:K;
}}})},defer:function(bk){bk.__hm();
}});
})();
(function(){var k="borderTopWidth",j="borderLeftWidth",i="marginTop",h="marginLeft",g="scroll",f="qx.client",e="border-box",d="borderBottomWidth",c="borderRightWidth",b="auto",z="padding",y="qx.bom.element.Location",x="paddingLeft",w="static",v="marginBottom",u="visible",t="BODY",s="paddingBottom",r="paddingTop",q="marginRight",o="position",p="margin",m="overflow",n="paddingRight",l="border";
qx.Class.define(y,{statics:{__ht:function(V,W){return qx.bom.element.Style.get(V,W,qx.bom.element.Style.COMPUTED_MODE,false);
},__hu:function(bc,bd){return parseInt(qx.bom.element.Style.get(bc,bd,qx.bom.element.Style.COMPUTED_MODE,false),10)||0;
},__hv:function(K){var N=0,top=0;
if(K.getBoundingClientRect&&!qx.bom.client.Engine.OPERA){var M=qx.dom.Node.getWindow(K);
N-=qx.bom.Viewport.getScrollLeft(M);
top-=qx.bom.Viewport.getScrollTop(M);
}else{var L=qx.dom.Node.getDocument(K).body;
K=K.parentNode;
while(K&&K!=L){N+=K.scrollLeft;
top+=K.scrollTop;
K=K.parentNode;
}}return {left:N,top:top};
},__hw:qx.core.Variant.select(f,{"mshtml":function(by){var bA=qx.dom.Node.getDocument(by);
var bz=bA.body;
var bB=0;
var top=0;
bB-=bz.clientLeft+bA.documentElement.clientLeft;
top-=bz.clientTop+bA.documentElement.clientTop;

if(qx.bom.client.Feature.STANDARD_MODE){bB+=this.__hu(bz,j);
top+=this.__hu(bz,k);
}return {left:bB,top:top};
},"webkit":function(bu){var bw=qx.dom.Node.getDocument(bu);
var bv=bw.body;
var bx=bv.offsetLeft;
var top=bv.offsetTop;
if(qx.bom.client.Engine.VERSION<530.17){bx+=this.__hu(bv,j);
top+=this.__hu(bv,k);
}return {left:bx,top:top};
},"gecko":function(Q){var R=qx.dom.Node.getDocument(Q).body;
var S=R.offsetLeft;
var top=R.offsetTop;
if(qx.bom.client.Engine.VERSION<1.9){S+=this.__hu(R,h);
top+=this.__hu(R,i);
}if(qx.bom.element.BoxSizing.get(R)!==e){S+=this.__hu(R,j);
top+=this.__hu(R,k);
}return {left:S,top:top};
},"default":function(bK){var bL=qx.dom.Node.getDocument(bK).body;
var bM=bL.offsetLeft;
var top=bL.offsetTop;
return {left:bM,top:top};
}}),__hx:qx.core.Variant.select(f,{"mshtml|webkit":function(be){var bg=qx.dom.Node.getDocument(be);
if(be.getBoundingClientRect){var bh=be.getBoundingClientRect();
var bi=bh.left;
var top=bh.top;
}else{var bi=be.offsetLeft;
var top=be.offsetTop;
be=be.offsetParent;
var bf=bg.body;
while(be&&be!=bf){bi+=be.offsetLeft;
top+=be.offsetTop;
bi+=this.__hu(be,j);
top+=this.__hu(be,k);
be=be.offsetParent;
}}return {left:bi,top:top};
},"gecko":function(D){if(D.getBoundingClientRect){var G=D.getBoundingClientRect();
var H=Math.round(G.left);
var top=Math.round(G.top);
}else{var H=0;
var top=0;
var E=qx.dom.Node.getDocument(D).body;
var F=qx.bom.element.BoxSizing;

if(F.get(D)!==e){H-=this.__hu(D,j);
top-=this.__hu(D,k);
}
while(D&&D!==E){H+=D.offsetLeft;
top+=D.offsetTop;
if(F.get(D)!==e){H+=this.__hu(D,j);
top+=this.__hu(D,k);
}if(D.parentNode&&this.__ht(D.parentNode,m)!=u){H+=this.__hu(D.parentNode,j);
top+=this.__hu(D.parentNode,k);
}D=D.offsetParent;
}}return {left:H,top:top};
},"default":function(bN){var bP=0;
var top=0;
var bO=qx.dom.Node.getDocument(bN).body;
while(bN&&bN!==bO){bP+=bN.offsetLeft;
top+=bN.offsetTop;
bN=bN.offsetParent;
}return {left:bP,top:top};
}}),get:function(bl,bm){if(bl.tagName==t){var location=this.__hy(bl);
var bt=location.left;
var top=location.top;
}else{var bn=this.__hw(bl);
var bs=this.__hx(bl);
var scroll=this.__hv(bl);
var bt=bs.left+bn.left-scroll.left;
var top=bs.top+bn.top-scroll.top;
}var bo=bt+bl.offsetWidth;
var bp=top+bl.offsetHeight;

if(bm){if(bm==z||bm==g){var bq=qx.bom.element.Overflow.getX(bl);

if(bq==g||bq==b){bo+=bl.scrollWidth-bl.offsetWidth+this.__hu(bl,j)+this.__hu(bl,c);
}var br=qx.bom.element.Overflow.getY(bl);

if(br==g||br==b){bp+=bl.scrollHeight-bl.offsetHeight+this.__hu(bl,k)+this.__hu(bl,d);
}}
switch(bm){case z:bt+=this.__hu(bl,x);
top+=this.__hu(bl,r);
bo-=this.__hu(bl,n);
bp-=this.__hu(bl,s);
case g:bt-=bl.scrollLeft;
top-=bl.scrollTop;
bo-=bl.scrollLeft;
bp-=bl.scrollTop;
case l:bt+=this.__hu(bl,j);
top+=this.__hu(bl,k);
bo-=this.__hu(bl,c);
bp-=this.__hu(bl,d);
break;
case p:bt-=this.__hu(bl,h);
top-=this.__hu(bl,i);
bo+=this.__hu(bl,q);
bp+=this.__hu(bl,v);
break;
}}return {left:bt,top:top,right:bo,bottom:bp};
},__hy:qx.core.Variant.select(f,{"default":function(X){var top=X.offsetTop+this.__hu(X,i);
var Y=X.offsetLeft+this.__hu(X,h);
return {left:Y,top:top};
},"mshtml":function(I){var top=I.offsetTop;
var J=I.offsetLeft;

if(!((qx.bom.client.Engine.VERSION<8||qx.bom.client.Engine.DOCUMENT_MODE<8)&&!qx.bom.client.Feature.QUIRKS_MODE)){top+=this.__hu(I,i);
J+=this.__hu(I,h);
}return {left:J,top:top};
},"gecko":function(ba){var top=ba.offsetTop+this.__hu(ba,i)+this.__hu(ba,j);
var bb=ba.offsetLeft+this.__hu(ba,h)+this.__hu(ba,k);
return {left:bb,top:top};
}}),getLeft:function(bC,bD){return this.get(bC,bD).left;
},getTop:function(T,U){return this.get(T,U).top;
},getRight:function(O,P){return this.get(O,P).right;
},getBottom:function(bj,bk){return this.get(bj,bk).bottom;
},getRelative:function(bE,bF,bG,bH){var bJ=this.get(bE,bG);
var bI=this.get(bF,bH);
return {left:bJ.left-bI.left,top:bJ.top-bI.top,right:bJ.right-bI.right,bottom:bJ.bottom-bI.bottom};
},getPosition:function(a){return this.getRelative(a,this.getOffsetParent(a));
},getOffsetParent:function(A){var C=A.offsetParent||document.body;
var B=qx.bom.element.Style;

while(C&&(!/^body|html$/i.test(C.tagName)&&B.get(C,o)===w)){C=C.offsetParent;
}return C;
}}});
})();
(function(){var E="qx.client",D="character",C="EndToEnd",B="input",A="textarea",z="StartToStart",y='character',x="qx.bom.Selection",w="button",v="#text",u="body";
qx.Class.define(x,{statics:{getSelectionObject:qx.core.Variant.select(E,{"mshtml":function(by){return by.selection;
},"default":function(V){return qx.dom.Node.getWindow(V).getSelection();
}}),get:qx.core.Variant.select(E,{"mshtml":function(bw){var bx=qx.bom.Range.get(qx.dom.Node.getDocument(bw));
return bx.text;
},"default":function(I){if(this.__hz(I)){return I.value.substring(I.selectionStart,I.selectionEnd);
}else{return this.getSelectionObject(qx.dom.Node.getDocument(I)).toString();
}}}),getLength:qx.core.Variant.select(E,{"mshtml":function(F){var H=this.get(F);
var G=qx.util.StringSplit.split(H,/\r\n/);
return H.length-(G.length-1);
},"opera":function(o){var t,r,p;

if(this.__hz(o)){var s=o.selectionStart;
var q=o.selectionEnd;
t=o.value.substring(s,q);
r=q-s;
}else{t=qx.bom.Selection.get(o);
r=t.length;
}p=qx.util.StringSplit.split(t,/\r\n/);
return r-(p.length-1);
},"default":function(k){if(this.__hz(k)){return k.selectionEnd-k.selectionStart;
}else{return this.get(k).length;
}}}),getStart:qx.core.Variant.select(E,{"mshtml":function(b){if(this.__hz(b)){var g=qx.bom.Range.get();
if(!b.contains(g.parentElement())){return -1;
}var h=qx.bom.Range.get(b);
var f=b.value.length;
h.moveToBookmark(g.getBookmark());
h.moveEnd(y,f);
return f-h.text.length;
}else{var h=qx.bom.Range.get(b);
var d=h.parentElement();
var i=qx.bom.Range.get();
i.moveToElementText(d);
var c=qx.bom.Range.get(qx.dom.Node.getBodyElement(b));
c.setEndPoint(z,h);
c.setEndPoint(C,i);
if(i.compareEndPoints(z,c)==0){return 0;
}var e;
var j=0;

while(true){e=c.moveStart(D,-1);
if(i.compareEndPoints(z,c)==0){break;
}if(e==0){break;
}else{j++;
}}return ++j;
}},"gecko|webkit":function(l){if(this.__hz(l)){return l.selectionStart;
}else{var n=qx.dom.Node.getDocument(l);
var m=this.getSelectionObject(n);
if(m.anchorOffset<m.focusOffset){return m.anchorOffset;
}else{return m.focusOffset;
}}},"default":function(N){if(this.__hz(N)){return N.selectionStart;
}else{return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(N)).anchorOffset;
}}}),getEnd:qx.core.Variant.select(E,{"mshtml":function(W){if(this.__hz(W)){var bc=qx.bom.Range.get();
if(!W.contains(bc.parentElement())){return -1;
}var bd=qx.bom.Range.get(W);
var bb=W.value.length;
bd.moveToBookmark(bc.getBookmark());
bd.moveStart(y,-bb);
return bd.text.length;
}else{var bd=qx.bom.Range.get(W);
var Y=bd.parentElement();
var be=qx.bom.Range.get();
be.moveToElementText(Y);
var bb=be.text.length;
var X=qx.bom.Range.get(qx.dom.Node.getBodyElement(W));
X.setEndPoint(C,bd);
X.setEndPoint(z,be);
if(be.compareEndPoints(C,X)==0){return bb-1;
}var ba;
var bf=0;

while(true){ba=X.moveEnd(D,1);
if(be.compareEndPoints(C,X)==0){break;
}if(ba==0){break;
}else{bf++;
}}return bb-(++bf);
}},"gecko|webkit":function(J){if(this.__hz(J)){return J.selectionEnd;
}else{var L=qx.dom.Node.getDocument(J);
var K=this.getSelectionObject(L);
if(K.focusOffset>K.anchorOffset){return K.focusOffset;
}else{return K.anchorOffset;
}}},"default":function(bp){if(this.__hz(bp)){return bp.selectionEnd;
}else{return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(bp)).focusOffset;
}}}),__hz:function(a){return qx.dom.Node.isElement(a)&&(a.nodeName.toLowerCase()==B||a.nodeName.toLowerCase()==A);
},set:qx.core.Variant.select(E,{"mshtml":function(bg,bh,bi){var bj;
if(qx.dom.Node.isDocument(bg)){bg=bg.body;
}
if(qx.dom.Node.isElement(bg)||qx.dom.Node.isText(bg)){switch(bg.nodeName.toLowerCase()){case B:case A:case w:if(bi===undefined){bi=bg.value.length;
}
if(bh>=0&&bh<=bg.value.length&&bi>=0&&bi<=bg.value.length){bj=qx.bom.Range.get(bg);
bj.collapse(true);
bj.moveStart(D,bh);
bj.moveEnd(D,bi-bh);
bj.select();
return true;
}break;
case v:if(bi===undefined){bi=bg.nodeValue.length;
}
if(bh>=0&&bh<=bg.nodeValue.length&&bi>=0&&bi<=bg.nodeValue.length){bj=qx.bom.Range.get(qx.dom.Node.getBodyElement(bg));
bj.moveToElementText(bg.parentNode);
bj.collapse(true);
bj.moveStart(D,bh);
bj.moveEnd(D,bi-bh);
bj.select();
return true;
}break;
default:if(bi===undefined){bi=bg.childNodes.length-1;
}if(bg.childNodes[bh]&&bg.childNodes[bi]){bj=qx.bom.Range.get(qx.dom.Node.getBodyElement(bg));
bj.moveToElementText(bg.childNodes[bh]);
bj.collapse(true);
var bk=qx.bom.Range.get(qx.dom.Node.getBodyElement(bg));
bk.moveToElementText(bg.childNodes[bi]);
bj.setEndPoint(C,bk);
bj.select();
return true;
}}}return false;
},"default":function(O,P,Q){var U=O.nodeName.toLowerCase();

if(qx.dom.Node.isElement(O)&&(U==B||U==A)){if(Q===undefined){Q=O.value.length;
}if(P>=0&&P<=O.value.length&&Q>=0&&Q<=O.value.length){O.focus();
O.select();
O.setSelectionRange(P,Q);
return true;
}}else{var S=false;
var T=qx.dom.Node.getWindow(O).getSelection();
var R=qx.bom.Range.get(O);
if(qx.dom.Node.isText(O)){if(Q===undefined){Q=O.length;
}
if(P>=0&&P<O.length&&Q>=0&&Q<=O.length){S=true;
}}else if(qx.dom.Node.isElement(O)){if(Q===undefined){Q=O.childNodes.length-1;
}
if(P>=0&&O.childNodes[P]&&Q>=0&&O.childNodes[Q]){S=true;
}}else if(qx.dom.Node.isDocument(O)){O=O.body;

if(Q===undefined){Q=O.childNodes.length-1;
}
if(P>=0&&O.childNodes[P]&&Q>=0&&O.childNodes[Q]){S=true;
}}
if(S){if(!T.isCollapsed){T.collapseToStart();
}R.setStart(O,P);
if(qx.dom.Node.isText(O)){R.setEnd(O,Q);
}else{R.setEndAfter(O.childNodes[Q]);
}if(T.rangeCount>0){T.removeAllRanges();
}T.addRange(R);
return true;
}}return false;
}}),setAll:function(M){return qx.bom.Selection.set(M,0);
},clear:qx.core.Variant.select(E,{"mshtml":function(bl){var bm=qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(bl));
var bn=qx.bom.Range.get(bl);
var parent=bn.parentElement();
var bo=qx.bom.Range.get(qx.dom.Node.getDocument(bl));
if(parent==bo.parentElement()&&parent==bl){bm.empty();
}},"default":function(bq){var bs=qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(bq));
var bu=bq.nodeName.toLowerCase();
if(qx.dom.Node.isElement(bq)&&(bu==B||bu==A)){bq.setSelectionRange(0,0);
qx.bom.Element.blur(bq);
}else if(qx.dom.Node.isDocument(bq)||bu==u){bs.collapse(bq.body?bq.body:bq,0);
}else{var bt=qx.bom.Range.get(bq);

if(!bt.collapsed){var bv;
var br=bt.commonAncestorContainer;
if(qx.dom.Node.isElement(bq)&&qx.dom.Node.isText(br)){bv=br.parentNode;
}else{bv=br;
}
if(bv==bq){bs.collapse(bq,0);
}}}}})}});
})();
(function(){var l="button",k="qx.bom.Range",j="text",i="password",h="file",g="submit",f="reset",e="textarea",d="input",c="hidden",a="qx.client",b="body";
qx.Class.define(k,{statics:{get:qx.core.Variant.select(a,{"mshtml":function(p){if(qx.dom.Node.isElement(p)){switch(p.nodeName.toLowerCase()){case d:switch(p.type){case j:case i:case c:case l:case f:case h:case g:return p.createTextRange();
break;
default:return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(p)).createRange();
}break;
case e:case b:case l:return p.createTextRange();
break;
default:return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(p)).createRange();
}}else{if(p==null){p=window;
}return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(p)).createRange();
}},"default":function(m){var n=qx.dom.Node.getDocument(m);
var o=qx.bom.Selection.getSelectionObject(n);

if(o.rangeCount>0){return o.getRangeAt(0);
}else{return n.createRange();
}}})}});
})();
(function(){var f="",e="g",d="$",c="qx.util.StringSplit",b="\\$&",a="^";
qx.Class.define(c,{statics:{split:function(g,h,k){var n=f;
if(h===undefined){return [g.toString()];
}else if(h===null||h.constructor!==RegExp){h=new RegExp(String(h).replace(/[.*+?^${}()|[\]\/\\]/g,b),e);
}else{n=h.toString().replace(/^[\S\s]+\//,f);

if(!h.global){h=new RegExp(h.source,e+n);
}}var m=new RegExp(a+h.source+d,n);
if(k===undefined||+k<0){k=false;
}else{k=Math.floor(+k);

if(!k){return [];
}}var p,o=[],l=0,i=0;

while((k?i++<=k:true)&&(p=h.exec(g))){if((p[0].length===0)&&(h.lastIndex>p.index)){h.lastIndex--;
}
if(h.lastIndex>l){if(p.length>1){p[0].replace(m,function(){for(var j=1;j<arguments.length-2;j++){if(arguments[j]===undefined){p[j]=undefined;
}}});
}o=o.concat(g.substring(l,p.index),(p.index===g.length?[]:p.slice(1)));
l=h.lastIndex;
}
if(p[0].length===0){h.lastIndex++;
}}return (l===g.length)?(h.test(f)?o:o.concat(f)):(k?o:o.concat(g.substring(l)));
}}});
})();
(function(){var b="qx.ui.core.queue.Widget",a="widget";
qx.Class.define(b,{statics:{__hA:{},remove:function(c){delete this.__hA[c.$$hash];
},add:function(g){var h=this.__hA;

if(h[g.$$hash]){return;
}h[g.$$hash]=g;
qx.ui.core.queue.Manager.scheduleFlush(a);
},flush:function(){var d=this.__hA;
var f;

for(var e in d){f=d[e];
delete d[e];
f.syncWidget();
}for(var e in d){return;
}this.__hA={};
}}});
})();
(function(){var h="qx.ui.core.queue.Visibility",g="visibility";
qx.Class.define(h,{statics:{__hB:{},__hC:{},remove:function(i){var j=i.$$hash;
delete this.__hC[j];
delete this.__hB[j];
},isVisible:function(a){return this.__hC[a.$$hash]||false;
},__hD:function(k){var m=this.__hC;
var l=k.$$hash;
var n;
if(k.isExcluded()){n=false;
}else{var parent=k.$$parent;

if(parent){n=this.__hD(parent);
}else{n=k.isRootWidget();
}}return m[l]=n;
},add:function(o){var p=this.__hB;

if(p[o.$$hash]){return;
}p[o.$$hash]=o;
qx.ui.core.queue.Manager.scheduleFlush(g);
},flush:function(){var b=this.__hB;
var f=this.__hC;
for(var c in b){if(f[c]!=null){b[c].addChildrenToQueue(b);
}}var e={};

for(var c in b){e[c]=f[c];
f[c]=null;
}for(var c in b){var d=b[c];
delete b[c];
if(f[c]==null){this.__hD(d);
}if(f[c]&&f[c]!=e[c]){d.checkAppearanceNeeds();
}}this.__hB={};
}}});
})();
(function(){var b="appearance",a="qx.ui.core.queue.Appearance";
qx.Class.define(a,{statics:{__hE:{},remove:function(h){delete this.__hE[h.$$hash];
},add:function(i){var j=this.__hE;

if(j[i.$$hash]){return;
}j[i.$$hash]=i;
qx.ui.core.queue.Manager.scheduleFlush(b);
},has:function(c){return !!this.__hE[c.$$hash];
},flush:function(){var g=qx.ui.core.queue.Visibility;
var d=this.__hE;
var f;

for(var e in d){f=d[e];
delete d[e];
if(g.isVisible(f)){f.syncAppearance();
}else{f.$$stateChanges=true;
}}}}});
})();
(function(){var e="dispose",d="qx.ui.core.queue.Dispose";
qx.Class.define(d,{statics:{__hF:{},add:function(f){var g=this.__hF;

if(g[f.$$hash]){return;
}g[f.$$hash]=f;
qx.ui.core.queue.Manager.scheduleFlush(e);
},flush:function(){var a=this.__hF;

for(var c in a){var b=a[c];
delete a[c];
b.dispose();
}for(var c in a){return;
}this.__hF={};
}}});
})();
(function(){var e="none",d="qx.html.Decorator",c="absolute";
qx.Class.define(d,{extend:qx.html.Element,construct:function(g,h){var i={position:c,top:0,left:0};

if(qx.bom.client.Feature.CSS_POINTER_EVENTS){i.pointerEvents=e;
}qx.html.Element.call(this,null,i);
this.__hG=g;
this.__hH=h||g.toHashCode();
this.useMarkup(g.getMarkup());
},members:{__hH:null,__hG:null,getId:function(){return this.__hH;
},getDecorator:function(){return this.__hG;
},resize:function(a,b){this.__hG.resize(this.getDomElement(),a,b);
},tint:function(f){this.__hG.tint(this.getDomElement(),f);
},getInsets:function(){return this.__hG.getInsets();
}},destruct:function(){this.__hG=null;
}});
})();
(function(){var k="blur",j="focus",h="input",g="load",f="qx.ui.core.EventHandler",e="activate";
qx.Class.define(f,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(){qx.core.Object.call(this);
this.__hI=qx.event.Registration.getManager(window);
},statics:{PRIORITY:qx.event.Registration.PRIORITY_FIRST,SUPPORTED_TYPES:{mousemove:1,mouseover:1,mouseout:1,mousedown:1,mouseup:1,click:1,dblclick:1,contextmenu:1,mousewheel:1,keyup:1,keydown:1,keypress:1,keyinput:1,capture:1,losecapture:1,focusin:1,focusout:1,focus:1,blur:1,activate:1,deactivate:1,appear:1,disappear:1,dragstart:1,dragend:1,dragover:1,dragleave:1,drop:1,drag:1,dragchange:1,droprequest:1},IGNORE_CAN_HANDLE:false},members:{__hI:null,__hJ:{focusin:1,focusout:1,focus:1,blur:1},__hK:{mouseover:1,mouseout:1,appear:1,disappear:1},canHandleEvent:function(m,n){return m instanceof qx.ui.core.Widget;
},_dispatchEvent:function(t){var y=t.getTarget();
var x=qx.ui.core.Widget.getWidgetByElement(y);
var z=false;

while(x&&x.isAnonymous()){var z=true;
x=x.getLayoutParent();
}if(x&&z&&t.getType()==e){x.getContainerElement().activate();
}if(this.__hJ[t.getType()]){x=x&&x.getFocusTarget();
if(!x){return;
}}if(t.getRelatedTarget){var G=t.getRelatedTarget();
var F=qx.ui.core.Widget.getWidgetByElement(G);

while(F&&F.isAnonymous()){F=F.getLayoutParent();
}
if(F){if(this.__hJ[t.getType()]){F=F.getFocusTarget();
}if(F===x){return;
}}}var B=t.getCurrentTarget();
var D=qx.ui.core.Widget.getWidgetByElement(B);

if(!D||D.isAnonymous()){return;
}if(this.__hJ[t.getType()]){D=D.getFocusTarget();
}var E=t.getType();

if(!D||!(D.isEnabled()||this.__hK[E])){return;
}var u=t.getEventPhase()==qx.event.type.Event.CAPTURING_PHASE;
var A=this.__hI.getListeners(D,E,u);

if(!A||A.length===0){return;
}var v=qx.event.Pool.getInstance().getObject(t.constructor);
t.clone(v);
v.setTarget(x);
v.setRelatedTarget(F||null);
v.setCurrentTarget(D);
var H=t.getOriginalTarget();

if(H){var w=qx.ui.core.Widget.getWidgetByElement(H);

while(w&&w.isAnonymous()){w=w.getLayoutParent();
}v.setOriginalTarget(w);
}else{v.setOriginalTarget(y);
}for(var i=0,l=A.length;i<l;i++){var C=A[i].context||D;
A[i].handler.call(C,v);
}if(v.getPropagationStopped()){t.stopPropagation();
}
if(v.getDefaultPrevented()){t.preventDefault();
}qx.event.Pool.getInstance().poolObject(v);
},registerEvent:function(a,b,c){var d;

if(b===j||b===k){d=a.getFocusElement();
}else if(b===g||b===h){d=a.getContentElement();
}else{d=a.getContainerElement();
}
if(d){d.addListener(b,this._dispatchEvent,this,c);
}},unregisterEvent:function(p,q,r){var s;

if(q===j||q===k){s=p.getFocusElement();
}else if(q===g||q===h){s=p.getContentElement();
}else{s=p.getContainerElement();
}
if(s){s.removeListener(q,this._dispatchEvent,this,r);
}}},destruct:function(){this.__hI=null;
},defer:function(o){qx.event.Registration.addHandler(o);
}});
})();
(function(){var p="/",o="mshtml",n="",m="qx.client",l="?",k="string",j="qx.util.ResourceManager",i="singleton";
qx.Class.define(j,{extend:qx.core.Object,type:i,statics:{__hL:qx.$$resources||{},__hM:{}},members:{has:function(q){return !!this.self(arguments).__hL[q];
},getData:function(v){return this.self(arguments).__hL[v]||null;
},getImageWidth:function(y){var z=this.self(arguments).__hL[y];
return z?z[0]:null;
},getImageHeight:function(w){var x=this.self(arguments).__hL[w];
return x?x[1]:null;
},getImageFormat:function(A){var B=this.self(arguments).__hL[A];
return B?B[2]:null;
},isClippedImage:function(a){var b=this.self(arguments).__hL[a];
return b&&b.length>4;
},toUri:function(r){if(r==null){return r;
}var s=this.self(arguments).__hL[r];

if(!s){return r;
}
if(typeof s===k){var u=s;
}else{var u=s[3];
if(!u){return r;
}}var t=n;

if(qx.core.Variant.isSet(m,o)&&qx.bom.client.Feature.SSL){t=this.self(arguments).__hM[u];
}return t+qx.$$libraries[u].resourceUri+p+r;
}},defer:function(c){if(qx.core.Variant.isSet(m,o)){if(qx.bom.client.Feature.SSL){for(var g in qx.$$libraries){var e;

if(qx.$$libraries[g].resourceUri){e=qx.$$libraries[g].resourceUri;
}else{c.__hM[g]=n;
continue;
}if(e.match(/^\/\//)!=null){c.__hM[g]=window.location.protocol;
}else if(e.match(/^\.\//)!=null){var d=document.URL;
c.__hM[g]=d.substring(0,d.lastIndexOf(p)+1);
}else if(e.match(/^http/)!=null){}else{var h=window.location.href.indexOf(l);
var f;

if(h==-1){f=window.location.href;
}else{f=window.location.href.substring(0,h);
}c.__hM[g]=f.substring(0,f.lastIndexOf(p)+1);
}}}}}});
})();
(function(){var c="qx.bom.client.Locale",b="-",a="";
qx.Class.define(c,{statics:{LOCALE:"",VARIANT:"",__hN:function(){var d=(navigator.userLanguage||navigator.language).toLowerCase();
var f=a;
var e=d.indexOf(b);

if(e!=-1){f=d.substr(e+1);
d=d.substr(0,e);
}this.LOCALE=d;
this.VARIANT=f;
}},defer:function(g){g.__hN();
}});
})();
(function(){var t="",s='indexOf',r='slice',q='concat',p='toLocaleLowerCase',o="qx.type.BaseString",n='match',m='toLocaleUpperCase',k='search',j='replace',c='toLowerCase',h='charCodeAt',f='split',b='substring',a='lastIndexOf',e='substr',d='toUpperCase',g='charAt';
qx.Class.define(o,{extend:Object,construct:function(u){var u=u||t;
this.__hO=u;
this.length=u.length;
},members:{$$isString:true,length:0,__hO:null,toString:function(){return this.__hO;
},charAt:null,valueOf:null,charCodeAt:null,concat:null,indexOf:null,lastIndexOf:null,match:null,replace:null,search:null,slice:null,split:null,substr:null,substring:null,toLowerCase:null,toUpperCase:null,toHashCode:function(){return qx.core.ObjectRegistry.toHashCode(this);
},toLocaleLowerCase:null,toLocaleUpperCase:null,base:function(y,z){return qx.core.Object.prototype.base.apply(this,arguments);
}},defer:function(v,w){{};
var x=[g,h,q,s,a,n,j,k,r,f,e,b,c,d,p,m];
w.valueOf=w.toString;

if(new v(t).valueOf()==null){delete w.valueOf;
}
for(var i=0,l=x.length;i<l;i++){w[x[i]]=String.prototype[x[i]];
}}});
})();
(function(){var a="qx.locale.LocalizedString";
qx.Class.define(a,{extend:qx.type.BaseString,construct:function(b,c,d){qx.type.BaseString.call(this,b);
this.__hP=c;
this.__hQ=d;
},members:{__hP:null,__hQ:null,translate:function(){return qx.locale.Manager.getInstance().translate(this.__hP,this.__hQ);
}}});
})();
(function(){var O="_",N="",M="_applyLocale",L="changeLocale",K="C",J="qx.dynlocale",I="on",H="qx.locale.Manager",G="String",F="singleton";
qx.Class.define(H,{type:F,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__hR=qx.$$translations||{};
this.__hS=qx.$$locales||{};
var g=qx.bom.client.Locale;
var e=g.LOCALE;
var f=g.VARIANT;

if(f!==N){e+=O+f;
}this.setLocale(e||this.__hT);
},statics:{tr:function(be,bf){var bg=qx.lang.Array.fromArguments(arguments);
bg.splice(0,1);
return qx.locale.Manager.getInstance().translate(be,bg);
},trn:function(q,r,s,t){var u=qx.lang.Array.fromArguments(arguments);
u.splice(0,3);
if(s!=1){return qx.locale.Manager.getInstance().translate(r,u);
}else{return qx.locale.Manager.getInstance().translate(q,u);
}},trc:function(h,j,k){var l=qx.lang.Array.fromArguments(arguments);
l.splice(0,2);
return qx.locale.Manager.getInstance().translate(j,l);
},marktr:function(bd){return bd;
}},properties:{locale:{check:G,nullable:true,apply:M,event:L}},members:{__hT:K,__hU:null,__hV:null,__hR:null,__hS:null,getLanguage:function(){return this.__hV;
},getTerritory:function(){return this.getLocale().split(O)[1]||N;
},getAvailableLocales:function(){var bc=[];

for(var bb in this.__hS){if(bb!=this.__hT){bc.push(bb);
}}return bc;
},__hW:function(P){var R;
var Q=P.indexOf(O);

if(Q==-1){R=P;
}else{R=P.substring(0,Q);
}return R;
},_applyLocale:function(v,w){this.__hU=v;
this.__hV=this.__hW(v);
},addTranslation:function(W,X){var Y=this.__hR;

if(Y[W]){for(var ba in X){Y[W][ba]=X[ba];
}}else{Y[W]=X;
}},addLocale:function(a,b){var c=this.__hS;

if(c[a]){for(var d in b){c[a][d]=b[d];
}}else{c[a]=b;
}},translate:function(m,n,o){var p=this.__hR;
return this.__hX(p,m,n,o);
},localize:function(S,T,U){var V=this.__hS;
return this.__hX(V,S,T,U);
},__hX:function(x,y,z,A){var B;

if(!x){return y;
}
if(A){var D=this.__hW(A);
}else{A=this.__hU;
D=this.__hV;
}if(!B&&x[A]){B=x[A][y];
}if(!B&&x[D]){B=x[D][y];
}if(!B&&x[this.__hT]){B=x[this.__hT][y];
}
if(!B){B=y;
}
if(z.length>0){var C=[];

for(var i=0;i<z.length;i++){var E=z[i];

if(E&&E.translate){C[i]=E.translate();
}else{C[i]=E;
}}B=qx.lang.String.format(B,C);
}
if(qx.core.Variant.isSet(J,I)){B=new qx.locale.LocalizedString(B,y,z);
}return B;
}},destruct:function(){this.__hR=this.__hS=null;
}});
})();
(function(){var t="px",s="qx.client",r="div",q="img",p="",o="no-repeat",n="scale-x",m="mshtml",l="scale",k="scale-y",O="qx/icon",N="repeat",M=".png",L="crop",K="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='",J='<div style="',I="repeat-y",H='<img src="',G="qx.bom.element.Decoration",F="', sizingMethod='",A="png",B="')",y='"></div>',z='"/>',w='" style="',x="none",u="webkit",v=" ",C="repeat-x",D="DXImageTransform.Microsoft.AlphaImageLoader",E="absolute";
qx.Class.define(G,{statics:{DEBUG:false,__hY:{},__ia:qx.core.Variant.isSet(s,m),__ib:qx.core.Variant.select(s,{"mshtml":{"scale-x":true,"scale-y":true,"scale":true,"no-repeat":true},"default":null}),__ic:{"scale-x":q,"scale-y":q,"scale":q,"repeat":r,"no-repeat":r,"repeat-x":r,"repeat-y":r},update:function(bw,bx,by,bz){var bB=this.getTagName(by,bx);

if(bB!=bw.tagName.toLowerCase()){throw new Error("Image modification not possible because elements could not be replaced at runtime anymore!");
}var bC=this.getAttributes(bx,by,bz);

if(bB===q){bw.src=bC.src;
}if(bw.style.backgroundPosition!=p&&bC.style.backgroundPosition===undefined){bC.style.backgroundPosition=null;
}if(bw.style.clip!=p&&bC.style.clip===undefined){bC.style.clip=null;
}var bA=qx.bom.element.Style;
bA.setStyles(bw,bC.style);
if(this.__ia){try{bw.filters[D].apply();
}catch(e){}}},create:function(T,U,V){var W=this.getTagName(U,T);
var Y=this.getAttributes(T,U,V);
var X=qx.bom.element.Style.compile(Y.style);

if(W===q){return H+Y.src+w+X+z;
}else{return J+X+y;
}},getTagName:function(be,bf){if(qx.core.Variant.isSet(s,m)){if(bf&&this.__ia&&this.__ib[be]&&qx.lang.String.endsWith(bf,M)){return r;
}}return this.__ic[be];
},getAttributes:function(f,g,h){if(!h){h={};
}
if(!h.position){h.position=E;
}
if(qx.core.Variant.isSet(s,m)){h.fontSize=0;
h.lineHeight=0;
}else if(qx.core.Variant.isSet(s,u)){h.WebkitUserDrag=x;
}var j=qx.util.ResourceManager.getInstance().getImageFormat(f)||qx.io.ImageLoader.getFormat(f);
{};
var i;
if(this.__ia&&this.__ib[g]&&j===A){i=this.__if(h,g,f);
}else{if(g===l){i=this.__ig(h,g,f);
}else if(g===n||g===k){i=this.__ih(h,g,f);
}else{i=this.__ik(h,g,f);
}}return i;
},__id:function(P,Q,R){if(P.width==null&&Q!=null){P.width=Q+t;
}
if(P.height==null&&R!=null){P.height=R+t;
}return P;
},__ie:function(bJ){var bK=qx.util.ResourceManager.getInstance().getImageWidth(bJ)||qx.io.ImageLoader.getWidth(bJ);
var bL=qx.util.ResourceManager.getInstance().getImageHeight(bJ)||qx.io.ImageLoader.getHeight(bJ);
return {width:bK,height:bL};
},__if:function(bD,bE,bF){var bI=this.__ie(bF);
bD=this.__id(bD,bI.width,bI.height);
var bH=bE==o?L:l;
var bG=K+qx.util.ResourceManager.getInstance().toUri(bF)+F+bH+B;
bD.filter=bG;
bD.backgroundImage=bD.backgroundRepeat=p;
return {style:bD};
},__ig:function(bU,bV,bW){var bX=qx.util.ResourceManager.getInstance().toUri(bW);
var bY=this.__ie(bW);
bU=this.__id(bU,bY.width,bY.height);
return {src:bX,style:bU};
},__ih:function(bo,bp,bq){var bu=qx.util.ResourceManager.getInstance();
var bt=bu.isClippedImage(bq);
var bv=this.__ie(bq);

if(bt){var bs=bu.getData(bq);
var br=bu.toUri(bs[4]);

if(bp===n){bo=this.__ii(bo,bs,bv.height);
}else{bo=this.__ij(bo,bs,bv.width);
}return {src:br,style:bo};
}else{{};

if(bp==n){bo.height=bv.height==null?null:bv.height+t;
}else if(bp==k){bo.width=bv.width==null?null:bv.width+t;
}var br=bu.toUri(bq);
return {src:br,style:bo};
}},__ii:function(a,b,c){var d=qx.util.ResourceManager.getInstance().getImageHeight(b[4]);
a.clip={top:-b[6],height:c};
a.height=d+t;
if(a.top!=null){a.top=(parseInt(a.top,10)+b[6])+t;
}else if(a.bottom!=null){a.bottom=(parseInt(a.bottom,10)+c-d-b[6])+t;
}return a;
},__ij:function(ba,bb,bc){var bd=qx.util.ResourceManager.getInstance().getImageWidth(bb[4]);
ba.clip={left:-bb[5],width:bc};
ba.width=bd+t;
if(ba.left!=null){ba.left=(parseInt(ba.left,10)+bb[5])+t;
}else if(ba.right!=null){ba.right=(parseInt(ba.right,10)+bc-bd-bb[5])+t;
}return ba;
},__ik:function(bM,bN,bO){var bT=qx.util.ResourceManager.getInstance().isClippedImage(bO);
var bS=this.__ie(bO);
if(bT&&bN!==N){var bR=qx.util.ResourceManager.getInstance().getData(bO);
var bQ=qx.bom.element.Background.getStyles(bR[4],bN,bR[5],bR[6]);

for(var bP in bQ){bM[bP]=bQ[bP];
}
if(bS.width!=null&&bM.width==null&&(bN==I||bN===o)){bM.width=bS.width+t;
}
if(bS.height!=null&&bM.height==null&&(bN==C||bN===o)){bM.height=bS.height+t;
}return {style:bM};
}else{{};
bM=this.__id(bM,bS.width,bS.height);
bM=this.__il(bM,bO,bN);
return {style:bM};
}},__il:function(bh,bi,bj){var top=null;
var bn=null;

if(bh.backgroundPosition){var bk=bh.backgroundPosition.split(v);
bn=parseInt(bk[0]);

if(isNaN(bn)){bn=bk[0];
}top=parseInt(bk[1]);

if(isNaN(top)){top=bk[1];
}}var bm=qx.bom.element.Background.getStyles(bi,bj,bn,top);

for(var bl in bm){bh[bl]=bm[bl];
}if(bh.filter){bh.filter=p;
}return bh;
},__im:function(S){if(this.DEBUG&&qx.util.ResourceManager.getInstance().has(S)&&S.indexOf(O)==-1){if(!this.__hY[S]){qx.log.Logger.debug("Potential clipped image candidate: "+S);
this.__hY[S]=true;
}}},isAlphaImageLoaderEnabled:qx.core.Variant.select(s,{"mshtml":function(){return qx.bom.element.Decoration.__ia;
},"default":function(){return false;
}})}});
})();
(function(){var g="qx.client",f="load",e="qx.io.ImageLoader";
qx.Bootstrap.define(e,{statics:{__in:{},__io:{width:null,height:null},__ip:/\.(png|gif|jpg|jpeg|bmp)\b/i,isLoaded:function(G){var H=this.__in[G];
return !!(H&&H.loaded);
},isFailed:function(k){var m=this.__in[k];
return !!(m&&m.failed);
},isLoading:function(h){var j=this.__in[h];
return !!(j&&j.loading);
},getFormat:function(s){var t=this.__in[s];
return t?t.format:null;
},getSize:function(b){var c=this.__in[b];
return c?
{width:c.width,height:c.height}:this.__io;
},getWidth:function(E){var F=this.__in[E];
return F?F.width:null;
},getHeight:function(u){var v=this.__in[u];
return v?v.height:null;
},load:function(w,x,y){var z=this.__in[w];

if(!z){z=this.__in[w]={};
}if(x&&!y){y=window;
}if(z.loaded||z.loading||z.failed){if(x){if(z.loading){z.callbacks.push(x,y);
}else{x.call(y,w,z);
}}}else{z.loading=true;
z.callbacks=[];

if(x){z.callbacks.push(x,y);
}var B=new Image();
var A=qx.lang.Function.listener(this.__iq,this,B,w);
B.onload=A;
B.onerror=A;
B.src=w;
}},__iq:qx.event.GlobalError.observeMethod(function(event,n,o){var p=this.__in[o];
if(event.type===f){p.loaded=true;
p.width=this.__ir(n);
p.height=this.__is(n);
var q=this.__ip.exec(o);

if(q!=null){p.format=q[1];
}}else{p.failed=true;
}n.onload=n.onerror=null;
var r=p.callbacks;
delete p.loading;
delete p.callbacks;
for(var i=0,l=r.length;i<l;i+=2){r[i].call(r[i+1],o,p);
}}),__ir:qx.core.Variant.select(g,{"gecko":function(d){return d.naturalWidth;
},"default":function(C){return C.width;
}}),__is:qx.core.Variant.select(g,{"gecko":function(a){return a.naturalHeight;
},"default":function(D){return D.height;
}})}});
})();
(function(){var m="number",l="0",k="px",j=";",i="background-image:url(",h=");",g="",f=")",e="background-repeat:",d=" ",a="qx.bom.element.Background",c="url(",b="background-position:";
qx.Class.define(a,{statics:{__it:[i,null,h,b,null,j,e,null,j],__iu:{backgroundImage:null,backgroundPosition:null,backgroundRepeat:null},__iv:function(z,top){var A=qx.bom.client.Engine;

if(A.GECKO&&A.VERSION<1.9&&z==top&&typeof z==m){top+=0.01;
}
if(z){var B=(typeof z==m)?z+k:z;
}else{B=l;
}
if(top){var C=(typeof top==m)?top+k:top;
}else{C=l;
}return B+d+C;
},compile:function(t,u,v,top){var w=this.__iv(v,top);
var x=qx.util.ResourceManager.getInstance().toUri(t);
var y=this.__it;
y[1]=x;
y[4]=w;
y[7]=u;
return y.join(g);
},getStyles:function(D,E,F,top){if(!D){return this.__iu;
}var G=this.__iv(F,top);
var H=qx.util.ResourceManager.getInstance().toUri(D);
var I={backgroundPosition:G,backgroundImage:c+H+f};

if(E!=null){I.backgroundRepeat=E;
}return I;
},set:function(n,o,p,q,top){var r=this.getStyles(o,p,q,top);

for(var s in r){n.style[s]=r[s];
}}}});
})();
(function(){var s="source",r="scale",q="no-repeat",p="qx.client",o="mshtml",n="webkit",m="backgroundImage",l="div",k="qx.html.Image",j="qx/static/blank.gif";
qx.Class.define(k,{extend:qx.html.Element,members:{_applyProperty:function(name,d){qx.html.Element.prototype._applyProperty.call(this,name,d);

if(name===s){var h=this.getDomElement();
var e=this.getAllStyles();

if(this.getNodeName()==l&&this.getStyle(m)){e.backgroundPosition=null;
e.backgroundRepeat=null;
}var f=this._getProperty(s);
var g=this._getProperty(r);
var i=g?r:q;
qx.bom.element.Decoration.update(h,f,i,e);
}},_createDomElement:function(){var b=this._getProperty(r);
var c=b?r:q;

if(qx.core.Variant.isSet(p,o)){var a=this._getProperty(s);
this.setNodeName(qx.bom.element.Decoration.getTagName(c,a));
}else{this.setNodeName(qx.bom.element.Decoration.getTagName(c));
}return qx.html.Element.prototype._createDomElement.call(this);
},_copyData:function(v){return qx.html.Element.prototype._copyData.call(this,true);
},setSource:function(t){this._setProperty(s,t);
return this;
},getSource:function(){return this._getProperty(s);
},resetSource:function(){if(qx.core.Variant.isSet(p,n)){this._setProperty(s,qx.util.ResourceManager.getInstance().toUri(j));
}else{this._removeProperty(s,true);
}return this;
},setScale:function(u){this._setProperty(r,u);
return this;
},getScale:function(){return this._getProperty(r);
}}});
})();
(function(){var C="nonScaled",B="scaled",A="alphaScaled",z=".png",y="replacement",x="hidden",w="div",v="Boolean",u="_applyScale",t="px",n="__iw",s="_applySource",q="-disabled.$1",m="img",l="changeSource",p="qx.client",o="String",r="image",k="qx.ui.basic.Image";
qx.Class.define(k,{extend:qx.ui.core.Widget,construct:function(D){this.__iw={};
qx.ui.core.Widget.call(this);

if(D){this.setSource(D);
}},properties:{source:{check:o,init:null,nullable:true,event:l,apply:s,themeable:true},scale:{check:v,init:false,themeable:true,apply:u},appearance:{refine:true,init:r},allowShrinkX:{refine:true,init:false},allowShrinkY:{refine:true,init:false},allowGrowX:{refine:true,init:false},allowGrowY:{refine:true,init:false}},members:{__ix:null,__iy:null,__iz:null,__iw:null,getContentElement:function(){return this.__iD();
},_createContentElement:function(){return this.__iD();
},_getContentHint:function(){return {width:this.__ix||0,height:this.__iy||0};
},_applyEnabled:function(W,X){qx.ui.core.Widget.prototype._applyEnabled.call(this,W,X);

if(this.getSource()){this._styleSource();
}},_applySource:function(H){this._styleSource();
},_applyScale:function(bb){this._styleSource();
},__iA:function(V){this.__iz=V;
},__iB:function(){if(this.__iz==null){var ba=this.getSource();
var Y=false;

if(ba!=null){Y=qx.lang.String.endsWith(ba,z);
}
if(this.getScale()&&Y&&qx.bom.element.Decoration.isAlphaImageLoaderEnabled()){this.__iz=A;
}else if(this.getScale()){this.__iz=B;
}else{this.__iz=C;
}}return this.__iz;
},__iC:function(c){var d;
var e;

if(c==A){d=true;
e=w;
}else if(c==C){d=false;
e=w;
}else{d=true;
e=m;
}var f=new qx.html.Image(e);
f.setScale(d);
f.setStyles({"overflowX":x,"overflowY":x});
return f;
},__iD:function(){var P=this.__iB();

if(this.__iw[P]==null){this.__iw[P]=this.__iC(P);
}return this.__iw[P];
},_styleSource:function(){var bc=qx.util.AliasManager.getInstance().resolve(this.getSource());

if(!bc){this.getContentElement().resetSource();
return;
}this.__iE(bc);
if(qx.util.ResourceManager.getInstance().has(bc)){this.__iG(this.getContentElement(),bc);
}else if(qx.io.ImageLoader.isLoaded(bc)){this.__iH(this.getContentElement(),bc);
}else{this.__iI(this.getContentElement(),bc);
}},__iE:qx.core.Variant.select(p,{"mshtml":function(E){var G=qx.bom.element.Decoration.isAlphaImageLoaderEnabled();
var F=qx.lang.String.endsWith(E,z);

if(G&&F){if(this.getScale()&&this.__iB()!=A){this.__iA(A);
}else if(!this.getScale()&&this.__iB()!=C){this.__iA(C);
}}else{if(this.getScale()&&this.__iB()!=B){this.__iA(B);
}else if(!this.getScale()&&this.__iB()!=C){this.__iA(C);
}}this.__iF(this.__iD());
},"default":function(j){if(this.getScale()&&this.__iB()!=B){this.__iA(B);
}else if(!this.getScale()&&this.__iB(C)){this.__iA(C);
}this.__iF(this.__iD());
}}),__iF:function(I){var L=this.getContainerElement();
var M=L.getChild(0);

if(M!=I){if(M!=null){var O=t;
var J={};
var K=this.getInnerSize();

if(K!=null){J.width=K.width+O;
J.height=K.height+O;
}var N=this.getInsets();
J.left=N.left+O;
J.top=N.top+O;
J.zIndex=10;
I.setStyles(J,true);
I.setSelectable(this.getSelectable());
}L.removeAt(0);
L.addAt(I,0);
}},__iG:function(bf,bg){var bi=qx.util.ResourceManager.getInstance();
if(!this.getEnabled()){var bh=bg.replace(/\.([a-z]+)$/,q);

if(bi.has(bh)){bg=bh;
this.addState(y);
}else{this.removeState(y);
}}if(bf.getSource()===bg){return;
}bf.setSource(bg);
this.__iK(bi.getImageWidth(bg),bi.getImageHeight(bg));
},__iH:function(Q,R){var T=qx.io.ImageLoader;
Q.setSource(R);
var S=T.getWidth(R);
var U=T.getHeight(R);
this.__iK(S,U);
},__iI:function(g,h){var self;
var i=qx.io.ImageLoader;
{};
if(!i.isFailed(h)){i.load(h,this.__iJ,this);
}else{if(g!=null){g.resetSource();
}}},__iJ:function(bd,be){if(this.$$disposed===true){return;
}if(bd!==qx.util.AliasManager.getInstance().resolve(this.getSource())){return;
}if(be.failed){this.warn("Image could not be loaded: "+bd);
}this._styleSource();
},__iK:function(a,b){if(a!==this.__ix||b!==this.__iy){this.__ix=a;
this.__iy=b;
qx.ui.core.queue.Layout.add(this);
}}},destruct:function(){this._disposeMap(n);
}});
})();
(function(){var g="dragdrop-cursor",f="_applyAction",e="alias",d="qx.ui.core.DragDropCursor",c="move",b="singleton",a="copy";
qx.Class.define(d,{extend:qx.ui.basic.Image,include:qx.ui.core.MPlacement,type:b,construct:function(){qx.ui.basic.Image.call(this);
this.setZIndex(1e8);
this.setDomMove(true);
var j=this.getApplicationRoot();
j.add(this,{left:-1000,top:-1000});
},properties:{appearance:{refine:true,init:g},action:{check:[e,a,c],apply:f,nullable:true}},members:{_applyAction:function(h,i){if(i){this.removeState(i);
}
if(h){this.addState(h);
}}}});
})();
(function(){var g="interval",f="Number",e="_applyTimeoutInterval",d="qx.event.type.Event",c="qx.event.Idle",b="singleton";
qx.Class.define(c,{extend:qx.core.Object,type:b,construct:function(){qx.core.Object.call(this);
var a=new qx.event.Timer(this.getTimeoutInterval());
a.addListener(g,this._onInterval,this);
a.start();
this.__iL=a;
},events:{"interval":d},properties:{timeoutInterval:{check:f,init:100,apply:e}},members:{__iL:null,_applyTimeoutInterval:function(h){this.__iL.setInterval(h);
},_onInterval:function(){this.fireEvent(g);
}},destruct:function(){if(this.__iL){this.__iL.stop();
}this.__iL=null;
}});
})();
(function(){var o="top",n="right",m="bottom",l="left",k="align-start",j="qx.util.placement.AbstractAxis",i="edge-start",h="align-end",g="edge-end",f="-",c="best-fit",e="qx.util.placement.Placement",d="keep-align",b="direct",a='__iM';
qx.Class.define(e,{extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__iM=new qx.util.placement.DirectAxis();
},properties:{axisX:{check:j},axisY:{check:j},edge:{check:[o,n,m,l],init:o},align:{check:[o,n,m,l],init:n}},statics:{__iN:null,compute:function(q,r,s,t,u,v,w){this.__iN=this.__iN||new qx.util.placement.Placement();
var z=u.split(f);
var y=z[0];
var x=z[1];
this.__iN.set({axisX:this.__iR(v),axisY:this.__iR(w),edge:y,align:x});
return this.__iN.compute(q,r,s,t);
},__iO:null,__iP:null,__iQ:null,__iR:function(p){switch(p){case b:this.__iO=this.__iO||new qx.util.placement.DirectAxis();
return this.__iO;
case d:this.__iP=this.__iP||new qx.util.placement.KeepAlignAxis();
return this.__iP;
case c:this.__iQ=this.__iQ||new qx.util.placement.BestFitAxis();
return this.__iQ;
default:throw new Error("Invalid 'mode' argument!'");
}}},members:{__iM:null,compute:function(E,F,G,H){{};
var I=this.getAxisX()||this.__iM;
var K=I.computeStart(E.width,{start:G.left,end:G.right},{start:H.left,end:H.right},F.width,this.__iS());
var J=this.getAxisY()||this.__iM;
var top=J.computeStart(E.height,{start:G.top,end:G.bottom},{start:H.top,end:H.bottom},F.height,this.__iT());
return {left:K,top:top};
},__iS:function(){var D=this.getEdge();
var C=this.getAlign();

if(D==l){return i;
}else if(D==n){return g;
}else if(C==l){return k;
}else if(C==n){return h;
}},__iT:function(){var B=this.getEdge();
var A=this.getAlign();

if(B==o){return i;
}else if(B==m){return g;
}else if(A==o){return k;
}else if(A==m){return h;
}}},destruct:function(){this._disposeObjects(a);
}});
})();
(function(){var e="edge-start",d="align-start",c="align-end",b="edge-end",a="qx.util.placement.AbstractAxis";
qx.Class.define(a,{extend:qx.core.Object,members:{computeStart:function(f,g,h,i,j){throw new Error("abstract method call!");
},_moveToEdgeAndAlign:function(n,o,p,q){switch(q){case e:return o.start-p.end-n;
case b:return o.end+p.start;
case d:return o.start+p.start;
case c:return o.end-p.end-n;
}},_isInRange:function(k,l,m){return k>=0&&k+l<=m;
}}});
})();
(function(){var f="qx.util.placement.DirectAxis";
qx.Class.define(f,{extend:qx.util.placement.AbstractAxis,members:{computeStart:function(a,b,c,d,e){return this._moveToEdgeAndAlign(a,b,c,e);
}}});
})();
(function(){var k="qx.util.placement.KeepAlignAxis",j="edge-start",i="edge-end";
qx.Class.define(k,{extend:qx.util.placement.AbstractAxis,members:{computeStart:function(a,b,c,d,e){var f=this._moveToEdgeAndAlign(a,b,c,e);
var g,h;

if(this._isInRange(f,a,d)){return f;
}
if(e==j||e==i){g=b.start-c.end;
h=b.end+c.start;
}else{g=b.end-c.end;
h=b.start+c.start;
}
if(g>d-h){f=g-a;
}else{f=h;
}return f;
}}});
})();
(function(){var a="qx.util.placement.BestFitAxis";
qx.Class.define(a,{extend:qx.util.placement.AbstractAxis,members:{computeStart:function(b,c,d,e,f){var g=this._moveToEdgeAndAlign(b,c,d,f);

if(this._isInRange(g,b,e)){return g;
}
if(g<0){g=Math.min(0,e-b);
}
if(g+b>e){g=Math.max(0,e-b);
}return g;
}}});
})();
(function(){var k="mousedown",j="__iU",i="blur",h="singleton",g="qx.ui.popup.Manager";
qx.Class.define(g,{type:h,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__iU={};
qx.event.Registration.addListener(document.documentElement,k,this.__iW,this,true);
qx.bom.Element.addListener(window,i,this.hideAll,this);
},members:{__iU:null,add:function(r){{};
this.__iU[r.$$hash]=r;
this.__iV();
},remove:function(a){{};
var b=this.__iU;

if(b){delete b[a.$$hash];
this.__iV();
}},hideAll:function(){var m=this.__iU;

if(m){for(var l in m){m[l].exclude();
}}},__iV:function(){var f=1e7;
var d=this.__iU;

for(var c in d){d[c].setZIndex(f++);
}},__iW:function(e){var p=qx.ui.core.Widget.getWidgetByElement(e.getTarget());
var q=this.__iU;

for(var o in q){var n=q[o];

if(!n.getAutoHide()||p==n||qx.ui.core.Widget.contains(n,p)){continue;
}n.exclude();
}}},destruct:function(){qx.event.Registration.removeListener(document.documentElement,k,this.__iW,this,true);
this._disposeMap(j);
}});
})();
(function(){var d="abstract",c="qx.ui.layout.Abstract";
qx.Class.define(c,{type:d,extend:qx.core.Object,members:{__iX:null,_invalidChildrenCache:null,__iY:null,invalidateLayoutCache:function(){this.__iX=null;
},renderLayout:function(a,b){this.warn("Missing renderLayout() implementation!");
},getSizeHint:function(){if(this.__iX){return this.__iX;
}return this.__iX=this._computeSizeHint();
},hasHeightForWidth:function(){return false;
},getHeightForWidth:function(h){this.warn("Missing getHeightForWidth() implementation!");
return null;
},_computeSizeHint:function(){return null;
},invalidateChildrenCache:function(){this._invalidChildrenCache=true;
},verifyLayoutProperty:null,_clearSeparators:function(){var i=this.__iY;

if(i instanceof qx.ui.core.LayoutItem){i.clearSeparators();
}},_renderSeparator:function(e,f){this.__iY.renderSeparator(e,f);
},connectToWidget:function(g){if(g&&this.__iY){throw new Error("It is not possible to manually set the connected widget.");
}this.__iY=g;
this.invalidateChildrenCache();
},_getWidget:function(){return this.__iY;
},_applyLayoutChange:function(){if(this.__iY){this.__iY.scheduleLayoutUpdate();
}},_getLayoutChildren:function(){return this.__iY.getLayoutChildren();
}},destruct:function(){this.__iY=this.__iX=null;
}});
})();
(function(){var a="qx.ui.layout.Grow";
qx.Class.define(a,{extend:qx.ui.layout.Abstract,members:{verifyLayoutProperty:null,renderLayout:function(m,n){var r=this._getLayoutChildren();
var q,s,p,o;
for(var i=0,l=r.length;i<l;i++){q=r[i];
s=q.getSizeHint();
p=m;

if(p<s.minWidth){p=s.minWidth;
}else if(p>s.maxWidth){p=s.maxWidth;
}o=n;

if(o<s.minHeight){o=s.minHeight;
}else if(o>s.maxHeight){o=s.maxHeight;
}q.renderLayout(0,0,p,o);
}},_computeSizeHint:function(){var h=this._getLayoutChildren();
var f,k;
var j=0,g=0;
var e=0,c=0;
var b=Infinity,d=Infinity;
for(var i=0,l=h.length;i<l;i++){f=h[i];
k=f.getSizeHint();
j=Math.max(j,k.width);
g=Math.max(g,k.height);
e=Math.max(e,k.minWidth);
c=Math.max(c,k.minHeight);
b=Math.min(b,k.maxWidth);
d=Math.min(d,k.maxHeight);
}return {width:j,height:g,minWidth:e,minHeight:c,maxWidth:b,maxHeight:d};
}}});
})();
(function(){var n="label",m="icon",l="Boolean",k="both",j="String",i="left",h="changeGap",g="changeShow",f="bottom",e="_applyCenter",A="changeIcon",z="qx.ui.basic.Atom",y="changeLabel",x="Integer",w="_applyIconPosition",v="top",u="right",t="_applyRich",s="_applyIcon",r="_applyShow",p="_applyLabel",q="_applyGap",o="atom";
qx.Class.define(z,{extend:qx.ui.core.Widget,construct:function(B,C){{};
qx.ui.core.Widget.call(this);
this._setLayout(new qx.ui.layout.Atom());

if(B!=null){this.setLabel(B);
}
if(C!=null){this.setIcon(C);
}},properties:{appearance:{refine:true,init:o},label:{apply:p,nullable:true,check:j,event:y},rich:{check:l,init:false,apply:t},icon:{check:j,apply:s,nullable:true,themeable:true,event:A},gap:{check:x,nullable:false,event:h,apply:q,themeable:true,init:4},show:{init:k,check:[k,n,m],themeable:true,inheritable:true,apply:r,event:g},iconPosition:{init:i,check:[v,u,f,i],themeable:true,apply:w},center:{init:false,check:l,themeable:true,apply:e}},members:{_createChildControlImpl:function(Q){var R;

switch(Q){case n:R=new qx.ui.basic.Label(this.getLabel());
R.setAnonymous(true);
R.setRich(this.getRich());
this._add(R);

if(this.getLabel()==null||this.getShow()===m){R.exclude();
}break;
case m:R=new qx.ui.basic.Image(this.getIcon());
R.setAnonymous(true);
this._addAt(R,0);

if(this.getIcon()==null||this.getShow()===n){R.exclude();
}break;
}return R||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,Q);
},_forwardStates:{focused:true,hovered:true},_handleLabel:function(){if(this.getLabel()==null||this.getShow()===m){this._excludeChildControl(n);
}else{this._showChildControl(n);
}},_handleIcon:function(){if(this.getIcon()==null||this.getShow()===n){this._excludeChildControl(m);
}else{this._showChildControl(m);
}},_applyLabel:function(I,J){var K=this.getChildControl(n,true);

if(K){K.setValue(I);
}this._handleLabel();
},_applyRich:function(D,E){var F=this.getChildControl(n,true);

if(F){F.setRich(D);
}},_applyIcon:function(L,M){var N=this.getChildControl(m,true);

if(N){N.setSource(L);
}this._handleIcon();
},_applyGap:function(O,P){this._getLayout().setGap(O);
},_applyShow:function(a,b){this._handleLabel();
this._handleIcon();
},_applyIconPosition:function(c,d){this._getLayout().setIconPosition(c);
},_applyCenter:function(G,H){this._getLayout().setCenter(G);
}}});
})();
(function(){var k="bottom",j="_applyLayoutChange",h="top",g="left",f="right",e="middle",d="center",c="qx.ui.layout.Atom",b="Integer",a="Boolean";
qx.Class.define(c,{extend:qx.ui.layout.Abstract,properties:{gap:{check:b,init:4,apply:j},iconPosition:{check:[g,h,f,k],init:g,apply:j},center:{check:a,init:false,apply:j}},members:{verifyLayoutProperty:null,renderLayout:function(w,x){var G=qx.ui.layout.Util;
var z=this.getIconPosition();
var C=this._getLayoutChildren();
var length=C.length;
var Q,top,P,A;
var L,F;
var J=this.getGap();
var O=this.getCenter();
if(z===k||z===f){var H=length-1;
var D=-1;
var B=-1;
}else{var H=0;
var D=length;
var B=1;
}if(z==h||z==k){if(O){var K=0;

for(var i=H;i!=D;i+=B){A=C[i].getSizeHint().height;

if(A>0){K+=A;

if(i!=H){K+=J;
}}}top=Math.round((x-K)/2);
}else{top=0;
}
for(var i=H;i!=D;i+=B){L=C[i];
F=L.getSizeHint();
P=Math.min(F.maxWidth,Math.max(w,F.minWidth));
A=F.height;
Q=G.computeHorizontalAlignOffset(d,P,w);
L.renderLayout(Q,top,P,A);
if(A>0){top+=A+J;
}}}else{var E=w;
var y=null;
var N=0;

for(var i=H;i!=D;i+=B){L=C[i];
P=L.getSizeHint().width;

if(P>0){if(!y&&L instanceof qx.ui.basic.Label){y=L;
}else{E-=P;
}N++;
}}
if(N>1){var M=(N-1)*J;
E-=M;
}
if(y){var F=y.getSizeHint();
var I=Math.max(F.minWidth,Math.min(E,F.maxWidth));
E-=I;
}
if(O&&E>0){Q=Math.round(E/2);
}else{Q=0;
}
for(var i=H;i!=D;i+=B){L=C[i];
F=L.getSizeHint();
A=Math.min(F.maxHeight,Math.max(x,F.minHeight));

if(L===y){P=I;
}else{P=F.width;
}top=G.computeVerticalAlignOffset(e,F.height,x);
L.renderLayout(Q,top,P,A);
if(P>0){Q+=P+J;
}}}},_computeSizeHint:function(){var v=this._getLayoutChildren();
var length=v.length;
var n,t;
if(length===1){var n=v[0].getSizeHint();
t={width:n.width,height:n.height,minWidth:n.minWidth,minHeight:n.minHeight};
}else{var r=0,s=0;
var o=0,q=0;
var p=this.getIconPosition();
var u=this.getGap();

if(p===h||p===k){var l=0;

for(var i=0;i<length;i++){n=v[i].getSizeHint();
s=Math.max(s,n.width);
r=Math.max(r,n.minWidth);
if(n.height>0){q+=n.height;
o+=n.minHeight;
l++;
}}
if(l>1){var m=(l-1)*u;
q+=m;
o+=m;
}}else{var l=0;

for(var i=0;i<length;i++){n=v[i].getSizeHint();
q=Math.max(q,n.height);
o=Math.max(o,n.minHeight);
if(n.width>0){s+=n.width;
r+=n.minWidth;
l++;
}}
if(l>1){var m=(l-1)*u;
s+=m;
r+=m;
}}t={minWidth:r,width:s,minHeight:o,height:q};
}return t;
}}});
})();
(function(){var C="middle",B="qx.ui.layout.Util",A="left",z="center",y="top",x="bottom",w="right";
qx.Class.define(B,{statics:{PERCENT_VALUE:/[0-9]+(?:\.[0-9]+)?%/,computeFlexOffsets:function(N,O,P){var R,V,Q,W;
var S=O>P;
var X=Math.abs(O-P);
var Y,T;
var U={};

for(V in N){R=N[V];
U[V]={potential:S?R.max-R.value:R.value-R.min,flex:S?R.flex:1/R.flex,offset:0};
}while(X!=0){W=Infinity;
Q=0;

for(V in U){R=U[V];

if(R.potential>0){Q+=R.flex;
W=Math.min(W,R.potential/R.flex);
}}if(Q==0){break;
}W=Math.min(X,W*Q)/Q;
Y=0;

for(V in U){R=U[V];

if(R.potential>0){T=Math.min(X,R.potential,Math.ceil(W*R.flex));
Y+=T-W*R.flex;

if(Y>=1){Y-=1;
T-=1;
}R.potential-=T;

if(S){R.offset+=T;
}else{R.offset-=T;
}X-=T;
}}}return U;
},computeHorizontalAlignOffset:function(j,k,m,n,o){if(n==null){n=0;
}
if(o==null){o=0;
}var p=0;

switch(j){case A:p=n;
break;
case w:p=m-k-o;
break;
case z:p=Math.round((m-k)/2);
if(p<n){p=n;
}else if(p<o){p=Math.max(n,m-k-o);
}break;
}return p;
},computeVerticalAlignOffset:function(q,r,s,t,u){if(t==null){t=0;
}
if(u==null){u=0;
}var v=0;

switch(q){case y:v=t;
break;
case x:v=s-r-u;
break;
case C:v=Math.round((s-r)/2);
if(v<t){v=t;
}else if(v<u){v=Math.max(t,s-r-u);
}break;
}return v;
},collapseMargins:function(D){var E=0,G=0;

for(var i=0,l=arguments.length;i<l;i++){var F=arguments[i];

if(F<0){G=Math.min(G,F);
}else if(F>0){E=Math.max(E,F);
}}return E+G;
},computeHorizontalGaps:function(bm,bn,bo){if(bn==null){bn=0;
}var bp=0;

if(bo){bp+=bm[0].getMarginLeft();

for(var i=1,l=bm.length;i<l;i+=1){bp+=this.collapseMargins(bn,bm[i-1].getMarginRight(),bm[i].getMarginLeft());
}bp+=bm[l-1].getMarginRight();
}else{for(var i=1,l=bm.length;i<l;i+=1){bp+=bm[i].getMarginLeft()+bm[i].getMarginRight();
}bp+=(bn*(l-1));
}return bp;
},computeVerticalGaps:function(bi,bj,bk){if(bj==null){bj=0;
}var bl=0;

if(bk){bl+=bi[0].getMarginTop();

for(var i=1,l=bi.length;i<l;i+=1){bl+=this.collapseMargins(bj,bi[i-1].getMarginBottom(),bi[i].getMarginTop());
}bl+=bi[l-1].getMarginBottom();
}else{for(var i=1,l=bi.length;i<l;i+=1){bl+=bi[i].getMarginTop()+bi[i].getMarginBottom();
}bl+=(bj*(l-1));
}return bl;
},computeHorizontalSeparatorGaps:function(ba,bb,bc){var bf=qx.theme.manager.Decoration.getInstance().resolve(bc);
var be=bf.getInsets();
var bd=be.left+be.right;
var bg=0;

for(var i=0,l=ba.length;i<l;i++){var bh=ba[i];
bg+=bh.getMarginLeft()+bh.getMarginRight();
}bg+=(bb+bd+bb)*(l-1);
return bg;
},computeVerticalSeparatorGaps:function(a,b,c){var f=qx.theme.manager.Decoration.getInstance().resolve(c);
var e=f.getInsets();
var d=e.top+e.bottom;
var g=0;

for(var i=0,l=a.length;i<l;i++){var h=a[i];
g+=h.getMarginTop()+h.getMarginBottom();
}g+=(b+d+b)*(l-1);
return g;
},arrangeIdeals:function(H,I,J,K,L,M){if(I<H||L<K){if(I<H&&L<K){I=H;
L=K;
}else if(I<H){L-=(H-I);
I=H;
if(L<K){L=K;
}}else if(L<K){I-=(K-L);
L=K;
if(I<H){I=H;
}}}
if(I>J||L>M){if(I>J&&L>M){I=J;
L=M;
}else if(I>J){L+=(I-J);
I=J;
if(L>M){L=M;
}}else if(L>M){I+=(L-M);
L=M;
if(I>J){I=J;
}}}return {begin:I,end:L};
}}});
})();
(function(){var b="qx.event.type.Data",a="qx.ui.form.IStringForm";
qx.Interface.define(a,{events:{"changeValue":b},members:{setValue:function(c){return arguments.length==1;
},resetValue:function(){},getValue:function(){}}});
})();
(function(){var t="qx.dynlocale",s="text",r="Boolean",q="qx.client",p="color",o="userSelect",n="changeLocale",m="enabled",l="none",k="on",O="_applyTextAlign",N="qx.ui.core.Widget",M="gecko",L="changeTextAlign",K="_applyWrap",J="changeValue",I="changeContent",H="qx.ui.basic.Label",G="A",F="_applyValue",A="center",B="_applyBuddy",y="String",z="textAlign",w="right",x="changeRich",u="_applyRich",v="click",C="label",D="webkit",E="left";
qx.Class.define(H,{extend:qx.ui.core.Widget,implement:[qx.ui.form.IStringForm],construct:function(bb){qx.ui.core.Widget.call(this);

if(bb!=null){this.setValue(bb);
}
if(qx.core.Variant.isSet(t,k)){qx.locale.Manager.getInstance().addListener(n,this._onChangeLocale,this);
}},properties:{rich:{check:r,init:false,event:x,apply:u},wrap:{check:r,init:true,apply:K},value:{check:y,apply:F,event:J,nullable:true},buddy:{check:N,apply:B,nullable:true,init:null},textAlign:{check:[E,A,w],nullable:true,themeable:true,apply:O,event:L},appearance:{refine:true,init:C},selectable:{refine:true,init:false},allowGrowX:{refine:true,init:false},allowGrowY:{refine:true,init:false},allowShrinkY:{refine:true,init:false}},members:{__ja:null,__jb:null,__jc:null,__jd:null,_getContentHint:function(){if(this.__jb){this.__je=this.__jf();
delete this.__jb;
}return {width:this.__je.width,height:this.__je.height};
},_hasHeightForWidth:function(){return this.getRich()&&this.getWrap();
},_applySelectable:function(T){if(qx.core.Variant.isSet(q,M)){if(T&&!this.isRich()){{};
return;
}}qx.ui.core.Widget.prototype._applySelectable.call(this,T);
if(qx.core.Variant.isSet(q,D)){this.getContainerElement().setStyle(o,T?s:l);
this.getContentElement().setStyle(o,T?s:l);
}},_getContentHeightForWidth:function(P){if(!this.getRich()&&!this.getWrap()){return null;
}return this.__jf(P).height;
},_createContentElement:function(){return new qx.html.Label;
},_applyTextAlign:function(i,j){this.getContentElement().setStyle(z,i);
},_applyTextColor:function(g,h){if(g){this.getContentElement().setStyle(p,qx.theme.manager.Color.getInstance().resolve(g));
}else{this.getContentElement().removeStyle(p);
}},__je:{width:0,height:0},_applyFont:function(W,X){var Y;

if(W){this.__ja=qx.theme.manager.Font.getInstance().resolve(W);
Y=this.__ja.getStyles();
}else{this.__ja=null;
Y=qx.bom.Font.getDefaultStyles();
}this.getContentElement().setStyles(Y);
this.__jb=true;
qx.ui.core.queue.Layout.add(this);
},__jf:function(a){var f=qx.bom.Label;
var c=this.getFont();
var b=c?this.__ja.getStyles():qx.bom.Font.getDefaultStyles();
var content=this.getValue()||G;
var d=this.getRich();
return d?f.getHtmlSize(content,b,a):f.getTextSize(content,b);
},_applyBuddy:function(bc,bd){if(bd!=null){bd.removeBinding(this.__jc);
this.__jc=null;
this.removeListenerById(this.__jd);
this.__jd=null;
}
if(bc!=null){this.__jc=bc.bind(m,this,m);
this.__jd=this.addListener(v,bc.focus,bc);
}},_applyRich:function(ba){this.getContentElement().setRich(ba);
this.__jb=true;
qx.ui.core.queue.Layout.add(this);
},_applyWrap:function(Q,R){if(Q&&!this.isRich()){{};
}},_onChangeLocale:qx.core.Variant.select(t,{"on":function(e){var content=this.getValue();

if(content&&content.translate){this.setValue(content.translate());
}},"off":null}),_applyValue:function(U,V){this.getContentElement().setValue(U);
this.__jb=true;
qx.ui.core.queue.Layout.add(this);
this.fireDataEvent(I,U,V);
}},destruct:function(){if(qx.core.Variant.isSet(t,k)){qx.locale.Manager.getInstance().removeListener(n,this._onChangeLocale,this);
}if(this.__jc!=null){var S=this.getBuddy();

if(S!=null&&!S.isDisposed()){S.removeBinding(this.__jc);
}}this.__ja=this.__jc=null;
}});
})();
(function(){var g="value",f="Please use the getValue() method instead.",e="qx.html.Label",d="Please use the setValue() method instead.";
qx.Class.define(e,{extend:qx.html.Element,members:{__jg:null,_applyProperty:function(name,h){qx.html.Element.prototype._applyProperty.call(this,name,h);

if(name==g){var i=this.getDomElement();
qx.bom.Label.setValue(i,h);
}},_createDomElement:function(){var c=this.__jg;
var b=qx.bom.Label.create(this._content,c);
return b;
},_copyData:function(a){return qx.html.Element.prototype._copyData.call(this,true);
},setRich:function(l){var m=this.getDomElement();

if(m){throw new Error("The label mode cannot be modified after initial creation");
}l=!!l;

if(this.__jg==l){return;
}this.__jg=l;
return this;
},setValue:function(k){this._setProperty(g,k);
return this;
},getValue:function(){return this._getProperty(g);
},setContent:function(j){qx.log.Logger.deprecatedMethodWarning(arguments.callee,d);
return this.setValue(j);
},getContent:function(){qx.log.Logger.deprecatedMethodWarning(arguments.callee,f);
return this.getValue();
}}});
})();
(function(){var r="qx.client",q="gecko",p="div",o="inherit",n="text",m="value",l="",k="hidden",j="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",i="nowrap",J="auto",I="0",H="ellipsis",G="normal",F="label",E="px",D="crop",C="end",B="100%",A="visible",y="qx.bom.Label",z="Please use the setValue() method instead.",w="opera",x="Please use the getValue() method instead.",u="block",v="none",s="-1000px",t="absolute";
qx.Class.define(y,{statics:{__jh:{fontFamily:1,fontSize:1,fontWeight:1,fontStyle:1,lineHeight:1},__ji:function(){var g=this.__jk(false);
document.body.insertBefore(g,document.body.firstChild);
return this._textElement=g;
},__jj:function(){var bc=this.__jk(true);
document.body.insertBefore(bc,document.body.firstChild);
return this._htmlElement=bc;
},__jk:function(b){var c=qx.bom.Element.create(p);
var d=c.style;
d.width=d.height=J;
d.left=d.top=s;
d.visibility=k;
d.position=t;
d.overflow=A;

if(b){d.whiteSpace=G;
}else{d.whiteSpace=i;

if(qx.core.Variant.isSet(r,q)){var e=document.createElementNS(j,F);
var d=e.style;
d.padding=I;

for(var f in this.__jh){d[f]=o;
}c.appendChild(e);
}}return c;
},__jl:function(K){var L={};

if(K){L.whiteSpace=G;
}else if(qx.core.Variant.isSet(r,q)){L.display=u;
}else{L.overflow=k;
L.whiteSpace=i;
L.textOverflow=H;
L.userSelect=v;
if(qx.core.Variant.isSet(r,w)){L.OTextOverflow=H;
}}return L;
},create:function(content,O,P){if(!P){P=window;
}
if(O){var Q=P.document.createElement(p);
Q.useHtml=true;
}else if(qx.core.Variant.isSet(r,q)){var Q=P.document.createElement(p);
var S=P.document.createElementNS(j,F);
var R=S.style;
R.cursor=o;
R.color=o;
R.overflow=k;
R.maxWidth=B;
R.padding=I;
for(var T in this.__jh){S.style[T]=o;
}S.setAttribute(D,C);
Q.appendChild(S);
}else{var Q=P.document.createElement(p);
qx.bom.element.Style.setStyles(Q,this.__jl(O));
}
if(content){this.setValue(Q,content);
}return Q;
},setValue:function(M,N){N=N||l;

if(M.useHtml){M.innerHTML=N;
}else if(qx.core.Variant.isSet(r,q)){M.firstChild.setAttribute(m,N);
}else{qx.bom.element.Attribute.set(M,n,N);
}},getValue:function(a){if(a.useHtml){return a.innerHTML;
}else if(qx.core.Variant.isSet(r,q)){return a.firstChild.getAttribute(m)||l;
}else{return qx.bom.element.Attribute.get(a,n);
}},getHtmlSize:function(content,bg,bh){var bi=this._htmlElement||this.__jj();
bi.style.width=bh!==undefined?bh+E:J;
bi.innerHTML=content;
return this.__jm(bi,bg);
},getTextSize:function(bd,be){var bf=this._textElement||this.__ji();

if(qx.core.Variant.isSet(r,q)){bf.firstChild.setAttribute(m,bd);
}else{qx.bom.element.Attribute.set(bf,n,bd);
}return this.__jm(bf,be);
},__jm:function(W,X){var Y=this.__jh;

if(!X){X={};
}
for(var ba in Y){W.style[ba]=X[ba]||l;
}var bb=qx.bom.element.Dimension.getSize(W);

if(qx.core.Variant.isSet(r,q)){if(!qx.bom.client.Platform.WIN){bb.width++;
}}return bb;
},setContent:function(U,V){qx.log.Logger.deprecatedMethodWarning(arguments.callee,z);
this.setValue(U,V);
},getContent:function(h){qx.log.Logger.deprecatedMethodWarning(arguments.callee,x);
return this.getValue(h);
}}});
})();
(function(){var q="0px",p="mshtml",o="qx.client",n="qx.bom.element.Dimension",m="paddingRight",l="paddingLeft",k="paddingTop",j="paddingBottom";
qx.Class.define(n,{statics:{getWidth:qx.core.Variant.select(o,{"gecko":function(y){if(y.getBoundingClientRect){var z=y.getBoundingClientRect();
return Math.round(z.right)-Math.round(z.left);
}else{return y.offsetWidth;
}},"default":function(B){return B.offsetWidth;
}}),getHeight:qx.core.Variant.select(o,{"gecko":function(C){if(C.getBoundingClientRect){var D=C.getBoundingClientRect();
return Math.round(D.bottom)-Math.round(D.top);
}else{return C.offsetHeight;
}},"default":function(i){return i.offsetHeight;
}}),getSize:function(A){return {width:this.getWidth(A),height:this.getHeight(A)};
},__jn:{visible:true,hidden:true},getContentWidth:function(r){var t=qx.bom.element.Style;
var u=qx.bom.element.Overflow.getX(r);
var v=parseInt(t.get(r,l)||q,10);
var x=parseInt(t.get(r,m)||q,10);

if(this.__jn[u]){return r.clientWidth-v-x;
}else{if(r.clientWidth>=r.scrollWidth){return Math.max(r.clientWidth,r.scrollWidth)-v-x;
}else{var w=r.scrollWidth-v;
var s=qx.bom.client.Engine;

if(s.NAME===p&&s.VERSION==6){w-=x;
}return w;
}}},getContentHeight:function(b){var d=qx.bom.element.Style;
var f=qx.bom.element.Overflow.getY(b);
var g=parseInt(d.get(b,k)||q,10);
var e=parseInt(d.get(b,j)||q,10);

if(this.__jn[f]){return b.clientHeight-g-e;
}else{if(b.clientHeight>=b.scrollHeight){return Math.max(b.clientHeight,b.scrollHeight)-g-e;
}else{var h=b.scrollHeight-g;
var c=qx.bom.client.Engine;

if(c.NAME===p&&c.VERSION==6){h-=e;
}return h;
}}},getContentSize:function(a){return {width:this.getContentWidth(a),height:this.getContentHeight(a)};
}}});
})();
(function(){var d="qx.event.type.Data",c="qx.ui.form.IForm";
qx.Interface.define(c,{events:{"changeEnabled":d,"changeValid":d,"changeInvalidMessage":d,"changeRequired":d},members:{setEnabled:function(a){return arguments.length==1;
},getEnabled:function(){},setRequired:function(b){return arguments.length==1;
},getRequired:function(){},setValid:function(f){return arguments.length==1;
},getValid:function(){},setInvalidMessage:function(e){return arguments.length==1;
},getInvalidMessage:function(){}}});
})();
(function(){var j="__jo",i="Use 'getBlocker().getContentBlockerElement()' instead.",h="Use 'getBlocker().getBlockerElement()' instead.",g="_applyBlockerColor",f="Number",e="qx.ui.core.MBlocker",d="_applyBlockerOpacity",c="Color";
qx.Mixin.define(e,{construct:function(){this.__jo=new qx.ui.core.Blocker(this);
},properties:{blockerColor:{check:c,init:null,nullable:true,apply:g,themeable:true},blockerOpacity:{check:f,init:1,apply:d,themeable:true}},members:{__jo:null,_applyBlockerColor:function(k,l){this.__jo.setColor(k);
},_applyBlockerOpacity:function(a,b){this.__jo.setOpacity(a);
},block:function(){this.__jo.block();
},isBlocked:function(){return this.__jo.isBlocked();
},unblock:function(){this.__jo.unblock();
},forceUnblock:function(){this.__jo.forceUnblock();
},blockContent:function(m){this.__jo.blockContent(m);
},isContentBlocked:function(){return this.__jo.isContentBlocked();
},unblockContent:function(){this.__jo.unblockContent();
},forceUnblockContent:function(){this.__jo.forceUnblockContent();
},_getContentBlocker:function(){qx.log.Logger.deprecatedMethodWarning(arguments.callee,i);
return this.__jo.getContentBlockerElement();
},_getBlocker:function(){qx.log.Logger.deprecatedMethodWarning(arguments.callee,h);
return this.__jo.getBlockerElement();
},getBlocker:function(){return this.__jo;
}},destruct:function(){this._disposeObjects(j);
}});
})();
(function(){var i="qx.ui.window.Window",h="changeModal",g="changeVisibility",f="changeActive",d="_applyActiveWindow",c="__jp",b="qx.ui.window.MDesktop",a="__jq";
qx.Mixin.define(b,{properties:{activeWindow:{check:i,apply:d,init:null,nullable:true}},members:{__jp:null,__jq:null,getWindowManager:function(){if(!this.__jq){this.setWindowManager(new qx.ui.window.Window.DEFAULT_MANAGER_CLASS());
}return this.__jq;
},supportsMaximize:function(){return true;
},setWindowManager:function(l){if(this.__jq){this.__jq.setDesktop(null);
}l.setDesktop(this);
this.__jq=l;
},_onChangeActive:function(e){if(e.getData()){this.setActiveWindow(e.getTarget());
}else if(this.getActiveWindow()==e.getTarget()){this.setActiveWindow(null);
}},_applyActiveWindow:function(n,o){this.getWindowManager().changeActiveWindow(n,o);

if(n){n.setActive(true);
}
if(o){o.resetActive();
}},_onChangeModal:function(e){this.getWindowManager().updateStack();
},_onChangeVisibility:function(){this.getWindowManager().updateStack();
},_afterAddChild:function(m){if(qx.Class.isDefined(i)&&m instanceof qx.ui.window.Window){this._addWindow(m);
}},_addWindow:function(j){if(!qx.lang.Array.contains(this.getWindows(),j)){this.getWindows().push(j);
j.addListener(f,this._onChangeActive,this);
j.addListener(h,this._onChangeModal,this);
j.addListener(g,this._onChangeVisibility,this);
}
if(j.getActive()){this.setActiveWindow(j);
}this.getWindowManager().updateStack();
},_afterRemoveChild:function(p){if(qx.Class.isDefined(i)&&p instanceof qx.ui.window.Window){this._removeWindow(p);
}},_removeWindow:function(k){qx.lang.Array.remove(this.getWindows(),k);
k.removeListener(f,this._onChangeActive,this);
k.removeListener(h,this._onChangeModal,this);
k.removeListener(g,this._onChangeVisibility,this);
this.getWindowManager().updateStack();
},getWindows:function(){if(!this.__jp){this.__jp=[];
}return this.__jp;
}},destruct:function(){this._disposeArray(c);
this._disposeObjects(a);
}});
})();
(function(){var r="contextmenu",q="help",p="qx.client",o="changeGlobalCursor",n="abstract",m="Boolean",l="root",k="",j=" !important",i="_applyGlobalCursor",f="_applyNativeHelp",h=";",g="qx.ui.root.Abstract",d="String",c="*";
qx.Class.define(g,{type:n,extend:qx.ui.core.Widget,include:[qx.ui.core.MChildrenHandling,qx.ui.core.MBlocker,qx.ui.window.MDesktop],construct:function(){qx.ui.core.Widget.call(this);
qx.ui.core.FocusHandler.getInstance().addRoot(this);
qx.ui.core.queue.Visibility.add(this);
this.initNativeHelp();
},properties:{appearance:{refine:true,init:l},enabled:{refine:true,init:true},focusable:{refine:true,init:true},globalCursor:{check:d,nullable:true,themeable:true,apply:i,event:o},nativeContextMenu:{refine:true,init:false},nativeHelp:{check:m,init:false,apply:f}},members:{__jr:null,isRootWidget:function(){return true;
},getLayout:function(){return this._getLayout();
},_applyGlobalCursor:qx.core.Variant.select(p,{"mshtml":function(s,t){},"default":function(u,v){var w=qx.bom.Stylesheet;
var x=this.__jr;

if(!x){this.__jr=x=w.createElement();
}w.removeAllRules(x);

if(u){w.addRule(x,c,qx.bom.element.Cursor.compile(u).replace(h,k)+j);
}}}),_applyNativeContextMenu:function(a,b){if(a){this.removeListener(r,this._onNativeContextMenu,this,true);
}else{this.addListener(r,this._onNativeContextMenu,this,true);
}},_onNativeContextMenu:function(e){if(e.getTarget().getNativeContextMenu()){return;
}e.preventDefault();
},_applyNativeHelp:qx.core.Variant.select(p,{"mshtml":function(A,B){if(B===false){qx.bom.Event.removeNativeListener(document,q,qx.lang.Function.returnFalse);
}
if(A===false){qx.bom.Event.addNativeListener(document,q,qx.lang.Function.returnFalse);
}},"default":function(){}})},destruct:function(){this.__jr=null;
},defer:function(y,z){qx.ui.core.MChildrenHandling.remap(z);
}});
})();
(function(){var s="resize",r="position",q="0px",p="webkit",o="paddingLeft",n="$$widget",m="qx.ui.root.Application",l="hidden",k="qx.client",j="div",g="paddingTop",i="100%",h="absolute";
qx.Class.define(m,{extend:qx.ui.root.Abstract,construct:function(t){this.__js=qx.dom.Node.getWindow(t);
this.__jt=t;
qx.ui.root.Abstract.call(this);
qx.event.Registration.addListener(this.__js,s,this._onResize,this);
this._setLayout(new qx.ui.layout.Canvas());
qx.ui.core.queue.Layout.add(this);
qx.ui.core.FocusHandler.getInstance().connectTo(this);
this.getContentElement().disableScrolling();
},members:{__js:null,__jt:null,_createContainerElement:function(){var a=this.__jt;
if(qx.core.Variant.isSet(k,p)){if(!a.body){alert("The application could not be started due to a missing body tag in the HTML file!");
}}var f=a.documentElement.style;
var b=a.body.style;
f.overflow=b.overflow=l;
f.padding=f.margin=b.padding=b.margin=q;
f.width=f.height=b.width=b.height=i;
var d=a.createElement(j);
a.body.appendChild(d);
var c=new qx.html.Root(d);
c.setStyle(r,h);
c.setAttribute(n,this.toHashCode());
return c;
},_onResize:function(e){qx.ui.core.queue.Layout.add(this);
},_computeSizeHint:function(){var u=qx.bom.Viewport.getWidth(this.__js);
var v=qx.bom.Viewport.getHeight(this.__js);
return {minWidth:u,width:u,maxWidth:u,minHeight:v,height:v,maxHeight:v};
},_applyPadding:function(z,A,name){if(z&&(name==g||name==o)){throw new Error("The root widget does not support 'left', or 'top' paddings!");
}qx.ui.root.Abstract.prototype._applyPadding.call(this,z,A,name);
},_applyDecorator:function(w,x){qx.ui.root.Abstract.prototype._applyDecorator.call(this,w,x);

if(!w){return;
}var y=this.getDecoratorElement().getInsets();

if(y.left||y.top){throw new Error("The root widget does not support decorators with 'left', or 'top' insets!");
}}},destruct:function(){this.__js=this.__jt=null;
}});
})();
(function(){var s="zIndex",r="px",q="keydown",p="deactivate",o="This method is not needed anymore.",n="resize",m="keyup",l="keypress",k="backgroundColor",j="_applyOpacity",F="__jC",E="__jz",D="Use 'getBlockerElement' instead.",C="opacity",B="interval",A="Tab",z="Color",y="qx.ui.root.Page",x="Use 'getContentBlockerElement' instead.",w="Number",u="__jx",v="qx.ui.core.Blocker",t="_applyColor";
qx.Class.define(v,{extend:qx.core.Object,construct:function(Q){qx.core.Object.call(this);
this._widget=Q;
this._isPageRoot=(qx.Class.isDefined(y)&&Q instanceof qx.ui.root.Page);

if(this._isPageRoot){Q.addListener(n,this.__jD,this);
}this.__ju=[];
this.__jv=[];
this.__jw=[];
},properties:{color:{check:z,init:null,nullable:true,apply:t,themeable:true},opacity:{check:w,init:1,apply:j,themeable:true}},members:{__jx:null,__jy:0,__jz:null,__jw:null,__ju:null,__jv:null,__jA:null,__jB:0,__jC:null,_isPageRoot:false,_widget:null,__jD:function(e){var d=e.getData();

if(this.isContentBlocked()){this.getContentBlockerElement().setStyles({width:d.width,height:d.height});
}
if(this.isBlocked()){this.getBlockerElement().setStyles({width:d.width,height:d.height});
}},_applyColor:function(a,b){var c=qx.theme.manager.Color.getInstance().resolve(a);
this.__jE(k,c);
},_applyOpacity:function(K,L){this.__jE(C,K);
},__jE:function(H,I){var J=[];
this.__jx&&J.push(this.__jx);
this.__jz&&J.push(this.__jz);

for(var i=0;i<J.length;i++){J[i].setStyle(H,I);
}},_saveAndSetAnonymousState:function(){qx.log.Logger.deprecatedMethodWarning(arguments.callee,o);
this.__jB+=1;

if(this.__jB==1){this.__jA=this._widget.getAnonymous();
this._widget.setAnonymous(true);
}},_restoreAnonymousState:function(){qx.log.Logger.deprecatedMethodWarning(arguments.callee,o);
this.__jB-=1;

if(this.__jB==0){this._widget.setAnonymous(this.__jA);
}},_backupActiveWidget:function(){var M=qx.event.Registration.getManager(window).getHandler(qx.event.handler.Focus);
this.__ju.push(M.getActive());
this.__jv.push(M.getFocus());

if(this._widget.isFocusable()){this._widget.focus();
}},_restoreActiveWidget:function(){var h=this.__ju.length;

if(h>0){var g=this.__ju[h-1];

if(g){qx.bom.Element.activate(g);
}this.__ju.pop();
}var f=this.__jv.length;

if(f>0){var g=this.__jv[f-1];

if(g){qx.bom.Element.focus(this.__jv[f-1]);
}this.__jv.pop();
}},__jF:function(){return new qx.html.Blocker(this.getColor(),this.getOpacity());
},_getBlocker:function(){qx.log.Logger.deprecatedMethodWarning(arguments.callee,D);
return this.getBlockerElement();
},getBlockerElement:function(){if(!this.__jx){this.__jx=this.__jF();
this.__jx.setStyle(s,15);
this._widget.getContainerElement().add(this.__jx);
this.__jx.exclude();
}return this.__jx;
},block:function(){this.__jy++;

if(this.__jy<2){this._backupActiveWidget();
var N=this.getBlockerElement();
N.include();
N.activate();
N.addListener(p,this.__jK,this);
N.addListener(l,this.__jJ,this);
N.addListener(q,this.__jJ,this);
N.addListener(m,this.__jJ,this);
}},isBlocked:function(){return this.__jy>0;
},unblock:function(){if(!this.isBlocked()){return;
}this.__jy--;

if(this.__jy<1){this.__jG();
}},forceUnblock:function(){if(!this.isBlocked()){return;
}this.__jy=0;
this.__jG();
},__jG:function(){this._restoreActiveWidget();
var R=this.getBlockerElement();
R.removeListener(p,this.__jK,this);
R.removeListener(l,this.__jJ,this);
R.removeListener(q,this.__jJ,this);
R.removeListener(m,this.__jJ,this);
R.exclude();
},_getContentBlocker:function(){qx.log.Logger.deprecatedMethodWarning(arguments.callee,x);
return this.getContentBlockerElement();
},getContentBlockerElement:function(){if(!this.__jz){this.__jz=this.__jF();
this._widget.getContentElement().add(this.__jz);
this.__jz.exclude();
}return this.__jz;
},blockContent:function(U){var V=this.getContentBlockerElement();
V.setStyle(s,U);
this.__jw.push(U);

if(this.__jw.length<2){V.include();

if(this._isPageRoot){if(!this.__jC){this.__jC=new qx.event.Timer(300);
this.__jC.addListener(B,this.__jI,this);
}this.__jC.start();
this.__jI();
}}},isContentBlocked:function(){return this.__jw.length>0;
},unblockContent:function(){if(!this.isContentBlocked()){return;
}this.__jw.pop();
var O=this.__jw[this.__jw.length-1];
var P=this.getContentBlockerElement();
P.setStyle(s,O);

if(this.__jw.length<1){this.__jH();
}},forceUnblockContent:function(){if(!this.isContentBlocked()){return;
}this.__jw=[];
var G=this.getContentBlockerElement();
G.setStyle(s,null);
this.__jH();
},__jH:function(){this.getContentBlockerElement().exclude();

if(this._isPageRoot){this.__jC.stop();
}},__jI:function(){var S=this._widget.getContainerElement().getDomElement();
var T=qx.dom.Node.getDocument(S);
this.getContentBlockerElement().setStyles({height:T.documentElement.scrollHeight+r,width:T.documentElement.scrollWidth+r});
},__jJ:function(e){if(e.getKeyIdentifier()==A){e.stop();
}},__jK:function(){this.getBlockerElement().activate();
}},destruct:function(){if(this._isPageRoot){this._widget.removeListener(n,this.__jD,this);
}this._disposeObjects(E,u,F);
this.__jA=this.__ju=this.__jv=this._widget=this.__jw=null;
}});
})();
(function(){var n="cursor",m="100%",l="repeat",k="mousedown",j="url(",i=")",h="mouseout",g="qx.client",f="div",d="dblclick",z="mousewheel",y="qx.html.Blocker",x="mousemove",w="mouseover",v="appear",u="click",t="mshtml",s="mouseup",r="contextmenu",q="disappear",o="qx/static/blank.gif",p="absolute";
qx.Class.define(y,{extend:qx.html.Element,construct:function(a,b){var a=a?qx.theme.manager.Color.getInstance().resolve(a):null;
var c={position:p,width:m,height:m,opacity:b||0,backgroundColor:a};
if(qx.core.Variant.isSet(g,t)){c.backgroundImage=j+qx.util.ResourceManager.getInstance().toUri(o)+i;
c.backgroundRepeat=l;
}qx.html.Element.call(this,f,c);
this.addListener(k,this._stopPropagation,this);
this.addListener(s,this._stopPropagation,this);
this.addListener(u,this._stopPropagation,this);
this.addListener(d,this._stopPropagation,this);
this.addListener(x,this._stopPropagation,this);
this.addListener(w,this._stopPropagation,this);
this.addListener(h,this._stopPropagation,this);
this.addListener(z,this._stopPropagation,this);
this.addListener(r,this._stopPropagation,this);
this.addListener(v,this.__jL,this);
this.addListener(q,this.__jL,this);
},members:{_stopPropagation:function(e){e.stopPropagation();
},__jL:function(){var A=this.getStyle(n);
this.setStyle(n,null,true);
this.setStyle(n,A,true);
}}});
})();
(function(){var I="keypress",H="focusout",G="__jM",F="activate",E="Tab",D="singleton",C="deactivate",B="focusin",A="qx.ui.core.FocusHandler";
qx.Class.define(A,{extend:qx.core.Object,type:D,construct:function(){qx.core.Object.call(this);
this.__jM={};
},members:{__jM:null,__jN:null,__jO:null,__jP:null,connectTo:function(p){p.addListener(I,this.__jQ,this);
p.addListener(B,this._onFocusIn,this,true);
p.addListener(H,this._onFocusOut,this,true);
p.addListener(F,this._onActivate,this,true);
p.addListener(C,this._onDeactivate,this,true);
},addRoot:function(bf){this.__jM[bf.$$hash]=bf;
},removeRoot:function(ba){delete this.__jM[ba.$$hash];
},getActiveWidget:function(){return this.__jN;
},isActive:function(J){return this.__jN==J;
},getFocusedWidget:function(){return this.__jO;
},isFocused:function(o){return this.__jO==o;
},isFocusRoot:function(bg){return !!this.__jM[bg.$$hash];
},_onActivate:function(e){var bi=e.getTarget();
this.__jN=bi;
var bh=this.__jR(bi);

if(bh!=this.__jP){this.__jP=bh;
}},_onDeactivate:function(e){var q=e.getTarget();

if(this.__jN==q){this.__jN=null;
}},_onFocusIn:function(e){var y=e.getTarget();

if(y!=this.__jO){this.__jO=y;
y.visualizeFocus();
}},_onFocusOut:function(e){var z=e.getTarget();

if(z==this.__jO){this.__jO=null;
z.visualizeBlur();
}},__jQ:function(e){if(e.getKeyIdentifier()!=E){return;
}
if(!this.__jP){return;
}e.stopPropagation();
e.preventDefault();
var a=this.__jO;

if(!e.isShiftPressed()){var b=a?this.__jV(a):this.__jT();
}else{var b=a?this.__jW(a):this.__jU();
}if(b){b.tabFocus();
}},__jR:function(m){var n=this.__jM;

while(m){if(n[m.$$hash]){return m;
}m=m.getLayoutParent();
}return null;
},__jS:function(K,L){if(K===L){return 0;
}var N=K.getTabIndex()||0;
var M=L.getTabIndex()||0;

if(N!=M){return N-M;
}var S=K.getContainerElement().getDomElement();
var R=L.getContainerElement().getDomElement();
var Q=qx.bom.element.Location;
var P=Q.get(S);
var O=Q.get(R);
if(P.top!=O.top){return P.top-O.top;
}if(P.left!=O.left){return P.left-O.left;
}var T=K.getZIndex();
var U=L.getZIndex();

if(T!=U){return T-U;
}return 0;
},__jT:function(){return this.__ka(this.__jP,null);
},__jU:function(){return this.__kb(this.__jP,null);
},__jV:function(bb){var bc=this.__jP;

if(bc==bb){return this.__jT();
}
while(bb&&bb.getAnonymous()){bb=bb.getLayoutParent();
}
if(bb==null){return [];
}var bd=[];
this.__jX(bc,bb,bd);
bd.sort(this.__jS);
var be=bd.length;
return be>0?bd[0]:this.__jT();
},__jW:function(r){var s=this.__jP;

if(s==r){return this.__jU();
}
while(r&&r.getAnonymous()){r=r.getLayoutParent();
}
if(r==null){return [];
}var t=[];
this.__jY(s,r,t);
t.sort(this.__jS);
var u=t.length;
return u>0?t[u-1]:this.__jU();
},__jX:function(parent,V,W){var X=parent.getLayoutChildren();
var Y;

for(var i=0,l=X.length;i<l;i++){Y=X[i];
if(!(Y instanceof qx.ui.core.Widget)){continue;
}
if(!this.isFocusRoot(Y)&&Y.isEnabled()&&Y.isVisible()){if(Y.isTabable()&&this.__jS(V,Y)<0){W.push(Y);
}this.__jX(Y,V,W);
}}},__jY:function(parent,g,h){var j=parent.getLayoutChildren();
var k;

for(var i=0,l=j.length;i<l;i++){k=j[i];
if(!(k instanceof qx.ui.core.Widget)){continue;
}
if(!this.isFocusRoot(k)&&k.isEnabled()&&k.isVisible()){if(k.isTabable()&&this.__jS(g,k)>0){h.push(k);
}this.__jY(k,g,h);
}}},__ka:function(parent,v){var w=parent.getLayoutChildren();
var x;

for(var i=0,l=w.length;i<l;i++){x=w[i];
if(!(x instanceof qx.ui.core.Widget)){continue;
}if(!this.isFocusRoot(x)&&x.isEnabled()&&x.isVisible()){if(x.isTabable()){if(v==null||this.__jS(x,v)<0){v=x;
}}v=this.__ka(x,v);
}}return v;
},__kb:function(parent,c){var d=parent.getLayoutChildren();
var f;

for(var i=0,l=d.length;i<l;i++){f=d[i];
if(!(f instanceof qx.ui.core.Widget)){continue;
}if(!this.isFocusRoot(f)&&f.isEnabled()&&f.isVisible()){if(f.isTabable()){if(c==null||this.__jS(f,c)>0){c=f;
}}c=this.__kb(f,c);
}}return c;
}},destruct:function(){this._disposeMap(G);
this.__jO=this.__jN=this.__jP=null;
}});
})();
(function(){var y="qx.client",x="head",w="text/css",v="stylesheet",u="}",t='@import "',s="{",r='";',q="qx.bom.Stylesheet",p="link",o="style";
qx.Class.define(q,{statics:{includeFile:function(ba,bb){if(!bb){bb=document;
}var bc=bb.createElement(p);
bc.type=w;
bc.rel=v;
bc.href=qx.util.ResourceManager.getInstance().toUri(ba);
var bd=bb.getElementsByTagName(x)[0];
bd.appendChild(bc);
},createElement:qx.core.Variant.select(y,{"mshtml":function(a){var b=document.createStyleSheet();

if(a){b.cssText=a;
}return b;
},"default":function(T){var U=document.createElement(o);
U.type=w;

if(T){U.appendChild(document.createTextNode(T));
}document.getElementsByTagName(x)[0].appendChild(U);
return U.sheet;
}}),addRule:qx.core.Variant.select(y,{"mshtml":function(E,F,G){E.addRule(F,G);
},"default":function(H,I,J){H.insertRule(I+s+J+u,H.cssRules.length);
}}),removeRule:qx.core.Variant.select(y,{"mshtml":function(c,d){var e=c.rules;
var f=e.length;

for(var i=f-1;i>=0;--i){if(e[i].selectorText==d){c.removeRule(i);
}}},"default":function(P,Q){var R=P.cssRules;
var S=R.length;

for(var i=S-1;i>=0;--i){if(R[i].selectorText==Q){P.deleteRule(i);
}}}}),removeAllRules:qx.core.Variant.select(y,{"mshtml":function(be){var bf=be.rules;
var bg=bf.length;

for(var i=bg-1;i>=0;i--){be.removeRule(i);
}},"default":function(B){var C=B.cssRules;
var D=C.length;

for(var i=D-1;i>=0;i--){B.deleteRule(i);
}}}),addImport:qx.core.Variant.select(y,{"mshtml":function(z,A){z.addImport(A);
},"default":function(N,O){N.insertRule(t+O+r,N.cssRules.length);
}}),removeImport:qx.core.Variant.select(y,{"mshtml":function(g,h){var j=g.imports;
var k=j.length;

for(var i=k-1;i>=0;i--){if(j[i].href==h){g.removeImport(i);
}}},"default":function(V,W){var X=V.cssRules;
var Y=X.length;

for(var i=Y-1;i>=0;i--){if(X[i].href==W){V.deleteRule(i);
}}}}),removeAllImports:qx.core.Variant.select(y,{"mshtml":function(l){var m=l.imports;
var n=m.length;

for(var i=n-1;i>=0;i--){l.removeImport(i);
}},"default":function(K){var L=K.cssRules;
var M=L.length;

for(var i=M-1;i>=0;i--){if(L[i].type==L[i].IMPORT_RULE){K.deleteRule(i);
}}}})}});
})();
(function(){var b="number",a="qx.ui.layout.Canvas";
qx.Class.define(a,{extend:qx.ui.layout.Abstract,members:{verifyLayoutProperty:null,renderLayout:function(v,w){var H=this._getLayoutChildren();
var z,G,E;
var J,top,x,y,B,A;
var F,D,I,C;

for(var i=0,l=H.length;i<l;i++){z=H[i];
G=z.getSizeHint();
E=z.getLayoutProperties();
F=z.getMarginTop();
D=z.getMarginRight();
I=z.getMarginBottom();
C=z.getMarginLeft();
J=E.left!=null?E.left:E.edge;

if(qx.lang.Type.isString(J)){J=Math.round(parseFloat(J)*v/100);
}x=E.right!=null?E.right:E.edge;

if(qx.lang.Type.isString(x)){x=Math.round(parseFloat(x)*v/100);
}top=E.top!=null?E.top:E.edge;

if(qx.lang.Type.isString(top)){top=Math.round(parseFloat(top)*w/100);
}y=E.bottom!=null?E.bottom:E.edge;

if(qx.lang.Type.isString(y)){y=Math.round(parseFloat(y)*w/100);
}if(J!=null&&x!=null){B=v-J-x-C-D;
if(B<G.minWidth){B=G.minWidth;
}else if(B>G.maxWidth){B=G.maxWidth;
}J+=C;
}else{B=E.width;

if(B==null){B=G.width;
}else{B=Math.round(parseFloat(B)*v/100);
if(B<G.minWidth){B=G.minWidth;
}else if(B>G.maxWidth){B=G.maxWidth;
}}
if(x!=null){J=v-B-x-D-C;
}else if(J==null){J=C;
}else{J+=C;
}}if(top!=null&&y!=null){A=w-top-y-F-I;
if(A<G.minHeight){A=G.minHeight;
}else if(A>G.maxHeight){A=G.maxHeight;
}top+=F;
}else{A=E.height;

if(A==null){A=G.height;
}else{A=Math.round(parseFloat(A)*w/100);
if(A<G.minHeight){A=G.minHeight;
}else if(A>G.maxHeight){A=G.maxHeight;
}}
if(y!=null){top=w-A-y-I-F;
}else if(top==null){top=F;
}else{top+=F;
}}z.renderLayout(J,top,B,A);
}},_computeSizeHint:function(){var t=0,s=0;
var q=0,o=0;
var m,k;
var j,g;
var c=this._getLayoutChildren();
var f,r,e;
var u,top,d,h;

for(var i=0,l=c.length;i<l;i++){f=c[i];
r=f.getLayoutProperties();
e=f.getSizeHint();
var p=f.getMarginLeft()+f.getMarginRight();
var n=f.getMarginTop()+f.getMarginBottom();
m=e.width+p;
k=e.minWidth+p;
u=r.left!=null?r.left:r.edge;

if(u&&typeof u===b){m+=u;
k+=u;
}d=r.right!=null?r.right:r.edge;

if(d&&typeof d===b){m+=d;
k+=d;
}t=Math.max(t,m);
s=Math.max(s,k);
j=e.height+n;
g=e.minHeight+n;
top=r.top!=null?r.top:r.edge;

if(top&&typeof top===b){j+=top;
g+=top;
}h=r.bottom!=null?r.bottom:r.edge;

if(h&&typeof h===b){j+=h;
g+=h;
}q=Math.max(q,j);
o=Math.max(o,g);
}return {width:t,minWidth:s,height:q,minHeight:o};
}}});
})();
(function(){var a="qx.html.Root";
qx.Class.define(a,{extend:qx.html.Element,construct:function(b){qx.html.Element.call(this);

if(b!=null){this.useElement(b);
}},members:{useElement:function(c){qx.html.Element.prototype.useElement.call(this,c);
this.setRoot(true);
qx.html.Element._modified[this.$$hash]=this;
}}});
})();
(function(){var P="execute",O="application/json",N="POST",M="completed",L="Type",K="name",J="Name",I="id",H="constructor",G="maxthreads",bG="tasks_todo",bF="tasks_done",bE="Done",bD="Downloaded queue data.  Populating..",bC="GET",bB="New Queue",bA="string",bz="/start-queue-json",by="To-Do",bx="No",W="Send",X="dataEdited",U="/scheduler-json",V="Synacor::Disbatch::Queue::Enclosure",S="Threads",T="Test enclosure",Q="New",R="tasks_backfill",bb="Start new queue",bc="value",bk="Delete",bi="Reset",bp="Tasks",bm="Backfill",bt="attr",br="/queue-prototypes-json",be="Queue deletion confirmation",bw="Really delete queue?",bv="/set-queue-attr-json",bu="Yes",bd="1N1",bg="queueid",bh="Queues loaded.",bj="Loading queue data...",bl="Queue Browser",bn="type",bq="tasks_doing",bs="disbatch_frontend.Queuebrowser",Y="Processing",ba="Refresh",bf="/delete-queue-json",bo="ID";
qx.Class.define(bs,{extend:qx.core.Object,members:{createQueueBrowser:function(bI){this.app=bI;
this.load_queue_prototypes();
var bM=new qx.ui.window.Window(bl);
bM.setLayout(new qx.ui.layout.VBox(10));
bM.setShowStatusbar(true);
var bO=new qx.ui.table.model.Simple();
bO.setColumns([bo,L,J,S,bE,by,Y,bm]);
bO.setData([[bd,V,T,3,15238,114,4,0]]);
bO.setColumnEditable(1,true);
bO.setColumnEditable(2,true);
bO.setColumnEditable(3,true);
var bP=new qx.ui.table.Table(bO);
bP.set({width:900,height:400,decorator:null});
bP.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
var bN=new qx.ui.table.celleditor.ComboBox();
bN.setListData(this.queue_types);
bP.getTableColumnModel().setCellEditorFactory(1,bN);
bM.add(bP);
this._table=bP;
this._tablemodel=bO;
this._window=bM;
bP.addListener(X,function(event){if(!(event instanceof qx.event.type.Data)){return;
}var v=event.getData();
var u=this.getTableModel().getValue(0,v.row);
this.info("changedData: "+v.value);
this.info("row: "+v.row);
this.info("col: "+v.col);
this.info("value: "+v.value);
this.info("id: "+u);
var s;

if(v.col==1){s=H;
}
if(v.col==2){s=K;
}
if(v.col==3){s=G;
}var t=new qx.io.remote.Request(bv,N,O);
t.setParameter(bg,u);
t.setParameter(bt,s);
t.setParameter(bc,v.value);
t.send();
},bP);
var toolbar=new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
bM.add(toolbar);
var bK=new qx.ui.form.Button(Q);
bK.addListener(P,function(){this.newQueueDialog();
},this);
toolbar.add(bK);
var bJ=new qx.ui.form.Button(bk);
bJ.addListener(P,function(){this.deleteQueueDialog();
},this);
toolbar.add(bJ);
var bL=new qx.ui.form.Button(bp);
bL.addListener(P,function(){var d;
this._table.getSelectionModel().iterateSelection(function(h){d=h;
});
var f=this._table.getTableModel().getValue(0,d);
var g=this._table.getTableModel().getValue(1,d);
this.app.showTaskBrowser(f,g);
},this);
toolbar.add(bL);
var bQ=new qx.ui.form.Button(ba);
bQ.addListener(P,function(){this.loadqueues();
},this);
toolbar.add(bQ);
bM.open();
this.loadqueues();
return bM;
},loadqueues:function(){this._window.setStatus(bj);
var bH=new qx.io.remote.Request(U,bC,O);
bH.addListener(M,function(e){this._window.setStatus(bD);
var b=e.getContent();
var a=[];
var c=this._table.getTableModel();
c.removeRows(0,c.getRowCount());

for(var x in b){this._window.setStatus(x);
var q=b[x];

if(q[I]){c.addRows([[q[I],q[H],q[K],q[G],q[bF],q[bG],q[bq],q[R]]]);
}}this._window.setStatus(bh);
},this);
bH.send();
},deleteQueueDialog:function(){var m=new qx.ui.window.Window(be);
this.dqDialog=m;
m.setModal(true);
m.moveTo(150,150);
m.setLayout(new qx.ui.layout.HBox());
m.setAllowMaximize(false);
m.setAllowMinimize(false);
m.add(new qx.ui.basic.Label(bw));
var l=new qx.ui.form.Button(bu);
l.addListener(P,function(){var i;
this._table.getSelectionModel().iterateSelection(function(p){i=p;
});
var k=this._table.getTableModel().getValue(0,i);
var j=new qx.io.remote.Request(bf,N,O);
j.setParameter(I,k);
j.send();
j.addListener(M,function(e){this.loadqueues();
},this);
this.dqDialog.close();
},this);
m.add(l);
var n=new qx.ui.form.Button(bx);
n.addListener(P,function(){this.dqDialog.close();
},this);
m.add(n);
m.open();
},newQueueDialog:function(){var z=new qx.ui.window.Window(bb);
this.nqDialog=z;
z.setModal(true);
z.moveTo(150,150);
z.setLayout(new qx.ui.layout.Basic());
z.setAllowMaximize(false);
z.setAllowMinimize(false);
this.app.getRoot().add(z);
var w=new qx.ui.form.Form();
w.addGroupHeader(bB);
var y=new qx.ui.form.TextField();
y.setRequired(true);
w.add(y,J);
var D=new qx.ui.form.SelectBox();

for(var x in this.queue_types){if(typeof (this.queue_types[x])==bA){D.add(new qx.ui.form.ListItem(this.queue_types[x],null,this.queue_types[x]));
}}D.setRequired(true);
w.add(D,L);
var C=new qx.data.controller.Form(null,w);
var E=C.createModel();
var B=new qx.ui.form.Button(W);
B.addListener(P,function(){if(w.validate()){var o=qx.util.Serializer.toNativeObject(E);
var F=new qx.io.remote.Request(bz,N,O);
F.setParameter(bn,o[L]);
F.setParameter(K,o[J]);
F.addListener(M,function(e){this.loadqueues();
},this);
F.send();
this.nqDialog.close();
}},this);
w.addButton(B);
var A=new qx.ui.form.Button(bi);
A.addListener(P,function(){w.reset();
},this);
w.addButton(A);
z.add(new qx.ui.form.renderer.Single(w),{left:10,top:10});
z.open();
},load_queue_prototypes:function(){var r=new qx.io.remote.Request(br,N,O);
r.setAsynchronous(false);
r.addListener(M,function(e){this.queue_prototypes=e.getContent();
this.queue_types=[];

for(var x in this.queue_prototypes){this.queue_types.push(x);
}},this);
r.send();
}}});
})();
(function(){var t="indexOf",s="addAfter",r="add",q="addBefore",p="_",o="addAt",n="hasChildren",m="removeAt",l="removeAll",k="getChildren",i="remove",j="qx.ui.core.MRemoteChildrenHandling";
qx.Mixin.define(j,{members:{__kc:function(d,e,f,g){var h=this.getChildrenContainer();

if(h===this){d=p+d;
}return (h[d])(e,f,g);
},getChildren:function(){return this.__kc(k);
},hasChildren:function(){return this.__kc(n);
},add:function(v,w){return this.__kc(r,v,w);
},remove:function(E){return this.__kc(i,E);
},removeAll:function(){return this.__kc(l);
},indexOf:function(x){return this.__kc(t,x);
},addAt:function(y,z,A){this.__kc(o,y,z,A);
},addBefore:function(B,C,D){this.__kc(q,B,C,D);
},addAfter:function(a,b,c){this.__kc(s,a,b,c);
},removeAt:function(u){this.__kc(m,u);
}}});
})();
(function(){var b="qx.ui.core.MRemoteLayoutHandling";
qx.Mixin.define(b,{members:{setLayout:function(a){return this.getChildrenContainer().setLayout(a);
},getLayout:function(){return this.getChildrenContainer().getLayout();
}}});
})();
(function(){var q="Boolean",p="resize",o="mousedown",n="w-resize",m="sw-resize",l="n-resize",k="resizableRight",j="ne-resize",i="se-resize",h="Integer",F="e-resize",E="resizableLeft",D="mousemove",C="move",B="shorthand",A="maximized",z="nw-resize",y="mouseout",x="qx.ui.core.MResizable",w="mouseup",u="losecapture",v="resize-frame",s="resizableBottom",t="s-resize",r="resizableTop";
qx.Mixin.define(x,{construct:function(){this.addListener(o,this.__ko,this,true);
this.addListener(w,this.__kp,this);
this.addListener(D,this.__kr,this);
this.addListener(y,this.__ks,this);
this.addListener(u,this.__kq,this);
var O=this.getContainerElement().getDomElement();

if(O==null){O=window;
}this.__kd=qx.event.Registration.getManager(O).getHandler(qx.event.handler.DragDrop);
},properties:{resizableTop:{check:q,init:true},resizableRight:{check:q,init:true},resizableBottom:{check:q,init:true},resizableLeft:{check:q,init:true},resizable:{group:[r,k,s,E],mode:B},resizeSensitivity:{check:h,init:5},useResizeFrame:{check:q,init:true}},members:{__kd:null,__ke:null,__kf:null,__kg:null,__kh:null,__ki:null,RESIZE_TOP:1,RESIZE_BOTTOM:2,RESIZE_LEFT:4,RESIZE_RIGHT:8,__kj:function(){var a=this.__ke;

if(!a){a=this.__ke=new qx.ui.core.Widget();
a.setAppearance(v);
a.exclude();
qx.core.Init.getApplication().getRoot().add(a);
}return a;
},__kk:function(){var Q=this.__ki;
var P=this.__kj();
P.setUserBounds(Q.left,Q.top,Q.width,Q.height);
P.show();
P.setZIndex(this.getZIndex()+1);
},__kl:function(e){var H=this.__kf;
var I=this.getSizeHint();
var K=this.__ki;
var G=K.width;
var J=K.height;
var M=K.left;
var top=K.top;
var L;

if((H&this.RESIZE_TOP)||(H&this.RESIZE_BOTTOM)){L=e.getDocumentTop()-this.__kh;

if(H&this.RESIZE_TOP){J-=L;
}else{J+=L;
}
if(J<I.minHeight){J=I.minHeight;
}else if(J>I.maxHeight){J=I.maxHeight;
}
if(H&this.RESIZE_TOP){top+=K.height-J;
}}
if((H&this.RESIZE_LEFT)||(H&this.RESIZE_RIGHT)){L=e.getDocumentLeft()-this.__kg;

if(H&this.RESIZE_LEFT){G-=L;
}else{G+=L;
}
if(G<I.minWidth){G=I.minWidth;
}else if(G>I.maxWidth){G=I.maxWidth;
}
if(H&this.RESIZE_LEFT){M+=K.width-G;
}}return {viewportLeft:M,viewportTop:top,parentLeft:K.bounds.left+M-K.left,parentTop:K.bounds.top+top-K.top,width:G,height:J};
},__km:{1:l,2:t,4:n,8:F,5:z,6:m,9:j,10:i},__kn:function(e){var d=this.getContentLocation();
var b=this.getResizeSensitivity();
var g=e.getDocumentLeft();
var f=e.getDocumentTop();
var c=0;

if(this.getResizableTop()&&Math.abs(d.top-f)<b){c+=this.RESIZE_TOP;
}else if(this.getResizableBottom()&&Math.abs(d.bottom-f)<b){c+=this.RESIZE_BOTTOM;
}
if(this.getResizableLeft()&&Math.abs(d.left-g)<b){c+=this.RESIZE_LEFT;
}else if(this.getResizableRight()&&Math.abs(d.right-g)<b){c+=this.RESIZE_RIGHT;
}this.__kf=c;
},__ko:function(e){if(!this.__kf){return;
}this.addState(p);
this.__kg=e.getDocumentLeft();
this.__kh=e.getDocumentTop();
var location=this.getContainerLocation();
var R=this.getBounds();
this.__ki={top:location.top,left:location.left,width:R.width,height:R.height,bounds:qx.lang.Object.clone(R)};
if(this.getUseResizeFrame()){this.__kk();
}this.capture();
e.stop();
},__kp:function(e){if(!this.hasState(p)){return;
}if(this.getUseResizeFrame()){this.__kj().exclude();
}var N=this.__kl(e);
this.setWidth(N.width);
this.setHeight(N.height);
if(this.getResizableLeft()||this.getResizableTop()){this.setLayoutProperties({left:N.parentLeft,top:N.parentTop});
}this.__kf=0;
this.removeState(p);
this.resetCursor();
this.getApplicationRoot().resetGlobalCursor();
this.releaseCapture();
e.stopPropagation();
},__kq:function(e){if(!this.__kf){return;
}this.resetCursor();
this.getApplicationRoot().resetGlobalCursor();
this.removeState(C);
if(this.getUseResizeFrame()){this.__kj().exclude();
}},__kr:function(e){if(this.hasState(p)){var V=this.__kl(e);
if(this.getUseResizeFrame()){var T=this.__kj();
T.setUserBounds(V.viewportLeft,V.viewportTop,V.width,V.height);
}else{this.setWidth(V.width);
this.setHeight(V.height);
if(this.getResizableLeft()||this.getResizableTop()){this.setLayoutProperties({left:V.parentLeft,top:V.parentTop});
}}e.stopPropagation();
}else if(!this.hasState(A)&&!this.__kd.isSessionActive()){this.__kn(e);
var W=this.__kf;
var U=this.getApplicationRoot();

if(W){var S=this.__km[W];
this.setCursor(S);
U.setGlobalCursor(S);
}else if(this.getCursor()){this.resetCursor();
U.resetGlobalCursor();
}}},__ks:function(e){if(this.getCursor()&&!this.hasState(p)){this.resetCursor();
this.getApplicationRoot().resetGlobalCursor();
}}},destruct:function(){if(this.__ke!=null&&!qx.core.ObjectRegistry.inShutDown){this.__ke.destroy();
this.__ke=null;
}this.__kd=null;
}});
})();
(function(){var r="move",q="Boolean",p="mouseup",o="mousedown",n="losecapture",m="__kt",l="qx.ui.core.MMovable",k="__ku",j="mousemove",i="maximized",h="move-frame";
qx.Mixin.define(l,{properties:{movable:{check:q,init:true},useMoveFrame:{check:q,init:false}},members:{__kt:null,__ku:null,__kv:null,__kw:null,__kx:null,__ky:null,__kz:null,__kA:false,__kB:null,__kC:0,_activateMoveHandle:function(t){if(this.__kt){throw new Error("The move handle could not be redefined!");
}this.__kt=t;
t.addListener(o,this._onMoveMouseDown,this);
t.addListener(p,this._onMoveMouseUp,this);
t.addListener(j,this._onMoveMouseMove,this);
t.addListener(n,this.__kG,this);
},__kD:function(){var z=this.__ku;

if(!z){z=this.__ku=new qx.ui.core.Widget();
z.setAppearance(h);
z.exclude();
qx.core.Init.getApplication().getRoot().add(z);
}return z;
},__kE:function(){var location=this.getContainerLocation();
var y=this.getBounds();
var x=this.__kD();
x.setUserBounds(location.left,location.top,y.width,y.height);
x.show();
x.setZIndex(this.getZIndex()+1);
},__kF:function(e){var b=this.__kv;
var f=Math.max(b.left,Math.min(b.right,e.getDocumentLeft()));
var d=Math.max(b.top,Math.min(b.bottom,e.getDocumentTop()));
var a=this.__kw+f;
var c=this.__kx+d;
return {viewportLeft:a,viewportTop:c,parentLeft:a-this.__ky,parentTop:c-this.__kz};
},_onMoveMouseDown:function(e){if(!this.getMovable()||this.hasState(i)){return;
}var parent=this.getLayoutParent();
var v=parent.getContentLocation();
var w=parent.getBounds();
if(qx.Class.implementsInterface(parent,qx.ui.window.IDesktop)){if(!parent.isContentBlocked()){this.__kA=true;
this.__kB=parent.getBlockerColor();
this.__kC=parent.getBlockerOpacity();
parent.setBlockerColor(null);
parent.setBlockerOpacity(1);
parent.blockContent(this.getZIndex()-1);
}}this.__kv={left:v.left,top:v.top,right:v.left+w.width,bottom:v.top+w.height};
var u=this.getContainerLocation();
this.__ky=v.left;
this.__kz=v.top;
this.__kw=u.left-e.getDocumentLeft();
this.__kx=u.top-e.getDocumentTop();
this.addState(r);
this.__kt.capture();
if(this.getUseMoveFrame()){this.__kE();
}e.stop();
},_onMoveMouseMove:function(e){if(!this.hasState(r)){return;
}var g=this.__kF(e);

if(this.getUseMoveFrame()){this.__kD().setDomPosition(g.viewportLeft,g.viewportTop);
}else{this.setDomPosition(g.parentLeft,g.parentTop);
}e.stopPropagation();
},_onMoveMouseUp:function(e){if(!this.hasState(r)){return;
}this.removeState(r);
var parent=this.getLayoutParent();

if(qx.Class.implementsInterface(parent,qx.ui.window.IDesktop)){if(this.__kA){parent.unblockContent();
parent.setBlockerColor(this.__kB);
parent.setBlockerOpacity(this.__kC);
this.__kB=null;
this.__kC=0;
}}this.__kt.releaseCapture();
var s=this.__kF(e);
this.setLayoutProperties({left:s.parentLeft,top:s.parentTop});
if(this.getUseMoveFrame()){this.__kD().exclude();
}e.stopPropagation();
},__kG:function(e){if(!this.hasState(r)){return;
}this.removeState(r);
if(this.getUseMoveFrame()){this.__kD().exclude();
}}},destruct:function(){this._disposeObjects(k,m);
this.__kv=null;
}});
})();
(function(){var p="Integer",o="_applyContentPadding",n="resetPaddingRight",m="setPaddingBottom",l="resetPaddingTop",k="qx.ui.core.MContentPadding",j="resetPaddingLeft",i="setPaddingTop",h="setPaddingRight",g="resetPaddingBottom",c="contentPaddingLeft",f="setPaddingLeft",e="contentPaddingTop",b="shorthand",a="contentPaddingRight",d="contentPaddingBottom";
qx.Mixin.define(k,{properties:{contentPaddingTop:{check:p,init:0,apply:o,themeable:true},contentPaddingRight:{check:p,init:0,apply:o,themeable:true},contentPaddingBottom:{check:p,init:0,apply:o,themeable:true},contentPaddingLeft:{check:p,init:0,apply:o,themeable:true},contentPadding:{group:[e,a,d,c],mode:b,themeable:true}},members:{__kH:{contentPaddingTop:i,contentPaddingRight:h,contentPaddingBottom:m,contentPaddingLeft:f},__kI:{contentPaddingTop:l,contentPaddingRight:n,contentPaddingBottom:g,contentPaddingLeft:j},_applyContentPadding:function(q,r,name){var s=this._getContentPaddingTarget();

if(q==null){var t=this.__kI[name];
s[t]();
}else{var u=this.__kH[name];
s[u](q);
}}}});
})();
(function(){var d="qx.ui.window.IWindowManager";
qx.Interface.define(d,{members:{setDesktop:function(f){this.assertInterface(f,qx.ui.window.IDesktop);
},changeActiveWindow:function(b,c){},updateStack:function(){},bringToFront:function(a){this.assertInstance(a,qx.ui.window.Window);
},sendToBack:function(e){this.assertInstance(e,qx.ui.window.Window);
}}});
})();
(function(){var b="__kJ",a="qx.ui.window.Manager";
qx.Class.define(a,{extend:qx.core.Object,implement:qx.ui.window.IWindowManager,members:{__kJ:null,setDesktop:function(c){this.__kJ=c;
this.updateStack();
},getDesktop:function(){return this.__kJ;
},changeActiveWindow:function(g,h){if(g){this.bringToFront(g);
}},_minZIndex:1e5,updateStack:function(){qx.ui.core.queue.Widget.add(this);
},syncWidget:function(){this.__kJ.forceUnblockContent();
var k=this.__kJ.getWindows();
var o=this._minZIndex-1;
var n=false;
var m,j=null;

for(var i=0,l=k.length;i<l;i++){m=k[i];

if(!m.isVisible()){continue;
}o+=2;
m.setZIndex(o);
if(m.getModal()){this.__kJ.blockContent(o-1);
}n=n||m.isActive();
j=m;
}
if(!n){this.__kJ.setActiveWindow(j);
}},bringToFront:function(d){var e=this.__kJ.getWindows();
var f=qx.lang.Array.remove(e,d);

if(f){e.push(d);
this.updateStack();
}},sendToBack:function(p){var q=this.__kJ.getWindows();
var r=qx.lang.Array.remove(q,p);

if(r){q.unshift(p);
this.updateStack();
}}},destruct:function(){this._disposeObjects(b);
}});
})();
(function(){var E="Boolean",D="qx.event.type.Event",C="captionbar",B="_applyCaptionBarChange",A="maximize-button",z="restore-button",y="minimize-button",x="close-button",w="title",v="icon",bk="maximized",bj="execute",bi="pane",bh="statusbar-text",bg="statusbar",bf="String",be="normal",bd="active",bc="beforeClose",bb="beforeMinimize",L="mousedown",M="changeStatus",J="changeIcon",K="excluded",H="dblclick",I="_applyActive",F="beforeRestore",G="minimize",N="changeModal",O="_applyShowStatusbar",S="_applyStatus",R="qx.ui.window.Window",U="changeCaption",T="focusout",W="beforeMaximize",V="maximize",Q="restore",ba="window",Y="close",X="changeActive",P="minimized";
qx.Class.define(R,{extend:qx.ui.core.Widget,include:[qx.ui.core.MRemoteChildrenHandling,qx.ui.core.MRemoteLayoutHandling,qx.ui.core.MResizable,qx.ui.core.MMovable,qx.ui.core.MContentPadding],construct:function(bq,br){qx.ui.core.Widget.call(this);
this._setLayout(new qx.ui.layout.VBox());
this._createChildControl(C);
this._createChildControl(bi);
if(br!=null){this.setIcon(br);
}
if(bq!=null){this.setCaption(bq);
}this._updateCaptionBar();
this.addListener(L,this._onWindowMouseDown,this,true);
this.addListener(T,this._onWindowFocusOut,this);
qx.core.Init.getApplication().getRoot().add(this);
this.initVisibility();
qx.ui.core.FocusHandler.getInstance().addRoot(this);
{};
},statics:{DEFAULT_MANAGER_CLASS:qx.ui.window.Manager},events:{"beforeClose":D,"close":D,"beforeMinimize":D,"minimize":D,"beforeMaximize":D,"maximize":D,"beforeRestore":D,"restore":D},properties:{appearance:{refine:true,init:ba},visibility:{refine:true,init:K},focusable:{refine:true,init:true},active:{check:E,init:false,apply:I,event:X},modal:{check:E,init:false,event:N},caption:{apply:B,event:U,nullable:true},icon:{check:bf,nullable:true,apply:B,event:J,themeable:true},status:{check:bf,nullable:true,apply:S,event:M},showClose:{check:E,init:true,apply:B,themeable:true},showMaximize:{check:E,init:true,apply:B,themeable:true},showMinimize:{check:E,init:true,apply:B,themeable:true},allowClose:{check:E,init:true,apply:B},allowMaximize:{check:E,init:true,apply:B},allowMinimize:{check:E,init:true,apply:B},showStatusbar:{check:E,init:false,apply:O}},members:{__kK:null,__kL:null,getChildrenContainer:function(){return this.getChildControl(bi);
},_forwardStates:{active:true,maximized:true},setLayoutParent:function(parent){{};
qx.ui.core.Widget.prototype.setLayoutParent.call(this,parent);
},_createChildControlImpl:function(j){var k;

switch(j){case bg:k=new qx.ui.container.Composite(new qx.ui.layout.HBox());
this._add(k);
k.add(this.getChildControl(bh));
break;
case bh:k=new qx.ui.basic.Label();
k.setValue(this.getStatus());
break;
case bi:k=new qx.ui.container.Composite();
this._add(k,{flex:1});
break;
case C:var m=new qx.ui.layout.Grid();
m.setRowFlex(0,1);
m.setColumnFlex(1,1);
k=new qx.ui.container.Composite(m);
this._add(k);
k.addListener(H,this._onCaptionMouseDblClick,this);
this._activateMoveHandle(k);
break;
case v:k=new qx.ui.basic.Image(this.getIcon());
this.getChildControl(C).add(k,{row:0,column:0});
break;
case w:k=new qx.ui.basic.Label(this.getCaption());
k.setWidth(0);
k.setAllowGrowX(true);
var l=this.getChildControl(C);
l.add(k,{row:0,column:1});
break;
case y:k=new qx.ui.form.Button();
k.setFocusable(false);
k.addListener(bj,this._onMinimizeButtonClick,this);
this.getChildControl(C).add(k,{row:0,column:2});
break;
case z:k=new qx.ui.form.Button();
k.setFocusable(false);
k.addListener(bj,this._onRestoreButtonClick,this);
this.getChildControl(C).add(k,{row:0,column:3});
break;
case A:k=new qx.ui.form.Button();
k.setFocusable(false);
k.addListener(bj,this._onMaximizeButtonClick,this);
this.getChildControl(C).add(k,{row:0,column:4});
break;
case x:k=new qx.ui.form.Button();
k.setFocusable(false);
k.addListener(bj,this._onCloseButtonClick,this);
this.getChildControl(C).add(k,{row:0,column:6});
break;
}return k||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,j);
},_updateCaptionBar:function(){var t;
var u=this.getIcon();

if(u){this.getChildControl(v).setSource(u);
this._showChildControl(v);
}else{this._excludeChildControl(v);
}var s=this.getCaption();

if(s){this.getChildControl(w).setValue(s);
this._showChildControl(w);
}else{this._excludeChildControl(w);
}
if(this.getShowMinimize()){this._showChildControl(y);
t=this.getChildControl(y);
this.getAllowMinimize()?t.resetEnabled():t.setEnabled(false);
}else{this._excludeChildControl(y);
}
if(this.getShowMaximize()){if(this.isMaximized()){this._showChildControl(z);
this._excludeChildControl(A);
}else{this._showChildControl(A);
this._excludeChildControl(z);
}t=this.getChildControl(A);
this.getAllowMaximize()?t.resetEnabled():t.setEnabled(false);
}else{this._excludeChildControl(A);
this._excludeChildControl(z);
}
if(this.getShowClose()){this._showChildControl(x);
t=this.getChildControl(x);
this.getAllowClose()?t.resetEnabled():t.setEnabled(false);
}else{this._excludeChildControl(x);
}},close:function(){if(!this.isVisible()){return;
}
if(this.fireNonBubblingEvent(bc,qx.event.type.Event,[false,true])){this.hide();
this.fireEvent(Y);
}},open:function(){this.show();
this.setActive(true);
this.focus();
},center:function(){var parent=this.getLayoutParent();

if(parent){var bt=parent.getBounds();

if(bt){var bu=this.getSizeHint();
var bs=Math.round((bt.width-bu.width)/2);
var top=Math.round((bt.height-bu.height)/2);

if(top<0){top=0;
}this.moveTo(bs,top);
return;
}}{};
},maximize:function(){if(this.isMaximized()){return;
}var parent=this.getLayoutParent();

if(parent!=null&&parent.supportsMaximize()){if(this.fireNonBubblingEvent(W,qx.event.type.Event,[false,true])){if(!this.isVisible()){this.open();
}var b=this.getLayoutProperties();
this.__kL=b.left===undefined?0:b.left;
this.__kK=b.top===undefined?0:b.top;
this.setLayoutProperties({left:null,top:null,edge:0});
this.addState(bk);
this._updateCaptionBar();
this.fireEvent(V);
}}},minimize:function(){if(!this.isVisible()){return;
}
if(this.fireNonBubblingEvent(bb,qx.event.type.Event,[false,true])){var bp=this.getLayoutProperties();
this.__kL=bp.left===undefined?0:bp.left;
this.__kK=bp.top===undefined?0:bp.top;
this.removeState(bk);
this.hide();
this.fireEvent(G);
}},restore:function(){if(this.getMode()===be){return;
}
if(this.fireNonBubblingEvent(F,qx.event.type.Event,[false,true])){if(!this.isVisible()){this.open();
}var a=this.__kL;
var top=this.__kK;
this.setLayoutProperties({edge:null,left:a,top:top});
this.removeState(bk);
this._updateCaptionBar();
this.fireEvent(Q);
}},moveTo:function(h,top){if(this.isMaximized()){return;
}this.setLayoutProperties({left:h,top:top});
},isMaximized:function(){return this.hasState(bk);
},getMode:function(){if(!this.isVisible()){return P;
}else{if(this.isMaximized()){return bk;
}else{return be;
}}},_applyActive:function(f,g){if(g){this.removeState(bd);
}else{this.addState(bd);
}},_getContentPaddingTarget:function(){return this.getChildControl(bi);
},_applyShowStatusbar:function(c,d){if(c){this._showChildControl(bg);
}else{this._excludeChildControl(bg);
}},_applyCaptionBarChange:function(bn,bo){this._updateCaptionBar();
},_applyStatus:function(n,o){var p=this.getChildControl(bh,true);

if(p){p.setValue(n);
}},_applyCaption:function(q,r){{};
this.getChildControl(w).setValue(q);
},_applyIcon:function(bl,bm){{};
this.getChildControl(v).setSource(bl);
},_onWindowEventStop:function(e){e.stopPropagation();
},_onWindowMouseDown:function(e){this.setActive(true);
},_onWindowFocusOut:function(e){if(this.getModal()){return;
}var i=e.getRelatedTarget();

if(i!=null&&!qx.ui.core.Widget.contains(this,i)){this.setActive(false);
}},_onCaptionMouseDblClick:function(e){if(this.getAllowMaximize()){this.isMaximized()?this.restore():this.maximize();
}},_onMinimizeButtonClick:function(e){this.minimize();
this.getChildControl(y).reset();
},_onRestoreButtonClick:function(e){this.restore();
this.getChildControl(z).reset();
},_onMaximizeButtonClick:function(e){this.maximize();
this.getChildControl(A).reset();
},_onCloseButtonClick:function(e){this.close();
this.getChildControl(x).reset();
}}});
})();
(function(){var a="qx.ui.window.IDesktop";
qx.Interface.define(a,{members:{setWindowManager:function(c){this.assertInterface(c,qx.ui.window.IWindowManager);
},getWindows:function(){},supportsMaximize:function(){},blockContent:function(b){this.assertInteger(b);
},unblockContent:function(){},isContentBlocked:function(){}}});
})();
(function(){var n="_applyLayoutChange",m="top",k="left",j="middle",h="Decorator",g="center",f="_applyReversed",e="bottom",d="qx.ui.layout.VBox",c="Integer",a="right",b="Boolean";
qx.Class.define(d,{extend:qx.ui.layout.Abstract,construct:function(u,v,w){qx.ui.layout.Abstract.call(this);

if(u){this.setSpacing(u);
}
if(v){this.setAlignY(v);
}
if(w){this.setSeparator(w);
}},properties:{alignY:{check:[m,j,e],init:m,apply:n},alignX:{check:[k,g,a],init:k,apply:n},spacing:{check:c,init:0,apply:n},separator:{check:h,nullable:true,apply:n},reversed:{check:b,init:false,apply:f}},members:{__kM:null,__kN:null,__kO:null,__kP:null,_applyReversed:function(){this._invalidChildrenCache=true;
this._applyLayoutChange();
},__kQ:function(){var t=this._getLayoutChildren();
var length=t.length;
var p=false;
var o=this.__kM&&this.__kM.length!=length&&this.__kN&&this.__kM;
var r;
var q=o?this.__kM:new Array(length);
var s=o?this.__kN:new Array(length);
if(this.getReversed()){t=t.concat().reverse();
}for(var i=0;i<length;i++){r=t[i].getLayoutProperties();

if(r.height!=null){q[i]=parseFloat(r.height)/100;
}
if(r.flex!=null){s[i]=r.flex;
p=true;
}else{s[i]=0;
}}if(!o){this.__kM=q;
this.__kN=s;
}this.__kO=p;
this.__kP=t;
delete this._invalidChildrenCache;
},verifyLayoutProperty:null,renderLayout:function(M,N){if(this._invalidChildrenCache){this.__kQ();
}var U=this.__kP;
var length=U.length;
var bf=qx.ui.layout.Util;
var be=this.getSpacing();
var bi=this.getSeparator();

if(bi){var R=bf.computeVerticalSeparatorGaps(U,be,bi);
}else{var R=bf.computeVerticalGaps(U,be,true);
}var i,P,Q,Y;
var ba=[];
var bg=R;

for(i=0;i<length;i+=1){Y=this.__kM[i];
Q=Y!=null?Math.floor((N-R)*Y):U[i].getSizeHint().height;
ba.push(Q);
bg+=Q;
}if(this.__kO&&bg!=N){var W={};
var bd,bh;

for(i=0;i<length;i+=1){bd=this.__kN[i];

if(bd>0){V=U[i].getSizeHint();
W[i]={min:V.minHeight,value:ba[i],max:V.maxHeight,flex:bd};
}}var S=bf.computeFlexOffsets(W,N,bg);

for(i in S){bh=S[i].offset;
ba[i]+=bh;
bg+=bh;
}}var top=U[0].getMarginTop();
if(bg<N&&this.getAlignY()!=m){top=N-bg;

if(this.getAlignY()===j){top=Math.round(top/2);
}}var V,bk,bb,Q,X,bc,T;
this._clearSeparators();
if(bi){var bj=qx.theme.manager.Decoration.getInstance().resolve(bi).getInsets();
var O=bj.top+bj.bottom;
}for(i=0;i<length;i+=1){P=U[i];
Q=ba[i];
V=P.getSizeHint();
bc=P.getMarginLeft();
T=P.getMarginRight();
bb=Math.max(V.minWidth,Math.min(M-bc-T,V.maxWidth));
bk=bf.computeHorizontalAlignOffset(P.getAlignX()||this.getAlignX(),bb,M,bc,T);
if(i>0){if(bi){top+=X+be;
this._renderSeparator(bi,{top:top,left:0,height:O,width:M});
top+=O+be+P.getMarginTop();
}else{top+=bf.collapseMargins(be,X,P.getMarginTop());
}}P.renderLayout(bk,top,bb,Q);
top+=Q;
X=P.getMarginBottom();
}},_computeSizeHint:function(){if(this._invalidChildrenCache){this.__kQ();
}var D=qx.ui.layout.Util;
var L=this.__kP;
var z=0,C=0,B=0;
var x=0,E=0;
var I,y,K;
for(var i=0,l=L.length;i<l;i+=1){I=L[i];
y=I.getSizeHint();
C+=y.height;
var H=this.__kN[i];
var A=this.__kM[i];

if(H){z+=y.minHeight;
}else if(A){B=Math.max(B,Math.round(y.minHeight/A));
}else{z+=y.height;
}K=I.getMarginLeft()+I.getMarginRight();
if((y.width+K)>E){E=y.width+K;
}if((y.minWidth+K)>x){x=y.minWidth+K;
}}z+=B;
var G=this.getSpacing();
var J=this.getSeparator();

if(J){var F=D.computeVerticalSeparatorGaps(L,G,J);
}else{var F=D.computeVerticalGaps(L,G,true);
}return {minHeight:z+F,height:C+F,minWidth:x,width:E};
}},destruct:function(){this.__kM=this.__kN=this.__kP=null;
}});
})();
(function(){var L="_applyLayoutChange",K="left",J="center",I="top",H="Decorator",G="middle",F="_applyReversed",E="bottom",D="Boolean",C="right",A="Integer",B="qx.ui.layout.HBox";
qx.Class.define(B,{extend:qx.ui.layout.Abstract,construct:function(bi,bj,bk){qx.ui.layout.Abstract.call(this);

if(bi){this.setSpacing(bi);
}
if(bj){this.setAlignX(bj);
}
if(bk){this.setSeparator(bk);
}},properties:{alignX:{check:[K,J,C],init:K,apply:L},alignY:{check:[I,G,E],init:I,apply:L},spacing:{check:A,init:0,apply:L},separator:{check:H,nullable:true,apply:L},reversed:{check:D,init:false,apply:F}},members:{__kR:null,__kS:null,__kT:null,__kU:null,_applyReversed:function(){this._invalidChildrenCache=true;
this._applyLayoutChange();
},__kV:function(){var R=this._getLayoutChildren();
var length=R.length;
var O=false;
var M=this.__kR&&this.__kR.length!=length&&this.__kS&&this.__kR;
var P;
var N=M?this.__kR:new Array(length);
var Q=M?this.__kS:new Array(length);
if(this.getReversed()){R=R.concat().reverse();
}for(var i=0;i<length;i++){P=R[i].getLayoutProperties();

if(P.width!=null){N[i]=parseFloat(P.width)/100;
}
if(P.flex!=null){Q[i]=P.flex;
O=true;
}else{Q[i]=0;
}}if(!M){this.__kR=N;
this.__kS=Q;
}this.__kT=O;
this.__kU=R;
delete this._invalidChildrenCache;
},verifyLayoutProperty:null,renderLayout:function(a,b){if(this._invalidChildrenCache){this.__kV();
}var h=this.__kU;
var length=h.length;
var s=qx.ui.layout.Util;
var r=this.getSpacing();
var v=this.getSeparator();

if(v){var e=s.computeHorizontalSeparatorGaps(h,r,v);
}else{var e=s.computeHorizontalGaps(h,r,true);
}var i,c,p,o;
var u=[];
var j=e;

for(i=0;i<length;i+=1){o=this.__kR[i];
p=o!=null?Math.floor((a-e)*o):h[i].getSizeHint().width;
u.push(p);
j+=p;
}if(this.__kT&&j!=a){var m={};
var q,t;

for(i=0;i<length;i+=1){q=this.__kS[i];

if(q>0){k=h[i].getSizeHint();
m[i]={min:k.minWidth,value:u[i],max:k.maxWidth,flex:q};
}}var f=s.computeFlexOffsets(m,a,j);

for(i in f){t=f[i].offset;
u[i]+=t;
j+=t;
}}var z=h[0].getMarginLeft();
if(j<a&&this.getAlignX()!=K){z=a-j;

if(this.getAlignX()===J){z=Math.round(z/2);
}}var k,top,d,p,g,x,n;
var r=this.getSpacing();
this._clearSeparators();
if(v){var w=qx.theme.manager.Decoration.getInstance().resolve(v).getInsets();
var y=w.left+w.right;
}for(i=0;i<length;i+=1){c=h[i];
p=u[i];
k=c.getSizeHint();
x=c.getMarginTop();
n=c.getMarginBottom();
d=Math.max(k.minHeight,Math.min(b-x-n,k.maxHeight));
top=s.computeVerticalAlignOffset(c.getAlignY()||this.getAlignY(),d,b,x,n);
if(i>0){if(v){z+=g+r;
this._renderSeparator(v,{left:z,top:0,width:y,height:b});
z+=y+r+c.getMarginLeft();
}else{z+=s.collapseMargins(r,g,c.getMarginLeft());
}}c.renderLayout(z,top,p,d);
z+=p;
g=c.getMarginRight();
}},_computeSizeHint:function(){if(this._invalidChildrenCache){this.__kV();
}var Y=qx.ui.layout.Util;
var bh=this.__kU;
var S=0,ba=0,W=0;
var V=0,X=0;
var be,T,bg;
for(var i=0,l=bh.length;i<l;i+=1){be=bh[i];
T=be.getSizeHint();
ba+=T.width;
var bd=this.__kS[i];
var U=this.__kR[i];

if(bd){S+=T.minWidth;
}else if(U){W=Math.max(W,Math.round(T.minWidth/U));
}else{S+=T.width;
}bg=be.getMarginTop()+be.getMarginBottom();
if((T.height+bg)>X){X=T.height+bg;
}if((T.minHeight+bg)>V){V=T.minHeight+bg;
}}S+=W;
var bc=this.getSpacing();
var bf=this.getSeparator();

if(bf){var bb=Y.computeHorizontalSeparatorGaps(bh,bc,bf);
}else{var bb=Y.computeHorizontalGaps(bh,bc,true);
}return {minWidth:S+bb,width:ba+bb,minHeight:V,height:X};
}},destruct:function(){this.__kR=this.__kS=this.__kU=null;
}});
})();
(function(){var dt="left",ds="top",dr="_applyLayoutChange",dq="hAlign",dp="flex",dn="vAlign",dm="Integer",dl="minWidth",dk="width",dj="minHeight",dg="qx.ui.layout.Grid",di="height",dh="maxHeight",df="maxWidth";
qx.Class.define(dg,{extend:qx.ui.layout.Abstract,construct:function(w,z){qx.ui.layout.Abstract.call(this);
this.__kW=[];
this.__kX=[];

if(w){this.setSpacingX(w);
}
if(z){this.setSpacingY(z);
}},properties:{spacingX:{check:dm,init:0,apply:dr},spacingY:{check:dm,init:0,apply:dr}},members:{__kY:null,__kW:null,__kX:null,__la:null,__lb:null,__lc:null,__ld:null,__le:null,__lf:null,verifyLayoutProperty:null,__lg:function(){var da=[];
var cY=[];
var db=[];
var cW=-1;
var cV=-1;
var dd=this._getLayoutChildren();

for(var i=0,l=dd.length;i<l;i++){var cX=dd[i];
var dc=cX.getLayoutProperties();
var de=dc.row;
var cU=dc.column;
dc.colSpan=dc.colSpan||1;
dc.rowSpan=dc.rowSpan||1;
if(de==null||cU==null){throw new Error("The layout properties 'row' and 'column' of the child widget '"+cX+"' must be defined!");
}
if(da[de]&&da[de][cU]){throw new Error("Cannot add widget '"+cX+"'!. "+"There is already a widget '"+da[de][cU]+"' in this cell ("+de+", "+cU+")");
}
for(var x=cU;x<cU+dc.colSpan;x++){for(var y=de;y<de+dc.rowSpan;y++){if(da[y]==undefined){da[y]=[];
}da[y][x]=cX;
cV=Math.max(cV,x);
cW=Math.max(cW,y);
}}
if(dc.rowSpan>1){db.push(cX);
}
if(dc.colSpan>1){cY.push(cX);
}}for(var y=0;y<=cW;y++){if(da[y]==undefined){da[y]=[];
}}this.__kY=da;
this.__la=cY;
this.__lb=db;
this.__lc=cW;
this.__ld=cV;
this.__le=null;
this.__lf=null;
delete this._invalidChildrenCache;
},_setRowData:function(cb,cc,cd){var ce=this.__kW[cb];

if(!ce){this.__kW[cb]={};
this.__kW[cb][cc]=cd;
}else{ce[cc]=cd;
}},_setColumnData:function(du,dv,dw){var dx=this.__kX[du];

if(!dx){this.__kX[du]={};
this.__kX[du][dv]=dw;
}else{dx[dv]=dw;
}},setSpacing:function(dL){this.setSpacingY(dL);
this.setSpacingX(dL);
return this;
},setColumnAlign:function(dX,dY,ea){{};
this._setColumnData(dX,dq,dY);
this._setColumnData(dX,dn,ea);
this._applyLayoutChange();
return this;
},getColumnAlign:function(bY){var ca=this.__kX[bY]||{};
return {vAlign:ca.vAlign||ds,hAlign:ca.hAlign||dt};
},setRowAlign:function(cR,cS,cT){{};
this._setRowData(cR,dq,cS);
this._setRowData(cR,dn,cT);
this._applyLayoutChange();
return this;
},getRowAlign:function(ch){var ci=this.__kW[ch]||{};
return {vAlign:ci.vAlign||ds,hAlign:ci.hAlign||dt};
},getCellWidget:function(W,X){if(this._invalidChildrenCache){this.__lg();
}var W=this.__kY[W]||{};
return W[X]||null;
},getRowCount:function(){if(this._invalidChildrenCache){this.__lg();
}return this.__lc+1;
},getColumnCount:function(){if(this._invalidChildrenCache){this.__lg();
}return this.__ld+1;
},getCellAlign:function(cq,cr){var cx=ds;
var cv=dt;
var cw=this.__kW[cq];
var ct=this.__kX[cr];
var cs=this.__kY[cq][cr];

if(cs){var cu={vAlign:cs.getAlignY(),hAlign:cs.getAlignX()};
}else{cu={};
}if(cu.vAlign){cx=cu.vAlign;
}else if(cw&&cw.vAlign){cx=cw.vAlign;
}else if(ct&&ct.vAlign){cx=ct.vAlign;
}if(cu.hAlign){cv=cu.hAlign;
}else if(ct&&ct.hAlign){cv=ct.hAlign;
}else if(cw&&cw.hAlign){cv=cw.hAlign;
}return {vAlign:cx,hAlign:cv};
},setColumnFlex:function(A,B){this._setColumnData(A,dp,B);
this._applyLayoutChange();
return this;
},getColumnFlex:function(bW){var bX=this.__kX[bW]||{};
return bX.flex!==undefined?bX.flex:0;
},setRowFlex:function(Y,ba){this._setRowData(Y,dp,ba);
this._applyLayoutChange();
return this;
},getRowFlex:function(a){var b=this.__kW[a]||{};
var c=b.flex!==undefined?b.flex:0;
return c;
},setColumnMaxWidth:function(bU,bV){this._setColumnData(bU,df,bV);
this._applyLayoutChange();
return this;
},getColumnMaxWidth:function(d){var e=this.__kX[d]||{};
return e.maxWidth!==undefined?e.maxWidth:Infinity;
},setColumnWidth:function(Q,R){this._setColumnData(Q,dk,R);
this._applyLayoutChange();
return this;
},getColumnWidth:function(bb){var bc=this.__kX[bb]||{};
return bc.width!==undefined?bc.width:null;
},setColumnMinWidth:function(dy,dz){this._setColumnData(dy,dl,dz);
this._applyLayoutChange();
return this;
},getColumnMinWidth:function(cA){var cB=this.__kX[cA]||{};
return cB.minWidth||0;
},setRowMaxHeight:function(cN,cO){this._setRowData(cN,dh,cO);
this._applyLayoutChange();
return this;
},getRowMaxHeight:function(cP){var cQ=this.__kW[cP]||{};
return cQ.maxHeight||Infinity;
},setRowHeight:function(cf,cg){this._setRowData(cf,di,cg);
this._applyLayoutChange();
return this;
},getRowHeight:function(S){var T=this.__kW[S]||{};
return T.height!==undefined?T.height:null;
},setRowMinHeight:function(U,V){this._setRowData(U,dj,V);
this._applyLayoutChange();
return this;
},getRowMinHeight:function(cy){var cz=this.__kW[cy]||{};
return cz.minHeight||0;
},__lh:function(bP){var bT=bP.getSizeHint();
var bS=bP.getMarginLeft()+bP.getMarginRight();
var bR=bP.getMarginTop()+bP.getMarginBottom();
var bQ={height:bT.height+bR,width:bT.width+bS,minHeight:bT.minHeight+bR,minWidth:bT.minWidth+bS,maxHeight:bT.maxHeight+bR,maxWidth:bT.maxWidth+bS};
return bQ;
},_fixHeightsRowSpan:function(C){var N=this.getSpacingY();

for(var i=0,l=this.__lb.length;i<l;i++){var F=this.__lb[i];
var H=this.__lh(F);
var I=F.getLayoutProperties();
var E=I.row;
var L=N*(I.rowSpan-1);
var D=L;
var K={};

for(var j=0;j<I.rowSpan;j++){var P=I.row+j;
var G=C[P];
var O=this.getRowFlex(P);

if(O>0){K[P]={min:G.minHeight,value:G.height,max:G.maxHeight,flex:O};
}L+=G.height;
D+=G.minHeight;
}if(L<H.height){var M=qx.ui.layout.Util.computeFlexOffsets(K,H.height,L);

for(var j=0;j<I.rowSpan;j++){var J=M[E+j]?M[E+j].offset:0;
C[E+j].height+=J;
}}if(D<H.minHeight){var M=qx.ui.layout.Util.computeFlexOffsets(K,H.minHeight,D);

for(var j=0;j<I.rowSpan;j++){var J=M[E+j]?M[E+j].offset:0;
C[E+j].minHeight+=J;
}}}},_fixWidthsColSpan:function(f){var m=this.getSpacingX();

for(var i=0,l=this.__la.length;i<l;i++){var g=this.__la[i];
var k=this.__lh(g);
var o=g.getLayoutProperties();
var h=o.column;
var u=m*(o.colSpan-1);
var n=u;
var p={};
var r;

for(var j=0;j<o.colSpan;j++){var v=o.column+j;
var t=f[v];
var s=this.getColumnFlex(v);
if(s>0){p[v]={min:t.minWidth,value:t.width,max:t.maxWidth,flex:s};
}u+=t.width;
n+=t.minWidth;
}if(u<k.width){var q=qx.ui.layout.Util.computeFlexOffsets(p,k.width,u);

for(var j=0;j<o.colSpan;j++){r=q[h+j]?q[h+j].offset:0;
f[h+j].width+=r;
}}if(n<k.minWidth){var q=qx.ui.layout.Util.computeFlexOffsets(p,k.minWidth,n);

for(var j=0;j<o.colSpan;j++){r=q[h+j]?q[h+j].offset:0;
f[h+j].minWidth+=r;
}}}},_getRowHeights:function(){if(this.__le!=null){return this.__le;
}var cL=[];
var cE=this.__lc;
var cD=this.__ld;

for(var cM=0;cM<=cE;cM++){var cF=0;
var cH=0;
var cG=0;

for(var cK=0;cK<=cD;cK++){var cC=this.__kY[cM][cK];

if(!cC){continue;
}var cI=cC.getLayoutProperties().rowSpan||0;

if(cI>1){continue;
}var cJ=this.__lh(cC);

if(this.getRowFlex(cM)>0){cF=Math.max(cF,cJ.minHeight);
}else{cF=Math.max(cF,cJ.height);
}cH=Math.max(cH,cJ.height);
}var cF=Math.max(cF,this.getRowMinHeight(cM));
var cG=this.getRowMaxHeight(cM);

if(this.getRowHeight(cM)!==null){var cH=this.getRowHeight(cM);
}else{var cH=Math.max(cF,Math.min(cH,cG));
}cL[cM]={minHeight:cF,height:cH,maxHeight:cG};
}
if(this.__lb.length>0){this._fixHeightsRowSpan(cL);
}this.__le=cL;
return cL;
},_getColWidths:function(){if(this.__lf!=null){return this.__lf;
}var dQ=[];
var dN=this.__ld;
var dP=this.__lc;

for(var dV=0;dV<=dN;dV++){var dT=0;
var dS=0;
var dO=Infinity;

for(var dW=0;dW<=dP;dW++){var dM=this.__kY[dW][dV];

if(!dM){continue;
}var dR=dM.getLayoutProperties().colSpan||0;

if(dR>1){continue;
}var dU=this.__lh(dM);

if(this.getColumnFlex(dV)>0){dS=Math.max(dS,dU.minWidth);
}else{dS=Math.max(dS,dU.width);
}dT=Math.max(dT,dU.width);
}var dS=Math.max(dS,this.getColumnMinWidth(dV));
var dO=this.getColumnMaxWidth(dV);

if(this.getColumnWidth(dV)!==null){var dT=this.getColumnWidth(dV);
}else{var dT=Math.max(dS,Math.min(dT,dO));
}dQ[dV]={minWidth:dS,width:dT,maxWidth:dO};
}
if(this.__la.length>0){this._fixWidthsColSpan(dQ);
}this.__lf=dQ;
return dQ;
},_getColumnFlexOffsets:function(cj){var ck=this.getSizeHint();
var co=cj-ck.width;

if(co==0){return {};
}var cm=this._getColWidths();
var cl={};

for(var i=0,l=cm.length;i<l;i++){var cp=cm[i];
var cn=this.getColumnFlex(i);

if((cn<=0)||(cp.width==cp.maxWidth&&co>0)||(cp.width==cp.minWidth&&co<0)){continue;
}cl[i]={min:cp.minWidth,value:cp.width,max:cp.maxWidth,flex:cn};
}return qx.ui.layout.Util.computeFlexOffsets(cl,cj,ck.width);
},_getRowFlexOffsets:function(bd){var be=this.getSizeHint();
var bh=bd-be.height;

if(bh==0){return {};
}var bi=this._getRowHeights();
var bf={};

for(var i=0,l=bi.length;i<l;i++){var bj=bi[i];
var bg=this.getRowFlex(i);

if((bg<=0)||(bj.height==bj.maxHeight&&bh>0)||(bj.height==bj.minHeight&&bh<0)){continue;
}bf[i]={min:bj.minHeight,value:bj.height,max:bj.maxHeight,flex:bg};
}return qx.ui.layout.Util.computeFlexOffsets(bf,bd,be.height);
},renderLayout:function(bk,bl){if(this._invalidChildrenCache){this.__lg();
}var bz=qx.ui.layout.Util;
var bn=this.getSpacingX();
var bt=this.getSpacingY();
var bE=this._getColWidths();
var bD=this._getColumnFlexOffsets(bk);
var bo=[];
var bG=this.__ld;
var bm=this.__lc;
var bF;

for(var bH=0;bH<=bG;bH++){bF=bD[bH]?bD[bH].offset:0;
bo[bH]=bE[bH].width+bF;
}var bw=this._getRowHeights();
var by=this._getRowFlexOffsets(bl);
var bN=[];

for(var bu=0;bu<=bm;bu++){bF=by[bu]?by[bu].offset:0;
bN[bu]=bw[bu].height+bF;
}var bO=0;

for(var bH=0;bH<=bG;bH++){var top=0;

for(var bu=0;bu<=bm;bu++){var bB=this.__kY[bu][bH];
if(!bB){top+=bN[bu]+bt;
continue;
}var bp=bB.getLayoutProperties();
if(bp.row!==bu||bp.column!==bH){top+=bN[bu]+bt;
continue;
}var bM=bn*(bp.colSpan-1);

for(var i=0;i<bp.colSpan;i++){bM+=bo[bH+i];
}var bC=bt*(bp.rowSpan-1);

for(var i=0;i<bp.rowSpan;i++){bC+=bN[bu+i];
}var bq=bB.getSizeHint();
var bK=bB.getMarginTop();
var bA=bB.getMarginLeft();
var bx=bB.getMarginBottom();
var bs=bB.getMarginRight();
var bv=Math.max(bq.minWidth,Math.min(bM-bA-bs,bq.maxWidth));
var bL=Math.max(bq.minHeight,Math.min(bC-bK-bx,bq.maxHeight));
var bI=this.getCellAlign(bu,bH);
var bJ=bO+bz.computeHorizontalAlignOffset(bI.hAlign,bv,bM,bA,bs);
var br=top+bz.computeVerticalAlignOffset(bI.vAlign,bL,bC,bK,bx);
bB.renderLayout(bJ,br,bv,bL);
top+=bN[bu]+bt;
}bO+=bo[bH]+bn;
}},invalidateLayoutCache:function(){qx.ui.layout.Abstract.prototype.invalidateLayoutCache.call(this);
this.__lf=null;
this.__le=null;
},_computeSizeHint:function(){if(this._invalidChildrenCache){this.__lg();
}var dE=this._getColWidths();
var dG=0,dH=0;

for(var i=0,l=dE.length;i<l;i++){var dI=dE[i];

if(this.getColumnFlex(i)>0){dG+=dI.minWidth;
}else{dG+=dI.width;
}dH+=dI.width;
}var dJ=this._getRowHeights();
var dC=0,dF=0;

for(var i=0,l=dJ.length;i<l;i++){var dK=dJ[i];

if(this.getRowFlex(i)>0){dC+=dK.minHeight;
}else{dC+=dK.height;
}dF+=dK.height;
}var dB=this.getSpacingX()*(dE.length-1);
var dA=this.getSpacingY()*(dJ.length-1);
var dD={minWidth:dG+dB,width:dH+dB,minHeight:dC+dA,height:dF+dA};
return dD;
}},destruct:function(){this.__kY=this.__kW=this.__kX=this.__la=this.__lb=this.__lf=this.__le=null;
}});
})();
(function(){var n="execute",m="toolTipText",l="icon",k="label",j="qx.ui.core.MExecutable",h="value",g="qx.event.type.Event",f="_applyCommand",d="enabled",c="menu",a="changeCommand",b="qx.ui.core.Command";
qx.Mixin.define(j,{events:{"execute":g},properties:{command:{check:b,apply:f,event:a,nullable:true}},members:{__li:null,__lj:false,__lk:null,_bindableProperties:[d,k,l,m,h,c],execute:function(){var o=this.getCommand();

if(o){if(this.__lj){this.__lj=false;
}else{this.__lj=true;
o.execute(this);
}}this.fireEvent(n);
},__ll:function(e){if(this.__lj){this.__lj=false;
return;
}this.__lj=true;
this.execute();
},_applyCommand:function(p,q){if(q!=null){q.removeListenerById(this.__lk);
}
if(p!=null){this.__lk=p.addListener(n,this.__ll,this);
}var t=this.__li;

if(t==null){this.__li=t={};
}
for(var i=0;i<this._bindableProperties.length;i++){var s=this._bindableProperties[i];
if(q!=null&&t[s]!=null){q.removeBinding(t[s]);
t[s]=null;
}if(p!=null&&qx.Class.hasProperty(this.constructor,s)){var r=p.get(s);

if(r==null){var u=this.get(s);
}t[s]=p.bind(s,this,s);
if(u){this.set(s,u);
}}}}},destruct:function(){this.__li=null;
}});
})();
(function(){var c="qx.ui.form.IExecutable",b="qx.event.type.Data";
qx.Interface.define(c,{events:{"execute":b},members:{setCommand:function(a){return arguments.length==1;
},getCommand:function(){},execute:function(){}}});
})();
(function(){var t="pressed",s="abandoned",r="hovered",q="Enter",p="Space",o="dblclick",n="qx.ui.form.Button",m="mouseup",l="mousedown",k="mouseover",h="mouseout",j="keydown",i="button",g="keyup";
qx.Class.define(n,{extend:qx.ui.basic.Atom,include:[qx.ui.core.MExecutable],implement:[qx.ui.form.IExecutable],construct:function(c,d,f){qx.ui.basic.Atom.call(this,c,d);

if(f!=null){this.setCommand(f);
}this.addListener(k,this._onMouseOver);
this.addListener(h,this._onMouseOut);
this.addListener(l,this._onMouseDown);
this.addListener(m,this._onMouseUp);
this.addListener(j,this._onKeyDown);
this.addListener(g,this._onKeyUp);
this.addListener(o,this._onStopEvent);
},properties:{appearance:{refine:true,init:i},focusable:{refine:true,init:true}},members:{_forwardStates:{focused:true,hovered:true,pressed:true,disabled:true},press:function(){if(this.hasState(s)){return;
}this.addState(t);
},release:function(){if(this.hasState(t)){this.removeState(t);
}},reset:function(){this.removeState(t);
this.removeState(s);
this.removeState(r);
},_onMouseOver:function(e){if(!this.isEnabled()||e.getTarget()!==this){return;
}
if(this.hasState(s)){this.removeState(s);
this.addState(t);
}this.addState(r);
},_onMouseOut:function(e){if(!this.isEnabled()||e.getTarget()!==this){return;
}this.removeState(r);

if(this.hasState(t)){this.removeState(t);
this.addState(s);
}},_onMouseDown:function(e){if(!e.isLeftPressed()){return;
}e.stopPropagation();
this.capture();
this.removeState(s);
this.addState(t);
},_onMouseUp:function(e){this.releaseCapture();
var a=this.hasState(t);
var b=this.hasState(s);

if(a){this.removeState(t);
}
if(b){this.removeState(s);
}else{this.addState(r);

if(a){this.execute();
}}e.stopPropagation();
},_onKeyDown:function(e){switch(e.getKeyIdentifier()){case q:case p:this.removeState(s);
this.addState(t);
e.stopPropagation();
}},_onKeyUp:function(e){switch(e.getKeyIdentifier()){case q:case p:if(this.hasState(t)){this.removeState(s);
this.removeState(t);
this.execute();
e.stopPropagation();
}}}}});
})();
(function(){var l="qx.event.type.Data",k="EVENT_TYPE_DATA_CHANGED",j="qx.ui.table.ITableModel",i="New code should not use this. Instead, use the text string 'dataChanged' literally.",h="New code should not use this. Instead, use the text string 'metaDataChanged' literally.",g="qx.event.type.Event",f="EVENT_TYPE_META_DATA_CHANGED";
qx.Interface.define(j,{events:{"dataChanged":l,"metaDataChanged":g,"sorted":l},statics:{EVENT_TYPE_DATA_CHANGED:"dataChanged",EVENT_TYPE_META_DATA_CHANGED:"metaDataChanged"},members:{getRowCount:function(){},getRowData:function(r){},getColumnCount:function(){},getColumnId:function(m){},getColumnIndexById:function(q){},getColumnName:function(x){},isColumnEditable:function(w){},isColumnSortable:function(A){},sortByColumn:function(u,v){},getSortColumnIndex:function(){},isSortAscending:function(){},prefetchRows:function(a,b){},getValue:function(s,t){},getValueById:function(y,z){},setValue:function(c,d,e){},setValueById:function(n,o,p){}}});
qx.log.Logger.deprecatedConstantWarning(qx.ui.table.ITableModel,k,i);
qx.log.Logger.deprecatedConstantWarning(qx.ui.table.ITableModel,f,h);
})();
(function(){var l="metaDataChanged",k="qx.event.type.Data",j="qx.event.type.Event",h="abstract",g="qx.ui.table.model.Abstract";
qx.Class.define(g,{type:h,extend:qx.core.Object,implement:qx.ui.table.ITableModel,events:{"dataChanged":k,"metaDataChanged":j,"sorted":k},construct:function(){qx.core.Object.call(this);
this.__lm=[];
this.__ln=[];
this.__lo={};
},members:{__lm:null,__ln:null,__lo:null,__lp:null,getRowCount:function(){throw new Error("getRowCount is abstract");
},getRowData:function(r){return null;
},isColumnEditable:function(x){return false;
},isColumnSortable:function(d){return false;
},sortByColumn:function(m,n){},getSortColumnIndex:function(){return -1;
},isSortAscending:function(){return true;
},prefetchRows:function(u,v){},getValue:function(E,F){throw new Error("getValue is abstract");
},getValueById:function(C,D){return this.getValue(this.getColumnIndexById(C),D);
},setValue:function(o,p,q){throw new Error("setValue is abstract");
},setValueById:function(a,b,c){this.setValue(this.getColumnIndexById(a),b,c);
},getColumnCount:function(){return this.__lm.length;
},getColumnIndexById:function(B){return this.__lo[B];
},getColumnId:function(f){return this.__lm[f];
},getColumnName:function(e){return this.__ln[e];
},setColumnIds:function(w){this.__lm=w;
this.__lo={};

for(var i=0;i<w.length;i++){this.__lo[w[i]]=i;
}this.__ln=new Array(w.length);
if(!this.__lp){this.fireEvent(l);
}},setColumnNamesByIndex:function(t){if(this.__lm.length!=t.length){throw new Error("this.__columnIdArr and columnNameArr have different length: "+this.__lm.length+" != "+t.length);
}this.__ln=t;
this.fireEvent(l);
},setColumnNamesById:function(s){this.__ln=new Array(this.__lm.length);

for(var i=0;i<this.__lm.length;++i){this.__ln[i]=s[this.__lm[i]];
}},setColumns:function(y,z){var A=this.__lm.length==0||z;

if(z==null){if(this.__lm.length==0){z=y;
}else{z=this.__lm;
}}
if(z.length!=y.length){throw new Error("columnIdArr and columnNameArr have different length: "+z.length+" != "+y.length);
}
if(A){this.__lp=true;
this.setColumnIds(z);
this.__lp=false;
}this.setColumnNamesByIndex(y);
}},destruct:function(){this.__lm=this.__ln=this.__lo=null;
}});
})();
(function(){var bM="dataChanged",bL="metaDataChanged",bK="qx.ui.table.model.Simple",bJ="Boolean",bI="sorted";
qx.Class.define(bK,{extend:qx.ui.table.model.Abstract,construct:function(){qx.ui.table.model.Abstract.call(this);
this.__lq=[];
this.__lr=-1;
this.__ls=[];
this.__lt=null;
},properties:{caseSensitiveSorting:{check:bJ,init:true}},statics:{_defaultSortComparatorAscending:function(D,E){var F=D[arguments.callee.columnIndex];
var G=E[arguments.callee.columnIndex];

if(qx.lang.Type.isNumber(F)&&qx.lang.Type.isNumber(G)){var H=isNaN(F)?isNaN(G)?0:1:isNaN(G)?-1:null;

if(H!=null){return H;
}}return (F>G)?1:((F==G)?0:-1);
},_defaultSortComparatorInsensitiveAscending:function(f,g){var h=(f[arguments.callee.columnIndex].toLowerCase?f[arguments.callee.columnIndex].toLowerCase():f[arguments.callee.columnIndex]);
var k=(g[arguments.callee.columnIndex].toLowerCase?g[arguments.callee.columnIndex].toLowerCase():g[arguments.callee.columnIndex]);

if(qx.lang.Type.isNumber(h)&&qx.lang.Type.isNumber(k)){var l=isNaN(h)?isNaN(k)?0:1:isNaN(k)?-1:null;

if(l!=null){return l;
}}return (h>k)?1:((h==k)?0:-1);
},_defaultSortComparatorDescending:function(bt,bu){var bv=bt[arguments.callee.columnIndex];
var bw=bu[arguments.callee.columnIndex];

if(qx.lang.Type.isNumber(bv)&&qx.lang.Type.isNumber(bw)){var bx=isNaN(bv)?isNaN(bw)?0:1:isNaN(bw)?-1:null;

if(bx!=null){return bx;
}}return (bv<bw)?1:((bv==bw)?0:-1);
},_defaultSortComparatorInsensitiveDescending:function(L,M){var N=(L[arguments.callee.columnIndex].toLowerCase?L[arguments.callee.columnIndex].toLowerCase():L[arguments.callee.columnIndex]);
var O=(M[arguments.callee.columnIndex].toLowerCase?M[arguments.callee.columnIndex].toLowerCase():M[arguments.callee.columnIndex]);

if(qx.lang.Type.isNumber(N)&&qx.lang.Type.isNumber(O)){var P=isNaN(N)?isNaN(O)?0:1:isNaN(O)?-1:null;

if(P!=null){return P;
}}return (N<O)?1:((N==O)?0:-1);
}},members:{__lq:null,__lt:null,__lu:null,__ls:null,__lr:null,__lv:null,getRowData:function(bc){var bd=this.__lq[bc];

if(bd==null||bd.originalData==null){return bd;
}else{return bd.originalData;
}},getRowDataAsMap:function(by){var bA=this.__lq[by];
var bz={};

for(var bB=0;bB<this.getColumnCount();bB++){bz[this.getColumnId(bB)]=bA[bB];
}return bz;
},getDataAsMapArray:function(){var bO=this.getRowCount();
var bN=[];

for(var i=0;i<bO;i++){bN.push(this.getRowDataAsMap(i));
}return bN;
},setEditable:function(d){this.__lt=[];

for(var e=0;e<this.getColumnCount();e++){this.__lt[e]=d;
}this.fireEvent(bL);
},setColumnEditable:function(Q,R){if(R!=this.isColumnEditable(Q)){if(this.__lt==null){this.__lt=[];
}this.__lt[Q]=R;
this.fireEvent(bL);
}},isColumnEditable:function(bb){return this.__lt?(this.__lt[bb]==true):false;
},setColumnSortable:function(bC,bD){if(bD!=this.isColumnSortable(bC)){if(this.__lu==null){this.__lu=[];
}this.__lu[bC]=bD;
this.fireEvent(bL);
}},isColumnSortable:function(A){return (this.__lu?(this.__lu[A]!==false):true);
},sortByColumn:function(v,w){var z;
var y=this.__ls[v];

if(y){z=(w?y.ascending:y.descending);
}else{if(this.getCaseSensitiveSorting()){z=(w?qx.ui.table.model.Simple._defaultSortComparatorAscending:qx.ui.table.model.Simple._defaultSortComparatorDescending);
}else{z=(w?qx.ui.table.model.Simple._defaultSortComparatorInsensitiveAscending:qx.ui.table.model.Simple._defaultSortComparatorInsensitiveDescending);
}}z.columnIndex=v;
this.__lq.sort(z);
this.__lr=v;
this.__lv=w;
var x={columnIndex:v,ascending:w};
this.fireDataEvent(bI,x);
this.fireEvent(bL);
},setSortMethods:function(bo,bp){var bq;

if(qx.lang.Type.isFunction(bp)){bq={ascending:bp,descending:function(B,C){return bp(C,B);
}};
}else{bq=bp;
}this.__ls[bo]=bq;
},getSortMethods:function(q){return this.__ls[q];
},clearSorting:function(){if(this.__lr!=-1){this.__lr=-1;
this.__lv=true;
this.fireEvent(bL);
}},getSortColumnIndex:function(){return this.__lr;
},isSortAscending:function(){return this.__lv;
},getRowCount:function(){return this.__lq.length;
},getValue:function(br,bs){if(bs<0||bs>=this.__lq.length){throw new Error("this.__rowArr out of bounds: "+bs+" (0.."+this.__lq.length+")");
}return this.__lq[bs][br];
},setValue:function(bE,bF,bG){if(this.__lq[bF][bE]!=bG){this.__lq[bF][bE]=bG;
if(this.hasListener(bM)){var bH={firstRow:bF,lastRow:bF,firstColumn:bE,lastColumn:bE};
this.fireDataEvent(bM,bH);
}
if(bE==this.__lr){this.clearSorting();
}}},setData:function(I,J){this.__lq=I;
if(this.hasListener(bM)){var K={firstRow:0,lastRow:I.length-1,firstColumn:0,lastColumn:this.getColumnCount()-1};
this.fireDataEvent(bM,K);
}
if(J!==false){this.clearSorting();
}},getData:function(){return this.__lq;
},setDataAsMapArray:function(a,b,c){this.setData(this._mapArray2RowArr(a,b),c);
},addRows:function(bk,bl,bm){if(bl==null){bl=this.__lq.length;
}bk.splice(0,0,bl,0);
Array.prototype.splice.apply(this.__lq,bk);
var bn={firstRow:bl,lastRow:this.__lq.length-1,firstColumn:0,lastColumn:this.getColumnCount()-1};
this.fireDataEvent(bM,bn);

if(bm!==false){this.clearSorting();
}},addRowsAsMapArray:function(m,n,o,p){this.addRows(this._mapArray2RowArr(m,o),n,p);
},setRows:function(S,T,U){if(T==null){T=0;
}S.splice(0,0,T,S.length);
Array.prototype.splice.apply(this.__lq,S);
var V={firstRow:T,lastRow:this.__lq.length-1,firstColumn:0,lastColumn:this.getColumnCount()-1};
this.fireDataEvent(bM,V);

if(U!==false){this.clearSorting();
}},setRowsAsMapArray:function(r,s,t,u){this.setRows(this._mapArray2RowArr(r,t),s,u);
},removeRows:function(W,X,Y){this.__lq.splice(W,X);
var ba={firstRow:W,lastRow:this.__lq.length-1,firstColumn:0,lastColumn:this.getColumnCount()-1,removeStart:W,removeCount:X};
this.fireDataEvent(bM,ba);

if(Y!==false){this.clearSorting();
}},_mapArray2RowArr:function(be,bf){var bj=be.length;
var bg=this.getColumnCount();
var bi=new Array(bj);
var bh;

for(var i=0;i<bj;++i){bh=[];

if(bf){bh.originalData=be[i];
}
for(var j=0;j<bg;++j){bh[j]=be[i][this.getColumnId(j)];
}bi[i]=bh;
}return bi;
}},destruct:function(){this.__lq=this.__lt=this.__ls=this.__lu=null;
}});
})();
(function(){var cn="column-button",cm="Function",cl="Boolean",ck="qx.event.type.Data",cj="statusbar",ci="qx.ui.table.pane.CellEvent",ch="PageUp",cg='"',cf="changeLocale",ce="changeSelection",dB="qx.dynlocale",dA="__lG",dz="Enter",dy="metaDataChanged",dx="dataChanged",dw="on",dv="_applyStatusBarVisible",du="columnVisibilityMenuCreateStart",dt="blur",ds="qx.ui.table.Table",cu="columnVisibilityMenuCreateEnd",cv="Use 'resetSelection' instead.",cs="verticalScrollBarChanged",ct="_applyMetaColumnCounts",cq="one of one row",cr="focus",co="changeDataRowRenderer",cp="__lw",cC="changeHeaderCellHeight",cD="Escape",cS="A",cO="changeSelectionModel",db="Left",cV="Down",dn="Integer",dh="_applyHeaderCellHeight",cJ="visibilityChanged",dr="qx.ui.table.ITableModel",dq="orderChanged",dp="_applySelectionModel",cH="menu",cL="_applyAdditionalStatusBarText",cN="_applyFocusCellOnMouseMove",cQ="table",cT="_applyColumnVisibilityButtonVisible",cW="changeTableModel",dd="qx.event.type.Event",dj="tableWidthChanged",cw="End",cx="Object",cK="_applyShowCellFocusIndicator",da="resize",cY="changeScrollY",cX="_applyTableModel",df="menu-button",de="_applyKeepFirstVisibleRowComplete",cU="widthChanged",dc="Home",cb="_applyRowHeight",di="F2",cy="appear",cz="Up",cP="%1 rows",cc="qx.ui.table.selection.Model",cd="one row",cG="__lE",cA="__lx",cB="PageDown",cF="%1 of %2 rows",cR="keypress",dl="changeRowHeight",dk="__lF",cM="Number",dm="changeVisible",cI="qx.ui.table.IRowRenderer",dg="Right",cE="Space";
qx.Class.define(ds,{extend:qx.ui.core.Widget,construct:function(bG,bH){qx.ui.core.Widget.call(this);
if(!bH){bH={};
}
if(bH.selectionManager){this.setNewSelectionManager(bH.selectionManager);
}
if(bH.selectionModel){this.setNewSelectionModel(bH.selectionModel);
}
if(bH.tableColumnModel){this.setNewTableColumnModel(bH.tableColumnModel);
}
if(bH.tablePane){this.setNewTablePane(bH.tablePane);
}
if(bH.tablePaneHeader){this.setNewTablePaneHeader(bH.tablePaneHeader);
}
if(bH.tablePaneScroller){this.setNewTablePaneScroller(bH.tablePaneScroller);
}
if(bH.tablePaneModel){this.setNewTablePaneModel(bH.tablePaneModel);
}
if(bH.columnMenu){this.setNewColumnMenu(bH.columnMenu);
}this._setLayout(new qx.ui.layout.VBox());
this.__lw=new qx.ui.container.Composite(new qx.ui.layout.HBox());
this._add(this.__lw,{flex:1});
this.setDataRowRenderer(new qx.ui.table.rowrenderer.Default(this));
this.__lx=this.getNewSelectionManager()(this);
this.setSelectionModel(this.getNewSelectionModel()(this));
this.setTableModel(bG||this.getEmptyTableModel());
this.setMetaColumnCounts([-1]);
this.setTabIndex(1);
this.addListener(cR,this._onKeyPress);
this.addListener(cr,this._onFocusChanged);
this.addListener(dt,this._onFocusChanged);
var bI=new qx.ui.core.Widget().set({height:0});
this._add(bI);
bI.addListener(da,this._onResize,this);
this.__ly=null;
this.__lz=null;
if(qx.core.Variant.isSet(dB,dw)){qx.locale.Manager.getInstance().addListener(cf,this._onChangeLocale,this);
}this.initStatusBarVisible();
},events:{"columnVisibilityMenuCreateStart":ck,"columnVisibilityMenuCreateEnd":ck,"tableWidthChanged":dd,"verticalScrollBarChanged":ck,"cellClick":ci,"cellDblclick":ci,"cellContextmenu":ci,"dataEdited":ck},statics:{__lA:{cellClick:1,cellDblclick:1,cellContextmenu:1}},properties:{appearance:{refine:true,init:cQ},focusable:{refine:true,init:true},minWidth:{refine:true,init:50},selectable:{refine:true,init:false},selectionModel:{check:cc,apply:dp,event:cO},tableModel:{check:dr,apply:cX,event:cW},rowHeight:{check:cM,init:20,apply:cb,event:dl},forceLineHeight:{check:cl,init:true},headerCellHeight:{check:dn,init:16,apply:dh,event:cC,nullable:true},statusBarVisible:{check:cl,init:true,apply:dv},additionalStatusBarText:{nullable:true,init:null,apply:cL},columnVisibilityButtonVisible:{check:cl,init:true,apply:cT},metaColumnCounts:{check:cx,apply:ct},focusCellOnMouseMove:{check:cl,init:false,apply:cN},rowFocusChangeModifiesSelection:{check:cl,init:true},showCellFocusIndicator:{check:cl,init:true,apply:cK},keepFirstVisibleRowComplete:{check:cl,init:true,apply:de},alwaysUpdateCells:{check:cl,init:false},dataRowRenderer:{check:cI,init:null,nullable:true,event:co},modalCellEditorPreOpenFunction:{check:cm,init:null,nullable:true},newColumnMenu:{check:cm,init:function(){return new qx.ui.table.columnmenu.Button();
}},newSelectionManager:{check:cm,init:function(bJ){return new qx.ui.table.selection.Manager(bJ);
}},newSelectionModel:{check:cm,init:function(eD){return new qx.ui.table.selection.Model(eD);
}},newTableColumnModel:{check:cm,init:function(fb){return new qx.ui.table.columnmodel.Basic(fb);
}},newTablePane:{check:cm,init:function(eE){return new qx.ui.table.pane.Pane(eE);
}},newTablePaneHeader:{check:cm,init:function(eR){return new qx.ui.table.pane.Header(eR);
}},newTablePaneScroller:{check:cm,init:function(bX){return new qx.ui.table.pane.Scroller(bX);
}},newTablePaneModel:{check:cm,init:function(B){return new qx.ui.table.pane.Model(B);
}}},members:{__ly:null,__lz:null,__lw:null,__lx:null,__lB:null,__lC:null,__lD:null,__lE:null,__lF:null,__lG:null,_createChildControlImpl:function(ej){var ek;

switch(ej){case cj:ek=new qx.ui.basic.Label();
ek.set({allowGrowX:true});
this._add(ek);
break;
case cn:ek=this.getNewColumnMenu()();
ek.set({focusable:false});
var el=ek.factory(cH,{table:this});
el.addListener(cy,this._initColumnMenu,this);
break;
}return ek||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,ej);
},_applySelectionModel:function(m,n){this.__lx.setSelectionModel(m);

if(n!=null){n.removeListener(ce,this._onSelectionChanged,this);
}m.addListener(ce,this._onSelectionChanged,this);
},_applyRowHeight:function(eS,eT){var eU=this._getPaneScrollerArr();

for(var i=0;i<eU.length;i++){eU[i].updateVerScrollBarMaximum();
}},_applyHeaderCellHeight:function(bc,bd){var be=this._getPaneScrollerArr();

for(var i=0;i<be.length;i++){be[i].getHeader().setHeight(bc);
}},getEmptyTableModel:function(){if(!this.__lG){this.__lG=new qx.ui.table.model.Simple();
this.__lG.setColumns([]);
this.__lG.setData([]);
}return this.__lG;
},_applyTableModel:function(U,V){this.getTableColumnModel().init(U.getColumnCount(),this);

if(V!=null){V.removeListener(dy,this._onTableModelMetaDataChanged,this);
V.removeListener(dx,this._onTableModelDataChanged,this);
}U.addListener(dy,this._onTableModelMetaDataChanged,this);
U.addListener(dx,this._onTableModelDataChanged,this);
this._updateStatusBar();
this._updateTableData(0,U.getRowCount(),0,U.getColumnCount());
this._onTableModelMetaDataChanged();
},getTableColumnModel:function(){if(!this.__lF){var S=this.__lF=this.getNewTableColumnModel()(this);
S.addListener(cJ,this._onColVisibilityChanged,this);
S.addListener(cU,this._onColWidthChanged,this);
S.addListener(dq,this._onColOrderChanged,this);
var R=this.getTableModel();
S.init(R.getColumnCount(),this);
var P=this._getPaneScrollerArr();

for(var i=0;i<P.length;i++){var Q=P[i];
var T=Q.getTablePaneModel();
T.setTableColumnModel(S);
}}return this.__lF;
},_applyStatusBarVisible:function(dY,ea){if(dY){this._showChildControl(cj);
}else{this._excludeChildControl(cj);
}
if(dY){this._updateStatusBar();
}},_applyAdditionalStatusBarText:function(bY,ca){this.__lB=bY;
this._updateStatusBar();
},_applyColumnVisibilityButtonVisible:function(w,y){if(w){this._showChildControl(cn);
}else{this._excludeChildControl(cn);
}},_applyMetaColumnCounts:function(bl,bm){var bt=bl;
var bn=this._getPaneScrollerArr();
var br={};

if(bl>bm){var bv=qx.event.Registration.getManager(bn[0]);

for(var bw in qx.ui.table.Table.__lA){br[bw]={};
br[bw].capture=bv.getListeners(bn[0],bw,true);
br[bw].bubble=bv.getListeners(bn[0],bw,false);
}}this._cleanUpMetaColumns(bt.length);
var bs=0;

for(var i=0;i<bn.length;i++){var bx=bn[i];
var bu=bx.getTablePaneModel();
bu.setFirstColumnX(bs);
bu.setMaxColumnCount(bt[i]);
bs+=bt[i];
}if(bt.length>bn.length){var bq=this.getTableColumnModel();

for(var i=bn.length;i<bt.length;i++){var bu=this.getNewTablePaneModel()(bq);
bu.setFirstColumnX(bs);
bu.setMaxColumnCount(bt[i]);
bs+=bt[i];
var bx=this.getNewTablePaneScroller()(this);
bx.setTablePaneModel(bu);
bx.addListener(cY,this._onScrollY,this);
for(bw in qx.ui.table.Table.__lA){if(!br[bw]){break;
}
if(br[bw].capture&&br[bw].capture.length>0){var bo=br[bw].capture;

for(var i=0;i<bo.length;i++){var bp=bo[i].context;

if(!bp){bp=this;
}else if(bp==bn[0]){bp=bx;
}bx.addListener(bw,bo[i].handler,bp,true);
}}
if(br[bw].bubble&&br[bw].bubble.length>0){var bz=br[bw].bubble;

for(var i=0;i<bz.length;i++){var bp=bz[i].context;

if(!bp){bp=this;
}else if(bp==bn[0]){bp=bx;
}bx.addListener(bw,bz[i].handler,bp,false);
}}}var by=(i==bt.length-1)?1:0;
this.__lw.add(bx,{flex:by});
bn=this._getPaneScrollerArr();
}}for(var i=0;i<bn.length;i++){var bx=bn[i];
var bA=(i==(bn.length-1));
bx.getHeader().setHeight(this.getHeaderCellHeight());
bx.setTopRightWidget(bA?this.getChildControl(cn):null);
}
if(!this.isColumnVisibilityButtonVisible()){this._excludeChildControl(cn);
}this._updateScrollerWidths();
this._updateScrollBarVisibility();
},_applyFocusCellOnMouseMove:function(d,e){var f=this._getPaneScrollerArr();

for(var i=0;i<f.length;i++){f[i].setFocusCellOnMouseMove(d);
}},_applyShowCellFocusIndicator:function(ex,ey){var ez=this._getPaneScrollerArr();

for(var i=0;i<ez.length;i++){ez[i].setShowCellFocusIndicator(ex);
}},_applyKeepFirstVisibleRowComplete:function(K,L){var M=this._getPaneScrollerArr();

for(var i=0;i<M.length;i++){M[i].onKeepFirstVisibleRowCompleteChanged();
}},getSelectionManager:function(){return this.__lx;
},_getPaneScrollerArr:function(){return this.__lw.getChildren();
},getPaneScroller:function(bK){return this._getPaneScrollerArr()[bK];
},_cleanUpMetaColumns:function(bT){var bU=this._getPaneScrollerArr();

if(bU!=null){for(var i=bU.length-1;i>=bT;i--){bU[i].destroy();
}}},_onChangeLocale:function(fa){this.updateContent();
this._updateStatusBar();
},_onSelectionChanged:function(eX){var eY=this._getPaneScrollerArr();

for(var i=0;i<eY.length;i++){eY[i].onSelectionChanged();
}this._updateStatusBar();
},_onTableModelMetaDataChanged:function(bE){var bF=this._getPaneScrollerArr();

for(var i=0;i<bF.length;i++){bF[i].onTableModelMetaDataChanged();
}this._updateStatusBar();
},_onTableModelDataChanged:function(bj){var bk=bj.getData();
this._updateTableData(bk.firstRow,bk.lastRow,bk.firstColumn,bk.lastColumn,bk.removeStart,bk.removeCount);
},_updateTableData:function(C,D,E,F,G,H){var I=this._getPaneScrollerArr();
if(H){this.getSelectionModel().removeSelectionInterval(G,G+H);
}
for(var i=0;i<I.length;i++){I[i].onTableModelDataChanged(C,D,E,F);
}var J=this.getTableModel().getRowCount();

if(J!=this.__lC){this.__lC=J;
this._updateScrollBarVisibility();
this._updateStatusBar();
}},_onScrollY:function(eV){if(!this.__lD){this.__lD=true;
var eW=this._getPaneScrollerArr();

for(var i=0;i<eW.length;i++){eW[i].setScrollY(eV.getData());
}this.__lD=false;
}},_onKeyPress:function(dD){if(!this.getEnabled()){return;
}var dK=this.__lz;
var dH=true;
var dL=dD.getKeyIdentifier();

if(this.isEditing()){if(dD.getModifiers()==0){switch(dL){case dz:this.stopEditing();
var dK=this.__lz;
this.moveFocusedCell(0,1);

if(this.__lz!=dK){dH=this.startEditing();
}break;
case cD:this.cancelEditing();
this.focus();
break;
default:dH=false;
break;
}}}else{if(dD.isCtrlPressed()){dH=true;

switch(dL){case cS:var dI=this.getTableModel().getRowCount();

if(dI>0){this.getSelectionModel().setSelectionInterval(0,dI-1);
}break;
default:dH=false;
break;
}}else{switch(dL){case cE:this.__lx.handleSelectKeyDown(this.__lz,dD);
break;
case di:case dz:this.startEditing();
dH=true;
break;
case dc:this.setFocusedCell(this.__ly,0,true);
break;
case cw:var dI=this.getTableModel().getRowCount();
this.setFocusedCell(this.__ly,dI-1,true);
break;
case db:this.moveFocusedCell(-1,0);
break;
case dg:this.moveFocusedCell(1,0);
break;
case cz:this.moveFocusedCell(0,-1);
break;
case cV:this.moveFocusedCell(0,1);
break;
case ch:case cB:var dG=this.getPaneScroller(0);
var dJ=dG.getTablePane();
var dI=dJ.getVisibleRowCount()-1;
var dF=this.getRowHeight();
var dE=(dL==ch)?-1:1;
dG.setScrollY(dG.getScrollY()+dE*dI*dF);
this.moveFocusedCell(0,dE*dI);
break;
default:dH=false;
}}}
if(dK!=this.__lz&&this.getRowFocusChangeModifiesSelection()){this.__lx.handleMoveKeyDown(this.__lz,dD);
}
if(dH){dD.preventDefault();
dD.stopPropagation();
}},_onFocusChanged:function(z){var A=this._getPaneScrollerArr();

for(var i=0;i<A.length;i++){A[i].onFocusChanged();
}},_onColVisibilityChanged:function(eO){var eP=this._getPaneScrollerArr();

for(var i=0;i<eP.length;i++){eP[i].onColVisibilityChanged();
}var eQ=eO.getData();

if(this.__lE!=null&&eQ.col!=null&&eQ.visible!=null){this.__lE[eQ.col].setVisible(eQ.visible);
}this._updateScrollerWidths();
this._updateScrollBarVisibility();
},_onColWidthChanged:function(W){var X=this._getPaneScrollerArr();

for(var i=0;i<X.length;i++){var Y=W.getData();
X[i].setColumnWidth(Y.col,Y.newWidth);
}this._updateScrollerWidths();
this._updateScrollBarVisibility();
},_onColOrderChanged:function(bV){var bW=this._getPaneScrollerArr();

for(var i=0;i<bW.length;i++){bW[i].onColOrderChanged();
}this._updateScrollerWidths();
this._updateScrollBarVisibility();
},getTablePaneScrollerAtPageX:function(ba){var bb=this._getMetaColumnAtPageX(ba);
return (bb!=-1)?this.getPaneScroller(bb):null;
},setFocusedCell:function(g,h,j){if(!this.isEditing()&&(g!=this.__ly||h!=this.__lz)){if(g===null){g=0;
}this.__ly=g;
this.__lz=h;
var k=this._getPaneScrollerArr();

for(var i=0;i<k.length;i++){k[i].setFocusedCell(g,h);
}
if(g!==null&&j){this.scrollCellVisible(g,h);
}}},resetSelection:function(){this.getSelectionModel().resetSelection();
},clearSelection:function(){qx.log.Logger.deprecatedMethodWarning(arguments.callee,cv);
this.resetSelection();
},resetCellFocus:function(){this.setFocusedCell(null,null,false);
},getFocusedColumn:function(){return this.__ly;
},getFocusedRow:function(){return this.__lz;
},highlightFocusedRow:function(c){this.getDataRowRenderer().setHighlightFocusRow(c);
},clearFocusedRowHighlight:function(){this.resetCellFocus();
var bP=this._getPaneScrollerArr();

for(var i=0;i<bP.length;i++){bP[i].onFocusChanged();
}},moveFocusedCell:function(eq,er){var ev=this.__ly;
var ew=this.__lz;

if(ev===null||ew===null){return;
}
if(eq!=0){var eu=this.getTableColumnModel();
var x=eu.getVisibleX(ev);
var et=eu.getVisibleColumnCount();
x=qx.lang.Number.limit(x+eq,0,et-1);
ev=eu.getVisibleColumnAtX(x);
}
if(er!=0){var es=this.getTableModel();
ew=qx.lang.Number.limit(ew+er,0,es.getRowCount()-1);
}this.setFocusedCell(ev,ew,true);
},scrollCellVisible:function(em,en){var eo=this.getTableColumnModel();
var x=eo.getVisibleX(em);
var ep=this._getMetaColumnAtColumnX(x);

if(ep!=-1){this.getPaneScroller(ep).scrollCellVisible(em,en);
}},isEditing:function(){if(this.__ly!=null){var x=this.getTableColumnModel().getVisibleX(this.__ly);
var O=this._getMetaColumnAtColumnX(x);
return this.getPaneScroller(O).isEditing();
}return false;
},startEditing:function(){if(this.__ly!=null){var x=this.getTableColumnModel().getVisibleX(this.__ly);
var bS=this._getMetaColumnAtColumnX(x);
var bR=this.getPaneScroller(bS).startEditing();
return bR;
}return false;
},stopEditing:function(){if(this.__ly!=null){var x=this.getTableColumnModel().getVisibleX(this.__ly);
var dM=this._getMetaColumnAtColumnX(x);
this.getPaneScroller(dM).stopEditing();
}},cancelEditing:function(){if(this.__ly!=null){var x=this.getTableColumnModel().getVisibleX(this.__ly);
var bB=this._getMetaColumnAtColumnX(x);
this.getPaneScroller(bB).cancelEditing();
}},updateContent:function(){var N=this._getPaneScrollerArr();

for(var i=0;i<N.length;i++){N[i].getTablePane().updateContent();
}},blockHeaderElements:function(){var bQ=this._getPaneScrollerArr();

for(var i=0;i<bQ.length;i++){bQ[i].getHeader().getBlocker().blockContent(20);
}this.getChildControl(cn).getBlocker().blockContent(20);
},unblockHeaderElements:function(){var eC=this._getPaneScrollerArr();

for(var i=0;i<eC.length;i++){eC[i].getHeader().getBlocker().unblockContent();
}this.getChildControl(cn).getBlocker().unblockContent();
},_getMetaColumnAtPageX:function(eg){var eh=this._getPaneScrollerArr();

for(var i=0;i<eh.length;i++){var ei=eh[i].getContainerLocation();

if(eg>=ei.left&&eg<=ei.right){return i;
}}return -1;
},_getMetaColumnAtColumnX:function(eF){var eH=this.getMetaColumnCounts();
var eI=0;

for(var i=0;i<eH.length;i++){var eG=eH[i];
eI+=eG;

if(eG==-1||eF<eI){return i;
}}return -1;
},_updateStatusBar:function(){var dN=this.getTableModel();

if(this.getStatusBarVisible()){var dO=this.getSelectionModel().getSelectedCount();
var dQ=dN.getRowCount();
var dP;

if(dQ>=0){if(dO==0){dP=this.trn(cd,cP,dQ,dQ);
}else{dP=this.trn(cq,cF,dQ,dO,dQ);
}}
if(this.__lB){if(dP){dP+=this.__lB;
}else{dP=this.__lB;
}}
if(dP){this.getChildControl(cj).setValue(dP);
}}},_updateScrollerWidths:function(){var bf=this._getPaneScrollerArr();

for(var i=0;i<bf.length;i++){var bh=(i==(bf.length-1));
var bi=bf[i].getTablePaneModel().getTotalWidth();
bf[i].setPaneWidth(bi);
var bg=bh?1:0;
bf[i].setLayoutProperties({flex:bg});
}},_updateScrollBarVisibility:function(){if(!this.getBounds()){return;
}var r=qx.ui.table.pane.Scroller.HORIZONTAL_SCROLLBAR;
var u=qx.ui.table.pane.Scroller.VERTICAL_SCROLLBAR;
var o=this._getPaneScrollerArr();
var q=false;
var t=false;

for(var i=0;i<o.length;i++){var v=(i==(o.length-1));
var p=o[i].getNeededScrollBars(q,!v);

if(p&r){q=true;
}
if(v&&(p&u)){t=true;
}}for(var i=0;i<o.length;i++){var v=(i==(o.length-1));
var s;
o[i].setHorizontalScrollBarVisible(q);
if(v){s=o[i].getVerticalScrollBarVisible();
}o[i].setVerticalScrollBarVisible(v&&t);
if(v&&t!=s){this.fireDataEvent(cs,t);
}}},_initColumnMenu:function(){var dT=this.getTableModel();
var dU=this.getTableColumnModel();
var dV=this.getChildControl(cn);
dV.empty();
var dS=dV.getMenu();
var dW={table:this,menu:dS,columnButton:dV};
this.fireDataEvent(du,dW);
this.__lE={};

for(var dX=0,l=dT.getColumnCount();dX<l;dX++){var dR=dV.factory(df,{text:dT.getColumnName(dX),column:dX,bVisible:dU.isColumnVisible(dX)});
qx.core.Assert.assertInterface(dR,qx.ui.table.IColumnMenuItem);
dR.addListener(dm,this._createColumnVisibilityCheckBoxHandler(dX),this);
this.__lE[dX]=dR;
}var dW={table:this,menu:dS,columnButton:dV};
this.fireDataEvent(cu,dW);
},_createColumnVisibilityCheckBoxHandler:function(dC){return function(bC){var bD=this.getTableColumnModel();
bD.setColumnVisible(dC,bC.getData());
};
},setColumnWidth:function(eA,eB){this.getTableColumnModel().setColumnWidth(eA,eB);
},_onResize:function(){this.fireEvent(dj);
this._updateScrollerWidths();
this._updateScrollBarVisibility();
},addListener:function(eb,ec,self,ed){if(this.self(arguments).__lA[eb]){var ef=[eb];

for(var i=0,ee=this._getPaneScrollerArr();i<ee.length;i++){ef.push(ee[i].addListener.apply(ee[i],arguments));
}return ef.join(cg);
}else{return qx.ui.core.Widget.prototype.addListener.call(this,eb,ec,self,ed);
}},removeListener:function(bL,bM,self,bN){if(this.self(arguments).__lA[bL]){for(var i=0,bO=this._getPaneScrollerArr();i<bO.length;i++){bO[i].removeListener.apply(bO[i],arguments);
}}else{qx.ui.core.Widget.prototype.removeListener.call(this,bL,bM,self,bN);
}},removeListenerById:function(eJ){var eN=eJ.split(cg);
var eM=eN.shift();

if(this.self(arguments).__lA[eM]){var eL=true;

for(var i=0,eK=this._getPaneScrollerArr();i<eK.length;i++){eL=eK[i].removeListenerById.call(eK[i],eN[i])&&eL;
}return eL;
}else{return qx.ui.core.Widget.prototype.removeListenerById.call(this,eJ);
}},destroy:function(){this.getChildControl(cn).getMenu().destroy();
qx.ui.core.Widget.prototype.destroy.call(this);
}},destruct:function(){if(qx.core.Variant.isSet(dB,dw)){qx.locale.Manager.getInstance().removeListener(cf,this._onChangeLocale,this);
}var b=this.getSelectionModel();

if(b){b.dispose();
}var a=this.getDataRowRenderer();

if(a){a.dispose();
}this._cleanUpMetaColumns(0);
this.getTableColumnModel().dispose();
this._disposeObjects(cA,cp,dA,dA,dk);
this._disposeMap(cG);
}});
})();
(function(){var e="qx.ui.table.IRowRenderer";
qx.Interface.define(e,{members:{updateDataRowElement:function(a,b){},getRowHeightStyle:function(f){},createRowStyle:function(c){},getRowClass:function(d){}}});
})();
(function(){var z="",y="table-row-background-even",x="table-row-background-selected",w="table-row",v="background-color:",u="table-row-background-focused",t=';border-bottom: 1px solid ',s=';color:',r="table-row-selected",q="table-row-background-odd",j="default",p="table-row-background-focused-selected",m="qx.ui.table.rowrenderer.Default",i="table-row-line",h="'",l="height:",k=";",n="px;",g="1px solid ",o="Boolean";
qx.Class.define(m,{extend:qx.core.Object,implement:qx.ui.table.IRowRenderer,construct:function(){qx.core.Object.call(this);
this.__lH=z;
this.__lH={};
this.__lI={};
this._renderFont(qx.theme.manager.Font.getInstance().resolve(j));
var a=qx.theme.manager.Color.getInstance();
this.__lI.bgcolFocusedSelected=a.resolve(p);
this.__lI.bgcolFocused=a.resolve(u);
this.__lI.bgcolSelected=a.resolve(x);
this.__lI.bgcolEven=a.resolve(y);
this.__lI.bgcolOdd=a.resolve(q);
this.__lI.colSelected=a.resolve(r);
this.__lI.colNormal=a.resolve(w);
this.__lI.horLine=a.resolve(i);
},properties:{highlightFocusRow:{check:o,init:true}},members:{__lI:null,__lJ:null,__lH:null,_insetY:1,_renderFont:function(B){if(B){this.__lJ=B.getStyles();
this.__lH=qx.bom.element.Style.compile(this.__lJ);
this.__lH=this.__lH.replace(/"/g,h);
}else{this.__lH=z;
this.__lJ=qx.bom.Font.getDefaultStyles();
}},updateDataRowElement:function(b,c){var e=this.__lJ;
var d=c.style;
qx.bom.element.Style.setStyles(c,e);

if(b.focusedRow&&this.getHighlightFocusRow()){d.backgroundColor=b.selected?this.__lI.bgcolFocusedSelected:this.__lI.bgcolFocused;
}else{if(b.selected){d.backgroundColor=this.__lI.bgcolSelected;
}else{d.backgroundColor=(b.row%2==0)?this.__lI.bgcolEven:this.__lI.bgcolOdd;
}}d.color=b.selected?this.__lI.colSelected:this.__lI.colNormal;
d.borderBottom=g+this.__lI.horLine;
},getRowHeightStyle:function(A){if(qx.bom.client.Feature.CONTENT_BOX){A-=this._insetY;
}return l+A+n;
},createRowStyle:function(C){var D=[];
D.push(k);
D.push(this.__lH);
D.push(v);

if(C.focusedRow&&this.getHighlightFocusRow()){D.push(C.selected?this.__lI.bgcolFocusedSelected:this.__lI.bgcolFocused);
}else{if(C.selected){D.push(this.__lI.bgcolSelected);
}else{D.push((C.row%2==0)?this.__lI.bgcolEven:this.__lI.bgcolOdd);
}}D.push(s);
D.push(C.selected?this.__lI.colSelected:this.__lI.colNormal);
D.push(t,this.__lI.horLine);
return D.join(z);
},getRowClass:function(f){return z;
}},destruct:function(){this.__lI=this.__lJ=this.__lH=null;
}});
})();
(function(){var l="pressed",k="hovered",j="changeVisibility",i="qx.ui.menu.Menu",h="submenu",g="Enter",f="contextmenu",d="changeMenu",c="qx.ui.form.MenuButton",b="abandoned",a="_applyMenu";
qx.Class.define(c,{extend:qx.ui.form.Button,construct:function(r,s,t){qx.ui.form.Button.call(this,r,s);
if(t!=null){this.setMenu(t);
}},properties:{menu:{check:i,nullable:true,apply:a,event:d}},members:{_applyMenu:function(v,w){if(w){w.removeListener(j,this._onMenuChange,this);
w.resetOpener();
}
if(v){v.addListener(j,this._onMenuChange,this);
v.setOpener(this);
v.removeState(h);
v.removeState(f);
}},open:function(m){var n=this.getMenu();

if(n){qx.ui.menu.Manager.getInstance().hideAll();
n.setOpener(this);
n.open();
if(m){var o=n.getSelectables()[0];

if(o){n.setSelectedButton(o);
}}}},_onMenuChange:function(e){var p=this.getMenu();

if(p.isVisible()){this.addState(l);
}else{this.removeState(l);
}},_onMouseDown:function(e){var q=this.getMenu();

if(q){if(!q.isVisible()){this.open();
}else{q.exclude();
}e.stopPropagation();
}},_onMouseUp:function(e){qx.ui.form.Button.prototype._onMouseUp.call(this,e);
e.stopPropagation();
},_onMouseOver:function(e){this.addState(k);
},_onMouseOut:function(e){this.removeState(k);
},_onKeyDown:function(e){switch(e.getKeyIdentifier()){case g:this.removeState(b);
this.addState(l);
var u=this.getMenu();

if(u){if(!u.isVisible()){this.open();
}else{u.exclude();
}}e.stopPropagation();
}},_onKeyUp:function(e){}},destruct:function(){if(this.getMenu()){if(!qx.core.ObjectRegistry.inShutDown){this.getMenu().destroy();
}}}});
})();
(function(){var a="qx.ui.table.IColumnMenuButton";
qx.Interface.define(a,{properties:{menu:{}},members:{factory:function(b,c){return true;
},empty:function(){return true;
}}});
})();
(function(){var f="menu-button",e="table-column-reset-button",d="separator",c="user-button",b="qx.ui.table.columnmenu.Button",a="menu";
qx.Class.define(b,{extend:qx.ui.form.MenuButton,implement:qx.ui.table.IColumnMenuButton,construct:function(){qx.ui.form.MenuButton.call(this);
this.__lK=new qx.ui.core.Blocker(this);
},members:{__lL:null,__lK:null,factory:function(j,k){switch(j){case a:var m=new qx.ui.menu.Menu();
this.setMenu(m);
return m;
case f:var o=new qx.ui.table.columnmenu.MenuItem(k.text);
o.setVisible(k.bVisible);
this.getMenu().add(o);
return o;
case c:var n=new qx.ui.menu.Button(k.text);
n.set({appearance:e});
return n;
case d:return new qx.ui.menu.Separator();
default:throw new Error("Unrecognized factory request: "+j);
}},getBlocker:function(){return this.__lK;
},empty:function(){var g=this.getMenu();
var h=g.getChildren();

for(var i=0,l=h.length;i<l;i++){h[0].destroy();
}}},destruct:function(){this.__lK.dispose();
}});
})();
(function(){var ba="keypress",Y="interval",X="keydown",W="mousedown",V="keyup",U="__lN",T="__lO",S="blur",R="Enter",Q="__lM",K="Up",P="Escape",N="qx.ui.menu.Manager",J="Left",I="Down",M="Right",L="singleton",O="Space";
qx.Class.define(N,{type:L,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__lM=[];
var bA=document.body;
var bB=qx.event.Registration;
bB.addListener(window.document.documentElement,W,this._onMouseDown,this,true);
bB.addListener(bA,X,this._onKeyUpDown,this,true);
bB.addListener(bA,V,this._onKeyUpDown,this,true);
bB.addListener(bA,ba,this._onKeyPress,this,true);
qx.bom.Element.addListener(window,S,this.hideAll,this);
this.__lN=new qx.event.Timer;
this.__lN.addListener(Y,this._onOpenInterval,this);
this.__lO=new qx.event.Timer;
this.__lO.addListener(Y,this._onCloseInterval,this);
},members:{__lP:null,__lQ:null,__lN:null,__lO:null,__lM:null,_getChild:function(q,r,s,t){var u=q.getChildren();
var length=u.length;
var v;

for(var i=r;i<length&&i>=0;i+=s){v=u[i];

if(v.isEnabled()&&!v.isAnonymous()){return v;
}}
if(t){i=i==length?0:length-1;

for(;i!=r;i+=s){v=u[i];

if(v.isEnabled()&&!v.isAnonymous()){return v;
}}}return null;
},_isInMenu:function(bq){while(bq){if(bq instanceof qx.ui.menu.Menu){return true;
}bq=bq.getLayoutParent();
}return false;
},_getMenuButton:function(A){while(A){if(A instanceof qx.ui.menu.AbstractButton){return A;
}A=A.getLayoutParent();
}return null;
},add:function(y){{};
var z=this.__lM;
z.push(y);
y.setZIndex(1e6+z.length);
},remove:function(by){{};
var bz=this.__lM;

if(bz){qx.lang.Array.remove(bz,by);
}},hideAll:function(){var bg=this.__lM;

if(bg){for(var i=bg.length-1;i>=0;i--){bg[i].exclude();
}}},getActiveMenu:function(){var bp=this.__lM;
return bp.length>0?bp[bp.length-1]:null;
},scheduleOpen:function(bl){this.cancelClose(bl);
if(bl.isVisible()){if(this.__lP){this.cancelOpen(this.__lP);
}}else if(this.__lP!=bl){this.__lP=bl;
this.__lN.restartWith(bl.getOpenInterval());
}},scheduleClose:function(bk){this.cancelOpen(bk);
if(!bk.isVisible()){if(this.__lQ){this.cancelClose(this.__lQ);
}}else if(this.__lQ!=bk){this.__lQ=bk;
this.__lO.restartWith(bk.getCloseInterval());
}},cancelOpen:function(bf){if(this.__lP==bf){this.__lN.stop();
this.__lP=null;
}},cancelClose:function(bD){if(this.__lQ==bD){this.__lO.stop();
this.__lQ=null;
}},_onOpenInterval:function(e){this.__lN.stop();
this.__lP.open();
this.__lP=null;
},_onCloseInterval:function(e){this.__lO.stop();
this.__lQ.exclude();
this.__lQ=null;
},_onMouseDown:function(e){var bC=e.getTarget();
bC=qx.ui.core.Widget.getWidgetByElement(bC);
if(bC==null){this.hideAll();
return;
}if(bC.getMenu&&bC.getMenu()&&bC.getMenu().isVisible()){return;
}if(this.__lM.length>0&&!this._isInMenu(bC)){this.hideAll();
}},__lR:{"Enter":1,"Space":1},__lS:{"Escape":1,"Up":1,"Down":1,"Left":1,"Right":1},_onKeyUpDown:function(e){var B=this.getActiveMenu();

if(!B){return;
}var C=e.getKeyIdentifier();

if(this.__lS[C]||(this.__lR[C]&&B.getSelectedButton())){e.stopPropagation();
}},_onKeyPress:function(e){var D=this.getActiveMenu();

if(!D){return;
}var E=e.getKeyIdentifier();
var G=this.__lS[E];
var F=this.__lR[E];

if(G){switch(E){case K:this._onKeyPressUp(D);
break;
case I:this._onKeyPressDown(D);
break;
case J:this._onKeyPressLeft(D);
break;
case M:this._onKeyPressRight(D);
break;
case P:this.hideAll();
break;
}e.stopPropagation();
e.preventDefault();
}else if(F){var H=D.getSelectedButton();

if(H){switch(E){case R:this._onKeyPressEnter(D,H,e);
break;
case O:this._onKeyPressSpace(D,H,e);
break;
}e.stopPropagation();
e.preventDefault();
}}},_onKeyPressUp:function(l){var m=l.getSelectedButton();
var n=l.getChildren();
var p=m?l.indexOf(m)-1:n.length-1;
var o=this._getChild(l,p,-1,true);
if(o){l.setSelectedButton(o);
}else{l.resetSelectedButton();
}},_onKeyPressDown:function(bb){var bc=bb.getSelectedButton();
var be=bc?bb.indexOf(bc)+1:0;
var bd=this._getChild(bb,be,1,true);
if(bd){bb.setSelectedButton(bd);
}else{bb.resetSelectedButton();
}},_onKeyPressLeft:function(br){var bw=br.getOpener();

if(!bw){return;
}if(bw instanceof qx.ui.menu.Button){var bt=bw.getLayoutParent();
bt.resetOpenedButton();
bt.setSelectedButton(bw);
}else if(bw instanceof qx.ui.menubar.Button){var bv=bw.getMenuBar().getMenuButtons();
var bs=bv.indexOf(bw);
if(bs===-1){return;
}var bx=null;
var length=bv.length;

for(var i=1;i<=length;i++){var bu=bv[(bs-i+length)%length];

if(bu.isEnabled()){bx=bu;
break;
}}
if(bx&&bx!=bw){bx.open(true);
}}},_onKeyPressRight:function(a){var c=a.getSelectedButton();
if(c){var b=c.getMenu();

if(b){a.setOpenedButton(c);
var k=this._getChild(b,0,1);

if(k){b.setSelectedButton(k);
}return;
}}else if(!a.getOpenedButton()){var k=this._getChild(a,0,1);

if(k){a.setSelectedButton(k);

if(k.getMenu()){a.setOpenedButton(k);
}return;
}}var h=a.getOpener();
if(h instanceof qx.ui.menu.Button&&c){while(h){h=h.getLayoutParent();

if(h instanceof qx.ui.menu.Menu){h=h.getOpener();

if(h instanceof qx.ui.menubar.Button){break;
}}else{break;
}}
if(!h){return;
}}if(h instanceof qx.ui.menubar.Button){var g=h.getMenuBar().getMenuButtons();
var d=g.indexOf(h);
if(d===-1){return;
}var j=null;
var length=g.length;

for(var i=1;i<=length;i++){var f=g[(d+i)%length];

if(f.isEnabled()){j=f;
break;
}}
if(j&&j!=h){j.open(true);
}}},_onKeyPressEnter:function(bm,bn,e){if(bn.hasListener(ba)){var bo=e.clone();
bo.setBubbles(false);
bo.setTarget(bn);
bn.dispatchEvent(bo);
}this.hideAll();
},_onKeyPressSpace:function(bh,bi,e){if(bi.hasListener(ba)){var bj=e.clone();
bj.setBubbles(false);
bj.setTarget(bi);
bi.dispatchEvent(bj);
}}},destruct:function(){var x=qx.event.Registration;
var w=document.body;
x.removeListener(window.document.documentElement,W,this._onMouseDown,this,true);
x.removeListener(w,X,this._onKeyUpDown,this,true);
x.removeListener(w,V,this._onKeyUpDown,this,true);
x.removeListener(w,ba,this._onKeyPress,this,true);
this._disposeObjects(U,T);
this._disposeArray(Q);
}});
})();
(function(){var M="slidebar",L="Integer",K="resize",J="qx.ui.core.Widget",I="selected",H="visible",G="Boolean",F="mouseout",E="excluded",D="menu",bc="_applySelectedButton",bb="_applySpacingY",ba="_blocker",Y="_applyCloseInterval",X="_applyBlockerColor",W="_applyIconColumnWidth",V="mouseover",U="_applyArrowColumnWidth",T="qx.ui.menu.Menu",S="Color",Q="Number",R="_applyOpenInterval",O="_applySpacingX",P="_applyBlockerOpacity",N="_applyOpenedButton";
qx.Class.define(T,{extend:qx.ui.core.Widget,include:[qx.ui.core.MPlacement,qx.ui.core.MRemoteChildrenHandling],construct:function(){qx.ui.core.Widget.call(this);
this._setLayout(new qx.ui.menu.Layout);
var f=this.getApplicationRoot();
f.add(this);
this.addListener(V,this._onMouseOver);
this.addListener(F,this._onMouseOut);
this.addListener(K,this._onResize,this);
f.addListener(K,this._onResize,this);
this._blocker=new qx.ui.core.Blocker(f);
this.initVisibility();
this.initKeepFocus();
this.initKeepActive();
},properties:{appearance:{refine:true,init:D},allowGrowX:{refine:true,init:false},allowGrowY:{refine:true,init:false},visibility:{refine:true,init:E},keepFocus:{refine:true,init:true},keepActive:{refine:true,init:true},spacingX:{check:L,apply:O,init:0,themeable:true},spacingY:{check:L,apply:bb,init:0,themeable:true},iconColumnWidth:{check:L,init:0,themeable:true,apply:W},arrowColumnWidth:{check:L,init:0,themeable:true,apply:U},blockerColor:{check:S,init:null,nullable:true,apply:X,themeable:true},blockerOpacity:{check:Q,init:1,apply:P,themeable:true},selectedButton:{check:J,nullable:true,apply:bc},openedButton:{check:J,nullable:true,apply:N},opener:{check:J,nullable:true},openInterval:{check:L,themeable:true,init:250,apply:R},closeInterval:{check:L,themeable:true,init:250,apply:Y},blockBackground:{check:G,themeable:true,init:false}},members:{__lT:null,__lU:null,_blocker:null,open:function(){if(this.getOpener()!=null){this.placeToWidget(this.getOpener());
this.__lW();
this.show();
this._placementTarget=this.getOpener();
}else{this.warn("The menu instance needs a configured 'opener' widget!");
}},openAtMouse:function(e){this.placeToMouse(e);
this.__lW();
this.show();
this._placementTarget={left:e.getDocumentLeft(),top:e.getDocumentTop()};
},openAtPoint:function(l){this.placeToPoint(l);
this.__lW();
this.show();
this._placementTarget=l;
},addSeparator:function(){this.add(new qx.ui.menu.Separator);
},getColumnSizes:function(){return this._getMenuLayout().getColumnSizes();
},getSelectables:function(){var bk=[];
var bl=this.getChildren();

for(var i=0;i<bl.length;i++){if(bl[i].isEnabled()){bk.push(bl[i]);
}}return bk;
},_applyIconColumnWidth:function(bd,be){this._getMenuLayout().setIconColumnWidth(bd);
},_applyArrowColumnWidth:function(n,o){this._getMenuLayout().setArrowColumnWidth(n);
},_applySpacingX:function(bi,bj){this._getMenuLayout().setColumnSpacing(bi);
},_applySpacingY:function(bf,bg){this._getMenuLayout().setSpacing(bf);
},_applyVisibility:function(a,b){qx.ui.core.Widget.prototype._applyVisibility.call(this,a,b);
var c=qx.ui.menu.Manager.getInstance();

if(a===H){c.add(this);
var d=this.getParentMenu();

if(d){d.setOpenedButton(this.getOpener());
}}else if(b===H){c.remove(this);
var d=this.getParentMenu();

if(d&&d.getOpenedButton()==this.getOpener()){d.resetOpenedButton();
}this.resetOpenedButton();
this.resetSelectedButton();
}this.__lV();
},__lV:function(){if(this.isVisible()){if(this.getBlockBackground()){var bh=this.getZIndex();
this._blocker.blockContent(bh-1);
}}else{if(this._blocker.isContentBlocked()){this._blocker.unblockContent();
}}},getParentMenu:function(){var m=this.getOpener();

if(!m||!(m instanceof qx.ui.menu.AbstractButton)){return null;
}
while(m&&!(m instanceof qx.ui.menu.Menu)){m=m.getLayoutParent();
}return m;
},_applySelectedButton:function(g,h){if(h){h.removeState(I);
}
if(g){g.addState(I);
}},_applyOpenedButton:function(bq,br){if(br){br.getMenu().exclude();
}
if(bq){bq.getMenu().open();
}},_applyBlockerColor:function(j,k){this._blocker.setColor(j);
},_applyBlockerOpacity:function(bo,bp){this._blocker.setOpacity(bo);
},getChildrenContainer:function(){return this.getChildControl(M,true)||this;
},_createChildControlImpl:function(p){var q;

switch(p){case M:var q=new qx.ui.menu.MenuSlideBar();
var s=this._getLayout();
this._setLayout(new qx.ui.layout.Grow());
var r=q.getLayout();
q.setLayout(s);
r.dispose();
var t=qx.lang.Array.clone(this.getChildren());

for(var i=0;i<t.length;i++){q.add(t[i]);
}this.removeListener(K,this._onResize,this);
q.getChildrenContainer().addListener(K,this._onResize,this);
this._add(q);
break;
}return q||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,p);
},_getMenuLayout:function(){if(this.hasChildControl(M)){return this.getChildControl(M).getChildrenContainer().getLayout();
}else{return this._getLayout();
}},_getMenuBounds:function(){if(this.hasChildControl(M)){return this.getChildControl(M).getChildrenContainer().getBounds();
}else{return this.getBounds();
}},_computePlacementSize:function(){return this._getMenuBounds();
},__lW:function(){var B=this._getMenuBounds();

if(!B){this.addListenerOnce(K,this.__lW,this);
return;
}var A=this.getLayoutParent().getBounds().height;
var top=this.getLayoutProperties().top;
var C=this.getLayoutProperties().left;
if(top<0){this._assertSlideBar(function(){this.setHeight(B.height+top);
this.moveTo(C,0);
});
}else if(top+B.height>A){this._assertSlideBar(function(){this.setHeight(A-top);
});
}else{this.setHeight(null);
}},_assertSlideBar:function(v){if(this.hasChildControl(M)){return v.call(this);
}this.__lU=v;
qx.ui.core.queue.Widget.add(this);
},syncWidget:function(){this.getChildControl(M);

if(this.__lU){this.__lU.call(this);
delete this.__lU;
}},_onResize:function(){if(this.isVisible()){var u=this._placementTarget;

if(!u){return;
}else if(u instanceof qx.ui.core.Widget){this.placeToWidget(u);
}else if(u.top!==undefined){this.placeToPoint(u);
}else{throw new Error("Unknown target: "+u);
}this.__lW();
}},_onMouseOver:function(e){var x=qx.ui.menu.Manager.getInstance();
x.cancelClose(this);
var y=e.getTarget();

if(y.isEnabled()&&y instanceof qx.ui.menu.AbstractButton){this.setSelectedButton(y);
var w=y.getMenu&&y.getMenu();

if(w){w.setOpener(y);
x.scheduleOpen(w);
this.__lT=w;
}else{var z=this.getOpenedButton();

if(z){x.scheduleClose(z.getMenu());
}
if(this.__lT){x.cancelOpen(this.__lT);
this.__lT=null;
}}}else if(!this.getOpenedButton()){this.resetSelectedButton();
}},_onMouseOut:function(e){var bm=qx.ui.menu.Manager.getInstance();
if(!qx.ui.core.Widget.contains(this,e.getRelatedTarget())){var bn=this.getOpenedButton();
bn?this.setSelectedButton(bn):this.resetSelectedButton();
if(bn){bm.cancelClose(bn.getMenu());
}if(this.__lT){bm.cancelOpen(this.__lT);
}}}},destruct:function(){if(!qx.core.ObjectRegistry.inShutDown){qx.ui.menu.Manager.getInstance().remove(this);
}this.getApplicationRoot().removeListener(K,this._onResize,this);
this._placementTarget=null;
this._disposeObjects(ba);
}});
})();
(function(){var c="Integer",b="_applyLayoutChange",a="qx.ui.menu.Layout";
qx.Class.define(a,{extend:qx.ui.layout.VBox,properties:{columnSpacing:{check:c,init:0,apply:b},spanColumn:{check:c,init:1,nullable:true,apply:b},iconColumnWidth:{check:c,init:0,themeable:true,apply:b},arrowColumnWidth:{check:c,init:0,themeable:true,apply:b}},members:{__lX:null,_computeSizeHint:function(){var q=this._getLayoutChildren();
var o,g,j;
var e=this.getSpanColumn();
var h=this.__lX=[0,0,0,0];
var m=this.getColumnSpacing();
var k=0;
var f=0;
for(var i=0,l=q.length;i<l;i++){o=q[i];

if(o.isAnonymous()){continue;
}g=o.getChildrenSizes();

for(var n=0;n<g.length;n++){if(e!=null&&n==e&&g[e+1]==0){k=Math.max(k,g[n]);
}else{h[n]=Math.max(h[n],g[n]);
}}var d=q[i].getInsets();
f=Math.max(f,d.left+d.right);
}if(e!=null&&h[e]+m+h[e+1]<k){h[e]=k-h[e+1]-m;
}if(k==0){j=m*2;
}else{j=m*3;
}if(h[0]==0){h[0]=this.getIconColumnWidth();
}if(h[3]==0){h[3]=this.getArrowColumnWidth();
}var p=qx.ui.layout.VBox.prototype._computeSizeHint.call(this).height;
return {minHeight:p,height:p,width:qx.lang.Array.sum(h)+f+j};
},getColumnSizes:function(){return this.__lX||null;
}},destruct:function(){this.__lX=null;
}});
})();
(function(){var b="menu-separator",a="qx.ui.menu.Separator";
qx.Class.define(a,{extend:qx.ui.core.Widget,properties:{appearance:{refine:true,init:b},anonymous:{refine:true,init:true}}});
})();
(function(){var t="icon",s="label",r="arrow",q="shortcut",p="changeLocale",o="qx.dynlocale",n="submenu",m="on",l="String",k="qx.ui.menu.Menu",d="qx.ui.menu.AbstractButton",j="keypress",h="",c="_applyIcon",b="mouseup",g="abstract",f="_applyLabel",i="_applyMenu",a="changeCommand";
qx.Class.define(d,{extend:qx.ui.core.Widget,include:[qx.ui.core.MExecutable],implement:[qx.ui.form.IExecutable],type:g,construct:function(){qx.ui.core.Widget.call(this);
this._setLayout(new qx.ui.menu.ButtonLayout);
this.addListener(b,this._onMouseUp);
this.addListener(j,this._onKeyPress);
this.addListener(a,this._onChangeCommand,this);
},properties:{blockToolTip:{refine:true,init:true},label:{check:l,apply:f,nullable:true},menu:{check:k,apply:i,nullable:true},icon:{check:l,apply:c,themeable:true,nullable:true}},members:{_createChildControlImpl:function(z){var A;

switch(z){case t:A=new qx.ui.basic.Image;
A.setAnonymous(true);
this._add(A,{column:0});
break;
case s:A=new qx.ui.basic.Label;
A.setAnonymous(true);
this._add(A,{column:1});
break;
case q:A=new qx.ui.basic.Label;
A.setAnonymous(true);
this._add(A,{column:2});
break;
case r:A=new qx.ui.basic.Image;
A.setAnonymous(true);
this._add(A,{column:3});
break;
}return A||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,z);
},_forwardStates:{selected:1},getChildrenSizes:function(){var G=0,H=0,I=0,M=0;

if(this._isChildControlVisible(t)){var N=this.getChildControl(t);
G=N.getMarginLeft()+N.getSizeHint().width+N.getMarginRight();
}
if(this._isChildControlVisible(s)){var K=this.getChildControl(s);
H=K.getMarginLeft()+K.getSizeHint().width+K.getMarginRight();
}
if(this._isChildControlVisible(q)){var J=this.getChildControl(q);
I=J.getMarginLeft()+J.getSizeHint().width+J.getMarginRight();
}
if(this._isChildControlVisible(r)){var L=this.getChildControl(r);
M=L.getMarginLeft()+L.getSizeHint().width+L.getMarginRight();
}return [G,H,I,M];
},_onMouseUp:function(e){},_onKeyPress:function(e){},_onChangeCommand:function(e){var w=e.getData();

if(qx.core.Variant.isSet(o,m)){var u=e.getOldData();

if(!u){qx.locale.Manager.getInstance().addListener(p,this._onChangeLocale,this);
}
if(!w){qx.locale.Manager.getInstance().removeListener(p,this._onChangeLocale,this);
}}var v=w!=null?w.toString():h;
this.getChildControl(q).setValue(v);
},_onChangeLocale:qx.core.Variant.select(o,{"on":function(e){var F=this.getCommand();

if(F!=null){this.getChildControl(q).setValue(F.toString());
}},"off":null}),_applyIcon:function(D,E){if(D){this._showChildControl(t).setSource(D);
}else{this._excludeChildControl(t);
}},_applyLabel:function(B,C){if(B){this._showChildControl(s).setValue(B);
}else{this._excludeChildControl(s);
}},_applyMenu:function(x,y){if(y){y.resetOpener();
y.removeState(n);
}
if(x){this._showChildControl(r);
x.setOpener(this);
x.addState(n);
}else{this._excludeChildControl(r);
}}},destruct:function(){if(this.getMenu()){if(!qx.core.ObjectRegistry.inShutDown){this.getMenu().destroy();
}}
if(qx.core.Variant.isSet(o,m)){qx.locale.Manager.getInstance().removeListener(p,this._onChangeLocale,this);
}}});
})();
(function(){var g="middle",f="qx.ui.menu.ButtonLayout",e="left";
qx.Class.define(f,{extend:qx.ui.layout.Abstract,members:{verifyLayoutProperty:null,renderLayout:function(j,k){var v=this._getLayoutChildren();
var u;
var n;
var o=[];

for(var i=0,l=v.length;i<l;i++){u=v[i];
n=u.getLayoutProperties().column;
o[n]=u;
}var t=this.__lY(v[0]);
var w=t.getColumnSizes();
var q=t.getSpacingX();
var p=qx.lang.Array.sum(w)+q*(w.length-1);

if(p<j){w[1]+=j-p;
}var x=0,top=0;
var r=qx.ui.layout.Util;

for(var i=0,l=w.length;i<l;i++){u=o[i];

if(u){var m=u.getSizeHint();
var top=r.computeVerticalAlignOffset(u.getAlignY()||g,m.height,k,0,0);
var s=r.computeHorizontalAlignOffset(u.getAlignX()||e,m.width,w[i],u.getMarginLeft(),u.getMarginRight());
u.renderLayout(x+s,top,m.width,m.height);
}x+=w[i]+q;
}},__lY:function(h){while(!(h instanceof qx.ui.menu.Menu)){h=h.getLayoutParent();
}return h;
},_computeSizeHint:function(){var c=this._getLayoutChildren();
var b=0;
var d=0;

for(var i=0,l=c.length;i<l;i++){var a=c[i].getSizeHint();
d+=a.width;
b=Math.max(b,a.height);
}return {width:d,height:b};
}}});
})();
(function(){var C="horizontal",B="scrollpane",A="vertical",z="button-backward",y="button-forward",x="content",w="execute",v="qx.ui.container.SlideBar",u="scrollY",t="removeChildWidget",p="scrollX",s="_applyOrientation",r="mousewheel",o="Integer",n="slidebar",q="update";
qx.Class.define(v,{extend:qx.ui.core.Widget,include:[qx.ui.core.MRemoteChildrenHandling,qx.ui.core.MRemoteLayoutHandling],construct:function(D){qx.ui.core.Widget.call(this);
var E=this.getChildControl(B);
this._add(E,{flex:1});

if(D!=null){this.setOrientation(D);
}else{this.initOrientation();
}this.addListener(r,this._onMouseWheel,this);
},properties:{appearance:{refine:true,init:n},orientation:{check:[C,A],init:C,apply:s},scrollStep:{check:o,init:15,themeable:true}},members:{getChildrenContainer:function(){return this.getChildControl(x);
},_createChildControlImpl:function(I){var J;

switch(I){case y:J=new qx.ui.form.RepeatButton;
J.addListener(w,this._onExecuteForward,this);
J.setFocusable(false);
this._addAt(J,2);
break;
case z:J=new qx.ui.form.RepeatButton;
J.addListener(w,this._onExecuteBackward,this);
J.setFocusable(false);
this._addAt(J,0);
break;
case x:J=new qx.ui.container.Composite();
if(qx.bom.client.Engine.GECKO){J.addListener(t,this._onRemoveChild,this);
}this.getChildControl(B).add(J);
break;
case B:J=new qx.ui.core.scroll.ScrollPane();
J.addListener(q,this._onResize,this);
J.addListener(p,this._onScroll,this);
J.addListener(u,this._onScroll,this);
break;
}return J||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,I);
},_forwardStates:{barLeft:true,barTop:true,barRight:true,barBottom:true},scrollBy:function(a){var b=this.getChildControl(B);

if(this.getOrientation()===C){b.scrollByX(a);
}else{b.scrollByY(a);
}},scrollTo:function(i){var j=this.getChildControl(B);

if(this.getOrientation()===C){j.scrollToX(i);
}else{j.scrollToY(i);
}},_applyOrientation:function(c,d){var h=[this.getLayout(),this._getLayout()];
var g=this.getChildControl(y);
var f=this.getChildControl(z);
if(d==A){g.removeState(A);
f.removeState(A);
g.addState(C);
f.addState(C);
}else if(d==C){g.removeState(C);
f.removeState(C);
g.addState(A);
f.addState(A);
}
if(c==C){this._setLayout(new qx.ui.layout.HBox());
this.setLayout(new qx.ui.layout.HBox());
}else{this._setLayout(new qx.ui.layout.VBox());
this.setLayout(new qx.ui.layout.VBox());
}
if(h[0]){h[0].dispose();
}
if(h[1]){h[1].dispose();
}},_onMouseWheel:function(e){this.scrollBy(e.getWheelDelta()*this.getScrollStep());
e.stop();
},_onScroll:function(){this._updateArrowsEnabled();
},_onResize:function(e){var content=this.getChildControl(B).getChildren()[0];

if(!content){return;
}var k=this.getInnerSize();
var m=content.getBounds();
var l=(this.getOrientation()===C)?m.width>k.width:m.height>k.height;

if(l){this._showArrows();
this._updateArrowsEnabled();
}else{this._hideArrows();
}},_onExecuteBackward:function(){this.scrollBy(-this.getScrollStep());
},_onExecuteForward:function(){this.scrollBy(this.getScrollStep());
},_onRemoveChild:function(){qx.event.Timer.once(function(){this.scrollBy(this.getChildControl(B).getScrollX());
},this,50);
},_updateArrowsEnabled:function(){var G=this.getChildControl(B);

if(this.getOrientation()===C){var F=G.getScrollX();
var H=G.getScrollMaxX();
}else{var F=G.getScrollY();
var H=G.getScrollMaxY();
}this.getChildControl(z).setEnabled(F>0);
this.getChildControl(y).setEnabled(F<H);
},_showArrows:function(){this._showChildControl(y);
this._showChildControl(z);
},_hideArrows:function(){this._excludeChildControl(y);
this._excludeChildControl(z);
this.scrollTo(0);
}}});
})();
(function(){var f="execute",e="button-backward",d="vertical",c="button-forward",b="menu-slidebar",a="qx.ui.menu.MenuSlideBar";
qx.Class.define(a,{extend:qx.ui.container.SlideBar,construct:function(){qx.ui.container.SlideBar.call(this,d);
},properties:{appearance:{refine:true,init:b}},members:{_createChildControlImpl:function(g){var h;

switch(g){case c:h=new qx.ui.form.HoverButton();
h.addListener(f,this._onExecuteForward,this);
this._addAt(h,2);
break;
case e:h=new qx.ui.form.HoverButton();
h.addListener(f,this._onExecuteBackward,this);
this._addAt(h,0);
break;
}return h||qx.ui.container.SlideBar.prototype._createChildControlImpl.call(this,g);
}}});
})();
(function(){var p="pressed",o="abandoned",n="Integer",m="hovered",l="qx.event.type.Event",k="Enter",j="Space",i="press",h="qx.ui.form.RepeatButton",g="release",c="interval",f="__ma",d="execute";
qx.Class.define(h,{extend:qx.ui.form.Button,construct:function(r,s){qx.ui.form.Button.call(this,r,s);
this.__ma=new qx.event.AcceleratingTimer();
this.__ma.addListener(c,this._onInterval,this);
},events:{"execute":l,"press":l,"release":l},properties:{interval:{check:n,init:100},firstInterval:{check:n,init:500},minTimer:{check:n,init:20},timerDecrease:{check:n,init:2}},members:{__mb:null,__ma:null,press:function(){if(this.isEnabled()){if(!this.hasState(p)){this.__mc();
}this.removeState(o);
this.addState(p);
}},release:function(q){if(!this.isEnabled()){return;
}if(this.hasState(p)){if(!this.__mb){this.execute();
}}this.removeState(p);
this.removeState(o);
this.__md();
},_applyEnabled:function(a,b){qx.ui.form.Button.prototype._applyEnabled.call(this,a,b);

if(!a){this.removeState(p);
this.removeState(o);
this.__md();
}},_onMouseOver:function(e){if(!this.isEnabled()||e.getTarget()!==this){return;
}
if(this.hasState(o)){this.removeState(o);
this.addState(p);
this.__ma.start();
}this.addState(m);
},_onMouseOut:function(e){if(!this.isEnabled()||e.getTarget()!==this){return;
}this.removeState(m);

if(this.hasState(p)){this.removeState(p);
this.addState(o);
this.__ma.stop();
}},_onMouseDown:function(e){if(!e.isLeftPressed()){return;
}this.capture();
this.__mc();
e.stopPropagation();
},_onMouseUp:function(e){this.releaseCapture();

if(!this.hasState(o)){this.addState(m);

if(this.hasState(p)&&!this.__mb){this.execute();
}}this.__md();
e.stopPropagation();
},_onKeyUp:function(e){switch(e.getKeyIdentifier()){case k:case j:if(this.hasState(p)){if(!this.__mb){this.execute();
}this.removeState(p);
this.removeState(o);
e.stopPropagation();
this.__md();
}}},_onKeyDown:function(e){switch(e.getKeyIdentifier()){case k:case j:this.removeState(o);
this.addState(p);
e.stopPropagation();
this.__mc();
}},_onInterval:function(e){this.__mb=true;
this.fireEvent(d);
},__mc:function(){this.fireEvent(i);
this.__mb=false;
this.__ma.set({interval:this.getInterval(),firstInterval:this.getFirstInterval(),minimum:this.getMinTimer(),decrease:this.getTimerDecrease()}).start();
this.removeState(o);
this.addState(p);
},__md:function(){this.fireEvent(g);
this.__ma.stop();
this.removeState(o);
this.removeState(p);
}},destruct:function(){this._disposeObjects(f);
}});
})();
(function(){var e="Integer",d="interval",c="qx.event.type.Event",b="__me",a="qx.event.AcceleratingTimer";
qx.Class.define(a,{extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__me=new qx.event.Timer(this.getInterval());
this.__me.addListener(d,this._onInterval,this);
},events:{"interval":c},properties:{interval:{check:e,init:100},firstInterval:{check:e,init:500},minimum:{check:e,init:20},decrease:{check:e,init:2}},members:{__me:null,__mf:null,start:function(){this.__me.setInterval(this.getFirstInterval());
this.__me.start();
},stop:function(){this.__me.stop();
this.__mf=null;
},_onInterval:function(){this.__me.stop();

if(this.__mf==null){this.__mf=this.getInterval();
}this.__mf=Math.max(this.getMinimum(),this.__mf-this.getDecrease());
this.__me.setInterval(this.__mf);
this.__me.start();
this.fireEvent(d);
}},destruct:function(){this._disposeObjects(b);
}});
})();
(function(){var u="resize",t="scrollY",s="update",r="scrollX",q="_applyScrollX",p="_applyScrollY",o="qx.lang.Type.isNumber(value)&&value>=0&&value<=this.getScrollMaxX()",n="appear",m="qx.lang.Type.isNumber(value)&&value>=0&&value<=this.getScrollMaxY()",l="qx.event.type.Event",j="qx.ui.core.scroll.ScrollPane",k="scroll";
qx.Class.define(j,{extend:qx.ui.core.Widget,construct:function(){qx.ui.core.Widget.call(this);
this.set({minWidth:0,minHeight:0});
this._setLayout(new qx.ui.layout.Grow());
this.addListener(u,this._onUpdate);
var C=this.getContentElement();
C.addListener(k,this._onScroll,this);
C.addListener(n,this._onAppear,this);
},events:{update:l},properties:{scrollX:{check:o,apply:q,event:r,init:0},scrollY:{check:m,apply:p,event:t,init:0}},members:{add:function(f){var g=this._getChildren()[0];

if(g){this._remove(g);
g.removeListener(u,this._onUpdate,this);
}
if(f){this._add(f);
f.addListener(u,this._onUpdate,this);
}},remove:function(H){if(H){this._remove(H);
H.removeListener(u,this._onUpdate,this);
}},getChildren:function(){return this._getChildren();
},_onUpdate:function(e){this.fireEvent(s);
},_onScroll:function(e){var B=this.getContentElement();
this.setScrollX(B.getScrollX());
this.setScrollY(B.getScrollY());
},_onAppear:function(e){var L=this.getContentElement();
var I=this.getScrollX();
var J=L.getScrollX();

if(I!=J){L.scrollToX(I);
}var M=this.getScrollY();
var K=L.getScrollY();

if(M!=K){L.scrollToY(M);
}},getItemTop:function(z){var top=0;

do{top+=z.getBounds().top;
z=z.getLayoutParent();
}while(z&&z!==this);
return top;
},getItemBottom:function(c){return this.getItemTop(c)+c.getBounds().height;
},getItemLeft:function(a){var b=0;
var parent;

do{b+=a.getBounds().left;
parent=a.getLayoutParent();

if(parent){b+=parent.getInsets().left;
}a=parent;
}while(a&&a!==this);
return b;
},getItemRight:function(A){return this.getItemLeft(A)+A.getBounds().width;
},getScrollSize:function(){return this.getChildren()[0].getBounds();
},getScrollMaxX:function(){var G=this.getInnerSize();
var F=this.getScrollSize();

if(G&&F){return Math.max(0,F.width-G.width);
}return 0;
},getScrollMaxY:function(){var i=this.getInnerSize();
var h=this.getScrollSize();

if(i&&h){return Math.max(0,h.height-i.height);
}return 0;
},scrollToX:function(v){var w=this.getScrollMaxX();

if(v<0){v=0;
}else if(v>w){v=w;
}this.setScrollX(v);
},scrollToY:function(D){var E=this.getScrollMaxY();

if(D<0){D=0;
}else if(D>E){D=E;
}this.setScrollY(D);
},scrollByX:function(x){this.scrollToX(this.getScrollX()+x);
},scrollByY:function(y){this.scrollToY(this.getScrollY()+y);
},_applyScrollX:function(d){this.getContentElement().scrollToX(d);
},_applyScrollY:function(N){this.getContentElement().scrollToY(N);
}}});
})();
(function(){var i="Integer",h="hovered",g="hover-button",f="interval",d="mouseover",c="mouseout",b="__mg",a="qx.ui.form.HoverButton";
qx.Class.define(a,{extend:qx.ui.basic.Atom,include:[qx.ui.core.MExecutable],implement:[qx.ui.form.IExecutable],construct:function(j,k){qx.ui.basic.Atom.call(this,j,k);
this.addListener(d,this._onMouseOver,this);
this.addListener(c,this._onMouseOut,this);
this.__mg=new qx.event.AcceleratingTimer();
this.__mg.addListener(f,this._onInterval,this);
},properties:{appearance:{refine:true,init:g},interval:{check:i,init:80},firstInterval:{check:i,init:200},minTimer:{check:i,init:20},timerDecrease:{check:i,init:2}},members:{__mg:null,_onMouseOver:function(e){if(!this.isEnabled()||e.getTarget()!==this){return;
}this.__mg.set({interval:this.getInterval(),firstInterval:this.getFirstInterval(),minimum:this.getMinTimer(),decrease:this.getTimerDecrease()}).start();
this.addState(h);
},_onMouseOut:function(e){this.__mg.stop();
this.removeState(h);

if(!this.isEnabled()||e.getTarget()!==this){return;
}},_onInterval:function(){if(this.isEnabled()){this.execute();
}else{this.__mg.stop();
}}},destruct:function(){this._disposeObjects(b);
}});
})();
(function(){var b="qx.ui.menu.Button",a="menu-button";
qx.Class.define(b,{extend:qx.ui.menu.AbstractButton,construct:function(c,d,f,g){qx.ui.menu.AbstractButton.call(this);
if(c!=null){this.setLabel(c);
}
if(d!=null){this.setIcon(d);
}
if(f!=null){this.setCommand(f);
}
if(g!=null){this.setMenu(g);
}},properties:{appearance:{refine:true,init:a}},members:{_onMouseUp:function(e){if(e.isLeftPressed()){this.execute();
if(this.getMenu()){return;
}}qx.ui.menu.Manager.getInstance().hideAll();
},_onKeyPress:function(e){this.execute();
}}});
})();
(function(){var l="pressed",k="hovered",j="inherit",i="qx.ui.menubar.Button",h="keydown",g="menubar-button",f="keyup";
qx.Class.define(i,{extend:qx.ui.form.MenuButton,construct:function(b,c,d){qx.ui.form.MenuButton.call(this,b,c,d);
this.removeListener(h,this._onKeyDown);
this.removeListener(f,this._onKeyUp);
},properties:{appearance:{refine:true,init:g},show:{refine:true,init:j},focusable:{refine:true,init:false}},members:{getMenuBar:function(){var parent=this;

while(parent){if(parent instanceof qx.ui.toolbar.ToolBar){return parent;
}parent=parent.getLayoutParent();
}return null;
},open:function(n){qx.ui.form.MenuButton.prototype.open.call(this,n);
var menubar=this.getMenuBar();
menubar._setAllowMenuOpenHover(true);
},_onMenuChange:function(e){var a=this.getMenu();
var menubar=this.getMenuBar();

if(a.isVisible()){this.addState(l);
if(menubar){menubar.setOpenMenu(a);
}}else{this.removeState(l);
if(menubar&&menubar.getOpenMenu()==a){menubar.resetOpenMenu();
menubar._setAllowMenuOpenHover(false);
}}},_onMouseUp:function(e){qx.ui.form.MenuButton.prototype._onMouseUp.call(this,e);
var m=this.getMenu();

if(m&&m.isVisible()&&!this.hasState(l)){this.addState(l);
}},_onMouseOver:function(e){this.addState(k);
if(this.getMenu()){var menubar=this.getMenuBar();

if(menubar._isAllowMenuOpenHover()){qx.ui.menu.Manager.getInstance().hideAll();
menubar._setAllowMenuOpenHover(true);
if(this.isEnabled()){this.open();
}}}}}});
})();
(function(){var o="both",n="qx.ui.menu.Menu",m="_applySpacing",k="icon",j="label",h="changeShow",g="Integer",f="qx.ui.toolbar.ToolBar",e="toolbar",d="changeOpenMenu";
qx.Class.define(f,{extend:qx.ui.core.Widget,include:qx.ui.core.MChildrenHandling,construct:function(){qx.ui.core.Widget.call(this);
this._setLayout(new qx.ui.layout.HBox());
},properties:{appearance:{refine:true,init:e},openMenu:{check:n,event:d,nullable:true},show:{init:o,check:[o,j,k],inheritable:true,event:h},spacing:{nullable:true,check:g,themeable:true,apply:m}},members:{__mh:false,_setAllowMenuOpenHover:function(p){this.__mh=p;
},_isAllowMenuOpenHover:function(){return this.__mh;
},_applySpacing:function(a,b){var c=this._getLayout();
a==null?c.resetSpacing():c.setSpacing(a);
},addSpacer:function(){var q=new qx.ui.core.Spacer;
this._add(q,{flex:1});
return q;
},addSeparator:function(){this.add(new qx.ui.toolbar.Separator);
},getMenuButtons:function(){var s=this.getChildren();
var r=[];
var t;

for(var i=0,l=s.length;i<l;i++){t=s[i];

if(t instanceof qx.ui.menubar.Button){r.push(t);
}else if(t instanceof qx.ui.toolbar.Part){r.push.apply(r,t.getMenuButtons());
}}return r;
}}});
})();
(function(){var a="qx.ui.core.Spacer";
qx.Class.define(a,{extend:qx.ui.core.LayoutItem,construct:function(c,d){qx.ui.core.LayoutItem.call(this);
this.setWidth(c!=null?c:0);
this.setHeight(d!=null?d:0);
},members:{checkAppearanceNeeds:function(){},addChildrenToQueue:function(b){},destroy:function(){if(this.$$disposed){return;
}var parent=this.$$parent;

if(parent){parent._remove(this);
}qx.ui.core.queue.Dispose.add(this);
}}});
})();
(function(){var b="toolbar-separator",a="qx.ui.toolbar.Separator";
qx.Class.define(a,{extend:qx.ui.core.Widget,properties:{appearance:{refine:true,init:b},anonymous:{refine:true,init:true},width:{refine:true,init:0},height:{refine:true,init:0}}});
})();
(function(){var m="container",k="handle",j="both",h="Integer",g="middle",f="qx.ui.toolbar.Part",e="icon",d="label",c="changeShow",b="_applySpacing",a="toolbar/part";
qx.Class.define(f,{extend:qx.ui.core.Widget,include:[qx.ui.core.MRemoteChildrenHandling],construct:function(){qx.ui.core.Widget.call(this);
this._setLayout(new qx.ui.layout.HBox);
this._createChildControl(k);
},properties:{appearance:{refine:true,init:a},show:{init:j,check:[j,d,e],inheritable:true,event:c},spacing:{nullable:true,check:h,themeable:true,apply:b}},members:{_createChildControlImpl:function(q){var r;

switch(q){case k:r=new qx.ui.basic.Image();
r.setAlignY(g);
this._add(r);
break;
case m:r=new qx.ui.toolbar.PartContainer;
this._add(r);
break;
}return r||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,q);
},getChildrenContainer:function(){return this.getChildControl(m);
},_applySpacing:function(s,t){var u=this.getChildControl(m).getLayout();
s==null?u.resetSpacing():u.setSpacing(s);
},addSeparator:function(){this.add(new qx.ui.toolbar.Separator);
},getMenuButtons:function(){var o=this.getChildren();
var n=[];
var p;

for(var i=0,l=o.length;i<l;i++){p=o[i];

if(p instanceof qx.ui.menubar.Button){n.push(p);
}}return n;
}}});
})();
(function(){var f="both",e="toolbar/part/container",d="icon",c="changeShow",b="qx.ui.toolbar.PartContainer",a="label";
qx.Class.define(b,{extend:qx.ui.container.Composite,construct:function(){qx.ui.container.Composite.call(this);
this._setLayout(new qx.ui.layout.HBox);
},properties:{appearance:{refine:true,init:e},show:{init:f,check:[f,a,d],inheritable:true,event:c}}});
})();
(function(){var b="qx.ui.form.IBooleanForm",a="qx.event.type.Data";
qx.Interface.define(b,{events:{"changeValue":a},members:{setValue:function(c){return arguments.length==1;
},resetValue:function(){},getValue:function(){}}});
})();
(function(){var h="checked",g="menu-checkbox",f="Boolean",d="_applyValue",c="changeValue",b="qx.ui.menu.CheckBox",a="execute";
qx.Class.define(b,{extend:qx.ui.menu.AbstractButton,implement:[qx.ui.form.IBooleanForm],construct:function(i,j){qx.ui.menu.AbstractButton.call(this);
if(i!=null){if(i.translate){this.setLabel(i.translate());
}else{this.setLabel(i);
}}
if(j!=null){this.setMenu(j);
}this.addListener(a,this._onExecute,this);
},properties:{appearance:{refine:true,init:g},value:{check:f,init:false,apply:d,event:c,nullable:true}},members:{_applyValue:function(k,l){k?this.addState(h):this.removeState(h);
},_onExecute:function(e){this.toggleValue();
},_onMouseUp:function(e){if(e.isLeftPressed()){this.execute();
}qx.ui.menu.Manager.getInstance().hideAll();
},_onKeyPress:function(e){this.execute();
}}});
})();
(function(){var b="qx.ui.table.IColumnMenuItem",a="qx.event.type.Data";
qx.Interface.define(b,{properties:{visible:{}},events:{changeVisible:a}});
})();
(function(){var f="changeVisible",d="qx.ui.table.columnmenu.MenuItem",c="_applyVisible",b="Boolean",a="changeValue";
qx.Class.define(d,{extend:qx.ui.menu.CheckBox,implement:qx.ui.table.IColumnMenuItem,properties:{visible:{check:b,init:true,apply:c,event:f}},construct:function(g){qx.ui.menu.CheckBox.call(this,g);
this.addListener(a,function(e){this.bInListener=true;
this.setVisible(e.getData());
this.bInListener=false;
});
},members:{__mi:false,_applyVisible:function(h,i){if(!this.bInListener){this.setValue(h);
}}}});
})();
(function(){var d="qx.ui.table.selection.Model",c="qx.ui.table.selection.Manager";
qx.Class.define(c,{extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
},properties:{selectionModel:{check:d}},members:{__mj:null,handleMouseDown:function(r,s){if(s.isLeftPressed()){var t=this.getSelectionModel();

if(!t.isSelectedIndex(r)){this._handleSelectEvent(r,s);
this.__mj=true;
}else{this.__mj=false;
}}else if(s.isRightPressed()&&s.getModifiers()==0){var t=this.getSelectionModel();

if(!t.isSelectedIndex(r)){t.setSelectionInterval(r,r);
}}},handleMouseUp:function(a,b){if(b.isLeftPressed()&&!this.__mj){this._handleSelectEvent(a,b);
}},handleClick:function(e,f){},handleSelectKeyDown:function(l,m){this._handleSelectEvent(l,m);
},handleMoveKeyDown:function(n,o){var q=this.getSelectionModel();

switch(o.getModifiers()){case 0:q.setSelectionInterval(n,n);
break;
case qx.event.type.Dom.SHIFT_MASK:var p=q.getAnchorSelectionIndex();

if(p==-1){q.setSelectionInterval(n,n);
}else{q.setSelectionInterval(p,n);
}break;
}},_handleSelectEvent:function(g,h){var k=this.getSelectionModel();
var i=k.getLeadSelectionIndex();
var j=k.getAnchorSelectionIndex();

if(h.isShiftPressed()){if(g!=i||k.isSelectionEmpty()){if(j==-1){j=g;
}
if(h.isCtrlOrCommandPressed()){k.addSelectionInterval(j,g);
}else{k.setSelectionInterval(j,g);
}}}else if(h.isCtrlOrCommandPressed()){if(k.isSelectedIndex(g)){k.removeSelectionInterval(g,g);
}else{k.addSelectionInterval(g,g);
}}else{k.setSelectionInterval(g,g);
}}}});
})();
(function(){var O="..",N="changeSelection",M="Use 'resetSelection' instead",L=" [",K="]",J="qx.event.type.Event",I="Ranges:",H="qx.ui.table.selection.Model",G="_applySelectionMode",F="Use '_resetSelection' instead.";
qx.Class.define(H,{extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__mk=[];
this.__ml=-1;
this.__mm=-1;
this.hasBatchModeRefCount=0;
this.__mn=false;
},events:{"changeSelection":J},statics:{NO_SELECTION:1,SINGLE_SELECTION:2,SINGLE_INTERVAL_SELECTION:3,MULTIPLE_INTERVAL_SELECTION:4,MULTIPLE_INTERVAL_SELECTION_TOGGLE:5},properties:{selectionMode:{init:2,check:[1,2,3,4,5],apply:G}},members:{__mn:null,__ml:null,__mm:null,__mk:null,_applySelectionMode:function(x){this.resetSelection();
},setBatchMode:function(a){if(a){this.hasBatchModeRefCount+=1;
}else{if(this.hasBatchModeRefCount==0){throw new Error("Try to turn off batch mode althoug it was not turned on.");
}this.hasBatchModeRefCount-=1;

if(this.__mn){this.__mn=false;
this._fireChangeSelection();
}}return this.hasBatchMode();
},hasBatchMode:function(){return this.hasBatchModeRefCount>0;
},getAnchorSelectionIndex:function(){return this.__ml;
},_setAnchorSelectionIndex:function(Q){this.__ml=Q;
},getLeadSelectionIndex:function(){return this.__mm;
},_setLeadSelectionIndex:function(o){this.__mm=o;
},_getSelectedRangeArr:function(){return this.__mk;
},resetSelection:function(){if(!this.isSelectionEmpty()){this._resetSelection();
this._fireChangeSelection();
}},clearSelection:function(){qx.log.Logger.deprecatedMethodWarning(arguments.callee,M);
this.resetSelection();
},isSelectionEmpty:function(){return this.__mk.length==0;
},getSelectedCount:function(){var U=0;

for(var i=0;i<this.__mk.length;i++){var T=this.__mk[i];
U+=T.maxIndex-T.minIndex+1;
}return U;
},isSelectedIndex:function(b){for(var i=0;i<this.__mk.length;i++){var c=this.__mk[i];

if(b>=c.minIndex&&b<=c.maxIndex){return true;
}}return false;
},getSelectedRanges:function(){var P=[];

for(var i=0;i<this.__mk.length;i++){P.push({minIndex:this.__mk[i].minIndex,maxIndex:this.__mk[i].maxIndex});
}return P;
},iterateSelection:function(h,k){for(var i=0;i<this.__mk.length;i++){for(var j=this.__mk[i].minIndex;j<=this.__mk[i].maxIndex;j++){h.call(k,j);
}}},setSelectionInterval:function(l,m){var n=this.self(arguments);

switch(this.getSelectionMode()){case n.NO_SELECTION:return;
case n.SINGLE_SELECTION:if(this.isSelectedIndex(m)){return;
}l=m;
break;
case n.MULTIPLE_INTERVAL_SELECTION_TOGGLE:this.setBatchMode(true);

try{for(var i=l;i<=m;i++){if(!this.isSelectedIndex(i)){this._addSelectionInterval(i,i);
}else{this.removeSelectionInterval(i,i);
}}}catch(e){throw e;
}finally{this.setBatchMode(false);
}this._fireChangeSelection();
return;
}this._resetSelection();
this._addSelectionInterval(l,m);
this._fireChangeSelection();
},addSelectionInterval:function(d,f){var g=qx.ui.table.selection.Model;

switch(this.getSelectionMode()){case g.NO_SELECTION:return;
case g.MULTIPLE_INTERVAL_SELECTION:case g.MULTIPLE_INTERVAL_SELECTION_TOGGLE:this._addSelectionInterval(d,f);
this._fireChangeSelection();
break;
default:this.setSelectionInterval(d,f);
break;
}},removeSelectionInterval:function(p,q){this.__ml=p;
this.__mm=q;
var r=Math.min(p,q);
var t=Math.max(p,q);
for(var i=0;i<this.__mk.length;i++){var v=this.__mk[i];

if(v.minIndex>t){break;
}else if(v.maxIndex>=r){var w=(v.minIndex>=r)&&(v.minIndex<=t);
var u=(v.maxIndex>=r)&&(v.maxIndex<=t);

if(w&&u){this.__mk.splice(i,1);
i--;
}else if(w){v.minIndex=t+1;
}else if(u){v.maxIndex=r-1;
}else{var s={minIndex:t+1,maxIndex:v.maxIndex};
this.__mk.splice(i+1,0,s);
v.maxIndex=r-1;
break;
}}}this._fireChangeSelection();
},_resetSelection:function(){this.__mk=[];
this.__ml=-1;
this.__mm=-1;
},_clearSelection:function(){qx.log.Logger.deprecatedMethodWarning(arguments.callee,F);
this._resetSelection();
},_addSelectionInterval:function(y,z){this.__ml=y;
this.__mm=z;
var A=Math.min(y,z);
var C=Math.max(y,z);
var B=0;

for(;B<this.__mk.length;B++){var D=this.__mk[B];

if(D.minIndex>A){break;
}}this.__mk.splice(B,0,{minIndex:A,maxIndex:C});
var E=this.__mk[0];

for(var i=1;i<this.__mk.length;i++){var D=this.__mk[i];

if(E.maxIndex+1>=D.minIndex){E.maxIndex=Math.max(E.maxIndex,D.maxIndex);
this.__mk.splice(i,1);
i--;
}else{E=D;
}}},_dumpRanges:function(){var R=I;

for(var i=0;i<this.__mk.length;i++){var S=this.__mk[i];
R+=L+S.minIndex+O+S.maxIndex+K;
}this.debug(R);
},_fireChangeSelection:function(){if(this.hasBatchMode()){this.__mn=true;
}else{this.fireEvent(N);
}}},destruct:function(){this.__mk=null;
}});
})();
(function(){var c="qx.ui.table.IHeaderRenderer";
qx.Interface.define(c,{members:{createHeaderCell:function(d){return true;
},updateHeaderCell:function(a,b){return true;
}}});
})();
(function(){var b="qx.ui.table.headerrenderer.Default",a="String";
qx.Class.define(b,{extend:qx.core.Object,implement:qx.ui.table.IHeaderRenderer,statics:{STATE_SORTED:"sorted",STATE_SORTED_ASCENDING:"sortedAscending"},properties:{toolTip:{check:a,init:null,nullable:true}},members:{createHeaderCell:function(c){var d=new qx.ui.table.headerrenderer.HeaderCell();
this.updateHeaderCell(c,d);
return d;
},updateHeaderCell:function(e,f){var g=qx.ui.table.headerrenderer.Default;
if(e.name&&e.name.translate){f.setLabel(e.name.translate());
}else{f.setLabel(e.name);
}var h=f.getToolTip();

if(this.getToolTip()!=null){if(h==null){h=new qx.ui.tooltip.ToolTip(this.getToolTip());
f.setToolTip(h);
qx.util.DisposeUtil.disposeTriggeredBy(h,f);
}else{h.setLabel(this.getToolTip());
}}e.sorted?f.addState(g.STATE_SORTED):f.removeState(g.STATE_SORTED);
e.sortedAscending?f.addState(g.STATE_SORTED_ASCENDING):f.removeState(g.STATE_SORTED_ASCENDING);
}}});
})();
(function(){var c="qx.ui.table.ICellRenderer";
qx.Interface.define(c,{members:{createDataCellHtml:function(a,b){return true;
}}});
})();
(function(){var p="",o="px;",n=".qooxdoo-table-cell {",m="qooxdoo-table-cell",l='" ',k="nowrap",j="default",i="qx.client",h="}",g="width:",M=".qooxdoo-table-cell-right { text-align:right } ",L="0px 6px",K='<div class="',J="0px",I="height:",H="1px solid ",G=".qooxdoo-table-cell-bold { font-weight:bold } ",F="table-row-line",E='>',D="mshtml",w='</div>',x="ellipsis",u="content-box",v='left:',s="qx.ui.table.cellrenderer.Abstract",t='" style="',q="abstract",r="none",y="hidden",z="} ",B='px;',A=".qooxdoo-table-cell-italic { font-style:italic} ",C="absolute";
qx.Class.define(s,{type:q,implement:qx.ui.table.ICellRenderer,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
var O=qx.ui.table.cellrenderer.Abstract;

if(!O.__mo){var Q=qx.theme.manager.Color.getInstance();
O.__mo=this.self(arguments);
var P=n+
qx.bom.element.Style.compile({position:C,top:J,overflow:y,whiteSpace:k,borderRight:H+Q.resolve(F),padding:L,cursor:j,textOverflow:x,userSelect:r})+z+M+A+G;

if(!qx.core.Variant.isSet(i,D)){P+=n+qx.bom.element.BoxSizing.compile(u)+h;
}O.__mo.stylesheet=qx.bom.Stylesheet.createElement(P);
}},members:{_insetX:6+6+1,_insetY:0,_getCellClass:function(N){return m;
},_getCellStyle:function(a){return a.style||p;
},_getCellAttributes:function(T){return p;
},_getContentHtml:function(U){return U.value||p;
},_getCellSizeStyle:function(b,c,d,e){var f=p;

if(qx.bom.client.Feature.CONTENT_BOX){b-=d;
c-=e;
}f+=g+Math.max(b,0)+o;
f+=I+Math.max(c,0)+o;
return f;
},createDataCellHtml:function(R,S){S.push(K,this._getCellClass(R),t,v,R.styleLeft,B,this._getCellSizeStyle(R.styleWidth,R.styleHeight,this._insetX,this._insetY),this._getCellStyle(R),l,this._getCellAttributes(R),E+this._getContentHtml(R),w);
}}});
})();
(function(){var h="",g="number",f="Boolean",e="qx.ui.table.cellrenderer.Default",d=" qooxdoo-table-cell-bold",c=" qooxdoo-table-cell-right",b=" qooxdoo-table-cell-italic",a="string";
qx.Class.define(e,{extend:qx.ui.table.cellrenderer.Abstract,statics:{STYLEFLAG_ALIGN_RIGHT:1,STYLEFLAG_BOLD:2,STYLEFLAG_ITALIC:4,_numberFormat:null},properties:{useAutoAlign:{check:f,init:true}},members:{_getStyleFlags:function(l){if(this.getUseAutoAlign()){if(typeof l.value==g){return qx.ui.table.cellrenderer.Default.STYLEFLAG_ALIGN_RIGHT;
}}return 0;
},_getCellClass:function(n){var o=qx.ui.table.cellrenderer.Abstract.prototype._getCellClass.call(this,n);

if(!o){return h;
}var p=this._getStyleFlags(n);

if(p&qx.ui.table.cellrenderer.Default.STYLEFLAG_ALIGN_RIGHT){o+=c;
}
if(p&qx.ui.table.cellrenderer.Default.STYLEFLAG_BOLD){o+=d;
}
if(p&qx.ui.table.cellrenderer.Default.STYLEFLAG_ITALIC){o+=b;
}return o;
},_getContentHtml:function(m){return qx.bom.String.escape(this._formatValue(m));
},_formatValue:function(i){var k=i.value;
var j;

if(k==null){return h;
}
if(typeof k==a){return k;
}else if(typeof k==g){if(!qx.ui.table.cellrenderer.Default._numberFormat){qx.ui.table.cellrenderer.Default._numberFormat=new qx.util.format.NumberFormat();
qx.ui.table.cellrenderer.Default._numberFormat.setMaximumFractionDigits(2);
}var j=qx.ui.table.cellrenderer.Default._numberFormat.format(k);
}else if(k instanceof Date){j=qx.util.format.DateFormat.getDateInstance().format(k);
}else{j=k;
}return j;
}}});
})();
(function(){var a="qx.ui.table.ICellEditorFactory";
qx.Interface.define(a,{members:{createCellEditor:function(b){return true;
},getCellEditorValue:function(c){return true;
}}});
})();
(function(){var i="",h="Function",g="abstract",f="number",e="appear",d="qx.ui.table.celleditor.AbstractField";
qx.Class.define(d,{extend:qx.core.Object,implement:qx.ui.table.ICellEditorFactory,type:g,properties:{validationFunction:{check:h,nullable:true,init:null}},members:{_createEditor:function(){throw new Error("Abstract method call!");
},createCellEditor:function(j){var k=this._createEditor();
k.originalValue=j.value;

if(j.value===null||j.value===undefined){j.value=i;
}k.setValue(i+j.value);
k.addListener(e,function(){k.selectAllText();
});
return k;
},getCellEditorValue:function(a){var c=a.getValue();
var b=this.getValidationFunction();

if(b){c=b(c,a.originalValue);
}
if(typeof a.originalValue==f){c=parseFloat(c);
}return c;
}}});
})();
(function(){var c="number",b="qx.ui.table.celleditor.TextField",a="table-editor-textfield";
qx.Class.define(b,{extend:qx.ui.table.celleditor.AbstractField,members:{getCellEditorValue:function(e){var g=e.getValue();
var f=this.getValidationFunction();

if(f){g=f(g,e.originalValue);
}
if(typeof e.originalValue==c){if(g!=null){g=parseFloat(g);
}}return g;
},_createEditor:function(){var d=new qx.ui.form.TextField();
d.setAppearance(a);
return d;
}}});
})();
(function(){var be="qx.event.type.Data",bd="visibilityChanged",bc="orderChanged",bb="visibilityChangedPre",ba="__mw",Y="widthChanged",X="qx.ui.table.columnmodel.Basic",W="__mv",V="__mu";
qx.Class.define(X,{extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__mp=[];
this.__mq=[];
},events:{"widthChanged":be,"visibilityChangedPre":be,"visibilityChanged":be,"orderChanged":be},statics:{DEFAULT_WIDTH:100,DEFAULT_HEADER_RENDERER:qx.ui.table.headerrenderer.Default,DEFAULT_DATA_RENDERER:qx.ui.table.cellrenderer.Default,DEFAULT_EDITOR_FACTORY:qx.ui.table.celleditor.TextField},members:{__mr:null,__ms:null,__mq:null,__mp:null,__mt:null,__mu:null,__mv:null,__mw:null,init:function(n){{};
this.__mt=[];
var q=qx.ui.table.columnmodel.Basic.DEFAULT_WIDTH;
var r=this.__mu||(this.__mu=new qx.ui.table.columnmodel.Basic.DEFAULT_HEADER_RENDERER());
var p=this.__mv||(this.__mv=new qx.ui.table.columnmodel.Basic.DEFAULT_DATA_RENDERER());
var o=this.__mw||(this.__mw=new qx.ui.table.columnmodel.Basic.DEFAULT_EDITOR_FACTORY());
this.__mp=[];
this.__mq=[];

for(var t=0;t<n;t++){this.__mt[t]={width:q,headerRenderer:r,dataRenderer:p,editorFactory:o};
this.__mp[t]=t;
this.__mq[t]=t;
}this.__ms=null;

for(var t=0;t<n;t++){var s={col:t,visible:true};
this.fireDataEvent(bb,s);
this.fireDataEvent(bd,s);
}},getVisibleColumns:function(){return this.__mq!=null?this.__mq:[];
},setColumnWidth:function(bg,bh){{};
var bj=this.__mt[bg].width;

if(bj!=bh){this.__mt[bg].width=bh;
var bi={col:bg,newWidth:bh,oldWidth:bj};
this.fireDataEvent(Y,bi);
}},getColumnWidth:function(U){{};
return this.__mt[U].width;
},setHeaderCellRenderer:function(I,J){{};
var K=this.__mt[I].headerRenderer;

if(K!==this.__mu){K.dispose();
}this.__mt[I].headerRenderer=J;
},getHeaderCellRenderer:function(O){{};
return this.__mt[O].headerRenderer;
},setDataCellRenderer:function(L,M){{};
var N=this.__mt[L].dataRenderer;

if(N!==this.__mv){N.dispose();
}this.__mt[L].dataRenderer=M;
},getDataCellRenderer:function(P){{};
return this.__mt[P].dataRenderer;
},setCellEditorFactory:function(u,v){{};
var w=this.__mt[u].headerRenderer;

if(w!==this.__mw){w.dispose();
}this.__mt[u].editorFactory=v;
},getCellEditorFactory:function(a){{};
return this.__mt[a].editorFactory;
},_getColToXPosMap:function(){if(this.__ms==null){this.__ms={};

for(var g=0;g<this.__mp.length;g++){var f=this.__mp[g];
this.__ms[f]={overX:g};
}
for(var e=0;e<this.__mq.length;e++){var f=this.__mq[e];
this.__ms[f].visX=e;
}}return this.__ms;
},getVisibleColumnCount:function(){return this.__mq!=null?this.__mq.length:0;
},getVisibleColumnAtX:function(bf){{};
return this.__mq[bf];
},getVisibleX:function(d){{};
return this._getColToXPosMap()[d].visX;
},getOverallColumnCount:function(){return this.__mp.length;
},getOverallColumnAtX:function(c){{};
return this.__mp[c];
},getOverallX:function(y){{};
return this._getColToXPosMap()[y].overX;
},isColumnVisible:function(b){{};
return (this._getColToXPosMap()[b].visX!=null);
},setColumnVisible:function(z,A){{};

if(A!=this.isColumnVisible(z)){if(A){var G=this._getColToXPosMap();
var D=G[z].overX;

if(D==null){throw new Error("Showing column failed: "+z+". The column is not added to this TablePaneModel.");
}var E;

for(var x=D+1;x<this.__mp.length;x++){var F=this.__mp[x];
var B=G[F].visX;

if(B!=null){E=B;
break;
}}if(E==null){E=this.__mq.length;
}this.__mq.splice(E,0,z);
}else{var C=this.getVisibleX(z);
this.__mq.splice(C,1);
}this.__ms=null;
if(!this.__mr){var H={col:z,visible:A};
this.fireDataEvent(bb,H);
this.fireDataEvent(bd,H);
}}},moveColumn:function(h,j){{};
this.__mr=true;
var m=this.__mp[h];
var k=this.isColumnVisible(m);

if(k){this.setColumnVisible(m,false);
}this.__mp.splice(h,1);
this.__mp.splice(j,0,m);
this.__ms=null;

if(k){this.setColumnVisible(m,true);
}this.__mr=false;
var l={col:m,fromOverXPos:h,toOverXPos:j};
this.fireDataEvent(bc,l);
},setColumnsOrder:function(Q){{};

if(Q.length==this.__mp.length){this.__mr=true;
var T=new Array(Q.length);

for(var R=0;R<this.__mp.length;R++){var S=this.isColumnVisible(R);
T[R]=S;

if(S){this.setColumnVisible(R,false);
}}this.__mp=qx.lang.Array.clone(Q);
this.__ms=null;
for(var R=0;R<this.__mp.length;R++){if(T[R]){this.setColumnVisible(R,true);
}}this.__mr=false;
this.fireDataEvent(bc);
}else{throw new Error("setColumnsOrder: Invalid number of column positions given, expected "+this.__mp.length+", got "+Q.length);
}}},destruct:function(){for(var i=0;i<this.__mt.length;i++){this.__mt[i].headerRenderer.dispose();
this.__mt[i].dataRenderer.dispose();
this.__mt[i].editorFactory.dispose();
}this.__mp=this.__mq=this.__mt=this.__ms=null;
this._disposeObjects(V,W,ba);
}});
})();
(function(){var k="icon",j="label",i="String",h="sort-icon",g="_applySortIcon",f="_applyIcon",e="table-header-cell",d="qx.ui.table.headerrenderer.HeaderCell",c="_applyLabel";
qx.Class.define(d,{extend:qx.ui.container.Composite,construct:function(){qx.ui.container.Composite.call(this);
var n=new qx.ui.layout.Grid();
n.setRowFlex(0,1);
n.setColumnFlex(1,1);
n.setColumnFlex(2,1);
this.setLayout(n);
},properties:{appearance:{refine:true,init:e},label:{check:i,init:null,nullable:true,apply:c},sortIcon:{check:i,init:null,nullable:true,apply:g,themeable:true},icon:{check:i,init:null,nullable:true,apply:f}},members:{_applyLabel:function(o,p){if(o){this._showChildControl(j).setValue(o);
}else{this._excludeChildControl(j);
}},_applySortIcon:function(l,m){if(l){this._showChildControl(h).setSource(l);
}else{this._excludeChildControl(h);
}},_applyIcon:function(a,b){if(a){this._showChildControl(k).setSource(a);
}else{this._excludeChildControl(k);
}},_createChildControlImpl:function(q){var r;

switch(q){case j:r=new qx.ui.basic.Label(this.getLabel()).set({anonymous:true,allowShrinkX:true});
this._add(r,{row:0,column:1});
break;
case h:r=new qx.ui.basic.Image(this.getSortIcon());
r.setAnonymous(true);
this._add(r,{row:0,column:2});
break;
case k:r=new qx.ui.basic.Image(this.getIcon()).set({anonymous:true,allowShrinkX:true});
this._add(r,{row:0,column:0});
break;
}return r||qx.ui.container.Composite.prototype._createChildControlImpl.call(this,q);
}}});
})();
(function(){var h="",g="<br",f=" &nbsp;",e="<br>",d=" ",c="\n",b="qx.bom.String";
qx.Class.define(b,{statics:{TO_CHARCODE:{"quot":34,"amp":38,"lt":60,"gt":62,"nbsp":160,"iexcl":161,"cent":162,"pound":163,"curren":164,"yen":165,"brvbar":166,"sect":167,"uml":168,"copy":169,"ordf":170,"laquo":171,"not":172,"shy":173,"reg":174,"macr":175,"deg":176,"plusmn":177,"sup2":178,"sup3":179,"acute":180,"micro":181,"para":182,"middot":183,"cedil":184,"sup1":185,"ordm":186,"raquo":187,"frac14":188,"frac12":189,"frac34":190,"iquest":191,"Agrave":192,"Aacute":193,"Acirc":194,"Atilde":195,"Auml":196,"Aring":197,"AElig":198,"Ccedil":199,"Egrave":200,"Eacute":201,"Ecirc":202,"Euml":203,"Igrave":204,"Iacute":205,"Icirc":206,"Iuml":207,"ETH":208,"Ntilde":209,"Ograve":210,"Oacute":211,"Ocirc":212,"Otilde":213,"Ouml":214,"times":215,"Oslash":216,"Ugrave":217,"Uacute":218,"Ucirc":219,"Uuml":220,"Yacute":221,"THORN":222,"szlig":223,"agrave":224,"aacute":225,"acirc":226,"atilde":227,"auml":228,"aring":229,"aelig":230,"ccedil":231,"egrave":232,"eacute":233,"ecirc":234,"euml":235,"igrave":236,"iacute":237,"icirc":238,"iuml":239,"eth":240,"ntilde":241,"ograve":242,"oacute":243,"ocirc":244,"otilde":245,"ouml":246,"divide":247,"oslash":248,"ugrave":249,"uacute":250,"ucirc":251,"uuml":252,"yacute":253,"thorn":254,"yuml":255,"fnof":402,"Alpha":913,"Beta":914,"Gamma":915,"Delta":916,"Epsilon":917,"Zeta":918,"Eta":919,"Theta":920,"Iota":921,"Kappa":922,"Lambda":923,"Mu":924,"Nu":925,"Xi":926,"Omicron":927,"Pi":928,"Rho":929,"Sigma":931,"Tau":932,"Upsilon":933,"Phi":934,"Chi":935,"Psi":936,"Omega":937,"alpha":945,"beta":946,"gamma":947,"delta":948,"epsilon":949,"zeta":950,"eta":951,"theta":952,"iota":953,"kappa":954,"lambda":955,"mu":956,"nu":957,"xi":958,"omicron":959,"pi":960,"rho":961,"sigmaf":962,"sigma":963,"tau":964,"upsilon":965,"phi":966,"chi":967,"psi":968,"omega":969,"thetasym":977,"upsih":978,"piv":982,"bull":8226,"hellip":8230,"prime":8242,"Prime":8243,"oline":8254,"frasl":8260,"weierp":8472,"image":8465,"real":8476,"trade":8482,"alefsym":8501,"larr":8592,"uarr":8593,"rarr":8594,"darr":8595,"harr":8596,"crarr":8629,"lArr":8656,"uArr":8657,"rArr":8658,"dArr":8659,"hArr":8660,"forall":8704,"part":8706,"exist":8707,"empty":8709,"nabla":8711,"isin":8712,"notin":8713,"ni":8715,"prod":8719,"sum":8721,"minus":8722,"lowast":8727,"radic":8730,"prop":8733,"infin":8734,"ang":8736,"and":8743,"or":8744,"cap":8745,"cup":8746,"int":8747,"there4":8756,"sim":8764,"cong":8773,"asymp":8776,"ne":8800,"equiv":8801,"le":8804,"ge":8805,"sub":8834,"sup":8835,"sube":8838,"supe":8839,"oplus":8853,"otimes":8855,"perp":8869,"sdot":8901,"lceil":8968,"rceil":8969,"lfloor":8970,"rfloor":8971,"lang":9001,"rang":9002,"loz":9674,"spades":9824,"clubs":9827,"hearts":9829,"diams":9830,"OElig":338,"oelig":339,"Scaron":352,"scaron":353,"Yuml":376,"circ":710,"tilde":732,"ensp":8194,"emsp":8195,"thinsp":8201,"zwnj":8204,"zwj":8205,"lrm":8206,"rlm":8207,"ndash":8211,"mdash":8212,"lsquo":8216,"rsquo":8217,"sbquo":8218,"ldquo":8220,"rdquo":8221,"bdquo":8222,"dagger":8224,"Dagger":8225,"permil":8240,"lsaquo":8249,"rsaquo":8250,"euro":8364},escape:function(k){return qx.util.StringEscape.escape(k,qx.bom.String.FROM_CHARCODE);
},unescape:function(q){return qx.util.StringEscape.unescape(q,qx.bom.String.TO_CHARCODE);
},fromText:function(a){return qx.bom.String.escape(a).replace(/(  |\n)/g,function(i){var j={"  ":f,"\n":e};
return j[i]||i;
});
},toText:function(m){return qx.bom.String.unescape(m.replace(/\s+|<([^>])+>/gi,function(l){if(l.indexOf(g)===0){return c;
}else if(l.length>0&&l.replace(/^\s*/,h).replace(/\s*$/,h)==h){return d;
}else{return h;
}}));
}},defer:function(n,o,p){n.FROM_CHARCODE=qx.lang.Object.invert(n.TO_CHARCODE);
}});
})();
(function(){var g=";",f="&",e='X',d="",c='#',b="&#",a="qx.util.StringEscape";
qx.Class.define(a,{statics:{escape:function(m,n){var p,r=d;

for(var i=0,l=m.length;i<l;i++){var q=m.charAt(i);
var o=q.charCodeAt(0);

if(n[o]){p=f+n[o]+g;
}else{if(o>0x7F){p=b+o+g;
}else{p=q;
}}r+=p;
}return r;
},unescape:function(s,t){return s.replace(/&[#\w]+;/gi,function(h){var j=h;
var h=h.substring(1,h.length-1);
var k=t[h];

if(k){j=String.fromCharCode(k);
}else{if(h.charAt(0)==c){if(h.charAt(1).toUpperCase()==e){k=h.substring(2);
if(k.match(/^[0-9A-Fa-f]+$/gi)){j=String.fromCharCode(parseInt(k,16));
}}else{k=h.substring(1);
if(k.match(/^\d+$/gi)){j=String.fromCharCode(parseInt(k,10));
}}}}return j;
});
}}});
})();
(function(){var a="qx.util.format.IFormat";
qx.Interface.define(a,{members:{format:function(c){},parse:function(b){}}});
})();
(function(){var v="",u="Number",t="-",s="0",r="String",q="changeNumberFormat",p='(',o="g",n="Boolean",m="$",f="NaN",l='([0-9]{1,3}(?:',i='{0,1}[0-9]{3}){0,})',e='\\d+){0,1}',d="qx.util.format.NumberFormat",h="Infinity",g="^",j=".",c="-Infinity",k='([-+]){0,1}';
qx.Class.define(d,{extend:qx.core.Object,implement:qx.util.format.IFormat,construct:function(b){qx.core.Object.call(this);
this.__mx=b;
},statics:{getIntegerInstance:function(){var a=qx.util.format.NumberFormat;

if(a._integerInstance==null){a._integerInstance=new a();
a._integerInstance.setMaximumFractionDigits(0);
}return a._integerInstance;
},getInstance:function(){if(!this._instance){this._instance=new this;
}return this._instance;
}},properties:{minimumIntegerDigits:{check:u,init:0},maximumIntegerDigits:{check:u,nullable:true},minimumFractionDigits:{check:u,init:0},maximumFractionDigits:{check:u,nullable:true},groupingUsed:{check:n,init:true},prefix:{check:r,init:v,event:q},postfix:{check:r,init:v,event:q}},members:{__mx:null,format:function(w){switch(w){case Infinity:return h;
case -Infinity:return c;
case NaN:return f;
}var A=(w<0);

if(A){w=-w;
}
if(this.getMaximumFractionDigits()!=null){var H=Math.pow(10,this.getMaximumFractionDigits());
w=Math.round(w*H)/H;
}var G=String(Math.floor(w)).length;
var x=v+w;
var D=x.substring(0,G);

while(D.length<this.getMinimumIntegerDigits()){D=s+D;
}
if(this.getMaximumIntegerDigits()!=null&&D.length>this.getMaximumIntegerDigits()){D=D.substring(D.length-this.getMaximumIntegerDigits());
}var C=x.substring(G+1);

while(C.length<this.getMinimumFractionDigits()){C+=s;
}
if(this.getMaximumFractionDigits()!=null&&C.length>this.getMaximumFractionDigits()){C=C.substring(0,this.getMaximumFractionDigits());
}if(this.getGroupingUsed()){var z=D;
D=v;
var F;

for(F=z.length;F>3;F-=3){D=v+qx.locale.Number.getGroupSeparator(this.__mx)+z.substring(F-3,F)+D;
}D=z.substring(0,F)+D;
}var B=this.getPrefix()?this.getPrefix():v;
var y=this.getPostfix()?this.getPostfix():v;
var E=B+(A?t:v)+D;

if(C.length>0){E+=v+qx.locale.Number.getDecimalSeparator(this.__mx)+C;
}E+=y;
return E;
},parse:function(I){var N=qx.lang.String.escapeRegexpChars(qx.locale.Number.getGroupSeparator(this.__mx)+v);
var L=qx.lang.String.escapeRegexpChars(qx.locale.Number.getDecimalSeparator(this.__mx)+v);
var J=new RegExp(g+qx.lang.String.escapeRegexpChars(this.getPrefix())+k+l+N+i+p+L+e+qx.lang.String.escapeRegexpChars(this.getPostfix())+m);
var M=J.exec(I);

if(M==null){throw new Error("Number string '"+I+"' does not match the number format");
}var O=(M[1]==t);
var Q=M[2];
var P=M[3];
Q=Q.replace(new RegExp(N,o),v);
var K=(O?t:v)+Q;

if(P!=null&&P.length!=0){P=P.replace(new RegExp(L),v);
K+=j+P;
}return parseFloat(K);
}}});
})();
(function(){var e="cldr_number_decimal_separator",d="cldr_number_percent_format",c="qx.locale.Number",b="cldr_number_group_separator";
qx.Class.define(c,{statics:{getDecimalSeparator:function(f){return qx.locale.Manager.getInstance().localize(e,[],f);
},getGroupSeparator:function(a){return qx.locale.Manager.getInstance().localize(b,[],a);
},getPercentFormat:function(g){return qx.locale.Manager.getInstance().localize(d,[],g);
}}});
})();
(function(){var de="(\\d\\d?)",dd="format",dc="",db="abbreviated",da="wide",cY="(",cX=")",cW="|",cV="stand-alone",cU="wildcard",cJ="default",cI="literal",cH="'",cG="hour",cF="(\\d\\d?\\d?)",cE="ms",cD="narrow",cC="-",cB="quoted_literal",cA='a',dl="HH:mm:ss",dm="+",dj="HHmmss",dk="long",dh='z',di="0",df="sec",dg="day",dn='Z',dp=" ",cN="min",cM="mm",cP="(\\d+)",cO="h",cR="KK",cQ='L',cT="Z",cS="(\\d\\d+)",cL="EEEE",cK="^",bB=":",bC='y',bD="K",bE="a",bF="([\\+\\-]\\d\\d:?\\d\\d)",bG="GMT",bH="dd",bI="qx.util.format.DateFormat",bJ="yyy",bK="H",dt="YYYY",ds="y",dr="HH",dq="EE",dx='h',dw="S",dv='s',du='A',dz="yyyyyy",dy="kk",ck="ss",cl='H',ci='S',cj="MMMM",co='c',cp="d",cm="([a-zA-Z]+)",cn='k',cg="m",ch='Y',bS='D',bR="yyyyy",bU='K',bT="hh",bO="SSS",bN="MM",bQ="yy",bP="(\\d\\d\\d\\d\\d\\d+)",bM="yyyy-MM-dd HH:mm:ss",bL="(\\d\\d\\d\\d\\d+)",cu="short",cv='d',cw="unkown",cx='m',cq="(\\d\\d\\d\\d)",cr="(\\d\\d\\d+)",cs="k",ct='M',cy="(\\d\\d\\d\\d+)",cz="SS",cd="MMM",cc="s",cb="M",ca='w',bY="EEE",bX="$",bW="?",bV='E',cf="z",ce="yyyy";
qx.Class.define(bI,{extend:qx.core.Object,implement:qx.util.format.IFormat,construct:function(dF,dG){qx.core.Object.call(this);

if(!dG){this.__my=qx.locale.Manager.getInstance().getLocale();
}else{this.__my=dG;
}
if(dF!=null){this.__mz=dF.toString();
}else{this.__mz=qx.locale.Date.getDateFormat(dk,this.__my)+dp+qx.locale.Date.getDateTimeFormat(dj,dl,this.__my);
}},statics:{getDateTimeInstance:function(){var dI=qx.util.format.DateFormat;
var dH=qx.locale.Date.getDateFormat(dk)+dp+qx.locale.Date.getDateTimeFormat(dj,dl);

if(dI._dateInstance==null||dI._dateInstance.__mz!=dH){dI._dateTimeInstance=new dI();
}return dI._dateTimeInstance;
},getDateInstance:function(){var dO=qx.util.format.DateFormat;
var dN=qx.locale.Date.getDateFormat(cu)+dc;

if(dO._dateInstance==null||dO._dateInstance.__mz!=dN){dO._dateInstance=new dO(dN);
}return dO._dateInstance;
},ASSUME_YEAR_2000_THRESHOLD:30,LOGGING_DATE_TIME__format:bM,AM_MARKER:"am",PM_MARKER:"pm",MEDIUM_TIMEZONE_NAMES:["GMT"],FULL_TIMEZONE_NAMES:["Greenwich Mean Time"]},members:{__my:null,__mz:null,__mA:null,__mB:null,__mC:null,__mD:function(bo,bp){var bq=dc+bo;

while(bq.length<bp){bq=di+bq;
}return bq;
},__mE:function(a){var b=new Date(a.getTime());
var c=b.getDate();

while(b.getMonth()!=0){b.setDate(-1);
c+=b.getDate()+1;
}return c;
},__mF:function(bA){return new Date(bA.getTime()+(3-((bA.getDay()+6)%7))*86400000);
},__mG:function(dJ){var dL=this.__mF(dJ);
var dM=dL.getFullYear();
var dK=this.__mF(new Date(dM,0,4));
return Math.floor(1.5+(dL.getTime()-dK.getTime())/86400000/7);
},format:function(N){if(N==null){return null;
}var T=qx.util.format.DateFormat;
var U=this.__my;
var bf=N.getFullYear();
var Y=N.getMonth();
var bh=N.getDate();
var O=N.getDay();
var ba=N.getHours();
var V=N.getMinutes();
var bb=N.getSeconds();
var bd=N.getMilliseconds();
var bg=N.getTimezoneOffset();
var R=bg>0?1:-1;
var P=Math.floor(Math.abs(bg)/60);
var W=Math.abs(bg)%60;
this.__mH();
var be=dc;

for(var i=0;i<this.__mC.length;i++){var bc=this.__mC[i];

if(bc.type==cI){be+=bc.text;
}else{var S=bc.character;
var X=bc.size;
var Q=bW;

switch(S){case bC:case ch:if(X==2){Q=this.__mD(bf%100,2);
}else{Q=bf+dc;

if(X>Q.length){for(var i=Q.length;i<X;i++){Q=di+Q;
}}}break;
case bS:Q=this.__mD(this.__mE(N),X);
break;
case cv:Q=this.__mD(bh,X);
break;
case ca:Q=this.__mD(this.__mG(N),X);
break;
case bV:if(X==2){Q=qx.locale.Date.getDayName(cD,O,U,dd);
}else if(X==3){Q=qx.locale.Date.getDayName(db,O,U,dd);
}else if(X==4){Q=qx.locale.Date.getDayName(da,O,U,dd);
}break;
case co:if(X==2){Q=qx.locale.Date.getDayName(cD,O,U,cV);
}else if(X==3){Q=qx.locale.Date.getDayName(db,O,U,cV);
}else if(X==4){Q=qx.locale.Date.getDayName(da,O,U,cV);
}break;
case ct:if(X==1||X==2){Q=this.__mD(Y+1,X);
}else if(X==3){Q=qx.locale.Date.getMonthName(db,Y,U,dd);
}else if(X==4){Q=qx.locale.Date.getMonthName(da,Y,U,dd);
}break;
case cQ:if(X==1||X==2){Q=this.__mD(Y+1,X);
}else if(X==3){Q=qx.locale.Date.getMonthName(db,Y,U,cV);
}else if(X==4){Q=qx.locale.Date.getMonthName(da,Y,U,cV);
}break;
case cA:Q=(ba<12)?qx.locale.Date.getAmMarker(U):qx.locale.Date.getPmMarker(U);
break;
case cl:Q=this.__mD(ba,X);
break;
case cn:Q=this.__mD((ba==0)?24:ba,X);
break;
case bU:Q=this.__mD(ba%12,X);
break;
case dx:Q=this.__mD(((ba%12)==0)?12:(ba%12),X);
break;
case cx:Q=this.__mD(V,X);
break;
case dv:Q=this.__mD(bb,X);
break;
case ci:Q=this.__mD(bd,X);
break;
case dh:if(X==1){Q=bG+((R>0)?cC:dm)+this.__mD(Math.abs(P))+bB+this.__mD(W,2);
}else if(X==2){Q=T.MEDIUM_TIMEZONE_NAMES[P];
}else if(X==3){Q=T.FULL_TIMEZONE_NAMES[P];
}break;
case dn:Q=((R>0)?cC:dm)+this.__mD(Math.abs(P),2)+this.__mD(W,2);
break;
}be+=Q;
}}return be;
},parse:function(dP){this.__mI();
var dV=this.__mA.regex.exec(dP);

if(dV==null){throw new Error("Date string '"+dP+"' does not match the date format: "+this.__mz);
}var dQ={year:1970,month:0,day:1,hour:0,ispm:false,min:0,sec:0,ms:0};
var dR=1;

for(var i=0;i<this.__mA.usedRules.length;i++){var dT=this.__mA.usedRules[i];
var dS=dV[dR];

if(dT.field!=null){dQ[dT.field]=parseInt(dS,10);
}else{dT.manipulator(dQ,dS);
}dR+=(dT.groups==null)?1:dT.groups;
}var dU=new Date(dQ.year,dQ.month,dQ.day,(dQ.ispm)?(dQ.hour+12):dQ.hour,dQ.min,dQ.sec,dQ.ms);

if(dQ.month!=dU.getMonth()||dQ.year!=dU.getFullYear()){throw new Error("Error parsing date '"+dP+"': the value for day or month is too large");
}return dU;
},__mH:function(){if(this.__mC!=null){return;
}this.__mC=[];
var bv;
var bt=0;
var bx=dc;
var br=this.__mz;
var bu=cJ;
var i=0;

while(i<br.length){var bw=br.charAt(i);

switch(bu){case cB:if(bw==cH){if(i+1>=br.length){i++;
break;
}var bs=br.charAt(i+1);

if(bs==cH){bx+=bw;
i++;
}else{i++;
bu=cw;
}}else{bx+=bw;
i++;
}break;
case cU:if(bw==bv){bt++;
i++;
}else{this.__mC.push({type:cU,character:bv,size:bt});
bv=null;
bt=0;
bu=cJ;
}break;
default:if((bw>=cA&&bw<=dh)||(bw>=du&&bw<=dn)){bv=bw;
bu=cU;
}else if(bw==cH){if(i+1>=br.length){bx+=bw;
i++;
break;
}var bs=br.charAt(i+1);

if(bs==cH){bx+=bw;
i++;
}i++;
bu=cB;
}else{bu=cJ;
}
if(bu!=cJ){if(bx.length>0){this.__mC.push({type:cI,text:bx});
bx=dc;
}}else{bx+=bw;
i++;
}break;
}}if(bv!=null){this.__mC.push({type:cU,character:bv,size:bt});
}else if(bx.length>0){this.__mC.push({type:cI,text:bx});
}},__mI:function(){if(this.__mA!=null){return ;
}var C=this.__mz;
this.__mJ();
this.__mH();
var I=[];
var E=cK;

for(var A=0;A<this.__mC.length;A++){var J=this.__mC[A];

if(J.type==cI){E+=qx.lang.String.escapeRegexpChars(J.text);
}else{var B=J.character;
var F=J.size;
var D;

for(var K=0;K<this.__mB.length;K++){var G=this.__mB[K];

if(B==G.pattern.charAt(0)&&F==G.pattern.length){D=G;
break;
}}if(D==null){var H=dc;

for(var i=0;i<F;i++){H+=B;
}throw new Error("Malformed date format: "+C+". Wildcard "+H+" is not supported");
}else{I.push(D);
E+=D.regex;
}}}E+=bX;
var z;

try{z=new RegExp(E);
}catch(dE){throw new Error("Malformed date format: "+C);
}this.__mA={regex:z,"usedRules":I,pattern:E};
},__mJ:function(){var j=qx.util.format.DateFormat;
var p=qx.lang.String;

if(this.__mB!=null){return ;
}var k=this.__mB=[];
var w=function(dA,dB){dB=parseInt(dB,10);

if(dB<j.ASSUME_YEAR_2000_THRESHOLD){dB+=2000;
}else if(dB<100){dB+=1900;
}dA.year=dB;
};
var q=function(eb,ec){eb.month=parseInt(ec,10)-1;
};
var n=function(L,M){L.ispm=(M==j.PM_MARKER);
};
var m=function(bm,bn){bm.hour=parseInt(bn,10)%24;
};
var l=function(dY,ea){dY.hour=parseInt(ea,10)%12;
};
var t=function(dW,dX){return;
};
var r=qx.locale.Date.getMonthNames(db,this.__my,dd);

for(var i=0;i<r.length;i++){r[i]=p.escapeRegexpChars(r[i].toString());
}var s=function(dC,dD){dD=p.escapeRegexpChars(dD);
dC.month=r.indexOf(dD);
};
var f=qx.locale.Date.getMonthNames(da,this.__my,dd);

for(var i=0;i<f.length;i++){f[i]=p.escapeRegexpChars(f[i].toString());
}var e=function(x,y){y=p.escapeRegexpChars(y);
x.month=f.indexOf(y);
};
var h=qx.locale.Date.getDayNames(cD,this.__my,dd);

for(var i=0;i<h.length;i++){h[i]=p.escapeRegexpChars(h[i].toString());
}var d=function(bi,bj){bj=p.escapeRegexpChars(bj);
bi.month=h.indexOf(bj);
};
var u=qx.locale.Date.getDayNames(db,this.__my,dd);

for(var i=0;i<u.length;i++){u[i]=p.escapeRegexpChars(u[i].toString());
}var o=function(bk,bl){bl=p.escapeRegexpChars(bl);
bk.month=u.indexOf(bl);
};
var v=qx.locale.Date.getDayNames(da,this.__my,dd);

for(var i=0;i<v.length;i++){v[i]=p.escapeRegexpChars(v[i].toString());
}var g=function(by,bz){bz=p.escapeRegexpChars(bz);
by.month=v.indexOf(bz);
};
k.push({pattern:dt,regex:cq,manipulator:w});
k.push({pattern:ds,regex:cP,manipulator:w});
k.push({pattern:bQ,regex:cS,manipulator:w});
k.push({pattern:bJ,regex:cr,manipulator:w});
k.push({pattern:ce,regex:cy,manipulator:w});
k.push({pattern:bR,regex:bL,manipulator:w});
k.push({pattern:dz,regex:bP,manipulator:w});
k.push({pattern:cb,regex:de,manipulator:q});
k.push({pattern:bN,regex:de,manipulator:q});
k.push({pattern:cd,regex:cY+r.join(cW)+cX,manipulator:s});
k.push({pattern:cj,regex:cY+f.join(cW)+cX,manipulator:e});
k.push({pattern:bH,regex:de,field:dg});
k.push({pattern:cp,regex:de,field:dg});
k.push({pattern:dq,regex:cY+h.join(cW)+cX,manipulator:d});
k.push({pattern:bY,regex:cY+u.join(cW)+cX,manipulator:o});
k.push({pattern:cL,regex:cY+v.join(cW)+cX,manipulator:g});
k.push({pattern:bE,regex:cY+j.AM_MARKER+cW+j.PM_MARKER+cX,manipulator:n});
k.push({pattern:dr,regex:de,field:cG});
k.push({pattern:bK,regex:de,field:cG});
k.push({pattern:dy,regex:de,manipulator:m});
k.push({pattern:cs,regex:de,manipulator:m});
k.push({pattern:cR,regex:de,field:cG});
k.push({pattern:bD,regex:de,field:cG});
k.push({pattern:bT,regex:de,manipulator:l});
k.push({pattern:cO,regex:de,manipulator:l});
k.push({pattern:cM,regex:de,field:cN});
k.push({pattern:cg,regex:de,field:cN});
k.push({pattern:ck,regex:de,field:df});
k.push({pattern:cc,regex:de,field:df});
k.push({pattern:bO,regex:cF,field:cE});
k.push({pattern:cz,regex:cF,field:cE});
k.push({pattern:dw,regex:cF,field:cE});
k.push({pattern:cT,regex:bF,manipulator:t});
k.push({pattern:cf,regex:cm,manipulator:t});
}},destruct:function(){this.__mC=this.__mA=this.__mB=null;
}});
})();
(function(){var y="_",x="format",w="thu",v="sat",u="cldr_day_",t="cldr_month_",s="wed",r="fri",q="tue",p="mon",P="sun",O="short",N="HH:mm",M="HHmmsszz",L="HHmm",K="HHmmss",J="cldr_date_format_",I="HH:mm:ss zz",H="full",G="cldr_pm",E="long",F="medium",C="cldr_am",D="qx.locale.Date",A="cldr_date_time_format_",B="cldr_time_format_",z="HH:mm:ss";
qx.Class.define(D,{statics:{__mK:qx.locale.Manager.getInstance(),getAmMarker:function(n){return this.__mK.localize(C,[],n);
},getPmMarker:function(o){return this.__mK.localize(G,[],o);
},getDayNames:function(length,d,e){var e=e?e:x;
{};
var g=[P,p,q,s,w,r,v];
var h=[];

for(var i=0;i<g.length;i++){var f=u+e+y+length+y+g[i];
h.push(this.__mK.localize(f,[],d));
}return h;
},getDayName:function(length,bt,bu,bv){var bv=bv?bv:x;
{};
var bx=[P,p,q,s,w,r,v];
var bw=u+bv+y+length+y+bx[bt];
return this.__mK.localize(bw,[],bu);
},getMonthNames:function(length,bp,bq){var bq=bq?bq:x;
{};
var bs=[];

for(var i=0;i<12;i++){var br=t+bq+y+length+y+(i+1);
bs.push(this.__mK.localize(br,[],bp));
}return bs;
},getMonthName:function(length,Q,R,S){var S=S?S:x;
{};
var T=t+S+y+length+y+(Q+1);
return this.__mK.localize(T,[],R);
},getDateFormat:function(bm,bn){{};
var bo=J+bm;
return this.__mK.localize(bo,[],bn);
},getDateTimeFormat:function(bh,bi,bj){var bl=A+bh;
var bk=this.__mK.localize(bl,[],bj);

if(bk==bl){bk=bi;
}return bk;
},getTimeFormat:function(X,Y){{};
var bb=B+X;
var ba=this.__mK.localize(bb,[],Y);

if(ba!=bb){return ba;
}
switch(X){case O:case F:return qx.locale.Date.getDateTimeFormat(L,N);
case E:return qx.locale.Date.getDateTimeFormat(K,z);
case H:return qx.locale.Date.getDateTimeFormat(M,I);
default:throw new Error("This case should never happen.");
}},getWeekStart:function(a){var b={"MV":5,"AE":6,"AF":6,"BH":6,"DJ":6,"DZ":6,"EG":6,"ER":6,"ET":6,"IQ":6,"IR":6,"JO":6,"KE":6,"KW":6,"LB":6,"LY":6,"MA":6,"OM":6,"QA":6,"SA":6,"SD":6,"SO":6,"TN":6,"YE":6,"AS":0,"AU":0,"AZ":0,"BW":0,"CA":0,"CN":0,"FO":0,"GE":0,"GL":0,"GU":0,"HK":0,"IE":0,"IL":0,"IS":0,"JM":0,"JP":0,"KG":0,"KR":0,"LA":0,"MH":0,"MN":0,"MO":0,"MP":0,"MT":0,"NZ":0,"PH":0,"PK":0,"SG":0,"TH":0,"TT":0,"TW":0,"UM":0,"US":0,"UZ":0,"VI":0,"ZA":0,"ZW":0,"MW":0,"NG":0,"TJ":0};
var c=qx.locale.Date._getTerritory(a);
return b[c]!=null?b[c]:1;
},getWeekendStart:function(bc){var be={"EG":5,"IL":5,"SY":5,"IN":0,"AE":4,"BH":4,"DZ":4,"IQ":4,"JO":4,"KW":4,"LB":4,"LY":4,"MA":4,"OM":4,"QA":4,"SA":4,"SD":4,"TN":4,"YE":4};
var bd=qx.locale.Date._getTerritory(bc);
return be[bd]!=null?be[bd]:6;
},getWeekendEnd:function(U){var V={"AE":5,"BH":5,"DZ":5,"IQ":5,"JO":5,"KW":5,"LB":5,"LY":5,"MA":5,"OM":5,"QA":5,"SA":5,"SD":5,"TN":5,"YE":5,"AF":5,"IR":5,"EG":6,"IL":6,"SY":6};
var W=qx.locale.Date._getTerritory(U);
return V[W]!=null?V[W]:0;
},isWeekend:function(j,k){var m=qx.locale.Date.getWeekendStart(k);
var l=qx.locale.Date.getWeekendEnd(k);

if(l>m){return ((j>=m)&&(j<=l));
}else{return ((j>=m)||(j<=l));
}},_getTerritory:function(bf){if(bf){var bg=bf.split(y)[1]||bf;
}else{bg=this.__mK.getTerritory()||this.__mK.getLanguage();
}return bg.toUpperCase();
}}});
})();
(function(){var k="Boolean",j="invalid",i="qx.ui.form.MForm",h="_applyValid",g="",f="changeRequired",e="changeValid",d="changeInvalidMessage",c="String";
qx.Mixin.define(i,{properties:{valid:{check:k,init:true,apply:h,event:e},required:{check:k,init:false,event:f},invalidMessage:{check:c,init:g,event:d}},members:{_applyValid:function(a,b){a?this.removeState(j):this.addState(j);
}}});
})();
(function(){var E="showingPlaceholder",D="color",C="",B="none",A="qx.client",z="qx.dynlocale",y="Boolean",x="qx.event.type.Data",w="readonly",v="input",bu="focusin",bt="visibility",bs="focusout",br="changeLocale",bq="hidden",bp="on",bo="absolute",bn="readOnly",bm="text",bl="_applyTextAlign",L="px",M="RegExp",J=")",K="syncAppearance",H="changeValue",I="gecko",F="A",G="change",P="textAlign",Q="focused",Y="center",W="visible",bd="disabled",bb="url(",bh="off",bf="String",S="resize",bk="qx.ui.form.AbstractField",bj="transparent",bi="spellcheck",R="false",U="right",V="PositiveInteger",X="mshtml",ba="abstract",bc="block",be="webkit",bg="_applyReadOnly",N="_applyPlaceholder",O="left",T="qx/static/blank.gif";
qx.Class.define(bk,{extend:qx.ui.core.Widget,implement:[qx.ui.form.IStringForm,qx.ui.form.IForm],include:[qx.ui.form.MForm],type:ba,construct:function(bI){qx.ui.core.Widget.call(this);

if(bI!=null){this.setValue(bI);
}this.getContentElement().addListener(G,this._onChangeContent,this);
this.addListener(K,this._syncPlaceholder,this);
if(qx.core.Variant.isSet(z,bp)){qx.locale.Manager.getInstance().addListener(br,this._onChangeLocale,this);
}},events:{"input":x,"changeValue":x},properties:{textAlign:{check:[O,Y,U],nullable:true,themeable:true,apply:bl},readOnly:{check:y,apply:bg,init:false},selectable:{refine:true,init:true},focusable:{refine:true,init:true},maxLength:{check:V,init:Infinity},liveUpdate:{check:y,init:false},placeholder:{check:bf,nullable:true,apply:N},filter:{check:M,nullable:true,init:null}},members:{__mL:true,__mM:null,__mN:null,__mO:null,getFocusElement:function(){var bv=this.getContentElement();

if(bv){return bv;
}},_createInputElement:function(){return new qx.html.Input(bm);
},renderLayout:function(m,top,n,o){var p=this._updateInsets;
var t=qx.ui.core.Widget.prototype.renderLayout.call(this,m,top,n,o);
if(!t){return;
}var r=t.size||p;
var u=L;

if(r||t.local||t.margin){var q=this.getInsets();
var innerWidth=n-q.left-q.right;
var innerHeight=o-q.top-q.bottom;
innerWidth=innerWidth<0?0:innerWidth;
innerHeight=innerHeight<0?0:innerHeight;
}var s=this.getContentElement();

if(p){this.__mR().setStyles({"left":q.left+u,"top":q.top+u});
}
if(r){this.__mR().setStyles({"width":innerWidth+u,"height":innerHeight+u});
s.setStyles({"width":innerWidth+u,"height":innerHeight+u});
}},_createContentElement:function(){var bQ=this._createInputElement();
bQ.setStyles({"border":B,"padding":0,"margin":0,"display":bc,"background":bj,"outline":B,"appearance":B,"position":bo,"autoComplete":bh});
bQ.setSelectable(this.getSelectable());
bQ.setEnabled(this.getEnabled());
bQ.addListener(v,this._onHtmlInput,this);
if(qx.core.Variant.isSet(A,I)){bQ.setAttribute(bi,R);
}if(qx.core.Variant.isSet(A,be)){bQ.setStyle(S,B);
}if(qx.core.Variant.isSet(A,X)){bQ.setStyles({backgroundImage:bb+qx.util.ResourceManager.getInstance().toUri(T)+J});
}return bQ;
},_applyEnabled:function(bC,bD){qx.ui.core.Widget.prototype._applyEnabled.call(this,bC,bD);
this.getContentElement().setEnabled(bC);

if(bC){this._showPlaceholder();
}else{this._removePlaceholder();
}},__mP:{width:16,height:16},_getContentHint:function(){return {width:this.__mP.width*10,height:this.__mP.height||16};
},_applyFont:function(bw,bx){var by;

if(bw){var bz=qx.theme.manager.Font.getInstance().resolve(bw);
by=bz.getStyles();
}else{by=qx.bom.Font.getDefaultStyles();
}this.getContentElement().setStyles(by);
this.__mR().setStyles(by);
if(bw){this.__mP=qx.bom.Label.getTextSize(F,by);
}else{delete this.__mP;
}qx.ui.core.queue.Layout.add(this);
},_applyTextColor:function(g,h){if(g){this.getContentElement().setStyle(D,qx.theme.manager.Color.getInstance().resolve(g));
this.__mR().setStyle(D,qx.theme.manager.Color.getInstance().resolve(g));
}else{this.getContentElement().removeStyle(D);
this.__mR().removeStyle(D);
}},tabFocus:function(){qx.ui.core.Widget.prototype.tabFocus.call(this);
this.selectAllText();
},_getTextSize:function(){return this.__mP;
},_onHtmlInput:function(e){var bM=e.getData();
var bL=true;
this.__mL=false;
if(this.getFilter()!=null){var bN=C;
var bJ=bM.search(this.getFilter());
var bK=bM;

while(bJ>=0){bN=bN+(bK.charAt(bJ));
bK=bK.substring(bJ+1,bK.length);
bJ=bK.search(this.getFilter());
}
if(bN!=bM){bL=false;
bM=bN;
this.getContentElement().setValue(bM);
}}if(bM.length>this.getMaxLength()){var bL=false;
this.getContentElement().setValue(bM.substr(0,this.getMaxLength()));
}if(bL){this.fireDataEvent(v,bM,this.__mO);
this.__mO=bM;
if(this.getLiveUpdate()){this.__mQ(bM);
}}},__mQ:function(bO){this.fireNonBubblingEvent(H,qx.event.type.Data,[bO,this.__mN]);
this.__mN=bO;
},setValue:function(bE){if(bE===null){if(this.__mL){return bE;
}bE=C;
this.__mL=true;
}else{this.__mL=false;
this._removePlaceholder();
}
if(qx.lang.Type.isString(bE)){var bG=this.getContentElement();

if(bE.length>this.getMaxLength()){bE=bE.substr(0,this.getMaxLength());
}
if(bG.getValue()!=bE){var bH=bG.getValue();
bG.setValue(bE);
var bF=this.__mL?null:bE;
this.__mN=bH;
this.__mQ(bF);
}this._showPlaceholder();
return bE;
}throw new Error("Invalid value type: "+bE);
},getValue:function(){var bP=this.getContentElement().getValue();
return this.__mL?null:bP;
},resetValue:function(){this.setValue(null);
},_onChangeContent:function(e){this.__mL=e.getData()===null;
this.__mQ(e.getData());
},getTextSelection:function(){return this.getContentElement().getTextSelection();
},getTextSelectionLength:function(){return this.getContentElement().getTextSelectionLength();
},getTextSelectionStart:function(){return this.getContentElement().getTextSelectionStart();
},getTextSelectionEnd:function(){return this.getContentElement().getTextSelectionEnd();
},setTextSelection:function(bA,bB){this.getContentElement().setTextSelection(bA,bB);
},clearTextSelection:function(){this.getContentElement().clearTextSelection();
},selectAllText:function(){this.setTextSelection(0);
},_showPlaceholder:function(){var j=this.getValue()||C;
var i=this.getPlaceholder();

if(i!=null&&j==C&&!this.hasState(Q)&&!this.hasState(bd)){if(this.hasState(E)){this._syncPlaceholder();
}else{this.addState(E);
}}},_removePlaceholder:function(){if(this.hasState(E)){this.__mR().setStyle(bt,bq);
this.removeState(E);
}},_syncPlaceholder:function(){if(this.hasState(E)){this.__mR().setStyle(bt,W);
}},__mR:function(){if(this.__mM==null){this.__mM=new qx.html.Label();
this.__mM.setStyles({"visibility":bq,"zIndex":6,"position":bo});
this.getContainerElement().add(this.__mM);
}return this.__mM;
},_onChangeLocale:qx.core.Variant.select(z,{"on":function(e){var content=this.getPlaceholder();

if(content&&content.translate){this.setPlaceholder(content.translate());
}},"off":null}),_applyPlaceholder:function(a,b){this.__mR().setValue(a);

if(a!=null){this.addListener(bu,this._removePlaceholder,this);
this.addListener(bs,this._showPlaceholder,this);
this._showPlaceholder();
}else{this.removeListener(bu,this._removePlaceholder,this);
this.removeListener(bs,this._showPlaceholder,this);
this._removePlaceholder();
}},_applyTextAlign:function(k,l){this.getContentElement().setStyle(P,k);
},_applyReadOnly:function(c,d){var f=this.getContentElement();
f.setAttribute(bn,c);

if(c){this.addState(w);
this.setFocusable(false);
}else{this.removeState(w);
this.setFocusable(true);
}}},destruct:function(){this.__mM=null;

if(qx.core.Variant.isSet(z,bp)){qx.locale.Manager.getInstance().removeListener(br,this._onChangeLocale,this);
}}});
})();
(function(){var b="qx.ui.form.TextField",a="textfield";
qx.Class.define(b,{extend:qx.ui.form.AbstractField,properties:{appearance:{refine:true,init:a},allowGrowY:{refine:true,init:false},allowShrinkY:{refine:true,init:false}}});
})();
(function(){var u="none",t="wrap",s="value",r="qx.client",q="textarea",p="off",o="on",n="qxSelectable",m="",l="webkit",h="input",k="qx.html.Input",j="select",g="disabled",f="read-only",i="userSelect";
qx.Class.define(k,{extend:qx.html.Element,construct:function(v,w,x){if(v===j||v===q){var y=v;
}else{y=h;
}qx.html.Element.call(this,y,w,x);
this.__mS=v;
},members:{__mS:null,__mT:null,__mU:null,_createDomElement:function(){return qx.bom.Input.create(this.__mS);
},_applyProperty:function(name,A){qx.html.Element.prototype._applyProperty.call(this,name,A);
var B=this.getDomElement();

if(name===s){qx.bom.Input.setValue(B,A);
}else if(name===t){qx.bom.Input.setWrap(B,A);
}},setEnabled:qx.core.Variant.select(r,{"webkit":function(C){this.__mU=C;

if(!C){this.setStyles({"userModify":f,"userSelect":u});
}else{this.setStyles({"userModify":null,"userSelect":this.__mT?null:u});
}},"default":function(b){this.setAttribute(g,b===false);
}}),setSelectable:qx.core.Variant.select(r,{"webkit":function(d){this.__mT=d;
this.setAttribute(n,d?o:p);
if(qx.core.Variant.isSet(r,l)){var e=this.__mU?d?null:u:u;
this.setStyle(i,e);
}},"default":function(z){this.setAttribute(n,z?o:p);
}}),setValue:function(D){var E=this.getDomElement();

if(E){if(E.value!=D){qx.bom.Input.setValue(E,D);
}}else{this._setProperty(s,D);
}return this;
},getValue:function(){var c=this.getDomElement();

if(c){return qx.bom.Input.getValue(c);
}return this._getProperty(s)||m;
},setWrap:function(a){if(this.__mS===q){this._setProperty(t,a);
}else{throw new Error("Text wrapping is only support by textareas!");
}return this;
},getWrap:function(){if(this.__mS===q){return this._getProperty(t);
}else{throw new Error("Text wrapping is only support by textareas!");
}}}});
})();
(function(){var ba="change",Y="input",X="qx.client",W="text",V="password",U="checkbox",T="radio",S="textarea",R="keypress",Q="opera",K="propertychange",P="blur",N="keydown",J="keyup",I="select-multiple",M="checked",L="value",O="select",H="qx.event.handler.Input";
qx.Class.define(H,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(){qx.core.Object.call(this);
this._onChangeCheckedWrapper=qx.lang.Function.listener(this._onChangeChecked,this);
this._onChangeValueWrapper=qx.lang.Function.listener(this._onChangeValue,this);
this._onInputWrapper=qx.lang.Function.listener(this._onInput,this);
this._onPropertyWrapper=qx.lang.Function.listener(this._onProperty,this);
if(qx.core.Variant.isSet(X,Q)){this._onKeyDownWrapper=qx.lang.Function.listener(this._onKeyDown,this);
this._onKeyUpWrapper=qx.lang.Function.listener(this._onKeyUp,this);
this._onBlurWrapper=qx.lang.Function.listener(this._onBlur,this);
}},statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{input:1,change:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:false},members:{__mV:false,__mW:null,__mX:null,canHandleEvent:function(bb,bc){var bd=bb.tagName.toLowerCase();

if(bc===Y&&(bd===Y||bd===S)){return true;
}
if(bc===ba&&(bd===Y||bd===S||bd===O)){return true;
}return false;
},registerEvent:qx.core.Variant.select(X,{"mshtml":function(u,v,w){if(!u.__mY){var x=u.tagName.toLowerCase();
var y=u.type;

if(y===W||y===V||x===S||y===U||y===T){qx.bom.Event.addNativeListener(u,K,this._onPropertyWrapper);
}
if(y!==U&&y!==T){qx.bom.Event.addNativeListener(u,ba,this._onChangeValueWrapper);
}
if(y===W||y===V){this._onKeyPressWrapped=qx.lang.Function.listener(this._onKeyPress,this,u);
qx.bom.Event.addNativeListener(u,R,this._onKeyPressWrapped);
}u.__mY=true;
}},"default":function(j,k,m){if(k===Y){this.__na(j);
}else if(k===ba){if(j.type===T||j.type===U){qx.bom.Event.addNativeListener(j,ba,this._onChangeCheckedWrapper);
}else{qx.bom.Event.addNativeListener(j,ba,this._onChangeValueWrapper);
}if(qx.core.Variant.isSet(X,Q)){if(j.type===W||j.type===V){this._onKeyPressWrapped=qx.lang.Function.listener(this._onKeyPress,this,j);
qx.bom.Event.addNativeListener(j,R,this._onKeyPressWrapped);
}}}}}),__na:qx.core.Variant.select(X,{"mshtml":null,"webkit":function(s){var t=s.tagName.toLowerCase();
if(qx.bom.client.Engine.VERSION<532&&t==S){qx.bom.Event.addNativeListener(s,R,this._onInputWrapper);
}qx.bom.Event.addNativeListener(s,Y,this._onInputWrapper);
},"opera":function(c){qx.bom.Event.addNativeListener(c,J,this._onKeyUpWrapper);
qx.bom.Event.addNativeListener(c,N,this._onKeyDownWrapper);
qx.bom.Event.addNativeListener(c,P,this._onBlurWrapper);
qx.bom.Event.addNativeListener(c,Y,this._onInputWrapper);
},"default":function(G){qx.bom.Event.addNativeListener(G,Y,this._onInputWrapper);
}}),unregisterEvent:qx.core.Variant.select(X,{"mshtml":function(B,C){if(B.__mY){var D=B.tagName.toLowerCase();
var E=B.type;

if(E===W||E===V||D===S||E===U||E===T){qx.bom.Event.removeNativeListener(B,K,this._onPropertyWrapper);
}
if(E!==U&&E!==T){qx.bom.Event.removeNativeListener(B,ba,this._onChangeValueWrapper);
}
if(E===W||E===V){qx.bom.Event.removeNativeListener(B,R,this._onKeyPressWrapped);
}
try{delete B.__mY;
}catch(be){B.__mY=null;
}}},"default":function(q,r){if(r===Y){this.__na(q);
}else if(r===ba){if(q.type===T||q.type===U){qx.bom.Event.removeNativeListener(q,ba,this._onChangeCheckedWrapper);
}else{qx.bom.Event.removeNativeListener(q,ba,this._onChangeValueWrapper);
}}
if(qx.core.Variant.isSet(X,Q)){if(q.type===W||q.type===V){qx.bom.Event.removeNativeListener(q,R,this._onKeyPressWrapped);
}}}}),__nb:qx.core.Variant.select(X,{"mshtml":null,"webkit":function(d){var f=d.tagName.toLowerCase();
if(qx.bom.client.Engine.VERSION<532&&f==S){qx.bom.Event.removeNativeListener(d,R,this._onInputWrapper);
}qx.bom.Event.removeNativeListener(d,Y,this._onInputWrapper);
},"opera":function(n){qx.bom.Event.removeNativeListener(n,J,this._onKeyUpWrapper);
qx.bom.Event.removeNativeListener(n,N,this._onKeyDownWrapper);
qx.bom.Event.removeNativeListener(n,P,this._onBlurWrapper);
qx.bom.Event.removeNativeListener(n,Y,this._onInputWrapper);
},"default":function(bf){qx.bom.Event.removeNativeListener(bf,Y,this._onInputWrapper);
}}),_onKeyPress:qx.core.Variant.select(X,{"mshtml|opera":function(e,p){if(e.keyCode===13){if(p.value!==this.__mX){this.__mX=p.value;
qx.event.Registration.fireEvent(p,ba,qx.event.type.Data,[p.value]);
}}},"default":null}),_onKeyDown:qx.core.Variant.select(X,{"opera":function(e){if(e.keyCode===13){this.__mV=true;
}},"default":null}),_onKeyUp:qx.core.Variant.select(X,{"opera":function(e){if(e.keyCode===13){this.__mV=false;
}},"default":null}),_onBlur:qx.core.Variant.select(X,{"opera":function(e){if(this.__mW){window.clearTimeout(this.__mW);
}},"default":null}),_onInput:qx.event.GlobalError.observeMethod(function(e){var F=e.target;
if(!this.__mV){if(qx.core.Variant.isSet(X,Q)){this.__mW=window.setTimeout(function(){qx.event.Registration.fireEvent(F,Y,qx.event.type.Data,[F.value]);
},0);
}else{qx.event.Registration.fireEvent(F,Y,qx.event.type.Data,[F.value]);
}}}),_onChangeValue:qx.event.GlobalError.observeMethod(function(e){var b=e.target||e.srcElement;
var a=b.value;

if(b.type===I){var a=[];

for(var i=0,o=b.options,l=o.length;i<l;i++){if(o[i].selected){a.push(o[i].value);
}}}qx.event.Registration.fireEvent(b,ba,qx.event.type.Data,[a]);
}),_onChangeChecked:qx.event.GlobalError.observeMethod(function(e){var z=e.target;

if(z.type===T){if(z.checked){qx.event.Registration.fireEvent(z,ba,qx.event.type.Data,[z.value]);
}}else{qx.event.Registration.fireEvent(z,ba,qx.event.type.Data,[z.checked]);
}}),_onProperty:qx.core.Variant.select(X,{"mshtml":qx.event.GlobalError.observeMethod(function(e){var g=e.target||e.srcElement;
var h=e.propertyName;

if(h===L&&(g.type===W||g.type===V||g.tagName.toLowerCase()===S)){if(!g.__inValueSet){qx.event.Registration.fireEvent(g,Y,qx.event.type.Data,[g.value]);
}}else if(h===M){if(g.type===U){qx.event.Registration.fireEvent(g,ba,qx.event.type.Data,[g.checked]);
}else if(g.checked){qx.event.Registration.fireEvent(g,ba,qx.event.type.Data,[g.value]);
}}}),"default":function(){}})},defer:function(A){qx.event.Registration.addHandler(A);
}});
})();
(function(){var S="",R="select",Q="soft",P="off",O="qx.client",N="wrap",M="text",L="mshtml",K="number",J="checkbox",C="select-one",I="input",F="option",B="value",A="radio",E="qx.bom.Input",D="nowrap",G="textarea",z="auto",H="normal";
qx.Class.define(E,{statics:{__nc:{text:1,textarea:1,select:1,checkbox:1,radio:1,password:1,hidden:1,submit:1,image:1,file:1,search:1,reset:1,button:1},create:function(k,m,n){{};
var m=m?qx.lang.Object.clone(m):{};
var o;

if(k===G||k===R){o=k;
}else{o=I;
m.type=k;
}return qx.bom.Element.create(o,m,n);
},setValue:function(a,b){var g=a.nodeName.toLowerCase();
var d=a.type;
var Array=qx.lang.Array;
var h=qx.lang.Type;

if(typeof b===K){b+=S;
}
if((d===J||d===A)){if(h.isArray(b)){a.checked=Array.contains(b,a.value);
}else{a.checked=a.value==b;
}}else if(g===R){var c=h.isArray(b);
var j=a.options;
var e,f;

for(var i=0,l=j.length;i<l;i++){e=j[i];
f=e.getAttribute(B);

if(f==null){f=e.text;
}e.selected=c?Array.contains(b,f):b==f;
}
if(c&&b.length==0){a.selectedIndex=-1;
}}else if(d===M&&qx.core.Variant.isSet(O,L)){a.__nd=true;
a.value=b;
a.__nd=null;
}else{a.value=b;
}},getValue:function(p){var v=p.nodeName.toLowerCase();

if(v===F){return (p.attributes.value||{}).specified?p.value:p.text;
}
if(v===R){var q=p.selectedIndex;
if(q<0){return null;
}var w=[];
var y=p.options;
var x=p.type==C;
var u=qx.bom.Input;
var t;
for(var i=x?q:0,s=x?q+1:y.length;i<s;i++){var r=y[i];

if(r.selected){t=u.getValue(r);
if(x){return t;
}w.push(t);
}}return w;
}else{return (p.value||S).replace(/\r/g,S);
}},setWrap:qx.core.Variant.select(O,{"mshtml":function(T,U){T.wrap=U?Q:P;
},"gecko|webkit":function(X,Y){var bb=Y?Q:P;
var ba=Y?S:z;
X.setAttribute(N,bb);
X.style.overflow=ba;
},"default":function(V,W){V.style.whiteSpace=W?H:D;
}})}});
})();
(function(){var bx="",bw="Number",bv='</div>',bu='" ',bt="paneUpdated",bs='<div>',br="</div>",bq="overflow: hidden;",bp="qx.event.type.Data",bo="paneReloadsData",bP="div",bO='style="',bN="_applyMaxCacheLines",bM="qx.ui.table.pane.Pane",bL="width: 100%;",bK="qx.event.type.Event",bJ="_applyVisibleRowCount",bI='>',bH="line-height: ",bG="appear",bE='class="',bF="width:100%;",bC="px;",bD='<div ',bA="'>",bB="_applyFirstVisibleRow",by="<div style='",bz=";position:relative;";
qx.Class.define(bM,{extend:qx.ui.core.Widget,construct:function(e){qx.ui.core.Widget.call(this);
this.__ne=e;
this.__nf=0;
this.__ng=0;
this.__nh=[];
},events:{"paneReloadsData":bp,"paneUpdated":bK},properties:{firstVisibleRow:{check:bw,init:0,apply:bB},visibleRowCount:{check:bw,init:0,apply:bJ},maxCacheLines:{check:bw,init:1000,apply:bN},allowShrinkX:{refine:true,init:false}},members:{__ng:null,__nf:null,__ne:null,__ni:null,__nj:null,__nk:null,__nh:null,__nl:0,_applyFirstVisibleRow:function(f,g){this.updateContent(false,f-g);
},_applyVisibleRowCount:function(cf,cg){this.updateContent(true);
},_getContentHint:function(){return {width:this.getPaneScroller().getTablePaneModel().getTotalWidth(),height:400};
},getPaneScroller:function(){return this.__ne;
},getTable:function(){return this.__ne.getTable();
},setFocusedCell:function(a,b,c){if(a!=this.__nk||b!=this.__nj){var d=this.__nj;
this.__nk=a;
this.__nj=b;
if(b!=d&&!c){if(d!==null){this.updateContent(false,null,d,true);
}
if(b!==null){this.updateContent(false,null,b,true);
}}}},onSelectionChanged:function(){this.updateContent(false,null,null,true);
},onFocusChanged:function(){this.updateContent(false,null,null,true);
},setColumnWidth:function(bV,bW){this.updateContent(true);
},onColOrderChanged:function(){this.updateContent(true);
},onPaneModelChanged:function(){this.updateContent(true);
},onTableModelDataChanged:function(ct,cu,cv,cw){this.__nm();
var cy=this.getFirstVisibleRow();
var cx=this.getVisibleRowCount();

if(cu==-1||cu>=cy&&ct<cy+cx){this.updateContent();
}},onTableModelMetaDataChanged:function(){this.updateContent(true);
},_applyMaxCacheLines:function(bm,bn){if(this.__nl>=bm&&bm!==-1){this.__nm();
}},__nm:function(){this.__nh=[];
this.__nl=0;
},__nn:function(bX,bY,ca){if(!bY&&!ca&&this.__nh[bX]){return this.__nh[bX];
}else{return null;
}},__no:function(bQ,bR,bS,bT){var bU=this.getMaxCacheLines();

if(!bS&&!bT&&!this.__nh[bQ]&&bU>0){this._applyMaxCacheLines(bU);
this.__nh[bQ]=bR;
this.__nl+=1;
}},updateContent:function(cb,cc,cd,ce){if(cb){this.__nm();
}if(cc&&Math.abs(cc)<=Math.min(10,this.getVisibleRowCount())){this._scrollContent(cc);
}else if(ce&&!this.getTable().getAlwaysUpdateCells()){this._updateRowStyles(cd);
}else{this._updateAllRows();
}},_updateRowStyles:function(j){var n=this.getContentElement().getDomElement();

if(!n||!n.firstChild){this._updateAllRows();
return;
}var r=this.getTable();
var l=r.getSelectionModel();
var o=r.getTableModel();
var s=r.getDataRowRenderer();
var m=n.firstChild.childNodes;
var q={table:r};
var t=this.getFirstVisibleRow();
var y=0;
var k=m.length;

if(j!=null){var p=j-t;

if(p>=0&&p<k){t=j;
y=p;
k=p+1;
}else{return;
}}
for(;y<k;y++,t++){q.row=t;
q.selected=l.isSelectedIndex(t);
q.focusedRow=(this.__nj==t);
q.rowData=o.getRowData(t);
s.updateDataRowElement(q,m[y]);
}},_getRowsHtml:function(J,K){var Q=this.getTable();
var T=Q.getSelectionModel();
var N=Q.getTableModel();
var O=Q.getTableColumnModel();
var bi=this.getPaneScroller().getTablePaneModel();
var Y=Q.getDataRowRenderer();
N.prefetchRows(J,J+K-1);
var bf=Q.getRowHeight();
var bh=bi.getColumnCount();
var P=0;
var M=[];
for(var x=0;x<bh;x++){var bk=bi.getColumnAtX(x);
var S=O.getColumnWidth(bk);
M.push({col:bk,xPos:x,editable:N.isColumnEditable(bk),focusedCol:this.__nk==bk,styleLeft:P,styleWidth:S});
P+=S;
}var bj=[];
var bl=false;

for(var R=J;R<J+K;R++){var U=T.isSelectedIndex(R);
var X=(this.__nj==R);
var bc=this.__nn(R,U,X);

if(bc){bj.push(bc);
continue;
}var bb=[];
var be={table:Q};
be.styleHeight=bf;
be.row=R;
be.selected=U;
be.focusedRow=X;
be.rowData=N.getRowData(R);

if(!be.rowData){bl=true;
}bb.push(bD);
var L=Y.getRowClass(be);

if(L){bb.push(bE,L,bu);
}var ba=Y.createRowStyle(be);
ba+=bz+Y.getRowHeightStyle(bf)+bF;

if(ba){bb.push(bO,ba,bu);
}bb.push(bI);

for(var x=0;x<bh;x++){var V=M[x];

for(var bg in V){be[bg]=V[bg];
}var bk=be.col;
be.value=N.getValue(bk,R);
var W=O.getDataCellRenderer(bk);
W.createDataCellHtml(be,bb);
}bb.push(bv);
var bd=bb.join(bx);
this.__no(R,bd,U,X);
bj.push(bd);
}this.fireDataEvent(bo,bl);
return bj.join(bx);
},_scrollContent:function(u){var v=this.getContentElement().getDomElement();

if(!(v&&v.firstChild)){this._updateAllRows();
return;
}var G=v.firstChild;
var w=G.childNodes;
var E=this.getVisibleRowCount();
var D=this.getFirstVisibleRow();
var B=this.getTable().getTableModel();
var H=0;
H=B.getRowCount();
if(D+E>H){this._updateAllRows();
return;
}var I=u<0?E+u:0;
var z=u<0?0:E-u;

for(i=Math.abs(u)-1;i>=0;i--){var C=w[I];

try{G.removeChild(C);
}catch(h){break;
}}if(!this.__ni){this.__ni=document.createElement(bP);
}var F=bs;
F+=this._getRowsHtml(D+z,Math.abs(u));
F+=bv;
this.__ni.innerHTML=F;
var A=this.__ni.firstChild.childNodes;
if(u>0){for(var i=A.length-1;i>=0;i--){var C=A[0];
G.appendChild(C);
}}else{for(var i=A.length-1;i>=0;i--){var C=A[A.length-1];
G.insertBefore(C,G.firstChild);
}}if(this.__nj!==null){this._updateRowStyles(this.__nj-u);
this._updateRowStyles(this.__nj);
}this.fireEvent(bt);
},_updateAllRows:function(){var ck=this.getContentElement().getDomElement();

if(!ck){this.addListenerOnce(bG,arguments.callee,this);
return;
}var cq=this.getTable();
var cn=cq.getTableModel();
var cp=this.getPaneScroller().getTablePaneModel();
var co=cp.getColumnCount();
var ch=cq.getRowHeight();
var cl=this.getFirstVisibleRow();
var ci=this.getVisibleRowCount();
var cr=cn.getRowCount();

if(cl+ci>cr){ci=Math.max(0,cr-cl);
}var cj=cp.getTotalWidth();
var cm;
if(ci>0){cm=[by,bL,(cq.getForceLineHeight()?bH+ch+bC:bx),bq,bA,this._getRowsHtml(cl,ci),br];
}else{cm=[];
}var cs=cm.join(bx);
ck.innerHTML=cs;
this.setWidth(cj);
this.__nf=co;
this.__ng=ci;
this.fireEvent(bt);
}},destruct:function(){this.__ni=this.__ne=this.__nh=null;
}});
})();
(function(){var e="hovered",d="__nq",c="qx.ui.table.pane.Header";
qx.Class.define(c,{extend:qx.ui.core.Widget,construct:function(r){qx.ui.core.Widget.call(this);
this._setLayout(new qx.ui.layout.HBox());
this.__np=new qx.ui.core.Blocker(this);
this.__nq=r;
},members:{__nq:null,__nr:null,__ns:null,__np:null,getPaneScroller:function(){return this.__nq;
},getTable:function(){return this.__nq.getTable();
},getBlocker:function(){return this.__np;
},onColOrderChanged:function(){this._updateContent(true);
},onPaneModelChanged:function(){this._updateContent(true);
},onTableModelMetaDataChanged:function(){this._updateContent();
},setColumnWidth:function(s,t){var u=this.getHeaderWidgetAtColumn(s);

if(u!=null){u.setWidth(t);
}},setMouseOverColumn:function(a){if(a!=this.__ns){if(this.__ns!=null){var b=this.getHeaderWidgetAtColumn(this.__ns);

if(b!=null){b.removeState(e);
}}
if(a!=null){this.getHeaderWidgetAtColumn(a).addState(e);
}this.__ns=a;
}},getHeaderWidgetAtColumn:function(p){var q=this.getPaneScroller().getTablePaneModel().getX(p);
return this._getChildren()[q];
},showColumnMoveFeedback:function(f,x){var j=this.getContainerLocation();

if(this.__nr==null){var g=this.getPaneScroller().getTablePaneModel().getX(f);
var i=this._getChildren()[g];
var k=this.getTable().getTableModel();
var m=this.getTable().getTableColumnModel();
var n={xPos:g,col:f,name:k.getColumnName(f)};
var l=m.getHeaderCellRenderer(f);
var h=l.createHeaderCell(n);
var o=i.getBounds();
h.setWidth(o.width);
h.setHeight(o.height);
h.setZIndex(1000000);
h.setOpacity(0.8);
h.setLayoutProperties({top:j.top});
this.getApplicationRoot().add(h);
this.__nr=h;
}this.__nr.setLayoutProperties({left:j.left+x});
this.__nr.show();
},hideColumnMoveFeedback:function(){if(this.__nr!=null){this.__nr.destroy();
this.__nr=null;
}},isShowingColumnMoveFeedback:function(){return this.__nr!=null;
},_updateContent:function(y){var D=this.getTable().getTableModel();
var G=this.getTable().getTableColumnModel();
var H=this.getPaneScroller().getTablePaneModel();
var J=this._getChildren();
var E=H.getColumnCount();
var z=D.getSortColumnIndex();
if(y){this._cleanUpCells();
}var A={};
A.sortedAscending=D.isSortAscending();

for(var x=0;x<E;x++){var C=H.getColumnAtX(x);

if(C===undefined){continue;
}var I=G.getColumnWidth(C);
var F=G.getHeaderCellRenderer(C);
A.xPos=x;
A.col=C;
A.name=D.getColumnName(C);
A.editable=D.isColumnEditable(C);
A.sorted=(C==z);
var B=J[x];
if(B==null){B=F.createHeaderCell(A);
B.set({width:I});
this._add(B);
}else{F.updateHeaderCell(A,B);
}}},_cleanUpCells:function(){var w=this._getChildren();

for(var x=w.length-1;x>=0;x--){var v=w[x];
v.destroy();
}}},destruct:function(){this.__np.dispose();
this._disposeObjects(d);
}});
})();
(function(){var b="qx.nativeScrollBars",a="qx.ui.core.scroll.MScrollBarFactory";
qx.core.Setting.define(b,false);
qx.Mixin.define(a,{members:{_createScrollBar:function(c){if(qx.core.Setting.get(b)){return new qx.ui.core.scroll.NativeScrollBar(c);
}else{return new qx.ui.core.scroll.ScrollBar(c);
}}}});
})();
(function(){var bb="Boolean",ba="resize-line",Y="mousedown",X="qx.event.type.Data",W="mouseup",V="qx.ui.table.pane.CellEvent",U="scroll",T="focus-indicator",S="excluded",R="scrollbar-y",bY="visible",bX="mousemove",bW="header",bV="editing",bU="click",bT="modelChanged",bS="scrollbar-x",bR="cellClick",bQ="pane",bP="__nw",bi="__nu",bj="mouseout",bg="__nB",bh="changeHorizontalScrollBarVisible",be="__nx",bf="bottom",bc="_applyScrollTimeout",bd="changeScrollX",bm="_applyTablePaneModel",bn="Integer",bv="dblclick",bt="__nA",bD="dataEdited",by="mousewheel",bL="interval",bI="qx.ui.table.pane.Scroller",bp="__ny",bO="_applyShowCellFocusIndicator",bN="resize",bM="__nz",bo="vertical",br="__nv",bs="changeScrollY",bu="appear",bw="table-scroller",bz="beforeSort",bF="__nC",bK="cellDblclick",bk="horizontal",bl="losecapture",bq="contextmenu",bC="col-resize",bB="disappear",bA="_applyVerticalScrollBarVisible",bH="_applyHorizontalScrollBarVisible",bG="cellContextmenu",bx="close",bE="changeTablePaneModel",Q="qx.ui.table.pane.Model",bJ="changeVerticalScrollBarVisible";
qx.Class.define(bI,{extend:qx.ui.core.Widget,include:qx.ui.core.scroll.MScrollBarFactory,construct:function(eq){qx.ui.core.Widget.call(this);
this.__nt=eq;
var er=new qx.ui.layout.Grid();
er.setColumnFlex(0,1);
er.setRowFlex(1,1);
this._setLayout(er);
this.__nu=this._showChildControl(bS);
this.__nv=this._showChildControl(R);
this.__nw=this._showChildControl(bW);
this.__nx=this._showChildControl(bQ);
this.__ny=new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({minWidth:0});
this._add(this.__ny,{row:0,column:0,colSpan:2});
this.__nz=new qx.ui.table.pane.Clipper();
this.__nz.add(this.__nw);
this.__nz.addListener(bl,this._onChangeCaptureHeader,this);
this.__nz.addListener(bX,this._onMousemoveHeader,this);
this.__nz.addListener(Y,this._onMousedownHeader,this);
this.__nz.addListener(W,this._onMouseupHeader,this);
this.__nz.addListener(bU,this._onClickHeader,this);
this.__ny.add(this.__nz,{flex:1});
this.__nA=new qx.ui.table.pane.Clipper();
this.__nA.add(this.__nx);
this.__nA.addListener(by,this._onMousewheel,this);
this.__nA.addListener(bX,this._onMousemovePane,this);
this.__nA.addListener(Y,this._onMousedownPane,this);
this.__nA.addListener(W,this._onMouseupPane,this);
this.__nA.addListener(bU,this._onClickPane,this);
this.__nA.addListener(bq,this._onContextMenu,this);
this.__nA.addListener(bv,this._onDblclickPane,this);
this.__nA.addListener(bN,this._onResizePane,this);
this._add(this.__nA,{row:1,column:0});
this.__nB=this.getChildControl(T);
this.getChildControl(ba).hide();
this.addListener(bj,this._onMouseout,this);
this.addListener(bu,this._onAppear,this);
this.addListener(bB,this._onDisappear,this);
this.__nC=new qx.event.Timer();
this.__nC.addListener(bL,this._oninterval,this);
this.initScrollTimeout();
},statics:{MIN_COLUMN_WIDTH:10,RESIZE_REGION_RADIUS:5,CLICK_TOLERANCE:5,HORIZONTAL_SCROLLBAR:1,VERTICAL_SCROLLBAR:2},events:{"changeScrollY":X,"changeScrollX":X,"cellClick":V,"cellDblclick":V,"cellContextmenu":V,"beforeSort":X},properties:{horizontalScrollBarVisible:{check:bb,init:true,apply:bH,event:bh},verticalScrollBarVisible:{check:bb,init:true,apply:bA,event:bJ},tablePaneModel:{check:Q,apply:bm,event:bE},liveResize:{check:bb,init:false},focusCellOnMouseMove:{check:bb,init:false},selectBeforeFocus:{check:bb,init:false},showCellFocusIndicator:{check:bb,init:true,apply:bO},scrollTimeout:{check:bn,init:100,apply:bc},appearance:{refine:true,init:bw}},members:{__nD:null,__nt:null,__nE:null,__nF:null,__nG:null,__nH:null,__nI:null,__nJ:null,__nK:null,__nL:null,__nM:null,__nN:null,__nO:null,__nP:null,__nQ:null,__nR:null,__nS:null,__nT:null,__nU:null,__nV:null,__nW:null,__nX:null,__nu:null,__nv:null,__nw:null,__nz:null,__nx:null,__nA:null,__nB:null,__ny:null,__nC:null,getPaneInsetRight:function(){var b=this.getTopRightWidget();
var c=b&&b.isVisible()&&b.getBounds()?b.getBounds().width:0;
var a=this.getVerticalScrollBarVisible()?this.getVerticalScrollBarWidth():0;
return Math.max(c,a);
},setPaneWidth:function(eM){if(this.isVerticalScrollBarVisible()){eM+=this.getPaneInsetRight();
}this.setWidth(eM);
},_createChildControlImpl:function(B){var C;

switch(B){case bW:C=(this.getTable().getNewTablePaneHeader())(this);
break;
case bQ:C=(this.getTable().getNewTablePane())(this);
break;
case T:C=new qx.ui.table.pane.FocusIndicator(this);
C.setUserBounds(0,0,0,0);
C.setZIndex(1000);
C.addListener(W,this._onMouseupFocusIndicator,this);
this.__nA.add(C);
C.exclude();
break;
case ba:C=new qx.ui.core.Widget();
C.setUserBounds(0,0,0,0);
C.setZIndex(1000);
this.__nA.add(C);
break;
case bS:C=this._createScrollBar(bk).set({minWidth:0,alignY:bf});
C.addListener(U,this._onScrollX,this);
this._add(C,{row:2,column:0});
break;
case R:C=this._createScrollBar(bo);
C.addListener(U,this._onScrollY,this);
this._add(C,{row:1,column:1});
break;
}return C||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,B);
},_applyHorizontalScrollBarVisible:function(z,A){this.__nu.setVisibility(z?bY:S);

if(!z){this.setScrollY(0,true);
}},_applyVerticalScrollBarVisible:function(w,y){this.__nv.setVisibility(w?bY:S);

if(!w){this.setScrollX(0);
}},_applyTablePaneModel:function(ec,ed){if(ed!=null){ed.removeListener(bT,this._onPaneModelChanged,this);
}ec.addListener(bT,this._onPaneModelChanged,this);
},_applyShowCellFocusIndicator:function(dA,dB){if(dA){this._updateFocusIndicator();
}else{if(this.__nB){this.__nB.hide();
}}},getScrollY:function(){return this.__nv.getPosition();
},setScrollY:function(scrollY,v){this.__nv.scrollTo(scrollY);

if(v){this._updateContent();
}},getScrollX:function(){return this.__nu.getPosition();
},setScrollX:function(scrollX){this.__nu.scrollTo(scrollX);
},getTable:function(){return this.__nt;
},onColVisibilityChanged:function(){this.updateHorScrollBarMaximum();
this._updateFocusIndicator();
},setColumnWidth:function(cN,cO){this.__nw.setColumnWidth(cN,cO);
this.__nx.setColumnWidth(cN,cO);
var cP=this.getTablePaneModel();
var x=cP.getX(cN);

if(x!=-1){this.updateHorScrollBarMaximum();
this._updateFocusIndicator();
}},onColOrderChanged:function(){this.__nw.onColOrderChanged();
this.__nx.onColOrderChanged();
this.updateHorScrollBarMaximum();
},onTableModelDataChanged:function(L,M,N,O){this.__nx.onTableModelDataChanged(L,M,N,O);
var P=this.getTable().getTableModel().getRowCount();

if(P!=this.__nD){this.updateVerScrollBarMaximum();

if(this.getFocusedRow()>=P){if(P==0){this.setFocusedCell(null,null);
}else{this.setFocusedCell(this.getFocusedColumn(),P-1);
}}this.__nD=P;
}},onSelectionChanged:function(){this.__nx.onSelectionChanged();
},onFocusChanged:function(){this.__nx.onFocusChanged();
},onTableModelMetaDataChanged:function(){this.__nw.onTableModelMetaDataChanged();
this.__nx.onTableModelMetaDataChanged();
},_onPaneModelChanged:function(){this.__nw.onPaneModelChanged();
this.__nx.onPaneModelChanged();
},_onResizePane:function(){this.updateHorScrollBarMaximum();
this.updateVerScrollBarMaximum();
this._updateContent();
this.__nw._updateContent();
this.__nt._updateScrollBarVisibility();
},updateHorScrollBarMaximum:function(){var eI=this.__nA.getInnerSize();

if(!eI){return ;
}var eG=this.getTablePaneModel().getTotalWidth();
var eH=this.__nu;

if(eI.width<eG){var eF=Math.max(0,eG-eI.width);
eH.setMaximum(eF);
eH.setKnobFactor(eI.width/eG);
var eJ=eH.getPosition();
eH.setPosition(Math.min(eJ,eF));
}else{eH.setMaximum(0);
eH.setKnobFactor(1);
eH.setPosition(0);
}},updateVerScrollBarMaximum:function(){var eE=this.__nA.getInnerSize();

if(!eE){return ;
}var eC=this.getTable().getTableModel();
var ey=eC.getRowCount();

if(this.getTable().getKeepFirstVisibleRowComplete()){ey+=1;
}var ex=this.getTable().getRowHeight();
var eA=ey*ex;
var eD=this.__nv;

if(eE.height<eA){var ez=Math.max(0,eA-eE.height);
eD.setMaximum(ez);
eD.setKnobFactor(eE.height/eA);
var eB=eD.getPosition();
eD.setPosition(Math.min(eB,ez));
}else{eD.setMaximum(0);
eD.setKnobFactor(1);
eD.setPosition(0);
}},onKeepFirstVisibleRowCompleteChanged:function(){this.updateVerScrollBarMaximum();
this._updateContent();
},_onAppear:function(){this._startInterval(this.getScrollTimeout());
},_onDisappear:function(){this._stopInterval();
},_onScrollX:function(e){var fv=e.getData();
this.fireDataEvent(bd,fv,e.getOldData());
this.__nz.scrollToX(fv);
this.__nA.scrollToX(fv);
},_onScrollY:function(e){this.fireDataEvent(bs,e.getData(),e.getOldData());
this._postponedUpdateContent();
},_onMousewheel:function(e){var s=this.getTable();

if(!s.getEnabled()){return;
}var u=qx.bom.client.Engine.GECKO?1:3;
var t=this.__nv.getPosition()+((e.getWheelDelta()*u)*s.getRowHeight());
this.__nv.scrollTo(t);
if(this.__nR&&this.getFocusCellOnMouseMove()){this._focusCellAtPagePos(this.__nR,this.__nS);
}e.stop();
},__nY:function(cd){var ci=this.getTable();
var cj=this.__nw.getHeaderWidgetAtColumn(this.__nM);
var ce=cj.getSizeHint().minWidth;
var cg=Math.max(ce,this.__nO+cd-this.__nN);

if(this.getLiveResize()){var cf=ci.getTableColumnModel();
cf.setColumnWidth(this.__nM,cg);
}else{this.__nw.setColumnWidth(this.__nM,cg);
var ch=this.getTablePaneModel();
this._showResizeLine(ch.getColumnLeft(this.__nM)+cg);
}this.__nN+=cg-this.__nO;
this.__nO=cg;
},__oa:function(ca){var cb=qx.ui.table.pane.Scroller.CLICK_TOLERANCE;

if(this.__nw.isShowingColumnMoveFeedback()||ca>this.__nL+cb||ca<this.__nL-cb){this.__nI+=ca-this.__nL;
this.__nw.showColumnMoveFeedback(this.__nH,this.__nI);
var cc=this.__nt.getTablePaneScrollerAtPageX(ca);

if(this.__nK&&this.__nK!=cc){this.__nK.hideColumnMoveFeedback();
}
if(cc!=null){this.__nJ=cc.showColumnMoveFeedback(ca);
}else{this.__nJ=null;
}this.__nK=cc;
this.__nL=ca;
}},_onMousemoveHeader:function(e){var ek=this.getTable();

if(!ek.getEnabled()){return;
}var el=false;
var ee=null;
var ei=e.getDocumentLeft();
var ej=e.getDocumentTop();
this.__nR=ei;
this.__nS=ej;

if(this.__nM!=null){this.__nY(ei);
el=true;
e.stopPropagation();
}else if(this.__nH!=null){this.__oa(ei);
e.stopPropagation();
}else{var ef=this._getResizeColumnForPageX(ei);

if(ef!=-1){el=true;
}else{var eh=ek.getTableModel();
var em=this._getColumnForPageX(ei);

if(em!=null&&eh.isColumnSortable(em)){ee=em;
}}}var eg=el?bC:null;
this.getApplicationRoot().setGlobalCursor(eg);
this.setCursor(eg);
this.__nw.setMouseOverColumn(ee);
},_onMousemovePane:function(e){var dD=this.getTable();

if(!dD.getEnabled()){return;
}var dF=e.getDocumentLeft();
var dG=e.getDocumentTop();
this.__nR=dF;
this.__nS=dG;
var dE=this._getRowForPagePos(dF,dG);

if(dE!=null&&this._getColumnForPageX(dF)!=null){if(this.getFocusCellOnMouseMove()){this._focusCellAtPagePos(dF,dG);
}}this.__nw.setMouseOverColumn(null);
},_onMousedownHeader:function(e){if(!this.getTable().getEnabled()){return;
}var dK=e.getDocumentLeft();
var dL=this._getResizeColumnForPageX(dK);

if(dL!=-1){this._startResizeHeader(dL,dK);
e.stop();
}else{var dJ=this._getColumnForPageX(dK);

if(dJ!=null){this._startMoveHeader(dJ,dK);
e.stop();
}}},_startResizeHeader:function(ck,cl){var cm=this.getTable().getTableColumnModel();
this.__nM=ck;
this.__nN=cl;
this.__nO=cm.getColumnWidth(this.__nM);
this.__nz.capture();
},_startMoveHeader:function(fk,fl){this.__nH=fk;
this.__nL=fl;
this.__nI=this.getTablePaneModel().getColumnLeft(fk);
this.__nz.capture();
},_onMousedownPane:function(e){var fs=this.getTable();

if(!fs.getEnabled()){return;
}
if(this.isEditing()){this.stopEditing();
}var fp=e.getDocumentLeft();
var fr=e.getDocumentTop();
var fu=this._getRowForPagePos(fp,fr);
var ft=this._getColumnForPageX(fp);

if(fu!==null){this.__nP={row:fu,col:ft};
var fq=this.getSelectBeforeFocus();

if(fq){fs.getSelectionManager().handleMouseDown(fu,e);
}if(!this.getFocusCellOnMouseMove()){this._focusCellAtPagePos(fp,fr);
}
if(!fq){fs.getSelectionManager().handleMouseDown(fu,e);
}}},_onMouseupFocusIndicator:function(e){if(this.__nP&&!this.isEditing()&&this.__nB.getRow()==this.__nP.row&&this.__nB.getColumn()==this.__nP.col){this.__nP={};
this.fireEvent(bR,qx.ui.table.pane.CellEvent,[this,e,this.__nP.row,this.__nP.col],true);
}},_onChangeCaptureHeader:function(e){if(this.__nM!=null){this._stopResizeHeader();
}
if(this.__nH!=null){this._stopMoveHeader();
}},_stopResizeHeader:function(){var d=this.getTable().getTableColumnModel();
if(!this.getLiveResize()){this._hideResizeLine();
d.setColumnWidth(this.__nM,this.__nO);
}this.__nM=null;
this.__nz.releaseCapture();
this.getApplicationRoot().setGlobalCursor(null);
this.setCursor(null);
},_stopMoveHeader:function(){var H=this.getTable().getTableColumnModel();
var I=this.getTablePaneModel();
this.__nw.hideColumnMoveFeedback();

if(this.__nK){this.__nK.hideColumnMoveFeedback();
}
if(this.__nJ!=null){var K=I.getFirstColumnX()+I.getX(this.__nH);
var G=this.__nJ;

if(G!=K&&G!=K+1){var J=H.getVisibleColumnAtX(K);
var F=H.getVisibleColumnAtX(G);
var E=H.getOverallX(J);
var D=(F!=null)?H.getOverallX(F):H.getOverallColumnCount();

if(D>E){D--;
}H.moveColumn(E,D);
}}this.__nH=null;
this.__nJ=null;
this.__nz.releaseCapture();
},_onMouseupPane:function(e){var dM=this.getTable();

if(!dM.getEnabled()){return;
}var dN=this._getRowForPagePos(e.getDocumentLeft(),e.getDocumentTop());

if(dN!=-1&&dN!=null&&this._getColumnForPageX(e.getDocumentLeft())!=null){dM.getSelectionManager().handleMouseUp(dN,e);
}},_onMouseupHeader:function(e){var dH=this.getTable();

if(!dH.getEnabled()){return;
}
if(this.__nM!=null){this._stopResizeHeader();
this.__nQ=true;
e.stop();
}else if(this.__nH!=null){this._stopMoveHeader();
e.stop();
}},_onClickHeader:function(e){if(this.__nQ){this.__nQ=false;
return;
}var ds=this.getTable();

if(!ds.getEnabled()){return;
}var dq=ds.getTableModel();
var dr=e.getDocumentLeft();
var dp=this._getResizeColumnForPageX(dr);

if(dp==-1){var dv=this._getColumnForPageX(dr);

if(dv!=null&&dq.isColumnSortable(dv)){var dn=dq.getSortColumnIndex();
var dt=(dv!=dn)?true:!dq.isSortAscending();
var du={column:dv,ascending:dt};

if(this.fireDataEvent(bz,du)){dq.sortByColumn(dv,dt);
ds.getSelectionModel().resetSelection();
}}}e.stop();
},_onClickPane:function(e){var es=this.getTable();

if(!es.getEnabled()){return;
}var ev=e.getDocumentLeft();
var ew=e.getDocumentTop();
var et=this._getRowForPagePos(ev,ew);
var eu=this._getColumnForPageX(ev);

if(et!=null&&eu!=null){es.getSelectionManager().handleClick(et,e);

if(this.__nB.isHidden()||(this.__nP&&!this.isEditing()&&et==this.__nP.row&&eu==this.__nP.col)){this.__nP={};
this.fireEvent(bR,qx.ui.table.pane.CellEvent,[this,e,et,eu],true);
}}},_onContextMenu:function(e){var cE=e.getDocumentLeft();
var cF=e.getDocumentTop();
var cC=this._getRowForPagePos(cE,cF);
var cD=this._getColumnForPageX(cE);

if(this.__nB.isHidden()||(this.__nP&&cC==this.__nP.row&&cD==this.__nP.col)){this.__nP={};
this.fireEvent(bG,qx.ui.table.pane.CellEvent,[this,e,cC,cD],true);
var cB=this.getTable().getContextMenu();

if(cB){if(cB.getChildren().length>0){cB.openAtMouse(e);
}else{cB.exclude();
}e.preventDefault();
}}},_onContextMenuOpen:function(e){},_onDblclickPane:function(e){var eo=e.getDocumentLeft();
var ep=e.getDocumentTop();
this._focusCellAtPagePos(eo,ep);
this.startEditing();
var en=this._getRowForPagePos(eo,ep);

if(en!=-1&&en!=null){this.fireEvent(bK,qx.ui.table.pane.CellEvent,[this,e,en],true);
}},_onMouseout:function(e){var fj=this.getTable();

if(!fj.getEnabled()){return;
}if(this.__nM==null){this.setCursor(null);
this.getApplicationRoot().setGlobalCursor(null);
}this.__nw.setMouseOverColumn(null);
},_showResizeLine:function(x){var fn=this._showChildControl(ba);
var fm=fn.getWidth();
var fo=this.__nA.getBounds();
fn.setUserBounds(x-Math.round(fm/2),0,fm,fo.height);
},_hideResizeLine:function(){this._excludeChildControl(ba);
},showColumnMoveFeedback:function(dO){var dX=this.getTablePaneModel();
var dW=this.getTable().getTableColumnModel();
var dR=this.__nx.getContainerLocation().left;
var dV=dX.getColumnCount();
var dS=0;
var dQ=0;
var eb=dR;

for(var dP=0;dP<dV;dP++){var dT=dX.getColumnAtX(dP);
var dY=dW.getColumnWidth(dT);

if(dO<eb+dY/2){break;
}eb+=dY;
dS=dP+1;
dQ=eb-dR;
}var dU=this.__nA.getContainerLocation().left;
var ea=this.__nA.getBounds().width;
var scrollX=dU-dR;
dQ=qx.lang.Number.limit(dQ,scrollX+2,scrollX+ea-1);
this._showResizeLine(dQ);
return dX.getFirstColumnX()+dS;
},hideColumnMoveFeedback:function(){this._hideResizeLine();
},_focusCellAtPagePos:function(g,h){var j=this._getRowForPagePos(g,h);

if(j!=-1&&j!=null){var i=this._getColumnForPageX(g);
this.__nt.setFocusedCell(i,j);
}},setFocusedCell:function(dw,dx){if(!this.isEditing()){this.__nx.setFocusedCell(dw,dx,this.__nF);
this.__nT=dw;
this.__nU=dx;
this._updateFocusIndicator();
}},getFocusedColumn:function(){return this.__nT;
},getFocusedRow:function(){return this.__nU;
},scrollCellVisible:function(cn,co){var cy=this.getTablePaneModel();
var cp=cy.getX(cn);

if(cp!=-1){var cv=this.__nA.getInnerSize();

if(!cv){return;
}var cw=this.getTable().getTableColumnModel();
var cs=cy.getColumnLeft(cn);
var cz=cw.getColumnWidth(cn);
var cq=this.getTable().getRowHeight();
var cA=co*cq;
var scrollX=this.getScrollX();
var scrollY=this.getScrollY();
var cx=Math.min(cs,cs+cz-cv.width);
var cu=cs;
this.setScrollX(Math.max(cx,Math.min(cu,scrollX)));
var cr=cA+cq-cv.height;

if(this.getTable().getKeepFirstVisibleRowComplete()){cr+=cq;
}var ct=cA;
this.setScrollY(Math.max(cr,Math.min(ct,scrollY)),true);
}},isEditing:function(){return this.__nV!=null;
},startEditing:function(){var fb=this.getTable();
var eY=fb.getTableModel();
var fd=this.__nT;

if(!this.isEditing()&&(fd!=null)&&eY.isColumnEditable(fd)){var fe=this.__nU;
var eW=this.getTablePaneModel().getX(fd);
var eX=eY.getValue(fd,fe);
fb.blockHeaderElements();
this.__nW=fb.getTableColumnModel().getCellEditorFactory(fd);
var fa={col:fd,row:fe,xPos:eW,value:eX,table:fb};
this.__nV=this.__nW.createCellEditor(fa);
if(this.__nV===null){return false;
}else if(this.__nV instanceof qx.ui.window.Window){this.__nV.setModal(true);
this.__nV.setShowClose(false);
this.__nV.addListener(bx,this._onCellEditorModalWindowClose,this);
var f=fb.getModalCellEditorPreOpenFunction();

if(f!=null){f(this.__nV,fa);
}this.__nV.open();
}else{var fc=this.__nB.getInnerSize();
this.__nV.setUserBounds(0,0,fc.width,fc.height);
this.__nB.addListener(Y,function(e){this.__nP={row:this.__nU,col:this.__nT};
e.stopPropagation();
},this);
this.__nB.add(this.__nV);
this.__nB.addState(bV);
this.__nB.setKeepActive(false);
this.__nV.focus();
this.__nV.activate();
}return true;
}return false;
},stopEditing:function(){this.flushEditor();
this.cancelEditing();
},flushEditor:function(){if(this.isEditing()){var eL=this.__nW.getCellEditorValue(this.__nV);
var eK=this.getTable().getTableModel().getValue(this.__nT,this.__nU);
this.getTable().getTableModel().setValue(this.__nT,this.__nU,eL);
this.__nt.focus();
this.__nt.fireDataEvent(bD,{row:this.__nU,col:this.__nT,oldValue:eK,value:eL});
}},cancelEditing:function(){if(this.isEditing()&&!this.__nV.pendingDispose){this.getTable().unblockHeaderElements();

if(this._cellEditorIsModalWindow){this.__nV.destroy();
this.__nV=null;
this.__nW=null;
this.__nV.pendingDispose=true;
}else{this.__nB.removeState(bV);
this.__nB.setKeepActive(true);
this.__nV.destroy();
this.__nV=null;
this.__nW=null;
}}},_onCellEditorModalWindowClose:function(e){this.stopEditing();
},_getColumnForPageX:function(cG){var cJ=this.getTable().getTableColumnModel();
var cK=this.getTablePaneModel();
var cI=cK.getColumnCount();
var cM=this.__nw.getContainerLocation().left;

for(var x=0;x<cI;x++){var cH=cK.getColumnAtX(x);
var cL=cJ.getColumnWidth(cH);
cM+=cL;

if(cG<cM){return cH;
}}return null;
},_getResizeColumnForPageX:function(df){var dj=this.getTable().getTableColumnModel();
var dk=this.getTablePaneModel();
var di=dk.getColumnCount();
var dm=this.__nw.getContainerLocation().left;
var dg=qx.ui.table.pane.Scroller.RESIZE_REGION_RADIUS;

for(var x=0;x<di;x++){var dh=dk.getColumnAtX(x);
var dl=dj.getColumnWidth(dh);
dm+=dl;

if(df>=(dm-dg)&&df<=(dm+dg)){return dh;
}}return -1;
},_getRowForPagePos:function(eN,eO){var eP=this.__nx.getContentLocation();

if(eN<eP.left||eN>eP.right){return null;
}
if(eO>=eP.top&&eO<=eP.bottom){var eQ=this.getTable().getRowHeight();
var scrollY=this.__nv.getPosition();

if(this.getTable().getKeepFirstVisibleRowComplete()){scrollY=Math.floor(scrollY/eQ)*eQ;
}var eT=scrollY+eO-eP.top;
var eV=Math.floor(eT/eQ);
var eU=this.getTable().getTableModel();
var eR=eU.getRowCount();
return (eV<eR)?eV:null;
}var eS=this.__nw.getContainerLocation();

if(eO>=eS.top&&eO<=eS.bottom&&eN<=eS.right){return -1;
}return null;
},setTopRightWidget:function(dy){var dz=this.__nX;

if(dz!=null){this.__ny.remove(dz);
}
if(dy!=null){this.__ny.add(dy);
}this.__nX=dy;
},getTopRightWidget:function(){return this.__nX;
},getHeader:function(){return this.__nw;
},getTablePane:function(){return this.__nx;
},getVerticalScrollBarWidth:function(){var dI=this.__nv;
return dI.isVisible()?(dI.getSizeHint().width||0):0;
},getNeededScrollBars:function(cQ,cR){var cX=this.__nv.getSizeHint().width;
var cY=this.__nA.getInnerSize();
var cS=cY?cY.width:0;

if(this.getVerticalScrollBarVisible()){cS+=cX;
}var dc=cY?cY.height:0;

if(this.getHorizontalScrollBarVisible()){dc+=cX;
}var cV=this.getTable().getTableModel();
var da=cV.getRowCount();
var dd=this.getTablePaneModel().getTotalWidth();
var db=this.getTable().getRowHeight()*da;
var cU=false;
var de=false;

if(dd>cS){cU=true;

if(db>dc-cX){de=true;
}}else if(db>dc){de=true;

if(!cR&&(dd>cS-cX)){cU=true;
}}var cW=qx.ui.table.pane.Scroller.HORIZONTAL_SCROLLBAR;
var cT=qx.ui.table.pane.Scroller.VERTICAL_SCROLLBAR;
return ((cQ||cU)?cW:0)|((cR||!de)?0:cT);
},_applyScrollTimeout:function(fh,fi){this._startInterval(fh);
},_startInterval:function(ff){this.__nC.setInterval(ff);
this.__nC.start();
},_stopInterval:function(){this.__nC.stop();
},_postponedUpdateContent:function(){this._updateContent();
},_oninterval:qx.event.GlobalError.observeMethod(function(){if(this.__nF&&!this.__nx._layoutPending){this.__nF=false;
this._updateContent();
}}),_updateContent:function(){var o=this.__nA.getInnerSize();

if(!o){return;
}var r=o.height;
var scrollX=this.__nu.getPosition();
var scrollY=this.__nv.getPosition();
var l=this.getTable().getRowHeight();
var m=Math.floor(scrollY/l);
var q=this.__nx.getFirstVisibleRow();
this.__nx.setFirstVisibleRow(m);
var n=Math.ceil(r/l);
var k=0;
var p=this.getTable().getKeepFirstVisibleRowComplete();

if(!p){n++;
k=scrollY%l;
}this.__nx.setVisibleRowCount(n);

if(m!=q){this._updateFocusIndicator();
}this.__nA.scrollToX(scrollX);
if(!p){this.__nA.scrollToY(k);
}},_updateFocusIndicator:function(){if(!this.getShowCellFocusIndicator()){return;
}var fg=this.getTable();

if(!fg.getEnabled()){return;
}this.__nB.moveToCell(this.__nT,this.__nU);
}},destruct:function(){this._stopInterval();
var dC=this.getTablePaneModel();

if(dC){dC.dispose();
}this.__nP=this.__nX=this.__nt=null;
this._disposeObjects(bi,br,bM,bt,bg,bP,be,bp,bF);
}});
})();
(function(){var b="qx.ui.core.scroll.IScrollBar",a="qx.event.type.Data";
qx.Interface.define(b,{events:{"scroll":a},properties:{orientation:{},maximum:{},position:{},knobFactor:{}},members:{scrollTo:function(e){this.assertNumber(e);
},scrollBy:function(c){this.assertNumber(c);
},scrollBySteps:function(d){this.assertNumber(d);
}}});
})();
(function(){var s="horizontal",r="px",q="scroll",p="vertical",o="-1px",n="qx.client",m="0",l="hidden",k="mousedown",j="qx.ui.core.scroll.NativeScrollBar",H="PositiveNumber",G="Integer",F="mousemove",E="_applyMaximum",D="_applyOrientation",C="__oc",B="appear",A="opera",z="PositiveInteger",y="mshtml",w="mouseup",x="Number",u="_applyPosition",v="scrollbar",t="native";
qx.Class.define(j,{extend:qx.ui.core.Widget,implement:qx.ui.core.scroll.IScrollBar,construct:function(K){qx.ui.core.Widget.call(this);
this.addState(t);
this.getContentElement().addListener(q,this._onScroll,this);
this.addListener(k,this._stopPropagation,this);
this.addListener(w,this._stopPropagation,this);
this.addListener(F,this._stopPropagation,this);

if(qx.core.Variant.isSet(n,A)){this.addListener(B,this._onAppear,this);
}this.getContentElement().add(this._getScrollPaneElement());
if(K!=null){this.setOrientation(K);
}else{this.initOrientation();
}},properties:{appearance:{refine:true,init:v},orientation:{check:[s,p],init:s,apply:D},maximum:{check:z,apply:E,init:100},position:{check:x,init:0,apply:u,event:q},singleStep:{check:G,init:20},knobFactor:{check:H,nullable:true}},members:{__ob:null,__oc:null,_getScrollPaneElement:function(){if(!this.__oc){this.__oc=new qx.html.Element();
}return this.__oc;
},renderLayout:function(T,top,U,V){var W=qx.ui.core.Widget.prototype.renderLayout.call(this,T,top,U,V);
this._updateScrollBar();
return W;
},_getContentHint:function(){var R=qx.bom.element.Overflow.getScrollbarWidth();
return {width:this.__ob?100:R,maxWidth:this.__ob?null:R,minWidth:this.__ob?null:R,height:this.__ob?R:100,maxHeight:this.__ob?R:null,minHeight:this.__ob?R:null};
},_applyEnabled:function(a,b){qx.ui.core.Widget.prototype._applyEnabled.call(this,a,b);
this._updateScrollBar();
},_applyMaximum:function(L){this._updateScrollBar();
},_applyPosition:function(I){var content=this.getContentElement();

if(this.__ob){content.scrollToX(I);
}else{content.scrollToY(I);
}},_applyOrientation:function(M,N){var O=this.__ob=M===s;
this.set({allowGrowX:O,allowShrinkX:O,allowGrowY:!O,allowShrinkY:!O});

if(O){this.replaceState(p,s);
}else{this.replaceState(s,p);
}this.getContentElement().setStyles({overflowX:O?q:l,overflowY:O?l:q});
qx.ui.core.queue.Layout.add(this);
},_updateScrollBar:function(){var d=this.__ob;
var f=this.getBounds();

if(!f){return;
}
if(this.isEnabled()){var g=d?f.width:f.height;
var c=this.getMaximum()+g;
}else{c=0;
}if(qx.core.Variant.isSet(n,y)){var f=this.getBounds();
this.getContentElement().setStyles({left:d?m:o,top:d?o:m,width:(d?f.width:f.width+1)+r,height:(d?f.height+1:f.height)+r});
}this._getScrollPaneElement().setStyles({left:0,top:0,width:(d?c:1)+r,height:(d?1:c)+r});
this.scrollTo(this.getPosition());
},scrollTo:function(J){this.setPosition(Math.max(0,Math.min(this.getMaximum(),J)));
},scrollBy:function(S){this.scrollTo(this.getPosition()+S);
},scrollBySteps:function(h){var i=this.getSingleStep();
this.scrollBy(h*i);
},_onScroll:function(e){var Q=this.getContentElement();
var P=this.__ob?Q.getScrollX():Q.getScrollY();
this.setPosition(P);
},_onAppear:function(e){this.scrollTo(this.getPosition());
},_stopPropagation:function(e){e.stopPropagation();
}},destruct:function(){this._disposeObjects(C);
}});
})();
(function(){var q="slider",p="horizontal",o="button-begin",n="vertical",m="button-end",l="Integer",k="execute",j="right",i="left",h="down",F="up",E="PositiveNumber",D="changeValue",C="qx.lang.Type.isNumber(value)&&value>=0&&value<=this.getMaximum()",B="_applyKnobFactor",A="knob",z="qx.ui.core.scroll.ScrollBar",y="resize",x="_applyOrientation",w="_applyPageStep",u="PositiveInteger",v="scroll",s="_applyPosition",t="scrollbar",r="_applyMaximum";
qx.Class.define(z,{extend:qx.ui.core.Widget,implement:qx.ui.core.scroll.IScrollBar,construct:function(N){qx.ui.core.Widget.call(this);
this._createChildControl(o);
this._createChildControl(q).addListener(y,this._onResizeSlider,this);
this._createChildControl(m);
if(N!=null){this.setOrientation(N);
}else{this.initOrientation();
}},properties:{appearance:{refine:true,init:t},orientation:{check:[p,n],init:p,apply:x},maximum:{check:u,apply:r,init:100},position:{check:C,init:0,apply:s,event:v},singleStep:{check:l,init:20},pageStep:{check:l,init:10,apply:w},knobFactor:{check:E,apply:B,nullable:true}},members:{__od:2,_createChildControlImpl:function(G){var H;

switch(G){case q:H=new qx.ui.core.scroll.ScrollSlider();
H.setPageStep(100);
H.setFocusable(false);
H.addListener(D,this._onChangeSliderValue,this);
this._add(H,{flex:1});
break;
case o:H=new qx.ui.form.RepeatButton();
H.setFocusable(false);
H.addListener(k,this._onExecuteBegin,this);
this._add(H);
break;
case m:H=new qx.ui.form.RepeatButton();
H.setFocusable(false);
H.addListener(k,this._onExecuteEnd,this);
this._add(H);
break;
}return H||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,G);
},_applyMaximum:function(R){this.getChildControl(q).setMaximum(R);
},_applyPosition:function(f){this.getChildControl(q).setValue(f);
},_applyKnobFactor:function(M){this.getChildControl(q).setKnobFactor(M);
},_applyPageStep:function(O){this.getChildControl(q).setPageStep(O);
},_applyOrientation:function(b,c){var d=this._getLayout();

if(d){d.dispose();
}if(b===p){this._setLayout(new qx.ui.layout.HBox());
this.setAllowStretchX(true);
this.setAllowStretchY(false);
this.replaceState(n,p);
this.getChildControl(o).replaceState(F,i);
this.getChildControl(m).replaceState(h,j);
}else{this._setLayout(new qx.ui.layout.VBox());
this.setAllowStretchX(false);
this.setAllowStretchY(true);
this.replaceState(p,n);
this.getChildControl(o).replaceState(i,F);
this.getChildControl(m).replaceState(j,h);
}this.getChildControl(q).setOrientation(b);
},scrollTo:function(a){this.getChildControl(q).slideTo(a);
},scrollBy:function(g){this.getChildControl(q).slideBy(g);
},scrollBySteps:function(P){var Q=this.getSingleStep();
this.getChildControl(q).slideBy(P*Q);
},_onExecuteBegin:function(e){this.scrollBy(-this.getSingleStep());
},_onExecuteEnd:function(e){this.scrollBy(this.getSingleStep());
},_onChangeSliderValue:function(e){this.setPosition(e.getData());
},_onResizeSlider:function(e){var I=this.getChildControl(q).getChildControl(A);
var L=I.getSizeHint();
var J=false;
var K=this.getChildControl(q).getInnerSize();

if(this.getOrientation()==n){if(K.height<L.minHeight+this.__od){J=true;
}}else{if(K.width<L.minWidth+this.__od){J=true;
}}
if(J){I.exclude();
}else{I.show();
}}}});
})();
(function(){var c="qx.ui.form.INumberForm",b="qx.event.type.Data";
qx.Interface.define(c,{events:{"changeValue":b},members:{setValue:function(a){return arguments.length==1;
},resetValue:function(){},getValue:function(){}}});
})();
(function(){var b="qx.ui.form.IRange";
qx.Interface.define(b,{members:{setMinimum:function(c){return arguments.length==1;
},getMinimum:function(){},setMaximum:function(a){return arguments.length==1;
},getMaximum:function(){},setSingleStep:function(e){return arguments.length==1;
},getSingleStep:function(){},setPageStep:function(d){return arguments.length==1;
},getPageStep:function(){}}});
})();
(function(){var B="knob",A="horizontal",z="vertical",y="Integer",x="hovered",w="left",v="top",u="mouseup",t="pressed",s="px",bm="mousemove",bl="resize",bk="slider",bj="mousedown",bi="PageUp",bh="mouseout",bg="changeValue",bf="Left",be="Down",bd="Up",I="dblclick",J="qx.ui.form.Slider",G="PageDown",H="mousewheel",E="interval",F="_applyValue",C="_applyKnobFactor",D="End",K="height",L="Right",S="width",Q="_applyOrientation",W="Home",U="mouseover",Y="floor",X="_applyMinimum",N="click",bc="typeof value==='number'&&value>=this.getMinimum()&&value<=this.getMaximum()",bb="keypress",ba="ceil",M="losecapture",O="contextmenu",P="_applyMaximum",R="Number",T="changeMaximum",V="changeMinimum";
qx.Class.define(J,{extend:qx.ui.core.Widget,implement:[qx.ui.form.IForm,qx.ui.form.INumberForm,qx.ui.form.IRange],include:[qx.ui.form.MForm],construct:function(bD){qx.ui.core.Widget.call(this);
this._setLayout(new qx.ui.layout.Canvas());
this.addListener(bb,this._onKeyPress);
this.addListener(H,this._onMouseWheel);
this.addListener(bj,this._onMouseDown);
this.addListener(u,this._onMouseUp);
this.addListener(M,this._onMouseUp);
this.addListener(bl,this._onUpdate);
this.addListener(O,this._onStopEvent);
this.addListener(N,this._onStopEvent);
this.addListener(I,this._onStopEvent);
if(bD!=null){this.setOrientation(bD);
}else{this.initOrientation();
}},properties:{appearance:{refine:true,init:bk},focusable:{refine:true,init:true},orientation:{check:[A,z],init:A,apply:Q},value:{check:bc,init:0,apply:F,event:bg,nullable:true},minimum:{check:y,init:0,apply:X,event:V},maximum:{check:y,init:100,apply:P,event:T},singleStep:{check:y,init:1},pageStep:{check:y,init:10},knobFactor:{check:R,apply:C,nullable:true}},members:{__oe:null,__of:null,__og:null,__oh:null,__oi:null,__oj:null,__ok:null,__ol:null,__om:null,_forwardStates:{invalid:true},_createChildControlImpl:function(bn){var bo;

switch(bn){case B:bo=new qx.ui.core.Widget();
bo.addListener(bl,this._onUpdate,this);
bo.addListener(U,this._onMouseOver);
bo.addListener(bh,this._onMouseOut);
this._add(bo);
break;
}return bo||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,bn);
},_onMouseOver:function(e){this.addState(x);
},_onMouseOut:function(e){this.removeState(x);
},_onMouseWheel:function(e){var bO=e.getWheelDelta()>0?1:-1;
this.slideBy(bO*this.getSingleStep());
e.stop();
},_onKeyPress:function(e){var bW=this.getOrientation()===A;
var bV=bW?bf:bd;
var forward=bW?L:be;

switch(e.getKeyIdentifier()){case forward:this.slideForward();
break;
case bV:this.slideBack();
break;
case G:this.slidePageForward();
break;
case bi:this.slidePageBack();
break;
case W:this.slideToBegin();
break;
case D:this.slideToEnd();
break;
default:return;
}e.stop();
},_onMouseDown:function(e){if(this.__oh){return;
}var bR=this.__oo;
var bP=this.getChildControl(B);
var bQ=bR?w:v;
var bT=bR?e.getDocumentLeft():e.getDocumentTop();
var bU=this.__oe=qx.bom.element.Location.get(this.getContentElement().getDomElement())[bQ];
var bS=this.__of=qx.bom.element.Location.get(bP.getContainerElement().getDomElement())[bQ];

if(e.getTarget()===bP){this.__oh=true;
this.__oi=bT+bU-bS;
bP.addState(t);
}else{this.__oj=true;
this.__ok=bT<=bS?-1:1;
this.__op(e);
this._onInterval();
if(!this.__om){this.__om=new qx.event.Timer(100);
this.__om.addListener(E,this._onInterval,this);
}this.__om.start();
}this.addListener(bm,this._onMouseMove);
this.capture();
e.stopPropagation();
},_onMouseUp:function(e){if(this.__oh){this.releaseCapture();
delete this.__oh;
delete this.__oi;
this.getChildControl(B).removeState(t);
if(e.getType()===u){var bH;
var bI;
var bG;

if(this.__oo){bH=e.getDocumentLeft()-(this._valueToPosition(this.getValue())+this.__oe);
bG=qx.bom.element.Location.get(this.getContentElement().getDomElement())[v];
bI=e.getDocumentTop()-(bG+this.getChildControl(B).getBounds().top);
}else{bH=e.getDocumentTop()-(this._valueToPosition(this.getValue())+this.__oe);
bG=qx.bom.element.Location.get(this.getContentElement().getDomElement())[w];
bI=e.getDocumentLeft()-(bG+this.getChildControl(B).getBounds().left);
}
if(bI<0||bI>this.__og||bH<0||bH>this.__og){this.getChildControl(B).removeState(x);
}}}else if(this.__oj){this.__om.stop();
this.releaseCapture();
delete this.__oj;
delete this.__ok;
delete this.__ol;
}this.removeListener(bm,this._onMouseMove);
if(e.getType()===u){e.stopPropagation();
}},_onMouseMove:function(e){if(this.__oh){var bq=this.__oo?e.getDocumentLeft():e.getDocumentTop();
var bp=bq-this.__oi;
this.slideTo(this._positionToValue(bp));
}else if(this.__oj){this.__op(e);
}e.stopPropagation();
},_onInterval:function(e){var b=this.getValue()+(this.__ok*this.getPageStep());
if(b<this.getMinimum()){b=this.getMinimum();
}else if(b>this.getMaximum()){b=this.getMaximum();
}var c=this.__ok==-1;

if((c&&b<=this.__ol)||(!c&&b>=this.__ol)){b=this.__ol;
}this.slideTo(b);
},_onUpdate:function(e){var bY=this.getInnerSize();
var ca=this.getChildControl(B).getBounds();
var bX=this.__oo?S:K;
this._updateKnobSize();
this.__on=bY[bX]-ca[bX];
this.__og=ca[bX];
this._updateKnobPosition();
},__oo:false,__on:0,__op:function(e){var br=this.__oo;
var by=br?e.getDocumentLeft():e.getDocumentTop();
var bA=this.__oe;
var bs=this.__of;
var bC=this.__og;
var bz=by-bA;

if(by>=bs){bz-=bC;
}var bw=this._positionToValue(bz);
var bt=this.getMinimum();
var bu=this.getMaximum();

if(bw<bt){bw=bt;
}else if(bw>bu){bw=bu;
}else{var bx=this.getValue();
var bv=this.getPageStep();
var bB=this.__ok<0?Y:ba;
bw=bx+(Math[bB]((bw-bx)/bv)*bv);
}if(this.__ol==null||(this.__ok==-1&&bw<=this.__ol)||(this.__ok==1&&bw>=this.__ol)){this.__ol=bw;
}},_positionToValue:function(d){var f=this.__on;
if(f==null||f==0){return 0;
}var h=d/f;

if(h<0){h=0;
}else if(h>1){h=1;
}var g=this.getMaximum()-this.getMinimum();
return this.getMinimum()+Math.round(g*h);
},_valueToPosition:function(i){var j=this.__on;

if(j==null){return 0;
}var k=this.getMaximum()-this.getMinimum();
if(k==0){return 0;
}var i=i-this.getMinimum();
var l=i/k;

if(l<0){l=0;
}else if(l>1){l=1;
}return Math.round(j*l);
},_updateKnobPosition:function(){this._setKnobPosition(this._valueToPosition(this.getValue()));
},_setKnobPosition:function(cc){var cd=this.getChildControl(B).getContainerElement();

if(this.__oo){cd.setStyle(w,cc+s,true);
}else{cd.setStyle(v,cc+s,true);
}},_updateKnobSize:function(){var r=this.getKnobFactor();

if(r==null){return;
}var q=this.getInnerSize();

if(q==null){return;
}if(this.__oo){this.getChildControl(B).setWidth(Math.round(r*q.width));
}else{this.getChildControl(B).setHeight(Math.round(r*q.height));
}},slideToBegin:function(){this.slideTo(this.getMinimum());
},slideToEnd:function(){this.slideTo(this.getMaximum());
},slideForward:function(){this.slideBy(this.getSingleStep());
},slideBack:function(){this.slideBy(-this.getSingleStep());
},slidePageForward:function(){this.slideBy(this.getPageStep());
},slidePageBack:function(){this.slideBy(-this.getPageStep());
},slideBy:function(a){this.slideTo(this.getValue()+a);
},slideTo:function(cb){if(cb<this.getMinimum()){cb=this.getMinimum();
}else if(cb>this.getMaximum()){cb=this.getMaximum();
}else{cb=this.getMinimum()+Math.round((cb-this.getMinimum())/this.getSingleStep())*this.getSingleStep();
}this.setValue(cb);
},_applyOrientation:function(bL,bM){var bN=this.getChildControl(B);
this.__oo=bL===A;
if(this.__oo){this.removeState(z);
bN.removeState(z);
this.addState(A);
bN.addState(A);
bN.setLayoutProperties({top:0,right:null,bottom:0});
}else{this.removeState(A);
bN.removeState(A);
this.addState(z);
bN.addState(z);
bN.setLayoutProperties({right:0,bottom:null,left:0});
}this._updateKnobPosition();
},_applyKnobFactor:function(m,n){if(m!=null){this._updateKnobSize();
}else{if(this.__oo){this.getChildControl(B).resetWidth();
}else{this.getChildControl(B).resetHeight();
}}},_applyValue:function(bE,bF){if(bE!=null){this._updateKnobPosition();
}else{this.resetValue();
}},_applyMinimum:function(bJ,bK){if(this.getValue()<bJ){this.setValue(bJ);
}this._updateKnobPosition();
},_applyMaximum:function(o,p){if(this.getValue()>o){this.setValue(o);
}this._updateKnobPosition();
}}});
})();
(function(){var c="mousewheel",b="qx.ui.core.scroll.ScrollSlider",a="keypress";
qx.Class.define(b,{extend:qx.ui.form.Slider,construct:function(d){qx.ui.form.Slider.call(this,d);
this.removeListener(a,this._onKeyPress);
this.removeListener(c,this._onMouseWheel);
}});
})();
(function(){var a="qx.ui.table.pane.Clipper";
qx.Class.define(a,{extend:qx.ui.container.Composite,construct:function(){qx.ui.container.Composite.call(this,new qx.ui.layout.Grow());
this.setMinWidth(0);
},members:{scrollToX:function(b){this.getContentElement().scrollToX(b,false);
},scrollToY:function(c){this.getContentElement().scrollToY(c,true);
}}});
})();
(function(){var p="Integer",o="Escape",n="keypress",m="Enter",l="excluded",k="qx.ui.table.pane.FocusIndicator";
qx.Class.define(k,{extend:qx.ui.container.Composite,construct:function(q){qx.ui.container.Composite.call(this);
this.__oq=q;
this.setKeepActive(true);
this.addListener(n,this._onKeyPress,this);
},properties:{visibility:{refine:true,init:l},row:{check:p,nullable:true},column:{check:p,nullable:true}},members:{__oq:null,_onKeyPress:function(e){var j=e.getKeyIdentifier();

if(j!==o&&j!==m){e.stopPropagation();
}},moveToCell:function(a,b){if(a==null){this.hide();
this.setRow(null);
this.setColumn(null);
}else{var c=this.__oq.getTablePaneModel().getX(a);

if(c==-1){this.hide();
this.setRow(null);
this.setColumn(null);
}else{var i=this.__oq.getTable();
var g=i.getTableColumnModel();
var h=this.__oq.getTablePaneModel();
var f=this.__oq.getTablePane().getFirstVisibleRow();
var d=i.getRowHeight();
this.setUserBounds(h.getColumnLeft(a)-2,(b-f)*d-2,g.getColumnWidth(a)+3,d+3);
this.show();
this.setRow(b);
this.setColumn(a);
}}}},destruct:function(){this.__oq=null;
}});
})();
(function(){var b="Integer",a="qx.ui.table.pane.CellEvent";
qx.Class.define(a,{extend:qx.event.type.Mouse,properties:{row:{check:b,nullable:true},column:{check:b,nullable:true}},members:{init:function(e,f,g,h){f.clone(this);
this.setBubbles(false);

if(g!=null){this.setRow(g);
}else{this.setRow(e._getRowForPagePos(this.getDocumentLeft(),this.getDocumentTop()));
}
if(h!=null){this.setColumn(h);
}else{this.setColumn(e._getColumnForPageX(this.getDocumentLeft()));
}},clone:function(c){var d=qx.event.type.Mouse.prototype.clone.call(this,c);
d.set({row:this.getRow(),column:this.getColumn()});
return d;
}}});
})();
(function(){var d="qx.lang.Number";
qx.Class.define(d,{statics:{isInRange:function(e,f,g){return e>=f&&e<=g;
},isBetweenRange:function(a,b,c){return a>b&&a<c;
},limit:function(h,i,j){if(j!=null&&h>j){return j;
}else if(i!=null&&h<i){return i;
}else{return h;
}}}});
})();
(function(){var l="Number",k="qx.event.type.Event",j="_applyFirstColumnX",i="Integer",h="qx.ui.table.pane.Model",g="_applyMaxColumnCount",f="visibilityChangedPre";
qx.Class.define(h,{extend:qx.core.Object,construct:function(a){qx.core.Object.call(this);
a.addListener(f,this._onColVisibilityChanged,this);
this.__or=a;
},events:{"modelChanged":k},statics:{EVENT_TYPE_MODEL_CHANGED:"modelChanged"},properties:{firstColumnX:{check:i,init:0,apply:j},maxColumnCount:{check:l,init:-1,apply:g}},members:{__os:null,__or:null,_applyFirstColumnX:function(v,w){this.__os=null;
this.fireEvent(qx.ui.table.pane.Model.EVENT_TYPE_MODEL_CHANGED);
},_applyMaxColumnCount:function(t,u){this.__os=null;
this.fireEvent(qx.ui.table.pane.Model.EVENT_TYPE_MODEL_CHANGED);
},setTableColumnModel:function(A){this.__or=A;
this.__os=null;
},_onColVisibilityChanged:function(e){this.__os=null;
this.fireEvent(qx.ui.table.pane.Model.EVENT_TYPE_MODEL_CHANGED);
},getColumnCount:function(){if(this.__os==null){var b=this.getFirstColumnX();
var d=this.getMaxColumnCount();
var c=this.__or.getVisibleColumnCount();

if(d==-1||(b+d)>c){this.__os=c-b;
}else{this.__os=d;
}}return this.__os;
},getColumnAtX:function(y){var z=this.getFirstColumnX();
return this.__or.getVisibleColumnAtX(z+y);
},getX:function(B){var C=this.getFirstColumnX();
var D=this.getMaxColumnCount();
var x=this.__or.getVisibleX(B)-C;

if(x>=0&&(D==-1||x<D)){return x;
}else{return -1;
}},getColumnLeft:function(p){var s=0;
var r=this.getColumnCount();

for(var x=0;x<r;x++){var q=this.getColumnAtX(x);

if(q==p){return s;
}s+=this.__or.getColumnWidth(q);
}return -1;
},getTotalWidth:function(){var m=0;
var n=this.getColumnCount();

for(var x=0;x<n;x++){var o=this.getColumnAtX(x);
m+=this.__or.getColumnWidth(o);
}return m;
}},destruct:function(){this.__or=null;
}});
})();
(function(){var C="",B="!",A="'!",z="'",y="Expected '",x="' (rgb(",w=",",v=")), but found value '",u="Event (",t="Expected value to be the CSS color '",bI="' but found ",bH="The value '",bG="qx.core.Object",bF="Expected value to be an array but found ",bE=") was fired.",bD="Expected value to be an integer >= 0 but found ",bC="' to be not equal with '",bB="' to '",bA="qx.ui.core.Widget",bz="Called assertTrue with '",J="Expected value to be a map but found ",K="The function did not raise an exception!",H="Expected value to be undefined but found ",I="Expected value to be a DOM element but found  '",F="Expected value to be a regular expression but found ",G="' to implement the interface '",D="Expected value to be null but found ",E="Invalid argument 'type'",R="Called assert with 'false'",S="Assertion error! ",bf="Expected value to be a string but found ",bb="null",bn="' but found '",bi="' must must be a key of the map '",bv="The String '",bs="Expected value not to be undefined but found ",W="qx.util.ColorUtil",by=": ",bx="The raised exception does not have the expected type! ",bw=") not fired.",V="qx.core.Assert",Y="Expected value to be typeof object but found ",ba="' (identical) but found '",bd="' must have any of the values defined in the array '",bg="Expected value to be a number but found ",bj="Called assertFalse with '",bp="]",bu="Expected value to be a qooxdoo object but found ",L="' arguments.",M="Expected value not to be null but found ",X="Array[",bm="' does not match the regular expression '",bl="' to be not identical with '",bk="' arguments but found '",br="', which cannot be converted to a CSS color!",bq="Expected object '",bh="qx.core.AssertionError",bo="Expected value to be a boolean but found ",q="))!",bt="Expected value to be a qooxdoo widget but found ",N="Expected value '%1' to be in the range '%2'..'%3'!",O="Expected value to be typeof '",bc="Expected value to be typeof function but found ",r="Expected value to be an integer but found ",s="Called fail().",U="The parameter 're' must be a string or a regular expression.",P="Expected value to be a number >= 0 but found ",Q="Expected value to be instanceof '",T="Wrong number of arguments given. Expected '",be="object";
qx.Class.define(V,{statics:{__ot:true,__ou:function(cs,ct){var cu=C;

for(var i=1,l=arguments.length;i<l;i++){cu=cu+this.__ov(arguments[i]);
}var cw=S+cs+by+cu;

if(this.__ot){qx.Bootstrap.error(cw);
}
if(qx.Class.isDefined(bh)){var cv=new qx.core.AssertionError(cs,cu);

if(this.__ot){qx.Bootstrap.error("Stack trace: \n"+cv.getStackTrace());
}throw cv;
}else{throw new Error(cw);
}},__ov:function(cx){var cy;

if(cx===null){cy=bb;
}else if(qx.lang.Type.isArray(cx)&&cx.length>10){cy=X+cx.length+bp;
}else if((cx instanceof Object)&&(cx.toString==null)){cy=qx.lang.Json.stringify(cx,null,2);
}else{try{cy=cx.toString();
}catch(e){cy=C;
}}return cy;
},assert:function(dr,ds){dr==true||this.__ou(ds||C,R);
},fail:function(f){this.__ou(f||C,s);
},assertTrue:function(ch,ci){(ch===true)||this.__ou(ci||C,bz,ch,z);
},assertFalse:function(da,db){(da===false)||this.__ou(db||C,bj,da,z);
},assertEquals:function(g,h,j){g==h||this.__ou(j||C,y,g,bn,h,A);
},assertNotEquals:function(de,df,dg){de!=df||this.__ou(dg||C,y,de,bC,df,A);
},assertIdentical:function(dv,dw,dx){dv===dw||this.__ou(dx||C,y,dv,ba,dw,A);
},assertNotIdentical:function(bX,bY,ca){bX!==bY||this.__ou(ca||C,y,bX,bl,bY,A);
},assertNotUndefined:function(cb,cc){cb!==undefined||this.__ou(cc||C,bs,cb,B);
},assertUndefined:function(dc,dd){dc===undefined||this.__ou(dd||C,H,dc,B);
},assertNotNull:function(cd,ce){cd!==null||this.__ou(ce||C,M,cd,B);
},assertNull:function(c,d){c===null||this.__ou(d||C,D,c,B);
},assertJsonEquals:function(dn,dp,dq){this.assertEquals(qx.lang.Json.stringify(dn),qx.lang.Json.stringify(dp),dq);
},assertMatch:function(cU,cV,cW){this.assertString(cU);
this.assert(qx.lang.Type.isRegExp(cV)||qx.lang.Type.isString(cV),U);
cU.search(cV)>=0||this.__ou(cW||C,bv,cU,bm,cV.toString(),A);
},assertArgumentsCount:function(bN,bO,bP,bQ){var bR=bN.length;
(bR>=bO&&bR<=bP)||this.__ou(bQ||C,T,bO,bB,bP,bk,arguments.length,L);
},assertEventFired:function(dy,event,dz,dA,dB){var dD=false;
var dC=function(e){if(dA){dA.call(dy,e);
}dD=true;
};
var dE=dy.addListener(event,dC,dy);
dz.call();
dD===true||this.__ou(dB||C,u,event,bw);
dy.removeListenerById(dE);
},assertEventNotFired:function(cz,event,cA,cB){var cD=false;
var cC=function(e){cD=true;
};
var cE=cz.addListener(event,cC,cz);
cA.call();
cD===false||this.__ou(cB||C,u,event,bE);
cz.removeListenerById(cE);
},assertException:function(cL,cM,cN,cO){var cM=cM||Error;
var cP;

try{this.__ot=false;
cL();
}catch(bM){cP=bM;
}finally{this.__ot=true;
}
if(cP==null){this.__ou(cO||C,K);
}cP instanceof cM||this.__ou(cO||C,bx,cM);

if(cN){this.assertMatch(cP.toString(),cN,cO);
}},assertInArray:function(k,m,n){m.indexOf(k)!==-1||this.__ou(n||C,bH,k,bd,m,z);
},assertArrayEquals:function(dF,dG,dH){this.assertArray(dF,dH);
this.assertArray(dG,dH);
this.assertEquals(dF.length,dG.length,dH);

for(var i=0;i<dF.length;i++){this.assertIdentical(dF[i],dG[i],dH);
}},assertKeyInMap:function(dL,dM,dN){dM[dL]!==undefined||this.__ou(dN||C,bH,dL,bi,dM,z);
},assertFunction:function(dt,du){qx.lang.Type.isFunction(dt)||this.__ou(du||C,bc,dt,B);
},assertString:function(cJ,cK){qx.lang.Type.isString(cJ)||this.__ou(cK||C,bf,cJ,B);
},assertBoolean:function(cq,cr){qx.lang.Type.isBoolean(cq)||this.__ou(cr||C,bo,cq,B);
},assertNumber:function(dj,dk){(qx.lang.Type.isNumber(dj)&&isFinite(dj))||this.__ou(dk||C,bg,dj,B);
},assertPositiveNumber:function(cQ,cR){(qx.lang.Type.isNumber(cQ)&&isFinite(cQ)&&cQ>=0)||this.__ou(cR||C,P,cQ,B);
},assertInteger:function(a,b){(qx.lang.Type.isNumber(a)&&isFinite(a)&&a%1===0)||this.__ou(b||C,r,a,B);
},assertPositiveInteger:function(bJ,bK){var bL=(qx.lang.Type.isNumber(bJ)&&isFinite(bJ)&&bJ%1===0&&bJ>=0);
bL||this.__ou(bK||C,bD,bJ,B);
},assertInRange:function(cF,cG,cH,cI){(cF>=cG&&cF<=cH)||this.__ou(cI||C,qx.lang.String.format(N,[cF,cG,cH]));
},assertObject:function(dI,dJ){var dK=dI!==null&&(qx.lang.Type.isObject(dI)||typeof dI===be);
dK||this.__ou(dJ||C,Y,(dI),B);
},assertArray:function(dh,di){qx.lang.Type.isArray(dh)||this.__ou(di||C,bF,dh,B);
},assertMap:function(cf,cg){qx.lang.Type.isObject(cf)||this.__ou(cg||C,J,cf,B);
},assertRegExp:function(cS,cT){qx.lang.Type.isRegExp(cS)||this.__ou(cT||C,F,cS,B);
},assertType:function(dU,dV,dW){this.assertString(dV,E);
typeof (dU)===dV||this.__ou(dW||C,O,dV,bI,dU,B);
},assertInstance:function(bS,bT,bU){var bV=bT.classname||bT+C;
bS instanceof bT||this.__ou(bU||C,Q,bV,bI,bS,B);
},assertInterface:function(dR,dS,dT){qx.Class.implementsInterface(dR,dS)||this.__ou(dT||C,bq,dR,G,dS,A);
},assertCssColor:function(cj,ck,cl){var cm=qx.Class.getByName(W);

if(!cm){throw new Error("qx.util.ColorUtil not available! Your code must have a dependency on 'qx.util.ColorUtil'");
}var co=cm.stringToRgb(cj);

try{var cn=cm.stringToRgb(ck);
}catch(bW){this.__ou(cl||C,t,cj,x,co.join(w),v,ck,br);
}var cp=co[0]==cn[0]&&co[1]==cn[1]&&co[2]==cn[2];
cp||this.__ou(cl||C,t,co,x,co.join(w),v,ck,x,cn.join(w),q);
},assertElement:function(o,p){!!(o&&o.nodeType===1)||this.__ou(p||C,I,o,A);
},assertQxObject:function(dl,dm){this.__ow(dl,bG)||this.__ou(dm||C,bu,dl,B);
},assertQxWidget:function(cX,cY){this.__ow(cX,bA)||this.__ou(cY||C,bt,cX,B);
},__ow:function(dO,dP){if(!dO){return false;
}var dQ=dO.constructor;

while(dQ){if(dQ.classname===dP){return true;
}dQ=dQ.superclass;
}return false;
}}});
})();
(function(){var s='',r='"',q=':',p=']',o='null',m=': ',l='object',h='function',g=',',f='\n',bd='\\u',bc=',\n',bb='0000',ba='string',Y="Cannot stringify a recursive object.",X='0',W='-',V='}',U='String',T='Boolean',A='\\\\',B='\\f',y='\\t',z='{\n',w='[]',x="qx.lang.JsonImpl",t='Z',u='\\n',C='Object',D='{}',K='@',I='.',N='(',M='Array',P='T',O='\\r',F='{',S='JSON.parse',R=' ',Q='[',E='Number',G=')',H='[\n',J='\\"',L='\\b';
qx.Class.define(x,{extend:Object,construct:function(){this.stringify=qx.lang.Function.bind(this.stringify,this);
this.parse=qx.lang.Function.bind(this.parse,this);
},members:{__ox:null,__oy:null,__oz:null,__oA:null,stringify:function(bk,bl,bm){this.__ox=s;
this.__oy=s;
this.__oA=[];

if(qx.lang.Type.isNumber(bm)){var bm=Math.min(10,Math.floor(bm));

for(var i=0;i<bm;i+=1){this.__oy+=R;
}}else if(qx.lang.Type.isString(bm)){if(bm.length>10){bm=bm.slice(0,10);
}this.__oy=bm;
}if(bl&&(qx.lang.Type.isFunction(bl)||qx.lang.Type.isArray(bl))){this.__oz=bl;
}else{this.__oz=null;
}return this.__oB(s,{'':bk});
},__oB:function(be,bf){var bi=this.__ox,bg,bj=bf[be];
if(bj&&qx.lang.Type.isFunction(bj.toJSON)){bj=bj.toJSON(be);
}else if(qx.lang.Type.isDate(bj)){bj=this.dateToJSON(bj);
}if(typeof this.__oz===h){bj=this.__oz.call(bf,be,bj);
}
if(bj===null){return o;
}
if(bj===undefined){return undefined;
}switch(qx.lang.Type.getClass(bj)){case U:return this.__oC(bj);
case E:return isFinite(bj)?String(bj):o;
case T:return String(bj);
case M:this.__ox+=this.__oy;
bg=[];

if(this.__oA.indexOf(bj)!==-1){throw new TypeError(Y);
}this.__oA.push(bj);
var length=bj.length;

for(var i=0;i<length;i+=1){bg[i]=this.__oB(i,bj)||o;
}this.__oA.pop();
if(bg.length===0){var bh=w;
}else if(this.__ox){bh=H+this.__ox+bg.join(bc+this.__ox)+f+bi+p;
}else{bh=Q+bg.join(g)+p;
}this.__ox=bi;
return bh;
case C:this.__ox+=this.__oy;
bg=[];

if(this.__oA.indexOf(bj)!==-1){throw new TypeError(Y);
}this.__oA.push(bj);
if(this.__oz&&typeof this.__oz===l){var length=this.__oz.length;

for(var i=0;i<length;i+=1){var k=this.__oz[i];

if(typeof k===ba){var v=this.__oB(k,bj);

if(v){bg.push(this.__oC(k)+(this.__ox?m:q)+v);
}}}}else{for(var k in bj){if(Object.hasOwnProperty.call(bj,k)){var v=this.__oB(k,bj);

if(v){bg.push(this.__oC(k)+(this.__ox?m:q)+v);
}}}}this.__oA.pop();
if(bg.length===0){var bh=D;
}else if(this.__ox){bh=z+this.__ox+bg.join(bc+this.__ox)+f+bi+V;
}else{bh=F+bg.join(g)+V;
}this.__ox=bi;
return bh;
}},dateToJSON:function(b){var d=function(n){return n<10?X+n:n;
};
var e=function(n){var bn=d(n);
return n<100?X+bn:bn;
};
return isFinite(b.valueOf())?b.getUTCFullYear()+W+d(b.getUTCMonth()+1)+W+d(b.getUTCDate())+P+d(b.getUTCHours())+q+d(b.getUTCMinutes())+q+d(b.getUTCSeconds())+I+e(b.getUTCMilliseconds())+t:null;
},__oC:function(bo){var bp={'\b':L,'\t':y,'\n':u,'\f':B,'\r':O,'"':J,'\\':A};
var bq=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
bq.lastIndex=0;

if(bq.test(bo)){return r+
bo.replace(bq,function(a){var c=bp[a];
return typeof c===ba?c:bd+(bb+a.charCodeAt(0).toString(16)).slice(-4);
})+r;
}else{return r+bo+r;
}},parse:function(bv,bw){var bx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
bx.lastIndex=0;
if(bx.test(bv)){bv=bv.replace(bx,function(a){return bd+(bb+a.charCodeAt(0).toString(16)).slice(-4);
});
}if(/^[\],:{}\s]*$/.test(bv.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,K).replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,p).replace(/(?:^|:|,)(?:\s*\[)+/g,s))){var j=eval(N+bv+G);
return typeof bw===h?this.__oD({'':j},s,bw):j;
}throw new SyntaxError(S);
},__oD:function(br,bs,bt){var bu=br[bs];

if(bu&&typeof bu===l){for(var k in bu){if(Object.hasOwnProperty.call(bu,k)){var v=this.__oD(bu,k,bt);

if(v!==undefined){bu[k]=v;
}else{delete bu[k];
}}}}return bt.call(br,bs,bu);
}}});
})();
(function(){var a="qx.lang.Json";
qx.Class.define(a,{statics:{JSON:(qx.lang.Type.getClass(window.JSON)=="JSON"&&JSON.parse('{"x":1}').x===1)?window.JSON:new qx.lang.JsonImpl(),stringify:null,parse:null},defer:function(b){b.stringify=b.JSON.stringify;
b.parse=b.JSON.parse;
}});
})();
(function(){var k="",j="Function",h="qx.ui.table.celleditor.ComboBox",g="number",f="Array",e="table-editor-combobox",d="appear";
qx.Class.define(h,{extend:qx.core.Object,implement:qx.ui.table.ICellEditorFactory,properties:{validationFunction:{check:j,nullable:true,init:null},listData:{check:f,init:null,nullable:true}},members:{createCellEditor:function(m){var o=new qx.ui.form.ComboBox().set({appearance:e});
var p=m.value;
o.originalValue=p;
var s=m.table.getTableColumnModel().getDataCellRenderer(m.col);
var q=s._getContentHtml(m);

if(p!=q){p=q;
}if(p===null||p===undefined){p=k;
}var n=this.getListData();

if(n){var r;

for(var i=0,l=n.length;i<l;i++){var t=n[i];

if(t instanceof Array){r=new qx.ui.form.ListItem(t[0],t[1]);
}else{r=new qx.ui.form.ListItem(t,null);
}o.add(r);
}}o.setValue(k+p);
o.addListener(d,function(){o.selectAllText();
});
return o;
},getCellEditorValue:function(a){var c=a.getValue()||k;
var b=this.getValidationFunction();

if(b){c=b(c,a.originalValue);
}
if(typeof a.originalValue==g){c=parseFloat(c);
}return c;
}}});
})();
(function(){var D="popup",C="list",B="",A="mousewheel",z="resize",y="Function",x="blur",w="abstract",v="keypress",u="Number",n="changeSelection",t="PageUp",q="_applyMaxListHeight",l="PageDown",k="mouseup",p="Escape",o="changeVisibility",r="one",j="middle",s="qx.ui.form.AbstractSelectBox",m="mousedown";
qx.Class.define(s,{extend:qx.ui.core.Widget,include:[qx.ui.core.MRemoteChildrenHandling,qx.ui.form.MForm],implement:[qx.ui.form.IForm],type:w,construct:function(){qx.ui.core.Widget.call(this);
var J=new qx.ui.layout.HBox();
this._setLayout(J);
J.setAlignY(j);
this.addListener(v,this._onKeyPress);
this.addListener(x,this._onBlur,this);
var I=qx.core.Init.getApplication().getRoot();
I.addListener(A,this._onMousewheel,this,true);
this.addListener(z,this._onResize,this);
},properties:{focusable:{refine:true,init:true},width:{refine:true,init:120},maxListHeight:{check:u,apply:q,nullable:true,init:200},format:{check:y,init:function(G){return this._defaultFormat(G);
},nullable:true}},members:{_createChildControlImpl:function(f){var g;

switch(f){case C:g=new qx.ui.form.List().set({focusable:false,keepFocus:true,height:null,width:null,maxHeight:this.getMaxListHeight(),selectionMode:r,quickSelection:true});
g.addListener(n,this._onListChangeSelection,this);
g.addListener(m,this._onListMouseDown,this);
break;
case D:g=new qx.ui.popup.Popup(new qx.ui.layout.VBox);
g.setAutoHide(false);
g.setKeepActive(true);
g.addListener(k,this.close,this);
g.add(this.getChildControl(C));
g.addListener(o,this._onPopupChangeVisibility,this);
break;
}return g||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,f);
},_applyMaxListHeight:function(h,i){this.getChildControl(C).setMaxHeight(h);
},getChildrenContainer:function(){return this.getChildControl(C);
},open:function(){var H=this.getChildControl(D);
H.placeToWidget(this,true);
H.show();
},close:function(){this.getChildControl(D).hide();
},toggle:function(){var a=this.getChildControl(D).isVisible();

if(a){this.close();
}else{this.open();
}},_defaultFormat:function(K){var L=K?K.getLabel():B;
var M=K?K.getRich():false;

if(M){L=L.replace(/<[^>]+?>/g,B);
L=qx.bom.String.unescape(L);
}return L;
},_onBlur:function(e){this.close();
},_onKeyPress:function(e){var E=e.getKeyIdentifier();
var F=this.getChildControl(D);
if(F.isHidden()&&(E==l||E==t)){e.stopPropagation();
}else if(!F.isHidden()&&E==p){this.close();
e.stop();
}else{this.getChildControl(C).handleKeyPress(e);
}},_onMousewheel:function(e){var c=e.getTarget();
var b=this.getChildControl(D);

if(qx.ui.core.Widget.contains(b,c)){e.preventDefault();
}else{this.close();
}},_onResize:function(e){this.getChildControl(D).setMinWidth(e.getData().width);
},_onListChangeSelection:function(e){throw new Error("Abstract method: _onListChangeSelection()");
},_onListMouseDown:function(e){throw new Error("Abstract method: _onListMouseDown()");
},_onPopupChangeVisibility:function(e){throw new Error("Abstract method: _onPopupChangeVisibility()");
}},destruct:function(){var d=qx.core.Init.getApplication().getRoot();

if(d){d.removeListener(A,this._onMousewheel,this,true);
}}});
})();
(function(){var w="textfield",v="button",u="list",t="selected",s="focusout",r="inner",q="changeValue",p="popup",o="focusin",n="combobox",g="click",m="blur",j="Enter",f="quick",d="_applyPlaceholder",i="qx.ui.form.ComboBox",h="single",k="Down",c="String",l="qx.event.type.Data";
qx.Class.define(i,{extend:qx.ui.form.AbstractSelectBox,implement:[qx.ui.form.IStringForm],construct:function(){qx.ui.form.AbstractSelectBox.call(this);
var R=this._createChildControl(w);
this._createChildControl(v);
this.addListener(g,this._onClick);
this.addListener(o,function(e){R.fireNonBubblingEvent(o,qx.event.type.Focus);
},this);
this.addListener(s,function(e){R.fireNonBubblingEvent(s,qx.event.type.Focus);
},this);
},properties:{appearance:{refine:true,init:n},placeholder:{check:c,nullable:true,apply:d}},events:{"changeValue":l},members:{__oE:null,__oF:null,_applyPlaceholder:function(G,H){this.getChildControl(w).setPlaceholder(G);
},_createChildControlImpl:function(B){var C;

switch(B){case w:C=new qx.ui.form.TextField();
C.setFocusable(false);
C.addState(r);
C.addListener(q,this._onTextFieldChangeValue,this);
C.addListener(m,this.close,this);
this._add(C,{flex:1});
break;
case v:C=new qx.ui.form.Button();
C.setFocusable(false);
C.setKeepActive(true);
C.addState(r);
this._add(C);
break;
case u:C=qx.ui.form.AbstractSelectBox.prototype._createChildControlImpl.call(this,B);
C.setSelectionMode(h);
break;
}return C||qx.ui.form.AbstractSelectBox.prototype._createChildControlImpl.call(this,B);
},_forwardStates:{focused:true},tabFocus:function(){var x=this.getChildControl(w);
x.getFocusElement().focus();
x.selectAllText();
},setValue:function(I){var J=this.getChildControl(w);

if(J.getValue()==I){return;
}J.setValue(I);
},getValue:function(){return this.getChildControl(w).getValue();
},resetValue:function(){this.getChildControl(w).setValue(null);
},_onKeyPress:function(e){var b=this.getChildControl(p);
var a=e.getKeyIdentifier();

if(a==k&&e.isAltPressed()){this.getChildControl(v).addState(t);
this.toggle();
e.stopPropagation();
}else if(a==j){if(b.isVisible()){this.close();
e.stop();
}}else if(b.isVisible()){qx.ui.form.AbstractSelectBox.prototype._onKeyPress.call(this,e);
}},_onClick:function(e){var F=e.getTarget();

if(F==this.getChildControl(v)){this.toggle();
}else{this.close();
}},_onListMouseDown:function(e){if(this.__oE){var S=this.__oE.getLabel();

if(this.getFormat()!=null){S=this.getFormat().call(this,this.__oE);
}if(S&&S.translate){S=S.translate();
}this.setValue(S);
this.__oE=null;
}},_onListChangeSelection:function(e){var K=e.getData();

if(K.length>0){var L=this.getChildControl(u);

if(L.getSelectionContext()==f){this.__oE=K[0];
}else{var M=K[0].getLabel();

if(this.getFormat()!=null){M=this.getFormat().call(this,K[0]);
}if(M&&M.translate){M=M.translate();
}this.setValue(M);
this.__oE=null;
}}},_onPopupChangeVisibility:function(e){var O=this.getChildControl(p);

if(O.isVisible()){var P=this.getChildControl(u);
var Q=this.getValue();
var N=null;

if(Q){N=P.findItem(Q);
}
if(N){P.setSelection([N]);
}else{P.resetSelection();
}}else{this.tabFocus();
}this.getChildControl(v).removeState(t);
},_onTextFieldChangeValue:function(e){var A=e.getData();
var z=this.getChildControl(u);

if(A!=null){var y=z.findItem(A,false);

if(y){z.setSelection([y]);
}else{z.resetSelection();
}}else{z.resetSelection();
}this.fireDataEvent(q,A,e.getOldData());
},getTextSelection:function(){return this.getChildControl(w).getTextSelection();
},getTextSelectionLength:function(){return this.getChildControl(w).getTextSelectionLength();
},setTextSelection:function(D,E){this.getChildControl(w).setTextSelection(D,E);
},clearTextSelection:function(){this.getChildControl(w).clearTextSelection();
},selectAllText:function(){this.getChildControl(w).selectAllText();
}}});
})();
(function(){var R="scrollbar-y",Q="scrollbar-x",P="pane",O="auto",N="corner",M="on",L="changeVisibility",K="scroll",J="_computeScrollbars",I="off",B="scrollY",H="qx.ui.core.scroll.AbstractScrollArea",E="abstract",z="update",y="scrollX",D="mousewheel",C="scrollbarY",F="scrollbarX",x="horizontal",G="scrollarea",A="vertical";
qx.Class.define(H,{extend:qx.ui.core.Widget,include:qx.ui.core.scroll.MScrollBarFactory,type:E,construct:function(){qx.ui.core.Widget.call(this);
var u=new qx.ui.layout.Grid();
u.setColumnFlex(0,1);
u.setRowFlex(0,1);
this._setLayout(u);
this.addListener(D,this._onMouseWheel,this);
},properties:{appearance:{refine:true,init:G},width:{refine:true,init:100},height:{refine:true,init:200},scrollbarX:{check:[O,M,I],init:O,themeable:true,apply:J},scrollbarY:{check:[O,M,I],init:O,themeable:true,apply:J},scrollbar:{group:[F,C]}},members:{_createChildControlImpl:function(Y){var ba;

switch(Y){case P:ba=new qx.ui.core.scroll.ScrollPane();
ba.addListener(z,this._computeScrollbars,this);
ba.addListener(y,this._onScrollPaneX,this);
ba.addListener(B,this._onScrollPaneY,this);
this._add(ba,{row:0,column:0});
break;
case Q:ba=this._createScrollBar(x);
ba.setMinWidth(0);
ba.exclude();
ba.addListener(K,this._onScrollBarX,this);
ba.addListener(L,this._onChangeScrollbarXVisibility,this);
this._add(ba,{row:1,column:0});
break;
case R:ba=this._createScrollBar(A);
ba.setMinHeight(0);
ba.exclude();
ba.addListener(K,this._onScrollBarY,this);
ba.addListener(L,this._onChangeScrollbarYVisibility,this);
this._add(ba,{row:0,column:1});
break;
case N:ba=new qx.ui.core.Widget();
ba.setWidth(0);
ba.setHeight(0);
ba.exclude();
this._add(ba,{row:1,column:1});
break;
}return ba||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,Y);
},getPaneSize:function(){return this.getChildControl(P).getInnerSize();
},getItemTop:function(t){return this.getChildControl(P).getItemTop(t);
},getItemBottom:function(w){return this.getChildControl(P).getItemBottom(w);
},getItemLeft:function(v){return this.getChildControl(P).getItemLeft(v);
},getItemRight:function(X){return this.getChildControl(P).getItemRight(X);
},scrollToX:function(S){qx.ui.core.queue.Manager.flush();
this.getChildControl(Q).scrollTo(S);
},scrollByX:function(a){qx.ui.core.queue.Manager.flush();
this.getChildControl(Q).scrollBy(a);
},getScrollX:function(){var T=this.getChildControl(Q,true);
return T?T.getPosition():0;
},scrollToY:function(s){qx.ui.core.queue.Manager.flush();
this.getChildControl(R).scrollTo(s);
},scrollByY:function(b){qx.ui.core.queue.Manager.flush();
this.getChildControl(R).scrollBy(b);
},getScrollY:function(){var h=this.getChildControl(R,true);
return h?h.getPosition():0;
},_onScrollBarX:function(e){this.getChildControl(P).scrollToX(e.getData());
},_onScrollBarY:function(e){this.getChildControl(P).scrollToY(e.getData());
},_onScrollPaneX:function(e){this.scrollToX(e.getData());
},_onScrollPaneY:function(e){this.scrollToY(e.getData());
},_onMouseWheel:function(e){var V=this._isChildControlVisible(Q);
var W=this._isChildControlVisible(R);
var U=(W)?this.getChildControl(R,true):(V?this.getChildControl(Q,true):null);

if(U){U.scrollBySteps(e.getWheelDelta());
}e.stop();
},_onChangeScrollbarXVisibility:function(e){var f=this._isChildControlVisible(Q);
var g=this._isChildControlVisible(R);

if(!f){this.scrollToX(0);
}f&&g?this._showChildControl(N):this._excludeChildControl(N);
},_onChangeScrollbarYVisibility:function(e){var c=this._isChildControlVisible(Q);
var d=this._isChildControlVisible(R);

if(!d){this.scrollToY(0);
}c&&d?this._showChildControl(N):this._excludeChildControl(N);
},_computeScrollbars:function(){var o=this.getChildControl(P);
var content=o.getChildren()[0];

if(!content){this._excludeChildControl(Q);
this._excludeChildControl(R);
return;
}var i=this.getInnerSize();
var n=o.getInnerSize();
var l=o.getScrollSize();
if(!n||!l){return;
}var p=this.getScrollbarX();
var q=this.getScrollbarY();

if(p===O&&q===O){var m=l.width>i.width;
var r=l.height>i.height;
if((m||r)&&!(m&&r)){if(m){r=l.height>n.height;
}else if(r){m=l.width>n.width;
}}}else{var m=p===M;
var r=q===M;
if(l.width>(m?n.width:i.width)&&p===O){m=true;
}
if(l.height>(m?n.height:i.height)&&q===O){r=true;
}}if(m){var k=this.getChildControl(Q);
k.show();
k.setMaximum(Math.max(0,l.width-n.width));
k.setKnobFactor(n.width/l.width);
}else{this._excludeChildControl(Q);
}
if(r){var j=this.getChildControl(R);
j.show();
j.setMaximum(Math.max(0,l.height-n.height));
j.setKnobFactor(n.height/l.height);
}else{this._excludeChildControl(R);
}}}});
})();
(function(){var b="qx.ui.core.ISingleSelection",a="qx.event.type.Data";
qx.Interface.define(b,{events:{"changeSelection":a},members:{getSelection:function(){return true;
},setSelection:function(c){return arguments.length==1;
},resetSelection:function(){return true;
},isSelected:function(d){return arguments.length==1;
},isSelectionEmpty:function(){return true;
},getSelectables:function(){return true;
}}});
})();
(function(){var a="qx.ui.core.IMultiSelection";
qx.Interface.define(a,{extend:qx.ui.core.ISingleSelection,members:{selectAll:function(){return true;
},addToSelection:function(b){return arguments.length==1;
},removeFromSelection:function(c){return arguments.length==1;
}}});
})();
(function(){var a="qx.ui.form.IModelSelection";
qx.Interface.define(a,{members:{setModelSelection:function(b){},getModelSelection:function(){}}});
})();
(function(){var G="single",F="Boolean",E="one",D="changeSelection",C="mouseup",B="mousedown",A="losecapture",z="multi",y="_applyQuickSelection",x="mouseover",q="_applySelectionMode",w="_applyDragSelection",t="__oG",p="qx.ui.core.MMultiSelectionHandling",o="removeItem",s="keypress",r="qx.event.type.Data",u="addItem",n="additive",v="mousemove";
qx.Mixin.define(p,{construct:function(){var J=this.SELECTION_MANAGER;
var I=this.__oG=new J(this);
this.addListener(B,I.handleMouseDown,I);
this.addListener(C,I.handleMouseUp,I);
this.addListener(x,I.handleMouseOver,I);
this.addListener(v,I.handleMouseMove,I);
this.addListener(A,I.handleLoseCapture,I);
this.addListener(s,I.handleKeyPress,I);
this.addListener(u,I.handleAddItem,I);
this.addListener(o,I.handleRemoveItem,I);
I.addListener(D,this._onSelectionChange,this);
},events:{"changeSelection":r},properties:{selectionMode:{check:[G,z,n,E],init:G,apply:q},dragSelection:{check:F,init:false,apply:w},quickSelection:{check:F,init:false,apply:y}},members:{__oG:null,selectAll:function(){if(!this.getEnabled()){this.warn("Setting the selection on disabled '"+this.classname+"' is deprecated: "+("The current behavior will change from doing nothing to selecting all items."));
this.trace();
}this.__oG.selectAll();
},isSelected:function(H){if(!qx.ui.core.Widget.contains(this,H)){throw new Error("Could not test if "+H+" is selected, because it is not a child element!");
}return this.__oG.isItemSelected(H);
},addToSelection:function(m){if(!this.getEnabled()){this.warn("Setting the selection on disabled '"+this.classname+"' is deprecated: "+("The current behavior will change from doing nothing to selecting the given items."));
this.trace();
}
if(!qx.ui.core.Widget.contains(this,m)){throw new Error("Could not add + "+m+" to selection, because it is not a child element!");
}this.__oG.addItem(m);
},removeFromSelection:function(L){if(!this.getEnabled()){this.warn("Setting the selection on disabled '"+this.classname+"' is deprecated: "+("The current behavior will change from doing nothing to removing the given items."));
this.trace();
}
if(!qx.ui.core.Widget.contains(this,L)){throw new Error("Could not remove "+L+" from selection, because it is not a child element!");
}this.__oG.removeItem(L);
},selectRange:function(a,b){if(!this.getEnabled()){this.warn("Setting the selection on disabled '"+this.classname+"' is deprecated: "+("The current behavior will change from doing nothing to selecting the given items."));
this.trace();
}this.__oG.selectItemRange(a,b);
},resetSelection:function(){if(!this.getEnabled()){this.warn("Resetting the selection on disabled '"+this.classname+"' is deprecated: "+("The current behavior will change from doing nothing to resetting the selection."));
this.trace();
}this.__oG.clearSelection();
},setSelection:function(k){if(!this.getEnabled()){this.warn("Setting the selection on disabled '"+this.classname+"' is deprecated: "+("The current behavior will change from doing nothing to selectiong the given items."));
this.trace();
}
for(var i=0;i<k.length;i++){if(!qx.ui.core.Widget.contains(this,k[i])){throw new Error("Could not select "+k[i]+", because it is not a child element!");
}}
if(k.length===0){this.resetSelection();
}else{var l=this.getSelection();

if(!qx.lang.Array.equals(l,k)){this.__oG.replaceSelection(k);
}}},getSelection:function(){return this.__oG.getSelection();
},getSortedSelection:function(){return this.__oG.getSortedSelection();
},isSelectionEmpty:function(){return this.__oG.isSelectionEmpty();
},getSelectionContext:function(){return this.__oG.getSelectionContext();
},_getManager:function(){return this.__oG;
},getSelectables:function(){return this.__oG.getSelectables();
},invertSelection:function(){if(!this.getEnabled()){this.warn("Setting the selection on disabled '"+this.classname+"' is deprecated: "+("The current behavior will change from doing nothing to selecting the given items."));
this.trace();
}this.__oG.invertSelection();
},_getLeadItem:function(){var K=this.__oG.getMode();

if(K===G||K===E){return this.__oG.getSelectedItem();
}else{return this.__oG.getLeadItem();
}},_applySelectionMode:function(c,d){this.__oG.setMode(c);
},_applyDragSelection:function(f,g){this.__oG.setDrag(f);
},_applyQuickSelection:function(h,j){this.__oG.setQuick(h);
},_onSelectionChange:function(e){this.fireDataEvent(D,e.getData());
}},destruct:function(){this._disposeObjects(t);
}});
})();
(function(){var e="change",d="qx.event.type.Data",c="__oH",b="qx.ui.form.MModelSelection",a="changeSelection";
qx.Mixin.define(b,{construct:function(){this.__oH=new qx.data.Array();
this.__oH.addListener(e,this.__oK,this);
this.addListener(a,this.__oJ,this);
},events:{changeModelSelection:d},members:{__oH:null,__oI:false,__oJ:function(){if(this.__oI){return;
}var q=this.getSelection();
var o=[];

for(var i=0;i<q.length;i++){var r=q[i];
var p=r.getModel?r.getModel():null;

if(p!==null){o.push(p);
}}this.setModelSelection(o);
},__oK:function(){this.__oI=true;
var g=this.getSelectables();
var k=[];
var h=this.__oH.toArray();

for(var i=0;i<h.length;i++){var m=h[i];

for(var j=0;j<g.length;j++){var n=g[j];
var f=n.getModel?n.getModel():null;

if(m===f){k.push(n);
break;
}}}this.setSelection(k);
this.__oI=false;
var l=this.getSelection();

if(!qx.lang.Array.equals(l,k)){this.__oJ();
}},getModelSelection:function(){return this.__oH;
},setModelSelection:function(s){if(!s){this.__oH.removeAll();
return;
}{};
s.unshift(this.__oH.getLength());
s.unshift(0);
var t=this.__oH.splice.apply(this.__oH,s);
t.dispose();
}},destruct:function(){this._disposeObjects(c);
}});
})();
(function(){var S="one",R="single",Q="selected",P="additive",O="multi",N="PageUp",M="under",L="Left",K="lead",J="Down",br="Up",bq="Boolean",bp="PageDown",bo="anchor",bn="End",bm="Home",bl="Right",bk="right",bj="click",bi="above",ba="left",bb="Escape",X="A",Y="Space",V="_applyMode",W="__oO",T="interval",U="changeSelection",bc="qx.event.type.Data",bd="quick",bf="key",be="abstract",bh="drag",bg="qx.ui.core.selection.Abstract";
qx.Class.define(bg,{type:be,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__oL={};
},events:{"changeSelection":bc},properties:{mode:{check:[R,O,P,S],init:R,apply:V},drag:{check:bq,init:false},quick:{check:bq,init:false}},members:{__oM:0,__oN:0,__oO:null,__oP:null,__oQ:null,__oR:null,__oS:null,__oT:null,__oU:null,__oV:null,__oW:null,__oX:null,__oY:null,__pa:null,__pb:null,__pc:null,__pd:null,__oL:null,__pe:null,__pf:null,getSelectionContext:function(){return this.__pc;
},selectAll:function(){var ce=this.getMode();

if(ce==R||ce==S){throw new Error("Can not select all items in selection mode: "+ce);
}this._selectAllItems();
this._fireChange();
},selectItem:function(j){this._setSelectedItem(j);
var k=this.getMode();

if(k!==R&&k!==S){this._setLeadItem(j);
this._setAnchorItem(j);
}this._scrollItemIntoView(j);
this._fireChange();
},addItem:function(cp){var cq=this.getMode();

if(cq===R||cq===S){this._setSelectedItem(cp);
}else{if(!this._getAnchorItem()){this._setAnchorItem(cp);
}this._setLeadItem(cp);
this._addToSelection(cp);
}this._scrollItemIntoView(cp);
this._fireChange();
},removeItem:function(bx){this._removeFromSelection(bx);

if(this.getMode()===S&&this.isSelectionEmpty()){var by=this._getFirstSelectable();

if(by){this.addItem(by);
}if(by==bx){return;
}}
if(this.getLeadItem()==bx){this._setLeadItem(null);
}
if(this._getAnchorItem()==bx){this._setAnchorItem(null);
}this._fireChange();
},selectItemRange:function(G,H){var I=this.getMode();

if(I==R||I==S){throw new Error("Can not select multiple items in selection mode: "+I);
}this._selectItemRange(G,H);
this._setAnchorItem(G);
this._setLeadItem(H);
this._scrollItemIntoView(H);
this._fireChange();
},clearSelection:function(){if(this.getMode()==S){return;
}this._clearSelection();
this._setLeadItem(null);
this._setAnchorItem(null);
this._fireChange();
},replaceSelection:function(ck){var cl=this.getMode();

if(cl==S||cl===R){if(ck.length>1){throw new Error("Could not select more than one items in mode: "+cl+"!");
}
if(ck.length==1){this.selectItem(ck[0]);
}else{this.clearSelection();
}return;
}else{this._replaceMultiSelection(ck);
}},getSelectedItem:function(){var cr=this.getMode();

if(cr===R||cr===S){return this._getSelectedItem()||null;
}throw new Error("The method getSelectedItem() is only supported in 'single' and 'one' selection mode!");
},getSelection:function(){return qx.lang.Object.getValues(this.__oL);
},getSortedSelection:function(){var D=this.getSelectables();
var C=qx.lang.Object.getValues(this.__oL);
C.sort(function(a,b){return D.indexOf(a)-D.indexOf(b);
});
return C;
},isItemSelected:function(m){var n=this._selectableToHashCode(m);
return this.__oL[n]!==undefined;
},isSelectionEmpty:function(){return qx.lang.Object.isEmpty(this.__oL);
},invertSelection:function(){var bN=this.getMode();

if(bN===R||bN===S){throw new Error("The method invertSelection() is only supported in 'multi' and 'additive' selection mode!");
}var bM=this.getSelectables();

for(var i=0;i<bM.length;i++){this._toggleInSelection(bM[i]);
}this._fireChange();
},_setLeadItem:function(cO){var cP=this.__pd;

if(cP!==null){this._styleSelectable(cP,K,false);
}
if(cO!==null){this._styleSelectable(cO,K,true);
}this.__pd=cO;
},_getLeadItem:function(){{};
return this.getLeadItem();
},getLeadItem:function(){return this.__pd!==null?this.__pd:null;
},_setAnchorItem:function(o){var p=this.__pe;

if(p){this._styleSelectable(p,bo,false);
}
if(o){this._styleSelectable(o,bo,true);
}this.__pe=o;
},_getAnchorItem:function(){return this.__pe!==null?this.__pe:null;
},_isSelectable:function(bV){throw new Error("Abstract method call: _isSelectable()");
},_getSelectableFromMouseEvent:function(event){var bs=event.getTarget();
return this._isSelectable(bs)?bs:null;
},_selectableToHashCode:function(cd){throw new Error("Abstract method call: _selectableToHashCode()");
},_styleSelectable:function(cv,cw,cx){throw new Error("Abstract method call: _styleSelectable()");
},_capture:function(){throw new Error("Abstract method call: _capture()");
},_releaseCapture:function(){throw new Error("Abstract method call: _releaseCapture()");
},_getLocation:function(){throw new Error("Abstract method call: _getLocation()");
},_getDimension:function(){throw new Error("Abstract method call: _getDimension()");
},_getSelectableLocationX:function(c){throw new Error("Abstract method call: _getSelectableLocationX()");
},_getSelectableLocationY:function(bw){throw new Error("Abstract method call: _getSelectableLocationY()");
},_getScroll:function(){throw new Error("Abstract method call: _getScroll()");
},_scrollBy:function(bW,bX){throw new Error("Abstract method call: _scrollBy()");
},_scrollItemIntoView:function(bK){throw new Error("Abstract method call: _scrollItemIntoView()");
},getSelectables:function(){throw new Error("Abstract method call: getSelectables()");
},_getSelectableRange:function(cV,cW){throw new Error("Abstract method call: _getSelectableRange()");
},_getFirstSelectable:function(){throw new Error("Abstract method call: _getFirstSelectable()");
},_getLastSelectable:function(){throw new Error("Abstract method call: _getLastSelectable()");
},_getRelatedSelectable:function(bz,bA){throw new Error("Abstract method call: _getRelatedSelectable()");
},_getPage:function(g,h){throw new Error("Abstract method call: _getPage()");
},_applyMode:function(cm,cn){this._setLeadItem(null);
this._setAnchorItem(null);
this._clearSelection();
if(cm===S){var co=this._getFirstSelectable();

if(co){this._setSelectedItem(co);
this._scrollItemIntoView(co);
}}this._fireChange();
},handleMouseOver:function(event){if(!this.getQuick()){return;
}var ca=this.getMode();

if(ca!==S&&ca!==R){return;
}var bY=this._getSelectableFromMouseEvent(event);

if(bY===null){return;
}this._setSelectedItem(bY);
this._fireChange(bd);
},handleMouseDown:function(event){var cg=this._getSelectableFromMouseEvent(event);

if(cg===null){return;
}var ci=event.isCtrlPressed()||(qx.bom.client.Platform.MAC&&event.isMetaPressed());
var cf=event.isShiftPressed();
if(this.isItemSelected(cg)&&!cf&&!ci&&!this.getDrag()){this.__pf=cg;
return;
}else{this.__pf=null;
}this._scrollItemIntoView(cg);
switch(this.getMode()){case R:case S:this._setSelectedItem(cg);
break;
case P:this._setLeadItem(cg);
this._setAnchorItem(cg);
this._toggleInSelection(cg);
break;
case O:this._setLeadItem(cg);
if(cf){var ch=this._getAnchorItem();

if(ch===null){ch=this._getFirstSelectable();
this._setAnchorItem(ch);
}this._selectItemRange(ch,cg,ci);
}else if(ci){this._setAnchorItem(cg);
this._toggleInSelection(cg);
}else{this._setAnchorItem(cg);
this._setSelectedItem(cg);
}break;
}var cj=this.getMode();

if(this.getDrag()&&cj!==R&&cj!==S&&!cf&&!ci){this.__oS=this._getLocation();
this.__oP=this._getScroll();
this.__oT=event.getDocumentLeft()+this.__oP.left;
this.__oU=event.getDocumentTop()+this.__oP.top;
this.__oV=true;
this._capture();
}this._fireChange(bj);
},handleMouseUp:function(event){var t=event.isCtrlPressed()||(qx.bom.client.Platform.MAC&&event.isMetaPressed());
var q=event.isShiftPressed();

if(!t&&!q&&this.__pf){var r=this._getSelectableFromMouseEvent(event);

if(r===null||!this.isItemSelected(r)){return;
}var s=this.getMode();

if(s===P){this._removeFromSelection(r);
}else{this._setSelectedItem(r);

if(this.getMode()===O){this._setLeadItem(r);
this._setAnchorItem(r);
}}}this._cleanup();
},handleLoseCapture:function(event){this._cleanup();
},handleMouseMove:function(event){if(!this.__oV){return;
}this.__oW=event.getDocumentLeft();
this.__oX=event.getDocumentTop();
var f=this.__oW+this.__oP.left;

if(f>this.__oT){this.__oY=1;
}else if(f<this.__oT){this.__oY=-1;
}else{this.__oY=0;
}var d=this.__oX+this.__oP.top;

if(d>this.__oU){this.__pa=1;
}else if(d<this.__oU){this.__pa=-1;
}else{this.__pa=0;
}var location=this.__oS;

if(this.__oW<location.left){this.__oM=this.__oW-location.left;
}else if(this.__oW>location.right){this.__oM=this.__oW-location.right;
}else{this.__oM=0;
}
if(this.__oX<location.top){this.__oN=this.__oX-location.top;
}else if(this.__oX>location.bottom){this.__oN=this.__oX-location.bottom;
}else{this.__oN=0;
}if(!this.__oO){this.__oO=new qx.event.Timer(100);
this.__oO.addListener(T,this._onInterval,this);
}this.__oO.start();
this._autoSelect();
event.stopPropagation();
},handleAddItem:function(e){var cb=e.getData();

if(this.getMode()===S&&this.isSelectionEmpty()){this.addItem(cb);
}},handleRemoveItem:function(e){this.removeItem(e.getData());
},_cleanup:function(){if(!this.getDrag()&&this.__oV){return;
}if(this.__pb){this._fireChange(bj);
}delete this.__oV;
delete this.__oQ;
delete this.__oR;
this._releaseCapture();
if(this.__oO){this.__oO.stop();
}},_onInterval:function(e){this._scrollBy(this.__oM,this.__oN);
this.__oP=this._getScroll();
this._autoSelect();
},_autoSelect:function(){var cK=this._getDimension();
var cD=Math.max(0,Math.min(this.__oW-this.__oS.left,cK.width))+this.__oP.left;
var cC=Math.max(0,Math.min(this.__oX-this.__oS.top,cK.height))+this.__oP.top;
if(this.__oQ===cD&&this.__oR===cC){return;
}this.__oQ=cD;
this.__oR=cC;
var cM=this._getAnchorItem();
var cF=cM;
var cI=this.__oY;
var cL,cE;

while(cI!==0){cL=cI>0?this._getRelatedSelectable(cF,bk):this._getRelatedSelectable(cF,ba);
if(cL!==null){cE=this._getSelectableLocationX(cL);
if((cI>0&&cE.left<=cD)||(cI<0&&cE.right>=cD)){cF=cL;
continue;
}}break;
}var cJ=this.__pa;
var cH,cG;

while(cJ!==0){cH=cJ>0?this._getRelatedSelectable(cF,M):this._getRelatedSelectable(cF,bi);
if(cH!==null){cG=this._getSelectableLocationY(cH);
if((cJ>0&&cG.top<=cC)||(cJ<0&&cG.bottom>=cC)){cF=cH;
continue;
}}break;
}var cN=this.getMode();

if(cN===O){this._selectItemRange(cM,cF);
}else if(cN===P){if(this.isItemSelected(cM)){this._selectItemRange(cM,cF,true);
}else{this._deselectItemRange(cM,cF);
}this._setAnchorItem(cF);
}this._fireChange(bh);
},__pg:{Home:1,Down:1,Right:1,PageDown:1,End:1,Up:1,Left:1,PageUp:1},handleKeyPress:function(event){var bG,bF;
var bI=event.getKeyIdentifier();
var bH=this.getMode();
var bC=event.isCtrlPressed()||(qx.bom.client.Platform.MAC&&event.isMetaPressed());
var bD=event.isShiftPressed();
var bE=false;

if(bI===X&&bC){if(bH!==R&&bH!==S){this._selectAllItems();
bE=true;
}}else if(bI===bb){if(bH!==R&&bH!==S){this._clearSelection();
bE=true;
}}else if(bI===Y){var bB=this.getLeadItem();

if(bB&&!bD){if(bC||bH===P){this._toggleInSelection(bB);
}else{this._setSelectedItem(bB);
}bE=true;
}}else if(this.__pg[bI]){bE=true;

if(bH===R||bH==S){bG=this._getSelectedItem();
}else{bG=this.getLeadItem();
}
if(bG!==null){switch(bI){case bm:bF=this._getFirstSelectable();
break;
case bn:bF=this._getLastSelectable();
break;
case br:bF=this._getRelatedSelectable(bG,bi);
break;
case J:bF=this._getRelatedSelectable(bG,M);
break;
case L:bF=this._getRelatedSelectable(bG,ba);
break;
case bl:bF=this._getRelatedSelectable(bG,bk);
break;
case N:bF=this._getPage(bG,true);
break;
case bp:bF=this._getPage(bG,false);
break;
}}else{switch(bI){case bm:case J:case bl:case bp:bF=this._getFirstSelectable();
break;
case bn:case br:case L:case N:bF=this._getLastSelectable();
break;
}}if(bF!==null){switch(bH){case R:case S:this._setSelectedItem(bF);
break;
case P:this._setLeadItem(bF);
break;
case O:if(bD){var bJ=this._getAnchorItem();

if(bJ===null){this._setAnchorItem(bJ=this._getFirstSelectable());
}this._setLeadItem(bF);
this._selectItemRange(bJ,bF,bC);
}else{this._setAnchorItem(bF);
this._setLeadItem(bF);

if(!bC){this._setSelectedItem(bF);
}}break;
}this._scrollItemIntoView(bF);
}}
if(bE){event.stop();
this._fireChange(bf);
}},_selectAllItems:function(){var cc=this.getSelectables();

for(var i=0,l=cc.length;i<l;i++){this._addToSelection(cc[i]);
}},_clearSelection:function(){var E=this.__oL;

for(var F in E){this._removeFromSelection(E[F]);
}this.__oL={};
},_selectItemRange:function(bO,bP,bQ){var bT=this._getSelectableRange(bO,bP);
if(!bQ){var bS=this.__oL;
var bU=this.__ph(bT);

for(var bR in bS){if(!bU[bR]){this._removeFromSelection(bS[bR]);
}}}for(var i=0,l=bT.length;i<l;i++){this._addToSelection(bT[i]);
}},_deselectItemRange:function(cS,cT){var cU=this._getSelectableRange(cS,cT);

for(var i=0,l=cU.length;i<l;i++){this._removeFromSelection(cU[i]);
}},__ph:function(cs){var cu={};
var ct;

for(var i=0,l=cs.length;i<l;i++){ct=cs[i];
cu[this._selectableToHashCode(ct)]=ct;
}return cu;
},_getSelectedItem:function(){for(var u in this.__oL){return this.__oL[u];
}return null;
},_setSelectedItem:function(bt){if(this._isSelectable(bt)){var bu=this.__oL;
var bv=this._selectableToHashCode(bt);

if(!bu[bv]||qx.lang.Object.hasMinLength(bu,2)){this._clearSelection();
this._addToSelection(bt);
}}},_addToSelection:function(cA){var cB=this._selectableToHashCode(cA);

if(!this.__oL[cB]&&this._isSelectable(cA)){this.__oL[cB]=cA;
this._styleSelectable(cA,Q,true);
this.__pb=true;
}},_toggleInSelection:function(cy){var cz=this._selectableToHashCode(cy);

if(!this.__oL[cz]){this.__oL[cz]=cy;
this._styleSelectable(cy,Q,true);
}else{delete this.__oL[cz];
this._styleSelectable(cy,Q,false);
}this.__pb=true;
},_removeFromSelection:function(cQ){var cR=this._selectableToHashCode(cQ);

if(this.__oL[cR]!=null){delete this.__oL[cR];
this._styleSelectable(cQ,Q,false);
this.__pb=true;
}},_replaceMultiSelection:function(v){var y=false;
var B,A;
var w={};

for(var i=0,l=v.length;i<l;i++){B=v[i];

if(this._isSelectable(B)){A=this._selectableToHashCode(B);
w[A]=B;
}}var x=B;
var z=this.__oL;

for(var A in z){if(w[A]){delete w[A];
}else{B=z[A];
delete z[A];
this._styleSelectable(B,Q,false);
y=true;
}}for(var A in w){B=z[A]=w[A];
this._styleSelectable(B,Q,true);
y=true;
}if(!y){return false;
}this._scrollItemIntoView(x);
this._setLeadItem(null);
this._setAnchorItem(null);
this.__pb=true;
this._fireChange();
},_fireChange:function(bL){if(this.__pb){this.__pc=bL||null;
this.fireDataEvent(U,this.getSelection());
delete this.__pb;
}}},destruct:function(){this._disposeObjects(W);
this.__oL=this.__pf=this.__pe=null;
this.__pd=null;
}});
})();
(function(){var u="vertical",t="under",s="above",r="qx.ui.core.selection.Widget",q="left",p="right";
qx.Class.define(r,{extend:qx.ui.core.selection.Abstract,construct:function(m){qx.ui.core.selection.Abstract.call(this);
this.__pi=m;
},members:{__pi:null,_isSelectable:function(k){return k.isEnabled()&&k.isVisible()&&k.getLayoutParent()===this.__pi;
},_selectableToHashCode:function(M){return M.$$hash;
},_styleSelectable:function(I,J,K){K?I.addState(J):I.removeState(J);
},_capture:function(){this.__pi.capture();
},_releaseCapture:function(){this.__pi.releaseCapture();
},_getWidget:function(){return this.__pi;
},_getLocation:function(){var f=this.__pi.getContentElement().getDomElement();
return f?qx.bom.element.Location.get(f):null;
},_getDimension:function(){return this.__pi.getInnerSize();
},_getSelectableLocationX:function(a){var b=a.getBounds();

if(b){return {left:b.left,right:b.left+b.width};
}},_getSelectableLocationY:function(N){var O=N.getBounds();

if(O){return {top:O.top,bottom:O.top+O.height};
}},_getScroll:function(){return {left:0,top:0};
},_scrollBy:function(d,e){},_scrollItemIntoView:function(c){this.__pi.scrollChildIntoView(c);
},getSelectables:function(){var h=this.__pi.getChildren();
var j=[];
var g;

for(var i=0,l=h.length;i<l;i++){g=h[i];

if(g.isEnabled()&&g.isVisible()){j.push(g);
}}return j;
},_getSelectableRange:function(B,C){if(B===C){return [B];
}var G=this.__pi.getChildren();
var D=[];
var F=false;
var E;

for(var i=0,l=G.length;i<l;i++){E=G[i];

if(E===B||E===C){if(F){D.push(E);
break;
}else{F=true;
}}
if(F&&E.isEnabled()&&E.isVisible()){D.push(E);
}}return D;
},_getFirstSelectable:function(){var L=this.__pi.getChildren();

for(var i=0,l=L.length;i<l;i++){if(L[i].isEnabled()&&L[i].isVisible()){return L[i];
}}return null;
},_getLastSelectable:function(){var H=this.__pi.getChildren();

for(var i=H.length-1;i>0;i--){if(H[i].isEnabled()&&H[i].isVisible()){return H[i];
}}return null;
},_getRelatedSelectable:function(v,w){var z=this.__pi.getOrientation()===u;
var y=this.__pi.getChildren();
var x=y.indexOf(v);
var A;

if((z&&w===s)||(!z&&w===q)){for(var i=x-1;i>=0;i--){A=y[i];

if(A.isEnabled()&&A.isVisible()){return A;
}}}else if((z&&w===t)||(!z&&w===p)){for(var i=x+1;i<y.length;i++){A=y[i];

if(A.isEnabled()&&A.isVisible()){return A;
}}}return null;
},_getPage:function(n,o){if(o){return this._getFirstSelectable();
}else{return this._getLastSelectable();
}}},destruct:function(){this.__pi=null;
}});
})();
(function(){var c="qx.ui.core.selection.ScrollArea";
qx.Class.define(c,{extend:qx.ui.core.selection.Widget,members:{_isSelectable:function(a){return (a.isEnabled()&&a.isVisible()&&a.getLayoutParent()===this._getWidget().getChildrenContainer());
},_getDimension:function(){return this._getWidget().getPaneSize();
},_getScroll:function(){var b=this._getWidget();
return {left:b.getScrollX(),top:b.getScrollY()};
},_scrollBy:function(q,r){var s=this._getWidget();
s.scrollByX(q);
s.scrollByY(r);
},_getPage:function(d,e){var j=this.getSelectables();
var length=j.length;
var m=j.indexOf(d);
if(m===-1){throw new Error("Invalid lead item: "+d);
}var f=this._getWidget();
var o=f.getScrollY();
var innerHeight=f.getInnerSize().height;
var top,h,n;

if(e){var l=o;
var i=m;
while(1){for(;i>=0;i--){top=f.getItemTop(j[i]);
if(top<l){n=i+1;
break;
}}if(n==null){var p=this._getFirstSelectable();
return p==d?null:p;
}if(n>=m){l-=innerHeight+o-f.getItemBottom(d);
n=null;
continue;
}return j[n];
}}else{var k=innerHeight+o;
var i=m;
while(1){for(;i<length;i++){h=f.getItemBottom(j[i]);
if(h>k){n=i-1;
break;
}}if(n==null){var g=this._getLastSelectable();
return g==d?null:g;
}if(n<=m){k+=f.getItemTop(d)-o;
n=null;
continue;
}return j[n];
}}}}});
})();
(function(){var r="horizontal",q="qx.event.type.Data",p="vertical",o="",n="qx.ui.form.List",m="Enter",k="one",j="addChildWidget",h="_applySpacing",g="Boolean",D="Integer",C="action",B="keyinput",A="__pj",z="addItem",y="removeChildWidget",x="_applyOrientation",w="single",v="keypress",u="list",s="pane",t="removeItem";
qx.Class.define(n,{extend:qx.ui.core.scroll.AbstractScrollArea,implement:[qx.ui.core.IMultiSelection,qx.ui.form.IForm,qx.ui.form.IModelSelection],include:[qx.ui.core.MRemoteChildrenHandling,qx.ui.core.MMultiSelectionHandling,qx.ui.form.MForm,qx.ui.form.MModelSelection],construct:function(a){qx.ui.core.scroll.AbstractScrollArea.call(this);
this.__pj=new qx.ui.container.Composite();
this.__pj.addListener(j,this._onAddChild,this);
this.__pj.addListener(y,this._onRemoveChild,this);
this.getChildControl(s).add(this.__pj);
if(a){this.setOrientation(r);
}else{this.initOrientation();
}this.addListener(v,this._onKeyPress);
this.addListener(B,this._onKeyInput);
this.__pk=o;
},events:{addItem:q,removeItem:q},properties:{appearance:{refine:true,init:u},focusable:{refine:true,init:true},orientation:{check:[r,p],init:p,apply:x},spacing:{check:D,init:0,apply:h,themeable:true},enableInlineFind:{check:g,init:true}},members:{__pk:null,__pl:null,__pj:null,SELECTION_MANAGER:qx.ui.core.selection.ScrollArea,getChildrenContainer:function(){return this.__pj;
},_onAddChild:function(e){this.fireDataEvent(z,e.getData());
},_onRemoveChild:function(e){this.fireDataEvent(t,e.getData());
},handleKeyPress:function(e){if(!this._onKeyPress(e)){this._getManager().handleKeyPress(e);
}},_applyOrientation:function(b,c){var d=b===r;
var f=d?new qx.ui.layout.HBox():new qx.ui.layout.VBox();
var content=this.__pj;
content.setLayout(f);
content.setAllowGrowX(!d);
content.setAllowGrowY(d);
this._applySpacing(this.getSpacing());
},_applySpacing:function(K,L){this.__pj.getLayout().setSpacing(K);
},_onKeyPress:function(e){if(e.getKeyIdentifier()==m&&!e.isAltPressed()){var E=this.getSelection();

for(var i=0;i<E.length;i++){E[i].fireEvent(C);
}return true;
}return false;
},_onKeyInput:function(e){if(!this.getEnableInlineFind()){return;
}var P=this.getSelectionMode();

if(!(P===w||P===k)){return;
}if(((new Date).valueOf()-this.__pl)>1000){this.__pk=o;
}this.__pk+=e.getChar();
var Q=this.findItemByLabelFuzzy(this.__pk);
if(Q){this.setSelection([Q]);
}this.__pl=(new Date).valueOf();
},findItemByLabelFuzzy:function(M){M=M.toLowerCase();
var N=this.getChildren();
for(var i=0,l=N.length;i<l;i++){var O=N[i].getLabel();
if(O&&O.toLowerCase().indexOf(M)==0){return N[i];
}}return null;
},findItem:function(F,G){if(G!==false){F=F.toLowerCase();
}var H=this.getChildren();
var J;
for(var i=0,l=H.length;i<l;i++){J=H[i];
var I=J.getLabel();

if(I!=null){if(I.translate){I=I.translate();
}
if(G!==false){I=I.toLowerCase();
}
if(I.toString()==F.toString()){return J;
}}}return null;
}},destruct:function(){this._disposeObjects(A);
}});
})();
(function(){var l="[",k="]",j=".",i="idBubble",h="changeBubble",g="qx.data.marshal.MEventBubbling",f="qx.event.type.Data";
qx.Mixin.define(g,{events:{"changeBubble":f},members:{_applyEventPropagation:function(m,n,name){this.fireDataEvent(h,{value:m,name:name,old:n});
this._registerEventChaining(m,n,name);
},_registerEventChaining:function(a,b,name){if((a instanceof qx.core.Object)&&qx.Class.hasMixin(a.constructor,qx.data.marshal.MEventBubbling)){var c=qx.lang.Function.bind(this.__pm,this,name);
var d=a.addListener(h,c,this);
a.setUserData(i,d);
}if(b!=null&&b.getUserData&&b.getUserData(i)!=null){b.removeListenerById(b.getUserData(i));
}},__pm:function(name,e){var v=e.getData();
var r=v.value;
var p=v.old;
if(qx.Class.hasInterface(e.getTarget().constructor,qx.data.IListData)){if(v.name.indexOf){var u=v.name.indexOf(j)!=-1?v.name.indexOf(j):v.name.length;
var s=v.name.indexOf(l)!=-1?v.name.indexOf(l):v.name.length;

if(u<s){var o=v.name.substring(0,u);
var t=v.name.substring(u+1,v.name.length);

if(t[0]!=l){t=j+t;
}var q=name+l+o+k+t;
}else if(s<u){var o=v.name.substring(0,s);
var t=v.name.substring(s,v.name.length);
var q=name+l+o+k+t;
}else{var q=name+l+v.name+k;
}}else{var q=name+l+v.name+k;
}}else{var q=name+j+v.name;
}this.fireDataEvent(h,{value:r,name:q,old:p});
}}});
})();
(function(){var s="change",r="add",q="remove",p="order",o="",n="qx.data.Array",m="?",l="changeBubble",k="qx.event.type.Event",j="number",g="changeLength",h="qx.event.type.Data";
qx.Class.define(n,{extend:qx.core.Object,include:qx.data.marshal.MEventBubbling,implement:[qx.data.IListData],construct:function(I){qx.core.Object.call(this);
if(I==undefined){this.__pn=[];
}else if(arguments.length>1){this.__pn=[];

for(var i=0;i<arguments.length;i++){this.__pn.push(arguments[i]);
}}else if(typeof I==j){this.__pn=new Array(I);
}else if(I instanceof Array){this.__pn=qx.lang.Array.clone(I);
}else{this.__pn=[];
throw new Error("Type of the parameter not supported!");
}for(var i=0;i<this.__pn.length;i++){this._applyEventPropagation(this.__pn[i],null,i);
}this.__po();
},events:{"change":h,"changeLength":k},members:{__pn:null,concat:function(d){if(d){var e=this.__pn.concat(d);
}else{var e=this.__pn.concat();
}return new qx.data.Array(e);
},join:function(w){return this.__pn.join(w);
},pop:function(){var Q=this.__pn.pop();
this.__po();
this._applyEventPropagation(null,Q,this.length-1);
this.fireDataEvent(s,{start:this.length-1,end:this.length-1,type:q,items:[Q]},null);
return Q;
},push:function(W){for(var i=0;i<arguments.length;i++){this.__pn.push(arguments[i]);
this.__po();
this._applyEventPropagation(arguments[i],null,this.length-1);
this.fireDataEvent(s,{start:this.length-1,end:this.length-1,type:r,items:[arguments[i]]},null);
}return this.length;
},reverse:function(){this.__pn.reverse();
this.fireDataEvent(s,{start:0,end:this.length-1,type:p,items:null},null);
},shift:function(){var R=this.__pn.shift();
this.__po();
this._applyEventPropagation(null,R);
this.fireDataEvent(s,{start:0,end:this.length-1,type:q,items:[R]},null);
return R;
},slice:function(x,y){return new qx.data.Array(this.__pn.slice(x,y));
},splice:function(Y,ba,bb){var bh=this.__pn.length;
var be=this.__pn.splice.apply(this.__pn,arguments);
if(this.__pn.length!=bh){this.__po();
}var bf=ba>0;
var bc=arguments.length>2;
var bd=null;

if(bf||bc){if(this.__pn.length>bh){var bg=r;
}else if(this.__pn.length<bh){var bg=q;
bd=be;
}else{var bg=p;
}this.fireDataEvent(s,{start:Y,end:this.length-1,type:bg,items:bd},null);
}for(var i=2;i<arguments.length;i++){this._registerEventChaining(arguments[i],null,Y+i);
}this.fireDataEvent(l,{value:this,name:m,old:be});
for(var i=0;i<be.length;i++){this._applyEventPropagation(null,be[i],i);
}return (new qx.data.Array(be));
},sort:function(G){this.__pn.sort.apply(this.__pn,arguments);
this.fireDataEvent(s,{start:0,end:this.length-1,type:p,items:null},null);
},unshift:function(D){for(var i=arguments.length-1;i>=0;i--){this.__pn.unshift(arguments[i]);
this.__po();
this._applyEventPropagation(arguments[i],null,0);
this.fireDataEvent(s,{start:0,end:this.length-1,type:r,items:[arguments[i]]},null);
}return this.length;
},toArray:function(){return this.__pn;
},getItem:function(H){return this.__pn[H];
},setItem:function(A,B){var C=this.__pn[A];
this.__pn[A]=B;
this._applyEventPropagation(B,C,A);
if(this.length!=this.__pn.length){this.__po();
}this.fireDataEvent(s,{start:A,end:A,type:r,items:[B]},null);
},getLength:function(){return this.length;
},indexOf:function(X){return this.__pn.indexOf(X);
},toString:function(){if(this.__pn!=null){return this.__pn.toString();
}return o;
},contains:function(f){return this.__pn.indexOf(f)!==-1;
},copy:function(){return this.concat();
},insertAt:function(E,F){this.splice(E,0,F);
},insertBefore:function(t,u){var v=this.indexOf(t);

if(v==-1){this.push(u);
}else{this.splice(v,0,u);
}},insertAfter:function(T,U){var V=this.indexOf(T);

if(V==-1||V==(this.length-1)){this.push(U);
}else{this.splice(V+1,0,U);
}},removeAt:function(S){return this.splice(S,1)[0];
},removeAll:function(){for(var i=0;i<this.__pn.length;i++){this._applyEventPropagation(null,this.__pn[i],i);
}var c=this.getLength();
var b=this.__pn.concat();
this.__pn.length=0;
this.__po();
this.fireDataEvent(s,{start:0,end:c-1,type:q,items:b},null);
},append:function(O){{};
for(var i=0;i<O.length;i++){this._applyEventPropagation(O[i],null,this.__pn.length+i);
}Array.prototype.push.apply(this.__pn,O);
this.__po();
},remove:function(K){var L=this.indexOf(K);

if(L!=-1){this.splice(L,1);
return K;
}},equals:function(J){if(this.length!==J.length){return false;
}
for(var i=0;i<this.length;i++){if(this.getItem(i)!==J.getItem(i)){return false;
}}return true;
},sum:function(){var a=0;

for(var i=0;i<this.length;i++){a+=this.getItem(i);
}return a;
},max:function(){var z=this.getItem(0);

for(var i=1;i<this.length;i++){if(this.getItem(i)>z){z=this.getItem(i);
}}return z===undefined?null:z;
},min:function(){var P=this.getItem(0);

for(var i=1;i<this.length;i++){if(this.getItem(i)<P){P=this.getItem(i);
}}return P===undefined?null:P;
},forEach:function(M,N){for(var i=0;i<this.__pn.length;i++){M.call(N,this.__pn[i]);
}},__po:function(){this.length=this.__pn.length;
this.fireEvent(g,qx.event.type.Event);
}},destruct:function(){for(var i=0;i<this.__pn.length;i++){this._applyEventPropagation(null,this.__pn[i],i);
}this.__pn=null;
}});
})();
(function(){var b="qx.ui.form.IModel",a="qx.event.type.Data";
qx.Interface.define(b,{events:{"changeModel":a},members:{setModel:function(c){},getModel:function(){},resetModel:function(){}}});
})();
(function(){var b="changeModel",a="qx.ui.form.MModelProperty";
qx.Mixin.define(a,{properties:{model:{nullable:true,event:b}}});
})();
(function(){var f="listitem",e="qx.ui.form.ListItem",d="qx.event.type.Event";
qx.Class.define(e,{extend:qx.ui.basic.Atom,implement:[qx.ui.form.IModel],include:[qx.ui.form.MModelProperty],construct:function(a,b,c){qx.ui.basic.Atom.call(this,a,b);

if(c!=null){this.setModel(c);
}},events:{"action":d},properties:{appearance:{refine:true,init:f}},members:{_forwardStates:{focused:true,hovered:true,selected:true,dragover:true}}});
})();
(function(){var O="qx.event.type.Event",N="Boolean",M="queued",L="String",K="sending",J="receiving",I="aborted",H="failed",G="nocache",F="completed",bt="qx.io.remote.Response",bs="POST",br="configured",bq="timeout",bp="GET",bo="Pragma",bn="no-url-params-on-post",bm="no-cache",bl="Cache-Control",bk="Content-Type",V="text/plain",W="application/xml",T="application/json",U="text/html",R="application/x-www-form-urlencoded",S="qx.io.remote.Exchange",P="Integer",Q="X-Qooxdoo-Response-Type",X="HEAD",Y="qx.io.remote.Request",bc="_applyResponseType",bb="_applyState",be="text/javascript",bd="changeState",bg="PUT",bf="_applyProhibitCaching",ba="",bj="_applyMethod",bi="DELETE",bh="boolean";
qx.Class.define(Y,{extend:qx.core.Object,construct:function(d,f,g){qx.core.Object.call(this);
this.__pp={};
this.__pq={};
this.__pr={};
this.__ps={};

if(d!==undefined){this.setUrl(d);
}
if(f!==undefined){this.setMethod(f);
}
if(g!==undefined){this.setResponseType(g);
}this.setProhibitCaching(true);
this.__pt=++qx.io.remote.Request.__pt;
},events:{"created":O,"configured":O,"sending":O,"receiving":O,"completed":bt,"aborted":O,"failed":bt,"timeout":bt},statics:{__pt:0},properties:{url:{check:L,init:ba},method:{check:[bp,bs,bg,X,bi],apply:bj,init:bp},asynchronous:{check:N,init:true},data:{check:L,nullable:true},username:{check:L,nullable:true},password:{check:L,nullable:true},state:{check:[br,M,K,J,F,I,bq,H],init:br,apply:bb,event:bd},responseType:{check:[V,be,T,W,U],init:V,apply:bc},timeout:{check:P,nullable:true},prohibitCaching:{check:function(v){return typeof v==bh||v===bn;
},init:true,apply:bf},crossDomain:{check:N,init:false},fileUpload:{check:N,init:false},transport:{check:S,nullable:true},useBasicHttpAuth:{check:N,init:false}},members:{__pp:null,__pq:null,__pr:null,__ps:null,__pt:null,send:function(){qx.io.remote.RequestQueue.getInstance().add(this);
},abort:function(){qx.io.remote.RequestQueue.getInstance().abort(this);
},reset:function(){switch(this.getState()){case K:case J:this.error("Aborting already sent request!");
case M:this.abort();
break;
}},isConfigured:function(){return this.getState()===br;
},isQueued:function(){return this.getState()===M;
},isSending:function(){return this.getState()===K;
},isReceiving:function(){return this.getState()===J;
},isCompleted:function(){return this.getState()===F;
},isAborted:function(){return this.getState()===I;
},isTimeout:function(){return this.getState()===bq;
},isFailed:function(){return this.getState()===H;
},__pu:function(e){var E=e.clone();
E.setTarget(this);
this.dispatchEvent(E);
},_onqueued:function(e){this.setState(M);
this.__pu(e);
},_onsending:function(e){this.setState(K);
this.__pu(e);
},_onreceiving:function(e){this.setState(J);
this.__pu(e);
},_oncompleted:function(e){this.setState(F);
this.__pu(e);
this.dispose();
},_onaborted:function(e){this.setState(I);
this.__pu(e);
this.dispose();
},_ontimeout:function(e){this.setState(bq);
this.__pu(e);
this.dispose();
},_onfailed:function(e){this.setState(H);
this.__pu(e);
this.dispose();
},_applyState:function(p,q){{};
},_applyProhibitCaching:function(A,B){if(!A){this.removeParameter(G);
this.removeRequestHeader(bo);
this.removeRequestHeader(bl);
return;
}if(A!==bn||this.getMethod()!=bs){this.setParameter(G,new Date().valueOf());
}else{this.removeParameter(G);
}this.setRequestHeader(bo,bm);
this.setRequestHeader(bl,bm);
},_applyMethod:function(r,s){if(r===bs){this.setRequestHeader(bk,R);
}else{this.removeRequestHeader(bk);
}var t=this.getProhibitCaching();
this._applyProhibitCaching(t,t);
},_applyResponseType:function(k,l){this.setRequestHeader(Q,k);
},setRequestHeader:function(i,j){this.__pp[i]=j;
},removeRequestHeader:function(w){delete this.__pp[w];
},getRequestHeader:function(c){return this.__pp[c]||null;
},getRequestHeaders:function(){return this.__pp;
},setParameter:function(x,y,z){if(z){this.__pr[x]=y;
}else{this.__pq[x]=y;
}},removeParameter:function(m,n){if(n){delete this.__pr[m];
}else{delete this.__pq[m];
}},getParameter:function(a,b){if(b){return this.__pr[a]||null;
}else{return this.__pq[a]||null;
}},getParameters:function(h){return (h?this.__pr:this.__pq);
},setFormField:function(C,D){this.__ps[C]=D;
},removeFormField:function(o){delete this.__ps[o];
},getFormField:function(u){return this.__ps[u]||null;
},getFormFields:function(){return this.__ps;
},getSequenceNumber:function(){return this.__pt;
}},destruct:function(){this.setTransport(null);
this.__pp=this.__pq=this.__pr=this.__ps=null;
}});
})();
(function(){var b=".",a="qx.bom.client.Transport";
qx.Class.define(a,{statics:{getMaxConcurrentRequestCount:function(){var h;
var c=qx.bom.client.Engine;
var g=c.FULLVERSION.split(b);
var e=0;
var d=0;
var f=0;
if(g[0]){e=g[0];
}if(g[1]){d=g[1];
}if(g[2]){f=g[2];
}if(window.maxConnectionsPerServer){h=window.maxConnectionsPerServer;
}else if(c.OPERA){h=8;
}else if(c.WEBKIT){h=4;
}else if(c.GECKO&&((e>1)||((e==1)&&(d>9))||((e==1)&&(d==9)&&(f>=1)))){h=6;
}else{h=2;
}return h;
}}});
})();
(function(){var v="Integer",u="aborted",t="_onaborted",s="_on",r="_applyEnabled",q="Boolean",p="__pw",o="sending",n="interval",m="failed",g="qx.io.remote.RequestQueue",l="timeout",k="completed",f="__py",d="queued",j="receiving",h="singleton";
qx.Class.define(g,{type:h,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__pv=[];
this.__pw=[];
this.__px=0;
this.__py=new qx.event.Timer(500);
this.__py.addListener(n,this._oninterval,this);
},properties:{enabled:{init:true,check:q,apply:r},maxTotalRequests:{check:v,nullable:true},maxConcurrentRequests:{check:v,init:qx.bom.client.Transport.getMaxConcurrentRequestCount()},defaultTimeout:{check:v,init:5000}},members:{__pv:null,__pw:null,__px:null,__py:null,getRequestQueue:function(){return this.__pv;
},getActiveQueue:function(){return this.__pw;
},_debug:function(){var x;
{};
},_check:function(){this._debug();
if(this.__pw.length==0&&this.__pv.length==0){this.__py.stop();
}if(!this.getEnabled()){return;
}if(this.__pv.length==0||(this.__pv[0].isAsynchronous()&&this.__pw.length>=this.getMaxConcurrentRequests())){return;
}if(this.getMaxTotalRequests()!=null&&this.__px>=this.getMaxTotalRequests()){return;
}var I=this.__pv.shift();
var J=new qx.io.remote.Exchange(I);
this.__px++;
this.__pw.push(J);
this._debug();
J.addListener(o,this._onsending,this);
J.addListener(j,this._onreceiving,this);
J.addListener(k,this._oncompleted,this);
J.addListener(u,this._oncompleted,this);
J.addListener(l,this._oncompleted,this);
J.addListener(m,this._oncompleted,this);
J._start=(new Date).valueOf();
J.send();
if(this.__pv.length>0){this._check();
}},_remove:function(F){qx.lang.Array.remove(this.__pw,F);
F.dispose();
this._check();
},__pz:0,_onsending:function(e){{};
e.getTarget().getRequest()._onsending(e);
},_onreceiving:function(e){e.getTarget().getRequest()._onreceiving(e);
},_oncompleted:function(e){{};
var c=e.getTarget().getRequest();
var b=s+e.getType();
try{if(c[b]){c[b](e);
}}catch(H){var a=qx.dev.StackTrace.getStackTraceFromError(H);
this.error("Request "+c+" handler "+b+" threw an error: "+H+"\nStack Trace:\n"+a);
try{if(c[t]){var event=qx.event.Registration.createEvent(u,qx.event.type.Event);
c[t](event);
}}catch(w){}}finally{this._remove(e.getTarget());
}},_oninterval:function(e){var E=this.__pw;

if(E.length==0){this.__py.stop();
return;
}var z=(new Date).valueOf();
var C;
var A;
var D=this.getDefaultTimeout();
var B;
var y;

for(var i=E.length-1;i>=0;i--){C=E[i];
A=C.getRequest();

if(A.isAsynchronous()){B=A.getTimeout();
if(B==0){continue;
}
if(B==null){B=D;
}y=z-C._start;

if(y>B){this.warn("Timeout: transport "+C.toHashCode());
this.warn(y+"ms > "+B+"ms");
C.timeout();
}}}},_applyEnabled:function(K,L){if(K){this._check();
}this.__py.setEnabled(K);
},add:function(G){G.setState(d);

if(G.isAsynchronous()){this.__pv.push(G);
}else{this.__pv.unshift(G);
}this._check();

if(this.getEnabled()){this.__py.start();
}},abort:function(M){var N=M.getTransport();

if(N){N.abort();
}else if(qx.lang.Array.contains(this.__pv,M)){qx.lang.Array.remove(this.__pv,M);
}}},destruct:function(){this._disposeArray(p);
this._disposeObjects(f);
this.__pv=null;
}});
})();
(function(){var ba="failed",Y="sending",X="completed",W="receiving",V="aborted",U="timeout",T="qx.event.type.Event",S="Connection dropped",R="qx.io.remote.Response",Q="configured",bW="=",bV="Proxy authentication required",bU="qx.io.remote.transport.Abstract",bT="MSHTML-specific HTTP status code",bS="Not available",bR="Precondition failed",bQ="Server error",bP="Moved temporarily",bO="&",bN="qx.io.remote.Exchange",bh="Bad gateway",bi="Gone",bf="See other",bg="Partial content",bd="Server timeout",be="qx.io.remote.transport.Script",bb="HTTP version not supported",bc="Unauthorized",bl="Multiple choices",bm="Payment required",bu="Not implemented",bs="Request-URL too large",bC="Length required",bx="_applyState",bJ="changeState",bH="Not modified",bo="qx.io.remote.Request",bM="Connection closed by server",bL="Moved permanently",bK="_applyImplementation",bn="Method not allowed",bq="Forbidden",br="Use proxy",bt="Ok",bv="Not found",by="Not acceptable",bE="Request time-out",bI="Bad request",bj="Conflict",bk="No content",bp="qx.io.remote.transport.XmlHttp",bB="qx.io.remote.transport.Iframe",bA="Request entity too large",bz="Unknown status code",bG="Unsupported media type",bF="Gateway time-out",bw="created",bD="Out of resources",P="undefined";
qx.Class.define(bN,{extend:qx.core.Object,construct:function(n){qx.core.Object.call(this);
this.setRequest(n);
n.setTransport(this);
},events:{"sending":T,"receiving":T,"completed":R,"aborted":T,"failed":R,"timeout":R},statics:{typesOrder:[bp,bB,be],typesReady:false,typesAvailable:{},typesSupported:{},registerType:function(o,p){qx.io.remote.Exchange.typesAvailable[p]=o;
},initTypes:function(){if(qx.io.remote.Exchange.typesReady){return;
}
for(var v in qx.io.remote.Exchange.typesAvailable){var u=qx.io.remote.Exchange.typesAvailable[v];

if(u.isSupported()){qx.io.remote.Exchange.typesSupported[v]=u;
}}qx.io.remote.Exchange.typesReady=true;

if(qx.lang.Object.isEmpty(qx.io.remote.Exchange.typesSupported)){throw new Error("No supported transport types were found!");
}},canHandle:function(x,y,z){if(!qx.lang.Array.contains(x.handles.responseTypes,z)){return false;
}
for(var A in y){if(!x.handles[A]){return false;
}}return true;
},_nativeMap:{0:bw,1:Q,2:Y,3:W,4:X},wasSuccessful:function(q,r,s){if(s){switch(q){case null:case 0:return true;
case -1:return r<4;
default:return typeof q===P;
}}else{switch(q){case -1:{};
return r<4;
case 200:case 304:return true;
case 201:case 202:case 203:case 204:case 205:return true;
case 206:{};
return r!==4;
case 300:case 301:case 302:case 303:case 305:case 400:case 401:case 402:case 403:case 404:case 405:case 406:case 407:case 408:case 409:case 410:case 411:case 412:case 413:case 414:case 415:case 500:case 501:case 502:case 503:case 504:case 505:{};
return false;
case 12002:case 12007:case 12029:case 12030:case 12031:case 12152:case 13030:{};
return false;
default:if(q>206&&q<300){return true;
}qx.log.Logger.debug(this,"Unknown status code: "+q+" ("+r+")");
return false;
}}},statusCodeToString:function(b){switch(b){case -1:return bS;
case 200:return bt;
case 304:return bH;
case 206:return bg;
case 204:return bk;
case 300:return bl;
case 301:return bL;
case 302:return bP;
case 303:return bf;
case 305:return br;
case 400:return bI;
case 401:return bc;
case 402:return bm;
case 403:return bq;
case 404:return bv;
case 405:return bn;
case 406:return by;
case 407:return bV;
case 408:return bE;
case 409:return bj;
case 410:return bi;
case 411:return bC;
case 412:return bR;
case 413:return bA;
case 414:return bs;
case 415:return bG;
case 500:return bQ;
case 501:return bu;
case 502:return bh;
case 503:return bD;
case 504:return bF;
case 505:return bb;
case 12002:return bd;
case 12029:return S;
case 12030:return S;
case 12031:return S;
case 12152:return bM;
case 13030:return bT;
default:return bz;
}}},properties:{request:{check:bo,nullable:true},implementation:{check:bU,nullable:true,apply:bK},state:{check:[Q,Y,W,X,V,U,ba],init:Q,event:bJ,apply:bx}},members:{send:function(){var g=this.getRequest();

if(!g){return this.error("Please attach a request object first");
}qx.io.remote.Exchange.initTypes();
var d=qx.io.remote.Exchange.typesOrder;
var c=qx.io.remote.Exchange.typesSupported;
var j=g.getResponseType();
var k={};

if(g.getAsynchronous()){k.asynchronous=true;
}else{k.synchronous=true;
}
if(g.getCrossDomain()){k.crossDomain=true;
}
if(g.getFileUpload()){k.fileUpload=true;
}for(var h in g.getFormFields()){k.programaticFormFields=true;
break;
}var m,f;

for(var i=0,l=d.length;i<l;i++){m=c[d[i]];

if(m){if(!qx.io.remote.Exchange.canHandle(m,k,j)){continue;
}
try{{};
f=new m;
this.setImplementation(f);
f.setUseBasicHttpAuth(g.getUseBasicHttpAuth());
f.send();
return true;
}catch(w){this.error("Request handler throws error");
this.error(w);
return;
}}}this.error("There is no transport implementation available to handle this request: "+g);
},abort:function(){var t=this.getImplementation();

if(t){{};
t.abort();
}else{{};
this.setState(V);
}},timeout:function(){var a=this.getImplementation();

if(a){this.warn("Timeout: implementation "+a.toHashCode());
a.timeout();
}else{this.warn("Timeout: forcing state to timeout");
this.setState(U);
}this.__pA();
},__pA:function(){var bX=this.getRequest();

if(bX){bX.setTimeout(0);
}},_onsending:function(e){this.setState(Y);
},_onreceiving:function(e){this.setState(W);
},_oncompleted:function(e){this.setState(X);
},_onabort:function(e){this.setState(V);
},_onfailed:function(e){this.setState(ba);
},_ontimeout:function(e){this.setState(U);
},_applyImplementation:function(C,D){if(D){D.removeListener(Y,this._onsending,this);
D.removeListener(W,this._onreceiving,this);
D.removeListener(X,this._oncompleted,this);
D.removeListener(V,this._onabort,this);
D.removeListener(U,this._ontimeout,this);
D.removeListener(ba,this._onfailed,this);
}
if(C){var F=this.getRequest();
C.setUrl(F.getUrl());
C.setMethod(F.getMethod());
C.setAsynchronous(F.getAsynchronous());
C.setUsername(F.getUsername());
C.setPassword(F.getPassword());
C.setParameters(F.getParameters(false));
C.setFormFields(F.getFormFields());
C.setRequestHeaders(F.getRequestHeaders());
var I=F.getData();

if(I===null){var J=F.getParameters(true);
var H=[];

for(var E in J){var G=J[E];

if(G instanceof Array){for(var i=0;i<G.length;i++){H.push(encodeURIComponent(E)+bW+encodeURIComponent(G[i]));
}}else{H.push(encodeURIComponent(E)+bW+encodeURIComponent(G));
}}
if(H.length>0){C.setData(H.join(bO));
}}else{C.setData(I);
}C.setResponseType(F.getResponseType());
C.addListener(Y,this._onsending,this);
C.addListener(W,this._onreceiving,this);
C.addListener(X,this._oncompleted,this);
C.addListener(V,this._onabort,this);
C.addListener(U,this._ontimeout,this);
C.addListener(ba,this._onfailed,this);
}},_applyState:function(K,L){{};

switch(K){case Y:this.fireEvent(Y);
break;
case W:this.fireEvent(W);
break;
case X:case V:case U:case ba:var N=this.getImplementation();

if(!N){break;
}this.__pA();

if(this.hasListener(K)){var O=qx.event.Registration.createEvent(K,qx.io.remote.Response);

if(K==X){var M=N.getResponseContent();
O.setContent(M);
if(M===null){{};
K=ba;
}}else if(K==ba){O.setContent(N.getResponseContent());
}O.setStatusCode(N.getStatusCode());
O.setResponseHeaders(N.getResponseHeaders());
this.dispatchEvent(O);
}this.setImplementation(null);
N.dispose();
break;
}}},settings:{"qx.ioRemoteDebug":false,"qx.ioRemoteDebugData":false},destruct:function(){var B=this.getImplementation();

if(B){this.setImplementation(null);
B.dispose();
}this.setRequest(null);
}});
})();
(function(){var r="qx.event.type.Event",q="String",p="failed",o="timeout",n="created",m="aborted",l="sending",k="configured",j="receiving",i="completed",d="Object",h="Boolean",g="abstract",c="_applyState",b="GET",f="changeState",e="qx.io.remote.transport.Abstract";
qx.Class.define(e,{type:g,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.setRequestHeaders({});
this.setParameters({});
this.setFormFields({});
},events:{"created":r,"configured":r,"sending":r,"receiving":r,"completed":r,"aborted":r,"failed":r,"timeout":r},properties:{url:{check:q,nullable:true},method:{check:q,nullable:true,init:b},asynchronous:{check:h,nullable:true,init:true},data:{check:q,nullable:true},username:{check:q,nullable:true},password:{check:q,nullable:true},state:{check:[n,k,l,j,i,m,o,p],init:n,event:f,apply:c},requestHeaders:{check:d,nullable:true},parameters:{check:d,nullable:true},formFields:{check:d,nullable:true},responseType:{check:q,nullable:true},useBasicHttpAuth:{check:h,nullable:true}},members:{send:function(){throw new Error("send is abstract");
},abort:function(){{};
this.setState(m);
},timeout:function(){{};
this.setState(o);
},failed:function(){{};
this.setState(p);
},setRequestHeader:function(s,t){throw new Error("setRequestHeader is abstract");
},getResponseHeader:function(a){throw new Error("getResponseHeader is abstract");
},getResponseHeaders:function(){throw new Error("getResponseHeaders is abstract");
},getStatusCode:function(){throw new Error("getStatusCode is abstract");
},getStatusText:function(){throw new Error("getStatusText is abstract");
},getResponseText:function(){throw new Error("getResponseText is abstract");
},getResponseXml:function(){throw new Error("getResponseXml is abstract");
},getFetchedLength:function(){throw new Error("getFetchedLength is abstract");
},_applyState:function(u,v){{};

switch(u){case n:this.fireEvent(n);
break;
case k:this.fireEvent(k);
break;
case l:this.fireEvent(l);
break;
case j:this.fireEvent(j);
break;
case i:this.fireEvent(i);
break;
case m:this.fireEvent(m);
break;
case p:this.fireEvent(p);
break;
case o:this.fireEvent(o);
break;
}return true;
}}});
})();
(function(){var O="failed",N="completed",M="=",L="aborted",K="",J="sending",I="&",H="configured",G="timeout",F="application/xml",bk="qx.io.remote.transport.XmlHttp",bj="application/json",bi="text/html",bh="qx.client",bg="receiving",bf="text/plain",be="text/javascript",bd="?",bc="created",bb='Referer',V='Basic ',W="\n</pre>",T="string",U='Authorization',R="<pre>Could not execute json: \n",S="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",P=':',Q="parseerror",X="file:",Y="webkit",ba="object";
qx.Class.define(bk,{extend:qx.io.remote.transport.Abstract,statics:{handles:{synchronous:true,asynchronous:true,crossDomain:false,fileUpload:false,programaticFormFields:false,responseTypes:[bf,be,bj,F,bi]},requestObjects:[],requestObjectCount:0,createRequestObject:qx.core.Variant.select(bh,{"default":function(){return new XMLHttpRequest;
},"mshtml":function(){if(window.ActiveXObject&&qx.xml.Document.XMLHTTP){return new ActiveXObject(qx.xml.Document.XMLHTTP);
}
if(window.XMLHttpRequest){return new XMLHttpRequest;
}}}),isSupported:function(){return !!this.createRequestObject();
}},members:{__pB:false,__pC:0,__pD:null,getRequest:function(){if(this.__pD===null){this.__pD=qx.io.remote.transport.XmlHttp.createRequestObject();
this.__pD.onreadystatechange=qx.lang.Function.bind(this._onreadystatechange,this);
}return this.__pD;
},send:function(){this.__pC=0;
var bH=this.getRequest();
var bD=this.getMethod();
var bK=this.getAsynchronous();
var bJ=this.getUrl();
var bF=(window.location.protocol===X&&!(/^http(s){0,1}\:/.test(bJ)));
this.__pB=bF;
var bN=this.getParameters(false);
var bL=[];

for(var bE in bN){var bI=bN[bE];

if(bI instanceof Array){for(var i=0;i<bI.length;i++){bL.push(encodeURIComponent(bE)+M+encodeURIComponent(bI[i]));
}}else{bL.push(encodeURIComponent(bE)+M+encodeURIComponent(bI));
}}
if(bL.length>0){bJ+=(bJ.indexOf(bd)>=0?I:bd)+bL.join(I);
}if(this.getData()===null){var bN=this.getParameters(true);
var bL=[];

for(var bE in bN){var bI=bN[bE];

if(bI instanceof Array){for(var i=0;i<bI.length;i++){bL.push(encodeURIComponent(bE)+M+encodeURIComponent(bI[i]));
}}else{bL.push(encodeURIComponent(bE)+M+encodeURIComponent(bI));
}}
if(bL.length>0){this.setData(bL.join(I));
}}var bM=function(bt){var by=S;
var bC=K;
var bw,bv,bu;
var bz,bA,bB,bx;
var i=0;

do{bw=bt.charCodeAt(i++);
bv=bt.charCodeAt(i++);
bu=bt.charCodeAt(i++);
bz=bw>>2;
bA=((bw&3)<<4)|(bv>>4);
bB=((bv&15)<<2)|(bu>>6);
bx=bu&63;

if(isNaN(bv)){bB=bx=64;
}else if(isNaN(bu)){bx=64;
}bC+=by.charAt(bz)+by.charAt(bA)+by.charAt(bB)+by.charAt(bx);
}while(i<bt.length);
return bC;
};
try{if(this.getUsername()){if(this.getUseBasicHttpAuth()){bH.open(bD,bJ,bK);
bH.setRequestHeader(U,V+bM(this.getUsername()+P+this.getPassword()));
}else{bH.open(bD,bJ,bK,this.getUsername(),this.getPassword());
}}else{bH.open(bD,bJ,bK);
}}catch(r){this.error("Failed with exception: "+r);
this.failed();
return;
}if(!qx.core.Variant.isSet(bh,Y)){bH.setRequestHeader(bb,window.location.href);
}var bG=this.getRequestHeaders();

for(var bE in bG){bH.setRequestHeader(bE,bG[bE]);
}try{{};
bH.send(this.getData());
}catch(D){if(bF){this.failedLocally();
}else{this.error("Failed to send data: "+D,"send");
this.failed();
}return;
}if(!bK){this._onreadystatechange();
}},failedLocally:function(){if(this.getState()===O){return;
}this.warn("Could not load from file: "+this.getUrl());
this.failed();
},_onreadystatechange:qx.event.GlobalError.observeMethod(function(e){switch(this.getState()){case N:case L:case O:case G:{};
return;
}var t=this.getReadyState();

if(t==4){if(!qx.io.remote.Exchange.wasSuccessful(this.getStatusCode(),t,this.__pB)){if(this.getState()===H){this.setState(J);
}return this.failed();
}}while(this.__pC<t){this.setState(qx.io.remote.Exchange._nativeMap[++this.__pC]);
}}),getReadyState:function(){var g=null;

try{g=this.getRequest().readyState;
}catch(C){}return g;
},setRequestHeader:function(A,B){this.getRequestHeaders()[A]=B;
},getResponseHeader:function(a){var b=null;

try{b=this.getRequest().getResponseHeader(a)||null;
}catch(n){}return b;
},getStringResponseHeaders:function(){var p=null;

try{var o=this.getRequest().getAllResponseHeaders();

if(o){p=o;
}}catch(x){}return p;
},getResponseHeaders:function(){var br=this.getStringResponseHeaders();
var bs={};

if(br){var bp=br.split(/[\r\n]+/g);

for(var i=0,l=bp.length;i<l;i++){var bq=bp[i].match(/^([^:]+)\s*:\s*(.+)$/i);

if(bq){bs[bq[1]]=bq[2];
}}}return bs;
},getStatusCode:function(){var f=-1;

try{f=this.getRequest().status;
}catch(E){}return f;
},getStatusText:function(){var y=K;

try{y=this.getRequest().statusText;
}catch(bQ){}return y;
},getResponseText:function(){var c=null;

try{c=this.getRequest().responseText;
}catch(bl){c=null;
}return c;
},getResponseXml:function(){var w=null;
var u=this.getStatusCode();
var v=this.getReadyState();

if(qx.io.remote.Exchange.wasSuccessful(u,v,this.__pB)){try{w=this.getRequest().responseXML;
}catch(h){}}if(typeof w==ba&&w!=null){if(!w.documentElement){var s=String(this.getRequest().responseText).replace(/<\?xml[^\?]*\?>/,K);
w.loadXML(s);
}if(!w.documentElement){throw new Error("Missing Document Element!");
}
if(w.documentElement.tagName==Q){throw new Error("XML-File is not well-formed!");
}}else{throw new Error("Response was not a valid xml document ["+this.getRequest().responseText+"]");
}return w;
},getFetchedLength:function(){var bm=this.getResponseText();
return typeof bm==T?bm.length:0;
},getResponseContent:function(){var j=this.getState();

if(j!==N&&j!=O){{};
return null;
}{};
var m=this.getResponseText();

if(j==O){{};
return m;
}
switch(this.getResponseType()){case bf:case bi:{};
return m;
case bj:{};

try{if(m&&m.length>0){var k=qx.util.Json.parse(m,false);
return (k===0?0:(k||null));
}else{return null;
}}catch(q){this.error("Could not execute json: ["+m+"]",q);
return R+m+W;
}case be:{};

try{if(m&&m.length>0){var k=window.eval(m);
return (k===0?0:(k||null));
}else{return null;
}}catch(z){this.error("Could not execute javascript: ["+m+"]",z);
return null;
}case F:m=this.getResponseXml();
{};
return (m===0?0:(m||null));
default:this.warn("No valid responseType specified ("+this.getResponseType()+")!");
return null;
}},_applyState:function(bO,bP){{};

switch(bO){case bc:this.fireEvent(bc);
break;
case H:this.fireEvent(H);
break;
case J:this.fireEvent(J);
break;
case bg:this.fireEvent(bg);
break;
case N:this.fireEvent(N);
break;
case O:this.fireEvent(O);
break;
case L:this.getRequest().abort();
this.fireEvent(L);
break;
case G:this.getRequest().abort();
this.fireEvent(G);
break;
}}},defer:function(bn,bo){qx.io.remote.Exchange.registerType(qx.io.remote.transport.XmlHttp,bk);
},destruct:function(){var d=this.getRequest();

if(d){d.onreadystatechange=qx.lang.Function.empty;
switch(d.readyState){case 1:case 2:case 3:d.abort();
}}this.__pD=null;
}});
})();
(function(){var C=",",B="",A="string",z="null",y='"',x="qx.jsonDebugging",w="__pH",v='\\u00',u="new Date(Date.UTC(",t="__pJ",Y="__pG",X='\\\\',W='\\f',V='\\"',U="))",T="}",S='(',R=":",Q="{",P='\\r',J="__pI",K='\\t',H="]",I="[",F="Use 'parse' instead!",G="__pQ",D="qx.jsonEncodeUndefined",E="__pR",L='\\b',M="qx.util.Json",O=')',N='\\n';
qx.Class.define(M,{statics:{__pE:null,BEAUTIFYING_INDENT:"  ",BEAUTIFYING_LINE_END:"\n",__pF:{"function":Y,"boolean":w,"number":J,"string":t,"object":G,"undefined":E},__pG:function(e,f){return String(e);
},__pH:function(p,q){return String(p);
},__pI:function(bu,bv){return isFinite(bu)?String(bu):z;
},__pJ:function(bb,bc){var bd;

if(/["\\\x00-\x1f]/.test(bb)){bd=bb.replace(/([\x00-\x1f\\"])/g,qx.util.Json.__pL);
}else{bd=bb;
}return y+bd+y;
},__pK:{'\b':L,'\t':K,'\n':N,'\f':W,'\r':P,'"':V,'\\':X},__pL:function(a,b){var bA=qx.util.Json.__pK[b];

if(bA){return bA;
}bA=b.charCodeAt();
return v+Math.floor(bA/16).toString(16)+(bA%16).toString(16);
},__pM:function(g,h){var k=[],o=true,n,j;
var m=qx.util.Json.__pT;
k.push(I);

if(m){qx.util.Json.__pN+=qx.util.Json.BEAUTIFYING_INDENT;
k.push(qx.util.Json.__pN);
}
for(var i=0,l=g.length;i<l;i++){j=g[i];
n=this.__pF[typeof j];

if(n){j=this[n](j,i+B);

if(typeof j==A){if(!o){k.push(C);

if(m){k.push(qx.util.Json.__pN);
}}k.push(j);
o=false;
}}}
if(m){qx.util.Json.__pN=qx.util.Json.__pN.substring(0,qx.util.Json.__pN.length-qx.util.Json.BEAUTIFYING_INDENT.length);
k.push(qx.util.Json.__pN);
}k.push(H);
return k.join(B);
},__pO:function(bx,by){var bz=bx.getUTCFullYear()+C+bx.getUTCMonth()+C+bx.getUTCDate()+C+bx.getUTCHours()+C+bx.getUTCMinutes()+C+bx.getUTCSeconds()+C+bx.getUTCMilliseconds();
return u+bz+U;
},__pP:function(bl,bm){var bp=[],br=true,bo,bn;
var bq=qx.util.Json.__pT;
bp.push(Q);

if(bq){qx.util.Json.__pN+=qx.util.Json.BEAUTIFYING_INDENT;
bp.push(qx.util.Json.__pN);
}
for(var bm in bl){bn=bl[bm];
bo=this.__pF[typeof bn];

if(bo){bn=this[bo](bn,bm);

if(typeof bn==A){if(!br){bp.push(C);

if(bq){bp.push(qx.util.Json.__pN);
}}bp.push(this.__pJ(bm),R,bn);
br=false;
}}}
if(bq){qx.util.Json.__pN=qx.util.Json.__pN.substring(0,qx.util.Json.__pN.length-qx.util.Json.BEAUTIFYING_INDENT.length);
bp.push(qx.util.Json.__pN);
}bp.push(T);
return bp.join(B);
},__pQ:function(r,s){if(r){if(qx.lang.Type.isFunction(r.toJSON)&&r.toJSON!==this.__pE){return this.__pS(r.toJSON(s),s);
}else if(qx.lang.Type.isDate(r)){return this.__pO(r,s);
}else if(qx.lang.Type.isArray(r)){return this.__pM(r,s);
}else if(qx.lang.Type.isObject(r)){return this.__pP(r,s);
}return B;
}return z;
},__pR:function(c,d){if(qx.core.Setting.get(D)){return z;
}},__pS:function(bs,bt){return this[this.__pF[typeof bs]](bs,bt);
},stringify:function(bf,bg){this.__pT=bg;
this.__pN=this.BEAUTIFYING_LINE_END;
var bh=this.__pS(bf,B);

if(typeof bh!=A){bh=null;
}if(qx.core.Setting.get(x)){qx.log.Logger.debug(this,"JSON request: "+bh);
}return bh;
},parse:function(bi,bj){if(bj===undefined){bj=true;
}
if(qx.core.Setting.get(x)){qx.log.Logger.debug(this,"JSON response: "+bi);
}
if(bj){if(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(bi.replace(/"(\\.|[^"\\])*"/g,B))){throw new Error("Could not parse JSON string!");
}}
try{var bk=(bi&&bi.length>0)?eval(S+bi+O):null;
return bk;
}catch(bw){throw new Error("Could not evaluate JSON string: "+bw.message);
}},parseQx:function(ba){qx.log.Logger.deprecatedMethodWarning(arguments.callee,F);
return qx.util.Json.parse(ba,false);
}},settings:{"qx.jsonEncodeUndefined":true,"qx.jsonDebugging":false},defer:function(be){be.__pE=Date.prototype.toJSON;
}});
})();
(function(){var I="=",H="&",G="application/xml",F="application/json",E="text/html",D="qx.client",C="textarea",B="none",A="text/plain",z="text/javascript",bd="",bc="completed",bb="?",ba="qx.io.remote.transport.Iframe",Y="gecko",X="frame_",W="aborted",V="_data_",U="pre",T="javascript:void(0)",P="sending",Q="form",N="failed",O='<iframe name="',L="mshtml",M="form_",J='"></iframe>',K="iframe",R="timeout",S="qx/static/blank.gif";
qx.Class.define(ba,{extend:qx.io.remote.transport.Abstract,construct:function(){qx.io.remote.transport.Abstract.call(this);
var w=(new Date).valueOf();
var x=X+w;
var y=M+w;
if(qx.core.Variant.isSet(D,L)){this.__pU=document.createElement(O+x+J);
}else{this.__pU=document.createElement(K);
}this.__pU.src=T;
this.__pU.id=this.__pU.name=x;
this.__pU.onload=qx.lang.Function.bind(this._onload,this);
this.__pU.style.display=B;
document.body.appendChild(this.__pU);
this.__pV=document.createElement(Q);
this.__pV.target=x;
this.__pV.id=this.__pV.name=y;
this.__pV.style.display=B;
document.body.appendChild(this.__pV);
this.__pW=document.createElement(C);
this.__pW.id=this.__pW.name=V;
this.__pV.appendChild(this.__pW);
this.__pU.onreadystatechange=qx.lang.Function.bind(this._onreadystatechange,this);
},statics:{handles:{synchronous:false,asynchronous:true,crossDomain:false,fileUpload:true,programaticFormFields:true,responseTypes:[A,z,F,G,E]},isSupported:function(){return true;
},_numericMap:{"uninitialized":1,"loading":2,"loaded":2,"interactive":3,"complete":4}},members:{__pW:null,__pX:0,__pV:null,__pU:null,send:function(){var k=this.getMethod();
var m=this.getUrl();
var q=this.getParameters(false);
var p=[];

for(var l in q){var n=q[l];

if(n instanceof Array){for(var i=0;i<n.length;i++){p.push(encodeURIComponent(l)+I+encodeURIComponent(n[i]));
}}else{p.push(encodeURIComponent(l)+I+encodeURIComponent(n));
}}
if(p.length>0){m+=(m.indexOf(bb)>=0?H:bb)+p.join(H);
}if(this.getData()===null){var q=this.getParameters(true);
var p=[];

for(var l in q){var n=q[l];

if(n instanceof Array){for(var i=0;i<n.length;i++){p.push(encodeURIComponent(l)+I+encodeURIComponent(n[i]));
}}else{p.push(encodeURIComponent(l)+I+encodeURIComponent(n));
}}
if(p.length>0){this.setData(p.join(H));
}}var j=this.getFormFields();

for(var l in j){var o=document.createElement(C);
o.name=l;
o.appendChild(document.createTextNode(j[l]));
this.__pV.appendChild(o);
}this.__pV.action=m;
this.__pV.method=k;
this.__pW.appendChild(document.createTextNode(this.getData()));
this.__pV.submit();
this.setState(P);
},_onload:qx.event.GlobalError.observeMethod(function(e){if(this.__pV.src){return;
}this._switchReadyState(qx.io.remote.transport.Iframe._numericMap.complete);
}),_onreadystatechange:qx.event.GlobalError.observeMethod(function(e){this._switchReadyState(qx.io.remote.transport.Iframe._numericMap[this.__pU.readyState]);
}),_switchReadyState:function(t){switch(this.getState()){case bc:case W:case N:case R:this.warn("Ignore Ready State Change");
return;
}while(this.__pX<t){this.setState(qx.io.remote.Exchange._nativeMap[++this.__pX]);
}},setRequestHeader:function(b,c){},getResponseHeader:function(s){return null;
},getResponseHeaders:function(){return {};
},getStatusCode:function(){return 200;
},getStatusText:function(){return bd;
},getIframeWindow:function(){return qx.bom.Iframe.getWindow(this.__pU);
},getIframeDocument:function(){return qx.bom.Iframe.getDocument(this.__pU);
},getIframeBody:function(){return qx.bom.Iframe.getBody(this.__pU);
},getIframeTextContent:function(){var a=this.getIframeBody();

if(!a){return null;
}
if(!a.firstChild){return bd;
}if(a.firstChild.tagName&&a.firstChild.tagName.toLowerCase()==U){return a.firstChild.innerHTML;
}else{return a.innerHTML;
}},getIframeHtmlContent:function(){var r=this.getIframeBody();
return r?r.innerHTML:null;
},getFetchedLength:function(){return 0;
},getResponseContent:function(){if(this.getState()!==bc){{};
return null;
}{};
var u=this.getIframeTextContent();

switch(this.getResponseType()){case A:{};
return u;
break;
case E:u=this.getIframeHtmlContent();
{};
return u;
break;
case F:u=this.getIframeHtmlContent();
{};

try{return u&&u.length>0?qx.util.Json.parse(u,false):null;
}catch(v){return this.error("Could not execute json: ("+u+")",v);
}case z:u=this.getIframeHtmlContent();
{};

try{return u&&u.length>0?window.eval(u):null;
}catch(d){return this.error("Could not execute javascript: ("+u+")",d);
}case G:u=this.getIframeDocument();
{};
return u;
default:this.warn("No valid responseType specified ("+this.getResponseType()+")!");
return null;
}}},defer:function(f,g,h){qx.io.remote.Exchange.registerType(qx.io.remote.transport.Iframe,ba);
},destruct:function(){if(this.__pU){this.__pU.onload=null;
this.__pU.onreadystatechange=null;
if(qx.core.Variant.isSet(D,Y)){this.__pU.src=qx.util.ResourceManager.getInstance().toUri(S);
}document.body.removeChild(this.__pU);
}
if(this.__pV){document.body.removeChild(this.__pV);
}this.__pU=this.__pV=null;
}});
})();
(function(){var f="qx.event.handler.Iframe",e="load",d="iframe";
qx.Class.define(f,{extend:qx.core.Object,implement:qx.event.IEventHandler,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{load:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:false,onevent:qx.event.GlobalError.observeMethod(function(i){qx.event.Registration.fireEvent(i,e);
})},members:{canHandleEvent:function(g,h){return g.tagName.toLowerCase()===d;
},registerEvent:function(j,k,l){},unregisterEvent:function(a,b,c){}},defer:function(m){qx.event.Registration.addHandler(m);
}});
})();
(function(){var s="qx.client",r="webkit",q="body",p="iframe",o="qx.bom.Iframe";
qx.Class.define(o,{statics:{DEFAULT_ATTRIBUTES:{onload:"qx.event.handler.Iframe.onevent(this)",frameBorder:0,frameSpacing:0,marginWidth:0,marginHeight:0,hspace:0,vspace:0,border:0,allowTransparency:true},create:function(a,b){var a=a?qx.lang.Object.clone(a):{};
var c=qx.bom.Iframe.DEFAULT_ATTRIBUTES;

for(var d in c){if(a[d]==null){a[d]=c[d];
}}return qx.bom.Element.create(p,a,b);
},getWindow:qx.core.Variant.select(s,{"mshtml|gecko":function(k){try{return k.contentWindow;
}catch(m){return null;
}},"default":function(f){try{var g=this.getDocument(f);
return g?g.defaultView:null;
}catch(l){return null;
}}}),getDocument:qx.core.Variant.select(s,{"mshtml":function(x){try{var y=this.getWindow(x);
return y?y.document:null;
}catch(B){return null;
}},"default":function(D){try{return D.contentDocument;
}catch(h){return null;
}}}),getBody:function(i){try{var j=this.getDocument(i);
return j?j.getElementsByTagName(q)[0]:null;
}catch(C){return null;
}},setSource:function(u,v){try{if(this.getWindow(u)&&qx.dom.Hierarchy.isRendered(u)){try{if(qx.core.Variant.isSet(s,r)&&qx.bom.client.Platform.MAC){var w=this.getContentWindow();

if(w){w.stop();
}}this.getWindow(u).location.replace(v);
}catch(n){u.src=v;
}}else{u.src=v;
}}catch(e){qx.log.Logger.warn("Iframe source could not be set!");
}},queryCurrentUrl:function(z){var A=this.getDocument(z);

try{if(A&&A.location){return A.location.href;
}}catch(t){}return null;
}}});
})();
(function(){var B="&",A="=",z="?",y="application/json",x="completed",w="text/plain",v="text/javascript",u="qx.io.remote.transport.Script",t="",s="_ScriptTransport_data",n="script",r="timeout",q="_ScriptTransport_",m="_ScriptTransport_id",l="aborted",p="utf-8",o="failed";
qx.Class.define(u,{extend:qx.io.remote.transport.Abstract,construct:function(){qx.io.remote.transport.Abstract.call(this);
var k=++qx.io.remote.transport.Script.__pY;

if(k>=2000000000){qx.io.remote.transport.Script.__pY=k=1;
}this.__qa=null;
this.__pY=k;
},statics:{__pY:0,_instanceRegistry:{},ScriptTransport_PREFIX:q,ScriptTransport_ID_PARAM:m,ScriptTransport_DATA_PARAM:s,handles:{synchronous:false,asynchronous:true,crossDomain:true,fileUpload:false,programaticFormFields:false,responseTypes:[w,v,y]},isSupported:function(){return true;
},_numericMap:{"uninitialized":1,"loading":2,"loaded":2,"interactive":3,"complete":4},_requestFinished:qx.event.GlobalError.observeMethod(function(H,content){var I=qx.io.remote.transport.Script._instanceRegistry[H];

if(I==null){{};
}else{I._responseContent=content;
I._switchReadyState(qx.io.remote.transport.Script._numericMap.complete);
}})},members:{__qb:0,__qa:null,__pY:null,send:function(){var e=this.getUrl();
e+=(e.indexOf(z)>=0?B:z)+qx.io.remote.transport.Script.ScriptTransport_ID_PARAM+A+this.__pY;
var h=this.getParameters();
var g=[];

for(var d in h){if(d.indexOf(qx.io.remote.transport.Script.ScriptTransport_PREFIX)==0){this.error("Illegal parameter name. The following prefix is used internally by qooxdoo): "+qx.io.remote.transport.Script.ScriptTransport_PREFIX);
}var f=h[d];

if(f instanceof Array){for(var i=0;i<f.length;i++){g.push(encodeURIComponent(d)+A+encodeURIComponent(f[i]));
}}else{g.push(encodeURIComponent(d)+A+encodeURIComponent(f));
}}
if(g.length>0){e+=B+g.join(B);
}var c=this.getData();

if(c!=null){e+=B+qx.io.remote.transport.Script.ScriptTransport_DATA_PARAM+A+encodeURIComponent(c);
}qx.io.remote.transport.Script._instanceRegistry[this.__pY]=this;
this.__qa=document.createElement(n);
this.__qa.charset=p;
this.__qa.src=e;
{};
document.body.appendChild(this.__qa);
},_switchReadyState:function(F){switch(this.getState()){case x:case l:case o:case r:this.warn("Ignore Ready State Change");
return;
}while(this.__qb<F){this.setState(qx.io.remote.Exchange._nativeMap[++this.__qb]);
}},setRequestHeader:function(a,b){},getResponseHeader:function(j){return null;
},getResponseHeaders:function(){return {};
},getStatusCode:function(){return 200;
},getStatusText:function(){return t;
},getFetchedLength:function(){return 0;
},getResponseContent:function(){if(this.getState()!==x){{};
return null;
}{};

switch(this.getResponseType()){case w:case y:case v:{};
var G=this._responseContent;
return (G===0?0:(G||null));
default:this.warn("No valid responseType specified ("+this.getResponseType()+")!");
return null;
}}},defer:function(C,D,E){qx.io.remote.Exchange.registerType(qx.io.remote.transport.Script,u);
},destruct:function(){if(this.__qa){delete qx.io.remote.transport.Script._instanceRegistry[this.__pY];
document.body.removeChild(this.__qa);
}this.__qa=this._responseContent=null;
}});
})();
(function(){var e="Integer",d="Object",c="qx.io.remote.Response";
qx.Class.define(c,{extend:qx.event.type.Event,properties:{state:{check:e,nullable:true},statusCode:{check:e,nullable:true},content:{nullable:true},responseHeaders:{check:d,nullable:true}},members:{clone:function(a){var b=qx.event.type.Event.prototype.clone.call(this,a);
b.setType(this.getType());
b.setState(this.getState());
b.setStatusCode(this.getStatusCode());
b.setContent(this.getContent());
b.setResponseHeaders(this.getResponseHeaders());
return b;
},getResponseHeader:function(f){var g=this.getResponseHeaders();

if(g){return g[f]||null;
}return null;
}}});
})();
(function(){var a="qx.ui.layout.Basic";
qx.Class.define(a,{extend:qx.ui.layout.Abstract,members:{verifyLayoutProperty:null,renderLayout:function(b,c){var g=this._getLayoutChildren();
var d,f,e,h,top;
for(var i=0,l=g.length;i<l;i++){d=g[i];
f=d.getSizeHint();
e=d.getLayoutProperties();
h=(e.left||0)+d.getMarginLeft();
top=(e.top||0)+d.getMarginTop();
d.renderLayout(h,top,f.width,f.height);
}},_computeSizeHint:function(){var p=this._getLayoutChildren();
var m,r,n;
var q=0,o=0;
var j,k;
for(var i=0,l=p.length;i<l;i++){m=p[i];
r=m.getSizeHint();
n=m.getLayoutProperties();
j=r.width+(n.left||0)+m.getMarginLeft()+m.getMarginRight();
k=r.height+(n.top||0)+m.getMarginTop()+m.getMarginBottom();

if(j>q){q=j;
}
if(k>o){o=k;
}}return {width:q,height:o};
}}});
})();
(function(){var d="qx.ui.form.Form",c="This message will removed. Use new rendererClass(form) instead.",b="";
qx.Class.define(d,{extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__qc=[];
this.__qd=[];
this.__qe=new qx.ui.form.validation.Manager();
this.__qf=new qx.ui.form.Resetter();
},members:{__qc:null,__qe:null,__qg:0,__qd:null,__qf:null,add:function(k,l,m,name){if(this.__qh()){this.__qc.push({title:null,items:[],labels:[],names:[]});
}this.__qc[this.__qg].items.push(k);
this.__qc[this.__qg].labels.push(l);
if(name==null){name=l.replace(/\s+/g,b);
}this.__qc[this.__qg].names.push(name);
this.__qe.add(k,m);
this.__qf.add(k);
},addGroupHeader:function(e){if(!this.__qh()){this.__qg++;
}this.__qc.push({title:e,items:[],labels:[],names:[]});
},addButton:function(a){this.__qd.push(a);
},__qh:function(){return this.__qc.length===0;
},reset:function(){this.__qf.reset();
this.__qe.reset();
},redefineResetter:function(){this.__qf.redefine();
},validate:function(){return this.__qe.validate();
},getValidationManager:function(){return this.__qe;
},getGroups:function(){return this.__qc;
},getButtons:function(){return this.__qd;
},createView:function(f){qx.log.Logger.deprecatedMethodWarning(arguments.callee,c);

if(f==null){f=qx.ui.form.renderer.Single;
}return new f(this);
},getItems:function(){var g={};
for(var i=0;i<this.__qc.length;i++){var h=this.__qc[i];
for(var j=0;j<h.names.length;j++){var name=h.names[j];
g[name]=h.items[j];
}}return g;
}}});
})();
(function(){var t="",s="complete",r="String",q="changeValid",p="qx.event.type.Event",o="value instanceof Function || qx.Class.isSubClassOf(value.constructor, qx.ui.form.validation.AsyncValidator)",n="qx.ui.form.validation.Manager",m="This field is required",l="qx.event.type.Data";
qx.Class.define(n,{extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__qi=[];
this.__qj={};
this.setRequiredFieldMessage(qx.locale.Manager.tr(m));
},events:{"changeValid":l,"complete":p},properties:{validator:{check:o,init:null,nullable:true},invalidMessage:{check:r,init:t},requiredFieldMessage:{check:r,init:t}},members:{__qi:null,__qk:null,__qj:null,__ql:null,add:function(h,j){if(!this.__qq(h)){throw new Error("Added widget not supported.");
}if(this.__qr(h)){if(j!=null){throw new Error("Widgets suporting selection can only be validated "+"in the form validator");
}}var k={item:h,validator:j,valid:null};
this.__qi.push(k);
},validate:function(){var G=true;
this.__ql=true;
var D=[];
for(var i=0;i<this.__qi.length;i++){var E=this.__qi[i].item;
var H=this.__qi[i].validator;
D.push(E);
if(H==null){var C=this.__qm(E);
G=G&&C;
this.__ql=C&&this.__ql;
continue;
}var C=this.__qn(this.__qi[i],E.getValue());
G=C&&G;

if(C!=null){this.__ql=C&&this.__ql;
}}var F=this.__qo(D);

if(qx.lang.Type.isBoolean(F)){this.__ql=F&&this.__ql;
}G=F&&G;
this.__qt(G);

if(qx.lang.Object.isEmpty(this.__qj)){this.fireEvent(s);
}return G;
},__qm:function(c){if(c.getRequired()){if(this.__qr(c)){var d=!!c.getSelection()[0];
}else{var d=!!c.getValue();
}c.setValid(d);
c.setInvalidMessage(this.getRequiredFieldMessage());
return d;
}return true;
},__qn:function(R,S){var W=R.item;
var V=R.validator;
if(this.__qp(V)){this.__qj[W.toHashCode()]=null;
V.validate(W,W.getValue(),this);
return null;
}var U=null;

try{var U=V(S,W);

if(U===undefined){U=true;
}}catch(e){if(e instanceof qx.core.ValidationError){U=false;

if(e.message&&e.message!=qx.type.BaseError.DEFAULTMESSAGE){var T=e.message;
}else{var T=e.getComment();
}W.setInvalidMessage(T);
}else{throw e;
}}W.setValid(U);
R.valid=U;
return U;
},__qo:function(w){var y=this.getValidator();

if(y==null){return true;
}this.setInvalidMessage(t);

if(this.__qp(y)){this.__qj[this.toHashCode()]=null;
y.validateForm(w,this);
return null;
}
try{var z=y(w,this);

if(z===undefined){z=true;
}}catch(e){if(e instanceof qx.core.ValidationError){z=false;

if(e.message&&e.message!=qx.type.BaseError.DEFAULTMESSAGE){var x=e.message;
}else{var x=e.getComment();
}this.setInvalidMessage(x);
}else{throw e;
}}return z;
},__qp:function(f){var g=false;

if(!qx.lang.Type.isFunction(f)){g=qx.Class.isSubClassOf(f.constructor,qx.ui.form.validation.AsyncValidator);
}return g;
},__qq:function(L){var M=L.constructor;
return qx.Class.hasInterface(M,qx.ui.form.IForm);
},__qr:function(A){var B=A.constructor;
return qx.Class.hasInterface(B,qx.ui.core.ISingleSelection);
},__qs:function(u){var v=u.constructor;
return (qx.Class.hasInterface(v,qx.ui.form.IBooleanForm)||qx.Class.hasInterface(v,qx.ui.form.IColorForm)||qx.Class.hasInterface(v,qx.ui.form.IDateForm)||qx.Class.hasInterface(v,qx.ui.form.INumberForm)||qx.Class.hasInterface(v,qx.ui.form.IStringForm));
},__qt:function(N){var O=this.__qk;
this.__qk=N;
if(O!=N){this.fireDataEvent(q,N,O);
}},getValid:function(){return this.__qk;
},isValid:function(){return this.getValid();
},getInvalidMessages:function(){var P=[];
for(var i=0;i<this.__qi.length;i++){var Q=this.__qi[i].item;

if(!Q.getValid()){P.push(Q.getInvalidMessage());
}}if(this.getInvalidMessage()!=t){P.push(this.getInvalidMessage());
}return P;
},reset:function(){for(var i=0;i<this.__qi.length;i++){var X=this.__qi[i];
X.item.setValid(true);
}this.__qk=null;
},setItemValid:function(a,b){this.__qj[a.toHashCode()]=b;
a.setValid(b);
this.__qu();
},setFormValid:function(Y){this.__qj[this.toHashCode()]=Y;
this.__qu();
},__qu:function(){var J=this.__ql;
for(var K in this.__qj){var I=this.__qj[K];
J=I&&J;
if(I==null){return;
}}this.__qt(J);
this.__qj={};
this.fireEvent(s);
}},destruct:function(){this.__qi=null;
}});
})();
(function(){var a="qx.ui.form.validation.AsyncValidator";
qx.Class.define(a,{extend:qx.core.Object,construct:function(i){qx.core.Object.call(this);
this.__qv=i;
},members:{__qv:null,__qw:null,__qx:null,__qy:null,validate:function(b,c,d){this.__qy=false;
this.__qw=b;
this.__qx=d;
this.__qv(this,c);
},validateForm:function(e,f){this.__qy=true;
this.__qx=f;
this.__qv(e,this);
},setValid:function(g,h){if(this.__qy){if(h!==undefined){this.__qx.setInvalidMessage(h);
}this.__qx.setFormValid(g);
}else{if(h!==undefined){this.__qw.setInvalidMessage(h);
}this.__qx.setItemValid(this.__qw,g);
}}},destruct:function(){this.__qx=this.__qw=null;
}});
})();
(function(){var b="qx.ui.form.IColorForm",a="qx.event.type.Data";
qx.Interface.define(b,{events:{"changeValue":a},members:{setValue:function(c){return arguments.length==1;
},resetValue:function(){},getValue:function(){}}});
})();
(function(){var b="qx.ui.form.IDateForm",a="qx.event.type.Data";
qx.Interface.define(b,{events:{"changeValue":a},members:{setValue:function(c){return arguments.length==1;
},resetValue:function(){},getValue:function(){}}});
})();
(function(){var j="qx.ui.form.Resetter";
qx.Class.define(j,{extend:qx.core.Object,construct:function(){qx.core.Object.call(this);
this.__qz=[];
},members:{__qz:null,add:function(d){if(this.__qD(d)){var e=d.getValue();
}else if(this.__qC(d)){var e=d.getSelection();
}else{throw new Error("Item "+d+" not supported for reseting.");
}this.__qz.push({item:d,init:e});
},reset:function(){for(var i=0;i<this.__qz.length;i++){var f=this.__qz[i];
this.__qA(f.item,f.init);
}},resetItem:function(a){var b;

for(var i=0;i<this.__qz.length;i++){var c=this.__qz[i];

if(c.item===a){b=c.init;
break;
}}if(b===undefined){throw new Error("The given item has not been added.");
}this.__qA(a,b);
},__qA:function(k,l){if(this.__qD(k)){k.setValue(l);
}else if(this.__qC(k)){k.setSelection(l);
}},redefine:function(){for(var i=0;i<this.__qz.length;i++){var m=this.__qz[i].item;
this.__qz[i].init=this.__qB(m);
}},redefineItem:function(g){var h;

for(var i=0;i<this.__qz.length;i++){if(this.__qz[i].item===g){h=this.__qz[i];
break;
}}if(h===undefined){throw new Error("The given item has not been added.");
}h.init=this.__qB(h.item);
},__qB:function(r){if(this.__qD(r)){return r.getValue();
}else if(this.__qC(r)){return r.getSelection();
}},__qC:function(p){var q=p.constructor;
return qx.Class.hasInterface(q,qx.ui.core.ISingleSelection);
},__qD:function(n){var o=n.constructor;
return (qx.Class.hasInterface(o,qx.ui.form.IBooleanForm)||qx.Class.hasInterface(o,qx.ui.form.IColorForm)||qx.Class.hasInterface(o,qx.ui.form.IDateForm)||qx.Class.hasInterface(o,qx.ui.form.INumberForm)||qx.Class.hasInterface(o,qx.ui.form.IStringForm));
}}});
})();
(function(){var b="qx.ui.form.renderer.IFormRenderer";
qx.Interface.define(b,{members:{addItems:function(c,d,e){},addButton:function(a){}}});
})();
(function(){var o="qx.dynlocale",n="",m="changeLocale",l="on",k=" <span style='color:red'>*</span> ",j="abstract",h="qx.ui.form.renderer.AbstractRenderer",g=" :";
qx.Class.define(h,{type:j,extend:qx.ui.core.Widget,implement:qx.ui.form.renderer.IFormRenderer,construct:function(p){qx.ui.core.Widget.call(this);
if(qx.core.Variant.isSet(o,l)){qx.locale.Manager.getInstance().addListener(m,this._onChangeLocale,this);
this._names=[];
}var s=p.getGroups();

for(var i=0;i<s.length;i++){var r=s[i];
this.addItems(r.items,r.labels,r.title);
}var q=p.getButtons();

for(var i=0;i<q.length;i++){this.addButton(q[i]);
}},members:{_names:null,_onChangeLocale:qx.core.Variant.select(o,{"on":function(e){for(var i=0;i<this._names.length;i++){var a=this._names[i];

if(a.name&&a.name.translate){a.name=a.name.translate();
}var b=this._createLabelText(a.name,a.item);
a.label.setValue(b);
}},"off":null}),_createLabelText:function(name,t){var u=n;

if(t.getRequired()){u=k;
}var v=name.length>0||t.getRequired()?g:n;
return name+u+v;
},addItems:function(c,d,f){throw new Error("Abstract method call");
},addButton:function(w){throw new Error("Abstract method call");
}},destruct:function(){if(qx.core.Variant.isSet(o,l)){qx.locale.Manager.getInstance().removeListener(m,this._onChangeLocale,this);
}this._names=null;
}});
})();
(function(){var n="right",m="bold",l="_buttonRow",k="qx.ui.form.renderer.Single",j="left",h="qx.dynlocale",g="top",f="on";
qx.Class.define(k,{extend:qx.ui.form.renderer.AbstractRenderer,construct:function(o){var p=new qx.ui.layout.Grid();
p.setSpacing(6);
p.setColumnFlex(0,1);
p.setColumnAlign(0,n,g);
this._setLayout(p);
qx.ui.form.renderer.AbstractRenderer.call(this,o);
},members:{_row:0,_buttonRow:null,addItems:function(a,b,c){if(c!=null){this._add(this._createHeader(c),{row:this._row,column:0,colSpan:2});
this._row++;
}for(var i=0;i<a.length;i++){var e=this._createLabel(b[i],a[i]);
this._add(e,{row:this._row,column:0});
var d=a[i];
e.setBuddy(d);
this._add(d,{row:this._row,column:1});
this._row++;
if(qx.core.Variant.isSet(h,f)){this._names.push({name:b[i],label:e,item:a[i]});
}}},addButton:function(u){if(this._buttonRow==null){this._buttonRow=new qx.ui.container.Composite();
this._buttonRow.setMarginTop(5);
var v=new qx.ui.layout.HBox();
v.setAlignX(n);
v.setSpacing(5);
this._buttonRow.setLayout(v);
this._add(this._buttonRow,{row:this._row,column:0,colSpan:2});
this._row++;
}this._buttonRow.add(u);
},getLayout:function(){return this._getLayout();
},_createLabel:function(name,q){var r=new qx.ui.basic.Label(this._createLabelText(name,q));
r.setRich(true);
return r;
},_createHeader:function(s){var t=new qx.ui.basic.Label(s);
t.setFont(m);

if(this._row!=0){t.setMarginTop(10);
}t.setAlignX(j);
return t;
}},destruct:function(){if(this._buttonRow){this._buttonRow.removeAll();
this._disposeObjects(l);
}}});
})();
(function(){var g="qx.ui.core.MSingleSelectionHandling",f="__qE",d="changeSelection",c="changeSelected",b="qx.event.type.Data";
qx.Mixin.define(g,{events:{"changeSelection":b},members:{__qE:null,getSelection:function(){var h=this.__qF().getSelected();

if(h){return [h];
}else{return [];
}},setSelection:function(j){if(!this.getEnabled()){this.warn("Setting the selection on disabled '"+this.classname+"' is deprecated: "+("The current behavior will change from doing nothing to selecting the given items."));
this.trace();
}
switch(j.length){case 0:this.resetSelection();
break;
case 1:this.__qF().setSelected(j[0]);
break;
default:throw new Error("Could only select one item, but the selection "+" array contains "+j.length+" items!");
}},resetSelection:function(){if(!this.getEnabled()){this.warn("Resetting the selection on disabled '"+this.classname+"' is deprecated: "+("The current behavior will change from doing nothing to reset the selection."));
this.trace();
}this.__qF().resetSelected();
},isSelected:function(m){return this.__qF().isSelected(m);
},isSelectionEmpty:function(){return this.__qF().isSelectionEmpty();
},getSelectables:function(){return this.__qF().getSelectables();
},_onChangeSelected:function(e){var l=e.getData();
var k=e.getOldData();
l==null?l=[]:l=[l];
k==null?k=[]:k=[k];
this.fireDataEvent(d,l,k);
},__qF:function(){if(this.__qE==null){var a=this;
this.__qE=new qx.ui.core.SingleSelectionManager({getItems:function(){return a._getItems();
},isItemSelectable:function(i){if(a._isItemSelectable){return a._isItemSelectable(i);
}else{return i.isEnabled()&&i.isVisible();
}}});
this.__qE.addListener(c,this._onChangeSelected,this);
}this.__qE.setAllowEmptySelection(this._isAllowEmptySelection());
return this.__qE;
}},destruct:function(){this._disposeObjects(f);
}});
})();
(function(){var t="list",s="atom",r="pressed",q="abandoned",p="popup",o="hovered",n="changeLabel",m="changeIcon",l="arrow",k="",I="spacer",H="Enter",G="one",F="mouseout",E="Space",D="key",C="mousewheel",B="keyinput",A="changeSelection",z="quick",x="qx.ui.form.SelectBox",y="mouseover",v="selectbox",w="click",u=" ";
qx.Class.define(x,{extend:qx.ui.form.AbstractSelectBox,implement:[qx.ui.core.ISingleSelection,qx.ui.form.IModelSelection],include:[qx.ui.core.MSingleSelectionHandling,qx.ui.form.MModelSelection],construct:function(){qx.ui.form.AbstractSelectBox.call(this);
this._createChildControl(s);
this._createChildControl(I);
this._createChildControl(l);
this.addListener(y,this._onMouseOver,this);
this.addListener(F,this._onMouseOut,this);
this.addListener(w,this._onClick,this);
this.addListener(C,this._onMouseWheel,this);
this.addListener(B,this._onKeyInput,this);
this.addListener(A,this.__qH,this);
},properties:{appearance:{refine:true,init:v}},members:{__qG:null,_createChildControlImpl:function(f){var g;

switch(f){case I:g=new qx.ui.core.Spacer();
this._add(g,{flex:1});
break;
case s:g=new qx.ui.basic.Atom(u);
g.setCenter(false);
g.setAnonymous(true);
this._add(g,{flex:1});
break;
case l:g=new qx.ui.basic.Image();
g.setAnonymous(true);
this._add(g);
break;
}return g||qx.ui.form.AbstractSelectBox.prototype._createChildControlImpl.call(this,f);
},_forwardStates:{focused:true},_getItems:function(){return this.getChildrenContainer().getChildren();
},_isAllowEmptySelection:function(){return this.getChildrenContainer().getSelectionMode()!==G;
},__qH:function(e){var j=e.getData()[0];
var i=this.getChildControl(t);

if(i.getSelection()[0]!=j){if(j){i.setSelection([j]);
}else{i.resetSelection();
}}this.__qI();
this.__qJ();
},__qI:function(){var P=this.getChildControl(t).getSelection()[0];
var Q=this.getChildControl(s);
var O=P?P.getIcon():k;
O==null?Q.resetIcon():Q.setIcon(O);
},__qJ:function(){var c=this.getChildControl(t).getSelection()[0];
var d=this.getChildControl(s);
var b=c?c.getLabel():k;
var a=this.getFormat();

if(a!=null){b=a.call(this,c);
}if(b&&b.translate){b=b.translate();
}b==null?d.resetLabel():d.setLabel(b);
},_onMouseOver:function(e){if(!this.isEnabled()||e.getTarget()!==this){return;
}
if(this.hasState(q)){this.removeState(q);
this.addState(r);
}this.addState(o);
},_onMouseOut:function(e){if(!this.isEnabled()||e.getTarget()!==this){return;
}this.removeState(o);

if(this.hasState(r)){this.removeState(r);
this.addState(q);
}},_onClick:function(e){this.toggle();
},_onMouseWheel:function(e){if(this.getChildControl(p).isVisible()){return;
}var K=e.getWheelDelta()>0?1:-1;
var M=this.getSelectables();
var L=this.getSelection()[0];

if(!L){L=M[0];
}var J=M.indexOf(L)+K;
var N=M.length-1;
if(J<0){J=0;
}else if(J>=N){J=N;
}this.setSelection([M[J]]);
e.stopPropagation();
e.preventDefault();
},_onKeyPress:function(e){var h=e.getKeyIdentifier();

if(h==H||h==E){if(this.__qG){this.setSelection([this.__qG]);
this.__qG=null;
}this.toggle();
}else{qx.ui.form.AbstractSelectBox.prototype._onKeyPress.call(this,e);
}},_onKeyInput:function(e){var R=e.clone();
R.setTarget(this._list);
R.setBubbles(false);
this.getChildControl(t).dispatchEvent(R);
},_onListMouseDown:function(e){if(this.__qG){this.setSelection([this.__qG]);
this.__qG=null;
}},_onListChangeSelection:function(e){var bb=e.getData();
var be=e.getOldData();
if(be&&be.length>0){be[0].removeListener(m,this.__qI,this);
be[0].removeListener(n,this.__qJ,this);
}
if(bb.length>0){var bd=this.getChildControl(p);
var bc=this.getChildControl(t);
var bf=bc.getSelectionContext();

if(bd.isVisible()&&(bf==z||bf==D)){this.__qG=bb[0];
}else{this.setSelection([bb[0]]);
this.__qG=null;
}bb[0].addListener(m,this.__qI,this);
bb[0].addListener(n,this.__qJ,this);
}else{this.resetSelection();
}},_onPopupChangeVisibility:function(e){var T=this.getChildControl(p);

if(!T.isVisible()){var V=this.getChildControl(t);
if(V.hasChildren()){V.setSelection(this.getSelection());
}}else{var S=T.getLayoutLocation(this);
var X=qx.bom.Viewport.getHeight();
var W=S.top;
var Y=X-S.bottom;
var U=W>Y?W:Y;
var ba=this.getMaxListHeight();
var V=this.getChildControl(t);

if(ba==null||ba>U){V.setMaxHeight(U);
}else if(ba<U){V.setMaxHeight(ba);
}}}},destruct:function(){this.__qG=null;
}});
})();
(function(){var g="__qK",f="__qL",e="Boolean",d="qx.ui.core.SingleSelectionManager",c="changeSelected",b="__qM",a="qx.event.type.Data";
qx.Class.define(d,{extend:qx.core.Object,construct:function(h){qx.core.Object.call(this);
{};
this.__qK=h;
},events:{"changeSelected":a},properties:{allowEmptySelection:{check:e,init:true,apply:b}},members:{__qL:null,__qK:null,getSelected:function(){return this.__qL;
},setSelected:function(l){if(!this.__qO(l)){throw new Error("Could not select "+l+", because it is not a child element!");
}this.__qN(l);
},resetSelected:function(){this.__qN(null);
},isSelected:function(m){if(!this.__qO(m)){throw new Error("Could not check if "+m+" is selected,"+" because it is not a child element!");
}return this.__qL===m;
},isSelectionEmpty:function(){return this.__qL==null;
},getSelectables:function(){var t=this.__qK.getItems();
var u=[];

for(var i=0;i<t.length;i++){if(this.__qK.isItemSelectable(t[i])){u.push(t[i]);
}}return u;
},__qM:function(n,o){if(!n){this.__qN(this.__qL);
}},__qN:function(p){var s=this.__qL;
var r=p;

if(r!=null&&s===r){return;
}
if(!this.isAllowEmptySelection()&&r==null){var q=this.getSelectables()[0];

if(q){r=q;
}}this.__qL=r;
this.fireDataEvent(c,r,s);
},__qO:function(j){var k=this.__qK.getItems();

for(var i=0;i<k.length;i++){if(k[i]===j){return true;
}}return false;
}},destruct:function(){if(this.__qK.toHashCode){this._disposeObjects(g);
}else{this.__qK=null;
}this._disposeObjects(f);
}});
})();
(function(){var J="modelSelection[0]",I="value",H="changeModel",G="qx.core.Object",F="_applyTarget",E="qx.data.controller.Form",D="changeTarget",C=".",B="qx.ui.form.Form",A="_applyModel";
qx.Class.define(E,{extend:qx.core.Object,construct:function(r,s){qx.core.Object.call(this);
this.__qP={};

if(r!=null){this.setModel(r);
}
if(s!=null){this.setTarget(s);
}},properties:{model:{check:G,apply:A,event:H,nullable:true},target:{check:B,apply:F,event:D,nullable:true,init:null}},members:{__qQ:null,__qP:null,addBindingOptions:function(name,e,f){this.__qP[name]=[e,f];
if(this.getModel()==null||this.getTarget()==null){return;
}var g=this.getTarget().getItems()[name];
var h=this.__qT(g)?J:I;
this.__qQ.removeTarget(g,h,name);
this.__qQ.addTarget(g,h,name,true,e,f);
},createModel:function(j){var k=this.getTarget();
if(k==null){throw new Error("No target is set.");
}var l=k.getItems();
var m={};

for(var name in l){var n=name.split(C);
var q=m;

for(var i=0;i<n.length;i++){if(i+1==n.length){var p=l[name].constructor;

if(qx.Class.hasInterface(p,qx.ui.core.ISingleSelection)){q[n[i]]=l[name].getModelSelection();
}else{q[n[i]]=l[name].getValue();
}}else{if(!q[n[i]]){q[n[i]]={};
}q=q[n[i]];
}}}var o=qx.data.marshal.Json.createModel(m,j);
this.setModel(o);
return o;
},_applyTarget:function(t,u){if(u!=null){this.__qS(u);
}if(this.getModel()==null){return;
}if(t!=null){this.__qR();
}},_applyModel:function(v,w){if(this.__qQ!=null){var x=this.getTarget().getItems();

for(var name in x){var z=x[name];
var y=this.__qT(z)?J:I;
this.__qQ.removeTarget(z,y,name);
}}if(this.__qQ!=null){this.__qQ.setModel(v);
}if(this.getTarget()==null){return;
}if(v!=null){this.__qR();
}},__qR:function(){if(this.__qQ==null){this.__qQ=new qx.data.controller.Object(this.getModel());
}var a=this.getTarget().getItems();
for(var name in a){var d=a[name];
var b=this.__qT(d)?J:I;
var c=this.__qP[name];

if(c==null){this.__qQ.addTarget(d,b,name,true);
}else{this.__qQ.addTarget(d,b,name,true,c[0],c[1]);
}}},__qS:function(K){if(this.__qQ==null){return;
}var L=K.getItems();
for(var name in L){var N=L[name];
var M=this.__qT(N)?J:I;
this.__qQ.removeTarget(N,M,name);
}},__qT:function(O){return qx.Class.hasInterface(O.constructor,qx.ui.core.ISingleSelection)&&qx.Class.hasInterface(O.constructor,qx.ui.form.IModelSelection);
}}});
})();
(function(){var a="qx.data.marshal.IMarshaler";
qx.Interface.define(a,{members:{toClass:function(b,c){},toModel:function(d){}}});
})();
(function(){var h="qx.data.model.",g="",f='"',e="change",d="qx.data.marshal.Json",c="set",b="_applyEventPropagation";
qx.Class.define(d,{extend:qx.core.Object,implement:[qx.data.marshal.IMarshaler],construct:function(a){qx.core.Object.call(this);
this.__qU=a;
},statics:{__qV:null,createModel:function(B,C){if(this.__qV===null){this.__qV=new qx.data.marshal.Json();
}this.__qV.toClass(B,C);
return this.__qV.toModel(B);
}},members:{__qU:null,__qW:function(D){var E=[];

for(var F in D){E.push(F);
}return E.sort().join(f);
},toClass:function(j,k){if(qx.lang.Type.isNumber(j)||qx.lang.Type.isString(j)||qx.lang.Type.isBoolean(j)||j==null){return;
}if(qx.lang.Type.isArray(j)){for(var i=0;i<j.length;i++){this.toClass(j[i],k);
}return ;
}var m=this.__qW(j);
if(this.__qU&&this.__qU.getModelClass&&this.__qU.getModelClass(m)!=null){return;
}for(var q in j){this.toClass(j[q],k);
}if(qx.Class.isDefined(h+m)){return;
}var r={};

for(var q in j){q=q.replace(/-/g,g);
r[q]={};
r[q].nullable=true;
r[q].event=e+qx.lang.String.firstUp(q);

if(k){r[q].apply=b;
}}if(this.__qU&&this.__qU.getModelSuperClass){var p=this.__qU.getModelSuperClass(m)||qx.core.Object;
}else{var p=qx.core.Object;
}var n=[];

if(this.__qU&&this.__qU.getModelMixins){var o=this.__qU.getModelMixins(m);
if(!qx.lang.Type.isArray(o)){if(o!=null){n=[o];
}}}if(k){n.push(qx.data.marshal.MEventBubbling);
}var l={extend:p,include:n,properties:r};
qx.Class.define(h+m,l);
},__qX:function(s){var t;
if(this.__qU&&this.__qU.getModelClass){t=this.__qU.getModelClass(s);
}
if(t!=null){return (new t());
}else{var u=qx.Class.getByName(h+s);
return (new u());
}},toModel:function(v){if(qx.lang.Type.isNumber(v)||qx.lang.Type.isString(v)||qx.lang.Type.isBoolean(v)||qx.lang.Type.isDate(v)||v==null){return v;
}else if(qx.lang.Type.isArray(v)){var z=new qx.data.Array();

for(var i=0;i<v.length;i++){z.push(this.toModel(v[i]));
}return z;
}else if(qx.lang.Type.isObject(v)){var w=this.__qW(v);
var A=this.__qX(w);
for(var y in v){var x=y.replace(/-/g,g);
A[c+qx.lang.String.firstUp(x)](this.toModel(v[y]));
}return A;
}throw new Error("Unsupported type!");
}},destruct:function(){this.__qU=null;
}});
})();
(function(){var h="changeModel",g="qx.core.Object",f="reset",e="qx.data.controller.Object",d="_applyModel";
qx.Class.define(e,{extend:qx.core.Object,construct:function(M){qx.core.Object.call(this);
this.__qY={};
this.__ra=[];

if(M!=null){this.setModel(M);
}},properties:{model:{check:g,event:h,apply:d,nullable:true}},members:{__ra:null,__qY:null,_applyModel:function(s,t){for(var i=0;i<this.__ra.length;i++){var z=this.__ra[i][0];
var w=this.__ra[i][1];
var v=this.__ra[i][2];
var x=this.__ra[i][3];
var y=this.__ra[i][4];
var u=this.__ra[i][5];
if(t!=undefined){this.__rc(z,w,v,t);
}if(s!=undefined){this.__rb(z,w,v,x,y,u);
}else{z[f+qx.lang.String.firstUp(w)]();
}}},addTarget:function(A,B,C,D,E,F){this.__ra.push([A,B,C,D,E,F]);
this.__rb(A,B,C,D,E,F);
},__rb:function(j,k,l,m,n,o){if(this.getModel()==null){return;
}var p=this.getModel().bind(l,j,k,n);
var q=null;

if(m){q=j.bind(k,this.getModel(),l,o);
}var r=j.toHashCode();

if(this.__qY[r]==undefined){this.__qY[r]=[];
}this.__qY[r].push([p,q,k,l,n,o]);
},removeTarget:function(a,b,c){this.__rc(a,b,c,this.getModel());
for(var i=0;i<this.__ra.length;i++){if(this.__ra[i][0]==a&&this.__ra[i][1]==b&&this.__ra[i][2]==c){this.__ra.splice(i,1);
}}},__rc:function(G,H,I,J){if(!(G instanceof qx.core.Object)){return ;
}var K=this.__qY[G.toHashCode()];
if(K==undefined||K.length==0){return;
}for(var i=0;i<K.length;i++){if(K[i][2]==H&&K[i][3]==I){var L=K[i][0];
J.removeBinding(L);
if(K[i][1]!=null){G.removeBinding(K[i][1]);
}K.splice(i,1);
return;
}}}},destruct:function(){this.__qY=this.__ra=null;
}});
})();
(function(){var E='"',D="{",C="[",B=",",A="",z="get",y="}",x="]",w='":',v="&",o="null",u='\\t',r='\\"',n='\\n',m='\\b',q="=",p="qx.util.Serializer",s='\\r',l='\\\\',t='\\f';
qx.Class.define(p,{statics:{toUriParameter:function(M,N){var P=A;
var Q=qx.util.PropertyUtil.getProperties(M.constructor);

for(var name in Q){var O=M[z+qx.lang.String.firstUp(name)]();
if(qx.lang.Type.isArray(O)){for(var i=0;i<O.length;i++){P+=this.__rd(name,O[i],N);
}}else{P+=this.__rd(name,O,N);
}}return P.substring(0,P.length-1);
},__rd:function(name,h,j){if(h instanceof qx.core.Object&&j!=null){var k=encodeURIComponent(j(h));

if(k===undefined){var k=encodeURIComponent(h);
}}else{var k=encodeURIComponent(h);
}return encodeURIComponent(name)+q+k+v;
},toNativeObject:function(a,b){var e;
if(a==null){return null;
}if(qx.Class.hasInterface(a.constructor,qx.data.IListData)){e=[];

for(var i=0;i<a.getLength();i++){e.push(qx.util.Serializer.toNativeObject(a.getItem(i),b));
}return e;
}if(qx.lang.Type.isArray(a)){e=[];

for(var i=0;i<a.length;i++){e.push(qx.util.Serializer.toNativeObject(a[i],b));
}return e;
}if(a instanceof qx.core.Object){if(b!=null){var f=b(a);
if(f!=undefined){return f;
}}e={};
var g=qx.util.PropertyUtil.getProperties(a.constructor);

for(var name in g){if(g[name].group!=undefined){continue;
}var d=a[z+qx.lang.String.firstUp(name)]();
e[name]=qx.util.Serializer.toNativeObject(d,b);
}return e;
}if(qx.lang.Type.isObject(a)){e={};

for(var c in a){e[c]=qx.util.Serializer.toNativeObject(a[c],b);
}return e;
}return a;
},toJson:function(F,G){var J=A;
if(F==null){return o;
}else if(qx.Class.hasInterface(F.constructor,qx.data.IListData)){J+=C;

for(var i=0;i<F.getLength();i++){J+=qx.util.Serializer.toJson(F.getItem(i),G)+B;
}
if(J!=C){J=J.substring(0,J.length-1);
}return J+x;
}else if(qx.lang.Type.isArray(F)){J+=C;

for(var i=0;i<F.length;i++){J+=qx.util.Serializer.toJson(F[i],G)+B;
}
if(J!=C){J=J.substring(0,J.length-1);
}return J+x;
}else if(F instanceof qx.core.Object){if(G!=null){var K=G(F);
if(K!=undefined){return E+K+E;
}}J+=D;
var L=qx.util.PropertyUtil.getProperties(F.constructor);

for(var name in L){if(L[name].group!=undefined){continue;
}var I=F[z+qx.lang.String.firstUp(name)]();
J+=E+name+w+qx.util.Serializer.toJson(I,G)+B;
}
if(J!=D){J=J.substring(0,J.length-1);
}return J+y;
}else if(qx.lang.Type.isObject(F)){J+=D;

for(var H in F){J+=E+H+w+qx.util.Serializer.toJson(F[H],G)+B;
}
if(J!=D){J=J.substring(0,J.length-1);
}return J+y;
}else if(qx.lang.Type.isString(F)){F=F.replace(/([\\])/g,l);
F=F.replace(/(["])/g,r);
F=F.replace(/([\r])/g,s);
F=F.replace(/([\f])/g,t);
F=F.replace(/([\n])/g,n);
F=F.replace(/([\t])/g,u);
F=F.replace(/([\b])/g,m);
return E+F+E;
}else if(qx.lang.Type.isDate(F)||qx.lang.Type.isRegExp(F)){return E+F+E;
}return F+A;
}}});
})();
(function(){var u="$$theme_",t="$$user_",s="$$init_",r="qx.util.PropertyUtil";
qx.Class.define(r,{statics:{getProperties:function(F){return F.$$properties;
},getAllProperties:function(A){var D={};
var E=A;
while(E!=qx.core.Object){var C=this.getProperties(E);

for(var B in C){D[B]=C[B];
}E=E.superclass;
}return D;
},getUserValue:function(l,m){return l[t+m];
},setUserValue:function(a,b,c){a[t+b]=c;
},deleteUserValue:function(G,H){delete (G[t+H]);
},getInitValue:function(d,e){return d[s+e];
},setInitValue:function(f,g,h){f[s+g]=h;
},deleteInitValue:function(I,J){delete (I[s+J]);
},getThemeValue:function(v,w){return v[u+w];
},setThemeValue:function(i,j,k){i[u+j]=k;
},deleteThemeValue:function(K,L){delete (K[u+L]);
},setThemed:function(n,o,p){var q=qx.core.Property.$$method.setThemed;
n[q[o]](p);
},resetThemed:function(x,y){var z=qx.core.Property.$$method.resetThemed;
x[z[y]]();
}}});
})();
(function(){var n="",m="execute",l="application/json",k="POST",j="default",i="node",h="filter",g="iid",d="Status:",c="Node:",bo="qr/",bn="completed",bm="status",bl="/",bk="<stdout filter>",bj="Task: ",bi="Waiting",bh="parameters",bg="User Filter",bf="Done",y="changeValue",z="queueid",u="<stderr filter>",w="Status",s="/queue-create-tasks-json",t="Task Browser",p="string",q="Parameters",C="mtime_str",D="Send",L="ctime_str",J="queue",T="Node",O="/search-tasks-json",bb="Filter",Y="CTime",F="group",be="New Task",bd="name",bc="gvtc",E="ID:",H="Doing",I="stdout",K="disbatch_frontend.Taskbrowser",M='and',P="Create tasks from query",V="cellDblclick",ba="MTime",A="Any",B="Add",G="columns",S="jsonfilter",R="/queue-create-tasks-from-users-json",Q="stderr",X="Reset",W='&',N="json",U="object",b="ID";
qx.Class.define(K,{extend:qx.core.Object,members:{createTaskBrowser:function(bz,bA,bB){this.app=bz;
this._queueid=bA;
this._constructor=bB;
var bC=new qx.ui.window.Window(t);
bC.setLayout(new qx.ui.layout.VBox(0));
bC.setShowStatusbar(true);
var toolbar=new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
toolbar.getLayout().setSpacing(10);
toolbar.add(new qx.ui.basic.Label(c));
this._nodetxt=new qx.ui.form.TextField;
toolbar.add(this._nodetxt);
toolbar.add(new qx.ui.core.Spacer(20));
toolbar.add(new qx.ui.basic.Label(d));
this._statusslc=new qx.ui.form.SelectBox();
this._statusslc.add(new qx.ui.form.ListItem(A,null,-5));
this._statusslc.add(new qx.ui.form.ListItem(bf,null,1));
this._statusslc.add(new qx.ui.form.ListItem(H,null,0));
this._statusslc.add(new qx.ui.form.ListItem(bi,null,-1));
toolbar.add(this._statusslc);
toolbar.add(new qx.ui.core.Spacer(20));
this._stdouttxt=new qx.ui.form.TextField;
this._stdouttxt.setPlaceholder(bk);
toolbar.add(this._stdouttxt);
this._stderrtxt=new qx.ui.form.TextField;
this._stderrtxt.setPlaceholder(u);
toolbar.add(this._stderrtxt);
toolbar.add(new qx.ui.core.Spacer(20));
var bF=new qx.ui.form.Button(bb);
bF.addListener(m,function(){this.filter();
},this);
toolbar.add(bF);
var bD=new qx.ui.form.Button(B);
bD.addListener(m,function(){this.task_editor();
},this);
toolbar.add(bD);
bC.add(toolbar);
var bE=new disbatch_frontend.TaskBrowserModel();
bE.setQueueID(this._queueid);
bE.setColumns([T,b,w,q,Y,ba],[i,g,bm,bh,L,C]);
var bG=new qx.ui.table.Table(bE);
this._tableModel=bE;
bG.set({width:900,height:400,decorator:null});
bG.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
this._table=bG;
bG.addListener(V,function(e){var v=this._table.getTableModel().getValue(1,e.getRow());
this.showSingleTask(v);
},this);
bC.add(bG);
bC.open();
return bC;
},filter:function(){var bp=new Object;
var status=this._statusslc.getModelSelection();

if(status!=-5){bp[bm]=n+status;
}
if(this._stdouttxt.getValue()&&this._stdouttxt.getValue().length>0){bp[I]=bo+this._stdouttxt.getValue()+bl;
}
if(this._stderrtxt.getValue()&&this._stderrtxt.getValue().length>0){bp[Q]=bo+this._stderrtxt.getValue()+bl;
}
if(this._nodetxt.getValue()&&this._nodetxt.getValue().length>0){bp[i]=this._nodetxt.getValue();
}this._tableModel.filter=bp;
this._tableModel.reloadData();
},showSingleTask:function(bH){var bJ=new qx.io.remote.Request(O,k,l);
var bI=new Object();
bI[g]=bH;
bJ.setParameter(J,this._queueid);
bJ.setParameter(N,1);
bJ.setParameter(h,qx.util.Json.stringify(bI));
bJ.addListener(bn,function(e){var r=e.getContent();
var bP=r[0];
var bS=new qx.ui.window.Window(bj+bH);
bS.setLayout(new qx.ui.layout.VBox());
bS.getLayout().setSpacing(5);
var bN=new qx.ui.container.Composite(new qx.ui.layout.HBox());
bN.getLayout().setSpacing(5);
var bO=new qx.ui.container.Composite(new qx.ui.layout.HBox());
bO.getLayout().setSpacing(5);
var bT=new qx.ui.form.TextArea(n);
bT.setHeight(200);
bT.setWidth(700);
bT.setValue(bP.stdout);
bT.setAllowGrowY(true);
bN.add(bT);
var bR=new qx.ui.form.TextArea(n);
bR.setHeight(200);
bR.setWidth(700);
bR.setValue(bP.stderr);
bO.add(bR);
var bU=new qx.ui.container.Composite(new qx.ui.layout.Grid());
bU.add(new qx.ui.basic.Label(c),{row:0,column:0});
bU.add(new qx.ui.basic.Label(n+bP.node),{row:0,column:1});
bU.add(new qx.ui.basic.Label(d),{row:1,column:0});
bU.add(new qx.ui.basic.Label(n+bP.status),{row:1,column:1});
bU.add(new qx.ui.basic.Label(E),{row:2,column:0});
bU.add(new qx.ui.basic.Label(n+bP.iid),{row:2,column:1});
bN.add(bU);
var bQ=new qx.ui.form.List();

for(var a in bP.parameters){if(typeof (bP.parameters[a])==p){item=new qx.ui.form.ListItem(bP.parameters[a]);
bQ.add(item);
}}bO.add(bQ);
bS.add(bN);
bS.add(bO);
bS.open();
},this);
bJ.send();
},task_editor:function(){var bt=new qx.ui.window.Window(be);
this.task_editor_win=bt;
bt.setModal(true);
var bq=new qx.ui.layout.VBox();
bq.setSpacing(5);
bt.setLayout(bq);
var br=new qx.ui.form.Form();
this.e_controller=new qx.data.controller.Form(null,br);
this.e_model=this.e_controller.createModel();
var by=this.app.queuebrowser.queue_prototypes[this._constructor];
br.addGroupHeader(this._constructor);

for(var x in by){var bu=by[x];

if(bu[j]){var bw=new qx.ui.form.TextField();
bw.setPlaceholder(bu[j]);
br.add(bw,bu[bd].replace(W,M));
}}var bv=new qx.ui.form.Button(D);
bv.addListener(m,function(){if(br.validate()){var o=qx.util.Serializer.toNativeObject(this.e_controller.createModel());
var bL=new Array();

for(var bM in o){bL.push(o[bM]);
}var bK;

if(this.toggleFilterPane.getValue()){bK=new qx.io.remote.Request(R,k,l);
bK.setParameter(h,qx.util.Json.stringify(this.userFilterPaneObject.getFilter()));
bK.setParameter(G,qx.util.Json.stringify(bL));
bK.setParameter(F,bc);
bK.setParameter(S,1);
}else{bK=new qx.io.remote.Request(s,k,l);
bK.setParameter(U,qx.util.Json.stringify([bL]));
}bK.setParameter(z,this._queueid);
bK.addListener(bn,function(e){this.filter();
},this);
bK.send();
this.task_editor_win.close();
}},this);
br.addButton(bv);
var bx=new qx.ui.form.Button(X);
bx.addListener(m,function(){br.reset();
},this);
br.addButton(bx);
this.userFilterPaneObject=new disbatch_frontend.UserFilterPane();
this.userFilterPane=this.userFilterPaneObject.createPane(this.app);
this.userFilterContainer=new qx.ui.groupbox.GroupBox(bg);
this.userFilterContainer.setLayout(new qx.ui.layout.Basic());
this.userFilterContainer.hide();
var bs=this.toggleFilterPane=new qx.ui.form.ToggleButton(P);
bs.addListener(y,function(e){if(e.getData()==1){this.userFilterContainer.add(this.userFilterPane);
this.userFilterContainer.show();
}else{this.userFilterContainer.remove(this.userFilterPane);
this.userFilterContainer.hide();
}},this);
bt.add(bs);
bt.add(this.userFilterContainer);
var f=new qx.ui.form.renderer.Single(br);
bt.add(f);
bt.open();
}}});
})();
(function(){var D="dataChanged",C="metaDataChanged",B="Integer",A="Boolean",z="qx.ui.table.model.Remote";
qx.Class.define(z,{extend:qx.ui.table.model.Abstract,construct:function(){qx.ui.table.model.Abstract.call(this);
this.__re=-1;
this.__rf=true;
this.__rg=-1;
this.__rh=0;
this.__ri=-1;
this.__rj=-1;
this.__rk=-1;
this.__rl=false;
this.__rm={};
this.__rn=0;
this.__ro=null;
this.__rp=null;
},properties:{blockSize:{check:B,init:50},maxCachedBlockCount:{check:B,init:15},clearCacheOnRemove:{check:A,init:false},blockConcurrentLoadRowCount:{check:A,init:true}},members:{__rg:null,__rl:null,__rh:null,__ri:null,__rj:null,__rk:null,__rm:null,__rn:null,__re:null,__rf:null,__rp:null,__ro:null,__rq:false,_getIgnoreCurrentRequest:function(){return this.__rl;
},getRowCount:function(){if(this.__rg==-1){if(!this.__rq||!this.getBlockConcurrentLoadRowCount()){this.__rq=true;
this._loadRowCount();
}return (this.__rg==-1)?0:this.__rg;
}else{return this.__rg;
}},_loadRowCount:function(){throw new Error("_loadRowCount is abstract");
},_onRowCountLoaded:function(E){if(this.getBlockConcurrentLoadRowCount()){this.__rq=false;
}if(E==null||E<0){E=0;
}this.__rg=Number(E);
var F={firstRow:0,lastRow:E-1,firstColumn:0,lastColumn:this.getColumnCount()-1};
this.fireDataEvent(D,F);
},reloadData:function(){this.clearCache();
if(this.__ri!=-1){var bv=this._cancelCurrentRequest();

if(bv){this.__ri=-1;
this.__rl=false;
}else{this.__rl=true;
}}this.__rj=-1;
this.__rk=-1;
if(!this.__rq||!this.getBlockConcurrentLoadRowCount()){this.__rq=true;
this._loadRowCount();
}},clearCache:function(){this.__rm={};
this.__rn=0;
},getCacheContent:function(){return {sortColumnIndex:this.__re,sortAscending:this.__rf,rowCount:this.__rg,lruCounter:this.__rh,rowBlockCache:this.__rm,rowBlockCount:this.__rn};
},restoreCacheContent:function(bj){if(this.__ri!=-1){var bk=this._cancelCurrentRequest();

if(bk){this.__ri=-1;
this.__rl=false;
}else{this.__rl=true;
}}this.__re=bj.sortColumnIndex;
this.__rf=bj.sortAscending;
this.__rg=bj.rowCount;
this.__rh=bj.lruCounter;
this.__rm=bj.rowBlockCache;
this.__rn=bj.rowBlockCount;
var bl={firstRow:0,lastRow:this.__rg-1,firstColumn:0,lastColumn:this.getColumnCount()-1};
this.fireDataEvent(D,bl);
},_cancelCurrentRequest:function(){return false;
},iterateCachedRows:function(G,H){var J=this.getBlockSize();
var I=Math.ceil(this.getRowCount()/J);
for(var Q=0;Q<=I;Q++){var K=this.__rm[Q];

if(K!=null){var P=Q*J;
var O=K.rowDataArr;

for(var N=0;N<O.length;N++){var M=O[N];
var L=G.call(H,P+N,M);

if(L!=null){O[N]=L;
}}}}},prefetchRows:function(R,S){if(this.__ri==-1){var T=this.getBlockSize();
var Y=Math.ceil(this.__rg/T);
var X=parseInt(R/T)-1;

if(X<0){X=0;
}var W=parseInt(S/T)+1;

if(W>=Y){W=Y-1;
}var V=-1;
var U=-1;

for(var ba=X;ba<=W;ba++){if(this.__rm[ba]==null||this.__rm[ba].isDirty){if(V==-1){V=ba;
}U=ba;
}}if(V!=-1){this.__rj=-1;
this.__rk=-1;
this.__ri=V;
this._loadRowData(V*T,(U+1)*T-1);
}}else{this.__rj=R;
this.__rk=S;
}},_loadRowData:function(r,s){throw new Error("_loadRowCount is abstract");
},_onRowDataLoaded:function(bb){if(bb!=null&&!this.__rl){var be=this.getBlockSize();
var bc=Math.ceil(bb.length/be);

if(bc==1){this._setRowBlockData(this.__ri,bb);
}else{for(var i=0;i<bc;i++){var bh=i*be;
var bg=[];
var bd=Math.min(be,bb.length-bh);

for(var bi=0;bi<bd;bi++){bg.push(bb[bh+bi]);
}this._setRowBlockData(this.__ri+i,bg);
}}var bf={firstRow:this.__ri*be,lastRow:(this.__ri+bc+1)*be-1,firstColumn:0,lastColumn:this.getColumnCount()-1};
this.fireDataEvent(D,bf);
}this.__ri=-1;
this.__rl=false;
if(this.__rj!=-1){this.prefetchRows(this.__rj,this.__rk);
}},_setRowBlockData:function(a,b){if(this.__rm[a]==null){this.__rn++;

while(this.__rn>this.getMaxCachedBlockCount()){var f;
var e=this.__rh;

for(var d in this.__rm){var c=this.__rm[d].lru;

if(c<e&&d>1){e=c;
f=d;
}}delete this.__rm[f];
this.__rn--;
}}this.__rm[a]={lru:++this.__rh,rowDataArr:b};
},removeRow:function(by){if(this.getClearCacheOnRemove()){this.clearCache();
var bF={firstRow:0,lastRow:this.getRowCount()-1,firstColumn:0,lastColumn:this.getColumnCount()-1};
this.fireDataEvent(D,bF);
}else{var bB=this.getBlockSize();
var bC=Math.ceil(this.getRowCount()/bB);
var bD=parseInt(by/bB);
for(var bG=bD;bG<=bC;bG++){var bz=this.__rm[bG];

if(bz!=null){var bA=0;

if(bG==bD){bA=by-bG*bB;
}bz.rowDataArr.splice(bA,1);

if(bG==bC-1){if(bz.rowDataArr.length==0){delete this.__rm[bG];
}}else{var bE=this.__rm[bG+1];

if(bE!=null){bz.rowDataArr.push(bE.rowDataArr[0]);
}else{bz.isDirty=true;
}}}}
if(this.__rg!=-1){this.__rg--;
}if(this.hasListener(D)){var bF={firstRow:by,lastRow:this.getRowCount()-1,firstColumn:0,lastColumn:this.getColumnCount()-1};
this.fireDataEvent(D,bF);
}}},getRowData:function(g){var h=this.getBlockSize();
var l=parseInt(g/h);
var j=this.__rm[l];

if(j==null){return null;
}else{var k=j.rowDataArr[g-(l*h)];
if(j.lru!=this.__rh){j.lru=++this.__rh;
}return k;
}},getValue:function(m,n){var o=this.getRowData(n);

if(o==null){return null;
}else{var p=this.getColumnId(m);
return o[p];
}},setValue:function(bm,bn,bo){var bp=this.getRowData(bn);

if(bp==null){return ;
}else{var br=this.getColumnId(bm);
bp[br]=bo;
if(this.hasListener(D)){var bq={firstRow:bn,lastRow:bn,firstColumn:bm,lastColumn:bm};
this.fireDataEvent(D,bq);
}}},setEditable:function(x){this.__rp=[];

for(var y=0;y<this.getColumnCount();y++){this.__rp[y]=x;
}this.fireEvent(C);
},setColumnEditable:function(bw,bx){if(bx!=this.isColumnEditable(bw)){if(this.__rp==null){this.__rp=[];
}this.__rp[bw]=bx;
this.fireEvent(C);
}},isColumnEditable:function(q){return (this.__rp?(this.__rp[q]==true):false);
},setColumnSortable:function(bs,bt){if(bt!=this.isColumnSortable(bs)){if(this.__ro==null){this.__ro=[];
}this.__ro[bs]=bt;
this.fireEvent(C);
}},isColumnSortable:function(bu){return (this.__ro?(this.__ro[bu]!==false):true);
},sortByColumn:function(t,u){if(this.__re!=t||this.__rf!=u){this.__re=t;
this.__rf=u;
this.clearCache();
this.fireEvent(C);
}},getSortColumnIndex:function(){return this.__re;
},isSortAscending:function(){return this.__rf;
},setSortColumnIndexWithoutSortingData:function(w){this.__re=w;
},setSortAscendingWithoutSortingData:function(v){this.__rf=v;
}},destruct:function(){this.__ro=this.__rp=this.__rm=null;
}});
})();
(function(){var v="parameters",u="application/json",t="completed",s="queue",q="GET",p="/search-tasks-json",o="json",n="filter",m="limit",l="",h="skip",k="disbatch_frontend.TaskBrowserModel",j="count",g=" ",f="terse",i="string";
qx.Class.define(k,{extend:qx.ui.table.model.Remote,members:{setQueueID:function(A){this.queue=A;
},_loadRowCount:function(){var w=p;
var z=new qx.io.remote.Request(w,q,u);
z.setParameter(s,this.queue);
z.setParameter(o,1);
z.setParameter(n,this.constructFilter());
z.setParameter(j,1);
z.addListener(t,this._onRowCountCompleted,this);
z.send();
},_onRowCountCompleted:function(a){var b=a.getContent();

if(b!=null){this._onRowCountLoaded(b[1]);
}},_loadRowData:function(B,C){var D=p;
var E=new qx.io.remote.Request(D,q,u);
E.setParameter(s,this.queue);
E.setParameter(o,1);
E.setParameter(n,this.constructFilter());
E.setParameter(h,B);
E.setParameter(m,C-B+1);
E.setParameter(f,1);
E.addListener(t,this._onLoadRowDataCompleted,this);
E.send();
},_onLoadRowDataCompleted:function(c){var d=c.getContent();

if(d!=null){for(var x in d){var r=d[x];

if(r[v]){var e=l;

for(y in r[v]){if(typeof (r[v][y])==i)e+=r[v][y]+g;
}r[v]=e;
}}this._onRowDataLoaded(d);
}else{alert("w t f");
}},constructFilter:function(){if(!this.filter){this.filter=new Object;
}return qx.util.Json.stringify(this.filter);
}}});
})();
(function(){var f="textarea",e="qx.ui.form.TextArea",d="_applyWrap",c="Boolean";
qx.Class.define(e,{extend:qx.ui.form.AbstractField,construct:function(a){qx.ui.form.AbstractField.call(this,a);
this.initWrap();
},properties:{wrap:{check:c,init:true,apply:d},appearance:{refine:true,init:f}},members:{_createInputElement:function(){return new qx.html.Input(f);
},_applyWrap:function(g,h){this.getContentElement().setWrap(g);
},_getContentHint:function(){var b=qx.ui.form.AbstractField.prototype._getContentHint.call(this);
b.height=b.height*4;
b.width=this._getTextSize().width*20;
return b;
}}});
})();
(function(){var A="$gt",z="$lt",y="$not",x="execute",u="object",t="",s=">",r="<",q="=",p="Value",g="~",o="Key",j="Delete",d="disbatch_frontend.UserFilterPane",c="qr/",i="cellClick",h="Not",m='$not',b="Cancel",n="Apply",f="/";
qx.Class.define(d,{extend:qx.core.Object,members:{createPane:function(D){this.filter=new Object;
this.app=D;
var scroll=new qx.ui.container.Scroll();
var E=new qx.ui.container.Composite(new qx.ui.layout.Grid(2,5));
E.set({allowGrowX:true,allowGrowY:true});
scroll.add(E);
this.tableModel=new qx.ui.table.model.Simple();
this.tableModel.setColumns([o,p]);
this.table=new qx.ui.table.Table(this.tableModel);
this.table.set({width:600,height:200});
this.table.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
this.table.addListener(i,function(e){this.editFilter(this.tableModel.getValue(0,e.getRow()),this.tableModel.getValue(1,e.getRow()));
},this);
E.add(this.table,{row:0,column:0,colSpan:2});
E.add(new qx.ui.basic.Label(o),{row:1,column:0});
E.add(new qx.ui.basic.Label(p),{row:1,column:1});
this.txtKey=new qx.ui.form.TextField();
E.add(this.txtKey,{row:2,column:0});
this.txtValue=new qx.ui.form.TextField();
E.add(this.txtValue,{row:2,column:1});
var F=new qx.ui.container.Composite(new qx.ui.layout.VBox());
opeq=this.opeq=new qx.ui.form.RadioButton(q);
opgt=this.opgt=new qx.ui.form.RadioButton(s);
oplt=this.oplt=new qx.ui.form.RadioButton(r);
opre=this.opre=new qx.ui.form.RadioButton(g);
F.add(opeq);
F.add(opgt);
F.add(oplt);
F.add(opre);
this.operatorsGroup=new qx.ui.form.RadioGroup(opeq,opgt,oplt,opre);
E.add(F,{row:3,column:0});
var J=new qx.ui.container.Composite(new qx.ui.layout.VBox());
this.chknot=new qx.ui.form.CheckBox(h);
J.add(this.chknot);
E.add(J,{row:3,column:1});
var toolbar=new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
toolbar.getLayout().setSpacing(5);
var G=new qx.ui.form.Button(n);
G.addListener(x,function(){this.addFilter();
},this);
toolbar.add(G);
var I=new qx.ui.form.Button(b);
I.addListener(x,function(){this.emptyFilter();
},this);
toolbar.add(I);
var H=new qx.ui.form.Button(j);
H.addListener(x,function(){this.deleteFilter();
},this);
toolbar.add(H);
E.add(toolbar,{row:4,column:0,colSpan:2});
return E;
},addFilter:function(){var v=this.txtValue.getValue();

if(this.operatorsGroup.getSelection().length>0){var B=this.operatorsGroup.getSelection();
var C=B[0].getLabel();

if(C!=q){var w=v;
v=new Object;

if(C==s){v[A]=w;
}else if(C==r){v[z]=w;
}else if(C==g){v=c+w+f;
}}}
if(this.chknot.getValue()){var w=v;
v=new Object;
v[m]=w;
}this.filter[this.txtKey.getValue()]=v;
this.blitToModel();
this.emptyFilter();
},blitToModel:function(){this.tableModel.removeRows(0,this.tableModel.getRowCount());

for(var k in this.filter){var a=this.filter[k];

if(typeof (a)==u){if(a[y]){this.chknot.setValue(true);
a=a[y];
}}
if(typeof (a)==u){if(a[z]){this.oplt.setValue(true);
a=a[z];
}else if(a[A]){this.opgt.setValue(true);
a=a[A];
}}this.tableModel.addRows([[k,a]]);
}},editFilter:function(K,L){this.txtKey.setValue(K);
this.chknot.setValue(false);
this.opeq.setValue(true);
L=this.filter[K];

if(typeof (L)==u){for(var k in L){if(k==y){this.chknot.setValue(true);
L=L[k];
}}
for(var l in L){if(l==z){this.oplt.setValue(true);
L=L[l];
}else if(l==A){this.opgt.setValue(true);
L=L[l];
}}}this.txtValue.setValue(L);
},deleteFilter:function(){delete this.filter[this.txtKey.getValue()];
this.blitToModel();
this.emptyFilter();
},emptyFilter:function(){this.txtKey.setValue(t);
this.txtValue.setValue(t);
this.chknot.setValue(false);
this.opeq.setValue(true);
},getFilter:function(){return this.filter;
}}});
})();
(function(){var c="pane",b="qx.ui.container.Scroll";
qx.Class.define(b,{extend:qx.ui.core.scroll.AbstractScrollArea,include:[qx.ui.core.MContentPadding],construct:function(content){qx.ui.core.scroll.AbstractScrollArea.call(this);

if(content){this.add(content);
}},members:{add:function(a){this.getChildControl(c).add(a);
},remove:function(d){this.getChildControl(c).remove(d);
},getChildren:function(){return this.getChildControl(c).getChildren();
},_getContentPaddingTarget:function(){return this.getChildControl(c);
}}});
})();
(function(){var b="qx.ui.form.IRadioItem",a="qx.event.type.Data";
qx.Interface.define(b,{events:{"changeValue":a},members:{setValue:function(d){},getValue:function(){},setGroup:function(c){this.assertInstance(c,qx.ui.form.RadioGroup);
},getGroup:function(){}}});
})();
(function(){var t="checked",s="keypress",r="Boolean",q="Right",p="_applyValue",o="changeValue",n="qx.ui.form.RadioButton",m="radiobutton",l="Left",k="qx.ui.form.RadioGroup",h="Down",j="_applyGroup",i="Up",g="execute";
qx.Class.define(n,{extend:qx.ui.form.Button,include:[qx.ui.form.MForm,qx.ui.form.MModelProperty],implement:[qx.ui.form.IRadioItem,qx.ui.form.IForm,qx.ui.form.IBooleanForm,qx.ui.form.IModel],construct:function(c){{};
qx.ui.form.Button.call(this,c);
this.addListener(g,this._onExecute);
this.addListener(s,this._onKeyPress);
},properties:{group:{check:k,nullable:true,apply:j},value:{check:r,nullable:true,event:o,apply:p,init:false},appearance:{refine:true,init:m},allowGrowX:{refine:true,init:false}},members:{_applyValue:function(d,f){d?this.addState(t):this.removeState(t);

if(d&&this.getFocusable()){this.focus();
}},_applyGroup:function(a,b){if(b){b.remove(this);
}
if(a){a.add(this);
}},_onExecute:function(e){this.setValue(true);
},_onKeyPress:function(e){var u=this.getGroup();

if(!u){return;
}
switch(e.getKeyIdentifier()){case l:case i:u.selectPrevious();
break;
case q:case h:u.selectNext();
break;
}}}});
})();
(function(){var u="Boolean",t="changeValue",s="_applyAllowEmptySelection",r="_applyInvalidMessage",q="qx.ui.form.RadioGroup",p="_applyValid",o="",n="changeRequired",m="changeValid",k="__rr",g="changeEnabled",j="changeInvalidMessage",h="changeSelection",f="_applyEnabled",d="String";
qx.Class.define(q,{extend:qx.core.Object,implement:[qx.ui.core.ISingleSelection,qx.ui.form.IForm,qx.ui.form.IModelSelection],include:[qx.ui.core.MSingleSelectionHandling,qx.ui.form.MModelSelection],construct:function(N){qx.core.Object.call(this);
this.__rr=[];
this.addListener(h,this.__rs,this);

if(N!=null){this.add.apply(this,arguments);
}},properties:{enabled:{check:u,apply:f,event:g,init:true},wrap:{check:u,init:true},allowEmptySelection:{check:u,init:false,apply:s},valid:{check:u,init:true,apply:p,event:m},required:{check:u,init:false,event:n},invalidMessage:{check:d,init:o,event:j,apply:r}},members:{__rr:null,getItems:function(){return this.__rr;
},add:function(z){var A=this.__rr;
var B;

for(var i=0,l=arguments.length;i<l;i++){B=arguments[i];

if(qx.lang.Array.contains(A,B)){continue;
}B.addListener(t,this._onItemChangeChecked,this);
A.push(B);
B.setGroup(this);
if(B.getValue()){this.setSelection([B]);
}}if(!this.isAllowEmptySelection()&&A.length>0&&!this.getSelection()[0]){this.setSelection([A[0]]);
}},remove:function(O){var P=this.__rr;

if(qx.lang.Array.contains(P,O)){qx.lang.Array.remove(P,O);
if(O.getGroup()===this){O.resetGroup();
}O.removeListener(t,this._onItemChangeChecked,this);
if(O.getValue()){this.resetSelection();
}}},getChildren:function(){return this.__rr;
},_onItemChangeChecked:function(e){var J=e.getTarget();

if(J.getValue()){this.setSelection([J]);
}else if(this.getSelection()[0]==J){this.resetSelection();
}},_applyInvalidMessage:function(C,D){for(var i=0;i<this.__rr.length;i++){this.__rr[i].setInvalidMessage(C);
}},_applyValid:function(x,y){for(var i=0;i<this.__rr.length;i++){this.__rr[i].setValid(x);
}},_applyEnabled:function(a,b){var c=this.__rr;

if(a==null){for(var i=0,l=c.length;i<l;i++){c[i].resetEnabled();
}}else{for(var i=0,l=c.length;i<l;i++){c[i].setEnabled(a);
}}},_applyAllowEmptySelection:function(v,w){if(!v&&this.isSelectionEmpty()){this.resetSelection();
}},selectNext:function(){var G=this.getSelection()[0];
var I=this.__rr;
var H=I.indexOf(G);

if(H==-1){return;
}var i=0;
var length=I.length;
if(this.getWrap()){H=(H+1)%length;
}else{H=Math.min(H+1,length-1);
}
while(i<length&&!I[H].getEnabled()){H=(H+1)%length;
i++;
}this.setSelection([I[H]]);
},selectPrevious:function(){var K=this.getSelection()[0];
var M=this.__rr;
var L=M.indexOf(K);

if(L==-1){return;
}var i=0;
var length=M.length;
if(this.getWrap()){L=(L-1+length)%length;
}else{L=Math.max(L-1,0);
}
while(i<length&&!M[L].getEnabled()){L=(L-1+length)%length;
i++;
}this.setSelection([M[L]]);
},_getItems:function(){return this.getItems();
},_isAllowEmptySelection:function(){return this.isAllowEmptySelection();
},__rs:function(e){var F=e.getData()[0];
var E=e.getOldData()[0];

if(E){E.setValue(false);
}
if(F){F.setValue(true);
}}},destruct:function(){this._disposeArray(k);
}});
})();
(function(){var s="pressed",r="abandoned",q="hovered",p="checked",o="Space",n="Enter",m="mouseup",l="mousedown",k="Boolean",j="_applyValue",c="mouseover",i="mouseout",g="qx.ui.form.ToggleButton",b="keydown",a="changeValue",f="button",d="keyup",h="execute";
qx.Class.define(g,{extend:qx.ui.basic.Atom,include:[qx.ui.core.MExecutable],implement:[qx.ui.form.IBooleanForm,qx.ui.form.IExecutable],construct:function(t,u){qx.ui.basic.Atom.call(this,t,u);
this.addListener(c,this._onMouseOver);
this.addListener(i,this._onMouseOut);
this.addListener(l,this._onMouseDown);
this.addListener(m,this._onMouseUp);
this.addListener(b,this._onKeyDown);
this.addListener(d,this._onKeyUp);
this.addListener(h,this._onExecute,this);
},properties:{appearance:{refine:true,init:f},focusable:{refine:true,init:true},value:{check:k,nullable:true,event:a,apply:j,init:false}},members:{_applyValue:function(v,w){v?this.addState(p):this.removeState(p);
},_onExecute:function(e){this.toggleValue();
},_onMouseOver:function(e){if(e.getTarget()!==this){return;
}this.addState(q);

if(this.hasState(r)){this.removeState(r);
this.addState(s);
}},_onMouseOut:function(e){if(e.getTarget()!==this){return;
}this.removeState(q);

if(this.hasState(s)){if(!this.getValue()){this.removeState(s);
}this.addState(r);
}},_onMouseDown:function(e){if(!e.isLeftPressed()){return;
}this.capture();
this.removeState(r);
this.addState(s);
e.stopPropagation();
},_onMouseUp:function(e){this.releaseCapture();

if(this.hasState(r)){this.removeState(r);
}else if(this.hasState(s)){this.execute();
}this.removeState(s);
e.stopPropagation();
},_onKeyDown:function(e){switch(e.getKeyIdentifier()){case n:case o:this.removeState(r);
this.addState(s);
e.stopPropagation();
}},_onKeyUp:function(e){if(!this.hasState(s)){return;
}
switch(e.getKeyIdentifier()){case n:case o:this.removeState(r);
this.execute();
this.removeState(s);
e.stopPropagation();
}}}});
})();
(function(){var b="checkbox",a="qx.ui.form.CheckBox";
qx.Class.define(a,{extend:qx.ui.form.ToggleButton,include:[qx.ui.form.MForm,qx.ui.form.MModelProperty],implement:[qx.ui.form.IForm,qx.ui.form.IModel],construct:function(c){{};
qx.ui.form.ToggleButton.call(this,c);
this.setValue(false);
},properties:{appearance:{refine:true,init:b},allowGrowX:{refine:true,init:false}}});
})();
(function(){var i="legend",h="frame",g="middle",f="top",d="resize",c="qx.ui.groupbox.GroupBox",b="groupbox",a="_applyLegendPosition";
qx.Class.define(c,{extend:qx.ui.core.Widget,include:[qx.ui.core.MRemoteChildrenHandling,qx.ui.core.MRemoteLayoutHandling,qx.ui.core.MContentPadding,qx.ui.form.MForm],implement:[qx.ui.form.IForm],construct:function(m,n){qx.ui.core.Widget.call(this);
this._setLayout(new qx.ui.layout.Canvas);
this._createChildControl(h);
this._createChildControl(i);
if(m!=null){this.setLegend(m);
}
if(n!=null){this.setIcon(n);
}},properties:{appearance:{refine:true,init:b},legendPosition:{check:[f,g],init:g,apply:a,themeable:true}},members:{_forwardStates:{invalid:true},_createChildControlImpl:function(p){var q;

switch(p){case h:q=new qx.ui.container.Composite();
this._add(q,{left:0,top:6,right:0,bottom:0});
break;
case i:q=new qx.ui.basic.Atom();
q.addListener(d,this._repositionFrame,this);
this._add(q);
break;
}return q||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,p);
},_getContentPaddingTarget:function(){return this.getChildControl(h);
},_applyLegendPosition:function(e){if(this.getChildControl(i).getBounds()){this._repositionFrame();
}},_repositionFrame:function(){var k=this.getChildControl(i);
var j=this.getChildControl(h);
var l=k.getBounds().height;
if(this.getLegendPosition()==g){j.setLayoutProperties({"top":Math.round(l/2)});
}else if(this.getLegendPosition()==f){j.setLayoutProperties({"top":l});
}},getChildrenContainer:function(){return this.getChildControl(h);
},setLegend:function(r){var s=this.getChildControl(i);

if(r!==null){s.setLabel(r);
s.show();
}else{s.exclude();
}},getLegend:function(){return this.getChildControl(i).getLabel();
},setIcon:function(o){this.getChildControl(i).setIcon(o);
},getIcon:function(){this.getChildControl(i).getIcon();
}}});
})();
(function(){var j="#CCCCCC",i="#F3F3F3",h="#E4E4E4",g="#1a1a1a",f="#084FAB",e="gray",d="#fffefe",c="white",b="#4a4a4a",a="#EEEEEE",K="#80B4EF",J="#C72B2B",I="#ffffdd",H="#334866",G="#00204D",F="#666666",E="#CBC8CD",D="#99C3FE",C="#808080",B="#F4F4F4",q="#001533",r="#909090",o="#FCFCFC",p="#314a6e",m="#B6B6B6",n="#0880EF",k="#4d4d4d",l="#DFDFDF",s="#000000",t="#FF9999",w="#7B7A7E",v="#26364D",y="#990000",x="#AFAFAF",A="#404955",z="#AAAAAA",u="qx.theme.modern.Color";
qx.Theme.define(u,{colors:{"background-application":l,"background-pane":i,"background-light":o,"background-medium":a,"background-splitpane":x,"background-tip":I,"background-tip-error":J,"background-odd":h,"text-light":r,"text-gray":b,"text-label":g,"text-title":p,"text-input":s,"text-hovered":q,"text-disabled":w,"text-selected":d,"text-active":v,"text-inactive":A,"text-placeholder":E,"border-main":k,"border-separator":C,"border-input":H,"border-disabled":m,"border-pane":G,"border-button":F,"border-column":j,"border-focused":D,"invalid":y,"border-focused-invalid":t,"table-pane":i,"table-focus-indicator":n,"table-row-background-focused-selected":f,"table-row-background-focused":K,"table-row-background-selected":f,"table-row-background-even":i,"table-row-background-odd":h,"table-row-selected":d,"table-row":g,"table-row-line":j,"table-column-line":j,"progressive-table-header":z,"progressive-table-row-background-even":B,"progressive-table-row-background-odd":h,"progressive-progressbar-background":e,"progressive-progressbar-indicator-done":j,"progressive-progressbar-indicator-undone":c,"progressive-progressbar-percent-background":e,"progressive-progressbar-percent-text":c}});
})();
(function(){var a="disbatch_frontend.theme.Color";
qx.Theme.define(a,{extend:qx.theme.modern.Color,colors:{}});
})();
(function(){var j="Number",i="_applyInsets",h="abstract",g="insetRight",f="insetTop",e="insetBottom",d="qx.ui.decoration.Abstract",c="shorthand",b="insetLeft";
qx.Class.define(d,{extend:qx.core.Object,implement:[qx.ui.decoration.IDecorator],type:h,properties:{insetLeft:{check:j,nullable:true,apply:i},insetRight:{check:j,nullable:true,apply:i},insetBottom:{check:j,nullable:true,apply:i},insetTop:{check:j,nullable:true,apply:i},insets:{group:[f,g,e,b],mode:c}},members:{__rt:null,_getDefaultInsets:function(){throw new Error("Abstract method called.");
},_isInitialized:function(){throw new Error("Abstract method called.");
},_resetInsets:function(){this.__rt=null;
},getInsets:function(){if(this.__rt){return this.__rt;
}var a=this._getDefaultInsets();
return this.__rt={left:this.getInsetLeft()==null?a.left:this.getInsetLeft(),right:this.getInsetRight()==null?a.right:this.getInsetRight(),bottom:this.getInsetBottom()==null?a.bottom:this.getInsetBottom(),top:this.getInsetTop()==null?a.top:this.getInsetTop()};
},_applyInsets:function(){{};
this.__rt=null;
}},destruct:function(){this.__rt=null;
}});
})();
(function(){var q="_applyBackground",p="repeat",o="mshtml",n="backgroundPositionX",m="",l="backgroundPositionY",k="no-repeat",j="scale",i=" ",h="repeat-x",c="qx.client",g="repeat-y",f="hidden",b="qx.ui.decoration.MBackgroundImage",a="String",e='"></div>',d='<div style="';
qx.Mixin.define(b,{properties:{backgroundImage:{check:a,nullable:true,apply:q},backgroundRepeat:{check:[p,h,g,k,j],init:p,apply:q},backgroundPositionX:{nullable:true,apply:q},backgroundPositionY:{nullable:true,apply:q},backgroundPosition:{group:[l,n]}},members:{_generateBackgroundMarkup:function(r){{};
var v=m;
var u=this.getBackgroundImage();
var t=this.getBackgroundRepeat();
var top=this.getBackgroundPositionY();

if(top==null){top=0;
}var w=this.getBackgroundPositionX();

if(w==null){w=0;
}r.backgroundPosition=w+i+top;
if(u){var s=qx.util.AliasManager.getInstance().resolve(u);
v=qx.bom.element.Decoration.create(s,t,r);
}else{if(r){if(qx.core.Variant.isSet(c,o)){if(qx.bom.client.Engine.VERSION<7||qx.bom.client.Feature.QUIRKS_MODE){r.overflow=f;
}}v=d+qx.bom.element.Style.compile(r)+e;
}}return v;
},_applyBackground:function(){{};
}}});
})();
(function(){var p="_applyStyle",o="",n="Color",m="px",l="solid",k="dotted",j="double",i="dashed",h="_applyWidth",g="qx.ui.decoration.Uniform",d="px ",f=" ",e="scale",c="PositiveInteger",b="absolute";
qx.Class.define(g,{extend:qx.ui.decoration.Abstract,include:[qx.ui.decoration.MBackgroundImage],construct:function(u,v,w){qx.ui.decoration.Abstract.call(this);
if(u!=null){this.setWidth(u);
}
if(v!=null){this.setStyle(v);
}
if(w!=null){this.setColor(w);
}},properties:{width:{check:c,init:0,apply:h},style:{nullable:true,check:[l,k,i,j],init:l,apply:p},color:{nullable:true,check:n,apply:p},backgroundColor:{check:n,nullable:true,apply:p}},members:{__ru:null,_getDefaultInsets:function(){var a=this.getWidth();
return {top:a,right:a,bottom:a,left:a};
},_isInitialized:function(){return !!this.__ru;
},getMarkup:function(){if(this.__ru){return this.__ru;
}var q={position:b,top:0,left:0};
var r=this.getWidth();
{};
var t=qx.theme.manager.Color.getInstance();
q.border=r+d+this.getStyle()+f+(t.resolve(this.getColor())||o);
var s=this._generateBackgroundMarkup(q);
return this.__ru=s;
},resize:function(A,B,C){var E=this.getBackgroundImage()&&this.getBackgroundRepeat()==e;

if(E||qx.bom.client.Feature.CONTENT_BOX){var D=this.getWidth()*2;
B-=D;
C-=D;
if(B<0){B=0;
}
if(C<0){C=0;
}}A.style.width=B+m;
A.style.height=C+m;
},tint:function(x,y){var z=qx.theme.manager.Color.getInstance();

if(y==null){y=this.getBackgroundColor();
}x.style.backgroundColor=z.resolve(y)||o;
},_applyWidth:function(){{};
this._resetInsets();
},_applyStyle:function(){{};
}},destruct:function(){this.__ru=null;
}});
})();
(function(){var h="px",g="qx.ui.decoration.Background",f="",e="_applyStyle",d="Color",c="absolute";
qx.Class.define(g,{extend:qx.ui.decoration.Abstract,include:[qx.ui.decoration.MBackgroundImage],construct:function(l){qx.ui.decoration.Abstract.call(this);

if(l!=null){this.setBackgroundColor(l);
}},properties:{backgroundColor:{check:d,nullable:true,apply:e}},members:{__rv:null,_getDefaultInsets:function(){return {top:0,right:0,bottom:0,left:0};
},_isInitialized:function(){return !!this.__rv;
},getMarkup:function(){if(this.__rv){return this.__rv;
}var a={position:c,top:0,left:0};
var b=this._generateBackgroundMarkup(a);
return this.__rv=b;
},resize:function(m,n,o){m.style.width=n+h;
m.style.height=o+h;
},tint:function(i,j){var k=qx.theme.manager.Color.getInstance();

if(j==null){j=this.getBackgroundColor();
}i.style.backgroundColor=k.resolve(j)||f;
},_applyStyle:function(){{};
}},destruct:function(){this.__rv=null;
}});
})();
(function(){var z="_applyStyle",y="solid",x="Color",w="",v="double",u="px ",t="dotted",s="_applyWidth",r="dashed",q="Number",V=" ",U="shorthand",T="px",S="widthTop",R="styleRight",Q="styleLeft",P="widthLeft",O="widthBottom",N="styleTop",M="colorBottom",G="styleBottom",H="widthRight",E="colorLeft",F="colorRight",C="colorTop",D="scale",A="border-top",B="border-left",I="border-right",J="qx.ui.decoration.Single",L="border-bottom",K="absolute";
qx.Class.define(J,{extend:qx.ui.decoration.Abstract,include:[qx.ui.decoration.MBackgroundImage],construct:function(i,j,k){qx.ui.decoration.Abstract.call(this);
if(i!=null){this.setWidth(i);
}
if(j!=null){this.setStyle(j);
}
if(k!=null){this.setColor(k);
}},properties:{widthTop:{check:q,init:0,apply:s},widthRight:{check:q,init:0,apply:s},widthBottom:{check:q,init:0,apply:s},widthLeft:{check:q,init:0,apply:s},styleTop:{nullable:true,check:[y,t,r,v],init:y,apply:z},styleRight:{nullable:true,check:[y,t,r,v],init:y,apply:z},styleBottom:{nullable:true,check:[y,t,r,v],init:y,apply:z},styleLeft:{nullable:true,check:[y,t,r,v],init:y,apply:z},colorTop:{nullable:true,check:x,apply:z},colorRight:{nullable:true,check:x,apply:z},colorBottom:{nullable:true,check:x,apply:z},colorLeft:{nullable:true,check:x,apply:z},backgroundColor:{check:x,nullable:true,apply:z},left:{group:[P,Q,E]},right:{group:[H,R,F]},top:{group:[S,N,C]},bottom:{group:[O,G,M]},width:{group:[S,H,O,P],mode:U},style:{group:[N,R,G,Q],mode:U},color:{group:[C,F,M,E],mode:U}},members:{__rw:null,_getDefaultInsets:function(){return {top:this.getWidthTop(),right:this.getWidthRight(),bottom:this.getWidthBottom(),left:this.getWidthLeft()};
},_isInitialized:function(){return !!this.__rw;
},getMarkup:function(l){if(this.__rw){return this.__rw;
}var m=qx.theme.manager.Color.getInstance();
var n={};
var p=this.getWidthTop();

if(p>0){n[A]=p+u+this.getStyleTop()+V+(m.resolve(this.getColorTop())||w);
}var p=this.getWidthRight();

if(p>0){n[I]=p+u+this.getStyleRight()+V+(m.resolve(this.getColorRight())||w);
}var p=this.getWidthBottom();

if(p>0){n[L]=p+u+this.getStyleBottom()+V+(m.resolve(this.getColorBottom())||w);
}var p=this.getWidthLeft();

if(p>0){n[B]=p+u+this.getStyleLeft()+V+(m.resolve(this.getColorLeft())||w);
}{};
n.position=K;
n.top=0;
n.left=0;
var o=this._generateBackgroundMarkup(n);
return this.__rw=o;
},resize:function(a,b,c){var e=this.getBackgroundImage()&&this.getBackgroundRepeat()==D;

if(e||qx.bom.client.Feature.CONTENT_BOX){var d=this.getInsets();
b-=d.left+d.right;
c-=d.top+d.bottom;
if(b<0){b=0;
}
if(c<0){c=0;
}}a.style.width=b+T;
a.style.height=c+T;
},tint:function(f,g){var h=qx.theme.manager.Color.getInstance();

if(g==null){g=this.getBackgroundColor();
}f.style.backgroundColor=h.resolve(g)||w;
},_applyWidth:function(){{};
this._resetInsets();
},_applyStyle:function(){{};
}},destruct:function(){this.__rw=null;
}});
})();
(function(){var m="Number",l="_applyInsets",k="-l",j="insetRight",i="insetTop",h="_applyBaseImage",g="insetBottom",f="set",e="shorthand",d="-t",a="insetLeft",c="String",b="qx.ui.decoration.Grid";
qx.Class.define(b,{extend:qx.core.Object,implement:[qx.ui.decoration.IDecorator],construct:function(F,G){qx.core.Object.call(this);

if(qx.ui.decoration.css3.BorderImage.IS_SUPPORTED){this.__rx=new qx.ui.decoration.css3.BorderImage();

if(F){this.__ry(F);
}}else{this.__rx=new qx.ui.decoration.GridDiv(F);
}
if(G!=null){this.__rx.setInsets(G);
}},properties:{baseImage:{check:c,nullable:true,apply:h},insetLeft:{check:m,nullable:true,apply:l},insetRight:{check:m,nullable:true,apply:l},insetBottom:{check:m,nullable:true,apply:l},insetTop:{check:m,nullable:true,apply:l},insets:{group:[i,j,g,a],mode:e}},members:{__rx:null,getMarkup:function(){return this.__rx.getMarkup();
},resize:function(n,o,p){this.__rx.resize(n,o,p);
},tint:function(q,r){},getInsets:function(){return this.__rx.getInsets();
},_applyInsets:function(C,D,name){var E=f+qx.lang.String.firstUp(name);
this.__rx[E](C);
},_applyBaseImage:function(A,B){if(this.__rx instanceof qx.ui.decoration.GridDiv){this.__rx.setBaseImage(A);
}else{this.__ry(A);
}},__ry:function(s){this.__rx.setBorderImage(s);
var w=qx.util.AliasManager.getInstance().resolve(s);
var x=/(.*)(\.[a-z]+)$/.exec(w);
var u=x[1];
var v=x[2];
var t=qx.util.ResourceManager.getInstance();
var y=t.getImageHeight(u+d+v);
var z=t.getImageWidth(u+k+v);
this.__rx.setSlice([y,z]);
}},destruct:function(){this.__rx=null;
}});
})();
(function(){var u="_applyStyle",t='"></div>',s="Color",r="1px",q='<div style="',p='border:',o="1px solid ",n="",m=";",l="px",G='</div>',F="qx.ui.decoration.Beveled",E='<div style="position:absolute;top:1px;left:1px;',D='border-bottom:',C='border-right:',B='border-left:',A='border-top:',z="Number",y='<div style="position:absolute;top:1px;left:0px;',x='position:absolute;top:0px;left:1px;',v='<div style="overflow:hidden;font-size:0;line-height:0;">',w="absolute";
qx.Class.define(F,{extend:qx.ui.decoration.Abstract,include:[qx.ui.decoration.MBackgroundImage],construct:function(i,j,k){qx.ui.decoration.Abstract.call(this);
if(i!=null){this.setOuterColor(i);
}
if(j!=null){this.setInnerColor(j);
}
if(k!=null){this.setInnerOpacity(k);
}},properties:{innerColor:{check:s,nullable:true,apply:u},innerOpacity:{check:z,init:1,apply:u},outerColor:{check:s,nullable:true,apply:u},backgroundColor:{check:s,nullable:true,apply:u}},members:{__rz:null,_getDefaultInsets:function(){return {top:2,right:2,bottom:2,left:2};
},_isInitialized:function(){return !!this.__rz;
},_applyStyle:function(){{};
},getMarkup:function(){if(this.__rz){return this.__rz;
}var a=qx.theme.manager.Color.getInstance();
var b=[];
var e=o+a.resolve(this.getOuterColor())+m;
var d=o+a.resolve(this.getInnerColor())+m;
b.push(v);
b.push(q);
b.push(p,e);
b.push(qx.bom.element.Opacity.compile(0.35));
b.push(t);
b.push(y);
b.push(B,e);
b.push(C,e);
b.push(t);
b.push(q);
b.push(x);
b.push(A,e);
b.push(D,e);
b.push(t);
var c={position:w,top:r,left:r};
b.push(this._generateBackgroundMarkup(c));
b.push(E);
b.push(p,d);
b.push(qx.bom.element.Opacity.compile(this.getInnerOpacity()));
b.push(t);
b.push(G);
return this.__rz=b.join(n);
},resize:function(H,I,J){if(I<4){I=4;
}
if(J<4){J=4;
}if(qx.bom.client.Feature.CONTENT_BOX){var outerWidth=I-2;
var outerHeight=J-2;
var P=outerWidth;
var O=outerHeight;
var innerWidth=I-4;
var innerHeight=J-4;
}else{var outerWidth=I;
var outerHeight=J;
var P=I-2;
var O=J-2;
var innerWidth=P;
var innerHeight=O;
}var R=l;
var N=H.childNodes[0].style;
N.width=outerWidth+R;
N.height=outerHeight+R;
var M=H.childNodes[1].style;
M.width=outerWidth+R;
M.height=O+R;
var L=H.childNodes[2].style;
L.width=P+R;
L.height=outerHeight+R;
var K=H.childNodes[3].style;
K.width=P+R;
K.height=O+R;
var Q=H.childNodes[4].style;
Q.width=innerWidth+R;
Q.height=innerHeight+R;
},tint:function(f,g){var h=qx.theme.manager.Color.getInstance();

if(g==null){g=this.getBackgroundColor();
}f.childNodes[3].style.backgroundColor=h.resolve(g)||n;
}},destruct:function(){this.__rz=null;
}});
})();
(function(){var m="solid",l="scale",k="border-main",j="white",i="repeat-x",h="border-separator",g="background-light",f="invalid",e="border-focused-invalid",d="border-disabled",bs="decoration/table/header-cell.png",br="decoration/form/input.png",bq="#f8f8f8",bp="decoration/scrollbar/scrollbar-button-bg-horizontal.png",bo="#b6b6b6",bn="background-pane",bm="repeat-y",bl="decoration/form/input-focused.png",bk="#33508D",bj="decoration/selection.png",t="border-input",u="decoration/scrollbar/scrollbar-button-bg-vertical.png",r="decoration/tabview/tab-button-top-active.png",s="black",p="decoration/form/button-c.png",q="decoration/scrollbar/scrollbar-bg-vertical.png",n="decoration/form/button.png",o="decoration/form/button-checked.png",B="decoration/tabview/tab-button-left-inactive.png",C="decoration/groupbox/groupbox.png",O="#FAFAFA",K="decoration/pane/pane.png",W="dotted",R="decoration/toolbar/toolbar-part.gif",bf="decoration/tabview/tab-button-top-inactive.png",bc="decoration/menu/bar-background.png",G="center",bi="decoration/tabview/tab-button-bottom-active.png",bh="decoration/form/button-hovered.png",bg="decoration/form/tooltip-error-arrow.png",F="decoration/window/captionbar-inactive.png",I="qx/decoration/Modern",J="decoration/menu/background.png",M="decoration/window/statusbar.png",P="border-focused",S="table-focus-indicator",Y="#F2F2F2",be="decoration/form/button-checked-c.png",v="decoration/scrollbar/scrollbar-bg-horizontal.png",w="qx.theme.modern.Decoration",H="#f4f4f4",V="decoration/shadow/shadow-small.png",U="decoration/app-header.png",T="decoration/tabview/tabview-pane.png",bb="decoration/form/tooltip-error.png",ba="decoration/form/button-focused.png",Q="decoration/tabview/tab-button-bottom-inactive.png",X="decoration/form/button-disabled.png",a="decoration/tabview/tab-button-right-active.png",bd="decoration/form/button-pressed.png",x="no-repeat",y="decoration/window/captionbar-active.png",L="decoration/tabview/tab-button-left-active.png",b="background-splitpane",c="decoration/form/button-checked-focused.png",E="#C5C5C5",z="decoration/toolbar/toolbar-gradient.png",A="decoration/tabview/tab-button-right-inactive.png",D="#b8b8b8",N="decoration/shadow/shadow.png";
qx.Theme.define(w,{aliases:{decoration:I},decorations:{"main":{decorator:qx.ui.decoration.Uniform,style:{width:1,color:k}},"selected":{decorator:qx.ui.decoration.Background,style:{backgroundImage:bj,backgroundRepeat:l}},"selected-dragover":{decorator:qx.ui.decoration.Single,style:{backgroundImage:bj,backgroundRepeat:l,bottom:[2,m,bk]}},"dragover":{decorator:qx.ui.decoration.Single,style:{bottom:[2,m,bk]}},"pane":{decorator:qx.ui.decoration.Grid,style:{baseImage:K,insets:[0,2,3,0]}},"group":{decorator:qx.ui.decoration.Grid,style:{baseImage:C}},"border-invalid":{decorator:qx.ui.decoration.Beveled,style:{outerColor:f,innerColor:j,innerOpacity:0.5,backgroundImage:br,backgroundRepeat:i,backgroundColor:g}},"keyboard-focus":{decorator:qx.ui.decoration.Single,style:{width:1,color:s,style:W}},"separator-horizontal":{decorator:qx.ui.decoration.Single,style:{widthLeft:1,colorLeft:h}},"separator-vertical":{decorator:qx.ui.decoration.Single,style:{widthTop:1,colorTop:h}},"tooltip-error":{decorator:qx.ui.decoration.Grid,style:{baseImage:bb,insets:[2,5,5,2]}},"tooltip-error-arrow":{decorator:qx.ui.decoration.Background,style:{backgroundImage:bg,backgroundPositionY:G,backgroundRepeat:x,insets:[0,0,0,10]}},"shadow-window":{decorator:qx.ui.decoration.Grid,style:{baseImage:N,insets:[4,8,8,4]}},"shadow-popup":{decorator:qx.ui.decoration.Grid,style:{baseImage:V,insets:[0,3,3,0]}},"scrollbar-horizontal":{decorator:qx.ui.decoration.Background,style:{backgroundImage:v,backgroundRepeat:i}},"scrollbar-vertical":{decorator:qx.ui.decoration.Background,style:{backgroundImage:q,backgroundRepeat:bm}},"scrollbar-slider-horizontal":{decorator:qx.ui.decoration.Beveled,style:{backgroundImage:bp,backgroundRepeat:l,outerColor:k,innerColor:j,innerOpacity:0.5}},"scrollbar-slider-horizontal-disabled":{decorator:qx.ui.decoration.Beveled,style:{backgroundImage:bp,backgroundRepeat:l,outerColor:d,innerColor:j,innerOpacity:0.3}},"scrollbar-slider-vertical":{decorator:qx.ui.decoration.Beveled,style:{backgroundImage:u,backgroundRepeat:l,outerColor:k,innerColor:j,innerOpacity:0.5}},"scrollbar-slider-vertical-disabled":{decorator:qx.ui.decoration.Beveled,style:{backgroundImage:u,backgroundRepeat:l,outerColor:d,innerColor:j,innerOpacity:0.3}},"button":{decorator:qx.ui.decoration.Grid,style:{baseImage:n,insets:2}},"button-disabled":{decorator:qx.ui.decoration.Grid,style:{baseImage:X,insets:2}},"button-focused":{decorator:qx.ui.decoration.Grid,style:{baseImage:ba,insets:2}},"button-hovered":{decorator:qx.ui.decoration.Grid,style:{baseImage:bh,insets:2}},"button-pressed":{decorator:qx.ui.decoration.Grid,style:{baseImage:bd,insets:2}},"button-checked":{decorator:qx.ui.decoration.Grid,style:{baseImage:o,insets:2}},"button-checked-focused":{decorator:qx.ui.decoration.Grid,style:{baseImage:c,insets:2}},"button-invalid-shadow":{decorator:qx.ui.decoration.Beveled,style:{outerColor:f,innerColor:e,insets:[1]}},"checkbox-invalid-shadow":{decorator:qx.ui.decoration.Beveled,style:{outerColor:f,innerColor:e,insets:[0]}},"input":{decorator:qx.ui.decoration.Beveled,style:{outerColor:t,innerColor:j,innerOpacity:0.5,backgroundImage:br,backgroundRepeat:i,backgroundColor:g}},"input-focused":{decorator:qx.ui.decoration.Beveled,style:{outerColor:t,innerColor:P,backgroundImage:bl,backgroundRepeat:i,backgroundColor:g}},"input-focused-invalid":{decorator:qx.ui.decoration.Beveled,style:{outerColor:f,innerColor:e,backgroundImage:bl,backgroundRepeat:i,backgroundColor:g,insets:[2]}},"input-disabled":{decorator:qx.ui.decoration.Beveled,style:{outerColor:d,innerColor:j,innerOpacity:0.5,backgroundImage:br,backgroundRepeat:i,backgroundColor:g}},"toolbar":{decorator:qx.ui.decoration.Background,style:{backgroundImage:z,backgroundRepeat:l}},"toolbar-button-hovered":{decorator:qx.ui.decoration.Beveled,style:{outerColor:bo,innerColor:bq,backgroundImage:p,backgroundRepeat:l}},"toolbar-button-checked":{decorator:qx.ui.decoration.Beveled,style:{outerColor:bo,innerColor:bq,backgroundImage:be,backgroundRepeat:l}},"toolbar-separator":{decorator:qx.ui.decoration.Single,style:{widthLeft:1,widthRight:1,colorLeft:D,colorRight:H,styleLeft:m,styleRight:m}},"toolbar-part":{decorator:qx.ui.decoration.Background,style:{backgroundImage:R,backgroundRepeat:bm}},"tabview-pane":{decorator:qx.ui.decoration.Grid,style:{baseImage:T,insets:[4,6,7,4]}},"tabview-page-button-top-active":{decorator:qx.ui.decoration.Grid,style:{baseImage:r}},"tabview-page-button-top-inactive":{decorator:qx.ui.decoration.Grid,style:{baseImage:bf}},"tabview-page-button-bottom-active":{decorator:qx.ui.decoration.Grid,style:{baseImage:bi}},"tabview-page-button-bottom-inactive":{decorator:qx.ui.decoration.Grid,style:{baseImage:Q}},"tabview-page-button-left-active":{decorator:qx.ui.decoration.Grid,style:{baseImage:L}},"tabview-page-button-left-inactive":{decorator:qx.ui.decoration.Grid,style:{baseImage:B}},"tabview-page-button-right-active":{decorator:qx.ui.decoration.Grid,style:{baseImage:a}},"tabview-page-button-right-inactive":{decorator:qx.ui.decoration.Grid,style:{baseImage:A}},"splitpane":{decorator:qx.ui.decoration.Uniform,style:{backgroundColor:bn,width:3,color:b,style:m}},"window":{decorator:qx.ui.decoration.Single,style:{backgroundColor:bn,width:1,color:k,widthTop:0}},"window-captionbar-active":{decorator:qx.ui.decoration.Grid,style:{baseImage:y}},"window-captionbar-inactive":{decorator:qx.ui.decoration.Grid,style:{baseImage:F}},"window-statusbar":{decorator:qx.ui.decoration.Grid,style:{baseImage:M}},"table":{decorator:qx.ui.decoration.Single,style:{width:1,color:k,style:m}},"table-statusbar":{decorator:qx.ui.decoration.Single,style:{widthTop:1,colorTop:k,style:m}},"table-scroller-header":{decorator:qx.ui.decoration.Single,style:{backgroundImage:bs,backgroundRepeat:l,widthBottom:1,colorBottom:k,style:m}},"table-header-cell":{decorator:qx.ui.decoration.Single,style:{widthRight:1,colorRight:h,styleRight:m}},"table-header-cell-hovered":{decorator:qx.ui.decoration.Single,style:{widthRight:1,colorRight:h,styleRight:m,widthBottom:1,colorBottom:j,styleBottom:m}},"table-column-button":{decorator:qx.ui.decoration.Single,style:{backgroundImage:bs,backgroundRepeat:l,widthBottom:1,colorBottom:k,style:m}},"table-scroller-focus-indicator":{decorator:qx.ui.decoration.Single,style:{width:2,color:S,style:m}},"progressive-table-header":{decorator:qx.ui.decoration.Single,style:{width:1,color:k,style:m}},"progressive-table-header-cell":{decorator:qx.ui.decoration.Single,style:{backgroundImage:bs,backgroundRepeat:l,widthRight:1,colorRight:Y,style:m}},"menu":{decorator:qx.ui.decoration.Single,style:{backgroundImage:J,backgroundRepeat:l,width:1,color:k,style:m}},"menu-separator":{decorator:qx.ui.decoration.Single,style:{widthTop:1,colorTop:E,widthBottom:1,colorBottom:O}},"menubar":{decorator:qx.ui.decoration.Single,style:{backgroundImage:bc,backgroundRepeat:l,width:1,color:h,style:m}},"app-header":{decorator:qx.ui.decoration.Background,style:{backgroundImage:U,backgroundRepeat:l}}}});
})();
(function(){var a="disbatch_frontend.theme.Decoration";
qx.Theme.define(a,{extend:qx.theme.modern.Decoration,decorations:{}});
})();
(function(){var n="Liberation Sans",m="Arial",l="Lucida Grande",k="sans-serif",j="Tahoma",i="Candara",h="Segoe UI",g="Consolas",f="Courier New",e="Monaco",b="monospace",d="Lucida Console",c="qx.theme.modern.Font",a="DejaVu Sans Mono";
qx.Theme.define(c,{fonts:{"default":{size:(qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7)?12:11,lineHeight:1.4,family:qx.bom.client.Platform.MAC?[l]:(qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7)?[h,i]:[j,n,m,k]},"bold":{size:(qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7)?12:11,lineHeight:1.4,family:qx.bom.client.Platform.MAC?[l]:(qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7)?[h,i]:[j,n,m,k],bold:true},"small":{size:(qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7)?11:10,lineHeight:1.4,family:qx.bom.client.Platform.MAC?[l]:(qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7)?[h,i]:[j,n,m,k]},"monospace":{size:11,lineHeight:1.4,family:qx.bom.client.Platform.MAC?[d,e]:(qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7)?[g]:[g,a,f,b]}}});
})();
(function(){var a="disbatch_frontend.theme.Font";
qx.Theme.define(a,{extend:qx.theme.modern.Font,fonts:{}});
})();
(function(){var c="Tango",b="qx/icon/Tango",a="qx.theme.icon.Tango";
qx.Theme.define(a,{title:c,aliases:{"icon":b},icons:{}});
})();
(function(){var eq="button-frame",ep="atom",eo="widget",en="main",em="button",el="text-selected",ek="image",ej="bold",ei="middle",eh="background-light",cS="text-disabled",cR="groupbox",cQ="decoration/arrows/down.png",cP="cell",cO="selected",cN="border-invalid",cM="input",cL="input-disabled",cK="menu-button",cJ="input-focused-invalid",ex="toolbar-button",ey="spinner",ev="input-focused",ew="popup",et="tooltip",eu="label",er="list",es="tree-item",ez="treevirtual-contract",eA="scrollbar",dP="datechooser/nav-button",dO="text-hovered",dR="center",dQ="treevirtual-expand",dT="textfield",dS="decoration/arrows/right.png",dV="background-application",dU="radiobutton",dN="white",dM="invalid",P="combobox",Q="right-top",R="checkbox",S="text-title",T="qx/static/blank.gif",U="scrollbar/button",V="right",W="combobox/button",X="icon/16/places/folder.png",Y="text-label",eO="decoration/tree/closed.png",eN="scrollbar-slider-horizontal",eM="decoration/arrows/left.png",eL="button-focused",eS="text-light",eR="menu-slidebar-button",eQ="text-input",eP="slidebar/button-forward",eU="background-splitpane",eT=".png",bR="decoration/tree/open.png",bS="default",bP="decoration/arrows/down-small.png",bQ="datechooser",bV="slidebar/button-backward",bW="selectbox",bT="treevirtual-folder",bU="shadow-popup",bN="icon/16/mimetypes/office-document.png",bO="background-medium",bt="table",bs="decoration/arrows/up.png",bv="decoration/form/",bu="",bp="-invalid",bo="icon/16/places/folder-open.png",br="button-checked",bq="decoration/window/maximize-active-hovered.png",bn="radiobutton-hovered",bm="keyboard-focus",cd="decoration/cursors/",ce="slidebar",cf="tooltip-error-arrow",cg="table-scroller-focus-indicator",bY="move-frame",ca="nodrop",cb="decoration/table/boolean-true.png",cc="table-header-cell",ch="menu",ci="app-header",bG="row-layer",bF="text-inactive",bE="move",bD="radiobutton-checked-focused",bC="decoration/window/restore-active-hovered.png",bB="shadow-window",bA="table-column-button",bz="right.png",bK="tabview-page-button-bottom-inactive",bJ="tooltip-error",cj="window-statusbar",ck="button-hovered",cl="decoration/scrollbar/scrollbar-",cm="background-tip",cn="scrollbar-slider-horizontal-disabled",co="table-scroller-header",cp="button-pressed",cq="table-pane",cr="decoration/window/close-active.png",cs="native",db="checkbox-hovered",da="button-invalid-shadow",cY="checkbox-checked",cX="decoration/window/minimize-active-hovered.png",df="menubar",de="icon/16/actions/dialog-cancel.png",dd="tabview-page-button-top-inactive",dc="tabview-page-button-left-inactive",dj="menu-slidebar",di="toolbar-button-checked",dH="decoration/tree/open-selected.png",dI="radiobutton-checked",dF="decoration/window/minimize-inactive.png",dG="icon/16/apps/office-calendar.png",dD="group",dE="tabview-page-button-right-inactive",dB="decoration/window/minimize-active.png",dC="decoration/window/restore-inactive.png",dJ="checkbox-checked-focused",dK="splitpane",ea="combobox/textfield",dY="button-preselected-focused",ec="decoration/window/close-active-hovered.png",eb="qx/icon/Tango/16/actions/window-close.png",ee="checkbox-pressed",ed="button-disabled",eg="selected-dragover",ef="border-separator",dX="decoration/window/maximize-inactive.png",dW="dragover",eH="scrollarea",eI="scrollbar-vertical",eJ="decoration/menu/checkbox-invert.gif",eK="decoration/toolbar/toolbar-handle-knob.gif",eD="icon/22/mimetypes/office-document.png",eE="button-preselected",eF="button-checked-focused",eG="up.png",eB="best-fit",eC="decoration/tree/closed-selected.png",O="qx.theme.modern.Appearance",N="text-active",M="toolbar-button-hovered",L="progressive-table-header",K="decoration/table/select-column-order.png",J="decoration/menu/radiobutton.gif",I="decoration/arrows/forward.png",H="decoration/table/descending.png",G="window-captionbar-active",F="checkbox-checked-hovered",bc="scrollbar-slider-vertical",bd="toolbar",ba="alias",bb="decoration/window/restore-active.png",bg="decoration/table/boolean-false.png",bh="checkbox-checked-disabled",be="icon/32/mimetypes/office-document.png",bf="radiobutton-checked-disabled",bj="tabview-pane",bk="decoration/arrows/rewind.png",dn="checkbox-focused",dh="top",dv="#EEE",dr="icon/16/actions/dialog-ok.png",cV="radiobutton-checked-hovered",cT="table-header-cell-hovered",bx="window",cW="text-gray",bI="decoration/menu/radiobutton-invert.gif",bH="text-placeholder",cB="slider",cC="keep-align",cD="down.png",cE="tabview-page-button-top-active",cF="icon/32/places/folder-open.png",cG="icon/22/places/folder.png",cH="decoration/window/maximize-active.png",cI="checkbox-checked-pressed",cz="decoration/window/close-inactive.png",cA="tabview-page-button-left-active",cU="toolbar-part",du="decoration/splitpane/knob-vertical.png",dt=".gif",ds="icon/22/places/folder-open.png",dz="radiobutton-checked-pressed",dy="table-statusbar",dx="radiobutton-pressed",dw="window-captionbar-inactive",dq="copy",dp="radiobutton-focused",bi="decoration/arrows/down-invert.png",bM="decoration/menu/checkbox.gif",bL="decoration/splitpane/knob-horizontal.png",dg="icon/32/places/folder.png",bX="toolbar-separator",dm="tabview-page-button-bottom-active",dl="decoration/arrows/up-small.png",dk="decoration/table/ascending.png",bw="decoration/arrows/up-invert.png",dA="small",bl="tabview-page-button-right-active",by="-disabled",ct="scrollbar-horizontal",cu="progressive-table-header-cell",cv="menu-separator",cw="pane",cx="decoration/arrows/right-invert.png",cy="left.png",dL="icon/16/actions/view-refresh.png";
qx.Theme.define(O,{appearances:{"widget":{},"root":{style:function(fO){return {backgroundColor:dV,textColor:Y,font:bS};
}},"label":{style:function(gV){return {textColor:gV.disabled?cS:undefined};
}},"move-frame":{style:function(i){return {decorator:en};
}},"resize-frame":bY,"dragdrop-cursor":{style:function(fl){var fm=ca;

if(fl.copy){fm=dq;
}else if(fl.move){fm=bE;
}else if(fl.alias){fm=ba;
}return {source:cd+fm+dt,position:Q,offset:[2,16,2,6]};
}},"image":{style:function(hy){return {opacity:!hy.replacement&&hy.disabled?0.3:1};
}},"atom":{},"atom/label":eu,"atom/icon":ek,"popup":{style:function(D){return {decorator:en,backgroundColor:eh,shadow:bU};
}},"button-frame":{alias:ep,style:function(hJ){var hL,hK;

if(hJ.checked&&hJ.focused&&!hJ.inner){hL=eF;
hK=undefined;
}else if(hJ.disabled){hL=ed;
hK=undefined;
}else if(hJ.pressed){hL=cp;
hK=dO;
}else if(hJ.checked){hL=br;
hK=undefined;
}else if(hJ.hovered){hL=ck;
hK=dO;
}else if(hJ.preselected&&hJ.focused&&!hJ.inner){hL=dY;
hK=dO;
}else if(hJ.preselected){hL=eE;
hK=dO;
}else if(hJ.focused&&!hJ.inner){hL=eL;
hK=undefined;
}else{hL=em;
hK=undefined;
}return {decorator:hL,textColor:hK,shadow:hJ.invalid&&!hJ.disabled?da:undefined};
}},"button-frame/image":{style:function(fj){return {opacity:!fj.replacement&&fj.disabled?0.5:1};
}},"button":{alias:eq,include:eq,style:function(hP){return {padding:[2,8],center:true};
}},"hover-button":{alias:ep,include:ep,style:function(fU){return {decorator:fU.hovered?cO:undefined,textColor:fU.hovered?el:undefined};
}},"splitbutton":{},"splitbutton/button":em,"splitbutton/arrow":{alias:em,include:em,style:function(hA){return {icon:cQ,padding:2,marginLeft:1};
}},"checkbox":{alias:ep,style:function(d){var f;

if(d.checked&&d.focused){f=dJ;
}else if(d.checked&&d.disabled){f=bh;
}else if(d.checked&&d.pressed){f=cI;
}else if(d.checked&&d.hovered){f=F;
}else if(d.checked){f=cY;
}else if(d.focused){f=dn;
}else if(d.pressed){f=ee;
}else if(d.hovered){f=db;
}else{f=R;
}var e=d.invalid&&!d.disabled?bp:bu;
return {icon:bv+f+e+eT,gap:6};
}},"radiobutton":{alias:ep,style:function(gK){var gM;

if(gK.checked&&gK.focused){gM=bD;
}else if(gK.checked&&gK.disabled){gM=bf;
}else if(gK.checked&&gK.pressed){gM=dz;
}else if(gK.checked&&gK.hovered){gM=cV;
}else if(gK.checked){gM=dI;
}else if(gK.focused){gM=dp;
}else if(gK.pressed){gM=dx;
}else if(gK.hovered){gM=bn;
}else{gM=dU;
}var gL=gK.invalid&&!gK.disabled?bp:bu;
return {icon:bv+gM+gL+eT,gap:6};
}},"textfield":{style:function(fs){var fx;
var fv=!!fs.focused;
var fw=!!fs.invalid;
var ft=!!fs.disabled;

if(fv&&fw&&!ft){fx=cJ;
}else if(fv&&!fw&&!ft){fx=ev;
}else if(ft){fx=cL;
}else if(!fv&&fw&&!ft){fx=cN;
}else{fx=cM;
}var fu;

if(fs.disabled){fu=cS;
}else if(fs.showingPlaceholder){fu=bH;
}else{fu=eQ;
}return {decorator:fx,padding:[2,4,1],textColor:fu};
}},"textarea":{include:dT,style:function(hm){return {padding:4};
}},"spinner":{style:function(fH){var fL;
var fJ=!!fH.focused;
var fK=!!fH.invalid;
var fI=!!fH.disabled;

if(fJ&&fK&&!fI){fL=cJ;
}else if(fJ&&!fK&&!fI){fL=ev;
}else if(fI){fL=cL;
}else if(!fJ&&fK&&!fI){fL=cN;
}else{fL=cM;
}return {decorator:fL};
}},"spinner/textfield":{style:function(gF){return {marginRight:2,padding:[2,4,1],textColor:gF.disabled?cS:eQ};
}},"spinner/upbutton":{alias:eq,include:eq,style:function(b){return {icon:dl,padding:b.pressed?[2,2,0,4]:[1,3,1,3],shadow:undefined};
}},"spinner/downbutton":{alias:eq,include:eq,style:function(hO){return {icon:bP,padding:hO.pressed?[2,2,0,4]:[1,3,1,3],shadow:undefined};
}},"datefield":P,"datefield/button":{alias:W,include:W,style:function(m){return {icon:dG,padding:[0,3],decorator:undefined};
}},"datefield/textfield":ea,"datefield/list":{alias:bQ,include:bQ,style:function(y){return {decorator:undefined};
}},"groupbox":{style:function(hw){return {legendPosition:dh};
}},"groupbox/legend":{alias:ep,style:function(gE){return {padding:[1,0,1,4],textColor:gE.invalid?dM:S,font:ej};
}},"groupbox/frame":{style:function(hV){return {padding:12,decorator:dD};
}},"check-groupbox":cR,"check-groupbox/legend":{alias:R,include:R,style:function(hM){return {padding:[1,0,1,4],textColor:hM.invalid?dM:S,font:ej};
}},"radio-groupbox":cR,"radio-groupbox/legend":{alias:dU,include:dU,style:function(fP){return {padding:[1,0,1,4],textColor:fP.invalid?dM:S,font:ej};
}},"scrollarea":{style:function(g){return {minWidth:50,minHeight:50};
}},"scrollarea/corner":{style:function(fi){return {backgroundColor:dV};
}},"scrollarea/pane":eo,"scrollarea/scrollbar-x":eA,"scrollarea/scrollbar-y":eA,"scrollbar":{style:function(gJ){if(gJ[cs]){return {};
}return {width:gJ.horizontal?undefined:16,height:gJ.horizontal?16:undefined,decorator:gJ.horizontal?ct:eI,padding:1};
}},"scrollbar/slider":{alias:cB,style:function(C){return {padding:C.horizontal?[0,1,0,1]:[1,0,1,0]};
}},"scrollbar/slider/knob":{include:eq,style:function(hn){var ho=hn.horizontal?eN:bc;

if(hn.disabled){ho+=by;
}return {decorator:ho,minHeight:hn.horizontal?undefined:9,minWidth:hn.horizontal?9:undefined};
}},"scrollbar/button":{alias:eq,include:eq,style:function(gk){var gl=cl;

if(gk.left){gl+=cy;
}else if(gk.right){gl+=bz;
}else if(gk.up){gl+=eG;
}else{gl+=cD;
}
if(gk.left||gk.right){return {padding:[0,0,0,gk.left?3:4],icon:gl,width:15,height:14};
}else{return {padding:[0,0,0,2],icon:gl,width:14,height:15};
}}},"scrollbar/button-begin":U,"scrollbar/button-end":U,"slider":{style:function(gx){var gB;
var gz=!!gx.focused;
var gA=!!gx.invalid;
var gy=!!gx.disabled;

if(gz&&gA&&!gy){gB=cJ;
}else if(gz&&!gA&&!gy){gB=ev;
}else if(gy){gB=cL;
}else if(!gz&&gA&&!gy){gB=cN;
}else{gB=cM;
}return {decorator:gB};
}},"slider/knob":{include:eq,style:function(hW){return {decorator:hW.disabled?cn:eN,shadow:undefined,height:14,width:14};
}},"list":{alias:eH,style:function(gO){var gS;
var gQ=!!gO.focused;
var gR=!!gO.invalid;
var gP=!!gO.disabled;

if(gQ&&gR&&!gP){gS=cJ;
}else if(gQ&&!gR&&!gP){gS=ev;
}else if(gP){gS=cL;
}else if(!gQ&&gR&&!gP){gS=cN;
}else{gS=cM;
}return {backgroundColor:eh,decorator:gS};
}},"list/pane":eo,"listitem":{alias:ep,style:function(hH){var hI;

if(hH.dragover){hI=hH.selected?eg:dW;
}else{hI=hH.selected?cO:undefined;
}return {padding:hH.dragover?[4,4,2,4]:4,textColor:hH.selected?el:undefined,decorator:hI};
}},"slidebar":{},"slidebar/scrollpane":{},"slidebar/content":{},"slidebar/button-forward":{alias:eq,include:eq,style:function(hT){return {padding:5,center:true,icon:hT.vertical?cQ:dS};
}},"slidebar/button-backward":{alias:eq,include:eq,style:function(gg){return {padding:5,center:true,icon:gg.vertical?bs:eM};
}},"tabview":{style:function(hQ){return {contentPadding:16};
}},"tabview/bar":{alias:ce,style:function(hD){var hE={marginBottom:hD.barTop?-1:0,marginTop:hD.barBottom?-4:0,marginLeft:hD.barRight?-3:0,marginRight:hD.barLeft?-1:0,paddingTop:0,paddingRight:0,paddingBottom:0,paddingLeft:0};

if(hD.barTop||hD.barBottom){hE.paddingLeft=5;
hE.paddingRight=7;
}else{hE.paddingTop=5;
hE.paddingBottom=7;
}return hE;
}},"tabview/bar/button-forward":{include:eP,alias:eP,style:function(q){if(q.barTop||q.barBottom){return {marginTop:2,marginBottom:2};
}else{return {marginLeft:2,marginRight:2};
}}},"tabview/bar/button-backward":{include:bV,alias:bV,style:function(id){if(id.barTop||id.barBottom){return {marginTop:2,marginBottom:2};
}else{return {marginLeft:2,marginRight:2};
}}},"tabview/bar/scrollpane":{},"tabview/pane":{style:function(hY){return {decorator:bj,minHeight:100,marginBottom:hY.barBottom?-1:0,marginTop:hY.barTop?-1:0,marginLeft:hY.barLeft?-1:0,marginRight:hY.barRight?-1:0};
}},"tabview-page":eo,"tabview-page/button":{alias:ep,style:function(fA){var fG,fC=0;
var fF=0,fB=0,fD=0,fE=0;

if(fA.checked){if(fA.barTop){fG=cE;
fC=[6,14];
fD=fA.firstTab?0:-5;
fE=fA.lastTab?0:-5;
}else if(fA.barBottom){fG=dm;
fC=[6,14];
fD=fA.firstTab?0:-5;
fE=fA.lastTab?0:-5;
}else if(fA.barRight){fG=bl;
fC=[6,13];
fF=fA.firstTab?0:-5;
fB=fA.lastTab?0:-5;
}else{fG=cA;
fC=[6,13];
fF=fA.firstTab?0:-5;
fB=fA.lastTab?0:-5;
}}else{if(fA.barTop){fG=dd;
fC=[4,10];
fF=4;
fD=fA.firstTab?5:1;
fE=1;
}else if(fA.barBottom){fG=bK;
fC=[4,10];
fB=4;
fD=fA.firstTab?5:1;
fE=1;
}else if(fA.barRight){fG=dE;
fC=[4,10];
fE=5;
fF=fA.firstTab?5:1;
fB=1;
fD=1;
}else{fG=dc;
fC=[4,10];
fD=5;
fF=fA.firstTab?5:1;
fB=1;
fE=1;
}}return {zIndex:fA.checked?10:5,decorator:fG,padding:fC,marginTop:fF,marginBottom:fB,marginLeft:fD,marginRight:fE,textColor:fA.checked?N:bF};
}},"tabview-page/button/label":{alias:eu,style:function(hb){return {padding:[0,1,0,1],margin:hb.focused?0:1,decorator:hb.focused?bm:undefined};
}},"tabview-page/button/close-button":{alias:ep,style:function(c){return {icon:eb};
}},"toolbar":{style:function(A){return {decorator:bd,spacing:2};
}},"toolbar/part":{style:function(o){return {decorator:cU,spacing:2};
}},"toolbar/part/container":{style:function(gI){return {paddingLeft:2,paddingRight:2};
}},"toolbar/part/handle":{style:function(he){return {source:eK,marginLeft:3,marginRight:3};
}},"toolbar-button":{alias:ep,style:function(ie){return {marginTop:2,marginBottom:2,padding:(ie.pressed||ie.checked||ie.hovered)&&!ie.disabled||(ie.disabled&&ie.checked)?3:5,decorator:ie.pressed||(ie.checked&&!ie.hovered)||(ie.checked&&ie.disabled)?di:ie.hovered&&!ie.disabled?M:undefined};
}},"toolbar-menubutton":{alias:ex,include:ex,style:function(fe){return {showArrow:true};
}},"toolbar-menubutton/arrow":{alias:ek,include:ek,style:function(gf){return {source:bP};
}},"toolbar-splitbutton":{style:function(hN){return {marginTop:2,marginBottom:2};
}},"toolbar-splitbutton/button":{alias:ex,include:ex,style:function(gW){return {icon:cQ,marginTop:undefined,marginBottom:undefined};
}},"toolbar-splitbutton/arrow":{alias:ex,include:ex,style:function(hp){return {padding:hp.pressed||hp.checked?1:hp.hovered?1:3,icon:cQ,marginTop:undefined,marginBottom:undefined};
}},"toolbar-separator":{style:function(x){return {decorator:bX,margin:7};
}},"tree":er,"tree-item":{style:function(r){return {padding:[2,6],textColor:r.selected?el:undefined,decorator:r.selected?cO:undefined};
}},"tree-item/icon":{include:ek,style:function(ig){return {paddingRight:5};
}},"tree-item/label":eu,"tree-item/open":{include:ek,style:function(gp){var gq;

if(gp.selected&&gp.opened){gq=dH;
}else if(gp.selected&&!gp.opened){gq=eC;
}else if(gp.opened){gq=bR;
}else{gq=eO;
}return {padding:[0,5,0,2],source:gq};
}},"tree-folder":{include:es,alias:es,style:function(gm){var gn;

if(gm.small){gn=gm.opened?bo:X;
}else if(gm.large){gn=gm.opened?cF:dg;
}else{gn=gm.opened?ds:cG;
}return {icon:gn};
}},"tree-file":{include:es,alias:es,style:function(fR){return {icon:fR.small?bN:fR.large?be:eD};
}},"treevirtual":bt,"treevirtual-folder":{style:function(fS){return {icon:fS.opened?bo:X};
}},"treevirtual-file":{include:bT,alias:bT,style:function(B){return {icon:bN};
}},"treevirtual-line":{style:function(gC){return {icon:T};
}},"treevirtual-contract":{style:function(fk){return {icon:bR,paddingLeft:5,paddingTop:2};
}},"treevirtual-expand":{style:function(fd){return {icon:eO,paddingLeft:5,paddingTop:2};
}},"treevirtual-only-contract":ez,"treevirtual-only-expand":dQ,"treevirtual-start-contract":ez,"treevirtual-start-expand":dQ,"treevirtual-end-contract":ez,"treevirtual-end-expand":dQ,"treevirtual-cross-contract":ez,"treevirtual-cross-expand":dQ,"treevirtual-end":{style:function(ic){return {icon:T};
}},"treevirtual-cross":{style:function(fq){return {icon:T};
}},"tooltip":{include:ew,style:function(hR){return {backgroundColor:cm,padding:[1,3,2,3],offset:[15,5,5,5]};
}},"tooltip/atom":ep,"tooltip-error":{include:et,style:function(hd){return {textColor:el,placeMethod:eo,offset:[0,0,0,14],marginTop:-2,position:Q,showTimeout:100,hideTimeout:10000,decorator:bJ,shadow:cf,font:ej};
}},"tooltip-error/atom":ep,"window":{style:function(n){return {shadow:bB,contentPadding:[10,10,10,10]};
}},"window/pane":{style:function(gH){return {decorator:bx};
}},"window/captionbar":{style:function(hr){return {decorator:hr.active?G:dw,textColor:hr.active?dN:cW,minHeight:26,paddingRight:2};
}},"window/icon":{style:function(hu){return {margin:[5,0,3,6]};
}},"window/title":{style:function(v){return {alignY:ei,font:ej,marginLeft:6,marginRight:12};
}},"window/minimize-button":{alias:ep,style:function(fY){return {icon:fY.active?fY.hovered?cX:dB:dF,margin:[4,8,2,0]};
}},"window/restore-button":{alias:ep,style:function(hs){return {icon:hs.active?hs.hovered?bC:bb:dC,margin:[5,8,2,0]};
}},"window/maximize-button":{alias:ep,style:function(gT){return {icon:gT.active?gT.hovered?bq:cH:dX,margin:[4,8,2,0]};
}},"window/close-button":{alias:ep,style:function(ia){return {icon:ia.active?ia.hovered?ec:cr:cz,margin:[4,8,2,0]};
}},"window/statusbar":{style:function(ge){return {padding:[2,6],decorator:cj,minHeight:18};
}},"window/statusbar-text":{style:function(fW){return {font:dA};
}},"iframe":{style:function(j){return {decorator:en};
}},"resizer":{style:function(hx){return {decorator:cw};
}},"splitpane":{style:function(hl){return {decorator:dK};
}},"splitpane/splitter":{style:function(ff){return {width:ff.horizontal?3:undefined,height:ff.vertical?3:undefined,backgroundColor:eU};
}},"splitpane/splitter/knob":{style:function(gw){return {source:gw.horizontal?bL:du};
}},"splitpane/slider":{style:function(s){return {width:s.horizontal?3:undefined,height:s.vertical?3:undefined,backgroundColor:eU};
}},"selectbox":{alias:eq,include:eq,style:function(E){return {padding:[2,8]};
}},"selectbox/atom":ep,"selectbox/popup":ew,"selectbox/list":{alias:er},"selectbox/arrow":{include:ek,style:function(go){return {source:cQ,paddingLeft:5};
}},"datechooser":{style:function(gr){var gv;
var gt=!!gr.focused;
var gu=!!gr.invalid;
var gs=!!gr.disabled;

if(gt&&gu&&!gs){gv=cJ;
}else if(gt&&!gu&&!gs){gv=ev;
}else if(gs){gv=cL;
}else if(!gt&&gu&&!gs){gv=cN;
}else{gv=cM;
}return {padding:2,decorator:gv,backgroundColor:eh};
}},"datechooser/navigation-bar":{},"datechooser/nav-button":{include:eq,alias:eq,style:function(hF){var hG={padding:[2,4],shadow:undefined};

if(hF.lastYear){hG.icon=bk;
hG.marginRight=1;
}else if(hF.lastMonth){hG.icon=eM;
}else if(hF.nextYear){hG.icon=I;
hG.marginLeft=1;
}else if(hF.nextMonth){hG.icon=dS;
}return hG;
}},"datechooser/last-year-button-tooltip":et,"datechooser/last-month-button-tooltip":et,"datechooser/next-year-button-tooltip":et,"datechooser/next-month-button-tooltip":et,"datechooser/last-year-button":dP,"datechooser/last-month-button":dP,"datechooser/next-month-button":dP,"datechooser/next-year-button":dP,"datechooser/month-year-label":{style:function(u){return {font:ej,textAlign:dR,textColor:u.disabled?cS:undefined};
}},"datechooser/date-pane":{style:function(hq){return {textColor:hq.disabled?cS:undefined,marginTop:2};
}},"datechooser/weekday":{style:function(hv){return {textColor:hv.disabled?cS:hv.weekend?eS:undefined,textAlign:dR,paddingTop:2,backgroundColor:bO};
}},"datechooser/week":{style:function(hg){return {textAlign:dR,padding:[2,4],backgroundColor:bO};
}},"datechooser/day":{style:function(hz){return {textAlign:dR,decorator:hz.disabled?undefined:hz.selected?cO:undefined,textColor:hz.disabled?cS:hz.selected?el:hz.otherMonth?eS:undefined,font:hz.today?ej:undefined,padding:[2,4]};
}},"combobox":{style:function(eV){var fa;
var eX=!!eV.focused;
var eY=!!eV.invalid;
var eW=!!eV.disabled;

if(eX&&eY&&!eW){fa=cJ;
}else if(eX&&!eY&&!eW){fa=ev;
}else if(eW){fa=cL;
}else if(!eX&&eY&&!eW){fa=cN;
}else{fa=cM;
}return {decorator:fa};
}},"combobox/popup":ew,"combobox/list":{alias:er},"combobox/button":{include:eq,alias:eq,style:function(fn){var fo={icon:cQ,padding:2};

if(fn.selected){fo.decorator=eL;
}return fo;
}},"combobox/textfield":{include:dT,style:function(fp){return {decorator:undefined};
}},"menu":{style:function(gY){var ha={decorator:ch,shadow:bU,spacingX:6,spacingY:1,iconColumnWidth:16,arrowColumnWidth:4,placementModeY:gY.submenu||gY.contextmenu?eB:cC};

if(gY.submenu){ha.position=Q;
ha.offset=[-2,-3];
}return ha;
}},"menu/slidebar":dj,"menu-slidebar":eo,"menu-slidebar-button":{style:function(fr){return {decorator:fr.hovered?cO:undefined,padding:7,center:true};
}},"menu-slidebar/button-backward":{include:eR,style:function(a){return {icon:a.hovered?bw:bs};
}},"menu-slidebar/button-forward":{include:eR,style:function(fb){return {icon:fb.hovered?bi:cQ};
}},"menu-separator":{style:function(fc){return {height:0,decorator:cv,margin:[4,2]};
}},"menu-button":{alias:ep,style:function(ga){return {decorator:ga.selected?cO:undefined,textColor:ga.selected?el:undefined,padding:[4,6]};
}},"menu-button/icon":{include:ek,style:function(z){return {alignY:ei};
}},"menu-button/label":{include:eu,style:function(fV){return {alignY:ei,padding:1};
}},"menu-button/shortcut":{include:eu,style:function(gj){return {alignY:ei,marginLeft:14,padding:1};
}},"menu-button/arrow":{include:ek,style:function(gX){return {source:gX.selected?cx:dS,alignY:ei};
}},"menu-checkbox":{alias:cK,include:cK,style:function(fN){return {icon:!fN.checked?undefined:fN.selected?eJ:bM};
}},"menu-radiobutton":{alias:cK,include:cK,style:function(hi){return {icon:!hi.checked?undefined:hi.selected?bI:J};
}},"menubar":{style:function(fh){return {decorator:df};
}},"menubar-button":{alias:ep,style:function(hB){return {decorator:hB.pressed||hB.hovered?cO:undefined,textColor:hB.pressed||hB.hovered?el:undefined,padding:[3,8]};
}},"colorselector":eo,"colorselector/control-bar":eo,"colorselector/control-pane":eo,"colorselector/visual-pane":cR,"colorselector/preset-grid":eo,"colorselector/colorbucket":{style:function(gU){return {decorator:en,width:16,height:16};
}},"colorselector/preset-field-set":cR,"colorselector/input-field-set":cR,"colorselector/preview-field-set":cR,"colorselector/hex-field-composite":eo,"colorselector/hex-field":dT,"colorselector/rgb-spinner-composite":eo,"colorselector/rgb-spinner-red":ey,"colorselector/rgb-spinner-green":ey,"colorselector/rgb-spinner-blue":ey,"colorselector/hsb-spinner-composite":eo,"colorselector/hsb-spinner-hue":ey,"colorselector/hsb-spinner-saturation":ey,"colorselector/hsb-spinner-brightness":ey,"colorselector/preview-content-old":{style:function(hU){return {decorator:en,width:50,height:10};
}},"colorselector/preview-content-new":{style:function(gN){return {decorator:en,backgroundColor:eh,width:50,height:10};
}},"colorselector/hue-saturation-field":{style:function(gc){return {decorator:en,margin:5};
}},"colorselector/brightness-field":{style:function(gd){return {decorator:en,margin:[5,7]};
}},"colorselector/hue-saturation-pane":eo,"colorselector/hue-saturation-handle":eo,"colorselector/brightness-pane":eo,"colorselector/brightness-handle":eo,"colorpopup":{alias:ew,include:ew,style:function(fz){return {padding:5,backgroundColor:dV};
}},"colorpopup/field":{style:function(hk){return {decorator:en,margin:2,width:14,height:14,backgroundColor:eh};
}},"colorpopup/selector-button":em,"colorpopup/auto-button":em,"colorpopup/preview-pane":cR,"colorpopup/current-preview":{style:function(l){return {height:20,padding:4,marginLeft:4,decorator:en,allowGrowX:true};
}},"colorpopup/selected-preview":{style:function(fg){return {height:20,padding:4,marginRight:4,decorator:en,allowGrowX:true};
}},"colorpopup/colorselector-okbutton":{alias:em,include:em,style:function(hC){return {icon:dr};
}},"colorpopup/colorselector-cancelbutton":{alias:em,include:em,style:function(gD){return {icon:de};
}},"table":{alias:eo,style:function(hX){return {decorator:bt};
}},"table-header":{},"table/statusbar":{style:function(fy){return {decorator:dy,padding:[0,2]};
}},"table/column-button":{alias:eq,style:function(t){return {decorator:bA,padding:3,icon:K};
}},"table-column-reset-button":{include:cK,alias:cK,style:function(){return {icon:dL};
}},"table-scroller":eo,"table-scroller/scrollbar-x":eA,"table-scroller/scrollbar-y":eA,"table-scroller/header":{style:function(fM){return {decorator:co};
}},"table-scroller/pane":{style:function(ib){return {backgroundColor:cq};
}},"table-scroller/focus-indicator":{style:function(hS){return {decorator:cg};
}},"table-scroller/resize-line":{style:function(gi){return {backgroundColor:ef,width:2};
}},"table-header-cell":{alias:ep,style:function(gh){return {minWidth:13,minHeight:20,padding:gh.hovered?[3,4,2,4]:[3,4],decorator:gh.hovered?cT:cc,sortIcon:gh.sorted?(gh.sortedAscending?dk:H):undefined};
}},"table-header-cell/label":{style:function(fX){return {minWidth:0,alignY:ei,paddingRight:5};
}},"table-header-cell/sort-icon":{style:function(gb){return {alignY:ei,alignX:V};
}},"table-header-cell/icon":{style:function(w){return {minWidth:0,alignY:ei,paddingRight:5};
}},"table-editor-textfield":{include:dT,style:function(hh){return {decorator:undefined,padding:[2,2],backgroundColor:eh};
}},"table-editor-selectbox":{include:bW,alias:bW,style:function(fQ){return {padding:[0,2],backgroundColor:eh};
}},"table-editor-combobox":{include:P,alias:P,style:function(h){return {decorator:undefined,backgroundColor:eh};
}},"progressive-table-header":{alias:eo,style:function(gG){return {decorator:L};
}},"progressive-table-header-cell":{alias:ep,style:function(k){return {minWidth:40,minHeight:25,paddingLeft:6,decorator:cu};
}},"app-header":{style:function(hf){return {font:ej,textColor:el,padding:[8,12],decorator:ci};
}},"virtual-list":er,"virtual-list/row-layer":bG,"row-layer":{style:function(p){return {colorEven:dN,colorOdd:dv};
}},"column-layer":eo,"cell":{style:function(fT){return {textColor:fT.selected?el:Y,padding:[3,6],font:bS};
}},"cell-string":cP,"cell-number":{include:cP,style:function(hc){return {textAlign:V};
}},"cell-image":cP,"cell-boolean":{include:cP,style:function(hj){return {iconTrue:cb,iconFalse:bg};
}},"cell-atom":cP,"cell-date":cP,"cell-html":cP,"htmlarea":{"include":eo,style:function(ht){return {backgroundColor:dN};
}}}});
})();
(function(){var a="disbatch_frontend.theme.Appearance";
qx.Theme.define(a,{extend:qx.theme.modern.Appearance,appearances:{}});
})();
(function(){var a="disbatch_frontend.theme.Theme";
qx.Theme.define(a,{meta:{color:disbatch_frontend.theme.Color,decoration:disbatch_frontend.theme.Decoration,font:disbatch_frontend.theme.Font,icon:qx.theme.icon.Tango,appearance:disbatch_frontend.theme.Appearance}});
})();
(function(){var n="_applyStyle",m="stretch",l="Integer",k="px",j=" ",i="repeat",h="round",g="shorthand",f="px ",e="sliceBottom",C=";'></div>",B="<div style='",A="sliceLeft",z="sliceRight",y="repeatX",x="String",w="qx.ui.decoration.css3.BorderImage",v="border-box",u="",t='") ',r="sliceTop",s='url("',p="hidden",q="repeatY",o="absolute";
qx.Class.define(w,{extend:qx.ui.decoration.Abstract,construct:function(a,b){qx.ui.decoration.Abstract.call(this);
if(a!=null){this.setBorderImage(a);
}
if(b!=null){this.setSlice(b);
}},statics:{IS_SUPPORTED:qx.bom.element.Style.isPropertySupported("borderImage")},properties:{borderImage:{check:x,nullable:true,apply:n},sliceTop:{check:l,init:0,apply:n},sliceRight:{check:l,init:0,apply:n},sliceBottom:{check:l,init:0,apply:n},sliceLeft:{check:l,init:0,apply:n},slice:{group:[r,z,e,A],mode:g},repeatX:{check:[m,i,h],init:m,apply:n},repeatY:{check:[m,i,h],init:m,apply:n},repeat:{group:[y,q],mode:g}},members:{__rA:null,_getDefaultInsets:function(){return {top:0,right:0,bottom:0,left:0};
},_isInitialized:function(){return !!this.__rA;
},getMarkup:function(){if(this.__rA){return this.__rA;
}var D=this._resolveImageUrl(this.getBorderImage());
var E=[this.getSliceTop(),this.getSliceRight(),this.getSliceBottom(),this.getSliceLeft()];
var F=[this.getRepeatX(),this.getRepeatY()].join(j);
this.__rA=[B,qx.bom.element.Style.compile({"borderImage":s+D+t+E.join(j)+j+F,position:o,lineHeight:0,fontSize:0,overflow:p,boxSizing:v,borderWidth:E.join(f)+k}),C].join(u);
return this.__rA;
},resize:function(G,H,I){G.style.width=H+k;
G.style.height=I+k;
},tint:function(c,d){},_applyStyle:function(){{};
},_resolveImageUrl:function(J){return qx.util.ResourceManager.getInstance().toUri(qx.util.AliasManager.getInstance().resolve(J));
}},destruct:function(){this.__rA=null;
}});
})();
(function(){var C="px",B="0px",A="-1px",z="no-repeat",y="scale-x",x="scale-y",w="-tr",v="-l",u='</div>',t="scale",Q="qx.client",P="-br",O="-t",N="-tl",M="-r",L='<div style="position:absolute;top:0;left:0;overflow:hidden;font-size:0;line-height:0;">',K="_applyBaseImage",J="-b",I="String",H="",F="-bl",G="qx.ui.decoration.GridDiv",D="-c",E="mshtml";
qx.Class.define(G,{extend:qx.ui.decoration.Abstract,construct:function(R,S){qx.ui.decoration.Abstract.call(this);
if(R!=null){this.setBaseImage(R);
}
if(S!=null){this.setInsets(S);
}},properties:{baseImage:{check:I,nullable:true,apply:K}},members:{__rB:null,__rC:null,__rD:null,_getDefaultInsets:function(){return {top:0,right:0,bottom:0,left:0};
},_isInitialized:function(){return !!this.__rB;
},getMarkup:function(){if(this.__rB){return this.__rB;
}var p=qx.bom.element.Decoration;
var q=this.__rC;
var r=this.__rD;
var s=[];
s.push(L);
s.push(p.create(q.tl,z,{top:0,left:0}));
s.push(p.create(q.t,y,{top:0,left:r.left+C}));
s.push(p.create(q.tr,z,{top:0,right:0}));
s.push(p.create(q.bl,z,{bottom:0,left:0}));
s.push(p.create(q.b,y,{bottom:0,left:r.left+C}));
s.push(p.create(q.br,z,{bottom:0,right:0}));
s.push(p.create(q.l,x,{top:r.top+C,left:0}));
s.push(p.create(q.c,t,{top:r.top+C,left:r.left+C}));
s.push(p.create(q.r,x,{top:r.top+C,right:0}));
s.push(u);
return this.__rB=s.join(H);
},resize:function(c,d,e){var f=this.__rD;
var innerWidth=d-f.left-f.right;
var innerHeight=e-f.top-f.bottom;
if(innerWidth<0){innerWidth=0;
}
if(innerHeight<0){innerHeight=0;
}c.style.width=d+C;
c.style.height=e+C;
c.childNodes[1].style.width=innerWidth+C;
c.childNodes[4].style.width=innerWidth+C;
c.childNodes[7].style.width=innerWidth+C;
c.childNodes[6].style.height=innerHeight+C;
c.childNodes[7].style.height=innerHeight+C;
c.childNodes[8].style.height=innerHeight+C;

if(qx.core.Variant.isSet(Q,E)){if(qx.bom.client.Engine.VERSION<7||(qx.bom.client.Feature.QUIRKS_MODE&&qx.bom.client.Engine.VERSION<8)){if(d%2==1){c.childNodes[2].style.marginRight=A;
c.childNodes[5].style.marginRight=A;
c.childNodes[8].style.marginRight=A;
}else{c.childNodes[2].style.marginRight=B;
c.childNodes[5].style.marginRight=B;
c.childNodes[8].style.marginRight=B;
}
if(e%2==1){c.childNodes[3].style.marginBottom=A;
c.childNodes[4].style.marginBottom=A;
c.childNodes[5].style.marginBottom=A;
}else{c.childNodes[3].style.marginBottom=B;
c.childNodes[4].style.marginBottom=B;
c.childNodes[5].style.marginBottom=B;
}}}},tint:function(g,h){},_applyBaseImage:function(i,j){{};

if(i){var n=this._resolveImageUrl(i);
var o=/(.*)(\.[a-z]+)$/.exec(n);
var m=o[1];
var l=o[2];
var k=this.__rC={tl:m+N+l,t:m+O+l,tr:m+w+l,bl:m+F+l,b:m+J+l,br:m+P+l,l:m+v+l,c:m+D+l,r:m+M+l};
this.__rD=this._computeEdgeSizes(k);
}},_resolveImageUrl:function(T){return qx.util.AliasManager.getInstance().resolve(T);
},_computeEdgeSizes:function(a){var b=qx.util.ResourceManager.getInstance();
return {top:b.getImageHeight(a.t),bottom:b.getImageHeight(a.b),left:b.getImageWidth(a.l),right:b.getImageWidth(a.r)};
}},destruct:function(){this.__rB=this.__rC=this.__rD=null;
}});
})();


qx.$$loader.init();

