import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const SummarizationNode = ({ data, isConnectable }) => {
    return (
        <div className="summarization-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div className="summarization-node-header">
                <div className="summarization-node-icon">✨</div>
                <div className="summarization-node-title">AI Summarize</div>
                <div className="summarization-node-tag">Multi-Provider</div>
            </div>

            <div className="summarization-node-body">
                <div className="universal-badge">
                    Universal AI Agent
                </div>
                <div className="info-text">
                    Follows your chat instructions ⚡
                    <br />
                    <small>Gemini (Multi-Key) + OpenAI Fallback</small>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .summarization-node {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: 2px solid #5a67d8;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                .summarization-node:hover {
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                    transform: translateY(-3px);
                }
                .summarization-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(102, 126, 234, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .summarization-node-icon {
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                .summarization-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 14px;
                    flex: 1;
                }
                .summarization-node-tag {
                    font-size: 9px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: #fff;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .summarization-node-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    text-align: center;
                }
                .universal-badge {
                    display: inline-block;
                    background: #ebf4ff;
                    color: #5a67d8;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    border: 1px solid #c3dafe;
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
    );
};

export default memo(SummarizationNode);
