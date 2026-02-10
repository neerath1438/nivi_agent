import React from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeCode } from '../../hooks/useNodeCode';
import { CodeButton } from '../CodeButton';
import CodeViewModal from '../CodeViewModal';

const ZipNode = ({ data, isConnectable }) => {
    const { code, showCode, loading, handleViewCode, setShowCode } = useNodeCode('zip');
    const mode = data.mode || 'compress';

    const theme = {
        primary: '#FF9800',
        secondary: '#F57C00',
        icon: '📦',
        glow: 'rgba(255, 152, 0, 0.3)'
    };

    return (
        <>
            <div className="zip-node">
                <div className="zip-node-header">
                    <div className="zip-node-icon">{theme.icon}</div>
                    <div className="zip-node-title">Zip Utility</div>
                    <div className="zip-node-tag">Utility</div>
                    <CodeButton onClick={handleViewCode} loading={loading} />
                </div>

                <div className="zip-node-body">
                    <div className="universal-badge">
                        {mode === 'compress' ? 'Bundle Project' : 'Unpack Archive'}
                    </div>

                    <div className="node-info-card">
                        <div className="info-label">Current Mode</div>
                        <div className="info-value">{mode.toUpperCase()}</div>
                    </div>

                    <div className="info-text">
                        Flexible File Packaging ⚡
                        <br />
                        <small>Bundles multiple files into a single ZIP</small>
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
                    .zip-node {
                        background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
                        border: 2px solid ${theme.primary};
                        border-radius: 14px;
                        min-width: 250px;
                        box-shadow: 0 6px 20px ${theme.glow};
                        transition: all 0.3s ease;
                        overflow: hidden;
                    }
                    .zip-node:hover {
                        box-shadow: 0 10px 30px ${theme.glow};
                        transform: translateY(-3px);
                    }
                    .zip-node-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 14px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border-bottom: 2px solid rgba(255, 152, 0, 0.2);
                    }
                    .zip-node-icon {
                        font-size: 1.4rem;
                    }
                    .zip-node-title {
                        font-weight: 800;
                        color: ${theme.secondary};
                        font-size: 14px;
                        flex: 1;
                    }
                    .zip-node-tag {
                        font-size: 9px;
                        background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
                        color: #fff;
                        padding: 2px 8px;
                        border-radius: 12px;
                        text-transform: uppercase;
                        font-weight: 700;
                        margin-right: 8px;
                    }
                    .zip-node-body {
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.98);
                        text-align: center;
                    }
                    .universal-badge {
                        display: inline-block;
                        background: #fff3e0;
                        color: ${theme.secondary};
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 10px;
                        font-weight: 900;
                        margin-bottom: 12px;
                        border: 1px solid #ffe0b2;
                        text-transform: uppercase;
                    }
                    .node-info-card {
                        background: #fffaf0;
                        border: 1px solid #ffe0b2;
                        border-radius: 8px;
                        padding: 10px;
                        margin-bottom: 12px;
                        text-align: left;
                    }
                    .info-label {
                        font-size: 9px;
                        color: #8a6d3b;
                        text-transform: uppercase;
                        font-weight: 800;
                    }
                    .info-value {
                        font-size: 12px;
                        color: #5d4037;
                        font-weight: 700;
                    }
                    .info-text {
                        font-size: 11px;
                        color: #4a5568;
                        font-weight: 600;
                    }
                    .info-text small {
                        display: block;
                        margin-top: 4px;
                        font-size: 9px;
                        color: #94a3b8;
                    }
                `}</style>
            </div>

            <CodeViewModal
                isOpen={showCode}
                onClose={() => setShowCode(false)}
                nodeType="ZipUtility"
                code={code}
                filePath="app/runners/zip_runner.py"
            />
        </>
    );
};

export default ZipNode;
