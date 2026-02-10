"""Theme node runner - manages design tokens and styling specs for the UI."""
import random
from typing import Dict, Any
from app.runners.base_runner import BaseRunner

THEME_LIBRARY = {
    "Glassmorphism": {
        "primary_color": "#ffffff",
        "bg_color": "radial-gradient(circle at top right, #434343, #000000)",
        "card_style": "backdrop-filter: blur(16px) saturate(180%); background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.125);",
        "shadows": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "font_family": "Inter, sans-serif",
        "description": "Premium translucent look with heavy blur and soft glow."
    },
    "Cyberpunk": {
        "primary_color": "#ff00ff",
        "bg_color": "#050505",
        "card_style": "border: 2px solid #ff00ff; box-shadow: 0 0 10px #ff00ff, inset 0 0 10px #ff00ff; background: #0a0a0a;",
        "shadows": "5px 5px 0px #00ffff",
        "font_family": "Orbitron, sans-serif",
        "description": "High-contrast neon aesthetic with glowing borders and sharp angles."
    },
    "Minimalist": {
        "primary_color": "#111827",
        "bg_color": "#f9fafb",
        "card_style": "background: white; border: 1px solid #e5e7eb; border-radius: 8px;",
        "shadows": "0 1px 3px rgba(0,0,0,0.1)",
        "font_family": "Plus Jakarta Sans, sans-serif",
        "description": "Clean, spacious, and focus-oriented design with subtle details."
    },
    "Retro": {
        "primary_color": "#ff6b6b",
        "bg_color": "#f4e4bc",
        "card_style": "background: #fff; border: 4px solid #000; box-shadow: 8px 8px 0px #000;",
        "shadows": "8px 8px 0px #000",
        "font_family": "Space Mono, monospace",
        "description": "80s inspired brutalist look with bold borders and high-energy colors."
    },
    "iOS 16 Luxury": {
        "primary_color": "#007aff",
        "bg_color": "linear-gradient(135deg, #a8e6cf 0%, #dcedc1 50%, #ffd3b6 100%)",
        "card_style": "backdrop-filter: blur(25px) saturate(200%); background: rgba(255, 255, 255, 0.7); border: 0.5px solid rgba(255, 255, 255, 0.4); border-radius: 20px;",
        "shadows": "0 10px 40px rgba(0, 0, 0, 0.1)",
        "font_family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        "description": "Premium Apple-inspired aesthetic with extreme blur, soft gradients, and high-opacity glass."
    },
    "Material You": {
        "primary_color": "#d2e3af",
        "bg_color": "#f7fcf0",
        "card_style": "background: #e2f1af; border-radius: 32px; border: none; padding: 24px;",
        "shadows": "0 2px 8px rgba(0, 0, 0, 0.04)",
        "font_family": "'Google Sans', Roboto, system-ui, sans-serif",
        "description": "Google's Material 3 aesthetic with organic shapes, pastel tones, and adaptive rounding."
    },
    "Snow Dashboard": {
        "primary_color": "#3b82f6",
        "bg_color": "#f4f7fe",
        "card_style": "background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px;",
        "shadows": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        "font_family": "'Inter', 'Plus Jakarta Sans', sans-serif",
        "description": "Clean, enterprise-grade dashboard aesthetic with crisp borders and a professional blue accent."
    },
    "DesignCode Luxury": {
        "primary_color": "#a855f7",
        "bg_color": "radial-gradient(circle at top left, #1e293b, #000000)",
        "card_style": "backdrop-filter: blur(40px) saturate(200%); background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px;",
        "shadows": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        "font_family": "'Inter', system-ui, sans-serif",
        "description": "Ultra-premium dark mode with intense glassmorphism, neon purple accents, and deep depth effects."
    }
}

class ThemeRunner(BaseRunner):
    """Runner for selecting and injecting design tokens."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        selected_theme = node_data.get("theme", "Glassmorphism")
        
        if selected_theme == "All Themes (Random)":
            selected_theme = random.choice(list(THEME_LIBRARY.keys()))
            
        theme_data = THEME_LIBRARY.get(selected_theme, THEME_LIBRARY["Glassmorphism"])
        
        return {
            "selected_theme": selected_theme,
            "theme_tokens": theme_data,
            "output": f"Visual Theme set to: **{selected_theme}** 🎨\n*{theme_data['description']}*"
        }
