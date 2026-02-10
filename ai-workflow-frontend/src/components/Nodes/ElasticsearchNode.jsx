import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useNodeCode } from '../../hooks/useNodeCode';
import { CodeButton } from '../CodeButton';
import CodeViewModal from '../CodeViewModal';

const ElasticsearchNode = ({ data, id, isConnectable }) => {
    const [index, setIndex] = useState(data.index || 'properties');
    const [size, setSize] = useState(data.size || 10);
    const { code, showCode, loading, handleViewCode, setShowCode } = useNodeCode('elasticsearch');

    const handleIndexChange = (e) => {
        setIndex(e.target.value);
        if (data.onChange) {
            data.onChange(id, { index: e.target.value, size });
        }
    };

    const handleSizeChange = (e) => {
        setSize(parseInt(e.target.value));
        if (data.onChange) {
            data.onChange(id, { index, size: parseInt(e.target.value) });
        }
    };

    return (
        <>
            <div className="elasticsearch-node">
                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <div className="elasticsearch-node-header">
                    <div className="elasticsearch-node-icon">🔍</div>
                    <div className="elasticsearch-node-title">Elasticsearch</div>
                    <div className="elasticsearch-node-tag">Storage</div>
                    <CodeButton onClick={handleViewCode} loading={loading} />
                </div>

                <div className="elasticsearch-node-body">
                    <div className="universal-badge">
                        Vector Search
                    </div>

                    <div className="input-field">
                        <label>Index Name</label>
                        <input
                            type="text"
                            value={index}
                            onChange={handleIndexChange}
                            className="nodrag"
                            placeholder="properties"
                        />
                    </div>

                    <div className="input-field">
                        <label>Results Count</label>
                        <input
                            type="number"
                            value={size}
                            onChange={handleSizeChange}
                            className="nodrag number-input"
                            min="1"
                            max="50"
                        />
                    </div>

                    <div className="info-text">
                        Deep indexing engine ⚡
                        <br />
                        <small>Optimized for semantic retrieval</small>
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />

                <style jsx>{`
                    .elasticsearch-node {
                        background: linear-gradient(135deg, #f0ad4e 0%, #eea236 100%);
                        border: 2px solid #f0ad4e;
                        border-radius: 14px;
                        min-width: 260px;
                        box-shadow: 0 6px 20px rgba(240, 173, 78, 0.3);
                        transition: all 0.3s ease;
                        overflow: hidden;
                    }
                    .elasticsearch-node:hover {
                        box-shadow: 0 10px 30px rgba(240, 173, 78, 0.4);
                        transform: translateY(-3px);
                    }
                    .elasticsearch-node-header {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 14px;
                        border-bottom: 2px solid rgba(240, 173, 78, 0.2);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .elasticsearch-node-icon {
                        font-size: 1.3rem;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                    }
                    .elasticsearch-node-title {
                        font-weight: 700;
                        background: linear-gradient(135deg, #d58512, #eea236);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        font-size: 14px;
                        flex: 1;
                    }
                    .elasticsearch-node-tag {
                        font-size: 9px;
                        background: linear-gradient(135deg, #f0ad4e, #eea236);
                        color: #fff;
                        padding: 3px 8px;
                        border-radius: 12px;
                        text-transform: uppercase;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        margin-right: 8px;
                    }
                    .elasticsearch-node-body {
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
                        margin-bottom: 6px;
                    }
                    input, .number-input {
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
                    }
                    input:focus, .number-input:focus {
                        outline: none;
                        border-color: #f0ad4e;
                        background: #fff;
                        box-shadow: 0 0 0 3px rgba(240, 173, 78, 0.1);
                    }
                    .universal-badge {
                        display: inline-block;
                        background: #fcf8e3;
                        color: #d58512;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 800;
                        margin-bottom: 12px;
                        border: 1px solid #faebcc;
                        text-transform: uppercase;
                    }
                    .info-text {
                        font-size: 12px;
                        color: #4a5568;
                        font-weight: 600;
                        line-height: 1.5;
                        margin-top: 10px;
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

            <CodeViewModal
                isOpen={showCode}
                onClose={() => setShowCode(false)}
                nodeType="Elasticsearch"
                code={code}
                filePath="app/runners/elasticsearch_runner.py"
            />
        </>
    );
};

export default ElasticsearchNode;
