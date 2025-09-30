# Megathon Timer Widget System - Complete Documentation

## 📋 Overview

The Megathon Timer Widget System consists of three different layout variants (`megathon1`, `megathon2`, `megathon3`) that provide a comprehensive marathon-style timer with interactive chat commands, event-based time rewards, and advanced customization options.

## 🎯 Core Features

### ⏱️ Timer Functionality
- **Custom Timer Duration**: Set starting time with customizable cap limits
- **Count-up Mode**: Timer runs from start time toward cap limit
- **Auto-lock at 00:00**: Timer automatically locks when reaching zero
- **Warning Alert**: Numbers blink red when timer approaches end (customizable threshold)
- **Visual Controls**: Play/pause button with dynamic icon updates

### 🎨 Customization
- **Fully Customizable Colors**: All elements can be styled
- **3 Different Layouts**: Choose from megathon1, megathon2, or megathon3 designs
- **Sound Effects**: Customizable audio for timer events
- **Confetti Effects**: Celebratory animations when timer reaches 00:00

### 🎮 Chat Commands & Permissions

#### Megathon1 Commands
- `!mega-start` - Start the megathon timer
- `!mega-pause` - Pause the timer
- `!mega-reset` - Reset timer to starting value
- `!mega-powerup [2x/3x/5x] [duration] [permission]` - Activate power-up mode
- `!mega-sleep [duration]` - Activate sleep mode (reduces event rewards)

#### Megathon2 Commands  
- `!marathon-start` - Start the marathon timer
- `!marathon-pause` - Pause the timer
- `!marathon-reset` - Reset timer
- `!marathon-boost [multiplier] [duration]` - Power-up mode
- `!marathon-rest [duration]` - Sleep mode

#### Megathon3 Commands
- `!stream-start` - Start the stream timer
- `!stream-pause` - Pause the timer  
- `!stream-reset` - Reset timer
- `!stream-power [multiplier] [duration]` - Power-up mode
- `!stream-chill [duration]` - Sleep mode

### 🔒 Role Permission System
- **Everyone**: Can view timer status
- **Subscribers+**: Can use basic timer commands
- **VIP+**: Can use power-up commands
- **Moderators+**: Can use all commands including reset
- **Broadcaster Only**: Full administrative control

### 🎁 Event-Based Time Rewards

#### Subscription Tiers
- **Tier 1 Subscription**: +60 seconds (base amount)
- **Tier 2 Subscription**: +120 seconds (2x multiplier) 
- **Tier 3 Subscription**: +360 seconds (6x multiplier)

#### Gift Subscriptions
- **Tier 1 Gift**: +60 seconds per gift
- **Tier 2 Gift**: +120 seconds per gift
- **Tier 3 Gift**: +360 seconds per gift
- **Bulk Gifts**: Automatically calculated based on tier distribution

#### Other Events
- **Follow**: +30 seconds
- **Cheer**: +10 seconds per 100 bits
- **Donation**: +20 seconds per $1
- **Raid**: +120 seconds
- **Host**: +90 seconds

### ⚡ Special Modes

#### Power-Up Mode
- **Activation**: `!powerup [2x/3x/5x] [duration] [permission_level]`
- **Effect**: Multiplies all time rewards by specified amount
- **Duration**: Customizable (default 30 minutes)
- **Permissions**: Configurable per multiplier level
- **Visual Indicator**: Special popup and timer styling

#### Sleep Mode
- **Activation**: `!sleep [duration]`
- **Effect**: Reduces time rewards by 50%
- **Duration**: Customizable (default 120 minutes)
- **Visual Indicator**: Dimmed timer display

### 🎊 Visual Effects

#### Confetti System
- **Trigger**: Timer reaches 00:00
- **Explosions Count**: Configurable number of confetti bursts
- **Colors**: Fully customizable color palette
- **Duration**: Adjustable animation length

#### Popup Notifications
- **Time Added**: Shows "+XXs" when events add time
- **Power-Up Active**: Displays multiplier status (2x, 3x, 5x)
- **Mode Changes**: Sleep mode activation notifications

#### Warning System
- **Red Blinking**: Timer numbers flash red when approaching zero
- **Threshold**: Customizable warning time (default: 5 minutes)
- **Audio Alert**: Optional sound warning

## ⚙️ Configuration Options

### Timer Settings
```json
{
  "startingHours": 10,
  "startingMinutes": 0,
  "startingSeconds": 0,
  "maxCapHours": 24,
  "maxCapMinutes": 0,
  "warningThresholdMinutes": 5,
  "autoLockOnZero": true
}
```

### Event Rewards (Seconds Added)
```json
{
  "tier1Sub": 60,
  "tier2Sub": 120, 
  "tier3Sub": 360,
  "follow": 30,
  "cheerPer100Bits": 10,
  "donationPerDollar": 20,
  "raid": 120,
  "host": 90
}
```

### Power-Up Configuration
```json
{
  "enablePowerUp": true,
  "multiplier2xPermission": "subscriber",
  "multiplier3xPermission": "vip", 
  "multiplier5xPermission": "moderator",
  "defaultDurationMinutes": 30
}
```

### Sleep Mode Configuration  
```json
{
  "enableSleepMode": true,
  "rewardReduction": 0.5,
  "defaultDurationMinutes": 120,
  "sleepPermission": "moderator"
}
```

### Security Settings
```json
{
  "commandsEnabled": true,
  "blacklistedUsers": "",
  "startPermission": "subscriber",
  "pausePermission": "moderator",
  "resetPermission": "moderator"
}
```

### Audio Settings
```json
{
  "enableSounds": true,
  "startSound": "",
  "pauseSound": "",
  "completeSound": "",
  "warningSound": "",
  "soundVolume": 70
}
```

### Confetti Settings
```json
{
  "enableConfetti": true,
  "explosionCount": 3,
  "confettiColors": ["#ff6b6b", "#4ecdc4", "#45b7d1"],
  "animationDuration": 5
}
```

## 🎨 Color Customization

### Layout Colors (All Variants)
- Timer Background
- Timer Border  
- Number Colors
- Control Button Colors
- Warning State Colors

### Power-Up Mode Colors
- 2x Multiplier Theme
- 3x Multiplier Theme  
- 5x Multiplier Theme

### Sleep Mode Colors
- Dimmed Display Theme
- Reduced Opacity Settings

## 📱 Widget Layouts

### Megathon1 - Classic Layout
- Horizontal time display
- Side control buttons
- Compact design suitable for corner overlays

### Megathon2 - Vertical Layout  
- Stacked time elements
- Bottom control panel
- Ideal for side panel placement

### Megathon3 - Expanded Layout
- Large central timer
- Distributed controls
- Perfect for full-screen overlays

## 🔧 Integration Guide

### StreamElements Setup
1. Upload widget files to StreamElements overlay
2. Configure field data through dashboard
3. Set permission levels for commands
4. Customize colors and timing values
5. Test with different user roles

### Command Testing
Each widget includes test functions:
- Permission level testing
- Event simulation  
- Power-up mode testing
- Sleep mode activation
- Confetti triggers

## 🛡️ Security Features

### User Blacklisting
- Comma-separated blacklist support
- Applies to all commands and interactions
- Real-time enforcement

### Permission Validation
- Role-based command access
- Hierarchical permission system
- Broadcaster override capabilities

### Event Validation
- Duplicate event filtering
- Malicious input sanitization
- Rate limiting protection

## 📊 Analytics & Monitoring

### Session Tracking
- Total time added from events
- Power-up usage statistics
- Command usage frequency
- User interaction metrics

### Performance Monitoring
- Event processing times
- Command response rates
- Error tracking and logging

## 🚀 Advanced Features

### API Integration
- StreamElements event handling
- Real-time data synchronization
- Cross-widget communication
- Persistent data storage

### Extensibility
- Custom event handlers
- Plugin-style architecture
- Theme system support
- External API webhooks

---

## 📝 Notes

- All three widgets can run simultaneously with non-conflicting commands
- Color schemes are independently configurable per widget
- Permission systems are consistent across all variants
- Event processing is optimized for real-time performance
- Full backward compatibility with existing StreamElements features

**Last Updated**: September 30, 2025  
**Version**: 1.0.0  
**Compatibility**: StreamElements Custom Widgets