
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
        this.call_list = []
        this.updateBoardsNum() //this.boards_num
        this.updateHighlightColor() //this.highlight_color 
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
        let colorpicker = document.getElementById("highlight-colorpicker")
        this.highlight_color = colorpicker.value
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

    hexToRGB(hex_code) {
        if (hex_code.length == 7) {
            hex_code = hex_code.substring(1)
        } 
        var rgbHex = hex_code.match(/.{1,2}/g);
        var rgb_array = [
            parseInt(rgbHex[0], 16),
           parseInt(rgbHex[1], 16),
            parseInt(rgbHex[2], 16)
        ];

        return rgb_array

    }

    numberCellClicked(element) {
        let num = parseInt(element.innerHTML);
        //bold the element innerhtml
        //call/uncall the number for each of the boards assuming there are boards
        if (!this.call_list.includes(num)) {
            this.call_list.push(num);
            element.style.fontWeight = 900;
            let rgb_array = this.hexToRGB(this.highlight_color);
            element.style.backgroundColor = `rgba(${rgb_array[0]}, ${rgb_array[1]}, ${rgb_array[2]}, 0.2)`
            for (let i = 0; i < this.current_boards.length; i++) {
                this.current_boards[i].callNumber(num)
            }
            
        } else {
            let num_index = this.call_list.indexOf(num)
            this.call_list.splice(num_index)
            element.style.fontWeight = 400;
            element.style.backgroundColor = "transparent";
            element.style.opacity = "1";
            for (let i = 0; i < this.current_boards.length; i++) {
                this.current_boards[i].uncallNumber(num)
            }
        }
        
    }

    buildNewPlayer() {

        //clear old bingo boards
        this.clearDivByID("play-boards-div")

        //update highlight color for called cells
        this.changeCSSStyle(".bingo-cell-called-highlight", "background-color", this.highlight_color)
        
        //clear called nums list and reset called nums table style
        this.call_list = []
        this.current_boards = []

        //clear and display (re-display) recording numbers option
        let called_table_cells = document.getElementsByClassName("horizontal-table-cell") 
        for (let i = 0; i < called_table_cells.length; i++) {
            called_table_cells[i].style.fontWeight = 400;
            called_table_cells[i].style.backgroundColor = "transparent";
            called_table_cells[i].style.opacity = "1";
        }
        let select_div = document.getElementById("numbers-table-container")
        select_div.style.display = "block"
        
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
            this.current_boards.push(new BingoBoard(i))
        }
    }


}

class BingoBoard {
    constructor(id) {
        this.id_num = id
        this.all_nums = []
        this.columns = this.createNumberColumns()
        this.rows = this.buildRows()
        //this.LRDown = this.buildLRDown()
        //this.LRUp = this.buildLRUp()
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
                let board_text = document.createElement("p")
                
                if (i == 2 && j == 2) {
                    board_cell.classList.add("board-cell", "side-by-side", "bingo-cell-called-highlight")
                    board_text.classList.add("board-cell-text-sizing", "board-free-cell-text")
                } else {
                    board_cell.classList.add("board-cell", "side-by-side")
                    board_text.classList.add("board-cell-text-sizing")
                }
                board_text.innerHTML = `${this.rows[i][j]}`    
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

    callNumber(num) {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let num_index = this.all_nums.indexOf(num)
        if (num_index != -1) {
            let called_cell = table_divs_container.children[Math.floor(num_index / 5)+1].children[num_index % 5]
            called_cell.classList.add("bingo-cell-called-highlight")
        }
    }

    uncallNumber(num) {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let num_index = this.all_nums.indexOf(num)
        if (num_index != -1) {
            let called_cell = table_divs_container.children[Math.floor(num_index / 5)+1].children[num_index % 5]
            called_cell.classList.remove("bingo-cell-called-highlight")
        }
    }

    
}