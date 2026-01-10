import './ReportPopup.css'

export function ReportPopup({ trigger, setTrigger }) {
    if (!trigger) return null;

    const handleClose = () => {
        setTrigger(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your submit logic here
        console.log('Report submitted');
        handleClose();
    };

    return (
        <div className="report-popup-overlay" onClick={handleClose}>
            <div className="report-popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={handleClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                
                <h2 className="report-title">Report Content</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea 
                            id="description"
                            className="description-textarea"
                            rows="6"
                            placeholder="Enter your report description..."
                            required
                        />
                    </div>
                    
                    <div className="button-group">
                        <button type="submit" className="submit-button">
                            Submit
                        </button>
                        <button type="button" className="close-button-bottom" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}