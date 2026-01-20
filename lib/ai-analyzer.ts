'use client';

import { ParsedData, DeepAnalysisResult } from '@/types/messages';

export async function analyzeWithGeminiDeep(
    data: ParsedData,
    selectedName: string
): Promise<DeepAnalysisResult> {
    // Filter out spam numbers (5-6 digit numbers like 718212 or 54321)
    const filteredMessages = data.messages.filter(msg => {
        // Skip messages from 5-6 digit spam numbers
        if (/^\d{5,6}$/.test(msg.handleId)) return false;
        return true;
    });

    const myMessages = filteredMessages.filter(m => m.isFromMe);

    // Categorize messages by relationship for diversity check
    const messagesByPerson = new Map<string, any[]>();
    for (const msg of filteredMessages) {
        if (!msg.isFromMe) continue;
        const key = msg.handleId;

        // Skip if it's just a phone number without a name (basic check)
        const handleInfo = data.handles.find(h => h.id === key);
        if (handleInfo && /^\+?\d+$/.test(handleInfo.displayName) && handleInfo.displayName.length > 10) continue;

        if (!messagesByPerson.has(key)) {
            messagesByPerson.set(key, []);
        }
        messagesByPerson.get(key)!.push(msg);
    }

    // Get top relationships
    const topRelationships = Array.from(messagesByPerson.entries())
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 15);

    // Diverse sampling: Take messages from many different people/chats
    const diverseSample: string[] = [];
    const persons = Array.from(messagesByPerson.keys());
    let personIdx = 0;
    while (diverseSample.length < 500 && persons.length > 0) {
        const personKey = persons[personIdx % persons.length];
        const personMsgs = messagesByPerson.get(personKey)!;
        if (personMsgs.length > 0) {
            const msg = personMsgs.pop();
            if (msg && msg.text && msg.text.length > 10) {
                diverseSample.push(`[To ${personKey}]: ${msg.text}`);
            }
        } else {
            persons.splice(personIdx % persons.length, 1);
            continue;
        }
        personIdx++;
    }

    // Get recent messages and more conversation samples across different chats
    const recentMessages = myMessages.slice(-300);
    const conversationSamples = extractDiverseConversationSamples(filteredMessages, 40);

    // Build comprehensive prompt
    const prompt = buildDeepAnalysisPrompt(
        data,
        selectedName,
        recentMessages,
        diverseSample,
        conversationSamples,
        topRelationships
    );

    // Call our local API route to hide the API key from the network tab
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Analysis error: ${error}`);
    }

    const result = await response.json();
    return parseDeepAnalysisResponse(result.text);
}

function extractDiverseConversationSamples(messages: any[], count: number): Array<{ context: string, messages: Array<{ isFromMe: boolean, text: string }> }> {
    const conversationsByChat = new Map<number, any[]>();
    let current: any[] = [];
    const GAP_THRESHOLD = 30 * 60 * 1000;

    for (const msg of messages) {
        if (current.length === 0) {
            current.push(msg);
        } else {
            const last = current[current.length - 1];
            const gap = msg.date.getTime() - last.date.getTime();

            if (gap > GAP_THRESHOLD || msg.chatId !== last.chatId) {
                if (current.length >= 3 && current.length <= 15) {
                    if (!conversationsByChat.has(last.chatId)) {
                        conversationsByChat.set(last.chatId, []);
                    }
                    conversationsByChat.get(last.chatId)!.push({
                        context: `${last.isGroupChat ? 'Group chat' : '1:1'} from ${last.date.toLocaleDateString()}`,
                        messages: current.map(m => ({ isFromMe: m.isFromMe, text: m.text }))
                    });
                }
                current = [msg];
            } else {
                current.push(msg);
            }
        }
    }

    // Flatten and diversify
    const allConvs: any[] = [];
    const chatIds = Array.from(conversationsByChat.keys());
    let chatIdx = 0;
    while (allConvs.length < count && chatIds.length > 0) {
        const chatId = chatIds[chatIdx % chatIds.length];
        const chatConvs = conversationsByChat.get(chatId)!;
        if (chatConvs.length > 0) {
            allConvs.push(chatConvs.pop());
        } else {
            chatIds.splice(chatIdx % chatIds.length, 1);
            continue;
        }
        chatIdx++;
    }

    return allConvs;
}

function buildDeepAnalysisPrompt(
    data: ParsedData,
    selectedName: string,
    recentMessages: any[],
    diverseSample: string[],
    conversations: any[],
    topRelationships: Array<[string, any[]]>
): string {
    const handleMap = new Map(data.handles.map(h => [h.id, h.displayName]));

    return `You are analyzing ${selectedName}'s iMessage history to create a COMPREHENSIVE PERSONAL PROFILE for AI personalization. 

**IMPORTANT CONTEXT:**
- User Name: ${selectedName}
- Focus on ENDURING characteristics, values, and long-term communication habits.
- IGNORE temporary logistical topics (appointments, flights, one-off plans).

# DATASET STATS
- Total messages: ${data.stats.totalMessages.toLocaleString()}
- Time span: ${((data.dateRange.end.getTime() - data.dateRange.start.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)} years

# DIVERSE MESSAGE SAMPLES (Across different people/chats)
${diverseSample.slice(0, 300).join('\n')}

# RECENT MESSAGES
${recentMessages.slice(-150).map((m, i) => `${i + 1}. ${m.text}`).join('\n')}

# CONVERSATION EXAMPLES (Strategic context)
${conversations.slice(0, 20).map((conv, i) => `
## Conv ${i + 1}: ${conv.context}
${conv.messages.map((m: any) => `${m.isFromMe ? `[${selectedName}]` : '[THEM]'}: ${m.text}`).join('\n')}
`).join('\n')}

# TOP RELATIONSHIPS
${topRelationships.slice(0, 10).map(([id, msgs]) => `
**${handleMap.get(id) || id}**: ${msgs.length} messages
Sample: ${msgs.slice(-5).map((m: any) => m.text).join(' | ')}
`).join('\n')}

# TASK
Produce a deeply insightful character study and communication manual for ${selectedName}. 

Your output MUST be a JSON object with this EXACT structure (Use Markdown formatting like headers, bolding, and lists INSIDE the string values for nicer rendering):
{
  "comprehensiveProfile": "1200+ word narrative essay character study with Markdown headers and formatting...",
  "professionalGrowth": "400-word professional communication analysis with Markdown formatting...",
  "clarityAnalysis": "Identification of communication blindspots with Markdown formatting...",
  "communicationStyle": {
    "sentencePatterns": { "averageLength": number, "complexity": "string", "commonStructures": ["string"] },
    "emojiReactionPatterns": { "favoriteEmojis": [{ "emoji": "string", "usage": "string" }], "contextualUsage": "string" },
    "responseTimingHabits": "string",
    "slangAndAbbreviations": [{ "term": "string", "frequency": number }],
    "uniquePhrases": ["string"]
  },
  "relationships": [
    { "person": "string", "importance": "string", "dynamics": "string", "communicationDifferences": "string", "topicsDiscussed": ["string"], "emotionalTone": "string", "insideJokes": ["string"] }
  ],
  "personalReferences": {
    "insideJokes": [{ "joke": "string", "context": "string", "people": ["string"] }],
    "recurringThemes": ["string"],
    "importantPlaces": ["string"],
    "significantEvents": [{ "event": "string", "timeframe": "string" }],
    "personalTimeline": "string"
  },
  "decisionPatterns": {
    "planningStyle": "string",
    "persuasionFactors": ["string"],
    "purchasingBehavior": "string",
    "timeManagement": "string"
  },
  "emotionalFingerprint": {
    "excitementTriggers": ["string"],
    "frustrationTriggers": ["string"],
    "emotionalExpression": { "happiness": "string", "sadness": "string", "anger": "string" },
    "calmingFactors": ["string"],
    "stressIndicators": ["string"]
  },
  "personalDetails": {
    "age": "string",
    "location": "string",
    "family": ["string"],
    "friends": ["string"],
    "interests": ["string"],
    "dislikes": ["string"],
    "health": "string",
    "occupation": "string",
    "lifestyle": "string"
  }
}

DATA SAMPLES FOR ANALYSIS:
- DIVERSE SAMPLES: ${diverseSample.slice(0, 400).join(' | ')}
- CONVERSATION FLOWS: ${conversations.slice(0, 25).map(c => c.messages.map((m: any) => m.text).join(' -> ')).join('\n\n')}

Return ONLY the JSON.`;
}

function parseDeepAnalysisResponse(text: string): DeepAnalysisResult {
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? jsonMatch[0] : text;
        return JSON.parse(jsonText) as DeepAnalysisResult;
    } catch (error) {
        console.error('Failed to parse Gemini response:', error);
        throw new Error('Failed to parse AI analysis. Please try again.');
    }
}
