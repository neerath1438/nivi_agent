import GlowButton from "./GlowButton";
import './GlowButtonView.css';

const GlowButtonView = () => {
    return (
        <div className="glow-button-view-container">
            <div className="glow-button-section">
                <h3 className="glow-section-title">Glow Buttons</h3>
                <div className="glow-button-group">
                    <GlowButton variant="blue">Blue Glow</GlowButton>
                    <GlowButton variant="pink">Pink Glow</GlowButton>
                    <GlowButton variant="green">Green Glow</GlowButton>
                </div>
            </div>
        </div>
    );
};

export default GlowButtonView;
