export const QUALITY_CRITERIA = [
  {
    id: 'strong-hook',
    name: 'Strong Hook',
    description: 'First line immediately grabs attention and creates curiosity',
  },
  {
    id: 'clear-point',
    name: 'Clear Single Point',
    description: 'Delivers ONE clear insight, opinion, or takeaway',
  },
  {
    id: 'authentic-voice',
    name: 'Authentic Voice',
    description: 'Sounds like a real person, not corporate or AI-generated',
  },
  {
    id: 'value-delivery',
    name: 'Value Delivery',
    description: 'Reader gains insight, entertainment, or actionable info',
  },
  {
    id: 'formatting',
    name: 'Proper Formatting',
    description: 'Uses line breaks, spacing, and structure effectively',
  },
  {
    id: 'engagement-worthy',
    name: 'Engagement Worthy',
    description: 'Naturally prompts likes, replies, or retweets',
  },
  {
    id: 'length-appropriate',
    name: 'Length Appropriate',
    description: 'Not too wordy, respects character limits',
  },
] as const;

export const ALGORITHM_CRITERIA = [
  {
    id: 'early-engagement',
    name: 'Early Engagement Hook',
    description: 'First 1-2 lines designed to stop the scroll',
  },
  {
    id: 'reply-bait',
    name: 'Reply Bait',
    description: 'Ends with question or controversial take that invites response',
  },
  {
    id: 'save-worthy',
    name: 'Save-Worthy',
    description: 'Contains actionable info people want to reference later',
  },
  {
    id: 'shareable',
    name: 'Shareable',
    description: 'Makes reader look smart/insightful when they share it',
  },
  {
    id: 'structure-flow',
    name: 'Structure & Flow',
    description: 'Ideas flow logically with clear transitions',
  },
  {
    id: 'timing-neutral',
    name: 'Timing Neutral',
    description: 'Not dependent on current events (evergreen)',
  },
] as const;

// Must pass ALL base criteria (7/7)
export const MIN_QUALITY_SCORE = 7;
export const TOTAL_BASE_CRITERIA = QUALITY_CRITERIA.length; // 7

// Must pass ALL algorithm criteria (6/6) when enabled
export const MIN_ALGO_SCORE = 6;
export const TOTAL_ALGO_CRITERIA = ALGORITHM_CRITERIA.length; // 6

export const TWEET_CHAR_LIMIT = 280;
export const LONG_TWEET_CHAR_LIMIT = 25000; // X Premium long-form tweets

export const FORMAT_OPTIONS = [
  { value: 'short', label: 'Short Tweet', description: 'Concise, under 280 characters' },
  { value: 'long', label: 'Long Tweet', description: 'Extended form for deeper topics (X Premium)' },
] as const;

export const CTA_STYLE_OPTIONS = [
  { value: 'engagement', label: 'Engagement', description: 'Ask questions to drive replies' },
  { value: 'follow', label: 'Follow CTA', description: 'Encourage follows for more content' },
  { value: 'link', label: 'Link', description: 'Drive traffic to a resource' },
  { value: 'none', label: 'No CTA', description: 'Let the content speak for itself' },
  { value: 'varies', label: 'Varies', description: 'Different CTAs for different tweets' },
] as const;

// OpenRouter model options - optimized for creative writing
// Pricing in USD per 1M tokens
export const MODEL_OPTIONS = [
  {
    value: 'google/gemini-3-flash-preview',
    label: 'Gemini 3 Flash',
    description: '#3 creative writing, best value',
    provider: 'Google',
    inputPrice: 0.50,
    outputPrice: 3.00,
  },
  {
    value: 'google/gemini-3-pro-preview',
    label: 'Gemini 3 Pro',
    description: '#1 creative writing, premium quality',
    provider: 'Google',
    inputPrice: 1.25,
    outputPrice: 5.00,
  },
  {
    value: 'anthropic/claude-opus-4.5',
    label: 'Claude Opus 4.5',
    description: '#2 creative writing, natural voice',
    provider: 'Anthropic',
    inputPrice: 5.00,
    outputPrice: 25.00,
  },
  {
    value: 'x-ai/grok-4-fast',
    label: 'Grok 4 Fast',
    description: 'Fast and affordable, 2M context',
    provider: 'xAI',
    inputPrice: 0.20,
    outputPrice: 0.50,
  },
] as const;

export const DEFAULT_MODEL = 'google/gemini-3-flash-preview';

// Helper to get model pricing
export function getModelPricing(modelValue: string) {
  const model = MODEL_OPTIONS.find(m => m.value === modelValue);
  return model
    ? { inputPrice: model.inputPrice, outputPrice: model.outputPrice }
    : { inputPrice: 0, outputPrice: 0 };
}
