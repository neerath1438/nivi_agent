import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const LoopNode = ({ id, data, isConnectable }) => {
    return (
        <div className="loop-node">
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} />

            <div className="loop-node-header">
                <div className="loop-node-icon">🔄</div>
                <div className="loop-node-title">For Loop (Iterator)</div>
                <div className="loop-node-tag">Control</div>
            </div>

            <div className="loop-node-body">
                <div className="input-field">
                    <label>Number of Iterations</label>
                    <input
                        type="number"
                        value={data.iterations || 1}
                        onChange={(e) => data.onChange?.(id, { iterations: e.target.value })}
                        min="1"
                        max="100"
                        className="nodrag"
                    />
                </div>

                <div className="info-text">
                    Executes iterative sub-branches ⚡
                    <br />
                    <small>Loop resets state on each pass</small>
                </div>
            </div>

            {/* Dual Outputs Handles */}
            <div className="handle-container">
                <div className="handle-wrapper">
                    <span className="handle-label each">Each</span>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="each"
                        isConnectable={isConnectable}
                        className="handle-blue"
                    />
                </div>
                <div className="handle-wrapper">
                    <span className="handle-label done">Done</span>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="done"
                        isConnectable={isConnectable}
                        className="handle-green"
                    />
                </div>
            </div>

            <style jsx>{`
                .loop-node {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    border: 2px solid #f59e0b;
                    border-radius: 14px;
                    min-width: 220px;
                    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
                    position: relative;
                    transition: all 0.3s ease;
                }
                .loop-node:hover {
                    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
                }
                .loop-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-radius: 12px 12px 0 0;
                    border-bottom: 2px solid rgba(245, 158, 11, 0.2);
                }
                .loop-node-icon { font-size: 1.4rem; }
                .loop-node-title {
                    font-weight: 800;
                    color: #92400e;
                    font-size: 14px;
                    flex: 1;
                }
                .loop-node-tag {
                    font-size: 9px;
                    background: #fef3c7;
                    color: #d97706;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                }
                .loop-node-body {
                    padding: 16px;
                    background: white;
                    border-radius: 0 0 12px 12px;
                    text-align: center;
                    padding-bottom: 60px; /* Space for handles */
                }
                .input-field { text-align: left; }
                label { display: block; font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 6px; text-transform: uppercase; }
                input { 
                    width: 100%; 
                    padding: 8px; 
                    border: 2px solid #f1f5f9; 
                    border-radius: 8px; 
                    font-size: 13px;
                    box-sizing: border-box;
                    background: #f8fafc;
                    font-weight: 700;
                    color: #1e293b;
                }
                input:focus { outline: none; border-color: #f59e0b; background: white; }
                .info-text { font-size: 11px; margin-top: 15px; color: #4b5563; font-weight: 600; }
                .info-text small { font-size: 9px; color: #94a3b8; }

                .handle-container {
                    position: absolute;
                    right: 0;
                    bottom: 12px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .handle-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 8px;
                    padding-right: 12px;
                    position: relative;
                }
                .handle-label {
                    font-size: 9px;
                    font-weight: 900;
                    text-transform: uppercase;
                    padding: 2px 8px;
                    border-radius: 4px;
                    color: white;
                }
                .handle-label.each { background: #3b82f6; }
                .handle-label.done { background: #10b981; }

                :global(.handle-blue) { background: #3b82f6 !important; width: 12px !important; height: 12px !important; border: 2px solid white !important; right: -6px !important; }
                :global(.handle-green) { background: #10b981 !important; width: 12px !important; height: 12px !important; border: 2px solid white !important; right: -6px !important; }
            `}</style>
        </div>
    );
};

export default memo(LoopNode);
