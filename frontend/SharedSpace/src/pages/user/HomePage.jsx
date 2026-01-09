import './HomePage.css'
import { BorderedButton } from '../../components/BorderedButton.jsx'
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

    const friends_artWorks = [
        { img: SampleImg, date: "1/1/2026", description: "lorem ipsum dolor" ,author: "Nname"},
        { img: SampleImg2, date: "1/4/2026", description: "lorem ipsum dolor" ,author: "Nname"},
        { img: SampleImg2, date: "1/6/2026", description: "lorem ipsum dolor" ,author: "Cname"},
        { img: SampleImg, date: "1/4/2026", description: "lorem ipsum dolor" ,author: "Dname"},
    ];

    const randomIndex = Math.floor(Math.random() * friends_artWorks.length)

    const friendArt = friends_artWorks[randomIndex]
    //note: need isort based on date

    const [activeArt, setActiveArt] = useState(null);


    return(
        <div className = 'home'>
            <div className='share'>
                <div className='logo2container'>
                <img src={Share} className = 'Logo2'/>
                </div>  
                <BorderedButton className='ShareButton' message={'Share'} size='pink'/>
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

                    <div key={friendArt.art} className='friend-card' onClick={() => setActiveArt(art)}>
                        <img src={friendArt.img} alt={friendArt.description} className='art-image'></img>
                    </div>

                    <h1 className='friendsText'> Your friends shared their day!</h1>
            </div>

            <div className='bottom'>
                <div className='leaderboard'>

                </div>

                <div className='challenge'>

                </div>

            </div>

        </div>
    )
}
