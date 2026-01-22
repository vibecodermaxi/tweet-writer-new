import { notFound } from 'next/navigation';
import { AutoRefineLoop } from '@/components/create/auto-refine-loop';
import { getBrief } from '@/lib/actions/brief';

interface RefiningPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RefiningPage({ params }: RefiningPageProps) {
  const { slug } = await params;
  const brief = await getBrief(slug);

  if (!brief) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Generating & Refining</h1>
        <p className="text-muted-foreground mt-1">
          AI is creating and improving your tweet until it meets quality standards
        </p>
      </div>

      <AutoRefineLoop
        briefSlug={brief.slug}
        topic={brief.topic}
        model={brief.model}
        format={brief.format}
        algorithmOptimization={brief.algorithmOptimization}
        maxIterations={5}
      />
    </div>
  );
}
