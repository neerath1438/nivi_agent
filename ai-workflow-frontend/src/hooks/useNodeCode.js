import { useState } from 'react';

/**
 * Custom hook for fetching and displaying node code
 * @param {string} nodeType - Type of node (chatInput, llm, elasticsearch, etc.)
 * @returns {object} - { code, showCode, loading, handleViewCode, setShowCode }
 */
export const useNodeCode = (nodeType) => {
    const [showCode, setShowCode] = useState(false);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleViewCode = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/code/${nodeType}`);
            if (!response.ok) {
                throw new Error('Failed to fetch code');
            }
            const data = await response.json();
            setCode(data.code);
            setShowCode(true);
        } catch (error) {
            console.error('Failed to fetch code:', error);
            alert('Failed to load code. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return {
        code,
        showCode,
        loading,
        handleViewCode,
        setShowCode
    };
};
