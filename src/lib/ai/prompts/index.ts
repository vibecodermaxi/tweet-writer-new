import { Brief, QualityCritique, UserProfile } from '@/lib/data/types';
import { QUALITY_CRITERIA, ALGORITHM_CRITERIA } from '@/lib/constants';

export function generateTweetPrompt(brief: Brief, profile: UserProfile): string {
  const formatInstructions = brief.format === 'long'
    ? `Write an extended long-form tweet (500-2000 characters). Structure it with:
- Clear paragraphs separated by line breaks
- A compelling opening hook
- Well-organized thoughts that flow naturally
- A strong conclusion or takeaway`
    : `Write a single tweet under 280 characters.`;

  return `You are a Twitter/X content creator with this profile:

**Target Audience**: ${profile.targetAudience}
**Personality**: ${profile.personality}
**Tone**: ${profile.toneOfVoice}
${profile.topicsExpertise ? `**Expertise**: ${profile.topicsExpertise}` : ''}

Write a tweet about: "${brief.topic}"

${formatInstructions}

Requirements:
1. Start with a strong hook that creates curiosity
2. Deliver clear value or insight
3. Sound authentic and human (not corporate or AI-like)
4. Use proper formatting with line breaks for readability
5. ${brief.ctaStyle !== 'none' ? `End with a ${brief.ctaStyle === 'engagement' ? 'question to drive engagement' : brief.ctaStyle === 'follow' ? '"follow for more" type CTA' : 'relevant link CTA'}` : 'No call-to-action needed'}

${brief.algorithmOptimization ? `
Additional algorithm optimization:
- First 1-2 lines should stop the scroll
- Include something save-worthy or shareable
- End with something that invites replies
` : ''}

Write ONLY the tweet content, no explanations or meta-commentary.`;
}

export function critiqueTweetPrompt(
  content: string,
  brief: Brief,
  algorithmOptimization: boolean
): string {
  const qualityCriteriaList = QUALITY_CRITERIA.map(c =>
    `- **${c.name}**: ${c.description}`
  ).join('\n');

  const algoCriteriaList = algorithmOptimization
    ? ALGORITHM_CRITERIA.map(c => `- **${c.name}**: ${c.description}`).join('\n')
    : '';

  return `Evaluate this ${brief.format === 'long' ? 'long-form tweet' : 'tweet'} against the quality criteria below.

**Tweet Content:**
${content}

**Quality Criteria (7 criteria):**
${qualityCriteriaList}

${algorithmOptimization ? `**Algorithm Optimization Criteria (6 additional criteria):**
${algoCriteriaList}
` : ''}

For EACH criterion, respond with:
1. The criterion name
2. PASS or FAIL
3. Brief explanation (1 sentence)

End with a Summary that includes:
- Total passing criteria
- The 1-2 biggest improvements needed (if any)

Format example:
Strong Hook: PASS - The opening line creates immediate curiosity about AI replacing doctors.
...
Summary: 6/7 criteria passed. Main improvement: Add a question at the end to boost engagement.`;
}

export function iterateTweetPrompt(
  content: string,
  critique: QualityCritique,
  brief: Brief,
  profile: UserProfile
): string {
  const failingCriteria = critique.criteria
    .filter(c => !c.passed)
    .map(c => `- **${c.name}**: ${c.feedback}`)
    .join('\n');

  const formatInstructions = brief.format === 'long'
    ? `Keep it as a long-form tweet (500-2000 characters) with clear paragraph structure.`
    : `Keep it as a single tweet under 280 characters.`;

  return `Improve this ${brief.format === 'long' ? 'long-form tweet' : 'tweet'} based on the critique feedback.

**Original Content:**
${content}

**Issues to Fix:**
${failingCriteria || 'Minor improvements needed for polish.'}

**Critique Summary:**
${critique.summary}

**Your Profile:**
- Target Audience: ${profile.targetAudience}
- Personality: ${profile.personality}
- Tone: ${profile.toneOfVoice}

**Instructions:**
${formatInstructions}

Focus on fixing the failing criteria while maintaining what already works. Sound human and authentic.

Write ONLY the improved tweet content, no explanations.`;
}
