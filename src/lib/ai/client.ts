import OpenAI from 'openai';
import { Brief, QualityCritique, QualityCriterion, UserProfile } from '@/lib/data/types';
import {
  QUALITY_CRITERIA,
  ALGORITHM_CRITERIA,
  DEFAULT_MODEL,
  MIN_QUALITY_SCORE,
  MIN_ALGO_SCORE,
} from '@/lib/constants';
import { generateTweetPrompt, critiqueTweetPrompt, iterateTweetPrompt } from './prompts';

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface GenerateResult {
  content: string;
  usage: TokenUsage;
}

export interface CritiqueResult {
  critique: QualityCritique;
  usage: TokenUsage;
}

// Lazy initialization of OpenRouter client
let openrouterClient: OpenAI | null = null;

function getOpenRouterClient(): OpenAI {
  if (!openrouterClient) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY environment variable is required');
    }
    openrouterClient = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': 'Tweet Writer',
      },
    });
  }
  return openrouterClient;
}

interface OpenRouterResponse {
  content: string;
  usage: TokenUsage;
}

async function callOpenRouter(
  prompt: string,
  model: string = DEFAULT_MODEL
): Promise<OpenRouterResponse> {
  const client = getOpenRouterClient();
  const completion = await client.chat.completions.create({
    model,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response content from model');
  }

  const usage: TokenUsage = {
    promptTokens: completion.usage?.prompt_tokens ?? 0,
    completionTokens: completion.usage?.completion_tokens ?? 0,
    totalTokens: completion.usage?.total_tokens ?? 0,
  };

  return { content, usage };
}

export async function generateTweet(
  brief: Brief,
  profile: UserProfile
): Promise<GenerateResult> {
  const prompt = generateTweetPrompt(brief, profile);
  const { content, usage } = await callOpenRouter(prompt, brief.model);
  return { content, usage };
}

export async function critiqueTweet(
  content: string,
  brief: Brief,
  algorithmOptimization: boolean
): Promise<CritiqueResult> {
  const prompt = critiqueTweetPrompt(content, brief, algorithmOptimization);
  const { content: response, usage } = await callOpenRouter(prompt, brief.model);
  const critique = parseCritique(response, algorithmOptimization);
  return { critique, usage };
}

export async function iterateTweet(
  content: string,
  critique: QualityCritique,
  brief: Brief,
  profile: UserProfile
): Promise<GenerateResult> {
  const prompt = iterateTweetPrompt(content, critique, brief, profile);
  const { content: newContent, usage } = await callOpenRouter(prompt, brief.model);
  return { content: newContent, usage };
}

function parseCritique(response: string, includeAlgo: boolean): QualityCritique {
  // Parse base quality criteria
  const baseCriteria: QualityCriterion[] = QUALITY_CRITERIA.map(c => {
    const passRegex = new RegExp(`${c.name}.*?(PASS|FAIL)`, 'i');
    const match = response.match(passRegex);
    const passed = match ? match[1].toUpperCase() === 'PASS' : false;

    // Try to extract feedback
    const feedbackRegex = new RegExp(`${c.name}[^:]*:?\\s*([^\\n]+)`, 'i');
    const feedbackMatch = response.match(feedbackRegex);
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : '';

    return {
      name: c.name,
      passed,
      feedback,
      category: 'base' as const,
    };
  });

  // Parse algorithm criteria if enabled
  const algoCriteria: QualityCriterion[] = includeAlgo
    ? ALGORITHM_CRITERIA.map(c => {
        const passRegex = new RegExp(`${c.name}.*?(PASS|FAIL)`, 'i');
        const match = response.match(passRegex);
        const passed = match ? match[1].toUpperCase() === 'PASS' : false;

        const feedbackRegex = new RegExp(`${c.name}[^:]*:?\\s*([^\\n]+)`, 'i');
        const feedbackMatch = response.match(feedbackRegex);
        const feedback = feedbackMatch ? feedbackMatch[1].trim() : '';

        return {
          name: c.name,
          passed,
          feedback,
          category: 'algorithm' as const,
        };
      })
    : [];

  // Combine all criteria
  const criteria = [...baseCriteria, ...algoCriteria];

  // Calculate scores
  const baseScore = baseCriteria.filter(c => c.passed).length;
  const basePassing = baseScore >= MIN_QUALITY_SCORE;

  const algorithmScore = includeAlgo
    ? algoCriteria.filter(c => c.passed).length
    : null;
  const algorithmPassing = includeAlgo
    ? algorithmScore !== null && algorithmScore >= MIN_ALGO_SCORE
    : null;

  // Overall passing: base must pass, and if algo enabled, algo must pass too
  const overallPassing = basePassing && (algorithmPassing === null || algorithmPassing);

  // Extract summary if present
  const summaryMatch = response.match(/Summary:?\s*([^\n]+(?:\n[^\n]+)*)/i);
  const summary = summaryMatch
    ? summaryMatch[1].trim()
    : includeAlgo
    ? `Base: ${baseScore}/${QUALITY_CRITERIA.length}, Algorithm: ${algorithmScore}/${ALGORITHM_CRITERIA.length}`
    : `${baseScore}/${QUALITY_CRITERIA.length} criteria passed`;

  return {
    criteria,
    baseScore,
    basePassing,
    algorithmScore,
    algorithmPassing,
    overallPassing,
    summary,
  };
}
