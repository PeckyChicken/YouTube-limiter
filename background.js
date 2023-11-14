let totalTimeOnYouTube = 0;
let last_date = 0;
const timeLimit = 3600;
let onYoutube = false

function isYouTubeUrl(url) {
    return url.includes("youtube.com");
}

function updateTotalTime() {
    if (onYoutube) {
        totalTimeOnYouTube += 1;
        console.log("Total time on YouTube: " + totalTimeOnYouTube + "seconds");
        checkTimeLimit();
    }
}

function resetAtMidnight(){
    date = new Date().toLocaleDateString();
    if (date != last_date){
        last_date = date
        totalTimeOnYouTube = 0
    }
    
}

function second() {
    updateTotalTime();
	updatePopup();
    resetAtMidnight();
}

setInterval(second, 1000);


chrome.tabs.onUpdated.addListener(updateTotalTime);


function checkTimeLimit() {
    if (totalTimeOnYouTube >= timeLimit) {
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
    chrome.runtime.sendMessage({ totalTime: totalTimeOnYouTube ,timeLimit: timeLimit});
}

//Event listener for tab updates (when a tab is switched or updated)
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status === "complete") {
		if (isYouTubeUrl(tab.url)) {
			console.log("User switched to youtube");
			onYoutube = true
		}
		else {
			console.log("User switched away from youtube")
			onYoutube = false
		}
	}
});

// Event listener for tab switching
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        if (isYouTubeUrl(tab.url)) {
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
