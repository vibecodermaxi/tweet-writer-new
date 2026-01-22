# Tweet Writer

A **Claude Code Plugin** that creates high-quality tweets and threads through iterative self-improvement.

> "Anyone can generate 10 tweets. The hard part is generating 1 tweet that actually stops the scroll."

## The Problem with AI Tweets

Most AI writing tools optimize for speed. You get a tweet in 3 seconds, but it reads like... AI wrote it. Generic hooks, corporate buzzwords, no unique angle, claims without specifics.

**Tweet Writer takes a different approach**: write one tweet or thread at a time, critique it honestly, and iterate until it's actually good.

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                         THE QUALITY LOOP                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────────┐                                          │
│   │ GATHER REQUIREMENTS                                         │
│   │ Format, audience, goal, tone, CTA                           │
│   └────────┬─────────┘                                          │
│            ▼                                                    │
│   ┌──────────────────┐                                          │
│   │ RESEARCH                                                    │
│   │ Viral tweets, data, angles, examples                        │
│   └────────┬─────────┘                                          │
│            ▼                                                    │
│   ┌──────────────────┐                                          │
│   │ WRITE DRAFT                                                 │
│   │ Create version with hook + research                         │
│   └────────┬─────────┘                                          │
│            ▼                                                    │
│   ┌──────────────────┐                                          │
│   │ CRITIQUE (7-Point Checklist)                                │
│   │ Honest self-evaluation against quality criteria             │
│   └────────┬─────────┘                                          │
│            │                                                    │
│            ▼                                                    │
│       Score < 6/7? ───Yes───► ITERATE (fix weakest criterion)   │
│            │                        │                           │
│            No                       │                           │
│            │                        │                           │
│            ▼                        │                           │
│   ┌──────────────────┐              │                           │
│   │ (Optional) ALGORITHM CHECK      │                           │
│   │ Optimize for Twitter algo  ◄────┘                           │
│   └────────┬─────────┘                                          │
│            ▼                                                    │
│   ┌──────────────────┐                                          │
│   │ PUBLISH                                                     │
│   │ Save final, ready to post                                   │
│   └──────────────────┘                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## The 7-Point Quality Checklist

### For Single Tweets:

| #   | Criterion              | What It Checks                                                  |
| --- | ---------------------- | --------------------------------------------------------------- |
| 1   | **Hook in first line** | Opens with something scroll-stopping                            |
| 2   | **Clear value prop**   | Reader immediately knows what they'll get                       |
| 3   | **No fluff**           | Every word earns its place                                      |
| 4   | **Sounds human**       | No AI patterns or corporate speak                               |
| 5   | **Engagement trigger** | Contains something reply-worthy                                 |
| 6   | **Character count**    | Under 280 chars (ideally 200-250)                               |
| 7   | **Matches tone**       | Voice matches what was requested                                |

### For Threads:

| #   | Criterion                      | What It Checks                                                  |
| --- | ------------------------------ | --------------------------------------------------------------- |
| 1   | **Hook tweet is scroll-stopping** | First tweet makes people NEED to read the rest               |
| 2   | **Each tweet stands alone**    | Every tweet makes sense independently AND as part of thread     |
| 3   | **Progressive value delivery** | Each tweet adds new value; no repetition                        |
| 4   | **Sounds human**               | No AI patterns throughout                                       |
| 5   | **Strong closer**              | Final tweet has clear CTA or memorable ending                   |
| 6   | **Right length**               | 8-10 tweets ideal; max 15; no tweet over 280 chars              |
| 7   | **Flow and pacing**            | Logical progression; varied lengths; good rhythm                |

**Quality Thresholds:**

- `standard`: 5/7 passing
- `high` (default): 6/7 passing
- `flagship`: 7/7 passing (perfect score)

---

## Installation

```bash
# Add the plugin to Claude Code
claude /plugin add tweet-writer
```

## Commands

| Command                 | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `/init`                 | Create directory structure for tweet projects             |
| `/tweet "topic"`        | Write a single tweet or thread with iterative quality     |

---

## Usage Options

```bash
# Basic usage - asks format, topic, audience, tone, and algorithm optimization
/tweet "Why AI agents are overhyped"

# Flagship quality - requires perfect 7/7 score
/tweet --quality-bar flagship "Hot take on the tech layoffs"

# More iterations allowed
/tweet --max-iterations 7 "Complete breakdown of startup fundraising"
```

The command will ask you:
1. Single tweet or thread?
2. Target audience
3. Goal
4. Key points (optional)
5. Tone/style
6. Call to action (optional)
7. **Algorithm optimization?** (Yes/No)

---

## Algorithm Optimization

When you select "Yes" for algorithm optimization, an additional loop runs after the quality checklist passes:

1. Evaluates tweet against 6 algorithm criteria (hook engineering, emotional resonance, reply triggers, repost psychology, dwell time, negative signal avoidance)
2. Optimizes without sacrificing core quality
3. Runs up to 3 additional iterations

---

## Output Structure

Tweets are saved by date with filename from first few words:

```
content/
├── briefs/
│   └── ai-agents-overhyped-brief.md
├── drafts/
│   ├── ai-agents-overhyped-v1.md
│   └── ai-agents-overhyped-v2.md
└── tweets/
    └── 2026-01-22/
        └── why-ai-agents-are.md

checklists/
└── twitter-algorithm.md
```

---

## Tweet Writing Principles

1. **Front-load value** - The hook is everything
2. **Be specific** - "50K subscribers" beats "many subscribers"
3. **One idea per tweet** - Don't cram
4. **Cut ruthlessly** - If a word doesn't add value, delete it
5. **Sound like yourself** - Generic = invisible
6. **Create tension** - Questions and bold claims drive engagement
7. **End with intent** - Make them want to do something

## Thread-Specific Principles

1. **The hook tweet is an ad for the thread** - It sells the click
2. **Each tweet should make them want the next**
3. **Vary the rhythm** - Mix short and long tweets
4. **Number your tweets** - "1/" format helps readers follow
5. **The closer matters** - End with a bang

## Common Mistakes to Avoid

- Starting with "I"
- Using "In this thread"
- Padding with filler tweets
- Generic CTAs like "Follow for more"
- Hedging language
- Corporate buzzwords
- Announcing what you're about to say instead of saying it

---

## Skills

### Tweet Writer Skill

Triggered by: "write a tweet", "create a thread", "tweet about", "help me tweet"

The main tweet creation skill with the full quality loop.

### Humanizer Skill

Triggered by: editing or reviewing text

Removes common AI writing patterns to make tweets sound more human.

---

## Philosophy

**Quality over quantity.** One viral tweet is worth more than 100 forgettable ones.

**Honest self-critique.** The quality loop only works if the critique is genuine.

**Targeted iteration.** Each revision focuses on the weakest criterion, not a full rewrite.

**Human voice is critical.** AI patterns kill engagement.

---

## License

MIT
# tweet-writer
# tweet-writer-new
