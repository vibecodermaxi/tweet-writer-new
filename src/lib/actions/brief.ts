'use server';

import { redirect } from 'next/navigation';
import { getStorageAdapter, Brief } from '@/lib/data';
import { briefSchema, BriefFormData, generateSlug } from '@/lib/validators';
import { getProfile } from './profile';

export async function getBrief(slug: string): Promise<Brief | null> {
  const storage = getStorageAdapter();
  return storage.getBrief(slug);
}

export async function listBriefs(): Promise<Brief[]> {
  const storage = getStorageAdapter();
  return storage.listBriefs();
}

export async function createBrief(data: BriefFormData): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    const validated = briefSchema.parse(data);
    const profile = await getProfile();

    if (!profile) {
      return { success: false, error: 'Please set up your profile first' };
    }

    const storage = getStorageAdapter();
    const slug = generateSlug(validated.topic);

    // Check if brief with same slug exists
    const existingBrief = await storage.getBrief(slug);
    const finalSlug = existingBrief
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    const brief: Omit<Brief, 'id'> = {
      slug: finalSlug,
      topic: validated.topic,
      format: validated.format,
      algorithmOptimization: validated.algorithmOptimization,
      model: validated.model,
      targetAudience: profile.targetAudience,
      personality: profile.personality,
      tone: profile.toneOfVoice,
      ctaStyle: profile.defaultCtaStyle,
      topicSource: 'User-provided',
      createdAt: new Date().toISOString().split('T')[0],
    };

    await storage.saveBrief(brief);
    return { success: true, slug: finalSlug };
  } catch (error) {
    console.error('Error creating brief:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create brief',
    };
  }
}
