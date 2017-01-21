function createTextNode(type, text) {
	var ret = document.createElement(type)
	ret.innerHTML = text
	return ret
}

createH1 = createTextNode.bind(null, "h1")
createP = createTextNode.bind(null, "p")

function createElement(type, options) {
    var ret = document.createElement(arguments[0])
    for(var key in options) {
        ret[key] = options[key]
    }
    return ret
}

var a = createElement.bind(null, "a")
var div = createElement.bind(null, "div")

function generateMenuItem(markup) {
	var div = document.createElement("div")
	div.classList.add("center")

	var a = document.createElement("a")
    a.onclick = function() {
        generateProgramPage(markup)
        goToTop()
    }
	a.style.backgroundImage = "url(../img/" + markup.image + ")"
	

	var title = createH1(markup.title)
	var p = createP(markup.shortDescription)

	div.appendChild(a)
	a.appendChild(title)
	a.appendChild(p)

	return div
}

function removeChildren(element) {
    while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function generateTextBox(description) {
	var div = document.createElement("div")
	div.classList.add("textbox")

	var text = createP(description)
	renderTo(div, text)
	return div
}


function generateProgramPageHeader(title, image) {
	var container = document.createElement("div")
	var back = document.createElement("a")
	back.id = "back"
	back.onclick = loadMenu
	back.innerText = "Tillbaka till menyn"

	var title = createH1(title)
	title.classList.add("headerLogo")
	title.style.backgroundImage = "url(../img/" + image + ")"
	var goToTop = document.createElement("a")
	goToTop.id = "toTop"
	goToTop.onclick = goToTop
	goToTop.innerText = "Tillbaka till toppen"

	container.appendChild(back)
	container.appendChild(title)
	container.appendChild(goToTop)

	return container
}

function renderTo(root) {
    try {
        removeChildren(root)
        var elements = Array.from(arguments).slice(1)
        for(var element of elements) {
            root.appendChild(element)
        }
    } catch (err) {
        console.error("Error", err, "\nwhen rendering", arguments)
    }
    return root
}

function generateAudioLink(track) {
	var link = a({
		onclick: playTrack.bind(null, track.nr, track.title, track.url),
		className: "track",
	})

	var tr = div({
		className: "nr",
		innerText: track.nr
	})

	var title = div({
		className: "title",
		innerText: track.title
	})

	return renderTo(link, tr, title)
}

function generateProgramPage(markup) {
	isPage = "program"
	var newHeader = generateProgramPageHeader(markup.title, markup.image)
	var header = document.getElementById("header");
	renderTo(header, newHeader)
	header.style["background"] = "#eaeaea";
	header.style["border-bottom"] = "1px solid #ccc";

	renderTo(document.getElementById("content"),
		generateTextBox(markup.longDescription),
		generateProgramListing(markup.shortName))
}