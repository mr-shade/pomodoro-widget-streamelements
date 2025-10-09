// Megathon Quest Widget - Surprise Interactive Challenges
class QuestSystem {
    constructor(fieldData) {
        this.fieldData = fieldData;
        
        // Quest pool and state
        this.questPool = [];
        this.completedQuests = [];
        this.currentQuest = null;
        this.isPaused = false;
        this.points = 0;
        
        // Timers
        this.questTimer = null;
        this.questRollInterval = null;
        this.questTimeRemaining = 0;
        
        // Confetti system
        this.confettiParticles = [];
        this.confettiCanvas = null;
        this.confettiCtx = null;
        this.confettiAnimationId = null;
        
        // Audio
        this.sounds = {
            newQuest: null,
            warning: null,
            completed: null,
            failed: null
        };
        
        // Settings
        this.testingMode = this.fieldData.testingMode === 'true';
        this.rollStyle = this.fieldData.rollStyle || 'default'; // 'default' or 'deplete'
        this.questInterval = parseInt(this.fieldData.questInterval) || 10; // minutes
        this.questChance = parseInt(this.fieldData.questChance) || 100; // percentage
        this.pointsToComplete = parseInt(this.fieldData.pointsToComplete) || 500;
        this.exitDuration = parseInt(this.fieldData.exitDuration) || 5000; // ms
        this.warningTime = parseInt(this.fieldData.warningTime) || 30; // seconds
        this.expireTime = parseInt(this.fieldData.expireTime) || 300; // seconds
        
        // Commands
        this.pauseCommand = this.fieldData.questPauseCommand || '!questpause';
        this.resumeCommand = this.fieldData.questResumeCommand || '!questresume';
        
        this.init();
    }
    
    init() {
        this.initializeDOM();
        this.initializeConfetti();
        this.loadQuests();
        this.loadSounds();
        this.applyCustomStyling();
        
        if (!this.testingMode) {
            this.startQuestRolls();
        } else {
            console.log('[QUEST TEST MODE] Quest system in testing mode');
            this.showTestQuest();
        }
    }
    
    initializeDOM() {
        this.container = document.getElementById('quest-container');
        this.card = document.getElementById('quest-card');
        this.statusText = document.querySelector('.quest-status-text');
        this.timerDisplay = document.querySelector('.quest-timer-display');
        this.titleElement = document.querySelector('.quest-title');
        this.descElement = document.querySelector('.quest-description');
        this.progressBar = document.querySelector('.quest-progress-bar');
        this.progressText = document.querySelector('.quest-progress-text');
        
        if (this.testingMode) {
            this.container.classList.add('testing-mode');
        }
    }
    
    initializeConfetti() {
        this.confettiCanvas = document.getElementById('quest-confetti-canvas');
        if (this.confettiCanvas) {
            this.confettiCtx = this.confettiCanvas.getContext('2d');
            this.resizeConfettiCanvas();
            window.addEventListener('resize', () => this.resizeConfettiCanvas());
        }
    }
    
    resizeConfettiCanvas() {
        this.confettiCanvas.width = window.innerWidth;
        this.confettiCanvas.height = window.innerHeight;
    }
    
    loadQuests() {
        // Parse quests from field data
        const questNames = (this.fieldData.questNames || '').split(',').map(s => s.trim()).filter(s => s);
        const questDescriptions = (this.fieldData.questDescriptions || '').split(',').map(s => s.trim()).filter(s => s);
        const questPoints = (this.fieldData.questPoints || '').split(',').map(s => parseInt(s.trim()) || this.pointsToComplete);
        
        // Create quest pool
        for (let i = 0; i < questNames.length; i++) {
            this.questPool.push({
                id: `quest_${i}`,
                name: questNames[i] || `Quest ${i + 1}`,
                description: questDescriptions[i] || 'Complete this challenge!',
                pointsRequired: questPoints[i] || this.pointsToComplete,
                completed: false
            });
        }
        
        // If no quests defined, add defaults
        if (this.questPool.length === 0) {
            this.questPool = [
                { id: 'quest_1', name: 'Sub Squad', description: 'Get 5 new subscribers!', pointsRequired: 500 },
                { id: 'quest_2', name: 'Bit Bonanza', description: 'Collect 1000 bits!', pointsRequired: 1000 },
                { id: 'quest_3', name: 'Donation Drive', description: 'Receive $50 in donations!', pointsRequired: 500 },
                { id: 'quest_4', name: 'Follower Frenzy', description: 'Gain 10 new followers!', pointsRequired: 300 },
                { id: 'quest_5', name: 'Raid Rally', description: 'Get raided by 50+ viewers!', pointsRequired: 250 }
            ];
        }
        
        console.log('[QUEST] Loaded quests:', this.questPool);
    }
    
    loadSounds() {
        const loadSound = (url, volume) => {
            if (!url) return null;
            const audio = new Audio(url);
            audio.volume = (volume || 70) / 100;
            return audio;
        };
        
        this.sounds.newQuest = loadSound(this.fieldData.newQuestSound, this.fieldData.newQuestVolume);
        this.sounds.warning = loadSound(this.fieldData.warningSound, this.fieldData.warningVolume);
        this.sounds.completed = loadSound(this.fieldData.completedSound, this.fieldData.completedVolume);
        this.sounds.failed = loadSound(this.fieldData.failedSound, this.fieldData.failedVolume);
    }
    
    applyCustomStyling() {
        const root = document.documentElement;
        
        // Colors
        root.style.setProperty('--quest-bg-color', this.fieldData.questBgColor || '#1a1a2e');
        root.style.setProperty('--quest-border-color', this.fieldData.questBorderColor || '#ffd700');
        root.style.setProperty('--quest-border-width', (this.fieldData.questBorderWidth || 3) + 'px');
        root.style.setProperty('--quest-border-radius', (this.fieldData.questBorderRadius || 20) + 'px');
        root.style.setProperty('--quest-status-color', this.fieldData.questStatusColor || '#ffd700');
        root.style.setProperty('--quest-warning-color', this.fieldData.questWarningColor || '#ff4500');
        root.style.setProperty('--quest-complete-color', this.fieldData.questCompleteColor || '#00ff7f');
        root.style.setProperty('--quest-failed-color', this.fieldData.questFailedColor || '#dc143c');
        root.style.setProperty('--quest-title-color', this.fieldData.questTitleColor || '#ffffff');
        root.style.setProperty('--quest-desc-color', this.fieldData.questDescColor || '#b0b0b0');
        root.style.setProperty('--quest-timer-color', this.fieldData.questTimerColor || '#ffffff');
        root.style.setProperty('--quest-progress-color', this.fieldData.questProgressColor || '#ffd700');
        root.style.setProperty('--quest-progress-color-end', this.fieldData.questProgressColorEnd || '#f59e0b');
        
        // Glow colors
        root.style.setProperty('--quest-glow-color', this.hexToRgba(this.fieldData.questGlowColor || '#ffd700', 0.3));
        root.style.setProperty('--quest-warning-glow-color', this.hexToRgba(this.fieldData.questWarningGlowColor || '#ff4500', 0.4));
        root.style.setProperty('--quest-complete-glow-color', this.hexToRgba(this.fieldData.questCompleteGlowColor || '#00ff7f', 0.4));
        root.style.setProperty('--quest-failed-glow-color', this.hexToRgba(this.fieldData.questFailedGlowColor || '#dc143c', 0.4));
        
        // Fonts
        root.style.setProperty('--quest-font-family', this.fieldData.questFontFamily || 'Inter');
        root.style.setProperty('--quest-title-font-size', (this.fieldData.questTitleFontSize || 26) + 'px');
        root.style.setProperty('--quest-desc-font-size', (this.fieldData.questDescFontSize || 16) + 'px');
        root.style.setProperty('--quest-status-font-size', (this.fieldData.questStatusFontSize || 18) + 'px');
        root.style.setProperty('--quest-timer-font-size', (this.fieldData.questTimerFontSize || 24) + 'px');
        
        // Sizing
        root.style.setProperty('--quest-width', (this.fieldData.questWidth || 450) + 'px');
        
        // Position
        root.style.setProperty('--quest-position-top', this.fieldData.questPositionTop || '50%');
        root.style.setProperty('--quest-position-left', this.fieldData.questPositionLeft || '50%');
    }
    
    hexToRgba(hex, alpha) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return `rgba(255, 215, 0, ${alpha})`;
        return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
    }
    
    startQuestRolls() {
        if (this.isPaused) return;
        
        // Roll for new quest at intervals
        this.questRollInterval = setInterval(() => {
            if (!this.isPaused && !this.currentQuest) {
                this.attemptQuestRoll();
            }
        }, this.questInterval * 60 * 1000); // Convert minutes to ms
        
        console.log(`[QUEST] Quest rolls every ${this.questInterval} minutes with ${this.questChance}% chance`);
    }
    
    attemptQuestRoll() {
        // Check if we should spawn a quest based on chance
        const roll = Math.random() * 100;
        if (roll > this.questChance) {
            console.log(`[QUEST] Roll failed: ${roll.toFixed(1)}% (need ${this.questChance}%)`);
            return;
        }
        
        // Get available quests
        let availableQuests = [];
        
        if (this.rollStyle === 'deplete') {
            // In deplete mode, only show quests not completed
            availableQuests = this.questPool.filter(q => !this.completedQuests.includes(q.id));
            if (availableQuests.length === 0) {
                console.log('[QUEST] All quests completed in deplete mode');
                return;
            }
        } else {
            // Default mode: all quests except the last one shown
            const lastQuestId = this.currentQuest ? this.currentQuest.id : null;
            availableQuests = this.questPool.filter(q => q.id !== lastQuestId);
        }
        
        // Pick random quest
        const quest = availableQuests[Math.floor(Math.random() * availableQuests.length)];
        this.showQuest(quest);
    }
    
    showQuest(quest) {
        this.currentQuest = { ...quest };
        this.points = 0;
        this.questTimeRemaining = this.expireTime;
        
        // Update UI
        this.statusText.textContent = 'NEW QUEST!';
        this.titleElement.textContent = quest.name;
        this.descElement.textContent = quest.description;
        this.updateProgress();
        this.updateTimer();
        
        // Show container
        this.container.classList.remove('quest-hidden', 'quest-warning', 'quest-completed', 'quest-failed');
        this.container.classList.add('quest-visible');
        
        // Play sound
        this.playSound(this.sounds.newQuest);
        
        // Start timer
        this.startQuestTimer();
        
        console.log('[QUEST] New quest:', quest.name);
    }
    
    showTestQuest() {
        // Show first quest for testing
        if (this.questPool.length > 0) {
            this.showQuest(this.questPool[0]);
        }
    }
    
    startQuestTimer() {
        this.clearQuestTimer();
        
        this.questTimer = setInterval(() => {
            this.questTimeRemaining--;
            this.updateTimer();
            
            // Warning state
            if (this.questTimeRemaining <= this.warningTime && !this.container.classList.contains('quest-warning')) {
                this.container.classList.add('quest-warning');
                this.playSound(this.sounds.warning);
            }
            
            // Quest expired
            if (this.questTimeRemaining <= 0) {
                this.failQuest();
            }
        }, 1000);
    }
    
    clearQuestTimer() {
        if (this.questTimer) {
            clearInterval(this.questTimer);
            this.questTimer = null;
        }
    }
    
    updateTimer() {
        const minutes = Math.floor(this.questTimeRemaining / 60);
        const seconds = this.questTimeRemaining % 60;
        this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateProgress() {
        const percentage = Math.min(100, (this.points / this.currentQuest.pointsRequired) * 100);
        this.progressBar.style.width = percentage + '%';
        this.progressText.textContent = `${this.points} / ${this.currentQuest.pointsRequired}`;
    }
    
    addPoints(amount) {
        if (!this.currentQuest) return;
        
        this.points += amount;
        this.updateProgress();
        
        // Check completion
        if (this.points >= this.currentQuest.pointsRequired) {
            this.completeQuest();
        }
    }
    
    completeQuest() {
        this.clearQuestTimer();
        
        // Mark as completed
        if (this.rollStyle === 'deplete') {
            this.completedQuests.push(this.currentQuest.id);
        }
        
        // Update UI
        this.container.classList.remove('quest-warning');
        this.container.classList.add('quest-completed');
        this.statusText.textContent = 'QUEST COMPLETED!';
        
        // Play sound and confetti
        this.playSound(this.sounds.completed);
        this.triggerConfetti('complete');
        
        console.log('[QUEST] Quest completed:', this.currentQuest.name);
        
        // Hide after duration
        setTimeout(() => {
            this.hideQuest();
        }, this.exitDuration);
    }
    
    failQuest() {
        this.clearQuestTimer();
        
        // Update UI
        this.container.classList.remove('quest-warning');
        this.container.classList.add('quest-failed');
        this.statusText.textContent = 'QUEST FAILED!';
        
        // Play sound
        this.playSound(this.sounds.failed);
        this.triggerConfetti('failed');
        
        console.log('[QUEST] Quest failed:', this.currentQuest.name);
        
        // Hide after duration
        setTimeout(() => {
            this.hideQuest();
        }, this.exitDuration);
    }
    
    hideQuest() {
        this.container.classList.remove('quest-visible', 'quest-warning', 'quest-completed', 'quest-failed');
        this.container.classList.add('quest-hidden');
        this.currentQuest = null;
        this.points = 0;
    }
    
    triggerConfetti(type) {
        const explosionCount = parseInt(this.fieldData[`${type}ConfettiExplosions`]) || 3;
        const particleCount = parseInt(this.fieldData[`${type}ConfettiAmount`]) || 50;
        const color = this.fieldData[`${type}ConfettiColor`] || '#ffd700';
        
        for (let i = 0; i < explosionCount; i++) {
            setTimeout(() => {
                this.createConfetti(particleCount, color);
            }, i * 200);
        }
    }
    
    createConfetti(count, color) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < count; i++) {
            this.confettiParticles.push({
                x: centerX,
                y: centerY,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 5,
                gravity: 0.3,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                size: Math.random() * 8 + 4,
                color: color,
                alpha: 1
            });
        }
        
        if (!this.confettiAnimationId) {
            this.animateConfetti();
        }
    }
    
    animateConfetti() {
        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        
        for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
            const p = this.confettiParticles[i];
            
            // Update
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.alpha -= 0.01;
            
            // Draw
            this.confettiCtx.save();
            this.confettiCtx.translate(p.x, p.y);
            this.confettiCtx.rotate(p.rotation * Math.PI / 180);
            this.confettiCtx.globalAlpha = p.alpha;
            this.confettiCtx.fillStyle = p.color;
            this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.confettiCtx.restore();
            
            // Remove if off screen or faded
            if (p.alpha <= 0 || p.y > window.innerHeight) {
                this.confettiParticles.splice(i, 1);
            }
        }
        
        if (this.confettiParticles.length > 0) {
            this.confettiAnimationId = requestAnimationFrame(() => this.animateConfetti());
        } else {
            this.confettiAnimationId = null;
        }
    }
    
    playSound(audio) {
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('[QUEST] Audio play failed:', e));
        }
    }
    
    handleCommand(message, userRole) {
        const parts = message.trim().split(' ');
        const command = parts[0].toLowerCase();
        
        if (command === this.pauseCommand.toLowerCase()) {
            if (this.hasPermission(userRole)) {
                this.pauseQuests();
            }
        } else if (command === this.resumeCommand.toLowerCase()) {
            if (this.hasPermission(userRole)) {
                this.resumeQuests();
            }
        }
    }
    
    pauseQuests() {
        this.isPaused = true;
        this.clearQuestTimer();
        if (this.questRollInterval) {
            clearInterval(this.questRollInterval);
            this.questRollInterval = null;
        }
        console.log('[QUEST] Quest system paused');
    }
    
    resumeQuests() {
        this.isPaused = false;
        this.startQuestRolls();
        if (this.currentQuest) {
            this.startQuestTimer();
        }
        console.log('[QUEST] Quest system resumed');
    }
    
    hasPermission(userRole) {
        const requiredRole = this.fieldData.questCommandPermission || 'moderator';
        const roleHierarchy = ['everyone', 'subscriber', 'vip', 'moderator', 'broadcaster'];
        const userLevel = roleHierarchy.indexOf(userRole);
        const requiredLevel = roleHierarchy.indexOf(requiredRole);
        return userLevel >= requiredLevel;
    }
}

// Initialize on widget load
window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    window.questSystem = new QuestSystem(fieldData);
    console.log('[QUEST] Quest widget loaded');
});

// Handle events
window.addEventListener('onEventReceived', function (obj) {
    if (!window.questSystem) return;
    
    const listener = obj.detail.listener;
    const event = obj.detail.event;
    
    // Handle chat commands
    if (listener === 'message') {
        const message = event.text || event.renderedText || '';
        const userRole = determineUserRole(event);
        window.questSystem.handleCommand(message, userRole);
        return;
    }
    
    // Calculate points from events
    let points = 0;
    const fieldData = window.questSystem.fieldData;
    
    switch (listener.split('-')[0]) {
        case 'follower':
            points = parseInt(fieldData.questFollowPoints) || 10;
            break;
        case 'subscriber':
            const tier = event.tier || '1000';
            if (tier === '3000') points = parseInt(fieldData.questSubT3Points) || 60;
            else if (tier === '2000') points = parseInt(fieldData.questSubT2Points) || 30;
            else points = parseInt(fieldData.questSubT1Points) || 10;
            points *= (event.amount || 1);
            break;
        case 'cheer':
            const bits = parseInt(event.amount) || 0;
            points = Math.floor(bits / (parseInt(fieldData.questBitsPerPoint) || 100)) * (parseInt(fieldData.questCheerPointValue) || 10);
            break;
        case 'tip':
            const amount = parseFloat(event.amount) || 0;
            points = Math.floor(amount / (parseInt(fieldData.questTipPerPoint) || 5)) * (parseInt(fieldData.questTipPointValue) || 10);
            break;
        case 'raid':
            points = parseInt(fieldData.questRaidPoints) || 50;
            break;
        case 'host':
            points = parseInt(fieldData.questHostPoints) || 30;
            break;
    }
    
    if (points > 0) {
        window.questSystem.addPoints(points);
    }
});

// Helper function
function determineUserRole(data) {
    const badges = data.badges || [];
    
    if (badges.some(b => b.type === 'broadcaster')) return 'broadcaster';
    if (badges.some(b => b.type === 'moderator')) return 'moderator';
    if (badges.some(b => b.type === 'vip')) return 'vip';
    if (badges.some(b => b.type === 'subscriber')) return 'subscriber';
    
    return 'everyone';
}
