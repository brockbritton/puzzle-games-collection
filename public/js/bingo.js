
function switchBingoStates() {
    let dropdown = document.getElementById("choose-bingo-gamemode-drpdwn");
    if (dropdown.value == 0) {
        console.log("new game state: caller")
        curr_bingo_state = new CallerOrganizer();
    } else if (dropdown.value == 1) {
        console.log("new game state: player")
    }
}

function build_new_caller() {
    const game_columns = collectColumns();
    if (game_columns.length > 0) {
        curr_bingo_state.buildNewCaller(new BingoCaller(game_columns))
    } else {
        alert("please select at least one column or toggle to all")
    }
}

function caller_call_num() {
    if (curr_bingo_state.caller != null) {
        curr_bingo_state.caller.call_number()
    } else {
        alert("please start a new caller game first")
    }
}

function collectColumns() {
    const checkboxes = document.getElementsByClassName("select-column-checkbox");
    const slider = document.getElementById("slider-checkbox")
    if (slider.checked) {
        return [0, 1, 2, 3, 4];
    } else {
        let values = []; 
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                values.push(Number(checkboxes[i].value))
            }
        }
        return values
    }
    
}

function toggle_columns_select() {
    const slider = document.getElementById("slider-checkbox")
    const checkboxes = document.getElementsByClassName("select-column-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
        if (slider.checked) {
            checkboxes[i].checked = true;
        } else {
            checkboxes[i].checked = false;
        }
    }
}