
// StreamElements TODO Widget
window.addEventListener('onWidgetLoad', function (obj) {
  console.log("StreamElements widget loaded");

  // Get field data from StreamElements
  const fieldData = obj.detail.fieldData;
  console.log("Field data:", fieldData);

  // Initialize the TODO widget
  const _todoWidget = new TodoWidget(fieldData);
  
  // Make widget accessible globally for testing
  window._todoWidget = _todoWidget;
});

class TodoWidget {
  constructor(fieldData) {
    this.completedTasks = 0; // Start with 0 completed tasks
    this.totalTasks = 0; // Start with 0 total tasks
    this.fieldData = fieldData;
    this.blacklistedUsers = this.parseBlacklistedUsers(fieldData.blacklistedUsers);
    this.tasks = []; // Will store task data
    this.isLocked = false; // Widget lock state
    this.completedTasksCount = 0; // Track completed tasks for auto-scroll

    // Sound properties
    this.taskCompleteAudio = null;
    this.allTasksCompleteAudio = null;

    // Confetti properties
    this.confettiParticles = [];
    this.confettiCanvas = null;
    this.confettiCtx = null;

    console.log("TodoWidget fieldData:", this.fieldData);

    this.init();
  }

  init() {
    console.log("TodoWidget init() called");
    this.countActualTasks();
    this.initializeSounds();
    this.initializeConfetti();
    this.applyCustomStyling();
    this.setupEventListeners();
    this.updateProgress();
    this.updateMoreTasksButton();
    this.initializeChatCommands();
    this.loadManualTasks();
    console.log("TodoWidget initialization complete");
  }

  parseBlacklistedUsers(blacklistString) {
    if (!blacklistString) return [];
    return blacklistString.split(',').map(user => user.trim().toLowerCase()).filter(user => user.length > 0);
  }

  initializeSounds() {
    // Initialize task complete sound
    if (this.fieldData.taskCompleteSound && this.fieldData.taskCompleteSound !== 'none') {
      try {
        // Check if it's a custom sound file (URL or data URI)
        if (this.fieldData.taskCompleteSound.startsWith('http') ||
          this.fieldData.taskCompleteSound.startsWith('https') ||
          this.fieldData.taskCompleteSound.startsWith('data:audio')) {
          this.taskCompleteAudio = new Audio(this.fieldData.taskCompleteSound);
          this.taskCompleteAudio.volume = (this.fieldData.taskCompleteSoundVolume || this.fieldData.soundVolume || 50) / 100;
          this.taskCompleteAudio.preload = 'auto';
        }
      } catch (error) {
        console.error('Error initializing task complete sound:', error);
      }
    }

    // Initialize all tasks complete sound
    if (this.fieldData.allTasksCompleteSound && this.fieldData.allTasksCompleteSound !== 'none') {
      try {
        // Check if it's a custom sound file (URL or data URI)
        if (this.fieldData.allTasksCompleteSound.startsWith('http') ||
          this.fieldData.allTasksCompleteSound.startsWith('https') ||
          this.fieldData.allTasksCompleteSound.startsWith('data:audio')) {
          this.allTasksCompleteAudio = new Audio(this.fieldData.allTasksCompleteSound);
          this.allTasksCompleteAudio.volume = (this.fieldData.allTasksCompleteSoundVolume || this.fieldData.soundVolume || 50) / 100;
          this.allTasksCompleteAudio.preload = 'auto';
        }
      } catch (error) {
        console.error('Error initializing all tasks complete sound:', error);
      }
    }
  }

  initializeConfetti() {
    this.confettiCanvas = document.getElementById('confetti-canvas');
    if (this.confettiCanvas) {
      this.confettiCtx = this.confettiCanvas.getContext('2d');
      this.resizeConfettiCanvas();
      
      // Resize canvas when window size changes
      window.addEventListener('resize', () => this.resizeConfettiCanvas());
    }
  }

  resizeConfettiCanvas() {
    if (this.confettiCanvas) {
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    }
  }

  createConfettiParticles() {
    // Get custom confetti colors from field data, fallback to defaults
    const colors = [
      this.fieldData.confettiColor1 || '#ff6b6b',
      this.fieldData.confettiColor2 || '#4ecdc4',
      this.fieldData.confettiColor3 || '#45b7d1',
      this.fieldData.confettiColor4 || '#96ceb4',
      this.fieldData.confettiColor5 || '#ffeaa7',
      this.fieldData.confettiColor6 || '#dda0dd',
      this.fieldData.confettiColor7 || '#98d8c8',
      this.fieldData.confettiColor8 || '#f7dc6f'
    ];
    
    // Get particle count from field data, fallback to default
    const particleCount = this.fieldData.confettiParticleCount || 100;
    
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
  }

  animateConfetti() {
    if (!this.confettiCtx) return;
    
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    
    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const particle = this.confettiParticles[i];
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.rotation += particle.rotationSpeed;
      
      // Remove particles that are off screen
      if (particle.y > this.confettiCanvas.height) {
        this.confettiParticles.splice(i, 1);
        continue;
      }
      
      // Draw particle
      this.confettiCtx.save();
      this.confettiCtx.translate(particle.x, particle.y);
      this.confettiCtx.rotate(particle.rotation * Math.PI / 180);
      this.confettiCtx.fillStyle = particle.color;
      this.confettiCtx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      this.confettiCtx.restore();
    }
    
    // Continue animation if particles exist
    if (this.confettiParticles.length > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    }
  }

  startConfetti() {
    // Clear any existing confetti
    this.confettiParticles = [];
    
    // Get duration from field data, fallback to default (3 seconds)
    const duration = (this.fieldData.confettiDuration || 3) * 1000;
    
    this.createConfettiParticles();
    this.animateConfetti();
    
    // Auto-stop confetti after specified duration
    setTimeout(() => {
      this.stopConfetti();
    }, duration);
  }

  stopConfetti() {
    // Clear all particles
    this.confettiParticles = [];
    
    // Clear the canvas
    if (this.confettiCtx) {
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
  }

  countActualTasks() {
    const taskItems = document.querySelectorAll('.task-item');
    this.totalTasks = taskItems.length;
    this.completedTasks = document.querySelectorAll('.task-item.completed').length;
    console.log(`Total tasks: ${this.totalTasks}, Completed: ${this.completedTasks}`);
  }

  updateMoreTasksButton() {
    const moreTasksBtn = document.querySelector('.more-tasks-btn');
    const taskItems = document.querySelectorAll('.task-item');

    console.log(`updateMoreTasksButton: Found ${taskItems.length} tasks`);

    if (moreTasksBtn && taskItems.length > 5) {
      const hiddenTasksCount = taskItems.length - 5;
      const moreTasksText = moreTasksBtn.querySelector('.more-tasks-text');

      if (moreTasksText) {
        moreTasksText.textContent = `${hiddenTasksCount}+`;
      }

      moreTasksBtn.style.display = 'flex';
      console.log(`More tasks button shown with text: ${hiddenTasksCount}+`);
    } else if (moreTasksBtn) {
      moreTasksBtn.style.display = 'none';
      console.log('More tasks button hidden');
    }
  }

  applyCustomStyling() {
    console.log("applyCustomStyling() called");
    console.log("Field data in applyCustomStyling:", this.fieldData);

    // Provide default values if fieldData is not available
    const fieldData = this.fieldData || {};

    // Apply text content
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
      pageTitle.textContent = fieldData.tasklistTitle || "Tasklist";
    }

    const cardTitle = document.querySelector('.card-title');
    if (cardTitle) {
      cardTitle.textContent = fieldData.cardTitle || "MY TASKS";
      cardTitle.style.color = fieldData.cardTitleColor || "#feb6de";
    }

    const progressLabel = document.querySelector('.progress-label');
    if (progressLabel) {
      progressLabel.textContent = fieldData.progressLabel || "Progress Bar";
      progressLabel.style.color = fieldData.progressLabelColor || "#2c2c2c";
    }

    // Apply card background and border colors
    const taskCard = document.querySelector('.task-card');
    if (taskCard) {
      console.log("Found task-card element");
      taskCard.style.background = fieldData.cardBackgroundColor || "#010161";
      
      const borderColor = fieldData.cardBorderColor || "#bee5fc";
      const borderWidth = fieldData.cardBorderWidth || 4;
      
      taskCard.style.borderRightColor = borderColor;
      taskCard.style.borderBottomColor = borderColor;
      taskCard.style.borderRightWidth = `${borderWidth}px`;
      taskCard.style.borderBottomWidth = `${borderWidth}px`;
      
      // Set CSS custom property for border width
      taskCard.style.setProperty('--card-border-width', `${borderWidth}px`);

      // Apply hover shadow color
      const shadowColor = fieldData.cardHoverShadow || fieldData.cardBorderColor || "#bee5fc";
      taskCard.style.setProperty('--hover-shadow-color', shadowColor);
    } else {
      console.log("task-card element not found");
    }

    // Apply task text color
    document.querySelectorAll('.task-text').forEach(text => {
      text.style.color = this.fieldData.taskTextColor;
    });

    // Apply checkbox border color and tick color
    document.querySelectorAll('.checkbox').forEach(checkbox => {
      checkbox.style.borderColor = this.fieldData.checkboxBorderColor;

      // Update the tick mark color for checked items
      const tickMark = checkbox.querySelector('svg path');
      if (tickMark) {
        tickMark.setAttribute('stroke', this.fieldData.tickColor);
      }
    });

    // Apply font family to the main card
    if (taskCard) {
      taskCard.style.fontFamily = this.getFontFamily(this.fieldData.fontFamily);
    }

    // Apply more tasks button color
    const moreTasksBtn = document.querySelector('.more-tasks-btn');
    if (moreTasksBtn) {
      moreTasksBtn.style.background = this.fieldData.buttonColor || "#6aaafe";
    }

    // Apply progress bar colors
    this.applyProgressBarStyling();

    // Apply scrollbar colors
    this.applyScrollbarStyling();

    console.log("applyCustomStyling() completed");
  }

  applyScrollbarStyling() {
    const scrollbarColor = this.fieldData.scrollbarColor || "#6aaafe";
    const scrollbarHoverColor = this.darkenColor(scrollbarColor, 20);
    
    // Set CSS custom properties for scrollbar colors
    document.documentElement.style.setProperty('--scrollbar-color', scrollbarColor);
    document.documentElement.style.setProperty('--scrollbar-hover-color', scrollbarHoverColor);
    
    // Also update the scrollbar-color property for Firefox
    const taskList = document.querySelector('.task-list');
    if (taskList) {
      taskList.style.scrollbarColor = `${scrollbarColor} transparent`;
    }
  }

  darkenColor(color, percent) {
    // Simple function to darken a hex color
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  applyProgressBarStyling() {
    const progressBarContainer = document.querySelector('.progress-bar-container');
    if (progressBarContainer) {
      progressBarContainer.style.background = this.fieldData.progressBarBgColor || "#1a237e";
      
      // Apply progress bar border color and width
      const borderColor = this.fieldData.progressBarBorderColor || "#bee5fc";
      const borderWidth = this.fieldData.progressBarBorderWidth || 5;
      
      progressBarContainer.style.borderRightColor = borderColor;
      progressBarContainer.style.borderBottomColor = borderColor;
      progressBarContainer.style.borderRightWidth = `${borderWidth}px`;
      progressBarContainer.style.borderBottomWidth = `${borderWidth}px`;
    }

    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      const startColor = this.fieldData.progressBarStartColor || "#b988fe";
      const endColor = this.fieldData.progressBarEndColor || "#5c7afc";
      progressFill.style.background = `linear-gradient(90deg, ${startColor} 0%, ${endColor} 100%)`;
    }
  }

  getFontFamily(fontOption) {
    const fontMap = {
      'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      'arial': 'Arial, sans-serif',
      'helvetica': 'Helvetica, Arial, sans-serif',
      'roboto': 'Roboto, sans-serif',
      'georgia': 'Georgia, serif',
      'times': 'Times New Roman, serif'
    };

    return fontMap[fontOption] || fontMap['system'];
  }

  setupEventListeners() {
    const taskItems = document.querySelectorAll('.task-item');

    // Add event listeners to all tasks
    taskItems.forEach(taskItem => {
      this.addTaskEventListeners(taskItem);
    });

    // Add event listener to the "5+" button for auto-scroll
    const moreTasksBtn = document.querySelector('.more-tasks-btn');
    if (moreTasksBtn) {
      moreTasksBtn.addEventListener('click', () => {
        this.scrollToBottom();
      });
    }
  }

  scrollToBottom() {
    const taskList = document.querySelector('.task-list');
    if (taskList) {
      // Smooth scroll to the bottom of the task list
      taskList.scrollTo({
        top: taskList.scrollHeight,
        behavior: 'smooth'
      });

      console.log('Scrolled to bottom of task list');
    }
  }

  addTaskEventListeners(taskItem) {
    const checkbox = taskItem.querySelector('.checkbox');

    if (checkbox) {
      checkbox.addEventListener('click', () => {
        const isCompleted = taskItem.classList.contains('completed');

        if (isCompleted) {
          // Uncheck the task
          taskItem.classList.remove('completed');
          checkbox.classList.remove('checked');
          checkbox.innerHTML = '';
          this.completedTasks--;
        } else {
          // Check the task
          taskItem.classList.add('completed');
          checkbox.classList.add('checked');
          checkbox.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L6 12L16 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `;
          this.completedTasks++;
        }

        // Update the progress and recount tasks
        this.countActualTasks();
        this.updateProgress();
        console.log(`Task toggled. Completed: ${this.completedTasks}/${this.totalTasks}`);
      });
    }
  }

  updateProgress() {
    const progressCount = document.querySelector('.progress-count');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressFill = document.querySelector('.progress-fill');

    // Fix NaN percentage when totalTasks is 0
    const percentage = this.totalTasks === 0 ? 0 : Math.round((this.completedTasks / this.totalTasks) * 100);

    if (progressCount) progressCount.textContent = `${this.completedTasks}/${this.totalTasks}`;
    if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
  }

  // StreamElements Chat Commands Integration
  initializeChatCommands() {
    console.log("Initializing chat commands...");
    
    // StreamElements event listener for chat messages (following working implementation)
    window.addEventListener('onEventReceived', (obj) => {
      try {
        const data = obj.detail.event;
        const user = data.data?.nick || data.data?.user_name || 'unknown user';
        const role = data.data?.tags?.badges || 'viewer';

        console.log(`Message received - User: ${user} Role: ${role}`, data);

        let userRole = 'viewer';
        if (role) {
          if (role.includes('broadcaster')) {
            userRole = 'broadcaster';
          } else if (role.includes('moderator')) {
            userRole = 'moderator';
          } else if (role.includes('vip')) {
            userRole = 'vip';
          } else if (role.includes('subscriber')) {
            userRole = 'subscriber';
          } else if (role.includes('founder')) {
            userRole = 'founder';
          }
        }

        console.log(`Determined Role: ${userRole}`);

        if (data.renderedText) {
          this.handleChatCommand(data.renderedText, user, userRole);
        }
      } catch (error) {
        console.error("Error handling chat command:", error);
      }
    });
    
    console.log("Chat commands initialized");
  }

  loadManualTasks() {
    console.log("Loading manual tasks from dashboard...");
    
    // Check if manual tasks are enabled
    if (!this.fieldData.enableManualTasks) {
      console.log("Manual tasks are disabled");
      return;
    }

    // Get the comma-separated manual tasks
    const manualTasksString = this.fieldData.manualTasks;
    
    if (!manualTasksString || manualTasksString.trim() === '') {
      console.log("No manual tasks configured");
      return;
    }

    // Parse comma-separated tasks
    const tasks = manualTasksString.split(',').map(task => task.trim()).filter(task => task.length > 0);
    
    // Add each task
    tasks.forEach((taskText, index) => {
      if (taskText) {
        console.log(`Adding manual task ${index + 1}: "${taskText}"`);
        this.addTask(taskText, 'Dashboard', null, 'none');
      }
    });

    // Clear manual tasks from field data if the option is enabled
    if (this.fieldData.clearManualTasksOnLoad) {
      console.log("Clearing manual tasks from dashboard after loading");
      // Note: We can't actually clear the field data, but we log this for reference
      // The streamer would need to manually clear them in the dashboard
    }

    console.log(`Manual tasks loading complete. Added ${tasks.length} tasks.`);
  }

  playSound(soundType) {
    if (!this.fieldData.soundEnabled) return;

    const volume = (this.fieldData.soundVolume || 50) / 100;

    // Handle specific sound types with preloaded audio
    if (soundType === 'taskCompleteSound' && this.taskCompleteAudio) {
      try {
        // Reset the audio to the beginning for repeated plays
        this.taskCompleteAudio.currentTime = 0;
        this.taskCompleteAudio.volume = (this.fieldData.taskCompleteSoundVolume || this.fieldData.soundVolume || 50) / 100;

        // Play the sound (returns a promise)
        const playPromise = this.taskCompleteAudio.play();

        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Task complete sound play failed:', error);
            // Fallback to Web Audio API
            this.playFallbackSound('ding');
          });
        }
        console.log('Played task complete sound');
        return;
      } catch (error) {
        console.error('Error playing task complete sound:', error);
        // Fallback to Web Audio API
        this.playFallbackSound('ding');
        return;
      }
    }

    if (soundType === 'allTasksCompleteSound' && this.allTasksCompleteAudio) {
      try {
        // Reset the audio to the beginning for repeated plays
        this.allTasksCompleteAudio.currentTime = 0;
        this.allTasksCompleteAudio.volume = (this.fieldData.allTasksCompleteSoundVolume || this.fieldData.soundVolume || 50) / 100;

        // Play the sound (returns a promise)
        const playPromise = this.allTasksCompleteAudio.play();

        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('All tasks complete sound play failed:', error);
            // Fallback to Web Audio API
            this.playFallbackSound('fanfare');
          });
        }
        console.log('Played all tasks complete sound');
        return;
      } catch (error) {
        console.error('Error playing all tasks complete sound:', error);
        // Fallback to Web Audio API
        this.playFallbackSound('fanfare');
        return;
      }
    }

    // Check if soundType is a URL (uploaded sound) or a predefined sound
    if (soundType && (soundType.startsWith('http') || soundType.startsWith('https') || soundType.startsWith('data:audio'))) {
      // Handle uploaded/custom sound files
      try {
        const audio = new Audio(soundType);
        audio.volume = volume;
        audio.play().catch(error => {
          console.log('Custom sound playback failed:', error);
        });
        console.log(`Played custom sound: ${soundType}`);
      } catch (error) {
        console.log('Custom sound playback failed:', error);
      }
    } else {
      // Handle predefined sounds with Web Audio API
      this.playFallbackSound(soundType);
    }
  }

  playFallbackSound(soundType) {
    const volume = (this.fieldData.soundVolume || 50) / 100;

    // Handle predefined sounds
    const soundMap = {
      'ding': [800, 0.3],
      'chime': [660, 0.4],
      'pop': [1000, 0.2],
      'beep': [440, 0.3],
      'fanfare': [523, 0.5],
      'celebration': [659, 0.6],
      'applause': [80, 0.4],
      'success': [1318, 0.5]
    };

    const soundConfig = soundMap[soundType];
    if (!soundConfig) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = soundConfig[0];
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(volume * soundConfig[1], audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      console.log(`Played fallback sound: ${soundType}`);
    } catch (error) {
      console.log('Fallback sound playback failed:', error);
    }
  }

  handleChatCommand(command, user, role) {
    console.log(`Processing command: "${command}" from user: ${user} with role: ${role}`);
    
    if (!this.fieldData) {
      console.log("No field data available");
      return;
    }

    // Check if widget is locked (only allow mods/broadcasters when locked)
    if (this.isLocked && role !== 'moderator' && role !== 'broadcaster') {
      console.log(`Widget is locked, ${user} (${role}) cannot use commands`);
      return;
    }

    // Check if user is blacklisted
    if (this.isUserBlacklisted({ username: user })) {
      console.log(`User ${user} is blacklisted`);
      return;
    }

    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    let task = '';

    // Define admin commands that require mod/broadcaster permissions
    const adminCommands = ['!lock', '!unlock', '!clear', '!reset'];
    
    // Check admin command permissions
    if (adminCommands.includes(cmd)) {
      if (role !== 'moderator' && role !== 'broadcaster') {
        console.log(`User ${user} (${role}) not authorized for admin command ${cmd}`);
        return;
      }
    } else {
      // Check general task command permissions
      if (!this.hasTaskPermission(role)) {
        console.log(`User ${user} (${role}) not authorized for task commands`);
        return;
      }
    }

    // Extract task text and priority for task commands
    let priority = 'none';
    if (parts.length > 1) {
      task = parts.slice(1).join(' ');
      
      // Check for priority keywords (!high, !med, !low) in task text
      if (task.includes('!high')) {
        priority = 'high';
        task = task.replace('!high', '').trim();
      } else if (task.includes('!med') || task.includes('!medium')) {
        priority = 'med';
        task = task.replace(/!med|!medium/g, '').trim();
      } else if (task.includes('!low')) {
        priority = 'low';
        task = task.replace('!low', '').trim();
      }
    }

    // Process commands
    switch (cmd) {
      case '!addtask':
      case '!newtask':
        if (task && this.fieldData.enableAddTask !== false) {
          this.addTask(task, user, null, priority);
        }
        break;
        
      case '!complete':
      case '!donetask':
        if (task && this.fieldData.enableCompleteTask !== false) {
          this.completeTaskByName(task, user, role);
        }
        break;
        
      case '!remove':
      case '!cleartask':
        if (task && this.fieldData.enableRemoveTask !== false) {
          this.removeTaskByName(task, user, role);
        }
        break;
        
      case '!clear':
      case '!reset':
        if (this.fieldData.enableClearTasks !== false) {
          this.clearTasks(user);
        }
        break;
        
      case '!lock':
        if (this.fieldData.enableLockUnlock !== false) {
          this.isLocked = true;
          console.log(`Widget locked by ${user}`);
        }
        break;
        
      case '!unlock':
        if (this.fieldData.enableLockUnlock !== false) {
          this.isLocked = false;
          console.log(`Widget unlocked by ${user}`);
        }
        break;
        
      case '!highlight':
        if (this.fieldData.enableHighlight !== false) {
          this.highlightRandomTask(user);
        }
        break;
        
      default:
        console.log(`Unknown command: ${cmd}`);
    }
  }

  hasTaskPermission(role) {
    // Simple permission check based on fieldData settings (if they exist)
    const allowedUsers = this.fieldData.allowedUsers || 'everyoneincludingbroadcaster';
    
    switch (allowedUsers.toLowerCase()) {
      case 'viewers':
        return role === 'viewer';
      case 'broadcaster':
        return role === 'broadcaster';
      case 'mods':
      case 'moderator':
        return role === 'moderator';
      case 'subs':
      case 'subscriber':
        return role === 'subscriber' || role === 'founder';
      case 'vip':
        return role === 'vip';
      case 'allbutbroadcaster':
        return role !== 'broadcaster';
      case 'everyoneincludingbroadcaster':
        return true;
      case 'subsandbroadcaster':
        return role === 'subscriber' || role === 'founder' || role === 'broadcaster';
      case 'modsandbroadcaster':
        return role === 'moderator' || role === 'broadcaster';
      case 'vipsandbroadcaster':
        return role === 'vip' || role === 'broadcaster';
      case 'subsmodsvips':
        return role === 'subscriber' || role === 'founder' || role === 'moderator' || role === 'vip';
      default:
        return true; // Default to allowing everyone
    }
  }

  isUserBlacklisted(data) {
    if (!data.username) return false;
    const username = data.username.toLowerCase();
    return this.blacklistedUsers.includes(username);
  }

  highlightRandomTask(username) {
    const incompleteTasks = document.querySelectorAll('.task-item:not(.completed)');
    if (incompleteTasks.length === 0) {
      console.log(`No incomplete tasks to highlight for ${username}`);
      return;
    }

    // Remove any existing highlights
    document.querySelectorAll('.task-item.highlighted').forEach(task => {
      task.classList.remove('highlighted');
    });

    // Select random incomplete task
    const randomIndex = Math.floor(Math.random() * incompleteTasks.length);
    const selectedTask = incompleteTasks[randomIndex];
    
    // Add highlight effect
    selectedTask.classList.add('highlighted');
    
    // Remove highlight after animation
    setTimeout(() => {
      selectedTask.classList.remove('highlighted');
    }, 2000);

    console.log(`Random task highlighted by ${username}`);
  }

  isModerator(data) {
    // Handle StreamElements badge format - badges is an array of objects
    const badges = data.badges || [];
    const badgeTypes = badges.map(badge => badge.type || badge.name || badge).filter(Boolean);
    
    // Also check tags for Twitch-style badges
    const tags = data.tags || {};
    const twitchBadges = tags.badges ? tags.badges.split(',').map(b => b.split('/')[0]) : [];
    
    // Combine all badge information
    const allBadges = [...badgeTypes, ...twitchBadges];
    
    const isModerator = allBadges.includes('moderator') || allBadges.includes('mod') || tags.mod === '1';
    const isBroadcaster = allBadges.includes('broadcaster') || allBadges.includes('streamer');
    
    return isBroadcaster || isModerator;
  }

  completeTaskByName(taskName, username, role) {
    const taskItems = document.querySelectorAll('.task-item:not(.completed)');
    let taskFound = false;
    
    for (let taskItem of taskItems) {
      const taskTextElement = taskItem.querySelector('.task-text');
      if (taskTextElement && taskTextElement.textContent.toLowerCase().trim() === taskName.toLowerCase().trim()) {
        // Check if user can complete this task (their own task or mod/broadcaster)
        const taskUsername = taskItem.dataset.username;
        if (taskUsername === username || role === 'moderator' || role === 'broadcaster') {
          taskItem.classList.add('completed');
          const checkbox = taskItem.querySelector('.checkbox');
          if (checkbox) {
            checkbox.classList.add('checked');
          }
          this.completedTasks++;
          this.updateProgress();
          this.playSound('taskCompleteSound');
          
          // Check if all tasks are completed
          const remainingTasks = document.querySelectorAll('.task-item:not(.completed)').length;
          if (remainingTasks === 0 && this.tasks.length > 0) {
            this.playSound('allTasksCompleteSound');
            this.startConfetti();
          }
          
          taskFound = true;
          console.log(`Task "${taskName}" completed by ${username}`);
          break;
        } else {
          console.log(`${username} cannot complete task created by ${taskUsername}`);
        }
      }
    }
    
    if (!taskFound) {
      console.log(`Task "${taskName}" not found or already completed`);
    }
  }

  removeTaskByName(taskName, username, role) {
    const taskItems = document.querySelectorAll('.task-item');
    let taskFound = false;
    
    for (let taskItem of taskItems) {
      const taskTextElement = taskItem.querySelector('.task-text');
      if (taskTextElement && taskTextElement.textContent.toLowerCase().trim() === taskName.toLowerCase().trim()) {
        // Check if user can remove this task (their own task or mod/broadcaster)
        const taskUsername = taskItem.dataset.username;
        if (taskUsername === username || role === 'moderator' || role === 'broadcaster') {
          // Update counters if task was completed
          if (taskItem.classList.contains('completed')) {
            this.completedTasks--;
          }
          this.totalTasks--;
          
          // Remove with animation
          taskItem.classList.add('slide-out');
          setTimeout(() => {
            taskItem.remove();
            this.updateProgress();
            this.updateMoreTasksButton();
          }, 300);
          
          taskFound = true;
          console.log(`Task "${taskName}" removed by ${username}`);
          break;
        } else {
          console.log(`${username} cannot remove task created by ${taskUsername}`);
        }
      }
    }
    
    if (!taskFound) {
      console.log(`Task "${taskName}" not found`);
    }
  }

  addTask(taskText, username, _data, priority = 'none') {
    if (!taskText) return;

    const taskList = document.querySelector('.task-list');
    const newTaskElement = document.createElement('div');
    newTaskElement.className = 'task-item slide-in'; // Add slide-in animation class
    newTaskElement.dataset.username = username; // Store username for permission checks
    
    // Add priority class if specified
    if (priority && priority !== 'none') {
      const priorityClass = this.getPriorityClass(priority);
      if (priorityClass) {
        newTaskElement.classList.add(priorityClass);
      }
    }
    
    newTaskElement.innerHTML = `
      <div class="checkbox"></div>
      <span class="task-text">${this.escapeHtml(taskText)}</span>
    `;

    taskList.appendChild(newTaskElement);
    this.addTaskEventListeners(newTaskElement);
    this.countActualTasks();
    this.updateProgress();
    this.updateMoreTasksButton();

    // Apply styling to new task
    this.applyTaskStyling(newTaskElement);

    // Remove animation class after animation completes
    setTimeout(() => {
      newTaskElement.classList.remove('slide-in');
    }, 500);

    console.log(`Task added by ${username}: ${taskText} (Priority: ${priority})`);
  }

  getPriorityClass(priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'high-priority';
      case 'med':
      case 'medium':
        return 'medium-priority';
      case 'low':
        return 'low-priority';
      default:
        return null;
    }
  }

  applyTaskStyling(taskElement) {
    const taskText = taskElement.querySelector('.task-text');
    const checkbox = taskElement.querySelector('.checkbox');

    if (taskText) {
      taskText.style.color = this.fieldData.taskTextColor;
    }

    if (checkbox) {
      checkbox.style.borderColor = this.fieldData.checkboxBorderColor;
    }
  }

  completeTask(taskId, username, _data) {
    const tasks = document.querySelectorAll('.task-item');
    if (taskId > 0 && taskId <= tasks.length) {
      const task = tasks[taskId - 1];
      const checkbox = task.querySelector('.checkbox');
      if (checkbox && !task.classList.contains('completed')) {
        checkbox.click(); // Trigger the click event

        // Increment completed tasks counter
        this.completedTasksCount++;

        // Play task complete sound
        this.playSound('taskCompleteSound');

        console.log(`Task ${taskId} completed by ${username}`);

        // Check auto-scroll
        this.checkAutoScroll();

        // Check if all tasks are completed
        this.checkAllTasksComplete();
      }
    }
  }

  checkAutoScroll() {
    const autoScrollThreshold = this.fieldData.autoScrollTasksCompleted || 5;
    const scrollAmount = this.fieldData.scrollAmount || 3;

    if (this.completedTasksCount >= autoScrollThreshold) {
      this.autoScrollTasks(scrollAmount);
      this.completedTasksCount = 0; // Reset counter
    }
  }

  autoScrollTasks(scrollAmount) {
    const taskList = document.querySelector('.task-list');
    const completedTasks = document.querySelectorAll('.task-item.completed');
    
    if (!taskList || completedTasks.length < scrollAmount) return;

    // Remove the specified number of completed tasks from the top
    for (let i = 0; i < Math.min(scrollAmount, completedTasks.length); i++) {
      const taskToRemove = completedTasks[i];
      taskToRemove.style.transition = 'all 0.5s ease-out';
      taskToRemove.style.transform = 'translateX(-100%)';
      taskToRemove.style.opacity = '0';
      
      setTimeout(() => {
        taskToRemove.remove();
        this.countActualTasks();
        this.updateProgress();
        this.updateMoreTasksButton();
      }, 500);
    }

    console.log(`Auto-scrolled ${scrollAmount} completed tasks`);
  }

  checkAllTasksComplete() {
    const tasks = document.querySelectorAll('.task-item');
    const completedTasks = document.querySelectorAll('.task-item.completed');

    if (tasks.length > 0 && tasks.length === completedTasks.length) {
      // All tasks completed!
      this.playSound('allTasksCompleteSound');
      
      // Trigger confetti if enabled
      if (this.fieldData.enableConfetti !== false) {
        this.startConfetti();
      }
      
      console.log('All tasks completed! 🎉');
    }
  }

  removeTask(taskId, username, _data) {
    const tasks = document.querySelectorAll('.task-item');
    if (taskId > 0 && taskId <= tasks.length) {
      const task = tasks[taskId - 1];
      task.remove();
      this.countActualTasks();
      this.updateProgress();
      this.updateMoreTasksButton();
      console.log(`Task ${taskId} removed by ${username}`);
    }
  }

  clearTasks(username) {
    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = '';
    this.totalTasks = 0;
    this.completedTasks = 0;
    this.updateProgress();
    this.updateMoreTasksButton();
    console.log(`All tasks cleared by ${username}`);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  updateSoundSettings(newFieldData) {
    this.fieldData = newFieldData;

    // Update audio volumes if they exist
    if (this.taskCompleteAudio) {
      this.taskCompleteAudio.volume = (this.fieldData.taskCompleteSoundVolume || this.fieldData.soundVolume || 50) / 100;
    }

    if (this.allTasksCompleteAudio) {
      this.allTasksCompleteAudio.volume = (this.fieldData.allTasksCompleteSoundVolume || this.fieldData.soundVolume || 50) / 100;
    }

    // Reinitialize sounds with new settings if sound files changed
    this.initializeSounds();

    console.log('Sound settings updated');
  }
}
