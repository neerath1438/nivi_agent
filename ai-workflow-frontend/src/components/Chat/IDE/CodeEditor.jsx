import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Play, Save, X, ChevronRight, FileCode } from 'lucide-react';

const CodeEditor = ({ file, onSave, onRun }) => {
    const [code, setCode] = useState('');

    useEffect(() => {
        if (file) {
            setCode(file.content || '');
        }
    }, [file]);

    // Auto-save logic
    useEffect(() => {
        if (!file || code === file.content) return;

        const timer = setTimeout(() => {
            onSave(file.path, code);
        }, 1000); // 1-second debounce

        return () => clearTimeout(timer);
    }, [code, file?.path, onSave]);

    if (!file) {
        return (
            <div className="empty-editor">
                <div className="empty-content">
                    <span className="empty-icon">📂</span>
                    <p>Select a file to view or edit</p>
                </div>
            </div>
        );
    }

    const language = file.path.split('.').pop() === 'py' ? 'python' :
        file.path.split('.').pop() === 'js' ? 'javascript' :
            file.path.split('.').pop() === 'jsx' ? 'jsx' : 'text';

    const pathParts = file.path.split('/');

    return (
        <div className="code-editor">
            <div className="editor-tabs">
                <div className="editor-tab active">
                    <FileCode size={14} className="tab-icon" color={language === 'python' ? '#3776ab' : '#f7df1e'} />
                    <span>{pathParts[pathParts.length - 1]}</span>
                    {code !== file.content && <span className="unsaved-dot">●</span>}
                    <X size={12} className="close-icon" />
                </div>
            </div>

            <div className="editor-breadcrumbs">
                {pathParts.map((part, i) => (
                    <React.Fragment key={i}>
                        <span className="breadcrumb-part">{part}</span>
                        {i < pathParts.length - 1 && <ChevronRight size={12} className="breadcrumb-sep" />}
                    </React.Fragment>
                ))}
            </div>

            <div className="editor-main">
                <textarea
                    className="editor-textarea"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck="false"
                    placeholder="Start typing your code here..."
                />
            </div>

            <style jsx>{`
                .code-editor {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #1e1e1e;
                    overflow: hidden;
                }
                .editor-tabs {
                    height: 35px;
                    background: #252526;
                    display: flex;
                    align-items: flex-end;
                }
                .editor-tab {
                    height: 35px;
                    padding: 0 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #1e1e1e;
                    color: #969696;
                    font-size: 13px;
                    cursor: pointer;
                    border-right: 1px solid #252526;
                }
                .editor-tab.active {
                    color: #ffffff;
                }
                .tab-icon {
                    margin-top: 1px;
                }
                .close-icon {
                    margin-left: 5px;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .editor-tab:hover .close-icon {
                    opacity: 1;
                }
                .editor-breadcrumbs {
                    height: 22px;
                    padding: 0 16px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    color: #858585;
                    background: #1e1e1e;
                }
                .breadcrumb-part:hover {
                    color: #cccccc;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .breadcrumb-sep {
                    opacity: 0.5;
                }
                .editor-toolbar {
                    padding: 8px 16px;
                    background: #1e1e1e;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    position: absolute;
                    top: 57px;
                    right: 20px;
                    z-index: 10;
                }
                .unsaved-dot {
                    color: #6366f1;
                    font-size: 10px;
                }
                .editor-actions {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                .run-btn {
                    background: transparent;
                    color: #89d185;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background 0.2s;
                }
                .run-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .edit-btn, .save-btn, .cancel-btn {
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                .edit-btn {
                    background: rgba(255, 255, 255, 0.05);
                    color: #ccc;
                }
                .edit-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .save-btn {
                    background: #0e639c;
                    color: white;
                    display: flex;
                    align-items: center;
                }
                .cancel-btn {
                    background: transparent;
                    color: #888;
                }
                .editor-main {
                    flex: 1;
                    overflow: hidden;
                    position: relative;
                }
                .editor-textarea {
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    color: #d4d4d4;
                    padding: 20px;
                    font-family: 'Fira Code', 'SF Mono', monospace;
                    font-size: 13px;
                    line-height: 1.5;
                    border: none;
                    outline: none;
                    resize: none;
                }
                .editor-highlight-container {
                    width: 100%;
                    height: 100%;
                    overflow-y: auto;
                }
                .empty-editor {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #1e1e1e;
                }
                .empty-content {
                    text-align: center;
                    opacity: 0.3;
                }
                .empty-icon {
                    font-size: 3rem;
                    display: block;
                    margin-bottom: 12px;
                }
            `}</style>
        </div>
    );
};

export default CodeEditor;
