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

const availableSockets = {}
const availableRooms = {}

io.on('connect', socket => {
    const { name, image, email } = socket.handshake.query
    availableSockets[email] = { name, image, socketId: socket.id };
    console.log("connected", email, availableSockets[email])


    socket.on('create-room', (room) => {
        // console.log(room);
        availableRooms[room.roomId] = room;
        socket.join(room.roomId)
        console.log("players rooms: ", availableRooms[room.roomId].players);
    })

    socket.on('join-room', (roomId, callback) => {
        const ids = Object.keys(availableRooms);
        if (ids.indexOf(roomId) === -1) {
            callback({ status: 'fail' })
        }
        else {
            socket.join(roomId);
            const { name, email, image } = socket.handshake.query
            availableRooms[roomId].players.push({ name, email, image });

            console.log("player added to room: ",roomId);   
            socket.broadcast.to(roomId).emit('update-room', availableRooms[roomId]);

            callback({ status: 'success', room: availableRooms[roomId] });
        }
    })

    // function to remove player from availableRooms(does not remove the player from the room)
    const leave_room = (roomId, email)=>{
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
            socket.broadcast.to(roomId).emit('update-room', availableRooms[roomId]);

        }
    }

    // when a player is kicked from the room
    socket.on('remove-player', (roomId, email)=>{
        leave_room(roomId, email);
        socket.to(availableSockets[email].socketId).emit('kick-player');
        socket.emit('update-room', availableRooms[roomId]);
    })

    // when a player wants to leave the room
    socket.on('leave-room', (roomId, email) => {
        // console.log('availabe players', availableRooms[roomId]);
        leave_room(roomId, email);
        socket.leave(roomId);
    })

    socket.on('change-board-size', (id, size) => {
        console.log('change board size to: ', id, size);
        if (Object.keys(availableRooms).indexOf(id) !== -1) {
            availableRooms[id].boardSize = size;
            // console.log('new room: ', availableRooms[id])
            socket.broadcast.to(id).emit('update-room', availableRooms[id]);
        }
    })

    socket.on('delete-room', (roomId) => {
        socket.broadcast.in(roomId).emit('room-deleted', roomId);
        io.in(roomId).socketsLeave(roomId);
        let id = delete availableRooms[roomId];
        console.log("deleted room: ", id);
    })


//---------------- game logic chat---------------------------------
    socket.on('start', (roomId)=>{
        // console.log('start', roomId);
        socket.broadcast.in(roomId).emit('start-game');
        let room = availableRooms[roomId]
        room['ready'] = 0;
        room['currentPlayer'] = 0;
        room['played'] = 0;
        room['playing'] = room['players'];
        room['won'] = [];
        availableRooms[roomId] = room;
        console.log('start: ',availableRooms[roomId]);
    })

    // function to select next player for the move
    const nextMove = (room)=>{
        let playerlength = room.playing.length;
        if(playerlength === 1){
            console.log('Match finished: ', room?.roomId);
            room.won.push(room.playing[0]);
            console.log('room:', room);
            io.in(room?.roomId).emit('match-finished', room.won);
            io.in(room?.roomId).socketsLeave(room?.roomId);
            return;
        }
        let currPlayer = room.currentPlayer;
        currPlayer = (currPlayer + 1) % playerlength;

        let mail = room.playing[currPlayer].email;
        let socketId = availableSockets[mail].socketId;
        console.log('sending turn to: ', mail, socketId);
        availableRooms[room.roomId].currentPlayer = currPlayer;
        io.to(socketId).emit('your-turn');
    }

    // next-player selected a no
    socket.on('my-move', (roomId, move)=>{
        console.log(socket.handshake.query.email,'`s move is',move);
        // availableRooms[roomId].played += 1;
        if(move !== 0){
            socket.broadcast.in(roomId).emit('move-is', move);
            let timer = setTimeout(()=>{
                console.log('calling from timer')
                nextMove(availableRooms[roomId]);
            },5000)
        }
        else{
            console.log('calling from outside timer')
            nextMove(availableRooms[roomId]);
        }
    })

    socket.on('won-match', (roomId, user)=>{
        console.log(roomId, user);
        console.log(availableRooms[roomId]);
        availableRooms[roomId].won.push(user);
        let playing = availableRooms[roomId].playing;
        let remain = playing.filter((val)=>{
            return val?.email !== user.email;
        })
        availableRooms[roomId].playing = remain;
        socket.in(roomId).emit('bingo', (user.email));
    
    })

    socket.on('player-ready', (roomId)=>{
        console.log('player ready in: ', roomId);
        availableRooms[roomId].ready += 1;
        if(availableRooms[roomId].players.length === availableRooms[roomId].ready)
        {
            io.in(roomId).emit('all-ready');
            console.log('calling from player-ready')
            nextMove(availableRooms[roomId]);
        }
        socket.broadcast.in(roomId).emit('iam-ready', socket.handshake.query.email);
    })



//-----------------------------------------------------------------------------------
    socket.on('disconnect', () => {
        delete availableSockets[socket.id];
        let email = socket.handshake.query.email;
        console.log('email:', email);
        outer:
        for(id of Object.keys(availableRooms)){
            let room = availableRooms[id];
            for(player of room.players){
                if(player.email === email){
                    console.log('leave room')
                    leave_room(id, email);
                    break outer;
                }
            }
        }
        console.log("disconnected", socket.id)
    })
})




module.exports = { app, server, io }
