import './App.css'
import "@fontsource/poppins"
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { NavigationBar } from './components/NavigationBar'
import { Routes, Route } from 'react-router-dom'
import { ArtWallPage } from './pages/user/ArtWallPage.jsx'
import { FriendsSpacePage } from './pages/user/FriendsSpacePage.jsx'
import { LeaderboardPage } from './pages/user/LeaderboardPage.jsx'
import { LoginPage } from './pages/user/LoginPage.jsx'
import { SignUpPage } from './pages/user/SignUpPage.jsx'
import { HomePage } from './pages/user/HomePage.jsx'
import { ProfilePage } from './pages/user/ProfilePage.jsx'
import { ModDashboardPage } from './pages/user/ModDashboardPage.jsx'
import { ChallengesPage } from './pages/user/ChallengesPage.jsx'
import { NotificationPopup } from './components/NotificationPopup'
import { SignOutPopup } from './components/SignOutPopup'

function App() {
  const location = useLocation()
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const [showSignOutPopup, setShowSignOutPopup] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/sign-up" && (
        <NavigationBar onSignOut={()=>setShowSignOutPopup(true)} hasNewNotifications={hasNewNotifications} onNotifications={()=>setShowNotifications(true)} />
      )}

      <Routes>
        {/* <Route index element={ //TEST ONLY 
          <div className="App">
            <h1>SharedSpace</h1>
            <BorderlessButton to='/home' message={'header button'} type='header' />
            <BorderlessButton to='/home' message={'light body button'} type='lightbody' />
            <BorderlessButton to='/home' message={'dark body button'} type='darkbody' />
            <br></br>
            <BorderedButton to='/home' message={'Large Button'} size='large' />
            <br></br>
            <BorderedButton to='/home' message={'Purple Button'} size='purple' />
            <BorderedButton to='/home' message={'Pink Button'} size='pink' />
          </div>
        } /> */}

        <Route index element={<LoginPage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="art-wall" element={<ArtWallPage />} />
        <Route path="friends-space" element={<FriendsSpacePage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="mod-dashboard" element={<ModDashboardPage />} />
        <Route path="challenges" element={<ChallengesPage />} />
      </Routes>

      {showSignOutPopup && (
        <SignOutPopup
          onClose={() => setShowSignOutPopup(false)}
          onLogout={() => {
          setShowSignOutPopup(false);
          setShowNotifications(false);
        }} />
      )}

      {showNotifications && (<NotificationPopup onClose={() => setShowNotifications(false)} />)}

    </>
  )
}

export default App