# Megathon-4 Milestone Tracker Widget

A StreamElements custom widget for tracking milestones/challenges with a progress bar and visual milestone list.

## Features

- **Progress Tracking**: Tracks progress from multiple event sources (subs, tips, cheers, raids, hosts)
- **Visual Progress Bar**: Shows current progress towards the next milestone with yellow gradient
- **Milestone List**: Displays 3 milestones at a time in a sliding window
- **Completion Checkmarks**: Green checkmarks appear when milestones are completed
- **Navy & Yellow Theme**: Matches the megathon aesthetic with navy blue background and yellow accents

## Event Tracking

The widget automatically tracks:
- **Subscriptions**: Different values for Tier 1/2/3 subs
- **Cheers/Bits**: Converts bits to progress (default: 500 bits = 1 count)
- **Tips**: Converts tips to progress (default: $5 = 1 count)
- **Raids**: Counts raids with 10+ viewers
- **Hosts**: Counts hosts with 10+ viewers

## Configuration

Customize these settings in StreamElements:

### Milestones
- **Milestone Names**: Comma-separated list of milestone names
- **Milestone Values**: Comma-separated list of goal values

### Event Values
- **Tier 1/2/3 Sub Values**: Points awarded per sub tier
- **Bits Per Count**: How many bits equal 1 count (default: 500)
- **Tips Per Count**: How much $ equals 1 count (default: 5)
- **Raid/Host Value**: Points for qualifying raids/hosts

## Testing

Open `test.html` in your browser to test the widget locally with simulated events.

## Installation

1. Copy the contents of `widget.html`, `widget.css`, `widget.js`, and `widget.json`
2. In StreamElements, create a new Custom Widget
3. Paste each file's content into the corresponding tab
4. Configure your milestones and event values in the Settings tab
5. Save and add to your overlay

## UI Customization

The widget uses:
- Navy Blue Background: `#1e1b4b`
- Yellow Accent: `#ffd700`
- Green Checkmarks: `#10b981`

Modify the CSS to change colors, sizing, or layout as needed.
