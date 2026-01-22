import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProfile } from '@/lib/actions/profile';
import { listBriefs } from '@/lib/actions/brief';
import { listTweets } from '@/lib/actions/tweet';
import { PenLine, FileText, Archive, User, ArrowRight } from 'lucide-react';

export default async function DashboardPage() {
  const [profile, briefs, tweets] = await Promise.all([
    getProfile(),
    listBriefs(),
    listTweets({ limit: 5 }),
  ]);

  const recentBriefs = briefs.slice(0, 3);
  const hasProfile = !!profile;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage your tweets with AI assistance
        </p>
      </div>

      {!hasProfile && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Set Up Your Profile
            </CardTitle>
            <CardDescription>
              Create your profile to personalize tweet generation based on your audience and style.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/profile">
              <Button>
                Create Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5" />
              Create Tweet
            </CardTitle>
            <CardDescription>
              Start a new short or long-form tweet with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/create">
              <Button className="w-full" disabled={!hasProfile}>
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Drafts
            </CardTitle>
            <CardDescription>
              {recentBriefs.length} active draft{recentBriefs.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentBriefs.length > 0 ? (
              <ul className="space-y-2">
                {recentBriefs.map((brief) => (
                  <li key={brief.slug}>
                    <Link
                      href={`/drafts/${brief.slug}`}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
                    >
                      <span className="truncate text-sm">{brief.topic}</span>
                      <Badge variant="secondary">
                        {brief.format === 'long' ? 'Long' : 'Short'}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No drafts yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Published Tweets
            </CardTitle>
            <CardDescription>
              {tweets.length} tweet{tweets.length !== 1 ? 's' : ''} published
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tweets.length > 0 ? (
              <ul className="space-y-2">
                {tweets.slice(0, 3).map((tweet) => (
                  <li key={tweet.id}>
                    <Link
                      href={`/tweets/${tweet.id}`}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
                    >
                      <span className="truncate text-sm">{tweet.title}</span>
                      <Badge variant="outline">{tweet.finalScore}/7</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No tweets published yet</p>
            )}
            {tweets.length > 3 && (
              <Link href="/tweets" className="mt-2 inline-block text-sm text-primary hover:underline">
                View all tweets
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {hasProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Configured for {profile.targetAudience.slice(0, 50)}...
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-medium">Personality</p>
              <p className="text-sm text-muted-foreground">{profile.personality}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Default Format</p>
              <p className="text-sm text-muted-foreground capitalize">
                {profile.defaultFormat === 'mix' ? 'Mix of both' : profile.defaultFormat}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">CTA Style</p>
              <p className="text-sm text-muted-foreground capitalize">
                {profile.defaultCtaStyle === 'none' ? 'No CTA' : profile.defaultCtaStyle}
              </p>
            </div>
            <div className="flex items-end">
              <Link href="/profile">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
