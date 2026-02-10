import React from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeCode } from '../../hooks/useNodeCode';
import { CodeButton } from '../CodeButton';
import CodeViewModal from '../CodeViewModal';

const OutputNode = ({ data, isConnectable }) => {
    const { code, showCode, loading, handleViewCode, setShowCode } = useNodeCode('chatOutput');

    return (
        <>
            <div className="chat-output-node">
                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <div className="chat-output-node-header">
                    <div className="chat-output-node-icon">✅</div>
                    <div className="chat-output-node-title">Chat Output</div>
                    <div className="chat-output-node-tag">Result</div>
                    <CodeButton onClick={handleViewCode} loading={loading} />
                </div>

                <div className="chat-output-node-body">
                    <div className="universal-badge">
                        Response Hub
                    </div>
                    <div className="info-text">
                        Delivers final results ⚡
                        <br />
                        <small>Rich text & Download support</small>
                    </div>
                </div>

                <style jsx>{`
                    .chat-output-node {
                        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                        border: 2px solid #11998e;
                        border-radius: 14px;
                        min-width: 260px;
                        box-shadow: 0 6px 20px rgba(17, 153, 142, 0.3);
                        transition: all 0.3s ease;
                        overflow: hidden;
                    }
                    .chat-output-node:hover {
                        box-shadow: 0 10px 30px rgba(17, 153, 142, 0.4);
                        transform: translateY(-3px);
                    }
                    .chat-output-node-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 14px;
                        border-bottom: 2px solid rgba(17, 153, 142, 0.2);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .chat-output-node-icon {
                        font-size: 1.3rem;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                    }
                    .chat-output-node-title {
                        font-weight: 700;
                        background: linear-gradient(135deg, #11998e, #38ef7d);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        font-size: 14px;
                        flex: 1;
                    }
                    .chat-output-node-tag {
                        font-size: 9px;
                        background: linear-gradient(135deg, #11998e, #38ef7d);
                        color: #fff;
                        padding: 3px 8px;
                        border-radius: 12px;
                        text-transform: uppercase;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        margin-right: 8px;
                    }
                    .chat-output-node-body {
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.98);
                        text-align: center;
                    }
                    .universal-badge {
                        display: inline-block;
                        background: #e0f2f1;
                        color: #11998e;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 800;
                        margin-bottom: 12px;
                        border: 1px solid #b2dfdb;
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
                nodeType="ChatOutput"
                code={code}
                filePath="app/runners/output_runner.py"
            />
        </>
    );
};

export default OutputNode;
