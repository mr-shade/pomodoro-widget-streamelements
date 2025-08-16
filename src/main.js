import './style.css'

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
            <path d="M2 8L6 12L16 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
