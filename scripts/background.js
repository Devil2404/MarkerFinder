// event for reloading or updating
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete' && tab.active) {
        refresh();
    }
})

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