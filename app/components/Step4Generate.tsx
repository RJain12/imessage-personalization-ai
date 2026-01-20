'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/types/messages';

interface Step4GenerateProps {
    analysisResult: AnalysisResult;
    onComplete: () => void;
    onBack: () => void;
}

export default function Step4Generate({ analysisResult, onComplete, onBack }: Step4GenerateProps) {
    const [copied, setCopied] = useState(false);

    const deep = analysisResult.deepAnalysis;
    if (!deep) return null;

    const technicalProfile = generateTechnicalProfile(deep);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(technicalProfile);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="card fade-in">
            <div className="card-section">
                <h2>Step 5: Your AI Personalization Profile</h2>
                <p className="text-sm opacity-60">
                    This is your high-precision technical manual. Use it to bootstrap any AI (ChatGPT, Claude, Gemini) with your unique identity.
                </p>
            </div>

            <div className="card-section">
                <div className="alert alert-info">
                    <strong>Technical Manual</strong>: Optimized for <strong>AI Personalization</strong>. Copy this into your AI's settings or system prompt.
                </div>

                <pre className="technical-pre">
                    {technicalProfile}
                </pre>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="btn btn-primary" onClick={handleCopy} style={{ flex: 1 }}>
                        {copied ? '✓ Copied Manual' : '📋 Copy Technical Manual'}
                    </button>
                    <button className="btn" onClick={onComplete} style={{ flex: 1, background: '#000', color: '#fff' }}>
                        View Deep Intelligence Report →
                    </button>
                </div>
            </div>

            <div className="action-row">
                <button className="btn" onClick={onBack}>
                    ← Back
                </button>
            </div>

            <style jsx>{`
                .technical-pre {
                    margin: 0;
                    padding: 1.5rem;
                    background: var(--gray-900);
                    color: #fff;
                    font-size: 0.85rem;
                    border-radius: 4px;
                    line-height: 1.6;
                    white-space: pre-wrap;
                    font-family: 'JetBrains Mono', monospace;
                    border: 1px solid rgba(255,255,255,0.1);
                    max-height: 500px;
                    overflow: auto;
                }
            `}</style>
        </div>
    );
}

function generateTechnicalProfile(deep: any): string {
    let p = `### USER PERSONALITY & COMMUNICATION MANUAL ###\n\n`;

    p += `[CORE STYLE]\n`;
    p += `- Tonal complexity: ${deep.communicationStyle?.sentencePatterns?.complexity || 'moderate'}\n`;
    p += `- Response habits: ${deep.communicationStyle?.responseTimingHabits || 'N/A'}\n`;
    p += `- Linguistic signatures: ${deep.communicationStyle?.uniquePhrases?.slice(0, 10).join(', ') || 'N/A'}\n\n`;

    p += `[VALUES & INTERESTS]\n`;
    if (deep.personalDetails?.interests) p += `- Top Interests: ${deep.personalDetails.interests.join(', ')}\n`;
    if (deep.personalDetails?.lifestyle) p += `- Lifestyle: ${deep.personalDetails.lifestyle}\n\n`;

    p += `[EMOTIONAL FINGERPRINT]\n`;
    if (deep.emotionalFingerprint?.excitementTriggers) p += `- Excitement: ${deep.emotionalFingerprint.excitementTriggers.join(', ')}\n`;
    if (deep.emotionalFingerprint?.frustrationTriggers) p += `- Frustration: ${deep.emotionalFingerprint.frustrationTriggers.join(', ')}\n\n`;

    p += `[DECISION MAKING]\n`;
    if (deep.decisionPatterns?.planningStyle) p += `- Style: ${deep.decisionPatterns.planningStyle}\n`;
    if (deep.decisionPatterns?.timeManagement) p += `- Approach: ${deep.decisionPatterns.timeManagement}\n\n`;

    p += `[INSTRUCTIONAL BRAIN]\n`;
    p += `1. Mirror user directness and tone.\n`;
    p += `2. If using emojis, use them ${deep.communicationStyle?.emojiReactionPatterns?.contextualUsage?.includes('sparing') ? 'sparingly' : 'naturally'}.\n`;
    p += `3. Prioritize context related to ${deep.personalDetails?.interests?.slice(0, 3).join(' and ') || 'user interests'}.`;

    return p;
}
