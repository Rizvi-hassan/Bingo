import { React, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { checkBingo, check } from '../CheckBingo.mjs'

const Grid_5 = (props) => {
    const [count, setCount] = useState(1);
    const [grid, setGrid] = useState([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]);


    const [borderColor, setBorderColor] = useState('#023047')
    const { clickedNo, ready, no, myTurn, setBingo, bingo } = props;


    const handleClick = (row, col) => {
        if (grid[row][col] === 0) {
            if (count === 25) {
                setBorderColor('#219EBC')
                props.setPlayer()
            }
            let newGrid = grid;
            newGrid[row][col] = count;
            setCount(count => count + 1);
            setGrid(newGrid);
        } else {
            if (ready) {
                if (myTurn || grid[row][col] === no) {
                    clickedNo(grid[row][col])
                    document.getElementById(`cross${row}${col}`).style.display = 'inline-flex';
                    check[row][col] = true;
                    let count = checkBingo(row, col, 5);
                    setBingo(bingo => bingo+count)
                }
            }
        }

    }


    const renderCross = (val) => {
        return (
            <span style={{ position: 'absolute', color: '#ff00009c', display: 'none', fontSize: '2.5rem', alignItems: 'center', justifyContent: 'center', transition:'font-size 200ms ease, color 200ms ease'}} id={val} >
                <FontAwesomeIcon icon={faXmark} />
            </span>
        )
    }


    let grid_style = {
        'border': `5px solid ${borderColor}`,
        'backgroundColor': 'beige',
        'display': 'grid',
        'gridTemplateRows': '1fr 1fr 1fr 1fr 1fr',
        'gridTemplateColumns': '1fr 1fr 1fr 1fr 1fr',
        'height': '100%'
    }

    let box_style = {
        'border': '1px solid #8ECAE6',
        'fontSize': '1.5rem',
        'textAlign': 'center',
        'lineHeight': '2.4',
        'fontFamily': `"Orbitron", sans-serif`,
        'display': 'inline-flex',
        'justifyContent': 'center',
        'alignItems': 'center'
    }
    return (
        <div style={grid_style}>
            <div style={box_style} onClick={() => handleClick(0, 0)} >{grid[0][0] === 0 ? ' ' : grid[0][0]} {renderCross('cross00')} </div>
            <div style={box_style} onClick={() => handleClick(0, 1)} >{grid[0][1] === 0 ? ' ' : grid[0][1]} {renderCross('cross01')} </div>
            <div style={box_style} onClick={() => handleClick(0, 2)} >{grid[0][2] === 0 ? ' ' : grid[0][2]} {renderCross('cross02')} </div>
            <div style={box_style} onClick={() => handleClick(0, 3)} >{grid[0][3] === 0 ? ' ' : grid[0][3]} {renderCross('cross03')} </div>
            <div style={box_style} onClick={() => handleClick(0, 4)} >{grid[0][4] === 0 ? ' ' : grid[0][4]} {renderCross('cross04')} </div>

            <div style={box_style} onClick={() => handleClick(1, 0)} >{grid[1][0] === 0 ? ' ' : grid[1][0]} {renderCross('cross10')} </div>
            <div style={box_style} onClick={() => handleClick(1, 1)} >{grid[1][1] === 0 ? ' ' : grid[1][1]} {renderCross('cross11')} </div>
            <div style={box_style} onClick={() => handleClick(1, 2)} >{grid[1][2] === 0 ? ' ' : grid[1][2]} {renderCross('cross12')} </div>
            <div style={box_style} onClick={() => handleClick(1, 3)} >{grid[1][3] === 0 ? ' ' : grid[1][3]} {renderCross('cross13')} </div>
            <div style={box_style} onClick={() => handleClick(1, 4)} >{grid[1][4] === 0 ? ' ' : grid[1][4]} {renderCross('cross14')} </div>

            <div style={box_style} onClick={() => handleClick(2, 0)} >{grid[2][0] === 0 ? ' ' : grid[2][0]} {renderCross('cross20')} </div>
            <div style={box_style} onClick={() => handleClick(2, 1)} >{grid[2][1] === 0 ? ' ' : grid[2][1]} {renderCross('cross21')} </div>
            <div style={box_style} onClick={() => handleClick(2, 2)} >{grid[2][2] === 0 ? ' ' : grid[2][2]} {renderCross('cross22')} </div>
            <div style={box_style} onClick={() => handleClick(2, 3)} >{grid[2][3] === 0 ? ' ' : grid[2][3]} {renderCross('cross23')} </div>
            <div style={box_style} onClick={() => handleClick(2, 4)} >{grid[2][4] === 0 ? ' ' : grid[2][4]} {renderCross('cross24')} </div>

            <div style={box_style} onClick={() => handleClick(3, 0)} >{grid[3][0] === 0 ? ' ' : grid[3][0]} {renderCross('cross30')} </div>
            <div style={box_style} onClick={() => handleClick(3, 1)} >{grid[3][1] === 0 ? ' ' : grid[3][1]} {renderCross('cross31')} </div>
            <div style={box_style} onClick={() => handleClick(3, 2)} >{grid[3][2] === 0 ? ' ' : grid[3][2]} {renderCross('cross32')} </div>
            <div style={box_style} onClick={() => handleClick(3, 3)} >{grid[3][3] === 0 ? ' ' : grid[3][3]} {renderCross('cross33')} </div>
            <div style={box_style} onClick={() => handleClick(3, 4)} >{grid[3][4] === 0 ? ' ' : grid[3][4]} {renderCross('cross34')} </div>

            <div style={box_style} onClick={() => handleClick(4, 0)} >{grid[4][0] === 0 ? ' ' : grid[4][0]} {renderCross('cross40')} </div>
            <div style={box_style} onClick={() => handleClick(4, 1)} >{grid[4][1] === 0 ? ' ' : grid[4][1]} {renderCross('cross41')} </div>
            <div style={box_style} onClick={() => handleClick(4, 2)} >{grid[4][2] === 0 ? ' ' : grid[4][2]} {renderCross('cross42')} </div>
            <div style={box_style} onClick={() => handleClick(4, 3)} >{grid[4][3] === 0 ? ' ' : grid[4][3]} {renderCross('cross43')} </div>
            <div style={box_style} onClick={() => handleClick(4, 4)} >{grid[4][4] === 0 ? ' ' : grid[4][4]} {renderCross('cross44')} </div>

        </div>
    )
}

export default Grid_5