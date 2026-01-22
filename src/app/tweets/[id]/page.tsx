import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TweetCard } from '@/components/tweet/tweet-card';
import { getTweet } from '@/lib/actions/tweet';
import { ArrowLeft, Sparkles, RotateCcw, Calendar } from 'lucide-react';

interface TweetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TweetDetailPage({ params }: TweetDetailPageProps) {
  const { id } = await params;
  const tweet = await getTweet(id);

  if (!tweet) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/tweets">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Tweet Details</h1>
          <p className="text-muted-foreground">{tweet.title}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{tweet.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4" />
                {new Date(tweet.publishedAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {tweet.format === 'long' ? 'Long Tweet' : 'Short Tweet'}
              </Badge>
              <Badge variant="outline">
                Score: {tweet.finalScore}/7
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {tweet.content}
            </pre>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <RotateCcw className="h-4 w-4" />
              {tweet.iterations} iteration{tweet.iterations !== 1 ? 's' : ''}
            </div>
            {tweet.algorithmOptimized && (
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Algorithm optimized
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TweetCard tweet={tweet} showFullContent />
    </div>
  );
}
