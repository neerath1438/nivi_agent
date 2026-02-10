import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import "./BlogHeader.css";

const BlogHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = [
        { href: "#", text: "Home" },
        { href: "#", text: "Articles" },
        { href: "#", text: "Tutorials" },
        { href: "#", text: "Reviews" },
        { href: "#", text: "About" }
    ];

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMenuOpen]);

    return (
        <div className="blog-header-wrapper">
            <header className="blog-header">
                <div className="blog-container">
                    <div className="blog-header-inner">
                        {/* Logo */}
                        <div className="blog-logo-container">
                            <a href="#" className="blog-logo">
                                <div className="blog-logo-icon">
                                    <span>T</span>
                                </div>
                                <span className="blog-logo-text">
                                    TechBlog
                                </span>
                            </a>
                        </div>

                        {/* Navigation Desktop */}
                        <nav className="blog-nav-desktop">
                            {navLinks.map(link => (
                                <a key={link.text} href={link.href} className="blog-nav-link">
                                    {link.text}
                                </a>
                            ))}
                        </nav>

                        {/* Actions Desktop */}
                        <div className="blog-actions-desktop">
                            <button className="blog-search-btn" aria-label="Search">
                                <Search className="blog-icon-sm" />
                            </button>
                            <a href="#" className="blog-subscribe-btn">
                                Subscribe
                            </a>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="blog-mobile-toggle">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="blog-toggle-btn"
                                aria-label="Toggle menu"
                            >
                                <div className={`blog-toggle-icons ${isMenuOpen ? 'is-open' : ''}`}>
                                    <Menu className="blog-icon-md menu-icon" />
                                    <X className="blog-icon-md close-icon" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Overlay */}
            <div
                className={`blog-overlay ${isMenuOpen ? "is-visible" : ""}`}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
            ></div>

            {/* Mobile Sidebar */}
            <div className={`blog-sidebar ${isMenuOpen ? "is-open" : ""}`}>
                <div className="blog-sidebar-inner">
                    <div className="blog-sidebar-header">
                        <a href="#" className="blog-logo">
                            <div className="blog-logo-icon">
                                <span>T</span>
                            </div>
                            <span className="blog-logo-text">
                                TechBlog
                            </span>
                        </a>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="blog-close-btn"
                            aria-label="Close menu"
                        >
                            <X className="blog-icon-md" />
                        </button>
                    </div>

                    <nav className="blog-sidebar-nav">
                        <div className="blog-sidebar-links">
                            {navLinks.map(link => (
                                <a
                                    key={link.text}
                                    href={link.href}
                                    className="blog-sidebar-link"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.text}
                                </a>
                            ))}
                        </div>
                    </nav>

                    <div className="blog-sidebar-footer">
                        <a href="#" className="blog-subscribe-btn-mobile">
                            Subscribe
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogHeader;
