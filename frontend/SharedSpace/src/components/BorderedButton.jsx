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
export function BorderedButton({ to, onClick, message, size = 'large', type = 'button', disabled = false }) {
    const getButtonClass = () => {
        let baseClass = '';
        switch (size) {
            case 'purple':
                baseClass = 'borderedButton-purple';
                break;
            case 'pink':
                baseClass = 'borderedButton-pink';
                break;
            case 'large':
            default:
                baseClass = 'borderedButton-large';
                break;
        }
        return disabled ? `${baseClass} disabled` : baseClass;
    };

    // If it's a submit button or has an onClick handler, render a standard button
    if (onClick || type === 'submit') {
        return (
            <div className='borderedButton'>
                <button className={getButtonClass()} onClick={onClick} type={type} disabled={disabled}>
                    {message}
                </button>
            </div>
        );
    }

    // Otherwise, render as a Link for navigation
    return (
        <Link to={to} className='borderedButton' style={disabled ? { pointerEvents: 'none' } : {}}>
            <button className={getButtonClass()} type={type} disabled={disabled}>
                {message}
            </button>
        </Link>
    );
}
