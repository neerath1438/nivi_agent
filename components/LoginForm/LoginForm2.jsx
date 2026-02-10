import React, { useState } from 'react';
import './LoginForm2.css';

const ArrowBoxIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 10L20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 4H20V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 14L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 20H4V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20.94c1.5 0 2.75-.81 3.5-2.06 1.25-1.25.75-3.44-.94-4.13-1.69-.69-2.81.5-3.56 1.31-.81.88-1.81 2.88-1.81 2.88s-1.06-2.06-2.56-2.06c-1.5 0-2.88 1.31-2.88 3.19 0 1.88 1.38 3.19 2.88 3.19.44 0 1.06-.19 1.5-.5.5.31 1.06.5 1.81.5zM12 2.5c-1.5 0-2.81.69-3.56 1.88-1.25 1.25-.75 3.44.94 4.13 1.69.69 2.81-.5 3.56-1.31.81-.88 1.81-2.88 1.81-2.88s1.06 2.06 2.56 2.06c1.5 0 2.88-1.31 2.88-3.19C20.75 4.5 19.38 3.19 17.88 3.19c-.44 0-1.06.19-1.5.5-.5-.31-1.06-.5-1.81-.5z"></path>
    </svg>
);

const LoginForm2 = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login2:', { email, password });
    };

    return (
        <div className="login2-container">
            <div className="login2-icon-wrapper">
                <div className="login2-icon-box">
                    <ArrowBoxIcon />
                </div>
            </div>

            <h1 className="login2-title">Sign in with email</h1>
            <p className="login2-subtitle">
                Make a new doc to bring your words, data, and teams together. For free
            </p>

            <form className="login2-form" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="login2-input-wrapper">
                    <span className="login2-input-icon">
                        <EmailIcon />
                    </span>
                    <input
                        type="email"
                        placeholder="Email"
                        aria-label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login2-input"
                    />
                </div>

                {/* Password Input */}
                <div className="login2-input-wrapper">
                    <span className="login2-input-icon">
                        <LockIcon />
                    </span>
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Password"
                        aria-label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login2-input login2-password-input"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="login2-password-toggle"
                        aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    >
                        {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>

                <div className="login2-forgot-password">
                    <a href="#" className="login2-forgot-link">
                        Forgot password?
                    </a>
                </div>

                <button type="submit" className="login2-submit-btn">
                    Get Started
                </button>
            </form>

            <div className="login2-divider">
                <hr className="login2-divider-line" />
                <span className="login2-divider-text">Or sign in with</span>
                <hr className="login2-divider-line" />
            </div>

            <div className="login2-social-buttons">
                <button aria-label="Sign in with Google" className="login2-social-btn">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="login2-social-img" />
                </button>
                <button aria-label="Sign in with Facebook" className="login2-social-btn">
                    <FacebookIcon />
                </button>
                <button aria-label="Sign in with Apple" className="login2-social-btn">
                    <AppleIcon />
                </button>
            </div>
        </div>
    );
};

export default LoginForm2;
