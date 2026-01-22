'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Draft } from '@/lib/data/types';
import { GitCompare, Eye, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VersionHistoryProps {
  versions: Draft[];
  currentVersion: number;
  onSelectVersion: (version: number) => void;
  onCompareVersion?: (version: Draft) => void;
  finalVersion?: Draft;
}

export function VersionHistory({
  versions,
  currentVersion,
  onSelectVersion,
  onCompareVersion,
  finalVersion,
}: VersionHistoryProps) {
  if (versions.length === 0) {
    return null;
  }

  const latestVersion = versions[versions.length - 1];
  const firstVersion = versions[0];
  const showCompare = onCompareVersion && finalVersion && versions.length > 1;
  const canCompareFirstToFinal = showCompare && firstVersion && firstVersion.version !== finalVersion?.version;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Version History</CardTitle>
          <Badge variant="outline" className="text-xs">
            {versions.length} version{versions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        {canCompareFirstToFinal && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => onCompareVersion!(firstVersion)}
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Compare V1 vs Final (V{finalVersion!.version})
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {versions.map((version) => {
            const isLatest = version.version === latestVersion?.version;
            const isCurrent = currentVersion === version.version;
            const isPassing = version.qualityScore !== null && version.qualityScore >= 6;

            return (
              <li
                key={version.version}
                className={cn(
                  'rounded-lg border transition-colors',
                  isCurrent ? 'border-primary bg-primary/5' : 'border-border',
                  isLatest && isPassing && 'border-green-500/50'
                )}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn(
                        'flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium shrink-0',
                        isLatest && isPassing
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}>
                        v{version.version}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {isLatest && (
                            <Badge variant={isPassing ? 'default' : 'secondary'} className="text-xs">
                              {isPassing ? 'Final' : 'Latest'}
                            </Badge>
                          )}
                          {version.qualityScore !== null && (
                            <Badge
                              variant={isPassing ? 'default' : 'outline'}
                              className={cn(
                                'text-xs',
                                isPassing && 'bg-green-600'
                              )}
                            >
                              {version.qualityScore}/7
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {version.createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* View button */}
                      <Button
                        variant={isCurrent ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => onSelectVersion(version.version)}
                        title="View this version"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>

                      {/* Compare button (only for non-latest versions) */}
                      {showCompare && !isLatest && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCompareVersion(version)}
                          title="Compare with final version"
                        >
                          <GitCompare className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Content preview */}
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {version.content.slice(0, 150)}...
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
