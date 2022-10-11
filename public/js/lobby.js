const socket = io()

const playersInLobbyDiv = document.querySelector('.graczeList')
const roomsBox = document.querySelector('.games')

const newRoomButton = document.querySelector('.newRoomButton')
const createRoomButton = document.querySelector('#createRoomButton')
const createRoomBox = document.querySelector('#createRoomBoxContainer')

const roomNameInput = document.querySelector('#roomNameInput')
const roomPasswordInput = document.querySelector('#roomPassword')

const bluredBg = document.querySelector('.bluredBackground')

const joinRoomWithPasswordBox = document.querySelector('#joinRoomContainer')
const roomPasswordJoinInput = document.querySelector('#inputRoomPassword')
const joinRoomWithPasswordButton = document.querySelector('#joinRoomWithPasswordButton')

//in game ==========================================
const roomContainer = document.querySelector('.roomContainer')
const leftCard = document.querySelector('#leftCard')
const leftCardBubble = leftCard.querySelector('.bubble')
const rightCard = document.querySelector('#rightCard')
const rightCardBubble = rightCard.querySelector('.bubble')

const readyButton = document.querySelector('#ready')
const leaveRoomButton = document.querySelector('.leaveRoomButton')

const {userName} = Qs.parse(location.search, {ignoreQueryPrefix: true})

let user
let lobbyUsers

// roomContainer.style.display = "block"

newRoomButton.addEventListener("click", ()=>{
    
    showElement(createRoomBox)
    showElement(bluredBg)
    
    console.log("siema")
    roomNameInput.value = userName + "'s room"
    roomPasswordInput.focus()
})
createRoomButton.addEventListener("click", () => {
    const roomName = roomNameInput.value
    const roomPassword = roomPasswordInput.value || ""

    socket.emit("createRoom", [roomName, roomPassword, user])
})
document.addEventListener("click", e => {
    
    if ( createRoomBox.contains(e.target) || joinRoomWithPasswordBox.contains(e.target)) return
    if( e.target === newRoomButton) return
    
    hideElement(createRoomBox)  
    hideElement(joinRoomWithPasswordBox)
    hideElement(bluredBg)      
    
})
readyButton.addEventListener('click', () => {
    socket.emit("setReady", user)
})
leaveRoomButton.addEventListener('click', () => {
    socket.emit('leaveRoom', user.userId)
})


socket.emit('joinLobby', userName)

socket.on('userInfo', (u) => {
    user = u
    
})

socket.on('lobbyInfo', ([users, rooms]) => {

    if(rooms) showRooms(rooms)
    if(users) showUsersInLobby(users)
    
})

socket.on("joinRoom", (room) => {
   
    showGameRoom(room)
    
})



socket.on("roomsUpdate", (rooms) => {
    //console.log(rooms)
    showRooms(rooms)
})



function showUsersInLobby(users) {
    playersInLobbyDiv.innerHTML = ''
    users.forEach(user => {
        const player = document.createElement('div')
        player.classList.add('gracz')
        player.innerHTML = user.userName
        playersInLobbyDiv.appendChild(player)
    })
}

function showRooms(rooms) {
    if(!rooms) return
    roomsBox.innerHTML = ""
    rooms.forEach(room => {
        const roomDiv = document.createElement('div')
        roomDiv.classList.add('room')
        roomDiv.innerHTML += `<div class='roomName'>${room.roomName}</div>`
        if(room.usersInRoom.length > 1){
            roomDiv.innerHTML += `<div class='playersInRoom'>Players:   ${room.usersInRoom[0].userName} :  ${room.usersInRoom[1].userName} </div>`
        }else{
            roomDiv.innerHTML += `<div class='playersInRoom'>Players:   ${room.usersInRoom[0].userName} :  --- </div>`
            const joinButton = document.createElement('button')
            joinButton.innerText = "Join"
            joinButton.classList.add('joinButton')


            joinButton.addEventListener("click", (e) => {
                e.stopPropagation()
            
                if (room.roomPassword === '') {
                    socket.emit('joinRoom', [room.roomId, user])
                
                } else {
                    joinRoomWithPasswordBox.classList.remove("displayNone")
                    joinRoomWithPasswordBox.classList.add("displayBlock")
                    bluredBg.classList.remove("displayNone")
                    bluredBg.classList.add("displayBlock")
                    joinRoomWithPasswordButton.addEventListener("click", (e) => {
                        e.stopPropagation()
                    
                        if ( roomPasswordJoinInput.value === "" || roomPasswordJoinInput.value !== room.roomPassword ) {
                            roomPasswordJoinInput.value = ''
                            roomPasswordJoinInput.focus()
                            return
                        }
                        socket.emit('joinRoom', [room.roomId, user])
                    })
                }              
            })        
            roomDiv.appendChild(joinButton)
        }        
        roomsBox.appendChild(roomDiv)       
    })
}

function hideElement(element) {
    element.classList.remove('displayBlock')
    element.classList.add('displayNone')
}

function showElement(element) {
    element.classList.remove('displayNone')
    element.classList.add('displayBlock')
}