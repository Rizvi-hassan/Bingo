import './Play.css'
import React, { useContext, useEffect, useState } from 'react'
import { Player } from './Player'
import Number from './Number'
import Grid_4 from './Grids/Grid_4'
import Grid_5 from './Grids/Grid_5'
import Grid_6 from './Grids/Grid_6'
import Grid_7 from './Grids/Grid_7'
import UserContext from '../../Contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { resetCheck } from './CheckBingo.mjs'

const Play = () => {

    const navigate = useNavigate();
    const context = useContext(UserContext)
    const { user, room, socket, setSocket, setRoom, setWinners } = context;


    const [ready, isReady] = useState(false); // holds if a player is ready or not
    const [no, setNo] = useState(0);
    const [myTurn, setMyTurn] = useState(false);
    const [bingo, setBingo] = useState(0);
    const [won, setWon] = useState(false);

    useEffect(() => {
        if (!user || !room || !socket) {
            navigate('/');
        }

        // reseting the check grid
        resetCheck();

        if (socket) {

            // there is a change in players - update it
            socket.on('update-room', (newRoom) => {
                // console.log('updating room: ', newRoom);
                setRoom(newRoom);
            })

            // a player is ready - change its icon border to ready color
            socket.on('i-am-ready', (who) => {
                // setting color of player circle to blue
                console.log('player is ready');
                document.getElementById(who).classList.remove('not-ready');
                document.getElementById(who).classList.add('ready');

            })

            // a player is selected for turn
            socket.on('player-turn', (who) => {
                console.log('player turn in room: ', room);
                // setting all player`s circle color to blue (not ready)

                for (let player of room?.players) {
                    console.log(player);
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
            socket.on('current-move', (move, email) => {
                console.log('current move is', move);
                document.getElementById(email).style.stroke = '#8ee694'
                document.getElementById('move').style.transform = 'translateY(0px)'
                setNo(move);
            })

            // inform player that other player has played move
            socket.on('move-played', (who) => {
                document.getElementById(who).style.stroke = '#8ee694'
            })

            // match has finished
            socket.on('match-finish', winners => {
                setWinners(winners);
                navigate('/finish');
            })

            // inform others that 1 player won
            //color of winning player #e4ff00
            socket.on('player-won', (email) => {
                document.getElementById(email).style.stroke = '#e4ff00'
                console.log("player won: ", email);
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
                document.getElementById(user?.email).style.stroke = '#e4ff00'
                socket.emit('won-match', room?.roomId, user);
                setWon(true);
            }
        }
    }, [bingo])


    const sendMyMove = (move) => {
        console.log('sending my move: ', move);
        setNo(move);
        socket.volatile.emit('my-move', room?.roomId, move, user?.email);
        document.getElementById(user?.email).style.stroke = '#8ee694';
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

    const clickedNo = (no) => {
        if (myTurn) {
            sendMyMove(no);
        }
        else {
            sendMyMove(0);
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
            setSocket(null);
            setRoom(null);

        } catch (error) {

        }

        navigate('/');
    }

    const renderBingo = () => {
        const word = room?.boardSize === 7? "KURKURE" : "BINGOS";
        let elements = [];
        for (let i = 1; i <= room?.boardSize; i++) {
            elements.push(<span key={i} id={`letter${i}`} className="letter">{word[i - 1]}</span>)
        }
        return elements;
    }



    return (
        <div className='play'>
            <div className="players">
                {room?.players.map((val) => {
                    return <Player key={val.email} user={val.email} id={val.name} image={val.image}></Player>
                })}
            </div>
            <div className="timer" >
                <span className='moving' id='move'></span>
                <img src={Number[no]} alt="Time" style={{ position: 'relative', width: '75%' }} />
            </div>
            <div className="status">
                {!ready ? <span>Click on the boxes to fill them</span> : myTurn ? <span style={{ background: 'beige' }}>Your Turn to pick a number.</span> : <span>Wait for other player`s move</span>}
                {/* <span>Waiting for players to fill the grid</span> */}
            </div>
            {won ? null : <div className="board">
                {renderGrid(room?.boardSize)}
            </div>}
            <div className="bingo">
                {/* <span className="letter">B</span>
                <span className="letter">I</span>
                <span className="letter">N</span>
                <span className="letter">G</span> */}
                {renderBingo()}
            </div>
            <button onClick={handleExit} className='btn'>Exit</button>
        </div>
    )
}

export default Play 