const express = require('express')
const app = express()
const PORT = 3000 || process.env.PORT


const server = app.listen(PORT, ()=>{
    const host = server.address().address
    const port = server.address().port
    console.log('App listening at http://' + host + ':' + port)
})

const { getAllUsers, joinLobby, userLeave, getUserById } = require('./utils/users')
const { createRoom, getRooms, joinRoom, getRoomByUserId, userLeaveRoom, setRoomStatus, resetGameBoard, setReadyUser, setRandomMarks } = require('./utils/rooms')


app.use(express.static('public'));

const io = require('socket.io')(server)



io.on("connection", (socket) => {
    console.log("CONNECTED: " + socket.id)

    socket.on('joinLobby', (userName) => {
        console.log("LOBBY JOINED", userName, socket.id)
        const user = joinLobby(socket.id, userName)
        const users = getAllUsers()
        const rooms = getRooms()

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

        //console.log(socket.rooms)
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
        

        socket.emit("joinRoom", room)
        const rooms = getRooms()
        const users = getAllUsers()
        io.emit("lobbyInfo", [users, rooms])

        //console.log(socket.rooms)
    })


    socket.on('insertMoveToBoard', ([i, j, user]) => {
        console.log("usermademove")
        console.log(i, j, user)
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
            io.to(room.roomId).emit('gameStart', room)
            room = setRoomStatus(room.roomId, 'playing')
            room = setRandomMarks(room.roomId)
            getRooms().forEach(r => {
                console.log(r.usersInRoom)
            })
        }
    }) 

    

    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        const users = getAllUsers()

        if(!user) return
        console.log(user.userName + " DISCONNECTED")

        //console.log(users)
        

        //check if user was in room and remove him
        let room = getRoomByUserId(user.userId)
        const userl = userLeaveRoom(room.roomId, user.userId)
        if(userl) {
            socket.to(room.roomId).emit('updateUsersInGameRoom', room)
            room = setRoomStatus(room.roomId, "waiting")
            room = resetGameBoard(room.roomId)
        }
        console.log(room)
        const rooms = getRooms()
        io.emit("lobbyInfo", [users, rooms])
    })
})


