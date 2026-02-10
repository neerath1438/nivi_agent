import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Wand2, Sparkles } from 'lucide-react';

const PromptGeneratorNode = ({ data, isConnectable }) => {
    return (
        <div className="prompt-gen-node">
            <div className="prompt-gen-header">
                <div className="prompt-gen-icon">
                    <Wand2 size={18} color="#f59e0b" />
                </div>
                <div className="prompt-gen-title">Prompt Generator</div>
                <div className="prompt-gen-tag">AI Optimizer</div>
            </div>

            <div className="prompt-gen-body">
                <div className="feature-badge">
                    <Sparkles size={10} style={{ marginRight: 4 }} />
                    Technical Expansion
                </div>
                <div className="label">Objective</div>
                <div className="value">{data.prompt || 'Optimizing intent...'}</div>

                <div className="status-indicator">
                    <div className="pulse"></div>
                    <span>Ready to expand</span>
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .prompt-gen-node {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    border: 2px solid #f59e0b;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                    color: white;
                }
                .prompt-gen-node:hover {
                    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
                    transform: translateY(-3px);
                }
                .prompt-gen-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(245, 158, 11, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                }
                .prompt-gen-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 14px;
                    flex: 1;
                }
                .prompt-gen-tag {
                    font-size: 9px;
                    background: #fef3c7;
                    color: #d97706;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .prompt-gen-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    color: #4b5563;
                }
                .feature-badge {
                    display: inline-flex;
                    align-items: center;
                    background: #fff7ed;
                    color: #ea580c;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    border: 1px solid #ffedd5;
                }
                .label {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #9ca3af;
                    margin-bottom: 4px;
                    font-weight: 600;
                }
                .value {
                    font-size: 12px;
                    font-weight: 500;
                    color: #1f2937;
                    line-height: 1.4;
                }
                .status-indicator {
                    margin-top: 15px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 10px;
                    color: #059669;
                    font-weight: 600;
                }
                .pulse {
                    width: 6px;
                    height: 6px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
            `}</style>
        </div>
    );
};

export default memo(PromptGeneratorNode);
