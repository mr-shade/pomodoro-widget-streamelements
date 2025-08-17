class PomodoroTimer {
    constructor() {
        this.minutes = 10;
        this.seconds = 30;
        this.isRunning = false;
        this.interval = null;

        this.initializeElements();
        this.updateDisplay();
        this.bindEvents();
    }

    initializeElements() {
        this.playButton = document.querySelector('.play-button');
        this.timeCards = document.querySelectorAll('.time-card');
        this.timeNumbers = document.querySelectorAll('.time-number');
    }

    updateDisplay() {
        const minutesStr = this.minutes.toString().padStart(2, '0');
        const secondsStr = this.seconds.toString().padStart(2, '0');

        // Update minutes display
        this.timeNumbers[0].textContent = minutesStr[0];
        this.timeNumbers[1].textContent = minutesStr[1];

        // Update seconds display
        this.timeNumbers[2].textContent = secondsStr[0];
        this.timeNumbers[3].textContent = secondsStr[1];
    }

    bindEvents() {
        this.playButton.addEventListener('click', () => {
            this.toggleTimer();
        });
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        this.updatePlayButton();

        this.interval = setInterval(() => {
            this.tick();
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        this.updatePlayButton();

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    tick() {
        if (this.seconds > 0) {
            this.seconds--;
        } else if (this.minutes > 0) {
            this.minutes--;
            this.seconds = 59;
        } else {
            this.timerComplete();
            return;
        }

        this.updateDisplay();
    }

    timerComplete() {
        this.pauseTimer();
        this.playNotificationSound();
        alert('Pomodoro completed!');
        this.resetTimer();
    }

    resetTimer() {
        this.minutes = 25;
        this.seconds = 0;
        this.updateDisplay();
    }

    updatePlayButton() {
        const svg = this.playButton.querySelector('svg path');
        if (this.isRunning) {
            // Change to pause icon
            svg.setAttribute('d', 'M6 4H10V20H6V4ZM14 4H18V20H14V4Z');
        } else {
            // Change to play icon
            svg.setAttribute('d', 'M8 5V19L19 12L8 5Z');
        }
    }

    playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not available');
        }
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});

// Add some visual effects for better user experience
document.addEventListener('DOMContentLoaded', () => {
    const timeCards = document.querySelectorAll('.time-card');

    // Add subtle animation to time cards when they update
    timeCards.forEach(card => {
        const observer = new MutationObserver(() => {
            card.style.transform = 'scale(1.05)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        });

        observer.observe(card, {
            childList: true,
            subtree: true,
            characterData: true
        });
    });
});
