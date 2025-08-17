// TODO List Widget for StreamElements
class TodoWidget {
    constructor() {
        this.tasks = [];
        this.completedTasks = 3;
        this.totalTasks = 10;
        this.showingHiddenTasks = false;
        this.fieldData = this.getFieldData();
        
        // Initialize the widget
        this.init();
    }

    getFieldData() {
        // Check if we're in StreamElements environment
        if (typeof obj !== 'undefined' && obj.detail && obj.detail.fieldData) {
            return obj.detail.fieldData;
        }
        
        // Fallback values for development/testing
        return {
            maxItems: 10,
            displayMode: "card",
            animationStyle: "slide",
            showCompleted: true,
            autoHideCompleted: 5,
            showPriority: true,
            showNumbers: true,
            fontFamily: "Roboto",
            fontSize: 16,
            containerBg: "#010161",
            containerBorder: "#bee5fc",
            containerOpacity: 90,
            headerBg: "#2D3748",
            headerText: "#feb6de",
            itemBg: "#2D3748",
            itemBgHover: "#4A5568",
            itemText: "#ffffff",
            itemCompletedText: "#A0AEC0",
            itemCompletedBg: "#1A202C",
            priorityHigh: "#F56565",
            priorityMedium: "#ED8936",
            priorityLow: "#48BB78",
            checkboxColor: "#ffffff",
            checkboxChecked: "#6aacfd",
            scrollbarColor: "#6aaafe",
            borderRadius: 24,
            itemSpacing: 24,
            headerTitle: "MY TASKS",
            emptyMessage: "No tasks yet! Add one with !todo add <task>",
            soundEnabled: true,
            soundVolume: 50
        };
    }

    init() {
        this.applyCustomStyles();
        this.setupEventListeners();
        this.updateProgress();
        this.initializeChatCommands();
        
        // Show dev commands in development mode
        if (this.isDevelopmentMode()) {
            this.showDevCommands();
        }
    }

    applyCustomStyles() {
        const widget = document.querySelector('.todo-widget');
        const title = document.querySelector('.todo-title');
        const emptyMessage = document.querySelector('.empty-message');
        
        if (widget) {
            // Apply display mode
            widget.className = `todo-widget ${this.fieldData.displayMode}-mode`;
            
            // Apply container styles
            if (this.fieldData.displayMode === 'card') {
                widget.style.background = this.fieldData.containerBg;
                widget.style.borderRadius = `${this.fieldData.borderRadius}px`;
                widget.style.opacity = this.fieldData.containerOpacity / 100;
            }
            
            widget.style.fontFamily = this.fieldData.fontFamily;
            widget.style.fontSize = `${this.fieldData.fontSize}px`;
        }

        if (title) {
            title.textContent = this.fieldData.headerTitle;
            title.style.color = this.fieldData.headerText;
        }

        if (emptyMessage) {
            emptyMessage.textContent = this.fieldData.emptyMessage;
        }

        // Apply item spacing
        const todoList = document.querySelector('.todo-list');
        if (todoList) {
            todoList.style.gap = `${this.fieldData.itemSpacing}px`;
        }
    }

    setupEventListeners() {
        const taskItems = document.querySelectorAll('.todo-item');
        const showMoreBtn = document.getElementById('showMoreBtn');

        // Add event listeners to existing tasks
        taskItems.forEach((taskItem, index) => {
            this.addTaskEventListeners(taskItem, index + 1);
        });

        // Show more tasks functionality
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', () => this.toggleHiddenTasks());
        }
    }

    addTaskEventListeners(taskItem, taskNumber) {
        const checkbox = taskItem.querySelector('.todo-checkbox');
        const itemNumber = taskItem.querySelector('.item-number');

        if (checkbox) {
            checkbox.addEventListener('click', () => {
                const isCompleted = taskItem.classList.contains('completed');
                this.toggleTask(taskItem, !isCompleted);
            });
        }

        // Apply custom colors
        this.applyTaskColors(taskItem);
    }

    applyTaskColors(taskItem) {
        const text = taskItem.querySelector('.todo-text');
        const checkbox = taskItem.querySelector('.todo-checkbox');
        const itemNumber = taskItem.querySelector('.item-number');
        const isCompleted = taskItem.classList.contains('completed');

        if (text) {
            text.style.color = isCompleted ? this.fieldData.itemCompletedText : this.fieldData.itemText;
            text.style.fontSize = `${this.fieldData.fontSize}px`;
        }

        if (checkbox) {
            checkbox.style.borderColor = this.fieldData.checkboxColor;
            if (isCompleted) {
                checkbox.style.color = this.fieldData.checkboxChecked;
            }
        }
    }

    toggleTask(taskItem, completed) {
        const checkbox = taskItem.querySelector('.todo-checkbox');
        const animation = this.fieldData.animationStyle;

        if (completed) {
            // Mark as completed
            taskItem.classList.add('completed');
            if (checkbox) {
                checkbox.classList.add('checked');
                checkbox.textContent = '✓';
            }
            this.completedTasks++;

            // Apply animation
            if (animation !== 'none') {
                taskItem.classList.add(`animate-${animation}-in`);
            }

            // Auto-hide if enabled
            if (this.fieldData.autoHideCompleted > 0) {
                setTimeout(() => {
                    if (this.fieldData.showCompleted) {
                        taskItem.classList.add('fade-out');
                        setTimeout(() => {
                            taskItem.style.display = 'none';
                        }, 500);
                    }
                }, this.fieldData.autoHideCompleted * 1000);
            }

        } else {
            // Mark as incomplete
            taskItem.classList.remove('completed');
            if (checkbox) {
                checkbox.classList.remove('checked');
                checkbox.textContent = '';
            }
            this.completedTasks--;
            taskItem.style.display = 'flex';
            taskItem.classList.remove('fade-out');
        }

        this.applyTaskColors(taskItem);
        this.updateProgress();
        this.playSound(completed ? 'complete' : 'incomplete');
    }

    toggleHiddenTasks() {
        const hiddenTasks = document.querySelectorAll('.hidden-task');
        const showMoreBtn = document.getElementById('showMoreBtn');
        const animation = this.fieldData.animationStyle;

        if (!this.showingHiddenTasks) {
            // Show hidden tasks
            hiddenTasks.forEach((task, index) => {
                setTimeout(() => {
                    task.style.display = 'flex';
                    task.offsetHeight; // Force reflow
                    
                    if (animation !== 'none') {
                        task.classList.add('show', `animate-${animation}-in`);
                    } else {
                        task.classList.add('show');
                    }

                    this.addTaskEventListeners(task, index + 6);
                }, index * 100);
            });

            this.totalTasks = 15;
            showMoreBtn.textContent = 'Less';
            this.showingHiddenTasks = true;

            // Scroll to show new tasks
            setTimeout(() => {
                const taskList = document.querySelector('.todo-list');
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
                    if (animation !== 'none') {
                        task.classList.add(`animate-${animation}-out`);
                    }
                    task.classList.remove('show');
                    setTimeout(() => {
                        task.style.display = 'none';
                        task.classList.remove(`animate-${animation}-out`);
                    }, 300);
                }, index * 50);
            });

            this.totalTasks = 10;
            showMoreBtn.textContent = '5+';
            this.showingHiddenTasks = false;

            // Scroll back to top
            setTimeout(() => {
                const taskList = document.querySelector('.todo-list');
                if (taskList) {
                    taskList.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            }, 200);
        }

        this.updateProgress();
    }

    updateProgress() {
        const progressCount = document.querySelector('.count-text');
        const progressText = document.getElementById('progressText');
        const progressFill = document.getElementById('progressFill');

        const percentage = Math.round((this.completedTasks / this.totalTasks) * 100);

        if (progressCount) {
            progressCount.textContent = `${this.completedTasks}/${this.totalTasks}`;
        }

        if (progressText) {
            progressText.textContent = `${this.completedTasks}/${this.totalTasks} tasks complete (${percentage}%)`;
        }

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }

    playSound(type) {
        if (!this.fieldData.soundEnabled) return;

        // Create audio context and play sound
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            try {
                const audioContext = new (AudioContext || webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                // Different frequencies for different actions
                oscillator.frequency.value = type === 'complete' ? 800 : 400;
                gainNode.gain.value = (this.fieldData.soundVolume / 100) * 0.1;

                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (e) {
                console.log('Audio not supported');
            }
        }
    }

    // Chat Commands Integration
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
        } else if (message === '!todo list') {
            this.listTasks(username);
        }
    }

    addTask(taskText, username) {
        if (!taskText) return;

        const taskList = document.getElementById('todoList');
        const newTaskId = this.totalTasks + 1;
        
        const taskElement = document.createElement('div');
        taskElement.className = 'todo-item';
        taskElement.innerHTML = `
            <div class="item-number">${newTaskId}</div>
            <div class="todo-checkbox"></div>
            <span class="todo-text">${this.escapeHtml(taskText)}</span>
            <div class="priority-indicator priority-medium"></div>
        `;

        taskList.appendChild(taskElement);
        this.addTaskEventListeners(taskElement, newTaskId);
        this.totalTasks++;
        this.updateProgress();

        // Apply animation
        if (this.fieldData.animationStyle !== 'none') {
            taskElement.classList.add(`animate-${this.fieldData.animationStyle}-in`);
        }

        console.log(`Task added by ${username}: ${taskText}`);
    }

    completeTask(taskId, username) {
        const tasks = document.querySelectorAll('.todo-item');
        if (taskId > 0 && taskId <= tasks.length) {
            const task = tasks[taskId - 1];
            if (!task.classList.contains('completed')) {
                this.toggleTask(task, true);
                console.log(`Task ${taskId} completed by ${username}`);
            }
        }
    }

    removeTask(taskId, username) {
        const tasks = document.querySelectorAll('.todo-item');
        if (taskId > 0 && taskId <= tasks.length) {
            const task = tasks[taskId - 1];
            task.remove();
            this.totalTasks--;
            this.updateProgress();
            console.log(`Task ${taskId} removed by ${username}`);
        }
    }

    clearTasks(username) {
        const taskList = document.getElementById('todoList');
        taskList.innerHTML = '';
        this.totalTasks = 0;
        this.completedTasks = 0;
        this.updateProgress();
        console.log(`All tasks cleared by ${username}`);
    }

    listTasks(username) {
        const tasks = document.querySelectorAll('.todo-item');
        console.log(`Tasks requested by ${username}:`, tasks.length);
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
                <div><strong>!todo list</strong> - List all tasks</div>
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
