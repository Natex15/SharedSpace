import './HomePage.css'
import { BorderedButton } from '../../components/BorderedButton.jsx'
import { BorderlessButton } from '../../components/BorderlessButton.jsx';   
import { useState } from 'react';
import { ArtPopup } from '../../components/ArtPopup';
import Share from '../../assets/ShareYourDay.svg'
import SampleImg from '../../assets/SharedSpaceLogo.svg'
import SampleImg2 from '../../assets/react.svg'

export function HomePage(){
     const artWorks = [
        { img: SampleImg, date: "1/1/2026", description: "lorem ipsum dolor" ,author: "Nname"},
        { img: SampleImg2, date: "1/4/2026", description: "lorem ipsum dolor" ,author: "Nname"},
        { img: SampleImg2, date: "1/6/2026", description: "lorem ipsum dolor" ,author: "Cname"},
        { img: SampleImg, date: "1/4/2026", description: "lorem ipsum dolor" ,author: "Dname"},
    ];
    //note: need isort based on date
    const friends_artWorks = [
        { img: SampleImg, date: "1/1/2026", description: "lorem ipsum dolor" ,author: "Nname"},
        { img: SampleImg2, date: "1/4/2026", description: "lorem ipsum dolor" ,author: "Nname"},
        { img: SampleImg2, date: "1/6/2026", description: "lorem ipsum dolor" ,author: "Cname"},
        { img: SampleImg, date: "1/4/2026", description: "lorem ipsum dolor" ,author: "Dname"},
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

    const randomIndex = Math.floor(Math.random() * friends_artWorks.length)

    const friendArt = friends_artWorks[randomIndex]

    const [activeArt, setActiveArt] = useState(null);


    return(
        <div className = 'home'>
            <div className='share'>
                <div className='logo2container'>
                <img src={Share} className = 'Logo2'/>
                </div>  
                <BorderedButton className='shareButton' message={'Share'} size='pink'/>
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
                    {artWorks.slice(0, 8).map((art, index) => (
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
        </div>


    )
}
