'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Draft } from '@/lib/data/types';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonViewProps {
  selectedVersion: Draft;
  finalVersion: Draft;
  onClose: () => void;
}

export function ComparisonView({
  selectedVersion,
  finalVersion,
  onClose,
}: ComparisonViewProps) {
  const isSameVersion = selectedVersion.version === finalVersion.version;

  // Split content into lines for diff-style comparison
  const selectedLines = selectedVersion.content.split('\n');
  const finalLines = finalVersion.content.split('\n');

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 md:inset-8 lg:inset-12 bg-background border rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/50">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Version Comparison</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">v{selectedVersion.version}</Badge>
              <ArrowRight className="h-4 w-4" />
              <Badge variant="default">v{finalVersion.version} (Final)</Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-hidden grid grid-cols-2 divide-x">
          {/* Selected Version */}
          <div className="flex flex-col overflow-hidden">
            <div className="p-3 border-b bg-amber-50 dark:bg-amber-950/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white dark:bg-background">
                    Version {selectedVersion.version}
                  </Badge>
                  {selectedVersion.qualityScore !== null && (
                    <Badge variant="secondary">
                      Score: {selectedVersion.qualityScore}/7
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {selectedVersion.createdAt}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {selectedVersion.content}
              </pre>
            </div>
          </div>

          {/* Final Version */}
          <div className="flex flex-col overflow-hidden">
            <div className="p-3 border-b bg-green-50 dark:bg-green-950/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-600">
                    Version {finalVersion.version} (Final)
                  </Badge>
                  {finalVersion.qualityScore !== null && (
                    <Badge variant="secondary">
                      Score: {finalVersion.qualityScore}/7
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {finalVersion.createdAt}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {finalVersion.content}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer with stats */}
        <div className="p-4 border-t bg-muted/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-muted-foreground">Selected: </span>
                <span className="font-medium">{selectedVersion.content.length} chars</span>
              </div>
              <div>
                <span className="text-muted-foreground">Final: </span>
                <span className="font-medium">{finalVersion.content.length} chars</span>
              </div>
              <div>
                <span className="text-muted-foreground">Difference: </span>
                <span className={cn(
                  'font-medium',
                  finalVersion.content.length > selectedVersion.content.length
                    ? 'text-green-600'
                    : finalVersion.content.length < selectedVersion.content.length
                    ? 'text-amber-600'
                    : ''
                )}>
                  {finalVersion.content.length - selectedVersion.content.length > 0 ? '+' : ''}
                  {finalVersion.content.length - selectedVersion.content.length} chars
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                {finalVersion.version - selectedVersion.version} iteration{finalVersion.version - selectedVersion.version !== 1 ? 's' : ''} between versions
              </span>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
