import './ArtWallPage.css'
import { ArtPopup } from '../../components/ArtPopup';
import { useState, useEffect } from 'react';
import Almond from '../../assets/arts/almondtree.jpg';
import August from '../../assets/arts/augustrenoire.jpg';
import Cafe from '../../assets/arts/cafenight.jpg';
import Girl from '../../assets/arts/girlwithpearlearrings.jpg';
import Lemo from '../../assets/arts/lemoulin.jpg';
import Nippon from '../../assets/arts/nippon.jpg';
import Sakura from '../../assets/arts/sakura.jpg';
import Sunday from '../../assets/arts/ukiyo.jpg';
import WaterLily from '../../assets/arts/waterlilies.jpg'

export function ArtWallPage() {
    const artWorks = [
        { img: Almond, date: "1/3/2026", description: "lorem ipsum dolor" },
        { img: August, date: "1/4/2026", description: "lorem ipsum dolor" },
        { img: Cafe, date: "1/5/2026", description: "lorem ipsum dolor" },
        { img: Girl, date: "1/4/2026", description: "lorem ipsum dolor" },
        { img: Lemo, date: "1/5/2026", description: "lorem ipsum dolor" },
        { img: Nippon, date: "1/4/2026", description: "lorem ipsum dolor" },
        { img: Sakura, date: "1/5/2026", description: "lorem ipsum dolor" },
        { img: Sunday, date: "1/4/2026", description: "lorem ipsum dolor" },
        { img: WaterLily, date: "1/5/2026", description: "lorem ipsum dolor" }
    ]
    const [activeArt, setActiveArt] = useState(null);
    
    useEffect(() => {
        const resizeGridItem = (item, img) => {
            const grid = document.querySelector('.artWall');
            const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
            const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('gap'));
            
            // Calculate the aspect ratio and determine height
            const width = item.offsetWidth;
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const calculatedHeight = width / aspectRatio;
            
            const rowSpan = Math.ceil((calculatedHeight + rowGap) / (rowHeight + rowGap));
            item.style.gridRowEnd = `span ${rowSpan}`;
            item.style.height = `${calculatedHeight}px`;
        };

        const resizeAllGridItems = () => {
            const allItems = document.querySelectorAll('.artWorkItem');
            allItems.forEach(item => {
                const img = item.querySelector('.artWork');
                if (img.complete && img.naturalHeight !== 0) {
                    resizeGridItem(item, img);
                } else {
                    img.addEventListener('load', () => resizeGridItem(item, img));
                }
            });
        };

        // Small delay to ensure images are loaded
        setTimeout(resizeAllGridItems, 100);
        window.addEventListener('resize', resizeAllGridItems);

        return () => {
            window.removeEventListener('resize', resizeAllGridItems);
        };
    }, []);

    return (
        <div className="artWallContainer">
            <ArtPopup
                trigger={activeArt != null}
                setTrigger={() => setActiveArt(null)}
                img={activeArt?.img}
                date={activeArt?.date}
                desc={activeArt?.description}
            />
            <h1 className='aw-title'>Art Wall</h1>
            <p className='aw-subtitle'>See what the community's been creating lately 🎨</p>
            <div className='artWallWrapper'>
                <div className='artWall'>
                    {
                        artWorks.map((art, index) => (
                            <div 
                                className='artWorkItem' 
                                key={index}
                                onClick={() => { setActiveArt(art) }}
                            >
                                <img
                                    src={art.img}
                                    alt='Artwork'
                                    className='artWork'
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}