const users = []

function getAllUsers() {
    return users
}

function joinLobby(userId, userName) {
    const user = {
        userId,
        userName,
        ready: false,
        mark: ''
    }
    users.push(user)

    return user
}

function userLeave(userId) {
    const index = users.findIndex(user => user.userId === userId)

    if ( index !== -1 ) return users.splice(index, 1)[0]
}

function getUserById(userId) {
    return users.find(user => user.userId === userId)
}



module.exports = {
    getAllUsers,
    joinLobby,
    userLeave,
    getUserById
}