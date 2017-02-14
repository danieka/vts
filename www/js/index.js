
/*---------------------------------------------------*/
/* INDEX                                             */
/* 1. global variables                               */
/* 2. initial loading                                */
/* 3. functions for loading pages                    */
/* 4. content generating and fetching helpers        */
/* 5. actions (gets called by other functions)       */
/* 6. functions for adding event listeners           */
/* 7. event handlers (gets fired directly by events) */
/*---------------------------------------------------*/


/*---------------------*/
/* 1. global variables */
/*---------------------*/

var isPlaying = false;   // variable that shows if the player is playing
var showsTopBtn = false; // variable that shows if the to top button is visible
var isPage = "";         // variable that contains the name of the active page
var headerHeight = 100;  // default height of the header (different on larger screens)
var footerHeight = 64;   // default footer height (different on larger screens)

var markup, translations;


/*--------------------*/
/* 2. initial loading */
/*--------------------*/
if (document != undefined) {
	document.addEventListener("deviceready", onDeviceReady, false);
	main()
}


/*--------------------------------*/
/* 3. functions for loading pages */
/*--------------------------------*/

/* loads main menu */
function loadMenu() {
	isPage = "main";

	var content = document.getElementById("content")
	content.innerHTML = "";
	for (var view of markup) {
		content.appendChild(generateMenuItem(view))
	}
	content.appendChild(generateMenyItem2(translations['T_HISTORY'], translations['T_HISTORY_SHORT'], 'history', loadHistory))
	content.appendChild(generateMenyItem2(translations['T_CONTACT'], translations['T_CONTACT_SHORT'], 'contact', loadContact))
	
	var mainHeader = '<a onclick="loadInfo();" id="home">Norea Sverige</a>';
	var header = document.getElementById("header");
	header.innerHTML = mainHeader;
	header.style["border-bottom"] = "1px solid #774";
}

/* loads "Norea Sverige" info */
function loadInfo() {
	isPage = "info";
	goToTop();

	var newHeader = '<a onclick="loadMenu();" id="back">Tillbaka till menyn</a>' +
		'<h1 id="norea" class="headerLogo">Om Norea Sverige</h1>' +
		'<a onclick="goToTop();" id="toTop">Tillbaka till toppen</a>';
	var header = document.getElementById("header");
	header.innerHTML = newHeader;
	header.style["background"] = "#eaeaea";
	header.style["border-bottom"] = "1px solid #ccc";

	var info = '<div id="textbox"><p>' +
		'<b>Norea Sverige</b> är en fristående missions&shy;organisation som vill sprida budskapet om Jesus med hjälp av media. Du kan lyssna till våra programserier via radio, internet eller direkt i din mobil genom vår app. Programmen går också att beställa på CD-skivor eller USB-minne.' +
		'</p><p>' +
		'För att nå så många som möjligt är appen gratis, men allt har ju en kostnad... Vill du vara med och bidra till utvecklingen av nya programserier? Swisha en gåva, sätt in pengar på vårt PlusGiro-konto eller ge med kort på vår hemsida!' +
		'</p><p>' +
		'Swish: <i>1235142054</i><br/>' +
		'PlusGiro: <i>52 41 80-7</i><br/>' +
		'Webb: <i>noreasverige.se</i><br/>' +
		'</p><p>' +
		'För mer info om Norea eller för att beställa våra program så finns vi här:' +
		'</p><p>' +
		'<b>Norea Sverige</b><br/>' +
		'Östergatan 20<br/>' +
		'262 31 Ängelholm<br/>' +
		'</p><p>' +
		'Telefon: <i>0431-414750</i><br/>' +
		'Epost: <i>norea@noreasverige.se</i>' +
		'</p></div>';
	document.getElementById("content").innerHTML = info;
}

function loadContact() {
	isPage = 'contact';
	goToTop()
}

/* loads track history */
function loadHistory() {
	isPage = "history";
	goToTop();

	var newHeader = `<a onclick="loadMenu();" id="back">Tillbaka till menyn</a>
		<h1 id="history" class="headerLogo">Historik</h1>
		<a onclick="goToTop();" id="toTop"></a>`
	var header = document.getElementById("header");
	header.innerHTML = newHeader;
	header.style["background"] = "#eaeaea";
	header.style["border-bottom"] = "1px solid #ccc";

	var newContent = `<div id="textbox"><p>${translations["T_HISTORY_LONG"]}</p></div>`
	var history = getHistory();
	console.error(history)
	if (history != "") {
		newContent += `<a onclick="clearHistory();" id="back"><h2>${ translations["T_HISTORY_CLEAR"]}</h2></a>`;
	}
	else {
		newContent += `<h2>${ translations["T_HISTORY_EMPTY"]}</h2>`;
	}
	const content = document.getElementById("content")
	content.innerHTML = newContent;
	for (var i = history.length - 1; i >= 0; i--) {
		content.appendChild(generateAudioLink(history[i]))
	}
}

/*--------------------------------------------*/
/* 4. content generating and fetching helpers */
/*--------------------------------------------*/

// Load JSON text from server hosted file and return JSON parsed object
function loadJSON(filePath) {
  // Load json file;
  console.error(filePath)
  var json = loadTextFileAjaxSync(filePath, "application/json");
  // Parse json
  console.log(json)
  return JSON.parse(json);
}   

// Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileAjaxSync(filePath, mimeType)
{
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open("GET",filePath,false);
  if (mimeType != null) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();
  if (xmlhttp.status==200)
  {
    return xmlhttp.responseText;
  }
  else {
    // TODO Throw exception
    return null;
  }
}

/* generates the HTML for a hide box */
function makeHideBox(content, action) {
	return '<div id="hidebox" class="hide" title="" onclick="' + action + '"><div id="textbox">' + content + '</div><div id="overlay" class="show"></div></div>';
}


/* fetches player history */
function getHistory() {
	if (window.localStorage.getItem('history') != null) {
		return JSON.parse(window.localStorage.getItem('history'));
	}
	else {
		return "";
	}
}

/* generates time in minutes and seconds */
function ms(seconds) {
	if (isNaN(seconds)) {
		return '00:00';
	}
	else {
		var m = Math.floor(seconds / 60);
		var s = Math.floor(seconds % 60);
		return ((m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s);
	}
}


/*---------------------------------------------*/
/* 5. actions (gets called by other functions) */
/*---------------------------------------------*/

/* shows the "to top" button */
function showToTopBtn() {
	document.getElementById("toTop").style["display"] = "block";
	document.getElementsByClassName("headerLogo")[0].style["display"] = "none";
	showsTopBtn = true;
}

/* hides the "to top" button */
function hideToTopBtn() {
	document.getElementById("toTop").style["display"] = "none";
	document.getElementsByClassName("headerLogo")[0].style["display"] = "block";
	showsTopBtn = false;
}

/* scrolls to top of page */
function goToTop() {
	window.scrollTo(0, 0);
}


/*---------------------------------------------------*/
/* 7. event handlers (gets fired directly by events) */
/*---------------------------------------------------*/

/* Handle device specific setup, not run on desktop */
function onDeviceReady() {
	/* checks if we need to compensate for iOS status bar */
	if (window.device.platform.toLowerCase() == "ios" && parseFloat(window.device.version) >= 7.0) {
		document.getElementById('header').style['padding-top'] = "20px";
	}

	document.addEventListener("backbutton", onBackButton, false); // firen when the Android back button is clicked

	/* sets a top margin to the "content" container to prevent the header from hiding the content */
	var headerStyle = window.getComputedStyle(document.getElementById('header'));
	headerHeight = parseInt(headerStyle.getPropertyValue('height')) + parseInt(headerStyle.getPropertyValue('padding-top'));
	document.getElementById('content').style['margin-top'] = headerHeight + "px";

	/* hides the splash screen (everything visible on the start page is done by now) */
	cordova.exec(null, null, "SplashScreen", "hide", []);
}

/* handles Android backbutton event */
function onBackButton() {
	if (isPage == "main") {
		if (isPlaying) {
			playPause();
		}
		navigator.app.exitApp();
	}
	else {
		loadMenu();
	}
}

/* decides if the "to top" button should be changed */
function onScroll() {
	if (isPage != "main") { // there is no "to top" button on the front page
		if (window.scrollY > 500) {
			if (!showsTopBtn) { // prevents changing style at every scroll event call
				showToTopBtn();
			}
		}
		else if (showsTopBtn) { // prevents changing style at every scroll event call
			hideToTopBtn();
		}
	}
}

/* gets called when a track ends */
function onEnded() {
	closeFooter();
	isPlaying = false;
}

function selectLanguage(lang) {
	const languageSelector = document.getElementById("language-selector")
	languageSelector.classList.remove("show")
	setTimeout(() => languageSelector.style.display = 'none', 600)
	localStorage['language'] = lang
	let json = loadJSON(`./data/views_${ lang }.json`)
	markup = json["views"]
	translations = json["translations"]
	loadMenu()
}

function showLanguageSelectScreen() {
	const languageSelector = document.getElementById("language-selector")
	languageSelector.classList.add("show")
	languageSelector.style.display = 'flex'
}

function main() {
	lang = localStorage["language"]
	if (lang) {
		let json = loadJSON(`./data/views_${ lang }.json`)
		markup = json["views"]
		translations = json["translations"]
		loadMenu()
	} else {
		showLanguageSelectScreen()
	}

	/* setting a timeout function to clear the way for a redrawing of DOM */
	setTimeout(function () {
		/* calculates the footerHeight variable so that it can be used later */
		var footerStyle = window.getComputedStyle(document.getElementById('footer'));
		footerHeight = parseInt(footerStyle.getPropertyValue('height'));

		document.addEventListener("scroll", onScroll, false);         // fires when the user is scrolling
		addScrubberListener();                                        // adds listeners for scrubber bar
	}, 0);
}