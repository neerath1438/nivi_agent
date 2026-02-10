import React from 'react';

/**
 * Code button component for nodes
 */
export const CodeButton = ({ onClick, loading }) => {
    return (
        <>
            <button
                className="code-btn"
                onClick={onClick}
                disabled={loading}
                title="View backend code"
            >
                {loading ? '⏳' : '</>'}
            </button>
            <style jsx>{`
                .code-btn {
                    background: transparent;
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    color: #6366f1;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    font-family: 'Courier New', monospace;
                    transition: all 0.2s;
                }

                .code-btn:hover:not(:disabled) {
                    background: rgba(99, 102, 241, 0.1);
                    border-color: #6366f1;
                }

                .code-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </>
    );
};
