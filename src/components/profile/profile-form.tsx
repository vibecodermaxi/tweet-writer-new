'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/lib/data/types';
import { saveProfile } from '@/lib/actions/profile';
import { FORMAT_OPTIONS, CTA_STYLE_OPTIONS } from '@/lib/constants';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProfileFormProps {
  initialData: UserProfile | null;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    targetAudience: initialData?.targetAudience || '',
    personality: initialData?.personality || '',
    toneOfVoice: initialData?.toneOfVoice || '',
    topicsExpertise: initialData?.topicsExpertise || '',
    defaultFormat: initialData?.defaultFormat || 'mix',
    defaultCtaStyle: initialData?.defaultCtaStyle || 'none',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await saveProfile(formData);

      if (result.success) {
        toast.success('Profile saved successfully');
        router.push('/');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to save profile');
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audience & Voice</CardTitle>
          <CardDescription>
            Define who you&apos;re writing for and how you want to sound
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Textarea
              id="targetAudience"
              placeholder="Describe your ideal reader. Who are they? What do they care about?"
              value={formData.targetAudience}
              onChange={(e) => updateField('targetAudience', e.target.value)}
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              Be specific: &quot;AI enthusiasts who are early adopters, tech-savvy professionals looking to boost productivity&quot;
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personality">Personality</Label>
            <Input
              id="personality"
              placeholder="e.g., Casual & relatable, Professional & authoritative"
              value={formData.personality}
              onChange={(e) => updateField('personality', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toneOfVoice">Tone of Voice</Label>
            <Textarea
              id="toneOfVoice"
              placeholder="How should your tweets sound? Warm, witty, direct, inspiring..."
              value={formData.toneOfVoice}
              onChange={(e) => updateField('toneOfVoice', e.target.value)}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topicsExpertise">Topics & Expertise (Optional)</Label>
            <Input
              id="topicsExpertise"
              placeholder="e.g., AI tools, productivity, startup growth"
              value={formData.topicsExpertise}
              onChange={(e) => updateField('topicsExpertise', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Settings</CardTitle>
          <CardDescription>
            These can be overridden per tweet
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="defaultFormat">Default Format</Label>
            <Select
              value={formData.defaultFormat}
              onValueChange={(value) => updateField('defaultFormat', value)}
            >
              <SelectTrigger id="defaultFormat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
                <SelectItem value="mix">Mix of both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultCtaStyle">Default CTA Style</Label>
            <Select
              value={formData.defaultCtaStyle}
              onValueChange={(value) => updateField('defaultCtaStyle', value)}
            >
              <SelectTrigger id="defaultCtaStyle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CTA_STYLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Profile' : 'Create Profile'}
        </Button>
      </div>
    </form>
  );
}
