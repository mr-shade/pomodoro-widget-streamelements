# StreamElements TODO List Widget

A comprehensive, customizable TODO list widget for StreamElements with chat commands, animations, and extensive styling options.

## Files

- `widget.html` - Main widget HTML structure
- `widget.css` - Comprehensive styling with multiple display modes
- `widget.js` - Interactive functionality and StreamElements integration
- `widget.json` - Field definitions for StreamElements dashboard (30+ customization options)

## Features

### ✨ **Core Functionality**
- Interactive TODO list with checkbox completion
- Progress tracking with visual progress bar
- Expandable task list (show/hide additional tasks)
- Task numbering and priority indicators
- Smooth animations and transitions

### 🎨 **Visual Customization**
- **Display Modes**: Card, Overlay (transparent), Minimal
- **Animations**: Slide, Fade, Bounce, or No animation
- **Colors**: Full color customization for all elements
  - Container background and borders
  - Text colors (normal/completed states)
  - Priority indicator colors (High/Medium/Low)
  - Progress bar gradients
  - Checkbox and button colors
- **Typography**: Font family and size selection
- **Layout**: Border radius, item spacing, opacity controls

### 💬 **Chat Commands**
- `!todo add <task>` - Add a new task to the list
- `!todo complete <number>` - Mark task as completed by number
- `!todo remove <number>` - Remove task by number
- `!todo clear` - Clear all tasks
- `!todo list` - List all current tasks

### ⚙️ **Advanced Settings**
- Maximum item limit (3-20 tasks)
- Auto-hide completed tasks (configurable delay)
- Sound effects with volume control
- Show/hide priority indicators and item numbers
- Responsive design for different screen sizes

## StreamElements Dashboard Fields

The widget includes 25+ customization fields:

### **General Settings**
- Maximum TODO Items (3-20)
- Display Mode (Card/Overlay/Minimal)
- Animation Style (None/Fade/Slide/Bounce)
- Show Completed Items
- Auto-hide Completed Items (0-30 seconds)
- Show Priority Indicators
- Show Item Numbers

### **Typography**
- Font Family (7 options)
- Font Size (12-24px)

### **Container Styling**
- Background Color
- Border Color  
- Opacity (0-100%)
- Border Radius (0-20px)
- Item Spacing (4-16px)

### **Color Scheme**
- Header Background & Text
- Item Background & Hover States
- Text Colors (Normal/Completed)
- Priority Colors (High/Medium/Low)
- Checkbox Colors (Normal/Checked)
- Scrollbar Color

### **Content**
- Header Title Text
- Empty State Message

### **Audio**
- Sound Effects Enable/Disable
- Sound Volume (0-100%)

## Installation

1. Upload all 4 files to StreamElements:
   - `widget.html`
   - `widget.css` 
   - `widget.js`
   - `widget.json`

2. Configure appearance in StreamElements dashboard
3. Set up chat commands in StreamElements chat commands section
4. Position widget in your overlay

## Usage

### **Viewer Interaction**
- Viewers can add tasks via chat commands
- Tasks appear with smooth animations
- Progress bar updates automatically
- Completed tasks can auto-hide after set time

### **Streamer Control**
- Full visual customization through SE dashboard
- Choose display mode based on overlay setup
- Configure auto-hide behavior for completed tasks
- Enable/disable sound effects and volume

### **Display Modes**
- **Card Mode**: Full container with background and borders
- **Overlay Mode**: Semi-transparent for stream overlays  
- **Minimal Mode**: Clean list without container styling

## Technical Features

- StreamElements API integration
- Local storage for task persistence
- Responsive design (mobile-friendly)
- Cross-browser compatible animations
- Efficient DOM manipulation
- Error handling for audio/visual effects

## Default Tasks

The widget comes with 10 sample tasks to demonstrate functionality:
- 3 completed tasks (Hydrate, Clean desk, Organize notes)
- 7 pending tasks (including 5 hidden tasks revealed by "5+" button)
- Mixed priority levels for demonstration

## Development Mode

When testing locally, the widget shows additional development commands and uses fallback styling values for easy testing without StreamElements environment.

---

This TODO widget provides a complete task management solution for streamers wanting to engage their audience in productivity goals or collaborative planning!
