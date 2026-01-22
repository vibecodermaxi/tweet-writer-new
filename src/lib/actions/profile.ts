'use server';

import { revalidatePath } from 'next/cache';
import { getStorageAdapter, UserProfile } from '@/lib/data';
import { profileSchema, ProfileFormData } from '@/lib/validators';
import { getCurrentUserId } from '@/lib/auth';

export async function getProfile(): Promise<UserProfile | null> {
  const storage = getStorageAdapter();
  const userId = await getCurrentUserId();
  return storage.getProfile(userId);
}

export async function saveProfile(data: ProfileFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = profileSchema.parse(data);
    const storage = getStorageAdapter();

    const profile: Omit<UserProfile, 'id'> = {
      targetAudience: validated.targetAudience,
      personality: validated.personality,
      toneOfVoice: validated.toneOfVoice,
      topicsExpertise: validated.topicsExpertise || null,
      defaultFormat: validated.defaultFormat,
      defaultCtaStyle: validated.defaultCtaStyle,
      createdAt: new Date().toISOString().split('T')[0],
    };

    await storage.saveProfile(profile);
    revalidatePath('/profile');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error saving profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save profile',
    };
  }
}
