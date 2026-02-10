import React, { useState, useRef } from 'react';
import Notification from './Toast';
import { AnimatePresence } from 'framer-motion';
import './ToastView.css';

const ToastView = () => {
    const [notifications, setNotifications] = useState([]);
    const [position, setPosition] = useState('bottom-right');
    const nextIdRef = useRef(1);

    const addNotification = (type, title, message, showIcon = true, duration) => {
        const newNotification = {
            id: nextIdRef.current++,
            type,
            title,
            message,
            showIcon,
            duration
        };
        setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    };

    const addLoadingWithSuccess = (loadingTitle, loadingMessage, successTitle, successMessage, loadingDuration = 3000) => {
        const loadingId = nextIdRef.current++;
        const loadingNotification = {
            id: loadingId,
            type: 'loading',
            title: loadingTitle,
            message: loadingMessage,
            showIcon: true
        };
        setNotifications(prevNotifications => [...prevNotifications, loadingNotification]);

        setTimeout(() => {
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === loadingId
                        ? {
                            ...notification,
                            type: 'success',
                            title: successTitle,
                            message: successMessage,
                            duration: 4000
                        }
                        : notification
                )
            );
        }, loadingDuration);
    };

    const handleClose = (id) => {
        setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
    };

    const getPositionClasses = (currentPosition) => {
        switch (currentPosition) {
            case 'top-left':
                return 'toast-position-top-left';
            case 'top-right':
                return 'toast-position-top-right';
            case 'bottom-left':
                return 'toast-position-bottom-left';
            case 'bottom-right':
                return 'toast-position-bottom-right';
            case 'top-center':
                return 'toast-position-top-center';
            case 'bottom-center':
                return 'toast-position-bottom-center';
            default:
                return 'toast-position-top-right';
        }
    };

    return (
        <div className="toast-view-container">
            {/* Toast Container */}
            <div className={`toast-container ${getPositionClasses(position)}`}>
                <AnimatePresence>
                    {notifications.map(notification => (
                        <Notification
                            key={notification.id}
                            type={notification.type}
                            title={notification.title}
                            message={notification.message}
                            showIcon={notification.showIcon}
                            duration={notification.duration}
                            onClose={() => handleClose(notification.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Test Buttons */}
            <div className="toast-test-panel">
                <h3 className="toast-test-title">Test Notifications</h3>
                <div className="toast-test-grid">
                    <button onClick={() => addNotification('success', 'Success!', 'Operation completed successfully.', true, 3000)} className="toast-btn toast-btn-success">
                        Success (3s)
                    </button>
                    <button onClick={() => addNotification('info', 'Info Message', 'Here is some general information.', true, 4000)} className="toast-btn toast-btn-info">
                        Info (4s)
                    </button>
                    <button onClick={() => addNotification('warning', 'Warning!', 'This is a warning without an icon.', false, 5000)} className="toast-btn toast-btn-warning">
                        Warning (5s)
                    </button>
                    <button onClick={() => addNotification('error', 'Error!', 'An error occurred.', true, 6000)} className="toast-btn toast-btn-error">
                        Error (6s)
                    </button>
                    <button onClick={() => addNotification('loading', 'Loading...', 'Please wait a moment.', true)} className="toast-btn toast-btn-loading">
                        Loading
                    </button>
                    <button onClick={() => addLoadingWithSuccess('Processing Payment', 'Please wait...', 'Payment Successful', 'Your payment has been processed!')} className="toast-btn toast-btn-gradient-blue">
                        Payment Processing
                    </button>
                </div>
            </div>

            {/* Position Controls */}
            <div className="toast-position-controls">
                <button onClick={() => setPosition('top-left')} className={`toast-pos-btn ${position === 'top-left' ? 'active' : ''}`}>
                    Top Left
                </button>
                <button onClick={() => setPosition('top-center')} className={`toast-pos-btn ${position === 'top-center' ? 'active' : ''}`}>
                    Top Center
                </button>
                <button onClick={() => setPosition('top-right')} className={`toast-pos-btn ${position === 'top-right' ? 'active' : ''}`}>
                    Top Right
                </button>
                <button onClick={() => setPosition('bottom-left')} className={`toast-pos-btn ${position === 'bottom-left' ? 'active' : ''}`}>
                    Bottom Left
                </button>
                <button onClick={() => setPosition('bottom-center')} className={`toast-pos-btn ${position === 'bottom-center' ? 'active' : ''}`}>
                    Bottom Center
                </button>
                <button onClick={() => setPosition('bottom-right')} className={`toast-pos-btn ${position === 'bottom-right' ? 'active' : ''}`}>
                    Bottom Right
                </button>
            </div>
        </div>
    );
};

export default ToastView;
