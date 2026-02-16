import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    nodes: [],
    edges: [],
    flowId: null,
    currentFlowName: 'Main Canvas Workflow',
    savedFlows: [],
    files: [],
    isLoadingFlows: false,
    activeAgentId: localStorage.getItem('active-agent-id') || 'default-flow',
};

const workflowSlice = createSlice({
    name: 'workflow',
    initialState,
    reducers: {
        setNodes: (state, action) => {
            state.nodes = action.payload;
        },
        setEdges: (state, action) => {
            state.edges = action.payload;
        },
        setFlowId: (state, action) => {
            state.flowId = action.payload;
        },
        setCurrentFlowName: (state, action) => {
            state.currentFlowName = action.payload;
        },
        setSavedFlows: (state, action) => {
            state.savedFlows = action.payload;
        },
        setFiles: (state, action) => {
            state.files = action.payload;
        },
        setIsLoadingFlows: (state, action) => {
            state.isLoadingFlows = action.payload;
        },
        setActiveAgentId: (state, action) => {
            state.activeAgentId = action.payload;
            if (action.payload) {
                localStorage.setItem('active-agent-id', action.payload);
            } else {
                localStorage.removeItem('active-agent-id');
            }
        },
        resetWorkflow: (state) => {
            state.nodes = [];
            state.edges = [];
            state.flowId = null;
            state.currentFlowName = 'Main Canvas Workflow';
        }
    },
});

export const {
    setNodes,
    setEdges,
    setFlowId,
    setCurrentFlowName,
    setSavedFlows,
    setFiles,
    setIsLoadingFlows,
    setActiveAgentId,
    resetWorkflow
} = workflowSlice.actions;

export default workflowSlice.reducer;
