const express = require('express')
const app = express()
const PORT = 3000 || process.env.PORT


const server = app.listen(PORT, ()=>{
    const host = server.address().address
    const port = server.address().port
    console.log('App listening at http://' + host + ':' + port)
})

const { getAllUsers, joinLobby, userLeave, getUserById } = require('./utils/users')
const { createRoom, getRooms, joinRoom, getRoomByUserId, userLeaveRoom,
        resetGameBoard, setReadyUser, setRandomMarks, chooseStartingPlayer, switchTurns, insertMoveToBoard, checkWin, resetRoom, getWinNodes, deleteRoom } = require('./utils/rooms')


app.use(express.static('public'));

const io = require('socket.io')(server)



io.on("connection", (socket) => {
    // console.log("CONNECTED: " + socket.id)

    socket.on('joinLobby', (userName) => {
        console.log("LOBBY JOINED", userName, socket.id)
        const user = joinLobby(socket.id, userName)
        const users = getAllUsers()
        const rooms = getRooms()

        //console.log("LOBBY JOIN: ", users, rooms)

        socket.emit('userInfo', user)
        io.emit('lobbyInfo', [users,  rooms])
    })

    socket.on('joinRoom', ([roomId, user]) => {
        //console.log("joining room")
        //console.log(roomId, user)
        const room = joinRoom(roomId, user)
        socket.join(roomId)

        socket.emit('joinRoom', room)
        socket.to(roomId).emit('updateUsersInGameRoom', room)
        const users = getAllUsers()
        const rooms = getRooms()
        io.emit("lobbyInfo", [users, rooms])

        console.log("room joined")
        console.log(getRooms())
    })

    socket.on('createRoom', ([roomName, roomPassword, user]) => {
        //console.log(roomName, roomPassword, "room" + socket.id)
        const roomId = "room" + socket.id
        let room = createRoom(roomName, roomPassword, roomId) 
        // console.log(user)
        room = joinRoom(roomId, user)
        // console.log(room)
        socket.join(roomId)
        
        console.log("room created")
        socket.emit("joinRoom", room)
        const rooms = getRooms()
        const users = getAllUsers()
        io.emit("lobbyInfo", [users, rooms])

        //console.log(socket.rooms)
    })


    socket.on('insertMoveToBoard', ([i, j, user]) => {
        // console.log("usermademove")
        // console.log(i, j, user)
        let room = getRoomByUserId(user.userId)
        room = insertMoveToBoard(room.roomId, i, j, user.userId)
        if ( checkWin(room.board) ) {
            // user.userId user that WON
            const winNodes = getWinNodes(room.board)
            io.to(room.roomId).emit('gameover', [room, user, winNodes])
            room = resetRoom(room.roomId)

            console.log('WIN')
            return
        }
        // console.log("not yet win")
        room = switchTurns(room.roomId)
        // console.log("BIG WIN")
        // console.log(checkWin(room.board))
        // console.log("SMALL WINS")
        // room.board.forEach(smallBoard => {
        //     console.log(checkWin(smallBoard))
        // })
        if(Array.isArray(room.board[j])){
            io.to(room.roomId).emit('nextTurn', [room, j])
        } else {
            io.to(room.roomId).emit('nextTurn', [room])
        }
    })


    socket.on('setReady', user => {
        const u = setReadyUser(user.userId)
        
        let room = getRoomByUserId(user.userId)

        if (room.usersInRoom.length < 2) return
        let isAllReady = true
        room.usersInRoom.forEach(user => {
            if (!user.ready) isAllReady = false
        });
        if (isAllReady) {
            room = setRandomMarks(room.roomId)
            room = chooseStartingPlayer(room.roomId)
            // getRooms().forEach(r => {
            //     console.log(r.usersInRoom)
            // })
            console.log("game starts")
            io.to(room.roomId).emit('gameStart', room)
        }
    }) 

    socket.on('leaveRoom', userId => {
        const user = getUserById(userId)
        let room = getRoomByUserId(user.userId)
        if(room) {
            room = userLeaveRoom(room.roomId, user.userId)
            if ( room.usersInRoom.length === 0) {
                let rooms = deleteRoom(room.roomId)
            } else {
                console.log('updateUsers in room')
                room = resetRoom(room.roomId)
                socket.to(room.roomId).emit('updateUsersInGameRoom', room)
            }            
        }
        //console.log(room)
        const rooms = getRooms()
        const users = getAllUsers()
        
        console.log("some users left some room")
        socket.emit('roomLeft')
        io.emit("lobbyInfo", [users, rooms])
    })

    socket.on('disconnect', () => {
        let user = getUserById(socket.id)
        //const user = userLeave(socket.id)
        

        if(user) {
            console.log(user.userName + " DISCONNECTED")
            let users = userLeave(user.userId)
            var room = getRoomByUserId(user.userId)
        }

        if(room) {
            room = userLeaveRoom(room.roomId, user.userId)
            console.log(room)
            if ( room.usersInRoom.length === 0) {
                let rooms = deleteRoom(room.roomId)
            } else {
                console.log('updateUsers in room')
                room = resetRoom(room.roomId)
                socket.to(room.roomId).emit('updateUsersInGameRoom', room)
                //socket.to(room.roomId).emit('opponentLeftRoom')
            }            
        }
        //console.log(room)
        const rooms = getRooms()
        const users = getAllUsers()
        //console.log("AFTER DISCONNECT", rooms, users)
        console.log("AFTER DISCONNECT")
        io.emit("lobbyInfo", [users, rooms])
    })
})


