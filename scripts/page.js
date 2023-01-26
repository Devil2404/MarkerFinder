let selected = "", obj = false, title = "", tabUrl = "", note = [], result = [], high = [];

const closeBtn = document.getElementById("closeMarker")

//when ever page is reload then we have message from backgroud for updating also message from popup for notes display
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.from === "popup") {
        title = message.title
        tabUrl = message.url
        console.log(message)
        if ("view" in message) {
            if (message.view === 1) {
                view(message.title)
            }
            else {
                view("")
            }
        }
        else {
            sendResponse(selected)
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
    console.log(title)
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
                    let google = "Google", g = false;
                    if (text.split(" ").length <= 4 && text !== "") {
                        g = true;
                    }
                    str += `<li> ${i}) ${text}
                    ${g ? `<span onclick="googleSearch('${text}')">` + google + "</span>" : ""}
                    </li>`
                    i++;
                }
                str += `</ul>`

            }
            else {
                console.log("single")
                if (obj.title === title) {
                    str += `<h3> Current Tab Notes</h3 > `
                    str += `<ul class="markercurrent">`
                    for (let text of obj.obj.note) {
                        let google = "Google", g = false;
                        if (text.split(" ").length <= 4 && text !== "") {
                            g = true;
                        }
                        str += `<li> ${i}) ${text}
                    ${g ? `<span onclick="googleSearch('${text}')">` + google + "</span>" : ""}
                    </li>`
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
    span.style.color = "green";
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

// const refresh = () => {
//     chrome.storage.local.get({ highlightedTexts: [] }, function (result) {
//         console.log(result);
//         var highlightedTexts = result.highlightedTexts;
//         highlightedTexts.forEach(function (highlightedText) {
//             var range = document.createRange();
//             var startNode = document.createElement(highlightedText.startConTag)
//             startNode.innerHTML = highlightedText.startConInnerHtml
//             var endNode = document.createElement(highlightedText.startConTag)
//             endNode.innerHTML = highlightedText.endConInnerHtml
//             range.setStart(startNode, highlightedText.startOffset);
//             range.setEnd(endNode, highlightedText.endOffset);
//             var span = document.createElement("span");
//             span.style.fontWeight = "bold";
//             span.style.color = "green";
//             range.surroundContents(span)
//             // range.deleteContents();
//             // range.insertNode(span);
//         });
//     });
// }

// const setAttributes = () => {
//     chrome.storage.local.get({ highlightedTexts: [] }, function (result) {
//         var highlightedTexts = result.highlightedTexts;
//         var selection = window.getSelection();
//         var range = selection.getRangeAt(0);
//         var startContainer = range.startContainer;
//         var startConInnerHtml = startContainer.innerHTML;
//         var startConTag = startContainer.tagName.toLowerCase()
//         var startOffset = range.startOffset
//         var endContainer = range.endContainer;
//         var endConInnerHtml = endContainer.innerHTML;
//         var endConTag = endContainer.tagName.toLowerCase()
//         var endOffset = range.endOffset;
//         highlightedTexts.push({
//             startConInnerHtml, startConTag, startOffset, endConInnerHtml, endOffset, endConTag
//         });
//         chrome.storage.local.set({ highlightedTexts: highlightedTexts });
//     });
// }


