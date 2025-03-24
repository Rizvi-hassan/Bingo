import './Play.css'
import React, { useContext, useEffect, useState } from 'react'
import { Player } from './Player'
import Number from './Number'
import Grid_4 from './Grids/Grid_4'
import Grid_5 from './Grids/Grid_5'
import Grid_6 from './Grids/Grid_6'
import UserContext from '../../Contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { resetCheck } from './CheckBingo.mjs'

const Play = () => {

    const navigate = useNavigate();
    const context = useContext(UserContext)
    const { user, room, socket, setSocket, setRoom, setWinners } = context;


    const [ready, isReady] = useState(false);
    const [no, setNo] = useState(0);
    const [myTurn, setMyTurn] = useState(false);
    const [bingo, setBingo] = useState(0);

    // declaring timer as global

    useEffect(() => {
        if (!user || !room || !socket) {
            navigate('/');
        }

        // reseting the check grid
        resetCheck();

        if (socket) {

            socket.on('your-turn', () => {
                // console.log("my turn");
                setMyTurn(true);
                // document.getElementById(user?.email).classList.add('logoTimer');
                document.getElementById(user?.email).style.stroke ='#8ee694'
                
            })

            socket.on('all-ready', () => {
                // console.log('all ready');
            })

            // if a user is ready, its status is recieved here to mark its icon ready
            socket.on('iam-ready', (email) => {
                // console.log(email, 'is ready');
                document.getElementById(email).classList.remove('not-ready');
                document.getElementById(email).classList.add('ready');
            })

            // this recieves the move which was called. I have to play the move
            socket.on('move-is', (move)=>{
                // console.log('current move is: ', move);
                setNo(move);
                document.getElementById('move').classList.add('moveTimer');    
                setTimeout(()=>{
                    document.getElementById('move').classList.remove('moveTimer');   
                }, 5000)
            })

            // player has done bingo
            socket.on('bingo', (who)=>{
                // console.log('BINGO: ****', who, '***');
            })

            // match is finished
            socket.on('match-finished', (winners)=>{
                // console.log('match finished', winners);
                setWinners(winners);
                socket.disconnect();
                setSocket(null);
                setRoom(null);
                navigate('/finish');
            })
        }
    }, [])


    // this is a usefull comment. If we want that a user has limited time to choose a number.
    // useEffect(() => {
    //     let timerId;
    //     if(myTurn){
    //         timerId = setTimeout(() => {
    //             console.log('I did not select a move:', myTurn);
    //             if (myTurn) sendMyMove(0);
    //         }, 10000);
    //     }

    //     return () => {
    //         if(myTurn) clearInterval(timerId);
    //     };
    // }, [myTurn]);


    useEffect(()=>{
        
        if(bingo > 0){
            for (let i = 1; i <= bingo; i++) {
                document.getElementById(`letter${i}`).classList.add('letter-active');
            }
        }

        if(bingo >= room?.boardSize){
            console.log('--------------------------------')
            console.log('Won the match!!: ');
            console.log('--------------------------------')
            console.log(room?.roomId);
            socket.emit('won-match', room?.roomId, user);
        }
    }, [bingo])


    const sendMyMove = (move)=>{
        setNo(move);
        socket.volatile.emit('my-move', room?.roomId, move);
        document.getElementById(user?.email).style.stroke ='#8ECAE6';
        setMyTurn(false);
    }

    const setPlayerReady = () => {
        // console.log('player ready')
        document.getElementById(user?.email).classList.remove('not-ready');
        document.getElementById(user?.email).classList.add('ready');
        socket.emit('player-ready', room?.roomId);
        isReady(true);
    }

    const clickedNo = (no) => {
        document.getElementById('move').classList.remove('moveTimer');
        if(myTurn){
            sendMyMove(no);
        }
        else{
            sendMyMove(0);
        }

    }

    const renderGrid = (size) => {
        switch (size) {
            case 4: return <Grid_4 setBingo={setBingo} bingo={bingo} no={no} myTurn={myTurn} ready={ready} setPlayer={setPlayerReady} clickedNo={clickedNo} />

            case 5: return <Grid_5 setBingo={setBingo} bingo={bingo} no={no} myTurn={myTurn} ready={ready} setPlayer={setPlayerReady} clickedNo={clickedNo} />

            case 6: return <Grid_6 setBingo={setBingo} bingo={bingo} no={no} myTurn={myTurn} ready={ready} setPlayer={setPlayerReady} clickedNo={clickedNo} />
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
        const word = "BINGOS";
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
                <img src={Number[no]} alt="Time" style={{position:'relative', height:'100%'}}/>
                </div>
            <div className="status">
                {!ready? <span>Click on the boxes to fill them</span> : myTurn? <span style={{background:'beige'}}>Your Turn to pick a number.</span>:<span>Wait for other player`s move</span>}
                {/* <span>Waiting for players to fill the grid</span> */}
            </div>
            <div className="board">
                {renderGrid(room?.boardSize)}
            </div>
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