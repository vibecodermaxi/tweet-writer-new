export type TweetFormat = 'short' | 'long';
export type CTAStyle = 'engagement' | 'follow' | 'link' | 'none' | 'varies';

export interface UserProfile {
  id: string;
  targetAudience: string;
  personality: string;
  toneOfVoice: string;
  topicsExpertise: string | null;
  defaultFormat: TweetFormat | 'mix';
  defaultCtaStyle: CTAStyle;
  createdAt: string;
}

export interface Brief {
  id: string;
  slug: string;
  topic: string;
  format: TweetFormat;
  algorithmOptimization: boolean;
  model: string;
  targetAudience: string;
  personality: string;
  tone: string;
  ctaStyle: CTAStyle;
  topicSource: string;
  createdAt: string;
}

export interface QualityCriterion {
  name: string;
  passed: boolean;
  feedback: string;
  category: 'base' | 'algorithm';
}

export interface QualityCritique {
  criteria: QualityCriterion[];
  baseScore: number;
  basePassing: boolean;
  algorithmScore: number | null; // null if algorithm optimization not enabled
  algorithmPassing: boolean | null;
  overallPassing: boolean;
  summary: string;
}

export interface Draft {
  id: string;
  briefId: string;
  slug: string;
  version: number;
  content: string;
  format: TweetFormat;
  tweetCount: number;
  qualityScore: number | null; // Base score (out of 7)
  algorithmScore: number | null; // Algorithm score (out of 6), null if not enabled
  critique: QualityCritique | null;
  createdAt: string;
}

export interface Tweet {
  id: string;
  briefId: string;
  title: string;
  content: string;
  format: TweetFormat;
  iterations: number;
  finalScore: number;
  algorithmOptimized: boolean;
  publishedAt: string;
}

export interface ListOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'date' | 'score';
  sortOrder?: 'asc' | 'desc';
}

export interface StorageAdapter {
  // Profile
  getProfile(userId?: string): Promise<UserProfile | null>;
  saveProfile(profile: Omit<UserProfile, 'id'>): Promise<UserProfile>;

  // Briefs
  getBrief(slug: string): Promise<Brief | null>;
  listBriefs(): Promise<Brief[]>;
  saveBrief(brief: Omit<Brief, 'id'>): Promise<Brief>;

  // Drafts
  getDraft(slug: string, version: number): Promise<Draft | null>;
  getDraftsByBrief(briefSlug: string): Promise<Draft[]>;
  getLatestDraft(briefSlug: string): Promise<Draft | null>;
  saveDraft(draft: Omit<Draft, 'id'>): Promise<Draft>;

  // Tweets
  getTweet(id: string): Promise<Tweet | null>;
  listTweets(options?: ListOptions): Promise<Tweet[]>;
  saveTweet(tweet: Omit<Tweet, 'id'>): Promise<Tweet>;
}
