import SampleImg from '../../assets/SharedSpaceLogo.svg'
import SampleImg2 from '../../assets/react.svg'
import './LeaderboardPage.css'

export function LeaderboardPage(){
    const ranking5 = [
        {img: SampleImg, name: 'Arian', score: 100},
        {img: SampleImg2, name: 'Elisha', score: 95},
        {img: SampleImg, name: 'Angus', score: 91},
        {img: SampleImg2, name: 'Vince', score: 90},
        {img: SampleImg, name: 'Nathaniel', score: 89},
    ]

    const colors = ['#CB6D6D', '#EF8C8C', '#EDA8A8', '#FFE2E2', '#FFE2E2'];

    return(
        <div className="leaderboardBody">
            <h1 className="leaderboard-title">Leaderboard</h1>
            <p className="leaderboard-subtitle">Users with the most consecutive days active</p>

            <div className="leaderboard-container">
                {ranking5.map((user, index) => (
                    <div 
                        key={index} 
                        className="leaderboard-item" 
                        style={{backgroundColor: colors[index]}}
                    >
                        <span className="rank-number">{index + 1}</span>
                        <img src={user.img} className='profile-avatar' alt={user.name}/>
                        <span className="user-name">{user.name}</span>
                        <span className="user-score">{user.score}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}