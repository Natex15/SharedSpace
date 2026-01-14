import './HomePage.css'
import { BorderedButton } from '../../components/BorderedButton.jsx'
import { BorderlessButton } from '../../components/BorderlessButton.jsx';
import { useState, useEffect } from 'react';
import { ArtPopup } from '../../components/ArtPopup';
import SampleImg from '../../assets/SharedSpaceLogo.svg'
import SampleImg2 from '../../assets/react.svg'
import LeaderboardPerson2 from '../../assets/LeaderboardPerson2.svg'
import LeaderboardPerson1 from '../../assets/Leaderboard_Person1.svg'
import PlaceDuTertre from '../../assets/arts/placedutertre.jpg'
import Sunday from '../../assets/arts/sunday.jpg'
import AugustRenoir from '../../assets/arts/augustrenoire.jpg'
import CafeNight from '../../assets/arts/cafenight.jpg'
import WaterLilies from '../../assets/arts/waterlilies.jpg'
import Almond from '../../assets/arts/almondtree.jpg';
import Girl from '../../assets/arts/girlwithpearlearrings.jpg';
import Lemo from '../../assets/arts/lemoulin.jpg';
import Nippon from '../../assets/arts/nippon.jpg';
import Sakura from '../../assets/arts/sakura.jpg';
import Ukiyo from '../../assets/arts/ukiyo.jpg';
import { StreakBadge } from '../../components/StreakBadge';
import { SharePopup } from '../../components/SharePopup';

export function HomePagePosted() {
    const [artWorks, setArtWorks] = useState([]);
    const [loadingArtworks, setLoadingArtworks] = useState(true);
    const [todaysPostedArt, setTodaysPostedArt] = useState(null);

    const artWallWorks = [
        { img: Almond, date: "1/3/2026", description: "Almond Tree" },
        { img: AugustRenoir, date: "1/4/2026", description: "August Renoir" },
        { img: CafeNight, date: "1/5/2026", description: "Cafe Night" },
        { img: Girl, date: "1/4/2026", description: "Girl with a Pearl Earring" },
        { img: Lemo, date: "1/5/2026", description: "Le Moulin de la Galette" },
        { img: Nippon, date: "1/4/2026", description: "Nippon" },
        { img: Sakura, date: "1/5/2026", description: "Sakura" },
        { img: Ukiyo, date: "1/4/2026", description: "Sunday Afternoon / Ukiyo" },
        { img: WaterLilies, date: "1/5/2026", description: "Water Lilies" }
    ];

    const friends_artWorks = [
        { img: WaterLilies, date: "1/1/2026", description: "Water Lilies", author: "Claude Monet" },
        { img: PlaceDuTertre, date: "1/4/2026", description: "Place du Tertre", author: "Artist" },
        { img: AugustRenoir, date: "1/6/2026", description: "August Renoir", author: "Artist" },
        { img: CafeNight, date: "1/4/2026", description: "Cafe Terrace at Night", author: "Artist" },
    ];

    const leaderboardData = [
        { rank: 1, name: "User One", points: 1250, avatar: SampleImg },
        { rank: 2, name: "User Two", points: 1100, avatar: SampleImg2 },
        { rank: 3, name: "User Three", points: 950, avatar: SampleImg },
    ];

    const [challenges, setChallenges] = useState([]);
    const [loadingChallenges, setLoadingChallenges] = useState(true);

    const randomIndex = Math.floor(Math.random() * friends_artWorks.length)
    const friendArt = friends_artWorks[randomIndex]

    const [activeArt, setActiveArt] = useState(null);
    const [showSharePopup, setShowSharePopup] = useState(false);

    const [streakCount, setStreakCount] = useState(0);
    const [loadingStreak, setLoadingStreak] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:3000/api/users/get-streak', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setStreakCount(data.streakCount);
                setLoadingStreak(false);
            })
            .catch(error => {
                console.error('Error fetching streak:', error);
                setLoadingStreak(false);
            });

        if (loadingStreak) {
            console.log('Loading streak...');
        }
    }, []);

    useEffect(() => {
        fetchChallenges();
        fetchUserArtworks();
    }, []);

    const fetchUserArtworks = async () => {
        try {
            const token = localStorage.getItem('token');

            console.log('HomePagePosted: Fetching user artworks...');
            console.log('HomePagePosted: Token:', token ? 'Present' : 'Missing');

            const response = await fetch('http://localhost:3000/api/artworks/my', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('HomePagePosted: Artworks response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('HomePagePosted: User artworks data:', data);
                console.log('HomePagePosted: Number of artworks:', data.length);

                // Sort by upload date (newest first)
                const sortedArtworks = data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

                // Set the latest artwork as today's posted art
                if (sortedArtworks.length > 0) {
                    setTodaysPostedArt({
                        img: sortedArtworks[0].imageURL,
                        date: new Date(sortedArtworks[0].uploadDate).toLocaleDateString(),
                        description: sortedArtworks[0].title,
                        author: "You"
                    });
                }

                // Take first 4 for recent works
                const recentWorks = sortedArtworks
                    .slice(0, 4)
                    .map(artwork => ({
                        img: artwork.imageURL,
                        date: new Date(artwork.uploadDate).toLocaleDateString(),
                        description: artwork.title,
                        author: "You"
                    }));

                console.log('HomePagePosted: Setting artworks to:', recentWorks);
                setArtWorks(recentWorks);
            } else {
                const errorText = await response.text();
                console.error('HomePagePosted: Failed to fetch artworks. Status:', response.status);
                console.error('HomePagePosted: Error response:', errorText);
                setArtWorks([]);
            }
        } catch (error) {
            console.error('HomePagePosted: Error fetching user artworks:', error);
            console.error('HomePagePosted: Error details:', error.message);
            setArtWorks([]);
        } finally {
            console.log('HomePagePosted: Setting loadingArtworks to false');
            setLoadingArtworks(false);
        }
    };

    const fetchChallenges = async () => {
        try {
            const token = localStorage.getItem('token');

            console.log('HomePagePosted: Fetching challenges...');
            const response = await fetch('http://localhost:3000/api/challenges/all', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('HomePagePosted: Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('HomePagePosted: Challenges data:', data);
                // Get the first 4 challenges
                setChallenges(data.slice(0, 4).map(challenge => ({
                    id: challenge._id,
                    name: `# ${challenge.title}`
                })));
            } else {
                const errorText = await response.text();
                console.error('HomePagePosted: API Error:', errorText);
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
            <div className='share posted-today-section'>
                {loadingArtworks ? (
                    <div className='posted-art-container'>
                        <p style={{ color: '#5C5A7B', fontSize: '1.5rem' }}>Loading...</p>
                    </div>
                ) : todaysPostedArt ? (
                    <div className='posted-art-container'>
                        <div className='posted-art-card-large'>
                            <img src={todaysPostedArt.img} alt={todaysPostedArt.description} className='posted-art-image' />
                        </div>
                        <StreakBadge streakCount={streakCount} />
                        <h2 className='posted-message'>You've shared your artwork today!</h2>
                        <BorderedButton
                            message='Share'
                            size='pink'
                            onClick={() => setShowSharePopup(true)}
                        />
                    </div>
                ) : (
                    <div className='posted-art-container'>
                        <h2 className='posted-message'>No artworks posted yet</h2>
                        <BorderedButton
                            message='Share Your First Artwork'
                            size='pink'
                            onClick={() => setShowSharePopup(true)}
                        />
                    </div>
                )}
            </div>

            <div className='works'>
                <ArtPopup
                    trigger={activeArt != null}
                    setTrigger={() => setActiveArt(null)}
                    img={activeArt?.img}
                    date={activeArt?.date}
                    desc={activeArt?.description}
                />

                <h1 className='worksText'>Your Recent Works</h1>
                {loadingArtworks ? (
                    <div className='art-grid'>
                        <p style={{ textAlign: 'center', color: '#5C5A7B', fontSize: '1.2rem', gridColumn: '1 / -1' }}>
                            Loading your artworks...
                        </p>
                    </div>
                ) : artWorks.length === 0 ? (
                    <div className='art-grid'>
                        <p style={{ textAlign: 'center', color: '#5C5A7B', fontSize: '1.2rem', gridColumn: '1 / -1' }}>
                            No recent artworks found.
                        </p>
                    </div>
                ) : (
                    <div className='art-grid'>
                        {artWorks.map((art, index) => (
                            <div key={index} className='art-card' onClick={() => setActiveArt(art)}>
                                <img src={art.img} alt={art.description} className='art-image'></img>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='friends'>
                <ArtPopup
                    trigger={activeArt != null}
                    setTrigger={() => setActiveArt(null)}
                    img={activeArt?.img}
                    date={activeArt?.date}
                    desc={activeArt?.description}
                />

                <div key={friendArt.author} className='friend-card' onClick={() => setActiveArt(friendArt)}>
                    <img src={friendArt.img} alt={friendArt.description} className='art-image'></img>
                </div>

                <div className='friends-text-area'>
                    <h1 className='friendsText'> Your friends shared their day!</h1>
                    <BorderlessButton
                        to='/friends-space'
                        message='Go to Friends Space'
                        type='lightbody'
                        className='friendsButton'>
                    </BorderlessButton>
                </div>
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
                    {artWallWorks.slice(0, 8).map((art, index) => (
                        <div key={index} className='artWallCard' onClick={() => setActiveArt(art)}>
                            <img src={art.img} alt={art.description} className='artWallImage'></img>
                        </div>
                    ))}
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
                                <div className='podium-card rank-2'>
                                    <div className='podium-rank'>2</div>
                                </div>
                            </div>

                            <div className='podium-item rank-1-position'>
                                <div className='podium-avatar-placeholder'>??</div>
                                <div className='podium-card rank-1'>
                                    <div className='podium-rank'>1</div>
                                </div>
                            </div>

                            <div className='podium-item rank-3-position'>
                                <img src={LeaderboardPerson1} alt="3rd place" className='podium-avatar-top' />
                                <div className='podium-card rank-3'>
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
                                <p style={{ color: '#5C5A7B', fontSize: '1rem' }}>Loading challenges...</p>
                            ) : challenges.length > 0 ? (
                                challenges.map((challenge) => (
                                    <button key={challenge.id} className='challenge-button'>
                                        {challenge.name}
                                    </button>
                                ))
                            ) : (
                                <p style={{ color: '#5C5A7B', fontSize: '1rem' }}>No challenges available</p>
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