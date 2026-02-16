import React from 'react';
import { Share2, Trash2, Play, Edit3 } from 'lucide-react';

const FlowTable = ({ flows, onEdit, onRun, onShare, onDelete, theme }) => {
    return (
        <div className={`flow-table-container ${theme}`} style={{
            background: 'var(--bg-tertiary)',
            borderRadius: '1rem',
            padding: '1rem',
            border: '1px solid var(--border-color)',
            overflowX: 'auto',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow)'
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Name</th>
                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Description</th>
                        <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {flows.map((flow) => (
                        <tr key={flow.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '1rem', fontWeight: 600 }}>{flow.name}</td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{flow.description}</td>
                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <button className="action-btn edit-btn" onClick={() => onEdit(flow)}>
                                        <Edit3 size={14} /> Edit
                                    </button>
                                    <button className="action-btn run-btn" onClick={() => onRun(flow)}>
                                        <Play size={14} fill="currentColor" /> Run
                                    </button>
                                    <button className="action-btn icon-btn" onClick={() => onShare(flow)} title="Share">
                                        <Share2 size={16} />
                                    </button>
                                    <button className="action-btn icon-btn delete-btn" onClick={() => onDelete(flow.id)} title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
                .table-row:hover {
                    background: rgba(255, 255, 255, 0.03);
                }

                .action-btn {
                    padding: 0.4rem 0.8rem;
                    border-radius: 0.4rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 1px solid var(--border-color);
                    font-size: 0.85rem;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                }

                .action-btn:hover {
                    background: var(--bg-tertiary);
                    border-color: var(--accent-primary);
                }

                .edit-btn { background: #3b82f6; color: white; border: none; }
                .edit-btn:hover { background: #2563eb; }

                .run-btn { background: #10b981; color: white; border: none; }
                .run-btn:hover { background: #059669; }

                .delete-btn:hover { background: #ef4444; color: white; border: none; }
            `}</style>
        </div>
    );
};

export default FlowTable;
