chrome.runtime.sendMessage({ type: "popup_opened"});

var localTime = 0;
var timeLimit = 0;
var watching = false;

chrome.runtime.sendMessage({ type: "get_time" },response => {
    localTime = response.totalTime;
    timeLimit = response.timeLimit;
    watching = response.watching;
    updateDisplay(localTime, timeLimit);
});


setInterval(() => {
    if (watching) {
        localTime += 1;
        updateDisplay(localTime, timeLimit);
    }
}, 1000);

function updateDisplay(totalTime, timeLimit) {
    const timeElement = document.getElementById('timer');
    const timeLimitElement = document.getElementById('timelimit');
    if (timeElement) {
        timeElement.innerText = "Time on YouTube today:\n" + new Date(totalTime*1000).toISOString().slice(11, 19); + "";
    }
    if (timeLimitElement) {
        timeLimitElement.innerText = "Limit:\n" + new Date(timeLimit * 1000).toISOString().slice(11, 19); + "";
    }
};