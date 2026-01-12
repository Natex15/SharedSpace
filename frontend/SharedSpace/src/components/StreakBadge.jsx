import './StreakBadge.css';
import StreakContainer from '../assets/StreakContainer.svg';

export function StreakBadge({ streakCount }) {
    return (
        <div className='streak-badge'>
            <img src={StreakContainer} alt="Streak" className='streak-container' />
            <span className='streak-number'>{streakCount}</span>
        </div>
    );
}
