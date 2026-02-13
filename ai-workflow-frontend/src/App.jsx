import React, { useState, useEffect } from 'react';
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
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeNode from './components/Nodes/KnowledgeNode';

function App() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [activeView, setActiveView] = useState('workflows');
    const [customGradient, setCustomGradient] = useState('');
    const [isThemeAnimated, setIsThemeAnimated] = useState(false);
    const [activeAgentId, setActiveAgentId] = useState(() => {
        return localStorage.getItem('active-agent-id') || null;
    });

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'theme-light';
    });

    const [savedFlows, setSavedFlows] = useState([]);
    const [isLoadingFlows, setIsLoadingFlows] = useState(false);
    const [flowId, setFlowId] = useState(null);
    const [currentFlowName, setCurrentFlowName] = useState('');
    const [shareToken, setShareToken] = useState(null); // State for shared flow

    // State for running flow via ChatInterface
    const [showRunChat, setShowRunChat] = useState(false);
    const [runNodes, setRunNodes] = useState([]);
    const [runEdges, setRunEdges] = useState([]);

    const [agents] = useState([
        { id: 'default-flow', name: 'Main Canvas', icon: '🎨', color: '#ff7a00' },
        { id: 'search-agent', name: 'Search-Agent', icon: '🔍', color: '#ff7a00' },
        { id: 'analytics-agent', name: 'Analytics-Agent', icon: '📊', color: '#6366f1' },
        { id: 'email-agent', name: 'Email-Agent', icon: '📧', color: '#10b981' }
    ]);

    useEffect(() => {
        if (activeView === 'saved-flows') {
            loadSavedFlows();
        }
    }, [activeView]);

    const loadSavedFlows = async () => {
        setIsLoadingFlows(true);
        try {
            const flows = await listFlows();
            setSavedFlows(flows);
        } catch (error) {
            console.error('Failed to load flows:', error);
        } finally {
            setIsLoadingFlows(false);
        }
    };

    useEffect(() => {
        if (activeAgentId) {
            localStorage.setItem('active-agent-id', activeAgentId);
        } else {
            localStorage.removeItem('active-agent-id');
        }
    }, [activeAgentId]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

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
        setIsLoadingFlows(true);
        try {
            const flow = await getPublicFlow(token);
            if (flow && flow.flow_data) {
                // Set these first
                setNodes(flow.flow_data.nodes || []);
                setEdges(flow.flow_data.edges || []);
                setFlowId(flow.id);
                setCurrentFlowName(flow.name);

                // Then switch view - FlowCanvas will pick up the nodes via initialNodes prop
                setActiveView('workflows');
            }
        } catch (error) {
            console.error('Failed to load shared flow:', error);
            alert("This shared flow link is invalid or expired.");
        } finally {
            setIsLoadingFlows(false);
        }
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'theme-light' ? 'theme-dark' : 'theme-light');
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

                setFlowId(flow.id);
                setCurrentFlowName(flow.name);
                setActiveAgentId(agentId);
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
                setFlowId(flow.id);
                setCurrentFlowName(flow.name);
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
                loadSavedFlows(); // Refresh list
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

    const handleCreateNew = () => {
        if (window.confirm("Create a new workflow? This will clear the current unsaved canvas.")) {
            // Reset state
            setNodes([]);
            setEdges([]);
            setFlowId(null);
            setCurrentFlowName('');

            // Default to a specific agent or null to force selection?
            // Let's set it to 'default-flow' (Main Canvas)
            setActiveAgentId('default-flow');

            // Clear localStorage for the default flow to ensure it's fresh
            localStorage.removeItem('workflow-nodes-default-flow');
            localStorage.removeItem('workflow-edges-default-flow');

            setActiveView('workflows');
        }
    };

    const handleApplyTheme = (gradient, animated) => {
        setCustomGradient(gradient);
        setIsThemeAnimated(animated);
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
                setNodes={setNodes}
                activeAgent={shareToken ? { name: currentFlowName, icon: '🔗' } : activeAgent}
                onBack={() => {
                    setActiveAgentId(null);
                    setFlowId(null);
                    setCurrentFlowName('');
                    setShareToken(null);
                    if (shareToken) window.history.pushState({}, '', '/');
                }}
                flowId={flowId}
                setFlowId={setFlowId}
                flowName={currentFlowName}
                setFlowName={setCurrentFlowName}
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
                        toggleTheme={toggleTheme}
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
                                key={shareToken ? `share-${shareToken}` : (activeAgentId || 'default-flow')}
                                activeAgentId={shareToken ? `share-${shareToken}` : (activeAgentId || 'default-flow')}
                                onNodesChange={setNodes}
                                onEdgesChange={setEdges}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ color: 'white', margin: 0 }}>💾 Saved Workflows</h2>
                            <GlowButton variant="blue" onClick={handleCreateNew}>
                                ✨ Create New Flow
                            </GlowButton>
                        </div>
                        {isLoadingFlows ? (
                            <p>Loading flows...</p>
                        ) : savedFlows.length === 0 ? (
                            <p style={{ opacity: 0.6 }}>No saved flows yet.</p>
                        ) : (
                            <div className="flows-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
                                {savedFlows.map(flow => (
                                    <ThreeDCard key={flow.id} glowOpacity={0.4} shadowBlur={20} animatedGradient={true}>
                                        <div className="flow-card-content" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', color: 'white' }}>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{flow.name}</h3>
                                                <p style={{ fontSize: '0.9rem', opacity: 0.8, color: '#e5e7eb', marginBottom: '0' }}>{flow.description || "No description"}</p>
                                            </div>

                                            <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', justifyContent: 'center' }}>
                                                <GlowButton variant="blue" onClick={() => handleEditFlow(flow)}>
                                                    ✏️ Edit
                                                </GlowButton>
                                                <GlowButton variant="green" onClick={() => handleRunFlow(flow)}>
                                                    ▶️ Run
                                                </GlowButton>
                                                <GlowButton variant="pink" onClick={() => handleShareFlow(flow)}>
                                                    🔗
                                                </GlowButton>
                                                <GlowButton variant="pink" onClick={() => handleDeleteFlow(flow.id)}>
                                                    🗑️
                                                </GlowButton>
                                            </div>
                                        </div>
                                    </ThreeDCard>
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
                        <ThemeCustomizer onApplyTheme={handleApplyTheme} theme={theme} />
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

                                setNodes(updateNodes);
                                setRunNodes(updateNodes);
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
