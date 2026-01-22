import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DraftEditor } from '@/components/draft/draft-editor';
import { getBrief } from '@/lib/actions/brief';
import { getDraftsByBrief, getLatestDraft } from '@/lib/actions/draft';
import { ArrowLeft } from 'lucide-react';

interface DraftPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DraftPage({ params }: DraftPageProps) {
  const { slug } = await params;

  const [brief, drafts] = await Promise.all([
    getBrief(slug),
    getDraftsByBrief(slug),
  ]);

  if (!brief) {
    notFound();
  }

  const latestDraft = drafts[drafts.length - 1];

  if (!latestDraft) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/drafts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Draft</h1>
          <p className="text-muted-foreground">
            Version {latestDraft.version} • {drafts.length} total version{drafts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <DraftEditor
        brief={brief}
        drafts={drafts}
        initialDraft={latestDraft}
      />
    </div>
  );
}
