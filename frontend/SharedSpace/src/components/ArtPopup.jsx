import './ArtPopup.css'
import { useState } from 'react';

export function ArtPopup({ trigger, setTrigger, img, date, desc }) {
    const [zoom, setZoom] = useState(100);

    if (!trigger) return null;

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 25, 50));
    };

    const handleClose = () => {
        setTrigger(false);
        setZoom(100); // Reset zoom when closing
    };

    return (
        <div className="popup-overlay" onClick={handleClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-left">
                    <button className="back-button" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Back</span>
                    </button>
                    <div className="image-container">
                        <div className="image-wrapper">
                            <img 
                                src={img} 
                                alt="Artwork" 
                                style={{ transform: `scale(${zoom / 100})` }}
                            />
                        </div>
                        <div className="zoom-controls">
                            <button className="zoom-btn" onClick={handleZoomOut} disabled={zoom <= 50}>-</button>
                            <span className="zoom-percent">{zoom}%</span>
                            <button className="zoom-btn" onClick={handleZoomIn} disabled={zoom >= 200}>+</button>
                        </div>
                    </div>
                </div>
                <div className="popup-right">
                    <button className="flag-button" onClick={handleClose}>{/*Needs to change */}
                        Flag
                        {/* {<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>} */}
                    </button>
                    <div className="info-content">
                        <div className="info-section">
                            <h3 className="info-label">Posted on</h3>
                            <p className="info-value">{date}</p>
                        </div>
                        <div className="info-section">
                            <h3 className="info-label">Description</h3>
                            <p className="info-description">{desc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}