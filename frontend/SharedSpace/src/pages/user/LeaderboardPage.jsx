import SampleImg from '../../assets/SharedSpaceLogo.svg'
import SampleImg2 from '../../assets/react.svg'
import './LeaderboardPage.css'
import StSiffret from '../../assets/arts/stsiffret.jpg';
import SundayReal from '../../assets/arts/sunday.jpg';
import CherryBlossom from '../../assets/arts/cherryblossom.jpg';

export function LeaderboardPage() {
    const ranking5 = [
        { img: SampleImg, name: 'Arian', score: 100 },
        { img: SampleImg2, name: 'Elisha', score: 95 },
        { img: SampleImg, name: 'Angus', score: 91 },
        { img: SampleImg2, name: 'Vince', score: 90 },
        { img: SampleImg, name: 'Nathaniel', score: 89 },
    ]
    
    const votingRanks3 = [
        { img: StSiffret, votes: 81 },      // Index 0 - 1st place
        { img: SundayReal, votes: 76 },     // Index 1 - 2nd place
        { img: CherryBlossom, votes: 63 }   // Index 2 - 3rd place
    ]
    
    const colors = ['#CB6D6D', '#EF8C8C', '#EDA8A8', '#FFE2E2', '#FFE2E2'];

    return (
        <div className="lb-current-leaderboardBody">
            <h1 className="lb-current-leaderboard-title">Leaderboard</h1>
            
            <div className="lb-current-leaderboard-wrapper">
                {/* User Rankings Section */}
                <div className="lb-current-leaderboard-section">
                    <h2 className="lb-current-section-title">Most Active Users</h2>
                    <div className="lb-current-leaderboard-container">
                        {ranking5.map((user, index) => (
                            <div 
                                key={index} 
                                className="lb-current-leaderboard-item" 
                                style={{backgroundColor: colors[index]}}
                            >
                                <span className="lb-current-rank-number">{index + 1}</span>
                                <img src={user.img} className='lb-current-profile-avatar' alt={user.name}/>
                                <span className="lb-current-user-name">{user.name}</span>
                                <span className="lb-current-user-score">{user.score}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Artwork Voting Rankings Section - Podium Style */}
                <div className="lb-current-leaderboard-section">
                    <h2 className="lb-current-section-title">Most Voted Artworks</h2>
                    <div className="lb-current-artwork-podium">
                        
                        {/* 2nd Place - Left */}
                        <div className="lb-current-artwork-item lb-current-artwork-second">
                            <img 
                                src={votingRanks3[1].img} 
                                className='lb-current-artwork-image' 
                                alt="2nd place artwork"
                            />
                            <span className="lb-current-artwork-votes">{votingRanks3[1].votes} votes</span>
                        </div>

                        {/* 1st Place - Center */}
                        <div className="lb-current-artwork-item lb-current-artwork-first">
                            <img 
                                src={votingRanks3[0].img} 
                                className='lb-current-artwork-image' 
                                alt="1st place artwork"
                            />
                            <span className="lb-current-artwork-votes">{votingRanks3[0].votes} votes</span>
                        </div>

                        {/* 3rd Place - Right */}
                        <div className="lb-current-artwork-item lb-current-artwork-third">
                            <img 
                                src={votingRanks3[2].img} 
                                className='lb-current-artwork-image' 
                                alt="3rd place artwork"
                            />
                            <span className="lb-current-artwork-votes">{votingRanks3[2].votes} votes</span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}