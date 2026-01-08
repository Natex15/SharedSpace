import './App.css'
import "@fontsource/poppins"
import { useLocation } from 'react-router-dom'
import { NavigationBar } from './components/NavigationBar'
import { BorderlessButton } from './components/BorderlessButton'
import { BorderedButton } from './components/BorderedButton'
import { Routes, Route } from 'react-router-dom'
import { ArtWallPage } from './pages/user/ArtWallPage.jsx'
import { FriendsSpacePage } from './pages/user/FriendsSpacePage.jsx'
import { LeaderboardPage } from './pages/user/LeaderboardPage.jsx'
import { LoginPage } from './pages/user/LoginPage.jsx'
import { SignUpPage } from './pages/user/SignUpPage.jsx'
import { HomePage } from './pages/HomePage.jsx'

function App() {
  const location = useLocation()

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/sign-up" && <NavigationBar />}

      <Routes>
        <Route index element={ //TEST ONLY 
          <div className="App">
            <h1>SharedSpace</h1>
            <BorderlessButton to='/' message={'header button'} type='header' />
            <BorderlessButton to='/' message={'light body button'} type='lightbody' />
            <BorderlessButton to='/' message={'dark body button'} type='darkbody' />
            <br></br>
            <BorderedButton to='/' message={'Large Button'} size='large' />
            <br></br>
            <BorderedButton to='/' message={'Purple Button'} size='purple' />
            <BorderedButton to='/' message={'Pink Button'} size='pink' />
          </div>
        } />

        <Route path="art-wall" element={<HomePage />} />
        <Route path="art-wall" element={<ArtWallPage />} />
        <Route path="friends-space" element={<FriendsSpacePage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
      </Routes>
    </>
  )
}

export default App