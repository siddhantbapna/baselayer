
let timer;
let isRunning = false;
let timeLeft = 14 * 60 + 45; // Initial time in seconds

const timeDisplay = document.getElementById('time');
const controlButton = document.getElementById('controlButton');
const playIcon = controlButton.querySelector('.play-icon');
const pauseIcon = controlButton.querySelector('.pause-icon');

function updateTimeDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimeDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    }, 1000);
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    } else {
        startTimer();
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    }
    isRunning = !isRunning;
}

controlButton.addEventListener('click', toggleTimer);
updateTimeDisplay();
