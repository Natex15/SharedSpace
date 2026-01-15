import './HomePage.css'
import { BorderedButton } from '../../components/BorderedButton.jsx'
import { BorderlessButton } from '../../components/BorderlessButton.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArtPopup } from '../../components/ArtPopup';
import { SharePopup } from '../../components/SharePopup';
import API_BASE_URL from '../../apiConfig';
import Share from '../../assets/ShareYourDay.svg'
import SampleImg from '../../assets/SharedSpaceLogo.svg'
import SampleImg2 from '../../assets/react.svg'
import LeaderboardPerson2 from '../../assets/LeaderboardPerson2.svg'
import LeaderboardPerson1 from '../../assets/Leaderboard_Person1.svg'

export function HomePage() {
    const [artWorks, setArtWorks] = useState([]);
    const [loadingArtworks, setLoadingArtworks] = useState(true);

    const [artWallPreviewWorks, setArtWallPreviewWorks] = useState([]);
    const [loadingArtWall, setLoadingArtWall] = useState(true);

    const [friendsArtworks, setFriendsArtworks] = useState([]);
    const [loadingFriendsArtworks, setLoadingFriendsArtworks] = useState(true);

    const leaderboardData = [
        { rank: 1, name: "User One", points: 1250, avatar: SampleImg },
        { rank: 2, name: "User Two", points: 1100, avatar: SampleImg2 },
        { rank: 3, name: "User Three", points: 950, avatar: SampleImg },
    ];

    const [challenges, setChallenges] = useState([]);
    const [loadingChallenges, setLoadingChallenges] = useState(true);

    const [activeArt, setActiveArt] = useState(null);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchChallenges();
        fetchUserArtworks();
        fetchFriendsArtworks();
        fetchArtWallWorks();
    }, []);

    const fetchArtWallWorks = async () => {
        try {
            console.log('HomePage: Fetching art wall preview...');
            const response = await fetch(`${API_BASE_URL}/api/artworks/all`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('HomePage: Art wall data:', data);
                const sortedArtworks = data
                    .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
                    .slice(0, 8);
                setArtWallPreviewWorks(sortedArtworks);
            } else {
                console.error('HomePage: Failed to fetch art wall works');
            }
        } catch (error) {
            console.error('HomePage: Error fetching art wall works:', error);
        } finally {
            setLoadingArtWall(false);
        }
    };

    const fetchUserArtworks = async () => {
        try {
            const token = localStorage.getItem('token');

            console.log('HomePage: Fetching user artworks...');
            console.log('HomePage: Token:', token ? 'Present' : 'Missing');

            const response = await fetch(`${API_BASE_URL}/api/artworks/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('HomePage: Artworks response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('HomePage: User artworks data:', data);
                console.log('HomePage: Number of artworks:', data.length);

                // Sort by upload date (newest first) and take first 4
                const sortedArtworks = data
                    .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
                    .slice(0, 4)
                    .map(artwork => ({
                        img: artwork.imageURL,
                        date: new Date(artwork.uploadDate).toLocaleDateString(),
                        description: artwork.title,
                        author: "You"
                    }));

                console.log('HomePage: Setting artworks to:', sortedArtworks);
                setArtWorks(sortedArtworks);
            } else {
                const errorText = await response.text();
                console.error('HomePage: Failed to fetch artworks. Status:', response.status);
                console.error('HomePage: Error response:', errorText);
                setArtWorks([]);
            }
        } catch (error) {
            console.error('HomePage: Error fetching user artworks:', error);
            console.error('HomePage: Error details:', error.message);
            setArtWorks([]);
        } finally {
            console.log('HomePage: Setting loadingArtworks to false');
            setLoadingArtworks(false);
        }
    };

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

    const fetchChallenges = async () => {
        try {
            const token = localStorage.getItem('token');

            console.log('HomePage: Fetching challenges...');
            const response = await fetch(`${API_BASE_URL}/api/challenges/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('HomePage: Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('HomePage: Challenges data:', data);
                // Get the first 4 challenges
                setChallenges(data.slice(0, 4).map(challenge => ({
                    id: challenge._id,
                    name: `# ${challenge.title}`
                })));
            } else {
                const errorText = await response.text();
                console.error('HomePage: API Error:', errorText);
                // Fallback to default challenges if fetch fails
                setChallenges([
                    { id: 1, name: "# 10-MinuteSketch" },
                    { id: 2, name: "# NoErasing" },
                    { id: 3, name: "# PixelArt" },
                    { id: 4, name: "# OneColor" },
                ]);
            }
        } catch (error) {
            console.error('Error fetching challenges:', error);
            // Fallback to default challenges
            setChallenges([
                { id: 1, name: "# 10-MinuteSketch" },
                { id: 2, name: "# NoErasing" },
                { id: 3, name: "# PixelArt" },
                { id: 4, name: "# OneColor" },
            ]);
        } finally {
            setLoadingChallenges(false);
        }
    };



    return (
        <div className='home'>
            <div className='share'>
                <div className='logo2container'>
                    <img src={Share} className='Logo2' />
                </div>
                <BorderedButton message='Share' size='pink' onClick={() => setShowSharePopup(true)}
                />
            </div>

            <div className='works'>
                <ArtPopup
                    trigger={activeArt != null}
                    setTrigger={() => setActiveArt(null)}
                    img={activeArt?.img || activeArt?.imageURL}
                    date={activeArt?.date || activeArt?.uploadDate}
                    desc={activeArt?.description || activeArt?.title}
                    author={activeArt?.author || activeArt?.ownerID?.username}
                    authorImg={activeArt?.authorImg || activeArt?.ownerID?.profilePicture}
                />

                {loadingArtworks ? (
                    <>
                        <h1 className='worksText'>Your Recent Works</h1>
                        <div className='art-grid'>
                            <p style={{ textAlign: 'center', color: '#5C5A7B', fontSize: '1.2rem', gridColumn: '1 / -1' }}>
                                Loading your artworks...
                            </p>
                        </div>
                    </>
                ) : artWorks.length === 0 ? (
                    <div className='works-text-area'>
                        <h1 className='worksText2'>Share Your Art with the World!</h1>
                        <p className='works-fallback-message'>
                            You haven't shared any artworks yet. Start your creative journey today and inspire others with your art!
                        </p>
                        <BorderlessButton
                            onClick={() => setShowSharePopup(true)}
                            message='Share Your First Artwork'
                            type='darkbody'
                            className='friendsButton'>
                        </BorderlessButton>
                    </div>
                ) : (
                    <>
                        <h1 className='worksText'>Your Recent Works</h1>
                        <div className='art-grid'>
                            {artWorks.map((art, index) => (
                                <div key={index} className='art-card' onClick={() => setActiveArt(art)}>
                                    <img src={art.img} alt={art.description} className='art-image'></img>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className='friends'>
                <ArtPopup
                    trigger={activeArt != null}
                    setTrigger={() => setActiveArt(null)}
                    img={activeArt?.img || activeArt?.imageURL}
                    date={activeArt?.date || activeArt?.uploadDate}
                    desc={activeArt?.description || activeArt?.title}
                    author={activeArt?.author || activeArt?.ownerID?.username}
                    authorImg={activeArt?.authorImg || activeArt?.ownerID?.profilePicture}
                />

                {loadingFriendsArtworks ? (
                    <div className='friends-text-area'>
                        <h1 className='friendsText'>Loading friends' artworks...</h1>
                    </div>
                ) : friendsArtworks.length > 0 ? (
                    <>
                        {(() => {
                            const randomIndex = Math.floor(Math.random() * friendsArtworks.length);
                            const friendArt = friendsArtworks[randomIndex];
                            return (
                                <>
                                    <div className='friend-card' onClick={() => navigate('/friends-space')}>
                                        <img src={friendArt.imageURL} alt={friendArt.title} className='art-image'></img>
                                    </div>

                                    <div className='friends-text-area'>
                                        <h1 className='friendsText'>Your friends shared their day!</h1>
                                        <BorderlessButton
                                            to='/friends-space'
                                            message='Go to Friends Space'
                                            type='lightbody'
                                            className='friendsButton'>
                                        </BorderlessButton>
                                    </div>
                                </>
                            );
                        })()}
                    </>
                ) : (
                    <div className='friends-text-area'>
                        <h1 className='friendsText2'>It's quiet so far today!</h1>
                        <p className='friends-fallback-message'>
                            Add more friends and encourage them to share their art
                        </p>
                        <BorderlessButton
                            to='/friends-space'
                            message='Find Friends'
                            type='lightbody'
                            className='friendsButton'>
                        </BorderlessButton>
                    </div>
                )}

            </div>

            <div className='artWallPreview'>
                <div className='artWallHeader'>
                    <h1 className='artWallText'>Explore the Art Wall</h1>
                    <BorderlessButton
                        to='/art-wall'
                        message='View the Art Wall'
                        type='darkbody'
                        className='artWallButton'
                    />
                </div>
                <div className='artWallGrid'>
                    {loadingArtWall ? (
                        <p style={{ textAlign: 'center', color: '#5C5A7B', fontSize: '1.2rem', gridColumn: '1 / -1' }}>
                            Loading art wall...
                        </p>
                    ) : (
                        artWallPreviewWorks.map((art, index) => (
                            <div key={index} className='artWallCard' onClick={() => navigate('/art-wall')}>
                                <img src={art.img} alt={art.description} className='artWallImage'></img>
                            </div>
                        )))}
                </div>
            </div>

            <div className='bottom'>
                <div className='leaderboard'>
                    <div className='leaderboardInner'>
                        <h1 className='leaderboardText'>Who's at the top?</h1>
                        <BorderlessButton
                            to='/leaderboard'
                            message='View the Leaderboard'
                            type='lightbody'
                            className='leaderboard-button'
                        />
                        <div className='podium-container'>
                            <div className='podium-item rank-2-position'>
                                <img src={LeaderboardPerson2} alt="2nd place" className='podium-avatar-top' />
                                <div className='podium-card rank-2' onClick={() => navigate('/leaderboard')}>
                                    <div className='podium-rank'>2</div>
                                </div>
                            </div>

                            <div className='podium-item rank-1-position'>
                                <div className='podium-avatar-placeholder'>??</div>
                                <div className='podium-card rank-1' onClick={() => navigate('/leaderboard')}>
                                    <div className='podium-rank'>1</div>
                                </div>
                            </div>

                            <div className='podium-item rank-3-position'>
                                <img src={LeaderboardPerson1} alt="3rd place" className='podium-avatar-top' />
                                <div className='podium-card rank-3' onClick={() => navigate('/leaderboard')}>
                                    <div className='podium-rank'>3</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='challenge'>
                    <div className='challengeInner'>
                        <h1 className='challengeText'>Up for a challenge?</h1>
                        <BorderlessButton
                            to='/challenges'
                            message='Go to Challenges'
                            type='darkbody'
                            className='challenge-button-link'
                        />
                        <div className='challenge-container'>
                            {loadingChallenges ? (
                                <p style={{ color: '#FAF3EB', fontSize: '1rem' }}>Loading challenges...</p>
                            ) : challenges.length > 0 ? (
                                challenges.map((challenge) => (
                                    <button key={challenge.id} className='challenge-button' onClick={() => navigate('/challenges')}>
                                        {challenge.name}
                                    </button>
                                ))
                            ) : (
                                <p style={{ color: '#FAF3EB', fontSize: '1rem' }}>No challenges available</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <SharePopup
                trigger={showSharePopup}
                setTrigger={setShowSharePopup}
            />
        </div>
    )
}
