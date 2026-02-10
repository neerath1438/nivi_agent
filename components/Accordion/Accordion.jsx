import React, { useState } from 'react';
import { Briefcase, Shuffle, AlertCircle, BookOpen, Wallet, Mail, ShieldCheck, MonitorPlay, ChevronDown } from 'lucide-react';
import './Accordion.css';

const AccordionItem = ({ item, isOpen, onToggle }) => {
    return (
        <div className="wui-layer-brick">
            <button className="wui-layer-trigger" onClick={onToggle}>
                <div className="wui-layer-intent">
                    {item.icon}
                    <span className="wui-layer-voice">{item.question}</span>
                </div>
                <ChevronDown size={20} className={`wui-layer-dial ${isOpen ? 'open' : ''}`} />
            </button>
            <div className={`wui-layer-depth ${isOpen ? 'open' : ''}`}>
                <div className="wui-layer-well">
                    <p>{item.answer}</p>
                </div>
            </div>
        </div>
    );
};

const Accordion = ({ data, defaultOpen = null }) => {
    const [openIndex, setOpenIndex] = useState(defaultOpen);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="wui-layer-stage">
            <h1 className="wui-layer-crown">General Questions</h1>
            <div className="wui-layer-stack">
                {data.map((item, index) => (
                    <AccordionItem
                        key={index}
                        item={item}
                        isOpen={openIndex === index}
                        onToggle={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Accordion;
