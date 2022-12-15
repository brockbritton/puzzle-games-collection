
class CallerOrganizer {
    constructor() {
        this.caller = null;
        this.resetUIVisuals();
    }

    resetUIVisuals() {
        //reset the slider and checkboxes - so a new game cannot be accidentally created
        const slider = document.getElementById("slider-checkbox")
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
            if (table_cells[i].classList.length > 2) {
                table_cells[i].classList.toggle("cell_number_called")
            }
        }
    }

    checkClick(event) {
        const slider = document.getElementById("slider-checkbox")
        if (slider.checked) {
            event = event || window.event;
            event.preventDefault()
        }
    }
    

    buildNewCaller() {
        const game_columns = this.collectColumns();
        if (game_columns.length > 0) {
            this.caller = new BingoCaller(game_columns)
        } else {
            alert("please select at least one column or toggle to all")
        }
        this.resetUIVisuals()
    
    }

    collectColumns() {
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

    checkCallNumber() {
        if (this.caller != null) {
            this.caller.callNumber()
        } else {
            alert("please start a new caller game first")
            let html_display = document.getElementById("html-call-display")
            html_display.innerHTML = "&#8203;" 
        }
    }

    toggleColumnsSelect() {
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
}

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
            let html_display = document.getElementById("html-call-display")
            html_display.innerHTML = "&#8203;"
        }
        


    }
}

class PlayerOrganizer {
    constructor() {
        this.current_boards = []

        this.updateBoardsNum() //this.boards_num
        this.updateHighlightColor() //this.highlight_color 
        this.updateRecordNumbers() //this.recording_values 
        this.updateWinningPattern() //this.winning_pattern 

        this.winning_patterns_dict = {
            "blackout" : [],
            "four-corners" : []
        }
        
    }

    getDropdownValue(id) {
        let dropdown = document.getElementById(id)
        return dropdown.value
    }

    updateBoardsNum() {
        this.boards_num = Number(this.getDropdownValue("boards-num-dropdown"))
    }

    updateHighlightColor() {
        this.highlight_color = this.getDropdownValue("highlight-color-dropdown")
    }

    updateRecordNumbers() {
        this.recording_values = this.getDropdownValue("record-numbers-dropdown")
    }

    updateWinningPattern() {
        this.winning_pattern = this.getDropdownValue("winning-pattern-dropdown")
    }

    clearDivByID(id) {
        let boards_div = document.getElementById(id)
        while (boards_div.firstChild) {
            boards_div.removeChild(boards_div.firstChild);
        }
    }

    changeCSSStyle(selector, cssProp, cssVal) {
        // 1 = second listed external stylesheet: bingo-style.css
        for ( let i=0, len =document.styleSheets[1]['cssRules'].length; i<len; i++) {
            if (document.styleSheets[1]['cssRules'][i].selectorText === selector) {
                document.styleSheets[1]['cssRules'][i].style[cssProp] = cssVal;
                return;
            }
        }
    }

    showHideRecordNumberOption() {
        let select_div = document.getElementById("numbers-table-container")
        let input_div = document.getElementById("enter-nums-input-container")
        if (this.recording_values == "select") {
            select_div.style.display = "block"
            input_div.style.display = "none"
        } else {
            input_div.style.display = "block"
            select_div.style.display = "none"
        }
    }

    callNumber(element) {
        let num = parseInt(element.innerHTML)
        //bold the element innerhtml

        //call/uncall the number for each of the boards assuming there are boards
    }

    buildNewPlayer() {

        //clear old bingo boards
        this.clearDivByID("play-boards-div")

        //update highlight color for called cells
        this.changeCSSStyle(".bingo-cell-called-highlight", "background-color", this.highlight_color)

        //update recording numbers option
        this.showHideRecordNumberOption()

        
        //build the rows for the board visuals
        const boards_per_row = 4
        const boards_div = document.getElementById("play-boards-div")
        for (let i = 0; i < Math.ceil(this.boards_num / boards_per_row); i++) {
            const boards_row = document.createElement("div")
            boards_row.classList.add("play-boards-row")
            boards_div.appendChild(boards_row)
        }

        //build the bingo boards from Classes
        for (let i = 0; i < this.boards_num; i++) {
            this.current_boards.push(new BingoBoard())
        }
    }


}

class BingoBoard {
    constructor() {
        this.board_columns = this.createNumberColumns()
        this.buildBingoBoardVisual(this.board_columns)
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
        
        return columns
    }

    buildBingoBoardVisual(number_columns_array) {
        const board_border = document.createElement("div")
        board_border.classList.add("board-border", "side-by-side")
    
        const table_container = document.createElement("div")
        table_container.classList.add("board-table")
    
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
                let board_text = document.createElement("p")
                
                if (i == 2 && j == 2) {
                    board_cell.classList.add("board-cell", "side-by-side", "bingo-cell-called-highlight")
                    board_text.classList.add("board-cell-text-sizing", "board-free-cell-text")
                    board_text.innerHTML = "FREE"
                } else {
                    board_cell.classList.add("board-cell", "side-by-side")
                    board_text.classList.add("board-cell-text-sizing")
                    board_text.innerHTML = `${number_columns_array[j][i]}`    
                }
                board_cell.appendChild(board_text)
                board_row.appendChild(board_cell)
                
            }
            table_container.appendChild(board_row)
    
        }
        board_border.appendChild(table_container)

        
        const board_rows = document.getElementById("play-boards-div").children
        
        if (board_rows[0].children.length < 4) {
            board_rows[0].appendChild(board_border)
        } else {
            board_rows[1].appendChild(board_border)
        }
        

        
    
    }

    
}