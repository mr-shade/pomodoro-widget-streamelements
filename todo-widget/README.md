# StreamElements TODO Widget

A comprehensive StreamElements widget for managing TODO lists with advanced chat integration, user permissions, and extensive customization options.

## Features

### Core Functionality
- ✅ **Dynamic Task Management**: Add, complete, remove, and clear tasks
- ✅ **Smart "5+" Button**: Automatically shows/hides based on actual task count (appears when >5 tasks)
- ✅ **Progress Tracking**: Visual progress bar with percentage and task count
- ✅ **Sound Effects**: Customizable audio feedback for task completion and list completion
- ✅ **Responsive Design**: Optimized for all screen sizes

### Chat Commands & Permissions
- 🔐 **User Permission System**: Support for viewers, subscribers, VIPs, moderators, and broadcasters
- 🚫 **Blacklist Support**: Block specific users from interacting with the widget
- 🔒 **Lock/Unlock Commands**: Moderators can lock widget to prevent task additions
- 💬 **Chat Integration**: Full StreamElements chat command support

#### Available Commands
- `!addtask <text>` - Add a new task to the list
- `!complete <number>` - Complete task by number (1, 2, 3, etc.)
- `!remove <number>` - Remove task by number
- `!clear` - Clear all tasks (if permitted)
- `!lock` - Lock the widget (moderators only)
- `!unlock` - Unlock the widget (moderators only)

### Extensive Customization (25+ Options)

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
