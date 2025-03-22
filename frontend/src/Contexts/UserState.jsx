import {React, useState} from 'react'
import UserContext from './UserContext'

const UserState = (props) => {
    const [socket, setSocket] = useState(null); // contains socket
    const [user, setUser] = useState(null); // contains {name, email, image}
    const [players, setPlayers] = useState([]); // contains array of players{name, email, image}
    const [room, setRoom] = useState(null); // {roomid, host_socket, players, board}
    const [winners, setWinners] = useState([]); // conatins winner array [{name, email, pic}, {name, email, pic}]
    const changeLogin = (isLoggedIn)=>{
        setLogin(isLoggedIn);
    }

    const saveUser = (data)=>{
      setUser(data);
    }

  return (
    <UserContext.Provider value={{ saveUser, user, socket, setSocket, players, setPlayers, room, setRoom, winners, setWinners}}>
        {props.children}
    </UserContext.Provider>
  )
}

export default UserState