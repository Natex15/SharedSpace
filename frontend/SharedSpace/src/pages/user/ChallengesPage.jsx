import React, { useState } from 'react';
import { BorderedButton } from '../../components/BorderedButton';
import { BorderlessButton } from '../../components/BorderlessButton';
import { ConfirmVotePopup } from '../../components/ConfirmVotePopup';
import './ChallengesPage.css';
import Almond from '../../assets/arts/almondtree.jpg';
import August from '../../assets/arts/augustrenoire.jpg';
import Cafe from '../../assets/arts/cafenight.jpg';
import Girl from '../../assets/arts/girlwithpearlearrings.jpg';
import Lemo from '../../assets/arts/lemoulin.jpg';
import Nippon from '../../assets/arts/nippon.jpg';

/**
 * ChallengesPage Component
 * 
 * Displays the current weekly challenge details, links to friends' submissions,
 * and provides an interactive voting interface for shared artworks.
 */
export function ChallengesPage() {
    const challenge = {
        title: "10-MinuteSketch",
        description: "The #10-MinuteSketch challenge lets participants create a sketch in just 10 minutes, showcasing creativity, quick thinking, and originality under time pressure.",
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        criteriaTags: [
            { name: "Originality" },
            { name: "Impact" },
            { name: "Relevance"  }
        ]
    };

    const [currentVoteIndex, setCurrentVoteIndex] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [votingArtworks, setVotingArtworks] = useState([
        { id: 1, img: Almond, title: "Artwork 1" },
        { id: 2, img: August, title: "Artwork 2" },
        { id: 3, img: Cafe, title: "Artwork 3" },
        { id: 4, img: Girl, title: "Artwork 4" },
        { id: 5, img: Lemo, title: "Artwork 5" },
        { id: 6, img: Nippon, title: "Artwork 6" },
    ]);

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
     * Enforces a maximum limit of 3 selected categories. (tentative rahh)
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
     * Removes the current artwork from the voting list (simulating a submitted vote, tbc),
     * resets category selections, and closes the confirmation popup.
     */
    const confirmVote = () => {
        const newArtworks = votingArtworks.filter((_, index) => index !== currentVoteIndex);
        setVotingArtworks(newArtworks);
        setSelectedCategories([]);
        setShowConfirmPopup(false);
        if (newArtworks.length === 0 || currentVoteIndex >= newArtworks.length) {
            setCurrentVoteIndex(0);
        }
    };

    return (
        <div className="challenges-page">
            {/* Challenge Area */}
            <div className="challenge-main">
                <h1 className="main-title">This Week's Challenge</h1>
                
                <div className="challenge-tag-container">
                    <div className="challenge-tag"># {challenge.title}</div>
                </div>

                <div className="challenge-content">
                    <div className="description-box">
                        <p>
                            {challenge.description}
                        </p>
                    </div>
                    
                    <div className="circles-container">
                        {challenge.criteriaTags.map((tag, index) => (
                            <div key={index} className="info-circle">
                                <span>{tag.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
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
                            <p className="no-artworks-message">You have voted on all artworks!</p>
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
                        {challenge.criteriaTags.map((tag, index) => (
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
        </div>
    );
}
