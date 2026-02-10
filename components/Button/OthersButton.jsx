import Button from "./Button";
import { CheckIcon, XIcon, ArrowRightIcon, ArrowLeftIcon } from "./Icons";
import './ButtonView.css'

const OthersButton = () => {
    return (
        <div className="button-view-container">
            {/* Icon Buttons */}
            <div className="button-section">
                <h3 className="section-title">Icon Buttons</h3>
                <div className="button-group">
                    <Button variant="outline" iconLeft={<ArrowLeftIcon />}>
                        Previous
                    </Button>
                    <Button variant="default" iconRight={<ArrowRightIcon />}>
                        Next
                    </Button>
                    <Button variant="secondary" iconLeft={<ArrowLeftIcon />}>
                        Back
                    </Button>
                    <Button variant="ghost" iconRight={<ArrowRightIcon />}>
                        Forward
                    </Button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="button-section">
                <h3 className="section-title">Action Buttons</h3>
                <div className="button-group">
                    <Button
                        className="bg-green-500 dark:bg-green-500 dark:text-white dark:hover:bg-green-800"
                        variant="default"
                        iconLeft={<CheckIcon />}
                    >
                        Success
                    </Button>
                    <Button variant="destructive" iconLeft={<XIcon />}>
                        Delete
                    </Button>
                    <Button variant="outline" iconLeft={<CheckIcon />}>
                        Approve
                    </Button>
                    <Button variant="secondary" iconLeft={<XIcon />} className="bg-red-500">
                        Reject
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OthersButton;
