import './App.css'
import "@fontsource/poppins"
import { BorderlessButton } from './components/BorderlessButton'
import { Routes, Route } from 'react-router-dom'
import { ArtWallPage } from './pages/ArtWallPage.jsx'
import { FriendsSpacePage } from './pages/FriendsSpacePage.jsx'
import { LeaderboardPage } from './pages/LeaderboardPage.jsx'

function App() {
  return (
    <Routes>
      <Route index element={ //TEST ONLY 
        <div className="App">
          <h1>SharedSpace</h1>
          <BorderlessButton to='/' message={'header button'} type='header'/>
          <BorderlessButton to='/' message={'light body button'} type='lightbody'/>
          <BorderlessButton to='/' message={'dark body button'} type='darkbody'/>
        </div>
      } />
      
      <Route path="art-wall" element={<ArtWallPage />}/>
      <Route path="friends-space" element={<FriendsSpacePage />}/>
      <Route path="leaderboard" element={<LeaderboardPage />}/>
    </Routes>
  )
}

export default App