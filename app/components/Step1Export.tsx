'use client';

import { useState } from 'react';

interface Step1ExportProps {
    onComplete: () => void;
}

export default function Step1Export({ onComplete }: Step1ExportProps) {
    const [copied, setCopied] = useState(false);

    const exportCommand = 'cp ~/Library/Messages/chat.db ~/Desktop/messages_export.db';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(exportCommand);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="card fade-in">
            <div className="card-section">
                <h2>Export Your iMessages</h2>
                <p className="text-sm opacity-60">
                    Your iMessage data is stored locally on your Mac. Follow these steps to export it safely.
                </p>
            </div>

            <div className="card-section">
                <div className="alert alert-info">
                    <strong>Privacy First:</strong> All your data stays on your device. We never upload or store
                    your messages on any server. Everything is processed locally in your browser.
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <h3 className="text-xs opacity-50 mb-2">STEPS</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong className="text-sm">1. Enable Full Disk Access for Terminal</strong>
                        <p className="text-sm opacity-60" style={{ marginTop: '0.25rem' }}>
                            Open <strong>System Settings → Privacy & Security → Full Disk Access</strong> and
                            enable access for Terminal.
                        </p>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong className="text-sm">2. Open Terminal</strong>
                        <p className="text-sm opacity-60" style={{ marginTop: '0.25rem' }}>
                            Press <code>⌘ + Space</code>, type "Terminal", and press Enter.
                        </p>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong className="text-sm">3. Run this command</strong>
                        <div className="terminal" style={{ marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <code style={{ fontSize: '0.8rem' }}>{exportCommand}</code>
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        fontSize: '0.75rem',
                                        background: copied ? '#86efac' : 'transparent',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {copied ? '✓' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <strong className="text-sm">4. Verify the export</strong>
                        <p className="text-sm opacity-60" style={{ marginTop: '0.25rem' }}>
                            Check your Desktop for <code>messages_export.db</code> (typically 100MB - 2GB).
                        </p>
                    </div>
                </div>
            </div>

            <div className="action-row">
                <button className="btn btn-primary" onClick={onComplete}>
                    I've Exported My Messages →
                </button>
            </div>
        </div>
    );
}
