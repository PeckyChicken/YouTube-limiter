document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.onMessage.addListener(function (message) {
        const timeElement = document.getElementById('timer');
        const timeLimitElement = document.getElementById('timelimit');
        if (timeElement) {
            timeElement.innerText = "Time on YouTube today:\n" + new Date(message.totalTime * 1000).toISOString().slice(11, 19); + "";
        }
        if (timeLimitElement) {
            timeLimitElement.innerText = "Limit:\n" + new Date(message.timeLimit * 1000).toISOString().slice(11, 19); + "";
        }
    });
});