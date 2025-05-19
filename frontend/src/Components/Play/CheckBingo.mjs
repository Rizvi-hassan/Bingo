import React from 'react'
import { useLocation } from 'react-router-dom'


let check = [
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
]

// reset check grid for new games
const resetCheck = () => {
    check = [
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],

    ]
}

// changes the color of crosses if row is complete
const rowComplete = (row, col, size) => {
    // console.log('row', row, 'complete');

    let left = col;
    let right = col;

    let interval = setInterval(() => {
        if (left >= 0) {
            // console.log(`cross${row}${left}`);
            if (document.getElementById(`cross${row}${left}`)) {
                document.getElementById(`cross${row}${left}`).style.color = 'aqua';
                document.getElementById(`cross${row}${left}`).style.fontSize = '3.5rem';
            }
            left -= 1;
        }
        if (right <= size - 1) {
            if (document.getElementById(`cross${row}${right}`)) {
                document.getElementById(`cross${row}${right}`).style.color = 'aqua';
                document.getElementById(`cross${row}${right}`).style.fontSize = '3.5rem';
            }
            right += 1;
        }

        if (left < 0 && right > size - 1) clearInterval(interval);
    }, [100]);


}

// changes the color of crosses if column is complete
const colComplete = (row, col, size) => {
    // console.log('col', col, 'complete');

    let up = row;
    let down = row;

    let interval = setInterval(() => {
        if (up >= 0) {
            if (document.getElementById(`cross${up}${col}`)) {
                document.getElementById(`cross${up}${col}`).style.color = 'aqua';
                document.getElementById(`cross${up}${col}`).style.fontSize = '3.5rem';
            }
            up -= 1;
        }
        if (down <= size - 1) {
            if (document.getElementById(`cross${down}${col}`)) {
                document.getElementById(`cross${down}${col}`).style.color = 'aqua';
                document.getElementById(`cross${down}${col}`).style.fontSize = '3.5rem';
            }
            down += 1;
        }

        if (up < 0 && down > size - 1) clearInterval(interval);
    }, [100]);
}

// changes the color of cross if primary diagonal is complete
const primaryDiagComplete = (row, col, size) => {
    // console.log('primary diag complete');

    let d1 = row;
    let d2 = row;

    let interval = setInterval(() => {
        if (d1 >= 0) {
            if (document.getElementById(`cross${d1}${d1}`)) {
                document.getElementById(`cross${d1}${d1}`).style.color = 'aqua';
                document.getElementById(`cross${d1}${d1}`).style.fontSize = '3.5rem';
            }
            d1 -= 1;
        }
        if (d2 <= size - 1) {
            if (document.getElementById(`cross${d2}${d2}`)) {
                document.getElementById(`cross${d2}${d2}`).style.color = 'aqua';
                document.getElementById(`cross${d2}${d2}`).style.fontSize = '3.5rem';
            }
            d2 += 1;
        }

        if (d1 < 0 && d2 > size - 1) clearInterval(interval);
    }, [100]);
}

const secDiagComplete = (row, col, size) => {

    let d1 = row;
    let d2 = row;

    let interval = setInterval(() => {
        if (d1 >= 0) {
            if (document.getElementById(`cross${d1}${size - 1 - d1}`)) {
                document.getElementById(`cross${d1}${size - 1 - d1}`).style.color = 'aqua';
                document.getElementById(`cross${d1}${size - 1 - d1}`).style.fontSize = '3.5rem';
            }
            d1 -= 1;
        }
        if (d2 <= size - 1) {
            if (document.getElementById(`cross${d2}${size - 1 - d2}`)) {
                document.getElementById(`cross${d2}${size - 1 - d2}`).style.color = 'aqua';
                document.getElementById(`cross${d2}${size - 1 - d2}`).style.fontSize = '3.5rem';
            }
            d2 += 1;
        }

        if (d1 < 0 && d2 > size - 1) clearInterval(interval);
    }, [100]);
}

const checkBingo = (row, col, size) => {
    console.log('checking bingo', row, col);
    let count = 0;
    // checking row
    let i;
    for (i = 0; i < size; i++) {
        if (!check[row][i])
            break;
    }
    if (i === size) {
        rowComplete(row, col, size);
        count++;
    }

    // checking column
    for (i = 0; i < size; i++) {
        if (!check[i][col])
            break;
    }
    if (i === size) {
        colComplete(row, col, size);
        count++;
    }

    // checking for diagonals
    if (row === col) { // primary diagonal
        for (i = 0; i < size; i++) {
            if (!check[i][i]) break;
        }
        if (i === size) {
            primaryDiagComplete(row, col, size);
            count++;
        }
    }

    if (row + col === size - 1) {
        for (i = 0; i < size; i++) {
            if (!check[i][size - 1 - i]) break;
        }
        if (i === size) {
            secDiagComplete(row, col, size);
            count++;
        }
    }

    return count;
}

export { checkBingo, check, resetCheck }