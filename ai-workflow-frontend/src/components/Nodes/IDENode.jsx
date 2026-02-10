import React from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeCode } from '../../hooks/useNodeCode';
import { CodeButton } from '../CodeButton';
import CodeViewModal from '../CodeViewModal';

const IDENode = ({ data, isConnectable }) => {
    const { code, showCode, loading, handleViewCode, setShowCode } = useNodeCode('ide');

    const theme = {
        primary: '#6366f1',
        secondary: '#4f46e5',
        icon: '💻',
        glow: 'rgba(99, 102, 241, 0.3)'
    };

    return (
        <>
            <div className="ide-node">
                <div className="ide-node-header">
                    <div className="ide-node-icon">{theme.icon}</div>
                    <div className="ide-node-title">IDE Interface</div>
                    <div className="ide-node-tag">Runner</div>
                    <CodeButton onClick={handleViewCode} loading={loading} />
                </div>

                <div className="ide-node-body">
                    <div className="universal-badge">
                        Integrated Development
                    </div>

                    <div className="node-info-card">
                        <div className="info-label">Current View</div>
                        <div className="info-value">SPLIT-SCREEN IDE</div>
                    </div>

                    <div className="info-text">
                        Live Code Review 🚀
                        <br />
                        <small>Provides file explorer and code editor in chat</small>
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
                    .ide-node {
                        background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
                        border: 2px solid ${theme.primary};
                        border-radius: 14px;
                        min-width: 250px;
                        box-shadow: 0 6px 20px ${theme.glow};
                        transition: all 0.3s ease;
                        overflow: hidden;
                    }
                    .ide-node:hover {
                        box-shadow: 0 10px 30px ${theme.glow};
                        transform: translateY(-3px);
                    }
                    .ide-node-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 14px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border-bottom: 2px solid rgba(99, 102, 241, 0.2);
                    }
                    .ide-node-icon {
                        font-size: 1.4rem;
                    }
                    .ide-node-title {
                        font-weight: 800;
                        color: ${theme.secondary};
                        font-size: 14px;
                        flex: 1;
                    }
                    .ide-node-tag {
                        font-size: 9px;
                        background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
                        color: #fff;
                        padding: 2px 8px;
                        border-radius: 12px;
                        text-transform: uppercase;
                        font-weight: 700;
                        margin-right: 8px;
                    }
                    .ide-node-body {
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.98);
                        text-align: center;
                    }
                    .universal-badge {
                        display: inline-block;
                        background: #eef2ff;
                        color: ${theme.secondary};
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 10px;
                        font-weight: 900;
                        margin-bottom: 12px;
                        border: 1px solid #e0e7ff;
                        text-transform: uppercase;
                    }
                    .node-info-card {
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        padding: 10px;
                        margin-bottom: 12px;
                        text-align: left;
                    }
                    .info-label {
                        font-size: 9px;
                        color: #64748b;
                        text-transform: uppercase;
                        font-weight: 800;
                    }
                    .info-value {
                        font-size: 12px;
                        color: #1e293b;
                        font-weight: 700;
                    }
                    .info-text {
                        font-size: 11px;
                        color: #334155;
                        font-weight: 600;
                    }
                    .info-text small {
                        display: block;
                        margin-top: 4px;
                        font-size: 9px;
                        color: #64748b;
                    }
                `}</style>
            </div>

            <CodeViewModal
                isOpen={showCode}
                onClose={() => setShowCode(false)}
                nodeType="IDE Runner"
                code={code}
                filePath="app/runners/ide_runner.py"
            />
        </>
    );
};

export default IDENode;
