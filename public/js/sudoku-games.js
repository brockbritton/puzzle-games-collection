
const easy_game1 = [
    [null, 4, null, null, null, 7, 1, null, 8],
    [5, 3, null, null, 9, null, null, 7, null],
    [null, null, 7, 1, 6, 3, 9, 4, null],
    [4, null, 6, null, 8, null, 7, 5, 1],
    [null, 1, null, 4, null, null, 6, 9, null],
    [null, 5, 3, null, 1, null, null, null, 2],
    [9, 6, null, null, 3, null, null, 1, null],
    [3, 7, null, null, 5, 1, null, null, null],
    [1, null, null, 2, null, 9, 3, 6, 7]
]

const medium_game1 = [
    [null, null, null, null, null, null, 6, null, 9],
    [1, null, null, null, null, 4, null, null, null],
    [null, null, 5, 3, null, 6, 8, 2, 1],
    [null, null, 4, 6, 7, null, null, 5, null],
    [null, null, 7, null, null, null, 9, null, null],
    [null, null, null, 5, 4, null, null, null, null],
    [3, 7, null, 4, null, 5, 2, null, 6],
    [null, null, null, null, null, null, 5, 1, null],
    [null, 6, null, null, 2, null, null, 3, 7]
]

const hard_game1 = [
    [null, null, null, null, 3, null, null, null, 9],
    [null, null, null, null, null, 5, null, 6, null],
    [null, null, null, null, null, 7, 5, null, 8],
    [null, null, 6, null, null, null, null, null, null],
    [3, 2, null, null, null, null, 6, null, null],
    [null, null, null, null, 8, null, null, 5, 4],
    [null, 3, null, 5, null, null, null, null, null],
    [8, 1, null, 9, 4, 3, null, null, null],
    [9, null, null, null, null, 8, null, null, null],
]

const available_games = {
    1 : easy_game1,
    2 : medium_game1,
    3 : hard_game1,
}