import React from 'react';
import Badge from './Badge';
import {
    GlassBadge,
    NeonBadge,
    GradientBadge,
    FrostedBadge,
    HolographicBadge,
    CrystalBadge,
    MetallicBadge,
    GoldBadge
} from './GlassBadge';
import {
    CalendarIcon,
    SendIcon,
    StarIcon,
    HeartIcon,
    ShieldIcon,
    TrendingUpIcon,
    ZapIcon,
    CrownIcon
} from './BadgeIcons';
import './BadgeView.css';

const BadgeView = () => {
    return (
        <div className="badge-view-container">
            {/* Original Badge Variants */}
            <div className="badge-section">
                <h3 className="badge-section-title">Original Badge Variants</h3>
                <div className="badge-group">
                    <Badge>Badge</Badge>
                    <Badge className="bg-blue-100 text-blue-800">Soft (Default)</Badge>
                    <Badge className="bg-blue-600 text-white">Solid</Badge>
                    <Badge className="border border-blue-300 text-blue-700">Outline</Badge>
                    <Badge
                        className="bg-red-100 text-red-800"
                        onDismiss={() => console.log('Dismissed!')}
                        iconLeft={<CalendarIcon />}
                    >
                        Dismissible
                    </Badge>
                    <Badge
                        className="bg-purple-600 text-white"
                        onClick={() => alert('Badge clicked!')}
                    >
                        Clickable
                    </Badge>
                    <Badge
                        className="border border-orange-300 text-orange-700"
                        href="#"
                        iconRight={<SendIcon />}
                    >
                        Link
                    </Badge>
                </div>
            </div>

            {/* Glassy Effect Badges */}
            <div className="badge-section">
                <h3 className="badge-section-title">Glassy Effect Badges</h3>
                <div className="badge-group">
                    <GlassBadge>Glass Basic</GlassBadge>
                    <GlassBadge className="text-blue-600">Glass Blue</GlassBadge>
                    <GlassBadge className="text-purple-600">Glass Purple</GlassBadge>
                    <GlassBadge className="text-green-600">Glass Green</GlassBadge>
                    <GlassBadge className="text-pink-600">Glass Pink</GlassBadge>
                </div>
            </div>

            {/* Neon Glow Badges */}
            <div className="badge-section">
                <h3 className="badge-section-title">Neon Glow Badges</h3>
                <div className="badge-group">
                    <NeonBadge color="blue">Neon Blue</NeonBadge>
                    <NeonBadge color="purple">Neon Purple</NeonBadge>
                    <NeonBadge color="pink">Neon Pink</NeonBadge>
                    <NeonBadge color="green">Neon Green</NeonBadge>
                    <NeonBadge color="orange">Neon Orange</NeonBadge>
                    <NeonBadge color="red">Neon Red</NeonBadge>
                </div>
            </div>

            {/* Gradient Badges */}
            <div className="badge-section">
                <h3 className="badge-section-title">Gradient Badges</h3>
                <div className="badge-group">
                    <GradientBadge gradient="blue">Ocean Blue</GradientBadge>
                    <GradientBadge gradient="purple">Purple Haze</GradientBadge>
                    <GradientBadge gradient="green">Forest Green</GradientBadge>
                    <GradientBadge gradient="orange">Sunset Orange</GradientBadge>
                    <GradientBadge gradient="rainbow">Rainbow</GradientBadge>
                    <GradientBadge gradient="sunset">Sunset</GradientBadge>
                </div>
            </div>

            {/* Frosted Glass Badges */}
            <div className="badge-section">
                <h3 className="badge-section-title">Frosted Glass Badges</h3>
                <div className="badge-group">
                    <FrostedBadge className="text-gray-700">Frosted Basic</FrostedBadge>
                    <FrostedBadge className="text-blue-600">Frosted Blue</FrostedBadge>
                    <FrostedBadge className="text-purple-600">Frosted Purple</FrostedBadge>
                    <FrostedBadge className="text-green-600">Frosted Green</FrostedBadge>
                    <FrostedBadge className="text-pink-600">Frosted Pink</FrostedBadge>
                </div>
            </div>

            {/* Holographic Badges */}
            <div className="badge-section">
                <h3 className="badge-section-title">Holographic Badges</h3>
                <div className="badge-group">
                    <HolographicBadge className="text-white">Holographic</HolographicBadge>
                    <HolographicBadge className="text-cyan-200">Cyber Holo</HolographicBadge>
                    <HolographicBadge className="text-purple-200">Magic Holo</HolographicBadge>
                    <HolographicBadge className="text-pink-200">Dream Holo</HolographicBadge>
                </div>
            </div>

            {/* Crystal Badges */}
            <div className="badge-section">
                <h3 className="badge-section-title">Crystal Badges</h3>
                <div className="badge-group">
                    <CrystalBadge className="text-gray-700">Crystal Clear</CrystalBadge>
                    <CrystalBadge className="text-blue-600">Ice Crystal</CrystalBadge>
                    <CrystalBadge className="text-purple-600">Amethyst</CrystalBadge>
                    <CrystalBadge className="text-green-600">Emerald</CrystalBadge>
                    <CrystalBadge className="text-pink-600">Rose Quartz</CrystalBadge>
                </div>
            </div>

            {/* Icon Badges with Glass Effects */}
            <div className="badge-section">
                <h3 className="badge-section-title">Icon Badges with Glass Effects</h3>
                <div className="badge-group">
                    <GlassBadge className="text-yellow-600 gap-1">
                        <StarIcon />
                        <span>Premium</span>
                    </GlassBadge>
                    <GlassBadge className="text-red-600 gap-1">
                        <HeartIcon />
                        <span>Favorite</span>
                    </GlassBadge>
                    <GlassBadge className="text-green-600 gap-1">
                        <ShieldIcon />
                        <span>Verified</span>
                    </GlassBadge>
                    <GlassBadge className="text-blue-600 gap-1">
                        <TrendingUpIcon />
                        <span>Trending</span>
                    </GlassBadge>
                    <GlassBadge className="text-purple-600 gap-1">
                        <ZapIcon />
                        <span>Fast</span>
                    </GlassBadge>
                    <GlassBadge className="text-orange-600 gap-1">
                        <CrownIcon />
                        <span>VIP</span>
                    </GlassBadge>
                </div>
            </div>

            {/* Metallic & Luxury Badges */}
            <div className="badge-section">
                <h3 className="badge-section-title">Metallic & Luxury Badges</h3>
                <div className="badge-group">
                    <MetallicBadge>Silver</MetallicBadge>
                    <GoldBadge>Gold Premium</GoldBadge>
                    <MetallicBadge className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 text-rose-900">
                        Rose Gold
                    </MetallicBadge>
                    <MetallicBadge className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 text-purple-900">
                        Platinum
                    </MetallicBadge>
                </div>
            </div>

            {/* Size Variations */}
            <div className="badge-section">
                <h3 className="badge-section-title">Size Variations with Glass Effects</h3>
                <div className="badge-group items-center">
                    <GlassBadge className="px-2 py-0.5 text-xs">Extra Small</GlassBadge>
                    <GlassBadge className="px-2.5 py-1 text-sm">Small</GlassBadge>
                    <GlassBadge className="px-3 py-1.5 text-sm">Medium</GlassBadge>
                    <GlassBadge className="px-4 py-2 text-base">Large</GlassBadge>
                    <GlassBadge className="px-5 py-2.5 text-lg">Extra Large</GlassBadge>
                </div>
            </div>

            {/* Interactive Glass Badges */}
            <div className="badge-section">
                <h3 className="badge-section-title">Interactive Glass Badges</h3>
                <div className="badge-group">
                    <GlassBadge
                        className="cursor-pointer hover:bg-white/30 active:scale-95"
                        onClick={() => alert('Glass badge clicked!')}
                    >
                        Clickable Glass
                    </GlassBadge>
                    <FrostedBadge
                        className="cursor-pointer hover:bg-white/20 active:scale-95"
                        onClick={() => alert('Frosted badge clicked!')}
                    >
                        Clickable Frosted
                    </FrostedBadge>
                    <CrystalBadge
                        className="cursor-pointer hover:rotate-3 active:scale-95"
                        onClick={() => alert('Crystal badge clicked!')}
                    >
                        Clickable Crystal
                    </CrystalBadge>
                </div>
            </div>
        </div>
    );
};

export default BadgeView;
