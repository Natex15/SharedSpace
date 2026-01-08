import SampleImg from '../../assets/SharedSpaceLogo.svg'
import SampleImg2 from '../../assets/react.svg'
import { ArtPopup } from '../../components/ArtPopup';
import { useState } from 'react';
import './FriendsSpacePage.css'

export function FriendsSpacePage() {
    const artWorks = [
        { img: SampleImg, date: "1/1/2026", description: "lorem ipsum dolor" ,author: "Nname"},
        { img: SampleImg2, date: "1/2/2026", description: "lorem ipsum dolor" ,author: "Nname"},
        { img: SampleImg2, date: "1/3/2026", description: "lorem ipsum dolor" ,author: "Cname"},
        { img: SampleImg, date: "1/4/2026", description: "lorem ipsum dolor" ,author: "Dname"},
        { img: SampleImg2, date: "1/5/2026", description: "lorem ipsum dolor" ,author: "Ename"},
        { img: SampleImg, date: "1/4/2026", description: "lorem ipsum dolor" ,author: "Aname"},
        { img: SampleImg2, date: "1/5/2026", description: "lorem ipsum dolor" ,author: "Gname"},
        { img: SampleImg, date: "1/4/2026", description: "lorem ipsum dolor" ,author: "Aname"},
        { img: SampleImg2, date: "1/5/2026", description: "lorem ipsum dolor" ,author: "Iname"}
    ]

    const [activeArt, setActiveArt] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    const itemsPerPage = 4;
    const totalPages = Math.ceil(artWorks.length / itemsPerPage);

    const getCurrentPageArtworks = () => {
        const startIndex = currentPage * itemsPerPage;
        return artWorks.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    return (
        <div className="friendSpaceContainer">
            <ArtPopup
                trigger={activeArt != null}
                setTrigger={() => setActiveArt(null)}
                img={activeArt?.img}
                date={activeArt?.date}
                desc={activeArt?.description}
            />

            <div className="content-wrapper">
                <h1 className="title">Friends</h1>
                <p className="subtitle">See what your friends have been sharing lately</p>

                <div className="artworks-grid">
                    {getCurrentPageArtworks().map((art, index) => (
                        <div 
                            key={index} 
                            className="artwork-card"
                            onClick={() => setActiveArt(art)}
                        >
                            <img 
                                src={art.img} 
                                alt={art.description}
                                className="artwork-image"
                            />
                            <div className="artwork-avatar">
                                <div className="avatar-circle">
                                    {art.author?.charAt(0) || '?'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="navigation">
                    <button 
                        className="nav-button"
                        onClick={handlePrevious}
                        disabled={currentPage === 0}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    <div className="page-indicators">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <div 
                                key={index}
                                className={`page-dot ${index === currentPage ? 'active' : ''}`}
                                onClick={() => setCurrentPage(index)}
                            />
                        ))}
                    </div>

                    <button 
                        className="nav-button"
                        onClick={handleNext}
                        disabled={currentPage === totalPages - 1}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}