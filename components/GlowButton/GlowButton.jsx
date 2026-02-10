import React, { useEffect, useState } from "react";
import './GlowButton.css';

const variants = {
    blue: {
        light: {
            outerGlow: "rgba(59, 130, 246, 0.4)",
            blobGlow: "rgba(59, 130, 246, 0.6)",
            blobHighlight: "#60a5fa",
            blobShadow: "rgba(59, 130, 246, 0.25)",
            innerGlow: "rgba(59, 130, 246, 0.1)",
            innerHighlight: "rgba(147, 197, 253, 0.15)",
            outerBg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            innerBg: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
            textColor: "#1e293b"
        },
        dark: {
            outerGlow: "rgba(255, 255, 255, 0.35)",
            blobGlow: "rgba(0, 0, 255, 0.5)",
            blobHighlight: "#3fe9ff",
            blobShadow: "rgba(0, 81, 255, 0.18)",
            innerGlow: "rgba(0, 0, 255, 0.07)",
            innerHighlight: "rgba(0, 225, 255, 0.1)",
            outerBg: "radial-gradient(circle 80px at 80% -10%, #ffffff, #181b1b)",
            innerBg: "radial-gradient(circle 80px at 80% -50%, #777777, #0f1111)",
            textColor: "#ffffff"
        }
    },
    pink: {
        light: {
            outerGlow: "rgba(236, 72, 153, 0.4)",
            blobGlow: "rgba(236, 72, 153, 0.6)",
            blobHighlight: "#f472b6",
            blobShadow: "rgba(236, 72, 153, 0.25)",
            innerGlow: "rgba(236, 72, 153, 0.1)",
            innerHighlight: "rgba(251, 207, 232, 0.15)",
            outerBg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
            innerBg: "linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)",
            textColor: "#831843"
        },
        dark: {
            outerGlow: "rgba(255, 230, 255, 0.4)",
            blobGlow: "rgba(255, 0, 150, 0.5)",
            blobHighlight: "#ff66cc",
            blobShadow: "rgba(255, 0, 150, 0.18)",
            innerGlow: "rgba(255, 0, 150, 0.07)",
            innerHighlight: "rgba(255, 102, 204, 0.1)",
            outerBg: "radial-gradient(circle 80px at 80% -10%, #ffffff, #181b1b)",
            innerBg: "radial-gradient(circle 80px at 80% -50%, #777777, #0f1111)",
            textColor: "#ffffff"
        }
    },
    green: {
        light: {
            outerGlow: "rgba(34, 197, 94, 0.4)",
            blobGlow: "rgba(34, 197, 94, 0.6)",
            blobHighlight: "#4ade80",
            blobShadow: "rgba(34, 197, 94, 0.25)",
            innerGlow: "rgba(34, 197, 94, 0.1)",
            innerHighlight: "rgba(187, 247, 208, 0.15)",
            outerBg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            innerBg: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
            textColor: "#14532d"
        },
        dark: {
            outerGlow: "rgba(230, 255, 230, 0.4)",
            blobGlow: "rgba(0, 255, 100, 0.5)",
            blobHighlight: "#adff2f",
            blobShadow: "rgba(0, 255, 100, 0.18)",
            innerGlow: "rgba(0, 255, 100, 0.07)",
            innerHighlight: "rgba(173, 255, 47, 0.1)",
            outerBg: "radial-gradient(circle 80px at 80% -10%, #ffffff, #181b1b)",
            innerBg: "radial-gradient(circle 80px at 80% -50%, #777777, #0f1111)",
            textColor: "#ffffff"
        }
    }
};

const useTheme = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkTheme = () => {
            const isDarkMode =
                document.documentElement.classList.contains("dark") ||
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDark(isDarkMode);
        };

        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", checkTheme);

        return () => {
            observer.disconnect();
            mediaQuery.removeEventListener("change", checkTheme);
        };
    }, []);

    return isDark;
};

const GlowButton = ({
    children,
    variant = "blue",
    onClick,
    ...props
}) => {
    const isDark = useTheme();
    const variantColors = variants[variant] || variants.blue;
    const colors = isDark ? variantColors.dark : variantColors.light;

    return (
        <button
            className="glow-button-outer"
            onClick={onClick}
            style={{ background: colors.outerBg }}
            {...props}
        >
            <div
                className="glow-button-outer-glow"
                style={{ boxShadow: `0 0 30px ${colors.outerGlow}` }}
            />

            <div
                className="glow-button-blob"
                style={{
                    boxShadow: `-10px 10px 30px ${colors.blobShadow}`,
                    background: `radial-gradient(circle 60px at 0% 100%, ${colors.blobHighlight}, ${colors.blobGlow}, transparent)`
                }}
            />

            <div
                className="glow-button-inner"
                style={{
                    background: colors.innerBg,
                    color: colors.textColor
                }}
            >
                <div
                    className="glow-button-inner-glow"
                    style={{
                        background: `radial-gradient(circle 60px at 0% 100%, ${colors.innerHighlight}, ${colors.innerGlow}, transparent)`
                    }}
                />

                <span className="glow-button-text">
                    {children}
                </span>
            </div>
        </button>
    );
};

export default GlowButton;
