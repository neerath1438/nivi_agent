import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const SearchNode = ({ data, isConnectable }) => {
    return (
        <div className="search-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div className="search-node-header">
                <div className="search-node-icon">🔍</div>
                <div className="search-node-title">Google Search</div>
                <div className="search-node-tag">Grounding</div>
            </div>

            <div className="search-node-body">
                <div className="universal-badge">
                    Real-time Web
                </div>

                <div className="input-field">
                    <label>Search Query</label>
                    <div className="query-hint">Use {`{input}`} for dynamic search</div>
                    <textarea
                        rows="2"
                        value={data.query || '{input}'}
                        onChange={(evt) => data.onChange(data.id, { query: evt.target.value })}
                        className="nodrag"
                        placeholder="e.g. Bus timings from {input} to Rajapalayam"
                    />
                </div>

                <div className="info-text">
                    Verifies AI facts with web search ⚡
                    <br />
                    <small>Powered by Google Search Engine</small>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <style jsx>{`
                .search-node {
                    background: linear-gradient(135deg, #134e5e 0%, #71b280 100%);
                    border: 2px solid #134e5e;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(19, 78, 94, 0.3);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                .search-node:hover {
                    box-shadow: 0 10px 30px rgba(19, 78, 94, 0.4);
                    transform: translateY(-3px);
                }
                .search-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(19, 78, 94, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .search-node-icon {
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                .search-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #134e5e, #71b280);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 14px;
                    flex: 1;
                }
                .search-node-tag {
                    font-size: 9px;
                    background: linear-gradient(135deg, #134e5e, #71b280);
                    color: #fff;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .search-node-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    text-align: center;
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
                    margin-bottom: 2px;
                }
                .query-hint {
                    font-size: 9px;
                    color: #718096;
                    margin-bottom: 8px;
                    font-style: italic;
                }
                textarea {
                    width: 100%;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 8px 10px;
                    font-size: 12px;
                    color: #2d3748;
                    background: #f7fafc;
                    transition: all 0.2s;
                    font-weight: 500;
                    box-sizing: border-box;
                    resize: vertical;
                }
                textarea:focus {
                    outline: none;
                    border-color: #134e5e;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(19, 78, 94, 0.1);
                }
                .universal-badge {
                    display: inline-block;
                    background: #e0f2f1;
                    color: #134e5e;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    border: 1px solid #b2dfdb;
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

export default memo(SearchNode);
