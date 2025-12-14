function addWarning() {
    const div = document.createElement("div");
    div.id = "yt-warning";
    div.textContent = "5 minutes remaining";
    div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: red;
    color: white;
    padding: 10px 15px;
    font-size: 16px;
    border-radius: 5px;
    z-index: 999999;
    opacity: 1;
    transition: opacity 1s ease-in-out;  /* fade effect */
    `;
    document.body.appendChild(div);


    const audio = new Audio(
        chrome.runtime.getURL("warning.mp3")
    );

    audio.volume = 0.8;
    audio.play().catch(() => {});


    setTimeout(() => {
        div.style.opacity = 0;

        // Remove element after transition completes
        div.addEventListener("transitionend", () => div.remove());
    }, 3000);
}

addWarning();
