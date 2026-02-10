import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const TShirtCatalogNode = ({ data, isConnectable }) => {
    const [companyName, setCompanyName] = useState(data.company_name || 'Your T-Shirt Brand');
    const [catalogLink, setCatalogLink] = useState(data.catalog_link || 'https://yourtshirtcompany.com/catalog');

    const handleCompanyNameChange = (e) => {
        const newName = e.target.value;
        setCompanyName(newName);
        if (data.onChange) {
            data.onChange(data.id, { company_name: newName });
        }
    };

    const handleCatalogLinkChange = (e) => {
        const newLink = e.target.value;
        setCatalogLink(newLink);
        if (data.onChange) {
            data.onChange(data.id, { catalog_link: newLink });
        }
    };

    return (
        <div className="custom-node tshirt-catalog-node">
            {/* Input Handle - Left side */}
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                style={{ background: '#667eea' }}
            />

            <div className="node-header">
                <span className="node-icon">👕</span>
                <span className="node-title">T-Shirt Catalog</span>
            </div>
            <div className="node-body">
                <div className="node-field">
                    <label>Company Name:</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={handleCompanyNameChange}
                        placeholder="Your T-Shirt Brand"
                        className="nodrag"
                    />
                </div>
                <div className="node-field">
                    <label>Catalog Link:</label>
                    <input
                        type="url"
                        value={catalogLink}
                        onChange={handleCatalogLinkChange}
                        placeholder="https://..."
                        className="nodrag"
                    />
                </div>
                <div className="node-info">
                    ℹ️ One-time link delivery per customer
                </div>
            </div>

            {/* Output Handle - Right side */}
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                style={{ background: '#667eea' }}
            />

            <style jsx>{`
                .tshirt-catalog-node {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: 2px solid #5a67d8;
                    border-radius: 12px;
                    padding: 12px;
                    min-width: 280px;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .node-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                    color: white;
                }

                .node-icon {
                    font-size: 20px;
                }

                .node-title {
                    font-weight: 700;
                    font-size: 14px;
                }

                .node-body {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 8px;
                    padding: 12px;
                }

                .node-field {
                    margin-bottom: 10px;
                }

                .node-field label {
                    display: block;
                    font-size: 11px;
                    font-weight: 600;
                    color: #4a5568;
                    margin-bottom: 4px;
                }

                .node-field input {
                    width: 100%;
                    padding: 6px 10px;
                    border: 1px solid #cbd5e0;
                    border-radius: 6px;
                    font-size: 12px;
                    outline: none;
                    transition: all 0.2s;
                }

                .node-field input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .node-info {
                    margin-top: 8px;
                    padding: 6px;
                    background: #edf2f7;
                    border-radius: 4px;
                    font-size: 10px;
                    color: #4a5568;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default TShirtCatalogNode;
