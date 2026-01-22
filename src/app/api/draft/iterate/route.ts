import { NextRequest, NextResponse } from 'next/server';
import { getStorageAdapter } from '@/lib/data';
import { iterateTweet } from '@/lib/ai/client';
import { getProfile } from '@/lib/actions/profile';

export async function POST(request: NextRequest) {
  try {
    const { briefSlug } = await request.json();

    if (!briefSlug) {
      return NextResponse.json({ error: 'Brief slug is required' }, { status: 400 });
    }

    const storage = getStorageAdapter();
    const latestDraft = await storage.getLatestDraft(briefSlug);

    if (!latestDraft || !latestDraft.critique) {
      return NextResponse.json(
        { error: 'No draft with critique found' },
        { status: 404 }
      );
    }

    const brief = await storage.getBrief(briefSlug);
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
    }

    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Generate improved version
    const { content, usage } = await iterateTweet(
      latestDraft.content,
      latestDraft.critique,
      brief,
      profile
    );

    // Tweet count (always 1 for both short and long formats)
    const tweetCount = 1;

    // Save as new version
    const newDraft = await storage.saveDraft({
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
    });

    return NextResponse.json({
      success: true,
      content: newDraft.content,
      version: newDraft.version,
      usage: {
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
      },
    });
  } catch (error) {
    console.error('Error iterating draft:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to iterate draft' },
      { status: 500 }
    );
  }
}
