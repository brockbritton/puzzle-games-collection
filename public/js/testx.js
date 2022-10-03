

function isANumber(currentValue) {
    return typeof currentValue === 'number';
}

function isAllNumbers(currentArray) {
    return currentArray.every(isANumber);
}


const array1 = [[1, 30, 39, 29, 1000000000, 13],
                [1, 30, 39, 29, 10, 13],
                [1, 30, 39, 29, 10, 13],
                [1, 0, 39, 29, 10, 13],
            	[1, 30, 90, 29, 10, 13],
               ];


//console.log(array1[0].every(isANumber))
console.log(array1.every(isAllNumbers))
