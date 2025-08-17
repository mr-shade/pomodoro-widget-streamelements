# StreamElements Pomodoro Widget

A customizable Pomodoro timer widget for StreamElements with chat command support and configurable duration.

## Features

### Customizable Settings
- **Pomodoro Duration**: Set timer duration from 1-120 minutes (default: 25 minutes)
- **Background Colors**: Background gradient (start and end colors) - only applies in development mode
- **Card Colors**: Card background and border colors
- **Timer Card Colors**: Timer card gradient colors
- **Button Colors**: Play button and icon colors
- **Text Colors**: Timer number colors

### Chat Commands
- `!start` - Start the Pomodoro timer
- `!pause` - Pause the current timer
- `!reset` - Reset the timer to configured duration

### StreamElements Integration
The widget uses `obj.detail.fieldData` to get customization values from the StreamElements dashboard. If no field data is available (development mode), it falls back to default values.

## Files Structure
- `index.html` - Clean HTML for SE dashboard (transparent background)
- `pomodoro.css` - Styling with customizable colors
- `pomodoro.js` - Timer logic with SE API integration
- `fields.json` - StreamElements field definitions
- `test.html` - Development testing environment

## StreamElements Deployment
The `index.html` is optimized for StreamElements:
- **Transparent background** - works with any stream overlay
- **No title/extra elements** - just the timer widget
- **Compact design** - fits well in overlays
- **Fully customizable** through SE dashboard

## Development Mode
In development mode, the widget will:
1. Use default values including 25-minute duration
2. Show dev command buttons in the top-right corner
3. Display notifications for command actions
4. Mock the StreamElements API
5. Apply background gradient (removed in SE mode for transparency)

## Color Customization
All colors can be changed through the StreamElements dashboard:
- Pomodoro Duration (1-120 minutes)
- Card Color & Border Color  
- Timer Card Gradient Colors
- Play Button Color & Icon Color
- Timer Text Color

**Note**: Background colors are only applied in development mode. In StreamElements, the widget has a transparent background to work with any stream overlay.
