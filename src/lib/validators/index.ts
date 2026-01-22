import { z } from 'zod';

export const profileSchema = z.object({
  targetAudience: z.string().min(10, 'Please describe your target audience in more detail'),
  personality: z.string().min(3, 'Please describe your personality'),
  toneOfVoice: z.string().min(10, 'Please describe your tone of voice'),
  topicsExpertise: z.string().optional().nullable(),
  defaultFormat: z.enum(['short', 'long', 'mix']),
  defaultCtaStyle: z.enum(['engagement', 'follow', 'link', 'none', 'varies']),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const briefSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters'),
  format: z.enum(['short', 'long']),
  algorithmOptimization: z.boolean().default(false),
  model: z.string().min(1, 'Please select a model'),
});

export type BriefFormData = z.infer<typeof briefSchema>;

export const draftSchema = z.object({
  content: z.string().min(10, 'Draft content must be at least 10 characters'),
});

export type DraftFormData = z.infer<typeof draftSchema>;

// Slug generation helper
export function generateSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}
