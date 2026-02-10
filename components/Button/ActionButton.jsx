import Button from "./Button";
import { DownloadIcon, ShoppingCartIcon, HeartIcon, StarIcon, ShareIcon } from "./Icons";
import './ButtonView.css'

const ActionButton = () => {
    return (
        <div className="button-view-container">
            {/* Action Buttons */}
            <div className="button-section">
                <h3 className="section-title">Common Actions</h3>
                <div className="button-group">
                    <Button variant="default" iconLeft={<DownloadIcon />}>
                        Download
                    </Button>
                    <Button variant="default" iconLeft={<ShoppingCartIcon />}>
                        Add to Cart
                    </Button>
                    <Button variant="outline" iconLeft={<HeartIcon />}>
                        Add to Wishlist
                    </Button>
                    <Button variant="secondary" iconLeft={<StarIcon />}>
                        Rate Product
                    </Button>
                    <Button variant="ghost" iconLeft={<ShareIcon />}>
                        Share
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ActionButton;
