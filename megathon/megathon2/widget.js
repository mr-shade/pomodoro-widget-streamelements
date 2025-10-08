// StreamElements Marathon Timer Widget
window.addEventListener('onWidgetLoad', function (obj) {
    console.log("StreamElements Marathon widget loaded");
    
    // Get field data from StreamElements
    const fieldData = obj.detail.fieldData;
    console.log("Marathon field data:", fieldData);
    
    // Initialize the marathon timer
    window.marathonTimer = new MarathonTimer(fieldData);
});

class MarathonTimer {
    constructor(fieldData) {
        this.fieldData = fieldData;
        this.isRunning = false;
        this.interval = null;
        this.isLocked = false;
        
        // Initialize timer with starting values
        this.hours = parseInt(this.fieldData.startingHours) || 10;
        this.minutes = parseInt(this.fieldData.startingMinutes) || 0;
        this.seconds = parseInt(this.fieldData.startingSeconds) || 0;
        
        // Store original starting values
        this.originalHours = this.hours;
        this.originalMinutes = this.minutes;
        this.originalSeconds = this.seconds;
        
        // Cap limits
        this.maxCapHours = parseInt(this.fieldData.maxCapHours) || 24;
        this.maxCapMinutes = parseInt(this.fieldData.maxCapMinutes) || 0;
        
        // Warning threshold
        this.warningThreshold = (parseInt(this.fieldData.warningThresholdMinutes) || 5) * 60; // Convert to seconds
        this.isWarning = false;
        
        // Special modes
        this.powerUpMode = {
            active: false,
            multiplier: 1,
            endTime: null,
            type: '1x'
        };
        
        this.sleepMode = {
            active: false,
            endTime: null,
            reduction: parseFloat(this.fieldData.sleepModeReduction) || 0.5
        };
        
        // Blacklist and permissions
        this.blacklistedUsers = this.parseBlacklistedUsers(this.fieldData.blacklistedUsers);
        
        // Commands
        this.startCommand = this.fieldData.marathonStartCommand || '!marathon-start';
        this.pauseCommand = this.fieldData.marathonPauseCommand || '!marathon-pause';
        this.resetCommand = this.fieldData.marathonResetCommand || '!marathon-reset';
        this.powerUpCommand = this.fieldData.marathonPowerUpCommand || '!marathon-powerup';
        this.sleepCommand = this.fieldData.marathonSleepCommand || '!marathon-sleep';
        
        // Sound properties
        this.soundVolume = (this.fieldData.soundVolume || 70) / 100;
        
        // Confetti properties
        this.confettiParticles = [];
        this.confettiCanvas = null;
        this.confettiCtx = null;
        
        console.log("MarathonTimer initialized:", {
            startTime: `${this.hours}:${this.minutes}:${this.seconds}`,
            maxCap: `${this.maxCapHours}:${this.maxCapMinutes}`,
            warningThreshold: this.warningThreshold
        });
        
        this.init();
    }
    
    init() {
        this.initializeElements();
        this.initializeConfetti();
        this.applyCustomStyling();
        this.updateDisplay();
        this.bindEvents();
        this.initializeStreamElementsEvents();
    }
    
    parseBlacklistedUsers(blacklistString) {
        if (!blacklistString) return [];
        return blacklistString.split(',').map(user => user.trim().toLowerCase()).filter(user => user.length > 0);
    }
    
    initializeElements() {
        this.playButton = document.querySelector('.play-button');
        this.timeNumbers = document.querySelectorAll('.time-number');
        this.hoursElements = document.querySelectorAll('.hours .time-number');
        this.minutesElements = document.querySelectorAll('.minutes .time-number');
        this.secondsElement = document.querySelector('.secondcard');
        this.timerWidget = document.querySelector('.timer-widget');
    }
    
    initializeConfetti() {
        // Create confetti canvas if not exists
        if (!document.getElementById('confetti-canvas')) {
            this.confettiCanvas = document.createElement('canvas');
            this.confettiCanvas.id = 'confetti-canvas';
            this.confettiCanvas.style.position = 'fixed';
            this.confettiCanvas.style.top = '0';
            this.confettiCanvas.style.left = '0';
            this.confettiCanvas.style.width = '100%';
            this.confettiCanvas.style.height = '100%';
            this.confettiCanvas.style.pointerEvents = 'none';
            this.confettiCanvas.style.zIndex = '1000';
            document.body.appendChild(this.confettiCanvas);
        } else {
            this.confettiCanvas = document.getElementById('confetti-canvas');
        }
        
        if (this.confettiCanvas) {
            this.confettiCtx = this.confettiCanvas.getContext('2d');
            this.resizeConfettiCanvas();
            window.addEventListener('resize', () => this.resizeConfettiCanvas());
        }
    }
    
    resizeConfettiCanvas() {
        if (this.confettiCanvas) {
            this.confettiCanvas.width = window.innerWidth;
            this.confettiCanvas.height = window.innerHeight;
        }
    }
    
    applyCustomStyling() {
        if (this.timerWidget) {
            this.timerWidget.style.backgroundColor = this.fieldData.timerBackgroundColor || "#010161";
            this.timerWidget.style.borderColor = this.fieldData.timerBorderColor || "#fcfabc";
        }
        
        // Apply number colors
        this.timeNumbers.forEach(number => {
            number.style.color = this.fieldData.numberColor || "#ffffff";
        });
        
        if (this.secondsElement) {
            this.secondsElement.style.color = this.fieldData.numberColor || "#ffffff";
        }
        
        // Apply control button colors
        const controlButtons = document.querySelectorAll('.control');
        controlButtons.forEach(button => {
            if (button.classList.contains('play-button')) {
                button.style.backgroundColor = this.fieldData.playButtonColor || "#63B3ED";
            } else {
                button.style.backgroundColor = this.fieldData.controlButtonColor || "#6caaff";
            }
        });
    }
    
    bindEvents() {
        if (this.playButton) {
            this.playButton.addEventListener('click', () => {
                if (!this.isLocked) {
                    if (this.isRunning) {
                        this.pauseTimer();
                    } else {
                        this.startTimer();
                    }
                }
            });
        }
    }
    
    initializeStreamElementsEvents() {
        console.log("Initializing StreamElements events...");
        
        // Listen for chat commands
        window.addEventListener('onEventReceived', (obj) => {
            try {
                const data = obj.detail.event;
                const listener = obj.detail.listener;
                
                if (listener === 'message') {
                    this.handleChatCommand(data);
                } else {
                    this.handleStreamElementsEvent(listener, data);
                }
            } catch (error) {
                console.error("Error handling StreamElements event:", error);
            }
        });
        
        console.log("StreamElements events initialized");
    }
    
    handleChatCommand(data) {
        if (!this.fieldData.commandsEnabled) return;
        
        const message = data.text || data.renderedText || '';
        const username = (data.nick || data.displayName || '').toLowerCase();
        const userRole = this.determineUserRole(data);
        
        console.log("Marathon command received:", message, "from:", username, "role:", userRole);
        
        // Check blacklist
        if (this.isUserBlacklisted({ username: username })) {
            console.log("Command ignored - user is blacklisted:", username);
            return;
        }
        
        const parts = message.trim().split(' ');
        const command = parts[0].toLowerCase();
        
        // Handle commands
        if (command === this.startCommand.toLowerCase()) {
            if (this.hasPermission(userRole, this.fieldData.startPermission)) {
                this.startTimer();
            }
        } else if (command === this.pauseCommand.toLowerCase()) {
            if (this.hasPermission(userRole, this.fieldData.pausePermission)) {
                this.pauseTimer();
            }
        } else if (command === this.resetCommand.toLowerCase()) {
            if (this.hasPermission(userRole, this.fieldData.resetPermission)) {
                this.resetTimer();
            }
        } else if (command === this.powerUpCommand.toLowerCase()) {
            this.handlePowerUpCommand(parts, userRole, username);
        } else if (command === this.sleepCommand.toLowerCase()) {
            this.handleSleepCommand(parts, userRole, username);
        }
    }
    
    handlePowerUpCommand(parts, userRole, username) {
        if (!this.fieldData.enablePowerUp) return;
        
        const multiplierStr = parts[1] || '2x';
        const durationStr = parts[2] || this.fieldData.powerUpDefaultDuration;
        
        let multiplier = 2;
        let requiredPermission = this.fieldData.powerUp2xPermission;
        
        if (multiplierStr === '3x') {
            multiplier = 3;
            requiredPermission = this.fieldData.powerUp3xPermission;
        } else if (multiplierStr === '5x') {
            multiplier = 5;
            requiredPermission = this.fieldData.powerUp5xPermission;
        }
        
        if (this.hasPermission(userRole, requiredPermission)) {
            const duration = parseInt(durationStr) || this.fieldData.powerUpDefaultDuration;
            this.activatePowerUp(multiplier, duration, username);
        } else {
            console.log(`User ${username} not authorized for ${multiplierStr} power-up`);
        }
    }
    
    handleSleepCommand(parts, userRole, username) {
        if (!this.fieldData.enableSleepMode) return;
        
        if (this.hasPermission(userRole, this.fieldData.sleepModePermission)) {
            const duration = parseInt(parts[1]) || this.fieldData.sleepModeDefaultDuration;
            this.activateSleepMode(duration, username);
        } else {
            console.log(`User ${username} not authorized for sleep mode`);
        }
    }
    
    handleStreamElementsEvent(listener, data) {
        if (this.isLocked) return;
        
        let timeToAdd = 0;
        let eventType = '';
        
        switch (listener) {
            case 'follower-latest':
                timeToAdd = this.fieldData.followReward || 30;
                eventType = 'Follow';
                break;
                
            case 'subscriber-latest':
                timeToAdd = this.calculateSubReward(data);
                eventType = 'Subscription';
                break;
                
            case 'cheer-latest':
                const bits = parseInt(data.amount) || 0;
                timeToAdd = Math.floor(bits / 100) * (this.fieldData.cheerRewardPer100 || 10);
                eventType = 'Cheer';
                break;
                
            case 'tip-latest':
                const amount = parseFloat(data.amount) || 0;
                timeToAdd = Math.floor(amount) * (this.fieldData.donationRewardPerDollar || 20);
                eventType = 'Donation';
                break;
                
            case 'raid-latest':
                timeToAdd = this.fieldData.raidReward || 120;
                eventType = 'Raid';
                break;
                
            case 'host-latest':
                timeToAdd = this.fieldData.hostReward || 90;
                eventType = 'Host';
                break;
        }
        
        if (timeToAdd > 0) {
            this.addTime(timeToAdd, eventType, data.name || data.username || 'Anonymous');
        }
    }
    
    calculateSubReward(data) {
        const tier = data.tier || 1;
        const amount = data.amount || 1; // For gift subs
        
        let baseReward = this.fieldData.tier1SubReward || 60;
        
        if (tier === 2) {
            baseReward = this.fieldData.tier2SubReward || 120;
        } else if (tier === 3) {
            baseReward = this.fieldData.tier3SubReward || 360;
        }
        
        return baseReward * amount;
    }
    
    addTime(seconds, eventType, username) {
        // Apply power-up multiplier
        if (this.powerUpMode.active) {
            seconds *= this.powerUpMode.multiplier;
        }
        
        // Apply sleep mode reduction
        if (this.sleepMode.active) {
            seconds *= this.sleepMode.reduction;
        }
        
        // Add time to timer
        this.seconds += Math.floor(seconds);
        this.normalizeTime();
        
        // Check cap limit
        this.enforceCap();
        
        this.updateDisplay();
        this.showTimeAddedPopup(seconds, eventType, username);
        
        console.log(`Added ${seconds}s from ${eventType} by ${username}`);
    }
    
    normalizeTime() {
        if (this.seconds >= 60) {
            this.minutes += Math.floor(this.seconds / 60);
            this.seconds = this.seconds % 60;
        }
        
        if (this.minutes >= 60) {
            this.hours += Math.floor(this.minutes / 60);
            this.minutes = this.minutes % 60;
        }
    }
    
    enforceCap() {
        const maxTotalSeconds = (this.maxCapHours * 3600) + (this.maxCapMinutes * 60);
        const currentTotalSeconds = (this.hours * 3600) + (this.minutes * 60) + this.seconds;
        
        if (currentTotalSeconds > maxTotalSeconds) {
            this.hours = this.maxCapHours;
            this.minutes = this.maxCapMinutes;
            this.seconds = 0;
        }
    }
    
    activatePowerUp(multiplier, durationMinutes, username) {
        this.powerUpMode = {
            active: true,
            multiplier: multiplier,
            endTime: Date.now() + (durationMinutes * 60 * 1000),
            type: `${multiplier}x`
        };
        
        this.showPowerUpPopup(multiplier, durationMinutes, username);
        this.updatePowerUpDisplay();
        
        // Auto-deactivate after duration
        setTimeout(() => {
            if (this.powerUpMode.active && Date.now() >= this.powerUpMode.endTime) {
                this.deactivatePowerUp();
            }
        }, durationMinutes * 60 * 1000);
    }
    
    deactivatePowerUp() {
        this.powerUpMode = {
            active: false,
            multiplier: 1,
            endTime: null,
            type: '1x'
        };
        this.updatePowerUpDisplay();
    }
    
    activateSleepMode(durationMinutes, username) {
        this.sleepMode = {
            active: true,
            endTime: Date.now() + (durationMinutes * 60 * 1000),
            reduction: this.sleepMode.reduction
        };
        
        this.showSleepModePopup(durationMinutes, username);
        this.updateSleepModeDisplay();
        
        // Auto-deactivate after duration
        setTimeout(() => {
            if (this.sleepMode.active && Date.now() >= this.sleepMode.endTime) {
                this.deactivateSleepMode();
            }
        }, durationMinutes * 60 * 1000);
    }
    
    deactivateSleepMode() {
        this.sleepMode = {
            active: false,
            endTime: null,
            reduction: this.sleepMode.reduction
        };
        this.updateSleepModeDisplay();
    }
    
    startTimer() {
        if (this.isRunning || this.isLocked) return;
        
        this.isRunning = true;
        this.interval = setInterval(() => {
            this.tick();
        }, 1000);
        
        this.updatePlayButton();
        this.playSound('start');
        console.log("Marathon timer started");
    }
    
    pauseTimer() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.interval);
        this.interval = null;
        
        this.updatePlayButton();
        this.playSound('pause');
        console.log("Marathon timer paused");
    }
    
    resetTimer() {
        this.pauseTimer();
        this.isLocked = false;
        
        this.hours = this.originalHours;
        this.minutes = this.originalMinutes;
        this.seconds = this.originalSeconds;
        
        this.updateDisplay();
        console.log("Marathon timer reset");
    }
    
    tick() {
        // Count down
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
            // Timer reached 00:00
            this.timerComplete();
            return;
        }
        
        this.updateDisplay();
        this.checkWarningState();
    }
    
    timerComplete() {
        this.pauseTimer();
        
        if (this.fieldData.autoLockOnZero) {
            this.isLocked = true;
        }
        
        this.playSound('complete');
        
        if (this.fieldData.enableConfetti) {
            this.startConfetti();
        }
        
        console.log("Marathon timer completed!");
    }
    
    checkWarningState() {
        const totalSeconds = (this.hours * 3600) + (this.minutes * 60) + this.seconds;
        const shouldWarn = totalSeconds <= this.warningThreshold;
        
        if (shouldWarn !== this.isWarning) {
            this.isWarning = shouldWarn;
            this.updateWarningDisplay();
            
            if (this.isWarning) {
                this.playSound('warning');
            }
        }
    }
    
    updateDisplay() {
        // Update hours
        if (this.hoursElements.length >= 2) {
            const hoursStr = this.hours.toString().padStart(2, '0');
            this.hoursElements[0].textContent = hoursStr[0];
            this.hoursElements[1].textContent = hoursStr[1];
        }
        
        // Update minutes
        if (this.minutesElements.length >= 2) {
            const minutesStr = this.minutes.toString().padStart(2, '0');
            this.minutesElements[0].textContent = minutesStr[0];
            this.minutesElements[1].textContent = minutesStr[1];
        }
        
        // Update seconds
        if (this.secondsElement) {
            this.secondsElement.textContent = this.seconds.toString().padStart(2, '0');
        }
    }
    
    updatePlayButton() {
        if (!this.playButton) return;
        
        const svg = this.playButton.querySelector('svg path');
        if (svg) {
            if (this.isRunning) {
                // Pause icon
                svg.setAttribute('d', 'M6 4h4v16H6V4zm8 0h4v16h-4V4z');
            } else {
                // Play icon
                svg.setAttribute('d', 'M8 5V19L19 12L8 5Z');
            }
        }
    }
    
    updateWarningDisplay() {
        const color = this.isWarning ? this.fieldData.warningColor || '#ff0000' : this.fieldData.numberColor || '#ffffff';
        
        this.timeNumbers.forEach(number => {
            number.style.color = color;
            if (this.isWarning) {
                number.style.animation = 'blink 1s infinite';
            } else {
                number.style.animation = 'none';
            }
        });
        
        if (this.secondsElement) {
            this.secondsElement.style.color = color;
            if (this.isWarning) {
                this.secondsElement.style.animation = 'blink 1s infinite';
            } else {
                this.secondsElement.style.animation = 'none';
            }
        }
    }
    
    updatePowerUpDisplay() {
        // Add visual indicator for power-up mode
        if (this.powerUpMode.active) {
            this.timerWidget.classList.add('power-up-active');
            this.timerWidget.setAttribute('data-multiplier', this.powerUpMode.type);
        } else {
            this.timerWidget.classList.remove('power-up-active');
            this.timerWidget.removeAttribute('data-multiplier');
        }
    }
    
    updateSleepModeDisplay() {
        // Add visual indicator for sleep mode
        if (this.sleepMode.active) {
            this.timerWidget.classList.add('sleep-mode-active');
        } else {
            this.timerWidget.classList.remove('sleep-mode-active');
        }
    }
    
    showTimeAddedPopup(seconds, eventType, username) {
        // Create popup element
        const popup = document.createElement('div');
        popup.className = 'time-added-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <div class="time-added">+${Math.floor(seconds)}s</div>
                <div class="event-info">${eventType} by ${username}</div>
                ${this.powerUpMode.active ? `<div class="multiplier">${this.powerUpMode.type}</div>` : ''}
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Animate and remove
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 500);
        }, 3000);
    }
    
    showPowerUpPopup(multiplier, duration, username) {
        const popup = document.createElement('div');
        popup.className = 'power-up-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <div class="power-up-title">${multiplier}x POWER-UP ACTIVATED!</div>
                <div class="power-up-info">Duration: ${duration} minutes</div>
                <div class="power-up-user">Activated by ${username}</div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 500);
        }, 5000);
    }
    
    showSleepModePopup(duration, username) {
        const popup = document.createElement('div');
        popup.className = 'sleep-mode-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <div class="sleep-title">😴 SLEEP MODE ACTIVATED</div>
                <div class="sleep-info">Reduced rewards for ${duration} minutes</div>
                <div class="sleep-user">Activated by ${username}</div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 500);
        }, 5000);
    }
    
    startConfetti() {
        if (!this.confettiCtx) return;
        
        const colors = [
            this.fieldData.confettiColor1 || '#ff6b6b',
            this.fieldData.confettiColor2 || '#4ecdc4',
            this.fieldData.confettiColor3 || '#45b7d1',
            this.fieldData.confettiColor4 || '#96ceb4'
        ];
        
        const explosionCount = this.fieldData.confettiExplosionCount || 3;
        const duration = (this.fieldData.confettiAnimationDuration || 5) * 1000;
        
        for (let i = 0; i < explosionCount; i++) {
            setTimeout(() => {
                this.createConfettiBurst(colors);
            }, i * 500);
        }
        
        // Clear after animation duration
        setTimeout(() => {
            this.clearConfetti();
        }, duration);
    }
    
    createConfettiBurst(colors) {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.confettiParticles.push({
                x: Math.random() * this.confettiCanvas.width,
                y: -10,
                vx: Math.random() * 6 - 3,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5,
                size: Math.random() * 8 + 3,
                gravity: 0.1
            });
        }
        
        this.animateConfetti();
    }
    
    animateConfetti() {
        if (!this.confettiCtx || this.confettiParticles.length === 0) return;
        
        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        
        for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
            const particle = this.confettiParticles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            particle.rotation += particle.rotationSpeed;
            
            if (particle.y > this.confettiCanvas.height) {
                this.confettiParticles.splice(i, 1);
                continue;
            }
            
            this.confettiCtx.save();
            this.confettiCtx.translate(particle.x, particle.y);
            this.confettiCtx.rotate(particle.rotation * Math.PI / 180);
            this.confettiCtx.fillStyle = particle.color;
            this.confettiCtx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            this.confettiCtx.restore();
        }
        
        if (this.confettiParticles.length > 0) {
            requestAnimationFrame(() => this.animateConfetti());
        }
    }
    
    clearConfetti() {
        this.confettiParticles = [];
        if (this.confettiCtx) {
            this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        }
    }
    
    playSound(soundType) {
        if (!this.fieldData.enableSounds) return;
        
        let soundFile = '';
        
        switch (soundType) {
            case 'start':
                soundFile = this.fieldData.startSound;
                break;
            case 'pause':
                soundFile = this.fieldData.pauseSound;
                break;
            case 'complete':
                soundFile = this.fieldData.completeSound;
                break;
            case 'warning':
                soundFile = this.fieldData.warningSound;
                break;
        }
        
        if (soundFile) {
            try {
                const audio = new Audio(soundFile);
                audio.volume = this.soundVolume;
                audio.play();
            } catch (error) {
                console.log('Sound playback failed:', error);
            }
        }
    }
    
    determineUserRole(data) {
        const badges = data.badges || [];
        const badgeTypes = badges.map(badge => badge.type || badge.name || badge).filter(Boolean);
        
        const tags = data.tags || {};
        const twitchBadges = tags.badges ? tags.badges.split(',').map(b => b.split('/')[0]) : [];
        
        const allBadges = [...badgeTypes, ...twitchBadges];
        
        if (allBadges.includes('broadcaster') || allBadges.includes('streamer')) {
            return 'broadcaster';
        }
        
        if (allBadges.includes('moderator') || allBadges.includes('mod') || tags.mod === '1') {
            return 'moderator';
        }
        
        if (allBadges.includes('vip') || tags.vip === '1') {
            return 'vip';
        }
        
        if (allBadges.includes('subscriber') || allBadges.includes('founder') || tags.subscriber === '1') {
            return 'subscriber';
        }
        
        return 'viewer';
    }
    
    hasPermission(userRole, requiredPermission) {
        if (!requiredPermission) return true;
        
        const permission = requiredPermission.toLowerCase();
        
        switch (permission) {
            case 'broadcaster':
                return userRole === 'broadcaster';
            case 'moderator':
                return userRole === 'broadcaster' || userRole === 'moderator';
            case 'vip':
                return userRole === 'broadcaster' || userRole === 'moderator' || userRole === 'vip';
            case 'subscriber':
                return userRole === 'broadcaster' || userRole === 'moderator' || userRole === 'vip' || userRole === 'subscriber';
            case 'everyone':
            default:
                return true;
        }
    }
    
    isUserBlacklisted(data) {
        if (!data.username) return false;
        const username = data.username.toLowerCase();
        return this.blacklistedUsers.includes(username);
    }
}
