import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TweetCard } from '@/components/tweet/tweet-card';
import { listTweets } from '@/lib/actions/tweet';
import { PenLine, ArrowRight, Archive } from 'lucide-react';

export default async function TweetsPage() {
  const tweets = await listTweets();

  // Group tweets by date
  const groupedTweets = tweets.reduce((acc, tweet) => {
    const date = new Date(tweet.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(tweet);
    return acc;
  }, {} as Record<string, typeof tweets>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tweet Archive</h1>
          <p className="text-muted-foreground mt-1">
            {tweets.length} published tweet{tweets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/create">
          <Button>
            <PenLine className="mr-2 h-4 w-4" />
            New Tweet
          </Button>
        </Link>
      </div>

      {tweets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Archive className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">No published tweets yet</h2>
            <p className="mt-2 text-muted-foreground">
              Create and publish your first tweet to see it here
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
        <div className="space-y-8">
          {Object.entries(groupedTweets).map(([date, dateTweets]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold mb-4">{date}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dateTweets.map((tweet) => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
