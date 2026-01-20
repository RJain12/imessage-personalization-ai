'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnalysisResult } from '@/types/messages';

interface Step4GenerateProps {
    analysisResult: AnalysisResult;
    onBack: () => void;
    onStartOver: () => void;
}

type TabType = 'profile' | 'essay' | 'professional' | 'clarity';

export default function Step4Generate({ analysisResult, onBack, onStartOver }: Step4GenerateProps) {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [copied, setCopied] = useState(false);

    const deep = analysisResult.deepAnalysis;
    if (!deep) return null;

    const technicalProfile = generateTechnicalProfile(deep);

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const renderContent = (content: string, type: string) => (
        <div className="fade-in markdown-container">
            <div className="report-header">
                <h3>{type}</h3>
                <button className="btn btn-sm" onClick={() => handleCopy(content)}>
                    {copied ? '✓ Copied' : '📋 Copy'}
                </button>
            </div>
            <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
        </div>
    );

    return (
        <div className="card fade-in">
            <div className="card-section">
                <h2>Intelligence Report</h2>
                <p className="text-sm opacity-60">
                    Your iMessage history has been transformed. Browse the tabs below to explore your profile.
                </p>
            </div>

            <div className="card-section" style={{ padding: 0 }}>
                {/* Navigation Tabs */}
                <div className="tab-navigation">
                    <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label="✨ Profile" />
                    <TabButton active={activeTab === 'essay'} onClick={() => setActiveTab('essay')} label="📖 Analysis" />
                    <TabButton active={activeTab === 'professional'} onClick={() => setActiveTab('professional')} label="💼 Career" />
                    <TabButton active={activeTab === 'clarity'} onClick={() => setActiveTab('clarity')} label="🔍 Clarity" />
                </div>

                <div style={{ padding: '2rem 1.5rem' }}>
                    {activeTab === 'profile' && (
                        <div className="fade-in">
                            <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                                <strong>Technical Manual</strong>: Optimized for <strong>AI Personalization</strong>. Copy this into ChatGPT or Claude settings.
                            </div>
                            <pre className="technical-pre">
                                {technicalProfile}
                            </pre>
                            <button className="btn btn-primary" onClick={() => handleCopy(technicalProfile)} style={{ width: '100%', marginTop: '1rem' }}>
                                {copied ? '✓ Copied Manual' : '📋 Copy Technical Manual'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'essay' && renderContent(deep.comprehensiveProfile, "Character Portrait")}
                    {activeTab === 'professional' && renderContent(deep.professionalGrowth, "Professional Growth Strategy")}
                    {activeTab === 'clarity' && renderContent(deep.clarityAnalysis, "Communication Clarity Audit")}
                </div>
            </div>

            <div className="action-row" style={{ padding: '1.5rem' }}>
                <button className="btn" onClick={onBack}>
                    ← Back
                </button>
                <button className="btn" onClick={onStartOver}>
                    Start Over
                </button>
            </div>

            <style jsx>{`
                .tab-navigation {
                    display: flex;
                    gap: 1px;
                    background: rgba(0,0,0,0.05);
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    overflow-x: auto;
                }
                .technical-pre {
                    margin: 0;
                    padding: 1.5rem;
                    background: var(--gray-900);
                    color: #fff;
                    font-size: 0.8rem;
                    border-radius: 4px;
                    line-height: 1.5;
                    white-space: pre-wrap;
                    font-family: 'JetBrains Mono', monospace;
                }
                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 0.75rem;
                }
                .report-header h3 {
                    margin: 0;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .markdown-body {
                    font-family: serif;
                    line-height: 1.8;
                    font-size: 1.05rem;
                    color: #222;
                }
                .markdown-body :global(p) {
                    margin-bottom: 1.25rem;
                }
                .markdown-body :global(h1), .markdown-body :global(h2), .markdown-body :global(h3) {
                    font-family: 'JetBrains Mono', monospace;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    font-size: 1rem;
                }
                .markdown-body :global(ul), .markdown-body :global(ol) {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }
                .markdown-body :global(li) {
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>
    );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                padding: '1rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: active ? '#fff' : 'transparent',
                color: active ? '#000' : '#666',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
                whiteSpace: 'nowrap',
                borderBottom: active ? '2px solid #000' : 'none'
            }}
        >
            {label}
        </button>
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

    p += `[INSTRUCTIONS FOR AI]\n`;
    p += `1. Mirror the user's level of directness and enthusiasm.\n`;
    p += `2. If using emojis, use them ${deep.communicationStyle?.emojiReactionPatterns?.contextualUsage?.includes('sparing') ? 'sparingly' : 'naturally'} per user habits.\n`;
    p += `3. Prioritize context related to ${deep.personalDetails?.interests?.slice(0, 3).join(' and ') || 'user interests'}.`;

    return p;
}
