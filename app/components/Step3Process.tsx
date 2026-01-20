'use client';

import { useState } from 'react';
import { ParsedData, AnalysisResult, DeepAnalysisResult } from '@/types/messages';
import { analyzeMessages } from '@/lib/analyzer';
import { analyzeWithGeminiDeep } from '@/lib/ai-analyzer';

interface Step3ProcessProps {
    parsedData: ParsedData;
    selectedName: string;
    onComplete: (analysis: AnalysisResult) => void;
    onBack: () => void;
}

export default function Step3Process({ parsedData, selectedName, onComplete, onBack }: Step3ProcessProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentPhase, setCurrentPhase] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [deepAnalysis, setDeepAnalysis] = useState<DeepAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);


    const handleStartAnalysis = async () => {
        setIsAnalyzing(true);
        setError(null);

        try {
            setCurrentPhase('Preparing message data for deep analysis...');
            setProgress(10);
            await new Promise((resolve) => setTimeout(resolve, 300));

            setCurrentPhase(`Analyzing ${selectedName}'s communication with Gemini 2.5 Flash Lite...`);
            setProgress(20);

            let deepResult: DeepAnalysisResult | undefined;
            try {
                deepResult = await analyzeWithGeminiDeep(parsedData, selectedName);
                setDeepAnalysis(deepResult);
                setProgress(80);
            } catch (err) {
                console.error('AI analysis error:', err);
                setError(`AI analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}. Continuing with basic analysis...`);
                setProgress(50);
            }

            setCurrentPhase('Finalizing profile...');
            setProgress(90);
            await new Promise((resolve) => setTimeout(resolve, 300));

            const result = analyzeMessages(parsedData, deepResult);
            setAnalysisResult(result);

            setProgress(100);
            setCurrentPhase('Analysis complete!');
        } catch (err) {
            setError(`Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleContinue = () => {
        if (analysisResult) {
            onComplete(analysisResult);
        }
    };

    return (
        <div className="card fade-in">
            <div className="card-section">
                <h2>Deep Personal Analysis</h2>
                <p className="text-sm opacity-60">
                    Analyzing {selectedName}'s communication style and personality with Gemini AI.
                </p>
            </div>

            {!isAnalyzing && !analysisResult && (
                <div className="card-section">
                    <div className="alert alert-info">
                        <strong>Analyzing: {selectedName}</strong>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                            Gemini will analyze {selectedName}'s messages to extract:
                        </p>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                            <li><strong>Communication style</strong> - how {selectedName} writes and expresses themselves</li>
                            <li><strong>Personality traits</strong> - enduring characteristics, not temporary topics</li>
                            <li><strong>Emotional patterns</strong> - what excites/frustrates {selectedName}</li>
                            <li><strong>Decision-making style</strong> - how {selectedName} approaches choices</li>
                            <li><strong>Relationship dynamics</strong> - how {selectedName} interacts with different people</li>
                        </ul>
                    </div>

                    <div className="alert alert-success" style={{ marginTop: '1rem' }}>
                        Ready to analyze {parsedData.stats.totalMessages.toLocaleString()} messages with Gemini 2.5 Flash Lite
                    </div>

                    <div className="text-sm opacity-60" style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                        <strong>Privacy Notice:</strong> This step will send your message samples to Google Gemini using our API key.
                        Requests are proxied through a local server to hide the API key from the network tab.
                        Data logging is disabled on the Gemini side, and we do not store any of your data or prompts.
                    </div>

                    <div className="action-row">
                        <button className="btn" onClick={onBack}>
                            ← Back
                        </button>
                        <button className="btn btn-primary" onClick={handleStartAnalysis}>
                            Start Deep Analysis →
                        </button>
                    </div>
                </div>
            )}

            {isAnalyzing && (
                <div className="card-section">
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="progress-label">
                            <span>{currentPhase}</span>
                            <span>{progress}%</span>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
                            {error}
                        </div>
                    )}

                    <p className="text-sm opacity-60" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        This may take 30-60 seconds as Gemini performs deep analysis...
                    </p>
                </div>
            )}

            {analysisResult && deepAnalysis && (
                <div className="card-section">
                    <div className="alert alert-success">
                        <strong>Deep analysis complete!</strong> {selectedName}'s comprehensive personal profile is ready.
                    </div>

                    <div style={{ margin: '1.5rem 0' }}>
                        <h3 className="text-sm mb-2">Profile Summary</h3>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-value">{deepAnalysis.relationships?.length || 0}</div>
                                <div className="stat-label">Relationships</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{deepAnalysis.personalReferences?.insideJokes?.length || 0}</div>
                                <div className="stat-label">Inside Jokes</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{deepAnalysis.communicationStyle?.uniquePhrases?.length || 0}</div>
                                <div className="stat-label">Unique Phrases</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{deepAnalysis.personalDetails?.interests?.length || 0}</div>
                                <div className="stat-label">Interests</div>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-info">
                        The next step will generate a formatted profile ready to paste into ChatGPT's personalization settings.
                    </div>

                    <div className="action-row">
                        <button className="btn" onClick={onBack}>
                            ← Back
                        </button>
                        <button className="btn btn-primary" onClick={handleContinue}>
                            Generate Profile →
                        </button>
                    </div>
                </div>
            )}

            {analysisResult && !deepAnalysis && (
                <div className="card-section">
                    <div className="alert alert-warning">
                        AI analysis was not available. Proceeding with basic profile.
                    </div>

                    <div className="action-row">
                        <button className="btn" onClick={onBack}>
                            ← Back
                        </button>
                        <button className="btn btn-primary" onClick={handleContinue}>
                            Generate Profile →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
