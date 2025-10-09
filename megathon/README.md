# 🎮 Megathon Widget System - Complete Marathon Streaming Suite

**The Ultimate All-In-One Interactive Marathon System for Twitch Streamers**

An integrated suite of StreamElements widgets designed for marathon/megathon streams, featuring timers, milestone tracking, and interactive quests. Built for **Twitch**, **Ko-fi**, **YouTube**, and soon **Tiltify**.

---

## 📦 What's Included

### 1. **Timer Widgets** (3 Layouts)
Located in: `timer-widget/`, `timer-widget-compact/`, `timer-widget-wide/`

- ⏱️ **Fully Customizable Marathon Timer** with 3 different layouts
- 🚀 **Power-Up Mode** – Multiply time additions (2x, 3x, 5x) for limited duration
- 🌙 **Sleep Mode** – Reduce time additions during breaks
- ⚡ **Event Integration** – Auto-add time from subs, tips, bits, follows, raids, hosts
- 🔒 **Timer Controls** – Pause, resume, lock, cap, warning alerts
- 🎨 **Full Customization** – Colors, fonts, sounds, confetti
- 💬 **Chat Commands** – Moderator controls via chat

### 2. **Milestone Tracker**
Located in: `milestone-tracker/`

- 🎯 **Progress Tracking** – Visual milestone/goal system
- 📊 **Progress Bar** – Real-time progress visualization
- ✅ **Completion Checkmarks** – Green checkmarks for completed goals
- 🔄 **Sliding Window** – Shows 3 milestones at a time
- 🎨 **Navy & Yellow Theme** – Matches megathon aesthetic
- 📈 **Event-Based Progress** – Track subs, tips, cheers, raids, hosts

### 3. **Quest Widget** ⭐ NEW!
Located in: `quest-widget/`

- 🎲 **Random Quest Popups** – Surprise challenges appear during stream
- ⏰ **Timed Challenges** – Complete goals before timer expires
- 🏆 **Completion System** – Success/failure with visual feedback
- ✨ **Glow Effects** – Different glows for each quest state
- 🎊 **Confetti Animations** – Celebrate completions
- 🔊 **Sound Effects** – Custom sounds for all states
- 💯 **Shared Points** – Integrates with timer and milestones

---

## 🚀 Quick Start

### Installation (Per Widget)

1. **StreamElements Dashboard** → Custom Widgets → Create New Widget
2. Copy contents from widget folder:
   - `widget.html` → HTML tab
   - `widget.css` → CSS tab  
   - `widget.js` → JS tab
   - `widget.json` → Fields tab
3. Configure settings in the Settings panel
4. Add to your OBS overlay

### One-Click Installation (Coming Soon)
StreamElements installation links for instant setup!

---

## 📂 Widget Folders

```
megathon/
├── timer-widget/              # Main timer (enhanced effects)
├── timer-widget-compact/      # Compact layout variant
├── timer-widget-wide/         # Wide layout variant
├── milestone-tracker/         # Goals & milestones system
├── quest-widget/              # Surprise quests (NEW!)
├── SubDono Widget v2/         # Reference widget (do not use)
├── megathon-project/          # Documentation & assets
└── doc.md                     # Complete feature documentation
```

---

## 🎯 Module 1: Timer Widget

### Key Features
- ✅ 3 Different Layouts (Stacked, Wide, Compact)
- ✅ Custom Time Addition per Event (subs, follows, donations, cheers)
- ✅ Power-Up Mode with chat commands `!powerupon [2x/3x/5x] [duration] [events]`
- ✅ Sleep Mode with `!sleepon` / `!sleepoff` commands
- ✅ Warning Alert (numbers blink red when timer near end)
- ✅ Auto-lock at 00:00 (toggle on/off)
- ✅ Cap Timer (maximum time limit)
- ✅ Blacklist Usernames (comma-separated)
- ✅ Sound Effects (customizable with volume sliders)
- ✅ Confetti on Completion (color, explosions, amount customizable)
- ✅ Chat Command Permissions (role-based access)
- ✅ Font & Color Customization
- ✅ Widget Size Adjustment
- ✅ Event Logging & Tracking

### Timer Commands
| Command | Example | Description |
|---------|---------|-------------|
| `!pause` | - | Pauses the timer |
| `!resume` | - | Resumes the timer |
| `!addtime` | `!addtime 24h30m10s` | Adds specified time |
| `!subtracttime` | `!subtracttime 1h30m` | Subtracts time |
| `!lock` | - | Locks timer (blocks additions) |
| `!unlock` | - | Unlocks timer |
| `!powerupon` | `!powerupon [2x] [30m] [subs]` | Activates power-up mode |
| `!powerupoff` | - | Deactivates power-up |
| `!sleepon` | - | Enables sleep mode |
| `!sleepoff` | - | Disables sleep mode |

### Event Integration
- **Tier 1/2/3 Subscriptions** (individual values)
- **Gift Subscriptions** (Tier 1/2/3)
- **Follows**
- **Cheers/Bits** (per 100 bits)
- **Donations** (per dollar)
- **Raids**
- **Hosts**

---

## 🎯 Module 2: Milestone Tracker

### Key Features
- ✅ Up to 50 Goals via StreamElements settings
- ✅ Infinite Stretch Goals via chat commands
- ✅ Progress Bar with real-time updates
- ✅ Sliding window (shows 3 milestones at a time)
- ✅ Green checkmarks for completed goals
- ✅ Mystery Goals (hide until unlocked)
- ✅ Visual effects (glow on milestone reached)
- ✅ Goal Bar / List View options
- ✅ Color & Font Customization
- ✅ Hide Completed option
- ✅ Stretch Visuals (smooth transitions)
- ✅ Ko-fi integration support

### Milestone Commands
| Command | Example | Description |
|---------|---------|-------------|
| `!addgoal` | `!addgoal [Goal Title] [Number]` | Adds a stretch goal |
| `!removegoal` | `!removegoal [Number]` | Removes specific goal |
| `!cleargoals` | - | Clears all goals |

### Display Settings
- **Goals to Show**: Number of active milestones visible
- **Completed Goals to Show**: How many completed stay visible
- **Show Before Completion**: Preview upcoming goal
- **Show After Completion**: Reveal only after completion

---

## 🎯 Module 3: Quest Widget (Surprise Challenges)

### Key Features
- ✅ Random Quest Popup at intervals
- ✅ Custom Quest List via settings
- ✅ Timed Challenges with countdown
- ✅ Completion & Failure Logic
- ✅ Multiple Quest Types (subs, tips, bits, follows, triggers)
- ✅ Popup Animation with effects
- ✅ Shared Points System with Timer & Milestones
- ✅ Chain Reaction Quests (optional)
- ✅ Event-Driven Activation
- ✅ Adjustable Frequency & Chance
- ✅ Quest Rewards & Penalties
- ✅ Twitch & Ko-fi Integration
- ✅ Custom Positioning anywhere on overlay
- ✅ Theme Matching (colors, glow, borders, text)
- ✅ Popup Effects (confetti, glow, fade-in/out)
- ✅ Sound Effects Support (4 states)
- ✅ Dynamic Display Time
- ✅ Quest Queue system
- ✅ Testing Mode for preview

### Quest Commands
| Command | Description |
|---------|-------------|
| `!questpause` | Pause quest rolls |
| `!questresume` | Resume quest rolls |

### Quest Settings
- **Roll Style**: Default (re-enter pool) or Deplete (remove completed)
- **Quest Interval**: Minutes between quest rolls
- **Quest Chance**: Probability % of quest appearing
- **Points to Complete**: Required points per quest
- **Warning Time**: Seconds before red alert
- **Expire Time**: Total quest duration
- **Exit Duration**: How long to show after completion/failure

---

## 🎨 Customization Features

### All Modules Support:
- **Color Customization** – Every element has color picker
- **Font Customization** – Google Fonts integration + size controls
- **Size Adjustment** – Widget dimensions fully configurable
- **Position Control** – CSS-based positioning
- **Sound Effects** – Upload custom sounds with volume control
- **Confetti Effects** – Customizable explosions, colors, amounts
- **Glow Effects** – State-based glow animations
- **Border Styling** – Width, radius, color controls

---

## 🔗 Cross-Module Integration

### Shared Points System
All three modules can work together using a unified points system:

1. **Viewer Action** (sub, tip, cheer, etc.)
2. **Timer** adds time
3. **Milestone** adds progress
4. **Quest** adds points toward completion

**Example Flow:**
> Viewer donates $10
> - Timer: +20 seconds added
> - Milestone: +10 points toward next goal
> - Quest: +20 points toward active quest

This creates a cohesive engagement experience where all widgets respond to the same events!

---

## 🎯 Platform Support

| Platform | Timer | Milestones | Quests | Status |
|----------|-------|------------|--------|--------|
| **Twitch** | ✅ | ✅ | ✅ | Live |
| **Ko-fi** | ✅ | ✅ | ✅ | Live |
| **YouTube** | 🔄 | 🔄 | 🔄 | Coming Soon |
| **Tiltify** | 🔄 | 🔄 | 🔄 | Coming Soon |

---

## 📋 Complete Feature Checklist

### Timer Widget ✅
- [x] 3 different layouts
- [x] Color customization
- [x] Widget size adjustment
- [x] Warning alert (blinking red)
- [x] Auto-lock at 00:00
- [x] Cap timer
- [x] Power-up mode (2x/3x/5x)
- [x] Sleep mode
- [x] Custom sounds
- [x] Confetti effects
- [x] Pause/play icon updates
- [x] Blacklist usernames
- [x] Font style changes
- [x] Time starts at feature
- [x] Custom time per event
- [x] Alerts integration
- [x] Chat command permissions
- [x] Chat command customization
- [x] Reset/Pause/Resume commands
- [x] Event logging
- [x] Customizable text labels
- [x] Ko-fi integration

### Milestone Goals ✅
- [x] Add up to 50 goals via settings
- [x] Set multiple goals
- [x] Mystery goals (hide until unlock)
- [x] Visual effects (glow)
- [x] Goal bar / list view
- [x] Color & font customization
- [x] Hide completed
- [x] Stretch visuals
- [x] Stretch goals via chat
- [x] Ko-fi integration

### Quest Widget ✅
- [x] Works as popup
- [x] Color customization (all elements)
- [x] Font style customization
- [x] Font size customization
- [x] Timer countdown
- [x] Progress bar
- [x] Chat command permissions
- [x] Chat command customization
- [x] Add quests via commands
- [x] Add quests via settings
- [x] Random quest popup
- [x] Custom quest list
- [x] Timed challenges
- [x] Completion & failure logic
- [x] Multiple quest types
- [x] Popup animation
- [x] Shared points system
- [x] Affects timer & milestones
- [x] Chain reaction quests
- [x] Event-driven activation
- [x] Adjustable frequency
- [x] Quest rewards & penalties
- [x] Ko-fi & Twitch integration
- [x] Custom positioning
- [x] Theme matching
- [x] Popup effects
- [x] Sound effects
- [x] Dynamic display time
- [x] Quest queue

---

## 🧪 Testing

Each widget includes a `test.html` file for local testing:

1. Open `test.html` in browser
2. Use test buttons to simulate events
3. Preview all states and animations
4. Adjust settings before going live

---

## 📚 Documentation

- **Main Documentation**: `/megathon/doc.md`
- **Timer Widget**: `/timer-widget/README.md`
- **Milestone Tracker**: `/milestone-tracker/README.md`
- **Quest Widget**: `/quest-widget/README.md`

---

## 🎬 Stream Deck Integration

**Coming Soon:** Stream Deck profile with 10 customizable icons and preset commands for live control during streams.

---

## 💡 Tips for Marathon Streams

1. **Start Timer High** – Set initial time to create urgency (e.g., 10 hours)
2. **Balance Events** – Configure rewards so all event types feel valuable
3. **Use Power-Ups** – Activate during slow periods to boost engagement
4. **Sleep Mode** – Enable during breaks to reduce additions
5. **Mix Quest Difficulty** – Combine easy and hard quests for variety
6. **Test Everything** – Use test.html files to preview before stream
7. **Set Realistic Caps** – Prevent timer from growing too large
8. **Enable Warnings** – Give viewers urgency as timer approaches zero

---

## 🆘 Troubleshooting

### Timer Not Updating?
- Check if timer is locked (`!unlock` to fix)
- Verify event values are configured
- Ensure user isn't blacklisted

### Milestones Not Progressing?
- Confirm milestone values are set
- Check event point values match
- Verify StreamElements is receiving events

### Quests Not Appearing?
- Disable Testing Mode
- Check Quest Chance > 0%
- Verify Quest Interval has elapsed

### Confetti Not Showing?
- Check explosion count > 0
- Verify browser supports Canvas
- Ensure confetti amount > 0

---

## 🔮 Roadmap

- [ ] YouTube Live integration
- [ ] Tiltify campaign support
- [ ] One-click installation links
- [ ] Stream Deck profile release
- [ ] Mobile app for remote control
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Advanced quest chaining
- [ ] Webhook integration
- [ ] API for external tools

---

## 📄 License & Credits

**Created for the Megathon streaming community**

All widgets are designed for StreamElements and follow their widget development guidelines.

---

## 🤝 Support

For issues, questions, or feature requests:
- Check individual widget README files
- Review the main documentation (`doc.md`)
- Test locally using `test.html` files
- Verify StreamElements integration

---

**Happy Streaming! 🎮✨**

*Make your marathon streams engaging, interactive, and unforgettable with the Megathon Widget System!*
