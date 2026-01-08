import './HomePage.css'
import { BorderedButton } from '../components/BorderedButton.jsx'
import Share from '../assets/ShareYourDay.svg'

export function HomePage(){
    return(
        <div className = 'home'>
            <div className='share'>
            <img src={Share} className = 'Logo2'/>
            <BorderedButton className='ShareButton' message={'Share'} size='pink'/>  
            </div>
            <div className='works'>

            </div>
            <div className='friends'>

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
