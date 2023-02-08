

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