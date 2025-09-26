class TimerWidget {
    constructor() {
        this.hours = 10;
        this.minutes = 30;
        this.seconds = 5;
        this.isRunning = false;
        this.isPaused = false;
        this.timerInterval = null;
        
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.playBtn = document.getElementById('playBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.homeBtn = document.getElementById('homeBtn');
        this.timerWidget = document.querySelector('.timer-widget');
        
        this.init();
    }
    
    init() {
        this.updateDisplay();
        this.bindEvents();
    }
    
    bindEvents() {
        this.playBtn.addEventListener('click', () => this.toggleTimer());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.homeBtn.addEventListener('click', () => this.resetTimer());
        
        // Make time segments clickable for editing
        this.hoursElement.addEventListener('click', () => this.editTime('hours'));
        this.minutesElement.addEventListener('click', () => this.editTime('minutes'));
        this.secondsElement.addEventListener('click', () => this.editTime('seconds'));
    }
    
    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    
    startTimer() {
        if (this.hours === 0 && this.minutes === 0 && this.seconds === 0) {
            this.resetTimer();
            return;
        }
        
        this.isRunning = true;
        this.isPaused = false;
        this.timerWidget.classList.add('active');
        this.updatePlayButton();
        
        this.timerInterval = setInterval(() => {
            this.tick();
        }, 1000);
    }
    
    pauseTimer() {
        this.isRunning = false;
        this.isPaused = true;
        this.timerWidget.classList.remove('active');
        this.updatePlayButton();
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        this.hours = 10;
        this.minutes = 30;
        this.seconds = 5;
        
        this.timerWidget.classList.remove('active');
        this.updatePlayButton();
        this.updateDisplay();
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    tick() {
        if (this.seconds > 0) {
            this.seconds--;
        } else if (this.minutes > 0) {
            this.minutes--;
            this.seconds = 59;
        } else if (this.hours > 0) {
            this.hours--;
            this.minutes = 59;
            this.seconds = 59;
        } else {
            // Timer finished
            this.onTimerComplete();
            return;
        }
        
        this.updateDisplay();
    }
    
    onTimerComplete() {
        this.isRunning = false;
        this.isPaused = false;
        this.timerWidget.classList.remove('active');
        this.updatePlayButton();
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Play completion sound or show notification
        this.showNotification('Timer Complete!', 'Your timer has finished.');
        
        // Flash the widget
        this.timerWidget.style.animation = 'pulse 0.5s ease-in-out 3';
        setTimeout(() => {
            this.timerWidget.style.animation = '';
        }, 1500);
    }
    
    updateDisplay() {
        const newHours = this.formatTime(this.hours);
        const newMinutes = this.formatTime(this.minutes);
        const newSeconds = this.formatTime(this.seconds);
        
        // Add flip animation if value changed
        if (this.hoursElement.textContent !== newHours) {
            this.animateChange(this.hoursElement, newHours);
        }
        if (this.minutesElement.textContent !== newMinutes) {
            this.animateChange(this.minutesElement, newMinutes);
        }
        if (this.secondsElement.textContent !== newSeconds) {
            this.animateChange(this.secondsElement, newSeconds);
        }
    }
    
    animateChange(element, newValue) {
        element.classList.add('flip');
        setTimeout(() => {
            element.textContent = newValue;
            element.classList.remove('flip');
        }, 300);
    }
    
    formatTime(time) {
        return time.toString().padStart(2, '0');
    }
    
    updatePlayButton() {
        const playIcon = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="5,3 19,12 5,21" fill="currentColor"/>
            </svg>
        `;
        
        const pauseIcon = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
            </svg>
        `;
        
        if (this.isRunning) {
            this.playBtn.innerHTML = pauseIcon;
            this.playBtn.classList.add('pause');
        } else {
            this.playBtn.innerHTML = playIcon;
            this.playBtn.classList.remove('pause');
        }
    }
    
    editTime(unit) {
        if (this.isRunning) return; // Don't allow editing while running
        
        const currentValue = this[unit];
        const maxValue = unit === 'hours' ? 23 : 59;
        const newValue = prompt(`Enter ${unit} (0-${maxValue}):`, currentValue);
        
        if (newValue !== null) {
            const parsedValue = parseInt(newValue);
            if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= maxValue) {
                this[unit] = parsedValue;
                this.updateDisplay();
            } else {
                alert(`Please enter a valid number between 0 and ${maxValue}`);
            }
        }
    }
    
    openSettings() {
        // Toggle settings panel or show options
        const choice = prompt('Settings:\n1. Set Custom Time\n2. Change Theme\n3. Sound Settings\n4. Notifications\n\nEnter number (1-4):');
        
        switch(choice) {
            case '1':
                this.setCustomTime();
                break;
            case '2':
                this.changeTheme();
                break;
            case '3':
                alert('Sound settings coming soon!');
                break;
            case '4':
                alert('Notification settings coming soon!');
                break;
        }
    }
    
    setCustomTime() {
        if (this.isRunning) {
            alert('Please pause the timer first');
            return;
        }
        
        const hours = prompt('Enter hours (0-23):', this.hours);
        const minutes = prompt('Enter minutes (0-59):', this.minutes);
        const seconds = prompt('Enter seconds (0-59):', this.seconds);
        
        if (hours !== null && minutes !== null && seconds !== null) {
            const h = parseInt(hours);
            const m = parseInt(minutes);
            const s = parseInt(seconds);
            
            if (!isNaN(h) && !isNaN(m) && !isNaN(s) && 
                h >= 0 && h <= 23 && m >= 0 && m <= 59 && s >= 0 && s <= 59) {
                this.hours = h;
                this.minutes = m;
                this.seconds = s;
                this.updateDisplay();
            } else {
                alert('Please enter valid time values');
            }
        }
    }
    
    changeTheme() {
        // Simple theme toggle for demonstration
        document.body.classList.toggle('dark-theme');
        alert('Theme changed! (More themes coming soon)');
    }
    
    showNotification(title, message) {
        // Try to use browser notification API
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(title, { body: message });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification(title, { body: message });
                    }
                });
            }
        }
        
        // Fallback alert
        alert(`${title}\n${message}`);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        timer.toggleTimer();
    } else if (e.code === 'KeyR') {
        timer.resetTimer();
    } else if (e.code === 'KeyS') {
        timer.openSettings();
    }
});

// Initialize timer when page loads
let timer;
document.addEventListener('DOMContentLoaded', () => {
    timer = new TimerWidget();
    
    // Request notification permission on load
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && timer.isRunning) {
        // Optionally pause when tab is hidden
        // timer.pauseTimer();
    }
});

// Handle page unload
window.addEventListener('beforeunload', (e) => {
    if (timer.isRunning) {
        e.preventDefault();
        e.returnValue = 'Timer is running. Are you sure you want to leave?';
    }
});