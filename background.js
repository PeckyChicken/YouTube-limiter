let totalTime = 0;
let lastDate = 0;
const timeLimit = 3600;
const warningTime = 3300;

let onYoutube = false;
let currentUrl = "";
let currentTabId = null;
let loaded = false;
let storedData = {"time":0,"date":"1/1/1"}

let views = []

let popupOpen = false;
let blocked = false;

function isYouTubeUrl(url) {
    return url.includes("youtube.com");
}

function isExtensionPage(url) {
    return url.includes("://extensions");
}

function loadData(){
    chrome.storage.local.get("data").then((res)=>{lastDate = res.data.date ?? new Date().toLocaleDateString();
                                        totalTime = res.data.time ?? 0;
                                        console.log(res.data);})
}
function sendWarning(){
    chrome.scripting.executeScript({
    target: { tabId: currentTabId },
    files: ["warning.js"]
    });
}
function updateTotalTime() {
    if (onYoutube) {
        totalTime += 1;
        totalTime = Math.min(totalTime,timeLimit)
        checkTimeLimit();
    }
    storedData.time = totalTime

}

function saveData(value) {
    chrome.storage.local.set({ "data": value }, function() {
    });
}

function resetAtMidnight(){
    date = new Date().toLocaleDateString();
    if (date != lastDate){
        lastDate = date;
        totalTime = 0;
        storedData.time = 0
        storedData.date = date
        blocked = false;
        chrome.tabs.query({ url: "*://*.youtube.com/*" }, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.reload(tab.id);
            });
        });

    }
    
}

function second() {
    if (!loaded){
        loadData();
        
        loaded = true;
    }
    resetAtMidnight();
    updateTotalTime();
    saveData(storedData)
}

chrome.runtime.onMessage.addListener(function (message,sender,sendResponse) {
        if (message.type == "get_time") {
            sendResponse({
                totalTime: totalTime,
                timeLimit: timeLimit,
                watching: onYoutube
            })
        }
    });


function checkTimeLimit() {
    if (totalTime >= timeLimit && !blocked) {
        chrome.tabs.query({ url: "*://*.youtube.com/*" }, function (tabs) {
            tabs.forEach(function (tab) {
                    chrome.scripting.executeScript({
                    target: { tabId: currentTabId },
                    files: ["timeup.js"]
                    });
                    console.log("Time is up, blocking YouTube")
            });
        });
    }
    if (totalTime === warningTime) {
        sendWarning();
    }
}

// Event listener for tab switching
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        currentUrl = tab.url;
        currentTabId = tab.id;
        if (isYouTubeUrl(currentUrl)) {
            console.log("User switched to YouTube");
            onYoutube = true;
        } else {
            console.log("User switched away from YouTube");
            onYoutube = false;
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tabId === currentTabId && changeInfo.url) {
        currentUrl = changeInfo.url;
        if (isYouTubeUrl(currentUrl)) {
            console.log("User switched to YouTube");
            onYoutube = true;
        } else {
            console.log("User switched away from YouTube");
            onYoutube = false;
        }
    }
});

// Event listener for installing the extension
chrome.runtime.onInstalled.addListener(function () {
    console.log("Extension installed successfully");
});

// Event listener for browser startup
chrome.runtime.onStartup.addListener(function () {
    console.log("Extension started with the browser");
});

//Start everything

second();
setInterval(second, 1000);
