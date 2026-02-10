import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import ChatInputNode from '../Nodes/ChatInputNode';
import PromptNode from '../Nodes/PromptNode';
import OpenAINode from '../Nodes/OpenAINode';
import GeminiNode from '../Nodes/GeminiNode';
import ClaudeNode from '../Nodes/ClaudeNode';
import LLMNode from '../Nodes/LLMNode';
import ElasticsearchNode from '../Nodes/ElasticsearchNode';
import OutputNode from '../Nodes/OutputNode';
import EmailNode from '../Nodes/EmailNode';
import SearchNode from '../Nodes/SearchNode';
import HttpNode from '../Nodes/HttpNode';
import ConditionNode from '../Nodes/ConditionNode';
import PdfNode from '../Nodes/PdfNode';
import WhatsAppInputNode from '../Nodes/WhatsAppInputNode';
import WhatsAppOutputNode from '../Nodes/WhatsAppOutputNode';
import KnowledgeNode from '../Nodes/KnowledgeNode';
import SummarizationNode from '../Nodes/SummarizationNode';
import DocumentGeneratorNode from '../Nodes/DocumentGeneratorNode';
import MongoDBNode from '../Nodes/MongoDBNode';
import TShirtCatalogNode from '../Nodes/TShirtCatalogNode';
import SKSportsWearNode from '../Nodes/SKSportsWearNode';
import CodeRunnerNode from '../Nodes/CodeRunnerNode';
import UIComponentsNode from '../Nodes/UIComponentsNode';
import PromptGeneratorNode from '../Nodes/PromptGeneratorNode';
import MasterPromptNode from '../Nodes/MasterPromptNode';
import CodeLanguageNode from '../Nodes/CodeLanguageNode';
import FrontendLanguageNode from '../Nodes/FrontendLanguageNode';
import BackendLanguageNode from '../Nodes/BackendLanguageNode';
import ThemeNode from '../Nodes/ThemeNode';
import ZipNode from '../Nodes/ZipNode';
import BrowserNode from '../Nodes/BrowserNode';
import LoopNode from '../Nodes/LoopNode';
import ScreenshotNode from '../Nodes/ScreenshotNode';
import IDENode from '../Nodes/IDENode';
import AIArchitect from './AIArchitect';

const nodeTypes = {
    chatInput: ChatInputNode,
    promptTemplate: PromptNode,
    openai: OpenAINode,
    gemini: GeminiNode,
    claude: ClaudeNode,
    llm: LLMNode,
    elasticsearch: ElasticsearchNode,
    chatOutput: OutputNode,
    email: EmailNode,
    search: SearchNode,
    http: HttpNode,
    condition: ConditionNode,
    pdf: PdfNode,
    whatsAppInput: WhatsAppInputNode,
    whatsAppOutput: WhatsAppOutputNode,
    knowledge: KnowledgeNode,
    summarization: SummarizationNode,
    documentGenerator: DocumentGeneratorNode,
    mongoDB: MongoDBNode,
    tshirtCatalog: TShirtCatalogNode,
    greeting: SKSportsWearNode,
    pythonRunner: CodeRunnerNode, // The instruction implies this should be an object for sidebar, but nodeTypes expects a component. Keeping it as component for React Flow functionality.
    reactRunner: CodeRunnerNode,
    uiComponents: UIComponentsNode,
    promptGenerator: PromptGeneratorNode,
    masterPrompt: MasterPromptNode,
    language: CodeLanguageNode,
    frontendLanguage: FrontendLanguageNode,
    backendLanguage: BackendLanguageNode,
    theme: ThemeNode,
    zip: ZipNode,
    browser: BrowserNode,
    loop: LoopNode,
    screenshot: ScreenshotNode,
    ide: IDENode,
};

const FlowCanvas = ({ activeAgentId, onNodesChange: externalOnNodesChange, onEdgesChange: externalOnEdgesChange, theme }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // History for undo/redo
    const [history, setHistory] = useState([{ nodes: [], edges: [] }]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const handleNodeDataChange = useCallback((nodeId, newData) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...newData,
                        },
                    };
                }
                return node;
            })
        );
    }, [setNodes]);

    const addToHistory = useCallback((newNodes, newEdges) => {
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push({ nodes: newNodes, edges: newEdges });
            return newHistory;
        });
        setHistoryIndex(prev => prev + 1);
    }, [historyIndex]);

    const handleFlowGenerated = useCallback((flowData) => {
        console.log("🌊 [FlowCanvas] Flow data received:", flowData);
        if (!flowData || !flowData.nodes) {
            console.error("❌ [FlowCanvas] Invalid flow data received:", flowData);
            return;
        }

        try {
            // Deduplicate nodes based on ID to prevent React Flow crashes
            const seenIds = new Set();
            const uniqueNodes = [];

            (flowData.nodes || []).forEach(node => {
                if (!node.id) return;
                const finalId = node.id.toString();
                if (!seenIds.has(finalId)) {
                    seenIds.add(finalId);
                    uniqueNodes.push({
                        ...node,
                        id: finalId, // Ensure ID is string
                        data: {
                            ...node.data,
                            id: finalId,
                            onChange: handleNodeDataChange
                        }
                    });
                }
            });

            // Basic validation for edges
            const validEdges = (flowData.edges || []).filter(edge =>
                edge.source && edge.target && seenIds.has(edge.source.toString()) && seenIds.has(edge.target.toString())
            ).map(edge => ({
                ...edge,
                id: edge.id || `e-${edge.source}-${edge.target}-${Math.random().toString(36).substr(2, 5)}`
            }));

            console.log(`✅ [FlowCanvas] Applying ${uniqueNodes.length} nodes and ${validEdges.length} edges`);

            // Clear and set
            setNodes([]);
            setEdges([]);

            setTimeout(() => {
                setNodes(uniqueNodes);
                setEdges(validEdges);
                addToHistory(uniqueNodes, validEdges);
            }, 50);

        } catch (err) {
            console.error("❌ [FlowCanvas] Crash while applying flow:", err);
            alert("Failed to render generated flow. See console for details.");
        }
    }, [handleNodeDataChange, setNodes, setEdges, addToHistory]);

    // Load state whenever activeAgentId changes
    React.useEffect(() => {
        if (!activeAgentId) {
            setNodes([]);
            setEdges([]);
            setIsLoaded(false);
            return;
        }

        setIsLoaded(false);
        const savedNodes = localStorage.getItem(`workflow-nodes-${activeAgentId}`);
        const savedEdges = localStorage.getItem(`workflow-edges-${activeAgentId}`);

        if (savedNodes) {
            try {
                const parsedNodes = JSON.parse(savedNodes);
                const restoredNodes = parsedNodes.map(node => ({
                    ...node,
                    data: {
                        ...node.data,
                        id: node.id,
                        onChange: handleNodeDataChange
                    }
                }));
                setNodes(restoredNodes);
            } catch (e) {
                console.error('Failed to parse saved nodes', e);
                setNodes([]);
            }
        } else {
            setNodes([]);
        }

        if (savedEdges) {
            try {
                setEdges(JSON.parse(savedEdges));
            } catch (e) {
                console.error('Failed to parse saved edges', e);
                setEdges([]);
            }
        } else {
            setEdges([]);
        }

        setIsLoaded(true);
    }, [activeAgentId, setNodes, setEdges, handleNodeDataChange]);

    // Save to localStorage
    React.useEffect(() => {
        if (isLoaded && activeAgentId) {
            localStorage.setItem(`workflow-nodes-${activeAgentId}`, JSON.stringify(nodes));
        }
    }, [nodes, isLoaded, activeAgentId]);

    React.useEffect(() => {
        if (isLoaded && activeAgentId) {
            localStorage.setItem(`workflow-edges-${activeAgentId}`, JSON.stringify(edges));
        }
    }, [edges, isLoaded, activeAgentId]);

    const onConnect = useCallback(
        (params) => {
            setEdges((eds) => {
                const newEdges = addEdge(params, eds);
                addToHistory(nodes, newEdges);
                return newEdges;
            });
        },
        [setEdges, nodes, addToHistory]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            if (!type || !activeAgentId || !reactFlowInstance) return;

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNodeId = `${type}_${Date.now()}`;
            const newNode = {
                id: newNodeId,
                type,
                position,
                data: {
                    id: newNodeId,
                    label: `${type} node`,
                    onChange: handleNodeDataChange,
                },
            };

            setNodes((nds) => {
                const newNodes = nds.concat(newNode);
                addToHistory(newNodes, edges);
                return newNodes;
            });
        },
        [reactFlowInstance, setNodes, edges, activeAgentId, handleNodeDataChange, addToHistory]
    );

    const onNodesDelete = useCallback(
        (deleted) => {
            const newNodes = nodes.filter((node) => !deleted.find((d) => d.id === node.id));
            setNodes(newNodes);
            addToHistory(newNodes, edges);
        },
        [nodes, edges, setNodes, addToHistory]
    );

    const onEdgesDelete = useCallback(
        (deleted) => {
            const newEdges = edges.filter((edge) => !deleted.find((d) => d.id === edge.id));
            setEdges(newEdges);
            addToHistory(nodes, newEdges);
        },
        [nodes, edges, setEdges, addToHistory]
    );

    React.useEffect(() => {
        const handleKeyDown = (event) => {
            const isInputField = event.target.tagName === 'INPUT' ||
                event.target.tagName === 'TEXTAREA' ||
                event.target.tagName === 'SELECT' ||
                event.target.isContentEditable;

            if ((event.key === 'Delete' || event.key === 'Backspace') && !isInputField) {
                const selectedNodes = nodes.filter((node) => node.selected);
                const selectedEdges = edges.filter((edge) => edge.selected);

                if (selectedNodes.length > 0 || selectedEdges.length > 0) {
                    event.preventDefault();
                    const newNodes = nodes.filter((node) => !node.selected);
                    const newEdges = edges.filter((edge) => !edge.selected);
                    setNodes(newNodes);
                    setEdges(newEdges);
                    addToHistory(newNodes, newEdges);
                }
            }

            if (event.ctrlKey && event.key === 'z' && historyIndex > 0 && !isInputField) {
                event.preventDefault();
                const previousState = history[historyIndex - 1];
                setNodes(previousState.nodes);
                setEdges(previousState.edges);
                setHistoryIndex(historyIndex - 1);
            }

            if (((event.ctrlKey && event.key === 'y') ||
                (event.ctrlKey && event.shiftKey && event.key === 'z')) && !isInputField) {
                if (historyIndex < history.length - 1) {
                    event.preventDefault();
                    const nextState = history[historyIndex + 1];
                    setNodes(nextState.nodes);
                    setEdges(nextState.edges);
                    setHistoryIndex(historyIndex + 1);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [nodes, edges, history, historyIndex, setNodes, setEdges, addToHistory]);

    // Propagate changes up
    React.useEffect(() => { if (externalOnNodesChange) externalOnNodesChange(nodes); }, [nodes, externalOnNodesChange]);
    React.useEffect(() => { if (externalOnEdgesChange) externalOnEdgesChange(edges); }, [edges, externalOnEdgesChange]);

    if (!activeAgentId) {
        return (
            <div className="flow-canvas placeholder-view">
                <div className="placeholder-content">
                    <div className="placeholder-icon">🤖</div>
                    <h2>Welcome to AI Workflow Builder</h2>
                    <p>Select an agent from the sidebar to start building its workflow.</p>
                </div>
                <style jsx>{`
                    .flow-canvas.placeholder-view {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #1a1b1e 0%, #111214 100%);
                        height: calc(100vh - 80px);
                        width: 100%;
                    }
                    .placeholder-content { text-align: center; color: #fff; }
                    .placeholder-icon { font-size: 64px; margin-bottom: 20px; }
                    h2 { margin-bottom: 10px; font-weight: 600; }
                    p { color: #909296; font-size: 1.1rem; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="flow-canvas-container">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodesDelete={onNodesDelete}
                onEdgesDelete={onEdgesDelete}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                fitView
                deleteKeyCode={['Backspace', 'Delete']}
                multiSelectionKeyCode="Shift"
            >
                {/* Premium Backgrounds */}
                {theme === 'theme-light' ? (
                    <Background
                        variant="dots"
                        gap={25}
                        size={2.5}
                        color="rgba(0, 0, 0, 0.4)"
                    />
                ) : null}
                <Controls />
                <MiniMap />
            </ReactFlow>
            <AIArchitect onFlowGenerated={handleFlowGenerated} />

            <style jsx>{`
                .flow-canvas-container {
                    width: 100%;
                    height: calc(100vh - 80px);
                    background: ${theme === 'theme-dark' ? '#0f172a' : 'var(--bg-primary)'};
                    ${theme === 'theme-dark' ? `
                    background-image: 
                        radial-gradient(circle, rgba(139,92,246,0.6) 1px, transparent 1px),
                        radial-gradient(circle, rgba(59,130,246,0.4) 1px, transparent 1px),
                        radial-gradient(circle, rgba(236,72,153,0.5) 1px, transparent 1px);
                    background-size: 20px 20px, 40px 40px, 60px 60px;
                    background-position: 0 0, 10px 10px, 30px 30px;
                    ` : ''}
                    position: relative;
                }

                .react-flow {
                    background: transparent !important;
                }
            `}</style>
        </div>
    );
};

export default FlowCanvas;
