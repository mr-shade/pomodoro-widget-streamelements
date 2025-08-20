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
        this.minutes = this.fieldData.pomodoroMinutes || 25;
        this.seconds = 0;
        this.defaultMinutes = this.fieldData.pomodoroMinutes || 25;
        this.isRunning = false;
        this.interval = null;
        
        // Sound properties
        this.tickSoundEnabled = this.fieldData.enableTickSound === 'true';
        this.tickSoundFile = this.fieldData.tickSoundFile;
        this.tickSoundVolume = (this.fieldData.tickSoundVolume || 50) / 100;
        this.tickAudio = null;

        console.log("PomodoroTimer initialized with field data:", this.fieldData);
        console.log("Tick sound enabled:", this.tickSoundEnabled);
        console.log("Tick sound file:", this.tickSoundFile);
        console.log("Tick sound volume:", this.tickSoundVolume);
        
        this.initializeElements();
        this.initializeTickSound();
        this.applyCustomColors();
        this.updateDisplay();
        this.bindEvents();
        this.initializeCommands();
    }

    applyCustomColors() {
        console.log("Applying pomodoro colors with field data:", this.fieldData);
        
        // Apply timer widget background and border colors
        const timerWidget = document.querySelector('.timer-widget');
        if (timerWidget) {
            timerWidget.style.backgroundColor = this.fieldData.cardColor || "#010161";
            timerWidget.style.borderRightColor = this.fieldData.cardBorderColor || "#fcfabc";
            timerWidget.style.borderBottomColor = this.fieldData.cardBorderColor || "#fcfabc";
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

        // Apply play button icon color
        const playButtonIcon = document.querySelector('.play-button svg path');
        if (playButtonIcon) {
            playButtonIcon.setAttribute('fill', this.fieldData.playBtnIconColor);
        }
    }

    initializeCommands() {
        // Listen for StreamElements messages
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
        
        // Send notification via StreamElements API if available
        if (window.SE_API && window.SE_API.sendMessage) {
            window.SE_API.sendMessage(message);
        }
    }

    initializeElements() {
        this.playButton = document.querySelector('.play-button');
        this.timeCards = document.querySelectorAll('.time-card');
        this.timeNumbers = document.querySelectorAll('.time-number');
    }

    initializeTickSound() {
        if (this.tickSoundEnabled && this.tickSoundFile) {
            try {
                this.tickAudio = new Audio(this.tickSoundFile);
                this.tickAudio.volume = this.tickSoundVolume;
                this.tickAudio.preload = 'auto';
                
                // Test if the audio can be loaded
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
            // If custom audio file is available, use it
            if (this.tickAudio) {
                try {
                    // Reset the audio to the beginning for repeated plays
                    this.tickAudio.currentTime = 0;
                    this.tickAudio.volume = this.tickSoundVolume;
                    
                    // Play the sound (returns a promise)
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
                // Fallback: Generate a simple tick sound using Web Audio API
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

            // Create a short, sharp tick sound
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
        // Play tick sound every second when timer is running
        this.playTickSound();
        
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
        this.minutes = this.defaultMinutes;
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
            console.log('Audio notification not available:', error);
        }
    }

    // Method to update tick sound settings if needed
    updateTickSoundSettings(newFieldData) {
        this.fieldData = newFieldData;
        this.tickSoundEnabled = this.fieldData.enableTickSound === 'true';
        this.tickSoundFile = this.fieldData.tickSoundFile;
        this.tickSoundVolume = (this.fieldData.tickSoundVolume || 50) / 100;
        
        // Reinitialize tick sound with new settings
        this.initializeTickSound();
        
        console.log('Tick sound settings updated:', {
            enabled: this.tickSoundEnabled,
            file: this.tickSoundFile,
            volume: this.tickSoundVolume
        });
    }
}
