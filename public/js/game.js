
socket.on('updateUsersInGameRoom', (room) => {
    updateUsersInGameRoom(room)
})

socket.on('gameStart', (room) => {
    console.log("game start")
    drawBoard(room.board)
})



function showGameRoom(room) {
    const chatContainer = document.querySelector('.chatContainer')
    
    room.usersInRoom.forEach(user => {
        chatContainer.innerHTML += user.userName + "<br/>"
    });
   

    roomContainer.style.display = "block"
    console.log("ROOM RENDERED", room)
}

function updateUsersInGameRoom(room) {
    const chatContainer = document.querySelector('.chatContainer')
    chatContainer.innerHTML = ""
    room.usersInRoom.forEach(user => {
        chatContainer.innerHTML += user.userName + "<br/>"
    });
}

function drawBoard(board){
    const gameContainer = document.querySelector('.gameContainer')

    board.forEach((bigNode, i) => {
        const newBigNode = document.createElement('div')
        newBigNode.classList.add('bigNode')
        bigNode.forEach((smallNode, j) => {
            const newSmallNode = document.createElement('div')
            newSmallNode.classList.add('smallNode')
            newSmallNode.addEventListener("click", (e) => {
                clickOnNode(i, j)
                e.stopPropagation()
            })
            newSmallNode.innerHTML = smallNode
            newBigNode.appendChild(newSmallNode)
        })
        // for(let j = 0; j < 9; j++) {
        //     newBigNode.innerHTML += "<div class='SmallNode' onclick='clickOnNode("+i+","+j+")'></div>"
        // }
        gameContainer.append(newBigNode)
    })
}

function clickOnNode(i, j) {
    console.log(i, j)
    socket.emit('insertMoveToBoard', [i, j, user])
}