class CommandsInterface {
    constructor() {
        this.commands = [
            '!new task',
            '!done task', 
            '!delete task'
        ];
        
        this.initializeElements();
        this.bindEvents();
        this.addInteractivity();
    }
    
    initializeElements() {
        this.commandsWidget = document.querySelector('.commands-widget');
        this.commandElements = document.querySelectorAll('.command');
        this.separators = document.querySelectorAll('.separator');
    }
    
    bindEvents() {
        // Add click events to commands
        this.commandElements.forEach((command, index) => {
            command.addEventListener('click', () => {
                this.handleCommandClick(command, index);
            });
            
            command.addEventListener('mouseenter', () => {
                this.handleCommandHover(command);
            });
            
            command.addEventListener('mouseleave', () => {
                this.handleCommandLeave(command);
            });
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }
    
    handleCommandClick(commandElement, index) {
        // Add click animation
        commandElement.style.transform = 'scale(0.95)';
        commandElement.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            commandElement.style.transform = 'scale(1)';
        }, 100);
        
        // Simulate command execution
        this.executeCommand(this.commands[index]);
    }
    
    handleCommandHover(commandElement) {
        commandElement.style.color = '#90CDF4';
        commandElement.style.cursor = 'pointer';
        commandElement.style.transition = 'color 0.2s ease';
    }
    
    handleCommandLeave(commandElement) {
        commandElement.style.color = '#63B3ED';
    }
    
    executeCommand(command) {
        // Show visual feedback
        this.showCommandFeedback(command);
        
        // Log command execution (in a real app, this would trigger actual functionality)
        console.log(`Executing command: ${command}`);
    }
    
    showCommandFeedback(command) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = `Executed: ${command}`;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4299E1;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(feedback);
        
        // Animate in
        setTimeout(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 2000);
    }
    
    handleKeyboardNavigation(e) {
        // Allow navigation with arrow keys
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            this.navigateCommands(e.key === 'ArrowRight' ? 1 : -1);
        }
        
        // Execute command with Enter
        if (e.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('command')) {
                focusedElement.click();
            }
        }
    }
    
    navigateCommands(direction) {
        const commands = Array.from(this.commandElements);
        const currentIndex = commands.findIndex(cmd => cmd === document.activeElement);
        
        let newIndex;
        if (currentIndex === -1) {
            newIndex = direction > 0 ? 0 : commands.length - 1;
        } else {
            newIndex = (currentIndex + direction + commands.length) % commands.length;
        }
        
        commands[newIndex].focus();
    }
    
    addInteractivity() {
        // Make commands focusable
        this.commandElements.forEach((command, index) => {
            command.setAttribute('tabindex', '0');
            command.setAttribute('role', 'button');
            command.setAttribute('aria-label', `Execute command: ${this.commands[index]}`);
        });
        
        // Add subtle animations on load
        this.animateOnLoad();
    }
    
    animateOnLoad() {
        // Animate the widget entrance
        this.commandsWidget.style.opacity = '0';
        this.commandsWidget.style.transform = 'translateY(20px)';
        this.commandsWidget.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            this.commandsWidget.style.opacity = '1';
            this.commandsWidget.style.transform = 'translateY(0)';
        }, 100);
        
        // Animate commands one by one
        this.commandElements.forEach((command, index) => {
            command.style.opacity = '0';
            command.style.transform = 'translateX(-20px)';
            command.style.transition = 'all 0.4s ease';
            
            setTimeout(() => {
                command.style.opacity = '1';
                command.style.transform = 'translateX(0)';
            }, 200 + (index * 100));
        });
    }
}

// Initialize the commands interface when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CommandsInterface();
});

// Add some utility functions for potential command integration
window.CommandsAPI = {
    newTask: (taskName) => {
        console.log(`Creating new task: ${taskName}`);
        // In a real app, this would integrate with a task management system
    },
    
    doneTask: (taskId) => {
        console.log(`Marking task as done: ${taskId}`);
        // In a real app, this would update task status
    },
    
    deleteTask: (taskId) => {
        console.log(`Deleting task: ${taskId}`);
        // In a real app, this would remove the task
    }
};
