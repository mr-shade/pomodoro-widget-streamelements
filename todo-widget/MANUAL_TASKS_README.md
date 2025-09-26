# Manual Tasks Feature

## Overview
The StreamElements Todo Widget now supports manually adding tasks directly from the StreamElements dashboard using the fields.json configuration. This allows streamers to pre-populate their task list or add important tasks without relying on chat commands.

## Features

### Manual Task Fields
- **Single Comma-Separated Field**: Enter multiple tasks separated by commas in one field
- **Simplified Configuration**: No individual priority settings for manual tasks
- **Enable/Disable**: Toggle manual tasks on/off
- **Auto-Clear Option**: Optionally clear manual tasks from dashboard after loading

### Priority System
Tasks can still be assigned priority levels via chat commands that affect their visual appearance:

- **High Priority** (!high): Red border, bold text, red accent color
- **Medium Priority** (!med): Orange border, medium-weight text, orange accent color  
- **Low Priority** (!low): Green border, green accent color
- **Normal Priority**: Standard appearance

## Configuration Fields

Add these fields to your `widget.json` file:

```json
{
  "manualTasksHeader": {
    "type": "text",
    "label": "═══════ Manual Tasks ═══════",
    "value": ""
  },
  "manualTasks": {
    "type": "text",
    "label": "Manual Tasks (comma-separated)",
    "value": ""
  },
  "enableManualTasks": {
    "type": "checkbox",
    "label": "Enable Manual Tasks from Dashboard",
    "value": true
  },
  "clearManualTasksOnLoad": {
    "type": "checkbox",
    "label": "Clear Manual Tasks After Loading",
    "value": false
  }
}
```

## Usage

### Dashboard Setup
1. Open your StreamElements widget dashboard
2. Navigate to the Manual Tasks section
3. Enter multiple tasks separated by commas in the "Manual Tasks" field
4. Example: "Review highlights, Setup stream, Check Discord, Update social media"
5. Enable "Enable Manual Tasks from Dashboard"
6. Save your configuration

### Chat Commands with Priority
Users can also add tasks with priority via chat commands:

- `!task buy groceries !high` - Adds a high priority task
- `!task clean room !med` - Adds a medium priority task  
- `!task water plants !low` - Adds a low priority task
- `!task regular task` - Adds a normal priority task

### Priority Keywords
- `!high` - High priority (red styling)
- `!med` or `!medium` - Medium priority (orange styling)  
- `!low` - Low priority (green styling)

## Testing

Use the provided test files to verify functionality:
- `test-manual-tasks.html` - Test manual tasks and priority system
- `test-final.html` - Test general chat command functionality

## CSS Classes

The following CSS classes are applied based on priority:
- `.high-priority` - High priority tasks
- `.medium-priority` - Medium priority tasks
- `.low-priority` - Low priority tasks

## Implementation Details

### Loading Process
1. Manual tasks are loaded during widget initialization
2. Only non-empty task fields are processed
3. Tasks are added with 'Dashboard' as the username
4. Priority styling is applied automatically

### Data Structure
Manual tasks are processed from a comma-separated field:
```javascript
const manualTasksString = this.fieldData.manualTasks;
const tasks = manualTasksString.split(',').map(task => task.trim()).filter(task => task.length > 0);

tasks.forEach((taskText, index) => {
  if (taskText) {
    this.addTask(taskText, 'Dashboard', null, 'none');
  }
});
```

## Compatibility
- Works with existing chat command system
- Maintains all existing widget functionality
- Compatible with StreamElements event system
- Supports all existing permission levels

## Configuration Tips
1. Use descriptive task names for better organization
2. Separate tasks with commas: "task1, task2, task3"
3. Consider using manual tasks for recurring daily activities
4. Use chat commands for priority tasks: "!task urgent task !high"
5. Enable "Clear Manual Tasks After Loading" if you prefer one-time use
6. Example format: "Review highlights, Setup stream, Check Discord, Update social media"