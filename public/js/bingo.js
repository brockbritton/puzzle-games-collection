
function switchBingoStates() {
    let caller_div = document.getElementById("bingo-caller-div")
    let player_div = document.getElementById("bingo-player-div")
    let dropdown = document.getElementById("choose-bingo-gamemode-drpdwn");
    if (dropdown.value == 0) {
        caller_div.style.display = "flex";
        player_div.style.display = "none";
        curr_bingo_state = new CallerOrganizer();
    } else if (dropdown.value == 1) {
        caller_div.style.display = "none";
        player_div.style.display = "block";
        curr_bingo_state = new PlayerOrganizer();
    }
}

function buildCallerCalledNumbersTable() {
    const table_container = document.getElementById("called-number-table-div")
    const table = document.createElement("table");
    table.setAttribute("id", "called-nums-table");
    

    const col_headers = ["B", "I", "N", "G", "O"]
    let table_header_row = table.insertRow(0);
    for (let i = 0; i < col_headers.length; i++) {
        let column_th = document.createElement("th");
        column_th.innerHTML = col_headers[i]
        table_header_row.appendChild(column_th)
    }
    
    for (let r = 1; r <= 15; r++) {
        let table_row = table.insertRow(r);
        for (let d = 0; d < 5; d++) {
            let cell = table_row.insertCell(d)
            cell.innerHTML = (d * 15) + (r)
            cell.setAttribute("id", `cell${(d * 15) + (r)}`)
            cell.classList.add("cell_number_uncalled", "cell_number_class");
        }
    }
    table_container.appendChild(table)

}

function buildPlayerCalledNumbersTable() {
    const table_container = document.getElementById("numbers-table-container")
    const table = document.createElement("table")
    table.setAttribute("id", "selectable-number-table")

    const header_letters = ["B", "I", "N", "G", "O"]
    for (let r = 0; r < 5; r++) {
        let table_row = table.insertRow(r)
        let header_cell = table_row.insertCell(0)
        header_cell.classList.add("horizontal-table-header-cell")
        header_cell.innerHTML = header_letters[r] 
        for (let i = 1; i < 16; i++) {
            let cell = table_row.insertCell(i)
            cell.classList.add("horizontal-table-cell")
            cell.innerHTML = `${(15 * r) + i}`
        }
    }
    table_container.appendChild(table)

    const instructions_par = document.createElement("p");
    instructions_par.setAttribute("id", "selectable-table-p")
    instructions_par.innerHTML = "When a number is called, click the corresponding cell. Your board(s) below will automatically updated."
    table_container.appendChild(instructions_par)
}
