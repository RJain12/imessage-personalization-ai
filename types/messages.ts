// TypeScript interfaces for iMessage data structures

export interface ParsedMessage {
  id: number;
  text: string;
  date: Date;
  isFromMe: boolean;
  handleId: string;
  chatId: number;
  isGroupChat: boolean;
  chatName?: string;
}

export interface ChatInfo {
  id: number;
  name: string;
  isGroupChat: boolean;
  participantCount: number;
  messageCount: number;
  handles: string[];
}

export interface HandleInfo {
  id: string;
  displayName: string;
  messageCount: number;
  isPhone: boolean;
}

export interface ParsedData {
  messages: ParsedMessage[];
  chats: ChatInfo[];
  handles: HandleInfo[];
  dateRange: {
    start: Date;
    end: Date;
  };
  stats: {
    totalMessages: number;
    sentMessages: number;
    receivedMessages: number;
    groupMessages: number;
    directMessages: number;
  };
}

export interface AnalysisResult {
  communicationStyle: CommunicationStyle;
  relationships: RelationshipAnalysis[];
  topics: TopicAnalysis[];
  personality: PersonalitySignals;
  temporalPatterns: TemporalPatterns;
  sampleConversations: ConversationSample[];
  deepAnalysis?: DeepAnalysisResult;
}

export interface AIAnalysisResult {
  overallPersonality: string;
  communicationPatterns: {
    groupChats: {
      style: string;
      examples: string[];
      strengths: string[];
      areasForImprovement: string[];
    };
    oneOnOne: {
      style: string;
      examples: string[];
      strengths: string[];
      areasForImprovement: string[];
    };
    closeRelationships: {
      style: string;
      examples: string[];
      strengths: string[];
      areasForImprovement: string[];
    };
  };
  writingStyle: {
    vocabulary: string;
    sentenceStructure: string;
    emotionalExpression: string;
    humor: string;
  };
  relationshipDynamics: {
    initiationStyle: string;
    responsePatterns: string;
    conflictHandling: string;
    supportGiving: string;
  };
  uniqueTraits: string[];
  recommendations: string[];
  comprehensiveProfile: string;
}

export interface CommunicationStyle {
  averageMessageLength: number;
  emojiUsage: {
    frequency: number;
    topEmojis: string[];
  };
  responsePatterns: {
    averageResponseTime: string;
    quickResponder: boolean;
  };
  punctuationStyle: {
    usesExclamations: boolean;
    usesEllipsis: boolean;
    usesAllCaps: boolean;
  };
  formality: 'casual' | 'moderate' | 'formal';
  sentenceComplexity: 'simple' | 'moderate' | 'complex';
}

export interface RelationshipAnalysis {
  handleId: string;
  displayName: string;
  messageCount: number;
  sentCount: number;
  receivedCount: number;
  conversationFrequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
  lastInteraction: Date;
  topTopics: string[];
  relationshipType: 'close' | 'regular' | 'acquaintance';
}

export interface TopicAnalysis {
  topic: string;
  frequency: number;
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  examples: string[];
}

export interface PersonalitySignals {
  humorStyle: string[];
  communicationTraits: string[];
  interests: string[];
  values: string[];
  socialStyle: 'extroverted' | 'introverted' | 'balanced';
}

export interface DeepAnalysisResult {
  communicationStyle: {
    sentencePatterns: {
      averageLength: number;
      complexity: string;
      commonStructures: string[];
    };
    emojiReactionPatterns: {
      favoriteEmojis: { emoji: string; usage: string }[];
      contextualUsage: string;
    };
    responseTimingHabits: string;
    slangAndAbbreviations: { term: string; frequency: number }[];
    uniquePhrases: string[];
  };
  relationships: {
    person: string;
    importance: string;
    dynamics: string;
    communicationDifferences: string;
    topicsDiscussed: string[];
    emotionalTone: string;
    insideJokes: string[];
  }[];
  personalReferences: {
    insideJokes: { joke: string; context: string; people: string[] }[];
    recurringThemes: string[];
    importantPlaces: string[];
    significantEvents: { event: string; timeframe: string }[];
    personalTimeline: string;
  };
  decisionPatterns: {
    planningStyle: string;
    persuasionFactors: string[];
    purchasingBehavior: string;
    timeManagement: string;
  };
  emotionalFingerprint: {
    excitementTriggers: string[];
    frustrationTriggers: string[];
    emotionalExpression: {
      happiness: string;
      sadness: string;
      anger: string;
    };
    calmingFactors: string[];
    stressIndicators: string[];
  };
  personalDetails: {
    age: string;
    location: string;
    family: string[];
    friends: string[];
    interests: string[];
    dislikes: string[];
    health: string;
    occupation: string;
    lifestyle: string;
  };
  comprehensiveProfile: string;
  professionalGrowth: string;
  clarityAnalysis: string;
  topicsByRelationship: {
    person: string;
    topics: { topic: string; frequency: number; sentiment: string }[];
  }[];
  sentimentAnalysis: {
    person: string;
    overallSentiment: string;
    positiveRatio: number;
    emotionalTrends: string;
  }[];
}


export interface TemporalPatterns {
  mostActiveHours: number[];
  mostActiveDays: string[];
  averageMessagesPerDay: number;
  peakActivityTimes: string[];
}

export interface ConversationSample {
  context: string;
  messages: {
    isFromMe: boolean;
    text: string;
  }[];
  demonstratesTraits: string[];
}

export interface GeneratedContext {
  title: string;
  generatedAt: Date;
  tokenEstimate: number;
  sections: ContextSection[];
  fullText: string;
}

export interface ContextSection {
  title: string;
  content: string;
  tokenEstimate: number;
}

export type StepId = 'export' | 'upload' | 'selectPerson' | 'process' | 'generate';

export interface StepState {
  currentStep: StepId;
  completedSteps: StepId[];
  parsedData: ParsedData | null;
  selectedName: string | null;
  analysisResult: AnalysisResult | null;
  generatedContext: GeneratedContext | null;
  error: string | null;
  isProcessing: boolean;
}
