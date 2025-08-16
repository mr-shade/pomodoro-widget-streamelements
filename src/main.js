import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="tasklist-container">
    <h1 class="page-title">Tasklist</h1>
    
    <div class="task-card">
      <h2 class="card-title">MY TASKS</h2>
      
      <div class="task-list">
        <div class="task-item completed">
          <div class="checkbox checked">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="task-text">Hydrate</span>
        </div>
        
        <div class="task-item completed">
          <div class="checkbox checked">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="task-text">Clean my desk</span>
        </div>
        
        <div class="task-item completed">
          <div class="checkbox checked">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="task-text">Organise Notes</span>
        </div>
        
        <div class="task-item">
          <div class="checkbox"></div>
          <span class="task-text">Reply to emails</span>
        </div>
        
        <div class="task-item">
          <div class="checkbox"></div>
          <span class="task-text">Finish homework</span>
        </div>
      </div>
      
      <div class="more-tasks-btn">5+</div>
    </div>
    
    <div class="progress-section">
      <div class="progress-bar-container">
        <div class="progress-info">
          <span class="progress-count">3/10</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="progress-info">
          <span class="progress-percentage">30%</span>
        </div>
      </div>
      <p class="progress-label">Progress Bar</p>
    </div>
  </div>
`

// Add interactive functionality
document.addEventListener('DOMContentLoaded', function() {
  const taskItems = document.querySelectorAll('.task-item');
  const progressCount = document.querySelector('.progress-count');
  const progressPercentage = document.querySelector('.progress-percentage');
  const progressFill = document.querySelector('.progress-fill');
  
  let completedTasks = 3;
  const totalTasks = 10;
  
  function updateProgress() {
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    progressCount.textContent = `${completedTasks}/${totalTasks}`;
    progressPercentage.textContent = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;
  }
  
  taskItems.forEach(taskItem => {
    const checkbox = taskItem.querySelector('.checkbox');
    const taskText = taskItem.querySelector('.task-text');
    
    checkbox.addEventListener('click', function() {
      const isCompleted = taskItem.classList.contains('completed');
      
      if (isCompleted) {
        // Uncheck the task
        taskItem.classList.remove('completed');
        checkbox.classList.remove('checked');
        checkbox.innerHTML = '';
        completedTasks--;
      } else {
        // Check the task
        taskItem.classList.add('completed');
        checkbox.classList.add('checked');
        checkbox.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        completedTasks++;
      }
      
      updateProgress();
    });
  });
  
  // Initialize progress
  updateProgress();
});
