

class BingoCaller {
    constructor(column_values) {
        this.finished = false;
        this.past_calls = [];
        this.buildCallPool(column_values)
    }

    
    buildCallPool(columns) {
        this.call_pool = []
        for (let i = 0; i < columns.length; i++) {
            let start = columns[i] * 15
            for (let n = 1; n <= 15; n++) {
                this.call_pool.push(start + n)
            }
        }
    }

    callNumber() {
        if (this.call_pool.length > 0) {
            let random_index = Math.floor(Math.random() * (this.call_pool.length));
            let called_num = this.call_pool[random_index]
            this.call_pool.splice(random_index, 1)
            this.past_calls.push(called_num)

            let table_cell = document.getElementById(`cell${called_num}`)
            table_cell.classList.toggle("cell_number_called")

            const letters = ["B", "I", "N", "G", "O"]
            let html_display = document.getElementById("html-call-display")
            html_display.innerHTML = `${letters[Math.floor(called_num / 15.1)]} ${called_num}`
        } else {
            alert("all numbers for this game have been called")
            const call_number_button = document.getElementById("caller-call-number")
            call_number_button.disabled = true
            let html_display = document.getElementById("html-call-display")
            html_display.innerHTML = "&#8203;"
        }
    }
}

class BingoBoard {
    constructor(id) {
        this.id_num = id
        this.board_num = id + 1
        this.all_nums = []
        this.columns = this.createNumberColumns()
        this.rows = this.buildRows()
        this.curr_bool_pattern = this.buildStartingBoolPattern()
        this.calls_for_bingo = 5
        this.bingo_win = false
        this.first_bingo_call = true
        this.buildBingoBoardVisual()
    }

    genRandomNumber(col_iter) {
        return (15 * col_iter) + Math.floor(Math.random() * 15) + 1
    }

    createNumberColumns() {
        const columns = []
        for (let i = 0; i < 5; i++) {
            columns.push([])
            while (columns[i].length < 5) {
                let random_num = this.genRandomNumber(i)
                while (columns[i].indexOf(random_num) != -1) {
                    random_num = this.genRandomNumber(i)
                    
                }
                columns[i].push(random_num)
            }
        }
        //designate the free space
        columns[2][2] = "FREE"
        return columns
    }

    buildRows() {
        let rows = [] 
        for (let i = 0; i < 5; i++) {
            let row = []
            for (let j = 0; j < 5; j++) {
                row.push(this.columns[j][i])
                this.all_nums.push(this.columns[j][i])
            }
            rows.push(row)
        }
        return rows
    }

    buildBingoBoardVisual() {
        const board_border = document.createElement("div")
        board_border.classList.add("board-border", "side-by-side")
    
        const table_container = document.createElement("div")
        table_container.classList.add("board-table")
        table_container.setAttribute("id", `cells-container-board-${this.id_num}`)
    
        const header_letters = ["B", "I", "N", "G", "O"]
        const header_row = document.createElement("div")
        header_row.classList.add("board-row")
        for (let i = 0; i < header_letters.length; i++) {
            let header_cell = document.createElement("div")
            header_cell.classList.add("board-header", "side-by-side")
            header_cell.innerHTML = header_letters[i]
            header_row.appendChild(header_cell)
        }
        table_container.appendChild(header_row)
    
        for (let i = 0; i < header_letters.length; i++) {
            let board_row = document.createElement("div")
            board_row.classList.add("board-row")
            for (let j = 0; j < header_letters.length; j++) {
                let board_cell = document.createElement("div")
                let cell_text = document.createElement("p")
                
                if (i == 2 && j == 2) {
                    board_cell.classList.add("board-cell", "side-by-side", "bingo-cell-called-highlight")
                    cell_text.classList.add("board-cell-text-sizing", "board-free-cell-text")
                } else {
                    board_cell.classList.add("board-cell", "side-by-side", "numbers-font")
                    cell_text.classList.add("board-cell-text-sizing")
                }
                cell_text.innerHTML = `${this.rows[i][j]}`    
                board_cell.appendChild(cell_text)
                board_row.appendChild(board_cell)
                
            }
            table_container.appendChild(board_row)
        }
        board_border.appendChild(table_container)
        //label with board number
        let board_num_label = document.createElement("p")
        board_num_label.classList.add("board_id_label")
        board_num_label.innerText = `Board ${this.id_num + 1}`
        board_border.appendChild(board_num_label)


        const board_rows = document.getElementById("play-boards-div").children
        
        if (board_rows[0].children.length < 4) {
            board_rows[0].appendChild(board_border)
        } else {
            board_rows[1].appendChild(board_border)
        }
    }

    collectCellsNumInPattern(pattern) {
        //count the true values in a pattern
        let count = 0
        for (let i = 0; i < pattern.length; i++) {
            if (pattern.length[i]) {
                count += 1
            }
        }
        return count
    }

    callNumber(num) {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let num_index = this.all_nums.indexOf(num)
        if (num_index != -1) {
            this.curr_bool_pattern[num_index] = true
            let called_cell = table_divs_container.children[Math.floor(num_index / 5)+1].children[num_index % 5]
            called_cell.classList.add("bingo-cell-called-highlight")
            this.bingo_win = this.checkWin()
            /*
            if (this.collectCellsNumInPattern(this.curr_bool_pattern) >= this.calls_for_bingo) {
                this.bingo_win = this.checkWin()
            }
            */
        } 
    }

    uncallNumber(num) {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let num_index = this.all_nums.indexOf(num)
        if (num_index != -1) {
            this.curr_bool_pattern[num_index] = false
            let called_cell = table_divs_container.children[Math.floor(num_index / 5)+1].children[num_index % 5]
            called_cell.classList.remove("bingo-cell-called-highlight")
            //if deciding bingo call is misclicked, bingo is removed
            let win_bool = this.checkWin()
            this.bingo_win = win_bool
            this.first_bingo_call = !win_bool
        }
    }

    buildStartingBoolPattern() {
        const bool_pattern = []
        for (let i = 0; i < 25; i++) {
            if (i != Math.floor(25/2)) {
                bool_pattern.push(false) 
            } else {
                bool_pattern.push(true)
            } 
        } 
        return bool_pattern
    }
}

class PatternMatchBingoBoard extends BingoBoard {
    constructor(id, pattern) {
        super(id)
        this.win_bool_pattern = pattern
        this.checkFreeSpaceHighlight()
        this.calls_for_bingo = this.collectCellsNumInPattern(pattern)
    }



    checkFreeSpaceHighlight() {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let free_index = this.all_nums.indexOf('FREE')
        let free_cell = table_divs_container.children[Math.floor(free_index / 5)+1].children[free_index % 5]
        if (!this.win_bool_pattern[free_index]) {
            free_cell.classList.add("bingo-cell-called-transparent-highlight")
            free_cell.classList.remove("bingo-cell-called-highlight")
        }
    }

    callNumber(num) {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let num_index = this.all_nums.indexOf(num)
        if (num_index != -1) {
            this.curr_bool_pattern[num_index] = true
            let called_cell = table_divs_container.children[Math.floor(num_index / 5)+1].children[num_index % 5]
            if (this.win_bool_pattern[num_index]) {
                called_cell.classList.add("bingo-cell-called-highlight")
            } else {
                called_cell.classList.add("bingo-cell-called-transparent-highlight")
            }

            if (this.collectCellsNumInPattern(this.curr_bool_pattern) >= this.calls_for_bingo) {
                this.bingo_win = this.checkWin()
            }
        }
    }

    uncallNumber(num) {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let num_index = this.all_nums.indexOf(num)
        if (num_index != -1) {
            this.curr_bool_pattern[num_index] = false
            let called_cell = table_divs_container.children[Math.floor(num_index / 5)+1].children[num_index % 5]
            if (this.win_bool_pattern[num_index]) {
                called_cell.classList.remove("bingo-cell-called-highlight")
            } else {
                called_cell.classList.remove("bingo-cell-called-transparent-highlight")
            }

            //if deciding bingo call is misclicked, bingo is removed
            let win_bool = this.checkWin()
            this.bingo_win = win_bool
            this.first_bingo_call = !win_bool
        }
    }

    checkWin() {
        //check current boolean board against bool winning pattern
        //current board can have more trues, but needs the right ones in the right place
        //return true if win, else return false
        for (let i = 0; i < this.win_bool_pattern.length; i++) {
            if (this.win_bool_pattern[i]) {
                if (!this.curr_bool_pattern[i]) {
                    return false
                }
            }
        }
        return true
    }
}

class ClassicBingoBoard extends BingoBoard {
    constructor(id) {
        super (id)
        this.calls_before_bingo = 4
        //this.LRDown = this.buildLRDown()
        //this.LRUp = this.buildLRUp()
    }

    checkWin() {
        //check diagonals
        let LRUp_array = []
        let LRDown_array = []
        for (let i = 0, j = 4; i < 5; i++, j--) {
            LRUp_array.push(this.curr_bool_pattern[(j*5)+i])  
            LRDown_array.push(this.curr_bool_pattern[(i*5)+i]) 
        }
        if (!LRUp_array.includes(false) || !LRDown_array.includes(false)) {
            return true
        }

        //check across and down
        for (let i = 0; i < 5; i++) {
            let across_array = []
            let down_array = []
            for (let j = 0; j < 5; j++) {
                across_array.push(this.curr_bool_pattern[(i*5)+j])
                down_array.push(this.curr_bool_pattern[(j*5)+i])
            }
            if (!across_array.includes(false) || !down_array.includes(false)) {
                return true
            }
        }
        return false 
    }
}

//General Bingo Functions

function toggleBingoStates() {
    let caller_div = document.getElementById("bingo-caller-div")
    let player_div = document.getElementById("bingo-player-div")
    let bingo_toggle = document.getElementById("slider-toggle-bingo");
    if (bingo_toggle.checked) {
        caller_div.style.display = "flex";
        player_div.style.display = "none";
    } else {
        caller_div.style.display = "none";
        player_div.style.display = "block";
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
            cell.classList.add("cell_number_uncalled", "cell_number_class", "numbers-font");
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
            cell.classList.add("horizontal-table-cell", "numbers-font")
            cell.setAttribute("onclick", "numberCellClicked(this)") /*//*\\*/
            cell.innerHTML = `${(15 * r) + i}`
        }
    }
    table_container.appendChild(table)

    
}

function buildCustomPatternSelectBoard() {
    const table_container = document.getElementById("create-custom-winning-pattern-div")
    const table = document.createElement("table")
    table.setAttribute("id", "custom-pattern-table")
    let header_letters = ["B", "I", "N", "G", "O"]
    let header_row = document.createElement("tr") 
    for (let h = 0; h < header_letters.length; h++) {
        let header_cell = document.createElement("th")
        header_cell.innerHTML = header_letters[h]
        header_row.appendChild(header_cell)
    }
    table.appendChild(header_row)

    for (let i = 0; i < 5; i++) {
        let board_row = document.createElement("tr")
        for (let j = 0; j < 5; j++) {
            let board_cell = document.createElement("td") 
            board_cell.classList.add("custom-wp-cells", "numbers-font")
            board_cell.onclick = function() { this.classList.toggle("custom-board-cell-highlight") };
            if (i == 2 && j == 2) {
                board_cell.innerHTML = "FREE"
                board_cell.setAttribute("id", "custom-pattern-free-space")
            } else {
                board_cell.innerHTML = "##"
            }
            
            board_row.appendChild(board_cell)
        }
        table.appendChild(board_row)
    }
    table_container.appendChild(table)
}

function buildCustomPatternDisplayBoard() {
    const table_container = document.getElementById("custom_wp_display")
    const table = document.createElement("table")
    table.setAttribute("id", "display-wp-table")

    for (let i = 0; i < 5; i++) {
        let board_row = document.createElement("tr")
        for (let j = 0; j < 5; j++) {
            let board_cell = document.createElement("td") 
            board_cell.classList.add("wp-display-cells", "numbers-font") 
            if (i == 2 && j == 2) {
                board_cell.innerHTML = "FREE"
                board_cell.setAttribute("id", "custom-pattern-free-space")
            } else {
                board_cell.innerHTML = "##"
            }
            
            board_row.appendChild(board_cell)
        }
        table.appendChild(board_row)
    }
    table_container.appendChild(table)

    let table_label = document.createElement("p")
    table_label.classList.add("bingo-table-captions")
    table_label.innerHTML = "to win, you must match this pattern"
    table_container.appendChild(table_label)
}

function clearDivByID(id) {
    let div_to_clear = document.getElementById(id)
    while (div_to_clear.firstChild) {
        div_to_clear.removeChild(div_to_clear.firstChild);
    }
}

function changeCSSStyle(selector, cssProp, cssVal) {
    // 1 = second listed external stylesheet: bingo-style.css
    for ( let i=0, len =document.styleSheets[1]['cssRules'].length; i<len; i++) {
        if (document.styleSheets[1]['cssRules'][i].selectorText === selector) {
            document.styleSheets[1]['cssRules'][i].style[cssProp] = cssVal;
            return;
        }
    }
}

function hexToRGB(hex_code) {
    if (hex_code.length == 7) {
        hex_code = hex_code.substring(1)
    } 
    let rgbHex = hex_code.match(/.{1,2}/g);
    let rgb_array = [
        parseInt(rgbHex[0], 16),
       parseInt(rgbHex[1], 16),
        parseInt(rgbHex[2], 16)
    ];
    return rgb_array
}

//Caller Bingo Functions

function buildNewCaller() {
    const game_columns = collectColumns();
    if (game_columns.length > 0) {
        current_caller_game = new BingoCaller(game_columns)
        const call_number_button = document.getElementById("caller-call-number")
        call_number_button.disabled = false
        resetCallerUIVisuals()
    } else {
        alert("please select at least one column or toggle to all")
    }
    
}

function resetCallerUIVisuals() {
    //reset the slider and checkboxes - so a new game cannot be accidentally created
        const slider = document.getElementById("slider-toggle-some-all")
        if (slider.checked) {
            slider.checked = false
        }
        const checkboxes = document.getElementsByClassName("select-column-checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                checkboxes[i].checked = false
            }
        }

        //clear the called number text
        let html_display = document.getElementById("html-call-display")
        html_display.innerHTML = "&#8203;"
        
        //reset the called numbers table
        const table_cells = document.getElementsByClassName("cell_number_class")
        for (let i = 0; i < table_cells.length; i++) {
            if (table_cells[i].classList.contains("cell_number_called")) {
                table_cells[i].classList.toggle("cell_number_called")
            }
        }
}

function checkColumnSelectionClick(event) {
    const slider = document.getElementById("slider-toggle-some-all")
    if (slider.checked) {
        event = event || window.event;
        event.preventDefault()
    }
}

function toggleAllColumnsSelect() {
    const slider = document.getElementById("slider-toggle-some-all")
    const checkboxes = document.getElementsByClassName("select-column-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
        if (slider.checked) {
            checkboxes[i].checked = true;
        } else {
            checkboxes[i].checked = false;
        }
    }
}

function collectColumns() {
    const checkboxes = document.getElementsByClassName("select-column-checkbox");
    const slider = document.getElementById("slider-toggle-some-all")
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

//Player Bingo Functions

function buildNewPlayer() {
    //delete old bingo boards
    clearDivByID("play-boards-div")
    //collect and analyze the custom pattern
    let custom_wp_container = document.getElementById("create-custom-winning-pattern-div")
    let custom_wp_array = null
    if (custom_wp_container.style.maxHeight > "0" && getDropdownValue("winning-pattern-dropdown") == "other") {
        //get the custom winning pattern
        custom_wp_array = collectCustomWinningPattern()
        let selected_count = 0
        for (let i = 0; i < custom_wp_array.length; i++) {
            if (custom_wp_array[i]) {
                selected_count += 1
            }
        }
        //if there are no selected cells for the pattern
        if (selected_count == 0) {
            alert("please select at least one cell for your custom pattern")
            return false
        } else if (selected_count == 1) {
            let check_for_center = collectCustomWinningPattern()
            check_for_center.splice(Math.floor(check_for_center.length / 2))
            if (!check_for_center.includes(true)) {
                alert("please choose more than just the free space")
                return false
            }
        }

        //fill in the display for the winning pattern
        let display_cells = document.getElementsByClassName("wp-display-cells")
        for (let i = 0; i < display_cells.length; i++) {
            if (custom_wp_array[i]) {
                display_cells[i].classList.add("bingo-cell-called-highlight")
            } else {
                display_cells[i].classList.remove("bingo-cell-called-highlight")
            }

        }
        //hide and clear custom wp board
        custom_wp_container.style.maxHeight = "0px";
        let custom_wp_cells = document.getElementsByClassName("custom-wp-cells")
        for (let i = 0; i < custom_wp_cells.length; i++) {
            if (custom_wp_cells[i].classList.contains("custom-board-cell-highlight")) {
                custom_wp_cells[i].classList.toggle("custom-board-cell-highlight")
            }   
        }
    }

    let curr_highlight = document.getElementById("highlight-colorpicker").value
    
    //update highlight color for opaque hightlight option
    changeCSSStyle(".bingo-cell-called-highlight", "background-color", curr_highlight)

    //update highlight color for transparent highlight option
    let rgb_array = hexToRGB(curr_highlight);
    changeCSSStyle(".bingo-cell-called-transparent-highlight", "background-color", `rgba(${rgb_array[0]}, ${rgb_array[1]}, ${rgb_array[2]}, 0.2)`)

    //update highlight color for alert background
    changeCSSStyle("#bingo-alert-background", "background-color", curr_highlight)

    //clear called nums list and reset called nums table style
    current_player_dict["call_list"] = []
    current_player_dict["current_boards"] = []

    //update current game label, display label
    let game_type_label = document.getElementById("curr-game-label")
    if (custom_wp_array == null) {
        game_type_label.innerHTML = "Current Game: Classic"
    } else {
        game_type_label.innerHTML = "Current Game: Pattern Match"
    }
    game_type_label.style.display = "block"

    //hide the bingo popup if necessary -- maybe also need to delete the blur?
    let bingo_popup = document.getElementById("bingo-alert-popup-display")
    bingo_popup.style.zIndex = 1

    //clear and display (or re-display) recording numbers option
    let called_table_cells = document.getElementsByClassName("horizontal-table-cell") 
    for (let i = 0; i < called_table_cells.length; i++) {
        if (called_table_cells[i].classList.contains("font-weight-900")) {
            called_table_cells[i].classList.toggle("font-weight-900")
        }
    }
    let select_div = document.getElementById("bingo-play-control-box")
    select_div.style.display = "block"
    
    //build the rows for the board visuals
    const boards_per_row = 4
    const total_boards = Number(getDropdownValue("boards-num-dropdown"))
    const boards_div = document.getElementById("play-boards-div")
    for (let i = 0; i < Math.ceil(total_boards / boards_per_row); i++) {
        const boards_row = document.createElement("div")
        boards_row.classList.add("play-boards-row")
        boards_div.appendChild(boards_row)
    }

    //build the bingo boards from Classes
    //also display pattern match display or classic win paragraph
    let classic_par = document.getElementById("classic-win-par")
    let wp_display = document.getElementById("custom_wp_display")
    for (let i = 0; i < total_boards; i++) {
        if (custom_wp_array == null) {
            current_player_dict["current_boards"].push(new ClassicBingoBoard(i))
            classic_par.style.display = "block"
            wp_display.style.display = "none"

        } else {
            current_player_dict["current_boards"].push(new PatternMatchBingoBoard(i, custom_wp_array))
            classic_par.style.display = "none"
            wp_display.style.display = "block"
        }
    }
    //reset dropdowns
    let default_options = document.getElementsByClassName("default-dropdown-option")
    for (let i = 0; i < default_options.length; i++) {
        default_options[i].selected = true
    }
}

function resetPlayerUIVisuals() {
    //delete old bingo boards
    clearDivByID("play-boards-div")

    let bingo_popup = document.getElementById("bingo-alert-popup-display")
    bingo_popup.style.zIndex = 1

    let select_div = document.getElementById("bingo-play-control-box")
    select_div.style.display = "none"

    let game_type_label = document.getElementById("curr-game-label")
    game_type_label.style.display = "none"
}

function getDropdownValue(id) {
    let dropdown = document.getElementById(id)
    return dropdown.value
}

function updateHighlightColor() {
    let colorpicker = document.getElementById("highlight-colorpicker")
    changeCSSStyle(".custom-board-cell-highlight", "background-color", colorpicker.value)

}

function updateWinningPattern() {
    let value = getDropdownValue("winning-pattern-dropdown")
    current_player_dict["winning_pattern"] = value

    let selectable_board = document.getElementById("create-custom-winning-pattern-div")
    if (value == "other") {
        selectable_board.style.maxHeight = "300px";
    } else {
        selectable_board.style.maxHeight = "0px";  
    }
}

function collectCustomWinningPattern() {
    let values = []
    let cells = document.getElementsByClassName("custom-wp-cells")
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains("custom-board-cell-highlight")) {
            values.push(true)
        } else {
            values.push(false)
        }
    }
    return values 
}

function numberCellClicked(element) {
    let num = parseInt(element.innerHTML);
    element.classList.toggle("font-weight-900")
    if (!current_player_dict["call_list"].includes(num)) {
        current_player_dict["call_list"].push(num);
        for (let i = 0; i < current_player_dict["current_boards"].length; i++) {
            current_player_dict["current_boards"][i].callNumber(num)
        }  
    } else {
        let num_index = current_player_dict["call_list"].indexOf(num)
        current_player_dict["call_list"].splice(num_index)
        for (let i = 0; i < current_player_dict["current_boards"].length; i++) {
            current_player_dict["current_boards"][i].uncallNumber(num)
        }
    }

    //look for bingo in current boards
    //if found, update the custom bingo alert
    evaluateBingoCalls()
    
}

function evaluateBingoCalls() {
    let first_bingo_boards = []
    let old_bingo_boards = []
    current_player_dict["current_boards"]
    for (let i = 0; i < current_player_dict["current_boards"].length; i++) {
        if (current_player_dict["current_boards"][i].bingo_win) {
            if (current_player_dict["current_boards"][i].first_bingo_call) {
                first_bingo_boards.push(current_player_dict["current_boards"][i])
                current_player_dict["current_boards"][i].first_bingo_call = false
            } else {
                old_bingo_boards.push(current_player_dict["current_boards"][i])
            }
        }
    }

    if (first_bingo_boards.length > 0) {
        let first_bingo_nums = buildBoardsNumPhrase(first_bingo_boards)
        document.getElementById("alert-new-nums").innerHTML = first_bingo_nums
        if (old_bingo_boards.length > 0) {
            let old_bingo_nums = buildBoardsNumPhrase(old_bingo_boards)
            document.getElementById("alert-old-nums").innerHTML = old_bingo_nums
        } else {
            document.getElementById("alert-old-nums").innerHTML = "none"
        }
        toggleBingoAlert()
    }
}

function toggleBingoAlert() {
    const bingo_popup = document.getElementById("bingo-alert-popup-display")
    const blur_elements = document.getElementsByClassName("blur-elements")
    if (!bingo_popup.style.display || bingo_popup.style.display == "none" ) {
        //change popup to visible and blur
        for (let i = 0; i < blur_elements.length; i++) {
            blur_elements[i].style.filter = "blur(3px)"
        }
        bingo_popup.style.display = "block"
    } else {
        //hide popup and unblur
        for (let i = 0; i < blur_elements.length; i++) {
            blur_elements[i].style.filter = "none"
        }
        bingo_popup.style.display = "none"
    }

}

function buildBoardsNumPhrase(boards_array) {
    if (boards_array.length == 0) {
        return false
    } else if (boards_array.length == 1) {
        return boards_array[0].board_num
    } else if (boards_array.length == 2) {
        return `${boards_array[0].board_num} & ${boards_array[1].board_num}`
    } else {
        let phrase = ""
        for (let i = 0; i < boards_array.length - 1; i++) {
            phrase += ` ${boards_array[i].board_num},`
        }  
        phrase += ` & ${boards_array[boards_array.length - 1].board_num}`
        return phrase
    } 
}


