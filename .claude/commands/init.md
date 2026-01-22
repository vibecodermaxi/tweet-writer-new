---
description: Initialize a new tweet writing project in the current directory
allowed-tools: [Bash, Write]
model: haiku
---

# Initialize Tweet Writer

Set up a simple tweet writing project with the directory structure needed for iterative tweet creation.

## What This Does

1. Creates content directories (briefs/, drafts/, tweets/)
2. Creates checklists directory for algorithm optimization
3. Initializes git if needed
4. Creates .gitignore

## Setup Steps

```bash
# Create directories
mkdir -p content/{briefs,drafts,tweets}
mkdir -p checklists

# Create .gitkeep files
touch content/briefs/.gitkeep content/drafts/.gitkeep content/tweets/.gitkeep

# Initialize git if needed
if [ ! -d .git ]; then
  git init
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
  echo "# Tweet Writer" > .gitignore
  echo "node_modules/" >> .gitignore
  echo ".DS_Store" >> .gitignore
fi

echo "Tweet Writer initialized!"
echo ""
echo "Directory structure created:"
echo "  content/briefs/    - Tweet briefs"
echo "  content/drafts/    - Draft versions"
echo "  content/tweets/    - Final tweets (organized by date)"
echo "  checklists/        - Algorithm optimization criteria"
echo ""
echo "Run /tweet to create your first tweet or thread."
```

## After Initialization

Run `/tweet` to start creating tweets with the iterative quality loop.

Optional: Add your Twitter algorithm breakdown to `checklists/twitter-algorithm.md` and use `/tweet --algorithm-check` for algorithm-optimized content.
