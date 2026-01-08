import { Link } from 'react-router-dom'
import { BorderedButton } from '../components/BorderedButton'
import SharedSpaceLogo from '../assets/SharedSpaceLogo.svg'
import './LoginPage.css'

export function LoginPage() {
  return (
    <>
      <div className = "card">
        <div className = "card-body">
          <div className = "login-form">
              <div className = "section-header">
                Welcome Back!
              </div>

              <form>
                <input type = "email" placeholder = "Enter email"/>
                <input type = "password" placeholder = "Enter password"/>

                <div className = "card-button">
                  <BorderedButton message = "Log In" size = "purple"/>
                </div>
              </form>
          </div>

          <div className = "sign-up-prompt">
            <div className = "section-header">
              New to Shared Space?
            </div>

            <div className = "section-header2">
              Join a community of fellow artists today!
            </div>

            <div className = "login-page-logo">
              <img src = {SharedSpaceLogo} alt = "Shared Space" className = "page-logo"/>
            </div>

            <div className = "card-button">
              <Link to = "/sign-up">
                <BorderedButton to = "/sign-up" message = "Sign Up" size = "purple"/>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}