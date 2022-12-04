
function switchBingoStates() {
    let caller_div = document.getElementById("game-caller-div")
    let player_div = document.getElementById("game-player-div")
    let dropdown = document.getElementById("choose-bingo-gamemode-drpdwn");
    if (dropdown.value == 0) {
        console.log("new game state: caller")
        caller_div.style.display = "flex";
        player_div.style.display = "none";
        curr_bingo_state = new CallerOrganizer();
    } else if (dropdown.value == 1) {
        console.log("new game state: player")
        caller_div.style.display = "none";
        player_div.style.display = "flex";
    }
}

