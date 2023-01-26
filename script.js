//closing the new tab
const closeMarker = () => {
    document.body.style.width = "100%"
    var head = document.getElementsByTagName('head')[0];
    document.body.removeChild(document.getElementById("markerFinder"))
    head.removeChild(document.getElementById("markerCss"))
    head.removeChild(document.getElementById("markerScript"))
}

// for google search
const googleSearch = (text) => {
    var hidden = document.createElement("a");
    hidden.target = "_blank"
    hidden.href = `https://www.google.com/search?q=${text}&source=desktop`
    hidden.click()
}