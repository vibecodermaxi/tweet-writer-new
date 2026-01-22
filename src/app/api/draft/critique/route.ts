import { NextRequest, NextResponse } from 'next/server';
import { getStorageAdapter } from '@/lib/data';
import { critiqueTweet } from '@/lib/ai/client';

export async function POST(request: NextRequest) {
  try {
    const { briefSlug, version } = await request.json();

    if (!briefSlug || version === undefined) {
      return NextResponse.json(
        { error: 'Brief slug and version are required' },
        { status: 400 }
      );
    }

    const storage = getStorageAdapter();
    const draft = await storage.getDraft(briefSlug, version);

    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    const brief = await storage.getBrief(briefSlug);
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
    }

    // Get the critique
    const { critique, usage } = await critiqueTweet(
      draft.content,
      brief,
      brief.algorithmOptimization
    );

    // Update the draft with critique
    await storage.saveDraft({
      ...draft,
      qualityScore: critique.baseScore,
      algorithmScore: critique.algorithmScore,
      critique,
    });

    // Extract passing and failing criteria names by category
    const baseCriteria = critique.criteria.filter(c => c.category === 'base');
    const algoCriteria = critique.criteria.filter(c => c.category === 'algorithm');

    const passingCriteria = critique.criteria
      .filter(c => c.passed)
      .map(c => c.name);
    const failingCriteria = critique.criteria
      .filter(c => !c.passed)
      .map(c => c.name);

    return NextResponse.json({
      success: true,
      baseScore: critique.baseScore,
      basePassing: critique.basePassing,
      algorithmScore: critique.algorithmScore,
      algorithmPassing: critique.algorithmPassing,
      overallPassing: critique.overallPassing,
      passingCriteria,
      failingCriteria,
      summary: critique.summary,
      usage: {
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
      },
    });
  } catch (error) {
    console.error('Error critiquing draft:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to critique draft' },
      { status: 500 }
    );
  }
}
