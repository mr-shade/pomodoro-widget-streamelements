
// Original TODO functionality with StreamElements integration
class TodoWidget {
  constructor() {
    this.completedTasks = 3;
    this.totalTasks = 10;
    this.showingHiddenTasks = false;
    this.fieldData = this.getFieldData();
    
    this.init();
  }

  getFieldData() {
    // Check if we're in StreamElements environment
    if (typeof obj !== 'undefined' && obj.detail && obj.detail.fieldData) {
      return obj.detail.fieldData;
    }
    
    // Fallback values for development/testing
    return {
      headerTitle: "MY TASKS",
      pageTitle: "Tasklist",
      progressLabel: "Progress Bar",
      cardColor: "#010161",
      cardBorderColor: "#bee5fc",
      titleColor: "#feb6de",
      textColor: "#ffffff",
      checkboxColor: "#6aacfd",
      buttonColor: "#6aaafe",
      progressBg: "linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)",
      progressFill: "linear-gradient(90deg, #b988fe 0%, #c696ff 30%, #9088fe 60%, #5c7afc 80%, #5c7afc 100%)"
    };
  }

  init() {
    this.applyCustomColors();
    this.setupEventListeners();
    this.updateProgress();
    this.initializeChatCommands();
    
    // Show dev commands in development mode
    if (this.isDevelopmentMode()) {
      this.showDevCommands();
    }
  }

  applyCustomColors() {
    // Apply customizable text content
    const cardTitle = document.querySelector('.card-title');
    const pageTitle = document.querySelector('.page-title');
    const progressLabel = document.querySelector('.progress-label');
    const taskCard = document.querySelector('.task-card');
    const progressContainer = document.querySelector('.progress-bar-container');
    const progressFill = document.querySelector('.progress-fill');

    if (cardTitle) cardTitle.textContent = this.fieldData.headerTitle;
    if (pageTitle) pageTitle.textContent = this.fieldData.pageTitle;
    if (progressLabel) progressLabel.textContent = this.fieldData.progressLabel;

    // Apply colors if customized
    if (taskCard) {
      taskCard.style.background = this.fieldData.cardColor;
      taskCard.style.borderRightColor = this.fieldData.cardBorderColor;
      taskCard.style.borderBottomColor = this.fieldData.cardBorderColor;
    }

    if (cardTitle) {
      cardTitle.style.color = this.fieldData.titleColor;
    }

    if (progressContainer) {
      progressContainer.style.background = this.fieldData.progressBg;
    }

    if (progressFill) {
      progressFill.style.background = this.fieldData.progressFill;
    }

    // Apply text colors
    document.querySelectorAll('.task-text').forEach(text => {
      text.style.color = this.fieldData.textColor;
    });

    // Apply checkbox colors
    document.querySelectorAll('.checkbox svg').forEach(svg => {
      svg.style.color = this.fieldData.checkboxColor;
    });

    // Apply button color
    const moreBtn = document.querySelector('.more-tasks-btn');
    if (moreBtn) {
      moreBtn.style.background = this.fieldData.buttonColor;
    }
  }

  setupEventListeners() {
    const taskItems = document.querySelectorAll('.task-item');
    const showMoreBtn = document.getElementById('showMoreBtn');
    const hiddenTasks = document.querySelectorAll('.hidden-task');

    // Add event listeners to existing tasks
    taskItems.forEach(taskItem => {
      this.addTaskEventListeners(taskItem);
    });

    // Show more tasks functionality
    if (showMoreBtn) {
      showMoreBtn.addEventListener('click', () => {
        this.toggleHiddenTasks(hiddenTasks, showMoreBtn);
      });
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

        this.updateProgress();
      });
    }
  }

  toggleHiddenTasks(hiddenTasks, showMoreBtn) {
    if (!this.showingHiddenTasks) {
      // Show hidden tasks
      hiddenTasks.forEach((task, index) => {
        setTimeout(() => {
          task.style.display = 'flex';
          // Force reflow
          task.offsetHeight;
          task.classList.add('show');

          // Add event listeners to newly shown tasks
          this.addTaskEventListeners(task);
        }, index * 100); // Stagger the animation
      });

      // Update total tasks count
      this.totalTasks = 15;
      this.updateProgress();

      // Update button text and hide it
      showMoreBtn.textContent = 'Less';
      this.showingHiddenTasks = true;

      // Scroll to show the new tasks
      setTimeout(() => {
        const taskList = document.querySelector('.task-list');
        if (taskList) {
          taskList.scrollTo({
            top: taskList.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, hiddenTasks.length * 100 + 200);

    } else {
      // Hide tasks
      hiddenTasks.forEach((task, index) => {
        setTimeout(() => {
          task.classList.remove('show');
          setTimeout(() => {
            task.style.display = 'none';
          }, 300); // Wait for animation to complete
        }, index * 50);
      });

      // Update total tasks count
      this.totalTasks = 10;
      this.updateProgress();

      // Update button text
      showMoreBtn.textContent = '5+';
      this.showingHiddenTasks = false;

      // Scroll back to top
      setTimeout(() => {
        const taskList = document.querySelector('.task-list');
        if (taskList) {
          taskList.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }, 200);
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

    // Mock SE_API for development
    if (this.isDevelopmentMode() && !window.SE_API) {
      window.SE_API = {
        store: new Map(),
        getStore: (key) => window.SE_API.store.get(key) || [],
        setStore: (key, value) => window.SE_API.store.set(key, value)
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

  isDevelopmentMode() {
    return !(typeof obj !== 'undefined' && obj.detail && obj.detail.fieldData) && 
           !(typeof window !== 'undefined' && window.SE_API && window.SE_API.getFieldData);
  }

  showDevCommands() {
    if (!document.querySelector('.dev-commands')) {
      const devDiv = document.createElement('div');
      devDiv.className = 'dev-commands';
      devDiv.innerHTML = `
        <h4>TODO Widget Commands (Dev Mode)</h4>
        <div><strong>!todo add &lt;task&gt;</strong> - Add a new task</div>
        <div><strong>!todo complete &lt;number&gt;</strong> - Complete task by number</div>
        <div><strong>!todo remove &lt;number&gt;</strong> - Remove task by number</div>
        <div><strong>!todo clear</strong> - Clear all tasks</div>
        <div><em>Click checkboxes to toggle tasks</em></div>
        <div><em>Click "5+" to show/hide extra tasks</em></div>
      `;
      document.body.appendChild(devDiv);
    }
  }
}

// Initialize the widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TodoWidget();
});
