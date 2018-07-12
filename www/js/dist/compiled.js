(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var load_1 = require("./load");
var player_1 = require("./player");
function createTextNode(type, text) {
    var ret = document.createElement(type);
    ret.innerHTML = text;
    return ret;
}
exports.h1 = function (title) { return createTextNode("h1", title); };
exports.h2 = function (title) { return createTextNode("h2", title); };
exports.p = function (text) { return createTextNode("p", text); };
function createElement(type, options) {
    var ret = document.createElement(arguments[0]);
    for (var key in options) {
        ret[key] = options[key];
    }
    return ret;
}
exports.createElement = createElement;
var a = createElement.bind(null, "a");
var div = createElement.bind(null, "div");
function generateMenyItem2(title, ingress, domid, load) {
    var link = renderTo(a(), exports.h1(title), exports.p(ingress));
    link.onclick = load;
    link.id = domid;
    var d = div();
    d.classList.add('center');
    return renderTo(d, link);
}
exports.generateMenyItem2 = generateMenyItem2;
function generateMenuItem(title, imageURL, onClick) {
    var div = document.createElement("div");
    div.classList.add("center");
    var a = document.createElement("a");
    a.onclick = onClick;
    a.style.backgroundImage = "url(./img/" + imageURL + ")";
    var titleEl = exports.h1(title);
    div.appendChild(a);
    a.appendChild(titleEl);
    return div;
}
exports.generateMenuItem = generateMenuItem;
function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
exports.removeChildren = removeChildren;
function generateTextBox(description) {
    var div = document.createElement("div");
    div.classList.add("textbox");
    var text = exports.p(description);
    renderTo(div, text);
    return div;
}
exports.generateTextBox = generateTextBox;
function generateProgramPageHeader(title, image, loadMenu) {
    var container = document.createElement("div");
    var back = document.createElement("a");
    back.id = "back";
    back.onclick = loadMenu;
    back.innerText = "Tillbaka till menyn";
    var titleEl = exports.h1(title);
    titleEl.classList.add("headerLogo");
    titleEl.style.backgroundImage = "url(./img/" + image + ")";
    var goToTop = document.createElement("a");
    goToTop.id = "toTop";
    goToTop.onclick = function () { return window.scrollTo(0, 0); };
    goToTop.innerText = "Tillbaka till toppen";
    container.appendChild(back);
    container.appendChild(titleEl);
    container.appendChild(goToTop);
    return container;
}
exports.generateProgramPageHeader = generateProgramPageHeader;
function renderTo(root) {
    var elements = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        elements[_i - 1] = arguments[_i];
    }
    try {
        removeChildren(root);
        for (var _a = 0, elements_1 = elements; _a < elements_1.length; _a++) {
            var element = elements_1[_a];
            root.appendChild(element);
        }
    }
    catch (err) {
        console.error("Error", err, "\nwhen rendering", arguments);
    }
    return root;
}
exports.renderTo = renderTo;
function generateAudioLink(track, onPlay) {
    var link = a({
        onclick: function () { player_1.playTrack(track.nr, track.title, track.url); if (onPlay) {
            onPlay();
        } },
        className: "track",
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
exports.generateAudioLink = generateAudioLink;
function generateProgramPage(markup, loadMenu) {
    var newHeader = generateProgramPageHeader(markup.title, markup.image, loadMenu);
    var header = document.getElementById("header");
    renderTo(header, newHeader);
    header.style["background"] = "#eaeaea";
    header.style.borderBottom = "1px solid #ccc";
    renderTo(document.getElementById("content"), generateProgramListing(markup.shortName));
}
exports.generateProgramPage = generateProgramPage;
function generateProgramListing(shortName) {
    var json = load_1.loadJSON("data/programs/" + shortName + ".json");
    var programs = [];
    for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
        var programEntry = json_1[_i];
        console.log(generateAudioLink(programEntry));
        programs.push(generateAudioLink(programEntry));
    }
    var container = document.createElement("div");
    renderTo.apply(void 0, [container].concat(programs));
    return container;
}
exports.generateProgramListing = generateProgramListing;

},{"./load":4,"./player":5}],2:[function(require,module,exports){
"use strict";
/* fetches player history */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPage = '';
function getHistory() {
    if (window.localStorage.getItem('history') != null) {
        return JSON.parse(window.localStorage.getItem('history'));
    }
    else {
        return "";
    }
}
exports.getHistory = getHistory;
/* stores history in local storage */
function storeHistory(track) {
    if (exports.isPage == 'history') {
        return;
    }
    var history = getHistory();
    if (history != "") {
        if (history.length > 99) {
            history.shift();
        }
        history.push(track);
    }
    else {
        history = [track];
    }
    window.localStorage.setItem('history', JSON.stringify(history));
}
exports.storeHistory = storeHistory;
function clearHistory() {
    window.localStorage.removeItem('history');
}
exports.clearHistory = clearHistory;

},{}],3:[function(require,module,exports){
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
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------*/
/* 1. global variables */
/*---------------------*/
var generate = require("./generate");
var player = require("./player");
var load_1 = require("./load");
var history_1 = require("./history");
var showsTopBtn = false; // variable that shows if the to top button is visible
var headerHeight = 100; // default height of the header (different on larger screens)
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
    history_1.isPage = "main";
    var content = document.getElementById("content");
    content.innerHTML = "";
    var pel = generate.p(markup[0].description);
    pel.classList.add("ingress");
    content.appendChild(pel);
    for (var _i = 0, markup_1 = markup; _i < markup_1.length; _i++) {
        var view = markup_1[_i];
        content.appendChild(generate.generateMenuItem(view.title, view.image, function () {
            history_1.isPage = "program";
            generate.generateProgramPage(view, loadMenu);
            goToTop();
        }));
    }
    content.appendChild(generate.generateMenyItem2(translations['T_HISTORY'], translations['T_HISTORY_SHORT'], 'history', loadHistory));
    content.appendChild(generate.generateMenyItem2(translations['T_CONTACT'], translations['T_CONTACT_SHORT'], 'contact', loadContact));
    var mainHeader = '<a onclick="loadInfo();" id="home">Norea Sverige</a>';
    var header = document.getElementById("header");
    header.innerHTML = mainHeader;
    header.style.borderBottom = "1px solid #774";
}
function loadContact() {
    history_1.isPage = 'contact';
    var newHeader = generate.generateProgramPageHeader(translations.T_CONTACT, '', loadMenu);
    var header = document.getElementById("header");
    generate.renderTo(header, newHeader);
    header.style.background = "#eaeaea";
    header.style.borderBottom = "1px solid #ccc";
    var content = document.getElementById("content");
    content.innerHTML = "\n\t\t<p>" + translations.T_CONTACT_SHORT + "</p>\n\t\t<p class=\"tel\">SMS: <a href=\"sms:+46733127823\">0733 - 127 823</a></p>\n\t\t<form id=\"contact-form\">\n\t\t<p>" + translations.T_NAME + ":</p>\n\t\t<input type=\"text\" name=\"namn\">\n\t\t<p>" + translations.T_EMAIL + ":</p>\n\t\t<input type=\"text\" name=\"email\">\n\t\t<p>" + translations.T_MESSAGE + ":</p>\n\t\t<textarea type=\"text\" name=\"meddelande\"></textarea\n\t\t</form>\n\t\t<button class=\"submit\" onclick=\"submitContact(event)\">" + translations.T_SEND + "</button>\n\t";
    goToTop();
}
// get all data in form and return object
function getFormData() {
    var elements = document.getElementById("contact-form").elements; // all form elements
    var fields = Object.keys(elements).map(function (k) {
        if (elements[k].name !== undefined) {
            return elements[k].name;
            // special case for Edge's html collection
        }
        else if (elements[k].length > 0) {
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
        }
        else if (elements[k].length) {
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
window['submitContact'] = submitContact;
/* loads track history */
function loadHistory() {
    history_1.isPage = "history";
    goToTop();
    var newHeader = generate.generateProgramPageHeader(translations.T_HISTORY, '', loadMenu);
    var header = document.getElementById("header");
    generate.renderTo(header, newHeader);
    header.style["background"] = "#eaeaea";
    header.style.borderBottom = "1px solid #ccc";
    var newContent = [];
    var history = history_1.getHistory();
    if (history != "") {
        //loadHistory(); // updates history page
        newContent.push(generate.renderTo(generate.createElement('a', { onclick: function () { history_1.clearHistory(); loadHistory(); } }), generate.h2(translations.T_HISTORY_CLEAR)));
    }
    else {
        newContent.push(generate.h2(translations.T_HISTORY_EMPTY));
    }
    var content = document.getElementById("content");
    generate.renderTo.apply(generate, [content].concat(newContent));
    for (var i = history.length - 1; i >= 0; i--) {
        content.appendChild(generate.generateAudioLink(history[i], function () {
            if (history_1.isPage == "history") {
                loadHistory();
            }
        }));
    }
}
/*--------------------------------------------*/
/* 4. content generating and fetching helpers */
/*--------------------------------------------*/
/* generates the HTML for a hide box */
function makeHideBox(content, action) {
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
    window.addEventListener('native.keyboardshow', function () { return document.body.classList.add("keyboard-open"); });
    window.addEventListener('native.keyboardhide', function () { return document.body.classList.remove("keyboard-open"); });
}
/* handles Android backbutton event */
function onBackButton() {
    if (history_1.isPage == "main") {
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
    if (history_1.isPage != "main") {
        if (window.scrollY > 500) {
            if (!showsTopBtn) {
                showToTopBtn();
            }
        }
        else if (showsTopBtn) {
            hideToTopBtn();
        }
    }
}
function selectLanguage(lang) {
    var languageSelector = document.getElementById("language-selector");
    languageSelector.classList.remove("show");
    setTimeout(function () { return languageSelector.style.display = 'none'; }, 600);
    localStorage['language'] = lang;
    var json = load_1.loadJSON("data/views_" + lang + ".json");
    markup = json["views"];
    translations = json["translations"];
    document.body.className = lang;
    loadMenu();
}
function showLanguageSelectScreen() {
    var languageSelector = document.getElementById("language-selector");
    setTimeout(function () { return languageSelector.classList.add("show"); });
    languageSelector.style.webkitDisplay = '';
    languageSelector.style.display = '';
}
window['showLanguageSelectScreen'] = showLanguageSelectScreen;
window['selectLanguage'] = selectLanguage;
function main() {
    var lang = localStorage["language"];
    if (lang) {
        document.getElementById("language-selector").style.display = 'none';
        var json = load_1.loadJSON("data/views_" + lang + ".json");
        markup = json["views"];
        translations = json["translations"];
        loadMenu();
        document.body.className = lang;
    }
    else {
        showLanguageSelectScreen();
    }
    /* setting a timeout function to clear the way for a redrawing of DOM */
    setTimeout(player.setUp);
    document.addEventListener("scroll", onScroll, false); // fires when the user is scrolling
}

},{"./generate":1,"./history":2,"./load":4,"./player":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Load JSON text from server hosted file and return JSON parsed object
function loadJSON(filePath) {
    // Load json file;
    console.error(filePath);
    var json = loadTextFileAjaxSync(filePath, "application/json");
    // Parse json
    return JSON.parse(json);
}
exports.loadJSON = loadJSON;
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

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("./history");
exports.isPlaying = false;
var footerHeight = 64; // default footer height (different on larger screens)
/* puts a track in the player and plays it */
function playTrack(nr, title, url) {
    resetPlayer();
    if (typeof device != "undefined" && navigator.network.connection.type == Connection.NONE) {
        showError("Uppkoppling saknas");
    }
    else {
        document.getElementById("playerBox").innerHTML = '<audio id="player" src="' + url + '" preload="metadata" type="audio/mpeg"></audio>'; // puts the html audio tag into the playerBox
        playPause(); // start initial playback
        addPlaybackListener(); // add playback listeners
        showFooter(); // make the player visible
        document.getElementById("programinfo").innerHTML = title;
        var trackObj = { "nr": nr, "title": title, "url": url };
        history_1.storeHistory(trackObj);
    }
}
exports.playTrack = playTrack;
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
    var player = document.getElementById("player");
    if (player.paused) {
        player.play();
        showPauseButton();
    }
    else {
        player.pause();
        showPlayButton();
    }
}
exports.playPause = playPause;
window['playPause'] = playPause;
/* shows pause button */
function showPauseButton() {
    document.getElementById("pause").style.display = 'block';
    document.getElementById("play").style.display = 'none';
    document.getElementById("closeFooter").style.display = 'none';
    exports.isPlaying = true;
}
/* shows play button */
function showPlayButton() {
    document.getElementById("pause").style.display = 'none';
    document.getElementById("play").style.display = 'block';
    document.getElementById("closeFooter").style.display = 'block';
    exports.isPlaying = false;
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
    document.getElementById("language-footer").style.display = '';
    document.getElementById("language-footer").style.display = '';
}
window['closeFooter'] = closeFooter;
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
            if (exports.isPlaying) {
                player = document.getElementById("player");
                player.pause();
                moveTimeTo(mouseX);
                player.play();
            }
            else {
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
/* gets called when a track ends */
function onEnded() {
    closeFooter();
    exports.isPlaying = false;
}
function setUp() {
    /* calculates the footerHeight variable so that it can be used later */
    var footerStyle = window.getComputedStyle(document.getElementById('footer'));
    var footerHeight = parseInt(footerStyle.getPropertyValue('height'));
    addScrubberListener();
}
exports.setUp = setUp;

},{"./history":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvZ2VuZXJhdGUudHMiLCJhcHAvaGlzdG9yeS50cyIsImFwcC9pbmRleC50cyIsImFwcC9sb2FkLnRzIiwiYXBwL3BsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsK0JBQWlDO0FBQ2pDLG1DQUFvQztBQUVwQyx3QkFBd0IsSUFBWSxFQUFFLElBQVk7SUFDakQsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN0QyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtJQUNwQixNQUFNLENBQUMsR0FBRyxDQUFBO0FBQ1gsQ0FBQztBQUVVLFFBQUEsRUFBRSxHQUFHLFVBQUMsS0FBYSxJQUFLLE9BQUEsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQTtBQUNuRCxRQUFBLEVBQUUsR0FBRyxVQUFDLEtBQWEsSUFBSyxPQUFBLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQTNCLENBQTJCLENBQUE7QUFDbkQsUUFBQSxDQUFDLEdBQUcsVUFBQyxJQUFZLElBQUssT0FBQSxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUF6QixDQUF5QixDQUFBO0FBRTFELHVCQUE4QixJQUFZLEVBQUUsT0FBWTtJQUNwRCxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzlDLEdBQUcsQ0FBQSxDQUFDLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDckIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUMzQixDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQTtBQUNkLENBQUM7QUFORCxzQ0FNQztBQUVELElBQUksQ0FB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LENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQjtnQkFDOUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQy9CLEtBQUssQ0FBQztZQUNQO2dCQUNDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUNqQyxLQUFLLENBQUM7UUFDUixDQUFDO0lBQ0YsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRVYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLGtCQUFrQjtBQUM5RCxDQUFDO0FBRUQsbUNBQW1DO0FBQ25DO0lBQ0MsV0FBVyxFQUFFLENBQUM7SUFDZCxpQkFBUyxHQUFHLEtBQUssQ0FBQztBQUNuQixDQUFDO0FBRUQ7SUFDQyx1RUFBdUU7SUFDdEUsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM3RSxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDcEUsbUJBQW1CLEVBQUUsQ0FBQztBQUN4QixDQUFDO0FBTEQsc0JBS0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgbG9hZEpTT04gfSBmcm9tICcuL2xvYWQnXG5pbXBvcnQgeyBwbGF5VHJhY2sgfSBmcm9tICcuL3BsYXllcidcblxuZnVuY3Rpb24gY3JlYXRlVGV4dE5vZGUodHlwZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcblx0bGV0IHJldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSlcblx0cmV0LmlubmVySFRNTCA9IHRleHRcblx0cmV0dXJuIHJldFxufVxuXG5leHBvcnQgbGV0IGgxID0gKHRpdGxlOiBzdHJpbmcpID0+IGNyZWF0ZVRleHROb2RlKFwiaDFcIiwgdGl0bGUpXG5leHBvcnQgbGV0IGgyID0gKHRpdGxlOiBzdHJpbmcpID0+IGNyZWF0ZVRleHROb2RlKFwiaDJcIiwgdGl0bGUpXG5leHBvcnQgbGV0IHAgPSAodGV4dDogc3RyaW5nKSA9PiBjcmVhdGVUZXh0Tm9kZShcInBcIiwgdGV4dClcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZTogc3RyaW5nLCBvcHRpb25zOiBhbnkpIHtcbiAgICBsZXQgcmV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhcmd1bWVudHNbMF0pXG4gICAgZm9yKGxldCBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXRba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgIH1cbiAgICByZXR1cm4gcmV0XG59XG5cbmxldCBhID0gY3JlYXRlRWxlbWVudC5iaW5kKG51bGwsIFwiYVwiKVxubGV0IGRpdiA9IGNyZWF0ZUVsZW1lbnQuYmluZChudWxsLCBcImRpdlwiKVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU1lbnlJdGVtMih0aXRsZTogc3RyaW5nLCBpbmdyZXNzOiBzdHJpbmcsIGRvbWlkOiBzdHJpbmcsIGxvYWQ6IEZ1bmN0aW9uKSB7XG5cdGxldCBsaW5rID0gcmVuZGVyVG8oYSgpLFxuXHRcdFx0aDEodGl0bGUpLFxuXHRcdFx0cChpbmdyZXNzKSlcblx0bGluay5vbmNsaWNrID0gbG9hZCBhcyBhbnlcblx0bGluay5pZCA9IGRvbWlkXG5cblx0bGV0IGQgPSBkaXYoKVxuXHRkLmNsYXNzTGlzdC5hZGQoJ2NlbnRlcicpXG5cdHJldHVybiByZW5kZXJUbyhkLCBsaW5rKVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU1lbnVJdGVtKHRpdGxlOiBzdHJpbmcsIGltYWdlVVJMOiBzdHJpbmcsIG9uQ2xpY2s6IEZ1bmN0aW9uKSB7XG5cdGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG5cdGRpdi5jbGFzc0xpc3QuYWRkKFwiY2VudGVyXCIpXG5cblx0bGV0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuICAgIGEub25jbGljayA9IG9uQ2xpY2sgYXMgYW55XG5cdGEuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoLi9pbWcvXCIgKyBpbWFnZVVSTCArIFwiKVwiXG5cdFxuXG5cdGxldCB0aXRsZUVsID0gaDEodGl0bGUpXG5cblx0ZGl2LmFwcGVuZENoaWxkKGEpXG5cdGEuYXBwZW5kQ2hpbGQodGl0bGVFbClcblxuXHRyZXR1cm4gZGl2XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVDaGlsZHJlbihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIHdoaWxlIChlbGVtZW50LmZpcnN0Q2hpbGQpIHtcblx0XHRlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuZmlyc3RDaGlsZCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVGV4dEJveChkZXNjcmlwdGlvbjogc3RyaW5nKSB7XG5cdGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG5cdGRpdi5jbGFzc0xpc3QuYWRkKFwidGV4dGJveFwiKVxuXG5cdGxldCB0ZXh0ID0gcChkZXNjcmlwdGlvbilcblx0cmVuZGVyVG8oZGl2LCB0ZXh0KVxuXHRyZXR1cm4gZGl2XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUHJvZ3JhbVBhZ2VIZWFkZXIodGl0bGU6IHN0cmluZywgaW1hZ2U6IHN0cmluZywgbG9hZE1lbnU6IEZ1bmN0aW9uKSB7XG5cdGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG5cdGxldCBiYWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcblx0YmFjay5pZCA9IFwiYmFja1wiXG5cdGJhY2sub25jbGljayA9IGxvYWRNZW51IGFzIGFueVxuXHRiYWNrLmlubmVyVGV4dCA9IFwiVGlsbGJha2EgdGlsbCBtZW55blwiXG5cblx0bGV0IHRpdGxlRWwgPSBoMSh0aXRsZSlcblx0dGl0bGVFbC5jbGFzc0xpc3QuYWRkKFwiaGVhZGVyTG9nb1wiKVxuXHR0aXRsZUVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKC4vaW1nL1wiICsgaW1hZ2UgKyBcIilcIlxuXHRsZXQgZ29Ub1RvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXG5cdGdvVG9Ub3AuaWQgPSBcInRvVG9wXCJcblx0Z29Ub1RvcC5vbmNsaWNrID0gKCkgPT4gd2luZG93LnNjcm9sbFRvKDAsIDApXG5cdGdvVG9Ub3AuaW5uZXJUZXh0ID0gXCJUaWxsYmFrYSB0aWxsIHRvcHBlblwiXG5cblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKGJhY2spXG5cdGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZUVsKVxuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQoZ29Ub1RvcClcblxuXHRyZXR1cm4gY29udGFpbmVyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJUbyhyb290OiBIVE1MRWxlbWVudCwgLi4uZWxlbWVudHM6IEhUTUxFbGVtZW50W10pIHtcbiAgICB0cnkge1xuICAgICAgICByZW1vdmVDaGlsZHJlbihyb290KVxuICAgICAgICBmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoZWxlbWVudClcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3JcIiwgZXJyLCBcIlxcbndoZW4gcmVuZGVyaW5nXCIsIGFyZ3VtZW50cylcbiAgICB9XG4gICAgcmV0dXJuIHJvb3Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlQXVkaW9MaW5rKHRyYWNrLCBvblBsYXk/OiBGdW5jdGlvbikge1xuXHRsZXQgbGluayA9IGEoe1xuXHRcdG9uY2xpY2s6ICgpID0+IHtwbGF5VHJhY2sodHJhY2subnIsIHRyYWNrLnRpdGxlLCB0cmFjay51cmwpOyBpZihvblBsYXkpIHtvblBsYXkoKX19LFxuXHRcdGNsYXNzTmFtZTogXCJ0cmFja1wiLFxuXHR9KVxuXG5cdGxldCB0ciA9IGRpdih7XG5cdFx0Y2xhc3NOYW1lOiBcIm5yXCIsXG5cdFx0aW5uZXJUZXh0OiB0cmFjay5uclxuXHR9KVxuXG5cdGxldCB0aXRsZSA9IGRpdih7XG5cdFx0Y2xhc3NOYW1lOiBcInRpdGxlXCIsXG5cdFx0aW5uZXJUZXh0OiB0cmFjay50aXRsZVxuXHR9KVxuXG5cdHJldHVybiByZW5kZXJUbyhsaW5rLCB0ciwgdGl0bGUpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVByb2dyYW1QYWdlKG1hcmt1cCwgbG9hZE1lbnU6IEZ1bmN0aW9uKSB7XG5cdGxldCBuZXdIZWFkZXIgPSBnZW5lcmF0ZVByb2dyYW1QYWdlSGVhZGVyKG1hcmt1cC50aXRsZSwgbWFya3VwLmltYWdlLCBsb2FkTWVudSlcblx0bGV0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVhZGVyXCIpO1xuXHRyZW5kZXJUbyhoZWFkZXIsIG5ld0hlYWRlcilcblx0aGVhZGVyLnN0eWxlW1wiYmFja2dyb3VuZFwiXSA9IFwiI2VhZWFlYVwiO1xuXHRoZWFkZXIuc3R5bGUuYm9yZGVyQm90dG9tID0gXCIxcHggc29saWQgI2NjY1wiO1xuXG5cdHJlbmRlclRvKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKSxcblx0XHRnZW5lcmF0ZVByb2dyYW1MaXN0aW5nKG1hcmt1cC5zaG9ydE5hbWUpKVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVByb2dyYW1MaXN0aW5nKHNob3J0TmFtZTogc3RyaW5nKSB7XG5cdGxldCBqc29uID0gbG9hZEpTT04oXCJkYXRhL3Byb2dyYW1zL1wiICsgc2hvcnROYW1lICsgXCIuanNvblwiKTtcblx0bGV0IHByb2dyYW1zOiBIVE1MRWxlbWVudFtdID0gW11cblx0Zm9yIChsZXQgcHJvZ3JhbUVudHJ5IG9mIGpzb24pIHtcblx0XHRjb25zb2xlLmxvZyhnZW5lcmF0ZUF1ZGlvTGluayhwcm9ncmFtRW50cnkpKVxuXHRcdHByb2dyYW1zLnB1c2goZ2VuZXJhdGVBdWRpb0xpbmsocHJvZ3JhbUVudHJ5KSlcblx0fVxuXHRsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuXHRyZW5kZXJUbyhjb250YWluZXIsIC4uLnByb2dyYW1zKVxuXHRyZXR1cm4gY29udGFpbmVyXG59XG4iLCIvKiBmZXRjaGVzIHBsYXllciBoaXN0b3J5ICovXG5cbmV4cG9ydCBsZXQgaXNQYWdlID0gJydcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhpc3RvcnkoKSB7XG5cdGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2hpc3RvcnknKSAhPSBudWxsKSB7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdoaXN0b3J5JykpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG59XG5cbi8qIHN0b3JlcyBoaXN0b3J5IGluIGxvY2FsIHN0b3JhZ2UgKi9cbmV4cG9ydCBmdW5jdGlvbiBzdG9yZUhpc3RvcnkodHJhY2spIHtcbiAgICBpZiAoaXNQYWdlID09ICdoaXN0b3J5Jykge1xuICAgICAgICByZXR1cm5cbiAgICB9XG5cdHZhciBoaXN0b3J5ID0gZ2V0SGlzdG9yeSgpO1xuXHRpZiAoaGlzdG9yeSAhPSBcIlwiKSB7XG5cdFx0aWYgKGhpc3RvcnkubGVuZ3RoID4gOTkpIHtcblx0XHRcdGhpc3Rvcnkuc2hpZnQoKTtcblx0XHR9XG5cdFx0aGlzdG9yeS5wdXNoKHRyYWNrKTtcblx0fVxuXHRlbHNlIHtcblx0XHRoaXN0b3J5ID0gW3RyYWNrXTtcblx0fVxuXHR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2hpc3RvcnknLCBKU09OLnN0cmluZ2lmeShoaXN0b3J5KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckhpc3RvcnkoKSB7XG5cdHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnaGlzdG9yeScpO1xufSIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qIElOREVYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbi8qIDEuIGdsb2JhbCB2YXJpYWJsZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbi8qIDIuIGluaXRpYWwgbG9hZGluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbi8qIDMuIGZ1bmN0aW9ucyBmb3IgbG9hZGluZyBwYWdlcyAgICAgICAgICAgICAgICAgICAgKi9cbi8qIDQuIGNvbnRlbnQgZ2VuZXJhdGluZyBhbmQgZmV0Y2hpbmcgaGVscGVycyAgICAgICAgKi9cbi8qIDUuIGFjdGlvbnMgKGdldHMgY2FsbGVkIGJ5IG90aGVyIGZ1bmN0aW9ucykgICAgICAgKi9cbi8qIDYuIGZ1bmN0aW9ucyBmb3IgYWRkaW5nIGV2ZW50IGxpc3RlbmVycyAgICAgICAgICAgKi9cbi8qIDcuIGV2ZW50IGhhbmRsZXJzIChnZXRzIGZpcmVkIGRpcmVjdGx5IGJ5IGV2ZW50cykgKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKiAxLiBnbG9iYWwgdmFyaWFibGVzICovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmltcG9ydCAqIGFzIGdlbmVyYXRlIGZyb20gJy4vZ2VuZXJhdGUnXG5pbXBvcnQgKiBhcyBwbGF5ZXIgZnJvbSAnLi9wbGF5ZXInXG5pbXBvcnQgeyBsb2FkSlNPTiB9IGZyb20gJy4vbG9hZCdcbmltcG9ydCB7IGdldEhpc3RvcnksIGlzUGFnZSwgY2xlYXJIaXN0b3J5IH0gZnJvbSAnLi9oaXN0b3J5J1xuXG5sZXQgc2hvd3NUb3BCdG4gPSBmYWxzZTsgLy8gdmFyaWFibGUgdGhhdCBzaG93cyBpZiB0aGUgdG8gdG9wIGJ1dHRvbiBpcyB2aXNpYmxlXG5sZXQgaGVhZGVySGVpZ2h0ID0gMTAwOyAgLy8gZGVmYXVsdCBoZWlnaHQgb2YgdGhlIGhlYWRlciAoZGlmZmVyZW50IG9uIGxhcmdlciBzY3JlZW5zKVxuXG5sZXQgbWFya3VwOiBhbnksIHRyYW5zbGF0aW9uczogYW55O1xuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyogMi4gaW5pdGlhbCBsb2FkaW5nICovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmlmIChkb2N1bWVudCAhPSB1bmRlZmluZWQpIHtcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZXJlYWR5XCIsIG9uRGV2aWNlUmVhZHksIGZhbHNlKTtcblx0bWFpbigpXG59XG5cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKiAzLiBmdW5jdGlvbnMgZm9yIGxvYWRpbmcgcGFnZXMgKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKiBsb2FkcyBtYWluIG1lbnUgKi9cbmZ1bmN0aW9uIGxvYWRNZW51KCkge1xuXHRpc1BhZ2UgPSBcIm1haW5cIjtcblxuXHR2YXIgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKVxuXHRjb250ZW50LmlubmVySFRNTCA9IFwiXCI7XG5cdHZhciBwZWwgPSBnZW5lcmF0ZS5wKG1hcmt1cFswXS5kZXNjcmlwdGlvbilcblx0cGVsLmNsYXNzTGlzdC5hZGQoXCJpbmdyZXNzXCIpXG5cdGNvbnRlbnQuYXBwZW5kQ2hpbGQocGVsKVxuXHRmb3IgKHZhciB2aWV3IG9mIG1hcmt1cCkge1xuXHRcdGNvbnRlbnQuYXBwZW5kQ2hpbGQoZ2VuZXJhdGUuZ2VuZXJhdGVNZW51SXRlbSh2aWV3LnRpdGxlLCB2aWV3LmltYWdlLCAoKSA9PiB7XG5cdFx0XHRpc1BhZ2UgPSBcInByb2dyYW1cIlxuXHRcdFx0Z2VuZXJhdGUuZ2VuZXJhdGVQcm9ncmFtUGFnZSh2aWV3LCBsb2FkTWVudSlcblx0XHRcdGdvVG9Ub3AoKVxuXHRcdH0pKVxuXHR9XG5cdGNvbnRlbnQuYXBwZW5kQ2hpbGQoZ2VuZXJhdGUuZ2VuZXJhdGVNZW55SXRlbTIodHJhbnNsYXRpb25zWydUX0hJU1RPUlknXSwgdHJhbnNsYXRpb25zWydUX0hJU1RPUllfU0hPUlQnXSwgJ2hpc3RvcnknLCBsb2FkSGlzdG9yeSkpXG5cdGNvbnRlbnQuYXBwZW5kQ2hpbGQoZ2VuZXJhdGUuZ2VuZXJhdGVNZW55SXRlbTIodHJhbnNsYXRpb25zWydUX0NPTlRBQ1QnXSwgdHJhbnNsYXRpb25zWydUX0NPTlRBQ1RfU0hPUlQnXSwgJ2NvbnRhY3QnLCBsb2FkQ29udGFjdCkpXG5cblx0dmFyIG1haW5IZWFkZXIgPSAnPGEgb25jbGljaz1cImxvYWRJbmZvKCk7XCIgaWQ9XCJob21lXCI+Tm9yZWEgU3ZlcmlnZTwvYT4nO1xuXHR2YXIgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkZXJcIik7XG5cdGhlYWRlci5pbm5lckhUTUwgPSBtYWluSGVhZGVyO1xuXHRoZWFkZXIuc3R5bGUuYm9yZGVyQm90dG9tID0gXCIxcHggc29saWQgIzc3NFwiO1xufVxuXG5mdW5jdGlvbiBsb2FkQ29udGFjdCgpIHtcblx0aXNQYWdlID0gJ2NvbnRhY3QnO1xuXHRsZXQgbmV3SGVhZGVyID0gZ2VuZXJhdGUuZ2VuZXJhdGVQcm9ncmFtUGFnZUhlYWRlcih0cmFuc2xhdGlvbnMuVF9DT05UQUNULCAnJywgbG9hZE1lbnUpXG5cdGxldCBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlYWRlclwiKVxuXHRnZW5lcmF0ZS5yZW5kZXJUbyhoZWFkZXIsIG5ld0hlYWRlcilcblx0aGVhZGVyLnN0eWxlLmJhY2tncm91bmQgPSBcIiNlYWVhZWFcIlxuXHRoZWFkZXIuc3R5bGUuYm9yZGVyQm90dG9tID0gXCIxcHggc29saWQgI2NjY1wiXG5cblx0Y29uc3QgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKVxuXHRjb250ZW50LmlubmVySFRNTCA9IGBcblx0XHQ8cD4ke3RyYW5zbGF0aW9ucy5UX0NPTlRBQ1RfU0hPUlR9PC9wPlxuXHRcdDxwIGNsYXNzPVwidGVsXCI+U01TOiA8YSBocmVmPVwic21zOis0NjczMzEyNzgyM1wiPjA3MzMgLSAxMjcgODIzPC9hPjwvcD5cblx0XHQ8Zm9ybSBpZD1cImNvbnRhY3QtZm9ybVwiPlxuXHRcdDxwPiR7dHJhbnNsYXRpb25zLlRfTkFNRX06PC9wPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1uXCI+XG5cdFx0PHA+JHt0cmFuc2xhdGlvbnMuVF9FTUFJTH06PC9wPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiPlxuXHRcdDxwPiR7dHJhbnNsYXRpb25zLlRfTUVTU0FHRX06PC9wPlxuXHRcdDx0ZXh0YXJlYSB0eXBlPVwidGV4dFwiIG5hbWU9XCJtZWRkZWxhbmRlXCI+PC90ZXh0YXJlYVxuXHRcdDwvZm9ybT5cblx0XHQ8YnV0dG9uIGNsYXNzPVwic3VibWl0XCIgb25jbGljaz1cInN1Ym1pdENvbnRhY3QoZXZlbnQpXCI+JHt0cmFuc2xhdGlvbnMuVF9TRU5EfTwvYnV0dG9uPlxuXHRgO1xuXHRnb1RvVG9wKClcbn1cblxuLy8gZ2V0IGFsbCBkYXRhIGluIGZvcm0gYW5kIHJldHVybiBvYmplY3RcbmZ1bmN0aW9uIGdldEZvcm1EYXRhKCkge1xuXHR2YXIgZWxlbWVudHMgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWN0LWZvcm1cIikgYXMgSFRNTEZvcm1FbGVtZW50KS5lbGVtZW50cyBhcyBhbnk7IC8vIGFsbCBmb3JtIGVsZW1lbnRzXG5cdHZhciBmaWVsZHMgPSBPYmplY3Qua2V5cyhlbGVtZW50cykubWFwKGsgPT4ge1xuXHRcdGlmIChlbGVtZW50c1trXS5uYW1lICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50c1trXS5uYW1lO1xuXHRcdFx0Ly8gc3BlY2lhbCBjYXNlIGZvciBFZGdlJ3MgaHRtbCBjb2xsZWN0aW9uXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50c1trXS5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gZWxlbWVudHNba10uaXRlbSgwKS5uYW1lO1xuXHRcdH1cblx0fSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtLCBwb3MsIHNlbGYpIHtcblx0XHRyZXR1cm4gc2VsZi5pbmRleE9mKGl0ZW0pID09IHBvcyAmJiBpdGVtO1xuXHR9KTtcblx0dmFyIGRhdGE6IGFueSA9IHt9O1xuXHRmaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuXHRcdGRhdGFba10gPSBlbGVtZW50c1trXS52YWx1ZTtcblx0XHRpZiAoZWxlbWVudHNba10udHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG5cdFx0XHRkYXRhW2tdID0gZWxlbWVudHNba10uY2hlY2tlZDtcblx0XHRcdC8vIHNwZWNpYWwgY2FzZSBmb3IgRWRnZSdzIGh0bWwgY29sbGVjdGlvblxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudHNba10ubGVuZ3RoKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzW2tdLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50c1trXS5pdGVtKGkpLmNoZWNrZWQpIHtcblx0XHRcdFx0XHRkYXRhW2tdID0gZWxlbWVudHNba10uaXRlbShpKS52YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cdHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBzdWJtaXRDb250YWN0KGV2ZW50OiBFdmVudCkgeyAgLy8gaGFuZGxlcyBmb3JtIHN1Ym1pdCB3aXRodG91dCBhbnkganF1ZXJ5XG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICAgICAvLyB3ZSBhcmUgc3VibWl0dGluZyB2aWEgeGhyIGJlbG93XG5cdHZhciBkYXRhID0gZ2V0Rm9ybURhdGEoKTsgICAgICAgICAvLyBnZXQgdGhlIHZhbHVlcyBzdWJtaXR0ZWQgaW4gdGhlIGZvcm1cblx0bG9hZE1lbnUoKVxuXHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHhoci5vcGVuKCdQT1NUJywgJ2h0dHBzOi8vc2NyaXB0Lmdvb2dsZS5jb20vbWFjcm9zL3MvQUtmeWNieVdJa01lR045cFBfZHJ2X3ZZcVJZUV9pSGVUTkRCdVQ1d1E5YjBMbWlsOTBQZjZ4US9leGVjJyk7XG5cdC8vIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXHR4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuXHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuXHRcdHJldHVybjtcblx0fTtcblx0Ly8gdXJsIGVuY29kZSBmb3JtIGRhdGEgZm9yIHNlbmRpbmcgYXMgcG9zdCBkYXRhXG5cdHZhciBlbmNvZGVkID0gT2JqZWN0LmtleXMoZGF0YSkubWFwKGsgPT4ge1xuXHRcdHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoaykgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVtrXSlcblx0fSkuam9pbignJicpXG5cdHhoci5zZW5kKGVuY29kZWQpO1xufVxuXG53aW5kb3dbJ3N1Ym1pdENvbnRhY3QnXSA9IHN1Ym1pdENvbnRhY3RcblxuLyogbG9hZHMgdHJhY2sgaGlzdG9yeSAqL1xuZnVuY3Rpb24gbG9hZEhpc3RvcnkoKSB7XG5cdGlzUGFnZSA9IFwiaGlzdG9yeVwiO1xuXHRnb1RvVG9wKCk7XG5cblx0bGV0IG5ld0hlYWRlciA9IGdlbmVyYXRlLmdlbmVyYXRlUHJvZ3JhbVBhZ2VIZWFkZXIodHJhbnNsYXRpb25zLlRfSElTVE9SWSwgJycsIGxvYWRNZW51KVxuXHR2YXIgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkZXJcIik7XG5cdGdlbmVyYXRlLnJlbmRlclRvKGhlYWRlciwgbmV3SGVhZGVyKVxuXHRoZWFkZXIuc3R5bGVbXCJiYWNrZ3JvdW5kXCJdID0gXCIjZWFlYWVhXCI7XG5cdGhlYWRlci5zdHlsZS5ib3JkZXJCb3R0b20gPSBcIjFweCBzb2xpZCAjY2NjXCI7XG5cblx0bGV0IG5ld0NvbnRlbnQgPSBbXVxuXHRsZXQgaGlzdG9yeSA9IGdldEhpc3RvcnkoKVxuXHRpZiAoaGlzdG9yeSAhPSBcIlwiKSB7XG5cdFx0Ly9sb2FkSGlzdG9yeSgpOyAvLyB1cGRhdGVzIGhpc3RvcnkgcGFnZVxuXHRcdG5ld0NvbnRlbnQucHVzaChnZW5lcmF0ZS5yZW5kZXJUbyhnZW5lcmF0ZS5jcmVhdGVFbGVtZW50KCdhJywge29uY2xpY2s6ICgpID0+IHtjbGVhckhpc3RvcnkoKTsgbG9hZEhpc3RvcnkoKX19KSxcblx0XHRcdGdlbmVyYXRlLmgyKHRyYW5zbGF0aW9ucy5UX0hJU1RPUllfQ0xFQVIpXG5cdFx0KSlcblx0fVxuXHRlbHNlIHtcblx0XHRuZXdDb250ZW50LnB1c2goZ2VuZXJhdGUuaDIodHJhbnNsYXRpb25zLlRfSElTVE9SWV9FTVBUWSkpXG5cdH1cblx0Y29uc3QgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKVxuXHRnZW5lcmF0ZS5yZW5kZXJUbyhjb250ZW50LCAuLi5uZXdDb250ZW50KVxuXHRmb3IgKHZhciBpID0gaGlzdG9yeS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdGNvbnRlbnQuYXBwZW5kQ2hpbGQoZ2VuZXJhdGUuZ2VuZXJhdGVBdWRpb0xpbmsoaGlzdG9yeVtpXSwgKCkgPT4ge1xuXHRcdFx0aWYgKGlzUGFnZSA9PSBcImhpc3RvcnlcIikge1xuXHRcdFx0XHRsb2FkSGlzdG9yeSgpO1xuXHRcdFx0fVxuXHRcdH0pKVxuXHR9XG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyogNC4gY29udGVudCBnZW5lcmF0aW5nIGFuZCBmZXRjaGluZyBoZWxwZXJzICovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyogZ2VuZXJhdGVzIHRoZSBIVE1MIGZvciBhIGhpZGUgYm94ICovXG5mdW5jdGlvbiBtYWtlSGlkZUJveChjb250ZW50OiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nKSB7XG5cdHJldHVybiAnPGRpdiBpZD1cImhpZGVib3hcIiBjbGFzcz1cImhpZGVcIiB0aXRsZT1cIlwiIG9uY2xpY2s9XCInICsgYWN0aW9uICsgJ1wiPjxkaXYgaWQ9XCJ0ZXh0Ym94XCI+JyArIGNvbnRlbnQgKyAnPC9kaXY+PGRpdiBpZD1cIm92ZXJsYXlcIiBjbGFzcz1cInNob3dcIj48L2Rpdj48L2Rpdj4nO1xufVxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKiA1LiBhY3Rpb25zIChnZXRzIGNhbGxlZCBieSBvdGhlciBmdW5jdGlvbnMpICovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8qIHNob3dzIHRoZSBcInRvIHRvcFwiIGJ1dHRvbiAqL1xuZnVuY3Rpb24gc2hvd1RvVG9wQnRuKCkge1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvVG9wXCIpLnN0eWxlW1wiZGlzcGxheVwiXSA9IFwiYmxvY2tcIjtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImhlYWRlckxvZ29cIilbMF0uc3R5bGVbXCJkaXNwbGF5XCJdID0gXCJub25lXCI7XG5cdHNob3dzVG9wQnRuID0gdHJ1ZTtcbn1cblxuLyogaGlkZXMgdGhlIFwidG8gdG9wXCIgYnV0dG9uICovXG5mdW5jdGlvbiBoaWRlVG9Ub3BCdG4oKSB7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9Ub3BcIikuc3R5bGVbXCJkaXNwbGF5XCJdID0gXCJub25lXCI7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJoZWFkZXJMb2dvXCIpWzBdLnN0eWxlW1wiZGlzcGxheVwiXSA9IFwiYmxvY2tcIjtcblx0c2hvd3NUb3BCdG4gPSBmYWxzZTtcbn1cblxuLyogc2Nyb2xscyB0byB0b3Agb2YgcGFnZSAqL1xuZnVuY3Rpb24gZ29Ub1RvcCgpIHtcblx0d2luZG93LnNjcm9sbFRvKDAsIDApO1xufVxuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qIDcuIGV2ZW50IGhhbmRsZXJzIChnZXRzIGZpcmVkIGRpcmVjdGx5IGJ5IGV2ZW50cykgKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyogSGFuZGxlIGRldmljZSBzcGVjaWZpYyBzZXR1cCwgbm90IHJ1biBvbiBkZXNrdG9wICovXG5mdW5jdGlvbiBvbkRldmljZVJlYWR5KCkge1xuXHQvKiBjaGVja3MgaWYgd2UgbmVlZCB0byBjb21wZW5zYXRlIGZvciBpT1Mgc3RhdHVzIGJhciAqL1xuXHRpZiAod2luZG93LmRldmljZS5wbGF0Zm9ybS50b0xvd2VyQ2FzZSgpID09IFwiaW9zXCIgJiYgcGFyc2VGbG9hdCh3aW5kb3cuZGV2aWNlLnZlcnNpb24pID49IDcuMCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXInKS5zdHlsZS5wYWRkaW5nVG9wID0gXCIyMHB4XCI7XG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmFja2J1dHRvblwiLCBvbkJhY2tCdXR0b24sIGZhbHNlKTsgLy8gZmlyZW4gd2hlbiB0aGUgQW5kcm9pZCBiYWNrIGJ1dHRvbiBpcyBjbGlja2VkXG5cblx0Lyogc2V0cyBhIHRvcCBtYXJnaW4gdG8gdGhlIFwiY29udGVudFwiIGNvbnRhaW5lciB0byBwcmV2ZW50IHRoZSBoZWFkZXIgZnJvbSBoaWRpbmcgdGhlIGNvbnRlbnQgKi9cblx0dmFyIGhlYWRlclN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlcicpKTtcblx0aGVhZGVySGVpZ2h0ID0gcGFyc2VJbnQoaGVhZGVyU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnaGVpZ2h0JykpICsgcGFyc2VJbnQoaGVhZGVyU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy10b3AnKSk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50Jykuc3R5bGUubWFyZ2luVG9wID0gaGVhZGVySGVpZ2h0ICsgXCJweFwiO1xuXG5cdC8qIGhpZGVzIHRoZSBzcGxhc2ggc2NyZWVuIChldmVyeXRoaW5nIHZpc2libGUgb24gdGhlIHN0YXJ0IHBhZ2UgaXMgZG9uZSBieSBub3cpICovXG5cdGNvcmRvdmEuZXhlYyhudWxsLCBudWxsLCBcIlNwbGFzaFNjcmVlblwiLCBcImhpZGVcIiwgW10pO1xuXHRjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbmF0aXZlLmtleWJvYXJkc2hvdycsICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcImtleWJvYXJkLW9wZW5cIikpO1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbmF0aXZlLmtleWJvYXJkaGlkZScsICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcImtleWJvYXJkLW9wZW5cIikpO1xufVxuXG4vKiBoYW5kbGVzIEFuZHJvaWQgYmFja2J1dHRvbiBldmVudCAqL1xuZnVuY3Rpb24gb25CYWNrQnV0dG9uKCkge1xuXHRpZiAoaXNQYWdlID09IFwibWFpblwiKSB7XG5cdFx0aWYgKHBsYXllci5pc1BsYXlpbmcpIHtcblx0XHRcdHBsYXllci5wbGF5UGF1c2UoKTtcblx0XHR9XG5cdFx0bmF2aWdhdG9yLmFwcC5leGl0QXBwKCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0bG9hZE1lbnUoKTtcblx0fVxufVxuXG4vKiBkZWNpZGVzIGlmIHRoZSBcInRvIHRvcFwiIGJ1dHRvbiBzaG91bGQgYmUgY2hhbmdlZCAqL1xuZnVuY3Rpb24gb25TY3JvbGwoKSB7XG5cdGlmIChpc1BhZ2UgIT0gXCJtYWluXCIpIHsgLy8gdGhlcmUgaXMgbm8gXCJ0byB0b3BcIiBidXR0b24gb24gdGhlIGZyb250IHBhZ2Vcblx0XHRpZiAod2luZG93LnNjcm9sbFkgPiA1MDApIHtcblx0XHRcdGlmICghc2hvd3NUb3BCdG4pIHsgLy8gcHJldmVudHMgY2hhbmdpbmcgc3R5bGUgYXQgZXZlcnkgc2Nyb2xsIGV2ZW50IGNhbGxcblx0XHRcdFx0c2hvd1RvVG9wQnRuKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHNob3dzVG9wQnRuKSB7IC8vIHByZXZlbnRzIGNoYW5naW5nIHN0eWxlIGF0IGV2ZXJ5IHNjcm9sbCBldmVudCBjYWxsXG5cdFx0XHRoaWRlVG9Ub3BCdG4oKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gc2VsZWN0TGFuZ3VhZ2UobGFuZzogc3RyaW5nKSB7XG5cdGNvbnN0IGxhbmd1YWdlU2VsZWN0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhbmd1YWdlLXNlbGVjdG9yXCIpXG5cdGxhbmd1YWdlU2VsZWN0b3IuY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIilcblx0c2V0VGltZW91dCgoKSA9PiBsYW5ndWFnZVNlbGVjdG9yLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScsIDYwMClcblx0bG9jYWxTdG9yYWdlWydsYW5ndWFnZSddID0gbGFuZ1xuXHRsZXQganNvbiA9IGxvYWRKU09OKGBkYXRhL3ZpZXdzXyR7bGFuZ30uanNvbmApXG5cdG1hcmt1cCA9IGpzb25bXCJ2aWV3c1wiXVxuXHR0cmFuc2xhdGlvbnMgPSBqc29uW1widHJhbnNsYXRpb25zXCJdXG5cdGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gbGFuZ1xuXHRsb2FkTWVudSgpXG59XG5cbmZ1bmN0aW9uIHNob3dMYW5ndWFnZVNlbGVjdFNjcmVlbigpIHtcblx0Y29uc3QgbGFuZ3VhZ2VTZWxlY3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGFuZ3VhZ2Utc2VsZWN0b3JcIilcblx0c2V0VGltZW91dCgoKSA9PiBsYW5ndWFnZVNlbGVjdG9yLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpKVxuXHRsYW5ndWFnZVNlbGVjdG9yLnN0eWxlLndlYmtpdERpc3BsYXkgPSAnJ1xuXHRsYW5ndWFnZVNlbGVjdG9yLnN0eWxlLmRpc3BsYXkgPSAnJ1xufVxuXG53aW5kb3dbJ3Nob3dMYW5ndWFnZVNlbGVjdFNjcmVlbiddID0gc2hvd0xhbmd1YWdlU2VsZWN0U2NyZWVuXG53aW5kb3dbJ3NlbGVjdExhbmd1YWdlJ10gPSBzZWxlY3RMYW5ndWFnZVxuXG5mdW5jdGlvbiBtYWluKCkge1xuXHRsZXQgbGFuZyA9IGxvY2FsU3RvcmFnZVtcImxhbmd1YWdlXCJdXG5cdGlmIChsYW5nKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYW5ndWFnZS1zZWxlY3RvclwiKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cdFx0bGV0IGpzb24gPSBsb2FkSlNPTihgZGF0YS92aWV3c18ke2xhbmd9Lmpzb25gKVxuXHRcdG1hcmt1cCA9IGpzb25bXCJ2aWV3c1wiXVxuXHRcdHRyYW5zbGF0aW9ucyA9IGpzb25bXCJ0cmFuc2xhdGlvbnNcIl1cblx0XHRsb2FkTWVudSgpXG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBsYW5nXG5cdH0gZWxzZSB7XG5cdFx0c2hvd0xhbmd1YWdlU2VsZWN0U2NyZWVuKClcblx0fVxuXG5cdC8qIHNldHRpbmcgYSB0aW1lb3V0IGZ1bmN0aW9uIHRvIGNsZWFyIHRoZSB3YXkgZm9yIGEgcmVkcmF3aW5nIG9mIERPTSAqL1xuXHRzZXRUaW1lb3V0KHBsYXllci5zZXRVcClcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCwgZmFsc2UpOyAgICAgICAgIC8vIGZpcmVzIHdoZW4gdGhlIHVzZXIgaXMgc2Nyb2xsaW5nXG59IiwiLy8gTG9hZCBKU09OIHRleHQgZnJvbSBzZXJ2ZXIgaG9zdGVkIGZpbGUgYW5kIHJldHVybiBKU09OIHBhcnNlZCBvYmplY3RcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSlNPTihmaWxlUGF0aDogc3RyaW5nKTogYW55IHtcblx0Ly8gTG9hZCBqc29uIGZpbGU7XG5cdGNvbnNvbGUuZXJyb3IoZmlsZVBhdGgpXG5cdHZhciBqc29uID0gbG9hZFRleHRGaWxlQWpheFN5bmMoZmlsZVBhdGgsIFwiYXBwbGljYXRpb24vanNvblwiKTtcblx0Ly8gUGFyc2UganNvblxuXHRyZXR1cm4gSlNPTi5wYXJzZShqc29uKTtcbn1cblxuLy8gTG9hZCB0ZXh0IHdpdGggQWpheCBzeW5jaHJvbm91c2x5OiB0YWtlcyBwYXRoIHRvIGZpbGUgYW5kIG9wdGlvbmFsIE1JTUUgdHlwZVxuZnVuY3Rpb24gbG9hZFRleHRGaWxlQWpheFN5bmMoZmlsZVBhdGg6IHN0cmluZywgbWltZVR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG5cdHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHhtbGh0dHAub3BlbihcIkdFVFwiLCBmaWxlUGF0aCwgZmFsc2UpO1xuXHRpZiAobWltZVR5cGUgIT0gbnVsbCkge1xuXHRcdGlmICh4bWxodHRwLm92ZXJyaWRlTWltZVR5cGUpIHtcblx0XHRcdHhtbGh0dHAub3ZlcnJpZGVNaW1lVHlwZShtaW1lVHlwZSk7XG5cdFx0fVxuXHR9XG5cdHhtbGh0dHAuc2VuZCgpO1xuXHRyZXR1cm4geG1saHR0cC5yZXNwb25zZVRleHQ7XG59IiwiaW1wb3J0IHsgZ2V0SGlzdG9yeSwgc3RvcmVIaXN0b3J5IH0gZnJvbSAnLi9oaXN0b3J5J1xuZXhwb3J0IGxldCBpc1BsYXlpbmcgPSBmYWxzZTtcbmxldCBmb290ZXJIZWlnaHQgPSA2NDsgICAvLyBkZWZhdWx0IGZvb3RlciBoZWlnaHQgKGRpZmZlcmVudCBvbiBsYXJnZXIgc2NyZWVucylcblxuLyogcHV0cyBhIHRyYWNrIGluIHRoZSBwbGF5ZXIgYW5kIHBsYXlzIGl0ICovXG5leHBvcnQgZnVuY3Rpb24gcGxheVRyYWNrKG5yLCB0aXRsZSwgdXJsKSB7XG5cdHJlc2V0UGxheWVyKCk7XG5cdGlmICh0eXBlb2YgZGV2aWNlICE9IFwidW5kZWZpbmVkXCIgJiYgbmF2aWdhdG9yLm5ldHdvcmsuY29ubmVjdGlvbi50eXBlID09IENvbm5lY3Rpb24uTk9ORSkge1xuXHRcdHNob3dFcnJvcihcIlVwcGtvcHBsaW5nIHNha25hc1wiKTtcblx0fVxuXHRlbHNlIHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllckJveFwiKS5pbm5lckhUTUwgPSAnPGF1ZGlvIGlkPVwicGxheWVyXCIgc3JjPVwiJyArIHVybCArICdcIiBwcmVsb2FkPVwibWV0YWRhdGFcIiB0eXBlPVwiYXVkaW8vbXBlZ1wiPjwvYXVkaW8+JzsgLy8gcHV0cyB0aGUgaHRtbCBhdWRpbyB0YWcgaW50byB0aGUgcGxheWVyQm94XG5cdFx0cGxheVBhdXNlKCk7ICAgICAgICAgICAgICAgICAvLyBzdGFydCBpbml0aWFsIHBsYXliYWNrXG5cdFx0YWRkUGxheWJhY2tMaXN0ZW5lcigpOyAgICAgICAvLyBhZGQgcGxheWJhY2sgbGlzdGVuZXJzXG5cdFx0c2hvd0Zvb3RlcigpOyAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBwbGF5ZXIgdmlzaWJsZVxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZ3JhbWluZm9cIikuaW5uZXJIVE1MID0gdGl0bGU7XG5cdFx0dmFyIHRyYWNrT2JqID0geyBcIm5yXCI6IG5yLCBcInRpdGxlXCI6IHRpdGxlLCBcInVybFwiOiB1cmwgfTtcblx0XHRzdG9yZUhpc3RvcnkodHJhY2tPYmopO1xuXHR9XG59XG5cbi8qIGdlbmVyYXRlcyB0aW1lIGluIG1pbnV0ZXMgYW5kIHNlY29uZHMgKi9cbmZ1bmN0aW9uIG1zKHNlY29uZHM6IG51bWJlcikge1xuXHRpZiAoaXNOYU4oc2Vjb25kcykpIHtcblx0XHRyZXR1cm4gJzAwOjAwJztcblx0fVxuXHRlbHNlIHtcblx0XHR2YXIgbSA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcblx0XHR2YXIgcyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAlIDYwKTtcblx0XHRyZXR1cm4gKChtIDwgMTAgPyAnMCcgOiAnJykgKyBtICsgJzonICsgKHMgPCAxMCA/ICcwJyA6ICcnKSArIHMpO1xuXHR9XG59XG5cbi8qIHJlc2V0cyB0aGUgcGxheWVyIGludGVyZmFjZSAqL1xuZnVuY3Rpb24gcmVzZXRQbGF5ZXIoKSB7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZ3Jlc3NCYXJcIikuc3R5bGUud2lkdGggPSAnMHB4Jztcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZWRcIikuaW5uZXJIVE1MID0gJzAwOjAwJztcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkdXJhdGlvblwiKS5pbm5lckhUTUwgPSAnMDA6MDAnO1xufVxuXG4vKiB1cGRhdGVzIHByb2dyZXNzIGJhciAqL1xuZnVuY3Rpb24gdXBkYXRlUHJvZ3Jlc3MoKSB7XG5cdHZhciBwbGF5ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllclwiKTtcblxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImR1cmF0aW9uXCIpLmlubmVySFRNTCA9IG1zKHBsYXllci5kdXJhdGlvbik7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVkXCIpLmlubmVySFRNTCA9IG1zKHBsYXllci5jdXJyZW50VGltZSk7XG5cblx0dmFyIHBlcmNlbnQgPSAxMDAgKiAocGxheWVyLmN1cnJlbnRUaW1lIC8gcGxheWVyLmR1cmF0aW9uKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9ncmVzc0JhclwiKS5zdHlsZS53aWR0aCA9IHBlcmNlbnQgKyAnJSc7XG59XG5cbi8qIHRvZ2dsZXMgcGxheSBhbmQgcGF1c2UgKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGF5UGF1c2UoKSB7XG5cdHZhciBwbGF5ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllclwiKTtcblx0aWYgKHBsYXllci5wYXVzZWQpIHtcblx0XHRwbGF5ZXIucGxheSgpO1xuXHRcdHNob3dQYXVzZUJ1dHRvbigpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHBsYXllci5wYXVzZSgpO1xuXHRcdHNob3dQbGF5QnV0dG9uKCk7XG5cdH1cbn1cblxud2luZG93WydwbGF5UGF1c2UnXSA9IHBsYXlQYXVzZVxuXG4vKiBzaG93cyBwYXVzZSBidXR0b24gKi9cbmZ1bmN0aW9uIHNob3dQYXVzZUJ1dHRvbigpIHtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXVzZVwiKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5XCIpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xvc2VGb290ZXJcIikuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0aXNQbGF5aW5nID0gdHJ1ZTtcbn1cblxuLyogc2hvd3MgcGxheSBidXR0b24gKi9cbmZ1bmN0aW9uIHNob3dQbGF5QnV0dG9uKCkge1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhdXNlXCIpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheVwiKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbG9zZUZvb3RlclwiKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0aXNQbGF5aW5nID0gZmFsc2U7XG59XG5cbi8qIHNob3dzIHRoZSBmb290ZXIgd2hlcmUgdGhlIHBsYXllciBpcyAqL1xuZnVuY3Rpb24gc2hvd0Zvb3RlcigpIHtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpLnN0eWxlW1wibWFyZ2luLWJvdHRvbVwiXSA9IGZvb3RlckhlaWdodCAtIDUwICsgXCJweFwiOyAvLyBhZGRzIGV4dHJhIG1hcmdpbiBhdCB0aGUgYm90dG9tXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGVbXCJkaXNwbGF5XCJdID0gXCJub25lXCI7ICAgICAgICAgICAgICAgICAgICAvLyBoaWRlcyBlcnJvciBtZXNzYWdlXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9vdGVyXCIpLnN0eWxlW1wiZGlzcGxheVwiXSA9IFwiYmxvY2tcIjsgICAgICAgICAgICAgICAgICAvLyBzaG93cyBmb290ZXJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYW5ndWFnZS1mb290ZXJcIikuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbn1cblxuLyogY2xvc2VzIHRoZSBmb290ZXIgKi9cbmZ1bmN0aW9uIGNsb3NlRm9vdGVyKCkge1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIikuc3R5bGVbXCJtYXJnaW4tYm90dG9tXCJdID0gXCIwcHhcIjsgLy8gcmVtb3ZlcyBleHRyYSBtYXJnaW4gYXQgdGhlIGJvdHRvbVxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvb3RlclwiKS5zdHlsZVtcImRpc3BsYXlcIl0gPSBcIm5vbmVcIjsgICAgICAgLy8gaGlkZXMgZm9vdGVyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyQm94XCIpLmlubmVySFRNTCA9ICcnOyAgICAgICAgICAgICAgIC8vIHJlbW92ZXMgYXVkaW8gdGFnIGZyb20gY29udGVudFxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhbmd1YWdlLWZvb3RlclwiKS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGFuZ3VhZ2UtZm9vdGVyXCIpLnN0eWxlLmRpc3BsYXkgPSAnJztcbn1cblxud2luZG93WydjbG9zZUZvb3RlciddID0gY2xvc2VGb290ZXJcblxuLyogc2hvd3MgdGhlIGVycm9yIG1lc3NhZ2UgKi9cbmZ1bmN0aW9uIHNob3dFcnJvcih0ZXh0KSB7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JUZXh0XCIpLmlubmVySFRNTCA9IHRleHQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYW5nZXMgdGhlIGVycm9yIG1lc3NhZ2Vcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpLnN0eWxlW1wibWFyZ2luLWJvdHRvbVwiXSA9IGZvb3RlckhlaWdodCArIFwicHhcIjsgLy8gYWRkcyBleHRyYSBtYXJnaW4gYXQgdGhlIGJvdHRvbVxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvb3RlclwiKS5zdHlsZVtcImRpc3BsYXlcIl0gPSBcIm5vbmVcIjsgICAgICAgICAgICAgICAgICAgLy8gaGlkZXMgZm9vdGVyIGNvbnRhaW5pbmcgdGhlIHBsYXllclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yXCIpLnN0eWxlW1wiZGlzcGxheVwiXSA9IFwiYmxvY2tcIjsgICAgICAgICAgICAgICAgICAgLy8gc2hvd3MgZXJyb3IgbWVzc2FnZVxufVxuXG4vKiBjbG9zZXMgdGhlIGVycm9yIG1lc3NhZ2UgKi9cbmZ1bmN0aW9uIGNsb3NlRXJyb3IoKSB7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKS5zdHlsZVtcIm1hcmdpbi1ib3R0b21cIl0gPSBcIjBweFwiOyAvLyByZW1vdmVzIGV4dHJhIG1hcmdpbiBhdCB0aGUgYm90dG9tXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIikuc3R5bGVbXCJkaXNwbGF5XCJdID0gXCJub25lXCI7ICAgICAgICAvLyBoaWRlcyBlcnJvciBtZXNzYWdlXG59XG5cblxuLyogdXBkYXRlcyB0aGUgcGxheWVyIGN1cnJlbnRUaW1lIHRvIHRoZSBtb3VzZSBYIHBvc2l0aW9uICovXG5mdW5jdGlvbiBtb3ZlVGltZVRvKG1vdXNlWCkge1xuXHR2YXIgd2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcnViYmVyXCIpLm9mZnNldFdpZHRoO1xuXHR2YXIgcGVyY2VudCA9IG1vdXNlWCAvIHdpZHRoO1xuXHR2YXIgcGxheWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXJcIik7XG5cdHBsYXllci5jdXJyZW50VGltZSA9IHBsYXllci5kdXJhdGlvbiAqIHBlcmNlbnQ7XG59XG5cbi8qIGFkZHMgbGlzdGVuZXJzIGZvciBjbGljayBhbmQgZHJhZyB0byB0aGUgc2NydWJiZXIgYmFyICovXG5mdW5jdGlvbiBhZGRTY3J1YmJlckxpc3RlbmVyKCkge1xuXHR2YXIgc2NydWJiZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcnViYmVyXCIpO1xuXG5cdHNjcnViYmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBtb3VzZVggPSBlLmNsaWVudFggLSBmb290ZXJIZWlnaHQ7XG5cdFx0aWYgKG1vdXNlWCA+IDApIHtcblx0XHRcdG1vdmVUaW1lVG8obW91c2VYKTtcblx0XHR9XG5cdH0pO1xuXG5cdHNjcnViYmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgbW91c2VYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gZm9vdGVySGVpZ2h0O1xuXHRcdGlmIChtb3VzZVggPiAwKSB7XG5cdFx0XHQvLyBwYXVzaW5nIG9uIHNjcnViYiBtYWtlcyBpdCBzbmFwcGllclxuXHRcdFx0aWYgKGlzUGxheWluZykge1xuXHRcdFx0XHRwbGF5ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllclwiKTtcblx0XHRcdFx0cGxheWVyLnBhdXNlKCk7XG5cdFx0XHRcdG1vdmVUaW1lVG8obW91c2VYKTtcblx0XHRcdFx0cGxheWVyLnBsYXkoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRtb3ZlVGltZVRvKG1vdXNlWCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0fSwgZmFsc2UpO1xufVxuXG4vKiBhZGRzIGV2ZW50IGxpc3RlbmVycyBmb3IgcGxheWVyIGV2ZW50cyAqL1xuZnVuY3Rpb24gYWRkUGxheWJhY2tMaXN0ZW5lcigpIHtcblx0dmFyIHBsYXllciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyXCIpO1xuXG5cdC8qIHdoZW4gcGxheWVyIHVwZGF0ZXMgcHJvZ3Jlc3MgdGltZSAqL1xuXHRwbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRpbWV1cGRhdGVcIiwgZnVuY3Rpb24gKCkge1xuXHRcdHVwZGF0ZVByb2dyZXNzKCk7XG5cdH0sIGZhbHNlKTtcblxuXHQvKiB3aGVuIHRoZXJlIGlzIGFuIGVycm9yICovXG5cdHBsYXllci5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRzd2l0Y2ggKGUudGFyZ2V0LmVycm9yLmNvZGUpIHtcblx0XHRcdGNhc2UgZS50YXJnZXQuZXJyb3IuTUVESUFfRVJSX0FCT1JURUQ6XG5cdFx0XHRcdHNob3dFcnJvcihcIlVwcHNwZWxuaW5nZW4gYXZicsO2dHNcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBlLnRhcmdldC5lcnJvci5NRURJQV9FUlJfTkVUV09SSzpcblx0XHRcdFx0c2hvd0Vycm9yKFwiTsOkdHZlcmtzZmVsXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgZS50YXJnZXQuZXJyb3IuTUVESUFfRVJSX0RFQ09ERTpcblx0XHRcdFx0c2hvd0Vycm9yKFwiS3VuZGUgaW50ZSBhdmtvZGFcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBlLnRhcmdldC5lcnJvci5NRURJQV9FUlJfU1JDX05PVF9TVVBQT1JURUQ6XG5cdFx0XHRcdHNob3dFcnJvcihcIkvDpGxsYW4gc3TDtmRzIGludGVcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0c2hvd0Vycm9yKFwiRmVsIHZpZCB1cHBzcGVsbmluZ1wiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9LCBmYWxzZSk7XG5cblx0cGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRlZFwiLCBvbkVuZGVkKTsgLy8gd2hlbiB0cmFjayBlbmRzXG59XG5cbi8qIGdldHMgY2FsbGVkIHdoZW4gYSB0cmFjayBlbmRzICovXG5mdW5jdGlvbiBvbkVuZGVkKCkge1xuXHRjbG9zZUZvb3RlcigpO1xuXHRpc1BsYXlpbmcgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFVwKCkge1xuXHQvKiBjYWxjdWxhdGVzIHRoZSBmb290ZXJIZWlnaHQgdmFyaWFibGUgc28gdGhhdCBpdCBjYW4gYmUgdXNlZCBsYXRlciAqL1xuXHRcdHZhciBmb290ZXJTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb290ZXInKSk7XG5cdFx0bGV0IGZvb3RlckhlaWdodCA9IHBhcnNlSW50KGZvb3RlclN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpKTtcblx0XHRhZGRTY3J1YmJlckxpc3RlbmVyKCk7ICAgICBcbn0iXX0=
