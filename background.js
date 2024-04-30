let totalTime = 0;
let lastDate = 0;
const timeLimit = 3600;
const warningTime = 3300;

let onYoutube = false;
let currentUrl = "";
let loaded = false;
let storedData = {"time":0,"date":"1/1/1"}

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

function updateTotalTime() {
    if (onYoutube) {
        totalTime += 1;
        storedData.time = totalTime
        console.log("Total time on YouTube: " + totalTime + " seconds");
        checkTimeLimit();
    }
}

function saveData(value) {
    chrome.storage.local.set({ "data": value }, function() {
        console.log("Storage updated successfully");
    });
}

function resetAtMidnight(){
    date = new Date().toLocaleDateString();
    if (date != lastDate){
        lastDate = date;
        totalTime = 0;
        storedData.time = 0
        storedData.date = date

    }
    
}

function second() {
    if (!loaded){
        loadData();
        
        loaded = true;
    }
    resetAtMidnight();
    updatePopup();
    updateTotalTime();
    saveData(storedData)
}




function checkTimeLimit() {
    if (totalTime >= timeLimit) {
        chrome.tabs.query({ url: "*://*.youtube.com/*" }, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.remove(tab.id, function () {
                    console.log("Closed YouTube tab due to time limit");
                });
            });
        });
    }
}


function updatePopup() {
    try{chrome.runtime.sendMessage({ totalTime: totalTime ,timeLimit: timeLimit});}
    catch (err){console.log(err)}
}

//Event listener for tab updates (when a tab is switched or updated)
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status === "complete") {
        currentUrl = tab.url
		if (isYouTubeUrl(currentUrl)) {
			console.log("User switched to youtube");
			onYoutube = true;
		}
		else {
			console.log("User switched away from youtube");
			onYoutube = false;
		}
	}
});

// Event listener for tab switching
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        currentUrl = tab.url
        if (isYouTubeUrl(currentUrl)) {
            console.log("User switched to YouTube");
            onYoutube = true;
        } else {
            console.log("User switched away from YouTube");
            onYoutube = false;
        }
    });
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

setInterval(second, 1000);
