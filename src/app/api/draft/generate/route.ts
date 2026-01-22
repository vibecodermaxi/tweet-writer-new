import { NextRequest, NextResponse } from 'next/server';
import { getStorageAdapter } from '@/lib/data';
import { generateTweet } from '@/lib/ai/client';
import { getProfile } from '@/lib/actions/profile';

export async function POST(request: NextRequest) {
  try {
    const { briefSlug } = await request.json();

    if (!briefSlug) {
      return NextResponse.json({ error: 'Brief slug is required' }, { status: 400 });
    }

    const storage = getStorageAdapter();
    const brief = await storage.getBrief(briefSlug);

    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
    }

    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Generate the tweet content
    const { content, usage } = await generateTweet(brief, profile);

    // Tweet count (always 1 for both short and long formats)
    const tweetCount = 1;

    // Save the draft
    const draft = await storage.saveDraft({
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
    });

    return NextResponse.json({
      success: true,
      content: draft.content,
      version: draft.version,
      usage: {
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
      },
    });
  } catch (error) {
    console.error('Error generating draft:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate draft' },
      { status: 500 }
    );
  }
}
