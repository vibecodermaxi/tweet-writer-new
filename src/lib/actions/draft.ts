'use server';

import { revalidatePath } from 'next/cache';
import { getStorageAdapter, Draft, Tweet } from '@/lib/data';
import { getBrief } from './brief';
import { getProfile } from './profile';
import { generateTweet, critiqueTweet, iterateTweet } from '@/lib/ai/client';

export async function getDraft(slug: string, version: number): Promise<Draft | null> {
  const storage = getStorageAdapter();
  return storage.getDraft(slug, version);
}

export async function getDraftsByBrief(briefSlug: string): Promise<Draft[]> {
  const storage = getStorageAdapter();
  return storage.getDraftsByBrief(briefSlug);
}

export async function getLatestDraft(briefSlug: string): Promise<Draft | null> {
  const storage = getStorageAdapter();
  return storage.getLatestDraft(briefSlug);
}

export async function generateFirstDraft(briefSlug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const brief = await getBrief(briefSlug);
    if (!brief) {
      return { success: false, error: 'Brief not found' };
    }

    const profile = await getProfile();
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    const storage = getStorageAdapter();

    // Generate the tweet content
    const { content } = await generateTweet(brief, profile);

    // Tweet count (always 1 for both short and long formats)
    const tweetCount = 1;

    // Save the draft
    const draft: Omit<Draft, 'id'> = {
      briefId: briefSlug,
      slug: briefSlug,
      version: 1,
      content,
      format: brief.format,
      tweetCount,
      qualityScore: null,
      algorithmScore: null,
      critique: null,
      createdAt: new Date().toISOString().split('T')[0],
    };

    await storage.saveDraft(draft);
    revalidatePath(`/drafts/${briefSlug}`);

    return { success: true };
  } catch (error) {
    console.error('Error generating draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate draft',
    };
  }
}

export async function critiqueDraft(briefSlug: string, version: number): Promise<{ success: boolean; error?: string }> {
  try {
    const storage = getStorageAdapter();
    const draft = await storage.getDraft(briefSlug, version);
    if (!draft) {
      return { success: false, error: 'Draft not found' };
    }

    const brief = await getBrief(briefSlug);
    if (!brief) {
      return { success: false, error: 'Brief not found' };
    }

    // Get the critique
    const { critique } = await critiqueTweet(draft.content, brief, brief.algorithmOptimization);

    // Update the draft with critique
    const updatedDraft: Omit<Draft, 'id'> = {
      ...draft,
      qualityScore: critique.baseScore,
      algorithmScore: critique.algorithmScore,
      critique,
    };

    await storage.saveDraft(updatedDraft);
    revalidatePath(`/drafts/${briefSlug}`);

    return { success: true };
  } catch (error) {
    console.error('Error critiquing draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to critique draft',
    };
  }
}

export async function iterateDraft(briefSlug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const storage = getStorageAdapter();
    const latestDraft = await storage.getLatestDraft(briefSlug);
    if (!latestDraft || !latestDraft.critique) {
      return { success: false, error: 'No draft with critique found' };
    }

    const brief = await getBrief(briefSlug);
    if (!brief) {
      return { success: false, error: 'Brief not found' };
    }

    const profile = await getProfile();
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    // Generate improved version
    const { content } = await iterateTweet(
      latestDraft.content,
      latestDraft.critique,
      brief,
      profile
    );

    // Tweet count (always 1 for both short and long formats)
    const tweetCount = 1;

    // Save as new version
    const newDraft: Omit<Draft, 'id'> = {
      briefId: briefSlug,
      slug: briefSlug,
      version: latestDraft.version + 1,
      content,
      format: brief.format,
      tweetCount,
      qualityScore: null,
      algorithmScore: null,
      critique: null,
      createdAt: new Date().toISOString().split('T')[0],
    };

    await storage.saveDraft(newDraft);
    revalidatePath(`/drafts/${briefSlug}`);

    return { success: true };
  } catch (error) {
    console.error('Error iterating draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to iterate draft',
    };
  }
}

export async function saveDraftContent(
  briefSlug: string,
  version: number,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const storage = getStorageAdapter();
    const draft = await storage.getDraft(briefSlug, version);
    if (!draft) {
      return { success: false, error: 'Draft not found' };
    }

    // Tweet count (always 1 for both short and long formats)
    const tweetCount = 1;

    const updatedDraft: Omit<Draft, 'id'> = {
      ...draft,
      content,
      tweetCount,
      // Reset critique when content changes
      qualityScore: null,
      algorithmScore: null,
      critique: null,
    };

    await storage.saveDraft(updatedDraft);
    revalidatePath(`/drafts/${briefSlug}`);

    return { success: true };
  } catch (error) {
    console.error('Error saving draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save draft',
    };
  }
}

export async function publishDraft(briefSlug: string): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  try {
    const storage = getStorageAdapter();
    const latestDraft = await storage.getLatestDraft(briefSlug);
    if (!latestDraft) {
      return { success: false, error: 'No draft found' };
    }

    const brief = await getBrief(briefSlug);
    if (!brief) {
      return { success: false, error: 'Brief not found' };
    }

    const tweet: Omit<Tweet, 'id'> = {
      briefId: briefSlug,
      title: brief.topic,
      content: latestDraft.content,
      format: brief.format,
      iterations: latestDraft.version,
      finalScore: latestDraft.qualityScore || 0,
      algorithmOptimized: brief.algorithmOptimization,
      publishedAt: new Date().toISOString(),
    };

    const savedTweet = await storage.saveTweet(tweet);
    revalidatePath('/tweets');
    revalidatePath('/');

    return { success: true, tweetId: savedTweet.id };
  } catch (error) {
    console.error('Error publishing draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to publish draft',
    };
  }
}
