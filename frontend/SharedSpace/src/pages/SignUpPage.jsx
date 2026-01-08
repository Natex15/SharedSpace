import { Link, useNavigate } from 'react-router-dom'
import { BorderedButton } from '../components/BorderedButton'
import SharedSpaceLogo from '../assets/SharedSpaceLogo.svg'
import './SignUpPage.css'

export function SignUpPage() {
  const navigate = useNavigate();

  const handleCreateAccount = (e) => {
    e.preventDefault();
    navigate('/login'); // go login
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="sign-up-prompt">
            <div className="section-header">
              Already have an account?
            </div>

            <div className="section-header2">
              Join a community of fellow artists today!
            </div>

            <div className="login-page-logo">
              <img src={SharedSpaceLogo} alt="Shared Space" className="page-logo" />
            </div>

            <div className="card-button">
              <Link to="/login">
                <BorderedButton to="/login" message="Log In" size="purple" />
              </Link>
            </div>
          </div>

          <div className="login-form">
            <div className="section-header">
              Create an Account
            </div>

            <form onSubmit={handleCreateAccount}>
              <input type="email" placeholder="Enter email" required />
              <input type="text" placeholder="Enter username" required />
              <input type="password" placeholder="Enter password" required />
              <input type="password" placeholder="Confirm password" required />

              <div className="card-button">
                <BorderedButton to="/login" message="Sign Up" size="purple" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
