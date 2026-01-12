// For the navigation bar.
import './ModNavigationBar.css'                                 // Import CSS.
import { Link } from 'react-router-dom'
import SharedSpaceLogo from '../assets/SharedSpaceLogo.svg'

// ____________________________________________________________________________________________________

export function ModNavigationBar({ onSignOut, hasNewNotifications, onNotifications }) {
    return (
        <nav className='navbar'>
            {/* Shared Space logo. */}
            <div className='navbar-component-logo'>
                <img src={SharedSpaceLogo} alt="Shared Space" height="55" width="55" className="navbar-logo" />
            </div>

            {/* Icons in navbar's center. */}
            <div className='center-name'>
                Moderator Dashboard
            </div>

            {/* Icons in navbar's right-hand side. */}
            <div className='right-icons'>

                {/* Notification icon. */}
                <div className="navbar-notification-icon" onClick={onNotifications}>
                    <svg className="navbar-icon" width="35" height="35" viewBox="0 -50 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_0_1)">
                            <mask id="mask0_0_1" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="500" height="500">
                                <path d="M500 0H0V500H500V0Z" fill="white" />
                            </mask>
                            <g mask="url(#mask0_0_1)">
                                <mask id="mask1_0_1" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="500" height="500">
                                    <path d="M500 0H0V500H500V0Z" fill="white" />
                                </mask>
                                <g mask="url(#mask1_0_1)">
                                    <path d="M366.886 180.072C366.886 164.72 363.862 149.519 357.987 135.336C352.112 121.151 343.501 108.265 332.646 97.4093C321.791 86.554 308.904 77.9431 294.721 72.0683C280.537 66.1935 265.336 63.1698 249.984 63.1698C234.633 63.1698 219.431 66.1935 205.248 72.0683C191.065 77.9431 178.178 86.554 167.323 97.4093C156.468 108.265 147.857 121.151 141.982 135.336C136.107 149.519 133.083 164.72 133.083 180.072H160.885C160.885 168.371 163.189 156.785 167.667 145.975C172.145 135.164 178.708 125.341 186.981 117.068C195.255 108.794 205.077 102.231 215.887 97.7532C226.698 93.2755 238.284 90.9709 249.984 90.9709C261.685 90.9709 273.271 93.2755 284.082 97.7532C294.892 102.231 304.714 108.794 312.988 117.068C321.261 125.341 327.824 135.164 332.302 145.975C336.78 156.785 339.084 168.371 339.084 180.072H366.886Z" fill="#341539" />
                                    <path d="M339.083 267.17C339.083 278.743 341.363 290.203 345.791 300.895C350.22 311.587 356.711 321.302 364.895 329.485C373.078 337.668 382.793 344.159 393.485 348.588C404.177 353.017 415.636 355.296 427.209 355.296V327.452C419.293 327.452 411.454 325.893 404.14 322.864C396.826 319.834 390.181 315.394 384.583 309.796C378.985 304.199 374.545 297.553 371.516 290.239C368.486 282.926 366.927 275.087 366.927 267.17H339.083Z" fill="#341539" />
                                    <path d="M160.803 179.17H133.083V267.346H160.803V179.17Z" fill="#341539" />
                                    <path d="M366.799 180.17H339.083V267.059H366.799V180.17Z" fill="#341539" />
                                    <path d="M427.271 327.702H72.7291V355.483H427.271V327.702Z" fill="#341539" />
                                </g>
                            </g>
                            <path d="M72.7291 355.483C84.3021 355.483 95.7621 353.203 106.454 348.775C117.146 344.346 126.861 337.855 135.044 329.671C143.227 321.488 149.718 311.773 154.147 301.081C158.576 290.389 160.855 278.93 160.855 267.357H133.011C133.011 275.273 131.452 283.112 128.423 290.426C125.393 297.74 120.953 304.385 115.355 309.983C109.758 315.581 103.112 320.021 95.7981 323.05C88.4851 326.08 80.6461 327.639 72.7291 327.639V355.483Z" fill="#341539" />
                            <mask id="path-9-outside-1_0_1" maskUnits="userSpaceOnUse" x="172.083" y="327.483" width="156" height="106" fill="#341539">
                                <rect fill="white" x="172.083" y="327.483" width="156" height="106" />
                                <path d="M300.083 355.483C300.083 362.049 298.79 368.551 296.277 374.617C293.765 380.683 290.082 386.195 285.439 390.838C280.796 395.481 275.284 399.164 269.218 401.677C263.151 404.19 256.649 405.483 250.083 405.483C243.517 405.483 237.015 404.19 230.949 401.677C224.883 399.164 219.371 395.481 214.728 390.838C210.085 386.195 206.402 380.683 203.889 374.617C201.377 368.551 200.083 362.049 200.083 355.483L250.083 355.483H300.083Z" />
                            </mask>
                            <path d="M300.083 355.483C300.083 362.049 298.79 368.551 296.277 374.617C293.765 380.683 290.082 386.195 285.439 390.838C280.796 395.481 275.284 399.164 269.218 401.677C263.151 404.19 256.649 405.483 250.083 405.483C243.517 405.483 237.015 404.19 230.949 401.677C224.883 399.164 219.371 395.481 214.728 390.838C210.085 386.195 206.402 380.683 203.889 374.617C201.377 368.551 200.083 362.049 200.083 355.483L250.083 355.483H300.083Z" stroke="#341539" stroke-width="55.56" mask="url(#path-9-outside-1_0_1)" />
                        </g>
                        <defs>
                            <clipPath id="clip0_0_1">
                                <rect width="500" height="500" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                    {/* Indicator appears for new notifications. */}
                    {hasNewNotifications && <span className="notification-indicator"></span>}
                </div>

                {/* Sign-out icon. */}
                <button onClick={onSignOut} className="navbar-sign-out-icon">
                    <svg className="navbar-icon" width="35" height="35" viewBox="0 -33 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="35.613" y="60.1334" width="240" height="27.78" fill="#341539" />
                        <rect x="315.975" y="239.02" width="94.5441" height="27.78" transform="rotate(-45 315.975 239.02)" fill="#341539" />
                        <rect x="335.618" y="230.883" width="142.659" height="27.78" fill="#341539" />
                        <rect x="21.7231" y="60.1334" width="27.78" height="379.733" fill="#341539" />
                        <rect x="149.823" y="327.967" width="27.78" height="158.25" transform="rotate(-45 149.823 327.967)" fill="#341539" />
                        <rect x="329.85" y="225.114" width="102.573" height="27.7806" transform="rotate(45 329.85 225.114)" fill="#341539" />
                        <path d="M169.503 345.838H167.896L141.723 319.664V60.1332H169.503V345.838Z" fill="#341539" />
                        <rect x="261.723" y="60.1334" width="27.78" height="379.733" fill="#341539" />
                        <circle cx="195.607" cy="216.934" r="13.9486" fill="#341539" />
                    </svg>
                </button>

                {/* Mod dashboard icon. */}
                <Link to="/mod-dashboard">
                    <svg className="navbar-icon" width="35" height="35" viewBox="0 -33 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M250 446.25C250 446.25 394.667 367.75 394.667 250V112.625L250 53.75L105.333 112.625V250C105.333 367.75 250 446.25 250 446.25Z" stroke="#341539" stroke-width="27.78" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M398 248.5L385.828 103.399L291.261 67.24L251 55.5V248.5H398Z" fill="#341539"/>
                        <path d="M250 444.5V249.5H106L119.263 322.335L174.211 394.694L250 444.5Z" fill="#341539"/>
                    </svg>
                </Link>
            </div>
        </nav>
    );
}