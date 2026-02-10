import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Toast.css';

const Notification = ({
    id,
    type,
    title,
    message,
    showIcon = true,
    duration,
    onClose
}) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                );
            case 'loading':
                return (
                    <svg className="toast-icon toast-loading" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getTypeClass = () => {
        switch (type) {
            case 'success':
                return 'toast-success';
            case 'error':
                return 'toast-error';
            case 'warning':
                return 'toast-warning';
            case 'info':
                return 'toast-info';
            case 'loading':
                return 'toast-loading-type';
            default:
                return '';
        }
    };

    return (
        <motion.div
            className={`toast ${getTypeClass()}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
            <div className="toast-content">
                {showIcon && <div className="toast-icon-wrapper">{getIcon()}</div>}
                <div className="toast-text">
                    <div className="toast-title">{title}</div>
                    {message && <div className="toast-message">{message}</div>}
                </div>
            </div>
            {onClose && (
                <button className="toast-close" onClick={onClose} aria-label="Close notification">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </motion.div>
    );
};

export default Notification;
