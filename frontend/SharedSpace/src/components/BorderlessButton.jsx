import './BorderlessButton.css'
import { Link } from 'react-router-dom'

export function BorderlessButton({ to, message, type }){
    return(
        <>
            <Link to={to} className='borderlessButton'>
                <button className={type}>
                    {message}
                    {type != 'header' && " ►"}
                </button>
            </Link>
        </>
    );
}