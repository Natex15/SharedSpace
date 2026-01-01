import './App.css'
import "@fontsource/poppins"
import { BorderlessButton } from './components/BorderlessButton'
import { Routes, Route } from 'react-router-dom'

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
    </Routes>
  )
}

export default App