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

// function for copy to clipboard
const copyToClipboard = str => {
    const textarea = document.createElement('textarea');
    textarea.value = str;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document
        .body
        .appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    alert("Data are copied to clipboard");
    document
        .body
        .removeChild(textarea);
};

// to delete the note 
const deleteNote = text => {
    var editorExtensionId = "kkcajbgllihmngmgkndojghgmfnhklkl";
    // Make a simple request:
    chrome.runtime.sendMessage(editorExtensionId, { text },
        function (response) {
            console.log(response);
        });
}
