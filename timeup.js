function createOverlay(){
    if (document.getElementById("yt-limiter-overlay")) return;
    // create the overlay
    const overlay = document.createElement("div");
    overlay.id = "yt-limiter-overlay";
    overlay.innerHTML = `
        <h1>YouTube Limiter</h1>
        <h2>Your YouTube time has expired today, it will reset in <span id="timer">00:00:00</span></h2>
    `;

    const bgUrl = chrome.runtime.getURL("background.png");

    const style = document.createElement("style");
    style.textContent = `
        #yt-limiter-overlay {
            position: fixed;
            inset: 0;
            z-index: 2147483647;
            background-image: url("${bgUrl}");
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            margin: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: white;
            font-family: sans-serif;
        }
    `;

    document.documentElement.appendChild(style);
    document.documentElement.appendChild(overlay);

    document.title = "YouTube Limiter";

    const url = chrome.runtime.getURL("icon.png");

    document
        .querySelectorAll("link[rel~='icon']")
        .forEach(el => el.remove());

    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = url;

    document.head.appendChild(link);

    update_timer();
}

function pauseYouTubeVideo() {
    const video = document.querySelector('video');
    if (video && !video.paused) {
        video.pause();
    }
}

function preventKeyboardNavigation(event) {
    event.preventDefault();
    event.stopPropagation();
}

createOverlay();
pauseYouTubeVideo();
document.addEventListener('keydown', preventKeyboardNavigation, true);
document.addEventListener('keyup', preventKeyboardNavigation, true);
document.addEventListener('keypress', preventKeyboardNavigation, true);


const playbackGuard = setInterval(() => {
  document.title = "YouTube Limiter"

  const video = document.querySelector('video');
      if (video && !video.paused) {
          video.pause();
      }
  }, 250);

const video = document.querySelector('video');
  if (video) {
    video.blur();
  }

function update_timer() {
  const el = document.getElementById('timer');

    function pad(n) { return String(n).padStart(2, '0'); }

    function update() {
        const now = new Date();
        const nextMidnight = new Date(now);
        nextMidnight.setHours(24, 0, 0, 0);
        const diff = nextMidnight - now;

        if (diff <= 0) {
            el.textContent = '00:00:00';
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        el.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    update();
    setInterval(update, 1000);
}