// StreamElements Pomodoro Timer Widget
window.addEventListener('onWidgetLoad', function (obj) {
    console.log("StreamElements pomodoro widget loaded");
    
    // Get field data from StreamElements
    const fieldData = obj.detail.fieldData;
    console.log("Pomodoro field data:", fieldData);
    
    // Initialize the pomodoro timer
    window.pomodoroTimer = new PomodoroTimer(fieldData);
});

class PomodoroTimer {
    constructor(fieldData) {
        this.fieldData = fieldData;

        // Stopwatch mode enabled?
        this.stopwatchMode = this.fieldData.enableStopwatchMode === true || this.fieldData.enableStopwatchMode === "true";

        this.defaultMinutes = this.fieldData.pomodoroMinutes || 25;
        this.isRunning = false;
        this.interval = null;

        // Initialize timer values depending on mode
        if (this.stopwatchMode) {
            this.minutes = 0;
            this.seconds = 0;
        } else {
            this.minutes = this.defaultMinutes;
            this.seconds = 0;
        }

        // Sound properties
        this.tickSoundEnabled = this.fieldData.enableTickSound === 'true';
        this.tickSoundFile = this.fieldData.tickSoundFile;
        this.tickSoundVolume = (this.fieldData.tickSoundVolume || 50) / 100;
        this.tickAudio = null;

        console.log("PomodoroTimer initialized with field data:", this.fieldData);
        console.log("Stopwatch mode:", this.stopwatchMode);
        
        this.initializeElements();
        this.initializeTickSound();
        this.applyCustomColors();
        this.updateDisplay();
        this.bindEvents();
        this.initializeCommands();
    }

    applyCustomColors() {
        const timerWidget = document.querySelector('.timer-widget');
        if (timerWidget) {
            timerWidget.style.backgroundColor = this.fieldData.cardColor || "#010161";
            timerWidget.style.borderRightColor = this.fieldData.cardBorderColor || "#fcfabc";
            timerWidget.style.borderBottomColor = this.fieldData.cardBorderColor || "#fcfabc";
        }
        
        const timeCards = document.querySelectorAll('.time-card');
        timeCards.forEach(card => {
            card.style.background = `linear-gradient(135deg, ${this.fieldData.timerCardStart} 0%, ${this.fieldData.timerCardEnd} 100%)`;
        });

        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.style.background = `linear-gradient(135deg, ${this.fieldData.playBtnColor} 0%, ${this.fieldData.timerCardEnd} 100%)`;
        }

        const timeNumbers = document.querySelectorAll('.time-number');
        timeNumbers.forEach(number => {
            number.style.color = this.fieldData.timerTextColor;
        });

        const playButtonIcon = document.querySelector('.play-button svg path');
        if (playButtonIcon) {
            playButtonIcon.setAttribute('fill', this.fieldData.playBtnIconColor);
        }
    }

    initializeCommands() {
        if (window.SE_API && window.SE_API.onMessage) {
            window.SE_API.onMessage((data) => {
                this.handleCommand(data);
            });
        }
    }

    handleCommand(data) {
        const message = data.message || data.text || '';
        const command = message.toLowerCase().trim();

        console.log("Pomodoro command received:", command);

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
        console.log(`Pomodoro: ${message}`);
        
        if (window.SE_API && window.SE_API.sendMessage) {
            window.SE_API.sendMessage(message);
        }
    }

    initializeElements() {
        this.playButton = document.querySelector('.play-button');
        this.timeCards = document.querySelectorAll('.time-card');
        this.timeNumbers = document.querySelectorAll('.time-number');
        this.secondCard = document.querySelector('.secondcard');
    }

    initializeTickSound() {
        if (this.tickSoundEnabled && this.tickSoundFile) {
            try {
                this.tickAudio = new Audio(this.tickSoundFile);
                this.tickAudio.volume = this.tickSoundVolume;
                this.tickAudio.preload = 'auto';
                
                this.tickAudio.addEventListener('canplaythrough', () => {
                    console.log('Tick sound loaded successfully');
                });
                
                this.tickAudio.addEventListener('error', (e) => {
                    console.error('Error loading tick sound:', e);
                    this.tickSoundEnabled = false;
                });
            } catch (error) {
                console.error('Error initializing tick sound:', error);
                this.tickSoundEnabled = false;
            }
        }
    }

    playTickSound() {
        if (this.tickSoundEnabled) {
            if (this.tickAudio) {
                try {
                    this.tickAudio.currentTime = 0;
                    this.tickAudio.volume = this.tickSoundVolume;
                    const playPromise = this.tickAudio.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log('Tick sound play failed:', error);
                        });
                    }
                } catch (error) {
                    console.error('Error playing tick sound:', error);
                }
            } else {
                this.playFallbackTickSound();
            }
        }
    }

    playFallbackTickSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 1000;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(this.tickSoundVolume * 0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Fallback tick sound not available:', error);
        }
    }

    updateDisplay() {
        const minutesStr = this.minutes.toString().padStart(2, '0');
        const secondsStr = this.seconds.toString().padStart(2, '0');

        this.timeNumbers[0].textContent = minutesStr[0];
        this.timeNumbers[1].textContent = minutesStr[1];
        this.timeNumbers[2].textContent = secondsStr[0];
        this.timeNumbers[3].textContent = secondsStr[1];
        
        // Display seconds in secondcard
        if (this.secondCard) {
            this.secondCard.textContent = this.seconds.toString();
        }
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
        this.playTickSound();

        if (this.stopwatchMode) {
            // Stopwatch mode: count up
            if (this.minutes >= this.defaultMinutes && this.seconds >= 0) {
                this.timerComplete();
                return;
            }

            this.seconds++;
            if (this.seconds >= 60) {
                this.seconds = 0;
                this.minutes++;
            }
        } else {
            // Countdown mode: count down
            if (this.seconds > 0) {
                this.seconds--;
            } else if (this.minutes > 0) {
                this.minutes--;
                this.seconds = 59;
            } else {
                this.timerComplete();
                return;
            }
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
        if (this.stopwatchMode) {
            this.minutes = 0;
            this.seconds = 0;
        } else {
            this.minutes = this.defaultMinutes;
            this.seconds = 0;
        }
        this.updateDisplay();
    }

    updatePlayButton() {
        const svg = this.playButton.querySelector('svg path');
        if (this.isRunning) {
            svg.setAttribute('d', 'M6 4H10V20H6V4ZM14 4H18V20H14V4Z');
        } else {
            svg.setAttribute('d', 'M8 5V19L19 12L8 5Z');
        }
    }

    playNotificationSound() {
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
            console.log('Audio notification not available:', error);
        }
    }

    updateTickSoundSettings(newFieldData) {
        this.fieldData = newFieldData;
        this.tickSoundEnabled = this.fieldData.enableTickSound === 'true';
        this.tickSoundFile = this.fieldData.tickSoundFile;
        this.tickSoundVolume = (this.fieldData.tickSoundVolume || 50) / 100;
        
        this.initializeTickSound();
        
        console.log('Tick sound settings updated:', {
            enabled: this.tickSoundEnabled,
            file: this.tickSoundFile,
            volume: this.tickSoundVolume
        });
    }
}
