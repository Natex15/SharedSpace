import './ArtWallPage.css'
import SampleImg from '../../assets/SharedSpaceLogo.svg'
import SampleImg2 from '../../assets/react.svg'
import { ArtPopup } from '../../components/ArtPopup';
import { useState } from 'react';

export function ArtWallPage() {
    const artWorks = [
        { img: SampleImg, date: "1/1/2026", description: "lorem ipsum dolor" },
        { img: SampleImg2, date: "1/2/2026", description: "lorem ipsum dolor" },
        { img: SampleImg2, date: "1/3/2026", description: "lorem ipsum dolor" },
        { img: SampleImg, date: "1/4/2026", description: "lorem ipsum dolor" },
        { img: SampleImg2, date: "1/5/2026", description: "lorem ipsum dolor" },
        { img: SampleImg, date: "1/4/2026", description: "lorem ipsum dolor" },
        { img: SampleImg2, date: "1/5/2026", description: "lorem ipsum dolor" },
        { img: SampleImg, date: "1/4/2026", description: "lorem ipsum dolor" },
        { img: SampleImg2, date: "1/5/2026", description: "lorem ipsum dolor" }
    ]
    const [activeArt, setActiveArt] = useState(null);
    return (
        <div className="artWallContainer">
            <ArtPopup
                trigger={activeArt != null}
                setTrigger={() => setActiveArt(null)}
                img={activeArt?.img}
                date={activeArt?.date}
                desc={activeArt?.description}
            />
            <h1 className='text'>Art Wall</h1>
            <p className='text'>See what the community’s been creating lately 🎨</p>
            <div className='artWallWrapper'>
                <div className='artWall'>
                    {
                        artWorks.map((art, index) => (
                            <img
                                src={art.img}
                                alt='Image'
                                key={index}
                                className='artWork'
                                onClick={() => { setActiveArt(art) }}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}