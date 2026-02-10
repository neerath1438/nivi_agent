import * as Loaders from "./EnhancedLoaders";
import "./LoaderView.css";

const LoaderView = () => {
    const loaderItems = [
        { name: "Running Hamster", component: <Loaders.HamsterLoader /> },
        { name: "Classic Spin", component: <Loaders.ClassicSpin /> },
        { name: "Dots Bounce", component: <Loaders.DotsBounce /> },
        { name: "Pulse", component: <Loaders.PulseLoader /> },
        { name: "Ring", component: <Loaders.RingLoader /> },
        { name: "Bars", component: <Loaders.BarsLoader /> },
        { name: "Dual Ring", component: <Loaders.DualRingLoader /> },
        { name: "Ripple", component: <Loaders.RippleLoader /> },
        { name: "Ping Dots", component: <Loaders.PingDotsLoader /> },
        { name: "Grid", component: <Loaders.GridLoader /> },
        { name: "Three Dots Scale", component: <Loaders.ThreeDotsScale /> },
        { name: "Square Spin", component: <Loaders.SquareSpin /> },
        { name: "Rotating Dots", component: <Loaders.RotatingDots /> },
        { name: "Wave", component: <Loaders.WaveLoader /> },
        { name: "Folding Cube", component: <Loaders.FoldingCube /> },
        { name: "Heart Beat", component: <Loaders.HeartBeat /> },
        { name: "Clock", component: <Loaders.ClockLoader /> },
        { name: "Hourglass", component: <Loaders.Hourglass /> },
        { name: "12 Dots Scale Rotate", component: <Loaders.TwelveDotsScaleRotate /> },
        { name: "180 Ring with BG", component: <Loaders.Ring180WithBG /> },
        { name: "180 Ring", component: <Loaders.Ring180 /> },
        { name: "270 Ring with BG", component: <Loaders.Ring270WithBG /> },
        { name: "270 Ring", component: <Loaders.Ring270 /> },
        { name: "3 Dots Bounce", component: <Loaders.ThreeDotsBounceSMIL /> },
        { name: "3 Dots Fade", component: <Loaders.ThreeDotsFadeSMIL /> },
        { name: "Infinite Dots Move", component: <Loaders.InfiniteDotsMove /> },
        { name: "Rotating Dots Pair", component: <Loaders.RotatingDotsPair /> },
        { name: "3 Dots Bouncing", component: <Loaders.BouncingDotsTrio /> },
        { name: "3 Dots Scaling", component: <Loaders.ScalingDotsTrio /> },
        { name: "Blocks Wave", component: <Loaders.BlocksWave /> },
        { name: "Bouncing Ball", component: <Loaders.BouncingBall /> },
        { name: "Tail Spin Advanced", component: <Loaders.TailSpinExact /> },
        { name: "Linear Gradient Spin", component: <Loaders.LinearSpinExact /> },
        { name: "Blocks Shuffle", component: <Loaders.BlocksShuffle /> },
        { name: "Line Wave", component: <Loaders.LineWave /> },
        { name: "Pulsing Grid", component: <Loaders.PulsingGrid /> },
        { name: "Wifi Signal", component: <Loaders.WifiSignal /> },
        { name: "Tadpole Spin", component: <Loaders.TadpoleSpinBatch4 /> },
        { name: "Ripple Effect", component: <Loaders.RipplePings /> },
        { name: "Square Chase", component: <Loaders.SquareChase /> },
        { name: "Clockwise Fade", component: <Loaders.ClockwiseFade /> },
        { name: "Bouncing Dots", component: <Loaders.BouncingDotsBatch4 /> },
        { name: "Flower Spin", component: <Loaders.FlowerSpin /> }
    ];

    return (
        <div className="loader-view-container">
            <div className="loader-grid">
                {loaderItems.map((item, index) => (
                    <div key={index} className="loader-card">
                        <div className="loader-card-content">
                            {item.component}
                        </div>
                        <div className="loader-card-footer">
                            <span className="loader-name">{item.name}</span>
                            <button className="copy-code-btn" onClick={() => {
                                // Simple feedback, could be expanded to actual clipboard functionality
                                alert(`Component: ${item.name} code ready to copy!`);
                            }}>
                                Copy Code
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoaderView;
