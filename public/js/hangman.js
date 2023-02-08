
function toggleHangmanPlaySolve() {
    const gamemode_toggle = document.getElementById("slider-toggle-hangman")
    const play_div = document.getElementById("hangman-play-div")
    const solve_div = document.getElementById("hangman-solve-div")
    if (gamemode_toggle.checked) {
        solve_div.style.display = "block"
        play_div.style.display = "none"
    } else {
        solve_div.style.display = "none"
        play_div.style.display = "block"
    }
}

function buildHearts(num) {
    const hearts_div = document.getElementById("hearts-div")
    for (let i = 0; i < num; i++) {
        let par = document.createElement("p")
        par.classList.add("side-by-side", "hearts", "heart-full")
        par.innerHTML = "&hearts;"
        hearts_div.appendChild(par)
    }
}

function buildLetterSpaces(word) {
    const letters_div = document.getElementById("letters-div")
    for (let i = 0; i < word.length; i++) {
        let par = document.createElement("p")
        par.classList.add("side-by-side")
        if (word[i] == " ") {
            par.classList.add("whitespace-space")
            par.innerHTML = "&#8203"
        } else {
            par.classList.add("letter-space")
            //par.innerHTML = word[i]
            par.innerHTML = "&#8203"
        }
        letters_div.appendChild(par)
    }
}   

function buildDigitalKeyboard() {
    const keyboard_div = document.getElementById("keyboard-div")
    const keyboard_rows = [
        ["q","w","e","r","t","y","u","i","o","p"],
        ["a","s","d","f","g","h","j","k","l"],
        ["z","x","c","v","b","n","m"],
    ]

    for (let row = 0; row < keyboard_rows.length; row++) {
        let keys_row = document.createElement("div")
        keys_row.classList.add("keyboard-row")
        for (let i = 0; i < keyboard_rows[row].length; i++) {
            let key = document.createElement("button")
            key.classList.add("keyboard-key")
            key.setAttribute("onclick", "")
            key.innerHTML = keyboard_rows[row][i]
            keys_row.appendChild(key)
            console.log()
        }
        keyboard_div.appendChild(keys_row)
    }
    

}