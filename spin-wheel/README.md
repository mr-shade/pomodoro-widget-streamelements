# 🎡 Spin Wheel Widget for StreamElements

A fully customizable, interactive spinning wheel widget for StreamElements with chat integration, extensive customization options, and automatic event tracking.

## ✨ Features

### 🎮 Core Functionality
- **Chat Command Integration** - Users trigger spins with `!spin` (customizable)
- **Manual Spin Mode** - Click-to-spin option (can be disabled)
- **Advanced Permission System** - Role-based permissions (Everyone/Subscribers+/VIP+/Moderators+/Broadcaster Only)
- **User Blacklist** - Block specific users from using commands
- **Cooldown System** - Default 10s or custom cooldown
- **Winner Display** - Confetti celebration and optional popup modal

### 🔒 **NEW: Enhanced Chat Command System**

Configure who can use each command with granular permissions:

#### Permission Levels
- **Everyone**: All viewers can use the command
- **Subscribers+**: Subscribers, VIPs, Moderators, and Broadcaster
- **VIP+**: VIPs, Moderators, and Broadcaster
- **Moderators+**: Moderators and Broadcaster only
- **Broadcaster Only**: Only the channel owner

#### Security Features
- **Enable/Disable Commands**: Toggle chat command functionality on/off
- **Blacklist System**: Block specific users from using any commands
- **Custom Command Names**: Customize the spin command (!spin, !wheel, etc.)

### 🎨 Customization Options

#### **Wheel Configuration**
- Unlimited custom prizes/options (comma-separated)
- Alternating segment colors (2 colors)
- Adjustable spin speed (Slow/Normal/Fast)
- Widget size scaling (50% - 200%)

#### **Color Customization**
- Primary & Secondary wheel colors
- Border, inner ring, outer ring colors
- Confetti colors (2 customizable)
- Icon/highlighter color
- Text color
- Decorative star color

#### **Text Styling**
- 15+ font family options
- Custom Google Fonts support
- Font size adjustment (auto-scales with segment count)
- Font weight (Thin to Black)
- Font style (Normal/Italic/Oblique)
- Text transform (UPPERCASE/lowercase/Capitalize)
- Letter spacing control
- Text shadow with color/blur/offset
- Text stroke/outline with color/width

#### **Center Button**
- **Golden Star** (default)
- **Custom Image** with size control
- **Custom Text** with size and color

### 📊 Event Tracking & Points
- Track Tips/Donations
- Track Follows
- Track Subscriptions/Re-subs
- Track Gift Subs
- Track Cheers/Bits
- Configurable point values per event
- Auto-spin when point threshold reached

---

## 🚀 Installation

### StreamElements Setup

1. **Open StreamElements Dashboard**
   - Go to your StreamElements dashboard
   - Navigate to Overlays section

2. **Create New Widget**
   - Click "Add Widget" → "Custom Widget"
   - Or add to existing overlay

3. **Copy Files**
   - **HTML Tab**: Copy contents of `widget.html`
   - **CSS Tab**: Copy contents of `widget.css`
   - **JavaScript Tab**: Copy contents of `widget.js`
   - **Fields Tab**: Copy contents of `fields.json`

4. **Configure Widget**
   - Open widget settings
   - Customize colors, text, prizes, etc.
   - Set permissions and cooldown

5. **Test**
   - Click the "Test" button in StreamElements
   - Try chat command in test chat
   - Verify appearance and functionality

---

## ⚙️ Configuration Guide

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Enable Chat Commands | Allow chat commands to trigger spin | ✅ Enabled |
| Custom Spin Command | Chat command to trigger spin | `!spin` |
| Who Can Spin | Permission level required for spin command | Everyone |
| Blacklisted Users | Comma-separated list of blocked users | (empty) |
| Widget Size Scale | Scale entire widget (50-200%) | 100% |
| Cooldown Type | Cooldown duration | Default (10s) |
| Custom Cooldown | Custom seconds if not using default | 60s |

### Wheel Options

**Format:** Comma-separated list
```
Prize 1, Prize 2, Prize 3, Lucky Draw, Bonus Points, Try Again, Special Gift, Winner
```

**Tips:**
- Use clear, concise labels
- 4-12 options recommended for readability
- Text auto-scales with more options
- Avoid very long text strings

### Color Scheme

| Color | Purpose |
|-------|---------|
| Primary Color | Odd segments (#d6bcfd) |
| Secondary Color | Even segments (#a4a0ec) |
| Border Color | Wheel border (#1e14ea) |
| Inner Ring Color | Inner circle (#9476df) |
| Outer Ring Color | Outer rim (#342140) |
| Confetti Color 1 & 2 | Celebration effects |
| Text Color | Segment text (#342140) |
| Star Color | Decorative stars (#fee3aa) |

### Center Button Options

#### Option 1: Golden Star (Default)
- Classic star icon
- Customizable color
- No additional setup

#### Option 2: Custom Image
- Upload image URL
- Adjust size (% of button)
- Supports PNG, JPG, GIF

#### Option 3: Custom Text
- Any text (e.g., "SPIN", "GO", "CLICK")
- Custom font size
- Custom color

### Text Customization

```javascript
// Example configuration
{
  wheelTextFont: "Arial",          // Or custom Google Font
  wheelTextSize: 14,               // px (auto-scales)
  wheelTextWeight: "bold",         // Thin to Black
  wheelTextStyle: "normal",        // Normal/Italic
  wheelTextTransform: "uppercase", // Case transform
  wheelTextLetterSpacing: 0,       // px spacing
  enableTextShadow: true,          // Shadow on/off
  textShadowColor: "#000000",      // Shadow color
  textShadowBlur: 2,               // px blur
  enableTextStroke: false,         // Outline on/off
  textStrokeColor: "#ffffff",      // Outline color
  textStrokeWidth: 1               // px width
}
```

### Behavior Settings

| Setting | Description | Options |
|---------|-------------|---------|
| Enable Manual Spin | Allow clicking wheel | ✅/❌ |
| Spin Speed | Rotation duration | Slow (8s) / Normal (6s) / Fast (4s) |
| Enable Confetti | Show confetti on win | ✅/❌ |
| Enable Winner Popup | Show modal with result | ✅/❌ |

### Event Tracking

**Configure which events trigger spins:**

| Event | Track? | Points Per |
|-------|--------|------------|
| Tips/Donations | ✅/❌ | 1 per $1 |
| Follows | ✅/❌ | 1 |
| Subscriptions | ✅/❌ | 5 |
| Re-subscriptions | ✅/❌ | 5 |
| Gift Subs | ✅/❌ | 5 |
| Direct Gifts | ✅/❌ | 5 |
| Cheers/Bits | ✅/❌ | 1 per 100 bits |

**Point System:**
- Set `Points Threshold for Spin` (default: 50)
- Events accumulate points
- Auto-spins when threshold reached
- Customize point values per event type

---

## 🎯 Usage Examples

### Example 1: Subscriber-Only Spin
```json
{
  "commandsEnabled": true,
  "spinCommand": "!spin",
  "spinCommandPermission": "subscriber",
  "enableManualSpin": false
}
```
- Only subscribers+ can use !spin command
- Manual clicking disabled
- Perfect for subscriber-only rewards

### Example 2: Moderator-Controlled with Blacklist
```json
{
  "commandsEnabled": true,
  "spinCommand": "!wheel",
  "spinCommandPermission": "moderator",
  "blacklistedUsers": "trolluser1,spammer2,banned3"
}
```
- Only moderators+ can spin
- Custom command name
- Specific users blocked from all commands

### Example 3: Large Display Wheel
```json
{
  "widgetScale": 150,
  "wheelTextSize": 16,
  "spinSpeed": "slow"
}
```
- 50% larger than default
- Bigger text
- Dramatic slow spin

### Example 4: Compact Overlay
```json
{
  "widgetScale": 75,
  "wheelTextSize": 12,
  "spinSpeed": "fast"
}
```
- 25% smaller (less screen space)
- Smaller text
- Quick spins

### Example 5: Event-Based Auto-Spin
```json
{
  "trackSubscriptions": true,
  "pointsPerSub": 50,
  "pointsThreshold": 50,
  "commandsEnabled": false
}
```
- Disabled manual chat commands
- Every subscription triggers auto-spin
- Great for reward systems

---

## 🐛 Troubleshooting

### Widget appears transparent
**Fixed in latest version!** 
- Manual spin disable no longer affects opacity
- Widget stays fully visible in all configurations

### Chat commands not working
**Check these settings:**
1. `Enable Chat Commands` = ✅ Enabled
2. `Who Can Spin` = Appropriate permission level
3. Command matches exactly (case-insensitive)
4. User is not in blacklist
5. Cooldown hasn't been triggered recently
6. User has proper badges/roles for permission level

### Text too small/large
**Solutions:**
1. Adjust `Wheel Text Size` (default: 14px)
2. Reduce number of wheel options (text auto-scales)
3. Use `Text Stroke` for better visibility
4. Enable `Text Shadow` for contrast

### Wheel too small
**New feature:**
- Use `Widget Size Scale` field
- Range: 50% - 200%
- Scales entire widget proportionally

### Custom font not loading
**Verify:**
1. Font name is correct (case-sensitive for Google Fonts)
2. Internet connection available
3. Font supports weights you're using
4. Try fallback to standard font first

---

## 🔧 Advanced Customization

### Custom CSS Tweaks

Add to CSS tab for additional styling:

```css
/* Adjust wrapper size manually */
#wrapper {
    width: 300px !important;
}

/* Custom shadow on wheel */
#wheel {
    box-shadow: 0 0 30px rgba(142, 68, 173, 0.6) !important;
}

/* Animate decorative stars */
.star {
    animation: starTwinkle 2s ease-in-out infinite !important;
}

@keyframes starTwinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.1); }
}
```

### Custom JavaScript Extensions

```javascript
// Listen for spin results
window.addEventListener('onEventReceived', function(obj) {
    if (obj.detail.event.listener === 'widget-button') {
        console.log('Wheel spun!', widget.winnerText);
        // Add custom logic here
    }
});

// Programmatic spin
function spinWheel() {
    if (!widget.isSpinning) {
        widget.currentUser = 'Custom Trigger';
        performSpin();
    }
}

// Update center button
window.updateCenterButton('text', 'GO!', { 
    size: 20, 
    color: '#ff0000' 
});
```

---

## 📋 Best Practices

### For Readability
- ✅ Use 4-12 wheel options for optimal text size
- ✅ Enable text shadow or stroke for contrast
- ✅ Choose colors with good contrast
- ✅ Test on different backgrounds
- ❌ Avoid very long text strings
- ❌ Don't use too many segments (20+)

### For Performance
- ✅ Use compressed images for center button
- ✅ Limit confetti to important wins
- ✅ Set appropriate cooldowns
- ❌ Avoid extremely fast spin speeds
- ❌ Don't track all events unless needed

### For User Experience
- ✅ Clear wheel option labels
- ✅ Reasonable cooldowns (10-60s)
- ✅ Appropriate permission levels
- ✅ Test with actual users
- ❌ Don't make cooldowns too short (spam)
- ❌ Don't restrict too much (engagement)

---

## 📊 Technical Specifications

- **Framework**: Vanilla JavaScript + jQuery
- **StreamElements API**: v2
- **Browser Support**: Chrome, Firefox, Edge, Safari
- **Dependencies**: 
  - jQuery 2.1.3+
  - canvas-confetti 1.9.2+
- **File Size**: ~35KB (combined)
- **Performance**: 60fps animations

---

## 🆕 Changelog

### Version 2.2 (Latest)
- ✅ **MAJOR**: Completely rebuilt chat command system using pomodoro widget logic
- ✅ **NEW**: Role-based permission system (Everyone/Subscribers+/VIP+/Moderators+/Broadcaster Only)
- ✅ **NEW**: User blacklist system - block specific users from commands
- ✅ **NEW**: Custom command names - change !spin to any command
- ✅ **NEW**: Proper StreamElements API integration with SE_API.onMessage
- ✅ **NEW**: Enhanced user role detection from badges and tags
- ✅ **FIXED**: Chat commands now work reliably in all scenarios
- ✅ **IMPROVED**: Better error handling and logging for debugging

### Version 2.1
- ✅ Fixed: Widget transparency when manual spin disabled
- ✅ Added: Widget size scale feature (50-200%)
- ✅ Verified: Chat commands work independently
- ✅ Improved: Disabled button visual feedback

### Version 2.0
- Added comprehensive text customization
- Custom font family support
- Text shadow and stroke options
- Auto-scaling text algorithm

### Version 1.5
- Event tracking and point system
- Customizable confetti colors
- Center button customization

### Version 1.0
- Initial release
- Basic spin functionality
- Chat command integration

---

## 📞 Support

For issues, feature requests, or questions:
- Check `FIXES_AND_FEATURES.md` for detailed bug fix info
- Review this README for configuration help
- Test in StreamElements preview mode before going live

---

## 📜 License

This widget is provided as-is for use with StreamElements streaming overlays.

---

## 🎉 Enjoy Your Spin Wheel!

Make your streams more interactive and engaging with this fully-featured spinning wheel widget. Customize it to match your brand, reward your community, and have fun! 🎊
