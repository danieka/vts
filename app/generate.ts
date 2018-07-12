import { loadJSON } from './load'
import { playTrack } from './player'

function createTextNode(type: string, text: string) {
	let ret = document.createElement(type)
	ret.innerHTML = text
	return ret
}

export let h1 = (title: string) => createTextNode("h1", title)
export let h2 = (title: string) => createTextNode("h2", title)
export let p = (text: string) => createTextNode("p", text)

export function createElement(type: string, options: any) {
    let ret = document.createElement(arguments[0])
    for(let key in options) {
        ret[key] = options[key]
    }
    return ret
}

let a = createElement.bind(null, "a")
let div = createElement.bind(null, "div")


export function generateMenyItem2(title: string, ingress: string, domid: string, load: Function) {
	let link = renderTo(a(),
			h1(title),
			p(ingress))
	link.onclick = load as any
	link.id = domid

	let d = div()
	d.classList.add('center')
	return renderTo(d, link)
}


export function generateMenuItem(title: string, imageURL: string, onClick: Function) {
	let div = document.createElement("div")
	div.classList.add("center")

	let a = document.createElement("a")
    a.onclick = onClick as any
	a.style.backgroundImage = "url(./img/" + imageURL + ")"
	

	let titleEl = h1(title)

	div.appendChild(a)
	a.appendChild(titleEl)

	return div
}

export function removeChildren(element: HTMLElement) {
    while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

export function generateTextBox(description: string) {
	let div = document.createElement("div")
	div.classList.add("textbox")

	let text = p(description)
	renderTo(div, text)
	return div
}


export function generateProgramPageHeader(title: string, image: string, loadMenu: Function) {
	let container = document.createElement("div")
	let back = document.createElement("a")
	back.id = "back"
	back.onclick = loadMenu as any
	back.innerText = "Tillbaka till menyn"

	let titleEl = h1(title)
	titleEl.classList.add("headerLogo")
	titleEl.style.backgroundImage = "url(./img/" + image + ")"
	let goToTop = document.createElement("a")
	goToTop.id = "toTop"
	goToTop.onclick = () => window.scrollTo(0, 0)
	goToTop.innerText = "Tillbaka till toppen"

	container.appendChild(back)
	container.appendChild(titleEl)
	container.appendChild(goToTop)

	return container
}

export function renderTo(root: HTMLElement, ...elements: HTMLElement[]) {
    try {
        removeChildren(root)
        for(let element of elements) {
            root.appendChild(element)
        }
    } catch (err) {
        console.error("Error", err, "\nwhen rendering", arguments)
    }
    return root
}

export function generateAudioLink(track, onPlay?: Function) {
	let link = a({
		onclick: () => {playTrack(track.nr, track.title, track.url); if(onPlay) {onPlay()}},
		className: "track",
	})

	let tr = div({
		className: "nr",
		innerText: track.nr
	})

	let title = div({
		className: "title",
		innerText: track.title
	})

	return renderTo(link, tr, title)
}

export function generateProgramPage(markup, loadMenu: Function) {
	let newHeader = generateProgramPageHeader(markup.title, markup.image, loadMenu)
	let header = document.getElementById("header");
	renderTo(header, newHeader)
	header.style["background"] = "#eaeaea";
	header.style.borderBottom = "1px solid #ccc";

	renderTo(document.getElementById("content"),
		generateProgramListing(markup.shortName))
}


export function generateProgramListing(shortName: string) {
	let json = loadJSON("data/programs/" + shortName + ".json");
	let programs: HTMLElement[] = []
	for (let programEntry of json) {
		console.log(generateAudioLink(programEntry))
		programs.push(generateAudioLink(programEntry))
	}
	let container = document.createElement("div")
	renderTo(container, ...programs)
	return container
}
