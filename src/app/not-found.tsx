import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="py-12 text-center">
          <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-6 text-2xl font-bold">Page Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/">
            <Button className="mt-6">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
