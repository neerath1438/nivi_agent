import React, { useState } from 'react';
import './LoginForm3.css';

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const AtSignIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <circle cx="12" cy="16" r="1"></circle>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const LoginForm3 = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login3:', { email, password, rememberMe });
    };

    return (
        <div className="login3-wrapper">
            {/* Left Panel - Gradient */}
            <div className="login3-left-panel">
                <div className="login3-overlay"></div>
                <div className="login3-left-content">
                    <div className="login3-shield-wrapper">
                        <ShieldIcon />
                    </div>
                    <h1 className="login3-left-title">Secure Access</h1>
                    <p className="login3-left-subtitle">
                        Your trusted platform for secure authentication and seamless user experience.
                    </p>
                    <div className="login3-dots-grid">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="login3-dot"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="login3-right-panel">
                <div className="login3-form-container">
                    {/* Header */}
                    <div className="login3-header">
                        <div className="login3-icon-box">
                            <ShieldIcon />
                        </div>
                        <h2 className="login3-title">Sign in</h2>
                        <p className="login3-subtitle">Access your secure account</p>
                    </div>

                    {/* Social Buttons */}
                    <div className="login3-social-buttons">
                        <button className="login3-social-btn">
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </button>
                        <button className="login3-social-btn">
                            <TwitterIcon />
                            <span>Continue with Twitter</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="login3-divider">
                        <div className="login3-divider-line"></div>
                        <span className="login3-divider-text">Or sign in with email</span>
                        <div className="login3-divider-line"></div>
                    </div>

                    {/* Form */}
                    <form className="login3-form" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="login3-field">
                            <label htmlFor="email3" className="login3-label">
                                Email address
                            </label>
                            <div className="login3-input-wrapper">
                                <div className="login3-input-icon">
                                    <AtSignIcon />
                                </div>
                                <input
                                    id="email3"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="login3-input"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="login3-field">
                            <label htmlFor="password3" className="login3-label">
                                Password
                            </label>
                            <div className="login3-input-wrapper">
                                <div className="login3-input-icon">
                                    <LockIcon />
                                </div>
                                <input
                                    id="password3"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="login3-input login3-password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="login3-password-toggle"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Reset */}
                        <div className="login3-options">
                            <div className="login3-remember">
                                <input
                                    id="remember3"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="login3-checkbox"
                                />
                                <label htmlFor="remember3" className="login3-checkbox-label">
                                    Keep me signed in
                                </label>
                            </div>
                            <a href="#" className="login3-reset-link">
                                Reset password
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="login3-submit-btn">
                            Sign in to your account
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="login3-footer">
                        <p className="login3-footer-text">
                            New to our platform?{' '}
                            <a href="#" className="login3-footer-link">
                                Create an account
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm3;
