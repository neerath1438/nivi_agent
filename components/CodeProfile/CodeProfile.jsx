import React from "react";
import "./CodeProfile.css";

const coderData = {
    name: "Zane Whitaker",
    role: "Frontend Developer",
    seniority: "Mid-Level",
    location: "Bangladesh",
    skills: [
        "React",
        "Next.js",
        "JavaScript",
        "TypeScript",
        "TailwindCSS",
        "CSS",
        "Figma",
        "GitHub",
        "HTML",
        "Astro",
        "Node.js",
        "Express",
        "MongoDB",
        "Firebase",
        "Git",
    ],
};

const CodeProfile = () => {
    return (
        <div className="wui-codex-bay">
            <div className="wui-codex-well">
                {/* Decorative Top Border */}
                <div className="wui-codex-streak">
                    <div />
                    <div />
                </div>

                {/* Window Header */}
                <div className="wui-codex-header">
                    <div className="wui-codex-controls">
                        <div className="wui-codex-dot red" />
                        <div className="wui-codex-dot orange" />
                        <div className="wui-codex-dot green" />
                    </div>
                    <div className="wui-codex-filename">
                        coder.js
                    </div>
                </div>

                {/* Code Content */}
                <div className="wui-codex-core">
                    {/* Decorative Glows */}
                    <div className="wui-codex-glow-left" />
                    <div className="wui-codex-glow-right" />

                    <div className="wui-codex-portal">
                        {/* Line Numbers */}
                        <div className="wui-codex-gutters">
                            {Array.from({ length: 12 }, (_, i) => (
                                <div key={i} className="wui-codex-line-number">
                                    {i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Editor Content */}
                        <code className="wui-codex-editor">
                            <div>
                                <span className="wui-codex-token-const">const</span>
                                <span className="wui-codex-token-var"> coder </span>
                                <span className="wui-codex-token-op">= </span>
                                <span className="wui-codex-token-punct">{"{"}</span>
                            </div>

                            <div className="wui-codex-indent">
                                <span className="wui-codex-token-key">name: </span>
                                <span className="wui-codex-token-string-delim">'</span>
                                <span className="wui-codex-token-string-val">{coderData.name}</span>
                                <span className="wui-codex-token-string-delim">'</span>
                                <span className="wui-codex-token-punct">,</span>
                            </div>

                            <div className="wui-codex-indent">
                                <span className="wui-codex-token-key">role: </span>
                                <span className="wui-codex-token-string-delim">'</span>
                                <span className="wui-codex-token-string-val">{coderData.role}</span>
                                <span className="wui-codex-token-string-delim">'</span>
                                <span className="wui-codex-token-punct">,</span>
                            </div>

                            <div className="wui-codex-indent">
                                <span className="wui-codex-token-key">seniority: </span>
                                <span className="wui-codex-token-string-delim">'</span>
                                <span className="wui-codex-token-string-val">{coderData.seniority}</span>
                                <span className="wui-codex-token-string-delim">'</span>
                                <span className="wui-codex-token-punct">,</span>
                            </div>

                            <div className="wui-codex-indent">
                                <span className="wui-codex-token-key">location: </span>
                                <span className="wui-codex-token-string-delim">'</span>
                                <span className="wui-codex-token-string-val">{coderData.location}</span>
                                <span className="wui-codex-token-string-delim">'</span>
                                <span className="wui-codex-token-punct">,</span>
                            </div>

                            <div className="wui-codex-indent">
                                <span className="wui-codex-token-key">skills: </span>
                                <span className="wui-codex-token-punct">{"["}</span>
                                <div className="wui-codex-skills-stack">
                                    {coderData.skills.map((skill, index) => (
                                        <span key={skill} className="wui-codex-token-skill">
                                            <span className="wui-codex-token-skill-delim">'</span>
                                            <span className="wui-codex-token-skill-val">{skill}</span>
                                            <span className="wui-codex-token-skill-delim">'</span>
                                            {index < coderData.skills.length - 1 && (
                                                <span className="wui-codex-token-punct">, </span>
                                            )}
                                        </span>
                                    ))}
                                </div>
                                <span className="wui-codex-token-punct">{"],"}</span>
                            </div>

                            <div>
                                <span className="wui-codex-token-punct">{"};"}</span>
                            </div>
                        </code>
                    </div>
                </div>

                {/* Footer info */}
                <div className="wui-codex-footer">
                    <span>UTF-8</span>
                    <span>JavaScript</span>
                    <span>Ln 12, Col 2</span>
                </div>
            </div>
        </div>
    );
};

export default CodeProfile;
