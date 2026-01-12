import './HomePage.css'
import { BorderedButton } from '../../components/BorderedButton.jsx'
import { BorderlessButton } from '../../components/BorderlessButton.jsx';
import { useState } from 'react';
import { ArtPopup } from '../../components/ArtPopup';
import { SharePopup } from '../../components/SharePopup';
import Share from '../../assets/ShareYourDay.svg'
import SampleImg from '../../assets/SharedSpaceLogo.svg'
import SampleImg2 from '../../assets/react.svg'
import PlaceDuTertre from '../../assets/arts/placedutertre.jpg'
import AugustRenoir from '../../assets/arts/augustrenoire.jpg'
import CafeNight from '../../assets/arts/cafenight.jpg'
import WaterLilies from '../../assets/arts/waterlilies.jpg'
import Almond from '../../assets/arts/almondtree.jpg';
import Girl from '../../assets/arts/girlwithpearlearrings.jpg';
import Lemo from '../../assets/arts/lemoulin.jpg';
import Nippon from '../../assets/arts/nippon.jpg';
import Sakura from '../../assets/arts/sakura.jpg';
import Ukiyo from '../../assets/arts/ukiyo.jpg';

export function HomePage() {
    const artWorks = [
        { img: PlaceDuTertre, date: "1/1/2026", description: "Place du Tertre", author: "Nname" },
        { img: AugustRenoir, date: "1/4/2026", description: "August Renoir", author: "Nname" },
        { img: CafeNight, date: "1/6/2026", description: "Cafe Terrace at Night", author: "Cname" },
        { img: WaterLilies, date: "1/4/2026", description: "Water Lilies", author: "Dname" },
    ];

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
    //note: need isort based on date
    const friends_artWorks = [
        { img: Almond, date: "1/3/2026", description: "Almond Tree", author: "Vincent van Gogh" },
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

    const challenges = [
        { id: 1, name: "# 10-MinuteSketch" },
        { id: 2, name: "# NoErasing" },
        { id: 3, name: "# PixelArt" },
        { id: 4, name: "# OneColor" },
    ];

    const friendArt = friends_artWorks[0] // Specifically set to Almond Tree

    const [activeArt, setActiveArt] = useState(null);
    const [showSharePopup, setShowSharePopup] = useState(false);


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
                    img={activeArt?.img}
                    date={activeArt?.date}
                    desc={activeArt?.description}
                />

                <h1 className='worksText'>Your Recent Works</h1>
                <div className='art-grid'>
                    {artWorks.map((art, index) => (
                        <div key={index} className='art-card' onClick={() => setActiveArt(art)}>
                            <img src={art.img} alt={art.description} className='art-image'></img>
                        </div>
                    ))}
                </div>
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
                                <img src={SampleImg} alt="2nd place" className='podium-avatar-top' />
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
                                <img src={SampleImg2} alt="3rd place" className='podium-avatar-top' />
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
                            {challenges.map((challenge) => (
                                <button key={challenge.id} className='challenge-button'>
                                    {challenge.name}
                                </button>
                            ))}
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
