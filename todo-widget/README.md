# StreamElements TODO List Widget

A beautiful TODO list widget for StreamElements that preserves the original design with customizable colors and chat command integration.

## Files

- `widget.html` - Main widget HTML structure (original design)
- `widget.css` - Original styling adapted for StreamElements
- `widget.js` - Interactive functionality with StreamElements integration
- `widget.json` - Essential customization fields for StreamElements dashboard

## Features

### ✨ **Original Design Preserved**
- Exact visual style from your original tasklist app
- Blue gradient theme (`#010161` background, `#bee5fc` borders)
- Pink header text (`#feb6de`) and purple/blue color scheme
- Original task list with checkbox interactions
- "5+" expandable task functionality (shows 5 more tasks)
- Progress bar with gradient fill
- Smooth animations and transitions

### 💬 **Chat Commands**
- `!todo add <task>` - Add a new task to the list
- `!todo complete <number>` - Mark task as completed by number  
- `!todo remove <number>` - Remove task by number
- `!todo clear` - Clear all tasks

### 🎨 **Customizable Elements**
- **Card Title** - Change "MY TASKS" to any text
- **Page Title** - Change "Tasklist" to any text  
- **Progress Label** - Change "Progress Bar" to any text
- **Card Background** - Customize the main card background color
- **Card Border** - Customize the border color
- **Title Color** - Customize the header text color
- **Task Text** - Customize task text color
- **Checkbox Color** - Customize the checkmark color
- **Button Color** - Customize the "5+" button color

## Default Tasks

The widget shows all 10 tasks by default:
- **Completed (3 tasks)**: Hydrate, Clean desk, Organize notes  
- **Pending (7 tasks)**: Reply emails, Finish homework, Call mom, Buy groceries, Schedule dentist appointment, Update resume, Plan weekend trip
- **Scrollable**: When needed, a scrollbar appears to navigate through all tasks

## Installation

1. Upload all 4 files to StreamElements:
   - `widget.html`
   - `widget.css`
   - `widget.js`
   - `widget.json`

2. Configure colors and text in StreamElements dashboard
3. Set up chat commands in StreamElements chat commands section
4. Position widget in your overlay

## Usage

### **Viewer Interaction**
- Viewers can add tasks via `!todo add <task>` command
- Tasks appear in the list with smooth animations
- Progress bar updates automatically as tasks are completed/added

### **Interactive Features**
- Click checkboxes to mark tasks complete/incomplete
- Automatic scrollbar when task list exceeds container height
- Real-time progress tracking (shows X/Y tasks and percentage)
- Smooth hover effects and transitions

### **Streamer Customization**
- Change all text labels through StreamElements dashboard
- Customize all colors to match your brand/overlay
- Maintains original beautiful design aesthetic

## Technical Features

- StreamElements API integration for chat commands
- Preserves original smooth animations and interactions
- Transparent background for stream overlays
- Responsive design
- Development mode with command reference overlay
- Cross-browser compatibility

## Development Mode

When testing locally, the widget shows additional development commands overlay with all available chat commands for easy testing.

---

This widget gives you the exact beautiful design you created, now with the power of StreamElements chat integration and customization!
