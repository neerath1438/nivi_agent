import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MasonryGrid.css';

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="masonry-heart-icon">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

const GridItem = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="masonry-item"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="masonry-image-container">
                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="masonry-image"
                    onError={(e) => {
                        const target = e.target;
                        target.onerror = null;
                        target.src = `https://placehold.co/400x300/fecaca/333333?text=Image+Not+Found`;
                    }}
                />
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="masonry-overlay"
                        >
                            <div className="masonry-overlay-content">
                                <div className="masonry-actions">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="masonry-action-btn"
                                    >
                                        <HeartIcon />
                                    </motion.button>
                                </div>
                                <p className="masonry-item-title">{item.title}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const MasonryGrid = ({ items }) => {
    return (
        <div className="masonry-grid-wrapper">
            <div className="masonry-columns">
                {items.map((item) => (
                    <GridItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default MasonryGrid;
