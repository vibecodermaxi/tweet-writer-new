'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="py-12 text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
          <h1 className="mt-6 text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">
            An error occurred while loading this page.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={reset} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
