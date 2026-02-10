import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import CodeViewModal from '../CodeViewModal';

const PromptNode = ({ data, id, isConnectable }) => {
    const [showCode, setShowCode] = useState(false);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const [template, setTemplate] = useState(data.template || '');

    const handleTemplateChange = (e) => {
        const newTemplate = e.target.value;
        setTemplate(newTemplate);
        if (data.onChange) {
            data.onChange(id, { ...data, template: newTemplate });
        }
    };

    const handleViewCode = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/code/promptTemplate');
            const data = await response.json();
            setCode(data.code);
            setShowCode(true);
        } catch (error) {
            console.error('Failed to fetch code:', error);
            alert('Failed to load code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="prompt-node">
                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <div className="prompt-node-header">
                    <div className="prompt-node-icon">📝</div>
                    <div className="prompt-node-title">Prompt Template</div>
                    <div className="prompt-node-tag">Templating</div>
                    <button
                        className="code-view-btn"
                        onClick={handleViewCode}
                        disabled={loading}
                    >
                        {loading ? '⏳' : '</>'}
                    </button>
                </div>

                <div className="prompt-node-body">
                    <div className="universal-badge">
                        Logical Blueprint
                    </div>

                    <div className="input-field">
                        <label>Prompt Template</label>
                        <textarea
                            className="nodrag"
                            placeholder="Draft an email for: {input}"
                            value={template}
                            onChange={handleTemplateChange}
                            rows={3}
                        />
                    </div>

                    <div className="template-help">
                        {template ? (
                            <span>Use <code>{'{input}'}</code> for dynamic variables.</span>
                        ) : (
                            <div className="auto-planner-badge">
                                🤖 Auto-Planner Mode Active
                            </div>
                        )}
                    </div>

                    <div className="info-text">
                        Shapes the AI behavior ⚡
                        <br />
                        <small>Supports dynamic variable injection</small>
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />

                <style jsx>{`
                    .prompt-node {
                        background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
                        border: 2px solid #fda085;
                        border-radius: 14px;
                        min-width: 260px;
                        box-shadow: 0 6px 20px rgba(253, 160, 133, 0.3);
                        transition: all 0.3s ease;
                        overflow: hidden;
                    }
                    .prompt-node:hover {
                        box-shadow: 0 10px 30px rgba(253, 160, 133, 0.4);
                        transform: translateY(-3px);
                    }
                    .prompt-node-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 14px;
                        border-bottom: 2px solid rgba(253, 160, 133, 0.2);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .prompt-node-icon {
                        font-size: 1.3rem;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                    }
                    .prompt-node-title {
                        font-weight: 700;
                        background: linear-gradient(135deg, #f6d365, #fda085);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        font-size: 14px;
                        flex: 1;
                    }
                    .prompt-node-tag {
                        font-size: 9px;
                        background: linear-gradient(135deg, #f6d365, #fda085);
                        color: #fff;
                        padding: 3px 8px;
                        border-radius: 12px;
                        text-transform: uppercase;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        margin-right: 8px;
                    }
                    .code-view-btn {
                        background: #f1f3f5;
                        border: 1px solid #dee2e6;
                        color: #495057;
                        border-radius: 6px;
                        padding: 4px 6px;
                        cursor: pointer;
                        font-size: 11px;
                        transition: all 0.2s;
                    }
                    .code-view-btn:hover {
                        background: #e9ecef;
                        color: #212529;
                    }
                    .prompt-node-body {
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.98);
                        text-align: center;
                    }
                    .input-field {
                        text-align: left;
                        margin-bottom: 12px;
                    }
                    label {
                        display: block;
                        font-size: 11px;
                        font-weight: 700;
                        color: #4a5568;
                        margin-bottom: 6px;
                    }
                    textarea {
                        width: 100%;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        padding: 8px 10px;
                        font-size: 12px;
                        color: #2d3748;
                        background: #f7fafc;
                        transition: all 0.2s;
                        font-weight: 500;
                        box-sizing: border-box;
                        resize: vertical;
                        min-height: 80px;
                    }
                    textarea:focus {
                        outline: none;
                        border-color: #fda085;
                        background: #fff;
                        box-shadow: 0 0 0 3px rgba(253, 160, 133, 0.1);
                    }
                    .template-help {
                        margin-bottom: 12px;
                        font-size: 10px;
                        color: #718096;
                    }
                    .template-help code {
                        background: #fff8e1;
                        padding: 2px 4px;
                        border-radius: 4px;
                        color: #d87d0d;
                        font-weight: 700;
                    }
                    .auto-planner-badge {
                        background: #e6fffa;
                        color: #319795;
                        padding: 6px;
                        border-radius: 6px;
                        font-weight: 700;
                        border: 1px solid #b2f5ea;
                    }
                    .universal-badge {
                        display: inline-block;
                        background: #fff8e1;
                        color: #d87d0d;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 800;
                        margin-bottom: 12px;
                        border: 1px solid #ffecb3;
                        text-transform: uppercase;
                    }
                    .info-text {
                        font-size: 12px;
                        color: #4a5568;
                        font-weight: 600;
                        line-height: 1.5;
                    }
                    .info-text small {
                        display: block;
                        margin-top: 6px;
                        font-size: 10px;
                        color: #a0aec0;
                        font-weight: 400;
                    }
                `}</style>
            </div>

            <CodeViewModal
                isOpen={showCode}
                onClose={() => setShowCode(false)}
                nodeType="PromptTemplate"
                code={code}
                filePath="app/runners/prompt_runner.py"
            />
        </>
    );
};

export default PromptNode;
