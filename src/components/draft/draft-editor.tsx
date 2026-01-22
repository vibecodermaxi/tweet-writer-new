'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QualityChecklist } from './quality-checklist';
import { VersionHistory } from './version-history';
import { ComparisonView } from './comparison-view';
import { Draft, Brief } from '@/lib/data/types';
import { useDraftStore } from '@/stores/draft-store';
import {
  saveDraftContent,
  critiqueDraft,
  iterateDraft,
  publishDraft,
} from '@/lib/actions/draft';
import {
  TWEET_CHAR_LIMIT,
  TOTAL_BASE_CRITERIA,
  TOTAL_ALGO_CRITERIA,
  MODEL_OPTIONS,
} from '@/lib/constants';
import { toast } from 'sonner';
import {
  Loader2,
  Save,
  RefreshCw,
  CheckCircle,
  Sparkles,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraftEditorProps {
  brief: Brief;
  drafts: Draft[];
  initialDraft: Draft;
}

export function DraftEditor({ brief, drafts, initialDraft }: DraftEditorProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [comparisonVersion, setComparisonVersion] = useState<Draft | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const {
    currentDraft,
    currentContent,
    isDirty,
    versions,
    selectedVersion,
    isCritiquing,
    isIterating,
    isSaving,
    setCurrentDraft,
    setContent,
    setVersions,
    selectVersion,
    setIsCritiquing,
    setIsIterating,
    setIsSaving,
    markClean,
  } = useDraftStore();

  // Initialize store with data - runs when props change (including after router.refresh())
  useEffect(() => {
    setCurrentDraft(initialDraft);
    setVersions(drafts);
  }, [initialDraft, drafts, setCurrentDraft, setVersions]);

  const charCount = currentContent.length;
  const isOverLimit = brief.format === 'short' && charCount > TWEET_CHAR_LIMIT;

  const handleSave = useCallback(async () => {
    if (!currentDraft || !isDirty) return;

    setIsSaving(true);
    try {
      const result = await saveDraftContent(brief.slug, currentDraft.version, currentContent);
      if (result.success) {
        markClean();
        toast.success('Draft saved');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to save');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  }, [currentDraft, isDirty, currentContent, brief.slug, setIsSaving, markClean, router]);

  const handleEvaluate = async () => {
    if (!currentDraft) return;

    // Save first if dirty
    if (isDirty) {
      await handleSave();
    }

    setIsCritiquing(true);
    try {
      const result = await critiqueDraft(brief.slug, currentDraft.version);
      if (result.success) {
        toast.success('Evaluation complete');
        // Force a hard refresh to ensure store updates
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to evaluate');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsCritiquing(false);
    }
  };

  const handleIterate = async () => {
    setIsIterating(true);
    try {
      const result = await iterateDraft(brief.slug);
      if (result.success) {
        toast.success('New version generated');
        // Force a hard refresh to ensure store updates
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to iterate');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsIterating(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const result = await publishDraft(brief.slug);
      if (result.success) {
        toast.success('Tweet published!');
        router.push(`/tweets/${result.tweetId}`);
      } else {
        toast.error(result.error || 'Failed to publish');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentContent);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompareVersion = (version: Draft) => {
    setComparisonVersion(version);
  };

  const finalVersion = drafts[drafts.length - 1];
  const isLatestVersion = currentDraft?.version === finalVersion?.version;

  // Use overallPassing from critique for publish decision
  const hasBeenEvaluated = currentDraft !== null && currentDraft.critique !== null;
  const overallPassing = currentDraft?.critique?.overallPassing ?? false;

  const canPublish =
    currentDraft !== null &&
    hasBeenEvaluated &&
    overallPassing &&
    isLatestVersion;

  const needsMoreWork = hasBeenEvaluated && !overallPassing;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status Banner */}
          {canPublish && currentDraft?.critique && (
            <Card className="border-green-500 bg-green-50 dark:bg-green-950/30">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        Ready to publish!
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Base: {currentDraft.critique.baseScore}/{TOTAL_BASE_CRITERIA}
                        {currentDraft.critique.algorithmScore !== null && (
                          <> | Algo: {currentDraft.critique.algorithmScore}/{TOTAL_ALGO_CRITERIA}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button onClick={handlePublish} disabled={isPublishing} className="bg-green-600 hover:bg-green-700">
                    {isPublishing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Publish Tweet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {needsMoreWork && isLatestVersion && currentDraft?.critique && (
            <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-200">
                        Needs improvement
                      </p>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Base: {currentDraft.critique.baseScore}/{TOTAL_BASE_CRITERIA}
                        {!currentDraft.critique.basePassing && ' (needs all)'}
                        {currentDraft.critique.algorithmScore !== null && (
                          <>
                            {' | '}Algo: {currentDraft.critique.algorithmScore}/{TOTAL_ALGO_CRITERIA}
                            {!currentDraft.critique.algorithmPassing && ' (needs all)'}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleIterate}
                    disabled={isIterating}
                    className="border-amber-500 text-amber-700 hover:bg-amber-100"
                  >
                    {isIterating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Improved Version
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>{brief.topic}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline">
                    {brief.format === 'long' ? 'Long' : 'Short'}
                  </Badge>
                  <Badge variant="outline">
                    {MODEL_OPTIONS.find(m => m.value === brief.model)?.label || brief.model}
                  </Badge>
                  {brief.algorithmOptimization && (
                    <Badge variant="secondary">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Algo Optimized
                    </Badge>
                  )}
                  {currentDraft && (
                    <Badge variant="secondary">
                      Version {currentDraft.version}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={currentContent}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Your tweet content..."
                rows={brief.format === 'long' ? 15 : 6}
                className={cn(
                  'font-mono text-sm resize-none',
                  isOverLimit && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              <div className="flex items-center justify-between">
                <div className={cn(
                  'text-sm',
                  isOverLimit ? 'text-red-500' : 'text-muted-foreground'
                )}>
                  {charCount} characters
                  {brief.format === 'short' && ` / ${TWEET_CHAR_LIMIT}`}
                </div>
                <div className="flex items-center gap-2">
                  {isDirty && (
                    <span className="text-xs text-muted-foreground">Unsaved changes</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>

            {!hasBeenEvaluated && (
              <Button
                variant="outline"
                onClick={handleEvaluate}
                disabled={isCritiquing || isDirty}
              >
                {isCritiquing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Evaluate Quality
              </Button>
            )}

            {hasBeenEvaluated && !canPublish && !isLatestVersion && (
              <p className="text-sm text-muted-foreground self-center">
                Viewing older version. Switch to latest to continue editing.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <QualityChecklist
            critique={currentDraft?.critique || null}
            isLoading={isCritiquing}
            showAlgorithm={brief.algorithmOptimization}
          />

          <VersionHistory
            versions={versions}
            currentVersion={selectedVersion}
            onSelectVersion={selectVersion}
            onCompareVersion={handleCompareVersion}
            finalVersion={finalVersion}
          />
        </div>
      </div>

      {/* Comparison Modal */}
      {comparisonVersion && finalVersion && (
        <ComparisonView
          selectedVersion={comparisonVersion}
          finalVersion={finalVersion}
          onClose={() => setComparisonVersion(null)}
        />
      )}
    </>
  );
}
