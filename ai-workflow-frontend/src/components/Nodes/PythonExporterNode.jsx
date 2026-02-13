import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const PythonExporterNode = ({ data, isConnectable }) => {
    return (
        <div className="python-exporter-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div className="python-exporter-node-header">
                <div className="python-exporter-node-icon">🐍</div>
                <div className="python-exporter-node-title">Python Exporter</div>
                <div className="python-exporter-node-tag">Tools</div>
            </div>

            <div className="python-exporter-node-body">
                <div className="universal-badge">
                    Code Generation
                </div>

                <div className="info-text">
                    Enables Python code export ⚡
                    <br />
                    <small>Get end-to-end script in Chat</small>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .python-exporter-node {
                    background: linear-gradient(135deg, #3776ab 0%, #ffd43b 100%);
                    border: 2px solid #3776ab;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(55, 118, 171, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                .python-exporter-node:hover {
                    box-shadow: 0 10px 30px rgba(55, 118, 171, 0.4);
                    transform: translateY(-3px);
                }
                .python-exporter-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(55, 118, 171, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .python-exporter-node-icon {
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                .python-exporter-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #3776ab, #ffd33d);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 14px;
                    flex: 1;
                }
                .python-exporter-node-tag {
                    font-size: 9px;
                    background: linear-gradient(135deg, #3776ab, #ffd33d);
                    color: #fff;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .python-exporter-node-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    text-align: center;
                }
                .universal-badge {
                    display: inline-block;
                    background: #f0f7ff;
                    color: #3776ab;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    border: 1px solid #d0e7ff;
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

export default memo(PythonExporterNode);
