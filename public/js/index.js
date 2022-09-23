const userNameInput = document.querySelector("#userName")
const playButton = document.querySelector("#playButton")

userNameInput.focus()

playButton.addEventListener("click", () => {
    getUserInputAndChangeLocation(userNameInput.value)
})

document.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        getUserInputAndChangeLocation(userNameInput.value)
    }
})

function getUserInputAndChangeLocation(userInput) {
    let userName = userInput

    if(!userName) return

    window.location.href = "game.html?userName=" + userName
}