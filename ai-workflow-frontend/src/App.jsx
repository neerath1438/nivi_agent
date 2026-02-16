import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setNodes, setEdges, setFlowId, setCurrentFlowName,
    setSavedFlows, setIsLoadingFlows, setActiveAgentId, resetWorkflow
} from './store/workflowSlice';
import { toggleTheme, setCustomGradient, setIsThemeAnimated } from './store/themeSlice';

import { Database, Plus, LayoutGrid, List } from 'lucide-react';

import LeftNavbar from './components/LeftNavbar';
import ThemeCustomizer from './components/ThemeCustomizer';
import Sidebar from './components/FlowBuilder/Sidebar';
import FlowCanvas from './components/FlowBuilder/FlowCanvas';
import Controls from './components/FlowBuilder/Controls';
import CredentialsModal from './components/CredentialsModal';
import ChatInterface from './components/Chat/ChatInterface';
import PublicChat from './components/Chat/PublicChat'; // Import PublicChat

import { listFlows, runFlow, deleteFlow, shareFlow, getPublicFlow } from './services/api'; // Import shareFlow
import ThreeDCard from './components/ThreeDCard'; // Import ThreeDCard
import GlowButton from './components/GlowButton'; // Import GlowButton
import SimpleFlowCard from './components/SimpleFlowCard';
import FlowTable from './components/FlowTable';
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeNode from './components/Nodes/KnowledgeNode';

function App() {
    const dispatch = useDispatch();

    // Redux workflow state
    const nodes = useSelector(state => state.workflow.nodes);
    const edges = useSelector(state => state.workflow.edges);
    const flowId = useSelector(state => state.workflow.flowId);
    const currentFlowName = useSelector(state => state.workflow.currentFlowName);
    const savedFlows = useSelector(state => state.workflow.savedFlows);
    const isLoadingFlows = useSelector(state => state.workflow.isLoadingFlows);
    const activeAgentId = useSelector(state => state.workflow.activeAgentId);

    // Redux theme state
    const theme = useSelector(state => state.theme.theme);
    const customGradient = useSelector(state => state.theme.customGradient);
    const isThemeAnimated = useSelector(state => state.theme.isThemeAnimated);

    const [activeView, setActiveView] = useState('workflows');
    const [shareToken, setShareToken] = useState(null);

    // Redux Action Wrappers
    const handleSetNodes = (newNodes) => dispatch(setNodes(newNodes));
    const handleSetEdges = (newEdges) => dispatch(setEdges(newEdges));
    const handleSetFlowId = (id) => dispatch(setFlowId(id));
    const handleSetFlowName = (name) => dispatch(setCurrentFlowName(name));

    // State for running flow via ChatInterface
    const [showRunChat, setShowRunChat] = useState(false);
    const [runNodes, setRunNodes] = useState([]);
    const [runEdges, setRunEdges] = useState([]);
    const [dashboardViewMode, setDashboardViewMode] = useState('grid'); // 'grid' or 'table'
    const [canvasResetKey, setCanvasResetKey] = useState(0);

    const [agents] = useState([
        { id: 'default-flow', name: 'Main Canvas', icon: '🎨', color: '#ff7a00' },
        { id: 'search-agent', name: 'Search-Agent', icon: '🔍', color: '#ff7a00' },
        { id: 'analytics-agent', name: 'Analytics-Agent', icon: '📊', color: '#6366f1' },
        { id: 'email-agent', name: 'Email-Agent', icon: '📧', color: '#10b981' }
    ]);

    useEffect(() => {
        if (activeView === 'saved-flows' && savedFlows.length === 0) {
            loadSavedFlows();
        }
    }, [activeView, savedFlows.length]);

    const loadSavedFlows = async (forceRefresh = false) => {
        if (!forceRefresh && savedFlows.length > 0) return;

        dispatch(setIsLoadingFlows(true));
        try {
            const flows = await listFlows();
            dispatch(setSavedFlows(flows));
        } catch (error) {
            console.error('Failed to load flows:', error);
        } finally {
            dispatch(setIsLoadingFlows(false));
        }
    };


    // Handle initial route for shared links
    useEffect(() => {
        const path = window.location.pathname;
        if (path.startsWith('/share/')) {
            const token = path.split('/share/')[1];
            if (token) {
                setShareToken(token);
                loadPublicFlow(token);
            }
        }
    }, []);

    const loadPublicFlow = async (token) => {
        dispatch(setIsLoadingFlows(true));
        try {
            const flow = await getPublicFlow(token);
            if (flow && flow.flow_data) {
                // Set these first
                dispatch(setNodes(flow.flow_data.nodes || []));
                dispatch(setEdges(flow.flow_data.edges || []));
                dispatch(setFlowId(flow.id));
                dispatch(setCurrentFlowName(flow.name));

                // Then switch view - FlowCanvas will pick up the nodes via initialNodes prop
                setActiveView('workflows');
            }
        } catch (error) {
            console.error('Failed to load shared flow:', error);
            alert("This shared flow link is invalid or expired.");
        } finally {
            dispatch(setIsLoadingFlows(false));
        }
    };

    const toggleThemeState = () => {
        dispatch(toggleTheme());
    };

    const activeAgent = agents.find(a => a.id === activeAgentId);

    const handleEditFlow = (flow) => {
        console.log("Edit clicked for flow:", flow);
        alert("Loading workflow: " + flow.name);
        try {
            const flowData = flow.flow_data;
            console.log("Flow Data:", flowData);

            if (flowData.nodes) {
                const agentId = flowData.agentId || 'search-agent';
                console.log("Switching to agent:", agentId);

                // Update localStorage so FlowCanvas picks it up
                localStorage.setItem(`workflow-nodes-${agentId}`, JSON.stringify(flowData.nodes));
                localStorage.setItem(`workflow-edges-${agentId}`, JSON.stringify(flowData.edges));

                dispatch(setFlowId(flow.id));
                dispatch(setCurrentFlowName(flow.name));
                dispatch(setActiveAgentId(agentId));
                setActiveView('workflows');
            } else {
                console.error("Flow data missing nodes", flowData);
                alert("Flow data is corrupted or missing nodes.");
            }
        } catch (e) {
            console.error("Error loading flow", e);
            alert("Failed to load flow: " + e.message);
        }
    };

    const handleRunFlow = (flow) => {
        console.log("Run clicked for flow:", flow);
        try {
            // Prepare nodes for execution - clear previous error styles
            const flowData = flow.flow_data;
            if (flowData.nodes) {
                const cleanedNodes = flowData.nodes.map(node => ({
                    ...node,
                    className: (node.className || '').replace('node-error', '').trim(),
                    style: { ...node.style, border: 'none', boxShadow: 'none' }
                }));
                setRunNodes(cleanedNodes);
                setRunEdges(flowData.edges || []);
                dispatch(setFlowId(flow.id));
                dispatch(setCurrentFlowName(flow.name));
                setShowRunChat(true); // Open Chat Interface
            } else {
                console.error("Flow data missing nodes for run");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to prepare flow for execution");
        }
    };

    const handleDeleteFlow = async (id) => {
        console.log("Delete clicked for id:", id);
        if (window.confirm("Are you sure you want to delete this flow?")) {
            try {
                await deleteFlow(id);
                loadSavedFlows(true); // Force refresh after deletion
            } catch (error) {
                console.error("Error deleting flow:", error);
                alert("Failed to delete flow");
            }
        }
    };

    const handleShareFlow = async (flow) => {
        try {
            const { share_token } = await shareFlow(flow.id);
            const shareUrl = `${window.location.origin}/share/${share_token}`;

            // For now, use a simple prompt for the link
            window.prompt("Flow Shareable Link Created! ✅\n\nCopy this link to share your chatbot:", shareUrl);
        } catch (error) {
            console.error("Error sharing flow:", error);
            alert("Failed to generate share link");
        }
    };

    const handleCreateNew = (skipConfirm = false) => {
        const isCanvasEmpty = nodes.length === 0;

        if (skipConfirm || isCanvasEmpty || window.confirm("Create a new workflow? This will clear any unsaved changes on the canvas.")) {
            // Reset state
            dispatch(resetWorkflow());

            // Also clear default flow storage
            localStorage.removeItem('workflow-nodes-default-flow');
            localStorage.removeItem('workflow-edges-default-flow');

            // Increment reset key to force FlowCanvas remount
            setCanvasResetKey(prev => prev + 1);

            // Set to default flow and switch view
            dispatch(setActiveAgentId('default-flow'));
            setActiveView('workflows');
        }
    };

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div
            className={`app ${theme}`}
            style={{
                backgroundColor: 'var(--bg-secondary)',
                background: customGradient || 'var(--bg-secondary)',
                backgroundSize: isThemeAnimated ? '400% 400%' : 'cover',
                animation: isThemeAnimated ? 'gradient-bg-animation 15s ease infinite' : 'none',
                transition: 'background 0.5s ease'
            }}
        >
            <Controls
                nodes={nodes}
                edges={edges}
                activeAgent={shareToken ? { name: currentFlowName, icon: '🔗' } : activeAgent}
                onBack={() => {
                    dispatch(setActiveAgentId(null));
                    dispatch(setFlowId(null));
                    dispatch(setCurrentFlowName(''));
                    setShareToken(null);
                    if (shareToken) window.history.pushState({}, '', '/');
                }}
                flowId={flowId}
                flowName={currentFlowName}
                theme={theme}
                isReadOnly={!!shareToken}
                shareToken={shareToken}
            />
            <div className="app-container">
                {!shareToken && (
                    <LeftNavbar
                        activeView={activeView}
                        onViewChange={setActiveView}
                        theme={theme}
                        toggleTheme={toggleThemeState}
                    />
                )}

                {/* Workflows View */}
                {activeView === 'workflows' && (
                    <>
                        {!shareToken && (
                            <Sidebar
                                isCollapsed={isSidebarCollapsed}
                                setIsCollapsed={setIsSidebarCollapsed}
                                theme={theme}
                                onCreateNew={handleCreateNew}
                            />
                        )}
                        <div className={`canvas-container ${(isSidebarCollapsed || shareToken) ? 'collapsed' : ''}`}>
                            <FlowCanvas
                                key={shareToken ? `share-${shareToken}` : `${activeAgentId || 'default-flow'}-${canvasResetKey}`}
                                activeAgentId={shareToken ? `share-${shareToken}` : (activeAgentId || 'default-flow')}
                                onNodesChange={handleSetNodes}
                                onEdgesChange={handleSetEdges}
                                theme={theme}
                                isReadOnly={!!shareToken}
                                initialNodes={shareToken ? nodes : null}
                                initialEdges={shareToken ? edges : null}
                            />
                        </div>
                    </>
                )}

                {/* Credentials View */}
                {activeView === 'credentials' && (
                    <div className="full-page-view">
                        <CredentialsModal isOpen={true} onClose={() => setActiveView('workflows')} />
                    </div>
                )}

                {/* Saved Flows View */}
                {activeView === 'saved-flows' && (
                    <div className="dashboard-view" style={{ padding: '2rem', width: '100%', overflowY: 'auto' }}>
                        <div className="saved-flows-header" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '2rem',
                            padding: '0 10px'
                        }}>
                            <h2 style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontSize: '1.8rem',
                                fontWeight: '700',
                                color: 'var(--text-primary)',
                                margin: 0
                            }}>
                                <Database size={28} color="var(--accent-primary)" /> Saved Workflows
                            </h2>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div className="view-toggle" style={{
                                    display: 'flex',
                                    background: 'var(--bg-tertiary)',
                                    padding: '4px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <button
                                        onClick={() => setDashboardViewMode('grid')}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '7px',
                                            border: 'none',
                                            background: dashboardViewMode === 'grid' ? 'var(--bg-primary)' : 'transparent',
                                            color: dashboardViewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontWeight: '600',
                                            boxShadow: dashboardViewMode === 'grid' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        <LayoutGrid size={16} /> Grid
                                    </button>
                                    <button
                                        onClick={() => setDashboardViewMode('table')}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '7px',
                                            border: 'none',
                                            background: dashboardViewMode === 'table' ? 'var(--bg-primary)' : 'transparent',
                                            color: dashboardViewMode === 'table' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontWeight: '600',
                                            boxShadow: dashboardViewMode === 'table' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        <List size={16} /> Table
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleCreateNew(true)}
                                    className="create-flow-btn"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 20px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: 'var(--accent-primary)',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
                                    }}
                                >
                                    <Plus size={20} /> Create New Flow
                                </button>
                            </div>
                        </div>

                        {isLoadingFlows ? (
                            <div style={{ color: 'var(--text-primary)', textAlign: 'center', padding: '4rem' }}>
                                <p>Loading your workflows...</p>
                            </div>
                        ) : savedFlows.length === 0 ? (
                            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '4rem', opacity: 0.6 }}>
                                <p>No saved flows yet. Create your first one!</p>
                            </div>
                        ) : dashboardViewMode === 'table' ? (
                            <FlowTable
                                flows={savedFlows}
                                onEdit={handleEditFlow}
                                onRun={handleRunFlow}
                                onShare={handleShareFlow}
                                onDelete={handleDeleteFlow}
                                theme={theme}
                            />
                        ) : (
                            <div className="flows-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {savedFlows.map(flow => (
                                    <SimpleFlowCard
                                        key={flow.id}
                                        flow={flow}
                                        onEdit={handleEditFlow}
                                        onRun={handleRunFlow}
                                        onShare={handleShareFlow}
                                        onDelete={handleDeleteFlow}
                                        theme={theme}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Analytics View */}
                {activeView === 'analytics' && (
                    <div className="full-page-view">
                        <div className="coming-soon">
                            <h2>📊 Analytics</h2>
                            <p>Feature coming soon...</p>
                        </div>
                    </div>
                )}

                {/* Settings View */}
                {activeView === 'settings' && (
                    <div className="full-page-view">
                        <div className="coming-soon">
                            <h2>⚙️ Settings</h2>
                            <p>Feature coming soon...</p>
                        </div>
                    </div>
                )}

                {/* Themes View */}
                {activeView === 'themes' && (
                    <div className="full-page-view" style={{ background: 'transparent' }}>
                        <ThemeCustomizer theme={theme} />
                    </div>
                )}

                {/* Knowledge Base View */}
                {activeView === 'knowledge' && (
                    <div className="full-page-view" style={{ overflowY: 'auto' }}>
                        <KnowledgeBase />
                    </div>
                )}

                {/* Users View */}
                {activeView === 'users' && (
                    <div className="full-page-view">
                        <div className="coming-soon">
                            <h2>👥 Users</h2>
                            <p>Feature coming soon...</p>
                        </div>
                    </div>
                )}

                {/* Shared Flow View */}
                {activeView === 'share' && shareToken && (
                    <div className="full-page-view" style={{ background: 'transparent', width: '100%' }}>
                        <PublicChat shareToken={shareToken} theme={theme} />
                    </div>
                )}

                {/* Help View */}
                {activeView === 'help' && (
                    <div className="full-page-view">
                        <div className="coming-soon">
                            <h2>❓ Help & Support</h2>
                            <p>Feature coming soon...</p>
                        </div>
                    </div>
                )}

                {/* Run Chat Modal */}
                {showRunChat && (
                    <ChatInterface
                        nodes={runNodes}
                        edges={runEdges}
                        theme={theme}
                        onClose={() => setShowRunChat(false)}
                        onExecutionResult={(logs) => {
                            const errorNodeIds = logs
                                .filter(log => log.status === 'error')
                                .map(log => log.node_id);

                            if (errorNodeIds.length > 0) {
                                // If running in workflow view, update the main nodes
                                // If running from dashboard, we might want to update runNodes
                                // For now, let's update both if they match
                                const updateNodes = (prevNodes) => prevNodes.map(node => {
                                    if (errorNodeIds.includes(node.id)) {
                                        return {
                                            ...node,
                                            className: `${node.className || ''} node-error`.trim()
                                        };
                                    }
                                    return node;
                                });

                                dispatch(setNodes(updateNodes(nodes)));
                                setRunNodes(updateNodes(runNodes));
                            } else {
                                // Reset borders on success? Maybe not immediately, but let's clear them when next run starts
                            }
                        }}
                    />
                )}
            </div>
            <style jsx global>{`
                .coming-soon p {
                    font-size: 1.1rem;
                    color: #86868b;
                }

                .canvas-container {
                    flex: 1;
                    height: 100%;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .canvas-container.collapsed {
                    margin-left: 0;
                    width: 100%;
                }
            `}</style>
        </div>
    );
}

export default App;
