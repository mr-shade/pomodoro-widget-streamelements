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

        // Check if using manual time setting
        if (this.fieldData.useManualTime) {
            // Use manual hours, minutes, seconds
            const manualHours = parseInt(this.fieldData.manualHours) || 0;
            const manualMinutes = parseInt(this.fieldData.manualMinutes) || 25;
            const manualSeconds = parseInt(this.fieldData.manualSeconds) || 0;
            
            if (this.stopwatchMode) {
                this.hours = 0;
                this.minutes = 0;
                this.seconds = 0;
            } else {
                this.hours = manualHours;
                this.minutes = manualMinutes;
                this.seconds = manualSeconds;
            }
        } else {
            // Convert total minutes to hours and minutes (existing logic)
            const totalMinutes = this.defaultMinutes;
            const convertedHours = Math.floor(totalMinutes / 60);
            const remainingMinutes = totalMinutes % 60;

            if (this.stopwatchMode) {
                this.hours = 0;
                this.minutes = 0;
                this.seconds = 0;
            } else {
                this.hours = convertedHours;
                this.minutes = remainingMinutes;
                this.seconds = 0;
            }
        }

        // Sound properties
        this.tickSoundEnabled = this.fieldData.enableTickSound === 'true';
        this.tickSoundFile = this.fieldData.tickSoundFile;
        this.tickSoundVolume = (this.fieldData.tickSoundVolume || 50) / 100;
        this.tickAudio = null;

        // Sound effects properties
        this.soundEffectsVolume = (this.fieldData.soundEffectsVolume || 70) / 100;
        this.enableStartSound = this.fieldData.enableStartSound === true;
        this.enablePauseSound = this.fieldData.enablePauseSound === true;
        this.enableCompleteSound = this.fieldData.enableCompleteSound !== false; // Default true
        this.startSoundFile = this.fieldData.startSoundFile;
        this.pauseSoundFile = this.fieldData.pauseSoundFile;
        this.completeSoundFile = this.fieldData.completeSoundFile;

        // Blacklist properties
        this.enableBlacklist = this.fieldData.enableBlacklist === true;
        this.blacklistUsers = this.fieldData.blacklistUsers ? 
            this.fieldData.blacklistUsers.toLowerCase().split(',').map(u => u.trim()) : [];
        
        // New comprehensive blacklist from fieldData
        this.blacklistedUsers = this.parseBlacklistedUsers(this.fieldData.blacklistedUsers);

        // Custom commands
        this.startCommand = this.fieldData.startCommand || '!start';
        this.pauseCommand = this.fieldData.pauseCommand || '!pause';
        this.resetCommand = this.fieldData.resetCommand || '!reset';

        console.log("PomodoroTimer initialized with field data:", this.fieldData);
        console.log("Stopwatch mode:", this.stopwatchMode);
        console.log("Manual time mode:", this.fieldData.useManualTime);
        console.log("Blacklist enabled:", this.enableBlacklist);
        
        this.initializeElements();
        this.initializeTickSound();
        this.applyCustomColors();
        this.updateDisplay();
        this.bindEvents();
        this.initializeCommands();
        this.initializeStreamElementsEvents();
    }

    parseBlacklistedUsers(blacklistString) {
        if (!blacklistString) return [];
        return blacklistString.split(',').map(user => user.trim().toLowerCase()).filter(user => user.length > 0);
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
            number.style.color = this.fieldData.timerTextColor || "#FFFFFF";
            number.style.fontFamily = this.fieldData.fontFamily || "Arial";
            number.style.fontSize = `${this.fieldData.fontSize || 48}px`;
            number.style.fontWeight = this.fieldData.fontWeight || "700";
        });

        const playButtonIcon = document.querySelector('.play-button svg path');
        if (playButtonIcon) {
            playButtonIcon.setAttribute('fill', this.fieldData.playBtnIconColor);
        }

        // Apply tag styling
        const timeLabels = document.querySelectorAll('.time-label');
        timeLabels.forEach(label => {
            label.style.backgroundColor = this.fieldData.tagColor || "#FFB6C1";
            label.style.color = this.fieldData.tagFontColor || "#333";
            label.style.fontSize = `${this.fieldData.tagFontSize || 8}px`;
            label.style.fontWeight = this.fieldData.tagFontWeight || "600";
        });

        // Apply card sizing to existing timeCards
        timeCards.forEach(card => {
            card.style.width = `${this.fieldData.cardWidth || 84}px`;
            card.style.height = `${this.fieldData.cardHeight || 80}px`;
        });
    }

    initializeCommands() {
        if (window.SE_API && window.SE_API.onMessage) {
            window.SE_API.onMessage((data) => {
                this.handleCommand(data);
            });
        }
    }

    handleCommand(data) {
        const message = data.message || data.text || data.renderedText || '';
        const command = message.toLowerCase().trim();
        const username = (data.username || data.displayName || data.nick || data.user_name || '').toLowerCase();
        
        // Determine user role from StreamElements data
        let userRole = this.determineUserRole(data);

        console.log("Pomodoro command received:", command, "from:", username, "role:", userRole);

        // Check if commands are enabled
        if (this.fieldData.commandsEnabled === false) {
            console.log("Commands are disabled");
            return;
        }

        // Check comprehensive blacklist
        if (this.isUserBlacklisted({ username: username })) {
            console.log("Command ignored - user is blacklisted:", username);
            return;
        }

        // Check legacy blacklist
        if (this.enableBlacklist && this.blacklistUsers.includes(username)) {
            console.log("Command ignored - user is in legacy blacklist:", username);
            return;
        }

        // Handle custom commands with role permissions
        if (command === this.startCommand.toLowerCase()) {
            if (this.hasPermission(userRole, this.fieldData.startCommandPermission)) {
                if (!this.isRunning) {
                    this.startTimer();
                    this.sendNotification('Pomodoro started! 🍅');
                } else {
                    console.log("Timer is already running");
                }
            } else {
                console.log(`User ${username} (${userRole}) not authorized for start command`);
            }
        } else if (command === this.pauseCommand.toLowerCase()) {
            if (this.hasPermission(userRole, this.fieldData.pauseCommandPermission)) {
                if (this.isRunning) {
                    this.pauseTimer();
                    this.sendNotification('Pomodoro paused ⏸️');
                } else {
                    console.log("Timer is not running");
                }
            } else {
                console.log(`User ${username} (${userRole}) not authorized for pause command`);
            }
        } else if (command === this.resetCommand.toLowerCase()) {
            if (this.hasPermission(userRole, this.fieldData.resetCommandPermission)) {
                this.resetTimer();
                this.sendNotification('Pomodoro reset 🔄');
            } else {
                console.log(`User ${username} (${userRole}) not authorized for reset command`);
            }
        }
    }

    determineUserRole(data) {
        // Handle StreamElements badge format
        const badges = data.badges || [];
        const badgeTypes = badges.map(badge => badge.type || badge.name || badge).filter(Boolean);
        
        // Also check tags for Twitch-style badges
        const tags = data.tags || {};
        const twitchBadges = tags.badges ? tags.badges.split(',').map(b => b.split('/')[0]) : [];
        
        // Combine all badge information
        const allBadges = [...badgeTypes, ...twitchBadges];
        
        // Check for broadcaster
        if (allBadges.includes('broadcaster') || allBadges.includes('streamer') || data.username === data.channel) {
            return 'broadcaster';
        }
        
        // Check for moderator
        if (allBadges.includes('moderator') || allBadges.includes('mod') || tags.mod === '1') {
            return 'moderator';
        }
        
        // Check for VIP
        if (allBadges.includes('vip') || tags.vip === '1') {
            return 'vip';
        }
        
        // Check for subscriber
        if (allBadges.includes('subscriber') || allBadges.includes('founder') || tags.subscriber === '1') {
            return 'subscriber';
        }
        
        return 'viewer';
    }

    hasPermission(userRole, requiredPermission) {
        if (!requiredPermission) return true; // Default allow if not specified
        
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

    initializeStreamElementsEvents() {
        console.log("Initializing StreamElements events and chat commands...");
        
        if (window.SE_API) {
            // Listen for StreamElements events (donations, follows, etc.)
            window.SE_API.onEvent = (event) => {
                this.handleStreamElementsEvent(event);
            };
        }
        
        // StreamElements event listener for chat messages
        window.addEventListener('onEventReceived', (obj) => {
            try {
                const data = obj.detail.event;
                const user = data.data?.nick || data.data?.user_name || 'unknown user';
                const role = data.data?.tags?.badges || 'viewer';

                console.log(`Message received - User: ${user} Role: ${role}`, data);

                if (data.renderedText) {
                    this.handleCommand({
                        ...data.data,
                        renderedText: data.renderedText,
                        username: user,
                        tags: data.data?.tags || {}
                    });
                }
            } catch (error) {
                console.error("Error handling chat command:", error);
            }
        });
        
        console.log("StreamElements events and chat commands initialized");
    }

    handleStreamElementsEvent(event) {
        const { type, username, amount } = event;
        const user = (username || '').toLowerCase();

        // Check blacklist for events
        if (this.enableBlacklist && this.blacklistUsers.includes(user)) {
            console.log("Event ignored - user is blacklisted:", user);
            return;
        }

        let timeToAdd = 0;

        switch (type) {
            case 'subscriber':
                if (this.fieldData.enableSubReward) {
                    timeToAdd = parseInt(this.fieldData.timePerSub) || 60;
                    this.sendNotification(`+${timeToAdd}s for ${username}'s subscription! 🎉`);
                }
                break;
            case 'follow':
                if (this.fieldData.enableFollowReward) {
                    timeToAdd = parseInt(this.fieldData.timePerFollow) || 30;
                    this.sendNotification(`+${timeToAdd}s for ${username}'s follow! 💜`);
                }
                break;
            case 'cheer':
                if (this.fieldData.enableCheerReward) {
                    const bits = parseInt(amount) || 0;
                    const perHundredBits = Math.floor(bits / 100);
                    timeToAdd = perHundredBits * (parseInt(this.fieldData.timePerCheer) || 10);
                    if (timeToAdd > 0) {
                        this.sendNotification(`+${timeToAdd}s for ${username}'s ${bits} bits! ⭐`);
                    }
                }
                break;
            case 'tip':
            case 'donation':
                if (this.fieldData.enableDonationReward) {
                    const dollars = parseFloat(amount) || 0;
                    timeToAdd = Math.floor(dollars * (parseInt(this.fieldData.timePerDonation) || 20));
                    if (timeToAdd > 0) {
                        this.sendNotification(`+${timeToAdd}s for ${username}'s $${dollars} donation! 💰`);
                    }
                }
                break;
            case 'raid':
                if (this.fieldData.enableRaidReward) {
                    timeToAdd = parseInt(this.fieldData.timePerRaid) || 120;
                    this.sendNotification(`+${timeToAdd}s for ${username}'s raid! 🚀`);
                }
                break;
            case 'host':
                if (this.fieldData.enableHostReward) {
                    timeToAdd = parseInt(this.fieldData.timePerHost) || 90;
                    this.sendNotification(`+${timeToAdd}s for ${username}'s host! 📺`);
                }
                break;
        }

        if (timeToAdd > 0) {
            this.addTime(timeToAdd);
        }
    }

    addTime(seconds) {
        this.seconds += seconds;
        
        // Handle overflow
        while (this.seconds >= 60) {
            this.seconds -= 60;
            this.minutes++;
            if (this.minutes >= 60) {
                this.minutes -= 60;
                this.hours++;
            }
        }
        
        this.updateDisplay();
        console.log(`Added ${seconds} seconds to timer`);
    }

    playSound(soundType) {
        let soundFile, enabled;
        
        switch (soundType) {
            case 'start':
                soundFile = this.startSoundFile;
                enabled = this.enableStartSound;
                break;
            case 'pause':
                soundFile = this.pauseSoundFile;
                enabled = this.enablePauseSound;
                break;
            case 'complete':
                soundFile = this.completeSoundFile;
                enabled = this.enableCompleteSound;
                break;
            default:
                return;
        }

        if (!enabled) return;

        if (soundFile) {
            try {
                const audio = new Audio(soundFile);
                audio.volume = this.soundEffectsVolume;
                audio.play().catch(error => {
                    console.log(`${soundType} sound play failed:`, error);
                });
            } catch (error) {
                console.error(`Error playing ${soundType} sound:`, error);
            }
        } else {
            // Fallback to generated sounds
            this.playFallbackSound(soundType);
        }
    }

    playFallbackSound(soundType) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            let frequency, duration;
            switch (soundType) {
                case 'start':
                    frequency = 600;
                    duration = 0.2;
                    break;
                case 'pause':
                    frequency = 400;
                    duration = 0.15;
                    break;
                case 'complete':
                    frequency = 800;
                    duration = 0.5;
                    break;
                default:
                    return;
            }

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(this.soundEffectsVolume * 0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.log(`Fallback ${soundType} sound not available:`, error);
        }
    }

    updateDisplay() {
        const hoursStr = this.hours.toString().padStart(2, '0');
        const minutesStr = this.minutes.toString().padStart(2, '0');

        // First card shows hours
        this.timeNumbers[0].textContent = hoursStr[0];
        this.timeNumbers[1].textContent = hoursStr[1];
        // Second card shows minutes
        this.timeNumbers[2].textContent = minutesStr[0];
        this.timeNumbers[3].textContent = minutesStr[1];
        
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
        this.playSound('start');

        this.interval = setInterval(() => {
            this.tick();
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        this.updatePlayButton();
        this.playSound('pause');

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
                if (this.minutes >= 60) {
                    this.minutes = 0;
                    this.hours++;
                }
            }
        } else {
            // Countdown mode: count down
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
                this.timerComplete();
                return;
            }
        }

        this.updateDisplay();
    }

    timerComplete() {
        this.pauseTimer();
        this.playSound('complete');
        alert('Pomodoro completed!');
        this.resetTimer();
    }

    resetTimer() {
        this.pauseTimer();
        if (this.stopwatchMode) {
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
        } else {
            // Check if using manual time setting
            if (this.fieldData.useManualTime) {
                this.hours = parseInt(this.fieldData.manualHours) || 0;
                this.minutes = parseInt(this.fieldData.manualMinutes) || 25;
                this.seconds = parseInt(this.fieldData.manualSeconds) || 0;
            } else {
                // Convert total minutes to hours and minutes
                const totalMinutes = this.defaultMinutes;
                const convertedHours = Math.floor(totalMinutes / 60);
                const remainingMinutes = totalMinutes % 60;
                
                this.hours = convertedHours;
                this.minutes = remainingMinutes;
                this.seconds = 0;
            }
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
        this.applyCustomColors(); // Re-apply all styling including fonts
        
        console.log('Widget settings updated:', {
            tickEnabled: this.tickSoundEnabled,
            tickFile: this.tickSoundFile,
            tickVolume: this.tickSoundVolume,
            fontFamily: this.fieldData.fontFamily,
            fontSize: this.fieldData.fontSize,
            fontWeight: this.fieldData.fontWeight
        });
    }
}
