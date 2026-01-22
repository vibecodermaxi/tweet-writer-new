'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QualityCritique } from '@/lib/data/types';
import {
  QUALITY_CRITERIA,
  ALGORITHM_CRITERIA,
  MIN_QUALITY_SCORE,
  MIN_ALGO_SCORE,
  TOTAL_BASE_CRITERIA,
  TOTAL_ALGO_CRITERIA,
} from '@/lib/constants';
import { Check, X, HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QualityChecklistProps {
  critique: QualityCritique | null;
  isLoading?: boolean;
  showAlgorithm?: boolean;
}

export function QualityChecklist({ critique, isLoading, showAlgorithm = false }: QualityChecklistProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quality Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {QUALITY_CRITERIA.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-muted" />
                <div className="h-4 w-32 rounded bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!critique) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quality Check</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click &quot;Evaluate&quot; to check quality criteria
          </p>
          <ul className="mt-4 space-y-2">
            {QUALITY_CRITERIA.map((criterion) => (
              <li key={criterion.id} className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{criterion.name}</span>
              </li>
            ))}
          </ul>
          {showAlgorithm && (
            <>
              <div className="flex items-center gap-2 mt-6 mb-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Algorithm Optimization</span>
              </div>
              <ul className="space-y-2">
                {ALGORITHM_CRITERIA.map((criterion) => (
                  <li key={criterion.id} className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{criterion.name}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  // Separate base and algorithm criteria
  const baseCriteria = critique.criteria.filter((c) => c.category === 'base');
  const algoCriteria = critique.criteria.filter((c) => c.category === 'algorithm');

  const baseScore = critique.baseScore;
  const basePassing = critique.basePassing;
  const basePercentage = (baseScore / TOTAL_BASE_CRITERIA) * 100;

  const algoScore = critique.algorithmScore;
  const algoPassing = critique.algorithmPassing;
  const hasAlgo = algoScore !== null && algoCriteria.length > 0;
  const algoPercentage = hasAlgo ? (algoScore / TOTAL_ALGO_CRITERIA) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Quality Check</CardTitle>
          <Badge variant={critique.overallPassing ? 'default' : 'destructive'}>
            {critique.overallPassing ? 'PASSING' : 'NEEDS WORK'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base Quality Criteria */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Base Quality</span>
            <Badge variant={basePassing ? 'default' : 'secondary'} className={cn(basePassing && 'bg-green-600')}>
              {baseScore}/{TOTAL_BASE_CRITERIA}
            </Badge>
          </div>
          <Progress value={basePercentage} className="h-2" />
          <p className={cn(
            'text-xs',
            basePassing ? 'text-green-600' : 'text-amber-600'
          )}>
            {basePassing
              ? 'All base criteria passed!'
              : `Need ${MIN_QUALITY_SCORE - baseScore} more to pass`}
          </p>

          <ul className="space-y-2">
            {baseCriteria.map((criterion) => (
              <li
                key={criterion.name}
                className="flex items-start gap-3"
                title={criterion.feedback}
              >
                {criterion.passed ? (
                  <Check className="h-5 w-5 text-green-600 shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-red-500 shrink-0" />
                )}
                <div>
                  <p className={cn(
                    'text-sm font-medium',
                    criterion.passed ? 'text-foreground' : 'text-red-600'
                  )}>
                    {criterion.name}
                  </p>
                  {criterion.feedback && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {criterion.feedback}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Algorithm Optimization Criteria */}
        {hasAlgo && (
          <div className="space-y-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Algorithm Optimization</span>
              </div>
              <Badge variant={algoPassing ? 'default' : 'secondary'} className={cn(algoPassing && 'bg-green-600')}>
                {algoScore}/{TOTAL_ALGO_CRITERIA}
              </Badge>
            </div>
            <Progress value={algoPercentage} className="h-2" />
            <p className={cn(
              'text-xs',
              algoPassing ? 'text-green-600' : 'text-amber-600'
            )}>
              {algoPassing
                ? 'All algorithm criteria passed!'
                : `Need ${MIN_ALGO_SCORE - (algoScore || 0)} more to pass`}
            </p>

            <ul className="space-y-2">
              {algoCriteria.map((criterion) => (
                <li
                  key={criterion.name}
                  className="flex items-start gap-3"
                  title={criterion.feedback}
                >
                  {criterion.passed ? (
                    <Check className="h-5 w-5 text-green-600 shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 shrink-0" />
                  )}
                  <div>
                    <p className={cn(
                      'text-sm font-medium',
                      criterion.passed ? 'text-foreground' : 'text-red-600'
                    )}>
                      {criterion.name}
                    </p>
                    {criterion.feedback && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {criterion.feedback}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {critique.summary && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">{critique.summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
