import React, { useState, useEffect } from 'react';
import { BorderedButton } from '../../components/BorderedButton';
import { BorderlessButton } from '../../components/BorderlessButton';
import { ConfirmVotePopup } from '../../components/ConfirmVotePopup';
import { ChallengesPopup } from '../../components/ChallengesPopup';
import './ChallengesPage.css';

/**
 * ChallengesPage Component
 * 
 * Displays the current weekly challenge details, links to friends' submissions,
 * and provides an interactive voting interface for shared artworks.
 */
export function ChallengesPage() {
    const [challenges, setChallenges] = useState([]);
    const [selectedChallengeId, setSelectedChallengeId] = useState("");
    const [currentVoteIndex, setCurrentVoteIndex] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showChallengesPopup, setShowChallengesPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [votingArtworks, setVotingArtworks] = useState([]);

    // Fetch active challenges
    useEffect(() => {
        const fetchChallenges = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3000/api/challenges/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const now = new Date();
                    setChallenges(data);
                    
                    // Find active challenges for default selection
                    const active = data.filter(c => new Date(c.startDate) <= now && new Date(c.endDate) >= now);
                    if (active.length > 0) {
                        setSelectedChallengeId(active[0]._id);
                    } else if (data.length > 0) {
                        setSelectedChallengeId(data[0]._id);
                    }
                }
            } catch (error) {
                console.error("Error fetching challenges:", error);
            }
        };
        fetchChallenges();
    }, []);

    // Fetch entries for selected challenge
    useEffect(() => {
        if (!selectedChallengeId) return;
        const fetchEntries = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:3000/api/votes/entries/${selectedChallengeId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setVotingArtworks(data.map(art => ({ id: art._id, img: art.imageURL, title: art.title })));
                    setCurrentVoteIndex(0);
                } else {
                    setVotingArtworks([]);
                }
            } catch (error) {
                console.error("Error fetching entries:", error);
                setVotingArtworks([]);
            }
        };
        fetchEntries();
    }, [selectedChallengeId]);

    const currentChallenge = challenges.find(c => c._id === selectedChallengeId);

    /**
     * Handles navigation to the previous artwork in the voting carousel.
     * Wraps around to the end of the list if currently at the start.
     */
    const handlePrev = () => {
        if (votingArtworks.length === 0) return;
        setErrorMessage(""); // Clear error message on navigation
        setCurrentVoteIndex((prev) => (prev === 0 ? votingArtworks.length - 1 : prev - 1));
        setSelectedCategories([]);
    };

    /**
     * Handles navigation to the next artwork in the voting carousel.
     * Wraps around to the start of the list if currently at the end.
     */
    const handleNext = () => {
        if (votingArtworks.length === 0) return;
        setErrorMessage(""); // Clear error message on navigation
        setCurrentVoteIndex((prev) => (prev === votingArtworks.length - 1 ? 0 : prev + 1));
        setSelectedCategories([]);
    };

    /**
     * Toggles the selection of a voting category tag.
     */
    const toggleCategory = (categoryName) => {
        setErrorMessage(""); // Clear error message on interaction
        const limit = 3; // limit of 3 categories to be selected when voting
        setSelectedCategories(prev => prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : (prev.length < limit ? [...prev, categoryName] : prev));
    };

    /**
     * Validates the vote submission.
     * Checks if there are artworks to vote on and if at least one category is selected.
     * Shows a confirmation popup if validation passes, otherwise sets an error message.
     */
    const handleVoteSubmit = () => {
        if (votingArtworks.length > 0 && selectedCategories.length > 0) {
            setShowConfirmPopup(true);
        } else if (votingArtworks.length === 0) {
            setErrorMessage("No artworks to vote on!");
        } else {
            setErrorMessage("Please select at least one category.");
        }
    };

    /**
     * Confirms the vote submission.
     * Removes the current artwork from the voting list 
     * resets category selections, and closes the confirmation popup.
     */
    const confirmVote = async () => {
        if (votingArtworks.length === 0) return;
        const currentArtwork = votingArtworks[currentVoteIndex];
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/api/votes/submit/${currentArtwork.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ selectedTags: selectedCategories })
            });

            if (response.ok) {
                const newArtworks = votingArtworks.filter((_, index) => index !== currentVoteIndex);
                setVotingArtworks(newArtworks);
                setSelectedCategories([]);
                setShowConfirmPopup(false);
                if (newArtworks.length === 0 || currentVoteIndex >= newArtworks.length) {
                    setCurrentVoteIndex(0);
                }
            } else {
                const data = await response.json();
                setErrorMessage(data.message || "Failed to submit vote.");
                setShowConfirmPopup(false);
            }
        } catch (error) {
            console.error("Vote submission error:", error);
            setErrorMessage("Error submitting vote.");
            setShowConfirmPopup(false);
        }
    };

    return (
        <div className="challenges-page">
            {/* Challenge Area */}
            <div className="challenge-main">
                {currentChallenge ? (
                    <>
                        <h1 className="main-title">This Week's Challenge</h1>

                        <div className="challenge-tag-container">
                            <div className="challenge-tag"># {currentChallenge.title}</div>
                        </div>

                        <div className="view-all-challenges-button">
                            <BorderlessButton
                                onClick={() => setShowChallengesPopup(true)}
                                message="View All Challenges"
                                type="darkbody"
                            />
                        </div>

                        <div className="challenge-content">
                            <div className="description-box">
                                <p>{currentChallenge.description}</p>
                            </div>

                            <div className="circles-container">
                                {currentChallenge.criteriaTags.map((tag, index) => (
                                    <div key={index} className="info-circle">
                                        <span>{tag.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <h1 className="main-title">Loading Challenges...</h1>
                )}

            </div>

            {/* Friends Challenge Area */}
            <div className="friends-challenge-area">
                <h2 className="friends-challenge-text">Your friends have joined the challenge!</h2>
                <BorderlessButton
                    to="/friends-space"
                    message="Go to Friends Space"
                    type="lightbody"
                />
            </div>

            {/* Voting Area */}
            <div className="voting-area">
                <h1 className="main-title">Voting</h1>
                <p className="voting-subtitle">Vote for your favorite shared artworks.</p>

                <div className="voting-content">
                    <div className="artwork-display">
                        {votingArtworks.length > 0 ? votingArtworks.map((artwork, index) => {
                            // Carousel Logic:
                            // Calculate the relative position ('diff') of each artwork to the 'currentVoteIndex'.
                            // This creates a circular list effect.
                            const len = votingArtworks.length;

                            // Ensures the result is positive [0, len-1].
                            let diff = (index - currentVoteIndex + len) % len;

                            // Adjust diff to be centered around 0. 
                            // If diff > len / 2, it means the item is "behind" the current item in the circle.
                            // e.g., len=6, current=0, index=5 -> diff=5. 5 > 3 -> diff becomes -1 (previous item).
                            if (diff > len / 2) diff -= len;

                            const isCurrent = diff === 0;
                            const isNext = diff === 1;
                            const isPrev = diff === -1;

                            let transform = 'translateX(0) scale(0.5)';
                            let zIndex = 0;
                            let opacity = 0;

                            // Apply styles based on relative position
                            if (isCurrent) {
                                transform = 'translateX(0) scale(1)';
                                zIndex = 10;
                                opacity = 1;
                            } else if (isNext) {
                                transform = 'translateX(120%) scale(0.8)';
                                zIndex = 5;
                                opacity = 0.6;
                            } else if (isPrev) {
                                transform = 'translateX(-120%) scale(0.8)';
                                zIndex = 5;
                                opacity = 0.6;
                            }

                            return (
                                <div
                                    key={artwork.id}
                                    className="artwork-card"
                                    onClick={() => {
                                        if (isNext) handleNext();
                                        if (isPrev) handlePrev();
                                    }}
                                    style={{
                                        transform,
                                        zIndex,
                                        opacity,
                                        cursor: isCurrent ? 'default' : 'pointer'
                                    }}
                                >
                                    <img src={artwork.img} alt={artwork.title} />
                                </div>
                            );
                        }) : (
                            <p className="no-artworks-message">There are no artworks to vote on!</p>
                        )}
                    </div>

                    <div className="voting-controls">
                        <button onClick={handlePrev} className="nav-arrow">&lt;</button>
                        <div onClick={handleVoteSubmit}>
                            <BorderedButton message="Submit" size="pink" />
                        </div>
                        <button onClick={handleNext} className="nav-arrow">&gt;</button>
                    </div>

                    {/* Error Message Display */}
                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}

                    <div className="voting-categories">
                        {currentChallenge && currentChallenge.criteriaTags.map((tag, index) => (
                            <div key={index} onClick={() => toggleCategory(tag.name)} className="category-button-wrapper" style={{ opacity: selectedCategories.includes(tag.name) ? 1 : 0.5 }}>
                                <BorderedButton message={tag.name} size="purple" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Confirm Vote Popup */}
            {showConfirmPopup && (
                <ConfirmVotePopup
                    onClose={() => setShowConfirmPopup(false)}
                    onConfirm={confirmVote}
                />
            )}

            {/* Challenges Popup */}
            <ChallengesPopup
                trigger={showChallengesPopup}
                setTrigger={setShowChallengesPopup}
                onSelectChallenge={setSelectedChallengeId}
            />
        </div>
    );
}
