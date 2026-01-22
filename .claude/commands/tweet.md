---
description: Write a short or long-form tweet with iterative quality improvement
argument-hint: [--max-iterations <n>] [--quality-bar <standard|high|flagship>]
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion]
model: sonnet
---

# Tweet Writer - Rapid Tweet Creation

You are starting a focused tweet writing session. Your goal is to produce a single high-quality tweet (short or long-form) through iterative improvement until it passes the quality checklist.

**IMPORTANT**: This workflow prioritizes RAPID creation. No web searches. Use your knowledge and the user's profile.

## Arguments

$ARGUMENTS

- `--max-iterations <n>`: Maximum drafts before stopping (default: 5)
- `--quality-bar <level>`: Quality threshold - "standard" (5/7), "high" (6/7), or "flagship" (7/7) (default: high)

---

## PHASE 1: LOAD PROFILE & DETERMINE TOPIC

### Step 1: Load User Profile

First, read `UserInfo.md` from the project root to get the user's:
- Target audience
- Personality/voice
- Tone of voice
- Topics/expertise
- Default format preference
- Default CTA style

If `UserInfo.md` doesn't exist, tell the user to run `/start` first to set up their profile, then stop.

### Step 2: Determine Topic

Check the arguments: `$ARGUMENTS`

**If arguments contain text** (e.g., `/tweet AI is overhyped`):
- Use that text directly as the topic
- Skip asking for topic

**If arguments are empty** (just `/tweet` with nothing after):
- Generate a random topic idea based on the user's Topics/Expertise from UserInfo.md
- Pick something timely, contrarian, or engagement-worthy
- Tell the user what topic you're writing about

### Step 3: Quick Questions (Minimal)

Only ask these if needed, using AskUserQuestion:

1. **Format** (only if their default is "Mix of both"):
   - Short or long?

2. **Algorithm Optimization**: Run Twitter algorithm optimization after quality check?
   - Options: Yes (optimize for reach), No (quality check only)

### Save the Brief

After determining topic, create a slug from it (lowercase, hyphens, no special chars).

Save the brief to `content/briefs/[slug]-brief.md`:

```markdown
# Tweet Brief: [Topic]

**Created**: [Date]
**Format**: [Short / Long]
**Target Audience**: [From UserInfo.md]
**Personality**: [From UserInfo.md]
**Tone**: [From UserInfo.md]
**CTA Style**: [From UserInfo.md]
**Algorithm Optimization**: [Yes/No]
**Topic Source**: [User-provided / Auto-generated]
```

---

## PHASE 2: QUALITY LOOP

Execute the tweet creation loop. Each iteration improves the draft until it passes the quality checklist.

### Quality Checklist (7 Criteria)

For each draft, evaluate against these criteria:

#### For Short Tweets:

| # | Criterion | What to Check |
|---|-----------|---------------|
| 1 | **Hook in first line** | Opens with something scroll-stopping: bold claim, question, surprising stat, or pattern interrupt |
| 2 | **Clear value prop** | Reader immediately knows what they'll get (insight, tip, take, story) |
| 3 | **No fluff** | Every word earns its place; no filler phrases or hedging |
| 4 | **Sounds human** | No AI patterns, corporate speak, or generic platitudes |
| 5 | **Engagement trigger** | Contains something reply-worthy: hot take, question, relatable moment, or controversy |
| 6 | **Character count** | Under 280 characters (ideally 200-250 for better engagement) |
| 7 | **Matches tone** | Voice matches the personality/tone from UserInfo.md |

#### For Long Tweets:

Long tweets use visual formatting (blank lines, bullets, > blockquotes, section breaks) to create rhythm and readability in a single post.

| # | Criterion | What to Check |
|---|-----------|---------------|
| 1 | **Hook is scroll-stopping** | First line makes people NEED to read the rest; teases value without giving it away |
| 2 | **Visual structure** | Uses blank lines, bullets, or > quotes to create scannable sections; easy on the eyes |
| 3 | **Progressive value delivery** | Each section adds new value; no repetition or padding |
| 4 | **Sounds human** | No AI patterns, corporate speak, or generic platitudes throughout |
| 5 | **Strong closer** | Final line has memorable punch, clear takeaway, or satisfying ending |
| 6 | **Right length** | Long enough to deliver value, short enough to hold attention (typically 800-2000 chars) |
| 7 | **Flow and pacing** | Logical progression; varied section lengths; good rhythm between dense and punchy |

**Scoring**: Each criterion is PASS or FAIL. Calculate total passes.

**Pass Thresholds**:
- `standard`: 5/7 or better
- `high`: 6/7 or better (default)
- `flagship`: 7/7

### Iteration Logic

```
FOR iteration = 1 TO max_iterations:

  IF iteration == 1:
    1. IDEATE: Based on the topic and user's profile, identify:
       - The hook that will stop the scroll
       - Unique angle (what makes this different from 1000 other tweets on this topic?)
       - Structure (for long tweets: the visual/narrative arc)
       - How to incorporate the user's personality and tone

    2. WRITE: Create first draft:
       - Lead with the hook
       - Front-load value
       - Cut ruthlessly (if it can be shorter, make it shorter)
       - Match the user's voice from UserInfo.md
       - End with engagement trigger or CTA matching their preferred style

  ELSE:
    1. Read previous draft and critique
    2. Identify the WEAKEST failing criterion
    3. Focus rewrite on fixing that criterion while maintaining passing criteria

    Iteration focus guide:
    - Draft 2: Usually hook strengthening or fluff removal
    - Draft 3: Voice/tone adjustment (make it sound more human)
    - Draft 4: Engagement optimization
    - Draft 5+: Targeted fixes for specific failing criteria

  SAVE draft to: content/drafts/[slug]-v[iteration].md

  Include metadata header in draft:
  ---
  draft: [iteration]
  date: [timestamp]
  format: [short/long]
  char_count: [count]
  quality_score: [X/7]
  passing_criteria: [list]
  failing_criteria: [list]
  ---

  RUN quality critique:
    - Evaluate each of the 7 criteria
    - Score as PASS or FAIL with brief reasoning
    - Calculate total score

  IF score >= threshold:
    BREAK loop - quality achieved
  ELSE:
    Log which criteria failed and why
    Plan targeted improvements for next iteration

  COMMIT: git add && git commit -m "draft: [slug] v[iteration] - [X/7] [brief summary]"

END FOR
```

### Critique Format

After each draft, output a critique in this format:

```
## Quality Critique - Draft [N]

| Criterion | Score | Notes |
|-----------|-------|-------|
| Hook | PASS/FAIL | [Brief reasoning] |
| Value/Structure | PASS/FAIL | [Brief reasoning] |
| No fluff/Progressive | PASS/FAIL | [Brief reasoning] |
| Sounds human | PASS/FAIL | [Brief reasoning] |
| Engagement/Closer | PASS/FAIL | [Brief reasoning] |
| Length | PASS/FAIL | [X chars] |
| Tone/Flow | PASS/FAIL | [Brief reasoning] |

**Overall: [X/7]** - [PASS/NEEDS WORK]

**Next iteration focus**: [What to fix]
```

---

## PHASE 2.5: ALGORITHM CHECK (Optional)

If the user selected "Yes" for Algorithm Optimization in Phase 1, run an additional optimization loop after the quality checklist passes.

### Algorithm Checklist

Read the algorithm criteria from `checklists/twitter-algorithm.md`.

For each criterion in the algorithm checklist:
1. Evaluate the current draft against it
2. Score as PASS or FAIL
3. If any FAIL, rewrite to optimize for failing criteria
4. Re-run quality checklist to ensure core quality isn't sacrificed
5. Repeat until algorithm checklist passes OR max 3 algorithm iterations

**Important**: Never sacrifice core quality (Phase 2 checklist) for algorithm optimization. If a change would cause a Phase 2 criterion to fail, don't make it.

---

## PHASE 3: OUTPUT

When the quality checklist passes (or max iterations reached):

### 1. Finalize Content

Create filename from first few words of tweet (lowercase, hyphens, no special chars, max 5-6 words).
Save to `content/tweets/[YYYY-MM-DD]/[first-few-words].md`

Example: If tweet starts "6 months ago we deleted our codebase..."
→ `content/tweets/2026-01-22/6-months-ago-we-deleted.md`

Format for short tweet:
```markdown
---
title: [Topic]
format: short
created: [Date]
iterations: [N]
final_score: [X/7]
algorithm_optimized: [Yes/No]
char_count: [Count]
---

[Tweet content here]
```

Format for long tweet:
```markdown
---
title: [Topic]
format: long
created: [Date]
iterations: [N]
final_score: [X/7]
algorithm_optimized: [Yes/No]
char_count: [Count]
---

[Full tweet content with visual formatting preserved]
```

### 2. Final Commit

```bash
git add content/tweets/[YYYY-MM-DD]/[first-few-words].md
git commit -m "tweet: [first few words] - [X/7] quality, [N] iterations"
```

### 3. Output Summary

Display completion message:

```
## Tweet Complete

**Topic**: [Topic]
**Format**: [Short / Long]
**File**: content/tweets/[YYYY-MM-DD]/[first-few-words].md

### Stats
- Iterations: [N]
- Final Score: [X/7]
- Algorithm Optimized: [Yes/No]
- Length: [X chars]

### Quality Breakdown
[Final critique summary]

### Ready to Post
[Display the final tweet content ready for copy-paste]
```

---

## Tweet Writing Principles

1. **Front-load value** - The hook is everything. If the first line doesn't stop the scroll, nothing else matters.
2. **Be specific** - "I grew my newsletter to 50K subscribers" beats "I grew my newsletter significantly"
3. **One idea per section** - Don't cram multiple thoughts into one block
4. **Cut ruthlessly** - If a word doesn't add value, delete it
5. **Sound like the user** - Match their personality and tone from UserInfo.md
6. **Create tension** - Questions, bold claims, and pattern interrupts drive engagement
7. **End with intent** - Every tweet should make the reader want to do something (reply, share, follow, click)

## Long Tweet Formatting Principles

1. **Use blank lines generously** - White space creates breathing room and makes content scannable
2. **Bullets for lists** - When you have 3+ related items, use bullets instead of comma-separated lists
3. **> Blockquotes for emphasis** - Use sparingly to highlight key insights or memorable lines
4. **Short paragraphs** - 1-3 sentences max per block; long paragraphs kill readability
5. **Vary the rhythm** - Mix short punchy lines with longer explanatory blocks
6. **The closer matters** - End with a bang, not a whimper (punchy line, memorable takeaway, or question)

## Common Mistakes to Avoid

- Starting with "I" (makes it about you, not them)
- Using "Here's what I learned:" (boring, overused opener)
- Padding with filler to hit a length
- Generic CTAs like "Follow for more content"
- Hedging language ("I think maybe possibly...")
- Corporate buzzwords and jargon
- Announcing what you're about to say instead of saying it
- Wall-of-text formatting (no visual breaks)

---

## Begin

Start by reading `UserInfo.md`. If it doesn't exist, tell them to run `/start` first.

If it exists:
1. Check if `$ARGUMENTS` has text → use it as the topic, start writing immediately
2. If `$ARGUMENTS` is empty → generate a random topic from their expertise, tell them what you're writing about, then start
