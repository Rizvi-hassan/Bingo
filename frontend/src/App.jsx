import Hero from './Components/Hero/Hero'
import './App.css'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Host from './Components/Host/Host'
import Lobby from './Components/Host/Lobby'
import Join from './Components/Join/Join'
import Me from './Components/Me/Me'
import UserState from './Contexts/UserState'
import Play from './Components/Play/Play'
import NotFound from './Components/NotFound/NotFound'
import Login from './Components/Login/Login'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Finish from './Components/Finish/Finish'

function App() {

  const GoogleAuthWrapper = ()=>{
    return(
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT}>
        <Login/>
      </GoogleOAuthProvider>
    )
  }

  return (
    <>
      <UserState>
        <Router>
          <Routes>
            <Route path='/' element={<Hero />}></Route>
            <Route path='/host' element={<Host />}></Route>
            <Route path='/join' element={<Join />}></Route>
            <Route path='/me' element={<Me />}></Route>
            <Route path='/lobby' element={<Lobby />}></Route>
            <Route path='/play' element={<Play />}></Route>
            <Route path='/login' element={<GoogleAuthWrapper />}></Route>
            <Route path='/finish' element={<Finish/>}></Route>
            <Route path='*' element={<NotFound/>} ></Route>
          </Routes>
        </Router>
      </UserState>
    </>
  )
}

export default App
