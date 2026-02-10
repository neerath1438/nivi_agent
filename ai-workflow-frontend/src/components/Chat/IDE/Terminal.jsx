import React, { useEffect, useRef } from 'react';
import { X, Maximize2, ChevronUp } from 'lucide-react';
import { Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const Terminal = ({ isVisible, onClose, physicalPath, autoCommand }) => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const socketRef = useRef(null);
    const fitAddonRef = useRef(new FitAddon());

    // Effect for autoCommand
    useEffect(() => {
        if (autoCommand && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(autoCommand + '\n');
        }
    }, [autoCommand]);

    useEffect(() => {
        if (isVisible && !xtermRef.current) {
            // Initialize XTerm.js
            xtermRef.current = new XTerminal({
                cursorBlink: true,
                theme: {
                    background: '#1e1e1e',
                    foreground: '#cccccc',
                    cursor: '#ffffff'
                },
                fontSize: 12,
                fontFamily: 'Consolas, Monaco, monospace',
                convertEol: true
            });

            xtermRef.current.loadAddon(fitAddonRef.current);
            xtermRef.current.open(terminalRef.current);
            fitAddonRef.current.fit();

            // Setup WebSocket with initial directory
            const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
            const queryParams = physicalPath ? `?cwd=${encodeURIComponent(physicalPath)}` : '';
            const wsUrl = `${protocol}://${window.location.hostname}:8000/ws/terminal${queryParams}`;
            socketRef.current = new WebSocket(wsUrl);

            socketRef.current.onmessage = (event) => {
                xtermRef.current.write(event.data);
            };

            xtermRef.current.onData((data) => {
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(data);
                }
            });

            // Handle window resize
            const handleResize = () => {
                fitAddonRef.current.fit();
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                if (socketRef.current) socketRef.current.close();
                if (xtermRef.current) xtermRef.current.dispose();
                xtermRef.current = null;
            };
        }
    }, [isVisible]);

    useEffect(() => {
        if (isVisible && fitAddonRef.current) {
            setTimeout(() => fitAddonRef.current.fit(), 100);
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="terminal-container">
            <div className="terminal-header">
                <div className="terminal-tabs">
                    <div className="terminal-tab active">TERMINAL</div>
                    <div className="terminal-tab">DEBUG CONSOLE</div>
                    <div className="terminal-tab">OUTPUT</div>
                    <div className="terminal-tab">PROBLEMS</div>
                </div>
                <div className="terminal-actions">
                    <div className="action-btn" title="Scroll to Top"><ChevronUp size={14} /></div>
                    <div className="action-btn" title="Maximize"><Maximize2 size={12} /></div>
                    <div className="action-btn" title="Close Terminal" onClick={onClose}><X size={14} /></div>
                </div>
            </div>
            <div className="terminal-body" ref={terminalRef}></div>

            <style jsx>{`
                .terminal-container {
                    height: 300px;
                    background: #1e1e1e;
                    border-top: 1px solid #333;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                .terminal-header {
                    height: 35px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 12px;
                    border-bottom: 1px solid #333;
                    background: #1e1e1e;
                    flex-shrink: 0;
                }
                .terminal-tabs {
                    display: flex;
                    gap: 20px;
                    height: 100%;
                }
                .terminal-tab {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    font-size: 11px;
                    font-weight: 600;
                    color: #858585;
                    cursor: pointer;
                    border-bottom: 1px solid transparent;
                }
                .terminal-tab.active {
                    color: #e1e1e1;
                    border-bottom: 1px solid #e1e1e1;
                }
                .terminal-actions {
                    display: flex;
                    gap: 10px;
                }
                .action-btn {
                    color: #858585;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                }
                .action-btn:hover {
                    color: #fff;
                    background: rgba(255, 255, 255, 0.1);
                }
                .terminal-body {
                    flex: 1;
                    padding: 0 10px 10px 10px;
                    overflow: hidden;
                    background: #1e1e1e;
                }
                /* XTerm container styles */
                :global(.xterm) {
                    padding: 0;
                    height: 100%;
                }
                :global(.xterm-viewport) {
                    background-color: #1e1e1e !important;
                }
            `}</style>
        </div>
    );
};

export default Terminal;
