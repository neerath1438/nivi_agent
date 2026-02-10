import React, { useState, useEffect } from 'react';
import './PasswordInput.css';

const EyeIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const XIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const validationRules = [
    {
        id: 'length',
        text: 'At least 8 characters',
        regex: /.{8,}/
    },
    {
        id: 'number',
        text: 'At least 1 number',
        regex: /\d/
    },
    {
        id: 'lowercase',
        text: 'At least 1 lowercase letter',
        regex: /[a-z]/
    },
    {
        id: 'uppercase',
        text: 'At least 1 uppercase letter',
        regex: /[A-Z]/
    },
    {
        id: 'special',
        text: 'At least 1 special character',
        regex: /[^A-Za-z0-9]/
    }
];

const ValidationItem = ({ isValid, text }) => (
    <li className={`password-validation-item ${isValid ? 'valid' : 'invalid'}`}>
        {isValid ? <CheckIcon className="validation-icon" /> : <XIcon className="validation-icon" />}
        <span>{text}</span>
    </li>
);

const PasswordInput = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [validationState, setValidationState] = useState({
        length: false,
        number: false,
        lowercase: false,
        uppercase: false,
        special: false
    });
    const [isPristine, setIsPristine] = useState(true);

    useEffect(() => {
        if (password === '') {
            setIsPristine(true);
            setValidationState({
                length: false,
                number: false,
                lowercase: false,
                uppercase: false,
                special: false
            });
            return;
        }

        setIsPristine(false);
        const newValidationState = {
            length: validationRules.find(r => r.id === 'length').regex.test(password),
            number: validationRules.find(r => r.id === 'number').regex.test(password),
            lowercase: validationRules.find(r => r.id === 'lowercase').regex.test(password),
            uppercase: validationRules.find(r => r.id === 'uppercase').regex.test(password),
            special: validationRules.find(r => r.id === 'special').regex.test(password)
        };
        setValidationState(newValidationState);
    }, [password]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="password-input-wrapper">
            <div className="password-input-field">
                <label htmlFor="password" className="password-label">
                    Password
                </label>
                <div className="password-input-container">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="password-input"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="password-toggle-btn"
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? <EyeOffIcon className="toggle-icon" /> : <EyeIcon className="toggle-icon" />}
                    </button>
                </div>
            </div>

            <div className="password-requirements">
                <div className="requirements-header">
                    <h3 className="requirements-title">Password requirements:</h3>
                    {isPristine && <p className="requirements-hint">Enter a password to check</p>}
                </div>
                <ul className="requirements-list">
                    {validationRules.map(rule => (
                        <ValidationItem
                            key={rule.id}
                            isValid={validationState[rule.id]}
                            text={rule.text}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PasswordInput;
