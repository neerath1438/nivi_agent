import React, { useState, useRef, useEffect } from 'react';
import { getPublicFlow, executePublicFlow } from '../../services/api';

const PublicChat = ({ shareToken, theme }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [flowInfo, setFlowInfo] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchFlow = async () => {
            try {
                const data = await getPublicFlow(shareToken);
                setFlowInfo(data);
            } catch (error) {
                console.error("Failed to fetch shared flow:", error);
            }
        };
        if (shareToken) fetchFlow();
    }, [shareToken]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const result = await executePublicFlow(shareToken, userMessage);
            setMessages((prev) => [
                ...prev,
                {
                    type: 'assistant',
                    text: result.output,
                },
            ]);
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const renderMessageContent = (text) => {
        if (!text) return null;
        // Simplified rendering for public portal
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        const matches = text.match(urlRegex);

        if (!matches) return <div className="chat-message-text">{text}</div>;

        return (
            <div className="chat-message-text">
                {parts.map((part, i) => {
                    if (matches.includes(part)) {
                        return (
                            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="chat-link">
                                {part}
                            </a>
                        );
                    }
                    return part;
                })}
            </div>
        );
    };

    if (!flowInfo && !isLoading && messages.length === 0) {
        return <div className="public-chat-loading">Loading Chatbot...</div>;
    }

    return (
        <div className={`public-chat-container ${theme}`}>
            <div className="public-chat-main">
                <div className="chat-header">
                    <div>
                        <h3>{flowInfo?.name || "AI Assistant"}</h3>
                        <p>{flowInfo?.description || "Shared via AI Workflow Builder"}</p>
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.length === 0 && (
                        <div className="chat-empty">
                            <p>👋 Hello! How can I help you today?</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-message chat-message-${msg.type}`}>
                            <div className="chat-message-content">
                                {renderMessageContent(msg.text)}
                            </div>
                        </div>
                    ))}
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
                .public-chat-container {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-secondary);
                    padding: 20px;
                }

                .public-chat-main {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    width: 100%;
                    max-width: 600px;
                    height: 90vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    overflow: hidden;
                }

                .chat-header {
                    padding: 20px 24px;
                    background: var(--bg-tertiary);
                    border-bottom: 1px solid var(--border-color);
                }

                .chat-header h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .chat-header p {
                    margin: 4px 0 0;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }

                .chat-messages {
                    flex: 1;
                    padding: 24px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    background: var(--bg-primary);
                }

                .chat-message {
                    display: flex;
                    max-width: 85%;
                }

                .chat-message-user { align-self: flex-end; }
                .chat-message-assistant { align-self: flex-start; }

                .chat-message-content {
                    padding: 12px 18px;
                    border-radius: 20px;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .chat-message-user .chat-message-content {
                    background: var(--accent-primary);
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                .chat-message-assistant .chat-message-content {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                    border-bottom-left-radius: 4px;
                }

                .chat-input-container {
                    padding: 20px 24px;
                    background: var(--bg-tertiary);
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    gap: 12px;
                }

                .chat-input {
                    flex: 1;
                    padding: 12px 20px;
                    border-radius: 30px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    outline: none;
                }

                .chat-send-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chat-link {
                    color: inherit;
                    text-decoration: underline;
                    font-weight: 600;
                }

                .chat-empty {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-secondary);
                    opacity: 0.6;
                }
            `}</style>
        </div>
    );
};

export default PublicChat;
