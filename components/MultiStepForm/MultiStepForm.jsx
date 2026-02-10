import React, { useState } from 'react';
import './MultiStepForm.css';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <circle cx="12" cy="16" r="1"></circle>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20,6 9,17 4,12"></polyline>
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
    </svg>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5"></path>
        <path d="m12 19-7-7 7-7"></path>
    </svg>
);

const MultiStepForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log('Multi-Step Form:', { fullName, email, password });
        }, 2000);
    };

    const progress = (step / 3) * 100;

    return (
        <div className="multistep-wrapper">
            <div className="multistep-container">
                {/* Progress Bar */}
                <div className="multistep-progress-section">
                    <div className="multistep-progress-header">
                        <span className="multistep-progress-text">Step {step} of 3</span>
                        <span className="multistep-progress-percent">{Math.round(progress)}%</span>
                    </div>
                    <div className="multistep-progress-bar">
                        <div className="multistep-progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Card */}
                <div className="multistep-card">
                    {/* Header */}
                    <div className="multistep-header">
                        <div className="multistep-icon-wrapper">
                            <UserIcon />
                        </div>
                        <h1 className="multistep-title">Create account</h1>
                        <p className="multistep-subtitle">
                            {step === 1 && "Let's start with your basic information"}
                            {step === 2 && "Now, set up your credentials"}
                            {step === 3 && "Almost done! Review your details"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="multistep-form">
                        {/* Step 1 */}
                        {step === 1 && (
                            <div className="multistep-step">
                                <div className="multistep-field">
                                    <label htmlFor="fullName" className="multistep-label">
                                        Full Name
                                    </label>
                                    <div className="multistep-input-wrapper">
                                        <input
                                            id="fullName"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="multistep-input"
                                        />
                                        {fullName && (
                                            <div className="multistep-check-icon">
                                                <CheckIcon />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!fullName}
                                    className="multistep-button"
                                >
                                    Next Step
                                    <ArrowRightIcon />
                                </button>
                            </div>
                        )}

                        {/* Step 2 */}
                        {step === 2 && (
                            <div className="multistep-step">
                                <div className="multistep-field">
                                    <label htmlFor="email" className="multistep-label">
                                        Email
                                    </label>
                                    <div className="multistep-input-wrapper">
                                        <div className="multistep-input-icon">
                                            <MailIcon />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="multistep-input multistep-input-with-icon"
                                        />
                                    </div>
                                </div>

                                <div className="multistep-field">
                                    <label htmlFor="password" className="multistep-label">
                                        Password
                                    </label>
                                    <div className="multistep-input-wrapper">
                                        <div className="multistep-input-icon">
                                            <LockIcon />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Create a password"
                                            className="multistep-input multistep-input-with-icon multistep-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="multistep-password-toggle"
                                        >
                                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!email || !password}
                                    className="multistep-button"
                                >
                                    Next Step
                                    <ArrowRightIcon />
                                </button>
                            </div>
                        )}

                        {/* Step 3 */}
                        {step === 3 && (
                            <div className="multistep-step">
                                <div className="multistep-review">
                                    <h3 className="multistep-review-title">
                                        <CheckIcon />
                                        Review Details
                                    </h3>
                                    <div className="multistep-review-content">
                                        <div className="multistep-review-item">
                                            <span className="multistep-review-label">Name:</span>
                                            <span className="multistep-review-value">{fullName}</span>
                                        </div>
                                        <div className="multistep-review-item">
                                            <span className="multistep-review-label">Email:</span>
                                            <span className="multistep-review-value">{email}</span>
                                        </div>
                                        <div className="multistep-review-item">
                                            <span className="multistep-review-label">Password:</span>
                                            <span className="multistep-review-value">••••••••</span>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={isLoading} className="multistep-button">
                                    {isLoading ? (
                                        <div className="multistep-loading">
                                            <div className="multistep-spinner"></div>
                                            Creating account...
                                        </div>
                                    ) : (
                                        'Create account'
                                    )}
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Back Button */}
                    {step > 1 && (
                        <button onClick={handleBack} className="multistep-back-button">
                            <ArrowLeftIcon />
                            Back to previous step
                        </button>
                    )}

                    {/* Footer */}
                    <div className="multistep-footer">
                        <p className="multistep-footer-text">
                            Already have an account?{' '}
                            <a href="#" className="multistep-footer-link">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiStepForm;
