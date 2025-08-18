// StreamElements Commands Widget
window.addEventListener('onWidgetLoad', function (obj) {
    console.log("StreamElements commands widget loaded");
    
    // Get field data from StreamElements
    const fieldData = obj.detail.fieldData;
    console.log("Commands field data:", fieldData);
    
    // Initialize the commands widget
    const _commandsWidget = new CommandsInterface(fieldData);
});

class CommandsInterface {
    constructor(fieldData) {
        this.fieldData = fieldData;
        this.commands = [
            '!new task',
            '!done task', 
            '!delete task'
        ];

        this.initializeElements();
        this.applyCustomStyling();
        this.bindEvents();
        this.addInteractivity();
    }

    initializeElements() {
        this.commandsWidget = document.querySelector('.commands-widget');
        this.commandElements = document.querySelectorAll('.command');
        this.separators = document.querySelectorAll('.separator');
        this.mainTitle = document.querySelector('.main-title');
        this.commandsTitle = document.querySelector('.commands-title');
        this.underline = document.querySelector('.underline');
    }

    applyCustomStyling() {
        console.log("Applying custom styling with field data:", this.fieldData);
        
        // Update text content
        if (this.mainTitle) {
            this.mainTitle.textContent = this.fieldData.mainTitle;
        }
        if (this.commandsTitle) {
            this.commandsTitle.textContent = this.fieldData.commandsTitle;
        }

        // Apply colors
        if (this.commandsWidget) {
            this.commandsWidget.style.backgroundColor = this.fieldData.widgetBackground;
            this.commandsWidget.style.borderRightColor = this.fieldData.widgetBorder;
            this.commandsWidget.style.borderBottomColor = this.fieldData.widgetBorder;
        }

        if (this.commandsTitle) {
            this.commandsTitle.style.color = this.fieldData.titleColor;
        }

        if (this.underline) {
            this.underline.style.backgroundColor = this.fieldData.underlineColor;
        }

        // Apply command colors
        this.commandElements.forEach(command => {
            command.style.color = this.fieldData.commandColor;
        });

        // Apply separator colors
        this.separators.forEach(separator => {
            separator.style.color = this.fieldData.separatorColor;
        });

        // Apply font family
        const fontFamily = this.getFontFamily(this.fieldData.fontFamily);
        document.body.style.fontFamily = fontFamily;

        // Apply background gradient
        document.body.style.background = `linear-gradient(135deg, ${this.fieldData.backgroundGradient} 0%, #a4a9fd 50%, #97a8fe 100%)`;
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
        // Create a slightly lighter version of the command color for hover
        const baseColor = this.fieldData.commandColor;
        const hoverColor = this.lightenColor(baseColor, 20);
        commandElement.style.color = hoverColor;
        commandElement.style.cursor = 'pointer';
        commandElement.style.transition = 'color 0.2s ease';
    }

    handleCommandLeave(commandElement) {
        commandElement.style.color = this.fieldData.commandColor;
    }

    lightenColor(color, percent) {
        // Simple color lightening function
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const B = (num >> 8 & 0x00FF) + amt;
        const G = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
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
