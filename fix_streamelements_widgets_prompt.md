# AI Prompt for Fixing StreamElements Widget Issues

## Context
You are working with StreamElements custom widgets for a todo-list and pomodoro timer. These widgets have several bugs and missing features that need to be addressed.

## Project Structure
```
workspace/
├── todo-widget/
│   ├── widget.html
│   ├── widget.js
│   ├── widget.css
│   └── widget.json
└── pomodoro/
    ├── widget.html
    ├── widget.js
    ├── widget.css
    └── widget.json
```

## Issues to Fix

### Todo Widget Issues:
1. **Missing Progress Bar Border Color**: Add configuration option for progress bar border color
2. **Non-functional Scrollbar Colors**: Fix scrollbar color styling that isn't applying
3. **Custom MP3 Upload**: Add ability to upload custom MP3 sounds for task completion with volume control
4. **Remove Font Size**: Completely remove font size configuration option

### Pomodoro Widget Issues:
1. **Timer/Stopwatch Mode**: Add toggle between countdown timer and count-up stopwatch
2. **Custom Sound Upload**: Add custom MP3 upload for start, end, and tick sounds with volume controls
3. **Real-time Updates**: Ensure widget responds to setting changes without refresh
4. **Syntax Errors**: Fix any JavaScript syntax errors in widget.js

## Technical Requirements

### StreamElements Integration:
- Use `onWidgetLoad` for initial setup
- Use `onWidgetUpdate` for real-time configuration changes
- Implement StreamElements file upload system for MP3 files
- Use `SE_API.store.set` and `SE_API.store.get` for persistent storage

### JavaScript Structure:
- Use ES6 class-based architecture
- Implement proper event handling
- Ensure clean separation of concerns
- Fix all syntax errors (missing semicolons, braces, etc.)

### CSS Styling:
- Apply dynamic styles based on configuration
- Use `!important` flags where necessary for StreamElements compatibility
- Ensure responsive design

## Implementation Steps

### For Todo Widget:
1. Update `widget.json` to add progressBarBorderColor field and remove fontSize
2. Modify `widget.js` to handle new configuration options
3. Fix scrollbar color application in CSS/JS
4. Implement custom MP3 upload with Audio API and volume control

### For Pomodoro Widget:
1. Update `widget.json` with timer/stopwatch toggle and sound upload fields
2. Rewrite `widget.js` with proper class structure and timer logic
3. Add custom sound playback with Web Audio API
4. Ensure onWidgetUpdate properly handles configuration changes
5. Fix all syntax errors in JavaScript

## Testing Checklist
- [ ] All configuration options appear in StreamElements editor
- [ ] Custom MP3 uploads work and play correctly
- [ ] Volume controls affect sound playback
- [ ] Timer/stopwatch toggle functions properly
- [ ] Real-time updates work without page refresh
- [ ] No JavaScript errors in console
- [ ] All CSS styles apply correctly

## Common Pitfalls to Avoid
- Missing semicolons in JavaScript
- Incorrect brace placement
- Not handling async file uploads properly
- Forgetting to update onWidgetUpdate handler
- CSS specificity issues with StreamElements

## Expected Output
Fully functional todo and pomodoro widgets with all requested features working correctly in StreamElements environment.