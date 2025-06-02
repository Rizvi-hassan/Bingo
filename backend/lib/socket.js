const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { connect } = require("http2");
const { instrument } = require('@socket.io/admin-ui')

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://bingo-multiplayer.netlify.app", 'http://localhost:5173', "https://admin.socket.io"],
        methods: ['GET', 'POST'],
        credentials: true
    },
});

instrument(io, {
    auth: false
})

const availableSockets = {} // stores {email: {name, image, socketid} } - of all online sockets
const availableRooms = {} // saves room info 


io.on('connect', socket => {

    // ---------------------------ROOM CREATION AND MANIPULATION CHAT------------------------------------------

    const { name, image, email } = socket.handshake.query
    availableSockets[email] = { name, image, socketId: socket.id };
    // console.log("connected", email, availableSockets[email])


    // creates a room variable and stores in availabelRooms
    socket.on('create-room', (room) => {
        // console.log(room);
        availableRooms[room.roomId] = room;
        socket.join(room.roomId)
        // console.log("players rooms: ", availableRooms[room.roomId].players);
    })

    // handles player joining a room event 
    socket.on('join-room', (roomId, callback) => {
        const ids = Object.keys(availableRooms);

        if (ids.indexOf(roomId) === -1) {
            callback({ status: 'fail' })
        }
        else if(availableRooms[roomId].playing){
            // game started
            callback({status: 'fail'})
        }
        else {
            socket.join(roomId);
            const { name, email, image } = socket.handshake.query
            availableRooms[roomId].players.push({ name, email, image });

            // console.log("player added to room: ",roomId);   
            socket.broadcast.to(roomId).emit('update-room', availableRooms[roomId]); // inform other players that a new player has joined 

            callback({ status: 'success', room: availableRooms[roomId] });
        }
    })

    // removes the player (email) from a current room
    const leave_room = (roomId, email) => {
        if (Object.keys(availableRooms).indexOf(roomId) !== -1) {
            let players = availableRooms[roomId].players;
            // console.log('players: ', players)
            let remaining = players.filter((val) => {
                return val.email !== email
            })
            // availableRooms[roomId].players = players;
            // console.log('remaining players: ', remaining)
            availableRooms[roomId].players = remaining;
            console.log('player to delete', email, roomId);
            socket.broadcast.to(roomId).emit('update-room', availableRooms[roomId]); // inform other players that a player has left

        }
    }

    // when a player is kicked from the room
    socket.on('remove-player', (roomId, email) => {
        leave_room(roomId, email);
        socket.to(availableSockets[email].socketId).emit('kick-player'); // sends message to the player being kicked out.
        socket.emit('update-room', availableRooms[roomId]); // this method is called in leave_room also, so not necessary to call again
    })

    // when a player wants to leave the room
    socket.on('leave-room', (roomId, email) => {
        // console.log('availabe players', availableRooms[roomId]);
        leave_room(roomId, email);
        socket.leave(roomId);
    })

    // when the host changes the board size, it informs other players in the room for an update 
    socket.on('change-board-size', (id, size) => {
        console.log('change board size to: ', id, size);
        if (Object.keys(availableRooms).indexOf(id) !== -1) {
            availableRooms[id].boardSize = size;
            // console.log('new room: ', availableRooms[id])
            socket.broadcast.to(id).emit('update-room', availableRooms[id]);
        }
    })

    // the host leaves the room so, room has to be deleted.
    socket.on('delete-room', (roomId) => {
        socket.broadcast.in(roomId).emit('room-deleted', roomId);
        io.in(roomId).socketsLeave(roomId);
        let id = delete availableRooms[roomId];
        console.log("deleted room: ", id);
    })


    //---------------- GAME LOCIC CHAT---------------------------------

    // host starts the game. new variables in room is added to store current state of the game
    socket.on('start', (roomId) => {
        // console.log('start', roomId);
        let room = availableRooms[roomId]
        room['ready'] = 0; // number of players ready with their board
        room['played'] = 0; // number of players played their move
        room['playing'] = room['players']; // current playing players queue, first one is the current player
        room['won'] = []; // array to store the winners in there winning order
        room['move'] = 0; // holds the current move, if selected else 0
        availableRooms[roomId] = room;
        socket.broadcast.in(roomId).emit('start-game');
        // console.log('start: ',availableRooms[roomId]);
    })

    // a player in the room is ready
    socket.on('ready', (roomId, email) => {
        availableRooms[roomId].ready += 1;

        socket.broadcast.in(roomId).emit('i-am-ready', email);
        // check if all players are ready

        console.log('player ready in room: ', availableRooms[roomId])

        if (availableRooms[roomId].ready === availableRooms[roomId].playing.length) {
            selectTurn(roomId);
        }
    })


    // select a player to play its turn
    const selectTurn = (roomId) => {

        // choosing the first player of playing list as current player
        if (availableRooms[roomId].playing.length > 0) {
            let currentPlayer = availableRooms[roomId].playing[0];
            // console.log('selecting player: ', currentPlayer);
            io.in(roomId).emit('player-turn', currentPlayer.email);
            availableRooms[roomId].move = 0;
        } else {
            // no player is in playing list
            console.log('no player in playing list');
        }
    }


    // recieves player`s move
    socket.on('my-move', (roomId, move, mail, isWon) => {
        if (move !== 0) {
            // if move != 0 player was selected for move and his move is move
            // boradcast this move to all other players
            socket.broadcast.in(roomId).emit('current-move', move, mail, isWon);

            // setting current move
            availableRooms[roomId].move = move;
        }
        else {
            // if move == 0 player has played the current move
            socket.broadcast.in(roomId).emit('move-played', mail, isWon);
        }
        // as 1 player played  
        availableRooms[roomId].played += 1;

        if(isWon) wonMatch(roomId, mail);

        // check if all players played
        checkPlayed(roomId);
    })

    // a player won match
    const wonMatch = (roomId, mail) => {

        // removing the player from playing queue
        let user = null;
        let playing = availableRooms[roomId].playing;
        let remain = playing.filter((val) => {
            if (val.email !== email){
                return true;
            }
            else{
                user = val;
                return false
            }
        })
        availableRooms[roomId].playing = remain;

        // adding player to won queue
        let toSave = {...user, ['rank']:availableRooms[roomId].won.length+1};
        availableRooms[roomId].won.push(user);

        console.log('player won: ', user.email);


    }


    // check if all players played move
    const checkPlayed = (roomId) => {
        // console.log('checking if all played\n', availableRooms[roomId])
        let played = availableRooms[roomId].played;
        if (played >= availableRooms[roomId].playing.length) {
            // all players played, reset played for next round
            availableRooms[roomId].played = 0;
            checkBingo(roomId);
        }
        // else not all player played - wait
    }

    // check if all player won
    const checkBingo = (roomId) => {
        console.log('checking for bingo')
        if (availableRooms[roomId].playing.length > 1) {
            // game is not finished
            // select another player for turn from playing queue
            let currentPlayer = availableRooms[roomId].playing.shift(0);
            availableRooms[roomId].playing.push(currentPlayer);


            console.log('\n selecting next player\n', availableRooms[roomId])
            // call player-turn
            selectTurn(roomId);
        }
        else {
            // game is finished

            // push the last playing player in won queue
            let remainPlayer = availableRooms[roomId].playing.shift();
            if (remainPlayer) {
                availableRooms[roomId].won.push(remainPlayer);
            }

            io.in(roomId).emit('match-finish', availableRooms[roomId].won);

            // delete the room and remove all sockets
            io.socketsLeave(roomId);
            delete availableRooms[roomId];
        }
    }



    //------------------------------------HANDLES THE EVENT WHEN A SOCKET IS DISCONNECTED-----------------------------------------------

    // player disconnected due to network issue or any other error
    socket.on('disconnect', () => {
        delete availableSockets[socket.id];
        let email = socket.handshake.query.email;
        console.log('email:', email);

        outer:
        for (id of Object.keys(availableRooms)) {
            let room = availableRooms[id];
            for (player of room.players) {
                if (player.email === email) {
                    console.log('leave room')
                    // if the current player left 
                    if (availableRooms[id].playing?.length > 0 && availableRooms[id].playing[0] && availableRooms[id].playing[0].email === email ) {
                        availableRooms[id].playing.shift();
                        // if all players are not ready, no need to go for select turn
                        if (room.ready >= room.playing.length) {

                            // if player had not selected turn
                            if (availableRooms[id].move === 0){
                                selectTurn(id);
                            }
                            else{
                                // player selected a turn - reduce played count by 1 and call checkedPlayed
                                availableRooms[id].played -= 1;
                                checkPlayed(id);
                            }
                        }
                    }
                    else {
                        // the disconnected player is not current player

                        // remove him from playing list and check if all remaining players played or not
                        let remain = availableRooms[id].playing.filter((val) => {
                            return val.email !== email
                        })
                        availableRooms[id].playing = remain;
                        // if all players are not ready, no need to go for  checkPlayed
                        if (room.ready >= room.playing.length) {
                            checkPlayed(id);
                        }
                    }


                    // remove the player from the room
                    leave_room(id, email);
                    break outer;
                }
            }
        }
        console.log("disconnected", socket.id)
    })
})




module.exports = { app, server, io }
