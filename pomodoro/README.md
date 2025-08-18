# Pomodoro Timer Widget for StreamElements

A customizable Pomodoro timer widget with chat command integration for StreamElements overlays.

## Features

- **25-minute Pomodoro Timer**: Classic productivity timer with visual countdown
- **Interactive Controls**: Click to start/pause timer, visual play/pause button states
- **Chat Commands**: Control timer via Twitch chat commands
- **Fully Customizable**: Colors and timer duration customizable through StreamElements dashboard
- **Audio Notification**: Sound alert when timer completes
- **Responsive Design**: Clean, modern interface that works on different screen sizes
- **Transparent Background**: Designed for overlay use

## Chat Commands

- `!start` - Start the Pomodoro timer
- `!pause` - Pause the running timer
- `!reset` - Reset timer to initial duration

## Customization Options

The widget provides these customization options through the StreamElements dashboard:

### Timer Settings
- **Pomodoro Duration**: Set timer length from 1-120 minutes (default: 25 minutes)

### Color Settings
- **Timer Widget Background**: Background color of the main timer card (default: #010161 - dark blue)
- **Timer Widget Border**: Border color of the main timer card (default: #fcfabc - light yellow)
- **Timer Card Gradient Start**: Starting color for time display cards (default: #6caaff - light blue)
- **Timer Card Gradient End**: Ending color for time display cards (default: #4299E1 - blue)
- **Play Button Color**: Color of the play/pause button (default: #63B3ED - blue)
- **Play Button Icon Color**: Color of the play/pause icon (default: #FFFFFF - white)
- **Timer Number Color**: Color of the countdown numbers (default: #FFFFFF - white)

## How It Works

1. **Timer Display**: Shows minutes and seconds in separate gradient cards
2. **Visual Feedback**: Time cards have subtle animations and the play button changes to pause when active
3. **Chat Integration**: Viewers can control the timer using chat commands
4. **Completion Alert**: Plays audio notification and shows completion message
5. **Auto Reset**: Timer automatically resets after completion

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
