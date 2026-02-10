import React from 'react';
import './Hero3.css';

const ArrowRightIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const Hero3 = () => {
    const features = ["No credit card required", "Free 14-day trial", "Cancel anytime"];

    return (
        <div className="hero3-wrapper">
            <div className="hero3-container">
                <header className="hero3-header">
                    <nav className="hero3-nav">
                        <div className="hero3-logo">
                            Brand
                        </div>
                        <div className="hero3-nav-links">
                            <a href="#" className="hero3-link">Features</a>
                            <a href="#" className="hero3-link">Pricing</a>
                            <a href="#" className="hero3-link">About</a>
                            <button className="hero3-signin-btn">
                                Sign In
                            </button>
                        </div>
                    </nav>
                </header>

                <main className="hero3-main">
                    <div className="hero3-content">
                        <h1 className="hero3-title">
                            Simple. Clean.
                            <br />
                            <span className="hero3-title-accent">Effective.</span>
                        </h1>

                        <p className="hero3-description">
                            The minimalist approach to building great products. Focus on what
                            matters most with our clean, distraction-free platform.
                        </p>

                        <div className="hero3-features">
                            {features.map((feature, index) => (
                                <div key={index} className="hero3-feature-item">
                                    <CheckIcon className="hero3-check-icon" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="hero3-actions">
                            <button className="hero3-primary-btn">
                                Get Started Free
                                <ArrowRightIcon className="hero3-arrow-icon" />
                            </button>
                            <button className="hero3-secondary-btn">
                                View Demo
                            </button>
                        </div>

                        <div className="hero3-stats-divider">
                            <div className="hero3-stats-grid">
                                <div className="hero3-stat-item">
                                    <div className="hero3-stat-value">10K+</div>
                                    <div className="hero3-stat-label">Active Users</div>
                                </div>
                                <div className="hero3-stat-item">
                                    <div className="hero3-stat-value">99.9%</div>
                                    <div className="hero3-stat-label">Uptime</div>
                                </div>
                                <div className="hero3-stat-item">
                                    <div className="hero3-stat-value">24/7</div>
                                    <div className="hero3-stat-label">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Hero3;
