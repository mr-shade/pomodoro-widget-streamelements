# Pomodoro Timer Widget for StreamElements

A customizable Pomodoro timer widget with chat command integration and tick sound effects for StreamElements overlays.

## Features

- **25-minute Pomodoro Timer**: Classic productivity timer with visual countdown
- **Interactive Controls**: Click to start/pause timer, visual play/pause button states
- **Chat Commands**: Control timer via Twitch chat commands
- **Tick Sound Effects**: Optional sound every second when timer is running
- **Custom Audio Upload**: Upload your own MP3 tick sound or use built-in fallback
- **Volume Control**: Adjustable tick sound volume (0-100%)
- **Fully Customizable**: Colors and timer duration customizable through StreamElements dashboard
- **Audio Notification**: Sound alert when timer completes
- **Responsive Design**: Clean, modern interface that works on different screen sizes
- **Transparent Background**: Designed for overlay use

## Chat Commands

The timer supports chat commands with customizable role permissions:

- `!start` - Start the Pomodoro timer
- `!pause` - Pause the running timer  
- `!reset` - Reset timer to initial duration

### 🔒 **NEW: Role Permission System**

Configure who can use each timer command:

#### Permission Levels
- **Everyone**: All viewers can use the command
- **Subscribers+**: Subscribers, VIPs, Moderators, and Broadcaster
- **VIP+**: VIPs, Moderators, and Broadcaster
- **Moderators+**: Moderators and Broadcaster only
- **Broadcaster Only**: Only the channel owner

#### Default Permissions
- **Start Timer**: Everyone (viewers can start focus sessions)
- **Pause Timer**: Moderators+ (prevent spam pausing)
- **Reset Timer**: Moderators+ (prevent spam resetting)

#### Additional Security Features
- **Enable/Disable Commands**: Toggle chat commands on/off
- **Blacklist System**: Block specific users from using any commands
- **Custom Command Names**: Customize the command names (!start, !pause, !reset)

## Customization Options

The widget provides these customization options through the StreamElements dashboard:

### Timer Settings
- **Pomodoro Duration**: Set timer length from 1-120 minutes (default: 25 minutes)

### 🔒 **NEW: Role Permission Settings**
- **Enable Chat Commands**: Toggle chat command functionality on/off
- **Who Can Start Timer**: Set permission level for !start command
- **Who Can Pause Timer**: Set permission level for !pause command  
- **Who Can Reset Timer**: Set permission level for !reset command
- **Blacklisted Users**: Comma-separated list of users blocked from all commands
- **Custom Start Command**: Customize the start command (default: !start)
- **Custom Pause Command**: Customize the pause command (default: !pause)
- **Custom Reset Command**: Customize the reset command (default: !reset)

### Sound Settings
- **Enable Tick Sound Every Second**: Enable/disable tick sound when timer is running
- **Tick Sound File (MP3)**: Upload your custom MP3 file for tick sound
- **Tick Sound Volume**: Adjust tick sound volume from 0-100% (default: 50%)

### Color Settings
- **Timer Widget Background**: Background color of the main timer card (default: #010161 - dark blue)
- **Timer Widget Border**: Border color of the main timer card (default: #fcfabc - light yellow)
- **Timer Card Gradient Start**: Starting color for time display cards (default: #6caaff - light blue)
- **Timer Card Gradient End**: Ending color for time display cards (default: #4299E1 - blue)
- **Play Button Color**: Color of the play/pause button (default: #63B3ED - blue)
- **Play Button Icon Color**: Color of the play/pause icon (default: #FFFFFF - white)
- **Timer Number Color**: Color of the countdown numbers (default: #FFFFFF - white)

## Sound Features

### Tick Sound Every Second
- **Custom Audio**: Upload your own MP3 file for the perfect tick sound
- **Fallback Sound**: If no file is uploaded, uses a generated tick sound
- **Volume Control**: Adjust volume independently from other sounds
- **Performance Optimized**: Efficient audio handling that won't impact stream performance

### Audio Requirements
- **Supported Formats**: MP3, WAV, OGG
- **Recommended**: Short tick sounds (under 1 second) work best
- **File Size**: Smaller files recommended for better performance

## How It Works

1. **Timer Display**: Shows minutes and seconds in separate gradient cards
2. **Visual Feedback**: Time cards have subtle animations and the play button changes to pause when active
3. **Chat Integration**: Viewers can control the timer using chat commands
4. **Tick Sound**: Plays every second when timer is running (if enabled)
5. **Completion Alert**: Plays audio notification and shows completion message
6. **Auto Reset**: Timer automatically resets after completion

## StreamElements Integration

The widget follows StreamElements best practices:
- Uses `onWidgetLoad` event for proper initialization
- Gets customization values from `obj.detail.fieldData`
- Applies styling dynamically based on dashboard settings
- Integrates with SE_API for chat command handling
- Includes proper error handling and console logging

## Files

- `widget.html` - Timer structure and layout
- `widget.css` - Styling with transparent background for overlays
- `widget.js` - Timer logic, controls, and StreamElements integration
- `widget.json` - Field definitions for StreamElements dashboard
- `fields.json` - Alternative field definitions format

## Installation

1. Upload `widget.html`, `widget.css`, `widget.js`, and `widget.json` to StreamElements
2. Customize colors and timer duration through the StreamElements dashboard
3. Add to your overlay
4. Test chat commands to ensure integration is working

Perfect for streamers who want to use the Pomodoro Technique while streaming, with full viewer interaction through chat commands!
