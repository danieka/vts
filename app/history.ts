/* fetches player history */

export let isPage = ''

export function getHistory() {
	if (window.localStorage.getItem('history') != null) {
		return JSON.parse(window.localStorage.getItem('history'));
	}
	else {
		return "";
	}
}

/* stores history in local storage */
export function storeHistory(track) {
    if (isPage == 'history') {
        return
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

export function clearHistory() {
	window.localStorage.removeItem('history');
}