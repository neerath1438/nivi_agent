import React from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeCode } from '../../hooks/useNodeCode';
import { CodeButton } from '../CodeButton';
import CodeViewModal from '../CodeViewModal';

const ChatInputNode = ({ data, isConnectable }) => {
    const { code, showCode, loading, handleViewCode, setShowCode } = useNodeCode('chatInput');

    return (
        <>
            <div className="chat-input-node">
                <div className="chat-input-node-header">
                    <div className="chat-input-node-icon">💬</div>
                    <div className="chat-input-node-title">Chat Input</div>
                    <div className="chat-input-node-tag">Entry</div>
                    <CodeButton onClick={handleViewCode} loading={loading} />
                </div>

                <div className="chat-input-node-body">
                    <div className="universal-badge">
                        User Interface
                    </div>
                    <div className="info-text">
                        Captures user messages ⚡
                        <br />
                        <small>Direct integration with Chat UI</small>
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />

                <style jsx>{`
                    .chat-input-node {
                        background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
                        border: 2px solid #00d2ff;
                        border-radius: 14px;
                        min-width: 260px;
                        box-shadow: 0 6px 20px rgba(0, 210, 255, 0.3);
                        transition: all 0.3s ease;
                        overflow: hidden;
                    }
                    .chat-input-node:hover {
                        box-shadow: 0 10px 30px rgba(0, 210, 255, 0.4);
                        transform: translateY(-3px);
                    }
                    .chat-input-node-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 14px;
                        border-bottom: 2px solid rgba(0, 210, 255, 0.2);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .chat-input-node-icon {
                        font-size: 1.3rem;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                    }
                    .chat-input-node-title {
                        font-weight: 700;
                        background: linear-gradient(135deg, #00d2ff, #3a7bd5);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        font-size: 14px;
                        flex: 1;
                    }
                    .chat-input-node-tag {
                        font-size: 9px;
                        background: linear-gradient(135deg, #00d2ff, #3a7bd5);
                        color: #fff;
                        padding: 3px 8px;
                        border-radius: 12px;
                        text-transform: uppercase;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        margin-right: 8px;
                    }
                    .chat-input-node-body {
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.98);
                        text-align: center;
                    }
                    .universal-badge {
                        display: inline-block;
                        background: #e0f7fa;
                        color: #3a7bd5;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 800;
                        margin-bottom: 12px;
                        border: 1px solid #b2ebf2;
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
                nodeType="ChatInput"
                code={code}
                filePath="app/runners/chat_input_runner.py"
            />
        </>
    );
};

export default ChatInputNode;
