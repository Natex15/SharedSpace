import SampleImg from '../../assets/SharedSpaceLogo.svg'
import SampleImg2 from '../../assets/react.svg'
import { ArtPopup } from '../../components/ArtPopup';
import { useState, useEffect } from 'react';
import './FriendsSpacePage.css'
import Almond from '../../assets/arts/almondtree.jpg';
import August from '../../assets/arts/augustrenoire.jpg';
import Cafe from '../../assets/arts/cafenight.jpg';
import Girl from '../../assets/arts/girlwithpearlearrings.jpg';
import Lemo from '../../assets/arts/lemoulin.jpg';
import Nippon from '../../assets/arts/nippon.jpg';
import Sakura from '../../assets/arts/sakura.jpg';
import Sunday from '../../assets/arts/ukiyo.jpg';
import WaterLily from '../../assets/arts/waterlilies.jpg'
import { BorderlessButton } from '../../components/BorderlessButton.jsx';
import API_BASE_URL from '../../apiConfig';

export function FriendsSpacePage() {
    /**
     * Array of artwork objects with author information
     * @type {Array<{img: string, date: string, description: string, author: string, authorPic: string}>}
     */

    const [selectedArt, setSelectedArt] = useState(null); // For popup
    const [friendsArtworks, setFriendsArtworks] = useState([]); // For fetched data
    const [loadingFriendsArtworks, setLoadingFriendsArtworks] = useState(true);

    useEffect(() => {
        fetchFriendsArtworks();
    }, []);

    const fetchFriendsArtworks = async () => {
        try {
            const token = localStorage.getItem('token');

            console.log('HomePage: Fetching friends artworks...');
            const response = await fetch(`${API_BASE_URL}/api/artworks/friends`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('HomePage: Friends artworks response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('HomePage: Friends artworks data:', data);
                setFriendsArtworks(data);
            } else {
                const errorText = await response.text();
                console.error('HomePage: Failed to fetch friends artworks. Status:', response.status);
                console.error('HomePage: Error response:', errorText);
                setFriendsArtworks([]);
            }
        } catch (error) {
            console.error('HomePage: Error fetching friends artworks:', error);
            setFriendsArtworks([]);
        } finally {
            setLoadingFriendsArtworks(false);
        }
    };

    /**
     * Current page index (0-based)
     * @type {number}
     */
    const [currentPage, setCurrentPage] = useState(0);

    /** Number of artworks to display per page */
    const itemsPerPage = 4;

    /** Total number of pages based on artwork count */
    const totalPages = Math.ceil(friendsArtworks.length / itemsPerPage);

    /**
     * Gets the artworks to display on the current page
     * @returns {Array} Slice of artworks for current page
     */
    const getCurrentPageArtworks = () => {
        const startIndex = currentPage * itemsPerPage;
        return friendsArtworks.slice(startIndex, startIndex + itemsPerPage);
    };

    /**
     * Navigate to previous page
     * Prevents going below page 0
     */
    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    /**
     * Navigate to next page
     * Prevents exceeding total pages
     */
    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    return (
        <div className="fs-container">
            {/* Popup modal for artwork details with author info */}
            <ArtPopup
                trigger={selectedArt != null}
                setTrigger={() => setSelectedArt(null)}
                img={selectedArt?.imageURL || selectedArt?.img}
                date={selectedArt?.uploadDate || selectedArt?.date}
                desc={selectedArt?.description || selectedArt?.title}
                author={selectedArt?.ownerID?.username || selectedArt?.author}
                authorImg={selectedArt?.ownerID?.profilePicture || selectedArt?.authorImg}
                id={selectedArt?._id || selectedArt?.id}
            />
            {loadingFriendsArtworks ? (
                <div className='fs-content-wrapper'>
                    <h1 className='fs-title'>Loading friends' artworks...</h1>
                </div>
            ) : friendsArtworks.length > 0 ? (
                <div className="fs-content-wrapper">
                    <h1 className="fs-title">Friends</h1>
                    <p className="fs-subtitle">See what your friends have been sharing lately</p>

                    {/* Grid of current page artworks */}
                    <div className="fs-artworks-grid">
                        {getCurrentPageArtworks().map((art, index) => (
                            <div
                                key={index}
                                className="fs-artwork-card"
                                onClick={() => setSelectedArt(art)}
                            >
                                <img
                                    src={art.imageURL}
                                    alt={art.description}
                                    className="fs-artwork-image"
                                />
                                {/* Author profile picture overlay */}
                                <div className="fs-artwork-avatar">
                                    <img
                                        src={art.ownerID?.profilePicture || "/defaultAvatar.png"}
                                        className='fs-avatar-circle'
                                        alt={art.ownerID?.username}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination controls */}
                    <div className="fs-navigation">
                        {/* Previous button */}
                        <button
                            className="fs-nav-button"
                            onClick={handlePrevious}
                            disabled={currentPage === 0}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* Page indicator dots */}
                        <div className="fs-page-indicators">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`fs-page-dot ${index === currentPage ? 'fs-active' : ''}`}
                                    onClick={() => setCurrentPage(index)}
                                />
                            ))}
                        </div>

                        {/* Next button */}
                        <button
                            className="fs-nav-button"
                            onClick={handleNext}
                            disabled={currentPage === totalPages - 1}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (
                <div className='fs-content-wrapper'>
                    <h1 className='fs-title'>You don’t have any friends here yet</h1>
                    <p className='fs-subtitle'>
                        Start connecting to see them appear ✨
                    </p>
                </div>
            )}
        </div>
    );
}