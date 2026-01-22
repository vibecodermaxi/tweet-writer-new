'use server';

import { getStorageAdapter, Tweet, ListOptions } from '@/lib/data';

export async function getTweet(id: string): Promise<Tweet | null> {
  const storage = getStorageAdapter();
  return storage.getTweet(id);
}

export async function listTweets(options?: ListOptions): Promise<Tweet[]> {
  const storage = getStorageAdapter();
  return storage.listTweets(options);
}
