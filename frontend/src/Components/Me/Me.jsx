import React, { useContext, useEffect } from 'react'
import UserContext from '../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import './Me.css';
import authStore from '../../store/authStore';
import { api } from '../../lib/axios';
const Me = () => {
  // const context = useContext(UserContext);
  const { user, setUser } = authStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user])

  const handleLogout = async() => {

    // TODO: logout logic
    try {
      const response = await api.get('/auth/logout');
      if(response.status === 200) {
        console.log("logged out successfully")
        navigate('/login')
      }

    } catch (error) {
      console.log(error.message)
    }

    setUser(null);
  }

  return (

    <div className='me'>
      <div className="logo">
        <img className='logo-img' src={user?.profile === '' ? userIcon : user?.profile.substring(0, 33) === 'https://lh3.googleusercontent.com' ? `https://images.weserv.nl/?url=${encodeURIComponent(user?.profile)}` : user?.profile} alt="user icon" /><br />
      </div>
      <h1 style={{ textAlign: 'center', fontSize: '25px' }}>{user?.username}</h1>
      <div className="buttons">
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        <button className="edit-btn" onClick={handleLogout}>Edit Profile</button>
      </div>
      <button className="home-btn" onClick={() => navigate('/')}>Home</button>
    </div>
  )
}

export default Me