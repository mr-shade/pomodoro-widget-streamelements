// Global variables
let currentProgress = 0;
let milestones = [];
let currentGoalIndex = 0;
let visibleMilestones = 3;

// Parse field data on widget load
window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    
    // Initialize milestones from field data
    const milestoneNames = fieldData.milestoneNames ? fieldData.milestoneNames.split(',').map(s => s.trim()) : [];
    const milestoneValues = fieldData.milestoneValues ? fieldData.milestoneValues.split(',').map(s => parseInt(s.trim())) : [];
    
    milestones = milestoneNames.map((name, index) => ({
        name: name,
        value: milestoneValues[index] || 0,
        completed: false
    }));
    
    // Initialize progress from session storage or start at 0
    currentProgress = parseInt(fieldData.startingProgress) || 0;
    
    // Get conversion settings
    const settings = {
        subT1Value: parseInt(fieldData.subT1Value) || 1,
        subT2Value: parseInt(fieldData.subT2Value) || 2,
        subT3Value: parseInt(fieldData.subT3Value) || 6,
        bitsPerCount: parseInt(fieldData.bitsPerCount) || 500,
        tipsPerCount: parseInt(fieldData.tipsPerCount) || 5,
        cheerValue: parseInt(fieldData.cheerValue) || 1,
        tipValue: parseInt(fieldData.tipValue) || 1,
        raidValue: parseInt(fieldData.raidValue) || 1,
        hostValue: parseInt(fieldData.hostValue) || 1
    };
    
    window.milestoneSettings = settings;
    
    // Update display
    updateDisplay();
    renderVisibleMilestones();
});

// Handle events (subs, tips, cheers, raids, hosts)
window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;
    
    let valueToAdd = 0;
    
    switch(listener) {
        case 'subscriber':
            // Handle different sub tiers
            const tier = event.tier ? parseInt(event.tier) : 1000;
            const amount = event.amount || 1; // For gift subs
            
            if (tier === 3000 || tier === "3000") {
                valueToAdd = window.milestoneSettings.subT3Value * amount;
            } else if (tier === 2000 || tier === "2000") {
                valueToAdd = window.milestoneSettings.subT2Value * amount;
            } else {
                valueToAdd = window.milestoneSettings.subT1Value * amount;
            }
            break;
            
        case 'cheer':
            const bits = event.amount || 0;
            valueToAdd = Math.floor(bits / window.milestoneSettings.bitsPerCount) * window.milestoneSettings.cheerValue;
            break;
            
        case 'tip':
            const tipAmount = event.amount || 0;
            valueToAdd = Math.floor(tipAmount / window.milestoneSettings.tipsPerCount) * window.milestoneSettings.tipValue;
            break;
            
        case 'raid':
            const raiders = event.amount || 0;
            if (raiders >= 10) { // Only count raids with 10+ viewers
                valueToAdd = window.milestoneSettings.raidValue;
            }
            break;
            
        case 'host':
            const viewers = event.amount || 0;
            if (viewers >= 10) { // Only count hosts with 10+ viewers
                valueToAdd = window.milestoneSettings.hostValue;
            }
            break;
    }
    
    if (valueToAdd > 0) {
        addProgress(valueToAdd);
    }
});

// Add progress and check for completed milestones
function addProgress(value) {
    currentProgress += value;
    
    // Check for newly completed milestones
    milestones.forEach((milestone, index) => {
        if (!milestone.completed && currentProgress >= milestone.value) {
            milestone.completed = true;
            if (index === currentGoalIndex) {
                // Move to next goal
                currentGoalIndex++;
            }
        }
    });
    
    updateDisplay();
    renderVisibleMilestones();
}

// Update progress bar and timer display
function updateDisplay() {
    // Find current active goal
    let currentGoal = milestones[currentGoalIndex];
    
    if (!currentGoal) {
        // All goals completed
        currentGoal = milestones[milestones.length - 1];
        $('#current-value').text(currentGoal ? currentGoal.value : currentProgress);
        $('#goal-value').text(currentGoal ? currentGoal.value : currentProgress);
        $('#progress-bar').css('width', '100%');
        return;
    }
    
    // Update timer display
    $('#current-value').text(currentProgress);
    $('#goal-value').text(currentGoal.value);
    
    // Update progress bar
    const previousGoalValue = currentGoalIndex > 0 ? milestones[currentGoalIndex - 1].value : 0;
    const currentGoalValue = currentGoal.value;
    const progressInCurrentGoal = currentProgress - previousGoalValue;
    const goalRange = currentGoalValue - previousGoalValue;
    const percentage = Math.min(100, (progressInCurrentGoal / goalRange) * 100);
    
    $('#progress-bar').css('width', percentage + '%');
}

// Render visible milestones (sliding window)
function renderVisibleMilestones() {
    const container = $('#milestones-list');
    container.empty();
    
    // Calculate which milestones to show
    let startIndex = Math.max(0, currentGoalIndex - 1);
    let endIndex = Math.min(milestones.length, startIndex + visibleMilestones);
    
    // Adjust start if we're near the end
    if (endIndex - startIndex < visibleMilestones && milestones.length >= visibleMilestones) {
        startIndex = Math.max(0, endIndex - visibleMilestones);
    }
    
    // Render visible milestones
    for (let i = startIndex; i < endIndex; i++) {
        const milestone = milestones[i];
        const completedClass = milestone.completed ? 'completed' : '';
        
        const milestoneHtml = `
            <div class="milestone-item ${completedClass}">
                <div class="checkmark"></div>
                <div class="milestone-content">
                    <span class="milestone-text">${milestone.name}</span>
                    <span class="milestone-value">${milestone.value}</span>
                </div>
            </div>
        `;
        
        container.append(milestoneHtml);
    }
}
