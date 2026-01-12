import './SignOutPopup.css'
import { Link } from 'react-router-dom'

export function SignOutPopup({ onClose, onLogout }) {
    return (
        <div className="sign-out-popup-card">
            <div className = "sign-out-popup">
                <div className = "sign-out-popup-header">
                    Are you sure you want to sign out?
                </div>

                <div className = "sign-out-popup-buttons">
                    <button className="sign-out-no-button" onClick={onClose}>
                        Go Back
                    </button>

                    <Link to="/login" className="sign-out-yes-button" onClick={onLogout}>
                        Sign Out
                    </Link>
                </div>   
            </div>
        </div>
    )
}