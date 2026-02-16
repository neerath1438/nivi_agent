import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeCode } from '../../hooks/useNodeCode';
import { CodeButton } from '../CodeButton';
import CodeViewModal from '../CodeViewModal';

const LLMNode = ({ data, isConnectable }) => {
    const { code, showCode, loading, handleViewCode, setShowCode } = useNodeCode('llm');

    return (
        <>
            <div className="llm-execute-node">
                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <div className="llm-execute-node-header">
                    <div className="llm-execute-node-icon">🤖</div>
                    <div className="llm-execute-node-title">LLM Execute</div>
                    <div className="llm-execute-node-tag">Master AI</div>
                    <CodeButton onClick={handleViewCode} loading={loading} />
                </div>

                <div className="llm-execute-node-body">
                    <div className="universal-badge">
                        Cognitive Engine
                    </div>

                    <div className="node-info-card">
                        <div className="info-label">Current Task</div>
                        <div className="info-value">Processing logic & prompts</div>
                    </div>

                    <div className="info-text">
                        Dynamic prompt execution ⚡
                        <br />
                        <small>Multimodal & Multi-Provider aware</small>
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />

                <style jsx>{`
                    .llm-execute-node {
                        background: linear-gradient(135deg, #7f00ff 0%, #e100ff 100%);
                        border: 2px solid #7f00ff;
                        border-radius: 14px;
                        min-width: 260px;
                        box-shadow: 0 6px 20px rgba(127, 0, 255, 0.3);
                        transition: all 0.3s ease;
                        overflow: hidden;
                    }
                    .llm-execute-node:hover {
                        box-shadow: 0 10px 30px rgba(127, 0, 255, 0.4);
                        transform: translateY(-3px);
                    }
                    .llm-execute-node-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 14px;
                        border-bottom: 2px solid rgba(127, 0, 255, 0.2);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .llm-execute-node-icon {
                        font-size: 1.3rem;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                    }
                    .llm-execute-node-title {
                        font-weight: 700;
                        background: linear-gradient(135deg, #7f00ff, #e100ff);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        font-size: 14px;
                        flex: 1;
                    }
                    .llm-execute-node-tag {
                        font-size: 9px;
                        background: linear-gradient(135deg, #7f00ff, #e100ff);
                        color: #fff;
                        padding: 3px 8px;
                        border-radius: 12px;
                        text-transform: uppercase;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        margin-right: 8px;
                    }
                    .llm-execute-node-body {
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.98);
                        text-align: center;
                    }
                    .node-info-card {
                        background: #f8f9fa;
                        border: 1px solid #e9ecef;
                        border-radius: 8px;
                        padding: 10px;
                        margin-bottom: 12px;
                        text-align: left;
                    }
                    .info-label {
                        font-size: 10px;
                        color: #6c757d;
                        text-transform: uppercase;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }
                    .info-value {
                        font-size: 12px;
                        color: #212529;
                        font-weight: 600;
                    }
                    .universal-badge {
                        display: inline-block;
                        background: #f3e5f5;
                        color: #7f00ff;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 800;
                        margin-bottom: 12px;
                        border: 1px solid #e1bee7;
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
                nodeType="LLM"
                code={code}
                filePath="app/runners/llm_runner.py"
            />
        </>
    );
};

export default memo(LLMNode);
