let obj, newArr = [], oldArr = [], result = [], str = "", message = "", title = "", url = "";
const searchArea = document.getElementById("searchArea")
const selectedText = document.getElementById("highlighted")
const downloadBtn = document.getElementById("downloadOne")
const downloadAllBtn = document.getElementById("downloadAll")
const viewOne = document.getElementById("viewOn")
const viewAll = document.getElementById("viewAll")

downloadAllBtn.addEventListener("click", () => {
    getData("all")
})

// for download listener
downloadBtn.addEventListener("click", () => {
    getData("one")
})

viewAll.addEventListener("click", () => {
    getQuery(10)
})

viewOne.addEventListener("click", () => {
    getQuery(1)
})

const getTitle = () => {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, (tabs) => {
        title = tabs[0].title
        url = tabs[0].url
    });
}

const getQuery = (x) => {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, (tabs) => {
        title = tabs[0].title
        url = tabs[0].url
        let message = {
            from: "popup",
            view: x === 1 ? 1 : 10,
            title: tabs[0].title,
            url: tabs[0].url
        }
        //sending message to page.js
        chrome.tabs.sendMessage(tabs[0].id, message,
            (res) => {
                if (res) {
                    console.log(res)
                }
                else
                    console.log("not ok")
            })
    });
}

// get the data from sync
let i = 1;
const getData = (x) => {
    if (i < 6) {
        chrome.storage.sync.get(["marker"]).then((res) => {
            console.log(res)
            if (res !== undefined && Object.keys(res).length !== 0) {
                result = res.marker
                verification(x)
            }
            else {
                getData()
                i++;
            }
        });
    }
    else {
        alert("There is no any notes avaliable")
    }
    console.log(result)
}

// verify its one page or all page
const verification = (x) => {
    if (x === "all") {
        contentCreate()
    }
    else {
        getTabTitle()
    }
}

const getTabTitle = () => {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, (tabs) => {
        singleContent(tabs[0].title)
    })
}

// creating content for download for all page
const contentCreate = () => {
    console.log(result)
    getTitle()
    if (result.length !== 0) {
        for (let note of result) {
            str += "from :   "
            str += note.title + "\n"
            str += "tab Url is :  "
            str += note.obj.tabUrl + "\n"
            for (let text of note.obj.note) {
                str += i + ")  " + text + " "
                str += "\n"
                i++;
            }
            str += "\n"
            str += "\n"
        }
    }
    download()
}

// creating content for download for one page
const singleContent = (title) => {
    console.log(result)
    if (result.length !== 0) {
        for (let obj of result) {
            console.log(title)
            if (obj.title === title) {
                str += "from :   "
                str += obj.title + "\n"
                str += "tab Url is :  "
                str += obj.obj.tabUrl + "\n"
                let i = 1
                for (let text of obj.obj.note) {
                    str += i + ")  " + text + " "
                    str += "\n"
                    i++
                }
            }
        }
    }
    download()
}

//for download
const download = () => {
    if (str.length !== 0) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(str);
        hiddenElement.target = '_blank';
        hiddenElement.download = "data.txt";
        hiddenElement.click();
        str = ""
    }
}