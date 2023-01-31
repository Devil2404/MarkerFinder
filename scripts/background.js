let count = 0, Tabid = []

//  first time install
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        notification()
        newRefresh()
    }
})

// message from webpage
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    chrome.tabs.sendMessage(sender.tab.id, {
        text: message.text,
        from: "background"
    },
        (res) => {
            if (res){
                console.log(res)
                sendResponse("Ok")
            }
            else
                console.log("not ok")
        })
});

// generate notification at first installation
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

// active tab checking
chrome.tabs.onActivated.addListener((activeInfo) => {
    for (let id of Tabid) {
        if (id === activeInfo.tabId && count > 0) {
            chrome.tabs.reload(activeInfo.tabId)
            count--
            Tabid.splice(Tabid.indexOf(id), 1)
        }
    }
})

// take all open tabs at first time
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