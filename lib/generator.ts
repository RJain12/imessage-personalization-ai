import {
    ParsedData,
    AnalysisResult,
    GeneratedContext,
    ContextSection,
    DeepAnalysisResult,
} from '@/types/messages';

export function generateContext(
    data: ParsedData,
    analysis: AnalysisResult
): GeneratedContext {
    const sections: ContextSection[] = [];

    if (analysis.deepAnalysis) {
        // Generate ChatGPT-optimized personalization profile
        sections.push(generateChatGPTPersonalizationProfile(analysis.deepAnalysis, data));
    } else {
        // Fallback to basic profile
        sections.push(generateBasicProfile(data, analysis));
    }

    const fullText = sections.map(s => s.content).join('\n\n');
    const tokenEstimate = estimateTokens(fullText);

    return {
        title: 'Personal Profile for AI Personalization',
        generatedAt: new Date(),
        tokenEstimate,
        sections,
        fullText,
    };
}

function generateChatGPTPersonalizationProfile(deep: DeepAnalysisResult, data: ParsedData): ContextSection {
    let content = '';

    // PERSONAL DETAILS
    content += `# PERSONAL INFORMATION\n\n`;
    if (deep.personalDetails.age) content += `Age: ${deep.personalDetails.age}\n`;
    if (deep.personalDetails.location) content += `Location: ${deep.personalDetails.location}\n`;
    if (deep.personalDetails.occupation) content += `Occupation: ${deep.personalDetails.occupation}\n`;
    if (deep.personalDetails.lifestyle) content += `Lifestyle: ${deep.personalDetails.lifestyle}\n`;
    if (deep.personalDetails.health) content += `Health: ${deep.personalDetails.health}\n`;
    content += `\n`;

    // FAMILY & RELATIONSHIPS
    if (deep.personalDetails.family.length > 0) {
        content += `## Family\n${deep.personalDetails.family.join(', ')}\n\n`;
    }

    if (deep.personalDetails.friends.length > 0) {
        content += `## Close Friends\n${deep.personalDetails.friends.join(', ')}\n\n`;
    }

    // INTERESTS & PREFERENCES
    content += `# INTERESTS & PREFERENCES\n\n`;
    if (deep.personalDetails.interests.length > 0) {
        content += `## Things I Like\n`;
        deep.personalDetails.interests.forEach((interest: string) => {
            content += `- ${interest}\n`;
        });
        content += `\n`;
    }

    if (deep.personalDetails.dislikes.length > 0) {
        content += `## Things I Don't Like\n`;
        deep.personalDetails.dislikes.forEach((dislike: string) => {
            content += `- ${dislike}\n`;
        });
        content += `\n`;
    }

    // COMMUNICATION STYLE
    content += `# HOW I COMMUNICATE\n\n`;
    content += `## Writing Style\n`;
    content += `- Sentence complexity: ${deep.communicationStyle.sentencePatterns.complexity}\n`;
    content += `- Average message length: ${deep.communicationStyle.sentencePatterns.averageLength} characters\n`;
    if (deep.communicationStyle.sentencePatterns.commonStructures.length > 0) {
        content += `- Common patterns: ${deep.communicationStyle.sentencePatterns.commonStructures.join(', ')}\n`;
    }
    content += `\n`;

    if (deep.communicationStyle.uniquePhrases.length > 0) {
        content += `## Phrases I Use Often\n`;
        deep.communicationStyle.uniquePhrases.slice(0, 10).forEach((phrase: string) => {
            content += `- "${phrase}"\n`;
        });
        content += `\n`;
    }

    if (deep.communicationStyle.slangAndAbbreviations.length > 0) {
        content += `## My Slang & Abbreviations\n`;
        deep.communicationStyle.slangAndAbbreviations.slice(0, 15).forEach(item => {
            content += `- ${item.term} (used ${item.frequency}x)\n`;
        });
        content += `\n`;
    }

    if (deep.communicationStyle.emojiReactionPatterns.favoriteEmojis.length > 0) {
        content += `## Emoji Usage\n`;
        deep.communicationStyle.emojiReactionPatterns.favoriteEmojis.slice(0, 10).forEach((item: { emoji: string, usage: string }) => {
            content += `- ${item.emoji}: ${item.usage}\n`;
        });
        content += `\n`;
    }

    // IMPORTANT RELATIONSHIPS
    if (deep.relationships.length > 0) {
        content += `# IMPORTANT RELATIONSHIPS\n\n`;
        deep.relationships.slice(0, 10).forEach((rel: any) => {
            content += `## ${rel.person}\n`;
            content += `- Importance: ${rel.importance}\n`;
            content += `- Dynamics: ${rel.dynamics}\n`;
            content += `- How I talk to them: ${rel.communicationDifferences}\n`;
            content += `- Topics we discuss: ${rel.topicsDiscussed.join(', ')}\n`;
            if (rel.insideJokes.length > 0) {
                content += `- Inside jokes: ${rel.insideJokes.join('; ')}\n`;
            }
            content += `\n`;
        });
    }

    // EMOTIONAL PATTERNS
    content += `# EMOTIONAL PATTERNS\n\n`;

    if (deep.emotionalFingerprint.excitementTriggers.length > 0) {
        content += `## What Excites Me\n`;
        deep.emotionalFingerprint.excitementTriggers.forEach((trigger: string) => {
            content += `- ${trigger}\n`;
        });
        content += `\n`;
    }

    if (deep.emotionalFingerprint.frustrationTriggers.length > 0) {
        content += `## What Frustrates Me\n`;
        deep.emotionalFingerprint.frustrationTriggers.forEach((trigger: string) => {
            content += `- ${trigger}\n`;
        });
        content += `\n`;
    }

    if (deep.emotionalFingerprint.calmingFactors.length > 0) {
        content += `## What Calms Me Down\n`;
        deep.emotionalFingerprint.calmingFactors.forEach((factor: string) => {
            content += `- ${factor}\n`;
        });
        content += `\n`;
    }

    content += `## How I Express Emotions\n`;
    Object.entries(deep.emotionalFingerprint.emotionalExpression).forEach(([emotion, expression]) => {
        content += `- ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}: ${expression}\n`;
    });
    content += `\n`;

    // DECISION PATTERNS
    content += `# HOW I MAKE DECISIONS\n\n`;
    content += `- Planning style: ${deep.decisionPatterns.planningStyle}\n`;
    content += `- Time management: ${deep.decisionPatterns.timeManagement}\n`;
    content += `- Purchasing behavior: ${deep.decisionPatterns.purchasingBehavior}\n`;
    if (deep.decisionPatterns.persuasionFactors.length > 0) {
        content += `- What convinces me: ${deep.decisionPatterns.persuasionFactors.join(', ')}\n`;
    }
    content += `\n`;

    // PERSONAL REFERENCES
    if (deep.personalReferences.recurringThemes.length > 0) {
        content += `# RECURRING THEMES IN MY LIFE\n`;
        deep.personalReferences.recurringThemes.slice(0, 10).forEach((theme: string) => {
            content += `- ${theme}\n`;
        });
        content += `\n`;
    }

    if (deep.personalReferences.importantPlaces.length > 0) {
        content += `# PLACES THAT MATTER TO ME\n`;
        deep.personalReferences.importantPlaces.slice(0, 10).forEach((place: string) => {
            content += `- ${place}\n`;
        });
        content += `\n`;
    }

    if (deep.personalReferences.significantEvents.length > 0) {
        content += `# SIGNIFICANT LIFE EVENTS\n`;
        deep.personalReferences.significantEvents.slice(0, 10).forEach((event: { event: string, timeframe: string }) => {
            content += `- ${event.timeframe}: ${event.event}\n`;
        });
        content += `\n`;
    }

    if (deep.personalReferences.insideJokes.length > 0) {
        content += `# INSIDE JOKES & REFERENCES\n`;
        deep.personalReferences.insideJokes.slice(0, 10).forEach((joke: { joke: string, context: string, people: string[] }) => {
            content += `- ${joke.joke} (with ${joke.people.join(', ')}): ${joke.context}\n`;
        });
        content += `\n`;
    }

    // COMPREHENSIVE PROFILE
    content += `# COMPREHENSIVE PROFILE\n\n`;
    content += deep.comprehensiveProfile;
    content += `\n\n`;

    // TOPIC ANALYSIS BY RELATIONSHIP
    if (deep.topicsByRelationship.length > 0) {
        content += `# WHAT I TALK ABOUT WITH DIFFERENT PEOPLE\n\n`;
        deep.topicsByRelationship.slice(0, 10).forEach((rel: any) => {
            content += `## Topics with ${rel.person}\n`;
            rel.topics.slice(0, 5).forEach((topic: any) => {
                content += `- ${topic.topic} (${topic.sentiment})\n`;
            });
            content += `\n`;
        });
    }

    // SENTIMENT ANALYSIS
    if (deep.sentimentAnalysis.length > 0) {
        content += `# EMOTIONAL DYNAMICS WITH PEOPLE\n\n`;
        deep.sentimentAnalysis.slice(0, 10).forEach((sent: any) => {
            content += `- ${sent.person}: ${sent.overallSentiment} (${Math.round(sent.positiveRatio * 100)}% positive)\n`;
            content += `  Trend: ${sent.emotionalTrends}\n`;
        });
        content += `\n`;
    }

    return {
        title: 'ChatGPT Personalization Profile',
        content,
        tokenEstimate: estimateTokens(content),
    };
}

function generateBasicProfile(data: ParsedData, analysis: AnalysisResult): ContextSection {
    const content = `# Basic Profile

Based on ${data.stats.totalMessages.toLocaleString()} messages over ${((data.dateRange.end.getTime() - data.dateRange.start.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)} years.

Communication style: ${analysis.communicationStyle.formality}
Message complexity: ${analysis.communicationStyle.sentenceComplexity}

For a comprehensive profile, enable AI analysis in Step 3.`;

    return {
        title: 'Basic Profile',
        content,
        tokenEstimate: estimateTokens(content),
    };
}

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

export function exportAsMarkdown(context: GeneratedContext): string {
    return `# ${context.title}

*Generated on ${context.generatedAt.toLocaleDateString()} at ${context.generatedAt.toLocaleTimeString()}*
*Estimated tokens: ${context.tokenEstimate.toLocaleString()}*

---

**HOW TO USE THIS IN CHATGPT:**

1. Go to ChatGPT Settings → Personalization
2. Click "More about you"
3. Paste the content below
4. ChatGPT will now understand you deeply!

---

${context.fullText}`;
}

export function exportAsPlainText(context: GeneratedContext): string {
    return context.fullText;
}
