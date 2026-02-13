import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';

const GhostRecorderNode = ({ id, data, isConnectable }) => {
    const [isRecording, setIsRecording] = useState(false);

    const toggleRecording = () => {
        const nextState = !isRecording;
        setIsRecording(nextState);
        if (data.onToggleRecording) {
            data.onToggleRecording(nextState);
        }
    };

    return (
        <div className="ghost-recorder-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div className="ghost-recorder-node-header">
                <div className="ghost-recorder-node-icon">👻</div>
                <div className="ghost-recorder-node-title">Ghost Recorder</div>
                <div className="ghost-recorder-node-tag">QA Tools</div>
            </div>

            <div className="ghost-recorder-node-body">
                <div className="info-text">
                    Tracks manual actions and<br />generates nodes automatically.
                </div>

                <div className="input-field">
                    <label>Documentation Mode</label>
                    <div className="toggle-group" data-manual-mode={data.manualMode ? "true" : "false"}>
                        <button
                            className={`toggle-btn ${!data.manualMode ? 'active' : ''}`}
                            onClick={() => data.onChange?.(id, { manualMode: false })}
                        >
                            ⚙️ Testing
                        </button>
                        <button
                            className={`toggle-btn ${data.manualMode ? 'active' : ''}`}
                            style={data.manualMode ? { background: '#8b5cf6', borderColor: '#8b5cf6' } : {}}
                            onClick={() => data.onChange?.(id, { manualMode: true })}
                        >
                            📸 Manual
                        </button>
                    </div>
                </div>

                <div className="input-field">
                    <label>Browser Mode</label>
                    <div className="toggle-group">
                        <button
                            className={`toggle-btn ${data.mode !== 'headed' ? 'active' : ''}`}
                            onClick={() => data.onChange?.(data.id, { mode: 'headless' })}
                        >
                            Headless
                        </button>
                        <button
                            className={`toggle-btn ${data.mode === 'headed' ? 'active' : ''}`}
                            onClick={() => data.onChange?.(data.id, { mode: 'headed' })}
                        >
                            Headed
                        </button>
                    </div>
                </div>

                <button
                    className={`record-btn ${isRecording ? 'recording' : ''}`}
                    onClick={toggleRecording}
                >
                    <span className="dot"></span>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .ghost-recorder-node {
                    background: linear-gradient(135deg, #2D3748 0%, #1A202C 100%);
                    border: 2px solid #4A5568;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                    color: white;
                }
                .ghost-recorder-node:hover {
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    transform: translateY(-3px);
                }
                .ghost-recorder-node-header {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 12px 14px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .ghost-recorder-node-icon {
                    font-size: 1.3rem;
                }
                .ghost-recorder-node-title {
                    font-weight: 700;
                    color: #E2E8F0;
                    font-size: 14px;
                    flex: 1;
                }
                .ghost-recorder-node-tag {
                    font-size: 9px;
                    background: #E53E3E;
                    color: #fff;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .ghost-recorder-node-body {
                    padding: 16px;
                    text-align: center;
                }
                .info-text {
                    font-size: 12px;
                    color: #A0AEC0;
                    margin-bottom: 16px;
                    line-height: 1.4;
                }
                .input-field {
                    margin-bottom: 16px;
                    text-align: left;
                }
                .input-field label {
                    display: block;
                    font-size: 11px;
                    color: #CBD5E0;
                    margin-bottom: 6px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .toggle-group {
                    display: flex;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #2D3748;
                    border: 1px solid #4A5568;
                }
                .toggle-btn {
                    flex: 1;
                    padding: 8px 12px;
                    border: none;
                    background: transparent;
                    color: #A0AEC0;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .toggle-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                .toggle-btn.active {
                    background: #8b5cf6; /* Purple */
                    color: white;
                    font-weight: 700;
                    border-color: #8b5cf6;
                }
                .record-btn {
                    width: 100%;
                    padding: 10px;
                    border-radius: 8px;
                    border: none;
                    background: #3182CE;
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .record-btn:hover {
                    background: #2B6CB0;
                    transform: scale(1.02);
                }
                .record-btn.recording {
                    background: #E53E3E;
                    animation: pulse 2s infinite;
                }
                .dot {
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                }
                .record-btn.recording .dot {
                    animation: blink 1s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(229, 62, 62, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0); }
                }
                @keyframes blink {
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default memo(GhostRecorderNode);
