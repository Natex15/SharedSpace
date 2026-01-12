import './BorderedButton.css'
import { Link } from 'react-router-dom'

/**
 * BorderedButton Component
 * 
 * Props:
 * - to: (optional) Route path for navigation using React Router Link
 * - onClick: (optional) Function to call when button is clicked
 * - message: Text to display on the button
 * - size: 'large', 'purple', or 'pink' (default: 'large')
 * 
 * Note: Provide either 'to' OR 'onClick', not both
 */
export function BorderedButton({ to, onClick, message, size = 'large', type='button' }) {
    const getButtonClass = () => {
        switch (size) {
            case 'purple':
                return 'borderedButton-purple';
            case 'pink':
                return 'borderedButton-pink';
            case 'large':
            default:
                return 'borderedButton-large';
        }
    };

    // If onClick is provided, render a button without Link
    if (onClick) {
        return (
            <div className='borderedButton'>
                <button className={getButtonClass()} onClick={onClick} type={type}>
                    {message}
                </button>
            </div>
        );
    }

    // Otherwise, render with Link for navigation
    return (
            <Link to={to} className='borderedButton'>
                <button className={getButtonClass()} type={type}>
                    {message}
                </button>
            </Link>
    );
}
