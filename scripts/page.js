let selected = "", obj = false, title = "", tabUrl = "", note = [], result = [], high = [], color = "green";

//when ever page is reload then we have message from backgroud for updating also message from popup for notes display
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.from === "popup") {
        title = message.title
        tabUrl = message.url
        if (message.view === 1) {
            view(message.title)
        }
        else if (message.view === 2) {
            color = "red"
        }
        else if (message.view === 3) {
            color = "green"
        }
        else if (message.view === 4) {
            color = "yellow"
        }
        else {
            view("")
        }

    }
    else {
        title = message.title
        tabUrl = message.url
        sendResponse("done from page.js")
        getData()
    }
})

//displaying the notes on page
const view = (title) => {
    let css = false
    if (document.getElementById("markerFinder")) {
        document.body.removeChild(document.getElementById("markerFinder"))
        css = true
    }
    const inner = contentCreater(title)
    if (inner !== "") {
        if (!css) {
            addScript()
            addCss()
        }
        document.body.style.width = "65%";
        const p = document.createElement("div");
        p.setAttribute("id", "markerFinder")
        p.innerHTML = inner
        document.body.appendChild(p)
    }
    else {
        alert("No notes in this page")
    }
}

// adding css font style 
const addCss = () => {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = "markerCss"
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&family=Poppins&display=swap';
    link.media = 'all';
    head.appendChild(link);
}

const addScript = () => {
    var script = document.createElement("script");
    script.src = chrome.runtime.getURL('script.js')
    script.id = "markerScript";
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
}

// creating content for notes view
const contentCreater = (title) => {
    let str = ""
    if (result.length !== 0) {
        let srcG = chrome.runtime.getURL('icons8-google-48.png')
        let srcC = chrome.runtime.getURL('icons8-copy-64.png')
        let i = 1;
        str += ` <h1 id="marker">
                 MarkerFinder 
                 <button id="closeMarker" onclick="closeMarker()">X</button>
             </h1 >
                 <hr/>
             `
        for (let obj of result) {
            if (title === "") {
                str += `<h3> ${obj.title}</h3 > `
                str += `<ul class="markercurrent">`
                for (let text of obj.obj.note) {
                    let g = false;
                    if (text.split(" ").length <= 4 && text !== "") {
                        g = true;
                    }
                    str += `<li> ${i}) ${text}`
                    str += `<div class="functions">
                        <span onclick="copyToClipboard('${text}')">
                        <img src="${srcC}">
                        </span>
                        `
                    str += `${g ? `<span onclick="googleSearch('${text}')">` + `<img src="${srcG}">` + "</span>" : ""}`
                    str += `</div></li>`
                    i++;
                }
                str += `</ul>`

            }
            else {
                if (obj.title === title) {
                    str += `<h3> Current Tab Notes</h3 > `
                    str += `<ul class="markercurrent">`
                    for (let text of obj.obj.note) {
                        let google = "Google", g = false;
                        if (text.split(" ").length <= 4 && text !== "") {
                            g = true;
                        }
                        str += `<li> ${i}) ${text}`
                        str += `<div class="functions">
                            <span onclick="copyToClipboard('${text}')">
                            <img src="${srcC}">
                            </span>
                            `
                        str += `${g ? `<span onclick="googleSearch('${text}')">` + `<img src="${srcG}">` + "</span>" : ""}`
                        str += `</div></li>`
                        i++;
                    }
                    str += `</ul>`
                }
            }

        }
    }
    return str
}

//after reloading getting the data from sync
const getData = () => {
    chrome.storage.sync.get(["marker"]).then((res) => {
        if (res !== undefined && Object.keys(res).length !== 0) {
            result = res.marker
        }
    });
}

//for set the new data
const setData = () => {
    chrome.storage.sync.set(
        {
            marker: result
        }
    ).then(() => {
        console.log(result);
    });
}

//highlight the text
const surroundSelection = () => {
    var span = document.createElement("span");
    span.style.fontWeight = "bold";
    span.style.color = color;
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            let range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

//adding new note to the tab view
const addNewNote = () => {
    if (document.getElementById("markerFinder")) {
        if (document.getElementsByClassName("markercurrent").length === 1) {
            view(title)
        }
        else {
            view("")
        }
    }
}

// event for finding selected text
document.addEventListener("mouseup", () => {
    //getting the selected text
    selected = window.getSelection().toString()

    //checking selected text is real string or not 
    if (selected !== undefined && selected !== "" && selected !== null) {
        surroundSelection()
        let value = {}
        //finding the tab in save for updating new text
        for (let resObj of result) {
            if (resObj.title === title) {
                resObj.obj.note.push(selected)
                resObj.obj.note = [...new Set(resObj.obj.note)]
                console.log(resObj.obj.note)
                obj = true
            }
        }

        //if there is a new tab then its create new index for that tab
        if (!obj) {
            note.push(selected)
            value = {
                title,
                obj: {
                    tabUrl, note
                }
            }
            result.push(value)
        }

        //save the cahnges
        setData()

        addNewNote()
    }
    else {
        console.log("simple mouse up")
    }

})



