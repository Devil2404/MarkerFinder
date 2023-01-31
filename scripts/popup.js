let obj, newArr = [], oldArr = [], result = [], str = "", message = "", title = "", url = "";
const searchArea = document.getElementById("searchArea")
const selectedText = document.getElementById("highlighted")
const downloadBtn = document.getElementById("downloadOne")
const downloadAllBtn = document.getElementById("downloadAll")
const viewOne = document.getElementById("viewOn")
const viewAll = document.getElementById("viewAll")
const deleteAll = document.getElementById("dAll")
const red = document.getElementById("red")
const yellow = document.getElementById("yellow")
const green = document.getElementById("green")

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
red.addEventListener("click", () => {
    getQuery(2)
})
green.addEventListener("click", () => {
    getQuery(3)
})
yellow.addEventListener("click", () => {
    getQuery(4)
})

deleteAll.addEventListener("click", () => {
    getQuery(5)
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
            view: x,
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
    getTitle()
    let clear = 0
    if (result.length !== 0) {
        for (let note of result) {
            str += "from :   "
            str += note.title + "\n"
            str += "tab Url is :  "
            str += note.obj.tabUrl + "\n"
            if (note.obj.note.length) {
                for (let text of note.obj.note) {
                    str += i + ")  " + text + " "
                    str += "\n"
                    i++;
                }
                str += "\n"
                str += "\n"
            }
            else {
                clear++;
            }
        }
    }
    if (clear === result.length) {
        str = ""
    }
    download()
}

// creating content for download for one page
const singleContent = (title) => {
    if (result.length !== 0) {
        for (let obj of result) {
            if (obj.title === title) {
                str += "from :   "
                str += obj.title + "\n"
                str += "tab Url is :  "
                str += obj.obj.tabUrl + "\n"
                let i = 1
                if (obj.obj.note.length) {
                    for (let text of obj.obj.note) {
                        str += i + ")  " + text + " "
                        str += "\n"
                        i++
                    }
                }
                else {
                    str = ""
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
    else {
        alert("There is no any notes avaliable")
    }
}