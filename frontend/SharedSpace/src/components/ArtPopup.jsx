import './ArtPopup.css'
import { useState } from 'react';
import { ReportPopup } from './ReportPopup';

function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const month = date.getMonth() + 1; // Months are 0-indexed
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

export function ArtPopup({ trigger, setTrigger, img, date, desc, author, authorImg }) {
    const [zoom, setZoom] = useState(100);
    const [report, setReport] = useState(false);

    if (!trigger) return null;

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 25, 50));
    };

    const handleClose = () => {
        setTrigger(false);
        setZoom(100);
    };

    return (
        <div className="popup-overlay" onClick={handleClose}>
            <ReportPopup trigger={report} setTrigger={setReport} />
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-left">
                    <button className="back-button" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                    <button className="flag-button" onClick={() => setReport(true)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 21V3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M4 4H15L12 9L15 14H4V4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="info-content">
                        {author && authorImg && (
                            <div className="author-section">
                                <img src={authorImg} alt={author} className="author-img" />
                                <div className="author-info">
                                    <span className="author-label">Shared by</span>
                                    <span className="author-name">{author}</span>
                                </div>
                            </div>
                        )}
                        <div className="info-section">
                            <h3 className="info-label">Posted on</h3>
                            <p className="info-value">{formatDate(date)}</p>
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