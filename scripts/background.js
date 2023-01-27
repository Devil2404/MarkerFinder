let count = 0, Tabid = []

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        notification()
        newRefresh()
    }
})

const notification = () => {
    chrome.notifications.create({
        title: "MarkerFinder",
        message: "MarkerFinder is Installed in Your broswer",
        type: "basic",
        iconUrl: "../assets/images/highlight-gaf0398eaf_1280.png"
    })
}

// event for reloading or updating
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete' && tab.active) {
        refresh();
    }
})

if (count > 0) {
    chrome.tabs.onActivated.addListener((activeInfo) => {
        for (let id of Tabid) {
            if (id === activeInfo.tabId && count > 0) {
                chrome.tabs.reload(activeInfo.tabId)
                count--
                Tabid.splice(Tabid.indexOf(id), 1)
            }
        }
    })
}

const newRefresh = () => {
    chrome.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
            if (!tab.active) {
                Tabid.push(tab.id)
                count++
            }
        }
        console.log(count)
        console.log(Tabid)
    })
}

// sending message whenever reload 
const refresh = () => {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, (tabs) => {

        //sending message to page.js
        chrome.tabs.sendMessage(tabs[0].id, {
            title: tabs[0].title,
            url: tabs[0].url,
            from: "background"
        },
            (res) => {
                if (res)
                    console.log(res)
                else
                    console.log("not ok")
            })
    });
}