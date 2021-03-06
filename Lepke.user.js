// ==UserScript==
// @name         Lepke
// @namespace    http://torusz.hu/gm
// @description  Kiegészítők a Moly.hu oldalhoz
// @author       Peregi Tamás (@petamas)
// @include      http://moly.hu/*
// @include      http://www.moly.hu/*
// @include      https://moly.hu/*
// @include      https://www.moly.hu/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @version      7.7
// @updateURL    https://github.com/petamas/Lepke/raw/master/Lepke.user.js
// @downloadURL  https://github.com/petamas/Lepke/raw/master/Lepke.user.js
// @run-at       document-start
// @icon         https://github.com/petamas/Lepke/raw/master/images/Lepke64.png
// @connect      moly.hu
// @connect      github.com
// @connect      raw.githubusercontent.com
// @connect      *
// ==/UserScript==

// Készítette: Peregi Tamás (@petamas)
// Kérdésekkel, problémákkal a molyos zónában keress: http://moly.hu/zonak/molyos-bongeszo-kiegeszitok

//=============================================================================
// Segédfüggvények
//=============================================================================

var lepke__modules_id = []; //Lepke.main.js:47
var lepke__modules_name = {}; //Lepke.main.js:48

function register_module(mod) { //Lepke.main.js:50
	lepke__modules_id[lepke__modules_id.length] = mod; //Lepke.main.js:51
	lepke__modules_name[mod.name] = mod; //Lepke.main.js:52
} //Lepke.main.js:53

//Fontos a sorrend
function alert_real(text) { //common.js:1
	window.alert(text); //common.js:2
} //common.js:3

function alert_debug(text) { //common.js:5
} //common.js:9

function new_xmlhttp() { //common.js:11
	if (window.XMLHttpRequest) { //common.js:12
		//code for IE7+, Firefox, Chrome, Opera, Safari
		return new XMLHttpRequest(); //common.js:14
	} else { //common.js:15
		//code for IE6, IE5
		return new ActiveXObject('Microsoft.XMLHTTP'); //common.js:17
	} //common.js:18
} //common.js:19

//leszedi a # részt a webcímek végéről
function lepke__get_baselink(link) { //common.js:22
	do { //common.js:23
		prevlink = link; //common.js:24
		//link = link.replace(/\?.*$/,'').replace(/\#.*$/,'')
		link = link.replace(/\#.*$/,''); //common.js:26
	} while(link != prevlink); //common.js:27
	return link; //common.js:28
} //common.js:29

function is_GM() { //common.js:31
	return typeof GM_info !== 'undefined'; //common.js:32
} //common.js:33

function is_chrome() { //common.js:35
	return typeof chrome !== 'undefined'; //common.js:36
} //common.js:37

function assert(x,str_x,file,line) { //common.js:39
	if(x == null || !x) { //common.js:40
		var msg = "Assertion failed at file "+file+", line "+line+":\n"+str_x+"\n\nHa ezt az üzenetet látod, kérlek másold le ezt az üzenetet (Ctrl+C megnyomásával vágólapra kerül az ablak tartalma), és küldd el @petamas-nak üzenetben azzal együtt, hogy melyik oldalon jött elő a hiba!"; //common.js:41
		console.log(msg); //common.js:42
		alert_real(msg); //common.js:43
	} //common.js:47
} //common.js:48

function check(x) { //common.js:50
	return x!=null && x!=undefined; //common.js:51
} //common.js:52

function textnodes(dom) { //common.js:54
	var nodes = dom.childNodes; //common.js:55
	var result = []; //common.js:56
	for(var i = 0; i<nodes.length; i++) { //common.js:57
		if(nodes[i].nodeType == 3) { //common.js:58
			result[result.length] = nodes[i]; //common.js:59
		} //common.js:60
	} //common.js:61
	return result; //common.js:62
} //common.js:63

function std_compare(a,b) { //common.js:65
	return a<b ? -1 : a>b ? 1 : 0; //common.js:66
} //common.js:67
//=============================================================================
// GM_*
//=============================================================================

var lepke__keyPrefix = 'lepke__'; //GM.js:5

function MY_getValue(key,def) { //GM.js:7
	var value = localStorage.getItem(lepke__keyPrefix+key); //GM.js:15
	var ret = value!=null ? value : def; //GM.js:16
	// console.log('MY_getValue('+key+','+def+')='+ret);
	return ret; //GM.js:18
}; //GM.js:19

function MY_setValue(key,value) { //GM.js:21
	console.log('MY_setValue('+key+','+value+')'); //GM.js:22
	localStorage.setItem(lepke__keyPrefix+key, value); //GM.js:23
}; //GM.js:24

function MY_deleteValue(key) { //GM.js:26
	console.log('MY_deleteValue('+key+')'); //GM.js:27
	localStorage.removeItem(lepke__keyPrefix+key); //GM.js:28
}; //GM.js:29

function MY_listValues() { //GM.js:31
	var list = []; //GM.js:32
	var reKey = new RegExp('^' + lepke__keyPrefix); //GM.js:33
	for (var i = 0, il = window.localStorage.length; i < il; i++) { //GM.js:34
			var key = window.localStorage.key(i); //GM.js:35
			if (key.match(reKey)) { //GM.js:36
					list.push(key.replace(lepke__keyPrefix, '')); //GM.js:37
			} //GM.js:38
	} //GM.js:39
	return list; //GM.js:40
}; //GM.js:41

function MY_xmlhttpRequest(details) { //GM.js:43
	var allowed_keys = ["onreadystatechange", "method", "url", "synchronous", "onerror"]; //GM.js:44
	for(var key in details) { //GM.js:45
		if(allowed_keys.indexOf(key)==-1) { //GM.js:46
			alert_real("Unsupported XHR key: "+key); //GM.js:47
			return; //GM.js:48
		} //GM.js:49
	} //GM.js:50
	if(is_GM()) { //GM.js:51
		GM_xmlhttpRequest(details); //GM.js:52
	} else { //GM.js:53
		var xmlhttp = new_xmlhttp(); //GM.js:54
		xmlhttp.onreadystatechange=function() {details.onreadystatechange(xmlhttp);}; //GM.js:55
		xmlhttp.onerror=function() {details.onerror(xmlhttp);}; //GM.js:56
		xmlhttp.open(details.method,details.url,!details.synchronous); //GM.js:57
		xmlhttp.send(); //GM.js:58
	} //GM.js:59
} //GM.js:60
var lepke__icon = 'https://github.com/petamas/Lepke/raw/master/images/Lepke64.png'; //moly.js:1
var lepke__manifestURL = 'https://github.com/petamas/Lepke/raw/master/manifest.json'; //moly.js:2
var lepke__downloadURL = 'https://github.com/petamas/Lepke/raw/master/Lepke.user.js'; //moly.js:3
var lepke__downloadPageURL = 'https://github.com/petamas/Lepke/'; //moly.js:4

function lepke__get_user_link() { //moly.js:6
	var menu = document.querySelector('#user_menu'); //moly.js:7
	if(menu==null) // not logged in, or text mode page //moly.js:8
		return ''; //moly.js:9
	var link = menu.querySelector('a'); //moly.js:10
	assert(link != null,"link != null","moly.js",11); //moly.js:11
	var url  = link.href; //moly.js:12
	return url; //moly.js:13
} //moly.js:14

function lepke__get_user() { //moly.js:16
	var url = lepke__get_user_link(); //moly.js:17
	if(url == '') //moly.js:18
		return ''; //moly.js:19
	var user = url.replace(/.*\/tagok\//,''); //moly.js:20
	return user; //moly.js:21
} //moly.js:22

function lepke__get_menu() { //moly.js:24
	var mymenu = document.querySelector('#lepke_menu'); //moly.js:25
	if(mymenu == null) { //moly.js:26
		var header = document.querySelector('#header_right_menu'); //moly.js:27
		assert(header != null,"header != null","moly.js",28); //moly.js:28
		mymenu = document.createElement('li'); //moly.js:29
		assert(mymenu != null && mymenu != undefined,"mymenu != null && mymenu != undefined","moly.js",30); //moly.js:30
		mymenu.innerHTML = '<a href="#"><img src="'+lepke__icon+'" class="inline_avatar lepke_marker" height="32"/></a><ul></ul>'; //moly.js:31
		mymenu.id = 'lepke_menu'; //moly.js:32
		mymenu.className = 'submenu'; //moly.js:33
		mymenu.querySelector('a').addEventListener('click',prevent(settings__open)); //moly.js:34

		// var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver; //moly.js:38
		var observer = new MutationObserver(function(mutations) { //moly.js:39 //moly.js:37
				mutations.forEach(function(mutation) { //moly.js:40 //moly.js:38
					if (mutation.type == 'childList') for (var i = 0; i < mutation.removedNodes.length; ++i) { //moly.js:39
						if (mutation.removedNodes[i].nodeName.toLowerCase()=='body') //moly.js:40
						{ //moly.js:41
							console.log('Lepke unloaded because of dynamic page reload. Restarting script...'); //moly.js:42
							main(); //moly.js:43
						} //moly.js:44
					} //moly.js:45
				}); //moly.js:46
			}); //moly.js:47
		var config = { childList: true, subtree: true }; //moly.js:48
		observer.observe(document, config); //moly.js:49

		header.insertBefore(mymenu, header.firstChild); //moly.js:51
	} //moly.js:52
	return mymenu.querySelector('ul'); //moly.js:53
} //moly.js:54

function prevent(f) { //moly.js:56
	return function(e) { //moly.js:57
		e.preventDefault(); //moly.js:58
		f(e); //moly.js:59
	}; //moly.js:60
} //moly.js:61

function lepke__createMenuItem(title,link,handler,className) { //moly.js:63
	var li = document.createElement('li'); //moly.js:64
	li.innerHTML = '<a href="'+link+'">'+title+'</a>'; //moly.js:65
	li.firstChild.addEventListener("click",handler,false); //moly.js:66
	li.className = 'lepke_marker '+className; //moly.js:67
	return li; //moly.js:68
} //moly.js:69

function lepke__check_marker(marker, message) { //moly.js:71
	if (document.querySelector(marker) != null) //moly.js:72
	{ //moly.js:73
		console.log('> '+message); //moly.js:74
		return true; //moly.js:75
	} //moly.js:76
	return false; //moly.js:77
} //moly.js:78

function lepke__check_real(obj, message) { //moly.js:80
	if (obj == null) //moly.js:81
	{ //moly.js:82
		console.log('> '+message+': '+document.location.href); //moly.js:83
		return true; //moly.js:84
	} //moly.js:85
	return false; //moly.js:86
} //moly.js:87

function lepke__version() { //moly.js:90
	if(is_GM()) { //moly.js:91
		return GM_info.script.version; //moly.js:92
	} else if(is_chrome()) { //moly.js:93
		return chrome.runtime.getManifest().version; //moly.js:94
	} else { //moly.js:95
		return '??'; //moly.js:96
	} //moly.js:97
} //moly.js:98

function lepke__edition() { //moly.js:101
	if(is_GM()) { //moly.js:102
		if(is_chrome()) { //moly.js:103
			return 'TM'; //moly.js:104
		} else { //moly.js:105
			return 'GM'; //moly.js:106
		} //moly.js:107
	} else if(is_chrome()) { //moly.js:108
		return 'GC'; //moly.js:109
	} else { //moly.js:110
		return '??'; //moly.js:111
	} //moly.js:112
} //moly.js:113

//=============================================================================
// Modal dialog
//=============================================================================

function modal__open(content,close) { //moly.js:119
	var background = document.createElement('div'); //moly.js:120
	background.className = 'modal-background'; //moly.js:121
	document.body.appendChild(background); //moly.js:122

	var modal = document.createElement('div'); //moly.js:124
	modal.className = 'modal-window'; //moly.js:125
	modal.innerHTML = '<div class="modal-content"><div class="modal-close"><a href="#"><img src="/modal/closelabel.png" alt=""></a></div><div class="pjax" id="pjax"></div>	</div>'; //moly.js:126
	modal.style.top = '55px'; //moly.js:127

	modal.querySelector('#pjax').innerHTML = content; //moly.js:129
	document.body.appendChild(modal); //moly.js:130
	modal.style.left = (window.innerWidth-modal.offsetWidth)/2 + 'px'; //moly.js:131

	var close_button = modal.querySelector('.modal-close').firstChild; //moly.js:133
	if(close == undefined || close == null) //moly.js:134
		close = modal__close; //moly.js:135
	close_button.addEventListener('click', close); //moly.js:136

	return modal; //moly.js:138
} //moly.js:139

function modal__close() { //moly.js:141
	var x = document.querySelector('.modal-background'); //moly.js:142
	x.parentNode.removeChild(x); //moly.js:143
	var y = document.querySelector('.modal-window'); //moly.js:144
	y.parentNode.removeChild(y); //moly.js:145
} //moly.js:146

function member(name,href) { //moly.js:149
	this.name = name; //moly.js:150
	this.href = href; //moly.js:151
} //moly.js:152

function member_ref(x) { //moly.js:154
	return '@<a href="'+x.href+'">' + x.name + '</a>'; //moly.js:155
} //moly.js:156

function member_cmp(a,b) { //moly.js:158
	var an = a.name.toLowerCase(); //moly.js:159
	var bn = b.name.toLowerCase(); //moly.js:160
	return std_compare(an,bn); //moly.js:161
} //moly.js:162
//=============================================================================
// Beállítások
//=============================================================================

function settings__load() { //mod_settings.js:5
	for(var id in lepke__modules_id) { //mod_settings.js:6
		var mod = lepke__modules_id[id]; //mod_settings.js:7
		if(mod.optional) { //mod_settings.js:8
			var key = 'enable_'+mod.name; //mod_settings.js:9
			var def = mod.enabled ? 1 : 0; //mod_settings.js:10
			var raw = MY_getValue(key,def); //mod_settings.js:11
			var val = parseInt(raw); //mod_settings.js:12
			mod.enabled = val==1 ? true : false; //mod_settings.js:13
		} //mod_settings.js:14
	} //mod_settings.js:15
} //mod_settings.js:16

function settings__save() { //mod_settings.js:18
	for(var id in lepke__modules_id) { //mod_settings.js:19
		var mod = lepke__modules_id[id]; //mod_settings.js:20
		if(mod.optional) { //mod_settings.js:21
			var key = 'enable_'+mod.name; //mod_settings.js:22
			var val = mod.enabled ? 1 : 0; //mod_settings.js:23
			MY_setValue(key,val); //mod_settings.js:24
		} //mod_settings.js:25
	} //mod_settings.js:26
} //mod_settings.js:27

function settings__ok(e) { //mod_settings.js:29
	for(var id in lepke__modules_id) { //mod_settings.js:30
		var mod = lepke__modules_id[id]; //mod_settings.js:31
		if(mod.optional) { //mod_settings.js:32
			mod.enabled = document.querySelector('#lepke_enable_'+mod.name).checked; //mod_settings.js:33
		} //mod_settings.js:34
	} //mod_settings.js:35
	settings__save(); //mod_settings.js:36
	modal__close(); //mod_settings.js:37
} //mod_settings.js:38

function add_i_tag(s) { //mod_settings.js:40
	var r = /_[^_]*_/; //mod_settings.js:41
	while(r.test(s)) { //mod_settings.js:42
		var m = r.exec(s)[0]; //mod_settings.js:43
		s = s.replace(m,'<i>'+m.replace(/_/g,'')+'</i>'); //mod_settings.js:44
	} //mod_settings.js:45
	return s; //mod_settings.js:46
} //mod_settings.js:47

function settings__line(mod,title,desc) { //mod_settings.js:49
	var xcheck = '<input type="checkbox" id="lepke_enable_'+mod+'"/>'; //mod_settings.js:50
	var xtitle = '<b>'+add_i_tag(title)+'</b>'; //mod_settings.js:51
	var xdesc  = desc != '' ? '<br/>'+add_i_tag(desc) : ''; //mod_settings.js:52
	return '<tr><td>'+xcheck+'</td><td>'+xtitle+xdesc+'</td></tr>'; //mod_settings.js:53
} //mod_settings.js:54

function settings__open() { //mod_settings.js:56
	var version = 'v'+lepke__version()+' ('+lepke__edition()+')'; //mod_settings.js:57
	var x = ''; //mod_settings.js:58
	x += '<h1>Lepke beállítások &ndash; '+version+'</h1>'; //mod_settings.js:59
	x += '<form><table>'; //mod_settings.js:60
	for(var id in lepke__modules_id) { //mod_settings.js:61
		var mod = lepke__modules_id[id]; //mod_settings.js:62
		if(mod.optional) { //mod_settings.js:63
			x += settings__line(mod.name,mod.short_description,mod.long_description); //mod_settings.js:64
		} //mod_settings.js:65
	} //mod_settings.js:66
	x += '</table>'; //mod_settings.js:67
	x += '<input type="submit" id="lepke_settings_ok" value="OK">'; //mod_settings.js:68
	x += '</form>'; //mod_settings.js:69

	modal__open(x);	 //mod_settings.js:71
	settings__load(); //mod_settings.js:72
	for(var id in lepke__modules_id) { //mod_settings.js:73
		var mod = lepke__modules_id[id]; //mod_settings.js:74
		if(mod.optional) { //mod_settings.js:75
			document.querySelector('#lepke_enable_'+mod.name).checked = mod.enabled; //mod_settings.js:76
		} //mod_settings.js:77
	} //mod_settings.js:78

	document.querySelector('#lepke_settings_ok').addEventListener('click', prevent(settings__ok)); //mod_settings.js:80
} //mod_settings.js:81

function settings__setup() { //mod_settings.js:83
	settings__load(); //mod_settings.js:84
	if (lepke__check_marker('.lepke_marker_settings', 'Settings menu item is already added')) //mod_settings.js:85
		return; //mod_settings.js:86
	var settings = lepke__createMenuItem('Beállítások', '#', settings__open, 'lepke_marker_settings'); //mod_settings.js:87
	lepke__get_menu().appendChild(settings); //mod_settings.js:88
} //mod_settings.js:89

register_module(new function() { //mod_settings.js:92
	this.name = 'settings'; //mod_settings.js:93
	this.optional = false; //mod_settings.js:94
	this.enabled = true; //mod_settings.js:95
	this.short_description = 'Beállítások'; //mod_settings.js:96
	this.long_description = ''; //mod_settings.js:97
	this.setup = settings__setup; //mod_settings.js:98
}); //mod_settings.js:99
//=============================================================================
// Modul: update
//=============================================================================

function update__newer(v1,v2) { //mod_update.js:5
	var v1parts = v1.split('.'); //mod_update.js:6
	var v2parts = v2.split('.'); //mod_update.js:7
	while (v1parts.length < v2parts.length) v1parts.push("0"); //mod_update.js:8
	while (v2parts.length < v1parts.length) v2parts.push("0"); //mod_update.js:9
	v1parts = v1parts.map(Number); //mod_update.js:10
	v2parts = v2parts.map(Number); //mod_update.js:11
	for(var i = 0; i<v1parts.length; i++) //mod_update.js:12
		if(v1parts[i]!=v2parts[i]) //mod_update.js:13
			return v1parts[i]>v2parts[i]; //mod_update.js:14
	return false; //mod_update.js:15
} //mod_update.js:16

function update__today(last_update_check) //mod_update.js:18
{ //mod_update.js:19
	return last_update_check != '' && new Date(last_update_check).toDateString() == new Date().toDateString(); //mod_update.js:20
} //mod_update.js:21

function update__look(alert_if_nothing) { //mod_update.js:23
	MY_xmlhttpRequest({ //mod_update.js:24
		method: "GET", //mod_update.js:25
		url: lepke__manifestURL+"?datetime="+new Date().toString(), //mod_update.js:26
		synchronous: false, //mod_update.js:27
		onreadystatechange: function(response) { //mod_update.js:28
			if (response.readyState==4 && response.status==200){ //mod_update.js:29
				var last_update_check = MY_getValue('last_update_check',''); //mod_update.js:30
				if(!alert_if_nothing && update__today(last_update_check)) //re-check needed because of async processing //mod_update.js:31
					return; //mod_update.js:32

				MY_setValue('last_update_check',new Date().toString()); //mod_update.js:34

				var manifest = JSON.parse(response.responseText); //mod_update.js:36
				if(update__newer(manifest.version,lepke__version())) { //mod_update.js:37
					var r = window.confirm('Új Lepke verzió érhető el. Szeretnéd a jelenlegi '+lepke__version()+' verziót '+manifest.version+' verzióra frissíteni?'); //mod_update.js:38
					if(r) { //mod_update.js:39
						location.href = is_GM() ? lepke__downloadURL : lepke__downloadPageURL; //mod_update.js:40
					} //mod_update.js:41
				} else if(manifest.version==lepke__version()){ //mod_update.js:42
					if(alert_if_nothing) alert_real('A legfrissebb verziót használod.'); //mod_update.js:43
				} else { //mod_update.js:44
					alert_real('Frissebb a verziód, mint a hivatalos.'); //mod_update.js:45
				} //mod_update.js:46
			} //mod_update.js:47
		}, //mod_update.js:48
		onerror: function(response) { //mod_update.js:49
			alert_real('Error: '+response.status+' '+response.statusText+'\n'+response.responseText); //mod_update.js:50
		} //mod_update.js:51
	}); //mod_update.js:52
} //mod_update.js:53

function update__setup() { //mod_update.js:55
	var last_update_check = MY_getValue('last_update_check',''); //mod_update.js:56
	if(!update__today(last_update_check)) { //mod_update.js:57
		update__look(false); //mod_update.js:58
	} //mod_update.js:59

	if (lepke__check_marker('.lepke_marker_update', 'Update menu item is already added')) //mod_update.js:61
		return; //mod_update.js:62
	lepke__get_menu().appendChild( //mod_update.js:63
		lepke__createMenuItem('Új verzió keresése', '#', prevent(function(){update__look(true);}), 'lepke_marker_update') //mod_update.js:64
	); //mod_update.js:65
} //mod_update.js:66

register_module(new function() { //mod_update.js:68
	this.name = 'update'; //mod_update.js:69
	this.optional = false; //mod_update.js:70
	this.enabled = true; //mod_update.js:71
	this.short_description ='Lepke frissítése'; //mod_update.js:72
	this.long_description = ''; //mod_update.js:73
	this.setup = update__setup; //mod_update.js:74
}); //mod_update.js:75
//=============================================================================
// Modul: logger
//=============================================================================

function logger__log_ex(mod,inc) { //mod_logger.js:5
	if(!lepke__modules_name.logger.enabled) //mod_logger.js:6
		return; //mod_logger.js:7

	var key = 'count_'+mod; //mod_logger.js:9
	var current = parseInt(MY_getValue(key,0)); //mod_logger.js:10
	current += parseInt(inc); //mod_logger.js:11
	MY_setValue(key,current); //mod_logger.js:12
} //mod_logger.js:13

function logger__log(mod) { //mod_logger.js:15
	logger__log_ex(mod,1); //mod_logger.js:16
} //mod_logger.js:17

function logger__show() { //mod_logger.js:19
	var keys = MY_listValues(); //mod_logger.js:20
	var data = new Object(); //mod_logger.js:21
	for(var i =0; i<keys.length; i++) { //mod_logger.js:22
		data[keys[i]] = MY_getValue(keys[i]); //mod_logger.js:23
	} //mod_logger.js:24
	alert_real(JSON.stringify(data,null,'  ')); //mod_logger.js:25
} //mod_logger.js:26

function logger__setup() { //mod_logger.js:28
	var first = MY_getValue('first_install',''); //mod_logger.js:29
	if(first=='') { //mod_logger.js:30
		MY_setValue('first_install',new Date().toString()); //mod_logger.js:31
	} //mod_logger.js:32

	if (lepke__check_marker('.lepke_marker_logger', '"Logged data" menu item is already added')) //mod_logger.js:34
		return; //mod_logger.js:35
	var show = lepke__createMenuItem('Tárolt adatok', '#', prevent(logger__show), 'lepke_marker_logger'); //mod_logger.js:36
	lepke__get_menu().appendChild(show); //mod_logger.js:37
} //mod_logger.js:38

register_module(new function() { //mod_logger.js:40
	this.name = 'logger'; //mod_logger.js:41
	this.optional = true; //mod_logger.js:42
	this.enabled = true; //mod_logger.js:43
	this.short_description = 'Használati statisztika készítése'; //mod_logger.js:44
	this.long_description = 'Ha be van kapcsolva, a Lepke számolja, hogy melyik funkcióját mennyit használod. Egy későbbi verzió ezt az adatot _anonim módon_ eljuttatja majd hozzám. (Jelenleg csak a te gépeden tárolódnak a számok.) Ezekből az adatokból látom, hogy melyik funkciót érdemes fejleszteni/karbantartani. Kérlek, engedélyezd a statisztika készítését!'; //mod_logger.js:45
	this.setup = logger__setup; //mod_logger.js:46
}); //mod_logger.js:47

//=============================================================================
// Modul: regebbi_peldany
//=============================================================================

function regebbi_peldany__setup() { //mod_regebbi_peldany.js:5
	if(new RegExp('^http://(www)?moly.hu/konyvek/.+$').test(document.location.href)) { //mod_regebbi_peldany.js:6
		if (lepke__check_marker('.lepke_marker_regebbi_peldany', 'Button already exists')) //mod_regebbi_peldany.js:7
			return; //mod_regebbi_peldany.js:8

		var title_fn = document.querySelector('#main h1.book .fn'); //mod_regebbi_peldany.js:10
		if(lepke__check_real(title_fn, 'Not a real book')) //mod_regebbi_peldany.js:11
			return; //mod_regebbi_peldany.js:12

		var buttons = document.querySelectorAll('.button_to'); //mod_regebbi_peldany.js:14
		for(var b=0;b<buttons.length;b++) { //mod_regebbi_peldany.js:15
			if(buttons[b].action.search('/magankonyvtar')!=-1) { //mod_regebbi_peldany.js:16
				var div = buttons[b].parentNode; //mod_regebbi_peldany.js:17
				assert(div.querySelector('input')!=null && div.querySelector('form')!=null,"div.querySelector('input')!=null && div.querySelector('form')!=null","mod_regebbi_peldany.js",18); //mod_regebbi_peldany.js:18
				var clone = div.cloneNode(true); //mod_regebbi_peldany.js:19
				clone.querySelector('input').value='Régebbi példány'; //mod_regebbi_peldany.js:20
				clone.querySelector('form').action = clone.querySelector('form').action + '&copy%5Bis_earlier%5D=true'; //mod_regebbi_peldany.js:21
				clone.querySelector('form').addEventListener('submit',function(){logger__log('regebbi_peldany');}); //mod_regebbi_peldany.js:22
				clone.className += ' lepke_marker lepke_marker_regebbi_peldany'; //mod_regebbi_peldany.js:23
				div.parentNode.insertBefore(clone,div.nextSibling); //mod_regebbi_peldany.js:24
				break; //mod_regebbi_peldany.js:25
			} //mod_regebbi_peldany.js:26
		} //mod_regebbi_peldany.js:27
		console.log('> Done'); //mod_regebbi_peldany.js:28
	} else { //mod_regebbi_peldany.js:29
		console.log('> Not a book'); //mod_regebbi_peldany.js:30
	} //mod_regebbi_peldany.js:31
} //mod_regebbi_peldany.js:32

register_module(new function() { //mod_regebbi_peldany.js:34
	this.name = 'regebbi_peldany'; //mod_regebbi_peldany.js:35
	this.optional = true; //mod_regebbi_peldany.js:36
	this.enabled = true; //mod_regebbi_peldany.js:37
	this.short_description = '_Régebbi példány_ gomb hozzáadása a könyvadatlapokhoz'; //mod_regebbi_peldany.js:38
	this.long_description = 'Működése megegyezik a _Hozzáadás_ menü _Korábbi saját példány_ menüpontjának működésével, de nem kérdez rá, hogy melyik évben szerezted meg. Az így felvett könyvek nem jelennek meg a figyelőid frissében.'; //mod_regebbi_peldany.js:39
	this.setup = regebbi_peldany__setup; //mod_regebbi_peldany.js:40
}); //mod_regebbi_peldany.js:41
//=============================================================================
// Modul: hozzaszolasok
//=============================================================================

function hozzaszolasok__setup() { //mod_hozzaszolasok.js:5
	if (lepke__check_marker('.lepke_marker_hozzaszolasok', 'Menu item already exists')) //mod_hozzaszolasok.js:6
		return; //mod_hozzaszolasok.js:7

	var ul = document.querySelector('#user_menu ul'); //mod_hozzaszolasok.js:9
	assert(ul,"ul","mod_hozzaszolasok.js",10); //mod_hozzaszolasok.js:10
	ul.appendChild(lepke__createMenuItem( //mod_hozzaszolasok.js:11
		'Hozzászólások', //mod_hozzaszolasok.js:12
		lepke__get_user_link()+'/hozzaszolasok', //mod_hozzaszolasok.js:13
		function(){logger__log('hozzaszolasok');}, //mod_hozzaszolasok.js:14
		'lepke_marker_hozzaszolasok') //mod_hozzaszolasok.js:15
	); //mod_hozzaszolasok.js:16

	console.log('> Done'); //mod_hozzaszolasok.js:18
} //mod_hozzaszolasok.js:19

register_module(new function() { //mod_hozzaszolasok.js:21
	this.name = 'hozzaszolasok'; //mod_hozzaszolasok.js:22
	this.optional = true; //mod_hozzaszolasok.js:23
	this.enabled = true; //mod_hozzaszolasok.js:24
	this.short_description = '_Hozzászólások_ menüpont hozzáadása a _Profilom_ menühöz'; //mod_hozzaszolasok.js:25
	this.long_description = 'Sokan hiányolták, köztük én is, most már újra van. :)'; //mod_hozzaszolasok.js:26
	this.setup = hozzaszolasok__setup; //mod_hozzaszolasok.js:27
}); //mod_hozzaszolasok.js:28
//=============================================================================
// Modul: (kihivas|esemeny)_kukac
//=============================================================================

var kukac__kihivas_open; //mod_kukac.js:5
var kukac__esemeny_open; //mod_kukac.js:6

function kukac__kihivas_refresh() { //mod_kukac.js:8
	kukac__kihivas_open = !kukac__kihivas_open; //mod_kukac.js:9
	if(!kukac__kihivas_open) //mod_kukac.js:10
		return; //mod_kukac.js:11

	logger__log('kihivas_kukac'); //mod_kukac.js:13
	document.querySelector('#lepke_kihivas_resztvevok').innerHTML = 'Betöltés...'; //mod_kukac.js:14

	MY_xmlhttpRequest({ //mod_kukac.js:16
		method: "GET", //mod_kukac.js:17
		url: location.href + '/teljesitesek', //mod_kukac.js:18
		synchronous: false, //mod_kukac.js:19
		onreadystatechange: function(response) { //mod_kukac.js:20
			if (response.readyState==4 && response.status==200){ //mod_kukac.js:21
				var xmldoc = (new DOMParser).parseFromString(response.responseText,'text/html'); //mod_kukac.js:22
				var tr = xmldoc.querySelectorAll('#content table tr'); //mod_kukac.js:23
				var teljesitok = []; //mod_kukac.js:24
				var nem_teljesitok = []; //mod_kukac.js:25
				for(var i = 1; i<tr.length; i++) { //mod_kukac.js:26
					var link = tr[i].querySelector('a'); //mod_kukac.js:27
					assert(link != null,"link != null","mod_kukac.js",28); //mod_kukac.js:28
					var mem = new member(link.innerHTML, link.getAttribute('href')); //mod_kukac.js:29
					var td = tr[i].lastChild; //mod_kukac.js:30
					if(td.querySelector('.completed') != null || td.querySelector('.on') != null) { //mod_kukac.js:31
						teljesitok[teljesitok.length] = mem; //mod_kukac.js:32
					} else { //mod_kukac.js:33
						nem_teljesitok[nem_teljesitok.length] = mem; //mod_kukac.js:34
					} //mod_kukac.js:35
				} //mod_kukac.js:36

				var resztvevok = teljesitok.concat(nem_teljesitok); //mod_kukac.js:38
				resztvevok.sort(member_cmp); //mod_kukac.js:39
				teljesitok.sort(member_cmp); //mod_kukac.js:40
				nem_teljesitok.sort(member_cmp); //mod_kukac.js:41

				document.querySelector('#lepke_kihivas_resztvevok').innerHTML = //mod_kukac.js:43
					'<p><b>Résztvevők ('+resztvevok.length+'):</b> ' + resztvevok.map(member_ref).join(", ") + '</p>' + //mod_kukac.js:44
					'<p><b>Teljesítők ('+teljesitok.length+'):</b> ' + teljesitok.map(member_ref).join(", ") + '</p>' + //mod_kukac.js:45
					'<p><b>Nem teljesítők ('+nem_teljesitok.length+'):</b> ' + nem_teljesitok.map(member_ref).join(", ") + '</p>'; //mod_kukac.js:46
			} //mod_kukac.js:47
		} //mod_kukac.js:48
	}); //mod_kukac.js:49
} //mod_kukac.js:50

function kukac__esemeny_refresh() { //mod_kukac.js:52
	kukac__esemeny_open = !kukac__esemeny_open; //mod_kukac.js:53
	if(!kukac__esemeny_open) //mod_kukac.js:54
		return; //mod_kukac.js:55

	logger__log('esemeny_kukac'); //mod_kukac.js:57
	document.querySelector('#lepke_esemeny_resztvevok').innerHTML = 'Betöltés...'; //mod_kukac.js:58

	var text = document.querySelector('#content .event .text'); //mod_kukac.js:60
	assert(text != null,"text != null","mod_kukac.js",61); //mod_kukac.js:61
	var linkek = text.nextSibling.querySelectorAll('.user_selector'); //mod_kukac.js:62

	var resztvevok = []; //mod_kukac.js:64
	for(var i = 0; i<linkek.length; i++) { //mod_kukac.js:65
		var link = linkek[i]; //mod_kukac.js:66
		resztvevok[resztvevok.length]= new member(link.innerHTML, link.getAttribute('href')); //mod_kukac.js:67
	}	 //mod_kukac.js:68

	resztvevok.sort(member_cmp); //mod_kukac.js:70
	var result = '<b>Résztvevők ('+resztvevok.length+'):</b> ' + resztvevok.map(member_ref).join(", "); //mod_kukac.js:71
	document.querySelector('#lepke_esemeny_resztvevok').innerHTML = '<p>'+result+'</p>'; //mod_kukac.js:72
} //mod_kukac.js:73

function kukac__setup(className, urlpart,div_id,refresh_func) { //mod_kukac.js:75
	if(new RegExp('^http://(www)?moly.hu/'+urlpart+'/[^\/]+$').test(document.location.href)) { //mod_kukac.js:76
			if (lepke__check_marker('.lepke_marker_kukac_'+className, 'Button already exists')) //mod_kukac.js:77
				return; //mod_kukac.js:78

			var campaign = document.querySelector('#content .item.'+className); //mod_kukac.js:80
			if(lepke__check_real(campaign, 'Not a real '+className)) //mod_kukac.js:81
				return; //mod_kukac.js:82

			var container = campaign.querySelector('.add_comment_button'); //mod_kukac.js:84
			assert(container,"container","mod_kukac.js",85); //mod_kukac.js:85
			var button = document.createElement('div'); //mod_kukac.js:86
			button.setAttribute('class','formbutton lepke_marker lepke_marker_kukac_'+className); //mod_kukac.js:87
			button.innerHTML = '<a href="#">Résztvevők kukacolása</a><div id="'+div_id+'">Ideiglenes érték</div>'; //mod_kukac.js:88
			button.querySelector('a').addEventListener('click', refresh_func, false); //mod_kukac.js:89
			container.insertBefore(button, container.lastChild); //mod_kukac.js:90

			console.log('> Done'); //mod_kukac.js:92
	} else { //mod_kukac.js:93
		console.log('> Not '+(className[0]=='e'?'an ':'a ')+className); //mod_kukac.js:94
	} //mod_kukac.js:95
} //mod_kukac.js:96

function kukac__kihivas_setup() { //mod_kukac.js:98
	kukac__setup('campaign', 'kihivasok','lepke_kihivas_resztvevok',kukac__kihivas_refresh); //mod_kukac.js:99
	kukac__kihivas_open = false; //mod_kukac.js:100
}  //mod_kukac.js:101

function kukac__esemeny_setup() { //mod_kukac.js:103
	kukac__setup('event', 'esemenyek','lepke_esemeny_resztvevok',kukac__esemeny_refresh); //mod_kukac.js:104
	kukac__esemeny_open = false; //mod_kukac.js:105
}  //mod_kukac.js:106

register_module(new function() { //mod_kukac.js:108
	this.name = 'esemeny_kukac'; //mod_kukac.js:109
	this.optional = true; //mod_kukac.js:110
	this.enabled = true; //mod_kukac.js:111
	this.short_description = '_Résztvevők kukacolása_ gomb hozzáadása eseményekhez'; //mod_kukac.js:112
	this.long_description = 'A gombra kattintva megjelenik egy kukacolt lista az esemény résztvevőiről, amit könnyedén be lehet másolni egy hozzászólásba, ha valamiért meg akarod szólítani őket. Nem csak az esemény tulajdonosának, hanem mindenkinek működik.'; //mod_kukac.js:113
	this.setup = kukac__esemeny_setup; //mod_kukac.js:114
}); //mod_kukac.js:115

register_module(new function() { //mod_kukac.js:117
	this.name = 'kihivas_kukac'; //mod_kukac.js:118
	this.optional = true; //mod_kukac.js:119
	this.enabled = true; //mod_kukac.js:120
	this.short_description = '_Résztvevők kukacolása_ gomb hozzáadása kihívásokhoz'; //mod_kukac.js:121
	this.long_description = 'A gombra kattintva megjelenik egy kukacolt lista az összes résztvevőről ill. külön a teljesítőkről és a nem teljesítőkről, amit könnyedén be lehet másolni egy hozzászólásba, ha valamiért meg akarod szólítani a résztvevőket. Nem csak a kihívásgazdának, hanem mindenkinek működik.'; //mod_kukac.js:122
	this.setup = kukac__kihivas_setup; //mod_kukac.js:123
}); //mod_kukac.js:124
//=============================================================================
// Modul: kethasab
//=============================================================================

function kethasab__setup() { //mod_kethasab.js:5
	if (lepke__check_marker('.lepke_marker_kethasab', 'Profile menu is already modified')) //mod_kethasab.js:6
		return; //mod_kethasab.js:7

	var ul = document.querySelector('#user_menu ul'); //mod_kethasab.js:9
	assert(ul != null,"ul != null","mod_kethasab.js",10); //mod_kethasab.js:10
	var table = document.createElement('ul'); //mod_kethasab.js:11
	table.className = 'header_menu lepke_marker lepke_marker_kethasab'; //mod_kethasab.js:12
	table.innerHTML = '<table><tbody><tr>' //mod_kethasab.js:13
	                + '<td style="width:50%;"><ul class="sidelinks"></ul></td>' //mod_kethasab.js:14
	                + '<td style="width:50%;"><ul class="sidelinks"></ul></td>' //mod_kethasab.js:15
	                + '</tr></tbody></table>'; //mod_kethasab.js:16
	table.querySelector('table').setAttribute('style','width: 100%;'); //mod_kethasab.js:17
	ul.parentNode.appendChild(table); //mod_kethasab.js:18

	var lis = ul.querySelectorAll('li'); //mod_kethasab.js:20
	var lis_array = []; //mod_kethasab.js:21
	for(var i = 0; i<lis.length; i++) { //mod_kethasab.js:22
		lis_array[i] = lis[i]; //mod_kethasab.js:23
	} //mod_kethasab.js:24

	var n = lis_array.length; //mod_kethasab.js:26
	var m = Math.floor(n/2); //mod_kethasab.js:27
	var uls = table.querySelectorAll('.sidelinks'); //mod_kethasab.js:28
	for(var i = 0; i<n; i++) { //mod_kethasab.js:29
		uls[i<m ? 0 : 1].appendChild(lis_array[i]); //mod_kethasab.js:30
	} //mod_kethasab.js:31

	ul.parentNode.removeChild(ul); //mod_kethasab.js:33
	console.log('> Done'); //mod_kethasab.js:34
} //mod_kethasab.js:35

register_module(new function() { //mod_kethasab.js:37
	this.name = 'kethasab'; //mod_kethasab.js:38
	this.optional = true; //mod_kethasab.js:39
	this.enabled = true; //mod_kethasab.js:40
	this.short_description = '_Profil_ két hasábossá tétele'; //mod_kethasab.js:41
	this.long_description = 'A _Profil_ menüt a főmenühöz hasonlóan két hasábossá teszi. (Így kevésbé lóg ki alul a képernyőről.)'; //mod_kethasab.js:42
	this.setup = kethasab__setup; //mod_kethasab.js:43
}); //mod_kethasab.js:44
//=============================================================================
// Modul: rukkola
//=============================================================================

function rukkola__setup() { //mod_rukkola.js:5
	link_adder__setup('rukkola','http://rukkola.hu/konyvek/kereses?utf8=%E2%9C%93&kereses=','Rukkola',true); //mod_rukkola.js:6
} //mod_rukkola.js:7

function link_adder__setup(marker_name,baselink,link_text,addsub,blank,encode) { //mod_rukkola.js:18
	if(blank==null) //mod_rukkola.js:19
		blank = true; //mod_rukkola.js:20
	if(encode==null) //mod_rukkola.js:21
		encode = true; //mod_rukkola.js:22

	if(new RegExp('^http://(www)?moly.hu/konyvek/[^/]+$').test(document.location.href)) { //mod_rukkola.js:24
		if (lepke__check_marker('.lepke_marker_links_'+marker_name, 'Button already exists for '+marker_name)) //mod_rukkola.js:25
			return; //mod_rukkola.js:26

		var search = ''; //mod_rukkola.js:28
		var author_links = document.querySelectorAll("#main .authors a"); //mod_rukkola.js:29
		for(var i=0; i<author_links.length; i++) { //mod_rukkola.js:30
			search += author_links[i].innerHTML.trim() + ' '; //mod_rukkola.js:31
		} //mod_rukkola.js:32

		var title_fn = document.querySelector("#main h1.book .fn"); //mod_rukkola.js:34
		if(lepke__check_real(title_fn, 'Not a real book')) //mod_rukkola.js:35
			return; //mod_rukkola.js:36

		var title = textnodes(title_fn)[0]; //mod_rukkola.js:38
		assert(title != null,"title != null","mod_rukkola.js",39); //mod_rukkola.js:39
		search += title.textContent.trim(); //mod_rukkola.js:40

		var subtitle = document.querySelector("#main .subtitle"); //mod_rukkola.js:42
		if(addsub && subtitle != null) { //mod_rukkola.js:43
			search += ' '+subtitle.innerHTML.trim(); //mod_rukkola.js:44
		} //mod_rukkola.js:45

		var link = baselink+ (encode ? encodeURIComponent(search) : search.replace(' ','%20')); //mod_rukkola.js:47

		var div = document.createElement('div'); //mod_rukkola.js:49
		div.innerHTML = '<div class="right"><a href="'+link+'" class="button cart_button" '+(blank?'target="_blank"':'')+'>Rákeresek</a></div><strong>'+link_text+'</strong>'; //mod_rukkola.js:50
		div.className = 'shop_item lepke_marker lepke_marker_links_'+marker_name; //mod_rukkola.js:51
		div.querySelector('a').addEventListener("click",function(){logger__log('rukkola');},false); //mod_rukkola.js:52

		var shopbox = document.querySelector("#main .shopbox"); //mod_rukkola.js:54
		assert(shopbox != null,"shopbox != null","mod_rukkola.js",55); //mod_rukkola.js:55
		shopbox.appendChild(div); //mod_rukkola.js:56
		console.log('> Done ('+marker_name+')'); //mod_rukkola.js:57
	} else { //mod_rukkola.js:58
		console.log('> Not a book'); //mod_rukkola.js:59
	} //mod_rukkola.js:60
} //mod_rukkola.js:61

register_module(new function() { //mod_rukkola.js:63
	this.name = 'rukkola'; //mod_rukkola.js:64
	this.optional = true; //mod_rukkola.js:65
	this.enabled = true; //mod_rukkola.js:66
	this.short_description = 'Rukkola link megjelenítése a könyvadatlapokon'; //mod_rukkola.js:67
	this.long_description = 'A közvetlen adatlapra linkelést még nem sikerült megoldanom, így jelenleg a keresővel keres a szerző(k)+cím+alcím kombinációra.'; //mod_rukkola.js:68
	this.setup = rukkola__setup; //mod_rukkola.js:69
}); //mod_rukkola.js:70

//=============================================================================
// Modul: fomenu
//=============================================================================

function fomenu__setup() { //mod_fomenu.js:5
	if (lepke__check_marker('.lepke_marker_fomenu', 'Main menu is already modified')) //mod_fomenu.js:6
		return; //mod_fomenu.js:7

	var uls = document.querySelectorAll('#root_menu .simplesidelinks'); //mod_fomenu.js:9
	assert(uls.length == 2,"uls.length == 2","mod_fomenu.js",10); //mod_fomenu.js:10
	uls[0].appendChild(lepke__createMenuItem('Molybazár', 'http://moly.hu/molybazar', function(){logger__log('fomenu');}, 'lepke_marker_fomenu')); //mod_fomenu.js:11
	uls[1].appendChild(lepke__createMenuItem('Molybolt',  'http://molybolt.hu/',      function(){logger__log('fomenu');}, 'lepke_marker_fomenu')); //mod_fomenu.js:12
	uls[0].appendChild(lepke__createMenuItem('Merítés',   'http://moly.hu/merites',   function(){logger__log('fomenu');}, 'lepke_marker_fomenu')); //mod_fomenu.js:13
	uls[1].appendChild(lepke__createMenuItem('Molyblog',  'http://moly.hu/blog',      function(){logger__log('fomenu');}, 'lepke_marker_fomenu')); //mod_fomenu.js:14

	console.log('> Done'); //mod_fomenu.js:16
} //mod_fomenu.js:17

register_module(new function() { //mod_fomenu.js:19
	this.name = 'fomenu'; //mod_fomenu.js:20
	this.optional = true; //mod_fomenu.js:21
	this.enabled = true; //mod_fomenu.js:22
	this.short_description = 'Molybazár, Molybolt, Merítés és Molyblog hozzáadása a főmenühöz'; //mod_fomenu.js:23
	this.long_description = 'Sosem találom őket, így könnyen elérhető helyre raktam.'; //mod_fomenu.js:24
	this.setup = fomenu__setup; //mod_fomenu.js:25
}); //mod_fomenu.js:26
//#include "mod_spoileropen.js"
//=============================================================================
// Modul: suti
//=============================================================================

function suti__setup() { //mod_suti.js:5
	if (lepke__check_marker('.lepke_marker_suti', 'Menu item already exists')) //mod_suti.js:6
		return; //mod_suti.js:7

	GM_addStyle('.toprightmenu > li > a[href="/szerencsesuti"] { display: none; }'); //mod_suti.js:9

	var info_link = document.querySelector('.toprightmenu > li > a[href="/info"]'); //mod_suti.js:11
	assert(info_link,"info_link","mod_suti.js",12); //mod_suti.js:12

	var info_ul = info_link.parentNode.querySelector('ul'); //mod_suti.js:14
	assert(info_ul,"info_ul","mod_suti.js",15); //mod_suti.js:15

	info_ul.appendChild(lepke__createMenuItem( //mod_suti.js:17
		'Szerencsesüti', //mod_suti.js:18
		'/szerencsesuti', //mod_suti.js:19
		function(){logger__log('suti');}, //mod_suti.js:20
		'lepke_marker_suti') //mod_suti.js:21
	); //mod_suti.js:22

	console.log('> Done'); //mod_suti.js:24
} //mod_suti.js:25

register_module(new function() { //mod_suti.js:27
	this.name = 'suti'; //mod_suti.js:28
	this.optional = true; //mod_suti.js:29
	this.enabled = false; //mod_suti.js:30
	this.short_description = 'Szerencsesüti gomb Infó menübe mozgatása'; //mod_suti.js:31
	this.long_description = 'Ha túl sok frissed vagy üzeneted van, akkor nem fér el a Lepke gomb, és szétcsúszik a megjelenítés. A szerencsesüti gomb elrejtésével elég hely szabadul fel, hogy elférjen a Lepke. Hogy ne maradj süti nélkül, az Infó menüben megtalálod a napi csemegét. :)'; //mod_suti.js:32
	this.setup = suti__setup; //mod_suti.js:33
}); //mod_suti.js:34
//#include "mod_marker.js"

//=============================================================================
// Egyebek
//=============================================================================

function main() { //Lepke.main.js:87
	if(lepke__get_user()=='') //Lepke.main.js:88
	{ //Lepke.main.js:89
		console.log('User menu cannot be found, exiting...'); //Lepke.main.js:90
		return; //Lepke.main.js:91
	} //Lepke.main.js:92

	console.log('Start setup of '+lepke__modules_id.length+' modules'); //Lepke.main.js:94
	for(var id = 0; id<lepke__modules_id.length; id++) { //Lepke.main.js:95
		var mod = lepke__modules_id[id]; //Lepke.main.js:96
		console.log('Setup module '+mod.name); //Lepke.main.js:97
		if(!mod.optional || mod.enabled) //Lepke.main.js:98
		{ //Lepke.main.js:99
			mod.setup(); //Lepke.main.js:100
		} else { //Lepke.main.js:101
			console.log('> Disabled'); //Lepke.main.js:102
		} //Lepke.main.js:103
	} //Lepke.main.js:104
} //Lepke.main.js:105

if(typeof WScript !== 'undefined') { //Lepke.main.js:107
	WScript.Echo('Ne kozvetlenul inditsd el a fajlt, hanem kovesd a telepitesi utmutatot!'); //Lepke.main.js:108
} else { //Lepke.main.js:109
	console.log('Adding listener to DOMContentLoaded...'); //Lepke.main.js:110
	window.addEventListener('DOMContentLoaded', main); //Lepke.main.js:111
} //Lepke.main.js:112

// VÉGE
