const socket = io()

const playersInLobbyDiv = document.querySelector('.graczeList')
const roomsBox = document.querySelector('.games')
const newRoomButton = document.querySelector('.newRoomButton')
const createRoomButton = document.querySelector('#createRoomButton')
const createRoomBox = document.querySelector('#createRoomBoxContainer')

const roomNameInput = document.querySelector('#roomNameInput')
const roomPasswordInput = document.querySelector('#roomPassword')

const joinRoomWithPasswordBox = document.querySelector('#joinRoomContainer')
const roomPasswordJoinInput = document.querySelector('#inputRoomPassword')
const joinRoomWithPasswordButton = document.querySelector('#joinRoomWithPasswordButton')

const roomContainer = document.querySelector('.roomContainer')

const readyButton = document.querySelector('#ready')

const {userName} = Qs.parse(location.search, {ignoreQueryPrefix: true})

let user
let lobbyUsers


newRoomButton.addEventListener("click", ()=>{
    createRoomBox.classList.remove("displayNone")
    createRoomBox.classList.add("displayBlock")
    console.log("siema")
    roomNameInput.value = userName + "'s room"
})
createRoomButton.addEventListener("click", () => {
    const roomName = roomNameInput.value
    const roomPassword = roomPasswordInput.value || ""
    console.log(roomName)
    console.log(roomPassword)

    // window.location.href = "lobby.html?roomName=" + roomName + "&roomPassword=" + 
    console.log(user)
    socket.emit("createRoom", [roomName, roomPassword, user])
})
document.addEventListener("click", e => {
    
    if ( createRoomBox.contains(e.target) || joinRoomWithPasswordBox.contains(e.target)) return
    if( e.target === newRoomButton) return

    createRoomBox.classList.remove("displayBlock")
    createRoomBox.classList.add("displayNone") 
    joinRoomWithPasswordBox.classList.remove("displayBlock")
    joinRoomWithPasswordBox.classList.add("displayNone")   
    console.log("siema2")       
    
})

readyButton.addEventListener('click', () => {
    socket.emit("setReady", user)
})

socket.emit('joinLobby', userName)

socket.on('userInfo', (u) => {
    user = u
    
    //console.log(user)
    
})

socket.on('lobbyInfo', ([users, rooms]) => {
    // console.log("lobbyinfo")
    // console.log(users, rooms)
    if(rooms) showRooms(rooms)
    if(users) showUsersInLobby(users)
    
})

socket.on("joinRoom", (room) => {
    // console.log(room)
    // console.log("room joined")
    
    // window.location.href = "game.html?userName={}&"
    showGameRoom(room)
    //drawBoard(room.board)
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
            joinButton.classList.add('joinButton')
            joinButton.addEventListener("click", (e) => {
                e.stopPropagation()
                if (room.roomPassword === '') {
                    socket.emit('joinRoom', [room.roomId, user])
                    return
                }
                joinRoomWithPasswordBox.classList.remove("displayNone")
                joinRoomWithPasswordBox.classList.add("displayBlock")


            })
            roomDiv.appendChild(joinButton)
        }
        
        //    
        roomsBox.appendChild(roomDiv)
        
    })
}