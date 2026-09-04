const clock = document.getElementById("clock");
const readingTimer = document.getElementById("readingTimer");
const ambientMusic = document.getElementById("ambientMusic");
const musicButton = document.getElementById("musicButton");

ambientMusic.volume = 0.3;

musicButton.addEventListener("click", () => {

    if (ambientMusic.paused) {
        ambientMusic.play();
        musicButton.textContent = "♫ Pause music";
    } else {
        ambientMusic.pause();
        musicButton.textContent = "♫ Play music";
    }

});

ambientMusic.volume = 0.3;

ambientMusic.play();

// Current time

function updateClock() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    clock.textContent = `${hours}:${minutes}`;
}

updateClock();

setInterval(updateClock, 1000);


// Reading timer

let elapsedSeconds = 0;

function updateReadingTimer() {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    const formattedTime =
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;

    readingTimer.textContent = formattedTime;

    elapsedSeconds++;
}

updateReadingTimer();

setInterval(updateReadingTimer, 1000);


// Back to bookshelf

const backButton = document.getElementById("backButton");

backButton.addEventListener("click", () => {
    window.location.href = "index.html";
});