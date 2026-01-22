import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  StorageAdapter,
  UserProfile,
  Brief,
  Draft,
  Tweet,
  ListOptions,
  TweetFormat,
  CTAStyle,
} from './types';

// Base paths relative to project root (parent of src/)
const CONTENT_DIR = path.join(process.cwd(), '..', 'content');
const USER_INFO_PATH = path.join(process.cwd(), '..', 'UserInfo.md');

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export class FileAdapter implements StorageAdapter {
  // Profile
  async getProfile(userId?: string): Promise<UserProfile | null> {
    try {
      const content = await fs.readFile(USER_INFO_PATH, 'utf-8');
      return this.parseUserProfile(content);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async saveProfile(profile: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    const id = 'default-user';
    const fullProfile: UserProfile = { ...profile, id };

    const content = `# Tweet Profile

## Target Audience
${fullProfile.targetAudience}

## Personality
${fullProfile.personality}

## Tone of Voice
${fullProfile.toneOfVoice}

## Topics/Expertise
${fullProfile.topicsExpertise || 'Not specified'}

## Default Format
${this.formatDefaultFormat(fullProfile.defaultFormat)}

## Default CTA Style
${this.formatCtaStyle(fullProfile.defaultCtaStyle)}

---

*Created: ${fullProfile.createdAt}*
*Run /start again to update this profile.*`;

    await fs.writeFile(USER_INFO_PATH, content, 'utf-8');
    return fullProfile;
  }

  // Briefs
  async getBrief(slug: string): Promise<Brief | null> {
    const briefsDir = path.join(CONTENT_DIR, 'briefs');
    const filename = `${slug}-brief.md`;
    const filepath = path.join(briefsDir, filename);

    try {
      const content = await fs.readFile(filepath, 'utf-8');
      return this.parseBrief(content, slug);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async listBriefs(): Promise<Brief[]> {
    const briefsDir = path.join(CONTENT_DIR, 'briefs');
    try {
      const files = await fs.readdir(briefsDir);
      const briefFiles = files.filter(f => f.endsWith('-brief.md'));

      const briefs = await Promise.all(
        briefFiles.map(async (file) => {
          const slug = file.replace('-brief.md', '');
          const content = await fs.readFile(path.join(briefsDir, file), 'utf-8');
          return this.parseBrief(content, slug);
        })
      );

      return briefs.filter((b): b is Brief => b !== null);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async saveBrief(brief: Omit<Brief, 'id'>): Promise<Brief> {
    const briefsDir = path.join(CONTENT_DIR, 'briefs');
    await fs.mkdir(briefsDir, { recursive: true });

    const id = generateId();
    const fullBrief: Brief = { ...brief, id };

    const content = `# Tweet Brief: ${fullBrief.topic}

**Created**: ${fullBrief.createdAt}
**Format**: ${fullBrief.format === 'long' ? 'Long Tweet' : 'Short Tweet'}
**Model**: ${fullBrief.model}
**Target Audience**: ${fullBrief.targetAudience}
**Personality**: ${fullBrief.personality}
**Tone**: ${fullBrief.tone}
**CTA Style**: ${this.formatCtaStyle(fullBrief.ctaStyle)}
**Algorithm Optimization**: ${fullBrief.algorithmOptimization ? 'Yes' : 'No'}
**Topic Source**: ${fullBrief.topicSource}
`;

    const filename = `${fullBrief.slug}-brief.md`;
    await fs.writeFile(path.join(briefsDir, filename), content, 'utf-8');
    return fullBrief;
  }

  // Drafts
  async getDraft(slug: string, version: number): Promise<Draft | null> {
    const draftsDir = path.join(CONTENT_DIR, 'drafts');
    const filename = `${slug}-v${version}.md`;
    const filepath = path.join(draftsDir, filename);

    try {
      const content = await fs.readFile(filepath, 'utf-8');
      return this.parseDraft(content, slug, version);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async getDraftsByBrief(briefSlug: string): Promise<Draft[]> {
    const draftsDir = path.join(CONTENT_DIR, 'drafts');
    try {
      const files = await fs.readdir(draftsDir);
      const draftFiles = files.filter(f => f.startsWith(briefSlug) && f.endsWith('.md'));

      const drafts = await Promise.all(
        draftFiles.map(async (file) => {
          const match = file.match(/^(.+)-v(\d+)\.md$/);
          if (!match) return null;

          const [, slug, versionStr] = match;
          const version = parseInt(versionStr, 10);
          const content = await fs.readFile(path.join(draftsDir, file), 'utf-8');
          return this.parseDraft(content, slug, version);
        })
      );

      return drafts
        .filter((d): d is Draft => d !== null)
        .sort((a, b) => a.version - b.version);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async getLatestDraft(briefSlug: string): Promise<Draft | null> {
    const drafts = await this.getDraftsByBrief(briefSlug);
    return drafts.length > 0 ? drafts[drafts.length - 1] : null;
  }

  async saveDraft(draft: Omit<Draft, 'id'>): Promise<Draft> {
    const draftsDir = path.join(CONTENT_DIR, 'drafts');
    await fs.mkdir(draftsDir, { recursive: true });

    const id = generateId();
    const fullDraft: Draft = { ...draft, id };

    const frontmatter: Record<string, unknown> = {
      draft: fullDraft.version,
      date: fullDraft.createdAt,
      format: fullDraft.format === 'long' ? 'long' : 'short',
      tweet_count: fullDraft.tweetCount,
      quality_score: fullDraft.qualityScore ?? 'TBD',
      algorithm_score: fullDraft.algorithmScore ?? 'TBD',
      passing_criteria: fullDraft.critique
        ? fullDraft.critique.criteria.filter(c => c.passed).map(c => c.name).join(', ') || 'TBD'
        : 'TBD',
      failing_criteria: fullDraft.critique
        ? fullDraft.critique.criteria.filter(c => !c.passed).map(c => c.name).join(', ') || 'TBD'
        : 'TBD',
    };

    // Store full critique as JSON for iteration support
    if (fullDraft.critique) {
      frontmatter.critique = fullDraft.critique;
    }

    const content = matter.stringify(fullDraft.content, frontmatter);
    const filename = `${fullDraft.slug}-v${fullDraft.version}.md`;
    await fs.writeFile(path.join(draftsDir, filename), content, 'utf-8');
    return fullDraft;
  }

  // Tweets
  async getTweet(id: string): Promise<Tweet | null> {
    const tweets = await this.listTweets();
    return tweets.find(t => t.id === id) || null;
  }

  async listTweets(options?: ListOptions): Promise<Tweet[]> {
    const tweetsDir = path.join(CONTENT_DIR, 'tweets');
    try {
      const dateDirs = await fs.readdir(tweetsDir);

      const allTweets: Tweet[] = [];
      for (const dateDir of dateDirs) {
        if (dateDir.startsWith('.')) continue;

        const datePath = path.join(tweetsDir, dateDir);
        const stat = await fs.stat(datePath);
        if (!stat.isDirectory()) continue;

        const files = await fs.readdir(datePath);
        for (const file of files) {
          if (!file.endsWith('.md')) continue;

          const content = await fs.readFile(path.join(datePath, file), 'utf-8');
          const tweet = this.parseTweet(content, file.replace('.md', ''), dateDir);
          if (tweet) allTweets.push(tweet);
        }
      }

      // Sort by date descending by default
      allTweets.sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      if (options?.limit) {
        const offset = options.offset || 0;
        return allTweets.slice(offset, offset + options.limit);
      }

      return allTweets;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async saveTweet(tweet: Omit<Tweet, 'id'>): Promise<Tweet> {
    const date = formatDate(new Date());
    const tweetsDir = path.join(CONTENT_DIR, 'tweets', date);
    await fs.mkdir(tweetsDir, { recursive: true });

    const id = generateId();
    const fullTweet: Tweet = { ...tweet, id };

    const frontmatter = {
      title: fullTweet.title,
      format: fullTweet.format === 'long' ? 'long' : 'short',
      iterations: fullTweet.iterations,
      final_score: fullTweet.finalScore,
      algorithm_optimized: fullTweet.algorithmOptimized,
      published_at: fullTweet.publishedAt,
    };

    const content = matter.stringify(fullTweet.content, frontmatter);
    const slug = fullTweet.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
    const filename = `${slug}.md`;
    await fs.writeFile(path.join(tweetsDir, filename), content, 'utf-8');
    return fullTweet;
  }

  // Private parsing methods
  private parseUserProfile(content: string): UserProfile | null {
    const lines = content.split('\n');

    const extractSection = (header: string): string => {
      const startIndex = lines.findIndex(l => l.includes(`## ${header}`));
      if (startIndex === -1) return '';

      let value = '';
      for (let i = startIndex + 1; i < lines.length; i++) {
        if (lines[i].startsWith('##')) break;
        if (lines[i].startsWith('---')) break;
        if (lines[i].trim()) value += (value ? '\n' : '') + lines[i].trim();
      }
      return value;
    };

    const targetAudience = extractSection('Target Audience');
    const personality = extractSection('Personality');
    const toneOfVoice = extractSection('Tone of Voice');
    const topicsExpertise = extractSection('Topics/Expertise');
    const defaultFormatRaw = extractSection('Default Format');
    const defaultCtaStyleRaw = extractSection('Default CTA Style');

    if (!targetAudience || !personality || !toneOfVoice) {
      return null;
    }

    // Parse created date
    const dateMatch = content.match(/\*Created: (\d{4}-\d{2}-\d{2})\*/);
    const createdAt = dateMatch ? dateMatch[1] : formatDate();

    return {
      id: 'default-user',
      targetAudience,
      personality,
      toneOfVoice,
      topicsExpertise: topicsExpertise === 'Not specified' ? null : topicsExpertise,
      defaultFormat: this.parseDefaultFormat(defaultFormatRaw),
      defaultCtaStyle: this.parseCtaStyle(defaultCtaStyleRaw),
      createdAt,
    };
  }

  private parseBrief(content: string, slug: string): Brief | null {
    const lines = content.split('\n');

    const extractField = (prefix: string): string => {
      const line = lines.find(l => l.startsWith(`**${prefix}**:`));
      return line ? line.replace(`**${prefix}**:`, '').trim() : '';
    };

    const topic = lines.find(l => l.startsWith('# Tweet Brief:'))
      ?.replace('# Tweet Brief:', '').trim() || slug;

    const createdAt = extractField('Created');
    const formatRaw = extractField('Format');
    const model = extractField('Model') || 'anthropic/claude-sonnet-4';
    const targetAudience = extractField('Target Audience');
    const personality = extractField('Personality');
    const tone = extractField('Tone');
    const ctaStyleRaw = extractField('CTA Style');
    const algoOptRaw = extractField('Algorithm Optimization');
    const topicSource = extractField('Topic Source');

    return {
      id: generateId(),
      slug,
      topic,
      format: (formatRaw.toLowerCase().includes('thread') || formatRaw.toLowerCase().includes('long')) ? 'long' : 'short',
      algorithmOptimization: algoOptRaw.toLowerCase() === 'yes',
      model,
      targetAudience,
      personality,
      tone,
      ctaStyle: this.parseCtaStyle(ctaStyleRaw),
      topicSource,
      createdAt,
    };
  }

  private parseDraft(content: string, slug: string, version: number): Draft | null {
    const { data, content: body } = matter(content);

    // Parse critique from frontmatter if it exists
    let critique = null;
    if (data.critique && typeof data.critique === 'object') {
      critique = data.critique;
    }

    return {
      id: generateId(),
      briefId: slug,
      slug,
      version,
      content: body.trim(),
      format: (data.format === 'thread' || data.format === 'long') ? 'long' : 'short',
      tweetCount: data.tweet_count || 1,
      qualityScore: typeof data.quality_score === 'number' ? data.quality_score : null,
      algorithmScore: typeof data.algorithm_score === 'number' ? data.algorithm_score : null,
      critique,
      createdAt: data.date || formatDate(),
    };
  }

  private parseTweet(content: string, slug: string, dateDir: string): Tweet | null {
    const { data, content: body } = matter(content);

    return {
      id: slug,
      briefId: '',
      title: data.title || slug,
      content: body.trim(),
      format: (data.format === 'thread' || data.format === 'long') ? 'long' : 'short',
      iterations: data.iterations || 1,
      finalScore: data.final_score || 0,
      algorithmOptimized: data.algorithm_optimized || false,
      publishedAt: data.published_at || dateDir,
    };
  }

  private parseDefaultFormat(raw: string): 'short' | 'long' | 'mix' {
    const lower = raw.toLowerCase();
    if (lower.includes('short') && !lower.includes('long')) return 'short';
    if (lower.includes('long') && !lower.includes('short')) return 'long';
    return 'mix';
  }

  private formatDefaultFormat(format: 'short' | 'long' | 'mix'): string {
    switch (format) {
      case 'short': return 'Short tweets only';
      case 'long': return 'Long tweets only';
      case 'mix': return 'Mix of both (short or long, choose per tweet)';
    }
  }

  private parseCtaStyle(raw: string): CTAStyle {
    const lower = raw.toLowerCase();
    if (lower.includes('engagement')) return 'engagement';
    if (lower.includes('follow')) return 'follow';
    if (lower.includes('link')) return 'link';
    if (lower.includes('varies')) return 'varies';
    return 'none';
  }

  private formatCtaStyle(style: CTAStyle): string {
    switch (style) {
      case 'engagement': return 'Ask questions / engagement-focused';
      case 'follow': return 'Follow for more';
      case 'link': return 'Link to resource';
      case 'none': return 'No CTA';
      case 'varies': return 'Varies by tweet';
    }
  }
}
