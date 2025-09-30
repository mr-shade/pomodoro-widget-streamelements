# StreamElements TODO Widget

A comprehensive StreamElements widget for managing TODO lists with advanced chat integration, user permissions, animations, and extensive customization options.

## 🎉 NEW FEATURES & IMPROVEMENTS

### ✨ Enhanced User Experience
- **Empty State**: Widget now starts with a clean, empty todo list for a minimal interface
- **Right-to-Left Animations**: New todos slide in smoothly from right to left when added
- **Confetti Celebration**: Beautiful customizable confetti animation triggers when all tasks are completed (8 custom colors, particle count, and duration)
- **Dynamic Height**: Todo list container adjusts its height based on content
- **Fixed Progress Bar**: No more "NaN%" - progress calculation now handles empty lists properly
- **Customizable Border Width**: Adjust card border thickness (1-10px)
- **Custom Scrollbar Colors**: Match scrollbar to your StreamElements dashboard theme
- **NEW: Title Font Size Customization**: Adjust the task list title font size from 16px to 64px
- **NEW: Custom Command Names**: Customize all command names (!add, !complete, !remove, !clear, !reset, !lock, !unlock, !highlight)

### 🎯 Smart UI Updates  
- **Dynamic Task Counter**: The "More Tasks" button shows the actual number of additional tasks (e.g., "3+" instead of hardcoded "5+")
- **Accurate Progress Tracking**: Progress bar and percentage now work correctly from 0/0 state
- **Smooth Transitions**: Added animations and transitions throughout the interface
- **Highlight Random Task**: `!highlight` command adds golden glow effect to random incomplete task
- **Auto-scroll Feature**: Automatically removes completed tasks when threshold is reached

### 🔒 Advanced Permission System
- **Granular Permissions**: Set different permission levels for each command type
- **Blacklist System**: Block specific users with comma-separated list
- **Lock/Unlock System**: Moderators can lock widget to prevent interactions
- **Custom Commands**: Customize lock, unlock, and highlight command names
- **Enable/Disable Commands**: Turn individual command types on/off

### 🎮 Command System
#### New Commands
- `!addtask <text>` - Add a new task (animated slide-in)
- `!complete <number>` - Complete task by number
- `!remove <number>` - Remove task by number  
- `!clear` - Clear all tasks
- `!lock` - Lock widget (moderators only)
- `!unlock` - Unlock widget (moderators only)
- `!highlight` - Highlight random incomplete task

#### Legacy Commands (still supported)
- `!todo add <text>` - Add a new task
- `!todo complete <number>` - Complete task by number
- `!todo remove <number>` - Remove task by number
- `!todo clear` - Clear all tasks

## Features

### Core Functionality
- ✅ **Dynamic Task Management**: Add, complete, remove, and clear tasks
- ✅ **Smart Task Counter**: Automatically shows correct count when >5 tasks (e.g., "7+" instead of "5+")
- ✅ **Progress Tracking**: Visual progress bar with percentage and task count (fixed NaN issue)
- ✅ **Sound Effects**: Customizable audio feedback for task completion and list completion
- ✅ **Responsive Design**: Optimized for all screen sizes
- 🎨 **NEW: Slide-in Animation**: Tasks animate from right to left when added
- 🎊 **NEW: Confetti Celebration**: Fully customizable confetti animation with 8 color options, particle count (50-300), and duration (1-10s)
- 📏 **NEW: Minimal Height**: Empty todo list takes minimal space
- ⚡ **NEW: Auto-scroll**: Removes completed tasks automatically
- 🌈 **NEW: Highlight Effect**: Golden glow animation for random task selection

### Chat Commands & Permissions
- 🔐 **Granular Permission System**: Set different permissions for add, complete, remove, and clear commands
- 🚫 **Blacklist Support**: Block specific users from interacting with the widget
- 🔒 **Lock/Unlock Commands**: Moderators can lock widget to prevent task additions
- 💬 **Chat Integration**: Full StreamElements chat command support
- ⚙️ **Command Toggle**: Enable/disable individual command types
- 🎯 **Highlight System**: Random task highlighting with visual effects

#### Permission Levels
- **Broadcaster Only**: Only the channel owner
- **Moderators+**: Broadcaster and moderators
- **VIP+**: Broadcaster, moderators, and VIPs  
- **Subscribers+**: Broadcaster, moderators, VIPs, and subscribers
- **Everyone**: All viewers (default for most commands)

#### Available Commands
- `!addtask <text>` - Add a new task to the list (with slide-in animation)
- `!complete <number>` - Complete task by number (1, 2, 3, etc.)
- `!remove <number>` - Remove task by number
- `!clear` - Clear all tasks (if permitted)
- `!highlight` - Highlight a random incomplete task with golden glow
- `!lock` - Lock the widget (moderators only, customizable command)
- `!unlock` - Unlock the widget (moderators only, customizable command)

### Auto-scroll Feature
When a configured number of tasks are completed (default: 5), the widget automatically removes completed tasks from the top of the list with a smooth animation. This keeps the list clean and focused on remaining tasks.

**Configuration Options:**
- **Auto-scroll Threshold**: Number of completed tasks before auto-scroll triggers (1-20)
- **Scroll Amount**: Number of completed tasks to remove per auto-scroll (1-10)

### Highlight Random Task
The `!highlight` command selects a random incomplete task and applies a golden glow animation for 2 seconds, helping streamers and viewers focus on a specific task.

### Confetti Customization
The celebration confetti system is fully customizable with:
- **8 Custom Colors**: Set individual colors for each confetti particle type
- **Particle Count**: Adjust from 50-300 particles for performance vs. visual impact
- **Duration Control**: Set confetti duration from 1-10 seconds
- **Auto-cleanup**: Particles automatically clear after duration expires
- **Performance Optimized**: Uses requestAnimationFrame for smooth 60fps animation

## 🎨 NEW CUSTOMIZATION FEATURES

### Title Font Size Customization
Configure the task list title font size to match your overlay design:
- **Range**: 16px to 64px
- **Step**: 2px increments
- **Default**: 32px
- **Location**: StreamElements Dashboard → Widget Settings → "Card Title Font Size"

### Custom Command Names
Personalize all chat commands to match your community's preferences:

| Default Command | Customizable Field | Purpose |
|----------------|-------------------|---------|
| `!addtask` | Add Task Command | Add new tasks to the list |
| `!complete` | Complete Task Command | Mark tasks as completed |
| `!remove` | Remove Task Command | Remove tasks from the list |
| `!clear` | Clear All Tasks Command | Clear all tasks at once |
| `!reset` | Reset Tasks Command | Alternative clear command |
| `!lock` | Lock Command | Lock widget (mods only) |
| `!unlock` | Unlock Command | Unlock widget (mods only) |
| `!highlight` | Highlight Command | Highlight random task |

**Examples of Custom Commands:**
- Change `!addtask` to `!newtodo` or `!task`
- Change `!complete` to `!done` or `!finish`
- Change `!remove` to `!delete` or `!del`
- Change `!clear` to `!reset` or `!clean`

**Note**: Custom commands must include the `!` prefix and should be unique to avoid conflicts.

**Color Options:**
- Confetti Color 1-8: Individual color pickers for complete customization
- Default colors: Red, Teal, Blue, Green, Yellow, Purple, Mint, Gold

**Performance Settings:**
- Lower particle counts (50-100) for better performance
- Higher particle counts (200-300) for more spectacular celebrations
- Duration affects both visual impact and performance

## 🛠️ Technical Implementation Details

### New Animation Systems
- **CSS Keyframes**: `@keyframes slideInFromRight` for smooth right-to-left task entry
- **Highlight Animation**: `@keyframes highlightPulse` with golden glow effect
- **Auto-scroll Animation**: Smooth translateX and opacity transitions
- **Class Management**: Temporary animation classes applied and removed automatically

### Enhanced Permission System
```javascript
// Permission hierarchy: broadcaster > moderator > vip > subscriber > everyone
hasPermission(data, permissionType) {
  const permissionLevel = this.fieldData[permissionType] || 'everyone';
  // Checks user badges and returns boolean based on permission level
}
```

### Auto-scroll Implementation
- Tracks completed task count with `this.completedTasksCount`
- Triggers removal animation when threshold reached
- Smoothly removes tasks with CSS transitions
- Automatically updates task counts and progress

### Blacklist System
- Comma-separated usernames in configuration
- Case-insensitive matching
- Checked before any command processing

### Custom Command Names
- Configurable lock, unlock, and highlight commands
- Supports custom prefixes and naming schemes
- Backward compatible with legacy `!todo` commands

### Progress Calculation Fix
```javascript
// Before: caused NaN when totalTasks = 0
const percentage = Math.round((this.completedTasks / this.totalTasks) * 100);

// After: handles empty state gracefully  
const percentage = this.totalTasks === 0 ? 0 : Math.round((this.completedTasks / this.totalTasks) * 100);
```

### Dynamic Task Counter
- Calculates actual task count beyond 5 instead of showing hardcoded "5+"
- Updates automatically when tasks are added/removed
- Shows/hides based on actual task count

### Empty State Initialization
- Starts with `completedTasks: 0` and `totalTasks: 0`
- HTML contains no hardcoded tasks
- Minimal height CSS for clean initial appearance

### Testing
- **Development Mode**: Built-in test buttons for easy development
- **Mock API**: Simulated StreamElements environment for local testing
- **Progressive Enhancement**: Works with or without StreamElements API

## 📁 File Structure

```
todo-widget/
├── widget.html     # Main widget HTML (empty state)
├── widget.css      # Styles with animations and responsive design
├── widget.js       # Core logic with confetti and animations
├── widget.json     # StreamElements field configuration
├── test.html       # Development testing interface
└── README.md       # This documentation
```

## 🚀 Quick Setup Guide

### StreamElements Integration
1. **Upload Files**: Upload `widget.html`, `widget.css`, `widget.js`, and `widget.json` to StreamElements
2. **Configure Settings**: Adjust colors, permissions, and commands in the widget settings
3. **Test Commands**: Use the development test buttons or chat commands to verify functionality
4. **Go Live**: Add the widget to your overlay and start using chat commands!

### Recommended Settings
- **Add Task**: Everyone (default)
- **Complete Task**: Everyone (default)  
- **Remove Task**: Moderators+ (recommended)
- **Clear Tasks**: Moderators+ (recommended)
- **Lock/Unlock**: Always moderators only
- **Auto-scroll**: 5 tasks completed, remove 3 tasks (default)

### Chat Command Examples
```
!addtask Review latest pull request
!complete 1
!highlight
!lock (moderator only)
```

## 🎮 Development & Testing

The `test.html` file includes comprehensive testing tools:
- **Add Tasks**: Individual and batch task addition
- **Complete Tasks**: Test completion and auto-scroll
- **Highlight**: Test random task highlighting
- **Lock Toggle**: Test lock/unlock functionality
- **Confetti**: Trigger celebration animation

## Extensive Customization (45+ Options)

### 🎨 Visual Customization
- **Widget Title**: Custom title text and color
- **Card Title**: Custom card header text and color  
- **Card Background**: Background color with transparency support
- **Card Borders**: Border color and width (1-10px)
- **Task Text Color**: Customize text color for all tasks
- **Checkbox Colors**: Border and checkmark colors
- **Progress Bar**: Gradient start/end colors and background
- **Scrollbar Colors**: Custom scrollbar to match dashboard theme
- **Font Family**: Choose from system fonts (Arial, Helvetica, Roboto, etc.)

### 🔧 Functional Settings
- **Command Toggles**: Enable/disable individual command types
- **Permission Levels**: Set who can use each command type
- **Blacklist**: Comma-separated list of blocked usernames
- **Custom Commands**: Customize lock, unlock, and highlight command names
- **Auto-scroll Settings**: Threshold and amount for automatic task removal
- **Confetti Customization**: 8 custom colors, particle count (50-300), duration (1-10s), and enable/disable toggle

### 🔊 Audio Settings  
- **Sound Toggle**: Master sound on/off
- **Volume Controls**: Separate volumes for task complete and all-tasks complete
- **Custom Sounds**: Upload or select from preset sound effects

### ⚙️ Advanced Options
- **Lock/Unlock System**: Moderator-controlled widget locking
- **Highlight Duration**: Control how long random task highlight lasts
- **Animation Speed**: Customize slide-in and scroll-out timings
- **Progress Label**: Custom text for progress section

#### Text Content
- **Widget Title**: Custom title text and color
- **Progress Label**: Custom progress text and color
- **Sound Effects**: Volume control and custom sound selections

#### Colors & Styling
- **Card Background**: Custom background color with transparency
- **Card Borders**: Customizable border colors
- **Task Text**: Color customization for task text
- **Checkbox**: Border and fill color customization
- **Progress Bar**: Gradient customization with multiple color stops
- **Scrollbar**: Custom scrollbar colors
- **"5+" Button**: Background gradient and text color

#### Permission Settings
- **Add Task Permission**: Who can add tasks (everyone/subscriber/VIP/moderator/broadcaster)
- **Complete Task Permission**: Who can complete tasks
- **Remove Task Permission**: Who can remove tasks
- **Clear Tasks Permission**: Who can clear all tasks
- **Blacklist**: Comma-separated list of blocked usernames

#### Typography
- **Font Selection**: Choose from popular web fonts including:
  - Arial, Helvetica, Georgia, Times New Roman
  - Roboto, Open Sans, Lato, Montserrat
  - Poppins, Inter, Source Sans Pro, Nunito
  - System fonts and more

#### Sound Options
- **Task Complete Sound**: Choose from multiple completion sounds
- **All Tasks Complete Sound**: Special sound when all tasks are finished
- **Volume Control**: Adjust sound effect volume (0-100%)

## Installation

1. Copy the widget files to your StreamElements custom widget
2. Upload `widget.html`, `widget.css`, `widget.js`, and `widget.json`
3. Configure your desired settings in the widget fields
4. Set up chat commands in StreamElements

## Customization Guide

### Basic Setup
1. **Widget Title**: Set your desired title (default: "TODO")
2. **Colors**: Choose colors that match your stream theme
3. **Permissions**: Set who can interact with different functions
4. **Sounds**: Enable audio feedback and set volume

### Advanced Configuration
1. **Blacklist Users**: Add usernames separated by commas to block them
2. **Lock Widget**: Use moderator commands to control access
3. **Custom Fonts**: Select fonts that match your brand
4. **Progress Bar**: Customize the gradient colors for visual appeal

### Permission Levels
- **everyone**: All viewers can use the command
- **subscriber**: Subscribers and higher can use the command
- **vip**: VIPs and higher can use the command
- **moderator**: Moderators and broadcaster only
- **broadcaster**: Broadcaster only

## Technical Details

### StreamElements Integration
- Uses `SE_API.onMessage` for chat command handling
- Implements `onWidgetLoad` for initialization
- Supports all StreamElements field data types
- Badge-based permission checking

### Sound System
- Web Audio API implementation
- Support for multiple audio formats
- Volume control and sound selection
- Non-blocking audio playback

### Dynamic UI Features
- Real-time task counting
- Automatic "5+" button visibility
- Smooth animations and transitions
- Responsive hover effects
- Custom scrollbar styling

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Support

This widget is designed for StreamElements and requires:
- StreamElements overlay system
- Chat integration enabled
- Modern web browser
- Audio support for sound effects

For issues or feature requests, refer to the StreamElements documentation or community forums.
