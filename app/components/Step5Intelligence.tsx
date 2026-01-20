'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnalysisResult } from '@/types/messages';

interface Step5IntelligenceProps {
    analysisResult: AnalysisResult;
    onBack: () => void;
    onStartOver: () => void;
}

type TabType = 'strengths' | 'flaws';

export default function Step5Intelligence({ analysisResult, onBack, onStartOver }: Step5IntelligenceProps) {
    const [activeTab, setActiveTab] = useState<TabType>('strengths');
    const [copied, setCopied] = useState(false);

    const deep = analysisResult.deepAnalysis;
    if (!deep) return null;

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
                    {copied ? '✓ Copied' : '📋 Copy Report'}
                </button>
            </div>
            <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>

            <div style={{ marginTop: '4rem', padding: '2rem', border: '1px solid #000', textAlign: 'center' }}>
                <h4 style={{ marginBottom: '1rem' }}>Found this insightful?</h4>
                <p className="opacity-60">This project is open-source. A star on GitHub goes a long way!</p>
                <a
                    href="https://github.com/RJain12/imessage-personalization-ai"
                    target="_blank"
                    className="btn btn-primary"
                    style={{ marginTop: '0.5rem' }}
                >
                    ⭐ Star on GitHub
                </a>
            </div>
        </div>
    );

    return (
        <div className="card fade-in">
            <div className="card-section">
                <h2>Intelligence Insights</h2>
                <p className="text-sm opacity-60">
                    A sophisticated character study of who you are, addressed directly to you.
                </p>
            </div>

            <div className="card-section" style={{ padding: 0 }}>
                {/* Navigation Tabs */}
                <div className="tab-navigation">
                    <TabButton active={activeTab === 'strengths'} onClick={() => setActiveTab('strengths')} label="💪 Your Strengths" />
                    <TabButton active={activeTab === 'flaws'} onClick={() => setActiveTab('flaws')} label="⚠️ Your Flaws" />
                </div>

                <div style={{ padding: '2.5rem 2rem', background: '#fff' }}>
                    {activeTab === 'strengths' && renderContent(deep.strengthsReport, "Communication Strengths")}
                    {activeTab === 'flaws' && renderContent(deep.flawsReport, "Communication Flaws")}
                </div>
            </div>

            <div className="action-row" style={{ padding: '1.5rem' }}>
                <button className="btn" onClick={onBack}>
                    ← Back to Profile
                </button>
                <button className="btn" onClick={onStartOver}>
                    Start Over
                </button>
            </div>

            <style jsx>{`
                .tab-navigation {
                    display: flex;
                    gap: 1px;
                    background: var(--gray-100);
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                }
                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 1rem;
                }
                .report-header h3 {
                    margin: 0;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #666;
                }
                .markdown-body {
                    font-family: 'Charter', 'Georgia', serif;
                    line-height: 1.9;
                    font-size: 1.15rem;
                    color: #1a1a1a;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .markdown-body :global(p) {
                    margin-bottom: 1.75rem;
                }
                .markdown-body :global(h1), .markdown-body :global(h2), .markdown-body :global(h3) {
                    font-family: 'JetBrains Mono', monospace;
                    margin-top: 2.5rem;
                    margin-bottom: 1.25rem;
                    font-size: 1.1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .markdown-body :global(ul), .markdown-body :global(ol) {
                    margin-bottom: 2rem;
                    padding-left: 1.5rem;
                }
                .markdown-body :global(li) {
                    margin-bottom: 0.75rem;
                }
                .markdown-body :global(strong) {
                    color: #000;
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
                padding: '1.25rem',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: active ? '#fff' : 'transparent',
                color: active ? '#000' : '#888',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                borderBottom: active ? '3px solid #000' : 'none'
            }}
        >
            {label}
        </button>
    );
}
