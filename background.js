// Define variables to keep track of total time spent on YouTube and the time limit
let totalTimeOnYouTube = 0;
const timeLimit = 60;
let onYoutube = false

// Function to check if a URL is from YouTube
function isYouTubeUrl(url) {
    return url.includes("youtube.com");
}

// Function to update the total time spent on YouTube
function updateTotalTime() {
    if (onYoutube) {
        totalTimeOnYouTube += 1;
        console.log("Total time on YouTube: " + totalTimeOnYouTube + "seconds");
		updatePopup();
        checkTimeLimit();
    }
}

// Function to be called every second
function runEverySecond() {
    updateTotalTime();
}

// Set up an interval to call the function every second
setInterval(runEverySecond, 1000);


chrome.tabs.onUpdated.addListener(updateTotalTime);


// Function to close tabs if the time limit is reached
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
    chrome.runtime.sendMessage({ totalTime: totalTimeOnYouTube });
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
