import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const SKSportsWearNode = ({ data, selected, isConnectable }) => {
    return (
        <div className={`whatsapp-node sk-sports-node ${selected ? 'selected' : ''}`}>
            {/* Header matches WhatsApp Trigger/Send model */}
            <div className="whatsapp-node-header">
                <div className="whatsapp-node-icon">💎</div>
                <div className="whatsapp-node-title">SK Sports Wear</div>
                <div className="whatsapp-node-tag">BRAND</div>
            </div>

            <div className="whatsapp-node-body">
                <div className="universal-badge">
                    ⚡ Branded Greeting
                </div>

                <div className="logic-desc">
                    <span style={{ fontSize: '14px' }}>🔄</span>
                    <p>Rotating 10 attractive templates for new customers</p>
                </div>

                <div className="variable-list">
                    <div className="var-item">✓ {"{{company_name}}"}</div>
                    <div className="var-item">✓ {"{{catalog_link}}"}</div>
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
                style={{ background: '#f6ad55' }}
            />

            <style jsx>{`
                .sk-sports-node {
                    background: linear-gradient(135deg, #f6ad55 0%, #dd6b20 100%);
                    border: 2px solid #ed8936;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(237, 137, 54, 0.3);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    color: white;
                }
                .sk-sports-node:hover {
                    box-shadow: 0 10px 30px rgba(237, 137, 54, 0.4);
                    transform: translateY(-3px);
                }
                .sk-sports-node.selected {
                    box-shadow: 0 0 0 4px rgba(237, 137, 54, 0.2), 0 10px 30px rgba(237, 137, 54, 0.5);
                    transform: scale(1.02) translateY(-3px);
                }
                .whatsapp-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(237, 137, 54, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                }
                .whatsapp-node-icon { font-size: 1.3rem; }
                .whatsapp-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #f6ad55, #dd6b20);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 14px;
                    flex: 1;
                }
                .whatsapp-node-tag {
                    font-size: 9px;
                    background: #ed8936;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .whatsapp-node-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    text-align: center;
                    color: #4a5568;
                }
                .universal-badge {
                    display: inline-block;
                    background: #fffaf0;
                    color: #dd6b20;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    border: 1px solid #fbd38d;
                    text-transform: uppercase;
                }
                .logic-desc {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    margin-bottom: 15px;
                }
                .logic-desc p {
                    font-size: 12px;
                    font-weight: 600;
                    line-height: 1.4;
                    margin: 0;
                }
                .variable-list {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    border-top: 1px solid #edf2f7;
                    padding-top: 12px;
                }
                .var-item {
                    font-size: 10px;
                    font-weight: 700;
                    color: #ed8936;
                    background: #fff5f5;
                    padding: 2px 8px;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default memo(SKSportsWearNode);
