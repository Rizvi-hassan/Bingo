import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import cross from '../../assets/images/cross.png';

export const Player = (props) => {

  const { user, exitUser } = props;
  const location = useLocation();
  const circumference = 2 * Math.PI * 47; // 295.3097094374406
  const [offset, setOffset] = useState(circumference);

  useState(() => {
    if (location.pathname === '/play') {
      // console.log('creating user', props.user);
    }
  }, [])


  return (
    <div className='player'>

      <svg className='progress' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="47" fill="none" stroke="#e6e6e6" strokeWidth="6" />
        <circle id={props.user} className='not-ready' cx="50" cy="50" r="47" fill="none" stroke="#4CAF50" strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 50 50)" />
      </svg>
      <img className='user-icon' src={`https://images.weserv.nl/?url=${encodeURIComponent(props.image)}`} alt="user icon" /><br />
      <span className="player-name">{props.id.substring(0, props.id.indexOf(' '))}</span>
      {location.pathname === '/host' && user !== '' && <img onClick={()=> exitUser(user)} src={cross} className='cross-icon' alt="kick out" />}
    </div>
  )
}
