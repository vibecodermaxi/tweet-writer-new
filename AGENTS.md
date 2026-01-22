# AGENTS.md

Instructions for AI agents working with this Claude Code plugin.

## Plugin Overview

**Tweet Writer** is a Claude Code plugin for creating high-quality tweets and threads through iterative improvement.

## Available Commands

| Command | Description |
|---------|-------------|
| `/init` | Initialize directory structure |
| `/tweet` | Write a tweet or thread with quality iteration |

## Quality Checklist (7 Criteria)

### For Single Tweets:

1. **Hook in first line** - Opens with something scroll-stopping
2. **Clear value prop** - Reader immediately knows what they'll get
3. **No fluff** - Every word earns its place
4. **Sounds human** - No AI patterns or corporate speak
5. **Engagement trigger** - Contains something reply-worthy
6. **Character count** - Under 280 chars (ideally 200-250)
7. **Matches tone** - Voice matches what was requested

### For Threads:

1. **Hook tweet is scroll-stopping** - First tweet makes people NEED to read the rest
2. **Each tweet stands alone** - Every tweet works independently AND as part of thread
3. **Progressive value delivery** - Each tweet adds new value; no repetition
4. **Sounds human** - No AI patterns throughout
5. **Strong closer** - Final tweet has clear CTA or memorable ending
6. **Right length** - 8-10 tweets ideal; max 15; no tweet over 280 chars
7. **Flow and pacing** - Logical progression; varied lengths; good rhythm

## Iteration Logic

```
Draft 1: Research → Write initial version
Draft 2: Hook strengthening or fluff removal
Draft 3: Voice/tone adjustment (make it sound more human)
Draft 4: Engagement optimization
Draft 5+: Targeted fixes for specific failing criteria
```

## Algorithm Check (Optional)

When user selects "Yes" for Algorithm Optimization:
1. Read criteria from `checklists/twitter-algorithm.md`
2. Evaluate tweet against 6 algorithm criteria
3. Optimize without sacrificing core quality
4. Max 3 algorithm iterations

## File Naming

- Briefs: `content/briefs/[slug]-brief.md`
- Drafts: `content/drafts/[slug]-v[version].md`
- Final tweets: `content/tweets/[YYYY-MM-DD]/[first-few-words].md`

## Commit Convention

```
draft: [slug] v[N] - [X/7] [brief note]
tweet: [first few words] - [X/7] quality, [N] iterations
```

## Quality Thresholds

- `standard`: 5/7 or better
- `high`: 6/7 or better (default)
- `flagship`: 7/7

## Plugin Structure

```
tweet-writer/
├── .claude-plugin/plugin.json    # Manifest
├── commands/
│   ├── init.md                   # Initialize project
│   └── tweet.md                  # Write tweet/thread
├── skills/
│   ├── writer/SKILL.md           # Tweet writer skill
│   └── humanizer/SKILL.md        # AI pattern remover
├── checklists/
│   └── twitter-algorithm.md      # Algorithm optimization criteria
└── content/
    ├── briefs/                   # Tweet briefs
    ├── drafts/                   # Draft versions
    └── tweets/                   # Final tweets (organized by date)
        └── YYYY-MM-DD/           # Date folders
```
