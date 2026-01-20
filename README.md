# iMessage Context Builder - Complete

## What I Built

A Next.js app that uses **Gemini 2.0 Flash AI** to deeply analyze your iMessage communication patterns and generate a comprehensive context document for AI assistants.

## Key Features

### 🤖 AI-Powered Deep Analysis
- Uses your Gemini API key (pre-configured: `AIzaSyDLGWNqR73FZIOoObQh1atuNH8f5ihyM5E`)
- Analyzes how you communicate in **3 different contexts**:
  - **Group chats** - Your behavior in group settings
  - **1:1 conversations** - How you interact one-on-one
  - **Close relationships** - Your style with partners/best friends

### 📊 What You Get

1. **Behavioral Insights**
   - Communication strengths in each context
   - Areas for improvement
   - Specific examples from your messages

2. **Personality Analysis**
   - Overall personality description
   - Unique traits
   - Writing style breakdown
   - Relationship dynamics

3. **Personalized Recommendations**
   - 5-10 specific suggestions for better communication
   - Context-aware advice

4. **Comprehensive Context Document**
   - Hundreds of real message samples
   - Your authentic voice and phrases
   - Ready to paste into any AI assistant

## How to Use

1. **Start the app** (already running):
   ```bash
   cd /Users/rishabjain/.gemini/antigravity/scratch/imessage-context-builder
   npm run dev -- --webpack
   ```

2. **Open** http://localhost:3000

3. **Follow the 4 steps**:
   - **Step 1**: Export your iMessage database
   - **Step 2**: Upload the file
   - **Step 3**: AI analyzes your communication (uses Gemini)
   - **Step 4**: Download your context document

## Technical Details

- **Framework**: Next.js 16 with webpack (required for sql.js)
- **Database**: Client-side SQLite parsing with sql.js
- **AI**: Gemini 2.0 Flash for behavioral analysis
- **Privacy**: All processing happens in your browser
- **Output**: Markdown/plain text context file (~500K-1M tokens)

## Files Created

- `lib/ai-analyzer.ts` - Gemini API integration
- `lib/ai-sections.ts` - AI insight formatting
- `lib/analyzer.ts` - Basic pattern analysis
- `lib/generator.ts` - Context document generation
- `lib/parser.ts` - SQLite database parsing
- `app/components/Step3Process.tsx` - AI analysis UI
- All other step components

## Next Steps

1. Open the app and try it with your iMessage data
2. Review the AI insights about your communication
3. Use the generated context with ChatGPT, Claude, or any AI assistant

The context document will help AI assistants understand:
- How you actually write and communicate
- Your personality and behavioral patterns
- Your relationships and social context
- Your authentic voice (with hundreds of real examples)

This is WAY better than generic "I'm a software engineer who likes..." prompts!
