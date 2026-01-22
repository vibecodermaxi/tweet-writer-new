'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MODEL_OPTIONS,
  QUALITY_CRITERIA,
  ALGORITHM_CRITERIA,
  TOTAL_BASE_CRITERIA,
  TOTAL_ALGO_CRITERIA,
  getModelPricing,
} from '@/lib/constants';
import {
  Loader2,
  CheckCircle,
  XCircle,
  Sparkles,
  RefreshCw,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type StepStatus = 'pending' | 'in_progress' | 'complete' | 'failed';

interface VersionStep {
  version: number;
  content: string;
  generationStatus: StepStatus;
  evaluationStatus: StepStatus;
  baseScore: number | null;
  basePassing: boolean;
  algorithmScore: number | null;
  algorithmPassing: boolean | null;
  overallPassing: boolean;
  passingCriteria: string[];
  failingCriteria: string[];
}

interface AutoRefineLoopProps {
  briefSlug: string;
  topic: string;
  model: string;
  format: 'short' | 'long';
  algorithmOptimization: boolean;
  maxIterations?: number;
}

export function AutoRefineLoop({
  briefSlug,
  topic,
  model,
  format,
  algorithmOptimization,
  maxIterations = 5,
}: AutoRefineLoopProps) {
  const router = useRouter();
  const [versions, setVersions] = useState<VersionStep[]>([]);
  const [currentAction, setCurrentAction] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [finalVersion, setFinalVersion] = useState<number | null>(null);
  const hasStarted = useRef(false);

  // Cost tracking
  const [totalInputTokens, setTotalInputTokens] = useState(0);
  const [totalOutputTokens, setTotalOutputTokens] = useState(0);

  const selectedModel = MODEL_OPTIONS.find(m => m.value === model);
  const pricing = getModelPricing(model);

  // Calculate cost in USD
  const calculateCost = (inputTokens: number, outputTokens: number) => {
    const inputCost = (inputTokens / 1_000_000) * pricing.inputPrice;
    const outputCost = (outputTokens / 1_000_000) * pricing.outputPrice;
    return inputCost + outputCost;
  };

  const totalCost = calculateCost(totalInputTokens, totalOutputTokens);

  const updateVersion = (versionNum: number, updates: Partial<VersionStep>) => {
    setVersions(prev => prev.map(v =>
      v.version === versionNum ? { ...v, ...updates } : v
    ));
  };

  const startLoop = async () => {
    setError(null);
    setVersions([]);
    setIsComplete(false);
    setFinalVersion(null);
    setTotalInputTokens(0);
    setTotalOutputTokens(0);

    try {
      let currentVersion = 1;

      while (currentVersion <= maxIterations) {
        // Add new version entry
        const newVersion: VersionStep = {
          version: currentVersion,
          content: '',
          generationStatus: 'in_progress',
          evaluationStatus: 'pending',
          baseScore: null,
          basePassing: false,
          algorithmScore: null,
          algorithmPassing: null,
          overallPassing: false,
          passingCriteria: [],
          failingCriteria: [],
        };
        setVersions(prev => [...prev, newVersion]);
        setCurrentAction(`Generating V${currentVersion}...`);

        // Generate draft
        const genEndpoint = currentVersion === 1 ? '/api/draft/generate' : '/api/draft/iterate';
        const genResponse = await fetch(genEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ briefSlug }),
        });

        if (!genResponse.ok) {
          const data = await genResponse.json();
          throw new Error(data.error || `Failed to generate V${currentVersion}`);
        }

        const genData = await genResponse.json();

        // Track token usage
        if (genData.usage) {
          setTotalInputTokens(prev => prev + genData.usage.promptTokens);
          setTotalOutputTokens(prev => prev + genData.usage.completionTokens);
        }

        // Mark generation complete
        updateVersion(currentVersion, {
          content: genData.content,
          generationStatus: 'complete',
          evaluationStatus: 'in_progress',
        });
        setCurrentAction(`Evaluating V${currentVersion}...`);

        // Small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 500));

        // Critique the draft
        const critiqueResponse = await fetch('/api/draft/critique', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ briefSlug, version: currentVersion }),
        });

        if (!critiqueResponse.ok) {
          const data = await critiqueResponse.json();
          throw new Error(data.error || `Failed to evaluate V${currentVersion}`);
        }

        const critiqueData = await critiqueResponse.json();

        // Track token usage
        if (critiqueData.usage) {
          setTotalInputTokens(prev => prev + critiqueData.usage.promptTokens);
          setTotalOutputTokens(prev => prev + critiqueData.usage.completionTokens);
        }

        const {
          baseScore,
          basePassing,
          algorithmScore,
          algorithmPassing,
          overallPassing,
          passingCriteria,
          failingCriteria,
        } = critiqueData;

        // Mark evaluation complete
        updateVersion(currentVersion, {
          evaluationStatus: 'complete',
          baseScore,
          basePassing,
          algorithmScore,
          algorithmPassing,
          overallPassing,
          passingCriteria,
          failingCriteria,
        });

        // Check if we've reached the quality threshold
        if (overallPassing) {
          setCurrentAction('All quality criteria passed!');
          setIsComplete(true);
          setFinalVersion(currentVersion);
          return;
        }

        // If not passing and at max iterations, stop
        if (currentVersion >= maxIterations) {
          setCurrentAction('Max iterations reached');
          setIsComplete(true);
          setFinalVersion(currentVersion);
          return;
        }

        // Prepare for next iteration
        currentVersion++;
        setCurrentAction(`Improving to V${currentVersion}...`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCurrentAction('Error');
    }
  };

  // Auto-start on mount (with guard for React Strict Mode double-execution)
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    startLoop();
  }, []);

  const latestVersion = versions[versions.length - 1];
  const isRunning = !isComplete && !error && versions.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold">{topic}</h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant="outline">{format === 'long' ? 'Long' : 'Short'}</Badge>
          <Badge variant="secondary">{selectedModel?.label || model}</Badge>
          {algorithmOptimization && (
            <Badge variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              Algo
            </Badge>
          )}
        </div>
      </div>

      {/* Current Status Card */}
      <Card className={cn(
        'transition-colors',
        error && 'border-destructive',
        isComplete && !error && 'border-green-500'
      )}>
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-3">
            {isRunning ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-lg font-medium">{currentAction}</span>
              </>
            ) : error ? (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="text-lg font-medium text-destructive">{error}</span>
              </>
            ) : isComplete ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-lg font-medium text-green-600">
                  {latestVersion?.overallPassing
                    ? `V${finalVersion} passed all criteria!`
                    : `Completed after ${finalVersion} iterations`}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">Starting...</span>
              </>
            )}
          </div>

          {/* Cost Display */}
          {(totalInputTokens > 0 || totalOutputTokens > 0) && (
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  ${totalCost.toFixed(4)}
                </span>
              </div>
              <span className="text-xs">
                ({totalInputTokens.toLocaleString()} in / {totalOutputTokens.toLocaleString()} out tokens)
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version Timeline */}
      {versions.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <h3 className="font-medium mb-4">Progress</h3>
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div key={version.version} className="relative">
                  {/* Connection line to next version */}
                  {index < versions.length - 1 && (
                    <div className="absolute left-4 top-12 w-0.5 h-8 bg-border" />
                  )}

                  <div className={cn(
                    'rounded-lg border p-4 transition-colors',
                    version.overallPassing && version.evaluationStatus === 'complete'
                      ? 'bg-green-50 border-green-300 dark:bg-green-950/30'
                      : version.evaluationStatus === 'complete'
                      ? 'bg-muted/50'
                      : 'bg-background'
                  )}>
                    {/* Version Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
                        version.overallPassing && version.evaluationStatus === 'complete'
                          ? 'bg-green-500 text-white'
                          : version.evaluationStatus === 'complete'
                          ? 'bg-amber-500 text-white'
                          : 'bg-primary text-primary-foreground'
                      )}>
                        V{version.version}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">Version {version.version}</span>
                          {version.evaluationStatus === 'complete' && version.baseScore !== null && (
                            <>
                              <Badge
                                variant={version.basePassing ? 'default' : 'secondary'}
                                className={cn(version.basePassing && 'bg-green-600')}
                              >
                                Base: {version.baseScore}/{TOTAL_BASE_CRITERIA}
                              </Badge>
                              {algorithmOptimization && version.algorithmScore !== null && (
                                <Badge
                                  variant={version.algorithmPassing ? 'default' : 'secondary'}
                                  className={cn(version.algorithmPassing && 'bg-green-600')}
                                >
                                  Algo: {version.algorithmScore}/{TOTAL_ALGO_CRITERIA}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      {version.overallPassing && version.evaluationStatus === 'complete' && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          PASSED
                        </Badge>
                      )}
                    </div>

                    {/* Steps */}
                    <div className="space-y-2 ml-11">
                      {/* Generation Step */}
                      <div className="flex items-center gap-2 text-sm">
                        {version.generationStatus === 'in_progress' ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : version.generationStatus === 'complete' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted" />
                        )}
                        <span className={cn(
                          version.generationStatus === 'complete' && 'text-green-600'
                        )}>
                          {version.version === 1 ? 'Generate draft' : 'Improve draft'}
                          {version.generationStatus === 'complete' && ' — Complete'}
                        </span>
                      </div>

                      {/* Evaluation Step */}
                      <div className="flex items-center gap-2 text-sm">
                        {version.evaluationStatus === 'in_progress' ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : version.evaluationStatus === 'complete' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted" />
                        )}
                        <span className={cn(
                          version.evaluationStatus === 'complete' && 'text-green-600'
                        )}>
                          Evaluate quality
                          {version.evaluationStatus === 'complete' && ' — Complete'}
                        </span>
                      </div>

                      {/* Failing criteria hint */}
                      {version.evaluationStatus === 'complete' && !version.overallPassing && version.failingCriteria.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-2 pl-6">
                          Needs improvement: {version.failingCriteria.slice(0, 3).join(', ')}
                          {version.failingCriteria.length > 3 && ` (+${version.failingCriteria.length - 3} more)`}
                        </div>
                      )}
                    </div>

                    {/* Content Preview */}
                    {version.generationStatus === 'complete' && (
                      <div className="mt-3 ml-11 p-2 bg-muted/50 rounded text-xs text-muted-foreground line-clamp-2">
                        {version.content.slice(0, 150)}...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {isComplete && !error && (
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setVersions([]);
              setIsComplete(false);
              setError(null);
              hasStarted.current = false;
              startLoop();
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
          <Button onClick={() => router.push(`/drafts/${briefSlug}`)}>
            View & Publish Draft
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {error && (
        <div className="flex justify-center">
          <Button onClick={() => {
            setError(null);
            hasStarted.current = false;
            startLoop();
          }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
