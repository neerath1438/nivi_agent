import React, { useState, useRef, useEffect } from 'react';
import { runFlow, sendEmail } from '../../services/api';
import IDEView from './IDE/IDEView';

const Loader = () => (
    <div className="loader-container">
        <div className="w-8 h-8 text-orange-600">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <style>{`.spinner_SoJz{transform-origin:center;animation:spinner_YGAN 1.5s linear infinite}@keyframes spinner_YGAN{100%{transform:rotate(360deg)}}`}</style>
                <path className="spinner_SoJz" d="M20.27,4.74a4.93,4.93,0,0,1,1.52,4.61,5.32,5.32,0,0,1-4.1,4.51,5.12,5.12,0,0,1-5.2-1.5,5.53,5.53,0,0,0,6.13-1.48A5.66,5.66,0,0,0,20.27,4.74ZM12.32,11.53a5.49,5.49,0,0,0-1.47-6.2A5.57,5.57,0,0,0,4.71,3.72,5.17,5.17,0,0,1,9.53,2.2,5.52,5.52,0,0,1,13.9,6.45,5.28,5.28,0,0,1,12.32,11.53ZM19.2,20.29a4.92,4.92,0,0,1-4.72,1.49,5.32,5.32,0,0,1-4.34-4.05A5.2,5.2,0,0,1,11.6,12.5a5.6,5.6,0,0,0,1.51,6.13A5.63,5.63,0,0,0,19.2,20.29ZM3.79,19.38A5.18,5.18,0,0,1,2.32,14a5.3,5.3,0,0,1,4.59-4,5,5,0,0,1,4.58,1.61,5.55,5.55,0,0,0-6.32,1.69A5.46,5.46,0,0,0,3.79,19.38ZM12.23,12a5.11,5.11,0,0,0,3.66-5,5.75,5.75,0,0,0-3.18-6,5,5,0,0,1,4.42,2.3,5.21,5.21,0,0,1,.24,5.92A5.4,5.4,0,0,1,12.23,12ZM11.76,12a5.18,5.18,0,0,0-3.68,5.09,5.58,5.58,0,0,0,3.19,5.79c-1,.35-2.9-.46-4-1.68A5.51,5.51,0,0,1,11.76,12ZM23,12.63a5.07,5.07,0,0,1-2.35,4.52,5.23,5.23,0,0,1-5.91.2,5.24,5.24,0,0,1-2.67-4.77,5.51,5.51,0,0,0,5.45,3.33A5.52,5.52,0,0,0,23,12.63ZM1,11.23a5,5,0,0,1,2.49-4.5,5.23,5.23,0,0,1,5.81-.06,5.3,5.3,0,0,1,2.61,4.74A5.56,5.56,0,0,0,6.56,8.06,5.71,5.71,0,0,0,1,11.23Z" />
            </svg>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', marginLeft: '8px' }}>AI is thinking...</span>
        </div>
    </div>
);

const ChatInterface = ({ nodes, edges, onClose, onExecutionResult, theme }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sendingEmailId, setSendingEmailId] = useState(null);
    const [currentIdeData, setCurrentIdeData] = useState(null);
    const [isIdeFullscreen, setIsIdeFullscreen] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const flowData = { nodes, edges };
            const response = await runFlow(flowData, userMessage);

            if (!response.ok) throw new Error('Failed to start flow');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = "";
            let streamingId = `msg_${Date.now()}`;

            // Add placeholder assistant message
            setMessages((prev) => [
                ...prev,
                { id: streamingId, type: 'assistant', text: "⚙️ Initializing workflow...", logs: [] }
            ]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedContent += chunk;

                // Split by double newline (SSE standard separator)
                const packets = accumulatedContent.split('\n\n');
                accumulatedContent = packets.pop(); // Keep partial packet for next chunk

                for (const packet of packets) {
                    if (packet.trim().startsWith('data: ')) {
                        try {
                            const eventStr = packet.trim().substring(6);
                            const event = JSON.parse(eventStr);

                            if (event.type === 'node_start') {
                                setMessages(prev => prev.map(m =>
                                    m.id === streamingId ? { ...m, text: `⏳ Executing: **${event.node_type}**...` } : m
                                ));
                            } else if (event.type === 'node_finish') {
                                setMessages(prev => prev.map(m => {
                                    if (m.id === streamingId) {
                                        const currentLogs = m.logs || [];
                                        return {
                                            ...m,
                                            logs: [...currentLogs, { node_type: event.node_type || "node", status: event.status }]
                                        };
                                    }
                                    return m;
                                }));

                                if (event.result?.ide_data) {
                                    setCurrentIdeData(event.result.ide_data);
                                }
                            } else if (event.type === 'final') {
                                const state = event.state || {};
                                const cumulativeHtml = state.cumulative_html || [];
                                let finalHtml = cumulativeHtml.map(h => h.content).join('\n<hr style="border: 1px solid #444; margin: 25px 0;">\n');

                                setMessages(prev => prev.map(m =>
                                    m.id === streamingId ? {
                                        ...m,
                                        text: event.output,
                                        htmlPreview: finalHtml,
                                        logs: event.logs
                                    } : m
                                ));

                                if (onExecutionResult) onExecutionResult(event.logs);
                            } else if (event.type === 'error') {
                                setMessages(prev => prev.map(m =>
                                    m.id === streamingId ? { ...m, text: `❌ Error: ${event.message}`, status: 'error' } : m
                                ));
                            }
                        } catch (e) {
                            console.error("Error parsing stream packet:", e);
                        }
                    }
                }
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    type: 'error',
                    text: `Error: ${error.message}`,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalEmailSend = async (msgIndex, draft) => {
        setSendingEmailId(msgIndex);
        try {
            const response = await sendEmail({
                to: draft.to,
                cc: draft.cc,
                subject: draft.subject,
                body: draft.body
            });

            // Update message status
            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[msgIndex] = {
                    ...newMsgs[msgIndex],
                    emailSent: true,
                    text: `✅ ${response.message}`
                };
                return newMsgs;
            });
        } catch (error) {
            alert(`Failed to send email: ${error.message}`);
        } finally {
            setSendingEmailId(null);
        }
    };

    const handleDraftChange = (msgIndex, newBody) => {
        setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[msgIndex].emailDraft.body = newBody;
            return newMsgs;
        });
    };

    const renderMessageContent = (text) => {
        if (!text) return null;

        // 1. Handle Code Blocks (```code```)
        const codeBlockRegex = /```(?:[a-z]+)?\n([\s\S]*?)```/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(text)) !== null) {
            // Text before code block
            if (match.index > lastIndex) {
                parts.push(renderTextWithLinks(text.substring(lastIndex, match.index)));
            }
            // The code block itself
            parts.push(
                <pre key={match.index} className="chat-code-block">
                    <code>{match[1]}</code>
                </pre>
            );
            lastIndex = codeBlockRegex.lastIndex;
        }

        // Remaining text after last code block
        if (lastIndex < text.length) {
            parts.push(renderTextWithLinks(text.substring(lastIndex)));
        }

        return parts.length > 0 ? parts : renderTextWithLinks(text);
    };

    const renderTextWithLinks = (text) => {
        if (!text) return null;

        // Regex to find paths starting with /static (for PDFs) or general URLs
        const urlRegex = /(https?:\/\/[^\s]+|(?:\/static\/downloads\/[^\s]+\.[a-z0-9]+))/g;

        const parts = text.split(urlRegex);
        const matches = text.match(urlRegex);

        if (!matches) return text;

        return parts.map((part, i) => {
            if (matches.includes(part)) {
                const isDownload = part.startsWith('/static/downloads/');
                const fileName = part.split('/').pop();

                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chat-link"
                    >
                        {isDownload ? `📄 ${fileName} (Download)` : part}
                    </a>
                );
            }
            return part;
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-modal-overlay" onClick={onClose}>
            <div className={`chat-modal ${theme} ${currentIdeData ? 'ide-mode' : ''} ${isIdeFullscreen ? 'fullscreen' : ''}`} onClick={(e) => e.stopPropagation()}>
                {currentIdeData && (
                    <div className="ide-container">
                        <IDEView
                            ideData={currentIdeData}
                            onUpdateFile={(path, content, allFiles) => {
                                setCurrentIdeData(prev => ({ ...prev, files: allFiles }));
                            }}
                            onToggleFullscreen={() => setIsIdeFullscreen(!isIdeFullscreen)}
                        />
                    </div>
                )}
                <div className={`chat-section ${isIdeFullscreen ? 'docked' : ''}`}>
                    <div className="chat-header">
                        <div>
                            <h3>💬 AI Workflow Chat</h3>
                            <p>Interact with your workflow</p>
                        </div>
                        <button className="chat-close-btn" onClick={onClose}>
                            ✕
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="chat-empty">
                                <p>👋 Welcome! Type something to trigger your workflow.</p>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message chat-message-${msg.type}`}>
                                <div className="chat-message-content">
                                    <div className="chat-message-text">{renderMessageContent(msg.text)}</div>

                                    {msg.emailDraft && !msg.emailSent && (
                                        <div className="email-draft-editor">
                                            <div className="draft-header">
                                                <span><strong>To:</strong> {msg.emailDraft.to}</span>
                                                {msg.emailDraft.cc && <span><strong>CC:</strong> {msg.emailDraft.cc}</span>}
                                            </div>
                                            <textarea
                                                value={msg.emailDraft.body}
                                                onChange={(e) => handleDraftChange(idx, e.target.value)}
                                                rows={8}
                                                className="draft-textarea nodrag"
                                            />
                                            <button
                                                className="email-send-confirm-btn"
                                                onClick={() => handleFinalEmailSend(idx, msg.emailDraft)}
                                                disabled={sendingEmailId === idx}
                                            >
                                                {sendingEmailId === idx ? 'Sending...' : '🚀 Send Email Now'}
                                            </button>
                                        </div>
                                    )}

                                    {msg.htmlPreview && (
                                        <div className="ui-preview-container">
                                            <iframe
                                                srcDoc={msg.htmlPreview}
                                                title="UI Preview"
                                                className="ui-preview-iframe"
                                                sandbox="allow-scripts"
                                            />
                                            <div className="preview-actions">
                                                <button
                                                    onClick={() => {
                                                        const blob = new Blob([msg.htmlPreview], { type: 'text/html' });
                                                        const url = URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = 'generated_page.html';
                                                        a.click();
                                                    }}
                                                    className="download-html-btn"
                                                >
                                                    📥 Download HTML File
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {msg.logs && msg.logs.length > 0 && (
                                        <div className="chat-message-logs">
                                            <details>
                                                <summary>📋 Execution Details</summary>
                                                {msg.logs.map((log, logIdx) => (
                                                    <div key={logIdx} className={`chat-log chat-log-${log.status}`}>
                                                        <strong>{log.node_type}</strong>: {log.status}
                                                    </div>
                                                ))}
                                            </details>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-message chat-message-assistant">
                                <div className="chat-message-content">
                                    <Loader />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            className="chat-send-btn"
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                        >
                            {isLoading ? '⏳' : '▶️'}
                        </button>
                    </div>
                </div>

                <style jsx>{`
                .chat-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(20px);
                }

                .chat-modal {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    width: 500px;
                    height: 650px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: var(--shadow-lg);
                    animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .chat-modal.ide-mode {
                    width: 1300px;
                    height: 85vh;
                    flex-direction: row;
                }
                
                .chat-modal.fullscreen {
                    width: 100vw !important;
                    height: 100vh !important;
                    border-radius: 0;
                    margin: 0;
                }

                .ide-container {
                    flex: 1;
                    height: 100%;
                    background: #1e1e1e;
                    border-right: 1px solid var(--border-color);
                    overflow: hidden;
                    animation: fadeIn 0.5s ease;
                }

                .chat-section {
                    width: 450px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-primary);
                    flex-shrink: 0;
                }

                .chat-section.docked {
                    width: 350px;
                    border-left: 1px solid #2b2b2b;
                    background: #252526;
                }
                
                .chat-section.docked .chat-header {
                    background: #333333;
                    padding: 10px 15px;
                }
                
                .chat-section.docked .chat-input-container {
                    padding: 10px;
                    background: #252526;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .chat-header {
                    padding: 16px 20px;
                    background: var(--bg-tertiary);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .chat-header h3 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .chat-header p {
                    margin: 0;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }

                .chat-close-btn {
                    background: rgba(0, 0, 0, 0.05);
                    border: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    transition: all 0.2s;
                }

                .chat-close-btn:hover {
                    background: rgba(0, 0, 0, 0.1);
                }
                .chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    background: var(--bg-primary);
                }

                .chat-empty {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    text-align: center;
                    padding: 40px;
                    opacity: 0.7;
                }

                .chat-message {
                    display: flex;
                    max-width: 85%;
                    margin-bottom: 4px;
                }

                .chat-message-user {
                    align-self: flex-end;
                }

                .chat-message-assistant {
                    align-self: flex-start;
                }

                .chat-message-content {
                    padding: 10px 16px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    position: relative;
                }

                .chat-message-user .chat-message-content {
                    background: var(--accent-primary);
                    color: #ffffff;
                    border-bottom-right-radius: 4px;
                }

                .chat-message-assistant .chat-message-content {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                    border-bottom-left-radius: 4px;
                }

                .chat-link {
                    color: inherit;
                    text-decoration: underline;
                    font-weight: 600;
                }

                .chat-input-container {
                    padding: 16px 20px;
                    background: var(--bg-tertiary);
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .chat-input {
                    flex: 1;
                    padding: 10px 18px;
                    background: var(--bg-primary) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid var(--border-color);
                    border-radius: 24px;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
                }

                .chat-input:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    background: var(--bg-secondary) !important;
                    box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
                }

                .chat-input::placeholder {
                    color: var(--text-muted);
                    opacity: 0.6;
                }

                .chat-send-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    color: #ffffff;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    transition: all 0.2s;
                }

                .chat-send-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                    filter: brightness(1.1);
                }

                .chat-send-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .chat-code-block {
                    background: #1d1d1f;
                    color: #f5f5f7;
                    padding: 12px;
                    border-radius: 12px;
                    font-family: 'SF Mono', 'Fira Code', monospace;
                    font-size: 0.8rem;
                    margin: 10px 0;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    overflow-x: auto;
                }

                .email-draft-editor {
                    margin-top: 12px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 12px;
                    width: 100%;
                }

                .draft-header {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .draft-textarea {
                    width: 100%;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 12px;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                    min-height: 120px;
                    outline: none;
                    resize: vertical;
                }

                .draft-textarea:focus {
                    border-color: var(--accent-primary);
                }

                .email-send-confirm-btn:hover {
                    filter: brightness(1.1);
                }

                .ui-preview-container {
                    margin-top: 15px;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid var(--border-color);
                    background: #fff;
                    width: 100%;
                    min-width: 400px;
                }

                .ui-preview-iframe {
                    width: 100%;
                    height: 350px;
                    border: none;
                }

                .preview-actions {
                    padding: 8px;
                    background: var(--bg-tertiary);
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: flex-end;
                }

                .download-html-btn {
                    padding: 6px 12px;
                    background: var(--accent-primary);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .download-html-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .loader-container {
                    display: flex;
                    align-items: center;
                    color: #ea580c;
                }

                .text-orange-600 {
                    color: #ea580c;
                    display: flex;
                    align-items: center;
                }
            `}</style>
            </div>
        </div>
    );
};

export default ChatInterface;
