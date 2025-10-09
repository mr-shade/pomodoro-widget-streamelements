# Megathon Quest Widget - Surprise Interactive Challenges

A StreamElements custom widget that creates surprise interactive challenges during your marathon stream. Quests appear at random intervals, challenging viewers to complete goals before time runs out!

## Features

### 🎯 Core Quest System
- **Random Quest Popup** – Quests appear at configurable intervals during your stream
- **Timed Challenges** – Each quest has a countdown timer (customizable expiration time)
- **Progress Tracking** – Visual progress bar shows real-time completion status
- **Completion & Failure Logic** – Quests succeed when goals are met or fail when time runs out
- **Multiple Quest Types** – Support for subs, tips, bits, follows, raids, hosts

### 🔄 Quest Roll System
- **Default Mode**: Completed quests re-enter the pool (never twice consecutively)
- **Deplete Mode**: Completed quests are removed until manual reset
- **Adjustable Frequency**: Set how often quests can appear (minutes)
- **Quest Chance**: Set probability % of quest appearing at each interval
- **Quest Queue**: New quests wait until previous quest finishes or expires

### 🎨 Visual Customization
- **Fully Customizable Colors**: Card background, border, text, progress bar, glow effects
- **Font Customization**: Choose Google Fonts and adjust sizes for all text elements
- **Position Control**: Move the quest popup anywhere on screen
- **Size Adjustment**: Customize card width and border styling
- **Glow Effects**: Different glows for new quests, warnings, completion, and failure
- **Popup Animations**: Smooth slide-in/out transitions with scaling

### ⏱️ Timer System
- **Warning State**: Timer turns red and blinks when approaching expiration
- **Warning Time**: Configurable warning threshold (seconds before expiration)
- **Expire Time**: Set total duration for quest completion
- **Exit Duration**: Control how long completed/failed quests remain visible

### 🎊 Effects & Feedback
- **Confetti Explosions**: Customizable confetti on completion/failure
  - Control explosion count, particle amount, and colors
  - Separate settings for complete vs. failed states
- **Sound Effects**: Custom sounds for each quest state
  - New Quest Appears
  - Quest Warning
  - Quest Completed
  - Quest Failed
  - Independent volume controls
- **Glow Animations**: Pulsing glow effects matching quest states
- **Status Indicators**: Clear visual feedback for all quest states

### 🎮 Event Integration
- **Twitch Events**: Subs (T1/T2/T3), Gift Subs, Cheers/Bits, Follows, Raids, Hosts
- **Ko-fi Integration**: Tips and donations (coming soon)
- **Customizable Point Values**: Set how many points each event type awards
- **Conversion Rates**: Configure bits-per-point and tips-per-point calculations
- **Shared Points System**: Works with Timer and Milestone widgets

### 💬 Chat Commands
- `!questpause` – Pause quest system (moderator+)
- `!questresume` – Resume quest system (moderator+)
- **Permission Control**: Set required role for commands

### 🧪 Testing Mode
- **Preview Mode**: Test quest appearance and states before going live
- **Disable Before Live**: Simple toggle to switch from testing to production

## Configuration Guide

### General Settings
| Setting | Description | Default |
|---------|-------------|---------|
| **Testing Mode** | Enable to preview quest states | Disabled |
| **Roll Style** | Default (re-enter) or Deplete (remove) | Default |
| **Quest Interval** | Minutes between quest rolls | 10 |
| **Quest Chance** | Probability % of quest appearing | 100% |
| **Points to Complete** | Default point requirement | 500 |
| **Warning Time** | Seconds before red warning | 30 |
| **Expire Time** | Total quest duration in seconds | 300 |
| **Exit Duration** | How long to show completed/failed | 5000ms |

### Quest Configuration
- **Quest Names**: Comma-separated list of quest titles
- **Quest Descriptions**: Comma-separated descriptions for each quest
- **Quest Points**: Comma-separated point requirements (optional, uses default if not specified)

**Example:**
```
Names: Sub Squad,Bit Bonanza,Donation Drive
Descriptions: Get 5 new subscribers!,Collect 1000 bits!,Receive $50 in donations!
Points: 500,1000,500
```

### Event Point Values
Configure how many points each event type awards:
- **Follow**: Default 10 points
- **Tier 1 Sub**: Default 10 points
- **Tier 2 Sub**: Default 30 points
- **Tier 3 Sub**: Default 60 points
- **Bits**: 100 bits = 10 points (adjustable)
- **Tips**: $5 = 10 points (adjustable)
- **Raid**: Default 50 points
- **Host**: Default 30 points

### Visual Customization
**Colors:**
- Card Background
- Border Color & Width
- New Quest Text
- Warning State
- Completed State
- Failed State
- Progress Bar Gradient

**Glow Effects:**
- Default Glow (new quest)
- Warning Glow (time running out)
- Complete Glow (success)
- Failed Glow (failure)

**Fonts:**
- Font Family (Google Fonts)
- Title, Description, Status, Timer sizes

**Layout:**
- Card Width
- Position (Top/Left CSS values)
- Border Radius

### Sound Effects
Upload custom sounds for:
- New Quest Appears
- Quest Warning
- Quest Completed
- Quest Failed

Each sound has independent volume control (0-100%).

### Confetti Settings
**Quest Completed:**
- Explosion Count (1-10)
- Confetti Amount (10-200 particles)
- Confetti Color

**Quest Failed:**
- Explosion Count (1-10)
- Confetti Amount (10-200 particles)
- Confetti Color

## Installation

1. **StreamElements Dashboard** → Custom Widgets → Create New Widget
2. Copy contents from each file:
   - `widget.html` → HTML tab
   - `widget.css` → CSS tab
   - `widget.js` → JS tab
   - `widget.json` → Fields tab
3. Configure your quest settings in the Settings panel
4. Enable **Testing Mode** to preview, then disable before going live
5. Add widget to your OBS overlay

## Testing Locally

Open `test.html` in your browser to test the widget with simulated events:
- Add points via different event types
- Trigger quests manually
- Test pause/resume commands
- See confetti and glow effects

## Integration with Other Widgets

The Quest widget uses a **shared points system** that works alongside:
- **Timer Widget**: Same events that add time to timer also add quest points
- **Milestone Widget**: Progress toward milestones counts toward quest completion

This creates a unified engagement system where viewer actions contribute to multiple goals simultaneously.

## Tips & Best Practices

1. **Quest Timing**: Set intervals long enough that quests don't overwhelm viewers (10-15 min recommended)
2. **Point Balance**: Match point values with your timer/milestone settings for consistency
3. **Quest Difficulty**: Mix easy (300-500 pts) and hard (1000+ pts) quests for variety
4. **Warning Time**: 30-60 seconds gives viewers urgency without panic
5. **Testing**: Always test in Testing Mode before going live to preview appearance
6. **Position**: Place away from main content (corners or top/bottom recommended)
7. **Sound Volume**: Keep around 50-70% to avoid being jarring

## Troubleshooting

**Quest not appearing?**
- Check Testing Mode is disabled
- Verify Quest Chance is set > 0%
- Ensure Quest Interval has elapsed

**Points not counting?**
- Verify event point values are configured
- Check that events are triggering (test with follows/subs)
- Ensure quest is actually active (visible on screen)

**Confetti not showing?**
- Check Confetti Amount is > 0
- Verify Explosion Count is set
- Ensure browser supports Canvas API

**Commands not working?**
- Verify command names match configuration
- Check user has required permission level
- Ensure commands are typed exactly (case-sensitive)

## Color Scheme Presets

### Golden Hour
- BG: `#1a1a2e`, Border: `#ffd700`, Complete: `#00ff7f`, Failed: `#dc143c`

### Cyberpunk
- BG: `#0a0e27`, Border: `#00ffff`, Complete: `#ff00ff`, Failed: `#ff1744`

### Forest Stream
- BG: `#1b2a1f`, Border: `#4ade80`, Complete: `#22c55e`, Failed: `#ef4444`

### Arctic Night
- BG: `#0f1729`, Border: `#60a5fa`, Complete: `#38bdf8`, Failed: `#fb7185`

---

**Made for Megathon streamers** – Engage your community with dynamic challenges during marathon streams! 🎮🏆
