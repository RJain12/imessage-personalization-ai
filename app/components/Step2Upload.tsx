'use client';

import { useState, useCallback } from 'react';
import { ParsedData } from '@/types/messages';
import { parseMessagesDB } from '@/lib/parser';

interface Step2UploadProps {
    onComplete: (data: ParsedData) => void;
    onBack: () => void;
}

export default function Step2Upload({ onComplete, onBack }: Step2UploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<ParsedData | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    };

    const handleFileSelect = async (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        setIsProcessing(true);
        setProgress(0);

        try {
            // Simulate progress while parsing
            const progressInterval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 10, 90));
            }, 200);

            const data = await parseMessagesDB(selectedFile);
            clearInterval(progressInterval);
            setProgress(100);
            setParsedData(data);
        } catch (err) {
            console.error('Parse error:', err);
            setError(
                'Failed to parse the database file. Make sure you uploaded the correct chat.db file.'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleContinue = () => {
        if (parsedData) {
            onComplete(parsedData);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    return (
        <div className="card fade-in">
            <div className="card-section">
                <h2>Upload Your Messages Database</h2>
                <p className="text-sm opacity-60">
                    Upload the <code>messages_export.db</code> file from your Desktop.
                </p>
            </div>

            <div className="card-section">
                <div className="alert alert-info">
                    <strong>100% Local Processing:</strong> Your file is NOT uploaded to any server. Everything is processed entirely in your browser using JavaScript. Your data never leaves your computer.
                </div>
            </div>

            <div
                className={`upload-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
            >
                <input
                    id="file-input"
                    type="file"
                    accept=".db,.sqlite,.sqlite3"
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                />

                {!file ? (
                    <>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Drop your messages_export.db file here</h3>
                        <p className="text-sm opacity-60">or click to browse</p>
                    </>
                ) : (
                    <>
                        <div className="upload-icon">✓</div>
                        <h3>{file.name}</h3>
                        <p>{formatFileSize(file.size)}</p>
                    </>
                )}
            </div>

            {isProcessing && (
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="progress-label">
                        <span>Parsing messages...</span>
                        <span>{progress}%</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="alert alert-warning">
                    <span className="alert-icon">⚠️</span>
                    <div className="alert-content">{error}</div>
                </div>
            )}

            {parsedData && (
                <>
                    <div className="alert alert-success">
                        <span className="alert-icon">✓</span>
                        <div className="alert-content">
                            Successfully parsed {parsedData.stats.totalMessages.toLocaleString()} messages!
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">{parsedData.stats.totalMessages.toLocaleString()}</div>
                            <div className="stat-label">Total Messages</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{parsedData.stats.sentMessages.toLocaleString()}</div>
                            <div className="stat-label">Sent</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{parsedData.stats.receivedMessages.toLocaleString()}</div>
                            <div className="stat-label">Received</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{parsedData.handles.length}</div>
                            <div className="stat-label">Contacts</div>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">
                                {parsedData.dateRange.start.toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </div>
                            <div className="stat-label">Earliest</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">
                                {parsedData.dateRange.end.toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </div>
                            <div className="stat-label">Latest</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{parsedData.stats.groupMessages.toLocaleString()}</div>
                            <div className="stat-label">Group Messages</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{parsedData.stats.directMessages.toLocaleString()}</div>
                            <div className="stat-label">Direct Messages</div>
                        </div>
                    </div>
                </>
            )}

            <div className="action-row">
                <button className="btn btn-secondary" onClick={onBack}>
                    ← Back
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleContinue}
                    disabled={!parsedData}
                >
                    {isProcessing ? (
                        <>
                            <span className="spinner" />
                            Processing...
                        </>
                    ) : (
                        'Continue to Analysis →'
                    )}
                </button>
            </div>
        </div>
    );
}
