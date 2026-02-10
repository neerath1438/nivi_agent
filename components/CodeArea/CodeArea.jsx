import React from 'react';
import './CodeArea.css';

const CodeArea = ({ code, language = 'JavaScript', filename = 'index.js' }) => {
    return (
        <div className="wui-codex-frame">
            {/* Top Streak */}
            <div className="wui-codex-streak">
                <div className="wui-codex-streak-left"></div>
                <div className="wui-codex-streak-right"></div>
            </div>

            {/* Header */}
            <div className="wui-codex-apex">
                <div className="wui-codex-controls">
                    <div className="wui-codex-dot red"></div>
                    <div className="wui-codex-dot orange"></div>
                    <div className="wui-codex-dot green"></div>
                </div>
                <div className="wui-codex-label">{filename}</div>
            </div>

            {/* Content Area */}
            <div className="wui-codex-void">
                <div className="wui-codex-glow-left"></div>
                <div className="wui-codex-glow-right"></div>

                <pre className="wui-codex-pre">
                    <code>{code || '// No code provided'}</code>
                </pre>
            </div>

            {/* Footer */}
            <div className="wui-codex-footer">
                <span>UTF-8</span>
                <span>{language}</span>
            </div>
        </div>
    );
};

export default CodeArea;
