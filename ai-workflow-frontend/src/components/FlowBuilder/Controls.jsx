import React, { useState } from 'react';
import { Play } from 'lucide-react';
import ChatInterface from '../Chat/ChatInterface';
import { saveFlow, updateFlow, listFlows } from '../../services/api';
import { useDispatch } from 'react-redux';
import {
    setNodes, setFlowId, setCurrentFlowName, setSavedFlows, resetWorkflow, setActiveAgentId
} from '../../store/workflowSlice';

const Controls = ({ nodes, edges, activeAgent, onBack, flowId, flowName, theme, isReadOnly = false, shareToken = null }) => {
    const dispatch = useDispatch();
    const [showChat, setShowChat] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Initial default name logic removed to allow manual clearing/editing
    // Default name is now handled by the parent (App.jsx) when a new flow is created.

    const handleSaveConfirm = async () => {
        if (!activeAgent || nodes.length === 0) {
            alert('Nothing to save!');
            return;
        }

        if (!flowName.trim()) {
            setSaveError('Please enter a flow name');
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        try {
            const flowData = {
                nodes,
                edges,
                agentId: activeAgent.id
            };

            const payload = {
                name: flowName,
                description: `Workflow for ${activeAgent.name}`,
                flow_data: flowData
            };

            let savedFlow;
            if (flowId) {
                savedFlow = await updateFlow(flowId, payload);
            } else {
                savedFlow = await saveFlow(payload);
                dispatch(setFlowId(savedFlow.id));
            }

            // Refresh the saved flows list in Redux
            const flows = await listFlows();
            dispatch(setSavedFlows(flows));

            setShowSaveModal(false);
            alert('Flow saved successfully!');
        } catch (error) {
            console.error('Error saving flow:', error);
            const errorMsg = error.response?.data?.detail || 'Failed to save flow.';
            setSaveError(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveClick = () => {
        if (isReadOnly) return;
        if (flowId) {
            handleSaveConfirm();
        } else {
            setShowSaveModal(true);
        }
    };

    React.useEffect(() => {
        if (isReadOnly) return;
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && (event.key === 's' || event.key === 'S')) {
                event.preventDefault();
                handleSaveClick();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeAgent, nodes, edges, flowName, flowId, isReadOnly]);

    const handleRun = () => {
        if (nodes.length === 0) {
            alert('Please add nodes to the canvas first');
            return;
        }

        // Clear previous error styles before running
        if (!isReadOnly) {
            const cleanedNodes = nodes.map(node => ({
                ...node,
                className: (node.className || '').replace('node-error', '').trim(),
                style: { ...node.style, border: 'none', boxShadow: 'none' }
            }));
            dispatch(setNodes(cleanedNodes));
        }

        setShowChat(true);
    };

    const handleClear = () => {
        if (isReadOnly) return;
        if (window.confirm('Clear current workflow?')) {
            if (activeAgent) {
                localStorage.removeItem(`workflow-nodes-${activeAgent.id}`);
                localStorage.removeItem(`workflow-edges-${activeAgent.id}`);
            }
            localStorage.removeItem('workflow-nodes-default-flow');
            localStorage.removeItem('workflow-edges-default-flow');

            dispatch(resetWorkflow());
            dispatch(setActiveAgentId('default-flow'));
        }
    };

    return (
        <>
            <div className="controls-panel">
                <div className="controls-left">
                    <div className="breadcrumb">
                        {!isReadOnly && (
                            <>
                                <span className="breadcrumb-item" onClick={onBack} style={{ cursor: 'pointer', opacity: activeAgent ? 0.6 : 1 }}>
                                    🤖 Project
                                </span>
                                {activeAgent && (
                                    <>
                                        <span className="breadcrumb-separator">/</span>
                                        <span className="breadcrumb-item active">
                                            {activeAgent.icon} {activeAgent.name}
                                        </span>
                                    </>
                                )}
                            </>
                        )}
                        {isReadOnly && (
                            <span className="breadcrumb-item active">
                                🔗 Shared View: {flowName}
                            </span>
                        )}
                    </div>
                    <p className="controls-subtitle">
                        {activeAgent
                            ? `Configuring ${activeAgent.name} workflow`
                            : 'Select an agent to start building'}
                    </p>
                </div>

                <div className="controls-right">
                    {activeAgent && !isReadOnly && (
                        <div className="flow-meta">
                            <input
                                type="text"
                                className="flow-name-input"
                                value={flowName}
                                onChange={(e) => dispatch(setCurrentFlowName(e.target.value))}
                                placeholder="Workflow Name"
                            />
                            <button className="mac-btn mac-btn-secondary" onClick={handleSaveClick} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}

                    {!isReadOnly && (
                        <button className="mac-btn mac-btn-danger" onClick={handleClear}>
                            Clear
                        </button>
                    )}

                    {activeAgent && (
                        <button
                            className="mac-btn mac-btn-primary"
                            onClick={handleRun}
                            style={{
                                padding: '8px 20px',
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Play size={18} fill="currentColor" /> Run Flow
                        </button>
                    )}
                </div>
            </div>

            {/* Save Workflow Modal */}
            {showSaveModal && (
                <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
                    <div className="save-modal-mac" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-mac">
                            <h3>Save Workflow</h3>
                        </div>
                        <div className="modal-body-mac">
                            <label>Workflow Name</label>
                            <input
                                type="text"
                                value={flowName}
                                onChange={(e) => dispatch(setCurrentFlowName(e.target.value))}
                                placeholder="Enter workflow name..."
                                autoFocus
                            />
                            {saveError && <p className="error-text">⚠️ {saveError}</p>}
                        </div>
                        <div className="modal-footer-mac">
                            <button className="mac-btn mac-btn-secondary" onClick={() => setShowSaveModal(false)}>Cancel</button>
                            <button className="mac-btn mac-btn-primary" onClick={handleSaveConfirm} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Workflow'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .controls-panel {
                    background: var(--glass-bg);
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    padding: 10px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 100;
                    height: 64px;
                    border-bottom: 1px solid var(--border-color);
                }

                .breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .breadcrumb-item {
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .breadcrumb-item:hover {
                    color: #007aff;
                }

                .breadcrumb-separator {
                    color: #86868b;
                    font-weight: 400;
                }

                .controls-subtitle {
                    font-size: 0.75rem;
                    color: #86868b;
                    margin: 0;
                    margin-top: 2px;
                }

                .controls-right {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .flow-meta {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding-right: 10px;
                }

                .flow-name-input {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 6px 10px;
                    font-size: 0.85rem;
                    color: var(--text-primary);
                    width: 180px;
                    transition: all 0.2s;
                }

                .flow-name-input:focus {
                    outline: none;
                    background: var(--bg-primary);
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
                }

                .mac-btn {
                    padding: 6px 14px;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid var(--border-color);
                    background: var(--bg-primary);
                    color: var(--text-primary);
                }

                .mac-btn:hover:not(:disabled) {
                    background: var(--bg-tertiary);
                    border-color: var(--text-secondary);
                }

                .mac-btn-primary {
                    background: #007aff;
                    color: #ffffff;
                    border: none;
                }

                .mac-btn-primary:hover:not(:disabled) {
                    background: #0071e3;
                }

                .mac-btn-danger {
                    color: #ff3b30;
                }

                .mac-btn-danger:hover:not(:disabled) {
                    background: #fff1f0;
                    border-color: #ff3b30;
                }

                .mac-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(10px);
                }

                .save-modal-mac {
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 14px;
                    width: 400px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes modalPop {
                    from { transform: scale(0.9) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }

                .modal-header-mac {
                    padding: 16px 20px;
                    text-align: center;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                }

                .modal-header-mac h3 { margin: 0; font-size: 1rem; font-weight: 700; color: #1d1d1f; }

                .modal-body-mac { padding: 20px; }
                .modal-body-mac label { display: block; font-size: 0.8rem; font-weight: 600; color: #86868b; margin-bottom: 8px; }
                .modal-body-mac input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    font-size: 0.95rem;
                    transition: border-color 0.2s;
                }

                .modal-body-mac input:focus {
                    outline: none;
                    border-color: #007aff;
                }

                .modal-footer-mac {
                    padding: 16px 20px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                }

                .error-text { color: #ff3b30; font-size: 0.75rem; margin-top: 8px; }
            `}</style>

            {showChat && (
                <ChatInterface
                    nodes={nodes}
                    edges={edges}
                    onClose={() => setShowChat(false)}
                    theme={theme}
                    shareToken={shareToken}
                    onExecutionResult={(logs) => {
                        const errorNodeIds = logs
                            .filter(log => log.status === 'error')
                            .map(log => log.node_id);

                        if (errorNodeIds.length > 0) {
                            const updatedNodes = nodes.map(node => {
                                if (errorNodeIds.includes(node.id)) {
                                    return {
                                        ...node,
                                        className: `${node.className || ''} node-error`.trim()
                                    };
                                }
                                return node;
                            });
                            dispatch(setNodes(updatedNodes));
                        }
                    }}
                />
            )}
        </>
    );
};

export default Controls;
