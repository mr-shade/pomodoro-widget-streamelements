# StreamElements Chat Display Widget

A simple StreamElements widget that displays live chat messages in real-time.

## Features

- **Real-time chat display**: Shows messages as they appear in chat
- **User role highlighting**: Different colors for broadcasters, moderators, VIPs, and subscribers
- **Auto-scroll**: Automatically scrolls to show newest messages
- **Message limit**: Configurable maximum number of messages (prevents memory issues)
- **Smooth animations**: Messages slide in and fade out smoothly
- **Responsive design**: Works on different screen sizes

## Files

- `widget.html` - Main widget HTML structure
- `widget.css` - Styling and animations
- `widget.js` - StreamElements event handling and chat logic
- `widget.json` - StreamElements configuration fields
- `test.html` - Development testing page
- `README.md` - This file

## Configuration Options

### Maximum Messages
- **Type**: Number (5-50)
- **Default**: 10
- **Description**: Maximum number of messages to display before old ones are removed

### Show Timestamps
- **Type**: Dropdown (Yes/No)
- **Default**: No
- **Description**: Show timestamp for each message (feature ready for implementation)

### Fade Old Messages
- **Type**: Dropdown (Yes/No)
- **Default**: Yes
- **Description**: Whether to fade out old messages when removing them

## User Role Colors

- **Broadcaster**: Gold/Orange (#f59e0b)
- **Moderator**: Green (#10b981)
- **VIP**: Purple (#8b5cf6)
- **Subscriber**: Pink (#ec4899)
- **Viewer**: Blue (#6366f1)
- **System**: Green (#10b981)

## Setup Instructions

1. Upload all files to your StreamElements widget
2. Configure the widget settings as desired
3. Add the widget to your streaming software (OBS, etc.)
4. Chat messages will automatically appear in the widget

## Testing

Open `test.html` in your browser to test the widget functionality:
- Use the test buttons to simulate different user types
- Test message overflow and cleanup
- Verify animations and styling

## StreamElements Integration

The widget listens for the `onEventReceived` event and filters for chat messages:

```javascript
window.addEventListener('onEventReceived', (obj) => {
    // Filters for chat messages only
    if (data.listener !== "message" && data.listener !== "onMessage") return;
    // Processes username, message, and user role
    // Adds message to display with proper styling
});
```

## Customization

### Colors
Modify the CSS variables in `widget.css` to change the color scheme:

```css
.chat-message.broadcaster { border-left-color: #your-color; }
.username { color: #your-color; }
```

### Size
Adjust the widget dimensions in `widget.css`:

```css
.chat-widget {
    width: 400px;  /* Change width */
    height: 300px; /* Change height */
}
```

### Message Limit
Change the default message limit in `widget.js` or use the configuration field.

## Browser Compatibility

- Chrome/Chromium (recommended for OBS)
- Firefox
- Safari
- Edge

## Known Issues

- None currently reported

## Future Enhancements

- [ ] Timestamp display implementation
- [ ] Custom emote support
- [ ] Sound notifications for new messages
- [ ] Message filtering/moderation
- [ ] Dark/light theme toggle