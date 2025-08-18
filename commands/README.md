# Commands Widget for StreamElements

A customizable commands display widget that shows chat commands in an elegant interface.

## Features

- **Interactive Commands Display**: Shows available chat commands with clean styling
- **Fully Customizable**: Colors, text, and fonts can be customized through StreamElements dashboard
- **Hover Effects**: Commands highlight when hovered over
- **Keyboard Navigation**: Navigate commands with arrow keys
- **Responsive Design**: Works on different screen sizes
- **Click Feedback**: Visual feedback when commands are clicked

## Commands Displayed

- `!new task` - Create a new task
- `!done task` - Mark a task as completed  
- `!delete task` - Remove a task

## Customization Options

The widget provides these customization options through the StreamElements dashboard:

### Text Settings
- **Main Title**: The large title at the top (default: "Commands")
- **Commands Section Title**: The widget header title (default: "!Commands")

### Color Settings
- **Background Gradient Start**: Starting color for the page gradient (default: #b3abfb)
- **Widget Background Color**: Background color of the commands card (default: #000160 - dark blue)
- **Widget Border Color**: Border color of the commands card (default: #bee7ff - light blue)
- **Commands Title Color**: Color of the section title (default: #ffb7e3 - pink)
- **Command Text Color**: Color of the command text (default: #63B3ED - blue)
- **Separator Color**: Color of the bullet separators (default: #ffffff - white)
- **Underline Color**: Color of the title underline (default: #ffffff - white)

### Typography Settings
- **Font Family**: Choose from System, Arial, Helvetica, Roboto, Georgia, or Times

## StreamElements Integration

The widget follows StreamElements best practices:
- Uses `onWidgetLoad` event for proper initialization
- Gets customization values from `obj.detail.fieldData`
- Applies styling dynamically based on dashboard settings
- Includes proper error handling and console logging

## Installation

1. Upload `widget.html`, `widget.css`, `widget.js`, and `widget.json` to StreamElements
2. Customize colors and text through the StreamElements dashboard
3. Add to your overlay

## Files

- `widget.html` - Main widget structure
- `widget.css` - Styling and layout
- `widget.js` - Interactive functionality and StreamElements integration
- `widget.json` - Field definitions for StreamElements dashboard
- `fields.json` - Alternative field definitions format

The widget maintains a beautiful blue gradient theme with customizable accents while providing an intuitive interface for displaying chat commands.
