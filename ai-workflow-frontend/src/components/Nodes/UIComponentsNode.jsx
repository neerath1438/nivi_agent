import React from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeCode } from '../../hooks/useNodeCode';
import { CodeButton } from '../CodeButton';
import CodeViewModal from '../CodeViewModal';

const UIComponentsNode = ({ data, isConnectable }) => {
    const { code, showCode, loading, handleViewCode, setShowCode } = useNodeCode('uiComponents');

    return (
        <>
            <div className="ui-components-node">
                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <div className="ui-components-node-header">
                    <div className="ui-components-node-icon">🎨</div>
                    <div className="ui-components-node-title">UI Components</div>
                    <div className="ui-components-node-tag">DESIGN</div>
                    <CodeButton onClick={handleViewCode} loading={loading} />
                </div>

                <div className="ui-components-node-body">
                    <div className="universal-badge">
                        Design Engine
                    </div>

                    <div className="node-info-card">
                        <div className="info-label">STATUS</div>
                        <div className="info-value">Assembling UI components...</div>
                    </div>

                    <div className="info-text">
                        Assembling UI components using local library ⚡
                        <br />
                        <small>Premium styling applied</small>
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />

                <style jsx>{`
                    .ui-components-node {
                        background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
                        border: 2px solid #ec4899;
                        border-radius: 14px;
                        min-width: 260px;
                        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
                        transition: all 0.3s ease;
                        overflow: hidden;
                    }
                    .ui-components-node:hover {
                        box-shadow: 0 10px 30px rgba(236, 72, 153, 0.4);
                        transform: translateY(-3px);
                    }
                    .ui-components-node-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 14px;
                        border-bottom: 2px solid rgba(236, 72, 153, 0.2);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .ui-components-node-icon {
                        font-size: 1.3rem;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                    }
                    .ui-components-node-title {
                        font-weight: 700;
                        background: linear-gradient(135deg, #ec4899, #a855f7);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        font-size: 14px;
                        flex: 1;
                    }
                    .ui-components-node-tag {
                        font-size: 9px;
                        background: #fdf2f8;
                        color: #ec4899;
                        padding: 3px 8px;
                        border-radius: 12px;
                        text-transform: uppercase;
                        font-weight: 800;
                        letter-spacing: 0.5px;
                        margin-right: 8px;
                    }
                    .ui-components-node-body {
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.98);
                        text-align: center;
                    }
                    .node-info-card {
                        background: #fdf2f8;
                        border: 1px solid #fbcfe8;
                        border-radius: 8px;
                        padding: 10px;
                        margin-bottom: 12px;
                        text-align: left;
                    }
                    .info-label {
                        font-size: 10px;
                        color: #db2777;
                        text-transform: uppercase;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }
                    .info-value {
                        font-size: 11px;
                        color: #1f2937;
                        font-weight: 600;
                    }
                    .universal-badge {
                        display: inline-block;
                        background: #fce7f3;
                        color: #db2777;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 800;
                        margin-bottom: 12px;
                        border: 1px solid #fbcfe8;
                        text-transform: uppercase;
                    }
                    .info-text {
                        font-size: 12px;
                        color: #4b5563;
                        font-weight: 600;
                        line-height: 1.4;
                    }
                    .info-text small {
                        display: block;
                        margin-top: 6px;
                        font-size: 10px;
                        color: #9ca3af;
                        font-weight: 400;
                    }
                `}</style>
            </div>

            <CodeViewModal
                isOpen={showCode}
                onClose={() => setShowCode(false)}
                nodeType="uiComponents"
                code={code}
                filePath="app/runners/ui_components_runner.py"
            />
        </>
    );
};

export default UIComponentsNode;
