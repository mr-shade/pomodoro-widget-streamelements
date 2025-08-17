import './style.css'

// Add interactive functionality
document.addEventListener('DOMContentLoaded', function() {
  const taskItems = document.querySelectorAll('.task-item');
  const progressCount = document.querySelector('.progress-count');
  const progressPercentage = document.querySelector('.progress-percentage');
  const progressFill = document.querySelector('.progress-fill');
  const showMoreBtn = document.getElementById('showMoreBtn');
  const hiddenTasks = document.querySelectorAll('.hidden-task');
  
  let completedTasks = 3;
  let totalTasks = 10;
  let showingHiddenTasks = false;
  
  function updateProgress() {
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    progressCount.textContent = `${completedTasks}/${totalTasks}`;
    progressPercentage.textContent = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;
  }
  
  function addTaskEventListeners(taskItem) {
    const checkbox = taskItem.querySelector('.checkbox');
    
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
  }
  
  // Add event listeners to existing tasks
  taskItems.forEach(taskItem => {
    addTaskEventListeners(taskItem);
  });
  
  // Show more tasks functionality
  showMoreBtn.addEventListener('click', function() {
    if (!showingHiddenTasks) {
      // Show hidden tasks
      hiddenTasks.forEach((task, index) => {
        setTimeout(() => {
          task.style.display = 'flex';
          // Force reflow
          task.offsetHeight;
          task.classList.add('show');
          
          // Add event listeners to newly shown tasks
          addTaskEventListeners(task);
        }, index * 100); // Stagger the animation
      });
      
      // Update total tasks count
      totalTasks = 15;
      updateProgress();
      
      // Update button text and hide it
      showMoreBtn.textContent = 'Less';
      showingHiddenTasks = true;
      
      // Scroll to show the new tasks
      setTimeout(() => {
        const taskList = document.querySelector('.task-list');
        taskList.scrollTo({
          top: taskList.scrollHeight,
          behavior: 'smooth'
        });
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
      totalTasks = 10;
      updateProgress();
      
      // Update button text
      showMoreBtn.textContent = '5+';
      showingHiddenTasks = false;
      
      // Scroll back to top
      setTimeout(() => {
        const taskList = document.querySelector('.task-list');
        taskList.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 200);
    }
  });
  
  // Initialize progress
  updateProgress();
});
