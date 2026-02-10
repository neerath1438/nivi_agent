/**
 * Credentials API Service
 * Handles all API calls for credentials management
 */

const API_BASE = '/api';

export const credentialsService = {
    /**
     * Get all credentials (without encrypted values)
     */
    async getCredentials() {
        const response = await fetch(`${API_BASE}/credentials`);
        if (!response.ok) {
            throw new Error('Failed to fetch credentials');
        }
        return response.json();
    },

    /**
     * Create a new credential
     * @param {Object} data - Credential data
     * @param {string} data.name - User-friendly name
     * @param {string} data.provider - Provider type (openai, gemini, claude, smtp)
     * @param {string} data.value - Plain text API key (will be encrypted)
     */
    async createCredential(data) {
        const response = await fetch(`${API_BASE}/credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create credential');
        }
        return response.json();
    },

    /**
     * Update an existing credential
     * @param {number} id - Credential ID
     * @param {Object} data - Updated data
     */
    async updateCredential(id, data) {
        const response = await fetch(`${API_BASE}/credentials/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to update credential');
        }
        return response.json();
    },

    /**
     * Delete a credential
     * @param {number} id - Credential ID
     */
    async deleteCredential(id) {
        const response = await fetch(`${API_BASE}/credentials/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to delete credential');
        }
        return response.json();
    },
};
