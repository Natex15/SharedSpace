import './ArtWallPage.css'
import SampleImg from '../../assets/SharedSpaceLogo.svg'
import SampleImg2 from '../../assets/react.svg'
export function ArtWallPage() {
    const artWorks = [SampleImg, SampleImg2, SampleImg, SampleImg, SampleImg, SampleImg2, SampleImg, SampleImg, SampleImg2];
    return (
        <div className="artWallContainer">
            <h1 className='text'>Art Wall</h1>
            <p className='text'>See what the community’s been creating lately 🎨</p>
            <div className='artWallWrapper'>
                <div className='artWall'>
                    {
                        artWorks.map((art, index) => (
                            <img src={art} alt='Image' key={index} className='artWork' />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}