import React, { useState } from 'react';

const AIArchitect = ({ onFlowGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/flow/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) throw new Error('Failed to generate flow');

            const flowData = await response.json();
            onFlowGenerated(flowData);
            setIsOpen(false);
            setPrompt('');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate workflow. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ai-architect-container">
            {!isOpen ? (
                <button className="architect-btn" onClick={() => setIsOpen(true)}>
                    🏗️ AI Architect
                </button>
            ) : (
                <div className="architect-panel">
                    <div className="panel-header">
                        <span>🏗️ AI Workflow Architect</span>
                        <button onClick={() => setIsOpen(false)}>✕</button>
                    </div>
                    <div className="panel-body">
                        <p>Describe the workflow you want to build:</p>
                        <textarea
                            placeholder="e.g., Create a flow to send an email notification after processing user input with Gemini."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <div className="panel-footer">
                        <button
                            className="generate-btn"
                            onClick={handleGenerate}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Generating...' : '🛠️ Generate Flow'}
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .ai-architect-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 1000;
                    font-family: 'Inter', sans-serif;
                }
                .architect-btn {
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border: none;
                    border-radius: 30px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .architect-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
                }
                .architect-panel {
                    width: 320px;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    box-shadow: var(--shadow-lg);
                    overflow: hidden;
                    animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .panel-header {
                    padding: 12px 16px;
                    background: var(--bg-tertiary);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .panel-header button {
                    background: none; border: none; color: var(--text-secondary); cursor: pointer;
                }
                .panel-body { padding: 16px; }
                .panel-body p { color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 12px; }
                textarea {
                    width: 100%;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    color: var(--text-primary);
                    padding: 10px;
                    font-size: 0.9rem;
                    resize: none;
                }
                textarea:focus { outline: none; border-color: #6366f1; }
                .panel-footer { padding: 12px 16px; background: var(--bg-tertiary); border-top: 1px solid var(--border-color); }
                .generate-btn {
                    width: 100%;
                    padding: 10px;
                    background: #6366f1;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .generate-btn:hover { background: #4f46e5; }
                .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </div>
    );
};

export default AIArchitect;
