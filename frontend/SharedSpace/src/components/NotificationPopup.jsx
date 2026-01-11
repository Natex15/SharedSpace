import './NotificationPopup.css'


export function NotificationPopup({ onClose }) {
    return (
        <div className="notification-popup-card">
            <div className="notification-popup">
                <div className="notification-popup-top">
                    <div className="notification-popup-header">
                        NOTIFICATIONS
                    </div>

                    <button className="notification-close-button" onClick={onClose}>Close</button>
                </div>

                <ul className="notification-popup-list">
                    <li>New friend request</li>
                    <li>Your artwork got 5 likes</li>
                    <li>Leaderboard updated</li>
                </ul>
            </div>
        </div>
    )
}