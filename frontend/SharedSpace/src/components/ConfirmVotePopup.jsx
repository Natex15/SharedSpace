import './ConfirmVotePopup.css';

/**
 * ConfirmVotePopup Component
 * 
 * A modal popup that asks the user to confirm their vote submission.
 * 
 * Props:
 * - onClose - Callback function to close the popup without confirming
 * - props.onConfirm - Callback function to confirm the vote
 */

import './ConfirmVotePopup.css';

export function ConfirmVotePopup({ onClose, onConfirm }) {
    return (
        <div className="vote-popup-overlay">
            <div className="vote-popup">
                <h2>Confirm Vote</h2>
                <p>Are you sure you want to submit your vote for this artwork?</p>
                <div className="vote-popup-buttons">
                    <button className="popup-button popup-cancel" onClick={onClose}>Cancel</button>
                    <button className="popup-button popup-confirm" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
}
