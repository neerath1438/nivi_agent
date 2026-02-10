import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeCode } from '../../hooks/useNodeCode';
import { CodeButton } from '../CodeButton';
import CodeViewModal from '../CodeViewModal';

const ScreenshotNode = ({ data, isConnectable }) => {
    const { code, showCode, loading, handleViewCode, setShowCode } = useNodeCode('screenshot');

    return (
        <>
            <div className="screenshot-node">
                <div className="screenshot-node-header">
                    <div className="screenshot-node-icon">📸</div>
                    <div className="screenshot-node-title">Screenshot</div>
                    <div className="screenshot-node-tag">Utility</div>
                    <CodeButton onClick={handleViewCode} loading={loading} />
                </div>

                <div className="screenshot-node-body">
                    <div className="universal-badge">
                        Image Engine
                    </div>

                    <div className="info-text">
                        Captures UI Preview ⚡
                        <br />
                        <small>PNG / HD Quality</small>
                    </div>

                    {data.screenshot_url && (
                        <div className="screenshot-preview-container">
                            <img
                                src={data.screenshot_url}
                                alt="UI Preview"
                                className="screenshot-preview-img"
                            />
                        </div>
                    )}
                </div>

                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                    className="handle-left"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                    className="handle-right"
                />

                <style jsx>{`
                    .screenshot-node {
                        background: linear-gradient(135deg, #FF512F 0%, #DD2476 100%);
                        border: 2px solid #FF512F;
                        border-radius: 14px;
                        min-width: 260px;
                        box-shadow: 0 6px 20px rgba(255, 81, 47, 0.3);
                        transition: all 0.3s ease;
                        overflow: hidden;
                    }
                    .screenshot-node:hover {
                        box-shadow: 0 10px 30px rgba(255, 81, 47, 0.4);
                        transform: translateY(-3px);
                    }
                    .screenshot-node-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 14px;
                        border-bottom: 2px solid rgba(255, 81, 47, 0.2);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .screenshot-node-icon {
                        font-size: 1.3rem;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                    }
                    .screenshot-node-title {
                        font-weight: 700;
                        background: linear-gradient(135deg, #FF512F, #DD2476);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        font-size: 14px;
                        flex: 1;
                    }
                    .screenshot-node-tag {
                        font-size: 9px;
                        background: linear-gradient(135deg, #FF512F, #DD2476);
                        color: #fff;
                        padding: 3px 8px;
                        border-radius: 12px;
                        text-transform: uppercase;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        margin-right: 8px;
                    }
                    .screenshot-node-body {
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.98);
                        text-align: center;
                    }
                    .universal-badge {
                        display: inline-block;
                        background: #FFF5F5;
                        color: #DD2476;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 800;
                        margin-bottom: 12px;
                        border: 1px solid #FED7E2;
                        text-transform: uppercase;
                    }
                    .info-text {
                        font-size: 12px;
                        color: #4a5568;
                        font-weight: 600;
                        line-height: 1.5;
                        margin-bottom: 12px;
                    }
                    .info-text small {
                        display: block;
                        margin-top: 6px;
                        font-size: 10px;
                        color: #a0aec0;
                        font-weight: 400;
                    }
                    .screenshot-preview-container {
                        margin-top: 8px;
                        border-radius: 8px;
                        overflow: hidden;
                        border: 1px solid #e2e8f0;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    }
                    .screenshot-preview-img {
                        width: 100%;
                        height: auto;
                        display: block;
                    }
                `}</style>
            </div>

            <CodeViewModal
                isOpen={showCode}
                onClose={() => setShowCode(false)}
                nodeType="Screenshot"
                code={code}
                filePath="app/runners/screenshot_runner.py"
            />
        </>
    );
};

export default memo(ScreenshotNode);
