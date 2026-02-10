import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const ConditionNode = ({ data, isConnectable }) => {
    return (
        <div className="condition-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div className="condition-node-header">
                <div className="condition-node-icon">⚖️</div>
                <div className="condition-node-title">Condition (If/Else)</div>
                <div className="condition-node-tag">Logic</div>
            </div>

            <div className="condition-node-body">
                <div className="universal-badge">
                    Decision Point
                </div>

                <div className="input-field">
                    <label>If Output...</label>
                    <select
                        value={data.condition_type || 'contains'}
                        onChange={(e) => data.onChange(data.id, { condition_type: e.target.value })}
                        className="nodrag"
                    >
                        <option value="is_new">Is New User (Not Found)</option>
                        <option value="is_existing">Is Existing User (Found)</option>
                        <option value="contains">Contains</option>
                        <option value="not_contains">Does Not Contain</option>
                        <option value="equals">Equals</option>
                        <option value="not_equals">Does Not Equal</option>
                        <option value="not_empty">Is Not Empty</option>
                    </select>
                </div>

                {data.condition_type !== 'not_empty' && (
                    <div className="input-field">
                        <label>This value</label>
                        <input
                            type="text"
                            value={data.value || ''}
                            onChange={(e) => data.onChange(data.id, { value: e.target.value })}
                            placeholder="e.g. success"
                            className="nodrag"
                        />
                    </div>
                )}

                <div className="info-text">
                    Branches the workflow ⚡
                    <br />
                    <small>True/False logic paths</small>
                </div>
            </div>

            <div className="handle-wrapper" style={{ position: 'absolute', right: '-12px', top: '45%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                <span className="handle-label true">True</span>
                <Handle
                    type="source"
                    position={Position.Right}
                    id="true"
                    style={{ background: '#10b981', width: '14px', height: '14px', position: 'relative', top: 'auto', right: 'auto', border: '2px solid white' }}
                    isConnectable={isConnectable}
                />
            </div>
            <div className="handle-wrapper" style={{ position: 'absolute', right: '-12px', top: '80%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                <span className="handle-label false">False</span>
                <Handle
                    type="source"
                    position={Position.Right}
                    id="false"
                    style={{ background: '#ef4444', width: '14px', height: '14px', position: 'relative', top: 'auto', right: 'auto', border: '2px solid white' }}
                    isConnectable={isConnectable}
                />
            </div>

            <style jsx>{`
                .condition-node {
                    background: linear-gradient(135deg, #ff0844 0%, #ffb199 100%);
                    border: 2px solid #ff0844;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(255, 8, 68, 0.3);
                    transition: all 0.3s ease;
                    overflow: visible;
                    position: relative;
                }
                .condition-node:hover {
                    box-shadow: 0 10px 30px rgba(255, 8, 68, 0.4);
                    transform: translateY(-3px);
                }
                .condition-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(255, 8, 68, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border-radius: 12px 12px 0 0;
                }
                .condition-node-icon {
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                .condition-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #ff0844, #ffb199);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 14px;
                    flex: 1;
                }
                .condition-node-tag {
                    font-size: 9px;
                    background: linear-gradient(135deg, #ff0844, #ffb199);
                    color: #fff;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .condition-node-body {
                    padding: 16px;
                    padding-bottom: 40px;
                    background: rgba(255, 255, 255, 0.98);
                    text-align: center;
                    border-radius: 0 0 12px 12px;
                }
                .input-field {
                    text-align: left;
                    margin-bottom: 12px;
                }
                label {
                    display: block;
                    font-size: 11px;
                    font-weight: 700;
                    color: #4a5568;
                    margin-bottom: 6px;
                }
                select, input {
                    width: 100%;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 8px 10px;
                    font-size: 12px;
                    color: #2d3748;
                    background: #f7fafc;
                    transition: all 0.2s;
                    cursor: pointer;
                    font-weight: 500;
                    box-sizing: border-box;
                }
                select:focus, input:focus {
                    outline: none;
                    border-color: #ff0844;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(255, 8, 68, 0.1);
                }
                .universal-badge {
                    display: inline-block;
                    background: #ffebee;
                    color: #ff0844;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    border: 1px solid #ffcdd2;
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
                .handles-container {
                    position: absolute;
                    right: -10px;
                    bottom: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .handle-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    justify-content: flex-end;
                }
                .handle-label {
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    padding: 2px 6px;
                    border-radius: 4px;
                    pointer-events: none;
                }
                .handle-label.true { background: #e6fffa; color: #10b981; }
                .handle-label.false { background: #fff5f5; color: #ef4444; }
            `}</style>
        </div>
    );
};

export default memo(ConditionNode);
