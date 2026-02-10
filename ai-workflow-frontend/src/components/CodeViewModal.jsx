import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeViewModal = ({ isOpen, onClose, nodeType, code, filePath }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content code-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3>Backend Code: {nodeType}</h3>
                        <p className="file-path">{filePath}</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="code-container">
                        <SyntaxHighlighter
                            language="python"
                            style={vscDarkPlus}
                            showLineNumbers
                            wrapLines
                            customStyle={{
                                margin: 0,
                                borderRadius: '8px',
                                fontSize: '13px',
                                maxHeight: '75vh',
                                overflow: 'auto'
                            }}
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="copy-btn" onClick={handleCopy}>
                        {copied ? '✓ Copied!' : '📋 Copy Code'}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }

                .code-modal {
                    background: #1e1e1e;
                    border-radius: 12px;
                    width: 1400px;
                    height: 95vh;
                    max-width: 95vw;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px;
                    border-bottom: 1px solid #333;
                    gap: 16px;
                }

                .modal-header > div {
                    flex: 1;
                    min-width: 0;
                }

                .modal-header h3 {
                    margin: 0 0 4px 0;
                    color: #fff;
                    font-size: 18px;
                    font-weight: 600;
                }

                .file-path {
                    margin: 0;
                    color: #888;
                    font-size: 13px;
                    font-family: 'Courier New', monospace;
                }

                .close-btn {
                    background: transparent;
                    border: none;
                    color: #999;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    transition: all 0.2s;
                }

                .close-btn:hover {
                    background: #333;
                    color: #fff;
                }

                .modal-body {
                    flex: 1;
                    overflow: hidden;
                    padding: 0;
                }

                .code-container {
                    height: 100%;
                    overflow: auto;
                }

                .modal-footer {
                    padding: 16px 24px;
                    border-top: 1px solid #333;
                    display: flex;
                    justify-content: flex-end;
                }

                .copy-btn {
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .copy-btn:hover {
                    background: #4f46e5;
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    );
};

export default CodeViewModal;
