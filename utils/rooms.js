const e = require("express")

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

function deleteRoom( roomId ) {
    const index = rooms.findIndex(room => room.roomId === roomId)
    if(index !== -1) return rooms.splice(index, 1)[0]

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
    if(index !== -1) {
        room.usersInRoom.splice(index, 1)[0]
        return room
    }
    return room
}

function getRoomById(roomId) {
    return rooms.find(room => room.roomId === roomId)
}
function getRoomByUserId(userId) {
    return rooms.find(room => room.usersInRoom.find(user => user.userId === userId))
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

function chooseStartingPlayer(roomId){
    const room = getRoomById(roomId)
    room.usersInRoom[Math.floor(Math.random() * 2)].yourTurn = true

    return room
}
function insertMoveToBoard(roomId, i, j, userId) {
    const room = getRoomById(roomId)
    const user = getUserFromRoom(userId, roomId)
    
    room.board[i][j] = user.mark
    for (let i = 0; i < room.board.length; i++) {
        // console.log(checkWin(room.board[i]))
        if (checkWin(room.board[i]) && room.board[i] !== 'x' && room.board[i] !== 'o') room.board[i] = user.mark
        
    }
    
    return room
}
function switchTurns(roomId){
    const room = getRoomById(roomId)
    if(room.usersInRoom[0].yourTurn) {
        room.usersInRoom[0].yourTurn = false
        room.usersInRoom[1].yourTurn = true
    } else {
        room.usersInRoom[0].yourTurn = true
        room.usersInRoom[1].yourTurn = false
    }
    return room
}

function resetRoom(roomId) {
    const room = getRoomById(roomId)
    room.usersInRoom.forEach(user => {
        user.yourTurn = false
        user.mark = ''
        user.ready = false
    })
    
    room.board = createBoard()
    return room
}

function getUserFromRoom(userId, roomId) {
    const room = getRoomById(roomId)
    return room.usersInRoom.find(user => user.userId === userId)
}

function checkWin(board) {
    if(board[0]==board[1] && board[1]==board[2] && board[0]!=''){        
        return true
    }else if(board[3]==board[4] && board[4]==board[5] && board[3]!=''){ 
        return true
    }else if(board[6]==board[7] && board[7]==board[8] && board[6]!=''){  
        return true
    }else if(board[0]==board[3] && board[3]==board[6] && board[0]!=''){  
        return true
    }else if(board[1]==board[4] && board[4]==board[7] && board[1]!=''){  
        return true
    }else if(board[2]==board[5] && board[5]==board[8] && board[2]!=''){ 
        return true
    }else if(board[0]==board[4] && board[4]==board[8] && board[0]!=''){  
        return true
    }else if(board[2]==board[4] && board[4]==board[6] && board[2]!=''){  
        return true
    }
    return false  
}

function getWinNodes(board) {
    if(board[0]==board[1] && board[1]==board[2] && board[0]!=''){        
        return [0,1,2]
    }else if(board[3]==board[4] && board[4]==board[5] && board[3]!=''){ 
        return [3,4,5]
    }else if(board[6]==board[7] && board[7]==board[8] && board[6]!=''){  
        return [6,7,8]
    }else if(board[0]==board[3] && board[3]==board[6] && board[0]!=''){  
        return [0,3,6]
    }else if(board[1]==board[4] && board[4]==board[7] && board[1]!=''){  
        return [1,4,7]
    }else if(board[2]==board[5] && board[5]==board[8] && board[2]!=''){ 
        return [2,5,8]
    }else if(board[0]==board[4] && board[4]==board[8] && board[0]!=''){  
        return [0,4,8]
    }else if(board[2]==board[4] && board[4]==board[6] && board[2]!=''){  
        return [2,4,6]
    }
}

module.exports = {
    createRoom,
    getRooms,
    joinRoom,
    getRoomByUserId,
    userLeaveRoom,
    resetGameBoard,
    setReadyUser,
    setRandomMarks,
    chooseStartingPlayer,
    switchTurns,
    insertMoveToBoard,
    checkWin,
    resetRoom, 
    getWinNodes,
    deleteRoom
}