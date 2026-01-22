'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createBrief } from '@/lib/actions/brief';
import { FORMAT_OPTIONS, MODEL_OPTIONS, DEFAULT_MODEL } from '@/lib/constants';
import { toast } from 'sonner';
import { Loader2, ArrowRight, ArrowLeft, MessageSquare, ScrollText, Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'topic' | 'format' | 'model' | 'options' | 'generating';

export function CreateWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('topic');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    topic: '',
    format: 'short' as 'short' | 'long',
    model: DEFAULT_MODEL,
    algorithmOptimization: false,
  });

  const handleSubmit = async () => {
    setStep('generating');
    setIsLoading(true);

    try {
      // Create the brief
      const briefResult = await createBrief(formData);

      if (!briefResult.success || !briefResult.slug) {
        toast.error(briefResult.error || 'Failed to create brief');
        setStep('topic');
        setIsLoading(false);
        return;
      }

      // Redirect to the auto-refine page
      router.push(`/create/${briefResult.slug}`);
    } catch (error) {
      toast.error('An error occurred');
      setStep('topic');
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'topic':
        return formData.topic.length >= 5;
      case 'format':
        return true;
      case 'model':
        return formData.model.length > 0;
      case 'options':
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    switch (step) {
      case 'topic':
        setStep('format');
        break;
      case 'format':
        setStep('model');
        break;
      case 'model':
        setStep('options');
        break;
      case 'options':
        handleSubmit();
        break;
    }
  };

  const prevStep = () => {
    switch (step) {
      case 'format':
        setStep('topic');
        break;
      case 'model':
        setStep('format');
        break;
      case 'options':
        setStep('model');
        break;
    }
  };

  const selectedModel = MODEL_OPTIONS.find(m => m.value === formData.model);

  if (step === 'generating') {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="relative">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold">Generating Your Tweet</h2>
          <p className="text-center text-muted-foreground">
            {selectedModel?.label || 'AI'} is crafting your {formData.format === 'long' ? 'long-form tweet' : 'tweet'}...
          </p>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        {['topic', 'format', 'model', 'options'].map((s) => (
          <div
            key={s}
            className={cn(
              'h-2 w-12 rounded-full transition-colors',
              step === s ||
              ['topic', 'format', 'model', 'options'].indexOf(step) > ['topic', 'format', 'model', 'options'].indexOf(s as Step)
                ? 'bg-primary'
                : 'bg-muted'
            )}
          />
        ))}
      </div>

      {step === 'topic' && (
        <Card>
          <CardHeader>
            <CardTitle>What&apos;s your tweet about?</CardTitle>
            <CardDescription>
              Enter a topic, idea, or key message you want to share
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., AI will transform how we work in the next 5 years"
                value={formData.topic}
                onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Be specific about your angle or key insight
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'format' && (
        <Card>
          <CardHeader>
            <CardTitle>Choose a format</CardTitle>
            <CardDescription>
              Short tweet or extended long-form?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {FORMAT_OPTIONS.map((option) => {
                const Icon = option.value === 'short' ? MessageSquare : ScrollText;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, format: option.value as 'short' | 'long' }))}
                    className={cn(
                      'flex items-start gap-4 rounded-lg border p-4 text-left transition-colors',
                      formData.format === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-accent'
                    )}
                  >
                    <Icon className={cn(
                      'h-6 w-6 mt-0.5',
                      formData.format === option.value ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'model' && (
        <Card>
          <CardHeader>
            <CardTitle>Choose an AI model</CardTitle>
            <CardDescription>
              Select which model to use for generation via OpenRouter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, model: value }))}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">({option.provider})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedModel && (
                <p className="text-xs text-muted-foreground">{selectedModel.description}</p>
              )}
            </div>

            {/* Quick model cards for popular choices */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {MODEL_OPTIONS.slice(0, 4).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, model: option.value }))}
                  className={cn(
                    'flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors',
                    formData.model === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Bot className={cn(
                      'h-4 w-4',
                      formData.model === option.value ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <p className="text-sm font-medium">{option.label}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.provider}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'options' && (
        <Card>
          <CardHeader>
            <CardTitle>Additional options</CardTitle>
            <CardDescription>
              Fine-tune your tweet generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 rounded-lg border p-4">
              <Checkbox
                id="algorithmOptimization"
                checked={formData.algorithmOptimization}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, algorithmOptimization: checked === true }))
                }
              />
              <div className="space-y-1">
                <Label htmlFor="algorithmOptimization" className="cursor-pointer font-medium">
                  Optimize for algorithm
                </Label>
                <p className="text-sm text-muted-foreground">
                  Apply additional criteria to maximize engagement: hook strength, reply-worthiness, shareability
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Summary</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><strong>Topic:</strong> {formData.topic}</li>
                <li><strong>Format:</strong> {formData.format === 'short' ? 'Short Tweet' : 'Long Tweet'}</li>
                <li><strong>Model:</strong> {selectedModel?.label || formData.model}</li>
                <li><strong>Algorithm Optimization:</strong> {formData.algorithmOptimization ? 'Yes' : 'No'}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 'topic'}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={!canProceed() || isLoading}
        >
          {step === 'options' ? (
            <>
              Generate
              <Sparkles className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
