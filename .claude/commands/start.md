---
description: Set up your profile for rapid tweet creation
allowed-tools: [Write, AskUserQuestion]
model: haiku
---

# Start - Configure Your Tweet Profile

Set up your personal profile so you can skip the questions every time you use `/tweet`.

## Gather Profile Information

Use AskUserQuestion to gather the following information:

### 1. Target Audience

Ask: "Who is your primary target audience?"

Options:
- Tech/startup founders
- Developers/engineers
- Marketers/growth people
- General tech audience
- Other (let them specify)

### 2. Your Personality/Voice

Ask: "How would you describe your online personality?"

Options:
- Bold & provocative (strong opinions, not afraid to ruffle feathers)
- Casual & relatable (friendly, conversational, approachable)
- Expert & authoritative (thought leader, data-driven, credible)
- Witty & humorous (clever observations, self-deprecating, fun)
- Other (let them specify)

### 3. Tone of Voice

Ask: "What tone do you want your tweets to have?"

Options:
- Direct and punchy (short sentences, no fluff)
- Conversational and warm (like talking to a friend)
- Professional but accessible (smart but not stuffy)
- Edgy and contrarian (challenges conventional wisdom)
- Other (let them specify)

### 4. Topics/Expertise (Optional)

Ask: "What are your main topics or areas of expertise? (This helps make tweets more specific and credible)"

Free text response.

### 5. Default Format Preference

Ask: "What's your preferred tweet format?"

Options:
- Short tweets (quick hits, under 280 chars)
- Long tweets (in-depth posts with visual formatting)
- Mix of both (let me choose each time)

### 6. Default CTA Style

Ask: "What call-to-action style do you prefer?"

Options:
- Engagement-focused (ask questions, invite replies)
- Follow-focused (build the audience)
- Link/promo-focused (drive traffic)
- No CTA (let the content speak)
- Varies by tweet (ask me each time)

---

## Save Profile

After gathering all information, save to `UserInfo.md` in the project root:

```markdown
# Tweet Profile

## Target Audience
[Their answer]

## Personality
[Their answer]

## Tone of Voice
[Their answer]

## Topics/Expertise
[Their answer or "Not specified"]

## Default Format
[Their answer]

## Default CTA Style
[Their answer]

---

*Created: [Date]*
*Run /start again to update this profile.*
```

---

## Confirmation

After saving, output:

```
Profile saved to UserInfo.md

Your tweets will now be written for:
- Audience: [audience]
- Personality: [personality]
- Tone: [tone]

Run /tweet to start creating tweets with your profile!
```

---

## Begin

Start by welcoming the user and explaining this will set up their profile for faster tweet creation. Then ask the first question about target audience.
