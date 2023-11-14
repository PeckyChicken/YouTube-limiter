document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.onMessage.addListener(function (message) {
        const timeElement = document.getElementById('timer');
        if (timeElement) {
            timeElement.innerText = "Time on YouTube today:\n" + new Date(message.totalTime * 1000).toISOString().slice(11, 19); + "";
        }
    });
});