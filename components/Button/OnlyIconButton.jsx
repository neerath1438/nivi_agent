import Button from "./Button";
import { PlusIcon, MinusIcon, XIcon, SettingsIcon, SearchIcon, BellIcon, MailIcon, PhoneIcon } from "./Icons";
import './ButtonView.css'

const OnlyIconButton = () => {
    return (
        <div className="button-view-container">
            {/* Icon Only Buttons */}
            <div className="button-section">
                <h3 className="section-title">Icon Only Buttons</h3>
                <div className="button-group">
                    <Button variant="outline" size="sm" iconLeft={<SearchIcon />} />
                    <Button variant="outline" size="sm" iconLeft={<BellIcon />} />
                    <Button variant="outline" size="sm" iconLeft={<MailIcon />} />
                    <Button variant="outline" size="sm" iconLeft={<PhoneIcon />} />
                    <Button variant="outline" size="sm" iconLeft={<SettingsIcon />} />
                    <Button variant="outline" size="sm" iconLeft={<PlusIcon />} />
                    <Button variant="outline" size="sm" iconLeft={<MinusIcon />} />
                    <Button variant="outline" size="sm" iconLeft={<XIcon />} />
                </div>
            </div>
        </div>
    );
};

export default OnlyIconButton;
