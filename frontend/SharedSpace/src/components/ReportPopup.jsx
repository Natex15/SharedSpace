import './ReportPopup.css';
import { useState } from 'react';
import API_BASE_URL from '../apiConfig';
import { toast } from 'react-hot-toast';

export function ReportPopup({ trigger, setTrigger, artworkID }) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!trigger) return null;

    const handleClose = () => {
        setReason('');
        setTrigger(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason.trim()) {
            toast.error('Please provide a reason for reporting.');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/reports/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    artworkID,
                    reason
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Report submitted successfully. Our moderators will review it.');
                handleClose();
            } else {
                toast.error(data.message || 'Failed to submit report.');
            }
        } catch (err) {
            console.error('Report Error:', err);
            toast.error('An error occurred while submitting the report.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="report-popup-overlay" onClick={handleClose}>
            <div className="report-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="report-header">
                    <div className="report-icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 21V3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M4 4H15L12 9L15 14H4V4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="report-title-group">
                        <h2 className="report-title">Report Content</h2>
                        <p className="report-subtitle">Help us maintain a safe community</p>
                    </div>
                    <button className="close-button" onClick={handleClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="report-form">
                    <div className="form-group">
                        <label htmlFor="reason" className="form-label">Why are you reporting this content?</label>
                        <textarea
                            id="reason"
                            className="reason-textarea"
                            rows="5"
                            placeholder="Please describe the issue in detail..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </div>

                    <div className="report-footer">
                        <button type="button" className="cancel-button" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-report-button" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="loader"></span>
                                    Submitting...
                                </>
                            ) : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}