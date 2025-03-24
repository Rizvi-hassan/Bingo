import React, { useContext, useEffect } from 'react'
import UserContext from '../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import './Me.css';
const Me = () => {
  const context = useContext(UserContext);
  const { user, saveUser } = context;
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      const data = localStorage.getItem('bingo-user-info')
      if(!data){
        navigate('/login');
      }
      else{
        navigate('/');
      }
    }
  }, [user])

  const handleLogout = ()=>{
    localStorage.removeItem('bingo-user-info');
    saveUser(null);
  }

  return (
    
    <div className='me'>
      <div className="logo">
        <img className='logo-img' src={`https://images.weserv.nl/?url=${encodeURIComponent(user?.image)}`} alt={user?.name} />
      </div>
      <h1 style={{textAlign:'center', fontSize:'larger'}}>{user?.name}</h1>
      <button className="login-btn" onClick={handleLogout}>Log Out</button>
      <button className="home-btn" onClick={()=> navigate('/')}>Home</button>
    </div>
  )
}

export default Me