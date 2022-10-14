
const marksClassNames = {
    x: "mark-X",
    o: "mark-O",
    '': 'no-mark'
    
}

readyButton.addEventListener('click', () => {
    socket.emit("setReady", user)
})
leaveRoomButton.addEventListener('click', () => {
    socket.emit('leaveRoom', user.userId)
})

socket.on("joinRoom", (room) => {  
    showGameRoom(room)   
})

socket.on('updateUsersInGameRoom', (room) => {
    updateUsersInGameRoom(room)
    drawEmptyBoard()
})

socket.on('gameStart', (room) => {
    console.log('gamestart', user)
    updateUsersInGameRoom(room)
    drawBoard(room, user.userId)
})

socket.on('nextTurn', ([room, target]) => {

    drawBoard(room, user.userId, target)
})

socket.on('gameover', ([room, userWinner, winNodes]) => {
    drawBoardAfterWin(room, userWinner, winNodes)
    hideMarksAndBubbles(leftCard, rightCard)
})

socket.on('roomLeft', () => {
    hideElement(roomContainer)
})

// socket.on('opponentLeftRoom', () => {
//     drawEmptyBoard()
// })

function showGameRoom(room) {
    showElement(roomContainer)
    updateUsersInGameRoom(room)
    drawEmptyBoard()
    console.log("ROOM RENDERED", room)
}


function updateUsersInGameRoom(room) {
    console.log("update users in room", room)

    hideMarksAndBubbles(leftCard, rightCard)
    hideElement(leftCard)
    hideElement(rightCard)

    room.usersInRoom.forEach(u => {
        console.log(u)
        if (u.userId === user.userId) {

            showElement(leftCard)
            leftCard.querySelector('.name').innerText = u.userName
            leftCard.querySelector('.littleName').innerHTML = "<span>" + u.userName.slice(0, 2) + "</span>"
            if (u.mark !== "") leftCard.querySelector('.markContainer').classList.add(marksClassNames[u.mark])
        } else {
            showElement(rightCard)
            rightCard.querySelector('.name').innerText = u.userName
            rightCard.querySelector('.littleName').innerHTML = "<span>" + u.userName.slice(0, 2) + "</span>"
            if (u.mark !== "") rightCard.querySelector('.markContainer').classList.add(marksClassNames[u.mark])
        }
    })
}

function drawBoard(room, userId, target=null){
    const gameContainer = document.querySelector('.gameContainer')
    gameContainer.innerHTML = ''
    const board = room.board
    const user = room.usersInRoom.find(u => u.userId === userId)
    
    //console.log(board)
    console.table(board)
    
    
    console.log(user)
    if (user.yourTurn) {
        drawBoardMyTurn(gameContainer, board, target)
        
    } else {
        console.log('drwboard enemy turn')
        drawBoardEnemyTurn(gameContainer, board)
        
    }
    showTurn(user.yourTurn)
}

function clickOnNode(i, j) {
    console.log(i, j)
    socket.emit('insertMoveToBoard', [i, j, user])
}

function drawBoardEnemyTurn(gameContainer, board) {
    console.log('from functin draw eneym turn')

    for (let i = 0; i < board.length; i++) {
        
        const newBigNode = document.createElement('div')
        newBigNode.classList.add('bigNode')
        
        
        if( !Array.isArray(board[i]) ) {
            console.log('from check 1')
            newBigNode.classList.add(marksClassNames[board[i]])
            gameContainer.append(newBigNode)
            continue
        }
        
        for (let j = 0; j < board[i].length; j++) {
            
            const newSmallNode = document.createElement('div')
            newSmallNode.classList.add('smallNode')
            newSmallNode.classList.add(marksClassNames[board[i][j]])
                      
            newBigNode.appendChild(newSmallNode)
            
        }
        
        gameContainer.append(newBigNode)
    }
}

function drawBoardMyTurn(gameContainer, board, target=null){
    

    for (let i = 0; i < board.length; i++) {
        const newBigNode = document.createElement('div')
        newBigNode.classList.add('bigNode')

        if( !Array.isArray(board[i]) ) {
            newBigNode.classList.add(marksClassNames[board[i]])
            gameContainer.append(newBigNode)
            
            continue
        }
        
        if( target === null || target === i ) {
            newBigNode.classList.add('target')
        } 

        for (let j = 0; j < board[i].length; j++) {
            const newSmallNode = document.createElement('div')
            newSmallNode.classList.add('smallNode')
            newSmallNode.classList.add(marksClassNames[board[i][j]])
            newBigNode.appendChild(newSmallNode)
            
            
            // no target you can click all
            if(target === null ) {

                newSmallNode.addEventListener("click", (e) => {
                    e.stopPropagation()
                    clickOnNode(i, j)
                })
                
            } 
            // target
            else if ( target === i ) {
                newSmallNode.addEventListener("click", (e) => {
                    e.stopPropagation()
                    clickOnNode(i, j)
                })
            }
                  
        }

        gameContainer.append(newBigNode)
    }
}

function drawBoardAfterWin(room, userWinner, winNodes) {
    const gameContainer = document.querySelector('.gameContainer')
    const board = room.board

    gameContainer.innerHTML = ''

    for (let i = 0; i < board.length; i++) {
        const newBigNode = document.createElement('div')
        newBigNode.classList.add('bigNode')

        if( !Array.isArray(board[i]) ) {
            newBigNode.classList.add(marksClassNames[board[i]])
            if (winNodes.includes(i) ) {
                userWinner.userId === user.userId ?  newBigNode.classList.add('winNode') : newBigNode.classList.add('loseNode')
            } 
            gameContainer.append(newBigNode)
            continue
        }
        
        for (let j = 0; j < board[i].length; j++) {
            const newSmallNode = document.createElement('div')
            newSmallNode.classList.add('smallNode')
            newSmallNode.classList.add(marksClassNames[board[i][j]])           
            newBigNode.appendChild(newSmallNode)
            
        }

        gameContainer.append(newBigNode)
    }
}
function drawEmptyBoard() {
    const gameContainer = document.querySelector('.gameContainer')
    gameContainer.innerHTML = ''

    for (let i = 0; i < 9; i++) {
        
        const newBigNode = document.createElement('div')
        newBigNode.classList.add('bigNode')
        
        for (let j = 0; j < 9; j++) {
            
            const newSmallNode = document.createElement('div')
            newSmallNode.classList.add('smallNode')
            newBigNode.appendChild(newSmallNode)           
        }        
        gameContainer.append(newBigNode)
    }
}
function showTurn(isMyTurn) {
    if (isMyTurn) {
        hideElement(rightCardBubble)
        showElement(leftCardBubble)
        leftCard.style.border = '2px solid orange'
        rightCard.style.border = '2px solid white'
    } else {
        hideElement(leftCardBubble)
        showElement(rightCardBubble)
        rightCard.style.border = '2px solid orange'
        leftCard.style.border = '2px solid white'
    }
}

function hideMarksAndBubbles(left, right) {
    left.querySelector('.markContainer').classList.remove(marksClassNames['x'])
    left.querySelector('.markContainer').classList.remove(marksClassNames['o'])
    right.querySelector('.markContainer').classList.remove(marksClassNames['x'])
    right.querySelector('.markContainer').classList.remove(marksClassNames['o'])
    hideElement(leftCardBubble)
    hideElement(rightCardBubble)
    rightCard.style.border = '2px solid white'
    leftCard.style.border = '2px solid white'
}