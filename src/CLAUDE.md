# Tweet Writer Web App

AI-powered tweet creation with iterative quality improvement.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Backend**: Server Actions
- **Storage**: Local files (switchable to Supabase via Repository pattern)
- **Auth**: Clerk scaffolding (not yet implemented)
- **State**: Zustand for client state
- **AI**: OpenRouter API (supports multiple models: Claude, GPT-4, Gemini, Llama, etc.)

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Dashboard
│   ├── profile/page.tsx      # Profile setup/edit
│   ├── create/page.tsx       # Tweet creation wizard
│   ├── drafts/
│   │   ├── page.tsx          # Draft list
│   │   └── [slug]/page.tsx   # Draft editor
│   └── tweets/
│       ├── page.tsx          # Tweet archive
│       └── [id]/page.tsx     # Tweet detail
│
├── lib/
│   ├── data/                 # Data abstraction layer
│   │   ├── types.ts          # TypeScript interfaces
│   │   ├── storage-adapter.ts # Factory for storage adapters
│   │   ├── file-adapter.ts   # Local file implementation
│   │   └── supabase-adapter.ts # Stub for future Supabase
│   │
│   ├── actions/              # Server Actions
│   │   ├── profile.ts
│   │   ├── brief.ts
│   │   ├── draft.ts
│   │   └── tweet.ts
│   │
│   ├── ai/                   # AI generation logic
│   │   ├── client.ts         # OpenRouter API client
│   │   └── prompts/index.ts
│   │
│   ├── validators/           # Zod schemas
│   ├── auth.ts               # Clerk scaffolding
│   └── constants.ts          # Quality criteria + model options
│
├── components/
│   ├── ui/                   # Shadcn/ui components
│   ├── navigation.tsx        # Main nav
│   ├── profile/              # Profile form
│   ├── create/               # Creation wizard with model selection
│   ├── draft/                # Editor, checklist, history
│   └── tweet/                # Cards, list
│
└── stores/                   # Zustand
    └── draft-store.ts
```

## Commands

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
OPENROUTER_API_KEY=your_api_key  # Required - get from https://openrouter.ai/keys
SITE_URL=http://localhost:3000   # Your site URL for OpenRouter tracking
STORAGE_TYPE=file                # 'file' or 'supabase'
```

## Supported AI Models

The app supports model selection via OpenRouter. Available models:
- **Claude Sonnet 4** (default) - Anthropic's latest balanced model
- **Claude 3.5 Sonnet** - Fast and capable
- **GPT-4o** - OpenAI's multimodal flagship
- **GPT-4o Mini** - Fast and affordable
- **Gemini 2.0 Flash** - Google's fast model
- **Gemini Pro 1.5** - Google's advanced model
- **Llama 3.3 70B** - Meta's open-weight model
- **DeepSeek Chat** - Cost-effective reasoning
- **Grok 2** - xAI's conversational model

Model is selected per-tweet during the creation wizard.

## Data Flow

1. **Profile** → User sets audience, tone, preferences → stored in `../UserInfo.md`
2. **Create** → User enters topic + selects model → creates brief in `../content/briefs/`
3. **Generate** → Selected model creates first draft → saved in `../content/drafts/`
4. **Evaluate** → Model critiques against 7 quality criteria
5. **Iterate** → Model improves draft until 6/7+ criteria pass
6. **Publish** → Final tweet saved to `../content/tweets/YYYY-MM-DD/`

## Quality Criteria

7 base criteria evaluated for each draft:
- Strong Hook
- Clear Single Point
- Authentic Voice
- Value Delivery
- Proper Formatting
- Engagement Worthy
- Length Appropriate

Optional 6 algorithm optimization criteria when enabled.

## Storage Adapter Pattern

The app uses a repository pattern for storage. To switch from file to Supabase:

1. Set `STORAGE_TYPE=supabase` in `.env.local`
2. Implement `lib/data/supabase-adapter.ts`
3. Run SQL schema from the adapter file comments

## Key Files to Know

- `lib/ai/client.ts` - OpenRouter API client for generation and critique
- `lib/ai/prompts/index.ts` - Prompt templates
- `lib/constants.ts` - Model options, quality criteria
- `lib/data/file-adapter.ts` - File storage implementation
- `components/create/create-wizard.tsx` - Creation wizard with model selection
- `components/draft/draft-editor.tsx` - Main editing interface
- `components/draft/quality-checklist.tsx` - Quality score display
