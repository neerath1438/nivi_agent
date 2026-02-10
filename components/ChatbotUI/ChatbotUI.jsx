import React, { useState, useEffect, useRef } from 'react';
import { Zap, Code, FileText, Paperclip, Globe, Bell, Send } from 'lucide-react';
import './ChatbotUI.css';

const ChatbotUI = () => {
    const [prompt, setPrompt] = useState('');
    const [isToolsOpen, setToolsOpen] = useState(false);
    const toolsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (toolsRef.current && !toolsRef.current.contains(event.target)) {
                setToolsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSend = () => {
        if (!prompt.trim()) return;
        console.log(`Sending prompt: "${prompt}"`);
        setPrompt('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestionChips = [
        { icon: <Zap size={16} />, text: "Generate rest API" },
        { icon: <Code size={16} />, text: "Debug Python code" },
        { icon: <FileText size={16} />, text: "Explain React hooks" }
    ];

    return (
        <div className="chatbot-landing">
            {/* Star Icon */}
            <div className="chatbot-star-icon">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M30 0L32.5 27.5L60 30L32.5 32.5L30 60L27.5 32.5L0 30L27.5 27.5L30 0Z" fill="url(#starGradient)" />
                    <defs>
                        <linearGradient id="starGradient" x1="0" y1="0" x2="60" y2="60">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Heading */}
            <h1 className="chatbot-heading">
                Unleash Your<br />
                <span className="chatbot-heading-gradient">Creativity.</span>
            </h1>

            {/* Suggestion Chips */}
            <div className="chatbot-chips">
                {suggestionChips.map((chip, index) => (
                    <button
                        key={index}
                        className="chatbot-chip"
                        onClick={() => setPrompt(chip.text)}
                    >
                        {chip.icon}
                        <span>{chip.text}</span>
                    </button>
                ))}
            </div>

            {/* Input Container */}
            <div className="chatbot-input-container">
                <div className="chatbot-input-wrapper">
                    <input
                        type="text"
                        className="chatbot-input"
                        placeholder="Type / for command"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />

                    <div className="chatbot-input-actions">
                        {/* Left Actions */}
                        <div className="chatbot-input-left">
                            <div className="chatbot-dropdown" ref={toolsRef}>
                                <button
                                    className="chatbot-input-btn"
                                    onClick={() => setToolsOpen(!isToolsOpen)}
                                >
                                    <Paperclip size={18} />
                                    <span>Tools</span>
                                </button>
                                {isToolsOpen && (
                                    <div className="chatbot-tools-popup">
                                        <div className="chatbot-tool-item">
                                            <Paperclip size={16} />
                                            <span>Attach file</span>
                                        </div>
                                        <div className="chatbot-tool-item">
                                            <Code size={16} />
                                            <span>Code snippet</span>
                                        </div>
                                        <div className="chatbot-tool-item">
                                            <FileText size={16} />
                                            <span>Document</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button className="chatbot-input-btn">
                                <Globe size={18} />
                                <span>Search</span>
                            </button>
                        </div>

                        {/* Right Actions */}
                        <div className="chatbot-input-right">
                            <button className="chatbot-input-icon-btn">
                                <Bell size={18} />
                            </button>
                            <button
                                className={`chatbot-send-btn ${prompt.trim() ? 'active' : ''}`}
                                onClick={handleSend}
                                disabled={!prompt.trim()}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="chatbot-footer-text">
                    Noera may make mistakes. We recommend checking important information.{' '}
                    <a href="#" className="chatbot-footer-link">Privacy Notice</a>
                </p>
            </div>
        </div>
    );
};

export default ChatbotUI;
