import React from 'react';
import { Share2, Trash2, Play, Edit3 } from 'lucide-react';

const SimpleFlowCard = ({ flow, onEdit, onRun, onShare, onDelete, theme }) => {
    return (
        <div className={`simple-flow-card ${theme}`} style={{
            background: 'var(--bg-tertiary)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            height: '100%',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow)'
        }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{flow.name}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {flow.description || "No description provided"}
                </p>
            </div>

            <div className="card-actions">
                <button className="action-btn edit-btn" onClick={() => onEdit(flow)}>
                    <Edit3 size={14} /> Edit
                </button>
                <button className="action-btn run-btn" onClick={() => onRun(flow)}>
                    <Play size={14} fill="currentColor" /> Run
                </button>
                <button className="action-btn icon-btn" onClick={() => onShare(flow)} title="Share">
                    <Share2 size={18} />
                </button>
                <button className="action-btn icon-btn delete-btn" onClick={() => onDelete(flow.id)} title="Delete">
                    <Trash2 size={18} />
                </button>
            </div>

            <style jsx>{`
                .card-actions {
                    marginTop: auto;
                    display: flex;
                    gap: 0.75rem;
                    paddingTop: 1rem;
                    borderTop: 1px solid var(--border-color);
                    align-items: center;
                }

                .action-btn {
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 1px solid var(--border-color);
                    font-size: 0.85rem;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .action-btn:hover {
                    background: var(--bg-tertiary);
                    border-color: var(--accent-primary);
                    transform: translateY(-1px);
                }

                .edit-btn {
                    background: #3b82f6;
                    color: white;
                    border: none;
                }
                .edit-btn:hover {
                    background: #2563eb;
                }

                .run-btn {
                    background: #10b981;
                    color: white;
                    border: none;
                }
                .run-btn:hover {
                    background: #059669;
                }

                .icon-btn {
                    padding: 0.5rem;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .delete-btn:hover {
                    background: #ef4444;
                    color: white;
                    border-color: #ef4444;
                }
            `}</style>
        </div>
    );
};

export default SimpleFlowCard;
