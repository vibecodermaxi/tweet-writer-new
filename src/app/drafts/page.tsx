import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { listBriefs } from '@/lib/actions/brief';
import { PenLine, ArrowRight } from 'lucide-react';

export default async function DraftsPage() {
  const briefs = await listBriefs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Drafts</h1>
          <p className="text-muted-foreground mt-1">
            Continue working on your tweet drafts
          </p>
        </div>
        <Link href="/create">
          <Button>
            <PenLine className="mr-2 h-4 w-4" />
            New Tweet
          </Button>
        </Link>
      </div>

      {briefs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <PenLine className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">No drafts yet</h2>
            <p className="mt-2 text-muted-foreground">
              Create your first tweet to get started
            </p>
            <Link href="/create">
              <Button className="mt-4">
                Create Tweet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {briefs.map((brief) => (
            <Link key={brief.slug} href={`/drafts/${brief.slug}`}>
              <Card className="h-full transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base">
                      {brief.topic}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {brief.format === 'long' ? 'Long' : 'Short'}
                    </Badge>
                  </div>
                  <CardDescription>
                    Created {brief.createdAt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {brief.algorithmOptimization && (
                      <Badge variant="outline" className="text-xs">
                        Algo Optimized
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
