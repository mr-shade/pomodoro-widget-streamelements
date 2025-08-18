
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
    this.totalTasks = 10; // All 10 tasks are visible by default
    this.fieldData = fieldData;
    console.log("TodoWidget fieldData:", this.fieldData);
    
    this.init();
  }

  init() {
    console.log("TodoWidget init() called");
    this.applyCustomColors();
    this.setupEventListeners();
    this.updateProgress();
    this.initializeChatCommands();
    console.log("TodoWidget initialization complete");
  }

  applyCustomColors() {
    console.log("applyCustomColors() called");
    console.log("Field data in applyCustomColors:", this.fieldData);
    
    // Apply card background and border colors
    const taskCard = document.querySelector('.task-card');
    if (taskCard) {
      console.log("Found task-card element");
      taskCard.style.background = this.fieldData.cardBackgroundColor;
      taskCard.style.borderRightColor = this.fieldData.cardBorderColor;
      taskCard.style.borderBottomColor = this.fieldData.cardBorderColor;
    } else {
      console.log("task-card element not found");
    }
    
    // Apply title color
    const cardTitle = document.querySelector('.card-title');
    if (cardTitle) {
      console.log("Found card-title element, applying color:", this.fieldData.cardTitleColor);
      cardTitle.style.color = this.fieldData.cardTitleColor;
    } else {
      console.log("card-title element not found");
    }
    
    // Apply task text color
    document.querySelectorAll('.task-text').forEach(text => {
      text.style.color = this.fieldData.taskTextColor;
    });
    
    // Apply checkbox border color and tick color
    document.querySelectorAll('.checkbox').forEach(checkbox => {
      checkbox.style.borderColor = this.fieldData.checkboxBorderColor;
      
      // Update the tick mark color for checked items
      const tickMark = checkbox.querySelector('.tick-mark');
      if (tickMark) {
        tickMark.style.color = this.fieldData.tickColor;
      }
    });
    
    // Apply font family and size to the main card
    if (taskCard) {
      taskCard.style.fontFamily = this.getFontFamily(this.fieldData.fontFamily);
      taskCard.style.fontSize = this.fieldData.fontSize + 'px';
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

        this.updateProgress();
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

  handleChatCommand(data) {
    if (!data || !data.message) return;

    const message = data.message.toLowerCase();
    const username = data.username || 'User';

    // Parse commands
    if (message.startsWith('!todo add ')) {
      const task = data.message.substring(10).trim();
      this.addTask(task, username);
    } else if (message.startsWith('!todo complete ')) {
      const taskId = parseInt(data.message.substring(15).trim());
      this.completeTask(taskId, username);
    } else if (message.startsWith('!todo remove ')) {
      const taskId = parseInt(data.message.substring(13).trim());
      this.removeTask(taskId, username);
    } else if (message === '!todo clear') {
      this.clearTasks(username);
    }
  }

  addTask(taskText, username) {
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
    this.totalTasks++;
    this.updateProgress();

    console.log(`Task added by ${username}: ${taskText}`);
  }

  completeTask(taskId, username) {
    const tasks = document.querySelectorAll('.task-item');
    if (taskId > 0 && taskId <= tasks.length) {
      const task = tasks[taskId - 1];
      const checkbox = task.querySelector('.checkbox');
      if (checkbox && !task.classList.contains('completed')) {
        checkbox.click(); // Trigger the click event
        console.log(`Task ${taskId} completed by ${username}`);
      }
    }
  }

  removeTask(taskId, username) {
    const tasks = document.querySelectorAll('.task-item');
    if (taskId > 0 && taskId <= tasks.length) {
      const task = tasks[taskId - 1];
      task.remove();
      this.totalTasks--;
      this.updateProgress();
      console.log(`Task ${taskId} removed by ${username}`);
    }
  }

  clearTasks(username) {
    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = '';
    this.totalTasks = 0;
    this.completedTasks = 0;
    this.updateProgress();
    console.log(`All tasks cleared by ${username}`);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
