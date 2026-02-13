import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flow API
export const saveFlow = async (flowData) => {
    const response = await api.post('/flow/save', flowData);
    return response.data;
};

export const updateFlow = async (flowId, flowData) => {
    const response = await api.put(`/flow/${flowId}`, flowData);
    return response.data;
};

export const deleteFlow = async (flowId) => {
    const response = await api.delete(`/flow/${flowId}`);
    return response.data;
};

export const runFlow = async (flowData, input) => {
    // We use fetch for streaming instead of axios
    const response = await fetch(`${API_BASE_URL}/flow/run`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            flow_data: flowData,
            input: input,
        }),
    });
    return response; // Return the raw response for stream reading
};

// WhatsApp API
export const getWhatsAppStatus = async () => {
    try {
        const response = await api.get('/whatsapp/status');
        return response.data;
    } catch (error) {
        console.error('Error fetching WhatsApp status:', error);
        throw error;
    }
};

export const listFlows = async () => {
    const response = await api.get('/flows');
    return response.data;
};

export const getFlow = async (flowId) => {
    const response = await api.get(`/flow/${flowId}`);
    return response.data;
};

export const getFlowRuns = async (flowId) => {
    const response = await api.get(`/flow/${flowId}/runs`);
    return response.data;
};

export const healthCheck = async () => {
    const response = await api.get('/health');
    return response.data;
};

export const sendEmail = async (emailData) => {
    const response = await api.post('/email/send', emailData);
    return response.data;
};

// Sharing API
export const shareFlow = async (flowId) => {
    const response = await api.post(`/flow/${flowId}/share`);
    return response.data;
};

export const getPublicFlow = async (shareToken) => {
    const response = await api.get(`/public/flow/${shareToken}`);
    return response.data;
};

export const executePublicFlow = async (shareToken, input) => {
    const response = await api.post(`/public/execute/${shareToken}`, { input });
    return response.data;
};

export const runPublicFlow = async (shareToken, input) => {
    const response = await fetch(`${API_BASE_URL}/public/execute/${shareToken}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            input: input,
        }),
    });
    return response;
};

export const exportPythonFlow = async (flowData) => {
    const response = await api.post('/flow/export-python', flowData);
    return response.data;
};

export const startGhostRecord = async () => {
    const response = await api.post('/flow/ghost-record/start');
    return response.data;
};

export const stopGhostRecord = async () => {
    const response = await api.post('/flow/ghost-record/stop');
    return response.data;
};

export default api;
