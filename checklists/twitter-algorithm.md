# Twitter Algorithm Checklist

Optimization criteria based on X's algorithm scoring mechanism.

**Source**: [X Algorithm GitHub](https://github.com/xai-org/x-algorithm/tree/main)

---

## How the Algorithm Works

The For You feed uses a Grok-based transformer that predicts engagement probabilities. The goal is to maximize:

```
Final Score = Σ (weight × P(action))
```

**Positive signals** (maximize these):
- P(like) — immediate resonance
- P(reply) — conversation triggers
- P(repost) — share-worthy content
- P(quote) — content worth adding to
- P(click) — curiosity hooks
- P(dwell) — stops the scroll
- P(share) — off-platform worthy
- P(follow_author) — "I need more of this"

**Negative signals** (avoid these):
- P(not_interested) — boring, irrelevant
- P(block_author) — annoying, spammy
- P(mute_author) — too much, too often
- P(report) — rule-breaking vibes

---

## Algorithm Checklist (6 Criteria)

Evaluate each tweet/thread against these criteria. All must PASS for algorithm optimization to complete.

### 1. Hook Engineering (First 7 Words)

**What to check:**
- Pattern interrupt: breaks expectations
- Curiosity gap: opens a loop that demands closing
- Specificity: concrete over abstract ("$47M" not "millions")
- Contradiction: challenges assumed beliefs

**PASS if**: First line uses at least 2 of the above techniques
**FAIL if**: Opens with generic statement, "I" statement, or announcement language

**Examples:**
- PASS: "6 months ago we deleted our codebase and mass-resigned the team."
- FAIL: "We just launched our new product after 6 months of work"

---

### 2. Emotional Resonance

**Target high-arousal emotions that drive action:**
- Awe ("this changes everything")
- Anger (righteous, not toxic)
- Anxiety (FOMO, urgency)
- Surprise (unexpected reveals)
- Validation ("finally someone said it")

**Avoid low-arousal states:**
- Sadness
- Contentment
- Boredom

**PASS if**: Tweet triggers at least one high-arousal emotion
**FAIL if**: Tweet is emotionally flat or triggers low-arousal response

---

### 3. Reply Triggers

**Built-in conversation starters:**
- Hot takes that demand response
- Questions (real or rhetorical)
- Intentional incompleteness ("but there's a catch...")
- Rankings/lists that people want to argue with
- Polarizing framing on non-toxic topics

**PASS if**: Contains at least one clear reply trigger
**FAIL if**: No obvious reason for someone to reply

---

### 4. Repost Psychology

**Makes sharing identity-reinforcing:**
- "This is the kind of person I am"
- Makes the sharer look smart/informed/funny
- Tribal signaling without being exclusionary
- Quotable standalone value

**PASS if**: Someone would repost to signal something about themselves
**FAIL if**: Content is useful but not share-worthy (saved, not shared)

---

### 5. Dwell Time Optimization

**Rewards attention:**
- Information density that rewards re-reading
- Nested ideas that unfold
- Formatting that guides the eye (line breaks, spacing)
- Payoff that recontextualizes the hook

**PASS if**: Tweet rewards a second read or slow consumption
**FAIL if**: Tweet is fully consumed in one quick scan

---

### 6. Negative Signal Avoidance

**Never trigger:**
- Spam patterns (excessive hashtags, @mentions, links in first tweet)
- Engagement bait that feels manipulative ("RETWEET IF...")
- Rage bait that makes people want to mute
- Cringe that makes people embarrassed

**PASS if**: Clean of all spam patterns and manipulation tactics
**FAIL if**: Contains any of the above negative signals

---

## Critique Format

When running algorithm check, output in this format:

```
## Algorithm Optimization - Iteration [N]

| Criterion | Score | Notes |
|-----------|-------|-------|
| Hook Engineering | PASS/FAIL | [What works/doesn't in first 7 words] |
| Emotional Resonance | PASS/FAIL | [Which emotion triggered, or why flat] |
| Reply Triggers | PASS/FAIL | [What invites response, or what's missing] |
| Repost Psychology | PASS/FAIL | [Why someone would/wouldn't share] |
| Dwell Time | PASS/FAIL | [Information density assessment] |
| Negative Signals | PASS/FAIL | [Any spam/bait patterns detected] |

**Algorithm Score: [X/6]**

**Optimization focus**: [What to fix in next iteration]
```

---

## Optimization Principles

When rewriting to pass algorithm criteria:

1. **Write like a human, not a marketer**
2. **Lowercase is fine** if it fits the voice
3. **Short sentences. Punchy.**
4. **No cringe corporate-speak**
5. **Weird > boring. Specific > generic. Confident > hedging.**

## Transformation Example

**Before (algorithm-unfriendly):**
> We just launched our new product after 6 months of work

**After (algorithm-optimized):**
> 6 months ago we deleted our codebase and mass-resigned the team.
>
> today we mass-shipped.
>
> the product that almost killed us is now live.

**Why it works:**
- Pattern interrupt (unexpected action)
- Narrative tension
- "mass-" repetition creates rhythm
- Ends with stakes + payoff
- No links or hashtags
- Invites curiosity about the story

---

## Important Notes

- Algorithm optimization happens AFTER core quality checklist passes
- Never sacrifice human voice for algorithm gaming
- If optimization makes the tweet worse, skip it
- Max 3 algorithm iterations before accepting current version
