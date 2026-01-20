import {
    ParsedData,
    AnalysisResult,
    CommunicationStyle,
    RelationshipAnalysis,
    TopicAnalysis,
    PersonalitySignals,
    TemporalPatterns,
    ConversationSample,
    DeepAnalysisResult,
} from '@/types/messages';

export function analyzeMessages(data: ParsedData, deepAnalysis?: DeepAnalysisResult): AnalysisResult {
    const myMessages = data.messages.filter(m => m.isFromMe);

    return {
        communicationStyle: analyzeCommunicationStyle(myMessages),
        relationships: analyzeRelationships(data),
        topics: analyzeTopics(myMessages),
        personality: analyzePersonality(myMessages),
        temporalPatterns: analyzeTemporalPatterns(data.messages),
        sampleConversations: extractSampleConversations(data),
        deepAnalysis,
    };
}

function analyzeCommunicationStyle(messages: any[]): CommunicationStyle {
    if (messages.length === 0) {
        return getDefaultCommunicationStyle();
    }

    const totalLength = messages.reduce((sum, m) => sum + m.text.length, 0);
    const averageMessageLength = Math.round(totalLength / messages.length);

    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const emojiCounts = new Map<string, number>();
    let totalEmojis = 0;

    for (const msg of messages) {
        const emojis = msg.text.match(emojiRegex) || [];
        totalEmojis += emojis.length;
        for (const emoji of emojis) {
            emojiCounts.set(emoji, (emojiCounts.get(emoji) || 0) + 1);
        }
    }

    const topEmojis = Array.from(emojiCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([emoji]) => emoji);

    const exclamationCount = messages.filter(m => m.text.includes('!')).length;
    const casualIndicators = ['lol', 'haha', 'omg', 'idk', 'tbh'];
    const casualCount = messages.filter(m =>
        casualIndicators.some(ind => m.text.toLowerCase().includes(ind))
    ).length;
    const casualRatio = casualCount / messages.length;

    let formality: 'casual' | 'moderate' | 'formal';
    if (casualRatio > 0.15) formality = 'casual';
    else if (casualRatio > 0.05) formality = 'moderate';
    else formality = 'formal';

    const avgWords = messages.reduce((sum, m) => sum + m.text.split(/\s+/).length, 0) / messages.length;
    let sentenceComplexity: 'simple' | 'moderate' | 'complex';
    if (avgWords < 5) sentenceComplexity = 'simple';
    else if (avgWords < 15) sentenceComplexity = 'moderate';
    else sentenceComplexity = 'complex';

    return {
        averageMessageLength,
        emojiUsage: {
            frequency: Number((totalEmojis / messages.length).toFixed(2)),
            topEmojis,
        },
        responsePatterns: {
            averageResponseTime: 'varies',
            quickResponder: averageMessageLength < 50,
        },
        punctuationStyle: {
            usesExclamations: exclamationCount / messages.length > 0.1,
            usesEllipsis: messages.filter(m => m.text.includes('...')).length / messages.length > 0.05,
            usesAllCaps: messages.filter(m => /\b[A-Z]{2,}\b/.test(m.text)).length / messages.length > 0.02,
        },
        formality,
        sentenceComplexity,
    };
}

function analyzeRelationships(data: ParsedData): RelationshipAnalysis[] {
    const handleStats = new Map<string, any>();

    for (const msg of data.messages) {
        const handle = msg.handleId;
        if (!handleStats.has(handle)) {
            handleStats.set(handle, { sent: 0, received: 0, messages: [], lastDate: msg.date });
        }

        const stats = handleStats.get(handle)!;
        if (msg.isFromMe) stats.sent++;
        else stats.received++;
        stats.messages.push(msg);
        if (msg.date > stats.lastDate) stats.lastDate = msg.date;
    }

    const relationships: RelationshipAnalysis[] = [];
    const now = new Date();

    for (const [handleId, stats] of handleStats.entries()) {
        if (handleId === 'unknown') continue;

        const totalMessages = stats.sent + stats.received;
        if (totalMessages < 5) continue;

        const daysSinceFirst = (now.getTime() - data.dateRange.start.getTime()) / (1000 * 60 * 60 * 24);
        const messagesPerDay = totalMessages / Math.max(daysSinceFirst, 1);

        let conversationFrequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
        if (messagesPerDay > 1) conversationFrequency = 'daily';
        else if (messagesPerDay > 0.14) conversationFrequency = 'weekly';
        else if (messagesPerDay > 0.03) conversationFrequency = 'monthly';
        else conversationFrequency = 'occasional';

        let relationshipType: 'close' | 'regular' | 'acquaintance';
        if (totalMessages > 500 || conversationFrequency === 'daily') relationshipType = 'close';
        else if (totalMessages > 50 || conversationFrequency === 'weekly') relationshipType = 'regular';
        else relationshipType = 'acquaintance';

        const handleInfo = data.handles.find(h => h.id === handleId);

        relationships.push({
            handleId,
            displayName: handleInfo?.displayName || handleId,
            messageCount: totalMessages,
            sentCount: stats.sent,
            receivedCount: stats.received,
            conversationFrequency,
            lastInteraction: stats.lastDate,
            topTopics: [],
            relationshipType,
        });
    }

    return relationships.sort((a, b) => b.messageCount - a.messageCount).slice(0, 20);
}

function analyzeTopics(messages: any[]): TopicAnalysis[] {
    const topicKeywords: Record<string, string[]> = {
        'Work & Career': ['work', 'job', 'meeting', 'boss', 'project'],
        'Social & Events': ['party', 'dinner', 'hangout', 'drinks', 'movie'],
        'Food & Dining': ['food', 'eat', 'restaurant', 'hungry', 'lunch'],
    };

    const topicCounts = new Map<string, { count: number; examples: string[] }>();

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
        topicCounts.set(topic, { count: 0, examples: [] });

        for (const msg of messages) {
            const lowerText = msg.text.toLowerCase();
            if (keywords.some(kw => lowerText.includes(kw))) {
                const data = topicCounts.get(topic)!;
                data.count++;
                if (data.examples.length < 3 && msg.text.length > 10 && msg.text.length < 200) {
                    data.examples.push(msg.text);
                }
            }
        }
    }

    return Array.from(topicCounts.entries())
        .filter(([, data]) => data.count > 0)
        .map(([topic, data]) => ({
            topic,
            frequency: data.count,
            keywords: topicKeywords[topic],
            sentiment: 'neutral' as const,
            examples: data.examples,
        }))
        .sort((a, b) => b.frequency - a.frequency);
}

function analyzePersonality(messages: any[]): PersonalitySignals {
    const traits: string[] = [];
    const questionCount = messages.filter(m => m.text.includes('?')).length;
    if (questionCount / messages.length > 0.2) traits.push('Curious and asks many questions');

    return {
        humorStyle: ['Conversational'],
        communicationTraits: traits.length > 0 ? traits : ['Balanced communication style'],
        interests: [],
        values: [],
        socialStyle: 'balanced',
    };
}

function analyzeTemporalPatterns(messages: any[]): TemporalPatterns {
    const hourCounts = new Array(24).fill(0);
    for (const msg of messages) {
        hourCounts[msg.date.getHours()]++;
    }

    const sortedHours = hourCounts
        .map((count, hour) => ({ hour, count }))
        .sort((a, b) => b.count - a.count);
    const mostActiveHours = sortedHours.slice(0, 3).map(h => h.hour);

    return {
        mostActiveHours,
        mostActiveDays: ['Monday', 'Tuesday', 'Wednesday'],
        averageMessagesPerDay: Math.round(messages.length / 365),
        peakActivityTimes: [],
    };
}

function extractSampleConversations(data: ParsedData): ConversationSample[] {
    return [];
}

function getDefaultCommunicationStyle(): CommunicationStyle {
    return {
        averageMessageLength: 0,
        emojiUsage: { frequency: 0, topEmojis: [] },
        responsePatterns: { averageResponseTime: 'unknown', quickResponder: false },
        punctuationStyle: { usesExclamations: false, usesEllipsis: false, usesAllCaps: false },
        formality: 'moderate',
        sentenceComplexity: 'moderate',
    };
}
