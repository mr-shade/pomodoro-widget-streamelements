class PomodoroTimer {
    constructor() {
        this.minutes = 25;
        this.seconds = 0;
        this.isRunning = false;
        this.interval = null;
        this.fieldData = this.getFieldData();

        this.initializeElements();
        this.applyCustomColors();
        this.updateDisplay();
        this.bindEvents();
        this.initializeCommands();
    }

    getFieldData() {
        // Check if StreamElements field data exists
        if (typeof window !== 'undefined' && window.SE_API && window.SE_API.getFieldData) {
            return window.SE_API.getFieldData() || this.getDefaultFields();
        }
        
        // Check for global obj.detail.fieldData (StreamElements pattern)
        if (typeof obj !== 'undefined' && obj.detail && obj.detail.fieldData) {
            return obj.detail.fieldData;
        }

        // Return default values for development environment
        return this.getDefaultFields();
    }

    getDefaultFields() {
        return {
            bgColor: "#B794F6",
            bgGradientEnd: "#805AD5",
            cardColor: "#1A202C",
            cardBorderColor: "#FBD38D",
            timerCardStart: "#63B3ED",
            timerCardEnd: "#4299E1",
            playBtnColor: "#63B3ED",
            playBtnIconColor: "#FFFFFF",
            timerTextColor: "#FFFFFF",
            titleTextColor: "#1A202C"
        };
    }

    applyCustomColors() {
        // Apply background gradient
        document.body.style.background = `linear-gradient(135deg, ${this.fieldData.bgColor} 0%, ${this.fieldData.bgGradientEnd} 100%)`;
        
        // Apply card colors
        const timerWidget = document.querySelector('.timer-widget');
        if (timerWidget) {
            timerWidget.style.background = this.fieldData.cardColor;
            timerWidget.style.borderRightColor = this.fieldData.cardBorderColor;
            timerWidget.style.borderBottomColor = this.fieldData.cardBorderColor;
        }

        // Apply timer card colors
        const timeCards = document.querySelectorAll('.time-card');
        timeCards.forEach(card => {
            card.style.background = `linear-gradient(135deg, ${this.fieldData.timerCardStart} 0%, ${this.fieldData.timerCardEnd} 100%)`;
        });

        // Apply play button colors
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.style.background = `linear-gradient(135deg, ${this.fieldData.playBtnColor} 0%, ${this.fieldData.timerCardEnd} 100%)`;
        }

        // Apply text colors
        const timeNumbers = document.querySelectorAll('.time-number');
        timeNumbers.forEach(number => {
            number.style.color = this.fieldData.timerTextColor;
        });

        const title = document.querySelector('.title');
        if (title) {
            title.style.color = this.fieldData.titleTextColor;
        }

        // Apply play button icon color
        const playButtonIcon = document.querySelector('.play-button svg path');
        if (playButtonIcon) {
            playButtonIcon.setAttribute('fill', this.fieldData.playBtnIconColor);
        }
    }

    initializeCommands() {
        // Mock StreamElements API for development
        if (typeof window !== 'undefined' && !window.SE_API) {
            window.SE_API = {
                onMessage: (callback) => {
                    window.seMessageCallback = callback;
                },
                store: {
                    set: (key, value) => {
                        localStorage.setItem(`se_${key}`, JSON.stringify(value));
                    },
                    get: (key) => {
                        const item = localStorage.getItem(`se_${key}`);
                        return item ? JSON.parse(item) : null;
                    }
                }
            };
        }

        // Listen for StreamElements messages
        if (window.SE_API && window.SE_API.onMessage) {
            window.SE_API.onMessage((data) => {
                this.handleCommand(data);
            });
        }

        // For development: Listen for manual command testing
        this.setupDevCommandTesting();
    }

    setupDevCommandTesting() {
        // Add development command testing interface
        if (!document.querySelector('#dev-commands')) {
            const devDiv = document.createElement('div');
            devDiv.id = 'dev-commands';
            devDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 1000;
            `;
            devDiv.innerHTML = `
                <div>Dev Commands:</div>
                <button onclick="window.pomodoroTimer.handleCommand({message: '!start'})">!start</button>
                <button onclick="window.pomodoroTimer.handleCommand({message: '!pause'})">!pause</button>
                <button onclick="window.pomodoroTimer.handleCommand({message: '!reset'})">!reset</button>
            `;
            document.body.appendChild(devDiv);
        }
    }

    handleCommand(data) {
        const message = data.message || data.text || '';
        const command = message.toLowerCase().trim();

        switch (command) {
            case '!start':
                if (!this.isRunning) {
                    this.startTimer();
                    this.sendNotification('Pomodoro started! 🍅');
                }
                break;
            case '!pause':
                if (this.isRunning) {
                    this.pauseTimer();
                    this.sendNotification('Pomodoro paused ⏸️');
                }
                break;
            case '!reset':
                this.resetTimer();
                this.sendNotification('Pomodoro reset 🔄');
                break;
        }
    }

    sendNotification(message) {
        // Send notification via StreamElements API if available
        if (window.SE_API && window.SE_API.sendMessage) {
            window.SE_API.sendMessage(message);
        } else {
            // Development notification
            console.log(`Pomodoro: ${message}`);
            
            // Show visual notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 50px;
                right: 10px;
                background: #4299E1;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 1001;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                document.body.removeChild(notification);
            }, 3000);
        }
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
        this.pauseTimer();
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
        } catch (_error) {
            console.log('Audio notification not available');
        }
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.pomodoroTimer = new PomodoroTimer();
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
