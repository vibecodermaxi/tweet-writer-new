'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tweet } from '@/lib/data/types';
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface TweetCardProps {
  tweet: Tweet;
  showFullContent?: boolean;
}

export function TweetCard({ tweet, showFullContent = false }: TweetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(tweet.content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const displayContent = showFullContent
    ? tweet.content
    : tweet.content.slice(0, 200) + (tweet.content.length > 200 ? '...' : '');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-1">{tweet.title}</CardTitle>
          <Badge variant="outline" className="shrink-0">
            {tweet.finalScore}/7
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{new Date(tweet.publishedAt).toLocaleDateString()}</span>
          <span>•</span>
          <Badge variant="secondary" className="text-xs">
            {tweet.format === 'long' ? 'Long' : 'Short'}
          </Badge>
          {tweet.algorithmOptimized && (
            <>
              <span>•</span>
              <Sparkles className="h-3 w-3" />
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {displayContent}
        </p>
      </CardContent>
      <CardFooter className="pt-2 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="gap-1"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-600" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </Button>
        {!showFullContent && (
          <Link href={`/tweets/${tweet.id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ExternalLink className="h-3 w-3" />
              View
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
