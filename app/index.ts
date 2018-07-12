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

import * as generate from './generate'
import * as player from './player'
import { loadJSON } from './load'
import { getHistory, isPage, clearHistory } from './history'

let showsTopBtn = false; // variable that shows if the to top button is visible
let headerHeight = 100;  // default height of the header (different on larger screens)

let markup: any, translations: any;


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
	var pel = generate.p(markup[0].description)
	pel.classList.add("ingress")
	content.appendChild(pel)
	for (var view of markup) {
		content.appendChild(generate.generateMenuItem(view.title, view.image, () => {
			isPage = "program"
			generate.generateProgramPage(view, loadMenu)
			goToTop()
		}))
	}
	content.appendChild(generate.generateMenyItem2(translations['T_HISTORY'], translations['T_HISTORY_SHORT'], 'history', loadHistory))
	content.appendChild(generate.generateMenyItem2(translations['T_CONTACT'], translations['T_CONTACT_SHORT'], 'contact', loadContact))

	var mainHeader = '<a onclick="loadInfo();" id="home">Norea Sverige</a>';
	var header = document.getElementById("header");
	header.innerHTML = mainHeader;
	header.style.borderBottom = "1px solid #774";
}

function loadContact() {
	isPage = 'contact';
	let newHeader = generate.generateProgramPageHeader(translations.T_CONTACT, '', loadMenu)
	let header = document.getElementById("header")
	generate.renderTo(header, newHeader)
	header.style.background = "#eaeaea"
	header.style.borderBottom = "1px solid #ccc"

	const content = document.getElementById("content")
	content.innerHTML = `
		<p>${translations.T_CONTACT_SHORT}</p>
		<p class="tel">SMS: <a href="sms:+46733127823">0733 - 127 823</a></p>
		<form id="contact-form">
		<p>${translations.T_NAME}:</p>
		<input type="text" name="namn">
		<p>${translations.T_EMAIL}:</p>
		<input type="text" name="email">
		<p>${translations.T_MESSAGE}:</p>
		<textarea type="text" name="meddelande"></textarea
		</form>
		<button class="submit" onclick="submitContact(event)">${translations.T_SEND}</button>
	`;
	goToTop()
}

// get all data in form and return object
function getFormData() {
	var elements = (document.getElementById("contact-form") as HTMLFormElement).elements as any; // all form elements
	var fields = Object.keys(elements).map(k => {
		if (elements[k].name !== undefined) {
			return elements[k].name;
			// special case for Edge's html collection
		} else if (elements[k].length > 0) {
			return elements[k].item(0).name;
		}
	}).filter(function (item, pos, self) {
		return self.indexOf(item) == pos && item;
	});
	var data: any = {};
	fields.forEach(function (k) {
		data[k] = elements[k].value;
		if (elements[k].type === "checkbox") {
			data[k] = elements[k].checked;
			// special case for Edge's html collection
		} else if (elements[k].length) {
			for (var i = 0; i < elements[k].length; i++) {
				if (elements[k].item(i).checked) {
					data[k] = elements[k].item(i).value;
				}
			}
		}
	});
	return data;
}

function submitContact(event: Event) {  // handles form submit withtout any jquery
	event.preventDefault();           // we are submitting via xhr below
	var data = getFormData();         // get the values submitted in the form
	loadMenu()
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://script.google.com/macros/s/AKfycbyWIkMeGN9pP_drv_vYqRYQ_iHeTNDBuT5wQ9b0Lmil90Pf6xQ/exec');
	// xhr.withCredentials = true;
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = () => {
		return;
	};
	// url encode form data for sending as post data
	var encoded = Object.keys(data).map(k => {
		return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
	}).join('&')
	xhr.send(encoded);
}

window['submitContact'] = submitContact

/* loads track history */
function loadHistory() {
	isPage = "history";
	goToTop();

	let newHeader = generate.generateProgramPageHeader(translations.T_HISTORY, '', loadMenu)
	var header = document.getElementById("header");
	generate.renderTo(header, newHeader)
	header.style["background"] = "#eaeaea";
	header.style.borderBottom = "1px solid #ccc";

	let newContent = []
	let history = getHistory()
	if (history != "") {
		//loadHistory(); // updates history page
		newContent.push(generate.renderTo(generate.createElement('a', {onclick: () => {clearHistory(); loadHistory()}}),
			generate.h2(translations.T_HISTORY_CLEAR)
		))
	}
	else {
		newContent.push(generate.h2(translations.T_HISTORY_EMPTY))
	}
	const content = document.getElementById("content")
	generate.renderTo(content, ...newContent)
	for (var i = history.length - 1; i >= 0; i--) {
		content.appendChild(generate.generateAudioLink(history[i], () => {
			if (isPage == "history") {
				loadHistory();
			}
		}))
	}
}

/*--------------------------------------------*/
/* 4. content generating and fetching helpers */
/*--------------------------------------------*/

/* generates the HTML for a hide box */
function makeHideBox(content: string, action: string) {
	return '<div id="hidebox" class="hide" title="" onclick="' + action + '"><div id="textbox">' + content + '</div><div id="overlay" class="show"></div></div>';
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
		document.getElementById('header').style.paddingTop = "20px";
	}

	document.addEventListener("backbutton", onBackButton, false); // firen when the Android back button is clicked

	/* sets a top margin to the "content" container to prevent the header from hiding the content */
	var headerStyle = window.getComputedStyle(document.getElementById('header'));
	headerHeight = parseInt(headerStyle.getPropertyValue('height')) + parseInt(headerStyle.getPropertyValue('padding-top'));
	document.getElementById('content').style.marginTop = headerHeight + "px";

	/* hides the splash screen (everything visible on the start page is done by now) */
	cordova.exec(null, null, "SplashScreen", "hide", []);
	cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	window.addEventListener('native.keyboardshow', () => document.body.classList.add("keyboard-open"));
	window.addEventListener('native.keyboardhide', () => document.body.classList.remove("keyboard-open"));
}

/* handles Android backbutton event */
function onBackButton() {
	if (isPage == "main") {
		if (player.isPlaying) {
			player.playPause();
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

function selectLanguage(lang: string) {
	const languageSelector = document.getElementById("language-selector")
	languageSelector.classList.remove("show")
	setTimeout(() => languageSelector.style.display = 'none', 600)
	localStorage['language'] = lang
	let json = loadJSON(`data/views_${lang}.json`)
	markup = json["views"]
	translations = json["translations"]
	document.body.className = lang
	loadMenu()
}

function showLanguageSelectScreen() {
	const languageSelector = document.getElementById("language-selector")
	setTimeout(() => languageSelector.classList.add("show"))
	languageSelector.style.webkitDisplay = ''
	languageSelector.style.display = ''
}

window['showLanguageSelectScreen'] = showLanguageSelectScreen
window['selectLanguage'] = selectLanguage

function main() {
	let lang = localStorage["language"]
	if (lang) {
		document.getElementById("language-selector").style.display = 'none'
		let json = loadJSON(`data/views_${lang}.json`)
		markup = json["views"]
		translations = json["translations"]
		loadMenu()
		document.body.className = lang
	} else {
		showLanguageSelectScreen()
	}

	/* setting a timeout function to clear the way for a redrawing of DOM */
	setTimeout(player.setUp)
	document.addEventListener("scroll", onScroll, false);         // fires when the user is scrolling
}