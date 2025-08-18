
// StreamElements TODO Widget
window.addEventListener('onWidgetLoad', function (obj) {
  console.log("StreamElements widget loaded");
  
  // Get field data from StreamElements
  const fieldData = obj.detail.fieldData;
  console.log("Field data:", fieldData);
  
  // Initialize the TODO widget
  const _todoWidget = new TodoWidget(fieldData);
});

class TodoWidget {
  constructor(fieldData) {
    this.completedTasks = 3;
    this.totalTasks = 10; // Will be dynamic based on actual tasks
    this.fieldData = fieldData;
    this.blacklistedUsers = this.parseBlacklistedUsers(fieldData.blacklistedUsers);
    this.tasks = []; // Will store task data
    console.log("TodoWidget fieldData:", this.fieldData);
    
    this.init();
  }

  init() {
    console.log("TodoWidget init() called");
    this.countActualTasks();
    this.applyCustomStyling();
    this.setupEventListeners();
    this.updateProgress();
    this.updateMoreTasksButton();
    this.initializeChatCommands();
    console.log("TodoWidget initialization complete");
  }

  parseBlacklistedUsers(blacklistString) {
    if (!blacklistString) return [];
    return blacklistString.split(',').map(user => user.trim().toLowerCase()).filter(user => user.length > 0);
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
      console.log(`5+ button shown with text: ${hiddenTasksCount}+`);
    } else if (moreTasksBtn) {
      moreTasksBtn.style.display = 'none';
      console.log('5+ button hidden');
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
      taskCard.style.borderRightColor = fieldData.cardBorderColor || "#bee5fc";
      taskCard.style.borderBottomColor = fieldData.cardBorderColor || "#bee5fc";
      
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
    
    // Apply font family and size to the main card
    if (taskCard) {
      taskCard.style.fontFamily = this.getFontFamily(this.fieldData.fontFamily);
      taskCard.style.fontSize = this.fieldData.fontSize + 'px';
    }

    // Apply more tasks button color
    const moreTasksBtn = document.querySelector('.more-tasks-btn');
    if (moreTasksBtn) {
      moreTasksBtn.style.background = `linear-gradient(135deg, ${this.fieldData.buttonColor} 0%, #5c7afc 100%)`;
    }
    
    // Apply progress bar colors
    this.applyProgressBarStyling();
    
    // Apply scrollbar colors
    this.applyScrollbarStyling();
  }
  
  applyProgressBarStyling() {
    const progressBarContainer = document.querySelector('.progress-bar-container');
    if (progressBarContainer) {
      progressBarContainer.style.background = this.fieldData.progressBarBgColor || "#1a237e";
    }
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      const startColor = this.fieldData.progressBarStartColor || "#b988fe";
      const endColor = this.fieldData.progressBarEndColor || "#5c7afc";
      progressFill.style.background = `linear-gradient(90deg, ${startColor} 0%, ${endColor} 100%)`;
    }
  }
  
  applyScrollbarStyling() {
    const taskList = document.querySelector('.task-list');
    if (taskList) {
      const scrollbarColor = this.fieldData.scrollbarColor || "#6aaafe";
      
      // Create dynamic CSS for scrollbar
      const style = document.createElement('style');
      style.textContent = `
        .task-list::-webkit-scrollbar-thumb {
          background: ${scrollbarColor} !important;
        }
        .task-list::-webkit-scrollbar-thumb:hover {
          background: ${this.darkenColor(scrollbarColor, 20)} !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const B = (num >> 8 & 0x00FF) - amt;
    const G = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
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

    const percentage = Math.round((this.completedTasks / this.totalTasks) * 100);
    
    if (progressCount) progressCount.textContent = `${this.completedTasks}/${this.totalTasks}`;
    if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
  }

  // StreamElements Chat Commands Integration
  initializeChatCommands() {
    // StreamElements chat command integration
    if (window.SE_API) {
      window.SE_API.onMessage = (data) => {
        this.handleChatCommand(data);
      };
    }
  }

  isUserAllowed(data) {
    if (!this.fieldData.commandsEnabled) {
      console.log("Commands are disabled");
      return false;
    }
    
    const username = (data.username || data.displayName || '').toLowerCase();
    
    // Check blacklist
    if (this.blacklistedUsers.includes(username)) {
      console.log(`User ${username} is blacklisted`);
      return false;
    }
    
    // Check user permissions
    const allowedUsers = this.fieldData.allowedUsers || 'everyone';
    const badges = data.badges || [];
    
    switch (allowedUsers) {
      case 'broadcaster':
        return badges.includes('broadcaster');
      case 'moderator':
        return badges.includes('broadcaster') || badges.includes('moderator');
      case 'vip':
        return badges.includes('broadcaster') || badges.includes('moderator') || badges.includes('vip');
      case 'subscriber':
        return badges.includes('broadcaster') || badges.includes('moderator') || badges.includes('vip') || badges.includes('subscriber');
      case 'everyone':
      default:
        return true;
    }
  }

  playSound(soundType) {
    if (!this.fieldData.soundEnabled) return;
    
    const volume = (this.fieldData.soundVolume || 50) / 100;
    const soundMap = {
      'ding': [800, 0.3],
      'chime': [660, 0.4],
      'pop': [1000, 0.2],
      'beep': [440, 0.3],
      'fanfare': [523, 0.5],
      'celebration': [659, 0.6],
      'applause': [880, 0.4],
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
      
      console.log(`Played sound: ${soundType}`);
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  }

  handleChatCommand(data) {
    if (!data || !data.message) return;

    // Check if user is allowed to use commands
    if (!this.isUserAllowed(data)) return;

    const message = data.message.toLowerCase();
    const username = data.username || 'User';

    // Parse commands
    if (message.startsWith('!todo add ')) {
      const task = data.message.substring(10).trim();
      this.addTask(task, username, data);
    } else if (message.startsWith('!todo complete ')) {
      const taskId = parseInt(data.message.substring(15).trim());
      this.completeTask(taskId, username, data);
    } else if (message.startsWith('!todo remove ')) {
      const taskId = parseInt(data.message.substring(13).trim());
      this.removeTask(taskId, username, data);
    } else if (message === '!todo clear') {
      this.clearTasks(username, data);
    } else if (message === '!todo lock' && this.isModerator(data)) {
      this.fieldData.commandsEnabled = false;
      console.log(`Commands locked by ${username}`);
    } else if (message === '!todo unlock' && this.isModerator(data)) {
      this.fieldData.commandsEnabled = true;
      console.log(`Commands unlocked by ${username}`);
    }
  }

  isModerator(data) {
    const badges = data.badges || [];
    return badges.includes('broadcaster') || badges.includes('moderator');
  }

  addTask(taskText, username, data) {
    if (!taskText) return;

    const taskList = document.querySelector('.task-list');
    const newTaskElement = document.createElement('div');
    newTaskElement.className = 'task-item';
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

    console.log(`Task added by ${username}: ${taskText}`);
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

  completeTask(taskId, username, data) {
    const tasks = document.querySelectorAll('.task-item');
    if (taskId > 0 && taskId <= tasks.length) {
      const task = tasks[taskId - 1];
      const checkbox = task.querySelector('.checkbox');
      if (checkbox && !task.classList.contains('completed')) {
        checkbox.click(); // Trigger the click event
        
        // Play task complete sound
        this.playSound(this.fieldData.taskCompleteSound);
        
        console.log(`Task ${taskId} completed by ${username}`);
        
        // Check if all tasks are completed
        this.checkAllTasksComplete();
      }
    }
  }

  checkAllTasksComplete() {
    const tasks = document.querySelectorAll('.task-item');
    const completedTasks = document.querySelectorAll('.task-item.completed');
    
    if (tasks.length > 0 && tasks.length === completedTasks.length) {
      // All tasks completed!
      this.playSound(this.fieldData.allTasksCompleteSound);
      console.log('All tasks completed! 🎉');
    }
  }

  removeTask(taskId, username, data) {
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

  clearTasks(username, data) {
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
}
