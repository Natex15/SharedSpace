import './ChallengesPopup.css';
import { useState, useEffect } from 'react';
import { BorderedButton } from './BorderedButton';
import API_BASE_URL from '../apiConfig';

export function ChallengesPopup({ trigger, setTrigger, onSelectChallenge }) {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (trigger) {
            fetchChallenges();
        }
    }, [trigger]);

    const fetchChallenges = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            console.log('Fetching challenges from API...');
            const response = await fetch(`${API_BASE_URL}/api/challenges/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                throw new Error(`Failed to fetch challenges: ${response.status}`);
            }

            const data = await response.json();
            console.log('Challenges data:', data);
            setChallenges(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching challenges:', err);
            setError(`Failed to load challenges: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!trigger) {
        return null;
    }

    const handleClose = () => {
        setTrigger(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isActive = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        return now >= start && now <= end;
    };

    return (
        <div className="challenges-popup-overlay" onClick={handleClose}>
            <div className="challenges-popup-content" onClick={(e) => e.stopPropagation()}>

                <div className="popup-header">
                    <h2 className="popup-title">All Challenges</h2>
                </div>

                <div className="challenges-list">
                    {loading ? (
                        <p className="loading-text">Loading challenges...</p>
                    ) : error ? (
                        <p className="error-text">{error}</p>
                    ) : challenges.length === 0 ? (
                        <p className="no-challenges-text">No challenges available</p>
                    ) : (
                        challenges.map((challenge) => (
                            <div
                                key={challenge._id}
                                className={`challenge-item ${isActive(challenge.startDate, challenge.endDate) ? 'active' : 'inactive'}`}
                            >
                                <div className="challenge-header-row">
                                    <h3 className="challenge-title"># {challenge.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {isActive(challenge.startDate, challenge.endDate) && (
                                            <span className="active-badge">Active</span>
                                        )}
                                        {onSelectChallenge && (
                                            <BorderedButton
                                                message="Select"
                                                size="purple"
                                                onClick={() => {
                                                    onSelectChallenge(challenge._id);
                                                    setTrigger(false);
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>

                                <p className="challenge-description">{challenge.description}</p>

                                <div className="challenge-dates">
                                    <span className="date-label">Start:</span> {formatDate(challenge.startDate)}
                                    <span className="date-separator">•</span>
                                    <span className="date-label">End:</span> {formatDate(challenge.endDate)}
                                </div>

                                {challenge.criteriaTags && challenge.criteriaTags.length > 0 && (
                                    <div className="criteria-tags">
                                        {challenge.criteriaTags.map((tag, index) => (
                                            <span key={index} className="criteria-tag">
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="popup-actions">
                    <BorderedButton
                        message='Close'
                        size='purple'
                        onClick={handleClose}
                    />
                </div>
            </div>
        </div>
    );
}
