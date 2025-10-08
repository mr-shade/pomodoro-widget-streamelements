# **Megathon Widget – Complete Developer Documentation**

# **Overview**

The **Megathon Widget** is an all-in-one **interactive marathon system** for Twitch streamers, integrating three powerful modules:

1. **Timer Widget** – A fully customizable marathon timer with event-based extensions and effects.
2. **Milestone Goals** – A visual system for stretch goals and milestones.
3. **Surprise Quests** – Interactive challenges that appear dynamically during the stream.

It offers **one-click installation via StreamElements**, no zip/text files required, and will soon support **Ko-fi**, **YouTube**, and **Tiltify** alongside Twitch.

# **Module 1: Timer Widget**

**General Features**

- **3 Timer Layouts:** Stacked, Wide, and Compact (user-selectable).
- **Easy Installation:** One-click StreamElements link – no manual setup needed.
- **Cross-Platform Compatibility:** Works with **Twitch** and **Ko-fi** (more integrations soon).
- **Full Customization:** Every visual element (fonts, colors, icons, etc.) is editable.
- **Layer Separation:** Each element (text, icons, effects) is on a separate layer for flexible overlay positioning.

**Timer Settings**

| **Setting** | **Description** |
| --- | --- |
| **Start Time** | Choose custom starting time for the marathon. Must click “Apply” to save. |
| **Warning Time** | When the timer reaches this mark, digits blink red to warn viewers. |
| **Cap Time** | Sets a maximum limit for the timer. Once reached, no more time is added. |
| **Lock Timer at 00:00** | Auto-locks the timer when it reaches zero, preventing further time additions. |
| **Start Message** | Placeholder text shown before the first event occurs. Gets replaced automatically by the first event’s details. |
| **Positioning** | All layers are individually positionable for custom stream layout setups. |

**Event Integration**

- Compatible with Twitch and Ko-fi events.
- Time additions are **customizable per event**, supporting seconds (s), minutes (m), and hours (h).
- Event types include:
    - Subscriptions (Tier 1, 2, 3)
    - Gifted Subs (Tier 1, 2, 3)
    - Follows
    - Cheers (Bits)
    - Donations
    - Raids

**Power-Up Mode**

Adds excitement by multiplying event time values for a specific duration.

**Command Syntax:**

!powerupon [multiplier] [duration] [events]

**Examples:**

- !powerupon [2x] [30m] [subs] – 2x multiplier on subs for 30 minutes.
- !powerupon [3x] [] [subs,gift,bits] – 3x multiplier indefinitely for selected events.

**Notes:**

- Use brackets for parameters.
- Unspecified duration = infinite.
- Unspecified events = applies to all.
- Separate multiple events with commas.

**Disable Command:**

!powerupoff

**Sleep Mode**

Puts the stream into a “rest” state while reducing time added per event.

- **Features:**
    - Mutes all sounds.
    - Displays a **moon icon** on the timer.
    - Reduces event time additions (custom multiplier).

**Commands:**

!sleepon

→ Enables sleep mode.

!sleepoff

→ Disables sleep mode.

**Behavioral Options:**

- To pause and reduce event time: !pause during sleep mode.
- To pause without adding time: !pause and !lock together.

**Timer Control Commands**

| **Command** | **Example** | **Description** |
| --- | --- | --- |
| !pause | – | Pauses the timer. |
| !resume | – | Resumes the timer. |
| !addtime | !addtime 24h30m10s | Adds specified time. |
| !subtracttime | !subtracttime 1h30m | Subtracts specified time. |
| !lock | – | Locks the timer (blocks new additions). |
| !unlock | – | Unlocks the timer. |

**Audio & Visual Effects**

**Sound Events:**

- Timer Play / Resume
- Timer Pause
- Timer Complete
Each sound is **customizable** with an individual **volume slider**.

**Confetti Effect (on timer completion):**

- **Explosion Count:** Number of confetti bursts.
- **Confetti Amount:** Density of confetti.
- **Confetti Color:** Fully customizable.
- **Custom Emotes:** Up to 3 emotes or images can appear within the confetti.

**Extra Tools**

- **Stream Deck Profile:**
Includes 10 customizable icons and preset commands for live control during streams.
- **Blacklist:**
Block specific usernames from triggering time additions (comma-separated list).

# **Module 2: Milestone Goals**

**Overview**

The Milestone module helps streamers visualize and track progress-based goals. It supports **up to 50 milestones** via StreamElements fields and **infinite stretch goals** through chat commands.

**Settings**

| **Setting** | **Description** |
| --- | --- |
| **Goals to Show** | Number of milestone goals displayed on screen. |
| **Completed Goals to Show** | Number of completed goals shown. |
| **Show Before Completion** | Reveals upcoming goal title once it’s next in line. |
| **Show After Completion** | Reveals title only after completion. |

**Customization:**

Each part of the milestone widget has its own color field. Stretch and upcoming goals have distinct bubble colors.

**Milestone Commands**

| **Command** | **Example** | **Description** |
| --- | --- | --- |
| !addgoal | !addgoal [Goal Title] [Number] | Adds a stretch goal. |
| !removegoal | !removegoal [Number] | Removes a specific goal. |
| !cleargoals | – | Clears all goals. |

# **Module 3: Progress Bar**

**Overview**

Tracks goal progress visually with two layout options:

- **Milestones Bar:** Displays dots for each milestone.
- **Simple Goal:** Displays numeric progress only.

**Compatibility:** Works with **Twitch**, **YouTube**, and soon **Ko-fi.**

Each progress bar element supports **custom color fields**.

**Commands**

| **Command** | **Example** | **Description** |
| --- | --- | --- |
| !addpoints | !addpoints 50 | Adds points to the goal. |
| !subtractpoints | !subtractpoints 25 | Removes points from the goal. |
| !setpoints | !setpoints 500 | Manually sets total points. |
| !resetpoints | – | Resets total to zero. |

**Note:**

If used alongside milestones, ensure point values match for consistency.

# **Module 4: Surprise Quests**

**Overview**

The **Surprise Quests** module introduces interactive mini-challenges that appear at random or set intervals. It features glowing effects, sound cues, and confetti animations on completion.

**Quest Settings**

| **Setting** | **Description** |
| --- | --- |
| **Testing Mode** | Enable to preview quest states and appearance. Disable before going live. |
| **Roll Style** | - **Default:** Completed quests re-enter the pool (never twice consecutively).
- **Deplete:** Completed quests are removed until reset. |
| **New Quest Every** | Sets the time interval between new quests. |
| **% Chance of New Quest** | Probability of a quest appearing at each interval (100% = always). |
| **Points to Complete** | Required points to complete a quest (shared value for all). |
| **Exit After Finished** | Duration the quest remains visible after completion/failure. |
| **Warning Time** | When the quest timer turns red as a final warning. |
| **Expire Time** | Total duration a quest remains on screen. |

**Event System:**

Works with Twitch, YouTube (and soon Ko-fi, Tiltify).

Point assignments mirror those used in Milestones for accurate tracking.

**Quest Commands**

| **Command** | **Example** | **Description** |
| --- | --- | --- |
| !questresume | – | Resumes quest rolls after a pause. |
| !questpause | – | Pauses all new quests. (Depleted lists remain preserved.) |

**Visual Effects**

Each quest state has a unique glow and confetti effect:

| **Effect Type** | **Description** |
| --- | --- |
| **Default Glow** | When the quest appears. |
| **Warning Glow** | When the timer is nearly up. |
| **Quest Complete Glow** | On quest success. |
| **Quest Failed Glow** | On quest failure. |
| **Confetti Explosion Count** | Number of bursts. |
| **Confetti Amount** | Density control. |
| **Confetti Color** | Customizable hue. |
| **Custom Emotes** | Up to 3 emotes or images in animation. |

**Quest Sound Effects**

Fully customizable sounds with independent volume controls:

- New Quest Appears
- Quest Warning
- Quest Completed
- Quest Failed

### ***Shared Progress System***

Even though it’s a popup, it **uses the same “points system”** that powers:

- the **Timer** (adds/subtracts time)
- and the **Milestones** (progress bar filling).

That means when viewers trigger events (subs, bits, Ko-fi donations, etc.), those actions:

- add points to the timer,
- move progress toward milestones,
- and can also **complete quests** automatically if their criteria are met.

🧩 Example:

> A quest appears: “Earn 500 points in 5 minutes.”
> 
> 
> Viewers donate → points increase → milestone progresses → quest completes → triggers popup “Quest Complete!” animation + confetti.
> 

**Features Checklist**

**Timer :**

- [ ]  Colour customisation Feature
- [ ]  3 different layouts.
- [ ]  Enitre Widget Size Customisation.
- [ ]  warning alert : number blinks red when timer is about to end - customisable
- [ ]  auto lock at 00:00 (toggle on/off)
- [ ]  cap timer - customisable (maximum time the clock can reach)
- [ ]  Powerup mode : multiplies time added by 2x, 3x, 5x ; chatcommand = !powerup (2x/3x/5x) (30min) (subs)
- [ ]  Sleep mode : !sleep (120min) ; this will reduce time added per event feature
- [ ]  Sound ; customisable *(time ticking, confetti, timer stop, warning alert - timer about to end).*
- [ ]  Pause play icon updates itself
- [ ]  Blacklist usernames separated by commas
- [ ]  Font Style Change Feature
- [ ]  Widget Size Adjustment Feature
- [ ]  Time starts at feature = hrs, mins, sec.
- [ ]  **Custom Time Addition per Event** – Configure how much time each sub, follow, donation, or cheer adds. *(subscriber : tier 1, tier 2, tier 3 ; gift : tier 1, tier 2, tier 3 ; follow ; cheer ; donation)* - customisable
- [ ]  **Alerts Integration** – Plays animations or sounds when time is added or milestones are reached.
- [ ]  **Multiple Milestones** – Adding up to 50 configurable goals (monetary or subscriber-based) with visual alerts.
- [ ]  Chat commands role permission = who can give can give commands
- [ ]  Chat !command customisation
- [ ]  **Reset / Pause / Resume** – Timer can be paused, resumed, or fully reset during the stream via chat commands.
- [ ]  **Event Logging** – Keeps track of events that add/subtract time (like donations or subs).
- [ ]  **Customizable Text Labels** – Add labels like “2X Time” *(speed)* or “+20sec Time Added.”
- [ ]  Confetti = when timer ends and reaches 00:00, confetti will appear (*explosions count* = how many burst of confetti will show up ; *color* = customisable).
- [ ]  Ko-fi integration

**Milestone Goals :**

- [ ]  Add upto 50 goals via settings panel in Streamelements
- [ ]  Set multiple goals like *5 subs → unlock next tier*
- [ ]  **Mystery Goals** – Hide certain goals until unlocked (adds surprise).
- [ ]  **Visual Effects** – Glow when a milestone is reached.
- [ ]  **Goal Bar / List View** = Switch between a simple goal bar or a milestone list with goal bar.
- [ ]  **Color & Font Customization** – Match your stream theme.
- [ ]  **Hide Completed** – Automatically removes completed milestones from view.
- [ ]  **Stretch Visuals** – Progress smoothly transitions from one milestone to the next.
- [ ]  **Stretch Goals** – Add more milestones even after finishing all. *add infinite goals via chat commands (eg = !addgoal (eat lemon) (450).*
- [ ]  Ko-fi integration

**Quests :**

- [ ]  works as a pop-up (appears only when
- [ ]  Colour customization (Card colour, border colour, new quest text colour, quest failed colour, quest complteted colour, confetti colour)
- [ ]  Font style customization
- [ ]  font size customization
- [ ]  timer
- [ ]  progress bar
- [ ]  chat commands role permission
- [ ]  chat !command customization (fully customizable chat commands).
- [ ]  Add quests via chat commands
- [ ]  Add quests via settings panel in Streamelements
- [ ]  **Random Quests Popup** – Quests appear randomly during your stream to surprise and engage viewers.
- [ ]  **Custom Quest List** – You can define your own quest ideas (e.g., “Gain 5 followers,” “Get 2 donations”).
- [ ]  **Timed Challenges** – Each quest has its own countdown timer (e.g., 2 minutes to complete).
- [ ]  **Completion & Failure Logic** – Quests can be successfully completed or fail if time runs out.
- [ ]  **Multiple Quest Types** – Supports quests triggered by subs, tips, bits, follows, or time-based triggers.
- [ ]  **Popup Animation** – Visually appears as a floating animated box with custom effects.
- [ ]  **Shared Points System** – Uses the same points/time pool as the **Timer** and **Milestone** widgets.
- [ ]  **Affects Timer & Milestones** – Completing a quest can add/subtract time or progress from the milestones.
- [ ]  **Chain Reaction Quests** – One quest’s completion can trigger another (optional).
- [ ]  **Event-Driven Activation** – Quests can trigger after certain milestones, donations, or viewer events.
- [ ]  **Adjustable Frequency** – Control how often quests appear (e.g., every X minutes or points).
- [ ]  **Quest Rewards & Penalties** – Set specific outcomes (e.g., +2 minutes for success, -1 minute for failure).
- [ ]  **Integration with Ko-fi & Twitch** – Works with events from both platforms (subs, bits, Ko-fi tips).
- [ ]  **Custom Positioning** – Move the popup anywhere on your overlay (center, side, top corner).
- [ ]  **Theme Matching** – Style colors, glow, borders, and text to match your stream design.
- [ ]  **Popup Effects** – Add animations (confetti, glow, fade-in/out) when quests appear or complete.
- [ ]  **Dynamic Display Time** – Choose how long the quest card stays visible.
- [ ]  **Quest Queue** – New quests wait until the previous one is finished or expired.
- [ ]  **Custom Positioning** – Move the popup anywhere on your overlay (center, side, top corner).
- [ ]  **Theme Matching** – Style colors, glow, borders, and text to match your stream design.
- [ ]  **Popup Effects** – Add animations (confetti, glow, fade-in/out) when quests appear or complete.
- [ ]  **Sound Effects Support** – Option to play a sound when a new quest appears or completes.
- [ ]  **Dynamic Display Time** – Choose how long the quest card stays visible.
- [ ]  **Quest Queue** – New quests wait until the previous one is finished or expired.

# **Final Notes**

- All modules must share a **consistent color configuration system**.
- Must allow **cross-module compatibility** (Timer + Milestones + Quests can be active simultaneously).
- Fully modular architecture for future integrations (Ko-fi, YouTube, Tiltify).
- Optimized for **StreamElements** performance and low-latency event handling.