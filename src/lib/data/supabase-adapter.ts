/**
 * Supabase Adapter - Stub Implementation
 *
 * This file contains the skeleton for a Supabase-based storage adapter.
 * To implement:
 * 1. Install @supabase/supabase-js
 * 2. Set up Supabase project and configure env vars
 * 3. Run the SQL schema from the plan
 * 4. Implement each method below
 */

import {
  StorageAdapter,
  UserProfile,
  Brief,
  Draft,
  Tweet,
  ListOptions,
} from './types';

export class SupabaseAdapter implements StorageAdapter {
  // Profile
  async getProfile(userId?: string): Promise<UserProfile | null> {
    // TODO: SELECT * FROM profiles WHERE user_id = $1
    throw new Error('SupabaseAdapter.getProfile not implemented');
  }

  async saveProfile(profile: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    // TODO: INSERT INTO profiles ... ON CONFLICT UPDATE
    throw new Error('SupabaseAdapter.saveProfile not implemented');
  }

  // Briefs
  async getBrief(slug: string): Promise<Brief | null> {
    // TODO: SELECT * FROM briefs WHERE slug = $1
    throw new Error('SupabaseAdapter.getBrief not implemented');
  }

  async listBriefs(): Promise<Brief[]> {
    // TODO: SELECT * FROM briefs ORDER BY created_at DESC
    throw new Error('SupabaseAdapter.listBriefs not implemented');
  }

  async saveBrief(brief: Omit<Brief, 'id'>): Promise<Brief> {
    // TODO: INSERT INTO briefs ...
    throw new Error('SupabaseAdapter.saveBrief not implemented');
  }

  // Drafts
  async getDraft(slug: string, version: number): Promise<Draft | null> {
    // TODO: SELECT * FROM drafts WHERE brief_id = ... AND version = $1
    throw new Error('SupabaseAdapter.getDraft not implemented');
  }

  async getDraftsByBrief(briefSlug: string): Promise<Draft[]> {
    // TODO: SELECT * FROM drafts WHERE brief_id = ... ORDER BY version
    throw new Error('SupabaseAdapter.getDraftsByBrief not implemented');
  }

  async getLatestDraft(briefSlug: string): Promise<Draft | null> {
    // TODO: SELECT * FROM drafts WHERE brief_id = ... ORDER BY version DESC LIMIT 1
    throw new Error('SupabaseAdapter.getLatestDraft not implemented');
  }

  async saveDraft(draft: Omit<Draft, 'id'>): Promise<Draft> {
    // TODO: INSERT INTO drafts ...
    throw new Error('SupabaseAdapter.saveDraft not implemented');
  }

  // Tweets
  async getTweet(id: string): Promise<Tweet | null> {
    // TODO: SELECT * FROM tweets WHERE id = $1
    throw new Error('SupabaseAdapter.getTweet not implemented');
  }

  async listTweets(options?: ListOptions): Promise<Tweet[]> {
    // TODO: SELECT * FROM tweets ORDER BY published_at DESC LIMIT $1 OFFSET $2
    throw new Error('SupabaseAdapter.listTweets not implemented');
  }

  async saveTweet(tweet: Omit<Tweet, 'id'>): Promise<Tweet> {
    // TODO: INSERT INTO tweets ...
    throw new Error('SupabaseAdapter.saveTweet not implemented');
  }
}

/*
SQL Schema for reference:

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  target_audience TEXT,
  personality TEXT,
  tone_of_voice TEXT,
  topics_expertise TEXT,
  default_format TEXT,
  default_cta_style TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  slug TEXT NOT NULL,
  topic TEXT NOT NULL,
  format TEXT NOT NULL,
  algorithm_optimization BOOLEAN DEFAULT false,
  target_audience TEXT,
  personality TEXT,
  tone TEXT,
  cta_style TEXT,
  topic_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES briefs(id),
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  format TEXT,
  tweet_count INTEGER DEFAULT 1,
  quality_score INTEGER,
  critique JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tweets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES briefs(id),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  content TEXT NOT NULL,
  format TEXT,
  iterations INTEGER DEFAULT 1,
  final_score INTEGER,
  algorithm_optimized BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW()
);
*/
