# StreamElements Pomodoro Widget

A customizable Pomodoro timer widget for StreamElements with chat command support.

## Features

### Customizable Colors
- Background gradient (start and end colors)
- Card background and border colors
- Timer card gradient colors
- Play button colors
- Text colors for timer and title

### Chat Commands
- `!start` - Start the Pomodoro timer
- `!pause` - Pause the current timer
- `!reset` - Reset the timer to 25:00

### StreamElements Integration
The widget uses `obj.detail.fieldData` to get customization values from the StreamElements dashboard. If no field data is available (development mode), it falls back to default values.

## Files Structure
- `index.html` - Main widget HTML
- `pomodoro.css` - Styling with customizable colors
- `pomodoro.js` - Timer logic with SE API integration
- `fields.json` - StreamElements field definitions

## Development Mode
In development mode, the widget will:
1. Use default color values
2. Show dev command buttons in the top-right corner
3. Display notifications for command actions
4. Mock the StreamElements API

## StreamElements Setup
1. Upload all files to your StreamElements custom widget
2. The `fields.json` will automatically populate the customization options
3. Commands will work with chat integration
4. Colors can be customized through the SE dashboard

## Color Customization
All colors can be changed through the StreamElements dashboard:
- Background Color & Gradient End
- Card Color & Border Color  
- Timer Card Gradient Colors
- Play Button Color & Icon Color
- Timer Text Color & Title Color
