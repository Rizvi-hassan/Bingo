import './Play.css'
import React, { useContext, useEffect, useState } from 'react'
import { Player } from './Player'
import Grid_4 from './Grids/Grid_4'
import Grid_5 from './Grids/Grid_5'
import Grid_6 from './Grids/Grid_6'
import Grid_7 from './Grids/Grid_7'
import UserContext from '../../Contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { resetCheck } from './CheckBingo.mjs'
import authStore from '../../store/authStore'
import gameStore from '../../store/gameStore'

const Play = () => {

    const navigate = useNavigate();
    const context = useContext(UserContext)
    // const { user, room, socket, setSocket, setRoom, setWinners } = context;
    const { user } = authStore();
    const { room, socket, set} = gameStore();


    const [ready, isReady] = useState(false); // holds if a player is ready or not
    const [no, setNo] = useState(0);
    const [myTurn, setMyTurn] = useState(false);
    const [bingo, setBingo] = useState(0);
    const [won, setWon] = useState(false);
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (!user || !room || !socket) {
            navigate('/');
        }

        // reseting the check grid
        resetCheck();

        if (socket) {

            // // there is a change in players - update it
            // socket.on('update-room', (newRoom) => {
            //     // console.log('updating room: ', newRoom);
            //     setRoom(newRoom);
            // })

            // a player is ready - change its icon border to ready color
            socket.on('i-am-ready', (who) => {
                // setting color of player circle to blue
                console.log('player is ready');
                document.getElementById(who).classList.remove('not-ready');
                document.getElementById(who).classList.add('ready');

            })

            // a player is selected for turn
            socket.on('player-turn', (who) => {
                // console.log('player turn in room: ', room);
                // setting all player`s circle color to blue (not ready)
                console.log("room: ", room);
                for (let player of room?.playing) {
                    // console.log(player);
                    if (document.getElementById(player?.email)) {
                        document.getElementById(player?.email).style.stroke = '#219EBC'
                    }
                }

                // setting the circle color of player`s turn to white
                document.getElementById(who).style.stroke = 'white';

                // if I am the current player then set my turn to true
                if (user?.email === who) {
                    setMyTurn(true);
                }
            })

            // player recieves the current move
            socket.on('current-move', (move, email, isWon, newRoom) => {
                if (isWon){
                    document.getElementById(email).style.stroke = '#e4ff00'
                    room.playing = newRoom.playing;
                    room.won = newRoom.won;
                }
                else
                    document.getElementById(email).style.stroke = '#8ee694'
                
                document.getElementById('move').style.transform = 'translateY(0px)'
                setNo(move);
            })
            
            // inform player that other player has played move
            socket.on('move-played', (who, isWon, newRoom) => {
                if (isWon){
                    console.log("updated Room", newRoom)
                    document.getElementById(who).style.stroke = '#e4ff00'
                    room.playing = newRoom.playing;
                    room.won = newRoom.won;
                }
                else
                    document.getElementById(who).style.stroke = '#8ee694'

            })

            // match has finished
            socket.on('match-finish', newRoom => {
                set({room: newRoom})
                navigate('/finish');
            })

            // chat message 
            socket.on('chat', (name, message)=>{
                setMessages( messages => [...messages, [name, message]])
            })

        }
    }, [])


    // if there is a line complete, cut a letter of bingo
    useEffect(() => {
        if (bingo > 0) {
            for (let i = 1; i <= Math.min(bingo, room?.boardSize); i++) {
                document.getElementById(`letter${i}`).classList.add('letter-active');
            }
        }

        if (bingo >= room?.boardSize) {
            // if match won by me
            if (!won) {
                console.log('I won')
                // document.getElementById(user?.email).style.stroke = '#e4ff00'
                // socket.emit('won-match', room?.roomId, user);
                setWon(true);
            }
        }
    }, [bingo])

    // TODO: fix player wins trigger and room update issue after player won
    const sendMyMove = (move, isWon) => {
        console.log('sending my move: ', move);
        setNo(move);
        socket.volatile.emit('my-move', room?.roomId, move, user?.email, isWon);
        if(!isWon) document.getElementById(user?.email).style.stroke = '#8ee694';
        setMyTurn(false);
    }

    // I am ready and sending signal to server
    const setPlayerReady = () => {
        console.log('I am ready: ');
        document.getElementById(user?.email).classList.remove('not-ready');
        document.getElementById(user?.email).classList.add('ready');
        socket.emit('ready', room?.roomId, user?.email);
        isReady(true);
    }

    const clickedNo = (no, count) => {
        if (myTurn) {
            sendMyMove(no, count >= room?.boardSize);
        }
        else {
            sendMyMove(0, count >= room?.boardSize);
        }
        document.getElementById('move').style.transform = 'translateY(100%)'
        setNo(0);
    }

    const renderGrid = (size) => {
        switch (size) {
            case 4: return <Grid_4 setBingo={setBingo} bingo={bingo} no={no} myTurn={myTurn} ready={ready} setPlayer={setPlayerReady} clickedNo={clickedNo} />

            case 5: return <Grid_5 setBingo={setBingo} bingo={bingo} no={no} myTurn={myTurn} ready={ready} setPlayer={setPlayerReady} clickedNo={clickedNo} />

            case 6: return <Grid_6 setBingo={setBingo} bingo={bingo} no={no} myTurn={myTurn} ready={ready} setPlayer={setPlayerReady} clickedNo={clickedNo} />

            case 7: return <Grid_7 setBingo={setBingo} bingo={bingo} no={no} myTurn={myTurn} ready={ready} setPlayer={setPlayerReady} clickedNo={clickedNo} />

        }
    }

    const handleExit = () => {
        try {
            // socket.emit('delete-room', room?.roomId);
            socket.disconnect();
            set({socket: null, room: null})

        } catch (error) {

        }

        navigate('/');
    }

    const renderBingo = () => {
        const word = room?.boardSize === 7 ? "KURKURE" : "BINGOS";
        let elements = [];
        for (let i = 1; i <= room?.boardSize; i++) {
            elements.push(<span key={i} id={`letter${i}`} className="letter">{word[i - 1]}</span>)
        }
        return elements;
    }

    const handleMessageForm = (e) => {
        e.preventDefault();
        if(message !== '')
            socket.emit('chat', room?.roomId, user?.name, message)
        
        setMessages((messages) => [...messages, [user?.name, message]])
        setMessage('')
    }

    return (
        <div className='play'>
            <div className="players">
                {room?.players.map((val) => {
                    return <Player key={val.email} user={val.email} id={''} image={val.image}></Player>
                })}
            </div>
            <div className="timer" >
                <span className='moving' id='move'></span>
                {/* <img src={Number[no]} alt="Time" style={{ position: 'relative', width: '75%' }} /> */}
                <span style={{'zIndex': '10', 'fontFamily': '"Orbitron", sans-serif'}}>{no === 0 ? "..." : no}</span>
            </div>
            <div className="bingo">
                {renderBingo()}
            </div>
            {won ? null : <div className="board">
                {renderGrid(room?.boardSize)}
            </div>}
            <div className="chat">
                <div className="messages">
                    {messages?.map((message, i) => {
                        return (
                            <div key={i} className="text">
                                <span className="user">{message[0] === user?.name? 'you' : message[0]}</span>
                                <p className='message-text'>{message[1]}</p>
                            </div>
                        )
                    })}

                </div>
                <form onSubmit={handleMessageForm} className="message-form">
                    <input id='input-field' type="text" placeholder='Enter message' value={message} onChange={(e) => { setMessage(e.target.value) }} autoComplete='off' />
                    <input id='input-submit' type="submit" value="Send" />
                </form>
            </div>
            <button onClick={handleExit} className='btn'>Exit</button>
        </div>
    )
}

export default Play 