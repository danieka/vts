// Load JSON text from server hosted file and return JSON parsed object
export function loadJSON(filePath: string): any {
	// Load json file;
	console.error(filePath)
	var json = loadTextFileAjaxSync(filePath, "application/json");
	// Parse json
	return JSON.parse(json);
}

// Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileAjaxSync(filePath: string, mimeType: string): string {
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