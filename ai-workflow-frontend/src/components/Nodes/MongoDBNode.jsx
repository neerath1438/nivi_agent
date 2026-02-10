import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const MongoDBNode = ({ data, id, isConnectable }) => {
    const [uri, setUri] = useState(data.uri || 'mongodb://localhost:27017');
    const [database, setDatabase] = useState(data.database || 'swiggy_db');
    const [collection, setCollection] = useState(data.collection || 'erode_restaurants');
    const [limit, setLimit] = useState(data.limit || 5);

    const [operation, setOperation] = useState(data.operation || 'FIND');
    const [query, setQuery] = useState(data.query ? JSON.stringify(data.query, null, 2) : '{"phone_number": "{phone_number}"}');
    const [document, setDocument] = useState(data.document ? JSON.stringify(data.document, null, 2) : '{"phone_number": "{phone_number}", "status": "active"}');

    const updateData = (newData) => {
        if (data.onChange) {
            data.onChange(id, newData);
        }
    };

    // Auto-save defaults if empty on mount
    React.useEffect(() => {
        const updates = {};
        if (!data.database) updates.database = database;
        if (!data.collection) updates.collection = collection;
        if (!data.operation) updates.operation = operation;

        // Ensure JSON fields are also persisted if missing
        if (!data.query) {
            try { updates.query = JSON.parse(query); } catch (e) { updates.query = query; }
        }
        if (!data.document) {
            try { updates.document = JSON.parse(document); } catch (e) { updates.document = document; }
        }

        if (Object.keys(updates).length > 0) {
            updateData(updates);
        }
    }, []);

    const handleDbChange = (e) => {
        setDatabase(e.target.value);
        updateData({ database: e.target.value });
    };

    const handleCollChange = (e) => {
        setCollection(e.target.value);
        updateData({ collection: e.target.value });
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value));
        updateData({ limit: parseInt(e.target.value) });
    };

    const handleOperationChange = (e) => {
        setOperation(e.target.value);
        updateData({ operation: e.target.value });
    };

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
        try {
            const parsed = JSON.parse(e.target.value);
            updateData({ query: parsed });
        } catch (err) {
            // If invalid JSON, save as string - runner will handle it
            updateData({ query: e.target.value });
        }
    };

    const handleDocumentChange = (e) => {
        setDocument(e.target.value);
        try {
            const parsed = JSON.parse(e.target.value);
            updateData({ document: parsed });
        } catch (err) {
            updateData({ document: e.target.value });
        }
    };

    return (
        <div className="mongodb-node">
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                style={{ background: '#47A248', width: '12px', height: '12px', left: '-6px', border: '2px solid white' }}
            />

            <div className="mongodb-node-header">
                <div className="mongodb-node-icon">🍃</div>
                <div className="mongodb-node-title">MongoDB Data</div>
                <div className="mongodb-node-tag">RAG & WRITE</div>
            </div>

            <div className="mongodb-node-body">
                <div className="input-group">
                    <label>Operation</label>
                    <select value={operation} onChange={handleOperationChange} className="nodrag">
                        <option value="FIND">🔍 FIND (Read)</option>
                        <option value="INSERT">📥 INSERT (Write)</option>
                        <option value="UPDATE">🔄 UPDATE (Soon)</option>
                    </select>
                </div>

                <div className="input-row">
                    <div className="input-group">
                        <label>Database</label>
                        <input
                            type="text"
                            value={database}
                            onChange={handleDbChange}
                            placeholder="SK_sports_Wear"
                            className="nodrag"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Collection</label>
                    <input
                        type="text"
                        value={collection}
                        onChange={handleCollChange}
                        placeholder="customers_records"
                        className="nodrag"
                    />
                </div>

                {operation === 'FIND' ? (
                    <div className="input-group">
                        <label>Search Query (JSON)</label>
                        <textarea
                            value={query}
                            onChange={handleQueryChange}
                            className="nodrag json-area"
                            placeholder='{"phone_number": "{phone_number}"}'
                        />
                    </div>
                ) : (
                    <div className="input-group">
                        <label>Document to Save (JSON)</label>
                        <textarea
                            value={document}
                            onChange={handleDocumentChange}
                            className="nodrag json-area"
                            placeholder='{"phone_number": "{phone_number}"}'
                        />
                    </div>
                )}

                <div className="input-group">
                    <label>Limit: {limit} documents</label>
                    <input
                        type="range"
                        min="1"
                        max="200"
                        value={limit}
                        onChange={handleLimitChange}
                        className="nodrag limit-slider"
                    />
                </div>

                <div className="info-text">
                    {operation === 'FIND' ? 'Contextual Search 🚀' : 'Data Persistence 💾'}
                    <br />
                    <small>Supports {'{variables}'} from flow</small>
                </div>
            </div>

            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />

            <style jsx>{`
                .mongodb-node {
                    background: linear-gradient(135deg, #47A248 0%, #3F3E3E 100%);
                    border: 2px solid #47A248;
                    border-radius: 14px;
                    min-width: 260px;
                    box-shadow: 0 6px 20px rgba(71, 162, 72, 0.3);
                    transition: all 0.3s ease;
                    overflow: visible;
                    color: white;
                }
                .mongodb-node-header {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 14px;
                    border-bottom: 2px solid rgba(71, 162, 72, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                }
                .mongodb-node-icon { font-size: 1.3rem; }
                .mongodb-node-title {
                    font-weight: 700;
                    background: linear-gradient(135deg, #47A248, #3F3E3E);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 14px;
                    flex: 1;
                }
                .mongodb-node-tag {
                    font-size: 9px;
                    background: #47A248;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 12px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .mongodb-node-body {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.98);
                    color: #4a5568;
                }
                .input-group {
                    margin-bottom: 12px;
                    text-align: left;
                }
                .input-group label {
                    display: block;
                    font-size: 10px;
                    font-weight: 700;
                    margin-bottom: 4px;
                    color: #718096;
                    text-transform: uppercase;
                }
                .input-group input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 12px;
                    background: #f7fafc;
                    outline: none;
                    box-sizing: border-box;
                }
                .input-group input:focus {
                    border-color: #47A248;
                    background: white;
                }
                .limit-slider {
                    height: 6px;
                    background: #e2e8f0;
                    border-radius: 5px;
                    outline: none;
                    accent-color: #47A248;
                }
                .json-area {
                    height: 80px;
                    font-family: 'Courier New', Courier, monospace;
                    resize: vertical;
                    line-height: 1.4;
                    background: #f8f9fa !important;
                    border: 1px solid #cbd5e0 !important;
                }
                .json-area:focus {
                    background: white !important;
                    border-color: #47A248 !important;
                }
                .info-text {
                    font-size: 11px;
                    font-weight: 600;
                    text-align: center;
                    margin-top: 10px;
                }
                .info-text small { color: #a0aec0; font-size: 9px; }
            `}</style>
        </div>
    );
};

export default MongoDBNode;
