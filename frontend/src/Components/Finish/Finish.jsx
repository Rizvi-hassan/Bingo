import React, { useContext, useState } from 'react';
import UserContext from '../../Contexts/UserContext';
import './Finish.css';
import { useNavigate } from 'react-router-dom';

const Finish = () => {
  const context = useContext(UserContext);
  const {socket, winners, setSocket, setRoom } = context;
  const navigate = useNavigate();

  useState(()=>{
    if(!winners){
      navigate('/');
    }
  })

  // Use winners from context if available, otherwise use dummy data
  const displayWinners = winners.sort( (a, b) => a.rank - b.rank);

  // Calculate medal colors
  const getMedalColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#8A92A5'; // Default gray
    }
  };


  const handleExit = ()=>{
    if(socket){
      socket.disconnect();
      setSocket(null);
      setRoom(null);
    }

    navigate('/');
  }

  return (
    <div className="finish-container">
      <h1 className="leaderboard-title">Match Finished</h1>
      <div className="winners-container">
        {displayWinners.map((winner, index) => {
          const medalColor = getMedalColor(index+1);
          return (
            <div className="neumorphic-card" key={index}>
              <div className="rank-badge" style={{ backgroundColor: medalColor }}>
                <span>{index+1}</span>
              </div>

              <div className="winner-info">
                <div className="profile-section">
                  <div className="progress-circle-container">
                    <svg className="progress-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                      <circle className="progress-bg" cx="50" cy="50" r="47" />
                      <circle
                        className="progress-fill"
                        cx="50"
                        cy="50"
                        r="47"
                        strokeDasharray={295.3097094374406}
                        strokeDashoffset={0}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="profile-image-container">
                      <img
                        className="profile-image"
                        src={`https://images.weserv.nl/?url=${encodeURIComponent(winner.image)}`}
                        alt={`${winner.name}'s profile`}
                      />
                    </div>
                  </div>
                </div>

                <div className="user-details">
                  <h2 className="user-name">{winner.name}</h2>
                  <h4 className="user-email">{winner.email}</h4>
                  
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className='btn' onClick={handleExit}>Home</button>
    </div>
  );
};

export default Finish;