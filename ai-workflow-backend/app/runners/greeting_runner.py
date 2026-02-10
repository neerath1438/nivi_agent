"""Greeting Node Runner - Rotates through 10 attractive welcome messages."""
import random
from typing import Dict, Any
from app.runners.base_runner import BaseRunner

# Pre-defined attractive branded messages (Exactly 10 as provided)
WELCOME_MESSAGES = [
    "👋✨ Welcome to {company_name}\nWhere premium quality meets elite athletic performance 💪👕\n\n🎯 Our Product Line\n🎽 Designer Sublimation Jerseys\n👕 High-Performance T-Shirts\n🩳 Professional Athletic Wear\n\n🏆 Why Choose Us\n⭐ Superior Fabric Standards\n🎨 Rich & Vibrant Printing\n🧵 Precision Stitching\n🚚 Fast & Reliable Delivery\n🤝 Trusted by Teams & Clubs\n\n📍 Address:\n🏠 SK Sports Wear, Tirupur – 641604\n\n📲 Catalog: {catalog_link}",

    "👋🔥 Welcome to {company_name}\nCrafting premium sportswear for winners 🏆\n\n🎯 What We Offer\n🎽 Custom Sublimation Jerseys\n👕 Performance-Driven T-Shirts\n🩳 Training & Match Wear\n\n🏆 Our Strengths\n✨ Export-Quality Fabric\n🎨 Fade-Free Prints\n📏 Perfect Fit & Finish\n⏱️ On-Time Delivery\n\n📍 Address:\n🏠 SK Sports Wear, Tirupur – 641604\n\n📲 Explore: {catalog_link}",

    "👋⚡ Welcome to {company_name}\nDesigned to perform. Built to last. 💥\n\n🎯 Product Range\n🎽 Sublimation Jerseys\n👕 Performance T-Shirts\n🩳 Athletic Wear\n\n🏆 Why Customers Choose Us\n💎 Premium Fabrics\n🎨 Sharp Print Quality\n🧵 Durable Stitching\n🚀 Quick Turnaround\n\n📍 Visit Us:\n🏠 SK Sports Wear, Tirupur, TN – 641604\n\n📲 Catalog: {catalog_link}",

    "👋🎨 Welcome to {company_name}\nYour destination for custom premium sportswear 👕\n\n🎯 Our Specialties\n🎽 Fully Custom Sublimation Jerseys\n👕 Performance T-Shirts\n🩳 Athletic Bottom Wear\n\n🏆 What Sets Us Apart\n🧵 Quality-First Manufacturing\n🎨 Logo • Name • Number Customization\n📐 Size & Fit Solutions\n🚚 Timely Delivery\n\n📍 Address:\n🏠 SK Sports Wear, Tirupur – 641604\n\n📲 Designs: {catalog_link}",

    "👋🏆 Welcome to {company_name}\nTrusted by teams, academies & sports clubs 🤝\n\n🎯 Our Line-Up\n🎽 Team Sublimation Jerseys\n👕 Training Performance T-Shirts\n🩳 Match-Ready Athletic Wear\n\n🏆 Why Teams Trust Us\n💪 Durable Sports Fabrics\n🎨 Long-Lasting Prints\n📦 Bulk Order Expertise\n⏱️ Reliable Delivery\n\n📍 Address:\n🏠 SK Sports Wear, Tirupur – 641604\n\n📲 Catalog: {catalog_link}",

    "👋✨ {company_name}\nPremium sportswear. Professionally crafted 👕\n\n🎯 Collection\n🎽 Sublimation Jerseys\n👕 Performance T-Shirts\n🩳 Athletic Wear\n\n🏆 Our Edge\n💎 Superior Fabric\n🎨 Clean Prints\n🧵 Quality Stitching\n🚚 Reliable Delivery\n\n📍 Address:\n🏠 SK Sports Wear, Tirupur – 641604\n\n📲 Catalog: {catalog_link}",

    "👋🔥 Welcome to {company_name}\nEngineered for comfort, performance & durability 💪\n\n🎯 Our Products\n🎽 Sublimation Jerseys\n👕 Performance T-Shirts\n🩳 Professional Athletic Wear\n\n🏆 Why We Stand Out\n🧬 Advanced Fabrics\n🎨 Color-Perfect Printing\n📐 Comfortable Fit\n🚀 Fast Delivery\n\n📍 Reach Us:\n🏠 SK Sports Wear, Tirupur, TN – 641604\n\n📲 Explore: {catalog_link}",

    "👋😊 Welcome to {company_name}\nYour one-stop solution for premium custom sportswear 👕\n\n🎯 We Offer\n🎽 Sublimation Jerseys\n👕 Performance T-Shirts\n🩳 Athletic Wear\n\n🏆 Why Choose Us\n⭐ Premium Fabric\n🎨 Vibrant Prints\n📦 Bulk Orders\n🚚 Fast Dispatch\n\n📍 Store Address:\n🏠 SK Sports Wear, Tirupur – 641604\n\n📲 Catalog: {catalog_link}",

    "👋👑 Welcome to {company_name}\nRedefining premium sportswear standards 🏆\n\n🎯 Product Range\n🎽 Designer Sublimation Jerseys\n👕 Elite Performance T-Shirts\n🩳 Professional Athletic Wear\n\n🏆 Our Promise\n💎 Top-Grade Materials\n🎨 HD Printing\n🧵 Superior Finish\n⏱️ Timely Delivery\n\n📍 Showroom:\n🏠 SK Sports Wear, Tirupur – 641604\n\n📲 Collection: {catalog_link}",

    "👋😊 Welcome to {company_name} 👕\nThanks for contacting us!\n\n🎯 Products\n🎽 Sublimation Jerseys\n👕 Performance T-Shirts\n🩳 Athletic Wear\n\n🏆 Why SK Sports Wear?\n⭐ Premium Fabric\n🎨 Vibrant Prints\n🧵 Quality Finish\n🚚 Fast Delivery\n\n📍 Address:\n🏠 SK Sports Wear, Tirupur – 641604\n\n📲 Catalog: {catalog_link}"
]

class GreetingRunner(BaseRunner):
    """Runner that selects a random attractive greeting template."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """Select a random template and fill variables using Catalog Node data."""
        # Get data directly from state (provided by TShirtCatalogNode)
        company_name = state.get("company_name", "SK Sports Wear")
        catalog_link = state.get("catalog_link", "https://sksportswear.com/catalog")
        
        # Select Random Template
        selected_template = random.choice(WELCOME_MESSAGES)
        
        # Proper String Formatting (Injecting Catalog Data)
        final_message = selected_template.format(
            company_name=company_name,
            catalog_link=catalog_link
        )
        
        print(f"🎲 [GREETING NODE] Selected 1 of 10 templates.")
        print(f"🏢 [GREETING NODE] Using Company: {company_name}")
        print(f"🔗 [GREETING NODE] Using Link: {catalog_link}")
        
        return {
            "output": final_message,
            "greeting_type": "random_rotation"
        }

greeting_runner = GreetingRunner()
