# 📁 Megathon Widget System - File Structure

## Overview
Complete file structure for the Megathon Widget System with all modules organized and documented.

---

## 📂 Directory Structure

```
megathon/
│
├── 📄 README.md                      # Main documentation (YOU ARE HERE)
├── 📄 doc.md                         # Complete feature specifications
│
├── 📁 timer-widget/                  # Main Timer Widget (Enhanced)
│   ├── widget.html                   # HTML structure
│   ├── widget.css                    # Styling & animations
│   ├── widget.js                     # Core timer logic (831 lines)
│   ├── widget.json                   # Field configuration
│   ├── test.html                     # Local testing page
│   ├── image.png                     # Widget preview
│   └── README.md                     # Timer documentation
│
├── 📁 timer-widget-compact/          # Compact Timer Layout
│   ├── widget.html
│   ├── widget.css
│   ├── widget.js                     # Marathon timer variant (831 lines)
│   ├── widget.json
│   ├── test.html
│   ├── image.png
│   └── README.md
│
├── 📁 timer-widget-wide/             # Wide Timer Layout
│   ├── widget.html
│   ├── widget.css
│   ├── widget.js                     # Stream timer variant (831 lines)
│   ├── widget.json
│   ├── test.html
│   ├── image.png
│   └── README.md
│
├── 📁 milestone-tracker/             # Milestone & Goals Widget
│   ├── widget.html                   # Progress tracker structure
│   ├── widget.css                    # Navy blue & yellow theme
│   ├── widget.js                     # Milestone tracking logic
│   ├── widget.json                   # Configuration fields
│   ├── test.html                     # Testing interface
│   ├── MegathonTimerMockup (1).png  # Design reference
│   └── README.md                     # Milestone documentation
│
├── 📁 quest-widget/                  # Surprise Quest System ⭐ NEW!
│   ├── widget.html                   # Quest popup structure
│   ├── widget.css                    # Animated glow effects
│   ├── widget.js                     # Quest system logic
│   ├── widget.json                   # Comprehensive settings
│   ├── test.html                     # Quest testing page
│   └── README.md                     # Quest documentation
│
├── 📁 SubDono Widget v2/             # Reference Widget (DO NOT USE)
│   ├── css.txt                       # Reference CSS
│   ├── data.txt                      # Reference data
│   ├── fields.txt                    # Reference fields
│   ├── html.txt                      # Reference HTML
│   └── js.txt                        # Reference JavaScript
│
└── 📁 megathon-project/              # Project Documentation
    ├── Megathon 27acd0ed0c25800db390c8aa41b2f17a.md
    └── Megathon 27acd0ed0c25800db390c8aa41b2f17a/
        ├── 1.png - 9.png             # Documentation images
        └── WhatsApp_Image_*.jpeg     # Additional assets

```

---

## 🎯 Widget Modules

### 1️⃣ Timer Widget (3 Variants)
**Folders:** `timer-widget/`, `timer-widget-compact/`, `timer-widget-wide/`

**Purpose:** Marathon timer with power-ups, sleep mode, and event integration

**Key Files:**
- `widget.js` (831 lines) - Complete timer logic with:
  - Power-up system (2x/3x/5x multipliers)
  - Sleep mode (time reduction)
  - Event handling (subs, tips, bits, follows, raids)
  - Chat commands (!pause, !powerupon, !sleepon, etc.)
  - Confetti system
  - Sound effects
  - Blacklist management
  - Cap limits & warnings

- `widget.json` - Comprehensive field configuration:
  - Starting time settings
  - Event reward values (all tiers)
  - Power-up configurations
  - Sleep mode settings
  - Color customization
  - Sound upload fields
  - Permission controls
  - Command customization

**Layouts:**
- **Enhanced** (`timer-widget/`) - Full effects, animations, power-up visuals
- **Compact** (`timer-widget-compact/`) - Minimal design, space-efficient
- **Wide** (`timer-widget-wide/`) - Horizontal layout for bottom overlays

---

### 2️⃣ Milestone Tracker
**Folder:** `milestone-tracker/`

**Purpose:** Visual goal/milestone tracking with progress bar

**Key Files:**
- `widget.js` - Milestone system with:
  - Event-based progress tracking
  - Sliding window display (3 visible milestones)
  - Completion checkmarks
  - Smooth progress animations
  - Multiple event type support
  
- `widget.css` - Navy & yellow theme:
  - Progress bar styling
  - Checkmark animations
  - Milestone item layouts
  - Responsive design

- `widget.json` - Configuration for:
  - Milestone names & values
  - Event point conversions
  - Visual customization
  - Starting progress

**Features:**
- Up to 50 milestones via settings
- Real-time progress updates
- Green checkmarks on completion
- Progress bar with timer display (250:500 format)
- Event integration (subs, tips, cheers, raids, hosts)

---

### 3️⃣ Quest Widget ⭐
**Folder:** `quest-widget/`

**Purpose:** Random surprise challenges during stream

**Key Files:**
- `widget.js` - Quest system featuring:
  - Quest roll system (default/deplete modes)
  - Timer countdown with warnings
  - Point tracking & progress
  - Confetti animations
  - Sound effect management
  - Command handling
  - Testing mode

- `widget.css` - Advanced styling:
  - Popup animations (slide-in/out)
  - State-based glow effects (4 types)
  - Progress bar shimmer
  - Warning blink animations
  - Shake effects on failure
  - Responsive positioning

- `widget.json` - Extensive configuration:
  - Quest pool settings
  - Roll frequency & chance
  - Point values per event
  - Visual customization (10+ color fields)
  - Glow effect colors
  - Font settings
  - Sound uploads (4 states)
  - Confetti settings (2 states)
  - Command configuration

**States:**
1. **New Quest** - Yellow glow, entrance animation
2. **Warning** - Red pulsing glow, blinking text
3. **Completed** - Green glow, success confetti
4. **Failed** - Red glow, shake animation, failure confetti

---

## 📊 File Statistics

| Widget | HTML | CSS | JS Lines | JSON Fields | Total Files |
|--------|------|-----|----------|-------------|-------------|
| Timer Widget | 1 | 1 | 831 | ~50 | 7 per variant |
| Milestone Tracker | 1 | 1 | ~200 | ~20 | 6 |
| Quest Widget | 1 | 1 | ~600 | ~80 | 5 |
| **Total** | **5** | **5** | **~2,800** | **~200** | **25** |

---

## 🔧 Configuration Files

### widget.json Field Groups

**Timer Widget:**
- General Settings (start time, cap, warnings)
- Event Rewards (8 event types × 3 tiers)
- Power-Up Settings (2x/3x/5x configurations)
- Sleep Mode Settings
- Color Customization (10+ fields)
- Sound Effects (4 sounds + volumes)
- Confetti Settings (explosions, colors, amounts)
- Command Configuration (8 commands + permissions)
- Blacklist Management

**Milestone Tracker:**
- Milestone Configuration (names, values)
- Event Point Values (8 event types)
- Visual Settings (colors, fonts, sizing)
- Display Options (width, position)
- Starting Progress

**Quest Widget:**
- General Settings (testing, roll style, intervals)
- Quest Pool (names, descriptions, points)
- Event Point Values (8 event types)
- Visual Customization (colors, borders, sizing)
- Color Customization (10+ colors)
- Glow Effects (4 state colors)
- Font Settings (family, 4 size fields)
- Sound Effects (4 sounds + volumes)
- Confetti Settings (2 states × 3 fields each)
- Command Configuration (2 commands + permissions)

---

## 🎨 Shared Design System

### Color Palette
**Primary Colors:**
- Navy Blue: `#1e1b4b` / `#1a1a2e` (backgrounds)
- Gold/Yellow: `#ffd700` (accents, borders)
- Green: `#10b981` / `#00ff7f` (success, checkmarks)
- Red: `#ff4500` / `#dc143c` (warnings, failures)

**Gradients:**
- Progress Bar: `#ffd700` → `#f59e0b`
- Glow Effects: RGBA variants with 0.3-0.4 alpha

### Fonts
- Primary: **Inter** (clean, modern)
- Secondary: **Poppins** (headings, timers)
- Google Fonts integration enabled

### Animations
- Slide-in/out transitions (0.5s cubic-bezier)
- Pulse glow (2s ease-in-out infinite)
- Blink warnings (0.5s ease-in-out infinite)
- Shimmer effects (2s linear infinite)
- Confetti particles (physics-based)

---

## 🚀 Quick Reference

### Local Testing
```bash
# Timer Widget
open timer-widget/test.html

# Milestone Tracker
open milestone-tracker/test.html

# Quest Widget
open quest-widget/test.html
```

### StreamElements Upload Order
1. Create new Custom Widget
2. Paste `widget.html` → HTML tab
3. Paste `widget.css` → CSS tab
4. Paste `widget.js` → JS tab
5. Paste `widget.json` → Fields tab
6. Configure settings
7. Save & add to overlay

### Integration Setup
For unified experience across all widgets:
1. **Match Event Values** - Use same point values across all widgets
2. **Coordinate Colors** - Keep consistent theme (navy + gold)
3. **Position Strategically** - Timer top, Milestones side, Quests center
4. **Test Together** - Ensure events trigger all widgets correctly

---

## 📱 Cross-Platform Support

| Platform | Implementation Status | Notes |
|----------|----------------------|-------|
| **StreamElements** | ✅ Full Support | Primary platform |
| **Twitch** | ✅ Full Support | All event types |
| **Ko-fi** | ✅ Integrated | Tips & donations |
| **YouTube** | 🔄 Coming Soon | SuperChat support planned |
| **Tiltify** | 🔄 Coming Soon | Campaign integration planned |

---

## 🔗 Related Files

### Documentation
- `/megathon/README.md` - Main system documentation (THIS FILE)
- `/megathon/doc.md` - Complete feature specifications
- `/timer-widget/README.md` - Timer widget guide
- `/milestone-tracker/README.md` - Milestone widget guide
- `/quest-widget/README.md` - Quest widget guide

### Testing Files
- `*/test.html` - Local testing interfaces (5 files)
- Test buttons for simulating all event types
- Real-time preview of widget behavior

### Assets
- `*/image.png` - Widget preview images
- `/megathon-project/Megathon*/` - Design mockups & references

---

## 🎯 Usage Recommendations

### For New Users
1. Start with **Timer Widget** (easiest to configure)
2. Add **Milestone Tracker** (simple goal system)
3. Enable **Quest Widget** once comfortable (most complex)

### For Advanced Users
1. Use all 3 widgets simultaneously
2. Configure shared point system
3. Customize all visual elements
4. Create custom sounds & effects
5. Set up Stream Deck integration (coming soon)

### Best Practices
- **Timer**: Set realistic cap (12-24 hours) and warning threshold (5-10 min)
- **Milestones**: Use 5-10 goals, mix easy & hard targets
- **Quests**: 10-15 min intervals, 70-100% spawn chance, varied difficulty

---

## 🆘 Support & Resources

### Troubleshooting Guides
Each widget README includes:
- Common issues & solutions
- Event debugging steps
- Configuration tips
- Performance optimization

### Community Resources
- StreamElements Documentation
- Megathon Community Discord (link in main README)
- Widget Showcase Gallery (coming soon)

---

**Last Updated:** October 2025
**Total Lines of Code:** ~2,800
**Configuration Options:** ~200 fields
**Supported Events:** 8 types (Subs, Tips, Bits, Follows, Raids, Hosts, Cheers, Donations)

---

*This file structure represents a complete, production-ready marathon streaming widget system with professional documentation and testing capabilities.* 🎮✨
