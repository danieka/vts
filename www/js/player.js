/* puts a track in the player and plays it */
function playTrack(nr, title, url) {
	resetPlayer();
	if (typeof device != "undefined" && navigator.network.connection.type == Connection.NONE) {
		showError("Uppkoppling saknas");
	}
	else {
		document.getElementById("playerBox").innerHTML = '<audio id="player" src="' + url + '" preload="metadata" type="audio/mpeg"></audio>'; // puts the html audio tag into the playerBox
		playPause();                 // start initial playback
		addPlaybackListener();       // add playback listeners
		showFooter();                // make the player visible
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
	}
	else {
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
	document.getElementById("content").style["margin-bottom"] = footerHeight + "px"; // adds extra margin at the bottom
	document.getElementById("error").style["display"] = "none";                    // hides error message
	document.getElementById("footer").style["display"] = "block";                  // shows footer
}

/* closes the footer */
function closeFooter() {
	document.getElementById("content").style["margin-bottom"] = "0px"; // removes extra margin at the bottom
	document.getElementById("footer").style["display"] = "none";       // hides footer
	document.getElementById("playerBox").innerHTML = '';               // removes audio tag from content
}

/* shows the error message */
function showError(text) {
	document.getElementById("errorText").innerHTML = text;                         // changes the error message
	document.getElementById("content").style["margin-bottom"] = footerHeight + "px"; // adds extra margin at the bottom
	document.getElementById("footer").style["display"] = "none";                   // hides footer containing the player
	document.getElementById("error").style["display"] = "block";                   // shows error message
}

/* closes the error message */
function closeError() {
	document.getElementById("content").style["margin-bottom"] = "0px"; // removes extra margin at the bottom
	document.getElementById("error").style["display"] = "none";        // hides error message
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
	}
	else {
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