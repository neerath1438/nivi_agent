import React from 'react';
import './NftMarketplace.css';

const nftData = [
    { id: 'ethereal-dreams-001', imageUrl: 'https://i.pinimg.com/1200x/93/b6/9f/93b69fd5d973b3f2fbc325982eb8e658.jpg', title: 'Ethereal Dreams', highestBid: '1/1', price: '0.047 ETH', timeLeft: '08:10:00' },
    { id: 'crystal-harmony-002', imageUrl: 'https://i.pinimg.com/1200x/c5/3e/6e/c53e6e265a893d70b00070563d063606.jpg', title: 'Crystal Harmony', highestBid: '1/1', price: '0.023 ETH', timeLeft: '10:40:00' },
    { id: 'celestial-arch-003', imageUrl: 'https://i.pinimg.com/736x/c6/1c/ae/c61cae893723278b817cd64ffc966bf8.jpg', title: 'Celestial Arch', highestBid: '1/1', price: '0.034 ETH', timeLeft: '03:45:00' },
    { id: 'quantum-sphere-004', imageUrl: 'https://i.pinimg.com/1200x/e1/6c/58/e16c5867c9dcb1334d45cf51caee3563.jpg', title: 'Quantum Sphere', highestBid: '1/1', price: '0.041 ETH', timeLeft: '02:30:00' },
    { id: 'digital-nexus-005', imageUrl: 'https://i.pinimg.com/736x/c0/09/b1/c009b1bd4d8bb5439c59221e2eca7516.jpg', title: 'Digital Nexus', highestBid: '1/1', price: '0.075 ETH', timeLeft: '' },
    { id: 'cosmic-voyage-006', imageUrl: 'https://i.pinimg.com/736x/fb/27/0f/fb270f928d2af556c9d97f2af5fb908d.jpg', title: 'Cosmic Voyage', highestBid: '1/1', price: '0.15 ETH', timeLeft: '22:05:00' },
    { id: 'future-vision-007', imageUrl: 'https://i.pinimg.com/1200x/af/5f/3d/af5f3d7fc5d2cd647fc5559c86b61096.jpg', title: 'Future Vision', highestBid: '1/1', price: '0.088 ETH', timeLeft: '15:30:00' },
    { id: 'neo-genesis-008', imageUrl: 'https://i.pinimg.com/736x/a8/13/20/a81320aa1ad808fa2fe9d05d06f06a6c.jpg', title: 'Neo Genesis', highestBid: '1/1', price: '0.20 ETH', timeLeft: '01:15:00' },
    { id: 'neon-warrior-009', imageUrl: 'https://i.pinimg.com/1200x/4a/2a/8b/4a2a8b8d5c9a4cccc8de1e015119dfb3.jpg', title: 'Neon Warrior', highestBid: '1/1', price: '0.11 ETH', timeLeft: '07:55:00' },
    { id: 'stellar-guardian-010', imageUrl: 'https://i.pinimg.com/1200x/97/67/23/976723dda78a202b1ddbc5fc674c7511.jpg', title: 'Stellar Guardian', highestBid: '1/1', price: '0.35 ETH', timeLeft: '18:00:00' },
    { id: 'dimensional-gate-011', imageUrl: 'https://i.pinimg.com/1200x/67/99/6a/67996a2154fd2a8da518e4bfb45c1474.jpg', title: 'Dimensional Gate', highestBid: '1/1', price: '0.42 ETH', timeLeft: '11:20:00' },
    { id: 'auric-flow-012', imageUrl: 'https://i.pinimg.com/1200x/2a/59/11/2a591199f4558350175dd0b2e120558a.jpg', title: 'Auric Flow', highestBid: '1/1', price: '0.50 ETH', timeLeft: '04:45:00' },
];

const ClockIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HeartIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M20.8401 4.60999C20.3294 4.099 19.7229 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.9501 2.99817C16.2277 2.99817 15.5122 3.14052 14.8447 3.41708C14.1772 3.69364 13.5707 4.099 13.0601 4.60999L12.0001 5.66999L10.9401 4.60999C9.90843 3.5783 8.50915 2.9987 7.05008 2.9987C5.59102 2.9987 4.19174 3.5783 3.16008 4.60999C2.12843 5.64166 1.54883 7.04094 1.54883 8.49999C1.54883 9.95905 2.12843 11.3583 3.16008 12.39L12.0001 21.23L20.8401 12.39C21.8717 11.3583 22.4513 9.95905 22.4513 8.49999C22.4513 7.04094 21.8717 5.64166 20.8401 4.60999Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EthIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.0002 22.6667L11.9468 22.5867L5.3335 14L12.0002 17.3333L18.6668 14L12.0002 22.6667Z" fill="currentColor" />
        <path d="M12 1.33331L5.33333 12.6666L12 16V1.33331Z" fill="currentColor" fillOpacity="0.6" />
        <path d="M12 1.33331L18.6667 12.6666L12 16V1.33331Z" fill="currentColor" fillOpacity="0.8" />
        <path d="M5.3335 14L12.0002 17.3333V22.6666L5.3335 14Z" fill="currentColor" fillOpacity="0.6" />
        <path d="M18.6668 14L12.0002 17.3333V22.6666L18.6668 14Z" fill="currentColor" fillOpacity="0.8" />
    </svg>
);

const NftCard = ({ imageUrl, title, highestBid, price, timeLeft }) => {
    return (
        <div className="nft-card">
            <div className="nft-card-inner">
                <div className="nft-image-container">
                    <img src={imageUrl} alt={title} className="nft-image" />
                    {timeLeft && (
                        <div className="nft-time-left">
                            <ClockIcon className="nft-time-icon" />
                            <span className="nft-time-text">{timeLeft}</span>
                        </div>
                    )}
                    <button className="nft-like-button">
                        <HeartIcon className="nft-like-icon" />
                    </button>
                </div>
                <div className="nft-details">
                    <div className="nft-details-header">
                        <h3 className="nft-title" title={title}>{title}</h3>
                        <EthIcon className="nft-eth-icon" />
                    </div>
                    <p className="nft-bid-info">Highest Bid {highestBid}</p>
                    <div className="nft-price-row">
                        <p className="nft-price-label">Price</p>
                        <p className="nft-price-value">{price}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NftMarketplace = () => {
    return (
        <div className="nft-marketplace">
            <div className="nft-marketplace-container">
                <div className="nft-marketplace-header">
                    <h1 className="nft-marketplace-title">NFT Marketplace</h1>
                    <p className="nft-marketplace-subtitle">Discover, collect, and trade unique digital assets</p>
                </div>
                <div className="nft-grid">
                    {nftData.map((nft) => (
                        <NftCard key={nft.id} {...nft} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NftMarketplace;
