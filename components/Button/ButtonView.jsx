import Button from "./Button";
import './ButtonView.css'

const ButtonView = () => {
    return (
        <div className="button-view-container">
            {/* Basic Variants */}
            <div className="button-section">
                <h3 className="section-title">Basic Variants</h3>
                <div className="button-group">
                    <Button variant="default">Default</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                </div>
            </div>

            {/* Sizes & States */}
            <div className="button-section">
                <h3 className="section-title">Sizes & States</h3>
                <div className="button-group">
                    <Button variant="default" size="sm">Small</Button>
                    <Button variant="default" size="lg">Large</Button>
                    <Button variant="default" loading>Loading</Button>
                    <Button variant="outline" loading>Loading</Button>
                </div>
            </div>
        </div>
    );
};

export default ButtonView;
