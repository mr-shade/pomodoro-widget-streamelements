const streamerTasks = [];
let isLocked = false;
let globalFieldData = null;
let completedTasks = 0;
let lastHighlightedTask = null;
let highlightTimeout = null;

let taskStateKey;

function saveTaskState() {
    SE_API.store.set(taskStateKey, {
        tasks: streamerTasks,
        isLocked: isLocked,
        completedTasks: completedTasks
    });
}

async function loadTaskState() {
    let savedState = await SE_API.store.get(taskStateKey);
    if (savedState) {
        savedState.tasks.forEach(task => streamerTasks.push(task));
        isLocked = savedState.isLocked;
        completedTasks = savedState.completedTasks;
        renderTasks();
        updateProgressBar();
    }
}

function setTaskListBackgroundImage(imageKey) {
    const taskList = document.querySelector('.task-list');
    const imageURL = globalFieldData[imageKey] || '';
    if (taskList && imageURL) {
        taskList.style.backgroundImage = `url(${imageURL})`;
        taskList.style.backgroundSize = 'cover';
    }
}

function addTask(task, username, priority = 'none', tag = null) {
    if (isLocked && !isAuthorized(username, 'broadcaster', 'moderator')) {
        return;
    }
    const taskId = `task-${Date.now()}`;
    const taskObj = { id: taskId, task, username, completed: false, priority, tag };
    streamerTasks.push(taskObj);
    renderTasks();
    setTimeout(() => {
        document.getElementById(taskId)?.classList.add('animate');
    }, 0);
    updateProgressBar();
    saveTaskState();
}

function completeTask(taskName, username, role) {
    const taskIndex = streamerTasks.findIndex(t => t.task.toLowerCase().trim() === taskName.toLowerCase().trim() && (t.username === username || role === 'moderator' || role === 'broadcaster'));
    if (taskIndex !== -1) {
        const task = streamerTasks[taskIndex];
        task.completed = true;
        completedTasks++;
        updateTaskIcon(task.id);
        renderTasks();
        updateProgressBar();
        saveTaskState();

        // Trigger background change animation
        const animationImageKey = globalFieldData.animationImage || '';
        const backgroundImageKey = globalFieldData.backgroundImage || '';
        const taskList = document.querySelector('.task-list');
        if (animationImageKey && taskList) {
            taskList.classList.add('fade-in-out');
            setTimeout(() => {
                setTaskListBackgroundImage(animationImageKey);
            }, 1500); // Half of the 3s animation
            setTimeout(() => {
                setTaskListBackgroundImage(backgroundImageKey);
                taskList.classList.remove('fade-in-out');
            }, 3000);
        }
    }
}

function updateTaskIcon(taskId) {
    const taskElement = document.getElementById(taskId);
    if (!taskElement) return;

    const icon = taskElement.querySelector('.icon');
    const completedIconURL = globalFieldData.completedIcon || '';
    if (completedIconURL !== 'none') {
        icon.style.webkitMask = `url(${completedIconURL}) center/contain no-repeat`;
    }
}

function removeTask(taskName, username, role) {
    const taskIndex = streamerTasks.findIndex(t => t.task.toLowerCase().trim() === taskName.toLowerCase().trim() && (t.username === username || role === 'moderator' || role === 'broadcaster'));
    if (taskIndex !== -1) {
        const [task] = streamerTasks.splice(taskIndex, 1);
        if (task.completed) {
            completedTasks--;
        }
        renderTasks();
        updateProgressBar();
        saveTaskState();
    }
}

function getPriorityClass(task) {
    if (task.priority === 'high') return 'high-priority';
    if (task.priority === 'med') return 'medium-priority';
    if (task.priority === 'low') return 'low-priority';
    return '';
}

function renderTask(taskObj, ul) {
    let li = document.getElementById(taskObj.id);

    if (!li) {
        li = document.createElement('li');
        li.id = taskObj.id;
        ul.appendChild(li);
    }

    const checkboxImageURL = taskObj.completed ? globalFieldData.completedIcon : globalFieldData.checkboxImage || '';
    const checkboxColor = globalFieldData.checkboxColor || '#000000';
    const checkboxIconSize = globalFieldData.checkboxIconSize || 20;
    const taskFontSize = globalFieldData.taskFontSize || 14;
    const taskFontColor = globalFieldData.taskFontColor || '#000000';
    const completedTaskColor = globalFieldData.completedTaskColor || '#000000';
    const showUsername = globalFieldData.showUsername || false;
    const usernameColor = globalFieldData.usernameColor || '#000000';

    li.style.fontSize = `${taskFontSize}px`;
    li.style.color = taskObj.completed ? completedTaskColor : taskFontColor;
    li.className = `${taskObj.completed ? 'completed' : 'new-task'} ${getPriorityClass(taskObj)}`;

    li.innerHTML = '';

    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.style.webkitMask = `url(${checkboxImageURL}) center/contain no-repeat`;
    icon.style.backgroundColor = checkboxColor;
    icon.style.width = `${checkboxIconSize}px`;
    icon.style.height = `${checkboxIconSize}px`;
    icon.onclick = () => completeTask(taskObj.task, taskObj.username, 'broadcaster');
    li.appendChild(icon);

    if (showUsername) {
        const usernameSpan = document.createElement('span');
        usernameSpan.textContent = `${taskObj.username}: `;
        usernameSpan.style.color = usernameColor;
        usernameSpan.style.marginRight = '5px';
        li.appendChild(usernameSpan);
    }

    const taskText = document.createTextNode(taskObj.task);
    li.appendChild(taskText);

    if (taskObj.completed && globalFieldData.taskVisibility === 'hide') {
        li.style.display = 'none';
    } else {
        li.style.display = '';
    }
}

function renderTasks() {
    const taskContainer = document.getElementById('scrolling-tasks-container');
    if (!taskContainer) return;
    
    taskContainer.innerHTML = ''; // Clear existing tasks

    const groupedTasks = streamerTasks.reduce((acc, task) => {
        const tag = task.tag || '';
        if (!acc[tag]) acc[tag] = [];
        acc[tag].push(task);
        return acc;
    }, {});

    if (groupedTasks['']) {
        const ul = document.createElement('ul');
        ul.className = 'task-list';
        renderTaskGroup(groupedTasks[''], ul);
        taskContainer.appendChild(ul);
        delete groupedTasks[''];
    }

    for (const [tag, tasks] of Object.entries(groupedTasks)) {
        if (globalFieldData.taskVisibility === 'hide' && tasks.every(task => task.completed)) {
            continue;
        }

        const tagContainer = document.createElement('div');
        tagContainer.className = 'tag-container';

        if (tag) {
            const tagHeader = document.createElement('h3');
            tagHeader.className = `tag-header ${globalFieldData.tagAlignment}`;
            tagHeader.style.textAlign = globalFieldData.tagAlignment;
            if (globalFieldData.tagAlignment === 'left') {
                tagHeader.style.paddingLeft = '15px';
            }
            tagHeader.textContent = tag;
            tagContainer.appendChild(tagHeader);
        }

        const ul = document.createElement('ul');
        ul.className = 'task-list';
        tagContainer.appendChild(ul);

        renderTaskGroup(tasks, ul);
        taskContainer.appendChild(tagContainer);
    }

    updateScrolling(); // Call scrolling update after rendering
}

function renderTaskGroup(tasks, ul) {
    const sortedTasks = tasks.slice().sort((a, b) => a.completed - b.completed);
    sortedTasks.forEach(taskObj => renderTask(taskObj, ul));
}

/* Scroll Feature Implementation */
function updateScrolling() {
    const taskContainer = document.getElementById('scrolling-tasks-container');
    if (!taskContainer) return;

    const taskThreshold = globalFieldData.taskThreshold || 12; // Default to 12 if not set

    if (streamerTasks.length > taskThreshold) {
        taskContainer.classList.add('scrolling');
    } else {
        taskContainer.classList.remove('scrolling');
    }
}

function updateProgressBar() {
    const progressContainer = document.getElementById('progress-container');
    if (globalFieldData.hideProgressBar) {
        progressContainer.style.display = 'none';
        return;
    } else {
        progressContainer.style.display = 'flex';
    }

    const progressBarInner = document.getElementById('progress-bar-inner');
    const progressText = document.getElementById('progress-text');
    const totalTasks = streamerTasks.length;
    const completedTasks = streamerTasks.filter(task => task.completed).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    if (progressBarInner) {
        progressBarInner.style.width = `${progress}%`;
    }

    if (progressText) {
        progressText.textContent = `${completedTasks}/${totalTasks}`;
        progressText.style.fontSize = `${globalFieldData.progressFontSize || 14}px`;
        progressText.style.color = `${globalFieldData.progressFontColor || '#000000'}`;
    }
}

function isAuthorized(role, commandType) {
    const allowedRole = globalFieldData.allowedUsers.toLowerCase();
    console.log(`Allowed Role: ${allowedRole}, User Role: ${role}`);

    if (commandType === 'admin') {
        return role === 'broadcaster' || role === 'moderator';
    } else {
        switch (allowedRole) {
            case 'viewers':
                return role === 'viewer';
            case 'broadcaster':
                return role === 'broadcaster';
            case 'mods':
                return role === 'moderator';
            case 'subs':
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
                return false;
        }
    }
}

function handleCommand(command, user, role) {
    if (!globalFieldData) {
        return;
    }

    if (isLocked && role !== 'moderator' && role !== 'broadcaster') return;

    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    let priority = 'none';
    let task = '';
    let tag = null;

    const adminCommands = [globalFieldData.resetCommand?.toLowerCase(), globalFieldData.lockCommand?.toLowerCase(), globalFieldData.unlockCommand?.toLowerCase(), '!lock', '!unlock', '!reset'];
    const taskCommands = [globalFieldData.newTaskCommand?.toLowerCase(), globalFieldData.altNewTaskCommand?.toLowerCase(), globalFieldData.completeTaskCommand?.toLowerCase(), globalFieldData.altCompleteTaskCommand?.toLowerCase(), globalFieldData.removeTaskCommand?.toLowerCase(), globalFieldData.altRemoveTaskCommand?.toLowerCase()];

    if (adminCommands.includes(cmd)) {
        if (!isAuthorized(role.toLowerCase(), 'admin')) {
            return;
        }
    } else if (taskCommands.includes(cmd)) {
        if (!isAuthorized(role.toLowerCase(), 'task')) {
            return;
        }
    }

    if (cmd === globalFieldData.newTaskCommand?.toLowerCase() || cmd === globalFieldData.altNewTaskCommand?.toLowerCase()) {
        if (globalFieldData.enableTags && parts.includes('!tag')) {
            tag = parts[parts.indexOf('!tag') + 1];
            task = parts.slice(1, parts.indexOf('!tag')).join(' ');
        } else {
            task = parts.slice(1).join(' ');
        }
        if (globalFieldData.enablePriorityCommands && task.startsWith('!')) {
            priority = task.split(' ')[0].substring(1).toLowerCase();
            task = task.split(' ').slice(1).join(' ');
        }
        addTask(task, user, priority, tag);
    } else {
        task = parts.slice(1).join(' ');
    }

    switch (cmd) {
        case globalFieldData.completeTaskCommand?.toLowerCase():
        case globalFieldData.altCompleteTaskCommand?.toLowerCase():
            completeTask(task, user, role);
            break;
        case globalFieldData.removeTaskCommand?.toLowerCase():
        case globalFieldData.altRemoveTaskCommand?.toLowerCase():
            removeTask(task, user, role);
            break;
        case globalFieldData.resetCommand?.toLowerCase():
            streamerTasks.length = 0;
            completedTasks = 0;
            renderTasks();
            updateProgressBar();
            saveTaskState();
            break;
        case globalFieldData.lockCommand?.toLowerCase():
        case '!lock':
            isLocked = true;
            saveTaskState();
            break;
        case globalFieldData.unlockCommand?.toLowerCase():
        case '!unlock':
            isLocked = false;
            saveTaskState();
            break;
        case globalFieldData.deleteCommand?.toLowerCase():
            streamerTasks.length = 0;
            completedTasks = 0;
            renderTasks();
            updateProgressBar();
            saveTaskState();
            break;
        case globalFieldData.highlightTaskCommand?.toLowerCase():
        case '!highlight':
            if (globalFieldData.highlightEnabled) {
                highlightRandomTask();
            }
            break;
        default:
    }
}

function highlightRandomTask() {
    const tasks = document.querySelectorAll('#streamer-task-container li:not(.completed)');
    if (tasks.length === 0) {
        return;
    }

    if (lastHighlightedTask) {
        lastHighlightedTask.classList.remove('highlight');
    }

    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

    randomTask.classList.add('highlight');
    lastHighlightedTask = randomTask;

    if (highlightTimeout) {
        clearTimeout(highlightTimeout);
    }

    const duration = (globalFieldData.highlightDuration || 15) * 1000;
    highlightTimeout = setTimeout(() => {
        randomTask.classList.remove('highlight');
    }, duration);
}

function toggleSparkleVisibility() {
    const body = document.body;
    if (globalFieldData.sparkleVisibility) {
        body.classList.remove('hide-sparkles');
    } else {
        body.classList.add('hide-sparkles');
    }
}

window.addEventListener('onEventReceived', function (obj) {
    const data = obj.detail.event;
    const user = data.data?.nick || data.data?.user_name || 'unknown user';
    const role = data.data?.tags?.badges || 'viewer';

    console.log(`Message received - User: ${user} Role: ${role}`);

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
        handleCommand(data.renderedText, user, userRole);
    }
});

window.addEventListener('onWidgetLoad', async function (obj) {
    globalFieldData = obj.detail.fieldData;

    // Use custom API key if provided, else default to "CozyspriteTaskListState"
    taskStateKey = globalFieldData.customApiKey || "CozyspriteTaskListState";

    const titleIconImageURL = globalFieldData.titleIconImage || '';
    const titleIconColor = globalFieldData.titleIconColor || '#000000';
    const titleIconSize = globalFieldData.titleIconSize || 20;
    const titleIcon = document.getElementById('streamer-title-icon');
    if (titleIconImageURL && titleIcon) {
        titleIcon.style.webkitMask = `url(${titleIconImageURL}) center/contain no-repeat`;
        titleIcon.style.backgroundColor = titleIconColor;
        titleIcon.style.width = `${titleIconSize}px`;
        titleIcon.style.height = `${titleIconSize}px`;
    }

    toggleSparkleVisibility();

    const backgroundImageKey = globalFieldData.backgroundImage || '';
    setTaskListBackgroundImage(backgroundImageKey);

    await loadTaskState();
    renderTasks();
    updateProgressBar();
    updateScrolling();

    // Add event listener to the sparkleVisibility checkbox
    const sparkleVisibilityCheckbox = document.querySelector('input[name="sparkleVisibility"]');
    if (sparkleVisibilityCheckbox) {
        sparkleVisibilityCheckbox.addEventListener('change', (event) => {
            globalFieldData.sparkleVisibility = event.target.checked;
            toggleSparkleVisibility();
        });
    }
});