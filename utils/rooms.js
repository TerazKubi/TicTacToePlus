const rooms = []

function createRoom(roomName, roomPassword, roomId) {
    const room = {
        roomName,
        roomPassword,
        roomId,
        usersInRoom: [],
        board: createBoard(),
        status: "waiting"
    }

    rooms.push(room)

    return room
}

function getRooms() {
    return rooms
}

function joinRoom(roomId, user) {
    const room = getRoomById(roomId)
    // console.log("from module")
    // console.log(room, user)
    room.usersInRoom.push(user)

    return room
}

function userLeaveRoom(roomId, userId) {
    const room = getRoomById(roomId)
    const index = room.usersInRoom.findIndex(user => user.userId === userId)
    if(index !== -1){
        return room.usersInRoom.splice(index, 1)[0]
    }
}

function getRoomById(roomId) {
    return rooms.find(room => room.roomId === roomId)
}
function getRoomByUserId(userId) {
    return rooms.find(room => room.usersInRoom.find(user => user.userId === userId))
}

function setRoomStatus(roomId, status) {
    const room = getRoomById(roomId)
    room.status = status
    return room
}

function createBoard() {
    const board = []
    for (let i = 0; i < 9; i++) {
        board.push(new Array(9).fill(''))       
    }
    return board
}

function resetGameBoard(roomId) {
    const room = getRoomById(roomId)
    room.board = createBoard()
    return room
}

function setReadyUser(userId) {
    const room = getRoomByUserId(userId)
    const user = room.usersInRoom.find(user => user.userId === userId)
    user.ready = true
    return user
}

function setRandomMarks(roomId) {
    const room = getRoomById(roomId)
    const marks = {
        0: 'x',
        1: 'o'
    }
    
    room.usersInRoom[0].mark = marks[Math.floor(Math.random() * 2)]
    room.usersInRoom[0].mark === 'x' ? room.usersInRoom[1].mark = marks[1] : room.usersInRoom[1].mark = marks[0]

    return room
}

module.exports = {
    createRoom,
    getRooms,
    joinRoom,
    getRoomByUserId,
    userLeaveRoom,
    setRoomStatus,
    resetGameBoard,
    setReadyUser,
    setRandomMarks
}