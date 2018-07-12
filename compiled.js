"use strict";

function createTextNode(type, text) {
	var ret = document.createElement(type);
	ret.innerHTML = text;
	return ret;
}

createH1 = createTextNode.bind(null, "h1");
createP = createTextNode.bind(null, "p");

h1 = createH1;
p = createP;

function createElement(type, options) {
	var ret = document.createElement(arguments[0]);
	for (var key in options) {
		ret[key] = options[key];
	}
	return ret;
}

var a = createElement.bind(null, "a");
var div = createElement.bind(null, "div");

function generateMenyItem2(title, ingress, domid, load) {
	var link = renderTo(a(), h1(title), p(ingress));
	link.onclick = load;
	link.id = domid;

	var d = div();
	d.classList.add('center');
	return renderTo(d, link);
}

function generateMenuItem(markup) {
	var div = document.createElement("div");
	div.classList.add("center");

	var a = document.createElement("a");
	a.onclick = function () {
		generateProgramPage(markup);
		goToTop();
	};
	a.style.backgroundImage = "url(./img/" + markup.image + ")";

	var title = createH1(markup.title);

	div.appendChild(a);
	a.appendChild(title);

	return div;
}

function removeChildren(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function generateTextBox(description) {
	var div = document.createElement("div");
	div.classList.add("textbox");

	var text = createP(description);
	renderTo(div, text);
	return div;
}

function generateProgramPageHeader(title, image) {
	var container = document.createElement("div");
	var back = document.createElement("a");
	back.id = "back";
	back.onclick = loadMenu;
	back.innerText = "Tillbaka till menyn";

	var title = createH1(title);
	title.classList.add("headerLogo");
	title.style.backgroundImage = "url(./img/" + image + ")";
	var goToTop = document.createElement("a");
	goToTop.id = "toTop";
	goToTop.onclick = function () {
		return window.scrollTo(0, 0);
	};
	goToTop.innerText = "Tillbaka till toppen";

	container.appendChild(back);
	container.appendChild(title);
	container.appendChild(goToTop);

	return container;
}

function renderTo(root) {
	try {
		removeChildren(root);
		var elements = Array.from(arguments).slice(1);
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var element = _step.value;

				root.appendChild(element);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	} catch (err) {
		console.error("Error", err, "\nwhen rendering", arguments);
	}
	return root;
}

function generateAudioLink(track) {
	var link = a({
		onclick: playTrack.bind(null, track.nr, track.title, track.url),
		className: "track"
	});

	var tr = div({
		className: "nr",
		innerText: track.nr
	});

	var title = div({
		className: "title",
		innerText: track.title
	});

	return renderTo(link, tr, title);
}

function generateProgramPage(markup) {
	isPage = "program";
	var newHeader = generateProgramPageHeader(markup.title, markup.image);
	var header = document.getElementById("header");
	renderTo(header, newHeader);
	header.style["background"] = "#eaeaea";
	header.style["border-bottom"] = "1px solid #ccc";

	renderTo(document.getElementById("content"), generateProgramListing(markup.shortName));
}

function generateProgramListing(shortName) {
	json = loadJSON("data/programs/" + shortName + ".json", function (content) {
		program = JSON.parse(content);
	});
	var programs = [];
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = json[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var programEntry = _step2.value;

			console.log(generateAudioLink(programEntry));
			programs.push(generateAudioLink(programEntry));
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	var container = document.createElement("div");
	renderTo.apply(this, [container].concat(programs));
	return container;
}
"use strict";

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

var isPlaying = false; // variable that shows if the player is playing
var showsTopBtn = false; // variable that shows if the to top button is visible
var isPage = ""; // variable that contains the name of the active page
var headerHeight = 100; // default height of the header (different on larger screens)
var footerHeight = 64; // default footer height (different on larger screens)

var markup, translations;

/*--------------------*/
/* 2. initial loading */
/*--------------------*/
if (document != undefined) {
	document.addEventListener("deviceready", onDeviceReady, false);
	main();
}

/*--------------------------------*/
/* 3. functions for loading pages */
/*--------------------------------*/

/* loads main menu */
function loadMenu() {
	isPage = "main";

	var content = document.getElementById("content");
	content.innerHTML = "";
	var pel = p(markup[0].description);
	pel.classList.add("ingress");
	content.appendChild(pel);
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = markup[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var view = _step.value;

			content.appendChild(generateMenuItem(view));
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	content.appendChild(generateMenyItem2(translations['T_HISTORY'], translations['T_HISTORY_SHORT'], 'history', loadHistory));
	content.appendChild(generateMenyItem2(translations['T_CONTACT'], translations['T_CONTACT_SHORT'], 'contact', loadContact));

	var mainHeader = '<a onclick="loadInfo();" id="home">Norea Sverige</a>';
	var header = document.getElementById("header");
	header.innerHTML = mainHeader;
	header.style["border-bottom"] = "1px solid #774";
}

function loadContact() {
	isPage = 'contact';
	var newHeader = "<a onclick=\"loadMenu();\" id=\"back\"></a>\n\t\t<h1 id=\"history\" class=\"headerLogo\">" + translations.T_CONTACT + "</h1>\n\t\t<a onclick=\"goToTop();\" id=\"toTop\"></a>";
	var header = document.getElementById("header");
	header.innerHTML = newHeader;
	header.style["background"] = "#eaeaea";
	header.style["border-bottom"] = "1px solid #ccc";

	var content = document.getElementById("content");
	content.innerHTML = "\n\t\t<p>" + translations.T_CONTACT_SHORT + "</p>\n\t\t<p class=\"tel\">SMS: <a href=\"tel:+46733127823\">0733 - 127 823</a></p>\n\t\t<form id=\"contact\">\n\t\t<p>" + translations.T_NAME + ":</p>\n\t\t<input type=\"text\" name=\"namn\">\n\t\t<p>" + translations.T_EMAIL + ":</p>\n\t\t<input type=\"text\" name=\"email\">\n\t\t<p>" + translations.T_MESSAGE + ":</p>\n\t\t<textarea type=\"text\" name=\"meddelande\"></textarea\n\t\t</form>\n\t\t<button class=\"submit\" onclick=\"submitContact(event)\">" + translations.T_SEND + "</button>\n\t";
	goToTop();
}

// get all data in form and return object
function getFormData() {
	var elements = document.getElementById("contact").elements; // all form elements
	var fields = Object.keys(elements).map(function (k) {
		if (elements[k].name !== undefined) {
			return elements[k].name;
			// special case for Edge's html collection
		} else if (elements[k].length > 0) {
			return elements[k].item(0).name;
		}
	}).filter(function (item, pos, self) {
		return self.indexOf(item) == pos && item;
	});
	var data = {};
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

function submitContact(event) {
	// handles form submit withtout any jquery
	event.preventDefault(); // we are submitting via xhr below
	var data = getFormData(); // get the values submitted in the form
	loadMenu();
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://script.google.com/macros/s/AKfycbyWIkMeGN9pP_drv_vYqRYQ_iHeTNDBuT5wQ9b0Lmil90Pf6xQ/exec');
	// xhr.withCredentials = true;
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function () {
		return;
	};
	// url encode form data for sending as post data
	var encoded = Object.keys(data).map(function (k) {
		return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
	}).join('&');
	xhr.send(encoded);
}

/* loads track history */
function loadHistory() {
	isPage = "history";
	goToTop();

	var newHeader = "<a onclick=\"loadMenu();\" id=\"back\"></a>\n\t\t<h1 id=\"history\" class=\"headerLogo\">Historik</h1>\n\t\t<a onclick=\"goToTop();\" id=\"toTop\"></a>";
	var header = document.getElementById("header");
	header.innerHTML = newHeader;
	header.style["background"] = "#eaeaea";
	header.style["border-bottom"] = "1px solid #ccc";

	var newContent = "<div id=\"textbox\"><p>" + translations["T_HISTORY_LONG"] + "</p></div>";
	var history = getHistory();
	if (history != "") {
		newContent += "<a onclick=\"clearHistory();\" id=\"back\"><h2>" + translations["T_HISTORY_CLEAR"] + "</h2></a>";
	} else {
		newContent += "<h2>" + translations["T_HISTORY_EMPTY"] + "</h2>";
	}
	var content = document.getElementById("content");
	content.innerHTML = newContent;
	for (var i = history.length - 1; i >= 0; i--) {
		content.appendChild(generateAudioLink(history[i]));
	}
}

/*--------------------------------------------*/
/* 4. content generating and fetching helpers */
/*--------------------------------------------*/

// Load JSON text from server hosted file and return JSON parsed object
function loadJSON(filePath) {
	// Load json file;
	console.error(filePath);
	var json = loadTextFileAjaxSync(filePath, "application/json");
	// Parse json
	return JSON.parse(json);
}

// Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileAjaxSync(filePath, mimeType) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	if (mimeType != null) {
		if (xmlhttp.overrideMimeType) {
			xmlhttp.overrideMimeType(mimeType);
		}
	}
	xmlhttp.send();
	return xmlhttp.responseText;
}

/* generates the HTML for a hide box */
function makeHideBox(content, action) {
	return '<div id="hidebox" class="hide" title="" onclick="' + action + '"><div id="textbox">' + content + '</div><div id="overlay" class="show"></div></div>';
}

/* fetches player history */
function getHistory() {
	if (window.localStorage.getItem('history') != null) {
		return JSON.parse(window.localStorage.getItem('history'));
	} else {
		return "";
	}
}

/* generates time in minutes and seconds */
function ms(seconds) {
	if (isNaN(seconds)) {
		return '00:00';
	} else {
		var m = Math.floor(seconds / 60);
		var s = Math.floor(seconds % 60);
		return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
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
	} else {
		loadMenu();
	}
}

/* decides if the "to top" button should be changed */
function onScroll() {
	if (isPage != "main") {
		// there is no "to top" button on the front page
		if (window.scrollY > 500) {
			if (!showsTopBtn) {
				// prevents changing style at every scroll event call
				showToTopBtn();
			}
		} else if (showsTopBtn) {
			// prevents changing style at every scroll event call
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
	var languageSelector = document.getElementById("language-selector");
	languageSelector.classList.remove("show");
	setTimeout(function () {
		return languageSelector.style.display = 'none';
	}, 600);
	localStorage['language'] = lang;
	var json = loadJSON("data/views_" + lang + ".json");
	markup = json["views"];
	translations = json["translations"];
	document.body.className = lang;
	loadMenu();
}

function showLanguageSelectScreen() {
	var languageSelector = document.getElementById("language-selector");
	setTimeout(function () {
		return languageSelector.classList.add("show");
	});
	languageSelector.style.display = 'flex';
}

function main() {
	lang = localStorage["language"];
	if (lang) {
		document.getElementById("language-selector").style.display = 'none';
		var json = loadJSON("data/views_" + lang + ".json");
		markup = json["views"];
		translations = json["translations"];
		loadMenu();
		document.body.className = lang;
	} else {
		showLanguageSelectScreen();
	}

	/* setting a timeout function to clear the way for a redrawing of DOM */
	setTimeout(function () {
		/* calculates the footerHeight variable so that it can be used later */
		var footerStyle = window.getComputedStyle(document.getElementById('footer'));
		footerHeight = parseInt(footerStyle.getPropertyValue('height'));

		document.addEventListener("scroll", onScroll, false); // fires when the user is scrolling
		addScrubberListener(); // adds listeners for scrubber bar
	}, 0);
}
"use strict";

/* puts a track in the player and plays it */
function playTrack(nr, title, url) {
	resetPlayer();
	if (typeof device != "undefined" && navigator.network.connection.type == Connection.NONE) {
		showError("Uppkoppling saknas");
	} else {
		document.getElementById("playerBox").innerHTML = '<audio id="player" src="' + url + '" preload="metadata" type="audio/mpeg"></audio>'; // puts the html audio tag into the playerBox
		playPause(); // start initial playback
		addPlaybackListener(); // add playback listeners
		showFooter(); // make the player visible
		document.getElementById("programinfo").innerHTML = title;
		var trackObj = { "nr": nr, "title": title, "url": url };
		storeHistory(trackObj);
		if (isPage == "history") {
			loadHistory();
		}
	}
}

/* resets the player interface */
function resetPlayer() {
	document.getElementById("progressBar").style.width = '0px';
	document.getElementById("played").innerHTML = '00:00';
	document.getElementById("duration").innerHTML = '00:00';
}

/* updates progress bar */
function updateProgress() {
	var player = document.getElementById("player");

	document.getElementById("duration").innerHTML = ms(player.duration);
	document.getElementById("played").innerHTML = ms(player.currentTime);

	var percent = 100 * (player.currentTime / player.duration);
	document.getElementById("progressBar").style.width = percent + '%';
}

/* toggles play and pause */
function playPause() {
	player = document.getElementById("player");
	if (player.paused) {
		player.play();
		showPauseButton();
	} else {
		player.pause();
		showPlayButton();
	}
}

/* shows pause button */
function showPauseButton() {
	document.getElementById("pause").style.display = 'block';
	document.getElementById("play").style.display = 'none';
	document.getElementById("closeFooter").style.display = 'none';
	isPlaying = true;
}

/* shows play button */
function showPlayButton() {
	document.getElementById("pause").style.display = 'none';
	document.getElementById("play").style.display = 'block';
	document.getElementById("closeFooter").style.display = 'block';
	isPlaying = false;
}

/* shows the footer where the player is */
function showFooter() {
	document.getElementById("content").style["margin-bottom"] = footerHeight - 50 + "px"; // adds extra margin at the bottom
	document.getElementById("error").style["display"] = "none"; // hides error message
	document.getElementById("footer").style["display"] = "block"; // shows footer
	document.getElementById("language-footer").style.display = 'none';
}

/* closes the footer */
function closeFooter() {
	document.getElementById("content").style["margin-bottom"] = "0px"; // removes extra margin at the bottom
	document.getElementById("footer").style["display"] = "none"; // hides footer
	document.getElementById("playerBox").innerHTML = ''; // removes audio tag from content
	document.getElementById("language-footer").style.display = 'flex';
}

/* shows the error message */
function showError(text) {
	document.getElementById("errorText").innerHTML = text; // changes the error message
	document.getElementById("content").style["margin-bottom"] = footerHeight + "px"; // adds extra margin at the bottom
	document.getElementById("footer").style["display"] = "none"; // hides footer containing the player
	document.getElementById("error").style["display"] = "block"; // shows error message
}

/* closes the error message */
function closeError() {
	document.getElementById("content").style["margin-bottom"] = "0px"; // removes extra margin at the bottom
	document.getElementById("error").style["display"] = "none"; // hides error message
}

/* updates the player currentTime to the mouse X position */
function moveTimeTo(mouseX) {
	var width = document.getElementById("scrubber").offsetWidth;
	var percent = mouseX / width;
	var player = document.getElementById("player");
	player.currentTime = player.duration * percent;
}

/* stores history in local storage */
function storeHistory(track) {
	var history = getHistory();
	if (history != "") {
		if (history.length > 99) {
			history.shift();
		}
		history.push(track);
	} else {
		history = [track];
	}
	window.localStorage.setItem('history', JSON.stringify(history));
}

/* deletes history tracks from local storage */
function clearHistory() {
	window.localStorage.removeItem('history');
	loadHistory(); // updates history page
}

/* adds listeners for click and drag to the scrubber bar */
function addScrubberListener() {
	var scrubber = document.getElementById("scrubber");

	scrubber.addEventListener("click", function (e) {
		var mouseX = e.clientX - footerHeight;
		if (mouseX > 0) {
			moveTimeTo(mouseX);
		}
	});

	scrubber.addEventListener("touchmove", function (e) {
		var mouseX = e.changedTouches[0].clientX - footerHeight;
		if (mouseX > 0) {
			// pausing on scrubb makes it snappier
			if (isPlaying) {
				player = document.getElementById("player");
				player.pause();
				moveTimeTo(mouseX);
				player.play();
			} else {
				moveTimeTo(mouseX);
			}
		}
		e.preventDefault();
	}, false);
}

/* adds event listeners for player events */
function addPlaybackListener() {
	var player = document.getElementById("player");

	/* when player updates progress time */
	player.addEventListener("timeupdate", function () {
		updateProgress();
	}, false);

	/* when there is an error */
	player.addEventListener("error", function (e) {
		switch (e.target.error.code) {
			case e.target.error.MEDIA_ERR_ABORTED:
				showError("Uppspelningen avbröts");
				break;
			case e.target.error.MEDIA_ERR_NETWORK:
				showError("Nätverksfel");
				break;
			case e.target.error.MEDIA_ERR_DECODE:
				showError("Kunde inte avkoda");
				break;
			case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
				showError("Källan stöds inte");
				break;
			default:
				showError("Fel vid uppspelning");
				break;
		}
	}, false);

	player.addEventListener("ended", onEnded); // when track ends
}
