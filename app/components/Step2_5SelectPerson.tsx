'use client';

import { useState } from 'react';
import { ParsedData } from '@/types/messages';

interface Step2_5SelectPersonProps {
    parsedData: ParsedData;
    onComplete: (selectedName: string) => void;
    onBack: () => void;
}

export default function Step2_5SelectPerson({ parsedData, onComplete, onBack }: Step2_5SelectPersonProps) {
    const [name, setName] = useState('');

    // Find the most likely user handle (person who sent the most messages)
    const handleStats = new Map<string, number>();
    parsedData.messages.forEach(m => {
        if (m.isFromMe) {
            handleStats.set(m.handleId, (handleStats.get(m.handleId) || 0) + 1);
        }
    });

    const topMeHandle = Array.from(handleStats.entries())
        .sort((a, b) => b[1] - a[1])[0] || ['Unknown', 0];

    const handleContinue = () => {
        if (name.trim()) {
            onComplete(name.trim());
        }
    };

    return (
        <div className="card fade-in">
            <div className="card-section">
                <h2>Who are you?</h2>
                <p className="text-sm opacity-60">
                    We'll use your name to personalize the AI profile analysis.
                    Your data stays 100% local.
                </p>
            </div>

            <div className="card-section">
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Your First Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. John"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                        style={{ width: '100%', fontSize: '1.2rem', padding: '0.75rem' }}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                    />
                </div>

                <div className="alert alert-info">
                    <p style={{ fontSize: '0.85rem' }}>
                        <strong>Detected Identity:</strong><br />
                        We found <strong>{parsedData.stats.sentMessages.toLocaleString()}</strong> messages sent from your primary account.
                        The AI will analyze these to build your profile.
                    </p>
                </div>
            </div>

            <div className="action-row">
                <button className="btn" onClick={onBack}>
                    ← Back
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleContinue}
                    disabled={!name.trim()}
                >
                    Continue to Analysis →
                </button>
            </div>
        </div>
    );
}
