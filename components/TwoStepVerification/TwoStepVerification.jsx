import React, { useState, useRef, useEffect } from 'react';
import './TwoStepVerification.css';

const TwoStepVerification = () => {
    const [code, setCode] = useState(new Array(5).fill(''));
    const [focusedIndex, setFocusedIndex] = useState(0);
    const inputRefs = useRef([]);

    const handleChange = (element, index) => {
        if (isNaN(Number(element.value)) || element.value === ' ') {
            element.value = '';
            return;
        }

        const newCode = [...code];
        newCode[index] = element.value;
        setCode(newCode);

        if (element.value && index < 4) {
            const nextInput = inputRefs.current[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = inputRefs.current[index - 1];
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 5);
        if (!/^\d+$/.test(pasteData)) return;

        const newCode = new Array(5).fill('');
        for (let i = 0; i < pasteData.length; i++) {
            newCode[i] = pasteData[i];
        }
        setCode(newCode);

        const lastFullInput = Math.min(pasteData.length - 1, 4);
        if (lastFullInput >= 0) {
            const targetInput = inputRefs.current[lastFullInput];
            if (targetInput) {
                targetInput.focus();
            }
        }
    };

    const handleResend = () => {
        console.log('Resending code...');
        setCode(new Array(5).fill(''));
        const firstInput = inputRefs.current[0];
        if (firstInput) {
            firstInput.focus();
        }
    };

    useEffect(() => {
        const firstInput = inputRefs.current[0];
        if (firstInput) {
            firstInput.focus();
        }
    }, []);

    return (
        <div className="twostep-wrapper">
            <div className="twostep-container">
                {/* macOS Window Controls */}
                <div className="twostep-window-controls">
                    <div className="twostep-control twostep-control-red"></div>
                    <div className="twostep-control twostep-control-yellow"></div>
                    <div className="twostep-control twostep-control-green"></div>
                </div>

                <div className="twostep-content">
                    {/* Logo */}
                    <div className="twostep-logo-wrapper">
                        <div className="twostep-logo">
                            <img
                                src="https://i.postimg.cc/SKSNJ5SQ/White-Letter-S-Logo-Instagram-Post.png"
                                alt="Logo"
                                className="twostep-logo-img"
                                onError={(e) => {
                                    const target = e.target;
                                    target.onerror = null;
                                    target.src = 'https://placehold.co/128x128/161B22/FFFFFF?text=S';
                                }}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="twostep-title">Sign In With Two-Step Verification</h1>
                    <p className="twostep-subtitle">
                        We've sent a 5 digit code to **********060
                    </p>

                    {/* Label */}
                    <p className="twostep-label">Enter the code you received</p>

                    {/* OTP Inputs */}
                    <div className="twostep-inputs" onPaste={handlePaste}>
                        {code.map((data, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="tel"
                                maxLength={1}
                                value={data}
                                placeholder="•"
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={(e) => {
                                    e.target.select();
                                    setFocusedIndex(index);
                                }}
                                onBlur={() => setFocusedIndex(-1)}
                                className={`twostep-input ${focusedIndex === index ? 'twostep-input-focused' : ''
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Resend */}
                    <p className="twostep-resend">
                        Didn't receive a code?{' '}
                        <button onClick={handleResend} className="twostep-resend-btn">
                            Resend code
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TwoStepVerification;
