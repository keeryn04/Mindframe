
# Welcome to Mindframe!

## 1. What Mindframe is

Mindframe is a personal productivity app built around a simple idea: a task
list is more useful when it understands how the person using it is actually
doing.

Most task managers only track what got done. Mindframe also tracks the
cost of getting it done and uses that to help you make better decisions
about what to do next. As you complete, delay, skip, or get interrupted on
tasks throughout the day, Mindframe keeps a live read on five aspects of your
current state:

- **Stress**
- **Energy**
- **Focus**
- **Momentum**
- **Confidence**

That live picture drives everything else in the app: which recommendation
you see, when you're nudged to take a break, and what your stats look like
at the end of the week.

The goal isn't just "get more done." It's to help you notice when you're
pushing past the point of being effective, catch yourself when you're in a
great state and should lean into it, and build a more honest picture of your
own patterns over time.

---

## 2. The three pillars

| Pillar | What it's for |
|---|---|
| **Calendar & Tasks** | Planning and tracking what you need to do |
| **Recommendations & State** | Understanding how you're doing right now, and what to do about it |
| **Breaks** | Stepping away well, before burnout rather than after |

These aren't three separate features bolted together, as they continuously
feed each other. Finishing a task affects your state. Your state decides
what recommendation you see. A recommendation might send you to take a
break. Taking a break changes your state again. 

---

## 3. How it's designed, at a glance

Mindframe is built so that each part of the experience has one clear job:

- The **calendar** is where you plan and manage tasks, and nothing about your
  mental state lives there directly.
- The **state model** keeps score of stress, energy, focus,
  momentum, and confidence in the background as you use the app.
- The **recommendation engine** looks at that state (and sometimes at the
  specific thing you just did) and decides what advice is worth surfacing.
- The **break experience** is a separate, calmer space you're guided into
  when your state suggests you need it, with its own activities and pacing.

Keeping these responsibilities separate is what makes the app predictable:
your break reminder and your stats page will never disagree about whether
your energy is "low," because they're both reading from the same underlying
picture of your state.

---

## 4. Features, in depth

### 4.1 Calendar & Task Management

This is the home base of the app. It features a weekly
calendar showing your scheduled tasks, color-coded and dot-marked on days
that have activity.

Each task carries:
- A **title**, **time window**, and **priority** (low / medium / high)
- A **color**, chosen by you, for quick visual scanning
- Optional **subtasks**, useful for breaking bigger items down
- A **status**: in progress, complete, delayed, skipped, or failed

From the daily list you can filter to **All**, **Active**, or **Done**, and
act on any task directly by either marking it **complete**, **delaying** it to a new date,
or **skiping** it, all without leaving the calendar.

Tapping into a task opens a detail view with full context: time and
duration, subtasks, status. From there you can edit, delay, or delete it, with
a confirmation step before anything is permanently removed.

**Example:** you have a 90-minute, high-priority task scheduled for the
afternoon. You mark it complete. Mindframe registers that this was a
demanding piece of work, and factors it into your state, which may be
reflected moments later in a recommendation encouraging you to take a short
break before starting your next task.

---

### 4.2 Your State: Stress, Energy, Focus, Momentum, Confidence

This is the part of Mindframe that isn't visible as a single screen, but
shapes almost everything you see. Behind the scenes, the app maintains a
running picture of five things:

- **Stress** — how much pressure you're currently under
- **Energy** — how much capacity you have left before you need to recover
- **Focus** — how well you're able to concentrate right now
- **Momentum** — whether you're on a roll or have stalled
- **Confidence** — how much recent success or failure has shaped your
  belief in your own ability right now

Nothing you do in the app is treated as neutral. Completing a task, failing
one, getting interrupted, creating a new task, editing one, deleting one,
starting or ending a work session, or taking a break all nudge
your state in a specific, sensible direction. For example:

- Completing a task **relieves some stress** and **builds focus,
  momentum, and confidence** but it also **costs you some energy**,
  proportional to how long and how demanding the task was.
- Failing a task **spikes stress**, **knocks your focus and momentum**,
  and **dents your confidence** based on the difficulty of the task.
- Getting interrupted mid-task has its own, separate penalty. This is a
  reminder that interruptions cost something even when the task itself
  doesn't fail.

Mindframe is also sensitive to *context*, not just individual actions. A few
examples of how it reads the room:

- If your energy is already critically low, negative events (like a failed
  task) hit noticeably harder. This is because you're depleted, not because you did
  anything wrong.
- If you're in a strong flow state (high focus and high momentum), finishing
  a task gives you an extra boost. This is because you're capitalizing on being in the
  zone.
- If your stress is already very high, additional stress from a new setback
  matters less as you're already near your ceiling, so the marginal impact is
  smaller.
- If your confidence is already low, a failure stings more; if your
  confidence is high, the same failure barely dents you.
- If you're already well-rested, a break restores less as there's simply less
  to recover.

None of this is meant to feel like a game or a score to chase. It's meant to
mirror something true: the same event doesn't always mean the same thing,
depending on what state you were already in.

**Example:** you're running on very little energy and you fail a demanding
task. Mindframe doesn't just log "one failure", it recognizes that a
failure while exhausted is amplified, and the resulting recommendation is
likely to name that directly rather than suggesting you push harder.

---

### 4.3 Recommendations

At the top of your Home screen, Mindframe surfaces one clear, timely piece
of advice based on everything it currently knows about your state. Each
recommendation belongs to one of five categories, each with its own tone and
color:

- **Recovery** — you need to rest before continuing
- **Warning** — stress or another factor is climbing and worth addressing
- **Focus** — guidance on what kind of work suits your current state
- **Motivation** — a nudge when momentum or confidence has dipped
- **Celebrate** — recognition when you're in a genuinely strong state

Recommendations also carry a priority, from **urgent** down to **low**, so
the most pressing thing you need to hear is always what's shown first.

**Two ways recommendations can work**, and you choose which one fits you in
your Profile:

- **General mode** — recommendations reflect your overall state at any
  moment and update continuously as you work, independent of what you
  just did.
- **Task mode** — recommendations respond specifically to the task you just
  completed, skipped, or were interrupted on, giving you feedback tied
  directly to that action. If nothing specific applies to what you just did,
  Mindframe automatically falls back to a general recommendation so you're
  never left without guidance.

Some examples of what you might see:

- *"You're running on empty"* — energy has dropped critically low; a break
  is strongly encouraged.
- *"Stress is climbing"* — a gentler nudge to switch to easier work before it
  builds further.
- *"You're in flow — protect it"* — focus and momentum are both high; this is
  flagged as your best window for demanding work.
- *"Good work — now step away"* (task mode) — you just finished a long,
  demanding task while already low on energy; a short break is suggested
  before starting anything else.
- *"You're on a roll"* — momentum and confidence are both strong, recognizing
  a genuine streak.

Your **stress sensitivity** setting (in Profile — Sensitive / Balanced /
Resilient) shifts how early warning-style recommendations appear: Sensitive
surfaces them sooner, Resilient waits longer before speaking up. You can
also choose to see only recommendations that come with a concrete action
attached, and control how many recommendations appear at once (one to
three).

---

### 4.4 Breaks

Mindframe treats breaks as a real feature that affects your state. There are
three layers, each a little more visible than the last, all tied to the same
underlying sense of how urgently you need to step away.

1. **A quiet status bar**, always present on your Home screen, that shifts
   in tone depending on how you're doing, which could display a subtle "Need a break?"
   invitation to a more visible "Consider a break" suggestion, up to an
   urgent "Take a break now" when energy or stress has reached a critical
   point.

2. **A break prompt**, which appears on its own the moment your state crosses into critical territory (very low energy
   or very high stress). It explains plainly why it's showing up, and gives
   you the choice to start a break or dismiss it. If dismissed, Mindframe
   won't interrupt you again for at least ten minutes, so it never feels
   naggy.

3. **The full break menu**, where you can browse guided activities by
   category, breathing, movement, mindfulness, social, or rest, and start
   whichever one fits how you're feeling. Each activity opens a simple
   guided session with a countdown timer (and step-by-step guidance for
   activities like box breathing or a body scan), and you can end it early
   once you feel ready.

Different kinds of breaks help in different ways, and Mindframe reflects
that: a breathing exercise leans into calming your stress and sharpening
focus, a short walk leans into restoring energy and momentum, mindfulness
supports clarity and steadier confidence, and a quick social check-in lifts
momentum and confidence through connection. These specific improvements are set on top of the baseline recovery
every break provides.

**Example:** your energy drops below the critical threshold mid-afternoon.
A break prompt appears: *"You're running on empty — continuing now risks
mistakes and a much longer recovery."* You choose "Start a break," pick a
10-minute walk, and complete it. When you return to the calendar, the status
bar has quieted back down, reflecting that your energy has recovered.

---

### 4.5 Profile & Preferences

Your Profile is where you tell Mindframe a bit about how you work, so its
guidance fits you rather than a generic average:

- **Display name and avatar color**, for a personal touch.
- **Work style** — deep focus, a mix of both, or flexible — how you prefer
  to structure your sessions.
- **Energy pattern** — morning, afternoon, evening, or varies — when you're
  naturally at your best.
- **Stress sensitivity** — Sensitive, Balanced, or Resilient — how early
  warnings should surface for you specifically.
- **Recommendation mode** — general or task-based, explained in plain
  language right in the toggle so the choice is easy to make.
- **Recommendation display settings** — how many recommendations you see at
  once, and whether to only show ones with a clear action attached.

Changes save automatically in the background so there's no separate save button to remember.

---

### 4.6 Stats

The Stats screen is a straightforward, honest reflection of your recent
activity and current state.

It includes:

- **A summary row** — tasks done, your completion rate, your current streak,
  and average time spent per task.
- **Mental state gauges** — a live snapshot of stress, energy, focus,
  momentum, and confidence, shown as simple arc gauges alongside your
  current and best streaks.
- **A task outcomes chart** — a breakdown of completed, delayed, skipped,
  and still-pending tasks.
- **A weekly timeline** — a day-by-day bar chart of completions over the
  past week, with today highlighted.
- **A priority breakdown** — completed, delayed, and skipped counts grouped
  by priority level, designed specifically to help you notice if you tend to
  avoid your hardest tasks.

**Example:** if your priority breakdown shows that high-priority tasks are
skipped far more often than low-priority ones, that's a pattern worth
noticing and exactly the kind of thing this view is meant to surface at a
glance, rather than something you'd have to piece together yourself.

---

## 5. Why the app feels the way it does

A few intentional choices shape the overall experience:

- **Nothing nags.** Break prompts have a built-in cooldown, and the status
  bar's urgency always matches what's actually happening in your state.
- **Guidance is contextual, not generic.** The same action can produce
  different advice depending on what state you were already in.
- **You're always given a way in.** Even if a specific piece of feedback
  doesn't apply to what you just did, Mindframe falls back to a general
  recommendation rather than showing nothing.
- **Your stats are trustworthy.** They reflect exactly what happened, and there is no
  guesswork or no separate "estimated" numbers that could drift from reality.
- **You're in control of sensitivity.** Whether you want warnings early or
  late, and how many recommendations you see at once, is a personal setting.
