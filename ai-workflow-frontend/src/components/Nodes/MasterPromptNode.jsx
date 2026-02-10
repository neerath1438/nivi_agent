import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Layers, Database, Code } from 'lucide-react';

const MasterPromptNode = ({ data, isConnectable }) => {
    return (
        <div className="master-prompt-node">
            <div className="master-prompt-header">
                <div className="master-prompt-icon">
                    <Layers size={18} color="#6366f1" />
                </div>
                <div className="master-prompt-title">Master Prompt</div>
                <div className="master-prompt-tag">Master JSON</div>
            </div>

            <div className="master-prompt-body">
                <div className="struct-badge">
                    <Database size={10} style={{ marginRight: 4 }} />
                    JSON Structuring
                </div>

                <div className="data-preview">
                    <div className="data-item">
                        <Code size={12} color="#94a3b8" />
                        <span>Objective: Structured</span>
                    </div>
                    <div className="data-item">
                        <Code size={12} color="#94a3b8" />
                        <span>Components: Mapped</span>
                    </div>
                    <div className="data-item">
                        <Code size={12} color="#94a3b8" />
                        <span>Logic: Calculated</span>
                    </div>
                </div>

                <div className="json-badge">
                    VALID FORMAT
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
                .master-prompt-node {
                    background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
                    border: 2px solid #6366f1;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                    color: white;
                }
                .master-prompt-node:hover {
                    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
                    transform: translateY(-3px);
                }
                .master-prompt-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(99, 102, 241, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                }
                .master-prompt-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #6366f1, #4338ca);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 14px;
                    flex: 1;
                }
                .master-prompt-tag {
                    font-size: 9px;
                    background: #e0e7ff;
                    color: #4338ca;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .master-prompt-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    color: #4b5563;
                }
                .struct-badge {
                    display: inline-flex;
                    align-items: center;
                    background: #eef2ff;
                    color: #4f46e5;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    border: 1px solid #e0e7ff;
                }
                .data-preview {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 15px;
                }
                .data-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 11px;
                    font-weight: 500;
                    color: #475569;
                }
                .json-badge {
                    font-size: 8px;
                    font-weight: 800;
                    color: #10b981;
                    border: 1px solid #10b981;
                    padding: 2px 6px;
                    border-radius: 4px;
                    letter-spacing: 1px;
                    display: inline-block;
                }
            `}</style>
        </div>
    );
};

export default memo(MasterPromptNode);
